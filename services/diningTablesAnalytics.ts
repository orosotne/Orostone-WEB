import { trackGA4Event } from './analytics';

export const DINING_TABLES_URL = 'https://stoly.orostone.sk/';
// Internal entry context, without replacing the visitor's acquisition campaign.
export const DINING_TABLES_ANNOUNCEMENT_URL = `${DINING_TABLES_URL}?entry=announcement_bar`;

/** CookieContext defaults analytics to true before a choice, so both conditions are required. */
export function trackDiningTablesPromotionClick(
  hasConsented: boolean,
  analyticsAllowed: boolean,
  placement: 'homepage_promotion' | 'announcement_bar' = 'homepage_promotion',
): void {
  if (!hasConsented || !analyticsAllowed) return;

  trackGA4Event('dining_tables_click', {
    placement,
    link_url: placement === 'announcement_bar' ? DINING_TABLES_ANNOUNCEMENT_URL : DINING_TABLES_URL,
  });
}
