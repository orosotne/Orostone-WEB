import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// The Deno edge function runs here together with the real _shared/klaviyo.ts (its requests go to the
// fake Klaviyo below); its other imports are replaced by the stubs below. All addresses are fake.
const read = (path: string) => readFileSync(new URL(`../../supabase/functions/${path}`, import.meta.url), 'utf8');
const imported: string[] = [];
const klaviyo = read('_shared/klaviyo.ts').replace(/^export /gm, '');
const index = read('sync-newsletter-unsubscribes/index.ts')
  .replace(/^import \{ ([^}]+) \} from '([^']+)';\n/gm, (_, names: string, from: string) => {
    if (!from.endsWith('/_shared/klaviyo.ts')) imported.push(...names.split(', '));
    return '';
  });
const code = ts.transpileModule(`${klaviyo}\n${index}`, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;

const SECRET_KEY = 'sb_secret_test';
const LIST_ID = 'LIST123';
/** Klaviyo's limit for any(email, …) on GET lists/{id}/profiles (more → 400, verified 19. 10. 2026). */
const LIST_FILTER_MAX = 20;

const emails = (n: number) => Array.from({ length: n }, (_, i) => `odber-${i + 1}@example.com`);

type Row = { id: string; email: string; klaviyo_attempted_at: string; klaviyo_checked_at: string | null };

// Every active row is also a pending signup (attempted two hours ago, never checked).
function fakeSupabase(rows: Row[]) {
  const checked: string[] = [];
  const deleted: string[] = [];
  const from = () => {
    let op = 'select';
    let ids: string[] = [];
    let range = [0, Infinity];
    const query = {
      select: () => query, eq: () => query, lt: () => query, order: () => query,
      range: (start: number, end: number) => { range = [start, end]; return query; },
      in: (_column: string, values: string[]) => { ids = values; return query; },
      delete: () => { op = 'delete'; return query; },
      update: () => { op = 'update'; return query; },
      then: (resolve: (result: unknown) => void) => {
        if (op === 'select') return resolve({ data: rows.slice(range[0], range[1] + 1), error: null });
        (op === 'update' ? checked : deleted).push(...ids);
        return resolve({ data: null, error: null, count: 0 });
      },
    };
    return query;
  };
  return { client: { from }, checked, deleted };
}

const profile = (email: string) => ({ attributes: { email, subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } } } });

async function run(addresses: string[], { missingFromList = [] as string[], listStatus = 200 } = {}) {
  let handler!: (request: Request) => Promise<Response>;
  const requests: { path: string; emails: string[] }[] = [];
  const mail: { to: string; html: string }[] = [];
  const logs: string[] = [];
  const attempted = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const db = fakeSupabase(addresses.map((email, i) => ({ id: `row-${i + 1}`, email, klaviyo_attempted_at: attempted, klaviyo_checked_at: null })));
  const env: Record<string, string> = { KLAVIYO_NEWSLETTER_LIST_ID: LIST_ID, KLAVIYO_PRIVATE_API_KEY: 'pk_test', SUPABASE_URL: 'https://db.example', SUPABASE_SERVICE_ROLE_KEY: 'service-test' };
  const stubs = {
    serve: (fn: typeof handler) => { handler = fn; },
    createClient: () => db.client,
    isServiceRole: (req: Request) => req.headers.get('apikey') === SECRET_KEY,
    json: (body: unknown, status = 200) => Response.json(body, { status }),
    preflight: () => new Response(null, { status: 204 }),
    escapeHtml: (input: unknown) => String(input),
    sendEmail: async (opts: { to: string; html: string }) => { mail.push(opts); return { ok: true }; },
  };
  assert.deepEqual([...imported].sort(), Object.keys(stubs).sort(), 'every import of index.ts except _shared/klaviyo.ts needs a stub');
  runInNewContext(code, {
    ...stubs,
    Deno: { env: { get: (key: string) => env[key] } },
    Request, Response, AbortSignal, TextEncoder, crypto,
    console: { log: (...args: unknown[]) => logs.push(args.join(' ')), error: (...args: unknown[]) => logs.push(args.join(' ')), warn: () => {} },
    fetch: async (url: string) => {
      const { pathname, searchParams } = new URL(url);
      const filter = /^any\(email,(\[.*\])\)$/.exec(searchParams.get('filter') ?? '');
      if (!filter) throw new Error(`Unexpected Klaviyo filter: ${url}`);
      const path = pathname.replace(/^\/api\//, '');
      const values: string[] = JSON.parse(filter[1]);
      requests.push({ path, emails: values });
      if (path === 'profiles') return Response.json({ data: values.map(profile) });
      if (path === `lists/${LIST_ID}/profiles`) {
        // Like Klaviyo: the error detail repeats the filter, so it must never reach the log.
        if (values.length > LIST_FILTER_MAX || listStatus !== 200) {
          return Response.json({ errors: [{ code: 'invalid', detail: `Maximum number of filter values is 20: ${values.join(',')}` }] }, { status: listStatus === 200 ? 400 : listStatus });
        }
        return Response.json({ data: values.filter((e) => !missingFromList.includes(e)).map(profile) });
      }
      throw new Error(`Unexpected request: ${url}`);
    },
  });
  const res = await handler(new Request('https://db.example/functions/v1/sync-newsletter-unsubscribes', { method: 'POST', headers: { apikey: SECRET_KEY }, body: '{}' }));
  const lists = requests.filter((r) => r.path === `lists/${LIST_ID}/profiles`);
  const profiles = requests.filter((r) => r.path === 'profiles');
  return { status: res.status, body: await res.json(), lists, profiles, mail, logs, checked: db.checked };
}

test('checks pending signups in the list at most 20 addresses per request', async () => {
  const all = emails(53);
  const r = await run(all);
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.deepEqual(r.lists.map((l) => l.emails.length), [20, 20, 13]);
  assert.ok(r.lists.every((l) => l.emails.length <= LIST_FILTER_MAX));
  assert.deepEqual(r.lists.flatMap((l) => l.emails), all, 'every pending address is checked exactly once');
  assert.deepEqual(r.profiles.map((p) => p.emails.length), [50, 3], 'GET profiles keeps 50 per request');
  assert.equal(r.body.verified, 53);
  assert.equal(r.body.notSubscribed, 0);
  assert.equal(r.checked.length, 53);
  assert.equal(r.mail.length, 0);
});

test('reports addresses missing from the list in any chunk', async () => {
  const all = emails(45);
  const missing = [all[3], all[42]];
  const r = await run(all, { missingFromList: missing });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(r.body.notSubscribed, 2);
  assert.equal(r.mail.length, 1);
  assert.deepEqual(all.filter((e) => r.mail[0].html.includes(`<li>${e}</li>`)), missing);
  assert.equal(r.checked.length, 45);
});

test('a failed list request fails the run, marks nothing and logs no addresses', async () => {
  const r = await run(emails(25), { listStatus: 500 });
  assert.equal(r.status, 502);
  assert.equal(r.lists.length, 1, 'stops at the first failed request');
  assert.deepEqual(r.checked, []);
  assert.equal(r.mail.length, 0);
  assert.ok(!r.logs.some((line) => line.includes('@')), r.logs.join('\n'));
  assert.ok(!JSON.stringify(r.body).includes('@'));
});
