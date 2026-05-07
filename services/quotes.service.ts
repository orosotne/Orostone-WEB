import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { uploadQuoteFiles } from './storage.service';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

import type { QuoteFormData, Quote } from '../types/database.types';

// ===========================================
// QUOTE SERVICE
// ===========================================
//
// SECURITY NOTE (P0-1 fix, 2026-05-07):
//   Customer + quote inserts no longer touch supabase.from(...) directly.
//   The previous flow relied on anonymous RLS SELECT/UPDATE policies on
//   `customers` and `quotes`, which exposed all PII via the public anon key
//   (anyone could `supabase.from('customers').select('*')`).
//
//   The new flow POSTs to the `submit-quote` Edge Function, which uses
//   SUPABASE_SERVICE_ROLE_KEY server-side to upsert customer + insert quote
//   atomically and return the new quote_id.
//
//   See: supabase/functions/submit-quote/index.ts
//        supabase/migrations/20260507_fix_rls_pii_leak.sql
// ===========================================

export interface SubmitQuoteResult {
  success: boolean;
  quoteId?: string;
  error?: string;
}

interface SubmitQuotePayload {
  email: string;
  name: string;
  phone?: string;
  city?: string;
  project_type: string;
  item_needed?: string;
  dimensions?: string;
  decor?: string;
}

/**
 * Calls the `submit-quote` Edge Function.
 * Returns { success, quote_id?, customer_id?, error? }.
 */
async function callSubmitQuote(payload: SubmitQuotePayload): Promise<{
  success: boolean;
  quote_id?: string;
  customer_id?: string;
  error?: string;
}> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(payload),
  });

  // Edge Function always returns JSON
  let body: { success?: boolean; quote_id?: string; customer_id?: string; error?: string };
  try {
    body = await res.json();
  } catch {
    return { success: false, error: `HTTP ${res.status}` };
  }

  if (!res.ok || !body.success) {
    return { success: false, error: body.error || `HTTP ${res.status}` };
  }
  return {
    success: true,
    quote_id: body.quote_id,
    customer_id: body.customer_id,
  };
}

/**
 * Odošle kompletný dopyt do Supabase (cez Edge Function submit-quote).
 *
 * Flow:
 *   1. POST to submit-quote → server upserts customer + inserts quote
 *   2. If files present, upload to storage with returned quote_id
 *
 * Note: file upload still uses the anonymous storage INSERT policy
 * (bucket-scoped only — `WITH CHECK (bucket_id = 'quote-files')`, no
 * path/UUID enforcement; see supabase/schema.sql storage section).
 * Tightening that policy is a separate hardening item (bug_022 follow-up).
 */
export async function submitQuote(formData: QuoteFormData): Promise<SubmitQuoteResult> {
  if (!isSupabaseConfigured()) {
    if (import.meta.env.DEV) {
      console.warn('Supabase nie je nakonfigurovaný - simulujem odoslanie');
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, quoteId: 'demo-' + Date.now() });
      }, 1500);
    });
  }

  try {
    const result = await callSubmitQuote({
      email: formData.email,
      name: formData.name,
      phone: formData.phone || undefined,
      project_type: 'Dopyt z webu',
      dimensions: formData.description || undefined,
    });

    if (!result.success || !result.quote_id) {
      return { success: false, error: result.error || 'Nepodarilo sa vytvoriť dopyt' };
    }

    // Upload files (if any) — quote_files anonymous insert policy is unchanged
    if (formData.files && formData.files.length > 0) {
      const uploadResult = await uploadQuoteFiles(result.quote_id, formData.files);
      if (!uploadResult.success && import.meta.env.DEV) {
        console.warn('Niektoré súbory sa nepodarilo nahrať:', uploadResult.errors);
      }
    }

    return { success: true, quoteId: result.quote_id };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in submitQuote:', error);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Neočakávaná chyba',
    };
  }
}

export interface SampleLeadFormData {
  name: string;
  email: string;
  phone?: string;
  dekor: string;
}

/**
 * Žiadosť o fyzickú vzorku zo Shop stránky — customers + quotes (decor).
 *
 * Email notification dispatch is now handled inside the Edge Function;
 * the client no longer fires a separate fetch to send-quote-notification.
 */
export async function submitSampleLead(data: SampleLeadFormData): Promise<SubmitQuoteResult> {
  if (!isSupabaseConfigured()) {
    if (import.meta.env.DEV) {
      console.warn('Supabase nie je nakonfigurovaný - simulujem odoslanie (vzorka)');
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, quoteId: 'demo-sample-' + Date.now() });
      }, 1500);
    });
  }

  try {
    const result = await callSubmitQuote({
      email: data.email.trim(),
      name: data.name.trim(),
      phone: data.phone?.trim() || undefined,
      project_type: 'Vzorka zadarmo (Shop)',
      decor: data.dekor,
    });

    if (!result.success || !result.quote_id) {
      return { success: false, error: result.error || 'Nepodarilo sa odoslať žiadosť' };
    }

    return { success: true, quoteId: result.quote_id };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Unexpected error in submitSampleLead:', error);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Neočakávaná chyba',
    };
  }
}

// ===========================================
// ADMIN FUNCTIONS (require authenticated session)
// ===========================================
// These functions are only callable from authenticated admin contexts.
// The "Allow authenticated full access" policies on customers/quotes still
// permit reads under an authenticated session (auth.role() = 'authenticated').

/**
 * Získa všetky dopyty (vyžaduje autentifikáciu).
 */
export async function getQuotes(status?: string): Promise<Quote[]> {
  let query = supabase
    .from('quotes')
    .select('*, customers(*)')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching quotes:', error);
    }
    return [];
  }

  return data || [];
}

/**
 * Aktualizuje status dopytu (vyžaduje autentifikáciu).
 */
export async function updateQuoteStatus(
  quoteId: string,
  status: string,
  adminNotes?: string,
): Promise<boolean> {
  const { error } = await supabase
    .from('quotes')
    .update({ status, admin_notes: adminNotes })
    .eq('id', quoteId);

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Error updating quote:', error);
    }
    return false;
  }

  return true;
}
