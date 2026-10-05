import { SAMPLE_DECORS } from '../../data/sample-decors';
import { shopifyFetch, SHOPIFY_STORE_DOMAIN } from '../../lib/shopify';

export type SampleQuantity = 1 | 2 | 3;
type Money = { amount: string; currencyCode: string };
type Attribute = { key: string; value: string };

function sampleEnv(key: string): string {
  const vite = (import.meta.env as Record<string, string | undefined> | undefined)?.[key];
  return vite?.trim() || (typeof process !== 'undefined' ? process.env[key]?.trim() : '') || '';
}

export const SAMPLE_PRODUCT_HANDLE = sampleEnv('VITE_SHOPIFY_SAMPLE_HANDLE') || 'vzorky-orostone';
export const SAMPLE_PRODUCT_TAG = 'sample-order';
export const SAMPLE_PRODUCT_TYPE = 'Stone Samples';

/** Keep sample bundles out of slab listings, price-per-m² calculations and SEO. */
export function isSampleOrderProduct(product: { handle: string; tags?: string[]; productType?: string }): boolean {
  return product.handle === SAMPLE_PRODUCT_HANDLE
    || product.tags?.some(tag => tag.toLowerCase() === SAMPLE_PRODUCT_TAG) === true
    || product.productType?.toLowerCase() === SAMPLE_PRODUCT_TYPE.toLowerCase();
}

export function quoteSampleOrder(quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 3) {
    throw new Error('Vyberte jednu, dve alebo tri vzorky.');
  }
  const samplesCents = (quantity - 1) * 490;
  return { samplesCents, shippingCents: 250, totalCents: samplesCents + 250 };
}

export function formatSamplePrice(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new Error('Neplatná cena.');
  return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

/** Exact decimal conversion; never round a mismatching Shopify price into acceptance. */
export function sampleMoneyToCents(money: Money): number {
  const match = /^(\d+)(?:\.(\d+))?$/.exec(money.amount);
  if (money.currencyCode !== 'EUR' || !match || /[1-9]/.test((match[2] || '').slice(2))) {
    throw new Error('Cena vzoriek v Shopify nie je správne nastavená v EUR.');
  }
  const cents = Number(match[1]) * 100 + Number((match[2] || '').padEnd(2, '0').slice(0, 2));
  if (!Number.isSafeInteger(cents)) throw new Error('Neplatná cena vzoriek.');
  return cents;
}

export function validateSampleDecorIds(decorIds: readonly string[]): SampleQuantity {
  if (!Array.isArray(decorIds)) throw new Error('Vyberte dekory vzoriek.');
  quoteSampleOrder(decorIds.length);
  if (new Set(decorIds).size !== decorIds.length
    || decorIds.some(id => !SAMPLE_DECORS.some(decor => decor.id === id))) {
    throw new Error('Vyberte najviac tri rôzne dekory z ponuky Orostone.');
  }
  return decorIds.length as SampleQuantity;
}

type SampleProduct = {
  id: string;
  handle: string;
  title: string;
  tags: string[];
  productType: string;
  availableForSale: boolean;
  variants: { nodes: Array<{
    id: string;
    title: string;
    availableForSale: boolean;
    requiresShipping: boolean;
    price: Money;
  }> };
};

export interface SampleBundle {
  handle: string;
  title: string;
  /** Returned by this shop's authenticated Storefront query, not by customer input. */
  checkoutHost?: string;
  variants: Record<SampleQuantity, {
    id: string;
    quantity: SampleQuantity;
    samplesCents: number;
    availableForSale: boolean;
  }>;
}

export function validateSampleBundle(product: SampleProduct | null): SampleBundle {
  if (!product || product.handle !== SAMPLE_PRODUCT_HANDLE
    || !(product.tags.some(tag => tag.toLowerCase() === SAMPLE_PRODUCT_TAG)
      || product.productType.toLowerCase() === SAMPLE_PRODUCT_TYPE.toLowerCase())) {
    throw new Error('Objednávanie vzoriek ešte nie je dostupné. Kontaktujte nás na dopyt@orostone.sk.');
  }
  const variants = {} as SampleBundle['variants'];
  if (product.variants.nodes.length !== 3) throw new Error('V Shopify chýba nastavenie jednej, dvoch a troch vzoriek.');
  if (new Set(product.variants.nodes.map(variant => variant.id)).size !== 3) {
    throw new Error('Varianty vzoriek v Shopify nie sú správne nastavené.');
  }
  for (const variant of product.variants.nodes) {
    const match = /^(1 vzorka|2 vzorky|3 vzorky)$/i.exec(variant.title.trim());
    if (!match) throw new Error('Varianty vzoriek v Shopify nie sú správne nastavené.');
    const quantity = Number(match[1][0]) as SampleQuantity;
    const samplesCents = sampleMoneyToCents(variant.price);
    if (variants[quantity] || !variant.requiresShipping || !/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(variant.id)
      || samplesCents !== quoteSampleOrder(quantity).samplesCents) {
      throw new Error('Ceny alebo doprava vzoriek v Shopify nie sú správne nastavené.');
    }
    variants[quantity] = { id: variant.id, quantity, samplesCents, availableForSale: product.availableForSale && variant.availableForSale };
  }
  return { handle: product.handle, title: product.title, variants };
}

export async function fetchSampleBundle(): Promise<SampleBundle> {
  const result = await shopifyFetch<{ product: SampleProduct | null; shop: { primaryDomain: { host: string } } }>({
    query: `query SampleBundle($handle: String!) {
      shop { primaryDomain { host } }
      product(handle: $handle) {
        id handle title tags productType availableForSale
        variants(first: 10) { nodes { id title availableForSale requiresShipping price { amount currencyCode } } }
      }
    }`,
    variables: { handle: SAMPLE_PRODUCT_HANDLE },
  });
  const bundle = validateSampleBundle(result.product);
  return { ...bundle, checkoutHost: result.shop?.primaryDomain.host || SHOPIFY_STORE_DOMAIN };
}

/** Accept only Shopify checkout routes for this store or its configured custom host. */
export function validateSampleCheckoutUrl(value: string, primaryCheckoutHost?: string): string {
  let url: URL;
  try { url = new URL(value); } catch { throw new Error('Shopify nevrátil platnú stránku platby.'); }
  const hosts = [SHOPIFY_STORE_DOMAIN, primaryCheckoutHost, sampleEnv('VITE_SHOPIFY_CHECKOUT_DOMAIN'), 'checkout.shopify.com'].filter(Boolean);
  const hostAllowed = hosts.some(host => url.hostname === host.toLowerCase());
  const pathAllowed = /^\/(?:checkouts?\/|cart\/c\/)/.test(url.pathname);
  if (url.protocol !== 'https:' || url.username || url.password || url.port || !hostAllowed || !pathAllowed) {
    throw new Error('Shopify nevrátil overenú stránku platby.');
  }
  return url.href;
}

export interface SampleCheckout {
  /** A cart is ready for checkout; this is not a paid or confirmed order. */
  status: 'checkout_ready';
  cartId: string;
  checkoutUrl: string;
  subtotalCents: number;
  quantity: SampleQuantity;
  /** The delivery quote must also be configured and verified in Shopify checkout. */
  quotedShippingCents: number;
  expectedTotalCents: number;
}

type CartResult = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money };
  lines: { nodes: Array<{
    quantity: number;
    attributes: Attribute[];
    merchandise: { id: string; product: { handle: string } };
    cost: { totalAmount: Money };
  }> };
};

/** Single cartCreate attempt, without touching the customer's slab cart. */
export async function createSampleCheckout({ decorIds }: { decorIds: string[] }): Promise<SampleCheckout> {
  const quantity = validateSampleDecorIds(decorIds);
  const bundle = await fetchSampleBundle();
  const variant = bundle.variants[quantity];
  if (!variant.availableForSale) throw new Error('Zvolený počet vzoriek momentálne nie je dostupný.');

  // Query variables carry handles; no user-provided text is interpolated into GraphQL.
  const decorResult = await shopifyFetch<Record<string, { handle: string; title: string; tags: string[]; productType: string } | null>>({
    query: `query SampleDecors(${decorIds.map((_, i) => `$handle${i}: String!`).join(', ')}) {
      ${decorIds.map((_, i) => `decor${i}: product(handle: $handle${i}) { handle title tags productType }`).join('\n')}
    }`,
    variables: Object.fromEntries(decorIds.map((id, i) => [`handle${i}`, id])),
  });
  const attributes: Attribute[] = [{ key: 'Počet vzoriek', value: String(quantity) }, { key: 'Rozmer vzorky', value: '10 × 10 × 1,2 cm' }];
  decorIds.forEach((id, i) => {
    const product = decorResult[`decor${i}`];
    if (!product || product.handle !== id || !product.title.trim() || isSampleOrderProduct(product)) {
      throw new Error('Niektorý zo zvolených dekorov už nie je dostupný v ponuke. Upravte svoj výber.');
    }
    attributes.push({ key: `Vzorka ${i + 1}`, value: product.title }, { key: `_sample_handle_${i + 1}`, value: id });
  });

  const result = await shopifyFetch<{ cartCreate: { cart: CartResult | null; userErrors: Array<{ message: string }> } }>({
    query: `mutation SampleCheckout($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id checkoutUrl totalQuantity cost { subtotalAmount { amount currencyCode } }
          lines(first: 5) { nodes {
            quantity attributes { key value }
            merchandise { ... on ProductVariant { id product { handle } } }
            cost { totalAmount { amount currencyCode } }
          } }
        }
        userErrors { message }
      }
    }`,
    variables: { input: {
      buyerIdentity: { countryCode: 'SK' },
      attributes: [{ key: '_orostone_flow', value: 'samples' }],
      lines: [{ merchandiseId: variant.id, quantity: 1, attributes }],
    } },
  });
  const { cart, userErrors } = result.cartCreate;
  if (userErrors.length || !cart) throw new Error('Nepodarilo sa pripraviť platbu vzoriek. Skúste to znova alebo nás kontaktujte.');
  const line = cart.lines.nodes[0];
  const subtotalCents = sampleMoneyToCents(cart.cost.subtotalAmount);
  if (cart.totalQuantity !== 1 || cart.lines.nodes.length !== 1 || line.quantity !== 1
    || line.merchandise.id !== variant.id || line.merchandise.product.handle !== SAMPLE_PRODUCT_HANDLE
    || subtotalCents !== variant.samplesCents || sampleMoneyToCents(line.cost.totalAmount) !== variant.samplesCents
    || attributes.some(attribute => !line.attributes.some(actual => actual.key === attribute.key && actual.value === attribute.value))) {
    throw new Error('Shopify nevrátil očakávané vzorky a cenu. Platba nebola otvorená. Skúste to znova.');
  }
  const checkoutUrl = validateSampleCheckoutUrl(cart.checkoutUrl, bundle.checkoutHost);
  const quote = quoteSampleOrder(quantity);
  return { status: 'checkout_ready', cartId: cart.id, checkoutUrl, subtotalCents, quantity, quotedShippingCents: quote.shippingCents, expectedTotalCents: quote.totalCents };
}
