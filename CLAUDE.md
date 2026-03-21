# Orostone WEB — Claude Code Guide

## Project Overview

Premium e-commerce website for Orostone (sintered stone / veľkoformátové platne). Dual-app SPA architecture: main marketing site + separate e-shop bundle.

- **Brand:** Orostone — Slovak market, content in Slovak/Czech
- **Domain:** orostone.sk / eshop.orostone.sk

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS 3 (custom brand colors/theme)
- **Animations:** Framer Motion, GSAP, Lenis (smooth scroll)
- **E-commerce:** Shopify Storefront API via Hydrogen React
- **Backend/Auth:** Supabase (PostgreSQL + auth)
- **AI:** Google Gemini API (visualizer feature)

## Architecture

### Dual-App Pattern
- `index.tsx` → `App.tsx` — main marketing site
- `eshop.tsx` → `EshopApp.tsx` — separate e-shop SPA
- Each has its own HTML entry (`index.html`, `eshop.html`)

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

## Styling Conventions (from STYLE_GUIDE.md)

### Brand Colors
| Token | Hex | Use |
|-------|-----|-----|
| `text-brand-gold` | #ECD488 | Accents, labels, CTAs |
| `text-brand-dark` | #1A1A1A | Primary text on light |
| `text-brand-light` | #F9F9F7 | Backgrounds |

### Typography
- Font: **Montserrat** (`font-sans`). Do NOT use `font-serif` (deprecated alias).
- Headings: `font-bold`, Body: `font-light`
- Responsive sizing always: `text-5xl md:text-6xl lg:text-7xl`

### Standard Patterns
```tsx
// Section header
<div className="text-center mb-20">
  <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">Label</span>
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6">Heading</h2>
  <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">Description</p>
</div>

// Section padding
<section className="py-32">
  <div className="container mx-auto px-6">...</div>
</section>

// Card
<div className="p-8 bg-[#F9F9F7] rounded-3xl">...</div>
```

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
