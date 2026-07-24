// ===========================================
// /vyhody — pillar page data
// ===========================================
// Shared by pages/Vyhody.tsx (React) AND scripts/prerender.ts, so the FAQ,
// comparison table and verdicts served to AI crawlers are always identical
// to what users see. Icons stay in the page component (zip by index).
import { SLAB_PRICE_MIN, SLAB_PRICE_MAX, COUNTERTOP_PER_BM, formatEur } from '../pricing';

export interface PillarFaq {
  question: string;
  answer: string;
}

export const VYHODY_FAQ: PillarFaq[] = [
  {
    question: 'Môžem na sinterovaný kameň položiť horúci hrniec?',
    answer:
      'Áno. Sinterovaný kameň odolá teplotám nad 300 °C bez zmeny farby alebo poškodenia. Na rozdiel od quartzového kompozitu (max ~150 °C) nepotrebujete podložku pod horúci riad.',
  },
  {
    question: 'Ako funguje neviditeľná varná doska v sinterovanom kameni?',
    answer:
      'Indukčný modul sa nainštaluje priamo pod sinterovanú dosku s hrúbkou presne 12 mm. Kameň je nekovový a nepórovitý, takže elektromagnetické pole prechádza bez strát. Dôležité: platne s hrúbkou 20 mm sú príliš hrubé — elektromagnetické pole nimi neprejde dostatočne. Výsledkom je hladký, súvislý povrch bez viditeľných varných zón — varná doska je „neviditeľná".',
  },
  {
    question: 'Je sinterovaný kameň bezúdržbový?',
    answer:
      'Takmer áno. Nasiakavosť pod 0,1 % znamená, že nepotrebuje impregnáciu ani špeciálne čistiace prostriedky. Na denné čistenie stačí vlhká utierka s pH neutrálnym saponátom.',
  },
  {
    question: 'Hodí sa sinterovaný kameň na exteriér?',
    answer:
      'Áno. UV stabilita, mrazuvzdornosť a odolnosť voči chemikáliám robia zo sinterovaného kameňa ideálny materiál na fasády, terasy aj vonkajšie kuchyne.',
  },
  {
    question: 'Aký je rozdiel oproti prírodnej žule alebo mramoru?',
    answer:
      'Sinterovaný kameň má nulovú pórovitosť (žula 0,1–3 %), nepotrebuje impregnáciu, je odolnejší voči škvrnám a kyselinám, a je dostupný vo veľkoformátových doskách až 3 200 × 1 600 mm bez viditeľných spojov.',
  },
  {
    question: 'Koľko stojí sinterovaný kameň v porovnaní s ostatnými materiálmi?',
    answer: `Materiál stojí ${formatEur(SLAB_PRICE_MIN)}–${formatEur(SLAB_PRICE_MAX)}/m² s DPH podľa dekoru; kompletná pracovná doska vrátane fabrikácie a montáže vychádza orientačne ${COUNTERTOP_PER_BM.min}–${COUNTERTOP_PER_BM.max} €/bm. Žula sa pohybuje okolo 180–500 €/m² a quartzový kompozit 150–450 €/m² za materiál — no na rozdiel od nich sinterovaný kameň nevyžaduje impregnáciu ani údržbové náklady počas životnosti. Kompletný cenník nájdete na stránke /cennik.`,
  },
];

export interface VyhodyComparisonRow {
  property: string;
  sintered: string;
  granite: string;
  quartz: string;
  marble: string;
}

export const COMPARISON_DATA: VyhodyComparisonRow[] = [
  { property: 'Odolnosť teplu', sintered: '> 300 °C', granite: '~ 200 °C', quartz: '~ 150 °C', marble: '~ 200 °C' },
  { property: 'Nasiakavosť', sintered: '< 0,1 %', granite: '0,1–3 %', quartz: '< 0,1 %', marble: '0,5–2 %' },
  { property: 'Odolnosť škvrnám', sintered: 'Výborná', granite: 'Stredná', quartz: 'Výborná', marble: 'Slabá' },
  { property: 'Impregnácia', sintered: 'Nepotrebuje', granite: 'Pravidelne', quartz: 'Nepotrebuje', marble: 'Pravidelne' },
  { property: 'UV stabilita', sintered: 'Áno', granite: 'Čiastočne', quartz: 'Nie', marble: 'Čiastočne' },
  { property: 'Údržba', sintered: 'Minimálna', granite: 'Stredná', quartz: 'Nízka', marble: 'Náročná' },
  { property: 'Neviditeľná varná doska', sintered: 'Áno', granite: 'Nie', quartz: 'Nie', marble: 'Nie' },
  { property: 'Max. rozmer dosky', sintered: '3 200 × 1 600 mm', granite: '~ 3 000 × 1 500 mm', quartz: '~ 3 050 × 1 440 mm', marble: '~ 2 400 × 1 200 mm' },
  {
    property: 'Orientačná cena materiálu',
    sintered: `${formatEur(SLAB_PRICE_MIN)}–${formatEur(SLAB_PRICE_MAX)}/m² s DPH (komplet ${COUNTERTOP_PER_BM.min}–${COUNTERTOP_PER_BM.max} €/bm)`,
    granite: '~180–500 €/m²',
    quartz: '~150–450 €/m²',
    marble: 'Individuálne podľa bloku',
  },
];

export const VYHODY_COMPARISON_COLUMNS = {
  sintered: 'Sinterovaný kameň',
  granite: 'Žula',
  quartz: 'Quartz',
  marble: 'Mramor',
} as const;

/** Benefit grid — text only; icons live in pages/Vyhody.tsx (zip by index). */
export const VYHODY_BENEFITS: { title: string; description: string }[] = [
  {
    title: 'Odolnosť voči teplu',
    description: 'Znáša teploty nad 300 °C. Horúci hrniec môžete položiť priamo na povrch bez poškodenia.',
  },
  {
    title: 'Nulová nasiakavosť',
    description: 'Nasiakavosť pod 0,1 % — odolný voči vlhkosti, plesniam a baktériám. Ideálny do kuchyne aj kúpeľne.',
  },
  {
    title: 'Odolnosť voči škvrnám',
    description: 'Víno, káva, citrónovú šťavu — jednoducho utriete. Nepórovitý povrch nenasiakne žiadne tekutiny.',
  },
  {
    title: 'UV stabilita',
    description: 'Farba sa nemení ani pri celoročnom vystavení slnku. Certifikované podľa DIN 51094.',
  },
  {
    title: 'Bez údržby',
    description: 'Nepotrebuje impregnáciu ani špeciálne ošetrenie. Stačí vlhká utierka a bežný saponát.',
  },
  {
    title: 'Neviditeľná varná doska',
    description: 'Indukčný modul sa zabuduje priamo pod dosku. Žiadne viditeľné varné zóny — čistý, súvislý povrch.',
  },
];

/** „Kedy zvoliť ktorý materiál" — verdict guidance under the comparison table. */
export const VYHODY_VERDICTS: { material: string; verdict: string }[] = [
  {
    material: 'Sinterovaný kameň',
    verdict:
      'Pre kuchyne s intenzívnym varením, ostrovčeky s neviditeľnou varnou doskou, exteriér a všade, kde chcete povrch bez impregnácie a bez starostí o škvrny.',
  },
  {
    material: 'Žula',
    verdict:
      'Prírodný vzhľad za rozumnú cenu — ak akceptujete pravidelnú impregnáciu každé 2–3 roky a nižšiu odolnosť voči škvrnám a kyselinám.',
  },
  {
    material: 'Quartz (kremenný kompozit)',
    verdict:
      'Vhodný do interiéru s bežným používaním. Pozor na teplo (~150 °C) a UV nestabilitu — nehodí sa k veľkým oknám ani do exteriéru.',
  },
  {
    material: 'Mramor',
    verdict:
      'Estetická voľba pre menej namáhané plochy — kúpeľne a obklady. V kuchyni vyžaduje disciplínu, pH-neutrálne čistenie a pravidelnú starostlivosť.',
  },
];

/** Related deep-dive articles + price list (rendered as links on page + in prerender). */
export const VYHODY_RELATED_LINKS: { label: string; href: string }[] = [
  { label: 'Sinterovaný kameň vs kvarcit vs keramika vs porcelán', href: '/blog/sinterovany-kamen-vs-kvarcit-vs-keramika-vs-porcelan' },
  { label: 'Oplatí sa sinterovaný kameň? Cena vs životnosť', href: '/blog/oplati-sa-sinterovany-kamen' },
  { label: 'Technický kameň: cena a výber materiálu', href: '/blog/technicky-kamen-cena-pracovna-doska' },
  { label: 'Umelý kameň na pracovnú dosku', href: '/blog/umely-kamen-pracovna-doska' },
  { label: 'Kompletný cenník', href: '/cennik' },
];
