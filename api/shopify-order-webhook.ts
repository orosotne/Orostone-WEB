import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'crypto';
import { buffer } from 'micro';

/**
 * Shopify Order Webhook → GA4 Measurement Protocol
 *
 * Receives Shopify `orders/paid`. Purchase measurement is owned by Shopify's
 * official Google channel. This legacy endpoint verifies the webhook and
 * acknowledges it without sending GA4 events unless an operator explicitly
 * sets GA4_LEGACY_PURCHASE_ENABLED=true while the official emitter is disabled.
 *
 * REFACTOR (finding f04): four coupled defects fixed, behaviour preserved:
 *   1. Unguarded JSON.parse → an HMAC-valid-but-malformed body threw a 500,
 *      Shopify retried the identical body, and after ~19 failures/48h Shopify
 *      DELETES the subscription. Now parsed inside try, returns 200.
 *   2. 502-on-MP-failure fed the same disable spiral (e.g. a rotated MP secret).
 *      Once the HMAC is verified the event is OURS to own: we always return 200
 *      and log MP failures for out-of-band alerting instead of asking Shopify
 *      to retry a delivery a retry cannot fix.
 *   3. No idempotency → Shopify at-least-once delivery could double-send. We now
 *      dedupe on `x-shopify-webhook-id` within the instance (best-effort;
 *      promote to Upstash/KV for cross-instance guarantees — see note below).
 *   4. The local thank-you page no longer treats a saved cart as a purchase.
 *      The legacy payload below is retained only as an explicitly enabled
 *      fallback, never a second emitter beside Shopify's Google channel.
 *
 * Environment variables required:
 *   SHOPIFY_WEBHOOK_SECRET  — Shopify webhook HMAC secret
 * Optional legacy fallback only:
 *   GA4_LEGACY_PURCHASE_ENABLED — must be exactly "true"; default is disabled
 *   GA4_MEASUREMENT_ID          — e.g. G-W3ZPVYZ9HQ
 *   GA4_MP_API_SECRET           — Measurement Protocol API secret
 */

export const config = {
  api: { bodyParser: false },
};

function verifyHmac(raw: Buffer, hmac: string, secret: string): boolean {
  const hash = createHmac('sha256', secret).update(raw).digest('base64');
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(hmac));
  } catch {
    return false;
  }
}

// Best-effort in-instance idempotency. A warm Fluid Compute instance serves many
// invocations, so this catches Shopify's rapid duplicate retries. For a hard
// guarantee across cold starts, replace with a KV/Upstash SETNX on the id with a
// 24h TTL — the interface (has/add) stays the same.
const processedWebhookIds = new Set<string>();
const MAX_TRACKED_IDS = 1000;
function alreadyProcessed(id: string | undefined): boolean {
  if (!id) return false;
  if (processedWebhookIds.has(id)) return true;
  if (processedWebhookIds.size >= MAX_TRACKED_IDS) {
    // Bounded memory: drop the oldest ~half.
    const keep = Array.from(processedWebhookIds).slice(MAX_TRACKED_IDS / 2);
    processedWebhookIds.clear();
    keep.forEach((k) => processedWebhookIds.add(k));
  }
  processedWebhookIds.add(id);
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.SHOPIFY_WEBHOOK_SECRET?.trim();
  if (!secret) {
    // Genuine server misconfiguration — a 500 here is correct: retries WILL
    // succeed once the env is fixed, and this fires before the HMAC check so it
    // cannot be triggered by an attacker with a valid-looking body.
    console.error(JSON.stringify({ level: 'error', msg: 'order-webhook misconfigured', route: '/api/shopify-order-webhook' }));
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const hmac = req.headers['x-shopify-hmac-sha256'] as string | undefined;
  if (!hmac) {
    return res.status(401).json({ error: 'Missing HMAC header' });
  }

  const rawBody = await buffer(req);
  if (!verifyHmac(rawBody, hmac, secret)) {
    return res.status(401).json({ error: 'Invalid HMAC signature' });
  }

  // ---- From here the delivery is authenticated and OURS to acknowledge. ----
  // Any failure past this point returns 200 so Shopify never disables the
  // subscription for a problem a retry cannot fix. Failures are logged instead.

  const webhookId = req.headers['x-shopify-webhook-id'] as string | undefined;

  let order: any;
  try {
    order = JSON.parse(rawBody.toString());
  } catch (err) {
    console.error(JSON.stringify({
      level: 'error', msg: 'unparseable order body (HMAC-valid)', webhookId,
      error: err instanceof Error ? err.message : String(err),
    }));
    return res.status(200).json({ ok: false, reason: 'unparseable' });
  }

  if (process.env.GA4_LEGACY_PURCHASE_ENABLED !== 'true') {
    return res.status(200).json({ ok: true, purchaseTracking: 'shopify_google_channel' });
  }
  const gaMeasurementId = process.env.GA4_MEASUREMENT_ID?.trim();
  const gaApiSecret = process.env.GA4_MP_API_SECRET?.trim();
  if (!gaMeasurementId || !gaApiSecret) {
    console.error(JSON.stringify({ level: 'error', msg: 'legacy GA4 purchase fallback misconfigured', webhookId }));
    return res.status(200).json({ ok: false, reason: 'legacy_tracking_unconfigured' });
  }
  if (alreadyProcessed(webhookId)) {
    console.log(JSON.stringify({ level: 'info', msg: 'duplicate webhook ignored', webhookId }));
    return res.status(200).json({ ok: true, deduped: true });
  }

  // Preserve the legacy identifier only for the explicitly enabled fallback.
  // It must never run alongside the official Google channel's purchase event.
  const orderNumber = order.name || order.order_number;
  const transactionId = `shopify_${orderNumber}`;

  const items = (order.line_items || []).map((li: any) => ({
    item_id: li.product_id?.toString() || li.sku || 'unknown',
    item_name: li.title || li.name,
    price: parseFloat(li.price) || 0,
    quantity: li.quantity || 1,
  }));

  const payload = {
    client_id: `shopify_${order.id}`,
    events: [
      {
        name: 'purchase',
        params: {
          currency: order.currency || 'EUR',
          transaction_id: transactionId,
          value: parseFloat(order.total_price) || 0,
          items,
        },
      },
    ],
  };

  try {
    const mpUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${gaMeasurementId}&api_secret=${gaApiSecret}`;
    const mpRes = await fetch(mpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    });

    // NOTE: GA4 /mp/collect returns 204 even for REJECTED payloads (a wrong
    // api_secret cannot be detected here). Validate the payload against
    // /debug/mp/collect in a staging check, not in this hot path.
    if (!mpRes.ok) {
      console.error(JSON.stringify({
        level: 'error', msg: 'GA4 MP non-2xx', webhookId, status: mpRes.status,
        body: (await mpRes.text()).slice(0, 500),
      }));
      // Do NOT 502 — that would trip Shopify's disable spiral. Ack and alert.
      return res.status(200).json({ ok: false, reason: 'mp_failed' });
    }

    console.log(JSON.stringify({
      level: 'info', msg: 'GA4 purchase sent', webhookId,
      transaction_id: transactionId, currency: order.currency, value: order.total_price,
    }));
    return res.status(200).json({ ok: true, order: orderNumber });
  } catch (err) {
    console.error(JSON.stringify({
      level: 'error', msg: 'GA4 MP dispatch error', webhookId,
      error: err instanceof Error ? err.message : String(err),
    }));
    return res.status(200).json({ ok: false, reason: 'mp_error' });
  }
}
