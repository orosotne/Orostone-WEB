# Orostone WEB — Claude Code Guide

## Project Overview

Premium e-commerce website for Orostone (sintered stone / veľkoformátové platne). Single e-shop SPA. Marketing site will be a separate independent project.

- **Brand:** Orostone — Slovak market, content in Slovak/Czech
- **Domain:** eshop.orostone.sk

## Stack notes

- Animations: Framer Motion through `LazyMotion` with `m.*` components.

## Architecture

### Shopify Fallback Strategy
`data/shop-products-fallback.json` is a local offline copy of the Shopify catalog. Sync with `npm run sync:shop-fallback`.

### Instagram Strip
The homepage Instagram strip renders `data/instagram-feed.json` and 600×750 webp tiles in `public/images/instagram/`, taken from the `instagram-feed` edge function at build time (`scripts/sync-instagram.ts`). No runtime call to Instagram; new posts appear with the next deploy. `.github/workflows/instagram-daily-deploy.yml` checks daily and triggers a deploy through the Vercel Deploy Hook (secret `VERCEL_DEPLOY_HOOK_URL`) when the live site is missing a post.

## Dev Commands

`npm test` runs the node:test suite in `scripts/tests`; CI runs it on every PR to main.

## Environment Variables

See `.env.example`; `VITE_PUBLIC_SITE_URL` is also required but missing from it.

## Styling Conventions (see STYLE_GUIDE.md)

The site uses a new design system (October 2026). New and rewritten sections use the building blocks in `components/Design/` (`Container`, `Section`, `SectionHeader`, `Eyebrow`, `TextLink`, `ActionButton`, `PageHero`, `GoldBand`, `FeatureGrid`, `StepList`, `FaqList`, `LegalLayout` …; full list in STYLE_GUIDE.md) and these tokens: colours `brand-light`, `brand-sand`, `brand-dark`, `brand-muted`, `brand-line`, `brand-gold` (accent only); type `text-os-h1`, `text-os-h2`, `text-os-h3`, `text-os-lead`, `text-os-eyebrow`. The product detail (`ShopProductDetail` + `components/ProductDetail/`) is on the new design too (proposal A, then `<Container>` and the type scale, approved by the owner in October 2026). Reference sheet while developing: `/_dizajn`.
- Motion follows Apple's fluid-interface rules (skill `apple-design`, STYLE_GUIDE › Motion): springs from `lib/motion.ts` instead of fixed tweens, `os-press` press feedback on controls, hover styles only on hover-capable devices (`hoverOnlyWhenSupported`), enter and exit along the same path.
- Nothing moves after first paint (visitors from Facebook/Instagram ads use slow in-app browsers): skeletons repeat the real page's boxes, late content reserves its space, photos switch through `usePhotoLayers` (STYLE_GUIDE › E-shop, Motion).

- Font: **Montserrat** only (`font-sans`); headings weight 600, body 300.
- Gold #ECD488 only as an accent (gold CTA in the header, the gold band and the mobile bar), never as text on a light background.
- Restyling must keep URLs, meta, JSON-LD, H1/H2, `id` anchors, tables, internal links and every tracking call (`trackMetaEvent`, `trackGA4*`) intact; the seo-diff check blocks removals.
- The AI chat button (widget.js, loaded in `index.html`) floats bottom right above every layer of the site. A new element fixed to the bottom edge carries `data-aipredajca-avoid` while it shows (the button moves above it); a new drawer, drop-down panel (search, mega menu), dialog or lightbox gets `data-aipredajca-hide` on an element that is mounted only while it is open (the button steps aside). The header carries `data-aipredajca-avoid` as well: the chat's greeting and window stay below it. `scripts/tests/chat-widget-layout.test.ts` lists them. A new pop-up that opens by itself waits while the chat window is open (`hooks/useAiChatOpen.ts`, as in NewsletterPopup and DiscountPopup).
- Anything fixed to the bottom edge at z-50 or above lies above the header's layers (a fixed z-50 that comes after the header in the page paints over it too): it steps away while the header's menu drawer or search results are open (`hooks/useHeaderLayerOpen.ts`, as in MobileCtaBar, the product page's cart bar, the docked sample tray and the blog's back-to-top button), or it covers the bottom of the menu. `scripts/tests/header-layer.test.ts` finds them.

## State Management

React Context API only — no Redux/Zustand.

## SEO

- **SEO diff gate:** every PR to `main` runs `.github/workflows/seo-diff.yml`, which compares title, meta description, H1/H2, `#` anchors, tables, JSON-LD types and internal links of every prerendered page against `main` and posts the list as a PR comment. Anything removed turns the check red — approve it deliberately or restore it (a rewrite must not silently drop a table or section that ranks). A reworded H2 that keeps its `#id` (on listings, its link) is listed as a change, not a removal. Locally: `npm run seo:diff -- <main dist> dist`.
