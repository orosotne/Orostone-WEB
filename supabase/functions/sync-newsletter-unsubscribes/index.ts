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
//   3. Overí pokusy o odber, ktoré subscribe-newsletter poslal do Klaviya (stĺpec
//      klaviyo_attempted_at) a sú staršie ako hodina: sú v zozname „Newsletter – web“
//      prihlásené? Klaviyo úlohu odberu spracúva aj niekoľko minút, preto to neoveruje
//      subscribe-newsletter hneď po odbere, ale až táto nočná kontrola. Kto chýba, toho tím
//      dostane v jednom upozornení. Overený pokus si označí v klaviyo_checked_at (migrácia
//      20261013_newsletter_klaviyo_checked.sql), každý pokus sa tak overí raz. Vynechaný alebo
//      neúspešný beh nič nevynechá: neoverený pokus počká na najbližší úspešný beh.
//
// Volá ju len workflow so service-role kľúčom. Bez Klaviya (chýba zoznam alebo kľúč)
// nič nezmaže a vráti 503: workflow zčervená, inak by sa odhlásení potichu prestali mazať.
// V odpovedi ani v logu nie sú e-mailové adresy, len počty. Adresy sú len v upozornení
// tímu na ALERT_EMAIL, rovnako ako pri upozorneniach zo subscribe-newsletter.
//
// DEPLOYMENT:
//   supabase functions deploy sync-newsletter-unsubscribes --project-ref xfkznvqufhnrphpdhfnc
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isServiceRole } from '../_shared/auth.ts';
import { json, preflight } from '../_shared/cors.ts';
import { escapeHtml } from '../_shared/escape.ts';
import { emailMarketing, filterSafe, KLAVIYO_LIST_ID, klaviyoEnabled, klaviyoGet, optedOut, type EmailMarketing } from '../_shared/klaviyo.ts';
import { sendEmail } from '../_shared/resend.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
/** Koľko adries overiť v Klaviyu jednou požiadavkou (filter any(email, …)). */
const CHUNK = 50;
/** Koľko riadkov čítať z databázy naraz. */
const PAGE = 1000;
const RETENTION_DAYS = 30;
const ALERT_EMAIL = 'dopyt@orostone.sk';
/** Pokus o odber mladší ako hodina necháme na ďalšiu noc, Klaviyo ho ešte môže spracúvať. */
const VERIFY_AFTER_MS = 60 * 60 * 1000;

/**
 * Profily z Klaviya (e-mail malými písmenami → e-mailový marketing) pre adresy, po 50.
 * `path` je `profiles` (celý účet) alebo `lists/<id>/profiles` (len členovia zoznamu).
 * Pri chybe Klaviya hádže.
 */
async function klaviyoMarketing(path: string, emails: string[]): Promise<Map<string, EmailMarketing>> {
  const out = new Map<string, EmailMarketing>();
  for (let i = 0; i < emails.length; i += CHUNK) {
    const filter = encodeURIComponent(`any(email,${JSON.stringify(emails.slice(i, i + CHUNK))})`);
    const res = await klaviyoGet(`${path}?filter=${filter}&additional-fields[profile]=subscriptions&page[size]=100`);
    // Bez tela odpovede: chyba filtra by do logu vrátila e-mailové adresy.
    if (!res.ok) throw new Error(`Klaviyo ${res.status} ${(await res.json().catch(() => null))?.errors?.[0]?.code ?? ''}`);
    for (const profile of (await res.json())?.data ?? []) {
      const marketing = emailMarketing(profile);
      const email = String(profile?.attributes?.email ?? '').trim().toLowerCase();
      if (email && marketing) out.set(email, marketing);
    }
  }
  return out;
}

/** Adresy (malými písmenami), ktoré sú v Klaviyu odhlásené alebo potlačené. Pri chybe Klaviya hádže. */
async function optedOutInKlaviyo(emails: string[]): Promise<Set<string>> {
  const marketing = await klaviyoMarketing('profiles', emails);
  return new Set([...marketing].filter(([, m]) => optedOut(m)).map(([email]) => email));
}

/** Adresy, ktoré v zozname „Newsletter – web“ nie sú prihlásené (chýbajú alebo nemajú súhlas). */
async function notSubscribedInList(emails: string[]): Promise<string[]> {
  const members = await klaviyoMarketing(`lists/${KLAVIYO_LIST_ID}/profiles`, emails);
  return emails.filter((email) => {
    const m = members.get(email);
    return !(m?.consent === 'SUBSCRIBED' && !optedOut(m));
  });
}

/**
 * Jedno upozornenie tímu za beh s adresami, ktoré Klaviyo neprihlásilo. Rovnaký zoznam v ten istý
 * deň (UTC) odíde najviac raz, aj keď workflow niekto spustí znova (Resend Idempotency-Key).
 * Vráti, či upozornenie odišlo: neodoslané pokusy ostanú neoverené a skúsia sa v ďalšom behu.
 * Nikdy nehádže: synchronizácia odhlásených už prebehla.
 */
async function alertNotSubscribed(emails: string[]): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(emails.join(','))));
  const hash = Array.from(digest.slice(0, 12), (b) => b.toString(16).padStart(2, '0')).join('');
  try {
    const sent = await sendEmail({
      from: 'Orostone web <noreply@orostone.sk>',
      to: ALERT_EMAIL,
      subject: 'Newsletter: odbery z webu chýbajú v Klaviyu',
      html: `<p>Tieto e-maily sa prihlásili na webe na odber a web ich poslal do Klaviya, ale v zozname „Newsletter – web“ nie sú prihlásené (chýbajú v ňom alebo nemajú súhlas so zasielaním e-mailov):</p>
<ul>${emails.map((e) => `<li>${escapeHtml(e)}</li>`).join('')}</ul>
<p>V databáze webu sú odbery uložené. Pozrite si ich profily v Klaviyu a chýbajúce pridajte do zoznamu ručne (Zoznamy → Newsletter – web).</p>`,
      onMissingKey: 'skip',
      idempotencyKey: `newsletter-overenie-${day}-${hash}`,
    });
    return sent.ok;
  } catch (err) {
    console.error('[sync-newsletter-unsubscribes] Upozornenie sa neodoslalo:', err instanceof Error ? err.message : err);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return preflight();

  if (!isServiceRole(req)) {
    return json({ success: false, error: 'Unauthorized' }, 401);
  }
  if (!klaviyoEnabled()) {
    return json({ success: false, error: 'Klaviyo nie je nastavené (KLAVIYO_NEWSLETTER_LIST_ID, KLAVIYO_PRIVATE_API_KEY)' }, 503);
  }

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

    // 3. Neoverené pokusy o odber staršie ako hodina: sú v zozname prihlásené? Odhlásených krok 1
    //    už zmazal, nebudú v upozornení. Pokus je overený, keď klaviyo_checked_at >= klaviyo_attempted_at.
    //    PostgREST nevie porovnať dva stĺpce, preto ich porovnáme tu (tabuľka je malá).
    const verifyBefore = new Date(Date.now() - VERIFY_AFTER_MS).toISOString();
    const pendingByEmail = new Map<string, string[]>();
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('id, email, klaviyo_attempted_at, klaviyo_checked_at')
        .eq('is_active', true)
        .lt('klaviyo_attempted_at', verifyBefore)
        .order('id')
        .range(from, from + PAGE - 1);
      if (error) throw new Error(`select pending: ${error.message}`);
      for (const row of data ?? []) {
        if (row.klaviyo_checked_at && Date.parse(row.klaviyo_checked_at) >= Date.parse(row.klaviyo_attempted_at)) continue;
        const email = String(row.email ?? '').trim().toLowerCase();
        if (!email || !filterSafe(email)) continue;
        pendingByEmail.set(email, [...(pendingByEmail.get(email) ?? []), row.id]);
      }
      if (!data || data.length < PAGE) break;
    }
    const pending = [...pendingByEmail.keys()];
    const notSubscribed = await notSubscribedInList(pending);
    const alerted = notSubscribed.length ? await alertNotSubscribed(notSubscribed) : true;
    // Overené sú prihlásené adresy a chýbajúce, o ktorých upozornenie odišlo. Podmienka na čas pokusu
    // nechá pokus z opakovaného odoslania formulára počas behu na ďalší beh.
    const done = pending.filter((email) => alerted || !notSubscribed.includes(email)).flatMap((email) => pendingByEmail.get(email) ?? []);
    const checkedAt = new Date().toISOString();
    for (let i = 0; i < done.length; i += 100) {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ klaviyo_checked_at: checkedAt })
        .in('id', done.slice(i, i + 100))
        .lt('klaviyo_attempted_at', verifyBefore);
      if (error) throw new Error(`mark checked: ${error.message}`);
    }

    const result = {
      checked: idsByEmail.size,
      removed: ids.length,
      removedInactive: count ?? 0,
      verified: pending.length,
      notSubscribed: notSubscribed.length,
    };
    console.log('[sync-newsletter-unsubscribes]', JSON.stringify(result));
    return json({ success: true, ...result });
  } catch (err) {
    console.error('[sync-newsletter-unsubscribes]', err instanceof Error ? err.message : err);
    return json({ success: false, error: 'Synchronizácia zlyhala' }, 502);
  }
});
