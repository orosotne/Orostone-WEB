import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  ArrowLeft, ShoppingBag, Lock, Truck,
  Minus, Plus, Trash2, Package, ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { shopifySized } from '../lib/shopifyImage';
import { useCookies } from '../context/CookieContext';
import { trackMetaEvent, savePendingPurchase } from '../hooks/useMetaPixel';
import { trackGA4BeginCheckout } from '../services/analytics';
import { SEOHead } from '../components/UI/SEOHead';
import { ActionButton, Container, Section, TextLink } from '../components/Design';

// ===========================================
// CHECKOUT PAGE
// ===========================================
// Zobrazuje prehlad kosika a presmeruje na
// Shopify hosted checkout pre platbu/dodanie.

const STEP_BUTTON =
  'grid h-10 w-10 place-items-center transition-colors hover:bg-brand-sand disabled:opacity-40';

export const Checkout = () => {
  const { items, removeItem, updateQuantity, subtotal, total, totalDiscount, subtotalBeforeDiscount, appliedDiscountTitles, itemCount, checkoutUrl, isLoading } = useCart();
  const { preferences } = useCookies();

  // Redirect if cart is empty
  if (itemCount === 0 && !isLoading) {
    return (
      <Section tone="chalk" className="flex min-h-[calc(100dvh-4rem)] items-center lg:min-h-[calc(100dvh-5rem)]">
        <SEOHead title="Košík | OROSTONE" description="Váš nákupný košík." noindex={true} />
        <Container className="grid justify-items-start gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-sand" aria-hidden="true">
            <ShoppingBag size={28} strokeWidth={1.3} className="text-brand-muted" />
          </span>
          <h1 className="text-os-h1">Váš košík je prázdny</h1>
          <p className="text-os-lead font-light text-brand-muted">Pridajte produkty do košíka a pokračujte v nákupe.</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ActionButton to="/kategoria/sintered-stone" arrow>
              Pozrieť dekory
            </ActionButton>
            <TextLink to="/">Prejsť do obchodu</TextLink>
          </div>
        </Container>
      </Section>
    );
  }

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
    <Section tone="chalk" className="!pt-[clamp(40px,5vw,72px)]">
      <SEOHead title="Pokladňa | OROSTONE" description="Dokončite vašu objednávku." noindex={true} />
      <Container>

        {/* Header */}
        <div className="mb-[clamp(32px,4vw,56px)] grid justify-items-start gap-4">
          <Link to="/" className="inline-flex min-h-[44px] items-center gap-2 text-[0.9rem] font-medium text-brand-muted no-underline transition-colors hover:text-brand-dark">
            <ArrowLeft size={16} />
            Späť do obchodu
          </Link>
          <h1 className="text-os-h1">Pokladňa</h1>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">

          {/* Cart Items */}
          <div>
            <h2 className="mb-4 text-os-h3">
              Váš košík <span className="font-light tabular-nums text-brand-muted">({itemCount} {itemCount === 1 ? 'položka' : itemCount < 5 ? 'položky' : 'položiek'})</span>
            </h2>

            <div className="divide-y divide-brand-line border-y border-brand-line">
              {items.map((item) => (
                <m.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-5 py-6"
                >
                  <div className="h-[126px] w-[72px] flex-none overflow-hidden rounded-[2px] bg-brand-sand shadow-[0_0_0_1px_rgba(26,26,26,0.07)]">
                    <img src={shopifySized(item.image, 200)} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold tracking-[0.04em]">{item.name}</h3>
                    {item.variant && (
                      <p className="mt-0.5 text-[0.88rem] font-light text-brand-muted">{item.variant}</p>
                    )}
                    {item.lineDiscount > 0 && item.originalPrice > 0 ? (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 tabular-nums">
                        <span className="text-[0.8rem] text-brand-muted line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                        <span className="text-[0.9rem] font-semibold">
                          {formatPrice(item.price)}
                        </span>
                        <span className="rounded-[3px] bg-brand-dark px-1.5 py-0.5 text-[0.66rem] font-bold tracking-[0.08em] text-brand-light">
                          −{Math.round((item.lineDiscount / (item.originalPrice * item.quantity)) * 100)}%
                        </span>
                      </div>
                    ) : (
                      <p className="mt-1.5 text-[0.9rem] font-medium tabular-nums">{formatPrice(item.price)}</p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center overflow-hidden rounded-[10px] border border-brand-line bg-white/60">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className={STEP_BUTTON}
                          disabled={isLoading}
                          aria-label={`Znížiť počet: ${item.name}`}
                        >
                          <Minus size={15} />
                        </button>
                        <span className="min-w-[2.5rem] text-center text-[0.9rem] font-medium tabular-nums" aria-live="polite">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className={STEP_BUTTON}
                          disabled={isLoading}
                          aria-label={`Zvýšiť počet: ${item.name}`}
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex flex-col items-end font-semibold leading-tight tabular-nums">
                          {item.lineDiscount > 0 && (
                            <span className="text-[0.8rem] font-light text-brand-muted line-through">
                              {formatPrice(item.originalPrice * item.quantity)}
                            </span>
                          )}
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="grid h-11 w-11 place-items-center rounded-full text-brand-muted transition-colors hover:bg-brand-sand hover:text-brand-dark disabled:opacity-40"
                          disabled={isLoading}
                          aria-label={`Odstrániť z košíka: ${item.name}`}
                        >
                          <Trash2 size={17} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </m.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-[3px] bg-brand-sand p-6 sm:p-8 lg:sticky lg:top-28">
            <h3 className="mb-6 text-os-h3">Súhrn objednávky</h3>

            {/* Totals */}
            <div className="space-y-3 text-[0.92rem]">
              <div className="flex justify-between">
                <span className="font-light text-brand-muted">Medzisúčet</span>
                <span className="font-medium tabular-nums">
                  {formatPrice(totalDiscount > 0 ? subtotalBeforeDiscount : subtotal)}
                </span>
              </div>
              {totalDiscount > 0 && subtotalBeforeDiscount > 0 && (
                <div className="flex items-baseline justify-between gap-3 border-y border-brand-dark/10 py-3">
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
              <div className="flex justify-between gap-4">
                <span className="font-light text-brand-muted">Doprava</span>
                <span className="text-right text-[0.84rem]">od 150 EUR s DPH</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-light text-brand-muted">DPH</span>
                <span className="text-right text-[0.84rem] font-light text-brand-muted">potvrdí sa v pokladni</span>
              </div>
              <p className="text-[0.78rem] font-light leading-relaxed text-brand-muted">
                Presná cena dopravy závisí od adresy a počtu platní.
                Montáž nie je súčasťou objednávky.{' '}
                <Link to="/doprava" className="font-medium text-brand-dark underline underline-offset-4">
                  Viac o doprave
                </Link>
              </p>
              <div className="flex items-baseline justify-between border-t border-brand-dark/10 pt-4 text-[1.15rem]">
                <span className="font-semibold">Celkom</span>
                <span className="flex items-baseline gap-2 tabular-nums">
                  {totalDiscount > 0 && (
                    <span className="text-[0.84rem] font-light text-brand-muted line-through">
                      {formatPrice(subtotalBeforeDiscount)}
                    </span>
                  )}
                  <span className="font-semibold">{formatPrice(total)}</span>
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={!checkoutUrl || isLoading}
              className="mt-6 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[10px] bg-brand-dark px-6 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-brand-light transition-colors hover:bg-[#333331] disabled:opacity-50"
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

            <p className="mt-3 text-center text-[0.78rem] font-light leading-relaxed text-brand-muted">
              Budete presmerovaný do zabezpečenej pokladne. Záväzná objednávka s povinnosťou platby vznikne až v poslednom kroku po jej odoslaní.
              Nákupom súhlasíte s{' '}
              <Link to="/vop" className="font-medium text-brand-dark underline underline-offset-4">VOP</Link>.
            </p>

            {/* Trust badges */}
            <ul className="mt-6 space-y-3 border-t border-brand-dark/10 pt-6 text-[0.88rem] font-light">
              <li className="flex items-center gap-2.5">
                <Lock size={16} strokeWidth={1.5} className="flex-none" />
                Zabezpečená platba kartou, Apple Pay alebo Google Pay
              </li>
              <li className="flex items-center gap-2.5">
                <Package size={16} strokeWidth={1.5} className="flex-none" />
                Expedícia do 5 pracovných dní
              </li>
              <li className="flex items-center gap-2.5">
                <Truck size={16} strokeWidth={1.5} className="flex-none" />
                Špeciálna preprava platní po celom Slovensku
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
};
