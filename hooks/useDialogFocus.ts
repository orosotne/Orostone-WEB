import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

// Controls Tab can reach. Iframes (the Turnstile check) are left out: they sit between the first and the last control,
// and the browser tabs through them on its own.
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keyboard handling of a modal dialog (the newsletter pop-ups) while `open` is true: focus moves to `initialFocus`,
 * Tab and Shift+Tab cycle inside `dialog` instead of reaching the page behind the backdrop, Escape calls `onEscape`,
 * and when the dialog closes, focus goes back to the element that had it before.
 */
export function useDialogFocus(
  open: boolean,
  dialog: RefObject<HTMLElement | null>,
  initialFocus: RefObject<HTMLElement | null>,
  onEscape: () => void,
) {
  // The latest callback, so the listener never acts on the state from when the dialog opened
  const onEscapeRef = useRef(onEscape);
  useEffect(() => {
    onEscapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    initialFocus.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscapeRef.current();
        return;
      }
      const root = dialog.current;
      if (e.key !== 'Tab' || !root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const outside = !root.contains(active);
      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (opener && opener !== document.body && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, dialog, initialFocus]);
}
