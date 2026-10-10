import { useCallback, useEffect, useRef, useState } from 'react';

export interface PhotoLayer<T> {
  id: number;
  item: T;
  /** decoded and allowed to show */
  ready: boolean;
}

/** The cross-fade of a photo switch, for the `transition` style of each layer */
export const PHOTO_FADE_MS = 200;
export const photoFade = (delayMs = 0) => `opacity ${PHOTO_FADE_MS}ms ease-out${delayMs ? ` ${delayMs}ms` : ''}`;

/** Longer than any fade (with its delay): by then every layer under a shown one is out of sight */
const SETTLE_FALLBACK_MS = 1000;

/**
 * Layers for switching photos without a flash. A new photo goes on top and stays invisible until its image has
 * decoded (call `reveal` from the img's onLoad), so the photo under it never gives way to an empty frame or the
 * backdrop. Layers that never got to show are skipped when the selection moves on. Fading in over an opaque photo,
 * instead of a symmetric cross-fade, also keeps the background from showing through halfway.
 *
 * The fades are CSS transitions on `opacity` (framer-motion's accelerated opacity animation drops the value for one
 * frame when it finishes, which flashed the previous photo). Remove what can no longer be seen from the img's
 * onTransitionEnd: `settle` drops everything under a layer that has finished fading in, `drop` one layer that has
 * finished fading out. If a transition never runs, the layers are settled a little later anyway.
 */
export function usePhotoLayers<T>(current: T) {
  const nextId = useRef(1);
  const [layers, setLayers] = useState<PhotoLayer<T>[]>(() => [{ id: 0, item: current, ready: true }]);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    setLayers((prev) => {
      const shown = prev.filter((l) => l.ready);
      if (shown.length && Object.is(shown[shown.length - 1].item, current)) {
        return shown.length === prev.length ? prev : shown;
      }
      return [...shown, { id: nextId.current++, item: current, ready: false }];
    });
  }, [current]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const settle = useCallback((id: number) => {
    setLayers((prev) => {
      const at = prev.findIndex((l) => l.id === id);
      return at > 0 ? prev.slice(at) : prev;
    });
  }, []);

  const drop = useCallback((id: number) => {
    setLayers((prev) => (prev.length > 1 && prev.some((l) => l.id === id) ? prev.filter((l) => l.id !== id) : prev));
  }, []);

  // decode() first, so the fade never starts on a frame where the photo isn't painted yet, and one frame at opacity 0
  // so the transition has a start. A photo that fails to load is shown anyway (its alt text) rather than leaving the
  // previous photo up.
  const reveal = useCallback(
    (img: HTMLImageElement, id: number) => {
      const show = () =>
        requestAnimationFrame(() => {
          setLayers((prev) =>
            prev.some((l) => l.id === id && !l.ready) ? prev.map((l) => (l.id === id ? { ...l, ready: true } : l)) : prev,
          );
          const timer = setTimeout(() => {
            timers.current.delete(timer);
            settle(id);
          }, SETTLE_FALLBACK_MS);
          timers.current.add(timer);
        });
      img.decode().then(show, show);
    },
    [settle],
  );

  return { layers, reveal, settle, drop };
}
