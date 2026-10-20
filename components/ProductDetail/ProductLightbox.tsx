import React, { useEffect, useRef, useState } from 'react';
import {
  m,
  AnimatePresence,
  animate,
  useDragControls,
  useMotionValue,
  usePresence,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';
import { preloadImage, shopifySized, shopifySrcSet } from './utils';
import { FADE, SPRING, SPRING_FLICK, projectMomentum } from '../../lib/motion';

/** The photo on the page the lightbox grows out of: its frame on screen and the image's natural aspect (w / h). */
export interface LightboxOrigin {
  rect: DOMRect;
  aspect: number;
  /** The URL the page photo shows (its srcset pick), already in the cache: the flight starts on those pixels */
  src?: string;
}

interface ProductLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  productName: string;
  /** Alt text per photo; defaults to "<productName> - <n>" */
  alts?: string[];
  /** Measures the photo on the page; called when the lightbox opens and again when it closes */
  getOrigin?: () => LightboxOrigin | null;
}

/** Shared-element geometry: how the full-size photo sits over the page photo when progress is 0. */
interface Geometry {
  dx: number;
  dy: number;
  scale: number;
  insetX: number;
  insetY: number;
  radius: number;
  /** No page photo to come from: start a little smaller in the middle and fade in */
  fallback: boolean;
}

const PAGE_RADIUS = 3; // px, the gallery's rounded-[3px]
const PAGE_DISTANCE = 110; // px of projected travel that turns a sideways flick into "next photo"
const CLOSE_DISTANCE = 140; // px of projected travel that turns an up/down flick into "close"

/** The box the photo fills in the lightbox, the same limits as its CSS (max-w 100vw−2rem / −8rem, max-h 85dvh). */
const fullSize = (aspect: number) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxW = vw - (vw >= 768 ? 128 : 32);
  const width = Math.min(maxW, vh * 0.85 * aspect);
  return { width, height: width / aspect };
};

/**
 * FLIP for a photo whose crop differs between page and lightbox. The image keeps its natural aspect the whole way
 * (one uniform scale, so it never stretches); a clip window shrinks from the page frame's crop to nothing. At
 * progress 0 the pixels sit exactly where the page photo is, cropped the same way.
 */
const geometryFrom = (origin: LightboxOrigin | null, aspect: number): Geometry => {
  if (!origin) return { dx: 0, dy: 0, scale: 0.92, insetX: 0, insetY: 0, radius: 0, fallback: true };
  const { rect } = origin;
  const full = fullSize(aspect);
  // The page photo is object-cover: the whole image, scaled to cover its frame and centred on it
  const cover = rect.width / rect.height > aspect
    ? { width: rect.width, height: rect.width / aspect }
    : { width: rect.height * aspect, height: rect.height };
  const scale = cover.width / full.width;
  return {
    dx: rect.left + rect.width / 2 - window.innerWidth / 2,
    dy: rect.top + rect.height / 2 - window.innerHeight / 2,
    scale,
    // the visible window (the page frame) in the full-size photo's own pixels
    insetX: Math.max(0, (full.width - rect.width / scale) / 2),
    insetY: Math.max(0, (full.height - rect.height / scale) / 2),
    radius: PAGE_RADIUS / scale,
    fallback: false,
  };
};

const mix = (from: number, to: number, p: number) => from + (to - from) * p;

/** `sizes` of the full-size photo, shared with the preloader so both pick the same srcset candidate */
const FULL_SIZES = '100vw';

/**
 * Product gallery lightbox. The photo grows out of the one on the page (same place, same crop) and shrinks back into
 * it; on touch it follows the finger: a sideways flick pages, an up/down flick closes, the backdrop thins out while
 * it is pulled.
 */
export const ProductLightbox: React.FC<ProductLightboxProps> = (props) => (
  <AnimatePresence>
    {props.isOpen && props.images[props.currentIndex] && <LightboxView key="lightbox" {...props} />}
  </AnimatePresence>
);

const LightboxView: React.FC<ProductLightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
  productName,
  alts,
  getOrigin,
}) => {
  const [isPresent, safeToRemove] = usePresence();
  const reduceMotion = useReducedMotion();

  // Natural aspect of each photo: the opened one comes from the page, the others from their onLoad
  const opened = useRef<LightboxOrigin | null | undefined>(undefined);
  if (opened.current === undefined) opened.current = getOrigin?.() ?? null;
  const [aspects, setAspects] = useState<Record<number, number>>(() =>
    opened.current ? { [currentIndex]: opened.current.aspect } : {},
  );
  const learnAspect = (index: number, img: HTMLImageElement) => {
    // the real aspect wins over the estimate (an unloaded page photo reports its frame instead)
    if (!img.naturalWidth || !img.naturalHeight) return;
    const real = img.naturalWidth / img.naturalHeight;
    setAspects((prev) => (Math.abs((prev[index] ?? 0) - real) > 0.01 ? { ...prev, [index]: real } : prev));
  };

  // Under every full-size photo lies a small one the page has usually loaded already (the thumbnail, or for the
  // opened photo the exact image on the page), so the stage never shows an empty frame while the big one downloads.
  const openedIndex = useRef(currentIndex);
  const thumbWidth = useRef(window.matchMedia('(min-width: 1024px)').matches ? 400 : 200);
  const placeholderFor = (index: number) =>
    (index === openedIndex.current && opened.current?.src) || shopifySized(images[index], thumbWidth.current);
  const aspect = aspects[currentIndex] ?? opened.current?.aspect ?? 1;
  const full = fullSize(aspect);

  // 0 = over the page photo, 1 = open. One spring drives position, scale, crop and backdrop together.
  const geometry = useRef<Geometry | null>(null);
  if (geometry.current === null) geometry.current = geometryFrom(opened.current, aspect);
  const progress = useMotionValue(reduceMotion ? 1 : 0);
  const fade = useMotionValue(reduceMotion || geometry.current.fallback ? 0 : 1);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const stageX = useTransform(progress, (p) => mix(geometry.current!.dx, 0, p));
  const stageY = useTransform(progress, (p) => mix(geometry.current!.dy, 0, p));
  const stageScale = useTransform(progress, (p) => mix(geometry.current!.scale, 1, p));
  const stageClip = useTransform(progress, (p) => {
    const g = geometry.current!;
    if (p >= 0.999 || (!g.insetX && !g.insetY && !g.radius)) return 'none';
    const k = 1 - p;
    return `inset(${g.insetY * k}px ${g.insetX * k}px ${g.insetY * k}px ${g.insetX * k}px round ${g.radius * k}px)`;
  });
  // Pulling the photo up or down lets the page show through and the photo shrink a little, like in Photos
  const pullScale = useTransform(dragY, [-360, 0, 360], [0.86, 1, 0.86]);
  const backdropOpacity = useTransform([progress, fade, dragY], ([p, f, y]: number[]) =>
    Math.min(p, f) * (1 - Math.min(Math.abs(y) / 360, 1) * 0.65),
  );
  const controlsOpacity = useTransform([progress, fade], ([p, f]: number[]) => Math.min(Math.max(0, (p - 0.6) / 0.4), f));

  const dragControls = useDragControls();
  const axis = useRef<'x' | 'y' | null>(null);
  const releaseVelocity = useRef({ x: 0, y: 0 });

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Open: grow out of the page photo
  useEffect(() => {
    if (reduceMotion) {
      animate(fade, 1, FADE);
      return;
    }
    if (geometry.current!.fallback) animate(fade, 1, FADE);
    animate(progress, 1, SPRING);
  }, [fade, progress, reduceMotion]);

  // Close: measure the page photo again (the visitor may have paged to another one) and shrink back into it,
  // continuing from wherever the finger let go
  useEffect(() => {
    if (isPresent) return;
    geometry.current = geometryFrom(getOrigin?.() ?? null, aspect);
    const v = releaseVelocity.current;
    const runs = reduceMotion
      ? [animate(fade, 0, FADE)]
      : [
          animate(progress, 0, SPRING),
          animate(dragX, 0, { ...SPRING, velocity: v.x }),
          animate(dragY, 0, { ...SPRING, velocity: v.y }),
          ...(geometry.current.fallback ? [animate(fade, 0, FADE)] : []),
        ];
    Promise.all(runs).then(() => safeToRemove?.());
    // runs once, when the lightbox starts to leave
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent]);

  useEffect(() => {
    if (!isPresent) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrevious();
      else if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresent, onClose, onPrevious, onNext]);

  // Every photo's aspect up front, from the small placeholders, so paging never resizes the stage when the photo
  // arrives; and the neighbours at full size, the same srcset pick as the <img> below
  useEffect(() => {
    let alive = true;
    images.forEach((src, index) => {
      const img = new Image();
      img.src = shopifySized(src, thumbWidth.current);
      img.decode().then(() => alive && learnAspect(index, img), () => {});
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  useEffect(() => {
    [images[currentIndex - 1], images[currentIndex + 1]].forEach((src) => src && preloadImage(src, FULL_SIZES));
  }, [currentIndex, images]);

  // Held until the photo is back on the page, so nothing scrolls under the closing animation
  useScrollLock(true);

  // One finger moves the photo; two fingers are left to the browser's pinch zoom (touch-action: pinch-zoom)
  const startDrag = (e: React.PointerEvent) => {
    if (!isPresent || (e.pointerType === 'mouse' && e.button !== 0)) return;
    axis.current = null;
    dragControls.start(e);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    releaseVelocity.current = { x: info.velocity.x, y: info.velocity.y };
    const lockedAxis = axis.current ?? (Math.abs(info.offset.y) > Math.abs(info.offset.x) ? 'y' : 'x');
    if (lockedAxis === 'y') {
      // Up or down, far or fast enough: close. The photo flies back into the page from where the finger let go.
      if (Math.abs(info.offset.y + projectMomentum(info.velocity.y)) > CLOSE_DISTANCE) {
        onClose();
        return;
      }
    } else {
      const travel = info.offset.x + projectMomentum(info.velocity.x);
      if (travel < -PAGE_DISTANCE && hasNext) {
        onNext();
        // The next photo arrives from the right, carrying the flick's speed
        dragX.set(80);
        animate(dragX, 0, { ...SPRING_FLICK, velocity: info.velocity.x });
        animate(dragY, 0, SPRING);
        return;
      }
      if (travel > PAGE_DISTANCE && hasPrevious) {
        onPrevious();
        dragX.set(-80);
        animate(dragX, 0, { ...SPRING_FLICK, velocity: info.velocity.x });
        animate(dragY, 0, SPRING);
        return;
      }
    }
    // Not far enough: back to the middle, starting from the finger's speed
    animate(dragX, 0, { ...SPRING, velocity: info.velocity.x });
    animate(dragY, 0, { ...SPRING, velocity: info.velocity.y });
  };

  const src = images[currentIndex];

  return (
    <div
      className={`fixed inset-0 z-[70] ${isPresent ? '' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${productName}, galéria`}
      // The AI chat button (widget.js) lies above every layer of the site: it steps aside while this is open
      data-aipredajca-hide=""
    >
      <m.div className="absolute inset-0 bg-black/95" style={{ opacity: backdropOpacity }} onClick={onClose} aria-hidden="true" />

      {/* Controls appear once the photo has landed and leave first */}
      <m.div className="pointer-events-none absolute inset-0 z-[71]" style={{ opacity: controlsOpacity }}>
        <button
          type="button"
          onClick={onClose}
          className="os-press pointer-events-auto absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/75 md:right-6 md:top-6"
          aria-label="Zatvoriť"
        >
          <X size={24} />
        </button>

        <div className="pointer-events-auto absolute left-4 top-4 rounded-full bg-black/50 px-3.5 py-1.5 text-sm tabular-nums text-white backdrop-blur-sm md:left-6 md:top-6">
          {currentIndex + 1} / {images.length}
        </div>

        {hasPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            className="os-press pointer-events-auto absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/75 md:left-6"
            aria-label="Predchádzajúci obrázok"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {hasNext && (
          <button
            type="button"
            onClick={onNext}
            className="os-press pointer-events-auto absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/75 md:right-6"
            aria-label="Ďalší obrázok"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </m.div>

      {/* Stage: the shared-element flight (position, scale, crop). Inside it, the finger moves the photo 1:1. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <m.div
          style={{ x: stageX, y: stageY, scale: stageScale, clipPath: stageClip, opacity: fade, width: full.width, height: full.height }}
          className="flex-none"
        >
          <m.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragDirectionLock
            onDirectionLock={(locked) => { axis.current = locked; }}
            onDragEnd={handleDragEnd}
            onPointerDown={startDrag}
            style={{ x: dragX, y: dragY, scale: pullScale, touchAction: 'pinch-zoom' }}
            className="pointer-events-auto relative h-full w-full cursor-grab active:cursor-grabbing"
          >
            <img
              key={`placeholder-${currentIndex}`}
              src={placeholderFor(currentIndex)}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-contain"
            />
            <img
              key={currentIndex}
              src={shopifySized(src, 1600)}
              srcSet={shopifySrcSet(src)}
              sizes={FULL_SIZES}
              alt={alts?.[currentIndex] ?? `${productName} - ${currentIndex + 1}`}
              draggable={false}
              onLoad={(e) => learnAspect(currentIndex, e.currentTarget)}
              className="relative h-full w-full select-none object-contain"
            />
          </m.div>
        </m.div>
      </div>
    </div>
  );
};
