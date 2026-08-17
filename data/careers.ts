/**
 * Otvorené pozície — jediný zdroj pravdy.
 *
 * Používa sa na dvoch miestach:
 *  - `pages/Kariera.tsx`      → React stránka /kariera
 *  - `scripts/prerender.ts`   → statické HTML + JobPosting JSON-LD pre crawlerov
 *
 * Keď pribudne / zanikne pozícia, mení sa iba tento súbor.
 */

export interface JobSalary {
  /** Základná zložka mzdy — spodná hranica. */
  min: number;
  /** Horná hranica (voliteľná). */
  max?: number;
  unit: 'MONTH' | 'HOUR';
  currency: 'EUR';
  /** Doplňujúca veta, napr. „+ výkonnostná zložka podľa uzavretých zákaziek". */
  note?: string;
}

export interface JobOpening {
  /** Slug — anchor na stránke (`/kariera#kamenar`) aj identifikátor v JSON-LD. */
  id: string;
  title: string;
  /** Krátky popis do zoznamu a meta description. */
  summary: string;
  location: string;
  /** Adresa pre JobPosting JSON-LD. */
  jobLocation: { locality: string; region: string; country: 'SK' };
  /** Ľudský popis úväzku zobrazený na stránke. */
  employmentType: string;
  /** schema.org hodnoty: FULL_TIME | PART_TIME | CONTRACTOR | TEMPORARY | INTERN | OTHER */
  schemaEmploymentType: string[];
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  /**
   * ⚠️ DOPLNIŤ PRED ZVEREJNENÍM PRACOVNEJ PONUKY NA TPP.
   *
   * Slovenská legislatíva (§ 62 ods. 2 zákona č. 5/2004 Z. z. o službách
   * zamestnanosti) vyžaduje, aby ponuka zamestnania v pracovnom pomere
   * uvádzala sumu základnej zložky mzdy. Pri spolupráci na živnosť
   * / subdodávku sa povinnosť neuplatňuje — tam môže zostať `null`.
   *
   * Kým je hodnota `null`, riadok so mzdou sa na stránke nezobrazí
   * a do JSON-LD sa `baseSalary` nezapíše.
   */
  salary: JobSalary | null;
}

/** Adresa, na ktorú chodia životopisy. */
export const CAREERS_EMAIL = 'info@orostone.sk';

/** Dátum zverejnenia ponúk (ISO). Aktualizovať pri väčšej revízii. */
export const JOB_POSTED_DATE = '2026-08-17';

/**
 * Platnosť ponuky (ISO). Google po tomto dátume prestane ponuku zobrazovať
 * vo výsledkoch pre pracovné pozície — posunúť, kým je pozícia otvorená.
 */
export const JOB_VALID_THROUGH = '2027-02-28';

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: 'ppc-specialista',
    title: 'PPC špecialista — Google Ads a Meta Ads',
    summary:
      'Vediete výkonnostné kampane, ktoré privádzajú dopyty na pracovné dosky zo sinterovaného kameňa. Rozhodujete podľa dát, nie podľa dojmu.',
    location: 'Na diaľku, s pravidelnými online stretnutiami',
    jobLocation: { locality: 'Bratislava', region: 'Bratislavský kraj', country: 'SK' },
    employmentType: 'Plný alebo čiastočný úväzok · TPP alebo živnosť',
    schemaEmploymentType: ['FULL_TIME', 'PART_TIME', 'CONTRACTOR'],
    responsibilities: [
      'Vediete kampane v Google Ads (Search, Performance Max, Shopping) a v Meta Ads.',
      'Staviate a testujete štruktúru kampaní, publík a kreatív — od hypotézy až po vyhodnotenie.',
      'Sledujete cestu od kliknutia po uzavretú zákazku, nie len po odoslaný formulár.',
      'Pracujete s GA4, Google Tag Managerom a konverzným meraním vrátane server-side a Meta CAPI.',
      'Navrhujete zmeny na vstupných stránkach podľa toho, kde ľudia odpadávajú.',
      'Reportujete v číslach, ktoré niečo znamenajú pre obchod: cena za dopyt, kvalita dopytu, podiel uzavretých zákaziek.',
    ],
    requirements: [
      'Aspoň dva roky správy kampaní s vlastnou zodpovednosťou za rozpočet.',
      'Google Ads a Meta Ads Manager ovládate na úrovni denného používania, nie teórie.',
      'GA4 a meraniu konverzií rozumiete natoľko, aby ste vedeli povedať, kedy sú dáta nespoľahlivé.',
      'Viete si sám určiť prioritu a doviesť test do konca.',
      'Slovenčina alebo čeština na úrovni, na ktorej sa dá písať reklamný text.',
    ],
    niceToHave: [
      'Skúsenosť s produktom, o ktorom sa zákazník rozhoduje týždne — interiér, stavba, nábytok, reality.',
      'Napojenie reklamy na CRM a prácu s obchodnými dátami.',
      'Reporting v Looker Studio alebo obdobnom nástroji.',
    ],
    salary: null,
  },
  {
    id: 'kamenar',
    title: 'Kamenár — výroba pracovných dosiek zo sinterovaného kameňa',
    summary:
      'Zo sinterovaných platní vyrábate pracovné dosky, ostrovčeky a zásteny — od zamerania po hranu a montáž. Materiál je tvrdší a krehkejší než žula, preto rozhoduje príprava.',
    location: 'Bošany, okres Partizánske',
    jobLocation: { locality: 'Bošany', region: 'Trenčiansky kraj', country: 'SK' },
    employmentType: 'Plný úväzok · TPP alebo živnosť',
    schemaEmploymentType: ['FULL_TIME', 'CONTRACTOR'],
    responsibilities: [
      'Zameriavate priestor u zákazníka a pripravujete podklady pre výrobu — šablóny alebo digitálne zameranie.',
      'Režete, vŕtate a formátujete veľkoformátové platne v rozmere až 3200 × 1600 mm.',
      'Opracúvate hrany — rovná hrana, zrazená hrana aj mitrovaný spoj pri pohľadových hranách.',
      'Robíte výrezy pre drezy, batérie a varné dosky vrátane podlepenia a vystuženia rohov.',
      'Lepíte a spájate diely tak, aby bol spoj v pohľade čo najmenej čitateľný.',
      'Montujete u zákazníka a odovzdávate prácu v stave, ktorý sa dá odfotiť do referencií.',
    ],
    requirements: [
      'Minimálne dva roky praxe s kameňom, kompozitom alebo veľkoformátovou keramikou.',
      'Čítate výkresy a viete si prácu rozvrhnúť sám.',
      'S uhlovou brúskou, leštičkou a ručným náradím na kameň pracujete presne — nie nasilu.',
      'Zodpovednosť za materiál. Jedna platňa má hodnotu, ktorú sa neoplatí riskovať.',
      'Vodičský preukaz skupiny B.',
    ],
    niceToHave: [
      'Prax priamo so sinterovaným kameňom alebo veľkoformátovou keramikou.',
      'Skúsenosť s mitrovanými spojmi a podlepovaním.',
      'Osvedčenie na prácu vo výškach alebo na obsluhu manipulačnej techniky.',
    ],
    salary: null,
  },
  {
    id: 'cnc-specialista',
    title: 'CNC špecialista — vodný lúč a CNC píla',
    summary:
      'Obsluhujete a programujete vodný lúč a mostovú pílu na veľkoformátové platne. Vaša práca rozhoduje o tom, koľko materiálu skončí v odpade a či diel sadne na prvýkrát.',
    location: 'Bošany, okres Partizánske',
    jobLocation: { locality: 'Bošany', region: 'Trenčiansky kraj', country: 'SK' },
    employmentType: 'Plný úväzok · TPP',
    schemaEmploymentType: ['FULL_TIME'],
    responsibilities: [
      'Obsluhujete rezanie vodným lúčom a mostovú CNC pílu pre platne do rozmeru 3200 × 1600 mm.',
      'Pripravujete a upravujete rezné programy — rozloženie dielov, poradie rezov, nájazdy a prierezy.',
      'Nastavujete rezné parametre podľa hrúbky a typu platne (6, 12 a 20 mm) tak, aby hrana nevyštipovala.',
      'Zakladáte a upínate platne, kontrolujete rovinnosť podložia a bezpečnosť manipulácie.',
      'Priebežne kontrolujete rozmery a kvalitu hrany a zaznamenávate odchýlky.',
      'Vediete bežnú údržbu strojov — abrazívo, rezná hlava, tesnenia, chladenie, výmena kotúčov.',
      'Rozkladáte diely na platni tak, aby ste z nej dostali maximum.',
    ],
    requirements: [
      'Minimálne dva roky praxe na CNC stroji — kameň, sklo, keramika alebo kovoobrábanie.',
      'Skúsenosť s vodným lúčom alebo mostovou pílou. Viete rozlíšiť, kedy je ktorá technológia vhodnejšia.',
      'Čítate technickú dokumentáciu a v CAD/CAM prostredí si viete program aspoň upraviť.',
      'Presnosť v desatinách milimetra vás neotravuje.',
      'Dôsledný prístup k BOZP. Vodný lúč a veľké formáty neodpúšťajú improvizáciu.',
    ],
    niceToHave: [
      'Prax priamo so sinterovaným kameňom alebo veľkoformátovou keramikou.',
      'Práca v CAM softvéri pre vodný lúč — napríklad IGEMS, AlphaCAM alebo obdobnom.',
      'Základy mechanickej a hydraulickej údržby.',
    ],
    salary: null,
  },
  {
    id: 'obkladac',
    title: 'Obkladač — veľkoformátové platne',
    summary:
      'Kladiete veľkoformátové sinterované platne na steny, podlahy a do kúpeľní. Formát 3200 × 1600 mm sa nekladie ako 60 × 60 — rozhoduje príprava podkladu a nulová tolerancia na dutinu pod platňou.',
    location: 'Realizácie po celom Slovensku, ťažisko na západnom Slovensku',
    jobLocation: { locality: 'Bratislava', region: 'Bratislavský kraj', country: 'SK' },
    employmentType: 'Plný úväzok · TPP alebo živnosť',
    schemaEmploymentType: ['FULL_TIME', 'CONTRACTOR'],
    responsibilities: [
      'Kladiete veľkoformátové platne v interiéri aj exteriéri — steny, podlahy, kúpeľne, zásteny, obklady.',
      'Pripravujete a vyrovnávate podklad a posudzujete, či je na veľký formát pripravený.',
      'Pracujete s nivelačným systémom a prísavkovými rámami na manipuláciu s platňou.',
      'Robíte presné rezy a výrezy priamo na stavbe — zásuvky, prestupy, rohy — vrátane zrazenia hrany.',
      'Riešite dilatácie, spárorez a napojenia tak, aby výsledok vydržal a nesekal do oka.',
      'Odovzdávate hotovú prácu vrátane vyčistenia a kontroly detailov.',
    ],
    requirements: [
      'Minimálne tri roky praxe s obkladmi a dlažbami, z toho skúsenosť s formátmi nad 120 cm.',
      'Podklad si viete pripraviť sami — a poviete, keď nie je v poriadku, namiesto toho, aby ste kládli na horšie.',
      'Nivelačné spony, prísavky a rezanie na stavbe sú pre vás bežná práca.',
      'Samostatnosť a poriadok na stavbe. Zákazník býva doma.',
      'Vodičský preukaz skupiny B.',
    ],
    niceToHave: [
      'Prax so sinterovaným kameňom alebo veľkoformátovou keramikou.',
      'Skúsenosť s bezškárovým kladením a mitrovanými rohmi.',
      'Vlastné náradie, prípadne zohratý tím.',
    ],
    salary: null,
  },
];

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

const BASE_URL = 'https://orostone.sk';

function salaryLD(salary: JobSalary) {
  return {
    '@type': 'MonetaryAmount',
    currency: salary.currency,
    value: {
      '@type': 'QuantitativeValue',
      ...(salary.max !== undefined
        ? { minValue: salary.min, maxValue: salary.max }
        : { value: salary.min }),
      unitText: salary.unit,
    },
  };
}

/**
 * JobPosting structured data — podklad pre Google „pracovné pozície".
 * Popis skladáme z tých istých bodov, ktoré vidí človek na stránke.
 */
export function createJobPostingLD(job: JobOpening): Record<string, unknown> {
  const list = (heading: string, items: string[]) =>
    `<h3>${heading}</h3><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    '@id': `${BASE_URL}/kariera#${job.id}`,
    title: job.title,
    description:
      `<p>${job.summary}</p>` +
      list('Čo budete robiť', job.responsibilities) +
      list('Koho hľadáme', job.requirements) +
      list('Výhodou', job.niceToHave),
    datePosted: JOB_POSTED_DATE,
    validThrough: JOB_VALID_THROUGH,
    employmentType: job.schemaEmploymentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'OROSTONE s.r.o.',
      sameAs: BASE_URL,
      logo: `${BASE_URL}/images/brand/orostone-circle.png`,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.jobLocation.locality,
        addressRegion: job.jobLocation.region,
        addressCountry: job.jobLocation.country,
      },
    },
    ...(job.salary ? { baseSalary: salaryLD(job.salary) } : {}),
    applicantLocationRequirements: { '@type': 'Country', name: 'Slovensko' },
    directApply: false,
    url: `${BASE_URL}/kariera#${job.id}`,
  };
}
