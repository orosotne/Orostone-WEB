import React from 'react';
import { cn } from '@/lib/utils';

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
    <section className="pt-6 pb-8 lg:pt-8 lg:pb-16 bg-gradient-to-br from-white via-[#FAFAF8] to-[#F5F5F0]">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-2" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Desktop Image Gallery — col-span-7 */}
          <div className="hidden lg:block lg:col-span-7 space-y-4">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Mobile Image — 3:4 aspect */}
          <div className="lg:hidden">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          </div>

          {/* Product Info — col-span-5 */}
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-5/6" />
            <div className="pt-4 space-y-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="pt-6 space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        </div>
      </div>
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
// CATEGORY PAGE SKELETON (matches CategoryPage hero + grid)
// ===========================================

export const CategoryPageSkeleton: React.FC = () => (
  <>
    {/* Hero — matches h-[320px] md:h-[400px] with gold gradient */}
    <section
      className="relative h-[320px] md:h-[400px] overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #F5E9B8 0%, #ECD488 50%, #C9A85C 100%)' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="relative h-full container mx-auto px-6 lg:px-8 flex flex-col justify-end pb-10 md:pb-14">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-3 w-12 bg-white/20" />
          <Skeleton className="h-3 w-2 bg-white/20" />
          <Skeleton className="h-3 w-28 bg-white/20" />
        </div>
        {/* Title */}
        <Skeleton className="h-10 md:h-14 w-64 md:w-96 bg-white/20 rounded-lg mb-3" />
        {/* Description */}
        <Skeleton className="h-5 w-80 max-w-xl bg-white/20 rounded mb-3" />
        {/* Product count */}
        <Skeleton className="h-3 w-24 bg-white/20 rounded mt-1" />
      </div>
    </section>

    {/* Filter bar placeholder */}
    <div className="container mx-auto px-6 lg:px-8 pt-6 pb-2 flex gap-3 flex-wrap">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-24 rounded-full" />
      ))}
    </div>

    {/* Product Grid */}
    <section className="container mx-auto px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} compact={false} />
        ))}
      </div>
    </section>

    {/* SEO content placeholder */}
    <section className="container mx-auto px-6 lg:px-8 py-12 md:py-16 max-w-4xl space-y-4">
      <Skeleton className="h-8 w-64 mb-6" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === 7 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </section>
  </>
);

// ===========================================
// CHECKOUT SKELETON
// ===========================================

export const CheckoutSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 lg:px-8 py-8">
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Form */}
      <div className="lg:w-2/3 space-y-6">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ))}
      </div>
      {/* Summary */}
      <div className="lg:w-1/3">
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
