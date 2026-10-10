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
import { Container, Eyebrow } from '../Design';
import { REVEAL, revealAt } from '../../lib/motion';
import { LIGHT_TONE_BG, type LightTone } from './types';

interface ApplicationSectionProps {
  product: ShopProduct;
  tone?: LightTone;
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

export const ApplicationSection: React.FC<ApplicationSectionProps> = ({ product, tone = 'chalk' }) => {
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
    <section className={`py-10 lg:py-16 ${LIGHT_TONE_BG[tone]}`}>
      <Container>
        <m.div {...REVEAL}>
          <Eyebrow as="h2" className="mb-12 text-brand-dark">
            Vhodné použitie
          </Eyebrow>

          {/* Phones: a sideways strip that snaps tile by tile, the right edge fades to show there is more */}
          <div className="os-fade-x -mx-[var(--os-edge)] flex snap-x snap-mandatory scroll-px-[var(--os-edge)] gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-[var(--os-edge)] py-4 scrollbar-hide [touch-action:pan-x_pan-y] lg:mx-0 lg:grid lg:grid-cols-8 lg:gap-4 lg:overflow-visible lg:p-0 lg:[mask-image:none] lg:[-webkit-mask-image:none]">
            {allApplications.map((app, index) => {
              const isSupported = productApplications.includes(app);
              const Icon = applicationIcons[app] || Layers;
              return (
                <m.div
                  key={index}
                  {...revealAt(index)}
                  className="flex w-[84px] flex-shrink-0 snap-start flex-col items-center text-center lg:w-auto"
                >
                  <div
                    className={cn(
                      'mb-3 flex h-16 w-16 items-center justify-center rounded-full sm:mb-4 sm:h-20 sm:w-20 lg:h-24 lg:w-24',
                      // Not suitable: the icon steps back, the label stays readable
                      isSupported ? 'bg-brand-sand' : 'bg-transparent ring-1 ring-inset ring-brand-line',
                    )}
                  >
                    <Icon
                      size={36}
                      strokeWidth={1.5}
                      className={isSupported ? 'text-brand-dark' : 'text-brand-dark/25'}
                      aria-hidden="true"
                    />
                  </div>
                  <span className={cn('text-xs font-medium leading-tight sm:text-sm', isSupported ? 'text-brand-dark' : 'text-brand-muted')}>
                    {app}
                  </span>
                  {!isSupported && <span className="sr-only"> (nie je vhodné)</span>}
                </m.div>
              );
            })}
            {/* room for the fade, so the last tile can scroll fully into view */}
            <span aria-hidden="true" className="w-6 flex-none lg:hidden" />
          </div>
        </m.div>
      </Container>
    </section>
  );
};
