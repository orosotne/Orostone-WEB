import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SEOHead, createBreadcrumbLD } from '../components/UI/SEOHead';
import { useIsMobile } from '../hooks/useIsMobile';
import { SAMPLE_DECORS } from '../data/sample-decors';
import { SampleQuantityPicker } from '../components/Shop/SampleQuantityPicker';
import type { SampleOrderSectionHandle } from '../components/Shop/SampleOrderSection';
import type { SampleDecor } from '../components/Shop/SampleCartonTray';
import type { SampleQuantity } from '../services/shopify/samples';

const SampleOrderSection = React.lazy(() =>
  import('../components/Shop/SampleOrderSection').then((m) => ({ default: m.SampleOrderSection })),
);

const SAMPLE_TILES = SAMPLE_DECORS;

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
  const [quantity, setQuantity] = useState<SampleQuantity>(1);
  const [selection, setSelection] = useState<SampleDecor[]>([]);
  const [sampleBusy, setSampleBusy] = useState(true);
  const [quantityFeedback, setQuantityFeedback] = useState('');
  const orderRef = useRef<SampleOrderSectionHandle>(null);
  const browserRef = useRef<HTMLDivElement>(null);
  const carouselButtonRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  // Debounce React state commit so scroll-driven RAF only updates DOM (cheap)
  // and lets the activeIndex re-render fire ONCE when scrolling settles. Without
  // this, every RAF tick during a smooth-scroll triggered a full Vzorky re-render
  // which cascaded to re-rendering 12 tile JSX nodes + dots + form Suspense — that
  // was the dominant INP cost on this page (1.6s).
  const settleTimerRef = useRef<number | null>(null);

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
      const pxDist = Math.abs(tileMid - centerX);

      // Skip scale/opacity writes on mobile — CSS scroll-snap handles layout and
      // avoiding ~12 transform/opacity style writes per frame drops INP dramatically.
      if (!isMobile) {
        const unitDist = pxDist / (TILE_BASE + GAP);
        el.style.transform = `scale(${getScale(unitDist)})`;
        el.style.opacity = String(getOpacity(unitDist));
      }

      if (pxDist < closestDist) { closestDist = pxDist; closestIdx = i; }
    });

    // Defer state commit to settle — keeps scroll-driven frames render-free.
    if (settleTimerRef.current !== null) {
      clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = window.setTimeout(() => {
      settleTimerRef.current = null;
      setActiveIndex(prev => (prev === closestIdx ? prev : closestIdx));
    }, 150);
  }, [isMobile]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // ── Mobile: no scroll-driven RAF/layout reads or style writes. CSS
    // scroll-snap handles the UX; we only need to know which tile is centered
    // to label it. Deriving that from scroll geometry (same as desktop) and
    // committing once on scroll-settle keeps P75 INP on /vzorky low (~1248ms →
    // <200ms target) while staying correct.
    //
    // Previously this used an IntersectionObserver that picked the "most
    // visible" tile among only the entries that crossed a threshold per
    // callback. The already-centered tile is usually absent from those entries
    // (it crossed its threshold earlier), so the adjacent tile just entering
    // view hijacked activeIndex — the name was consistently off by one.
    if (isMobile) {
      // Clear any leftover transform/opacity from a previous desktop render.
      tileRefs.current.forEach((el) => {
        if (!el) return;
        el.style.transform = '';
        el.style.opacity = '';
      });

      let settle: number | null = null;
      const commitCentered = () => {
        settle = null;
        const centerX = container.scrollLeft + container.offsetWidth / 2;
        let closestIdx = 0;
        let closestDist = Infinity;
        tileRefs.current.forEach((el, i) => {
          if (!el) return;
          const tileMid = el.offsetLeft + el.offsetWidth / 2;
          const pxDist = Math.abs(tileMid - centerX);
          if (pxDist < closestDist) { closestDist = pxDist; closestIdx = i; }
        });
        setActiveIndex((prev) => (prev === closestIdx ? prev : closestIdx));
      };

      // Per-frame work is only a timer reset (no layout/style writes); the
      // single geometry pass + state commit runs once, after motion stops.
      const onScroll = () => {
        if (settle !== null) clearTimeout(settle);
        settle = window.setTimeout(commitCentered, 150);
      };

      container.addEventListener('scroll', onScroll, { passive: true });
      commitCentered(); // sync activeIndex to the initial centered tile
      return () => {
        container.removeEventListener('scroll', onScroll);
        if (settle !== null) clearTimeout(settle);
      };
    }

    // ── Desktop: original scroll-driven RAF for scale/opacity transitions.
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateTransforms);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    const t = setTimeout(updateTransforms, 50);
    return () => {
      container.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t);
      if (settleTimerRef.current !== null) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };
  }, [updateTransforms, isMobile]);

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
    const container = scrollRef.current;
    if (!container) return;
    // Resolve from the visible tile now; the label state commits after scroll settles.
    const centerX = container.scrollLeft + container.offsetWidth / 2;
    let centeredIndex = activeIndex;
    let closestDistance = Infinity;
    tileRefs.current.forEach((tile, index) => {
      if (!tile) return;
      const distance = Math.abs(tile.offsetLeft + tile.offsetWidth / 2 - centerX);
      if (distance < closestDistance) { closestDistance = distance; centeredIndex = index; }
    });
    setActiveIndex(centeredIndex);
    const image = tileRefs.current[centeredIndex]?.querySelector('img') ?? undefined;
    void orderRef.current?.addSample(SAMPLE_TILES[centeredIndex], image);
  };
  const changeQuantity = (next: SampleQuantity) => {
    if (sampleBusy) return;
    if (selection.length > next) {
      setQuantityFeedback('Najprv odstráňte ' + (selection.length - next) + ' ' + (selection.length - next === 1 ? 'dekor' : 'dekory') + ' z výberu.');
      return;
    }
    setQuantityFeedback('');
    setQuantity(next);
  };
  const handleSelectionChange = useCallback((next: SampleDecor[]) => { setSelection(next); setQuantityFeedback(''); }, []);
  const alreadySelected = selection.some((decor) => decor.id === SAMPLE_TILES[activeIndex].id);
  const selectionComplete = selection.length === quantity;

  return (
    <div className="min-h-dvh">
      <SEOHead
        title="Vzorky sinterovaného kameňa | OROSTONE"
        description="Objednajte si vzorku dekoru, ktorý vás zaujal, alebo viac vzoriek na porovnanie. Pri väčších plochách odporúčame návštevu showroomu Bošany."
        canonical="https://orostone.sk/vzorky"
        structuredData={createBreadcrumbLD([
          { name: 'OROSTONE', url: 'https://orostone.sk/' },
          { name: 'Vzorky', url: 'https://orostone.sk/vzorky' },
        ])}
      />

      <section id="sample-intro" className="sample-intro">
        <div className="sample-intro-layout">
          <div className="sample-intro-copy">
            <span className="sample-intro-eyebrow">Vzorky kameňa</span>
            <h1>Rozhodujte sa <span>s istotou</span></h1>
            <p className="sample-intro-description">Porovnajte farbu a povrch kameňa priamo u vás doma.</p>
            <p className="sample-intro-offer"><strong>Prvá vzorka je zadarmo.</strong><span>Platíte iba dopravu 2,50 €.</span></p>
          </div>
          <div className="sample-intro-choice">
            <SampleQuantityPicker id="sample-quantity-carousel" value={quantity} onChange={changeQuantity} disabled={sampleBusy} feedback={quantityFeedback} />
          </div>
        </div>
      </section>

      {/* ── Sample carousel ── */}
      <div ref={browserRef} className="sample-decor-browser bg-brand-light pb-12">
        {/* Edge fade masks */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-28 z-10 bg-gradient-to-r from-brand-light to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10 bg-gradient-to-l from-brand-light to-transparent" />

          {/* Counter above center tile */}
          <div className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 z-20 text-[0.72rem] font-medium tabular-nums text-brand-muted tracking-[0.16em] select-none">
            {activeIndex + 1}&thinsp;/&thinsp;{SAMPLE_TILES.length}
          </div>

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            id="decor-carousel"
            className="vzorky-hide-sb flex items-center overflow-x-auto snap-x snap-mandatory"
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
                role="button"
                tabIndex={0}
                aria-label={"Zobraziť " + tile.name}
                aria-pressed={i === activeIndex}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); scrollToIndex(i); } }}
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
          <p className="h-5 text-[0.82rem] font-bold uppercase tracking-[0.16em] text-brand-dark">
            {SAMPLE_TILES[activeIndex].name}
          </p>

          {/* Desktop arrows — under the name */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={goLeft}
              aria-label="Predchádzajúca vzorka"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-brand-light transition-colors duration-200 hover:border-brand-dark"
            >
              <ChevronLeft size={18} className="text-brand-dark" />
            </button>
            <button
              type="button"
              onClick={goRight}
              aria-label="Nasledujúca vzorka"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-line bg-brand-light transition-colors duration-200 hover:border-brand-dark"
            >
              <ChevronRight size={18} className="text-brand-dark" />
            </button>
          </div>

          <button
            type="button"
            ref={carouselButtonRef}
            onClick={handleSelectDekor}
            disabled={sampleBusy || alreadySelected || selectionComplete}
            className="mt-1 inline-flex min-h-[50px] items-center gap-2 px-7 rounded-[10px] bg-brand-dark text-[0.78rem] font-bold uppercase tracking-[0.12em] text-brand-light transition-colors hover:bg-[#333331] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sampleBusy ? 'Ukladáme vzorku…' : alreadySelected ? 'Vo vašom výbere ✓' : selectionComplete ? 'Výber je kompletný' : 'Pridať do výberu'}
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
                  activeIndex === i ? 'w-5 bg-brand-dark' : 'w-1.5 bg-brand-line hover:bg-brand-muted',
                ].join(' ')}
              />
            ))}
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="min-h-[600px]" aria-hidden />}>
        <SampleOrderSection ref={orderRef} quantity={quantity} onQuantityChange={changeQuantity} quantityFeedback={quantityFeedback} onSelectionChange={handleSelectionChange} onBusyChange={setSampleBusy} browserRef={browserRef} carouselButtonRef={carouselButtonRef} />
      </Suspense>

      <div className="h-24 bg-brand-light" aria-hidden />
    </div>
  );
};
