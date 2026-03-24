# OROSTONE WEB — Prehľad úloh

> Posledná aktualizácia: 2026-03-17

---

## Legenda

| Symbol | Význam |
|--------|--------|
| ✅ | Hotové |
| 🔲 | Treba spraviť |
| ⏳ | Rozpracované |
| ❌ | Zrušené / neaktuálne |

---

## 1. SEO — Online optimalizácia

| # | Úloha | Priorita | Stav | Poznámka |
|---|-------|----------|------|----------|
| 1.1 | SEO obsah pre 12 produktov (meta title, description, keywords, benefits, FAQs) | HIGH | ✅ | `data/product-seo-content.ts` |
| 1.2 | Structured data — Product JSON-LD na produktových stránkach | HIGH | ✅ | `ShopProductDetail.tsx` |
| 1.3 | Structured data — BreadcrumbList JSON-LD | HIGH | ✅ | `ShopProductDetail.tsx` |
| 1.4 | Structured data — LocalBusiness (HomeAndConstructionBusiness) | HIGH | ✅ | `eshop.html` |
| 1.5 | Structured data — Organization | HIGH | ✅ | `index.html` |
| 1.6 | Structured data — WebSite + SearchAction | HIGH | ✅ | `eshop.html`, `index.html` |
| 1.7 | Structured data — ItemList na product listing stránke | HIGH | ✅ | `Shop.tsx` |
| 1.8 | Structured data — FAQPage na produktových stránkach | MEDIUM | ✅ | `ShopProductDetail.tsx` |
| 1.9 | Canonical URLs na všetkých stránkach | HIGH | ✅ | Shop, ProductCatalog, CategoryPage, ProductDetail |
| 1.10 | Open Graph + Twitter Card meta tagy | HIGH | ✅ | `eshop.html`, `index.html`, SEOHead component |
| 1.11 | Sitemap s 12 produktami + lastmod | HIGH | ✅ | `public/sitemap.xml` |
| 1.12 | robots.txt s odkazom na sitemap | MEDIUM | ✅ | `public/robots.txt` |
| 1.13 | llms.txt — katalóg pre AI crawlery | MEDIUM | ✅ | `public/llms.txt` |
| 1.14 | 404 stránka (eshop + hlavná stránka) | MEDIUM | ✅ | `EshopApp.tsx`, `App.tsx` |
| 1.15 | Image alt texty — popisné SEO alt atribúty | MEDIUM | ✅ | `ShopProductDetail.tsx` |
| 1.16 | Responsive images — srcset/sizes | LOW | ✅ | `ShopProductDetail.tsx` |
| 1.17 | Performance hints — dns-prefetch, preconnect | LOW | ✅ | `eshop.html` |
| 1.18 | Registrácia v Google Search Console | HIGH | ✅ | Hotové 2026-03-23 |
| 1.19 | Otestovať Rich Results (Google Rich Results Test) | HIGH | 🔲 | Manuálne — https://search.google.com/test/rich-results |
| 1.20 | Otestovať OG tagy (Facebook Debugger, Twitter Validator) | MEDIUM | 🔲 | Manuálne — https://developers.facebook.com/tools/debug/ |
| 1.21 | Lighthouse audit + Core Web Vitals | MEDIUM | 🔲 | Manuálne — Chrome DevTools → Lighthouse |
| 1.22 | Submisie sitemapy do Bing Webmaster Tools | LOW | 🔲 | Manuálne — https://www.bing.com/webmasters |

## 2. SEO — Offline / manuálne úlohy

| # | Úloha | Priorita | Stav | Poznámka |
|---|-------|----------|------|----------|
| 2.1 | Google Business Profile — claimnúť a optimalizovať | HIGH | 🔲 | Pridať adresu, otváracie hodiny, fotky, produkty |
| 2.2 | Dedicované OG obrázky 1200×630px pre každý produkt | MEDIUM | 🔲 | S názvom produktu a logom — pre social sharing |
| 2.3 | Blog interlinking — prepojiť články s produktami | MEDIUM | 🔲 | Interné linky z blogu na produktové stránky |
| 2.4 | Customer reviews — pridať aggregateRating schema | LOW | 🔲 | Až keď budú recenzie od zákazníkov |
| 2.5 | Lokálne SEO — registrácie v katalógoch (Zlaté stránky, Firmy.sk) | LOW | 🔲 | NAP konzistencia (Name, Address, Phone) |

## 3. E-shop — Funkcie a UX

| # | Úloha | Priorita | Stav | Poznámka |
|---|-------|----------|------|----------|
| 3.1 | Shop page redesign — InspirationSection, SampleLeadSection | — | ✅ | Commitnuté |
| 3.2 | RotatingBadge komponent | — | ✅ | Commitnuté |
| 3.3 | Instagram feed integrácia (Supabase Edge Functions) | — | ✅ | `useInstagramFeed`, supabase functions |
| 3.4 | Košík a checkout flow | HIGH | ✅ | Shopify hosted checkout, redirect cez `checkoutUrl` + return_to thank-you stránka |
| 3.5 | Kontaktný formulár — SEO optimalizovaná stránka | MEDIUM | 🔲 | |
| 3.6 | Zákaznícke recenzie — zbieranie a zobrazovanie | MEDIUM | 🔲 | |
| 3.7 | Wishlist / obľúbené produkty | LOW | 🔲 | |
| 3.8 | Filtrovanie produktov podľa parametrov | MEDIUM | 🔲 | Farba, povrch, rozmer, cena |
| 3.9 | Porovnávanie produktov | LOW | 🔲 | Side-by-side porovnanie platní |

## 4. Marketing a obsah

| # | Úloha | Priorita | Stav | Poznámka |
|---|-------|----------|------|----------|
| 4.1 | Blog — SEO optimalizované články o veľkoformátových platniach | HIGH | 🔲 | Min. 5 článkov s kľúčovými slovami |
| 4.2 | Sociálne siete — pravidlený posting s OG obrázkami | MEDIUM | 🔲 | Instagram, Facebook |
| 4.3 | E-mail marketing — newsletter signup a kampane | MEDIUM | 🔲 | |
| 4.4 | Google Ads — PPC kampane na kľúčové slová | MEDIUM | 🔲 | Targeting: Bratislavský kraj |
| 4.5 | Referral program — odporúčania od existujúcich zákazníkov | LOW | 🔲 | |

## 5. Technické úlohy

| # | Úloha | Priorita | Stav | Poznámka |
|---|-------|----------|------|----------|
| 5.1 | Push na GitHub (vyžaduje auth) | HIGH | 🔲 | `git push origin main` — 2 commity čakajú |
| 5.2 | Deploy na Vercel / production | HIGH | 🔲 | Po push-e |
| 5.3 | Analytics — GA4 implementácia | HIGH | 🔲 | Event tracking pre konverzie |
| 5.4 | Cookie consent banner | MEDIUM | 🔲 | GDPR compliance |
| 5.5 | Performance — lazy loading, code splitting | MEDIUM | 🔲 | React.lazy, Suspense |
| 5.6 | Error monitoring — Sentry alebo podobné | LOW | 🔲 | |
| 5.7 | Automatické testy — E2E (Playwright/Cypress) | LOW | 🔲 | |
| 5.8 | CI/CD pipeline — automatické deploye | LOW | 🔲 | GitHub Actions |

---

## Prioritné poradie (odporúčanie)

**Nasledujúce kroky (najbližšie):**
1. ✅ ~~Push na GitHub~~ → 🔲 Spustiť `git push origin main` v termináli
2. ✅ ~~Google Search Console — registrácia a submit sitemapy~~
3. 🔲 Google Business Profile — claimnúť a optimalizovať
4. 🔲 GA4 Analytics — implementovať tracking
5. 🔲 Otestovať structured data cez Rich Results Test
6. 🔲 Lighthouse audit — identifikovať performance problémy

**Strednodobé (1–4 týždne):**
- Blog články optimalizované pre SEO
- OG obrázky pre produkty
- ~~Košík a checkout flow~~ ✅
- Cookie consent banner

**Dlhodobé (1–3 mesiace):**
- Customer reviews systém
- E-mail marketing
- PPC kampane
- Rozšírené filtrovanie a porovnávanie
