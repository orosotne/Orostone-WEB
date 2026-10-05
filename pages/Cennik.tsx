import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/UI/SEOHead';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { calculateSlabPrice } from '@/lib/slab';
import {
  ActionButton,
  Container,
  Eyebrow,
  FaqList,
  GoldBand,
  PageHero,
  Section,
  SectionHeader,
  TextLink,
} from '@/components/Design';
import { HOME_DECORS, decorImage } from '@/components/Home/homeData';
import {
  PRICING_LAST_UPDATED,
  INSTALLATION_RATE_PER_M2,
  INSTALLATION_INCLUDES,
  BUNDLE_OPTIONS,
  BULK_DISCOUNT,
  SLAB_PRICE_MIN,
  SLAB_TOTAL_MIN,
  formatEur,
  formatEurWhole,
} from '@/data/pricing';
import {
  CENNIK_COMPARISON,
  CENNIK_DESCRIPTION,
  CENNIK_DIRECT_ANSWER,
  CENNIK_FAQS,
  CENNIK_H1,
  CENNIK_PRICE_FACTORS,
  CENNIK_RELATED_LINKS,
  CENNIK_SCENARIOS,
  CENNIK_TITLE,
  scenarioSlabsText,
} from '@/data/pillars/cennik';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'OROSTONE', item: 'https://orostone.sk/' },
        { '@type': 'ListItem', position: 2, name: 'Cenník', item: 'https://orostone.sk/cennik' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: CENNIK_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ],
};

/** The four numbers the page answers, set large: same constants as the direct answer above them. */
const PRICE_FACTS = [
  { value: `od ${formatEur(SLAB_PRICE_MIN)}`, label: 'za m² materiálu s DPH' },
  { value: `od ${formatEurWhole(SLAB_TOTAL_MIN)}`, label: 'celá platňa 3200 × 1600 mm' },
  { value: `−${BULK_DISCOUNT.discountPercent} %`, label: `pri ${BULK_DISCOUNT.quantity} a viac platniach` },
  { value: `≈ ${INSTALLATION_RATE_PER_M2} €/m²`, label: 'výroba a montáž u partnerského kamenára' },
];

// Swatch and the same decor names as on the homepage (Shopify titles are upper case)
const DECOR_NAMES = new Map(HOME_DECORS.map((d) => [d.slug, d.name]));

const below = 'mt-[clamp(40px,5vw,64px)]';
const tableWrap = '-mx-[var(--os-edge)] overflow-x-auto px-[var(--os-edge)] sm:mx-0 sm:px-0';
const th = 'py-4 pr-4 text-left text-[0.82rem] font-semibold text-brand-muted';
const td = 'py-4 pr-4 align-top';

export const Cennik = () => {
  const { products } = useShopifyProducts(50);
  const slabs = products
    .filter((p) => p.category === 'sintered-stone')
    .sort((a, b) => a.pricePerM2 - b.pricePerM2);

  return (
    <div>
      <SEOHead
        title={CENNIK_TITLE}
        description={CENNIK_DESCRIPTION}
        canonical="https://orostone.sk/cennik"
        keywords={['kamenná pracovná doska cena', 'cena kamennej pracovnej dosky', 'sinterovaný kameň cena', 'cena za m2', 'cena za bežný meter']}
        structuredData={structuredData}
      />

      <PageHero
        eyebrow="Cenník sinterovaného kameňa"
        title={CENNIK_H1}
        media={
          <div className="grid max-w-[62ch] gap-4 lg:pt-10">
            <p className="text-os-lead font-light text-brand-muted">{CENNIK_DIRECT_ANSWER}</p>
            <p className="text-[0.82rem] font-normal text-brand-muted">
              Aktualizované: <time dateTime={PRICING_LAST_UPDATED}>{PRICING_LAST_UPDATED}</time> · ceny sa synchronizujú s
              e-shopom
            </p>
          </div>
        }
      >
        <dl className={`${below} grid gap-x-[clamp(24px,3vw,48px)] gap-y-8 sm:grid-cols-2 lg:grid-cols-4`}>
          {PRICE_FACTS.map((f) => (
            <div key={f.label} className="grid content-start gap-2 border-t border-brand-dark pt-5">
              <dt className="order-2 text-[0.92rem] font-normal text-brand-muted">{f.label}</dt>
              <dd className="order-1 m-0 whitespace-nowrap text-[clamp(1.6rem,2.4vw,2.2rem)] font-semibold leading-none tracking-[-0.02em] tabular-nums">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <Section tone="sand">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-[clamp(48px,6vw,104px)]">
          <SectionHeader
            eyebrow="Materiál"
            title="Ceny dekorov"
            lead="Všetky platne majú formát 3200 × 1600 mm a hrúbku 12 mm. Ceny sú vrátane DPH."
          />
          <div className={tableWrap}>
            <table className="w-full border-collapse text-[0.92rem] sm:text-[0.98rem]">
              <thead>
                <tr className="border-b border-brand-dark">
                  <th className={th}>Dekor</th>
                  <th className={`${th} bg-brand-light px-2 text-right text-brand-dark sm:px-4`}>Cena €/m² s DPH</th>
                  <th className={`${th} pl-2 text-right sm:pl-4`}>Cena za platňu</th>
                </tr>
              </thead>
              <tbody>
                {slabs.map((p) => (
                  <tr key={p.id} className="border-b border-brand-line">
                    <td className={td}>
                      <Link to={`/produkt/${p.id}`} className="group inline-flex items-center gap-3 font-medium no-underline sm:gap-4">
                        {DECOR_NAMES.has(p.id) && (
                          <img
                            src={decorImage(p.id)}
                            alt=""
                            width={520}
                            height={931}
                            loading="lazy"
                            decoding="async"
                            className="hidden h-12 w-6 flex-none rounded-[1px] object-cover shadow-[0_0_0_1px_rgba(26,26,26,0.08)] min-[380px]:block"
                          />
                        )}
                        <span className="group-hover:underline">{DECOR_NAMES.get(p.id) ?? p.name}</span>
                      </Link>
                    </td>
                    <td className={`${td} whitespace-nowrap bg-brand-light px-2 text-right align-middle font-semibold tabular-nums sm:px-4`}>
                      {formatEur(p.pricePerM2)}
                    </td>
                    <td className={`${td} whitespace-nowrap pl-2 text-right align-middle font-light tabular-nums text-brand-muted sm:pl-4`}>
                      ≈ {formatEurWhole(calculateSlabPrice(p.pricePerM2, p.dimensions))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section tone="chalk">
        <Container>
          <SectionHeader eyebrow="Porovnanie" title={CENNIK_COMPARISON.heading} lead={CENNIK_COMPARISON.intro} />
          <div className={`${below} ${tableWrap}`}>
            <table className="w-full min-w-[640px] border-collapse text-[0.95rem]">
              <thead>
                <tr className="border-b border-brand-dark">
                  {CENNIK_COMPARISON.columnLabels.map((label, i) => (
                    <th key={label} className={`${th} ${i === 1 ? 'bg-brand-sand px-4 text-brand-dark' : i > 1 ? 'pl-4' : ''}`}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CENNIK_COMPARISON.rows.map(([property, ...values]) => (
                  <tr key={property} className="border-b border-brand-line">
                    <td className={`${td} font-medium`}>{property}</td>
                    {values.map((value, i) => (
                      <td
                        key={i}
                        className={`${td} ${i === 0 ? 'bg-brand-sand px-4 font-medium' : 'pl-4 font-light text-brand-muted'}`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {CENNIK_RELATED_LINKS.map((link) => (
              <TextLink key={link.href} to={link.href}>
                {link.label}
              </TextLink>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-[clamp(48px,6vw,104px)]">
          <div className="grid justify-items-start gap-6">
            <SectionHeader eyebrow="Výroba a montáž" title="Výroba a montáž u partnerského kamenára" />
            <p className="max-w-[54ch] font-light text-brand-muted">
              Orostone predáva materiál — celé platne. Zameranie, výrobu a montáž robí partnerský kamenár so skúsenosťou so
              sinterovaným kameňom, orientačne za {INSTALLATION_RATE_PER_M2} €/m² s DPH. Tieto práce fakturuje kamenár, nie sú
              súčasťou ceny materiálu.
            </p>
            <ul className="grid w-full max-w-[460px] border-t border-brand-line">
              {INSTALLATION_INCLUDES.map((item) => (
                <li key={item} className="border-b border-brand-line py-3 first-letter:uppercase">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-10 rounded-[3px] bg-brand-light p-[clamp(28px,3vw,44px)]">
            <div className="grid gap-4">
              <h3 className="text-os-h3">Zľavy pri viacerých platniach</h3>
              <ul className="border-t border-brand-line">
                {BUNDLE_OPTIONS.map((b) => (
                  <li key={b.quantity} className="flex items-center justify-between gap-4 border-b border-brand-line py-3">
                    <span className="font-light">
                      {b.quantity} {b.quantity === 1 ? 'platňa' : b.quantity < 5 ? 'platne' : 'platní'}
                    </span>
                    <span className="font-semibold">
                      {b.discountPercent > 0 ? `−${b.discountPercent} % z ceny platní` : 'štandardná cena'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4">
              <h3 className="text-os-h3">Koľko materiálu potrebuje kuchyňa</h3>
              <p className="font-light text-brand-muted">Orientačná cena materiálu s DPH, od najlacnejšieho po najdrahší dekor:</p>
              <ul className="border-t border-brand-line">
                {CENNIK_SCENARIOS.map((s) => (
                  <li key={s.label} className="flex items-start justify-between gap-4 border-b border-brand-line py-3">
                    <span className="font-light">
                      {s.label}
                      <span className="block text-[0.82rem] font-normal text-brand-muted">{scenarioSlabsText(s)}</span>
                    </span>
                    <span className="whitespace-nowrap font-semibold tabular-nums">
                      {formatEurWhole(s.min)} – {formatEurWhole(s.max)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-[0.88rem] font-normal text-brand-muted">Presný počet platní určíme z pôdorysu.</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="chalk">
        <Container>
          <SectionHeader
            eyebrow="Prehľadná kalkulácia"
            title="Čo ovplyvňuje finálnu cenu"
            lead="Najdrahší kompromis pri pracovnej doske býva často ten, ktorý na začiatku vyzeral ako úspora. Preto v ponuke rozpisujeme každú položku zvlášť."
          />
          <ul className={`${below} grid gap-x-[clamp(24px,3vw,48px)] sm:grid-cols-2 lg:grid-cols-3`}>
            {CENNIK_PRICE_FACTORS.map((f) => (
              <li key={f} className="border-t border-brand-line py-5 font-light">
                {f}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="sand">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-[clamp(48px,6vw,104px)]">
          <SectionHeader eyebrow="Otázky" title="Často kladené otázky o cenách" />
          <div className="grid gap-8">
            <FaqList items={CENNIK_FAQS} />
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <TextLink to="/podmienky-rezervacie-ceny">Podmienky rezervácie ceny (99 €)</TextLink>
              <TextLink to="/blog/technicky-kamen-cena-pracovna-doska">Sprievodca cenami technického kameňa</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="chalk">
        <Container className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="grid gap-4">
            <Eyebrow>Presná ponuka</Eyebrow>
            <h2 className="text-os-h2 [text-wrap:balance]">Pošlite pôdorys, pripravíme presnú ponuku</h2>
            <p className="max-w-[54ch] text-os-lead font-light text-brand-muted">
              Alebo si najprv objednajte vzorku dekoru zadarmo a potvrďte si výber pri dennom svetle.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:justify-end">
            <ActionButton variant="dark" to="/kontakt" arrow>
              Poslať pôdorys
            </ActionButton>
            <TextLink to="/vzorky">Objednať vzorku</TextLink>
          </div>
        </Container>
      </Section>

      <GoldBand od="cennik" />
    </div>
  );
};
