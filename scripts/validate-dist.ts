/**
 * Build-time validation gate — the LAST step of `npm run build`.
 * Converts "single source of truth" from convention into guarantee:
 * any drift between the route registry, the prerendered dist/ output,
 * the generated sitemap and llms.txt FAILS the build with a named reason.
 *
 * Run: tsx scripts/validate-dist.ts (called by `npm run build`)
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildRouteRegistry, loadFallbackProducts, BASE_URL } from './lib/routes';
import { getPublishedArticles } from '../data/blogArticles';
import { BLOG_ARTICLES_LISTING } from '../data/blogArticlesMeta';

const DIST = resolve(process.cwd(), 'dist');

/**
 * Minimum acceptable Offer.price on product pages. Slab totals are ~1700–2200 €;
 * per-m² rates are ~330–430 €. Until the shared Product JSON-LD builder ships
 * (Offer.price = slab total), the prerender emits per-m² — keep this at 100 to
 * catch zero/garbage prices, then raise to 500 once the builder lands so an
 * accidental per-m² regression fails the build.
 */
const MIN_PRODUCT_OFFER_PRICE = 100;

const errors: string[] = [];
const fail = (msg: string): void => {
  errors.push(msg);
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractJsonLdBlocks(html: string): any[] {
  const blocks: any[] = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      fail(`invalid JSON-LD (unparseable block): ${m[1].slice(0, 120)}…`);
    }
  }
  return blocks;
}

function distHtmlPath(route: string): string {
  return route === '/'
    ? resolve(DIST, 'index.html')
    : resolve(DIST, route.replace(/^\//, ''), 'index.html');
}

// ---------------------------------------------------------------------------
// 1. Registry ⇔ dist parity + per-page checks
// ---------------------------------------------------------------------------

const routes = buildRouteRegistry();

for (const route of routes) {
  const file = distHtmlPath(route.path);
  if (!existsSync(file)) {
    fail(`registry route ${route.path} has no prerendered file (${file})`);
    continue;
  }
  const html = readFileSync(file, 'utf-8');

  // Exactly one canonical, matching the route
  const canonicals = html.match(/<link rel="canonical" href="([^"]+)"/g) || [];
  if (canonicals.length !== 1) {
    fail(`${route.path}: expected exactly 1 canonical, found ${canonicals.length}`);
  } else {
    const expected = route.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${route.path}`;
    const actual = canonicals[0].match(/href="([^"]+)"/)![1];
    if (actual !== expected) fail(`${route.path}: canonical ${actual} ≠ ${expected}`);
  }

  // Non-empty title
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  if (!title.trim()) fail(`${route.path}: empty <title>`);

  // All JSON-LD blocks must parse (collected errors inside)
  const blocks = extractJsonLdBlocks(html);

  // Product pages: Product schema with a sane Offer
  if (route.kind === 'product') {
    const product = blocks.find((b) => b['@type'] === 'Product');
    if (!product) {
      fail(`${route.path}: missing Product JSON-LD`);
    } else {
      const price = Number(product.offers?.price);
      if (!(price > MIN_PRODUCT_OFFER_PRICE)) {
        fail(`${route.path}: Offer.price ${product.offers?.price} not > ${MIN_PRODUCT_OFFER_PRICE}`);
      }
      if (product.offers?.priceCurrency !== 'EUR') {
        fail(`${route.path}: Offer.priceCurrency ${product.offers?.priceCurrency} ≠ EUR`);
      }
      if (!product.offers?.availability) fail(`${route.path}: Offer.availability missing`);
      if (!product.image || (Array.isArray(product.image) && product.image.length === 0)) {
        fail(`${route.path}: Product.image missing`);
      }
    }
  }

  // Pillar/info pages with FAQ or comparison data must serve them statically
  if (route.kind === 'info') {
    const info = route.ref as any;
    if (info?.faqs?.length && !blocks.find((b) => b['@type'] === 'FAQPage')) {
      fail(`${route.path}: pillar page has FAQs but no FAQPage JSON-LD`);
    }
    if (info?.faqs?.length && !html.includes('<details>')) {
      fail(`${route.path}: pillar page has FAQs but no <details> in HTML`);
    }
    if (info?.comparison && !html.includes('<table>')) {
      fail(`${route.path}: pillar page has comparison data but no <table> in HTML`);
    }
  }

  // /kuchyne is prerendered by its own function — enforce its FAQ coverage too
  if (route.path === '/kuchyne') {
    if (!blocks.find((b) => b['@type'] === 'FAQPage')) {
      fail(`${route.path}: missing FAQPage JSON-LD`);
    }
    if (!html.includes('<details>')) fail(`${route.path}: missing FAQ <details> in HTML`);
  }

  // Article pages: BlogPosting + FAQPage when the article has FAQs
  if (route.kind === 'article') {
    if (!blocks.find((b) => b['@type'] === 'BlogPosting')) {
      fail(`${route.path}: missing BlogPosting JSON-LD`);
    }
    const article = route.ref as any;
    if (article?.sk?.faqs?.length && !blocks.find((b) => b['@type'] === 'FAQPage')) {
      fail(`${route.path}: article has FAQs but no FAQPage JSON-LD`);
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Blog registry ⇔ listing parity (the drift class fixed in Krok 0)
// ---------------------------------------------------------------------------

const articleSlugs = new Set(getPublishedArticles().map((a) => a.slug));
const listingSlugs = new Set(BLOG_ARTICLES_LISTING.map((a) => a.slug));
for (const slug of articleSlugs) {
  if (!listingSlugs.has(slug)) fail(`article ${slug} missing from BLOG_ARTICLES_META listing`);
}
for (const slug of listingSlugs) {
  if (!articleSlugs.has(slug)) fail(`listing slug ${slug} has no published article`);
}

// ---------------------------------------------------------------------------
// 3. Sitemap ⇔ registry parity
// ---------------------------------------------------------------------------

const sitemapPath = resolve(DIST, 'sitemap-eshop.xml');
if (!existsSync(sitemapPath)) {
  fail('dist/sitemap-eshop.xml missing');
} else {
  const sitemap = readFileSync(sitemapPath, 'utf-8');
  const locs = new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      m[1].replace(BASE_URL, '').replace(/^$/, '/'),
    ),
  );
  const registryPaths = new Set(routes.map((r) => r.path));
  for (const p of registryPaths) {
    if (!locs.has(p)) fail(`sitemap missing registry route ${p}`);
  }
  for (const l of locs) {
    if (!registryPaths.has(l)) fail(`sitemap contains unknown URL ${l}`);
  }
}

// ---------------------------------------------------------------------------
// 4. llms.txt coverage
// ---------------------------------------------------------------------------

const llmsPath = resolve(DIST, 'llms.txt');
if (!existsSync(llmsPath)) {
  fail('dist/llms.txt missing');
} else {
  const llms = readFileSync(llmsPath, 'utf-8');
  for (const p of loadFallbackProducts()) {
    if (!llms.includes(`${BASE_URL}/produkt/${p.id}`)) {
      fail(`llms.txt missing product URL /produkt/${p.id}`);
    }
  }
  for (const a of getPublishedArticles()) {
    if (!llms.includes(`${BASE_URL}/blog/${a.slug}`)) {
      fail(`llms.txt missing article URL /blog/${a.slug}`);
    }
  }
}
if (!existsSync(resolve(DIST, 'llms-full.txt'))) fail('dist/llms-full.txt missing');

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------

if (errors.length) {
  console.error(`\n❌ validate-dist: ${errors.length} problem(s):\n`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error('');
  process.exit(1);
}

console.log(`✅ validate-dist: ${routes.length} routes OK (JSON-LD, canonicals, sitemap, llms.txt)`);
