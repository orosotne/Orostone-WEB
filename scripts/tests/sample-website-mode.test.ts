import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// The Deno edge function runs here with its imports replaced by the stubs below.
const imported: string[] = [];
const source = readFileSync(new URL('../../supabase/functions/send-quote-notification/index.ts', import.meta.url), 'utf8')
  .replace(/^import \{ (\w+) \} from '[^']+';\n/gm, (_, name: string) => { imported.push(name); return ''; });
const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;

const SECRET_KEY = 'sb_secret_test';
const quote = { id: 'quote-1', customer_id: 'customer-1', project_type: 'Vzorka zadarmo (Shop)', decor: 'Calacatta', created_at: '2026-09-15T00:00:00Z' };
const customer = { id: 'customer-1', email: 'customer@example.com', name: 'Jana', phone: null, city: null };

async function run({ unified = true, failHandoff = false, headers = { apikey: SECRET_KEY } as Record<string, string> } = {}) {
  let handler!: (request: Request) => Promise<Response>;
  const handoffs: { quoteId: string; secret: string | undefined }[] = [];
  const requests: string[] = [];
  const mail: { to: string; subject: string }[] = [];
  const env: Record<string, string> = { UNIFIED_SAMPLE_CONFIRMATION: String(unified), SUPABASE_SERVICE_ROLE_KEY: 'service-test', RESEND_API_KEY: 'resend-test', SUPABASE_URL: 'https://db.example', SAMPLE_INGEST_SECRET: 'sample-test' };
  const stubs = {
    serve: (fn: typeof handler) => { handler = fn; },
    // Same contract as _shared/auth.ts: only the exact secret key in the apikey header passes.
    isServiceRole: (req: Request) => req.headers.get('apikey') === SECRET_KEY,
    handoffSample: async (q: { id: string }, _c: unknown, secret: string | undefined) => {
      handoffs.push({ quoteId: q.id, secret });
      if (failHandoff) throw new Error('offline');
    },
  };
  assert.deepEqual([...imported].sort(), Object.keys(stubs).sort(), 'every import of index.ts needs a stub');
  runInNewContext(code, {
    ...stubs,
    Deno: { env: { get: (key: string) => env[key] } },
    Request, Response, AbortSignal,
    console: { log: () => {}, error: () => {}, warn: () => {} },
    fetch: async (url: string, init?: RequestInit) => {
      requests.push(url);
      if (url.startsWith('https://db.example/rest/v1/quotes?')) return Response.json([quote]);
      if (url.startsWith('https://db.example/rest/v1/customers?')) return Response.json([customer]);
      if (url === 'https://api.resend.com/emails') { mail.push(JSON.parse(String(init?.body))); return Response.json({ id: 'mail-id' }); }
      throw new Error(`Unexpected external request: ${url}`);
    },
  });
  const result = await handler(new Request('https://db.example/functions/v1/send-quote-notification', { method: 'POST', headers, body: JSON.stringify({ quote_id: quote.id }) }));
  return { result, mail, handoffs, requests };
}

test('unified mode sends only an internal copy and hands off one customer confirmation', async () => {
  const r = await run();
  assert.equal(r.result.status, 200);
  assert.deepEqual(r.handoffs, [{ quoteId: quote.id, secret: 'sample-test' }]);
  assert.equal(r.mail.length, 1);
  assert.equal(r.mail[0].to, 'dopyt@orostone.sk');
  assert.ok(r.mail[0].subject.includes('[Orostone CRM vzorka v1]'), r.mail[0].subject);
});

test('never falls back to the old email after an uncertain handoff', async () => {
  const r = await run({ failHandoff: true });
  assert.equal(r.result.status, 500);
  assert.equal(r.handoffs.length, 1, 'the 500 must come from the handoff');
  assert.equal(r.mail.length, 0);
});

test('keeps current website behavior before activation', async () => {
  const r = await run({ unified: false });
  assert.equal(r.result.status, 200);
  assert.equal(r.handoffs.length, 0);
  assert.deepEqual(r.mail.map(m => m.to).sort(), ['customer@example.com', 'dopyt@orostone.sk']);
});

test('a request without the right apikey gets 401 before any data or email', async () => {
  for (const headers of [{}, { apikey: 'sb_publishable_test' }, { authorization: `Bearer ${SECRET_KEY}` }]) {
    const r = await run({ headers });
    assert.equal(r.result.status, 401, JSON.stringify(headers));
    assert.deepEqual(r.requests, []);
    assert.equal(r.handoffs.length, 0);
  }
});
