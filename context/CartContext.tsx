import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
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

// ===========================================
// TYPES
// ===========================================

export interface CartItem {
  id: string;            // Shopify line item ID
  variantId: string;     // Shopify variant GID
  productId: string;     // Product handle
  name: string;
  image: string;
  price: number;         // cena za kus
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
  isInCart: (productHandle: string) => boolean;
  
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

// ===========================================
// CONTEXT
// ===========================================

const CartContext = createContext<CartContextType | undefined>(undefined);

// ===========================================
// HELPERS
// ===========================================

function mapShopifyCartLines(cart: ShopifyCart): CartItem[] {
  return cart.lines.edges.map(({ node: line }) => ({
    id: line.id,
    variantId: line.merchandise.id,
    productId: line.merchandise.product.handle,
    name: line.merchandise.product.title,
    image: line.merchandise.image?.url || line.merchandise.product.images.edges[0]?.node.url || '',
    price: parseFloat(line.cost.amountPerQuantity.amount),
    quantity: line.quantity,
    variant: line.merchandise.title !== 'Default Title' ? line.merchandise.title : '',
  }));
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

  // ------------------------------------------
  // Inicializacia kosika
  // ------------------------------------------
  useEffect(() => {
    if (!isShopifyConfigured()) return;

    const initCart = async () => {
      try {
        // Skus nacitat existujuci cart z localStorage
        const savedCartId = localStorage.getItem(CART_ID_KEY);
        
        if (savedCartId) {
          const existingCart = await shopifyGetCart(savedCartId);
          if (existingCart) {
            setCart(existingCart);
            return;
          }
        }

        // Ak neexistuje, vytvor novy
        const newCart = await shopifyCreateCart();
        setCart(newCart);
        localStorage.setItem(CART_ID_KEY, newCart.id);
      } catch (error) {
        console.error('Chyba pri inicializacii kosika:', error);
        // Vytvor novy cart ak sa nieco pokazilo
        try {
          const newCart = await shopifyCreateCart();
          setCart(newCart);
          localStorage.setItem(CART_ID_KEY, newCart.id);
        } catch (retryError) {
          console.error('Nepodarilo sa vytvorit kosik:', retryError);
        }
      }
    };

    initCart();
  }, []);

  // ------------------------------------------
  // ACTIONS
  // ------------------------------------------

  const addItem = useCallback(async (variantId: string, quantity: number = 1) => {
    if (!cart) {
      setError('Košík nie je inicializovaný. Skúste obnoviť stránku.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const updatedCart = await shopifyAddToCart(cart.id, variantId, quantity);
      setCart(updatedCart);
      setIsOpen(true); // Otvor drawer po pridani
    } catch (err) {
      console.error('Chyba pri pridani do kosika:', err);
      setError('Nepodarilo sa pridať produkt do košíka. Skúste to prosím znova.');
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const updatedCart = await shopifyRemoveFromCart(cart.id, lineId);
      setCart(updatedCart);
    } catch (err) {
      console.error('Chyba pri odstraneni z kosika:', err);
      setError('Nepodarilo sa odstrániť produkt z košíka.');
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;
    
    setIsLoading(true);
    setError(null);
    try {
      if (quantity <= 0) {
        const updatedCart = await shopifyRemoveFromCart(cart.id, lineId);
        setCart(updatedCart);
      } else {
        const updatedCart = await shopifyUpdateCartItem(cart.id, lineId, quantity);
        setCart(updatedCart);
      }
    } catch (err) {
      console.error('Chyba pri aktualizacii mnozstva:', err);
      setError('Nepodarilo sa aktualizovať množstvo.');
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newCart = await shopifyCreateCart();
      setCart(newCart);
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

  const items = cart ? mapShopifyCartLines(cart) : [];
  const itemCount = cart?.totalQuantity || 0;
  const subtotal = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const total = cart ? parseFloat(cart.cost.totalAmount.amount) : 0;
  const checkoutUrl = cart?.checkoutUrl || null;

  const isInCart = useCallback((productHandle: string) => {
    return items.some(item => item.productId === productHandle);
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
  // CONTEXT VALUE
  // ------------------------------------------

  const value: CartContextType = {
    items,
    isOpen,
    isLoading,
    error,
    checkoutUrl,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    clearError,
    itemCount,
    subtotal,
    total,
    isInCart,
    // Sample helpers
    sampleCount,
    isSampleInCart,
    productItems,
    sampleItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
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

// ===========================================
// UTILITY EXPORTS
// ===========================================

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
};

/** Identifies whether a cart item is a sample (vzorka) by its variant title */
export const isSampleItem = (item: CartItem): boolean => {
  return item.variant.toLowerCase().includes(SAMPLE_VARIANT_KEYWORD.toLowerCase());
};
