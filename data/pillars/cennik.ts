// ===========================================
// /cennik — pillar page data
// ===========================================
// Shared by pages/Cennik.tsx (React) AND scripts/prerender.ts.
// All numbers come from data/pricing.ts — no hardcoded prices here.
import {
  COUNTERTOP_PER_BM,
  INSTALLATION_RATE_PER_M2,
  PRICING_LAST_UPDATED,
  SLAB_PRICE_MIN,
  SLAB_PRICE_MAX,
  formatEur,
} from '../pricing';
import { COMPARISON_DATA, VYHODY_COMPARISON_COLUMNS, type PillarFaq } from './vyhody';

// SEO identity of /cennik. The page owns the demand phrase „kamenná pracovná
// doska cena" (Keyword Planner SK ~140/mes., 2026-09) — the blogs about umelý
// and technický kameň keep their own queries and link here. The year follows
// PRICING_LAST_UPDATED, so it only moves when prices are actually re-confirmed.
const PRICING_YEAR = PRICING_LAST_UPDATED.slice(0, 4);

export const CENNIK_TITLE = `Kamenná pracovná doska: cena za m² a bm (${PRICING_YEAR}) | OROSTONE`;

export const CENNIK_DESCRIPTION = `Sinterovaný kameň od ${formatEur(
  SLAB_PRICE_MIN,
)}/m² s DPH, kompletná realizácia ${INSTALLATION_RATE_PER_M2} €/m² a porovnanie cien s inými materiálmi. Presnú ponuku pripravíme z pôdorysu.`;

export const CENNIK_H1 = 'Koľko stojí kamenná pracovná doska?';

/** Direct-answer paragraph under the H1 — the citable summary with numbers. */
export const CENNIK_DIRECT_ANSWER = `Dekory sinterovaného kameňa Orostone stoja ${formatEur(
  SLAB_PRICE_MIN,
)}–${formatEur(
  SLAB_PRICE_MAX,
)}/m² s DPH (platňa 3200 × 1600 × 12 mm). Kompletná realizácia — zameranie, doprava, opracovanie hrán, leštenie a montáž — vychádza ${INSTALLATION_RATE_PER_M2} €/m² s DPH. Hotová pracovná doska vrátane fabrikácie a montáže vychádza orientačne ${COUNTERTOP_PER_BM.min}–${COUNTERTOP_PER_BM.max} €/bm. Presnú cenu pripravíme z pôdorysu.`;

export const CENNIK_FAQS: PillarFaq[] = [
  {
    question: 'Prečo uvádzate cenu za m² aj za bežný meter?',
    answer:
      'Cena za m² sa vzťahuje na materiál — platňu 3200 × 1600 mm. Cena za bežný meter (€/bm) vyjadruje kompletnú hotovú pracovnú dosku vrátane fabrikácie a montáže — je to najpresnejší spôsob, ako porovnávať ponuky medzi dodávateľmi.',
  },
  {
    question: `Čo zahŕňa cena realizácie ${INSTALLATION_RATE_PER_M2} €/m²?`,
    answer: `Zameranie, dopravu, opracovanie hrán, leštenie a montáž. Výrobu a montáž realizujú partnerskí kamenári so skúsenosťou so sinterovaným kameňom. Cena je orientačná — spresní sa po obhliadke.`,
  },
  {
    question: 'Sú uvedené ceny konečné?',
    answer:
      'Ceny dekorov sú za m² materiálu vrátane DPH a synchronizujú sa priamo s e-shopom. Finálna cena projektu závisí od rozmerov, počtu výrezov, typu hrany a dopravy — presnú ponuku pripravíme z pôdorysu.',
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
      'Pošlite nám pôdorys alebo základné rozmery s počtom výrezov (drez, varná doska, batéria). Pripravíme ponuku s rozpisom: materiál, fabrikácia, doprava a montáž — aby ste porovnávali kompletné čísla, nie len cenu platne.',
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

export interface ProjectScenario {
  label: string;
  bm: number;
  min: number;
  max: number;
}

const scenario = (label: string, bm: number): ProjectScenario => ({
  label,
  bm,
  min: bm * COUNTERTOP_PER_BM.min,
  max: bm * COUNTERTOP_PER_BM.max,
});

/** Model project examples derived from the official €/bm range. */
export const CENNIK_SCENARIOS: ProjectScenario[] = [
  scenario('Rovná kuchynská linka, 3 bm', 3),
  scenario('Linka s ostrovčekom, spolu 5 bm', 5),
];

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
