// Newsletter calls Edge Functions via fetch — no Supabase JS SDK needed.
// Importing only the lightweight env check keeps @supabase/supabase-js OUT
// of the initial bundle (~168 KB / 43 KB gzip saved).
import { isSupabaseConfigured } from '../lib/supabaseEnv';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// ===========================================
// NEWSLETTER SERVICE
// ===========================================
//
// SECURITY NOTE (P0-1 fix, 2026-05-07):
//   Newsletter subscription no longer reads/updates `newsletter_subscribers`
//   directly from the browser. The previous flow used anonymous RLS SELECT/UPDATE
//   policies which let any visitor enumerate and modify the entire subscriber list.
//
//   The new flow POSTs to the `subscribe-newsletter` Edge Function, which uses
//   SUPABASE_SERVICE_ROLE_KEY server-side. The welcome email dispatch is also
//   moved server-side.
//
//   See: supabase/functions/subscribe-newsletter/index.ts
//        supabase/migrations/20260507_fix_rls_pii_leak.sql
// ===========================================

export interface NewsletterSubscribeData {
  email: string;
  name?: string;
  source: string;
}

export interface NewsletterSubscribeResult {
  success: boolean;
  alreadySubscribed?: boolean;
  error?: string;
}

export async function subscribeToNewsletter(
  data: NewsletterSubscribeData,
): Promise<NewsletterSubscribeResult> {
  if (!isSupabaseConfigured()) {
    if (import.meta.env.DEV) {
      await new Promise((r) => setTimeout(r, 800));
      console.log('[newsletter DEV] Simulovaný subscribe pre:', data.email);
      return { success: true };
    }
    return { success: false, error: 'Služba momentálne nie je dostupná.' };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/subscribe-newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        source: data.source,
      }),
    });

    let body: { success?: boolean; alreadySubscribed?: boolean; error?: string };
    try {
      body = await res.json();
    } catch {
      return { success: false, error: `HTTP ${res.status}` };
    }

    if (!res.ok || !body.success) {
      return {
        success: false,
        error: body.error || `Nepodarilo sa prihlásiť na odber (HTTP ${res.status})`,
      };
    }

    return {
      success: true,
      alreadySubscribed: body.alreadySubscribed,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[newsletter] Network error:', error);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Neočakávaná chyba',
    };
  }
}
