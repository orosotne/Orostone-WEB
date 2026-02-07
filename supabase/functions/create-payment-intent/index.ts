// Supabase Edge Function for Stripe Payment Intent Creation
// Deploy with: supabase functions deploy create-payment-intent

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno';
import { z } from 'https://esm.sh/zod@3.22.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Zod validačná schéma pre payment request
const PaymentRequestSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    productId: z.string(),
    name: z.string(),
    price: z.number().positive('Cena musí byť kladná'),
    quantity: z.number().int().positive('Množstvo musí byť kladné celé číslo'),
    surfaceArea: z.number().positive().optional(),
  })).min(1, 'Košík nemôže byť prázdny'),
  shippingCost: z.number().min(0, 'Doprava nemôže byť záporná'),
  customerEmail: z.string().email('Neplatný email zákazníka'),
  customerName: z.string().min(1, 'Meno zákazníka je povinné'),
  metadata: z.record(z.string()).optional(),
});

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();

    // Validácia vstupných dát
    const parseResult = PaymentRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map(i => i.message).join(', ');
      return new Response(
        JSON.stringify({ error: `Neplatné dáta: ${errors}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { items, shippingCost, customerEmail, customerName, metadata } = parseResult.data;

    // Calculate total
    const subtotal = items.reduce((sum, item) => {
      const area = item.surfaceArea || 5.12;
      return sum + (item.price * area * item.quantity);
    }, 0);

    const total = subtotal + shippingCost;

    // Amount in cents (Stripe expects integers)
    const amountInCents = Math.round(total * 100);

    // Create line items description
    const description = items
      .map(item => `${item.quantity}x ${item.name}`)
      .join(', ');

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      description: `Orostone objednávka: ${description}`,
      receipt_email: customerEmail,
      metadata: {
        customer_name: customerName,
        customer_email: customerEmail,
        items_count: items.length.toString(),
        subtotal: subtotal.toFixed(2),
        shipping: shippingCost.toFixed(2),
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: total,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Payment intent error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create payment intent' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
