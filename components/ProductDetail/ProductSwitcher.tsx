import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ShopProduct } from '../../constants';
import { cn } from '../../lib/utils';

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

  // Preload only hero images for related products (not full galleries — saves bandwidth & CPU)
  useEffect(() => {
    const timeout = setTimeout(() => {
      filteredProducts.forEach(p => {
        if (p.id !== currentProductId && p.image) {
          const img = new Image();
          img.src = p.image;
        }
      });
    }, 1500);
    return () => clearTimeout(timeout);
  }, [filteredProducts, currentProductId]);

  if (filteredProducts.length <= 1) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xs lg:text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-4">
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
              className={cn(
                "group w-[90px] lg:w-auto touch-manipulation flex flex-col items-center p-1.5 lg:p-2 transition-all rounded-lg",
                isActive
                  ? "ring-2 ring-brand-gold bg-brand-gold/5"
                  : "ring-1 ring-gray-200 hover:ring-brand-gold/50 bg-white"
              )}
            >
              <div className="aspect-square w-full overflow-hidden bg-gray-100 mb-1 lg:mb-2 rounded-md">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  decoding="async"
                />
              </div>
              <span className={cn(
                "text-[10px] lg:text-[10px] font-medium text-center leading-tight line-clamp-2",
                isActive ? "text-brand-dark" : "text-gray-600 group-hover:text-brand-dark"
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
