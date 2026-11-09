/**
 * GA4 Enhanced Ecommerce event helpers.
 * Plain functions (not a React hook) — callable from contexts and event handlers.
 * A confirmed analytics choice is required before anything enters the queue.
 * Purchase belongs to Shopify's official Google channel, never a local cart.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    /** Registered by the consent-owned hook; reuses its single Google loader. */
    _startOrostoneAnalytics?: () => boolean;
  }
}

function getGA4Id(): string | undefined {
  return typeof window !== 'undefined' ? (window as any)._GA_ESHOP_ID : undefined;
}

function hasAnalyticsConsent(gaId: string | undefined): boolean {
  try {
    // CookieContext writes the confirmed choice to this key. Its initial
    // in-memory defaults are not a choice, and blocked storage fails closed.
    const saved: unknown = JSON.parse(window.localStorage.getItem('orostone-cookies') || 'null');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved) ||
      !('analytics' in saved) || saved.analytics !== true) return false;
    // A withdrawal still applies when persisting the new choice failed.
    return !gaId || (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] !== true;
  } catch {
    return false;
  }
}

/** An outgoing first click cannot wait for React's interaction effect to start Google. */
export function startAnalyticsForNavigation(): boolean {
  if (typeof window === 'undefined' || !hasAnalyticsConsent(getGA4Id())) return false;
  try {
    return window._startOrostoneAnalytics?.() === true;
  } catch {
    // A blocked tag or missing loader must never block the customer's navigation.
    return false;
  }
}

export interface GA4Item {
  item_id: string;
  item_name?: string;
  price?: number;
  quantity?: number;
  item_category?: string;
}

export function trackGA4Event(eventName: string, params: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  const GA_ID = getGA4Id();
  if (eventName === 'purchase' || !hasAnalyticsConsent(GA_ID)) return;
  window.gtag('event', eventName, {
    ...(GA_ID ? { send_to: GA_ID } : {}),
    ...params,
  });
}

export function trackGA4ViewItem(item: {
  id: string;
  name: string;
  price: number;
  category?: string;
}): void {
  trackGA4Event('view_item', {
    currency: 'EUR',
    value: item.price,
    items: [{
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      item_category: item.category ?? 'Sinterovaný kameň',
      quantity: 1,
    }],
  });
}

export function trackGA4AddToCart(item: {
  id: string;
  name?: string;
  price: number;
  quantity: number;
  category?: string;
}): void {
  trackGA4Event('add_to_cart', {
    currency: 'EUR',
    value: item.price * item.quantity,
    items: [{
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_category: item.category,
    }],
  });
}

export function trackGA4BeginCheckout(params: {
  value: number;
  items: GA4Item[];
}): void {
  trackGA4Event('begin_checkout', {
    currency: 'EUR',
    value: params.value,
    items: params.items,
  });
}

export function trackGA4Purchase(params: {
  transaction_id?: string;
  value: number;
  items: GA4Item[];
}): void {
  // Retained for import compatibility; trackGA4Event blocks local purchase
  // inference. A paid Shopify order is measured by the official Google channel.
  trackGA4Event('purchase', {
    currency: 'EUR',
    transaction_id: params.transaction_id ?? `oro_${Date.now()}`,
    value: params.value,
    items: params.items,
  });
}
