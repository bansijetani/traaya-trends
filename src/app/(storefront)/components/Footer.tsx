"use client";

import { Facebook, Twitter, Instagram, Pin, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paymentIcons = "/images/payment-icons.png"; // Ensure this path is correct

  const footerLinks = {
    pages: [
      { name: "Home", link: "/" },
      { name: "Shop", link: "/shop" },
      { name: "Products", link: "/products" },
      { name: "About Us", link: "/about" },
      { name: "Contact", link: "/contact" },
    ],
    collections: [
      { name: "Bracelets", link: "/shop" },
      { name: "Rings", link: "/shop" },
      { name: "Necklaces", link: "/shop" },
      { name: "Earrings", link: "/shop" },
      { name: "New Arrivals", link: "/shop" },
    ],
    help: [
      { name: "FAQs", link: "/about" },
      { name: "Terms & Conditions", link: "/about" },
      { name: "Privacy Policies", link: "/about" },
      { name: "Returns", link: "/about" },
      { name: "Shipping", link: "/about" },
    ]
  };

  return (
    <footer className="bg-primary text-white pt-24 pb-12 relative overflow-hidden">
        {/* Watermark Background */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden leading-none">
           <span className="text-[150px] md:text-[280px] font-serif text-white opacity-5 whitespace-nowrap block translate-y-[30%]">TRAAYA</span>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            {/* Column 1: Brand (4 cols) */}
            <div className="md:col-span-4">
              <h2 className="font-serif text-4xl italic mb-6">Traaya Trends</h2>
              <p className="text-white/80 mb-8 font-sans text-sm leading-relaxed max-w-sm">
                Explore our curated collections designed to elevate every look, from timeless essentials to trendsetting pieces. Step in and find the perfect match for your unique style.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#4b3e35] transition-all"><Facebook size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#4b3e35] transition-all"><Instagram size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#4b3e35] transition-all"><Twitter size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#4b3e35] transition-all"><Pin size={16} /></a>
              </div>
            </div>

            {/* Links Columns (2 cols each) */}
            <div className="md:col-span-2">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Pages</h4>
              <ul className="space-y-4">
                {footerLinks.pages.map((link, i) => (
                  <li key={i}><Link href={link.link} className="text-white/70 hover:text-white transition-colors text-sm">{link.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Collections</h4>
              <ul className="space-y-4">
                {footerLinks.collections.map((link, i) => (
                  <li key={i}><Link href={link.link} className="text-white/70 hover:text-white transition-colors text-sm">{link.name}</Link></li>
                ))}
              </ul>
            </div>

            {/* Store Info (4 cols) */}
            <div className="md:col-span-4">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Store Information</h4>
              <div className="space-y-4 text-sm text-white/80 font-sans">
                <p><span className="text-white font-medium block mb-1">Email:</span> clientcare@vemus.com</p>
                <p><span className="text-white font-medium block mb-1">Phone:</span> 1.888.838.3022</p>
                <p><span className="text-white font-medium block mb-1">Address:</span> 123 Yarran st, Punchbowl, NSW 2196, Australia</p>
                <a href="#" className="inline-block border-b border-white pb-0.5 hover:text-white/70 transition-colors mt-2">Get direction →</a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/60 text-xs">All Rights Reserved 2025 TRAAYA TRENDS.</p>
            
            <div className="flex items-center gap-6">
               {/* Currency Selector (Mock) */}
               <button className="flex items-center gap-2 text-xs text-white/80 border border-white/20 px-3 py-2 rounded hover:bg-white/5 transition-colors">
                 United States (USD $) <ChevronDown size={12} />
               </button>
               
               {/* Payment Icons */}
               <img src={paymentIcons} alt="Payment Methods" className="h-5 opacity-80" />
            </div>
          </div>

        </div>

        {/* Scroll To Top Button */}
        <button 
          onClick={scrollToTop}
          className="absolute bottom-8 right-8 w-10 h-10 bg-white text-[#4b3e35] flex items-center justify-center shadow-lg hover:bg-[#A89160] hover:text-white transition-all z-20"
        >
          <ChevronUp size={20} />
        </button>
      </footer>
  );
}