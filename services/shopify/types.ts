// Internal Shopify Storefront API types — not exposed outside this module.
// Consumer-facing types (ShopifyCart, ShopifyCartLine, ShopifyDiscountAllocation) are exported.

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
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

export interface ShopifyProduct {
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

  // Named metafield aliases returned by the GraphQL queries via
  // `fieldName: metafield(namespace: "...", key: "...")` syntax.
  // Typed here so getMetafieldValue() doesn't need an unsafe cast.
  thickness?: ShopifyMetafieldValue;
  dimensions?: ShopifyMetafieldValue;
  finish?: ShopifyMetafieldValue;
  material?: ShopifyMetafieldValue;
  heat_resistance?: ShopifyMetafieldValue;
  weight?: ShopifyMetafieldValue;
  country_of_origin?: ShopifyMetafieldValue;
  color_category?: ShopifyMetafieldValue;
  color_for_cursor?: ShopifyMetafieldValue;
  color_name_for_cursor?: ShopifyMetafieldValue;
  color_name?: ShopifyMetafieldValue;
  color_hex_for_cursor?: ShopifyMetafieldValue;
  shopify_color?: ShopifyMetafieldValue;
  shopify_color_pattern?: ShopifyMetafieldValue;
  custom_color_pattern?: ShopifyMetafieldValue;
}

export type ShopifyProductMetafieldKey =
  | 'thickness' | 'dimensions' | 'finish' | 'material'
  | 'heat_resistance' | 'weight' | 'country_of_origin'
  | 'color_category' | 'color_for_cursor' | 'color_name_for_cursor'
  | 'color_name' | 'color_hex_for_cursor'
  | 'shopify_color' | 'shopify_color_pattern' | 'custom_color_pattern';

interface ShopifyMetafieldValue {
  key: string;
  value: string;
  namespace: string;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: { edges: { node: ShopifyProduct }[] };
}

export interface ShopifyDiscountAllocation {
  discountedAmount: ShopifyPrice;
  /** Present for CartAutomaticDiscountAllocation and CartCustomDiscountAllocation */
  title?: string;
  /** Present for CartCodeDiscountAllocation */
  code?: string;
}

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
    /** Line total BEFORE line-level discounts (amountPerQuantity * quantity) */
    subtotalAmount: ShopifyPrice;
    amountPerQuantity: ShopifyPrice;
  };
  discountAllocations: ShopifyDiscountAllocation[];
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
  discountCodes: Array<{ applicable: boolean; code: string }>;
  discountAllocations: ShopifyDiscountAllocation[];
  lines: {
    edges: { node: ShopifyCartLine }[];
  };
}
