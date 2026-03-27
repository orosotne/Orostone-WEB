import { useEffect } from 'react';

const SITE_ORIGIN = typeof window !== 'undefined'
  ? window.location.origin
  : ((import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://orostone.sk');

const DEFAULT_OG_PATH = '/images/og-orostone.png';

function toAbsoluteOgImage(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${SITE_ORIGIN}${url}`;
  return url;
}

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
  ogImage = DEFAULT_OG_PATH,
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

    const removeMetaProperty = (name: string) => {
      document.querySelector(`meta[property="${name}"]`)?.remove();
    };

    // Standard meta
    setMeta('description', description);
    if (noindex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (robotsMeta && robotsMeta.content === 'noindex, nofollow') {
        robotsMeta.content = 'index, follow';
      }
    }

    const absoluteOg = toAbsoluteOgImage(ogImage);
    const isDefaultOg =
      ogImage === DEFAULT_OG_PATH
      || absoluteOg?.endsWith(DEFAULT_OG_PATH)
      || absoluteOg?.endsWith('/images/og-orostone.png');

    // Open Graph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    if (absoluteOg) setMeta('og:image', absoluteOg, true);
    setMeta('og:image:alt', title, true);
    if (isDefaultOg) {
      setMeta('og:image:width', '1200', true);
      setMeta('og:image:height', '630', true);
    } else {
      removeMetaProperty('og:image:width');
      removeMetaProperty('og:image:height');
    }
    if (canonical) setMeta('og:url', canonical, true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    if (absoluteOg) setMeta('twitter:image', absoluteOg);

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
});

// ===========================================
// HELPER: Organization structured data
// ===========================================

export const OROSTONE_ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OROSTONE',
  url: 'https://orostone.sk',
  logo: 'https://orostone.sk/images/brand/orostone-circle.png',
  description: 'Prémiový sinterovaný kameň pre kuchyne, kúpeľne a architektonické projekty.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Landererova 8',
    addressLocality: 'Bratislava',
    postalCode: '811 09',
    addressCountry: 'SK',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+421917588738',
    contactType: 'customer service',
    availableLanguage: ['Slovak', 'English'],
    email: 'info@orostone.sk',
  },
  sameAs: ['https://www.instagram.com/orostone.sk/'],
};

export default SEOHead;
