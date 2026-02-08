import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { EshopAnnouncementBar } from './EshopAnnouncementBar';
import { EshopNavbar } from './EshopNavbar';
import { EshopFooter } from './EshopFooter';
import { CartDrawer } from '../Cart/CartDrawer';
import { NoiseOverlay } from '../UI/NoiseOverlay';
import { CookieBanner } from '../UI/CookieBanner';
import { CookieSettings } from '../UI/CookieSettings';

// ===========================================
// TYPES
// ===========================================

interface EshopLayoutProps {
  children: ReactNode;
}

// ===========================================
// COMPONENT
// ===========================================

export const EshopLayout: React.FC<EshopLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-dark bg-white">
      {/* Noise Overlay for texture */}
      <NoiseOverlay />
      
      {/* Announcement Bar — hidden on homepage for immersive hero experience */}
      {!isHomepage && <EshopAnnouncementBar />}
      
      {/* Navbar with Mega Menu */}
      <EshopNavbar />
      
      {/* Cart Drawer (slide-in panel) */}
      <CartDrawer />
      
      {/* Main Content — homepage has no top padding (hero goes behind transparent navbar) */}
      <main className={`flex-grow ${isHomepage ? '' : 'pt-[92px] lg:pt-[148px]'}`}>
        {children}
      </main>
      
      {/* Footer */}
      <EshopFooter />
      
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
export { EshopFooter } from './EshopFooter';
export { EshopMegaMenu, MEGA_MENU_CATEGORIES } from './EshopMegaMenu';
