import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { VISIBLE_CATEGORIES } from '../../config/features';
import { useShopifyProducts } from '../../hooks/useShopifyProducts';
import type { ShopProduct } from '../../constants';

// ===========================================
// TYPES
// ===========================================

export type ColorCategory = 'biele' | 'sede' | 'bezove' | 'cierne';

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  badge?: string;
}

export interface MegaMenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories: SubCategory[];
  featuredProducts: FeaturedProduct[];
  heroImage?: string;
}

interface EshopMegaMenuProps {
  category: MegaMenuCategory;
  isOpen: boolean;
  onClose: () => void;
}

// ===========================================
// MEGA MENU DATA
// ===========================================

export const MEGA_MENU_CATEGORIES: MegaMenuCategory[] = [
  {
    id: 'sintered-stone',
    name: 'Sinterovaný kameň',
    slug: 'sintered-stone',
    description: 'Prémiové sinterované platne 3200×1600 mm — 12 exkluzívnych dekorov',
    heroImage: '/images/app-kitchen.png',
    subcategories: [
      { id: 'all-sintered', name: 'Všetky dekory', slug: 'sintered-stone' },
      { id: 'white', name: 'Biele', slug: 'sintered-stone/biele' },
      { id: 'gray', name: 'Šedé', slug: 'sintered-stone/sede' },
      { id: 'beige', name: 'Béžové', slug: 'sintered-stone/bezove' },
      { id: 'black', name: 'Čierne', slug: 'sintered-stone/cierne' },
    ],
    featuredProducts: [], // Naplní sa dynamicky v komponente
  },
  {
    id: 'tables',
    name: 'Stoly',
    slug: 'tables',
    description: 'Jedálenské a konferenčné stoly zo sinterovaného kameňa',
    heroImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    subcategories: [
      { id: 'all-tables', name: 'Všetky stoly', slug: 'tables' },
    ],
    featuredProducts: [],
  },
  {
    id: 'invisible-cooktop',
    name: 'Invisible Cooktop',
    slug: 'invisible-cooktop',
    description: 'Neviditeľné indukčné varné dosky integrované priamo do kameňa',
    heroImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    subcategories: [
      { id: 'all-cooktop', name: 'Invisible Cooktop', slug: 'invisible-cooktop' },
    ],
    featuredProducts: [],
  },
  {
    id: 'accessories',
    name: 'Doplnky',
    slug: 'accessories',
    description: 'Čistiace prostriedky a produkty na údržbu sinterovaného kameňa',
    heroImage: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80',
    subcategories: [
      { id: 'all-accessories', name: 'Všetky doplnky', slug: 'accessories' },
      { id: 'cleaning', name: 'Čistiace prostriedky', slug: 'accessories/cistenie' },
      { id: 'maintenance', name: 'Údržba povrchov', slug: 'accessories/udrzba' },
    ],
    featuredProducts: [],
  },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Vráti len viditeľné kategórie podľa konfigurácie v config/features.ts
 */
export const getVisibleCategories = (): MegaMenuCategory[] => {
  return MEGA_MENU_CATEGORIES.filter(
    category => VISIBLE_CATEGORIES[category.id as keyof typeof VISIBLE_CATEGORIES] !== false
  );
};

/**
 * Handle-based mapovanie produktov na farebné kategórie.
 * Zdroj: Shopify produkty (10 produktov).
 */
const HANDLE_COLOR_MAP: Record<string, ColorCategory> = {
  // BIELE (5)
  'glacier': 'biele',
  'venus-white-calacatta': 'biele',
  'bianco-statuario': 'biele',
  'calacatta-polido': 'biele',
  'givenchy-gold': 'biele',
  // BÉŽOVÉ (3)
  'yabo-white': 'bezove',
  'roman-travertine': 'bezove',
  'taj-mahal': 'bezove',
  // ŠEDÉ (2)
  'iron-copper': 'sede',
  'gothic-gold': 'sede',
};

/**
 * Fallback mapovanie color stringov (pre statické dáta z constants.ts)
 */
const COLOR_CATEGORY_MAP: Record<string, ColorCategory> = {
  'Ľadovo biela': 'biele',
  'Teplá biela s béžovými podtónmi': 'bezove',
  'Krémovo biela so šedými žilkami': 'biele',
  'Biela s výrazným sivým žilovaním': 'biele',
  'Biela so zlatistým žilovaním': 'biele',
  'Biela s oblačným sivým vzorom': 'biele',
  'Biela s klasickými sivými žilkami': 'biele',
  'Čistá biela s výraznými sivými žilkami': 'biele',
  'Béžová travertínová': 'bezove',
  'Zlatisto-béžová s jemnými žilkami': 'bezove',
  'Tmavá s medenými odleskami': 'sede',
  'Čierna so zlatými žilkami': 'sede',
};

/**
 * Vráti farebnú kategóriu pre produkt — primárne podľa handle/id,
 * sekundárne podľa color stringu (fallback pre statické dáta).
 */
export function getProductColorCategory(product: { id: string; color?: string }): ColorCategory | null {
  if (HANDLE_COLOR_MAP[product.id]) return HANDLE_COLOR_MAP[product.id];
  if (product.color && COLOR_CATEGORY_MAP[product.color]) return COLOR_CATEGORY_MAP[product.color];
  return null;
}

/**
 * Spätne kompatibilná verzia — vráti farebnú kategóriu podľa color stringu
 */
export function getColorCategory(color: string | undefined): ColorCategory | null {
  if (!color) return null;
  return COLOR_CATEGORY_MAP[color] || null;
}

/**
 * Získa produkty pre danú farebnú kategóriu
 */
export function getProductsByColorCategory(
  products: ShopProduct[], 
  colorCategory: ColorCategory
): ShopProduct[] {
  return products.filter(
    p => p.category === 'sintered-stone' && getProductColorCategory(p) === colorCategory
  );
}

// ===========================================
// FILTER DEFINITIONS
// ===========================================

interface ColorFilter {
  id: ColorCategory;
  name: string;
}

const COLOR_FILTERS: ColorFilter[] = [
  { id: 'biele', name: 'Biele' },
  { id: 'sede', name: 'Šedé' },
  { id: 'bezove', name: 'Béžové' },
  { id: 'cierne', name: 'Čierne' },
];

// ===========================================
// MEGA MENU COMPONENT
// ===========================================

export const EshopMegaMenu: React.FC<EshopMegaMenuProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  const { products, isLoading } = useShopifyProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<ColorCategory | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Filter products for sintered-stone category
  const displayProducts = useMemo(() => {
    if (category.id !== 'sintered-stone') return [];
    const sintered = products.filter(p => p.category === 'sintered-stone');
    if (!activeFilter) return sintered;
    return sintered.filter(p => getProductColorCategory(p) === activeFilter);
  }, [products, activeFilter, category.id]);

  // Active filter label and count
  const filterLabel = useMemo(() => {
    if (!activeFilter) return 'Všetky dekory';
    return COLOR_FILTERS.find(f => f.id === activeFilter)?.name || '';
  }, [activeFilter]);

  // Check scroll state
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, displayProducts]);

  // Reset scroll when filter changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0 });
  }, [activeFilter]);

  const scrollLeftBy = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -260, behavior: 'smooth' });
  }, []);

  const scrollRightBy = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 260, behavior: 'smooth' });
  }, []);

  if (!isOpen) return null;

  // For non-sintered-stone categories, use a simple fallback layout
  if (category.id !== 'sintered-stone') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="absolute left-0 right-0 top-full bg-white shadow-2xl z-50 border-t border-gray-100"
      >
        <div className="container mx-auto px-8 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-3">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-[13px] text-gray-600 max-w-md">{category.description}</p>
              )}
            </div>
            <Link
              to={`/kategoria/${category.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-black hover:text-gray-600 transition-colors group"
            >
              Zobraziť všetky
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="absolute left-0 right-0 top-full bg-white shadow-2xl z-50 border-t border-gray-100"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex min-h-[340px]">

          {/* ==================== LEFT: Filters Sidebar ==================== */}
          <div className="w-[200px] flex-shrink-0 py-8 pr-8 border-r border-gray-100">
            <h3 className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-5">
              {category.name}
            </h3>

            <ul className="space-y-0.5">
              {/* "Všetky dekory" — navigačný link */}
              <li>
                <Link
                  to={`/kategoria/${category.slug}`}
                  onClick={onClose}
                  className="block py-2 text-[13px] tracking-[0.03em] text-gray-600 hover:text-black transition-colors"
                >
                  Všetky dekory
                </Link>
              </li>

              {/* Farebné filtre — button elementy */}
              {COLOR_FILTERS.map((filter) => (
                <li key={filter.id}>
                  <button
                    onClick={() => setActiveFilter(prev => prev === filter.id ? null : filter.id)}
                    className={`block w-full text-left py-2 text-[13px] tracking-[0.03em] transition-all duration-200 ${
                      activeFilter === filter.id
                        ? 'text-black font-semibold'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {filter.name}
                    {activeFilter === filter.id && (
                      <span className="inline-block w-1 h-1 rounded-full bg-brand-gold ml-2 -translate-y-0.5" />
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* View All Link */}
            <Link
              to={`/kategoria/${category.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-2 mt-8 text-[11px] tracking-[0.15em] uppercase text-black hover:text-gray-600 transition-colors group"
            >
              Zobraziť všetky
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* ==================== RIGHT: Product Carousel ==================== */}
          <div className="flex-1 py-8 pl-8 min-w-0">
            {/* Header with filter label + arrows */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] tracking-[0.25em] uppercase text-gray-400">
                {filterLabel}
                <span className="ml-2 text-gray-300">({displayProducts.length})</span>
              </h3>

              {/* Desktop navigation arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={scrollLeftBy}
                  disabled={!canScrollLeft}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    canScrollLeft
                      ? 'border-gray-300 text-gray-600 hover:border-black hover:text-black'
                      : 'border-gray-100 text-gray-200 cursor-default'
                  }`}
                  aria-label="Predchádzajúce"
                >
                  <ChevronLeft size={16} strokeWidth={1.5} />
                </button>
                <button
                  onClick={scrollRightBy}
                  disabled={!canScrollRight}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    canScrollRight
                      ? 'border-gray-300 text-gray-600 hover:border-black hover:text-black'
                      : 'border-gray-100 text-gray-200 cursor-default'
                  }`}
                  aria-label="Nasledujúce"
                >
                  <ChevronRight size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Scrollable product carousel */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {isLoading ? (
                /* Skeleton loading cards */
                <>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={`skeleton-${i}`} className="flex-shrink-0 w-[180px] lg:w-[200px] snap-start animate-pulse">
                      <div className="aspect-[4/5] bg-gray-100 rounded-lg mb-3" />
                      <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))}
                </>
              ) : (
              <AnimatePresence mode="popLayout">
                {displayProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 w-[180px] lg:w-[200px] snap-start"
                  >
                    <Link
                      to={`/produkt/${product.id}`}
                      onClick={onClose}
                      className="group block"
                    >
                      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden rounded-lg mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="text-[12px] tracking-[0.03em] text-black font-medium truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {product.pricePerM2} €/m²
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
              )}

              {!isLoading && displayProducts.length === 0 && (
                <div className="flex items-center justify-center w-full py-12">
                  <p className="text-[12px] text-gray-400">Žiadne produkty v tejto kategórii</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
