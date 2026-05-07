-- ===========================================
-- OROSTONE SUPABASE DATABASE SCHEMA
-- ===========================================
-- Spusti tento SQL v Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- ===========================================
-- 1. ENUMY
-- ===========================================

-- Status zákazníka (pre CRM)
CREATE TYPE customer_status AS ENUM ('lead', 'customer', 'vip');

-- Status dopytu (workflow)
CREATE TYPE quote_status AS ENUM ('new', 'in_progress', 'quoted', 'won', 'lost');

-- Typ súboru
CREATE TYPE file_type AS ENUM ('image', 'pdf', 'cad');

-- ===========================================
-- 2. TABUĽKY
-- ===========================================

-- Zákazníci (pripravené pre CRM)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    city TEXT,
    status customer_status DEFAULT 'lead',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dopyty z formulára
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    project_type TEXT NOT NULL,
    item_needed TEXT,
    dimensions TEXT,
    decor TEXT,
    status quote_status DEFAULT 'new',
    admin_notes TEXT,
    quoted_price DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Súbory k dopytom
CREATE TABLE quote_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type file_type NOT NULL,
    file_size INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter odberi
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    source TEXT NOT NULL DEFAULT 'unknown',
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

-- ===========================================
-- 3. INDEXY
-- ===========================================

CREATE INDEX idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX idx_quote_files_quote_id ON quote_files(quote_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(is_active);

-- ===========================================
-- 4. FUNKCIE PRE UPDATED_AT
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggery pre automatický update
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Zapnúť RLS na všetkých tabuľkách
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_files ENABLE ROW LEVEL SECURITY;

-- CUSTOMERS policies
-- POZOR: anonymous SELECT/UPDATE BOLI ODSTRÁNENÉ v migrácii 20260507_fix_rls_pii_leak.sql
--        (audit P0-1 — verejný anon key umožňoval čítať všetky PII).
-- Anonymous môže LEN vkladať. Reads/upserts s RETURNING idú cez Edge Function
-- supabase/functions/submit-quote/index.ts (service-role key).
CREATE POLICY "Allow anonymous insert" ON customers
    FOR INSERT
    WITH CHECK (true);

-- Authenticated (admin) má plný prístup
CREATE POLICY "Allow authenticated full access" ON customers
    FOR ALL
    USING (auth.role() = 'authenticated');

-- QUOTES policies
-- POZOR: anonymous SELECT BOLO ODSTRÁNENÉ v migrácii 20260507_fix_rls_pii_leak.sql.
-- Inserts s RETURNING idú cez Edge Function submit-quote (service-role).
CREATE POLICY "Allow anonymous insert" ON quotes
    FOR INSERT
    WITH CHECK (true);

-- Authenticated (admin) má plný prístup
CREATE POLICY "Allow authenticated full access" ON quotes
    FOR ALL
    USING (auth.role() = 'authenticated');

-- NEWSLETTER_SUBSCRIBERS policies
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- POZOR: anonymous SELECT/UPDATE BOLI ODSTRÁNENÉ v migrácii 20260507_fix_rls_pii_leak.sql.
-- Subscribe/reactivate logika je v Edge Function subscribe-newsletter (service-role).
CREATE POLICY "Allow anonymous insert" ON newsletter_subscribers
    FOR INSERT
    WITH CHECK (true);

-- Authenticated (admin) má plný prístup
CREATE POLICY "Allow authenticated full access" ON newsletter_subscribers
    FOR ALL
    USING (auth.role() = 'authenticated');

-- QUOTE_FILES policies
-- Anonymous môže nahrávať súbory
CREATE POLICY "Allow anonymous insert" ON quote_files
    FOR INSERT
    WITH CHECK (true);

-- Authenticated môže čítať
CREATE POLICY "Allow authenticated read" ON quote_files
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- ===========================================
-- 6. STORAGE BUCKET
-- ===========================================
-- Toto spusti v SQL editore ALEBO vytvor manuálne v Dashboard > Storage

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'quote-files',
    'quote-files',
    false,
    52428800, -- 50MB
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
        'application/acad',
        'application/x-acad',
        'application/autocad_dwg',
        'image/vnd.dwg',
        'application/dwg',
        'application/dxf',
        'image/vnd.dxf'
    ]
);

-- Storage policies
CREATE POLICY "Allow anonymous upload" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'quote-files');

CREATE POLICY "Allow authenticated read" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'quote-files' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'quote-files' AND auth.role() = 'authenticated');

-- ===========================================
-- 7. FUNKCIA PRE NOTIFIKÁCIE (volá Edge Function)
-- ===========================================

-- Táto funkcia sa volá po INSERT do quotes
-- a triggeruje Edge Function pre email
CREATE OR REPLACE FUNCTION notify_new_quote()
RETURNS TRIGGER AS $$
BEGIN
    -- Volanie Edge Function cez pg_net (ak je nainštalované)
    -- Alternatívne: použite Database Webhooks v Supabase Dashboard
    PERFORM pg_notify('new_quote', json_build_object(
        'quote_id', NEW.id,
        'customer_id', NEW.customer_id,
        'project_type', NEW.project_type
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_quote
    AFTER INSERT ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_quote();

-- ===========================================
-- 8. INSTAGRAM TOKEN STORAGE
-- ===========================================
-- Tabuľka pre automatické obnovenie Instagram API tokenu.
-- Token sa obnovuje cez Edge Function + pg_cron každých 50 dní.

CREATE TABLE instagram_tokens (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    access_token TEXT NOT NULL,
    token_type TEXT DEFAULT 'long_lived',
    expires_at TIMESTAMPTZ NOT NULL,
    account_id TEXT NOT NULL,
    last_refreshed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE instagram_tokens ENABLE ROW LEVEL SECURITY;

-- POZOR: anonymous SELECT BOLO ODSTRÁNENÉ v migrácii 20260507_fix_rls_pii_leak.sql.
-- Token sa NIKDY nesmie posielať do prehliadača. Frontend načítava IG feed cez
-- Edge Function supabase/functions/instagram-feed/index.ts, ktorá používa
-- SUPABASE_SERVICE_ROLE_KEY a obchádza RLS.

-- Len service_role môže čítať aj meniť (Edge Functions)
CREATE POLICY "Allow service_role write instagram token" ON instagram_tokens
    FOR ALL
    USING (auth.role() = 'service_role');

-- ===========================================
-- 9. CRON JOB — AUTOMATICKÝ REFRESH TOKENU
-- ===========================================
-- Vyžaduje pg_cron + pg_net extensions (zapnúť cez Supabase Dashboard > Database > Extensions)
--
-- Spúšťa sa každý mesiac 1. dňa o 3:00 UTC.
-- Token vydrží 60 dní — mesačný refresh dáva 30-dňový buffer.
-- POZOR: */50 v cron výraze NEFUNGUJE ako "každých 50 dní" — štandardný cron
--         to interpretuje ako deň 1,51 (čo neexistuje). Preto používame mesačný plán.
--
-- Primárny cron beží cez GitHub Actions (.github/workflows/refresh-instagram-token.yml).
-- Tento pg_cron je záložný — spusti ho AŽ PO:
--   1. zapnutí pg_cron + pg_net extensions v Supabase Dashboard
--   2. deployi Edge Function: supabase functions deploy refresh-instagram-token
--   3. nastavení app.settings cez: ALTER DATABASE postgres SET app.settings.supabase_url = '...';
--                                   ALTER DATABASE postgres SET app.settings.service_role_key = '...';

-- SELECT cron.schedule(
--   'refresh-instagram-token',
--   '0 3 1 * *',  -- každý mesiac 1. dňa o 3:00 UTC
--   $$
--   SELECT net.http_post(
--     url := current_setting('app.settings.supabase_url') || '/functions/v1/refresh-instagram-token',
--     headers := jsonb_build_object(
--       'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
--       'Content-Type', 'application/json'
--     ),
--     body := '{}'::jsonb
--   );
--   $$
-- );
