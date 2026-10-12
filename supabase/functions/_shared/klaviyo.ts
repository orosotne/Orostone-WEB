// ===========================================
// _shared/klaviyo.ts — serverové API Klaviya pre newsletter
// ===========================================
// Spoločné pre subscribe-newsletter (prihlásenie z webu) a sync-newsletter-unsubscribes
// (denné zosúladenie odhlásení s tabuľkou newsletter_subscribers).
//
//   KLAVIYO_NEWSLETTER_LIST_ID  ID zoznamu „Newsletter – web“ (nie je tajné).
//   KLAVIYO_INQUIRY_LIST_ID     ID zoznamu „Dopyty – LP1, LP2, e-mail (len k dopytu)“ (nie je
//                               tajné, nepovinné). Bez nastavenia platí TKAHuh, prázdna hodnota
//                               vyraďovanie vypne. Kto sa prihlási na odber, toho z neho
//                               subscribe-newsletter vyradí.
//   KLAVIYO_PRIVATE_API_KEY     súkromný kľúč Klaviya (Lists, Profiles, Subscriptions:
//                               Full). Len v Supabase secrets, nikdy v kóde ani v logu.

export const KLAVIYO_LIST_ID = Deno.env.get('KLAVIYO_NEWSLETTER_LIST_ID')?.trim() || '';
export const KLAVIYO_INQUIRY_LIST_ID = (Deno.env.get('KLAVIYO_INQUIRY_LIST_ID') ?? 'TKAHuh').trim();
const KLAVIYO_API_KEY = Deno.env.get('KLAVIYO_PRIVATE_API_KEY')?.trim() || '';
const KLAVIYO_REVISION = '2026-07-15';

/** Klaviyo je zapnuté, len keď sú nastavené zoznam aj kľúč. */
export const klaviyoEnabled = (): boolean => Boolean(KLAVIYO_LIST_ID && KLAVIYO_API_KEY);

/**
 * Potlačenia, ktoré bulk subscribe zruší (a neoverený formulár zrušiť nesmie). Spam: dokumentácia
 * bulk subscribe píše SPAM_REPORT, profil SPAM_COMPLAINT, berieme oboje.
 */
const OPT_OUT_REASONS = new Set(['UNSUBSCRIBE', 'SPAM_REPORT', 'SPAM_COMPLAINT', 'USER_SUPPRESSED']);

export function klaviyoPost(path: string, payload: unknown): Promise<Response> {
  return fetch(`https://a.klaviyo.com/api/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
      revision: KLAVIYO_REVISION,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000),
  });
}

export function klaviyoDelete(path: string, payload: unknown): Promise<Response> {
  return fetch(`https://a.klaviyo.com/api/${path}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
      revision: KLAVIYO_REVISION,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000),
  });
}

export function klaviyoGet(pathAndQuery: string): Promise<Response> {
  return fetch(`https://a.klaviyo.com/api/${pathAndQuery}`, {
    headers: {
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      Accept: 'application/vnd.api+json',
      revision: KLAVIYO_REVISION,
    },
    signal: AbortSignal.timeout(5000),
  });
}

/** Úvodzovky a spätné lomky by filter Klaviya rozbili, také e-maily do filtra nepustíme. */
export const filterSafe = (email: string): boolean => !/["\\]/.test(email);

/** Filter Klaviya na jeden e-mail, alebo null, keď by ho e-mail rozbil. */
export function emailFilter(email: string): string | null {
  return filterSafe(email) ? encodeURIComponent(`equals(email,"${email}")`) : null;
}

/** E-mailový marketing z profilu Klaviya (`additional-fields[profile]=subscriptions`). */
export interface EmailMarketing {
  consent?: unknown;
  suppression?: Array<{ reason?: unknown } | null>;
  list_suppressions?: Array<{ list_id?: unknown; reason?: unknown } | null>;
}

export function emailMarketing(profile: unknown): EmailMarketing | null {
  const m = (profile as { attributes?: { subscriptions?: { email?: { marketing?: unknown } } } } | null | undefined)
    ?.attributes?.subscriptions?.email?.marketing;
  return m && typeof m === 'object' ? (m as EmailMarketing) : null;
}

/**
 * Odhlásený alebo potlačený celkovo, alebo len z nášho zoznamu? Odhlásenie zo zoznamu je
 * v `list_suppressions` a súhlas pri ňom môže ostať SUBSCRIBED (účet bez globálneho odhlásenia).
 */
export function optedOut(m: EmailMarketing): boolean {
  const optOut = (s: { reason?: unknown } | null) => OPT_OUT_REASONS.has(String(s?.reason));
  const global = Array.isArray(m.suppression) && m.suppression.some(optOut);
  const ourList = Array.isArray(m.list_suppressions)
    && m.list_suppressions.some((s) => s?.list_id === KLAVIYO_LIST_ID && optOut(s));
  return m.consent === 'UNSUBSCRIBED' || global || ourList;
}
