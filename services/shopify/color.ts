import {
  PRODUCT_COLOR_TONES,
  type ProductColorTone,
} from '../../constants';
import type { ShopifyProduct, ShopifyProductMetafieldKey, ShopifyProductVariant } from './types';

// Re-exported so adapter.ts can use getMetafieldValue without a circular dep.
// The key parameter is constrained to known metafield alias names declared in ShopifyProduct,
// eliminating the unsafe `as unknown as Record<string, ...>` cast from the original.
export function getMetafieldValue(product: ShopifyProduct, key: ShopifyProductMetafieldKey): string | undefined {
  return product[key]?.value || undefined;
}

/** Metafield `custom.color_category` — hodnoty: biele | sede | bezove | cierne (malými písmenami) */
function parseProductColorTone(raw: string | undefined): ProductColorTone | undefined {
  if (!raw?.trim()) return undefined;
  const v = raw.trim().toLowerCase();
  return (PRODUCT_COLOR_TONES as readonly string[]).includes(v) ? (v as ProductColorTone) : undefined;
}

/**
 * Category metafield / variant option often returns a JSON array or plain text (e.g. "White", "beige").
 */
function unwrapMetafieldListOrJson(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const t = value.trim();
  if (t.startsWith('[')) {
    try {
      const parsed = JSON.parse(t) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = parsed[0];
        if (typeof first === 'string' && !first.startsWith('gid://')) return first;
      }
    } catch {
      /* not JSON */
    }
  }
  if (t.startsWith('gid://')) return undefined;
  return t;
}

/**
 * Maps English (and common) color labels from Shopify category metafields / variant option.
 */
function mapEnglishColorLabelToTone(label: string | undefined): ProductColorTone | undefined {
  if (!label?.trim()) return undefined;
  const v = label.trim().toLowerCase();

  const exact: Record<string, ProductColorTone> = {
    white: 'biele',
    black: 'cierne',
    grey: 'sede',
    gray: 'sede',
    beige: 'bezove',
    silver: 'sede',
    ivory: 'biele',
    cream: 'bezove',
    gold: 'bezove',
    brown: 'bezove',
    tan: 'bezove',
    charcoal: 'cierne',
    navy: 'cierne',
    graphite: 'sede',
    steel: 'sede',
    slate: 'sede',
  };
  if (exact[v]) return exact[v];

  if (/\b(black|nero|čiern|ciern|graphite|anthracite|ebony)\b/i.test(v)) return 'cierne';
  if (/\b(white|off[\s-]?white|biel|snow|pearl|milky|super[\s-]?white)\b/i.test(v)) return 'biele';
  if (/\b(gre?y|silver|steel|slate|siv|chrome|metal)\b/i.test(v)) return 'sede';
  if (/\b(beige|cream|ivory|tan|sand|taupe|travertin|béž|walnut|camel|champagne)\b/i.test(v)) return 'bezove';

  return undefined;
}

/** Heuristic from custom color metafield (#RRGGBB) — for Nero etc. when name metafield isn't in Storefront API */
function approximateToneFromHex(hex: string | undefined): ProductColorTone | undefined {
  if (!hex?.startsWith('#')) return undefined;
  const raw = hex.slice(1).trim();
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return undefined;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (l < 0.2) return 'cierne';
  if (l > 0.82) return 'biele';
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  if (sat < 0.14 && l >= 0.25 && l <= 0.75) return 'sede';
  if (sat > 0.12 && r > 0.45 && g > 0.38 && b < 0.55 && l < 0.78) return 'bezove';
  if (l >= 0.2 && l <= 0.82) return 'sede';
  return undefined;
}

export function resolveColorCategoryFromShopifyProduct(
  product: ShopifyProduct,
  firstVariant: ShopifyProductVariant | undefined,
): ProductColorTone | undefined {
  const rawCategory = getMetafieldValue(product, 'color_category');
  const explicit = parseProductColorTone(rawCategory);
  if (explicit) return explicit;
  if (rawCategory?.trim()) {
    const fromEnglishCategory = mapEnglishColorLabelToTone(rawCategory);
    if (fromEnglishCategory) return fromEnglishCategory;
  }

  const cursorVal = getMetafieldValue(product, 'color_for_cursor');
  if (cursorVal?.trim()) {
    const skTone = parseProductColorTone(cursorVal);
    if (skTone) return skTone;
    const enTone = mapEnglishColorLabelToTone(cursorVal);
    if (enTone) return enTone;
  }

  const colorNameRaw =
    getMetafieldValue(product, 'color_name') || getMetafieldValue(product, 'color_name_for_cursor');
  if (colorNameRaw?.trim()) {
    const fromName = mapEnglishColorLabelToTone(colorNameRaw);
    if (fromName) return fromName;
  }

  const hexCursor = getMetafieldValue(product, 'color_hex_for_cursor');
  const fromHex = approximateToneFromHex(hexCursor);
  if (fromHex) return fromHex;

  const mfSources = [
    getMetafieldValue(product, 'shopify_color'),
    getMetafieldValue(product, 'shopify_color_pattern'),
    getMetafieldValue(product, 'custom_color_pattern'),
  ];
  for (const raw of mfSources) {
    const text = unwrapMetafieldListOrJson(raw);
    const tone = mapEnglishColorLabelToTone(text);
    if (tone) return tone;
  }

  const opts = firstVariant?.selectedOptions ?? [];
  const colorOpt = opts.find((o) => /^(color|colour|farba|farby)$/i.test(o.name.trim()));
  if (colorOpt) {
    const tone = mapEnglishColorLabelToTone(colorOpt.value);
    if (tone) return tone;
  }

  return undefined;
}
