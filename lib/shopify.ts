// ===========================================
// SHOPIFY STOREFRONT API CLIENT
// ===========================================
// Konfiguracia a GraphQL klient pre Shopify Storefront API
// Dokumentacia: https://shopify.dev/docs/api/storefront

function readViteShopifyEnv(key: 'VITE_SHOPIFY_STORE_DOMAIN' | 'VITE_SHOPIFY_STOREFRONT_TOKEN'): string {
  try {
    const env = import.meta.env as Record<string, string | undefined> | undefined;
    const v = env?.[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
  } catch {
    /* import.meta.env nemusí existovať v Node (sync skript) */
  }
  if (typeof process !== 'undefined' && process.env[key]?.trim()) {
    return process.env[key]!.trim();
  }
  return '';
}

const SHOPIFY_STORE_DOMAIN = readViteShopifyEnv('VITE_SHOPIFY_STORE_DOMAIN');
const SHOPIFY_STOREFRONT_TOKEN = readViteShopifyEnv('VITE_SHOPIFY_STOREFRONT_TOKEN');
const STOREFRONT_API_VERSION = '2024-10';

// ===========================================
// HELPERS
// ===========================================

export const isShopifyConfigured = (): boolean => {
  return Boolean(SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_TOKEN);
};

export const getStorefrontApiUrl = (): string => {
  return `https://${SHOPIFY_STORE_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`;
};

// ===========================================
// GRAPHQL CLIENT
// ===========================================

export async function shopifyFetch<T = unknown>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify nie je nakonfigurovaný. Skontrolujte VITE_SHOPIFY_STORE_DOMAIN a VITE_SHOPIFY_STOREFRONT_TOKEN.');
  }

  const response = await fetch(getStorefrontApiUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify API chyba: ${response.status} - ${text}`);
  }

  const json = await response.json();

  if (json.errors) {
    const messages = json.errors.map((e: { message: string }) => e.message).join(', ');
    throw new Error(`Shopify GraphQL chyba: ${messages}`);
  }

  return json.data as T;
}

// ===========================================
// EXPORTS
// ===========================================

export { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN };
