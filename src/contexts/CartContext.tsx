import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface CartLine {
  id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartLine[];
  total: number;
  count: number;
  addItem: (item: { id: string; name: string; price: number; image?: string | null }) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getQuantity: (id: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'wubate-cart';

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartLine[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() =>
    typeof localStorage !== 'undefined' ? loadCart() : []
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: { id: string; name: string; price: number; image?: string | null }) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image ?? null,
          quantity: 1,
        },
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (!existing) return prev;
      if (existing.quantity <= 1) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p));
    });
  };

  const setQuantity = (id: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, quantity } : p));
    });
  };

  const clearCart = () => setItems([]);

  const getQuantity = (id: string) => items.find((i) => i.id === id)?.quantity ?? 0;

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, total, count, addItem, removeItem, setQuantity, clearCart, getQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
