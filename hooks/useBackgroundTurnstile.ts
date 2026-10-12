import { useRef, useState } from 'react';
import type { TurnstileInstance } from '@marsidev/react-turnstile';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITEKEY as string | undefined;

/** How long a submit waits for a challenge that is still running before the server decides without a token. */
const TOKEN_WAIT_MS = 15_000;

/**
 * Turnstile for the newsletter forms (footer, pop-up), which show no captcha box.
 * The widget mounts on `arm()` (first focus of the e-mail field), so Cloudflare's script loads only
 * for visitors who start typing, and the challenge runs while they type. Render it with
 * `appearance: 'interaction-only'` out of the flow: most visitors never see it and the layout never
 * moves. `getToken()` waits for a challenge that has not finished yet; the server
 * (subscribe-newsletter, TURNSTILE_ENFORCE) decides whether a missing token is acceptable.
 */
export function useBackgroundTurnstile() {
  const ref = useRef<TurnstileInstance>(null);
  const [armed, setArmed] = useState(false);
  const token = useRef<string | null>(null);
  const loaded = useRef(false);
  const interactive = useRef(false);
  const waiting = useRef<((value: string | null) => void) | null>(null);

  const settle = (value: string | null) => {
    token.current = value;
    const resolve = waiting.current;
    waiting.current = null;
    resolve?.(value);
  };

  const arm = () => {
    if (SITE_KEY) setArmed(true);
  };

  const getToken = (): Promise<string | null> => {
    if (!SITE_KEY) return Promise.resolve(null);
    setArmed(true);
    if (token.current) return Promise.resolve(token.current);
    return new Promise((resolve) => {
      waiting.current = resolve;
      const giveUp = () => {
        if (waiting.current !== resolve) return;
        // A visible challenge is waiting for the visitor's click: keep waiting.
        if (interactive.current) window.setTimeout(giveUp, TOKEN_WAIT_MS);
        else settle(null);
      };
      window.setTimeout(giveUp, TOKEN_WAIT_MS);
    });
  };

  /** Tokens are single-use: after a failed attempt, get a fresh one. */
  const reset = () => {
    token.current = null;
    if (loaded.current) ref.current?.reset();
  };

  const widgetProps = {
    ref,
    siteKey: SITE_KEY ?? '',
    onWidgetLoad: () => {
      loaded.current = true;
    },
    onSuccess: (value: string) => {
      interactive.current = false;
      settle(value);
    },
    onExpire: () => {
      token.current = null;
    },
    onError: () => settle(null),
    onUnsupported: () => settle(null),
    onBeforeInteractive: () => {
      interactive.current = true;
    },
    onAfterInteractive: () => {
      interactive.current = false;
    },
  };

  return { armed, arm, getToken, reset, widgetProps };
}
