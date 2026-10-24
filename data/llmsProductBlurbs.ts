// ===========================================
// LLMS PRODUCT CONTENT — curated English blurbs for llms.txt / llms-full.txt
// ===========================================
// Hand-written editorial content keyed by product id. Consumed by
// scripts/generate-seo-artifacts.ts, which merges it with live catalog data
// (data/shop-products-fallback.json) — prices/URLs/keywords come from the
// catalog, never from here. A new Shopify product without an entry here
// degrades gracefully to its metaDescription.

export interface LlmsProductContent {
  /** One-paragraph blurb (llms.txt catalog entry). */
  blurb: string;
  /** "Style:" line (llms-full.txt). */
  style: string;
  /** "Best for:" line (llms-full.txt). */
  bestFor: string;
  /** "Finishes:" line (llms-full.txt). */
  finishes: string;
  /** Optional "Special:" line (llms-full.txt). */
  special?: string;
}

export const LLMS_PRODUCT_CONTENT: Record<string, LlmsProductContent> = {
  'statuario-diamante': {
    blurb:
      'White sintered stone with silver-grey veining in the spirit of Italian Statuario marble. The veining is clearly visible but calm, so the surface brings light without weighing down the room. Suitable for kitchen countertops, islands, backsplashes, wall cladding and floors. Needs no impregnation.',
    style: 'White base, silver-grey veining, inspired by Italian Statuario marble',
    bestFor: 'Kitchen countertops and islands, backsplashes, wall cladding, floors, bathrooms, entrance halls',
    finishes: 'Matte, Polished',
  },
  'calacatta-top': {
    blurb:
      'White marble-look sintered stone with warm golden-brown veining; the polished surface gives the pattern depth. Suitable for kitchen countertops, islands, backsplashes and bathroom walls where the surface should look representative without being showy. Unlike natural marble, it needs no impregnation and resists acids and stains.',
    style: 'Bright white base, warm golden-brown veining, Calacatta marble pattern',
    bestFor: 'Kitchen countertops and islands, backsplashes, bathroom walls',
    finishes: 'Polished (most popular), Matte',
  },
  'givenchy-gold': {
    blurb:
      'White base with pronounced golden-beige veining that branches in places. Suited to surfaces that carry the room on their own: a kitchen countertop, an island, a vanity top or wall cladding. Because the pattern does the work, the surroundings can stay calm. Resists acids and stains. A large slab is on display in the Bošany showroom.',
    style: 'White base, pronounced golden-beige veining that branches in places',
    bestFor: 'Kitchen countertops and islands, vanity tops, feature walls, bathroom cladding',
    finishes: 'Matte, Polished',
  },
  'roman-travertine': {
    blurb:
      'Warm cream-to-beige tones with layered travertine texture and a fine relief. The surface looks natural and warm, without sharp contrasts. Suitable for kitchen countertops, wall cladding, floors and terraces. As sintered stone it needs no impregnation, unlike natural travertine.',
    style: 'Warm cream-to-beige, layered travertine texture, fine relief',
    bestFor: 'Kitchen countertops, wall cladding, floors, terraces and balconies',
    finishes: 'Leather/Textured, Matte',
    special: 'Frost-resistant, suitable for exterior',
  },
  'taj-mahal': {
    blurb:
      'Creamy-white marble-look decor with soft golden veining. It reads warmer than a cold white, and the pattern does not break up the surface. Suited to kitchens with wooden fronts, bathrooms and hallways, where the surface should feel warm rather than cool.',
    style: 'Creamy-white base, soft golden veining, warm tone',
    bestFor: 'Kitchens with wooden fronts, bathrooms, hallways',
    finishes: 'Matte, Polished',
  },
  appennino: {
    blurb:
      'Light, almost white decor with dense but fine golden-beige veining. The pattern is detailed yet low-contrast, so the surface looks clean and balanced and does not compete with the rest of the kitchen. Suitable for kitchen countertops, islands, wall cladding, floors and bathrooms. Needs no impregnation.',
    style: 'Light, almost white base, fine low-contrast golden-beige veining',
    bestFor: 'Light and minimalist kitchens, countertops, islands, wall cladding, bathrooms',
    finishes: 'Matte, Leather/Textured',
  },
  'astrana-grey': {
    blurb:
      'Even grey with subtle tonal gradation and discreet lighter veining. The surface holds a calm line and does not draw attention to itself. Suitable for kitchen countertops, islands and backsplashes in interiors where it should be a quiet base rather than the main theme.',
    style: 'Even grey, subtle tonal gradation, discreet lighter veining',
    bestFor: 'Kitchen countertops, islands, backsplashes, open-plan interiors',
    finishes: 'Matte, Polished',
  },
  'super-white-extra': {
    blurb:
      'Light white base with grey veins, some thin and subtle, others more pronounced. The countertop keeps a marble look even in a mostly white kitchen, and the light surface makes a smaller or darker room look larger. Needs no impregnation; everyday cleaning takes a damp cloth.',
    style: 'Light white base, grey veining of varying intensity',
    bestFor: 'White kitchens, smaller or darker rooms, countertops and islands',
    finishes: 'Polished (most popular), Matte',
  },
  'gothic-gold': {
    blurb:
      'Dark decor with golden veining that runs across the surface in irregular lines. Suited to spaces that need a clear centre: a kitchen island, a countertop, a backsplash or wall cladding. A large slab is on display in the Bošany showroom.',
    style: 'Dark base, golden veining in irregular lines',
    bestFor: 'Kitchen islands and countertops, backsplashes, feature walls',
    finishes: 'Polished, Leather/Textured',
  },
  'wild-forest': {
    blurb:
      'Distinctive decor in grey-brown and earthy tones, with a pattern reminiscent of stone surfaces in a forest. The pattern is large-scale, so it shows best on a larger continuous surface: a kitchen island, full wall cladding, a bathroom or a wellness area. A 10 × 10 cm sample cannot capture it; we recommend seeing a full slab in the Bošany showroom.',
    style: 'Grey-brown and earthy tones, large-scale forest stone pattern',
    bestFor: 'Larger kitchen islands, full wall cladding, bathrooms, wellness spaces',
    finishes: 'Leather/Textured, Matte',
  },
  'nero-margiua': {
    blurb:
      'Deep black with silver-white veins that only gently lighten the pattern. The surface stays calm even in a large format. Works as a kitchen countertop or island, a feature wall or full bathroom cladding, wherever a dark surface should contrast with light surroundings. A large slab is on display in the Bošany showroom.',
    style: 'Deep black, fine silver-white veining',
    bestFor: 'Kitchen countertops and islands against light fronts, feature walls, bathroom cladding',
    finishes: 'Polished, Leather/Textured',
  },
  'yabo-white': {
    blurb:
      'Warm white with a creamy undertone and fine texture. It feels softer than a cold pure white, and the room stays light and airy. The neutral pattern makes it a base that works in kitchens, bathrooms and hallways. Needs no impregnation.',
    style: 'Warm white, creamy undertone, fine texture',
    bestFor: 'Kitchens, bathrooms, hallways',
    finishes: 'Matte, Polished',
  },
};
