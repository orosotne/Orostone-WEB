// ===========================================
// EDGE FUNCTION: sync-newsletter-unsubscribes
// ===========================================
// Raz denne (.github/workflows/sync-newsletter-unsubscribes.yml) zosúladí tabuľku
// newsletter_subscribers s odhláseniami v Klaviyu. Odhlásenie odkazom v e-maile spravuje
// Klaviyo a do databázy webu sa samo nedostane, zásady ochrany osobných údajov pritom
// sľubujú výmaz e-mailu do 30 dní po odvolaní súhlasu.
//
//   1. Aktívne riadky overí v Klaviyu po 50 adresách. Kto je odhlásený alebo potlačený
//      (celkovo alebo zo zoznamu „Newsletter – web“), toho riadok zmaže.
//   2. Zmaže aj neaktívne riadky, ktoré sú odhlásené viac ako 30 dní.
//
// Volá ju len workflow so service-role kľúčom. Bez Klaviya (chýba zoznam alebo kľúč)
// nerobí nič. V odpovedi ani v logu nie sú e-mailové adresy, len počty.
//
// DEPLOYMENT:
//   supabase functions deploy sync-newsletter-unsubscribes --project-ref xfkznvqufhnrphpdhfnc
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { json, preflight } from '../_shared/cors.ts';
import { emailMarketing, filterSafe, klaviyoEnabled, klaviyoGet, optedOut } from '../_shared/klaviyo.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
/** Koľko adries overiť v Klaviyu jednou požiadavkou (filter any(email, …)). */
const CHUNK = 50;
/** Koľko riadkov čítať z databázy naraz. */
const PAGE = 1000;
const RETENTION_DAYS = 30;

/** Adresy (malými písmenami), ktoré sú v Klaviyu odhlásené alebo potlačené. Pri chybe Klaviya hádže. */
async function optedOutInKlaviyo(emails: string[]): Promise<Set<string>> {
  const out = new Set<string>();
  for (let i = 0; i < emails.length; i += CHUNK) {
    const filter = encodeURIComponent(`any(email,${JSON.stringify(emails.slice(i, i + CHUNK))})`);
    const res = await klaviyoGet(`profiles?filter=${filter}&additional-fields[profile]=subscriptions&page[size]=100`);
    // Bez tela odpovede: chyba filtra by do logu vrátila e-mailové adresy.
    if (!res.ok) throw new Error(`Klaviyo ${res.status} ${(await res.json().catch(() => null))?.errors?.[0]?.code ?? ''}`);
    for (const profile of (await res.json())?.data ?? []) {
      const marketing = emailMarketing(profile);
      const email = String(profile?.attributes?.email ?? '').trim().toLowerCase();
      if (email && marketing && optedOut(marketing)) out.add(email);
    }
  }
  return out;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return preflight();

  const authHeader = req.headers.get('authorization') ?? '';
  if (!SUPABASE_SERVICE_KEY || authHeader !== `Bearer ${SUPABASE_SERVICE_KEY}`) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }
  if (!klaviyoEnabled()) return json({ success: true, skipped: 'Klaviyo nie je nastavené' });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });
  try {
    // 1. Aktívni odberatelia, ktorí sa v Klaviyu odhlásili.
    const idsByEmail = new Map<string, string[]>();
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('id, email')
        .eq('is_active', true)
        .order('id')
        .range(from, from + PAGE - 1);
      if (error) throw new Error(`select: ${error.message}`);
      for (const row of data ?? []) {
        const email = String(row.email ?? '').trim().toLowerCase();
        if (!email || !filterSafe(email)) continue;
        idsByEmail.set(email, [...(idsByEmail.get(email) ?? []), row.id]);
      }
      if (!data || data.length < PAGE) break;
    }
    const gone = await optedOutInKlaviyo([...idsByEmail.keys()]);
    const ids = [...gone].flatMap((email) => idsByEmail.get(email) ?? []);
    for (let i = 0; i < ids.length; i += 100) {
      const { error } = await supabase.from('newsletter_subscribers').delete().in('id', ids.slice(i, i + 100));
      if (error) throw new Error(`delete: ${error.message}`);
    }

    // 2. Neaktívne riadky odhlásené pred viac ako 30 dňami.
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString();
    const { count, error: oldError } = await supabase
      .from('newsletter_subscribers')
      .delete({ count: 'exact' })
      .eq('is_active', false)
      .lt('unsubscribed_at', cutoff);
    if (oldError) throw new Error(`delete inactive: ${oldError.message}`);

    const result = { checked: idsByEmail.size, removed: ids.length, removedInactive: count ?? 0 };
    console.log('[sync-newsletter-unsubscribes]', JSON.stringify(result));
    return json({ success: true, ...result });
  } catch (err) {
    console.error('[sync-newsletter-unsubscribes]', err instanceof Error ? err.message : err);
    return json({ success: false, error: 'Synchronizácia zlyhala' }, 502);
  }
});
