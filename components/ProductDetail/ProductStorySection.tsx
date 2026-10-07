import React from 'react';
import { m } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ShopProduct } from '../../constants';
import { shopifySized } from '../../lib/shopifyImage';

interface ProductStorySectionProps {
  product: ShopProduct;
}

export const ProductStorySection: React.FC<ProductStorySectionProps> = ({ product }) => {
  const rd = product.richDescription;

  if (!rd && !product.designInsight) return null;

  const StoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <section className="py-12 lg:py-20 relative overflow-hidden bg-brand-sand">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </div>

      <m.div
        initial={{ opacity: 0, x: 30, y: -20 }}
        whileInView={{ opacity: 0.55, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute top-0 right-0 translate-x-[25%] -translate-y-[15%] w-[280px] h-[360px] rotate-[10deg] pointer-events-none hidden lg:block z-0"
      >
        <img
          src={shopifySized(product.image, 640)}
          alt={`${product.name} — povrch sinterovaného kameňa`}
          className="w-full h-full object-cover rounded-[3px] shadow-2xl"
        />
      </m.div>
    </section>
  );

  if (!rd && product.designInsight) {
    return (
      <StoryWrapper>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="flex items-center gap-3.5 text-os-eyebrow uppercase text-brand-dark before:h-px before:w-7 before:bg-current before:opacity-75 before:content-[''] mb-8">
            Štýl & Inšpirácia
          </h2>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="prose prose-lg max-w-none [&>p]:text-brand-dark/80 [&>p]:leading-relaxed [&>p]:mb-4 [&>ul]:text-brand-dark/80 [&>ol]:text-brand-dark/80 [&>strong]:text-brand-dark [&>strong]:font-bold border-l-2 border-brand-dark/20 pl-6"
          dangerouslySetInnerHTML={{ __html: product.designInsight }}
        />
      </StoryWrapper>
    );
  }

  if (!rd) return null;
  const highlightsTitle = rd.highlightsTitle || `Prečo si vybrať ${product.name}?`;

  return (
    <StoryWrapper>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="flex items-center gap-3.5 text-os-eyebrow uppercase text-brand-dark before:h-px before:w-7 before:bg-current before:opacity-75 before:content-[''] mb-8">
          O produkte
        </h2>
      </m.div>

      <m.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-lg md:text-xl text-brand-dark/80 leading-relaxed mb-12 border-l-2 border-brand-dark/20 pl-6"
      >
        {rd.intro}
      </m.p>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <h3 className="text-lg font-bold text-brand-dark mb-6">
          {highlightsTitle}
        </h3>
        <ul className="space-y-3">
          {rd.highlights.map((highlight, index) => (
            <m.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.07 }}
              className="flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-brand-dark/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={12} className="text-brand-dark" />
              </div>
              <span className="text-brand-dark/80 leading-relaxed">{highlight}</span>
            </m.li>
          ))}
        </ul>
      </m.div>

      <m.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-base md:text-lg text-brand-dark/60 leading-relaxed italic"
      >
        {rd.closing}
      </m.p>
    </StoryWrapper>
  );
};
