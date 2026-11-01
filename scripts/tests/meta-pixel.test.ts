import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { installFbqStub } from '../../lib/metaPixel';
import type { FbqHost, FbqStub } from '../../lib/metaPixel';

// What fbevents.js (2.9.433 from connect.facebook.net/en_US/fbevents.js) does when it loads: it keeps the fbq already
// on the page, sets its handler as `fbq.callMethod` and runs the calls waiting in `fbq.queue` (again after each of its
// configs has loaded). A later call reaches the handler only through the stub.
function loadFbevents(host: FbqHost) {
  const fbq = host.fbq as FbqStub;
  const handled: Array<{ self: unknown; args: unknown[] }> = [];
  function handler(this: unknown, ...args: unknown[]) {
    handled.push({ self: this, args });
  }
  fbq.callMethod = handler;
  while (fbq.queue.length) handler.apply(fbq, fbq.queue.shift()!);
  return handled;
}

test('calls made before fbevents.js loads wait in the queue and run once it loads', () => {
  const host: FbqHost = {};
  installFbqStub(host);
  host.fbq!('init', '123');
  host.fbq!('track', 'PageView');
  const handled = loadFbevents(host);
  assert.deepEqual(handled.map((call) => call.args), [['init', '123'], ['track', 'PageView']]);
});

test('every call made after fbevents.js has loaded reaches it', () => {
  const host: FbqHost = {};
  installFbqStub(host);
  host.fbq!('init', '123');
  const handled = loadFbevents(host);
  host.fbq!('track', 'AddToCart', { value: 49, currency: 'EUR' });
  host.fbq!('track', 'Lead');
  assert.deepEqual(handled.slice(1).map((call) => call.args), [
    ['track', 'AddToCart', { value: 49, currency: 'EUR' }],
    ['track', 'Lead'],
  ]);
  assert.equal(handled[1].self, host.fbq, 'the handler runs on fbq, as with the base code');
  assert.deepEqual((host.fbq as FbqStub).queue, [], 'nothing is left in the queue');
});

test('window._fbq is the same function (fbevents.js reports CONFLICTING_VERSIONS when they differ)', () => {
  const host: FbqHost = {};
  installFbqStub(host);
  assert.equal(typeof host.fbq, 'function');
  assert.equal(host._fbq, host.fbq);
});

test('keeps an fbq that is already on the page', () => {
  const existing = () => {};
  const host: FbqHost = { fbq: existing, _fbq: existing };
  installFbqStub(host);
  assert.equal(host.fbq, existing);
  assert.equal(host._fbq, existing);
});

test('useMetaPixel puts the stub on the page and sends only the first PageView itself', () => {
  const source = readFileSync('hooks/useMetaPixel.ts', 'utf8');
  assert.match(source, /installFbqStub\(window\);/);
  // fbevents.js sends a PageView on each SPA route change itself (pushState, replaceState, popstate) and drops a
  // repeated one; a PageView from the hook on route changes (fbq or trackMetaEvent) would count them twice if that stops
  assert.equal(source.match(/['"]PageView['"]/g)?.length, 1, 'the hook sends only the first PageView');
});
