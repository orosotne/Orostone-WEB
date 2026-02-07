import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../UI/Button';
import { STRIPE_PUBLISHABLE_KEY, isStripeConfigured } from '../../hooks/useStripe';

// Initialize Stripe
const stripePromise = isStripeConfigured() 
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null;

// ===========================================
// PAYMENT FORM (Inner Component)
// ===========================================

interface PaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) return;

    // Check for existing payment status in URL
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (clientSecret) {
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case 'succeeded':
            setMessage('Platba bola úspešná!');
            onSuccess(paymentIntent.id);
            break;
          case 'processing':
            setMessage('Platba sa spracováva...');
            break;
          case 'requires_payment_method':
            setMessage('Platba nebola úspešná. Skúste to znova.');
            break;
          default:
            setMessage('Niečo sa pokazilo.');
            break;
        }
      });
    }
  }, [stripe, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?step=confirmation`,
      },
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'Chyba pri spracovaní karty');
      } else {
        setMessage('Nastala neočakávaná chyba');
      }
      onError(error.message || 'Payment failed');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs',
        }}
      />

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm"
        >
          <AlertCircle size={20} className="flex-shrink-0" />
          {message}
        </motion.div>
      )}

      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-brand-gold text-brand-dark py-4 rounded-xl hover:bg-brand-dark hover:text-white transition-all disabled:opacity-50"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            Spracovávam platbu...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Lock size={18} />
            Zaplatiť teraz
          </span>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
        <Lock size={14} />
        Zabezpečená platba cez Stripe
      </p>
    </form>
  );
};

// ===========================================
// STRIPE PAYMENT WRAPPER
// ===========================================

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  clientSecret,
  onSuccess,
  onError,
}) => {
  if (!stripePromise) {
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
        <AlertCircle size={32} className="mx-auto text-amber-500 mb-3" />
        <p className="text-amber-700">
          Platobný systém nie je nakonfigurovaný. Kontaktujte administrátora.
        </p>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#ECD488',
        colorBackground: '#ffffff',
        colorText: '#1A1A1A',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '12px',
        spacingUnit: '4px',
      },
      rules: {
        '.Input': {
          border: '1px solid #e5e7eb',
          boxShadow: 'none',
          padding: '12px 16px',
        },
        '.Input:focus': {
          border: '1px solid #ECD488',
          boxShadow: '0 0 0 2px rgba(236, 212, 136, 0.2)',
        },
        '.Label': {
          fontWeight: '500',
          marginBottom: '8px',
        },
        '.Tab': {
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
        },
        '.Tab--selected': {
          backgroundColor: '#ECD488',
          borderColor: '#ECD488',
          color: '#1A1A1A',
        },
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};
