"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle, ArrowRight, Printer, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  // Mock data - in a real app, you'd fetch this using the Order ID from the URL
  const [orderId, setOrderId] = useState("TY-882910");
  
  return (
    <main className="bg-white text-[#1A1A1A] min-h-screen flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center pt-[160px] pb-24 px-4 sm:px-6 max-w-4xl mx-auto w-full text-center">
        
        {/* --- SUCCESS ANIMATION ICON --- */}
        <div className="mb-8 animate-in zoom-in duration-700">
          <div className="w-24 h-24 bg-[#E9EFE3] rounded-full flex items-center justify-center mx-auto mb-6 text-[#4CAF50]">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
        </div>

        {/* --- HEADLINES --- */}
        <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-4">
          Thank you for your purchase!
        </h1>
        <p className="text-[#555] max-w-lg mx-auto mb-10 leading-relaxed">
          Your order has been confirmed. We have sent a confirmation email to 
          <span className="font-bold text-[#1A1A1A] mx-1">customer@example.com</span> 
          with your order details.
        </p>

        {/* --- ORDER META DATA --- */}
        <div className="bg-[#F9F9F9] border border-[#E5E5E5] w-full p-8 rounded-sm mb-12 flex flex-col md:flex-row justify-between gap-8 text-left">
          
          {/* Order Number */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#888] block mb-2">Order Number</span>
            <span className="text-xl font-serif text-[#1A1A1A]">#{orderId}</span>
          </div>

          {/* Date */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#888] block mb-2 flex items-center gap-2">
              <Calendar size={12}/> Date
            </span>
            <span className="text-sm font-medium text-[#1A1A1A]">March 3rd, 2025</span>
          </div>

          {/* Shipping */}
          <div>
             <span className="text-xs font-bold uppercase tracking-widest text-[#888] block mb-2 flex items-center gap-2">
              <MapPin size={12}/> Shipping To
            </span>
            <span className="text-sm font-medium text-[#1A1A1A]">New York, USA</span>
          </div>

          {/* Total */}
          <div>
             <span className="text-xs font-bold uppercase tracking-widest text-[#888] block mb-2">Total Amount</span>
            <span className="text-xl font-bold text-[#B87E58]">$3,370.00</span>
          </div>
        </div>

        {/* --- ORDER SUMMARY (Visual) --- */}
        <div className="w-full text-left mb-12">
            <h3 className="font-serif text-xl mb-6 pb-2 border-b border-[#E5E5E5]">What you ordered</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {/* Product 1 */}
                <div className="min-w-[280px] flex gap-4 p-4 border border-[#E5E5E5] bg-white">
                    <div className="w-20 h-20 bg-[#F9F9F9] shrink-0 p-1">
                        <img src="/images/product-1.jpg" alt="Ring" className="w-full h-full object-contain mix-blend-multiply"/>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#1A1A1A] line-clamp-1 mb-1">Emerald-cut Halo Engagement Ring</h4>
                        <p className="text-xs text-[#888] mb-2">Rose Gold / 50</p>
                        <p className="text-sm font-medium">$3,370.00</p>
                    </div>
                </div>
                 {/* Product 2 (Mock) */}
                 <div className="min-w-[280px] flex gap-4 p-4 border border-[#E5E5E5] bg-white">
                    <div className="w-20 h-20 bg-[#F9F9F9] shrink-0 p-1">
                        <img src="/images/product-2.jpg" alt="Charm" className="w-full h-full object-contain mix-blend-multiply"/>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#1A1A1A] line-clamp-1 mb-1">Crystal Birthstone Charm</h4>
                        <p className="text-xs text-[#888] mb-2">Silver</p>
                        <p className="text-sm font-medium">$2,499.00</p>
                    </div>
                </div>
            </div>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <Link href="/shop" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto h-14 px-10 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B87E58] transition-colors flex items-center justify-center gap-2">
               Continue Shopping <ArrowRight size={16} />
            </button>
          </Link>
          
          <button className="w-full sm:w-auto h-14 px-10 border border-[#E5E5E5] text-[#1A1A1A] text-xs font-bold uppercase tracking-[0.2em] hover:border-[#1A1A1A] transition-colors flex items-center justify-center gap-2">
            <Printer size={16} /> Print Receipt
          </button>
        </div>

      </div>

      <Footer />
    </main>
  );
}