import React from 'react';
import { resolveCountryOfOrigin } from '../../constants';
import type { ShopProduct } from '../../constants';
import { buildProductJsonLd } from '../../lib/productSchema';

interface ProductSchemaProps {
  product: ShopProduct;
  totalPrice: number;
}

// Thin wrapper — the schema itself comes from lib/productSchema.ts, the
// single source of truth shared with scripts/prerender.ts, so client and
// prerendered JSON-LD can never diverge.
export const ProductSchema: React.FC<ProductSchemaProps> = ({ product, totalPrice }) => {
  const schema = buildProductJsonLd(product, {
    countryOfOrigin: resolveCountryOfOrigin(product, 'slovakia'),
    totalPrice,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
