import assert from 'node:assert/strict';
import test from 'node:test';
import { trackGA4Event, trackGA4Purchase } from '../../services/analytics';

test('analytics helpers never queue events without a confirmed current choice', t => {
  const calls: unknown[][] = [];
  let saved: string | null = null;
  const host: any = {
    _GA_ESHOP_ID: 'G-TEST',
    gtag: (...args: unknown[]) => calls.push(args),
    localStorage: { getItem: () => saved },
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: host });
  t.after(() => Reflect.deleteProperty(globalThis, 'window'));

  for (saved of [null, '', 'invalid', 'null', '[]', 'true', '{}', '{"analytics":"true"}', '{"analytics":false}']) {
    trackGA4Event('view_item', { value: 2340 });
  }
  assert.deepEqual(calls, []);
  saved = JSON.stringify({ necessary: true, analytics: true, marketing: false, consentedAt: new Date().toISOString() });
  trackGA4Event('view_item', { value: 2340 });
  assert.deepEqual(calls, [['event', 'view_item', { send_to: 'G-TEST', value: 2340 }]]);
  assert.equal(calls.length, 1, 'granting consent does not replay earlier events');

  host['ga-disable-G-TEST'] = true;
  trackGA4Event('add_to_cart', { value: 2340 });
  assert.equal(calls.length, 1, 'withdrawal wins over stale saved consent');
  host['ga-disable-G-TEST'] = false;
  host.localStorage.getItem = () => { throw new Error('Storage blocked'); };
  assert.doesNotThrow(() => trackGA4Event('view_item', {}));
  assert.equal(calls.length, 1);
});

test('generic client helpers cannot manufacture a purchase even with analytics consent', t => {
  const calls: unknown[][] = [];
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    _GA_ESHOP_ID: 'G-TEST', gtag: (...args: unknown[]) => calls.push(args),
    localStorage: { getItem: () => '{"analytics":true}' },
  } });
  t.after(() => Reflect.deleteProperty(globalThis, 'window'));
  trackGA4Event('purchase', { transaction_id: 'unverified-client-value', value: 2340 });
  trackGA4Purchase({ transaction_id: 'unverified-client-value', value: 2340, items: [{ item_id: 'eva' }] });
  assert.deepEqual(calls, []);
});
