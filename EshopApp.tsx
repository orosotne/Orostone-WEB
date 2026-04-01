import React, { useEffect, useRef, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { SEOHead } from './components/UI/SEOHead';
import { useAnalytics } from './hooks/useAnalytics';
import { useMetaPixel } from './hooks/useMetaPixel';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { EshopLayout } from './components/Eshop/EshopLayout';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { ProductGridSkeleton, ProductDetailSkeleton, CheckoutSkeleton } from './components/UI/Skeleton';
import { lazyWithRetry } from './lib/utils';

// Core page — landing page must never show a loading spinner
import { Shop } from './pages/Shop';

// Lazy loaded pages — lazyWithRetry retries failed chunk loads (e.g. after deployment)
const ProductCatalog = lazyWithRetry(() => import('./pages/ProductCatalog').then(m => ({ default: m.ProductCatalog })));
const EshopContact = lazyWithRetry(() => import('./pages/EshopContact').then(m => ({ default: m.EshopContact })));
const CategoryPage = lazyWithRetry(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const Checkout = lazyWithRetry(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const ThankYou = lazyWithRetry(() => import('./pages/ThankYou').then(m => ({ default: m.ThankYou })));
const ShopProductDetail = lazyWithRetry(() => import('./pages/ShopProductDetail').then(m => ({ default: m.ShopProductDetail })));

const BlogPage = lazyWithRetry(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogArticlePage = lazyWithRetry(() => import('./pages/BlogArticle').then(m => ({ default: m.BlogArticle })));
const PrivacyPolicy = lazyWithRetry(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const CookiesPolicy = lazyWithRetry(() => import('./pages/CookiesPolicy').then(m => ({ default: m.CookiesPolicy })));
const VOP = lazyWithRetry(() => import('./pages/VOP').then(m => ({ default: m.VOP })));
const DopravaAPlatba = lazyWithRetry(() => import('./pages/DopravaAPlatba').then(m => ({ default: m.DopravaAPlatba })));
const ReklamacieAVratenie = lazyWithRetry(() => import('./pages/ReklamacieAVratenie').then(m => ({ default: m.ReklamacieAVratenie })));
const SinterovanyKamen = lazyWithRetry(() => import('./pages/SinterovanyKamen').then(m => ({ default: m.SinterovanyKamen })));
const OdstupeniOdZmluvy = lazyWithRetry(() => import('./pages/OdstupeniOdZmluvy').then(m => ({ default: m.OdstupeniOdZmluvy })));
const Vzorky = lazyWithRetry(() => import('./pages/Vzorky').then(m => ({ default: m.Vzorky })));

// Stagger prefetch of lazy chunks — high-intent routes first, lower-priority later
if (typeof window !== 'undefined') {
  const schedule = (fn: () => void, delay: number) => setTimeout(fn, delay);
  const idle = (fn: () => void, timeout: number) => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(fn, { timeout });
    } else {
      setTimeout(fn, timeout);
    }
  };

  // Batch 1: most likely next pages (after 2s idle)
  idle(() => {
    import('./pages/CategoryPage');
    import('./pages/ProductCatalog');
  }, 3000);

  // Batch 2: product detail + checkout (after 5s)
  schedule(() => {
    import('./pages/ShopProductDetail');
    import('./pages/Checkout');
  }, 5000);

  // Batch 3: blog (lowest priority, after 8s)
  schedule(() => {
    import('./pages/Blog');
    import('./pages/BlogArticle');
  }, 8000);
}

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { CookieProvider } from './context/CookieContext';
import { CartProvider } from './context/CartContext';

// Global overlays (lazy — defers supabase from initial bundle)
const NewsletterPopup = lazyWithRetry(() => import('./components/UI/NewsletterPopup').then(m => ({ default: m.NewsletterPopup })));


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
// PLACEHOLDER PAGES
// ===========================================

const ExternalRedirect: React.FC<{ to: string }> = ({ to }) => {
  useEffect(() => { window.location.href = to; }, [to]);
  return <LoadingSpinner text="Presmerovanie..." fullScreen={false} />;
};

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="container mx-auto px-6 py-24 text-center">
    <h1 className="text-3xl font-bold text-brand-dark mb-4">{title}</h1>
    <p className="text-gray-500">Táto stránka je v príprave.</p>
  </div>
);

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <SEOHead title="Stránka nenájdená | OROSTONE" description="Hľadaná stránka neexistuje alebo bola presunutá." noindex={true} />
      <div className="text-center max-w-lg">
        <p className="text-7xl font-bold text-brand-gold mb-4">404</p>
        <h1 className="text-2xl font-bold text-brand-dark mb-3">Stránka nenájdená</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Hľadaná stránka neexistuje alebo bola presunutá. Skúste sa pozrieť na naše produkty alebo sa vráťte na hlavnú stránku.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-lg text-sm tracking-wider uppercase font-semibold hover:bg-brand-gold hover:text-brand-dark transition-all"
          >
            Hlavná stránka
          </a>
          <a
            href="/kategoria/sintered-stone"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-brand-dark px-6 py-3 rounded-lg text-sm tracking-wider uppercase font-semibold hover:border-brand-dark transition-all"
          >
            Všetky produkty
          </a>
        </div>
      </div>
    </div>
  );
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
          {/* Main Shop */}
          <Route path="/" element={<Shop />} />
          <Route path="/shop" element={<Navigate to="/" replace />} />
          <Route path="/vsetky-produkty" element={<Navigate to="/kategoria/sintered-stone" replace />} />
          
          {/* Categories */}
          <Route path="/kategoria/:slug" element={
            <Suspense fallback={<ProductGridSkeleton />}>
              <CategoryPage />
            </Suspense>
          } />
          <Route path="/kategoria/:slug/:subCategory" element={
            <Suspense fallback={<ProductGridSkeleton />}>
              <CategoryPage />
            </Suspense>
          } />
          
          {/* Product Detail — skeleton loader */}
          <Route path="/produkt/:id" element={
            <Suspense fallback={<ProductDetailSkeleton />}>
              <ShopProductDetail />
            </Suspense>
          } />
          
          {/* Checkout Flow */}
          <Route path="/checkout" element={
            <Suspense fallback={<CheckoutSkeleton />}>
              <Checkout />
            </Suspense>
          } />
          <Route path="/objednavka-dokoncena" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}>
              <ThankYou />
            </Suspense>
          } />
          
          {/* Auth — redirect to Shopify Customer Accounts */}
          <Route path="/login" element={<ExternalRedirect to="https://shopify.com/101386420570/account" />} />
          <Route path="/register" element={<ExternalRedirect to="https://shopify.com/101386420570/account" />} />
          <Route path="/ucet" element={<ExternalRedirect to="https://shopify.com/101386420570/account" />} />
          
          {/* Blog */}
          <Route path="/blog" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam blog..." fullScreen={false} />}>
              <BlogPage />
            </Suspense>
          } />
          <Route path="/blog/:slug" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam článok..." fullScreen={false} />}>
              <BlogArticlePage />
            </Suspense>
          } />

          {/* Info Pages */}
          <Route path="/doprava" element={<Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}><DopravaAPlatba /></Suspense>} />
          <Route path="/reklamacie" element={<Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}><ReklamacieAVratenie /></Suspense>} />
          <Route path="/odstupenie-od-zmluvy" element={<Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}><OdstupeniOdZmluvy /></Suspense>} />
          <Route path="/kontakt" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}>
              <EshopContact />
            </Suspense>
          } />
          <Route path="/vzorky" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}>
              <Vzorky />
            </Suspense>
          } />
          <Route path="/objednavky" element={<ExternalRedirect to="https://shopify.com/101386420570/account" />} />

          <Route path="/sinterovany-kamen" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}>
              <SinterovanyKamen />
            </Suspense>
          } />
          
          {/* Legal */}
          <Route path="/vop" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}>
              <VOP />
            </Suspense>
          } />
          <Route path="/ochrana-sukromia" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}>
              <PrivacyPolicy />
            </Suspense>
          } />
          <Route path="/cookies" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}>
              <CookiesPolicy />
            </Suspense>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </EshopLayout>
  );
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
// ESHOP APP (with Providers)
// ===========================================

const EshopApp = () => {
  return (
    <ThemeProvider>
      <CookieProvider>
        <CartProvider>
          <Router>
            <EshopAppContent />
            <Analytics />
            <SpeedInsightsWithRoute />
          </Router>
        </CartProvider>
      </CookieProvider>
    </ThemeProvider>
  );
};

export default EshopApp;
