// ===========================================
// PRICING — single source of truth
// ===========================================
// Every price claim published on the site (pages, FAQs, llms.txt, feeds,
// JSON-LD) must import from this module instead of hardcoding numbers.
// Slab prices are derived from data/shop-products-fallback.json, which is
// regenerated from Shopify on every build (scripts/sync-shop-fallback.ts),
// so they can never drift from the live catalog.
//
// Plain, dependency-free of React so browser code, tsx build scripts and
// Vercel functions can all import it (same contract as lib/slab.ts).
import shopProducts from './shop-products-fallback.json';
import { INSTALLATION_RATE_PER_M2, BUNDLE_OPTIONS } from '../components/ProductDetail/types';
import { calculateSlabPrice } from '../lib/slab';

/** Bump whenever a published price or range changes — surfaces as "Aktualizované" on /cennik. */
export const PRICING_LAST_UPDATED = '2026-09-29';

export interface SlabPriceEntry {
  id: string;
  name: string;
  pricePerM2: number;
  thickness: string;
  dimensions: string;
}

interface FallbackProduct {
  id: string;
  name: string;
  pricePerM2: number;
  thickness: string;
  dimensions: string;
}

/** All decors with live per-m² prices (EUR, VAT incl.) — derived, never edited by hand. */
export const SLAB_PRICES: SlabPriceEntry[] = (shopProducts as FallbackProduct[]).map(
  ({ id, name, pricePerM2, thickness, dimensions }) => ({ id, name, pricePerM2, thickness, dimensions })
);

export const SLAB_PRICE_MIN = Math.min(...SLAB_PRICES.map((p) => p.pricePerM2));
export const SLAB_PRICE_MAX = Math.max(...SLAB_PRICES.map((p) => p.pricePerM2));

/**
 * Whole-slab prices (EUR, VAT incl.) — what a customer actually pays Orostone.
 * Orostone sells material only, by whole slabs (one Shopify variant = one slab);
 * fabrication and installation are done and billed by the partner stonemason.
 */
const SLAB_TOTALS = SLAB_PRICES.map((p) => Math.round(calculateSlabPrice(p.pricePerM2, p.dimensions)));
export const SLAB_TOTAL_MIN = Math.min(...SLAB_TOTALS);
export const SLAB_TOTAL_MAX = Math.max(...SLAB_TOTALS);

// Re-exported so pricing consumers have one import site; the values still
// live in components/ProductDetail/types.ts (InstallationSelector contract).
export { INSTALLATION_RATE_PER_M2, BUNDLE_OPTIONS };

/** Discount (%) the cart applies for a given number of slabs (BUNDLE_OPTIONS). */
export const bulkDiscountPercent = (slabs: number): number =>
  Math.max(0, ...BUNDLE_OPTIONS.filter((b) => b.quantity <= slabs).map((b) => b.discountPercent));

/** First quantity with a discount — „od 3 platní −20 %". */
export const BULK_DISCOUNT = BUNDLE_OPTIONS.find((b) => b.discountPercent > 0)!;

/** What the partner stonemason's orientation rate (279 €/m²) covers — not part of Orostone's price. */
export const INSTALLATION_INCLUDES = [
  'zameranie',
  'doprava',
  'opracovanie hrán',
  'leštenie',
  'montáž',
] as const;

/**
 * MARKET orientation for a finished sintered stone countertop per running meter
 * (fabrication + installation included) — the same range as the table in
 * article-24. NOT Orostone's price: Orostone sells slabs only, so small
 * kitchens come out higher per meter (a whole slab is bought).
 */
export const MARKET_SINTERED_PER_BM = { min: 400, max: 600 } as const;

// Fact constants used in citable copy — keep in sync with TDS.
export const HEAT_RESISTANCE_C = 300;
export const MAX_SLAB_FORMAT = '3200 × 1600 mm';
export const SLAB_THICKNESS_MM = 12;
export const POROSITY_CLAIM = '< 0,1 %';

/** Formats "332,81 €" style values for Slovak copy. */
export const formatEur = (value: number): string =>
  `${value.toLocaleString('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

/** Formats whole-euro amounts ("1 704 €") — slab and project totals. Non-breaking space keeps "€" on the line. */
export const formatEurWhole = (value: number): string =>
  `${Math.round(value).toLocaleString('sk-SK')} €`;
