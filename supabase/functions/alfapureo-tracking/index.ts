// ===========================================
// EDGE FUNCTION: alfapureo-tracking
// ===========================================
// Alfapureo s.r.o. po odoslaní balíka vzoriek (GLS) pošle odkaz na sledovanie:
//   POST { "order_number": "1014" | "ORO-1014", "tracking_url": "https://…" }
// Funkcia objednávku v Shopify označí ako odoslanú s týmto sledovaním a Shopify zákazníkovi
// pošle e-mail o odoslaní. Ak už odoslaná je, sledovanie len aktualizuje.
//
//   1. Podpis: hlavička X-Orostone-Hmac-Sha256 (alebo X-Shopify-Hmac-Sha256) = base64
//      HMAC-SHA256 tela, rovnaký kľúč ALFAPUREO_SECRET ako pri objednávkach (alfapureo-order).
//   2. Prístup do Shopify: aplikácia „Orostone Alfapureo“ z Dev Dashboardu, nainštalovaná v
//      obchode, client credentials grant (SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET). Token platí
//      24 h, preto sa pýta pri každom volaní (volaní je pár denne).
//   3. Spracuje len objednávky vzoriek (_orostone_flow = samples), objednávky platní nie.
//
// Odpovede: 200 hotovo, 400 zlé dáta, 401 zlý podpis, 404 objednávka nenájdená, 502 chyba Shopify.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ALFAPUREO_SECRET = Deno.env.get('ALFAPUREO_SECRET') ?? '';
const SHOP = Deno.env.get('SHOPIFY_SHOP_DOMAIN') ?? 'jtshug-bn.myshopify.com';
const CLIENT_ID = Deno.env.get('SHOPIFY_CLIENT_ID') ?? '';
const CLIENT_SECRET = Deno.env.get('SHOPIFY_CLIENT_SECRET') ?? '';
const API_VERSION = '2026-10';
const CARRIER = 'GLS';

async function hmacBase64(secret: string, body: Uint8Array<ArrayBuffer>): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC', key, body))));
}

function timingSafeEqual(given: string, expected: string): boolean {
  const a = new TextEncoder().encode(given);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < b.length; i++) diff |= (a[i] ?? 0) ^ b[i];
  return diff === 0;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

/** "1014", "#1014", "ORO-1014" → "ORO-1014". */
export function orderName(value: unknown): string | null {
  const s = String(value ?? '').trim().toUpperCase().replace(/^#/, '');
  const m = /^(?:ORO-)?(\d{1,10})$/.exec(s);
  return m ? `ORO-${m[1]}` : null;
}

/** Číslo zásielky z odkazu GLS, ak sa dá vyčítať (parameter alebo posledná číselná časť cesty). */
export function trackingNumber(url: URL): string | undefined {
  for (const key of ['match', 'parcelNumber', 'parcelno', 'trackingNumber', 'tracking', 'number', 'id']) {
    const v = url.searchParams.get(key)?.trim();
    if (v && /^[A-Z0-9]{6,40}$/i.test(v)) return v;
  }
  const last = url.pathname.split('/').filter(Boolean).pop();
  return last && /^\d{8,20}$/.test(last) ? last : undefined;
}

async function accessToken(): Promise<string> {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' }),
    signal: AbortSignal.timeout(10_000),
  });
  const data = await res.json().catch(() => ({}));
  // Shopify vráti napr. {error: 'invalid_client', error_description: …}; neobsahuje tajné údaje.
  if (!res.ok || !data.access_token) throw new Error(`Shopify token HTTP ${res.status}: ${data.error ?? ''} ${data.error_description ?? ''}`.trim());
  return data.access_token;
}

async function admin<T>(token: string, query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(15_000),
  });
  const data = await res.json();
  if (!res.ok || data.errors) throw new Error(`Shopify GraphQL: ${JSON.stringify(data.errors ?? res.status)}`);
  return data.data as T;
}

type OrderNode = {
  id: string;
  name: string;
  customAttributes: Array<{ key: string; value: string }>;
  fulfillmentOrders: { nodes: Array<{ id: string; status: string }> };
  fulfillments: Array<{ id: string; status: string; trackingInfo: Array<{ url: string | null }> }>;
};

serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!ALFAPUREO_SECRET || !CLIENT_ID || !CLIENT_SECRET) {
    console.error('[alfapureo-tracking] chýba ALFAPUREO_SECRET, SHOPIFY_CLIENT_ID alebo SHOPIFY_CLIENT_SECRET');
    return json({ error: 'Not configured' }, 500);
  }

  const body = new Uint8Array(await req.arrayBuffer());
  const given = req.headers.get('x-orostone-hmac-sha256') ?? req.headers.get('x-shopify-hmac-sha256') ?? '';
  if (!given || !timingSafeEqual(given, await hmacBase64(ALFAPUREO_SECRET, body))) return json({ error: 'Unauthorized' }, 401);

  let input: { order_number?: unknown; tracking_url?: unknown };
  try {
    input = JSON.parse(new TextDecoder().decode(body));
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  const name = orderName(input.order_number);
  let url: URL;
  try {
    url = new URL(String(input.tracking_url ?? ''));
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error();
  } catch {
    return json({ error: 'tracking_url must be a valid http(s) URL' }, 400);
  }
  if (!name) return json({ error: 'order_number must look like 1014 or ORO-1014' }, 400);

  try {
    const token = await accessToken();
    const found = await admin<{ orders: { nodes: OrderNode[] } }>(token, `query Order($q: String!) {
      orders(first: 1, query: $q) { nodes {
        id name customAttributes { key value }
        fulfillmentOrders(first: 10) { nodes { id status } }
        fulfillments(first: 10) { id status trackingInfo { url } }
      } }
    }`, { q: `name:${name}` });
    const order = found.orders.nodes.find(o => o.name === name);
    if (!order) return json({ error: `Order ${name} not found` }, 404);
    if (!order.customAttributes.some(a => a.key === '_orostone_flow' && a.value === 'samples')) {
      return json({ error: `Order ${name} is not a sample order` }, 400);
    }

    const tracking = { company: CARRIER, url: url.href, number: trackingNumber(url) };
    const open = order.fulfillmentOrders.nodes.filter(f => f.status === 'OPEN' || f.status === 'IN_PROGRESS');

    if (open.length) {
      const res = await admin<{ fulfillmentCreate: { fulfillment: { id: string } | null; userErrors: Array<{ message: string }> } }>(token, `mutation Fulfill($f: FulfillmentInput!) {
        fulfillmentCreate(fulfillment: $f) { fulfillment { id } userErrors { message } }
      }`, { f: { lineItemsByFulfillmentOrder: open.map(f => ({ fulfillmentOrderId: f.id })), trackingInfo: tracking, notifyCustomer: true } });
      if (res.fulfillmentCreate.userErrors.length) throw new Error(res.fulfillmentCreate.userErrors.map(e => e.message).join('; '));
      console.log(`[alfapureo-tracking] ${name} odoslaná, sledovanie uložené`);
      return json({ ok: true, order: name, action: 'fulfilled' });
    }

    const fulfillment = order.fulfillments.find(f => f.status === 'SUCCESS');
    if (!fulfillment) return json({ error: `Order ${name} has nothing to fulfil` }, 400);
    if (fulfillment.trackingInfo.some(t => t.url === url.href)) return json({ ok: true, order: name, action: 'unchanged' });
    const res = await admin<{ fulfillmentTrackingInfoUpdate: { userErrors: Array<{ message: string }> } }>(token, `mutation Track($id: ID!, $t: FulfillmentTrackingInput!) {
      fulfillmentTrackingInfoUpdate(fulfillmentId: $id, trackingInfoInput: $t, notifyCustomer: true) { userErrors { message } }
    }`, { id: fulfillment.id, t: tracking });
    if (res.fulfillmentTrackingInfoUpdate.userErrors.length) throw new Error(res.fulfillmentTrackingInfoUpdate.userErrors.map(e => e.message).join('; '));
    console.log(`[alfapureo-tracking] ${name} sledovanie aktualizované`);
    return json({ ok: true, order: name, action: 'tracking_updated' });
  } catch (err) {
    console.error(`[alfapureo-tracking] ${name}:`, err instanceof Error ? err.message : err);
    return json({ error: 'Shopify error, try again later' }, 502);
  }
});
