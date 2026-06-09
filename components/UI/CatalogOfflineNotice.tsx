import { WifiOff } from 'lucide-react';

/**
 * Soft, non-blocking banner shown when the live Storefront catalog could not be
 * loaded and the page is rendering the bundled fallback snapshot
 * (data/shop-products-fallback.json). Keeps the store fully usable while being
 * honest that prices/availability may be slightly stale — they are re-verified
 * server-side when the order is processed.
 */
export const CatalogOfflineNotice = () => (
  <div
    role="status"
    className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
  >
    <WifiOff size={16} className="shrink-0" aria-hidden />
    <span className="font-light">
      Zobrazujeme uloženú ponuku — aktuálne ceny a dostupnosť overíme pri spracovaní objednávky.
    </span>
  </div>
);
