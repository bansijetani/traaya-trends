"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { client } from "@/sanity/lib/client";

interface WishlistButtonProps {
  productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const localUserId = localStorage.getItem("user_id") || localStorage.getItem("userId");
    console.log("👤 Wishlist User ID:", localUserId); // 👈 DEBUG LOG
    setUserId(localUserId);

    if (localUserId && productId) {
      const checkStatus = async () => {
        try {
          // Check if this product ID exists in the user's wishlist array
          const query = `count(*[_type == "user" && _id == $id && defined(wishlist) && $prodId in wishlist[]._ref]) > 0`;
          const isInWishlist = await client.fetch(query, { id: localUserId, prodId: productId });
          setIsActive(isInWishlist);
        } catch (err) {
          console.error("Check status failed:", err);
        }
      };
      checkStatus();
    }
  }, [productId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("❤️ Clicked Wishlist. User:", userId, "Product:", productId); // 👈 DEBUG LOG

    if (!userId) {
      toast.error("Please log in to your account first!");
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await res.json();
      console.log("📡 API Response:", data); // 👈 DEBUG LOG
      
      if (res.ok) {
        setIsActive(data.active);
        toast.success(data.message);
      } else {
        toast.error("Failed to update wishlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`w-full h-full flex items-center justify-center rounded-full transition-all ${
        isActive 
          ? "bg-red-50 text-red-500" 
          : "text-gray-400 hover:text-red-500"
      }`}
    >
      <Heart 
        size={24} 
        fill={isActive ? "currentColor" : "none"} 
        className={loading ? "animate-pulse" : ""}
      />
    </button>
  );
}