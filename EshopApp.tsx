import React, { useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { EshopLayout } from './components/Eshop/EshopLayout';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { ProductGridSkeleton, ProductDetailSkeleton, CheckoutSkeleton } from './components/UI/Skeleton';

// Core pages (always loaded)
import { Shop } from './pages/Shop';
import { ProductCatalog } from './pages/ProductCatalog';
import { EshopContact } from './pages/EshopContact';

// Lazy loaded pages for better bundle splitting
const ShopProductDetail = lazy(() => import('./pages/ShopProductDetail').then(m => ({ default: m.ShopProductDetail })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Account = lazy(() => import('./pages/Account').then(m => ({ default: m.Account })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const CookiesPolicy = lazy(() => import('./pages/CookiesPolicy').then(m => ({ default: m.CookiesPolicy })));
const VOP = lazy(() => import('./pages/VOP').then(m => ({ default: m.VOP })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const BlogPage = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogArticlePage = lazy(() => import('./pages/BlogArticle').then(m => ({ default: m.BlogArticle })));

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { CookieProvider } from './context/CookieContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// ===========================================
// SCROLL TO TOP ON ROUTE CHANGE
// ===========================================

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;

    // Skip scroll when switching between product detail pages
    const isProductRoute = (p: string) => /^\/produkt\//.test(p);
    if (isProductRoute(prev) && isProductRoute(pathname)) {
      // #region agent log
      if (import.meta.env.DEV) {
        void fetch('http://127.0.0.1:7731/ingest/fe10e622-0fa2-40d2-8709-73e6a557fd3f', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0e45ef' },
          body: JSON.stringify({
            sessionId: '0e45ef',
            location: 'EshopApp:ScrollToTop',
            message: 'skipped product-to-product',
            data: { prev, pathname, scrollY: window.scrollY },
            timestamp: Date.now(),
            hypothesisId: 'H2',
          }),
        }).catch(() => {});
      }
      // #endregion
      return;
    }

    // #region agent log
    if (import.meta.env.DEV) {
      void fetch('http://127.0.0.1:7731/ingest/fe10e622-0fa2-40d2-8709-73e6a557fd3f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0e45ef' },
        body: JSON.stringify({
          sessionId: '0e45ef',
          location: 'EshopApp:ScrollToTop',
          message: 'scroll to top applied',
          data: { prev, pathname, scrollYBefore: window.scrollY },
          timestamp: Date.now(),
          hypothesisId: 'H2',
        }),
      }).catch(() => {});
    }
    // #endregion
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

// ===========================================
// PLACEHOLDER PAGES
// ===========================================

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="container mx-auto px-6 py-24 text-center">
    <h1 className="text-3xl font-bold text-brand-dark mb-4">{title}</h1>
    <p className="text-gray-500">Táto stránka je v príprave.</p>
  </div>
);

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Stránka nenájdená | OROSTONE';
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';
    return () => { if (meta) meta.content = 'index, follow'; };
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
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
            href="/vsetky-produkty"
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
  return (
    <EshopLayout>
      <ScrollToTop />
      <ErrorBoundary level="page">
        <Routes>
          {/* Main Shop */}
          <Route path="/" element={<Shop />} />
          <Route path="/shop" element={<Navigate to="/" replace />} />
          <Route path="/vsetky-produkty" element={<ProductCatalog />} />
          
          {/* Categories */}
          <Route path="/kategoria/:slug" element={
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
          
          {/* Checkout Flow — skeleton loader */}
          <Route path="/checkout" element={
            <Suspense fallback={<CheckoutSkeleton />}>
              <Checkout />
            </Suspense>
          } />
          
          {/* Auth — generic spinner */}
          <Route path="/login" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}>
              <Login />
            </Suspense>
          } />
          <Route path="/register" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}>
              <Register />
            </Suspense>
          } />
          <Route path="/ucet" element={
            <Suspense fallback={<LoadingSpinner text="Načítavam..." fullScreen={false} />}>
              <Account />
            </Suspense>
          } />
          
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
          <Route path="/doprava" element={<PlaceholderPage title="Doprava a platba" />} />
          <Route path="/reklamacie" element={<PlaceholderPage title="Reklamácie a vrátenie" />} />
          <Route path="/kontakt" element={<EshopContact />} />
          <Route path="/objednavky" element={<Navigate to="/ucet" replace />} />

          {/* Redirects for old presentation site paths */}
          <Route path="/kolekcie" element={<Navigate to="/vsetky-produkty" replace />} />
          <Route path="/kolekcie/:collectionId" element={<Navigate to="/vsetky-produkty" replace />} />
          <Route path="/realizacie" element={<Navigate to="/" replace />} />
          <Route path="/online-kalkulacka" element={<Navigate to="/" replace />} />
          <Route path="/vizualizator" element={<Navigate to="/" replace />} />
          <Route path="/o-kameni" element={<Navigate to="/" replace />} />
          <Route path="/sinterovany-kamen" element={<Navigate to="/" replace />} />
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
        <AuthProvider>
          <CartProvider>
            <Router>
              <EshopAppContent />
            </Router>
          </CartProvider>
        </AuthProvider>
      </CookieProvider>
    </ThemeProvider>
  );
};

export default EshopApp;
