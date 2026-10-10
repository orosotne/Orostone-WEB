import { useEffect, useRef } from 'react';

/**
 * Locks page scroll when `locked` is true.
 * Uses the iOS-safe `position: fixed` technique so the page doesn't
 * jump to top on Safari. Restores the exact scroll position on unlock.
 *
 * Safe for concurrent overlays: only the first lock captures the scroll
 * position and only the last unlock restores it.
 *
 * If a link inside the overlay navigated to another page meanwhile, the old
 * position is not restored: the new page starts at the top.
 *
 * Sticky elements (the product gallery, catalog filter bar, …) would come
 * unstuck while the body is fixed and jump behind a translucent scrim; they
 * are held in place with a `translate` for the duration of the lock.
 */

let lockCount = 0;
let savedScrollY = 0;
let savedPath = '';
let heldSticky: Array<{ el: HTMLElement; translate: string }> = [];

let savedStyles: {
  htmlOverflow: string;
  bodyOverflow: string;
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
} | null = null;

/** Tailwind sticky elements (`sticky`, `lg:sticky` …) that are sticky at the current width. */
const stickyElements = (): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>('[class~="sticky"], [class*=":sticky"]')).filter(
    (el) => getComputedStyle(el).position === 'sticky',
  );

function lock() {
  lockCount++;
  if (lockCount > 1) return;

  savedScrollY = window.scrollY;
  savedPath = window.location.pathname;
  const sticky = stickyElements().map((el) => ({ el, top: el.getBoundingClientRect().top }));
  savedStyles = {
    htmlOverflow: document.documentElement.style.overflow,
    bodyOverflow: document.body.style.overflow,
    bodyPosition: document.body.style.position,
    bodyTop: document.body.style.top,
    bodyLeft: document.body.style.left,
    bodyRight: document.body.style.right,
    bodyWidth: document.body.style.width,
  };

  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';

  // Measured after the body is fixed: move each sticky element back to where it was on screen
  heldSticky = sticky.map(({ el, top }) => {
    const translate = el.style.translate;
    const shift = top - el.getBoundingClientRect().top;
    if (Math.abs(shift) > 0.5) el.style.translate = `0 ${shift}px`;
    return { el, translate };
  });
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0 || !savedStyles) return;

  document.documentElement.style.overflow = savedStyles.htmlOverflow;
  document.body.style.overflow = savedStyles.bodyOverflow;
  document.body.style.position = savedStyles.bodyPosition;
  document.body.style.top = savedStyles.bodyTop;
  document.body.style.left = savedStyles.bodyLeft;
  document.body.style.right = savedStyles.bodyRight;
  document.body.style.width = savedStyles.bodyWidth;
  if (window.location.pathname === savedPath) window.scrollTo(0, savedScrollY);
  // Scrolled back, so they stick on their own again (same frame, nothing is painted in between)
  heldSticky.forEach(({ el, translate }) => {
    el.style.translate = translate;
  });
  heldSticky = [];

  savedStyles = null;
}

export function useScrollLock(locked: boolean) {
  const wasLockedRef = useRef(false);

  useEffect(() => {
    if (locked && !wasLockedRef.current) {
      lock();
      wasLockedRef.current = true;
    } else if (!locked && wasLockedRef.current) {
      unlock();
      wasLockedRef.current = false;
    }

    return () => {
      if (wasLockedRef.current) {
        unlock();
        wasLockedRef.current = false;
      }
    };
  }, [locked]);
}
