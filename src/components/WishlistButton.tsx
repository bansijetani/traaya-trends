"use client";

import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { client } from "@/sanity/lib/client";
import toast from "react-hot-toast";
import { useWishlist } from "@/context/WishlistContext"; // 👈 1. Import Context

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { data: session } = useSession();
  const { syncWishlist } = useWishlist(); // 👈 2. Get the sync function
  
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if item is already in wishlist on load
  useEffect(() => {
    const checkWishlist = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
          setChecking(false);
          return;
      }
      
      try {
        // Query: Check if the product ID exists in the user's wishlist array
        const query = `defined(*[_type == "user" && _id == $userId && $productId in wishlist[]._ref][0]._id)`;
        const exists = await client.fetch(query, { userId, productId });
        setIsInWishlist(exists);
      } catch (error) {
        console.error("Check wishlist failed", error);
      } finally {
        setChecking(false);
      }
    };
    checkWishlist();
  }, [productId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (loading) return;
    
    // User Check
    const userId = localStorage.getItem("user_id");
    if (!userId) {
        toast.error("Please log in to save items");
        return;
    }

    setLoading(true);

    // Optimistic UI Update (Instant toggle)
    const previousState = isInWishlist;
    setIsInWishlist(!isInWishlist);

    try {
      const action = previousState ? "remove" : "add"; // If it was in, we remove. If out, we add.

      // Call API
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }), // API handles toggling usually, or send action if needed
      });

      if (!res.ok) throw new Error("Failed to update wishlist");

      // 👇 3. CRITICAL: Tell the header to update immediately
      await syncWishlist(); 

      toast.success(previousState ? "Removed from Wishlist" : "Saved to Wishlist");

    } catch (error) {
      // Revert if failed
      setIsInWishlist(previousState);
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className={`w-10 h-10 flex items-center justify-center ${className}`}>
        <Loader2 size={16} className="animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleWishlist}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 group ${
        isInWishlist 
          ? "bg-red-50 text-red-500 border border-red-200" 
          : "bg-white text-gray-400 border border-gray-200 hover:border-primary hover:text-primary"
      } ${className}`}
      title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <Heart 
        size={18} 
        fill={isInWishlist ? "currentColor" : "none"} 
        className={`transition-colors ${isInWishlist ? "fill-current" : ""}`}
      />
    </button>
  );
}