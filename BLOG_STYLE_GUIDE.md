# OROSTONE Blog Article Style Guide

> **This is the single source of truth for creating, editing, and maintaining all OROSTONE blog articles.**
> Read this file IN FULL before making ANY changes to blog articles — whether creating new ones, editing existing ones, or updating old articles for consistency.

---

## Table of Contents

1. [Data Structure](#1-data-structure)
2. [Article Content Structure](#2-article-content-structure-mandatory-order)
3. [HTML Content Blocks Reference](#3-html-content-blocks--complete-reference)
4. [Brand Colors](#4-brand-colors)
5. [Typography and Spacing](#5-typography-and-spacing-rules)
6. [Image Generation Workflow](#6-image-generation-workflow)
7. [Gold Highlighting Rules](#7-gold-highlighting-rules)
8. [SEO and Structural Requirements](#8-seo-and-structural-requirements)
9. [Component Features (Auto-Rendered)](#9-component-features-auto-rendered-by-blogarticletsx)
10. [Consistency Checklist](#10-consistency-checklist)
11. [Current Article Status](#11-current-article-status)

---

## 1. Data Structure

### TypeScript Types

All types are defined in `data/blogTypes.ts`.

```typescript
export type BlogCategory =
  | 'risk-killers'
  | 'trust-builders'
  | 'identity-aesthetics'
  | 'friction-removers'
  | 'value-comparisons'
  | 'control-care';

export type BlogLanguage = 'sk' | 'en';

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  category: BlogCategory;
  publishDate: string;        // ISO format: '2026-02-10'
  readTimeMinutes: number;
  heroImage: string;           // '/images/blog/slug-name.webp'
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  tags: string[];              // 4-6 Slovak tags
  sk: {
    title: string;
    subtitle: string;
    excerpt: string;
    directAnswer: string;      // 2-3 sentence direct answer for AI/featured snippets
    content: string;           // Full HTML content (template literal)
    faqs: BlogFAQ[];           // 10-15 FAQ pairs
  };
  en: {
    title: string;
    subtitle: string;
    excerpt: string;
    directAnswer: string;
    content: string;
    faqs: BlogFAQ[];
  };
}
```

### Category Labels

| Category Key | SK Label | EN Label |
|---|---|---|
| `risk-killers` | Riziká a prevencia | Risk Prevention |
| `trust-builders` | Dôvera a kvalita | Trust & Quality |
| `identity-aesthetics` | Dizajn a estetika | Design & Aesthetics |
| `friction-removers` | Proces a pohodlie | Process & Convenience |
| `value-comparisons` | Hodnota a porovnania | Value & Comparisons |
| `control-care` | Údržba a starostlivosť | Care & Maintenance |

### Author

Always use the shared constant:

```typescript
import { BlogArticle, BLOG_AUTHOR_OROSTONE } from '../blogTypes';

// BLOG_AUTHOR_OROSTONE = {
//   name: 'OROSTONE tím',
//   role: 'Odborníci na sinterovaný kameň',
//   avatar: '/images/logo-circle.png',
// };
```

### File Naming Convention

- Article data files: `data/articles/article-XX-short-name.ts`
  - XX = two-digit number (01, 02, ... 21)
  - short-name = kebab-case descriptor (e.g., `problems`, `comparison`, `matte-vs-polished`)
- Export name: `ARTICLE_XX` (e.g., `ARTICLE_01`, `ARTICLE_06`)
- Every new article must be imported and added to the `BLOG_ARTICLES` array in `data/blogArticles.ts`

### Slug Convention

- Slovak slug: `problemy-so-sinterovanym-kamenom` (no diacritics in URL)
- Must be unique across all articles

---

## 2. Article Content Structure (mandatory order)

Every article's `content` field must follow this structure. Items marked with (R) are **required**; items marked with (O) are optional but strongly recommended.

```
1. (R) TLDR label          — <p class="article-tldr-label">
2. (R) TLDR bullet list    — <ul class="article-tldr"> with 3-5 <li>
3. (R) Opening paragraphs  — 2-3 paragraphs with gold highlights
4. (R) Editorial quote      — <div class="article-quote">
5. (R) Hero figure          — <figure class="article-figure"> (first image)
6. (R) H2 sections          — 5-8 H2s, each with id attribute
7.     Within H2 sections, use freely:
       - H3 sub-sections
       - Paragraphs with gold highlights
       - article-highlight boxes (at least 1 per article)
       - article-tip boxes (at least 1 per article)
       - article-figure images (4-6 total across article)
       - Regular <ul> lists
8. (R) Mid-article CTA      — <div class="article-cta"> at ~40-60% of content
9. (O) Case study           — <div class="article-case-study"> (if applicable)
10.(R) Final CTA tip         — <div class="article-tip"> with <a class="tip-btn">
```

### Language Parity

Both SK and EN content must have **identical structure** — same number of sections, same HTML blocks in the same order, same images. Only the text differs.

---

## 3. HTML Content Blocks — Complete Reference

### 3.1 TLDR Label + List

Always the very first thing in the article content.

```html
<p class="article-tldr-label">Zhrnutie článku</p>   <!-- SK -->
<p class="article-tldr-label">Key takeaways</p>      <!-- EN -->
<ul class="article-tldr">
  <li>First key point — concise, bold statement</li>
  <li>Second key point — include specific numbers if possible</li>
  <li>Third key point — actionable insight</li>
  <li>Fourth key point — differentiator or surprising fact</li>
</ul>
```

**Styling (auto-applied by BlogArticle.tsx):**
- No background (transparent)
- Diamond bullet ◆ in brand-gold before each item
- Text: brand-dark, font-bold, text-base
- Rounded-2xl, py-5, px-6
- Label: 10px uppercase tracking, brand-gold, font-bold

### 3.2 Article Highlight

Gold-accented information box for key facts, numbers, or rules.

```html
<div class="article-highlight">
  <p><strong>Title or lead-in:</strong></p>
  <p>Main content with <strong>bold numbers</strong> and key facts. Can include multiple paragraphs.</p>
</div>
```

Or with a list:

```html
<div class="article-highlight">
  <p><strong>Rules we never break:</strong></p>
  <ul>
    <li><strong>Rule one:</strong> — explanation</li>
    <li><strong>Rule two:</strong> — explanation</li>
  </ul>
</div>
```

**Styling:** `bg-brand-gold/[0.08]`, gold left border (4px), rounded-r-2xl, `my-10`

### 3.3 Article Tip

Dark background expert tip box. Used for "What we do at Orostone" or "Watch out for this" sections.

```html
<div class="article-tip">
  <p><strong>Čo robíme v Orostone</strong></p>
  <p>Explanation of our approach or warning about common mistakes.</p>
</div>
```

For the **final CTA tip** at the end of the article, include the contact button:

```html
<div class="article-tip">
  <p><strong>Alebo nás jednoducho kontaktuj v Orostone</strong></p>
  <p>Radi ti všetko vysvetlíme a ukážeme priamo v našom showroome. Nezáväzná konzultácia je zadarmo.</p>
  <a href="/kontakt" class="tip-btn">Kontaktovať nás →</a>
</div>
```

English version:

```html
<div class="article-tip">
  <p><strong>Or simply contact us at Orostone</strong></p>
  <p>We'll happily explain everything and show you in person at our showroom. The consultation is free of charge.</p>
  <a href="/kontakt" class="tip-btn">Contact us →</a>
</div>
```

**Styling:** `bg-brand-dark`, white text, rounded-2xl, `my-12`. Strong text renders in brand-gold. `tip-btn` renders as gold pill button.

### 3.4 Article Quote

Pull quote with gold left border. Used for impactful editorial statements.

```html
<div class="article-quote">
  <p>This is our honest guide to everything that can go wrong. Why it happens and how we prevent it.</p>
</div>
```

**Styling:** Gold left border (4px), text-brand-dark, text-lg/xl, italic, medium weight, `my-12`

### 3.5 Article Figure

Image with caption. All article images must use this wrapper.

```html
<figure class="article-figure">
  <img src="/images/blog/article-XX/image-name.webp" alt="Descriptive alt text in the article language" loading="lazy" />
  <figcaption>Caption text describing what the image shows</figcaption>
</figure>
```

**Styling:** `my-12 lg:my-16`, image is full-width, rounded-2xl, shadow-lg. Caption is centered, gray-400, italic, font-light.

**Rules:**
- Always include `loading="lazy"` on all images
- Alt text must be descriptive and in the same language as the content
- Figcaption should add context, not just repeat the alt text
- Aim for 4-6 figures per article, distributed evenly

### 3.6 Article Case Study

Visually distinct wrapper for real-world examples, client stories, or practical demonstrations.

```html
<div class="article-case-study">
  <span class="case-study-label">Z praxe</span>           <!-- SK -->
  <h3>Client story headline</h3>
  <p>First paragraph of the story...</p>
  <p>Second paragraph with outcome and <strong class="gold">key result</strong>.</p>
  <p>Conclusion or lesson learned.</p>
</div>
```

English version:

```html
<div class="article-case-study">
  <span class="case-study-label">Case study</span>        <!-- EN -->
  <h3>Client story headline</h3>
  <p>...</p>
</div>
```

**Styling:** `bg-[#FAFAFA]`, gold left border (4px), rounded-r-2xl, `my-12`. Label is 10px uppercase gold. Not every article needs one, but it's strongly recommended for articles with real-world examples.

### 3.7 Mid-Article CTA

Soft conversion block placed at approximately 40-60% of the article content. Must feel helpful, not pushy.

```html
<div class="article-cta">
  <p>Máte otázky k [topic]?</p>
  <p>Poraďte sa s nami — nezáväzne a zadarmo.</p>
  <a href="/kontakt" class="cta-btn">Nezáväzná konzultácia →</a>
</div>
```

English version:

```html
<div class="article-cta">
  <p>Have questions about [topic]?</p>
  <p>Get free, no-obligation expert advice.</p>
  <a href="/kontakt" class="cta-btn">Free consultation →</a>
</div>
```

**Styling:** `bg-brand-gold/10`, gold border, rounded-2xl, centered text, `my-12`. `cta-btn` renders as dark pill button that turns gold on hover.

### 3.8 Gold Inline Highlight

For emphasizing key phrases within regular paragraphs.

```html
<strong class="gold">key phrase here</strong>
```

**Styling:** `text-brand-gold font-bold` — renders as gold-colored bold text. See [Section 7](#7-gold-highlighting-rules) for usage rules.

---

## 4. Brand Colors

| Name | Tailwind Class | Hex Value | Usage |
|---|---|---|---|
| Gold | `brand-gold` | `#ECD488` | Accents, highlights, CTAs, borders, labels |
| Dark | `brand-dark` | `#1A1A1A` | Text, dark backgrounds, headings |
| Light | `brand-light` | `#F9F9F7` | Subtle backgrounds |

### In Article Content

- Gold text highlights: `<strong class="gold">text</strong>` — renders as `text-brand-gold font-bold`
- Regular bold: `<strong>text</strong>` — renders as `text-brand-dark font-semibold`
- Emphasis: `<em>text</em>` — renders as italic

---

## 5. Typography and Spacing Rules

These are the Tailwind prose modifiers applied by `BlogArticle.tsx`. You do NOT need to add inline styles — all styling is automatic based on HTML tags and CSS classes.

### Headings

| Element | Size | Weight | Margin Top | Margin Bottom | Notes |
|---|---|---|---|---|---|
| H2 | `1.65rem / lg:2rem` | Bold (700) | `mt-20 lg:mt-24` | `mb-10` | Must have `id` attribute |
| H3 | `xl / lg:1.35rem` | Bold (700) | `mt-12` | `mb-6` | Used for sub-sections |

### Body Text

| Element | Color | Weight | Line Height | Bottom Margin | Size |
|---|---|---|---|---|---|
| Paragraph `<p>` | `gray-600` | Light (300) | `1.9` | `mb-8` | `1.05rem / lg:1.1rem` |
| List item `<li>` | `gray-600` | Light (300) | Relaxed | — | `1.05rem` |
| Link `<a>` | `brand-gold` | Medium (500) | — | — | Underline on hover |

### Lists

- `<ul>`: `my-6`, `space-y-2`
- Standard bullets, gray-600 text, light weight

### Images

- `<img>` inside prose: `rounded-2xl`, `my-12`, `shadow-lg`
- `<figure class="article-figure">`: `my-12 lg:my-16`

### Block Elements Spacing

| Block | Vertical Margin |
|---|---|
| `article-tldr` | `mb-12` (no top margin) |
| `article-highlight` | `my-10` |
| `article-tip` | `my-12` |
| `article-quote` | `my-12` |
| `article-figure` | `my-12 lg:my-16` |
| `article-case-study` | `my-12` |
| `article-cta` | `my-12` |
| `blockquote` | `my-12` |

---

## 6. Image Generation Workflow

All article images are generated using `user-nano-banana-pro-generate_image` (Gemini model).

### Hero Images

One hero image per article. Used as the full-width hero banner and in article cards.

- **Tool:** `user-nano-banana-pro-generate_image`
- **Aspect ratio:** `16:9`
- **Resolution:** `2K`
- **Format:** Save directly as `.webp`
- **Output path:** `public/images/blog/{slug-name}.webp`
- **Reference in data:** `heroImage: '/images/blog/{slug-name}.webp'`

Example prompt for a hero image:

```
Professional editorial photography of a premium sintered stone kitchen
countertop with [specific scene]. Modern luxury kitchen interior,
shallow depth of field, architectural photography style. No text overlay.
```

### Inline Article Images

4-6 images per article, placed inside `<figure class="article-figure">` blocks.

- **Tool:** `user-nano-banana-pro-generate_image`
- **Aspect ratio:** `16:9`
- **Resolution:** `2K`
- **Format:** Generate as `.png`, then convert to `.webp`
- **Output path:** `public/images/blog/article-XX/{image-name}.png`
- **Final path after conversion:** `public/images/blog/article-XX/{image-name}.webp`

### Image Conversion

After generating `.png` images, convert to `.webp` using ImageMagick:

```powershell
$dir = "c:/Projekty/Orostone 5/public/images/blog/article-XX"
$files = @("image-1", "image-2", "image-3")
foreach ($f in $files) {
    $src = "$dir/$f.png"
    $dst = "$dir/$f.webp"
    magick "$src" -quality 82 "$dst"
}
```

Then delete the `.png` originals:

```powershell
Remove-Item "$dir/*.png"
```

### Prompt Engineering Rules

**Always include:**
- Camera reference: "Shot with Canon EOS R5", "Sony A7R IV", "Nikon D850"
- Lens focal length: "24mm lens", "35mm lens", "macro lens at f/2.8"
- Lighting description: "natural lighting", "studio lighting with soft shadows", "bright overhead LED"
- Photography style: "architectural photography", "product photography", "documentary style", "photojournalism"
- Realism keywords: "photorealistic", "hyperrealistic", "indistinguishable from a real photograph"
- Resolution hint: "8K resolution quality" or "8K detail"

**Never include:**
- AI cliches: blue toning, plastic surfaces, unrealistic reflections, overly saturated colors
- Text or labels in the image (unless specifically needed, like a comparison diagram)
- Watermarks or logos
- People's faces in sharp detail (privacy/uncanny valley concerns)

**Prompts must always be in English** (better results from the model).

### Typical Article Image Set (6 images)

For a technical article like Article 01, a good image set covers:

1. **Hero/overview** — wide-angle luxury interior showing the material in context
2. **Detail/close-up** — macro shot of a specific feature (e.g., edge profile, surface texture)
3. **Process shot** — fabrication/manufacturing (e.g., CNC cutting, polishing)
4. **Comparison** — side-by-side showing differences (e.g., thickness, finishes)
5. **Logistics/transport** — professional handling and delivery
6. **Installation** — on-site work with technicians and tools

### HTML Reference in Content

```html
<figure class="article-figure">
  <img src="/images/blog/article-XX/image-name.webp"
       alt="Descriptive alt text in article language"
       loading="lazy" />
  <figcaption>Caption adding context — not just repeating the alt text</figcaption>
</figure>
```

---

## 7. Gold Highlighting Rules

Gold highlights (`<strong class="gold">`) are the primary tool for creating visual rhythm and drawing the reader's eye to key information.

### Quantity

- **8-12 gold highlights per article** (in each language variant)
- Roughly 1-2 per H2 section
- Never more than one per paragraph

### What to Highlight

Target these types of phrases:

| Type | Example |
|---|---|
| Surprising facts | `nie je nezničiteľný` (it's not indestructible) |
| Counterintuitive statements | `praskne ti ako čokoláda` (it'll crack like chocolate) |
| Key differentiators | `rozdiel nie je nikdy v materiáli` (the difference is never the material) |
| Critical numbers | `3× vyššiu mieru chipovania` (3x higher chipping rate) |
| Emotional hooks | `zamieňať ich je recept na katastrofu` (mixing them up is a recipe for disaster) |
| Action phrases | `dá sa mu predísť` (it can be prevented) |

### What NOT to Highlight

- Generic statements ("this is important", "we recommend")
- Entire sentences (keep it to 3-8 words)
- Text that's already inside a styled block (tip, highlight, quote, case study)
- More than one phrase in the same paragraph

### Syntax

```html
<!-- CORRECT — inside a regular paragraph -->
<p>Sinterovaný kameň <strong class="gold">nie je nezničiteľný</strong>. Odolá UV žiareniu...</p>

<!-- WRONG — don't put gold inside article-highlight or article-tip -->
<div class="article-highlight">
  <p><strong class="gold">Wrong</strong> — use regular <strong>bold</strong> inside styled blocks</p>
</div>
```

---

## 8. SEO and Structural Requirements

### H2 IDs for Table of Contents

Every `<h2>` must have a unique `id` attribute in kebab-case. This enables the automatic Table of Contents (desktop sidebar + mobile collapsible).

```html
<h2 id="chipovanie-a-poskodenie-hran">Prečo väčšina chipov vzniká na hranách?</h2>
```

The `id` should match the topic, not be a translation of the heading:

| SK Heading | EN Heading | Shared ID pattern |
|---|---|---|
| `Prečo väčšina chipov vzniká...` | `Why do most chips happen...` | SK: `chipovanie-a-poskodenie-hran`, EN: `chipping-and-edge-damage` |

Note: SK and EN articles have their own IDs — they don't need to match because the component re-extracts headings when language switches.

### Direct Answer Field

The `directAnswer` field is used for the collapsible "Quick Answer" box at the top of the article. It's also valuable for AI-powered search snippets.

- 2-3 sentences maximum
- Answer the core question of the article directly
- Include specific numbers or facts
- Must work as a standalone answer without reading the article

### Excerpt Field

Used for meta description and article cards on the blog listing page.

- 1-2 sentences
- Engaging, not just a summary
- Include the primary keyword naturally

### Tags

- 4-6 tags per article
- In Slovak (they display on the article page)
- Use existing tags when possible for cross-linking
- Common tags: `sinterovaný kameň`, `kuchynská doska`, `údržba`, `inštalácia`, `dizajn`

### Image SEO

- Every `<img>` must have a descriptive `alt` attribute
- Alt text should be in the same language as the content variant
- Always include `loading="lazy"` on all images except the hero (which is above the fold)

### FAQs Array

The `faqs` array is populated even though the FAQ section is not currently rendered in the component. These FAQs:

- Serve as structured data for potential JSON-LD implementation
- Can be re-enabled in the component if needed
- Should cover 10-15 common questions related to the article topic
- Each FAQ should have a clear, standalone answer (50-150 words)

---

## 9. Component Features (Auto-Rendered by BlogArticle.tsx)

The `BlogArticle.tsx` component automatically renders the following features. You do NOT need to add these in the article content — they are built into the page template.

### Reading Progress Bar
- 3px gold bar fixed at `top-0`
- Width driven by scroll percentage
- `z-[100]`, smooth transition

### Direct Answer Box
- Collapsible box below the hero, above the article content
- Starts **open by default** (`useState(true)`)
- Uses the `directAnswer` field from article data
- AnimatePresence for smooth expand/collapse

### Table of Contents — Desktop
- Sticky sidebar on the left, visible on `xl:` (1280px+) screens
- Extracted automatically from H2 and H3 headings with `id` attributes
- Active heading highlighted with gold left border
- Smooth scroll on click

### Table of Contents — Mobile
- Collapsible TOC button visible below `xl:` breakpoint
- Placed between the Direct Answer box and the article content
- Closes automatically when a heading is clicked

### Tags Display
- Rendered below the article content
- Uses the `tags` array from article data
- Each tag links to `/blog?tag={tag}`
- Rounded pill buttons with hover effect

### Social Share Buttons
- Displayed below tags
- LinkedIn, Facebook, X/Twitter, Copy Link
- Each with branded hover colors
- Copy link shows green checkmark confirmation

### Author Bio Card
- Displayed below social share
- Uses `article.author` data (avatar, name)
- Includes a team description and contact link
- `bg-[#FAFAFA]` rounded card

### Back to Top Button
- Fixed at `bottom-6 right-6`
- Appears after 500px of scrolling
- Dark background, gold on hover
- Smooth scroll to top

### Related Articles Grid
- 3-column grid below the article
- Shows articles from the same category
- `bg-[#FAFAFA]` section background

---

## 10. Consistency Checklist

Use this checklist before publishing or updating any article. Every item must be checked for BOTH SK and EN content.

### Content Structure
- [ ] `<p class="article-tldr-label">` present above the TLDR list
- [ ] TLDR list has 3-5 bullet points
- [ ] `directAnswer` field filled (2-3 sentences, standalone answer)
- [ ] `excerpt` field filled (1-2 engaging sentences)
- [ ] Opening section has 2-3 paragraphs with gold highlights
- [ ] Editorial quote (`article-quote`) present in opening
- [ ] 5-8 H2 sections, all with unique `id` attributes

### Visual Blocks
- [ ] At least 2 `article-highlight` boxes
- [ ] At least 2 `article-tip` boxes
- [ ] At least 1 `article-quote`
- [ ] At least 1 `article-case-study` (if article has real-world examples)
- [ ] Mid-article CTA (`article-cta`) placed at 40-60% of content
- [ ] Final CTA tip with `<a class="tip-btn">` linking to `/kontakt`

### Gold Highlights
- [ ] 8-12 `<strong class="gold">` phrases per language variant
- [ ] Highlights target surprising facts, key numbers, emotional hooks
- [ ] No gold highlights inside styled blocks (tip, highlight, case-study)
- [ ] Maximum 1 gold highlight per paragraph

### Images
- [ ] Hero image generated (16:9, webp, in `public/images/blog/`)
- [ ] 4-6 inline images via `<figure class="article-figure">`
- [ ] All images in webp format
- [ ] All images have descriptive `alt` text in the article language
- [ ] All images have `loading="lazy"`
- [ ] All images have `<figcaption>` with contextual caption

### Data Integrity
- [ ] Both SK and EN content complete with identical structure
- [ ] FAQs array populated (10-15 pairs)
- [ ] Tags array has 4-6 relevant Slovak terms
- [ ] `readTimeMinutes` is accurate (word count / 200)
- [ ] `publishDate` is set in ISO format
- [ ] Article is imported and registered in `data/blogArticles.ts`

---

## 11. Current Article Status

### Reference Article (Gold Standard)

| Article | File | Status | Notes |
|---|---|---|---|
| 01 — Problémy so sinterovaným kameňom | `data/articles/article-01-problems.ts` | **COMPLETE** | All patterns applied. Use as reference for all other articles. |

### Articles Needing Updates

These articles exist with content but are missing the editorial patterns established in Article 01:

| Article | File | Missing Elements |
|---|---|---|
| 06 — Sinterovaný kameň vs kvarcit vs keramika vs Dekton | `data/articles/article-06-comparison.ts` | tldr-label, highlights, tips, quotes, figures, CTA, gold text, tip-btn, case-study |
| 10 — Matný vs lesklý povrch | `data/articles/article-10-matte-vs-polished.ts` | tldr-label, highlights, tips, quotes, figures, CTA, gold text, tip-btn, case-study |
| 13 — Od merania po inštaláciu | `data/articles/article-13-process.ts` | tldr-label, highlights, tips, quotes, figures, CTA, gold text, tip-btn, case-study |
| 16 — Oplatí sa sinterovaný kameň? | `data/articles/article-16-worth-it.ts` | tldr-label, highlights, tips, quotes, figures, CTA, gold text, tip-btn, case-study |

**What each article needs:**
1. Add `<p class="article-tldr-label">Zhrnutie článku</p>` / `Key takeaways` before the `article-tldr` list
2. Add 8-12 `<strong class="gold">` highlights to key phrases
3. Wrap key fact sections in `<div class="article-highlight">`
4. Add `<div class="article-tip">` boxes for expert advice sections
5. Add `<div class="article-quote">` for impactful editorial statements
6. Generate 4-6 inline images and wrap in `<figure class="article-figure">`
7. Add mid-article CTA at 40-60% of content
8. Add final CTA tip with `tip-btn` contact button
9. Add case study wrapper where applicable
10. Generate hero image if missing (already done for all 4)

### Stub Articles (Need Full Content)

16 articles are defined as stubs in `data/blogArticles.ts` with placeholder content ("Článok sa pripravuje"). Each needs:
- Full article content written for both SK and EN
- All editorial patterns from this guide applied
- Hero image + 4-6 inline images generated
- Registration updated from stub to full import

| # | ID | Category |
|---|---|---|
| 02 | hot-pans-sintered-stone | risk-killers |
| 03 | sintered-stone-stain-test | risk-killers |
| 04 | 12mm-vs-20mm-thickness | risk-killers |
| 05 | edges-chipping-profiles | risk-killers |
| 07 | certifications-sintered-stone | trust-builders |
| 08 | spot-low-quality-slabs | trust-builders |
| 09 | transparent-pricing-quote | trust-builders |
| 11 | seams-sintered-stone | identity-aesthetics |
| 12 | top-10-luxury-slab-styles | identity-aesthetics |
| 14 | kitchen-remodel-checklist | friction-removers |
| 15 | install-day-guide | friction-removers |
| 17 | quartz-vs-sintered-stone | value-comparisons |
| 18 | cheap-alternatives-premium-slabs | value-comparisons |
| 19 | how-to-clean-sintered-stone | control-care |
| 20 | what-damages-sintered-stone | control-care |
| 21 | warranty-explained-simply | control-care |

---

## Quick Reference — Copy-Paste Templates

### New Article File Skeleton

```typescript
import { BlogArticle, BLOG_AUTHOR_OROSTONE } from '../blogTypes';

export const ARTICLE_XX: BlogArticle = {
  id: 'article-id-here',
  slug: 'url-slug-here',
  category: 'risk-killers', // or other category
  publishDate: '2026-XX-XX',
  readTimeMinutes: 10,
  heroImage: '/images/blog/slug-name.webp',
  author: BLOG_AUTHOR_OROSTONE,
  tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],

  sk: {
    title: '',
    subtitle: '',
    excerpt: '',
    directAnswer: '',
    content: `
<p class="article-tldr-label">Zhrnutie článku</p>
<ul class="article-tldr">
  <li>Key point 1</li>
  <li>Key point 2</li>
  <li>Key point 3</li>
  <li>Key point 4</li>
</ul>

<p>Opening paragraph with <strong class="gold">gold highlight</strong>...</p>

<p>Second paragraph...</p>

<div class="article-quote">
  <p>Editorial hook quote here.</p>
</div>

<figure class="article-figure">
  <img src="/images/blog/article-XX/hero-shot.webp" alt="Alt text" loading="lazy" />
  <figcaption>Caption text</figcaption>
</figure>

<h2 id="section-one">First Section Title</h2>

<p>Content...</p>

<div class="article-highlight">
  <p><strong>Key facts:</strong></p>
  <p>Important information with <strong>bold numbers</strong>.</p>
</div>

<div class="article-tip">
  <p><strong>Čo robíme v Orostone</strong></p>
  <p>Our approach explanation.</p>
</div>

<!-- ... more H2 sections ... -->

<!-- MID-ARTICLE CTA — place at ~40-60% of content -->
<div class="article-cta">
  <p>Máte otázky k [topic]?</p>
  <p>Poraďte sa s nami — nezáväzne a zadarmo.</p>
  <a href="/kontakt" class="cta-btn">Nezáväzná konzultácia →</a>
</div>

<!-- ... more H2 sections ... -->

<!-- CASE STUDY (if applicable) -->
<div class="article-case-study">
  <span class="case-study-label">Z praxe</span>
  <h3>Story headline</h3>
  <p>Story content...</p>
</div>

<!-- FINAL SECTION -->
<h2 id="zaver">Záverečná sekcia</h2>

<p>Closing paragraph with <strong class="gold">key takeaway</strong>.</p>

<div class="article-tip">
  <p><strong>Alebo nás jednoducho kontaktuj v Orostone</strong></p>
  <p>Radi ti všetko vysvetlíme a ukážeme priamo v našom showroome. Nezáväzná konzultácia je zadarmo.</p>
  <a href="/kontakt" class="tip-btn">Kontaktovať nás →</a>
</div>
`,
    faqs: [
      { question: '...', answer: '...' },
      // 10-15 FAQ pairs
    ],
  },

  en: {
    title: '',
    subtitle: '',
    excerpt: '',
    directAnswer: '',
    content: `
<!-- Same structure as SK, with English text -->
<!-- Use "Key takeaways" for tldr-label -->
<!-- Use "Case study" for case-study-label -->
<!-- Use "Contact us →" for tip-btn -->
<!-- Use "Free consultation →" for cta-btn -->
`,
    faqs: [
      { question: '...', answer: '...' },
    ],
  },
};
```

### Image Generation Prompt Template

```
[Type] photograph of [subject] in [setting/context].
[Specific details about materials, colors, positioning].
[Lighting description]. [Camera reference, lens, style].
Hyperrealistic, indistinguishable from a real photograph.
No text overlay.
```

Examples:
- Hero: `Professional editorial photography of a premium sintered stone kitchen countertop with [specific scene]. Modern luxury interior, shallow depth of field, architectural photography style. Shot with Canon EOS R5, 24mm lens, natural lighting. No text overlay.`
- Detail: `Extreme close-up photograph showing [specific feature] of sintered stone. [Details about what's visible]. Shot on a macro lens at f/2.8, studio lighting with soft shadows. Hyperrealistic product photography.`
- Process: `Professional [process] in a modern fabrication workshop. [Details about equipment and materials]. Shot with Sony A7R IV, 35mm lens, industrial photography style. Hyperrealistic.`
