import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SEOHead, createBreadcrumbLD } from '../components/UI/SEOHead';

const SampleLeadSection = React.lazy(() =>
  import('../components/Shop/SampleLeadSection').then((m) => ({ default: m.SampleLeadSection })),
);

const SAMPLE_TILES = [
  { id: 'nero-margiua',       name: 'NERO MARGIUA',       image: '/images/vzorky/nero-margiua.webp' },
  { id: 'wild-forest',        name: 'WILD FOREST',        image: '/images/vzorky/wild-forest.webp' },
  { id: 'super-white-extra',  name: 'SUPER WHITE EXTRA',  image: '/images/vzorky/calacatta-top.webp' },
  { id: 'astrana-grey',       name: 'ASTRANA GREY',       image: '/images/vzorky/astrana-grey.webp' },
  { id: 'appennino',          name: 'APPENNINO',          image: '/images/vzorky/appennino.webp' },
  { id: 'calacatta-top',      name: 'CALACATTA TOP',      image: '/images/vzorky/super-white-extra.webp' },
  { id: 'statuario-diamante', name: 'STATUARIO DIAMANTE', image: '/images/vzorky/statuario-diamante.webp' },
  { id: 'givenchy-gold',      name: 'GIVENCHY GOLD',      image: '/images/vzorky/givenchy-gold.webp' },
  { id: 'taj-mahal',          name: 'TAJ MAHAL',          image: '/images/vzorky/yabo-white.webp' },
  { id: 'roman-travertine',   name: 'ROMAN TRAVERTINE',   image: '/images/vzorky/roman-travertine.webp' },
  { id: 'gothic-gold',        name: 'GOTHIC GOLD',        image: '/images/vzorky/gothic-gold.webp' },
  { id: 'yabo-white',         name: 'YABO WHITE',         image: '/images/vzorky/taj-mahal.webp' },
];

const TILE_BASE = 150; // base size in px
const GAP = 16;

/** Map distance from center (0–1+) to scale (1.45 center → 1.0 adjacent → 0.7 edge) */
function getScale(dist: number): number {
  if (dist <= 0) return 1.45;
  if (dist >= 2) return 0.7;
  // smooth easeOutCubic curve
  const t = Math.min(dist / 2, 1);
  const eased = 1 - Math.pow(1 - t, 3);
  return 1.45 - eased * 0.75;
}

function getOpacity(dist: number): number {
  if (dist <= 0.3) return 1;
  if (dist >= 2.5) return 0.35;
  const t = Math.min((dist - 0.3) / 2.2, 1);
  return 1 - t * 0.65;
}

export const Vzorky: React.FC = () => {
  const [selectedDekor, setSelectedDekor] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  /* ── Scroll-driven transforms ── */
  const updateTransforms = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const centerX = container.scrollLeft + container.offsetWidth / 2;

    let closestIdx = 0;
    let closestDist = Infinity;

    tileRefs.current.forEach((el, i) => {
      if (!el) return;
      const tileMid = el.offsetLeft + el.offsetWidth / 2;
      // Distance in "tile units" (1 = one tile width + gap away)
      const pxDist = Math.abs(tileMid - centerX);
      const unitDist = pxDist / (TILE_BASE + GAP);

      const scale = getScale(unitDist);
      const opacity = getOpacity(unitDist);

      el.style.transform = `scale(${scale})`;
      el.style.opacity = String(opacity);

      if (pxDist < closestDist) { closestDist = pxDist; closestIdx = i; }
    });

    setActiveIndex(closestIdx);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateTransforms);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    // Initial paint
    const t = setTimeout(updateTransforms, 50);
    return () => {
      container.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t);
    };
  }, [updateTransforms]);

  /* ── Scroll to index ── */
  const scrollToIndex = useCallback((idx: number) => {
    const el = tileRefs.current[idx];
    if (!el || !scrollRef.current) return;
    const container = scrollRef.current;
    const left = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
    container.scrollTo({ left, behavior: 'smooth' });
  }, []);

  /* Center first tile on mount */
  useEffect(() => {
    const t = setTimeout(() => scrollToIndex(0), 80);
    return () => clearTimeout(t);
  }, [scrollToIndex]);

  /* Preload first 3 visible images */
  useEffect(() => {
    const preloadUrls = SAMPLE_TILES.slice(0, 3).map((t) => t.image);
    const links: HTMLLinkElement[] = [];
    preloadUrls.forEach((url, i) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.type = 'image/webp';
      link.href = url;
      if (i === 0) (link as any).fetchPriority = 'high';
      document.head.appendChild(link);
      links.push(link);
    });
    return () => links.forEach((l) => l.remove());
  }, []);

  const goLeft = () => {
    const next = Math.max(0, activeIndex - 1);
    scrollToIndex(next);
  };
  const goRight = () => {
    const next = Math.min(SAMPLE_TILES.length - 1, activeIndex + 1);
    scrollToIndex(next);
  };

  const handleSelectDekor = () => {
    setSelectedDekor(SAMPLE_TILES[activeIndex].name);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen">
      <SEOHead
        title="Vzorky materiálu | OROSTONE — Prémiový sinterovaný kameň"
        description="Objednajte si vzorky sinterovaného kameňa OROSTONE. Vyberte dekor, nechajte kontakt a doručíme vám materiál na rozhodnutie."
        canonical="https://orostone.sk/vzorky"
        structuredData={createBreadcrumbLD([
          { name: 'OROSTONE', url: 'https://orostone.sk/' },
          { name: 'Vzorky', url: 'https://orostone.sk/vzorky' },
        ])}
      />

      <section className="pt-32 pb-10 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 text-center">
          <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
            Bezplatné vzorky
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-brand-dark mb-6 leading-tight">
            Rozhodujte sa s istotou
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Vyplňte formulár nižšie a vzorku doručíme priamo k vám — zadarmo, bez záväzkov.
            Presvedčte sa o kvalite a farbe na vlastné oči ešte pred kúpou.
          </p>
        </div>
      </section>

      {/* ── Sample carousel ── */}
      <div className="bg-[#FAFAFA] pb-12">
        {/* Edge fade masks */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-28 z-10 bg-gradient-to-r from-[#FAFAFA] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10 bg-gradient-to-l from-[#FAFAFA] to-transparent" />

          {/* Counter above center tile */}
          <div className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 z-20 text-[10px] font-mono text-gray-400 tracking-widest select-none">
            {activeIndex + 1}&thinsp;/&thinsp;{SAMPLE_TILES.length}
          </div>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            className="flex items-center overflow-x-auto snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
              gap: `${GAP}px`,
              paddingLeft: `calc(50% - ${TILE_BASE / 2}px)`,
              paddingRight: `calc(50% - ${TILE_BASE / 2}px)`,
              paddingTop: '40px',
              paddingBottom: '40px',
            }}
          >
            {SAMPLE_TILES.map((tile, i) => (
              <div
                key={tile.id}
                ref={(el) => { tileRefs.current[i] = el; }}
                className="flex-shrink-0 snap-center will-change-transform"
                style={{
                  width: `${TILE_BASE}px`,
                  height: `${TILE_BASE}px`,
                  transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
                onClick={() => scrollToIndex(i)}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden cursor-pointer">
                  <img
                    src={tile.image}
                    alt={tile.name}
                    width={400}
                    height={400}
                    draggable={false}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    {...(i === 0 ? { fetchPriority: 'high' } : {})}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hide scrollbar in webkit */}
          <style>{`.vzorky-hide-sb::-webkit-scrollbar{display:none}`}</style>
        </div>

        {/* Name + arrows + CTA */}
        <div className="text-center mt-2 flex flex-col items-center gap-3">
          <p className="font-sans text-sm font-bold text-brand-dark tracking-widest uppercase h-5">
            {SAMPLE_TILES[activeIndex].name}
          </p>

          {/* Desktop arrows — under the name */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={goLeft}
              aria-label="Predchádzajúca vzorka"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow ring-1 ring-black/5 hover:ring-brand-gold/40 hover:shadow-md transition-all duration-200"
            >
              <ChevronLeft size={18} className="text-brand-dark" />
            </button>
            <button
              type="button"
              onClick={goRight}
              aria-label="Nasledujúca vzorka"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow ring-1 ring-black/5 hover:ring-brand-gold/40 hover:shadow-md transition-all duration-200"
            >
              <ChevronRight size={18} className="text-brand-dark" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSelectDekor}
            className="inline-flex items-center gap-2 bg-brand-dark text-white px-7 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 mt-1"
          >
            Vybrať dekor
          </button>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-2">
            {SAMPLE_TILES.map((tile, i) => (
              <button
                key={tile.id}
                type="button"
                aria-label={tile.name}
                onClick={() => scrollToIndex(i)}
                className={[
                  'h-1.5 rounded-full transition-all duration-300',
                  activeIndex === i ? 'w-5 bg-brand-gold' : 'w-1.5 bg-gray-300 hover:bg-gray-400',
                ].join(' ')}
              />
            ))}
          </div>
        </div>
      </div>

      <div ref={formRef}>
        <Suspense fallback={null}>
          <SampleLeadSection preselectedDekor={selectedDekor} />
        </Suspense>
      </div>

      <div className="h-24 bg-[#FAFAFA]" aria-hidden />
    </main>
  );
};
