"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, User, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { client } from "@/sanity/lib/client"; 
import { useCart } from "@/context/CartContext"; // 👈 Import Cart Context

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  
  // 👇 Get live cart count from context
  const { cartCount } = useCart(); 

  // Fetch Wishlist Count (Separate logic)
  useEffect(() => {
    const fetchWishlistCount = async () => {
      const userId = localStorage.getItem("user_id") || localStorage.getItem("userId");
      if (userId) {
        try {
          const query = `count(*[_type == "user" && _id == $userId][0].wishlist)`;
          const count = await client.fetch(query, { userId });
          setWishlistCount(count || 0);
        } catch (error) {
          console.error("Error fetching wishlist count", error);
        }
      }
    };

    fetchWishlistCount();
    const handleUpdate = () => fetchWishlistCount();
    window.addEventListener("wishlist-updated", handleUpdate);
    return () => window.removeEventListener("wishlist-updated", handleUpdate);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-[#E5E5E5]">
      
      {/* TOP BAR */}
      <div className="bg-[#0C123C] text-white text-[10px] font-bold text-center py-2 uppercase tracking-widest hidden sm:block">
        Complimentary Shipping on Orders Above $200 — <Link href="/shop" className="underline">Shop Now</Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-serif text-2xl tracking-wide text-[#1A1A1A] font-bold">
              TYAARA TRENDS
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "Shop", "Products", "About"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#0C123C] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* ICONS */}
          <div className="flex items-center gap-6">
            <button className="text-[#1A1A1A] hover:text-[#0C123C] transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>

            <Link href="/account" className="text-[#1A1A1A] hover:text-[#0C123C] transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>

            {/* WISHLIST ICON */}
            <Link href="/wishlist" className="text-[#1A1A1A] hover:text-[#0C123C] transition-colors relative group">
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CART ICON (Live Count) */}
            <Link href="/cart" className="text-[#1A1A1A] hover:text-[#0C123C] transition-colors relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {/* 👇 Only show badge if count > 0 */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B87E58] text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <button 
              className="md:hidden text-[#1A1A1A]"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E5E5] px-4 py-6 space-y-4 animate-in slide-in-from-top-5">
           {["Home", "Shop", "Products", "About", "Wishlist", "Account"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="block text-sm font-bold uppercase tracking-widest text-[#1A1A1A]"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
        </div>
      )}
    </nav>
  );
}