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

/** Bump whenever a published price or range changes — surfaces as "Aktualizované" on /cennik. */
export const PRICING_LAST_UPDATED = '2026-07-22';

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

// Re-exported so pricing consumers have one import site; the values still
// live in components/ProductDetail/types.ts (InstallationSelector contract).
export { INSTALLATION_RATE_PER_M2, BUNDLE_OPTIONS };

/** What the 279 €/m² realization service covers (visible copy + FAQ answers). */
export const INSTALLATION_INCLUDES = [
  'zameranie',
  'doprava',
  'opracovanie hrán',
  'leštenie',
  'montáž',
] as const;

/**
 * Official orientation range for a finished countertop per running meter
 * (fabrication + installation included). Confirmed 2026-07-22 — the single
 * public €/bm claim; articles and FAQs must match it.
 */
export const COUNTERTOP_PER_BM = { min: 280, max: 600 } as const;

// Fact constants used in citable copy — keep in sync with TDS.
export const HEAT_RESISTANCE_C = 300;
export const MAX_SLAB_FORMAT = '3200 × 1600 mm';
export const SLAB_THICKNESS_MM = 12;
export const POROSITY_CLAIM = '< 0,1 %';

/** Formats "332,81 €" style values for Slovak copy. */
export const formatEur = (value: number): string =>
  `${value.toLocaleString('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
