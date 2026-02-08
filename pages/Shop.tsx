import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ChevronRight, Star,
  CheckCircle, Clock, Thermometer, MessageSquare,
  Instagram
} from 'lucide-react';
import { ShopProduct, TESTIMONIALS, REALIZATIONS } from '../constants';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { useInstagramFeed, getPostImageUrl } from '../hooks/useInstagramFeed';
import { OrderModal } from '../components/Shop/OrderModal';
import { Marquee } from '../components/UI/Marquee';
import { SEOHead, OROSTONE_ORGANIZATION_LD } from '../components/UI/SEOHead';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ===========================================
// CATEGORY TILES DATA
// ===========================================
const CATEGORIES = [
  {
    name: 'Mramor',
    slug: 'mramor',
    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=1000&fit=crop',
    description: 'Nadčasová elegancia',
  },
  {
    name: 'Granit',
    slug: 'granit',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=1000&fit=crop',
    description: 'Prírodná sila',
  },
  {
    name: 'Betón',
    slug: 'beton',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=1000&fit=crop',
    description: 'Moderný minimalizmus',
  },
  {
    name: 'Drevo',
    slug: 'drevo',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=1000&fit=crop',
    description: 'Teplo prírody',
  },
];

// ===========================================
// INSPIRATION GALLERY DATA
// ===========================================
const INSPIRATION_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop',
    label: 'Kuchyňa',
    large: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800&auto=format&fit=crop',
    label: 'Kúpeľňa',
    large: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
    label: 'Obývačka',
    large: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop',
    label: 'Kuchyňa',
    large: false,
  },
];

// INSTAGRAM_IMAGES removed — now loaded via useInstagramFeed hook

// ===========================================
// COMPONENT
// ===========================================
export const Shop = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { products: SHOP_PRODUCTS, isLoading: productsLoading } = useShopifyProducts();

  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { posts: instagramPosts, isLoading: igLoading, isUsingFallback: igFallback } = useInstagramFeed(8);

  // Testimonials carousel
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000);
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  // ===========================================
  // GSAP ANIMATIONS
  // ===========================================
  useGSAP(() => {
    if (!containerRef.current) return;

    // --- Hero text reveal ---
    gsap.fromTo('.hero-text-line', 
      { y: 100, opacity: 0 },
      { 
        y: 0, opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.15,
        delay: 0.3,
      }
    );

    gsap.fromTo('.hero-subtitle',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
    );

    gsap.fromTo('.hero-cta',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.1 }
    );

    gsap.fromTo('.scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 1.5 }
    );

    // --- Parallax effect on hero video ---
    if (heroRef.current) {
      gsap.to('.hero-video', {
        scale: 1.15,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // --- Trust bar counters ---
    gsap.utils.toArray<HTMLElement>('.trust-counter').forEach((el) => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // --- Category tiles staggered reveal ---
    gsap.fromTo('.category-tile',
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.categories-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // --- Spotlight product reveal ---
    gsap.fromTo('.spotlight-image',
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.spotlight-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    gsap.fromTo('.spotlight-content',
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.spotlight-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // --- Lifestyle parallax image ---
    gsap.to('.lifestyle-image', {
      yPercent: -15,
      scrollTrigger: {
        trigger: '.lifestyle-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // --- Section headers fade-in ---
    gsap.utils.toArray<HTMLElement>('.section-reveal').forEach((el) => {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // --- Products carousel cards ---
    gsap.fromTo('.product-card',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.products-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // --- Inspiration gallery ---
    gsap.fromTo('.inspiration-item',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.inspiration-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // --- Testimonials ---
    gsap.fromTo('.testimonials-section .testimonial-inner',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // --- Instagram grid ---
    gsap.fromTo('.ig-item',
      { scale: 0.9, opacity: 0 },
      {
        scale: 1, opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.instagram-section',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // --- CTA section ---
    gsap.fromTo('.cta-content',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

  }, { scope: containerRef });

  // Get featured/spotlight product
  const spotlightProduct = SHOP_PRODUCTS[0];

  return (
    <main ref={containerRef} className="overflow-hidden w-full">
      <SEOHead
        title="OROSTONE E-Shop | Prémiový sinterovaný kameň"
        description="Nakupujte prémiové sinterované kamene od OROSTONE. Mramor, granit, betón — všetko s dopravou po celom Slovensku. Dosky 3200x1600mm skladom."
        ogType="website"
        structuredData={OROSTONE_ORGANIZATION_LD}
      />

      {/* ==================== CINEMATIC VIDEO HERO (75vh) ==================== */}
      <section 
        ref={heroRef} 
        className="relative h-[75vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Fullscreen Video Background */}
        <video
          ref={videoRef}
          className="hero-video absolute inset-0 w-full h-full object-cover opacity-50"
          autoPlay
          loop
          muted
          playsInline
          poster="/images/home/hero-1.jpeg"
        >
          <source 
            src="https://cdn.coverr.co/videos/coverr-modern-kitchen-interior-4k-6159/1080p.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

        {/* Minimal Centered Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col items-center">
            <div className="overflow-hidden">
              <h1 className="hero-text-line text-5xl md:text-6xl lg:text-8xl font-sans font-bold tracking-tight leading-[0.95] text-white">
                Krása kameňa.
              </h1>
            </div>
            <div className="overflow-hidden mt-2 md:mt-3">
              <h1 className="hero-text-line text-5xl md:text-6xl lg:text-8xl font-sans font-light italic text-brand-gold tracking-tight leading-[0.95]">
                Bez kompromisov.
              </h1>
            </div>
          </div>

          <p className="hero-subtitle font-sans font-light text-base md:text-lg text-white/50 max-w-xl mx-auto mb-14">
            Prémiové sinterované platne pre náročné interiéry
          </p>

          <div className="hero-cta">
            <button
              onClick={() => {
                document.querySelector('.categories-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-3 text-white/90 hover:text-white transition-all duration-300"
            >
              <span className="text-sm md:text-base font-light tracking-[0.2em] uppercase border-b border-white/30 group-hover:border-brand-gold pb-1 transition-colors duration-300">
                Objavte kolekcie
              </span>
              <ArrowRight size={18} className="text-brand-gold opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 z-10">
          <div className="flex flex-col items-center gap-3">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* ==================== TRUST MARQUEE ==================== */}
      <Marquee />

      {/* ==================== TRUST BAR — Refined Minimal ==================== */}
      <section className="bg-white py-12 lg:py-16 border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

            <Link to="/realizacie" className="trust-counter group text-center">
              <div className="flex flex-col items-center">
                <CheckCircle size={20} className="text-brand-gold mb-3" strokeWidth={1.5} />
                <span className="text-2xl lg:text-3xl font-bold text-brand-dark mb-1">200+</span>
                <span className="text-xs text-gray-400 font-medium tracking-wide">overených realizácií</span>
              </div>
            </Link>

            <div className="trust-counter group text-center">
              <div className="flex flex-col items-center">
                <Clock size={20} className="text-brand-gold mb-3" strokeWidth={1.5} />
                <span className="text-2xl lg:text-3xl font-bold text-brand-dark mb-1">24–48h</span>
                <span className="text-xs text-gray-400 font-medium tracking-wide">expedícia skladom</span>
              </div>
            </div>

            <Link to="/o-kameni" className="trust-counter group text-center">
              <div className="flex flex-col items-center">
                <Thermometer size={20} className="text-brand-gold mb-3" strokeWidth={1.5} />
                <span className="text-2xl lg:text-3xl font-bold text-brand-dark mb-1">Do 300°C</span>
                <span className="text-xs text-gray-400 font-medium tracking-wide">odolnosť voči teplu</span>
              </div>
            </Link>

            <Link to="/kontakt?openWizard=true" className="trust-counter group text-center">
              <div className="flex flex-col items-center">
                <MessageSquare size={20} className="text-brand-gold mb-3" strokeWidth={1.5} />
                <span className="text-2xl lg:text-3xl font-bold text-brand-dark mb-1">Zadarmo</span>
                <span className="text-xs text-gray-400 font-medium tracking-wide">vzorky a poradenstvo</span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ==================== EDITORIAL CATEGORY TILES ==================== */}
      <section className="py-20 lg:py-28 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="section-reveal text-center mb-12 lg:mb-16">
            <span className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-3 block">
              Kolekcie
            </span>
            <h2 className="text-3xl lg:text-4xl font-sans font-bold text-brand-dark">
              Objavte naše materiály
            </h2>
          </div>

          <div className="categories-grid grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/kategoria/${cat.slug}`}
                className="category-tile group relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1 font-medium">
                    {cat.description}
                  </p>
                  <h3 className="text-xl lg:text-2xl font-bold text-white font-sans">
                    {cat.name}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors duration-300">
                    <span className="text-[11px] tracking-[0.15em] uppercase font-medium">
                      Objaviť
                    </span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SPOTLIGHT PRODUCT ==================== */}
      {spotlightProduct && (
        <section className="spotlight-section py-20 lg:py-28 bg-white overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              
              {/* Product Image */}
              <div className="spotlight-image flex-1 w-full lg:w-auto">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F5F3]">
                  <img
                    src={spotlightProduct.image}
                    alt={spotlightProduct.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="spotlight-content flex-1 max-w-lg">
                <span className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-4 block">
                  Odporúčame
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4 uppercase tracking-wide">
                  {spotlightProduct.name}
                </h2>
                <p className="text-gray-500 text-base lg:text-lg font-light leading-relaxed mb-6">
                  {spotlightProduct.description}
                </p>
                <p className="text-2xl font-bold text-brand-dark mb-8">
                  €{spotlightProduct.pricePerM2}
                  <span className="text-base font-normal text-gray-400 ml-1">/m²</span>
                </p>
                <Link
                  to={`/produkt/${spotlightProduct.id}`}
                  className="inline-flex items-center gap-3 bg-brand-dark text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
                >
                  Zobraziť detail
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== INSPIRUJTE SA — Inspiration Gallery ==================== */}
      <section className="inspiration-section py-20 lg:py-28 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="section-reveal text-center mb-12 lg:mb-16">
            <span className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-3 block">
              Inšpirácie
            </span>
            <h2 className="text-3xl lg:text-4xl font-sans font-bold text-brand-dark">
              Inspirujte sa
            </h2>
            <p className="text-gray-400 text-sm lg:text-base mt-3 font-light max-w-lg mx-auto">
              Ako môže sinterovaný kameň premeniť váš priestor
            </p>
          </div>

          {/* Asymmetric Grid: 1 large + 3 small */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 auto-rows-[200px] lg:auto-rows-[260px]">
            {INSPIRATION_IMAGES.map((img, idx) => (
              <div
                key={idx}
                className={`inspiration-item group relative rounded-2xl overflow-hidden cursor-pointer ${
                  img.large ? 'row-span-2 col-span-1' : ''
                }`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-white font-medium bg-brand-gold/90 px-3 py-1 rounded-full">
                    {img.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS CAROUSEL ==================== */}
      <section className="products-section bg-[#FAFAFA] py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            
            {/* Left: Header (sticky on desktop) */}
            <div className="lg:w-64 lg:flex-shrink-0 lg:sticky lg:top-40 lg:self-start">
              <span className="block text-3xl lg:text-4xl font-sans font-light italic text-brand-gold">
                OBĽÚBENÉ
              </span>
              <h2 className="text-3xl lg:text-4xl font-sans font-bold text-brand-dark uppercase">
                produkty
              </h2>
              <p className="text-gray-400 text-sm lg:text-base mt-4 font-light">
                Naše bestsellery vybrané pre vás
              </p>
              
              {/* Navigation Arrows - Desktop */}
              <div className="hidden lg:flex gap-3 mt-8">
                <button 
                  onClick={() => {
                    const container = document.getElementById('featured-carousel');
                    if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                  }}
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-colors"
                  aria-label="Previous"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <button 
                  onClick={() => {
                    const container = document.getElementById('featured-carousel');
                    if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                  }}
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Right: Products Carousel */}
            <div className="flex-1 relative min-w-0">
              <div 
                id="featured-carousel"
                className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {SHOP_PRODUCTS.slice(0, 8).map((product, idx) => (
                  <Link 
                    key={product.id}
                    to={`/produkt/${product.id}`}
                    className="product-card group flex-shrink-0 w-[280px] lg:w-[300px] snap-start"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill="#ECD488" className="text-brand-gold" />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">
                            ({((idx + 1) * 37 + 50) % 200 + 50})
                          </span>
                        </div>
                        <h3 className="font-sans font-bold text-brand-dark text-sm mb-1 uppercase tracking-wide line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold text-brand-dark mt-2">
                          €{product.pricePerM2}
                          <span className="text-sm font-normal text-gray-400">/m²</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile Navigation Arrows */}
              <button 
                onClick={() => {
                  const container = document.getElementById('featured-carousel');
                  if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                }}
                className="lg:hidden absolute left-0 top-1/3 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-dark z-10"
                aria-label="Previous"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
              <button 
                onClick={() => {
                  const container = document.getElementById('featured-carousel');
                  if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                }}
                className="lg:hidden absolute right-0 top-1/3 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-dark z-10"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="testimonials-section py-20 lg:py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="testimonial-inner max-w-3xl mx-auto text-center">
            <span className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-3 block">
              Recenzie
            </span>
            <h2 className="text-3xl lg:text-4xl font-sans font-bold text-brand-dark mb-12 lg:mb-16">
              Čo hovoria naši zákazníci
            </h2>

            {/* Testimonial Carousel */}
            <div className="relative min-h-[280px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {TESTIMONIALS[currentTestimonial] && (
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    {/* Gold quote mark */}
                    <span className="text-6xl lg:text-7xl font-serif text-brand-gold/30 leading-none mb-4 select-none">
                      &ldquo;
                    </span>

                    <blockquote className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mb-8 italic">
                      {TESTIMONIALS[currentTestimonial].quote}
                    </blockquote>

                    <div className="flex items-center gap-3">
                      {TESTIMONIALS[currentTestimonial].avatar && (
                        <img
                          src={TESTIMONIALS[currentTestimonial].avatar}
                          alt={TESTIMONIALS[currentTestimonial].name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-brand-gold/30"
                        />
                      )}
                      <div className="text-left">
                        <p className="text-sm font-bold text-brand-dark">
                          {TESTIMONIALS[currentTestimonial].name}
                        </p>
                        {TESTIMONIALS[currentTestimonial].role && (
                          <p className="text-xs text-gray-400">
                            {TESTIMONIALS[currentTestimonial].role}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Star rating */}
                    <div className="flex items-center gap-1 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#ECD488" className="text-brand-gold" />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentTestimonial
                      ? 'bg-brand-gold w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== INSTAGRAM FEED ==================== */}
      <section className="instagram-section py-20 lg:py-28 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="section-reveal text-center mb-12 lg:mb-16">
            <span className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-3 block">
              @orostone_
            </span>
            <h2 className="text-3xl lg:text-4xl font-sans font-bold text-brand-dark">
              Sledujte nás na Instagrame
            </h2>
            <p className="text-gray-400 text-sm lg:text-base mt-3 font-light max-w-lg mx-auto">
              Pravidelné inšpirácie, novinky a zákulisie
            </p>
          </div>

          {/* 4x2 Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {igLoading
              ? [...Array(8)].map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="ig-item aspect-square rounded-xl bg-gray-200 animate-pulse"
                  />
                ))
              : instagramPosts.map((post, idx) => (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ig-item group relative aspect-square rounded-xl overflow-hidden"
                  >
                    <img
                      src={getPostImageUrl(post)}
                      alt={post.caption?.slice(0, 80) || `OROSTONE Instagram ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                      <Instagram
                        size={28}
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                    {/* Video badge */}
                    {post.media_type === 'VIDEO' && (
                      <div className="absolute top-3 right-3 bg-black/60 rounded-full p-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                    )}
                  </a>
                ))}
          </div>

          {/* Follow CTA */}
          <div className="text-center mt-10">
            <a
              href="https://www.instagram.com/orostone_/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-brand-dark hover:text-brand-gold transition-colors duration-300 group"
            >
              <Instagram size={18} />
              <span className="text-sm font-bold uppercase tracking-[0.15em] border-b border-transparent group-hover:border-brand-gold pb-0.5 transition-colors duration-300">
                Sledovať @orostone_
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== LIFESTYLE PARALLAX SECTION ==================== */}
      <section className="lifestyle-section relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop"
            alt="Luxusný interiér so sinterovaným kameňom"
            className="lifestyle-image absolute inset-0 w-full h-[130%] object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
          <span className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-4 block">
            Inšpirácie
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-4 max-w-2xl leading-tight">
            Materiály, ktoré definujú priestor
          </h2>
          <p className="text-white/50 text-base lg:text-lg font-light max-w-xl">
            Od kuchýň po kúpeľne — sinterovaný kameň prináša eleganciu do každého detailu
          </p>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="cta-section py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="cta-content max-w-3xl mx-auto text-center">
            <span className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-4 block">
              Potrebujete pomoc?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-dark mb-6">
              Neviete sa rozhodnúť?
            </h2>
            <p className="text-base lg:text-lg text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Naše dosky sú investíciou na celý život. Ak potrebujete poradiť 
              s výberom alebo máte špeciálne požiadavky, sme tu pre vás.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/kontakt"
                className="inline-flex items-center justify-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
              >
                Kontaktovať predajcu
                <ArrowRight size={16} />
              </Link>
              <Link 
                to="/key-facts"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-brand-dark px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition-all duration-300"
              >
                Technické parametre
              </Link>
            </div>
          </div>
        </div>
      </section>

      <OrderModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};
