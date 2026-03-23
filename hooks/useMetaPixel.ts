import { useEffect, useRef } from 'react';
import { useCookies } from '../context/CookieContext';

declare global {
  interface Window {
    fbq?: (cmd: string, ...args: unknown[]) => void;
    _fbq?: typeof window.fbq;
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const FBQ_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

/**
 * Loads Meta Pixel only when:
 * - VITE_META_PIXEL_ID is set
 * - Cookie consent for marketing is granted
 */
export function useMetaPixel(): void {
  const { preferences } = useCookies();
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!PIXEL_ID || !preferences.marketing || loadedRef.current) return;

    const loadScript = () => {
      if (typeof window.fbq === 'function') return;
      loadedRef.current = true;

      const script = document.createElement('script');
      script.async = true;
      script.src = FBQ_SRC;
      document.head.appendChild(script);

      script.onload = () => {
        if (typeof window.fbq === 'function') {
          window.fbq('init', PIXEL_ID);
          window.fbq('track', 'PageView');
        }
      };
    };

    loadScript();
  }, [preferences.marketing]);
}

/**
 * Track a Meta Pixel event. No-op if Pixel is not loaded.
 */
export function trackMetaEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (params) {
      window.fbq('track', eventName, params);
    } else {
      window.fbq('track', eventName);
    }
  }
}
