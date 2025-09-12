"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo
} from "react";

type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  size: number;
  colorSize: string;
  discount: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: number) => void;
  updateQuantity: (id: number | string, size: number, delta: number) => void;
  subtotal: number;
  tax: number;
  total: number;
  totalItems: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Load cart from localStorage on first render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === newItem.id && item.size === newItem.size
      );
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string, size: number) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === id && item.size === size))
    );
  };

  const updateQuantity = (id: string | number, size: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id.toString() && item.size === size
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

   // Derived values using useMemo (for performance)
   const subtotal = useMemo(
    () =>
      cart.reduce((acc, item) => {
        const discountedPrice = item.price * (1 - item.discount / 100);
        return acc + discountedPrice * item.quantity;
      }, 0),
    [cart]
  );

  const taxRate = 0.05; // 5% VAT or whatever your rule is
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart,
        subtotal,
        tax,
        total,
        totalItems, }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
