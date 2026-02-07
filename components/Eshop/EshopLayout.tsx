import React, { ReactNode } from 'react';
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
  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-dark bg-white">
      {/* Noise Overlay for texture */}
      <NoiseOverlay />
      
      {/* Announcement Bar (zlatá lišta - fixed, vždy viditeľná) */}
      <EshopAnnouncementBar />
      
      {/* Navbar with Mega Menu (pod announcement bar) */}
      <EshopNavbar />
      
      {/* Cart Drawer (slide-in panel) */}
      <CartDrawer />
      
      {/* Main Content */}
      {/* pt-[calc(announcement 36px + top bar 64px + nav 48px)] = 148px */}
      <main className="flex-grow pt-[92px] lg:pt-[148px]">
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
