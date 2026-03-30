import { useEffect, useRef } from 'react';
import { useCookies } from '../context/CookieContext';

const GA_ID = (window as any)._GA_ESHOP_ID as string | undefined;

/**
 * Mark this browser as internal traffic with a team member identifier.
 *
 * Usage:
 *   ?internal=martin    — sets cookie, marks as "internal" + team_member "martin"
 *   ?internal=peter     — sets cookie, marks as "internal" + team_member "peter"
 *   ?internal=agency    — sets cookie, marks as "internal" + team_member "agency"
 *   ?internal=false     — removes the cookie
 *
 * Cookie lasts 1 year. Works across all networks (WiFi, 5G, etc.).
 */
function checkInternalFlag(): { isInternal: boolean; teamMember: string | null } {
  const params = new URLSearchParams(window.location.search);
  const param = params.get('internal');

  if (param && param !== 'false') {
    const member = param === 'true' ? 'unknown' : param;
    document.cookie = `orostone_internal=${member};path=/;max-age=31536000;SameSite=Lax`;
    return { isInternal: true, teamMember: member };
  }
  if (param === 'false') {
    document.cookie = 'orostone_internal=;path=/;max-age=0';
    return { isInternal: false, teamMember: null };
  }

  const match = document.cookie.match(/orostone_internal=([^;]+)/);
  if (match) {
    return { isInternal: true, teamMember: match[1] };
  }
  return { isInternal: false, teamMember: null };
}

const { isInternal: isInternalTraffic, teamMember } = checkInternalFlag();

/**
 * GA4 loader — opt-out model (same as Meta Pixel).
 *
 * Loads immediately by default. Stops tracking only if the user
 * explicitly disables analytics in cookie settings.
 */
export const useAnalytics = () => {
  const { preferences } = useCookies();
  const scriptInjected = useRef(false);

  useEffect(() => {
    if (preferences.analytics && GA_ID && !scriptInjected.current) {
      // Inject gtag.js script dynamically
      scriptInjected.current = true;

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
          ...(isInternalTraffic && { traffic_type: 'internal', team_member: teamMember }),
        });
      };
      document.head.appendChild(script);
      return;
    }

    // Script already injected — update consent based on user choice
    if (!scriptInjected.current || typeof window.gtag !== 'function') return;

    if (preferences.analytics) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      if (GA_ID) window.gtag('config', GA_ID, {
        send_page_view: true,
        ...(isInternalTraffic && { traffic_type: 'internal', team_member: teamMember }),
      });
    } else {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }

    window.gtag('consent', 'update', {
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      ad_user_data: preferences.marketing ? 'granted' : 'denied',
      ad_personalization: preferences.marketing ? 'granted' : 'denied',
    });
  }, [preferences.analytics, preferences.marketing]);
};
