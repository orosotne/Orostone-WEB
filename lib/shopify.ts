// ===========================================
// SHOPIFY STOREFRONT API CLIENT
// ===========================================
// Konfiguracia a GraphQL klient pre Shopify Storefront API
// Dokumentacia: https://shopify.dev/docs/api/storefront
//
// REFACTOR (finding f09 + f01): every request now runs under an abort-backed
// timeout. A hung Storefront request previously black-holed the whole catalog
// (isLoading stuck forever, offline fallback unreachable) and left cart
// mutations open to timeout-then-retry double-adds. `AbortSignal.timeout` is
// supported in all evergreen browsers and Node >=18, so it also covers the
// build-time sync/prerender scripts. Behaviour is otherwise identical: the same
// resolved shape, the same thrown Error messages.

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
const STOREFRONT_API_VERSION = '2025-01';

/** Default network deadline for a single Storefront request. */
const DEFAULT_TIMEOUT_MS = 10_000;

// ===========================================
// HELPERS
// ===========================================

export const isShopifyConfigured = (): boolean => {
  return Boolean(SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_TOKEN);
};

export const getStorefrontApiUrl = (): string => {
  return `https://${SHOPIFY_STORE_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`;
};

/**
 * Thrown when a request is aborted by its own timeout (or a caller-supplied
 * signal). Callers that must not retry non-idempotent mutations use this type
 * to distinguish "the request was cut off" from "Shopify rejected the input".
 */
export class ShopifyTimeoutError extends Error {
  constructor(message = 'Požiadavka vypršala. Skúste to znova.') {
    super(message);
    this.name = 'ShopifyTimeoutError';
  }
}

// ===========================================
// GRAPHQL CLIENT
// ===========================================

export async function shopifyFetch<T = unknown>({
  query,
  variables = {},
  signal,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: {
  query: string;
  variables?: Record<string, unknown>;
  /** Optional caller signal; composed with the internal timeout. */
  signal?: AbortSignal;
  timeoutMs?: number;
}): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify nie je nakonfigurovaný. Skontrolujte VITE_SHOPIFY_STORE_DOMAIN a VITE_SHOPIFY_STOREFRONT_TOKEN.');
  }

  // Compose the internal deadline with any caller signal so both can abort the
  // real fetch (not just reject a dangling promise, as the old Promise.race did).
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const composedSignal = signal ? anySignal([signal, timeoutSignal]) : timeoutSignal;

  let response: Response;
  try {
    response = await fetch(getStorefrontApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      signal: composedSignal,
    });
  } catch (err) {
    // fetch rejects with an AbortError when the timeout (or caller) fires.
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ShopifyTimeoutError();
    }
    throw err;
  }

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

/**
 * Minimal AbortSignal.any polyfill — AbortSignal.any is not yet in every target
 * baseline (Safari 17.3). Aborts the returned signal when any input aborts.
 */
function anySignal(signals: AbortSignal[]): AbortSignal {
  if (typeof (AbortSignal as unknown as { any?: unknown }).any === 'function') {
    return (AbortSignal as unknown as { any: (s: AbortSignal[]) => AbortSignal }).any(signals);
  }
  const controller = new AbortController();
  const onAbort = (s: AbortSignal) => controller.abort(s.reason);
  for (const s of signals) {
    if (s.aborted) { controller.abort(s.reason); break; }
    s.addEventListener('abort', () => onAbort(s), { once: true });
  }
  return controller.signal;
}

// ===========================================
// EXPORTS
// ===========================================

export { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN };
