"use client";

import Link from "next/link";
import Image from "next/image"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { Search, User, ShoppingBag, Menu, X, Heart, ChevronRight, ChevronDown, Globe, Mail, Phone, MapPin } from "lucide-react";
import { client } from "@/sanity/lib/client"; 
import { useCart } from "@/context/CartContext"; 
import { urlFor } from "@/sanity/lib/image"; 
import SearchModal from "@/components/SearchModal";
import { useCurrency } from "@/context/CurrencyContext";
import CurrencyLanguageSwitcher from "@/components/CurrencyLanguageSwitcher";

interface NavbarClientProps {
  data: {
    logo?: any;
    menuItems: { label: string; href: string }[];
  };
}

export default function NavbarClient({ data }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  
  const { cartCount, openCart } = useCart(); 
  const [mounted, setMounted] = useState(false);
  const router = useRouter(); 

  const { logo, menuItems } = data;

  // 👇 Get Currency Data
  const { currency, setCurrency } = useCurrency();
  const [currencyOpen, setCurrencyOpen] = useState(false); // Toggle for currency dropdown

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

  useEffect(() => {
    const userId = localStorage.getItem("user_id") || localStorage.getItem("userId");
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
    const handleLocalUpdate = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail && typeof customEvent.detail.change === 'number') {
            setWishlistCount((prev) => Math.max(0, prev + customEvent.detail.change));
        }
    };
    window.addEventListener("wishlist-change", handleLocalUpdate);
    return () => {
        window.removeEventListener("wishlist-change", handleLocalUpdate);
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-secondary/20">
        
        {/* TOP BAR */}
        <div className="bg-secondary text-white border-b border-gray-100 hidden sm:block relative z-[60]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-10">
              
              {/* LEFT: Switchers */}
              <CurrencyLanguageSwitcher mode="dark" />

              {/* CENTER: Promo Text */}
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Complimentary Shipping on Orders Above $200
              </div>

              {/* RIGHT: Sign Up / Sign In */}
              <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white">
                 <Link href="/login" className="hover:text-gray-200 transition-colors">Sign In</Link>
                 <Link href="/register" className="hover:text-gray-200 transition-colors">Sign Up</Link>
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
              <Link href="/wishlist" className="hidden md:block text-primary hover:text-secondary transition-colors relative group">
                <Heart size={20} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button 
                onClick={openCart} // 👈 Triggers Drawer
                className="text-primary hover:text-secondary transition-colors relative"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {mounted && cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-secondary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                    {cartCount}
                    </span>
                )}
            </button>
            </div>
          </div>
        </div>

        {/* ================= MOBILE SIDEBAR DRAWER ================= */}
        
        {/* Overlay */}
        <div 
            className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
            onClick={() => setIsOpen(false)}
        />

        {/* The Drawer Panel */}
        <div className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-[70] shadow-2xl transition-transform duration-300 ease-out transform flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            
            {/* 1. HEADER: Close Button & Logo */}
            <div className="flex items-center justify-between p-6 pb-2">
                 {/* Close Button on LEFT (Vemus Style) */}
                 <button onClick={() => setIsOpen(false)} className="text-black hover:text-primary transition-colors">
                    <X size={28} strokeWidth={1.5} />
                 </button>
                 
                 {/* Optional: Right side could be empty or have a small logo */}
                 <div className="w-20 h-6 relative opacity-50">
                    {logo && <Image src={urlFor(logo).url()} alt="Logo" fill className="object-contain object-right" />}
                 </div>
            </div>

            {/* 2. SEARCH BAR */}
            <div className="px-6 pb-6 border-b border-gray-100">
                <form onSubmit={handleMobileSearch} className="relative group">
                    <Search size={18} className="absolute left-0 top-3 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search for anything..." 
                        className="w-full bg-transparent border-b border-gray-200 py-2 pl-8 pr-4 text-primary outline-none focus:border-primary transition-colors placeholder:text-gray-400 text-base font-serif"
                        value={mobileSearchTerm}
                        onChange={(e) => setMobileSearchTerm(e.target.value)}
                    />
                </form>
            </div>

            {/* 3. MENU LINKS (Scrollable Area) */}
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

            {/* 4. FOOTER ACTIONS (Vemus Style) */}
            <div className="px-6 py-6 bg-gray-50 border-t border-gray-100">
                
                {/* Action Buttons */}
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

                {/* Need Help Section */}
                <div className="mb-6 space-y-3">
                    <h4 className="font-serif text-lg text-primary mb-2">Need Help?</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        <MapPin size={14} /> 123 Fashion St, New York, NY
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Mail size={14} /> hello@tyaaratrends.com
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Phone size={14} /> (555) 123-4567
                    </p>
                </div>

                {/* Bottom Bar: Currency & Language */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 relative">
          
                  {/* CURRENCY SELECTOR */}
                  <div className="relative">
                      <button 
                          onClick={() => setCurrencyOpen(!currencyOpen)}
                          className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-primary uppercase"
                      >
                          {currency === "USD" && "United States (USD $)"}
                          {currency === "EUR" && "Europe (EUR €)"}
                          {currency === "GBP" && "United Kingdom (GBP £)"}
                          {currency === "INR" && "India (INR ₹)"}
                          <ChevronDown size={12} className={`transition-transform ${currencyOpen ? "rotate-180" : ""}`} />
                      </button>

                      {/* Dropdown Menu */}
                      {currencyOpen && (
                          <div className="absolute bottom-8 left-0 w-48 bg-white shadow-xl border border-gray-100 rounded-sm z-[80] animate-in slide-in-from-bottom-2 fade-in">
                              <button onClick={() => { setCurrency("USD"); setCurrencyOpen(false); }} className="block w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 text-primary">United States (USD $)</button>
                              <button onClick={() => { setCurrency("EUR"); setCurrencyOpen(false); }} className="block w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 text-primary">Europe (EUR €)</button>
                              <button onClick={() => { setCurrency("GBP"); setCurrencyOpen(false); }} className="block w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 text-primary">United Kingdom (GBP £)</button>
                              <button onClick={() => { setCurrency("INR"); setCurrencyOpen(false); }} className="block w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 text-primary">India (INR ₹)</button>
                          </div>
                      )}
                  </div>

                  <button className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-primary">
                      English <ChevronDown size={12} />
                  </button>
              </div>

            </div>

        </div>

      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}