import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ShieldCheck,
  Flame,
  Droplets,
  Sun,
  Layers,
  ChefHat,
  Bath,
  Home as HomeIcon,
  Building2,
  Square,
  Sparkles,
  ArrowRight,
  Zap,
  Leaf,
  ChevronDown,
} from "lucide-react";
import { TextReveal } from '@/components/UI/TextReveal';
import { Button } from '@/components/UI/Button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/UI/Card';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export const OKameni = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero Animation
    const tl = gsap.timeline();
    tl.fromTo('.hero-text', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' }
    ).fromTo('.hero-image',
      { scale: 1.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
      '-=0.8'
    );

    // Parallax Effect for Hero
    gsap.to('.hero-image img', {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Story Section Pinning
    const storyTl = gsap.timeline({
      scrollTrigger: {
        trigger: storyRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        snap: 0.33
      }
    });

    storyTl
      .to('.story-slide-1', { opacity: 0, scale: 0.9, duration: 1 })
      .fromTo('.story-slide-2', { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1 })
      .to('.story-slide-2', { opacity: 0, scale: 0.9, duration: 1 })
      .fromTo('.story-slide-3', { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1 });

    // Features Reveal
    gsap.utils.toArray('.feature-card').forEach((card: any, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
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

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="overflow-hidden w-full bg-white">
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 hero-image">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2500&auto=format&fit=crop" 
            alt="Orostone Texture" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <span className="hero-text font-sans text-xs font-bold tracking-widest uppercase text-brand-gold mb-6 block">The New Standard</span>
          <h1 className="hero-text text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-normal leading-[1] mb-8">
            Beyond<br/>Stone.
          </h1>
          <p className="hero-text font-sans font-light text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Nie je to len povrch. Je to zážitok, ktorý pretrvá generácie.
            Sila prírody zdokonalená technológiou.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 z-10">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <ChevronDown size={28} />
          </div>
        </div>
      </section>

      {/* Story Scroller - "The Evolution" */}
      <section ref={storyRef} className="h-screen w-full bg-black text-white relative overflow-hidden flex items-center justify-center">
        
        {/* Slide 1: Raw Material */}
        <div className="story-slide-1 absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1599690940578-8ba948b812f8?q=80&w=2500&auto=format&fit=crop" className="w-full h-full object-cover opacity-40" alt="Raw Minerals" />
          </div>
          <div className="relative z-10 text-center max-w-4xl px-6">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">01. Pôvod</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6">Zrodený zo zeme</h2>
            <p className="text-lg text-gray-400 font-light">
              Vyberáme len tie najčistejšie prírodné minerály. Žiadne živice, žiadne plasty. 
              Len 100% prírodná esencia, pripravená na transformáciu.
            </p>
          </div>
        </div>

        {/* Slide 2: Fire & Pressure */}
        <div className="story-slide-2 absolute inset-0 flex items-center justify-center opacity-0">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1477038668270-3889c173f443?q=80&w=2500&auto=format&fit=crop" className="w-full h-full object-cover opacity-40" alt="Heat and Pressure" />
          </div>
          <div className="relative z-10 text-center max-w-4xl px-6">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">02. Premena</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6">Kutý v ohni</h2>
            <p className="text-lg text-gray-400 font-light">
              Extrémny tlak 25 000 ton a teplota 1200°C. Proces, ktorý v prírode trvá milióny rokov, 
              my zvládame za pár hodín. Výsledkom je nezničiteľná väzba.
            </p>
          </div>
        </div>

        {/* Slide 3: The Result */}
        <div className="story-slide-3 absolute inset-0 flex items-center justify-center opacity-0">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2500&auto=format&fit=crop" className="w-full h-full object-cover opacity-40" alt="Final Product" />
          </div>
          <div className="relative z-10 text-center max-w-4xl px-6">
             <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">03. Dokonalosť</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6">Orostone</h2>
            <p className="text-lg text-gray-400 font-light">
              Tvrdší ako žula. Ľahší ako hliník. Povrch, ktorý odolá času, teplu aj životu.
              Materiál budúcnosti je tu.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-32 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <TextReveal variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6 justify-center">
              Dizajnovaný pre život.
            </TextReveal>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
              Krása, ktorá si nevyžaduje obete. Odolnosť, ktorá vás oslobodí.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
            
            {/* Large Card - Indestructible */}
            <Card className="feature-card md:col-span-2 relative overflow-hidden group border-0 shadow-xl bg-black text-white rounded-[2rem]">
              <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" alt="Kitchen Knife" />
              </div>
              <CardContent className="relative z-10 h-full flex flex-col justify-end p-10">
                <ShieldCheck className="text-brand-gold mb-4 w-10 h-10" />
                <h3 className="text-xl md:text-2xl font-sans font-bold mb-2">Nepoškriabateľný</h3>
                <p className="text-gray-300 text-base font-light">Krájajte priamo na doske. Orostone má tvrdosť 7/10 na Mohsovej stupnici. Odolá oceli, nie však diamantu.</p>
              </CardContent>
            </Card>

            {/* Tall Card - Heat */}
            <Card className="feature-card md:row-span-2 relative overflow-hidden group border-0 shadow-xl bg-white text-brand-dark rounded-[2rem]">
               <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1588610531846-59a8689405d4?q=80&w=1500&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Fireplace" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <CardContent className="relative z-10 h-full flex flex-col justify-end p-10 text-white">
                <Flame className="text-orange-500 mb-4 w-10 h-10" />
                <h3 className="text-xl md:text-2xl font-sans font-bold mb-2">Miluje oheň</h3>
                <p className="text-gray-300 text-base font-light">Horúci hrniec? Žiadny problém. Oheň v krbe? Samozrejme. Teplotný šok je pre nás neznámy pojem.</p>
              </CardContent>
            </Card>

            {/* Small Card - Clean */}
            <Card className="feature-card bg-white border-0 shadow-lg rounded-[2rem] flex flex-col justify-center items-center text-center p-8 hover:shadow-xl transition-shadow">
              <Sparkles className="text-blue-400 w-16 h-16 mb-6" />
              <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Hygienický štít</h3>
              <p className="text-gray-500 font-light text-base">Nulová nasiakavosť. Baktérie a plesne nemajú šancu.</p>
            </Card>

             {/* Small Card - Sun */}
             <Card className="feature-card bg-brand-dark border-0 shadow-lg rounded-[2rem] flex flex-col justify-center items-center text-center p-8 text-white hover:shadow-xl transition-shadow">
              <Sun className="text-brand-gold w-16 h-16 mb-6" />
              <h3 className="text-xl md:text-2xl font-sans font-bold mb-2">Večne mladý</h3>
              <p className="text-gray-400 font-light text-base">UV stabilita zaručuje, že čierna ostane čiernou aj na priamom slnku.</p>
            </Card>

          </div>
        </div>
      </section>

      {/* Invisible Cooking Section - "Magical" */}
      <section className="py-32 bg-white overflow-hidden relative">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold tracking-widest uppercase mb-6">
                <Zap size={14} />
                Inovácia
             </div>
             <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-8 leading-tight">
               Varenie,<br/>ktoré nevidíte.
             </h2>
             <p className="text-lg text-gray-500 font-light leading-relaxed mb-10">
               Predstavte si kuchynskú linku bez rušivých elementov. Indukcia integrovaná priamo pod kamennou doskou. 
               Položíte hrniec, varíte. Zložíte hrniec, máte pracovnú plochu.
             </p>
             <div className="flex flex-col gap-4">
               {[
                 'Čistý dizajn bez výrezov',
                 'Väčšia pracovná plocha',
                 'Bezpečné na dotyk',
                 'Jednoduché čistenie'
               ].map(item => (
                 <div key={item} className="flex items-center gap-4 text-brand-dark/80">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                   <span className="text-lg font-light">{item}</span>
                 </div>
               ))}
             </div>
          </div>
          <div className="order-1 lg:order-2 relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl">
             <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Invisible Cooking" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-10">
               <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl text-white border border-white/30">
                 <p className="font-sans font-light text-2xl">Invisacook Ready</p>
                 <p className="text-sm opacity-80 mt-1">Certifikované pre použitie s neviditeľným varením.</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Gallery / Lifestyle Scroller */}
      <section className="py-32 bg-black text-white">
        <div className="container mx-auto px-6 mb-16 flex justify-between items-end">
           <div>
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">Inšpirácia</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold">Kdekoľvek.</h2>
           </div>
           <Link to="/realizacie">
             <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-black">
               Pozrieť galériu <ArrowRight className="ml-2 w-4 h-4" />
             </Button>
           </Link>
        </div>
        
        {/* Responsive Grid Container */}
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1000&auto=format&fit=crop", title: "Obývačka", desc: "Krbové obklady" },
              { img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1000&auto=format&fit=crop", title: "Kúpeľňa", desc: "Hygienická čistota" },
              { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop", title: "Fasáda", desc: "Odolná voči počasiu" },
              { img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000&auto=format&fit=crop", title: "Kuchyňa", desc: "Srdce domova" },
            ].map((item, idx) => (
              <div key={idx} className="h-[500px] relative rounded-3xl overflow-hidden group cursor-pointer">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 p-8">
                  <p className="text-brand-gold text-xs uppercase tracking-widest mb-2">{item.desc}</p>
                  <h3 className="text-xl md:text-2xl font-sans font-bold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-[#F9F9F7] text-center">
        <div className="container mx-auto px-6">
           <TextReveal variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-8 justify-center tracking-tight">
             Pripravený na zmenu?
           </TextReveal>
           <p className="text-lg text-gray-500 font-light mb-12 max-w-2xl mx-auto">
             Dotknite sa budúcnosti. Vyžiadajte si vzorku alebo nezáväznú cenovú ponuku ešte dnes.
           </p>
           <div className="flex flex-col sm:flex-row gap-6 justify-center flex-wrap">
             <Link to="/kontakt?openWizard=true">
               <Button size="lg" className="bg-brand-dark text-white px-10 py-8 text-lg rounded-full hover:bg-brand-gold hover:text-brand-dark transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                 Vytvoriť cenovú ponuku
               </Button>
             </Link>
             <Link to="/kolekcie">
               <Button variant="outline" size="lg" className="border-brand-dark text-brand-dark px-10 py-8 text-lg rounded-full hover:bg-brand-dark hover:text-white transition-all">
                 Prezrieť kolekcie
               </Button>
             </Link>
             <Link to="/sinterovany-kamen">
               <Button variant="outline" size="lg" className="border-brand-gold text-brand-gold px-10 py-8 text-lg rounded-full hover:bg-brand-gold hover:text-brand-dark transition-all">
                 Čo je sinterovaný kameň?
               </Button>
             </Link>
           </div>
        </div>
      </section>

    </main>
  );
};
