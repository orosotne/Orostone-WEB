import React, { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { RotatingBadge } from '../UI/RotatingBadge';

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

type MediaItem = { type: 'image' | 'video'; src: string };

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

// All 5 videos available in /public/videos/inspiration/
const ALL_VIDEOS = [
  '/videos/inspiration/inspiration-1.mp4',
  '/videos/inspiration/inspiration-2.mp4',
  '/videos/inspiration/inspiration-3.mp4',
  '/videos/inspiration/inspiration-4.mp4',
  '/videos/inspiration/inspiration-5.mp4',
];

const UNIQUE_COLS = Math.max(ALL_IMAGES.length, ALL_VIDEOS.length); // 7

// Build 7 unique columns cycling both arrays
const UNIQUE_COLUMNS = Array.from({ length: UNIQUE_COLS }, (_, i) => ({
  image: ALL_IMAGES[i % ALL_IMAGES.length],
  video: ALL_VIDEOS[i % ALL_VIDEOS.length],
  imageIdx: i % ALL_IMAGES.length,
  videoIdx: i % ALL_VIDEOS.length,
  reversed: i % 2 !== 0,
}));

// Flat ordered media list for lightbox navigation (14 items: 2 per column)
const MEDIA_ITEMS: MediaItem[] = UNIQUE_COLUMNS.flatMap((col) =>
  col.reversed
    ? [{ type: 'video', src: col.video }, { type: 'image', src: col.image }]
    : [{ type: 'image', src: col.image }, { type: 'video', src: col.video }]
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

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!item) return null;

  return (
    <motion.div
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
      <motion.div
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
            alt=""
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
      </motion.div>
    </motion.div>
  );
};

// ──────────────────────────────────────────
// Image card
// ──────────────────────────────────────────
const ImageCard = ({ src, idx, onOpen }: { src: string; idx: number; onOpen: () => void; key?: React.Key }) => (
  <button
    type="button"
    onClick={onOpen}
    className="insp-card block relative flex-shrink-0 overflow-hidden rounded-xl cursor-zoom-in"
    style={{ aspectRatio: '4 / 5' }}
    aria-label={`Otvoriť inšpiráciu ${idx + 1}`}
  >
    <img
      src={src}
      alt={`Inšpirácia ${idx + 1}`}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover"
    />
  </button>
);

// ──────────────────────────────────────────
// Video card
// ──────────────────────────────────────────
const VideoCard = ({ src, idx, onOpen }: { src: string; idx: number; onOpen: () => void; key?: React.Key }) => {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      type="button"
      onClick={onOpen}
      className="insp-card block relative flex-shrink-0 overflow-hidden rounded-xl cursor-zoom-in"
      style={{ aspectRatio: '9 / 16' }}
      aria-label={`Otvoriť video ${idx + 1}`}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        autoPlay
        playsInline
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        aria-label="Toggle volume"
        data-state={muted ? 'muted' : 'unmuted'}
        onClick={toggleMute}
        className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        {muted ? <MuteIcon /> : <UnmuteIcon />}
      </button>
    </button>
  );
};

// ──────────────────────────────────────────
// Column card
// ──────────────────────────────────────────
const ColumnCard = ({
  image,
  video,
  imageIdx,
  videoIdx,
  reversed,
  onOpenImage,
  onOpenVideo,
}: {
  image: string;
  video: string;
  imageIdx: number;
  videoIdx: number;
  reversed: boolean;
  onOpenImage: () => void;
  onOpenVideo: () => void;
  key?: React.Key;
}) => {
  const imageEl = <ImageCard src={image} idx={imageIdx} onOpen={onOpenImage} />;
  const videoEl = <VideoCard src={video} idx={videoIdx} onOpen={onOpenVideo} />;
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Map each unique column to its lightbox indices
  // Column i: top item = mediaIndex i*2, bottom item = mediaIndex i*2+1
  const getMediaIndex = (colIdx: number, position: 'top' | 'bottom') =>
    colIdx * 2 + (position === 'top' ? 0 : 1);

  // 6 copies total (3 per half) for the seamless -50% loop
  // 7 unique cols × 230px = 1610px → 3 copies per half = 4830px > 1920px ✓
  const strip = [
    ...UNIQUE_COLUMNS, ...UNIQUE_COLUMNS, ...UNIQUE_COLUMNS,
    ...UNIQUE_COLUMNS, ...UNIQUE_COLUMNS, ...UNIQUE_COLUMNS,
  ];

  const isOpen = lightboxIndex !== null;

  return (
    <section className="inspiration-section py-20 lg:py-28 bg-[#FAFAFA] w-full" style={{ overflow: 'clip' }}>
      {/* Header */}
      <div className="relative container mx-auto px-4 lg:px-8 mb-10 lg:mb-14">
        <div className="inspiration-header section-reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-brand-gold font-bold mb-3 block">
            Inšpirácie
          </span>
          <h2 className="text-3xl lg:text-4xl font-sans font-bold text-brand-dark leading-tight mb-4">
            Inspirujte sa.<br />Premena vášho priestoru.
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
