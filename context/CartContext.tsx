import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { isShopifyConfigured } from '../lib/shopify';
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
  checkoutUrl: string | null;
  
  // Actions
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Computed
  itemCount: number;
  subtotal: number;
  total: number;
  isInCart: (productHandle: string) => boolean;
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
    if (!cart) return;
    
    setIsLoading(true);
    try {
      const updatedCart = await shopifyAddToCart(cart.id, variantId, quantity);
      setCart(updatedCart);
      setIsOpen(true); // Otvor drawer po pridani
    } catch (error) {
      console.error('Chyba pri pridani do kosika:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const removeItem = useCallback(async (lineId: string) => {
    if (!cart) return;
    
    setIsLoading(true);
    try {
      const updatedCart = await shopifyRemoveFromCart(cart.id, lineId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Chyba pri odstraneni z kosika:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (!cart) return;
    
    setIsLoading(true);
    try {
      if (quantity <= 0) {
        const updatedCart = await shopifyRemoveFromCart(cart.id, lineId);
        setCart(updatedCart);
      } else {
        const updatedCart = await shopifyUpdateCartItem(cart.id, lineId, quantity);
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Chyba pri aktualizacii mnozstva:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const newCart = await shopifyCreateCart();
      setCart(newCart);
      localStorage.setItem(CART_ID_KEY, newCart.id);
    } catch (error) {
      console.error('Chyba pri vyprazdneni kosika:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

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
  // CONTEXT VALUE
  // ------------------------------------------

  const value: CartContextType = {
    items,
    isOpen,
    isLoading,
    checkoutUrl,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    itemCount,
    subtotal,
    total,
    isInCart,
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
