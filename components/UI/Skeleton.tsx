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
  <div className={cn(
    'grid gap-6',
    compact
      ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
  )}>
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} compact={compact} />
    ))}
  </div>
);

// ===========================================
// PRODUCT DETAIL SKELETON
// ===========================================

export const ProductDetailSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 lg:px-8 py-8">
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="lg:w-1/2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="flex gap-3 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-20 rounded-lg" />
          ))}
        </div>
      </div>
      {/* Product Info */}
      <div className="lg:w-1/2 space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
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
