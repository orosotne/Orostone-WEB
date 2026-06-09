// GraphQL fragment strings for Shopify Storefront API queries/mutations

// Lightweight fragment for product grid listing (fewer images, variants, metafields)
export const PRODUCT_LIST_FRAGMENT = `
  fragment ProductListFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
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
    variants(first: 3) {
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
    color_category: metafield(namespace: "custom", key: "color_category") {
      key
      value
      namespace
    }
    color_hex_for_cursor: metafield(namespace: "custom", key: "color_hex_for_cursor") {
      key
      value
      namespace
    }
    color_name_for_cursor: metafield(namespace: "custom", key: "color_name_for_cursor") {
      key
      value
      namespace
    }
    color_name: metafield(namespace: "custom", key: "color_name") {
      key
      value
      namespace
    }
    color_for_cursor: metafield(namespace: "custom", key: "color_for_cursor") {
      key
      value
      namespace
    }
    shopify_color: metafield(namespace: "shopify", key: "color") {
      key
      value
      namespace
    }
    shopify_color_pattern: metafield(namespace: "shopify", key: "color-pattern") {
      key
      value
      namespace
    }
    custom_color_pattern: metafield(namespace: "custom", key: "color-pattern") {
      key
      value
      namespace
    }
  }
`;

// Full fragment for product detail (all images, variants, metafields)
export const PRODUCT_FRAGMENT = `
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
    color_category: metafield(namespace: "custom", key: "color_category") {
      key
      value
      namespace
    }
    color_for_cursor: metafield(namespace: "custom", key: "color_for_cursor") {
      key
      value
      namespace
    }
    color_name_for_cursor: metafield(namespace: "custom", key: "color_name_for_cursor") {
      key
      value
      namespace
    }
    color_name: metafield(namespace: "custom", key: "color_name") {
      key
      value
      namespace
    }
    color_hex_for_cursor: metafield(namespace: "custom", key: "color_hex_for_cursor") {
      key
      value
      namespace
    }
    shopify_color: metafield(namespace: "shopify", key: "color") {
      key
      value
      namespace
    }
    shopify_color_pattern: metafield(namespace: "shopify", key: "color-pattern") {
      key
      value
      namespace
    }
    custom_color_pattern: metafield(namespace: "custom", key: "color-pattern") {
      key
      value
      namespace
    }
  }
`;

export const CART_FRAGMENT = `
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
    discountCodes {
      applicable
      code
    }
    discountAllocations {
      discountedAmount {
        amount
        currencyCode
      }
      ... on CartAutomaticDiscountAllocation {
        title
      }
      ... on CartCodeDiscountAllocation {
        code
      }
      ... on CartCustomDiscountAllocation {
        title
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
            subtotalAmount {
              amount
              currencyCode
            }
            amountPerQuantity {
              amount
              currencyCode
            }
          }
          discountAllocations {
            discountedAmount {
              amount
              currencyCode
            }
            ... on CartAutomaticDiscountAllocation {
              title
            }
            ... on CartCodeDiscountAllocation {
              code
            }
            ... on CartCustomDiscountAllocation {
              title
            }
          }
        }
      }
    }
  }
`;
