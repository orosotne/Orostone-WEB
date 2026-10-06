import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useCookies } from '../../context/CookieContext';
import { Link } from 'react-router-dom';

const BUTTON =
  'inline-flex min-h-[48px] items-center justify-center rounded-[10px] px-3 text-center text-[0.7rem] font-bold uppercase leading-tight tracking-[0.1em] transition-colors duration-200';

export const CookieBanner: React.FC = () => {
  const { hasConsented, isSettingsOpen, acceptAll, rejectAll, openSettings } = useCookies();

  // The settings dialog sits below this bar's z-index, so step aside while it is open
  if (hasConsented || isSettingsOpen) return null;

  return (
    <AnimatePresence>
      <m.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 180, delay: 1.5 }}
        className="fixed bottom-0 left-0 right-0 z-[10002] p-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] sm:p-4 md:p-6 print:hidden"
        role="region"
        aria-label="Súhlas s cookies"
      >
        <div className="mx-auto max-w-[1080px] rounded-[3px] border border-brand-line bg-brand-light p-5 text-brand-dark shadow-[0_28px_70px_-24px_rgba(26,26,26,0.4)] md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">

            {/* Text */}
            <div className="flex-1">
              <h3 className="mb-2 text-[1.05rem] font-semibold">Používame cookies a podobné technológie</h3>
              <p className="text-[0.88rem] font-light leading-relaxed text-brand-muted">
                Na našom webe používame nevyhnutné cookies a podobné technológie
                na zabezpečenie správneho fungovania, bezpečnosti a uloženia vašich nastavení.
                Analytické a marketingové technológie používame iba s vaším súhlasom.
                Svoje nastavenia môžete kedykoľvek zmeniť.
              </p>
              <p className="mt-2 text-[0.78rem] font-light leading-relaxed text-brand-muted">
                Nevyhnutné technológie sú vždy aktívne, pretože sú potrebné na základné fungovanie webu.
                Viac informácií v{' '}
                <Link to="/cookies" className="font-medium text-brand-dark underline underline-offset-4">
                  zásadách cookies
                </Link>
                {' '}a{' '}
                <Link to="/ochrana-sukromia" className="font-medium text-brand-dark underline underline-offset-4">
                  ochrane osobných údajov
                </Link>.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 lg:w-[380px] lg:flex-none">
              {/* Primary actions — Reject + Accept side by side, same size */}
              <div className="grid grid-cols-2 gap-2.5">
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

              {/* Settings link */}
              <button
                type="button"
                onClick={openSettings}
                className="group inline-flex min-h-[44px] items-center justify-center gap-1.5 text-[0.88rem] font-medium text-brand-muted transition-colors hover:text-brand-dark"
              >
                <Settings className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
                Prispôsobiť nastavenia
              </button>
            </div>

          </div>
        </div>
      </m.div>
    </AnimatePresence>
  );
};
