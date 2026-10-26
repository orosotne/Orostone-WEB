import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { SEOHead, createBreadcrumbLD } from '@/components/UI/SEOHead';
import {
  ActionButton,
  Container,
  FaqList,
  FeatureGrid,
  IconDelivery,
  IconDispatch,
  IconPriceClock,
  IconSlabs,
  PageHero,
  PageHeroImage,
  PHONE_HREF,
  PHONE_LABEL,
  Section,
  SectionHeader,
  StepList,
  TextLink,
  type FaqItem,
  type FeatureItem,
  type StepItem,
} from '@/components/Design';
import { SHOP_PRODUCTS } from '@/constants';
import { shopifySized } from '@/lib/shopifyImage';
import { submitPartnerLead } from '@/services/quotes.service';
import { trackMetaEvent } from '@/hooks/useMetaPixel';
import { trackGA4Event } from '@/services/analytics';
import { useHoneypot } from '@/hooks/useHoneypot';
import { useTurnstile } from '@/hooks/useTurnstile';

/*
 * B2B landing page pre kamenárstva (kampaň „Orostone pre kamenárstva“).
 * Ceny ani percentá tu zámerne nie sú: B2B cenník posielame až po dopyte.
 */

const SLABS = SHOP_PRODUCTS.filter((p) => p.category === 'sintered-stone');

/* =============================================================
   VÝHODY
   ============================================================= */
const REASONS: FeatureItem[] = [
  {
    icon: IconDispatch,
    title: `${SLABS.length} modelov skladom ihneď`,
    text: 'Platne máme fyzicky na sklade na Slovensku. Nečakáte na kontajner ani na objednávku u distribútora v zahraničí.',
  },
  {
    icon: IconSlabs,
    title: 'Odber už od jednej platne',
    text: 'Kupujete na konkrétnu zákazku, nie do zásoby. Žiadny minimálny odber, žiadny kapitál viazaný v sklade.',
  },
  {
    icon: IconPriceClock,
    title: 'Partnerský cenník podľa odberu',
    text: 'Čím viac platní ročne odoberiete, tým nižšia cena za platňu. Cenník pošleme po vyplnení formulára.',
  },
  {
    icon: IconDelivery,
    title: 'Zákazky z e-shopu vo vašom regióne',
    text: 'Keď zákazník na e-shope chce dosku aj opracovať a namontovať, odovzdáme ho partnerovi z jeho regiónu.',
  },
];

const SPECS: { label: string; value: string }[] = [
  { label: 'Rozmer platne', value: '3 200 × 1 600 mm' },
  { label: 'Plocha platne', value: '5,12 m²' },
  { label: 'Hrúbka', value: '12 mm' },
  { label: 'Modely skladom', value: `${SLABS.length} dekorov` },
  { label: 'Showroom', value: 'Bošany, celé platne pri dennom svetle' },
];

const STEPS: StepItem[] = [
  { title: 'Vyplníte formulár', text: 'Firma, kontakt a približne koľko platní ročne spracujete. Zaberie to minútu.' },
  { title: 'Zavoláme a pošleme cenník', text: 'Do 24 hodín v pracovný deň sa ozveme a pošleme B2B cenník všetkých modelov.' },
  { title: 'Vzorkovník do dielne', text: 'Vzorky dekorov pošleme alebo prinesieme osobne, aby ste ich mohli ukázať zákazníkom.' },
  { title: 'Prvá objednávka', text: 'Objednáte platne na prvú zákazku. Dovoz dohodneme podľa miesta vašej dielne.' },
];

const FAQ: FaqItem[] = [
  {
    question: 'Musím odoberať pravidelne alebo určitý objem?',
    answer: 'Nie. Prvú objednávku môžete urobiť na jednu platňu. Pri vyššom ročnom odbere sa partnerská cena zlepšuje.',
  },
  {
    question: 'Prečo nie sú B2B ceny priamo na stránke?',
    answer:
      'Ceny na e-shope sú pre koncových zákazníkov. Partnerský cenník posielame len kamenárstvam, aby ste mali priestor na vlastnú maržu.',
  },
  {
    question: 'Môžem si platne pozrieť naživo?',
    answer: (
      <>
        Áno, v showroome v Bošanoch si pozriete celé platne 3 200 × 1 600 mm. Návštevu dohodnite telefonicky na{' '}
        <a href={PHONE_HREF} className="underline underline-offset-2">
          {PHONE_LABEL}
        </a>
        .
      </>
    ),
  },
  {
    question: 'Nebudete mi konkurovať pri spracovaní?',
    answer:
      'Nie. Orostone predáva platne, dosky na mieru spracúvajú a montujú partnerskí kamenári. Zákazníka z e-shopu, ktorý chce dosku aj opracovať a namontovať, odovzdáme partnerovi z jeho regiónu.',
  },
];

const VOLUMES = ['1–5 platní', '6–20 platní', '21–50 platní', 'viac ako 50 platní', 'zatiaľ neviem'];

/* =============================================================
   FORMULÁR
   ============================================================= */
const label = 'mb-1.5 block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-brand-muted';
const field =
  'w-full rounded-[10px] border border-brand-line bg-white px-4 py-3 text-base text-brand-dark placeholder:text-brand-muted transition-colors focus:border-brand-dark focus:outline-none';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Žiadosť o B2B cenník. Ide cez submit-quote (Turnstile overuje server) a hlási lead
 * do Meta (Lead) a GA4 (generate_lead, lead_source b2b_partner) — pri úpravách ich ponechajte.
 */
const PartnerForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { honeypotValue, setHoneypotValue, isBot } = useHoneypot();
  const { turnstileRef, turnstileToken, setTurnstileToken, reset: resetTurnstile } = useTurnstile();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBot || !formRef.current) return;
    if (!agreed) {
      setStatus('error');
      setErrorMsg('Prosím, súhlaste so spracovaním osobných údajov.');
      return;
    }
    if (!turnstileToken) {
      setStatus('error');
      setErrorMsg('Prosím, potvrďte, že nie ste robot.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    const fd = new FormData(formRef.current);
    const get = (key: string) => String(fd.get(key) ?? '').trim();
    const volume = get('volume');

    const result = await submitPartnerLead(
      {
        company: get('company'),
        ico: get('ico') || undefined,
        name: get('name'),
        email: get('email'),
        phone: get('phone'),
        city: get('city'),
        volume,
        message: get('message') || undefined,
      },
      turnstileToken,
    );

    if (result.success) {
      trackMetaEvent('Lead', { content_name: 'B2B partner', content_category: 'B2B Partner Request' });
      trackGA4Event('generate_lead', { currency: 'EUR', value: 200, lead_source: 'b2b_partner', item_name: volume });
      setStatus('success');
    } else {
      // Token je jednorazový — nový pokus potrebuje nový.
      resetTurnstile();
      setStatus('error');
      setErrorMsg(
        `${result.error ? `${result.error} ` : 'Niečo sa nepodarilo. '}Napíšte nám priamo na dopyt@orostone.sk alebo zavolajte ${PHONE_LABEL}.`,
      );
    }
  };

  if (status === 'success') {
    return (
      <div className="flex w-full flex-col items-start gap-3 rounded-[10px] border border-brand-line bg-white p-8">
        <CheckCircle className="h-10 w-10 text-brand-dark" strokeWidth={1.5} />
        <h3 className="text-os-h3">Ďakujeme, dopyt máme.</h3>
        <p className="font-light text-brand-muted">
          Ozveme sa do 24 hodín v pracovný deň a pošleme vám B2B cenník. Ak sa vám ponáhľa, zavolajte na {PHONE_LABEL}.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid w-full gap-4">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <label htmlFor="b2b-company" className={label}>Názov firmy *</label>
          <input id="b2b-company" name="company" required maxLength={100} autoComplete="organization" placeholder="Kamenárstvo Novák s.r.o." className={field} />
        </div>
        <div>
          <label htmlFor="b2b-ico" className={label}>
            IČO <span className="font-normal normal-case tracking-normal">(nepovinné)</span>
          </label>
          <input id="b2b-ico" name="ico" maxLength={20} inputMode="numeric" placeholder="12345678" className={field} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="b2b-name" className={label}>Meno a priezvisko *</label>
          <input id="b2b-name" name="name" required maxLength={100} autoComplete="name" placeholder="Ján Novák" className={field} />
        </div>
        <div>
          <label htmlFor="b2b-city" className={label}>Mesto dielne *</label>
          <input id="b2b-city" name="city" required maxLength={100} autoComplete="address-level2" placeholder="Nitra" className={field} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="b2b-email" className={label}>E-mail *</label>
          <input id="b2b-email" type="email" name="email" required autoComplete="email" placeholder="jan@kamenarstvo.sk" className={field} />
        </div>
        <div>
          <label htmlFor="b2b-phone" className={label}>Telefón *</label>
          <input id="b2b-phone" type="tel" name="phone" required maxLength={50} autoComplete="tel" placeholder="+421 9XX XXX XXX" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="b2b-volume" className={label}>Koľko platní ročne približne spracujete? *</label>
        <select id="b2b-volume" name="volume" required defaultValue="" className={`${field} appearance-none`}>
          <option value="" disabled>Vyberte…</option>
          {VOLUMES.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="b2b-message" className={label}>
          Správa <span className="font-normal normal-case tracking-normal">(nepovinné)</span>
        </label>
        <textarea id="b2b-message" name="message" rows={3} maxLength={1500} placeholder="Napríklad s akým materiálom dnes robíte alebo ktoré dekory vás zaujímajú." className={field} />
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-brand-line accent-brand-dark"
        />
        <span className="text-[0.8rem] font-normal text-brand-muted">
          Súhlasím so spracovaním osobných údajov na účel B2B ponuky podľa{' '}
          <Link to="/ochrana-sukromia" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-dark">ochrany osobných údajov</Link>
          {' '}*
        </span>
      </label>

      {status === 'error' && <p className="text-sm text-red-700">{errorMsg}</p>}

      {/* Honeypot — skryté pred používateľmi, odhalí boty */}
      <input type="text" name="website" value={honeypotValue} onChange={(e) => setHoneypotValue(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <Turnstile
        ref={turnstileRef}
        siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY}
        onSuccess={setTurnstileToken}
        onExpire={() => setTurnstileToken(null)}
        options={{ theme: 'light', language: 'sk', size: 'flexible' }}
      />

      <button
        type="submit"
        disabled={status === 'loading' || !agreed}
        className={`os-press inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[10px] border px-[26px] text-[0.78rem] font-bold uppercase leading-none tracking-[0.12em] sm:w-auto sm:justify-self-start ${
          status === 'loading'
            ? 'cursor-wait border-brand-dark bg-brand-dark text-brand-light'
            : agreed
              ? 'border-brand-dark bg-brand-dark text-brand-light hover:bg-[#333331]'
              : 'cursor-not-allowed border-brand-line bg-brand-sand text-brand-muted'
        }`}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Odosielam…
          </>
        ) : (
          'Chcem B2B cenník'
        )}
      </button>
      <p className="text-[0.82rem] font-normal text-brand-muted">Bez záväzkov · Ozveme sa do 24 h v pracovný deň</p>
    </form>
  );
};

/* =============================================================
   HLAVNÝ KOMPONENT
   ============================================================= */
export const PreKamenarstva: React.FC = () => (
  <div>
    <SEOHead
      title="Sinterovaný kameň pre kamenárstva – B2B spolupráca | Orostone"
      description="Veľkoformátové platne zo sinterovaného kameňa pre kamenárstva: 12 modelov skladom na Slovensku, odber od jednej platne a partnerský cenník podľa ročného odberu."
      canonical="https://orostone.sk/pre-kamenarstva"
      keywords={[
        'sinterovaný kameň veľkoobchod',
        'platne pre kamenárov',
        'platne pre kamenárstvo skladom',
        'sinterovaný kameň B2B',
        'veľkoformátové platne kamenárstvo',
      ]}
      structuredData={createBreadcrumbLD([
        { name: 'Orostone', url: 'https://orostone.sk/' },
        { name: 'Pre kamenárstva', url: 'https://orostone.sk/pre-kamenarstva' },
      ])}
    />

    <PageHero
      eyebrow="Pre kamenárstva"
      title="Sinterovaný kameň pre vašu dielňu. Skladom, od jednej platne."
      lead={`Dodávame veľkoformátové platne priamo kamenárstvam. ${SLABS.length} modelov máme skladom na Slovensku a naša platňa je o 11 % väčšia ako bežný formát.`}
      actions={
        <>
          <ActionButton variant="dark" to="#b2b-dopyt" arrow>
            Chcem B2B cenník
          </ActionButton>
          <TextLink to={PHONE_HREF}>Zavolať {PHONE_LABEL}</TextLink>
        </>
      }
      media={
        <PageHeroImage
          base="/images/stranky/sk-calacatta-top"
          alt="Pracovná doska Calacatta Top so zapusteným drezom, pohľad zhora"
          caption="Vizualizácia s dekorom Calacatta Top"
          position="50% 40%"
        />
      }
    />

    {/* ─── PREČO OROSTONE ─── */}
    <Section tone="sand" id="vyhody-spoluprace" className="scroll-mt-16 lg:scroll-mt-20">
      <Container>
        <SectionHeader
          eyebrow="Prečo Orostone"
          title="Čo dostanete ako partner"
          lead="Pre malé kamenárstvo je najväčší problém čakanie na materiál a minimálne odbery. Oboje sme vyriešili."
        />
        <FeatureGrid items={REASONS} columns={4} className="mt-[clamp(40px,5vw,64px)]" />
      </Container>
    </Section>

    {/* ─── PLATŇA V ČÍSLACH ─── */}
    <Section tone="chalk" id="platna">
      <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-[clamp(48px,6vw,104px)]">
        <SectionHeader
          eyebrow="Platňa"
          title="Väčšia platňa, menej spojov"
          lead="Naša platňa má 3 200 × 1 600 mm, teda 5,12 m². Bežný formát 3 200 × 1 440 mm má 4,61 m², takže z jednej platne vyrežete o 11 % viac a ostrovček často urobíte bez spoja."
        />
        <dl className="m-0 grid border-t border-brand-dark">
          {SPECS.map((s) => (
            <div key={s.label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6 border-b border-brand-line py-4">
              <dt className="text-os-eyebrow uppercase text-brand-muted">{s.label}</dt>
              <dd className="m-0 font-normal">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>

    {/* ─── MODELY SKLADOM ─── */}
    <Section tone="sand" id="modely-skladom" className="scroll-mt-16 lg:scroll-mt-20">
      <Container>
        <SectionHeader
          eyebrow="Skladom"
          title={`${SLABS.length} modelov, ktoré máme na sklade`}
          lead="Mramorové, kamenné aj betónové dekory. Každý model si môžete pozrieť v detaile, celé platne v showroome v Bošanoch."
        />
        <ul className="mt-[clamp(40px,5vw,64px)] grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
          {SLABS.map((p) => (
            <li key={p.id}>
              <Link to={`/produkt/${p.id}`} className="group grid gap-3 no-underline">
                <img
                  src={shopifySized(p.image, 360)}
                  alt={`Platňa ${p.name}`}
                  width={1536}
                  height={2752}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[1536/2752] w-full rounded-[3px] bg-brand-gray object-cover"
                />
                <span className="text-[0.86rem] font-semibold leading-snug group-hover:underline">{p.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>

    {/* ─── AKO ZAČAŤ ─── */}
    <Section tone="chalk" id="ako-zacat">
      <Container>
        <SectionHeader eyebrow="Ako začať" title="Od dopytu po prvú platňu" />
        <StepList steps={STEPS} className="mt-[clamp(40px,5vw,64px)]" />
      </Container>
    </Section>

    {/* ─── FORMULÁR ─── */}
    <Section tone="sand" id="b2b-dopyt" className="scroll-mt-16 lg:scroll-mt-20">
      <Container className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-[clamp(48px,6vw,104px)]">
        <div className="grid justify-items-start gap-6">
          <SectionHeader
            eyebrow="B2B dopyt"
            title="Pošlite dopyt, cenník dostanete do 24 hodín"
            lead="Formulár je len pre firmy, ktoré dosky samy spracúvajú: kamenárstva, výrobcov kuchýň a montážne firmy."
          />
          <div className="grid gap-1.5">
            <p className="text-os-eyebrow uppercase text-brand-muted">Radšej telefonicky?</p>
            <a href={PHONE_HREF} className="text-[clamp(1.4rem,2.2vw,2rem)] font-semibold tabular-nums no-underline hover:underline">
              {PHONE_LABEL}
            </a>
            <a href="mailto:dopyt@orostone.sk" className="font-medium underline underline-offset-[5px]">
              dopyt@orostone.sk
            </a>
          </div>
        </div>
        <PartnerForm />
      </Container>
    </Section>

    {/* ─── FAQ ─── */}
    <Section tone="chalk" id="otazky">
      <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-[clamp(48px,6vw,104px)]">
        <SectionHeader eyebrow="Otázky" title="Čo sa kamenári pýtajú" />
        <FaqList items={FAQ} />
      </Container>
    </Section>

    {/* ─── ZÁVER ─── */}
    <section className="bg-brand-gold py-[clamp(64px,8vw,108px)] text-brand-dark" aria-label="B2B cenník">
      <Container className="flex flex-wrap items-center justify-between gap-x-12 gap-y-7">
        <div>
          <h2 className="text-os-h2">Chcete vidieť partnerské ceny?</h2>
          <p className="mt-3.5 max-w-[48ch] text-[1.08rem] font-normal">
            Cenník všetkých {SLABS.length} modelov pošleme e-mailom. Bez záväzkov a bez minimálneho odberu.
          </p>
        </div>
        <div className="grid justify-items-start gap-3.5">
          <ActionButton variant="dark" to="#b2b-dopyt" arrow>
            Chcem B2B cenník
          </ActionButton>
          <a className="text-[0.95rem] font-medium tabular-nums underline underline-offset-[5px]" href={PHONE_HREF}>
            alebo zavolajte {PHONE_LABEL}
          </a>
        </div>
      </Container>
    </section>
  </div>
);
