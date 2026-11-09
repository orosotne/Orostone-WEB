import type { MouseEvent } from 'react';
import { startAnalyticsForNavigation, trackGA4Event } from './analytics';

export const DINING_TABLES_URL = 'https://stoly.orostone.sk/';
// Internal entry context, without replacing the visitor's acquisition campaign.
export const DINING_TABLES_ANNOUNCEMENT_URL = `${DINING_TABLES_URL}?entry=announcement_bar`;
const NAVIGATION_WAIT_MS = 800;

/** CookieContext defaults analytics to true before a choice, so both conditions are required. */
export function trackDiningTablesPromotionClick(
  hasConsented: boolean,
  analyticsAllowed: boolean,
  placement: 'homepage_promotion' | 'announcement_bar' = 'homepage_promotion',
  onComplete?: () => void,
): void {
  if (!hasConsented || !analyticsAllowed) return;

  trackGA4Event('dining_tables_click', {
    placement,
    link_url: placement === 'announcement_bar' ? DINING_TABLES_ANNOUNCEMENT_URL : DINING_TABLES_URL,
    ...(onComplete ? { event_callback: onComplete, event_timeout: NAVIGATION_WAIT_MS } : {}),
  });
}

/** Give a consented same-tab click time to leave the page, with a bounded fallback. */
export function handleDiningTablesAnnouncementClick(
  event: MouseEvent<HTMLAnchorElement>,
  hasConsented: boolean,
  analyticsAllowed: boolean,
): void {
  if (event.defaultPrevented || !hasConsented || !analyticsAllowed) return;

  const link = event.currentTarget;
  const ordinaryClick = event.button === 0 && !event.metaKey && !event.ctrlKey &&
    !event.shiftKey && !event.altKey && !link.target && !link.hasAttribute('download');
  const started = startAnalyticsForNavigation();
  if (!ordinaryClick || !started) {
    trackDiningTablesPromotionClick(hasConsented, analyticsAllowed, 'announcement_bar');
    return;
  }

  const destination = link.href;
  event.preventDefault();
  let navigated = false;
  const navigate = () => {
    if (navigated) return;
    navigated = true;
    window.clearTimeout(timer);
    window.location.assign(destination);
  };
  // This timer also works when Google is blocked or never calls its callback.
  const timer = window.setTimeout(navigate, NAVIGATION_WAIT_MS);
  try {
    trackDiningTablesPromotionClick(hasConsented, analyticsAllowed, 'announcement_bar', navigate);
  } catch {
    navigate();
  }
}
