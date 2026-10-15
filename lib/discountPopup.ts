// Pop-up B „5 % na váš kameň“ (components/UI/DiscountPopup.tsx) and the rules both newsletter pop-ups share: codes,
// terms, storage keys and the pure decisions when to show them. Kept free of browser and Vite APIs so scripts/tests can
// run it under node:test.
//
// Owner's rules (15. 10. 2026): B goes to visitors who closed pop-up A („Prvá vzorka s dopravou zadarmo“)
// without subscribing, on a later visit at least 3 days after they closed A, only on "/" or a product page,
// 20 s after load. Never both pop-ups in one visit, never to a subscriber, at most once.
// Ad traffic with ?ponuka=zlava5 was promised the 5 %: it sees B after 3 s without the 3-day rule, even if it closed
// B before (at most once per visit), but only on the homepage, product, category and blog article pages, and never
// to a subscriber. Pop-up A stands down for the whole visit.

/**
 * Welcome codes. Every new web subscriber gets both in welcome e-mail 01. Deploy order
 * (docs/pravne-texty/jazykova-kontrola.md › Kolo 8): (1) template 01 with WELCOME5 uploaded to Klaviyo (XkFccQ,
 * preview text in VLzuhC) with the owner's OK; (2) merge this branch, the web deploys automatically; (3) right after,
 * with the owner's OK, deploy send-newsletter-welcome from main. Between (2) and (3) only the fallback e-mail (sent
 * only when Klaviyo rejects the sign-up) still lacks WELCOME5, a short and deliberate window.
 */
export const SAMPLE_SHIPPING_CODE = 'VITAJTE'; // free shipping of the first sample, once per customer
export const SLAB_DISCOUNT_CODE = 'WELCOME5'; // 5 % on the 12 decor slabs, once per customer, no combining

/**
 * Short terms of WELCOME5, the same in both pop-ups (the e-mails carry the full wording). U+00A0 before % and after
 * one-letter words, as &nbsp; in JSX.
 */
export const SLAB_CODE_TERMS = `Kód ${SLAB_DISCOUNT_CODE} môžete použiť iba raz a\u00A0len pri objednávke platní v\u00A0e-shope orostone.sk. Nedá sa kombinovať so žiadnou inou zľavou, ani so zľavou 20\u00A0% od troch platní.`;

/**
 * Photo of pop-up B, the one place to swap it (the final hero comes from Higgsfield): `base` names the files
 * `<base>-720.avif`, `<base>-1440.avif`, `<base>-720.webp` and `<base>-1440.webp` in public/.
 * `label`: visualizations are labelled (STYLE_GUIDE › Photos). Any aspect ratio works, the box crops it.
 */
export const DISCOUNT_POPUP_IMAGE = {
  base: '/images/kuchyne/roman-travertine-hrana',
  widths: [720, 1440],
  label: 'Vizualizácia s\u00A0dekorom Roman Travertine',
} as const;

/**
 * Phones (below 640 px): the photo is a band at most 460 px wide and 128 px tall, so the 720 px file is enough and the
 * slow in-app browsers of ad traffic get the small one. From 640 px it is a column at least 480 px tall that
 * object-cover fills with the square photo, so it renders about 480 px wide and the browser picks 720 or 1440 by density.
 */
export const DISCOUNT_POPUP_PHONE_MEDIA = '(max-width: 639px)';
export const DISCOUNT_POPUP_WIDE_MEDIA = '(min-width: 640px)';
export const DISCOUNT_POPUP_IMAGE_SIZES = '480px';

/** srcset of the column (from 640 px): every width in DISCOUNT_POPUP_IMAGE.widths. */
export const discountPopupSrcSet = (format: 'avif' | 'webp'): string =>
  DISCOUNT_POPUP_IMAGE.widths.map((w) => `${DISCOUNT_POPUP_IMAGE.base}-${w}.${format} ${w}w`).join(', ');

/** The phone band's file: the smallest width. */
export const discountPopupPhoneSrc = (format: 'avif' | 'webp'): string =>
  `${DISCOUNT_POPUP_IMAGE.base}-${DISCOUNT_POPUP_IMAGE.widths[0]}.${format}`;

/** The <img> fallback for browsers without <picture> support. */
export const DISCOUNT_POPUP_IMAGE_FALLBACK = discountPopupPhoneSrc('webp');

/** localStorage: 'shown' while it is open, then 'dismissed' or 'done'. */
export const DISCOUNT_POPUP_KEY = 'orostone-discount-popup-v1';
/** sessionStorage: B was shown in this visit, so pop-up A stays away and B does not come back. */
export const DISCOUNT_POPUP_SESSION_KEY = 'orostone-discount-popup-shown';
/**
 * sessionStorage: the visit came from an ad with ?ponuka=zlava5 (the parameter is gone after the first click).
 * Written only once the cookie bar is answered, like the other pop-up keys.
 */
export const AD_OFFER_SESSION_KEY = 'orostone-discount-popup-ad';

export const AD_OFFER_PARAM = 'ponuka';
export const AD_OFFER_VALUE = 'zlava5';

/** Subscription source sent to subscribe-newsletter (at most 50 characters). */
export const DISCOUNT_POPUP_SOURCE = 'popup_zlava5';
export const DISCOUNT_POPUP_AD_SOURCE = 'popup_zlava5_reklama';

export const DISCOUNT_POPUP_DELAY_MS = 20_000;
export const AD_OFFER_DELAY_MS = 3_000;
/** How long after closing pop-up A the visitor may see B. */
export const WAIT_AFTER_NEWSLETTER_POPUP_MS = 3 * 24 * 60 * 60 * 1000;

const trimSlash = (pathname: string) => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname);

/** Pages where B may show on the normal path: the homepage and product pages. */
export const isDiscountPopupPage = (pathname: string): boolean =>
  pathname === '/' || /^\/produkt\/[^/]+\/?$/.test(pathname);

/**
 * Pages where ad traffic may see B: the homepage, product pages, category listings (/kategoria/:slug and
 * /kategoria/:slug/:subCategory) and blog articles (/blog/:slug), the pages an ad lands on. Everything else
 * (checkout, the thank-you page, /vzorky, legal and info pages, /kontakt, /kariera, the 404 page) stays clear.
 */
export const isAdOfferPage = (pathname: string): boolean => {
  const path = trimSlash(pathname);
  return (
    path === '/' ||
    /^\/produkt\/[^/]+$/.test(path) ||
    /^\/kategoria\/[^/]+(\/[^/]+)?$/.test(path) ||
    /^\/blog\/[^/]+$/.test(path)
  );
};

/** True when the query string carries the ad offer (?ponuka=zlava5). */
export const hasAdOfferParam = (search: string): boolean => {
  try {
    return new URLSearchParams(search).get(AD_OFFER_PARAM)?.trim().toLowerCase() === AD_OFFER_VALUE;
  } catch {
    return false;
  }
};

// The landing URL's ?ponuka=zlava5, kept in memory for the whole page load: the parameter is gone after the first
// click, and AD_OFFER_SESSION_KEY may only be written once the cookie bar is answered.
let adOfferLanding = false;

/** Call once at app start with window.location.search (EshopApp, next to captureUTM). */
export const rememberAdOfferLanding = (search: string): void => {
  if (hasAdOfferParam(search)) adOfferLanding = true;
};

/** The visit came from an ad promising 5 %: the landing URL, the current URL or the session flag says so. */
export const isAdOfferVisit = (search: string, adSessionFlag: string | null): boolean =>
  adOfferLanding || hasAdOfferParam(search) || adSessionFlag !== null;

/** What closing a pop-up stores: 'dismissed', unless the visitor subscribed in it ('done' stays, null = keep). */
export const nextStateOnDismiss = (stored: string | null): 'dismissed' | null =>
  stored === 'done' ? null : 'dismissed';

export interface NewsletterPopupInput {
  /** Pop-up A's localStorage value (NEWSLETTER_POPUP_KEY): null, 'dismissed' or 'done'. */
  newsletterState: string | null;
  /** B's localStorage value (DISCOUNT_POPUP_KEY). */
  discountState: string | null;
  /** B was shown in this visit (sessionStorage). */
  discountShownThisVisit: boolean;
  /** The visit came from an ad with ?ponuka=zlava5. */
  adOffer: boolean;
}

/**
 * Pop-up A („Prvá vzorka s dopravou zadarmo“): once, never to a subscriber, never in a visit that showed B, and not
 * to ad traffic, which was promised B's 5 %.
 */
export function shouldShowNewsletterPopup(input: NewsletterPopupInput): boolean {
  const { newsletterState, discountState, discountShownThisVisit, adOffer } = input;
  if (newsletterState !== null || discountState === 'done') return false;
  if (discountShownThisVisit) return false;
  return !adOffer;
}

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
  /** B was shown in this visit (DISCOUNT_POPUP_SESSION_KEY). */
  discountShownThisVisit: boolean;
  /** The visit came from an ad with ?ponuka=zlava5 (isAdOfferVisit). */
  adOffer: boolean;
}

export type DiscountPopupReason =
  | 'subscribed'
  | 'shown-this-visit'
  | 'newsletter-popup-this-visit'
  | 'not-an-ad-offer-page'
  | 'ad-offer'
  | 'already-shown'
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
  const {
    pathname,
    now,
    newsletterState,
    newsletterDismissedAt,
    newsletterShownThisVisit,
    discountState,
    discountShownThisVisit,
    adOffer,
  } = input;

  let dismissedAt = parseTime(newsletterDismissedAt);
  let stampDismissedAt: string | undefined;
  if (newsletterState === 'dismissed' && dismissedAt === null) {
    dismissedAt = now;
    stampDismissedAt = new Date(now).toISOString();
  }
  const no = (reason: DiscountPopupReason): DiscountPopupDecision => ({ show: false, delayMs: 0, reason, stampDismissedAt });

  if (newsletterState === 'done' || discountState === 'done') return no('subscribed');
  if (discountShownThisVisit) return no('shown-this-visit');
  if (newsletterShownThisVisit) return no('newsletter-popup-this-visit');

  // The ad promised 5 %: shown or dismissed before does not count, the visit and the page do
  if (adOffer) {
    if (!isAdOfferPage(pathname)) return no('not-an-ad-offer-page');
    return { show: true, delayMs: AD_OFFER_DELAY_MS, reason: 'ad-offer', stampDismissedAt };
  }

  if (discountState) return no('already-shown');
  if (!isDiscountPopupPage(pathname)) return no('not-a-popup-page');
  if (newsletterState !== 'dismissed' || dismissedAt === null) return no('newsletter-popup-not-closed');
  if (now - dismissedAt < WAIT_AFTER_NEWSLETTER_POPUP_MS) return no('too-soon');

  return { show: true, delayMs: DISCOUNT_POPUP_DELAY_MS, reason: 'eligible', stampDismissedAt };
}
