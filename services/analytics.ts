/**
 * GA4 Enhanced Ecommerce event helpers.
 * Plain functions (not a React hook) — callable from contexts and event handlers.
 * Consent gating is handled by Consent Mode v2 in the HTML <head>: if
 * analytics_storage is denied, GA4 silently ignores these events.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function getGA4Id(): string | undefined {
  return typeof window !== 'undefined' ? (window as any)._GA_ESHOP_ID : undefined;
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
}): void {
  trackGA4Event('add_to_cart', {
    currency: 'EUR',
    value: item.price * item.quantity,
    items: [{
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
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
  trackGA4Event('purchase', {
    currency: 'EUR',
    transaction_id: params.transaction_id ?? `oro_${Date.now()}`,
    value: params.value,
    items: params.items,
  });
}
