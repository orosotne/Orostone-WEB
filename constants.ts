import { Collection, Product, Realization, FAQItem } from './types';
import shopProductsFallback from './data/shop-products-fallback.json';

// ===========================================
// ANNOUNCEMENT BAR — set to false to hide globally
// ===========================================
export const SHOW_ANNOUNCEMENT_BAR = false;

export const COLLECTIONS: Collection[] = [
  {
    id: 'unita',
    name: 'UNITA',
    description: 'Konzistentná farba v celom priereze pre minimalistický dizajn.',
    heroImage: 'https://picsum.photos/900/1200?random=1',
    galleryFolder: 'unita-gallery'
  },
  {
    id: 'marbelito',
    name: 'MARBELITO',
    description: 'Verná imitácia mramoru s prepracovaným žilovaním.',
    heroImage: 'https://picsum.photos/900/1200?random=2',
    galleryFolder: 'marbelito-gallery'
  },
  {
    id: 'bianco',
    name: 'BIANCO',
    description: 'Čistota bieleho podkladu pre maximálny jas interiéru.',
    heroImage: 'https://picsum.photos/900/1200?random=3',
    galleryFolder: 'bianco-gallery'
  },
  {
    id: 'space-black',
    name: 'Space Black',
    description: 'Hlboká kozmická čierna s jemnými metalickými odleskami.',
    heroImage: 'https://picsum.photos/900/1200?random=4',
    galleryFolder: 'space-black-gallery'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Carrara Statuario',
    collectionId: 'marbelito',
    bodyType: 'FULL BODY',
    image: 'https://picsum.photos/600/800?random=10',
    description: 'Ikona luxusu. Biely podklad s výrazným sivým žilovaním, ktoré prechádza celou hĺbkou dosky.',
    thickness: ['12mm', '20mm'],
    finish: 'Silk / Polished',
    application: ['Kuchyňa', 'Kúpeľňa', 'Obklad']
  },
  {
    id: 'p2',
    name: 'Nero Marquina',
    collectionId: 'marbelito',
    bodyType: 'FULL BODY',
    image: 'https://picsum.photos/600/800?random=11',
    description: 'Dramatická čierna s bielymi bleskami. Ideálna pre statement ostrovčeky.',
    thickness: ['12mm', '20mm'],
    finish: 'Matte',
    application: ['Kuchyňa', 'Fasáda']
  },
  {
    id: 'p3',
    name: 'Unita Grey',
    collectionId: 'unita',
    bodyType: 'COLOR BODY',
    image: 'https://picsum.photos/600/800?random=12',
    description: 'Jemná, neutrálna sivá. Perfektná pre industriálne a moderné interiéry.',
    thickness: ['6mm', '12mm'],
    finish: 'Matte',
    application: ['Fasáda', 'Podlaha']
  },
  {
    id: 'p4',
    name: 'Absolute White',
    collectionId: 'bianco',
    bodyType: 'WHITE BODY',
    image: 'https://picsum.photos/600/800?random=13',
    description: 'Najčistejšia biela na trhu. Hygienická, svetlá a nadčasová.',
    thickness: ['12mm', '20mm'],
    finish: 'Polished',
    application: ['Kuchyňa', 'Laboratórium']
  },
  {
    id: 'p5',
    name: 'Galaxy Dust',
    collectionId: 'space-black',
    bodyType: 'COLOR BODY',
    image: 'https://picsum.photos/600/800?random=14',
    description: 'Tmavá textúra s mikroskopickými čiastočkami odrážajúcimi svetlo.',
    thickness: ['12mm'],
    finish: 'Textured',
    application: ['Bar', 'Obývačka']
  }
];

export const REALIZATIONS: Realization[] = [
  { 
    id: 'r1', 
    title: 'Vila Horský Park', 
    location: 'Bratislava', 
    category: 'Kuchyňa', 
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?q=80&w=1600&auto=format&fit=crop'
    ]
  },
  { 
    id: 'r2', 
    title: 'Rezidencia Sky Park', 
    location: 'Bratislava', 
    category: 'Kúpeľňa', 
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1600&auto=format&fit=crop'
    ]
  },
  { 
    id: 'r3', 
    title: 'Showroom Audi', 
    location: 'Trnava', 
    category: 'Fasáda', 
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1600&auto=format&fit=crop'
    ]
  },
  { 
    id: 'r4', 
    title: 'Apartmán River', 
    location: 'Bratislava', 
    category: 'Kuchyňa', 
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1600&auto=format&fit=crop'
    ]
  },
  { 
    id: 'r5', 
    title: 'Penthouse Koliba', 
    location: 'Bratislava', 
    category: 'Obývačka', 
    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop'
    ]
  },
];

export const FAQS: FAQItem[] = [
  { question: "Je sinterovaný kameň odolný voči teplu?", answer: "Áno, materiál odoláva teplotám až do 300°C. Horúci hrniec môžete položiť priamo na dosku bez obáv z poškodenia alebo zmeny farby." },
  { question: "Môže sa doska poškriabať nožom?", answer: "Sinterovaný kameň má tvrdosť blízku diamantu. Pri bežnom krájaní dosku nepoškriabete, odporúčame však používať dosku na krájanie pre ochranu ostria vašich nožov." },
  { question: "Ako prebieha údržba?", answer: "Materiál je nenasiakavý (porozita < 0.1%). Stačí teplá voda a jemný saponát. Nepotrebuje impregnáciu ani špeciálne vosky." },
  { question: "Zabezpečujete aj montáž?", answer: "Orostone je dodávateľom materiálu – montáž nezabezpečujeme. Na požiadanie vám radi odporučíme overených externých realizátorov, ktorí sa špecializujú na sinterovaný kameň." },
  { question: "Aká je dodacia lehota?", answer: "E-shop (skladové platne): spravidla 5 pracovných dní po úhrade. Projekty na mieru: spravidla 15 pracovných dní (20 pri atypoch) po potvrdení a úhrade zálohy." },
  { question: "Aké sú možnosti platby?", answer: "Bankový prevod alebo platba kartou online. Platbu v hotovosti ani dobierku neakceptujeme." },
  { question: "Aká je záručná doba?", answer: "24 mesiacov na materiál. Záruka sa nevzťahuje na vady vzniknuté montážou, rezaním alebo nesprávnym používaním." },
];

export type ProductCategory = 'sintered-stone' | 'tables' | 'invisible-cooktop' | 'accessories';

/** Zatriedenie dekoru pre mega menu / kategórie — nastavuje sa v Shopify metafield `custom.color_category` */
export const PRODUCT_COLOR_TONES = ['biele', 'sede', 'bezove', 'cierne'] as const;
export type ProductColorTone = (typeof PRODUCT_COLOR_TONES)[number];

export interface ProductRichDescription {
  intro: string;                              // Marketing intro paragraph
  highlightsTitle?: string;                   // Default: "Prečo si vybrať [name]?"
  highlights: string[];                       // Bullet points
  specs: { label: string; value: string }[];  // Product-specific key specs
  closing: string;                            // Closing marketing paragraph
}

export interface ShopProduct {
  id: string;
  name: string;
  image: string;
  pricePerM2: number;
  dimensions: string; // e.g. "3200 x 1600 mm"
  thickness: string;
  inStock: boolean;
  description: string;
  descriptionHtml?: string;
  category: ProductCategory;
  
  // Technical metafields (Shopify-compatible)
  sku?: string;
  vendor?: string;
  productType?: string;
  material?: string;
  finish?: string;
  edgeStyle?: string;
  color?: string;
  /** Z Shopify metafield `custom.color_category` (biele | sede | bezove | cierne) */
  colorCategory?: ProductColorTone;
  weight?: number;          // kg
  countryOfOrigin?: string;
  stockQuantity?: number;
  
  // Application suitability
  applications?: string[];  // ['Kuchyňa', 'Kúpeľňa', 'Obklad stien', ...]
  
  // Technical parameters
  heatResistance?: string;  // e.g., "Do 300°C"
  uvResistance?: boolean;
  scratchResistance?: string;
  stainResistance?: string;
  porosity?: string;        // e.g., "< 0.1%"
  
  // Logistics
  deliveryTimeframe?: string;
  packagingInfo?: string;
  handlingNotes?: string;
  
  // Gallery
  gallery?: string[];       // Additional images
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  keyBenefits?: string[];

  // Rich description (Shopify-style structured content)
  richDescription?: ProductRichDescription;

  // Design insight — unique researched content about style matching & use cases (HTML)
  designInsight?: string;

  // Subcategory (e.g. for tables: 'dining' | 'coffee' | 'console')
  subcategory?: string;

  // Shopify Storefront API
  shopifyVariantId?: string;        // Shopify variant GID pre Cart API
  sampleShopifyVariantId?: string;  // Shopify variant GID pre vzorku (deposit)
}

/** Krajina pôvodu: metafield / parsed > pre kategóriu sinterovaný kameň default „CN“. */
export function resolveCountryOfOrigin(
  product: Pick<ShopProduct, 'category' | 'countryOfOrigin'>,
  whenEmpty: 'dash' | 'slovakia' = 'dash'
): string {
  const raw = product.countryOfOrigin?.trim();
  if (raw) return raw;
  if (product.category === 'sintered-stone') return 'CN';
  return whenEmpty === 'slovakia' ? 'Slovensko' : '—';
}

// ===========================================
// SAMPLE (VZORKA) CONSTANTS
// ===========================================

export const MAX_SAMPLES = 5;
export const SAMPLE_VARIANT_KEYWORD = 'Vzorka';  // keyword in variant title to identify samples in cart

// Offline / výpadok Storefront API — snapshot z tvojho Shopify (`npm run sync:shop-fallback`)
export const SHOP_PRODUCTS: ShopProduct[] = shopProductsFallback as ShopProduct[];

// Testimonials for Realizations page
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  project: string;
  quote: string;
  avatar: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Ing. Peter Kováč',
    role: 'Majiteľ',
    project: 'Vila Horský Park',
    quote: 'Orostone prekonal všetky naše očakávania. Kvalita materiálu a precíznosť realizácie sú bezkonkurenčné. Naša kuchyňa sa stala srdcom celého domu.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    rating: 5
  },
  {
    id: 't2',
    name: 'Arch. Zuzana Nováková',
    role: 'Hlavný architekt',
    company: 'Studio Z',
    project: 'Rezidencia Sky Park',
    quote: 'Spolupráca s Orostone bola profesionálna od začiatku až do konca. Ich pozornosť k detailom a schopnosť realizovať aj náročné projekty je výnimočná.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    rating: 5
  },
  {
    id: 't3',
    name: 'Martin Hudec',
    role: 'Developerský riaditeľ',
    company: 'Premium Living',
    project: 'Penthouse Koliba',
    quote: 'Už tretí projekt s Orostone a každý bol dokonalý. Termíny dodržané na deň, kvalita vždy na najvyššej úrovni. Jednoznačne odporúčam.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5
  }
];

// Process steps for timeline
export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  duration: string;
  icon: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'step1',
    number: '01',
    title: 'Výber dekoru',
    description: 'Prehliadnite si kolekcie, objednajte vzorky alebo nás kontaktujte pre nezáväznú konzultáciu.',
    duration: '1-2 dni',
    icon: 'Palette'
  },
  {
    id: 'step2',
    number: '02',
    title: 'Objednávka & Záloha',
    description: 'Potvrdíte objednávku a uhradíte zálohu. E-shop: platba vopred. Projekt: zálohová faktúra.',
    duration: '1-3 dni',
    icon: 'MessageCircle'
  },
  {
    id: 'step3',
    number: '03',
    title: 'Príprava & Výroba',
    description: 'Skladové platne expedujeme ihneď. Pri projektoch na mieru prebieha CNC rezanie s presnosťou 0.1mm.',
    duration: '5-20 dní',
    icon: 'Cog'
  },
  {
    id: 'step4',
    number: '04',
    title: 'Dodanie',
    description: 'Doručenie na vašu adresu prepravnou spoločnosťou. Pri prevzatí skontrolujte neporušenosť.',
    duration: '1-2 dni',
    icon: 'Truck'
  },
  {
    id: 'step5',
    number: '05',
    title: 'Montáž realizátorom',
    description: 'Montáž zabezpečuje váš realizátor. Na požiadanie vám radi odporučíme overených odborníkov. Záruka 24 mesiacov na materiál.',
    duration: 'U vás',
    icon: 'CheckCircle'
  }
];

// Before/After projects for slider
export interface BeforeAfterProject {
  id: string;
  title: string;
  location: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

export const BEFORE_AFTER_PROJECTS: BeforeAfterProject[] = [
  {
    id: 'ba1',
    title: 'Kuchyňa Staré Mesto',
    location: 'Bratislava',
    beforeImage: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=1600&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1600&auto=format&fit=crop',
    description: 'Kompletná premena zastaranej kuchyne na moderný priestor s Calacatta Gold.'
  },
  {
    id: 'ba2',
    title: 'Kúpeľňa Penthouse',
    location: 'Košice',
    beforeImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1600&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1600&auto=format&fit=crop',
    description: 'Z obyčajnej kúpeľne luxusný wellness s Nero Marquina.'
  },
  {
    id: 'ba3',
    title: 'Fasáda Vila',
    location: 'Žilina',
    beforeImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=1600&auto=format&fit=crop',
    description: 'Moderná fasáda s UV stabilným materiálom.'
  }
];

export interface NavLinkItem {
  label: string;
  path: string;
  external?: boolean;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: 'Shop', path: '/' },
  { label: 'Kolekcie', path: '/kolekcie' },
  { label: 'Realizácie', path: '/realizacie' },
  { label: 'Vizualizátor', path: '/vizualizator' },
  { label: 'Kalkulačka', path: '/online-kalkulacka' },
  { label: 'Kontakt', path: '/kontakt' },
];
