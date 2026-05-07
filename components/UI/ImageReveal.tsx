import React from 'react';
import { m } from 'framer-motion';
import { useIsMobile } from '../../hooks/useIsMobile';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-[4/3]"
}

export const ImageReveal: React.FC<ImageRevealProps> = ({ src, alt, className = "", aspectRatio = "aspect-[4/3]" }) => {
  const isMobile = useIsMobile();

  // Mobile: skip the reveal animation entirely. The curtain overlay (bg-[#F9F9F7])
  // would otherwise prolong perceived white-screen time during slow hydration.
  if (isMobile) {
    return (
      <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
        <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      <m.div
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
        viewport={{ once: true }}
        className="w-full h-full"
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </m.div>

      {/* The Curtain/Shutter */}
      <m.div
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.83, 0, 0.17, 1] }} // Elegant easeInOut
        className="absolute inset-0 bg-[#F9F9F7] origin-bottom z-10" // Matches background color to look like reveal
      />
    </div>
  );
};