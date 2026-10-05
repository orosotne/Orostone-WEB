# Orostone WEB — Claude Code Guide

## Project Overview

Premium e-commerce website for Orostone (sintered stone / veľkoformátové platne). Single e-shop SPA. Marketing site will be a separate independent project.

- **Brand:** Orostone — Slovak market, content in Slovak/Czech
- **Domain:** eshop.orostone.sk

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS 3 (custom brand colors/theme)
- **Animations:** Framer Motion, GSAP, Lenis (smooth scroll)
- **E-commerce:** Shopify Storefront API via Hydrogen React
- **Backend/Auth:** Supabase (PostgreSQL + auth)
- **AI:** Google Gemini API (visualizer feature)

## Architecture

### Single E-shop App
- `index.tsx` → `EshopApp.tsx` — e-shop SPA (single entry point)
- Entry HTML: `index.html`

### Key Directories
```
pages/          # Route-level page components
components/     # Reusable components
  UI/           # Generic UI (buttons, cards, sliders)
  Eshop/        # E-shop specific
  Shop/         # Shop feature components
  Layout/       # Navbar, Footer
  Cart/          # Cart components
context/        # React Context (Auth, Cart, Cookies, Theme)
hooks/          # Custom hooks (Shopify, Instagram, collections)
lib/            # Integrations (shopify.ts, supabase.ts)
data/           # Static data, SEO content, blog articles, fallback catalog
scripts/        # CLI scripts (sync, image processing)
```

### Shopify Fallback Strategy
`data/shop-products-fallback.json` is a local offline copy of the Shopify catalog. Sync with `npm run sync:shop-fallback`.

## Dev Commands

```bash
npm run dev              # Dev server on :3000
npm run build            # Production build
npm run preview          # Preview build
npm run sync:shop-fallback  # Sync Shopify product catalog to local fallback
```

## Environment Variables

See `.env.example`. Required:
- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- `VITE_SHOPIFY_STORE_DOMAIN` + `VITE_SHOPIFY_STOREFRONT_TOKEN`
- `VITE_PUBLIC_SITE_URL`
- `GEMINI_API_KEY`

## Styling Conventions (see STYLE_GUIDE.md)

The site is moving to a new design system (October 2026). New and rewritten sections use the building blocks in `components/Design/` (`Container`, `Section`, `SectionHeader`, `Eyebrow`, `TextLink`, `ActionButton`) and these tokens: colours `brand-light`, `brand-sand`, `brand-dark`, `brand-muted`, `brand-line`, `brand-gold` (accent only); type `text-os-h1`, `text-os-h2`, `text-os-h3`, `text-os-lead`, `text-os-eyebrow`. Pages that are not migrated yet still use the legacy patterns listed in STYLE_GUIDE.md; for small edits there, match the surrounding style. Reference sheet while developing: `/_dizajn`.

- Font: **Montserrat** only (`font-sans`); headings weight 600, body 300.
- Gold #ECD488 only as an accent (gold CTA in the header, the gold band and the mobile bar), never as text on a light background.
- Restyling must keep URLs, meta, JSON-LD, H1/H2, `id` anchors, tables, internal links and every tracking call (`trackMetaEvent`, `trackGA4*`) intact; the seo-diff check blocks removals.

## State Management

React Context API only — no Redux/Zustand. Contexts:
- `AuthContext` — Supabase auth
- `CartContext` — Shopify cart
- `CookieContext` — GDPR cookie consent
- `ThemeContext` — theme

## SEO

- `SEOHead.tsx` component for meta/OG tags per page
- Structured data (JSON-LD): Product, BreadcrumbList, FAQPage, LocalBusiness, Organization
- SEO content DB: `data/product-seo-content.ts` (12 products)
- **SEO diff gate:** every PR to `main` runs `.github/workflows/seo-diff.yml`, which compares title, meta description, H1/H2, `#` anchors, tables, JSON-LD types and internal links of every prerendered page against `main` and posts the list as a PR comment. Anything removed turns the check red — approve it deliberately or restore it (a rewrite must not silently drop a table or section that ranks). Locally: `npm run seo:diff -- <main dist> dist`.
- `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt`

## Debug Infrastructure

- Dev-only debug logging sent to local endpoint `http://127.0.0.1:7731/ingest/...`
- Logs written to `.cursor/debug-*.log`
- Always guarded by `import.meta.env.DEV` checks — never runs in production

## Pending Work (TODO.md)

Key open items:
- Checkout/cart flow (HIGH)
- GA4 analytics (HIGH)
- Google Search Console setup (HIGH)
- Cookie consent banner (MEDIUM)
- Blog content for SEO (HIGH)
- Product filtering UX (MEDIUM)
