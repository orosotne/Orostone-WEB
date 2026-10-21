import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';

// lib/shopify.ts reads the store settings when it loads, so they are set before the import.
process.env.VITE_SHOPIFY_STORE_DOMAIN = 'test-shop.myshopify.com';
process.env.VITE_SHOPIFY_STOREFRONT_TOKEN = 'storefront-test';
const { createSampleCheckout } = await import('../../services/shopify/samples');

afterEach(() => mock.restoreAll());

const money = (amount: string) => ({ amount, currencyCode: 'EUR' });
const bundle = {
  shop: { primaryDomain: { host: 'test-shop.myshopify.com' } },
  product: {
    id: 'gid://shopify/Product/1', handle: 'vzorky-orostone', title: 'Vzorky Orostone',
    tags: ['sample-order'], productType: 'Stone Samples', availableForSale: true,
    variants: { nodes: [['1 vzorka', '0.00'], ['2 vzorky', '4.90'], ['3 vzorky', '9.80']].map(([title, amount], i) => ({
      id: `gid://shopify/ProductVariant/${i + 1}`, title, availableForSale: true, requiresShipping: true, price: money(amount),
    })) },
  },
};
const decor = (handle: string, title: string, description: string) =>
  ({ handle, title, tags: [], productType: 'Sinterovaný kameň', description });

/** Answers the three Storefront calls of the sample checkout and returns the cart line it was asked to create. */
function mockStorefront(decors: Record<string, ReturnType<typeof decor>>) {
  const sent: { attributes?: Array<{ key: string; value: string }> } = {};
  mock.method(globalThis, 'fetch', async (_url: string, init: RequestInit) => {
    const { query, variables } = JSON.parse(String(init.body));
    let data: unknown;
    if (query.includes('SampleBundle')) data = bundle;
    else if (query.includes('SampleDecors')) data = decors;
    else {
      const line = variables.input.lines[0];
      sent.attributes = line.attributes;
      const price = bundle.product.variants.nodes.find(variant => variant.id === line.merchandiseId)!.price;
      data = { cartCreate: { userErrors: [], cart: {
        id: 'gid://shopify/Cart/1', checkoutUrl: 'https://test-shop.myshopify.com/cart/c/1', totalQuantity: 1,
        cost: { subtotalAmount: price },
        lines: { nodes: [{ quantity: 1, attributes: line.attributes,
          merchandise: { id: line.merchandiseId, product: { handle: 'vzorky-orostone' } }, cost: { totalAmount: price } }] },
      } } };
    }
    return new Response(JSON.stringify({ data }), { status: 200 });
  });
  return sent;
}

test('shows each sample code right after its name and keeps the private keys for Alfapureo', async () => {
  const sent = mockStorefront({
    decor0: decor('taj-mahal', 'TAJ MAHAL', 'Povrchová úprava: Silk Kód produktu: MN178AR321612'),
    decor1: decor('appennino', 'APPENNINO', 'Povrchová úprava: Gluetech Kód produktu: MN203D321612'),
  });
  await createSampleCheckout({ decorIds: ['taj-mahal', 'appennino'] });
  assert.deepEqual(sent.attributes, [
    { key: 'Počet vzoriek', value: '2' },
    { key: 'Rozmer vzorky', value: '10 × 10 × 1,2 cm' },
    { key: 'Vzorka 1', value: 'TAJ MAHAL' },
    { key: 'Kód vzorky 1', value: 'MN178AR321612' },
    { key: '_sample_handle_1', value: 'taj-mahal' },
    { key: '_sample_code_1', value: 'MN178AR321612' },
    { key: 'Vzorka 2', value: 'APPENNINO' },
    { key: 'Kód vzorky 2', value: 'MN203D321612' },
    { key: '_sample_handle_2', value: 'appennino' },
    { key: '_sample_code_2', value: 'MN203D321612' },
  ]);
});

test('adds no empty code when the description has none', async () => {
  const sent = mockStorefront({ decor0: decor('taj-mahal', 'TAJ MAHAL', 'Povrchová úprava: Silk') });
  await createSampleCheckout({ decorIds: ['taj-mahal'] });
  assert.deepEqual(sent.attributes?.map(attribute => attribute.key),
    ['Počet vzoriek', 'Rozmer vzorky', 'Vzorka 1', '_sample_handle_1']);
});
