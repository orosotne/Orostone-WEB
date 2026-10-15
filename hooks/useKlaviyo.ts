import { useEffect, useRef } from 'react';
import { useCookies } from '../context/CookieContext';
import { useFirstInteraction } from './useFirstInteraction';

declare global {
  interface Window {
    // Queue read by klaviyo.js on load; the official snippet's `klaviyo.push([...])` writes here too.
    _klOnsite?: unknown[][];
  }
}

// Public API key of the Orostone account (the company ID). It is public by design: every
// Klaviyo form and e-mail link carries it. The script only identifies visitors who arrive
// from our own e-mails (`_kx` in the URL) or who are identified explicitly.
const PUBLIC_KEY = 'RxkFZa';
const SCRIPT_SRC = `https://static.klaviyo.com/onsite/js/${PUBLIC_KEY}/klaviyo.js`;

// `_kx` is the exchange ID Klaviyo appends to links in our e-mails. klaviyo.js reads it from
// the URL when it loads, so a visitor coming from an e-mail must get the script before the
// first navigation changes the address.
const cameFromEmail =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('_kx');
// Set by klaviyo.js once a visitor was identified on an earlier visit (e-mail link).
const knownVisitor = typeof document !== 'undefined' && /(^|;\s*)__kla_id=/.test(document.cookie);

// The stored cookie choice, read directly: this hook's effects run before CookieProvider loads
// it from localStorage, so on the first render `preferences.marketing` is still the default.
// Mirrors CookieContext: a saved choice without the key counts as a rejection.
function storedMarketingRejected(): boolean {
  try {
    const raw = localStorage.getItem('orostone-cookies');
    return !!raw && (JSON.parse(raw).marketing ?? false) === false;
  } catch {
    return false;
  }
}

// While the cookie __kla_off is set, klaviyo.js stops onsite tracking (Klaviyo help, "About
// cookies in Klaviyo"). Set on a rejection or withdrawal, together with dropping the identifier
// (host or parent domain); removed again when the visitor allows marketing cookies.
function setKlaviyoOff(off: boolean): void {
  if (!off) {
    document.cookie = '__kla_off=; path=/; max-age=0; SameSite=Lax';
    return;
  }
  document.cookie = '__kla_off=true; path=/; max-age=31536000; SameSite=Lax';
  const host = window.location.hostname.replace(/^www\./, '');
  document.cookie = '__kla_id=; path=/; max-age=0';
  document.cookie = `__kla_id=; path=/; max-age=0; domain=.${host}`;
}

/**
 * Loads klaviyo.js only when marketing cookies are allowed (same model as the Meta Pixel) and
 * only for visitors Klaviyo can identify: those arriving from our e-mails (`_kx` in the URL) or
 * already carrying the Klaviyo cookie. Anonymous visitors get no script and no cookie, because
 * Klaviyo discards their events anyway. Visitors from an e-mail get the script right away so the
 * `_kx` identification is not lost; known visitors after the first interaction, off the
 * LCP/INP-critical window.
 */
export function useKlaviyo(): void {
  const { preferences } = useCookies();
  const interacted = useFirstInteraction();
  const loadedRef = useRef(false);

  // Keep trackKlaviyoEvent in step with the visitor's choice. A rejection before the script loads
  // drops the events waiting in the queue; a rejection or withdrawal after Klaviyo has run (script
  // loaded or its cookie present) switches its tracking off and removes the identifier.
  useEffect(() => {
    marketingAllowed = preferences.marketing;
    if (preferences.marketing) {
      // The first render still has the default `true`; a stored rejection must keep Klaviyo off
      if (!storedMarketingRejected()) setKlaviyoOff(false);
      return;
    }
    if (!loadedRef.current && window._klOnsite) window._klOnsite.length = 0;
    if (loadedRef.current || /(^|;\s*)__kla_id=/.test(document.cookie)) setKlaviyoOff(true);
  }, [preferences.marketing]);

  useEffect(() => {
    if (!preferences.marketing || loadedRef.current || storedMarketingRejected()) return;
    if (!cameFromEmail && !(knownVisitor && interacted)) return;
    loadedRef.current = true;

    window._klOnsite = window._klOnsite || [];
    const script = document.createElement('script');
    script.async = true;
    script.src = SCRIPT_SRC;
    document.head.appendChild(script);
  }, [preferences.marketing, interacted]);
}

let marketingAllowed = true;

/**
 * Track a Klaviyo onsite event. Queued in `_klOnsite` until klaviyo.js loads (the script
 * replays the queue), dropped while marketing cookies are not allowed. Klaviyo keeps the
 * event only for an identified visitor (cookie from an e-mail link); anonymous visits are ignored.
 */
export function trackKlaviyoEvent(eventName: string, properties: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !marketingAllowed) return;
  window._klOnsite = window._klOnsite || [];
  window._klOnsite.push(['track', eventName, properties]);
}
