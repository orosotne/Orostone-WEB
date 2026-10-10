import React, { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import { Link } from 'react-router-dom';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Check,
  ShoppingBag,
  ChevronRight,
  ZoomIn,
  Maximize2,
  Stone,
  Shield,
  Truck,
  Package,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { cn, formatPrice, titleCase, withProductName } from '../../lib/utils';
import { MAX_SAMPLES } from '../../constants';
import type { ShopProduct } from '../../constants';
import { ShareButton } from '../UI/ShareButton';
import { Container, Eyebrow } from '../Design';
import { ProductSwitcher } from './ProductSwitcher';
import { BundleSelector } from './BundleSelector';
import { InstallationSelector } from './InstallationSelector';
import { ProductLightbox, type LightboxOrigin } from './ProductLightbox';
// Dočasne skryté: import { MaterialPerspectivesViewer } from './MaterialPerspectivesViewer';
import { ThicknessIcon, shopifyImageUrl, shopifySrcSet, productImageAlt, shortFinish, getFinishIcon, calculateSlabPrice } from './utils';
import type { BundleOption } from './types';
import { BUNDLE_OPTIONS } from './types';

interface HeroSectionProps {
  product: ShopProduct;
  allProducts: ShopProduct[];
  selectedBundle: BundleOption;
  onBundleChange: (bundle: BundleOption) => void;
  onAddToCart: () => void;
  /** The add-to-cart request is on its way: the button says so and ignores further taps */
  isAdding?: boolean;
  isInCart: boolean;
  installationSelected: boolean;
  installationAreaM2: number | null;
  onInstallationToggle: (selected: boolean) => void;
  onInstallationAreaChange: (area: number | null) => void;
  onAddSample: () => void;
  isSampleInCart: boolean;
  sampleCount: number;
  onLightboxChange?: (isOpen: boolean) => void;
  /** Reports whether the add-to-cart buttons are on screen; the mobile sticky bar shows only while they are not */
  onCtaVisibilityChange?: (visible: boolean) => void;
}

// Desktop thumbnails sit in one row under the main photo (all of them up to this many)
const MAX_THUMBS = 8;

const CHIP = 'inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full border border-[#D8D5CB] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark';

export const HeroSection: React.FC<HeroSectionProps> = ({
  product,
  allProducts,
  selectedBundle,
  onBundleChange,
  onAddToCart,
  isAdding = false,
  isInCart,
  installationSelected,
  installationAreaM2,
  onInstallationToggle,
  onInstallationAreaChange,
  onAddSample,
  isSampleInCart,
  sampleCount,
  onLightboxChange,
  onCtaVisibilityChange,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const name = titleCase(product.name);
  const images = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  const currentImage = images[selectedImageIndex];
  const singleSlabPrice = calculateSlabPrice(product.pricePerM2, product.dimensions);

  // The photo the lightbox grows out of and shrinks back into: the main image on desktop, the visible slide on
  // phones (the carousel is kept on the lightbox's photo, see below). The lightbox measures it when it opens and
  // again when it closes.
  const selectedIndexRef = useRef(selectedImageIndex);
  selectedIndexRef.current = selectedImageIndex;
  const getLightboxOrigin = useCallback((): LightboxOrigin | null => {
    let frame: HTMLElement | null = null;
    let img: HTMLImageElement | null = null;
    const main = mainImageRef.current;
    const rail = mobileGalleryRef.current;
    if (main && main.offsetParent !== null) {
      frame = main;
      const shown = main.querySelectorAll('img');
      img = shown[shown.length - 1] ?? null;
    } else if (rail && rail.offsetParent !== null) {
      frame = rail;
      img = rail.children[selectedIndexRef.current]?.querySelector('img') ?? null;
    }
    if (!frame) return null;
    const rect = frame.getBoundingClientRect();
    const aspect = img && img.naturalWidth ? img.naturalWidth / img.naturalHeight : rect.width / rect.height;
    return { rect, aspect };
  }, []);

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

  // While the lightbox pages through photos, keep the phone carousel on the same one, so closing lands on it
  useEffect(() => {
    if (!isLightboxOpen) return;
    const rail = mobileGalleryRef.current;
    if (rail && rail.offsetParent !== null) rail.scrollTo({ left: selectedImageIndex * rail.clientWidth, behavior: 'instant' });
  }, [isLightboxOpen, selectedImageIndex]);

  useEffect(() => {
    images.slice(0, 3).forEach(src => { const img = new Image(); img.src = src; });
  }, [images]);

  // Tell the page whether the add-to-cart buttons are visible (drives the mobile sticky bar)
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || !onCtaVisibilityChange || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => onCtaVisibilityChange(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [onCtaVisibilityChange]);

  const FinishIcon = getFinishIcon(product.finish);

  const desktopThumbs = images.length > MAX_THUMBS ? images.slice(0, MAX_THUMBS - 1) : images;
  const hiddenThumbs = images.length - desktopThumbs.length;

  const addToCartLabel = isAdding ? (
    <>
      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
      Pridávam…
    </>
  ) : isInCart ? (
    <>
      <Check size={18} aria-hidden="true" />
      V košíku
    </>
  ) : (
    <>
      <ShoppingBag size={18} aria-hidden="true" />
      Pridať do košíka
    </>
  );

  return (
    <section className="bg-brand-light pb-8 pt-6 lg:pb-16 lg:pt-8">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <nav aria-label="Navigačná cesta" className="flex items-center gap-2 text-xs text-brand-muted">
            <Link to="/" className="transition-colors hover:text-brand-dark">E-Shop</Link>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="font-medium text-brand-dark" aria-current="page">{name}</span>
          </nav>
          <ShareButton title={name} />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* Left: Image Gallery — desktop only. Sticky, so it stays in view while the visitor configures the order
              on the right; the main photo is capped to the screen height so the thumbnail row fits under it. */}
          <div className="hidden space-y-3 lg:sticky lg:top-[104px] lg:order-1 lg:col-span-7 lg:block">
            <div
              ref={mainImageRef}
              className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-[3px] bg-[#F5F5F3] lg:max-h-[calc(100svh-104px-24px-128px)] lg:min-h-[360px]"
              onClick={() => openLightbox()}
            >
              <AnimatePresence mode="sync" initial={false}>
                <m.img
                  key={selectedImageIndex}
                  src={shopifyImageUrl(currentImage, 1200)}
                  fetchPriority={selectedImageIndex === 0 ? 'high' : 'auto'}
                  alt={productImageAlt(product, selectedImageIndex)}
                  width={1200}
                  height={1200}
                  className="absolute inset-0 h-full w-full object-cover"
                  srcSet={shopifySrcSet(currentImage)}
                  sizes="(max-width: 768px) 100vw, 58vw"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>

              <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-[3px] bg-white/90 text-brand-dark opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <ZoomIn size={18} aria-hidden="true" />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                    className="os-press absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[3px] bg-white/90 text-brand-dark opacity-0 backdrop-blur hover:bg-white focus-visible:opacity-100 group-hover:opacity-100"
                    aria-label="Predchádzajúci obrázok"
                  >
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    className="os-press absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[3px] bg-white/90 text-brand-dark opacity-0 backdrop-blur hover:bg-white focus-visible:opacity-100 group-hover:opacity-100"
                    aria-label="Ďalší obrázok"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-[3px] bg-white/90 px-3 py-1.5 text-xs font-medium tabular-nums tracking-wider text-brand-dark backdrop-blur">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              )}

              {product.inStock && (
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-[3px] bg-brand-light px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-dark before:h-[7px] before:w-[7px] before:rounded-full before:bg-[#2F8F5B] before:content-['']">
                  Skladom
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${desktopThumbs.length + (hiddenThumbs > 0 ? 1 : 0)}, minmax(0, 1fr))` }}
              >
                {desktopThumbs.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`Obrázok ${index + 1}`}
                    aria-current={selectedImageIndex === index ? 'true' : undefined}
                    className={cn(
                      'os-press aspect-square overflow-hidden rounded-[3px] bg-[#F5F5F3]',
                      selectedImageIndex === index ? 'ring-2 ring-brand-dark' : 'ring-1 ring-brand-line hover:ring-gray-400',
                    )}
                  >
                    <img
                      src={shopifyImageUrl(img, 400)}
                      alt={productImageAlt(product, index)}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
                {hiddenThumbs > 0 && (
                  <button
                    type="button"
                    onClick={() => openLightbox(desktopThumbs.length)}
                    className="os-press grid aspect-square place-items-center rounded-[3px] bg-brand-sand text-sm font-medium text-brand-dark ring-1 ring-brand-line"
                    aria-label={`Zobraziť ďalších ${hiddenThumbs} obrázkov`}
                  >
                    +{hiddenThumbs}
                  </button>
                )}
              </div>
            )}

            {/* Dočasne skryté (desktop + mobil) – sekcia „Objavte krásu z každého uhla" */}
            {/* <MaterialPerspectivesViewer product={product} /> */}
          </div>

          {/* Right: Product Info */}
          <div className="lg:order-2 lg:col-span-5">
            <div className="flex flex-col">
              {product.vendor && (
                <div className="order-1 mb-2 lg:mb-4">
                  <span className="text-os-eyebrow uppercase text-brand-dark">{product.vendor}</span>
                </div>
              )}

              <h1 className="order-3 mb-2 text-3xl font-semibold leading-tight tracking-[-0.02em] text-brand-dark md:text-4xl lg:order-3 lg:mb-4 lg:text-5xl">
                {name}
              </h1>

              <div className="order-4 mb-4 hidden items-baseline gap-3 lg:order-4 lg:flex">
                <span className="text-2xl font-bold tabular-nums text-brand-dark">
                  {formatPrice(Math.round(product.pricePerM2 * (1 - selectedBundle.discountPercent / 100) * 100) / 100)}
                </span>
                <span className="text-sm text-brand-muted">/ m² s DPH</span>
                {selectedBundle.discountPercent > 0 && (
                  <span className="text-sm text-brand-muted line-through">{formatPrice(product.pricePerM2)}</span>
                )}
                {selectedBundle.discountPercent > 0 && (
                  <span className="rounded-[3px] bg-brand-dark px-2 py-0.5 text-xs font-bold text-brand-light">
                    -{selectedBundle.discountPercent}%
                  </span>
                )}
              </div>

              {/* Phones: the chips scroll sideways and snap; the right edge fades out where they continue */}
              <div
                className="os-fade-x order-2 -mx-[var(--os-edge)] mb-4 flex min-w-0 snap-x snap-mandatory scroll-px-[var(--os-edge)] flex-nowrap gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain pl-[var(--os-edge)] scrollbar-hide [touch-action:pan-x_pan-y] lg:order-2 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:pl-0 lg:[-webkit-mask-image:none] lg:[mask-image:none]"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <span className={CHIP}>
                  <ThicknessIcon size={14} />
                  {product.thickness}
                </span>
                <span className={CHIP}>
                  <Maximize2 size={14} aria-hidden="true" />
                  {product.dimensions}
                </span>
                <span className={CHIP}>
                  <FinishIcon size={14} aria-hidden="true" />
                  {shortFinish(product.finish)}
                </span>
                <span aria-hidden="true" className="w-[calc(var(--os-edge)+20px)] flex-none lg:hidden" />
              </div>

              <div className="order-5 mb-6 lg:order-5 lg:mb-8">
                <div className="relative">
                  {product.descriptionHtml ? (
                    <div
                      className={cn(
                        "prose prose-sm prose-gray max-w-none border-l-2 border-brand-dark pl-6 text-lg font-light leading-relaxed transition-all duration-300 [&>ol]:text-brand-muted [&>p:last-child]:mb-0 [&>p]:mb-3 [&>p]:text-brand-muted [&>ul]:text-brand-muted [&_strong]:font-semibold [&_strong]:text-brand-dark",
                        !descExpanded && "max-h-[6.5rem] overflow-hidden"
                      )}
                      dangerouslySetInnerHTML={{ __html: withProductName(product.descriptionHtml, product.name) }}
                    />
                  ) : (
                    <p className={cn(
                      "text-lg font-light leading-relaxed text-brand-muted transition-all duration-300",
                      !descExpanded && "max-h-[6.5rem] overflow-hidden"
                    )}>
                      {withProductName(product.description, product.name)}
                    </p>
                  )}
                  {!descExpanded && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-brand-light via-brand-light/80 to-transparent" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setDescExpanded(!descExpanded)}
                  aria-expanded={descExpanded}
                  className="mt-3 flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-dark transition-opacity active:opacity-60"
                >
                  <ChevronDown size={14} className={cn('transition-transform', descExpanded && 'rotate-180')} aria-hidden="true" />
                  {descExpanded ? 'Skryť' : 'Čítať viac o produkte'}
                </button>
              </div>

              <div className="order-[8] lg:order-[7]">
                <Eyebrow as="h3" className="mb-4 w-full border-t border-brand-line pt-8 text-brand-dark">
                  Technické parametre
                </Eyebrow>
                <div className="mb-8 grid grid-cols-2 gap-3 border-b border-brand-line pb-8 sm:grid-cols-4">
                  {[
                    { label: 'Rozmery', value: product.dimensions, icon: Maximize2 },
                    { label: 'Hrúbka', value: product.thickness, icon: ThicknessIcon },
                    { label: 'Povrch', value: shortFinish(product.finish), icon: getFinishIcon(product.finish) },
                    { label: 'Materiál', value: product.material || 'Sinterovaný kameň', icon: Stone },
                  ].map((spec) => {
                    const Icon = spec.icon;
                    const isMaterial = spec.label === 'Materiál';
                    const inner = (
                      <div key={spec.label} className={`flex flex-col items-center p-2 text-center ${isMaterial ? 'group cursor-pointer' : ''}`}>
                        <Icon size={40} className={`mb-2 text-brand-dark ${isMaterial ? 'transition-colors group-hover:text-brand-muted' : ''}`} />
                        <span className="mb-1 block text-os-eyebrow uppercase text-brand-muted">{spec.label}</span>
                        <span className={`text-xs font-medium text-brand-dark ${isMaterial ? 'underline decoration-brand-dark/30 underline-offset-2 transition-colors group-hover:text-brand-muted' : ''}`}>
                          {spec.value}
                        </span>
                      </div>
                    );
                    if (isMaterial) {
                      return <a key={spec.label} href="/sinterovany-kamen" className="os-press rounded-[3px]">{inner}</a>;
                    }
                    return inner;
                  })}
                </div>
              </div>

              {/* Mobile Image Gallery — horizontal scroll carousel */}
              <div className="order-4 mb-6 lg:hidden">
                <div className="relative">
                  <div
                    ref={mobileGalleryRef}
                    className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide [touch-action:pan-x_pan-y]"
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
                        className="relative aspect-[3/4] w-full flex-shrink-0 snap-center overflow-hidden rounded-[3px] bg-[#F5F5F3]"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={shopifyImageUrl(img, 800)}
                          alt={productImageAlt(product, index)}
                          width={900}
                          height={1200}
                          className="h-full w-full object-cover"
                          srcSet={shopifySrcSet(img)}
                          sizes="100vw"
                          loading={index === 0 ? 'eager' : 'lazy'}
                          fetchPriority={index === 0 ? 'high' : 'auto'}
                        />
                        {index === 0 && product.inStock && (
                          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-[3px] bg-brand-light px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-dark before:h-[7px] before:w-[7px] before:rounded-full before:bg-[#2F8F5B] before:content-['']">
                            Skladom
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-brand-dark shadow-sm backdrop-blur-sm">
                          <ZoomIn size={18} aria-hidden="true" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 pt-3">
                    {(showAllImages ? images : images.slice(0, 4)).map((img, idx) => {
                      const isOverflowTile = !showAllImages && images.length > 4 && idx === 3;
                      const overflowCount = images.length - 3;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (isOverflowTile) {
                              setShowAllImages(true);
                              return;
                            }
                            setSelectedImageIndex(idx);
                            mobileGalleryRef.current?.scrollTo({
                              left: idx * (mobileGalleryRef.current?.clientWidth ?? 0),
                              behavior: reduceMotion ? 'auto' : 'smooth',
                            });
                          }}
                          className={cn(
                            'os-press relative aspect-square overflow-hidden rounded-[3px] bg-[#F5F5F3]',
                            !isOverflowTile && selectedImageIndex === idx ? 'ring-2 ring-brand-dark' : 'ring-1 ring-brand-line',
                          )}
                          aria-label={isOverflowTile ? `Zobraziť ďalších ${overflowCount} obrázkov` : `Obrázok ${idx + 1}`}
                        >
                          <img
                            src={shopifyImageUrl(img, 200)}
                            alt={productImageAlt(product, idx)}
                            width={200}
                            height={200}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          {isOverflowTile && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-base font-medium text-white">
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
                <ProductSwitcher currentProductId={product.id} products={allProducts} />
              </div>

              {product.stockQuantity > 0 && (
                <div className="order-[9] mb-4 text-sm text-brand-muted lg:order-[8]">
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
                {BUNDLE_OPTIONS.find((b) => b.discountPercent > 0) && (
                  <p className="-mt-4 mb-6 text-xs leading-relaxed text-brand-muted">
                    <span className="font-medium text-brand-dark">Tip:</span> Zľava sa automaticky
                    uplatní v košíku od{' '}
                    {BUNDLE_OPTIONS.find((b) => b.discountPercent > 0)!.quantity} platní — aj keď
                    skombinujete rôzne dekory.
                  </p>
                )}
              </div>

              <div className="order-[11] lg:order-[10]">
                <InstallationSelector
                  installationSelected={installationSelected}
                  installationAreaM2={installationAreaM2}
                  onInstallationToggle={onInstallationToggle}
                  onAreaChange={onInstallationAreaChange}
                />
              </div>

              {/* Add to cart + sample. On phones too: while these are on screen the sticky bar steps aside. */}
              <div ref={ctaRef} className="order-[12] mb-8 space-y-3 lg:order-[11]">
                <button
                  type="button"
                  onClick={onAddToCart}
                  aria-busy={isAdding}
                  className={cn(
                    "os-press flex min-h-[56px] w-full items-center justify-center gap-3 rounded-[10px] px-5 text-sm font-semibold uppercase tracking-[0.12em] sm:px-8 sm:tracking-widest",
                    isInCart && !isAdding
                      ? "border border-brand-dark bg-brand-sand text-brand-dark hover:bg-[#E6E3DA]"
                      : "bg-brand-dark text-white hover:bg-black",
                    isAdding && "cursor-wait"
                  )}
                >
                  {addToCartLabel}
                </button>
                {!product.sampleShopifyVariantId ? (
                  <Link
                    to="/vzorky"
                    className="os-press flex min-h-[56px] w-full items-center justify-center gap-3 rounded-[10px] border border-brand-dark px-5 text-sm font-semibold uppercase tracking-[0.12em] text-brand-dark hover:bg-brand-dark/5 sm:px-8 sm:tracking-widest"
                  >
                    <Package size={18} aria-hidden="true" />
                    Objednať vzorku zadarmo
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={onAddSample}
                    aria-disabled={(!isSampleInCart && sampleCount >= MAX_SAMPLES) || undefined}
                    className={cn(
                      "os-press flex min-h-[56px] w-full items-center justify-center gap-3 rounded-[10px] border px-5 text-sm font-semibold uppercase tracking-[0.12em] sm:px-8 sm:tracking-widest",
                      isSampleInCart
                        ? "cursor-default border-brand-dark bg-brand-sand text-brand-dark"
                        : sampleCount >= MAX_SAMPLES
                          ? "cursor-not-allowed border-brand-line text-brand-muted"
                          : "border-brand-dark text-brand-dark hover:bg-brand-dark/5"
                    )}
                  >
                    {isSampleInCart ? (
                      <>
                        <Check size={18} aria-hidden="true" />
                        Vzorka v košíku
                      </>
                    ) : sampleCount >= MAX_SAMPLES ? (
                      <>
                        <Package size={18} aria-hidden="true" />
                        Maximum vzoriek ({MAX_SAMPLES})
                      </>
                    ) : (
                      <>
                        <Package size={18} aria-hidden="true" />
                        Pridať vzorku
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="order-[13] space-y-3 text-sm text-brand-muted lg:order-[12]">
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-brand-dark" aria-hidden="true" />
                  <span>Expedícia do {product.deliveryTimeframe || '5 pracovných dní'} · doprava od 150 € s DPH</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-brand-dark" aria-hidden="true" />
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
          productName={name}
          getOrigin={getLightboxOrigin}
        />
      </Container>
    </section>
  );
};
