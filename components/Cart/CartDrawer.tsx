import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart, formatPrice } from '../../context/CartContext';
import { Button } from '../UI/Button';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, itemCount, subtotal, total, checkoutUrl, isLoading } = useCart();

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
    closeCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[70]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-brand-gold" />
                <h2 className="text-xl font-bold text-brand-dark">
                  Košík
                  {itemCount > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({itemCount} {itemCount === 1 ? 'položka' : itemCount < 5 ? 'položky' : 'položiek'})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-brand-dark mb-2">
                    Váš košík je prázdny
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Prezrite si naše skladové platne a pridajte ich do košíka.
                  </p>
                  <Link to="/shop" onClick={closeCart}>
                    <Button className="bg-brand-gold text-brand-dark hover:bg-brand-dark hover:text-white">
                      Prejsť do obchodu
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <li key={item.id} className="p-4">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-brand-dark truncate">
                            {item.name}
                          </h4>
                          {item.variant && (
                            <p className="text-sm text-gray-500 mt-1">
                              {item.variant}
                            </p>
                          )}
                          <p className="text-sm font-medium text-brand-gold mt-1">
                            {formatPrice(item.price)}
                          </p>

                          {/* Quantity controls */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                                disabled={isLoading}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                                disabled={isLoading}
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              disabled={isLoading}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer - Summary */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4 bg-[#F9F9F7]">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Medzisúčet</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                {/* Shipping info */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Doprava a DPH</span>
                  <span className="text-xs text-gray-400">Vypočíta sa pri platbe</span>
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-200">
                  <span>Medzisúčet</span>
                  <span className="text-brand-gold">{formatPrice(total)}</span>
                </div>

                {/* CTA - Shopify Checkout */}
                <button
                  onClick={handleCheckout}
                  disabled={!checkoutUrl || isLoading}
                  className="w-full bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark py-4 text-base rounded-full font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Načítavam...
                    </>
                  ) : (
                    <>
                      Pokračovať k platbe
                      <ExternalLink size={18} />
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Bezpečná platba cez Shopify
                </p>

                {/* Continue shopping */}
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-gray-500 hover:text-brand-dark transition-colors"
                >
                  Pokračovať v nákupe
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
