import { Collection, Product, Realization, FAQItem } from './types';

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

  // Rich description (Shopify-style structured content)
  richDescription?: ProductRichDescription;

  // Design insight — unique researched content about style matching & use cases (HTML)
  designInsight?: string;

  // Subcategory (e.g. for tables: 'dining' | 'coffee' | 'console')
  subcategory?: string;

  // Shopify Storefront API
  shopifyVariantId?: string;  // Shopify variant GID pre Cart API
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  // ============================================================
  // 1. GLACIER
  // ============================================================
  {
    id: 'glacier',
    name: 'Glacier',
    image: 'https://picsum.photos/seed/glacier1/1200/900',
    pricePerM2: 280,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Ľadovo čistá biela so subtílnou kryštalickou textúrou. Pripomína zasneženú krajinu a prináša do interiéru pocit svežosti a čistoty.',
    category: 'sintered-stone',
    sku: 'GL-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Rovná hrana',
    color: 'Ľadovo biela',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 8,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Obklad stien', 'Komerčné interiéry'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/glacier1/1200/900',
      'https://picsum.photos/seed/glacier2/1200/900',
      'https://picsum.photos/seed/glacier3/1200/900',
      'https://picsum.photos/seed/glacier4/1200/900',
    ],
    seoTitle: 'Glacier | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Sinterovaný kameň Glacier — ľadovo čistá biela so subtílnou kryštalickou textúrou. Rozmer 3200x1600mm, hrúbka 12mm. Pre kuchyne, kúpeľne a luxusné interiéry.',
    richDescription: {
      intro: 'GLACIER je stelesnením čistoty a minimalizmu. Ľadovo biely povrch so subtílnou kryštalickou textúrou evokuje nedotknutú zasneženú krajinu a prináša do vášho interiéru pocit priestrannosti, svetla a absolútnej svežesti.',
      highlights: [
        'Ľadovo biely povrch s jemnou kryštalickou hĺbkou',
        'Leštený finish s maximálnou odrazivosťou svetla',
        'Vizuálne zväčšuje priestor — ideálny pre kompaktné kuchyne',
        'Hygienický povrch vhodný aj pre profesionálne prostredia',
        'Dokonalý základ pre kontrastné dizajnové prvky',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'GLACIER je voľbou pre tých, ktorí veria v silu čistého dizajnu. Kameň, ktorý nechá vyniknúť architektúru priestoru a premení každú miestnosť na galériu moderného bývania.',
    },
  },

  // ============================================================
  // 2. YABO WHITE
  // ============================================================
  {
    id: 'yabo-white',
    name: 'Yabo White',
    image: 'https://picsum.photos/seed/yabo1/1200/900',
    pricePerM2: 260,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Teplá biela s jemnými béžovými podtónmi a delikátnymi žilkami. Elegantná a útulná zároveň — harmónia pre každý interiér.',
    category: 'sintered-stone',
    sku: 'YW-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Silk',
    edgeStyle: 'Rovná hrana',
    color: 'Teplá biela s béžovými podtónmi',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 10,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Obklad stien'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/yabo1/1200/900',
      'https://picsum.photos/seed/yabo2/1200/900',
      'https://picsum.photos/seed/yabo3/1200/900',
      'https://picsum.photos/seed/yabo4/1200/900',
    ],
    seoTitle: 'Yabo White | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Sinterovaný kameň Yabo White — teplá biela s jemnými béžovými podtónmi. Silk povrch, rozmer 3200x1600mm. Pre elegantné kuchyne a kúpeľne.',
    richDescription: {
      intro: 'YABO WHITE prináša do interiéru teplú, prívetivú atmosféru. Na rozdiel od chladných bielych kameňov, Yabo White ponúka jemné béžové podtóny a delikátne žilky, ktoré vytvárajú pocit domova a harmónie bez straty sofistikovanosti.',
      highlights: [
        'Teplá biela s béžovými podtónmi — útulná a elegantná',
        'Silk povrch príjemný na dotyk, bez ostrých reflexií',
        'Delikátne žilky dodávajú povrchu jemný charakter',
        'Harmonicky ladí s drevenými a kovovými prvkami',
        'Univerzálne použitie v kuchyni, kúpeľni aj na obklady',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Silk' },
      ],
      closing: 'YABO WHITE je pre tých, ktorí hľadajú rovnováhu medzi luxusom a útulnosťou. Kameň, ktorý premení vašu kuchyňu na miesto, kde sa rodina rada stretáva a hostia sa cítia vítaní.',
    },
  },

  // ============================================================
  // 3. ROMAN TRAVERTINE
  // ============================================================
  {
    id: 'roman-travertine',
    name: 'Roman Travertine',
    image: 'https://picsum.photos/seed/romantr1/1200/900',
    pricePerM2: 295,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Nadčasový travertínový vzor s teplými béžovými a krémovými tónmi. Mediteránsky šarm bez náročnej údržby prírodného kameňa.',
    category: 'sintered-stone',
    sku: 'RT-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Matný',
    edgeStyle: 'Rovná hrana',
    color: 'Béžová travertínová',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 6,
    applications: ['Kuchynské dosky', 'Kúpeľne', 'Obklad stien', 'Podlahy', 'Fasády'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/romantr1/1200/900',
      'https://picsum.photos/seed/romantr2/1200/900',
      'https://picsum.photos/seed/romantr3/1200/900',
      'https://picsum.photos/seed/romantr4/1200/900',
    ],
    seoTitle: 'Roman Travertine | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Sinterovaný kameň Roman Travertine — nadčasový travertínový vzor s teplými béžovými tónmi. Matný povrch, rozmer 3200x1600mm.',
    richDescription: {
      intro: 'ROMAN TRAVERTINE zachytáva nadčasovú krásu klasického talianskeho travertínu. Teplé béžové a krémové tóny s charakteristickými prírodnými pásmi evokujú stáročia architektonickej tradície Ríma — no bez náročnej údržby prírodného kameňa.',
      highlights: [
        'Autentický travertínový vzhľad bez nutnosti impregnácie',
        'Teplé béžové tóny pre klasický aj moderný interiér',
        'Matný povrch s prírodnou haptikou',
        'UV stabilný — vhodný aj pre fasády a exteriéry',
        'Nulová údržba navyše — len voda a saponát',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Matný' },
      ],
      closing: 'ROMAN TRAVERTINE je mostom medzi klasickou krásou a modernou technológiou. Kameň pre tých, ktorí milujú tradičnú estetiku, no nechcú sa vzdať pohodlia bezúdržbového materiálu.',
    },
  },

  // ============================================================
  // 4. TAJ MAHAL
  // ============================================================
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    image: 'https://picsum.photos/seed/tajmahal1/1200/900',
    pricePerM2: 350,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Exotický zlatisto-béžový kameň s jemnými žilkami inšpirovaný legendárnym indickým mramorom. Absolútny luxus s orientálnym šarmom.',
    category: 'sintered-stone',
    sku: 'TM-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Skosená hrana',
    color: 'Zlatisto-béžová s jemnými žilkami',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 4,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Komerčné interiéry', 'Nábytok'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '7 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/tajmahal1/1200/900',
      'https://picsum.photos/seed/tajmahal2/1200/900',
      'https://picsum.photos/seed/tajmahal3/1200/900',
      'https://picsum.photos/seed/tajmahal4/1200/900',
    ],
    seoTitle: 'Taj Mahal | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Sinterovaný kameň Taj Mahal — exotický zlatisto-béžový povrch s jemnými žilkami. Leštený povrch, rozmer 3200x1600mm. Luxus inšpirovaný Indiou.',
    richDescription: {
      intro: 'TAJ MAHAL je poctou jednému z najkrajších architektonických divov sveta. Zlatisto-béžový podklad s jemnými teplými žilkami evokuje vzácny indický mramor a prináša do vášho interiéru orientálny luxus a nadčasovú eleganciu.',
      highlights: [
        'Exotický zlatisto-béžový odtieň inšpirovaný indickým mramorom',
        'Jemné žilky dodávajú povrchu jedinečný charakter',
        'Leštený povrch so skosenou hranou pre luxusný profil',
        'Teplé tóny harmonizujú s drevom, kožou aj kovom',
        'Ideálny pre statement kusy — ostrovčeky, bary, nábytok',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'TAJ MAHAL nie je len kuchynská doska — je to investícia do exkluzívneho dizajnu. Kameň pre tých, ktorí oceňujú vzácnosť a chcú, aby ich interiér rozprával príbeh o cestovaní a kultúre.',
    },
  },

  // ============================================================
  // 5. VENUS WHITE
  // ============================================================
  {
    id: 'venus-white',
    name: 'Venus White',
    image: 'https://picsum.photos/seed/venus1/1200/900',
    pricePerM2: 275,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Krémovo biela s jemnými šedými žilkami pripomínajúcimi ranné oblaky. Jemnosť a elegancia v každom detaile.',
    category: 'sintered-stone',
    sku: 'VW-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Silk',
    edgeStyle: 'Rovná hrana',
    color: 'Krémovo biela so šedými žilkami',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 7,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Obklad stien'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/venus1/1200/900',
      'https://picsum.photos/seed/venus2/1200/900',
      'https://picsum.photos/seed/venus3/1200/900',
      'https://picsum.photos/seed/venus4/1200/900',
    ],
    seoTitle: 'Venus White | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Sinterovaný kameň Venus White — krémovo biela s jemnými šedými žilkami. Silk povrch, rozmer 3200x1600mm. Jemnosť a elegancia.',
    richDescription: {
      intro: 'VENUS WHITE je inšpirovaný jemnou krásou ranných oblakov. Krémovo biely podklad s delikátnymi šedými žilkami vytvára povrch, ktorý je rovnako nežný ako silný — kombinácia, ktorá dodá vášmu interiéru sofistikovanú ľahkosť.',
      highlights: [
        'Krémovo biela s delikátnymi šedými žilkami',
        'Silk povrch — hladký a príjemný na dotyk',
        'Jemný vzor pripomínajúci ranné oblaky na oblohe',
        'Ideálny pre svetlé, vzdušné interiéry',
        'Nenasiakavý povrch odolný voči škvrnam a chemikáliám',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Silk' },
      ],
      closing: 'VENUS WHITE je voľbou pre interiéry, kde má vládnuť pokoj a krása. Kameň, ktorý nemusí kričať, aby zaujal — jeho sila je v jemnosti a dokonalom povrchu.',
    },
  },

  // ============================================================
  // 6. POLARIS (STATUARIO)
  // ============================================================
  {
    id: 'polaris-statuario',
    name: 'Polaris (Statuario)',
    image: 'https://picsum.photos/seed/polaris1/1200/900',
    pricePerM2: 320,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Klasický statuario s výrazným sivým žilovaním na bielom podklade. Ikona luxusu v sinterovanom kameni — verná replika talianskeho originálu.',
    category: 'sintered-stone',
    sku: 'PS-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Rovná hrana',
    color: 'Biela s výrazným sivým žilovaním',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 6,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Obklad stien', 'Komerčné interiéry'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/polaris1/1200/900',
      'https://picsum.photos/seed/polaris2/1200/900',
      'https://picsum.photos/seed/polaris3/1200/900',
      'https://picsum.photos/seed/polaris4/1200/900',
    ],
    seoTitle: 'Polaris Statuario | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Sinterovaný kameň Polaris (Statuario) — klasický biely mramor s výrazným sivým žilovaním. Leštený povrch, rozmer 3200x1600mm.',
    richDescription: {
      intro: 'POLARIS (STATUARIO) je naším bestsellerom a dokonalou replikou legendárneho talianskeho mramoru Statuario. Biely podklad s výraznými sivými žilkami zachytáva autentický charakter originálu s mnohonásobne vyššou odolnosťou a nulovou údržbou.',
      highlights: [
        'Najpredávanejší dekor v našej ponuke',
        'Autentické žilkovanie inšpirované talianskym mramorom Statuario',
        'Odolnosť voči teplu do 300°C — horúce hrnce priamo na povrch',
        'Nulová nasiakavosť — žiadne škvrny od vína, kávy ani oleja',
        'Luxusný vzhľad prírodného mramoru bez jeho nevýhod',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'POLARIS (STATUARIO) je dôkazom, že luxus a praktickosť môžu ísť ruka v ruke. Kameň s charakterom talianskeho paláca a odolnosťou modernej technológie — pre tých, ktorí nechcú robiť kompromisy.',
    },
  },

  // ============================================================
  // 7. GIVENCHY GOLD
  // ============================================================
  {
    id: 'givenchy-gold',
    name: 'Givenchy Gold',
    image: 'https://picsum.photos/seed/givenchy1/1200/900',
    pricePerM2: 380,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Luxusný biely kameň so zlatistým žilovaním, ktorý evokuje najvzácnejšie talianske mramory. Symbol elegancie a opulencie.',
    category: 'sintered-stone',
    sku: 'GG-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Skosená hrana',
    color: 'Biela so zlatistým žilovaním',
    weight: 148,
    countryOfOrigin: 'IT',
    stockQuantity: 3,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Komerčné interiéry', 'Nábytok'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '7 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/givenchy1/1200/900',
      'https://picsum.photos/seed/givenchy2/1200/900',
      'https://picsum.photos/seed/givenchy3/1200/900',
      'https://picsum.photos/seed/givenchy4/1200/900',
    ],
    seoTitle: 'Givenchy Gold | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Sinterovaný kameň Givenchy Gold — luxusná biela so zlatistým žilovaním. Leštený povrch, skosená hrana, rozmer 3200x1600mm. Taliansky pôvod.',
    richDescription: {
      intro: 'GIVENCHY GOLD je špičkou elegancie v našej kolekcii. Biely podklad so zlatistým žilovaním evokuje ten najvzácnejší taliansky mramor Calacatta Oro. Je symbolom absolútneho luxusu a sofistikovanosti — kameň, ktorý premení každú kuchyňu na priestor hodný haute couture.',
      highlights: [
        'Unikátne zlatisté žilkovanie na čisto bielom podklade',
        'Leštený povrch so zrkadlovou hĺbkou a leskom',
        'Skosená hrana pre ešte elegantnejší profil',
        'Krajina pôvodu: Taliansko — najvyššia kvalita spracovania',
        'Odolný voči chemikáliám, kyselinám a potravinárskym škvrnám',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'GIVENCHY GOLD nie je len kuchynská doska — je to investícia do krásy vášho domova. Kameň, ktorý povyšuje každodenné varenie na zážitok a robí dojem na každého, kto vkročí do vašej kuchyne.',
    },
  },

  // ============================================================
  // 8. IRON COPPER
  // ============================================================
  {
    id: 'iron-copper',
    name: 'Iron Copper',
    image: 'https://picsum.photos/seed/ironcopper1/1200/900',
    pricePerM2: 340,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Tmavý industriálny kameň s medenými a hrdzavými odleskami. Surová krása kovu pretavená do sinterovaného kameňa.',
    category: 'sintered-stone',
    sku: 'IC-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Matný',
    edgeStyle: 'Rovná hrana',
    color: 'Tmavá s medenými odleskami',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 5,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Komerčné interiéry', 'Bary', 'Nábytok'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/ironcopper1/1200/900',
      'https://picsum.photos/seed/ironcopper2/1200/900',
      'https://picsum.photos/seed/ironcopper3/1200/900',
      'https://picsum.photos/seed/ironcopper4/1200/900',
    ],
    seoTitle: 'Iron Copper | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Sinterovaný kameň Iron Copper — tmavý industriálny povrch s medenými odleskami. Matný finish, rozmer 3200x1600mm. Pre moderné a loftové interiéry.',
    richDescription: {
      intro: 'IRON COPPER je pre odvážnych dizajnérov, ktorí milujú surový industriálny charakter. Tmavý podklad s medenými a hrdzavými odleskami evokuje patinu starého kovu — no s dokonalým povrchom a odolnosťou sinterovaného kameňa.',
      highlights: [
        'Unikátny kovový vzhľad s medenými a hrdzavými odleskami',
        'Matný povrch odolný voči odtlačkom prstov',
        'Perfektný pre lofty, industriálne kuchyne a moderné bary',
        'Statement kus, ktorý definuje charakter priestoru',
        'Kombinácia surovej estetiky a bezúdržbového komfortu',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Matný' },
      ],
      closing: 'IRON COPPER je pre tých, ktorí sa neboja odlíšiť. Kameň, ktorý prináša energiu a charakter do každého priestoru — od loftového bytu po prémiový bar.',
    },
  },

  // ============================================================
  // 9. GOTHIC GOLD
  // ============================================================
  {
    id: 'gothic-gold',
    name: 'Gothic Gold',
    image: 'https://picsum.photos/seed/gothic1/1200/900',
    pricePerM2: 365,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Dramatická hlboká čierna so zlatými žilkami. Majestátny kameň inšpirovaný gotickou architektúrou a šperkami.',
    category: 'sintered-stone',
    sku: 'GGL-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Skosená hrana',
    color: 'Čierna so zlatými žilkami',
    weight: 148,
    countryOfOrigin: 'IT',
    stockQuantity: 3,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Komerčné interiéry', 'Bary', 'Nábytok'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '7 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/gothic1/1200/900',
      'https://picsum.photos/seed/gothic2/1200/900',
      'https://picsum.photos/seed/gothic3/1200/900',
      'https://picsum.photos/seed/gothic4/1200/900',
    ],
    seoTitle: 'Gothic Gold | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Sinterovaný kameň Gothic Gold — dramatická čierna so zlatými žilkami. Leštený povrch, skosená hrana, rozmer 3200x1600mm. Taliansky pôvod.',
    richDescription: {
      intro: 'GOTHIC GOLD je majestátny kameň pre interiéry, kde je cieľom zaujať na prvý pohľad. Hlboká čierna so zlatými žilkami pripomína gotické katedrály a luxusné šperky — dramatický, no sofistikovaný charakter, ktorý definuje priestor.',
      highlights: [
        'Dramatická čierna so zlatými žilkami — absolútny wow efekt',
        'Leštený povrch umocňuje hĺbku a kontrast farieb',
        'Skosená hrana pre luxusný detailný profil',
        'Krajina pôvodu: Taliansko — najvyššia kvalita',
        'Ideálny pre statement ostrovčeky, bary a recepcie',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'GOTHIC GOLD je pre tých, ktorí hľadajú absolútnu exkluzivitu a neboja sa odvážnych rozhodnutí. Kameň, ktorý sa stane ústredným bodom každého priestoru a predmetom obdivu vašich hostí.',
    },
  },

  // ============================================================
  // 10. NUVOLA CALACATA
  // ============================================================
  {
    id: 'nuvola-calacata',
    name: 'Nuvola Calacata',
    image: 'https://picsum.photos/seed/nuvola1/1200/900',
    pricePerM2: 310,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Vzdušný biely kameň s jemným oblačným vzorovaním v sivých a béžových tónoch. Calacatta inšpirácia s mäkkším, poetickejším vyjadrením.',
    category: 'sintered-stone',
    sku: 'NC-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Silk',
    edgeStyle: 'Rovná hrana',
    color: 'Biela s oblačným sivým vzorom',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 7,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Obklad stien', 'Komerčné interiéry'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/nuvola1/1200/900',
      'https://picsum.photos/seed/nuvola2/1200/900',
      'https://picsum.photos/seed/nuvola3/1200/900',
      'https://picsum.photos/seed/nuvola4/1200/900',
    ],
    seoTitle: 'Nuvola Calacata | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Sinterovaný kameň Nuvola Calacata — vzdušný biely povrch s oblačným vzorom. Silk finish, rozmer 3200x1600mm. Poetická elegancia pre interiéry.',
    richDescription: {
      intro: 'NUVOLA CALACATA (nuvola = oblak po taliansky) je poetickejšou interpretáciou klasického Calacatta mramoru. Jemné oblačné vzory v sivých a béžových tónoch na bielom podklade vytvárajú vzdušný, snový povrch plný pohybu a hĺbky.',
      highlights: [
        'Unikátny oblačný vzor — každá platňa je originál',
        'Silk povrch s jemnou, hladkou haptikou',
        'Mäkšia interpretácia Calacatta pre menej kontrastný interiér',
        'Vzdušný a svetlý — ideálny pre otvorené priestory',
        'Univerzálne použitie od kuchyne po komerčné priestory',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Silk' },
      ],
      closing: 'NUVOLA CALACATA je pre tých, ktorí hľadajú krásu v jemnosti. Kameň ako ranný oblak — mäkký, vzdušný a plný pokoja. Perfektná voľba pre interiéry, kde má vládnuť harmónia.',
    },
  },

  // ============================================================
  // 11. CARRARA PREMIUM
  // ============================================================
  {
    id: 'carrara-premium',
    name: 'Carrara Premium',
    image: 'https://picsum.photos/seed/carrprem1/1200/900',
    pricePerM2: 290,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Prémiová verzia legendárneho Carrara mramoru. Biely podklad s charakteristickými sivými žilkami — nadčasová klasika v modernom prevedení.',
    category: 'sintered-stone',
    sku: 'CP-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Rovná hrana',
    color: 'Biela s klasickými sivými žilkami',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 10,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Obklad stien'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/carrprem1/1200/900',
      'https://picsum.photos/seed/carrprem2/1200/900',
      'https://picsum.photos/seed/carrprem3/1200/900',
      'https://picsum.photos/seed/carrprem4/1200/900',
    ],
    seoTitle: 'Carrara Premium | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Sinterovaný kameň Carrara Premium — prémiová replika legendárneho talianskeho mramoru. Leštený povrch, rozmer 3200x1600mm.',
    richDescription: {
      intro: 'CARRARA PREMIUM je naša prémiová interpretácia najslávnejšieho mramoru na svete. Biely podklad s charakteristickými sivými žilkami zachytáva dušu talianskeho Carrara s vernosťou, ktorá ohromí aj znalcov — no s odolnosťou a bezúdržbovosťou sinterovaného kameňa.',
      highlights: [
        'Autentický Carrara vzhľad — klasika, ktorá nikdy nevyjde z módy',
        'Leštený povrch so zrkadlovou hĺbkou',
        'Odolnosť voči teplu do 300°C — horúce hrnce priamo na povrch',
        'Nulová nasiakavosť — žiadne škvrny od vína, kávy ani oleja',
        'Najlepší pomer ceny a kvality v mramorovej kategórii',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'CARRARA PREMIUM je voľbou pre tých, ktorí milujú overenú klasiku. Kameň, ktorý bol krásny pred storočiami a bude krásny aj o storočia — len teraz s výhodami 21. storočia.',
    },
  },

  // ============================================================
  // 12. BIANCO STATUARIO
  // ============================================================
  {
    id: 'bianco-statuario',
    name: 'Bianco Statuario',
    image: 'https://picsum.photos/seed/biancost1/1200/900',
    pricePerM2: 389,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Vrchol elegancie. Čistá biela s výraznými sivými žilkami v dokonalej harmónii — náš najluxusnejší kameň pre tých, ktorí akceptujú len to najlepšie.',
    category: 'sintered-stone',
    sku: 'BS-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Skosená hrana',
    color: 'Čistá biela s výraznými sivými žilkami',
    weight: 148,
    countryOfOrigin: 'IT',
    stockQuantity: 4,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Obklad stien', 'Komerčné interiéry'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '7 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/biancost1/1200/900',
      'https://picsum.photos/seed/biancost2/1200/900',
      'https://picsum.photos/seed/biancost3/1200/900',
      'https://picsum.photos/seed/biancost4/1200/900',
    ],
    seoTitle: 'Bianco Statuario | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Sinterovaný kameň Bianco Statuario — vrchol elegancie s čistou bielou a výraznými sivými žilkami. Leštený povrch, taliansky pôvod, rozmer 3200x1600mm.',
    richDescription: {
      intro: 'BIANCO STATUARIO je vrcholom elegancie a luxusu v našej kolekcii. Čistá biela základňa s výraznými sivými žilkami v dokonalej harmónii vytvára kameň, ktorý je synonymom najvyššieho štandardu v interiérovom dizajne. Inšpirovaný najvzácnejšími blokmi talianskeho mramoru Statuario.',
      highlights: [
        'Náš najluxusnejší kameň — vrchol ponuky OROSTONE',
        'Leštený povrch s dokonalým zrkadlovým efektom',
        'Skosená hrana pre exkluzívny detailný profil',
        'Krajina pôvodu: Taliansko — najvyššia kvalita spracovania',
        'Odolný voči poškriabaniu, teplu, škvrnám a UV žiareniu',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'BIANCO STATUARIO je pre tých, ktorí akceptujú len to najlepšie. Tento exkluzívny kameň premení vašu kuchyňu na priestor, kde sa stretáva funkčnosť s umením — a každý deň vám pripomenie, že ste si vybrali správne.',
    },
  },
];
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
  { label: 'Shop', path: '/eshop.html', external: true },
  { label: 'O kameni', path: '/o-kameni' },
  { label: 'Kolekcie', path: '/kolekcie' },
  { label: 'Realizácie', path: '/realizacie' },
  { label: 'Vizualizátor', path: '/vizualizator' },
  { label: 'Kalkulačka', path: '/online-kalkulacka' },
  { label: 'Kontakt', path: '/kontakt' },
];
