import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { Readable } from 'node:stream';
import test from 'node:test';
import handler from '../../api/shopify-order-webhook';

const secret = 'test-webhook-secret-not-a-credential';
const order = JSON.stringify({ id: 123, name: '#123', total_price: '2340.00', currency: 'EUR', line_items: [] });
const sign = (raw: string) => createHmac('sha256', secret).update(raw).digest('base64');

function request(method = 'POST', raw = order, signature: string | undefined = sign(raw)) {
  const input = Readable.from([Buffer.from(raw)]) as any;
  input.method = method;
  input.headers = {
    'content-type': 'application/json',
    'content-length': String(Buffer.byteLength(raw)),
    ...(signature === undefined ? {} : { 'x-shopify-hmac-sha256': signature }),
  };
  return input;
}
async function invoke(input: any) {
  const result = { status: 0, body: null as any };
  const response: any = {
    status(code: number) { result.status = code; return response; },
    json(body: any) { result.body = body; return response; },
  };
  await handler(input, response);
  return result;
}
function isolate(t: any) {
  const keys = ['SHOPIFY_WEBHOOK_SECRET', 'GA4_MEASUREMENT_ID', 'GA4_MP_API_SECRET', 'GA4_LEGACY_PURCHASE_ENABLED'];
  const saved = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  const savedFetch = globalThis.fetch;
  keys.forEach(key => delete process.env[key]);
  process.env.SHOPIFY_WEBHOOK_SECRET = secret;
  let requests = 0;
  globalThis.fetch = async () => { requests++; throw new Error('Unexpected outbound purchase'); };
  t.after(() => {
    keys.forEach(key => saved[key] === undefined ? delete process.env[key] : process.env[key] = saved[key]);
    globalThis.fetch = savedFetch;
  });
  return () => requests;
}

test('authenticated orders-paid is acknowledged without GA secrets or outbound purchase by default', async t => {
  const requests = isolate(t);
  for (const flag of [undefined, 'false', 'TRUE', '1', 'true ']) {
    if (flag === undefined) delete process.env.GA4_LEGACY_PURCHASE_ENABLED;
    else process.env.GA4_LEGACY_PURCHASE_ENABLED = flag;
    const result = await invoke(request());
    assert.equal(result.status, 200);
    assert.deepEqual(result.body, { ok: true, purchaseTracking: 'shopify_google_channel' });
  }
  assert.equal(requests(), 0);
});

test('disabled purchase tracking still rejects wrong methods and missing or bad HMAC', async t => {
  const requests = isolate(t);
  assert.equal((await invoke(request('GET'))).status, 405);
  const missing = request();
  delete missing.headers['x-shopify-hmac-sha256'];
  assert.equal((await invoke(missing)).status, 401);
  assert.equal((await invoke(request('POST', order, 'invalid'))).status, 401);
  const changed = order.replace('2340.00', '1.00');
  assert.equal((await invoke(request('POST', changed, sign(order)))).status, 401);
  assert.equal(requests(), 0);
});

test('authenticated malformed data remains bounded and cannot trigger outbound tracking', async t => {
  const requests = isolate(t);
  const result = await invoke(request('POST', '{invalid-json'));
  assert.equal(result.status, 200);
  assert.equal(result.body.reason, 'unparseable');
  assert.equal(requests(), 0);
});

test('explicit legacy fallback without credentials is acknowledged safely, without outbound tracking', async t => {
  const requests = isolate(t);
  process.env.GA4_LEGACY_PURCHASE_ENABLED = 'true';
  const result = await invoke(request());
  assert.equal(result.status, 200);
  assert.equal(result.body.reason, 'legacy_tracking_unconfigured');
  assert.equal(requests(), 0);
  assert.doesNotMatch(JSON.stringify(result.body), /test-webhook-secret/);
});
