// ===========================================
// SHOPIFY STOREFRONT API SERVICE
// ===========================================
// Vsetky GraphQL queries a mutations pre Shopify Storefront API
// Produkty, kolekcie, kosik, checkout

import { shopifyFetch } from '../lib/shopify';
import { SAMPLE_VARIANT_KEYWORD } from '../constants';
import type { ShopProduct, ProductCategory } from '../constants';

// ===========================================
// TYPES
// ===========================================

interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
  sku: string | null;
  weight: number | null;
  weightUnit: string | null;
}

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyProductVariant }[] };
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  metafields: { key: string; value: string; namespace: string }[];
}

interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: { edges: { node: ShopifyProduct }[] };
}

// Cart types
export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      handle: string;
      title: string;
      vendor: string;
      images: { edges: { node: ShopifyImage }[] };
    };
    price: ShopifyPrice;
    image: ShopifyImage | null;
    selectedOptions: { name: string; value: string }[];
  };
  cost: {
    totalAmount: ShopifyPrice;
    amountPerQuantity: ShopifyPrice;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
    totalTaxAmount: ShopifyPrice | null;
  };
  lines: {
    edges: { node: ShopifyCartLine }[];
  };
}

// ===========================================
// GRAPHQL FRAGMENTS
// ===========================================

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
          sku
          weight
          weightUnit
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    thickness: metafield(namespace: "custom", key: "thickness") {
      key
      value
      namespace
    }
    dimensions: metafield(namespace: "custom", key: "dimensions") {
      key
      value
      namespace
    }
    finish: metafield(namespace: "custom", key: "finish") {
      key
      value
      namespace
    }
    material: metafield(namespace: "custom", key: "material") {
      key
      value
      namespace
    }
    heat_resistance: metafield(namespace: "custom", key: "heat_resistance") {
      key
      value
      namespace
    }
    weight: metafield(namespace: "custom", key: "weight") {
      key
      value
      namespace
    }
    country_of_origin: metafield(namespace: "custom", key: "country_of_origin") {
      key
      value
      namespace
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                id
                handle
                title
                vendor
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
                width
                height
              }
              selectedOptions {
                name
                value
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            amountPerQuantity {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

// ===========================================
// PRODUCT QUERIES
// ===========================================

export async function fetchProducts(first: number = 50): Promise<ShopProduct[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query Products($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>({ query, variables: { first } });

  return data.products.edges.map(({ node }) => shopifyProductToShopProduct(node));
}

// ===========================================
// IN-MEMORY CACHE for product-by-handle
// ===========================================
// Avoids redundant API calls when revisiting a product
// (e.g. Product A -> B -> A within the TTL window).
const productByHandleCache = new Map<string, { data: ShopProduct; timestamp: number }>();
const PRODUCT_CACHE_TTL = 60_000; // 60 seconds

export async function fetchProductByHandle(handle: string): Promise<ShopProduct | null> {
  // Return cached result if still fresh
  const cached = productByHandleCache.get(handle);
  if (cached && Date.now() - cached.timestamp < PRODUCT_CACHE_TTL) {
    return cached.data;
  }

  const query = `
    ${PRODUCT_FRAGMENT}
    query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        ...ProductFields
      }
    }
  `;

  const data = await shopifyFetch<{
    productByHandle: ShopifyProduct | null;
  }>({ query, variables: { handle } });

  if (!data.productByHandle) return null;

  const result = shopifyProductToShopProduct(data.productByHandle);

  // Store in cache
  productByHandleCache.set(handle, { data: result, timestamp: Date.now() });

  return result;
}

export async function fetchCollections(first: number = 20): Promise<ShopifyCollection[]> {
  const query = `
    query Collections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collections: { edges: { node: ShopifyCollection }[] };
  }>({ query, variables: { first } });

  return data.collections.edges.map(({ node }) => node);
}

// ===========================================
// CART MUTATIONS
// ===========================================

export async function createCart(): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartCreate {
      cartCreate {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>({ query });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors.map(e => e.message).join(', '));
  }

  return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFields
      }
    }
  `;

  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query,
    variables: { cartId },
  });

  return data.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>({
    query,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors.map(e => e.message).join(', '));
  }

  return data.cartLinesAdd.cart;
}

export async function removeFromCart(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>({
    query,
    variables: { cartId, lineIds: [lineId] },
  });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors.map(e => e.message).join(', '));
  }

  return data.cartLinesRemove.cart;
}

export async function updateCartItem(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>({
    query,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors.map(e => e.message).join(', '));
  }

  return data.cartLinesUpdate.cart;
}

// ===========================================
// ADAPTER: Shopify Product -> ShopProduct
// ===========================================
// Konvertuje Shopify data na existujuci ShopProduct type
// tak aby UI komponenty nemuseli byt prepisane

function getMetafieldValue(product: ShopifyProduct, key: string): string | undefined {
  // Metafields are returned as individual fields in the query
  const metafield = (product as unknown as Record<string, { value: string } | null>)[key];
  return metafield?.value || undefined;
}

// ===========================================
// PARSER: Extract tech specs from descriptionHtml
// ===========================================
// Shopify descriptions contain embedded "Technické parametre" sections.
// This parser extracts structured data and returns clean marketing HTML.

interface ParsedDescriptionSpecs {
  dimensions?: string;   // e.g. "3200 x 1600 mm"
  thickness?: string;    // e.g. "12mm"
  finish?: string;       // e.g. "Matný" or "Leštený"
  weight?: number;       // e.g. 148
  sku?: string;          // e.g. "MN787AY321612"
  countryOfOrigin?: string; // e.g. "Made in China"
}

interface ParsedDescription {
  marketingHtml: string;
  specs: ParsedDescriptionSpecs;
}

function parseShopifyDescription(descriptionHtml: string): ParsedDescription {
  const specs: ParsedDescriptionSpecs = {};
  let marketingHtml = descriptionHtml;

  if (!descriptionHtml) {
    return { marketingHtml: '', specs };
  }

  // Find the "Technické parametre" heading in various formats:
  //   <h3>Technické parametre:</h3>
  //   <p><strong>Technické parametre:</strong></p>
  const headingPattern = /<(?:h[2-6]|p)>\s*(?:<(?:strong|b)>\s*)?Technick[eéẽ]\s+parametre:?\s*(?:<\/(?:strong|b)>\s*)?<\/(?:h[2-6]|p)>/i;
  const headingMatch = marketingHtml.match(headingPattern);

  if (headingMatch && headingMatch.index !== undefined) {
    const headingStart = headingMatch.index;
    const headingEnd = headingStart + headingMatch[0].length;

    // Find the <ul> that follows the heading (allow whitespace/newlines between)
    const afterHeading = marketingHtml.substring(headingEnd);
    const ulMatch = afterHeading.match(/^\s*<ul>([\s\S]*?)<\/ul>/i);

    if (ulMatch && ulMatch.index !== undefined) {
      // Extract each <li> item
      const liRegex = /<li>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(ulMatch[1])) !== null) {
        // Strip inline HTML tags to get clean text
        const liText = liMatch[1]
          .replace(/<\/?(?:strong|b|em|i|span)[^>]*>/gi, '')
          .replace(/\n/g, ' ')
          .trim();

        // Parse "Label: Value" pairs
        const colonIdx = liText.indexOf(':');
        if (colonIdx <= 0) continue;

        const label = liText.substring(0, colonIdx).trim().toLowerCase();
        const value = liText.substring(colonIdx + 1).trim();
        if (!value) continue;

        // Map labels to spec fields
        if (/rozmer/.test(label)) {
          // Handle "1600 × 3200 × 12 mm" (3 dimensions = width × length × thickness)
          const threeDims = value.match(/(\d+)\s*[×x]\s*(\d+)\s*[×x]\s*(\d+)\s*mm/i);
          if (threeDims) {
            const nums = [parseInt(threeDims[1]), parseInt(threeDims[2]), parseInt(threeDims[3])];
            nums.sort((a, b) => b - a); // largest first
            specs.dimensions = `${nums[0]} x ${nums[1]} mm`;
            specs.thickness = `${nums[2]}mm`;
          } else {
            // Handle "3200 mm × 1600 mm" or "3200 x 1600 mm"
            const twoDims = value.match(/(\d+)\s*(?:mm)?\s*[×x]\s*(\d+)\s*(?:mm)?/i);
            if (twoDims) {
              const a = parseInt(twoDims[1]);
              const b = parseInt(twoDims[2]);
              const larger = Math.max(a, b);
              const smaller = Math.min(a, b);
              specs.dimensions = `${larger} x ${smaller} mm`;
            } else {
              specs.dimensions = value;
            }
          }
        } else if (/hr[uú]bka/.test(label)) {
          specs.thickness = value.replace(/\s+/g, '').replace(/(\d+)mm/i, '$1mm');
          // Normalize: ensure "12 mm" becomes "12mm"
          const thickMatch = value.match(/(\d+)\s*mm/i);
          if (thickMatch) {
            specs.thickness = `${thickMatch[1]}mm`;
          }
        } else if (/povrch/.test(label)) {
          specs.finish = value;
        } else if (/hmotnos/.test(label)) {
          const weightMatch = value.match(/(\d+(?:[.,]\d+)?)/);
          if (weightMatch) {
            specs.weight = parseFloat(weightMatch[1].replace(',', '.'));
          }
        } else if (/k[oó]d/.test(label) || /sku/i.test(label)) {
          specs.sku = value;
        } else if (/p[oôu]vod/.test(label) || /krajina/.test(label) || /origin/i.test(label)) {
          specs.countryOfOrigin = value;
        }
        // "Plocha" and other unknown labels are silently ignored
      }

      // Remove the tech specs section from the HTML to produce clean marketing copy
      const fullTechSection = marketingHtml.substring(headingStart, headingEnd + ulMatch.index + ulMatch[0].length);
      marketingHtml = marketingHtml.replace(fullTechSection, '');
      
      // Clean up: remove double newlines, leading/trailing whitespace
      marketingHtml = marketingHtml.replace(/\n{3,}/g, '\n\n').trim();
    }
  }

  // Post-process: highlight key selling phrases with <strong> tags (renders as gold bold)
  // Longer phrases first to avoid partial matches
  const highlightPhrases = [
    // Najdlhsie frazy (priority - vsetky odstavce pokryte)
    'výnimočný dizajn s luxusným zlatým akcentom a haute couture eleganciou',
    'teplý, prirodzený dizajn s charakterom historického kameňa',
    'čistý, minimalistický dizajn s ľadovou eleganciou',
    'klasický Calacatta dizajn s výrazným žilkovaním',
    'ikonický mramorový dizajn so zlatými akcentmi',
    'výnimočný dizajn s teplými tónmi a luxusným charakterom',
    'prirodzený vzhľad, odolnosť a nadčasový dizajn',
    'sofistikovanú eleganciu s teplým charakterom',
    'dramatickú eleganciu a sofistikovaný charakter',
    'dramatickú eleganciu a luxusný charakter',
    'nadčasovú eleganciu a luxusný vzhľad',
    'čistotu, svetlosť a nadčasovú eleganciu',
    'harmonický a sofistikovaný priestor',
    'teplými béžovými tónmi a prirodzenou textúrou',
    'medeno-hnedé tóny s kovovým efektom',
    'zlato-šedými žilami na krémovom podklade',
    'čistotu bielej farby s bohatými zlatými žilami',
    'jemné krémové tóny s bohatými zlatými žilami',
    'bohatými šedými a zlatými žilami',
    'čistý, minimalistický a sofistikovaný dizajn',
    'historickú krásu antických stavieb',
    'snežobielu farbu s jemnými šedými odtieňmi',
    'luxusnú krásu exotického kameňa',
    'autentický, surovo-luxusný vzhľad',
    'jedinečný statement piece s módnym šarmom',
    'statement piece s nadčasovým šarmom',
    // Strednedlhe frazy
    'luxus talianskeho mramoru Calacatta',
    'slavným talianskym mramorom Calacatta',
    'najkrajších odrôd prírodného kameňa',
    'prírodného mramoru bez jeho nevýhod',
    'výrazným mramorovým dizajnom',
    'výrazným zlatým žilkovaním',
    'luxusným zlatým žilkovaním',
    'klasickým rímskym travertínom',
    'industriálnym charakterom',
    'haute couture eleganciu',
    'čistou, ľadovou eleganciou',
    'krásu arktických ľadovcov',
    'sviežu, modernú atmosféru',
    'teplú, zemitú eleganciu',
    'luxusný a dramatický dizajn',
    'sofistikovaný a luxusný dizajn',
    'prirodzenú patinu kovu',
    'výraznými zlatými žilami',
    'jedinečnosť a charakter',
    'funkčnosť s estetikou',
    'nadčasovú sofistikovanosť',
    // Kratke frazy
    'výnimočný statement piece',
    'výrazný statement piece',
    'odvážny dizajn',
    'jedinečný a výnimočný dizajn',
    'jedinečný a výrazný dizajn',
    'dokonalou voľbou',
    'perfektným riešením',
  ];

  for (const phrase of highlightPhrases) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    marketingHtml = marketingHtml.replace(regex, (match, _p1, offset) => {
      // Don't wrap if already inside a <strong> tag
      const before = marketingHtml.substring(0, offset);
      const lastOpenStrong = before.lastIndexOf('<strong');
      const lastCloseStrong = before.lastIndexOf('</strong>');
      if (lastOpenStrong > lastCloseStrong) return match; // inside <strong>, skip
      return `<strong>${match}</strong>`;
    });
  }

  return { marketingHtml, specs };
}

// ===========================================
// DESIGN INSIGHTS: Researched content per product
// ===========================================
// Unique style/design guidance for each sintered stone product.
// Keyed by Shopify product handle. Content is HTML (Slovak).
// See .cursor/rules/design-insight-workflow.md for the process.

const PRODUCT_DESIGN_INSIGHTS: Record<string, string> = {
  'yabo-white': `<p>Teplý béžovo-krémový odtieň s jemným žilkovaním ideálne dopĺňa interiéry v štýle Japandi, Scandinavian či Mediterranean. Matný povrch vnáša do priestoru organický pokoj a eleganciu.</p><p>Vyniká ako kuchynský ostrov, obklad za varnou doskou či kúpeľňová doska — všade, kde chcete prirodzený luxus bez chladného dojmu klasického mramoru.</p>`,
  'bianco-statuario': `<p>Čistá biela so subtílnym šedým žilkovaním evokuje taliansky Carrara mramor a ladí s Contemporary, Minimalist aj Mediterranean štýlom. Leštený povrch dodáva priestoru zrkadlovú hĺbku.</p><p>Veľkoformátová platňa umožňuje bezšvové kuchynské ostrovy a súvislé kúpeľňové obklady — luxus mramoru s konzistentnou kresbou a bezúdržbovou odolnosťou.</p>`,
};

// Mapovanie Shopify productType na nase kategorie
function mapProductTypeToCategory(productType: string): ProductCategory {
  const typeMap: Record<string, ProductCategory> = {
    'sintered-stone': 'sintered-stone',
    'sintered stone': 'sintered-stone',
    'sinterovaný kameň': 'sintered-stone',
    'tables': 'tables',
    'stoly': 'tables',
    'invisible-cooktop': 'invisible-cooktop',
    'invisible cooktop': 'invisible-cooktop',
    'accessories': 'accessories',
    'doplnky': 'accessories',
  };
  return typeMap[productType.toLowerCase()] || 'sintered-stone';
}

function shopifyProductToShopProduct(product: ShopifyProduct): ShopProduct {
  // Separate sample variant from regular variants
  const sampleKeyword = SAMPLE_VARIANT_KEYWORD.toLowerCase();
  const allVariants = product.variants.edges.map(({ node }) => node);
  const firstVariant = allVariants.find(v => !v.title.toLowerCase().includes(sampleKeyword)) || allVariants[0];
  const sampleVariant = allVariants.find(v => v.title.toLowerCase().includes(sampleKeyword));
  const images = product.images.edges.map(({ node }) => node.url);

  // Parse technical specs from descriptionHtml
  const { marketingHtml, specs: parsedSpecs } = parseShopifyDescription(product.descriptionHtml || '');

  // Dimensions: metafield > parsed from description > default
  const dims = getMetafieldValue(product, 'dimensions')
    || parsedSpecs.dimensions
    || '3200 x 1600 mm';

  // Shopify variant price = cena za celú platňu (nie za m²)
  // Prepočítame na cenu za m² vydelením plochou platne
  const slabPrice = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const dimMatch = dims.match(/(\d+)\s*[×x]\s*(\d+)/i);
  const slabArea = dimMatch
    ? (parseInt(dimMatch[1]) / 1000) * (parseInt(dimMatch[2]) / 1000)
    : 5.12; // Default 3200x1600 = 5.12 m²
  const pricePerM2 = slabArea > 0 ? Math.round((slabPrice / slabArea) * 100) / 100 : slabPrice;

  // Weight: metafield > variant built-in > parsed from description
  const metafieldWeight = getMetafieldValue(product, 'weight');
  let resolvedWeight: number | undefined;
  if (metafieldWeight) {
    resolvedWeight = parseFloat(metafieldWeight);
  } else if (firstVariant?.weight) {
    resolvedWeight = firstVariant.weight;
  } else if (parsedSpecs.weight) {
    resolvedWeight = parsedSpecs.weight;
  }

  // SKU: variant built-in > parsed from description
  const resolvedSku = firstVariant?.sku || parsedSpecs.sku || undefined;

  return {
    id: product.handle,
    name: product.title,
    description: product.description,
    // Use cleaned marketing HTML (tech specs stripped out) to avoid duplication with TechnicalOverview
    descriptionHtml: marketingHtml || undefined,
    pricePerM2,
    image: images[0] || '',
    gallery: images,
    category: mapProductTypeToCategory(product.productType),
    dimensions: dims,
    thickness: getMetafieldValue(product, 'thickness') || parsedSpecs.thickness || '12mm',
    finish: getMetafieldValue(product, 'finish') || parsedSpecs.finish || 'Leštený',
    material: getMetafieldValue(product, 'material') || 'Sinterovaný kameň',
    inStock: product.availableForSale,
    stockQuantity: 0,
    vendor: product.vendor,
    heatResistance: getMetafieldValue(product, 'heat_resistance') || 'Do 300°C',
    weight: resolvedWeight,
    countryOfOrigin: getMetafieldValue(product, 'country_of_origin') || parsedSpecs.countryOfOrigin,
    sku: resolvedSku,
    // Researched design insight (from PRODUCT_DESIGN_INSIGHTS map)
    designInsight: PRODUCT_DESIGN_INSIGHTS[product.handle] || undefined,
    // Shopify variant ID pre pridanie do kosika
    shopifyVariantId: firstVariant?.id || '',
    // Shopify variant ID pre vzorku (deposit)
    sampleShopifyVariantId: sampleVariant?.id || undefined,
    // Dalsie fieldy so default hodnotami
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý',
    uvResistance: true,
    porosity: '< 0.1%',
    edgeStyle: 'Rovná hrana',
    applications: ['Kuchynské dosky', 'Ostrovčeky', 'Kúpeľne', 'Obklad stien', 'Komerčné interiéry', 'Fasády', 'Podlahy', 'Nábytok'],
    deliveryTimeframe: '5 pracovných dní',
  };
}

// ===========================================
// HELPER: Get first variant ID
// ===========================================

export async function getProductVariantId(handle: string): Promise<string | null> {
  const query = `
    query ProductVariant($handle: String!) {
      productByHandle(handle: $handle) {
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    productByHandle: { variants: { edges: { node: { id: string } }[] } } | null;
  }>({ query, variables: { handle } });

  return data.productByHandle?.variants.edges[0]?.node.id || null;
}
