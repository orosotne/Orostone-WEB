// Supabase Edge Function for Order Confirmation Emails
// Deploy with: supabase functions deploy send-order-confirmation
// Requires: RESEND_API_KEY environment variable

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const FROM_EMAIL = 'Orostone <objednavky@orostone.sk>';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  surfaceArea: number;
}

interface OrderEmailRequest {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'card' | 'transfer';
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

const generateEmailHTML = (order: OrderEmailRequest): string => {
  const itemsHTML = order.items
    .map(item => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #f0f0f0;">
          <strong>${item.name}</strong><br>
          <span style="color: #666; font-size: 14px;">${item.quantity}× ${item.surfaceArea} m²</span>
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #f0f0f0; text-align: right;">
          ${formatPrice(item.price * item.surfaceArea * item.quantity)}
        </td>
      </tr>
    `)
    .join('');

  const bankTransferInfo = order.paymentMethod === 'transfer' ? `
    <div style="background: #FFF9E6; border: 1px solid #ECD488; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="margin: 0 0 16px 0; color: #1A1A1A;">Platobné údaje</h3>
      <p style="margin: 0; color: #666;">
        <strong>IBAN:</strong> SK12 3456 7890 1234 5678 9012<br>
        <strong>Variabilný symbol:</strong> ${order.orderNumber}<br>
        <strong>Suma:</strong> ${formatPrice(order.total)}
      </p>
      <p style="margin: 16px 0 0 0; font-size: 14px; color: #888;">
        Objednávka bude spracovaná po prijatí platby na náš účet.
      </p>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; background: #f9f9f7;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; color: #1A1A1A; margin: 0;">OROSTONE</h1>
          <p style="color: #ECD488; margin: 8px 0 0 0; font-size: 12px; letter-spacing: 2px;">PRÉMIOVÝ SINTEROVANÝ KAMEŇ</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          
          <h2 style="margin: 0 0 8px 0; color: #1A1A1A;">Ďakujeme za vašu objednávku!</h2>
          <p style="color: #666; margin: 0 0 24px 0;">
            Dobrý deň ${order.customerName},<br>
            vaša objednávka č. <strong>${order.orderNumber}</strong> bola prijatá.
          </p>
          
          ${bankTransferInfo}
          
          <!-- Order Items -->
          <h3 style="margin: 24px 0 16px 0; color: #1A1A1A; font-size: 16px;">Položky objednávky</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHTML}
          </table>
          
          <!-- Totals -->
          <div style="margin-top: 24px; padding-top: 24px; border-top: 2px solid #f0f0f0;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Medzisúčet</td>
                <td style="padding: 8px 0; text-align: right;">${formatPrice(order.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Doprava</td>
                <td style="padding: 8px 0; text-align: right;">${formatPrice(order.shippingCost)}</td>
              </tr>
              <tr>
                <td style="padding: 16px 0 0 0; font-weight: bold; font-size: 18px; color: #1A1A1A;">Celkom</td>
                <td style="padding: 16px 0 0 0; text-align: right; font-weight: bold; font-size: 18px; color: #ECD488;">${formatPrice(order.total)}</td>
              </tr>
            </table>
          </div>
          
          <!-- Shipping Address -->
          <div style="margin-top: 32px; padding: 20px; background: #f9f9f7; border-radius: 12px;">
            <h4 style="margin: 0 0 12px 0; color: #1A1A1A; font-size: 14px;">Doručovacia adresa</h4>
            <p style="margin: 0; color: #666; font-size: 14px;">
              ${order.customerName}<br>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.postalCode} ${order.shippingAddress.city}<br>
              ${order.shippingAddress.country === 'SK' ? 'Slovensko' : order.shippingAddress.country}
            </p>
          </div>
          
          <!-- Next Steps -->
          <div style="margin-top: 32px;">
            <h4 style="margin: 0 0 12px 0; color: #1A1A1A;">Čo bude nasledovať?</h4>
            <ol style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
              ${order.paymentMethod === 'transfer' 
                ? '<li>Po prijatí platby spracujeme vašu objednávku</li>' 
                : '<li>Vaša platba bola úspešne prijatá</li>'}
              <li>Objednávka bude expedovaná do 5 pracovných dní</li>
              <li>O odoslaní vás budeme informovať emailom</li>
            </ol>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 32px; padding-top: 32px; border-top: 1px solid #e0e0e0;">
          <p style="color: #888; font-size: 14px; margin: 0 0 8px 0;">
            Máte otázky? Kontaktujte nás na<br>
            <a href="mailto:info@orostone.sk" style="color: #ECD488;">info@orostone.sk</a>
          </p>
          <p style="color: #aaa; font-size: 12px; margin: 16px 0 0 0;">
            © ${new Date().getFullYear()} Orostone. Všetky práva vyhradené.
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Email service not configured' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }

  try {
    const orderData = await req.json() as OrderEmailRequest;

    // Send customer confirmation email
    const customerEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: orderData.customerEmail,
        subject: `Potvrdenie objednávky #${orderData.orderNumber}`,
        html: generateEmailHTML(orderData),
      }),
    });

    if (!customerEmailRes.ok) {
      const errorData = await customerEmailRes.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    // Send admin notification
    const adminEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: 'info@orostone.sk', // Admin email
        subject: `🛒 Nová objednávka #${orderData.orderNumber}`,
        html: `
          <h2>Nová objednávka #${orderData.orderNumber}</h2>
          <p><strong>Zákazník:</strong> ${orderData.customerName} (${orderData.customerEmail})</p>
          <p><strong>Suma:</strong> ${formatPrice(orderData.total)}</p>
          <p><strong>Platba:</strong> ${orderData.paymentMethod === 'card' ? 'Kartou' : 'Prevodom'}</p>
          <p><strong>Položiek:</strong> ${orderData.items.length}</p>
        `,
      }),
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        customerEmail: customerEmailRes.ok,
        adminEmail: adminEmailRes.ok,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Email error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
