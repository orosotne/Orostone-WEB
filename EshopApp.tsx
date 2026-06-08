import React, { useEffect, useRef, Suspense } from 'react';
import { LazyMotion, domMax, MotionConfig } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useAnalytics } from './hooks/useAnalytics';
import { useMetaPixel } from './hooks/useMetaPixel';
import { captureUTM } from './hooks/useUTMTracking';
import { BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { EshopLayout } from './components/Eshop/EshopLayout';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { lazyWithRetry } from './lib/utils';
import { scheduleChunkPrefetch } from './lib/prefetch';
import { appRoutes } from './routes';

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { CookieProvider } from './context/CookieContext';
import { CartProvider } from './context/CartContext';

// Global overlays (lazy — defers supabase from initial bundle)
const NewsletterPopup = lazyWithRetry(() => import('./components/UI/NewsletterPopup').then(m => ({ default: m.NewsletterPopup })));

// Capture UTM params from URL before React Router mounts (sync, runs once)
captureUTM();

// Schedule idle-time prefetch of likely-next chunks
scheduleChunkPrefetch();

// ===========================================
// SCROLL TO TOP ON ROUTE CHANGE
// ===========================================

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;

    const isProductRoute = (p: string) => /^\/produkt\//.test(p);
    if (isProductRoute(prev) && isProductRoute(pathname)) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

// ===========================================
// SPEED INSIGHTS WITH ROUTE PATTERN
// ===========================================

const SpeedInsightsWithRoute = () => {
  const { pathname } = useLocation();
  const route = pathname
    .replace(/^\/produkt\/[^/]+$/, '/produkt/:id')
    .replace(/^\/kategoria\/[^/]+\/[^/]+$/, '/kategoria/:slug/:subCategory')
    .replace(/^\/kategoria\/[^/]+$/, '/kategoria/:slug')
    .replace(/^\/blog\/[^/]+$/, '/blog/:slug');
  return <SpeedInsights route={route} />;
};

// ===========================================
// ESHOP APP CONTENT
// ===========================================

const EshopAppContent = () => {
  useAnalytics();
  useMetaPixel();

  return (
    <EshopLayout>
      <ScrollToTop />
      <Suspense fallback={null}><NewsletterPopup /></Suspense>
      <ErrorBoundary level="page">
        <Routes>
          {appRoutes}
        </Routes>
      </ErrorBoundary>
    </EshopLayout>
  );
};

// ===========================================
// ESHOP APP (with Providers)
// ===========================================

const EshopApp = () => {
  return (
    <ThemeProvider>
      <CookieProvider>
        <CartProvider>
          {/* MotionConfig reducedMotion="user": framer-motion automatically respects
              the user's OS-level "Reduce Motion" preference (prefers-reduced-motion:
              reduce) for every `m.X` and AnimatePresence in the app. Required by
              WCAG 2.3.3 (Animation from Interactions, Level AAA) and EU EAA 2025
              for vestibular-disorder accessibility. Without this, GSAP/ScrollTrigger
              animations stay live but framer-motion ones now obey user preference. */}
          <MotionConfig reducedMotion="user">
            {/* LazyMotion + domMax: tree-shake framer-motion. `domMax` (not `domAnimation`)
                because EshopNavbar, EshopMegaMenu, and Checkout use `layout` / `layoutId` /
                AnimatePresence `popLayout` — those features live only in `domMax`. Using
                `domAnimation` would silently no-op them. `strict` throws if a future
                component reverts to `motion.X` (regression guard). */}
            <LazyMotion features={domMax} strict>
              <Router>
                <EshopAppContent />
                <Analytics />
                <SpeedInsightsWithRoute />
              </Router>
            </LazyMotion>
          </MotionConfig>
        </CartProvider>
      </CookieProvider>
    </ThemeProvider>
  );
};

export default EshopApp;
