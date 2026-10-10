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

const preloaded = new Map<string, HTMLImageElement>();

/**
 * Downloads the srcset candidate the browser will pick for an <img> with the same `sizes`, so that <img> paints
 * straight from the cache (preloading a fixed ?width= misses whenever the device picks another size). Other URLs,
 * such as local photos, are fetched as they are. The images are kept, so each is fetched once and not dropped
 * mid-download.
 */
export const preloadImage = (url: string, sizes = '100vw'): HTMLImageElement | undefined => {
  if (typeof window === 'undefined' || !url) return undefined;
  const key = `${url} ${sizes}`;
  let img = preloaded.get(key);
  if (!img) {
    img = new Image();
    img.decoding = 'async';
    img.sizes = sizes;
    const srcSet = shopifySrcSet(url);
    if (srcSet) img.srcset = srcSet;
    img.src = shopifySized(url, 1200);
    preloaded.set(key, img);
  }
  return img;
};
