/**
 * Module-level coordinator that decides which inspiration cards on mobile
 * are allowed to mount their <video> element at any given time.
 *
 * Background
 * ----------
 * On desktop every inspiration card autoplays its own <video> in the marquee.
 * On a real GPU + plenty of RAM that's fine.
 *
 * On mobile (iOS Safari especially) running 14 paralell video decoders was
 * causing memory pressure → paint buffer eviction → "white flash" on fast
 * scroll back. PR #33 fixed that by killing <video> mounts entirely on mobile
 * (poster image only; click → lightbox plays full quality).
 *
 * Users then asked for the movement back — but only for the cards actually
 * visible. This coordinator enforces a hard cap of MAX_ACTIVE simultaneous
 * mounted <video> elements on mobile, picked by IntersectionObserver ratio.
 * The visible 1–2 cards play; everything off-screen stays poster-only.
 */
const MAX_ACTIVE = 2;

const ratios = new Map<string, number>();
const subscribers = new Set<(activeIds: Set<string>) => void>();
let lastActive: Set<string> = new Set();

function computeActive(): Set<string> {
  const sorted = Array.from(ratios.entries())
    .filter(([, r]) => r > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_ACTIVE)
    .map(([id]) => id);
  return new Set(sorted);
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const id of a) if (!b.has(id)) return false;
  return true;
}

function notifyIfChanged(): void {
  const next = computeActive();
  if (setsEqual(next, lastActive)) return;
  lastActive = next;
  subscribers.forEach((fn) => fn(next));
}

export const inspirationVideoCoordinator = {
  /** A card reports its current IntersectionObserver ratio. */
  registerRatio(id: string, ratio: number): void {
    if (ratio <= 0) ratios.delete(id);
    else ratios.set(id, ratio);
    notifyIfChanged();
  },

  /** Called on unmount — drops the card from consideration. */
  unregister(id: string): void {
    if (!ratios.has(id)) return;
    ratios.delete(id);
    notifyIfChanged();
  },

  /**
   * Subscribe to active-id changes. Fires once immediately with the current
   * set so the subscriber starts in the right state. Returns an unsubscribe.
   */
  subscribe(fn: (activeIds: Set<string>) => void): () => void {
    subscribers.add(fn);
    fn(lastActive);
    return () => {
      subscribers.delete(fn);
    };
  },
};
