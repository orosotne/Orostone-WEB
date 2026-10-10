import React from 'react';
import { getProductSEOContent, GENERIC_PRODUCT_FAQS } from '../../data/product-seo-content';
import type { ShopProduct } from '../../constants';
import { Container, Eyebrow, FaqList } from '../Design';
import { LIGHT_TONE_BG, type LightTone } from './types';

interface ProductFAQSectionProps {
  product: ShopProduct;
  tone?: LightTone;
}

/** The site's FAQ pattern: heading left, questions right from 1024 px; answers stay in the DOM (native <details>). */
export const ProductFAQSection: React.FC<ProductFAQSectionProps> = ({ product, tone = 'chalk' }) => {
  const seoContent = getProductSEOContent(product.id);
  const productFaqs = seoContent?.faqs || [];
  const allFaqs = [...productFaqs, ...GENERIC_PRODUCT_FAQS];

  if (allFaqs.length === 0) return null;

  return (
    <section className={`py-12 lg:py-16 ${LIGHT_TONE_BG[tone]}`}>
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div>
          <Eyebrow as="h2" className="text-brand-dark">
            Časté otázky
          </Eyebrow>
        </div>
        <FaqList items={allFaqs.map((faq) => ({ question: faq.question, answer: faq.answer }))} />
      </Container>
    </section>
  );
};
