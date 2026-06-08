import { PRODUCT_META_OVERRIDE } from '../productMetaOverride';
import { PRODUCT_SEO_CONTENT } from '../product-seo-content';

export { CATEGORY_SEO } from './categories';

export interface ResolvedProductSEO {
  title: string;
  description: string;
  keywords: string[];
  longDescription: string | undefined;
  keyBenefits: string[];
}

/**
 * Single source of truth for product SEO metadata.
 *
 * Priority order:
 *  1. PRODUCT_META_OVERRIDE (editor-curated final copy)
 *  2. PRODUCT_SEO_CONTENT (SEO content from product-seo-content.ts)
 *  3. shopifyMeta (live values from Shopify metafields)
 *  4. product handle as last-resort title fallback
 */
export function resolveProductSEO(
  handle: string,
  shopifyMeta?: { title?: string; description?: string },
): ResolvedProductSEO {
  const override = PRODUCT_META_OVERRIDE[handle];
  const seoContent = PRODUCT_SEO_CONTENT[handle];

  return {
    title: override?.title ?? seoContent?.metaTitle ?? shopifyMeta?.title ?? handle,
    description:
      override?.description ?? seoContent?.metaDescription ?? shopifyMeta?.description ?? '',
    keywords: seoContent?.keywords ?? [],
    longDescription: seoContent?.longDescription,
    keyBenefits: seoContent?.keyBenefits ?? [],
  };
}
