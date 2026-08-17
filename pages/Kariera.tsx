import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  MapPin,
  Briefcase,
  Wallet,
  ChevronDown,
  ArrowRight,
  Check,
  Sparkles,
  Users,
  Gem,
  Megaphone,
  Hammer,
  Cpu,
  LayoutGrid,
  Send,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { SEOHead, createBreadcrumbLD } from '@/components/UI/SEOHead';
import {
  JOB_OPENINGS,
  CAREERS_EMAIL,
  createJobPostingLD,
  type JobOpening,
} from '@/data/careers';

/* =============================================================
   IKONY K POZÍCIÁM
   ============================================================= */
const JOB_ICONS: Record<string, LucideIcon> = {
  'ppc-specialista': Megaphone,
  kamenar: Hammer,
  'cnc-specialista': Cpu,
  obkladac: LayoutGrid,
};

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

/* =============================================================
   PREČO OROSTONE
   ============================================================= */
const REASONS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Gem,
    title: 'Materiál, ktorý má na Slovensku ešte len nabehnúť',
    description:
      'Sinterovaný kameň je u nás mladá kategória. Kto sa v ňom naučí robiť teraz, bude o pár rokov medzi tými, ktorí to vedia najlepšie.',
  },
  {
    icon: Users,
    title: 'Malý tím, priamy vplyv',
    description:
      'Rozhodnutia u nás netrvajú týždne. Vidíte, čo vaša práca spravila — na zákazke aj v číslach.',
  },
  {
    icon: Sparkles,
    title: 'Showroom v renesančnom kaštieli',
    description:
      'Naše platne si zákazníci pozerajú v Bošanoch, v priestore, ktorý sám o sebe niečo hovorí. Pracujete s materiálom vo veľkých formátoch, nie s katalógom.',
  },
  {
    icon: Check,
    title: 'Zaškolenie na materiál',
    description:
      'Sinterovaný kameň sa reže, vŕta aj lepí inak než žula. Kto s ním ešte nerobil, dostane čas a vedenie — nie hodenie do vody.',
  },
];

/* =============================================================
   KARTA POZÍCIE
   ============================================================= */
const JobCard: React.FC<{
  job: JobOpening;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ job, isOpen, onToggle }) => {
  const Icon = JOB_ICONS[job.id] ?? Briefcase;
  const panelId = `job-panel-${job.id}`;
  const mailto = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
    `Prihláška — ${job.title}`,
  )}`;

  return (
    <article
      id={job.id}
      className="scroll-mt-28 rounded-3xl border border-gray-200 bg-white overflow-hidden transition-colors hover:border-brand-gold/50"
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full text-left p-6 sm:p-8 flex items-start gap-4 sm:gap-6 group"
        >
          <span className="w-12 h-12 flex-shrink-0 rounded-2xl bg-brand-gold/10 flex items-center justify-center">
            <Icon size={22} className="text-brand-gold" />
          </span>

          <span className="flex-1 min-w-0">
            <span className="block text-lg sm:text-xl font-bold text-brand-dark group-hover:text-brand-gold transition-colors">
              {job.title}
            </span>
            <span className="mt-2 flex flex-wrap items-start gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="inline-flex items-start gap-1.5">
                <MapPin size={13} className="text-brand-gold mt-0.5 flex-shrink-0" />
                {job.location}
              </span>
              <span className="inline-flex items-start gap-1.5">
                <Briefcase size={13} className="text-brand-gold mt-0.5 flex-shrink-0" />
                {job.employmentType}
              </span>
            </span>

            {/* Mzda — vyňatá z drobného meta riadku, je to hlavné kritérium,
                podľa ktorého ľudia ponuky porovnávajú. */}
            {job.salary && (
              <span className="mt-3 inline-flex items-center gap-2.5 rounded-full bg-brand-gold/15 pl-3 pr-4 py-2">
                <Wallet size={16} className="text-brand-gold flex-shrink-0" />
                <span className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-xs text-gray-500">od</span>
                  <span className="text-lg sm:text-xl font-bold text-brand-dark leading-none">
                    {salaryParts(job.salary).amount}
                  </span>
                  <span className="text-xs text-gray-500">
                    brutto / {salaryParts(job.salary).period}
                  </span>
                </span>
              </span>
            )}

            <span className="mt-3 block text-sm text-gray-600 font-light leading-relaxed">
              {job.summary}
            </span>
          </span>

          <span className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 group-hover:bg-brand-gold/15 flex items-center justify-center transition-colors">
            <ChevronDown
              size={18}
              className={`text-brand-dark transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </span>
        </button>
      </h3>

      {isOpen && (
        <div id={panelId} className="px-6 sm:px-8 pb-8 -mt-1">
          {job.salary && (
            <div className="border-t border-gray-100 pt-6">
              <div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 px-6 py-5 sm:px-7 sm:py-6">
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-brand-gold mb-3">
                  Základná zložka mzdy
                </p>
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-3xl sm:text-4xl font-bold text-brand-dark leading-none">
                    od {salaryParts(job.salary).amount}
                  </span>
                  <span className="text-sm text-gray-600">
                    brutto / {salaryParts(job.salary).period}
                  </span>
                </p>
                {job.salary.note && (
                  <p className="mt-3 text-xs text-gray-500 leading-relaxed">{job.salary.note}</p>
                )}
              </div>
            </div>
          )}
          <div className={`${job.salary ? '' : 'border-t border-gray-100 '}pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8`}>
            <div>
              <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-brand-gold mb-4">
                Čo budete robiť
              </h4>
              <ul className="space-y-3">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={16} className="text-brand-gold mt-1 flex-shrink-0" />
                    <span className="text-gray-700 font-light leading-relaxed text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-brand-gold mb-4">
                  Koho hľadáme
                </h4>
                <ul className="space-y-3">
                  {job.requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check size={16} className="text-brand-gold mt-1 flex-shrink-0" />
                      <span className="text-gray-700 font-light leading-relaxed text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-gray-400 mb-4">
                  Výhodou
                </h4>
                <ul className="space-y-3">
                  {job.niceToHave.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                      <span className="text-gray-500 font-light leading-relaxed text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
            <a
              href={mailto}
              className="inline-flex items-center justify-center gap-2 bg-brand-dark text-white px-6 py-3.5 rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-brand-gold hover:text-brand-dark transition-colors"
            >
              <Send size={16} />
              Poslať životopis
            </a>
            <p className="text-xs text-gray-500 leading-relaxed">
              Do predmetu emailu uveďte názov pozície. Píšte na{' '}
              <span className="font-semibold text-brand-dark">{CAREERS_EMAIL}</span>.
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
    <main className="bg-white">
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

      {/* ─── HERO ─── */}
      <section className="relative bg-brand-dark text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-dark/80" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
              Kariéra
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6 leading-tight">
              Hľadáme kolegov do tímu
            </h1>
            <p className="text-lg md:text-xl font-light text-gray-300 leading-relaxed max-w-2xl">
              Orostone privádza na slovenský trh sinterovaný kameň — materiál na pracovné dosky,
              ostrovčeky, zásteny a obklady. Rozširujeme tím o ľudí, ktorí robia svoju prácu presne
              a vedia, prečo ju robia práve tak.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#otvorene-pozicie"
                className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-dark px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-white transition-colors"
              >
                Otvorené pozície ({JOB_OPENINGS.length})
                <ArrowRight size={16} />
              </a>
              <a
                href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent('Životopis — Orostone')}`}
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                <Mail size={16} />
                Poslať životopis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PREČO OROSTONE ─── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
              Prečo práve tu
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark">
              Čo u nás dostanete
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REASONS.map((reason, i) => (
              <div key={i} className="p-8 bg-[#F9F9F7] rounded-3xl">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center mb-6">
                  <reason.icon size={22} className="text-brand-gold" />
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-3">{reason.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OTVORENÉ POZÍCIE ─── */}
      <section id="otvorene-pozicie" className="scroll-mt-24 py-20 md:py-28 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
              Otvorené pozície
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark mb-5">
              {openingsHeading(JOB_OPENINGS.length)}
            </h2>
            <p className="text-gray-500 font-light leading-relaxed">
              Kliknutím na pozíciu si otvoríte celý popis. Ak vám sedí viac ako jedna, napíšte to
              do emailu — nie je to problém.
            </p>
          </div>

          <div className="space-y-4 max-w-5xl">
            {JOB_OPENINGS.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isOpen={openJob === job.id}
                onToggle={() => setOpenJob(openJob === job.id ? null : job.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── AKO SA PRIHLÁSIŤ ─── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-5xl">
            <div>
              <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
                Ako sa prihlásiť
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark mb-6">
                Stačí email a životopis
              </h2>
              <p className="text-gray-600 font-light leading-relaxed mb-8">
                Životopis posielajte na <strong className="text-brand-dark font-semibold">{CAREERS_EMAIL}</strong>.
                Do predmetu uveďte názov pozície, o ktorú máte záujem. Prihlášky čítame priebežne
                — ak vaša skúsenosť sedí, ozveme sa vám s termínom stretnutia.
              </p>
              <a
                href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent('Životopis — Orostone')}`}
                className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-brand-gold hover:text-brand-dark transition-colors"
              >
                <Mail size={16} />
                {CAREERS_EMAIL}
              </a>
            </div>

            <div className="rounded-3xl border border-gray-200 p-8 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center mb-6">
                <FileText size={22} className="text-brand-gold" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark mb-5">Čo do emailu pridať</h3>
              <ul className="space-y-4">
                {[
                  'Životopis alebo aspoň prehľad toho, čo ste robili posledné roky.',
                  'Odkedy môžete nastúpiť a v akej forme spolupráce (TPP alebo živnosť).',
                  'Pri remeselných pozíciách fotky vašej práce, ak nejaké máte. Povedia viac než odsek textu.',
                  'Pri PPC pozícii odkazy na kampane alebo výsledky, ktoré môžete ukázať.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={16} className="text-brand-gold mt-1 flex-shrink-0" />
                    <span className="text-gray-700 font-light leading-relaxed text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OTVORENÁ PRIHLÁŠKA + GDPR ─── */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl rounded-3xl bg-brand-dark text-white px-8 py-10 sm:px-12 sm:py-12">
            <h2 className="text-2xl md:text-3xl font-sans font-bold mb-4">
              Nenašli ste svoju pozíciu?
            </h2>
            <p className="text-gray-300 font-light leading-relaxed max-w-2xl mb-8">
              Zoznam vyššie nie je úplný obraz toho, čo hľadáme. Ak robíte niečo, čo by nám podľa
              vás pomohlo, napíšte nám a povedzte, čo viete. Otvorené prihlášky čítame rovnako
              ako tie na konkrétnu pozíciu.
            </p>
            <a
              href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent('Otvorená prihláška — Orostone')}`}
              className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-8 py-4 rounded-full text-sm font-bold tracking-wider uppercase hover:bg-white transition-colors"
            >
              <Mail size={16} />
              Napísať nám
            </a>

            <p className="mt-10 pt-8 border-t border-white/10 text-xs text-gray-400 leading-relaxed max-w-3xl">
              <strong className="text-gray-300 font-semibold">Spracúvanie osobných údajov:</strong>{' '}
              Zaslaním životopisu súhlasíte so spracúvaním osobných údajov, ktoré v ňom uvediete,
              na účel výberového konania na pozíciu, o ktorú sa uchádzate. Údaje spracúva
              Orostone s.r.o. a po ukončení výberového konania ich vymaže. Ak si vaše podklady
              môžeme ponechať aj pre budúce pozície, uveďte to prosím priamo v emaile — bez
              vášho výslovného súhlasu ich neuchovávame. Viac v{' '}
              <Link
                to="/ochrana-sukromia"
                className="underline underline-offset-2 hover:text-brand-gold transition-colors"
              >
                Ochrane osobných údajov
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
