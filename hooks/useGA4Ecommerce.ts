/**
 * GA4 Enhanced Ecommerce event helpers.
 * Plain functions (nie React hook) — volateľné z kontextov aj event handlerov.
 * Consent gating rieši Consent Mode v2 v HTML <head> — ak je analytics_storage denied,
 * GA4 eventy ticho ignoruje. Tu nekontrolujeme cookie preferences.
 */

declare global {
  interface Window { gtag?: (...args: any[]) => void; }
}

const GA_ID = (window as any)._GA_ESHOP_ID as string | undefined;

export interface GA4Item {
  item_id: string;
  item_name?: string;
  price?: number;
  quantity?: number;
  item_category?: string;
}

export function trackGA4Event(eventName: string, params: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...(GA_ID ? { send_to: GA_ID } : {}),
      ...params,
    });
  }
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
