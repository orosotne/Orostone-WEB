// Curated content of the homepage sections (new design, 2026-10).

export type DecorGroup = 'biele' | 'teple' | 'tmave';

export interface HomeDecor {
  /** Product id = URL slug of /produkt/:id */
  slug: string;
  name: string;
  /** Short tone label under the slab */
  label: string;
  group: DecorGroup;
}

/** All 12 decors in rack order. Grouping agreed with the owner (Givenchy Gold → biele, Wild Forest → teplé). */
export const HOME_DECORS: HomeDecor[] = [
  { slug: 'super-white-extra', name: 'Super White Extra', label: 'Čistá biela', group: 'biele' },
  { slug: 'yabo-white', name: 'Yabo White', label: 'Jemná biela', group: 'biele' },
  { slug: 'statuario-diamante', name: 'Statuario Diamante', label: 'Biely mramor', group: 'biele' },
  { slug: 'calacatta-top', name: 'Calacatta Top', label: 'Biely mramor', group: 'biele' },
  { slug: 'givenchy-gold', name: 'Givenchy Gold', label: 'Biely zlatý', group: 'biele' },
  { slug: 'appennino', name: 'Appennino', label: 'Jemný mramor', group: 'biele' },
  { slug: 'taj-mahal', name: 'Taj Mahal', label: 'Krémový mramor', group: 'teple' },
  { slug: 'roman-travertine', name: 'Roman Travertine', label: 'Teplý travertín', group: 'teple' },
  { slug: 'wild-forest', name: 'Wild Forest', label: 'Výrazný teplý', group: 'teple' },
  { slug: 'astrana-grey', name: 'Astrana Grey', label: 'Sivý kameň', group: 'tmave' },
  { slug: 'gothic-gold', name: 'Gothic Gold', label: 'Tmavý zlatý', group: 'tmave' },
  { slug: 'nero-margiua', name: 'Nero Margiua', label: 'Čierny mramor', group: 'tmave' },
];

export const DECOR_FILTERS: Array<{ id: 'all' | DecorGroup; label: string }> = [
  { id: 'all', label: 'Všetky' },
  { id: 'biele', label: 'Biele' },
  { id: 'teple', label: 'Teplé' },
  { id: 'tmave', label: 'Sivé a tmavé' },
];

export const decorImage = (slug: string) => `/images/home/dekory/${slug}.webp`;

export interface HomeRealization {
  image: string;
  width: number;
  height: number;
  /** object-position of the photo inside the rack slot */
  pos: string;
  decor: string;
  /** Decor slug for ?dekor= when it is one of today's decors */
  decorSlug?: string;
  text: string;
  alt: string;
}

/** Photos from clients' installations (Košice: client's consent confirmed 2026-10-05). Decor names are from the time of installation. */
export const HOME_REALIZATIONS: HomeRealization[] = [
  { image: 'taj-mahal-kosice', width: 1600, height: 1200, pos: '52% 55%', decor: 'Taj Mahal', decorSlug: 'taj-mahal', text: 'Ostrovček s jedálenským stolom, Košice', alt: 'Ostrovček so zástenou v dekore Taj Mahal a orechovým jedálenským stolom, Košice' },
  { image: 'arden-gold', width: 893, height: 904, pos: '50% 62%', decor: 'Arden Gold', text: 'Ostrovček a zástena', alt: 'Ostrovček a zástena v dekore Arden Gold so zlatými žilkami, dubová podlaha' },
  { image: 'sivy-kamen-kniznica', width: 1200, height: 900, pos: '56% 60%', decor: 'Yabo White', decorSlug: 'yabo-white', text: 'Ostrovček pri knižnici', alt: 'Ostrovček s doskou Yabo White pred knižnicou a bielou kuchynskou linkou' },
  { image: 'super-white-extra-dub', width: 1600, height: 893, pos: '44% 50%', decor: 'Super White Extra', decorSlug: 'super-white-extra', text: 'Kuchyňa v dube · upravená fotografia realizácie', alt: 'Kuchyňa v dube s pracovnou doskou a zástenou Super White Extra, čelný pohľad' },
  { image: 'polaris-statuario', width: 768, height: 1024, pos: '55% 56%', decor: 'Polaris Statuario White', text: 'Doska na orechovom ostrovčeku', alt: 'Biela kamenná doska so sivými žilkami na ostrovčeku z orechového dreva' },
  { image: 'calacatta-gold', width: 1014, height: 900, pos: '30% 62%', decor: 'Calacatta Gold', text: 'Ostrovček s bočnicou', alt: 'Ostrovček s kamennou bočnicou v dekore Calacatta Gold so zlatými žilkami' },
  { image: 'svetly-onyx', width: 1200, height: 1600, pos: '50% 64%', decor: 'Taj Mahal', decorSlug: 'taj-mahal', text: 'Dlhý ostrovček s drezom', alt: 'Dlhý ostrovček s doskou Taj Mahal a zapusteným drezom' },
];

/** Blog articles shown in „Poradňa“: slug + a short teaser title (the last words are set in gold italics). */
export const HOME_GUIDES: Array<{ slug: string; title: string; titleEm: string }> = [
  { slug: 'transparentne-ceny-cenova-ponuka', title: 'Čo musí obsahovať', titleEm: 'cenová ponuka?' },
  { slug: 'ako-cistit-sinterovany-kamen', title: 'Ako čistiť sinterovaný', titleEm: 'kameň?' },
  { slug: 'technicky-kamen-cena-pracovna-doska', title: 'Technický kameň: cena a', titleEm: 'nevýhody' },
];

export const ORO_KLIENT = (od: string, dekor?: string) =>
  `https://oro-klient.orostone.sk/?od=${od}${dekor ? `&dekor=${dekor}` : ''}`;

export const PHONE_HREF = 'tel:+421917588738';
export const PHONE_LABEL = '+421 917 588 738';
export const MAPS_URL = 'https://www.google.com/maps?q=SNP+113%2F1%2C+956+18+Bo%C5%A1any';
