import React, { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { RotatingBadge } from '../UI/RotatingBadge';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useIsMobile } from '../../hooks/useIsMobile';

interface InspirationItem {
  src: string;
  video: string;
  label: string;
  title: string;
  subtitle: string;
}

interface Props {
  items: InspirationItem[];
}

type MediaItem = { type: 'image' | 'video'; src: string; label: string };

// All 7 images available in /public/images/inspiration/
const ALL_IMAGES = [
  '/images/inspiration/inspiration-1.webp',
  '/images/inspiration/inspiration-2.webp',
  '/images/inspiration/inspiration-3.webp',
  '/images/inspiration/inspiration-4.webp',
  '/images/inspiration/inspiration-5.webp',
  '/images/inspiration/inspiration-6.webp',
  '/images/inspiration/inspiration-7.webp',
];

// 440px-wide thumbnails for the marquee (8–13 KB each, vs 400–970 KB originals)
const ALL_THUMBS = [
  '/images/inspiration/thumb-inspiration-1.webp',
  '/images/inspiration/thumb-inspiration-2.webp',
  '/images/inspiration/thumb-inspiration-3.webp',
  '/images/inspiration/thumb-inspiration-4.webp',
  '/images/inspiration/thumb-inspiration-5.webp',
  '/images/inspiration/thumb-inspiration-6.webp',
  '/images/inspiration/thumb-inspiration-7.webp',
];

// First-frame poster images for video cards (9–13 KB each)
const ALL_POSTERS = [
  '/images/inspiration/poster-inspiration-1.webp',
  '/images/inspiration/poster-inspiration-2.webp',
  '/images/inspiration/poster-inspiration-3.webp',
  '/images/inspiration/poster-inspiration-4.webp',
  '/images/inspiration/poster-inspiration-5.webp',
  '/images/inspiration/poster-inspiration-6.webp',
  '/images/inspiration/poster-inspiration-7.webp',
];

// All 7 videos available in /public/videos/inspiration/
const ALL_VIDEOS = [
  '/videos/inspiration/inspiration-1.mp4',
  '/videos/inspiration/inspiration-2.mp4',
  '/videos/inspiration/inspiration-3.mp4',
  '/videos/inspiration/inspiration-4.mp4',
  '/videos/inspiration/inspiration-5.mp4',
  '/videos/inspiration/inspiration-6.mp4',
  '/videos/inspiration/inspiration-7.mp4',
];

const UNIQUE_COLS = Math.max(ALL_IMAGES.length, ALL_VIDEOS.length); // 7

// Build 7 unique columns cycling both arrays
const UNIQUE_COLUMNS = Array.from({ length: UNIQUE_COLS }, (_, i) => ({
  image: ALL_IMAGES[i % ALL_IMAGES.length],
  thumb: ALL_THUMBS[i % ALL_THUMBS.length],
  poster: ALL_POSTERS[i % ALL_POSTERS.length],
  video: ALL_VIDEOS[i % ALL_VIDEOS.length],
  imageIdx: i % ALL_IMAGES.length,
  videoIdx: i % ALL_VIDEOS.length,
  reversed: i % 2 !== 0,
}));

// Flat ordered media list for lightbox navigation (14 items: 2 per column)
const MEDIA_ITEMS: MediaItem[] = UNIQUE_COLUMNS.flatMap((col, i) =>
  col.reversed
    ? [{ type: 'video', src: col.video, label: `Inšpirácia ${i + 1} — sinterovaný kameň interiér` }, { type: 'image', src: col.image, label: `Inšpirácia ${i + 1} — sinterovaný kameň interiér` }]
    : [{ type: 'image', src: col.image, label: `Inšpirácia ${i + 1} — sinterovaný kameň interiér` }, { type: 'video', src: col.video, label: `Inšpirácia ${i + 1} — sinterovaný kameň interiér` }]
);

// ──────────────────────────────────────────
// Icons
// ──────────────────────────────────────────
const MuteIcon = () => (
  <svg data-action="unmute" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);

const UnmuteIcon = () => (
  <svg data-action="mute" xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
  </svg>
);

// ──────────────────────────────────────────
// Inline Lightbox
// ──────────────────────────────────────────
interface LightboxProps {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const InspirationLightbox: React.FC<LightboxProps> = ({ items, index, onClose, onPrev, onNext }) => {
  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      else if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  useScrollLock(true);

  if (!item) return null;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Counter */}
      <div className="absolute top-5 left-6 z-50 text-white/70 text-sm font-light select-none">
        {index + 1} / {items.length}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-5 z-50 text-white hover:text-brand-gold transition-colors p-2"
        aria-label="Zatvoriť"
      >
        <X size={30} />
      </button>

      {/* Prev arrow */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 z-50 text-white hover:text-brand-gold transition-colors p-2"
          aria-label="Predchádzajúci"
        >
          <ChevronLeft size={48} strokeWidth={1.5} />
        </button>
      )}

      {/* Next arrow */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 z-50 text-white hover:text-brand-gold transition-colors p-2"
          aria-label="Ďalší"
        >
          <ChevronRight size={48} strokeWidth={1.5} />
        </button>
      )}

      {/* Media */}
      <m.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="max-h-[90vh] max-w-[90vw] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'image' ? (
          <img
            src={item.src}
            alt={item.label}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl"
          />
        ) : (
          <video
            key={item.src}
            className="max-h-[90vh] max-w-[90vw] rounded-xl"
            autoPlay
            controls
            playsInline
          >
            <source src={item.src} type="video/mp4" />
          </video>
        )}
      </m.div>
    </m.div>
  );
};

// ──────────────────────────────────────────
// Image card
// ──────────────────────────────────────────
const ImageCard = ({ src, thumb, idx, onOpen }: { src: string; thumb: string; idx: number; onOpen: () => void; key?: React.Key }) => (
  <button
    type="button"
    onClick={onOpen}
    className="insp-card block relative flex-shrink-0 overflow-hidden rounded-xl cursor-zoom-in"
    style={{ aspectRatio: '4 / 5' }}
    aria-label={`Otvoriť inšpiráciu ${idx + 1}`}
  >
    <img
      src={thumb}
      alt={`Inšpirácia ${idx + 1}`}
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover"
    />
  </button>
);

// ──────────────────────────────────────────
// Video card
// ──────────────────────────────────────────
// On mobile we render ONLY the poster image — autoplaying multiple <video>
// elements at once was causing iOS Safari memory pressure (paint buffer
// eviction = white flash on fast scroll back). User can still tap a card
// to open the lightbox, which plays the full video at native quality.
//
// On desktop the inline autoplay video stays (good performance there, no
// memory pressure on a real GPU).
// ──────────────────────────────────────────
const VideoCard = ({ src, poster, idx, onOpen }: { src: string; poster: string; idx: number; onOpen: () => void; key?: React.Key }) => {
  const isMobile = useIsMobile();
  const [muted, setMuted] = useState(true);
  const [visible, setVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);

  // Mount <video> element only when card enters extended viewport (400px margin).
  // Skipped entirely on mobile — VideoCard becomes a poster-only card.
  useEffect(() => {
    if (isMobile) return;
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile]);

  // Play/pause based on visibility (desktop only — no <video> exists on mobile).
  useEffect(() => {
    if (isMobile) return;
    const el = cardRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    video.pause();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, isMobile]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onOpen}
      className="insp-card block relative flex-shrink-0 overflow-hidden rounded-xl cursor-zoom-in"
      style={{ aspectRatio: '9 / 16' }}
      aria-label={`Otvoriť video ${idx + 1}`}
    >
      {/* Poster image shows instantly — video (desktop only) overlays it once loaded */}
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!isMobile && visible && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      {/* Mute toggle hidden on mobile (no inline video to mute) */}
      {!isMobile && (
        <button
          type="button"
          aria-label="Toggle volume"
          data-state={muted ? 'muted' : 'unmuted'}
          onClick={toggleMute}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          {muted ? <MuteIcon /> : <UnmuteIcon />}
        </button>
      )}
    </button>
  );
};

// ──────────────────────────────────────────
// Column card
// ──────────────────────────────────────────
const ColumnCard = ({
  image,
  thumb,
  poster,
  video,
  imageIdx,
  videoIdx,
  reversed,
  onOpenImage,
  onOpenVideo,
}: {
  image: string;
  thumb: string;
  poster: string;
  video: string;
  imageIdx: number;
  videoIdx: number;
  reversed: boolean;
  onOpenImage: () => void;
  onOpenVideo: () => void;
  key?: React.Key;
}) => {
  const imageEl = <ImageCard src={image} thumb={thumb} idx={imageIdx} onOpen={onOpenImage} />;
  const videoEl = <VideoCard src={video} poster={poster} idx={videoIdx} onOpen={onOpenVideo} />;
  return (
    <div className="insp-col flex-shrink-0 flex flex-col" style={{ gap: '10px' }}>
      {reversed ? videoEl : imageEl}
      {reversed ? imageEl : videoEl}
    </div>
  );
};

// ──────────────────────────────────────────
// Main component
// ──────────────────────────────────────────
export const InspirationSection: React.FC<Props> = () => {
  const isMobile = useIsMobile();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Map each unique column to its lightbox indices
  // Column i: top item = mediaIndex i*2, bottom item = mediaIndex i*2+1
  const getMediaIndex = (colIdx: number, position: 'top' | 'bottom') =>
    colIdx * 2 + (position === 'top' ? 0 : 1);

  // Desktop: 2 copies of UNIQUE_COLUMNS for the seamless -50% marquee loop
  // (28 columns total, animated horizontal scroll).
  //
  // Mobile: just 1 copy (14 columns). Mobile already overflows horizontally
  // and users scroll-swipe naturally — the marquee animation isn't visible
  // and only doubles the IntersectionObserver count + DOM size for nothing.
  const strip = isMobile ? UNIQUE_COLUMNS : [...UNIQUE_COLUMNS, ...UNIQUE_COLUMNS];

  const isOpen = lightboxIndex !== null;

  return (
    <section className="inspiration-section w-full overflow-x-hidden bg-[#FAFAFA] py-20 lg:py-28">
      {/* Header */}
      <div className="relative container mx-auto px-4 lg:px-8 mb-10 lg:mb-14">
        <div className="inspiration-header section-reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-brand-gold font-bold mb-3 block">
            Inšpirácie
          </span>
          <h2 className="text-3xl lg:text-4xl font-sans font-bold text-brand-dark leading-tight mb-4">
            Inšpirujte sa.<br />Premena vášho priestoru.
          </h2>
          <p className="text-gray-400 text-sm lg:text-base font-light max-w-lg">
            Každý priestor má svoj príbeh. Nechajte kameň, nech ho rozpráva za vás.
          </p>
        </div>
        <div className="badge-blink absolute top-0 right-0 z-30 pointer-events-none hidden lg:block">
          <RotatingBadge variant="dark" />
        </div>
      </div>

      {/* ── Marquee strip ── */}
      <div className="insp-marquee-wrapper">
        <div className={`insp-marquee${isOpen ? ' insp-marquee--paused' : ''}`}>
          {strip.map((col, stripIdx) => {
            // Map strip index back to unique column index for media index calculation
            const uniqueColIdx = stripIdx % UNIQUE_COLS;
            return (
              <ColumnCard
                key={stripIdx}
                image={col.image}
                thumb={col.thumb}
                poster={col.poster}
                video={col.video}
                imageIdx={col.imageIdx}
                videoIdx={col.videoIdx}
                reversed={col.reversed}
                onOpenImage={() => setLightboxIndex(getMediaIndex(uniqueColIdx, 'top'))}
                onOpenVideo={() => setLightboxIndex(getMediaIndex(uniqueColIdx, 'bottom'))}
              />
            );
          })}
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {isOpen && (
          <InspirationLightbox
            items={MEDIA_ITEMS}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
            onNext={() => setLightboxIndex((i) => (i !== null && i < MEDIA_ITEMS.length - 1 ? i + 1 : i))}
          />
        )}
      </AnimatePresence>

      <style>{`
        /* ── Wrapper clips overflow ── */
        .insp-marquee-wrapper {
          width: 100%;
          overflow-x: hidden;
          overflow: clip;
          contain: layout paint;
        }

        /* ── Inner strip ── */
        .insp-marquee {
          display: flex;
          gap: 10px;
          width: max-content;
          will-change: transform;
          animation: insp-scroll-left 80s linear infinite;
        }

        .insp-marquee--paused {
          animation-play-state: paused;
        }

        /* Column card width */
        .insp-col {
          width: 220px;
        }

        /* Keyframes */
        @keyframes insp-scroll-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .insp-marquee {
            animation: none !important;
          }
        }

        /* Mobile (<lg): no marquee animation, native horizontal swipe scroll
           on the wrapper (overflow-x: auto). Single strip means we only render
           14 columns instead of 28 — half the IntersectionObservers, half the
           DOM nodes. The user's natural finger-swipe is the navigation. */
        @media (max-width: 1023px) {
          .insp-marquee-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: x proximity;
          }
          .insp-marquee {
            animation: none !important;
            width: max-content;
          }
          .insp-col {
            scroll-snap-align: start;
          }
        }

        /* ── Mobile ≤575px ── */
        @media (max-width: 575px) {
          .insp-marquee {
            gap: 7.5px;
            animation-duration: 60s;
          }
          .insp-col {
            width: 152.5px;
            gap: 7.5px;
          }
        }
      `}</style>
    </section>
  );
};
