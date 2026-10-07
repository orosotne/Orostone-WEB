# Orostone WEB — Codex Guide

## Project Overview

Premium e-commerce website for Orostone (sintered stone / veľkoformátové platne). Single e-shop SPA; price enquiries convert on the separate site oro-klient.orostone.sk.

- **Brand:** Orostone — Slovak market, content in Slovak/Czech
- **Domain:** orostone.sk (eshop.orostone.sk and www.orostone.sk redirect here)

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS 3 (custom brand colors/theme)
- **Animations:** Framer Motion (LazyMotion, `m.*`)
- **E-commerce:** Shopify Storefront API via Hydrogen React
- **Backend/Auth:** Supabase (PostgreSQL + auth)

## Architecture

### Single E-shop App
- `index.tsx` → `EshopApp.tsx` — e-shop SPA (single entry point)
- Entry HTML: `index.html`; every route is prerendered by `scripts/prerender.ts`

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

## Styling Conventions (see STYLE_GUIDE.md)

The site uses a new design system (October 2026): building blocks in `components/Design/` and the tokens `brand-light`, `brand-sand`, `brand-dark`, `brand-muted`, `brand-line`, `brand-gold` (accent only) and `text-os-h1` … `text-os-eyebrow`. A few legacy patterns remain on the product detail (see STYLE_GUIDE.md). Reference sheet while developing: `/_dizajn`.

- Font: **Montserrat** only (`font-sans`); headings weight 600, body 300.
- Gold #ECD488 only as an accent (gold CTA in the header, the gold band and the mobile bar), never as text on a light background.
- Restyling must keep URLs, meta, JSON-LD, H1/H2, `id` anchors, tables, internal links and every tracking call (`trackMetaEvent`, `trackGA4*`) intact; the seo-diff check blocks removals.

## Slovak copy on the web (review rules)

When reviewing or writing visible text (JSX, `data/**/*.ts`, alt texts, button labels):
- Address the visitor with *vy* (vykanie) everywhere, blog included; the reflexive *svoj* when the owner is the subject („Nechajte nám svoj e-mail“).
- *e-mail*, *e-mailový* with a hyphen; Slovak quotes „…“; en dash with spaces ( – ), not the em dash.
- Numbers with units and thousands joined by non-breaking spaces: 3 200 × 1 600 mm, 12 mm, 1 979 €, 1 200 °C (`\u00A0` in strings, `&nbsp;` in JSX text).
- Brand vocabulary and claims follow the copy manual: *sinterovaný kameň*, *pracovná doska*, *ostrovček*, *zástena*, *dekor*; never absolute promises (nezničiteľný, nulová / úplne bez údržby, wow efekt, luxus as filler). Orostone sells slabs, partner stonemasons do fabrication and installation.
- Decor names stay as written (Calacatta Top, Roman Travertine …). Legal documents (VOP, ochrana súkromia, cookies, odstúpenie, reklamácie, doprava, rezervačný poplatok) are the owner's texts: report issues, do not rewrite them.

## State Management

React Context API only — no Redux/Zustand. Contexts:
- `AuthContext` — Supabase auth (admin only; customer accounts live in Shopify)
- `CartContext` — Shopify cart
- `CookieContext` — GDPR cookie consent
- `ThemeContext` — theme

## SEO

- `SEOHead.tsx` component for meta/OG tags per page
- Structured data (JSON-LD): Product, BreadcrumbList, FAQPage, LocalBusiness, Organization
- SEO content DB: `data/product-seo-content.ts` (12 products)
- `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt`

## Debug Infrastructure

- Dev-only debug logging sent to local endpoint `http://127.0.0.1:7731/ingest/...`
- Logs written to `.cursor/debug-*.log`
- Always guarded by `import.meta.env.DEV` checks — never runs in production

## Newsletter copy (`marketing/newsletter/`)

Shared folder for Claude (writes the emails) and Codex (Slovak language review). Not part of the web build.
- Instructions for this folder, including code review rules: `marketing/newsletter/AGENTS.md`.
- Language rules and brand vocabulary: `marketing/newsletter/slovnik.md`.
- Review the copy in `texty/*.md`. `sablony/*.html` and `texty/` are generated by `nastroje/build_emails.py` and `nastroje/extract_copy.py`; do not hand-edit generated files.

## Pending Work (TODO.md)

Key open items:
- Checkout/cart flow (HIGH)
- GA4 analytics (HIGH)
- Google Search Console setup (HIGH)
- Cookie consent banner (MEDIUM)
- Blog content for SEO (HIGH)
- Product filtering UX (MEDIUM)

<!-- VERCEL BEST PRACTICES START -->
## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK
  needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access
<!-- VERCEL BEST PRACTICES END -->
