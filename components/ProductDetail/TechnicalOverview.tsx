import React, { useState } from 'react';
import { m } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { resolveCountryOfOrigin } from '../../constants';
import type { ShopProduct } from '../../constants';
import { Container, Eyebrow } from '../Design';
import { REVEAL, SPRING } from '../../lib/motion';
import { LIGHT_TONE_BG, type LightTone } from './types';

interface TechnicalOverviewProps {
  product: ShopProduct;
  tone?: LightTone;
}

export const TechnicalOverview: React.FC<TechnicalOverviewProps> = ({ product, tone = 'chalk' }) => {
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
    <div className="grid grid-cols-1 gap-px bg-brand-line sm:grid-cols-2 lg:grid-cols-4">
      {specs.map((spec, index) => (
        <div key={index} className="bg-white p-4 lg:p-6">
          <span className="mb-2 block text-os-eyebrow uppercase text-brand-muted">{spec.label}</span>
          <span className="text-base font-medium text-brand-dark sm:text-lg">{spec.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <section className={`py-10 lg:py-16 ${LIGHT_TONE_BG[tone]}`}>
      <Container>
        <m.div {...REVEAL}>
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              className="flex min-h-[44px] w-full items-center justify-between py-2 transition-opacity active:opacity-60"
            >
              <Eyebrow as="h2" className="text-brand-dark">
                Technické parametre
              </Eyebrow>
              <ChevronDown
                size={20}
                className={cn('text-brand-dark transition-transform duration-300', isOpen && 'rotate-180')}
              />
            </button>
            <m.div
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={SPRING}
              className="overflow-hidden"
            >
              <div className="pt-4">{specGrid}</div>
            </m.div>
          </div>

          <div className="hidden lg:block">
            <Eyebrow as="h2" className="mb-8 text-brand-dark">
              Technické parametre
            </Eyebrow>
            {specGrid}
          </div>
        </m.div>
      </Container>
    </section>
  );
};
