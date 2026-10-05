import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/UI/SEOHead';
import {
  ActionButton,
  ArticleLinks,
  Container,
  FaqList,
  FeatureGrid,
  GoldBand,
  IconFabrication,
  IconSlabs,
  IconWarranty,
  PageHero,
  PageHeroImage,
  Section,
  SectionHeader,
  StepList,
  TextLink,
  useDrawIn,
} from '@/components/Design';
import { HOME_DECORS, HOME_REALIZATIONS, decorImage } from '@/components/Home/homeData';
import { KITCHEN_FAQS, KUCHYNE_FEATURES, KUCHYNE_H1, KUCHYNE_PROCESS_STEPS } from '@/data/pillars/kuchyne';

// Verejný 3D konfigurátor beží v CRM (orosotne/orostone-crm, /konfigurator). Je informačný:
// návrh posúdi obchodný zástupca, cenu ani termín nesľubuje.
const CONFIGURATOR_URL = 'https://crm.orostone.sk/konfigurator';

// Real client kitchens (decor names from the time of installation). "Sivý kameň" stays out until its decor is confirmed.
const GALLERY = HOME_REALIZATIONS.filter((r) => r.image !== 'sivy-kamen-kniznica');

const FEATURE_ICONS = [IconFabrication, IconSlabs, IconWarranty];
const FEATURES = KUCHYNE_FEATURES.map((f, i) => ({ title: f.title, text: f.description, icon: FEATURE_ICONS[i] }));

const STEPS = KUCHYNE_PROCESS_STEPS.map((s) => ({ title: s.title, text: s.description }));

const ARTICLES = [
  {
    to: '/blog/kuchynsky-ostrovcek-zo-sinterovaneho-kamena',
    title: 'Kuchynský ostrovček',
    text: 'Kompletný sprievodca rozmermi, hrúbkou a waterfall hranami.',
  },
  {
    to: '/blog/neviditelna-varna-doska-v-sinterovanom-kamene',
    title: 'Neviditeľná varná doska',
    text: 'Ako funguje indukcia integrovaná pod sinterovaný kameň.',
  },
  {
    to: '/blog/12mm-vs-20mm-hrubka',
    title: '12 mm vs 20 mm',
    text: 'Aká hrúbka platne je správna pre váš projekt.',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Domov', item: 'https://orostone.sk/' },
        { '@type': 'ListItem', position: 2, name: 'Kuchyne', item: 'https://orostone.sk/kuchyne' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: KITCHEN_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ],
};

const rowHead = 'flex flex-wrap items-end justify-between gap-x-10 gap-y-5';
const below = 'mt-[clamp(40px,5vw,64px)]';

/** L-shaped worktop in isometric line drawing: the things you set in the configurator (shape, size, sink, hob). */
const WorktopDrawing: React.FC = () => {
  const draw = useDrawIn<HTMLDivElement>(0.25);
  return (
    <div ref={draw.ref} className={`os-on-dark ${draw.className}`}>
      <svg className="os-ico h-auto w-full" viewBox="-12 16 494 240" aria-hidden="true">
        <g className="ln">
          <path pathLength={1} d="M182 46 L441.8 196 L389.8 226 L182 106 L78.1 166 L26.1 136Z" />
          <path pathLength={1} d="M441.8 196V210M389.8 226V240M182 106V120M78.1 166V180M26.1 136V150" />
          <path pathLength={1} d="M441.8 210 L389.8 240 L182 120 L78.1 180 L26.1 150" />
          <path pathLength={1} d="M299.8 128 L355.2 160 L327.5 176 L272.1 144Z M300.6 133.5 L345.7 159.5 L326.6 170.5 L281.6 144.5Z" />
          <path pathLength={1} d="M117.9 93 L152.6 113 L95.4 146 L60.8 126Z" />
          <ellipse pathLength={1} cx="114.5" cy="107" rx="8.6" ry="5" />
          <ellipse pathLength={1} cx="128.3" cy="115" rx="8.6" ry="5" />
          <ellipse pathLength={1} cx="86.7" cy="123" rx="8.6" ry="5" />
          <ellipse pathLength={1} cx="100.6" cy="131" rx="8.6" ry="5" />
        </g>
        <g className="ln" style={{ stroke: '#ECD488', strokeWidth: 1.1 }}>
          <path pathLength={1} d="M204.5 33 L464.3 183 M199.3 36 L209.7 30 M459.1 186 L469.5 180 M185.5 44 L201.1 35 M445.3 194 L460.9 185" />
          <path pathLength={1} d="M159.5 33 L3.6 123 M164.7 36 L154.3 30 M8.8 126 L-1.6 120 M178.5 44 L162.9 35 M22.7 134 L7.1 125" />
        </g>
      </svg>
    </div>
  );
};

export const Kuchyne = () => {
  return (
    <div>
      <SEOHead
        title="Kamenné pracovné dosky do kuchyne | OROSTONE"
        description="Pracovné dosky zo sinterovaného kameňa na mieru. Odolný povrch, nízka nasiakavosť, bez impregnácie. Pošlite pôdorys, vyrátame orientačnú cenu."
        canonical="https://orostone.sk/kuchyne"
        keywords={['kuchyne sinterovaný kameň', 'kuchynská doska', 'pracovná doska kuchyňa', 'sinterovaný kameň kuchyňa']}
        structuredData={structuredData}
      />

      <PageHero
        eyebrow="Kuchyne zo sinterovaného kameňa"
        title={KUCHYNE_H1}
        lead="Pracovné dosky, ostrovčeky a obklady, ktoré vydržia desaťročia bez údržby. Odolné voči teplu, škvrnám, škrabancom a UV žiareniu."
        actions={
          <>
            <ActionButton variant="dark" to="/vzorky" arrow>
              Objednať vzorky zadarmo
            </ActionButton>
            <TextLink to="/kategoria/sintered-stone">Pozrieť katalóg</TextLink>
          </>
        }
        media={
          <PageHeroImage
            base="/images/stranky/kuchyne-taj-mahal"
            alt="Kuchyňa s ostrovčekom a zástenou v dekore Taj Mahal a dubovými skrinkami, čelný pohľad"
            caption="Vizualizácia s dekorom Taj Mahal"
            position="50% 70%"
          />
        }
      >
        <FeatureGrid items={FEATURES} className="mt-[clamp(56px,7vw,104px)]" />
      </PageHero>

      <Section tone="sand">
        <Container>
          <div className={rowHead}>
            <SectionHeader
              eyebrow="Realizácie"
              title="Kuchyne našich klientov"
              lead="Pozrite sa, ako sinterovaný kameň Orostone vyzerá v reálnych kuchyniach."
            />
            <TextLink to="/realizacie">Všetky realizácie</TextLink>
          </div>
          <ul className={`${below} grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3`}>
            {GALLERY.map((r) => (
              <li key={r.image}>
                <figure className="m-0 grid gap-3">
                  <img
                    src={`/images/home/realizacie/${r.image}.webp`}
                    alt={r.alt}
                    width={r.width}
                    height={r.height}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full rounded-[3px] object-cover"
                    style={{ objectPosition: r.pos }}
                  />
                  <figcaption className="grid gap-0.5">
                    <h3 className="text-[1.05rem] font-semibold">{r.decor}</h3>
                    <span className="text-[0.92rem] font-normal text-brand-muted">{r.text}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.84rem] font-normal text-brand-muted">
            Fotky sú z montáží u klientov. Názvy dekorov sú z čias realizácie.
          </p>
        </Container>
      </Section>

      <Section tone="chalk">
        <Container>
          <div className={rowHead}>
            <SectionHeader
              eyebrow="Dekory"
              title="Dekory na kuchynskú dosku"
              lead="Celé platne 3200 × 1600 mm v hrúbke 12 mm. Pri každom dekore nájdete cenu, detail kresby aj vzorku zadarmo."
            />
            <TextLink to="/kategoria/sintered-stone">Celý katalóg</TextLink>
          </div>
          <ul
            className={`${below} -mx-[var(--os-edge)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--os-edge)] pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-6 sm:gap-y-8 sm:overflow-visible sm:px-0 xl:grid-cols-12`}
          >
            {HOME_DECORS.map((d) => (
              <li key={d.slug} className="w-[30vw] flex-none snap-start sm:w-auto">
                <Link to={`/produkt/${d.slug}`} className="group grid gap-3 no-underline">
                  <span className="block aspect-[1/2] overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(26,26,26,0.07)]">
                    <img
                      src={decorImage(d.slug)}
                      alt=""
                      width={520}
                      height={931}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="grid gap-0.5">
                    <span className="text-[0.9rem] font-semibold leading-snug group-hover:underline">{d.name}</span>
                    <span className="text-[0.8rem] font-normal text-brand-muted">{d.label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SectionHeader eyebrow="Ako to funguje" title="Od výberu po inštaláciu" />
          <StepList steps={STEPS} className={below} />
        </Container>
      </Section>

      <Section tone="graphite" className="overflow-hidden">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-[clamp(48px,6vw,104px)]">
          <div className="grid justify-items-start gap-8">
            <SectionHeader
              onDark
              eyebrow="3D konfigurátor"
              title="Navrhnite si pracovnú dosku v 3D"
              lead="Malá vzorka neukáže, ako bude dekor pôsobiť na celej doske. V konfigurátore zadáte tvar kuchyne, rozmery, dekor aj otvory pre drez a varnú dosku a návrh uvidíte v 3D. Netreba sa registrovať — kontakt zadáte až pri odoslaní. Návrh posúdi náš obchodný zástupca a ozve sa vám."
            />
            <ActionButton variant="light-outline" to={CONFIGURATOR_URL} arrow>
              Otvoriť 3D konfigurátor
            </ActionButton>
          </div>
          <WorktopDrawing />
        </Container>
      </Section>

      <Section tone="chalk">
        <Container className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <SectionHeader
            title="Plánujete novú kuchyňu?"
            lead="Pošleme vám vzorky materiálov zadarmo, poradíme s výberom dekóru a pripravíme nezáväznú cenovú ponuku na mieru."
          />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:justify-end">
            <ActionButton variant="dark" to="/vzorky" arrow>
              Objednať vzorky zadarmo
            </ActionButton>
            <TextLink to="/kontakt">Kontaktovať nás</TextLink>
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-[clamp(48px,6vw,104px)]">
          <SectionHeader eyebrow="Otázky" title="Často kladené otázky" />
          <FaqList items={KITCHEN_FAQS} />
        </Container>
      </Section>

      <Section tone="chalk">
        <Container>
          <SectionHeader eyebrow="Poradňa" title="Užitočné články" />
          <ArticleLinks items={ARTICLES} className={below} />
        </Container>
      </Section>

      <GoldBand od="kuchyne" />
    </div>
  );
};
