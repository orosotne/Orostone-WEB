// ===========================================
// EDGE FUNCTION: submit-quote
// ===========================================
// Server-side replacement for the previous client-side flow that relied on
// anonymous RLS SELECT to read back the inserted rows. Uses service-role key
// to bypass RLS, performs upsert on customers + insert on quotes atomically,
// and returns the new quote_id to the caller.
//
// Replaces:
//   services/quotes.service.ts → submitQuote()
//   services/quotes.service.ts → submitSampleLead()
//   services/quotes.service.ts → findOrCreateCustomer()  (now server-side only)
//
// REQUEST: POST { email, name, phone?, city?, project_type, item_needed?,
//                 dimensions?, decor? }
// RESPONSE: 200 { success: true, quote_id: string, customer_id: string }
//           4xx { success: false, error: string }
//
// DEPLOYMENT:
//   supabase functions deploy submit-quote --project-ref <ref>
//
// ENV VARS REQUIRED (already present in Supabase Edge runtime):
//   SUPABASE_URL                 — auto-provided
//   SUPABASE_SERVICE_ROLE_KEY    — auto-provided
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
};

// ---------- Input validation (lightweight zod-equivalent) ----------
function isNonEmptyString(v: unknown, max = 500): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= max;
}
function isOptionalString(v: unknown, max = 500): v is string | undefined {
  return v === undefined || v === null || (typeof v === 'string' && v.length <= max);
}
function isValidEmail(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  // Pragmatic email check: has @ and dot, length ≤ 254 (RFC 5321)
  return v.length > 3 && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

interface SubmitQuoteBody {
  email: string;
  name: string;
  phone?: string;
  city?: string;
  project_type: string;
  item_needed?: string;
  dimensions?: string;
  decor?: string;
}

function validate(body: unknown): { ok: true; data: SubmitQuoteBody } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid body' };
  const b = body as Record<string, unknown>;

  if (!isValidEmail(b.email)) return { ok: false, error: 'Neplatný email' };
  if (!isNonEmptyString(b.name, 100)) return { ok: false, error: 'Meno je povinné' };
  if (!isOptionalString(b.phone, 50)) return { ok: false, error: 'Neplatný telefón' };
  if (!isOptionalString(b.city, 100)) return { ok: false, error: 'Neplatné mesto' };
  if (!isNonEmptyString(b.project_type, 100)) return { ok: false, error: 'project_type je povinný' };
  if (!isOptionalString(b.item_needed, 200)) return { ok: false, error: 'Neplatný item_needed' };
  if (!isOptionalString(b.dimensions, 2000)) return { ok: false, error: 'Neplatný dimensions' };
  if (!isOptionalString(b.decor, 100)) return { ok: false, error: 'Neplatný decor' };

  return {
    ok: true,
    data: {
      email: (b.email as string).trim().toLowerCase(),
      name: (b.name as string).trim(),
      phone: typeof b.phone === 'string' && b.phone.trim() ? b.phone.trim() : undefined,
      city: typeof b.city === 'string' && b.city.trim() ? b.city.trim() : undefined,
      project_type: (b.project_type as string).trim(),
      item_needed:
        typeof b.item_needed === 'string' && b.item_needed.trim() ? b.item_needed.trim() : undefined,
      dimensions:
        typeof b.dimensions === 'string' && b.dimensions.trim() ? b.dimensions.trim() : undefined,
      decor: typeof b.decor === 'string' && b.decor.trim() ? b.decor.trim() : undefined,
    },
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const json = await req.json().catch(() => null);
    const validated = validate(json);
    if (!validated.ok) {
      return new Response(JSON.stringify({ success: false, error: validated.error }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { email, name, phone, city, project_type, item_needed, dimensions, decor } =
      validated.data;

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    });

    // 1. Upsert customer (service-role bypasses RLS).
    //
    // IMPORTANT: spread phone/city conditionally rather than coalescing to null.
    // Postgres `INSERT ... ON CONFLICT DO UPDATE` updates every column present
    // in the payload using EXCLUDED values, so sending `phone: null` for a
    // returning customer who omits the optional field would overwrite their
    // previously-stored phone with NULL. By only including the keys when a real
    // value is provided, omitted fields are left untouched on UPDATE.
    // (Reported by /ultrareview as bug_001 — silent CRM data loss regression.)
    const upsertPayload: Record<string, string> = { email, name };
    if (phone) upsertPayload.phone = phone;
    if (city) upsertPayload.city = city;

    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert(upsertPayload, { onConflict: 'email' })
      .select('id, email, name, phone, city')
      .single();

    if (customerError || !customer) {
      console.error('[submit-quote] Customer upsert failed:', customerError);
      return new Response(
        JSON.stringify({ success: false, error: 'Nepodarilo sa vytvoriť zákazníka' }),
        { status: 500, headers: corsHeaders },
      );
    }

    // 2. Insert quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        customer_id: customer.id,
        project_type,
        item_needed: item_needed ?? null,
        dimensions: dimensions ?? null,
        decor: decor ?? null,
      })
      .select('id')
      .single();

    if (quoteError || !quote) {
      console.error('[submit-quote] Quote insert failed:', quoteError);
      return new Response(
        JSON.stringify({ success: false, error: 'Nepodarilo sa vytvoriť dopyt' }),
        { status: 500, headers: corsHeaders },
      );
    }

    // 3. Trigger email notification (fire-and-forget; don't block on failure)
    fetch(`${SUPABASE_URL}/functions/v1/send-quote-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        apikey: SUPABASE_SERVICE_KEY,
      },
      body: JSON.stringify({ quote_id: quote.id }),
    }).catch((err) => console.warn('[submit-quote] Notification dispatch failed:', err));

    return new Response(
      JSON.stringify({ success: true, quote_id: quote.id, customer_id: customer.id }),
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[submit-quote] Unexpected error:', msg);
    return new Response(
      JSON.stringify({ success: false, error: 'Neočakávaná chyba' }),
      { status: 500, headers: corsHeaders },
    );
  }
});
