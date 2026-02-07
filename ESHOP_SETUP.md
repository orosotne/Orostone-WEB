# Orostone E-Shop Setup Guide

Tento dokument obsahuje kompletný návod na nastavenie e-shopu Orostone.

## 📋 Prehľad komponentov

E-shop sa skladá z nasledujúcich komponentov:

### Frontend (React + TypeScript)
- **Cart System** - `context/CartContext.tsx` - localStorage persistencia
- **Auth System** - `context/AuthContext.tsx` - Supabase Auth
- **Checkout Flow** - `pages/Checkout.tsx` - 4-krokový checkout
- **Shop Page** - `pages/Shop.tsx` - produktový katalóg
- **User Account** - `pages/Account.tsx` - objednávky, adresy, nastavenia

### Backend (Supabase)
- **Database** - PostgreSQL schéma pre produkty, objednávky, zákazníkov
- **Edge Functions** - Stripe integrácia, email notifikácie
- **Storage** - Obrázky produktov
- **Auth** - Registrácia, prihlásenie, reset hesla

### Platobná brána (Stripe)
- **Payment Intents** - Bezpečné platby kartou
- **Webhooks** - Automatická aktualizácia stavu objednávok

### Emaily (Resend)
- **Potvrdenie objednávky** - Zákazníkovi
- **Notifikácia** - Adminovi o novej objednávke

---

## 🔧 Inštalácia

### 1. Environment Variables

Vytvor súbor `.env.local` v roote projektu:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe (Publishable key pre frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx  # alebo pk_test_xxx pre testovanie
```

### 2. Supabase Setup

#### A. Vytvor nový projekt na [supabase.com](https://supabase.com)

#### B. Spusti databázovú schému

V SQL editore spusti postupne:
1. `supabase/schema.sql` - základná schéma (zákazníci, dopyty)
2. `supabase/schema-eshop.sql` - e-shop schéma (produkty, objednávky)

#### C. Nastav Edge Functions secrets

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
supabase secrets set RESEND_API_KEY=re_xxx
```

#### D. Deploy Edge Functions

```bash
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
supabase functions deploy send-order-confirmation
```

### 3. Stripe Setup

#### A. Vytvor účet na [stripe.com](https://stripe.com)

#### B. Získaj API kľúče
- Dashboard → Developers → API keys
- Skopíruj `Publishable key` a `Secret key`

#### C. Nastav Webhook
- Dashboard → Developers → Webhooks
- Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- Skopíruj `Signing secret`

### 4. Resend Setup (Email)

#### A. Vytvor účet na [resend.com](https://resend.com)

#### B. Pridaj a over doménu
- Settings → Domains → Add Domain
- Pridaj DNS záznamy

#### C. Získaj API kľúč
- Settings → API Keys → Create API Key

---

## 📱 Použitie

### Pridanie produktu do košíka

```tsx
import { useCart } from '../context/CartContext';

const { addItem } = useCart();

addItem({
  productId: 'product-123',
  name: 'Carrara Statuario',
  slug: 'carrara-statuario',
  image: '/images/product.jpg',
  price: 189, // €/m²
  quantity: 1,
  dimensions: '3200 x 1600 mm',
  thickness: '12mm',
  surfaceArea: 5.12, // m² za kus
});
```

### Autentifikácia

```tsx
import { useAuth } from '../context/AuthContext';

const { signIn, signUp, signOut, isAuthenticated, user } = useAuth();

// Prihlásenie
await signIn('user@email.com', 'password');

// Registrácia
await signUp('user@email.com', 'password', 'Ján Novák');

// Odhlásenie
await signOut();
```

### Stripe Payment

```tsx
import { useStripePayment } from '../hooks/useStripe';
import { StripePaymentForm } from '../components/Checkout/StripePaymentForm';

const { createPaymentIntent } = useStripePayment();

// Vytvor payment intent
const result = await createPaymentIntent(items, shippingCost, email, name);

// Zobraz platobný formulár
<StripePaymentForm 
  clientSecret={result.clientSecret}
  onSuccess={(paymentIntentId) => { /* success */ }}
  onError={(error) => { /* error */ }}
/>
```

---

## 🗄️ Databázová schéma

### Hlavné tabuľky

| Tabuľka | Popis |
|---------|-------|
| `categories` | Kategórie produktov |
| `products` | Produkty (skladové platne) |
| `orders` | Objednávky |
| `order_items` | Položky objednávok |
| `user_addresses` | Uložené adresy zákazníkov |
| `discount_codes` | Zľavové kódy |

### Status flow objednávky

```
pending → paid → processing → shipped → delivered
                    ↓
                cancelled
```

---

## 💳 Platobné metódy

1. **Platba kartou** (Stripe)
   - Visa, Mastercard, Maestro
   - Apple Pay, Google Pay
   - Okamžité spracovanie

2. **Bankový prevod**
   - IBAN + variabilný symbol
   - Manuálne potvrdenie po prijatí platby

---

## 📧 Email šablóny

### Potvrdenie objednávky
- Odosielateľ: `objednavky@orostone.sk`
- Obsah: Číslo objednávky, položky, súhrn, platobné údaje (ak prevod)

### Admin notifikácia
- Príjemca: `info@orostone.sk`
- Obsah: Základné info o objednávke

---

## 🔒 Bezpečnosť

- **RLS (Row Level Security)** - Každý vidí len svoje dáta
- **HTTPS** - Všetka komunikácia je šifrovaná
- **Stripe PCI DSS** - Kartové údaje nikdy neprechádzajú naším serverom
- **CSRF Protection** - Supabase Auth cookies

---

## 🚀 Deployment Checklist

- [ ] Environment variables nastavené
- [ ] Supabase schéma nasadená
- [ ] Edge Functions deploynuté
- [ ] Stripe webhook nakonfigurovaný
- [ ] Resend doména overená
- [ ] Testovacia objednávka úspešná
- [ ] Produkčné Stripe kľúče aktivované

---

## 📞 Podpora

V prípade problémov kontaktujte:
- Email: dev@orostone.sk
- Dokumentácia: [Supabase Docs](https://supabase.com/docs)
- Stripe: [Stripe Docs](https://stripe.com/docs)
