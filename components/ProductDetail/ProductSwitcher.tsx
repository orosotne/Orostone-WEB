import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ShopProduct } from '../../constants';
import { cn } from '../../lib/utils';
import { shopifyImageUrl, shopifySized } from '../../lib/shopifyImage';

interface ProductSwitcherProps {
  currentProductId: string;
  products: ShopProduct[];
}

export const ProductSwitcher: React.FC<ProductSwitcherProps> = ({ currentProductId, products }) => {
  const navigate = useNavigate();
  const railRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ scrollY: number; railLeft: number } | null>(null);

  const filteredProducts = products.filter((p) => {
    const name = p.name.toLowerCase();
    return !name.includes('example product') && !name.includes('test product');
  });

  const handleProductClick = (productId: string) => {
    navigate(`/produkt/${productId}`);
  };

  // Warm the next product's main photo only when the visitor points at (or focuses) its tile, at the size
  // HeroSection requests. Preloading all originals up front cost ~6 MB per page and used other URLs.
  const warmed = useRef(new Set<string>());
  const warmHeroImage = (p: ShopProduct) => {
    const first = p.gallery && p.gallery.length > 0 ? p.gallery[0] : p.image;
    if (!first || p.id === currentProductId || warmed.current.has(p.id)) return;
    warmed.current.add(p.id);
    const img = new Image();
    img.src = shopifyImageUrl(first, 1200);
  };

  if (filteredProducts.length <= 1) return null;

  return (
    <div className="mb-8">
      <h3 className="flex items-center gap-3.5 text-os-eyebrow uppercase text-brand-dark before:h-px before:w-7 before:bg-current before:opacity-75 before:content-[''] mb-4">
        Ďalšie produkty
      </h3>
      <div
        ref={railRef}
        className="grid grid-rows-2 grid-flow-col gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-px-6 -mx-6 px-6 py-1 scrollbar-hide [touch-action:pan-x_pan-y] lg:grid-rows-none lg:grid-flow-row lg:grid-cols-4 lg:gap-2 lg:overflow-visible lg:m-0 lg:scroll-p-0 lg:p-0 lg:touch-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
        onTouchStart={() => {
          touchStartRef.current = {
            scrollY: window.scrollY,
            railLeft: railRef.current?.scrollLeft ?? 0,
          };
        }}
        onTouchEnd={() => {
          touchStartRef.current = null;
        }}
      >
        {filteredProducts.map((product) => {
          const isActive = product.id === currentProductId;
          return (
            <button
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              onPointerEnter={() => warmHeroImage(product)}
              onFocus={() => warmHeroImage(product)}
              className={cn(
                "group w-[90px] lg:w-auto touch-manipulation flex flex-col items-center p-1.5 lg:p-2 transition-all rounded-[3px]",
                isActive
                  ? "ring-2 ring-brand-dark bg-brand-sand"
                  : "ring-1 ring-brand-line hover:ring-brand-dark/40 bg-white"
              )}
            >
              <div className="aspect-square w-full overflow-hidden bg-brand-sand mb-1 lg:mb-2 rounded-[3px]">
                <img
                  src={shopifySized(product.image, 240)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  decoding="async"
                />
              </div>
              <span className={cn(
                "text-[10px] lg:text-[10px] font-medium text-center leading-tight line-clamp-2",
                isActive ? "text-brand-dark" : "text-brand-muted group-hover:text-brand-dark"
              )}>
                {product.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
