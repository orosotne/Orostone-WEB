import { useEffect } from 'react';
import { useCookies } from '../context/CookieContext';

const GA_ID = (window as any)._GA_ESHOP_ID as string | undefined;

/**
 * Sleduje cookie preferences a aktualizuje GA4 Consent Mode v2.
 * GA skript je načítaný v eshop.html s consent defaultom "denied".
 * Tento hook updatuje consent keď zákazník súhlasí alebo odmieta cookies.
 */
export const useAnalytics = () => {
  const { preferences, hasConsented } = useCookies();

  useEffect(() => {
    if (!hasConsented) return;
    if (typeof window.gtag !== 'function') return;

    if (preferences.analytics) {
      // Zákazník súhlasil — povolíme analytics a inicializujeme GA
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
      if (GA_ID) {
        window.gtag('config', GA_ID, {
          send_page_view: true,
        });
      }
    } else {
      // Zákazník odmietol analytics — zakážeme
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }

    if (preferences.marketing) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    } else {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
  }, [preferences.analytics, preferences.marketing, hasConsented]);
};
