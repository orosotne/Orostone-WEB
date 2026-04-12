import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MapPin, Clock, Award, Palette } from 'lucide-react';
import { SEOHead, createBreadcrumbLD } from '@/components/UI/SEOHead';

const PROJECTS = [
  {
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
    title: 'Rodinný dom, Bratislava — Koliba',
    material: 'Calacatta Top, 20 mm',
    scope: 'Kuchynská doska + ostrovček s waterfall hranou',
    area: '4,8 m²',
  },
  {
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    title: 'Byt, Bratislava — Stein 2',
    material: 'Super White Extra, 12 mm',
    scope: 'Pracovná doska v tvare L + neviditeľná varná doska',
    area: '3,2 m²',
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800',
    title: 'Penthouse, Bratislava — River Park',
    material: 'Nero Margiua, 20 mm',
    scope: 'Ostrovček + barový pult + kúpeľňová doska',
    area: '7,1 m²',
  },
  {
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    title: 'Rodinný dom, Senec',
    material: 'Taj Mahal, 20 mm',
    scope: 'Kuchynská doska + obklad steny za linkou',
    area: '5,4 m²',
  },
  {
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    title: 'Showroom, Bratislava — Landererova',
    material: 'Wild Forest, 12 mm + 20 mm',
    scope: 'Prezentačný ostrovček + vzorkový stôl',
    area: '3,8 m²',
  },
  {
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
    title: 'Vila, Bratislava — Slavín',
    material: 'Statuario Diamante, 20 mm',
    scope: 'Kuchyňa + kúpeľňa + vonkajší bar pri bazéne',
    area: '12,3 m²',
  },
];

const STATS = [
  { value: '150+', label: 'Realizácií' },
  { value: '12', label: 'Dekórov' },
  { value: '10–15', label: 'Pracovných dní' },
  { value: '24', label: 'Mesiacov záruka' },
];

const breadcrumbLD = createBreadcrumbLD([
  { name: 'Domov', url: 'https://orostone.sk/' },
  { name: 'Realizácie', url: 'https://orostone.sk/realizacie' },
]);

export const Realizacie = () => {
  return (
    <div className="bg-white">
      <SEOHead
        title="Realizácie | Kuchyne a interiéry zo sinterovaného kameňa | Orostone"
        description="Pozrite si naše realizácie kuchýň, ostrovčekov a kúpeľní zo sinterovaného kameňa. Reálne projekty z Bratislavy a okolia s fotkami a špecifikáciami."
        canonical="https://orostone.sk/realizacie"
        keywords={['realizácie sinterovaný kameň', 'kuchyne Bratislava', 'kuchynská doska realizácie', 'sinterovaný kameň portfólio']}
        structuredData={breadcrumbLD}
      />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6 text-center">
          <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
            Portfólio
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-brand-dark mb-6">
            Naše realizácie
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
            Každý projekt je unikátny — od kompaktných bytov po rozľahlé vily. Pozrite sa, ako sinterovaný kameň Orostone mení reálne priestory.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-bold text-brand-gold">{s.value}</div>
                <div className="text-sm text-gray-500 font-light mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {PROJECTS.map((project) => (
              <div key={project.title} className="bg-[#F9F9F7] rounded-3xl overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={800}
                    height={500}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-brand-dark text-lg mb-3">{project.title}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Palette size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 font-light">{project.material}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 font-light">{project.scope}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 font-light">{project.area}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
            Ako to funguje
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12">
            Od konzultácie po hotovú kuchyňu
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4 text-brand-dark font-bold">1</div>
              <h3 className="font-bold text-brand-dark mb-2">Konzultácia</h3>
              <p className="text-sm text-gray-500 font-light">Pomôžeme s výberom dekóru a hrúbky. Pošleme vzorky zadarmo.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4 text-brand-dark font-bold">2</div>
              <h3 className="font-bold text-brand-dark mb-2">Zameranie a výroba</h3>
              <p className="text-sm text-gray-500 font-light">Technik zameria priestor. CNC výroba na presné rozmery.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4 text-brand-dark font-bold">3</div>
              <h3 className="font-bold text-brand-dark mb-2">Montáž</h3>
              <p className="text-sm text-gray-500 font-light">Profesionálna inštalácia do 15 pracovných dní od objednávky.</p>
            </div>
          </div>
          <Link
            to="/blog/od-merania-po-instalaciu-proces-orostone"
            className="inline-flex items-center gap-2 text-brand-gold font-semibold hover:text-brand-dark transition-colors mt-10"
          >
            Podrobný popis procesu
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
            Chcete podobný výsledok?
          </h2>
          <p className="text-gray-500 text-lg font-light mb-10">
            Kontaktujte nás pre nezáväznú konzultáciu. Poradíme s materiálom, pripravíme cenovú ponuku a zrealizujeme projekt od A po Z.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-8 py-4 rounded-full font-semibold hover:bg-brand-dark hover:text-white transition-all"
            >
              Nezáväzná konzultácia
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/vzorky"
              className="inline-flex items-center gap-2 border-2 border-brand-dark text-brand-dark px-8 py-4 rounded-full font-semibold hover:bg-brand-dark hover:text-white transition-all"
            >
              Objednať vzorky zadarmo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
