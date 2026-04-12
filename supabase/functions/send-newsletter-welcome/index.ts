// ===========================================
// EDGE FUNCTION: send-newsletter-welcome
// ===========================================
// Volanie: POST { email: string; name?: string }
//
// DEPLOYMENT:
// supabase functions deploy send-newsletter-welcome --project-ref xfkznvqufhnrphpdhfnc

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = 'Orostone <noreply@orostone.sk>';
const LOGO_URL = 'https://www.orostone.sk/images/orostone-logo-email.png';
const LOGO_CIRCLE_URL = 'https://www.orostone.sk/images/logo-circle.png';
const DISCOUNT_CODE = 'WELCOME5';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Chýba email' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const firstName = name ? name.split(' ')[0] : null;
    const greeting = firstName ? `Vitajte, ${firstName}!` : 'Vitajte v Orostone!';

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
  @media (prefers-color-scheme: dark) {
    .email-card   { background-color: #1e1e1e !important; overflow: hidden !important; }
    .email-body   { background-color: #1e1e1e !important; }
    .footer-cell  { background-color: #1e1e1e !important; border-top-color: #333333 !important; }
    .email-text   { color: #f0f0f0 !important; }
    .email-subtext { color: #aaaaaa !important; }
    .email-step-text { color: #cccccc !important; }
    .code-box     { background-color: #2a2000 !important; border-color: #ECD488 !important; }
    .code-text    { color: #ECD488 !important; }
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
  [data-ogsc] .code-box     { background-color: #2a2000 !important; border-color: #ECD488 !important; }
  [data-ogsc] .code-text    { color: #ECD488 !important; }
  [data-ogsc] .footer-text  { color: #888888 !important; }
  [data-ogsc] .footer-link  { color: #f0f0f0 !important; }
  [data-ogsc] .footer-small { color: #666666 !important; }
  [data-ogsc] .cta-btn      { background-color: #ECD488 !important; color: #1A1A1A !important; }
</style>
</head>
<body style="font-family: 'Montserrat', Arial, sans-serif; margin: 0; padding: 0;">

  <!-- OUTER: zlaté pozadie -->
  <table class="email-outer" width="100%" cellpadding="0" cellspacing="0"
         style="background-color: #ECD488;
                background-image: url('https://orostone.sk/images/email-gold-bg.png');
                background-repeat: repeat;
                border-collapse: collapse;">
    <tr>
      <td class="email-outer" style="background-color: #ECD488;
                background-image: url('https://orostone.sk/images/email-gold-bg.png');
                background-repeat: repeat;
                padding: 36px 16px 40px 16px;">

        <!-- LOGO -->
        <div style="max-width: 560px; margin: 0 auto; text-align: center; padding-bottom: 24px;">
          <img src="${LOGO_URL}" alt="Orostone"
               style="height: 42px; display: inline-block;">
        </div>

        <!-- BIELA KARTA -->
        <div class="email-card" style="max-width: 560px; margin: 0 auto; border-radius: 16px;
                    overflow: hidden; background-color: #ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">

            <!-- HERO TEXT -->
            <tr>
              <td class="email-body" style="background-color: #ffffff; padding: 44px 40px 28px 40px; text-align: center;">
                <h1 class="email-text" style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #1A1A1A; letter-spacing: -0.02em;">
                  ${greeting}
                </h1>
                <p class="email-subtext" style="margin: 0; font-size: 16px; font-weight: 300; color: #666666; line-height: 1.6;">
                  Ďakujeme za prihlásenie na odber noviniek Orostone.<br>Ako poďakovanie máte zľavu 5&nbsp;% na prvý nákup.
                </p>
              </td>
            </tr>

            <!-- ZLATÁ LINKA -->
            <tr>
              <td class="email-body" style="background-color: #ffffff; padding: 0 40px 32px 40px;">
                <div style="height: 2px; background-color: #ECD488; border-radius: 1px;"></div>
              </td>
            </tr>

            <!-- ZĽAVOVÝ KÓD -->
            <tr>
              <td class="email-body" style="background-color: #ffffff; padding: 0 40px 36px 40px; text-align: center;">
                <p class="email-text" style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700;
                          letter-spacing: 0.2em; text-transform: uppercase; color: #1A1A1A;">
                  Váš zľavový kód
                </p>
                <div class="code-box" style="display: inline-block; background-color: #FFFBEA;
                            border: 2px solid #ECD488; border-radius: 8px;
                            padding: 16px 40px;">
                  <span class="code-text" style="font-size: 28px; font-weight: 700; letter-spacing: 0.15em; color: #B8960C;">
                    ${DISCOUNT_CODE}
                  </span>
                </div>
                <p class="email-subtext" style="margin: 12px 0 0 0; font-size: 13px; font-weight: 300; color: #888888;">
                  Platí na prvý nákup v e-shope orostone.sk
                </p>
              </td>
            </tr>

            <!-- ČO VÁS ČAKÁ -->
            <tr>
              <td class="email-body" style="background-color: #ffffff; padding: 0 40px 36px 40px;">
                <p class="email-text" style="margin: 0 0 16px 0; font-size: 13px; font-weight: 700;
                          letter-spacing: 0.15em; text-transform: uppercase; color: #1A1A1A;">Ako uplatniť kód?</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align: top; padding-bottom: 14px;">
                      <table cellpadding="0" cellspacing="0"><tr>
                        <td style="vertical-align: top; width: 32px;">
                          <div style="width: 24px; height: 24px; background-color: #ECD488; border-radius: 50%;
                                      text-align: center; line-height: 24px; font-size: 11px; font-weight: 700; color: #1A1A1A;">1</div>
                        </td>
                        <td class="email-step-text" style="padding-left: 12px; font-size: 14px; font-weight: 300; color: #444444; line-height: 1.5;">
                          Prezrite si naše <strong style="font-weight: 600;">prémiové kolekcie</strong> na orostone.sk
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
                          Pri objednávke zadajte kód <strong style="font-weight: 600;">${DISCOUNT_CODE}</strong> do poľa pre zľavový kód
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
                          Užite si <strong style="font-weight: 600;">prémiový sinterovaný kameň</strong> so zľavou 5&nbsp;%
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
                <a href="https://orostone.sk" class="cta-btn"
                   style="display: inline-block; background-color: #1A1A1A; color: #ffffff; padding: 14px 36px;
                          text-decoration: none; font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
                          text-transform: uppercase; border-radius: 3px;">
                  Nakupovať →
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
                <p class="footer-small" style="margin: 10px 0 0 0; font-size: 10px; color: #cccccc; font-weight: 300;">
                  Dostali ste tento email, pretože ste sa prihlásili na odber noviniek Orostone.
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

    await sendEmail({ to: email, subject: 'Vitajte v Orostone — vaša 5% zľava je tu', html });

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  } catch (err) {
    console.error('[send-newsletter-welcome] Chyba:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

interface EmailParams { to: string; subject: string; html: string; }

async function sendEmail({ to, subject, html }: EmailParams) {
  if (!RESEND_API_KEY) {
    console.warn('[send-newsletter-welcome] RESEND_API_KEY nie je nastavený — preskakujem email');
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

  console.log(`[send-newsletter-welcome] Email odoslaný na ${to}`);
}
