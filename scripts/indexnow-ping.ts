/**
 * IndexNow ping — submits every indexable URL to the IndexNow API
 * (consumed by Bing, which feeds ChatGPT Search / Copilot; Google ignores it).
 *
 * MANUAL, deliberate step — NOT part of `npm run build`. Run after deploying
 * notable content changes:
 *
 *   npm run indexnow
 *
 * The key file public/<key>.txt is served from the site root, which is how
 * IndexNow verifies domain ownership. No account or registration needed.
 */
import { buildRouteRegistry, BASE_URL } from './lib/routes';

const INDEXNOW_KEY = 'ca6cb33df671452d29a3242146ced80b';
const HOST = new URL(BASE_URL).host;

const urlList = buildRouteRegistry().map((r) =>
  r.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${r.path}`,
);

const payload = {
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
  urlList,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

if (res.ok || res.status === 202) {
  console.log(`✅ IndexNow: submitted ${urlList.length} URLs (HTTP ${res.status})`);
} else {
  console.error(`❌ IndexNow failed: HTTP ${res.status} ${await res.text()}`);
  process.exit(1);
}
