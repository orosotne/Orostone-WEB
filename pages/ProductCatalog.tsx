import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { ShopProduct } from '../constants';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
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

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  compact = false, 
  onAddToCart,
  inCart,
  quantity 
}) => {
  return (
    <div className="shop-product-card group bg-[#F9F9F7] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link to={`/produkt/${product.id}`} className="block">
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden",
          compact ? "aspect-square" : "aspect-[4/5]"
        )}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Stock Badge */}
          {product.inStock && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-[10px] tracking-wider uppercase px-2.5 py-1 font-bold rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                Skladom
              </span>
            </div>
          )}
          
          {/* Thickness Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-white/95 backdrop-blur-sm text-[10px] tracking-wider uppercase px-2.5 py-1.5 font-bold text-brand-dark rounded-full shadow-sm border border-black/5">
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
        <div className={cn("px-4 pt-4", compact ? "pb-3" : "pb-5")}>
          <h3 className={cn(
            "font-medium text-brand-dark mb-1 group-hover:text-brand-gold transition-colors",
            compact ? "text-sm" : "text-base"
          )}>
            {product.name}
          </h3>
          
          {!compact && (
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">
              {product.description}
            </p>
          )}
          
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] tracking-wider uppercase text-gray-400">Cena</span>
            <span className={cn(
              "font-semibold text-brand-dark",
              compact ? "text-sm" : "text-lg"
            )}>
              €{product.pricePerM2}
            </span>
            <span className="text-sm text-gray-400">/m²</span>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart();
            }}
            className={cn(
              "mt-3 w-full py-2.5 rounded-lg text-[11px] tracking-wider uppercase font-semibold transition-all",
              inCart 
                ? "bg-brand-gold text-brand-dark" 
                : "bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark"
            )}
          >
            {inCart ? `V košíku (${quantity})` : "Pridať do košíka"}
          </button>
        </div>
      </Link>
    </div>
  );
};

// ===========================================
// MAIN CATALOG COMPONENT
// ===========================================
export const ProductCatalog = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem, isInCart } = useCart();
  const { products, isLoading } = useShopifyProducts();

  // GSAP scroll animations on product cards
  useGSAP(() => {
    gsap.utils.toArray('.shop-product-card').forEach((card: any) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, { scope: containerRef, dependencies: [products] });

  return (
    <main ref={containerRef} className="bg-white min-h-screen">
      <SEOHead
        title="Všetky produkty | OROSTONE E-Shop"
        description="Kompletná ponuka prémiových sinterovaných kameňov, stolov, indukčných dosiek a doplnkov. Dosky 3200x1600mm s dopravou po celom Slovensku."
        structuredData={createBreadcrumbLD([
          { name: 'E-Shop', url: 'https://eshop.orostone.sk/' },
          { name: 'Všetky produkty', url: 'https://eshop.orostone.sk/#/vsetky-produkty' },
        ])}
      />

      {/* ==================== HERO ==================== */}
      <section className="relative h-[320px] md:h-[400px] overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80"
          alt="Všetky produkty"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative h-full container mx-auto px-6 lg:px-8 flex flex-col justify-end pb-10 md:pb-14">
          {/* Breadcrumb */}
          <motion.nav
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
          </motion.nav>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3"
          >
            Všetky produkty
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base md:text-lg text-white/80 max-w-xl"
          >
            Kompletná ponuka prémiových sinterovaných kameňov a povrchov
          </motion.p>

          {/* Product count */}
          {products.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-3 text-[11px] tracking-[0.15em] uppercase text-white/50"
            >
              {products.length} {products.length === 1 ? 'produkt' : products.length < 5 ? 'produkty' : 'produktov'}
            </motion.p>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {products.map((product) => {
              const cartItem = isInCart(product.shopifyVariantId || product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => addItem(product.shopifyVariantId || product.id, 1)}
                  inCart={!!cartItem}
                  quantity={cartItem ? 1 : 0}
                />
              );
            })}
          </motion.div>
        )}
      </section>
    </main>
  );
};

export default ProductCatalog;
