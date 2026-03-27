import { Realization, FAQItem } from './types';
import shopProductsFallback from './data/shop-products-fallback.json';

// ===========================================
// ANNOUNCEMENT BAR — set to false to hide globally
// ===========================================
export const SHOW_ANNOUNCEMENT_BAR = false;

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
    name: 'Tomáš Balážik',
    role: 'Majiteľ reštaurácie',
    company: 'Bistro Koliba, Bratislava',
    project: 'Kuchynský bar & recepcia',
    quote: 'Hľadal som materiál, ktorý vydrží kuchynské peklo a zároveň bude vyzerať dobre pred hosťami. Vzorku Nero Margiua som dostal do týždňa — ešte pred podpisom zmluvy sme mali jasnú predstavu. Pulty v bare stoja druhý rok, ani škrabance, ani škvrny od vína.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    rating: 5
  },
  {
    id: 't2',
    name: 'Simona Drgoňová',
    role: 'Interiérová dizajnérka',
    company: 'Atelier SD, Žilina',
    project: 'Rodinný dom — terasa a kúpeľňa',
    quote: 'Klientka chcela mramor, ale bojala sa údržby pri deťoch. Odporučila som sintrovaný kameň od Orostone a dnes mi píše, že by nevymenila. Hrúbka 12mm na terase pôsobí solídne a pritom ľahko — presne taký efekt sme hľadali. Dodávka prišla bez jediného rozbitého kusu.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    rating: 5
  },
  {
    id: 't3',
    name: 'Rastislav Jurčo',
    role: 'Projektový manažér',
    company: 'Jurčo Develop, Košice',
    project: 'Bytový komplex — lobby & spoločné priestory',
    quote: 'Pri projekte s 18 bytmi potrebuješ dodávateľa, ktorý nezlyháva. Objednali sme tri rôzne dekory, každý v inej fáze stavby — vždy na termín, vždy s kompletnou dokumentáciou. Žiadne improvizácie, žiadne prekvapenia na faktúre. To sa v tomto biznise nenosí.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    rating: 5
  }
];

