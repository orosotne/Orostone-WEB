import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getProductSEOContent, GENERIC_PRODUCT_FAQS } from '../../data/product-seo-content';
import type { ShopProduct } from '../../constants';

interface ProductFAQSectionProps {
  product: ShopProduct;
}

export const ProductFAQSection: React.FC<ProductFAQSectionProps> = ({ product }) => {
  const seoContent = getProductSEOContent(product.id);
  const productFaqs = seoContent?.faqs || [];
  const allFaqs = [...productFaqs, ...GENERIC_PRODUCT_FAQS];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (allFaqs.length === 0) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs lg:text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8"
          >
            Časté otázky
          </m.h2>

          <div className="divide-y divide-gray-200">
            {allFaqs.map((faq, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4"
                >
                  <span className="text-base lg:text-lg font-medium text-brand-dark leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "flex-shrink-0 text-gray-400 transition-transform duration-200",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-gray-600 font-light leading-relaxed">
                        {faq.answer}
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            ))}
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
};
