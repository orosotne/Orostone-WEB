import React from 'react';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { OFFER_VALID_FROM } from '../lib/productSchema';
import { calculateSlabPrice } from '../lib/slab';
import { SEOHead, OROSTONE_ORGANIZATION_LD } from '../components/UI/SEOHead';
import { HomeHero } from '../components/Home/HomeHero';
import { HomeFacts } from '../components/Home/HomeFacts';
import { HomeDecors } from '../components/Home/HomeDecors';
import { HomeMaterial } from '../components/Home/HomeMaterial';
import { HomeRealizations } from '../components/Home/HomeRealizations';
import { HomeProcess } from '../components/Home/HomeProcess';
import { HomeShowroom } from '../components/Home/HomeShowroom';
import { HomeGuides } from '../components/Home/HomeGuides';
import { HomeInstagram } from '../components/Home/HomeInstagram';
import { HomeGoldBand } from '../components/Home/HomeGoldBand';
import '../components/Home/home.css';

// ===========================================
// HOMEPAGE (new design, 2026-10)
// ===========================================
// Sections in order: hero → facts → decors (+ whole slab) → material → realizations →
// process (+ personal advice) → showroom (+ reviews) → guides → Instagram → gold band.
// The SEO head and the ItemList JSON-LD are unchanged from the previous homepage.

export const Shop = () => {
  const { products } = useShopifyProducts();

  return (
    <div className="hp w-full overflow-x-clip">
      <SEOHead
        title="Sinterovaný kameň pre kuchyne | OROSTONE"
        description="Sinterovaný kameň pre kuchyne, ostrovčeky a interiéry. Pomôžeme vybrať dekor, ktorý funguje aj vo veľkej ploche. Showroom Bošany, dodanie po SR."
        canonical="https://orostone.sk/"
        ogType="website"
        structuredData={OROSTONE_ORGANIZATION_LD}
        maxVideoPreview={0}
      />

            {/* ItemList JSON-LD for product listing rich results */}
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "OROSTONE veľkoformátové platne",
            "numberOfItems": products.length,
            "itemListElement": products.slice(0, 20).map((p, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "item": {
                "@type": "Product",
                "name": p.name,
                "description": p.metaDescription || p.seoDescription || `${p.name} — sinterovaný kameň od OROSTONE.`,
                "url": `https://orostone.sk/produkt/${p.id}`,
                "image": p.image,
                "brand": { "@type": "Brand", "name": p.vendor || "OROSTONE" },
                "sku": p.sku || p.id,
                "offers": {
                  "@type": "Offer",
                  "url": `https://orostone.sk/produkt/${p.id}`,
                  "priceCurrency": "EUR",
                  "price": calculateSlabPrice(p.pricePerM2, p.dimensions).toFixed(2),
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": p.pricePerM2.toFixed(2),
                    "priceCurrency": "EUR",
                    "referenceQuantity": { "@type": "QuantitativeValue", "value": 1, "unitCode": "MTK" }
                  },
                  "validFrom": OFFER_VALID_FROM,
                  "availability": p.inStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/PreOrder",
                  "itemCondition": "https://schema.org/NewCondition",
                  "seller": { "@type": "Organization", "name": "OROSTONE s.r.o." },
                  "shippingDetails": {
                    "@type": "OfferShippingDetails",
                    "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "SK" },
                    "shippingRate": { "@type": "MonetaryAmount", "value": "150", "currency": "EUR" },
                    "deliveryTime": {
                      "@type": "ShippingDeliveryTime",
                      "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "d" },
                      "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "d" }
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
              },
            })),
          }) }}
        />
      )}

      <HomeHero />
      <HomeFacts />
      <HomeDecors />
      <HomeMaterial />
      <HomeRealizations />
      <HomeProcess />
      <HomeShowroom />
      <HomeGuides />
      <HomeInstagram />
      <HomeGoldBand />
    </div>
  );
};
