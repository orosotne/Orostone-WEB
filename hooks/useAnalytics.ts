import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookies } from '../context/CookieContext';
import { useFirstInteraction } from './useFirstInteraction';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

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

type AnalyticsWindow = Window & {
  _GA_ESHOP_ID?: string;
  _GTM_ESHOP_ID?: string;
  [key: `ga-disable-${string}`]: boolean | undefined;
};

function pageLocation(pathname: string): string {
  const current = new URL(window.location.href);
  const clean = new URL(pathname, current.origin);
  // Keep campaign attribution, without forwarding arbitrary form/search values.
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'dclid', 'gbraid', 'wbraid']) {
    const value = current.searchParams.get(key);
    if (value && /^[a-zA-Z0-9 _.-]{1,200}$/.test(value)) clean.searchParams.set(key, value);
  }
  return clean.href;
}

/**
 * Load the existing GTM container after an explicit analytics choice and first interaction.
 * This hook owns initial and SPA page_view events. The stream's Enhanced
 * Measurement history-based page views must be disabled to avoid duplicates.
 */
export const useAnalytics = () => {
  const { preferences, hasConsented } = useCookies();
  const { pathname } = useLocation();
  const interacted = useFirstInteraction();
  const state = useRef({ injected: false, ready: false, configured: false, lastPath: '', lastLocation: '' });
  const current = useRef({ analytics: false, marketing: false, pathname });

  useEffect(() => {
    const host = window as unknown as AnalyticsWindow;
    const GA_ID = host._GA_ESHOP_ID;
    const GTM_ID = host._GTM_ESHOP_ID;
    const analytics = hasConsented && preferences.analytics === true;
    const marketing = hasConsented && preferences.marketing === true;
    current.current = { analytics, marketing, pathname };
    if (!GA_ID || !GTM_ID) return;
    host[`ga-disable-${GA_ID}`] = !analytics;

    const consent = () => ({
      analytics_storage: current.current.analytics ? 'granted' : 'denied',
      ad_storage: current.current.marketing ? 'granted' : 'denied',
      ad_user_data: current.current.marketing ? 'granted' : 'denied',
      ad_personalization: current.current.marketing ? 'granted' : 'denied',
    });
    const recordPage = () => {
      if (!state.current.ready || !current.current.analytics || typeof window.gtag !== 'function') return;
      if (!state.current.configured) {
        const { isInternal, teamMember } = checkInternalFlag();
        window.gtag('set', { referral_exclusion_conditions: [
          { source: 'jtshug-bn.myshopify.com' },
          { source: 'store.orostone.sk' },
        ] });
        window.gtag('config', GA_ID, {
          send_page_view: false,
          ...(isInternal && { traffic_type: 'internal', team_member: teamMember }),
        });
        state.current.configured = true;
      }
      const path = current.current.pathname;
      if (state.current.lastPath === path) return;
      const location = pageLocation(path);
      let referrer = state.current.lastLocation;
      if (!referrer) {
        try {
          const source = new URL(document.referrer);
          referrer = source.origin + source.pathname;
        } catch { /* Direct entry has no referrer. */ }
      }
      window.gtag('event', 'page_view', {
        send_to: GA_ID, page_path: path, page_location: location,
        page_title: document.title, page_referrer: referrer,
      });
      state.current.lastPath = path;
      state.current.lastLocation = location;
    };

    if (state.current.injected && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', consent());
    }
    if (!interacted || !analytics) return;

    if (!state.current.injected) {
      state.current.injected = true;
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== 'function') {
        window.gtag = function () { window.dataLayer!.push(arguments); };
      }
      // The HTML stub defaults to denied before any tags can run. All Google
      // tags in this container inherit manual page-view ownership.
      window.gtag('set', 'send_page_view', false);
      window.gtag('consent', 'update', consent());
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      script.onload = () => {
        state.current.ready = true;
        // A withdrawal or route change while the script loads must use the
        // latest choice and current route, never the initial closure.
        window.gtag?.('consent', 'update', consent());
        recordPage();
      };
      document.head.appendChild(script);
      return;
    }
    recordPage();
  }, [hasConsented, preferences.analytics, preferences.marketing, interacted, pathname]);
};
