import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, ReactNode } from 'react';
import { isShopifyConfigured } from '../lib/shopify';
import { SAMPLE_VARIANT_KEYWORD } from '../constants';
import {
  createCart as shopifyCreateCart,
  getCart as shopifyGetCart,
  addToCart as shopifyAddToCart,
  removeFromCart as shopifyRemoveFromCart,
  updateCartItem as shopifyUpdateCartItem,
  type ShopifyCart,
  type ShopifyCartLine,
} from '../services/shopify.service';
import { trackMetaEvent } from '../hooks/useMetaPixel';
import { trackGA4AddToCart } from '../services/analytics';
import { getUTMForCheckout } from '../hooks/useUTMTracking';
import { onIdle, withRetry } from '../lib/utils';

// ===========================================
// TYPES
// ===========================================

export interface CartItem {
  id: string;            // Shopify line item ID
  variantId: string;     // Shopify variant GID
  productId: string;     // Product handle
  name: string;
  image: string;
  price: number;         // jednotková cena PO line-level zľave
  originalPrice: number; // jednotková cena PRED zľavou
  lineDiscount: number;  // celková line-level zľava v EUR pre túto položku
  quantity: number;
  variant: string;       // variant title (napr. "12mm / 3200x1600")
}

interface CartContextType {
  // State
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  checkoutUrl: string | null;
  
  // Actions
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearError: () => void;
  
  // Computed
  itemCount: number;
  subtotal: number;
  total: number;
  /** Celková aplikovaná zľava (kladné číslo, EUR). 0 ak žiadna. */
  totalDiscount: number;
  /** Medzisúčet pred aplikáciou zliav (sum amountPerQuantity * quantity). */
  subtotalBeforeDiscount: number;
  /** Tituly aplikovaných zliav (napr. ["Bundle 2+ platne −20%"]). */
  appliedDiscountTitles: string[];
  isInCart: (productHandle: string) => boolean;
  getItemQuantity: (productHandle: string) => number;
  
  // Sample (vzorka) helpers
  sampleCount: number;
  isSampleInCart: (productHandle: string) => boolean;
  productItems: CartItem[];
  sampleItems: CartItem[];
}

// ===========================================
// CONSTANTS
// ===========================================

const CART_ID_KEY = 'orostone_shopify_cart_id';
const CART_OP_TIMEOUT_MS = 15000;
const SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL ?? 'https://orostone.sk';

function withTimeout<T>(promise: Promise<T>, ms: number = CART_OP_TIMEOUT_MS): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Požiadavka vypršala. Skúste to znova.')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

function withCartTimeout<T>(fn: () => Promise<T>): Promise<T> {
  return withRetry(() => withTimeout(fn()));
}

// ===========================================
// SPLIT CONTEXTS
// Three contexts to enable selective subscriptions:
//   - CartUIContext: isOpen + open/close/toggle (stable, cheap to subscribe)
//   - CartActionsContext: addItem, removeItem, etc. (stable refs via cartRef/useCallback)
//   - CartStateContext: items, totals, discounts (re-renders on every API op)
// useCart() merges all three for backward compat.
// ===========================================

type CartState = Omit<CartContextType,
  | 'addItem' | 'removeItem' | 'updateQuantity' | 'clearCart' | 'clearError'
  | 'isInCart' | 'getItemQuantity' | 'isSampleInCart'
  | 'isOpen' | 'openCart' | 'closeCart' | 'toggleCart'
>;
type CartActions = Pick<CartContextType,
  | 'addItem' | 'removeItem' | 'updateQuantity' | 'clearCart' | 'clearError'
  | 'isInCart' | 'getItemQuantity' | 'isSampleInCart'
>;
type CartUI = Pick<CartContextType, 'isOpen' | 'openCart' | 'closeCart' | 'toggleCart'>;

const CartStateContext = createContext<CartState | undefined>(undefined);
const CartActionsContext = createContext<CartActions | undefined>(undefined);
const CartUIContext = createContext<CartUI | undefined>(undefined);

// Legacy merged context (kept for backward compat)
const CartContext = createContext<CartContextType | undefined>(undefined);

// ===========================================
// HELPERS
// ===========================================

const PLACEHOLDER_IMAGE = '/images/logo.png';

function mapShopifyCartLines(cart: ShopifyCart): CartItem[] {
  return cart.lines.edges
    .filter(({ node: line }) => line.merchandise?.product != null)
    .map(({ node: line }) => {
      // Storefront API: CartLineCost.subtotalAmount = line total PRED line-level
      // discountami, CartLineCost.totalAmount = PO nich. Rozdiel = line discount.
      const lineSubtotalBefore = parseFloat(line.cost?.subtotalAmount?.amount ?? '0');
      const lineTotalAfter = parseFloat(line.cost?.totalAmount?.amount ?? '0');
      const lineDiscount = Math.max(0, lineSubtotalBefore - lineTotalAfter);
      const qty = line.quantity || 1;
      const originalPrice = lineSubtotalBefore / qty;
      const effectivePrice = lineTotalAfter / qty;

      return {
        id: line.id,
        variantId: line.merchandise.id,
        productId: line.merchandise.product?.handle ?? '',
        name: line.merchandise.product?.title ?? '',
        image: line.merchandise.image?.url || line.merchandise.product?.images?.edges?.[0]?.node?.url || PLACEHOLDER_IMAGE,
        price: effectivePrice,
        originalPrice,
        lineDiscount,
        quantity: line.quantity,
        variant: (line.merchandise.title ?? '') !== 'Default Title' ? (line.merchandise.title ?? '') : '',
      };
    });
}

// ===========================================
// PROVIDER
// ===========================================

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref to latest cart so action callbacks can have stable identity (empty deps)
  // — without this, every cart state change recreates addItem/removeItem/updateQuantity
  // and forces all useCart() consumers to re-render even when they only need actions.
  const cartRef = useRef<ShopifyCart | null>(null);
  useEffect(() => { cartRef.current = cart; }, [cart]);

  // ------------------------------------------
  // Inicializacia kosika
  // ------------------------------------------
  useEffect(() => {
    if (!isShopifyConfigured()) return;

    const initCart = async () => {
      setIsLoading(true);
      try {
        // Skus nacitat existujuci cart z localStorage
        const savedCartId = localStorage.getItem(CART_ID_KEY);

        if (savedCartId) {
          try {
            const existingCart = await shopifyGetCart(savedCartId);
            // Cart exists and is valid — check if it hasn't been completed (checkout finished)
            if (existingCart && existingCart.lines) {
              setCart(existingCart);
              cartRef.current = existingCart;
              return;
            }
          } catch {
            // Cart expired or invalid — remove stale ID and create new
            localStorage.removeItem(CART_ID_KEY);
          }
        }

        // Ak neexistuje alebo expiroval, vytvor novy
        const newCart = await shopifyCreateCart();
        setCart(newCart);
        cartRef.current = newCart;
        localStorage.setItem(CART_ID_KEY, newCart.id);
      } catch (error) {
        console.error('Chyba pri inicializacii kosika:', error);
        // Vytvor novy cart ak sa nieco pokazilo
        localStorage.removeItem(CART_ID_KEY);
        try {
          const newCart = await shopifyCreateCart();
          setCart(newCart);
          cartRef.current = newCart;
          localStorage.setItem(CART_ID_KEY, newCart.id);
        } catch (retryError) {
          console.error('Nepodarilo sa vytvorit kosik:', retryError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Defer cart init to avoid competing with LCP resources
    return onIdle(initCart, 3000);
  }, []);

  // ------------------------------------------
  // ACTIONS
  // ------------------------------------------

  /** Recover from expired/invalid cart by creating a new one */
  const recoverCart = useCallback(async (): Promise<ShopifyCart> => {
    localStorage.removeItem(CART_ID_KEY);
    const newCart = await shopifyCreateCart();
    setCart(newCart);
    cartRef.current = newCart;
    localStorage.setItem(CART_ID_KEY, newCart.id);
    return newCart;
  }, []);

  const addItem = useCallback(async (variantId: string, quantity: number = 1) => {
    const currentCart = cartRef.current;
    if (!currentCart) {
      setError('Košík nie je inicializovaný. Skúste obnoviť stránku.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let updatedCart: ShopifyCart;
      try {
        updatedCart = await withCartTimeout(() => shopifyAddToCart(currentCart.id, variantId, quantity));
      } catch {
        // Cart may have expired — recover and retry once
        const freshCart = await recoverCart();
        updatedCart = await withCartTimeout(() => shopifyAddToCart(freshCart.id, variantId, quantity));
      }
      setCart(updatedCart);
      cartRef.current = updatedCart;
      setIsOpen(true); // Otvor drawer po pridani
      // Meta Pixel AddToCart
      const line = updatedCart.lines.edges.find(({ node }) => node.merchandise.id === variantId);
      if (line) {
        const price = parseFloat(line.node.cost?.amountPerQuantity?.amount ?? '0');
        trackMetaEvent('AddToCart', {
          content_ids: [variantId],
          content_type: 'product',
          value: price * quantity,
          currency: 'EUR',
          num_items: quantity,
        });
        trackGA4AddToCart({ id: variantId, name: line.node.merchandise.title, price, quantity });
      }
    } catch (err) {
      console.error('Chyba pri pridani do kosika:', err);
      setError('Nepodarilo sa pridať produkt do košíka. Skúste to prosím znova.');
    } finally {
      setIsLoading(false);
    }
  }, [recoverCart]);

  const removeItem = useCallback(async (lineId: string) => {
    const currentCart = cartRef.current;
    if (!currentCart) return;

    setIsLoading(true);
    setError(null);
    try {
      const updatedCart = await withCartTimeout(() => shopifyRemoveFromCart(currentCart.id, lineId));
      setCart(updatedCart);
      cartRef.current = updatedCart;
    } catch (err) {
      console.error('Chyba pri odstraneni z kosika:', err);
      setError('Nepodarilo sa odstrániť produkt z košíka.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    const currentCart = cartRef.current;
    if (!currentCart) return;

    setIsLoading(true);
    setError(null);
    try {
      if (quantity <= 0) {
        const updatedCart = await withCartTimeout(() => shopifyRemoveFromCart(currentCart.id, lineId));
        setCart(updatedCart);
        cartRef.current = updatedCart;
      } else {
        const updatedCart = await withCartTimeout(() => shopifyUpdateCartItem(currentCart.id, lineId, quantity));
        setCart(updatedCart);
        cartRef.current = updatedCart;
      }
    } catch (err) {
      console.error('Chyba pri aktualizacii mnozstva:', err);
      setError('Nepodarilo sa aktualizovať množstvo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newCart = await shopifyCreateCart();
      setCart(newCart);
      cartRef.current = newCart;
      localStorage.setItem(CART_ID_KEY, newCart.id);
    } catch (err) {
      console.error('Chyba pri vyprazdneni kosika:', err);
      setError('Nepodarilo sa vyprázdniť košík.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);
  const clearError = useCallback(() => setError(null), []);

  // ------------------------------------------
  // COMPUTED VALUES
  // ------------------------------------------

  // Items: memoized on cart reference — without this, every render created a new
  // array which broke downstream useMemo (productItems/sampleItems) and forced all
  // useCart() consumers to re-render even when nothing relevant changed.
  const items = useMemo<CartItem[]>(
    () => (cart ? mapShopifyCartLines(cart) : []),
    [cart]
  );

  const itemCount = cart?.totalQuantity || 0;
  const subtotal = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const total = cart ? parseFloat(cart.cost.totalAmount.amount) : 0;

  // Medzisúčet pred zľavami = suma line.cost.subtotalAmount všetkých liniek.
  // Storefront API: CartLineCost.subtotalAmount je line total PRED line-level
  // discountami (robustnejšie ako amountPerQuantity × quantity, ktoré v niektorých
  // kontextoch môže vracať už discounted hodnotu).
  // Cart.cost.subtotalAmount je UŽ po aplikácii zliav → rozdiel = totalDiscount.
  const subtotalBeforeDiscount = useMemo(
    () => cart
      ? cart.lines.edges.reduce(
          (sum, { node }) => sum + parseFloat(node.cost?.subtotalAmount?.amount ?? '0'),
          0
        )
      : 0,
    [cart]
  );
  const totalDiscount = Math.max(0, subtotalBeforeDiscount - subtotal);

  const appliedDiscountTitles = useMemo(
    () => cart
      ? Array.from(
          new Set([
            // cart-level (napr. Order discount alebo code)
            ...(cart.discountAllocations ?? [])
              .map((a) => a.title || a.code)
              .filter((x): x is string => !!x),
            // line-level (Amount off products automatic discount ide sem)
            ...cart.lines.edges.flatMap(({ node }) =>
              (node.discountAllocations ?? [])
                .map((a) => a.title || a.code)
                .filter((x): x is string => !!x)
            ),
          ])
        )
      : [],
    [cart]
  );

  const checkoutUrl = useMemo(
    () => {
      if (!cart?.checkoutUrl) return null;
      const sep = cart.checkoutUrl.includes('?') ? '&' : '?';
      const utmQS = getUTMForCheckout();
      return `${cart.checkoutUrl}${sep}return_to=${encodeURIComponent(`${SITE_URL}/objednavka-dokoncena`)}${utmQS ? `&${utmQS}` : ''}`;
    },
    [cart]
  );

  const isInCart = useCallback((productHandle: string) => {
    return items.some(item => item.productId === productHandle);
  }, [items]);

  const getItemQuantity = useCallback((productHandle: string) => {
    return items
      .filter(item => item.productId === productHandle)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // ------------------------------------------
  // SAMPLE (VZORKA) COMPUTED VALUES
  // ------------------------------------------

  const { productItems, sampleItems } = useMemo(() => {
    const products: CartItem[] = [];
    const samples: CartItem[] = [];
    for (const item of items) {
      if (item.variant.toLowerCase().includes(SAMPLE_VARIANT_KEYWORD.toLowerCase())) {
        samples.push(item);
      } else {
        products.push(item);
      }
    }
    return { productItems: products, sampleItems: samples };
  }, [items]);

  const sampleCount = sampleItems.length;

  const isSampleInCart = useCallback((productHandle: string) => {
    return sampleItems.some(item => item.productId === productHandle);
  }, [sampleItems]);

  // ------------------------------------------
  // SPLIT CONTEXT VALUES
  // Three separate memos so each context only re-renders its own subscribers.
  // ------------------------------------------

  const uiValue = useMemo<CartUI>(
    () => ({ isOpen, openCart, closeCart, toggleCart }),
    [isOpen, openCart, closeCart, toggleCart]
  );

  const actionsValue = useMemo<CartActions>(
    () => ({ addItem, removeItem, updateQuantity, clearCart, clearError, isInCart, getItemQuantity, isSampleInCart }),
    [addItem, removeItem, updateQuantity, clearCart, clearError, isInCart, getItemQuantity, isSampleInCart]
  );

  const stateValue = useMemo<CartState>(
    () => ({
      items,
      isLoading,
      error,
      checkoutUrl,
      itemCount,
      subtotal,
      total,
      totalDiscount,
      subtotalBeforeDiscount,
      appliedDiscountTitles,
      sampleCount,
      productItems,
      sampleItems,
    }),
    [
      items,
      isLoading,
      error,
      checkoutUrl,
      itemCount,
      subtotal,
      total,
      totalDiscount,
      subtotalBeforeDiscount,
      appliedDiscountTitles,
      sampleCount,
      productItems,
      sampleItems,
    ]
  );

  // Legacy merged value — keeps existing useCart() consumers working without changes.
  const value = useMemo<CartContextType>(
    () => ({ ...stateValue, ...actionsValue, ...uiValue }),
    [stateValue, actionsValue, uiValue]
  );

  return (
    <CartUIContext.Provider value={uiValue}>
      <CartActionsContext.Provider value={actionsValue}>
        <CartStateContext.Provider value={stateValue}>
          <CartContext.Provider value={value}>
            {children}
          </CartContext.Provider>
        </CartStateContext.Provider>
      </CartActionsContext.Provider>
    </CartUIContext.Provider>
  );
};

// ===========================================
// HOOK
// ===========================================

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/** Subscribe only to cart open/close state. Re-renders only when drawer opens or closes. */
export const useCartUI = (): CartUI => {
  const context = useContext(CartUIContext);
  if (context === undefined) {
    throw new Error('useCartUI must be used within a CartProvider');
  }
  return context;
};

/** Subscribe only to cart actions. Callbacks have stable identity — never re-renders on state changes. */
export const useCartActions = (): CartActions => {
  const context = useContext(CartActionsContext);
  if (context === undefined) {
    throw new Error('useCartActions must be used within a CartProvider');
  }
  return context;
};

/** Subscribe only to cart data/state. Re-renders when items, totals, or loading state change. */
export const useCartState = (): CartState => {
  const context = useContext(CartStateContext);
  if (context === undefined) {
    throw new Error('useCartState must be used within a CartProvider');
  }
  return context;
};

/** Identifies whether a cart item is a sample (vzorka) by its variant title */
export const isSampleItem = (item: CartItem): boolean => {
  return item.variant.toLowerCase().includes(SAMPLE_VARIANT_KEYWORD.toLowerCase());
};
