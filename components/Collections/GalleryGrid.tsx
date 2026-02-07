import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { CollectionGalleryImage } from '../../types';
import { Lightbox } from '../UI/Lightbox';

interface GalleryGridProps {
  images: CollectionGalleryImage[];
  loading?: boolean;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ images, loading }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => Math.min(images.length - 1, prev + 1));
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] bg-gray-200 animate-pulse rounded-orostone"
          />
        ))}
      </div>
    );
  }

  // Prázdny stav
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg font-light">
          Galéria sa pripravuje. Čoskoro tu nájdete inšpirácie a realizácie.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={image.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative aspect-[3/4] overflow-hidden bg-gray-100 cursor-pointer rounded-orostone"
            onClick={() => handleImageClick(index)}
          >
            {/* Obrázok */}
            <img
              src={image.publicUrl}
              alt={image.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            {/* Overlay pri hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-sm uppercase tracking-widest mb-2">
                  {image.category === 'inspiration' && 'Inšpirácia'}
                  {image.category === 'realization' && 'Realizácia'}
                  {image.category === 'detail' && 'Detail'}
                  {!image.category && 'Galéria'}
                </div>
                <div className="text-xs text-gray-300">Kliknite pre detail</div>
              </div>
            </div>

            {/* Badge s kategóriou */}
            {image.category && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-white/90 backdrop-blur text-brand-dark text-[10px] font-bold tracking-wider px-3 py-1 uppercase">
                  {image.category === 'inspiration' && 'Inšpirácia'}
                  {image.category === 'realization' && 'Realizácia'}
                  {image.category === 'detail' && 'Detail'}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={images}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </>
  );
};
