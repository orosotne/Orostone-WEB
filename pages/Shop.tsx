import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import { OFFER_VALID_FROM, offerPriceValidUntil, shippingDetailsForStock, RETURN_POLICY_LD } from '../lib/productSchema';
import { calculateSlabPrice } from '../lib/slab';
import { OROSTONE_SELLER_LD } from '../lib/businessSchema';
import { SEOHead } from '../components/UI/SEOHead';
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
  const { hash } = useLocation();

  // Links such as /#vzorka (sample form) followed while already on this page. Arriving with one is ScrollToTop's job
  // (EshopApp), which keeps the target in place while the page settles; scrolling here too made the two compete.
  const arrived = useRef(false);
  useEffect(() => {
    if (!arrived.current) {
      arrived.current = true;
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    if (!id) return;
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <div className="hp w-full overflow-x-clip">
      <SEOHead
        title="Sinterovaný kameň pre kuchyne | Orostone"
        description="Sinterovaný kameň pre kuchyne, ostrovčeky a interiéry. Pomôžeme vybrať dekor, ktorý funguje aj vo veľkej ploche. Showroom Bošany, dodanie po SR."
        canonical="https://orostone.sk/"
        ogType="website"
        maxVideoPreview={0}
      />

            {/* ItemList JSON-LD for product listing rich results */}
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Orostone veľkoformátové platne",
            "numberOfItems": products.length,
            "itemListElement": products.slice(0, 20).map((p, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "item": {
                "@type": "Product",
                "name": p.name,
                "description": p.metaDescription || p.seoDescription || `${p.name} — sinterovaný kameň od Orostone.`,
                "url": `https://orostone.sk/produkt/${p.id}`,
                "image": p.image,
                "brand": { "@type": "Brand", "name": p.vendor || "Orostone" },
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
                  "priceValidUntil": offerPriceValidUntil(),
                  "availability": p.inStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/PreOrder",
                  "itemCondition": "https://schema.org/NewCondition",
                  "seller": OROSTONE_SELLER_LD,
                  "shippingDetails": shippingDetailsForStock(p.inStock),
                  "hasMerchantReturnPolicy": RETURN_POLICY_LD
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
