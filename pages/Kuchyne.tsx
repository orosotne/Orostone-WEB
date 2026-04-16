import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Ruler, Palette, Shield, Phone, ChevronDown } from 'lucide-react';
import { SEOHead } from '@/components/UI/SEOHead';

const GALLERY_ITEMS = [
  {
    image: '/images/inspiration/inspiration-1.webp',
    title: 'Bianco Statuario',
    description: 'Mramorová zástena + pracovná doska',
    product: '/produkt/statuario-diamante',
  },
  {
    image: '/images/inspiration/inspiration-2.webp',
    title: 'Calacatta White',
    description: 'Pracovná doska + zástena',
    product: '/produkt/calacatta-top',
  },
  {
    image: '/images/inspiration/inspiration-3.webp',
    title: 'Roman Travertine',
    description: 'Ostrovček s varičom',
    product: '/produkt/roman-travertine',
  },
  {
    image: '/images/inspiration/inspiration-4.webp',
    title: 'Bianco Statuario',
    description: 'Ostrovček a zástena',
    product: '/produkt/statuario-diamante',
  },
  {
    image: '/images/inspiration/inspiration-5.webp',
    title: 'Arden Gold',
    description: 'Waterfall ostrovček',
    product: '/kategoria/sintered-stone',
  },
  {
    image: '/images/inspiration/inspiration-6.webp',
    title: 'Yabo White',
    description: 'Kuchynská zástena',
    product: '/produkt/yabo-white',
  },
  {
    image: '/images/inspiration/inspiration-7.webp',
    title: 'Roman Travertine',
    description: 'Travertínový ostrov',
    product: '/produkt/roman-travertine',
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

const PROCESS_STEPS = [
  {
    title: 'Výber dekóru',
    description: 'Objednajte si vzorky zadarmo a vyberte dekór, ktorý ladí s vašou kuchyňou.',
  },
  {
    title: 'Zameranie',
    description: 'Náš technik príde k vám domov a presne zameria rozmery kuchyne.',
  },
  {
    title: 'CNC výroba',
    description: 'Platne sa režú na CNC stroji presne na mieru — vrátane výrezov pre drez a varič.',
  },
  {
    title: 'Inštalácia',
    description: 'Profesionálna montáž do 2-3 hodín. Kuchyňu môžete používať ihneď.',
  },
];

const KITCHEN_FAQS = [
  {
    q: 'Koľko stojí kuchynská doska zo sinterovaného kameňa?',
    a: 'Cena závisí od dekóru, rozmerov a počtu výrezov. Orientačne od 180 €/m² vrátane DPH. Objednajte si nezáväznú cenovú ponuku.',
  },
  {
    q: 'Ako dlho trvá výroba a montáž?',
    a: 'Od zamerania po inštaláciu zvyčajne 2-3 týždne. Samotná montáž trvá 2-3 hodiny.',
  },
  {
    q: 'Znečistí sa sinterovaný kameň od jedla alebo vína?',
    a: 'Nie. Sinterovaný kameň má prakticky nulovú nasiakavosť (< 0,1 %), takže škvrny od vína, kávy ani oleja neprenikajú do povrchu. Stačí utrieť vlhkou utierkou.',
  },
  {
    q: 'Môžem položiť horúci hrniec priamo na dosku?',
    a: 'Áno. Sinterovaný kameň odoláva teplotám nad 1 200 °C a nenechá stopy od horúcich hrncov ani panvíc.',
  },
  {
    q: 'Aká hrúbka platne je lepšia — 12 mm alebo 20 mm?',
    a: 'Pre kuchynské dosky odporúčame 20 mm — pôsobí masívnejšie a umožňuje profilované hrany. 12 mm je vhodná pre obklady a zásteny.',
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
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ],
};

export const Kuchyne = () => {
  return (
    <div className="bg-white">
      <SEOHead
        title="Kuchyne zo sinterovaného kameňa | Orostone"
        description="Prémiové kuchynské dosky zo sinterovaného kameňa — odolné voči teplu, škvrnám a škrabancom. Pozrite si realizácie a objednajte vzorky zadarmo."
        canonical="https://orostone.sk/kuchyne"
        keywords={['kuchyne sinterovaný kameň', 'kuchynská doska', 'pracovná doska kuchyňa', 'sinterovaný kameň kuchyňa', 'prémiová kuchyňa']}
        structuredData={structuredData}
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

      {/* Process */}
      <section className="py-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
              Ako to funguje
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark">
              Od výberu po inštaláciu
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-12 h-12 bg-brand-gold text-brand-dark rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {i + 1}
                </div>
                <h3 className="font-bold text-brand-dark mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 font-light">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20">
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

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark text-center mb-12">
            Často kladené otázky
          </h2>
          <div className="space-y-4">
            {KITCHEN_FAQS.map((faq) => (
              <details key={faq.q} className="group bg-[#F9F9F7] rounded-2xl">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-brand-dark">
                  {faq.q}
                  <ChevronDown size={20} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-500 font-light text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
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
