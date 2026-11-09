import assert from 'node:assert/strict';
import test from 'node:test';
import { trackDiningTablesPromotionClick } from '../../services/diningTablesAnalytics';

test('no dining-table click is sent before a cookie choice or after analytics is rejected', (t) => {
  const calls: unknown[][] = [];
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { gtag: (...args: unknown[]) => calls.push(args) } });
  t.after(() => Reflect.deleteProperty(globalThis, 'window'));

  trackDiningTablesPromotionClick(false, true); // CookieContext initial defaults
  trackDiningTablesPromotionClick(false, false);
  trackDiningTablesPromotionClick(true, false); // including a later withdrawal
  assert.deepEqual(calls, []);
});

test('an allowed click reaches the existing GA4 stream once, without campaign parameters on the shop link', (t) => {
  const calls: unknown[][] = [];
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    _GA_ESHOP_ID: 'G-TEST',
    gtag: (...args: unknown[]) => calls.push(args),
    localStorage: { getItem: () => '{"analytics":true}' },
  } });
  t.after(() => Reflect.deleteProperty(globalThis, 'window'));

  trackDiningTablesPromotionClick(true, true);
  assert.deepEqual(calls, [['event', 'dining_tables_click', {
    send_to: 'G-TEST', placement: 'homepage_promotion', link_url: 'https://stoly.orostone.sk/',
  }]]);
});

test('unavailable analytics never prevents the dining-table navigation', () => {
  assert.doesNotThrow(() => trackDiningTablesPromotionClick(true, true));
});
