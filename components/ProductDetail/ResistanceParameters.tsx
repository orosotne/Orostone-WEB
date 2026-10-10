import React from 'react';
import { m } from 'framer-motion';
import { Flame, Apple, Diamond, Droplet } from 'lucide-react';
import type { ShopProduct } from '../../constants';
import { Container, Eyebrow, ResponsiveImage } from '../Design';
import { REVEAL, revealAt } from '../../lib/motion';

interface ResistanceParametersProps {
  product: ShopProduct;
}

// Visualizations with real Orostone decors (the same set as /vyhody, made by temp_redizajn/page-assets.mjs)
const IMG = '/images/stranky';

export const ResistanceParameters: React.FC<ResistanceParametersProps> = ({ product }) => {
  const parameters = [
    {
      title: 'Odolnosť voči teplu',
      value: product.heatResistance || 'Do 300°C',
      description: 'Horúce nádoby môžete položiť priamo na povrch',
      image: { base: `${IMG}/vyhody-teplo`, ratio: 1, alt: 'Hrniec z nehrdzavejúcej ocele priamo na pracovnej doske Gothic Gold' },
      icon: Flame,
    },
    {
      title: 'Hygiena a bezpečnosť potravín',
      value: 'Hygienický',
      description: 'Povrch je hygienický, nepórovitý a bezpečný pre kontakt s potravinami',
      image: { base: `${IMG}/vyhody-udrzba`, ratio: 1, alt: 'Ruka utiera rozliatu tekutinu a omrvinky z dosky Calacatta Top vlhkou utierkou' },
      icon: Apple,
    },
    {
      title: 'Odolnosť voči škrabancom',
      value: product.scratchResistance || 'Mohs 7+',
      description: 'Tvrdosť blízka diamantu',
      image: { base: `${IMG}/sk-povrch-lesteny`, ratio: 4 / 3, alt: 'Detail lešteného povrchu dekoru Calacatta Top s odrazom svetla' },
      icon: Diamond,
    },
    {
      title: 'Odolnosť voči škvrnám',
      value: product.stainResistance || 'Nenasiakavý',
      description: `Porozita ${product.porosity || '< 0.1%'}`,
      image: { base: `${IMG}/vyhody-skvrny`, ratio: 1, alt: 'Pohár červeného vína, káva a citrón na doske Calacatta Top, pohľad zhora' },
      icon: Droplet,
    },
  ];

  return (
    <section className="bg-brand-dark py-10 text-brand-light lg:py-16">
      <Container>
        <m.div {...REVEAL}>
          <Eyebrow as="h2" gold className="mb-12">
            Odolnosť materiálu
          </Eyebrow>

          <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
            {parameters.map((param, index) => (
              <m.div key={index} {...revealAt(index)} className="grid content-start gap-4">
                <div className="relative aspect-square overflow-hidden rounded-[3px] bg-brand-stone">
                  <ResponsiveImage
                    base={param.image.base}
                    widths={[640, 1200]}
                    ratio={param.image.ratio}
                    alt={param.image.alt}
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-brand-light sm:h-12 sm:w-12">
                    <param.icon size={20} className="text-brand-dark" aria-hidden="true" />
                  </div>
                </div>

                {/* The value sits under the photo on graphite, never as white text on a light picture */}
                <div className="grid gap-1">
                  <p className="text-os-h3 text-brand-light">{param.value}</p>
                  <h3 className="text-sm font-medium text-brand-light/80">{param.title}</h3>
                  <p className="text-sm font-normal text-brand-light/70">{param.description}</p>
                </div>
              </m.div>
            ))}
          </div>

          <p className="mt-10 text-[0.84rem] font-normal text-brand-light/70">
            Ilustračné vizualizácie. Kameň na nich je skutočný dekor Orostone: Gothic Gold a Calacatta Top.
          </p>
        </m.div>
      </Container>
    </section>
  );
};
