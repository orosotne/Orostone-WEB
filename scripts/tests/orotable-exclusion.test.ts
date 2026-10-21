import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';

// lib/shopify reads the store config when it loads, so set it before importing.
process.env.VITE_SHOPIFY_STORE_DOMAIN = 'test-store.myshopify.com';
process.env.VITE_SHOPIFY_STOREFRONT_TOKEN = 'test-token';
const { fetchProducts, fetchProductsForListing, fetchProductByHandle } = await import('../../services/shopify/products');

afterEach(() => mock.restoreAll());

// Orotable tables share the Storefront channel with the slabs (as on 21. 10. 2026).
const product = (handle: string, productType: string, tags: string[]) => ({
  id: `gid://shopify/Product/${handle}`, handle, title: handle, description: '', descriptionHtml: '',
  vendor: 'Orostone', productType, tags, availableForSale: true,
  images: { edges: [] },
  variants: { edges: [{ node: {
    id: `gid://shopify/ProductVariant/${handle}`, title: 'Default Title', availableForSale: true,
    price: { amount: '1000.0', currencyCode: 'EUR' }, compareAtPrice: null,
    selectedOptions: [], image: null, sku: null, weight: null, weightUnit: null,
  } }] },
  priceRange: { minVariantPrice: { amount: '1000.0', currencyCode: 'EUR' }, maxVariantPrice: { amount: '1000.0', currencyCode: 'EUR' } },
  metafields: [],
});
const slab = product('taj-mahal', 'Sintered Stone', ['krémový']);
const table = product('orotable-hylo', 'Orostone Table', ['delivery-3-weeks', 'orostone-table', 'orotable:hylo']);
const tableByTypeOnly = product('orotable-eva', 'Orostone Table', []);
const tableByTagOnly = product('orotable-yakka', '', ['orostone-table']);
const sample = product('vzorky-orostone', 'Stone Samples', ['sample-order']);

const respond = (data: unknown) => async () => new Response(JSON.stringify({ data }), { status: 200 });

test('catalog listing and the build-time catalog leave out Orotable tables', async () => {
  const edges = [slab, table, tableByTypeOnly, tableByTagOnly, sample].map(node => ({ node }));
  for (const fetchCatalog of [fetchProductsForListing, fetchProducts]) {
    mock.method(globalThis, 'fetch', respond({ products: { edges } }));
    assert.deepEqual((await fetchCatalog(50)).map(p => p.id), ['taj-mahal']);
    mock.restoreAll();
  }
});

test('product detail does not open an Orotable table', async () => {
  mock.method(globalThis, 'fetch', respond({ productByHandle: table }));
  assert.equal(await fetchProductByHandle('orotable-hylo'), null);
});

test('product detail still opens a slab', async () => {
  mock.method(globalThis, 'fetch', respond({ productByHandle: slab }));
  assert.equal((await fetchProductByHandle('taj-mahal'))?.id, 'taj-mahal');
});
