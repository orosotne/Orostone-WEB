import React, { useEffect, useRef, useState } from 'react';
import { preload } from 'react-dom';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { TargetAndTransition, Transition } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import {
  subscribeToNewsletter,
  NEWSLETTER_POPUP_KEY,
  NEWSLETTER_POPUP_DISMISSED_AT_KEY,
  NEWSLETTER_POPUP_SESSION_KEY,
} from '../../services/newsletter.service';
import { trackGA4Event } from '../../services/analytics';
import { useBackgroundTurnstile } from '../../hooks/useBackgroundTurnstile';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { useCookies } from '../../context/CookieContext';
import { useCartUI } from '../../context/CartContext';
import { ActionButton, Eyebrow } from '../Design';
import { SlabCodeTerms } from './SlabCodeTerms';
import { SPRING, SPRING_SHEET, FADE } from '../../lib/motion';
import {
  AD_OFFER_SESSION_KEY,
  DISCOUNT_POPUP_AD_SOURCE,
  DISCOUNT_POPUP_IMAGE,
  DISCOUNT_POPUP_IMAGE_FALLBACK,
  DISCOUNT_POPUP_IMAGE_SIZES,
  DISCOUNT_POPUP_KEY,
  DISCOUNT_POPUP_PHONE_MEDIA,
  DISCOUNT_POPUP_WIDE_MEDIA,
  DISCOUNT_POPUP_SESSION_KEY,
  DISCOUNT_POPUP_SOURCE,
  SAMPLE_SHIPPING_CODE,
  SLAB_DISCOUNT_CODE,
  codesDelivery,
  decideDiscountPopup,
  discountPopupPhoneSrc,
  discountPopupSrcSet,
  isAdOfferVisit,
  nextStateOnDismiss,
} from '../../lib/discountPopup';
import type { CodesDelivery } from '../../lib/discountPopup';

// Pop-up B „5 % na váš kameň“: the second, louder offer for visitors who closed pop-up A (NewsletterPopup) without
// subscribing, and for ad traffic with ?ponuka=zlava5. When and where it may show is decided by lib/discountPopup.ts
// (owner's rules of 15. 10. 2026).
//
// Gold primary buttons on the graphite panel are a deliberate exception to STYLE_GUIDE › CTA levels, approved by the
// owner on 15. 10. 2026 for this pop-up only. Don't copy them elsewhere.

const DECOR_LISTING = '/kategoria/sintered-stone';

type Store = 'local' | 'session';

function read(store: Store, key: string): string | null {
  try { return (store === 'local' ? localStorage : sessionStorage).getItem(key); } catch { return null; }
}

function write(store: Store, key: string, value: string) {
  try { (store === 'local' ? localStorage : sessionStorage).setItem(key, value); } catch { /* ignore */ }
}

function currentDecision(pathname: string, search: string) {
  return decideDiscountPopup({
    pathname,
    now: Date.now(),
    newsletterState: read('local', NEWSLETTER_POPUP_KEY),
    newsletterDismissedAt: read('local', NEWSLETTER_POPUP_DISMISSED_AT_KEY),
    newsletterShownThisVisit: read('session', NEWSLETTER_POPUP_SESSION_KEY) !== null,
    discountState: read('local', DISCOUNT_POPUP_KEY),
    discountShownThisVisit: read('session', DISCOUNT_POPUP_SESSION_KEY) !== null,
    adOffer: isAdOfferVisit(search, read('session', AD_OFFER_SESSION_KEY)),
  });
}

// Enter and leave along the same path: a sheet from the bottom edge on phones, a card that rises and settles
// on larger screens. Reduced motion: a plain cross-fade.
type PanelMotion = { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition };
const SHEET: PanelMotion = { initial: { y: '110%' }, animate: { y: 0 }, transition: SPRING_SHEET };
const CARD: PanelMotion = {
  initial: { opacity: 0, y: 24, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: SPRING,
};
const FADE_ONLY: PanelMotion = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: FADE };

export const DiscountPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [viaAd, setViaAd] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [delivery, setDelivery] = useState<CodesDelivery>('email');
  const [errorMsg, setErrorMsg] = useState('');
  const turnstile = useBackgroundTurnstile();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { hasConsented, isSettingsOpen } = useCookies();
  const { isOpen: isCartOpen } = useCartUI();
  const { pathname, search } = useLocation();
  const reduceMotion = useReducedMotion();

  useScrollLock(visible);

  // Ad visitors keep the offer for the whole visit: ?ponuka=zlava5 disappears from the URL after the first click.
  // Stored only once the cookie bar is answered; until then the landing URL is remembered in memory (EshopApp).
  useEffect(() => {
    if (hasConsented && isAdOfferVisit(search, null)) write('session', AD_OFFER_SESSION_KEY, '1');
  }, [hasConsented, search]);

  // Wait until the cookie bar is answered and nothing else is open; the page decides the delay (20 s, ads 3 s)
  const blocked = !hasConsented || isSettingsOpen || isCartOpen;
  useEffect(() => {
    if (blocked) return;
    const decision = currentDecision(pathname, search);
    if (decision.stampDismissedAt) write('local', NEWSLETTER_POPUP_DISMISSED_AT_KEY, decision.stampDismissedAt);
    if (!decision.show) return;
    // The photo is in the cache by the time the pop-up opens, so nothing pops in. The same media, srcset and sizes as
    // the <picture>, so the browser preloads exactly the file it will show: the 720 on phones, 720 or 1440 by density
    // from 640 px. Browsers without AVIF skip the hint and load the WebP when the pop-up opens.
    preload(discountPopupPhoneSrc('avif'), { as: 'image', type: 'image/avif', media: DISCOUNT_POPUP_PHONE_MEDIA });
    preload(discountPopupPhoneSrc('avif'), {
      as: 'image',
      type: 'image/avif',
      media: DISCOUNT_POPUP_WIDE_MEDIA,
      imageSrcSet: discountPopupSrcSet('avif'),
      imageSizes: DISCOUNT_POPUP_IMAGE_SIZES,
    });
    const timer = setTimeout(() => {
      // Decide again: pop-up A may have opened meanwhile, or the visitor signed up in the footer
      const now = currentDecision(pathname, search);
      if (!now.show) return;
      write('local', DISCOUNT_POPUP_KEY, 'shown');
      write('session', DISCOUNT_POPUP_SESSION_KEY, '1');
      setViaAd(now.reason === 'ad-offer');
      setSheet(!window.matchMedia('(min-width: 640px)').matches);
      setVisible(true);
    }, decision.delayMs);
    return () => clearTimeout(timer);
  }, [blocked, pathname, search]);

  // Read the stored state, not `status`: a signup ('done') must survive closing the dialog
  const dismiss = () => {
    setVisible(false);
    const next = nextStateOnDismiss(read('local', DISCOUNT_POPUP_KEY));
    if (next) write('local', DISCOUNT_POPUP_KEY, next);
  };

  // Keyboard: focus lands on the close button, Tab stays in the dialog, Escape closes it, focus then goes back
  useDialogFocus(visible, dialogRef, closeButtonRef, dismiss);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');

    const result = await subscribeToNewsletter({
      email,
      source: viaAd ? DISCOUNT_POPUP_AD_SOURCE : DISCOUNT_POPUP_SOURCE,
      turnstileToken: await turnstile.getToken(),
    });

    if (result.success) {
      trackGA4Event('sign_up', { method: 'newsletter_popup_zlava5', offer_source: viaAd ? 'reklama' : 'web' });
      write('local', DISCOUNT_POPUP_KEY, 'done');
      // Already on the list, or Klaviyo blocked/did not answer: no welcome e-mail, the codes are only on this screen
      setDelivery(codesDelivery(result));
      setStatus('success');
    } else {
      turnstile.reset();
      setStatus('error');
      setErrorMsg(result.error || 'Niečo sa nepodarilo. Skúste to znova.');
    }
  };

  const panel = reduceMotion ? FADE_ONLY : sheet ? SHEET : CARD;

  return (
    <AnimatePresence>
      {visible && (
        <div key="discount-popup">
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            onClick={dismiss}
            className="fixed inset-0 z-[10000] bg-brand-dark/60 backdrop-blur-[2px]"
          />

          {/* Placement by flex, not by translate classes: framer-motion's inline transform would override those.
              Phones: a sheet at the bottom with a 16 px gutter; from 640 px a centred card. */}
          <div className="pointer-events-none fixed inset-0 z-[10001] flex items-end justify-center p-4 sm:items-center sm:p-6 short-phone:p-3">
            <m.div
              ref={dialogRef}
              initial={panel.initial}
              animate={panel.animate}
              exit={panel.initial}
              transition={panel.transition}
              role="dialog"
              aria-modal="true"
              aria-labelledby="discount-popup-title"
              className="pointer-events-auto relative flex max-h-full w-full max-w-[460px] flex-col overflow-y-auto overscroll-contain rounded-[14px] bg-brand-dark text-brand-light shadow-[0_32px_80px_-24px_rgba(0,0,0,0.65)] sm:max-w-[760px] sm:flex-row sm:rounded-[6px]"
            >
              {/* Photo with the gold 5 % sticker: a band on phones (lower on short screens, gone on very short ones so the
                  terms, the consent line and „Nie, ďakujem“ fit without scrolling), a column from 640 px.
                  Static on purpose: it is preloaded and only the panel moves. */}
              <div className="relative h-[128px] flex-none overflow-hidden bg-brand-stone sm:h-auto sm:min-h-[480px] sm:w-[42%] short-phone:h-[88px] tiny-phone:hidden">
                <picture>
                  <source media={DISCOUNT_POPUP_WIDE_MEDIA} type="image/avif" srcSet={discountPopupSrcSet('avif')} sizes={DISCOUNT_POPUP_IMAGE_SIZES} />
                  <source media={DISCOUNT_POPUP_WIDE_MEDIA} type="image/webp" srcSet={discountPopupSrcSet('webp')} sizes={DISCOUNT_POPUP_IMAGE_SIZES} />
                  <source type="image/avif" srcSet={discountPopupPhoneSrc('avif')} />
                  <img
                    src={DISCOUNT_POPUP_IMAGE_FALLBACK}
                    alt=""
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-[50%_45%]"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/0 to-brand-dark/0" aria-hidden />
                {/* Phones: on a dark chip, the light travertine behind it would leave the label at about 2.5:1. On short
                    screens the band is 88 px and the label smaller, so it stays clear of the sticker down to 320 px. */}
                <p className="absolute bottom-1.5 right-2 rounded-[4px] bg-brand-dark/75 px-2 py-0.5 text-xs text-brand-light sm:bottom-4 sm:left-6 sm:right-auto sm:bg-transparent sm:p-0 short-phone:bottom-1.5 short-phone:right-1.5 short-phone:text-[0.68rem]">
                  {DISCOUNT_POPUP_IMAGE.label}
                </p>

                {/* Gold sticker: settles in after the panel, then a light sweeps across it three times and stops */}
                <m.div
                  initial={reduceMotion ? false : { scale: 0.6, rotate: -24, opacity: 0 }}
                  animate={{ scale: 1, rotate: -8, opacity: 1 }}
                  transition={{ ...SPRING, delay: 0.15 }}
                  className="absolute left-4 top-4 grid h-[84px] w-[84px] place-content-center overflow-hidden rounded-full bg-brand-gold text-center text-brand-dark shadow-[0_10px_28px_-10px_rgba(0,0,0,0.6)] sm:left-6 sm:top-6 sm:h-[116px] sm:w-[116px] short-phone:left-2 short-phone:top-2 short-phone:h-[56px] short-phone:w-[56px]"
                  aria-hidden
                >
                  <span className="text-os-sticker short-phone:text-os-h3 short-phone:font-bold short-phone:leading-none">5&nbsp;%</span>
                  <span className="mt-1 text-os-eyebrow uppercase leading-none short-phone:mt-0.5 short-phone:tracking-[0.04em]">zľava</span>
                  {!reduceMotion && (
                    <m.span
                      initial={{ x: '-130%' }}
                      animate={{ x: '130%' }}
                      transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.8, repeat: 2, repeatDelay: 1.6 }}
                      className="pointer-events-none absolute inset-y-0 left-0 w-full -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                    />
                  )}
                </m.div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={dismiss}
                className="absolute right-2 top-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-brand-dark/60 text-brand-light os-press hover:bg-brand-dark tiny-phone:right-1 tiny-phone:top-1"
                aria-label="Zavrieť"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

              <div className="min-w-0 flex-1 px-5 pb-3 pt-5 sm:px-8 sm:pb-6 sm:pt-10 short-phone:pb-1 short-phone:pt-4">
                {status === 'success' ? (
                  <>
                    <Eyebrow gold className="tiny-phone:pr-12">Ste prihlásení</Eyebrow>
                    <h2 id="discount-popup-title" className="mt-3 pr-8 text-os-h2 short-phone:mt-2">
                      Váš kód na 5&nbsp;% zľavu
                    </h2>
                    <p className="mt-5 rounded-[10px] border border-dashed border-brand-gold/70 bg-white/[0.04] px-4 py-4 text-center text-os-h2 font-bold leading-none tracking-[0.16em] text-brand-gold">
                      {SLAB_DISCOUNT_CODE}
                    </p>
                    {delivery !== 'email' ? (
                      <p className="mt-4 text-sm font-normal leading-relaxed text-brand-light/80 sm:text-base">
                        {delivery === 'already' ? (
                          <>Na túto adresu už novinky posielame, preto vám nový <span className="whitespace-nowrap">e-mail</span> nepríde.</>
                        ) : (
                          <><span className="whitespace-nowrap">E-mail</span> s&nbsp;kódmi vám tentoraz poslať nevieme.</>
                        )}{' '}
                        Kód si poznačte a&nbsp;zadajte ho v&nbsp;pokladni pri objednávke platní. Na dopravu prvej vzorky zadarmo zadajte kód{' '}
                        <strong className="font-semibold text-brand-light">{SAMPLE_SHIPPING_CODE}</strong>.
                      </p>
                    ) : (
                      <p className="mt-4 text-sm font-normal leading-relaxed text-brand-light/80 sm:text-base">
                        Kód zadajte v&nbsp;pokladni pri objednávke platní. <span className="whitespace-nowrap">E-mailom</span> sme vám ho poslali spolu s&nbsp;kódom{' '}
                        <strong className="font-semibold text-brand-light">{SAMPLE_SHIPPING_CODE}</strong> na dopravu prvej vzorky zadarmo.
                      </p>
                    )}
                    <p className="mt-3 text-xs leading-relaxed text-brand-light/70">
                      <SlabCodeTerms />
                    </p>
                    <ActionButton to={DECOR_LISTING} variant="gold" arrow onClick={dismiss} className="mb-3 mt-5 w-full">
                      Pozrieť dekory
                    </ActionButton>
                  </>
                ) : (
                  <>
                    {/* Without the photo band the close button sits on this line */}
                    <Eyebrow gold className="tiny-phone:pr-12">Pre nových odberateľov</Eyebrow>
                    <h2 id="discount-popup-title" className="mt-3 pr-8 text-os-h2 short-phone:mt-2">
                      5&nbsp;% na váš kameň
                    </h2>
                    <p className="mt-3 text-sm font-normal leading-relaxed text-brand-light/80 sm:text-base short-phone:mt-2 short-phone:leading-snug">
                      Prihláste sa na odber noviniek a&nbsp;<span className="whitespace-nowrap">e-mailom</span> vám pošleme kód na 5&nbsp;% zľavu na platne. Pridáme aj kód na dopravu prvej vzorky zadarmo.
                    </p>

                    <form onSubmit={handleSubmit} className="relative mt-5 grid gap-3 short-phone:mt-3 short-phone:gap-2">
                      {/* Bot check: visible only when Cloudflare asks for a click, then over the text above the field,
                          out of the flow and first in the tab order (same as pop-up A and the footer) */}
                      {turnstile.armed && (
                        <Turnstile
                          {...turnstile.widgetProps}
                          id="discount-popup-turnstile"
                          className="absolute bottom-[calc(100%_+_0.5rem)] left-0 z-10 [contain:layout]"
                          options={{ appearance: 'interaction-only', theme: 'dark', language: 'sk' }}
                        />
                      )}
                      <label htmlFor="discount-popup-email" className="sr-only">E-mail</label>
                      <input
                        id="discount-popup-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={turnstile.arm}
                        placeholder="vas@email.sk"
                        className="min-h-[50px] w-full rounded-[10px] border border-transparent bg-white px-4 text-base text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-dark short-phone:min-h-[46px]"
                      />
                      {status === 'error' && (
                        <p className="text-sm text-red-300" role="alert">{errorMsg}</p>
                      )}
                      <ActionButton type="submit" variant="gold" disabled={status === 'loading'} className="w-full short-phone:min-h-[46px]">
                        {status === 'loading' ? (
                          <><Loader2 size={16} className="animate-spin" /> Odosielam…</>
                        ) : (
                          <>Chcem 5&nbsp;% zľavu</>
                        )}
                      </ActionButton>
                    </form>

                    <p className="mt-3 text-xs leading-relaxed text-brand-light/70 short-phone:mt-2 short-phone:leading-snug">
                      <SlabCodeTerms />
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-brand-light/70 short-phone:mt-1.5 short-phone:leading-snug">
                      Prihlásením súhlasíte so zasielaním noviniek. Odhlásiť sa môžete kedykoľvek.{' '}
                      <Link to="/ochrana-sukromia" target="_blank" className="font-semibold text-brand-light underline underline-offset-4">
                        Ochrana súkromia
                      </Link>
                    </p>

                    <button
                      type="button"
                      onClick={dismiss}
                      className="mt-1 min-h-[44px] w-full text-center text-sm text-brand-light/70 active:opacity-50 hover:text-brand-light short-phone:mt-0"
                    >
                      Nie, ďakujem
                    </button>
                  </>
                )}
              </div>
            </m.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
