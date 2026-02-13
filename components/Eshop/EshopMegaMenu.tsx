import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// ===========================================
// TYPES
// ===========================================

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
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    subcategories: [
      { id: 'all-sintered', name: 'Všetky dekory', slug: 'sintered-stone' },
      { id: 'white-light', name: 'Biele & Svetlé', slug: 'sintered-stone/biele' },
      { id: 'dark-metallic', name: 'Tmavé & Metalické', slug: 'sintered-stone/tmave' },
      { id: 'travertines', name: 'Travertíny', slug: 'sintered-stone/travertiny' },
      { id: 'gold-accent', name: 'So zlatým akcentom', slug: 'sintered-stone/zlate' },
    ],
    featuredProducts: [
      {
        id: 'polaris-statuario',
        name: 'Polaris (Statuario)',
        slug: 'polaris-statuario',
        image: 'https://picsum.photos/seed/polaris1/800/1000',
        price: 320,
        badge: 'Bestseller',
      },
      {
        id: 'givenchy-gold',
        name: 'Givenchy Gold',
        slug: 'givenchy-gold',
        image: 'https://picsum.photos/seed/givenchy1/800/1000',
        price: 380,
        badge: 'Premium',
      },
    ],
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
// ZARA-STYLE MEGA MENU COMPONENT
// ===========================================

export const EshopMegaMenu: React.FC<EshopMegaMenuProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="absolute left-0 right-0 top-full bg-white shadow-2xl z-50 border-t border-gray-100"
    >
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-12 gap-0 min-h-[400px]">
          
          {/* ==================== LEFT: Subcategories ==================== */}
          <div className="col-span-3 py-10 pr-8 border-r border-gray-100">
            <h3 className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-6">
              {category.name}
            </h3>
            <ul className="space-y-1">
              {category.subcategories.map((sub) => (
                <li key={sub.id}>
                  <Link
                    to={`/kategoria/${sub.slug}`}
                    onClick={onClose}
                    className="block py-2.5 text-[13px] tracking-[0.05em] text-gray-700 hover:text-black transition-colors"
                  >
                    {sub.name}
                  </Link>
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

          {/* ==================== CENTER: Featured Products ==================== */}
          <div className="col-span-5 py-10 px-8">
            {category.featuredProducts.length > 0 ? (
              <>
                <h3 className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-6">
                  Odporúčané
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {category.featuredProducts.slice(0, 2).map((product) => (
                    <Link
                      key={product.id}
                      to={`/produkt/${product.slug}`}
                      onClick={onClose}
                      className="group"
                    >
                      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.badge && (
                          <span className={`absolute top-3 left-3 px-2 py-1 text-[9px] tracking-wider uppercase ${
                            product.badge === 'Zľava' 
                              ? 'bg-black text-white' 
                              : product.badge === 'Bestseller'
                              ? 'bg-white text-black'
                              : 'bg-white text-black'
                          }`}>
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-[12px] tracking-[0.05em] text-black mb-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-black">
                          {product.price} €/m²
                        </span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-gray-400 line-through">
                            {product.originalPrice} €
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[12px] tracking-[0.05em] text-gray-500 mb-4">
                    Produkty budú čoskoro dostupné
                  </p>
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-black hover:text-gray-600"
                  >
                    Prezrieť všetky produkty
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ==================== RIGHT: Hero Image ==================== */}
          <div className="col-span-4 relative">
            {category.heroImage ? (
              <Link 
                to={`/kategoria/${category.slug}`}
                onClick={onClose}
                className="block h-full group"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={category.heroImage}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-white/70 mb-2">
                      Kolekcia
                    </p>
                    <h4 className="text-2xl font-light tracking-wide text-white mb-3">
                      {category.name}
                    </h4>
                    {category.description && (
                      <p className="text-[12px] text-white/80 mb-4 max-w-[280px]">
                        {category.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white group-hover:underline underline-offset-4">
                      Objavte viac
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="h-full bg-gray-50 flex items-center justify-center">
                <p className="text-[11px] tracking-[0.1em] text-gray-400">
                  {category.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
