import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import type { ShopProduct } from '../../constants';
import { formatPrice, productBlurb, titleCase } from '../../lib/utils';
import { calculateSlabPrice } from '../../lib/slab';
import { HOME_DECORS } from '../Home/homeData';
import { shopifySized, shopifySrcSet } from '../../lib/shopifyImage';

export interface ProductCardProps {
  product: ShopProduct;
  /** Return the add-to-cart promise: the button shows „Pridávam…" until it settles. */
  onAddToCart: () => void | Promise<void>;
  inCart: boolean;
  quantity: number;
  /** First row of the grid: load the slab photo eagerly */
  priority?: boolean;
}

const prefetchProductDetail = () => { import('../../pages/ShopProductDetail'); };

const TONE_LABEL = new Map(HOME_DECORS.map((d) => [d.slug, d.label]));

// Shopify CDN resizes on the fly (same URLs as the product page, so the browser cache is shared);
// the originals are 1536 × 2752 px, ~250 KB each
const SIZES = '(min-width: 1800px) 400px, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, 46vw';

/** Catalog card: the whole slab in its true proportion, tone and thickness, price per m² and per slab, add to cart. */
const ProductCardImpl: React.FC<ProductCardProps> = ({ product, onAddToCart, inCart, quantity, priority = false }) => {
  const name = titleCase(product.name);
  // Answer the tap at once: Shopify takes a moment, and a second tap must not add a second slab
  const [adding, setAdding] = useState(false);
  const handleAdd = () => {
    if (adding) return;
    setAdding(true);
    Promise.resolve(onAddToCart()).finally(() => setAdding(false));
  };
  // Tone · thickness · stock; the stock note shows from 640 px, phones get it on the product page
  const meta = [
    ...[TONE_LABEL.get(product.id), product.thickness.replace(/(\d)\s*mm/i, '$1 mm')]
      .filter((text): text is string => Boolean(text))
      .map((text) => ({ text, smOnly: false })),
    ...(product.inStock ? [{ text: 'Skladom', smOnly: true }] : []),
  ];

  return (
    <article className="group flex h-full flex-col" onMouseEnter={prefetchProductDetail} onFocus={prefetchProductDetail}>
      <Link to={`/produkt/${product.id}`} className="block no-underline">
        <span className="block overflow-hidden rounded-[2px] bg-brand-sand shadow-[0_26px_38px_-26px_rgba(26,26,26,0.55),0_0_0_1px_rgba(26,26,26,0.07)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.2,0.7,0.2,1)] motion-safe:group-hover:-translate-y-2">
          <img
            src={shopifySized(product.image, 600)}
            srcSet={shopifySrcSet(product.image)}
            sizes={SIZES}
            alt={name}
            width={1536}
            height={2752}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className="aspect-[1536/2752] w-full object-cover"
          />
        </span>
        {/* Lines break only between segments, the dot stays at the end of a line */}
        <span className="mt-5 block text-[0.66rem] font-semibold uppercase leading-snug tracking-[0.16em] text-brand-muted">
          {meta.map((part, i) => {
            const next = meta[i + 1];
            return (
              <React.Fragment key={part.text}>
                <span className={`whitespace-nowrap ${part.smOnly ? 'hidden sm:inline' : ''}`}>
                  {part.text}
                  {next && <span className={next.smOnly ? 'hidden sm:inline' : ''}> ·</span>}
                </span>{' '}
              </React.Fragment>
            );
          })}
        </span>
        <h3 className="mt-1.5 text-[0.95rem] font-semibold leading-snug decoration-1 underline-offset-4 group-hover:underline sm:text-base">
          {name}
        </h3>
        <span className="mt-2 line-clamp-2 text-[0.84rem] font-normal leading-relaxed text-brand-muted">{productBlurb(product.description, product.name)}</span>
      </Link>

      <p className="mt-3 tabular-nums">
        <span className="font-semibold">{formatPrice(product.pricePerM2)}</span>{' '}
        <span className="text-[0.84rem] font-normal text-brand-muted">za&nbsp;m² s&nbsp;DPH</span>
      </p>
      <p className="text-[0.84rem] font-normal tabular-nums text-brand-muted">
        Celá platňa {formatPrice(calculateSlabPrice(product.pricePerM2, product.dimensions))}
      </p>

      <div className="mt-auto pt-5">
        <button
          type="button"
          onClick={handleAdd}
          aria-busy={adding}
          aria-label={inCart ? `Pridať ďalšiu platňu ${name} do košíka, v košíku: ${quantity}` : `Pridať ${name} do košíka`}
          className={`os-press inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[10px] border px-3 text-[0.7rem] font-bold uppercase leading-none tracking-[0.12em] ${
            inCart
              ? 'border-brand-dark bg-brand-dark text-brand-light hover:bg-[#333331]'
              : 'border-brand-dark text-brand-dark hover:bg-brand-dark/5'
          } ${adding ? 'cursor-wait' : ''}`}
        >
          {adding ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Pridávam…
            </>
          ) : inCart ? (
            `V košíku (${quantity})`
          ) : (
            'Do košíka'
          )}
        </button>
      </div>
    </article>
  );
};

// React.memo with custom comparator: skips onAddToCart from comparison.
// Parents pass an inline thunk like `() => addItem(variantId, 1)` which is a fresh
// function reference every render. Because addItem from CartContext is now identity-
// stable (cartRef pattern), every fresh thunk is functionally equivalent — safe to
// reuse the memoized render. Comparing only product/priority/inCart/quantity (all
// stable references or primitives) lets the grid skip re-rendering all cards when
// only an unrelated cart slice (e.g. isLoading) changes.
export const ProductCard = React.memo(ProductCardImpl, (prev, next) =>
  prev.product === next.product &&
  prev.priority === next.priority &&
  prev.inCart === next.inCart &&
  prev.quantity === next.quantity
);
