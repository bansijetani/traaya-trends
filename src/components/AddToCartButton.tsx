"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface AddToCartProps {
  product: any;
  styleType?: "icon" | "full" | "minimal";
}

export default function AddToCartButton({ product, styleType = "full" }: AddToCartProps) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    setLoading(true);

    // Normalization: Create a clean object for the cart
    const cartItem = {
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug?.current || product.slug,
        quantity: 1
    };

    // Simulate network delay for UX
    setTimeout(() => {
      addToCart(cartItem);
      
      // 👇 UPDATE: Toast now uses your Brand Colors
      toast.success(`${product.name} added to bag`, {
        style: {
          background: '#083200', // Primary (Deep Green)
          color: '#FFFFFF',      // White Text
          border: '1px solid #8BAE62', // Secondary (Soft Green/Gold)
          padding: '16px',
        },
        iconTheme: {
          primary: '#8BAE62',   // Secondary (Icon Color)
          secondary: '#083200', // Primary (Checkmark Color)
        },
      });
      
      setLoading(false);
    }, 500);
  };

  // --- STYLE VARIANTS ---

  if (styleType === "icon") {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="relative z-50 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-secondary transition-colors duration-300 shadow-md cursor-pointer"
        aria-label="Add to cart"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
      </button>
    );
  }

  if (styleType === "minimal") {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="relative z-50 group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-all duration-300 cursor-pointer"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : "Add to Bag"}
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="relative z-50 w-full bg-primary text-white py-3 px-6 text-sm font-bold uppercase tracking-wider hover:bg-secondary transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <>
          <ShoppingBag size={18} />
          Add to Cart
        </>
      )}
    </button>
  );
}