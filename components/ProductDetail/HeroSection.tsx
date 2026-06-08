import React, { useState, useEffect, useRef, startTransition } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ChevronRight,
  ZoomIn,
  Maximize2,
  Stone,
  Shield,
  Truck,
  Package,
  ChevronDown,
} from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils';
import { MAX_SAMPLES } from '../../constants';
import type { ShopProduct } from '../../constants';
import { ShareButton } from '../UI/ShareButton';
import { ProductSwitcher } from './ProductSwitcher';
import { BundleSelector } from './BundleSelector';
import { InstallationSelector } from './InstallationSelector';
import { ProductLightbox } from './ProductLightbox';
import { MaterialPerspectivesViewer } from './MaterialPerspectivesViewer';
import { ThicknessIcon, shopifyImageUrl, shopifySrcSet, productImageAlt, shortFinish, getFinishIcon, calculateSlabPrice } from './utils';
import type { BundleOption } from './types';

interface HeroSectionProps {
  product: ShopProduct;
  allProducts: ShopProduct[];
  selectedBundle: BundleOption;
  onBundleChange: (bundle: BundleOption) => void;
  onAddToCart: () => void;
  isInCart: boolean;
  installationSelected: boolean;
  installationAreaM2: number | null;
  onInstallationToggle: (selected: boolean) => void;
  onInstallationAreaChange: (area: number | null) => void;
  onAddSample: () => void;
  isSampleInCart: boolean;
  sampleCount: number;
  onLightboxChange?: (isOpen: boolean) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  product,
  allProducts,
  selectedBundle,
  onBundleChange,
  onAddToCart,
  isInCart,
  installationSelected,
  installationAreaM2,
  onInstallationToggle,
  onInstallationAreaChange,
  onAddSample,
  isSampleInCart,
  sampleCount,
  onLightboxChange,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);

  const images = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  const currentImage = images[selectedImageIndex];
  const singleSlabPrice = calculateSlabPrice(product.pricePerM2, product.dimensions);

  const openLightbox = (index?: number) => {
    startTransition(() => {
      if (index !== undefined) setSelectedImageIndex(index);
      setIsLightboxOpen(true);
    });
    onLightboxChange?.(true);
  };
  const closeLightbox = () => {
    startTransition(() => setIsLightboxOpen(false));
    onLightboxChange?.(false);
  };
  const goToPreviousLightbox = () =>
    startTransition(() => setSelectedImageIndex((prev) => Math.max(0, prev - 1)));
  const goToNextLightbox = () =>
    startTransition(() => setSelectedImageIndex((prev) => Math.min(images.length - 1, prev + 1)));

  const goToPrevious = () => {
    startTransition(() => setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)));
  };

  const goToNext = () => {
    startTransition(() => setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)));
  };

  const visibleThumbnails = showAllImages ? images : images.slice(0, 4);

  useEffect(() => {
    images.slice(0, 3).forEach(src => { const img = new Image(); img.src = src; });
  }, [images]);

  const FinishIcon = getFinishIcon(product.finish);

  return (
    <section className="pt-6 pb-8 lg:pt-8 lg:pb-16 bg-gradient-to-br from-white via-[#FAFAF8] to-[#F5F5F0]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-brand-dark transition-colors">E-Shop</Link>
            <ChevronRight size={12} />
            <span className="text-brand-dark font-medium">{product.name}</span>
          </nav>
          <ShareButton title={product.name} variant="dark" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Image Gallery — desktop only */}
          <div className="hidden lg:block lg:order-1 lg:col-span-7 space-y-4">
            <div>
              <div
                className="aspect-square bg-[#F5F5F3] overflow-hidden relative group rounded-xl cursor-pointer"
                onClick={() => openLightbox()}
              >
                <AnimatePresence mode="sync">
                  <m.img
                    key={selectedImageIndex}
                    src={shopifyImageUrl(currentImage, 1200)}
                    alt={productImageAlt(product, selectedImageIndex)}
                    width={1200}
                    height={1200}
                    className="w-full h-full object-cover"
                    srcSet={shopifySrcSet(currentImage)}
                    sizes="(max-width: 768px) 100vw, 58vw"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>

                <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={18} />
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-brand-dark hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Predchádzajúci obrázok"
                    >
                      <ChevronRight size={20} className="rotate-180" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); goToNext(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-brand-dark hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Ďalší obrázok"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[11px] tracking-wider text-brand-dark font-medium">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}

                {product.inStock && (
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-md text-[10px] uppercase tracking-widest font-medium">
                    Skladom
                  </div>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="space-y-3">
                <div className="grid gap-3 grid-cols-4">
                  {visibleThumbnails.map((img, index) => {
                    const actualIndex = showAllImages ? index : images.indexOf(img);
                    return (
                      <button
                        key={actualIndex}
                        onClick={() => setSelectedImageIndex(actualIndex)}
                        className={cn(
                          "aspect-square bg-[#F5F5F3] overflow-hidden transition-all rounded-lg",
                          selectedImageIndex === actualIndex
                            ? "ring-2 ring-brand-dark"
                            : "ring-1 ring-gray-200 hover:ring-gray-400"
                        )}
                      >
                        <img
                          src={shopifyImageUrl(img, 400)}
                          alt={productImageAlt(product, actualIndex)}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
                </div>

                {images.length > 4 && (
                  <button
                    onClick={() => setShowAllImages(!showAllImages)}
                    className="w-full py-3 border border-gray-300 rounded-lg text-sm font-medium text-brand-dark hover:border-brand-dark transition-colors flex items-center justify-center gap-2"
                  >
                    {showAllImages ? (
                      <>
                        <Minus size={16} />
                        Skryť
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Ukázať viac
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            <MaterialPerspectivesViewer product={product} />
          </div>

          {/* Right: Product Info */}
          <div className="lg:order-2 lg:col-span-5">
            <div className="flex flex-col">
              {product.vendor && (
                <div className="order-1 mb-2 lg:mb-4">
                  <span className="text-xs lg:text-[10px] font-bold tracking-[0.2em] uppercase text-brand-gold">
                    {product.vendor}
                  </span>
                </div>
              )}

              <h1 className="order-3 lg:order-3 text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark leading-tight mb-2 lg:mb-4">
                {product.name}
              </h1>

              <div className="order-4 lg:order-4 hidden lg:flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-brand-dark">
                  {formatPrice(Math.round(product.pricePerM2 * (1 - selectedBundle.discountPercent / 100) * 100) / 100)}
                </span>
                <span className="text-sm text-gray-400">/ m² s DPH</span>
                {selectedBundle.discountPercent > 0 && (
                  <span className="text-sm text-gray-400 line-through">{formatPrice(product.pricePerM2)}</span>
                )}
                {selectedBundle.discountPercent > 0 && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    -{selectedBundle.discountPercent}%
                  </span>
                )}
              </div>

              <div
                className="order-2 lg:order-2 mb-4 flex w-full min-w-0 flex-nowrap gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain [touch-action:pan-x_pan-y] scrollbar-hide lg:flex-wrap lg:overflow-visible"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-dark px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-gold lg:text-[11px]">
                  <ThicknessIcon size={14} />
                  {product.thickness}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-dark px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-gold lg:text-[11px]">
                  <Maximize2 size={14} />
                  {product.dimensions}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-dark px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-gold lg:text-[11px]">
                  <FinishIcon size={14} />
                  {shortFinish(product.finish)}
                </span>
              </div>

              <div className="order-5 lg:order-5 mb-6 lg:mb-8">
                <div className="relative">
                  {product.descriptionHtml ? (
                    <div
                      className={cn(
                        "prose prose-sm prose-gray max-w-none font-light leading-relaxed text-lg border-l-2 border-brand-gold pl-6 [&>p]:text-gray-600 [&>p]:mb-3 [&>ul]:text-gray-600 [&>ol]:text-gray-600 [&>p:last-child]:mb-0 [&_strong]:text-brand-gold [&_strong]:font-semibold transition-all duration-300",
                        !descExpanded && "max-h-[6.5rem] overflow-hidden"
                      )}
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />
                  ) : (
                    <p className={cn(
                      "text-gray-600 font-light leading-relaxed text-lg transition-all duration-300",
                      !descExpanded && "max-h-[6.5rem] overflow-hidden"
                    )}>
                      {product.description}
                    </p>
                  )}
                  {!descExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                  )}
                </div>
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="mt-3 min-h-[44px] text-sm font-semibold text-brand-gold hover:text-brand-dark active:text-brand-dark transition-colors flex items-center gap-1.5"
                >
                  {descExpanded ? (
                    <>
                      <ChevronDown size={14} className="rotate-180 transition-transform" />
                      Skryť
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} className="transition-transform" />
                      Čítať viac o produkte
                    </>
                  )}
                </button>
              </div>

              <div className="order-[8] lg:order-[7]">
                <h3 className="text-xs lg:text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-4 pt-8 border-t border-gray-200">
                  Technické parametre
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 pb-8 border-b border-gray-200">
                  {[
                    { label: 'Rozmery', value: product.dimensions, icon: Maximize2 },
                    { label: 'Hrúbka', value: product.thickness, icon: ThicknessIcon },
                    { label: 'Povrch', value: shortFinish(product.finish), icon: getFinishIcon(product.finish) },
                    { label: 'Materiál', value: product.material || 'Sinterovaný kameň', icon: Stone },
                  ].map((spec) => {
                    const Icon = spec.icon;
                    const isMaterial = spec.label === 'Materiál';
                    const inner = (
                      <div key={spec.label} className={`flex flex-col items-center text-center p-2 ${isMaterial ? 'group cursor-pointer' : ''}`}>
                        <Icon size={40} className={`text-brand-dark mb-2 ${isMaterial ? 'group-hover:text-brand-gold transition-colors' : ''}`} />
                        <span className="text-xs lg:text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-1">
                          {spec.label}
                        </span>
                        <span className={`text-brand-dark font-medium text-xs ${isMaterial ? 'group-hover:text-brand-gold underline underline-offset-2 decoration-brand-gold/30 transition-colors' : ''}`}>
                          {spec.value}
                        </span>
                      </div>
                    );
                    if (isMaterial) {
                      return <a key={spec.label} href="/sinterovany-kamen">{inner}</a>;
                    }
                    return inner;
                  })}
                </div>
              </div>

              {/* Mobile Image Gallery — horizontal scroll carousel */}
              <div className="order-4 lg:hidden mb-6">
                <div className="relative">
                  <div
                    ref={mobileGalleryRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide [touch-action:pan-x_pan-y]"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                    onScroll={(e) => {
                      const el = e.currentTarget;
                      const index = Math.round(el.scrollLeft / el.clientWidth);
                      if (index >= 0 && index < images.length && index !== selectedImageIndex) {
                        setSelectedImageIndex(index);
                      }
                    }}
                  >
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="w-full flex-shrink-0 snap-center aspect-[3/4] bg-[#F5F5F3] relative rounded-lg overflow-hidden"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={shopifyImageUrl(img, 800)}
                          alt={productImageAlt(product, index)}
                          width={900}
                          height={1200}
                          className="w-full h-full object-cover"
                          srcSet={shopifySrcSet(img)}
                          sizes="100vw"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                        {index === 0 && product.inStock && (
                          <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1.5 rounded-md text-xs uppercase tracking-widest font-medium">
                            Skladom
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 w-11 h-11 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-dark shadow-sm">
                          <ZoomIn size={18} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 pt-3">
                    {(showAllImages ? images : images.slice(0, 4)).map((img, idx) => {
                      const actualIndex = showAllImages ? idx : idx;
                      const isOverflowTile = !showAllImages && images.length > 4 && idx === 3;
                      const overflowCount = images.length - 3;
                      return (
                        <button
                          key={actualIndex}
                          onClick={() => {
                            if (isOverflowTile) {
                              setShowAllImages(true);
                              return;
                            }
                            setSelectedImageIndex(actualIndex);
                            mobileGalleryRef.current?.scrollTo({
                              left: actualIndex * (mobileGalleryRef.current?.clientWidth ?? 0),
                              behavior: 'smooth',
                            });
                          }}
                          className={cn(
                            "relative aspect-square bg-[#F5F5F3] overflow-hidden transition-all rounded-lg",
                            !isOverflowTile && selectedImageIndex === actualIndex
                              ? "ring-2 ring-brand-dark"
                              : "ring-1 ring-gray-200 active:ring-gray-400"
                          )}
                          aria-label={isOverflowTile ? `Zobraziť ďalších ${overflowCount} obrázkov` : `Obrázok ${actualIndex + 1}`}
                        >
                          <img
                            src={shopifyImageUrl(img, 200)}
                            alt={productImageAlt(product, actualIndex)}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {isOverflowTile && (
                            <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-white text-base font-medium">
                              +{overflowCount}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="order-6 lg:order-6">
                <ProductSwitcher
                  currentProductId={product.id}
                  products={allProducts}
                />
              </div>

              {product.stockQuantity > 0 && (
                <div className="order-[9] lg:order-[8] text-sm text-gray-500 mb-4">
                  {product.stockQuantity} ks skladom
                </div>
              )}

              <div className="order-[10] lg:order-[9]">
                <BundleSelector
                  pricePerSlab={singleSlabPrice}
                  pricePerM2={product.pricePerM2}
                  selectedBundle={selectedBundle}
                  onBundleChange={onBundleChange}
                />
                <p className="text-[11px] text-gray-500 -mt-4 mb-6 leading-relaxed">
                  <span className="text-emerald-700 font-medium">Tip:</span> Zľava sa automaticky uplatní v košíku pri 2+ platniach — platí aj pre rôzne vzory.
                </p>
              </div>

              <div className="order-[11] lg:order-[10]">
                <InstallationSelector
                  installationSelected={installationSelected}
                  installationAreaM2={installationAreaM2}
                  onInstallationToggle={onInstallationToggle}
                  onAreaChange={onInstallationAreaChange}
                />
              </div>

              <div className="order-[12] lg:order-[11] hidden lg:block space-y-3 mb-8">
                <button
                  onClick={onAddToCart}
                  className={cn(
                    "w-full py-4 px-8 text-sm font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-3",
                    isInCart
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-brand-dark text-white hover:bg-black"
                  )}
                >
                  {isInCart ? (
                    <>
                      <Check size={18} />
                      V košíku
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Pridať do košíka
                    </>
                  )}
                </button>
                {!product.sampleShopifyVariantId ? (
                  <Link
                    to="/vzorky"
                    className="w-full py-4 px-8 text-sm font-semibold tracking-widest uppercase border border-gray-300 text-brand-dark hover:border-brand-gold hover:text-brand-gold transition-all flex items-center justify-center gap-3"
                  >
                    <Package size={18} />
                    Objednať vzorku zadarmo
                  </Link>
                ) : (
                  <button
                    onClick={onAddSample}
                    className={cn(
                      "w-full py-4 px-8 text-sm font-semibold tracking-widest uppercase border transition-all flex items-center justify-center gap-3",
                      isSampleInCart
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 cursor-default"
                        : sampleCount >= MAX_SAMPLES
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-brand-dark hover:border-brand-gold hover:text-brand-gold"
                    )}
                  >
                    {isSampleInCart ? (
                      <>
                        <Check size={18} />
                        Vzorka v košíku
                      </>
                    ) : sampleCount >= MAX_SAMPLES ? (
                      <>
                        <Package size={18} />
                        Maximum vzoriek ({MAX_SAMPLES})
                      </>
                    ) : (
                      <>
                        <Package size={18} />
                        Pridať vzorku
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="order-[13] lg:order-[12] space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-brand-gold" />
                  <span>Expedícia do {product.deliveryTimeframe || '5 pracovných dní'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-brand-gold" />
                  <span>Záruka 24 mesiacov na materiál</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductLightbox
          images={images}
          currentIndex={selectedImageIndex}
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          onPrevious={goToPreviousLightbox}
          onNext={goToNextLightbox}
          productName={product.name}
        />
      </div>
    </section>
  );
};
