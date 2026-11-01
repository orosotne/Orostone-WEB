import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { installFbqStub, isPixelHost, setFbqConsent } from '../../lib/metaPixel';
import type { FbqHost, FbqStub } from '../../lib/metaPixel';

// What fbevents.js (2.9.433 from connect.facebook.net/en_US/fbevents.js) does when it loads: it keeps the fbq already
// on the page, sets its handler as `fbq.callMethod` and runs the calls waiting in `fbq.queue` (again after each of its
// configs has loaded). A later call reaches the handler only through the stub. fbq('consent', 'revoke') takes a lock:
// from then on the handler puts every other call back into `fbq.queue`.
function loadFbevents(host: FbqHost) {
  const fbq = host.fbq as FbqStub;
  const handled: Array<{ self: unknown; args: unknown[] }> = [];
  let revoked = false;
  function handler(this: unknown, ...args: unknown[]) {
    if (revoked && args[0] !== 'consent') {
      fbq.queue.push(args);
      return;
    }
    handled.push({ self: this, args });
    if (args[0] === 'consent' && args[1] === 'revoke') revoked = true;
  }
  fbq.callMethod = handler;
  while (fbq.queue.length && !revoked) handler.apply(fbq, fbq.queue.shift()!);
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

test('a rejection before fbevents.js has loaded holds the queued init and PageView', () => {
  const host: FbqHost = {};
  installFbqStub(host);
  host.fbq!('init', '123');
  host.fbq!('track', 'PageView');
  setFbqConsent(host, false);
  setFbqConsent(host, false);
  const fbq = host.fbq as FbqStub;
  assert.deepEqual(fbq.queue, [['consent', 'revoke'], ['init', '123'], ['track', 'PageView']], 'one revoke, in front');
  const handled = loadFbevents(host);
  assert.deepEqual(handled.map((call) => call.args), [['consent', 'revoke']], 'nothing runs behind the revoke');
  assert.deepEqual(fbq.queue, [['init', '123'], ['track', 'PageView']]);
});

test('consent given again before fbevents.js has loaded leaves the queue as it was', () => {
  const host: FbqHost = {};
  installFbqStub(host);
  host.fbq!('init', '123');
  host.fbq!('track', 'PageView');
  setFbqConsent(host, false);
  setFbqConsent(host, true);
  setFbqConsent(host, true);
  assert.deepEqual((host.fbq as FbqStub).queue, [['init', '123'], ['track', 'PageView']]);
  const handled = loadFbevents(host);
  assert.deepEqual(handled.map((call) => call.args), [['init', '123'], ['track', 'PageView']]);
});

test('after fbevents.js has run, a rejection holds it until the page is loaded again', () => {
  const host: FbqHost = {};
  installFbqStub(host);
  host.fbq!('init', '123');
  const handled = loadFbevents(host);
  setFbqConsent(host, false);
  host.fbq!('track', 'PageView');
  setFbqConsent(host, true);
  host.fbq!('track', 'AddToCart');
  assert.deepEqual(handled.map((call) => call.args), [['init', '123'], ['consent', 'revoke']], 'no grant after a withdrawal');
  assert.deepEqual((host.fbq as FbqStub).queue, [['track', 'PageView'], ['track', 'AddToCart']], 'held in the queue');
});

test('setting consent does nothing on a page without the Pixel', () => {
  const host: FbqHost = {};
  setFbqConsent(host, false);
  setFbqConsent(host, true);
  assert.equal(host.fbq, undefined);
});

test('the Pixel runs only on the live site', () => {
  for (const hostname of ['orostone.sk', 'www.orostone.sk', 'eshop.orostone.sk']) assert.equal(isPixelHost(hostname), true, hostname);
  for (const hostname of [
    'localhost',
    '127.0.0.1',
    'orostone-git-claude-seo-analytics-audit-41f79d-martin-projekty.vercel.app',
    'store.orostone.sk',
    'stoly.orostone.sk',
    'orostone.sk.example.com',
  ]) assert.equal(isPixelHost(hostname), false, hostname);
});

test('useMetaPixel loads the Pixel only on the live site, holds it on a rejection and sends only the first PageView', () => {
  const source = readFileSync('hooks/useMetaPixel.ts', 'utf8');
  const loader = source.slice(source.indexOf('if (!interacted) return;'), source.indexOf('installFbqStub(window);'));
  assert.match(loader, /!isPixelHost\(window\.location\.hostname\)\) return;/, 'the host check guards the loader');
  assert.match(source, /setFbqConsent\(window, preferences\.marketing\);\s*\}, \[preferences\.marketing\]\);/);
  // fbevents.js sends a PageView on each SPA route change itself (pushState, replaceState, popstate) and drops a
  // repeated one; a PageView from the hook on route changes (fbq or trackMetaEvent) would count them twice if that stops
  assert.equal(source.match(/['"]PageView['"]/g)?.length, 1, 'the hook sends only the first PageView');
});
