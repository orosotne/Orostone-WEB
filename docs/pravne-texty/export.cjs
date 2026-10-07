// Exports the visible text of the legal pages to Markdown for the Slovak language review (texty/*.md).
// The pages are the source of truth; this snapshot only lets Codex review the whole wording in a pull request.
//
// Usage: npm run build, then
//   PUPPETEER_CORE=<path to puppeteer-core> CHROME=<path to Chrome> node docs/pravne-texty/export.cjs dist
// (puppeteer-core is not a project dependency; any local copy works.)
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require(process.env.PUPPETEER_CORE || 'puppeteer-core');

const DIST = path.resolve(process.argv[2] || 'dist');
const OUT = path.join(__dirname, 'texty');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PAGES = [
  ['vop', '/vop', 'pages/VOP.tsx'],
  ['ochrana-sukromia', '/ochrana-sukromia', 'pages/PrivacyPolicy.tsx'],
  ['cookies', '/cookies', 'pages/CookiesPolicy.tsx'],
  ['odstupenie-od-zmluvy', '/odstupenie-od-zmluvy', 'pages/OdstupeniOdZmluvy.tsx'],
  ['reklamacie', '/reklamacie', 'pages/ReklamacieAVratenie.tsx'],
  ['doprava', '/doprava', 'pages/DopravaAPlatba.tsx'],
  ['podmienky-rezervacie-ceny', '/podmienky-rezervacie-ceny', 'pages/PodmienkyRezervaceCeny.tsx'],
];
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.png': 'image/png' };

function serve(port) {
  return http.createServer((req, resp) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    let file = null;
    for (const c of [path.join(DIST, p), path.join(DIST, p, 'index.html')]) {
      try { if (fs.statSync(c).isFile()) { file = c; break; } } catch { /* next */ }
    }
    if (!file) {
      if (path.extname(p)) { resp.writeHead(404); resp.end(); return; }
      file = path.join(DIST, 'index.html');
    }
    resp.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(resp);
  }).listen(port, '127.0.0.1');
}

// Runs in the page: turns <main> into Markdown (headings, numbered clauses, lists, tables, paragraphs).
function mainToMarkdown() {
  const out = [];
  const clean = (s) => s.replace(/ /g, ' ').replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, ' ').trim();
  const text = (el) => clean(el.innerText || '');
  const isNumber = (el) => el && el.tagName === 'SPAN' && /^\d+(\.\d+)*\.?$/.test(el.textContent.trim());
  const BLOCK = new Set(['DIV', 'P', 'UL', 'OL', 'TABLE', 'H1', 'H2', 'H3', 'H4', 'H5', 'SECTION', 'ARTICLE', 'LI', 'FORM', 'LABEL', 'BUTTON', 'FIGURE', 'DL']);
  const hidden = (el) => { const s = getComputedStyle(el); return s.display === 'none' || s.visibility === 'hidden' || el.getAttribute('aria-hidden') === 'true'; };
  const table = (el) => {
    const rows = [...el.querySelectorAll('tr')].map((tr) => [...tr.children].map((c) => text(c).replace(/\|/g, '/')));
    if (!rows.length) return;
    out.push(['| ' + rows[0].join(' | ') + ' |', '|' + rows[0].map(() => '---|').join(''), ...rows.slice(1).map((r) => '| ' + r.join(' | ') + ' |')].join('\n'));
  };
  const walk = (el) => {
    if (el.nodeType === 3) { const t = clean(el.textContent); if (t) out.push(t); return; }
    if (el.nodeType !== 1 || hidden(el)) return;
    const tag = el.tagName;
    if (['ASIDE', 'NAV', 'SCRIPT', 'STYLE', 'SVG', 'NOSCRIPT'].includes(tag) || el.classList.contains('sr-only')) return;
    if (/^H[1-6]$/.test(tag)) { out.push('#'.repeat(+tag[1]) + ' ' + text(el)); return; }
    if (tag === 'TABLE') { table(el); return; }
    if (tag === 'UL' || tag === 'OL') {
      for (const li of el.children) if (li.tagName === 'LI' && !hidden(li)) out.push('- ' + text(li).replace(/^[•✦—–-]\s*/, ''));
      return;
    }
    const kids = [...el.children];
    // Numbered article: "1." + heading (+ subtitle) → "## 1. Heading"
    if (isNumber(kids[0]) && kids[1] && kids[1].querySelector('h2, h3')) {
      const h = kids[1].querySelector('h2, h3');
      out.push(`${h.tagName === 'H2' ? '##' : '###'} ${kids[0].textContent.trim()} ${text(h)}`);
      for (const k of kids[1].childNodes) if (k !== h) walk(k);
      return;
    }
    // Numbered clause: "1.1" + text → "**1.1** text"
    if (isNumber(kids[0]) && kids.length >= 2 && !el.querySelector('h1, h2, h3, table, ul, ol')) {
      out.push(`**${kids[0].textContent.trim()}** ${kids.slice(1).map(text).join(' ')}`);
      return;
    }
    if (!kids.some((k) => BLOCK.has(k.tagName))) { const t = text(el); if (t) out.push(t); return; }
    for (const k of el.childNodes) walk(k);
  };
  walk(document.querySelector('main'));
  return out.filter((line, i) => line !== out[i - 1]).join('\n\n');
}

(async () => {
  const server = serve(4180);
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  await page.setRequestInterception(true);
  // Never send analytics while exporting
  page.on('request', (r) => (/google|facebook|doubleclick|_vercel/.test(r.url()) ? r.abort() : r.continue()));
  await page.evaluateOnNewDocument(() => {
    try { localStorage.setItem('orostone-cookies', JSON.stringify({ necessary: true, analytics: false, marketing: false })); } catch { /* ignore */ }
  });
  fs.mkdirSync(OUT, { recursive: true });
  for (const [slug, route, source] of PAGES) {
    await page.goto(`http://127.0.0.1:4180${route}`, { waitUntil: 'load' });
    await new Promise((r) => setTimeout(r, 2000));
    const md = await page.evaluate(mainToMarkdown);
    const header = `<!-- Kópia textu z https://orostone.sk${route} na jazykovú kontrolu. Zdroj je ${source}; súbor sa neupravuje ručne, vygeneruje ho docs/pravne-texty/export.cjs. -->\n\n`;
    fs.writeFileSync(path.join(OUT, `${slug}.md`), header + md + '\n');
    console.log(`${slug}.md: ${md.split(/\s+/).length} slov`);
  }
  await browser.close();
  server.close();
})();
