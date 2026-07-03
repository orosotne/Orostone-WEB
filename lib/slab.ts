// ===========================================
// SLAB GEOMETRY & PRICING — single source of truth
// ===========================================
// REFACTOR (finding f30): slab-area and slab-price math was triplicated across
// services/shopify/adapter.ts, components/ProductDetail/utils.ts and
// components/ProductDetail/BundleSelector.tsx, each with its own regex and its
// own magic `5.12` fallback. The copies had already drifted: the adapter matched
// both '×' and 'x', while calculateSlabPrice matched ASCII 'x' only — so the
// first slab entered with a typographic '×' in Shopify would silently price at
// 5.12 m² (wrong slab total, wrong Product JSON-LD price, wrong ad-pixel value).
//
// This module is plain, dependency-free TS so all three runtimes (browser,
// Vite build scripts, Vercel functions) can import it. Behaviour is identical
// for the current ASCII catalog; it only removes the divergence.

/** Standard Orostone slab footprint (3.2 m × 1.6 m) used when dimensions are absent/unparseable. */
export const DEFAULT_SLAB_AREA_M2 = 5.12;

/** Accepts both the multiplication sign '×' and the ASCII 'x' (case-insensitive). */
const DIMENSION_RE = /(\d+)\s*[×x]\s*(\d+)/i;

const round2 = (n: number): number => Math.round(n * 100) / 100;

/**
 * Parse a "WWWW x HHHH mm" dimension string into millimetre width/height.
 * Returns null when the string does not contain a parseable pair.
 */
export function parseDimensionsMm(dimensions: string | null | undefined): { widthMm: number; heightMm: number } | null {
  if (!dimensions) return null;
  const m = dimensions.match(DIMENSION_RE);
  if (!m) return null;
  const widthMm = parseInt(m[1], 10);
  const heightMm = parseInt(m[2], 10);
  if (!Number.isFinite(widthMm) || !Number.isFinite(heightMm)) return null;
  return { widthMm, heightMm };
}

/**
 * Slab area in m² from a dimension string, falling back to DEFAULT_SLAB_AREA_M2
 * when the string is missing or unparseable. Rounded to 2 decimals.
 */
export function slabAreaM2(dimensions: string | null | undefined): number {
  const dims = parseDimensionsMm(dimensions);
  if (!dims) return DEFAULT_SLAB_AREA_M2;
  return round2((dims.widthMm / 1000) * (dims.heightMm / 1000));
}

/**
 * Total price of one slab = pricePerM2 × slab area (m²). Rounded to 2 decimals.
 * Replaces the old calculateSlabPrice() verbatim (same rounding, same fallback),
 * only with the shared '×'/'x'-tolerant parser.
 */
export function calculateSlabPrice(pricePerM2: number, dimensions: string): number {
  return round2(pricePerM2 * slabAreaM2(dimensions));
}

/**
 * Inverse used by BundleSelector: derive slab area from a known slab price and
 * per-m² price, with the same fallback so bundle maths and PDP maths agree.
 */
export function slabAreaFromPrices(pricePerSlab: number, pricePerM2: number): number {
  return pricePerM2 > 0 ? round2(pricePerSlab / pricePerM2) : DEFAULT_SLAB_AREA_M2;
}
