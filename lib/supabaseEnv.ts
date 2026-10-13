// ===========================================
// SUPABASE ENV — pure env check, NO SDK import
// ===========================================
// This module is intentionally tiny and import-cheap. It exposes only the
// environment check so files that just need to know "is Supabase configured?"
// (e.g. newsletter.service.ts which calls Edge Functions via fetch and never
// touches the Supabase JS client) don't drag the 168 KB `@supabase/supabase-js`
// package into the initial bundle.
//
// For the actual Supabase client, use `getSupabase()` from `lib/supabase.ts`,
// which lazy-loads the SDK on first call.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
// Publishable key `sb_publishable_…`, or the legacy anon JWT `eyJ…` until Supabase turns
// legacy keys off at the end of 2026.
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL &&
      SUPABASE_ANON_KEY &&
      SUPABASE_URL.includes('supabase.co') &&
      (SUPABASE_ANON_KEY.startsWith('sb_publishable_') || SUPABASE_ANON_KEY.startsWith('eyJ')),
  );
}

/**
 * Headers for calling our Edge Functions with the public key. The publishable key is not a
 * JWT, so it goes only in `apikey`. The legacy anon JWT also goes in `Authorization`, which
 * functions still deployed with verify_jwt = true require.
 */
export function edgeFunctionHeaders(): Record<string, string> {
  const key = SUPABASE_ANON_KEY ?? '';
  return key.startsWith('eyJ')
    ? { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` }
    : { 'Content-Type': 'application/json', apikey: key };
}

export const SUPABASE_ENV = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
} as const;
