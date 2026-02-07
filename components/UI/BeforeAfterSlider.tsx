import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { MapPin } from 'lucide-react';

gsap.registerPlugin(Draggable);

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  location: string;
  description: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  title,
  location,
  description
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  useEffect(() => {
    if (!containerRef.current || !sliderRef.current || !beforeRef.current) return;

    const container = containerRef.current;
    const slider = sliderRef.current;
    const beforeDiv = beforeRef.current;

    const updateSlider = (x: number) => {
      const containerRect = container.getBoundingClientRect();
      const relativeX = x - containerRect.left;
      const percentage = Math.max(0, Math.min(100, (relativeX / containerRect.width) * 100));
      setSliderPosition(percentage);
      beforeDiv.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    };

    // Initialize position
    beforeDiv.style.clipPath = `inset(0 50% 0 0)`;

    // Create draggable
    const draggable = Draggable.create(slider, {
      type: 'x',
      bounds: container,
      onDrag: function() {
        const sliderRect = slider.getBoundingClientRect();
        updateSlider(sliderRect.left + sliderRect.width / 2);
      }
    })[0];

    // Handle click on container
    const handleClick = (e: MouseEvent) => {
      if (e.target === slider || slider.contains(e.target as Node)) return;
      
      const containerRect = container.getBoundingClientRect();
      const clickX = e.clientX;
      const percentage = Math.max(0, Math.min(100, ((clickX - containerRect.left) / containerRect.width) * 100));
      
      gsap.to(slider, {
        x: (percentage / 100) * containerRect.width - containerRect.width / 2,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => {
          const sliderRect = slider.getBoundingClientRect();
          updateSlider(sliderRect.left + sliderRect.width / 2);
        }
      });
    };

    container.addEventListener('click', handleClick);

    return () => {
      draggable.kill();
      container.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="relative">
      {/* Main comparison container */}
      <div 
        ref={containerRef}
        className="relative aspect-[16/10] rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-2xl"
      >
        {/* After image (background) */}
        <div className="absolute inset-0">
          <img 
            src={afterImage} 
            alt="After"
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute bottom-6 right-6 bg-brand-gold text-brand-dark px-4 py-2 rounded-full text-sm font-medium">
            Po realizácii
          </div>
        </div>

        {/* Before image (clipped) */}
        <div 
          ref={beforeRef}
          className="absolute inset-0"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        >
          <img 
            src={beforeImage} 
            alt="Before"
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-brand-dark px-4 py-2 rounded-full text-sm font-medium">
            Pred realizáciou
          </div>
        </div>

        {/* Slider handle */}
        <div 
          ref={sliderRef}
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          {/* Handle knob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
            <div className="flex items-center gap-0.5">
              <svg className="w-3 h-3 text-brand-dark rotate-180" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <svg className="w-3 h-3 text-brand-dark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Info below */}
      <div className="mt-6 text-center">
        <h3 className="text-2xl font-sans font-bold text-brand-dark mb-2">{title}</h3>
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-3">
          <MapPin size={14} />
          {location}
        </div>
        <p className="text-gray-600 max-w-lg mx-auto">{description}</p>
      </div>
    </div>
  );
};
