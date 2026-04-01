import type { VercelRequest, VercelResponse } from '@vercel/node';
import fallbackProducts from '../data/shop-products-fallback.json';

/**
 * OG Meta Tag Server for Product Pages
 *
 * Social media crawlers (Facebook, LinkedIn, WhatsApp, Twitter, etc.)
 * don't execute JavaScript, so they can't see OG tags set by the SPA.
 * This serverless function returns a minimal HTML page with correct
 * product-specific OG meta tags for crawler requests.
 *
 * Routed via vercel.json rewrite with user-agent `has` condition.
 */

interface FallbackProduct {
  id: string;
  name: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  image: string;
  gallery?: string[];
  pricePerM2: number;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const slug = req.query.slug as string | undefined;

  if (!slug) {
    return res.redirect(301, 'https://orostone.sk/');
  }

  const product = (fallbackProducts as FallbackProduct[]).find(
    (p) => p.id === slug
  );

  if (!product) {
    return res.redirect(302, `https://orostone.sk/produkt/${slug}`);
  }

  const title =
    product.metaTitle ||
    `${product.name} | Veľkoformátové platne | OROSTONE`;
  const description =
    product.metaDescription ||
    product.description.slice(0, 200);
  const image =
    product.gallery && product.gallery.length > 0
      ? product.gallery[0]
      : product.image;
  const url = `https://orostone.sk/produkt/${product.id}`;

  const html = `<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeAttr(description)}" />

  <!-- Open Graph -->
  <meta property="og:site_name" content="OROSTONE" />
  <meta property="og:title" content="${escapeAttr(title)}" />
  <meta property="og:description" content="${escapeAttr(description)}" />
  <meta property="og:type" content="product" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${escapeAttr(image)}" />
  <meta property="og:image:alt" content="${escapeAttr(product.name)}" />
  <meta property="og:locale" content="sk_SK" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeAttr(title)}" />
  <meta name="twitter:description" content="${escapeAttr(description)}" />
  <meta name="twitter:image" content="${escapeAttr(image)}" />

  <link rel="canonical" href="${url}" />
</head>
<body></body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  return res.status(200).send(html);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
