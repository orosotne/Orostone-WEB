import React, { useEffect, useRef, Suspense } from 'react';
import { SEOHead } from './components/UI/SEOHead';
import { useAnalytics } from './hooks/useAnalytics';
import { useMetaPixel } from './hooks/useMetaPixel';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { EshopLayout } from './components/Eshop/EshopLayout';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { ProductGridSkeleton, ProductDetailSkeleton, CheckoutSkeleton } from './components/UI/Skeleton';
import { lazyWithRetry } from './lib/utils';

// Core pages (always loaded — high-intent routes should never show a loading spinner)
import { Shop } from './pages/Shop';
import { ProductCatalog } from './pages/ProductCatalog';
import { EshopContact } from './pages/EshopContact';
import { CategoryPage } from './pages/CategoryPage';
import { Checkout } from './pages/Checkout';
import { ThankYou } from './pages/ThankYou';

// Lazy loaded pages — lazyWithRetry retries failed chunk loads (e.g. after deployment)
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

// Prefetch lazy chunks after first idle
if (typeof window !== 'undefined') {
  const prefetch = () => {
    import('./pages/ShopProductDetail');
    import('./pages/Blog');
    import('./pages/BlogArticle');
  };
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(prefetch, { timeout: 4000 });
  } else {
    setTimeout(prefetch, 2000);
  }
}

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { CookieProvider } from './context/CookieContext';
import { CartProvider } from './context/CartContext';

// Global overlays
import { NewsletterPopup } from './components/UI/NewsletterPopup';


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
      <NewsletterPopup />
      <ErrorBoundary level="page">
        <Routes>
          {/* Main Shop */}
          <Route path="/" element={<Shop />} />
          <Route path="/shop" element={<Navigate to="/" replace />} />
          <Route path="/vsetky-produkty" element={<Navigate to="/kategoria/sintered-stone" replace />} />
          
          {/* Categories */}
          <Route path="/kategoria/:slug" element={<CategoryPage />} />
          <Route path="/kategoria/:slug/:subCategory" element={<CategoryPage />} />
          
          {/* Product Detail — skeleton loader */}
          <Route path="/produkt/:id" element={
            <Suspense fallback={<ProductDetailSkeleton />}>
              <ShopProductDetail />
            </Suspense>
          } />
          
          {/* Checkout Flow */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/objednavka-dokoncena" element={<ThankYou />} />
          
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
          <Route path="/kontakt" element={<EshopContact />} />
          <Route path="/objednavky" element={<ExternalRedirect to="https://shopify.com/101386420570/account" />} />

          {/* Redirects for old presentation site paths */}
          <Route path="/kolekcie" element={<Navigate to="/vsetky-produkty" replace />} />
          <Route path="/kolekcie/:collectionId" element={<Navigate to="/vsetky-produkty" replace />} />
          <Route path="/realizacie" element={<Navigate to="/" replace />} />
          <Route path="/online-kalkulacka" element={<Navigate to="/" replace />} />
          <Route path="/vizualizator" element={<Navigate to="/" replace />} />
          <Route path="/o-kameni" element={<Navigate to="/" replace />} />
          <Route path="/sinterovany-kamen" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}>
              <SinterovanyKamen />
            </Suspense>
          } />
          <Route path="/key-facts" element={<Navigate to="/" replace />} />
          
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
// ESHOP APP (with Providers)
// ===========================================

const EshopApp = () => {
  return (
    <ThemeProvider>
      <CookieProvider>
        <CartProvider>
          <Router>
            <EshopAppContent />
          </Router>
        </CartProvider>
      </CookieProvider>
    </ThemeProvider>
  );
};

export default EshopApp;
