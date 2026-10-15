// Pop-up B „5 % na kameň“ (components/UI/DiscountPopup.tsx): codes, storage keys and the pure decision
// whether to show it. Kept free of browser and Vite APIs so scripts/tests can run it under node:test.
//
// Owner's rules (15. 10. 2026): B goes to visitors who closed pop-up A („Prvá vzorka s dopravou zadarmo“)
// without subscribing, on a later visit at least 3 days after they closed A, only on "/" or a product page,
// 20 s after load. Never both pop-ups in one visit, never to a subscriber, at most once.
// Ad traffic with ?ponuka=zlava5 sees B after 3 s without the 3-day rule (still never to subscribers,
// never on checkout, the thank-you page, the sample order form or legal pages).

/** Welcome codes. Every new subscriber gets both in the welcome e-mail (Klaviyo, fallback send-newsletter-welcome). */
export const SAMPLE_SHIPPING_CODE = 'VITAJTE'; // free shipping of the first sample, once per customer
export const SLAB_DISCOUNT_CODE = 'WELCOME5'; // 5 % on the 12 decor slabs, once per customer, no combining

/**
 * Photo of pop-up B, the one place to swap it (the final hero comes from Higgsfield).
 * `label`: visualizations are labelled (STYLE_GUIDE › Photos). Any aspect ratio works, the box crops it.
 */
export const DISCOUNT_POPUP_IMAGE = {
  src: '/images/kuchyne/roman-travertine-hrana-1440.webp',
  label: 'Vizualizácia s dekorom Roman Travertine',
} as const;

/** localStorage: 'shown' while it is open, then 'dismissed' or 'done'. Any value means B never shows again. */
export const DISCOUNT_POPUP_KEY = 'orostone-discount-popup-v1';
/** sessionStorage: B was shown in this visit, so pop-up A stays away. */
export const DISCOUNT_POPUP_SESSION_KEY = 'orostone-discount-popup-shown';
/** sessionStorage: the visit came from an ad with ?ponuka=zlava5 (the parameter is gone after the first click). */
export const AD_OFFER_SESSION_KEY = 'orostone-discount-popup-ad';

export const AD_OFFER_PARAM = 'ponuka';
export const AD_OFFER_VALUE = 'zlava5';

export const DISCOUNT_POPUP_DELAY_MS = 20_000;
export const AD_OFFER_DELAY_MS = 3_000;
/** How long after closing pop-up A the visitor may see B. */
export const WAIT_AFTER_NEWSLETTER_POPUP_MS = 3 * 24 * 60 * 60 * 1000;

/** Pages where B may show on the normal path: the homepage and product pages. */
export const isDiscountPopupPage = (pathname: string): boolean =>
  pathname === '/' || /^\/produkt\/[^/]+\/?$/.test(pathname);

/** Pages where B never shows, not even for ad traffic: order flow, sample order form, legal and policy pages. */
const NEVER_ON = [
  '/checkout',
  '/objednavka-dokoncena',
  '/vzorky',
  '/vop',
  '/podmienky-rezervacie-ceny',
  '/ochrana-sukromia',
  '/cookies',
  '/odstupenie-od-zmluvy',
  '/reklamacie',
  '/doprava',
];

export const isDiscountPopupBlockedPage = (pathname: string): boolean => {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return NEVER_ON.some((blocked) => path === blocked || path.startsWith(`${blocked}/`));
};

/** True when the query string carries the ad offer (?ponuka=zlava5). */
export const hasAdOfferParam = (search: string): boolean => {
  try {
    return new URLSearchParams(search).get(AD_OFFER_PARAM)?.trim().toLowerCase() === AD_OFFER_VALUE;
  } catch {
    return false;
  }
};

export interface DiscountPopupInput {
  pathname: string;
  /** Date.now() */
  now: number;
  /** Pop-up A's localStorage value (NEWSLETTER_POPUP_KEY): null, 'dismissed' or 'done'. */
  newsletterState: string | null;
  /** When the visitor closed pop-up A (ISO), NEWSLETTER_POPUP_DISMISSED_AT_KEY. */
  newsletterDismissedAt: string | null;
  /** Pop-up A was shown in this visit (sessionStorage). */
  newsletterShownThisVisit: boolean;
  /** B's own localStorage value (DISCOUNT_POPUP_KEY). */
  discountState: string | null;
  /** The visit came from an ad with ?ponuka=zlava5. */
  adOffer: boolean;
}

export type DiscountPopupReason =
  | 'subscribed'
  | 'already-shown'
  | 'blocked-page'
  | 'newsletter-popup-this-visit'
  | 'ad-offer'
  | 'not-a-popup-page'
  | 'newsletter-popup-not-closed'
  | 'too-soon'
  | 'eligible';

export interface DiscountPopupDecision {
  show: boolean;
  /** Delay before showing, 0 when `show` is false. */
  delayMs: number;
  reason: DiscountPopupReason;
  /**
   * Visitors who closed pop-up A before its close time was recorded: store this as the close time,
   * so their 3 days start now.
   */
  stampDismissedAt?: string;
}

const parseTime = (iso: string | null): number | null => {
  if (!iso) return null;
  const time = Date.parse(iso);
  return Number.isFinite(time) ? time : null;
};

export function decideDiscountPopup(input: DiscountPopupInput): DiscountPopupDecision {
  const { pathname, now, newsletterState, newsletterDismissedAt, newsletterShownThisVisit, discountState, adOffer } = input;

  let dismissedAt = parseTime(newsletterDismissedAt);
  let stampDismissedAt: string | undefined;
  if (newsletterState === 'dismissed' && dismissedAt === null) {
    dismissedAt = now;
    stampDismissedAt = new Date(now).toISOString();
  }
  const no = (reason: DiscountPopupReason): DiscountPopupDecision => ({ show: false, delayMs: 0, reason, stampDismissedAt });

  if (newsletterState === 'done' || discountState === 'done') return no('subscribed');
  if (discountState) return no('already-shown');
  if (isDiscountPopupBlockedPage(pathname)) return no('blocked-page');
  if (newsletterShownThisVisit) return no('newsletter-popup-this-visit');

  if (adOffer) return { show: true, delayMs: AD_OFFER_DELAY_MS, reason: 'ad-offer', stampDismissedAt };

  if (!isDiscountPopupPage(pathname)) return no('not-a-popup-page');
  if (newsletterState !== 'dismissed' || dismissedAt === null) return no('newsletter-popup-not-closed');
  if (now - dismissedAt < WAIT_AFTER_NEWSLETTER_POPUP_MS) return no('too-soon');

  return { show: true, delayMs: DISCOUNT_POPUP_DELAY_MS, reason: 'eligible', stampDismissedAt };
}
