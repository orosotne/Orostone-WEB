// ===========================================
// EDGE FUNCTION: send-quote-notification
// ===========================================
// Podporuje dva módy volania:
//
// 1. DIRECT CALL (z frontend služieb):
//    POST { quote_id: "uuid" }
//    → Načíta quote + customer z DB, pošle emaily
//
// 2. WEBHOOK (Supabase Database Webhook na quotes INSERT):
//    POST { type: "INSERT", table: "quotes", record: {...} }
//    → Spätne kompatibilné správanie
//
// DEPLOYMENT:
// supabase functions deploy send-quote-notification --project-ref xfkznvqufhnrphpdhfnc

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = 'info@orostone.sk';
const FROM_EMAIL = 'Orostone <noreply@orostone.sk>';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LOGO_URL = 'https://www.orostone.sk/images/brand/orostone-circle.png';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
};

interface CustomerData {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  city: string | null;
}

interface QuoteData {
  id: string;
  customer_id: string;
  project_type: string;
  item_needed: string | null;
  dimensions: string | null;
  decor: string | null;
  created_at: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    let quote: QuoteData;
    let customer: CustomerData;

    // --- DIRECT CALL: { quote_id } ---
    if (payload.quote_id) {
      const [quoteRes, ] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/quotes?id=eq.${payload.quote_id}&select=*`, {
          headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
        }),
      ]);
      const quotes: QuoteData[] = await quoteRes.json();
      if (!quotes[0]) throw new Error(`Quote not found: ${payload.quote_id}`);
      quote = quotes[0];

      const customerRes = await fetch(
        `${SUPABASE_URL}/rest/v1/customers?id=eq.${quote.customer_id}&select=*`,
        { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } },
      );
      const customers: CustomerData[] = await customerRes.json();
      if (!customers[0]) throw new Error(`Customer not found: ${quote.customer_id}`);
      customer = customers[0];
    }
    // --- WEBHOOK CALL: { type, table, record } ---
    else if (payload.type === 'INSERT' && payload.table === 'quotes') {
      quote = payload.record as QuoteData;
      const customerRes = await fetch(
        `${SUPABASE_URL}/rest/v1/customers?id=eq.${quote.customer_id}&select=*`,
        { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } },
      );
      const customers: CustomerData[] = await customerRes.json();
      if (!customers[0]) throw new Error(`Customer not found: ${quote.customer_id}`);
      customer = customers[0];
    } else {
      return new Response(JSON.stringify({ ignored: true }), { status: 200, headers: corsHeaders });
    }

    const isSampleLead = quote.project_type === 'Vzorka zadarmo (Shop)';

    await Promise.all([
      sendAdminNotification(quote, customer, isSampleLead),
      isSampleLead
        ? sendSampleLeadConfirmation(quote, customer)
        : sendCustomerConfirmation(quote, customer),
    ]);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error('[send-quote-notification] Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders },
    );
  }
});

// ===========================================
// ADMIN NOTIFIKÁCIA
// ===========================================
async function sendAdminNotification(quote: QuoteData, customer: CustomerData, isSampleLead: boolean) {
  const subject = isSampleLead
    ? `[Orostone] Nová žiadosť o vzorku — ${customer.name} (${quote.decor ?? 'dekor nevybraný'})`
    : `[Orostone] Nový dopyt — ${customer.name} (${quote.project_type})`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; color: #1A1A1A; padding: 24px; max-width: 600px;">
  <img src="${LOGO_URL}" alt="Orostone" style="height: 36px; margin-bottom: 20px;">
  <div style="background: #ECD488; height: 3px; margin-bottom: 24px;"></div>

  <h2 style="margin: 0 0 4px 0; font-size: 18px;">${isSampleLead ? '📦 Nová žiadosť o vzorku' : '📋 Nový dopyt z webu'}</h2>
  <p style="color: #666; font-size: 13px; margin: 0 0 24px 0;">
    ${new Date(quote.created_at).toLocaleString('sk-SK')}
  </p>

  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; width: 35%;">Meno</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600;">${customer.name}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">Email</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
          <a href="mailto:${customer.email}" style="color: #1A1A1A;">${customer.email}</a>
        </td></tr>
    ${customer.phone ? `
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">Telefón</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
          <a href="tel:${customer.phone}" style="color: #1A1A1A;">${customer.phone}</a>
        </td></tr>` : ''}
    ${quote.decor ? `
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">Dekor</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #1A1A1A;">${quote.decor}</td></tr>` : ''}
    ${quote.project_type && !isSampleLead ? `
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">Typ projektu</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${quote.project_type}</td></tr>` : ''}
    ${quote.item_needed ? `
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">Predmet</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${quote.item_needed}</td></tr>` : ''}
    ${quote.dimensions ? `
    <tr><td style="padding: 8px 0; color: #666;">Rozmery / Popis</td>
        <td style="padding: 8px 0;">${quote.dimensions}</td></tr>` : ''}
  </table>

  <div style="margin-top: 28px;">
    <a href="mailto:${customer.email}?subject=Re: ${isSampleLead ? 'Vzorka Orostone' : 'Váš dopyt'}"
       style="display: inline-block; background: #1A1A1A; color: white; padding: 12px 28px;
              text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 0.05em;
              text-transform: uppercase; border-radius: 3px;">
      Odpovedať zákazníkovi
    </a>
  </div>

  <p style="margin-top: 32px; color: #bbb; font-size: 11px; border-top: 1px solid #eee; padding-top: 16px;">
    Dopyt ID: ${quote.id}
  </p>
</body>
</html>`;

  await sendEmail({ to: ADMIN_EMAIL, subject, html });
}

// ===========================================
// ZÁKAZNÍK — POTVRDENIE VZORKY (krásny dizajn)
// ===========================================
async function sendSampleLeadConfirmation(quote: QuoteData, customer: CustomerData) {
  const firstName = customer.name.split(' ')[0];

  const html = `
<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
  body { margin: 0; padding: 0; background: #F5F5F0; }
  * { box-sizing: border-box; }
</style>
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; background: #F5F5F0; padding: 40px 16px;">

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">

    <!-- HEADER: logo -->
    <tr>
      <td style="background: #ffffff; padding: 36px 40px 0 40px; text-align: center; border-radius: 12px 12px 0 0;">
        <img src="${LOGO_URL}" alt="Orostone" style="height: 52px; display: inline-block;">
        <p style="margin: 8px 0 0 0; font-size: 11px; font-weight: 700; letter-spacing: 0.3em;
                  text-transform: uppercase; color: #ECD488;">OROSTONE</p>
      </td>
    </tr>

    <!-- ZLATÁ LINKA -->
    <tr>
      <td style="background: #ffffff; padding: 0 40px;">
        <div style="background: #ECD488; height: 3px; margin: 24px 0;"></div>
      </td>
    </tr>

    <!-- HERO TEXT -->
    <tr>
      <td style="background: #ffffff; padding: 0 40px 32px 40px; text-align: center;">
        <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #1A1A1A; letter-spacing: -0.02em;">
          Ďakujeme, ${firstName}!
        </h1>
        <p style="margin: 0; font-size: 16px; font-weight: 300; color: #666; line-height: 1.6;">
          Vaša žiadosť o vzorku bola úspešne prijatá.
        </p>
      </td>
    </tr>

    <!-- DEKOR KARTA -->
    <tr>
      <td style="background: #ffffff; padding: 0 40px 32px 40px;">
        <div style="background: #F9F9F7; border-left: 4px solid #ECD488; border-radius: 0 8px 8px 0;
                    padding: 16px 20px;">
          <p style="margin: 0 0 4px 0; font-size: 10px; font-weight: 700; letter-spacing: 0.25em;
                    text-transform: uppercase; color: #ECD488;">Váš vybraný dekor</p>
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #1A1A1A;">
            ${quote.decor ?? '—'}
          </p>
        </div>
      </td>
    </tr>

    <!-- ČO SA STANE ĎALEJ -->
    <tr>
      <td style="background: #ffffff; padding: 0 40px 36px 40px;">
        <p style="margin: 0 0 16px 0; font-size: 13px; font-weight: 700; letter-spacing: 0.15em;
                  text-transform: uppercase; color: #1A1A1A;">Čo sa stane ďalej?</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align: top; padding-bottom: 14px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: top; width: 32px;">
                    <div style="width: 24px; height: 24px; background: #ECD488; border-radius: 50%;
                                text-align: center; line-height: 24px; font-size: 11px; font-weight: 700;
                                color: #1A1A1A; flex-shrink: 0;">1</div>
                  </td>
                  <td style="padding-left: 12px; font-size: 14px; font-weight: 300; color: #444; line-height: 1.5;">
                    Overíme dostupnosť vzorky dekoru <strong style="font-weight: 600;">${quote.decor ?? ''}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="vertical-align: top; padding-bottom: 14px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: top; width: 32px;">
                    <div style="width: 24px; height: 24px; background: #ECD488; border-radius: 50%;
                                text-align: center; line-height: 24px; font-size: 11px; font-weight: 700;
                                color: #1A1A1A;">2</div>
                  </td>
                  <td style="padding-left: 12px; font-size: 14px; font-weight: 300; color: #444; line-height: 1.5;">
                    Kontaktujeme vás do <strong style="font-weight: 600;">24 hodín</strong> s potvrdením a detailmi doručenia
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="vertical-align: top;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: top; width: 32px;">
                    <div style="width: 24px; height: 24px; background: #ECD488; border-radius: 50%;
                                text-align: center; line-height: 24px; font-size: 11px; font-weight: 700;
                                color: #1A1A1A;">3</div>
                  </td>
                  <td style="padding-left: 12px; font-size: 14px; font-weight: 300; color: #444; line-height: 1.5;">
                    Fyzická vzorka vám dorazí <strong style="font-weight: 600;">poštou zadarmo</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CTA TLAČIDLO -->
    <tr>
      <td style="background: #ffffff; padding: 0 40px 44px 40px; text-align: center;">
        <a href="https://www.orostone.sk"
           style="display: inline-block; background: #1A1A1A; color: #ffffff; padding: 14px 36px;
                  text-decoration: none; font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
                  text-transform: uppercase; border-radius: 3px;">
          Navštíviť Orostone.sk
        </a>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background: #ffffff; border-top: 1px solid #eeeeee; padding: 24px 40px;
                 border-radius: 0 0 12px 12px; text-align: center;">
        <p style="margin: 0 0 6px 0; font-size: 12px; color: #999; font-weight: 300;">
          V prípade otázok nás kontaktujte:
        </p>
        <p style="margin: 0; font-size: 12px; color: #666;">
          <a href="mailto:info@orostone.sk" style="color: #1A1A1A; text-decoration: none; font-weight: 600;">info@orostone.sk</a>
          &nbsp;·&nbsp;
          <a href="tel:+421917588738" style="color: #1A1A1A; text-decoration: none; font-weight: 600;">+421 917 588 738</a>
        </p>
        <p style="margin: 12px 0 0 0; font-size: 11px; color: #bbb; font-weight: 300;">
          Orostone s.r.o. &nbsp;·&nbsp; Landererova 8, 811 09 Bratislava
          &nbsp;·&nbsp; <a href="https://www.orostone.sk" style="color: #bbb;">www.orostone.sk</a>
        </p>
      </td>
    </tr>

  </table>

</body>
</html>`;

  await sendEmail({
    to: customer.email,
    subject: `Vaša vzorka ${quote.decor ? `"${quote.decor}" ` : ''}je na ceste — Orostone`,
    html,
  });
}

// ===========================================
// ZÁKAZNÍK — POTVRDENIE DOPYTU (pôvodné)
// ===========================================
async function sendCustomerConfirmation(quote: QuoteData, customer: CustomerData) {
  const html = `
    <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 40px;">
      <img src="${LOGO_URL}" alt="Orostone" style="height: 40px; margin-bottom: 8px; display: block;">
      <div style="background: #ECD488; height: 3px; margin-bottom: 28px;"></div>

      <h2 style="font-weight: 700; font-size: 22px; color: #1A1A1A; margin: 0 0 8px 0;">Ďakujeme za Váš dopyt</h2>
      <p style="color: #444; font-weight: 300; line-height: 1.6; margin: 0 0 24px 0;">
        Vážený/á ${customer.name},<br><br>
        Váš dopyt na <strong>${quote.project_type.toLowerCase()}</strong> sme úspešne prijali.
        Náš špecialista Vás bude kontaktovať do 24 hodín s predbežnou kalkuláciou.
      </p>

      <h3 style="font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
                  color: #1A1A1A; margin: 0 0 12px 0;">Súhrn dopytu</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; width: 40%;">Typ projektu</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${quote.project_type}</td></tr>
        ${quote.item_needed ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666;">Predmet</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${quote.item_needed}</td></tr>` : ''}
        ${quote.decor ? `<tr><td style="padding: 8px 0; color: #666;">Dekor</td>
            <td style="padding: 8px 0;">${quote.decor}</td></tr>` : ''}
      </table>

      <div style="margin: 32px 0;">
        <a href="https://www.orostone.sk"
           style="display: inline-block; background: #1A1A1A; color: #fff; padding: 13px 32px;
                  text-decoration: none; font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
                  text-transform: uppercase; border-radius: 3px;">
          Navštíviť Orostone.sk
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 20px 0;">
      <p style="color: #999; font-size: 12px; font-weight: 300; margin: 0;">
        V prípade otázok: <a href="mailto:info@orostone.sk" style="color: #1A1A1A;">info@orostone.sk</a>
        &nbsp;·&nbsp; <a href="tel:+421917588738" style="color: #1A1A1A;">+421 917 588 738</a><br>
        Orostone s.r.o. &nbsp;·&nbsp; Landererova 8, 811 09 Bratislava
      </p>
    </div>`;

  await sendEmail({
    to: customer.email,
    subject: 'Potvrdenie dopytu — Orostone',
    html,
  });
}

// ===========================================
// HELPER: odoslanie emailu cez Resend
// ===========================================
interface EmailParams { to: string; subject: string; html: string; }

async function sendEmail({ to, subject, html }: EmailParams) {
  if (!RESEND_API_KEY) {
    console.warn('[send-quote-notification] RESEND_API_KEY nie je nastavený — preskakujem email');
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend API error: ${err}`);
  }

  console.log(`[send-quote-notification] Email odoslaný na ${to}`);
}
