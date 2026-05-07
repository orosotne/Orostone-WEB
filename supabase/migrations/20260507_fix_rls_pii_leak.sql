-- ===========================================
-- Migration: Fix RLS PII leak (P0-1)
-- Date: 2026-05-07
-- ===========================================
--
-- Problem (audit P0-1):
--   The original schema (supabase/schema.sql:126-167) granted anonymous
--   SELECT/UPDATE on `customers`, `quotes`, `newsletter_subscribers`, and
--   `instagram_tokens` via `USING (true)`. The public `VITE_SUPABASE_ANON_KEY`
--   ships in every browser bundle, so any visitor could run
--     supabase.from('customers').select('*')
--   and exfiltrate the entire customer table (names, emails, phones, addresses).
--
-- Fix:
--   1. Drop all anonymous SELECT/UPDATE policies on these tables.
--   2. Anonymous INSERT policies remain — clients still need to write through
--      a thin gate. Server-side Edge Functions (using SUPABASE_SERVICE_ROLE_KEY)
--      handle reads/upserts that previously relied on RETURNING.
--   3. The `instagram-feed` Edge Function already uses service-role
--      (supabase/functions/instagram-feed/index.ts:24-25), so the anon SELECT
--      on `instagram_tokens` was never needed for legitimate usage.
--
-- Apply via:  supabase db push   (or paste into Supabase SQL Editor)
-- ===========================================

BEGIN;

-- ---------- customers ----------
DROP POLICY IF EXISTS "Allow anonymous select" ON customers;
DROP POLICY IF EXISTS "Allow anonymous update" ON customers;

-- ---------- quotes ----------
DROP POLICY IF EXISTS "Allow anonymous select" ON quotes;

-- ---------- newsletter_subscribers ----------
DROP POLICY IF EXISTS "Allow anonymous select" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow anonymous update" ON newsletter_subscribers;

-- ---------- instagram_tokens ----------
-- The anon read policy was never required: instagram-feed Edge Function uses
-- service-role key and bypasses RLS entirely.
DROP POLICY IF EXISTS "Allow anon read instagram token" ON instagram_tokens;

COMMIT;

-- ===========================================
-- Post-migration assertions (manual verification)
-- ===========================================
-- Run with the anon key (NOT service-role) in psql or via Supabase JS:
--
--   1. SELECT must FAIL or return 0 rows:
--        SELECT * FROM customers;                  -- expect: empty / RLS denied
--        SELECT * FROM quotes;                     -- expect: empty / RLS denied
--        SELECT * FROM newsletter_subscribers;     -- expect: empty / RLS denied
--        SELECT * FROM instagram_tokens;           -- expect: empty / RLS denied
--
--   2. INSERT must still succeed (used by the new Edge Functions and by direct
--      client paths that don't need the inserted row back):
--        INSERT INTO customers (email, name) VALUES ('test@x.com', 'Test');
--        -- ^ should succeed but RETURNING * will return no rows under anon RLS
--
--   3. UPDATE on customers / newsletter must FAIL (only Edge Functions can update).
--
-- ===========================================
-- Rollback (if absolutely necessary — DO NOT keep these in production)
-- ===========================================
-- BEGIN;
--   CREATE POLICY "Allow anonymous select" ON customers FOR SELECT USING (true);
--   CREATE POLICY "Allow anonymous update" ON customers FOR UPDATE USING (true);
--   CREATE POLICY "Allow anonymous select" ON quotes FOR SELECT USING (true);
--   CREATE POLICY "Allow anonymous select" ON newsletter_subscribers FOR SELECT USING (true);
--   CREATE POLICY "Allow anonymous update" ON newsletter_subscribers FOR UPDATE USING (true);
--   CREATE POLICY "Allow anon read instagram token" ON instagram_tokens FOR SELECT USING (true);
-- COMMIT;
