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
--   1. Drop ALL anonymous policies (SELECT/UPDATE/INSERT) on the four PII
--      tables. After this PR, every legitimate write goes through Edge Functions
--      (submit-quote, subscribe-newsletter) using SUPABASE_SERVICE_ROLE_KEY,
--      which bypasses RLS. The remaining anon-INSERT-but-no-anon-SELECT path
--      was itself an attack surface (validators in the Edge Functions could
--      be bypassed by writing directly to /rest/v1/<table> with the anon key)
--      — see /ultrareview bug_021.
--   2. Lowercase existing emails so the new server-side `lower()` write path
--      lines up with legacy mixed-case rows (avoids silent CRM duplication —
--      /ultrareview bug_014).
--   3. Self-assertion: fail the migration loudly if any anon policy survives
--      on these four tables (defense against schema drift /
--      DROP-POLICY-IF-EXISTS silent no-op — /ultrareview bug_020).
--
-- The `instagram-feed` and `submit-quote`/`subscribe-newsletter` Edge Functions
-- use service-role (verified at supabase/functions/instagram-feed/index.ts:24-25),
-- so the anon SELECT on `instagram_tokens` was never needed for legitimate
-- usage and dropping all anon policies on `customers`/`quotes`/`newsletter_subscribers`
-- does NOT break any legitimate flow.
--
-- The `quote_files` table KEEPS its anon-INSERT policy because the storage
-- upload path in `services/storage.service.ts` writes there directly and
-- the row is gated by an unguessable UUID `quote_id` foreign key.
--
-- Apply via:  supabase db push   (or paste into Supabase SQL Editor)
-- ===========================================

BEGIN;

-- ===========================================
-- Step 1: Normalize existing email case (bug_014)
-- ===========================================
-- The Edge Functions submit-quote and subscribe-newsletter normalize emails
-- to lowercase before upsert. Legacy rows may have mixed-case emails (e.g.
-- "User@Example.com") because the previous client-side flow did not lowercase.
-- Without this UPDATE, a returning user's submission creates a *second* row
-- (case-sensitive UNIQUE) → silent CRM duplication.
--
-- If a unique-violation occurs here (rare: both "Foo@x.com" AND "foo@x.com"
-- already exist as separate rows), the migration ROLLBACKs and the operator
-- must manually deduplicate before retrying. Better to fail loudly than to
-- silently lose data.

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

-- ---------- quotes ----------
DROP POLICY IF EXISTS "Allow anonymous select" ON quotes;
DROP POLICY IF EXISTS "Allow anonymous insert" ON quotes;

-- ---------- newsletter_subscribers ----------
DROP POLICY IF EXISTS "Allow anonymous select" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow anonymous update" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow anonymous insert" ON newsletter_subscribers;

-- ---------- instagram_tokens ----------
-- The anon read policy was never required: instagram-feed Edge Function uses
-- service-role key and bypasses RLS entirely.
DROP POLICY IF EXISTS "Allow anon read instagram token" ON instagram_tokens;

-- NOTE: `quote_files.Allow anonymous insert` is INTENTIONALLY KEPT because
-- services/storage.service.ts writes there directly after a successful
-- submit-quote returns the new quote_id. Tightening that policy is tracked
-- as a separate hardening item (see /ultrareview bug_022 follow-up).

-- ===========================================
-- Step 3: Self-assertion (bug_020)
-- ===========================================
-- Fail loudly if any anon SELECT/UPDATE/INSERT policy survives on the four
-- PII tables. Catches:
--   - Schema drift (a dashboard-renamed policy whose name didn't match the
--     literal DROP statements above).
--   - Future regressions if someone re-adds an anon policy by mistake.
DO $$
DECLARE bad_count int;
BEGIN
  SELECT count(*) INTO bad_count
    FROM pg_policies
   WHERE tablename IN ('customers', 'quotes', 'newsletter_subscribers', 'instagram_tokens')
     AND (
           'public' = ANY(roles)
           OR 'anon' = ANY(roles)
           OR policyname ILIKE '%anon%'
         );
  IF bad_count > 0 THEN
    RAISE EXCEPTION
      'P0-1 fix incomplete: % anon polic(ies) still present on PII tables. '
      'Possible schema drift — run: '
      'SELECT * FROM pg_policies WHERE tablename IN (''customers'',''quotes'',''newsletter_subscribers'',''instagram_tokens'')',
      bad_count;
  END IF;
END$$;

COMMIT;

-- ===========================================
-- Post-migration smoke tests (manual, with anon key — NOT service-role)
-- ===========================================
--
--   1. SELECT must FAIL or return 0 rows on the four PII tables:
--        SELECT * FROM customers;                  -- expect: empty / RLS denied
--        SELECT * FROM quotes;                     -- expect: empty / RLS denied
--        SELECT * FROM newsletter_subscribers;     -- expect: empty / RLS denied
--        SELECT * FROM instagram_tokens;           -- expect: empty / RLS denied
--
--   2. Direct INSERT bypassing the Edge Function must FAIL:
--        INSERT INTO customers (email, name) VALUES ('test@x.com', 'Test');
--        -- expect: RLS-denied (legitimate inserts go through submit-quote
--        --         Edge Function which uses service-role).
--
--   3. UPDATE on customers / newsletter_subscribers must FAIL.
--
--   4. The Edge Functions (called via fetch with the anon key, server hands
--      off to service-role internally) must still succeed end-to-end:
--        - POST /functions/v1/submit-quote        → 200 with quote_id
--        - POST /functions/v1/subscribe-newsletter → 200 with success=true
--
-- ===========================================
-- Rollback (if absolutely necessary — DO NOT keep these in production)
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
