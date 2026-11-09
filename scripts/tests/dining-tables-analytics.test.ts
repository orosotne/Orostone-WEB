import assert from 'node:assert/strict';
import test, { type TestContext } from 'node:test';
import { handleDiningTablesAnnouncementClick, trackDiningTablesPromotionClick } from '../../services/diningTablesAnalytics';
import type { MouseEvent } from 'react';

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

  trackDiningTablesPromotionClick(true, true, 'announcement_bar');
  assert.deepEqual(calls[1], ['event', 'dining_tables_click', {
    send_to: 'G-TEST', placement: 'announcement_bar', link_url: 'https://stoly.orostone.sk/?entry=announcement_bar',
  }]);
});

test('unavailable analytics never prevents the dining-table navigation', () => {
  assert.doesNotThrow(() => trackDiningTablesPromotionClick(true, true));
});

function navigationHost(t: TestContext) {
  const calls: unknown[][] = [];
  const destinations: string[] = [];
  const timers = new Map<number, { run: () => void; delay: number }>();
  let nextTimer = 0;
  const host: any = {
    _GA_ESHOP_ID: 'G-TEST',
    localStorage: { getItem: () => '{"analytics":true}' },
    location: { assign: (destination: string) => destinations.push(destination) },
    setTimeout: (run: () => void, delay: number) => {
      const id = ++nextTimer;
      timers.set(id, { run, delay });
      return id;
    },
    clearTimeout: (id: number) => timers.delete(id),
    _startOrostoneAnalytics: () => { calls.push(['start']); return true; },
    gtag: (...args: unknown[]) => calls.push(args),
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: host });
  t.after(() => Reflect.deleteProperty(globalThis, 'window'));
  let prevented = 0;
  const event = {
    button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false,
    currentTarget: {
      href: 'https://stoly.orostone.sk/?entry=announcement_bar', target: '',
      hasAttribute: (_name: string) => false,
    },
    preventDefault: () => { prevented++; },
  };
  return {
    host, calls, destinations, timers, event,
    prevented: () => prevented,
    click: (consented = true, allowed = true) => handleDiningTablesAnnouncementClick(
      event as unknown as MouseEvent<HTMLAnchorElement>, consented, allowed,
    ),
    callback: () => (calls.find(call => call[1] === 'dining_tables_click')?.[2] as any)?.event_callback,
  };
}

test('a consented first click starts the existing loader before its event and navigates once on callback', t => {
  const h = navigationHost(t);
  h.click();
  assert.equal(h.prevented(), 1);
  assert.deepEqual(h.calls[0], ['start']);
  assert.equal(h.calls[1][1], 'dining_tables_click');
  assert.deepEqual(h.destinations, []);
  assert.equal(h.timers.size, 1);
  assert.equal([...h.timers.values()][0].delay, 800);
  const callback = h.callback();
  assert.equal(typeof callback, 'function');
  callback();
  callback();
  assert.deepEqual(h.destinations, ['https://stoly.orostone.sk/?entry=announcement_bar']);
  assert.equal(h.timers.size, 0);
});

test('a blocked or late Google tag cannot delay navigation beyond 800 ms or navigate twice', t => {
  const h = navigationHost(t);
  h.click();
  const fallback = [...h.timers.values()][0];
  assert.equal(fallback.delay, 800);
  fallback.run();
  assert.equal(h.destinations.length, 1);
  h.callback()(); // The script can finish after the fallback has already navigated.
  assert.equal(h.destinations.length, 1);
});

test('an immediate tag callback also completes navigation without leaving a pending timer', t => {
  const h = navigationHost(t);
  h.host.gtag = (...args: unknown[]) => (args[2] as any).event_callback?.();
  h.click();
  assert.equal(h.destinations.length, 1);
  assert.equal(h.timers.size, 0);
});

test('modifier, new-tab, non-primary and download links preserve native navigation', t => {
  const h = navigationHost(t);
  const cases = [
    () => { h.event.metaKey = true; },
    () => { h.event.ctrlKey = true; },
    () => { h.event.shiftKey = true; },
    () => { h.event.altKey = true; },
    () => { h.event.button = 1; },
    () => { h.event.currentTarget.target = '_blank'; },
    () => { h.event.currentTarget.target = '_self'; },
    () => { h.event.currentTarget.hasAttribute = name => name === 'download'; },
  ];
  for (const configure of cases) {
    Object.assign(h.event, { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false });
    h.event.currentTarget.target = '';
    h.event.currentTarget.hasAttribute = () => false;
    configure();
    h.click();
  }
  assert.equal(h.prevented(), 0);
  assert.equal(h.timers.size, 0);
  assert.equal(h.destinations.length, 0);
  assert.equal(h.calls.filter(call => call[1] === 'dining_tables_click').length, cases.length);
});

test('unconfirmed, rejected, withdrawn or unavailable analytics never intercepts navigation', t => {
  const h = navigationHost(t);
  h.click(false, true);
  h.click(true, false);
  h.event.defaultPrevented = true;
  h.click();
  assert.deepEqual(h.calls, []);
  h.event.defaultPrevented = false;
  h.host.localStorage.getItem = () => '{"analytics":false}';
  h.click();
  assert.deepEqual(h.calls, []);
  h.host.localStorage.getItem = () => '{"analytics":true}';
  h.host['ga-disable-G-TEST'] = true;
  h.click();
  assert.deepEqual(h.calls, []);
  h.host['ga-disable-G-TEST'] = false;
  delete h.host._startOrostoneAnalytics;
  h.click();
  assert.equal(h.prevented(), 0);
  assert.equal(h.timers.size, 0);
  assert.equal(h.destinations.length, 0);
});
