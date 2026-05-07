import React, { useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { ShopProduct } from '../constants';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { sortShopCatalogProducts } from '../components/Eshop/EshopMegaMenu';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { m } from 'framer-motion';
import { SEOHead, createBreadcrumbLD } from '../components/UI/SEOHead';

gsap.registerPlugin(ScrollTrigger);

// ===========================================
// PRODUCT CARD COMPONENT
// ===========================================
export interface ProductCardProps {
  product: ShopProduct;
  compact?: boolean;
  onAddToCart: () => void;
  inCart: boolean;
  quantity: number;
}

const prefetchProductDetail = () => { import('./ShopProductDetail'); };

const ProductCardImpl: React.FC<ProductCardProps> = ({
  product,
  compact = false,
  onAddToCart,
  inCart,
  quantity
}) => {
  return (
    <div
      className="shop-product-card group bg-[#F9F9F7] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
      onMouseEnter={prefetchProductDetail}
      onFocus={prefetchProductDetail}
    >
      <Link to={`/produkt/${product.id}`} className="flex flex-col flex-1">
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden",
          compact ? "aspect-square" : "aspect-[4/5]"
        )}>
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={compact ? 800 : 1000}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Stock Badge */}
          {product.inStock && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3">
              <span className="inline-flex items-center gap-1 md:gap-1.5 bg-green-500 text-white text-[8px] md:text-[10px] tracking-wider uppercase px-1.5 md:px-2.5 py-0.5 md:py-1 font-bold rounded-full shadow-sm">
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full animate-pulse"></span>
                Skladom
              </span>
            </div>
          )}
          
          {/* Thickness Badge */}
          <div className="absolute top-2 right-2 md:top-3 md:right-3">
            <span className="bg-white/95 backdrop-blur-sm text-[8px] md:text-[10px] tracking-wider uppercase px-1.5 md:px-2.5 py-1 md:py-1.5 font-bold text-brand-dark rounded-full shadow-sm border border-black/5">
              {product.thickness}
            </span>
          </div>

          {/* Quick Add */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart();
              }}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg",
                inCart 
                  ? "bg-brand-gold text-brand-dark" 
                  : "bg-white text-brand-dark hover:bg-brand-gold"
              )}
              aria-label={inCart ? "V košíku" : "Pridať do košíka"}
            >
              {inCart ? (
                <span className="text-xs font-bold">{quantity}</span>
              ) : (
                <ShoppingBag size={18} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className={cn("px-3 pt-3 md:px-4 md:pt-4 flex flex-col flex-1", compact ? "pb-2 md:pb-3" : "pb-3 md:pb-5")}>
          <h3 className={cn(
            "font-medium text-brand-dark mb-0.5 md:mb-1 group-hover:text-brand-gold transition-colors min-h-[2.5rem] md:min-h-0 line-clamp-2",
            compact ? "text-xs md:text-sm" : "text-sm md:text-base"
          )}>
            {product.name}
          </h3>
          
          {!compact && (
            <p className="text-xs md:text-sm text-gray-500 mb-1.5 md:mb-2 line-clamp-1">
              {product.description}
            </p>
          )}
          
          <div className="flex items-baseline gap-1.5 md:gap-2">
            <span className="text-[9px] md:text-[11px] tracking-wider uppercase text-gray-400">Cena</span>
            <span className={cn(
              "font-semibold text-brand-dark",
              compact ? "text-xs md:text-sm" : "text-sm md:text-lg"
            )}>
              €{product.pricePerM2}
            </span>
            <span className="text-xs md:text-sm text-gray-400">/m²</span>
          </div>

          <div className="flex-1 min-h-4 md:min-h-0" />

          {/* Add to Cart CTA */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart();
            }}
            className={cn(
              "mt-2 md:mt-3 w-full py-2 md:py-2.5 rounded-lg text-[9px] md:text-[11px] tracking-wider uppercase font-semibold transition-all leading-relaxed md:leading-normal",
              inCart 
                ? "bg-brand-gold text-brand-dark" 
                : "bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark"
            )}
          >
            {inCart ? `V košíku (${quantity})` : (<>Pridať<br className="md:hidden" /> do košíka</>)}
          </button>
        </div>
      </Link>
    </div>
  );
};

// React.memo with custom comparator: skips onAddToCart from comparison.
// Parents pass an inline thunk like `() => addItem(variantId, 1)` which is a fresh
// function reference every render. Because addItem from CartContext is now identity-
// stable (cartRef pattern), every fresh thunk is functionally equivalent — safe to
// reuse the memoized render. Comparing only product/compact/inCart/quantity (all
// stable references or primitives) lets the grid skip re-rendering all cards when
// only an unrelated cart slice (e.g. isLoading) changes.
export const ProductCard = React.memo(ProductCardImpl, (prev, next) =>
  prev.product === next.product &&
  prev.compact === next.compact &&
  prev.inCart === next.inCart &&
  prev.quantity === next.quantity
);

// ===========================================
// MAIN CATALOG COMPONENT
// ===========================================
export const ProductCatalog = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem, isInCart, getItemQuantity } = useCart();
  const { products, isLoading } = useShopifyProducts(50, { shopifyOnly: true });
  const sortedProducts = useMemo(() => sortShopCatalogProducts(products), [products]);

  useEffect(() => {
    if (!isLoading) {
      const id = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(id);
    }
  }, [isLoading]);

  // Single batch reveal for the product grid — avoids N separate ScrollTrigger instances
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = gsap.utils.toArray<HTMLElement>('.shop-product-card');
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 24 });

    ScrollTrigger.batch(cards, {
      start: 'top 92%',
      onEnter: (batch) => {
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out', overwrite: true });
      },
    });
  }, { scope: containerRef, dependencies: [sortedProducts] });

  return (
    <main ref={containerRef} className="bg-white min-h-screen">
      <SEOHead
        title="Všetky produkty | OROSTONE E-Shop"
        description="Kompletná ponuka sinterovaných kameňov. Veľkoformátové dosky 3200x1600mm s dopravou po celom Slovensku."
        canonical="https://orostone.sk/vsetky-produkty"
        structuredData={createBreadcrumbLD([
          { name: 'E-Shop', url: 'https://orostone.sk/' },
          { name: 'Všetky produkty', url: 'https://orostone.sk/vsetky-produkty' },
        ])}
      />

      {/* ==================== HERO ==================== */}
      <section className="relative h-[320px] md:h-[400px] overflow-hidden">
        {/* Background Image */}
        <img
          src="/images/catalog/catalog-hero.webp"
          alt="Všetky produkty"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative h-full container mx-auto px-6 lg:px-8 flex flex-col justify-end pb-10 md:pb-14">
          {/* Breadcrumb */}
          <m.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/60 mb-4"
          >
            <Link to="/" className="hover:text-white transition-colors">
              E-Shop
            </Link>
            <ChevronRight size={12} />
            <span className="text-white">Všetky produkty</span>
          </m.nav>

          {/* Title */}
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3"
          >
            Všetky produkty
          </m.h1>

          {/* Description */}
          <m.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base md:text-lg text-white/80 max-w-xl"
          >
            Kompletná ponuka sinterovaných kameňov a povrchov
          </m.p>

          {/* Product count */}
          {sortedProducts.length > 0 && (
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-3 text-[11px] tracking-[0.15em] uppercase text-white/50"
            >
              {sortedProducts.length}{' '}
              {sortedProducts.length === 1 ? 'produkt' : sortedProducts.length < 5 ? 'produkty' : 'produktov'}
            </m.p>
          )}
        </div>
      </section>

      {/* ==================== PRODUCT GRID ==================== */}
      <section className="container mx-auto px-6 lg:px-8 py-12 md:py-16">
        {isLoading ? (
          /* Loading skeleton */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl animate-pulse">
                <div className="aspect-[4/5]" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {sortedProducts.map((product) => {
              const inCart = isInCart(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => {
                    if (product.shopifyVariantId) {
                      addItem(product.shopifyVariantId, 1);
                    }
                  }}
                  inCart={inCart}
                  quantity={getItemQuantity(product.id)}
                />
              );
            })}
          </m.div>
        )}
      </section>
    </main>
  );
};

export default ProductCatalog;
