/**
 * SEO diff gate — compares the prerendered pages of two builds and lists
 * what changed. Anything REMOVED (page, H1, section, #jump anchor, table,
 * JSON-LD type, internal link, >20 % of text) or a changed canonical/robots
 * fails with exit code 1: removals need a deliberate human "yes" before merge.
 * Changed titles/descriptions/H1 texts are listed as warnings.
 *
 * Run:  npm run seo:diff -- <base dist/ or snapshot.json> <head dist/ or snapshot.json> [--md report.md]
 * CI:   .github/workflows/seo-diff.yml (base = main, head = pull request)
 */
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { snapshotDist, type PageSeo, type SeoSnapshot } from './lib/seoSnapshot';

const [baseArg, headArg, ...rest] = process.argv.slice(2);
if (!baseArg || !headArg) {
  console.error('Usage: tsx scripts/seo-diff.ts <base dist|json> <head dist|json> [--md out.md]');
  process.exit(2);
}
const mdIndex = rest.indexOf('--md');
const mdOut = mdIndex >= 0 ? rest[mdIndex + 1] : undefined;

const load = (p: string): SeoSnapshot =>
  statSync(p).isDirectory() ? snapshotDist(p) : (JSON.parse(readFileSync(p, 'utf-8')) as SeoSnapshot);

const base = load(baseArg);
const head = load(headArg);

/** A link change counts as site-wide when it hits this share of the pages it could hit (min. 5). */
const SITEWIDE_SHARE = 0.8;
const SITEWIDE_MIN_PAGES = 5;
/** Text loss that counts as a removal — relative and absolute, to skip noise on short pages. */
const WORD_LOSS_RATIO = 0.2;
const WORD_LOSS_MIN = 50;

const blocking: string[] = [];
const warnings: string[] = [];
const additions: string[] = [];

const q = (s: string): string => `„${s}“`;
const minus = (a: string[], b: string[]): string[] => a.filter((x) => !b.includes(x));

const baseRoutes = Object.keys(base);
const headRoutes = Object.keys(head);
const shared = baseRoutes.filter((r) => head[r]);

for (const route of minus(baseRoutes, headRoutes)) blocking.push(`\`${route}\` — stránka zmizla z buildu (potrebuje presmerovanie?)`);
const newRoutes = minus(headRoutes, baseRoutes);
if (newRoutes.length) additions.push(`Nové stránky: ${newRoutes.map((r) => `\`${r}\``).join(', ')}`);

type LinkKind = 'internalLinks' | 'navLinks';

/**
 * Link changes that hit (almost) every page they could hit are template
 * changes (navigation) — report them once instead of on every page.
 */
function linkChanges(kind: LinkKind, direction: 'added' | 'removed') {
  const had = (r: string, l: string) => base[r][kind].includes(l);
  const has = (r: string, l: string) => head[r][kind].includes(l);
  const all = new Set(shared.flatMap((r) => [...base[r][kind], ...head[r][kind]]));
  const sitewide: string[] = [];
  const perPage = new Map<string, string[]>();
  for (const l of all) {
    const candidates = shared.filter((r) => (direction === 'added' ? !had(r, l) : had(r, l)));
    const changed = candidates.filter((r) => (direction === 'added' ? has(r, l) : !has(r, l)));
    if (!changed.length) continue;
    if (candidates.length >= SITEWIDE_MIN_PAGES && changed.length >= candidates.length * SITEWIDE_SHARE) {
      sitewide.push(l);
    } else {
      for (const r of changed) perPage.set(r, [...(perPage.get(r) ?? []), l]);
    }
  }
  return { sitewide: sitewide.sort(), perPage };
}

const codeList = (links: string[]): string => links.map((l) => `\`${l}\``).join(', ');
const LINK_KINDS: [LinkKind, string][] = [
  ['internalLinks', 'odkazy v obsahu'],
  ['navLinks', 'odkazy v navigácii'],
];
const changes = {
  added: LINK_KINDS.map(([kind, label]) => ({ label, ...linkChanges(kind, 'added') })),
  removed: LINK_KINDS.map(([kind, label]) => ({ label, ...linkChanges(kind, 'removed') })),
};

for (const { label, sitewide } of changes.removed) {
  if (sitewide.length) blocking.push(`Všetky stránky — odstránené ${label}: ${codeList(sitewide)}`);
}
for (const { label, sitewide } of changes.added) {
  if (sitewide.length) additions.push(`Všetky stránky — nové ${label}: ${codeList(sitewide)}`);
}

/** Per-page link changes by kind, e.g. "odkazy v obsahu: `/cennik`". */
const pageLinkText = (direction: 'added' | 'removed', route: string): string[] =>
  changes[direction].flatMap(({ label, perPage }) => {
    const links = perPage.get(route);
    return links?.length ? [`${label}: ${codeList(links)}`] : [];
  });

for (const r of shared) {
  const b = base[r];
  const h = head[r];
  const at = `\`${r}\``;

  if (b.canonical !== h.canonical) blocking.push(`${at} — canonical: ${q(b.canonical)} → ${q(h.canonical)}`);
  if (b.robots !== h.robots) blocking.push(`${at} — meta robots: ${q(b.robots)} → ${q(h.robots)}`);
  if (b.h1.length && !h.h1.length) blocking.push(`${at} — chýba H1 (bolo ${q(b.h1[0])})`);

  const lostH2 = minus(b.h2, h.h2);
  if (lostH2.length) blocking.push(`${at} — odstránené sekcie (H2): ${lostH2.map(q).join(', ')}`);
  const lostIds = minus(b.ids, h.ids);
  if (lostIds.length) blocking.push(`${at} — odstránené kotvy (#jump linky): ${lostIds.map((i) => `#${i}`).join(', ')}`);
  if (h.tables < b.tables) blocking.push(`${at} — ubudli tabuľky: ${b.tables} → ${h.tables}`);
  const lostTypes = minus(b.jsonLdTypes, h.jsonLdTypes);
  if (lostTypes.length) blocking.push(`${at} — odstránené JSON-LD typy: ${lostTypes.join(', ')}`);
  for (const text of pageLinkText('removed', r)) blocking.push(`${at} — odstránené ${text}`);
  const wordLoss = b.words - h.words;
  if (wordLoss >= WORD_LOSS_MIN && wordLoss / b.words >= WORD_LOSS_RATIO) {
    blocking.push(`${at} — ubudlo ${Math.round((wordLoss / b.words) * 100)} % textu (${b.words} → ${h.words} slov)`);
  }

  if (b.title !== h.title) warnings.push(`${at} — title: ${q(b.title)} → ${q(h.title)}`);
  if (b.description !== h.description) warnings.push(`${at} — meta description: ${q(b.description)} → ${q(h.description)}`);
  if (b.h1.length && h.h1.length && b.h1[0] !== h.h1[0]) warnings.push(`${at} — H1: ${q(b.h1[0])} → ${q(h.h1[0])}`);
  if (h.h1.length > 1 && b.h1.length <= 1) warnings.push(`${at} — viac ako jedno H1 (${h.h1.length})`);

  const gained: string[] = [];
  const newH2 = minus(h.h2, b.h2);
  if (newH2.length) gained.push(`sekcie ${newH2.map(q).join(', ')}`);
  if (h.tables > b.tables) gained.push(`+${h.tables - b.tables} tabuľka`);
  const newTypes = minus(h.jsonLdTypes, b.jsonLdTypes);
  if (newTypes.length) gained.push(`JSON-LD ${newTypes.join(', ')}`);
  gained.push(...pageLinkText('added', r).map((text) => `nové ${text}`));
  if (h.words - b.words >= WORD_LOSS_MIN) gained.push(`+${h.words - b.words} slov`);
  if (gained.length) additions.push(`${at} — ${gained.join('; ')}`);
}

const section = (title: string, items: string[]): string =>
  items.length ? `\n### ${title}\n\n${items.map((i) => `- ${i}`).join('\n')}\n` : '';

const report = [
  '## SEO diff: main → tento PR',
  '',
  `**Výsledok:** ${blocking.length ? `❌ ${blocking.length}× odstránenie — vyžaduje vedomé schválenie pred merge` : '✅ nič sa neodstránilo'}` +
    ` · ⚠️ ${warnings.length}× zmena · ➕ ${additions.length}× pridané · ${headRoutes.length} stránok`,
  section('❌ Odstránené (schváliť alebo vrátiť)', blocking),
  section('⚠️ Zmenené (skontrolovať zámer)', warnings),
  section('➕ Pridané', additions),
].join('\n');

console.log(report);
if (mdOut) writeFileSync(mdOut, `${report}\n`, 'utf-8');
process.exit(blocking.length ? 1 : 0);
