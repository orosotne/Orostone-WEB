import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowRight, CheckCircle, ChevronRight,
  Clock, Thermometer, MessageSquare, Star
} from 'lucide-react';
import { ShopProduct } from '../constants';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { OrderModal } from '../components/Shop/OrderModal';
import { Button } from '../components/UI/Button';
import { SEOHead, OROSTONE_ORGANIZATION_LD } from '../components/UI/SEOHead';
import { Link } from 'react-router-dom';

// ===========================================
// HERO SLIDESHOW DATA
// ===========================================
const HERO_SLIDES = [
  { 
    image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600&h=600&fit=crop',
    alt: 'Bianco Statuario - Elegantný biely mramor'
  },
  { 
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=600&fit=crop',
    alt: 'Nero Marquina - Luxusný čierny mramor'
  },
  { 
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=600&fit=crop',
    alt: 'Calacatta Gold - Prémiový taliansky mramor'
  },
];

const SLIDE_INTERVAL = 8000; // 8 sekúnd

export const Shop = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { products: SHOP_PRODUCTS, isLoading: productsLoading } = useShopifyProducts();

  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Hero Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <main ref={containerRef} className="overflow-hidden w-full bg-[#FAFAFA]">
      <SEOHead
        title="OROSTONE E-Shop | Prémiový sinterovaný kameň"
        description="Nakupujte prémiové sinterované kamene od OROSTONE. Mramor, granit, betón — všetko s dopravou po celom Slovensku. Dosky 3200x1600mm skladom."
        ogType="website"
        structuredData={OROSTONE_ORGANIZATION_LD}
      />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden -mt-[92px] lg:-mt-[148px] pt-[92px] lg:pt-[148px] bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900">
        
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center min-h-[420px] lg:min-h-[500px] py-12 lg:py-0">
            
            {/* Left: Text Content */}
            <div className="flex-1 text-center lg:text-left z-10 max-w-xl">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#ECD488" className="text-brand-gold" />
                  ))}
                </div>
                <span className="text-white/80 text-sm font-medium">200+ spokojných zákazníkov</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
                <span className="text-brand-gold italic font-serif">Prémiové</span>
                <br />
                <span className="uppercase tracking-wide">Sinterované</span>
                <br />
                <span className="uppercase tracking-wide">Platne</span>
              </h1>

              {/* Description */}
              <p className="text-white/70 text-lg mb-8 max-w-md mx-auto lg:mx-0">
                Ultra odolné povrchy pre kuchyne, kúpeľne a interiéry. 
                Odolnosť voči teplu, škvrnám a UV žiareniu.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => {
                    document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-dark px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Pozrieť kolekcie
                  <ArrowRight size={18} />
                </button>
                <Link 
                  to="/kontakt?openWizard=true"
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/30 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-brand-dark transition-all"
                >
                  Nezáväzný dopyt
                </Link>
              </div>

              {/* Slide Indicators */}
              <div className="flex gap-2 justify-center lg:justify-start mt-8">
                {HERO_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-8 h-1 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Product Image */}
            <div className="flex-1 relative mt-8 lg:mt-0 flex items-center justify-center">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-10 bg-brand-gold/20 rounded-full blur-3xl" />
                
                {/* Product Image with Slideshow */}
                <div className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  {HERO_SLIDES.map((slide, index) => (
                    <img 
                      key={index}
                      src={slide.image}
                      alt={slide.alt}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute right-8 bottom-8 flex gap-3 hidden lg:flex">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-brand-dark transition-all flex items-center justify-center"
            aria-label="Predchádzajúci slide"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-brand-dark transition-all flex items-center justify-center"
            aria-label="Nasledujúci slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* ==================== TRUST BAR - Premium Brand Style ==================== */}
      <section className="bg-brand-gold py-8 lg:py-10">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <p className="text-[11px] lg:text-xs tracking-[0.25em] uppercase text-brand-dark/80 font-bold mb-6 lg:mb-8 text-center">
            Prečo Orostone
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* 1. Overené realizáciami */}
            <Link 
              to="/realizacie"
              className="group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-lg border border-brand-dark/25 flex items-center justify-center mb-3 group-hover:border-brand-dark/50 group-hover:bg-brand-dark/5 transition-all">
                  <CheckCircle size={20} className="text-brand-dark/80" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-brand-dark mb-0.5">200+</h3>
                <p className="text-[13px] text-brand-dark/70 font-medium mb-1">overených realizácií</p>
                <span className="text-[11px] text-brand-dark/60 font-medium inline-flex items-center gap-1 group-hover:text-brand-dark group-hover:gap-1.5 transition-all">
                  Pozri galériu <ArrowRight size={11} />
                </span>
              </div>
            </Link>

            {/* 2. Rýchle dodanie */}
            <div className="group cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-lg border border-brand-dark/25 flex items-center justify-center mb-3 group-hover:border-brand-dark/50 group-hover:bg-brand-dark/5 transition-all">
                  <Clock size={20} className="text-brand-dark/80" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-brand-dark mb-0.5">24–48h</h3>
                <p className="text-[13px] text-brand-dark/70 font-medium mb-1">expedícia skladom</p>
                <span className="text-[11px] text-brand-dark/60 font-medium inline-flex items-center gap-1 group-hover:text-brand-dark group-hover:gap-1.5 transition-all">
                  Overiť dostupnosť <ArrowRight size={11} />
                </span>
              </div>
            </div>

            {/* 3. Overené parametre */}
            <Link to="/o-kameni" className="group">
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-lg border border-brand-dark/25 flex items-center justify-center mb-3 group-hover:border-brand-dark/50 group-hover:bg-brand-dark/5 transition-all">
                  <Thermometer size={20} className="text-brand-dark/80" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-brand-dark mb-0.5">Do 300°C</h3>
                <p className="text-[13px] text-brand-dark/70 font-medium mb-1">odolnosť voči teplu</p>
                <span className="text-[11px] text-brand-dark/60 font-medium inline-flex items-center gap-1 group-hover:text-brand-dark group-hover:gap-1.5 transition-all">
                  Viac parametrov <ArrowRight size={11} />
                </span>
              </div>
            </Link>

            {/* 4. Vzorky + poradenstvo */}
            <Link to="/kontakt?openWizard=true" className="group">
              <div className="flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-lg border border-brand-dark/25 flex items-center justify-center mb-3 group-hover:border-brand-dark/50 group-hover:bg-brand-dark/5 transition-all">
                  <MessageSquare size={20} className="text-brand-dark/80" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-brand-dark mb-0.5">Zadarmo</h3>
                <p className="text-[13px] text-brand-dark/70 font-medium mb-1">vzorky a poradenstvo</p>
                <span className="text-[11px] text-brand-dark/60 font-medium inline-flex items-center gap-1 group-hover:text-brand-dark group-hover:gap-1.5 transition-all">
                  Objednať vzorku <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="bg-white py-16 lg:py-24 overflow-hidden">
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
              <p className="text-gray-500 text-sm lg:text-base mt-4 font-light">
                Už poznáte naše bestsellery?
              </p>
              
              {/* Navigation Arrows - Desktop */}
              <div className="hidden lg:flex gap-3 mt-8">
                <button 
                  onClick={() => {
                    const container = document.getElementById('featured-carousel');
                    if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                  }}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-colors"
                  aria-label="Previous"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <button 
                  onClick={() => {
                    const container = document.getElementById('featured-carousel');
                    if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                  }}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-colors"
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
                {SHOP_PRODUCTS.slice(0, 8).map((product) => (
                  <Link 
                    key={product.id}
                    to={`/produkt/${product.id}`}
                    className="group flex-shrink-0 w-[280px] lg:w-[300px] snap-start"
                  >
                    <div className="bg-[#F9F9F7] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="aspect-square overflow-hidden bg-white">
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
                          <span className="text-xs text-gray-500 ml-1">
                            ({Math.floor(Math.random() * 200) + 50} recenzií)
                          </span>
                        </div>
                        <h3 className="font-sans font-bold text-brand-dark text-sm mb-1 uppercase tracking-wide line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-1 font-light">
                          {product.description}
                        </p>
                        <p className="text-lg font-bold text-brand-dark">
                          €{product.pricePerM2}
                          <span className="text-sm font-normal text-gray-500">/m²</span>
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

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="font-bold text-brand-gold text-xs tracking-widest uppercase mb-6 block">
              Potrebujete pomoc?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
              Neviete sa rozhodnúť?
            </h2>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
              Naše dosky sú investíciou na celý život. Ak potrebujete poradiť 
              s výberom alebo máte špeciálne požiadavky, sme tu pre vás.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/kontakt">
                <Button size="lg" className="bg-brand-dark text-white px-8 py-4 rounded-full hover:bg-brand-gold hover:text-brand-dark transition-all">
                  Kontaktovať predajcu
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/key-facts">
                <Button variant="outline" size="lg" className="border-gray-300 text-brand-dark px-8 py-4 rounded-full hover:bg-gray-100 transition-all">
                  Technické parametre
                </Button>
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
