import React, { useState } from 'react';
import {
  Flame,
  Droplets,
  Sun,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Phone,
  Mail,
  CookingPot,
  Check,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/UI/SEOHead';

/* =============================================================
   FAQ DATA
   ============================================================= */
const FAQ_ITEMS = [
  {
    question: 'Môžem na sinterovaný kameň položiť horúci hrniec?',
    answer:
      'Áno. Sinterovaný kameň odolá teplotám nad 300 °C bez zmeny farby alebo poškodenia. Na rozdiel od quartzového kompozitu (max ~150 °C) nepotrebujete podložku pod horúci riad.',
  },
  {
    question: 'Ako funguje neviditeľná varná doska v sinterovanom kameni?',
    answer:
      'Indukčný modul sa nainštaluje priamo pod sinterovanú dosku s hrúbkou presne 12 mm. Kameň je nekovový a nepórovitý, takže elektromagnetické pole prechádza bez strát. Dôležité: platne s hrúbkou 20 mm sú príliš hrubé — elektromagnetické pole nimi neprejde dostatočne. Výsledkom je hladký, súvislý povrch bez viditeľných varných zón — varná doska je „neviditeľná".',
  },
  {
    question: 'Je sinterovaný kameň bezúdržbový?',
    answer:
      'Takmer áno. Nasiakavosť pod 0,1 % znamená, že nepotrebuje impregnáciu ani špeciálne čistiace prostriedky. Na denné čistenie stačí vlhká utierka s pH neutrálnym saponátom.',
  },
  {
    question: 'Hodí sa sinterovaný kameň na exteriér?',
    answer:
      'Áno. UV stabilita, mrazuvzdornosť a odolnosť voči chemikáliám robia zo sinterovaného kameňa ideálny materiál na fasády, terasy aj vonkajšie kuchyne.',
  },
  {
    question: 'Aký je rozdiel oproti prírodnej žule alebo mramoru?',
    answer:
      'Sinterovaný kameň má nulovú pórovitosť (žula 0,1–3 %), nepotrebuje impregnáciu, je odolnejší voči škvrnám a kyselinám, a je dostupný vo veľkoformátových doskách až 3 200 × 1 600 mm bez viditeľných spojov.',
  },
];

/* =============================================================
   POROVNÁVACIA TABUĽKA
   ============================================================= */
const COMPARISON_DATA = [
  { property: 'Odolnosť teplu', sintered: '> 300 °C', granite: '~ 200 °C', quartz: '~ 150 °C', marble: '~ 200 °C' },
  { property: 'Nasiakavosť', sintered: '< 0,1 %', granite: '0,1–3 %', quartz: '< 0,1 %', marble: '0,5–2 %' },
  { property: 'Odolnosť škvrnám', sintered: 'Výborná', granite: 'Stredná', quartz: 'Výborná', marble: 'Slabá' },
  { property: 'Impregnácia', sintered: 'Nepotrebuje', granite: 'Pravidelne', quartz: 'Nepotrebuje', marble: 'Pravidelne' },
  { property: 'UV stabilita', sintered: 'Áno', granite: 'Čiastočne', quartz: 'Nie', marble: 'Čiastočne' },
  { property: 'Údržba', sintered: 'Minimálna', granite: 'Stredná', quartz: 'Nízka', marble: 'Náročná' },
  { property: 'Neviditeľná varná doska', sintered: 'Áno', granite: 'Nie', quartz: 'Nie', marble: 'Nie' },
  { property: 'Max. rozmer dosky', sintered: '3 200 × 1 600 mm', granite: '~ 3 000 × 1 500 mm', quartz: '~ 3 050 × 1 440 mm', marble: '~ 2 400 × 1 200 mm' },
];

/* =============================================================
   VÝHODY GRID DATA
   ============================================================= */
const BENEFITS = [
  {
    icon: Flame,
    title: 'Odolnosť voči teplu',
    description: 'Znáša teploty nad 300 °C. Horúci hrniec môžete položiť priamo na povrch bez poškodenia.',
  },
  {
    icon: Droplets,
    title: 'Nulová nasiakavosť',
    description: 'Nasiakavosť pod 0,1 % — odolný voči vlhkosti, plesniam a baktériám. Ideálny do kuchyne aj kúpeľne.',
  },
  {
    icon: Sparkles,
    title: 'Odolnosť voči škvrnám',
    description: 'Víno, káva, citrónovú šťavu — jednoducho utriete. Nepórovitý povrch nenasiakne žiadne tekutiny.',
  },
  {
    icon: Sun,
    title: 'UV stabilita',
    description: 'Farba sa nemení ani pri celoročnom vystavení slnku. Certifikované podľa DIN 51094.',
  },
  {
    icon: ShieldCheck,
    title: 'Bez údržby',
    description: 'Nepotrebuje impregnáciu ani špeciálne ošetrenie. Stačí vlhká utierka a bežný saponát.',
  },
  {
    icon: CookingPot,
    title: 'Neviditeľná varná doska',
    description: 'Indukčný modul sa zabuduje priamo pod dosku. Žiadne viditeľné varné zóny — čistý, súvislý povrch.',
  },
];

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

/* =============================================================
   FAQ ACCORDION
   ============================================================= */
const FAQItem: React.FC<{
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}> = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-gray-200 last:border-b-0">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-6 text-left group"
      aria-expanded={isOpen}
    >
      <h3 className="text-base md:text-lg font-semibold text-brand-dark pr-8 group-hover:text-brand-gold transition-colors">
        {question}
      </h3>
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-brand-gold/10 flex items-center justify-center transition-colors">
        {isOpen ? <ChevronUp size={18} className="text-brand-dark" /> : <ChevronDown size={18} className="text-gray-400" />}
      </span>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
      <p className="text-gray-600 font-light leading-relaxed text-base pr-12">{answer}</p>
    </div>
  </div>
);

/* =============================================================
   HLAVNÝ KOMPONENT
   ============================================================= */
export const Vyhody = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <div className="bg-white">
      <SEOHead
        title="Výhody sinterovaného kameňa | OROSTONE"
        description="Sinterovaný kameň odoláva teplu, škvrnám a poškriabaniu. Pozrite porovnanie s technickým kameňom, žulou a mramorom — rozdiely, ktoré reálne rozhodujú."
        canonical="https://orostone.sk/vyhody"
        keywords={['výhody sinterovaného kameňa', 'neviditeľná varná doska', 'neviditeľná indukčná doska', 'sinterovaný kameň vs žula', 'sinterovaný kameň údržba', 'odolnosť sinterovaného kameňa']}
      />

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />

      {/* ─── HERO ─── */}
      <section className="relative bg-brand-dark text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-dark/80" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
              Prečo sinterovaný kameň
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6 leading-tight">
              Výhody sinterovaného kameňa
            </h1>
            <p className="text-lg md:text-xl font-light text-gray-300 leading-relaxed max-w-2xl">
              Materiál, ktorý odolá horúcim hrncom, nepotrebuje impregnáciu a umožňuje integráciu
              neviditeľnej indukčnej varnej dosky priamo do pracovnej plochy.
            </p>
          </div>
        </div>
      </section>

      {/* ─── VÝHODY GRID ─── */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
              Kľúčové vlastnosti
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6">
              6 dôvodov, prečo si vybrať sinterovaný kameň
            </h2>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Každá vlastnosť je overená nezávislými certifikáciami a laboratórnymi testami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit, i) => (
              <div key={i} className="p-8 bg-[#F9F9F7] rounded-3xl group hover:bg-brand-dark transition-colors duration-300">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 group-hover:bg-brand-gold/20 flex items-center justify-center mb-6 transition-colors">
                  <benefit.icon size={24} className="text-brand-gold" />
                </div>
                <h3 className="text-lg font-bold text-brand-dark group-hover:text-white mb-3 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-300 font-light leading-relaxed transition-colors">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEVIDITEĽNÁ VARNÁ DOSKA — SEO SEKCIA ─── */}
      <section className="py-24 md:py-32 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
                Inovatívne riešenie
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-bold mb-6">
                Neviditeľná varná doska
              </h2>
              <p className="text-gray-600 font-light leading-relaxed mb-6">
                Indukčná technológia zabudovaná priamo pod sinterovanú dosku vytvára plne hladký,
                súvislý povrch bez viditeľných varných zón. Kuchynský ostrovček sa premení na
                elegantnú pracovnú plochu, kde varíte priamo na kameni.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Indukčný modul pod dosku s hrúbkou presne 12 mm',
                  'Žiadne viditeľné ovládacie prvky na povrchu',
                  'Ovládanie cez dotykový panel alebo mobilnú aplikáciu',
                  'Plná integrácia s dizajnom kuchyne',
                  'Jednoduché čistenie — celý povrch je hladký',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={18} className="text-brand-gold mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-light">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8">
                <strong>Dôležité:</strong> Neviditeľná varná doska funguje výhradne s platňami hrúbky 12 mm. Platne s hrúbkou 20 mm sú príliš hrubé na prenos elektromagnetického poľa.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/kontakt"
                  className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-brand-gold hover:text-brand-dark transition-all"
                >
                  Konzultácia zdarma
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/blog/neviditelna-varna-doska-v-sinterovanom-kamene"
                  className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-dark text-sm font-semibold transition-colors"
                >
                  Kompletný sprievodca
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="bg-white p-4 rounded-3xl">
              <img
                src="/images/blog/article-22/hero.webp"
                alt="Neviditeľná indukčná varná doska zabudovaná v sinterovanom kameni"
                width={800}
                height={600}
                className="w-full aspect-[4/3] object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── POROVNANIE MATERIÁLOV ─── */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
              Porovnanie
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6">
              Sinterovaný kameň vs. ostatné materiály
            </h2>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Objektívne porovnanie kľúčových vlastností pre informované rozhodnutie.
            </p>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b-2 border-brand-dark">
                  <th className="text-left py-4 pr-4 font-bold text-brand-dark">Vlastnosť</th>
                  <th className="text-center py-4 px-3 font-bold text-brand-gold bg-brand-gold/5">Sinterovaný kameň</th>
                  <th className="text-center py-4 px-3 font-semibold text-gray-600">Žula</th>
                  <th className="text-center py-4 px-3 font-semibold text-gray-600">Quartz</th>
                  <th className="text-center py-4 px-3 font-semibold text-gray-600">Mramor</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 pr-4 font-medium text-brand-dark">{row.property}</td>
                    <td className="py-4 px-3 text-center font-medium text-brand-dark bg-brand-gold/5">{row.sintered}</td>
                    <td className="py-4 px-3 text-center text-gray-600 font-light">{row.granite}</td>
                    <td className="py-4 px-3 text-center text-gray-600 font-light">{row.quartz}</td>
                    <td className="py-4 px-3 text-center text-gray-600 font-light">{row.marble}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── BLOG REFERENCES ─── */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
              Čítajte na blogu
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold">
              Dozviete sa viac
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/blog/neviditelna-varna-doska-v-sinterovanom-kamene" className="group">
              <div className="bg-[#F9F9F7] rounded-3xl overflow-hidden">
                <img
                  src="/images/blog/article-22/hero-original.webp"
                  alt="Neviditeľná varná doska v sinterovanom kameni"
                  width={600}
                  height={400}
                  className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="font-bold text-brand-dark group-hover:text-brand-gold transition-colors mb-2">
                    Neviditeľná varná doska v sinterovanom kameni
                  </h3>
                  <p className="text-sm text-gray-500 font-light">
                    Kompletný sprievodca — ako funguje, koľko stojí, aký kameň vybrať.
                  </p>
                </div>
              </div>
            </Link>
            <Link to="/blog/kuchynsky-ostrovcek-zo-sinterovaneho-kamena" className="group">
              <div className="bg-[#F9F9F7] rounded-3xl overflow-hidden">
                <img
                  src="/images/blog/article-23/hero.webp"
                  alt="Kuchynský ostrovček zo sinterovaného kameňa"
                  width={600}
                  height={400}
                  className="w-full aspect-[3/2] object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="font-bold text-brand-dark group-hover:text-brand-gold transition-colors mb-2">
                    Kuchynský ostrovček zo sinterovaného kameňa
                  </h3>
                  <p className="text-sm text-gray-500 font-light">
                    Dizajn, materiál, rozmery — všetko, čo potrebujete vedieť.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 md:py-32 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
                Časté otázky
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-bold">
                Odpovede na vaše otázky
              </h2>
            </div>
            <div className="bg-white rounded-3xl p-6 md:p-10">
              {FAQ_ITEMS.map((item, i) => (
                <FAQItem
                  key={i}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openFAQ === i}
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 md:py-32 bg-brand-dark text-white">
        <div className="container mx-auto px-6 text-center">
          <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
            Začnite svoj projekt
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold mb-6 max-w-2xl mx-auto">
            Poradíme vám s výberom materiálu
          </h2>
          <p className="text-gray-400 text-lg font-light max-w-xl mx-auto mb-10">
            Objednajte si bezplatnú vzorku alebo nás kontaktujte pre cenovú ponuku na mieru.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/vzorky"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-dark px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-brand-gold transition-colors"
            >
              Objednať vzorku
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/kontakt"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              Kontaktovať nás
            </Link>
            <Link
              to="/kategoria/sintered-stone"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              Katalóg dekórov
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8 text-sm">
            <a href="tel:+421917588738" className="flex items-center justify-center gap-2 text-gray-400 hover:text-brand-gold transition-colors">
              <Phone size={16} />
              +421 917 588 738
            </a>
            <a href="mailto:info@orostone.sk" className="flex items-center justify-center gap-2 text-gray-400 hover:text-brand-gold transition-colors">
              <Mail size={16} />
              info@orostone.sk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
