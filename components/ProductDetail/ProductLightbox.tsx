import React, { useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';
import { shopifyImageUrl, shopifySrcSet } from './utils';

interface ProductLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  productName: string;
}

export const ProductLightbox: React.FC<ProductLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  productName,
}) => {
  const touchStartX = useRef<number | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrevious();
      else if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext]);

  React.useEffect(() => {
    if (!isOpen) return;
    const toPreload = [images[currentIndex - 1], images[currentIndex + 1]].filter(Boolean);
    toPreload.forEach((src) => {
      const img = new Image();
      img.src = shopifyImageUrl(src, 1600);
    });
  }, [isOpen, currentIndex, images]);

  useScrollLock(isOpen);

  if (!isOpen || !images[currentIndex]) return null;

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(diff) < 50) return;
    if (diff > 0 && hasNext) onNext();
    else if (diff < 0 && hasPrevious) onPrevious();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-[71] w-11 h-11 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-brand-gold transition-colors"
            aria-label="Zatvoriť"
          >
            <X size={24} />
          </button>

          <div className="absolute top-6 left-6 z-[71] bg-black/50 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-white text-sm font-light">
            {currentIndex + 1} / {images.length}
          </div>

          {hasPrevious && (
            <button
              onClick={(e) => { e.stopPropagation(); onPrevious(); }}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-[71] w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-brand-gold active:text-brand-gold transition-colors"
              aria-label="Predchádzajúci obrázok"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {hasNext && (
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-[71] w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:text-brand-gold active:text-brand-gold transition-colors"
              aria-label="Ďalší obrázok"
            >
              <ChevronRight size={28} />
            </button>
          )}

          <m.img
            key={currentIndex}
            src={shopifyImageUrl(images[currentIndex], 1600)}
            srcSet={shopifySrcSet(images[currentIndex])}
            sizes="100vw"
            alt={`${productName} - ${currentIndex + 1}`}
            className="max-w-[calc(100%-2rem)] md:max-w-[calc(100%-8rem)] max-h-[85vh] object-contain"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
        </m.div>
      )}
    </AnimatePresence>
  );
};
