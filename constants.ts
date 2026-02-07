import { Collection, Product, Realization, FAQItem } from './types';

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

export type ProductCategory = 'mramor' | 'granit' | 'beton' | 'drevo' | 'jednofarebne';

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
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  // FULLY POPULATED PREMIUM PRODUCT (reference for PDP)
  {
    id: 'bianco-statuario-3200',
    name: 'Bianco Statuario',
    image: 'https://picsum.photos/seed/stone1/1200/900',
    pricePerM2: 389,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Luxusný sinterovaný kameň s bielym podkladom a elegantným sivým žilovaním. Ideálny pre prémiové kuchynské dosky a architektonické aplikácie.',
    category: 'mramor',
    
    // Technical metafields
    sku: 'BS-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Rovná hrana',
    color: 'Biela so sivým žilovaním',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 5,
    
    // Application suitability
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Obklad stien', 'Komerčné interiéry'],
    
    // Technical parameters
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    
    // Logistics
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    
    // Gallery
    gallery: [
      'https://picsum.photos/seed/stone1/1200/900',
      'https://picsum.photos/seed/stone2/1200/900',
      'https://picsum.photos/seed/stone3/1200/900',
      'https://picsum.photos/seed/stone4/1200/900',
      'https://picsum.photos/seed/stone5/1200/900',
    ],
    
    // SEO
    seoTitle: 'Bianco Statuario | Sinterovaný kameň 3200x1600mm | OROSTONE',
    seoDescription: 'Prémiový sinterovaný kameň Bianco Statuario s rozmermi 3200x1600mm. Luxusný biely povrch so sivým žilovaním pre kuchyne, kúpeľne a architektonické projekty.',

    // Rich description
    richDescription: {
      intro: 'BIANCO STATUARIO je vrcholom elegancie a luxusu v svete sinterovaného kameňa. Tento prémiový materiál s čistou bielou základňou a jemnými šedými žilkami pripomínajúcimi taliansky mramor Carrara dodá vašej kuchyni nadčasovú sofistikovanosť.',
      highlights: [
        'Leštený povrch s dokonalým zrkadlovým efektom',
        'Odolný voči poškriabaniu, teplu a škvrnám',
        'Hygienický a ľahko udržiavateľný povrch',
        'Ideálny pre kuchynské dosky a ostrovy',
        'Luxusný vzhľad prírodného mramoru bez jeho nevýhod',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'Tento exkluzívny kameň premení vašu kuchyňu na priestor, kde sa stretáva funkčnosť s umením. BIANCO STATUARIO je voľbou tých, ktorí oceňujú kvalitu a nadčasový dizajn.',
    },
  },
  {
    id: 's1',
    name: 'Carrara Statuario Ultra',
    image: 'https://picsum.photos/seed/carrara1/1200/900',
    pricePerM2: 189,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Náš bestseller. Dokonalá imitácia talianskeho mramoru s vysokou odolnosťou.',
    category: 'mramor',
    sku: 'CSU-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Rovná hrana',
    color: 'Biela so sivým žilovaním',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 8,
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
      'https://picsum.photos/seed/carrara1/1200/900',
      'https://picsum.photos/seed/carrara2/1200/900',
      'https://picsum.photos/seed/carrara3/1200/900',
      'https://picsum.photos/seed/carrara4/1200/900',
    ],

    // Rich description
    richDescription: {
      intro: 'CARRARA STATUARIO ULTRA je naším bestsellerom a dokonalou imitáciou legendárneho talianskeho mramoru. Tento sinterovaný kameň zachytáva autentické sivé žilkovanie na bielom podklade s takou vernosťou, že ho len ťažko odlíšite od originálu — no s mnohonásobne vyššou odolnosťou.',
      highlights: [
        'Najpredávanejší dekor v našej ponuke',
        'Autentické žilkovanie inšpirované talianskym mramorom',
        'Odolnosť voči teplu do 300°C — horúce hrnce priamo na povrch',
        'Nulová nasiakavosť — žiadne škvrny od vína, kávy ani oleja',
        'Vhodný pre kuchynské dosky, ostrovčeky aj obklady',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'CARRARA STATUARIO ULTRA je dôkazom, že luxus a praktickosť môžu ísť ruka v ruke. Ideálna voľba pre každého, kto chce kuchyňu s charakterom talianskeho paláca a odolnosťou modernej technológie.',
    },
  },
  {
    id: 's2',
    name: 'Nero Marquina Bold',
    image: 'https://picsum.photos/seed/nero1/1200/900',
    pricePerM2: 210,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Hlboká čierna s výrazným bielym žilovaním pre luxusné interiéry.',
    category: 'mramor',
    sku: 'NMB-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Rovná hrana',
    color: 'Čierna s bielym žilovaním',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 5,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Komerčné interiéry'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/nero1/1200/900',
      'https://picsum.photos/seed/nero2/1200/900',
      'https://picsum.photos/seed/nero3/1200/900',
      'https://picsum.photos/seed/nero4/1200/900',
    ],

    // Rich description
    richDescription: {
      intro: 'NERO MARQUINA BOLD prináša dramatickú eleganciu hlbokej čiernej s výrazným bielym žilovaním. Tento sinterovaný kameň je inšpirovaný španielskym mramorom Nero Marquina a je stvorený pre tých, ktorí sa neboja odvážnych dizajnových rozhodnutí.',
      highlights: [
        'Kontrastné biele žilkovanie na hlboko čiernom podklade',
        'Statement kus pre kuchynské ostrovčeky a bary',
        'Leštený povrch s hĺbkou a reflexiou svetla',
        'Odolný voči škrabancom — tvrdosť Mohs 7+',
        'UV stabilný — farba nebledne ani pri priamom slnku',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'NERO MARQUINA BOLD je voľbou pre interiéry, kde je cieľom zaujať na prvý pohľad. Čierny kameň s bielymi bleskmi premení každý priestor na galériu moderného umenia.',
    },
  },
  {
    id: 's3',
    name: 'Pietra Grey Soft',
    image: 'https://picsum.photos/seed/pietra1/1200/900',
    pricePerM2: 195,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Elegantná sivá pre minimalistický a moderný vzhľad kuchyne či kúpeľne.',
    category: 'granit',
    sku: 'PGS-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Matný',
    edgeStyle: 'Rovná hrana',
    color: 'Sivá',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 12,
    applications: ['Kuchynské dosky', 'Kúpeľne', 'Obklad stien', 'Podlahy'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/pietra1/1200/900',
      'https://picsum.photos/seed/pietra2/1200/900',
      'https://picsum.photos/seed/pietra3/1200/900',
      'https://picsum.photos/seed/pietra4/1200/900',
    ],

    // Rich description
    richDescription: {
      intro: 'PIETRA GREY SOFT je stelesnením minimalistickej elegancie. Jemná sivá s matným povrchom vytvára upokojujúci, sofistikovaný základ pre moderné a industriálne interiéry. Tento kameň nechá vyniknúť váš nábytok a doplnky.',
      highlights: [
        'Matný povrch pre jemný, nereflektujúci vzhľad',
        'Univerzálna sivá harmónizuje s akoukoľvek farebnou schémou',
        'Vhodný aj na podlahy a obklady stien — nielen kuchyňu',
        'Neutrálny tón ideálny pre industriálne aj škandinávske interiéry',
        'Jednoduchá údržba — stačí teplá voda a saponát',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Matný' },
      ],
      closing: 'PIETRA GREY SOFT je pre tých, ktorí veria, že menej je viac. Kameň, ktorý nemusí kričať, aby zaujal — jeho sila je v jednoduchosti a bezchybnom povrchu.',
    },
  },
  {
    id: 's4',
    name: 'Calacatta Gold',
    image: 'https://picsum.photos/seed/calacatta1/1200/900',
    pricePerM2: 245,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Prémiový biely mramor so zlatistým žilovaním. Špička v našej ponuke.',
    category: 'mramor',
    sku: 'CG-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Skosená hrana',
    color: 'Biela so zlatistým žilovaním',
    weight: 148,
    countryOfOrigin: 'IT',
    stockQuantity: 3,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Komerčné interiéry'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '7 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/calacatta1/1200/900',
      'https://picsum.photos/seed/calacatta2/1200/900',
      'https://picsum.photos/seed/calacatta3/1200/900',
      'https://picsum.photos/seed/calacatta4/1200/900',
    ],

    // Rich description
    richDescription: {
      intro: 'CALACATTA GOLD je špičkou v našej ponuke — prémiový sinterovaný kameň s bielym podkladom a zlatistým žilovaním, ktorý evokuje ten najvzácnejší taliansky mramor. Je symbolom absolútneho luxusu v modernej kuchyni.',
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
      closing: 'CALACATTA GOLD nie je len kuchynská doska — je to investícia do krásy vášho domova. Kameň, ktorý povyšuje každodenné varenie na zážitok a robí dojem na každého, kto vkročí do vašej kuchyne.',
    },
  },
  {
    id: 's5',
    name: 'Industrial Concrete',
    image: 'https://picsum.photos/seed/concrete1/1200/900',
    pricePerM2: 165,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Autentický vzhľad betónu s výhodami keramiky.',
    category: 'beton',
    sku: 'IC-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Matný',
    edgeStyle: 'Rovná hrana',
    color: 'Sivá betónová',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 15,
    applications: ['Kuchynské dosky', 'Obklad stien', 'Podlahy', 'Fasády'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/concrete1/1200/900',
      'https://picsum.photos/seed/concrete2/1200/900',
      'https://picsum.photos/seed/concrete3/1200/900',
      'https://picsum.photos/seed/concrete4/1200/900',
    ],

    // Rich description
    richDescription: {
      intro: 'INDUSTRIAL CONCRETE prináša autentický surový vzhľad betónu do vášho interiéru — no s výhodami modernej keramickej technológie. Matný povrch s jemnou textúrou dodá vášmu priestoru charakteristický industriálny šarm bez kompromisov v odolnosti.',
      highlights: [
        'Verný betónový vzhľad bez pórov a nedokonalostí betónu',
        'Matný povrch odolný voči odtlačkom prstov',
        'UV stabilný — ideálny aj pre fasády a exteriéry',
        'Najdostupnejší prémiový kameň v našej ponuke',
        'Perfektný pre lofty, industriálne kuchyne a moderné bary',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Matný' },
      ],
      closing: 'INDUSTRIAL CONCRETE je pre tých, ktorí milujú surový, nekompromisný dizajn. Spojenie betónovej estetiky s keramickou odolnosťou vytvára materiál, ktorý je rovnako tvrdý ako vyzerá.',
    },
  },
  {
    id: 's6',
    name: 'Sahara Noir',
    image: 'https://picsum.photos/seed/sahara1/1200/900',
    pricePerM2: 230,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Exotický čierny kameň so zlatými a bielymi elementmi.',
    category: 'mramor',
    sku: 'SN-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Rovná hrana',
    color: 'Čierna so zlatými žilkami',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 6,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Komerčné interiéry'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/sahara1/1200/900',
      'https://picsum.photos/seed/sahara2/1200/900',
      'https://picsum.photos/seed/sahara3/1200/900',
      'https://picsum.photos/seed/sahara4/1200/900',
    ],

    // Rich description
    richDescription: {
      intro: 'SAHARA NOIR je exotickým klenotom v našej kolekcii. Hlboká čierna so zlatými a bielymi elementmi evokuje mystérium saharskej noci a prináša do interiéru neopakovateľnú atmosféru luxusu a tajomstva.',
      highlights: [
        'Unikátna kombinácia zlatých a bielych žiliek na čiernom podklade',
        'Každá platňa je vizuálnym umeleckým dielom',
        'Leštený povrch umocňuje hĺbku a kontrast farieb',
        'Ideálny pre statement ostrovčeky a barové pulty',
        'Odolný voči všetkým bežným kuchynským látkam',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'SAHARA NOIR je pre tých, ktorí hľadajú niečo výnimočné. Kameň, ktorý rozprávkuje príbeh a premieňa bežnú kuchyňu na priestor s dušou a charakterom.',
    },
  },
  {
    id: 's7',
    name: 'Avorio Diagonale',
    image: 'https://picsum.photos/seed/avorio1/1200/900',
    pricePerM2: 175,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Teplý krémový odtieň s jemnou textúrou.',
    category: 'jednofarebne',
    sku: 'AD-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Silk',
    edgeStyle: 'Rovná hrana',
    color: 'Krémová',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 9,
    applications: ['Kuchynské dosky', 'Kúpeľne', 'Obklad stien'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/avorio1/1200/900',
      'https://picsum.photos/seed/avorio2/1200/900',
      'https://picsum.photos/seed/avorio3/1200/900',
      'https://picsum.photos/seed/avorio4/1200/900',
    ],

    // Rich description
    richDescription: {
      intro: 'AVORIO DIAGONALE prináša teplý krémový odtieň s jemnou diagonálnou textúrou, ktorá dodáva povrchu subtílny pohyb a hĺbku. Hedvábny (silk) povrch kombinuje elegantný vzhľad s príjemným dotykom.',
      highlights: [
        'Teplý krémový tón pre útulnú a príjemnú atmosféru',
        'Silk povrch — hladký na dotyk, bez ostrých reflexií',
        'Jemná textúra dodáva povrchu živosť bez rušivého vzoru',
        'Univerzálne použitie v kuchyni, kúpeľni aj na obklad stien',
        'Harmonicky ladí s drevenými a kovovými prvkami',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Silk' },
      ],
      closing: 'AVORIO DIAGONALE je voľbou pre interiéry, kde má vládnuť teplo a pohostinnosť. Krémový kameň, ktorý premení vašu kuchyňu na miesto, kde sa rodina rada stretáva.',
    },
  },
  {
    id: 's8',
    name: 'Travertino Romano',
    image: 'https://picsum.photos/seed/travertino1/1200/900',
    pricePerM2: 199,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Klasická krása travertínu bez potreby náročnej údržby.',
    category: 'granit',
    sku: 'TR-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Matný',
    edgeStyle: 'Rovná hrana',
    color: 'Béžová travertínová',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 7,
    applications: ['Kuchynské dosky', 'Kúpeľne', 'Obklad stien', 'Podlahy'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/travertino1/1200/900',
      'https://picsum.photos/seed/travertino2/1200/900',
      'https://picsum.photos/seed/travertino3/1200/900',
      'https://picsum.photos/seed/travertino4/1200/900',
    ],

    // Rich description
    richDescription: {
      intro: 'TRAVERTINO ROMANO zachytáva nadčasovú krásu klasického talianskeho travertínu — no bez jeho typickej náročnej údržby. Béžové tóny s charakteristickými prírodnými pásmi dodajú vášmu priestoru mediteránsky šarm a elegantný pokoj.',
      highlights: [
        'Autentický travertínový vzhľad bez nutnosti impregnácie',
        'Teplé béžové tóny pre klasický aj moderný interiér',
        'Matný povrch s prírodnou haptikою',
        'Vhodný na podlahy — odolnosť voči opotrebeniu',
        'Nulová údržba navyše — len voda a saponát',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Matný' },
      ],
      closing: 'TRAVERTINO ROMANO je most medzi klasickou krásou a modernou technológiou. Kameň pre tých, ktorí milujú tradičnú estetiku, no nechcú sa vzdať pohodlia bezúdržbového materiálu.',
    },
  },
  {
    id: 's9',
    name: 'Onyx Blue',
    image: 'https://picsum.photos/seed/onyx1/1200/900',
    pricePerM2: 350,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Unikátny polodrahokamový vzhľad s podsvietiteľnou štruktúrou.',
    category: 'mramor',
    sku: 'OB-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Skosená hrana',
    color: 'Modrá onyxová',
    weight: 148,
    countryOfOrigin: 'IT',
    stockQuantity: 2,
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Komerčné interiéry', 'Nábytok'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '10 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/onyx1/1200/900',
      'https://picsum.photos/seed/onyx2/1200/900',
      'https://picsum.photos/seed/onyx3/1200/900',
      'https://picsum.photos/seed/onyx4/1200/900',
    ],

    // Rich description
    richDescription: {
      intro: 'ONYX BLUE je najexkluzívnejší kameň v našej kolekcii. Unikátny polodrahokamový vzhľad s hlbokými modrými tónmi a translúcentnou štruktúrou, ktorá umožňuje efektné podsvietenie. Je to doslova šperkom vašej kuchyne.',
      highlights: [
        'Polodrahokamový vzhľad s hĺbkou a translúciou',
        'Možnosť LED podsvietenia pre wow efekt',
        'Skosená hrana pre luxusný detailný profil',
        'Krajina pôvodu: Taliansko — najexkluzívnejšie spracovanie',
        'Limitovaná dostupnosť — exkluzívny materiál',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'ONYX BLUE nie je pre každého — je pre tých, ktorí hľadajú absolútnu exkluzivitu. Kameň, ktorý sa stane ústredným bodom každého priestoru a predmetom obdivu vašich hostí.',
    },
  },
  {
    id: 's10',
    name: 'Pure White Absolute',
    image: 'https://picsum.photos/seed/purewhite1/1200/900',
    pricePerM2: 290,
    dimensions: '3200 x 1600 mm',
    thickness: '12mm',
    inStock: true,
    description: 'Absolútna biela, najčistejší odtieň na trhu.',
    category: 'jednofarebne',
    sku: 'PWA-3200-1600-12',
    vendor: 'OROSTONE',
    productType: 'Sinterovaný kameň',
    material: 'Sinterovaný kameň',
    finish: 'Leštený',
    edgeStyle: 'Rovná hrana',
    color: 'Čisto biela',
    weight: 148,
    countryOfOrigin: 'CN',
    stockQuantity: 10,
    applications: ['Kuchynské dosky', 'Kúpeľne', 'Obklad stien', 'Komerčné interiéry'],
    heatResistance: 'Do 300°C',
    uvResistance: true,
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý povrch',
    porosity: '< 0.1%',
    deliveryTimeframe: '5 pracovných dní',
    packagingInfo: 'Drevená paleta, ochranná fólia',
    handlingNotes: 'Vyžaduje manipulačnú techniku (148 kg)',
    gallery: [
      'https://picsum.photos/seed/purewhite1/1200/900',
      'https://picsum.photos/seed/purewhite2/1200/900',
      'https://picsum.photos/seed/purewhite3/1200/900',
      'https://picsum.photos/seed/purewhite4/1200/900',
    ],

    // Rich description
    richDescription: {
      intro: 'PURE WHITE ABSOLUTE je najčistejšia biela na trhu sinterovaných kameňov. Žiadne žilky, žiadne odtiene — len dokonalá, bezchybná biela plocha, ktorá maximalizuje jas a čistotu vášho interiéru.',
      highlights: [
        'Absolútna biela bez akýchkoľvek odtieňov či žiliek',
        'Leštený povrch s maximálnou svetelnou odrazivosťou',
        'Hygienický povrch vhodný aj pre laboratóriá a ordinácie',
        'Vizuálne zväčšuje priestor — ideálny pre menšie kuchyne',
        'Dokonalý základ pre kontrastné dizajnové prvky',
      ],
      specs: [
        { label: 'Rozmer platne', value: '3200 mm × 1600 mm' },
        { label: 'Hrúbka', value: '12 mm' },
        { label: 'Plocha', value: '5,12 m²' },
        { label: 'Povrchová úprava', value: 'Leštený' },
      ],
      closing: 'PURE WHITE ABSOLUTE je pre perfekcionistov, ktorí veria v silu čistého dizajnu. Biela, ktorá nie je nudná — je to plátno, na ktorom vyniknú všetky vaše ostatné dizajnové rozhodnutia.',
    },
  }
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
