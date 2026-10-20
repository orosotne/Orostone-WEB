// Whether a layer of the site header that hangs down over the page on a phone is open: the menu drawer or the
// search results under the search field (the mega menu opens only on wide screens, where the bars below are not
// shown; the bare search field covers nothing and stays open while the page scrolls). SiteHeader sets it; the bars
// fixed to the bottom edge (MobileCtaBar, the product page's cart bar) slide away while it is open, as they do for
// the open cart, and the sample tray docked on /vzorky and the blog's back-to-top button fade away. They lie above
// the header (z-[60] and 900 over its z-50; the button's z-50 comes after the header in the page) and would cover
// the bottom of the drawer („Môj účet“, „Moje objednávky“) and the last search results.

type Listener = () => void;

let open = false;
const listeners = new Set<Listener>();

/** The drawer or the search results are open now. */
export function headerLayerOpenNow(): boolean {
  return open;
}

/** Called by SiteHeader each time its drawer or search results open or close; tells the subscribers on a change. */
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
