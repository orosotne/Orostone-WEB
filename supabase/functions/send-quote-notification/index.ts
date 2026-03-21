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
const LOGO_URL = 'https://www.orostone.sk/images/orostone-logo-email.png';
const LOGO_CIRCLE_URL = 'https://www.orostone.sk/images/logo-circle.png';

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
<html lang="sk" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
  :root { color-scheme: light only; }
  body { margin: 0; padding: 0; }

  @media (prefers-color-scheme: dark) {
    .email-card  { background-color: #1e1e1e !important; }
    .email-body  { background-color: #1e1e1e !important; }
    .email-text  { color: #f0f0f0 !important; }
    .data-label  { color: #888888 !important; }
    .data-value  { color: #f0f0f0 !important; }
    .data-link   { color: #ECD488 !important; }
    .data-row td { border-bottom-color: #333333 !important; }
    .footer-cell { background-color: #1e1e1e !important; border-top-color: #333333 !important; }
    .footer-id   { color: #555555 !important; }
    .cta-btn     { background-color: #ECD488 !important; color: #1A1A1A !important; }
  }
  [data-ogsc] .email-card  { background-color: #1e1e1e !important; }
  [data-ogsc] .email-body  { background-color: #1e1e1e !important; }
  [data-ogsc] .email-text  { color: #f0f0f0 !important; }
  [data-ogsc] .data-label  { color: #888888 !important; }
  [data-ogsc] .data-value  { color: #f0f0f0 !important; }
  [data-ogsc] .data-link   { color: #ECD488 !important; }
  [data-ogsc] .data-row td { border-bottom-color: #333333 !important; }
  [data-ogsc] .footer-cell { background-color: #1e1e1e !important; border-top-color: #333333 !important; }
  [data-ogsc] .footer-id   { color: #555555 !important; }
  [data-ogsc] .cta-btn     { background-color: #ECD488 !important; color: #1A1A1A !important; }
</style>
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; margin: 0; padding: 0;">

  <!-- OUTER: zlaté PNG pozadie -->
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background-color: #ECD488;
                background-image: url('https://www.orostone.sk/images/email-gold-bg.png');
                background-repeat: repeat; border-collapse: collapse;">
    <tr>
      <td style="background-color: #ECD488;
                 background-image: url('https://www.orostone.sk/images/email-gold-bg.png');
                 background-repeat: repeat; padding: 36px 16px 40px 16px;">

        <!-- LOGO: čierne, vycentrované nad kartou -->
        <div style="max-width: 560px; margin: 0 auto; text-align: center; padding-bottom: 24px;">
          <img src="${LOGO_URL}" alt="Orostone"
               style="height: 42px; display: inline-block;
                      filter: brightness(0); -webkit-filter: brightness(0);">
        </div>

        <!-- BIELA KARTA -->
        <div class="email-card" style="max-width: 560px; margin: 0 auto; border-radius: 16px;
                    overflow: hidden; background-color: #ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">

            <!-- HLAVIČKA -->
            <tr>
              <td class="email-body" style="background-color: #ffffff; padding: 36px 40px 24px 40px;">
                <p style="margin: 0 0 6px 0; font-size: 10px; font-weight: 700; letter-spacing: 0.25em;
                          text-transform: uppercase; color: #B8960C;">
                  ${isSampleLead ? 'Žiadosť o vzorku' : 'Dopyt z webu'}
                </p>
                <h2 class="email-text" style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700; color: #1A1A1A;">
                  ${customer.name}
                </h2>
                <p style="margin: 0; font-size: 12px; color: #999999; font-weight: 300;">
                  ${new Date(quote.created_at).toLocaleString('sk-SK')}
                </p>
              </td>
            </tr>

            <!-- DATA TABUĽKA -->
            <tr>
              <td class="email-body" style="background-color: #ffffff; padding: 0 40px 8px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">

                  <tr class="data-row">
                    <td class="data-label" style="padding: 10px 0; border-bottom: 1px solid #eeeeee;
                                font-size: 12px; color: #999999; width: 35%; font-weight: 400;">Email</td>
                    <td class="data-value" style="padding: 10px 0; border-bottom: 1px solid #eeeeee;
                                font-size: 14px; font-weight: 600; color: #1A1A1A;">
                      <a href="mailto:${customer.email}" class="data-link"
                         style="color: #1A1A1A; text-decoration: none;">${customer.email}</a>
                    </td>
                  </tr>

                  ${customer.phone ? `
                  <tr class="data-row">
                    <td class="data-label" style="padding: 10px 0; border-bottom: 1px solid #eeeeee;
                                font-size: 12px; color: #999999; font-weight: 400;">Telefón</td>
                    <td class="data-value" style="padding: 10px 0; border-bottom: 1px solid #eeeeee;
                                font-size: 14px; font-weight: 600; color: #1A1A1A;">
                      <a href="tel:${customer.phone}" class="data-link"
                         style="color: #1A1A1A; text-decoration: none;">${customer.phone}</a>
                    </td>
                  </tr>` : ''}

                  ${quote.decor ? `
                  <tr class="data-row">
                    <td class="data-label" style="padding: 10px 0; border-bottom: 1px solid #eeeeee;
                                font-size: 12px; color: #999999; font-weight: 400;">Dekor</td>
                    <td class="data-value" style="padding: 10px 0; border-bottom: 1px solid #eeeeee;
                                font-size: 14px; font-weight: 700; color: #1A1A1A;">${quote.decor}</td>
                  </tr>` : ''}

                  ${quote.project_type && !isSampleLead ? `
                  <tr class="data-row">
                    <td class="data-label" style="padding: 10px 0; border-bottom: 1px solid #eeeeee;
                                font-size: 12px; color: #999999; font-weight: 400;">Typ projektu</td>
                    <td class="data-value" style="padding: 10px 0; border-bottom: 1px solid #eeeeee;
                                font-size: 14px; font-weight: 600; color: #1A1A1A;">${quote.project_type}</td>
                  </tr>` : ''}

                  ${quote.item_needed ? `
                  <tr class="data-row">
                    <td class="data-label" style="padding: 10px 0; border-bottom: 1px solid #eeeeee;
                                font-size: 12px; color: #999999; font-weight: 400;">Predmet</td>
                    <td class="data-value" style="padding: 10px 0; border-bottom: 1px solid #eeeeee;
                                font-size: 14px; font-weight: 600; color: #1A1A1A;">${quote.item_needed}</td>
                  </tr>` : ''}

                  ${quote.dimensions ? `
                  <tr class="data-row">
                    <td class="data-label" style="padding: 10px 0; font-size: 12px; color: #999999; font-weight: 400;">
                      Popis</td>
                    <td class="data-value" style="padding: 10px 0; font-size: 14px; font-weight: 400;
                                color: #1A1A1A; line-height: 1.5;">${quote.dimensions}</td>
                  </tr>` : ''}

                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td class="email-body" style="background-color: #ffffff; padding: 28px 40px 32px 40px;">
                <a href="mailto:${customer.email}?subject=Re: ${isSampleLead ? 'Vzorka Orostone' : 'Váš dopyt — Orostone'}"
                   class="cta-btn"
                   style="display: inline-block; background-color: #1A1A1A; color: #ffffff;
                          padding: 12px 28px; text-decoration: none; font-size: 11px; font-weight: 700;
                          letter-spacing: 0.1em; text-transform: uppercase; border-radius: 3px;">
                  Odpovedať zákazníkovi
                </a>
              </td>
            </tr>

            <!-- FOOTER: quote ID -->
            <tr>
              <td class="footer-cell" style="background-color: #ffffff; border-top: 1px solid #eeeeee;
                         padding: 14px 40px 20px 40px;">
                <p class="footer-id" style="margin: 0; font-size: 11px; color: #cccccc; font-weight: 300;">
                  ID: ${quote.id}
                </p>
              </td>
            </tr>

          </table>
        </div>
        <!-- /BIELA KARTA -->

      </td>
    </tr>
  </table>

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
<html lang="sk" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
  :root { color-scheme: light only; }
  body { margin: 0; padding: 0; }

  /* ── DARK MODE: Apple Mail, Outlook app ── */
  /* email-outer a email-header zostávajú zlaté cez PNG background-image — nepotrebujú override */
  @media (prefers-color-scheme: dark) {
    .email-card   { background-color: #1e1e1e !important; overflow: hidden !important; }
    .email-body   { background-color: #1e1e1e !important; }
    .footer-cell  { background-color: #1e1e1e !important; border-top-color: #333333 !important; }
    .email-text   { color: #f0f0f0 !important; }
    .email-subtext { color: #aaaaaa !important; }
    .email-step-text { color: #cccccc !important; }
    .dekor-card   { background-color: #2a2a2a !important; }
    .dekor-label  { color: #ECD488 !important; }
    .footer-text  { color: #888888 !important; }
    .footer-link  { color: #f0f0f0 !important; }
    .footer-small { color: #666666 !important; }
    .cta-btn      { background-color: #ECD488 !important; color: #1A1A1A !important; }
  }

  /* ── DARK MODE: Gmail (data-ogsc) ── */
  [data-ogsc] .email-card   { background-color: #1e1e1e !important; }
  [data-ogsc] .email-body   { background-color: #1e1e1e !important; }
  [data-ogsc] .footer-cell  { background-color: #1e1e1e !important; border-top-color: #333333 !important; }
  [data-ogsc] .email-text   { color: #f0f0f0 !important; }
  [data-ogsc] .email-subtext { color: #aaaaaa !important; }
  [data-ogsc] .email-step-text { color: #cccccc !important; }
  [data-ogsc] .dekor-card   { background-color: #2a2a2a !important; }
  [data-ogsc] .dekor-label  { color: #ECD488 !important; }
  [data-ogsc] .footer-text  { color: #888888 !important; }
  [data-ogsc] .footer-link  { color: #f0f0f0 !important; }
  [data-ogsc] .footer-small { color: #666666 !important; }
  [data-ogsc] .cta-btn      { background-color: #ECD488 !important; color: #1A1A1A !important; }
</style>
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; margin: 0; padding: 0;">

  <!-- OUTER: zlaté pozadie — background-image zabraňuje konverzii v dark mode -->
  <table class="email-outer" width="100%" cellpadding="0" cellspacing="0"
         style="background-color: #ECD488;
                background-image: url('https://www.orostone.sk/images/email-gold-bg.png');
                background-repeat: repeat;
                border-collapse: collapse;">
    <tr>
      <td class="email-outer" style="background-color: #ECD488;
                background-image: url('https://www.orostone.sk/images/email-gold-bg.png');
                background-repeat: repeat;
                padding: 36px 16px 40px 16px;">

        <!-- LOGO: vycentrované v zlatej ploche nad kartou -->
        <div style="max-width: 560px; margin: 0 auto; text-align: center; padding-bottom: 24px;">
          <img src="${LOGO_URL}" alt="Orostone" class="logo-img"
               style="height: 42px; display: inline-block;">
        </div>

        <!-- BIELA KARTA: div wrapper zaručuje overflow:hidden + border-radius na všetkých 4 rohoch -->
        <div class="email-card" style="max-width: 560px; margin: 0 auto; border-radius: 16px;
                    overflow: hidden; background-color: #ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">

            <!-- HERO TEXT -->
            <tr>
              <td class="email-body" style="background-color: #ffffff; padding: 44px 40px 28px 40px; text-align: center;">
                <h1 class="email-text" style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #1A1A1A; letter-spacing: -0.02em;">
                  Ďakujeme, ${firstName}!
                </h1>
                <p class="email-subtext" style="margin: 0; font-size: 16px; font-weight: 300; color: #666666; line-height: 1.6;">
                  Vaša žiadosť o vzorku bola úspešne prijatá.
                </p>
              </td>
            </tr>

            <!-- ZLATÁ LINKA -->
            <tr>
              <td class="email-body" style="background-color: #ffffff; padding: 0 40px 28px 40px;">
                <div style="height: 2px; background-color: #ECD488; border-radius: 1px;"></div>
              </td>
            </tr>

            <!-- DEKOR KARTA -->
            <tr>
              <td class="email-body" style="background-color: #ffffff; padding: 0 40px 32px 40px;">
                <div class="dekor-card" style="background-color: #F9F9F7; border-left: 4px solid #ECD488;
                            border-radius: 0 8px 8px 0; padding: 16px 20px;">
                  <p class="dekor-label" style="margin: 0 0 4px 0; font-size: 10px; font-weight: 700;
                            letter-spacing: 0.25em; text-transform: uppercase; color: #B8960C;">Váš vybraný dekor</p>
                  <p class="email-text" style="margin: 0; font-size: 18px; font-weight: 700; color: #1A1A1A;">
                    ${quote.decor ?? '—'}
                  </p>
                </div>
              </td>
            </tr>

            <!-- ČO SA STANE ĎALEJ -->
            <tr>
              <td class="email-body" style="background-color: #ffffff; padding: 0 40px 36px 40px;">
                <p class="email-text" style="margin: 0 0 16px 0; font-size: 13px; font-weight: 700;
                          letter-spacing: 0.15em; text-transform: uppercase; color: #1A1A1A;">Čo sa stane ďalej?</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align: top; padding-bottom: 14px;">
                      <table cellpadding="0" cellspacing="0"><tr>
                        <td style="vertical-align: top; width: 32px;">
                          <div style="width: 24px; height: 24px; background-color: #ECD488; border-radius: 50%;
                                      text-align: center; line-height: 24px; font-size: 11px; font-weight: 700; color: #1A1A1A;">1</div>
                        </td>
                        <td class="email-step-text" style="padding-left: 12px; font-size: 14px; font-weight: 300; color: #444444; line-height: 1.5;">
                          Overíme dostupnosť vzorky dekoru <strong style="font-weight: 600;">${quote.decor ?? ''}</strong>
                        </td>
                      </tr></table>
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: top; padding-bottom: 14px;">
                      <table cellpadding="0" cellspacing="0"><tr>
                        <td style="vertical-align: top; width: 32px;">
                          <div style="width: 24px; height: 24px; background-color: #ECD488; border-radius: 50%;
                                      text-align: center; line-height: 24px; font-size: 11px; font-weight: 700; color: #1A1A1A;">2</div>
                        </td>
                        <td class="email-step-text" style="padding-left: 12px; font-size: 14px; font-weight: 300; color: #444444; line-height: 1.5;">
                          Kontaktujeme vás do <strong style="font-weight: 600;">24 hodín</strong> s potvrdením a detailmi doručenia
                        </td>
                      </tr></table>
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: top;">
                      <table cellpadding="0" cellspacing="0"><tr>
                        <td style="vertical-align: top; width: 32px;">
                          <div style="width: 24px; height: 24px; background-color: #ECD488; border-radius: 50%;
                                      text-align: center; line-height: 24px; font-size: 11px; font-weight: 700; color: #1A1A1A;">3</div>
                        </td>
                        <td class="email-step-text" style="padding-left: 12px; font-size: 14px; font-weight: 300; color: #444444; line-height: 1.5;">
                          Fyzická vzorka vám dorazí <strong style="font-weight: 600;">poštou zadarmo</strong>
                        </td>
                      </tr></table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA TLAČIDLO -->
            <tr>
              <td class="email-body" style="background-color: #ffffff; padding: 0 40px 44px 40px; text-align: center;">
                <a href="https://www.orostone.sk" class="cta-btn"
                   style="display: inline-block; background-color: #1A1A1A; color: #ffffff; padding: 14px 36px;
                          text-decoration: none; font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
                          text-transform: uppercase; border-radius: 3px;">
                  Navštíviť Orostone.sk
                </a>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td class="footer-cell" style="background-color: #ffffff; border-top: 1px solid #eeeeee;
                         padding: 28px 40px 32px 40px; text-align: center;">
                <img src="${LOGO_CIRCLE_URL}" alt="Orostone"
                     style="height: 32px; display: inline-block; margin-bottom: 14px; opacity: 0.5;">
                <p class="footer-text" style="margin: 0 0 6px 0; font-size: 12px; color: #999999; font-weight: 300;">
                  V prípade otázok nás kontaktujte:
                </p>
                <p style="margin: 0; font-size: 12px;">
                  <a href="mailto:info@orostone.sk" class="footer-link"
                     style="color: #1A1A1A; text-decoration: none; font-weight: 600;">info@orostone.sk</a>
                  &nbsp;·&nbsp;
                  <a href="tel:+421917588738" class="footer-link"
                     style="color: #1A1A1A; text-decoration: none; font-weight: 600;">+421 917 588 738</a>
                </p>
                <p class="footer-small" style="margin: 10px 0 0 0; font-size: 11px; color: #bbbbbb; font-weight: 300;">
                  Orostone s.r.o. &nbsp;·&nbsp; Landererova 8, 811 09 Bratislava
                  &nbsp;·&nbsp; <a href="https://www.orostone.sk" class="footer-small"
                     style="color: #bbbbbb; text-decoration: none;">www.orostone.sk</a>
                </p>
              </td>
            </tr>

          </table>
        </div>
        <!-- /BIELA KARTA -->

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
