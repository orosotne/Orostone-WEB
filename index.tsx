declare global {
  interface Window { gtag?: (...args: any[]) => void; }
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import EshopApp from './EshopApp';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EshopApp />
  </React.StrictMode>
);

// Web Vitals — report LCP, INP, CLS to GA4 (or console in dev)
import { onLCP, onINP, onCLS } from 'web-vitals';

function sendToAnalytics(metric: { name: string; value: number; id: string; delta: number }) {
  if (import.meta.env.DEV) {
    console.log(`[web-vital] ${metric.name}: ${Math.round(metric.value)}ms (delta: ${Math.round(metric.delta)}ms)`);
    return;
  }
  if (typeof window.gtag === 'function') {
    const gaId = (window as any)._GA_ESHOP_ID as string | undefined;
    // Prefix event name with `web_vital_` so it can never be mistaken for a
    // purchase/lead conversion in GA4 or Google Ads (past incident: raw
    // `LCP` event was marked as a key event, milliseconds were interpreted
    // as EUR revenue → 46 513 EUR in fake conversions).
    const eventName = `web_vital_${metric.name.toLowerCase()}`;
    window.gtag('event', eventName, {
      ...(gaId ? { send_to: gaId } : {}),
      event_category: 'Web Vitals',
      metric_name: metric.name,
      value: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
