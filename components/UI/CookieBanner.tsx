import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useCookies } from '../../context/CookieContext';
import { useCartUI } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { SPRING } from '../../lib/motion';

const BUTTON =
  'os-press inline-flex min-h-[44px] items-center justify-center rounded-[10px] px-3 text-center text-[0.7rem] font-bold uppercase leading-tight tracking-[0.1em]';

/**
 * Compact consent bar: one short paragraph and two equal buttons (reject / accept), so on a phone it covers
 * well under a quarter of the screen. The full explanation of each category lives in the settings dialog.
 */
export const CookieBanner: React.FC = () => {
  const { hasConsented, isSettingsOpen, acceptAll, rejectAll, openSettings } = useCookies();
  const { isOpen: isCartOpen } = useCartUI();

  // The settings dialog and the cart drawer sit below this bar's z-index, so step aside while either is open
  // (on a first visit the bar would otherwise cover the drawer's "Prejsť do pokladne" button).
  // The condition sits inside AnimatePresence, so the bar slides out instead of vanishing.
  const visible = !hasConsented && !isSettingsOpen && !isCartOpen;

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="cookie-banner"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { ...SPRING, delay: 1.5 } }}
          exit={{ y: 24, opacity: 0, transition: { duration: 0.2 } }}
          className="fixed bottom-0 left-0 right-0 z-[10002] p-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] sm:p-4 print:hidden"
          role="region"
          aria-label="Súhlas s cookies"
        >
          <div className="mx-auto max-w-[1080px] rounded-[10px] border border-brand-line bg-brand-light p-4 text-brand-dark shadow-[0_24px_60px_-24px_rgba(26,26,26,0.4)] sm:px-6 sm:py-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
              <div className="min-w-0 flex-1">
                <h2 className="sr-only text-[1rem] font-semibold sm:not-sr-only sm:mb-1">Používame cookies a podobné technológie</h2>
                <p className="text-[0.8rem] font-normal leading-snug text-brand-muted sm:text-[0.84rem] sm:leading-relaxed">
                  Nevyhnutné cookies sú vždy aktívne, web bez nich nefunguje. Analytické a marketingové používame len
                  s vaším súhlasom, ktorý môžete kedykoľvek zmeniť. Viac informácií v{' '}
                  <Link to="/cookies" className="font-medium text-brand-dark underline underline-offset-4">
                    zásadách cookies
                  </Link>
                  {' '}a{' '}
                  <Link to="/ochrana-sukromia" className="font-medium text-brand-dark underline underline-offset-4">
                    ochrane osobných údajov
                  </Link>
                  .{' '}
                  <button
                    type="button"
                    onClick={openSettings}
                    className="font-medium text-brand-dark underline underline-offset-4 transition-opacity active:opacity-60 [@media(pointer:coarse)]:-my-2 [@media(pointer:coarse)]:py-2"
                  >
                    Prispôsobiť nastavenia
                  </button>
                </p>
              </div>

              {/* Reject and accept side by side, same size and weight of outline vs fill */}
              <div className="grid grid-cols-2 gap-2 lg:w-[380px] lg:flex-none">
                <button
                  type="button"
                  onClick={rejectAll}
                  className={`${BUTTON} border border-brand-dark text-brand-dark hover:bg-brand-dark/5`}
                >
                  Odmietnuť všetko
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className={`${BUTTON} bg-brand-dark text-brand-light hover:bg-[#333331]`}
                >
                  Prijať všetko
                </button>
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};
