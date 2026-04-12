/**
 * UTM parameter capture & persistence.
 *
 * On first page load, extracts utm_source / utm_medium / utm_campaign /
 * utm_content / utm_term from the URL and stores them in sessionStorage.
 * Subsequent page views within the same session reuse the stored values.
 *
 * Exported helpers:
 *  - getStoredUTM()          → read stored params (or null)
 *  - getUTMForCheckout()     → URL query string fragment for Shopify checkout
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
type UTMKey = (typeof UTM_KEYS)[number];
export type UTMParams = Partial<Record<UTMKey, string>>;

const STORAGE_KEY = 'orostone_utm';

/** Parse UTM params from the current URL. Returns null if none present. */
function parseUTMFromURL(): UTMParams | null {
  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};
  let found = false;

  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) {
      utm[key] = val;
      found = true;
    }
  }

  return found ? utm : null;
}

/** Capture UTM params from URL (if present) and persist to sessionStorage.
 *  Call once on app init — new UTM params overwrite previous ones. */
export function captureUTM(): void {
  const fromURL = parseUTMFromURL();
  if (fromURL) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromURL));
    } catch { /* quota / private browsing — silently ignore */ }
  }
}

/** Read stored UTM params. Returns null when nothing stored. */
export function getStoredUTM(): UTMParams | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UTMParams) : null;
  } catch {
    return null;
  }
}

/** Build a query-string fragment (without leading &/?) for appending to checkout URLs. */
export function getUTMForCheckout(): string {
  const utm = getStoredUTM();
  if (!utm) return '';

  const parts: string[] = [];
  for (const [k, v] of Object.entries(utm)) {
    if (v) parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  }
  return parts.join('&');
}
