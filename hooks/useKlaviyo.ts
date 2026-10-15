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

  // Keep trackKlaviyoEvent in step with the visitor's choice; a rejection before the script
  // loads also drops the events waiting in the queue.
  useEffect(() => {
    marketingAllowed = preferences.marketing;
    if (!preferences.marketing && !loadedRef.current && window._klOnsite) window._klOnsite.length = 0;
  }, [preferences.marketing]);

  useEffect(() => {
    if (!preferences.marketing || loadedRef.current) return;
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
