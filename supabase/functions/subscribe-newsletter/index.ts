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
//   v tabuľke odhlásenie cez odkaz v e-maile neukáže. Riadky odhlásených raz denne
//   zmaže sync-newsletter-unsubscribes (zásady: výmaz do 30 dní po odvolaní súhlasu).
//   Kto už je v zozname prihlásený, nedostane novú úlohu odberu (Klaviyo radí najviac
//   jednu za 30 minút). Čas posledného pokusu o odber je v stĺpci `klaviyo_attempted_at`
//   (migrácia 20261011_newsletter_klaviyo_attempt.sql), dátum súhlasu ostáva v
//   `subscribed_at`. Opakované odoslanie formulára do 30 minút od pokusu Klaviyo nevolá
//   vôbec a z dvoch súbežných požiadaviek si pokus podmieneným UPDATE vezme len jedna.
//   Meno a zdroj zapíšeme len do nového profilu: formulár nikto neoveruje a existujúci
//   profil by si inak mohol ktokoľvek prepísať.
//   Kto je v Klaviyu odhlásený alebo potlačený (spam, ručne), celkovo alebo len z tohto
//   zoznamu, toho NEprihlasujeme: bulk subscribe by odhlásenie zrušil a formulár na webe
//   nikto neoveruje. Tím dostane upozornenie. Odpoveď 202 je len prijatá úloha, preto
//   o chvíľu na pozadí overíme, že je e-mail v zozname a prihlásený (súhlas SUBSCRIBED),
//   a ak nie, tiež upozorníme. Zoznam má jednoduché potvrdenie (single opt-in). Pri
//   dvojitom by sa súhlas zapísal až po kliknutí v e-maile a overenie po minúte by
//   upozorňovalo pri každom nepotvrdenom odbere: pri prepnutí ho treba prerobiť.
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { escapeHtml } from '../_shared/escape.ts';
import {
  emailFilter,
  emailMarketing,
  KLAVIYO_LIST_ID,
  klaviyoEnabled,
  klaviyoGet,
  klaviyoPost,
  optedOut,
} from '../_shared/klaviyo.ts';
import { sendEmail } from '../_shared/resend.ts';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
};

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

/** Kedy po prijatí odberu overiť, že je e-mail v zozname prihlásený (Klaviyo ho spracúva asynchrónne). */
const VERIFY_AFTER_MS = [15_000, 45_000];
/** Opakované odoslanie formulára do tohto času od posledného pokusu o odber (dvojklik, dve karty) už rieši prvá požiadavka. */
const RESUBMIT_WINDOW_MS = 30 * 60 * 1000;

/** Čas pokusu o odber v Klaviyu pre zápis do riadku. Bez Klaviya stĺpec nepoužívame. */
const attemptStamp = () => (klaviyoEnabled() ? { klaviyo_attempted_at: new Date().toISOString() } : {});

/**
 * Atomicky si vezme pokus o odber v Klaviyu pre existujúci riadok: uspeje, len keď posledný
 * pokus bol pred viac ako RESUBMIT_WINDOW_MS alebo žiadny. Podmienený UPDATE nad jedným
 * riadkom pustí z dvoch súbežných požiadaviek len jednu. Pri chybe databázy Klaviyo
 * nevoláme, aby nevznikla druhá úloha odberu.
 */
async function claimKlaviyoAttempt(supabase: SupabaseClient, id: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - RESUBMIT_WINDOW_MS).toISOString();
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .update({ klaviyo_attempted_at: new Date().toISOString() })
    .eq('id', id)
    .or(`klaviyo_attempted_at.is.null,klaviyo_attempted_at.lt."${cutoff}"`)
    .select('id');
  if (error) {
    console.error('[subscribe-newsletter] Klaviyo attempt claim failed:', error.message);
    return false;
  }
  return (data?.length ?? 0) > 0;
}

/**
 * Stav e-mailu v Klaviyu pred odberom:
 *   'subscribed' v zozname a prihlásený: novú úlohu netreba,
 *   'opted-out'  odhlásený alebo potlačený, celkovo alebo z tohto zoznamu: neprihlasujeme,
 *   'free'       môžeme prihlásiť, `exists` hovorí, či profil už existuje,
 *   'unknown'    nevieme (chyba, divný e-mail): naslepo neprihlasujeme.
 */
interface PreState {
  state: 'subscribed' | 'opted-out' | 'free' | 'unknown';
  exists: boolean;
}

async function unknownFrom(what: string, res: Response): Promise<PreState> {
  console.error(`[subscribe-newsletter] Klaviyo ${what} (kontrola pred odberom):`, res.status, (await res.text()).slice(0, 300));
  return { state: 'unknown', exists: false };
}

async function klaviyoState(email: string): Promise<PreState> {
  const filter = emailFilter(email);
  if (!filter) return { state: 'unknown', exists: false };
  try {
    // Najprv zoznam: kto v ňom je prihlásený, toho netreba prihlasovať znova.
    const inList = await klaviyoGet(`lists/${KLAVIYO_LIST_ID}/profiles?filter=${filter}&additional-fields[profile]=subscriptions`);
    if (!inList.ok) return await unknownFrom('zoznam', inList);
    const member = emailMarketing((await inList.json())?.data?.[0]);
    if (member) {
      if (optedOut(member)) return { state: 'opted-out', exists: true };
      return { state: member.consent === 'SUBSCRIBED' ? 'subscribed' : 'free', exists: true };
    }
    // Mimo zoznamu môže profil existovať z iného zdroja (odhlásený, potlačený, s menom z CRM).
    const res = await klaviyoGet(`profiles?filter=${filter}&additional-fields[profile]=subscriptions`);
    if (!res.ok) return await unknownFrom('profil', res);
    const profile = (await res.json())?.data?.[0];
    const marketing = emailMarketing(profile);
    return { state: marketing && optedOut(marketing) ? 'opted-out' : 'free', exists: Boolean(profile) };
  } catch (err) {
    console.error('[subscribe-newsletter] Klaviyo (kontrola pred odberom):', err instanceof Error ? err.message : err);
    return { state: 'unknown', exists: false };
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

/** Meno a zdroj do nového profilu. Odber ich nenesie, preto zvlášť. Nehádže, odber nezastaví. */
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
  if (!klaviyoEnabled()) return 'off';
  const { state, exists } = await klaviyoState(email);
  if (state === 'opted-out') return 'blocked';
  if (state === 'unknown') return 'unknown';
  if (state === 'subscribed') return 'ok';
  if (!exists) inBackground(upsertKlaviyoProfile(email, name, source));
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
      .insert({ email, name: name ?? null, source, ...attemptStamp() });

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
        // Do Klaviya ho pošleme aj tak, ak predošlý odber neprešiel (kto v zozname je,
        // novú úlohu nedostane, kto sa v Klaviyu odhlásil, toho neprihlásime). Opakované
        // odoslanie do 30 minút od posledného pokusu (dvojklik, dve karty) už rieši prvá
        // požiadavka: pokus si atomicky vezme len jedna z nich.
        if (klaviyoEnabled() && await claimKlaviyoAttempt(supabase, existing.id)) {
          const again = await subscribeInKlaviyo(email, name, source);
          if (again === 'rejected' || again === 'unknown' || again === 'blocked') inBackground(alertKlaviyoFailure(email, source, again));
        }
        return new Response(
          JSON.stringify({ success: true, alreadySubscribed: true }),
          { status: 200, headers: corsHeaders },
        );
      }

      // Reactivate inactive row. Podmienka na is_active: z dvoch súbežných požiadaviek
      // riadok reaktivuje (a Klaviyo zavolá) len jedna, druhá skončí ako už prihlásený.
      const { data: reactivated, error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({
          is_active: true,
          unsubscribed_at: null,
          subscribed_at: new Date().toISOString(),
          ...attemptStamp(),
        })
        .eq('id', existing.id)
        .not('is_active', 'is', true)
        .select('id');

      if (updateError) {
        console.error('[subscribe-newsletter] Reactivate failed:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Nepodarilo sa reaktivovať odber' }),
          { status: 500, headers: corsHeaders },
        );
      }
      if (!reactivated?.length) {
        return new Response(
          JSON.stringify({ success: true, alreadySubscribed: true }),
          { status: 200, headers: corsHeaders },
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
