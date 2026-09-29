/**
 * SEO snapshot of a built dist/ — one record per prerendered page.
 * Consumed by scripts/seo-diff.ts, which compares the PR build against main.
 *
 * Regex-based on purpose: the HTML comes from our own prerender templates
 * (same approach as validate-dist.ts), so no HTML parser dependency is needed.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export interface PageSeo {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  h1: string[];
  h2: string[];
  /** id="…" anchors inside the page content — Google shows them as #jump links. */
  ids: string[];
  tables: number;
  jsonLdTypes: string[];
  /** Links in the page content — the contextual links that carry topic signals. */
  internalLinks: string[];
  /** Links inside <nav> (site navigation, breadcrumbs). */
  navLinks: string[];
  words: number;
}

export type SeoSnapshot = Record<string, PageSeo>;

const ORIGIN = 'https://orostone.sk';

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'",
  '&lt;': '<',
  '&gt;': '>',
  '&nbsp;': ' ',
  '&rsaquo;': '›',
  '&middot;': '·',
};

const decode = (s: string): string => s.replace(/&(amp|quot|#39|lt|gt|nbsp|rsaquo|middot);/g, (m) => ENTITIES[m] ?? m);

const toText = (html: string): string =>
  decode(html.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();

const allMatches = (html: string, re: RegExp): string[] => [...html.matchAll(re)].map((m) => m[1]);

const uniqueSorted = (values: Iterable<string>): string[] => [...new Set(values)].sort();

function collectTypes(node: unknown, out: Set<string>): void {
  if (Array.isArray(node)) {
    node.forEach((n) => collectTypes(n, out));
  } else if (node && typeof node === 'object') {
    const type = (node as Record<string, unknown>)['@type'];
    if (typeof type === 'string') out.add(type);
    if (Array.isArray(type)) type.forEach((t) => typeof t === 'string' && out.add(t));
    Object.values(node).forEach((v) => collectTypes(v, out));
  }
}

function internalPath(href: string): string | null {
  const url = decode(href.trim());
  const path = url.startsWith(ORIGIN) ? url.slice(ORIGIN.length) || '/' : url;
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  const clean = path.split('#')[0].split('?')[0];
  return clean.length > 1 ? clean.replace(/\/+$/, '') : '/';
}

export function snapshotPage(html: string): PageSeo {
  const headEnd = html.indexOf('</head>');
  const head = headEnd >= 0 ? html.slice(0, headEnd) : html;
  const rootStart = html.indexOf('<div id="root">');
  const body = rootStart >= 0 ? html.slice(rootStart) : html.slice(headEnd);

  const metaContent = (name: string): string => {
    const tag = head.match(new RegExp(`<meta[^>]+name="${name}"[^>]*>`, 'i'))?.[0] ?? '';
    return decode(tag.match(/content="([^"]*)"/i)?.[1] ?? '');
  };

  const types = new Set<string>();
  for (const block of allMatches(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      collectTypes(JSON.parse(block), types);
    } catch {
      types.add('INVALID_JSON_LD');
    }
  }

  const navRe = /<nav\b[^>]*>[\s\S]*?<\/nav>/gi;
  const linksIn = (html: string): string[] =>
    uniqueSorted(
      allMatches(html, /<a\b[^>]*\bhref="([^"]*)"/gi)
        .map(internalPath)
        .filter((p): p is string => p !== null),
    );

  return {
    title: decode(head.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '').trim(),
    description: metaContent('description'),
    canonical: decode(head.match(/<link rel="canonical" href="([^"]*)"/i)?.[1] ?? ''),
    robots: metaContent('robots'),
    h1: allMatches(body, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map(toText),
    h2: allMatches(body, /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi).map(toText),
    ids: uniqueSorted(allMatches(body, /\bid="([^"]+)"/g).filter((id) => id !== 'root')),
    tables: (body.match(/<table\b/gi) ?? []).length,
    jsonLdTypes: uniqueSorted(types),
    internalLinks: linksIn(body.replace(navRe, '')),
    navLinks: linksIn((body.match(navRe) ?? []).join('')),
    words: toText(body).split(' ').filter(Boolean).length,
  };
}

/** Walks dist/ and snapshots every prerendered page (…/index.html → route). */
export function snapshotDist(distDir: string): SeoSnapshot {
  const snapshot: SeoSnapshot = {};
  const walk = (dir: string): void => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (name !== 'assets') walk(full);
      } else if (name === 'index.html') {
        const rel = relative(distDir, dir).split(sep).join('/');
        snapshot[rel ? `/${rel}` : '/'] = snapshotPage(readFileSync(full, 'utf-8'));
      }
    }
  };
  walk(distDir);
  return Object.fromEntries(Object.entries(snapshot).sort(([a], [b]) => a.localeCompare(b)));
}
