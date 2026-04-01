/**
 * Post-build prerender script.
 * Generates static HTML pages for blog articles and product pages from bundled data.
 * Crawlers without JS see full content; React hydrates on top for real users.
 *
 * Run: tsx scripts/prerender.ts (automatically called by `npm run build`)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

// ---------------------------------------------------------------------------
// Data imports
// ---------------------------------------------------------------------------

const ROOT = resolve(process.cwd());
const DIST = resolve(ROOT, 'dist');
const BASE_URL = 'https://orostone.sk';

// Read built index.html as template
const baseHtml = readFileSync(resolve(DIST, 'index.html'), 'utf-8');

// Blog articles (full content — TypeScript dynamic import via tsx)
const { BLOG_ARTICLES } = await import('../data/blogArticles.js');
const { BLOG_ARTICLES_LISTING } = await import('../data/blogArticlesMeta.js');

// Product fallback data
const products: any[] = JSON.parse(
  readFileSync(resolve(ROOT, 'data/shop-products-fallback.json'), 'utf-8'),
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function absoluteImage(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

function optimizeOgImage(url: string): string {
  const abs = absoluteImage(url);
  if (abs.includes('cdn.shopify.com') && !abs.includes('width=')) {
    return abs + (abs.includes('?') ? '&' : '?') + 'width=1200';
  }
  return abs;
}

// ---------------------------------------------------------------------------
// Page writer
// ---------------------------------------------------------------------------

interface Page {
  route: string;
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  rootContent: string;
  jsonLd?: object[];
}

let count = 0;

function writePage(page: Page): void {
  let html = baseHtml;

  // <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`);

  // meta description
  html = html.replace(
    /(<meta name="description" content=")[^"]*(")/,
    `$1${esc(page.description)}$2`,
  );

  // OG tags
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(page.title)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(page.description)}$2`);
  html = html.replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${page.ogType || 'website'}$2`);
  if (page.ogImage) {
    html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${page.ogImage}$2`);
    html = html.replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${esc(page.title)}$2`);
    // Remove misleading og:image dimensions for custom images
    // (actual dimensions of Shopify/external images differ from the 1200x630 default)
    if (!page.ogImage.includes('og-orostone.png')) {
      html = html.replace(/\s*<meta property="og:image:width"[^>]*\/?>\n?/g, '\n');
      html = html.replace(/\s*<meta property="og:image:height"[^>]*\/?>\n?/g, '');
    }
  }

  // Twitter Card
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(page.title)}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(page.description)}$2`);
  if (page.ogImage) {
    html = html.replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${page.ogImage}$2`);
  }

  // Canonical
  const canonicalTag = `    <link rel="canonical" href="${page.canonical}" />\n`;
  html = html.replace('</head>', `${canonicalTag}</head>`);

  // Page-specific JSON-LD (appended before </head>, site-wide schemas stay)
  if (page.jsonLd?.length) {
    const scripts = page.jsonLd
      .map((ld) => `    <script type="application/ld+json">${JSON.stringify(ld)}</script>`)
      .join('\n');
    html = html.replace('</head>', `${scripts}\n</head>`);
  }

  // Insert semantic content into <div id="root">
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${page.rootContent}</div>`,
  );

  // Remove <noscript> homepage fallback — prerendered content is already in #root
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, '');

  // Write file
  const filePath = resolve(DIST, page.route.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, html, 'utf-8');
  count++;
}

// ---------------------------------------------------------------------------
// Blog article pages
// ---------------------------------------------------------------------------

function prerenderBlogArticle(article: any): void {
  const c = article.sk;
  const canonical = `${BASE_URL}/blog/${article.slug}`;
  const ogImage = optimizeOgImage(article.heroImage);

  const faqHtml = c.faqs?.length
    ? `<section><h2>Často kladené otázky</h2>${c.faqs
        .map((f: any) => `<details><summary>${esc(f.question)}</summary><p>${f.answer}</p></details>`)
        .join('')}</section>`
    : '';

  writePage({
    route: `/blog/${article.slug}`,
    title: `${c.title} | OROSTONE Blog`,
    description: (c.directAnswer || c.excerpt).slice(0, 300),
    canonical,
    ogImage,
    ogType: 'article',
    rootContent: `
      <article>
        <nav aria-label="breadcrumb"><a href="/">OROSTONE</a> &rsaquo; <a href="/blog">Blog</a> &rsaquo; ${esc(c.title)}</nav>
        <h1>${esc(c.title)}</h1>
        <p><em>${esc(c.subtitle)}</em></p>
        <p><strong>${esc(c.directAnswer || c.excerpt)}</strong></p>
        <p><time datetime="${article.publishDate}">${article.publishDate}</time> &middot; ${article.readTimeMinutes} min čítanie &middot; ${esc(article.author?.name || 'OROSTONE tím')}</p>
        <div>${c.content}</div>
        ${faqHtml}
      </article>`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: c.title,
        description: c.directAnswer || c.excerpt,
        image: ogImage,
        datePublished: article.publishDate,
        dateModified: article.lastModified || article.publishDate,
        inLanguage: 'sk-SK',
        keywords: article.tags.join(', '),
        author: {
          '@type': 'Person',
          name: article.author?.name || 'OROSTONE tím',
          worksFor: { '@type': 'Organization', name: 'OROSTONE', url: BASE_URL },
        },
        publisher: {
          '@type': 'Organization',
          name: 'OROSTONE',
          logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/brand/orostone-circle.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OROSTONE', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: c.title, item: canonical },
        ],
      },
      ...(c.faqs?.length
        ? [
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: c.faqs.map((f: any) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            },
          ]
        : []),
    ],
  });
}

// ---------------------------------------------------------------------------
// Blog listing page
// ---------------------------------------------------------------------------

function prerenderBlogListing(): void {
  const published = (BLOG_ARTICLES_LISTING as any[]).filter(
    (a) => new Date(a.publishDate) <= new Date(),
  );

  const listHtml = published
    .map(
      (a: any) => `
      <article>
        <h2><a href="/blog/${a.slug}">${esc(a.sk.title)}</a></h2>
        <p>${esc(a.sk.excerpt)}</p>
        <p><time datetime="${a.publishDate}">${a.publishDate}</time> &middot; ${a.readTimeMinutes} min</p>
      </article>`,
    )
    .join('');

  writePage({
    route: '/blog',
    title: 'Blog | OROSTONE — Sinterovaný kameň',
    description:
      'Odborné články o sinterovanom kameni — porovnania, údržba, inštalácia, certifikácie a praktické rady.',
    canonical: `${BASE_URL}/blog`,
    rootContent: `
      <nav aria-label="breadcrumb"><a href="/">OROSTONE</a> &rsaquo; Blog</nav>
      <h1>Blog — Sinterovaný kameň</h1>
      <p>Odborné články o sinterovanom kameni od OROSTONE tímu.</p>
      ${listHtml}`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OROSTONE', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
        ],
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Product pages
// ---------------------------------------------------------------------------

function prerenderProduct(product: any): void {
  const canonical = `${BASE_URL}/produkt/${product.id}`;
  const ogImage = optimizeOgImage(product.image);

  const specs = [
    ['Rozmer', product.dimensions],
    ['Hrúbka', product.thickness],
    ['Povrch', product.finish],
    ['Materiál', product.material],
    ['Tepelná odolnosť', product.heatResistance],
    ['Odolnosť proti škrabancom', product.scratchResistance],
    ['Nasiakavosť', product.porosity],
    ['Hmotnosť', product.weight ? `${product.weight} kg` : null],
    ['SKU', product.sku],
  ].filter(([, v]) => v);

  const specsHtml = `<table>${specs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>`;

  const benefitsHtml = product.keyBenefits?.length
    ? `<h2>Výhody</h2><ul>${product.keyBenefits.map((b: string) => `<li>${esc(b)}</li>`).join('')}</ul>`
    : '';

  const appsHtml = product.applications?.length
    ? `<p><strong>Použitie:</strong> ${product.applications.join(', ')}</p>`
    : '';

  writePage({
    route: `/produkt/${product.id}`,
    title: product.metaTitle || `${product.name} | OROSTONE`,
    description: (product.metaDescription || stripHtml(product.description)).slice(0, 300),
    canonical,
    ogImage,
    ogType: 'product',
    rootContent: `
      <article>
        <nav aria-label="breadcrumb"><a href="/">OROSTONE</a> &rsaquo; <a href="/kategoria/sintered-stone">Produkty</a> &rsaquo; ${esc(product.name)}</nav>
        <h1>${esc(product.name)}</h1>
        <p><strong>${product.pricePerM2.toFixed(2)} &euro; / m²</strong></p>
        <img src="${product.image}" alt="${esc(product.name)}" width="800" loading="lazy" />
        <div>${product.descriptionHtml || esc(product.description)}</div>
        ${benefitsHtml}
        <h2>Technické parametre</h2>
        ${specsHtml}
        ${appsHtml}
        <p><a href="/vzorky">Objednať vzorky</a></p>
      </article>`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.metaDescription || stripHtml(product.description).slice(0, 300),
        image: product.gallery || [product.image],
        sku: product.sku,
        brand: { '@type': 'Brand', name: 'OROSTONE' },
        manufacturer: { '@type': 'Organization', name: 'OROSTONE', url: BASE_URL },
        offers: {
          '@type': 'Offer',
          price: product.pricePerM2.toFixed(2),
          priceCurrency: 'EUR',
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: canonical,
          seller: { '@type': 'Organization', name: 'OROSTONE' },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'SK' },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 5,
                unitCode: 'd',
              },
            },
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'SK',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
          },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OROSTONE', item: `${BASE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Produkty',
            item: `${BASE_URL}/kategoria/sintered-stone`,
          },
          { '@type': 'ListItem', position: 3, name: product.name, item: canonical },
        ],
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Category listing
// ---------------------------------------------------------------------------

function prerenderCategoryListing(): void {
  const sintered = products.filter((p) => p.category === 'sintered-stone');

  const listHtml = sintered
    .map(
      (p) => `
      <article>
        <h2><a href="/produkt/${p.id}">${esc(p.name)}</a></h2>
        <p>${esc(stripHtml(p.description).slice(0, 200))}…</p>
        <p><strong>${p.pricePerM2.toFixed(2)} &euro; / m²</strong></p>
      </article>`,
    )
    .join('');

  writePage({
    route: '/kategoria/sintered-stone',
    title: 'Sinterovaný kameň — Všetky dekory | OROSTONE',
    description:
      'Kompletná kolekcia prémiového sinterovaného kameňa. Kuchynské dosky, obklady a architektonické platne 3200×1600 mm.',
    canonical: `${BASE_URL}/kategoria/sintered-stone`,
    rootContent: `
      <nav aria-label="breadcrumb"><a href="/">OROSTONE</a> &rsaquo; Sinterovaný kameň</nav>
      <h1>Sinterovaný kameň — Všetky dekory</h1>
      <p>Prémiové sinterované platne 3200×1600 mm. ${sintered.length} dekorov na výber.</p>
      ${listHtml}`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OROSTONE', item: `${BASE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Sinterovaný kameň',
            item: `${BASE_URL}/kategoria/sintered-stone`,
          },
        ],
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Vzorky (samples) — same URL as SPA route /vzorky
// ---------------------------------------------------------------------------

function prerenderVzorky(): void {
  writePage({
    route: '/vzorky',
    title: 'Vzorky materiálu | OROSTONE — Prémiový sinterovaný kameň',
    description:
      'Objednajte si vzorky sinterovaného kameňa OROSTONE. Vyberte dekor, nechajte kontakt a doručíme vám materiál na rozhodnutie.',
    canonical: `${BASE_URL}/vzorky`,
    rootContent: `
      <nav aria-label="breadcrumb"><a href="/">OROSTONE</a> &rsaquo; Vzorky</nav>
      <h1>Vzorky materiálu</h1>
      <p>Objednajte si vzorky sinterovaného kameňa — vyberte dekor a vyplňte formulár. Po načítaní stránky v prehliadači sa zobrazí celý obsah a objednávkový formulár.</p>
      <p><a href="/kategoria/sintered-stone">Prehliadať všetky dekory</a> &middot; <a href="/kontakt">Kontakt</a></p>`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OROSTONE', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Vzorky', item: `${BASE_URL}/vzorky` },
        ],
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('\n🔨 Prerendering static pages...\n');

// Blog articles (only published)
const published = (BLOG_ARTICLES as any[]).filter((a) => new Date(a.publishDate) <= new Date());
console.log(`Blog articles (${published.length}):`);
for (const article of published) {
  prerenderBlogArticle(article);
  console.log(`  ✓ /blog/${article.slug}`);
}

// Blog listing
console.log('\nBlog listing:');
prerenderBlogListing();
console.log('  ✓ /blog');

// Products
console.log(`\nProduct pages (${products.length}):`);
for (const product of products) {
  prerenderProduct(product);
  console.log(`  ✓ /produkt/${product.id}`);
}

// Category
console.log('\nCategory pages:');
prerenderCategoryListing();
console.log('  ✓ /kategoria/sintered-stone');

// Vzorky
console.log('\nVzorky:');
prerenderVzorky();
console.log('  ✓ /vzorky');

console.log(`\n✅ Prerendered ${count} pages.\n`);
