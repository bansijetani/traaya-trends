"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle, ArrowRight, Printer, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Retrieve the order we just saved
    const data = localStorage.getItem("latestOrder");
    
    if (data) {
      setOrder(JSON.parse(data));
      // Optional: Clear the 'latestOrder' after showing it so refreshing doesn't show it again? 
      // For now, we keep it so the user can refresh and still see their receipt.
    } else {
      // 2. If no order data exists, redirect to home (prevent direct access)
      router.push("/");
    }
  }, [router]);

  // Prevent rendering until we have data
  if (!order) return null;

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
          <span className="font-bold text-[#1A1A1A] mx-1">{order.email}</span> 
          with your order details.
        </p>

        {/* --- ORDER META DATA --- */}
        <div className="bg-[#F9F9F9] border border-[#E5E5E5] w-full p-8 rounded-sm mb-12 flex flex-col md:flex-row justify-between gap-8 text-left">
          
          {/* Order Number */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#888] block mb-2">Order Number</span>
            <span className="text-xl font-serif text-[#1A1A1A]">#{order.orderNumber}</span>
          </div>

          {/* Date */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#888] block mb-2 flex items-center gap-2">
              <Calendar size={12}/> Date
            </span>
            <span className="text-sm font-medium text-[#1A1A1A]">{order.date}</span>
          </div>

          {/* Shipping */}
          <div>
             <span className="text-xs font-bold uppercase tracking-widest text-[#888] block mb-2 flex items-center gap-2">
              <MapPin size={12}/> Shipping To
            </span>
            <span className="text-sm font-medium text-[#1A1A1A] max-w-[150px] truncate" title={order.address}>
              {order.address}
            </span>
          </div>

          {/* Total */}
          <div>
             <span className="text-xs font-bold uppercase tracking-widest text-[#888] block mb-2">Total Amount</span>
            <span className="text-xl font-bold text-[#B87E58]">${order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* --- ORDER SUMMARY (Dynamic) --- */}
        <div className="w-full text-left mb-12">
            <h3 className="font-serif text-xl mb-6 pb-2 border-b border-[#E5E5E5]">What you ordered</h3>
            
            {/* Horizontal Scroll Container */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {order.items.map((item: any) => (
                  <div key={item.id} className="min-w-[280px] flex gap-4 p-4 border border-[#E5E5E5] bg-white">
                      <div className="w-20 h-20 bg-[#F9F9F9] shrink-0 p-1 relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply"/>
                          <span className="absolute -top-2 -right-2 bg-[#1A1A1A] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                            {item.quantity}
                          </span>
                      </div>
                      <div className="overflow-hidden">
                          <h4 className="text-sm font-bold text-[#1A1A1A] line-clamp-1 mb-1">{item.name}</h4>
                          <p className="text-xs text-[#888] mb-2">{item.id}</p> {/* Using ID or slug as generic detail */}
                          <p className="text-sm font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                  </div>
                ))}
            </div>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <Link href="/shop" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto h-14 px-10 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B87E58] transition-colors flex items-center justify-center gap-2">
               Continue Shopping <ArrowRight size={16} />
            </button>
          </Link>
          
          <button 
            onClick={() => window.print()}
            className="w-full sm:w-auto h-14 px-10 border border-[#E5E5E5] text-[#1A1A1A] text-xs font-bold uppercase tracking-[0.2em] hover:border-[#1A1A1A] transition-colors flex items-center justify-center gap-2"
          >
            <Printer size={16} /> Print Receipt
          </button>
        </div>

      </div>

      <Footer />
    </main>
  );
}