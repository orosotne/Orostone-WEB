import React, { lazy, Suspense, useCallback, useRef, useState } from 'react';
import type { TurnstileInstance } from '@marsidev/react-turnstile';

// Own chunk: the widget code and Cloudflare's script load only after the visitor touches the form.
const Turnstile = lazy(() => import('@marsidev/react-turnstile').then((m) => ({ default: m.Turnstile })));

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITEKEY as string | undefined;

/**
 * Cloudflare Turnstile for small forms that sit on every page (the newsletter in the footer).
 * It mounts on the first focus or tap in the form (`arm`), not on page view, and stays out of the
 * layout, so nothing moves after first paint. It shows only when Cloudflare asks for a click,
 * reports an error, or still has no token 3 s after sending. `getToken()` waits for the solved
 * token, which subscribe-newsletter verifies server-side. Tokens are single-use: call `reset()`
 * after a failed send so the retry gets a fresh one.
 */
export function useLazyTurnstile(theme: 'light' | 'dark') {
  const ref = useRef<TurnstileInstance>(null);
  const [armed, setArmed] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const arm = useCallback(() => setArmed(true), []);

  const getToken = useCallback(async (timeoutMs = 30_000): Promise<string> => {
    // Without a site key (local dev) the server rejects the empty token; the form shows its error.
    if (!SITE_KEY) return '';
    setArmed(true);
    const deadline = Date.now() + timeoutMs;
    // Not solved within 3 s of sending: show the widget in case it needs a click.
    const reveal = setTimeout(() => setInteractive(true), 3_000);
    try {
      while (!ref.current) {
        if (Date.now() > deadline) throw new Error('Turnstile did not load');
        await new Promise((r) => setTimeout(r, 50));
      }
      return await ref.current.getResponsePromise(Math.max(deadline - Date.now(), 1_000));
    } finally {
      clearTimeout(reveal);
    }
  }, []);

  const reset = useCallback(() => {
    ref.current?.reset();
  }, []);

  const widget =
    armed && SITE_KEY ? (
      <div className={interactive ? undefined : 'pointer-events-none absolute h-0 w-0 overflow-hidden'}>
        <Suspense fallback={null}>
          <Turnstile
            ref={ref}
            siteKey={SITE_KEY}
            options={{ theme, language: 'sk', appearance: 'interaction-only' }}
            onBeforeInteractive={() => setInteractive(true)}
            onError={() => setInteractive(true)}
          />
        </Suspense>
      </div>
    ) : null;

  return { arm, getToken, reset, widget };
}
