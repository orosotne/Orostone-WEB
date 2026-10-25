import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SEOHead, createBreadcrumbLD } from '@/components/UI/SEOHead';
import {
  ActionButton,
  Container,
  Eyebrow,
  GoldBand,
  PageHero,
  Section,
  SectionHeader,
  StepList,
  TextLink,
} from '@/components/Design';
import { useScrollLock } from '@/hooks/useScrollLock';
import { photoFade, usePhotoLayers } from '@/hooks/usePhotoLayers';
import { preloadImage } from '@/lib/shopifyImage';
import { SPRING } from '@/lib/motion';
import { CUSTOMER_JOURNEY_NOTE, CUSTOMER_JOURNEY_STEPS } from '@/data/customerJourney';

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
    material: 'Prada Green',
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
    title: 'Taj Mahal — dlhý ostrovček s drezom',
    material: 'Taj Mahal',
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
    title: 'Taj Mahal — kuchyňa',
    material: 'Taj Mahal',
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
    title: 'Arden Gold — lustre',
    material: 'Arden Gold',
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
    title: 'Arden Gold',
    material: 'Arden Gold',
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
    title: 'Yabo White — knižnica',
    material: 'Yabo White',
    hero: '/images/realizacie/sivy-kamen-kniznica-hero.webp',
    gallery: [
      '/images/realizacie/sivy-kamen-kniznica-hero.webp',
    ],
  },
  {
    id: 'calacatta-gold-hex',
    title: 'Arden Gold — hex',
    material: 'Arden Gold',
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
    title: 'Yabo White — stoličky',
    material: 'Yabo White',
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

// The 24 months are the statutory liability for defects, not a benefit of ours, so they are not a tile (owner decision 25. 10. 2026).
const STATS = [
  { value: '150+', label: 'Realizácií' },
  { value: '12', label: 'Dekorov' },
  { value: '10–15', label: 'Pracovných dní' },
];

// The one public customer journey, the same three steps as on the homepage
const STEPS = [...CUSTOMER_JOURNEY_STEPS];

const breadcrumbLD = createBreadcrumbLD([
  { name: 'Domov', url: 'https://orostone.sk/' },
  { name: 'Realizácie', url: 'https://orostone.sk/realizacie' },
]);

const SEO_KEYWORDS = ['realizácie sinterovaný kameň', 'kuchyne sinterovaný kameň', 'kuchynská doska realizácie', 'sinterovaný kameň portfólio'];

/** "1 fotka" · "2–4 fotky" · "5+ fotiek" */
const photoCount = (n: number) => `${n} ${n === 1 ? 'fotka' : n < 5 ? 'fotky' : 'fotiek'}`;

/* ─── LIGHTBOX ───────────────────────────────────────── */

const OUT_DELAY_MS = 120;

/** Natural proportions (w / h) of a photo the browser already has, such as the one just clicked on the page */
const cachedAspect = (src: string) => {
  const img = preloadImage(src);
  return img?.complete && img.naturalWidth ? img.naturalWidth / img.naturalHeight : undefined;
};

const Lightbox: React.FC<{
  images: string[];
  title: string;
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}> = ({ images, title, index, onClose, onNav }) => {
  useScrollLock(true);
  const { layers, reveal, drop } = usePhotoLayers(index);

  // Every photo fills the same frame, as large as the screen allows. At their own size the 800 px photos would come
  // up smaller than the 1200 px hero before them, with the rest of the hero dissolving around them. The size is set
  // on load, before the photo is revealed; the opened one is usually known from the start.
  const [aspects, setAspects] = useState<Record<string, number>>(() => {
    const aspect = cachedAspect(images[index]);
    return aspect ? { [images[index]]: aspect } : {};
  });
  const learnAspect = useCallback((src: string, img: HTMLImageElement) => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const aspect = img.naturalWidth / img.naturalHeight;
    setAspects((prev) => (prev[src] === aspect ? prev : { ...prev, [src]: aspect }));
  }, []);

  // The neighbours load ahead, so a step usually finds its photo decoded already
  useEffect(() => {
    [images[index - 1], images[index + 1]].forEach((src) => src && preloadImage(src));
  }, [images, index]);

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
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/95"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      // The AI chat button (widget.js) lies above every layer of the site: it steps aside while this is open
      data-aipredajca-hide=""
    >
      {/* The controls stay above the photos (z-10): the photos are positioned too, and on a phone they reach under
          the arrows */}
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center text-brand-light/70 transition-colors hover:text-brand-light"
        aria-label="Zavrieť"
      >
        <X size={26} strokeWidth={1.5} />
      </button>

      {/* Title + counter */}
      <div className="absolute left-1/2 top-5 z-10 grid -translate-x-1/2 justify-items-center gap-1 text-center text-brand-light/70">
        <span className="text-[0.92rem] font-medium text-brand-light">{title}</span>
        {images.length > 1 && (
          <span className="text-[0.8rem] font-normal tabular-nums tracking-[0.12em]">
            {index + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav(index - 1); }}
          className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center text-brand-light/60 transition-colors hover:text-brand-light"
          aria-label="Predchádzajúca"
        >
          <ChevronLeft size={34} strokeWidth={1.25} />
        </button>
      )}

      {/* Next */}
      {index < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav(index + 1); }}
          className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center text-brand-light/60 transition-colors hover:text-brand-light"
          aria-label="Nasledujúca"
        >
          <ChevronRight size={34} strokeWidth={1.25} />
        </button>
      )}

      {/* Photos, stacked in one grid cell. The next one fades in over the current one once decoded (usePhotoLayers),
          so a step never goes dark between photos. Each photo is positioned (relative) so the newer one always
          paints on top: unpositioned, a photo that reaches opacity 1 would paint under the previous one while that
          is still fading out (below opacity 1 an element paints at the positioned level), and the previous photo
          would show through again. */}
      <m.div initial={{ scale: 0.97 }} animate={{ scale: 1 }} transition={SPRING} className="grid place-items-center">
        {layers.map((layer, i) => {
          const isTop = i === layers.length - 1;
          const src = images[layer.item];
          const aspect = aspects[src];
          // Covered by a newer decoded photo: dissolve a beat later, so where the two overlap the new one already
          // hides it, and where they don't (other proportions) it fades out instead of popping off
          const covered = layers.slice(i + 1).some((l) => l.ready);
          return (
            <img
              key={layer.id}
              src={src}
              alt={isTop ? `${title} — fotka ${layer.item + 1}` : ''}
              aria-hidden={isTop ? undefined : true}
              decoding="async"
              onLoad={(e) => {
                learnAspect(src, e.currentTarget);
                if (!layer.ready) reveal(e.currentTarget, layer.id);
              }}
              onError={layer.ready ? undefined : (e) => reveal(e.currentTarget, layer.id)}
              style={{
                width: aspect ? `min(90vw, calc(82svh * ${aspect}))` : undefined,
                opacity: layer.ready && !covered ? 1 : 0,
                transition: photoFade(covered ? OUT_DELAY_MS : 0),
              }}
              onTransitionEnd={(e) => {
                if (e.propertyName === 'opacity' && covered) drop(layer.id);
              }}
              className="relative col-start-1 row-start-1 max-h-[82svh] max-w-[90vw] rounded-[3px] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          );
        })}
      </m.div>
    </m.div>
  );
};

/* ─── ODPOVEĎ Z E-MAILU ──────────────────────────────── */

// Tlačidlá „Kedy plánujete novú kuchyňu?“ v e-mailoch 07 a 22 zapíšu odpoveď do profilu
// v Klaviyu a presmerujú sem s ?horizont=…. Pruh potvrdí, že odpoveď prišla.
const HORIZONT_ODPOVEDE = new Set(['do-3-mesiacov', '3-12-mesiacov', 'inspiracia', 'hotovo']);

const HorizontThanks = () => {
  const [params] = useSearchParams();
  if (!HORIZONT_ODPOVEDE.has(params.get('horizont') ?? '')) return null;
  return (
    <div role="status" className="border-b border-brand-line bg-brand-sand">
      <Container className="py-4">
        <p className="m-0 font-normal text-brand-dark">Ďakujeme, odpoveď sme si poznačili.</p>
      </Container>
    </div>
  );
};

/* ─── PAGE ───────────────────────────────────────────── */

export const Realizacie = () => {
  const [lightbox, setLightbox] = useState<{ images: string[]; title: string; index: number } | null>(null);

  const openLightbox = useCallback((project: Project, startIndex = 0) => {
    setLightbox({ images: project.gallery, title: project.title, index: startIndex });
  }, []);

  return (
    <div>
      <SEOHead
        title="Realizácie kuchynských dosiek | Orostone"
        description="Pozrite, ako sinterovaný kameň vyzerá v reálnych kuchyniach a ostrovčekoch. Veľké plochy, kde dekor rozhoduje výsledok celej miestnosti."
        canonical="https://orostone.sk/realizacie"
        keywords={SEO_KEYWORDS}
        structuredData={breadcrumbLD}
      />

      <HorizontThanks />

      <PageHero
        eyebrow="Portfólio"
        title="Naše realizácie"
        lead="Každý projekt je unikátny — od kompaktných bytov po rozľahlé vily. Pozrite sa, ako sinterovaný kameň Orostone mení reálne priestory."
        media={
          <dl className="m-0 grid grid-cols-2 gap-x-[clamp(24px,3vw,48px)] gap-y-8">
            {STATS.map((s) => (
              <div key={s.label} className="grid content-start gap-2 border-t border-brand-dark pt-5">
                <dt className="order-2 text-[0.92rem] font-normal text-brand-muted">{s.label}</dt>
                <dd className="order-1 m-0 text-[clamp(1.8rem,2.8vw,2.6rem)] font-semibold leading-none tracking-[-0.02em] tabular-nums">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      {/* ── Featured Project ──────────────────────────── */}
      <Section tone="graphite">
        <Container className="grid gap-6">
          <Eyebrow gold>Odporúčaný projekt</Eyebrow>
          <button
            type="button"
            onClick={() => openLightbox(FEATURED, 0)}
            className="group block overflow-hidden rounded-[3px]"
            aria-label={`Zobraziť galériu: ${FEATURED.title}`}
          >
            <img
              src={FEATURED.hero}
              alt={FEATURED.title}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </button>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
            <div className="grid gap-2">
              <h2 className="text-os-h2">{FEATURED.title}</h2>
              <p className="font-light text-brand-light/75">
                {FEATURED.material} · {photoCount(FEATURED.gallery.length)}
              </p>
            </div>
          </div>
          {FEATURED.gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {FEATURED.gallery.slice(1, 4).map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => openLightbox(FEATURED, i + 1)}
                  className="group/thumb block overflow-hidden rounded-[3px]"
                  aria-label={`${FEATURED.title} — fotka ${i + 2}`}
                >
                  <img
                    src={img}
                    alt={`${FEATURED.title} — detail ${i + 1}`}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover/thumb:scale-105"
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={250}
                  />
                </button>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* ── Projects Grid ─────────────────────────────── */}
      <Section tone="chalk">
        <Container>
          <SectionHeader title="Ďalšie projekty" lead="Kuchyne, krby a interiéry z celého Slovenska" />
          <ul className="mt-[clamp(40px,5vw,64px)] grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {GRID_PROJECTS.map((project) => (
              <li key={project.id}>
                <article className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => openLightbox(project)}
                    className="group block overflow-hidden rounded-[3px] bg-brand-sand"
                    aria-label={`Zobraziť galériu: ${project.title}`}
                  >
                    <img
                      src={project.hero}
                      alt={project.title}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={600}
                    />
                  </button>
                  <div className="grid gap-0.5">
                    <h3 className="text-[1.08rem] font-semibold leading-snug">{project.title}</h3>
                    <p className="text-[0.9rem] font-normal text-brand-muted">
                      {project.material} · {photoCount(project.gallery.length)}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[0.84rem] font-normal text-brand-muted">
            Fotky sú z montáží u klientov. Názvy dekorov sú z čias realizácie.
          </p>
        </Container>
      </Section>

      {/* ── Process ───────────────────────────────────── */}
      <Section tone="sand">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <SectionHeader eyebrow="Ako to funguje" title="Od konzultácie po hotovú kuchyňu" />
            <TextLink to="/blog/od-merania-po-instalaciu-proces-orostone">Podrobný popis procesu</TextLink>
          </div>
          <StepList steps={STEPS} className="mt-[clamp(40px,5vw,64px)]" />
          <p className="mt-8 max-w-[60ch] text-[0.92rem] font-normal text-brand-muted">{CUSTOMER_JOURNEY_NOTE}</p>
        </Container>
      </Section>

      {/* ── CTA ───────────────────────────────────────── */}
      <Section tone="chalk">
        <Container className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <SectionHeader
            title="Chcete podobný výsledok?"
            lead="Kontaktujte nás pre nezáväznú konzultáciu. Poradíme s materiálom, pripravíme cenovú ponuku a výrobu aj montáž zabezpečíme cez overeného kamenára."
          />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:justify-end">
            <ActionButton variant="dark" to="/kontakt" arrow>
              Nezáväzná konzultácia
            </ActionButton>
            <TextLink to="/vzorky">Objednať vzorku zadarmo</TextLink>
          </div>
        </Container>
      </Section>

      <GoldBand od="realizacie-stranka" />

      {/* ── Lightbox ──────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            title={lightbox.title}
            index={lightbox.index}
            onClose={() => setLightbox(null)}
            onNav={(i) => setLightbox((prev) => (prev ? { ...prev, index: i } : null))}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
