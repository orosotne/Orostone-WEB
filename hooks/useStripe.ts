import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CartItem } from '../context/CartContext';

// ===========================================
// TYPES
// ===========================================

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

interface UseStripeReturn {
  createPaymentIntent: (
    items: CartItem[],
    shippingCost: number,
    customerEmail: string,
    customerName: string
  ) => Promise<PaymentIntentResponse | null>;
  isLoading: boolean;
  error: string | null;
}

// ===========================================
// HOOK
// ===========================================

export const useStripePayment = (): UseStripeReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(async (
    items: CartItem[],
    shippingCost: number,
    customerEmail: string,
    customerName: string
  ): Promise<PaymentIntentResponse | null> => {
    if (!isSupabaseConfigured()) {
      setError('Platobný systém nie je nakonfigurovaný');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        'create-payment-intent',
        {
          body: {
            items: items.map(item => ({
              id: item.id,
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              surfaceArea: item.surfaceArea,
            })),
            shippingCost,
            customerEmail,
            customerName,
          },
        }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      return data as PaymentIntentResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Chyba pri vytváraní platby';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createPaymentIntent,
    isLoading,
    error,
  };
};

// ===========================================
// STRIPE CONFIG
// ===========================================

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const isStripeConfigured = (): boolean => {
  return STRIPE_PUBLISHABLE_KEY.startsWith('pk_');
};
