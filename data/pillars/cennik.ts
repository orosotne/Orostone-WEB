// ===========================================
// /cennik — pillar page data
// ===========================================
// Shared by pages/Cennik.tsx (React) AND scripts/prerender.ts.
// All numbers come from data/pricing.ts — no hardcoded prices here.
import {
  BULK_DISCOUNT,
  INSTALLATION_RATE_PER_M2,
  PRICING_LAST_UPDATED,
  SLAB_PRICE_MIN,
  SLAB_PRICE_MAX,
  SLAB_TOTAL_MIN,
  SLAB_TOTAL_MAX,
  bulkDiscountPercent,
  formatEur,
  formatEurWhole,
} from '../pricing';
import { COMPARISON_DATA, VYHODY_COMPARISON_COLUMNS, type PillarFaq } from './vyhody';

// SEO identity of /cennik. The page owns the demand phrase „kamenná pracovná
// doska cena" (Keyword Planner SK ~140/mes., 2026-09) — the blogs about umelý
// and technický kameň keep their own queries and link here. The year follows
// PRICING_LAST_UPDATED, so it only moves when prices are actually re-confirmed.
// Orostone sells material only (whole slabs) — every price here is material.
const PRICING_YEAR = PRICING_LAST_UPDATED.slice(0, 4);

export const CENNIK_TITLE = `Kamenná pracovná doska: cena za m² (${PRICING_YEAR}) | OROSTONE`;

export const CENNIK_DESCRIPTION = `Sinterovaný kameň od ${formatEur(SLAB_PRICE_MIN)}/m² s DPH, celá platňa od ${formatEurWhole(
  SLAB_TOTAL_MIN,
)}. Pozrite, koľko platní potrebuje kuchyňa a ako cena vychádza oproti iným materiálom.`;

export const CENNIK_H1 = 'Koľko stojí kamenná pracovná doska?';

/** Direct-answer paragraph under the H1 — the citable summary with numbers. */
export const CENNIK_DIRECT_ANSWER = `Dekory sinterovaného kameňa Orostone stoja ${formatEur(SLAB_PRICE_MIN)}–${formatEur(
  SLAB_PRICE_MAX,
)}/m² s DPH. Predávame celé platne 3200 × 1600 × 12 mm — jedna stojí ${formatEurWhole(SLAB_TOTAL_MIN)}–${formatEurWhole(
  SLAB_TOTAL_MAX,
)} a od ${BULK_DISCOUNT.quantity} platní je zľava ${BULK_DISCOUNT.discountPercent} %. Na bežnú kuchyňu stačia 1 – 2 platne. Zameranie, výrobu a montáž robí partnerský kamenár — tieto práce nie sú súčasťou ceny materiálu. Koľko platní potrebujete, určíme z pôdorysu.`;

export const CENNIK_FAQS: PillarFaq[] = [
  {
    question: 'Prečo uvádzate cenu za m² aj za platňu?',
    answer:
      'Cena za m² pomáha porovnať dekory aj materiály medzi sebou. Predávame však celé platne 3200 × 1600 mm (5,12 m²), preto o cene materiálu rozhoduje počet platní — určíme ho z pôdorysu.',
  },
  {
    question: `Čo zahŕňa cena realizácie ${INSTALLATION_RATE_PER_M2} €/m²?`,
    answer: `Zameranie, dopravu, opracovanie hrán, leštenie a montáž. Tieto práce robí partnerský kamenár so skúsenosťou so sinterovaným kameňom a nie sú súčasťou ceny materiálu od Orostone. Sadzba je orientačná — spresní sa po obhliadke.`,
  },
  {
    question: 'Sú uvedené ceny konečné?',
    answer:
      'Ceny dekorov sú konečné ceny materiálu s DPH a synchronizujú sa priamo s e-shopom. Cenu materiálu určuje počet platní, ktorý spočítame z pôdorysu. Výrobu a montáž nacení kamenár podľa rozmerov, výrezov a typu hrany.',
  },
  {
    question: 'Viete mi aktuálnu cenu garantovať?',
    answer:
      'Áno. Rezervačný poplatok 99 € vám garantuje aktuálnu cenu produktov Orostone na 6 mesiacov. Podmienky nájdete na stránke Podmienky rezervácie ceny.',
  },
  {
    question: 'Koľko stojí vzorka dekoru?',
    answer:
      'Vzorky dekorov posielame zadarmo. Vyberte si dekor na stránke Vzorky a vyplňte formulár — vzorku doručíme kuriérom.',
  },
  {
    question: 'Ako získam presnú cenovú ponuku?',
    answer:
      'Pošlite nám pôdorys alebo základné rozmery s počtom výrezov (drez, varná doska, batéria). Spočítame, koľko platní potrebujete, a pripravíme ponuku na materiál. Výrobu a montáž vám nacení partnerský kamenár, aby ste poznali aj celkovú cenu kuchyne.',
  },
];

/** Čo ovplyvňuje finálnu cenu — sourced from article-24 factor list. */
export const CENNIK_PRICE_FACTORS: string[] = [
  'Dekor a jeho cenová hladina',
  'Využitie materiálu z platne 3200 × 1600 mm (počet platní)',
  'Počet a typ výrezov — drez, varná doska, batéria',
  'Typ hrany a jej opracovanie',
  'Počet spojov a náročnosť napájania kresby',
  'Veľkosť ostrovčeka a prípadný book-match',
  'Doprava a prístup na miesto montáže',
];

export interface MaterialScenario {
  label: string;
  slabs: number;
  discountPercent: number;
  min: number;
  max: number;
}

const scenario = (label: string, slabs: number): MaterialScenario => {
  const discountPercent = bulkDiscountPercent(slabs);
  const factor = slabs * (1 - discountPercent / 100);
  return {
    label,
    slabs,
    discountPercent,
    min: Math.round(SLAB_TOTAL_MIN * factor),
    max: Math.round(SLAB_TOTAL_MAX * factor),
  };
};

/**
 * Material-only examples (cheapest → most expensive decor) from the live
 * Shopify slab prices and the cart's bulk discount. Orostone does not sell
 * installation, so no fabrication or montáž is included.
 */
export const CENNIK_SCENARIOS: MaterialScenario[] = [
  scenario('Rovná linka do 3,2 m', 1),
  scenario('Linka s ostrovčekom a zástenou', 2),
  scenario('Veľká kuchyňa s ostrovom a zástenou', 3),
];

/** „1 platňa", „2 platne", „3 platne, −20 %" */
export const scenarioSlabsText = (s: MaterialScenario): string =>
  `${s.slabs} ${s.slabs === 1 ? 'platňa' : s.slabs < 5 ? 'platne' : 'platní'}${
    s.discountPercent > 0 ? `, −${s.discountPercent} %` : ''
  }`;

/**
 * Price by material — answers the „kamenná pracovná doska cena" intent, where
 * the ranking pages compare materials. Rows are picked from COMPARISON_DATA
 * (single source shared with /vyhody), so the numbers cannot drift apart; a
 * renamed property simply drops out instead of crashing the page.
 */
const CENNIK_COMPARISON_PROPERTIES = [
  'Orientačná cena materiálu',
  'Impregnácia',
  'Odolnosť teplu',
  'UV stabilita',
  'Údržba',
];

export const CENNIK_COMPARISON = {
  heading: 'Cena kamennej pracovnej dosky podľa materiálu',
  intro:
    'Pri pracovnej doske nedáva zmysel čítať cenu izolovane. Ide o plochu, ktorú budete denne používať aj denne vidieť — preto porovnávajte cenu materiálu spolu s tým, čo si vyžaduje počas používania. Sinterovaný kameň klienti často poznajú aj ako technický kameň alebo keramickú dosku.',
  columnLabels: ['Vlastnosť', ...Object.values(VYHODY_COMPARISON_COLUMNS)],
  rows: CENNIK_COMPARISON_PROPERTIES.flatMap((property) => {
    const r = COMPARISON_DATA.find((row) => row.property === property);
    return r ? [[r.property, r.sintered, r.granite, r.quartz, r.marble]] : [];
  }),
};

/** Related guides linked under the comparison (hub → cluster pages). */
export const CENNIK_RELATED_LINKS = [
  { label: 'Porovnanie vlastností materiálov', href: '/vyhody' },
  { label: 'Cena technického kameňa podľa typu', href: '/blog/technicky-kamen-cena-pracovna-doska' },
  { label: 'Umelý kameň na pracovnú dosku: cenové hladiny', href: '/blog/umely-kamen-pracovna-doska' },
];
