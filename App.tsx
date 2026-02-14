import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';

// Lazy loaded pages for better bundle splitting
// E-shop pages (Checkout, Login, Register, Account) removed - they live in EshopApp.tsx
const Collections = lazy(() => import('./pages/Collections').then(m => ({ default: m.Collections })));
const CollectionDetail = lazy(() => import('./pages/CollectionDetail').then(m => ({ default: m.CollectionDetail })));
// ProductDetail presmerovaný na e-shop - lazy import odstránený
const Realizations = lazy(() => import('./pages/Realizations').then(m => ({ default: m.Realizations })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Calculator = lazy(() => import('./pages/Calculator').then(m => ({ default: m.Calculator })));
const Visualizer = lazy(() => import('./pages/Visualizer').then(m => ({ default: m.Visualizer })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const CookiesPolicy = lazy(() => import('./pages/CookiesPolicy').then(m => ({ default: m.CookiesPolicy })));
const VOP = lazy(() => import('./pages/VOP').then(m => ({ default: m.VOP })));
const KeyFacts = lazy(() => import('./pages/KeyFacts').then(m => ({ default: m.KeyFacts })));
const OKameni = lazy(() => import('./pages/O_Kameni').then(m => ({ default: m.OKameni })));
const SinterovanyKamen = lazy(() => import('./pages/SinterovanyKamen').then(m => ({ default: m.SinterovanyKamen })));

import { QuoteWizard } from './components/Wizard/QuoteWizard';
import { NoiseOverlay } from './components/UI/NoiseOverlay';
import { ScrollProgress } from './components/UI/ScrollProgress';
import { CookieBanner } from './components/UI/CookieBanner';
import { CookieSettings } from './components/UI/CookieSettings';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { AnimatePresence } from 'framer-motion';
import { SmoothScroll } from './components/Utils/SmoothScroll';
import { ThemeProvider } from './context/ThemeContext';
import { CookieProvider } from './context/CookieContext';
// CartProvider and AuthProvider removed - not needed on main website
import { DesignSwitcher } from './components/Utils/DesignSwitcher';
// CartDrawer removed - lives in EshopApp.tsx only
// AnnouncementBar removed - only used in eshop.orostone.sk

// Redirect e-shop routes to eshop.html with optional path
const RedirectToEshop: React.FC<{ path?: string }> = ({ path = '' }) => {
  useEffect(() => {
    const targetPath = path ? `#${path}` : '';
    window.location.href = `/eshop.html${targetPath}`;
  }, [path]);
  return <LoadingSpinner text="Presmerovávam do e-shopu..." />;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Force immediate scroll to top, bypassing smooth scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Also try to scroll the body/html in case smooth scroll library intercepts
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  
  return null;
};

const AppContent = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-dark bg-[#F9F9F7]">
      <SmoothScroll />
      <ScrollProgress />
      <NoiseOverlay />
      {/* AnnouncementBar je iba na eshop.orostone.sk */}
      <Navbar />
      {/* CartDrawer je iba na eshop.orostone.sk */}
      <ScrollToTop />

      <div className="flex-grow">
        <ErrorBoundary level="page">
        <Suspense fallback={<LoadingSpinner text="Načítavam stránku..." fullScreen={false} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* E-shop routes - všetky presmerované na eshop.orostone.sk */}
            <Route path="/shop" element={<RedirectToEshop />} />
            <Route path="/checkout" element={<RedirectToEshop path="/checkout" />} />
            <Route path="/login" element={<RedirectToEshop path="/login" />} />
            <Route path="/register" element={<RedirectToEshop path="/register" />} />
            <Route path="/ucet" element={<RedirectToEshop path="/ucet" />} />
            <Route path="/produkt/:id" element={<RedirectToEshop path="/produkt" />} />

            {/* Prezentačné stránky */}
            <Route path="/kolekcie" element={<Collections />} />
            <Route path="/kolekcie/:collectionId" element={<CollectionDetail />} />
            <Route path="/realizacie" element={<Realizations />} />
            <Route path="/kontakt" element={<Contact onOpenWizard={() => setIsWizardOpen(true)} />} />
            <Route path="/online-kalkulacka" element={<Calculator />} />
            <Route path="/vizualizator" element={<Visualizer />} />
            <Route path="/key-facts" element={<KeyFacts />} />
            <Route path="/o-kameni" element={<OKameni />} />
            <Route path="/sinterovany-kamen" element={<SinterovanyKamen />} />
            
            {/* Legal stránky */}
            <Route path="/ochrana-sukromia" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            <Route path="/vop" element={<VOP />} />
            
            {/* Fallback routes */}
            <Route path="/kuchyne" element={<Home />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </div>

      <Footer />

      <AnimatePresence>
        {isWizardOpen && (
          <QuoteWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
        )}
      </AnimatePresence>

      <CookieBanner />
      <CookieSettings />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <CookieProvider>
        {/* AuthProvider a CartProvider odstránené - používajú sa iba v EshopApp.tsx */}
        <Router>
          <AppContent />
          <DesignSwitcher />
        </Router>
      </CookieProvider>
    </ThemeProvider>
  );
};

export default App;
