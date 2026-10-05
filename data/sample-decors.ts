/** Approved 100 × 100 × 12 mm sample designs, shared by selection and checkout. */
export const SAMPLE_DECORS = [
  { id: 'nero-margiua', name: 'NERO MARGIUA', image: '/images/vzorky/nero-margiua.webp' },
  { id: 'wild-forest', name: 'WILD FOREST', image: '/images/vzorky/wild-forest.webp' },
  { id: 'super-white-extra', name: 'SUPER WHITE EXTRA', image: '/images/vzorky/super-white-extra.webp' },
  { id: 'astrana-grey', name: 'ASTRANA GREY', image: '/images/vzorky/astrana-grey.webp' },
  { id: 'appennino', name: 'APPENNINO', image: '/images/vzorky/appennino.webp' },
  { id: 'calacatta-top', name: 'CALACATTA TOP', image: '/images/vzorky/calacatta-top.webp' },
  { id: 'statuario-diamante', name: 'STATUARIO DIAMANTE', image: '/images/vzorky/statuario-diamante.webp' },
  { id: 'givenchy-gold', name: 'GIVENCHY GOLD', image: '/images/vzorky/givenchy-gold.webp' },
  { id: 'taj-mahal', name: 'TAJ MAHAL', image: '/images/vzorky/taj-mahal.webp' },
  { id: 'roman-travertine', name: 'ROMAN TRAVERTINE', image: '/images/vzorky/roman-travertine.webp' },
  { id: 'gothic-gold', name: 'GOTHIC GOLD', image: '/images/vzorky/gothic-gold.webp' },
  { id: 'yabo-white', name: 'YABO WHITE', image: '/images/vzorky/yabo-white.webp' },
] as const;

export type SampleDecorId = typeof SAMPLE_DECORS[number]['id'];
