import React, { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import {
  subscribeToNewsletter,
  NEWSLETTER_POPUP_KEY,
  NEWSLETTER_POPUP_DISMISSED_AT_KEY,
  NEWSLETTER_POPUP_SESSION_KEY,
} from '../../services/newsletter.service';
import {
  AD_OFFER_SESSION_KEY,
  DISCOUNT_POPUP_KEY,
  DISCOUNT_POPUP_SESSION_KEY,
  SAMPLE_SHIPPING_CODE,
  SLAB_DISCOUNT_CODE,
  codesDelivery,
  isAdOfferVisit,
  nextStateOnDismiss,
  shouldShowNewsletterPopup,
} from '../../lib/discountPopup';
import type { CodesDelivery } from '../../lib/discountPopup';
import { trackGA4Event } from '../../services/analytics';
import { useBackgroundTurnstile } from '../../hooks/useBackgroundTurnstile';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { useAiChatOpen } from '../../hooks/useAiChatOpen';
import { useCookies } from '../../context/CookieContext';
import { useCartUI } from '../../context/CartContext';
import { ActionButton, Eyebrow } from '../Design';
import { SlabCodeTerms } from './SlabCodeTerms';
import { SPRING, FADE } from '../../lib/motion';

const DELAY_MS = 8000;
// Pages where an offer would get in the way of finishing an order
// /pre-kamenarstva: B2B page for stone workshops, the consumer welcome offer doesn't apply there
// /odporucte: rules of the referral program, read by existing customers
const HIDDEN_ON = ['/objednavka-dokoncena', '/pre-kamenarstva', '/odporucte'];
// Welcome reward: free shipping on the first sample. Shopify free-shipping code, shipping up to 3 €, once per customer.
// Welcome e-mail 01 also carries WELCOME5 (5 % on slabs), the code pop-up B offers, once its Klaviyo template with
// WELCOME5 is uploaded (step 1 of the deploy order, lib/discountPopup.ts and jazykova-kontrola.md › Kolo 8).
const DISCOUNT_CODE = SAMPLE_SHIPPING_CODE;

function getPopupState(): string | null {
  try { return localStorage.getItem(NEWSLETTER_POPUP_KEY); } catch { return null; }
}

function setPopupState(value: string) {
  try { localStorage.setItem(NEWSLETTER_POPUP_KEY, value); } catch { /* ignore */ }
}

// Pop-up B (5 %) waits 3 days from this close and never shows in a visit that showed this pop-up
function stampDismissal() {
  try { localStorage.setItem(NEWSLETTER_POPUP_DISMISSED_AT_KEY, new Date().toISOString()); } catch { /* ignore */ }
}

function readStore(store: 'local' | 'session', key: string): string | null {
  try { return (store === 'local' ? localStorage : sessionStorage).getItem(key); } catch { return null; }
}

// Once, never to a subscriber, never in a visit with pop-up B, and not to ad traffic promised B's 5 % (lib/discountPopup.ts)
function mayShow(): boolean {
  return shouldShowNewsletterPopup({
    newsletterState: getPopupState(),
    discountState: readStore('local', DISCOUNT_POPUP_KEY),
    discountShownThisVisit: readStore('session', DISCOUNT_POPUP_SESSION_KEY) !== null,
    adOffer: isAdOfferVisit(window.location.search, readStore('session', AD_OFFER_SESSION_KEY)),
  });
}

function markShownThisVisit() {
  try { sessionStorage.setItem(NEWSLETTER_POPUP_SESSION_KEY, '1'); } catch { /* ignore */ }
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export const NewsletterPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatusState] = useState<SubmitStatus>('idle');
  const [delivery, setDelivery] = useState<CodesDelivery>('email');
  const [errorMsg, setErrorMsg] = useState('');
  const turnstile = useBackgroundTurnstile();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  // The status as of now, for dismiss(): Escape and the backdrop must not see a stale 'idle' while the sign-up is sent
  const statusRef = useRef<SubmitStatus>('idle');
  const setStatus = (next: SubmitStatus) => {
    statusRef.current = next;
    setStatusState(next);
  };
  const loading = status === 'loading';
  // On only while the request is on its way (after the bot check): closing then would lose the codes. During the bot
  // check closing still works and cancels the submit, so a visitor who ignores a Cloudflare challenge is not locked in
  const sendingRef = useRef(false);
  const [sending, setSending] = useState(false);
  const cancelledRef = useRef(false);
  const { hasConsented, isSettingsOpen } = useCookies();
  const { isOpen: isCartOpen } = useCartUI();
  const isChatOpen = useAiChatOpen();
  const { pathname } = useLocation();

  useScrollLock(visible);

  // Wait until the cookie bar is answered and nothing else is open (the cart, the cookie settings, the AI chat window,
  // which a dialog would take the focus from), then give the visitor a few seconds on the page
  const blocked = !hasConsented || isSettingsOpen || isCartOpen || isChatOpen || HIDDEN_ON.includes(pathname);
  useEffect(() => {
    if (blocked || !mayShow()) return;
    const timer = setTimeout(() => {
      // Decide again: pop-up B may have opened meanwhile, or the visitor signed up in the footer
      if (!mayShow()) return;
      markShownThisVisit();
      setVisible(true);
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, [blocked]);

  // Not while the sign-up is on its way: with 'screen' or 'already' the codes would land in a closed dialog, the only
  // place they are shown. Read the stored state, not `status`: turning a signup ('done') into 'dismissed' would offer
  // pop-up B to a subscriber 3 days later
  const dismiss = () => {
    if (sendingRef.current) return;
    if (statusRef.current === 'loading') {
      cancelledRef.current = true;
      setStatus('idle');
    }
    setVisible(false);
    const next = nextStateOnDismiss(getPopupState());
    if (next) {
      setPopupState(next);
      stampDismissal();
    }
  };

  // Keyboard: focus lands on the close button, Tab stays in the dialog, Escape closes it, focus then goes back
  useDialogFocus(visible, dialogRef, closeButtonRef, dismiss);

  // The submit button is gone with the form: focus goes to the result, so a screen reader reads the codes
  useEffect(() => {
    if (status === 'success') successHeadingRef.current?.focus({ preventScroll: true });
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    cancelledRef.current = false;
    setStatus('loading');

    const turnstileToken = await turnstile.getToken();
    // Closed during the bot check: nothing was sent
    if (cancelledRef.current) return;
    sendingRef.current = true;
    setSending(true);
    let result: Awaited<ReturnType<typeof subscribeToNewsletter>>;
    try {
      result = await subscribeToNewsletter({ email, source: 'popup', turnstileToken });
    } finally {
      sendingRef.current = false;
      setSending(false);
    }

    if (result.success) {
      trackGA4Event('sign_up', { method: 'newsletter_popup' });
      // Already on the list, or Klaviyo blocked/did not answer: no welcome e-mail, the codes are only on this screen
      setDelivery(codesDelivery(result));
      setStatus('success');
    } else {
      turnstile.reset();
      setStatus('error');
      setErrorMsg(result.error || 'Niečo sa nepodarilo. Skúste to znova.');
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <m.div
            key="newsletter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            onClick={dismiss}
            className="fixed inset-0 z-[10000] bg-brand-dark/50 backdrop-blur-[2px]"
          />

          {/* Modal */}
          <m.div
            key="newsletter-popup"
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={SPRING}
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-popup-title"
            // The AI chat button (widget.js) lies above every layer of the site: it steps aside while this is open
            data-aipredajca-hide=""
            // Centred by flex, not by translate classes: framer-motion's inline transform would override those
            className="pointer-events-none fixed inset-0 z-[10001] flex items-center justify-center p-3 sm:p-6"
          >
            <div className="pointer-events-auto relative flex max-h-full w-full max-w-[600px] flex-col overflow-y-auto overscroll-contain rounded-[3px] bg-brand-light text-brand-dark shadow-[0_32px_80px_-24px_rgba(26,26,26,0.5)] sm:flex-row">

              {/* Real decor scan: a strip on phones, a column from sm up */}
              <img
                src="/images/home/dekory/taj-mahal.webp"
                alt=""
                width={520}
                height={931}
                className="h-24 w-full flex-none bg-brand-sand object-cover sm:h-auto sm:w-[200px]"
              />

              <button
                ref={closeButtonRef}
                type="button"
                onClick={dismiss}
                disabled={sending}
                className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full bg-brand-light/85 text-brand-muted os-press enabled:hover:bg-brand-sand enabled:hover:text-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Zavrieť"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

              <div className="min-w-0 flex-1 px-5 pb-5 pt-5 sm:px-7 sm:pb-7 sm:pt-8">
                {status === 'success' ? (
                  <>
                    {/* 'screen': Klaviyo may have blocked the address, so no claim that it is subscribed */}
                    <Eyebrow className="text-brand-muted">{delivery === 'screen' ? 'Ďakujeme' : 'Ste prihlásení'}</Eyebrow>
                    <h2 ref={successHeadingRef} id="newsletter-popup-title" tabIndex={-1} className="mt-3 text-os-h3 outline-none">
                      Doprava prvej vzorky je na nás
                    </h2>
                    <p className="mt-2 text-[0.9rem] font-light leading-relaxed text-brand-muted">
                      {delivery !== 'email' ? (
                        <>
                          {delivery === 'already' ? (
                            <>Na túto adresu už novinky posielame, preto vám uvítací <span className="whitespace-nowrap">e-mail</span> s&nbsp;kódmi znova nepošleme.</>
                          ) : (
                            <>Uvítací <span className="whitespace-nowrap">e-mail</span> s&nbsp;kódmi vám teraz poslať nemôžeme, preto ich uvádzame tu.</>
                          )}{' '}
                          Kódy si poznačte. Pri objednávke vzorky zadajte v&nbsp;pokladni tento kód:
                        </>
                      ) : (
                        <>Pri objednávke vzorky zadajte v&nbsp;pokladni kód. Poslali sme vám ho aj <span className="whitespace-nowrap">e-mailom</span>.</>
                      )}
                    </p>
                    <p className="mt-4 rounded-[3px] border border-dashed border-brand-dark/40 bg-brand-sand px-4 py-3 text-center text-[1.1rem] font-semibold tracking-[0.2em]">
                      {DISCOUNT_CODE}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                      {delivery !== 'email' ? (
                        <>Na 5&nbsp;% zľavu na platne zadajte v&nbsp;pokladni kód <strong className="font-semibold text-brand-dark">{SLAB_DISCOUNT_CODE}</strong>.</>
                      ) : (
                        <>V&nbsp;<span className="whitespace-nowrap">e-maile</span> nájdete aj kód <strong className="font-semibold text-brand-dark">{SLAB_DISCOUNT_CODE}</strong> na 5&nbsp;% zľavu na platne.</>
                      )}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-brand-muted">
                      <SlabCodeTerms />
                    </p>
                    <ActionButton to="/vzorky" arrow onClick={dismiss} className="mt-4 w-full">
                      Vybrať vzorku
                    </ActionButton>
                  </>
                ) : (
                  <>
                    <Eyebrow className="text-brand-muted">Newsletter</Eyebrow>
                    <h2 id="newsletter-popup-title" className="mt-3 pr-8 text-os-h3">
                      Prvá vzorka s dopravou zadarmo
                    </h2>
                    <p className="mt-2 text-[0.9rem] font-light leading-relaxed text-brand-muted">
                      Prihláste sa na odber noviniek o nových dekoroch a realizáciách. Vzorku vám potom pošleme bez poštovného.
                    </p>

                    <form onSubmit={handleSubmit} className="relative mt-5 grid gap-3">
                      {/* Bot check: visible only when Cloudflare asks for a click, then over the text above the field,
                          out of the flow and first in the tab order (same as the footer, contain:layout included) */}
                      {turnstile.armed && (
                        <Turnstile
                          {...turnstile.widgetProps}
                          id="popup-newsletter-turnstile"
                          className="absolute bottom-[calc(100%_+_0.5rem)] left-0 z-10 [contain:layout]"
                          options={{ appearance: 'interaction-only', theme: 'light', language: 'sk' }}
                        />
                      )}
                      <label htmlFor="newsletter-popup-email" className="sr-only">E-mail</label>
                      <input
                        id="newsletter-popup-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={turnstile.arm}
                        placeholder="vas@email.sk"
                        className="min-h-[50px] w-full rounded-[10px] border border-brand-line bg-white px-4 text-[0.95rem] text-brand-dark placeholder:text-brand-muted/70 transition-colors focus:border-brand-dark focus:outline-none"
                      />
                      {status === 'error' && (
                        <p className="text-[0.8rem] text-red-700" role="alert">{errorMsg}</p>
                      )}
                      <ActionButton type="submit" disabled={loading} className="w-full">
                        {loading ? (
                          <><Loader2 size={16} className="animate-spin" /> Odosielam…</>
                        ) : (
                          'Chcem dopravu zadarmo'
                        )}
                      </ActionButton>
                    </form>

                    <p className="mt-4 text-[0.75rem] font-light leading-relaxed text-brand-muted">
                      Prihlásením súhlasíte so zasielaním noviniek. Odhlásiť sa môžete kedykoľvek.{' '}
                      <Link to="/ochrana-sukromia" target="_blank" className="font-medium text-brand-dark underline underline-offset-4">
                        Ochrana súkromia
                      </Link>
                    </p>

                    <button
                      type="button"
                      onClick={dismiss}
                      disabled={sending}
                      className="mt-2 min-h-[44px] w-full text-center text-[0.8rem] text-brand-muted active:opacity-50 enabled:hover:text-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Nie, ďakujem
                    </button>
                  </>
                )}
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};
