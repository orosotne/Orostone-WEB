import React from 'react';
import { m } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ShopProduct } from '../../constants';

interface KeyBenefitsSectionProps {
  product: ShopProduct;
}

export const KeyBenefitsSection: React.FC<KeyBenefitsSectionProps> = ({ product }) => {
  const benefits = product.keyBenefits;
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-xs lg:text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">
            Kľúčové výhody
          </h2>

          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <m.li
                key={index}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                className="flex items-start gap-4"
              >
                <div className="w-7 h-7 rounded-full bg-brand-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={14} className="text-brand-gold" />
                </div>
                <span className="text-base lg:text-lg text-gray-700 leading-relaxed font-light">
                  {benefit}
                </span>
              </m.li>
            ))}
          </ul>
        </m.div>
      </div>
    </section>
  );
};
