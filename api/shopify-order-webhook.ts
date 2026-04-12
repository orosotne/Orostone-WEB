import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac } from 'crypto';
import { buffer } from 'micro';

/**
 * Shopify Order Webhook → GA4 Measurement Protocol
 *
 * Receives Shopify `orders/paid` webhook and sends a server-side
 * `purchase` event to GA4 via the Measurement Protocol.
 *
 * This is a backup for the client-side purchase tracking in ThankYou.tsx.
 * If the user closes the browser before the thank-you page loads,
 * this webhook ensures the purchase is still recorded in GA4.
 *
 * Environment variables required:
 *   SHOPIFY_WEBHOOK_SECRET  — Shopify webhook HMAC secret
 *   GA4_MEASUREMENT_ID      — e.g. G-W3ZPVYZ9HQ
 *   GA4_MP_API_SECRET       — Measurement Protocol API secret (GA4 Admin → Data Streams)
 */

export const config = {
  api: { bodyParser: false },
};

function verifyHmac(raw: Buffer, hmac: string, secret: string): boolean {
  return createHmac('sha256', secret).update(raw).digest('base64') === hmac;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.SHOPIFY_WEBHOOK_SECRET?.trim();
  const gaMeasurementId = process.env.GA4_MEASUREMENT_ID?.trim();
  const gaApiSecret = process.env.GA4_MP_API_SECRET?.trim();

  if (!secret || !gaMeasurementId || !gaApiSecret) {
    console.error('Missing env: SHOPIFY_WEBHOOK_SECRET, GA4_MEASUREMENT_ID, or GA4_MP_API_SECRET');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const hmac = req.headers['x-shopify-hmac-sha256'] as string;
  if (!hmac) {
    return res.status(401).json({ error: 'Missing HMAC header' });
  }

  const rawBody = await buffer(req);
  if (!verifyHmac(rawBody, hmac, secret)) {
    return res.status(401).json({ error: 'Invalid HMAC signature' });
  }

  const order = JSON.parse(rawBody.toString());

  // Build GA4 Measurement Protocol payload
  const items = (order.line_items || []).map((li: any) => ({
    item_id: li.product_id?.toString() || li.sku || 'unknown',
    item_name: li.title || li.name,
    price: parseFloat(li.price) || 0,
    quantity: li.quantity || 1,
  }));

  const payload = {
    // Server-side events use a synthetic client_id since there's no browser
    client_id: `shopify_${order.id}`,
    events: [
      {
        name: 'purchase',
        params: {
          currency: order.currency || 'EUR',
          transaction_id: `shopify_${order.name || order.order_number}`,
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
    });

    // GA4 MP returns 204 on success
    if (!mpRes.ok) {
      console.error(`GA4 MP error: ${mpRes.status} ${await mpRes.text()}`);
      return res.status(502).json({ error: 'GA4 Measurement Protocol failed' });
    }

    console.log(`GA4 purchase sent: ${order.name}, ${order.currency} ${order.total_price}`);
    return res.status(200).json({ ok: true, order: order.name });
  } catch (err) {
    console.error('GA4 MP error:', err);
    return res.status(502).json({ error: 'GA4 MP error' });
  }
}
