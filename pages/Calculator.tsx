import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  ChevronRight, ChevronLeft, ChevronDown, Calculator as CalcIcon, 
  Ruler, Palette, Settings, FileText, CheckCircle, Clock, Euro,
  ShieldCheck, Sparkles
} from 'lucide-react';
import { Step1Shape } from '../components/Calculator/Step1Shape';
import { Step2Material } from '../components/Calculator/Step2Material';
import { Step3Details } from '../components/Calculator/Step3Details';
import { Step4Summary } from '../components/Calculator/Step4Summary';
import { PRICING, MATERIAL_TIERS } from '../pricing';
import { TextReveal } from '../components/UI/TextReveal';
import { Button } from '../components/UI/Button';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

// Step icons mapping
const STEP_ICONS = [Ruler, Palette, Settings, FileText];
const STEP_TITLES = ['Tvar & Rozmery', 'Materiál', 'Detaily', 'Súhrn'];
const STEP_DESCRIPTIONS = [
  'Vyberte tvar a zadajte rozmery vašej pracovnej dosky',
  'Vyberte si z našej ponuky prémiových materiálov',
  'Nastavte hrúbku, drez, varnú dosku a zástenu',
  'Skontrolujte súhrn a odošlite dopyt'
];

// Benefits data
const BENEFITS = [
  {
    icon: Clock,
    title: 'Okamžitý odhad',
    description: 'Získajte orientačnú cenu do 2 minút'
  },
  {
    icon: Euro,
    title: 'Transparentné ceny',
    description: 'Žiadne skryté poplatky ani prekvapenia'
  },
  {
    icon: ShieldCheck,
    title: 'Nezáväzne',
    description: 'Kalkulácia vás k ničomu nezaväzuje'
  },
  {
    icon: Sparkles,
    title: 'Presné meranie',
    description: 'Finálnu cenu upresníme po zameraní'
  }
];

export const Calculator = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [nextDisabled, setNextDisabled] = useState(true);

  // State for Step 1
  const [shape, setShape] = useState<'straight' | 'l-shape' | 'u-shape' | 'island'>('straight');
  const [dimensions, setDimensions] = useState({ a: 0, b: 0, c: 0, depth: 60 });

  // State for Step 2
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  // State for Step 3
  const [details, setDetails] = useState<{
    thickness: '12mm' | '20mm';
    sinkType: 'none' | 'top' | 'flush' | 'undermount';
    hobType: 'none' | 'top' | 'flush';
    backsplash: boolean;
    backsplashHeight: number;
  }>({
    thickness: '12mm',
    sinkType: 'none',
    hobType: 'none',
    backsplash: false,
    backsplashHeight: 60
  });

  // Validation effect
  useEffect(() => {
    if (step === 1) {
      const isValid = dimensions.a > 0 && dimensions.depth > 0 &&
        (shape !== 'l-shape' || dimensions.b > 0) &&
        (shape !== 'u-shape' || (dimensions.b > 0 && (dimensions.c || 0) > 0));
      setNextDisabled(!isValid);
    } else if (step === 2) {
      setNextDisabled(!selectedMaterial);
    } else if (step === 3) {
      setNextDisabled(false);
    }
  }, [step, shape, dimensions, selectedMaterial]);

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  // Scroll to calculator when starting
  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useGSAP(() => {
    // Hero Animation
    const heroTl = gsap.timeline();
    
    heroTl.fromTo('.calc-hero-bg',
      { scale: 1.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.5, ease: 'power2.out' }
    );

    heroTl.fromTo('.calc-hero-text',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out' },
      '-=1.5'
    );

    // Hero Parallax
    gsap.to('.calc-hero-bg', {
      y: 150,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Benefits stagger
    gsap.utils.toArray('.benefit-card').forEach((card: any, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Calculator section reveal
    gsap.fromTo('.calculator-container',
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.calculator-container',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Step change animation
    gsap.fromTo('.step-content',
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );

  }, { scope: containerRef, dependencies: [step] });

  return (
    <main ref={containerRef} className="overflow-hidden w-full bg-white">

      {/* ==================== HERO SECTION ==================== */}
      <section ref={heroRef} className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 calc-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2500&auto=format&fit=crop"
            alt="Calculator Hero"
            className="w-full h-full object-cover brightness-[0.35]"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <span className="calc-hero-text font-sans text-xs font-bold tracking-widest uppercase text-brand-gold mb-6 block">
            Online Kalkulačka
          </span>
          <h1 className="calc-hero-text text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-normal leading-[1] mb-8">
            Zistite cenu vašej<br/>pracovnej dosky.
          </h1>
          <p className="calc-hero-text font-sans font-light text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12">
            Jednoduchý nástroj pre okamžitý odhad ceny. 4 kroky, 2 minúty, nezáväzne.
          </p>
          <button 
            onClick={scrollToCalculator}
            className="calc-hero-text inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-10 py-5 rounded-full font-medium hover:bg-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Začať kalkuláciu
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 z-10">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <ChevronDown size={28} />
          </div>
        </div>
      </section>

      {/* ==================== BENEFITS SECTION ==================== */}
      <section className="py-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="benefit-card p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon size={32} className="text-brand-gold mb-4" />
                  <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">{benefit.title}</h3>
                  <p className="text-gray-500 text-base font-light">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== CALCULATOR SECTION ==================== */}
      <section ref={calculatorRef} className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="calculator-container max-w-5xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-16">
              <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">Krok {step} z 4</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-4">
                {STEP_TITLES[step - 1]}
              </h2>
              <p className="text-gray-500 text-lg font-light">
                {STEP_DESCRIPTIONS[step - 1]}
              </p>
            </div>

            {/* Progress Steps - Visual */}
            <div className="flex justify-between mb-12 relative max-w-2xl mx-auto">
              {/* Progress line background */}
              <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200" />
              {/* Progress line active */}
              <div 
                className="absolute top-6 left-0 h-0.5 bg-brand-gold transition-all duration-500"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
              
              {[1, 2, 3, 4].map(num => {
                const Icon = STEP_ICONS[num - 1];
                return (
                  <div key={num} className="relative z-10 flex flex-col items-center">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg",
                        step >= num 
                          ? 'bg-brand-gold text-brand-dark' 
                          : 'bg-white text-gray-400 border-2 border-gray-200'
                      )}
                    >
                      {step > num ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs mt-3 font-medium transition-colors",
                      step >= num ? 'text-brand-dark' : 'text-gray-400'
                    )}>
                      {STEP_TITLES[num - 1].split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
            <div className="step-content bg-[#F9F9F7] p-8 md:p-12 rounded-3xl shadow-xl mb-10">
              {step === 1 && (
                <Step1Shape
                  shape={shape}
                  setShape={setShape}
                  dimensions={dimensions}
                  setDimensions={setDimensions}
                  setNextDisabled={setNextDisabled}
                />
              )}
              {step === 2 && (
                <Step2Material
                  selectedMaterial={selectedMaterial}
                  setSelectedMaterial={setSelectedMaterial}
                  setNextDisabled={setNextDisabled}
                />
              )}
              {step === 3 && (
                <Step3Details
                  details={details}
                  setDetails={setDetails}
                  setNextDisabled={setNextDisabled}
                />
              )}
              {step === 4 && (
                <Step4Summary
                  shape={shape}
                  dimensions={dimensions}
                  selectedMaterial={selectedMaterial}
                  details={details}
                  onBack={handlePrev}
                />
              )}
            </div>

            {/* Navigation Controls */}
            {step < 4 && (
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrev}
                  disabled={step === 1}
                  className={cn(
                    "flex items-center gap-2 px-8 py-4 rounded-full border-2 border-gray-200 font-medium transition-all",
                    step === 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-100 hover:border-gray-300'
                  )}
                >
                  <ChevronLeft size={20} /> Späť
                </button>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="hidden md:inline">Krok</span>
                  <span className="font-bold text-brand-dark">{step}</span>
                  <span>z</span>
                  <span>4</span>
                </div>

                <button
                  onClick={handleNext}
                  disabled={nextDisabled}
                  className={cn(
                    "flex items-center gap-2 px-10 py-4 bg-brand-dark text-white rounded-full font-medium transition-all",
                    nextDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-brand-gold hover:text-brand-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                  )}
                >
                  Ďalej <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== INFO SECTION ==================== */}
      <section className="py-24 bg-brand-dark text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-6 block">Ako to funguje</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-12">
              Od kalkulácie k realizácii
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-brand-gold text-4xl font-sans font-bold mb-4 block">01</span>
                <h3 className="text-xl md:text-2xl font-sans font-bold mb-3">Online kalkulácia</h3>
                <p className="text-gray-400 font-light text-base leading-relaxed">
                  Vyplňte tento formulár a získajte orientačnú cenu okamžite. Nezáväzne a zadarmo.
                </p>
              </div>
              <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-brand-gold text-4xl font-sans font-bold mb-4 block">02</span>
                <h3 className="text-xl md:text-2xl font-sans font-bold mb-3">Konzultácia</h3>
                <p className="text-gray-400 font-light text-base leading-relaxed">
                  Náš špecialista vás bude kontaktovať pre upresnenie detailov a dohodnutie termínu.
                </p>
              </div>
              <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-brand-gold text-4xl font-sans font-bold mb-4 block">03</span>
                <h3 className="text-xl md:text-2xl font-sans font-bold mb-3">Presné zameranie</h3>
                <p className="text-gray-400 font-light text-base leading-relaxed">
                  Prídeme k vám, zameráme priestor laserom a pripravíme finálnu cenovú ponuku.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6">
            Potrebujete pomoc s kalkuláciou?
          </h2>
          <p className="text-gray-500 text-lg font-light mb-8 max-w-xl mx-auto">
            Neviete si rady? Kontaktujte nás a radi vám pomôžeme s výberom materiálu aj s výpočtom ceny.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+421900000000">
              <Button variant="outline" className="border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white px-8 py-4 rounded-full">
                Zavolajte nám
              </Button>
            </a>
            <a href="/kontakt">
              <Button className="bg-brand-gold text-brand-dark hover:bg-brand-dark hover:text-white px-8 py-4 rounded-full">
                Napíšte nám
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};
