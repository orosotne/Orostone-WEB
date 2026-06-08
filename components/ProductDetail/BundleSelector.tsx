import React from 'react';
import { cn, formatPrice } from '../../lib/utils';
import type { BundleOption } from './types';
import { BUNDLE_OPTIONS } from './types';

interface BundleSelectorProps {
  pricePerSlab: number;
  pricePerM2: number;
  selectedBundle: BundleOption;
  onBundleChange: (bundle: BundleOption) => void;
}

export const BundleSelector: React.FC<BundleSelectorProps> = ({
  pricePerSlab,
  pricePerM2,
  selectedBundle,
  onBundleChange,
}) => {
  const slabAreaM2 = pricePerM2 > 0 ? Math.round((pricePerSlab / pricePerM2) * 100) / 100 : 5.12;

  const calculateBundlePrice = (bundle: BundleOption) => {
    const basePrice = pricePerSlab * bundle.quantity;
    const discount = bundle.discountPercent / 100;
    return Math.round(basePrice * (1 - discount) * 100) / 100;
  };

  const calculateSavings = (bundle: BundleOption) => {
    const basePrice = Math.round(pricePerSlab * bundle.quantity * 100) / 100;
    const discountedPrice = calculateBundlePrice(bundle);
    return Math.round((basePrice - discountedPrice) * 100) / 100;
  };

  const calculatePricePerM2 = (bundle: BundleOption) => {
    const discountMultiplier = 1 - bundle.discountPercent / 100;
    return Math.round(pricePerM2 * discountMultiplier * 100) / 100;
  };

  return (
    <div className="mb-8">
      <h3 className="text-xs lg:text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-4">
        Počet platní
      </h3>
      <div className="space-y-3">
        {BUNDLE_OPTIONS.map((bundle) => {
          const isSelected = selectedBundle.quantity === bundle.quantity;
          const bundlePrice = calculateBundlePrice(bundle);
          const savings = calculateSavings(bundle);
          const bundlePricePerM2 = calculatePricePerM2(bundle);
          const totalAreaM2 = Math.round(slabAreaM2 * bundle.quantity * 100) / 100;

          return (
            <button
              key={bundle.quantity}
              onClick={() => onBundleChange(bundle)}
              className={cn(
                "w-full p-3 sm:p-4 border transition-all text-left relative",
                isSelected
                  ? "border-brand-dark bg-white ring-1 ring-brand-dark"
                  : bundle.isBestValue
                    ? "border-brand-gold/50 bg-brand-gold/5 hover:border-brand-gold"
                    : "border-gray-200 bg-white hover:border-gray-400"
              )}
            >
              {bundle.isBestValue && (
                <span className="absolute -top-2.5 right-4 bg-brand-gold text-brand-dark text-[9px] font-bold tracking-wider uppercase px-2 py-0.5">
                  Najlepšia hodnota
                </span>
              )}

              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-6 h-6 lg:w-5 lg:h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0",
                  isSelected ? "border-brand-dark" : "border-gray-300"
                )}>
                  {isSelected && (
                    <div className="w-3 h-3 lg:w-2.5 lg:h-2.5 rounded-full bg-brand-dark" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mb-0.5 sm:mb-1">
                        <span className="font-semibold text-brand-dark text-sm sm:text-base">
                          {bundle.quantity} {bundle.quantity === 1 ? 'platňa' : bundle.quantity < 5 ? 'platne' : 'platní'}
                        </span>
                        {bundle.discountPercent > 0 && (
                          <span className="text-emerald-600 text-xs sm:text-sm font-semibold">
                            {bundle.label}
                          </span>
                        )}
                        {bundle.discountPercent === 0 && (
                          <span className="text-gray-400 text-xs sm:text-sm">
                            — {bundle.label}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] sm:text-xs text-gray-500">
                        {formatPrice(bundlePricePerM2)} / m² • {totalAreaM2.toFixed(2)} m²
                      </div>
                    </div>

                    <div className="mt-1.5 sm:mt-0 sm:text-right flex-shrink-0">
                      <div className="font-bold text-brand-dark text-base sm:text-lg">
                        {formatPrice(bundlePricePerM2)}<span className="text-xs sm:text-sm font-normal text-gray-400"> / m² s DPH</span>
                      </div>
                      <div className="text-[11px] sm:text-xs text-gray-500">
                        spolu {formatPrice(bundlePrice)}
                      </div>
                      {savings > 0 && (
                        <div className="text-emerald-600 text-[11px] sm:text-xs font-medium">
                          Ušetríš: {formatPrice(savings)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
