import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings } from 'lucide-react';
import { useCookies } from '../../context/CookieContext';
import { Link } from 'react-router-dom';

export const CookieBanner: React.FC = () => {
  const { hasConsented, acceptAll, rejectAll, openSettings } = useCookies();

  if (hasConsented) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 180, delay: 1.5 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
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
                  <h3 className="text-white font-medium text-lg">Táto stránka používa cookies</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Pre lepší zážitok používame cookies. Podrobnosti v našich{' '}
                  <Link to="/cookies" className="text-brand-gold hover:underline">
                    zásadách cookies
                  </Link>.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 lg:flex-shrink-0">
                {/* Primary CTA — full width on mobile */}
                <button
                  onClick={acceptAll}
                  className="w-full lg:w-auto px-8 py-3.5 bg-brand-gold text-brand-dark rounded-full text-sm font-bold uppercase tracking-wider shadow-lg shadow-brand-gold/25 hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  Prijať všetky
                </button>

                {/* Secondary actions — text links */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={openSettings}
                    className="group flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    <Settings className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                    Nastavenia
                  </button>
                  <span className="text-gray-700">|</span>
                  <button
                    onClick={rejectAll}
                    className="text-gray-500 hover:text-gray-300 hover:underline underline-offset-4 transition-colors text-sm font-medium"
                  >
                    Odmietnuť
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
