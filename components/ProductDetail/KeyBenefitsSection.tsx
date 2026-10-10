import React from 'react';
import { m } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ShopProduct } from '../../constants';
import { Container, Eyebrow } from '../Design';
import { revealAt } from '../../lib/motion';
import { LIGHT_TONE_BG, type LightTone } from './types';

interface KeyBenefitsSectionProps {
  product: ShopProduct;
  tone?: LightTone;
}

export const KeyBenefitsSection: React.FC<KeyBenefitsSectionProps> = ({ product, tone = 'chalk' }) => {
  const benefits = product.keyBenefits;
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className={`py-12 lg:py-16 ${LIGHT_TONE_BG[tone]}`}>
      <Container>
        <div className="max-w-3xl">
          <Eyebrow as="h2" className="mb-8 text-brand-dark">
            Kľúčové výhody
          </Eyebrow>

          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <m.li key={index} {...revealAt(index)} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-sand">
                  <Check size={14} className="text-brand-dark" />
                </div>
                <span className="text-base font-light leading-relaxed text-brand-dark/85 lg:text-lg">{benefit}</span>
              </m.li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
};
