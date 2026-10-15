// ===========================================
// EDGE FUNCTION: subscribe-newsletter
// ===========================================
// Server-side newsletter subscription handler. Uses service-role to read/write
// `newsletter_subscribers` (anonymous SELECT/UPDATE was removed in P0-1 fix).
//
// Replaces:
//   services/newsletter.service.ts → subscribeToNewsletter()
//
// REQUEST: POST { email: string; name?: string; source: string; turnstileToken?: string }
// RESPONSE: 200 { success: true; alreadySubscribed?: boolean; welcomeEmail?: boolean }
//           welcomeEmail: false = uvítací e-mail s kódmi neodíde (Klaviyo odber zablokovalo
//           alebo neodpovedalo), pop-up ukáže kódy len na obrazovke
//           alreadySubscribed: true = adresa už je prihlásená, uvítací e-mail znova neodíde.
//           Výnimka: prihlásená adresa, ktorú Klaviyo pri opakovanom pokuse prijme až teraz,
//           dostane { success: true; welcomeEmail: true } (flow na zozname pošle e-mail 01)
//           4xx { success: false; error: string }   (403 = overenie Turnstile neprešlo)
//
// DEPLOYMENT:
//   supabase functions deploy subscribe-newsletter --project-ref <ref>
//   Najprv migrácie 20261011_newsletter_klaviyo_attempt.sql a
//   20261012_newsletter_subscribe_function.sql: odber sa zapisuje cez funkciu
//   newsletter_subscribe. A až po nasadení webu, ktorý posiela turnstileToken
//   (pätička, pop-up): starý web token neposiela a pri TURNSTILE_ENFORCE=true by dostal 403.
//
// OCHRANA PROTI ROBOTOM (od 12. 10. 2026): Cloudflare Turnstile, ten istý kľúč ako formulár
//   na vzorku (_shared/turnstile.ts, secret CLOUDFLARE_TURNSTILE_SECRET), pri
//   TURNSTILE_ENFORCE=true (rovnaký prepínač ako submit-quote, platí pre celý projekt). Token
//   overíme po kontrole údajov a pred zápisom: bez platného tokenu odpovieme 403 a nič sa
//   nezapíše, neodošle ani nespotrebuje strop. Token je jednorazový, takže každé odoslanie
//   vrátane opakovaného pre už prihlásenú adresu potrebuje nové overenie a skript nemôže
//   formulár volať dookola. Pri výpadku Cloudflaru odber neprejde (radšej ako bez ochrany).
//   Bez overenia prejde len volanie s tajným kľúčom v hlavičke apikey (_shared/auth.ts
//   isServiceRole): posiela ho submit-quote za políčko newslettera vo formulári na vzorku,
//   kde je jednorazový token už minutý. Funkcia je verejná a nasadená s verify_jwt = false
//   (supabase/config.toml): web posiela publishable kľúč len v hlavičke apikey, nie je to JWT.
//
// KLAVIYO (od 10. 10. 2026), serverové API podľa odporúčania Klaviya:
//   KLAVIYO_NEWSLETTER_LIST_ID  ID zoznamu „Newsletter – web“ (nie je tajné).
//   KLAVIYO_INQUIRY_LIST_ID     ID zoznamu „Dopyty – LP1, LP2, e-mail (len k dopytu)“ (nie je
//                               tajné, nepovinné, bez nastavenia TKAHuh). Vyradenie z neho je
//                               opísané nižšie.
//   KLAVIYO_PRIVATE_API_KEY     súkromný kľúč Klaviya (Lists, Profiles, Subscriptions:
//                               Full). Len v Supabase secrets, nikdy v kóde ani v logu.
//   Kým nie sú nastavené zoznam „Newsletter – web“ a kľúč, funkcia sa správa ako doteraz
//   (uvítací e-mail cez Resend).
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
//   profil by si inak mohol ktokoľvek prepísať. Pri neistom výsledku sa zápis raz zopakuje
//   a keď neprejde, tím dostane upozornenie s menom a zdrojom (pri ďalšom odoslaní
//   formulára už profil existuje a znova ich nezapíšeme).
//   Kto je v Klaviyu odhlásený alebo potlačený (spam, ručne), celkovo alebo len z tohto
//   zoznamu, toho NEprihlasujeme: bulk subscribe by odhlásenie zrušil a formulár na webe
//   nikto neoveruje. Tím dostane upozornenie. Odpoveď 202 je len prijatá úloha a Klaviyo ju
//   spracúva aj niekoľko minút (12. 10. 2026 trvala 3,5 minúty), preto ju funkcia neoveruje.
//   Či je e-mail v zozname a prihlásený (súhlas SUBSCRIBED), skontroluje v noci
//   sync-newsletter-unsubscribes a tím upozorní, keď nie. Zoznam má jednoduché potvrdenie
//   (single opt-in). Pri dvojitom by sa súhlas zapísal až po kliknutí v e-maile a nočná
//   kontrola by upozorňovala pri každom nepotvrdenom odbere: pri prepnutí ju treba prerobiť.
//   Keď Klaviyo odber prijme alebo je e-mail v zozname už prihlásený, funkcia ho na pozadí
//   vyradí zo zoznamu „Dopyty“ (KLAVIYO_INQUIRY_LIST_ID): kto dal súhlas s newsletterom,
//   patrí len medzi odberateľov, inak by mu popri newsletteri chodili aj e-maily k dopytu.
//   Kto v zozname nie je, tomu sa nič nestane. Prázdne KLAVIYO_INQUIRY_LIST_ID vyraďovanie
//   vypne. Keď vyradenie neprejde ani na druhý pokus, tím dostane upozornenie.
//
// STROP NA ODBERY (od 11. 10. 2026): druhá poistka za Turnstile, napr. keď niekto overenia
//   rieši ručne alebo cez platenú službu. Nad stropom
//   (viac ako 10 nových alebo obnovených odberov za hodinu alebo viac ako 30 za 24 hodín,
//   bežne prídu dva-tri týždenne) web prihlásenie neuloží, Klaviyo nevolá, uvítanie
//   nepošle a odpovie 429 s prosbou skúsiť to neskôr. Cudzie adresy z útoku tak
//   nedostávajú e-maily, nemíňajú limity Klaviya a nedostanú sa ani do dennej
//   synchronizácie. Počet aj zápis robí v jednej transakcii so zámkom databázová funkcia
//   newsletter_subscribe, takže pri súbežnom návale prejde presne prvých 10 (30). Tím
//   dostane najviac jedno upozornenie za deň (Resend Idempotency-Key). Pred kampaňou,
//   ktorá prinesie veľa prihlásení naraz (súťaž), treba strop zvýšiť (SUBSCRIBE_LIMITS).
//   Upozornenia o odbere do Klaviya prídu o tej istej adrese a dôvode tiež najviac raz za deň.
// ===========================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { escapeHtml } from '../_shared/escape.ts';
import {
  emailFilter,
  emailMarketing,
  KLAVIYO_INQUIRY_LIST_ID,
  KLAVIYO_LIST_ID,
  klaviyoDelete,
  klaviyoEnabled,
  klaviyoGet,
  klaviyoPost,
  optedOut,
} from '../_shared/klaviyo.ts';
import { sendEmail } from '../_shared/resend.ts';
import { clientIp, verifyTurnstile } from '../_shared/turnstile.ts';
import { isServiceRole, serviceRoleHeaders } from '../_shared/auth.ts';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
};

const ALERT_EMAIL = 'dopyt@orostone.sk';

/**
 * 'ok'       Klaviyo odber prijalo (202), flow na zozname pošle uvítaciu sériu.
 * 'member'   v zozname už je prihlásený, novú úlohu netreba a uvítacia séria sa znova nespustí.
 * 'rejected' Klaviyo ho jednoznačne odmietlo (4xx okrem 429, aj zlý kľúč), v zozname nie je.
 * 'unknown'  ani po dvoch pokusoch nevieme (timeout, 5xx, 429, sieť), mohol prejsť.
 * 'blocked'  v Klaviyu je odhlásený alebo potlačený (celkovo alebo z tohto zoznamu):
 *            neprihlasujeme, nič mu neposielame.
 * 'off'      Klaviyo nie je nastavené (chýba zoznam alebo kľúč).
 */
type KlaviyoResult = 'ok' | 'member' | 'rejected' | 'unknown' | 'blocked' | 'off';
/**
 * Dôvod upozornenia tímu: výsledok odberu, meno a zdroj, ktoré sa do nového profilu
 * nezapísali, alebo vyradenie zo zoznamu „Dopyty“, ktoré neprešlo. Prijatý odber, ktorý sa
 * v zozname neobjavil ako prihlásený, hlási nočná kontrola v sync-newsletter-unsubscribes.
 */
type AlertReason = 'rejected' | 'unknown' | 'blocked' | 'profile' | 'inquiry';

/** Opakované odoslanie formulára do tohto času od posledného pokusu o odber (dvojklik, dve karty) už rieši prvá požiadavka. */
const RESUBMIT_WINDOW_MS = 30 * 60 * 1000;

/**
 * Strop na nové a obnovené odbery z verejného formulára, počíta sa `subscribed_at`.
 * Bežne prídu dva-tri týždenne, strop je poistka proti útoku s cudzími adresami.
 */
const SUBSCRIBE_LIMITS = { hour: 10, day: 30 } as const;

/** Výsledok databázovej funkcie newsletter_subscribe (migrácia 20261012_newsletter_subscribe_function.sql). */
interface SubscribeOutcome {
  outcome: 'inserted' | 'reactivated' | 'active' | 'limit';
  id: string | null;
  /** Strop je plný (pri 'active' Klaviyo znova nevoláme). */
  over: boolean;
}

/** Odpoveď nad stropom. Prihlásenie sa neuložilo, človek to môže skúsiť neskôr. */
const LIMIT_ERROR = 'Prihlásenie sa teraz nepodarilo. Skúste to, prosím, neskôr.';

/** Odpoveď, keď overenie Turnstile neprešlo. Formulár dostane nový token a človek to skúsi znova. */
const TURNSTILE_ERROR = 'Overenie proti robotom zlyhalo. Skúste to, prosím, znova.';

/** Klaviyo prijme e-mail najviac so 100 znakmi (Profiles API). */
const MAX_EMAIL_LENGTH = 100;

/** Odpoveď nad stropom: upozornenie tímu (najviac raz za deň) a 429. */
function limitResponse(): Response {
  inBackground(alertSubscribeLimit());
  return new Response(JSON.stringify({ success: false, error: LIMIT_ERROR }), { status: 429, headers: corsHeaders });
}

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

/** Pauza pred druhým pokusom: Retry-After z odpovede (429/503), najviac 3 s, inak 0,8 s. */
function retryDelayMs(res: Response | null): number {
  const seconds = Number(res?.headers.get('Retry-After'));
  return Number.isFinite(seconds) && seconds > 0 ? Math.min(seconds * 1000, 3000) : 800;
}

/**
 * Meno a zdroj do nového profilu. Odber ich nenesie, preto zvlášť. Zápis je synchrónny (200/201
 * = zapísané) a opakovateľný, pri neistom výsledku (timeout, 5xx, 429, sieť) ho raz zopakujeme.
 * Keď neprejde, upozorníme tím: pri ďalšom odoslaní formulára už profil existuje a meno ani
 * zdroj znova nezapíšeme. Nehádže, odber nezastaví.
 */
async function upsertKlaviyoProfile(email: string, name: string | undefined, source: string): Promise<void> {
  const [firstName, ...rest] = (name ?? '').split(/\s+/).filter(Boolean);
  const payload = {
    data: {
      type: 'profile',
      attributes: {
        email,
        ...(firstName ? { first_name: firstName } : {}),
        ...(rest.length ? { last_name: rest.join(' ') } : {}),
        properties: { zdroj_odberu: source },
      },
    },
  };
  for (let attempt = 1; attempt <= 2; attempt++) {
    let res: Response | null = null;
    try {
      res = await klaviyoPost('profile-import', payload);
      if (res.ok) return;
      console.error(`[subscribe-newsletter] Klaviyo profil, pokus ${attempt}:`, res.status, (await res.text()).slice(0, 300));
      if (res.status >= 400 && res.status < 500 && res.status !== 429) break;
    } catch (err) {
      console.error(`[subscribe-newsletter] Klaviyo profil, pokus ${attempt}:`, err instanceof Error ? err.message : err);
    }
    if (attempt === 1) await new Promise((r) => setTimeout(r, retryDelayMs(res)));
  }
  await alertKlaviyoFailure(email, source, 'profile', name);
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
  if (state === 'subscribed') return 'member';
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
      // 202 je prijatá úloha. Či ju Klaviyo spracovalo, overí nočná kontrola v sync-newsletter-unsubscribes.
      if (res.status === 202) return 'ok';
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

/**
 * Po prijatom odbere vyradí e-mail zo zoznamu „Dopyty“: kto dal súhlas s newsletterom, patrí
 * len medzi odberateľov. Kto v zozname nie je, tomu sa nič nestane. Pri neistom výsledku
 * (timeout, 5xx, 429, sieť) to raz zopakujeme, keď to neprejde, upozorníme tím. Nehádže.
 */
async function leaveInquiryList(email: string, source: string): Promise<void> {
  const filter = emailFilter(email);
  if (!KLAVIYO_INQUIRY_LIST_ID || !filter) return;
  for (let attempt = 1; attempt <= 2; attempt++) {
    let res: Response | null = null;
    try {
      res = await klaviyoGet(`lists/${KLAVIYO_INQUIRY_LIST_ID}/profiles?filter=${filter}&fields[profile]=email`);
      if (res.ok) {
        const id = (await res.json())?.data?.[0]?.id;
        if (!id) return;
        res = await klaviyoDelete(`lists/${KLAVIYO_INQUIRY_LIST_ID}/relationships/profiles`, { data: [{ type: 'profile', id }] });
        if (res.ok) return;
      }
      console.error(`[subscribe-newsletter] Klaviyo zoznam Dopyty, pokus ${attempt}:`, res.status, (await res.text()).slice(0, 300));
      if (res.status >= 400 && res.status < 500 && res.status !== 429) break;
    } catch (err) {
      console.error(`[subscribe-newsletter] Klaviyo zoznam Dopyty, pokus ${attempt}:`, err instanceof Error ? err.message : err);
    }
    if (attempt === 1) await new Promise((r) => setTimeout(r, retryDelayMs(res)));
  }
  await alertKlaviyoFailure(email, source, 'inquiry');
}

/** Na pozadí, aby upozornenie nepredĺžilo odpoveď webu (Supabase Edge Runtime: waitUntil). */
function inBackground(task: Promise<unknown>): void {
  const runtime = (globalThis as { EdgeRuntime?: { waitUntil(p: Promise<unknown>): void } }).EdgeRuntime;
  if (runtime?.waitUntil) runtime.waitUntil(task);
  else task.catch(() => {});
}

const ALERT_SUBJECT = 'Newsletter: odber sa nepreniesol do Klaviya';
const ALERT_TEXT: Record<AlertReason, { what: string; todo: string; subject?: string }> = {
  rejected: {
    what: 'Do zoznamu „Newsletter – web“ v Klaviyu sa nedostal: Klaviyo odber odmietlo.',
    todo: 'Pridajte e-mail do zoznamu v Klaviyu ručne (Zoznamy → Newsletter – web).',
  },
  unknown: {
    what: 'Do zoznamu „Newsletter – web“ v Klaviyu sa možno nedostal: Klaviyo neodpovedalo ani na druhý pokus.',
    todo: 'Overte, či už v zozname nie je, a ak nie, pridajte ho ručne (Zoznamy → Newsletter – web).',
  },
  blocked: {
    what: 'Do Klaviya sme ho neprihlásili: v Klaviyu je odhlásený (celkovo alebo z tohto zoznamu) alebo e-mail nahlásil ako spam. Formulár na webe nikto neoveruje, takže automatické prihlásenie by mohlo zrušiť cudzie odhlásenie.',
    todo: 'Ak sa naozaj chce vrátiť (napr. vám napísal), pridajte ho do zoznamu ručne. Inak netreba robiť nič.',
  },
  profile: {
    subject: 'Newsletter: meno a zdroj sa nezapísali do Klaviya',
    what: 'Meno a zdroj odberu sa do jeho nového profilu v Klaviyu nezapísali ani na druhý pokus. Samotný odber ide samostatnou úlohou. Ak neprejde, príde o ňom zvlášť upozornenie.',
    todo: 'Doplňte v jeho profile v Klaviyu ručne vlastnosť zdroj_odberu a meno, ak ho zadal. Web ich už nedoplní ani pri ďalšom odoslaní formulára, profil už existuje.',
  },
  inquiry: {
    subject: 'Newsletter: odberateľ ostal v zozname Dopyty',
    what: 'Klaviyo odber prijalo, no zo zoznamu „Dopyty – LP1, LP2, e-mail (len k dopytu)“ sa nevyradil ani na druhý pokus. Popri newsletteri by mu mohli chodiť aj e-maily k dopytu.',
    todo: 'Odstráňte ho v Klaviyu zo zoznamu „Dopyty – LP1, LP2, e-mail (len k dopytu)“. Ak v ňom nie je, netreba robiť nič.',
  },
};

/**
 * Resend Idempotency-Key upozornenia: o tej istej adrese a dôvode odíde najviac jedno za deň
 * (UTC), aj keď niekto formulár s tou adresou odosiela dookola. Adresu v kľúči nahrádza odtlačok.
 */
async function alertKey(email: string, reason: AlertReason): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email)));
  const hash = Array.from(digest.slice(0, 12), (b) => b.toString(16).padStart(2, '0')).join('');
  return `newsletter-${reason}-${hash}-${new Date().toISOString().slice(0, 10)}`;
}

/**
 * Odber do Klaviya neprešiel, je neistý alebo zablokovaný, alebo chýba meno a zdroj: tím rozhodne ručne.
 * O tej istej adrese a dôvode najviac raz za deň (alertKey). Nikdy nehádže.
 */
async function alertKlaviyoFailure(email: string, source: string, reason: AlertReason, name?: string): Promise<void> {
  const text = ALERT_TEXT[reason];
  const who = name ? `, meno <strong>${escapeHtml(name)}</strong>` : '';
  try {
    await sendEmail({
      from: 'Orostone web <noreply@orostone.sk>',
      to: ALERT_EMAIL,
      subject: text.subject ?? ALERT_SUBJECT,
      html: `<p>E-mail <strong>${escapeHtml(email)}</strong> sa na webe prihlásil na odber (zdroj ${escapeHtml(source)}${who}). ${text.what}</p>
<p>V databáze webu je odber uložený. ${text.todo}</p>`,
      onMissingKey: 'skip',
      idempotencyKey: await alertKey(email, reason),
    });
  } catch (err) {
    console.error('[subscribe-newsletter] Upozornenie sa neodoslalo:', err instanceof Error ? err.message : err);
  }
}

/**
 * Prekročený strop na odbery, bez adries (môže ísť o útok). Rovnaký obsah a kľúč počas dňa
 * (UTC), takže Resend pošle najviac jedno upozornenie za deň aj pri súbežných požiadavkách.
 * Nikdy nehádže.
 */
async function alertSubscribeLimit(): Promise<void> {
  const day = new Date().toISOString().slice(0, 10);
  const [y, m, d] = day.split('-').map(Number);
  try {
    await sendEmail({
      from: 'Orostone web <noreply@orostone.sk>',
      to: ALERT_EMAIL,
      subject: 'Newsletter: neobvykle veľa prihlásení na odber',
      html: `<p>Dnes (${d}. ${m}. ${y}) prišlo na webe viac prihlásení na odber, ako povoľuje strop: 10 za hodinu a 30 za 24 hodín. Môže ísť o útok s cudzími adresami.</p>
<p>Prihlásenia nad stropom web neukladá, neposiela do Klaviya a odpovedá na ne prosbou skúsiť to neskôr. Ak ide o útok, netreba robiť nič. Ak sú to skutoční záujemcovia (napr. po kampani alebo súťaži), požiadajte o zvýšenie stropu vo funkcii subscribe-newsletter. Ďalšie upozornenie dnes už nepríde.</p>`,
      onMissingKey: 'skip',
      idempotencyKey: `newsletter-strop-${day}`,
    });
  } catch (err) {
    console.error('[subscribe-newsletter] Upozornenie na strop sa neodoslalo:', err instanceof Error ? err.message : err);
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
  if (b.email.trim().length > MAX_EMAIL_LENGTH) return { ok: false, error: `E-mail môže mať najviac ${MAX_EMAIL_LENGTH} znakov` };
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

    // 0. Ochrana proti robotom (Turnstile) pred akýmkoľvek zápisom alebo e-mailom, pri
    //    TURNSTILE_ENFORCE=true (rovnaký prepínač ako submit-quote). Tajný kľúč posiela
    //    len submit-quote za políčko newslettera vo formulári na vzorku: jednorazový token
    //    z formulára overil on, druhý by musel návštevník získať znova.
    const fromServer = isServiceRole(req);
    if (Deno.env.get('TURNSTILE_ENFORCE') === 'true' && !fromServer) {
      const turnstile = await verifyTurnstile((json as Record<string, unknown>).turnstileToken, clientIp(req));
      if (!turnstile.success) {
        console.warn('[subscribe-newsletter] turnstile rejected', { codes: turnstile.errorCodes });
        return new Response(JSON.stringify({ success: false, error: TURNSTILE_ERROR }), {
          status: 403,
          headers: corsHeaders,
        });
      }
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    });

    // 1. Zápis odberu cez databázovú funkciu newsletter_subscribe (migrácia
    //    20261012_newsletter_subscribe_function.sql). Zámok v nej pustí naraz jeden odber,
    //    takže strop aj zápis sú atomické: pri súbežnom návale prejde presne prvých
    //    SUBSCRIBE_LIMITS odberov a duplicitný e-mail nevznikne (predtým to strážil
    //    23505 z UNIQUE(email), fix /ultrareview bug_008).
    const { data: sub, error: subError } = await supabase.rpc('newsletter_subscribe', {
      p_email: email,
      p_name: name ?? null,
      p_source: source,
      p_stamp_attempt: klaviyoEnabled(),
      p_hour_max: SUBSCRIBE_LIMITS.hour,
      p_day_max: SUBSCRIBE_LIMITS.day,
    });
    const outcome = (sub as SubscribeOutcome | null)?.outcome;
    if (subError || !outcome) {
      console.error('[subscribe-newsletter] newsletter_subscribe failed:', subError?.message ?? sub);
      return new Response(
        JSON.stringify({ success: false, error: 'Nepodarilo sa prihlásiť na odber' }),
        { status: 500, headers: corsHeaders },
      );
    }
    const { id, over } = sub as SubscribeOutcome;

    if (outcome === 'limit') return limitResponse();

    if (outcome === 'active') {
      // Already active — idempotent success, no welcome email re-send from here.
      // Do Klaviya ho pošleme aj tak, ak predošlý odber neprešiel (kto v zozname je,
      // novú úlohu nedostane, kto sa v Klaviyu odhlásil, toho neprihlásime). Opakované
      // odoslanie do 30 minút od posledného pokusu (dvojklik, dve karty) už rieši prvá
      // požiadavka: pokus si atomicky vezme len jedna z nich. Pri plnom strope Klaviyo
      // nevoláme. Keď Klaviyo odber teraz prijme ('ok'), adresa v zozname ešte nebola a flow
      // na zozname pošle uvítací e-mail 01 s kódmi: odpovieme ako pri novom odbere.
      if (klaviyoEnabled() && !over && id && await claimKlaviyoAttempt(supabase, id)) {
        const again = await subscribeInKlaviyo(email, name, source);
        if (again === 'ok' || again === 'member') inBackground(leaveInquiryList(email, source));
        if (again === 'rejected' || again === 'unknown' || again === 'blocked') inBackground(alertKlaviyoFailure(email, source, again));
        if (again === 'ok') {
          return new Response(
            JSON.stringify({ success: true, welcomeEmail: true }),
            { status: 200, headers: corsHeaders },
          );
        }
        // V Klaviyu odhlásený alebo potlačený: novinky mu nepôjdú, preto nehovoríme „už ste prihlásení“
        // a web ukáže neutrálny text s kódmi (rovnaký ako pri 'unknown', stav odberu tým neprezradíme).
        if (again === 'blocked') {
          return new Response(
            JSON.stringify({ success: true, welcomeEmail: false }),
            { status: 200, headers: corsHeaders },
          );
        }
      }
      return new Response(
        JSON.stringify({ success: true, alreadySubscribed: true }),
        { status: 200, headers: corsHeaders },
      );
    }

    if (outcome !== 'inserted' && outcome !== 'reactivated') {
      console.error('[subscribe-newsletter] newsletter_subscribe: neznámy výsledok', outcome);
      return new Response(
        JSON.stringify({ success: false, error: 'Nepodarilo sa prihlásiť na odber' }),
        { status: 500, headers: corsHeaders },
      );
    }

    // 2. Klaviyo: zoznam „Newsletter – web“, uvítaciu sériu posiela flow na zozname.
    //    Prijatý odber vyradí e-mail zo zoznamu „Dopyty“.
    const klaviyo = await subscribeInKlaviyo(email, name, source);
    if (klaviyo === 'ok' || klaviyo === 'member') inBackground(leaveInquiryList(email, source));
    if (klaviyo === 'rejected' || klaviyo === 'unknown' || klaviyo === 'blocked') inBackground(alertKlaviyoFailure(email, source, klaviyo));

    // 3. Send welcome email only for new subscribers and reactivated unsubscribers —
    //    alreadySubscribed returned above. With Klaviyo on, only when it definitely rejected
    //    the subscriber: after 'ok' its flow sends the welcome series, after 'unknown' it may
    //    have (no double welcome). Awaited (max 8 s), so the web promises the codes by e-mail
    //    only when the fallback really sent it.
    let fallbackSent = false;
    if (klaviyo === 'off' || klaviyo === 'rejected') {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/send-newsletter-welcome`, {
          method: 'POST',
          headers: serviceRoleHeaders(),
          body: JSON.stringify({ email, name }),
          signal: AbortSignal.timeout(8000),
        });
        fallbackSent = res.ok;
        if (!res.ok) console.warn('[subscribe-newsletter] Welcome email not sent:', res.status);
      } catch (err) {
        console.warn('[subscribe-newsletter] Welcome email dispatch failed:', err);
      }
    }

    // Uvítací e-mail s kódmi: po 'ok' ho posiela flow v Klaviyu, po 'off'/'rejected' záložná
    // funkcia vyššie, ak naozaj odišiel. Po 'member' (v zozname už bol) sa séria znova nespustí,
    // po 'blocked' neodíde nič, po 'unknown' to nevieme: web ho nesľúbi a kódy ukáže na obrazovke.
    const welcomeEmail = klaviyo === 'ok' || fallbackSent;
    return new Response(
      JSON.stringify({ success: true, welcomeEmail, ...(klaviyo === 'member' ? { alreadySubscribed: true } : {}) }),
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
