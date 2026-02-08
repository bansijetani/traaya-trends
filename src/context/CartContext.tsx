"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ✅ 1. Define the Shape of a Cart Item
export interface CartItem {
  id: string;
  _id?: string; // Optional backup ID
  name: string;
  price: number; // Must be a number!
  image: string;
  slug: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save to LocalStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // ✅ 2. Add to Cart with Price Cleaning
  const addToCart = (product: any) => {
    setItems((prev) => {
      // Handle ID: Prefer 'id', fallback to '_id'
      const productId = product.id || product._id;
      
      // Handle Price: Ensure it's a number
      let safePrice = product.price;
      if (typeof safePrice === 'string') {
        // Remove "$" and "," and convert to float
        safePrice = parseFloat(safePrice.replace(/[^0-9.]/g, ''));
      }

      const existingItem = prev.find((item) => item.id === productId);

      if (existingItem) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: productId,
          _id: product._id, // Save this just in case
          name: product.name,
          price: safePrice, // Save the cleaned number
          image: product.image,
          slug: product.slug?.current || product.slug,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // ✅ 3. Calculate Total Safely
  const getCartTotal = () => {
    return items.reduce((total, item) => {
        const itemPrice = typeof item.price === 'number' ? item.price : 0;
        return total + itemPrice * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}