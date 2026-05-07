// ===========================================
// EDGE FUNCTION: subscribe-newsletter
// ===========================================
// Server-side newsletter subscription handler. Uses service-role to read/write
// `newsletter_subscribers` (anonymous SELECT/UPDATE was removed in P0-1 fix).
//
// Replaces:
//   services/newsletter.service.ts → subscribeToNewsletter()
//
// REQUEST: POST { email: string; name?: string; source: string }
// RESPONSE: 200 { success: true; alreadySubscribed?: boolean }
//           4xx { success: false; error: string }
//
// DEPLOYMENT:
//   supabase functions deploy subscribe-newsletter --project-ref <ref>
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
};

interface SubscribeBody {
  email: string;
  name?: string;
  source: string;
}

function isValidEmail(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  return v.length > 3 && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function validate(body: unknown): { ok: true; data: SubscribeBody } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid body' };
  const b = body as Record<string, unknown>;

  if (!isValidEmail(b.email)) return { ok: false, error: 'Neplatný email' };
  if (b.name !== undefined && b.name !== null && (typeof b.name !== 'string' || b.name.length > 100)) {
    return { ok: false, error: 'Neplatné meno' };
  }
  if (typeof b.source !== 'string' || b.source.length === 0 || b.source.length > 50) {
    return { ok: false, error: 'Neplatný source' };
  }

  return {
    ok: true,
    data: {
      email: (b.email as string).trim().toLowerCase(),
      name: typeof b.name === 'string' && b.name.trim() ? b.name.trim() : undefined,
      source: (b.source as string).trim(),
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

    const { email, name, source } = validated.data;

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    });

    // 1. Check if subscriber exists (service-role bypasses RLS)
    const { data: existing, error: lookupError } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .maybeSingle();

    if (lookupError) {
      console.error('[subscribe-newsletter] Lookup failed:', lookupError);
      return new Response(
        JSON.stringify({ success: false, error: 'Nepodarilo sa overiť odber' }),
        { status: 500, headers: corsHeaders },
      );
    }

    if (existing) {
      if (existing.is_active) {
        // Already active — idempotent success, no welcome email re-send
        return new Response(
          JSON.stringify({ success: true, alreadySubscribed: true }),
          { status: 200, headers: corsHeaders },
        );
      }
      // Reactivate
      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({
          is_active: true,
          unsubscribed_at: null,
          subscribed_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('[subscribe-newsletter] Reactivate failed:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Nepodarilo sa reaktivovať odber' }),
          { status: 500, headers: corsHeaders },
        );
      }
    } else {
      // New subscriber
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, name: name ?? null, source });

      if (insertError) {
        console.error('[subscribe-newsletter] Insert failed:', insertError);
        return new Response(
          JSON.stringify({ success: false, error: 'Nepodarilo sa prihlásiť na odber' }),
          { status: 500, headers: corsHeaders },
        );
      }
    }

    // 2. Send welcome email (fire-and-forget)
    fetch(`${SUPABASE_URL}/functions/v1/send-newsletter-welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ email, name }),
    }).catch((err) => console.warn('[subscribe-newsletter] Welcome email dispatch failed:', err));

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[subscribe-newsletter] Unexpected error:', msg);
    return new Response(
      JSON.stringify({ success: false, error: 'Neočakávaná chyba' }),
      { status: 500, headers: corsHeaders },
    );
  }
});
