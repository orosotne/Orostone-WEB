import React, { useState } from 'react';
import { m } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { resolveCountryOfOrigin } from '../../constants';
import type { ShopProduct } from '../../constants';

interface TechnicalOverviewProps {
  product: ShopProduct;
}

export const TechnicalOverview: React.FC<TechnicalOverviewProps> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const specs = [
    { label: 'Materiál', value: product.material || 'Sinterovaný kameň' },
    { label: 'Hrúbka', value: product.thickness },
    { label: 'Rozmery', value: product.dimensions },
    { label: 'Povrch', value: product.finish || '—' },
    { label: 'Hrana', value: product.edgeStyle || 'Rovná hrana' },
    { label: 'Hmotnosť', value: product.weight ? `${product.weight} kg` : '—' },
    { label: 'Krajina pôvodu', value: resolveCountryOfOrigin(product) },
    { label: 'SKU', value: product.sku || '—' },
  ];

  const specGrid = (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
      {specs.map((spec, index) => (
        <div key={index} className="bg-white p-4 lg:p-6">
          <span className="text-xs lg:text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 block mb-2">
            {spec.label}
          </span>
          <span className="text-base sm:text-lg font-medium text-brand-dark">
            {spec.value}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-10 lg:py-16 bg-[#F9F9F7]">
      <div className="container mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between py-2"
            >
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-brand-gold">
                Technické parametre
              </h2>
              <ChevronDown
                size={20}
                className={cn(
                  "text-brand-gold transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <m.div
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                {specGrid}
              </div>
            </m.div>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-xs lg:text-[11px] font-bold tracking-[0.2em] uppercase text-brand-gold mb-8">
              Technické parametre
            </h2>
            {specGrid}
          </div>
        </m.div>
      </div>
    </section>
  );
};
