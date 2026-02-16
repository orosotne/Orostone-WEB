// ===========================================
// FEATURE FLAGS — Category Visibility
// ===========================================

/**
 * Kontroluje viditeľnosť kategórií v e-shope.
 * Nastavte hodnotu na `false` pre dočasné skrytie kategórie z produkcie.
 */
export const VISIBLE_CATEGORIES = {
  'sintered-stone': true,      // Sinterovaný kameň — zostáva viditeľný
  'tables': false,              // Stoly — dočasne skryté
  'invisible-cooktop': false,   // Invisible Cooktop — dočasne skryté
  'accessories': false          // Doplnky — dočasne skryté
} as const;

/**
 * Type pre viditeľné kategórie
 */
export type VisibleCategoryId = keyof typeof VISIBLE_CATEGORIES;

/**
 * Helper funkcia na overenie viditeľnosti kategórie
 */
export const isCategoryVisible = (id: string): boolean => {
  return VISIBLE_CATEGORIES[id as VisibleCategoryId] ?? false;
};
