import React from 'react';
import { resolveCountryOfOrigin } from '../../constants';
import type { ShopProduct } from '../../constants';

interface ProductSchemaProps {
  product: ShopProduct;
  totalPrice: number;
}

export const ProductSchema: React.FC<ProductSchemaProps> = ({ product, totalPrice }) => {
  const richDescription = product.metaDescription || product.seoDescription ||
    `${product.name} je prémiový sinterovaný kameň s rozmermi ${product.dimensions}. Tento ${product.material || 'sinterovaný kameň'} s povrchom ${product.finish || 'leštený'} je ideálny pre ${(product.applications || ['kuchyne', 'kúpeľne']).slice(0, 3).join(', ').toLowerCase()}. Materiál ponúka výnimočnú odolnosť voči teplu (${product.heatResistance || 'do 300°C'}), škrabancom a škvrnám.`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": richDescription,
    "image": product.gallery && product.gallery.length > 0 ? product.gallery : [product.image],
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.vendor || "OROSTONE"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "OROSTONE s.r.o.",
      "url": "https://orostone.sk",
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 48.1486,
          "longitude": 17.1077
        },
        "geoRadius": "50000"
      }
    },
    "category": "Veľkoformátové platne",
    "material": product.material || "Sinterovaný kameň",
    "size": product.dimensions,
    "weight": product.weight ? `${product.weight} kg` : undefined,
    "countryOfOrigin": resolveCountryOfOrigin(product, 'slovakia'),
    "url": `https://orostone.sk/produkt/${product.id}`,
    "offers": {
      "@type": "Offer",
      "url": `https://orostone.sk/produkt/${product.id}`,
      "priceCurrency": "EUR",
      "price": totalPrice.toFixed(2),
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "availability": product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "OROSTONE s.r.o."
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "SK"
        },
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "150",
          "currency": "EUR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 5,
            "unitCode": "d"
          }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "SK",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 14,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/ReturnFeesCustomerResponsibility"
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Hrúbka",
        "value": product.thickness
      },
      {
        "@type": "PropertyValue",
        "name": "Povrch",
        "value": product.finish || "Leštený"
      },
      {
        "@type": "PropertyValue",
        "name": "Odolnosť voči teplu",
        "value": product.heatResistance || "Do 300°C"
      },
      {
        "@type": "PropertyValue",
        "name": "Tvrdosť",
        "value": product.scratchResistance || "Mohs 7+"
      }
    ]
  };

  if (product.keywords && product.keywords.length > 0) {
    schema["keywords"] = product.keywords.join(', ');
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
