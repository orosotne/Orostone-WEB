import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addWorkdays,
  isSampleOrder,
  sampleStatus,
  type Forwarding,
  type ShopifyOrder,
} from '../../supabase/functions/sample-status/status';

const SHOP = 'shop.myshopify.com';

// Shape of a real sample order (ORO-1014) from the Admin API, without the customer.
function order(overrides: Partial<ShopifyOrder> = {}): ShopifyOrder {
  return {
    legacyResourceId: '8481964425562',
    name: 'ORO-1014',
    createdAt: '2026-10-20T08:00:00Z',
    displayFinancialStatus: 'PAID',
    cancelledAt: null,
    customAttributes: [{ key: '_orostone_flow', value: 'samples' }],
    lineItems: { nodes: [{ customAttributes: [
      { key: 'Počet vzoriek', value: '2' },
      { key: 'Vzorka 2', value: 'APPENNINO' },
      { key: '_sample_code_2', value: 'MN203D321612' },
      { key: 'Vzorka 1', value: 'SUPER WHITE EXTRA' },
      { key: '_sample_code_1', value: 'MN257F321612' },
    ] }] },
    transactions: [{ kind: 'SALE', status: 'SUCCESS', processedAt: '2026-10-20T07:59:55Z' }],
    fulfillments: [],
    ...overrides,
  };
}

const forwarded = (at: string): Forwarding => ({
  order_id: 8481964425562, forwarded_at: at, last_attempt_at: at, last_http_status: 200, last_attempts: 1, last_error: null,
});

test('recognises only sample orders', () => {
  assert.equal(isSampleOrder(order()), true);
  assert.equal(isSampleOrder(order({ customAttributes: [] })), false);
  assert.equal(isSampleOrder(order({ customAttributes: [{ key: '_orostone_flow', value: 'slabs' }] })), false);
});

test('lists decors in sample order and links the order in Shopify admin', () => {
  const status = sampleStatus(order(), undefined, new Date('2026-10-20T08:10:00Z'), SHOP);
  assert.deepEqual(status.samples, ['SUPER WHITE EXTRA', 'APPENNINO']);
  assert.equal(status.adminUrl, 'https://shop.myshopify.com/admin/orders/8481964425562');
});

test('a paid order without a forwarding record is fine for 30 minutes, then stuck', () => {
  const fresh = sampleStatus(order(), undefined, new Date('2026-10-20T08:29:00Z'), SHOP);
  assert.equal(fresh.stage, 'not_forwarded');
  assert.equal(fresh.stuck, null);

  // ORO-1014 on 18–21 Oct 2026: Shopify's webhook was rejected (401), nothing was recorded.
  const late = sampleStatus(order(), undefined, new Date('2026-10-20T08:31:00Z'), SHOP);
  assert.equal(late.stage, 'not_forwarded');
  assert.match(late.stuck ?? '', /Nedorazila do Alfapurea/);
});

test('a failed forwarding is stuck at once and names the reply', () => {
  const failed: Forwarding = { ...forwarded('2026-10-20T08:01:00Z'), forwarded_at: null, last_http_status: 503, last_attempts: 3 };
  const status = sampleStatus(order(), failed, new Date('2026-10-20T08:05:00Z'), SHOP);
  assert.equal(status.stage, 'not_forwarded');
  assert.match(status.stuck ?? '', /HTTP 503, 3× pokus/);

  const offline: Forwarding = { ...failed, last_http_status: null, last_error: 'signal timed out' };
  assert.match(sampleStatus(order(), offline, new Date('2026-10-20T08:05:00Z'), SHOP).stuck ?? '', /signal timed out/);
});

test('at Alfapureo for two working days is fine, longer is stuck (weekend does not count)', () => {
  // Forwarded Friday 9:00 → deadline Tuesday 9:00.
  const friday = forwarded('2026-10-16T09:00:00Z');
  const monday = sampleStatus(order(), friday, new Date('2026-10-19T17:00:00Z'), SHOP);
  assert.equal(monday.stage, 'at_alfapureo');
  assert.equal(monday.stuck, null);
  assert.equal(monday.alfapureo?.forwardedAt, '2026-10-16T09:00:00Z');

  const wednesday = sampleStatus(order(), friday, new Date('2026-10-21T09:00:00Z'), SHOP);
  assert.equal(wednesday.stage, 'at_alfapureo');
  assert.match(wednesday.stuck ?? '', /čaká na odoslanie 5 d/);
});

test('shipped with GLS tracking, delivered when Shopify knows it', () => {
  const shipped = sampleStatus(order({ fulfillments: [{
    status: 'SUCCESS', createdAt: '2026-10-22T10:00:00Z', deliveredAt: null,
    trackingInfo: [{ number: '1234567890', url: 'https://gls-group.com/SK/sk/sledovanie-zasielok?match=1234567890' }],
  }] }), forwarded('2026-10-21T08:00:00Z'), new Date('2026-10-30T10:00:00Z'), SHOP);
  assert.equal(shipped.stage, 'shipped');
  assert.equal(shipped.stuck, null);
  assert.deepEqual(shipped.shipped, {
    at: '2026-10-22T10:00:00Z', trackingNumber: '1234567890', trackingUrl: 'https://gls-group.com/SK/sk/sledovanie-zasielok?match=1234567890',
  });

  const delivered = sampleStatus(order({ fulfillments: [{ status: 'SUCCESS', createdAt: '2026-10-22T10:00:00Z', deliveredAt: '2026-10-23T12:00:00Z', trackingInfo: [] }] }),
    undefined, new Date('2026-10-30T10:00:00Z'), SHOP);
  assert.equal(delivered.stage, 'delivered');
  assert.equal(delivered.deliveredAt, '2026-10-23T12:00:00Z');
});

test('orders shipped by hand before Alfapureo (ORO-1010 to 1013) are shipped, not stuck', () => {
  const status = sampleStatus(order({ fulfillments: [{ status: 'SUCCESS', createdAt: '2026-10-14T08:19:51Z', deliveredAt: null, trackingInfo: [] }] }),
    undefined, new Date('2026-10-21T10:00:00Z'), SHOP);
  assert.equal(status.stage, 'shipped');
  assert.equal(status.stuck, null);
  assert.deepEqual(status.shipped, { at: '2026-10-14T08:19:51Z', trackingNumber: null, trackingUrl: null });
  assert.equal(status.alfapureo, null);
});

test('a cancelled or failed fulfillment is not a shipment (order is still at Alfapureo)', () => {
  const failed = order({ fulfillments: [
    { status: 'CANCELLED', createdAt: '2026-10-19T10:00:00Z', deliveredAt: null, trackingInfo: [{ number: '111', url: 'https://gls.example/111' }] },
    { status: 'FAILURE', createdAt: '2026-10-19T11:00:00Z', deliveredAt: null, trackingInfo: [] },
  ] });
  const status = sampleStatus(failed, forwarded('2026-10-16T09:00:00Z'), new Date('2026-10-21T09:00:00Z'), SHOP);
  assert.equal(status.stage, 'at_alfapureo');
  assert.equal(status.shipped, null);
  assert.match(status.stuck ?? '', /čaká na odoslanie/);

  // A later successful fulfillment wins over the cancelled one.
  const reshipped = order({ fulfillments: [
    ...failed.fulfillments,
    { status: 'SUCCESS', createdAt: '2026-10-20T10:00:00Z', deliveredAt: null, trackingInfo: [{ number: '222', url: 'https://gls.example/222' }] },
  ] });
  const ok = sampleStatus(reshipped, forwarded('2026-10-16T09:00:00Z'), new Date('2026-10-21T09:00:00Z'), SHOP);
  assert.equal(ok.stage, 'shipped');
  assert.equal(ok.shipped?.trackingNumber, '222');
});

test('the 30-minute grace period starts at payment, not at order creation', () => {
  // Created as pending at 8:00, paid at 10:00: at 10:20 the payment webhook may still be on its way.
  const paidLater = order({ transactions: [
    { kind: 'AUTHORIZATION', status: 'SUCCESS', processedAt: '2026-10-20T08:00:00Z' },
    { kind: 'SALE', status: 'FAILURE', processedAt: '2026-10-20T08:01:00Z' },
    { kind: 'CAPTURE', status: 'SUCCESS', processedAt: '2026-10-20T10:00:00Z' },
  ] });
  assert.equal(sampleStatus(paidLater, undefined, new Date('2026-10-20T10:20:00Z'), SHOP).stuck, null);
  assert.match(sampleStatus(paidLater, undefined, new Date('2026-10-20T10:31:00Z'), SHOP).stuck ?? '', /Nedorazila do Alfapurea/);

  // Without a successful payment transaction the order creation time is used.
  const noTransactions = order({ transactions: [] });
  assert.match(sampleStatus(noTransactions, undefined, new Date('2026-10-20T08:31:00Z'), SHOP).stuck ?? '', /Nedorazila do Alfapurea/);
});

test('unpaid and cancelled orders are never stuck', () => {
  const now = new Date('2026-10-25T10:00:00Z');
  assert.deepEqual(
    [sampleStatus(order({ displayFinancialStatus: 'PENDING' }), undefined, now, SHOP)].map(s => [s.stage, s.stuck]),
    [['unpaid', null]],
  );
  for (const cancelled of [order({ cancelledAt: '2026-10-20T09:00:00Z' }), order({ displayFinancialStatus: 'REFUNDED' })]) {
    const s = sampleStatus(cancelled, undefined, now, SHOP);
    assert.deepEqual([s.stage, s.stuck], ['cancelled', null]);
  }
});

test('addWorkdays skips Saturday and Sunday', () => {
  assert.equal(addWorkdays(new Date('2026-10-16T09:00:00Z'), 2).toISOString(), '2026-10-20T09:00:00.000Z');
  assert.equal(addWorkdays(new Date('2026-10-20T09:00:00Z'), 2).toISOString(), '2026-10-22T09:00:00.000Z');
  assert.equal(addWorkdays(new Date('2026-10-17T09:00:00Z'), 1).toISOString(), '2026-10-19T09:00:00.000Z');
});
