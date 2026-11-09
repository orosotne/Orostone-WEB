import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

// The AI predajca chat (widget.js from index.html) floats its button bottom right, above every layer of the site.
// It reads two attributes on the page: it moves the button above an element marked data-aipredajca-avoid (and keeps
// its greeting and window below one at the top, the header) and keeps the button out of the way while an element
// marked data-aipredajca-hide is on the page.
const AVOID = 'data-aipredajca-avoid';
const HIDE = 'data-aipredajca-hide';

interface Marked {
  file: string;
  /** Text inside the element's opening tag that identifies it (once in the file, or `count` times). */
  marker: string;
  /** The attribute exactly as written on that tag. */
  attribute: string;
  /** Tags that carry the marker: the variants of one element (default 1). */
  count?: number;
}

// Bars and buttons at the bottom edge. Those that stay in the DOM while slid away or faded out carry the attribute
// only while they show; the cookie bar exists only while it shows.
const AVOIDED: Marked[] = [
  { file: 'components/Layout/MobileCtaBar.tsx', marker: 'fixed inset-x-0 bottom-0', attribute: `${AVOID}={visible ? '' : undefined}` },
  { file: 'pages/ShopProductDetail.tsx', marker: 'os-glass fixed inset-x-0 bottom-0', attribute: `${AVOID}={showStickyBar ? '' : undefined}` },
  { file: 'components/UI/CookieBanner.tsx', marker: 'aria-label="Súhlas s cookies"', attribute: `${AVOID}=""` },
  { file: 'pages/BlogArticle.tsx', marker: 'aria-label="Back to top"', attribute: `${AVOID}={backToTopShown ? '' : undefined}` },
  { file: 'components/Shop/SampleCartonTray.tsx', marker: "className={'sample-carton-tray'", attribute: `${AVOID}={docked && !compactDock ? '' : undefined}` },
  // At the top: the chat's greeting and window stay below the header
  { file: 'components/Layout/SiteHeader.tsx', marker: 'pt-[env(safe-area-inset-top,0px)] text-brand-dark', attribute: `${AVOID}=""` },
];

// Drawers, dialogs and lightboxes: the marked element is mounted only while the overlay is open.
const HIDDEN_UNDER: Marked[] = [
  { file: 'components/Cart/CartDrawer.tsx', marker: 'role="dialog"', attribute: `${HIDE}=""` },
  { file: 'components/Layout/SiteHeader.tsx', marker: 'id="site-drawer"', attribute: `${HIDE}=""` },
  { file: 'components/Layout/SiteHeader.tsx', marker: 'absolute inset-x-0 top-full', attribute: `${HIDE}=""` },
  // The desktop mega menu under the header, in both layouts (sintered stone, other categories)
  { file: 'components/Eshop/EshopMegaMenu.tsx', marker: 'absolute left-0 right-0 top-full z-50', attribute: `${HIDE}=""`, count: 2 },
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

/** The opening tags that carry `marker`: exactly `count` of them in the file. */
function tagsWithMarker(file: string, marker: string, count = 1): string[] {
  const source = readFileSync(file, 'utf8');
  const tags: string[] = [];
  for (let at = source.indexOf(marker); at >= 0; at = source.indexOf(marker, at + 1)) {
    const tag = openingTagAt(source, at);
    assert.ok(tag.includes(marker), `${file}: "${marker}" is not inside one opening tag`);
    tags.push(tag);
  }
  assert.ok(tags.length > 0, `${file}: "${marker}" not found`);
  assert.equal(tags.length, count, `${file}: "${marker}" found ${tags.length}×, expected ${count}×`);
  return tags;
}

function tagWithMarker(file: string, marker: string): string {
  return tagsWithMarker(file, marker)[0] as string;
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
  for (const { file, marker, attribute, count } of AVOIDED) {
    for (const tag of tagsWithMarker(file, marker, count)) assert.ok(tag.includes(attribute), `${file}: ${attribute} missing on the tag with "${marker}"`);
  }
});

test('drawers, dialogs, lightboxes and menus move the chat button out of the way while open', () => {
  for (const { file, marker, attribute, count } of HIDDEN_UNDER) {
    for (const tag of tagsWithMarker(file, marker, count)) assert.ok(tag.includes(attribute), `${file}: ${attribute} missing on the tag with "${marker}"`);
  }
});

test('/vzorky on a phone: the docked tray spans the width under "Pridať do výberu", so the chat button steps aside', () => {
  // Above the docked tray (avoid) the button would lie on the carousel's main button, which the dock keeps 12 px
  // above the tray. Where the dock spans the width (the tray's compact layout, max-width 640 px) it is a hide element.
  const file = 'components/Shop/SampleCartonTray.tsx';
  const tag = tagWithMarker(file, "className={'sample-carton-tray'");
  assert.ok(tag.includes(`${HIDE}={docked && compactDock ? '' : undefined}`), `${file}: the compact dock must hide the chat button`);
  assert.ok(tag.includes(`${AVOID}={docked && !compactDock ? '' : undefined}`), `${file}: a dock beside the corner keeps it above`);
  const source = readFileSync(file, 'utf8');
  assert.match(source, /const compactMobile = \(\) => innerWidth <= 640;/);
  assert.match(source, /setCompactDock\(isCompactDock\.current\)/);
  // the same breakpoint as the full-width dock in the tray's CSS
  assert.match(readFileSync('components/Shop/SampleCartonTray.css', 'utf8'), /@media\(max-width:640px\)\{[^\n]*\.sample-carton-tray\.is-docked\{right:auto;left:50%/);
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
