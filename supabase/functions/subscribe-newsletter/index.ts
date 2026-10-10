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
// KLAVIYO (od 10. 10. 2026), serverové API podľa odporúčania Klaviya:
//   KLAVIYO_NEWSLETTER_LIST_ID  ID zoznamu „Newsletter – web“ (nie je tajné).
//   KLAVIYO_PRIVATE_API_KEY     súkromný kľúč Klaviya (Lists, Profiles, Subscriptions:
//                               Full). Len v Supabase secrets, nikdy v kóde ani v logu.
//   Kým nie sú nastavené obe, funkcia sa správa ako doteraz (uvítací e-mail cez Resend).
//   S nimi ide odberateľ do Klaviya a uvítaciu sériu posiela flow na zozname. Uvítací
//   e-mail cez Resend odíde, len keď Klaviyo odber jednoznačne odmietne (4xx). Pri
//   neistom výsledku (timeout, 5xx, 429, sieť) sa odber raz zopakuje (Klaviyo je
//   idempotentné, flow znova nespustí) a uvítanie cez Resend NEodíde, lebo Klaviyo ho
//   mohlo prijať a poslalo by sa dvakrát. Ak odber neprejde, príde upozornenie na
//   ALERT_EMAIL, aby ho tím pridal ručne. Odhlásenie spravuje Klaviyo: `is_active`
//   v tabuľke odhlásenie cez odkaz v e-maile neukáže.
//   Kto je v Klaviyu odhlásený alebo potlačený (spam, ručne), celkovo alebo len z tohto
//   zoznamu, toho NEprihlasujeme: bulk subscribe by odhlásenie zrušil a formulár na webe
//   nikto neoveruje. Tím dostane upozornenie. Odpoveď 202 je len prijatá úloha, preto
//   o chvíľu na pozadí overíme, že je e-mail v zozname a prihlásený (súhlas SUBSCRIBED),
//   a ak nie, tiež upozorníme. Zoznam má jednoduché potvrdenie (single opt-in). Pri
//   dvojitom by sa súhlas zapísal až po kliknutí v e-maile a overenie po minúte by
//   upozorňovalo pri každom nepotvrdenom odbere: pri prepnutí ho treba prerobiť.
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { escapeHtml } from '../_shared/escape.ts';
import { sendEmail } from '../_shared/resend.ts';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
};

const KLAVIYO_LIST_ID = Deno.env.get('KLAVIYO_NEWSLETTER_LIST_ID')?.trim() || '';
const KLAVIYO_API_KEY = Deno.env.get('KLAVIYO_PRIVATE_API_KEY')?.trim() || '';
const KLAVIYO_REVISION = '2026-07-15';
const ALERT_EMAIL = 'dopyt@orostone.sk';

/**
 * 'ok'       Klaviyo odber prijalo (202).
 * 'rejected' Klaviyo ho jednoznačne odmietlo (4xx okrem 429, aj zlý kľúč), v zozname nie je.
 * 'unknown'  ani po dvoch pokusoch nevieme (timeout, 5xx, 429, sieť), mohol prejsť.
 * 'blocked'  v Klaviyu je odhlásený alebo potlačený (celkovo alebo z tohto zoznamu):
 *            neprihlasujeme, nič mu neposielame.
 * 'off'      Klaviyo nie je nastavené (chýba zoznam alebo kľúč).
 */
type KlaviyoResult = 'ok' | 'rejected' | 'unknown' | 'blocked' | 'off';
/** Dôvod upozornenia tímu: výsledok odberu, alebo prijatý odber, ktorý sa v zozname neobjavil ako prihlásený. */
type AlertReason = 'rejected' | 'unknown' | 'blocked' | 'unconfirmed';

/**
 * Potlačenia, ktoré bulk subscribe zruší (a neoverený formulár zrušiť nesmie). Spam: dokumentácia
 * bulk subscribe píše SPAM_REPORT, profil SPAM_COMPLAINT, berieme oboje.
 */
const OPT_OUT_REASONS = new Set(['UNSUBSCRIBE', 'SPAM_REPORT', 'SPAM_COMPLAINT', 'USER_SUPPRESSED']);
/** Kedy po prijatí odberu overiť, že je e-mail v zozname prihlásený (Klaviyo ho spracúva asynchrónne). */
const VERIFY_AFTER_MS = [15_000, 45_000];

function klaviyoPost(path: string, payload: unknown): Promise<Response> {
  return fetch(`https://a.klaviyo.com/api/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
      revision: KLAVIYO_REVISION,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000),
  });
}

function klaviyoGet(pathAndQuery: string): Promise<Response> {
  return fetch(`https://a.klaviyo.com/api/${pathAndQuery}`, {
    headers: {
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      Accept: 'application/vnd.api+json',
      revision: KLAVIYO_REVISION,
    },
    signal: AbortSignal.timeout(5000),
  });
}

/** Filter Klaviya na jeden e-mail. Úvodzovky a spätné lomky by filter rozbili, také e-maily nepustíme. */
function emailFilter(email: string): string | null {
  return /["\\]/.test(email) ? null : encodeURIComponent(`equals(email,"${email}")`);
}

/** E-mailový marketing z profilu Klaviya (`additional-fields[profile]=subscriptions`). */
interface EmailMarketing {
  consent?: unknown;
  suppression?: Array<{ reason?: unknown } | null>;
  list_suppressions?: Array<{ list_id?: unknown; reason?: unknown } | null>;
}

function emailMarketing(profile: unknown): EmailMarketing | null {
  const m = (profile as { attributes?: { subscriptions?: { email?: { marketing?: unknown } } } } | null | undefined)
    ?.attributes?.subscriptions?.email?.marketing;
  return m && typeof m === 'object' ? (m as EmailMarketing) : null;
}

/**
 * Odhlásený alebo potlačený celkovo, alebo len z nášho zoznamu? Odhlásenie zo zoznamu je
 * v `list_suppressions` a súhlas pri ňom môže ostať SUBSCRIBED (účet bez globálneho odhlásenia).
 */
function optedOut(m: EmailMarketing): boolean {
  const optOut = (s: { reason?: unknown } | null) => OPT_OUT_REASONS.has(String(s?.reason));
  const global = Array.isArray(m.suppression) && m.suppression.some(optOut);
  const ourList = Array.isArray(m.list_suppressions)
    && m.list_suppressions.some((s) => s?.list_id === KLAVIYO_LIST_ID && optOut(s));
  return m.consent === 'UNSUBSCRIBED' || global || ourList;
}

/** Je e-mail v Klaviyu odhlásený alebo potlačený? 'unknown' = nevieme (chyba, divný e-mail). */
async function klaviyoOptOutState(email: string): Promise<'free' | 'opted-out' | 'unknown'> {
  const filter = emailFilter(email);
  if (!filter) return 'unknown';
  try {
    const res = await klaviyoGet(`profiles?filter=${filter}&additional-fields[profile]=subscriptions`);
    if (!res.ok) {
      console.error('[subscribe-newsletter] Klaviyo profil (kontrola odhlásenia):', res.status, (await res.text()).slice(0, 300));
      return 'unknown';
    }
    const marketing = emailMarketing((await res.json())?.data?.[0]);
    return marketing && optedOut(marketing) ? 'opted-out' : 'free';
  } catch (err) {
    console.error('[subscribe-newsletter] Klaviyo profil (kontrola odhlásenia):', err instanceof Error ? err.message : err);
    return 'unknown';
  }
}

/**
 * Po prijatí odberu (202) overí, že je e-mail v zozname A prihlásený (súhlas SUBSCRIBED, bez
 * odhlásenia). Samotné členstvo nestačí, do zoznamu sa dá dostať aj bez súhlasu. Ak ani po minúte
 * nie, upozorní tím.
 */
async function verifySubscribed(email: string, source: string): Promise<void> {
  const filter = emailFilter(email);
  for (const waitMs of VERIFY_AFTER_MS) {
    await new Promise((r) => setTimeout(r, waitMs));
    try {
      const res = await klaviyoGet(`lists/${KLAVIYO_LIST_ID}/profiles?filter=${filter}&additional-fields[profile]=subscriptions`);
      const marketing = res.ok ? emailMarketing((await res.json())?.data?.[0]) : null;
      if (marketing?.consent === 'SUBSCRIBED' && !optedOut(marketing)) return;
    } catch {
      // ďalší pokus alebo upozornenie nižšie
    }
  }
  await alertKlaviyoFailure(email, source, 'unconfirmed');
}

/** Pauza pred druhým pokusom: Retry-After z odpovede (429/503), najviac 3 s, inak 0,8 s. */
function retryDelayMs(res: Response | null): number {
  const seconds = Number(res?.headers.get('Retry-After'));
  return Number.isFinite(seconds) && seconds > 0 ? Math.min(seconds * 1000, 3000) : 800;
}

/** Meno a zdroj do profilu. Odber ich nenesie, preto zvlášť. Nehádže, odber nezastaví. */
async function upsertKlaviyoProfile(email: string, name: string | undefined, source: string): Promise<void> {
  const [firstName, ...rest] = (name ?? '').split(/\s+/).filter(Boolean);
  try {
    const res = await klaviyoPost('profile-import', {
      data: {
        type: 'profile',
        attributes: {
          email,
          ...(firstName ? { first_name: firstName } : {}),
          ...(rest.length ? { last_name: rest.join(' ') } : {}),
          properties: { zdroj_odberu: source },
        },
      },
    });
    if (!res.ok) console.error('[subscribe-newsletter] Klaviyo profil:', res.status, (await res.text()).slice(0, 300));
  } catch (err) {
    console.error('[subscribe-newsletter] Klaviyo profil:', err instanceof Error ? err.message : err);
  }
}

/**
 * Prihlási e-mail do zoznamu v Klaviyu (serverové API, súkromný kľúč).
 * Nikdy nehádže: zlyhanie Klaviya nesmie zhodiť odber na webe.
 */
async function subscribeInKlaviyo(email: string, name: string | undefined, source: string): Promise<KlaviyoResult> {
  if (!KLAVIYO_LIST_ID || !KLAVIYO_API_KEY) return 'off';
  const optOut = await klaviyoOptOutState(email);
  if (optOut === 'opted-out') return 'blocked';
  if (optOut === 'unknown') return 'unknown';
  inBackground(upsertKlaviyoProfile(email, name, source));
  const payload = {
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        custom_source: `orostone.sk – ${source}`,
        profiles: {
          data: [{ type: 'profile', attributes: { email, subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } } } }],
        },
      },
      relationships: { list: { data: { type: 'list', id: KLAVIYO_LIST_ID } } },
    },
  };

  for (let attempt = 1; attempt <= 2; attempt++) {
    let res: Response | null = null;
    try {
      res = await klaviyoPost('profile-subscription-bulk-create-jobs', payload);
      if (res.status === 202) {
        inBackground(verifySubscribed(email, source));
        return 'ok';
      }
      const detail = (await res.text()).slice(0, 300);
      if (res.status >= 400 && res.status < 500 && res.status !== 429) {
        console.error('[subscribe-newsletter] Klaviyo odmietlo odber:', res.status, detail);
        return 'rejected';
      }
      console.error(`[subscribe-newsletter] Klaviyo pokus ${attempt}:`, res.status, detail);
    } catch (err) {
      console.error(`[subscribe-newsletter] Klaviyo pokus ${attempt}:`, err instanceof Error ? err.message : err);
    }
    if (attempt === 1) await new Promise((r) => setTimeout(r, retryDelayMs(res)));
  }
  return 'unknown';
}

/** Na pozadí, aby upozornenie nepredĺžilo odpoveď webu (Supabase Edge Runtime: waitUntil). */
function inBackground(task: Promise<unknown>): void {
  const runtime = (globalThis as { EdgeRuntime?: { waitUntil(p: Promise<unknown>): void } }).EdgeRuntime;
  if (runtime?.waitUntil) runtime.waitUntil(task);
  else task.catch(() => {});
}

const ALERT_TEXT: Record<AlertReason, { what: string; todo: string }> = {
  rejected: {
    what: 'Do zoznamu „Newsletter – web“ v Klaviyu sa nedostal: Klaviyo odber odmietlo.',
    todo: 'Pridajte e-mail do zoznamu v Klaviyu ručne (Zoznamy → Newsletter – web).',
  },
  unknown: {
    what: 'Do zoznamu „Newsletter – web“ v Klaviyu sa možno nedostal: Klaviyo neodpovedalo ani na druhý pokus.',
    todo: 'Overte, či už v zozname nie je, a ak nie, pridajte ho ručne (Zoznamy → Newsletter – web).',
  },
  unconfirmed: {
    what: 'Klaviyo odber prijalo, ale ani po minúte nie je v zozname „Newsletter – web“ prihlásený: v zozname chýba alebo nemá súhlas so zasielaním e-mailov.',
    todo: 'Pozrite si jeho profil v Klaviyu. Ak v zozname nie je alebo nie je prihlásený, pridajte ho do zoznamu ručne (Zoznamy → Newsletter – web).',
  },
  blocked: {
    what: 'Do Klaviya sme ho neprihlásili: v Klaviyu je odhlásený (celkovo alebo z tohto zoznamu) alebo e-mail nahlásil ako spam. Formulár na webe nikto neoveruje, takže automatické prihlásenie by mohlo zrušiť cudzie odhlásenie.',
    todo: 'Ak sa naozaj chce vrátiť (napr. vám napísal), pridajte ho do zoznamu ručne. Inak netreba robiť nič.',
  },
};

/** Odber do Klaviya neprešiel, je neistý alebo zablokovaný: tím rozhodne ručne. Nikdy nehádže. */
async function alertKlaviyoFailure(email: string, source: string, reason: AlertReason): Promise<void> {
  const text = ALERT_TEXT[reason];
  try {
    await sendEmail({
      from: 'Orostone web <noreply@orostone.sk>',
      to: ALERT_EMAIL,
      subject: 'Newsletter: odber sa nepreniesol do Klaviya',
      html: `<p>E-mail <strong>${escapeHtml(email)}</strong> sa na webe prihlásil na odber (${escapeHtml(source)}). ${text.what}</p>
<p>V databáze webu je odber uložený. ${text.todo}</p>`,
      onMissingKey: 'skip',
    });
  } catch (err) {
    console.error('[subscribe-newsletter] Upozornenie sa neodoslalo:', err instanceof Error ? err.message : err);
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
        const again = await subscribeInKlaviyo(email, name, source);
        if (again === 'rejected' || again === 'unknown' || again === 'blocked') inBackground(alertKlaviyoFailure(email, source, again));
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
    const klaviyo = await subscribeInKlaviyo(email, name, source);
    if (klaviyo === 'rejected' || klaviyo === 'unknown' || klaviyo === 'blocked') inBackground(alertKlaviyoFailure(email, source, klaviyo));

    // 3. Send welcome email (fire-and-forget) only for new subscribers and
    //    reactivated unsubscribers — NOT when alreadySubscribed. With Klaviyo on,
    //    only when it definitely rejected the subscriber: after 'ok' its flow sends
    //    the welcome series, after 'unknown' it may have (no double welcome).
    if ((isNewSubscriber || isReactivated) && (klaviyo === 'off' || klaviyo === 'rejected')) {
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
