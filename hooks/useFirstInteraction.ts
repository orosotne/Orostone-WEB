import { useEffect, useState } from 'react';

/**
 * Returns `true` once the user has first interacted with the page (scroll, click,
 * touchstart, keydown) OR after a fallback timeout — whichever comes first.
 *
 * Use to defer expensive 3rd-party scripts (GTM, Meta Pixel, etc.) so they
 * don't block the main thread during the LCP/INP-critical window. Bots and
 * users who never interact still get analytics fired via the timeout fallback.
 *
 * @param fallbackMs — how long to wait before giving up and firing anyway. 5s
 *   is a safe default: long enough for real users to scroll/tap, short enough
 *   that bots and abandoning users still register a session.
 */
export function useFirstInteraction(fallbackMs = 5000): boolean {
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (interacted) return;
    if (typeof window === 'undefined') return;

    let done = false;
    const trigger = () => {
      if (done) return;
      done = true;
      setInteracted(true);
    };

    // Listen for any signal of real user presence. `passive: true` keeps the
    // scroll handler off the rendering critical path.
    const events = ['scroll', 'click', 'touchstart', 'keydown', 'mousemove'] as const;
    const opts: AddEventListenerOptions = { once: true, passive: true, capture: true };
    events.forEach((evt) => window.addEventListener(evt, trigger, opts));

    // Fallback so analytics still fires for bots / users who never interact.
    const timer = window.setTimeout(trigger, fallbackMs);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, trigger, opts));
      window.clearTimeout(timer);
    };
  }, [interacted, fallbackMs]);

  return interacted;
}
