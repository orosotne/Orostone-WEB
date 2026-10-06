import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ExternalLink, Wrench, Info, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/utils';
import { useCookies } from '../../context/CookieContext';
import { trackMetaEvent, savePendingPurchase } from '../../hooks/useMetaPixel';
import { trackGA4BeginCheckout } from '../../services/analytics';
import { ActionButton, chipClass } from '../Design';

const INSTALLATION_STORAGE_KEY = 'orostone_installation_data';

interface InstallationData {
  installation_selected: boolean;
  installation_area_m2: number;
  installation_price_estimate_vat: number;
  installation_pricing_basis: string;
  installation_disclaimer: string;
  product_id: string;
  product_name: string;
}

const ICON_BUTTON =
  'grid h-11 w-11 flex-none place-items-center rounded-full text-brand-muted transition-colors hover:bg-brand-sand hover:text-brand-dark disabled:opacity-40';
const SMALL_PRINT = 'text-[0.78rem] font-light leading-relaxed text-brand-muted';
const NOTE_BOX = 'flex items-start gap-2.5 rounded-[3px] bg-brand-sand px-3.5 py-3';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, itemCount, subtotal, total, totalDiscount, subtotalBeforeDiscount, appliedDiscountTitles, checkoutUrl, isLoading, error, clearError, productItems, sampleItems } = useCart();
  const { preferences } = useCookies();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Load installation data from localStorage
  const [installationData, setInstallationData] = useState<InstallationData | null>(null);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem(INSTALLATION_STORAGE_KEY);
        setInstallationData(raw ? JSON.parse(raw) : null);
      } catch {
        setInstallationData(null);
      }
    } else {
      setIsSummaryExpanded(false);
    }
  }, [isOpen]);

  // Keyboard: focus lands on the close button, Escape closes the cart, focus then returns to what opened it
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [isOpen, closeCart]);

  const removeInstallation = () => {
    localStorage.removeItem(INSTALLATION_STORAGE_KEY);
    setInstallationData(null);
  };

  const handleCheckout = () => {
    if (checkoutUrl) {
      const ga4Items = items.map(i => ({ item_id: i.variantId, item_name: i.name, price: i.price, quantity: i.quantity }));
      trackMetaEvent('InitiateCheckout', { value: subtotal, currency: 'EUR', num_items: itemCount });
      trackGA4BeginCheckout({ value: subtotal, items: ga4Items });
      savePendingPurchase({
        value: total,
        currency: 'EUR',
        num_items: itemCount,
        content_ids: items.map(i => i.variantId),
        items: ga4Items,
      });
      window.location.href = checkoutUrl;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-brand-dark/45"
            onClick={closeCart}
          />

          {/* Drawer */}
          <m.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-[440px] flex-col bg-brand-light text-brand-dark shadow-[-24px_0_60px_-30px_rgba(26,26,26,0.45)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-brand-line py-3 pl-6 pr-3">
              <h2 id="cart-title" className="text-[1.3rem] font-semibold">
                Košík
                {itemCount > 0 && (
                  <span className="ml-2 text-[0.88rem] font-light tabular-nums text-brand-muted">
                    {itemCount} {itemCount === 1 ? 'položka' : itemCount < 5 ? 'položky' : 'položiek'}
                  </span>
                )}
              </h2>
              <button ref={closeButtonRef} type="button" onClick={closeCart} className={ICON_BUTTON} aria-label="Zavrieť košík">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div role="alert" className="mx-4 mt-3 flex items-start justify-between gap-2 rounded-[3px] border border-[#B42318]/25 bg-[#FEF3F2] py-2 pl-3.5 pr-1">
                <p className="py-1 text-[0.88rem] text-[#B42318]">{error}</p>
                <button
                  type="button"
                  onClick={clearError}
                  className="grid h-8 w-8 flex-none place-items-center rounded-full text-[#B42318]/70 hover:text-[#B42318]"
                  aria-label="Zavrieť chybovú správu"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-brand-sand">
                    <ShoppingBag size={30} strokeWidth={1.3} className="text-brand-muted" />
                  </div>
                  <h3 className="mb-2 text-os-h3">
                    Váš košík je prázdny
                  </h3>
                  <p className="mb-7 font-light text-brand-muted">
                    Prezrite si naše skladové platne a pridajte ich do košíka.
                  </p>
                  <ActionButton to="/kategoria/sintered-stone" onClick={closeCart} arrow>
                    Prezrieť produkty
                  </ActionButton>
                  <div className="mt-10 w-full">
                    <p className="mb-3 text-os-eyebrow uppercase text-brand-muted">Populárne kategórie</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[
                        { label: 'Biele dekory', to: '/kategoria/sintered-stone/biele' },
                        { label: 'Šedé dekory', to: '/kategoria/sintered-stone/sede' },
                        { label: 'Béžové dekory', to: '/kategoria/sintered-stone/bezove' },
                        { label: 'Čierne dekory', to: '/kategoria/sintered-stone/cierne' },
                      ].map(({ label, to }) => (
                        <Link key={to} to={to} onClick={closeCart} className={chipClass(false)}>
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* ---- Products Section ---- */}
                  {productItems.length > 0 && (
                    <ul className="divide-y divide-brand-line">
                      {productItems.map((item) => (
                        <li key={item.id} className="px-6 py-5">
                          <div className="flex gap-4">
                            {/* Image: the slab stands upright, as in the catalog */}
                            <div className="h-[112px] w-16 flex-none overflow-hidden rounded-[2px] bg-brand-sand shadow-[0_0_0_1px_rgba(26,26,26,0.07)]">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-[0.95rem] font-semibold tracking-[0.04em]">
                                {item.name}
                              </h3>
                              {item.variant && (
                                <p className="mt-0.5 text-[0.84rem] font-light text-brand-muted">
                                  {item.variant}
                                </p>
                              )}
                              {item.lineDiscount > 0 && item.originalPrice > 0 ? (
                                <div className="mt-1.5 flex flex-wrap items-center gap-2 tabular-nums">
                                  <span className="text-[0.8rem] text-brand-muted line-through">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                  <span className="font-semibold">
                                    {formatPrice(item.price)}
                                  </span>
                                  <span className="rounded-[3px] bg-brand-dark px-1.5 py-0.5 text-[0.66rem] font-bold tracking-[0.08em] text-brand-light">
                                    −{Math.round((item.lineDiscount / (item.originalPrice * item.quantity)) * 100)}%
                                  </span>
                                </div>
                              ) : (
                                <p className="mt-1.5 font-semibold tabular-nums">
                                  {formatPrice(item.price)}
                                </p>
                              )}

                              {/* Quantity controls */}
                              <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center rounded-[10px] border border-brand-line bg-white/60">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="grid h-10 w-10 place-items-center rounded-l-[10px] transition-colors hover:bg-brand-sand disabled:opacity-40"
                                    disabled={isLoading}
                                    aria-label={`Znížiť počet: ${item.name}`}
                                  >
                                    <Minus size={15} />
                                  </button>
                                  <span className="min-w-[2.5rem] text-center text-[0.9rem] font-medium tabular-nums" aria-live="polite">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="grid h-10 w-10 place-items-center rounded-r-[10px] transition-colors hover:bg-brand-sand disabled:opacity-40"
                                    disabled={isLoading}
                                    aria-label={`Zvýšiť počet: ${item.name}`}
                                  >
                                    <Plus size={15} />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className={ICON_BUTTON}
                                  disabled={isLoading}
                                  aria-label={`Odstrániť z košíka: ${item.name}`}
                                >
                                  <Trash2 size={17} strokeWidth={1.5} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* ---- Samples (Vzorky) Section ---- */}
                  {sampleItems.length > 0 && (
                    <div className="border-t border-brand-line">
                      {/* Section Header */}
                      <div className="flex items-center gap-2 px-6 pb-1 pt-5">
                        <h3 className="text-os-eyebrow uppercase text-brand-muted">
                          Vzorky materiálu
                        </h3>
                        <span className="text-[0.78rem] font-medium tabular-nums text-brand-muted">
                          {sampleItems.length}×
                        </span>
                      </div>

                      {/* Sample Items (compact, no quantity controls) */}
                      <ul className="divide-y divide-brand-line/70">
                        {sampleItems.map((item) => (
                          <li key={item.id} className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              {/* Small image */}
                              <div className="h-14 w-14 flex-none overflow-hidden rounded-[2px] bg-brand-sand">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              {/* Info */}
                              <div className="min-w-0 flex-1">
                                <h4 className="truncate text-[0.9rem] font-medium">
                                  {item.name}
                                </h4>
                                <p className="mt-0.5 text-[0.78rem] font-light text-brand-muted">
                                  {item.variant}
                                </p>
                                <p className="mt-0.5 text-[0.78rem] font-medium tabular-nums">
                                  Záloha {formatPrice(item.price)}
                                </p>
                              </div>

                              {/* Remove */}
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className={ICON_BUTTON}
                                disabled={isLoading}
                                aria-label={`Odstrániť vzorku: ${item.name}`}
                              >
                                <Trash2 size={16} strokeWidth={1.5} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {/* Deposit info */}
                      <div className="flex items-start gap-2 px-6 pb-4 pt-2">
                        <Info size={14} className="mt-0.5 flex-none text-brand-muted" />
                        <p className={SMALL_PRINT}>
                          Zálohu za vzorku vám vrátime po objednávke plného produktu.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Installation service addon (visual-only, not a Shopify item) */}
                  {installationData && installationData.installation_selected && (
                    <div className="border-t border-brand-line">
                      <div className="px-6 py-5">
                        <div className="flex gap-4">
                          {/* Icon */}
                          <div className="grid h-16 w-16 flex-none place-items-center rounded-[3px] bg-brand-sand">
                            <Wrench size={24} strokeWidth={1.4} className="text-brand-dark" />
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate text-[0.95rem] font-semibold">
                                Montáž & inštalácia
                              </h3>
                              <span className="flex-none rounded-[3px] border border-brand-line px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-brand-muted">
                                Služba
                              </span>
                            </div>
                            {installationData.installation_area_m2 > 0 ? (
                              <>
                                <p className="mt-1 text-[0.84rem] font-light text-brand-muted">
                                  Sprostredkovaná služba • {installationData.installation_area_m2} m²
                                </p>
                                <p className="mt-1 font-semibold tabular-nums">
                                  {formatPrice(installationData.installation_price_estimate_vat)}
                                  <span className="ml-1 text-[0.78rem] font-light text-brand-muted">s DPH</span>
                                </p>
                                <p className="mt-1 text-[0.78rem] font-light text-brand-muted">
                                  Orientačná cena – potvrdí sa po zameraní
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="mt-1 text-[0.84rem] font-light text-brand-muted">
                                  Sprostredkovaná služba • plocha na dohodnutie
                                </p>
                                <p className="mt-1 text-[0.78rem] font-light text-brand-muted">
                                  Budeme vás kontaktovať o ďalšom postupe
                                </p>
                              </>
                            )}

                            <div className="mt-1 flex items-center justify-end">
                              <button
                                type="button"
                                onClick={removeInstallation}
                                className={ICON_BUTTON}
                                aria-label="Odstrániť montáž z košíka"
                              >
                                <Trash2 size={17} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Important notice: installation is not included in Shopify checkout */}
                        <div className={`mt-3 ${NOTE_BOX}`}>
                          <Info size={14} className="mt-0.5 flex-none text-brand-muted" />
                          <p className={SMALL_PRINT}>
                            <span className="font-semibold text-brand-dark">Upozornenie:</span> Montáž nie je súčasťou Shopify objednávky. Po prijatí platby vás náš tím kontaktuje a dohodne detaily montáže.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer - Collapsible Summary */}
            {items.length > 0 && (
              <div className="border-t border-brand-line bg-brand-light pb-[env(safe-area-inset-bottom,0px)]">

                {/* Toggle handle */}
                <button
                  type="button"
                  onClick={() => setIsSummaryExpanded(prev => !prev)}
                  aria-expanded={isSummaryExpanded}
                  aria-controls="cart-summary-details"
                  className="flex min-h-[44px] w-full items-center justify-center gap-1.5 px-6 pt-2 text-[0.8rem] font-medium text-brand-muted transition-colors hover:text-brand-dark"
                >
                  <m.span
                    animate={{ rotate: isSummaryExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    <ChevronUp size={16} />
                  </m.span>
                  {isSummaryExpanded ? 'Skryť detail' : 'Zobraziť detail objednávky'}
                </button>

                {/* Expandable details */}
                <AnimatePresence initial={false}>
                  {isSummaryExpanded && (
                    <m.div
                      id="cart-summary-details"
                      key="summary-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 px-6 pb-3 pt-2">
                        {/* Product subtotal (shown when both products and samples exist) */}
                        {productItems.length > 0 && sampleItems.length > 0 && (
                          <div className="flex justify-between text-[0.9rem]">
                            <span className="font-light text-brand-muted">Produkty</span>
                            <span className="font-medium tabular-nums">
                              {formatPrice(productItems.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                            </span>
                          </div>
                        )}

                        {/* Sample subtotal (shown when both products and samples exist) */}
                        {productItems.length > 0 && sampleItems.length > 0 && (
                          <div className="flex justify-between text-[0.9rem]">
                            <span className="font-light text-brand-muted">Vzorky (záloha)</span>
                            <span className="font-medium tabular-nums">
                              {formatPrice(sampleItems.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                            </span>
                          </div>
                        )}

                        {/* Subtotal (when only one type) */}
                        {!(productItems.length > 0 && sampleItems.length > 0) && (
                          <div className="flex justify-between text-[0.9rem]">
                            <span className="font-light text-brand-muted">Medzisúčet</span>
                            <span className="font-medium tabular-nums">
                              {formatPrice(totalDiscount > 0 ? subtotalBeforeDiscount : subtotal)}
                            </span>
                          </div>
                        )}

                        {/* Bundle discount */}
                        {totalDiscount > 0 && subtotalBeforeDiscount > 0 && (
                          <div className="flex items-baseline justify-between gap-3 border-y border-brand-line py-3">
                            <div className="min-w-0">
                              <span className="font-semibold">
                                Ušetríte {Math.round((totalDiscount / subtotalBeforeDiscount) * 100)}%
                              </span>
                              {appliedDiscountTitles[0] && (
                                <p className="mt-0.5 truncate text-[0.78rem] font-light text-brand-muted">
                                  {appliedDiscountTitles[0]}
                                </p>
                              )}
                            </div>
                            <span className="font-semibold tabular-nums">
                              −{formatPrice(totalDiscount)}
                            </span>
                          </div>
                        )}

                        {/* Shipping info */}
                        <div className="flex justify-between text-[0.9rem]">
                          <span className="font-light text-brand-muted">Doprava</span>
                          <span className="text-right text-[0.84rem]">
                            od 150 EUR s DPH
                          </span>
                        </div>
                        <p className={SMALL_PRINT}>
                          Presná cena sa potvrdí v pokladni podľa adresy a počtu platní.{' '}
                          <Link to="/doprava" onClick={closeCart} className="font-medium text-brand-dark underline underline-offset-4">
                            Viac o doprave
                          </Link>
                        </p>

                        {/* Return cost notice — required by § 3 ods. 1 písm. i) zákona č. 108/2024 Z.z. */}
                        <div className={NOTE_BOX}>
                          <Info size={14} className="mt-0.5 flex-none text-brand-muted" />
                          <p className={SMALL_PRINT}>
                            <span className="font-semibold text-brand-dark">Náklady na vrátenie tovaru</span> pri odstúpení od zmluvy znáša kupujúci.
                            Orientačná cena spätného odvozu: <span className="font-semibold text-brand-dark">od 150 EUR</span> (Bratislava) / <span className="font-semibold text-brand-dark">od 350 EUR</span> (SR).{' '}
                            <Link to="/reklamacie" onClick={closeCart} className="font-medium text-brand-dark underline underline-offset-4">
                              Viac info
                            </Link>
                          </p>
                        </div>

                        <p className={`${SMALL_PRINT} text-center`}>
                          Budete presmerovaný do zabezpečenej pokladne. Záväzná objednávka s povinnosťou platby vznikne až v poslednom kroku po jej odoslaní.
                        </p>

                        {/* Continue shopping */}
                        <button
                          type="button"
                          onClick={closeCart}
                          className="mx-auto block min-h-[44px] text-[0.9rem] font-medium underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-70"
                        >
                          Pokračovať v nákupe
                        </button>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>

                {/* Always-visible bar: Total + Checkout CTA */}
                <div className="space-y-3.5 px-6 pb-6 pt-3">
                  {/* Total */}
                  <div className="flex items-baseline justify-between text-[1.15rem] font-semibold">
                    <span>Celkom</span>
                    <span className="flex items-baseline gap-2 tabular-nums">
                      {totalDiscount > 0 && (
                        <span className="text-[0.84rem] font-light text-brand-muted line-through">
                          {formatPrice(subtotalBeforeDiscount)}
                        </span>
                      )}
                      <span>{formatPrice(total)}</span>
                      {/* Compact discount badge when collapsed */}
                      {!isSummaryExpanded && totalDiscount > 0 && (
                        <span className="ml-1 rounded-[3px] bg-brand-dark px-1.5 py-0.5 text-[0.66rem] font-bold text-brand-light">
                          −{formatPrice(totalDiscount)}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* CTA - Shopify Checkout */}
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={!checkoutUrl || isLoading}
                    className="flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[10px] bg-brand-dark px-6 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-brand-light transition-colors hover:bg-[#333331] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-light border-t-transparent" />
                        Načítavam...
                      </>
                    ) : (
                      <>
                        Prejsť do pokladne
                        <ExternalLink size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};
