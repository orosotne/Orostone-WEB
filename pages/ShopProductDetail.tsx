import React, { useState, useMemo, useEffect, useRef, useCallback, startTransition } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, ShoppingBag } from 'lucide-react';
import { useShopifyProducts, useShopifyProduct } from '../hooks/useShopifyProducts';
import { useCart } from '../context/CartContext';
import { cn, formatPrice } from '../lib/utils';
import { ProductDetailSkeleton } from '../components/UI/Skeleton';
import { useCookies } from '../context/CookieContext';
import { trackMetaEvent } from '../hooks/useMetaPixel';
import { trackGA4ViewItem } from '../services/analytics';
import { SEOHead } from '../components/UI/SEOHead';
import { PRODUCT_META_OVERRIDE } from '../data/productMetaOverride';
import {
  HeroSection,
  ProductStorySection,
  KeyBenefitsSection,
  TechnicalOverview,
  ApplicationSection,
  ResistanceParameters,
  LogisticsSection,
  ArchitectBlock,
  ProductFAQSection,
  BUNDLE_OPTIONS,
  INSTALLATION_RATE_PER_M2,
  saveInstallationToStorage,
  calculateSlabPrice,
  type BundleOption,
  type LightTone,
} from '../components/ProductDetail';
import { MAX_SAMPLES } from '../constants';
import { ActionButton, GoldBand } from '../components/Design';
import { Toast } from '../components/UI/Toast';

export const ShopProductDetail: React.FC = () => {
  const { id } = useParams();
  const { addItem, isInCart, sampleCount, isSampleInCart, isOpen: isCartOpen } = useCart();
  const { hasConsented } = useCookies();
  const { products: allProducts, isLoading: productsLoading } = useShopifyProducts();

  const cachedProduct = useMemo(
    () => allProducts.find(p => p.id === id) ?? null,
    [allProducts, id]
  );

  const { product: shopifyProduct, isLoading: productLoading } = useShopifyProduct(id, cachedProduct);
  const [selectedBundle, setSelectedBundle] = useState<BundleOption>(BUNDLE_OPTIONS[0]);
  const [cartError, setCartError] = useState<string | null>(null);
  const clearCartError = useCallback(() => setCartError(null), []);
  const [isAdding, setIsAdding] = useState(false);
  // The hero's add-to-cart buttons are on screen: the mobile sticky bar steps aside (starts hidden, slides in)
  const [ctaVisible, setCtaVisible] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [installationSelected, setInstallationSelected] = useState(false);
  const [installationAreaM2, setInstallationAreaM2] = useState<number | null>(null);

  const product = useMemo(() => {
    if (!shopifyProduct) return null;
    if (shopifyProduct.shopifyVariantId) return shopifyProduct;

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-záčďéíľňóŕšťúýž0-9]/g, '');
    const targetName = normalize(shopifyProduct.name);

    const shopifyMatch = allProducts.find(p => {
      if (!p.shopifyVariantId) return false;
      const shopifyName = normalize(p.name);
      return shopifyName.includes(targetName) || targetName.includes(shopifyName);
    });

    if (shopifyMatch) {
      return {
        ...shopifyProduct,
        shopifyVariantId: shopifyMatch.shopifyVariantId,
        sampleShopifyVariantId: shopifyMatch.sampleShopifyVariantId,
        inStock: shopifyMatch.inStock,
      };
    }

    return shopifyProduct;
  }, [shopifyProduct, allProducts]);

  const isLoading = productLoading && !product;

  // The product object is rebuilt when live Shopify data replaces the fallback, so track each product once.
  const trackedProductId = useRef<string | null>(null);
  useEffect(() => {
    if (!product || trackedProductId.current === product.id) return;
    trackedProductId.current = product.id;
    const price = calculateSlabPrice(product.pricePerM2, product.dimensions);
    trackMetaEvent('ViewContent', {
      content_ids: [product.shopifyVariantId ?? product.id],
      content_type: 'product',
      value: price,
      currency: 'EUR',
    });
    trackGA4ViewItem({ id: product.shopifyVariantId ?? product.id, name: product.name, price });
  }, [product]);

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <SEOHead
          title="Produkt nenájdený | OROSTONE"
          description="Požadovaný produkt neexistuje alebo bol odstránený."
          noindex={true}
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Produkt nenájdený</h1>
          <p className="text-brand-muted mb-8">Požadovaný produkt neexistuje alebo bol odstránený.</p>
          <ActionButton to="/">
            <ArrowLeft size={16} aria-hidden="true" />
            Späť do obchodu
          </ActionButton>
        </div>
      </div>
    );
  }

  // The button answers at once („Pridávam…") and ignores further taps until Shopify replied: adding a slab is not
  // idempotent, a second tap would add a second ~1 700 € slab.
  const handleAddToCart = async () => {
    if (isAdding) return;
    if (product.shopifyVariantId) {
      const variantId = product.shopifyVariantId;
      const bundleQty = selectedBundle.quantity;
      const installSelected = installationSelected;
      const installArea = installationAreaM2;
      const productId = product.id;
      const productName = product.name;

      setIsAdding(true);
      const added = addItem(variantId, bundleQty);
      startTransition(() => {
        setCartError(null);

        if (installSelected) {
          const hasArea = installArea !== null && installArea >= 0.1;
          const installationPrice = hasArea ? Math.round(installArea! * INSTALLATION_RATE_PER_M2) : 0;
          saveInstallationToStorage({
            installation_selected: true,
            installation_area_m2: hasArea ? installArea! : 0,
            installation_price_estimate_vat: installationPrice,
            installation_pricing_basis: hasArea ? '279 EUR per m2 VAT incl' : 'to be confirmed after site visit',
            installation_disclaimer: 'estimated; confirmed after site visit; brokerage only',
            product_id: productId,
            product_name: productName,
          });
        } else {
          saveInstallationToStorage(null);
        }
      });
      try {
        await added;
      } finally {
        setIsAdding(false);
      }
    } else {
      console.warn('Produkt nemá shopifyVariantId, nie je možné pridať do košíka:', product.id);
      setCartError('Tento produkt momentálne nie je možné pridať do košíka. Skúste to prosím neskôr.');
    }
  };

  const handleAddSample = () => {
    if (!product.sampleShopifyVariantId) {
      setCartError('Vzorka pre tento produkt nie je momentálne dostupná.');
      return;
    }
    if (isSampleInCart(product.id)) return;
    if (sampleCount >= MAX_SAMPLES) {
      setCartError(`Dosiahli ste maximum ${MAX_SAMPLES} vzoriek. Odoberte niektorú pred pridaním novej.`);
      return;
    }
    setCartError(null);
    addItem(product.sampleShopifyVariantId, 1);
  };

  const metaOverride = PRODUCT_META_OVERRIDE[product.id];
  const seoTitle = metaOverride?.title || product.metaTitle || product.seoTitle || `${product.name} | Veľkoformátové platne | OROSTONE`;
  const seoDescription = metaOverride?.description || product.metaDescription || product.seoDescription || product.description;
  const seoImage = (product.gallery && product.gallery.length > 0 ? product.gallery[0] : product.image) || '/images/logo.png';

  // Light bands alternate under the chalk hero, so two neighbours never share a background (STYLE_GUIDE › Layout)
  const toneQueue: LightTone[] = [];
  const nextTone = (): LightTone => {
    const tone: LightTone = toneQueue.length % 2 === 0 ? 'sand' : 'chalk';
    toneQueue.push(tone);
    return tone;
  };
  const storyTone = product.richDescription || product.designInsight ? nextTone() : 'sand';
  const benefitsTone = product.keyBenefits?.length ? nextTone() : 'chalk';
  const technicalTone = nextTone();
  const applicationTone = nextTone();
  const logisticsTone = nextTone();
  const architectTone = nextTone();
  const faqTone = nextTone();

  const bundlePricePerM2 = Math.round(product.pricePerM2 * (1 - selectedBundle.discountPercent / 100) * 100) / 100;
  const bundleTotal = Math.round(
    calculateSlabPrice(product.pricePerM2, product.dimensions) * selectedBundle.quantity * (1 - selectedBundle.discountPercent / 100) * 100,
  ) / 100;
  const quantityLabel = `${selectedBundle.quantity} ${selectedBundle.quantity === 1 ? 'platňa' : selectedBundle.quantity < 5 ? 'platne' : 'platní'}`;
  const showStickyBar = !ctaVisible && !isCartOpen && !isLightboxOpen;
  const inCart = isInCart(product.id);

  return (
    // overflow-x-clip, not hidden: hidden would make this a scroll container and break the sticky gallery
    <div className="min-h-svh w-full overflow-x-clip bg-brand-light">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={`https://orostone.sk/produkt/${product.id}`}
        ogType="product"
        ogImage={seoImage}
      />

      <Toast message={cartError} onClose={clearCartError} />

      <HeroSection
        key={product.id}
        product={product}
        allProducts={allProducts}
        selectedBundle={selectedBundle}
        onBundleChange={setSelectedBundle}
        onAddToCart={handleAddToCart}
        isAdding={isAdding}
        isInCart={inCart}
        installationSelected={installationSelected}
        installationAreaM2={installationAreaM2}
        onInstallationToggle={setInstallationSelected}
        onInstallationAreaChange={setInstallationAreaM2}
        onAddSample={handleAddSample}
        isSampleInCart={isSampleInCart(product.id)}
        sampleCount={sampleCount}
        onLightboxChange={setIsLightboxOpen}
        onCtaVisibilityChange={setCtaVisible}
      />

      <ProductStorySection product={product} tone={storyTone} />
      <KeyBenefitsSection product={product} tone={benefitsTone} />
      <TechnicalOverview product={product} tone={technicalTone} />
      <ApplicationSection product={product} tone={applicationTone} />
      <ResistanceParameters product={product} />
      <LogisticsSection product={product} tone={logisticsTone} />
      <ArchitectBlock product={product} tone={architectTone} />
      <ProductFAQSection product={product} tone={faqTone} />
      <GoldBand od="produkt" dekor={product.id} title="Potrebujete dosku na mieru?" />

      {/* Sticky add-to-cart bar, phones only: one row (price + button). It shows while the hero's buttons are off
          screen and slides away when they scroll into view, so the two never compete. The sample stays in the hero. */}
      <div
        className={cn(
          'os-glass fixed inset-x-0 bottom-0 z-[60] border-t border-brand-line px-4 pb-[calc(10px+env(safe-area-inset-bottom,0px))] pt-2.5 shadow-[0_-10px_30px_-18px_rgba(26,26,26,0.35)] transition-transform duration-300 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none lg:hidden',
          showStickyBar ? 'translate-y-0' : 'translate-y-[110%]',
        )}
        aria-hidden={!showStickyBar}
        // inert while slid away: its button must not be reachable by Tab or a screen reader
        inert={!showStickyBar}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold leading-tight tabular-nums text-brand-dark">
              {formatPrice(bundlePricePerM2)}
              <span className="ml-1 text-xs font-normal text-brand-muted">/ m² s DPH</span>
            </p>
            <p className="truncate text-xs tabular-nums text-brand-muted">
              {quantityLabel} · spolu {formatPrice(bundleTotal)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            aria-busy={isAdding}
            className={cn(
              'os-press flex h-12 flex-shrink-0 items-center justify-center gap-2 rounded-[10px] px-5 text-sm font-semibold uppercase tracking-wider',
              inCart && !isAdding ? 'border border-brand-dark bg-brand-sand text-brand-dark' : 'bg-brand-dark text-white',
              isAdding && 'cursor-wait',
            )}
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Pridávam…
              </>
            ) : inCart ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                V košíku
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Do košíka
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopProductDetail;
