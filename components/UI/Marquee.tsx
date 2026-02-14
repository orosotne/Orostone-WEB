import React from 'react';
import { 
  Sun, 
  Flame, 
  ShieldCheck, 
  ShieldPlus, 
  CookingPot, 
  Sparkles, 
  Building2, 
  Layers 
} from 'lucide-react';

const TRUST_ICONS = [
  { icon: Sun, label: "UV Resistant" },
  { icon: Flame, label: "Heat Resistant" },
  { icon: ShieldCheck, label: "Stain Proof" },
  { icon: ShieldPlus, label: "Hygienic Surface" },
  { icon: CookingPot, label: "Food Safe" },
  { icon: Sparkles, label: "Easy Maintenance" },
  { icon: Building2, label: "Indoor & Outdoor" },
  { icon: Layers, label: "Sintered Stone Tech" }
];

export const Marquee = () => {
  return (
    <div className="relative flex overflow-hidden bg-brand-dark py-6 border-y border-white/10">
      <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
        {/* Duplicate list 4 times to ensure seamless infinite scroll */}
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={i}>
            {TRUST_ICONS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={`${i}-${index}`} 
                  className="flex items-center gap-3 mx-4 group"
                  title={item.label}
                >
                  <Icon 
                    size={24} 
                    className="text-white/40 group-hover:text-brand-gold transition-colors duration-300" 
                  />
                  <span className="text-white/30 text-xs font-medium tracking-[0.2em] uppercase group-hover:text-white/50 transition-colors duration-300">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-brand-dark to-transparent z-10" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-brand-dark to-transparent z-10" />
    </div>
  );
};

// Add this to index.html style or tailwind config:
// @keyframes marquee {
//   0% { transform: translateX(0); }
//   100% { transform: translateX(-50%); }
// }
// .animate-marquee { animation: marquee 30s linear infinite; }