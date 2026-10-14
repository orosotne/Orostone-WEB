import React, { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';
import { subscribeToNewsletter, NEWSLETTER_POPUP_KEY } from '../../services/newsletter.service';
import { trackGA4Event } from '../../services/analytics';
import { useBackgroundTurnstile } from '../../hooks/useBackgroundTurnstile';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useCookies } from '../../context/CookieContext';
import { useCartUI } from '../../context/CartContext';
import { ActionButton, Eyebrow } from '../Design';
import { SPRING, FADE } from '../../lib/motion';

const DELAY_MS = 8000;
// Pages where an offer would get in the way of finishing an order
const HIDDEN_ON = ['/objednavka-dokoncena'];
// Welcome reward: free shipping on the first sample. Shopify free-shipping code, shipping up to 3 €, once per customer.
const DISCOUNT_CODE = 'VITAJTE';

function getPopupState(): string | null {
  try { return localStorage.getItem(NEWSLETTER_POPUP_KEY); } catch { return null; }
}

function setPopupState(value: string) {
  try { localStorage.setItem(NEWSLETTER_POPUP_KEY, value); } catch { /* ignore */ }
}

export const NewsletterPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const turnstile = useBackgroundTurnstile();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { hasConsented, isSettingsOpen } = useCookies();
  const { isOpen: isCartOpen } = useCartUI();
  const { pathname } = useLocation();

  useScrollLock(visible);

  // Wait until the cookie bar is answered and nothing else is open, then give the visitor a few seconds on the page
  const blocked = !hasConsented || isSettingsOpen || isCartOpen || HIDDEN_ON.includes(pathname);
  useEffect(() => {
    if (blocked || getPopupState()) return;
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [blocked]);

  const dismiss = () => {
    setVisible(false);
    if (status !== 'success') setPopupState('dismissed');
  };

  // Keyboard: focus lands on the close button, Escape closes the dialog
  useEffect(() => {
    if (!visible) return;
    closeButtonRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');

    const result = await subscribeToNewsletter({ email, source: 'popup', turnstileToken: await turnstile.getToken() });

    if (result.success) {
      trackGA4Event('sign_up', { method: 'newsletter_popup' });
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
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={SPRING}
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-popup-title"
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
                className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full bg-brand-light/85 text-brand-muted os-press hover:bg-brand-sand hover:text-brand-dark"
                aria-label="Zavrieť"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

              <div className="min-w-0 flex-1 px-5 pb-5 pt-5 sm:px-7 sm:pb-7 sm:pt-8">
                {status === 'success' ? (
                  <>
                    <Eyebrow className="text-brand-muted">Ste prihlásení</Eyebrow>
                    <h2 id="newsletter-popup-title" className="mt-3 text-os-h3">
                      Doprava prvej vzorky je na nás
                    </h2>
                    <p className="mt-2 text-[0.9rem] font-light leading-relaxed text-brand-muted">
                      Pri objednávke vzorky zadajte v pokladni kód. Poslali sme vám ho aj e-mailom.
                    </p>
                    <p className="mt-4 rounded-[3px] border border-dashed border-brand-dark/40 bg-brand-sand px-4 py-3 text-center text-[1.1rem] font-semibold tracking-[0.2em]">
                      {DISCOUNT_CODE}
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
                      <ActionButton type="submit" disabled={status === 'loading'} className="w-full">
                        {status === 'loading' ? (
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
                      className="mt-2 min-h-[44px] w-full text-center text-[0.8rem] text-brand-muted active:opacity-50 hover:text-brand-dark"
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
