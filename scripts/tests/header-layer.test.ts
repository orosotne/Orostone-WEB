import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { headerLayerOpenNow, setHeaderLayerOpen, subscribeHeaderLayer } from '../../lib/headerLayer';

// On a phone the bars fixed to the bottom edge (MobileCtaBar „Vzorka zadarmo“, the product page's cart bar), the
// sample tray docked on /vzorky and the blog's back-to-top button lie above the header (z-[60] and 900 over its z-50;
// the button's z-50 comes after the header in the page). While the header's menu drawer or search results are open
// they step away, as the bars do for the open cart, or they would cover the drawer's bottom („Môj účet“, „Moje
// objednávky“) and the last search results.

/** The opening tag that carries `marker`: from its `<tagName` to the `>` alone on a line that closes the tag. */
function barTag(file: string, marker: string, tagName = 'div'): string {
  const source = readFileSync(file, 'utf8');
  const at = source.indexOf(marker);
  assert.ok(at >= 0, `${file}: "${marker}" not found`);
  const start = source.lastIndexOf('<' + tagName, at);
  const end = source.slice(at).search(/\n\s*>\n/);
  assert.ok(start >= 0 && end >= 0, `${file}: the tag with "${marker}" not found`);
  return source.slice(start, at + end);
}

test('the store tells its subscribers each time the drawer or the search results open or close', () => {
  setHeaderLayerOpen(false);
  const seen: boolean[] = [];
  const stop = subscribeHeaderLayer(() => seen.push(headerLayerOpenNow()));

  setHeaderLayerOpen(true);
  setHeaderLayerOpen(true); // no change, no call
  assert.equal(headerLayerOpenNow(), true);
  setHeaderLayerOpen(false);
  assert.deepEqual(seen, [true, false]);

  stop();
  setHeaderLayerOpen(true);
  assert.deepEqual(seen, [true, false], 'no calls after the subscription stopped');
  setHeaderLayerOpen(false);
});

test('SiteHeader sets the store from the drawer and the search results and clears it when it unmounts', () => {
  const source = readFileSync('components/Layout/SiteHeader.tsx', 'utf8');
  // The bare search field covers nothing and stays open while the page scrolls: only the results count
  assert.match(source, /const searchResultsShown = searchOpen && searchQuery\.length >= 2;/);
  assert.match(source, /\{searchResultsShown && \(/, 'the results render on the same condition');
  assert.match(source, /const phoneLayerOpen = drawerOpen \|\| searchResultsShown;/);
  assert.match(source, /useEffect\(\(\) => \{\s*setHeaderLayerOpen\(phoneLayerOpen\);\s*\}, \[phoneLayerOpen\]\);/);
  assert.match(source, /useEffect\(\(\) => \(\) => setHeaderLayerOpen\(false\), \[\]\);/);
});

test('the „Vzorka zadarmo“ bar slides away while a header layer is open and comes back with the scroll', () => {
  const file = 'components/Layout/MobileCtaBar.tsx';
  const source = readFileSync(file, 'utf8');
  assert.match(source, /const headerLayerOpen = useHeaderLayerOpen\(\);/);
  // The scroll position alone decides once the layer closes (the 350/400 px hysteresis is kept)
  assert.match(source, /setScrolledPast\(\(prev\) => \(prev \? y > 350 : y > 400\)\)/);
  assert.match(source, /const visible = scrolledPast && !headerLayerOpen;/);
  const tag = barTag(file, 'fixed inset-x-0 bottom-0');
  for (const attribute of ["${visible ? 'translate-y-0' : 'translate-y-[110%]'}", 'aria-hidden={!visible}', 'inert={!visible}', "data-aipredajca-avoid={visible ? '' : undefined}"]) {
    assert.ok(tag.includes(attribute), `${file}: ${attribute} missing on the bar`);
  }
});

test('the product page cart bar slides away while a header layer is open, as for the cart and the lightbox', () => {
  const file = 'pages/ShopProductDetail.tsx';
  const source = readFileSync(file, 'utf8');
  assert.match(source, /const headerLayerOpen = useHeaderLayerOpen\(\);/);
  assert.match(source, /const showStickyBar = !ctaVisible && !isCartOpen && !isLightboxOpen && !headerLayerOpen;/);
  // Called with the other hooks, before the early returns for loading and a missing product
  assert.ok(source.indexOf('useHeaderLayerOpen()') < source.indexOf('if (isLoading) return'), `${file}: hook after an early return`);
  const tag = barTag(file, 'os-glass fixed inset-x-0 bottom-0');
  for (const attribute of ["showStickyBar ? 'translate-y-0' : 'translate-y-[110%]'", 'aria-hidden={!showStickyBar}', 'inert={!showStickyBar}', "data-aipredajca-avoid={showStickyBar ? '' : undefined}"]) {
    assert.ok(tag.includes(attribute), `${file}: ${attribute} missing on the bar`);
  }
});

test('the blog back-to-top button fades away while a header layer is open', () => {
  const file = 'pages/BlogArticle.tsx';
  const source = readFileSync(file, 'utf8');
  assert.match(source, /const headerLayerOpen = useHeaderLayerOpen\(\);/);
  assert.match(source, /const backToTopShown = showBackToTop && !headerLayerOpen;/);
  // Called with the other hooks, before the early return for a missing article
  assert.ok(source.indexOf('useHeaderLayerOpen()') < source.indexOf('if (!article) {'), `${file}: hook after an early return`);
  const tag = barTag(file, 'aria-label="Back to top"', 'button');
  for (const attribute of ["backToTopShown ? 'translate-y-0 opacity-100' : 'pointer-events-none", 'tabIndex={backToTopShown ? 0 : -1}', "data-aipredajca-avoid={backToTopShown ? '' : undefined}"]) {
    assert.ok(tag.includes(attribute), `${file}: ${attribute} missing on the button`);
  }
  assert.ok(!/showBackToTop \?/.test(tag), `${file}: the button still shows by the scroll alone`);
});

test('every element fixed to the bottom edge at z-50 or above steps away for the header layers', () => {
  // A plain `fixed` utility (not `focus:fixed` …) together with a `bottom-*` one in the same class string, as in
  // chat-widget-layout.test.ts; its own z-index decides (a fixed z-50 after the header paints over the header too)
  const fixedAtBottom = /(?<![\w:-])fixed\b[^"'`]*?(?<![\w:-])bottom-/g;
  const zIndex = /(?<![\w:-])z-(?:(\d+)|\[(\d+)\])(?![\w-])/;
  // The cookie bar stays above everything on purpose: the consent must stay in view
  const allowed = new Set(['components/UI/CookieBanner.tsx']);
  const files = ['components', 'pages'].flatMap((dir) =>
    readdirSync(dir, { recursive: true, encoding: 'utf8' })
      .filter((name) => name.endsWith('.tsx'))
      .map((name) => join(dir, name)),
  );
  const above: string[] = [];
  const unhandled: string[] = [];
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(fixedAtBottom)) {
      // The class string around the match, up to the quotes (or backticks) that bound it
      const from = Math.max(source.lastIndexOf('"', match.index), source.lastIndexOf("'", match.index), source.lastIndexOf('`', match.index)) + 1;
      const rest = source.slice(match.index).search(/["'`]/);
      const classes = source.slice(from, rest < 0 ? undefined : match.index + rest);
      const z = classes.match(zIndex);
      if (!z || Number(z[1] ?? z[2]) < 50) continue;
      above.push(file);
      if (!allowed.has(file) && !source.includes('useHeaderLayerOpen()')) unhandled.push(`${file}: ${classes.slice(0, 80)}…`);
    }
  }
  for (const file of ['components/Layout/MobileCtaBar.tsx', 'pages/ShopProductDetail.tsx', 'pages/BlogArticle.tsx']) {
    assert.ok(above.includes(file), `${file}: not found, the pattern no longer matches`);
  }
  assert.deepEqual(unhandled, [], 'let them step away while useHeaderLayerOpen() is true, as in MobileCtaBar');
});

test('/vzorky: the docked sample tray (z-index 900) fades away under an open header layer', () => {
  const file = 'components/Shop/SampleCartonTray.tsx';
  const source = readFileSync(file, 'utf8');
  assert.match(source, /const headerLayerOpen = useHeaderLayerOpen\(\);/);
  assert.match(source, /const underHeaderLayer = docked && headerLayerOpen;/);
  const at = source.indexOf('<section ref={trayRef}');
  assert.ok(at >= 0, `${file}: the tray's <section> not found`);
  const tag = source.slice(at, source.indexOf('>\n', at));
  for (const attribute of ["(underHeaderLayer ? ' is-under-header-layer' : '')", 'aria-hidden={underHeaderLayer || undefined}', 'inert={underHeaderLayer || undefined}']) {
    assert.ok(tag.includes(attribute), `${file}: ${attribute} missing on the tray`);
  }
  // Only the docked tray: inline in the page flow it lies under the header's layers anyway
  assert.match(
    readFileSync('components/Shop/SampleCartonTray.css', 'utf8'),
    /\.sample-carton-tray\.is-docked\.is-under-header-layer\{opacity:0;visibility:hidden;/,
  );
});
