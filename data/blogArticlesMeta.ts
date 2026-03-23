// Lightweight blog article metadata — no content, directAnswer, or faqs.
// Used on homepage (BlogPreviewSection) to avoid bundling full article HTML
// into the main EshopApp chunk.
import type { BlogArticleMeta } from './blogTypes';
import { BLOG_AUTHOR_OROSTONE } from './blogTypes';

const ARTICLES_META: BlogArticleMeta[] = [
  {
    id: 'sintered-stone-problems',
    slug: 'problemy-so-sinterovanym-kamenom',
    category: 'risk-killers',
    publishDate: '2026-02-10',
    lastModified: '2026-02-13',
    readTimeMinutes: 12,
    heroImage: '/images/blog/sintered-stone-problems.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['sinterovaný kameň', 'problémy', 'prevencia', 'inštalácia', 'chipovanie'],
    sk: {
      title: 'Problémy so sinterovaným kameňom, o ktorých ti nikto nepovie (a ako im predchádzame)',
      subtitle: 'Úprimný sprievodca rizikami sinterovaného kameňa — od chipovania po praskanie pri výrezoch',
      excerpt: 'Sinterovaný kameň je vynikajúci materiál, ale nie je nezničiteľný. Pozri sa na reálne problémy, konkrétne čísla a overené riešenia, ktoré v Orostone denne používame.',
    },
    en: {
      title: 'Sintered Stone Problems Nobody Tells You About (And How We Prevent Them)',
      subtitle: 'An honest guide to sintered stone risks — from chipping to cracking around cutouts',
      excerpt: 'Sintered stone is an excellent material, but it\'s not indestructible. See real problems, concrete numbers, and proven solutions we use at Orostone every day.',
    },
  },
  {
    id: 'sintered-vs-quartz-vs-ceramic-vs-porcelain',
    slug: 'sinterovany-kamen-vs-kvarcit-vs-keramika-vs-porcelan',
    category: 'trust-builders',
    publishDate: '2026-02-08',
    lastModified: '2026-03-23',
    readTimeMinutes: 15,
    heroImage: '/images/blog/material-comparison.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['porovnanie', 'sinterovaný kameň', 'kvarcit', 'keramika', 'porcelán', 'výber materiálu'],
    sk: {
      title: 'Sinterovaný kameň vs kvarcit vs keramika vs porcelán: v čom je skutočný rozdiel?',
      subtitle: 'Technické porovnanie materiálov pre prémiové kuchynské dosky — bez marketingových klišé',
      excerpt: 'Komplexné porovnanie sinterovaného kameňa, kvarcitu, porcelánových dosiek a keramiky. Reálne čísla, certifikácie, cenové rozpätia a rozhodovací strom pre tvoj projekt.',
    },
    en: {
      title: 'Sintered Stone vs Quartz vs Ceramic vs Porcelain: What\'s Actually Different?',
      subtitle: 'Technical comparison of premium kitchen countertop materials — no marketing fluff',
      excerpt: 'A comprehensive comparison of sintered stone, engineered quartz, porcelain slabs, and ceramic. Real numbers, certifications, pricing ranges, and a decision tree for your project.',
    },
  },
  {
    id: 'matte-vs-polished',
    slug: 'matny-vs-leskly-povrch',
    category: 'identity-aesthetics',
    publishDate: '2026-02-06',
    lastModified: '2026-02-13',
    readTimeMinutes: 10,
    heroImage: '/images/blog/matte-vs-polished.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['matný povrch', 'lesklý povrch', 'dizajn kuchyne', 'estetika', 'luxus'],
    sk: {
      title: 'Matný vs lesklý povrch: čo vyzerá luxusnejšie v reálnych kuchyniach?',
      subtitle: 'Praktický sprievodca povrchmi sinterovaného kameňa — od odtlačkov prstov po fotogenickosť',
      excerpt: 'Objektívne porovnanie matného a lesklého povrchu sinterovaného kameňa. Odtlačky prstov, mikro-škrabance, fotogenickosť, praktickosť a odporúčanie pre luxusné bratislavské kuchyne.',
    },
    en: {
      title: 'Matte vs Polished Surface: Which Looks More Luxurious in Real Kitchens?',
      subtitle: 'A practical guide to sintered stone finishes — from fingerprints to photogenicity',
      excerpt: 'Objective comparison of matte and polished sintered stone surfaces. Fingerprints, micro-scratches, photogenicity, practicality and recommendation for luxury Bratislava kitchens.',
    },
  },
  {
    id: 'orostone-process-10-steps',
    slug: 'od-merania-po-instalaciu-proces-orostone',
    category: 'friction-removers',
    publishDate: '2026-02-04',
    lastModified: '2026-02-13',
    readTimeMinutes: 11,
    heroImage: '/images/blog/installation-process.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['inštalácia', 'proces', 'meranie', 'fabrikácia', 'montáž'],
    sk: {
      title: 'Od merania po inštaláciu: proces Orostone v 10 krokoch',
      subtitle: 'Kompletný sprievodca celým procesom — od prvej konzultácie po odovzdanie hotovej kuchyne',
      excerpt: 'Presne budeš vedieť, čo sa deje v každej fáze. 10 krokov, konkrétne termíny, jasné zodpovednosti. Celý proces od konzultácie po hotovú kuchyňu trvá 10–15 pracovných dní.',
    },
    en: {
      title: 'From Measurement to Installation: The Orostone Process in 10 Steps',
      subtitle: 'Complete guide to the entire process — from first consultation to finished kitchen handover',
      excerpt: 'You\'ll know exactly what happens at every stage. 10 steps, specific timelines, clear responsibilities. The full process from consultation to finished kitchen takes 10–15 working days.',
    },
  },
  {
    id: 'is-sintered-stone-worth-it',
    slug: 'oplati-sa-sinterovany-kamen',
    category: 'value-comparisons',
    publishDate: '2026-02-02',
    lastModified: '2026-02-13',
    readTimeMinutes: 13,
    heroImage: '/images/blog/sintered-stone-worth-it.webp',
    author: BLOG_AUTHOR_OROSTONE,
    tags: ['cena', 'hodnota', 'životnosť', 'údržba', 'investícia', 'porovnanie'],
    sk: {
      title: 'Oplatí sa sinterovaný kameň? Cena vs životnosť vs údržba',
      subtitle: 'Reálna matematika — nie marketingové sľuby. Tri scenáre, konkrétne čísla v eurách a brutálne úprimná odpoveď.',
      excerpt: 'Kompletný finančný rozbor sinterovaného kameňa vs kvarcitu, žuly a laminátu. Tri reálne scenáre (rodinný dom, byt v Bratislave, Airbnb), 25-ročné náklady vlastníctva a úprimná odpoveď, kedy sa investícia oplatí — a kedy nie.',
    },
    en: {
      title: 'Is Sintered Stone Worth It? Price vs Lifespan vs Maintenance',
      subtitle: 'Real math — not marketing promises. Three scenarios, concrete euro figures and a brutally honest answer.',
      excerpt: 'Complete financial breakdown of sintered stone vs quartz, granite and laminate. Three real scenarios (family home, Bratislava flat, Airbnb), 25-year cost of ownership and an honest answer on when the investment pays off — and when it doesn\'t.',
    },
  },
];

export const getLatestArticlesMeta = (count: number): BlogArticleMeta[] =>
  ARTICLES_META.slice(0, count);
