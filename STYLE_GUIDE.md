# Orostone Style Guide

Since October 2026 the site uses a new design system, taken from the approved homepage proposal. Every page uses it, the product detail (`/produkt/:id`, `pages/ShopProductDetail.tsx` + `components/ProductDetail/`) included: it was migrated in October 2026 (proposal A) and moved to `<Container>` and the type scale after the owner approved the wider layout. New and rewritten sections must use the system below.

---

## Building blocks — `components/Design/`

| Component | Use |
|---|---|
| `Container` | The one content grid: max 1800 px, side margin `--os-edge` = `clamp(20px, 5.5vw, 104px)` |
| `Section` | A band with `tone` = `chalk` · `sand` · `graphite` · `gold` and vertical padding `--os-band` = `clamp(72px, 8vw, 120px)` |
| `SectionHeader` | Eyebrow + heading (`h2`, or the page `h1`) + lead; `onDark` on graphite |
| `Eyebrow` | Small uppercase label with a 28 px rule before it; `as="h2"` where the label is the section heading (product detail sections) |
| `TextLink` | CTA level 3: underlined link with an arrow |
| `ActionButton` | CTA levels 1 (`gold`) and 2 (`dark`), plus `outline` and `light-outline` |
| `ArrowIcon` | The arrow used by links and buttons |
| `PageHero` + `PageHeroImage` | Opening band of a subpage: eyebrow, H1, lead, actions; photo (square source, 4:3 on phones) or any block in `media`; full-width content as children |
| `FeatureGrid` | Benefits or facts: hairline on top, optional line icon (draws itself in), H3 and a sentence |
| `StepList` | A real sequence: numbered steps with a graphite rule |
| `FaqList` | Questions as native `<details>` (answers stay in the DOM); `asHeadings` keeps questions as H3 where a page had them |
| `ArticleLinks` | Related blog articles as hairline cards |
| `GoldBand` | The gold end-of-page band: orientačná cena on oro-klient with `?od=<page>` and the phone number |
| `ResponsiveImage` | AVIF + WebP in two widths for images made by `temp_redizajn/page-assets.mjs` (`public/images/stranky/`) |
| `PageHero` `breadcrumb` | Visible breadcrumb in place of the eyebrow; mirror the page's BreadcrumbList JSON-LD |
| `chipClass(active)` | 44 px filter pill (blog categories, decor colours); graphite when active. Use buttons for in-page filters, links for indexable URLs |
| `LegalLayout` · `LegalSection` · `LegalClause` | Legal and policy documents: table of contents beside the text from 1280 px (sticky, marks the section in view), numbered articles, clauses with an optional `highlight`; `LEGAL_LINK` and `LEGAL_BOX` for links and set-apart blocks |

Reference sheet while developing: `npm run dev` → http://localhost:3000/_dizajn (not in production builds).

```tsx
<Section tone="sand">
  <Container>
    <SectionHeader eyebrow="Realizácie" title="Skutočné kuchyne." lead="Fotky sú z montáží u klientov." />
    {/* content */}
  </Container>
</Section>
```

### Blog

- `components/Blog/BlogCard` is the article card for the blog list and related articles.
- Article typography lives in the `PROSE` constant in `pages/BlogArticle.tsx`. It styles the HTML in `data/articles` and its blocks: `.article-tldr`, `-highlight`, `-tip`, `-quote`, `-figure`, `-case-study`, `-cta`.
- `.gold` in an article is graphite text on a gold marker, never gold text.
- Keep `keepUnits()` on headings so "20 mm" does not break.

### E-shop

- Product detail sections take a `tone` (`chalk` · `sand`); `ShopProductDetail` alternates them under the chalk hero, so neighbours never share a background. Their headings are `<Eyebrow as="h2">`, content sits in `<Container>`.
- The desktop gallery is sticky (`lg:sticky lg:top-[104px]`, main photo capped to the screen height, all thumbnails in one row). The page wrapper uses `overflow-x-clip`, never `overflow-x-hidden`, which would break `sticky`.
- On phones the add-to-cart buttons sit in the hero too; the sticky bar (price + „Do košíka") shows only while they are off screen.
- Add to cart answers at once: the button reads „Pridávam…" and ignores further taps until Shopify replied (adding a slab is not idempotent). Cart errors show in `components/UI/Toast` while the drawer is closed.

- `components/Shop/ProductCard` is the catalog card: the whole slab in its true proportion (Shopify images are 1536 × 2752 px), tone label · thickness · stock, price per m² and per slab, and an outline „Do košíka" button outside the link. The grid class lives in `components/Shop/catalogGrid.ts` so the skeletons match.
- Load Shopify images through `lib/shopifyImage.ts` (`shopifySized`, `shopifySrcSet`): the CDN resizes on `?width=`, the originals are ~250 KB each.
- Slab prices are whole euros in Shopify and `pricePerM2` is derived from them; round `calculateSlabPrice()` before showing it so it matches the cart.
- Cart drawer, checkout, thank-you page and cookie dialogs use chalk surfaces, graphite primary buttons and outline secondary ones; no gold buttons there. Every icon-only button has an `aria-label`; dialogs close with Escape.
- Short utility pages (404, empty cart, thank-you) fill the viewport: `min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100dvh-5rem)]`.

### Legal and info pages

`PageHero` → `LegalLayout` with the page's „Rýchla navigácia" items → `LegalSection`s. Keep the lawyer's wording, ids, numbering and tables exactly; restyle only. Notices are sand blocks with a graphite left rule (`border-l-2 border-brand-dark`), never amber, blue or green. No `GoldBand` on legal documents.

### Subpage pattern

`PageHero` → content sections alternating sand and chalk (at most one graphite) → a section call to action (one dark `ActionButton` + `TextLink`s) → `GoldBand`. FAQ sections put the `SectionHeader` left and the `FaqList` right from 1024 px. Tables: graphite rule under the header row, hairlines between rows, the Orostone column on a contrasting light background, never gold text.

---

## Colours

| Token | Hex | Use |
|---|---|---|
| `brand-light` (chalk) | #F9F9F7 | Default page and section background |
| `brand-sand` | #EFEDE6 | Alternate light sections |
| `brand-gray` | #F5F5F0 | Soft surfaces (hero backdrop, inputs) |
| `brand-dark` (graphite) | #1A1A1A | Text; at most one dark section per page |
| `brand-muted` | #5F5E5A | Secondary text and leads |
| `brand-line` | #E2E0D8 | Hairlines and dividers |
| `brand-gold` | #ECD488 | Accent only: gold CTA, gold band, small marks. Never body or heading text on a light background (contrast) |

---

## Typography

Montserrat only (`font-sans`). Body text is 16 px, `font-light` (300), line height 1.6. Text smaller than 15 px uses `font-normal` (400) so it stays legible; `index.css` sets this for `text-xs` and `text-sm` (an explicit `font-*` class still wins), other small sizes need `font-normal` in the class. The page H1 must be visibly larger than the H2s.

| Class | Size | Weight | Use |
|---|---|---|---|
| `text-os-h1` | `clamp(1.95rem, 2.7vw, 3.1rem)` | 600 | One per page |
| `text-os-h2` | `clamp(1.7rem, 2.2vw, 2.3rem)` | 600 | Section headings |
| `text-os-h3` | `clamp(1.2rem, 1.6vw, 1.45rem)` | 600 | Sub-headings and card titles |
| `text-os-lead` | `clamp(1rem, 1.2vw, 1.13rem)` | 300 | Intro under a heading, in `text-brand-muted` |
| `text-os-eyebrow` | 0.74rem, 0.2em tracking | 700 | Labels, through `<Eyebrow>` |

---

## CTA levels

1. **Gold `ActionButton`:** only in the header, the gold band at the end of a page and the mobile bar.
2. **Dark `ActionButton`:** the main action inside a section, at most one per section.
3. **`TextLink` with an arrow:** secondary actions.

Links to oro-klient.orostone.sk carry `?od=<miesto>`, never UTM parameters.

---

## Layout and rhythm

- Everything starts at `Container`'s left edge: header, hero text, sections, horizontal racks.
- Vertical padding comes from `Section`. Don't add `py-32` or similar on top.
- Light sections alternate chalk and sand, so two neighbours never share a background.
- Section headers are left-aligned.

---

## Motion

Based on Apple's fluid-interface principles (the `apple-design` skill in `.claude/skills/`).

- Subtle and once: a reveal or a line-icon draw-in when an element enters the viewport. Reveals use `REVEAL` / `revealAt(i)` from `lib/motion.ts` (0.35 s, 12 px); a row of line icons is fully drawn in about a second.
- Anything that opens or closes uses a spring from `lib/motion.ts`, not a fixed-length tween: `SPRING` (critically damped, no overshoot) by default, `SPRING_SHEET` for drawers, `SPRING_FLICK` (slight settle) only after a flick. Springs start from the current position and speed, so an interrupted animation never jumps.
- Enter and leave along the same path, from the element that opened it: the cart slides in from the right and out to the right, the search panel and the phone menu unroll from the header edge, the lightbox grows out of the photo and shrinks back into it, dropdowns scale from their trigger corner.
- Every control answers the press at once: `os-press` (scale 0.97 on `:active`, quick return; big option cards set `[--os-press-scale:0.99]`), links dim (`active:opacity-50`). Hover styles only on devices that hover: Tailwind has `future.hoverOnlyWhenSupported`, plain CSS puts `:hover` in `@media (hover: hover)`.
- Sheets follow the finger: the cart drawer drags closed (touch), the lightbox pages with a sideways flick and closes with an up/down flick. The decision uses the projected end point (`projectMomentum`), and the animation continues at the finger's speed.
- Sideways strips on phones snap (`snap-x snap-mandatory`) and fade their right edge (`os-fade-x`, with a spacer so the last item scrolls fully in).
- Continuous motion (marquee, rotating seal) pauses while it is off-screen.
- Respect `prefers-reduced-motion`. framer-motion follows it through `MotionConfig`; CSS and GSAP animations must check it themselves.
- Materials: the header is frosted glass while the page scrolls under it (`os-glass`, a child layer, never `backdrop-filter` on the header itself, which would trap the fixed drawer). `prefers-reduced-transparency` and `prefers-contrast: more` turn glass and every `backdrop-blur` solid.

---

## Photos

- Only real Orostone decors. Stone in a visualization comes from the supplier scan, never from an AI texture.
- Straight-on view, minimal perspective distortion, corrected verticals, clean geometric composition.
- Label visualizations ("Vizualizácia s dekorom X") and edited photos ("upravená fotografia realizácie").

---

## Accessibility

- Visible keyboard focus everywhere.
- Touch targets at least 44 px (`TextLink` enlarges its hit area on touch screens).
- Gold text on a light background fails contrast; use graphite.

---

## SEO and tracking guardrails

- Restyling must not change URLs, titles, meta descriptions, canonicals, JSON-LD, the text and order of H1/H2, `id` anchors, tables or internal links. The seo-diff check on every PR blocks removals.
- Keep every tracking call (`trackMetaEvent`, `trackGA4*`) when a component is restyled.
- `tel:` and `mailto:` links stay plain `<a href>`, because GTM click triggers depend on them.

---

## Legacy patterns (phased out)

None remain: the product detail moved to `<Container>` and the type scale in October 2026, and `components/UI/Button.tsx` was removed. Don't reintroduce them.

| Legacy | Replace with |
|---|---|
| Gold section label `text-xs font-bold text-brand-gold tracking-widest uppercase` | `<Eyebrow>` |
| `py-32`, `container mx-auto px-6` | `<Section>`, `<Container>` |
| Hero H1 `text-5xl md:text-6xl lg:text-7xl` with a gold italic accent line | `text-os-h1` |
| H2 `text-3xl md:text-4xl lg:text-5xl font-bold` | `text-os-h2` |
| Cards `bg-[#F9F9F7] rounded-3xl`, `components/UI/Button.tsx` | `ActionButton` and the new section patterns |
| Arbitrary pixel font sizes (`text-[10px]`, `text-[11px]`) | The type scale above |

---

*Last updated: October 2026*
