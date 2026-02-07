import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  Mail, Phone, MapPin, Clock, ChevronDown, MessageSquare,
  Send, Building2, Calendar
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '@/components/UI/Card';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

// Contact info data
const CONTACT_INFO = [
  {
    icon: Phone,
    title: 'Telefón',
    value: '+421 917 588 738',
    subtitle: 'Po-Pia 8:00 - 17:00',
    href: 'tel:+421917588738'
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'info@orostone.sk',
    subtitle: 'Odpovieme do 24 hodín',
    href: 'mailto:info@orostone.sk'
  },
  {
    icon: MapPin,
    title: 'Showroom',
    value: 'Priemyselná 12',
    subtitle: '821 09 Bratislava',
    href: 'https://maps.google.com'
  },
  {
    icon: Clock,
    title: 'Otváracie hodiny',
    value: 'Po - Pia',
    subtitle: '8:00 - 17:00',
    href: null
  }
];

interface ContactProps {
  onOpenWizard: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onOpenWizard }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('openWizard') === 'true') {
      onOpenWizard();
      setSearchParams(params => {
        params.delete('openWizard');
        return params;
      });
    }
  }, [searchParams, onOpenWizard, setSearchParams]);

  // Scroll to map section
  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useGSAP(() => {
    // Hero Animation
    const heroTl = gsap.timeline();
    
    heroTl.fromTo('.contact-hero-bg',
      { scale: 1.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.5, ease: 'power2.out' }
    );

    heroTl.fromTo('.contact-hero-text',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out' },
      '-=1.5'
    );

    // Hero Parallax
    gsap.to('.contact-hero-bg', {
      y: 150,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Contact cards stagger
    gsap.utils.toArray('.contact-card').forEach((card: any, i) => {
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

    // Map section reveal
    gsap.fromTo('.map-container',
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.map-container',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Form section reveal
    gsap.fromTo('.form-container',
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.form-container',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="overflow-hidden w-full bg-white">

      {/* ==================== HERO SECTION ==================== */}
      <section ref={heroRef} className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 contact-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2500&auto=format&fit=crop"
            alt="Contact Hero"
            className="w-full h-full object-cover brightness-[0.35]"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <span className="contact-hero-text font-sans text-xs font-bold tracking-widest uppercase text-brand-gold mb-6 block">
            Kontakt
          </span>
          <h1 className="contact-hero-text text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-normal leading-[1] mb-8">
            Spojme sa.
          </h1>
          <p className="contact-hero-text font-sans font-light text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12">
            Sme tu pre vás. Či už potrebujete technickú radu, vzorku alebo kompletnú realizáciu.
          </p>

          <button 
            onClick={scrollToMap}
            className="contact-hero-text inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-10 py-5 rounded-full font-medium hover:bg-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Nájsť nás
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

      {/* ==================== CONTACT INFO SECTION ==================== */}
      <section className="py-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">Kontaktné údaje</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark">Ako nás kontaktovať</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_INFO.map((info, index) => {
              const Icon = info.icon;
              const Wrapper = info.href ? 'a' : 'div';
              const wrapperProps = info.href ? { href: info.href, target: info.href.startsWith('http') ? '_blank' : undefined } : {};
              
              return (
                <Wrapper
                  key={index}
                  {...wrapperProps}
                  className={cn(
                    "contact-card p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block",
                    info.href && "cursor-pointer"
                  )}
                >
                  <Icon size={32} className="text-brand-gold mb-4" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{info.title}</h3>
                  <p className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-1">{info.value}</p>
                  <p className="text-base text-gray-500 font-light">{info.subtitle}</p>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== MAP & FORM SECTION ==================== */}
      <section ref={mapRef} className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            {/* Left: Form / CTA */}
            <div className="form-container flex flex-col justify-center">
              <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4 block">Navštívte nás</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-brand-dark mb-6">
                Showroom Bratislava
              </h2>
              <p className="text-gray-500 font-light text-lg leading-relaxed mb-8">
                Príďte si pozrieť naše materiály naživo. V showroome máme vystavené všetky kolekcie 
                a naši konzultanti vám radi poradia s výberom.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building2 size={20} className="text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-brand-dark mb-1">Adresa</h3>
                    <p className="text-gray-500 text-base font-light">Priemyselná 12, 821 09 Bratislava</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-brand-dark mb-1">Otváracie hodiny</h3>
                    <p className="text-gray-500 text-base font-light">Pondelok - Piatok: 8:00 - 17:00</p>
                    <p className="text-gray-400 font-light text-base">Sobota - Nedeľa: Zatvorené</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F9F9F7] p-8 rounded-2xl">
                <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-3">
                  Máte konkrétny projekt?
                </h3>
                <p className="text-gray-500 text-base font-light mb-6">
                  Využite náš interaktívny dopytový formulár pre rýchlejšie spracovanie ponuky.
                </p>
                <Button 
                  onClick={onOpenWizard} 
                  className="w-full bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark rounded-full py-4 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Otvoriť Dopytový Formulár
                </Button>
              </div>
            </div>

            {/* Right: Map */}
            <div className="map-container h-[600px] rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0!2d17.1!3d48.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDA2JzAwLjAiTiAxN8KwMDYnMDAuMCJF!5e0!3m2!1sen!2ssk!4v1600000000000!5m2!1sen!2ssk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-32 bg-brand-dark text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2500&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale" 
            alt="texture" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark opacity-80" />

        <div className="container mx-auto px-6 relative z-10">
          <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-6 block">Začnime spoluprácu</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-8">
            Pripravení na váš projekt
          </h2>
          <p className="text-lg text-gray-400 font-light mb-12 max-w-2xl mx-auto">
            Od prvého kontaktu po finálnu inštaláciu - sme tu pre vás na každom kroku cesty.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={onOpenWizard}
              size="lg" 
              className="bg-brand-gold text-brand-dark px-12 py-8 text-lg rounded-full hover:bg-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Nezáväzný dopyt
            </Button>
            <a href="tel:+421917588738">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white px-12 py-8 text-lg rounded-full hover:bg-white hover:text-brand-dark transition-all"
              >
                Zavolať teraz
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};
