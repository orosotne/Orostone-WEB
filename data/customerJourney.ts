// ===========================================
// One public customer journey — the same three steps everywhere
// ===========================================
// Owner decision 25. 10. 2026: three steps, as on oro-klient, and the orientation
// price "spravidla nasledujúci pracovný deň". Shared by the homepage (HomeProcess),
// /kuchyne, /realizacie and scripts/prerender.ts. The detailed 10-step breakdown
// lives only in llms-full.txt and the blog guide.

export interface JourneyStep {
  title: string;
  text: string;
}

export const CUSTOMER_JOURNEY_STEPS: readonly JourneyStep[] = [
  {
    title: 'Orientačná cena',
    text: 'Štyri krátke otázky: čo riešite, aký dekor sa vám páči, kedy plánujete a kam vám cenu poslať. Odpovieme spravidla nasledujúci pracovný deň.',
  },
  {
    title: 'Zameranie',
    text: 'Kamenár ručne zameria kuchyňu u vás doma. Potom dostanete presnú ponuku, položku po položke.',
  },
  {
    title: 'Výroba a montáž',
    text: 'Orostone dodá materiál, dohodne s kamenárom termín a zákazku sleduje až do montáže. Za výrobu a montáž zodpovedá kamenár.',
  },
];

/** Samples and the showroom are optional, before step 1. */
export const CUSTOMER_JOURNEY_NOTE =
  'Ešte pred prvým krokom si môžete objednať vzorku alebo si celé platne pozrieť v showroome v Bošanoch.';
