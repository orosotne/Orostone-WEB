import React, { useState, useEffect, useMemo, useRef, useCallback, startTransition } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingBag, ChevronDown, Phone, X } from 'lucide-react';
import { useCartUI, useCartState } from '../../context/CartContext';
import { EshopMegaMenu, MegaMenuCategory, getVisibleCategories } from '../Eshop/EshopMegaMenu';
import { ShopProduct, SHOW_ANNOUNCEMENT_BAR } from '../../constants';
import { useShopifyProducts } from '../../hooks/useShopifyProducts';
import { ActionButton, Container } from '../Design';
import { shopifySized } from '../../lib/shopifyImage';

const SHOPIFY_ACCOUNT_URL = 'https://shopify.com/101386420570/account';
const PHONE_HREF = 'tel:+421917588738';
const PHONE_LABEL = '+421 917 588 738';
const PRICE_URL = (od: string) => `https://oro-klient.orostone.sk/?od=${od}`;

// One category today (sinterovaný kameň); its link is shown as „Dekory“ and opens the mega menu.
const CATEGORY = getVisibleCategories()[0];

// Superset of the prerender nav (scripts/prerender.ts SITE_NAV_HTML) — keep the two in step.
const NAV_LINKS: Array<{ to: string; label: string }> = [
  { to: '/vzorky', label: 'Vzorky' },
  { to: '/realizacie', label: 'Realizácie' },
  { to: '/kuchyne', label: 'Kuchyne' },
  { to: '/cennik', label: 'Cenník' },
  { to: '/sinterovany-kamen', label: 'O kameni' },
  { to: '/blog', label: 'Blog' },
  { to: '/kontakt', label: 'Kontakt' },
];

/** Gold dot next to Kariéra — a quiet signal that hiring is open. */
const HiringDot: React.FC = () => (
  <span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" aria-hidden="true" />
);

const iconBtn =
  'grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-brand-dark/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark';

export const SiteHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openCart } = useCartUI();
  const { itemCount } = useCartState();

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<MegaMenuCategory | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEverOpened, setSearchEverOpened] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Defer product catalog fetch until search is actually opened
  const { products: shopProducts } = useShopifyProducts(50, { enabled: searchEverOpened });

  const isHomepage = location.pathname === '/';
  const isTransparent = isHomepage && !scrolled && !drawerOpen && !searchOpen && !megaOpen;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return shopProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.color && p.color.toLowerCase().includes(query)) ||
          (p.finish && p.finish.toLowerCase().includes(query)),
      )
      .slice(0, 6);
  }, [searchQuery, shopProducts]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  const handleSearchSelect = useCallback(
    (product: ShopProduct) => {
      closeSearch();
      navigate(`/produkt/${product.id}`);
    },
    [closeSearch, navigate],
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchResults.length > 0) handleSearchSelect(searchResults[0]);
      else if (searchQuery.trim()) {
        closeSearch();
        navigate('/kategoria/sintered-stone');
      }
    },
    [searchResults, searchQuery, handleSearchSelect, closeSearch, navigate],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on route change (skip the first commit after mount)
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    setDrawerOpen(false);
    setMegaOpen(null);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Escape closes any open layer
  useEffect(() => {
    if (!drawerOpen && !searchOpen && !megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setDrawerOpen(false);
      setMegaOpen(null);
      closeSearch();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, searchOpen, megaOpen, closeSearch]);

  // The drawer covers the page: keep the page behind it from scrolling
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const toggleSearch = () => {
    if (!searchOpen) setSearchEverOpened(true);
    setDrawerOpen(false);
    setMegaOpen(null);
    startTransition(() => setSearchOpen((v) => !v));
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `border-b py-1.5 no-underline transition-colors ${isActive ? 'border-current' : 'border-transparent hover:border-current'}`;

  return (
    <header
      // While transparent over the homepage hero, a soft chalk veil (::before) keeps the dark nav, logo and icons
      // readable where the photo turns to dark wood (≥4.5:1 instead of ~2:1).
      className={`fixed inset-x-0 z-50 pt-[env(safe-area-inset-top,0px)] text-brand-dark transition-[background-color,box-shadow] duration-300 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-[calc(100%+48px)] before:bg-gradient-to-b before:from-brand-light/65 before:via-brand-light/50 before:via-45% before:to-brand-light/0 before:transition-opacity before:duration-300 ${SHOW_ANNOUNCEMENT_BAR ? 'top-[36px]' : 'top-0'} ${isTransparent ? 'bg-transparent before:opacity-100' : 'bg-brand-light shadow-[0_1px_0_theme(colors.brand.line)] before:opacity-0'}`}
      onMouseLeave={() => setMegaOpen(null)}
    >
      <Container className="flex h-16 items-center gap-6 lg:h-20 min-[1360px]:gap-9">
        <Link to="/" className="flex-none" aria-label="OROSTONE, hlavná stránka">
          <img src="/images/orostone-logo.svg" alt="OROSTONE" width={136} height={27} className="h-auto w-[118px] lg:w-[136px]" />
        </Link>

        {/* Desktop navigation (from 1360 px) */}
        <nav aria-label="Hlavné menu" className="mx-auto hidden items-center gap-[clamp(18px,1.6vw,30px)] text-[0.9rem] font-medium min-[1360px]:flex">
          {CATEGORY && (
            <div className="relative" onMouseEnter={() => setMegaOpen(CATEGORY)}>
              <NavLink to={`/kategoria/${CATEGORY.slug}`} className={(s) => `${navLinkClass(s)} inline-flex items-center gap-1`}>
                Dekory
                <ChevronDown size={14} strokeWidth={1.6} className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </NavLink>
            </div>
          )}
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass} onMouseEnter={() => setMegaOpen(null)}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 min-[1360px]:ml-0 min-[1360px]:gap-2">
          <a href={PHONE_HREF} className={`${iconBtn} hidden min-[1360px]:grid min-[1600px]:hidden`} aria-label={`Zavolať ${PHONE_LABEL}`}>
            <Phone size={18} strokeWidth={1.6} />
          </a>
          <a href={PHONE_HREF} className="mr-2 hidden text-[0.88rem] font-medium tabular-nums no-underline hover:underline min-[1600px]:inline">
            {PHONE_LABEL}
          </a>
          <button type="button" onClick={toggleSearch} className={iconBtn} aria-label="Hľadať" aria-expanded={searchOpen}>
            {searchOpen ? <X size={20} strokeWidth={1.6} /> : <Search size={19} strokeWidth={1.6} />}
          </button>
          <a href={SHOPIFY_ACCOUNT_URL} className={`${iconBtn} hidden min-[1360px]:grid`} aria-label="Môj účet">
            <User size={19} strokeWidth={1.6} />
          </a>
          <button type="button" onClick={openCart} className={`${iconBtn} relative`} aria-label={`Košík, ${itemCount} ${itemCount === 1 ? 'položka' : 'položky'}`}>
            <ShoppingBag size={19} strokeWidth={1.6} />
            {itemCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-dark px-1 text-[0.6rem] font-semibold text-brand-light">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
          <ActionButton variant="gold" size="sm" to={PRICE_URL('hlavicka')} className="ml-2 hidden md:inline-flex">
            Orientačná cena
          </ActionButton>
          <button
            type="button"
            onClick={() => {
              setSearchOpen(false);
              startTransition(() => setDrawerOpen((v) => !v));
            }}
            className={`${iconBtn} relative min-[1360px]:hidden`}
            aria-label="Menu"
            aria-expanded={drawerOpen}
            aria-controls="site-drawer"
          >
            <span className={`absolute left-3 right-3 top-[17px] h-[1.5px] bg-current transition-transform ${drawerOpen ? 'translate-y-[4px] rotate-45' : ''}`} />
            <span className={`absolute left-3 right-3 top-[25px] h-[1.5px] bg-current transition-transform ${drawerOpen ? '-translate-y-[4px] -rotate-45' : ''}`} />
          </button>
        </div>
      </Container>

      {/* Mega menu (desktop) */}
      <AnimatePresence>
        {megaOpen && <EshopMegaMenu category={megaOpen} isOpen={true} onClose={() => setMegaOpen(null)} />}
      </AnimatePresence>

      {/* Search panel */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-full border-t border-brand-line bg-brand-light shadow-[0_1px_0_theme(colors.brand.line)]">
          <Container className="py-5">
            <form onSubmit={handleSearchSubmit} className="relative mx-auto max-w-xl" role="search">
              <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-muted" aria-hidden="true" />
              <label htmlFor="site-search" className="sr-only">Hľadať dekor</label>
              <input
                id="site-search"
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hľadať dekor…"
                autoFocus
                className="w-full border-b border-brand-dark bg-transparent py-3 pl-7 pr-2 text-lg text-brand-dark placeholder:text-brand-muted focus:outline-none"
              />
            </form>
            {searchQuery.length >= 2 && (
              <div className="mx-auto mt-3 max-w-xl overflow-hidden rounded-[10px] border border-brand-line bg-white">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSearchSelect(product)}
                        className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-brand-light"
                      >
                        <img src={shopifySized(product.image, 120)} alt="" width={48} height={48} className="h-12 w-12 flex-shrink-0 rounded-[6px] object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{product.name}</span>
                          <span className="block truncate text-xs text-brand-muted">
                            {product.dimensions} · {product.thickness}
                          </span>
                        </span>
                        <span className="flex-shrink-0 text-sm font-semibold">€{product.pricePerM2}/m²</span>
                      </button>
                    ))}
                    <Link to="/kategoria/sintered-stone" onClick={closeSearch} className="block border-t border-brand-line px-4 py-3 text-center text-[0.72rem] font-bold uppercase tracking-[0.12em] hover:bg-brand-light">
                      Zobraziť všetky dekory
                    </Link>
                  </>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-brand-muted">Žiadne výsledky pre „{searchQuery}“</p>
                    <Link to="/kategoria/sintered-stone" onClick={closeSearch} className="mt-2 inline-block text-[0.72rem] font-bold uppercase tracking-[0.12em] underline-offset-4 hover:underline">
                      Prehliadnuť celý katalóg
                    </Link>
                  </div>
                )}
              </div>
            )}
          </Container>
        </div>
      )}

      {/* Drawer (below 1360 px) */}
      {drawerOpen && (
        <div id="site-drawer" className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto overscroll-contain border-t border-brand-line bg-brand-light lg:top-20 min-[1360px]:hidden">
          <Container className="grid gap-8 py-4 pb-[calc(32px+env(safe-area-inset-bottom,0px))]">
            <nav aria-label="Menu" className="grid">
              {CATEGORY && (
                <Link to={`/kategoria/${CATEGORY.slug}`} className="border-b border-brand-line py-3.5 text-[1.05rem] font-medium no-underline">
                  Dekory
                </Link>
              )}
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} className="border-b border-brand-line py-3.5 text-[1.05rem] font-medium no-underline">
                  {label}
                </Link>
              ))}
              <Link to="/kariera" className="flex items-center gap-2.5 border-b border-brand-line py-3.5 text-[1.05rem] font-medium no-underline">
                Kariéra
                <HiringDot />
              </Link>
            </nav>
            <div className="grid gap-1">
              <p className="text-os-eyebrow uppercase text-brand-muted">Účet</p>
              <a href={SHOPIFY_ACCOUNT_URL} className="flex items-center gap-3 py-2.5 text-[0.95rem] no-underline">
                <User size={18} strokeWidth={1.6} aria-hidden="true" /> Môj účet
              </a>
              <a href={SHOPIFY_ACCOUNT_URL} className="flex items-center gap-3 py-2.5 text-[0.95rem] no-underline">
                <ShoppingBag size={18} strokeWidth={1.6} aria-hidden="true" /> Moje objednávky
              </a>
            </div>
            <div className="grid gap-3">
              <a href={PHONE_HREF} className="flex items-center gap-3 text-[1.05rem] font-medium tabular-nums no-underline">
                <Phone size={18} strokeWidth={1.6} aria-hidden="true" /> {PHONE_LABEL}
              </a>
              <p className="text-[0.85rem] font-normal text-brand-muted">Po–Pia 8:00 – 17:00</p>
              <ActionButton variant="gold" to={PRICE_URL('menu')} className="mt-2 w-full sm:w-auto">
                Získať orientačnú cenu
              </ActionButton>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
};
