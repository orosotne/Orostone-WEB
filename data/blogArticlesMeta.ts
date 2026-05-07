// Lightweight blog article metadata — no content, directAnswer, or faqs.
// Used on homepage (BlogPreviewSection) to avoid bundling full article HTML
// into the main EshopApp chunk.
import type { BlogArticleMeta } from './blogTypes';
import { BLOG_AUTHOR_OROSTONE } from './blogTypes';

/** Lightweight listing — no content/faqs, keeps blogArticles chunk out of Blog listing page */
export const BLOG_ARTICLES_META: BlogArticleMeta[] = [
  {
    id: 'sintered-stone-problems',
    slug: 'problemy-so-sinterovanym-kamenom',
    category: 'risk-killers',
    publishDate: '2026-02-10',
    lastModified: '2026-02-13',
    readTimeMinutes: 12,
    heroImage: '/images/blog/sintered-stone-problems.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['sinterovaný kameň', 'problémy', 'prevencia', 'inštalácia', 'chipovanie'],
    sk: {
      title: 'Problémy so sinterovaným kameňom, o ktorých ti nikto nepovie (a ako im predchádzame)',
      subtitle: 'Úprimný sprievodca rizikami sinterovaného kameňa — od chipovania po praskanie pri výrezoch',
      excerpt: 'Sinterovaný kameň je vynikajúci materiál, ale nie je nezničiteľný. Pozri sa na reálne problémy, konkrétne čísla a overené riešenia, ktoré v Orostone denne používame.',
    },
    en: {
      title: 'Sintered Stone Problems Nobody Tells You About (And How We Prevent Them)',
      subtitle: 'An honest guide to sintered stone risks — from chipping to cracking around cutouts',
      excerpt: 'Sintered stone is an excellent material, but it\'s not indestructible. See real problems, concrete numbers, and proven solutions we use at Orostone every day.',
    },
  },
  {
    id: 'hot-pans-sintered-stone',
    slug: 'horuce-hrnce-na-sinterovanom-kameni',
    category: 'risk-killers',
    publishDate: '2026-03-23',
    readTimeMinutes: 8,
    heroImage: '/images/blog/article-02/hero.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['sinterovaný kameň', 'tepelná odolnosť', 'horúce hrnce', 'kuchyňa', 'termický šok'],
    sk: {
      title: 'Môžete položiť horúci hrniec na sinterovaný kameň? Úprimná odpoveď',
      subtitle: 'Test tepelnej odolnosti sinterovaného kameňa v praxi — čo skutočne vydrží a kde sú limity',
      excerpt: 'Sinterovaný kameň odolá teplotám do 300°C a horúce hrnce ho nepoškodí. Ale je tu jeden scenár, na ktorý si treba dávať pozor — termický šok.',
    },
    en: {
      title: 'Can You Put Hot Pans on Sintered Stone? The Honest Answer',
      subtitle: 'Real-world heat resistance test — what it truly withstands and where the limits are',
      excerpt: 'Sintered stone withstands temperatures up to 300°C and hot pans won\'t damage it. But there\'s one scenario to watch out for — thermal shock.',
    },
  },
  {
    id: 'sintered-stone-stain-test',
    slug: 'skvrny-na-sinterovanom-kameni',
    category: 'risk-killers',
    publishDate: '2026-03-24',
    readTimeMinutes: 9,
    heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['sinterovaný kameň', 'škvrny', 'káva', 'víno', 'kurkuma', 'test', 'pórovitosť'],
    sk: {
      title: 'Zafarbí sa sinterovaný kameň? Reálny test s kávou, vínom a kurkumou',
      subtitle: 'Dokumentovaný test odolnosti voči škvrnám — 6 látok, 72 hodín, skutočné výsledky',
      excerpt: 'Sinterovaný kameň má pórovitosť pod 0,1% — škvrny neprenikajú do materiálu. Testovali sme kávu, červené víno, kurkumu, olej, citrón a repu. Tu sú výsledky.',
    },
    en: {
      title: 'Does Sintered Stone Stain? Real Test with Coffee, Wine & Turmeric',
      subtitle: 'Documented stain resistance test — 6 substances, 72 hours, real results',
      excerpt: 'Sintered stone has porosity below 0.1% — stains cannot penetrate the material. We tested coffee, red wine, turmeric, oil, lemon and beetroot. Here are the results.',
    },
  },
  {
    id: '12mm-vs-20mm-thickness',
    slug: '12mm-vs-20mm-hrubka',
    category: 'risk-killers',
    publishDate: '2026-03-25',
    readTimeMinutes: 10,
    heroImage: '/images/blog/article-04/hero.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['sinterovaný kameň', 'hrúbka', '12mm', '20mm', 'kuchyňa', 'kuchynská doska'],
    sk: {
      title: '12 mm vs 20 mm: aká hrúbka sinterovaného kameňa je správna pre tvoju kuchyňu?',
      subtitle: 'Štrukturálny rozdiel, limity previsu, hmotnosť, cena — a rozhodovacia matica pre každý projekt',
      excerpt: 'Pevnosť pri prerušení: 5 000 N vs 16 000 N. Kedy stačí 12 mm a kedy je 20 mm nevyhnutnosť? Konkrétne čísla, pravidlá previsu a reálny prípad prasknutia 12 mm dosky s výrezom.',
    },
    en: {
      title: '12mm vs 20mm: Which Sintered Stone Thickness Is Right for Your Kitchen?',
      subtitle: 'Structural difference, overhang limits, weight, price — and a decision matrix for every project',
      excerpt: 'Breaking force: 5,000 N vs 16,000 N. When is 12mm enough and when is 20mm essential? Concrete numbers, overhang rules, and a real-life case of a 12mm slab cracking at a cutout.',
    },
  },
  {
    id: 'edges-chipping-profiles',
    slug: 'hrany-a-profily-chipovanie',
    category: 'risk-killers',
    publishDate: '2026-03-26',
    readTimeMinutes: 8,
    heroImage: '/images/blog/article-05/hero.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['sinterovaný kameň', 'hrany', 'profily', 'chipovanie', 'odolnosť', 'half-bullnose', 'chamfer'],
    sk: {
      title: 'Hrany sinterovaného kameňa: kompletný sprievodca profilmi a odolnosťou',
      subtitle: 'Od 90° ostrej hrany po full bullnose — fyzika chipovania, porovnávacia tabuľka a opravy',
      excerpt: 'Prečo 90° hrany praskajú a zaoblené vydržia 3× dlhšie. Kompletný prehľad 6 profilov hrán s cenami, odporúčaniami a prípadovou štúdiou kuchynského ostrovčeka s 3 odštiepeninami.',
    },
    en: {
      title: 'Sintered Stone Edges: Complete Guide to Profiles and Durability',
      subtitle: 'From 90° sharp edge to full bullnose — physics of chipping, comparison table and repairs',
      excerpt: 'Why 90° edges chip and rounded profiles last 3× longer. Complete overview of 6 edge profiles with prices, recommendations, and a case study of a kitchen island with 3 chips.',
    },
  },
  {
    id: 'sintered-vs-quartz-vs-ceramic-vs-porcelain',
    slug: 'sinterovany-kamen-vs-kvarcit-vs-keramika-vs-porcelan',
    category: 'trust-builders',
    publishDate: '2026-02-08',
    lastModified: '2026-03-23',
    readTimeMinutes: 15,
    heroImage: '/images/blog/material-comparison.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['porovnanie', 'sinterovaný kameň', 'kvarcit', 'keramika', 'porcelán', 'výber materiálu'],
    sk: {
      title: 'Sinterovaný kameň vs kvarcit vs keramika vs porcelán: v čom je skutočný rozdiel?',
      subtitle: 'Technické porovnanie materiálov pre prémiové kuchynské dosky — bez marketingových klišé',
      excerpt: 'Komplexné porovnanie sinterovaného kameňa, kvarcitu, porcelánových dosiek a keramiky. Reálne čísla, certifikácie, cenové rozpätia a rozhodovací strom pre tvoj projekt.',
    },
    en: {
      title: 'Sintered Stone vs Quartz vs Ceramic vs Porcelain: What\'s Actually Different?',
      subtitle: 'Technical comparison of premium kitchen countertop materials — no marketing fluff',
      excerpt: 'A comprehensive comparison of sintered stone, engineered quartz, porcelain slabs, and ceramic. Real numbers, certifications, pricing ranges, and a decision tree for your project.',
    },
  },
  {
    id: 'matte-vs-polished',
    slug: 'matny-vs-leskly-povrch',
    category: 'identity-aesthetics',
    publishDate: '2026-02-06',
    lastModified: '2026-02-13',
    readTimeMinutes: 10,
    heroImage: '/images/blog/matte-vs-polished.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['matný povrch', 'lesklý povrch', 'dizajn kuchyne', 'estetika', 'luxus'],
    sk: {
      title: 'Matný vs lesklý povrch: čo vyzerá luxusnejšie v reálnych kuchyniach?',
      subtitle: 'Praktický sprievodca povrchmi sinterovaného kameňa — od odtlačkov prstov po fotogenickosť',
      excerpt: 'Objektívne porovnanie matného a lesklého povrchu sinterovaného kameňa. Odtlačky prstov, mikro-škrabance, fotogenickosť, praktickosť a odporúčanie pre luxusné bratislavské kuchyne.',
    },
    en: {
      title: 'Matte vs Polished Surface: Which Looks More Luxurious in Real Kitchens?',
      subtitle: 'A practical guide to sintered stone finishes — from fingerprints to photogenicity',
      excerpt: 'Objective comparison of matte and polished sintered stone surfaces. Fingerprints, micro-scratches, photogenicity, practicality and recommendation for luxury Bratislava kitchens.',
    },
  },
  {
    id: 'orostone-process-10-steps',
    slug: 'od-merania-po-instalaciu-proces-orostone',
    category: 'friction-removers',
    publishDate: '2026-02-04',
    lastModified: '2026-02-13',
    readTimeMinutes: 11,
    heroImage: '/images/blog/installation-process.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['inštalácia', 'proces', 'meranie', 'fabrikácia', 'montáž'],
    sk: {
      title: 'Od merania po inštaláciu: proces Orostone v 10 krokoch',
      subtitle: 'Kompletný sprievodca celým procesom — od prvej konzultácie po odovzdanie hotovej kuchyne',
      excerpt: 'Presne budeš vedieť, čo sa deje v každej fáze. 10 krokov, konkrétne termíny, jasné zodpovednosti. Celý proces od konzultácie po hotovú kuchyňu trvá 10–15 pracovných dní.',
    },
    en: {
      title: 'From Measurement to Installation: The Orostone Process in 10 Steps',
      subtitle: 'Complete guide to the entire process — from first consultation to finished kitchen handover',
      excerpt: 'You\'ll know exactly what happens at every stage. 10 steps, specific timelines, clear responsibilities. The full process from consultation to finished kitchen takes 10–15 working days.',
    },
  },
  {
    id: 'is-sintered-stone-worth-it',
    slug: 'oplati-sa-sinterovany-kamen',
    category: 'value-comparisons',
    publishDate: '2026-02-02',
    lastModified: '2026-02-13',
    readTimeMinutes: 13,
    heroImage: '/images/blog/sintered-stone-worth-it.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['cena', 'hodnota', 'životnosť', 'údržba', 'investícia', 'porovnanie'],
    sk: {
      title: 'Oplatí sa sinterovaný kameň? Cena vs životnosť vs údržba',
      subtitle: 'Reálna matematika — nie marketingové sľuby. Tri scenáre, konkrétne čísla v eurách a brutálne úprimná odpoveď.',
      excerpt: 'Kompletný finančný rozbor sinterovaného kameňa vs kvarcitu, žuly a laminátu. Tri reálne scenáre (rodinný dom, byt v Bratislave, Airbnb), 25-ročné náklady vlastníctva a úprimná odpoveď, kedy sa investícia oplatí — a kedy nie.',
    },
    en: {
      title: 'Is Sintered Stone Worth It? Price vs Lifespan vs Maintenance',
      subtitle: 'Real math — not marketing promises. Three scenarios, concrete euro figures and a brutally honest answer.',
      excerpt: 'Complete financial breakdown of sintered stone vs quartz, granite and laminate. Three real scenarios (family home, Bratislava flat, Airbnb), 25-year cost of ownership and an honest answer on when the investment pays off — and when it doesn\'t.',
    },
  },
  {
    id: 'invisible-cooktop-sintered-stone',
    slug: 'neviditelna-varna-doska-v-sinterovanom-kamene',
    category: 'identity-aesthetics',
    publishDate: '2026-04-12',
    readTimeMinutes: 11,
    heroImage: '/images/blog/article-22/hero.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['neviditeľná varná doska', 'sinterovaný kameň', 'indukcia', 'kuchyňa', 'Bora', 'integrovaná varná doska', 'dizajn kuchyne'],
    sk: {
      title: 'Neviditeľná varná doska v sinterovanom kameni — kompletný sprievodca',
      subtitle: 'Ako funguje indukčné varenie integrované priamo pod sinterovaný kameň a prečo je to budúcnosť kuchýň',
      excerpt: 'Neviditeľná varná doska skrytá pod sinterovaným kameňom vytvára dokonale čistú pracovnú plochu. Vysvetľujeme technológiu, požiadavky na hrúbku platne, kompatibilné systémy a reálne skúsenosti.',
    },
    en: {
      title: 'Invisible Cooktop in Sintered Stone — Complete Guide',
      subtitle: 'How induction cooking integrated under sintered stone works and why it\'s the future of kitchens',
      excerpt: 'An invisible cooktop hidden under sintered stone creates a perfectly clean work surface. We explain the technology, slab thickness requirements, compatible systems and real experiences.',
    },
  },
  {
    id: 'kitchen-island-sintered-stone',
    slug: 'kuchynsky-ostrovcek-zo-sinterovaneho-kamena',
    category: 'identity-aesthetics',
    publishDate: '2026-04-12',
    readTimeMinutes: 10,
    heroImage: '/images/blog/article-23/hero.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['kuchynský ostrovček', 'sinterovaný kameň', 'kuchyňa', 'dizajn', 'ostrov', 'pracovná doska', 'waterfall'],
    sk: {
      title: 'Kuchynský ostrovček zo sinterovaného kameňa — kompletný sprievodca',
      subtitle: 'Od rozmeru cez hrúbku po waterfall hrany: všetko, čo potrebujete vedieť pred objednaním',
      excerpt: 'Kuchynský ostrovček zo sinterovaného kameňa je vizuálne dominanta modernej kuchyne. Poradíme s rozmermi, hrúbkou platne, profilom hrán a waterfall prevedením.',
    },
    en: {
      title: 'Kitchen Island in Sintered Stone — Complete Guide',
      subtitle: 'From dimensions to thickness to waterfall edges: everything you need to know before ordering',
      excerpt: 'A sintered stone kitchen island is the visual centerpiece of a modern kitchen. We advise on dimensions, slab thickness, edge profiles and waterfall execution.',
    },
  },
  {
    id: 'technicky-kamen-cena-pracovna-doska',
    slug: 'technicky-kamen-cena-pracovna-doska',
    category: 'value-comparisons',
    publishDate: '2026-05-06',
    lastModified: '2026-05-06',
    readTimeMinutes: 12,
    heroImage: '/images/blog/technicky-kamen-pracovna-doska.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['technický kameň', 'sinterovaný kameň', 'kuchynská doska', 'cena', 'porovnanie', 'materiál'],
    sk: {
      title: 'Technický kameň: cena, nevýhody a pracovná doska do kuchyne',
      subtitle: 'Sprievodca cenou, nevýhodami a výberom materiálu — sinterovaný kameň, quartz kompozit, keramika a solid surface',
      excerpt: 'Praktický sprievodca: čo je technický kameň, ktorý typ sa hodí na kuchynskú dosku, koľko stojí (250–600 €/bm) a aké má reálne nevýhody.',
    },
    en: {
      title: 'Engineered Stone: Price, Drawbacks and Kitchen Countertop Guide',
      subtitle: 'A guide to price, drawbacks and material choice — sintered stone, quartz composite, ceramic and solid surface',
      excerpt: 'A practical guide: what engineered stone is, which type fits a kitchen countertop, how much it costs (€250–600/rm) and what its real drawbacks are.',
    },
  },
  {
    id: 'umely-kamen-pracovna-doska',
    slug: 'umely-kamen-pracovna-doska',
    category: 'value-comparisons',
    publishDate: '2026-05-06',
    lastModified: '2026-05-06',
    readTimeMinutes: 12,
    heroImage: '/images/blog/umely-kamen-pracovna-doska.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['umelý kameň', 'pracovná doska', 'kuchynská doska', 'cena', 'výber materiálu', 'sprievodca'],
    sk: {
      title: 'Umelý kameň na pracovnú dosku: cena, typy a výber do kuchyne',
      subtitle: 'Rozhodovací proces, cenové hladiny a 7 chýb, ktorým sa vyhnúť pri výbere kuchynskej pracovnej dosky',
      excerpt: 'Zistite, koľko stojí pracovná doska z umelého kameňa, aké typy existujú a kedy sa oplatí quartz, sinterovaný kameň alebo keramická kuchynská doska.',
    },
    en: {
      title: 'Engineered Stone Countertop: Price, Types and Kitchen Selection Guide',
      subtitle: 'Decision process, price tiers and 7 mistakes to avoid when choosing a kitchen countertop',
      excerpt: 'Find out how much an engineered stone countertop costs, what types exist, and when quartz, sintered stone or ceramic makes sense for your kitchen.',
    },
  },
];

/** Published articles only (same filter as blogArticles.ts) */
export const BLOG_ARTICLES_LISTING: BlogArticleMeta[] = BLOG_ARTICLES_META
  .filter(a => new Date(a.publishDate) <= new Date())
  .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

export const getLatestArticlesMeta = (count: number): BlogArticleMeta[] =>
  BLOG_ARTICLES_LISTING.slice(0, count);
