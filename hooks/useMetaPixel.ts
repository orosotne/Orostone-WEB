import { useEffect, useRef } from 'react';
import { useCookies } from '../context/CookieContext';
import { installFbqStub } from '../lib/metaPixel';
import { useFirstInteraction } from './useFirstInteraction';

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const FBQ_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

function getInternalMember(): string | null {
  const match = document.cookie.match(/orostone_internal=([^;]+)/);
  return match ? match[1] : null;
}
const internalMember = getInternalMember();

/**
 * Loads Meta Pixel only when:
 * - VITE_META_PIXEL_ID is set
 * - Cookie consent for marketing is granted
 *
 * Sends the first PageView; fbevents.js sends one on every later SPA route change itself (pushState, replaceState,
 * popstate) and drops a PageView tracked again by hand.
 */
export function useMetaPixel(): void {
  const { preferences } = useCookies();
  const loadedRef = useRef(false);
  // Defer Pixel script injection until first user interaction (or 5s timeout).
  // fbevents.js is ~113 KB raw and blocks the main thread on parse — same INP
  // hit as gtag.js. Same idea as useAnalytics: real users see PageView fired
  // within ~5s, bots/abandoners still get tracked via the timeout fallback.
  const interacted = useFirstInteraction();

  // Keep trackMetaEvent in step with the visitor's choice; a rejection also drops events waiting for the Pixel
  useEffect(() => {
    marketingAllowed = preferences.marketing;
    if (!preferences.marketing) pendingEvents.length = 0;
  }, [preferences.marketing]);

  // Load the pixel script once when marketing consent is granted
  useEffect(() => {
    if (!interacted) return;
    if (!PIXEL_ID || !preferences.marketing || loadedRef.current) return;
    loadedRef.current = true;

    // Calls wait in the stub's queue until the script loads; later ones go straight to fbevents.js
    installFbqStub(window);

    if (internalMember) {
      window.fbq!('init', PIXEL_ID, { external_id: `internal_${internalMember}` });
    } else {
      window.fbq!('init', PIXEL_ID);
    }
    window.fbq!('track', 'PageView', internalMember ? { internal_traffic: internalMember } : undefined);
    pendingEvents.splice(0).forEach(([name, params]) => trackMetaEvent(name, params));

    const script = document.createElement('script');
    script.async = true;
    script.src = FBQ_SRC;
    document.head.appendChild(script);
  }, [preferences.marketing, interacted]);
}

// Events tracked before the deferred Pixel loads (e.g. ViewContent on a product landing page) wait here and are
// sent right after init. Only while marketing is allowed: a rejection drops them, so nothing from before the
// visitor's consent is sent later. useMetaPixel keeps marketingAllowed in step with the cookie preferences.
const pendingEvents: Array<[string, Record<string, unknown> | undefined]> = [];
let marketingAllowed = true;

/**
 * Track a Meta Pixel event; queued until the Pixel is loaded, dropped while marketing is not allowed.
 */
export function trackMetaEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !marketingAllowed) return;
  if (typeof window.fbq === 'function') {
    if (params) {
      window.fbq('track', eventName, params);
    } else {
      window.fbq('track', eventName);
    }
  } else if (PIXEL_ID && pendingEvents.length < 20) {
    pendingEvents.push([eventName, params]);
  }
}

const PURCHASE_SESSION_KEY = 'orostone_pending_purchase';

export interface PendingPurchaseData {
  value: number;
  currency: string;
  num_items: number;
  content_ids: string[];
  items?: Array<{ item_id: string; item_name?: string; price?: number; quantity?: number }>;
}

/**
 * Save cart data to sessionStorage before redirecting to Shopify checkout.
 * Called in handleCheckout — data is read on the thank-you page to fire Purchase.
 */
export function savePendingPurchase(data: PendingPurchaseData): void {
  try {
    sessionStorage.setItem(PURCHASE_SESSION_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage not available — silently ignore
  }
}

/**
 * Read and clear the pending purchase data. Returns null if nothing stored.
 */
export function popPendingPurchase(): PendingPurchaseData | null {
  try {
    const raw = sessionStorage.getItem(PURCHASE_SESSION_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(PURCHASE_SESSION_KEY);
    return JSON.parse(raw) as PendingPurchaseData;
  } catch {
    return null;
  }
}
