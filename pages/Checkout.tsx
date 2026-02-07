import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ShoppingBag, Lock, Truck,
  Minus, Plus, Trash2, Package, ExternalLink
} from 'lucide-react';
import { useCart, formatPrice } from '../context/CartContext';
import { Button } from '../components/UI/Button';

// ===========================================
// CHECKOUT PAGE
// ===========================================
// Zobrazuje prehlad kosika a presmeruje na
// Shopify hosted checkout pre platbu/dodanie.

export const Checkout = () => {
  const { items, removeItem, updateQuantity, subtotal, total, itemCount, checkoutUrl, isLoading } = useCart();

  // Redirect if cart is empty
  if (itemCount === 0 && !isLoading) {
    return (
      <main className="min-h-screen bg-[#F9F9F7] pt-32 pb-24">
        <div className="container mx-auto px-6 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Váš košík je prázdny</h1>
          <p className="text-gray-500 mb-8">Pridajte produkty do košíka a pokračujte v nákupe.</p>
          <Link to="/shop">
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
      window.location.href = checkoutUrl;
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F7] pt-32 pb-24">
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
                <motion.div
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
                    <p className="text-sm font-medium text-brand-gold mt-1">{formatPrice(item.price)}</p>
                    
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
                        <span className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
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
                </motion.div>
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
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Doprava a DPH</span>
                  <span className="text-gray-400 text-xs">Vypočíta sa v ďalšom kroku</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100 text-lg">
                  <span className="font-bold text-brand-dark">Medzisúčet</span>
                  <span className="font-bold text-brand-gold">{formatPrice(total)}</span>
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
                    Pokračovať k platbe
                    <ExternalLink size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Budete presmerovaný na bezpečnú pokladňu Shopify
              </p>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package size={16} className="text-green-500" />
                  Expedícia do 5 pracovných dní
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Lock size={16} className="text-green-500" />
                  Bezpečná platba cez Shopify
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Truck size={16} className="text-green-500" />
                  Doprava po celom Slovensku
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
