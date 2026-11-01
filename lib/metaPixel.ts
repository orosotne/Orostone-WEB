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
