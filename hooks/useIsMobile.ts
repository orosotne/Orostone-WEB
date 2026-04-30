import { useSyncExternalStore } from 'react';

// Single matchMedia subscription per breakpoint, shared across all
// useIsMobile() callers. With many <Button> instances on a page this
// avoids N duplicate matchMedia listeners + N setState re-renders on
// viewport / orientation changes.

type Store = {
  matches: boolean;
  mql: MediaQueryList;
  listeners: Set<() => void>;
  handler: (e: MediaQueryListEvent) => void;
};

const stores = new Map<number, Store>();

function getStore(breakpoint: number): Store | null {
  if (typeof window === 'undefined') return null;
  let s = stores.get(breakpoint);
  if (s) return s;

  const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
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
  stores.set(breakpoint, store);
  return store;
}

export function useIsMobile(breakpoint = 1024) {
  return useSyncExternalStore(
    (onChange) => {
      const store = getStore(breakpoint);
      if (!store) return () => {};
      store.listeners.add(onChange);
      return () => { store.listeners.delete(onChange); };
    },
    () => stores.get(breakpoint)?.matches ?? false,
    () => false,
  );
}
