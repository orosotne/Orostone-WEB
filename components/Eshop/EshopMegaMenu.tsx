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
    id: 'mramor',
    name: 'Mramor',
    slug: 'mramor',
    description: 'Elegantné mramorové vzory s prepracovaným žilovaním',
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    subcategories: [
      { id: 'all-mramor', name: 'Všetky mramory', slug: 'mramor' },
      { id: 'carrara', name: 'Carrara', slug: 'mramor/carrara' },
      { id: 'calacatta', name: 'Calacatta', slug: 'mramor/calacatta' },
      { id: 'statuario', name: 'Statuario', slug: 'mramor/statuario' },
      { id: 'nero-marquina', name: 'Nero Marquina', slug: 'mramor/nero-marquina' },
      { id: 'emperador', name: 'Emperador', slug: 'mramor/emperador' },
    ],
    featuredProducts: [
      {
        id: 'carrara-ultra',
        name: 'Carrara Statuario Ultra',
        slug: 'carrara-statuario-ultra',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400',
        price: 189,
        badge: 'Bestseller',
      },
      {
        id: 'calacatta-gold',
        name: 'Calacatta Gold',
        slug: 'calacatta-gold',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
        price: 245,
        originalPrice: 289,
        badge: 'Zľava',
      },
    ],
  },
  {
    id: 'granit',
    name: 'Granit',
    slug: 'granit',
    description: 'Odolné granitové povrchy pre náročné prostredia',
    heroImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    subcategories: [
      { id: 'all-granit', name: 'Všetky granity', slug: 'granit' },
      { id: 'cierne', name: 'Čierne', slug: 'granit/cierne' },
      { id: 'sede', name: 'Sivé', slug: 'granit/sede' },
      { id: 'hnede', name: 'Hnedé', slug: 'granit/hnede' },
    ],
    featuredProducts: [
      {
        id: 'nero-absolute',
        name: 'Nero Absolute',
        slug: 'nero-absolute',
        image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
        price: 175,
      },
    ],
  },
  {
    id: 'beton',
    name: 'Betón',
    slug: 'beton',
    description: 'Industriálny vzhľad s výhodami keramiky',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    subcategories: [
      { id: 'all-beton', name: 'Všetky betóny', slug: 'beton' },
      { id: 'industrial', name: 'Industrial', slug: 'beton/industrial' },
      { id: 'smooth', name: 'Smooth', slug: 'beton/smooth' },
      { id: 'textured', name: 'Textured', slug: 'beton/textured' },
    ],
    featuredProducts: [
      {
        id: 'industrial-concrete',
        name: 'Industrial Concrete',
        slug: 'industrial-concrete',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
        price: 165,
        badge: 'Novinka',
      },
    ],
  },
  {
    id: 'drevo',
    name: 'Drevo',
    slug: 'drevo',
    description: 'Prirodzený vzhľad dreva bez údržby',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    subcategories: [
      { id: 'all-drevo', name: 'Všetky drevá', slug: 'drevo' },
      { id: 'dub', name: 'Dub', slug: 'drevo/dub' },
      { id: 'orech', name: 'Orech', slug: 'drevo/orech' },
      { id: 'vintage', name: 'Vintage', slug: 'drevo/vintage' },
    ],
    featuredProducts: [],
  },
  {
    id: 'kov',
    name: 'Kov',
    slug: 'kov',
    description: 'Metalické povrchy pre moderný dizajn',
    heroImage: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80',
    subcategories: [
      { id: 'all-kov', name: 'Všetky kovy', slug: 'kov' },
      { id: 'rust', name: 'Rust', slug: 'kov/rust' },
      { id: 'copper', name: 'Copper', slug: 'kov/copper' },
      { id: 'bronze', name: 'Bronze', slug: 'kov/bronze' },
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
