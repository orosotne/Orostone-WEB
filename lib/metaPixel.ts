// Meta Pixel's fbq stub, the same as in Meta's base code. fbevents.js does not replace window.fbq when it loads: it
// sets its handler as `fbq.callMethod`, puts calls back into `fbq.queue` while its configs are still loading and runs
// the queue each time they have loaded. The stub passes every later call to the handler; a stub that only queues kept
// every event tracked after fbevents.js had loaded (AddToCart, InitiateCheckout, Lead) from Meta.

type FbqCall = (cmd: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: FbqCall;
    _fbq?: FbqCall;
  }
}

/** The window, or a stand-in in the tests. */
export interface FbqHost {
  fbq?: FbqCall;
  _fbq?: FbqCall;
}

/** The fields the base code gives the stub; fbevents.js adds `callMethod`. */
export type FbqStub = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: FbqStub;
  loaded: boolean;
  version: string;
};

/** Puts the stub on `host` unless an fbq is already there. */
export function installFbqStub(host: FbqHost): void {
  if (typeof host.fbq === 'function') return;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, args);
    else fbq.queue.push(args);
  } as FbqStub;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  host.fbq = fbq;
  if (!host._fbq) host._fbq = fbq;
}

/**
 * Holds the Pixel through Meta's consent API when marketing cookies are rejected or withdrawn. While consent is revoked
 * fbevents.js keeps every call in `fbq.queue`, its own PageViews on route changes included. Before fbevents.js has
 * loaded, the revoke goes to the front of the queue so the init and PageView already waiting there stay behind it, and
 * consent given again takes it out. Once fbevents.js has run, the hold lasts until the page is loaded again: a grant
 * would also send what fbevents.js gathered meanwhile (form fields for automatic matching, its own events).
 */
export function setFbqConsent(host: FbqHost, granted: boolean): void {
  const fbq = host.fbq as FbqStub | undefined;
  if (typeof fbq !== 'function') return;
  if (fbq.callMethod || !fbq.queue) {
    if (!granted) fbq('consent', 'revoke');
    return;
  }
  const revoke = fbq.queue.findIndex(([cmd, action]) => cmd === 'consent' && action === 'revoke');
  if (granted && revoke >= 0) fbq.queue.splice(revoke, 1);
  if (!granted && revoke < 0) fbq.queue.unshift(['consent', 'revoke']);
}

// The live site is orostone.sk (vercel.json sends www and eshop there). Previews, localhost and any other host get no
// Pixel, so testing a preview does not put AddToCart or Lead into the live dataset.
const PIXEL_HOSTS = new Set(['orostone.sk', 'www.orostone.sk', 'eshop.orostone.sk']);

/** The Pixel runs on this host. */
export function isPixelHost(hostname: string): boolean {
  return PIXEL_HOSTS.has(hostname);
}
