// ===========================================
// EDGE FUNCTION: send-daily-analytics
// ===========================================
// Posiela denný GA4 analytics report emailom každý večer.
//
// Potrebné secrets (supabase secrets set):
// - RESEND_API_KEY
// - GOOGLE_CLIENT_ID          (OAuth Client ID z GCP)
// - GOOGLE_CLIENT_SECRET      (OAuth Client Secret z GCP)
// - GOOGLE_REFRESH_TOKEN      (refresh token z application_default_credentials.json)
// - GA4_PROPERTY_ID           (default: 426727701)
//
// DEPLOYMENT:
// supabase functions deploy send-daily-analytics --project-ref xfkznvqufhnrphpdhfnc

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// --- Konštanty ---
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
const GOOGLE_REFRESH_TOKEN = Deno.env.get('GOOGLE_REFRESH_TOKEN');
const GA4_PROPERTY_ID = Deno.env.get('GA4_PROPERTY_ID') || '426727701';
const REPORT_TO = 'martinmiskeje@gmail.com';
const FROM_EMAIL = 'Orostone Analytics <noreply@orostone.sk>';
const LOGO_URL = 'https://www.orostone.sk/images/orostone-logo-email.png';
const LOGO_CIRCLE_URL = 'https://www.orostone.sk/images/logo-circle.png';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const SLOVAK_MONTHS_GENITIVE = [
  'januára', 'februára', 'marca', 'apríla', 'mája', 'júna',
  'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra',
];

// --- Typy ---

interface OverviewData {
  totalUsers: number;
  sessions: number;
  screenPageViews: number;
  averageSessionDuration: number; // sekundy
}

interface FunnelStep {
  label: string;
  eventName: string;
  count: number;
}

interface PageData {
  path: string;
  views: number;
  users: number;
}

interface SourceData {
  source: string;
  sessions: number;
}

interface DeviceData {
  desktop: number;
  mobile: number;
  tablet: number;
  total: number;
}

interface InternalVisit {
  member: string;
  users: number;
  sessions: number;
  pageViews: number;
}

interface ReportData {
  date: Date;
  current: OverviewData;
  previous: OverviewData;
  funnel: FunnelStep[];
  topPages: PageData[];
  sources: SourceData[];
  devices: DeviceData;
  internal: InternalVisit[];
}

// --- Google OAuth (refresh token) ---

async function getAccessToken(): Promise<string> {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error('Chýbajú Google OAuth secrets (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)');
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`Google Auth chyba: ${await res.text()}`);
  const { access_token } = await res.json();
  return access_token as string;
}

// --- GA4 Data API ---

async function runGA4Report(accessToken: string, body: object): Promise<any> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error(`GA4 API chyba: ${await res.text()}`);
  return res.json();
}

// --- Pomocné formátovanie ---

function pv(val: string | undefined): number {
  return parseFloat(val ?? '0') || 0;
}

function pi(val: string | undefined): number {
  return parseInt(val ?? '0') || 0;
}

function formatDuration(seconds: number): string {
  const s = Math.round(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r > 0 ? `${m}m ${r}s` : `${m}m`;
}

function formatNum(n: number): string {
  const r = Math.round(n);
  if (r < 1000) return r.toString();
  // Tisícové oddeľovače (medzera)
  return r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
}

function trendHtml(current: number, previous: number): string {
  if (previous === 0 && current === 0) {
    return '<span style="font-size:11px;color:#aaaaaa;">—</span>';
  }
  if (previous === 0) {
    return '<span style="font-size:11px;color:#22c55e;">↑ nové</span>';
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct > 0) return `<span style="font-size:11px;color:#22c55e;">↑ +${pct}%</span>`;
  if (pct < 0) return `<span style="font-size:11px;color:#ef4444;">↓ ${pct}%</span>`;
  return '<span style="font-size:11px;color:#aaaaaa;">→ 0%</span>';
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatPath(path: string): string {
  const clean = (path || '/').split('?')[0];
  const truncated = clean.length > 38 ? clean.slice(0, 35) + '…' : clean;
  return escapeHtml(truncated);
}

function formatDateSlovak(d: Date): string {
  return `${d.getDate()}. ${SLOVAK_MONTHS_GENITIVE[d.getMonth()]} ${d.getFullYear()}`;
}

// --- Načítanie dát ---

async function fetchAnalyticsData(accessToken: string): Promise<ReportData> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const OVERVIEW_METRICS = [
    { name: 'totalUsers' },
    { name: 'sessions' },
    { name: 'screenPageViews' },
    { name: 'averageSessionDuration' },
  ];

  // Všetky dotazy paralelne (2 separate pre deň-pred-dňom porovnanie)
  const [currentRes, previousRes, funnelRes, pagesRes, sourcesRes, devicesRes] = await Promise.all([
    // A1: Prehľad — včera
    runGA4Report(accessToken, {
      dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
      metrics: OVERVIEW_METRICS,
    }),

    // A2: Prehľad — predvčerom (porovnanie)
    runGA4Report(accessToken, {
      dateRanges: [{ startDate: '2daysAgo', endDate: '2daysAgo' }],
      metrics: OVERVIEW_METRICS,
    }),

    // B: E-commerce lievik (view_item → add_to_cart → begin_checkout → purchase)
    runGA4Report(accessToken, {
      dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: {
            values: ['view_item', 'add_to_cart', 'begin_checkout', 'purchase'],
          },
        },
      },
    }),

    // C: Top stránky
    runGA4Report(accessToken, {
      dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 7,
    }),

    // D: Zdroje návštevnosti
    runGA4Report(accessToken, {
      dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
      dimensions: [{ name: 'sessionSourceMedium' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 6,
    }),

    // E: Zariadenia
    runGA4Report(accessToken, {
      dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'totalUsers' }],
    }),

  ]);

  // F: Interná návštevnosť (team members) — samostatný try-catch,
  // pretože custom dimensions nemusia byť ešte zaregistrované v GA4 Admin
  let internalRes: any = { rows: [] };
  try {
    internalRes = await runGA4Report(accessToken, {
      dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
      dimensions: [{ name: 'customEvent:team_member' }],
      metrics: [{ name: 'totalUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
      dimensionFilter: {
        filter: {
          fieldName: 'customEvent:traffic_type',
          stringFilter: { matchType: 'EXACT', value: 'internal' },
        },
      },
    });
  } catch (err) {
    console.warn('[send-daily-analytics] Interná návštevnosť nedostupná (custom dimensions pravdepodobne nie sú zaregistrované):', String(err));
  }

  // Parsovanie prehľadu — bez dimenzií, vždy jeden riadok (totals)
  const parseOverview = (res: any): OverviewData => {
    const mv = (res.rows?.[0]?.metricValues) ?? [];
    return {
      totalUsers: pi(mv[0]?.value),
      sessions: pi(mv[1]?.value),
      screenPageViews: pi(mv[2]?.value),
      averageSessionDuration: pv(mv[3]?.value),
    };
  };

  const current = parseOverview(currentRes);
  const previous = parseOverview(previousRes);

  // Parsovanie lievika — mapovanie eventName → count
  const funnelMap: Record<string, number> = {};
  for (const row of (funnelRes.rows ?? [])) {
    const eventName = row.dimensionValues?.[0]?.value ?? '';
    funnelMap[eventName] = pi(row.metricValues?.[0]?.value);
  }
  const funnel: FunnelStep[] = [
    { label: 'Zobrazenie produktu', eventName: 'view_item', count: funnelMap['view_item'] ?? 0 },
    { label: 'Pridanie do košíka', eventName: 'add_to_cart', count: funnelMap['add_to_cart'] ?? 0 },
    { label: 'Začatie objednávky', eventName: 'begin_checkout', count: funnelMap['begin_checkout'] ?? 0 },
    { label: 'Dokončený nákup', eventName: 'purchase', count: funnelMap['purchase'] ?? 0 },
  ];

  // Top stránky
  const topPages: PageData[] = (pagesRes.rows ?? []).map((row: any) => ({
    path: row.dimensionValues?.[0]?.value ?? '/',
    views: pi(row.metricValues?.[0]?.value),
    users: pi(row.metricValues?.[1]?.value),
  }));

  // Zdroje
  const sources: SourceData[] = (sourcesRes.rows ?? []).map((row: any) => ({
    source: row.dimensionValues?.[0]?.value ?? '(direct)',
    sessions: pi(row.metricValues?.[0]?.value),
  }));

  // Zariadenia
  const deviceMap: Record<string, number> = {};
  for (const row of (devicesRes.rows ?? [])) {
    const cat = (row.dimensionValues?.[0]?.value ?? 'desktop').toLowerCase();
    deviceMap[cat] = pi(row.metricValues?.[0]?.value);
  }
  const desktop = deviceMap['desktop'] ?? 0;
  const mobile = deviceMap['mobile'] ?? 0;
  const tablet = deviceMap['tablet'] ?? 0;
  const devices: DeviceData = {
    desktop,
    mobile,
    tablet,
    total: desktop + mobile + tablet,
  };

  // Interná návštevnosť
  const internal: InternalVisit[] = (internalRes.rows ?? [])
    .map((row: any) => ({
      member: row.dimensionValues?.[0]?.value ?? '(neznámy)',
      users: pi(row.metricValues?.[0]?.value),
      sessions: pi(row.metricValues?.[1]?.value),
      pageViews: pi(row.metricValues?.[2]?.value),
    }))
    .filter((v: InternalVisit) => v.member !== '(not set)')
    .sort((a: InternalVisit, b: InternalVisit) => b.pageViews - a.pageViews);

  return { date: yesterday, current, previous, funnel, topPages, sources, devices, internal };
}

// --- Zostavenie emailu ---

function buildEmail(data: ReportData): { subject: string; html: string } {
  const { date, current, previous, funnel, topPages, sources, devices, internal } = data;

  const dateStr = formatDateSlovak(date);
  const dd = date.getDate().toString().padStart(2, '0');
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  const subject = `[Orostone] Denný report — ${dd}.${mm}.${yyyy} | ${formatNum(current.totalUsers)} návštevníkov`;

  // Lievik — horizontálne bary
  const funnelMax = funnel[0].count || 1;
  const funnelRows = funnel
    .map((step, i) => {
      const pct = Math.min(100, Math.round((step.count / funnelMax) * 100));
      const prevStep = i > 0 ? funnel[i - 1].count : null;
      const dropOff =
        prevStep !== null && prevStep > 0
          ? Math.round(((prevStep - step.count) / prevStep) * 100)
          : null;
      const dropOffHtml =
        dropOff !== null && dropOff > 0
          ? `&nbsp;<span style="color:#ef4444;font-size:10px;font-weight:400;">−${dropOff}% odchod</span>`
          : '';
      return `
        <tr>
          <td style="padding:8px 0 0 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="step-label" style="font-size:12px;font-weight:600;color:#555555;padding-bottom:4px;">
                  ${step.label}${dropOffHtml}
                </td>
                <td style="text-align:right;font-size:16px;font-weight:700;color:#1A1A1A;width:60px;vertical-align:bottom;padding-bottom:4px;" class="metric-val">
                  ${formatNum(step.count)}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding-bottom:6px;">
                  <div class="bar-bg" style="background-color:#f0f0f0;height:8px;border-radius:4px;overflow:hidden;">
                    <div style="width:${pct}%;height:8px;background-color:#ECD488;border-radius:4px;min-width:${step.count > 0 ? 4 : 0}px;"></div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    })
    .join('');

  // Top stránky
  const pagesRows = topPages
    .slice(0, 5)
    .map(
      (p, i) => `
      <tr style="border-bottom:1px solid #f5f5f5;">
        <td class="table-num" style="padding:7px 8px 7px 0;font-size:12px;color:#bbbbbb;width:20px;">${i + 1}</td>
        <td class="table-text" style="padding:7px 4px;font-size:11px;color:#555555;font-family:'Courier New',monospace;">${formatPath(p.path)}</td>
        <td class="table-val" style="padding:7px 0 7px 4px;text-align:right;font-size:13px;font-weight:700;color:#1A1A1A;white-space:nowrap;">${formatNum(p.views)}</td>
      </tr>`,
    )
    .join('');

  // Zdroje návštevnosti
  const sourcesRows = sources
    .slice(0, 5)
    .map(
      (s, i) => `
      <tr style="border-bottom:1px solid #f5f5f5;">
        <td class="table-num" style="padding:7px 8px 7px 0;font-size:12px;color:#bbbbbb;width:20px;">${i + 1}</td>
        <td class="table-text" style="padding:7px 4px;font-size:12px;color:#555555;">${escapeHtml(s.source)}</td>
        <td class="table-val" style="padding:7px 0 7px 4px;text-align:right;font-size:13px;font-weight:700;color:#1A1A1A;white-space:nowrap;">${formatNum(s.sessions)}</td>
      </tr>`,
    )
    .join('');

  // Zariadenia — percentá
  const dTotal = devices.total;
  const deskPct = dTotal > 0 ? Math.round((devices.desktop / dTotal) * 100) : 0;
  const mobPct = dTotal > 0 ? Math.round((devices.mobile / dTotal) * 100) : 0;
  const tabPct = dTotal > 0 ? Math.max(0, 100 - deskPct - mobPct) : 0;

  // Interná návštevnosť
  const internalRows = internal
    .map(
      (v) => `
      <tr style="border-bottom:1px solid #f5f5f5;">
        <td class="table-text" style="padding:7px 4px 7px 0;font-size:12px;color:#555555;font-weight:600;">${escapeHtml(v.member)}</td>
        <td class="table-val" style="padding:7px 8px;text-align:center;font-size:13px;font-weight:700;color:#1A1A1A;">${formatNum(v.sessions)}</td>
        <td class="table-val" style="padding:7px 0 7px 8px;text-align:right;font-size:13px;font-weight:700;color:#1A1A1A;">${formatNum(v.pageViews)}</td>
      </tr>`,
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="sk" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
  :root { color-scheme: light only; }
  body { margin: 0; padding: 0; }

  /* ── DARK MODE: Apple Mail, Outlook app ── */
  @media (prefers-color-scheme: dark) {
    .email-card   { background-color: #1e1e1e !important; }
    .email-body   { background-color: #1e1e1e !important; }
    .footer-cell  { background-color: #1e1e1e !important; border-top-color: #333333 !important; }
    .metric-val   { color: #ffffff !important; }
    .metric-label { color: #888888 !important; }
    .section-title { color: #f0f0f0 !important; }
    .step-label   { color: #cccccc !important; }
    .bar-bg       { background-color: #333333 !important; }
    .table-text   { color: #cccccc !important; }
    .table-val    { color: #ffffff !important; }
    .table-num    { color: #666666 !important; }
    .note-text    { color: #555555 !important; }
    .footer-text  { color: #888888 !important; }
    .footer-link  { color: #f0f0f0 !important; }
    .footer-small { color: #666666 !important; }
  }

  /* ── DARK MODE: Gmail (data-ogsc) ── */
  [data-ogsc] .email-card   { background-color: #1e1e1e !important; }
  [data-ogsc] .email-body   { background-color: #1e1e1e !important; }
  [data-ogsc] .footer-cell  { background-color: #1e1e1e !important; border-top-color: #333333 !important; }
  [data-ogsc] .metric-val   { color: #ffffff !important; }
  [data-ogsc] .metric-label { color: #888888 !important; }
  [data-ogsc] .section-title { color: #f0f0f0 !important; }
  [data-ogsc] .step-label   { color: #cccccc !important; }
  [data-ogsc] .bar-bg       { background-color: #333333 !important; }
  [data-ogsc] .table-text   { color: #cccccc !important; }
  [data-ogsc] .table-val    { color: #ffffff !important; }
  [data-ogsc] .table-num    { color: #666666 !important; }
  [data-ogsc] .note-text    { color: #555555 !important; }
  [data-ogsc] .footer-text  { color: #888888 !important; }
  [data-ogsc] .footer-link  { color: #f0f0f0 !important; }
  [data-ogsc] .footer-small { color: #666666 !important; }
</style>
</head>
<body style="font-family:'Montserrat',Arial,sans-serif;margin:0;padding:0;">

<!-- OUTER: zlaté pozadie -->
<table width="100%" cellpadding="0" cellspacing="0"
       style="background-color:#ECD488;
              background-image:url('https://www.orostone.sk/images/email-gold-bg.png');
              background-repeat:repeat;
              border-collapse:collapse;">
  <tr>
    <td style="background-color:#ECD488;
               background-image:url('https://www.orostone.sk/images/email-gold-bg.png');
               background-repeat:repeat;
               padding:36px 16px 40px 16px;">

      <!-- LOGO -->
      <div style="max-width:560px;margin:0 auto;text-align:center;padding-bottom:24px;">
        <img src="${LOGO_URL}" alt="Orostone" style="height:42px;display:inline-block;">
      </div>

      <!-- BIELA KARTA -->
      <div class="email-card" style="max-width:560px;margin:0 auto;border-radius:16px;overflow:hidden;background-color:#ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">

          <!-- HEADER: Dátum a nadpis -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:36px 40px 24px 40px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#ECD488;">
                Denný Report
              </p>
              <h1 class="metric-val" style="margin:0;font-size:22px;font-weight:700;color:#1A1A1A;letter-spacing:-0.01em;">
                ${dateStr}
              </h1>
            </td>
          </tr>

          <!-- ZLATÁ LINKA -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 40px 24px 40px;">
              <div style="height:2px;background-color:#ECD488;border-radius:1px;"></div>
            </td>
          </tr>

          <!-- 4 KĽÚČOVÉ METRIKY (2×2 mriežka) -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 28px 28px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- Návštevníci -->
                  <td width="50%" style="padding:12px 8px 12px 8px;text-align:center;border-right:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;">
                    <div class="metric-val" style="font-size:28px;font-weight:700;color:#1A1A1A;letter-spacing:-0.02em;">${formatNum(current.totalUsers)}</div>
                    <div class="metric-label" style="font-size:10px;color:#999999;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-top:3px;">Návštevníci</div>
                    <div style="margin-top:5px;">${trendHtml(current.totalUsers, previous.totalUsers)}</div>
                  </td>
                  <!-- Zobrazenia -->
                  <td width="50%" style="padding:12px 8px 12px 8px;text-align:center;border-bottom:1px solid #f0f0f0;">
                    <div class="metric-val" style="font-size:28px;font-weight:700;color:#1A1A1A;letter-spacing:-0.02em;">${formatNum(current.screenPageViews)}</div>
                    <div class="metric-label" style="font-size:10px;color:#999999;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-top:3px;">Zobrazenia</div>
                    <div style="margin-top:5px;">${trendHtml(current.screenPageViews, previous.screenPageViews)}</div>
                  </td>
                </tr>
                <tr>
                  <!-- Relácie -->
                  <td width="50%" style="padding:12px 8px 12px 8px;text-align:center;border-right:1px solid #f0f0f0;">
                    <div class="metric-val" style="font-size:28px;font-weight:700;color:#1A1A1A;letter-spacing:-0.02em;">${formatNum(current.sessions)}</div>
                    <div class="metric-label" style="font-size:10px;color:#999999;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-top:3px;">Relácie</div>
                    <div style="margin-top:5px;">${trendHtml(current.sessions, previous.sessions)}</div>
                  </td>
                  <!-- Priemerný čas -->
                  <td width="50%" style="padding:12px 8px 12px 8px;text-align:center;">
                    <div class="metric-val" style="font-size:28px;font-weight:700;color:#1A1A1A;letter-spacing:-0.02em;">${formatDuration(current.averageSessionDuration)}</div>
                    <div class="metric-label" style="font-size:10px;color:#999999;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-top:3px;">Priem. čas</div>
                    <div style="margin-top:5px;">${trendHtml(current.averageSessionDuration, previous.averageSessionDuration)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ZLATÁ LINKA -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 40px 24px 40px;">
              <div style="height:2px;background-color:#ECD488;border-radius:1px;"></div>
            </td>
          </tr>

          <!-- KONVERZNÝ LIEVIK -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 40px 28px 40px;">
              <p class="section-title" style="margin:0 0 14px 0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#1A1A1A;">
                Konverzný lievik
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${funnelRows}
              </table>
            </td>
          </tr>

          <!-- ZLATÁ LINKA -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 40px 24px 40px;">
              <div style="height:2px;background-color:#ECD488;border-radius:1px;"></div>
            </td>
          </tr>

          <!-- TOP STRÁNKY -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 40px 28px 40px;">
              <p class="section-title" style="margin:0 0 12px 0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#1A1A1A;">
                Top stránky
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr style="border-bottom:2px solid #f0f0f0;">
                  <td style="padding:0 8px 6px 0;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#cccccc;width:20px;">#</td>
                  <td style="padding:0 4px 6px 4px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#cccccc;">Stránka</td>
                  <td style="padding:0 0 6px 4px;text-align:right;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#cccccc;white-space:nowrap;">Zobrazenia</td>
                </tr>
                ${pagesRows || '<tr><td colspan="3" style="padding:12px 0;font-size:12px;color:#bbbbbb;text-align:center;">Žiadne dáta</td></tr>'}
              </table>
            </td>
          </tr>

          <!-- ZLATÁ LINKA -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 40px 24px 40px;">
              <div style="height:2px;background-color:#ECD488;border-radius:1px;"></div>
            </td>
          </tr>

          <!-- ZDROJE NÁVŠTEVNOSTI -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 40px 28px 40px;">
              <p class="section-title" style="margin:0 0 12px 0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#1A1A1A;">
                Zdroje návštevnosti
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr style="border-bottom:2px solid #f0f0f0;">
                  <td style="padding:0 8px 6px 0;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#cccccc;width:20px;">#</td>
                  <td style="padding:0 4px 6px 4px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#cccccc;">Zdroj / Médium</td>
                  <td style="padding:0 0 6px 4px;text-align:right;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#cccccc;white-space:nowrap;">Relácie</td>
                </tr>
                ${sourcesRows || '<tr><td colspan="3" style="padding:12px 0;font-size:12px;color:#bbbbbb;text-align:center;">Žiadne dáta</td></tr>'}
              </table>
            </td>
          </tr>

          <!-- ZLATÁ LINKA -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 40px 24px 40px;">
              <div style="height:2px;background-color:#ECD488;border-radius:1px;"></div>
            </td>
          </tr>

          <!-- ZARIADENIA -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 40px 36px 40px;">
              <p class="section-title" style="margin:0 0 14px 0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#1A1A1A;">
                Zariadenia
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="33%" style="text-align:center;padding:12px 6px;border:1px solid #f0f0f0;">
                    <div class="metric-val" style="font-size:22px;font-weight:700;color:#1A1A1A;">${deskPct}%</div>
                    <div class="metric-label" style="font-size:10px;color:#999999;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-top:3px;">Počítač</div>
                    <div class="table-num" style="font-size:11px;color:#cccccc;margin-top:2px;">${formatNum(devices.desktop)}</div>
                  </td>
                  <td width="2%"></td>
                  <td width="33%" style="text-align:center;padding:12px 6px;border:1px solid #f0f0f0;">
                    <div class="metric-val" style="font-size:22px;font-weight:700;color:#1A1A1A;">${mobPct}%</div>
                    <div class="metric-label" style="font-size:10px;color:#999999;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-top:3px;">Mobil</div>
                    <div class="table-num" style="font-size:11px;color:#cccccc;margin-top:2px;">${formatNum(devices.mobile)}</div>
                  </td>
                  <td width="2%"></td>
                  <td width="33%" style="text-align:center;padding:12px 6px;border:1px solid #f0f0f0;">
                    <div class="metric-val" style="font-size:22px;font-weight:700;color:#1A1A1A;">${tabPct}%</div>
                    <div class="metric-label" style="font-size:10px;color:#999999;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-top:3px;">Tablet</div>
                    <div class="table-num" style="font-size:11px;color:#cccccc;margin-top:2px;">${formatNum(devices.tablet)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ZLATÁ LINKA -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 40px 24px 40px;">
              <div style="height:2px;background-color:#ECD488;border-radius:1px;"></div>
            </td>
          </tr>

          <!-- INTERNÁ NÁVŠTEVNOSŤ -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 40px 28px 40px;">
              <p class="section-title" style="margin:0 0 4px 0;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#1A1A1A;">
                Interná návštevnosť
              </p>
              <p class="note-text" style="margin:0 0 12px 0;font-size:10px;color:#bbbbbb;font-weight:300;">
                Návštevy tímu Orostone (interný filter)
              </p>
              ${internal.length > 0 ? `
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr style="border-bottom:2px solid #f0f0f0;">
                  <td style="padding:0 4px 6px 0;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#cccccc;">Člen</td>
                  <td style="padding:0 8px 6px 8px;text-align:center;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#cccccc;">Relácie</td>
                  <td style="padding:0 0 6px 8px;text-align:right;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#cccccc;">Zobrazenia</td>
                </tr>
                ${internalRows}
              </table>` : `
              <p style="font-size:12px;color:#bbbbbb;text-align:center;padding:12px 0;">Žiadne interné návštevy</p>`}
            </td>
          </tr>

          <!-- POZNÁMKA -->
          <tr>
            <td class="email-body" style="background-color:#ffffff;padding:0 40px 20px 40px;text-align:center;">
              <p class="note-text" style="margin:0;font-size:10px;color:#dddddd;font-weight:300;letter-spacing:0.03em;">
                Dáta z Google Analytics 4 · Môžu byť oneskorené až 24 hodín
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="footer-cell" style="background-color:#ffffff;border-top:1px solid #eeeeee;padding:28px 40px 32px 40px;text-align:center;">
              <img src="${LOGO_CIRCLE_URL}" alt="Orostone"
                   style="height:32px;display:inline-block;margin-bottom:14px;opacity:0.5;">
              <p class="footer-text" style="margin:0 0 6px 0;font-size:12px;color:#999999;font-weight:300;">
                Orostone Analytics — automatický report
              </p>
              <p style="margin:0;font-size:12px;">
                <a href="mailto:info@orostone.sk" class="footer-link"
                   style="color:#1A1A1A;text-decoration:none;font-weight:600;">info@orostone.sk</a>
                &nbsp;·&nbsp;
                <a href="https://orostone.sk" class="footer-link"
                   style="color:#1A1A1A;text-decoration:none;font-weight:600;">orostone.sk</a>
              </p>
              <p class="footer-small" style="margin:10px 0 0 0;font-size:11px;color:#bbbbbb;font-weight:300;">
                Orostone s.r.o. &nbsp;·&nbsp; Landererova 8, 811 09 Bratislava
                &nbsp;·&nbsp; <a href="https://www.orostone.sk" class="footer-small"
                   style="color:#bbbbbb;text-decoration:none;">www.orostone.sk</a>
              </p>
            </td>
          </tr>

        </table>
      </div>
      <!-- /BIELA KARTA -->

    </td>
  </tr>
</table>

</body>
</html>`;

  return { subject, html };
}

// --- Odoslanie emailu cez Resend ---

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY nie je nastavený v Supabase secrets');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API chyba: ${err}`);
  }
  console.log(`[send-daily-analytics] Email odoslaný na ${to}`);
}

// --- Hlavný handler ---

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const accessToken = await getAccessToken();
    console.log('[send-daily-analytics] Access token OK, sťahujem GA4 dáta...');

    const data = await fetchAnalyticsData(accessToken);
    console.log(`[send-daily-analytics] Dáta načítané: ${data.current.totalUsers} návštevníkov`);

    const { subject, html } = buildEmail(data);
    await sendEmail(REPORT_TO, subject, html);

    return new Response(
      JSON.stringify({
        success: true,
        reportDate: data.date.toISOString().split('T')[0],
        metrics: {
          users: data.current.totalUsers,
          sessions: data.current.sessions,
          pageViews: data.current.screenPageViews,
          purchases: data.funnel[3].count,
        },
      }),
      { headers: corsHeaders },
    );
  } catch (err) {
    console.error('[send-daily-analytics] Chyba:', err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: corsHeaders },
    );
  }
});
