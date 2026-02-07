import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, X } from 'lucide-react';
import { useCookies } from '../../context/CookieContext';
import { Link } from 'react-router-dom';

export const CookieBanner: React.FC = () => {
  const { hasConsented, acceptAll, rejectAll, openSettings } = useCookies();

  if (hasConsented) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      >
        <div className="container mx-auto max-w-5xl">
          <div 
            className="bg-[#1a1a1a] border border-gray-800 shadow-2xl shadow-black/50 p-6 md:p-8"
            style={{ borderRadius: 'var(--radius-card, 0)' }}
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
              {/* Icon & Text */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-brand-gold/10 flex items-center justify-center" style={{ borderRadius: 'var(--radius-button, 0)' }}>
                    <Cookie className="w-5 h-5 text-brand-gold" />
                  </div>
                  <h3 className="text-white font-medium text-lg">Táto stránka používa cookies</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Používame cookies na zlepšenie vášho zážitku, analýzu návštevnosti a personalizáciu obsahu. 
                  Kliknutím na "Prijať všetky" súhlasíte s používaním všetkých cookies. 
                  Viac informácií nájdete v našej{' '}
                  <Link to="/ochrana-sukromia" className="text-brand-gold hover:underline">
                    ochrane súkromia
                  </Link>
                  {' '}a{' '}
                  <Link to="/cookies" className="text-brand-gold hover:underline">
                    zásadách používania cookies
                  </Link>.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                <button
                  onClick={openSettings}
                  className="group flex items-center justify-center gap-2 px-5 py-3 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-all text-sm font-medium"
                  style={{ borderRadius: 'var(--radius-button, 0)' }}
                >
                  <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  Nastavenia
                </button>
                <button
                  onClick={rejectAll}
                  className="px-5 py-3 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition-all text-sm font-medium"
                  style={{ borderRadius: 'var(--radius-button, 0)' }}
                >
                  Odmietnuť
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-3 bg-brand-gold text-brand-dark hover:bg-white transition-all text-sm font-semibold shadow-lg shadow-brand-gold/20"
                  style={{ borderRadius: 'var(--radius-button, 0)' }}
                >
                  Prijať všetky
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

