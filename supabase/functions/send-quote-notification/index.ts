// ===========================================
// EDGE FUNCTION: send-quote-notification
// ===========================================
// Táto funkcia sa spúšťa po vytvorení nového dopytu
// a odosiela email notifikácie cez Resend API
//
// DEPLOYMENT:
// 1. Nainštaluj Supabase CLI: npm install -g supabase
// 2. Prihlás sa: supabase login
// 3. Linkni projekt: supabase link --project-ref YOUR_PROJECT_REF
// 4. Deploy: supabase functions deploy send-quote-notification
// 5. Nastav secret: supabase secrets set RESEND_API_KEY=re_xxxx

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = 'info@orostone.sk';
const FROM_EMAIL = 'Orostone <noreply@orostone.sk>';

interface QuotePayload {
  type: 'INSERT';
  table: 'quotes';
  record: {
    id: string;
    customer_id: string;
    project_type: string;
    item_needed: string | null;
    dimensions: string | null;
    decor: string | null;
    created_at: string;
  };
  old_record: null;
}

interface CustomerData {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  city: string | null;
}

serve(async (req) => {
  try {
    // Parsuj webhook payload
    const payload: QuotePayload = await req.json();
    
    if (payload.type !== 'INSERT' || payload.table !== 'quotes') {
      return new Response('Ignored - not a quote insert', { status: 200 });
    }

    const quote = payload.record;

    // Získaj údaje zákazníka z databázy
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const customerResponse = await fetch(
      `${supabaseUrl}/rest/v1/customers?id=eq.${quote.customer_id}`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    );

    const customers: CustomerData[] = await customerResponse.json();
    const customer = customers[0];

    if (!customer) {
      console.error('Customer not found:', quote.customer_id);
      return new Response('Customer not found', { status: 404 });
    }

    // 1. Pošli email adminovi
    await sendAdminNotification(quote, customer);

    // 2. Pošli potvrdenie zákazníkovi
    await sendCustomerConfirmation(quote, customer);

    return new Response(
      JSON.stringify({ success: true, message: 'Notifications sent' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-quote-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

async function sendAdminNotification(quote: QuotePayload['record'], customer: CustomerData) {
  const html = `
    <h2>🔔 Nový dopyt z webu Orostone</h2>
    
    <h3>Kontaktné údaje</h3>
    <ul>
      <li><strong>Meno:</strong> ${customer.name}</li>
      <li><strong>Email:</strong> ${customer.email}</li>
      <li><strong>Telefón:</strong> ${customer.phone || 'neuvedené'}</li>
      <li><strong>Mesto:</strong> ${customer.city || 'neuvedené'}</li>
    </ul>
    
    <h3>Detaily projektu</h3>
    <ul>
      <li><strong>Typ projektu:</strong> ${quote.project_type}</li>
      <li><strong>Predmet:</strong> ${quote.item_needed || 'neuvedené'}</li>
      <li><strong>Rozmery:</strong> ${quote.dimensions || 'neuvedené'}</li>
      <li><strong>Dekor:</strong> ${quote.decor || 'neuvedené'}</li>
    </ul>
    
    <p>
      <a href="https://supabase.com/dashboard/project/_/editor" 
         style="background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; display: inline-block;">
        Otvoriť v Admin Paneli
      </a>
    </p>
    
    <hr>
    <p style="color: #666; font-size: 12px;">
      Dopyt ID: ${quote.id}<br>
      Vytvorené: ${new Date(quote.created_at).toLocaleString('sk-SK')}
    </p>
  `;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Orostone] Nový dopyt - ${customer.name} (${quote.project_type})`,
    html,
  });
}

async function sendCustomerConfirmation(quote: QuotePayload['record'], customer: CustomerData) {
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
      <img src="https://www.orostone.sk/images/brand/orostone-circle.png" alt="Orostone" style="height: 40px; margin-bottom: 24px;">
      
      <h2 style="font-weight: normal;">Ďakujeme za Váš dopyt</h2>
      
      <p>Vážený/á ${customer.name},</p>
      
      <p>
        Váš dopyt na <strong>${quote.project_type.toLowerCase()}</strong> sme úspešne prijali.
        Náš špecialista Vás bude kontaktovať do 24 hodín s predbežnou kalkuláciou.
      </p>
      
      <h3 style="font-weight: normal; margin-top: 32px;">Súhrn Vášho dopytu</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">Typ projektu</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${quote.project_type}</td>
        </tr>
        ${quote.item_needed ? `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">Predmet</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${quote.item_needed}</td>
        </tr>
        ` : ''}
        ${quote.decor ? `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">Dekor</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${quote.decor}</td>
        </tr>
        ` : ''}
      </table>
      
      <p style="margin-top: 32px;">
        V prípade otázok nás neváhajte kontaktovať:
      </p>
      <ul>
        <li>📧 info@orostone.sk</li>
        <li>📞 +421 917 588 738</li>
      </ul>
      
      <p style="margin-top: 32px;">
        S pozdravom,<br>
        <strong>Tím Orostone</strong>
      </p>
      
      <hr style="margin-top: 48px; border: none; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 12px;">
        Orostone s.r.o. | Landererova 8, 811 09 Bratislava<br>
        <a href="https://www.orostone.sk" style="color: #999;">www.orostone.sk</a>
      </p>
    </div>
  `;

  await sendEmail({
    to: customer.email,
    subject: 'Potvrdenie dopytu - Orostone',
    html,
  });
}

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: EmailParams) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set - skipping email');
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    throw new Error(`Failed to send email: ${error}`);
  }

  console.log(`Email sent to ${to}`);
}

