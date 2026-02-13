import React, { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { EshopLayout } from './components/Eshop/EshopLayout';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { ProductGridSkeleton, ProductDetailSkeleton, CheckoutSkeleton } from './components/UI/Skeleton';

// Core pages (always loaded)
import { Shop } from './pages/Shop';
import { ProductCatalog } from './pages/ProductCatalog';

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
  
  useEffect(() => {
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

          {/* Special Pages */}
          <Route path="/novinky" element={<PlaceholderPage title="Novinky" />} />
          <Route path="/vypredaj" element={<PlaceholderPage title="Výpredaj" />} />
          <Route path="/doprava" element={<PlaceholderPage title="Doprava a platba" />} />
          <Route path="/reklamacie" element={<PlaceholderPage title="Reklamácie a vrátenie" />} />
          <Route path="/kontakt" element={<PlaceholderPage title="Kontakt" />} />
          
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
          
          {/* Fallback */}
          <Route path="*" element={<Shop />} />
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
