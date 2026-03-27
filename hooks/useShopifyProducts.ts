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
  isLoading: false,
  error: null,
};
let listeners: Set<() => void> = new Set();
let catalogFetchPromise: Promise<void> | null = null;

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

function ensureCatalogFetch(count: number) {
  if (catalogFetchPromise || catalogState.products.length > 0) return;
  if (!isShopifyConfigured()) {
    catalogState = { products: [], isLoading: false, error: null };
    emitChange();
    return;
  }

  catalogState = { ...catalogState, isLoading: true, error: null };
  emitChange();

  catalogFetchPromise = fetchProductsForListing(count)
    .then(data => {
      catalogState = {
        products: data.length > 0 ? data : [],
        isLoading: false,
        error: null,
      };
    })
    .catch(err => {
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
  shopifyOnly?: boolean;
}

export function useShopifyProducts(count: number = 50, options?: UseShopifyProductsOptions) {
  const shopifyOnly = options?.shopifyOnly === true;

  useEffect(() => {
    ensureCatalogFetch(count);
  }, [count]);

  const state = useSyncExternalStore(subscribeCatalog, getCatalogSnapshot, getCatalogSnapshot);

  const products = state.products.length > 0
    ? state.products
    : shopifyOnly ? [] : SHOP_PRODUCTS;

  return {
    products,
    isLoading: state.isLoading,
    error: state.error,
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
