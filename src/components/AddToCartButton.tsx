"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag, Ban } from "lucide-react"; 
import toast from "react-hot-toast";

interface AddToCartButtonProps {
  product: any;
  styleType?: "full" | "icon" | "minimal";
  stock?: number;
}

export default function AddToCartButton({ product, styleType = "full", stock = 10 }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const isOutOfStock = stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (isOutOfStock) return;

    // 👇 1. GENERATE UNIQUE ID based on product ID + chosen variations
    const uniqueCartId = `${product._id}-${product.selectedSize || 'nosize'}-${product.selectedMaterial || 'nomaterial'}-${product.selectedColor || 'nocolor'}`;

    // 👇 2. SEND FULL DATA TO CART
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      // Safely handles both string images and Sanity image arrays
      image: product.image || (product.images && product.images[0]) || "", 
      quantity: 1,
      slug: typeof product.slug === 'string' ? product.slug : product.slug?.current,
      selectedSize: product.selectedSize,
      selectedMaterial: product.selectedMaterial,
      selectedColor: product.selectedColor,
      cartItemId: uniqueCartId, // Pass the magic key!
    });
    
    // 👇 3. DYNAMIC TOAST MESSAGE (e.g. "Added Molten Ring (50 / Gold) to Bag")
    const variations = [product.selectedSize, product.selectedMaterial, product.selectedColor]
      .filter(Boolean) 
      .join(" / ");

    const toastMessage = variations 
      ? `Added ${product.name} (${variations}) to Bag` 
      : `Added ${product.name} to Bag`;

    toast.success(toastMessage);
  };

  // 1. OUT OF STOCK - FULL BUTTON
  if (isOutOfStock && styleType === "full") {
    return (
      <button 
        disabled
        className="w-full bg-gray-100 text-gray-400 py-4 text-xs font-bold uppercase tracking-widest cursor-not-allowed border border-gray-100 flex items-center justify-center gap-2"
      >
        <Ban size={16} /> Out of Stock
      </button>
    );
  }

  // 2. OUT OF STOCK - ICON BUTTON / MINIMAL
  if (isOutOfStock && (styleType === "icon" || styleType === "minimal")) {
     return (
        <button 
          disabled
          className="w-10 h-10 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center cursor-not-allowed shadow-none"
          title="Out of Stock"
        >
          <Ban size={18} />
        </button>
     );
  }

  // 3. IN STOCK - FULL BUTTON
  if (styleType === "full") {
    return (
      <button 
        onClick={handleAddToCart}
        className="w-full border bg-primary text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-all duration-300"
      >
        Add to Bag
      </button>
    );
  }

  // 4. IN STOCK - MINIMAL (Under Text)
  if (styleType === "minimal") {
      return (
        <button 
            onClick={handleAddToCart}
            className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:text-secondary hover:border-secondary transition-colors flex items-center gap-1"
        >
            <ShoppingBag size={12} /> Add to Bag
        </button>
      );
  }

  // 5. IN STOCK - ICON (Circle)
  return (
    <button 
      onClick={handleAddToCart}
      className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-secondary transition-all shadow-md"
    >
      <ShoppingBag size={18} strokeWidth={1.5} />
    </button>
  );
}