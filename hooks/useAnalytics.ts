import { useEffect, useRef } from 'react';
import { useCookies } from '../context/CookieContext';

const GA_ID = (window as any)._GA_ESHOP_ID as string | undefined;

/**
 * Set a persistent cookie to mark this browser as internal traffic.
 * Visit any page with ?internal=true to activate.
 * Visit with ?internal=false to deactivate.
 * Cookie lasts 1 year.
 */
function checkInternalFlag() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('internal') === 'true') {
    document.cookie = 'orostone_internal=1;path=/;max-age=31536000;SameSite=Lax';
  } else if (params.get('internal') === 'false') {
    document.cookie = 'orostone_internal=;path=/;max-age=0';
  }
  return document.cookie.includes('orostone_internal=1');
}

const isInternalTraffic = checkInternalFlag();

/**
 * GDPR/ePrivacy compliant GA4 loader.
 *
 * gtag.js is NOT loaded from HTML — it is dynamically injected here ONLY after
 * the user grants analytics consent. Before consent no network request is made
 * to Google servers (no IP/URL transfer to a US third party without consent).
 *
 * Pattern mirrors useMetaPixel.ts.
 */
export const useAnalytics = () => {
  const { preferences, hasConsented } = useCookies();
  const scriptInjected = useRef(false);

  useEffect(() => {
    if (!hasConsented) return;

    if (preferences.analytics && GA_ID && !scriptInjected.current) {
      // Inject gtag.js script dynamically — first analytics consent
      scriptInjected.current = true;

      // Initialise dataLayer + consent defaults BEFORE the script loads
      window.dataLayer = (window as any).dataLayer || [];
      if (typeof window.gtag !== 'function') {
        (window as any).gtag = function () {
          (window as any).dataLayer.push(arguments);
        };
      }
      window.gtag('consent', 'default', {
        analytics_storage: 'granted',
        ad_storage: preferences.marketing ? 'granted' : 'denied',
        ad_user_data: preferences.marketing ? 'granted' : 'denied',
        ad_personalization: preferences.marketing ? 'granted' : 'denied',
      });

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      script.onload = () => {
        window.gtag('config', GA_ID, {
          send_page_view: true,
          ...(isInternalTraffic && { traffic_type: 'internal' }),
        });
      };
      document.head.appendChild(script);
      return;
    }

    // Script already injected — just update consent
    if (!scriptInjected.current || typeof window.gtag !== 'function') return;

    if (preferences.analytics) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      if (GA_ID) window.gtag('config', GA_ID, {
        send_page_view: true,
        ...(isInternalTraffic && { traffic_type: 'internal' }),
      });
    } else {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }

    window.gtag('consent', 'update', {
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      ad_user_data: preferences.marketing ? 'granted' : 'denied',
      ad_personalization: preferences.marketing ? 'granted' : 'denied',
    });
  }, [preferences.analytics, preferences.marketing, hasConsented]);
};
