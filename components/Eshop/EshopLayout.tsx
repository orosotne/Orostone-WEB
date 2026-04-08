import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { EshopAnnouncementBar } from './EshopAnnouncementBar';
import { EshopNavbar } from './EshopNavbar';
import { Footer } from '../Layout/Footer';
import { getVisibleCategories } from './EshopMegaMenu';
import { CartDrawer } from '../Cart/CartDrawer';
import { NoiseOverlay } from '../UI/NoiseOverlay';
import { CookieBanner } from '../UI/CookieBanner';
import { CookieSettings } from '../UI/CookieSettings';
import { StickySampleCTA } from '../UI/StickySampleCTA';
import { SHOW_ANNOUNCEMENT_BAR } from '../../constants';

// ===========================================
// TYPES
// ===========================================

interface EshopLayoutProps {
  children: ReactNode;
}

// ===========================================
// COMPONENT
// ===========================================

// Cached raz na module-level — getVisibleCategories() vracia tú istú referenciu,
// takže Footer (React.memo) sa neinvaliduje pri každom re-rendri layoutu.
const VISIBLE_CATEGORIES = getVisibleCategories();

export const EshopLayout: React.FC<EshopLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const isHomepage = pathname === '/';
  const isProductDetail = pathname.startsWith('/produkt/');

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-dark bg-white">
      {/* Noise Overlay for texture */}
      <NoiseOverlay />

      {/* Announcement Bar — controlled by SHOW_ANNOUNCEMENT_BAR constant */}
      {SHOW_ANNOUNCEMENT_BAR && <EshopAnnouncementBar />}

      {/* Navbar with Mega Menu */}
      <EshopNavbar />

      {/* Cart Drawer (slide-in panel) */}
      <CartDrawer />

      {/* Main Content — homepage has no top padding (hero goes behind transparent navbar) */}
      <main className={`min-w-0 w-full flex-grow ${isHomepage ? '' : SHOW_ANNOUNCEMENT_BAR ? 'pt-[92px] lg:pt-[148px]' : 'pt-[56px] lg:pt-[112px]'}`}>
        {children}
      </main>

      {/* Footer */}
      <Footer categories={VISIBLE_CATEGORIES} isProductDetail={isProductDetail} />

      {/* Sticky Sample CTA */}
      <StickySampleCTA />

      {/* Cookie Banner & Settings */}
      <CookieBanner />
      <CookieSettings />
    </div>
  );
};

// ===========================================
// INDEX EXPORT
// ===========================================

export { EshopAnnouncementBar } from './EshopAnnouncementBar';
export { EshopNavbar } from './EshopNavbar';
export { EshopMegaMenu, MEGA_MENU_CATEGORIES } from './EshopMegaMenu';
