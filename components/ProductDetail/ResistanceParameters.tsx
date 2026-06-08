import React from 'react';
import { m } from 'framer-motion';
import { Flame, Apple, Diamond, Droplet } from 'lucide-react';
import type { ShopProduct } from '../../constants';

interface ResistanceParametersProps {
  product: ShopProduct;
}

export const ResistanceParameters: React.FC<ResistanceParametersProps> = ({ product }) => {
  const parameters = [
    {
      title: 'Odolnosť voči teplu',
      value: product.heatResistance || 'Do 300°C',
      description: 'Horúce nádoby môžete položiť priamo na povrch',
      image: '/images/resistance/heat-resistance.webp',
      icon: Flame,
    },
    {
      title: 'Hygiena a bezpečnosť potravín',
      value: 'Hygienický',
      description: 'Povrch je hygienický, nepórovitý a bezpečný pre kontakt s potravinami',
      image: '/images/resistance/food-safety.webp',
      icon: Apple,
    },
    {
      title: 'Odolnosť voči škrabancom',
      value: product.scratchResistance || 'Mohs 7+',
      description: 'Tvrdosť blízka diamantu',
      image: '/images/resistance/scratch-resistance.webp',
      icon: Diamond,
    },
    {
      title: 'Odolnosť voči škvrnám',
      value: product.stainResistance || 'Nenasiakavý',
      description: `Porozita ${product.porosity || '< 0.1%'}`,
      image: '/images/resistance/stain-resistance.webp',
      icon: Droplet,
    },
  ];

  return (
    <section className="py-10 lg:py-16 bg-brand-dark text-white">
      <div className="container mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xs lg:text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-12">
            Odolnosť materiálu
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {parameters.map((param, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-3 lg:space-y-4"
              >
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src={param.image}
                    alt={param.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 w-10 h-10 sm:w-14 sm:h-14 bg-brand-gold backdrop-blur rounded-full flex items-center justify-center">
                    <param.icon size={20} className="text-brand-dark sm:w-7 sm:h-7" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">{param.value}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white/60 mb-1">{param.title}</h3>
                  <p className="text-sm text-white/50">{param.description}</p>
                </div>
              </m.div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
};
