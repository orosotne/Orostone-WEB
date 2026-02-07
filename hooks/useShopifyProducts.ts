import { useState, useEffect } from 'react';
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

export function useShopifyProduct(handle: string | undefined) {
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProductByHandle(handle);
        if (!cancelled) {
          // Ak nenajdeny v Shopify, skus lokalne
          setProduct(data || SHOP_PRODUCTS.find(p => p.id === handle) || null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Chyba pri nacitavani produktu:', err);
          setError(err instanceof Error ? err.message : 'Neznama chyba');
          // Fallback na lokalne data
          setProduct(SHOP_PRODUCTS.find(p => p.id === handle) || null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [handle]);

  return { product, isLoading, error };
}
