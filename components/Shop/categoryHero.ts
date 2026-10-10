import { getVisibleCategories } from '../Eshop/EshopMegaMenu';
import { CATEGORY_SEO } from '../../data/seo/categories';

const SINTERED_LEAD = 'Celé platne 3 200 × 1 600 mm. Pri každom dekore vidíte cenu za m² aj cenu celej platne.';

/**
 * Title and lead of a catalog page's hero. Shared with the page's loading skeleton, which sets the same words
 * (invisibly), so the hero is exactly as tall before the page code arrives as after it.
 */
export function categoryHeroCopy(slug: string, subCategory?: string): { title: string; lead: string } | null {
  const category = getVisibleCategories().find((c) => c.slug === slug);
  if (!category) return null;
  const subCategoryName = subCategory
    ? (category.subcategories.find((s) => s.slug.endsWith(subCategory))?.name ?? null)
    : null;
  const seoDescription =
    CATEGORY_SEO[subCategory ? `${slug}/${subCategory}` : slug]?.description ||
    category.description ||
    `${category.name} — produkty od OROSTONE.`;
  return {
    title: subCategoryName ? `${category.name} — ${subCategoryName}` : category.name,
    lead: slug === 'sintered-stone' && !subCategory ? SINTERED_LEAD : seoDescription,
  };
}
