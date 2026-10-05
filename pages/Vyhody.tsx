import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/UI/SEOHead';
import {
  ActionButton,
  ArrowIcon,
  Container,
  Eyebrow,
  FaqList,
  GoldBand,
  PageHero,
  PageHeroImage,
  Section,
  SectionHeader,
  TextLink,
  useDrawIn,
} from '@/components/Design';
import {
  VYHODY_FAQ,
  COMPARISON_DATA,
  VYHODY_BENEFITS,
  VYHODY_COMPARISON_COLUMNS,
  VYHODY_VERDICTS,
  VYHODY_RELATED_LINKS,
} from '@/data/pillars/vyhody';

/* =============================================================
   DATA — zdieľané s prerenderom cez data/pillars/vyhody.ts
   ============================================================= */
const FAQ_ITEMS = VYHODY_FAQ;

// One visualization per benefit (zip by index with VYHODY_BENEFITS): the property shown, not described.
const BENEFIT_IMAGES = [
  { base: 'vyhody-teplo', alt: 'Hrniec z nehrdzavejúcej ocele priamo na pracovnej doske Gothic Gold' },
  { base: 'vyhody-nasiakavost', alt: 'Sprchový kút obložený veľkoformátovými platňami Statuario Diamante' },
  { base: 'vyhody-skvrny', alt: 'Pohár červeného vína, káva a citrón na doske Calacatta Top, pohľad zhora' },
  { base: 'vyhody-uv', alt: 'Ostrovček Calacatta Top pri veľkom okne v slnečnom svetle' },
  { base: 'vyhody-udrzba', alt: 'Ruka utiera rozliatu tekutinu a omrvinky z dosky Calacatta Top vlhkou utierkou' },
  { base: 'vyhody-varna-doska', alt: 'Ruka kladie hrniec priamo na súvislú dosku Gothic Gold bez viditeľných varných zón, pohľad zhora' },
];
const BENEFITS = VYHODY_BENEFITS.map((b, i) => ({ ...b, image: BENEFIT_IMAGES[i] }));

const HOB_POINTS = [
  'Indukčný modul pod dosku s hrúbkou presne 12 mm',
  'Žiadne viditeľné ovládacie prvky na povrchu',
  'Ovládanie cez dotykový panel alebo mobilnú aplikáciu',
  'Plná integrácia s dizajnom kuchyne',
  'Jednoduché čistenie — celý povrch je hladký',
];

const BLOG_CARDS = [
  {
    to: '/blog/neviditelna-varna-doska-v-sinterovanom-kamene',
    image: '/images/blog/article-22/hero-original.webp',
    alt: 'Neviditeľná varná doska v sinterovanom kameni',
    title: 'Neviditeľná varná doska v sinterovanom kameni',
    text: 'Kompletný sprievodca — ako funguje, koľko stojí, aký kameň vybrať.',
  },
  {
    to: '/blog/kuchynsky-ostrovcek-zo-sinterovaneho-kamena',
    image: '/images/blog/article-23/hero.webp',
    alt: 'Kuchynský ostrovček zo sinterovaného kameňa',
    title: 'Kuchynský ostrovček zo sinterovaného kameňa',
    text: 'Dizajn, materiál, rozmery — všetko, čo potrebujete vedieť.',
  },
];

const COMPARISON_KEYS = Object.keys(VYHODY_COMPARISON_COLUMNS) as Array<keyof typeof VYHODY_COMPARISON_COLUMNS>;

/* =============================================================
   FAQ SCHEMA JSON-LD
   ============================================================= */
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const below = 'mt-[clamp(40px,5vw,64px)]';
const th = 'py-4 pr-4 text-left text-[0.82rem] font-semibold text-brand-muted';
const td = 'py-4 pr-4 align-top';

/** Cross-section of an invisible hob: pot on the 12 mm slab, induction coil under it, field through the stone. */
const HobSectionDrawing: React.FC = () => {
  const draw = useDrawIn<HTMLElement>(0.3);
  const coils = Array.from({ length: 12 }, (_, i) => 176 + i * 17);
  return (
    <figure ref={draw.ref} className={`m-0 grid gap-6 rounded-[3px] bg-brand-sand p-[clamp(24px,4vw,56px)] ${draw.className}`}>
      <svg className="os-ico h-auto w-full" viewBox="24 46 560 192" aria-hidden="true">
        <g className="ln">
          <rect className="fill" pathLength={1} x="40" y="150" width="460" height="36" rx="1.5" />
          <path pathLength={1} d="M200 66V140Q200 150 210 150H330Q340 150 340 140V66M194 66H346M258 66C258 56 282 56 282 66" />
          <path pathLength={1} d="M200 84H182V96H200M340 84H358V96H340" />
          <rect pathLength={1} x="160" y="194" width="220" height="34" rx="3" />
          {coils.map((cx) => (
            <circle key={cx} pathLength={1} cx={cx} cy="211" r="5" />
          ))}
          <path pathLength={1} d="M516 150V186M510 150H522M510 186H522" />
        </g>
        <g className="ln" style={{ stroke: '#1A1A1A', strokeOpacity: 0.28, strokeWidth: 1 }}>
          <path pathLength={1} d="M58 172C118 160 178 182 238 168S358 160 418 176S478 170 492 162" />
        </g>
        <g className="ln" style={{ stroke: '#C9A94F', strokeWidth: 1.4 }}>
          <path pathLength={1} d="M222 194C214 180 230 164 222 150M252 194C244 180 260 164 252 150M288 194C280 180 296 164 288 150M318 194C310 180 326 164 318 150" />
        </g>
        <text x="530" y="173" fill="#5F5E5A" fontSize="13" fontWeight="600" fontFamily="inherit">
          12 mm
        </text>
      </svg>
      <figcaption className="text-[0.84rem] font-normal text-brand-muted">
        Rez doskou: indukčný modul je pod 12 mm platňou a ohrieva hrniec priamo cez kameň.
      </figcaption>
    </figure>
  );
};

/* =============================================================
   HLAVNÝ KOMPONENT
   ============================================================= */
export const Vyhody = () => {
  return (
    <div>
      <SEOHead
        title="Výhody sinterovaného kameňa | OROSTONE"
        description="Sinterovaný kameň odoláva teplu, škvrnám a poškriabaniu. Pozrite porovnanie s technickým kameňom, žulou a mramorom — rozdiely, ktoré reálne rozhodujú."
        canonical="https://orostone.sk/vyhody"
        keywords={['výhody sinterovaného kameňa', 'neviditeľná varná doska', 'neviditeľná indukčná doska', 'sinterovaný kameň vs žula', 'sinterovaný kameň údržba', 'odolnosť sinterovaného kameňa']}
      />

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />

      <PageHero
        eyebrow="Prečo sinterovaný kameň"
        title="Výhody sinterovaného kameňa"
        lead="Materiál, ktorý odolá horúcim hrncom, nepotrebuje impregnáciu a umožňuje integráciu neviditeľnej indukčnej varnej dosky priamo do pracovnej plochy."
        media={
          <PageHeroImage
            base="/images/stranky/vyhody-gothic-gold"
            alt="Pracovná doska Gothic Gold s mosadzným drezom a batériou, pohľad zhora"
            caption="Vizualizácia s dekorom Gothic Gold"
            position="50% 20%"
          />
        }
      />

      <Section tone="sand">
        <Container>
          <SectionHeader
            eyebrow="Kľúčové vlastnosti"
            title="6 dôvodov, prečo si vybrať sinterovaný kameň"
            lead="Každá vlastnosť je overená nezávislými certifikáciami a laboratórnymi testami."
          />
          <ul className={`${below} grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3`}>
            {BENEFITS.map((b) => (
              <li key={b.title} className="grid content-start gap-3">
                <picture>
                  <source
                    type="image/avif"
                    srcSet={`/images/stranky/${b.image.base}-640.avif 640w, /images/stranky/${b.image.base}-1200.avif 1200w`}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                  />
                  <img
                    src={`/images/stranky/${b.image.base}-640.webp`}
                    srcSet={`/images/stranky/${b.image.base}-640.webp 640w, /images/stranky/${b.image.base}-1200.webp 1200w`}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                    alt={b.image.alt}
                    width={1200}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="mb-2 aspect-square w-full rounded-[3px] object-cover"
                  />
                </picture>
                <h3 className="text-[1.2rem] font-semibold leading-snug">{b.title}</h3>
                <p className="max-w-[46ch] font-light text-brand-muted">{b.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[0.84rem] font-normal text-brand-muted">
            Ilustračné vizualizácie. Kameň na nich je skutočný dekor Orostone: Gothic Gold, Statuario Diamante a Calacatta Top.
          </p>
        </Container>
      </Section>

      {/* ─── NEVIDITEĽNÁ VARNÁ DOSKA — SEO SEKCIA ─── */}
      <Section tone="chalk">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-[clamp(48px,6vw,104px)]">
          <div className="grid justify-items-start gap-6">
            <Eyebrow>Inovatívne riešenie</Eyebrow>
            <h2 className="text-os-h2">Neviditeľná varná doska</h2>
            <p className="max-w-[54ch] font-light text-brand-muted">
              Indukčná technológia zabudovaná priamo pod sinterovanú dosku vytvára plne hladký, súvislý povrch bez viditeľných
              varných zón. Kuchynský ostrovček sa premení na elegantnú pracovnú plochu, kde varíte priamo na kameni.
            </p>
            <ul className="grid w-full max-w-[520px] border-t border-brand-line">
              {HOB_POINTS.map((item) => (
                <li key={item} className="border-b border-brand-line py-3 font-light">
                  {item}
                </li>
              ))}
            </ul>
            <p className="max-w-[54ch] border-l-2 border-brand-dark bg-brand-sand px-4 py-3 text-[0.92rem] font-normal">
              <strong className="font-semibold">Dôležité:</strong> Neviditeľná varná doska funguje výhradne s platňami hrúbky
              12 mm. Platne s hrúbkou 20 mm sú príliš hrubé na prenos elektromagnetického poľa.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <ActionButton variant="dark" to="/kontakt" arrow>
                Konzultácia zdarma
              </ActionButton>
              <TextLink to="/blog/neviditelna-varna-doska-v-sinterovanom-kamene">Kompletný sprievodca</TextLink>
            </div>
          </div>
          <HobSectionDrawing />
        </Container>
      </Section>

      {/* ─── POROVNANIE MATERIÁLOV ─── */}
      <Section tone="sand">
        <Container>
          <SectionHeader
            eyebrow="Porovnanie"
            title="Sinterovaný kameň vs. ostatné materiály"
            lead="Objektívne porovnanie kľúčových vlastností pre informované rozhodnutie."
          />
          <div className={`${below} -mx-[var(--os-edge)] overflow-x-auto px-[var(--os-edge)] sm:mx-0 sm:px-0`}>
            <table className="w-full min-w-[640px] border-collapse text-[0.95rem]">
              <thead>
                <tr className="border-b border-brand-dark">
                  <th className={th}>Vlastnosť</th>
                  {COMPARISON_KEYS.map((key, i) => (
                    <th key={key} className={`${th} ${i === 0 ? 'bg-brand-light px-4 text-brand-dark' : 'pl-4'}`}>
                      {VYHODY_COMPARISON_COLUMNS[key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row) => (
                  <tr key={row.property} className="border-b border-brand-line">
                    <td className={`${td} font-medium`}>{row.property}</td>
                    {COMPARISON_KEYS.map((key, i) => (
                      <td key={key} className={`${td} ${i === 0 ? 'bg-brand-light px-4 font-semibold' : 'pl-4 font-light text-brand-muted'}`}>
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kedy zvoliť ktorý materiál */}
          <h3 className={`${below} text-os-h3`}>Kedy zvoliť ktorý materiál</h3>
          <div className="mt-6 grid gap-x-[clamp(24px,3vw,48px)] gap-y-8 md:grid-cols-2">
            {VYHODY_VERDICTS.map((v) => (
              <div key={v.material} className="grid content-start gap-2 border-t border-brand-line pt-5">
                <h4 className="font-semibold">{v.material}</h4>
                <p className="max-w-[60ch] font-light text-brand-muted">{v.verdict}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {VYHODY_RELATED_LINKS.map((l) => (
              <TextLink key={l.href} to={l.href}>
                {l.label}
              </TextLink>
            ))}
          </div>
        </Container>
      </Section>

      {/* ─── BLOG REFERENCES ─── */}
      <Section tone="chalk">
        <Container>
          <SectionHeader eyebrow="Čítajte na blogu" title="Dozviete sa viac" />
          <ul className={`${below} grid gap-5 md:grid-cols-2`}>
            {BLOG_CARDS.map((c) => (
              <li key={c.to}>
                <Link to={c.to} className="group grid gap-4 no-underline">
                  <span className="block overflow-hidden rounded-[3px]">
                    <img
                      src={c.image}
                      alt={c.alt}
                      width={1376}
                      height={768}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </span>
                  <h3 className="text-[1.2rem] font-semibold leading-snug">{c.title}</h3>
                  <p className="font-light text-brand-muted">{c.text}</p>
                  <span className="inline-flex items-center gap-2 text-[0.92rem] font-medium">
                    Čítať článok
                    <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ─── FAQ ─── */}
      <Section tone="sand">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-[clamp(48px,6vw,104px)]">
          <SectionHeader eyebrow="Časté otázky" title="Odpovede na vaše otázky" />
          <FaqList items={FAQ_ITEMS} asHeadings />
        </Container>
      </Section>

      {/* ─── CTA ─── */}
      <Section tone="chalk">
        <Container className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <SectionHeader
            eyebrow="Začnite svoj projekt"
            title="Poradíme vám s výberom materiálu"
            lead="Objednajte si bezplatnú vzorku alebo nás kontaktujte pre cenovú ponuku na mieru."
          />
          <div className="grid gap-5 lg:justify-items-end">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:justify-end">
              <ActionButton variant="dark" to="/vzorky" arrow>
                Objednať vzorku
              </ActionButton>
              <TextLink to="/kontakt">Kontaktovať nás</TextLink>
              <TextLink to="/kategoria/sintered-stone">Katalóg dekórov</TextLink>
            </div>
            <p className="flex flex-wrap gap-x-6 gap-y-1 text-[0.92rem] font-normal text-brand-muted">
              <a href="tel:+421917588738" className="tabular-nums hover:text-brand-dark">
                +421 917 588 738
              </a>
              <a href="mailto:info@orostone.sk" className="hover:text-brand-dark">
                info@orostone.sk
              </a>
            </p>
          </div>
        </Container>
      </Section>

      <GoldBand od="vyhody" />
    </div>
  );
};
