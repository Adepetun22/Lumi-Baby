import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';

interface CartState {
  cartCounts: Record<number, number>;
}

type CartAction =
  | { type: 'INCREMENT'; id: number }
  | { type: 'DECREMENT'; id: number }
  | { type: 'SET'; id: number; qty: number };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        cartCounts: {
          ...state.cartCounts,
          [action.id]: (state.cartCounts[action.id] || 0) + 1
        }
      };
    case 'DECREMENT':
      const newQty = (state.cartCounts[action.id] || 0) - 1;
      if (newQty <= 0) {
        const { [action.id]: _, ...rest } = state.cartCounts;
        return { cartCounts: rest };
      }
      return {
        cartCounts: {
          ...state.cartCounts,
          [action.id]: newQty
        }
      };
    case 'SET':
      if (action.qty <= 0) {
        const { [action.id]: _, ...rest } = state.cartCounts;
        return { cartCounts: rest };
      }
      return {
        cartCounts: {
          ...state.cartCounts,
          [action.id]: action.qty
        }
      };
    default:
      return state;
  }
};

const STORAGE_KEY = 'lumi-baby-cart';

interface CartContextType {
  cartCounts: Record<number, number>;
  totalCount: number;
  uniqueCount: number;
  hydrated: boolean;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  setQty: (id: number, qty: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cartCounts: {} });
  const [hydrated, setHydrated] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.entries(parsed.cartCounts).forEach(([idStr, qty]: [string, number]) => {
          dispatch({ type: 'SET' as const, id: Number(idStr), qty });
        });
      } catch (e) {
        console.error('Failed to load cart from localStorage');
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const increment = (id: number) => dispatch({ type: 'INCREMENT', id });
  const decrement = (id: number) => dispatch({ type: 'DECREMENT', id });
  const setQty = (id: number, qty: number) => dispatch({ type: 'SET', id, qty });

  const totalCount = Object.values(state.cartCounts).reduce((sum, qty) => sum + qty, 0);
  const uniqueCount = Object.keys(state.cartCounts).length;

  return (
    <CartContext.Provider value={{ cartCounts: state.cartCounts, totalCount, uniqueCount, hydrated, increment, decrement, setQty }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

