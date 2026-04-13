import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Palette, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { SEOHead, createBreadcrumbLD } from '@/components/UI/SEOHead';
import { ImageReveal } from '@/components/UI/ImageReveal';
import { useScrollLock } from '@/hooks/useScrollLock';

/* ─── PROJECT DATA ───────────────────────────────────── */

interface Project {
  id: string;
  title: string;
  material: string;
  hero: string;
  gallery: string[];
  featured?: boolean;
}

const PROJECTS: Project[] = [
  {
    id: 'calacatta-gold-stena',
    title: 'Calacatta Gold — kamenná stena',
    material: 'Calacatta Gold',
    hero: '/images/realizacie/calacatta-gold-stena-hero.webp',
    gallery: [
      '/images/realizacie/calacatta-gold-stena-hero.webp',
      '/images/realizacie/calacatta-gold-stena-1.webp',
      '/images/realizacie/calacatta-gold-stena-2.webp',
      '/images/realizacie/calacatta-gold-stena-3.webp',
    ],
    featured: true,
  },
  {
    id: 'biely-statuario',
    title: 'Biely Statuario',
    material: 'Polaris Statuario White',
    hero: '/images/realizacie/biely-statuario-hero.webp',
    gallery: [
      '/images/realizacie/biely-statuario-hero.webp',
      '/images/realizacie/biely-statuario-1.webp',
      '/images/realizacie/biely-statuario-2.webp',
    ],
  },
  {
    id: 'krb-zeleny-mramor',
    title: 'Krb — zelený mramor',
    material: 'Verde Alpi',
    hero: '/images/realizacie/krb-zeleny-mramor-hero.webp',
    gallery: [
      '/images/realizacie/krb-zeleny-mramor-hero.webp',
      '/images/realizacie/krb-zeleny-mramor-1.webp',
      '/images/realizacie/krb-zeleny-mramor-2.webp',
      '/images/realizacie/krb-zeleny-mramor-3.webp',
    ],
  },
  {
    id: 'svetly-onyx-showroom',
    title: 'Svetlý onyx — showroom',
    material: 'Svetlý Onyx',
    hero: '/images/realizacie/svetly-onyx-showroom-hero.webp',
    gallery: [
      '/images/realizacie/svetly-onyx-showroom-hero.webp',
      '/images/realizacie/svetly-onyx-showroom-1.webp',
      '/images/realizacie/svetly-onyx-showroom-2.webp',
      '/images/realizacie/svetly-onyx-showroom-3.webp',
    ],
  },
  {
    id: 'sivy-kamen-kuchyna',
    title: 'Sivý kameň — kuchyňa',
    material: 'Sivý kameň',
    hero: '/images/realizacie/sivy-kamen-kuchyna-hero.webp',
    gallery: [
      '/images/realizacie/sivy-kamen-kuchyna-hero.webp',
      '/images/realizacie/sivy-kamen-kuchyna-1.webp',
      '/images/realizacie/sivy-kamen-kuchyna-2.webp',
    ],
  },
  {
    id: 'biely-mramor-sive-zilky',
    title: 'Biely mramor — sivé žilky',
    material: 'Biely mramor',
    hero: '/images/realizacie/biely-mramor-sive-zilky-hero.webp',
    gallery: [
      '/images/realizacie/biely-mramor-sive-zilky-hero.webp',
      '/images/realizacie/biely-mramor-sive-zilky-1.webp',
      '/images/realizacie/biely-mramor-sive-zilky-2.webp',
    ],
  },
  {
    id: 'biela-doska-ruzova-kuchyna',
    title: 'Biela doska — ružová kuchyňa',
    material: 'Super White',
    hero: '/images/realizacie/biela-doska-ruzova-kuchyna-hero.webp',
    gallery: [
      '/images/realizacie/biela-doska-ruzova-kuchyna-hero.webp',
      '/images/realizacie/biela-doska-ruzova-kuchyna-1.webp',
      '/images/realizacie/biela-doska-ruzova-kuchyna-2.webp',
    ],
  },
  {
    id: 'calacatta-oro-lustre',
    title: 'Calacatta Oro — lustre',
    material: 'Calacatta Oro',
    hero: '/images/realizacie/calacatta-oro-lustre-hero.webp',
    gallery: [
      '/images/realizacie/calacatta-oro-lustre-hero.webp',
      '/images/realizacie/calacatta-oro-lustre-1.webp',
      '/images/realizacie/calacatta-oro-lustre-2.webp',
    ],
  },
  {
    id: 'calacatta-verde',
    title: 'Calacatta Verde',
    material: 'Calacatta Verde',
    hero: '/images/realizacie/calacatta-verde-hero.webp',
    gallery: [
      '/images/realizacie/calacatta-verde-hero.webp',
      '/images/realizacie/calacatta-verde-1.webp',
      '/images/realizacie/calacatta-verde-2.webp',
    ],
  },
  {
    id: 'tmavoseda-doska',
    title: 'Tmavosedá doska',
    material: 'Tmavosedý kameň',
    hero: '/images/realizacie/tmavoseda-doska-hero.webp',
    gallery: [
      '/images/realizacie/tmavoseda-doska-hero.webp',
      '/images/realizacie/tmavoseda-doska-1.webp',
      '/images/realizacie/tmavoseda-doska-2.webp',
    ],
  },
  {
    id: 'krb-biely-mramor',
    title: 'Krb — biely mramor',
    material: 'Bianco Statuario',
    hero: '/images/realizacie/krb-biely-mramor-hero.webp',
    gallery: [
      '/images/realizacie/krb-biely-mramor-hero.webp',
    ],
  },
  {
    id: 'bezovy-travertin-mix',
    title: 'Béžový travertín mix',
    material: 'Béžový travertín',
    hero: '/images/realizacie/bezovy-travertin-mix-hero.webp',
    gallery: [
      '/images/realizacie/bezovy-travertin-mix-hero.webp',
      '/images/realizacie/bezovy-travertin-mix-1.webp',
      '/images/realizacie/bezovy-travertin-mix-2.webp',
    ],
  },
  {
    id: 'zlatobiely-mramor',
    title: 'Zlatobiely mramor',
    material: 'Calacatta Gold',
    hero: '/images/realizacie/zlatobiely-mramor-hero.webp',
    gallery: [
      '/images/realizacie/zlatobiely-mramor-hero.webp',
    ],
  },
  {
    id: 'biely-mramor-montaz',
    title: 'Biely mramor — montáž',
    material: 'Biely mramor',
    hero: '/images/realizacie/biely-mramor-montaz-hero.webp',
    gallery: [
      '/images/realizacie/biely-mramor-montaz-hero.webp',
      '/images/realizacie/biely-mramor-montaz-1.webp',
      '/images/realizacie/biely-mramor-montaz-2.webp',
    ],
  },
  {
    id: 'bezovy-mramor-fenix',
    title: 'Béžový mramor FENIX',
    material: 'Béžový mramor',
    hero: '/images/realizacie/bezovy-mramor-fenix-hero.webp',
    gallery: [
      '/images/realizacie/bezovy-mramor-fenix-hero.webp',
      '/images/realizacie/bezovy-mramor-fenix-1.webp',
      '/images/realizacie/bezovy-mramor-fenix-2.webp',
    ],
  },
  {
    id: 'calacatta-gold-montaz',
    title: 'Calacatta Gold — montáž',
    material: 'Calacatta Gold',
    hero: '/images/realizacie/calacatta-gold-montaz-hero.webp',
    gallery: [
      '/images/realizacie/calacatta-gold-montaz-hero.webp',
      '/images/realizacie/calacatta-gold-montaz-1.webp',
      '/images/realizacie/calacatta-gold-montaz-2.webp',
    ],
  },
  {
    id: 'cierny-kamen-kuchyna',
    title: 'Čierny kameň — kuchyňa',
    material: 'Nero Marquina',
    hero: '/images/realizacie/cierny-kamen-kuchyna-hero.webp',
    gallery: [
      '/images/realizacie/cierny-kamen-kuchyna-hero.webp',
      '/images/realizacie/cierny-kamen-kuchyna-1.webp',
      '/images/realizacie/cierny-kamen-kuchyna-2.webp',
    ],
  },
  {
    id: 'sivy-kamen-kniznica',
    title: 'Sivý kameň — knižnica',
    material: 'Sivý kameň',
    hero: '/images/realizacie/sivy-kamen-kniznica-hero.webp',
    gallery: [
      '/images/realizacie/sivy-kamen-kniznica-hero.webp',
    ],
  },
  {
    id: 'calacatta-gold-hex',
    title: 'Calacatta Gold — hex',
    material: 'Calacatta Gold',
    hero: '/images/realizacie/calacatta-gold-hex-hero.webp',
    gallery: [
      '/images/realizacie/calacatta-gold-hex-hero.webp',
    ],
  },
  {
    id: 'biely-mramor-drevena-stena',
    title: 'Biely mramor — drevená stena',
    material: 'Biely mramor',
    hero: '/images/realizacie/biely-mramor-drevena-stena-hero.webp',
    gallery: [
      '/images/realizacie/biely-mramor-drevena-stena-hero.webp',
      '/images/realizacie/biely-mramor-drevena-stena-1.webp',
    ],
  },
  {
    id: 'sivy-kamen-stolicky',
    title: 'Sivý kameň — stoličky',
    material: 'Sivý kameň',
    hero: '/images/realizacie/sivy-kamen-stolicky-hero.webp',
    gallery: [
      '/images/realizacie/sivy-kamen-stolicky-hero.webp',
    ],
  },
  {
    id: 'svetly-mramor-lamely',
    title: 'Svetlý mramor — lamely',
    material: 'Svetlý mramor',
    hero: '/images/realizacie/svetly-mramor-lamely-hero.webp',
    gallery: [
      '/images/realizacie/svetly-mramor-lamely-hero.webp',
      '/images/realizacie/svetly-mramor-lamely-1.webp',
    ],
  },
  {
    id: 'sivy-mramor-modre-skrinky',
    title: 'Sivý mramor — modré skrinky',
    material: 'Sivý mramor',
    hero: '/images/realizacie/sivy-mramor-modre-skrinky-hero.webp',
    gallery: [
      '/images/realizacie/sivy-mramor-modre-skrinky-hero.webp',
      '/images/realizacie/sivy-mramor-modre-skrinky-1.webp',
    ],
  },
  {
    id: 'biely-mramor-cierne-skrinky',
    title: 'Biely mramor — čierne skrinky',
    material: 'Biely mramor',
    hero: '/images/realizacie/biely-mramor-cierne-skrinky-hero.webp',
    gallery: [
      '/images/realizacie/biely-mramor-cierne-skrinky-hero.webp',
      '/images/realizacie/biely-mramor-cierne-skrinky-1.webp',
      '/images/realizacie/biely-mramor-cierne-skrinky-2.webp',
    ],
  },
  {
    id: 'tmavy-kamen-zelene-skrinky',
    title: 'Tmavý kameň — zelené skrinky',
    material: 'Tmavý kameň',
    hero: '/images/realizacie/tmavy-kamen-zelene-skrinky-hero.webp',
    gallery: [
      '/images/realizacie/tmavy-kamen-zelene-skrinky-hero.webp',
      '/images/realizacie/tmavy-kamen-zelene-skrinky-1.webp',
    ],
  },
  {
    id: 'bezovy-kamen-stol',
    title: 'Béžový kameň — stôl',
    material: 'Béžový kameň',
    hero: '/images/realizacie/bezovy-kamen-stol-hero.webp',
    gallery: [
      '/images/realizacie/bezovy-kamen-stol-hero.webp',
    ],
  },
  {
    id: 'sivy-mramor-u-kuchyna',
    title: 'Sivý mramor — U kuchyňa',
    material: 'Sivý mramor',
    hero: '/images/realizacie/sivy-mramor-u-kuchyna-hero.webp',
    gallery: [
      '/images/realizacie/sivy-mramor-u-kuchyna-hero.webp',
      '/images/realizacie/sivy-mramor-u-kuchyna-1.webp',
      '/images/realizacie/sivy-mramor-u-kuchyna-2.webp',
    ],
  },
  {
    id: 'biela-doska-led',
    title: 'Biela doska — LED',
    material: 'Biela doska',
    hero: '/images/realizacie/biela-doska-led-hero.webp',
    gallery: [
      '/images/realizacie/biela-doska-led-hero.webp',
      '/images/realizacie/biela-doska-led-1.webp',
      '/images/realizacie/biela-doska-led-2.webp',
    ],
  },
  {
    id: 'biely-calacatta-chevron',
    title: 'Biely Calacatta — chevron',
    material: 'Calacatta Bianco',
    hero: '/images/realizacie/biely-calacatta-chevron-hero.webp',
    gallery: [
      '/images/realizacie/biely-calacatta-chevron-hero.webp',
      '/images/realizacie/biely-calacatta-chevron-1.webp',
      '/images/realizacie/biely-calacatta-chevron-2.webp',
    ],
  },
  {
    id: 'arden-gold-kuchyna',
    title: 'Arden Gold — kuchyňa',
    material: 'Arden Gold',
    hero: '/images/realizacie/arden-gold-kuchyna-hero.webp',
    gallery: [
      '/images/realizacie/arden-gold-kuchyna-hero.webp',
      '/images/realizacie/arden-gold-kuchyna-1.webp',
    ],
  },
];

const FEATURED = PROJECTS.find((p) => p.featured)!;
const GRID_PROJECTS = PROJECTS.filter((p) => !p.featured);

const STATS = [
  { value: '150+', label: 'Realizácií' },
  { value: '12', label: 'Dekórov' },
  { value: '10–15', label: 'Pracovných dní' },
  { value: '24', label: 'Mesiacov záruka' },
];

const breadcrumbLD = createBreadcrumbLD([
  { name: 'Domov', url: 'https://orostone.sk/' },
  { name: 'Realizácie', url: 'https://orostone.sk/realizacie' },
]);

/* ─── LIGHTBOX ───────────────────────────────────────── */

const Lightbox: React.FC<{
  images: string[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}> = ({ images, index, onClose, onNav }) => {
  useScrollLock(true);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && index > 0) onNav(index - 1);
      else if (e.key === 'ArrowRight' && index < images.length - 1) onNav(index + 1);
    },
    [index, images.length, onClose, onNav],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors p-2"
        aria-label="Zavrieť"
      >
        <X size={28} />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-light tracking-wider">
          {index + 1} / {images.length}
        </div>
      )}

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav(index - 1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
          aria-label="Predchádzajúca"
        >
          <ChevronLeft size={36} />
        </button>
      )}

      {/* Next */}
      {index < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav(index + 1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
          aria-label="Nasledujúca"
        >
          <ChevronRight size={36} />
        </button>
      )}

      {/* Image */}
      <motion.img
        key={images[index]}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        src={images[index]}
        alt=""
        className="max-w-[92vw] max-h-[88vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

/* ─── PAGE ───────────────────────────────────────────── */

export const Realizacie = () => {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const openLightbox = (project: Project, startIndex = 0) => {
    setLightbox({ images: project.gallery, index: startIndex });
  };

  return (
    <div className="bg-white">
      <SEOHead
        title="Realizácie | Kuchyne a interiéry zo sinterovaného kameňa | Orostone"
        description="Pozrite si naše reálne realizácie kuchýň, krbov a interiérov zo sinterovaného kameňa. Calacatta Gold, Statuario, onyx a ďalšie dekóry v skutočných projektoch."
        canonical="https://orostone.sk/realizacie"
        keywords={['realizácie sinterovaný kameň', 'kuchyne sinterovaný kameň', 'kuchynská doska realizácie', 'sinterovaný kameň portfólio']}
        structuredData={breadcrumbLD}
      />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block"
          >
            Portfólio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-brand-dark mb-6"
          >
            Naše realizácie
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 text-lg font-light max-w-2xl mx-auto"
          >
            Každý projekt je unikátny — od kompaktných bytov po rozľahlé vily. Pozrite sa, ako sinterovaný kameň Orostone mení reálne priestory.
          </motion.p>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="py-12 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-brand-gold">{s.value}</div>
                <div className="text-sm text-gray-500 font-light mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Project ──────────────────────────── */}
      <section className="py-20 md:py-28 bg-brand-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <span className="text-xs font-bold text-brand-gold tracking-widest uppercase">
                Odporúčaný projekt
              </span>
            </motion.div>

            {/* Hero image */}
            <div
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(FEATURED, 0)}
            >
              <ImageReveal
                src={FEATURED.hero}
                alt={FEATURED.title}
                aspectRatio="aspect-[16/9]"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {FEATURED.title}
                </h2>
                <p className="text-white/70 font-light flex items-center gap-2">
                  <Palette size={16} className="text-brand-gold" />
                  {FEATURED.material}
                </p>
              </div>
              {/* Hover hint */}
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye size={14} />
                Zobraziť galériu
              </div>
            </div>

            {/* Gallery thumbnails */}
            {FEATURED.gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {FEATURED.gallery.slice(1, 4).map((img, i) => (
                  <motion.div
                    key={img}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                    className="aspect-[16/10] rounded-xl overflow-hidden cursor-pointer group/thumb"
                    onClick={() => openLightbox(FEATURED, i + 1)}
                  >
                    <img
                      src={img}
                      alt={`${FEATURED.title} — detail ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-105"
                      loading="lazy"
                      width={400}
                      height={250}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Projects Grid ─────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-brand-dark mb-4"
            >
              Ďalšie projekty
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-500 font-light max-w-xl mx-auto"
            >
              Kuchyne, krby a interiéry z celého Slovenska
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {GRID_PROJECTS.map((project, i) => {
              const isWide = i % 5 === 2; // every 5th card goes full width for visual rhythm
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.15 }}
                  className={`bg-[#F9F9F7] rounded-3xl overflow-hidden cursor-pointer group ${
                    isWide ? 'md:col-span-2' : ''
                  }`}
                  onClick={() => openLightbox(project)}
                >
                  <div className={`relative overflow-hidden ${isWide ? 'aspect-[21/9]' : 'aspect-[16/10]'}`}>
                    <img
                      src={project.hero}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      width={isWide ? 1200 : 800}
                      height={isWide ? 514 : 500}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold tracking-wide flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        <Eye size={16} />
                        Zobraziť galériu
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-brand-dark text-lg mb-1">{project.title}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <Palette size={14} className="text-brand-gold flex-shrink-0" />
                      <span className="text-gray-500 font-light">{project.material}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────── */}
      <section className="py-20 bg-[#F9F9F7]">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
            Ako to funguje
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-12">
            Od konzultácie po hotovú kuchyňu
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4 text-brand-dark font-bold">1</div>
              <h3 className="font-bold text-brand-dark mb-2">Konzultácia</h3>
              <p className="text-sm text-gray-500 font-light">Pomôžeme s výberom dekóru a hrúbky. Pošleme vzorky zadarmo.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4 text-brand-dark font-bold">2</div>
              <h3 className="font-bold text-brand-dark mb-2">Zameranie a výroba</h3>
              <p className="text-sm text-gray-500 font-light">Technik zameria priestor. CNC výroba na presné rozmery.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4 text-brand-dark font-bold">3</div>
              <h3 className="font-bold text-brand-dark mb-2">Montáž</h3>
              <p className="text-sm text-gray-500 font-light">Profesionálna inštalácia do 15 pracovných dní od objednávky.</p>
            </div>
          </div>
          <Link
            to="/blog/od-merania-po-instalaciu-proces-orostone"
            className="inline-flex items-center gap-2 text-brand-gold font-semibold hover:text-brand-dark transition-colors mt-10"
          >
            Podrobný popis procesu
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
            Chcete podobný výsledok?
          </h2>
          <p className="text-gray-500 text-lg font-light mb-10">
            Kontaktujte nás pre nezáväznú konzultáciu. Poradíme s materiálom, pripravíme cenovú ponuku a zrealizujeme projekt od A po Z.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 bg-brand-gold text-brand-dark px-8 py-4 rounded-full font-semibold hover:bg-brand-dark hover:text-white transition-all"
            >
              Nezáväzná konzultácia
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/vzorky"
              className="inline-flex items-center gap-2 border-2 border-brand-dark text-brand-dark px-8 py-4 rounded-full font-semibold hover:bg-brand-dark hover:text-white transition-all"
            >
              Objednať vzorky zadarmo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Lightbox ──────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            index={lightbox.index}
            onClose={() => setLightbox(null)}
            onNav={(i) => setLightbox((prev) => prev ? { ...prev, index: i } : null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
