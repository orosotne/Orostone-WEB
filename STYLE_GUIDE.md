# Orostone Style Guide

Since October 2026 the site is moving to a new design system, taken from the approved homepage proposal. New and rewritten sections must use it. Pages that are not migrated yet still use the legacy patterns listed at the end of this file. When you make a small edit in such a page, match the surrounding style instead of mixing the two systems.

---

## Building blocks — `components/Design/`

| Component | Use |
|---|---|
| `Container` | The one content grid: max 1800 px, side margin `--os-edge` = `clamp(20px, 5.5vw, 104px)` |
| `Section` | A band with `tone` = `chalk` · `sand` · `graphite` · `gold` and vertical padding `--os-band` = `clamp(72px, 8vw, 120px)` |
| `SectionHeader` | Eyebrow + heading (`h2`, or the page `h1`) + lead; `onDark` on graphite |
| `Eyebrow` | Small uppercase label with a 28 px rule before it |
| `TextLink` | CTA level 3: underlined link with an arrow |
| `ActionButton` | CTA levels 1 (`gold`) and 2 (`dark`), plus `outline` and `light-outline` |
| `ArrowIcon` | The arrow used by links and buttons |

Reference sheet while developing: `npm run dev` → http://localhost:3000/_dizajn (not in production builds).

```tsx
<Section tone="sand">
  <Container>
    <SectionHeader eyebrow="Realizácie" title="Skutočné kuchyne." lead="Fotky sú z montáží u klientov." />
    {/* content */}
  </Container>
</Section>
```

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

Montserrat only (`font-sans`). Body text is 16 px, `font-light` (300), line height 1.6. Text smaller than 15 px uses `font-normal` (400) so it stays legible. The page H1 must be visibly larger than the H2s.

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

- Subtle and once: a reveal or a line-icon draw-in when an element enters the viewport.
- Continuous motion (marquee, rotating seal) pauses while it is off-screen.
- Respect `prefers-reduced-motion`. framer-motion follows it through `MotionConfig`; CSS and GSAP animations must check it themselves.

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

## Legacy patterns (being phased out)

These are still in pages that have not been migrated. Don't use them in new or rewritten sections.

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
