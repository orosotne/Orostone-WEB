/**
 * Generates machine-readability artifacts into dist/ AFTER vite build + prerender:
 *   - dist/sitemap-eshop.xml   (from the canonical route registry)
 *   - dist/llms.txt            (from scripts/templates/llms.template.txt)
 *   - dist/llms-full.txt       (from scripts/templates/llms-full.template.txt)
 *
 * All dynamic content (products, prices, blog articles) comes from the same
 * data modules the prerender consumes, so these artifacts can never drift
 * from what is actually served. Generated files land ONLY in dist/ — the
 * static public/ copies were removed; do not recreate them.
 *
 * Run: tsx scripts/generate-seo-artifacts.ts (called by `npm run build`)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildRouteRegistry, loadFallbackProducts, BASE_URL, type RouteEntry } from './lib/routes';
import { getPublishedArticles } from '../data/blogArticles';
import { LLMS_PRODUCT_CONTENT } from '../data/llmsProductBlurbs';
import { SLAB_PRICE_MIN, SLAB_PRICE_MAX } from '../data/pricing';
import { calculateSlabPrice } from '../lib/slab';

const ROOT = resolve(process.cwd());
const DIST = resolve(ROOT, 'dist');
const TEMPLATES = resolve(ROOT, 'scripts/templates');

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

function generateSitemap(routes: RouteEntry[]): string {
  const urls = routes
    .map((r) => {
      const loc = r.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${r.path}`;
      const lines = ['  <url>', `    <loc>${loc}</loc>`];
      if (r.lastmod) lines.push(`    <lastmod>${r.lastmod}</lastmod>`);
      lines.push(
        `    <changefreq>${r.changefreq}</changefreq>`,
        `    <priority>${r.priority}</priority>`,
        '  </url>',
      );
      return lines.join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// ---------------------------------------------------------------------------
// llms.txt / llms-full.txt
// ---------------------------------------------------------------------------

const eur = (n: number): string => n.toFixed(2);

function priceLine(p: any): string {
  const slabTotal = calculateSlabPrice(p.pricePerM2, p.dimensions);
  return `Price: ${eur(p.pricePerM2)} €/m² incl. VAT (slab ${p.dimensions} ≈ ${eur(slabTotal)} € incl. VAT)`;
}

function productCatalogShort(products: any[]): string {
  const entries = products.map((p, i) => {
    const curated = LLMS_PRODUCT_CONTENT[p.id];
    const num = String(i + 1).padStart(2, '0');
    const lines = [
      `### ${num}. ${p.name}`,
      `- URL: ${BASE_URL}/produkt/${p.id}`,
      `- ${priceLine(p)}`,
      `- ${curated?.blurb || p.metaDescription || ''}`,
    ];
    if (p.keywords?.length) lines.push(`- Keywords: ${p.keywords.join(', ')}`);
    return lines.join('\n');
  });

  return `## Product Catalog — ${products.length} Large-Format Slab Designs\n\n${entries.join('\n\n')}`;
}

function productCatalogFull(products: any[]): string {
  const entries = products.map((p, i) => {
    const curated = LLMS_PRODUCT_CONTENT[p.id];
    const num = String(i + 1).padStart(2, '0');
    const lines = [
      `### ${num}. ${p.name}`,
      `- URL: ${BASE_URL}/produkt/${p.id}`,
      `- ${priceLine(p)}`,
      `- Format: ${p.dimensions}, thickness ${p.thickness}${p.finish ? `, finish ${p.finish}` : ''}`,
      `- SKU: ${p.sku}`,
    ];
    if (curated?.style) lines.push(`- Style: ${curated.style}`);
    if (curated?.bestFor) lines.push(`- Best for: ${curated.bestFor}`);
    if (curated?.finishes) lines.push(`- Finishes: ${curated.finishes}`);
    if (curated?.special) lines.push(`- Special: ${curated.special}`);
    if (!curated) lines.push(`- ${p.metaDescription || ''}`);
    if (p.keywords?.length) lines.push(`- SEO keywords: ${p.keywords.join(', ')}`);
    return lines.join('\n');
  });

  return entries.join('\n\n');
}

function blogList(): string {
  return getPublishedArticles()
    .map((a) => {
      const summary = a.en?.directAnswer || a.en?.excerpt || a.sk.directAnswer || a.sk.excerpt;
      return `- [${a.en?.title || a.sk.title}](${BASE_URL}/blog/${a.slug}): ${summary}`;
    })
    .join('\n');
}

function blogInsights(): string {
  return getPublishedArticles()
    .map((a) => {
      const summary = a.en?.directAnswer || a.en?.excerpt || a.sk.directAnswer || a.sk.excerpt;
      return `### ${a.en?.title || a.sk.title}\nURL: ${BASE_URL}/blog/${a.slug}\nKey takeaways: ${summary}`;
    })
    .join('\n\n');
}

function fillTemplate(templateFile: string, replacements: Record<string, string>): string {
  let out = readFileSync(resolve(TEMPLATES, templateFile), 'utf-8');
  for (const [marker, value] of Object.entries(replacements)) {
    if (!out.includes(`{{${marker}}}`)) {
      throw new Error(`Template ${templateFile} is missing marker {{${marker}}}`);
    }
    out = out.replaceAll(`{{${marker}}}`, value);
  }
  const leftover = out.match(/\{\{[A-Z_]+\}\}/);
  if (leftover) throw new Error(`Template ${templateFile} has unfilled marker ${leftover[0]}`);
  return out;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const routes = buildRouteRegistry();
const products = loadFallbackProducts();

writeFileSync(resolve(DIST, 'sitemap-eshop.xml'), generateSitemap(routes), 'utf-8');
console.log(`✅ dist/sitemap-eshop.xml — ${routes.length} URLs`);

writeFileSync(
  resolve(DIST, 'llms.txt'),
  fillTemplate('llms.template.txt', {
    PRODUCT_CATALOG: productCatalogShort(products),
    BLOG_ARTICLES: blogList(),
  }),
  'utf-8',
);
console.log(`✅ dist/llms.txt — ${products.length} products, ${getPublishedArticles().length} articles`);

writeFileSync(
  resolve(DIST, 'llms-full.txt'),
  fillTemplate('llms-full.template.txt', {
    PRODUCT_CATALOG_FULL: productCatalogFull(products),
    BLOG_INSIGHTS: blogInsights(),
    SLAB_PRICE_MIN: eur(SLAB_PRICE_MIN),
    SLAB_PRICE_MAX: eur(SLAB_PRICE_MAX),
  }),
  'utf-8',
);
console.log('✅ dist/llms-full.txt');
