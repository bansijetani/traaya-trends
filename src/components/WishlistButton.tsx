"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { toggleWishlistAction } from "@/app/actions/wishlistAction"; 
import toast from "react-hot-toast";

interface WishlistButtonProps {
  productId: string;
  productName?: string;
}

export default function WishlistButton({ productId, productName }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 1. Check Wishlist Status (On Load)
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id") || localStorage.getItem("userId");
    setUserId(storedUserId);

    if (storedUserId) {
      const checkWishlist = async () => {
        try {
          const query = `*[_type == "user" && _id == $userId][0].wishlist[]._ref`;
          const wishlistItems: string[] = await client.fetch(query, { userId: storedUserId });
          
          if (wishlistItems && wishlistItems.includes(productId)) {
            setIsInWishlist(true);
          }
        } catch (error) {
          console.error("Failed to check wishlist", error);
        }
      };
      checkWishlist();
    }
  }, [productId]);

  // 2. Handle Click (Optimistic Update)
  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!userId) {
      toast.error("Please sign in to save items");
      return;
    }

    // A. CAPTURE CURRENT STATE
    const previousState = isInWishlist;
    const newState = !isInWishlist;

    // B. INSTANTLY UPDATE BUTTON UI
    setIsInWishlist(newState);
    
    // C. INSTANTLY UPDATE HEADER COUNTER (The Magic Part ✨)
    // We send a custom signal: +1 if adding, -1 if removing
    const event = new CustomEvent("wishlist-change", { 
        detail: { change: newState ? 1 : -1 } 
    });
    window.dispatchEvent(event);

    // D. SHOW TOAST
    if (newState) {
        toast.success(productName ? `${productName} saved to wishlist` : "Saved to wishlist", {
            style: { background: '#083200', color: '#FFFFFF', border: '1px solid #8BAE62', padding: '16px' },
            iconTheme: { primary: '#8BAE62', secondary: '#083200' },
        });
    } else {
        toast.success("Removed from wishlist", {
            style: { background: '#083200', color: '#FFFFFF', border: '1px solid #8BAE62' },
            iconTheme: { primary: '#8BAE62', secondary: '#083200' },
        });
    }

    // E. PERFORM SERVER UPDATE IN BACKGROUND
    try {
      const result = await toggleWishlistAction(userId, productId, previousState);
      if (!result.success) throw new Error(result.error);
    } catch (error) {
      // F. REVERT UI IF SERVER FAILS
      console.error("Wishlist update failed", error);
      setIsInWishlist(previousState);
      
      // Revert the counter too
      window.dispatchEvent(new CustomEvent("wishlist-change", { 
        detail: { change: newState ? -1 : 1 } 
      }));
      
      toast.error("Could not save to wishlist");
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className={`p-2 rounded-full transition-all duration-300 ${
        isInWishlist 
          ? "bg-red-50 text-red-500 hover:bg-red-100" 
          : "bg-white/80 text-gray-600 hover:bg-white hover:text-primary hover:scale-110"
      } shadow-sm backdrop-blur-sm`}
      aria-label="Toggle Wishlist"
    >
      <Heart 
        size={20} 
        className="transition-transform duration-300 active:scale-75" 
        fill={isInWishlist ? "currentColor" : "none"} 
      />
    </button>
  );
}