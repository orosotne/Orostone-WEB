import React, { useMemo, useState, useRef, useCallback, useEffect, startTransition } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { VISIBLE_CATEGORIES } from '../../config/features';
import { useShopifyProducts } from '../../hooks/useShopifyProducts';
import type { ProductColorTone, ShopProduct } from '../../constants';
import { shopifySized, shopifySrcSet } from '../../lib/shopifyImage';
import { titleCase } from '../../lib/utils';
import { SPRING } from '../../lib/motion';

// ===========================================
// TYPES
// ===========================================

export type ColorCategory = ProductColorTone;

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
    description: 'Sinterované platne 3\u00A0200\u00A0×\u00A01\u00A0600\u00A0mm',
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
 * Kategórie aj konfig sú statické, takže výsledok sa počíta len raz na úrovni modulu.
 * Tým sa predíde opakovanému filter()+alokácii poľa pri každom re-rendri navbaru/footera.
 */
const VISIBLE_CATEGORY_LIST: MegaMenuCategory[] = MEGA_MENU_CATEGORIES.filter(
  category => VISIBLE_CATEGORIES[category.id as keyof typeof VISIBLE_CATEGORIES] !== false
);

export const getVisibleCategories = (): MegaMenuCategory[] => VISIBLE_CATEGORY_LIST;

/**
 * Farebné zatriedenie z `ShopProduct.colorCategory` (po mapovaní v shopify.service):
 * `custom.color_category` (SK alebo EN), `custom.color_for_cursor`, `custom.color_name`, hex, shopify color meta, variant Color/Farba.
 */
export function getProductColorCategory(product: Pick<ShopProduct, 'colorCategory'>): ColorCategory | null {
  return product.colorCategory ?? null;
}

const COLOR_TONE_SORT_ORDER: Record<ProductColorTone, number> = {
  biele: 0,
  sede: 1,
  bezove: 2,
  cierne: 3,
};

const CATALOG_CATEGORY_ORDER: Record<ShopProduct['category'], number> = {
  'sintered-stone': 0,
  tables: 1,
  'invisible-cooktop': 2,
  accessories: 3,
};

/** Zoradenie podľa Shopify `colorCategory` (metafield), potom názvu. Bez farby na konci skupiny. */
export function sortSinteredByColorThenName(products: ShopProduct[]): ShopProduct[] {
  return [...products].sort((a, b) => {
    const oa = a.colorCategory !== undefined ? COLOR_TONE_SORT_ORDER[a.colorCategory] : 100;
    const ob = b.colorCategory !== undefined ? COLOR_TONE_SORT_ORDER[b.colorCategory] : 100;
    if (oa !== ob) return oa - ob;
    return a.name.localeCompare(b.name, 'sk', { sensitivity: 'base' });
  });
}

/** Katalóg: typ produktu, pri sinterovanom kameni farba z metafieldu, potom názov. */
export function sortShopCatalogProducts(products: ShopProduct[]): ShopProduct[] {
  return [...products].sort((a, b) => {
    const catDiff = CATALOG_CATEGORY_ORDER[a.category] - CATALOG_CATEGORY_ORDER[b.category];
    if (catDiff !== 0) return catDiff;
    if (a.category === 'sintered-stone') {
      const oa = a.colorCategory !== undefined ? COLOR_TONE_SORT_ORDER[a.colorCategory] : 100;
      const ob = b.colorCategory !== undefined ? COLOR_TONE_SORT_ORDER[b.colorCategory] : 100;
      if (oa !== ob) return oa - ob;
    }
    return a.name.localeCompare(b.name, 'sk', { sensitivity: 'base' });
  });
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
  const { products, isLoading } = useShopifyProducts(50);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<ColorCategory | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Filter products for sintered-stone category (zoradené podľa metafield colorCategory)
  const displayProducts = useMemo(() => {
    if (category.id !== 'sintered-stone') return [];
    const sintered = sortSinteredByColorThenName(
      products.filter(p => p.category === 'sintered-stone'),
    );
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
  }, [updateScrollState]);

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
      <m.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={SPRING}
        className="absolute left-0 right-0 top-full z-50 border-t border-brand-line bg-brand-light shadow-[0_24px_40px_-24px_rgba(26,26,26,0.25)]"
      >
        <div className="mx-auto max-w-os px-[var(--os-edge)] py-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-3 text-os-eyebrow uppercase text-brand-muted">
                {category.name}
              </h3>
              {category.description && (
                <p className="max-w-md text-[0.92rem] text-brand-muted">{category.description}</p>
              )}
            </div>
            <Link
              to={`/kategoria/${category.slug}`}
              onClick={onClose}
              className="group inline-flex items-center gap-2 text-[0.95rem] font-medium underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-70"
            >
              Zobraziť všetky
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </m.div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={SPRING}
      className="absolute left-0 right-0 top-full z-50 border-t border-brand-line bg-brand-light shadow-[0_24px_40px_-24px_rgba(26,26,26,0.25)]"
    >
      <div className="mx-auto max-w-os px-[var(--os-edge)]">
        <div className="flex min-h-[340px]">

          {/* ==================== LEFT: Filters Sidebar ==================== */}
          <div className="w-[200px] flex-shrink-0 border-r border-brand-line py-8 pr-8">
            <h3 className="mb-5 text-os-eyebrow uppercase text-brand-muted">
              {category.name}
            </h3>

            <ul className="space-y-0.5">
              {/* "Všetky dekory" — navigačný link */}
              <li>
                <Link
                  to={`/kategoria/${category.slug}`}
                  onClick={onClose}
                  className="block py-2 text-[0.92rem] text-brand-muted transition-colors hover:text-brand-dark"
                >
                  Všetky dekory
                </Link>
              </li>

              {/* Farebné filtre — button elementy */}
              {COLOR_FILTERS.map((filter) => (
                <li key={filter.id}>
                  <button
                    onClick={() => startTransition(() => setActiveFilter(prev => prev === filter.id ? null : filter.id))}
                    className={`block w-full py-2 text-left text-[0.92rem] transition-colors ${
                      activeFilter === filter.id
                        ? 'font-semibold text-brand-dark'
                        : 'text-brand-muted hover:text-brand-dark'
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
              className="group mt-8 inline-flex items-center gap-2 text-[0.95rem] font-medium underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-70"
            >
              Zobraziť všetky
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* ==================== RIGHT: Product Carousel ==================== */}
          <div className="flex-1 py-8 pl-8 min-w-0">
            {/* Header with filter label + arrows */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-os-eyebrow uppercase text-brand-muted">
                {filterLabel}
                <span className="ml-2 tabular-nums text-brand-muted">({displayProducts.length})</span>
              </h3>

              {/* Desktop navigation arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={scrollLeftBy}
                  disabled={!canScrollLeft}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    canScrollLeft
                      ? 'border-brand-line text-brand-dark hover:border-brand-dark'
                      : 'cursor-default border-brand-line/60 text-brand-line'
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
                      ? 'border-brand-line text-brand-dark hover:border-brand-dark'
                      : 'cursor-default border-brand-line/60 text-brand-line'
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
              className="flex [touch-action:pan-x_pan-y] gap-4 overflow-x-auto overscroll-x-contain scrollbar-hide snap-x snap-proximity pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {isLoading ? (
                /* Skeleton loading cards */
                <>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={`skeleton-${i}`} className="flex-shrink-0 w-[180px] lg:w-[200px] snap-start animate-pulse">
                      <div className="mb-3 aspect-[4/5] rounded-[6px] bg-brand-gray" />
                      <div className="mb-2 h-3 w-3/4 rounded bg-brand-gray" />
                      <div className="h-2.5 w-1/2 rounded bg-brand-gray" />
                    </div>
                  ))}
                </>
              ) : (
              <AnimatePresence mode="popLayout">
                {displayProducts.map((product) => (
                  <m.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={SPRING}
                    className="flex-shrink-0 w-[180px] lg:w-[200px] snap-start"
                  >
                    <Link
                      to={`/produkt/${product.id}`}
                      onClick={onClose}
                      className="group block"
                    >
                      <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-[6px] bg-brand-gray">
                        <img
                          src={shopifySized(product.image, 400)}
                          srcSet={shopifySrcSet(product.image)}
                          sizes="200px"
                          alt={product.name}
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="truncate text-[0.88rem] font-medium text-brand-dark">
                        {titleCase(product.name)}
                      </h4>
                      <p className="mt-0.5 text-[0.8rem] font-normal text-brand-muted">
                        {product.pricePerM2} €/m²
                      </p>
                    </Link>
                  </m.div>
                ))}
              </AnimatePresence>
              )}

              {!isLoading && displayProducts.length === 0 && (
                <div className="flex items-center justify-center w-full py-12">
                  <p className="text-[0.88rem] text-brand-muted">Žiadne produkty v tejto kategórii</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
};
