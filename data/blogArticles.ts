// Central registry of all blog articles
import type { BlogArticle, BlogCategory } from './blogTypes';
import { BLOG_AUTHOR_OROSTONE } from './blogTypes';

// Completed articles
import { ARTICLE_01 } from './articles/article-01-problems';
import { ARTICLE_06 } from './articles/article-06-comparison';
import { ARTICLE_10 } from './articles/article-10-matte-vs-polished';
import { ARTICLE_13 } from './articles/article-13-process';
import { ARTICLE_16 } from './articles/article-16-worth-it';

// ---------------------------------------------------------------------------
// Stub articles (content coming soon)
// ---------------------------------------------------------------------------

const ARTICLE_02: BlogArticle = {
  id: 'hot-pans-sintered-stone',
  slug: 'horuce-hrnce-na-sinterovanom-kameni',
  category: 'risk-killers',
  publishDate: '2026-03-03',
  readTimeMinutes: 8,
  heroImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'tepelná odolnosť', 'horúce hrnce', 'kuchyňa'],
  sk: {
    title: 'Môžete položiť horúci hrniec na sinterovaný kameň?',
    subtitle: 'Test tepelnej odolnosti sinterovaného kameňa v praxi',
    excerpt: 'Zisti, či sinterovaný kameň skutočne vydrží horúce hrnce priamo z platne — a za akých podmienok.',
    directAnswer: 'Sinterovaný kameň odolá teplotám do 1 200 °C a horúce hrnce na neho môžeš pokojne položiť. Na rozdiel od kremeňa či laminátu nehrozí poškodenie ani zmena farby.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Vydrží sinterovaný kameň horúci hrniec?', answer: 'Článok sa pripravuje...' },
      { question: 'Je potrebná podložka pod horúce nádoby?', answer: 'Článok sa pripravuje...' },
      { question: 'Aká je maximálna teplota pre sinterovaný kameň?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'Can You Put Hot Pans on Sintered Stone?',
    subtitle: 'Real-world heat resistance test of sintered stone',
    excerpt: 'Find out if sintered stone truly handles hot pans straight from the stove — and under what conditions.',
    directAnswer: 'Sintered stone withstands temperatures up to 1,200 °C and hot pans can safely be placed directly on it. Unlike quartz or laminate, there is no risk of damage or discoloration.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'Can sintered stone handle hot pans?', answer: 'Article coming soon...' },
      { question: 'Do I need a trivet on sintered stone?', answer: 'Article coming soon...' },
      { question: 'What is the maximum temperature for sintered stone?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_03: BlogArticle = {
  id: 'sintered-stone-stain-test',
  slug: 'skvrny-na-sinterovanom-kameni',
  category: 'risk-killers',
  publishDate: '2026-03-10',
  readTimeMinutes: 9,
  heroImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'škvrny', 'káva', 'víno', 'kurkuma', 'test'],
  sk: {
    title: 'Zafarbí sa sinterovaný kameň? Test s kávou, vínom a kurkumou',
    subtitle: 'Reálny test odolnosti sinterovaného kameňa voči najčastejším škvrnotvorným látkam',
    excerpt: 'Testovali sme sinterovaný kameň s kávou, vínom a kurkumou. Výsledky ťa možno prekvapia.',
    directAnswer: 'Sinterovaný kameň má takmer nulovú pórovitosť (pod 0,1 %), čo znamená, že káva, víno ani kurkuma do povrchu neprenikajú. Škvrny stačí zotrieť vlhkou handrou.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Zanecháva káva škvrny na sinterovanom kameni?', answer: 'Článok sa pripravuje...' },
      { question: 'Je potrebné impregnačné ošetrenie?', answer: 'Článok sa pripravuje...' },
      { question: 'Čo ak škvrna zaschne?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'Does Sintered Stone Stain? Coffee/Wine/Turmeric Test',
    subtitle: 'Real stain resistance test against the most common culprits',
    excerpt: 'We tested sintered stone with coffee, wine, and turmeric. The results may surprise you.',
    directAnswer: 'Sintered stone has near-zero porosity (under 0.1%), meaning coffee, wine, and turmeric cannot penetrate the surface. Stains wipe off with a damp cloth.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'Does coffee stain sintered stone?', answer: 'Article coming soon...' },
      { question: 'Does sintered stone need sealing?', answer: 'Article coming soon...' },
      { question: 'What if a stain dries on sintered stone?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_04: BlogArticle = {
  id: '12mm-vs-20mm-thickness',
  slug: '12mm-vs-20mm-hrubka',
  category: 'risk-killers',
  publishDate: '2026-03-17',
  readTimeMinutes: 10,
  heroImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'hrúbka', '12mm', '20mm', 'kuchyňa'],
  sk: {
    title: '12 mm vs 20 mm: aká hrúbka je správna pre tvoju kuchyňu?',
    subtitle: 'Porovnanie hrúbok sinterovaného kameňa — kedy zvoliť tenkú a kedy hrubú dosku',
    excerpt: 'Hrúbka dosky ovplyvňuje odolnosť, cenu aj estetiku. Porovnaj si, čo je pre teba najlepšie.',
    directAnswer: '20 mm dosky sú odolnejšie a lepšie pre kuchynské pracovné dosky s výrezmi. 12 mm dosky sú vhodné pre obklady, steny a aplikácie bez výrezov. Pre kuchynské linky odporúčame 20 mm.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Stačí 12 mm doska na kuchynskú linku?', answer: 'Článok sa pripravuje...' },
      { question: 'Je 20 mm doska výrazne drahšia?', answer: 'Článok sa pripravuje...' },
      { question: 'Aká hrúbka je najlepšia pre ostrovček?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: '12mm vs 20mm: Which Thickness Is Right?',
    subtitle: 'Comparing sintered stone thicknesses — when to choose thin vs thick slabs',
    excerpt: 'Slab thickness affects durability, price, and aesthetics. Compare which is best for you.',
    directAnswer: '20mm slabs are more durable and better suited for kitchen countertops with cutouts. 12mm slabs work well for cladding, walls, and applications without cutouts. We recommend 20mm for kitchen worktops.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'Is a 12mm slab enough for a kitchen countertop?', answer: 'Article coming soon...' },
      { question: 'Is a 20mm slab significantly more expensive?', answer: 'Article coming soon...' },
      { question: 'What thickness is best for an island?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_05: BlogArticle = {
  id: 'edges-chipping-profiles',
  slug: 'hrany-a-profily-chipovanie',
  category: 'risk-killers',
  publishDate: '2026-03-24',
  readTimeMinutes: 8,
  heroImage: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'hrany', 'profily', 'chipovanie', 'odolnosť'],
  sk: {
    title: 'Hrany: prečo väčšina odštiepení vzniká na profiloch',
    subtitle: 'Aký profil hrany zvoliť, aby si predišiel chipovaniu sinterovaného kameňa',
    excerpt: 'Správny profil hrany je kľúčový pre dlhú životnosť dosky. Zisti, ktorý je najbezpečnejší.',
    directAnswer: 'Väčšina odštiepení na sinterovanom kameni vzniká na ostrých 90° hranách. Zaoblené profily (half-bullnose, bevel) znižujú riziko chipovania až 3×. Pre kuchynské dosky vždy odporúčame minimálne 2 mm chamfer.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Aký profil hrany je najodolnejší?', answer: 'Článok sa pripravuje...' },
      { question: 'Prečo sa ostrá hrana odštepuje?', answer: 'Článok sa pripravuje...' },
      { question: 'Dá sa profil hrany zmeniť dodatočne?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'Edges: Why Most Chips Happen on Profiles',
    subtitle: 'Which edge profile to choose to prevent sintered stone chipping',
    excerpt: 'The right edge profile is key to long-lasting slabs. Find out which is safest.',
    directAnswer: 'Most chips on sintered stone occur on sharp 90° edges. Rounded profiles (half-bullnose, bevel) reduce chipping risk by up to 3×. For kitchen countertops, we always recommend at least a 2mm chamfer.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'Which edge profile is most durable?', answer: 'Article coming soon...' },
      { question: 'Why do sharp edges chip?', answer: 'Article coming soon...' },
      { question: 'Can the edge profile be changed later?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_07: BlogArticle = {
  id: 'certifications-sintered-stone',
  slug: 'certifikacie-sinterovany-kamen',
  category: 'trust-builders',
  publishDate: '2026-04-07',
  readTimeMinutes: 7,
  heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'certifikácie', 'kvalita', 'normy'],
  sk: {
    title: 'Aké certifikácie majú zmysel (a ktoré sú marketing)',
    subtitle: 'Prehľad certifikácií sinterovaného kameňa — čo naozaj zaručuje kvalitu',
    excerpt: 'Nie každá certifikácia znamená kvalitu. Rozlíšte zmysluplné normy od marketingových nástrojov.',
    directAnswer: 'Zmysluplné certifikácie pre sinterovaný kameň zahŕňajú CE označenie, testy podľa ISO 10545 a certifikáty potravinovej bezpečnosti. Mnoho „certifikátov" na trhu sú len interné testy výrobcov bez nezávislého overenia.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Aké certifikácie by mal mať sinterovaný kameň?', answer: 'Článok sa pripravuje...' },
      { question: 'Čo znamená CE označenie?', answer: 'Článok sa pripravuje...' },
      { question: 'Ako overím pravosť certifikátu?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'What Certifications Matter (and Which Are Fluff)',
    subtitle: 'A guide to sintered stone certifications — what truly guarantees quality',
    excerpt: 'Not every certification means quality. Distinguish meaningful standards from marketing tools.',
    directAnswer: 'Meaningful certifications for sintered stone include CE marking, ISO 10545 tests, and food-safety certificates. Many "certifications" on the market are just internal manufacturer tests without independent verification.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'What certifications should sintered stone have?', answer: 'Article coming soon...' },
      { question: 'What does CE marking mean?', answer: 'Article coming soon...' },
      { question: 'How can I verify a certification is real?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_08: BlogArticle = {
  id: 'spot-low-quality-slabs',
  slug: 'rozpoznat-nekvalitne-dosky',
  category: 'trust-builders',
  publishDate: '2026-04-14',
  readTimeMinutes: 9,
  heroImage: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'kvalita', 'nákup', 'kontrola', 'dosky'],
  sk: {
    title: 'Ako rozpoznať nekvalitné dosky pred kúpou',
    subtitle: 'Na čo sa pozerať pri výbere sinterovaného kameňa — vizuálne aj technicky',
    excerpt: 'Nauč sa identifikovať nekvalitné dosky skôr, než za ne zaplatíš.',
    directAnswer: 'Nekvalitné dosky spoznáš podľa nerovnomernej hrúbky, viditeľných dutín, nestabilného povrchového dekóru a chýbajúcej dokumentácie. Vždy si vyžiadaj technický list a fyzickú vzorku.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Ako spoznám nekvalitný sinterovaný kameň?', answer: 'Článok sa pripravuje...' },
      { question: 'Čo by mal obsahovať technický list?', answer: 'Článok sa pripravuje...' },
      { question: 'Je nízka cena vždy varovným signálom?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'How to Spot Low-Quality Slabs Before You Buy',
    subtitle: 'What to look for when choosing sintered stone — visually and technically',
    excerpt: 'Learn to identify low-quality slabs before you pay for them.',
    directAnswer: 'Low-quality slabs can be identified by uneven thickness, visible voids, inconsistent surface décor, and missing documentation. Always request a technical data sheet and a physical sample.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'How do I spot low-quality sintered stone?', answer: 'Article coming soon...' },
      { question: 'What should a technical data sheet include?', answer: 'Article coming soon...' },
      { question: 'Is a low price always a warning sign?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_09: BlogArticle = {
  id: 'transparent-pricing-quote',
  slug: 'transparentne-ceny-cenova-ponuka',
  category: 'trust-builders',
  publishDate: '2026-04-21',
  readTimeMinutes: 7,
  heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'ceny', 'cenová ponuka', 'transparentnosť'],
  sk: {
    title: 'Transparentné ceny: čo musí obsahovať tvoja cenová ponuka',
    subtitle: 'Sprievodca cenovou ponukou na sinterovaný kameň — bez skrytých poplatkov',
    excerpt: 'Zisti, čo by mala obsahovať férová cenová ponuka a na čo si dať pozor.',
    directAnswer: 'Kvalitná cenová ponuka musí obsahovať cenu materiálu, fabrikáciu, dopravu, inštaláciu a DPH. Skryté náklady ako výrezy, profily hrán a waste factor by mali byť uvedené zvlášť.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Čo by mala obsahovať cenová ponuka?', answer: 'Článok sa pripravuje...' },
      { question: 'Aké skryté náklady hľadať?', answer: 'Článok sa pripravuje...' },
      { question: 'Prečo sa ceny medzi dodávateľmi líšia?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'Transparent Pricing: What Your Quote Must Include',
    subtitle: 'A guide to sintered stone quotes — no hidden fees',
    excerpt: 'Find out what a fair quote should include and what to watch out for.',
    directAnswer: 'A quality quote must include material cost, fabrication, delivery, installation, and VAT. Hidden costs like cutouts, edge profiles, and waste factor should be listed separately.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'What should a sintered stone quote include?', answer: 'Article coming soon...' },
      { question: 'What hidden costs should I look for?', answer: 'Article coming soon...' },
      { question: 'Why do prices vary between suppliers?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_11: BlogArticle = {
  id: 'seams-sintered-stone',
  slug: 'spoje-sinterovany-kamen',
  category: 'identity-aesthetics',
  publishDate: '2026-05-05',
  readTimeMinutes: 8,
  heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'spoje', 'švy', 'inštalácia', 'estetika'],
  sk: {
    title: 'Spoje: koľko ich budeš mať a ako ich urobiť neviditeľné',
    subtitle: 'Všetko o spojoch na sinterovanom kameni — od plánovania po dokonalé prevedenie',
    excerpt: 'Spoje sú nevyhnutné, ale nemusia byť viditeľné. Nauč sa, ako ich minimalizovať a skryť.',
    directAnswer: 'Počet spojov závisí od rozmerov kuchyne a veľkosti dosiek. Pri správnom plánovaní a kvalitnom lepení môžu byť spoje takmer neviditeľné. Kľúčom je presný rez, farebne zladené lepidlo a profesionálna montáž.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Koľko spojov bude na mojej kuchynskej doske?', answer: 'Článok sa pripravuje...' },
      { question: 'Dajú sa spoje úplne skryť?', answer: 'Článok sa pripravuje...' },
      { question: 'Aké lepidlo sa používa na spoje?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'Seams: How Many You\'ll Have and How to Make Them Invisible',
    subtitle: 'Everything about sintered stone seams — from planning to flawless execution',
    excerpt: 'Seams are inevitable, but they don\'t have to be visible. Learn how to minimize and conceal them.',
    directAnswer: 'The number of seams depends on kitchen dimensions and slab sizes. With proper planning and quality bonding, seams can be nearly invisible. The key is precise cutting, color-matched adhesive, and professional installation.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'How many seams will my countertop have?', answer: 'Article coming soon...' },
      { question: 'Can seams be completely hidden?', answer: 'Article coming soon...' },
      { question: 'What adhesive is used for seams?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_12: BlogArticle = {
  id: 'top-10-luxury-slab-styles',
  slug: 'top-10-luxusnych-stylov',
  category: 'identity-aesthetics',
  publishDate: '2026-05-12',
  readTimeMinutes: 10,
  heroImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'dizajn', 'luxus', 'štýly', 'interiér'],
  sk: {
    title: 'Top 10 štýlov dosiek, ktoré vyzerajú luxusne',
    subtitle: 'Najkrajšie dekóry sinterovaného kameňa pre moderné aj klasické interiéry',
    excerpt: 'Inšpiruj sa 10 najluxusnejšie vyzerajúcimi štýlmi dosiek, ktoré dodajú tvojmu priestoru prémiový vzhľad.',
    directAnswer: 'Medzi najluxusnejšie štýly patria mramorové imitácie (Calacatta, Statuario), tmavé kamenné dekóry, betónové povrchy a jednofarebné ultra-matné dosky. Sinterovaný kameň dokáže reprodukovať tieto vzory s väčšou odolnosťou ako originál.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Aký štýl dosky je teraz v trende?', answer: 'Článok sa pripravuje...' },
      { question: 'Vyzerajú imitácie mramoru realisticky?', answer: 'Článok sa pripravuje...' },
      { question: 'Aký dekór je najuniverzálnejší?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'Top 10 Slab Styles That Look Luxury',
    subtitle: 'The most beautiful sintered stone décors for modern and classic interiors',
    excerpt: 'Get inspired by 10 of the most luxurious-looking slab styles that give any space a premium feel.',
    directAnswer: 'The most luxurious styles include marble imitations (Calacatta, Statuario), dark stone décors, concrete surfaces, and solid ultra-matte slabs. Sintered stone can reproduce these patterns with greater durability than the originals.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'What slab style is currently trending?', answer: 'Article coming soon...' },
      { question: 'Do marble imitations look realistic?', answer: 'Article coming soon...' },
      { question: 'Which décor is the most versatile?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_14: BlogArticle = {
  id: 'kitchen-remodel-checklist',
  slug: 'checklist-rekonstrukcia-kuchyne',
  category: 'friction-removers',
  publishDate: '2026-05-26',
  readTimeMinutes: 11,
  heroImage: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'rekonštrukcia', 'kuchyňa', 'checklist', 'plánovanie'],
  sk: {
    title: 'Koordinačný checklist rekonštrukcie kuchyne',
    subtitle: 'Krok za krokom — od plánovania po hotovú kuchyňu so sinterovaným kameňom',
    excerpt: 'Kompletný checklist, ktorý ti pomôže zkoordinovať rekonštrukciu kuchyne bez stresu.',
    directAnswer: 'Rekonštrukcia kuchyne vyžaduje koordináciu minimálne 5 remesiel. Kľúčové je správne poradie: najprv inštalatér a elektrikár, potom kuchynská linka, a na záver zameranie a inštalácia kamennej dosky.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Kedy objednať kamennú dosku počas rekonštrukcie?', answer: 'Článok sa pripravuje...' },
      { question: 'Ako dlho trvá celá rekonštrukcia?', answer: 'Článok sa pripravuje...' },
      { question: 'Čo sa stane, ak sa niečo oneskorí?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'Kitchen Remodel Coordination Checklist',
    subtitle: 'Step by step — from planning to a finished kitchen with sintered stone',
    excerpt: 'A complete checklist to help you coordinate your kitchen remodel stress-free.',
    directAnswer: 'A kitchen remodel requires coordinating at least 5 trades. The key is correct sequencing: plumber and electrician first, then cabinetry, and finally stone countertop templating and installation.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'When should I order the stone countertop during a remodel?', answer: 'Article coming soon...' },
      { question: 'How long does a full kitchen remodel take?', answer: 'Article coming soon...' },
      { question: 'What happens if something is delayed?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_15: BlogArticle = {
  id: 'install-day-guide',
  slug: 'sprievodca-dnom-instalacie',
  category: 'friction-removers',
  publishDate: '2026-06-02',
  readTimeMinutes: 7,
  heroImage: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'inštalácia', 'montáž', 'sprievodca'],
  sk: {
    title: 'Sprievodca dňom inštalácie (aby nič nezlyhalo)',
    subtitle: 'Čo pripraviť, na čo sa opýtať a čo očakávať v deň montáže kamennej dosky',
    excerpt: 'Deň inštalácie nemusí byť stresujúci. Priprav sa s naším sprievodcom krok za krokom.',
    directAnswer: 'Pred inštaláciou zabezpečte prístup, vyprázdnite kuchyňu a overte finálne rozmery. Inštalácia trvá typicky 2–4 hodiny. Po montáži nechajte lepidlo vytvrdnúť minimálne 24 hodín.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Ako dlho trvá inštalácia kamennej dosky?', answer: 'Článok sa pripravuje...' },
      { question: 'Čo musím pripraviť pred inštaláciou?', answer: 'Článok sa pripravuje...' },
      { question: 'Kedy môžem kuchyňu začať používať?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'Install Day Survival Guide',
    subtitle: 'What to prepare, what to ask, and what to expect on stone countertop installation day',
    excerpt: 'Installation day doesn\'t have to be stressful. Get ready with our step-by-step guide.',
    directAnswer: 'Before installation, ensure access, clear the kitchen, and verify final measurements. Installation typically takes 2–4 hours. After mounting, let the adhesive cure for at least 24 hours.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'How long does stone countertop installation take?', answer: 'Article coming soon...' },
      { question: 'What do I need to prepare before installation?', answer: 'Article coming soon...' },
      { question: 'When can I start using the kitchen?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_17: BlogArticle = {
  id: 'quartz-vs-sintered-stone',
  slug: 'kvarcit-vs-sinterovany-kamen',
  category: 'value-comparisons',
  publishDate: '2026-06-16',
  readTimeMinutes: 10,
  heroImage: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'kvarcit', 'porovnanie', 'kuchyňa', 'materiál'],
  sk: {
    title: 'Kvarcit vs sinterovaný kameň: čo sedí tvojmu životnému štýlu?',
    subtitle: 'Objektívne porovnanie dvoch prémiových materiálov — odolnosť, cena, údržba a estetika',
    excerpt: 'Kvarcit aj sinterovaný kameň sú prémiové materiály. Zisti, ktorý lepšie vyhovuje tvojmu životnému štýlu.',
    directAnswer: 'Kvarcit (kremeňový kompozit) je cenovo dostupnejší a jednoduchší na opracovanie, ale neodolá UV žiareniu ani vysokým teplotám. Sinterovaný kameň je drahší, ale ponúka vyššiu odolnosť voči teplu, UV, škrabancom a chemikáliám.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Je sinterovaný kameň lepší ako kvarcit?', answer: 'Článok sa pripravuje...' },
      { question: 'Ktorý materiál je cenovo výhodnejší?', answer: 'Článok sa pripravuje...' },
      { question: 'Dá sa kvarcit použiť v exteriéri?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'Quartz vs Sintered Stone: Which Fits Your Lifestyle?',
    subtitle: 'An objective comparison of two premium materials — durability, price, maintenance, and aesthetics',
    excerpt: 'Quartz and sintered stone are both premium materials. Find out which better suits your lifestyle.',
    directAnswer: 'Quartz composite is more affordable and easier to fabricate but cannot withstand UV or high temperatures. Sintered stone is pricier but offers superior resistance to heat, UV, scratches, and chemicals.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'Is sintered stone better than quartz?', answer: 'Article coming soon...' },
      { question: 'Which material is more cost-effective?', answer: 'Article coming soon...' },
      { question: 'Can quartz be used outdoors?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_18: BlogArticle = {
  id: 'cheap-alternatives-premium-slabs',
  slug: 'lacnejsie-alternativy-premiovych-dosiek',
  category: 'value-comparisons',
  publishDate: '2026-06-23',
  readTimeMinutes: 9,
  heroImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'alternatívy', 'cena', 'rozpočet', 'porovnanie'],
  sk: {
    title: 'Lacnejšie alternatívy k prémiovým doskám (úprimný sprievodca)',
    subtitle: 'Keď je rozpočet obmedzený — čo získaš a čo stratíš pri lacnejších materiáloch',
    excerpt: 'Nie každý rozpočet počíta s prémiovým kameňom. Pozri sa, aké sú reálne alternatívy a ich kompromisy.',
    directAnswer: 'Lacnejšie alternatívy zahŕňajú laminát (od 50 €/m²), kvarcit (od 150 €/m²) a žulu (od 120 €/m²). Každá má kompromisy v odolnosti, estetike alebo údržbe. Sinterovaný kameň vychádza dlhodobo najvýhodnejšie.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Aké sú najlacnejšie alternatívy ku kamennému povrchu?', answer: 'Článok sa pripravuje...' },
      { question: 'Oplatí sa investovať do drahšieho materiálu?', answer: 'Článok sa pripravuje...' },
      { question: 'Aká je životnosť lacných materiálov?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'Cheap Alternatives to Premium Slabs (Honest Guide)',
    subtitle: 'When budget is tight — what you gain and lose with cheaper materials',
    excerpt: 'Not every budget allows for premium stone. See the real alternatives and their trade-offs.',
    directAnswer: 'Cheaper alternatives include laminate (from €50/m²), quartz (from €150/m²), and granite (from €120/m²). Each has trade-offs in durability, aesthetics, or maintenance. Sintered stone offers the best long-term value.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'What are the cheapest alternatives to stone surfaces?', answer: 'Article coming soon...' },
      { question: 'Is it worth investing in a more expensive material?', answer: 'Article coming soon...' },
      { question: 'How long do cheap materials last?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_19: BlogArticle = {
  id: 'how-to-clean-sintered-stone',
  slug: 'ako-cistit-sinterovany-kamen',
  category: 'control-care',
  publishDate: '2026-07-07',
  readTimeMinutes: 6,
  heroImage: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'čistenie', 'údržba', 'starostlivosť'],
  sk: {
    title: 'Ako čistiť sinterovaný kameň (jediná rutina, ktorú potrebuješ)',
    subtitle: 'Jednoduchý návod na každodennú aj hĺbkovú údržbu sinterovaného kameňa',
    excerpt: 'Čistenie sinterovaného kameňa je jednoduchšie, než si myslíš. Stačí dodržiavať jednu rutinu.',
    directAnswer: 'Na denné čistenie stačí vlhká handrička s neutrálnym saponátom. Sinterovaný kameň nepotrebuje impregnáciu ani špeciálne prípravky. Na odolné škvrny použi izopropylalkohol.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Aký čistiaci prostriedok použiť?', answer: 'Článok sa pripravuje...' },
      { question: 'Potrebuje sinterovaný kameň impregnáciu?', answer: 'Článok sa pripravuje...' },
      { question: 'Ako odstrániť zaschnuté škvrny?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'How to Clean Sintered Stone (The Only Routine You Need)',
    subtitle: 'A simple guide to daily and deep cleaning of sintered stone',
    excerpt: 'Cleaning sintered stone is easier than you think. Just follow one routine.',
    directAnswer: 'For daily cleaning, a damp cloth with neutral soap is all you need. Sintered stone requires no sealing or special products. For stubborn stains, use isopropyl alcohol.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'What cleaning product should I use?', answer: 'Article coming soon...' },
      { question: 'Does sintered stone need sealing?', answer: 'Article coming soon...' },
      { question: 'How do I remove dried stains?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_20: BlogArticle = {
  id: 'what-damages-sintered-stone',
  slug: 'co-poskodzuje-sinterovany-kamen',
  category: 'control-care',
  publishDate: '2026-07-14',
  readTimeMinutes: 8,
  heroImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'poškodenie', 'prevencia', 'údržba'],
  sk: {
    title: 'Čo poškodzuje sinterovaný kameň (a ako sa tomu vyhnúť)',
    subtitle: 'Najčastejšie príčiny poškodenia a overené spôsoby prevencie',
    excerpt: 'Sinterovaný kameň je odolný, ale nie nezničiteľný. Zisti, čomu sa vyhnúť.',
    directAnswer: 'Hlavné príčiny poškodenia sú silný bodový náraz (spadnutá fľaša), nesprávna inštalácia a zlá manipulácia pri preprave. Bežné kuchynské používanie sinterovaný kameň nepoškodí.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Môže sa sinterovaný kameň rozbiť?', answer: 'Článok sa pripravuje...' },
      { question: 'Čo sa stane, keď naň spadne ťažký predmet?', answer: 'Článok sa pripravuje...' },
      { question: 'Dá sa poškodenie opraviť?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'What Damages Sintered Stone (And How to Avoid It)',
    subtitle: 'The most common causes of damage and proven prevention methods',
    excerpt: 'Sintered stone is durable but not indestructible. Find out what to avoid.',
    directAnswer: 'The main causes of damage are strong point impact (dropped bottle), improper installation, and poor handling during transport. Normal kitchen use will not damage sintered stone.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'Can sintered stone break?', answer: 'Article coming soon...' },
      { question: 'What happens if a heavy object is dropped on it?', answer: 'Article coming soon...' },
      { question: 'Can damage be repaired?', answer: 'Article coming soon...' },
    ],
  },
};

const ARTICLE_21: BlogArticle = {
  id: 'warranty-explained-simply',
  slug: 'zaruka-vysvetlena-jednoducho',
  category: 'control-care',
  publishDate: '2026-07-21',
  readTimeMinutes: 6,
  heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['sinterovaný kameň', 'záruka', 'reklamácia', 'podmienky'],
  sk: {
    title: 'Záruka vysvetlená jednoducho: čo je kryté a čo nie',
    subtitle: 'Zrozumiteľný prehľad záručných podmienok pre sinterovaný kameň',
    excerpt: 'Záručné podmienky bývajú komplikované. Vysvetľujeme jednoducho, čo je kryté a čo nie.',
    directAnswer: 'Záruka na sinterovaný kameň typicky kryje výrobné chyby, problémy s dekórom a štrukturálne vady. Nekryje mechanické poškodenie, nesprávnu inštaláciu tretími stranami a bežné opotrebovanie.',
    content: '<p>Článok sa pripravuje...</p>',
    faqs: [
      { question: 'Čo kryje záruka na sinterovaný kameň?', answer: 'Článok sa pripravuje...' },
      { question: 'Ako dlho trvá záruka?', answer: 'Článok sa pripravuje...' },
      { question: 'Ako reklamovať poškodenie?', answer: 'Článok sa pripravuje...' },
    ],
  },
  en: {
    title: 'Warranty Explained Simply: What\'s Covered and What\'s Not',
    subtitle: 'A clear overview of warranty terms for sintered stone',
    excerpt: 'Warranty terms can be confusing. We explain simply what\'s covered and what\'s not.',
    directAnswer: 'Sintered stone warranty typically covers manufacturing defects, décor issues, and structural flaws. It does not cover mechanical damage, improper installation by third parties, or normal wear and tear.',
    content: '<p>Article coming soon...</p>',
    faqs: [
      { question: 'What does a sintered stone warranty cover?', answer: 'Article coming soon...' },
      { question: 'How long does the warranty last?', answer: 'Article coming soon...' },
      { question: 'How do I file a warranty claim?', answer: 'Article coming soon...' },
    ],
  },
};

// ---------------------------------------------------------------------------
// All stub articles collected
// ---------------------------------------------------------------------------
const STUB_ARTICLES: BlogArticle[] = [
  ARTICLE_02,
  ARTICLE_03,
  ARTICLE_04,
  ARTICLE_05,
  ARTICLE_07,
  ARTICLE_08,
  ARTICLE_09,
  ARTICLE_11,
  ARTICLE_12,
  ARTICLE_14,
  ARTICLE_15,
  ARTICLE_17,
  ARTICLE_18,
  ARTICLE_19,
  ARTICLE_20,
  ARTICLE_21,
];

// ---------------------------------------------------------------------------
// Exported article list (sorted by publishDate, newest first)
// ---------------------------------------------------------------------------
const ALL_ARTICLES: BlogArticle[] = [
  ARTICLE_01,
  ARTICLE_06,
  ARTICLE_10,
  ARTICLE_13,
  ARTICLE_16,
  ...STUB_ARTICLES,
].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

/** Only show articles that are published (publishDate <= today) and have real content */
export const BLOG_ARTICLES: BlogArticle[] = ALL_ARTICLES.filter(
  (a) => new Date(a.publishDate) <= new Date() && a.sk.content.trim().length > 100
);

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------
export const getArticleBySlug = (slug: string): BlogArticle | undefined =>
  BLOG_ARTICLES.find(a => a.slug === slug);

export const getArticlesByCategory = (category: BlogCategory): BlogArticle[] =>
  BLOG_ARTICLES.filter(a => a.category === category);

export const getLatestArticles = (count: number): BlogArticle[] =>
  BLOG_ARTICLES.slice(0, count);

export const getRelatedArticles = (article: BlogArticle, count: number): BlogArticle[] =>
  BLOG_ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, count);
