import { useEffect, useRef } from 'react';

/**
 * Locks page scroll when `locked` is true.
 * Uses the iOS-safe `position: fixed` technique so the page doesn't
 * jump to top on Safari. Restores the exact scroll position on unlock.
 *
 * Safe for concurrent overlays: only the first lock captures the scroll
 * position and only the last unlock restores it.
 */

let lockCount = 0;
let savedScrollY = 0;
let savedStyles: {
  htmlOverflow: string;
  bodyOverflow: string;
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
} | null = null;

function lock() {
  lockCount++;
  if (lockCount > 1) return;

  savedScrollY = window.scrollY;
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
  window.scrollTo(0, savedScrollY);

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
