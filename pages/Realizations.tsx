import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { REALIZATIONS, TESTIMONIALS, PROCESS_STEPS, BEFORE_AFTER_PROJECTS } from '../constants';
import { TextReveal } from '../components/UI/TextReveal';
import { Button } from '../components/UI/Button';
import { Card, CardContent } from '@/components/UI/Card';
import { Lightbox } from '../components/UI/Lightbox';
import { BeforeAfterSlider } from '../components/UI/BeforeAfterSlider';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, MapPin, Layers, Images, Play, Pause, Volume2, VolumeX,
  ChevronLeft, ChevronRight, ChevronDown, Star, Quote, MessageCircle, Palette, 
  Cog, Wrench, CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CollectionGalleryImage, Realization } from '../types';

gsap.registerPlugin(ScrollTrigger);

// Icon mapping for process steps
const STEP_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  MessageCircle,
  Palette,
  Cog,
  Wrench,
  CheckCircle
};

// Featured project data (expanded for storytelling)
const FEATURED_PROJECT = {
  id: 'featured-1',
  title: 'Vila Horský Park',
  location: 'Bratislava',
  category: 'Kuchyňa',
  year: '2024',
  description: 'Kompletná realizácia kuchynskej linky v luxusnej vile s výhľadom na mesto.',
  slides: [
    {
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2500&auto=format&fit=crop',
      label: '01. Vízia',
      title: 'Začalo to snom',
      text: 'Klient chcel kuchyňu, ktorá splynie s panoramatickým výhľadom. Minimalizmus bez kompromisov.'
    },
    {
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2500&auto=format&fit=crop',
      label: '02. Materiál',
      title: 'Calacatta Gold',
      text: 'Vybrali sme najjemnejšie žilovanie. Každá doska bola ručne párovaná pre dokonalý bookmatch.'
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2500&auto=format&fit=crop',
      label: '03. Výsledok',
      title: 'Dokonalosť',
      text: '12 metrov pracovnej plochy. Nulové spoje. Kuchyňa, ktorá sa stala srdcom domova.'
    }
  ]
};

// Category showcase data
const CATEGORIES = [
  {
    id: 'kitchen',
    name: 'Kuchyne',
    tagline: 'Srdce každého domova',
    description: 'Odolné voči teplu, škvrnám a času. Naše kuchynské dosky sú navrhnuté pre skutočný život.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2000&auto=format&fit=crop',
    stats: { projects: 47, sqm: '850+' }
  },
  {
    id: 'bathroom',
    name: 'Kúpeľne',
    tagline: 'Wellness v detaile',
    description: 'Nulová nasiakavosť znamená maximálnu hygienu. Elegancia, ktorá vydrží.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2000&auto=format&fit=crop',
    stats: { projects: 32, sqm: '420+' }
  },
  {
    id: 'facade',
    name: 'Fasády',
    tagline: 'Prvý dojem, ktorý trvá',
    description: 'UV stabilita a odolnosť voči poveternostným vplyvom. Váš dom si zaslúži to najlepšie.',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2000&auto=format&fit=crop',
    stats: { projects: 18, sqm: '1200+' }
  }
];

export const Realizations = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<CollectionGalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Video state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Testimonials carousel state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Before/After slider state
  const [activeBeforeAfter, setActiveBeforeAfter] = useState(0);

  // Timeline active step
  const [activeStep, setActiveStep] = useState(0);

  // Featured project active slide
  const [activeFeaturedSlide, setActiveFeaturedSlide] = useState(0);

  // Convert realization images to CollectionGalleryImage format
  const convertToLightboxImages = (realization: Realization): CollectionGalleryImage[] => {
    const images = realization.images || [realization.image];
    return images.map((url, index) => ({
      name: `${realization.title} - ${index + 1}`,
      url: url,
      publicUrl: url,
      category: 'realization' as const
    }));
  };

  // Open lightbox with selected realization's images
  const openLightbox = (realization: Realization, startIndex: number = 0) => {
    const images = convertToLightboxImages(realization);
    setCurrentImages(images);
    setCurrentIndex(startIndex);
    setLightboxOpen(true);
  };

  // Lightbox navigation
  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(currentImages.length - 1, prev + 1));
  };

  const handleClose = () => {
    setLightboxOpen(false);
  };

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

  // Before/After navigation
  const nextBeforeAfter = () => {
    setActiveBeforeAfter((prev) => (prev + 1) % BEFORE_AFTER_PROJECTS.length);
  };

  const prevBeforeAfter = () => {
    setActiveBeforeAfter((prev) => (prev - 1 + BEFORE_AFTER_PROJECTS.length) % BEFORE_AFTER_PROJECTS.length);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    // Hero Animation
    const heroTl = gsap.timeline();
    heroTl.fromTo('.hero-text',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out' }
    ).fromTo('.hero-image',
      { scale: 1.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' },
      '-=1'
    );

    // Hero Parallax
    gsap.to('.hero-image img', {
      y: 150,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

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

    // Video section parallax
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

    // Featured Project Pinning
    const featuredTl = gsap.timeline({
      scrollTrigger: {
        trigger: featuredRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        snap: 0.33,
        onUpdate: (self) => {
          // Calculate active slide based on progress
          const progress = self.progress;
          if (progress < 0.33) {
            setActiveFeaturedSlide(0);
          } else if (progress < 0.66) {
            setActiveFeaturedSlide(1);
          } else {
            setActiveFeaturedSlide(2);
          }
        }
      }
    });

    featuredTl
      .to('.featured-slide-1', { opacity: 0, scale: 0.95, duration: 1 })
      .fromTo('.featured-slide-2', { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1 })
      .to('.featured-slide-2', { opacity: 0, scale: 0.95, duration: 1 })
      .fromTo('.featured-slide-3', { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1 });

    // Before/After section reveal
    gsap.fromTo('.before-after-section',
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.before-after-section',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Category sections reveal
    gsap.utils.toArray('.category-section').forEach((section: any, i) => {
      const direction = i % 2 === 0 ? -100 : 100;
      gsap.fromTo(section.querySelector('.category-image'),
        { x: direction, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      gsap.fromTo(section.querySelector('.category-content'),
        { x: -direction, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Testimonials section
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

    // Timeline section - progressive activation
    const timelineSteps = gsap.utils.toArray('.timeline-step');
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

    // Timeline line draw effect
    gsap.fromTo('.timeline-line',
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: true
        }
      }
    );

    // Gallery stagger
    gsap.utils.toArray('.gallery-item').forEach((item: any, i) => {
      gsap.fromTo(item,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: item,
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
            src="https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=2500&auto=format&fit=crop"
            alt="Featured Realization"
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <span className="hero-text font-sans font-bold text-xs tracking-widest uppercase text-brand-gold mb-6 block">
            Portfólio
          </span>
          <h1 className="hero-text text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-normal leading-[1] mb-8">
            Každý projekt<br/>má svoj príbeh.
          </h1>
          <p className="hero-text font-sans font-light text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Od prvého náčrtu po finálnu inštaláciu. Pozrite sa, ako meníme priestory na zážitky.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-white/50 z-10">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <ChevronDown size={28} />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-3 gap-8 text-center text-white">
              <div>
                <span className="text-4xl md:text-5xl font-sans font-bold text-brand-gold">97+</span>
                <p className="font-sans font-bold text-xs uppercase tracking-widest mt-2 text-gray-400">Dokončených projektov</p>
              </div>
              <div>
                <span className="text-4xl md:text-5xl font-sans font-bold text-brand-gold">2500+</span>
                <p className="font-sans font-bold text-xs uppercase tracking-widest mt-2 text-gray-400">m² realizovaných</p>
              </div>
              <div>
                <span className="text-4xl md:text-5xl font-sans font-bold text-brand-gold">100%</span>
                <p className="font-sans font-bold text-xs uppercase tracking-widest mt-2 text-gray-400">Spokojných klientov</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showreel Section */}
      <section className="video-section relative h-[80vh] min-h-[600px] bg-black overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2500&auto=format&fit=crop"
        >
          <source src="https://cdn.coverr.co/videos/coverr-modern-kitchen-interior-4k-6159/1080p.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        
        {/* Content */}
        <div className="video-overlay-text absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10">
          <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4">Showreel 2024</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6">
            Realizácie v pohybe
          </h2>
          <p className="font-sans font-light text-lg text-gray-300 max-w-xl mx-auto mb-8">
            Pozrite si, ako naše projekty ožívajú
          </p>
          
          {/* Video controls */}
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Featured Project - Pinned Scroll Story */}
      <section ref={featuredRef} className="h-screen w-full bg-black text-white relative overflow-hidden">
        
        {/* Label */}
        <div className="absolute bottom-8 left-8 z-20">
          <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase">Featured Project</span>
          <h3 className="text-2xl font-sans font-bold mt-2">{FEATURED_PROJECT.title}</h3>
          <p className="font-sans font-light text-gray-500 text-sm">{FEATURED_PROJECT.location} • {FEATURED_PROJECT.year}</p>
        </div>

        {/* Slide 1 */}
        <div className="featured-slide-1 absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img src={FEATURED_PROJECT.slides[0].image} className="w-full h-full object-cover opacity-50" alt="Slide 1" />
          </div>
          <div className="relative z-10 text-center max-w-3xl px-6">
            <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">{FEATURED_PROJECT.slides[0].label}</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6">{FEATURED_PROJECT.slides[0].title}</h2>
            <p className="font-sans font-light text-lg text-gray-400">{FEATURED_PROJECT.slides[0].text}</p>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="featured-slide-2 absolute inset-0 flex items-center justify-center opacity-0">
          <div className="absolute inset-0 z-0">
            <img src={FEATURED_PROJECT.slides[1].image} className="w-full h-full object-cover opacity-50" alt="Slide 2" />
          </div>
          <div className="relative z-10 text-center max-w-3xl px-6">
            <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">{FEATURED_PROJECT.slides[1].label}</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6">{FEATURED_PROJECT.slides[1].title}</h2>
            <p className="font-sans font-light text-lg text-gray-400">{FEATURED_PROJECT.slides[1].text}</p>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="featured-slide-3 absolute inset-0 flex items-center justify-center opacity-0">
          <div className="absolute inset-0 z-0">
            <img src={FEATURED_PROJECT.slides[2].image} className="w-full h-full object-cover opacity-50" alt="Slide 3" />
          </div>
          <div className="relative z-10 text-center max-w-3xl px-6">
            <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">{FEATURED_PROJECT.slides[2].label}</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6">{FEATURED_PROJECT.slides[2].title}</h2>
            <p className="font-sans font-light text-lg text-gray-400">{FEATURED_PROJECT.slides[2].text}</p>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {[0, 1, 2].map((index) => (
            <div 
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === activeFeaturedSlide ? "bg-brand-gold" : "bg-white/30"
              )}
            />
          ))}
        </div>
      </section>

      {/* Before/After Section */}
      <section className="before-after-section py-32 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">Transformácie</span>
            <TextReveal variant="h2" className="text-4xl md:text-5xl font-sans font-bold text-brand-dark mb-6 justify-center">
              Pred a po
            </TextReveal>
            <p className="font-sans font-light text-gray-500 text-lg max-w-2xl mx-auto">
              Pozrite sa na dramatické premeny priestorov s našimi materiálmi.
            </p>
          </div>

          {/* Slider navigation */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={prevBeforeAfter}
              className="w-12 h-12 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark hover:text-white transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              {BEFORE_AFTER_PROJECTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBeforeAfter(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === activeBeforeAfter ? "bg-brand-gold w-8" : "bg-brand-dark/20"
                  )}
                />
              ))}
            </div>
            <button
              onClick={nextBeforeAfter}
              className="w-12 h-12 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark hover:text-white transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Slider */}
          <div className="max-w-5xl mx-auto">
            <BeforeAfterSlider
              key={BEFORE_AFTER_PROJECTS[activeBeforeAfter].id}
              beforeImage={BEFORE_AFTER_PROJECTS[activeBeforeAfter].beforeImage}
              afterImage={BEFORE_AFTER_PROJECTS[activeBeforeAfter].afterImage}
              title={BEFORE_AFTER_PROJECTS[activeBeforeAfter].title}
              location={BEFORE_AFTER_PROJECTS[activeBeforeAfter].location}
              description={BEFORE_AFTER_PROJECTS[activeBeforeAfter].description}
            />
          </div>
        </div>
      </section>

      {/* Category Showcase - Zig-Zag */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <TextReveal variant="h2" className="text-4xl md:text-5xl font-sans font-bold text-brand-dark mb-6 justify-center">
              Kde všade nás nájdete
            </TextReveal>
            <p className="font-sans font-light text-gray-500 text-lg max-w-2xl mx-auto">
              Od súkromných rezidencií po komerčné priestory. Každá kategória má svoju jedinečnú výzvu.
            </p>
          </div>

          <div className="space-y-32">
            {CATEGORIES.map((category, index) => (
              <div
                key={category.id}
                className={cn(
                  "category-section grid grid-cols-1 lg:grid-cols-2 gap-16 items-center",
                  index % 2 === 1 && "lg:flex-row-reverse"
                )}
              >
                <div className={cn("category-image", index % 2 === 1 && "lg:order-2")}>
                  <div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl group">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white">
                      <div>
                        <span className="font-sans font-bold text-brand-gold text-xs uppercase tracking-widest">{category.tagline}</span>
                        <h3 className="text-3xl md:text-4xl font-sans font-bold mt-2">{category.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-sans font-bold">{category.stats.projects}</span>
                        <p className="font-sans font-bold text-xs uppercase tracking-widest text-gray-400">projektov</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={cn("category-content", index % 2 === 1 && "lg:order-1")}>
                  <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">0{index + 1}</span>
                  <h3 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark mb-6">{category.name}</h3>
                  <p className="font-sans font-light text-lg text-gray-500 leading-relaxed mb-8">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-8 mb-8">
                    <div>
                      <span className="text-3xl font-sans font-bold text-brand-dark">{category.stats.sqm}</span>
                      <p className="font-sans font-bold text-xs uppercase tracking-widest text-gray-500 mt-1">m² realizovaných</p>
                    </div>
                  </div>
                  <Link to={`/kolekcie?filter=${category.id}`}>
                    <Button variant="outline" className="border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white">
                      Pozrieť projekty <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialsRef}
        className="testimonials-section py-32 bg-brand-dark text-white relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">Referencie</span>
            <h2 className="text-4xl md:text-5xl font-sans font-bold mb-6">
              Čo hovoria naši klienti
            </h2>
          </div>

          {/* Testimonial carousel */}
          <div className="max-w-4xl mx-auto relative">
            {/* Quote icon */}
            <Quote className="absolute -top-4 left-0 w-16 h-16 text-brand-gold/20" />

            {/* Content */}
            <div className="text-center py-8 px-8 md:px-16">
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-brand-gold fill-brand-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-sans font-light text-xl md:text-2xl leading-relaxed mb-12 italic">
                "{TESTIMONIALS[activeTestimonial].quote}"
              </p>

              {/* Author */}
              <div className="flex flex-col items-center">
                <img
                  src={TESTIMONIALS[activeTestimonial].avatar}
                  alt={TESTIMONIALS[activeTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-brand-gold"
                />
                <h4 className="text-lg font-sans font-bold">{TESTIMONIALS[activeTestimonial].name}</h4>
                <p className="font-sans font-light text-gray-400 text-sm">
                  {TESTIMONIALS[activeTestimonial].role}
                  {TESTIMONIALS[activeTestimonial].company && `, ${TESTIMONIALS[activeTestimonial].company}`}
                </p>
                <p className="font-sans font-bold text-brand-gold text-xs uppercase tracking-widest mt-2">
                  {TESTIMONIALS[activeTestimonial].project}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-6 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-dark transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i === activeTestimonial ? "bg-brand-gold w-8" : "bg-white/30"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-dark transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section ref={timelineRef} className="py-32 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">Proces</span>
            <TextReveal variant="h2" className="text-4xl md:text-5xl font-sans font-bold text-brand-dark mb-6 justify-center">
              Ako pracujeme
            </TextReveal>
            <p className="font-sans font-light text-gray-500 text-lg max-w-2xl mx-auto">
              Od prvej konzultácie po odovzdanie projektu. Každý krok je premyslený.
            </p>
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-brand-dark/10 transform md:-translate-x-1/2">
              <div 
                className="timeline-line absolute top-0 left-0 w-full bg-brand-gold origin-top"
                style={{ height: '100%' }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-16">
              {PROCESS_STEPS.map((step, index) => {
                const IconComponent = STEP_ICONS[step.icon];
                return (
                  <div 
                    key={step.id}
                    className={cn(
                      "timeline-step relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center",
                      index % 2 === 1 && "md:text-right"
                    )}
                  >
                    {/* Content */}
                    <div className={cn(
                      "pl-20 md:pl-0",
                      index % 2 === 0 ? "md:pr-16 md:order-1" : "md:pl-16 md:order-2"
                    )}>
                      <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-2 block">
                        {step.duration}
                      </span>
                      <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-3">
                        {step.title}
                      </h3>
                      <p className="font-sans font-light text-gray-500">
                        {step.description}
                      </p>
                    </div>

                    {/* Center dot */}
                    <div className={cn(
                      "absolute left-8 md:left-1/2 w-16 h-16 transform -translate-x-1/2 flex items-center justify-center",
                      "rounded-full border-4 transition-all duration-500",
                      index <= activeStep 
                        ? "bg-brand-gold border-brand-gold text-brand-dark" 
                        : "bg-white border-brand-dark/10 text-brand-dark/30"
                    )}>
                      {IconComponent && <IconComponent size={24} />}
                    </div>

                    {/* Number (opposite side) */}
                    <div className={cn(
                      "hidden md:block",
                      index % 2 === 0 ? "md:order-2 md:pl-16" : "md:order-1 md:pr-16 text-right"
                    )}>
                      <span className={cn(
                        "text-7xl font-sans font-bold transition-colors duration-500",
                        index <= activeStep ? "text-brand-gold" : "text-brand-dark/10"
                      )}>
                        {step.number}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="font-sans font-bold text-brand-gold text-xs tracking-widest uppercase mb-4 block">Galéria</span>
              <h2 className="text-4xl md:text-5xl font-sans font-bold text-brand-dark">Všetky realizácie</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REALIZATIONS.map((realization, index) => (
              <Card
                key={realization.id}
                onClick={() => openLightbox(realization)}
                className="gallery-item group relative overflow-hidden border-0 shadow-lg rounded-2xl cursor-pointer hover:shadow-2xl transition-shadow duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={realization.image}
                    alt={realization.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* Image count indicator */}
                {realization.images && realization.images.length > 1 && (
                  <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Images size={12} />
                    {realization.images.length}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest mb-2">
                    <Layers size={12} />
                    {realization.category}
                  </div>
                  <h3 className="text-xl font-sans font-bold mb-1">{realization.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin size={12} />
                    {realization.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-brand-dark text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2500&auto=format&fit=crop"
            className="w-full h-full object-cover grayscale"
            alt="texture"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark opacity-90" />

        <div className="container mx-auto px-6 relative z-10">
          <TextReveal variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-8 justify-center tracking-tight text-white">
            Váš projekt môže byť ďalší.
          </TextReveal>
          <p className="font-sans font-light text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Každý priestor si zaslúži pozornosť. Porozprávajte nám o vašej vízii.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/kontakt?openWizard=true">
              <Button size="lg" className="bg-brand-gold text-brand-dark px-12 py-8 text-lg rounded-full hover:bg-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                Začať projekt
              </Button>
            </Link>
            <Link to="/kolekcie">
              <Button variant="outline" size="lg" className="border-white/30 text-white px-12 py-8 text-lg rounded-full hover:bg-white hover:text-brand-dark transition-all">
                Prezrieť materiály
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={currentImages}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={handleClose}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

    </main>
  );
};
