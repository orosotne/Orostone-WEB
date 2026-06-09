import { shopifyFetch } from '../../lib/shopify';
import type { ShopifyCart } from './types';
import { CART_FRAGMENT } from './fragments';

/**
 * Thrown by cart mutations when the targeted cart id no longer exists
 * (expired or already completed) — Shopify returns a null cart. This is the
 * ONLY failure the cart UI should recover from by creating a fresh cart;
 * transient/network errors and line-level userErrors (e.g. a sold-out variant)
 * must NOT discard the customer's existing cart.
 */
export class CartNotFoundError extends Error {
  constructor(message = 'Shopify cart not found or expired') {
    super(message);
    this.name = 'CartNotFoundError';
  }
}

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

  // A null cart means the cart id is no longer valid (expired/completed). Surface
  // it as a distinct, recoverable error BEFORE userErrors so an expired cart is
  // never mistaken for a line-level problem (and a line-level problem never
  // triggers a cart-recreate).
  if (!data.cartLinesAdd.cart) {
    throw new CartNotFoundError();
  }

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
