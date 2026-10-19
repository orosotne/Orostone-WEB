import { isSampleOrderProduct } from './samples';

type CatalogProductIdentity = { handle: string; tags?: string[]; productType?: string };

/** Orotable shares our Headless channel, but uses its own catalog and checkout. */
export function isMainCatalogProduct(product: CatalogProductIdentity): boolean {
  return !isSampleOrderProduct(product)
    && !product.handle.trim().toLowerCase().startsWith('orotable-')
    && product.productType?.trim().toLowerCase() !== 'orostone table'
    && !product.tags?.some((tag) => {
      const normalized = tag.trim().toLowerCase();
      return normalized === 'orostone-table' || normalized.startsWith('orotable:');
    });
}
