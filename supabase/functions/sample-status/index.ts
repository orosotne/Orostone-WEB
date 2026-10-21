// ===========================================
// EDGE FUNCTION: sample-status
// ===========================================
// Prehľad objednávok vzoriek za posledných 60 dní: zaplatené → dorazila do Alfapurea → odoslaná
// GLS (číslo zásielky) → doručená. Zoznam berie zo Shopify, takže aj objednávka, ktorá k nám
// nikdy nedorazila (zlý podpis, zmazaný webhook), je v ňom ako „nedorazila do Alfapurea“.
//
//   1. Objednávky: Shopify Admin API (aplikácia z Dev Dashboardu, client credentials, rovnako
//      ako alfapureo-tracking; Shopify bez read_all_orders dá len posledných 60 dní).
//   2. Dorazila do Alfapurea: tabuľka alfapureo_forwarding (zapisuje alfapureo-order).
//   3. Stav a „viazne“ určuje status.ts.
//
// Volajúci:
//   - CRM (crm.orostone.sk/admin/vzorky) s kľúčom SAMPLE_STATUS_KEY v hlavičke
//     x-sample-status-key → JSON so zoznamom. Kľúč smie len čítať tento prehľad.
//   - Ranná kontrola .github/workflows/sample-status-alert.yml s tajným kľúčom sb_secret_…
//     v hlavičke apikey a telom {"alert": true}: keď niektorá objednávka viazne, pošle e-mail
//     na info@orostone.sk (najviac jeden za deň).
// Odpoveď je bez osobných údajov (číslo objednávky, dekory, časy, sledovanie GLS); meno
// a adresu ukáže až Shopify po kliknutí na objednávku.
//
// DEPLOYMENT (z koreňa repa, verify_jwt = false berie zo supabase/config.toml):
//   supabase functions deploy sample-status --project-ref xfkznvqufhnrphpdhfnc

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isServiceRole } from '../_shared/auth.ts';
import { escapeHtml } from '../_shared/escape.ts';
import { sendEmail } from '../_shared/resend.ts';
import { isSampleOrder, sampleStatus, type Forwarding, type SampleOrder, type ShopifyOrder } from './status.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const SAMPLE_STATUS_KEY = Deno.env.get('SAMPLE_STATUS_KEY') ?? '';
const SHOP = Deno.env.get('SHOPIFY_SHOP_DOMAIN') ?? 'jtshug-bn.myshopify.com';
const CLIENT_ID = Deno.env.get('SHOPIFY_CLIENT_ID') ?? '';
const CLIENT_SECRET = Deno.env.get('SHOPIFY_CLIENT_SECRET') ?? '';
const API_VERSION = '2026-10';
const DAYS = 60;
const MAX_PAGES = 10;
const ALERT_EMAIL = 'info@orostone.sk';
const FROM_EMAIL = 'Orostone <noreply@orostone.sk>';
const CRM_URL = 'https://crm.orostone.sk/admin/vzorky';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

function timingSafeEqual(given: string, expected: string): boolean {
  const a = new TextEncoder().encode(given);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < b.length; i++) diff |= (a[i] ?? 0) ^ b[i];
  return diff === 0;
}

function hasStatusKey(req: Request): boolean {
  return !!SAMPLE_STATUS_KEY && timingSafeEqual(req.headers.get('x-sample-status-key') ?? '', SAMPLE_STATUS_KEY);
}

async function accessToken(): Promise<string> {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' }),
    signal: AbortSignal.timeout(10_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new Error(`Shopify token HTTP ${res.status}: ${data.error ?? ''} ${data.error_description ?? ''}`.trim());
  return data.access_token;
}

const ORDERS_QUERY = `query SampleOrders($q: String!, $after: String) {
  orders(first: 100, after: $after, sortKey: CREATED_AT, reverse: true, query: $q) {
    pageInfo { hasNextPage endCursor }
    nodes {
      legacyResourceId name createdAt displayFinancialStatus cancelledAt
      customAttributes { key value }
      lineItems(first: 10) { nodes { customAttributes { key value } } }
      transactions(first: 10) { kind status processedAt }
      fulfillments(first: 10) { status createdAt deliveredAt trackingInfo { number url } }
    }
  }
}`;

type OrdersPage = { orders: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: ShopifyOrder[] } };

/** Objednávky vzoriek za posledných DAYS dní, najnovšie prvé. */
async function sampleOrders(since: Date): Promise<ShopifyOrder[]> {
  const token = await accessToken();
  const out: ShopifyOrder[] = [];
  let after: string | null = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    const res: Response = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query: ORDERS_QUERY, variables: { q: `created_at:>=${since.toISOString().slice(0, 10)}`, after } }),
      signal: AbortSignal.timeout(15_000),
    });
    const data: { data?: OrdersPage; errors?: unknown } = await res.json();
    if (!res.ok || data.errors || !data.data) throw new Error(`Shopify GraphQL: ${JSON.stringify(data.errors ?? res.status)}`);
    const orders = data.data.orders;
    out.push(...orders.nodes.filter(isSampleOrder));
    if (!orders.pageInfo.hasNextPage) break;
    after = orders.pageInfo.endCursor;
  }
  return out;
}

async function forwardings(orderIds: string[]): Promise<Map<string, Forwarding>> {
  if (!orderIds.length) return new Map();
  const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
  const { data, error } = await db
    .from('alfapureo_forwarding')
    .select('order_id, forwarded_at, last_attempt_at, last_http_status, last_attempts, last_error')
    .in('order_id', orderIds);
  if (error) throw new Error(`alfapureo_forwarding: ${error.message}`);
  return new Map((data as Forwarding[]).map(row => [String(row.order_id), row]));
}

async function alert(stuck: SampleOrder[]): Promise<void> {
  const rows = stuck.map(o => `<li><a href="${escapeHtml(o.adminUrl)}"><strong>${escapeHtml(o.order)}</strong></a>
    (${escapeHtml(o.samples.join(', ') || 'bez dekoru')}): ${escapeHtml(o.stuck ?? '')}</li>`).join('');
  const result = await sendEmail({
    from: FROM_EMAIL,
    to: ALERT_EMAIL,
    subject: `Vzorky: ${stuck.length === 1 ? `${stuck[0].order} viazne` : `${stuck.length} objednávky viaznu`}`,
    html: `<p>Ranná kontrola objednávok vzoriek našla:</p><ul>${rows}</ul>
      <p>Celý prehľad: <a href="${CRM_URL}">${CRM_URL}</a></p>`,
    // Ručné spustenie v ten istý deň s tými istými objednávkami e-mail nezopakuje.
    idempotencyKey: `sample-status-alert-${new Date().toISOString().slice(0, 10)}-${stuck.map(o => o.order).join('-')}`.slice(0, 256),
  });
  if (!result.ok) throw new Error(`Resend: ${result.error ?? 'e-mail sa neodoslal'}`);
}

serve(async (req) => {
  const cron = isServiceRole(req);
  if (!cron && !hasStatusKey(req)) return json({ error: 'Unauthorized' }, 401);
  if (!CLIENT_ID || !CLIENT_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('[sample-status] chýba SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET alebo prístup do Supabase');
    return json({ error: 'Not configured' }, 500);
  }
  const wantsAlert = cron && req.method === 'POST' && (await req.json().catch(() => ({})))?.alert === true;

  try {
    const now = new Date();
    const orders = await sampleOrders(new Date(now.getTime() - DAYS * 86_400_000));
    const sent = await forwardings(orders.map(o => o.legacyResourceId));
    const list = orders.map(o => sampleStatus(o, sent.get(o.legacyResourceId), now, SHOP));
    const stuck = list.filter(o => o.stuck);
    if (wantsAlert && stuck.length) await alert(stuck);
    console.log(`[sample-status] ${list.length} objednávok, viazne ${stuck.length}${wantsAlert ? ', kontrola' : ''}`);
    return json({ success: true, generatedAt: now.toISOString(), days: DAYS, orders: list, stuck: stuck.length });
  } catch (err) {
    console.error('[sample-status]', err instanceof Error ? err.message : err);
    return json({ success: false, error: 'Prehľad sa nepodarilo načítať' }, 502);
  }
});
