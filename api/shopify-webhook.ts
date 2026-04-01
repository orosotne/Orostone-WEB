import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac } from 'crypto';
import { buffer } from 'micro';

/**
 * Shopify Webhook Handler
 *
 * Receives product/collection change webhooks from Shopify and triggers
 * a Vercel redeploy so the prerendered pages get fresh data.
 *
 * Supported Shopify webhook topics:
 *   products/create, products/update, products/delete
 *   collections/create, collections/update, collections/delete
 *
 * Environment variables required:
 *   SHOPIFY_WEBHOOK_SECRET — Shopify webhook HMAC secret
 *   VERCEL_DEPLOY_HOOK_URL — Vercel Deploy Hook URL (triggers redeploy)
 */

// Disable Vercel's default body parser so we can read raw bytes for HMAC
export const config = {
  api: {
    bodyParser: false,
  },
};

function verifyShopifyHmac(rawBody: Buffer, hmacHeader: string, secret: string): boolean {
  const hash = createHmac('sha256', secret).update(rawBody).digest('base64');
  return hash === hmacHeader;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.SHOPIFY_WEBHOOK_SECRET?.trim();
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL?.trim();

  if (!secret || !deployHookUrl) {
    console.error('Missing SHOPIFY_WEBHOOK_SECRET or VERCEL_DEPLOY_HOOK_URL');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  // Verify Shopify HMAC signature
  const hmac = req.headers['x-shopify-hmac-sha256'] as string;
  if (!hmac) {
    return res.status(401).json({ error: 'Missing HMAC header' });
  }

  // Read raw body bytes for accurate HMAC verification
  const rawBody = await buffer(req);
  if (!verifyShopifyHmac(rawBody, hmac, secret)) {
    return res.status(401).json({ error: 'Invalid HMAC signature' });
  }

  const topic = req.headers['x-shopify-topic'] as string;
  console.log(`Shopify webhook received: ${topic}`);

  // Trigger Vercel redeploy
  try {
    const response = await fetch(deployHookUrl, { method: 'POST' });
    if (!response.ok) {
      console.error(`Deploy hook failed: ${response.status}`);
      return res.status(502).json({ error: 'Deploy hook failed' });
    }

    console.log(`Redeploy triggered for topic: ${topic}`);
    return res.status(200).json({ ok: true, topic, redeployed: true });
  } catch (err) {
    console.error('Deploy hook error:', err);
    return res.status(502).json({ error: 'Deploy hook error' });
  }
}
