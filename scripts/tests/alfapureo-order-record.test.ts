import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// alfapureo-order writes the outcome of every forwarding to alfapureo_forwarding (sample overview).
// The Deno edge function runs here; Alfapureo, the database and e-mail are fakes.
const imported: string[] = [];
const index = readFileSync(new URL('../../supabase/functions/alfapureo-order/index.ts', import.meta.url), 'utf8')
  .replace(/^import \{ ([^}]+) \} from '([^']+)';\n/gm, (_, names: string) => {
    imported.push(...names.split(', '));
    return '';
  });
const code = ts.transpileModule(index, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;

const WEBHOOK_SECRET = 'shopify-webhook-secret';
const sampleOrder = { id: 8481964425562, name: 'ORO-1014', financial_status: 'paid', note_attributes: [{ name: '_orostone_flow', value: 'samples' }] };

async function run(order: unknown, { replies = [200] as Array<number | 'offline'>, signature = 'valid', dbError = null as string | null } = {}) {
  let handler!: (request: Request) => Promise<Response>;
  const tasks: Promise<unknown>[] = [];
  const upserts: Array<{ row: Record<string, unknown>; options: unknown }> = [];
  const mail: string[] = [];
  let calls = 0;
  const env: Record<string, string> = {
    SHOPIFY_WEBHOOK_SECRET: WEBHOOK_SECRET, ALFAPUREO_ORDER_URL: 'https://alfapureo.example/objednavka', ALFAPUREO_SECRET: 'alfa',
    SUPABASE_URL: 'https://db.example', SUPABASE_SERVICE_ROLE_KEY: 'service-test',
  };
  const stubs = {
    serve: (fn: typeof handler) => { handler = fn; },
    createClient: () => ({
      from: (table: string) => {
        assert.equal(table, 'alfapureo_forwarding');
        return { upsert: async (row: Record<string, unknown>, options: unknown) => { upserts.push({ row, options }); return { error: dbError ? { message: dbError } : null }; } };
      },
    }),
    isServiceRole: () => false,
    sendEmail: async (opts: { subject: string }) => { mail.push(opts.subject); return { ok: true }; },
    escapeHtml: (input: unknown) => String(input),
  };
  assert.deepEqual([...imported].sort(), Object.keys(stubs).sort(), 'every import of index.ts needs a stub');
  runInNewContext(code, {
    ...stubs,
    Deno: { env: { get: (key: string) => env[key] } },
    EdgeRuntime: { waitUntil: (p: Promise<unknown>) => tasks.push(p) },
    setTimeout: (fn: () => void) => { fn(); return 0; },
    // The host's Error, so `err instanceof Error` sees errors from the fake fetch as in Deno.
    Request, Response, AbortSignal, TextEncoder, TextDecoder, crypto, btoa, Error,
    console: { log: () => {}, error: () => {}, warn: () => {} },
    fetch: async (url: string) => {
      assert.equal(url, 'https://alfapureo.example/objednavka');
      const reply = replies[Math.min(calls++, replies.length - 1)];
      if (reply === 'offline') throw new Error('signal timed out');
      return new Response('OK', { status: reply });
    },
  });
  const body = JSON.stringify(order);
  const hmac = signature === 'valid' ? createHmac('sha256', WEBHOOK_SECRET).update(body).digest('base64') : 'bad';
  const res = await handler(new Request('https://db.example/functions/v1/alfapureo-order', { method: 'POST', headers: { 'x-shopify-hmac-sha256': hmac }, body }));
  await Promise.all(tasks);
  return { status: res.status, upserts, mail, calls };
}

test('a delivered order is recorded with forwarded_at', async () => {
  const r = await run(sampleOrder);
  assert.equal(r.status, 200);
  assert.equal(r.upserts.length, 1);
  const { row, options } = r.upserts[0];
  assert.equal(JSON.stringify(options), JSON.stringify({ onConflict: 'order_id' }));
  assert.equal(row.order_id, 8481964425562);
  assert.equal(row.order_name, 'ORO-1014');
  assert.equal(row.last_http_status, 200);
  assert.equal(row.last_attempts, 1);
  assert.equal(row.last_error, null);
  assert.equal(row.forwarded_at, row.last_attempt_at);
});

test('a rejected order is recorded without forwarded_at, so an earlier success stays', async () => {
  const r = await run(sampleOrder, { replies: [503] });
  assert.equal(r.calls, 3);
  assert.equal(r.upserts.length, 1);
  const { row } = r.upserts[0];
  assert.equal('forwarded_at' in row, false);
  assert.equal(row.last_http_status, 503);
  assert.equal(row.last_attempts, 3);
  assert.equal(r.mail.length, 1, 'the existing failure e-mail still goes out');
});

test('a connection error is recorded with its message', async () => {
  const r = await run(sampleOrder, { replies: ['offline', 'offline', 'offline'] });
  const { row } = r.upserts[0];
  assert.equal(row.last_http_status, null);
  assert.equal(row.last_error, 'signal timed out');
  assert.equal('forwarded_at' in row, false);
});

test('a retry that succeeds is recorded as delivered', async () => {
  const r = await run(sampleOrder, { replies: [502, 200] });
  assert.equal(r.calls, 2);
  assert.equal(r.upserts[0].row.last_attempts, 2);
  assert.ok(r.upserts[0].row.forwarded_at);
});

test('slab orders and unsigned requests are not recorded', async () => {
  assert.deepEqual((await run({ ...sampleOrder, note_attributes: [] })).upserts, []);
  const unsigned = await run(sampleOrder, { signature: 'bad' });
  assert.equal(unsigned.status, 401);
  assert.deepEqual(unsigned.upserts, []);
});

test('a database error does not affect forwarding', async () => {
  const r = await run(sampleOrder, { dbError: 'relation "alfapureo_forwarding" does not exist' });
  assert.equal(r.status, 200);
  assert.equal(r.calls, 1);
  assert.equal(r.mail.length, 0);
});
