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
      'Pure white elegance with dramatic silver-grey veining inspired by premium Italian marble. Large-format porcelain slabs eliminate grout lines for an uninterrupted luxury surface. Exceptional resistance to scratches, moisture, and stains. Ideal for luxury bathrooms, living rooms, and entrance halls in Bratislava.',
    style: 'White base, dramatic silver-grey veining, Italian marble inspiration',
    bestFor: 'Luxury bathrooms, living rooms, entrance halls, kitchen backsplashes',
    finishes: 'Matte, Polished',
  },
  'calacatta-top': {
    blurb:
      'Warm golden-brown veining on a brilliant white base — the pinnacle of Italian stone craftsmanship. Calacatta pattern is one of the most exclusive marble designs in the world. Proven to increase property value. No impregnation needed. Perfect for kitchen islands, bathroom walls, and floors in Bratislava premium developments.',
    style: 'Brilliant white base, warm golden-brown veining, Calacatta marble pattern',
    bestFor: 'Kitchen islands, bathroom walls, floors, statement pieces',
    finishes: 'Polished (most popular), Matte',
  },
  'givenchy-gold': {
    blurb:
      'Inspired by haute couture, warm gold-ochre tones with delicate veining create a five-star hotel atmosphere. Seamless large-format slabs optically enlarge spaces. Acid and stain resistant. Pairs beautifully with matte black hardware and natural wood. An investment in lifestyle, not just a wall covering.',
    style: 'Warm gold-ochre tones, delicate veining, haute couture inspiration',
    bestFor: 'Feature walls, bathroom cladding, kitchen islands, hospitality interiors',
    finishes: 'Matte, Polished',
  },
  'roman-travertine': {
    blurb:
      'Timeless beauty of Roman architecture captured in a ceramic slab. Warm cream-to-beige tones with authentic travertine texture create a welcoming Mediterranean atmosphere. Suitable for both interior and exterior (terraces, balconies). No impregnation required unlike natural travertine. Popular among Bratislava architects for villas and premium apartments.',
    style: 'Warm cream-to-beige, authentic travertine texture, Mediterranean feel',
    bestFor: 'Indoor/outdoor (terraces, balconies, pools), villas, apartments',
    finishes: 'Leather/Textured, Matte',
    special: 'Frost-resistant, suitable for exterior',
  },
  'taj-mahal': {
    blurb:
      'Creamy-white base with delicate golden veining — a serene, spa-like luxury that never goes out of style. Perfect for bathrooms where you want to feel pampered every morning. Favored by architects working on high-end Bratislava residential projects. Durable porcelain slab lasts decades without losing its beauty.',
    style: 'Creamy-white base, delicate golden veining, spa-like serenity',
    bestFor: 'Master bathrooms, wellness spaces, bedroom feature walls',
    finishes: 'Matte, Polished',
  },
  appennino: {
    blurb:
      'The wild beauty of Italian Apennine mountains. Dynamic veining with natural coloring makes each piece visually unique. Ideal as a statement accent wall, full bathroom, or exclusive kitchen island. Large-format slabs emphasize pattern continuity. Excellent choice for Bratislava lofts, high-ceiling apartments, and industrial-style spaces.',
    style: 'Dynamic grey-brown veining, natural Italian mountain stone inspiration',
    bestFor: 'Accent walls, full bathrooms, lofts, industrial-style spaces',
    finishes: 'Matte, Leather/Textured',
  },
  'astrana-grey': {
    blurb:
      'The definition of modern elegance. Subtle grey tones with discreet veining suit any interior style — from Scandinavian to Italian contemporary. Perfect for open-plan Bratislava apartments where one surface flows through living room, dining area, and kitchen. Easy to maintain, durable, and visually understated. Ideal for families.',
    style: 'Subtle grey tones, discreet veining, Scandinavian-Italian minimalism',
    bestFor: 'Open-plan apartments, entire floor-to-ceiling applications, family homes',
    finishes: 'Matte, Polished',
  },
  'super-white-extra': {
    blurb:
      'The ultimate answer to minimalism. Dazzling white brings light, purity, and absolute modernity to any space. Optically enlarges rooms — strategic choice for Bratislava apartments with limited natural light. Provides a perfect canvas for colorful accents, art, plants, and statement furniture. Maximum stain resistance with effortless daily cleaning.',
    style: 'Pure dazzling white, minimal veining, absolute minimalism',
    bestFor: 'Small spaces (optical enlargement), modern kitchens, minimalist interiors',
    finishes: 'Polished (most popular), Matte',
  },
  'gothic-gold': {
    blurb:
      'Deep dark base with fiery golden veining — dramatic beauty found in five-star hotels and private Bratislava villas. Wherever you place Gothic Gold, it becomes the undeniable focal point. Golden veins react fascinatingly to different lighting — candlelight creates romance, spotlights highlight dynamism. A bold choice for bold people.',
    style: 'Deep dark base, fiery golden veining, dramatic luxury',
    bestFor: 'Feature walls, VIP bathrooms, penthouses, hotel lobbies',
    finishes: 'Polished, Leather/Textured',
  },
  'wild-forest': {
    blurb:
      'The perfect bridge between biophilic design and modern living. Expressive patterns in grey-brown and warm earthy tones evoke deep forest stone surfaces. Popular in Bratislava new builds with panoramic windows. Pairs excellently with oak wood, green plants, and textured fabrics. Equally at home in wellness spaces, saunas, and freestanding bathtub bathrooms.',
    style: 'Grey-brown and earthy tones, biophilic forest stone inspiration',
    bestFor: 'Wellness spaces, saunas, panoramic-window apartments, nature-inspired interiors',
    finishes: 'Leather/Textured, Matte',
  },
  'nero-margiua': {
    blurb:
      'Deep black with subtle silver-white veining — the ultimate statement of sophisticated taste. Creates unmistakable exclusivity in Bratislava penthouses, villas, and premium bathrooms. Equally impressive as an accent wall or full bathroom cladding. Contrasts perfectly with white sanitaryware, gold faucets, and wooden elements.',
    style: 'Deep black, subtle silver-white veining, ultimate sophistication',
    bestFor: 'Penthouses, premium bathrooms, accent walls, contrast with light elements',
    finishes: 'Polished, Leather/Textured',
  },
  'yabo-white': {
    blurb:
      "Purity in its most perfect form. Warm white with creamy undertones and subtle textures creates a welcoming yet always-current foundation. Works everywhere without exception — bathroom, hallway, kitchen. Porcelain technology ensures maximum hygiene and easy cleaning. A once-and-forever investment — because good taste doesn't age.",
    style: 'Warm white with creamy undertones, universal elegance',
    bestFor: 'Bathrooms, hallways, kitchens — universal application',
    finishes: 'Matte, Polished',
  },
};
