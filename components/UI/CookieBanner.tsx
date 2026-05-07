import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Cookie, Settings } from 'lucide-react';
import { useCookies } from '../../context/CookieContext';
import { Link } from 'react-router-dom';

export const CookieBanner: React.FC = () => {
  const { hasConsented, acceptAll, rejectAll, openSettings } = useCookies();

  if (hasConsented) return null;

  return (
    <AnimatePresence>
      <m.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 180, delay: 1.5 }}
        className="fixed bottom-0 left-0 right-0 z-[10002] p-4 md:p-6 print:hidden"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-gray-800/60 shadow-2xl shadow-black/40 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center">

              {/* Icon & Text */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-brand-gold" />
                  </div>
                  <h3 className="text-white font-medium text-lg">Používame cookies a podobné technológie</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Na našom webe používame nevyhnutné cookies a podobné technológie
                  na zabezpečenie správneho fungovania, bezpečnosti a uloženia vašich nastavení.
                  Analytické a marketingové technológie používame iba s vaším súhlasom.
                  Svoje nastavenia môžete kedykoľvek zmeniť.
                </p>
                <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                  Nevyhnutné technológie sú vždy aktívne, pretože sú potrebné na základné fungovanie webu.
                  Viac informácií v{' '}
                  <Link to="/cookies" className="text-brand-gold hover:underline">
                    zásadách cookies
                  </Link>
                  {' '}a{' '}
                  <Link to="/ochrana-sukromia" className="text-brand-gold hover:underline">
                    ochrane osobných údajov
                  </Link>.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 lg:flex-shrink-0">
                {/* Primary actions — Reject + Accept side by side */}
                <div className="flex gap-3">
                  <button
                    onClick={rejectAll}
                    className="flex-1 lg:flex-none px-6 py-3.5 border border-gray-600 text-gray-300 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-gray-800 hover:text-white transition-all duration-300"
                  >
                    Odmietnuť všetko
                  </button>
                  <button
                    onClick={acceptAll}
                    className="flex-1 lg:flex-none px-6 py-3.5 bg-brand-gold text-brand-dark rounded-full text-sm font-bold uppercase tracking-wider shadow-lg shadow-brand-gold/25 hover:bg-white hover:shadow-xl transition-all duration-300"
                  >
                    Prijať všetko
                  </button>
                </div>

                {/* Settings link */}
                <button
                  onClick={openSettings}
                  className="group flex items-center justify-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                >
                  <Settings className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                  Prispôsobiť nastavenia
                </button>
              </div>

            </div>
          </div>
        </div>
      </m.div>
    </AnimatePresence>
  );
};
