import React, { useEffect, useRef } from 'react';
import { m, AnimatePresence, animate, useDragControls, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';
import { shopifyImageUrl, shopifySrcSet } from './utils';
import { FADE, SPRING, SPRING_FLICK, projectMomentum } from '../../lib/motion';

interface ProductLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  productName: string;
  /**
   * Where the photo sits on the page, measured by the parent when it opens and again when it closes:
   * the lightbox grows out of it and shrinks back into it.
   */
  originRect?: DOMRect | null;
}

interface Origin {
  x: number;
  y: number;
  scale: number;
}

const CENTERED: Origin = { x: 0, y: 0, scale: 0.92 };

/** Offset and scale that put the full-screen photo over its source on the page. */
const originFrom = (rect: DOMRect | null): Origin => {
  if (!rect || typeof window === 'undefined') return CENTERED;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const shown = Math.min(vw - 32, vh * 0.85);
  return {
    x: rect.left + rect.width / 2 - vw / 2,
    y: rect.top + rect.height / 2 - vh / 2,
    scale: Math.min(1, Math.max(0.2, rect.width / shown)),
  };
};

// Exit and enter read the origin through `custom`, so closing goes back to wherever the source is now
const STAGE = {
  closed: (o: Origin) => ({ x: o.x, y: o.y, scale: o.scale, opacity: 0, transition: SPRING }),
  open: { x: 0, y: 0, scale: 1, opacity: 1, transition: SPRING },
};

const PAGE_DISTANCE = 110; // px of projected travel that turns a sideways flick into "next photo"
const CLOSE_DISTANCE = 140; // px of projected travel that turns an up/down flick into "close"

export const ProductLightbox: React.FC<ProductLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  productName,
  originRect = null,
}) => {
  const origin = originFrom(originRect);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Pulling the photo up or down lets the page show through and the photo shrink a little, like in Photos
  const backdropOpacity = useTransform(y, [-360, 0, 360], [0.35, 1, 0.35]);
  const pullScale = useTransform(y, [-360, 0, 360], [0.86, 1, 0.86]);
  const axis = useRef<'x' | 'y' | null>(null);

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const close = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrevious();
      else if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext]);

  useEffect(() => {
    if (!isOpen) return;
    const toPreload = [images[currentIndex - 1], images[currentIndex + 1]].filter(Boolean);
    toPreload.forEach((src) => {
      const img = new Image();
      img.src = shopifyImageUrl(src, 1600);
    });
  }, [isOpen, currentIndex, images]);

  useScrollLock(isOpen);

  // One finger moves the photo; two fingers are left to the browser's pinch zoom (touch-action: pinch-zoom)
  const startDrag = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    axis.current = null;
    dragControls.start(e);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const lockedAxis = axis.current ?? (Math.abs(info.offset.y) > Math.abs(info.offset.x) ? 'y' : 'x');
    if (lockedAxis === 'y') {
      // Up or down, far or fast enough: close. The exit continues from where the finger let go.
      if (Math.abs(info.offset.y + projectMomentum(info.velocity.y)) > CLOSE_DISTANCE) {
        close();
        return;
      }
    } else {
      const travel = info.offset.x + projectMomentum(info.velocity.x);
      if (travel < -PAGE_DISTANCE && hasNext) {
        onNext();
        // The next photo arrives from the right, carrying the flick's speed
        x.set(80);
        animate(x, 0, { ...SPRING_FLICK, velocity: info.velocity.x });
        animate(y, 0, SPRING);
        return;
      }
      if (travel > PAGE_DISTANCE && hasPrevious) {
        onPrevious();
        x.set(-80);
        animate(x, 0, { ...SPRING_FLICK, velocity: info.velocity.x });
        animate(y, 0, SPRING);
        return;
      }
    }
    // Not far enough: back to the middle, starting from the finger's speed
    animate(x, 0, { ...SPRING, velocity: info.velocity.x });
    animate(y, 0, { ...SPRING, velocity: info.velocity.y });
  };

  const src = images[currentIndex];

  return (
    <AnimatePresence custom={origin}>
      {isOpen && src && (
        <m.div
          key="lightbox"
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label={`${productName}, galéria`}
        >
          {/* Backdrop fades in and out on its own; the inner layer thins out while the photo is pulled away */}
          <m.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
            onClick={close}
            aria-hidden="true"
          >
            <m.div className="absolute inset-0 bg-black/95" style={{ opacity: backdropOpacity }} />
          </m.div>

          {/* Controls fade together with the backdrop */}
          <m.div
            className="pointer-events-none absolute inset-0 z-[71]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
          >
            <button
              type="button"
              onClick={close}
              className="os-press absolute right-4 top-4 pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/75 md:right-6 md:top-6"
              aria-label="Zatvoriť"
            >
              <X size={24} />
            </button>

            <div className="absolute left-4 top-4 pointer-events-auto rounded-full bg-black/50 px-3.5 py-1.5 text-sm tabular-nums text-white backdrop-blur-sm md:left-6 md:top-6">
              {currentIndex + 1} / {images.length}
            </div>

            {hasPrevious && (
              <button
                type="button"
                onClick={onPrevious}
                className="os-press absolute left-3 top-1/2 pointer-events-auto flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/75 md:left-6"
                aria-label="Predchádzajúci obrázok"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {hasNext && (
              <button
                type="button"
                onClick={onNext}
                className="os-press absolute right-3 top-1/2 pointer-events-auto flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/75 md:right-6"
                aria-label="Ďalší obrázok"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </m.div>

          {/* The stage grows out of the photo on the page and goes back into it; the finger moves it 1:1 */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <m.div
              custom={origin}
              variants={STAGE}
              initial="closed"
              animate="open"
              exit="closed"
              drag
              dragControls={dragControls}
              dragListener={false}
              dragMomentum={false}
              dragDirectionLock
              onDirectionLock={(locked) => { axis.current = locked; }}
              onDragEnd={handleDragEnd}
              onPointerDown={startDrag}
              style={{ x, y, touchAction: 'pinch-zoom' }}
              className="pointer-events-auto cursor-grab active:cursor-grabbing"
            >
              <m.img
                key={currentIndex}
                src={shopifyImageUrl(src, 1600)}
                srcSet={shopifySrcSet(src)}
                sizes="100vw"
                alt={`${productName} - ${currentIndex + 1}`}
                draggable={false}
                style={{ scale: pullScale }}
                className="max-h-[85dvh] max-w-[calc(100vw-2rem)] select-none object-contain md:max-w-[calc(100vw-8rem)]"
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={FADE}
              />
            </m.div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
};
