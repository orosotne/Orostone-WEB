import React from 'react';
import { useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Container, Section } from '../Design';
import { CATALOG_GRID } from '../Shop/catalogGrid';
import { categoryHeroCopy } from '../Shop/categoryHero';

// ===========================================
// BASE SKELETON
// ===========================================

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      'animate-pulse rounded-lg bg-gray-200/70',
      className
    )}
  />
);

// ===========================================
// PRODUCT CARD SKELETON
// ===========================================

export const ProductCardSkeleton: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="bg-[#F9F9F7] rounded-2xl overflow-hidden">
    {/* Image */}
    <Skeleton className={cn(
      'w-full rounded-none',
      compact ? 'aspect-square' : 'aspect-[4/5]'
    )} />
    {/* Info */}
    <div className={cn('px-4 pt-4', compact ? 'pb-3' : 'pb-5')}>
      <Skeleton className="h-4 w-3/4 mb-2" />
      {!compact && <Skeleton className="h-3 w-full mb-3" />}
      <div className="flex items-baseline gap-2">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-5 w-14" />
      </div>
      <Skeleton className="h-10 w-full mt-3 rounded-lg" />
    </div>
  </div>
);

// ===========================================
// PRODUCT GRID SKELETON
// ===========================================

interface ProductGridSkeletonProps {
  count?: number;
  compact?: boolean;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ 
  count = 6, 
  compact = false 
}) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} compact={compact} />
    ))}
  </div>
);

// ===========================================
// PRODUCT DETAIL SKELETON
// ===========================================

export const ProductDetailSkeleton: React.FC = () => (
  <>
    {/* Hero: the same boxes as HeroSection (breadcrumb row, brand line, chips and title above the photo on phones),
        so the photo and the title stay where they are when the page arrives */}
    <section className="bg-brand-light pb-8 pt-6 lg:pb-16 lg:pt-8">
      <Container>
        <div className="mb-8 flex h-7 items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12 rounded-sm bg-brand-sand" />
            <Skeleton className="h-3 w-24 rounded-sm bg-brand-sand" />
          </div>
          <Skeleton className="h-7 w-20 rounded-sm bg-brand-sand" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="hidden space-y-3 lg:col-span-7 lg:block">
            <Skeleton className="aspect-square w-full rounded-[3px] bg-brand-sand lg:max-h-[calc(100svh-104px-24px-128px)] lg:min-h-[360px]" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-[3px] bg-brand-sand" />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="mb-2 flex h-6 items-center lg:mb-4">
              <Skeleton className="h-3 w-24 rounded-sm bg-brand-sand" />
            </div>
            <div className="mb-4 flex gap-2 overflow-hidden">
              <Skeleton className="h-[30px] w-16 flex-none rounded-full bg-brand-sand" />
              <Skeleton className="h-[30px] w-28 flex-none rounded-full bg-brand-sand" />
              <Skeleton className="h-[30px] w-40 flex-none rounded-full bg-brand-sand" />
            </div>
            {/* one line of the title: text-3xl / md:text-4xl / lg:text-5xl at leading-tight */}
            <Skeleton className="mb-2 h-[2.34rem] w-3/4 rounded-sm bg-brand-sand md:h-[2.81rem] lg:mb-4 lg:h-[3.75rem]" />

            <div className="mb-6 lg:hidden">
              <Skeleton className="aspect-[3/4] w-full rounded-[3px] bg-brand-sand" />
              <div className="grid grid-cols-4 gap-2 pt-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-[3px] bg-brand-sand" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-4 w-full rounded-sm bg-brand-sand" />
              <Skeleton className="h-4 w-5/6 rounded-sm bg-brand-sand" />
              <div className="space-y-3 pt-4">
                <Skeleton className="h-10 w-32 rounded-sm bg-brand-sand" />
                <Skeleton className="h-12 w-full rounded-[10px] bg-brand-sand" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>

    {/* Features/highlights placeholder */}
    <section className="py-12 lg:py-20 bg-brand-dark">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
            <Skeleton className="h-5 w-32 bg-white/10" />
            <Skeleton className="h-3 w-full bg-white/10" />
            <Skeleton className="h-3 w-5/6 bg-white/10" />
          </div>
        ))}
      </div>
    </section>

    {/* Specifications placeholder */}
    <section className="py-10 lg:py-16 bg-[#F9F9F7]">
      <div className="container mx-auto px-6 max-w-4xl space-y-3">
        <Skeleton className="h-6 w-48 mb-6" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </section>

    {/* Related products placeholder */}
    <section className="py-10 lg:py-16 bg-white">
      <div className="container mx-auto px-6">
        <Skeleton className="h-6 w-40 mb-8" />
        <ProductGridSkeleton count={4} compact />
      </div>
    </section>

    {/* FAQ placeholder */}
    <section className="py-10 lg:py-16 bg-[#F9F9F7]">
      <div className="container mx-auto px-6 max-w-3xl space-y-4">
        <Skeleton className="h-6 w-32 mb-6" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    </section>
  </>
);

// ===========================================
// CATALOG GRID SKELETON (matches components/Shop/ProductCard)
// ===========================================

export const CatalogGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className={CATALOG_GRID} aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        <div className="aspect-[1536/2752] w-full animate-pulse rounded-[2px] bg-brand-sand" />
        <div className="mt-5 h-2.5 w-2/3 animate-pulse rounded-sm bg-brand-sand" />
        <div className="mt-3 h-4 w-3/4 animate-pulse rounded-sm bg-brand-sand" />
        <div className="mt-4 h-4 w-1/2 animate-pulse rounded-sm bg-brand-sand" />
        <div className="mt-2 h-3.5 w-2/5 animate-pulse rounded-sm bg-brand-sand" />
        <div className="mt-5 h-11 w-full animate-pulse rounded-[10px] bg-brand-sand" />
      </div>
    ))}
  </div>
);

// ===========================================
// CATEGORY PAGE SKELETON (matches CategoryPage: PageHero, colour chips, grid)
// ===========================================

/** Text set invisibly over sand bars, line by line: the block wraps and measures exactly like the real one */
const TextBars: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="animate-pulse rounded-sm bg-brand-sand text-transparent [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">
    {children}
  </span>
);

export const CategoryPageSkeleton: React.FC = () => {
  const { slug = '', subCategory } = useParams<{ slug: string; subCategory?: string }>();
  const hero = categoryHeroCopy(slug, subCategory);
  return (
  <>
    {/* PageHero's boxes with the page's own title and lead, so the chips and the grid don't move when it arrives */}
    <Section tone="chalk" band={false} className="pb-[var(--os-band)] pt-[clamp(40px,5vw,88px)]">
      <Container>
        <div className="grid max-w-[660px] justify-items-start gap-5" aria-hidden="true">
          <p className="text-os-eyebrow uppercase">
            <TextBars>E-shop / Sinterovaný kameň</TextBars>
          </p>
          <p className="text-os-h1 [text-wrap:balance]">
            <TextBars>{hero?.title ?? 'Sinterovaný kameň'}</TextBars>
          </p>
          {hero?.lead && (
            <p className="max-w-[54ch] text-os-lead font-light">
              <TextBars>{hero.lead}</TextBars>
            </p>
          )}
        </div>
      </Container>
    </Section>
    <div className="border-y border-brand-line bg-brand-light">
      <Container className="flex gap-2 overflow-hidden py-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-11 w-24 flex-none animate-pulse rounded-full bg-brand-sand" />
        ))}
      </Container>
    </div>
    <Section tone="chalk" className="!pt-[clamp(40px,5vw,72px)]">
      <Container>
        <CatalogGridSkeleton />
      </Container>
    </Section>
  </>
  );
};

// ===========================================
// CHECKOUT SKELETON
// ===========================================

export const CheckoutSkeleton: React.FC = () => (
  <Section tone="chalk" className="!pt-[clamp(40px,5vw,72px)]">
    <Container>
      <div className="mb-[clamp(32px,4vw,56px)] grid gap-4">
        <div className="h-4 w-32 animate-pulse rounded-sm bg-brand-sand" />
        <div className="h-[clamp(2.2rem,3vw,3.5rem)] w-56 animate-pulse rounded-sm bg-brand-sand" />
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
        <div className="space-y-6">
          <div className="h-6 w-48 animate-pulse rounded-sm bg-brand-sand" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-5 border-t border-brand-line pt-6">
              <div className="h-[126px] w-[72px] flex-none animate-pulse rounded-[2px] bg-brand-sand" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-1/2 animate-pulse rounded-sm bg-brand-sand" />
                <div className="h-4 w-1/4 animate-pulse rounded-sm bg-brand-sand" />
                <div className="h-10 w-32 animate-pulse rounded-[10px] bg-brand-sand" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-[420px] animate-pulse rounded-[3px] bg-brand-sand" />
      </div>
    </Container>
  </Section>
);

// ===========================================
// TEXT SKELETON (for generic content)
// ===========================================

interface TextSkeletonProps {
  lines?: number;
  className?: string;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
      />
    ))}
  </div>
);

export default Skeleton;
