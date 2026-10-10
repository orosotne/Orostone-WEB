import React from 'react';
import { m } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ShopProduct } from '../../constants';
import { shopifySized } from '../../lib/shopifyImage';
import { withProductName } from '../../lib/utils';
import { Container, Eyebrow } from '../Design';
import { REVEAL, revealAt } from '../../lib/motion';
import { LIGHT_TONE_BG, type LightTone } from './types';

interface ProductStorySectionProps {
  product: ShopProduct;
  tone?: LightTone;
}

export const ProductStorySection: React.FC<ProductStorySectionProps> = ({ product, tone = 'sand' }) => {
  const rd = product.richDescription;

  if (!rd && !product.designInsight) return null;

  const StoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <section className={`relative overflow-hidden py-12 lg:py-20 ${LIGHT_TONE_BG[tone]}`}>
      <Container className="relative z-10">
        <div className="max-w-3xl">{children}</div>
      </Container>

      <m.div
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 0.55, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        className="pointer-events-none absolute right-0 top-0 z-0 hidden h-[360px] w-[280px] -translate-y-[15%] translate-x-[25%] rotate-[10deg] lg:block"
      >
        <img
          src={shopifySized(product.image, 640)}
          alt={`${product.name} — povrch sinterovaného kameňa`}
          className="h-full w-full rounded-[3px] object-cover"
        />
      </m.div>
    </section>
  );

  if (!rd && product.designInsight) {
    return (
      <StoryWrapper>
        <Eyebrow as="h2" className="mb-8 text-brand-dark">
          Štýl & Inšpirácia
        </Eyebrow>

        <m.div
          {...REVEAL}
          className="prose prose-lg max-w-none border-l-2 border-brand-dark/20 pl-6 [&>ol]:text-brand-dark/80 [&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-brand-dark/80 [&>strong]:font-bold [&>strong]:text-brand-dark [&>ul]:text-brand-dark/80"
          dangerouslySetInnerHTML={{ __html: withProductName(product.designInsight, product.name) }}
        />
      </StoryWrapper>
    );
  }

  if (!rd) return null;
  const highlightsTitle = rd.highlightsTitle || `Prečo si vybrať ${product.name}?`;

  return (
    <StoryWrapper>
      <Eyebrow as="h2" className="mb-8 text-brand-dark">
        O produkte
      </Eyebrow>

      <m.p {...REVEAL} className="mb-12 border-l-2 border-brand-dark/20 pl-6 text-lg leading-relaxed text-brand-dark/80 md:text-xl">
        {rd.intro}
      </m.p>

      <m.div {...REVEAL} className="mb-12">
        <h3 className="mb-6 text-lg font-bold text-brand-dark">{highlightsTitle}</h3>
        <ul className="space-y-3">
          {rd.highlights.map((highlight, index) => (
            <m.li key={index} {...revealAt(index)} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-dark/10">
                <Check size={12} className="text-brand-dark" />
              </div>
              <span className="leading-relaxed text-brand-dark/80">{highlight}</span>
            </m.li>
          ))}
        </ul>
      </m.div>

      <m.p {...REVEAL} className="text-base italic leading-relaxed text-brand-muted md:text-lg">
        {rd.closing}
      </m.p>
    </StoryWrapper>
  );
};
