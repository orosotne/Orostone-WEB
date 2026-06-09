// Public API for the shopify service module
export type { ShopifyCart, ShopifyCartLine, ShopifyDiscountAllocation } from './types';
export { fetchProducts, fetchProductsForListing, fetchProductByHandle, fetchCollections } from './products';
export { createCart, getCart, addToCart, removeFromCart, updateCartItem, getProductVariantId, CartNotFoundError } from './cart';
