"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, ArrowUpRight, Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] shadow-sm bg-[#FDFBF7]">
      
      {/* 1. TOP BAR (Updated to match reference image) */}
      <div className="bg-[#8B7E58] text-white px-4 py-2.5 text-[10px] md:text-[11px] font-medium tracking-widest uppercase relative z-50">
        <div className="flex justify-center items-center gap-4 md:gap-6 w-full text-center">
          
          {/* Shipping Text */}
          <span>Complimentary Shipping on Orders Above $200</span>
          
          {/* Separator (Hidden on very small screens) */}
          <span className="hidden md:inline text-white/60">—</span>
          
          {/* Shop Now Link with Underline and Arrow */}
          <Link href="/shop" className="flex items-center gap-1 hover:text-white/80 transition-opacity whitespace-nowrap border-b border-white pb-0.5 leading-none">
            Shop Now <ArrowUpRight size={10} className="mb-0.5" />
          </Link>

        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav className="border-b border-[#E5E0D8] py-4 md:py-6 relative z-50 bg-[#FDFBF7]">
        <div className="max-w-[1500px] mx-auto px-4 md:px-12 flex justify-between items-center">
          
          {/* MOBILE: Hamburger Menu */}
          <button 
            className="lg:hidden text-[#1A1A1A] p-1"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link href="/" className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A] italic absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:text-left">
            TYAARA TRENDS
          </Link>

          {/* DESKTOP: Centered Links */}
          <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-widest uppercase text-[#1A1A1A]">
            <Link href="/" className="flex items-center gap-1 hover:text-[#8B7E58] transition-colors">
              Home <ChevronDown size={12} />
            </Link>
            <Link href="/shop" className="flex items-center gap-1 hover:text-[#8B7E58] transition-colors">
              Shop <ChevronDown size={12} />
            </Link>
            <Link href="/products" className="flex items-center gap-1 hover:text-[#8B7E58] transition-colors">
              Products <ChevronDown size={12} />
            </Link>
            <Link href="/about" className="flex items-center gap-1 hover:text-[#8B7E58] transition-colors">
              About <ChevronDown size={12} />
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 md:gap-6 text-[#1A1A1A]">
            <Search size={20} className="hidden md:block cursor-pointer hover:text-[#8B7E58]" strokeWidth={1.5} />
            <User size={20} className="hidden md:block cursor-pointer hover:text-[#8B7E58]" strokeWidth={1.5} />
            <div className="relative cursor-pointer hover:text-[#8B7E58]">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-2 bg-[#8B7E58] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 3. MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      
      {/* 4. MOBILE MENU DRAWER */}
      <div className={`fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-[#FDFBF7] z-[101] shadow-2xl transition-transform duration-300 transform lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8 border-b border-[#E5E0D8] pb-4">
             <span className="font-serif text-2xl italic font-bold">TRAAYA</span>
             <button onClick={() => setIsMobileMenuOpen(false)}>
               <X size={24} strokeWidth={1.5} />
             </button>
          </div>
          <div className="flex flex-col gap-6 text-[13px] font-bold tracking-widest uppercase text-[#1A1A1A]">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-transparent hover:border-[#8B7E58] pb-1 w-fit">Home</Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-transparent hover:border-[#8B7E58] pb-1 w-fit">Shop</Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-transparent hover:border-[#8B7E58] pb-1 w-fit">Products</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-transparent hover:border-[#8B7E58] pb-1 w-fit">About</Link>
          </div>
        </div>
      </div>
    </header>
  );
}