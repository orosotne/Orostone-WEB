import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  ArrowRight, ShieldCheck, Sun, Droplets, ChevronDown, Play, Pause, 
  Volume2, VolumeX, ChevronLeft, ChevronRight, Star, Quote,
  Flame, Award, Users, X, Sparkles
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { COLLECTIONS, FAQS, TESTIMONIALS, SHOP_PRODUCTS, REALIZATIONS } from '../constants';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Home as HomeIcon, Ruler, Truck, CreditCard, Clock, 
  MessageSquare, ShoppingBag, FileText, CheckCircle2
} from 'lucide-react';
import { Marquee } from '../components/UI/Marquee';
import { TextReveal } from '../components/UI/TextReveal';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

// Brand story slides
const BRAND_STORY = [
  {
    id: 'tradition',
    label: '01. Tradícia',
    title: 'Tisíce rokov histórie',
    text: 'Kameň sprevádzal ľudstvo od úsvitu civilizácie. Od pyramíd po renesančné paláce - vždy symbolizoval trvácnosť a eleganciu.',
    image: '/images/home/hero-2.jpeg'
  },
  {
    id: 'innovation',
    label: '02. Inovácia',
    title: 'Technológia 21. storočia',
    text: 'Sinterovaný kameň vzniká pri 1200°C a tlaku 400 barov. Výsledkom je materiál tvrdší ako granit, odolnejší ako mramor.',
    image: '/images/home/hero-3.jpeg'
  },
  {
    id: 'future',
    label: '03. Budúcnosť',
    title: 'Vaša vízia, náš materiál',
    text: 'Od výberu dekoru po dodanie materiálu. Montáž zabezpečí váš realizátor – radi vám odporučíme overených odborníkov.',
    image: '/images/home/hero-4.jpeg'
  }
];

// Benefits data for Bento grid
const BENEFITS = [
  { 
    icon: ShieldCheck, 
    title: 'Vysoká odolnosť', 
    desc: 'Tvrdosť 7/10 na Mohsovej stupnici. Odolá poškriabaniu nožom pri správnej manipulácii a montáži.',
    size: 'large'
  },
  { 
    icon: Flame, 
    title: 'Tepelná stabilita', 
    desc: 'Odoláva teplotám až do 300°C bez zmeny farby či štruktúry.',
    size: 'small'
  },
  { 
    icon: Sun, 
    title: 'UV stabilita', 
    desc: 'Farba zostáva stála aj po rokoch na priamom slnku.',
    size: 'small'
  },
  { 
    icon: Droplets, 
    title: 'Nulová nasiakavosť', 
    desc: 'Neabsorbuje tekutiny, kyseliny ani mastnotu. Maximálne hygienický povrch.',
    size: 'medium'
  },
  { 
    icon: Award, 
    title: '24 mesiacov záruka', 
    desc: 'Záruka na materiál v súlade s VOP.',
    size: 'medium'
  }
];

export const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Testimonials carousel state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Brand Story active slide
  const [activeStorySlide, setActiveStorySlide] = useState(0);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Hero CTA Modal state
  const [isCtaModalOpen, setIsCtaModalOpen] = useState(false);
  const ctaModalRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCtaModalOpen) {
        setIsCtaModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isCtaModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isCtaModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCtaModalOpen]);

  // GSAP animation for CTA modal
  useEffect(() => {
    if (isCtaModalOpen && ctaModalRef.current) {
      const ctx = gsap.context(() => {
        // Backdrop fade in
        gsap.fromTo('.cta-modal-backdrop',
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out' }
        );

        // Close button
        gsap.fromTo('.cta-modal-close',
          { opacity: 0, rotate: -90 },
          { opacity: 1, rotate: 0, duration: 0.5, delay: 0.3, ease: 'back.out(1.7)' }
        );

        // Header animation
        gsap.fromTo('.cta-modal-header',
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
        );

        // Cards stagger animation
        gsap.fromTo('.cta-modal-card',
          { opacity: 0, y: 50, scale: 0.95 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.7, 
            stagger: 0.15, 
            delay: 0.35, 
            ease: 'power3.out' 
          }
        );

        // Hint text
        gsap.fromTo('.cta-modal-hint',
          { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 0.8, ease: 'power2.out' }
        );
      }, ctaModalRef);

      return () => ctx.revert();
    }
  }, [isCtaModalOpen]);

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Testimonials navigation
  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    // Hero Animation Timeline
    const heroTl = gsap.timeline();
    
    // Hero image reveal
    heroTl.fromTo('.hero-bg-image',
      { scale: 1.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.5, ease: 'power2.out' }
    );

    // Hero text stagger
    heroTl.fromTo('.hero-text-line',
      { opacity: 0, y: 80, skewY: 3 },
      { opacity: 1, y: 0, skewY: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out' },
      '-=1.5'
    );

    // Hero subtitle and buttons
    heroTl.fromTo('.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
      '-=0.5'
    );

    heroTl.fromTo('.hero-buttons',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    );

    // Hero Parallax
    gsap.to('.hero-bg-image', {
      y: 200,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Brand Story Pinning
    const storyTl = gsap.timeline({
      scrollTrigger: {
        trigger: storyRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        snap: 0.33,
        onUpdate: (self) => {
          // Calculate active slide based on progress
          const progress = self.progress;
          if (progress < 0.33) {
            setActiveStorySlide(0);
          } else if (progress < 0.66) {
            setActiveStorySlide(1);
          } else {
            setActiveStorySlide(2);
          }
        }
      }
    });

    storyTl
      .to('.story-slide-0', { opacity: 0, scale: 0.95, duration: 1 })
      .fromTo('.story-slide-1', { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1 })
      .to('.story-slide-1', { opacity: 0, scale: 0.95, duration: 1 })
      .fromTo('.story-slide-2', { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1 });

    // Video section scroll-triggered play/pause
    ScrollTrigger.create({
      trigger: '.video-section',
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        if (videoRef.current) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      },
      onLeave: () => {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      onEnterBack: () => {
        if (videoRef.current) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      },
      onLeaveBack: () => {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    });

    // Video parallax text
    gsap.to('.video-overlay-text', {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.video-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // Benefits Bento Grid reveal
    gsap.utils.toArray('.benefit-card').forEach((card: any, i) => {
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

    // Collections section reveal animation
    gsap.utils.toArray('.collections-grid-item').forEach((item: any, i) => {
      gsap.fromTo(item,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Timeline section - progressive activation
    const timelineSteps = gsap.utils.toArray('.home-timeline-step');
    timelineSteps.forEach((step: any, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 60%',
        onEnter: () => setActiveStep(i),
        onLeaveBack: () => setActiveStep(Math.max(0, i - 1))
      });

      gsap.fromTo(step,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: step,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Testimonials reveal
    gsap.fromTo('.testimonials-section',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // FAQ items stagger
    gsap.utils.toArray('.faq-item').forEach((item: any, i) => {
      gsap.fromTo(item,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // CTA parallax
    gsap.to('.cta-bg', {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // CTA text reveal
    gsap.fromTo('.cta-text',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="overflow-hidden w-full">
      
      {/* ==================== HERO SECTION ==================== */}
      <section ref={heroRef} className="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden bg-brand-dark">
        
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="hero-bg-image absolute -inset-[10%] w-[120%] h-[120%]">
            <img
              src="/images/home/hero-1.jpeg"
              alt="Luxury Stone Kitchen"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10 text-center text-white mt-10">
          <div className="mb-8 flex flex-col items-center">
            <div className="overflow-hidden">
              <h1 className="hero-text-line text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-normal leading-[1] text-white">
                Krása kameňa.
              </h1>
            </div>
            <div className="mt-2 md:mt-3">
              <h1 className="hero-text-line text-5xl md:text-6xl lg:text-7xl font-sans font-light italic text-brand-gold tracking-normal leading-[1] pb-4">
                Sila technológie.
              </h1>
            </div>
          </div>

          <p className="hero-subtitle font-sans font-light text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-14 leading-relaxed">
            Sinterovaný kameň pre prémiové kuchyne, fasády a interiéry.
            <br className="hidden md:block" />
            Dizajn, ktorý pretrvá generácie.
          </p>

          {/* Minimalistic CTA Button */}
          <div className="hero-buttons">
            <button
              onClick={() => setIsCtaModalOpen(true)}
              className="group inline-flex items-center gap-3 text-white/90 hover:text-white transition-all duration-300"
            >
              <span className="text-lg md:text-xl font-light tracking-wide border-b border-white/30 group-hover:border-brand-gold pb-1 transition-colors">
                Objavte možnosti
              </span>
              <Sparkles size={20} className="text-brand-gold opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator - Centered at bottom */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 z-10">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="font-sans text-xs tracking-widest uppercase">Scroll</span>
            <ChevronDown size={28} />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <Marquee />

      {/* ==================== SKLADOM TERAZ SECTION ==================== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <span className="font-sans text-xs font-bold text-green-600 tracking-widest uppercase mb-3 block flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Skladom teraz
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark">Expedícia do 5 dní</h2>
            </div>
            <Link to="/shop" className="group flex items-center text-sm font-medium text-brand-dark hover:text-brand-gold transition-colors">
              <span className="border-b border-gray-300 group-hover:border-brand-gold pb-1">Všetky skladové platne</span>
              <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SHOP_PRODUCTS.slice(0, 4).map((product) => (
              <Link 
                key={product.id} 
                to="/shop"
                className="group bg-[#F9F9F7] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Skladom
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-sans font-semibold text-brand-dark mb-1 group-hover:text-brand-gold transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-brand-dark">€{product.pricePerM2}</span>
                    <span className="text-sm text-gray-500">/ m²</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-500 text-sm mb-4">
              Cenová kotva: <span className="font-semibold text-brand-dark">od €{Math.min(...SHOP_PRODUCTS.map(p => p.pricePerM2))}/m²</span> | 
              Cenu ovplyvňuje hrúbka, povrch a dekor
            </p>
          </div>
        </div>
      </section>

      {/* ==================== DVE CESTY SECTION ==================== */}
      <section className="py-24 bg-[#121212] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">Ako nakúpiť</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-4">Dve cesty k Orostone</h2>
            <p className="text-gray-400 font-light max-w-2xl mx-auto">
              Vyberte si podľa vašich potrieb – rýchly nákup skladom alebo projekt na mieru.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* E-shop Path */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-green-500/50 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <ShoppingBag size={28} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">E-shop</h3>
                  <p className="text-green-400 text-sm font-medium">Rýchla expedícia</p>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Iba <strong className="text-white">skladové platne</strong> bez rezania a úprav</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Dodanie spravidla <strong className="text-white">5 pracovných dní</strong> po úhrade</span>
                </li>
                <li className="flex items-start gap-3">
                  <CreditCard size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Platba <strong className="text-white">prevodom alebo kartou</strong> (bez dobierky)</span>
                </li>
                <li className="flex items-start gap-3">
                  <FileText size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Vrátenie do <strong className="text-white">14 dní</strong> (spotrebitelia)</span>
                </li>
              </ul>

              <Link to="/shop">
                <Button className="w-full bg-green-500 hover:bg-green-400 text-white py-4 rounded-xl font-semibold">
                  Nakúpiť skladom
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>

            {/* Project Path */}
            <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-3xl p-8 hover:border-brand-gold/50 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-brand-gold/20 rounded-2xl flex items-center justify-center">
                  <Ruler size={28} className="text-brand-gold" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Projekt na mieru</h3>
                  <p className="text-brand-gold text-sm font-medium">Individuálna objednávka</p>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300"><strong className="text-white">CNC rezanie na mieru</strong> s presnosťou 0.1mm</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={20} className="text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Dodanie <strong className="text-white">15-20 pracovných dní</strong> po zálohe</span>
                </li>
                <li className="flex items-start gap-3">
                  <CreditCard size={20} className="text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300"><strong className="text-white">Zálohová faktúra</strong> + doplatok pred expedíciou</span>
                </li>
                <li className="flex items-start gap-3">
                  <MessageSquare size={20} className="text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Odporúčame <strong className="text-white">externých realizátorov</strong> na montáž</span>
                </li>
              </ul>

              <Link to="/kontakt?openWizard=true">
                <Button className="w-full bg-brand-gold hover:bg-white text-brand-dark py-4 rounded-xl font-semibold">
                  Nezáväzný dopyt
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400">⚠️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Dôležité informácie</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• <strong className="text-gray-300">Montáž nie je súčasťou dodávky</strong> – radi vám odporučíme overených realizátorov</li>
                    <li>• <strong className="text-gray-300">Záruka 24 mesiacov</strong> na materiál (vady z montáže nie sú kryté)</li>
                    <li>• <strong className="text-gray-300">Reklamácie emailom</strong> s fotodokumentáciou na info@orostone.sk</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRE KOHO JE OROSTONE SECTION ==================== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">Pre koho</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-4">Orostone pre vašu profesiu</h2>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">
              Či ste architekt, realizátor alebo majiteľ domu – máme riešenie pre vás.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Architect */}
            <div className="group bg-[#F9F9F7] rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-gold/20">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-gold/20 transition-colors">
                <Briefcase size={32} className="text-brand-gold" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-3">Architekt</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Technické špecifikácie, TDS dokumenty a Key Facts pre vaše projekty. Vzorky na vyžiadanie.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-brand-gold" />
                  <span>Technické dokumenty</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-brand-gold" />
                  <span>Vzorky dekorov</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-brand-gold" />
                  <span>Konzultácia projektu</span>
                </div>
              </div>
              <Link to="/key-facts" className="inline-flex items-center text-brand-gold font-medium hover:underline">
                Key Facts & TDS
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Realizátor */}
            <div className="group bg-[#F9F9F7] rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-gold/20">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-gold/20 transition-colors">
                <Ruler size={32} className="text-brand-gold" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-3">Realizátor</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Materiál pripravený na montáž. Technický manuál a podpora pri spracovaní. Spolupráca na projektoch.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-brand-gold" />
                  <span>Technický manuál</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-brand-gold" />
                  <span>CNC rezanie na mieru</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-brand-gold" />
                  <span>Partnerský program</span>
                </div>
              </div>
              <Link to="/kontakt" className="inline-flex items-center text-brand-gold font-medium hover:underline">
                Kontaktovať nás
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Majiteľ domu */}
            <div className="group bg-[#F9F9F7] rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-gold/20">
              <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-gold/20 transition-colors">
                <HomeIcon size={32} className="text-brand-gold" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark mb-3">Majiteľ domu</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Prémiový materiál pre vašu kuchyňu, kúpeľňu či fasádu. Nižšie náklady v čase vďaka životnosti.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-brand-gold" />
                  <span>E-shop skladom</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-brand-gold" />
                  <span>Projekty na mieru</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-brand-gold" />
                  <span>Odporúčanie realizátora</span>
                </div>
              </div>
              <Link to="/kolekcie" className="inline-flex items-center text-brand-gold font-medium hover:underline">
                Prehliadnuť kolekcie
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PREČO PREMIUM SECTION ==================== */}
      <section className="py-24 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">Investícia</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-4">Prečo zvoliť premium?</h2>
              <p className="text-gray-500 font-light">
                Orostone nie je náklad – je to investícia s návratnosťou v čase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center">
                    <Clock size={24} className="text-brand-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark">Životnosť desaťročia</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Sinterovaný kameň nebledne, neškrabká sa pri bežnom používaní a nevyžaduje výmenu ako lacnejšie alternatívy.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center">
                    <Droplets size={24} className="text-brand-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark">Minimálna údržba</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Nulová nasiakavosť = žiadne škvrny, žiadna impregnácia, žiadne špeciálne čistiace prostriedky.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center">
                    <Sun size={24} className="text-brand-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark">Stabilita farby</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  UV stabilný materiál – farba zostáva rovnaká aj po rokoch na priamom slnku (fasády, terasy).
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center">
                    <Award size={24} className="text-brand-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark">Nižšie náklady v čase</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Vyššia počiatočná investícia = nižšie celkové náklady. Bez výmen, opráv a špeciálnej údržby.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== REALIZÁCIE TEASER ==================== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-3 block">Inšpirácie</span>
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark">Reálne realizácie</h2>
            </div>
            <Link to="/realizacie" className="group flex items-center text-sm font-medium text-brand-dark hover:text-brand-gold transition-colors">
              <span className="border-b border-gray-300 group-hover:border-brand-gold pb-1">Všetky projekty</span>
              <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REALIZATIONS.slice(0, 3).map((real) => (
              <Link 
                key={real.id} 
                to="/realizacie"
                className="group relative h-[400px] rounded-2xl overflow-hidden"
              >
                <img 
                  src={real.image} 
                  alt={real.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="text-brand-gold text-xs uppercase tracking-widest mb-2 block">{real.category}</span>
                  <h3 className="text-xl font-bold text-white mb-1">{real.title}</h3>
                  <p className="text-gray-300 text-sm">{real.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== KONZULTÁCIA CTA ==================== */}
      <section className="py-16 bg-brand-gold">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">Potrebujete poradiť?</h2>
              <p className="text-brand-dark/70">Konzultácia zdarma • Odpoveď do 24 hodín</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/kontakt?openWizard=true">
                <Button className="bg-brand-dark text-white px-8 py-4 rounded-full hover:bg-black transition-colors">
                  Nezáväzný dopyt
                </Button>
              </Link>
              <Link to="/key-facts">
                <Button variant="outline" className="border-brand-dark text-brand-dark px-8 py-4 rounded-full hover:bg-brand-dark hover:text-white transition-colors">
                  Key Facts & Vzorky
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BRAND STORY SECTION ==================== */}
      <section ref={storyRef} className="h-screen w-full bg-black text-white relative overflow-hidden">

        {/* Slides */}
        {BRAND_STORY.map((slide, index) => (
          <div 
            key={slide.id}
            className={cn(
              "story-slide-" + index,
              "absolute inset-0 flex items-center justify-center",
              index !== 0 && "opacity-0"
            )}
          >
            <div className="absolute inset-0 z-0">
              <img src={slide.image} className="w-full h-full object-cover opacity-50" alt={slide.title} />
            </div>
            <div className="relative z-10 text-center max-w-4xl px-8 py-12 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10">
              <span className="font-sans text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">{slide.label}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6 leading-tight">{slide.title}</h2>
              <p className="font-sans font-light text-lg text-gray-400 leading-relaxed">{slide.text}</p>
            </div>
          </div>
        ))}

        {/* Progress Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {BRAND_STORY.map((_, index) => (
            <div 
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === activeStorySlide ? "bg-brand-gold" : "bg-white/30"
              )}
            />
          ))}
        </div>
      </section>

      {/* ==================== VIDEO SHOWREEL SECTION ==================== */}
      <section className="video-section relative h-[80vh] min-h-[600px] bg-black overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          loop
          muted
          playsInline
          poster="/images/home/hero-4.jpeg"
        >
          <source src="https://cdn.coverr.co/videos/coverr-modern-kitchen-interior-4k-6159/1080p.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        
        <div className="video-overlay-text absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10">
          <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4">Materiál v akcii</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6">
            Materiál v pohybe
          </h2>
          <p className="text-lg text-gray-300 font-light max-w-xl mx-auto mb-8">
            Pozrite si, ako naše povrchy transformujú priestory
          </p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button
              onClick={toggleMute}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>
      </section>

      {/* ==================== BENEFITS BENTO GRID ==================== */}
      <section className="py-32 bg-white relative z-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">Prečo Orostone</span>
            <TextReveal variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark leading-tight justify-center">
              Materiál bez kompromisov
            </TextReveal>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[200px]">
            {/* Large card */}
            <div className="benefit-card lg:col-span-2 lg:row-span-2 group p-10 bg-gradient-to-br from-brand-dark to-black text-white rounded-3xl relative overflow-hidden hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <ShieldCheck size={48} className="text-brand-gold" />
                <div>
                  <h3 className="text-xl md:text-2xl font-sans font-bold mb-4">Vysoká odolnosť</h3>
                  <p className="text-gray-400 font-light leading-relaxed max-w-md">
                    Tvrdosť 7/10 na Mohsovej stupnici. Pri správnej manipulácii a odbornej montáži vám vydrží desaťročia.
                  </p>
                </div>
              </div>
            </div>

            {/* Small cards */}
            <div className="benefit-card group p-8 bg-[#F9F9F7] rounded-3xl hover:bg-brand-gold/10 transition-all duration-500 hover:scale-[1.02]">
              <Flame size={32} className="text-brand-gold mb-4" />
              <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Tepelná stabilita</h3>
              <p className="text-gray-500 text-base font-light">Odoláva teplotám až do 300°C</p>
            </div>

            <div className="benefit-card group p-8 bg-[#F9F9F7] rounded-3xl hover:bg-brand-gold/10 transition-all duration-500 hover:scale-[1.02]">
              <Sun size={32} className="text-brand-gold mb-4" />
              <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">UV stabilita</h3>
              <p className="text-gray-500 text-base font-light">Farba zostáva stála aj na slnku</p>
            </div>

            {/* Medium cards */}
            <div className="benefit-card lg:col-span-2 group p-8 bg-[#F9F9F7] rounded-3xl hover:bg-brand-gold/10 transition-all duration-500 hover:scale-[1.02] flex items-center gap-8">
              <Droplets size={48} className="text-brand-gold flex-shrink-0" />
              <div>
                <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">Nulová nasiakavosť</h3>
                <p className="text-gray-500 font-light">Neabsorbuje tekutiny, kyseliny ani mastnotu. Maximálne hygienický povrch pre kuchyne a kúpeľne.</p>
              </div>
            </div>

            <div className="benefit-card lg:col-span-2 group p-8 bg-brand-gold/20 rounded-3xl hover:bg-brand-gold/30 transition-all duration-500 hover:scale-[1.02] flex items-center gap-8">
              <Award size={48} className="text-brand-gold flex-shrink-0" />
              <div>
                <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">24 mesiacov záruka</h3>
                <p className="text-gray-600 font-light">Záruka na materiál v súlade s VOP. Vady z montáže alebo opracovania nie sú kryté.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== COLLECTIONS GRID ==================== */}
      <section className="py-32 bg-[#121212] text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div>
              <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">Kolekcie</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold">Dizajnové línie</h2>
            </div>
            <Link to="/kolekcie" className="group flex items-center text-sm font-medium hover:text-brand-gold transition-colors">
              <span className="border-b border-white/30 group-hover:border-brand-gold pb-1 transition-colors">Všetky dekory</span>
              <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTIONS.map((col) => (
              <Link
                to={`/kolekcie?filter=${col.id}`}
                key={col.id}
                className="collections-grid-item group relative h-[500px] overflow-hidden bg-gray-900 cursor-pointer block rounded-3xl"
              >
                <img
                  src={col.heroImage}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                
                <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />

                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <span className="text-brand-gold text-xs tracking-widest uppercase mb-2 block opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    Kolekcia
                  </span>
                  <h3 className="text-xl md:text-2xl font-medium mb-3">{col.name}</h3>
                  <p className="text-base text-gray-400 line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed">
                    {col.description}
                  </p>
                  <div className="flex items-center text-xs tracking-widest uppercase">
                    <span className="group-hover:text-brand-gold transition-colors">Detail</span>
                    <ArrowRight size={12} className="ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="testimonials-section py-32 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">Referencie</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6 leading-tight">
              Čo hovoria naši klienti
            </h2>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">Spokojní klienti sú naša najlepšia vizitka.</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <Quote className="absolute -top-4 left-0 w-20 h-20 text-brand-gold/20" />

            <div className="text-center py-12 px-8 md:px-16">
              <div className="flex justify-center gap-2 mb-10">
                {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} size={24} className="text-brand-gold fill-brand-gold" />
                ))}
              </div>

              <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-12 italic">
                "{TESTIMONIALS[activeTestimonial].quote}"
              </p>

              <div className="flex flex-col items-center">
                <img
                  src={TESTIMONIALS[activeTestimonial].avatar}
                  alt={TESTIMONIALS[activeTestimonial].name}
                  className="w-20 h-20 rounded-full object-cover mb-6 border-2 border-brand-gold"
                />
                <h4 className="text-2xl font-sans font-bold mb-2">{TESTIMONIALS[activeTestimonial].name}</h4>
                <p className="text-gray-400 text-base mb-2">
                  {TESTIMONIALS[activeTestimonial].role}
                  {TESTIMONIALS[activeTestimonial].company && `, ${TESTIMONIALS[activeTestimonial].company}`}
                </p>
                <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold">
                  {TESTIMONIALS[activeTestimonial].project}
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-6 mt-12">
              <button
                onClick={prevTestimonial}
                className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-dark transition-all hover:border-white"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex gap-3">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === activeTestimonial ? "bg-brand-gold w-10" : "bg-white/30 w-2 hover:bg-white/50"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-dark transition-all hover:border-white"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-20">
            <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">Otázky & Odpovede</span>
            <TextReveal variant="h2" className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6 justify-center">
              Časté otázky
            </TextReveal>
            <p className="text-gray-500 text-lg font-light">Odpovede na to, čo vás najviac zaujíma.</p>
          </div>
          
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div 
                key={i} 
                className="faq-item border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-gold/30"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-8 text-left"
                >
                  <span className="font-sans font-semibold text-xl text-brand-dark pr-8">{faq.question}</span>
                  <span className={cn(
                    "text-3xl font-light text-brand-gold transition-transform duration-300 flex-shrink-0",
                    openFaq === i && "rotate-45"
                  )}>+</span>
                </button>
                <div className={cn(
                  "overflow-hidden transition-all duration-500",
                  openFaq === i ? "max-h-96 pb-8" : "max-h-0"
                )}>
                  <p className="px-8 text-gray-600 font-light leading-relaxed text-lg">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="cta-section py-40 bg-brand-dark text-white text-center relative overflow-hidden">
        <div className="cta-bg absolute inset-0 opacity-20 scale-110">
          <img 
            src="/images/home/hero-5.png" 
            className="w-full h-full object-cover grayscale" 
            alt="texture" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark opacity-80" />

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
          <h2 className="cta-text text-5xl md:text-6xl lg:text-7xl font-sans font-bold mb-4 tracking-normal leading-[1] text-white">
            Váš projekt.
          </h2>
          <h2 className="cta-text text-5xl md:text-6xl lg:text-7xl font-sans font-light mb-10 tracking-normal leading-[1] italic text-brand-gold">
            Naša vášeň.
          </h2>

          <p className="cta-text text-gray-400 text-lg mb-16 max-w-2xl mx-auto font-light">
            Od výberu dekoru po dodanie materiálu. Zažite rozdiel, ktorý prináša Orostone.
          </p>
          
          <Link to="/kontakt?openWizard=true" className="cta-text">
            <Button className="bg-brand-gold text-brand-dark px-16 py-6 text-lg shadow-2xl hover:shadow-brand-gold/30 hover:scale-105 transition-all duration-300 rounded-full hover:bg-white">
              Vytvoriť Nezáväzný Dopyt
            </Button>
          </Link>
        </div>
      </section>

      {/* ==================== CTA MODAL OVERLAY ==================== */}
      {isCtaModalOpen && (
        <div 
          ref={ctaModalRef}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCtaModalOpen(false);
          }}
        >
          {/* Backdrop with blur */}
          <div className="cta-modal-backdrop absolute inset-0 bg-black/80 backdrop-blur-xl" />
          
          {/* Close Button */}
          <button
            onClick={() => setIsCtaModalOpen(false)}
            className="cta-modal-close absolute top-8 right-8 z-10 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-5xl mx-6">
            {/* Header */}
            <div className="cta-modal-header text-center mb-12">
              <span className="text-brand-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
                Vyberte si cestu
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white">
                Ako môžeme pomôcť?
              </h2>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* E-shop Card */}
              <Link 
                to="/shop" 
                onClick={() => setIsCtaModalOpen(false)}
                className="cta-modal-card group"
              >
                <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 overflow-hidden hover:border-green-500/50 transition-all duration-500 hover:bg-white/10">
                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <ShoppingBag size={32} className="text-green-400" />
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Skladom ihneď
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">
                      Skladové platne
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-8">
                      Expedícia do 5 pracovných dní. Štandardné rozmery bez úprav. 
                      Ideálne pre rýchle projekty.
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-green-400" />
                        Platba kartou alebo prevodom
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-green-400" />
                        Vrátenie do 14 dní
                      </li>
                    </ul>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div>
                        <span className="text-gray-500 text-sm">od</span>
                        <span className="text-3xl font-bold text-white ml-2">€165</span>
                        <span className="text-gray-400 text-sm">/m²</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-400 font-medium group-hover:gap-4 transition-all">
                        <span>Nakúpiť</span>
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Project Card */}
              <Link 
                to="/kontakt?openWizard=true" 
                onClick={() => setIsCtaModalOpen(false)}
                className="cta-modal-card group"
              >
                <div className="relative h-full bg-brand-gold/5 backdrop-blur-md border border-brand-gold/20 rounded-3xl p-10 overflow-hidden hover:border-brand-gold/50 transition-all duration-500 hover:bg-brand-gold/10">
                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-brand-gold/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <Ruler size={32} className="text-brand-gold" />
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                      <Sparkles size={12} />
                      Premium služba
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-brand-gold transition-colors">
                      Projekt na mieru
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-8">
                      CNC rezanie na mieru s presnosťou 0.1mm. Individuálna objednávka 
                      pre váš unikátny projekt.
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-brand-gold" />
                        Odpoveď do 24 hodín
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 size={16} className="text-brand-gold" />
                        Konzultácia zdarma
                      </li>
                    </ul>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div>
                        <span className="text-brand-gold font-semibold">Nezáväzný dopyt</span>
                      </div>
                      <div className="flex items-center gap-2 text-brand-gold font-medium group-hover:gap-4 transition-all">
                        <span>Začať</span>
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Bottom hint */}
            <p className="cta-modal-hint text-center text-gray-500 text-sm mt-10">
              Stlačte <kbd className="px-2 py-1 bg-white/10 rounded text-gray-400 mx-1">Esc</kbd> pre zatvorenie
            </p>
          </div>
        </div>
      )}
    </main>
  );
};
