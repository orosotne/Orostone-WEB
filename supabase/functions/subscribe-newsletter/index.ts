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
//
// KLAVIYO (od 10. 10. 2026):
//   KLAVIYO_NEWSLETTER_LIST_ID  ID zoznamu „Newsletter – web“. Kým nie je nastavené,
//                               funkcia sa správa ako doteraz (uvítací e-mail cez Resend).
//   KLAVIYO_COMPANY_ID          verejný kľúč účtu (nie je tajný), predvolene RxkFZa.
//   S nastaveným zoznamom ide odberateľ do Klaviya a uvítaciu sériu posiela flow
//   na zozname. Uvítací e-mail cez Resend odíde, len keď Klaviyo zlyhá, aby nový
//   odberateľ vždy niečo dostal. Odhlásenie spravuje Klaviyo: `is_active` v tabuľke
//   odhlásenie cez odkaz v e-maile neukáže.
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
};

const KLAVIYO_LIST_ID = Deno.env.get('KLAVIYO_NEWSLETTER_LIST_ID')?.trim() || '';
const KLAVIYO_COMPANY_ID = Deno.env.get('KLAVIYO_COMPANY_ID')?.trim() || 'RxkFZa';
const KLAVIYO_REVISION = '2026-07-15';

/**
 * Prihlási e-mail do zoznamu v Klaviyu (client API, verejný kľúč, bez tajomstva).
 * Vráti true len pri 202. Nikdy nehádže: zlyhanie Klaviya nesmie zhodiť odber na webe.
 */
async function subscribeInKlaviyo(email: string, name: string | undefined, source: string): Promise<boolean> {
  if (!KLAVIYO_LIST_ID) return false;
  const [firstName, ...rest] = (name ?? '').split(/\s+/).filter(Boolean);
  try {
    const res = await fetch(
      `https://a.klaviyo.com/client/subscriptions?company_id=${encodeURIComponent(KLAVIYO_COMPANY_ID)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
          revision: KLAVIYO_REVISION,
        },
        body: JSON.stringify({
          data: {
            type: 'subscription',
            attributes: {
              custom_source: `orostone.sk – ${source}`,
              profile: {
                data: {
                  type: 'profile',
                  attributes: {
                    email,
                    ...(firstName ? { first_name: firstName } : {}),
                    ...(rest.length ? { last_name: rest.join(' ') } : {}),
                    properties: { zdroj_odberu: source },
                    subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
                  },
                },
              },
            },
            relationships: { list: { data: { type: 'list', id: KLAVIYO_LIST_ID } } },
          },
        }),
        signal: AbortSignal.timeout(5000),
      },
    );
    if (res.status === 202) return true;
    console.error('[subscribe-newsletter] Klaviyo odmietlo odber:', res.status, (await res.text()).slice(0, 300));
    return false;
  } catch (err) {
    console.error('[subscribe-newsletter] Klaviyo nedostupné:', err instanceof Error ? err.message : err);
    return false;
  }
}

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

    // Race-safe subscribe pattern (fixes /ultrareview bug_008).
    //
    // Previous SELECT-then-INSERT/UPDATE flow had a TOCTOU race: two concurrent
    // submits for the same brand-new email both observed "no row" and both
    // INSERTed; the second hit the unique constraint on `email` and surfaced
    // a 500 to the user even though they were now subscribed.
    //
    // New flow:
    //   1. Try INSERT.
    //   2. On 23505 (unique violation) → row already exists. Re-fetch and
    //      decide whether to reactivate or return idempotent success.
    //   3. On any other error → real failure.
    //
    // Atomicity comes from the UNIQUE(email) constraint (schema.sql:54): only
    // ONE concurrent INSERT can win, the other gets 23505 deterministically.

    const insertResult = await supabase
      .from('newsletter_subscribers')
      .insert({ email, name: name ?? null, source });

    let isNewSubscriber = false;
    let isReactivated = false;

    if (!insertResult.error) {
      // 1a. Brand-new subscriber — INSERT succeeded.
      isNewSubscriber = true;
    } else if (insertResult.error.code === '23505') {
      // 1b. Row already exists. Re-fetch and decide.
      const { data: existing, error: lookupError } = await supabase
        .from('newsletter_subscribers')
        .select('id, is_active')
        .eq('email', email)
        .single();

      if (lookupError || !existing) {
        console.error('[subscribe-newsletter] Lookup after 23505 failed:', lookupError);
        return new Response(
          JSON.stringify({ success: false, error: 'Nepodarilo sa overiť odber' }),
          { status: 500, headers: corsHeaders },
        );
      }

      if (existing.is_active) {
        // Already active — idempotent success, no welcome email re-send.
        // Do Klaviya ho pošleme aj tak: kto sa odhlásil odkazom v e-maile a znova
        // sa prihlási na webe, má odber obnovený. Kto je v zozname, flow znova nedostane.
        await subscribeInKlaviyo(email, name, source);
        return new Response(
          JSON.stringify({ success: true, alreadySubscribed: true }),
          { status: 200, headers: corsHeaders },
        );
      }

      // Reactivate inactive row.
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
      isReactivated = true;
    } else {
      console.error('[subscribe-newsletter] Insert failed:', insertResult.error);
      return new Response(
        JSON.stringify({ success: false, error: 'Nepodarilo sa prihlásiť na odber' }),
        { status: 500, headers: corsHeaders },
      );
    }

    // 2. Klaviyo: zoznam „Newsletter – web“, uvítaciu sériu posiela flow na zozname.
    const inKlaviyo = await subscribeInKlaviyo(email, name, source);

    // 3. Send welcome email (fire-and-forget) only for new subscribers and
    //    reactivated unsubscribers — NOT when alreadySubscribed, and not when
    //    Klaviyo took the subscriber (its flow sends the welcome series).
    if ((isNewSubscriber || isReactivated) && !inKlaviyo) {
      fetch(`${SUPABASE_URL}/functions/v1/send-newsletter-welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ email, name }),
      }).catch((err) => console.warn('[subscribe-newsletter] Welcome email dispatch failed:', err));
    }

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
