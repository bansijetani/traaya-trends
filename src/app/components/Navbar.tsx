"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, Heart } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColorClass = isScrolled ? "text-vemus-black" : "text-white";
  const bgClass = isScrolled ? "bg-white shadow-sm py-4" : "bg-transparent py-6";

  return (
    <header className="fixed w-full z-50 flex flex-col transition-all duration-300">
      {/* Top Black Bar */}
      <div className={`bg-[#111111] text-white text-[11px] font-medium tracking-widest2 text-center py-2 uppercase transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden py-0' : 'h-auto'}`}>
        Free Shipping On All Orders Over $2500
      </div>

      {/* Main Navbar */}
      <nav className={`w-full transition-all duration-300 ${bgClass}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          
          {/* Left Links (Desktop) */}
          <div className={`hidden lg:flex gap-8 text-[13px] font-medium tracking-widest uppercase ${textColorClass}`}>
            <Link href="/" className="nav-link hover:text-vemus-gold transition-colors">Home</Link>
            <Link href="/shop" className="nav-link hover:text-vemus-gold transition-colors">Shop</Link>
            <Link href="/about" className="nav-link hover:text-vemus-gold transition-colors">About</Link>
          </div>
          
           {/* Mobile Menu Icon */}
           <button className={`lg:hidden ${textColorClass}`}>
            <Menu size={24} strokeWidth={1} />
          </button>

          {/* Center Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className={`font-serif text-3xl lg:text-4xl font-bold tracking-tight transition-colors ${textColorClass}`}>
              Vemus
            </Link>
          </div>

          {/* Right Icons */}
          <div className={`flex items-center gap-6 ${textColorClass}`}>
            <button className="hidden lg:block hover:text-vemus-gold transition-colors"><Search size={20} strokeWidth={1} /></button>
            <button className="hidden lg:block hover:text-vemus-gold transition-colors"><User size={20} strokeWidth={1} /></button>
            <button className="hover:text-vemus-gold transition-colors"><Heart size={20} strokeWidth={1} /></button>
            <button className="relative hover:text-vemus-gold transition-colors">
              <ShoppingBag size={20} strokeWidth={1} />
              <span className="absolute -top-1 -right-1.5 h-4 w-4 bg-vemus-gold text-white text-[9px] flex items-center justify-center rounded-full">2</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}