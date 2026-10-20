import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { headerLayerOpenNow, setHeaderLayerOpen, subscribeHeaderLayer } from '../../lib/headerLayer';

// On a phone the bars fixed to the bottom edge (MobileCtaBar „Vzorka zadarmo“, the product page's cart bar) and the
// sample tray docked on /vzorky lie above the header (z-[60] and 900 over its z-50). While the header's menu drawer or
// search panel is open they step away, as the bars do for the open cart, or they would cover the drawer's bottom
// („Môj účet“) and the last search results.

/** The opening tag that carries `marker`: from it to the `>` alone on a line that closes the tag. */
function barTag(file: string, marker: string): string {
  const source = readFileSync(file, 'utf8');
  const at = source.indexOf(marker);
  assert.ok(at >= 0, `${file}: "${marker}" not found`);
  const start = source.lastIndexOf('<div', at);
  const end = source.slice(at).search(/\n\s*>\n/);
  assert.ok(start >= 0 && end >= 0, `${file}: the tag with "${marker}" not found`);
  return source.slice(start, at + end);
}

test('the store tells its subscribers each time the drawer or the search panel opens or closes', () => {
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

test('SiteHeader sets the store from the drawer and the search panel and clears it when it unmounts', () => {
  const source = readFileSync('components/Layout/SiteHeader.tsx', 'utf8');
  assert.match(source, /const phoneLayerOpen = drawerOpen \|\| searchOpen;/);
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
