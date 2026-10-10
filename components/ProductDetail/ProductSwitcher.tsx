import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ShopProduct } from '../../constants';
import { cn, titleCase } from '../../lib/utils';
import { shopifyImageUrl, shopifySized } from '../../lib/shopifyImage';
import { Eyebrow } from '../Design';

interface ProductSwitcherProps {
  currentProductId: string;
  products: ShopProduct[];
}

export const ProductSwitcher: React.FC<ProductSwitcherProps> = ({ currentProductId, products }) => {
  const navigate = useNavigate();

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
      <Eyebrow as="h3" className="mb-4 text-brand-dark">
        Ďalšie produkty
      </Eyebrow>
      {/* Phones: two rows that scroll sideways and snap column by column; the right edge fades out to show there is more */}
      <div
        className="os-fade-x -mx-[var(--os-edge)] grid snap-x snap-mandatory scroll-px-[var(--os-edge)] grid-flow-col grid-rows-2 gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain py-1 pl-[var(--os-edge)] pr-[calc(var(--os-edge)+28px)] scrollbar-hide [touch-action:pan-x_pan-y] lg:m-0 lg:grid-flow-row lg:grid-cols-4 lg:grid-rows-none lg:gap-2 lg:overflow-visible lg:p-0 lg:[-webkit-mask-image:none] lg:[mask-image:none]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {filteredProducts.map((product) => {
          const isActive = product.id === currentProductId;
          const name = titleCase(product.name);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => handleProductClick(product.id)}
              onPointerEnter={() => warmHeroImage(product)}
              onFocus={() => warmHeroImage(product)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'os-press group flex w-[92px] touch-manipulation snap-start flex-col items-center rounded-[3px] p-1.5 lg:w-auto lg:p-2',
                isActive ? 'bg-brand-sand ring-2 ring-brand-dark' : 'bg-white ring-1 ring-brand-line hover:ring-brand-dark/40',
              )}
            >
              <div className="mb-1 aspect-square w-full overflow-hidden rounded-[3px] bg-brand-sand lg:mb-2">
                <img
                  src={shopifySized(product.image, 240)}
                  alt={name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  decoding="async"
                />
              </div>
              <span
                className={cn(
                  'line-clamp-2 text-center text-xs font-medium leading-tight',
                  isActive ? 'text-brand-dark' : 'text-brand-muted group-hover:text-brand-dark',
                )}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
