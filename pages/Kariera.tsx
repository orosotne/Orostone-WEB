import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead, createBreadcrumbLD } from '@/components/UI/SEOHead';
import {
  ActionButton,
  ArrowIcon,
  Container,
  FeatureGrid,
  IconCastle,
  IconFabrication,
  IconPriceClock,
  IconSlabs,
  PageHero,
  Section,
  SectionHeader,
  TextLink,
  type FeatureItem,
} from '@/components/Design';
import {
  JOB_OPENINGS,
  CAREERS_EMAIL,
  createJobPostingLD,
  type JobOpening,
} from '@/data/careers';

/**
 * Rozloží mzdu na časti, aby sa dala vysádzať so zvýraznenou sumou.
 * Vždy hrubá mzda — § 62 ods. 2 zákona č. 5/2004 Z. z. žiada uviesť
 * sumu základnej zložky mzdy a musí byť zrejmé, o aké číslo ide.
 */
const salaryParts = (salary: NonNullable<JobOpening['salary']>) => ({
  amount: `${salary.min.toLocaleString('sk-SK')} €`,
  period: salary.unit === 'MONTH' ? 'mesiac' : 'hodinu',
});

/** Slovenské skloňovanie po číslovke: 1 pozícia · 2–4 pozície · 5+ pozícií. */
const openingsHeading = (count: number): string => {
  if (count === 1) return '1 pozícia, ktorú práve obsadzujeme';
  if (count < 5) return `${count} pozície, ktoré práve obsadzujeme`;
  return `${count} pozícií, ktoré práve obsadzujeme`;
};

/** "Kamenár — výroba pracovných dosiek…" → "Kamenár" for the short list in the hero. */
const shortTitle = (title: string) => title.split(' — ')[0];

const cvMailto = (subject: string) => `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(subject)}`;

/* =============================================================
   PREČO OROSTONE
   ============================================================= */
const REASONS: FeatureItem[] = [
  {
    icon: IconSlabs,
    title: 'Materiál, ktorý má na Slovensku ešte len nabehnúť',
    text: 'Sinterovaný kameň je u nás mladá kategória. Kto sa v ňom naučí robiť teraz, bude o pár rokov medzi tými, ktorí to vedia najlepšie.',
  },
  {
    icon: IconPriceClock,
    title: 'Malý tím, priamy vplyv',
    text: 'Rozhodnutia u nás netrvajú týždne. Vidíte, čo vaša práca spravila — na zákazke aj v číslach.',
  },
  {
    icon: IconCastle,
    title: 'Showroom v renesančnom kaštieli',
    text: 'Naše platne si zákazníci pozerajú v Bošanoch, v priestore, ktorý sám o sebe niečo hovorí. Pracujete s materiálom vo veľkých formátoch, nie s katalógom.',
  },
  {
    icon: IconFabrication,
    title: 'Zaškolenie na materiál',
    text: 'Sinterovaný kameň sa reže, vŕta aj lepí inak než žula. Kto s ním ešte nerobil, dostane čas a vedenie — nie hodenie do vody.',
  },
];

const APPLY_TIPS = [
  'Životopis alebo aspoň prehľad toho, čo ste robili posledné roky.',
  'Odkedy môžete nastúpiť a v akej forme spolupráce (TPP alebo živnosť).',
  'Pri remeselných pozíciách fotky vašej práce, ak nejaké máte. Povedia viac než odsek textu.',
  'Pri PPC pozícii odkazy na kampane alebo výsledky, ktoré môžete ukázať.',
];

const listItem = 'border-b border-brand-line py-3 text-[0.96rem] font-light';
const listHead = 'mb-3 text-os-eyebrow uppercase';

/* =============================================================
   KARTA POZÍCIE
   ============================================================= */
const JobCard: React.FC<{
  job: JobOpening;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ job, isOpen, onToggle }) => {
  const panelId = `job-panel-${job.id}`;

  return (
    <article id={job.id} className="scroll-mt-28 border-b border-brand-line">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-6 py-8 text-left"
        >
          <span className="grid gap-3">
            <span className="text-os-h3 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
              {job.title}
            </span>
            <span className="text-[0.88rem] font-normal text-brand-muted">
              {job.location} · {job.employmentType}
            </span>
            {/* Mzda — vyňatá z drobného meta riadku, je to hlavné kritérium,
                podľa ktorého ľudia ponuky porovnávajú. */}
            {job.salary && (
              <span className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="text-[0.88rem] font-normal text-brand-muted">od</span>
                <span className="text-[1.3rem] font-semibold leading-none tabular-nums">{salaryParts(job.salary).amount}</span>
                <span className="text-[0.88rem] font-normal text-brand-muted">brutto / {salaryParts(job.salary).period}</span>
              </span>
            )}
            <span className="max-w-[72ch] text-[0.96rem] font-light leading-relaxed text-brand-muted">{job.summary}</span>
          </span>
          <span
            aria-hidden="true"
            className={`relative mt-2 h-4 w-4 flex-none before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-current after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-current after:transition-transform after:duration-300 ${isOpen ? 'after:scale-y-0' : ''}`}
          />
        </button>
      </h3>

      {isOpen && (
        <div id={panelId} className="grid gap-10 pb-12">
          {job.salary && (
            <div className="max-w-[640px] rounded-[3px] bg-brand-sand px-6 py-5">
              <p className={listHead}>Základná zložka mzdy</p>
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-semibold leading-none tabular-nums">
                  od {salaryParts(job.salary).amount}
                </span>
                <span className="text-[0.92rem] font-normal text-brand-muted">brutto / {salaryParts(job.salary).period}</span>
              </p>
              {job.salary.note && <p className="mt-3 text-[0.84rem] font-normal text-brand-muted">{job.salary.note}</p>}
            </div>
          )}
          <div className="grid gap-10 lg:grid-cols-3">
            <div>
              <h4 className={listHead}>Čo budete robiť</h4>
              <ul className="border-t border-brand-line">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className={listItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={listHead}>Koho hľadáme</h4>
              <ul className="border-t border-brand-line">
                {job.requirements.map((item, i) => (
                  <li key={i} className={listItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={`${listHead} text-brand-muted`}>Výhodou</h4>
              <ul className="border-t border-brand-line">
                {job.niceToHave.map((item, i) => (
                  <li key={i} className={`${listItem} text-brand-muted`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ActionButton variant="dark" to={cvMailto(`Prihláška — ${job.title}`)} arrow>
              Poslať životopis
            </ActionButton>
            <p className="text-[0.88rem] font-normal text-brand-muted">
              Do predmetu emailu uveďte názov pozície. Píšte na <span className="font-semibold text-brand-dark">{CAREERS_EMAIL}</span>.
            </p>
          </div>
        </div>
      )}
    </article>
  );
};

/* =============================================================
   HLAVNÝ KOMPONENT
   ============================================================= */
export const Kariera: React.FC = () => {
  const [openJob, setOpenJob] = useState<string | null>(null);

  // Deep link — /kariera#kamenar otvorí konkrétnu pozíciu a odroluje na ňu.
  // Rolujeme až v ďalšom frame: karta sa najskôr musí rozbaliť a ScrollToTop
  // z EshopApp medzičasom vráti stránku na začiatok.
  useEffect(() => {
    let raf = 0;
    const timers: number[] = [];

    const openFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || !JOB_OPENINGS.some((j) => j.id === hash)) return;
      setOpenJob(hash);
      const scroll = () => document.getElementById(hash)?.scrollIntoView({ block: 'start' });
      raf = requestAnimationFrame(scroll);
      // Poistka — obrázky nad kartou môžu ešte posunúť layout.
      timers.push(window.setTimeout(scroll, 250));
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => {
      window.removeEventListener('hashchange', openFromHash);
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  const jobPostingsLD = {
    '@context': 'https://schema.org',
    '@graph': JOB_OPENINGS.map(createJobPostingLD),
  };

  return (
    <div>
      <SEOHead
        title="Kariéra v Orostone — otvorené pozície | OROSTONE"
        description="Hľadáme kamenára, CNC špecialistu na vodný lúč a pílu, obkladača na veľké formáty a PPC špecialistu. Životopis posielajte na info@orostone.sk."
        canonical="https://orostone.sk/kariera"
        keywords={[
          'práca Orostone',
          'kariéra sinterovaný kameň',
          'práca kamenár',
          'práca CNC operátor vodný lúč',
          'práca obkladač veľkoformátové platne',
          'PPC špecialista práca',
        ]}
        structuredData={createBreadcrumbLD([
          { name: 'OROSTONE', url: 'https://orostone.sk/' },
          { name: 'Kariéra', url: 'https://orostone.sk/kariera' },
        ])}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingsLD) }}
      />

      <PageHero
        eyebrow="Kariéra"
        title="Hľadáme kolegov do tímu"
        lead="Orostone privádza na slovenský trh sinterovaný kameň — materiál na pracovné dosky, ostrovčeky, zásteny a obklady. Rozširujeme tím o ľudí, ktorí robia svoju prácu presne a vedia, prečo ju robia práve tak."
        actions={
          <>
            <ActionButton variant="dark" to="#otvorene-pozicie" arrow>
              Otvorené pozície ({JOB_OPENINGS.length})
            </ActionButton>
            <TextLink to={cvMailto('Životopis — Orostone')}>Poslať životopis</TextLink>
          </>
        }
        media={
          <nav aria-label="Otvorené pozície" className="grid gap-3 lg:pt-8">
            <p className="text-os-eyebrow uppercase text-brand-muted">Otvorené pozície</p>
            <ul className="border-t border-brand-dark">
              {JOB_OPENINGS.map((job) => (
                <li key={job.id} className="border-b border-brand-line">
                  <a
                    href={`#${job.id}`}
                    className="group grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-x-5 py-4 no-underline"
                  >
                    <span className="text-[1.08rem] font-semibold group-hover:underline">{shortTitle(job.title)}</span>
                    {job.salary && (
                      <span className="text-[0.92rem] font-normal tabular-nums text-brand-muted">
                        od {salaryParts(job.salary).amount}
                      </span>
                    )}
                    <ArrowIcon className="h-4 w-4 self-center transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      {/* ─── PREČO OROSTONE ─── */}
      <Section tone="sand">
        <Container>
          <SectionHeader eyebrow="Prečo práve tu" title="Čo u nás dostanete" />
          <FeatureGrid items={REASONS} columns={4} className="mt-[clamp(40px,5vw,64px)]" />
        </Container>
      </Section>

      {/* ─── OTVORENÉ POZÍCIE ─── */}
      <Section tone="chalk" id="otvorene-pozicie" className="scroll-mt-16 lg:scroll-mt-20">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-[clamp(48px,6vw,104px)]">
          <SectionHeader
            eyebrow="Otvorené pozície"
            title={openingsHeading(JOB_OPENINGS.length)}
            lead="Kliknutím na pozíciu si otvoríte celý popis. Ak vám sedí viac ako jedna, napíšte to do emailu — nie je to problém."
          />
          <div className="border-t border-brand-dark">
            {JOB_OPENINGS.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isOpen={openJob === job.id}
                onToggle={() => setOpenJob(openJob === job.id ? null : job.id)}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* ─── AKO SA PRIHLÁSIŤ ─── */}
      <Section tone="sand">
        <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-[clamp(48px,6vw,104px)]">
          <div className="grid justify-items-start gap-6">
            <SectionHeader eyebrow="Ako sa prihlásiť" title="Stačí email a životopis" />
            <p className="max-w-[54ch] font-light text-brand-muted">
              Životopis posielajte na <strong className="font-semibold text-brand-dark">{CAREERS_EMAIL}</strong>. Do
              predmetu uveďte názov pozície, o ktorú máte záujem. Prihlášky čítame priebežne — ak vaša skúsenosť sedí, ozveme
              sa vám s termínom stretnutia.
            </p>
            <ActionButton variant="dark" to={cvMailto('Životopis — Orostone')} arrow>
              Poslať životopis
            </ActionButton>
          </div>
          <div className="grid gap-5 rounded-[3px] bg-brand-light p-[clamp(28px,3vw,44px)]">
            <h3 className="text-os-h3">Čo do emailu pridať</h3>
            <ul className="border-t border-brand-line">
              {APPLY_TIPS.map((item) => (
                <li key={item} className={listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ─── OTVORENÁ PRIHLÁŠKA + GDPR ─── */}
      <section className="bg-brand-gold py-[clamp(64px,8vw,108px)] text-brand-dark" aria-label="Otvorená prihláška">
        <Container className="grid gap-8">
          <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-7">
            <div className="grid gap-3.5">
              <h2 className="text-os-h2">Nenašli ste svoju pozíciu?</h2>
              <p className="max-w-[60ch] text-[1.05rem] font-normal">
                Zoznam vyššie nie je úplný obraz toho, čo hľadáme. Ak robíte niečo, čo by nám podľa vás pomohlo, napíšte nám a
                povedzte, čo viete. Otvorené prihlášky čítame rovnako ako tie na konkrétnu pozíciu.
              </p>
            </div>
            <ActionButton variant="dark" to={cvMailto('Otvorená prihláška — Orostone')} arrow>
              Napísať nám
            </ActionButton>
          </div>
          <p className="max-w-[90ch] border-t border-brand-dark/20 pt-6 text-[0.84rem] font-normal leading-relaxed text-brand-dark/80">
            <strong className="font-semibold text-brand-dark">Spracúvanie osobných údajov:</strong> Zaslaním životopisu
            súhlasíte so spracúvaním osobných údajov, ktoré v ňom uvediete, na účel výberového konania na pozíciu, o ktorú sa
            uchádzate. Údaje spracúva Orostone s.r.o. a po ukončení výberového konania ich vymaže. Ak si vaše podklady môžeme
            ponechať aj pre budúce pozície, uveďte to prosím priamo v emaile — bez vášho výslovného súhlasu ich neuchovávame. Viac
            v{' '}
            <Link to="/ochrana-sukromia" className="underline underline-offset-2">
              Ochrane osobných údajov
            </Link>
            .
          </p>
        </Container>
      </section>
    </div>
  );
};
