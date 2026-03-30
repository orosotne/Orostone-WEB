import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Diamond } from 'lucide-react';

/**
 * Floating sticky CTA button for requesting a free sample.
 * - Appears after scrolling 400px
 * - Hidden on checkout, thank-you, and legal pages
 * - On homepage: scrolls to SampleLeadSection
 * - On other pages: navigates to homepage #vzorka
 * - Hidden on mobile product pages (already have sticky bar)
 */
export const StickySampleCTA: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Pages where CTA should NOT appear
  const hiddenPaths = ['/checkout', '/objednavka-dokoncena', '/vop', '/ochrana-sukromia', '/cookies', '/odstupenie-od-zmluvy', '/reklamacie', '/doprava'];
  const isHidden = hiddenPaths.some(p => location.pathname.startsWith(p));
  const isProductPage = location.pathname.startsWith('/produkt/');
  const isHomepage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isHidden) return null;

  const handleClick = () => {
    if (isHomepage) {
      // Scroll to SampleLeadSection on homepage
      const section = document.getElementById('vzorka');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // Navigate to homepage with hash
    navigate('/#vzorka');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={handleClick}
          className={`
            fixed z-40 shadow-lg hover:shadow-xl
            bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark
            transition-all duration-300 group
            ${isProductPage
              ? 'hidden lg:flex bottom-8 right-8 items-center gap-2.5 px-5 py-3.5 rounded-full'
              : 'bottom-6 right-6 lg:bottom-8 lg:right-8 flex items-center gap-2.5 px-5 py-3.5 rounded-full'
            }
          `}
          aria-label="Objednať vzorku zadarmo"
        >
          <Diamond size={16} strokeWidth={1.5} className="text-brand-gold group-hover:text-brand-dark transition-colors flex-shrink-0" />
          <span className="text-xs font-bold tracking-wider uppercase whitespace-nowrap">
            Vzorka zadarmo
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
