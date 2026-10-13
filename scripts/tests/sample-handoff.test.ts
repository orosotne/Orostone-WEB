import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';
import { handoffSample } from '../../supabase/functions/send-quote-notification/sample-handoff';

afterEach(() => mock.restoreAll());

const quote = { id: 'request-id', decor: 'Calacatta', created_at: '2026-09-15T10:00:00Z' };
const customer = { email: 'test@example.com', name: 'Jana', phone: null };
const respond = (ok: boolean, body: unknown = {}) =>
  async () => ({ ok, json: async () => body }) as unknown as Response;

test('hands off using a stable quote ID and server-only secret', async () => {
  const fetch = mock.method(globalThis, 'fetch', respond(true, { ok: true, lead_id: 'lead-id' }));
  await handoffSample(quote, customer, 'test-secret');
  assert.equal(fetch.mock.callCount(), 1);
  const [url, init] = fetch.mock.calls[0].arguments;
  assert.equal(url, 'https://crm.orostone.sk/api/sample-confirmation');
  assert.equal((init?.headers as Record<string, string>)['x-webhook-secret'], 'test-secret');
  assert.equal(init?.body, JSON.stringify({
    quote_id: quote.id, email: customer.email, name: customer.name,
    phone: '', decor: quote.decor, created_at: quote.created_at,
  }));
});

test('rejects a missing secret without calling CRM', async () => {
  const fetch = mock.method(globalThis, 'fetch', respond(true, { ok: true, lead_id: 'lead-id' }));
  await assert.rejects(handoffSample(quote, customer, undefined), /SAMPLE_INGEST_SECRET/);
  assert.equal(fetch.mock.callCount(), 0);
});

test('rejects an HTTP failure even when its body looks confirmed', async () => {
  mock.method(globalThis, 'fetch', respond(false, { ok: true, lead_id: 'lead-id' }));
  await assert.rejects(handoffSample(quote, customer, 'test'));
});

test('rejects a response that does not confirm {ok: true, lead_id}', async () => {
  for (const body of [{ ok: false }, { ok: true }, { lead_id: 'lead-id' }]) {
    mock.method(globalThis, 'fetch', respond(true, body));
    await assert.rejects(handoffSample(quote, customer, 'test'), Error, JSON.stringify(body));
    mock.restoreAll();
  }
});
