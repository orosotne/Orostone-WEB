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
  // og:url — self-referencing per-page (matches canonical for consistent social sharing)
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${page.canonical}$2`);
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
  // twitter:url — self-referencing per-page (parallel to og:url for Twitter Card spec)
  html = html.replace(/(<meta name="twitter:url" content=")[^"]*(")/, `$1${page.canonical}$2`);
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
  // Wrapped in .prerender-seo (sr-only) so users never see the unstyled flash
  // — crawlers still index the content; React replaces everything on mount.
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root"><div class="prerender-seo">${page.rootContent}</div></div>`,
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
    title: c.metaTitle || `${c.title} | OROSTONE`,
    description: (c.metaDescription || c.directAnswer || c.excerpt).slice(0, 300),
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
    title: 'Blog o sinterovanom kameni | OROSTONE',
    description:
      'Články o sinterovanom kameni — cena, údržba, hrúbka, porovnania s keramikou a technickým kameňom. Pre tých, kto si vyberá dlhodobé riešenie.',
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

/**
 * Per-slug SEO override for product pages.
 * Single source of truth for Vera's production-ready product meta copy
 * — independent of `data/shop-products-fallback.json`, which is regenerated
 * from Shopify by `scripts/sync-shop-fallback.ts` at the start of every build.
 *
 * Without this override, every build would silently revert product meta to
 * whatever Shopify currently has in its `metaTitle` / `metaDescription` fields.
 *
 * To update: edit the entry below. Do NOT edit shop-products-fallback.json —
 * those edits are erased on the next build.
 */
const PRODUCT_META_OVERRIDE: Record<string, { title: string; description: string }> = {
  appennino: {
    title: 'Appennino — svetlý sinterovaný kameň | OROSTONE',
    description:
      'Pokojný svetlý dekor pre kuchyne, kde má plocha pôsobiť čisto a vyvážene. Bez agresívnej kresby a bez impregnácie. Vzorka Appennino na vyžiadanie.',
  },
  'astrana-grey': {
    title: 'Astrana Grey — sivý sinterovaný kameň | OROSTONE',
    description:
      'Astrana Grey je vyrovnaný sivý dekor s jemnou kresbou. Funguje v kuchyniach, kde má pracovná doska držať pokojnú líniu interiéru. Vzorka aj poradenstvo bez záväzku.',
  },
  'calacatta-top': {
    title: 'Calacatta Top — biely mramorový dekor | OROSTONE',
    description:
      'Biely mramorový dekor so zlatistými žilkami. Pre kuchyne a kúpeľne, kde má plocha pôsobiť reprezentatívne, ale nie efektne. Pošlite pôdorys, vyrátame cenu.',
  },
  'givenchy-gold': {
    title: 'Givenchy Gold — zlatistý mramorový dekor | OROSTONE',
    description:
      'Teplý dekor so zlatistou kresbou v béžovo-hnedom poli. Pre interiéry, kde má dekor niesť vlastnú váhu — kúpeľne, akcentové steny, ostrovčeky. Veľká platňa v showroome Bošany.',
  },
  'gothic-gold': {
    title: 'Gothic Gold — tmavý dekor so zlatistou kresbou | OROSTONE',
    description:
      'Gothic Gold je tmavý dekor so zlatistými žilkami. Pre kuchyne, kde má pracovná doska niesť dramatickejšiu líniu. Pozrite veľkú platňu v showroome Bošany.',
  },
  'nero-margiua': {
    title: 'Nero Margiua — čierny sinterovaný kameň | OROSTONE',
    description:
      'Čierny mramorový dekor s bielou žilkovou kresbou. Pre kuchyne, kde má pracovná doska byť kontrastom proti svetlým frontom. Veľká platňa v showroome Bošany.',
  },
  'roman-travertine': {
    title: 'Roman Travertine — travertínový dekor | OROSTONE',
    description:
      'Roman Travertine prináša prirodzenú textúru travertínu — bez nasiakavosti, bez impregnácie a bez údržby, ktorú by si reálny travertín vyžadoval.',
  },
  'statuario-diamante': {
    title: 'Statuario Diamante — biely mramorový dekor | OROSTONE',
    description:
      'Biely sinterovaný kameň s jemným šedým žilkovaním. Pre kuchyne, kde má plocha priniesť svetlo bez toho, aby zaťažila výraz. Vzorka na vyžiadanie.',
  },
  'super-white-extra': {
    title: 'Super White Extra — čistý biely dekor | OROSTONE',
    description:
      'Čistý biely sinterovaný kameň bez žilkovania. Pre minimalistické kuchyne, kde má plocha úplne ustúpiť v prospech kompozície. Vzorka na vyžiadanie.',
  },
  'taj-mahal': {
    title: 'Taj Mahal — krémový sinterovaný kameň | OROSTONE',
    description:
      'Krémový mramorový dekor s mäkkou kresbou. Pre kuchyne s teplými drevenými frontami a interiéry, kde má povrch hriať, nie chladiť. Vzorka aj poradenstvo bez záväzku.',
  },
  'wild-forest': {
    title: 'Wild Forest — výrazný dekor pre veľké plochy | OROSTONE',
    description:
      'Wild Forest je výrazný dekor s veľkoplošnou kresbou. Vzorka 10×10 cm ho nezachytí — odporúčame pozrieť veľkú platňu v showroome Bošany.',
  },
  'yabo-white': {
    title: 'Yabo White — teplý biely sinterovaný kameň | OROSTONE',
    description:
      'Yabo White je teplý biely dekor s mäkkou textúrou. Pre kuchyne, kde má svetlá plocha pôsobiť obytne, nie sterilne. Vzorka Yabo White na vyžiadanie.',
  },
};

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

  const override = PRODUCT_META_OVERRIDE[product.id];

  writePage({
    route: `/produkt/${product.id}`,
    title: override?.title || product.metaTitle || `${product.name} | OROSTONE`,
    description: (
      override?.description || product.metaDescription || stripHtml(product.description)
    ).slice(0, 300),
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

function productListHtml(list: any[]): string {
  return list
    .map(
      (p) => `
      <article>
        <h2><a href="/produkt/${p.id}">${esc(p.name)}</a></h2>
        <p>${esc(stripHtml(p.description).slice(0, 200))}…</p>
        <p><strong>${p.pricePerM2.toFixed(2)} &euro; / m²</strong></p>
      </article>`,
    )
    .join('');
}

function prerenderCategoryListing(): void {
  const sintered = products.filter((p) => p.category === 'sintered-stone');

  writePage({
    route: '/kategoria/sintered-stone',
    title: 'Sinterovaný kameň — dekory a platne | OROSTONE',
    description:
      'Sinterovaný kameň pre kuchyne a interiéry. Veľkoformátové platne 3200×1600 mm, dekory s pokojnou aj výraznou kresbou. Showroom Bošany.',
    canonical: `${BASE_URL}/kategoria/sintered-stone`,
    rootContent: `
      <nav aria-label="breadcrumb"><a href="/">OROSTONE</a> &rsaquo; Sinterovaný kameň</nav>
      <h1>Sinterovaný kameň — Všetky dekory</h1>
      <p>Prémiové sinterované platne 3200×1600 mm. ${sintered.length} dekorov na výber.</p>
      ${productListHtml(sintered)}`,
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
// Color subcategories (/kategoria/sintered-stone/{biele,bezove,sede,cierne})
// ---------------------------------------------------------------------------

interface ColorSubcategory {
  slug: 'biele' | 'bezove' | 'sede' | 'cierne';
  name: string; // nominative plural (e.g. „Biele")
  /** SEO title override — fixed per-subcategory for stable indexing */
  metaTitle: string;
  /** SEO description override — fixed per-subcategory for stable indexing */
  metaDescription: string;
}

const COLOR_SUBCATEGORIES: ColorSubcategory[] = [
  {
    slug: 'biele',
    name: 'Biele',
    metaTitle: 'Biely sinterovaný kameň | OROSTONE',
    metaDescription:
      'Biele dekory sinterovaného kameňa pre svetlé kuchyne a kúpeľne. Od čistých plôch po jemné mramorové žilkovanie. Veľké platne až 3200×1600 mm.',
  },
  {
    slug: 'bezove',
    name: 'Béžové',
    metaTitle: 'Béžový sinterovaný kameň | OROSTONE',
    metaDescription:
      'Béžové dekory sinterovaného kameňa pre kuchyne, kúpeľne a interiéry. Teplé prírodné odtiene, ktoré priestor zjemnia bez toho, aby ho zaťažili.',
  },
  {
    slug: 'sede',
    name: 'Šedé',
    metaTitle: 'Sivý sinterovaný kameň | OROSTONE',
    metaDescription:
      'Sivé dekory sinterovaného kameňa pre kuchyne, kde má plocha fungovať pokojne a nepretiahnuť pozornosť na seba. Od svetlej cementovej až po antracit.',
  },
  {
    slug: 'cierne',
    name: 'Čierne',
    metaTitle: 'Čierny sinterovaný kameň | OROSTONE',
    metaDescription:
      'Čierne dekory sinterovaného kameňa pre kuchyne a ostrovčeky, kde má povrch niesť váhu priestoru. Veľkoformátové platne 3200×1600 mm.',
  },
];

/** Slovak plural rules for „dekor": 1 → dekor, 2–4 → dekory, 5+ → dekorov */
function dekorNoun(n: number): string {
  if (n === 1) return 'dekor';
  if (n >= 2 && n <= 4) return 'dekory';
  return 'dekorov';
}

function prerenderColorSubcategory(sub: ColorSubcategory): void {
  const filtered = products.filter(
    (p) => p.category === 'sintered-stone' && p.colorCategory === sub.slug,
  );
  // Sorted by name
  filtered.sort((a, b) => a.name.localeCompare(b.name, 'sk', { sensitivity: 'base' }));

  const route = `/kategoria/sintered-stone/${sub.slug}`;
  const canonical = `${BASE_URL}${route}`;
  const countPhrase = `${filtered.length} ${dekorNoun(filtered.length)}`;

  writePage({
    route,
    title: sub.metaTitle,
    description: sub.metaDescription,
    canonical,
    rootContent: `
      <nav aria-label="breadcrumb"><a href="/">OROSTONE</a> &rsaquo; <a href="/kategoria/sintered-stone">Sinterovaný kameň</a> &rsaquo; ${esc(sub.name)}</nav>
      <h1>Sinterovaný kameň — ${esc(sub.name)} dekory</h1>
      <p>Kolekcia ${esc(sub.name)} — ${countPhrase} sinterovaného kameňa v rozmere 3200×1600 mm.</p>
      ${productListHtml(filtered)}`,
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
          { '@type': 'ListItem', position: 3, name: sub.name, item: canonical },
        ],
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Static info pages (/kontakt, /doprava, /reklamacie, ...)
// ---------------------------------------------------------------------------

interface InfoPage {
  route: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  extraLinks?: { label: string; href: string }[];
}

const INFO_PAGES: InfoPage[] = [
  {
    route: '/kontakt',
    title: 'Kontakt | OROSTONE — sinterovaný kameň',
    description:
      'Cenová ponuka, vzorky alebo konzultácia k pracovnej doske zo sinterovaného kameňa. Showroom Bošany, dodanie po celom Slovensku.',
    h1: 'Kontakt',
    intro:
      'OROSTONE — slovenský dodávateľ prémiového sinterovaného kameňa. Sídlo: Landererova 8, 811 09 Bratislava. Telefón: +421 917 588 738. E-mail: info@orostone.sk. Radi pre vás pripravíme bezplatnú konzultáciu a cenovú ponuku.',
    extraLinks: [
      { label: 'Objednať vzorky', href: '/vzorky' },
      { label: 'Prehliadnuť produkty', href: '/kategoria/sintered-stone' },
    ],
  },
  {
    route: '/doprava',
    title: 'Doprava veľkoformátových platní | OROSTONE',
    description:
      'Informácie o doprave, platbe a špeciálnej preprave veľkoformátových platní a vzoriek sinterovaného kameňa po celom Slovensku.',
    h1: 'Doprava a platba',
    intro:
      'OROSTONE zabezpečuje špeciálnu prepravu veľkoformátových sinterovaných platní 3200×1600 mm po celom Slovensku. Platba bankovým prevodom alebo kartou. Expedícia do 1–5 pracovných dní od potvrdenia objednávky.',
  },
  {
    route: '/reklamacie',
    title: 'Reklamácie a vrátenie tovaru | OROSTONE',
    description:
      'Reklamačný poriadok OROSTONE, postup pri reklamácii, vrátenie tovaru a zákonná zodpovednosť za vady pri nákupe cez e-shop.',
    h1: 'Reklamácie a vrátenie tovaru',
    intro:
      'Reklamačný poriadok a postup pri reklamácii tovaru zakúpeného v e-shope OROSTONE. Zákonná zodpovednosť za vady trvá 24 mesiacov. Spotrebiteľ má právo odstúpiť od kúpnej zmluvy uzavretej na diaľku do 14 dní bez uvedenia dôvodu.',
    extraLinks: [
      { label: 'Formulár na odstúpenie od zmluvy', href: '/odstupenie-od-zmluvy' },
      { label: 'Všeobecné obchodné podmienky', href: '/vop' },
    ],
  },
  {
    route: '/odstupenie-od-zmluvy',
    title: 'Odstúpenie od zmluvy | OROSTONE',
    description:
      'Formuláre a informácie k odstúpeniu od zmluvy pri nákupe cez OROSTONE e-shop podľa platnej spotrebiteľskej legislatívy.',
    h1: 'Formulár na odstúpenie od zmluvy',
    intro:
      'Vzorový formulár na odstúpenie od kúpnej zmluvy uzavretej na diaľku podľa zákona č. 108/2024 Z.z. o ochrane spotrebiteľa. Spotrebiteľ má právo odstúpiť od zmluvy do 14 dní bez uvedenia dôvodu.',
  },
  {
    route: '/sinterovany-kamen',
    title: 'Sinterovaný kameň: cena, výhody, použitie | OROSTONE',
    description:
      'Čo je sinterovaný kameň, koľko stojí a kedy dáva zmysel ako pracovná doska. Praktický sprievodca pre kuchyňu, kde nechcete robiť kompromis.',
    h1: 'Sinterovaný kameň — čo to je a prečo ho chcete',
    intro:
      'Sinterovaný kameň je prémiový povrch vyrobený z prírodných minerálov pod extrémnym tlakom a teplotou. Odolá teplotám nad 300 °C, škvrnám, UV žiareniu aj škrabancom. Je ideálnym materiálom na kuchynské dosky, obklady kúpeľní a architektonické projekty. Nevyžaduje impregnáciu ani zvláštnu údržbu.',
    extraLinks: [
      { label: 'Výhody sinterovaného kameňa', href: '/vyhody' },
      { label: 'Všetky dekory', href: '/kategoria/sintered-stone' },
    ],
  },
  {
    route: '/vyhody',
    title: 'Výhody sinterovaného kameňa | OROSTONE',
    description:
      'Sinterovaný kameň odoláva teplu, škvrnám a poškriabaniu. Pozrite porovnanie s technickým kameňom, žulou a mramorom — rozdiely, ktoré reálne rozhodujú.',
    h1: 'Výhody sinterovaného kameňa',
    intro:
      'Sinterovaný kameň odolá teplotám nad 300 °C, nepotrebuje impregnáciu ani zvláštnu údržbu a umožňuje integráciu neviditeľnej indukčnej varnej dosky priamo v kuchynskej doske. V porovnaní so žulou, quartzovým kompozitom a mramorom má lepšiu tepelnú aj mechanickú odolnosť.',
    extraLinks: [
      { label: 'Čo je sinterovaný kameň', href: '/sinterovany-kamen' },
      { label: 'Prehliadnuť dekory', href: '/kategoria/sintered-stone' },
    ],
  },
  {
    route: '/vop',
    title: 'Všeobecné obchodné podmienky | OROSTONE E-Shop',
    description:
      'Všeobecné obchodné podmienky e-shopu OROSTONE. Informácie o objednávke, platbe, doprave, reklamáciách a právach spotrebiteľa podľa zákona č. 108/2024 Z.z.',
    h1: 'Všeobecné obchodné podmienky',
    intro:
      'Všeobecné obchodné podmienky e-shopu OROSTONE upravujú vzťah medzi predávajúcim (OROSTONE) a kupujúcim pri uzatváraní kúpnych zmlúv uzatvorených na diaľku. Podmienky sú v súlade so zákonom č. 108/2024 Z.z. o ochrane spotrebiteľa.',
  },
  {
    route: '/podmienky-rezervacie-ceny',
    title: 'Podmienky rezervačného poplatku Orostone – 99 € | OROSTONE',
    description:
      'Podmienky úhrady a použitia rezervačného poplatku 99 € za garanciu ceny produktov Orostone na 6 mesiacov. Informácie o nevratnosti poplatku a súhlase so začatím poskytovania služby.',
    h1: 'Podmienky rezervačného poplatku Orostone – 99 €',
    intro:
      'Rezervačný poplatok 99 € (vrátane DPH) je poplatkom za službu rezervácie a garantovania aktuálnej ceny produktov Orostone na obdobie 6 mesiacov. Na tejto stránke nájdete podmienky uplatnenia, informáciu o nevratnosti poplatku a poučenie spotrebiteľa o súhlase so začatím poskytovania služby pred uplynutím lehoty na odstúpenie od zmluvy podľa zákona č. 108/2024 Z.z.',
    extraLinks: [
      { label: 'Všeobecné obchodné podmienky', href: '/vop' },
      { label: 'Odstúpenie od zmluvy', href: '/odstupenie-od-zmluvy' },
    ],
  },
  {
    route: '/ochrana-sukromia',
    title: 'Ochrana osobných údajov | OROSTONE',
    description:
      'Zásady ochrany osobných údajov spoločnosti OROSTONE s.r.o. Spracúvanie údajov v súlade s GDPR — účely, právny základ a vaše práva.',
    h1: 'Ochrana osobných údajov',
    intro:
      'OROSTONE spracúva vaše osobné údaje v súlade s Nariadením GDPR a zákonom o ochrane osobných údajov. Na tejto stránke nájdete informácie o účeloch spracúvania, právnom základe, dobe uchovávania a o vašich právach dotknutej osoby.',
  },
  {
    route: '/cookies',
    title: 'Zásady používania cookies a podobných technológií | OROSTONE',
    description:
      'Informácie o cookies a podobných technológiách na webe OROSTONE. Typy technológií, účely spracovania a nastavenie vlastných preferencií.',
    h1: 'Zásady používania cookies',
    intro:
      'OROSTONE používa cookies a podobné technológie na zabezpečenie funkčnosti stránky, analýzu návštevnosti a cielenú reklamu. Na tejto stránke nájdete informácie o jednotlivých typoch cookies, účeloch spracovania a ako si môžete nastaviť vlastné preferencie.',
  },
];

function prerenderInfoPage(p: InfoPage): void {
  const canonical = `${BASE_URL}${p.route}`;
  const extraLinksHtml = p.extraLinks?.length
    ? `<p>${p.extraLinks.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join(' &middot; ')}</p>`
    : '';

  writePage({
    route: p.route,
    title: p.title,
    description: p.description,
    canonical,
    rootContent: `
      <nav aria-label="breadcrumb"><a href="/">OROSTONE</a> &rsaquo; ${esc(p.h1)}</nav>
      <h1>${esc(p.h1)}</h1>
      <p>${esc(p.intro)}</p>
      ${extraLinksHtml}`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OROSTONE', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: p.h1, item: canonical },
        ],
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Homepage (/) — inject semantic content into empty root div
// ---------------------------------------------------------------------------

function prerenderHome(): void {
  const topProducts = products.slice(0, 6);
  const productLinksHtml = topProducts
    .map((p) => `<li><a href="/produkt/${p.id}">${esc(p.name)}</a></li>`)
    .join('');

  writePage({
    route: '/',
    title: 'Sinterovaný kameň pre kuchyne | OROSTONE',
    description:
      'Sinterovaný kameň pre kuchyne, ostrovčeky a interiéry. Pomôžeme vybrať dekor, ktorý funguje aj vo veľkej ploche. Showroom Bošany, dodanie po SR.',
    canonical: `${BASE_URL}/`,
    rootContent: `
      <header>
        <h1>OROSTONE — sinterovaný kameň pre kuchyne, ktoré nechcú robiť kompromis</h1>
        <p>Sinterovaný kameň pre kuchyne, ostrovčeky a interiéry. Pomôžeme vybrať dekor, ktorý funguje aj vo veľkej ploche. Showroom Bošany, dodanie po SR.</p>
      </header>
      <section>
        <h2>Hlavné sekcie</h2>
        <ul>
          <li><a href="/kategoria/sintered-stone">Všetky dekory sinterovaného kameňa</a></li>
          <li><a href="/vzorky">Objednať vzorky materiálu</a></li>
          <li><a href="/sinterovany-kamen">Čo je sinterovaný kameň</a></li>
          <li><a href="/vyhody">Výhody sinterovaného kameňa</a></li>
          <li><a href="/blog">Blog o sinterovanom kameni</a></li>
          <li><a href="/kontakt">Kontakt</a></li>
          <li><a href="/doprava">Doprava a platba</a></li>
          <li><a href="/reklamacie">Reklamácie a vrátenie</a></li>
        </ul>
      </section>
      <section>
        <h2>Prémiové dekory sinterovaného kameňa</h2>
        <ul>${productLinksHtml}</ul>
      </section>
      <section>
        <h2>Farebné kolekcie</h2>
        <ul>
          <li><a href="/kategoria/sintered-stone/biele">Biele dekory</a></li>
          <li><a href="/kategoria/sintered-stone/bezove">Béžové dekory</a></li>
          <li><a href="/kategoria/sintered-stone/sede">Šedé dekory</a></li>
          <li><a href="/kategoria/sintered-stone/cierne">Čierne dekory</a></li>
        </ul>
      </section>`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'OROSTONE',
        url: `${BASE_URL}/`,
        inLanguage: 'sk-SK',
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
    title: 'Vzorky sinterovaného kameňa | OROSTONE',
    description:
      'Objednajte si vzorku dekoru, ktorý vás zaujal, alebo viac vzoriek na porovnanie. Pri väčších plochách odporúčame návštevu showroomu Bošany.',
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
// Kuchyne (kitchens) — same URL as SPA route /kuchyne
// ---------------------------------------------------------------------------

function prerenderKuchyne(): void {
  writePage({
    route: '/kuchyne',
    title: 'Kamenné pracovné dosky do kuchyne | OROSTONE',
    description:
      'Pracovné dosky zo sinterovaného kameňa na mieru. Odolný povrch, nízka nasiakavosť, bez impregnácie. Pošlite pôdorys, vyrátame orientačnú cenu.',
    canonical: `${BASE_URL}/kuchyne`,
    rootContent: `
      <nav aria-label="breadcrumb"><a href="/">OROSTONE</a> &rsaquo; Kuchyne</nav>
      <h1>Kuchyne zo sinterovaného kameňa</h1>
      <p>Prémiové kuchynské dosky zo sinterovaného kameňa OROSTONE — odolné voči teplu nad 300 °C, škvrnám, škrabancom a UV žiareniu. Bezplatná konzultácia, digitálne laserové zameranie, CNC fabrikácia a profesionálna inštalácia.</p>
      <p><a href="/kategoria/sintered-stone">Prehliadnuť všetky dekory</a> &middot; <a href="/vzorky">Objednať vzorky</a> &middot; <a href="/realizacie">Realizácie</a> &middot; <a href="/kontakt">Kontakt</a></p>`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OROSTONE', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Kuchyne', item: `${BASE_URL}/kuchyne` },
        ],
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// Realizacie (case studies / project gallery) — same URL as SPA route /realizacie
// ---------------------------------------------------------------------------

function prerenderRealizacie(): void {
  writePage({
    route: '/realizacie',
    title: 'Realizácie kuchynských dosiek | OROSTONE',
    description:
      'Pozrite, ako sinterovaný kameň vyzerá v reálnych kuchyniach a ostrovčekoch. Veľké plochy, kde dekor rozhoduje výsledok celej miestnosti.',
    canonical: `${BASE_URL}/realizacie`,
    rootContent: `
      <header>
        <nav aria-label="breadcrumb"><a href="/">OROSTONE</a> &rsaquo; Realizácie</nav>
        <h1>Realizácie zo sinterovaného kameňa</h1>
        <p>Pozrite, ako sinterovaný kameň vyzerá v reálnych kuchyniach a ostrovčekoch. Veľké plochy, kde dekor rozhoduje výsledok celej miestnosti.</p>
        <p><a href="/kategoria/sintered-stone">Prehliadnuť všetky dekory</a> &middot; <a href="/vzorky">Objednať vzorky</a> &middot; <a href="/kontakt">Konzultácia zadarmo</a></p>
      </header>`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Realizácie zo sinterovaného kameňa OROSTONE',
        description:
          'Pozrite, ako sinterovaný kameň vyzerá v reálnych kuchyniach a ostrovčekoch. Veľké plochy, kde dekor rozhoduje výsledok celej miestnosti.',
        url: `${BASE_URL}/realizacie`,
        inLanguage: 'sk-SK',
        isPartOf: { '@type': 'WebSite', name: 'OROSTONE', url: BASE_URL },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OROSTONE', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Realizácie', item: `${BASE_URL}/realizacie` },
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
for (const sub of COLOR_SUBCATEGORIES) {
  prerenderColorSubcategory(sub);
  console.log(`  ✓ /kategoria/sintered-stone/${sub.slug}`);
}

// Info pages
console.log(`\nInfo pages (${INFO_PAGES.length}):`);
for (const page of INFO_PAGES) {
  prerenderInfoPage(page);
  console.log(`  ✓ ${page.route}`);
}

// Vzorky
console.log('\nVzorky:');
prerenderVzorky();
console.log('  ✓ /vzorky');

// Kuchyne
console.log('\nKuchyne:');
prerenderKuchyne();
console.log('  ✓ /kuchyne');

// Realizacie
console.log('\nRealizacie:');
prerenderRealizacie();
console.log('  ✓ /realizacie');

// Homepage
console.log('\nHomepage:');
prerenderHome();
console.log('  ✓ /');

console.log(`\n✅ Prerendered ${count} pages.\n`);
