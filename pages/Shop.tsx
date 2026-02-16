import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ChevronLeft, ChevronRight, Star,
  Instagram, ShieldCheck, Flame, Droplets, Sparkles, Sun
} from 'lucide-react';
import { ShopProduct, TESTIMONIALS, REALIZATIONS } from '../constants';
import { BlogPreviewSection } from '../components/Eshop/BlogPreviewSection';
import { getLatestArticles } from '../data/blogArticles';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { useInstagramFeed, getPostImageUrl } from '../hooks/useInstagramFeed';
import { OrderModal } from '../components/Shop/OrderModal';
import { Lightbox } from '../components/UI/Lightbox';
import { SEOHead, OROSTONE_ORGANIZATION_LD } from '../components/UI/SEOHead';
import { Link } from 'react-router-dom';
import type { CollectionGalleryImage } from '../types';

gsap.registerPlugin(ScrollTrigger);

// ===========================================
// PREFETCH: Preload product detail chunk + images on hover
// ===========================================
const prefetchProduct = (product: ShopProduct) => {
  // Prefetch the lazy-loaded ShopProductDetail chunk
  import('./ShopProductDetail');
  // Preload hero + first gallery images into browser cache
  [product.image, ...(product.gallery || []).slice(0, 2)].forEach(url => {
    if (url) { const img = new Image(); img.src = url; }
  });
};

// ===========================================
// STONE EXPERIENCE PIN-POINT DATA
// ===========================================
const STONE_EXPERIENCE_POINTS = [
  {
    id: 'scratch',
    title: 'Odolnosť voči poškriabaniu',
    description: 'Povrch si zachováva prémiový vzhľad aj pri každodennom používaní.',
    side: 'left',
    markerTop: '33%',
  },
  {
    id: 'heat',
    title: 'Vysoká tepelná stabilita',
    description: 'Navrhnuté pre kuchyne, kde je výkon a bezpečnosť absolútnou prioritou.',
    side: 'right',
    markerTop: '22%',
  },
  {
    id: 'stain',
    title: 'Nízka nasiakavosť',
    description: 'Škvrny od vína, kávy či oleja sa čistia rýchlo a bez stresu.',
    side: 'left',
    markerTop: '63%',
  },
  {
    id: 'hygiene',
    title: 'Hygienický povrch',
    description: 'Kompaktný neporézny materiál pre čisté a bezpečné pracovné plochy.',
    side: 'right',
    markerTop: '58%',
  },
  {
    id: 'uv',
    title: 'UV stálosť farieb',
    description: 'Dekor ostáva konzistentný aj v presvetlených interiéroch.',
    side: 'right',
    markerTop: '78%',
  },
] as const;

const STONE_POINT_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  scratch: ShieldCheck,
  heat: Flame,
  stain: Droplets,
  hygiene: Sparkles,
  uv: Sun,
};

// ===========================================
// INSPIRATION GALLERY DATA
// ===========================================
const INSPIRATION_IMAGES = [
  { src: '/images/inspiration/inspiration-1.webp', video: '/videos/inspiration/inspiration-1.mp4', label: 'Kuchyňa', title: 'Moderná kuchyňa', subtitle: 'Elegantný sinterovaný kameň' },
  { src: '/images/inspiration/inspiration-2.webp', video: '/videos/inspiration/inspiration-2.mp4', label: 'Kuchyňa', title: 'Minimalistický dizajn', subtitle: 'Čisté línie a nadčasový štýl' },
  { src: '/images/inspiration/inspiration-3.webp', video: '/videos/inspiration/inspiration-3.mp4', label: 'Kuchyňa', title: 'Prírodná elegancia', subtitle: 'Inšpirované prírodou' },
  { src: '/images/inspiration/inspiration-4.webp', video: '/videos/inspiration/inspiration-4.mp4', label: 'Kuchyňa', title: 'Luxusný priestor', subtitle: 'Prémiové materiály' },
  { src: '/images/inspiration/inspiration-5.webp', video: '/videos/inspiration/inspiration-5.mp4', label: 'Kuchyňa', title: 'Funkčná krása', subtitle: 'Praktickosť a estetika' },
];

// Tripled array for infinite carousel — [set0, set1(middle), set2]
const INSPIRATION_SLIDES = [...INSPIRATION_IMAGES, ...INSPIRATION_IMAGES, ...INSPIRATION_IMAGES];
const INSPIRATION_COUNT = INSPIRATION_IMAGES.length; // 5

// INSTAGRAM_IMAGES removed — now loaded via useInstagramFeed hook

// ===========================================
// HERO VIDEO SLIDES DATA
// ===========================================
const HERO_SLIDES = [
  {
    id: 1,
    video: 'https://cdn.coverr.co/videos/coverr-modern-kitchen-interior-4k-6159/1080p.mp4',
    poster: '/images/home/hero-1.jpeg',
    label: 'Prémiový sinterovaný kameň',
    title: 'Krása kameňa.',
    titleAccent: 'Bez kompromisov.',
    subtitle: 'Prémiové sinterované platne pre náročné interiéry',
    cta: 'Objavte kolekcie',
  },
  {
    id: 2,
    video: 'https://cdn.coverr.co/videos/coverr-modern-kitchen-interior-4k-6159/1080p.mp4',
    poster: '/images/home/hero-2.jpeg',
    label: 'Invisible Cooktop',
    title: 'Neviditeľná',
    titleAccent: 'varná doska.',
    subtitle: 'Revolučná technológia varenia priamo na kameni',
    cta: 'Zistiť viac',
  },
  {
    id: 3,
    video: 'https://cdn.coverr.co/videos/coverr-modern-kitchen-interior-4k-6159/1080p.mp4',
    poster: '/images/home/hero-4.jpeg',
    label: 'Stoly zo sinterovaného kameňa',
    title: 'Dizajnové stoly.',
    titleAccent: 'Na mieru.',
    subtitle: 'Luxusné jedálenské a konferenčné stoly na zákazku',
    cta: 'Pozrieť stoly',
  },
];

// ===========================================
// COMPONENT
// ===========================================
export const Shop = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const heroAutoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { products: SHOP_PRODUCTS, isLoading: productsLoading } = useShopifyProducts();

  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const { posts: instagramPosts, isLoading: igLoading, isUsingFallback: igFallback } = useInstagramFeed(8);

  // Inspiration lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxImages: CollectionGalleryImage[] = INSPIRATION_IMAGES.map((img) => ({
    name: img.label,
    url: img.src,
    publicUrl: img.src,
  }));

  // Inspiration carousel — infinite loop via triple-clone technique
  // inspirationIndex tracks position in the tripled INSPIRATION_SLIDES array.
  // It always starts in the middle set (offset INSPIRATION_COUNT).
  const [inspirationIndex, setInspirationIndex] = useState(INSPIRATION_COUNT); // start at middle set, image 0
  const inspirationAnimating = useRef(false);
  const inspirationTrackRef = useRef<HTMLDivElement>(null);
  const inspirationContainerRef = useRef<HTMLDivElement>(null);
  const inspirationVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Compute offset for the track — centers the slide at `index` in the tripled array
  const getInspirationOffset = useCallback((index: number) => {
    const container = inspirationContainerRef.current;
    const track = inspirationTrackRef.current;
    if (!container || !track) return 0;
    const slide = track.querySelector('.inspiration-slide') as HTMLElement | null;
    if (!slide) return 0;
    const slideWidth = slide.offsetWidth;
    const containerWidth = container.offsetWidth;
    const gap = 16; // gap-4 = 16px
    const centerOffset = (containerWidth - slideWidth) / 2;
    return centerOffset - index * (slideWidth + gap);
  }, []);

  // Set initial position on mount
  useEffect(() => {
    if (inspirationTrackRef.current) {
      gsap.set(inspirationTrackRef.current, { x: getInspirationOffset(INSPIRATION_COUNT) });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goToInspiration = useCallback((newIndex: number) => {
    if (inspirationAnimating.current) return;
    inspirationAnimating.current = true;

    // Immediately update for CSS-driven scale/opacity
    setInspirationIndex(newIndex);

    if (inspirationTrackRef.current) {
      const targetX = getInspirationOffset(newIndex);

      gsap.to(inspirationTrackRef.current, {
        x: targetX,
        duration: 0.6,
        ease: 'power3.out',
        onComplete: () => {
          // After animation: silently snap back to the equivalent position in the middle set
          const logicalIndex = ((newIndex % INSPIRATION_COUNT) + INSPIRATION_COUNT) % INSPIRATION_COUNT;
          const middleIndex = INSPIRATION_COUNT + logicalIndex;

          if (newIndex !== middleIndex) {
            const resetX = getInspirationOffset(middleIndex);
            gsap.set(inspirationTrackRef.current!, { x: resetX });
            setInspirationIndex(middleIndex);
          }

          inspirationAnimating.current = false;
        },
      });
    } else {
      inspirationAnimating.current = false;
    }
  }, [getInspirationOffset]);

  const goNextInspiration = useCallback(() => {
    goToInspiration(inspirationIndex + 1);
  }, [inspirationIndex, goToInspiration]);

  const goPrevInspiration = useCallback(() => {
    goToInspiration(inspirationIndex - 1);
  }, [inspirationIndex, goToInspiration]);

  // Handle window resize — reposition track without animation
  useEffect(() => {
    const handleResize = () => {
      if (inspirationTrackRef.current) {
        gsap.set(inspirationTrackRef.current, { x: getInspirationOffset(inspirationIndex) });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [inspirationIndex, getInspirationOffset]);

  // Play/pause inspiration videos — only the active (center) slide plays
  useEffect(() => {
    inspirationVideoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === inspirationIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [inspirationIndex]);

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
  // HERO SLIDE NAVIGATION
  // ===========================================
  const goToSlide = useCallback((index: number) => {
    // Pause current video
    const currentVideo = videoRefs.current[activeSlide];
    if (currentVideo) currentVideo.pause();

    // Set new slide
    setActiveSlide(index);

    // Play new video
    const nextVideo = videoRefs.current[index];
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }

    // Reset auto-advance timer
    if (heroAutoplayRef.current) clearInterval(heroAutoplayRef.current);
    heroAutoplayRef.current = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % HERO_SLIDES.length;
        const prevVideo = videoRefs.current[prev];
        if (prevVideo) prevVideo.pause();
        const nextVid = videoRefs.current[next];
        if (nextVid) { nextVid.currentTime = 0; nextVid.play().catch(() => {}); }
        return next;
      });
    }, 8000);
  }, [activeSlide]);

  const goToNextSlide = useCallback(() => {
    goToSlide((activeSlide + 1) % HERO_SLIDES.length);
  }, [activeSlide, goToSlide]);

  const goToPrevSlide = useCallback(() => {
    goToSlide((activeSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, [activeSlide, goToSlide]);

  // Auto-advance hero slides
  useEffect(() => {
    heroAutoplayRef.current = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % HERO_SLIDES.length;
        const prevVideo = videoRefs.current[prev];
        if (prevVideo) prevVideo.pause();
        const nextVid = videoRefs.current[next];
        if (nextVid) { nextVid.currentTime = 0; nextVid.play().catch(() => {}); }
        return next;
      });
    }, 8000);
    return () => {
      if (heroAutoplayRef.current) clearInterval(heroAutoplayRef.current);
    };
  }, []);

  // Play first video on mount
  useEffect(() => {
    const firstVideo = videoRefs.current[0];
    if (firstVideo) {
      firstVideo.play().catch(() => {});
    }
  }, []);

  // ===========================================
  // GSAP ANIMATIONS
  // ===========================================
  useGSAP(() => {
    if (!containerRef.current) return;

    // --- Hero text reveal ---
    gsap.fromTo('.hero-text-line', 
      { y: 60, opacity: 0 },
      { 
        y: 0, opacity: 1,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.12,
        delay: 0.3,
      }
    );

    gsap.fromTo('.hero-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.7 }
    );

    gsap.fromTo('.hero-cta',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.9 }
    );

    gsap.fromTo('.hero-nav-arrows',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, delay: 1.2 }
    );

    gsap.fromTo('.hero-indicators',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, delay: 1.3 }
    );

    // --- Parallax effect on hero videos ---
    if (heroRef.current) {
      gsap.to('.hero-video', {
        scale: 1.1,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Stone Experience: Pin-and-reveal scroll animation (desktop only) ---
    const stonePinned = document.querySelector('.stone-experience-pinned');
    if (stonePinned && !reducedMotion) {
      const stoneTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.stone-experience-pinned',
          start: 'top top',
          end: '+=250%',
          scrub: 0.3,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Phase 1 (0–10%): Background expands from inset+rounded to full-bleed
      stoneTl.fromTo('.stone-bg',
        { margin: '80px 120px', borderRadius: '32px' },
        { margin: '0px 0px', borderRadius: '0px', ease: 'power2.out', duration: 0.06 },
        0
      );

      // Heading is always visible — no animation needed

      // Phase 2 (5–18%): Slab reveals quickly with scale + opacity
      stoneTl.fromTo('.stone-slab-wrap',
        { y: 30, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: 'power3.out', duration: 0.13 },
        0.05
      );

      // Phase 4 (20–75%): Each property point reveals one by one
      // Each point = card + its pin + connector appear together
      const pointOrder = [0, 1, 2, 3, 4];
      const allCards = document.querySelectorAll('.stone-experience-pinned .stone-point-card');
      const allPins = document.querySelectorAll('.stone-experience-pinned .stone-pin');
      const allConnectors = document.querySelectorAll('.stone-experience-pinned .stone-connector');

      pointOrder.forEach((i) => {
        const offset = 0.20 + i * 0.11;

        if (allCards[i]) {
          stoneTl.fromTo(allCards[i],
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, ease: 'power2.out', duration: 0.08 },
            offset
          );
        }
        if (allPins[i]) {
          stoneTl.fromTo(allPins[i],
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, ease: 'back.out(1.4)', duration: 0.06 },
            offset + 0.02
          );
        }
        if (allConnectors[i]) {
          stoneTl.fromTo(allConnectors[i],
            { scaleX: 0 },
            { scaleX: 1, ease: 'power2.out', duration: 0.05, transformOrigin: 'center center' },
            offset + 0.03
          );
        }
      });

      // Phase 5 (78–88%): CTA button fades in
      stoneTl.fromTo('.stone-experience-pinned .stone-cta',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', duration: 0.10 },
        0.78
      );

      // 88–100%: Free space before unpin (section releases)

      // Pin pulse animation (independent, not scrub-linked)
      gsap.to('.stone-experience-pinned .stone-pin-pulse', {
        scale: 1.9,
        opacity: 0,
        duration: 1.7,
        ease: 'power1.out',
        stagger: { each: 0.22, repeat: -1 },
        repeat: -1,
        delay: 1,
      });
    }

    // Reduced-motion fallback: show everything immediately, no scroll animation
    if (stonePinned && reducedMotion) {
      gsap.set('.stone-bg', { margin: '0', borderRadius: '0' });
      gsap.set('.stone-slab-wrap', { opacity: 1, y: 0, scale: 1 });
      gsap.set('.stone-experience-pinned .stone-point-card', { opacity: 1, y: 0 });
      gsap.set('.stone-experience-pinned .stone-pin', { opacity: 1, scale: 1 });
      gsap.set('.stone-experience-pinned .stone-connector', { scaleX: 1 });
      gsap.set('.stone-experience-pinned .stone-cta', { opacity: 1, y: 0 });
    }

    // --- Stone Experience: Mobile scroll-triggered reveals (no pinning) ---
    const stoneMobile = document.querySelector('.stone-mobile-section');
    if (stoneMobile && !reducedMotion) {
      // Background: inset + rounded → full-bleed
      gsap.fromTo('.stone-bg-mobile',
        { margin: '40px 24px', borderRadius: '24px' },
        {
          margin: '0px 0px', borderRadius: '0px',
          ease: 'power2.out', duration: 0.8,
          scrollTrigger: {
            trigger: '.stone-mobile-section',
            start: 'top 85%',
            end: 'top 40%',
            scrub: 0.3,
          },
        }
      );

      // Slab: fade-in + scale
      gsap.fromTo('.stone-slab-mobile',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.stone-slab-mobile',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards: staggered fade-in
      gsap.fromTo('.stone-card-mobile',
        { opacity: 0, y: 25 },
        {
          opacity: 1, y: 0,
          duration: 0.6, ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.stone-cards-mobile',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // CTA: fade-in
      gsap.fromTo('.stone-cta-mobile',
        { opacity: 0, y: 15 },
        {
          opacity: 1, y: 0,
          duration: 0.6, ease: 'power2.out',
          scrollTrigger: {
            trigger: '.stone-cta-mobile',
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Mobile reduced-motion fallback
    if (stoneMobile && reducedMotion) {
      gsap.set('.stone-bg-mobile', { margin: '0', borderRadius: '0' });
      gsap.set('.stone-slab-mobile', { opacity: 1, y: 0, scale: 1 });
      gsap.set('.stone-card-mobile', { opacity: 1, y: 0 });
      gsap.set('.stone-cta-mobile', { opacity: 1, y: 0 });
    }

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

    // --- Inspiration carousel entrance ---
    const inspirationContainer = document.querySelector('.inspiration-section .overflow-hidden');
    if (inspirationContainer) {
      gsap.fromTo(inspirationContainer,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.inspiration-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

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

      {/* ==================== CINEMATIC VIDEO HERO CAROUSEL (80vh) ==================== */}
      <section 
        ref={heroRef} 
        className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Video Slides */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
            }`}
          >
            {/* Poster Image Fallback (visible while video loads) */}
            <img
              src={slide.poster}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Video */}
            <video
              ref={(el) => { videoRefs.current[idx] = el; }}
              className="hero-video absolute inset-0 w-full h-full object-cover"
              loop
              muted
              playsInline
              poster={slide.poster}
              preload="metadata"
            >
              <source src={slide.video} type="video/mp4" />
            </video>
          </div>
        ))}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        {/* Centered Content — DJI Reference Style */}
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto" style={{ zIndex: 3 }}>
          {/* Small Category Label */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`label-${activeSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="hero-text-line text-xs md:text-xs tracking-[0.3em] uppercase text-white/60 font-light mb-6"
            >
              {HERO_SLIDES[activeSlide].label}
            </motion.p>
          </AnimatePresence>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${activeSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-1 md:mb-2"
            >
              <h1 className="hero-text-line text-3xl md:text-4xl lg:text-5xl font-sans font-bold tracking-tight leading-[1.1] text-white uppercase">
                {HERO_SLIDES[activeSlide].title}
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* Title Accent */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`accent-${activeSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-5 md:mb-6"
            >
              <span className="hero-text-line text-3xl md:text-4xl lg:text-5xl font-sans font-light italic text-brand-gold tracking-tight leading-[1.1]">
                {HERO_SLIDES[activeSlide].titleAccent}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Subtitle */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${activeSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="hero-subtitle font-sans font-light text-sm md:text-base text-white/50 max-w-md mx-auto mb-8 md:mb-10"
            >
              {HERO_SLIDES[activeSlide].subtitle}
            </motion.p>
          </AnimatePresence>

          {/* CTA Button */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`cta-${activeSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="hero-cta"
            >
              <button
                onClick={() => {
                  const target = document.querySelector('.stone-experience-pinned') || document.querySelector('.stone-experience-section');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-2 border border-white/40 hover:border-white text-white/90 hover:text-white px-6 py-2.5 text-xs md:text-sm tracking-[0.15em] uppercase transition-all duration-300"
              >
                {HERO_SLIDES[activeSlide].cta}
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Left Arrow */}
        <button
          onClick={goToPrevSlide}
          className="hero-nav-arrows absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-12 md:h-12 flex items-center justify-center text-white/40 hover:text-white active:text-white transition-colors duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} strokeWidth={1} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNextSlide}
          className="hero-nav-arrows absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-12 md:h-12 flex items-center justify-center text-white/40 hover:text-white active:text-white transition-colors duration-300"
          aria-label="Next slide"
        >
          <ChevronRight size={28} strokeWidth={1} />
        </button>

        {/* Bottom Slide Indicators */}
        <div className="hero-indicators absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className="group flex items-center gap-2 py-2 transition-all duration-300"
              aria-label={`Slide ${idx + 1}: ${slide.label}`}
            >
              <span
                className={`block h-[2px] rounded-full transition-all duration-500 ${
                  idx === activeSlide
                    ? 'w-8 bg-brand-gold'
                    : 'w-4 bg-white/30 group-hover:bg-white/50'
                }`}
              />
            </button>
          ))}
        </div>
      </section>


      {/* ==================== STONE EXPERIENCE — Pin-and-reveal scroll animation ==================== */}
      <section className="stone-experience-pinned relative hidden lg:block h-screen overflow-hidden">
        {/* Animated background — starts inset + rounded, expands to full-bleed */}
        <div
          className="stone-bg absolute inset-0 bg-brand-gold"
          style={{ margin: '80px 120px', borderRadius: '32px' }}
        />

        {/* Content layer */}
        <div className="stone-content relative z-10 w-full h-full flex items-center justify-center overflow-hidden pt-[112px]">
          <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-8">
            {/* Decorative glow */}
            <div className="stone-glow pointer-events-none absolute inset-x-1/4 -top-8 h-40 rounded-full bg-white/30 blur-3xl opacity-70" />

            {/* Heading */}
            <div className="stone-heading text-center mb-6 lg:mb-8">
              <span className="text-xs lg:text-[11px] tracking-[0.25em] uppercase text-brand-dark/60 font-bold block mb-2">
                Stone Experience
              </span>
              <h2 className="text-3xl lg:text-4xl font-sans font-bold text-brand-dark tracking-tight">
                Jedna platňa. Kompletný zážitok.
              </h2>
              <p className="mt-2 text-sm lg:text-base text-brand-dark/70 max-w-2xl mx-auto font-light">
                Objavte materiál navrhnutý pre estetiku, výkon a pokoj v každodennom používaní.
              </p>
            </div>

            {/* 3-column layout */}
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,300px)_minmax(0,1fr)] gap-6 items-center">
              {/* Left cards */}
              <div className="space-y-4 pr-4">
                {STONE_EXPERIENCE_POINTS.filter((point) => point.side === 'left').map((point, index) => {
                  const Icon = STONE_POINT_ICONS[point.id];
                  return (
                    <article key={point.id} className="stone-point stone-point-card bg-white/78 backdrop-blur-sm border border-white/65 rounded-xl p-4 shadow-[0_12px_32px_rgba(0,0,0,0.12)] opacity-0">
                      <div className="flex items-center gap-3">
                        {Icon && (
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-dark/8 flex items-center justify-center">
                            <Icon size={20} className="text-brand-dark/70" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] tracking-[0.18em] uppercase text-brand-dark/45 mb-1">0{index + 1}</p>
                          <h3 className="text-sm font-bold text-brand-dark mb-1">{point.title}</h3>
                          <p className="text-xs text-brand-dark/70 leading-relaxed">{point.description}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Center slab */}
              <div className="stone-slab-wrap relative flex items-center justify-center opacity-0">
                <div className="stone-slab relative w-full max-w-[300px] aspect-[9/16] rounded-[28px] p-2 bg-gradient-to-br from-white/70 via-white/20 to-black/10 shadow-[0_35px_80px_rgba(0,0,0,0.25)]">
                  <div className="w-full h-full rounded-[22px] overflow-hidden border border-white/40">
                    <img
                      src="/images/yabo-white-slab.jpg"
                      alt="YABO WHITE platňa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-[22px] bg-gradient-to-t from-black/25 via-transparent to-white/10 pointer-events-none" />

                  {STONE_EXPERIENCE_POINTS.map((point) => (
                    <div
                      key={`pin-${point.id}`}
                      className={`stone-pin absolute -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-brand-dark border-2 border-white shadow-[0_0_0_6px_rgba(255,255,255,0.25)] opacity-0 ${
                        point.side === 'left' ? '-left-2' : '-right-2'
                      }`}
                      style={{ top: point.markerTop }}
                    >
                      <span
                        className={`stone-connector absolute top-1/2 -translate-y-1/2 h-[1px] bg-brand-dark/45 ${
                          point.side === 'left' ? 'right-full w-10' : 'left-full w-10'
                        }`}
                      />
                      <span className="stone-pin-pulse absolute inset-0 rounded-full border border-brand-dark/60" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right cards */}
              <div className="space-y-4 pl-4">
                {STONE_EXPERIENCE_POINTS.filter((point) => point.side === 'right').map((point, index) => {
                  const Icon = STONE_POINT_ICONS[point.id];
                  return (
                    <article key={point.id} className="stone-point stone-point-card bg-white/78 backdrop-blur-sm border border-white/65 rounded-xl p-4 shadow-[0_12px_32px_rgba(0,0,0,0.12)] opacity-0">
                      <div className="flex items-center gap-3">
                        {Icon && (
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-dark/8 flex items-center justify-center">
                            <Icon size={20} className="text-brand-dark/70" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] tracking-[0.18em] uppercase text-brand-dark/45 mb-1">
                            0{STONE_EXPERIENCE_POINTS.filter((p) => p.side === 'left').length + index + 1}
                          </p>
                          <h3 className="text-sm font-bold text-brand-dark mb-1">{point.title}</h3>
                          <p className="text-xs text-brand-dark/70 leading-relaxed">{point.description}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="stone-cta text-center mt-6 lg:mt-8 opacity-0">
              <Link
                to="/kategoria/sintered-stone"
                className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-3.5 rounded-full text-xs lg:text-sm tracking-[0.16em] uppercase font-semibold hover:bg-white hover:text-brand-dark transition-all duration-300"
              >
                Objaviť všetky dekory
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile / Tablet — scroll-triggered reveal animations (no pinning) */}
      <section className="stone-mobile-section relative py-16 lg:hidden overflow-hidden">
        {/* Animated background — starts inset + rounded, expands on scroll */}
        <div
          className="stone-bg-mobile absolute inset-0 bg-brand-gold"
          style={{ margin: '40px 24px', borderRadius: '24px' }}
        />

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs tracking-[0.25em] uppercase text-brand-dark/60 font-bold block mb-3">
              Stone Experience
            </span>
            <h2 className="text-3xl font-sans font-bold text-brand-dark tracking-tight">
              Jedna platňa. Kompletný zážitok.
            </h2>
            <p className="mt-4 text-sm text-brand-dark/70 max-w-2xl mx-auto font-light">
              Objavte materiál navrhnutý pre estetiku, výkon a pokoj v každodennom používaní.
            </p>
          </div>
          <div className="stone-slab-mobile relative rounded-3xl overflow-hidden border border-white/40 shadow-[0_20px_55px_rgba(0,0,0,0.22)] mb-6 max-w-[340px] mx-auto opacity-0">
            <div className="aspect-[9/16]">
              <img src="/images/yabo-white-slab.jpg" alt="YABO WHITE platňa" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>
          <div className="stone-cards-mobile grid sm:grid-cols-2 gap-3">
            {STONE_EXPERIENCE_POINTS.map((point, index) => {
              const Icon = STONE_POINT_ICONS[point.id];
              return (
                <article key={point.id} className="stone-card-mobile bg-white/80 backdrop-blur-sm border border-white/70 rounded-xl p-4 opacity-0">
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-dark/8 flex items-center justify-center">
                        <Icon size={20} className="text-brand-dark/70" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] tracking-[0.18em] uppercase text-brand-dark/45 mb-1">0{index + 1}</p>
                      <h3 className="text-sm font-bold text-brand-dark mb-1">{point.title}</h3>
                      <p className="text-xs text-brand-dark/70 leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="stone-cta-mobile text-center mt-10 opacity-0">
            <Link
              to="/kategoria/sintered-stone"
              className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-3.5 rounded-full text-xs tracking-[0.16em] uppercase font-semibold hover:bg-white hover:text-brand-dark transition-all duration-300"
            >
              Objaviť všetky dekory
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== INSPIRUJTE SA — Inspiration Carousel ==================== */}
      <section className="inspiration-section py-20 lg:py-28 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="inspiration-header section-reveal text-center mb-12 lg:mb-16">
            <span className="text-xs lg:text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-3 block">
              Inšpirácie
            </span>
            <h2 className="text-3xl lg:text-4xl font-sans font-bold text-brand-dark">
              Inspirujte sa
            </h2>
            <p className="text-gray-400 text-sm lg:text-base mt-3 font-light max-w-lg mx-auto">
              Ako môže sinterovaný kameň premeniť váš priestor
            </p>
          </div>

          {/* Carousel — infinite loop with tripled slides */}
          <div ref={inspirationContainerRef} className="relative">
            {/* Track container */}
            <div className="overflow-hidden rounded-2xl">
              <div
                ref={inspirationTrackRef}
                className="flex gap-4"
                style={{ willChange: 'transform' }}
              >
                {INSPIRATION_SLIDES.map((img, idx) => {
                  const isCenter = idx === inspirationIndex;
                  const isAdjacent = idx === inspirationIndex - 1 || idx === inspirationIndex + 1;

                  return (
                    <div
                      key={idx}
                      className="inspiration-slide flex-shrink-0 relative rounded-2xl overflow-hidden cursor-pointer w-[92vw] sm:w-[80vw] lg:w-[50%]"
                      style={{
                        aspectRatio: '16 / 9',
                        transform: isCenter ? 'scale(1)' : 'scale(0.92)',
                        opacity: isCenter ? 1 : isAdjacent ? 0.6 : 0.3,
                        transition: 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.6s cubic-bezier(0.33, 1, 0.68, 1)',
                      }}
                      onClick={() => {
                        if (isCenter) {
                          const logicalIdx = idx % INSPIRATION_COUNT;
                          setLightboxIndex(logicalIdx);
                          setLightboxOpen(true);
                        } else {
                          goToInspiration(idx);
                        }
                      }}
                    >
                      {/* Poster image (visible while video loads or if video missing) */}
                      <img
                        src={img.src}
                        alt={img.label}
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      {/* VEO-generated video — plays only on center slide */}
                      <video
                        ref={(el) => { inspirationVideoRefs.current[idx] = el; }}
                        className="absolute inset-0 w-full h-full object-cover"
                        loop
                        muted
                        playsInline
                        poster={img.src}
                        preload={isCenter ? 'auto' : 'none'}
                      >
                        <source src={img.video} type="video/mp4" />
                      </video>

                      {/* Dark gradient overlay for text readability */}
                      <div
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{
                          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)',
                          opacity: isCenter ? 1 : 0.3,
                        }}
                      />

                      {/* Text overlay — integrated into image, visible on center */}
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 transition-all duration-500"
                        style={{
                          opacity: isCenter ? 1 : 0,
                          transform: isCenter ? 'translateY(0)' : 'translateY(16px)',
                        }}
                      >
                        <span className="text-xs lg:text-[11px] tracking-[0.3em] uppercase text-white/80 font-medium mb-2 lg:mb-3">
                          {img.label}
                        </span>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-sans font-bold text-white leading-tight mb-1 lg:mb-2 drop-shadow-lg">
                          {img.title}
                        </h3>
                        <p className="text-xs lg:text-sm text-white/70 font-light">
                          {img.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Arrow buttons */}
            <button
              onClick={goPrevInspiration}
              className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="Predchádzajúca inšpirácia"
            >
              <ChevronLeft size={20} className="text-brand-dark" />
            </button>
            <button
              onClick={goNextInspiration}
              className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="Nasledujúca inšpirácia"
            >
              <ChevronRight size={20} className="text-brand-dark" />
            </button>

            {/* Dot indicators — mapped to 5 logical images */}
            <div className="flex justify-center gap-2 mt-6 lg:mt-8">
              {INSPIRATION_IMAGES.map((_, idx) => {
                const activeLogical = ((inspirationIndex % INSPIRATION_COUNT) + INSPIRATION_COUNT) % INSPIRATION_COUNT;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      // Navigate to the corresponding position in the middle set
                      goToInspiration(INSPIRATION_COUNT + idx);
                    }}
                    className={`rounded-full transition-all duration-300 ${
                      idx === activeLogical
                        ? 'w-8 h-2 bg-brand-gold'
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Inšpirácia ${idx + 1}`}
                  />
                );
              })}
            </div>
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
                <span className="text-xs lg:text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-4 block">
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
                  onMouseEnter={() => prefetchProduct(spotlightProduct)}
                  onTouchStart={() => prefetchProduct(spotlightProduct)}
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
                    onMouseEnter={() => prefetchProduct(product)}
                    onTouchStart={() => prefetchProduct(product)}
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
                className="lg:hidden absolute left-0 top-1/3 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-dark z-10 active:bg-gray-100"
                aria-label="Previous"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
              <button 
                onClick={() => {
                  const container = document.getElementById('featured-carousel');
                  if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                }}
                className="lg:hidden absolute right-0 top-1/3 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-dark z-10 active:bg-gray-100"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BLOG PREVIEW SECTION ==================== */}
      <BlogPreviewSection articles={getLatestArticles(5)} />

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="testimonials-section py-20 lg:py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="testimonial-inner max-w-3xl mx-auto text-center">
            <span className="text-xs lg:text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-3 block">
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
            <span className="text-xs lg:text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-3 block">
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

      {/* ==================== CTA SECTION ==================== */}
      <section className="cta-section py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="cta-content max-w-3xl mx-auto text-center">
            <span className="text-xs lg:text-[11px] tracking-[0.3em] uppercase text-brand-gold font-bold mb-4 block">
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

      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrevious={() => setLightboxIndex((prev) => Math.max(0, prev - 1))}
        onNext={() => setLightboxIndex((prev) => Math.min(lightboxImages.length - 1, prev + 1))}
      />
    </main>
  );
};
