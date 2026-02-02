"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle, ArrowRight, Printer, MapPin, Calendar, TicketPercent, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react"; // 👈 Added Suspense
import { useSearchParams, useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";

// 👇 1. Move all your logic into this Sub-Component
function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const [order, setOrder] = useState<any>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!orderNumber) {
        // If no order number, wait a tick then redirect (avoids hydration mismatch)
        const timeout = setTimeout(() => router.push("/"), 100);
        return () => clearTimeout(timeout);
    }

    // Security Check: Did this browser place the order?
    const storedOrder = typeof window !== 'undefined' ? localStorage.getItem("latest_order_id") : null;
    if (storedOrder === orderNumber) {
        setIsVerified(true);
    }

    const fetchData = async () => {
      try {
        const query = `{
            "order": *[_type == "order" && orderNumber == $orderNumber][0]{
                orderNumber,
                orderDate,
                customerName,
                email,
                shippingAddress,
                totalPrice,
                discount,
                couponCode,
                items[]{
                    quantity,
                    product->{
                        name,
                        price,
                        "image": images[0].asset->url,
                        _id
                    }
                }
            },
            "settings": *[_type in ["settings", "themeSettings", "siteSettings"]][0]{ 
                "logo": logo.asset->url 
            }
        }`;
        
        const data = await client.fetch(query, { orderNumber });
        
        if (data.order) {
            setOrder(data.order);
        }
        if (data.settings?.logo) {
            setLogoUrl(data.settings.logo);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderNumber, router]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-[#1A1A1A]">
            <Loader2 className="animate-spin" /> Loading Receipt...
        </div>
    </div>
  );

  if (!order) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[50vh]">
        <h1 className="text-2xl font-serif text-red-500">Order Not Found</h1>
        <Link href="/" className="underline text-sm hover:text-[#B87E58]">Return Home</Link>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-[160px] pb-24 px-4 sm:px-6 max-w-4xl mx-auto w-full text-center print:pt-4 print:pb-4 print:px-0 print:max-w-full">
        
        {/* LOGO: Print Only */}
        {logoUrl && (
            <div className="hidden print:block mb-6 w-full text-center">
                <img src={logoUrl} alt="Brand Logo" className="mx-auto w-32 object-contain" />
            </div>
        )}

        {/* SUCCESS ICON */}
        <div className="mb-8 animate-in zoom-in duration-700 print:hidden">
          <div className="w-24 h-24 bg-[#E9EFE3] rounded-full flex items-center justify-center mx-auto mb-6 text-[#4CAF50]">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
        </div>

        {/* Headlines */}
        <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-4 print:text-2xl">
          Thank you for your purchase!
        </h1>
        <p className="text-[#555] max-w-lg mx-auto mb-10 leading-relaxed print:text-sm print:mb-6">
          Your order has been confirmed. We have sent a confirmation email to 
          <span className="font-bold text-[#1A1A1A] mx-1">
             {isVerified ? order.email : "********@****.com"}
          </span> 
          with your order details.
        </p>

        {/* ORDER META DATA */}
        <div className="bg-[#F9F9F9] border border-[#E5E5E5] w-full p-8 rounded-sm mb-12 flex flex-col md:flex-row justify-between gap-8 text-left print:bg-white print:border-none print:p-0 print:mb-6 print:grid print:grid-cols-2 print:gap-4">
          
          {/* Order Number */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#888] block mb-2">Order Number</span>
            <span className="text-xl font-serif text-[#1A1A1A] print:text-base">{order.orderNumber}</span>
          </div>

          {/* Date */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#888] block mb-2 flex items-center gap-2">
              <Calendar size={12} className="print:hidden"/> Date
            </span>
            <span className="text-sm font-medium text-[#1A1A1A]">
                {new Date(order.orderDate).toLocaleDateString()}
            </span>
          </div>

          {/* Shipping */}
          <div>
             <span className="text-xs font-bold uppercase tracking-widest text-[#888] block mb-2 flex items-center gap-2">
              <MapPin size={12} className="print:hidden"/> Shipping To
            </span>
            {isVerified ? (
                <span className="text-sm font-medium text-[#1A1A1A] max-w-[200px] block print:max-w-full">
                  {order.shippingAddress}
                </span>
            ) : (
                <span className="text-sm font-medium text-gray-400 italic flex items-center gap-1">
                    <Lock size={12} /> Hidden for privacy
                </span>
            )}
          </div>

          {/* Total */}
          <div className="space-y-1">
             <span className="text-xs font-bold uppercase tracking-widest text-[#888] block mb-2">Total Amount</span>
             
             {order.discount > 0 && (
                 <div className="text-xs text-gray-400 line-through">
                     ${(order.totalPrice + order.discount).toLocaleString()}
                 </div>
             )}
             
             <span className="text-xl font-bold text-[#B87E58] block print:text-[#1A1A1A] print:text-lg">
                ${order.totalPrice.toLocaleString()}
             </span>

             {order.discount > 0 && (
                 <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wide mt-1 print:bg-transparent print:text-green-700 print:p-0">
                     <TicketPercent size={10} className="print:hidden" /> Saved ${order.discount}
                 </span>
             )}
          </div>
        </div>

        {/* Items */}
        <div className="w-full text-left mb-12 print:mb-0">
            <h3 className="font-serif text-xl mb-6 pb-2 border-b border-[#E5E5E5] print:text-lg print:mb-4">What you ordered</h3>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide print:flex-col print:gap-0 print:overflow-visible">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="min-w-[280px] flex gap-4 p-4 border border-[#E5E5E5] bg-white print:border-0 print:border-b print:px-0 print:py-2 print:w-full">
                      
                      {/* Image */}
                      <div className="w-20 h-20 bg-[#F9F9F9] shrink-0 p-1 relative print:hidden">
                          {item.product?.image ? (
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply"/>
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                          <span className="absolute -top-2 -right-2 bg-[#1A1A1A] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                            {item.quantity}
                          </span>
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex-1 flex justify-between items-center print:flex-row">
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-bold text-[#1A1A1A] line-clamp-1 mb-1 print:text-sm">{item.product?.name}</h4>
                            <p className="hidden print:block text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium print:text-sm print:font-bold">${(item.product?.price * item.quantity).toLocaleString()}</p>
                      </div>
                  </div>
                ))}
            </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full print:hidden">
          <Link href="/products" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto h-14 px-10 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B87E58] transition-colors flex items-center justify-center gap-2">
               Continue Shopping <ArrowRight size={16} />
            </button>
          </Link>
          
          {isVerified && (
            <button 
                onClick={() => window.print()}
                className="w-full sm:w-auto h-14 px-10 border border-[#E5E5E5] text-[#1A1A1A] text-xs font-bold uppercase tracking-[0.2em] hover:border-[#1A1A1A] transition-colors flex items-center justify-center gap-2"
            >
                <Printer size={16} /> Print Receipt
            </button>
          )}
        </div>
    </div>
  );
}

// 👇 2. Main Page Component (Wraps content in Suspense)
export default function OrderSuccessPage() {
  return (
    <main className="bg-white text-[#1A1A1A] min-h-screen flex flex-col font-sans print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
             <div className="flex items-center gap-3 text-[#1A1A1A]">
                <Loader2 className="animate-spin" /> Loading Order...
            </div>
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>

      <div className="print:hidden">
        <Footer />
      </div>
    </main>
  );
}