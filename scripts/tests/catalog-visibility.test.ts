import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';
import { readFileSync } from 'node:fs';

// Configure before importing the Storefront client; all network calls are mocked.
process.env.VITE_SHOPIFY_STORE_DOMAIN = 'catalog-test.myshopify.com';
process.env.VITE_SHOPIFY_STOREFRONT_TOKEN = 'test-only-placeholder';
const { isMainCatalogProduct } = await import('../../services/shopify/catalog-visibility');
const { fetchProducts, fetchProductsForListing, fetchProductByHandle } = await import('../../services/shopify/products');
afterEach(() => mock.restoreAll());

const slabHandles: string[] = JSON.parse(readFileSync(new URL('../../data/shop-products-fallback.json', import.meta.url), 'utf8'))
  .map((product: { id: string }) => product.id);
const tableHandles = ['yakka', 'chelsea', 'cardiff', 'giro-circle', 'allure', 'eva', 'statement', 'pisa-tower', 'justin', 'hylo']
  .map((slug) => `orotable-${slug}`);
function product(handle: string, identity: { tags?: string[]; productType?: string } = {}) {
  return {
    id: `gid://shopify/Product/${handle}`, handle, title: handle,
    description: '', descriptionHtml: '', vendor: 'Orostone',
    productType: 'sintered-stone', tags: [], availableForSale: true,
    images: { edges: [] },
    variants: { edges: [{ node: {
      id: `gid://shopify/ProductVariant/${handle}`, title: 'Default Title',
      availableForSale: true, price: { amount: '1990.00', currencyCode: 'EUR' },
      selectedOptions: [], sku: handle, weight: 0,
    } }] },
    ...identity,
  };
}

test('each independent Orotable marker excludes a product without hiding ordinary catalog items', () => {
  for (const identity of [
    { handle: 'orotable-yakka' },
    { handle: 'renamed-table', tags: ['orostone-table'] },
    { handle: 'renamed-table', tags: ['orotable:yakka'] },
    { handle: 'renamed-table', productType: 'Orostone Table' },
    { handle: 'renamed-table', tags: [' OROSTONE-TABLE '] },
  ]) assert.equal(isMainCatalogProduct(identity), false, JSON.stringify(identity));
  for (const handle of slabHandles) assert.equal(isMainCatalogProduct({ handle, productType: 'sintered-stone' }), true);
  assert.equal(isMainCatalogProduct({ handle: 'accessory', productType: 'accessories' }), true);
  assert.equal(isMainCatalogProduct({ handle: 'vzorky-orostone' }), false);
  assert.equal(isMainCatalogProduct({ handle: 'renamed-samples', tags: ['sample-order'] }), false);
});

test('live listing and build fallback keep all 12 slabs from a channel containing 10 tables and samples', async () => {
  assert.equal(slabHandles.length, 12, 'the existing twelve-slab catalog must remain intact');
  const mixed = [
    ...slabHandles.map((handle) => product(handle)),
    ...tableHandles.map((handle) => product(handle, { productType: 'Orostone Table', tags: ['orostone-table'] })),
    product('vzorky-orostone', { productType: 'Stone Samples', tags: ['sample-order'] }),
  ];
  mock.method(globalThis, 'fetch', async () => Response.json({ data: { products: { edges: mixed.map((node) => ({ node })) } } }));
  for (const load of [fetchProducts, fetchProductsForListing]) {
    const catalog = await load(50);
    assert.deepEqual(catalog.map((item) => item.id), slabHandles);
    assert.equal(catalog.some((item) => item.id.startsWith('orotable-')), false);
  }
});

test('direct product handles cannot render a table through the slab adapter', async () => {
  mock.method(globalThis, 'fetch', async (_url: string, init?: RequestInit) => {
    const { variables } = JSON.parse(String(init?.body));
    return Response.json({ data: { productByHandle: product(variables.handle) } });
  });
  for (const handle of tableHandles) assert.equal(await fetchProductByHandle(handle), null);
  const slab = await fetchProductByHandle(slabHandles[0]);
  assert.equal(slab?.id, slabHandles[0]);
  assert.equal(slab?.category, 'sintered-stone');
});
