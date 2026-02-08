"use client";

import Link from "next/link";
import Image from "next/image"; 
import { useState, useEffect } from "react";
import { Search, User, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { client } from "@/sanity/lib/client"; 
import { useCart } from "@/context/CartContext"; 
import { urlFor } from "@/sanity/lib/image"; 

interface NavbarClientProps {
  data: {
    logo?: any;
    menuItems: { label: string; href: string }[];
  };
}

export default function NavbarClient({ data }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  
  const { getCartCount } = useCart(); 
  const [mounted, setMounted] = useState(false);

  const { logo, menuItems } = data;

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = menuItems.length > 0 ? menuItems : [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
  ];

  // 👇 UPDATED: Wishlist Logic (Instant + Background Fetch)
  useEffect(() => {
    const userId = localStorage.getItem("user_id") || localStorage.getItem("userId");

    // 1. Initial Fetch from Server (On Load)
    const fetchWishlistCount = async () => {
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

    // 2. Listen for INSTANT Local Updates (From Button Click)
    const handleLocalUpdate = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail && typeof customEvent.detail.change === 'number') {
            setWishlistCount((prev) => Math.max(0, prev + customEvent.detail.change));
        }
    };

    window.addEventListener("wishlist-change", handleLocalUpdate);

    // Cleanup
    return () => {
        window.removeEventListener("wishlist-change", handleLocalUpdate);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-secondary/20">
      
      {/* TOP BAR */}
      <div className="bg-primary text-white text-[10px] font-bold text-center py-2 uppercase tracking-widest hidden sm:block">
        Complimentary Shipping on Orders Above $200 — <Link href="/shop" className="underline hover:text-secondary transition-colors">Shop Now</Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-serif text-2xl tracking-wide text-primary font-bold flex items-center">
              {logo ? (
                <div className="relative w-32 h-10">
                  <Image 
                    src={urlFor(logo).url()} 
                    alt="Logo" 
                    fill 
                    className="object-contain object-left" 
                    priority
                  />
                </div>
              ) : (
                <span>TYAARA TRENDS</span>
              )}
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href || "/"}
                className="text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* ICONS */}
          <div className="flex items-center gap-6">
            <button className="text-primary hover:text-secondary transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>

            <Link href="/account" className="text-primary hover:text-secondary transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>

            <Link href="/wishlist" className="text-primary hover:text-secondary transition-colors relative group">
              <Heart size={20} strokeWidth={1.5} />
              {/* Only show if count > 0 */}
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="text-primary hover:text-secondary transition-colors relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              
              {mounted && getCartCount() > 0 && (
                <span className="absolute -top-1 -right-2 bg-secondary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <button 
              className="md:hidden text-primary"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-secondary/20 px-4 py-6 space-y-4 animate-in slide-in-from-top-5">
           {navLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href || "/"}
                className="block text-sm font-bold uppercase tracking-widest text-primary hover:text-secondary"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
        </div>
      )}
    </nav>
  );
}