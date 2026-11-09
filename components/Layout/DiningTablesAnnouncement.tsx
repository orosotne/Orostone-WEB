import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCookies } from '../../context/CookieContext';
import { DINING_TABLES_URL, trackDiningTablesPromotionClick } from '../../services/diningTablesAnalytics';

export const DiningTablesAnnouncement: React.FC = () => {
  const { hasConsented, preferences } = useCookies();

  return (
    <a
      className="site-table-announcement"
      href={DINING_TABLES_URL}
      onClick={() => trackDiningTablesPromotionClick(hasConsented, preferences.analytics, 'announcement_bar')}
    >
      <span className="site-table-announcement-label">Novinka</span>
      <span aria-hidden="true">·</span>
      <span>Jedálenské stoly<span className="site-table-announcement-brand"> Orotable</span></span>
      <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
    </a>
  );
};
