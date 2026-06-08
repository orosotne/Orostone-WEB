import React, { useState, useMemo, useEffect, startTransition } from 'react';
import { useParams, Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ShopProduct } from '../constants';
import { useShopifyProducts, useShopifyProduct } from '../hooks/useShopifyProducts';
import { Button } from '../components/UI/Button';
import { useCart } from '../context/CartContext';
import { cn, formatPrice } from '../lib/utils';
import { ProductDetailSkeleton } from '../components/UI/Skeleton';
import { useCookies } from '../context/CookieContext';
import { trackMetaEvent } from '../hooks/useMetaPixel';
import { trackGA4ViewItem } from '../services/analytics';
import { SEOHead, createBreadcrumbLD } from '../components/UI/SEOHead';
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
  ProductSchema,
  BUNDLE_OPTIONS,
  INSTALLATION_RATE_PER_M2,
  saveInstallationToStorage,
  calculateSlabPrice,
  type BundleOption,
} from '../components/ProductDetail';
import { MAX_SAMPLES } from '../constants';

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
  const [selectedBundle, setSelectedBundle] = useState<BundleOption>(BUNDLE_OPTIONS[1]);
  const [cartError, setCartError] = useState<string | null>(null);
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

  useEffect(() => {
    if (!product) return;
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
      <div className="min-h-dvh flex items-center justify-center">
        <SEOHead
          title="Produkt nenájdený | OROSTONE"
          description="Požadovaný produkt neexistuje alebo bol odstránený."
          noindex={true}
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Produkt nenájdený</h1>
          <p className="text-gray-600 mb-8">Požadovaný produkt neexistuje alebo bol odstránený.</p>
          <Link to="/">
            <Button variant="primary">
              <ArrowLeft size={16} />
              Späť do obchodu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.shopifyVariantId) {
      const variantId = product.shopifyVariantId;
      const bundleQty = selectedBundle.quantity;
      const installSelected = installationSelected;
      const installArea = installationAreaM2;
      const productId = product.id;
      const productName = product.name;

      startTransition(() => {
        setCartError(null);
        addItem(variantId, bundleQty);

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
    } else {
      console.warn('Produkt nemá shopifyVariantId, nie je možné pridať do košíka:', product.id);
      setCartError('Tento produkt momentálne nie je možné pridať do košíka. Skúste to prosím neskôr.');
      setTimeout(() => setCartError(null), 5000);
    }
  };

  const handleAddSample = () => {
    if (!product.sampleShopifyVariantId) {
      setCartError('Vzorka pre tento produkt nie je momentálne dostupná.');
      setTimeout(() => setCartError(null), 5000);
      return;
    }
    if (isSampleInCart(product.id)) return;
    if (sampleCount >= MAX_SAMPLES) {
      setCartError(`Dosiahli ste maximum ${MAX_SAMPLES} vzoriek. Odoberte niektorú pred pridaním novej.`);
      setTimeout(() => setCartError(null), 5000);
      return;
    }
    setCartError(null);
    addItem(product.sampleShopifyVariantId, 1);
  };

  const metaOverride = PRODUCT_META_OVERRIDE[product.id];
  const seoTitle = metaOverride?.title || product.metaTitle || product.seoTitle || `${product.name} | Veľkoformátové platne | OROSTONE`;
  const seoDescription = metaOverride?.description || product.metaDescription || product.seoDescription || product.description;
  const seoImage = (product.gallery && product.gallery.length > 0 ? product.gallery[0] : product.image) || '/images/logo.png';

  return (
    <div className="min-h-dvh w-full overflow-x-hidden overflow-y-visible bg-white">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={`https://orostone.sk/produkt/${product.id}`}
        ogType="product"
        ogImage={seoImage}
      />

      <AnimatePresence>
        {cartError && (
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl text-sm font-medium sm:max-w-md text-center"
          >
            {cartError}
          </m.div>
        )}
      </AnimatePresence>

      <HeroSection
        key={product.id}
        product={product}
        allProducts={allProducts}
        selectedBundle={selectedBundle}
        onBundleChange={setSelectedBundle}
        onAddToCart={handleAddToCart}
        isInCart={isInCart(product.id)}
        installationSelected={installationSelected}
        installationAreaM2={installationAreaM2}
        onInstallationToggle={setInstallationSelected}
        onInstallationAreaChange={setInstallationAreaM2}
        onAddSample={handleAddSample}
        isSampleInCart={isSampleInCart(product.id)}
        sampleCount={sampleCount}
        onLightboxChange={setIsLightboxOpen}
      />

      <ProductStorySection product={product} />
      <KeyBenefitsSection product={product} />
      <TechnicalOverview product={product} />
      <ApplicationSection product={product} />
      <ResistanceParameters product={product} />
      <LogisticsSection product={product} />
      <ArchitectBlock product={product} />
      <ProductFAQSection product={product} />

      <ProductSchema product={product} totalPrice={calculateSlabPrice(product.pricePerM2, product.dimensions)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createBreadcrumbLD([
          { name: 'OROSTONE', url: 'https://orostone.sk/' },
          { name: 'E-Shop', url: 'https://orostone.sk/' },
          { name: product.name, url: `https://orostone.sk/produkt/${product.id}` },
        ])) }}
      />

      {/* Sticky Add-to-Cart Bottom Bar — mobile only */}
      <div className={cn(
        "fixed left-0 right-0 z-[60] lg:hidden bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 bottom-0",
        (isCartOpen || isLightboxOpen) && "hidden"
      )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">{product.name} • {selectedBundle.quantity} {selectedBundle.quantity === 1 ? 'platňa' : selectedBundle.quantity < 5 ? 'platne' : 'platní'}</p>
              <p className="text-lg font-bold text-brand-dark leading-tight">
                {formatPrice(Math.round(product.pricePerM2 * (1 - selectedBundle.discountPercent / 100) * 100) / 100)}
                <span className="text-xs font-normal text-gray-400 ml-1">/ m² s DPH</span>
                {selectedBundle.discountPercent > 0 && (
                  <span className="text-xs font-normal text-gray-400 ml-1 line-through">{formatPrice(product.pricePerM2)}</span>
                )}
              </p>
              <p className="text-[10px] text-gray-400 leading-tight">Doprava od 150 EUR s DPH</p>
            </div>
            <button
              onClick={handleAddToCart}
              className={cn(
                "flex-shrink-0 h-12 px-5 text-sm font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 rounded-lg",
                isInCart(product.id)
                  ? "bg-emerald-600 text-white"
                  : "bg-brand-dark text-white active:bg-black"
              )}
            >
              {isInCart(product.id) ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  V košíku
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" /></svg>
                  Do košíka
                </>
              )}
            </button>
          </div>
          {!product.sampleShopifyVariantId ? (
            <Link
              to="/vzorky"
              className="w-full h-11 text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 rounded-lg border border-gray-300 text-brand-dark active:border-brand-gold active:text-brand-gold"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Objednať vzorku zadarmo
            </Link>
          ) : (
            <button
              onClick={handleAddSample}
              disabled={sampleCount >= MAX_SAMPLES && !isSampleInCart(product.id)}
              className={cn(
                "w-full h-11 text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 rounded-lg border",
                isSampleInCart(product.id)
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : sampleCount >= MAX_SAMPLES
                    ? "border-gray-200 text-gray-400"
                    : "border-gray-300 text-brand-dark active:border-brand-gold active:text-brand-gold"
              )}
            >
              {isSampleInCart(product.id) ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Vzorka v košíku
                </>
              ) : sampleCount >= MAX_SAMPLES ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  Maximum vzoriek ({MAX_SAMPLES})
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  Objednať vzorku zadarmo
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopProductDetail;
