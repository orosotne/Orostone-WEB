// Shopify CDN resizes images on the fly via ?width= — used by the product page, the catalog and the mega menu
// so the same URLs (and the browser cache) are shared between them.

export const shopifyImageUrl = (url: string, width: number): string => {
  const base = url.replace(/(\?.*)?$/, '');
  return `${base}?width=${width}&quality=80`;
};

export const shopifySrcSet = (url: string): string | undefined => {
  if (!url || !url.includes('cdn.shopify.com')) return undefined;
  const widths = [400, 600, 800, 1200, 1600];
  return widths.map(w => `${shopifyImageUrl(url, w)} ${w}w`).join(', ');
};

/** Resized Shopify URL; other images (local files, placeholders) are returned unchanged. */
export const shopifySized = (url: string, width: number): string =>
  url && url.includes('cdn.shopify.com') ? shopifyImageUrl(url, width) : url;
