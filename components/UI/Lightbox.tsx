import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CollectionGalleryImage } from '../../types';

interface LightboxProps {
  images: CollectionGalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrevious,
  onNext,
}) => {
  // Klávesnicová navigácia
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrevious();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext]);

  // Zabráň scrollovaniu na pozadí
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!images[currentIndex]) return null;

  const currentImage = images[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={onClose}
        >
          {/* Zatváracie tlačidlo */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 text-white hover:text-brand-gold transition-colors p-2"
            aria-label="Zatvoriť"
          >
            <X size={32} />
          </button>

          {/* Počítadlo obrázkov */}
          <div className="absolute top-6 left-6 z-50 text-white text-sm font-light">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Kategória obrázku (ak existuje) */}
          {currentImage.category && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
              <span className="bg-white/10 backdrop-blur text-white text-xs uppercase tracking-wider px-4 py-2">
                {currentImage.category === 'inspiration' && 'Inšpirácia'}
                {currentImage.category === 'realization' && 'Realizácia'}
                {currentImage.category === 'detail' && 'Detail'}
              </span>
            </div>
          )}

          {/* Navigačné tlačidlo - Predchádzajúci */}
          {hasPrevious && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              className="absolute left-6 z-50 text-white hover:text-brand-gold transition-colors p-2"
              aria-label="Predchádzajúci obrázok"
            >
              <ChevronLeft size={48} />
            </button>
          )}

          {/* Navigačné tlačidlo - Ďalší */}
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-6 z-50 text-white hover:text-brand-gold transition-colors p-2"
              aria-label="Ďalší obrázok"
            >
              <ChevronRight size={48} />
            </button>
          )}

          {/* Obrázok */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl max-h-[90vh] px-20"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.publicUrl}
              alt={currentImage.name}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
