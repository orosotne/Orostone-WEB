import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { SEOHead } from '@/components/UI/SEOHead';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { calculateSlabPrice } from '@/lib/slab';
import {
  PRICING_LAST_UPDATED,
  INSTALLATION_RATE_PER_M2,
  INSTALLATION_INCLUDES,
  BUNDLE_OPTIONS,
  COUNTERTOP_PER_BM,
  formatEur,
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

export const Cennik = () => {
  const { products } = useShopifyProducts(50);
  const slabs = products
    .filter((p) => p.category === 'sintered-stone')
    .sort((a, b) => a.pricePerM2 - b.pricePerM2);

  return (
    <div className="bg-white">
      <SEOHead
        title={CENNIK_TITLE}
        description={CENNIK_DESCRIPTION}
        canonical="https://orostone.sk/cennik"
        keywords={['kamenná pracovná doska cena', 'cena kamennej pracovnej dosky', 'sinterovaný kameň cena', 'cena za m2', 'cena za bežný meter']}
        structuredData={structuredData}
      />

      {/* Hero + direct answer */}
      <section className="pt-32 pb-16 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
              Cenník sinterovaného kameňa
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-brand-dark mb-6">
              {CENNIK_H1}
            </h1>
            <p className="text-gray-600 text-lg font-light leading-relaxed mb-4">{CENNIK_DIRECT_ANSWER}</p>
            <p className="text-sm text-gray-400">
              Aktualizované: <time dateTime={PRICING_LAST_UPDATED}>{PRICING_LAST_UPDATED}</time> · ceny sa
              synchronizujú s e-shopom
            </p>
          </div>
        </div>
      </section>

      {/* Tabuľka dekorov */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
              Materiál
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Ceny dekorov</h2>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Všetky platne majú formát 3200 × 1600 mm a hrúbku 12 mm. Ceny sú vrátane DPH.
            </p>
          </div>

          <div className="overflow-x-auto -mx-6 px-6 max-w-4xl lg:mx-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b-2 border-brand-dark">
                  <th className="text-left py-4 pr-4 font-bold text-brand-dark">Dekor</th>
                  <th className="text-right py-4 px-3 font-bold text-brand-gold bg-brand-gold/5">Cena €/m² s DPH</th>
                  <th className="text-right py-4 px-3 font-semibold text-gray-600">Cena za platňu</th>
                </tr>
              </thead>
              <tbody>
                {slabs.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 pr-4 font-medium text-brand-dark">
                      <Link to={`/produkt/${p.id}`} className="hover:text-brand-gold transition-colors">
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-4 px-3 text-right font-medium text-brand-dark bg-brand-gold/5">
                      {formatEur(p.pricePerM2)}
                    </td>
                    <td className="py-4 px-3 text-right text-gray-600 font-light">
                      ≈ {formatEur(calculateSlabPrice(p.pricePerM2, p.dimensions))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Porovnanie materiálov */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
                Porovnanie
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">{CENNIK_COMPARISON.heading}</h2>
              <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">{CENNIK_COMPARISON.intro}</p>
            </div>

            <div className="overflow-x-auto -mx-6 px-6 max-w-4xl lg:mx-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b-2 border-brand-dark">
                    {CENNIK_COMPARISON.columnLabels.map((label, i) => (
                      <th
                        key={label}
                        className={
                          i === 0
                            ? 'text-left py-4 pr-4 font-bold text-brand-dark'
                            : i === 1
                              ? 'text-left py-4 px-3 font-bold text-brand-gold bg-brand-gold/5'
                              : 'text-left py-4 px-3 font-semibold text-gray-600'
                        }
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CENNIK_COMPARISON.rows.map(([property, ...values]) => (
                    <tr key={property} className="border-b border-gray-100">
                      <td className="py-4 pr-4 font-medium text-brand-dark">{property}</td>
                      {values.map((value, i) => (
                        <td
                          key={i}
                          className={
                            i === 0
                              ? 'py-4 px-3 font-medium text-brand-dark bg-brand-gold/5'
                              : 'py-4 px-3 text-gray-600 font-light'
                          }
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-center mt-8 text-sm text-gray-500">
              {CENNIK_RELATED_LINKS.map((link, i) => (
                <React.Fragment key={link.href}>
                  {i > 0 && ' · '}
                  <Link to={link.href} className="text-brand-gold hover:text-brand-dark transition-colors">
                    {link.label}
                  </Link>
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* Realizácia */}
      <section className="py-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
                Realizácia
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-bold mb-6">
                Kompletná realizácia {INSTALLATION_RATE_PER_M2} €/m²
              </h2>
              <p className="text-gray-600 font-light leading-relaxed mb-6">
                Jedna orientačná sadzba s DPH, v ktorej je zahrnuté všetko od zamerania po montáž. Výrobu a
                montáž realizujú partnerskí kamenári so skúsenosťou so sinterovaným kameňom.
              </p>
              <ul className="space-y-3">
                {INSTALLATION_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check size={18} className="text-brand-gold mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-light capitalize">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 bg-white rounded-3xl">
              <h3 className="font-bold text-brand-dark text-lg mb-4">Zľavy pri viacerých platniach</h3>
              <ul className="space-y-3 mb-8">
                {BUNDLE_OPTIONS.map((b) => (
                  <li key={b.quantity} className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-700 font-light">
                      {b.quantity} {b.quantity === 1 ? 'platňa' : b.quantity < 5 ? 'platne' : 'platní'}
                    </span>
                    <span className="font-semibold text-brand-dark">
                      {b.discountPercent > 0 ? `−${b.discountPercent} % z ceny platní` : 'štandardná cena'}
                    </span>
                  </li>
                ))}
              </ul>
              <h3 className="font-bold text-brand-dark text-lg mb-4">Orientačná cena projektu</h3>
              <p className="text-gray-600 font-light mb-4">
                Hotová pracovná doska vrátane fabrikácie a montáže: {COUNTERTOP_PER_BM.min}–
                {COUNTERTOP_PER_BM.max} €/bm.
              </p>
              <ul className="space-y-3">
                {CENNIK_SCENARIOS.map((s) => (
                  <li key={s.label} className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-700 font-light">{s.label}</span>
                    <span className="font-semibold text-brand-dark whitespace-nowrap">
                      {s.min.toLocaleString('sk-SK')}–{s.max.toLocaleString('sk-SK')} €
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Faktory ceny */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
                Prehľadná kalkulácia
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">Čo ovplyvňuje finálnu cenu</h2>
              <p className="text-gray-500 text-lg font-light">
                Najdrahší kompromis pri pracovnej doske býva často ten, ktorý na začiatku vyzeral ako úspora.
                Preto v ponuke rozpisujeme každú položku zvlášť.
              </p>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CENNIK_PRICE_FACTORS.map((f) => (
                <li key={f} className="flex items-start gap-3 p-5 bg-[#F9F9F7] rounded-2xl">
                  <Check size={18} className="text-brand-gold mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-light">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark text-center mb-12">
            Často kladené otázky o cenách
          </h2>
          <div className="space-y-4">
            {CENNIK_FAQS.map((faq) => (
              <details key={faq.question} className="group bg-white rounded-2xl">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-brand-dark">
                  {faq.question}
                </summary>
                <div className="px-6 pb-6 text-gray-500 font-light text-sm leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-gray-500">
            <Link to="/podmienky-rezervacie-ceny" className="text-brand-gold hover:text-brand-dark transition-colors">
              Podmienky rezervácie ceny (99 €)
            </Link>
            {' · '}
            <Link to="/blog/technicky-kamen-cena-pracovna-doska" className="text-brand-gold hover:text-brand-dark transition-colors">
              Sprievodca cenami technického kameňa
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-sans font-bold mb-6 max-w-2xl mx-auto">
            Pošlite pôdorys, pripravíme presnú ponuku
          </h2>
          <p className="text-gray-400 text-lg font-light max-w-xl mx-auto mb-10">
            Alebo si najprv objednajte vzorku dekoru zadarmo a potvrďte si výber pri dennom svetle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kontakt"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-dark px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-brand-gold transition-colors"
            >
              Poslať pôdorys
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/vzorky"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              Objednať vzorku
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
