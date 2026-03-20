# Orostone E-Shop Setup Guide

Návod na nastavenie e-shopu Orostone. **Platby a dokončenie objednávky prebiehajú cez Shopify Hosted Checkout** (presmerovanie z košíka na `checkoutUrl` z Storefront API).

## Prehľad komponentov

### Frontend (React + TypeScript)

- **Shopify Storefront API** — produkty, košík, `checkoutUrl` ([`lib/shopify.ts`](lib/shopify.ts), [`services/shopify.service.ts`](services/shopify.service.ts))
- **Cart System** — [`context/CartContext.tsx`](context/CartContext.tsx), persistencia `orostone_shopify_cart_id` v `localStorage`
- **Checkout** — [`pages/Checkout.tsx`](pages/Checkout.tsx) a [`components/Cart/CartDrawer.tsx`](components/Cart/CartDrawer.tsx): `window.location.href = checkoutUrl`
- **Shop / katalóg** — [`pages/Shop.tsx`](pages/Shop.tsx), [`hooks/useShopifyProducts.ts`](hooks/useShopifyProducts.ts)
- **Auth / účet** (voliteľné) — Supabase: [`context/AuthContext.tsx`](context/AuthContext.tsx), [`pages/Account.tsx`](pages/Account.tsx)

### Shopify (obchod)

- Produkty, sklad, ceny, doprava, dane, **platobné brány** a e-mailové potvrdenia objednávok

---

## Checklist: Shopify Admin (povinné pre reálne platby)

Toto sa nastavuje v administrácii obchodu na [Shopify Admin](https://admin.shopify.com). Kód frontendu už smeruje zákazníka na checkout URL z košíka.

1. **Platby** — *Settings → Payments*
   - Zapnite **Shopify Payments** (ak je dostupné pre vašu krajinu / právnickú osobu) alebo **alternatívnu bránu** podporovanú Shopify pre vašu lokalitu.
   - Voliteľne: **Manuálna platba** (bankový prevod) s inštrukciami pre zákazníka.
2. **Checkout** — *Settings → Checkout*
   - Kontaktné údaje, povinné polia, súhlasy, e-mailové notifikácie.
3. **Doprava** — *Settings → Shipping and delivery*
   - Zóny, sadzby, alebo dynamické ceny podľa potreby.
4. **Trhy a dane** — *Settings → Markets* / dane podľa predajných krajín; mena obchodu musí zodpovedať tomu, čo zákazník vidí v košíku.
5. **Doména** — *Settings → Domains*: vlastná doména zvyšuje dôveru pri presmerovaní na checkout.
6. **Testovacia objednávka**
   - Zapnite testovací režim podľa typu platobnej brány.
   - Na webe: pridajte produkt s platným `shopifyVariantId` → košík → Pokladňa → dokončite platbu na Shopify checkout → overte objednávku v *Orders*.

---

## Environment variables

Vytvor `.env` alebo `.env.local` v koreni projektu (šablóna: [`.env.example`](.env.example)).

### Shopify (produkčný e-shop)

```env
VITE_SHOPIFY_STORE_DOMAIN=vas-obchod.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=storefront-access-token
```

- **Produkcia:** použite token a doménu z **živého** Shopify obchodu (nie vývojový duplikát, ak už predávate).
- Token vytvoríte v *Settings → Apps and sales channels → Develop apps → Storefront API* s oprávneniami na čítanie produktov a úpravu košíka (checkout).
- Ak premenné chýbajú, `isShopifyConfigured()` je false a katalóg môže ísť z fallbacku — košík/checkout nebudú funkčné voči živému obchodu.

### Overenie toku košík → platba (E2E)

1. `VITE_SHOPIFY_*` nastavené a aplikácia znovu zbuildovaná (`npm run build` / deploy).
2. Otvoriť produkt, ktorý má v dátach `shopifyVariantId`, pridať do košíka.
3. Na stránke Pokladňa alebo v košíkovom draweri kliknúť na dokončenie nákupu — presmeruje na `*.myshopify.com` / checkout.
4. Dokončiť testovaciu platbu v Shopify.

### Supabase (ak používate účet / auth)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Ďalšie kľúče podľa funkcií (vizualizér atď.) sú v [`.env.example`](.env.example).

---

## Offline katalóg (fallback)

Pri výpadku Storefront API alebo vývoji bez `.env`:

```bash
npm run sync:shop-fallback
```

Zapíše snapshot do [`data/shop-products-fallback.json`](data/shop-products-fallback.json) — vhodné commitnúť pred release.

---

## Použitie košíka (Shopify variant)

```tsx
import { useCart } from '../context/CartContext';

const { addItem } = useCart();

// variantId = Shopify ProductVariant GID (napr. z product.shopifyVariantId)
await addItem(variantId, 1);
```

Presmerovanie na platbu:

```tsx
const { checkoutUrl } = useCart();

if (checkoutUrl) {
  window.location.href = checkoutUrl;
}
```

---

## Platobné metódy v pätičke

Ikony sú v [`public/images/payments/`](public/images/payments/). **Zobrazujte len metódy, ktoré máte skutočne aktivované** v Shopify (*Settings → Payments*), aby marketing sedel s checkoutom.

---

## Databáza a rozšírenia (Supabase)

Ak používate schémy z `supabase/` pre účty, dopyty alebo budúce rozšírenia, postupujte podľa SQL súborov v repozitári. **Objednávky z headless checkoutu vznikajú v Shopify** — synchronizácia do vlastnej DB by vyžadovala Shopify webhooks alebo Admin API (mimo základného tohto setupu).

---

## Deployment checklist

- [ ] `VITE_SHOPIFY_STORE_DOMAIN` a `VITE_SHOPIFY_STOREFRONT_TOKEN` nastavené na produkčnom build-e
- [ ] Shopify: platby, doprava, dane/trhy, checkout otestované
- [ ] Aspoň jedna úspešná testovacia objednávka cez web → Shopify *Orders*
- [ ] (Voliteľné) Supabase URL/kľúč pre auth
- [ ] Fallback katalóg aktualizovaný pred release: `npm run sync:shop-fallback`

---

## Podpora a dokumentácia

- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Shopify Checkout](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage)
- Email: dev@orostone.sk
