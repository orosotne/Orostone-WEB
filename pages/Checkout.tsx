import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ShoppingBag, Truck, CreditCard, Check,
  User, Mail, Phone, MapPin, Building, Lock, AlertCircle, CheckCircle,
  Minus, Plus, Trash2, Package
} from 'lucide-react';
import { useCart, formatPrice, SHIPPING_COST, calculateTotal } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI/Button';
import { cn } from '@/lib/utils';
import { shippingSchema, extractFieldErrors } from '@/lib/validations';

// ===========================================
// TYPES
// ===========================================

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  note?: string;
}

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

// ===========================================
// STEPS CONFIG
// ===========================================

const STEPS: { id: CheckoutStep; label: string; icon: React.ReactNode }[] = [
  { id: 'cart', label: 'Košík', icon: <ShoppingBag size={18} /> },
  { id: 'shipping', label: 'Dodanie', icon: <Truck size={18} /> },
  { id: 'payment', label: 'Platba', icon: <CreditCard size={18} /> },
  { id: 'confirmation', label: 'Hotovo', icon: <Check size={18} /> },
];

// ===========================================
// MAIN COMPONENT
// ===========================================

export const Checkout = () => {
  const navigate = useNavigate();
  const { state, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Shipping form state
  const [shipping, setShipping] = useState<ShippingAddress>({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'SK',
    note: '',
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');

  // Form errors
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  // Pre-fill if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setShipping(prev => ({
        ...prev,
        email: user.email || '',
        name: user.user_metadata?.name || '',
      }));
    }
  }, [isAuthenticated, user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (itemCount === 0 && currentStep !== 'confirmation') {
      navigate('/shop');
    }
  }, [itemCount, currentStep, navigate]);

  // ===========================================
  // VALIDATION (Zod)
  // ===========================================

  const validateShipping = (): boolean => {
    const result = shippingSchema.safeParse(shipping);
    const fieldErrors = extractFieldErrors(result);
    setErrors(fieldErrors as Partial<ShippingAddress>);
    return result.success;
  };

  // ===========================================
  // STEP NAVIGATION
  // ===========================================

  const goToStep = (step: CheckoutStep) => {
    if (step === 'shipping' && itemCount === 0) return;
    if (step === 'payment' && !validateShipping()) return;
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goNext = () => {
    const stepIndex = STEPS.findIndex(s => s.id === currentStep);
    if (stepIndex < STEPS.length - 1) {
      const nextStep = STEPS[stepIndex + 1].id;
      goToStep(nextStep);
    }
  };

  const goBack = () => {
    const stepIndex = STEPS.findIndex(s => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].id);
    }
  };

  // ===========================================
  // ORDER SUBMISSION
  // ===========================================

  const handleSubmitOrder = async () => {
    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate order number
      const year = new Date().getFullYear().toString().slice(-2);
      const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      const generatedOrderNumber = `${year}${random}`;
      
      setOrderNumber(generatedOrderNumber);
      clearCart();
      setCurrentStep('confirmation');

      // TODO: Integrate with Stripe
      // TODO: Save order to Supabase
      // TODO: Send confirmation email

    } catch (error) {
      console.error('Order error:', error);
      // TODO: Show error message
    } finally {
      setIsProcessing(false);
    }
  };

  // ===========================================
  // STEP INDICATOR
  // ===========================================

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {STEPS.map((step, index) => {
        const stepIndex = STEPS.findIndex(s => s.id === currentStep);
        const isActive = step.id === currentStep;
        const isCompleted = index < stepIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  isActive && "bg-brand-gold text-brand-dark",
                  isCompleted && "bg-green-500 text-white",
                  !isActive && !isCompleted && "bg-gray-200 text-gray-400"
                )}
              >
                {isCompleted ? <Check size={18} /> : step.icon}
              </div>
              <span className={cn(
                "text-xs mt-2 font-medium",
                isActive && "text-brand-dark",
                !isActive && "text-gray-400"
              )}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={cn(
                "w-16 md:w-24 h-0.5 mx-2 mb-6",
                isCompleted ? "bg-green-500" : "bg-gray-200"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // ===========================================
  // CART STEP
  // ===========================================

  const CartStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-dark">Váš košík</h2>
      
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {state.items.map((item) => (
          <div key={item.id} className="flex gap-4 p-6 border-b border-gray-100 last:border-0">
            <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-brand-dark">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.dimensions} • {item.thickness}</p>
              <p className="text-sm font-medium text-brand-gold mt-1">{formatPrice(item.price)}/m²</p>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    {formatPrice(item.price * (item.surfaceArea || 5.12) * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={goNext}
          className="bg-brand-dark text-white px-8 py-4 rounded-full hover:bg-brand-gold hover:text-brand-dark"
        >
          Pokračovať k dodaniu
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );

  // ===========================================
  // SHIPPING STEP
  // ===========================================

  const ShippingStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-dark">Dodacie údaje</h2>
        {!isAuthenticated && (
          <Link to="/login" className="text-sm text-brand-gold hover:underline">
            Máte účet? Prihláste sa
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meno a priezvisko *
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={shipping.name}
                onChange={(e) => setShipping(s => ({ ...s, name: e.target.value }))}
                className={cn(
                  "w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-all",
                  errors.name ? "border-red-500" : "border-gray-200 focus:border-brand-gold"
                )}
                placeholder="Ján Novák"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={shipping.email}
                onChange={(e) => setShipping(s => ({ ...s, email: e.target.value }))}
                className={cn(
                  "w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-all",
                  errors.email ? "border-red-500" : "border-gray-200 focus:border-brand-gold"
                )}
                placeholder="jan@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefón *
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={shipping.phone}
                onChange={(e) => setShipping(s => ({ ...s, phone: e.target.value }))}
                className={cn(
                  "w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-all",
                  errors.phone ? "border-red-500" : "border-gray-200 focus:border-brand-gold"
                )}
                placeholder="+421 900 123 456"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Street */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ulica a číslo *
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={shipping.street}
                onChange={(e) => setShipping(s => ({ ...s, street: e.target.value }))}
                className={cn(
                  "w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-all",
                  errors.street ? "border-red-500" : "border-gray-200 focus:border-brand-gold"
                )}
                placeholder="Hlavná 123"
              />
            </div>
            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mesto *
            </label>
            <div className="relative">
              <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={shipping.city}
                onChange={(e) => setShipping(s => ({ ...s, city: e.target.value }))}
                className={cn(
                  "w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-all",
                  errors.city ? "border-red-500" : "border-gray-200 focus:border-brand-gold"
                )}
                placeholder="Bratislava"
              />
            </div>
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PSČ *
            </label>
            <input
              type="text"
              value={shipping.postalCode}
              onChange={(e) => setShipping(s => ({ ...s, postalCode: e.target.value }))}
              className={cn(
                "w-full px-4 py-3 border rounded-xl outline-none transition-all",
                errors.postalCode ? "border-red-500" : "border-gray-200 focus:border-brand-gold"
              )}
              placeholder="811 01"
            />
            {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
          </div>

          {/* Note */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poznámka k objednávke
            </label>
            <textarea
              value={shipping.note}
              onChange={(e) => setShipping(s => ({ ...s, note: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-brand-gold transition-all resize-none"
              placeholder="Napr. inštrukcie pre kuriéra..."
            />
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-brand-gold/10 rounded-2xl p-6 flex items-start gap-4">
        <Truck size={24} className="text-brand-gold flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-brand-dark">Paušálna doprava: {formatPrice(SHIPPING_COST)}</h4>
          <p className="text-sm text-gray-600 mt-1">
            Doprava je realizovaná špedičnou firmou. Expedícia do 5 pracovných dní po prijatí platby.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-dark transition-colors"
        >
          <ArrowLeft size={18} />
          Späť
        </button>
        <Button
          onClick={goNext}
          className="bg-brand-dark text-white px-8 py-4 rounded-full hover:bg-brand-gold hover:text-brand-dark"
        >
          Pokračovať k platbe
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );

  // ===========================================
  // PAYMENT STEP
  // ===========================================

  const PaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-dark">Spôsob platby</h2>

      {/* Payment Methods */}
      <div className="space-y-4">
        <label
          className={cn(
            "block bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all",
            paymentMethod === 'card' ? "border-brand-gold" : "border-transparent shadow-sm hover:shadow-md"
          )}
        >
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              className="w-5 h-5 text-brand-gold focus:ring-brand-gold"
            />
            <CreditCard size={24} className="text-brand-gold" />
            <div>
              <p className="font-semibold text-brand-dark">Platba kartou online</p>
              <p className="text-sm text-gray-500">Visa, Mastercard, Apple Pay, Google Pay</p>
            </div>
          </div>
        </label>

        <label
          className={cn(
            "block bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all",
            paymentMethod === 'transfer' ? "border-brand-gold" : "border-transparent shadow-sm hover:shadow-md"
          )}
        >
          <div className="flex items-center gap-4">
            <input
              type="radio"
              name="payment"
              value="transfer"
              checked={paymentMethod === 'transfer'}
              onChange={() => setPaymentMethod('transfer')}
              className="w-5 h-5 text-brand-gold focus:ring-brand-gold"
            />
            <Building size={24} className="text-brand-gold" />
            <div>
              <p className="font-semibold text-brand-dark">Bankový prevod</p>
              <p className="text-sm text-gray-500">Platobné údaje obdržíte emailom</p>
            </div>
          </div>
        </label>
      </div>

      {/* No COD Notice */}
      <div className="bg-gray-100 rounded-2xl p-6 flex items-start gap-4">
        <AlertCircle size={24} className="text-gray-400 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-600">
            <strong>Dobierka nie je možná.</strong> Vzhľadom na vysokú hodnotu tovaru 
            a logistické obmedzenia akceptujeme len platby vopred.
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Lock size={16} />
        Platba je zabezpečená šifrovaním SSL
      </div>

      <div className="flex justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-dark transition-colors"
        >
          <ArrowLeft size={18} />
          Späť
        </button>
        <Button
          onClick={handleSubmitOrder}
          disabled={isProcessing}
          className="bg-brand-gold text-brand-dark px-8 py-4 rounded-full hover:bg-brand-dark hover:text-white disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Spracovávam...
            </>
          ) : (
            <>
              Záväzne objednať
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // ===========================================
  // CONFIRMATION STEP
  // ===========================================

  const ConfirmationStep = () => (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle size={48} className="text-white" />
      </motion.div>

      <h2 className="text-3xl font-bold text-brand-dark mb-4">
        Ďakujeme za vašu objednávku!
      </h2>
      
      <p className="text-lg text-gray-600 mb-2">
        Vaša objednávka č. <strong className="text-brand-dark">{orderNumber}</strong> bola prijatá.
      </p>
      
      <p className="text-gray-500 mb-8">
        Potvrdenie sme odoslali na <strong>{shipping.email}</strong>
      </p>

      {paymentMethod === 'transfer' && (
        <div className="bg-brand-gold/10 rounded-2xl p-6 max-w-md mx-auto mb-8 text-left">
          <h4 className="font-semibold text-brand-dark mb-3 flex items-center gap-2">
            <Building size={20} />
            Platobné údaje
          </h4>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">IBAN:</span> <strong>SK12 3456 7890 1234 5678 9012</strong></p>
            <p><span className="text-gray-500">VS:</span> <strong>{orderNumber}</strong></p>
            <p><span className="text-gray-500">Suma:</span> <strong>{formatPrice(calculateTotal(subtotal))}</strong></p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/shop">
          <Button className="bg-brand-dark text-white px-8 py-4 rounded-full hover:bg-brand-gold hover:text-brand-dark">
            Pokračovať v nákupe
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" className="border-gray-300 text-brand-dark px-8 py-4 rounded-full hover:bg-gray-100">
            Späť na hlavnú
          </Button>
        </Link>
      </div>
    </div>
  );

  // ===========================================
  // ORDER SUMMARY SIDEBAR
  // ===========================================

  const OrderSummary = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32">
      <h3 className="font-bold text-lg text-brand-dark mb-6">Súhrn objednávky</h3>

      {/* Items Preview */}
      <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
        {state.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-brand-dark line-clamp-1">{item.name}</p>
              <p className="text-xs text-gray-500">{item.quantity}× {item.thickness}</p>
            </div>
          </div>
        ))}
        {state.items.length > 3 && (
          <p className="text-sm text-gray-500">+{state.items.length - 3} ďalších položiek</p>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Medzisúčet</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Doprava</span>
          <span className="font-medium">{formatPrice(SHIPPING_COST)}</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-100 text-lg">
          <span className="font-bold text-brand-dark">Celkom</span>
          <span className="font-bold text-brand-gold">{formatPrice(calculateTotal(subtotal))}</span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Package size={16} className="text-green-500" />
          Expedícia do 5 pracovných dní
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Lock size={16} className="text-green-500" />
          Bezpečná platba
        </div>
      </div>
    </div>
  );

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <main className="min-h-screen bg-[#F9F9F7] pt-32 pb-24">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-dark mb-4">
            <ArrowLeft size={16} />
            Späť do obchodu
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">Pokladňa</h1>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Main Content */}
        {currentStep === 'confirmation' ? (
          <ConfirmationStep />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Steps Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 'cart' && <CartStep />}
                  {currentStep === 'shipping' && <ShippingStep />}
                  {currentStep === 'payment' && <PaymentStep />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="hidden lg:block">
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
