import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ===========================================
// TYPES
// ===========================================

interface Announcement {
  id: string;
  text: string;
  highlight?: string;
}

interface EshopAnnouncementBarProps {
  announcements?: Announcement[];
  backgroundColor?: string;
  rotationInterval?: number; // ms
}

// ===========================================
// DEFAULT ANNOUNCEMENTS
// ===========================================

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', text: 'DOPRAVA ZADARMO', highlight: 'NAD 200€' },
  { id: '2', text: 'SKLADOVÉ PLATNE', highlight: 'IHNEĎ K ODBERU' },
  { id: '3', text: 'GARANCIA VRÁTENIA', highlight: '14 DNÍ' },
];

// ===========================================
// COMPONENT
// ===========================================

export const EshopAnnouncementBar: React.FC<EshopAnnouncementBarProps> = ({
  announcements = DEFAULT_ANNOUNCEMENTS,
  backgroundColor = '#ECD488', // Brand gold - zlatá farba Orostone
  rotationInterval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate announcements
  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [announcements.length, rotationInterval]);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[60] overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-2.5">
          
          {/* Left side message (desktop) */}
          <div className="hidden lg:flex items-center text-brand-dark text-xs font-bold tracking-wider uppercase">
            <span>{announcements[0]?.text}</span>
            {announcements[0]?.highlight && (
              <span className="ml-1 underline underline-offset-2">
                {announcements[0].highlight}
              </span>
            )}
          </div>

          {/* Center - Rotating announcements */}
          <div className="flex-1 lg:flex-none text-center min-h-[20px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-brand-dark text-xs font-bold tracking-wider uppercase"
              >
                <span>{announcements[currentIndex]?.text}</span>
                {announcements[currentIndex]?.highlight && (
                  <span className="ml-1 font-black">
                    {announcements[currentIndex].highlight}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right side message (desktop) */}
          <div className="hidden lg:flex items-center text-brand-dark text-xs font-bold tracking-wider uppercase">
            <span>{announcements[2]?.text || announcements[announcements.length - 1]?.text}</span>
            {(announcements[2]?.highlight || announcements[announcements.length - 1]?.highlight) && (
              <span className="ml-1 underline underline-offset-2">
                {announcements[2]?.highlight || announcements[announcements.length - 1]?.highlight}
              </span>
            )}
          </div>

          {/* Progress dots (mobile) */}
          <div className="flex lg:hidden items-center gap-1.5 ml-4">
            {announcements.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-brand-dark' : 'bg-brand-dark/40'
                }`}
                aria-label={`Zobraziť správu ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Subtle bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10" />
    </div>
  );
};
