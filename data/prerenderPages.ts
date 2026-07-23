// ===========================================
// PRERENDER PAGE DATA — shared route definitions
// ===========================================
// Extracted from scripts/prerender.ts so the prerender, the sitemap/llms
// generator (scripts/generate-seo-artifacts.ts) and the build validator
// (scripts/validate-dist.ts) all consume ONE definition of the static routes.
// Keep this module free of React imports — it is loaded by tsx build scripts.
import { CATEGORY_SEO } from './seo/categories';
import {
  VYHODY_FAQ,
  COMPARISON_DATA,
  VYHODY_COMPARISON_COLUMNS,
  VYHODY_VERDICTS,
  VYHODY_RELATED_LINKS,
  type PillarFaq,
} from './pillars/vyhody';
import {
  SINTEROVANY_KAMEN_FAQ,
  SINTEROVANY_KAMEN_COMPARISON,
  SK_COMPARISON_COLUMNS,
} from './pillars/sinterovanyKamen';

export interface PrerenderComparison {
  heading: string;
  columnLabels: string[];
  rows: string[][];
}

export interface InfoPage {
  route: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  extraLinks?: { label: string; href: string }[];
  /** Sitemap hints (carried over from the previously hand-maintained sitemap). */
  changefreq: string;
  priority: string;
  /** Optional pillar content rendered into the prerendered HTML + FAQPage JSON-LD. */
  faqs?: PillarFaq[];
  comparison?: PrerenderComparison;
  sections?: { heading: string; html: string }[];
}

export const INFO_PAGES: InfoPage[] = [
  {
    route: '/kontakt',
    title: 'Kontakt | OROSTONE — sinterovaný kameň',
    description:
      'Cenová ponuka, vzorky alebo konzultácia k pracovnej doske zo sinterovaného kameňa. Showroom Bošany, dodanie po celom Slovensku.',
    h1: 'Kontakt',
    intro:
      'OROSTONE — slovenský dodávateľ sinterovaného kameňa. Showroom Bošany: SNP 113/1, 956 18 Bošany — otvorené po–pia 9:00–17:00, cez víkend po dohode. Sídlo: Landererova 8, 811 09 Bratislava (nejde o showroom). Telefón: +421 917 588 738. E-mail: info@orostone.sk. Radi pre vás pripravíme konzultáciu a cenovú ponuku.',
    extraLinks: [
      { label: 'Objednať vzorky', href: '/vzorky' },
      { label: 'Prehliadnuť produkty', href: '/kategoria/sintered-stone' },
    ],
    changefreq: 'monthly',
    priority: '0.5',
  },
  {
    route: '/doprava',
    title: 'Doprava veľkoformátových platní | OROSTONE',
    description:
      'Informácie o doprave, platbe a špeciálnej preprave veľkoformátových platní a vzoriek sinterovaného kameňa po celom Slovensku.',
    h1: 'Doprava a platba',
    intro:
      'OROSTONE zabezpečuje špeciálnu prepravu veľkoformátových sinterovaných platní 3200×1600 mm po celom Slovensku. Platba bankovým prevodom alebo kartou. Expedícia do 1–5 pracovných dní od potvrdenia objednávky.',
    changefreq: 'monthly',
    priority: '0.5',
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
    changefreq: 'monthly',
    priority: '0.4',
  },
  {
    route: '/odstupenie-od-zmluvy',
    title: 'Odstúpenie od zmluvy | OROSTONE',
    description:
      'Formuláre a informácie k odstúpeniu od zmluvy pri nákupe cez OROSTONE e-shop podľa platnej spotrebiteľskej legislatívy.',
    h1: 'Formulár na odstúpenie od zmluvy',
    intro:
      'Vzorový formulár na odstúpenie od kúpnej zmluvy uzavretej na diaľku podľa zákona č. 108/2024 Z.z. o ochrane spotrebiteľa. Spotrebiteľ má právo odstúpiť od zmluvy do 14 dní bez uvedenia dôvodu.',
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    route: '/sinterovany-kamen',
    title: 'Sinterovaný kameň: cena, výhody, použitie | OROSTONE',
    description:
      'Čo je sinterovaný kameň, koľko stojí a kedy dáva zmysel ako pracovná doska. Praktický sprievodca pre kuchyňu, kde nechcete robiť kompromis.',
    h1: 'Sinterovaný kameň — čo to je a prečo ho chcete',
    intro:
      'Sinterovaný kameň je povrch vyrobený z prírodných minerálov pod extrémnym tlakom a teplotou. Odolá teplotám nad 300 °C, škvrnám, UV žiareniu aj škrabancom. Je ideálnym materiálom na kuchynské dosky, obklady kúpeľní a architektonické projekty. Nevyžaduje impregnáciu ani zvláštnu údržbu.',
    extraLinks: [
      { label: 'Výhody sinterovaného kameňa', href: '/vyhody' },
      { label: 'Všetky dekory', href: '/kategoria/sintered-stone' },
    ],
    changefreq: 'monthly',
    priority: '0.9',
    faqs: SINTEROVANY_KAMEN_FAQ,
    comparison: {
      heading: 'Porovnanie materiálov',
      columnLabels: ['Vlastnosť', ...Object.values(SK_COMPARISON_COLUMNS)],
      rows: SINTEROVANY_KAMEN_COMPARISON.map((r) => [
        r.property,
        r.sintered,
        r.natural,
        r.quartz,
        r.ceramic,
        r.laminate,
      ]),
    },
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
      ...VYHODY_RELATED_LINKS,
    ],
    changefreq: 'monthly',
    priority: '0.8',
    faqs: VYHODY_FAQ,
    comparison: {
      heading: 'Sinterovaný kameň vs. ostatné materiály',
      columnLabels: ['Vlastnosť', ...Object.values(VYHODY_COMPARISON_COLUMNS)],
      rows: COMPARISON_DATA.map((r) => [r.property, r.sintered, r.granite, r.quartz, r.marble]),
    },
    sections: [
      {
        heading: 'Kedy zvoliť ktorý materiál',
        html: VYHODY_VERDICTS.map(
          (v) => `<h3>${v.material}</h3><p>${v.verdict}</p>`,
        ).join(''),
      },
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
    changefreq: 'yearly',
    priority: '0.3',
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
    changefreq: 'yearly',
    priority: '0.5',
  },
  {
    route: '/ochrana-sukromia',
    title: 'Ochrana osobných údajov | OROSTONE',
    description:
      'Zásady ochrany osobných údajov spoločnosti OROSTONE s.r.o. Spracúvanie údajov v súlade s GDPR — účely, právny základ a vaše práva.',
    h1: 'Ochrana osobných údajov',
    intro:
      'OROSTONE spracúva vaše osobné údaje v súlade s Nariadením GDPR a zákonom o ochrane osobných údajov. Na tejto stránke nájdete informácie o účeloch spracúvania, právnom základe, dobe uchovávania a o vašich právach dotknutej osoby.',
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    route: '/cookies',
    title: 'Zásady používania cookies a podobných technológií | OROSTONE',
    description:
      'Informácie o cookies a podobných technológiách na webe OROSTONE. Typy technológií, účely spracovania a nastavenie vlastných preferencií.',
    h1: 'Zásady používania cookies',
    intro:
      'OROSTONE používa cookies a podobné technológie na zabezpečenie funkčnosti stránky, analýzu návštevnosti a cielenú reklamu. Na tejto stránke nájdete informácie o jednotlivých typoch cookies, účeloch spracovania a ako si môžete nastaviť vlastné preferencie.',
    changefreq: 'yearly',
    priority: '0.2',
  },
];

// ---------------------------------------------------------------------------
// Color subcategories (/kategoria/sintered-stone/{biele,bezove,sede,cierne})
// Meta strings are derived from data/seo/categories.ts (CATEGORY_SEO) — the
// same source the React CategoryPage uses — so the two can never drift.
// ---------------------------------------------------------------------------

export type ColorSlug = 'biele' | 'bezove' | 'sede' | 'cierne';

export interface ColorSubcategory {
  slug: ColorSlug;
  name: string; // nominative plural (e.g. „Biele")
  metaTitle: string;
  metaDescription: string;
}

const COLOR_NAMES: Record<ColorSlug, string> = {
  biele: 'Biele',
  bezove: 'Béžové',
  sede: 'Šedé',
  cierne: 'Čierne',
};

export const COLOR_SUBCATEGORIES: ColorSubcategory[] = (
  ['biele', 'bezove', 'sede', 'cierne'] as ColorSlug[]
).map((slug) => ({
  slug,
  name: COLOR_NAMES[slug],
  metaTitle: CATEGORY_SEO[`sintered-stone/${slug}`].title,
  metaDescription: CATEGORY_SEO[`sintered-stone/${slug}`].description,
}));
