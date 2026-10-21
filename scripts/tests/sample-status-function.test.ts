import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// The Deno edge function sample-status runs here with its real status.ts; Shopify, the database
// and Resend are fakes. Same harness as newsletter-unsubscribes.test.ts.
const read = (path: string) => readFileSync(new URL(`../../supabase/functions/${path}`, import.meta.url), 'utf8');
const imported: string[] = [];
const status = read('sample-status/status.ts').replace(/^export /gm, '');
const index = read('sample-status/index.ts')
  .replace(/^import (?:type )?\{ ([^}]+) \} from '([^']+)';\n/gm, (_, names: string, from: string) => {
    if (!from.endsWith('/status.ts')) imported.push(...names.split(', '));
    return '';
  });
const code = ts.transpileModule(`${status}\n${index}`, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;

const SECRET_KEY = 'sb_secret_test';
const STATUS_KEY = 'crm-status-key';
const URL_ = 'https://db.example/functions/v1/sample-status';

const shopifyOrder = (name: string, id: string, createdAt: string, extra: Record<string, unknown> = {}) => ({
  legacyResourceId: id, name, createdAt, displayFinancialStatus: 'PAID', cancelledAt: null,
  customAttributes: [{ key: '_orostone_flow', value: 'samples' }],
  lineItems: { nodes: [{ customAttributes: [{ key: 'Vzorka 1', value: 'TAJ MAHAL' }] }] },
  fulfillments: [],
  ...extra,
});

async function run(request: Request, { orders = [] as unknown[], rows = [] as unknown[], shopifyStatus = 200, env: envOverride = {} as Record<string, string> } = {}) {
  let handler!: (request: Request) => Promise<Response>;
  const mail: { to: string; subject: string; html: string; idempotencyKey?: string }[] = [];
  const shopify: string[] = [];
  const env: Record<string, string> = {
    SUPABASE_URL: 'https://db.example', SUPABASE_SERVICE_ROLE_KEY: 'service-test', SAMPLE_STATUS_KEY: STATUS_KEY,
    SHOPIFY_CLIENT_ID: 'client', SHOPIFY_CLIENT_SECRET: 'secret', ...envOverride,
  };
  const db = {
    from: (table: string) => {
      assert.equal(table, 'alfapureo_forwarding');
      const query = { select: () => query, in: () => Promise.resolve({ data: rows, error: null }) };
      return query;
    },
  };
  const stubs = {
    serve: (fn: typeof handler) => { handler = fn; },
    createClient: () => db,
    isServiceRole: (req: Request) => req.headers.get('apikey') === SECRET_KEY,
    escapeHtml: (input: unknown) => String(input),
    sendEmail: async (opts: { to: string; subject: string; html: string }) => { mail.push(opts); return { ok: true }; },
  };
  assert.deepEqual([...imported].sort(), Object.keys(stubs).sort(), 'every import of index.ts except status.ts needs a stub');
  runInNewContext(code, {
    ...stubs,
    Deno: { env: { get: (key: string) => env[key] } },
    Request, Response, AbortSignal, TextEncoder, URLSearchParams,
    console: { log: () => {}, error: () => {}, warn: () => {} },
    fetch: async (url: string) => {
      shopify.push(new URL(url).pathname);
      if (url.endsWith('/admin/oauth/access_token')) return Response.json({ access_token: 'token' });
      if (url.includes('/graphql.json')) {
        if (shopifyStatus !== 200) return Response.json({ errors: 'boom' }, { status: shopifyStatus });
        return Response.json({ data: { orders: { pageInfo: { hasNextPage: false, endCursor: null }, nodes: orders } } });
      }
      throw new Error(`Unexpected request: ${url}`);
    },
  });
  const res = await handler(request);
  return { status: res.status, body: await res.json(), mail, shopify };
}

const crm = (key = STATUS_KEY) => new Request(URL_, { headers: { 'x-sample-status-key': key } });
const cron = (body: unknown = { alert: true }) => new Request(URL_, { method: 'POST', headers: { apikey: SECRET_KEY }, body: JSON.stringify(body) });

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

test('without the CRM key or the project secret: 401 and no Shopify call', async () => {
  for (const req of [new Request(URL_), crm('wrong'), crm(''), new Request(URL_, { headers: { apikey: 'sb_publishable_x' } })]) {
    const r = await run(req);
    assert.equal(r.status, 401);
    assert.deepEqual(r.shopify, []);
  }
  // An unset SAMPLE_STATUS_KEY must not let an empty header through.
  const r = await run(crm(''), { env: { SAMPLE_STATUS_KEY: '' } });
  assert.equal(r.status, 401);
});

test('CRM gets every sample order with its stage and never triggers an email', async () => {
  const orders = [
    shopifyOrder('ORO-1016', '3', hoursAgo(5)),
    shopifyOrder('ORO-1015', '2', hoursAgo(30)),
    { ...shopifyOrder('ORO-2000', '9', hoursAgo(30)), customAttributes: [] },
  ];
  const rows = [{ order_id: 2, forwarded_at: hoursAgo(29), last_attempt_at: hoursAgo(29), last_http_status: 200, last_attempts: 1, last_error: null }];
  const r = await run(crm(), { orders, rows });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.deepEqual(r.body.orders.map((o: { order: string; stage: string }) => [o.order, o.stage]), [['ORO-1016', 'not_forwarded'], ['ORO-1015', 'at_alfapureo']]);
  assert.equal(r.body.stuck, 1);
  assert.equal(r.mail.length, 0);
  // Only the order number, decors, times and tracking leave the function.
  assert.deepEqual(Object.keys(r.body.orders[0]).sort(), ['adminUrl', 'alfapureo', 'deliveredAt', 'order', 'orderedAt', 'samples', 'shipped', 'stage', 'stuck']);
});

test('the morning check emails info@ once when an order is stuck, and stays quiet otherwise', async () => {
  const stuck = await run(cron(), { orders: [shopifyOrder('ORO-1014', '1', hoursAgo(50))] });
  assert.equal(stuck.status, 200, JSON.stringify(stuck.body));
  assert.equal(stuck.mail.length, 1);
  assert.equal(stuck.mail[0].to, 'info@orostone.sk');
  assert.equal(stuck.mail[0].subject, 'Vzorky: ORO-1014 viazne');
  assert.match(stuck.mail[0].html, /Nedorazila do Alfapurea/);
  assert.match(stuck.mail[0].html, /crm\.orostone\.sk\/admin\/vzorky/);
  assert.match(stuck.mail[0].idempotencyKey ?? '', /^sample-status-alert-\d{4}-\d{2}-\d{2}-ORO-1014$/);

  const fine = await run(cron(), { orders: [shopifyOrder('ORO-1016', '3', hoursAgo(0.1))] });
  assert.equal(fine.status, 200);
  assert.equal(fine.mail.length, 0);

  const noAlertFlag = await run(cron({}), { orders: [shopifyOrder('ORO-1014', '1', hoursAgo(50))] });
  assert.equal(noAlertFlag.mail.length, 0);
});

test('a Shopify failure is a 502 without an email, so the workflow turns red', async () => {
  const r = await run(cron(), { shopifyStatus: 500 });
  assert.equal(r.status, 502);
  assert.equal(r.body.success, false);
  assert.equal(r.mail.length, 0);
});
