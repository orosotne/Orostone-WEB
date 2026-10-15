import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AD_OFFER_DELAY_MS,
  DISCOUNT_POPUP_AD_SOURCE,
  DISCOUNT_POPUP_DELAY_MS,
  DISCOUNT_POPUP_IMAGE,
  DISCOUNT_POPUP_IMAGE_FALLBACK,
  DISCOUNT_POPUP_SOURCE,
  SLAB_CODE_TERMS,
  WAIT_AFTER_NEWSLETTER_POPUP_MS,
  decideDiscountPopup,
  discountPopupPhoneSrc,
  discountPopupSrcSet,
  hasAdOfferParam,
  isAdOfferPage,
  isAdOfferVisit,
  isDiscountPopupPage,
  nextStateOnDismiss,
  rememberAdOfferLanding,
  shouldShowNewsletterPopup,
} from '../../lib/discountPopup';
import type { DiscountPopupInput, NewsletterPopupInput } from '../../lib/discountPopup';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const NOW = Date.parse('2026-10-20T12:00:00.000Z');
const DAY = 24 * 60 * 60 * 1000;

// A returning visitor who closed pop-up A four days ago, on the homepage.
const base: DiscountPopupInput = {
  pathname: '/',
  now: NOW,
  newsletterState: 'dismissed',
  newsletterDismissedAt: new Date(NOW - 4 * DAY).toISOString(),
  newsletterShownThisVisit: false,
  discountState: null,
  discountShownThisVisit: false,
  adOffer: false,
};
const decide = (patch: Partial<DiscountPopupInput> = {}) => decideDiscountPopup({ ...base, ...patch });

test('shows 20 s after load on the homepage and product pages, 3 days after pop-up A was closed', () => {
  for (const pathname of ['/', '/produkt/calacatta-top', '/produkt/calacatta-top/']) {
    assert.deepEqual(decide({ pathname }), { show: true, delayMs: DISCOUNT_POPUP_DELAY_MS, reason: 'eligible', stampDismissedAt: undefined });
  }
  assert.equal(DISCOUNT_POPUP_DELAY_MS, 20_000);
  assert.equal(WAIT_AFTER_NEWSLETTER_POPUP_MS, 3 * DAY);
  assert.equal(decide({ newsletterDismissedAt: new Date(NOW - 3 * DAY).toISOString() }).show, true);
});

test('waits until 3 days have passed since pop-up A was closed', () => {
  for (const ago of [0, DAY, 3 * DAY - 1]) {
    const d = decide({ newsletterDismissedAt: new Date(NOW - ago).toISOString() });
    assert.equal(d.show, false);
    assert.equal(d.reason, 'too-soon');
  }
  // A close time in the future (clock changed) also waits
  assert.equal(decide({ newsletterDismissedAt: new Date(NOW + DAY).toISOString() }).reason, 'too-soon');
});

test('only on "/" and product pages on the normal path', () => {
  for (const pathname of ['/kategoria/sintered-stone', '/blog', '/blog/clanok', '/kuchyne', '/produkt', '/produkt/a/b', '/vzorky', '/checkout']) {
    assert.equal(decide({ pathname }).show, false, pathname);
  }
  assert.equal(isDiscountPopupPage('/'), true);
  assert.equal(isDiscountPopupPage('/produkt/roman-travertine'), true);
  assert.equal(isDiscountPopupPage('/kategoria/sintered-stone'), false);
});

test('only for visitors who closed pop-up A: never seen it, or no close recorded', () => {
  assert.equal(decide({ newsletterState: null, newsletterDismissedAt: null }).reason, 'newsletter-popup-not-closed');
  // A close time without A's state (storage partly cleared) is not enough
  assert.equal(decide({ newsletterState: null }).reason, 'newsletter-popup-not-closed');
});

test('legacy visitors who closed A before the close time was stored: stamp now and wait 3 days', () => {
  for (const newsletterDismissedAt of [null, 'not a date']) {
    const d = decide({ newsletterDismissedAt });
    assert.equal(d.show, false);
    assert.equal(d.reason, 'too-soon');
    assert.equal(d.stampDismissedAt, new Date(NOW).toISOString());
  }
  // Once stamped, the next visit 3 days later qualifies
  assert.equal(decide({ newsletterDismissedAt: new Date(NOW).toISOString(), now: NOW + 3 * DAY }).show, true);
  // A valid close time is never overwritten
  assert.equal(decide().stampDismissedAt, undefined);
});

test('never to a subscriber, whichever form they used, ad traffic included', () => {
  for (const patch of [
    { newsletterState: 'done' },
    { discountState: 'done' },
    { newsletterState: 'done', adOffer: true },
    { discountState: 'done', adOffer: true },
    { newsletterState: 'done', newsletterDismissedAt: null },
  ] satisfies Partial<DiscountPopupInput>[]) {
    const d = decide(patch);
    assert.equal(d.show, false);
    assert.equal(d.reason, 'subscribed');
    assert.equal(d.stampDismissedAt, undefined);
  }
});

test('at most once on the normal path: shown or dismissed stops it', () => {
  for (const discountState of ['shown', 'dismissed']) {
    assert.equal(decide({ discountState }).reason, 'already-shown');
  }
});

test('never in a visit that already showed pop-up A or pop-up B', () => {
  assert.equal(decide({ newsletterShownThisVisit: true }).reason, 'newsletter-popup-this-visit');
  assert.equal(decide({ newsletterShownThisVisit: true, adOffer: true }).show, false);
  assert.equal(decide({ discountShownThisVisit: true }).reason, 'shown-this-visit');
});

test('ad traffic (?ponuka=zlava5) sees it after 3 s without the 3-day rule', () => {
  const fresh = { newsletterState: null, newsletterDismissedAt: null, adOffer: true };
  assert.deepEqual(decide(fresh), { show: true, delayMs: AD_OFFER_DELAY_MS, reason: 'ad-offer', stampDismissedAt: undefined });
  assert.equal(AD_OFFER_DELAY_MS, 3_000);
  // Closed A an hour ago: the ad still shows B on a new visit
  assert.equal(decide({ adOffer: true, newsletterDismissedAt: new Date(NOW - 60 * 60 * 1000).toISOString() }).show, true);
  // Category listings and blog articles are ad landing pages too
  for (const pathname of ['/kategoria/sintered-stone', '/kategoria/sintered-stone/mramor', '/blog/ako-vybrat-dosku', '/produkt/x/']) {
    assert.equal(decide({ ...fresh, pathname }).show, true, pathname);
  }
});

test('the ad overrides an earlier shown or dismissed B, but at most once per visit and never after a signup', () => {
  for (const discountState of ['shown', 'dismissed']) {
    assert.deepEqual(decide({ discountState, adOffer: true }), {
      show: true, delayMs: AD_OFFER_DELAY_MS, reason: 'ad-offer', stampDismissedAt: undefined,
    });
    // Already shown in this visit (then closed): not again
    assert.equal(decide({ discountState, adOffer: true, discountShownThisVisit: true }).reason, 'shown-this-visit');
  }
  assert.equal(decide({ discountState: 'done', adOffer: true }).reason, 'subscribed');
  assert.equal(decide({ newsletterState: 'done', discountState: 'dismissed', adOffer: true }).reason, 'subscribed');
});

test('ads show it only on the homepage, product, category and blog article pages', () => {
  const allowed = ['/', '/produkt/calacatta-top', '/kategoria/sintered-stone', '/kategoria/sintered-stone/mramor', '/blog/clanok', '/blog/clanok/'];
  for (const pathname of allowed) assert.equal(isAdOfferPage(pathname), true, pathname);
  const others = [
    '/checkout', '/objednavka-dokoncena', '/vzorky', '/vop', '/podmienky-rezervacie-ceny', '/ochrana-sukromia',
    '/ochrana-sukromia/', '/cookies', '/odstupenie-od-zmluvy', '/reklamacie', '/doprava', '/kontakt', '/kariera',
    '/blog', '/kuchyne', '/realizacie', '/cennik', '/neexistuje', '/produkt', '/produkt/a/b', '/kategoria',
    '/kategoria/a/b/c', '/blog/a/b', '/doprava-zdarma-blog',
  ];
  for (const pathname of others) {
    assert.equal(isAdOfferPage(pathname), false, pathname);
    const d = decide({ pathname, adOffer: true, discountState: 'dismissed' });
    assert.equal(d.show, false, pathname);
    assert.equal(d.reason, 'not-an-ad-offer-page', pathname);
  }
});

test('closing a pop-up stores dismissed, but never overwrites a signup', () => {
  assert.equal(nextStateOnDismiss(null), 'dismissed');
  assert.equal(nextStateOnDismiss('shown'), 'dismissed');
  assert.equal(nextStateOnDismiss('dismissed'), 'dismissed');
  assert.equal(nextStateOnDismiss('done'), null);
});

test('pop-up A: once, never to a subscriber, never in a visit with B, and it stands down for ad traffic', () => {
  const a: NewsletterPopupInput = { newsletterState: null, discountState: null, discountShownThisVisit: false, adOffer: false };
  const showA = (patch: Partial<NewsletterPopupInput> = {}) => shouldShowNewsletterPopup({ ...a, ...patch });
  assert.equal(showA(), true);
  assert.equal(showA({ newsletterState: 'dismissed' }), false);
  assert.equal(showA({ newsletterState: 'done' }), false);
  assert.equal(showA({ discountState: 'done' }), false);
  assert.equal(showA({ discountShownThisVisit: true }), false);
  // An ad visitor gets B, not A, even where B cannot show (A does not take its place)
  assert.equal(showA({ adOffer: true }), false);
  assert.equal(showA({ adOffer: true, discountState: 'dismissed' }), false);
  // A visitor who closed B before (no ad) can still be offered A once
  assert.equal(showA({ discountState: 'dismissed' }), true);
});

test('reads the ad parameter from the query string', () => {
  assert.equal(hasAdOfferParam('?ponuka=zlava5'), true);
  assert.equal(hasAdOfferParam('?utm_source=facebook&ponuka=zlava5'), true);
  assert.equal(hasAdOfferParam('?ponuka=ZLAVA5'), true);
  assert.equal(hasAdOfferParam(''), false);
  assert.equal(hasAdOfferParam('?ponuka=zlava10'), false);
  assert.equal(hasAdOfferParam('?zlava5'), false);
});

test('subscription sources fit subscribe-newsletter (at most 50 characters)', () => {
  assert.equal(DISCOUNT_POPUP_SOURCE, 'popup_zlava5');
  assert.equal(DISCOUNT_POPUP_AD_SOURCE, 'popup_zlava5_reklama');
  for (const source of [DISCOUNT_POPUP_SOURCE, DISCOUNT_POPUP_AD_SOURCE]) assert.ok(source.length <= 50, source);
});

test('the photo files the <picture> points to exist, AVIF and WebP at 720 and 1440 px', () => {
  for (const format of ['avif', 'webp'] as const) {
    const srcSet = discountPopupSrcSet(format);
    assert.equal(srcSet, DISCOUNT_POPUP_IMAGE.widths.map((w) => `${DISCOUNT_POPUP_IMAGE.base}-${w}.${format} ${w}w`).join(', '));
    for (const w of DISCOUNT_POPUP_IMAGE.widths) {
      assert.ok(existsSync(join('public', `${DISCOUNT_POPUP_IMAGE.base}-${w}.${format}`)), `${format} ${w}`);
    }
  }
  // Phones get the smallest file (a 128 px band), with the WebP as the <img> fallback
  assert.equal(discountPopupPhoneSrc('avif'), `${DISCOUNT_POPUP_IMAGE.base}-720.avif`);
  assert.equal(DISCOUNT_POPUP_IMAGE_FALLBACK, `${DISCOUNT_POPUP_IMAGE.base}-720.webp`);
  assert.ok(existsSync(join('public', DISCOUNT_POPUP_IMAGE_FALLBACK)));
});

test('the short WELCOME5 terms name the exclusions and keep non-breaking spaces', () => {
  assert.equal(
    SLAB_CODE_TERMS.replace(/\u00A0/g, ' '),
    'Kód WELCOME5 môžete použiť iba raz a len pri objednávke platní v e-shope orostone.sk. Nedá sa kombinovať so žiadnou inou zľavou, ani so zľavou 20 % od troch platní.',
  );
  assert.match(SLAB_CODE_TERMS, /20\u00A0%/);
  assert.match(SLAB_CODE_TERMS, / v\u00A0e-shope/);
});

// Last: rememberAdOfferLanding sets module state for the rest of the file
test('an ad visit is remembered from the landing URL, the current URL or the session flag', () => {
  assert.equal(isAdOfferVisit('', null), false);
  assert.equal(isAdOfferVisit('?ponuka=zlava5', null), true);
  assert.equal(isAdOfferVisit('', '1'), true);
  rememberAdOfferLanding('?utm_source=meta');
  assert.equal(isAdOfferVisit('', null), false);
  // Landed with the parameter, then clicked on (the URL no longer has it) before the cookie bar was answered
  rememberAdOfferLanding('?ponuka=zlava5&utm_source=meta');
  assert.equal(isAdOfferVisit('', null), true);
});
