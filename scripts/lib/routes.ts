/**
 * Canonical route registry — the ONE enumeration of every indexable URL.
 * Composed from the same data modules the prerender iterates, so the
 * sitemap/llms generator (generate-seo-artifacts.ts) and the build validator
 * (validate-dist.ts) can never drift from what is actually prerendered.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { INFO_PAGES, COLOR_SUBCATEGORIES } from '../../data/prerenderPages';
import { getPublishedArticles } from '../../data/blogArticles';

export const BASE_URL = 'https://orostone.sk';

export type RouteKind =
  | 'home'
  | 'blog-listing'
  | 'article'
  | 'product'
  | 'category'
  | 'color'
  | 'info'
  | 'static';

export interface RouteEntry {
  /** Route path, e.g. '/blog/ako-cistit-sinterovany-kamen' */
  path: string;
  kind: RouteKind;
  /** Only set where a real content date exists (blog articles). */
  lastmod?: string;
  changefreq: string;
  priority: string;
  /** The underlying data object (article / product / info page / color). */
  ref?: unknown;
}

export function loadFallbackProducts(): any[] {
  return JSON.parse(
    readFileSync(resolve(process.cwd(), 'data/shop-products-fallback.json'), 'utf-8'),
  );
}

export function buildRouteRegistry(): RouteEntry[] {
  const products = loadFallbackProducts();
  const articles = getPublishedArticles();

  return [
    { path: '/', kind: 'home', changefreq: 'weekly', priority: '1.0' },
    { path: '/blog', kind: 'blog-listing', changefreq: 'weekly', priority: '0.8' },
    ...articles.map(
      (a): RouteEntry => ({
        path: `/blog/${a.slug}`,
        kind: 'article',
        lastmod: a.lastModified || a.publishDate,
        changefreq: 'monthly',
        priority: '0.9',
        ref: a,
      }),
    ),
    ...products.map(
      (p): RouteEntry => ({
        path: `/produkt/${p.id}`,
        kind: 'product',
        changefreq: 'monthly',
        priority: '0.8',
        ref: p,
      }),
    ),
    { path: '/kategoria/sintered-stone', kind: 'category', changefreq: 'weekly', priority: '0.8' },
    ...COLOR_SUBCATEGORIES.map(
      (c): RouteEntry => ({
        path: `/kategoria/sintered-stone/${c.slug}`,
        kind: 'color',
        changefreq: 'weekly',
        priority: '0.6',
        ref: c,
      }),
    ),
    ...INFO_PAGES.map(
      (p): RouteEntry => ({
        path: p.route,
        kind: 'info',
        changefreq: p.changefreq,
        priority: p.priority,
        ref: p,
      }),
    ),
    { path: '/vzorky', kind: 'static', changefreq: 'monthly', priority: '0.6' },
    { path: '/cennik', kind: 'static', changefreq: 'weekly', priority: '0.9' },
    { path: '/kuchyne', kind: 'static', changefreq: 'monthly', priority: '0.8' },
    { path: '/realizacie', kind: 'static', changefreq: 'monthly', priority: '0.7' },
    { path: '/kariera', kind: 'static', changefreq: 'monthly', priority: '0.5' },
  ];
}
