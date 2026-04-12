import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Ruler, Palette, Shield, Phone } from 'lucide-react';
import { SEOHead, createBreadcrumbLD } from '@/components/UI/SEOHead';

const GALLERY_ITEMS = [
  {
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800',
    title: 'Moderná biela kuchyňa',
    description: 'Calacatta Top — ostrovček s waterfall hranou',
    product: '/produkt/calacatta-top',
  },
  {
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    title: 'Minimalistický dizajn',
    description: 'Super White Extra — čisté línie, matný povrch',
    product: '/produkt/super-white-extra',
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800',
    title: 'Tmavý kontrast',
    description: 'Nero Margiua — dramatická pracovná doska',
    product: '/produkt/nero-margiua',
  },
  {
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    title: 'Teplé tóny',
    description: 'Taj Mahal — krémovo-zlaté žily na bielom podklade',
    product: '/produkt/taj-mahal',
  },
  {
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    title: 'Kuchynský ostrovček',
    description: 'Wild Forest — veľkoformátová platňa bez spojov',
    product: '/produkt/wild-forest',
  },
  {
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
    title: 'Klasická elegancia',
    description: 'Statuario Diamante — nadčasový mramorový vzor',
    product: '/produkt/statuario-diamante',
  },
];

const FEATURES = [
  {
    icon: Ruler,
    title: 'Na mieru',
    description: 'Každá kuchyňa je unikátna. Platne režeme CNC na presné rozmery vašej kuchyne — vrátane výrezov pre drez, varič a batériu.',
  },
  {
    icon: Palette,
    title: '12 dekórov',
    description: 'Od klasického bieleho mramoru po dramatickú čiernu — nájdite dekór, ktorý ladí s vašou kuchyňou.',
  },
  {
    icon: Shield,
    title: 'Bez údržby',
    description: 'Nepotrebuje impregnáciu ani špeciálne čistenie. Stačí vlhká utierka — každý deň, celé roky.',
  },
];

const breadcrumbLD = createBreadcrumbLD([
  { name: 'Domov', url: 'https://orostone.sk/' },
  { name: 'Kuchyne', url: 'https://orostone.sk/kuchyne' },
]);

export const Kuchyne = () => {
  return (
    <div className="bg-white">
      <SEOHead
        title="Kuchyne zo sinterovaného kameňa | Orostone"
        description="Prémiové kuchynské dosky zo sinterovaného kameňa — odolné voči teplu, škvrnám a škrabancom. Pozrite si realizácie a objednajte vzorky zadarmo."
        canonical="https://orostone.sk/kuchyne"
        keywords={['kuchyne sinterovaný kameň', 'kuchynská doska', 'pracovná doska kuchyňa', 'sinterovaný kameň kuchyňa', 'prémiová kuchyňa']}
        structuredData={breadcrumbLD}
      />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6 text-center">
          <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
            Kuchyne
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-brand-dark mb-6">
            Kuchyne zo sinterovaného kameňa
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto mb-10">
            Pracovné dosky, ostrovčeky a obklady, ktoré vydržia desaťročia bez údržby. Odolné voči teplu, škvrnám, škrabancom a UV žiareniu.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/vzorky"
              className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-8 py-4 rounded-full font-semibold hover:bg-brand-dark hover:text-white transition-all"
            >
              Objednať vzorky zadarmo
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/kategoria/sintered-stone"
              className="inline-flex items-center gap-2 border-2 border-brand-dark text-brand-dark px-8 py-4 rounded-full font-semibold hover:bg-brand-dark hover:text-white transition-all"
            >
              Pozrieť katalóg
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center p-8 bg-[#F9F9F7] rounded-3xl">
                <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <f.icon size={28} className="text-brand-gold" />
                </div>
                <h3 className="font-bold text-brand-dark text-lg mb-3">{f.title}</h3>
                <p className="text-gray-500 font-light text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
              Inšpirácie
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark mb-4">
              Kuchyne našich klientov
            </h2>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Pozrite sa, ako sinterovaný kameň Orostone vyzerá v reálnych kuchyniach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {GALLERY_ITEMS.map((item) => (
              <Link
                key={item.title}
                to={item.product}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                  <p className="text-white/80 text-sm font-light">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
            Plánujete novú kuchyňu?
          </h2>
          <p className="text-gray-500 text-lg font-light mb-10">
            Pošleme vám vzorky materiálov zadarmo, poradíme s výberom dekóru a pripravíme nezáväznú cenovú ponuku na mieru.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/vzorky"
              className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-8 py-4 rounded-full font-semibold hover:bg-brand-dark hover:text-white transition-all"
            >
              Objednať vzorky zadarmo
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 text-brand-dark font-semibold hover:text-brand-gold transition-colors"
            >
              <Phone size={18} />
              Kontaktovať nás
            </Link>
          </div>
        </div>
      </section>

      {/* Related Blog Posts */}
      <section className="py-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4">Užitočné články</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link to="/blog/kuchynsky-ostrovcek-zo-sinterovaneho-kamena" className="p-6 bg-white rounded-2xl hover:shadow-lg transition-shadow group">
              <h3 className="font-bold text-brand-dark group-hover:text-brand-gold transition-colors mb-2">Kuchynský ostrovček</h3>
              <p className="text-sm text-gray-500 font-light">Kompletný sprievodca rozmermi, hrúbkou a waterfall hranami.</p>
            </Link>
            <Link to="/blog/neviditelna-varna-doska-v-sinterovanom-kamene" className="p-6 bg-white rounded-2xl hover:shadow-lg transition-shadow group">
              <h3 className="font-bold text-brand-dark group-hover:text-brand-gold transition-colors mb-2">Neviditeľná varná doska</h3>
              <p className="text-sm text-gray-500 font-light">Ako funguje indukcia integrovaná pod sinterovaný kameň.</p>
            </Link>
            <Link to="/blog/12mm-vs-20mm-hrubka" className="p-6 bg-white rounded-2xl hover:shadow-lg transition-shadow group">
              <h3 className="font-bold text-brand-dark group-hover:text-brand-gold transition-colors mb-2">12 mm vs 20 mm</h3>
              <p className="text-sm text-gray-500 font-light">Aká hrúbka platne je správna pre váš projekt.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
