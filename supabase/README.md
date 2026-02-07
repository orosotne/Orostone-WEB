# Supabase Backend Setup pre Orostone

## Rýchly štart

### 1. Vytvor Supabase projekt
1. Choď na [supabase.com](https://supabase.com) a vytvor nový projekt
2. Počkaj kým sa projekt inicializuje (~2 minúty)

### 2. Spusti databázovú schému
1. V Supabase Dashboard choď do **SQL Editor**
2. Vytvor nový query
3. Skopíruj obsah súboru `supabase/schema.sql`
4. Klikni **Run** (F5)

### 3. Nastav Environment Variables
Vytvor súbor `.env.local` v root priečinku projektu:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Tieto hodnoty nájdeš v **Settings > API** v Supabase Dashboard.

### 4. (Voliteľné) Nastav Email Notifikácie

#### Resend Setup
1. Vytvor účet na [resend.com](https://resend.com)
2. Verifikuj doménu `orostone.sk`
3. Vytvor API kľúč

#### Database Webhook
1. V Supabase Dashboard choď do **Database > Webhooks**
2. Vytvor nový webhook:
   - **Name:** `send-quote-notification`
   - **Table:** `quotes`
   - **Events:** INSERT
   - **Type:** Supabase Edge Functions
   - **Function:** `send-quote-notification`

#### Deploy Edge Function
```bash
# Nainštaluj Supabase CLI
npm install -g supabase

# Prihlás sa
supabase login

# Linkni projekt
supabase link --project-ref YOUR_PROJECT_REF

# Nastav secret
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx

# Deploy
supabase functions deploy send-quote-notification
```

## Štruktúra súborov

```
supabase/
├── schema.sql                      # Databázová schéma
├── functions/
│   └── send-quote-notification/
│       └── index.ts                # Edge Function pre emaily
└── README.md                       # Tento súbor

lib/
└── supabase.ts                     # Supabase client

services/
├── quotes.service.ts               # API pre dopyty
└── storage.service.ts              # File upload

types/
└── database.types.ts               # TypeScript typy
```

## Databázové tabuľky

| Tabuľka | Popis |
|---------|-------|
| `customers` | Zákazníci (pripravené pre CRM) |
| `quotes` | Dopyty z formulára |
| `quote_files` | Nahrané súbory k dopytom |

## Storage Bucket

- **Názov:** `quote-files`
- **Max veľkosť:** 50MB
- **Povolené typy:** JPG, PNG, WebP, PDF, DWG, DXF

## Testovanie

Bez nakonfigurovaného Supabase bude formulár fungovať v "demo" móde - údaje sa neuložia, ale UI bude plne funkčné.

## Budúce rozšírenia

Databázová štruktúra je pripravená pre:
- 📊 **Admin Panel** - správa dopytov
- 👥 **CRM** - sledovanie zákazníkov
- 💰 **Cenové ponuky** - `quotes.quoted_price`
- 📁 **Workflow** - `quotes.status` (new → in_progress → quoted → won/lost)

## Podpora

V prípade problémov kontaktuj: info@orostone.sk

