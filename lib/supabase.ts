// ===========================================
// SUPABASE CLIENT — lazy-initialized
// ===========================================
// IMPORTANT: this module imports `@supabase/supabase-js` ONLY via dynamic
// import inside `getSupabase()`. Don't add a static `import` here or you'll
// pull the entire 168 KB SDK into the initial bundle on every page load —
// defeating the perf intent.
//
// Consumers that only need to know "is Supabase configured?" (an env-vars
// check) should import from `lib/supabaseEnv.ts` instead — that's a tiny
// module with no SDK dependency.

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { SUPABASE_ENV, isSupabaseConfigured } from './supabaseEnv';

let _client: SupabaseClient<Database> | null = null;
let _initPromise: Promise<SupabaseClient<Database>> | null = null;

/**
 * Returns the Supabase client, initializing it on first call.
 * The `@supabase/supabase-js` package is fetched as a separate chunk
 * the first time this is awaited — so it's NOT in the initial page bundle.
 *
 * Idempotent: subsequent calls return the cached client.
 */
export async function getSupabase(): Promise<SupabaseClient<Database>> {
  if (_client) return _client;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    if (!isSupabaseConfigured()) {
      console.warn(
        '[Supabase] Chýbajú environment premenné VITE_SUPABASE_URL a/alebo VITE_SUPABASE_ANON_KEY. ' +
          'Supabase funkcie nebudú dostupné. Skopírujte .env.example do .env a vyplňte hodnoty.',
      );
    }

    const { createClient } = await import('@supabase/supabase-js');

    const url = SUPABASE_ENV.url || 'https://placeholder.supabase.co';
    const key = SUPABASE_ENV.anonKey || 'placeholder-key';

    _client = isSupabaseConfigured()
      ? createClient<Database>(url, key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        })
      : createClient<Database>(url, key, {
          auth: { persistSession: false },
        });

    return _client;
  })();

  return _initPromise;
}

// Re-export the env check so existing callers don't need a second import.
// New code should prefer importing directly from `./supabaseEnv` to make the
// "I don't need the SDK" intent explicit.
export { isSupabaseConfigured };
