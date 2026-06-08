import { onIdle } from './utils';

// Stagger prefetch of lazy chunks — only for the genuinely likely next page from
// home. Earlier we prefetched 4 batches (~838 KB raw, including a 622 KB BlogArticle
// chunk and 4 legal pages) regardless of user intent. That cost mobile users 700+ KB
// even when they never clicked beyond the home page.
//
// Trimmed to: catalog browsing (likely next click) + product detail (next-next click).
// Other routes load on the navigation tap that requests them — chunks are small
// enough (Blog 6 KB, VOP 36 KB, etc.) that on-demand load is fine for INP. The
// 622 KB BlogArticle chunk in particular is no longer downloaded for users who
// never read a blog post.
export function scheduleChunkPrefetch(): void {
  if (typeof window === 'undefined') return;

  const conn = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const slowNetwork =
    conn?.saveData === true ||
    conn?.effectiveType === 'slow-2g' ||
    conn?.effectiveType === '2g';

  if (slowNetwork) return;

  onIdle(() => {
    import('../pages/CategoryPage');
    import('../pages/ProductCatalog');
  }, 3000);

  onIdle(() => {
    import('../pages/ShopProductDetail');
    import('../pages/Checkout');
  }, 6000);
}
