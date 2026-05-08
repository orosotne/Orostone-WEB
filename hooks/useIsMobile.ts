import { useSyncExternalStore } from 'react';

// Single matchMedia subscription per query, shared across all callers.
// With many <Button> instances on a page this avoids N duplicate
// matchMedia listeners + N setState re-renders on viewport / orientation
// / pointer-capability changes.

type Store = {
  matches: boolean;
  mql: MediaQueryList;
  listeners: Set<() => void>;
  handler: (e: MediaQueryListEvent) => void;
};

const stores = new Map<string, Store>();

function getStore(query: string): Store | null {
  if (typeof window === 'undefined') return null;
  let s = stores.get(query);
  if (s) return s;

  const mql = window.matchMedia(query);
  const store: Store = {
    matches: mql.matches,
    mql,
    listeners: new Set(),
    handler: (e: MediaQueryListEvent) => {
      store.matches = e.matches;
      store.listeners.forEach(fn => fn());
    },
  };
  mql.addEventListener('change', store.handler);
  stores.set(query, store);
  return store;
}

function useMediaQuery(query: string, ssrFallback: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const store = getStore(query);
      if (!store) return () => {};
      store.listeners.add(onChange);
      return () => { store.listeners.delete(onChange); };
    },
    () => {
      // The first getSnapshot call happens BEFORE subscribe runs, so the
      // shared `stores` map may not have the entry yet. Without a synchronous
      // peek at window.matchMedia, the initial render falls back to
      // `ssrFallback` (false) → mobile users briefly render desktop-only
      // components (e.g. <TextKnockoutSection />), triggering their lazy
      // import() before the second render unmounts them. Peek synchronously
      // so the very first paint already knows the correct value.
      const existing = stores.get(query);
      if (existing) return existing.matches;
      if (typeof window !== 'undefined') {
        return window.matchMedia(query).matches;
      }
      return ssrFallback;
    },
    () => ssrFallback,
  );
}

export function useIsMobile(breakpoint = 1024) {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`, false);
}

// True when the device exposes a hoverable, fine-grained pointer
// (mouse / trackpad). Independent of viewport width so desktop split-screen
// or tablets with attached mice keep getting hover/tap feedback even when
// useIsMobile() returns true.
export function useHasFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)', true);
}
