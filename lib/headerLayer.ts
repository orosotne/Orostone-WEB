// Whether a layer of the site header that hangs down over the page on a phone is open: the menu drawer or the
// search panel (the mega menu opens only on wide screens, where the bars below are not shown). SiteHeader sets it;
// the bars fixed to the bottom edge (MobileCtaBar, the product page's cart bar) slide away while it is open, as they
// do for the open cart, and the sample tray docked on /vzorky fades away. They lie above the header (z-[60] and 900
// over its z-50) and would cover the bottom of the drawer („Môj účet“) and the last search results.

type Listener = () => void;

let open = false;
const listeners = new Set<Listener>();

/** The drawer or the search panel is open now. */
export function headerLayerOpenNow(): boolean {
  return open;
}

/** Called by SiteHeader each time its drawer or search panel opens or closes; tells the subscribers on a change. */
export function setHeaderLayerOpen(next: boolean): void {
  if (next === open) return;
  open = next;
  listeners.forEach((listener) => listener());
}

/** Calls `listener` after each change (useSyncExternalStore). Returns the function that stops it. */
export function subscribeHeaderLayer(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
