import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { isShopifyConfigured } from '../lib/shopify';
import { fetchProductsForListing, fetchProductByHandle } from '../services/shopify.service';
import { SHOP_PRODUCTS, type ShopProduct } from '../constants';

// ===========================================
// Shared catalog cache (module-level singleton)
// ===========================================
// All useShopifyProducts instances share one fetch/result so Navbar,
// MegaMenu, Catalog, ProductDetail, etc. don't duplicate Storefront calls.

type CatalogState = {
  products: ShopProduct[];
  isLoading: boolean;
  error: string | null;
};

let catalogState: CatalogState = {
  products: [],
  // Start loading when a live fetch will actually happen, so the first paint
  // shows the skeleton — not a one-frame flash of fallback data + offline notice
  // — before the catalog settles. Unconfigured envs render the fallback at once.
  isLoading: isShopifyConfigured(),
  error: null,
};
let listeners: Set<() => void> = new Set();
let catalogFetchPromise: Promise<void> | null = null;
let catalogFetchedAt: number | null = null;
const CATALOG_TTL_MS = 10 * 60 * 1000;

function emitChange() {
  listeners.forEach(fn => fn());
}

function subscribeCatalog(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function getCatalogSnapshot() {
  return catalogState;
}

function isCatalogStale(): boolean {
  return catalogFetchedAt === null || performance.now() - catalogFetchedAt > CATALOG_TTL_MS;
}

function ensureCatalogFetch(count: number) {
  if (catalogFetchPromise) return;
  if (catalogState.products.length > 0 && !isCatalogStale()) return;
  if (!isShopifyConfigured()) {
    catalogState = { products: [], isLoading: false, error: null };
    emitChange();
    return;
  }

  catalogFetchedAt = performance.now();
  catalogState = { ...catalogState, isLoading: true, error: null };
  emitChange();

  catalogFetchPromise = fetchProductsForListing(count)
    .then(data => {
      if (data.length === 0) {
        // 200 OK but zero products — almost always a Storefront sales-channel /
        // publication or access-token-scope misconfig. Log loudly; consumers
        // degrade to the bundled snapshot instead of rendering a blank store.
        console.error('[catalog] Storefront returned 0 products — serving fallback snapshot.');
        catalogFetchedAt = null; // treat empty like a miss so the next mount retries
      }
      catalogState = { products: data, isLoading: false, error: null };
    })
    .catch(err => {
      catalogFetchedAt = null; // allow retry on error
      console.error('[catalog] Storefront fetch failed — serving fallback snapshot:', err);
      catalogState = {
        products: [],
        isLoading: false,
        error: err instanceof Error ? err.message : 'Neznáma chyba',
      };
    })
    .finally(() => {
      catalogFetchPromise = null;
      emitChange();
    });
}

// ===========================================
// Hook: useShopifyProducts
// ===========================================
export interface UseShopifyProductsOptions {
  /** Skip fetching until enabled (default: true). Useful for deferring load until user interaction. */
  enabled?: boolean;
}

export function useShopifyProducts(count: number = 50, options?: UseShopifyProductsOptions) {
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled) ensureCatalogFetch(count);
  }, [count, enabled]);

  const state = useSyncExternalStore(subscribeCatalog, getCatalogSnapshot, getCatalogSnapshot);

  // Live Storefront data is the source of truth. When it is empty (e.g. a 200 OK
  // with no products published to the Storefront channel) or the fetch failed,
  // degrade to the bundled snapshot (data/shop-products-fallback.json) so the
  // storefront is NEVER blank — a stale-but-complete catalog beats an empty page
  // or a misleading "coming soon", and avoids transient SEO de-indexing.
  // `usingFallback` lets pages surface a soft "offline data" notice.
  const hasLiveProducts = state.products.length > 0;
  const products = hasLiveProducts ? state.products : SHOP_PRODUCTS;

  return {
    products,
    isLoading: state.isLoading,
    error: state.error,
    usingFallback: !hasLiveProducts && !state.isLoading,
  };
}

// ===========================================
// Hook: useShopifyProduct
// ===========================================
// Loads a single product by handle/slug.
// Supports "Stale-While-Revalidate" pattern:
// if initialData is provided (e.g. from allProducts cache),
// it is used immediately (no loading state) and fresh data
// is fetched silently in the background.

export function useShopifyProduct(handle: string | undefined, initialData?: ShopProduct | null) {
  const [product, setProduct] = useState<ShopProduct | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  const prevHandleRef = useRef(handle);

  useEffect(() => {
    if (handle !== prevHandleRef.current) {
      prevHandleRef.current = handle;
      if (initialData) {
        setProduct(initialData);
        setIsLoading(false);
      } else {
        setProduct(null);
        setIsLoading(true);
      }
    }
  }, [handle, initialData]);

  useEffect(() => {
    if (!handle) {
      setIsLoading(false);
      return;
    }

    if (!isShopifyConfigured()) {
      const found = SHOP_PRODUCTS.find(p => p.id === handle) || null;
      setProduct(found);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const hasInitial = !!initialData;

    const load = async () => {
      if (!hasInitial) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const data = await fetchProductByHandle(handle);
        if (!cancelled) {
          setProduct(data || SHOP_PRODUCTS.find(p => p.id === handle) || null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Chyba pri nacitavani produktu:', err);
          setError(err instanceof Error ? err.message : 'Neznama chyba');
          if (!hasInitial) {
            setProduct(SHOP_PRODUCTS.find(p => p.id === handle) || null);
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [handle]); // intentionally omit initialData to avoid re-fetching when cache ref changes

  return { product, isLoading, error };
}
