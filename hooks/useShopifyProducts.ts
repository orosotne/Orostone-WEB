import { useState, useEffect, useRef } from 'react';
import { isShopifyConfigured } from '../lib/shopify';
import { fetchProducts, fetchProductByHandle } from '../services/shopify.service';
import { SHOP_PRODUCTS, type ShopProduct } from '../constants';

// ===========================================
// Hook: useShopifyProducts
// ===========================================
// Nacita produkty z Shopify Storefront API.
// Ak Shopify nie je nakonfigurovany, pouzije
// fallback data z constants.ts (pre development).

export function useShopifyProducts(count: number = 50) {
  const [products, setProducts] = useState<ShopProduct[]>(SHOP_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isShopifyConfigured()) {
      // Fallback na lokalne data
      setProducts(SHOP_PRODUCTS);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProducts(count);
        if (!cancelled) {
          setProducts(data.length > 0 ? data : SHOP_PRODUCTS);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Chyba pri nacitavani produktov z Shopify:', err);
          setError(err instanceof Error ? err.message : 'Neznama chyba');
          setProducts(SHOP_PRODUCTS); // Fallback
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [count]);

  return { products, isLoading, error };
}

// ===========================================
// Hook: useShopifyProduct
// ===========================================
// Nacita jeden produkt podla handle/slug.
// Supports "Stale-While-Revalidate" pattern:
// if initialData is provided (e.g. from allProducts cache),
// it is used immediately (no loading state) and fresh data
// is fetched silently in the background.

export function useShopifyProduct(handle: string | undefined, initialData?: ShopProduct | null) {
  const [product, setProduct] = useState<ShopProduct | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  // Track the current handle to sync initialData changes across navigations
  const prevHandleRef = useRef(handle);

  useEffect(() => {
    // When handle changes AND we have new initialData, apply it instantly
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
      // Fallback na lokalne data
      const found = SHOP_PRODUCTS.find(p => p.id === handle) || null;
      setProduct(found);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const hasInitial = !!initialData;

    const load = async () => {
      // Only show loading spinner if we have no cached data to display
      if (!hasInitial) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const data = await fetchProductByHandle(handle);
        if (!cancelled) {
          // Silently update with fresh data (no loading flash)
          setProduct(data || SHOP_PRODUCTS.find(p => p.id === handle) || null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Chyba pri nacitavani produktu:', err);
          setError(err instanceof Error ? err.message : 'Neznama chyba');
          // Only fallback if we don't already have initialData displayed
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
