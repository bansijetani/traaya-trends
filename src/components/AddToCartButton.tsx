"use client";

import { useCart } from "@/context/CartContext"; 
import { ShoppingBag, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface AddToCartButtonProps {
  product: any;
  styleType?: "minimal" | "full" | "icon";
}

export default function AddToCartButton({ product, styleType = "minimal" }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    // 👇 SAFETY CHECK: Get the valid name (checks title, then name, then defaults to "Item")
    const productName = product.title || product.name || "Item";
    
    addToCart({
      id: product._id,
      name: productName, // Use the safe name
      price: product.price,
      image: product.image,
      quantity: 1,
      slug: product.slug 
    });
    
    // 👇 FIX: Use safe name in Toast
    toast.success(`${productName} ADDED TO BAG`, {
      style: {
        border: '1px solid #E5E5E5',
        padding: '12px 16px',
        color: '#1A1A1A',
        background: '#FFFFFF',
        fontFamily: 'var(--font-inter)',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      },
      iconTheme: {
        primary: '#B87E58',
        secondary: '#FFFFFF',
      },
    });
  };

  if (styleType === "icon") {
    return (
      <button 
        onClick={handleAdd}
        className="w-10 h-10 bg-white text-black flex items-center justify-center rounded-full shadow-lg hover:bg-[#B87E58] hover:text-white transition-colors cursor-pointer z-50"
        title="Add to Cart"
      >
        <Plus size={18} />
      </button>
    );
  }

  if (styleType === "full") {
    return (
      <button 
        onClick={handleAdd}
        className="w-full mt-4 bg-[#1A1A1A] text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#B87E58] transition-colors flex items-center justify-center gap-2 cursor-pointer z-50"
      >
        <ShoppingBag size={14} /> Add to Cart
      </button>
    );
  }

  return (
    <button 
      onClick={handleAdd}
      className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#B87E58] hover:border-[#B87E58] transition-colors cursor-pointer z-50"
    >
      Add to Bag
    </button>
  );
}