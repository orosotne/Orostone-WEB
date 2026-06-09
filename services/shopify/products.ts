import { shopifyFetch } from '../../lib/shopify';
import { type ShopProduct } from '../../constants';
import type { ShopifyProduct, ShopifyCollection } from './types';
import { PRODUCT_LIST_FRAGMENT, PRODUCT_FRAGMENT } from './fragments';
import { shopifyProductToShopProduct } from './adapter';

export async function fetchProducts(first: number = 50): Promise<ShopProduct[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query Products($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>({ query, variables: { first } });

  return data.products.edges.map(({ node }) => shopifyProductToShopProduct(node));
}

// Lightweight listing fetch — fewer images, variants, metafields (~70% smaller response)
export async function fetchProductsForListing(first: number = 50): Promise<ShopProduct[]> {
  const query = `
    ${PRODUCT_LIST_FRAGMENT}
    query Products($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            ...ProductListFields
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>({ query, variables: { first } });

  return data.products.edges.map(({ node }) => shopifyProductToShopProduct(node));
}

// In-memory cache for product-by-handle — avoids redundant API calls when revisiting
// a product within the TTL window.
const productByHandleCache = new Map<string, { data: ShopProduct; timestamp: number }>();
const PRODUCT_CACHE_TTL = 60_000; // 60 seconds

export async function fetchProductByHandle(handle: string): Promise<ShopProduct | null> {
  const cached = productByHandleCache.get(handle);
  if (cached && Date.now() - cached.timestamp < PRODUCT_CACHE_TTL) {
    return cached.data;
  }

  const query = `
    ${PRODUCT_FRAGMENT}
    query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        ...ProductFields
      }
    }
  `;

  const data = await shopifyFetch<{
    productByHandle: ShopifyProduct | null;
  }>({ query, variables: { handle } });

  if (!data.productByHandle) return null;

  const result = shopifyProductToShopProduct(data.productByHandle);
  productByHandleCache.set(handle, { data: result, timestamp: Date.now() });

  return result;
}

export async function fetchCollections(first: number = 20): Promise<ShopifyCollection[]> {
  const query = `
    query Collections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collections: { edges: { node: ShopifyCollection }[] };
  }>({ query, variables: { first } });

  return data.collections.edges.map(({ node }) => node);
}
