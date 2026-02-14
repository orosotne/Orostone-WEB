import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, ShoppingBag, Menu, X, ChevronDown, Heart, ArrowLeft, Diamond
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { EshopMegaMenu, MEGA_MENU_CATEGORIES, MegaMenuCategory } from './EshopMegaMenu';
import { cn } from '../../lib/utils';
import { SHOP_PRODUCTS, ShopProduct, SHOW_ANNOUNCEMENT_BAR } from '../../constants';

// ===========================================
// ZARA-STYLE ESHOP NAVBAR
// ===========================================

export const EshopNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openCart, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [offCanvasOpen, setOffCanvasOpen] = useState(false);
  const [collectionsExpanded, setCollectionsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MegaMenuCategory | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Transparent mode for homepage hero overlay
  const isHomepage = location.pathname === '/';
  const isTransparent = isHomepage && !scrolled;

  // Vyhľadávanie — filtruje produkty podľa názvu, popisu a farby
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return SHOP_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      (p.color && p.color.toLowerCase().includes(query)) ||
      (p.finish && p.finish.toLowerCase().includes(query))
    ).slice(0, 6); // Max 6 výsledkov
  }, [searchQuery]);

  const handleSearchSelect = useCallback((product: ShopProduct) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(`/produkt/${product.id}`);
  }, [navigate]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSearchSelect(searchResults[0]);
    } else if (searchQuery.trim()) {
      // Prejdi na katalóg s vyhľadávaním
      setSearchOpen(false);
      navigate(`/vsetky-produkty`);
    }
  }, [searchResults, searchQuery, handleSearchSelect, navigate]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOffCanvasOpen(false);
    setCollectionsExpanded(false);
    setActiveCategory(null);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  return (
    <>
    <header className={cn(
      "fixed left-0 right-0 z-50 transition-all duration-500",
      SHOW_ANNOUNCEMENT_BAR ? "top-[36px]" : "top-0",
      scrolled && "shadow-md"
    )}>
      
      {/* ==================== TOP BAR (ZARA STYLE) ==================== */}
      <div className={cn(
        "transition-all duration-500",
        isTransparent 
          ? "bg-transparent border-b border-white/10" 
          : "bg-white border-b border-gray-100"
      )}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            
            {/* Left: Back to www link */}
            <div className="flex items-center min-w-[100px] lg:min-w-[180px]">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "lg:hidden p-2 -ml-2 transition-colors",
                  isTransparent ? "text-white hover:text-white/70" : "text-black hover:text-gray-600"
                )}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Back to main website - Desktop */}
              <a
                href="/"
                className={cn(
                  "group hidden lg:flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase hover:font-semibold transition-all duration-500",
                  isTransparent ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-brand-gold"
                )}
              >
                <Diamond 
                  size={14} 
                  strokeWidth={1.5} 
                  className={cn(
                    "transition-all duration-500 ease-out group-hover:rotate-[360deg]",
                    isTransparent ? "group-hover:fill-white" : "group-hover:fill-brand-gold"
                  )}
                />
                <span>O značke</span>
              </a>
            </div>

            {/* Center: Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <img
                src="/images/logo.png"
                alt="OROSTONE"
                className={cn(
                  "h-6 lg:h-10 object-contain transition-all duration-500",
                  isTransparent && "brightness-0 invert"
                )}
              />
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 min-w-[100px] lg:min-w-[180px] justify-end">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={cn(
                  "p-2 transition-all duration-200 hover:[&_svg]:stroke-[2]",
                  searchOpen 
                    ? "text-brand-gold" 
                    : isTransparent 
                      ? "text-white/80 hover:text-white" 
                      : "text-gray-600 hover:text-brand-gold"
                )}
                aria-label="Hľadať"
              >
                <Search size={20} strokeWidth={1.5} className="transition-all duration-200" />
              </button>

              {/* User Account */}
              <Link
                to={isAuthenticated ? "/ucet" : "/login"}
                className={cn(
                  "hidden lg:flex p-2 transition-all duration-200 hover:[&_svg]:stroke-[2]",
                  isTransparent ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-brand-gold"
                )}
                aria-label={isAuthenticated ? "Môj účet" : "Prihlásiť sa"}
              >
                <User size={20} strokeWidth={1.5} className="transition-all duration-200" />
              </Link>

              {/* Wishlist */}
              <button
                className={cn(
                  "hidden lg:block p-2 transition-all duration-200 hover:[&_svg]:stroke-[2]",
                  isTransparent ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-brand-gold"
                )}
                aria-label="Obľúbené"
              >
                <Heart size={20} strokeWidth={1.5} className="transition-all duration-200" />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className={cn(
                  "relative p-2 transition-all duration-200 hover:[&_svg]:stroke-[2]",
                  isTransparent ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-brand-gold"
                )}
                aria-label="Košík"
              >
                <ShoppingBag size={20} strokeWidth={1.5} className="transition-all duration-200" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-gold text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Cart count text - Desktop */}
              <span className={cn(
                "hidden xl:block text-[11px] tracking-[0.1em] uppercase ml-1",
                isTransparent ? "text-white/60" : "text-gray-600"
              )}>
                ({itemCount})
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar (Expandable) with Results */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-100 overflow-hidden"
            >
              <div className="container mx-auto px-4 lg:px-8 py-4">
                <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
                  <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Hľadať produkty..."
                    autoFocus
                    className="w-full pl-7 pr-10 py-3 text-lg bg-transparent border-b-2 border-black text-black placeholder:text-gray-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-black"
                  >
                    <X size={20} />
                  </button>
                </form>

                {/* Search Results Dropdown */}
                {searchQuery.length >= 2 && (
                  <div className="max-w-xl mx-auto mt-2">
                    {searchResults.length > 0 ? (
                      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleSearchSelect(product)}
                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-brand-dark truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {product.dimensions} · {product.thickness}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-brand-dark flex-shrink-0">
                              €{product.pricePerM2}/m²
                            </span>
                          </button>
                        ))}
                        <Link
                          to="/vsetky-produkty"
                          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                          className="block px-4 py-3 text-center text-xs tracking-wider uppercase text-brand-gold font-semibold hover:bg-gray-50 border-t border-gray-100"
                        >
                          Zobraziť všetky produkty
                        </Link>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-4 py-6 text-center">
                        <p className="text-sm text-gray-500">
                          Žiadne výsledky pre „{searchQuery}"
                        </p>
                        <Link
                          to="/vsetky-produkty"
                          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                          className="inline-block mt-2 text-xs tracking-wider uppercase text-brand-gold font-semibold hover:underline"
                        >
                          Prehliadnuť celý katalóg
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==================== NAVIGATION BAR (ZARA STYLE) ==================== */}
      <nav 
        className={cn(
          "hidden lg:block border-b relative transition-all duration-500",
          isTransparent 
            ? "bg-transparent border-white/10" 
            : "bg-white border-gray-100"
        )}
        onMouseLeave={() => setActiveCategory(null)}
      >
        <div className="container mx-auto px-8 relative">
          {/* Menu Button - positioned left, aligned under "O značke" */}
          <button
            onClick={() => setOffCanvasOpen(true)}
            className={cn(
              "absolute left-8 top-1/2 -translate-y-1/2 text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-200",
              isTransparent ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-brand-gold"
            )}
          >
            Menu
          </button>

          <ul className="flex items-center justify-center">
            {MEGA_MENU_CATEGORIES.map((category) => (
              <li
                key={category.id}
                onMouseEnter={() => setActiveCategory(category)}
                className="relative"
              >
                <NavLink
                  to={`/kategoria/${category.slug}`}
                  className={({ isActive }) => cn(
                    "flex items-center gap-1.5 px-6 py-4 text-[11px] font-normal tracking-[0.2em] uppercase transition-all duration-200",
                    isTransparent
                      ? (isActive || activeCategory?.id === category.id) ? "text-white" : "text-white/60 hover:text-white"
                      : isActive ? "text-black" : "text-gray-600 hover:text-black",
                    !isTransparent && activeCategory?.id === category.id && "text-black"
                  )}
                >
                  {category.name}
                  <ChevronDown 
                    size={12} 
                    strokeWidth={1.5}
                    className={cn(
                      "transition-transform duration-200",
                      activeCategory?.id === category.id && "rotate-180"
                    )}
                  />
                </NavLink>
              </li>
            ))}

          </ul>
        </div>

        {/* Active category underline */}
        {activeCategory && (
          <motion.div
            layoutId="nav-underline"
            className={cn("absolute bottom-0 left-0 right-0 h-0.5", isTransparent ? "bg-white" : "bg-black")}
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}

        {/* Mega Menu - rendered at nav level for proper positioning */}
        <AnimatePresence>
          {activeCategory && (
            <EshopMegaMenu
              category={activeCategory}
              isOpen={true}
              onClose={() => setActiveCategory(null)}
            />
          )}
        </AnimatePresence>
      </nav>

      {/* ==================== MOBILE MENU (ZARA STYLE) ==================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-[320px] bg-white z-50 lg:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <img src="/images/logo.png" alt="OROSTONE" className="h-6" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-black"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* Back to main website - Mobile */}
              <a
                href="/"
                className="flex items-center gap-2 px-6 py-4 text-[11px] tracking-[0.15em] uppercase text-gray-500 hover:text-black border-b border-gray-100"
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
                O značke
              </a>

              {/* Categories */}
              <div className="py-4">
                {/* All Products - First Item */}
                <Link
                  to="/vsetky-produkty"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-6 py-4 text-[13px] tracking-[0.1em] uppercase text-brand-gold font-medium hover:bg-gray-50 transition-colors"
                >
                  Všetky produkty
                  <ChevronDown size={16} strokeWidth={1.5} className="-rotate-90" />
                </Link>

                <div className="h-px bg-gray-100 my-2" />

                {MEGA_MENU_CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    to={`/kategoria/${category.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-6 py-4 text-[13px] tracking-[0.1em] uppercase text-black hover:bg-gray-50 transition-colors"
                  >
                    {category.name}
                    <ChevronDown size={16} strokeWidth={1.5} className="-rotate-90" />
                  </Link>
                ))}

                <div className="h-px bg-gray-100 my-2" />

                <Link
                  to="/novinky"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-6 py-4 text-[13px] tracking-[0.1em] uppercase text-black hover:bg-gray-50"
                >
                  Novinky
                </Link>
                <Link
                  to="/vypredaj"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-6 py-4 text-[13px] tracking-[0.1em] uppercase text-black hover:bg-gray-50"
                >
                  Výpredaj
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-6 py-4 text-[13px] tracking-[0.1em] uppercase text-black hover:bg-gray-50"
                >
                  Blog
                </Link>
              </div>

              {/* Account Section */}
              <div className="border-t border-gray-100 py-4">
                <h3 className="px-6 py-2 text-[10px] tracking-[0.2em] uppercase text-gray-400">
                  Účet
                </h3>
                <Link
                  to={isAuthenticated ? "/ucet" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 text-[13px] tracking-[0.1em] uppercase text-black hover:bg-gray-50"
                >
                  <User size={18} strokeWidth={1.5} />
                  {isAuthenticated ? 'Môj účet' : 'Prihlásiť sa'}
                </Link>
                <Link
                  to="/objednavky"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 text-[13px] tracking-[0.1em] uppercase text-black hover:bg-gray-50"
                >
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  Moje objednávky
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 text-[13px] tracking-[0.1em] uppercase text-black hover:bg-gray-50 w-full"
                >
                  <Heart size={18} strokeWidth={1.5} />
                  Obľúbené
                </button>
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 px-6 py-6 border-t border-gray-100 bg-white">
                <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 text-center">
                  OROSTONE E-SHOP
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>

      {/* ==================== OFF-CANVAS MENU (DESKTOP) ==================== */}
      <AnimatePresence>
        {offCanvasOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[200]"
              onClick={() => {
                setOffCanvasOpen(false);
                setCollectionsExpanded(false);
              }}
            />

            {/* Off-Canvas Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-[380px] bg-white z-[210] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                <img src="/images/logo.png" alt="OROSTONE" className="h-7" />
                <button
                  onClick={() => {
                    setOffCanvasOpen(false);
                    setCollectionsExpanded(false);
                  }}
                  className="p-2 text-black hover:text-gray-600 transition-colors"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              {/* Back to main website */}
              <a
                href="/"
                className="flex items-center gap-2 px-8 py-5 text-[11px] tracking-[0.15em] uppercase text-gray-500 hover:text-black border-b border-gray-100 transition-colors"
              >
                <Diamond size={14} strokeWidth={1.5} />
                O značke
              </a>

              {/* Menu Content */}
              <div className="py-6">
                {/* KOLEKCIE - Expandable Section */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => setCollectionsExpanded(!collectionsExpanded)}
                    className="w-full flex items-center justify-between px-8 py-5 text-[14px] tracking-[0.15em] uppercase font-bold text-black hover:bg-gray-50 transition-colors"
                  >
                    Kategórie
                    <ChevronDown 
                      size={18} 
                      strokeWidth={1.5}
                      className={cn(
                        "transition-transform duration-300",
                        collectionsExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Expanded Categories */}
                  <AnimatePresence>
                    {collectionsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-gray-50"
                      >
                        {/* Všetky produkty - First Item */}
                        <Link
                          to="/vsetky-produkty"
                          onClick={() => {
                            setOffCanvasOpen(false);
                            setCollectionsExpanded(false);
                          }}
                          className="flex items-center justify-between px-8 py-4 text-[13px] tracking-[0.08em] uppercase font-normal text-brand-gold hover:bg-gray-100 transition-colors"
                        >
                          Všetky produkty
                          <ChevronDown size={14} strokeWidth={1.5} className="-rotate-90" />
                        </Link>

                        {/* Category Items */}
                        {MEGA_MENU_CATEGORIES.map((category) => (
                          <Link
                            key={category.id}
                            to={`/kategoria/${category.slug}`}
                            onClick={() => {
                              setOffCanvasOpen(false);
                              setCollectionsExpanded(false);
                            }}
                            className="flex items-center justify-between px-8 py-4 text-[13px] tracking-[0.08em] uppercase font-normal text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
                          >
                            {category.name}
                            <ChevronDown size={14} strokeWidth={1.5} className="-rotate-90" />
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Other Menu Items */}
                <Link
                  to="/novinky"
                  onClick={() => setOffCanvasOpen(false)}
                  className="flex items-center px-8 py-5 text-[14px] tracking-[0.15em] uppercase font-bold text-black hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  Novinky
                </Link>
                <Link
                  to="/vypredaj"
                  onClick={() => setOffCanvasOpen(false)}
                  className="flex items-center px-8 py-5 text-[14px] tracking-[0.15em] uppercase font-bold text-black hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  Výpredaj
                </Link>
                <Link
                  to="/blog"
                  onClick={() => setOffCanvasOpen(false)}
                  className="flex items-center px-8 py-5 text-[14px] tracking-[0.15em] uppercase font-bold text-black hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  Blog
                </Link>
              </div>

              {/* Account Section */}
              <div className="border-t border-gray-100 py-6 mt-4">
                <h3 className="px-8 py-2 text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">
                  Účet
                </h3>
                <Link
                  to={isAuthenticated ? "/ucet" : "/login"}
                  onClick={() => setOffCanvasOpen(false)}
                  className="flex items-center gap-3 px-8 py-4 text-[13px] tracking-[0.1em] uppercase font-normal text-black hover:bg-gray-50 transition-colors"
                >
                  <User size={18} strokeWidth={1.5} />
                  {isAuthenticated ? 'Môj účet' : 'Prihlásiť sa'}
                </Link>
                <Link
                  to="/objednavky"
                  onClick={() => setOffCanvasOpen(false)}
                  className="flex items-center gap-3 px-8 py-4 text-[13px] tracking-[0.1em] uppercase font-normal text-black hover:bg-gray-50 transition-colors"
                >
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  Moje objednávky
                </Link>
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 px-8 py-6 border-t border-gray-100 bg-white">
                <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 text-center">
                  OROSTONE E-SHOP
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
