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
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL &&
      SUPABASE_ANON_KEY &&
      SUPABASE_URL.includes('supabase.co') &&
      SUPABASE_ANON_KEY.startsWith('eyJ'),
  );
}

export const SUPABASE_ENV = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
} as const;
