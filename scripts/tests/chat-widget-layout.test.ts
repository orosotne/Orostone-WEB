import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

// The AI predajca chat (widget.js from index.html) floats its button bottom right, above every layer of the site.
// It reads two attributes on the page: it moves the button above an element marked data-aipredajca-avoid and keeps
// the button out of the way while an element marked data-aipredajca-hide is on the page.
const AVOID = 'data-aipredajca-avoid';
const HIDE = 'data-aipredajca-hide';

interface Marked {
  file: string;
  /** Text inside the element's opening tag that identifies it (once in the file). */
  marker: string;
  /** The attribute exactly as written on that tag. */
  attribute: string;
}

// Bars and buttons at the bottom edge. Those that stay in the DOM while slid away or faded out carry the attribute
// only while they show; the cookie bar exists only while it shows.
const AVOIDED: Marked[] = [
  { file: 'components/Layout/MobileCtaBar.tsx', marker: 'fixed inset-x-0 bottom-0', attribute: `${AVOID}={visible ? '' : undefined}` },
  { file: 'pages/ShopProductDetail.tsx', marker: 'os-glass fixed inset-x-0 bottom-0', attribute: `${AVOID}={showStickyBar ? '' : undefined}` },
  { file: 'components/UI/CookieBanner.tsx', marker: 'aria-label="Súhlas s cookies"', attribute: `${AVOID}=""` },
  { file: 'pages/BlogArticle.tsx', marker: 'aria-label="Back to top"', attribute: `${AVOID}={showBackToTop ? '' : undefined}` },
  { file: 'components/Shop/SampleCartonTray.tsx', marker: "className={'sample-carton-tray'", attribute: `${AVOID}={docked ? '' : undefined}` },
];

// Drawers, dialogs and lightboxes: the marked element is mounted only while the overlay is open.
const HIDDEN_UNDER: Marked[] = [
  { file: 'components/Cart/CartDrawer.tsx', marker: 'role="dialog"', attribute: `${HIDE}=""` },
  { file: 'components/Layout/SiteHeader.tsx', marker: 'id="site-drawer"', attribute: `${HIDE}=""` },
  { file: 'components/Layout/SiteHeader.tsx', marker: 'absolute inset-x-0 top-full', attribute: `${HIDE}=""` },
  { file: 'components/UI/CookieSettings.tsx', marker: 'role="dialog"', attribute: `${HIDE}=""` },
  { file: 'components/UI/NewsletterPopup.tsx', marker: 'role="dialog"', attribute: `${HIDE}=""` },
  { file: 'components/UI/DiscountPopup.tsx', marker: 'role="dialog"', attribute: `${HIDE}=""` },
  { file: 'components/ProductDetail/ProductLightbox.tsx', marker: 'role="dialog"', attribute: `${HIDE}=""` },
  { file: 'components/ProductDetail/ArchitectBlock.tsx', marker: 'role="dialog"', attribute: `${HIDE}=""` },
  { file: 'components/ProductDetail/MaterialPerspectivesViewer.tsx', marker: 'fixed inset-0 z-50 flex items-center justify-center', attribute: `${HIDE}=""` },
  { file: 'pages/Realizacie.tsx', marker: 'role="dialog"', attribute: `${HIDE}=""` },
];

/**
 * The JSX opening tag around `index`: from its `<Name` to the `>` that closes it. Braces, quoted values and `//`
 * comments between attributes are skipped, so `=>` or `>` inside them do not end the tag.
 */
function openingTagAt(source: string, index: number): string {
  let start = index;
  while (start >= 0 && !(source[start] === '<' && /[A-Za-z]/.test(source[start + 1] ?? ''))) start--;
  assert.ok(start >= 0, 'no opening tag before the marker');
  let depth = 0;
  let quote = '';
  for (let i = start + 1; i < source.length; i++) {
    const c = source[i];
    if (quote) {
      if (c === quote) quote = '';
    } else if (depth > 0) {
      if (c === '{') depth++;
      else if (c === '}') depth--;
    } else if (c === '/' && source[i + 1] === '/') {
      i = source.indexOf('\n', i);
      if (i < 0) break;
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (c === '{') {
      depth++;
    } else if (c === '>') {
      return source.slice(start, i + 1);
    }
  }
  assert.fail('opening tag is not closed');
}

function tagWithMarker(file: string, marker: string): string {
  const source = readFileSync(file, 'utf8');
  const at = source.indexOf(marker);
  assert.ok(at >= 0, `${file}: "${marker}" not found`);
  assert.equal(source.indexOf(marker, at + 1), -1, `${file}: "${marker}" is not unique`);
  const tag = openingTagAt(source, at);
  assert.ok(tag.includes(marker), `${file}: "${marker}" is not inside one opening tag`);
  return tag;
}

test('the tag reader keeps arrows, comments and quoted ">" inside the tag', () => {
  const source = `<m.div
    onClick={() => close()}
    // a comment with "quotes" and a > sign
    className="fixed [&>svg]:h-4"
    data-x={open ? '' : undefined}
  >child</m.div>`;
  const tag = openingTagAt(source, source.indexOf('className'));
  assert.ok(tag.endsWith(`data-x={open ? '' : undefined}\n  >`));
});

test('bars at the bottom edge keep the chat button above them', () => {
  for (const { file, marker, attribute } of AVOIDED) {
    assert.ok(tagWithMarker(file, marker).includes(attribute), `${file}: ${attribute} missing on the tag with "${marker}"`);
  }
});

test('drawers, dialogs and lightboxes move the chat button out of the way while open', () => {
  for (const { file, marker, attribute } of HIDDEN_UNDER) {
    assert.ok(tagWithMarker(file, marker).includes(attribute), `${file}: ${attribute} missing on the tag with "${marker}"`);
  }
});

test('every element fixed to the bottom edge is marked for the chat button', () => {
  // A plain `fixed` utility (not `focus:fixed` …) together with a `bottom-*` one in the same tag
  const fixedAtBottom = /(?<![\w:-])fixed\b[^"'`]*?(?<![\w:-])bottom-/g;
  const files = ['components', 'pages'].flatMap((dir) =>
    readdirSync(dir, { recursive: true, encoding: 'utf8' })
      .filter((name) => name.endsWith('.tsx'))
      .map((name) => join(dir, name)),
  );
  const unmarked: string[] = [];
  let found = 0;
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(fixedAtBottom)) {
      found++;
      const tag = openingTagAt(source, match.index);
      if (!tag.includes(AVOID) && !tag.includes(HIDE)) unmarked.push(`${file}: ${tag.slice(0, 80)}…`);
    }
  }
  assert.ok(found >= 5, `only ${found} elements fixed to the bottom edge found, the pattern no longer matches`);
  assert.deepEqual(unmarked, [], 'mark them with data-aipredajca-avoid (bars) or data-aipredajca-hide (overlays)');
});
