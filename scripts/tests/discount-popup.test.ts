import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AD_OFFER_DELAY_MS,
  DISCOUNT_POPUP_DELAY_MS,
  WAIT_AFTER_NEWSLETTER_POPUP_MS,
  decideDiscountPopup,
  hasAdOfferParam,
  isDiscountPopupBlockedPage,
  isDiscountPopupPage,
} from '../../lib/discountPopup';
import type { DiscountPopupInput } from '../../lib/discountPopup';

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
  for (const pathname of ['/kategoria/sintered-stone', '/blog', '/kuchyne', '/produkt', '/produkt/a/b', '/vzorky', '/checkout']) {
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

test('never to a subscriber, whichever form they used', () => {
  for (const patch of [
    { newsletterState: 'done' },
    { discountState: 'done' },
    { newsletterState: 'done', adOffer: true },
    { newsletterState: 'done', newsletterDismissedAt: null },
  ] satisfies Partial<DiscountPopupInput>[]) {
    const d = decide(patch);
    assert.equal(d.show, false);
    assert.equal(d.reason, 'subscribed');
    assert.equal(d.stampDismissedAt, undefined);
  }
});

test('at most once: shown, dismissed or done all stop it, ad traffic included', () => {
  for (const discountState of ['shown', 'dismissed']) {
    assert.equal(decide({ discountState }).reason, 'already-shown');
    assert.equal(decide({ discountState, adOffer: true }).show, false);
  }
});

test('never in a visit that already showed pop-up A', () => {
  assert.equal(decide({ newsletterShownThisVisit: true }).reason, 'newsletter-popup-this-visit');
  assert.equal(decide({ newsletterShownThisVisit: true, adOffer: true }).show, false);
});

test('ad traffic (?ponuka=zlava5) sees it after 3 s without the 3-day rule', () => {
  const fresh = { newsletterState: null, newsletterDismissedAt: null, adOffer: true };
  assert.deepEqual(decide(fresh), { show: true, delayMs: AD_OFFER_DELAY_MS, reason: 'ad-offer', stampDismissedAt: undefined });
  assert.equal(AD_OFFER_DELAY_MS, 3_000);
  // Closed A an hour ago: the ad still shows B on a new visit
  assert.equal(decide({ adOffer: true, newsletterDismissedAt: new Date(NOW - 60 * 60 * 1000).toISOString() }).show, true);
  // Ad landing pages other than "/" and products are fine
  assert.equal(decide({ ...fresh, pathname: '/kategoria/sintered-stone' }).show, true);
});

test('never on checkout, the thank-you page, the sample order form or legal pages, not even for ads', () => {
  const pages = [
    '/checkout', '/objednavka-dokoncena', '/vzorky', '/vop', '/podmienky-rezervacie-ceny',
    '/ochrana-sukromia', '/ochrana-sukromia/', '/cookies', '/odstupenie-od-zmluvy', '/reklamacie', '/doprava',
  ];
  for (const pathname of pages) {
    assert.equal(isDiscountPopupBlockedPage(pathname), true, pathname);
    assert.equal(decide({ pathname, adOffer: true }).reason, 'blocked-page', pathname);
  }
  for (const pathname of ['/', '/produkt/x', '/kategoria/sintered-stone', '/doprava-zdarma-blog']) {
    assert.equal(isDiscountPopupBlockedPage(pathname), false, pathname);
  }
});

test('reads the ad parameter from the query string', () => {
  assert.equal(hasAdOfferParam('?ponuka=zlava5'), true);
  assert.equal(hasAdOfferParam('?utm_source=facebook&ponuka=zlava5'), true);
  assert.equal(hasAdOfferParam('?ponuka=ZLAVA5'), true);
  assert.equal(hasAdOfferParam(''), false);
  assert.equal(hasAdOfferParam('?ponuka=zlava10'), false);
  assert.equal(hasAdOfferParam('?zlava5'), false);
});
