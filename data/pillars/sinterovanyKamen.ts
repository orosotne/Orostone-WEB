// ===========================================
// /sinterovany-kamen — pillar page data
// ===========================================
// Shared by pages/SinterovanyKamen.tsx (React) AND scripts/prerender.ts.
import type { PillarFaq } from './vyhody';

export const SINTEROVANY_KAMEN_FAQ: PillarFaq[] = [
  {
    question: 'Čo je sinterovaný kameň?',
    answer:
      'Sinterovaný kameň je pokročilý povrchový materiál vyrobený zo 100 % prírodných minerálov (kremeň, živec, íl, kovové oxidy). Minerály sú zlisované pod tlakom až 25 000 ton a následne vypálené pri teplote nad 1 200 °C. Výsledkom je plne vitrifikovaný, nepórovitý povrch bez živíc a syntetických spojív.',
  },
  {
    question: 'Je sinterovaný kameň rovnaký ako keramika alebo porcelán?',
    answer:
      'Nie. Hoci sa občas zaraďujú do rovnakej skupiny, sinterovaný kameň sa vyrába pod výrazne vyšším tlakom a dosahuje nasiakavosť pod 0,1 % (keramika 3–10 %). To mu dáva vyššiu pevnosť, odolnosť voči nárazom a vhodnosť na exteriérové aplikácie.',
  },
  {
    question: 'Môžem na sinterovaný kameň položiť horúci hrniec?',
    answer:
      'Áno. Sinterovaný kameň odolá teplotám nad 300 °C bez zmeny farby alebo poškodenia povrchu. Na rozdiel od quartzového kompozitu (max. ~150 °C) nepotrebujete podložku pod horúci riad.',
  },
  {
    question: 'Poškriabe sa sinterovaný kameň?',
    answer:
      'Pri bežnom používaní nie. Tvrdosť sinterovaného kameňa dosahuje 6–8 na Mohsovej stupnici — je tvrdší ako väčšina kuchynského náradia. Pre dlhodobú krásu povrchu však odporúčame používať krájaciu dosku.',
  },
  {
    question: 'Musím sinterovaný kameň impregnovat?',
    answer:
      'Nie. Vďaka nulovej pórovitosti nepotrebuje žiadnu impregnáciu ani špeciálne ošetrenie — na rozdiel od prírodného kameňa (žula, mramor), ktorý vyžaduje pravidelnú impregnáciu.',
  },
  {
    question: 'Ako sa o sinterovaný kameň starať?',
    answer:
      'Jednoducho. Na denné čistenie stačí vlhká utierka s pH neutrálnym čistiacim prostriedkom alebo saponátom. Nepoužívajte bielidlo, amoniak ani brúsne hubky. Tvrdšie nečistoty odstránite neabrazívnym čistiacim prípravkom.',
  },
  {
    question: 'Hodí sa sinterovaný kameň do kúpeľne?',
    answer:
      'Áno, výborne. Nasiakavosť pod 0,1 % znamená odolnosť voči vlhkosti, plesniam a baktériám. Materiál je ideálny na vaničky, obklady, umývadlá aj podlahy v mokrých zónach.',
  },
  {
    question: 'Dá sa sinterovaný kameň použiť na fasádu?',
    answer:
      'Áno. UV stabilita (bez zmeny farby podľa DIN 51094), mrazuvzdornosť, odolnosť voči chemikáliám a nízka hmotnosť (tenké formáty od 3 mm) robia zo sinterovaného kameňa ideálny fasádny materiál.',
  },
  {
    question: 'Aké hrúbky a rozmery sú dostupné?',
    answer:
      'Platne majú štandardný rozmer až 3 200 × 1 600 mm; materiál sa celosvetovo vyrába v hrúbkach od 3 mm do 20 mm. V ponuke Orostone sú platne s hrúbkou 12 mm — štandard pre kuchynské pracovné dosky, ktorý ako jediný umožňuje aj integráciu neviditeľnej varnej dosky. Tenké formáty sa používajú na obklady a fasády.',
  },
  {
    question: 'Je sinterovaný kameň ekologický?',
    answer:
      'Áno. Obsahuje len prírodné minerály, pri výrobe sa nepoužívajú živice ani VOC látky. Materiál je recyklovateľný, neemituje škodlivé chemikálie a výrobný proces využíva rekuperáciu tepla.',
  },
];

export interface SkComparisonRow {
  property: string;
  sintered: string;
  natural: string;
  quartz: string;
  ceramic: string;
  laminate: string;
}

export const SINTEROVANY_KAMEN_COMPARISON: SkComparisonRow[] = [
  {
    property: 'Odolnosť teplu',
    sintered: '> 300 °C',
    natural: '~ 200 °C',
    quartz: '~ 150 °C',
    ceramic: '~ 200 °C',
    laminate: '~ 80 °C',
  },
  {
    property: 'Nasiakavosť',
    sintered: '< 0,1 %',
    natural: '0,1–3 %',
    quartz: '< 0,1 %',
    ceramic: '3–10 %',
    laminate: 'Vysoká',
  },
  {
    property: 'Tvrdosť (Mohs)',
    sintered: '6–8',
    natural: '3–7',
    quartz: '6–7',
    ceramic: '5–6',
    laminate: '2–3',
  },
  {
    property: 'UV stabilita',
    sintered: 'Áno',
    natural: 'Čiastočne',
    quartz: 'Nie',
    ceramic: 'Čiastočne',
    laminate: 'Nie',
  },
  {
    property: 'Odolnosť škvrnám',
    sintered: 'Výborná',
    natural: 'Slabá – stredná',
    quartz: 'Výborná',
    ceramic: 'Stredná',
    laminate: 'Slabá',
  },
  {
    property: 'Impregnácia',
    sintered: 'Nepotrebuje',
    natural: 'Pravidelne',
    quartz: 'Nepotrebuje',
    ceramic: 'Podľa typu',
    laminate: 'Nepotrebuje',
  },
  {
    property: 'Údržba',
    sintered: 'Minimálna',
    natural: 'Náročná',
    quartz: 'Nízka',
    ceramic: 'Stredná',
    laminate: 'Nízka',
  },
  {
    property: 'Exteriér / fasády',
    sintered: 'Áno',
    natural: 'Obmedzene',
    quartz: 'Nie',
    ceramic: 'Obmedzene',
    laminate: 'Nie',
  },
];

export const SK_COMPARISON_COLUMNS = {
  sintered: 'Sinterovaný kameň',
  natural: 'Prírodný kameň',
  quartz: 'Quartz',
  ceramic: 'Keramika',
  laminate: 'Laminát',
} as const;
