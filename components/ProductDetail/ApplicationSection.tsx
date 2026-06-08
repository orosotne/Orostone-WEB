import React from 'react';
import { m } from 'framer-motion';
import {
  Utensils,
  LayoutGrid,
  Bath,
  Grid3x3,
  Building2,
  Building,
  Armchair,
  Layers,
  LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ShopProduct } from '../../constants';

interface ApplicationSectionProps {
  product: ShopProduct;
}

const applicationIcons: Record<string, LucideIcon> = {
  'Kuchynské dosky': Utensils,
  'Ostrovčeky': LayoutGrid,
  'Kúpeľne': Bath,
  'Obklad stien': Grid3x3,
  'Komerčné interiéry': Building2,
  'Fasády': Building,
  'Podlahy': Layers,
  'Nábytok': Armchair,
};

export const ApplicationSection: React.FC<ApplicationSectionProps> = ({ product }) => {
  const allApplications = [
    'Kuchynské dosky',
    'Ostrovčeky',
    'Kúpeľne',
    'Obklad stien',
    'Komerčné interiéry',
    'Fasády',
    'Podlahy',
    'Nábytok',
  ];

  const productApplications = product.applications || ['Kuchynské dosky', 'Kúpeľne', 'Obklad stien'];

  return (
    <section className="py-10 lg:py-16">
      <div className="container mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xs lg:text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-12">
            Vhodné použitie
          </h2>

          <div className="flex [touch-action:pan-x_pan-y] gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-px-6 py-4 -mx-6 px-6 scrollbar-hide lg:mx-0 lg:grid lg:grid-cols-8 lg:gap-4 lg:overflow-visible lg:px-0 lg:py-0 lg:scroll-p-0 lg:touch-auto">
            {allApplications.map((app, index) => {
              const isSupported = productApplications.includes(app);
              const Icon = applicationIcons[app] || Layers;
              return (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={cn(
                    "flex-shrink-0 w-[80px] lg:w-auto flex flex-col items-center text-center transition-all",
                    !isSupported && "opacity-40"
                  )}
                >
                  <div className={cn(
                    "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-colors",
                    isSupported ? "bg-gray-100" : "bg-gray-50"
                  )}>
                    <Icon
                      size={36}
                      strokeWidth={1.5}
                      className={cn(
                        "transition-colors",
                        isSupported ? "text-brand-dark" : "text-gray-300"
                      )}
                    />
                  </div>
                  <span className={cn(
                    "text-xs sm:text-sm font-medium leading-tight",
                    isSupported ? "text-brand-dark" : "text-gray-400"
                  )}>
                    {app}
                  </span>
                </m.div>
              );
            })}
          </div>
        </m.div>
      </div>
    </section>
  );
};
