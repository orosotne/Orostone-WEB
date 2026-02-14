import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ShieldCheck,
  Flame,
  Droplets,
  Sun,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  FlaskConical,
  Scaling,
  Paintbrush,
  Check,
  X,
  CookingPot,
  Bath,
  Building2,
  Blocks,
  Sofa,
  Landmark,
} from 'lucide-react';
import { TextReveal } from '@/components/UI/TextReveal';
import { Button } from '@/components/UI/Button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/UI/Card';
import { SEOHead } from '@/components/UI/SEOHead';

gsap.registerPlugin(ScrollTrigger);

/* =============================================================
   FAQ DATA — pripravené na JSON-LD FAQ Schema
   ============================================================= */
const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'Čo je sinterovaný kameň?',
    answer:
      'Sinterovaný kameň je pokročilý povrchový materiál vyrobený zo 100 % prírodných minerálov (kremeň, živec, íl, kovové oxidy). Minerály sú zlisované pod tlakom až 25 000 ton a následne vypálené pri teplote nad 1 200 °C. Výsledkom je plne vitrifikovaný, nepórovitý povrch bez živíc a syntetických spojív.',
  },
  {
    question: 'Je sinterovaný kameň rovnaký ako keramika alebo porcelán?',
    answer:
      'Nie. Hoci sa občas zaraďujú do rovnakej skupiny, sinterovaný kameň sa vyrába pod výrazne vyšším tlakom a dosahuje nasiakavosť pod 0,1 % (keramika 3–10 %). To mu dáva vyššiu pevnosť, odolnosť voči nárazom a vhodnosť na exteriérové aplikácie.',
  },
  {
    question: 'Môžem na sinterovaný kameň položiť horúci hrniec?',
    answer:
      'Áno. Sinterovaný kameň odolá teplotám nad 300 °C bez zmeny farby alebo poškodenia povrchu. Na rozdiel od quartzového kompozitu (max. ~150 °C) nepotrebujete podložku pod horúci riad.',
  },
  {
    question: 'Poškriabe sa sinterovaný kameň?',
    answer:
      'Pri bežnom používaní nie. Tvrdosť sinterovaného kameňa dosahuje 6–8 na Mohsovej stupnici — je tvrdší ako väčšina kuchynského náradia. Pre dlhodobú krásu povrchu však odporúčame používať krájaciu dosku.',
  },
  {
    question: 'Musím sinterovaný kameň impregnovat?',
    answer:
      'Nie. Vďaka nulovej pórovitosti nepotrebuje žiadnu impregnáciu ani špeciálne ošetrenie — na rozdiel od prírodného kameňa (žula, mramor), ktorý vyžaduje pravidelnú impregnáciu.',
  },
  {
    question: 'Ako sa o sinterovaný kameň starať?',
    answer:
      'Jednoducho. Na denné čistenie stačí vlhká utierka s pH neutrálnym čistiacim prostriedkom alebo saponátom. Nepoužívajte bielidlo, amoniak ani brúsne hubky. Tvrdšie nečistoty odstránite neabrazívnym čistiacim prípravkom.',
  },
  {
    question: 'Hodí sa sinterovaný kameň do kúpeľne?',
    answer:
      'Áno, výborne. Nasiakavosť pod 0,1 % znamená odolnosť voči vlhkosti, plesniam a baktériám. Materiál je ideálny na vaničky, obklady, umývadlá aj podlahy v mokrých zónach.',
  },
  {
    question: 'Dá sa sinterovaný kameň použiť na fasádu?',
    answer:
      'Áno. UV stabilita (bez zmeny farby podľa DIN 51094), mrazuvzdornosť, odolnosť voči chemikáliám a nízka hmotnosť (tenké formáty od 3 mm) robia zo sinterovaného kameňa ideálny fasádny materiál.',
  },
  {
    question: 'Aké hrúbky a rozmery sú dostupné?',
    answer:
      'Dosky sú štandardne dostupné v rozmeroch až 3 200 × 1 600 mm v hrúbkach 6 mm, 12 mm a 20 mm. Tenké 3mm formáty sa používajú na obklady a fasády, 20mm na kuchynské pracovné dosky.',
  },
  {
    question: 'Je sinterovaný kameň ekologický?',
    answer:
      'Áno. Obsahuje len prírodné minerály, pri výrobe sa nepoužívajú živice ani VOC látky. Materiál je recyklovateľný, neemituje škodlivé chemikálie a výrobný proces využíva rekuperáciu tepla.',
  },
];

/* =============================================================
   FAQ Schema JSON-LD
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
   POROVNÁVACIA TABUĽKA
   ============================================================= */
const COMPARISON_DATA = [
  {
    property: 'Odolnosť teplu',
    sintered: '> 300 °C',
    natural: '~ 200 °C',
    quartz: '~ 150 °C',
    ceramic: '~ 200 °C',
    laminate: '~ 80 °C',
  },
  {
    property: 'Nasiakavosť',
    sintered: '< 0,1 %',
    natural: '0,1–3 %',
    quartz: '< 0,1 %',
    ceramic: '3–10 %',
    laminate: 'Vysoká',
  },
  {
    property: 'Tvrdosť (Mohs)',
    sintered: '6–8',
    natural: '3–7',
    quartz: '6–7',
    ceramic: '5–6',
    laminate: '2–3',
  },
  {
    property: 'UV stabilita',
    sintered: 'Áno',
    natural: 'Čiastočne',
    quartz: 'Nie',
    ceramic: 'Čiastočne',
    laminate: 'Nie',
  },
  {
    property: 'Odolnosť škvrnám',
    sintered: 'Výborná',
    natural: 'Slabá – stredná',
    quartz: 'Výborná',
    ceramic: 'Stredná',
    laminate: 'Slabá',
  },
  {
    property: 'Impregnácia',
    sintered: 'Nepotrebuje',
    natural: 'Pravidelne',
    quartz: 'Nepotrebuje',
    ceramic: 'Podľa typu',
    laminate: 'Nepotrebuje',
  },
  {
    property: 'Údržba',
    sintered: 'Minimálna',
    natural: 'Náročná',
    quartz: 'Nízka',
    ceramic: 'Stredná',
    laminate: 'Nízka',
  },
  {
    property: 'Exteriér / fasády',
    sintered: 'Áno',
    natural: 'Obmedzene',
    quartz: 'Nie',
    ceramic: 'Obmedzene',
    laminate: 'Nie',
  },
];

/* =============================================================
   FAQ ACCORDION ITEM
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
        {isOpen ? (
          <ChevronUp size={18} className="text-brand-dark" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </span>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 pb-6' : 'max-h-0'
      }`}
    >
      <p className="text-gray-600 font-light leading-relaxed text-base pr-12">
        {answer}
      </p>
    </div>
  </div>
);

/* =============================================================
   HLAVNÝ KOMPONENT
   ============================================================= */
export const SinterovanyKamen = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  useGSAP(
    () => {
      // Hero Animation
      const tl = gsap.timeline();
      tl.fromTo(
        '.sk-hero-text',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
      ).fromTo(
        '.sk-hero-image',
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
        '-=0.8'
      );

      // Parallax Effect for Hero
      gsap.to('.sk-hero-image video', {
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Process Steps Reveal
      gsap.utils.toArray('.sk-process-step').forEach((step: any, i) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Feature Cards Reveal
      gsap.utils.toArray('.sk-feature-card').forEach((card: any, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Application Cards Reveal
      gsap.utils.toArray('.sk-app-card').forEach((card: any, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Section headings reveal
      gsap.utils.toArray('.sk-section-heading').forEach((heading: any) => {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <main ref={containerRef} className="overflow-hidden w-full bg-white">
      {/* SEO Head */}
      <SEOHead
        title="Sinterovaný kameň | Čo to je a prečo ho chcete | Orostone"
        description="Sinterovaný kameň je prémiový povrch z prírodných minerálov. Odolný teplu, škvrnám aj UV. Zistite, prečo je ideálny na kuchynské dosky a interiéry."
        canonical="https://www.orostone.sk/sinterovany-kamen"
        structuredData={faqStructuredData}
      />

      {/* ========================================================
          1. HERO SECTION
          ======================================================== */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden pt-20"
      >
        <div className="absolute inset-0 z-0 sk-hero-image">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover brightness-[0.35]"
            poster="/images/home/hero-1.jpeg"
          >
            <source src="/videos/hero-stone-shatter.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <span className="sk-hero-text font-sans text-xs font-bold tracking-widest uppercase text-brand-gold mb-6 block">
            Materiál budúcnosti
          </span>
          <h1 className="sk-hero-text text-4xl md:text-5xl lg:text-7xl font-sans font-bold tracking-normal leading-[1.05] mb-8">
            Sinterovaný kameň
          </h1>
          <p className="sk-hero-text font-sans font-light text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12">
            100 % prírodné minerály. Extrémna odolnosť. Nulová údržba.
            Povrch, ktorý prekoná prírodný kameň aj quartz.
          </p>
          <div className="sk-hero-text flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/kolekcie">
              <Button
                size="lg"
                className="bg-brand-gold text-brand-dark px-10 py-6 text-base rounded-full hover:bg-white hover:text-brand-dark transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Pozrieť kolekcie
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/kontakt">
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white px-10 py-6 text-base rounded-full hover:bg-white hover:text-brand-dark transition-all"
              >
                Vyžiadať vzorku
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 z-10">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <ChevronDown size={28} />
          </div>
        </div>
      </section>

      {/* ========================================================
          2. ČO JE SINTEROVANÝ KAMEŇ
          ======================================================== */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="sk-section-heading">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold tracking-widest uppercase mb-6">
                  <Layers size={14} />
                  Definícia
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-8 leading-tight">
                  Čo je sinterovaný kameň
                </h2>
              </div>
              <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                Sinterovaný kameň je pokročilý povrchový materiál vyrobený výhradne z
                prírodných minerálov — kremenca, živca, ílu a kovových oxidov. Výrobný
                proces napodobňuje geologické formovanie hornín v zemskej kôre, no namiesto
                miliónov rokov trvá len niekoľko hodín.
              </p>
              <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                Na rozdiel od quartzových kompozitov neobsahuje žiadne živice ani
                syntetické spojivá. Výsledkom je plne vitrifikovaný, nepórovitý povrch
                s výnimočnou odolnosťou voči teplu, škvrnám, poškriabaniu a UV žiareniu.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Nasiakavosť', value: '< 0,1 %' },
                  { label: 'Tvrdosť (Mohs)', value: '6–8' },
                  { label: 'Tepelná odolnosť', value: '> 300 °C' },
                  { label: 'Zloženie', value: '100 % minerály' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#F9F9F7] rounded-2xl p-5 text-center"
                  >
                    <p className="text-2xl md:text-3xl font-bold text-brand-dark mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[500px] lg:h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="/images/yabo-white-application.jpg"
                className="w-full h-full object-cover"
                alt="Sinterovaný kameň Yabo White — aplikácia v interiéri"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. AKO SA VYRÁBA
          ======================================================== */}
      <section className="py-24 md:py-32 bg-brand-dark text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 sk-section-heading">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">
              Výrobný proces
            </span>
            <TextReveal
              variant="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6 justify-center"
            >
              Ako sa sinterovaný kameň vyrába
            </TextReveal>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
              Tri kroky, ktoré premenia prírodné minerály na nezničiteľný povrch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Výber minerálov',
                desc: 'Starostlivo vybraný kremeň, živec, íl a kovové oxidy — výlučne prírodné suroviny bez syntetických prímesí.',
                icon: <FlaskConical className="w-8 h-8" />,
                img: '/images/process-minerals.png',
                imgAlt:
                  'Prírodné minerály použité pri výrobe sinterovaného kameňa',
              },
              {
                step: '02',
                title: 'Extrémna kompakcia',
                desc: 'Minerálna zmes sa zlisuje pod tlakom 10 000 – 25 000 ton. To je ekvivalent hmotnosti dvoch a pol Eiffelových veží na jednej doske.',
                icon: <Scaling className="w-8 h-8" />,
                img: '/images/process-compaction.png',
                imgAlt: 'Kompakcia minerálov pod tlakom 25 000 ton',
              },
              {
                step: '03',
                title: 'Sintrovanie',
                desc: 'Doska sa vypáli pri teplote nad 1 200 °C. Častice sa spoja na molekulárnej úrovni — vzniká monolitický, nepórovitý povrch.',
                icon: <Flame className="w-8 h-8" />,
                img: '/images/process-sintering.png',
                imgAlt: 'Sintrovanie pri teplote 1200 stupňov Celzia',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="sk-process-step group relative rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 hover:border-brand-gold/30 transition-all duration-500"
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.imgAlt}
                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-brand-gold text-brand-dark w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-brand-gold mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. VÝHODY
          ======================================================== */}
      <section className="py-24 md:py-32 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 sk-section-heading">
            <TextReveal
              variant="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6 justify-center"
            >
              Výhody sinterovaného kameňa
            </TextReveal>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Prečo si ho vyberajú architekti, kuchynské štúdiá aj nároční majitelia domov.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Flame className="w-8 h-8" />,
                title: 'Odolnosť teplu',
                desc: 'Odolá teplotám nad 300 °C. Horúci hrniec priamo na dosku — bez strachu.',
                color: 'text-black',
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: 'Nepoškriabateľný',
                desc: 'Tvrdosť 6–8 na Mohsovej stupnici. Tvrdší ako žula (6) a väčšina kuchynského náradia.',
                color: 'text-black',
              },
              {
                icon: <Droplets className="w-8 h-8" />,
                title: 'Nulová nasiakavosť',
                desc: 'Pod 0,1 %. Víno, káva, olej — nič sa nevsiakne. Baktérie a plesne nemajú šancu.',
                color: 'text-black',
              },
              {
                icon: <Sun className="w-8 h-8" />,
                title: 'UV stabilita',
                desc: 'Farba sa nemení ani na priamom slnku. Ideálne aj pre exteriéry a fasády.',
                color: 'text-black',
              },
              {
                icon: <FlaskConical className="w-8 h-8" />,
                title: 'Chemická odolnosť',
                desc: 'Trieda A podľa ISO 10545-13. Odolný voči kyselinám, zásadám aj bazénovej chémii.',
                color: 'text-black',
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Bez impregnácie',
                desc: 'Nepórovitý povrch nevyžaduje žiadne tesnenie ani pravidelnú údržbu.',
                color: 'text-black',
              },
              {
                icon: <Scaling className="w-8 h-8" />,
                title: 'Veľké formáty',
                desc: 'Dosky až 3 200 × 1 600 mm. Menej spojov, čistejší dizajn, jednoduchšia montáž.',
                color: 'text-black',
              },
              {
                icon: <Paintbrush className="w-8 h-8" />,
                title: 'Dizajnová variabilita',
                desc: 'Matný, leštený, štruktúrovaný povrch. Vzhľad mramoru, betónu, kovu či dreva.',
                color: 'text-black',
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="sk-feature-card border-0 shadow-sm hover:shadow-xl bg-white rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardContent className="p-0">
                  <div
                    className={`${item.color} mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. POROVNANIE S ALTERNATÍVAMI
          ======================================================== */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 sk-section-heading">
            <TextReveal
              variant="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6 justify-center"
            >
              Porovnanie s inými materiálmi
            </TextReveal>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Objektívne porovnanie kľúčových parametrov. Bez marketingových
              fráz — len overené fakty.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-brand-dark">
                  <th className="text-left py-4 px-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                    Vlastnosť
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold uppercase tracking-wider text-brand-gold bg-brand-dark/5 rounded-t-xl">
                    Sinterovaný kameň
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                    Prírodný kameň
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                    Quartz kompozit
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                    Keramika
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                    Laminát
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, idx) => (
                  <tr
                    key={row.property}
                    className={`border-b border-gray-100 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-4 px-4 text-sm font-semibold text-brand-dark">
                      {row.property}
                    </td>
                    <td className="py-4 px-4 text-sm text-center font-semibold text-brand-dark bg-brand-gold/5">
                      {row.sintered}
                    </td>
                    <td className="py-4 px-4 text-sm text-center text-gray-600">
                      {row.natural}
                    </td>
                    <td className="py-4 px-4 text-sm text-center text-gray-600">
                      {row.quartz}
                    </td>
                    <td className="py-4 px-4 text-sm text-center text-gray-600">
                      {row.ceramic}
                    </td>
                    <td className="py-4 px-4 text-sm text-center text-gray-600">
                      {row.laminate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {COMPARISON_DATA.map((row) => (
              <div
                key={row.property}
                className="bg-[#F9F9F7] rounded-2xl p-5"
              >
                <h4 className="text-sm font-bold text-brand-dark mb-3 uppercase tracking-wider">
                  {row.property}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-brand-gold font-semibold">
                      Sinterovaný kameň
                    </span>
                    <span className="text-sm font-bold text-brand-dark">
                      {row.sintered}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Prírodný kameň</span>
                    <span className="text-sm text-gray-600">{row.natural}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Quartz kompozit</span>
                    <span className="text-sm text-gray-600">{row.quartz}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Keramika</span>
                    <span className="text-sm text-gray-600">{row.ceramic}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Laminát</span>
                    <span className="text-sm text-gray-600">{row.laminate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. POUŽITIE V INTERIÉRI
          ======================================================== */}
      <section className="py-24 md:py-32 bg-black text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 sk-section-heading">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">
              Aplikácie
            </span>
            <TextReveal
              variant="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6 justify-center"
            >
              Kde sa sinterovaný kameň používa
            </TextReveal>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
              Od kuchynských dosiek až po fasády. Jeden materiál, nekonečné
              možnosti.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <CookingPot className="w-7 h-7" />,
                title: 'Kuchynské dosky a ostrovčeky',
                desc: 'Odolnosť voči teplu, škvrnám a nožom robí zo sinterovaného kameňa ideálnu pracovnú plochu. Dosky bez spojov vďaka veľkým formátom.',
                img: '/images/app-kitchen.png',
                imgAlt: 'Kuchynská pracovná doska zo sinterovaného kameňa',
              },
              {
                icon: <Bath className="w-7 h-7" />,
                title: 'Kúpeľne',
                desc: 'Nulová nasiakavosť zabraňuje rastu plesní a baktérií. Ideálne na obklady, podlahy, vaničky aj umývadlá.',
                img: '/images/app-bathroom.png',
                imgAlt: 'Sinterovaný kameň v modernej kúpeľni',
              },
              {
                icon: <Blocks className="w-7 h-7" />,
                title: 'Obklady a zásteny',
                desc: 'Bezšvové riešenia vďaka veľkým formátom dosiek. Jednoduché čistenie a elegantný vzhľad.',
                img: '/images/app-backsplash.png',
                imgAlt: 'Kuchynská zástena zo sinterovaného kameňa',
              },
              {
                icon: <Building2 className="w-7 h-7" />,
                title: 'Fasády',
                desc: 'UV stabilita, mrazuvzdornosť a nízka hmotnosť (od 3 mm). Farba sa nemení ani po rokoch na priamom slnku.',
                img: '/images/app-facade.png',
                imgAlt: 'Fasáda zo sinterovaného kameňa',
              },
              {
                icon: <Landmark className="w-7 h-7" />,
                title: 'Krbové obklady',
                desc: 'Materiál vzniká pri 1 200 °C — teplo z krbu mu neublíži. Bezpečná a estetická voľba.',
                img: '/images/app-fireplace.png',
                imgAlt: 'Krbový obklad zo sinterovaného kameňa',
              },
              {
                icon: <Sofa className="w-7 h-7" />,
                title: 'Nábytok',
                desc: 'Stolové dosky, police, kúpeľňové konzoly. Tenké formáty (6 mm) pre ľahkú a modernú konštrukciu.',
                img: '/images/app-furniture.png',
                imgAlt: 'Nábytok zo sinterovaného kameňa',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="sk-app-card group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
              >
                <img
                  src={item.img}
                  alt={item.imgAlt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="text-brand-gold mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 font-light text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/realizacie">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-black"
              >
                Pozrieť realizácie <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. POVRCHY A VZHĽADY
          ======================================================== */}
      <section className="py-24 md:py-32 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 sk-section-heading">
            <TextReveal
              variant="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6 justify-center"
            >
              Povrchové úpravy
            </TextReveal>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Každý povrch mení charakter materiálu. Vyberte si ten, ktorý
              najlepšie ladí s vaším interiérom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Matný (Matt)',
                desc: 'Jemný, hladký povrch bez odleskov. Minimalizuje viditeľnosť odtlačkov prstov a poskytuje elegantný, moderný vzhľad. Odolnosť voči škvrnám triedy 5 podľa ISO 10545-14.',
                img: '/images/finish-matte.png',
                imgAlt: 'Matný povrch sinterovaného kameňa',
              },
              {
                title: 'Leštený (Polished)',
                desc: 'Vysoko lesklý, zrkadlový povrch, ktorý zvýrazňuje hĺbku a kresbu materiálu. Ideálny pre luxusné interiéry. Vyžaduje pravidelné utieranie do sucha.',
                img: '/images/finish-polished.png',
                imgAlt: 'Leštený povrch sinterovaného kameňa',
              },
              {
                title: 'Štruktúrovaný (Textured)',
                desc: 'Hmatateľná textúra, ktorá napodobňuje prírodný kameň, drevo alebo betón. Technológia VeinTouch vytvára realistický dotykový zážitok pri zachovaní všetkých technických vlastností.',
                img: '/images/finish-textured.png',
                imgAlt: 'Štruktúrovaný povrch sinterovaného kameňa',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="sk-feature-card group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.imgAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-brand-dark mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 font-light leading-relaxed text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          8. ÚDRŽBA A ČISTENIE
          ======================================================== */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 sk-section-heading">
            <TextReveal
              variant="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6 justify-center"
            >
              Údržba a čistenie
            </TextReveal>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Minimálna starostlivosť, maximálny výsledok. Žiadna impregnácia,
              žiadne špeciálne prípravky.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* ÁNO */}
            <div className="bg-emerald-50 rounded-[2rem] p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark">
                  Odporúčame
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Vlhká mäkká utierka alebo špongia',
                  'pH neutrálny čistiaci prostriedok',
                  'Bežný saponát s vodou',
                  'Utretie do sucha po čistení',
                  'Neabrazívny prípravok na tvrdšie nečistoty',
                  'Ihneď utierať rozliaty olej alebo víno',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <Check className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span className="font-light text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NIE */}
            <div className="bg-red-50 rounded-[2rem] p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark">
                  Nepoužívajte
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Bielidlo a chlórové prípravky',
                  'Amoniak a agresívne chemikálie',
                  'Brúsne hubky a oceľovú vlnu',
                  'Kyselinu fluorovodíkovú',
                  'Čističe s voskom, olejom alebo leštenkou',
                  'Vysokotlakový čistič na tesniace škáry',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <X className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span className="font-light text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. FAQ
          ======================================================== */}
      <section className="py-24 md:py-32 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 sk-section-heading">
            <TextReveal
              variant="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6 justify-center"
            >
              Často kladené otázky
            </TextReveal>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Odpovede na najčastejšie otázky o sinterovanom kameni.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-sm p-6 md:p-10">
            {FAQ_ITEMS.map((item, idx) => (
              <FAQItem
                key={idx}
                question={item.question}
                answer={item.answer}
                isOpen={openFAQ === idx}
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          10. ZÁVER + CTA
          ======================================================== */}
      <section className="py-32 md:py-40 bg-brand-dark text-center text-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, #ECD488 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <TextReveal
            variant="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-8 justify-center tracking-tight"
          >
            Pripravený na sinterovaný kameň?
          </TextReveal>
          <p className="text-lg text-gray-400 font-light mb-12 max-w-2xl mx-auto">
            Dotknite sa materiálu budúcnosti. Vyžiadajte si vzorku alebo
            nezáväznú cenovú ponuku ešte dnes.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/kontakt?openWizard=true">
              <Button
                size="lg"
                className="bg-brand-gold text-brand-dark px-10 py-8 text-lg rounded-full hover:bg-white hover:text-brand-dark transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Vytvoriť cenovú ponuku
              </Button>
            </Link>
            <Link to="/kolekcie">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white px-10 py-8 text-lg rounded-full hover:bg-white hover:text-brand-dark transition-all"
              >
                Prezrieť kolekcie
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <Link
              to="/o-kameni"
              className="hover:text-brand-gold transition-colors"
            >
              Viac o materiáli Orostone
            </Link>
            <Link
              to="/online-kalkulacka"
              className="hover:text-brand-gold transition-colors"
            >
              Vypočítajte si cenu
            </Link>
            <Link
              to="/realizacie"
              className="hover:text-brand-gold transition-colors"
            >
              Pozrieť realizácie
            </Link>
            <Link
              to="/key-facts"
              className="hover:text-brand-gold transition-colors"
            >
              Technické detaily (Key Facts)
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SinterovanyKamen;
