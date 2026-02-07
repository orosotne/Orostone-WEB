import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// ===========================================
// TYPES
// ===========================================

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;        // cena za m²
  quantity: number;     // počet kusov
  dimensions: string;
  thickness: string;
  surfaceArea?: number; // m² za kus
  discountPercent?: number; // bundle zlava (napr. 20 = 20%)
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType {
  state: CartState;
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  // Computed
  itemCount: number;
  subtotal: number;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

// ===========================================
// CONSTANTS
// ===========================================

const CART_STORAGE_KEY = 'orostone_cart';
const SHIPPING_FLAT_RATE = 49; // €49 paušálna doprava

// ===========================================
// INITIAL STATE
// ===========================================

const initialState: CartState = {
  items: [],
  isOpen: false,
};

// ===========================================
// REDUCER
// ===========================================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Hladaj existujucu polozku s rovnakym produktom A zlavou
      const existingIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId && 
                  item.discountPercent === action.payload.discountPercent
      );

      if (existingIndex > -1) {
        // Zvýš množstvo existujúcej položky
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updatedItems, isOpen: true };
      }

      // Pridaj novú položku
      return {
        ...state,
        items: [...state.items, action.payload],
        isOpen: true,
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'LOAD_CART':
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

// ===========================================
// CONTEXT
// ===========================================

const CartContext = createContext<CartContextType | undefined>(undefined);

// ===========================================
// PROVIDER
// ===========================================

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Načítaj košík z localStorage pri inicializácii
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Ulož košík do localStorage pri zmene
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.items]);

  // ===========================================
  // ACTIONS
  // ===========================================

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: `${item.productId}_${Date.now()}`,
    };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  // ===========================================
  // COMPUTED VALUES
  // ===========================================

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = state.items.reduce((total, item) => {
    // Cena = cena za m² × plocha × množstvo × (1 - zlava)
    const area = item.surfaceArea || 5.12; // default 3200x1600mm = 5.12m²
    const discount = item.discountPercent ? item.discountPercent / 100 : 0;
    const itemTotal = item.price * area * item.quantity * (1 - discount);
    return total + itemTotal;
  }, 0);

  const isInCart = (productId: string) => {
    return state.items.some((item) => item.productId === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = state.items.find((item) => item.productId === productId);
    return item?.quantity || 0;
  };

  // ===========================================
  // CONTEXT VALUE
  // ===========================================

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    itemCount,
    subtotal,
    isInCart,
    getItemQuantity,
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

export const SHIPPING_COST = SHIPPING_FLAT_RATE;

export const calculateTotal = (subtotal: number, shippingCost: number = SHIPPING_FLAT_RATE) => {
  return subtotal + shippingCost;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
};
