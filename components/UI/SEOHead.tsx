import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  noindex?: boolean;
  /** JSON-LD structured data */
  structuredData?: Record<string, unknown>;
}

/**
 * SEO komponent — nastaví <title>, meta tagy, Open Graph a JSON-LD.
 * Keďže nemáme SSR, robíme to cez DOM manipuláciu v useEffect.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  ogImage = '/images/logo.png',
  ogType = 'website',
  noindex = false,
  structuredData,
}) => {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper pre meta tagy
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // Standard meta
    setMeta('description', description);
    if (noindex) {
      setMeta('robots', 'noindex, nofollow');
    }

    // Open Graph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    if (ogImage) setMeta('og:image', ogImage, true);
    if (canonical) setMeta('og:url', canonical, true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    if (ogImage) setMeta('twitter:image', ogImage);

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = canonical;
    }

    // JSON-LD Structured Data
    let scriptLD = document.querySelector('script[data-seo-ld]') as HTMLScriptElement | null;
    if (structuredData) {
      if (!scriptLD) {
        scriptLD = document.createElement('script');
        scriptLD.type = 'application/ld+json';
        scriptLD.setAttribute('data-seo-ld', 'true');
        document.head.appendChild(scriptLD);
      }
      scriptLD.textContent = JSON.stringify(structuredData);
    } else if (scriptLD) {
      scriptLD.remove();
    }

    // Cleanup pri unmounte
    return () => {
      const scriptEl = document.querySelector('script[data-seo-ld]');
      if (scriptEl) scriptEl.remove();
    };
  }, [title, description, canonical, ogImage, ogType, noindex, structuredData]);

  return null;
};

// ===========================================
// HELPER: Breadcrumb structured data
// ===========================================

export const createBreadcrumbLD = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// ===========================================
// HELPER: Product structured data
// ===========================================

export const createProductLD = (product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  sku?: string;
  inStock?: boolean;
  url?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  sku: product.sku,
  brand: {
    '@type': 'Brand',
    name: 'OROSTONE',
  },
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: product.currency || 'EUR',
    availability: product.inStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    url: product.url,
    seller: {
      '@type': 'Organization',
      name: 'OROSTONE',
    },
  },
});

// ===========================================
// HELPER: Organization structured data
// ===========================================

export const OROSTONE_ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OROSTONE',
  url: 'https://www.orostone.sk',
  logo: 'https://www.orostone.sk/images/logo.png',
  description: 'Prémiový sinterovaný kameň pre kuchyne, kúpeľne a architektonické projekty.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SK',
  },
};

export default SEOHead;
