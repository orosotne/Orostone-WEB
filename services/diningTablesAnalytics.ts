import { trackGA4Event } from './analytics';

export const DINING_TABLES_URL = 'https://stoly.orostone.sk/';

/** CookieContext defaults analytics to true before a choice, so both conditions are required. */
export function trackDiningTablesPromotionClick(hasConsented: boolean, analyticsAllowed: boolean): void {
  if (!hasConsented || !analyticsAllowed) return;

  trackGA4Event('dining_tables_click', {
    placement: 'homepage_promotion',
    link_url: DINING_TABLES_URL,
  });
}
