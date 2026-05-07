-- ===========================================
-- Migration: Fix RLS PII leak (P0-1)
-- Date: 2026-05-07
-- Applied to prod: 2026-05-07 ~10:55 UTC
-- ===========================================
--
-- Problem (audit P0-1):
--   The original schema (supabase/schema.sql) granted anonymous SELECT/UPDATE
--   on `customers`, `quotes`, `newsletter_subscribers`, and `instagram_tokens`
--   via `USING (true)`. The public `VITE_SUPABASE_ANON_KEY` ships in every
--   browser bundle, so any visitor could exfiltrate the entire customer table
--   with one line:  supabase.from('customers').select('*')
--
-- Fix:
--   1. Drop ALL anonymous policies (SELECT/UPDATE/INSERT) on the four PII
--      tables. After this PR, every legitimate write goes through Edge
--      Functions (submit-quote, subscribe-newsletter) using
--      SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
--   2. Lowercase existing emails so the new server-side `lower()` write path
--      matches legacy mixed-case rows (avoids silent CRM duplication).
--   3. Self-assertion: fail loudly if any unrestricted policy survives.
--
-- The `quote_files.Allow anonymous insert` policy is INTENTIONALLY KEPT —
-- services/storage.service.ts writes there directly with an unguessable UUID
-- quote_id from submit-quote. Tightening that policy is a separate item.
--
-- Apply via:  supabase db push   (or paste into Supabase SQL Editor)
-- ===========================================

BEGIN;

-- ===========================================
-- Step 1: Normalize existing email case
-- ===========================================
UPDATE customers
   SET email = lower(email)
 WHERE email <> lower(email);

UPDATE newsletter_subscribers
   SET email = lower(email)
 WHERE email <> lower(email);

-- ===========================================
-- Step 2: Drop all anonymous policies on PII tables
-- ===========================================

-- ---------- customers ----------
DROP POLICY IF EXISTS "Allow anonymous select" ON customers;
DROP POLICY IF EXISTS "Allow anonymous update" ON customers;
DROP POLICY IF EXISTS "Allow anonymous insert" ON customers;
-- Production drift: prod DB had this name (created via Supabase Dashboard
-- "Enable INSERT for anon role" template) instead of "Allow anonymous insert"
-- from schema.sql. Both DROPs ensure fresh-deploy AND prod-drift work.
DROP POLICY IF EXISTS "Enable insert for anon" ON customers;

-- ---------- quotes ----------
DROP POLICY IF EXISTS "Allow anonymous select" ON quotes;
DROP POLICY IF EXISTS "Allow anonymous insert" ON quotes;
DROP POLICY IF EXISTS "Enable insert for anon" ON quotes;          -- prod drift

-- ---------- newsletter_subscribers ----------
DROP POLICY IF EXISTS "Allow anonymous select" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow anonymous update" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow anonymous insert" ON newsletter_subscribers;

-- ---------- instagram_tokens ----------
DROP POLICY IF EXISTS "Allow anon read instagram token" ON instagram_tokens;

-- ===========================================
-- Step 3: Self-assertion (bug_020)
-- ===========================================
-- Catches any UNRESTRICTED policy (USING true / WITH CHECK true) on the four
-- PII tables. Does NOT match `roles = {public}` because legitimate auth
-- policies have that by default — their USING clause is what restricts them.
DO $$
DECLARE bad_count int;
BEGIN
  SELECT count(*) INTO bad_count
    FROM pg_policies
   WHERE tablename IN ('customers', 'quotes', 'newsletter_subscribers', 'instagram_tokens')
     AND (qual::text = 'true' OR with_check::text = 'true');
  IF bad_count > 0 THEN
    RAISE EXCEPTION
      'P0-1 fix incomplete: % unrestricted polic(ies) still present on PII '
      'tables. Run: SELECT tablename, policyname, qual::text, with_check::text '
      'FROM pg_policies WHERE tablename IN '
      '(''customers'',''quotes'',''newsletter_subscribers'',''instagram_tokens'') '
      'AND (qual::text = ''true'' OR with_check::text = ''true'');',
      bad_count;
  END IF;
END$$;

COMMIT;

-- ===========================================
-- Post-migration smoke tests (manual, with anon key)
-- ===========================================
--   1. SELECT must FAIL or return 0 rows on the four PII tables.
--   2. Direct INSERT bypassing Edge Function must FAIL.
--   3. UPDATE on customers / newsletter must FAIL.
--   4. Edge Functions must succeed end-to-end:
--        - POST /functions/v1/submit-quote        → 200 with quote_id
--        - POST /functions/v1/subscribe-newsletter → 200 with success=true
--
-- ===========================================
-- Rollback (DO NOT keep these in production)
-- ===========================================
-- BEGIN;
--   CREATE POLICY "Allow anonymous insert" ON customers FOR INSERT WITH CHECK (true);
--   CREATE POLICY "Allow anonymous select" ON customers FOR SELECT USING (true);
--   CREATE POLICY "Allow anonymous update" ON customers FOR UPDATE USING (true);
--   CREATE POLICY "Allow anonymous insert" ON quotes FOR INSERT WITH CHECK (true);
--   CREATE POLICY "Allow anonymous select" ON quotes FOR SELECT USING (true);
--   CREATE POLICY "Allow anonymous insert" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
--   CREATE POLICY "Allow anonymous select" ON newsletter_subscribers FOR SELECT USING (true);
--   CREATE POLICY "Allow anonymous update" ON newsletter_subscribers FOR UPDATE USING (true);
--   CREATE POLICY "Allow anon read instagram token" ON instagram_tokens FOR SELECT USING (true);
-- COMMIT;
