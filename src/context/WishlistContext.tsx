"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { client } from "@/sanity/lib/client";
import { useSession } from "next-auth/react";

interface WishlistContextType {
  wishlistCount: number;
  syncWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistCount, setWishlistCount] = useState(0);
  const { data: session } = useSession();

  const syncWishlist = async () => {
    // Check Local Storage for ID (Guest/Admin logic)
    const userId = localStorage.getItem("user_id") || localStorage.getItem("userId");
    
    if (!userId) {
        setWishlistCount(0);
        return;
    }

    try {
      // Fast query to just get the count
      const query = `count(*[_type == "user" && _id == $userId][0].wishlist)`;
      const count = await client.fetch(query, { userId });
      setWishlistCount(count || 0);
    } catch (error) {
      console.error("Failed to sync wishlist count:", error);
    }
  };

  // Sync on load and when session changes
  useEffect(() => {
    syncWishlist();
  }, [session]);

  return (
    <WishlistContext.Provider value={{ wishlistCount, syncWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}