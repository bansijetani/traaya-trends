"use client";

import Link from "next/link";
import Image from "next/image"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Search, User, ShoppingBag, Menu, X, Heart, ChevronRight, ChevronDown, Globe } from "lucide-react";
import { useCart } from "@/context/CartContext"; 
import { urlFor } from "@/sanity/lib/image"; 
import SearchModal from "@/components/SearchModal";
import { useCurrency } from "@/context/CurrencyContext";
import CurrencyLanguageSwitcher from "@/components/CurrencyLanguageSwitcher";
// 👇 IMPORT THE CONTEXT HOOK
import { useWishlist } from "@/context/WishlistContext";

interface NavbarClientProps {
  data: {
    logo?: any;
    menuItems: { label: string; href: string }[];
  };
}

export default function NavbarClient({ data }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  
  // 👇 USE GLOBAL CONTEXT INSTEAD OF LOCAL STATE
  const { wishlistCount } = useWishlist();

  const { cartCount, openCart } = useCart(); 
  const [mounted, setMounted] = useState(false);
  const router = useRouter(); 

  const { logo, menuItems } = data;
  const { currency, setCurrency } = useCurrency();
  const [currencyOpen, setCurrencyOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navLinks = menuItems.length > 0 ? menuItems : [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
  ];

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchTerm.trim()) {
      setIsOpen(false);
      router.push(`/shop?search=${encodeURIComponent(mobileSearchTerm)}`);
      setMobileSearchTerm("");
    }
  };


  if (!mounted) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-secondary/20">
        
        {/* TOP BAR */}
        <div className="bg-secondary text-white border-b border-gray-100 hidden sm:block relative z-[60]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-10">
              <CurrencyLanguageSwitcher mode="dark" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Complimentary Shipping on Orders Above $200
              </div>
              <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white">
                 <Link href="/login" className="hover:text-gray-200 transition-colors">Sign In/Up</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20 relative">
            
            {/* LEFT: HAMBURGER & LOGO */}
            <div className="flex items-center">
              <button 
                className="md:hidden text-primary p-1 -ml-2 mr-2"
                onClick={() => setIsOpen(true)}
              >
                <Menu size={24} strokeWidth={1.5} />
              </button>

              <div className="hidden md:block flex-shrink-0">
                <Link href="/" className="font-serif text-2xl tracking-wide text-primary font-bold flex items-center">
                  {logo ? (
                    <div className="relative w-32 h-10">
                      <Image src={urlFor(logo).url()} alt="Logo" fill className="object-contain object-left" priority />
                    </div>
                  ) : (
                    <span>TYAARA TRENDS</span>
                  )}
                </Link>
              </div>
            </div>

            {/* CENTER: MOBILE LOGO */}
            <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link href="/" className="font-serif text-xl tracking-wide text-primary font-bold block">
                  {logo ? (
                    <div className="relative w-28 h-8">
                      <Image src={urlFor(logo).url()} alt="Logo" fill className="object-contain" priority />
                    </div>
                  ) : (
                    <span>TYAARA</span>
                  )}
                </Link>
            </div>

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((item, idx) => (
                <Link key={idx} href={item.href || "/"} className="text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>

            {/* RIGHT: ICONS */}
            <div className="flex items-center gap-3 md:gap-6">
              <button onClick={() => setIsSearchOpen(true)} className="text-primary hover:text-secondary transition-colors" aria-label="Search">
                  <Search size={20} strokeWidth={1.5} />
              </button>
              <Link href="/account" className="hidden md:block text-primary hover:text-secondary transition-colors">
                <User size={20} strokeWidth={1.5} />
              </Link>
              
              {/* WISHLIST ICON WITH LIVE COUNT */}
              <Link href="/wishlist" className="hidden md:block text-primary hover:text-secondary transition-colors relative group">
                <Heart size={20} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button 
                onClick={openCart} 
                className="text-primary hover:text-secondary transition-colors relative"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-secondary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                    {cartCount}
                    </span>
                )}
            </button>
            </div>
          </div>
        </div>

        {/* MOBILE SIDEBAR */}
        <div 
            className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
            onClick={() => setIsOpen(false)}
        />
        <div className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[70] shadow-2xl transition-transform duration-300 ease-out transform flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex items-center justify-between p-6 pb-2">
                 <button onClick={() => setIsOpen(false)} className="text-black hover:text-primary transition-colors">
                    <X size={28} strokeWidth={1.5} />
                 </button>
                 <div className="w-20 h-6 relative opacity-50">
                    {logo && <Image src={urlFor(logo).url()} alt="Logo" fill className="object-contain object-right" />}
                 </div>
            </div>
            <div className="px-6 pb-6 border-b border-gray-100">
                <form onSubmit={handleMobileSearch} className="relative group">
                    <Search size={18} className="absolute left-0 top-3 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full bg-transparent border-b border-gray-200 py-2 pl-8 pr-4 text-primary outline-none focus:border-primary transition-colors placeholder:text-gray-400 text-base font-serif"
                        value={mobileSearchTerm}
                        onChange={(e) => setMobileSearchTerm(e.target.value)}
                    />
                </form>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {navLinks.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href || "/"}
                      className="flex items-center justify-between text-base font-bold text-primary hover:text-secondary group py-2 border-b border-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-secondary" />
                    </Link>
                ))}
            </div>
            <div className="px-6 py-6 bg-gray-50 border-t border-gray-100">
                <div className="flex gap-4 mb-8">
                    <Link 
                        href="/wishlist" 
                        onClick={() => setIsOpen(false)} 
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-primary hover:border-primary transition-colors"
                    >
                        <Heart size={16} /> Wishlist ({wishlistCount})
                    </Link>
                    <Link 
                        href="/login" 
                        onClick={() => setIsOpen(false)} 
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-primary hover:border-primary transition-colors"
                    >
                        <User size={16} /> Login
                    </Link>
                </div>
                {/* ...Rest of footer... */}
                <CurrencyLanguageSwitcher mode="light" position="top" />
            </div>
        </div>
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}