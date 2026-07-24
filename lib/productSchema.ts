// ===========================================
// PRODUCT JSON-LD — single source of truth
// ===========================================
// One builder for the Product + Offer schema, used by BOTH the prerender
// (scripts/prerender.ts) and the client (components/ProductDetail/
// ProductSchema.tsx), so crawlers and hydrated pages always emit the SAME
// structured data. Offer.price is the TRANSACTABLE amount — the total slab
// price (what the Shopify variant actually sells), not the per-m² rate;
// the per-m² rate is exposed as an additionalProperty.
//
// Plain, dependency-free TS (same contract as lib/slab.ts): browser,
// tsx build scripts and Vercel functions can all import it.
import { calculateSlabPrice } from './slab';

const BASE_URL = 'https://orostone.sk';

/** Minimal product shape the builder needs (subset of ShopProduct / fallback JSON). */
export interface ProductSchemaSource {
  id: string;
  name: string;
  description?: string;
  metaDescription?: string;
  seoDescription?: string;
  dimensions: string;
  thickness?: string;
  finish?: string;
  material?: string;
  heatResistance?: string;
  scratchResistance?: string;
  weight?: number;
  sku?: string;
  image: string;
  gallery?: string[];
  inStock?: boolean;
  vendor?: string;
  keywords?: string[];
  applications?: string[];
  pricePerM2: number;
}

export interface ProductSchemaOptions {
  /** Resolved country of origin (callers use resolveCountryOfOrigin from constants). */
  countryOfOrigin: string;
  /** Override for the slab total (e.g. live Shopify variant price). Defaults to calculateSlabPrice. */
  totalPrice?: number;
}

export function buildProductJsonLd(
  product: ProductSchemaSource,
  opts: ProductSchemaOptions,
): Record<string, unknown> {
  const totalPrice = opts.totalPrice ?? calculateSlabPrice(product.pricePerM2, product.dimensions);
  const canonical = `${BASE_URL}/produkt/${product.id}`;

  const richDescription =
    product.metaDescription ||
    product.seoDescription ||
    `${product.name} je prémiový sinterovaný kameň s rozmermi ${product.dimensions}. Tento ${product.material || 'sinterovaný kameň'} s povrchom ${product.finish || 'leštený'} je ideálny pre ${(product.applications || ['kuchyne', 'kúpeľne']).slice(0, 3).join(', ').toLowerCase()}. Materiál ponúka výnimočnú odolnosť voči teplu (${product.heatResistance || 'do 300°C'}), škrabancom a škvrnám.`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: richDescription,
    image: product.gallery && product.gallery.length > 0 ? product.gallery : [product.image],
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.vendor || 'OROSTONE',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'OROSTONE s.r.o.',
      url: BASE_URL,
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: { '@type': 'GeoCoordinates', latitude: 48.1486, longitude: 17.1077 },
        geoRadius: '50000',
      },
    },
    category: 'Veľkoformátové platne',
    material: product.material || 'Sinterovaný kameň',
    size: product.dimensions,
    weight: product.weight ? `${product.weight} kg` : undefined,
    countryOfOrigin: opts.countryOfOrigin,
    url: canonical,
    offers: {
      '@type': 'Offer',
      url: canonical,
      priceCurrency: 'EUR',
      price: totalPrice.toFixed(2),
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'OROSTONE s.r.o.' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'SK' },
        shippingRate: { '@type': 'MonetaryAmount', value: '150', currency: 'EUR' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 5, unitCode: 'd' },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'SK',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
      },
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Hrúbka', value: product.thickness },
      { '@type': 'PropertyValue', name: 'Povrch', value: product.finish || 'Leštený' },
      {
        '@type': 'PropertyValue',
        name: 'Odolnosť voči teplu',
        value: product.heatResistance || 'Do 300°C',
      },
      {
        '@type': 'PropertyValue',
        name: 'Tvrdosť',
        value: product.scratchResistance || 'Mohs 7+',
      },
      {
        '@type': 'PropertyValue',
        name: 'Cena za m²',
        value: `${product.pricePerM2.toFixed(2)} € / m² s DPH`,
      },
    ],
  };

  if (product.keywords && product.keywords.length > 0) {
    schema['keywords'] = product.keywords.join(', ');
  }

  return schema;
}
