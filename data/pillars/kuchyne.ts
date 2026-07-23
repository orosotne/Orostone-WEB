// ===========================================
// /kuchyne — pillar page data
// ===========================================
// Shared by pages/Kuchyne.tsx (React) AND scripts/prerender.ts.
// Icons stay in the page component (zip by index).
import {
  COUNTERTOP_PER_BM,
  SLAB_PRICE_MIN,
  HEAT_RESISTANCE_C,
  MAX_SLAB_FORMAT,
  SLAB_THICKNESS_MM,
  formatEur,
} from '../pricing';
import type { PillarFaq } from './vyhody';

export const KITCHEN_FAQS: PillarFaq[] = [
  {
    question: 'Koľko stojí kuchynská doska zo sinterovaného kameňa?',
    answer: `Kompletná pracovná doska vrátane fabrikácie a montáže vychádza orientačne od ${COUNTERTOP_PER_BM.min} do ${COUNTERTOP_PER_BM.max} €/bm. Samotný materiál stojí od ${formatEur(SLAB_PRICE_MIN)}/m² s DPH podľa dekoru. Presnú cenu pripravíme z pôdorysu — pošlite nám rozmery a počet výrezov.`,
  },
  {
    question: 'Aký je termín dodania a inštalácie?',
    answer:
      'Od konzultácie po inštaláciu kamenárom zvyčajne 2-3 týždne. Samotná inštalácia kamenárom trvá 2-3 hodiny.',
  },
  {
    question: 'Znečistí sa sinterovaný kameň od jedla alebo vína?',
    answer:
      'Nie. Sinterovaný kameň má prakticky nulovú nasiakavosť (< 0,1 %), takže škvrny od vína, kávy ani oleja neprenikajú do povrchu. Stačí utrieť vlhkou utierkou.',
  },
  {
    question: 'Môžem položiť horúci hrniec priamo na dosku?',
    answer: `Áno. Sinterovaný kameň odoláva teplotám nad ${HEAT_RESISTANCE_C} °C a horúce hrnce ani panvice na ňom nezanechajú stopy. Jediné riziko je prudký teplotný šok — extrémne lokálne zohriatie a okamžité schladenie toho istého miesta.`,
  },
  {
    question: 'Aká hrúbka platne je lepšia — 12 mm alebo 20 mm?',
    answer: `V ponuke Orostone sú platne s hrúbkou ${SLAB_THICKNESS_MM} mm vo formáte ${MAX_SLAB_FORMAT}. Pre kuchynské dosky je pri správnom podložení plne dostatočná a ako jediná umožňuje integráciu neviditeľnej varnej dosky. Masívnejší vzhľad hrany sa rieši podlepením hrany pri fabrikácii, nie hrubšou platňou.`,
  },
];

/** Feature grid — text only; icons live in pages/Kuchyne.tsx (zip by index). */
export const KUCHYNE_FEATURES: { title: string; description: string }[] = [
  {
    title: 'Na mieru',
    description:
      'Každá kuchyňa je unikátna. Dosky sú rezané CNC technológiou na presné rozmery vašej kuchyne — vrátane výrezov pre drez, varič a batériu.',
  },
  {
    title: '12 dekórov',
    description:
      'Od klasického bieleho mramoru po dramatickú čiernu — nájdite dekór, ktorý ladí s vašou kuchyňou.',
  },
  {
    title: 'Bez údržby',
    description:
      'Nepotrebuje impregnáciu ani špeciálne čistenie. Stačí vlhká utierka — každý deň, celé roky.',
  },
];

export const KUCHYNE_PROCESS_STEPS: { title: string; description: string }[] = [
  {
    title: 'Pôdorys a konzultácia',
    description:
      'Prinesiete pôdorys, my prejdeme cez ostrovček, zástenu, plochy a riešenia bez kompromisu.',
  },
  {
    title: 'Výber dekoru v Bošanoch',
    description:
      'V showroome v Bošanoch porovnáte celé platne pri dennom svetle a vyberiete kompozíciu.',
  },
  {
    title: 'Príprava projektu',
    description:
      'Pripravíme špecifikáciu, prepojíme vás s kamenárom, ktorý zameria a spracuje dosky.',
  },
  {
    title: 'Inštalácia kamenárom',
    description:
      'Kamenár dosky osadí u vás doma. My koordinujeme termín a kontrolujeme výsledok.',
  },
];
