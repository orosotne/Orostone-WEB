import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookies } from '../context/CookieContext';
import { useFirstInteraction } from './useFirstInteraction';

declare global {
  interface Window {
    fbq?: (cmd: string, ...args: unknown[]) => void;
    _fbq?: typeof window.fbq;
  }
}

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
 * Also tracks PageView on every SPA route change.
 */
export function useMetaPixel(): void {
  const { preferences } = useCookies();
  const location = useLocation();
  const loadedRef = useRef(false);
  // Defer Pixel script injection until first user interaction (or 5s timeout).
  // fbevents.js is ~113 KB raw and blocks the main thread on parse — same INP
  // hit as gtag.js. Same idea as useAnalytics: real users see PageView fired
  // within ~5s, bots/abandoners still get tracked via the timeout fallback.
  const interacted = useFirstInteraction();

  // Load the pixel script once when marketing consent is granted
  useEffect(() => {
    if (!interacted) return;
    if (!PIXEL_ID || !preferences.marketing || loadedRef.current) return;
    loadedRef.current = true;

    // Create fbq stub so events queued before script loads are not lost
    if (typeof window.fbq !== 'function') {
      const queue: unknown[][] = [];
      const stub = (...args: unknown[]) => { queue.push(args); };
      (stub as any).queue = queue;
      (stub as any).loaded = false;
      window.fbq = stub as typeof window.fbq;
      window._fbq = stub as typeof window.fbq;
    }

    if (internalMember) {
      window.fbq!('init', PIXEL_ID, { external_id: `internal_${internalMember}` });
    } else {
      window.fbq!('init', PIXEL_ID);
    }
    window.fbq!('track', 'PageView', internalMember ? { internal_traffic: internalMember } : undefined);

    const script = document.createElement('script');
    script.async = true;
    script.src = FBQ_SRC;
    document.head.appendChild(script);
  }, [preferences.marketing, interacted]);

  // Track PageView on every SPA route change (skip the very first render — already tracked above)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!preferences.marketing || typeof window.fbq !== 'function') return;
    window.fbq('track', 'PageView', internalMember ? { internal_traffic: internalMember } : undefined);
  }, [location.pathname, preferences.marketing]);
}

/**
 * Track a Meta Pixel event. No-op if Pixel is not loaded.
 */
export function trackMetaEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (params) {
      window.fbq('track', eventName, params);
    } else {
      window.fbq('track', eventName);
    }
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
