/**
 * Per-slug SEO override for product pages.
 *
 * Single source of truth for Vera's production-ready product meta copy
 * (orostone-seo-meta-FINAL.md, section 5).
 *
 * Independent of `data/shop-products-fallback.json`, which is regenerated
 * from Shopify by `scripts/sync-shop-fallback.ts` at the start of every
 * build. Without this override, every build would silently revert product
 * meta to whatever Shopify currently has in its `metaTitle` /
 * `metaDescription` fields.
 *
 * This module is consumed by:
 *  - `scripts/prerender.ts` — generates static HTML for crawlers
 *  - `pages/ShopProductDetail.tsx` — renders SEOHead on the React-hydrated
 *    SPA so client-side route changes also reflect the FINAL copy
 *
 * To update copy: edit the entries below. Do NOT edit
 * `data/shop-products-fallback.json` — those edits are erased on the next
 * build.
 */

export interface ProductMetaOverrideEntry {
  title: string;
  description: string;
}

export const PRODUCT_META_OVERRIDE: Record<string, ProductMetaOverrideEntry> = {
  appennino: {
    title: 'Appennino — svetlý sinterovaný kameň | OROSTONE',
    description:
      'Pokojný svetlý dekor pre kuchyne, kde má plocha pôsobiť čisto a vyvážene. Bez agresívnej kresby a bez impregnácie. Vzorka Appennino na vyžiadanie.',
  },
  'astrana-grey': {
    title: 'Astrana Grey — sivý sinterovaný kameň | OROSTONE',
    description:
      'Astrana Grey je vyrovnaný sivý dekor s jemnou kresbou. Funguje v kuchyniach, kde má pracovná doska držať pokojnú líniu interiéru. Vzorka aj poradenstvo bez záväzku.',
  },
  'calacatta-top': {
    title: 'Calacatta Top — biely mramorový dekor | OROSTONE',
    description:
      'Biely mramorový dekor so zlatistými žilkami. Pre kuchyne a kúpeľne, kde má plocha pôsobiť reprezentatívne, ale nie efektne. Pošlite pôdorys, vyrátame cenu.',
  },
  'givenchy-gold': {
    title: 'Givenchy Gold — zlatistý mramorový dekor | OROSTONE',
    description:
      'Teplý dekor so zlatistou kresbou v béžovo-hnedom poli. Pre interiéry, kde má dekor niesť vlastnú váhu — kúpeľne, akcentové steny, ostrovčeky. Veľká platňa v showroome Bošany.',
  },
  'gothic-gold': {
    title: 'Gothic Gold — tmavý dekor so zlatistou kresbou | OROSTONE',
    description:
      'Gothic Gold je tmavý dekor so zlatistými žilkami. Pre kuchyne, kde má pracovná doska niesť dramatickejšiu líniu. Pozrite veľkú platňu v showroome Bošany.',
  },
  'nero-margiua': {
    title: 'Nero Margiua — čierny sinterovaný kameň | OROSTONE',
    description:
      'Čierny mramorový dekor s bielou žilkovou kresbou. Pre kuchyne, kde má pracovná doska byť kontrastom proti svetlým frontom. Veľká platňa v showroome Bošany.',
  },
  'roman-travertine': {
    title: 'Roman Travertine — travertínový dekor | OROSTONE',
    description:
      'Roman Travertine prináša prirodzenú textúru travertínu — bez nasiakavosti, bez impregnácie a bez údržby, ktorú by si reálny travertín vyžadoval.',
  },
  'statuario-diamante': {
    title: 'Statuario Diamante — biely mramorový dekor | OROSTONE',
    description:
      'Biely sinterovaný kameň s jemným šedým žilkovaním. Pre kuchyne, kde má plocha priniesť svetlo bez toho, aby zaťažila výraz. Vzorka na vyžiadanie.',
  },
  'super-white-extra': {
    title: 'Super White Extra — čistý biely dekor | OROSTONE',
    description:
      'Čistý biely sinterovaný kameň bez žilkovania. Pre minimalistické kuchyne, kde má plocha úplne ustúpiť v prospech kompozície. Vzorka na vyžiadanie.',
  },
  'taj-mahal': {
    title: 'Taj Mahal — krémový sinterovaný kameň | OROSTONE',
    description:
      'Krémový mramorový dekor s mäkkou kresbou. Pre kuchyne s teplými drevenými frontami a interiéry, kde má povrch hriať, nie chladiť. Vzorka aj poradenstvo bez záväzku.',
  },
  'wild-forest': {
    title: 'Wild Forest — výrazný dekor pre veľké plochy | OROSTONE',
    description:
      'Wild Forest je výrazný dekor s veľkoplošnou kresbou. Vzorka 10×10 cm ho nezachytí — odporúčame pozrieť veľkú platňu v showroome Bošany.',
  },
  'yabo-white': {
    title: 'Yabo White — teplý biely sinterovaný kameň | OROSTONE',
    description:
      'Yabo White je teplý biely dekor s mäkkou textúrou. Pre kuchyne, kde má svetlá plocha pôsobiť obytne, nie sterilne. Vzorka Yabo White na vyžiadanie.',
  },
};
