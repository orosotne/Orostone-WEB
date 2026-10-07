import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { EshopAnnouncementBar } from './EshopAnnouncementBar';
import { Footer } from '../Layout/Footer';
import { SiteHeader } from '../Layout/SiteHeader';
import { MobileCtaBar } from '../Layout/MobileCtaBar';
import { getVisibleCategories } from './EshopMegaMenu';
import { CartDrawer } from '../Cart/CartDrawer';
import { CookieBanner } from '../UI/CookieBanner';
import { CookieSettings } from '../UI/CookieSettings';
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
    <div className="min-h-dvh flex flex-col font-sans text-brand-dark bg-white">
      {/*
        Skip link — WCAG 2.4.1 Bypass Blocks (Level A) and EU EAA 2025.
        Visually hidden until keyboard-focused (Tab from page load), then jumps
        to the <main id="main"> below. Keyboard + screen-reader users no longer
        have to tab through the announcement bar + navbar + mega menu on every
        page.
      */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[10000] focus:bg-brand-dark focus:text-white focus:px-5 focus:py-3 focus:rounded-lg focus:font-semibold focus:tracking-wider focus:uppercase focus:text-sm focus:shadow-2xl focus:ring-2 focus:ring-brand-gold focus:outline-none"
      >
        Preskočiť na hlavný obsah
      </a>

      {/* Announcement Bar — controlled by SHOW_ANNOUNCEMENT_BAR constant */}
      {SHOW_ANNOUNCEMENT_BAR && <EshopAnnouncementBar />}

      {/* Header with mega menu, search and drawer */}
      <SiteHeader />

      {/* Cart Drawer (slide-in panel) */}
      <CartDrawer />

      {/* Main Content — homepage has no top padding (hero goes behind transparent navbar) */}
      {/* min-h-dvh reserves viewport height so the footer starts below the fold during initial
          render / Suspense fallback — prevents footer-jump CLS when lazy chunks load and expand main. */}
      <main
        id="main"
        tabIndex={-1}
        className={`min-w-0 w-full flex-grow min-h-dvh focus:outline-none ${isHomepage ? '' : SHOW_ANNOUNCEMENT_BAR ? 'pt-[100px] lg:pt-[116px]' : 'pt-16 lg:pt-20'}`}
      >
        {children}
      </main>

      {/* Footer */}
      <Footer categories={VISIBLE_CATEGORIES} isProductDetail={isProductDetail} compactOrder={pathname === '/vzorky'} />

      {/* Mobile bottom bar: price CTA + phone */}
      <MobileCtaBar />

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
export { EshopMegaMenu, MEGA_MENU_CATEGORIES } from './EshopMegaMenu';
