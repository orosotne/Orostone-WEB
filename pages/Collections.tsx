import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  ArrowRight, ShieldCheck, Sun, Droplets, Flame, ChevronDown,
  Layers, Sparkles, Palette, Eye
} from 'lucide-react';
import { COLLECTIONS, PRODUCTS } from '../constants';
import { Button } from '../components/UI/Button';
import { Link } from 'react-router-dom';
import { TextReveal } from '../components/UI/TextReveal';
import { Card, CardContent } from '@/components/UI/Card';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

// Featured collection data for pinned story
const FEATURED_COLLECTION = {
  id: 'marbelito',
  name: 'MARBELITO',
  slides: [
    {
      label: '01. Inšpirácia',
      title: 'Zrodené z prírody',
      text: 'Každý dekor MARBELITO je inšpirovaný najvzácnejšími mramormi sveta. Od talianskej Carrary po grécky Thassos.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2500&auto=format&fit=crop'
    },
    {
      label: '02. Technológia',
      title: 'Dokonalosť v detaile',
      text: 'Digitálna tlač s rozlíšením 400 DPI zachytáva každú žilku, každý odtieň. Výsledok nerozoznáte od originálu.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2500&auto=format&fit=crop'
    },
    {
      label: '03. Aplikácie',
      title: 'Bez hraníc',
      text: 'Kuchyne, kúpeľne, fasády, nábytok. MARBELITO prináša luxus mramoru kamkoľvek si želáte.',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2500&auto=format&fit=crop'
    }
  ]
};

// Extended collections data for showcase
const COLLECTIONS_SHOWCASE = [
  {
    id: 'marbelito',
    name: 'MARBELITO',
    tagline: 'Majstrovstvo mramoru',
    description: 'Verná imitácia najvzácnejších mramorov sveta. Calacatta, Statuario, Nero Marquina - všetky dostupné v sinterovanom kameni.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop',
    stats: { decors: 15, finishes: 3 },
    features: ['Bookmatch možnosť', 'Full Body technológia', 'Veined dizajny']
  },
  {
    id: 'unita',
    name: 'UNITA',
    tagline: 'Čistá elegancia',
    description: 'Konzistentná farba v celom priereze. Minimalistický dizajn pre moderné interiéry bez kompromisov.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
    stats: { decors: 12, finishes: 4 },
    features: ['Color Body', 'Jednofarebné', 'Industriálny štýl']
  },
  {
    id: 'bianco',
    name: 'BIANCO',
    tagline: 'Absolútna čistota',
    description: 'Najčistejšia biela na trhu. Ideálna pre hygienické priestory, laboratóriá a minimalistické kuchyne.',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2000&auto=format&fit=crop',
    stats: { decors: 8, finishes: 2 },
    features: ['White Body', 'Antibakteriálne', 'Maximálny jas']
  },
  {
    id: 'space-black',
    name: 'Space Black',
    tagline: 'Kozmická hĺbka',
    description: 'Hlboká čierna s metalickými odleskami. Pre tých, ktorí sa neboja dramatických statement kúskov.',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=2000&auto=format&fit=crop',
    stats: { decors: 6, finishes: 3 },
    features: ['Metalické efekty', 'Textúrované', 'Premium línia']
  }
];

// Material properties for bento grid
const MATERIAL_PROPERTIES = [
  {
    icon: ShieldCheck,
    title: 'Tvrdosť 7 Mohs',
    description: 'Odolá poškriabaniu nožom aj ostrým predmetom.',
    size: 'large'
  },
  {
    icon: Flame,
    title: 'Do 300°C',
    description: 'Horúce hrnce priamo na povrch.',
    size: 'small'
  },
  {
    icon: Sun,
    title: 'UV stabilita',
    description: 'Farba zostáva stála aj vonku.',
    size: 'small'
  },
  {
    icon: Droplets,
    title: '0% nasiakavosť',
    description: 'Maximálne hygienický, žiadne škvrny.',
    size: 'medium'
  },
  {
    icon: Sparkles,
    title: 'Ľahká údržba',
    description: 'Stačí voda a jemný saponát.',
    size: 'medium'
  }
];

export const Collections = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Featured collection active slide
  const [activeSlide, setActiveSlide] = useState(0);

  const filteredProducts = activeFilter === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.collectionId === activeFilter);

  useGSAP(() => {
    // Hero Animation Timeline
    const heroTl = gsap.timeline();
    
    heroTl.fromTo('.collections-hero-bg',
      { scale: 1.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.5, ease: 'power2.out' }
    );

    heroTl.fromTo('.collections-hero-text',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out' },
      '-=1.5'
    );

    heroTl.fromTo('.collections-hero-stat',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
      '-=0.5'
    );

    // Hero Parallax
    gsap.to('.collections-hero-bg', {
      y: 150,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Featured Collection Pinning
    const featuredTl = gsap.timeline({
      scrollTrigger: {
        trigger: featuredRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        snap: 0.33,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.33) {
            setActiveSlide(0);
          } else if (progress < 0.66) {
            setActiveSlide(1);
          } else {
            setActiveSlide(2);
          }
        }
      }
    });

    featuredTl
      .to('.featured-slide-0', { opacity: 0, scale: 0.95, duration: 1 })
      .fromTo('.featured-slide-1', { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1 })
      .to('.featured-slide-1', { opacity: 0, scale: 0.95, duration: 1 })
      .fromTo('.featured-slide-2', { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1 });

    // Collections Showcase reveal
    gsap.utils.toArray('.collection-showcase-item').forEach((item: any, i) => {
      const direction = i % 2 === 0 ? -100 : 100;
      gsap.fromTo(item.querySelector('.showcase-image'),
        { x: direction, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      gsap.fromTo(item.querySelector('.showcase-content'),
        { x: -direction, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Material Properties stagger
    gsap.utils.toArray('.material-property-card').forEach((card: any, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Product gallery stagger
    gsap.utils.toArray('.product-card').forEach((card: any, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // CTA parallax
    gsap.to('.collections-cta-bg', {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.collections-cta',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

  }, { scope: containerRef, dependencies: [activeFilter] });

  return (
    <main ref={containerRef} className="overflow-hidden w-full bg-white">

      {/* ==================== HERO SECTION ==================== */}
      <section ref={heroRef} className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 collections-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2500&auto=format&fit=crop"
            alt="Collections Hero"
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <span className="collections-hero-text font-sans text-xs font-bold tracking-widest uppercase text-brand-gold mb-6 block">
            Kolekcie 2024
          </span>
          <h1 className="collections-hero-text text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-normal leading-[1] mb-8">
            Objavte krásu<br/>sinterovaného kameňa.
          </h1>
          <p className="collections-hero-text font-sans font-light text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Od verných imitácií mramoru po minimalistické monochromatické povrchy.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-4 gap-8 text-center text-white">
              <div className="collections-hero-stat">
                <span className="text-3xl md:text-4xl font-sans font-bold text-brand-gold">50+</span>
                <p className="text-xs font-bold uppercase tracking-widest mt-2 text-gray-400">Dekorov</p>
              </div>
              <div className="collections-hero-stat">
                <span className="text-3xl md:text-4xl font-sans font-bold text-brand-gold">4</span>
                <p className="text-xs font-bold uppercase tracking-widest mt-2 text-gray-400">Kolekcie</p>
              </div>
              <div className="collections-hero-stat">
                <span className="text-3xl md:text-4xl font-sans font-bold text-brand-gold">12+</span>
                <p className="text-xs font-bold uppercase tracking-widest mt-2 text-gray-400">Povrchov</p>
              </div>
              <div className="collections-hero-stat">
                <span className="text-3xl md:text-4xl font-sans font-bold text-brand-gold">3</span>
                <p className="text-xs font-bold uppercase tracking-widest mt-2 text-gray-400">Hrúbky</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-white/50 z-10">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs font-bold tracking-widest uppercase">Scroll</span>
            <ChevronDown size={28} />
          </div>
        </div>
      </section>

      {/* ==================== FEATURED COLLECTION - PINNED ==================== */}
      <section ref={featuredRef} className="h-screen w-full bg-black text-white relative overflow-hidden">
        
        {/* Label */}
        <div className="absolute top-8 left-8 z-20">
          <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">Featured Collection</span>
          <h3 className="text-xl md:text-2xl font-sans font-bold mt-2">{FEATURED_COLLECTION.name}</h3>
        </div>

        {/* Slides */}
        {FEATURED_COLLECTION.slides.map((slide, index) => (
          <div 
            key={index}
            className={cn(
              "featured-slide-" + index,
              "absolute inset-0 flex items-center justify-center",
              index !== 0 && "opacity-0"
            )}
          >
            <div className="absolute inset-0 z-0">
              <img src={slide.image} className="w-full h-full object-cover opacity-50" alt={slide.title} />
            </div>
            <div className="relative z-10 text-center max-w-4xl px-6">
              <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">{slide.label}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6 leading-tight">{slide.title}</h2>
              <p className="text-lg text-gray-400 font-light leading-relaxed">{slide.text}</p>
            </div>
          </div>
        ))}

        {/* Progress Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {FEATURED_COLLECTION.slides.map((_, index) => (
            <div 
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === activeSlide ? "bg-brand-gold" : "bg-white/30"
              )}
            />
          ))}
        </div>
      </section>

      {/* ==================== COLLECTIONS SHOWCASE - ZIG-ZAG ==================== */}
      <section className="py-32 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">Naše kolekcie</span>
            <TextReveal variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6 justify-center">
              Štyri jedinečné línie
            </TextReveal>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Každá kolekcia má svoj charakter. Nájdite tú, ktorá definuje váš priestor.
            </p>
          </div>

          <div className="space-y-32">
            {COLLECTIONS_SHOWCASE.map((collection, index) => (
              <div
                key={collection.id}
                className={cn(
                  "collection-showcase-item grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                )}
              >
                <div className={cn("showcase-image", index % 2 === 1 && "lg:order-2")}>
                  <div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl group">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white">
                      <div>
                        <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">{collection.tagline}</span>
                        <h3 className="text-xl md:text-2xl font-sans font-bold mt-2">{collection.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-sans font-bold">{collection.stats.decors}</span>
                        <p className="text-xs uppercase tracking-widest text-gray-400">dekorov</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={cn("showcase-content", index % 2 === 1 && "lg:order-1")}>
                  <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">0{index + 1}</span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6">{collection.name}</h2>
                  <p className="text-lg text-gray-500 font-light leading-relaxed mb-8">
                    {collection.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {collection.features.map((feature, i) => (
                      <span key={i} className="px-4 py-2 bg-white rounded-full text-sm text-brand-dark border border-gray-200">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-8 mb-8">
                    <div>
                      <span className="text-3xl font-sans font-bold text-brand-dark">{collection.stats.finishes}</span>
                      <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">povrchov</p>
                    </div>
                  </div>
                  
                  <Link to={`/kolekcie?filter=${collection.id}`}>
                    <Button variant="outline" className="border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white">
                      Zobraziť kolekciu <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MATERIAL PROPERTIES - BENTO GRID ==================== */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">Vlastnosti</span>
            <TextReveal variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark leading-tight justify-center">
              Materiál bez kompromisov
            </TextReveal>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[200px]">
            {/* Large card */}
            <div className="material-property-card lg:col-span-2 lg:row-span-2 group p-10 bg-gradient-to-br from-brand-dark to-black text-white rounded-3xl relative overflow-hidden hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <ShieldCheck size={48} className="text-brand-gold" />
                <div>
                  <h3 className="text-xl md:text-2xl font-sans font-bold mb-4">Tvrdosť 7 Mohs</h3>
                  <p className="text-gray-400 text-base font-light leading-relaxed max-w-md">
                    Odolá poškriabaniu nožom, nárazom aj každodennému používaniu po desaťročia.
                  </p>
                </div>
              </div>
            </div>

            {/* Small cards */}
            <div className="material-property-card group p-8 bg-[#F9F9F7] rounded-3xl hover:bg-brand-gold/10 transition-all duration-500 hover:scale-[1.02]">
              <Flame size={32} className="text-brand-gold mb-4" />
              <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Do 300°C</h3>
              <p className="text-gray-500 text-base font-light">Horúce hrnce priamo na povrch</p>
            </div>

            <div className="material-property-card group p-8 bg-[#F9F9F7] rounded-3xl hover:bg-brand-gold/10 transition-all duration-500 hover:scale-[1.02]">
              <Sun size={32} className="text-brand-gold mb-4" />
              <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">UV stabilita</h3>
              <p className="text-gray-500 text-base font-light">Farba zostáva stála aj vonku</p>
            </div>

            {/* Medium cards */}
            <div className="material-property-card lg:col-span-2 group p-8 bg-[#F9F9F7] rounded-3xl hover:bg-brand-gold/10 transition-all duration-500 hover:scale-[1.02] flex items-center gap-8">
              <Droplets size={48} className="text-brand-gold flex-shrink-0" />
              <div>
                <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">0% nasiakavosť</h3>
                <p className="text-gray-500 text-base font-light">Maximálne hygienický povrch. Neabsorbuje tekutiny, kyseliny ani mastnotu.</p>
              </div>
            </div>

            <div className="material-property-card lg:col-span-2 group p-8 bg-brand-gold/20 rounded-3xl hover:bg-brand-gold/30 transition-all duration-500 hover:scale-[1.02] flex items-center gap-8">
              <Sparkles size={48} className="text-brand-gold flex-shrink-0" />
              <div>
                <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Ľahká údržba</h3>
                <p className="text-gray-600 text-base font-light">Stačí voda a jemný saponát. Bez impregnácie, bez špeciálnych prípravkov.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRODUCT GALLERY ==================== */}
      <section className="py-32 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">Katalóg</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6">Všetky dekory</h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <button 
              onClick={() => setActiveFilter('all')}
              className={cn(
                "px-6 py-3 text-sm uppercase tracking-widest transition-all rounded-full",
                activeFilter === 'all' 
                  ? "bg-brand-dark text-white" 
                  : "bg-white text-gray-500 hover:text-brand-dark border border-gray-200"
              )}
            >
              Všetky
            </button>
            {COLLECTIONS.map(col => (
              <button
                key={col.id}
                onClick={() => setActiveFilter(col.id)}
                className={cn(
                  "px-6 py-3 text-sm uppercase tracking-widest transition-all rounded-full",
                  activeFilter === col.id 
                    ? "bg-brand-dark text-white" 
                    : "bg-white text-gray-500 hover:text-brand-dark border border-gray-200"
                )}
              >
                {col.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product, i) => (
              <div key={product.id} className="product-card">
                <Link to={`/produkt/${product.id}`} className="group block">
                  <Card className="relative overflow-hidden border-0 shadow-lg rounded-2xl mb-6">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur text-[10px] font-bold tracking-wider px-3 py-1.5 uppercase rounded-full">
                        {product.bodyType}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-brand-gold text-xs uppercase tracking-widest mb-2 block">
                        {COLLECTIONS.find(c => c.id === product.collectionId)?.name}
                      </span>
                      <div className="flex items-center gap-2 text-sm">
                        <Eye size={14} />
                        Detail produktu
                      </div>
                    </CardContent>
                  </Card>
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-xl font-sans font-bold text-brand-dark group-hover:text-brand-gold transition-colors">{product.name}</h3>
                    </div>
                    <p className="text-base text-gray-500 line-clamp-2 font-light">{product.description}</p>
                    <div className="flex gap-2 mt-3">
                      {product.thickness.map((t, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{t}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="collections-cta py-40 bg-brand-dark text-white text-center relative overflow-hidden">
        <div className="collections-cta-bg absolute inset-0 opacity-20 scale-110">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2500&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale" 
            alt="texture" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark opacity-80" />

        <div className="container mx-auto px-6 relative z-10">
          <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-6 block">Nenašli ste?</span>
          <TextReveal variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-8 justify-center tracking-tight text-white">
            Váš dekor na mieru.
          </TextReveal>
          <p className="text-lg text-gray-400 font-light mb-12 max-w-2xl mx-auto">
            Máme prístup k stovkám dekorov od popredných výrobcov. Kontaktujte nás a nájdeme presne to, čo hľadáte.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/kontakt?openWizard=true">
              <Button size="lg" className="bg-brand-gold text-brand-dark px-12 py-8 text-lg rounded-full hover:bg-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                Konzultácia zadarmo
              </Button>
            </Link>
            <Link to="/realizacie">
              <Button variant="outline" size="lg" className="border-white/30 text-white px-12 py-8 text-lg rounded-full hover:bg-white hover:text-brand-dark transition-all">
                Pozrieť realizácie
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
