// ===========================================
// EDGE FUNCTION: alfapureo-order
// ===========================================
// Zaplatené objednávky vzoriek posiela do Alfapureo s.r.o., ktoré za Orostone balí a posiela
// vzorky (kuriér GLS). Volá ju Shopify webhook „Order payment“ (orders/paid), nastavený v
// Shopify admin → Settings → Notifications → Webhooks.
//
//   1. Overí podpis Shopify (X-Shopify-Hmac-Sha256, secret SHOPIFY_WEBHOOK_SECRET). Ručné
//      preposlanie alebo test smie poslať aj volajúci s tajným kľúčom projektu (isServiceRole),
//      vtedy funkcia počká na odpoveď Alfapurea a vráti ju. Keď podpis príde, ale nesedí (napr.
//      zlý SHOPIFY_WEBHOOK_SECRET), funkcia vráti 401 a pošle upozornenie na info@orostone.sk,
//      najviac raz za deň. Hlavičky si volí odosielateľ, kľúč podľa nich by ktokoľvek s URL
//      funkcie zneužil na neobmedzené e-maily.
//   2. Prepustí len objednávky vzoriek (atribút košíka _orostone_flow = samples, nastavuje ho
//      services/shopify/samples.ts). Objednávky platní a ich zákazníci do Alfapurea nejdú.
//   3. Telo pošle bez zmeny (formát Shopify webhooku orders/create, ako chce Alfapureo) na
//      ALFAPUREO_ORDER_URL. Podpíše ho rovnakým spôsobom ako Shopify, ale tajným kľúčom
//      ALFAPUREO_SECRET, takže Alfapureo overí podpis bežným kódom pre Shopify webhooky.
//      Názov a kód vzorky sú v line_items[].properties: „Vzorka N“ a „_sample_code_N“. Kód je
//      aj vo viditeľnom „Kód vzorky N“ hneď pod názvom (admin Shopify, pokladňa, potvrdenie).
//   4. Shopify čaká na odpoveď najviac 5 s, server Alfapurea sa môže prebúdzať dlhšie. Funkcia
//      preto Shopify odpovie hneď a posiela na pozadí, 3 pokusy. Keď všetky zlyhajú, príde
//      upozornenie na info@orostone.sk s číslom objednávky, aby sa dala poslať ručne.
//      Opakované doručenie tej istej objednávky má Alfapureo rozpoznať podľa order id
//      (alebo hlavičky X-Shopify-Webhook-Id).

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { isServiceRole } from '../_shared/auth.ts';
import { sendEmail } from '../_shared/resend.ts';
import { escapeHtml } from '../_shared/escape.ts';

const SHOPIFY_WEBHOOK_SECRET = Deno.env.get('SHOPIFY_WEBHOOK_SECRET') ?? '';
const ALFAPUREO_ORDER_URL = Deno.env.get('ALFAPUREO_ORDER_URL') ?? '';
const ALFAPUREO_SECRET = Deno.env.get('ALFAPUREO_SECRET') ?? '';
const ALERT_EMAIL = 'info@orostone.sk';
const FROM_EMAIL = 'Orostone <noreply@orostone.sk>';

const ATTEMPT_TIMEOUT_MS = 40_000;
const RETRY_DELAYS_MS = [5_000, 10_000];

async function hmacBase64(secret: string, body: Uint8Array<ArrayBuffer>): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, body));
  return btoa(String.fromCharCode(...signature));
}

function timingSafeEqual(given: string, expected: string): boolean {
  const a = new TextEncoder().encode(given);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < b.length; i++) diff |= (a[i] ?? 0) ^ b[i];
  return diff === 0;
}

async function isFromShopify(req: Request, body: Uint8Array<ArrayBuffer>): Promise<boolean> {
  const given = req.headers.get('x-shopify-hmac-sha256') ?? '';
  if (!SHOPIFY_WEBHOOK_SECRET || !given) return false;
  return timingSafeEqual(given, await hmacBase64(SHOPIFY_WEBHOOK_SECRET, body));
}

type Order = {
  id?: number;
  name?: string;
  financial_status?: string;
  note_attributes?: Array<{ name: string; value: string }>;
};

function isSampleOrder(order: Order): boolean {
  return order.note_attributes?.some(a => a.name === '_orostone_flow' && a.value === 'samples') === true;
}

type ForwardResult = { ok: boolean; status?: number; body?: string; error?: string; attempts: number };

async function forwardOnce(req: Request, body: Uint8Array<ArrayBuffer>): Promise<{ status: number; body: string }> {
  const res = await fetch(ALFAPUREO_ORDER_URL, {
    method: 'POST',
    signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Hmac-Sha256': await hmacBase64(ALFAPUREO_SECRET, body),
      'X-Shopify-Topic': req.headers.get('x-shopify-topic') ?? 'orders/paid',
      'X-Shopify-Shop-Domain': req.headers.get('x-shopify-shop-domain') ?? 'orostone-2.myshopify.com',
      'X-Shopify-Webhook-Id': req.headers.get('x-shopify-webhook-id') ?? crypto.randomUUID(),
      'X-Shopify-API-Version': req.headers.get('x-shopify-api-version') ?? '',
    },
    body,
  });
  return { status: res.status, body: (await res.text()).slice(0, 500) };
}

async function forward(req: Request, body: Uint8Array<ArrayBuffer>, order: Order): Promise<ForwardResult> {
  let last: ForwardResult = { ok: false, attempts: 0 };
  for (let attempt = 1; attempt <= RETRY_DELAYS_MS.length + 1; attempt++) {
    try {
      const res = await forwardOnce(req, body);
      last = { ok: res.status >= 200 && res.status < 300, status: res.status, body: res.body, attempts: attempt };
      console.log(`[alfapureo-order] ${order.name} pokus ${attempt}: HTTP ${res.status}`);
      if (last.ok) return last;
    } catch (err) {
      last = { ok: false, error: err instanceof Error ? err.message : String(err), attempts: attempt };
      console.error(`[alfapureo-order] ${order.name} pokus ${attempt}: ${last.error}`);
    }
    const delay = RETRY_DELAYS_MS[attempt - 1];
    if (delay) await new Promise(resolve => setTimeout(resolve, delay));
  }
  await sendEmail({
    from: FROM_EMAIL,
    to: ALERT_EMAIL,
    subject: `Vzorky ${order.name}: objednávka sa neodoslala do Alfapureo`,
    html: `<p>Objednávku vzoriek <strong>${escapeHtml(order.name ?? String(order.id))}</strong> sa nepodarilo odoslať
      do Alfapureo ani na ${last.attempts}. pokus.</p>
      <p>Posledná odpoveď: ${escapeHtml(last.status ? `HTTP ${last.status} ${last.body ?? ''}` : last.error ?? 'bez odpovede')}</p>
      <p>Pošlite im ju prosím ručne, inak balík neodíde.</p>`,
    idempotencyKey: `alfapureo-order-failed-${order.id}`,
    onMissingKey: 'skip',
  }).catch(err => console.error('[alfapureo-order] upozornenie sa neodoslalo:', err));
  return last;
}

async function alertBadSignature(req: Request, body: Uint8Array<ArrayBuffer>): Promise<void> {
  // Telo nie je overené, preto číslo objednávky len v bežnom tvare (ORO-1014, #1014).
  let name: string | undefined;
  try {
    const order: Order | null = JSON.parse(new TextDecoder().decode(body));
    if (typeof order?.name === 'string' && /^[\w#-]{1,32}$/.test(order.name)) name = order.name;
  } catch {
    // telo nie je JSON, upozornenie odíde bez čísla objednávky
  }
  await sendEmail({
    from: FROM_EMAIL,
    to: ALERT_EMAIL,
    subject: `Vzorky${name ? ` ${name}` : ''}: podpis Shopify nesedí, objednávky nejdú do Alfapureo`,
    html: `<p>Webhook zo Shopify${name ? ` k objednávke <strong>${escapeHtml(name)}</strong>` : ''} má podpis
      (X-Shopify-Hmac-Sha256), ktorý nesedí so SHOPIFY_WEBHOOK_SECRET v Supabase (alebo kľúč chýba).
      Funkcia alfapureo-order ho odmietla (HTTP 401), takže objednávky vzoriek sa nedostávajú do Alfapureo.</p>
      <p>Toto upozornenie príde najviac raz za deň, pri prvej odmietnutej objednávke. Ďalšie
      objednávky v ten deň mohli zlyhať rovnako.</p>
      <p>Nastavte prosím SHOPIFY_WEBHOOK_SECRET na kľúč, ktorým Shopify podpisuje webhooky
      (Settings → Notifications → Webhooks), v Shopify skontrolujte všetky zaplatené objednávky
      vzoriek z tohto obdobia a pošlite ich Alfapureo ručne.</p>`,
    idempotencyKey: `alfapureo-order-bad-signature-${new Date().toISOString().slice(0, 10)}`,
    onMissingKey: 'skip',
  }).catch(err => console.error('[alfapureo-order] upozornenie sa neodoslalo:', err));
}

/** Keeps the worker alive after the response until the task settles (Supabase Edge Runtime: waitUntil). */
function inBackground(task: Promise<unknown>): void {
  const runtime = (globalThis as { EdgeRuntime?: { waitUntil(p: Promise<unknown>): void } }).EdgeRuntime;
  if (runtime?.waitUntil) runtime.waitUntil(task);
  else task.catch(() => {});
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const body = new Uint8Array(await req.arrayBuffer());
  const manual = isServiceRole(req);
  if (!manual && !(await isFromShopify(req, body))) {
    if (req.headers.has('x-shopify-hmac-sha256')) inBackground(alertBadSignature(req, body));
    return json({ error: 'Unauthorized' }, 401);
  }
  if (!ALFAPUREO_ORDER_URL || !ALFAPUREO_SECRET) {
    console.error('[alfapureo-order] chýba ALFAPUREO_ORDER_URL alebo ALFAPUREO_SECRET');
    return json({ error: 'Not configured' }, 500);
  }

  let order: Order;
  try {
    order = JSON.parse(new TextDecoder().decode(body));
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  if (!isSampleOrder(order)) return json({ skipped: 'not a sample order' });
  if (order.financial_status !== 'paid') return json({ skipped: `financial_status ${order.financial_status}` });

  if (manual) return json(await forward(req, body, order));
  inBackground(forward(req, body, order));
  return json({ accepted: order.name });
});
