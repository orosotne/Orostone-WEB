// ===========================================
// /kuchyne — pillar page data
// ===========================================
// Shared by pages/Kuchyne.tsx (React) AND scripts/prerender.ts.
// Icons stay in the page component (zip by index).
import {
  BULK_DISCOUNT,
  SLAB_PRICE_MIN,
  SLAB_PRICE_MAX,
  SLAB_TOTAL_MIN,
  SLAB_TOTAL_MAX,
  HEAT_RESISTANCE_C,
  MAX_SLAB_FORMAT,
  SLAB_THICKNESS_MM,
  formatEur,
  formatEurWhole,
} from '../pricing';
import type { PillarFaq } from './vyhody';
import { CUSTOMER_JOURNEY_STEPS } from '../customerJourney';

/** H1 matches the page title („Kamenné pracovné dosky do kuchyne | Orostone") — one identity per page. */
export const KUCHYNE_H1 = 'Kamenné pracovné dosky do kuchyne';

export const KITCHEN_FAQS: PillarFaq[] = [
  {
    question: 'Koľko stojí kuchynská doska zo sinterovaného kameňa?',
    answer: `Materiál stojí ${formatEur(SLAB_PRICE_MIN)}–${formatEur(SLAB_PRICE_MAX)}/m² s DPH podľa dekoru, celá platňa 3200 × 1600 mm ${formatEurWhole(SLAB_TOTAL_MIN)}–${formatEurWhole(SLAB_TOTAL_MAX)}. Na bežnú kuchyňu stačia 1 – 2 platne, od ${BULK_DISCOUNT.quantity} platní je zľava ${BULK_DISCOUNT.discountPercent} %. Výrobu a montáž robí a fakturuje partnerský kamenár. Koľko platní potrebujete, určíme z pôdorysu — pošlite nám rozmery a počet výrezov.`,
  },
  {
    question: 'Aký je termín dodania a inštalácie?',
    answer:
      'Od konzultácie po inštaláciu kamenárom zvyčajne 2–3 týždne (10–15 pracovných dní). Samotná inštalácia kamenárom trvá 2–3 hodiny.',
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
    title: '12 dekorov',
    description:
      'Od klasického bieleho mramoru po výraznú čiernu — vyberte si dekor, ktorý ladí s vašou kuchyňou.',
  },
  {
    title: 'Jednoduchá údržba',
    description:
      'Nepotrebuje impregnáciu ani špeciálne čistiace prostriedky. Na každodenné čistenie stačí vlhká utierka.',
  },
];

/** The one public customer journey (data/customerJourney.ts), the same three steps as on the homepage. */
export const KUCHYNE_PROCESS_STEPS: { title: string; description: string }[] = CUSTOMER_JOURNEY_STEPS.map((s) => ({
  title: s.title,
  description: s.text,
}));

// ---------------------------------------------------------------------------
// Vizualizácie: kitchens, each in one decor, shown from four views.
// Rendered in Higgsfield (Nano Banana 2.1) with the decor's slab scan as the reference, zero-distortion views.
// Files: public/images/kuchyne/<decorSlug>-<view>-<width>.avif|webp
// ---------------------------------------------------------------------------

export type KitchenView = 'spredu' | 'zboku' | 'hrana' | 'priestor';

/** Layout order: front, side, edge detail, the room. Ratio (w / h) and the two widths of the files. */
export const KITCHEN_VIEWS: { view: KitchenView; label: string; ratio: number; widths: readonly [number, number] }[] = [
  { view: 'spredu', label: 'spredu', ratio: 3 / 2, widths: [960, 1920] },
  { view: 'zboku', label: 'z boku', ratio: 3 / 4, widths: [720, 1440] },
  { view: 'hrana', label: 'detail hrany', ratio: 1, widths: [720, 1440] },
  { view: 'priestor', label: 'v priestore', ratio: 16 / 9, widths: [960, 1920] },
];

export interface KitchenVisualization {
  /** Product id (/produkt/:id) and the file prefix */
  decorSlug: string;
  decor: string;
  title: string;
  text: string;
  alts: Record<KitchenView, string>;
}

export const KUCHYNE_VIZUALIZACIE_H2 = 'Kuchyne v dekoroch Orostone';
export const KUCHYNE_VIZUALIZACIE_LEAD =
  'Štyri kuchyne, štyri dekory. Každú ukazujeme spredu, z boku, v detaile hrany aj v priestore, bez perspektívneho skreslenia. Kresba kameňa vychádza zo skenu skutočnej platne, takže vidíte, ako dekor pôsobí na ostrovčeku aj na zástene.';

export const KITCHEN_VISUALIZATIONS: KitchenVisualization[] = [
  {
    decorSlug: 'appennino',
    decor: 'Appennino',
    title: 'Svetlá kuchyňa s dubom',
    text: 'Appennino má pokojnú, jemnú kresbu, ktorá na ostrovčeku ani na zástene neruší. Teplý dub a čierne detaily jej dávajú kontrast a kuchyňa zostáva svetlá.',
    alts: {
      spredu: 'Kuchyňa s ostrovčekom a zástenou v dekore Appennino a dubovými skrinkami, pohľad spredu',
      zboku: 'Ostrovček v dekore Appennino z boku, kresba prechádza z dosky cez hranu až k podlahe',
      hrana: 'Detail rohu ostrovčeka v dekore Appennino, žilky pokračujú cez hranu zrezanú pod 45°',
      priestor: 'Kuchyňa v dekore Appennino pri okne, ostrovček s waterfall hranami a zástena cez celú výšku',
    },
  },
  {
    decorSlug: 'roman-travertine',
    decor: 'Roman Travertine',
    title: 'Travertín pod oblúkom',
    text: 'Roman Travertine má textúru travertínu bez nárokov na údržbu, aké má prírodný kameň: pri nasiakavosti pod 0,1\u00A0% ho netreba impregnovať a škvrnu stačí zotrieť vlhkou utierkou. Prirodzene ladí s vápennou omietkou, dubom a tmavým bronzom.',
    alts: {
      spredu: 'Kuchyňa s ostrovčekom v dekore Roman Travertine pod oblúkom z vápennej omietky, pohľad spredu',
      zboku: 'Ostrovček v dekore Roman Travertine z boku, pásy kresby pokračujú cez hranu',
      hrana: 'Detail rohu ostrovčeka v dekore Roman Travertine s miskou fíg a olivovou vetvičkou',
      priestor: 'Kuchyňa v dekore Roman Travertine s oblúkovou nikou, dubovými skrinkami a oknom',
    },
  },
  {
    decorSlug: 'wild-forest',
    decor: 'Wild Forest',
    title: 'Ostrovček ako hlavný prvok',
    text: 'Wild Forest má výraznú kresbu, ktorá sa ukáže až na veľkej ploche. Na ostrovčeku s waterfall hranami ju vidno celú, tmavý dub a matné fronty ju nechávajú vyniknúť.',
    alts: {
      spredu: 'Kuchyňa s ostrovčekom a zástenou v dekore Wild Forest a skrinkami z tmavého dubu, pohľad spredu',
      zboku: 'Bočná strana ostrovčeka v dekore Wild Forest, výrazná žilka prechádza z dosky až k podlahe',
      hrana: 'Detail rohu ostrovčeka v dekore Wild Forest, hrdzavé žilky pokračujú cez hranu',
      priestor: 'Kuchyňa v dekore Wild Forest zo strany, ostrovček, zástena s podsvietenou policou a okno',
    },
  },
  {
    decorSlug: 'nero-margiua',
    decor: 'Nero Margiua',
    title: 'Čierny ostrovček a krémové fronty',
    text: 'Nero Margiua funguje najlepšie ako kontrast. Pri krémových frontoch a svetlom dube čierna doska vynikne a jemné strieborno-biele žilky ju prepoja so svetlým okolím.',
    alts: {
      spredu: 'Kuchyňa s čiernym ostrovčekom a zástenou v dekore Nero Margiua a krémovými skrinkami, pohľad spredu',
      zboku: 'Ostrovček v dekore Nero Margiua z boku, biele žilky pokračujú z dosky cez hranu',
      hrana: 'Detail rohu ostrovčeka v dekore Nero Margiua, tenké biele žilky prechádzajú cez hranu zrezanú pod 45°',
      priestor: 'Kuchyňa v dekore Nero Margiua zo strany, čierny ostrovček, krémové skrinky a okná',
    },
  },
];

export const kitchenImage = (decorSlug: string, view: KitchenView, width: number, ext: 'avif' | 'webp') =>
  `/images/kuchyne/${decorSlug}-${view}-${width}.${ext}`;
