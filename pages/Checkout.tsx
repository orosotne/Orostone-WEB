import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ShoppingBag, Lock, Truck,
  Minus, Plus, Trash2, Package, ExternalLink, Check
} from 'lucide-react';
import { useCart, formatPrice } from '../context/CartContext';
import { useCookies } from '../context/CookieContext';
import { trackMetaEvent, savePendingPurchase } from '../hooks/useMetaPixel';
import { trackGA4BeginCheckout } from '../hooks/useGA4Ecommerce';
import { SEOHead } from '../components/UI/SEOHead';
import { Button } from '../components/UI/Button';

// ===========================================
// CHECKOUT PAGE
// ===========================================
// Zobrazuje prehlad kosika a presmeruje na
// Shopify hosted checkout pre platbu/dodanie.

export const Checkout = () => {
  const { items, removeItem, updateQuantity, subtotal, total, totalDiscount, subtotalBeforeDiscount, appliedDiscountTitles, itemCount, checkoutUrl, isLoading } = useCart();
  const { preferences } = useCookies();

  // Redirect if cart is empty
  if (itemCount === 0 && !isLoading) {
    return (
      <main className="min-h-dvh bg-[#F9F9F7] pt-32 pb-24">
        <SEOHead title="Košík | OROSTONE" description="Váš nákupný košík." noindex={true} />
        <div className="container mx-auto px-6 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Váš košík je prázdny</h1>
          <p className="text-gray-500 mb-8">Pridajte produkty do košíka a pokračujte v nákupe.</p>
          <Link to="/">
            <Button className="bg-brand-dark text-white px-8 py-4 rounded-full hover:bg-brand-gold hover:text-brand-dark">
              Prejsť do obchodu
            </Button>
          </Link>
        </div>
      </main>
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
    <main className="min-h-dvh bg-[#F9F9F7] pt-32 pb-24">
      <SEOHead title="Pokladňa | OROSTONE" description="Dokončite vašu objednávku." noindex={true} />
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-dark mb-4">
            <ArrowLeft size={16} />
            Späť do obchodu
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">Pokladňa</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-brand-dark mb-6">
              Váš košík ({itemCount} {itemCount === 1 ? 'položka' : itemCount < 5 ? 'položky' : 'položiek'})
            </h2>
            
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {items.map((item) => (
                <m.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-4 p-6 border-b border-gray-100 last:border-0"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-brand-dark">{item.name}</h3>
                    {item.variant && (
                      <p className="text-sm text-gray-500 mt-1">{item.variant}</p>
                    )}
                    {item.lineDiscount > 0 && item.originalPrice > 0 ? (
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs line-through text-gray-400">
                          {formatPrice(item.originalPrice)}
                        </span>
                        <span className="text-sm font-semibold text-emerald-700">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          −{Math.round((item.lineDiscount / (item.originalPrice * item.quantity)) * 100)}%
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-brand-gold mt-1">{formatPrice(item.price)}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={isLoading}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={isLoading}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold flex flex-col items-end leading-tight">
                          {item.lineDiscount > 0 && (
                            <span className="text-xs line-through text-gray-400 font-normal">
                              {formatPrice(item.originalPrice * item.quantity)}
                            </span>
                          )}
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          disabled={isLoading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </m.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32">
              <h3 className="font-bold text-lg text-brand-dark mb-6">Súhrn objednávky</h3>

              {/* Totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Medzisúčet</span>
                  <span className="font-medium">
                    {formatPrice(totalDiscount > 0 ? subtotalBeforeDiscount : subtotal)}
                  </span>
                </div>
                {totalDiscount > 0 && subtotalBeforeDiscount > 0 && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-bold text-emerald-900">
                          Ušetríte {Math.round((totalDiscount / subtotalBeforeDiscount) * 100)}%
                        </span>
                        <span className="text-base font-bold text-emerald-700">
                          −{formatPrice(totalDiscount)}
                        </span>
                      </div>
                      {appliedDiscountTitles[0] && (
                        <p className="text-[11px] text-emerald-700/80 mt-0.5 truncate">
                          {appliedDiscountTitles[0]}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Doprava</span>
                  <span className="text-gray-500 text-xs text-right">od 150 EUR s DPH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">DPH</span>
                  <span className="text-gray-400 text-xs">potvrdí sa v pokladni</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Presná cena dopravy závisí od adresy a počtu platní.
                  Pri 3 a viac platniach doprava zadarmo.
                  Montáž nie je súčasťou objednávky.{' '}
                  <Link to="/doprava" className="text-brand-gold hover:underline">
                    Viac o doprave
                  </Link>
                </p>
                <div className="flex justify-between items-baseline pt-3 border-t border-gray-100 text-lg">
                  <span className="font-bold text-brand-dark">Celkom</span>
                  <span className="flex items-baseline gap-2">
                    {totalDiscount > 0 && (
                      <span className="text-sm line-through text-gray-400 font-normal">
                        {formatPrice(subtotalBeforeDiscount)}
                      </span>
                    )}
                    <span className="font-bold text-brand-gold">{formatPrice(total)}</span>
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={!checkoutUrl || isLoading}
                className="w-full mt-6 bg-brand-gold text-brand-dark px-8 py-4 rounded-full font-semibold hover:bg-brand-dark hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin w-5 h-5 border-2 border-brand-dark border-t-transparent rounded-full" />
                    Načítavam...
                  </>
                ) : (
                  <>
                    Prejsť do pokladne
                    <ExternalLink size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Budete presmerovaný do zabezpečenej pokladne. Záväzná objednávka s povinnosťou platby vznikne až v poslednom kroku po jej odoslaní.
                Nákupom súhlasíte s{' '}
                <Link to="/vop" className="text-brand-gold hover:underline">VOP</Link>.
              </p>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Lock size={16} className="text-green-500 flex-shrink-0" />
                  Zabezpečená platba kartou, Apple Pay alebo Google Pay
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package size={16} className="text-green-500 flex-shrink-0" />
                  Expedícia do 5 pracovných dní
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Truck size={16} className="text-green-500 flex-shrink-0" />
                  Špeciálna preprava platní po celom Slovensku
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
