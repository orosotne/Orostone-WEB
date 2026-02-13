// ===========================================
// SHOPIFY STOREFRONT API SERVICE
// ===========================================
// Vsetky GraphQL queries a mutations pre Shopify Storefront API
// Produkty, kolekcie, kosik, checkout

import { shopifyFetch } from '../lib/shopify';
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

export async function fetchProductByHandle(handle: string): Promise<ShopProduct | null> {
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
  return shopifyProductToShopProduct(data.productByHandle);
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
  const firstVariant = product.variants.edges[0]?.node;
  const images = product.images.edges.map(({ node }) => node.url);

  // Shopify variant price = cena za celú platňu (nie za m²)
  // Prepočítame na cenu za m² vydelením plochou platne
  const slabPrice = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const dims = getMetafieldValue(product, 'dimensions') || '3200 x 1600 mm';
  const dimMatch = dims.match(/(\d+)\s*x\s*(\d+)/i);
  const slabArea = dimMatch
    ? (parseInt(dimMatch[1]) / 1000) * (parseInt(dimMatch[2]) / 1000)
    : 5.12; // Default 3200x1600 = 5.12 m²
  const pricePerM2 = slabArea > 0 ? Math.round((slabPrice / slabArea) * 100) / 100 : slabPrice;

  return {
    id: product.handle,
    name: product.title,
    description: product.description,
    pricePerM2,
    image: images[0] || '',
    gallery: images,
    category: mapProductTypeToCategory(product.productType),
    dimensions: dims,
    thickness: getMetafieldValue(product, 'thickness') || '12mm',
    finish: getMetafieldValue(product, 'finish') || 'Leštený',
    material: getMetafieldValue(product, 'material') || 'Sinterovaný kameň',
    inStock: product.availableForSale,
    stockQuantity: 0,
    vendor: product.vendor,
    heatResistance: getMetafieldValue(product, 'heat_resistance') || 'Do 300°C',
    weight: getMetafieldValue(product, 'weight') ? parseFloat(getMetafieldValue(product, 'weight')!) : undefined,
    countryOfOrigin: getMetafieldValue(product, 'country_of_origin'),
    // Shopify variant ID pre pridanie do kosika
    shopifyVariantId: firstVariant?.id || '',
    // Dalsie fieldy so default hodnotami
    scratchResistance: 'Mohs 7+',
    stainResistance: 'Nenasiakavý',
    uvResistance: true,
    porosity: '< 0.1%',
    edgeStyle: 'Rovná hrana',
    applications: ['Kuchynské dosky', 'Kúpeľne', 'Obklad stien'],
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
