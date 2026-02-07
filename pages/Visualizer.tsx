import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  Upload, Wand2, ArrowRight, Check, X, RefreshCw, ChevronDown,
  Sparkles, Eye, Zap, Layers, Camera, Palette, MonitorSmartphone,
  Clock, Image as ImageIcon
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card, CardContent } from '@/components/UI/Card';
import { PRODUCTS } from '../constants';
import { visualizeKitchen } from '../services/nanoBanana';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

type WizardStep = 'upload' | 'select-stone' | 'processing' | 'result';

// Benefits data
const VISUALIZER_BENEFITS = [
  {
    icon: Zap,
    title: 'Okamžitý náhľad',
    description: 'Výsledok do niekoľkých sekúnd vďaka AI technológii'
  },
  {
    icon: MonitorSmartphone,
    title: 'Bez návštevy',
    description: 'Vizualizujte z pohodlia domova, kedykoľvek'
  },
  {
    icon: Eye,
    title: 'Realistický výsledok',
    description: 'Presná simulácia textúr a osvetlenia'
  },
  {
    icon: Layers,
    title: 'Všetky materiály',
    description: 'Kompletná knižnica našich prémiových kameňov'
  }
];

// How it works steps
const HOW_IT_WORKS = [
  {
    number: '01',
    icon: Camera,
    title: 'Nahrajte fotku',
    description: 'Odfoťte svoju kuchyňu alebo nahrajte existujúcu fotku. Pre najlepší výsledok použite dobre osvetlený záber.'
  },
  {
    number: '02',
    icon: Palette,
    title: 'Vyberte materiál',
    description: 'Prechádzajte našou kolekciou prémiových kameňov a vyberte ten, ktorý vás zaujal.'
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Užite si výsledok',
    description: 'Naša AI technológia aplikuje vybraný materiál na vašu kuchyňu v realistickom zobrazení.'
  }
];

// Showcase gallery - example visualizations
const SHOWCASE_GALLERY = [
  {
    id: 1,
    before: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
    material: 'Calacatta Gold',
    location: 'Bratislava'
  },
  {
    id: 2,
    before: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=800&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
    material: 'Nero Marquina',
    location: 'Košice'
  },
  {
    id: 3,
    before: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=800&auto=format&fit=crop',
    material: 'Statuario',
    location: 'Žilina'
  }
];

export const Visualizer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wizard state
  const [step, setStep] = useState<WizardStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStone, setSelectedStone] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Scroll to visualizer
  const scrollToVisualizer = () => {
    visualizerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setStep('select-stone');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setStep('select-stone');
    }
  };

  const startVisualization = async () => {
    if (!selectedFile || !selectedStone) return;

    setStep('processing');
    try {
      const result = await visualizeKitchen(selectedFile, selectedStone);
      setResultUrl(result.processedUrl);
      setStep('result');
    } catch (error) {
      console.error("Visualization failed", error);
      setStep('select-stone');
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedStone(null);
    setResultUrl(null);
    setStep('upload');
  };

  const getStoneDetails = (id: string) => PRODUCTS.find(p => p.id === id);

  useGSAP(() => {
    // Hero Animation
    const heroTl = gsap.timeline();
    
    heroTl.fromTo('.viz-hero-bg',
      { scale: 1.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.5, ease: 'power2.out' }
    );

    heroTl.fromTo('.viz-hero-text',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out' },
      '-=1.5'
    );

    // Hero Parallax
    gsap.to('.viz-hero-bg', {
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
    gsap.utils.toArray('.viz-benefit-card').forEach((card: any, i) => {
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

    // How it works animation
    gsap.utils.toArray('.how-step').forEach((step: any, i) => {
      const direction = i % 2 === 0 ? -50 : 50;
      gsap.fromTo(step,
        { opacity: 0, x: direction },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Visualizer section reveal
    gsap.fromTo('.visualizer-container',
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.visualizer-container',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Showcase gallery stagger
    gsap.utils.toArray('.showcase-card').forEach((card: any, i) => {
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

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="overflow-hidden w-full bg-white">

      {/* ==================== HERO SECTION ==================== */}
      <section ref={heroRef} className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 viz-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2500&auto=format&fit=crop"
            alt="Visualizer Hero"
            className="w-full h-full object-cover brightness-[0.35]"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <span className="viz-hero-text font-sans font-bold text-xs tracking-widest uppercase text-brand-gold mb-6 block">
            AI Vizualizátor
          </span>
          <h1 className="viz-hero-text text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-normal leading-[1] mb-8">
            Vizualizujte<br/>
            <span className="italic text-brand-gold font-light">svoj sen.</span>
          </h1>
          <p className="viz-hero-text font-sans font-light text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12">
            Nahrajte fotku vašej kuchyne a uvidíte, ako bude vyzerať s naším prémiovým kameňom. Poháňané AI technológiou.
          </p>

          <button 
            onClick={scrollToVisualizer}
            className="viz-hero-text inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-10 py-5 rounded-full font-medium hover:bg-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Vyskúšať teraz
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
          <div className="text-center mb-12">
            <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">Prečo vizualizátor</span>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark">Výhody AI vizualizácie</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VISUALIZER_BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="viz-benefit-card p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon size={32} className="text-brand-gold mb-4" />
                  <h3 className="text-lg font-sans font-bold text-brand-dark mb-2">{benefit.title}</h3>
                  <p className="font-sans font-light text-gray-500 text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS SECTION ==================== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">Ako to funguje</span>
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-brand-dark">Tri jednoduché kroky</h2>
          </div>

          <div className="max-w-5xl mx-auto space-y-16">
            {HOW_IT_WORKS.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index}
                  className={cn(
                    "how-step flex flex-col md:flex-row items-center gap-8 md:gap-16",
                    !isEven && "md:flex-row-reverse"
                  )}
                >
                  {/* Visual */}
                  <div className="w-full md:w-1/2">
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 rounded-3xl overflow-hidden flex items-center justify-center">
                      <div className="absolute top-6 left-6 text-7xl font-sans text-brand-gold/20 font-bold">
                        {item.number}
                      </div>
                      <Icon size={80} className="text-brand-gold/60" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-1/2 text-center md:text-left">
                    <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-2 block">
                      Krok {item.number}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-sans font-bold text-brand-dark mb-4">
                      {item.title}
                    </h3>
                    <p className="font-sans font-light text-gray-500 text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== VISUALIZER SECTION ==================== */}
      <section ref={visualizerRef} className="py-24 bg-brand-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">Začnite teraz</span>
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-4">Vizualizátor</h2>
            <p className="font-sans font-light text-gray-400 text-base max-w-xl mx-auto">
              Nahrajte fotku, vyberte materiál a uvidíte výsledok v reálnom čase.
            </p>
          </div>

          <div className="visualizer-container max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Progress indicator */}
            <div className="bg-gray-50 px-8 py-4 border-b border-gray-100">
              <div className="flex items-center justify-center gap-4">
                {['Nahrať', 'Vybrať', 'Výsledok'].map((label, i) => {
                  const stepIndex = i + 1;
                  const isActive = 
                    (step === 'upload' && stepIndex === 1) ||
                    (step === 'select-stone' && stepIndex === 2) ||
                    (step === 'processing' && stepIndex === 3) ||
                    (step === 'result' && stepIndex === 3);
                  const isCompleted = 
                    (step === 'select-stone' && stepIndex === 1) ||
                    (step === 'processing' && stepIndex <= 2) ||
                    (step === 'result' && stepIndex <= 2);
                  
                  return (
                    <React.Fragment key={i}>
                      {i > 0 && (
                        <div className={cn(
                          "h-0.5 w-12 transition-colors",
                          isCompleted ? "bg-brand-gold" : "bg-gray-200"
                        )} />
                      )}
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                          isActive ? "bg-brand-gold text-brand-dark" :
                          isCompleted ? "bg-brand-gold text-brand-dark" : "bg-gray-200 text-gray-500"
                        )}>
                          {isCompleted ? <Check size={16} /> : stepIndex}
                        </div>
                        <span className={cn(
                          "text-sm font-medium hidden sm:block",
                          isActive ? "text-brand-dark" : "text-gray-400"
                        )}>
                          {label}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* STEP 1: UPLOAD */}
            {step === 'upload' && (
              <div
                className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed border-gray-200 m-6 rounded-2xl hover:border-brand-gold/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-24 h-24 bg-brand-gold/10 rounded-full flex items-center justify-center mb-6">
                  <Upload className="text-brand-gold" size={40} />
                </div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Nahrajte fotku kuchyne</h2>
                <p className="font-sans font-light text-gray-500 mb-8 text-center max-w-md text-base">
                  Presuňte sem fotku alebo kliknite pre výber. Pre najlepší výsledok použite dobre osvetlenú fotku.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <Button variant="primary" className="px-8 py-4 rounded-full">
                  Vybrať súbor
                </Button>
              </div>
            )}

            {/* STEP 2: SELECT STONE */}
            {step === 'select-stone' && (
              <div className="flex flex-col min-h-[500px]">
                <div className="flex-1 p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                  {/* Left: Preview */}
                  <div className="w-full lg:w-1/2 flex flex-col">
                    <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Vaša fotka</h3>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-inner flex-1">
                      {previewUrl && (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      )}
                      <button
                        onClick={reset}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white text-gray-600 transition-colors shadow-lg"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Right: Selection */}
                  <div className="w-full lg:w-1/2 flex flex-col">
                    <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Vyberte kameň</h3>
                    <div className="flex-1 overflow-y-auto pr-2 -mr-2 max-h-[350px]">
                      <div className="grid grid-cols-2 gap-3">
                        {PRODUCTS.map(product => (
                          <div
                            key={product.id}
                            onClick={() => setSelectedStone(product.id)}
                            className={cn(
                              "cursor-pointer group relative rounded-xl overflow-hidden border-2 transition-all",
                              selectedStone === product.id 
                                ? 'border-brand-gold ring-2 ring-brand-gold/20' 
                                : 'border-transparent hover:border-gray-200'
                            )}
                          >
                            <div className="aspect-square">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                              <p className="text-white font-medium text-sm">{product.name}</p>
                            </div>
                            {selectedStone === product.id && (
                              <div className="absolute top-2 right-2 bg-brand-gold text-white rounded-full p-1">
                                <Check size={16} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <div className="font-sans font-light text-sm text-gray-500">
                    {selectedStone ? (
                      <span>Vybrané: <strong className="font-bold text-brand-dark">{getStoneDetails(selectedStone)?.name}</strong></span>
                    ) : (
                      <span>Zvoľte materiál pre pokračovanie</span>
                    )}
                  </div>
                  <Button
                    variant="primary"
                    disabled={!selectedStone}
                    onClick={startVisualization}
                    className="flex items-center gap-2 rounded-full px-6"
                  >
                    Vizualizovať <Wand2 size={18} />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: PROCESSING */}
            {step === 'processing' && (
              <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                  <Wand2 className="absolute inset-0 m-auto text-brand-gold animate-pulse" size={32} />
                </div>
                <h2 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Analyzujeme vašu kuchyňu...</h2>
                <p className="font-sans font-light text-gray-500 text-base">AI aplikuje vybraný materiál na textúry.</p>
              </div>
            )}

            {/* STEP 4: RESULT */}
            {step === 'result' && (
              <div className="flex flex-col min-h-[500px]">
                <div className="p-6 flex-1 relative">
                  <div className="w-full h-full min-h-[350px] bg-gray-900 rounded-2xl overflow-hidden relative group">
                    <img src={resultUrl!} alt="Result" className="w-full h-full object-contain" />

                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-white/10">
                      <Wand2 size={16} className="text-brand-gold" />
                      {getStoneDetails(selectedStone!)?.name} aplikovaný
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <Button variant="outline" onClick={reset} className="flex items-center gap-2 rounded-full">
                    <RefreshCw size={18} /> Skúsiť inú fotku
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep('select-stone')} className="rounded-full">
                      Zmeniť kameň
                    </Button>
                    <Link to="/kontakt">
                      <Button variant="primary" className="rounded-full">
                        Mám záujem
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== SHOWCASE SECTION ==================== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">Inšpirácie</span>
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-brand-dark mb-4">Ukážky vizualizácií</h2>
            <p className="font-sans font-light text-gray-500 text-base max-w-xl mx-auto">
              Pozrite sa, ako naši klienti vizualizovali svoje kuchyne pred realizáciou.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SHOWCASE_GALLERY.map((item) => (
              <Card 
                key={item.id}
                className="showcase-card group overflow-hidden border-0 shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.after}
                    alt={item.material}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-lg font-sans font-bold">{item.material}</p>
                    <p className="font-sans font-light text-sm text-white/70">{item.location}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-brand-gold text-brand-dark px-3 py-1 rounded-full font-sans font-bold text-xs">
                    AI Vizualizácia
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-32 bg-brand-dark text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2500&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale" 
            alt="texture" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark opacity-80" />

        <div className="container mx-auto px-6 relative z-10">
          <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-6 block">Máte otázky?</span>
          <h2 className="text-4xl md:text-5xl font-sans font-bold mb-8">
            Pomôžeme vám s výberom
          </h2>
          <p className="font-sans font-light text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Neviete si rady s výberom materiálu? Naši konzultanti vám radi pomôžu nájsť ideálne riešenie pre váš priestor.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/kontakt">
              <Button size="lg" className="bg-brand-gold text-brand-dark px-12 py-8 text-lg rounded-full hover:bg-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                Kontaktovať nás
              </Button>
            </Link>
            <Link to="/kolekcie">
              <Button variant="outline" size="lg" className="border-white/30 text-white px-12 py-8 text-lg rounded-full hover:bg-white hover:text-brand-dark transition-all">
                Prezerať kolekcie
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
