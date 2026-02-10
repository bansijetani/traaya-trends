"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "next-sanity";
import { Check, Printer, ArrowRight, Loader2, ShoppingBag, MapPin, Calendar, Mail } from "lucide-react";
import Price from "@/components/Price";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  useCdn: true,
});

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;

    const fetchOrder = async () => {
      try {
        const query = `*[_type == "order" && orderNumber == $orderNumber][0]{
          _id,
          orderNumber,
          customerName,
          email,
          orderDate,
          shippingAddress,
          totalPrice,
          discount,
          items[]{
            productName,
            quantity,
            price,
            "image": product->images[0].asset->url 
          }
        }`;

        const data = await client.fetch(query, { orderNumber });
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="font-serif text-lg text-primary animate-pulse">Retrieving your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <span className="text-red-500 text-3xl font-serif">!</span>
        </div>
        <h1 className="font-serif text-3xl text-primary mb-4">Order Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't locate the order details. Please check your email for confirmation.</p>
        <Link href="/" className="bg-primary text-white px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-secondary transition-all">
            Return Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; background: white; color: black; }
          .no-print { display: none !important; }
          .print-grid { display: block !important; }
          .print-col { width: 100% !important; margin-bottom: 20px; }
          .print-clean { background: none !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
          p, h1, h2, h3, h4, span { color: black !important; }
        }
      `}</style>

      {/* 👇 RESPONSIVE PADDING FIXED:
          Mobile: pt-28 pb-10 (Tighter)
          Desktop: pt-48 pb-20 (Spacious)
      */}
      <div className="min-h-screen bg-white pt-28 pb-10 md:pt-48 md:pb-20 px-4 md:px-6 font-sans text-[#1A1A1A]">
        
        <div id="print-area" className="max-w-[1000px] mx-auto">
          
          {/* Header Section: Reduced bottom margin on mobile */}
          <div className="text-center mb-10 md:mb-16 animate-in fade-in zoom-in duration-700">
              <div className="no-print inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-full mb-4 md:mb-6 border border-green-100 shadow-sm">
                  <Check size={32} className="text-green-700 md:w-10 md:h-10" strokeWidth={1.5} />
              </div>
              
              <div className="hidden print:block text-center mb-8">
                  <h1 className="font-serif text-3xl uppercase tracking-widest font-bold">TRAAYA TRENDS</h1>
                  <p className="text-xs uppercase tracking-wide">Official Order Receipt</p>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl text-primary mb-3 md:mb-4 no-print">Thank you, {order.customerName.split(' ')[0]}!</h1>
              <p className="text-gray-500 max-w-lg mx-auto text-xs md:text-base leading-relaxed no-print px-4">
                  Your order <span className="font-bold text-primary">#{order.orderNumber}</span> has been confirmed. 
                  We have sent a confirmation email to <span className="text-primary underline">{order.email}</span>.
              </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start print-grid">
              
              {/* ================= LEFT: ORDER DETAILS ================= */}
              <div className="lg:col-span-7 space-y-6 md:space-y-8 print-col">
                  
                  {/* Information Card */}
                  <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-sm shadow-sm relative overflow-hidden print-clean">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary no-print"></div>
                      
                      <div className="flex justify-between items-baseline mb-6 border-b border-gray-100 pb-4">
                        <h3 className="font-serif text-lg md:text-xl text-primary">Order Details</h3>
                        <span className="text-[10px] md:text-xs font-bold text-gray-400">#{order.orderNumber}</span>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                          <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                  <MapPin size={16} className="text-secondary mt-1 shrink-0 no-print" />
                                  <div>
                                      <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Shipping To</p>
                                      <p className="text-xs md:text-sm text-primary font-medium leading-relaxed">
                                          {order.customerName}<br/>
                                          {order.shippingAddress}
                                      </p>
                                  </div>
                              </div>
                              <div className="flex items-start gap-3">
                                  <Mail size={16} className="text-secondary mt-1 shrink-0 no-print" />
                                  <div>
                                      <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email</p>
                                      <p className="text-xs md:text-sm text-primary font-medium break-all">{order.email}</p>
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                  <Calendar size={16} className="text-secondary mt-1 shrink-0 no-print" />
                                  <div>
                                      <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Date</p>
                                      <p className="text-xs md:text-sm text-primary font-medium">
                                          {new Date(order.orderDate).toLocaleDateString("en-US", { 
                                              year: 'numeric', month: 'long', day: 'numeric' 
                                          })}
                                      </p>
                                  </div>
                              </div>
                              <div className="flex items-start gap-3">
                                  <ShoppingBag size={16} className="text-secondary mt-1 shrink-0 no-print" />
                                  <div>
                                      <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Order Status</p>
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100 print-clean">
                                          Processing
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Actions (Hidden in Print) */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 no-print">
                      <Link href="/shop" className="flex-1 order-2 sm:order-1">
                          <button className="w-full py-3 md:py-4 bg-primary text-white text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-colors shadow-md flex items-center justify-center gap-2 group">
                              <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={14} />
                              Continue Shopping
                          </button>
                      </Link>
                      <button 
                          onClick={() => window.print()} 
                          className="flex-1 order-1 sm:order-2 py-3 md:py-4 bg-white border border-gray-200 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                          <Printer size={14} /> Print Receipt
                      </button>
                  </div>
              </div>

              {/* ================= RIGHT: ORDER SUMMARY ================= */}
              <div className="lg:col-span-5 print-col">
                  <div className="bg-[#F9F9F9] p-6 md:p-8 rounded-sm sticky top-32 print-clean">
                      <h3 className="font-serif text-lg md:text-xl text-primary mb-6 pb-4 border-b border-gray-200">Order Summary</h3>
                      
                      <div className="space-y-4 md:space-y-5 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 mb-6 md:mb-8 scrollbar-thin scrollbar-thumb-gray-200 print-clean print:max-h-none print:overflow-visible">
                          {order.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-3 md:gap-4 items-center">
                                  <div className="relative w-14 h-16 md:w-16 md:h-20 bg-white rounded-sm overflow-hidden flex-shrink-0 border border-gray-100 print-clean">
                                      {item.image ? (
                                          <Image src={item.image} alt={item.productName} fill className="object-cover" />
                                      ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-[10px] text-gray-300">Img</div>
                                      )}
                                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 md:w-5 md:h-5 bg-gray-600 text-white text-[9px] md:text-[10px] font-bold flex items-center justify-center rounded-full z-10 border border-white no-print">
                                          {item.quantity}
                                      </span>
                                  </div>
                                  <div className="flex-1">
                                      <h4 className="font-serif text-sm text-primary line-clamp-2 leading-tight">{item.productName}</h4>
                                      <p className="text-[10px] text-gray-400 mt-1 uppercase">Qty: {item.quantity}</p>
                                  </div>
                                  <div className="font-medium text-xs md:text-sm text-primary">
                                      <Price amount={item.price * item.quantity} />
                                  </div>
                              </div>
                          ))}
                      </div>

                      <div className="space-y-2 md:space-y-3 pt-4 md:pt-6 border-t border-gray-200 text-xs md:text-sm text-gray-600">
                          <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span className="font-medium text-primary"><Price amount={order.totalPrice + (order.discount || 0)} /></span>
                          </div>
                          {order.discount > 0 && (
                              <div className="flex justify-between text-green-700">
                                  <span>Discount</span>
                                  <span className="font-medium">-<Price amount={order.discount} /></span>
                              </div>
                          )}
                           <div className="flex justify-between">
                              <span>Shipping</span>
                              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-green-600">Free</span>
                          </div>
                      </div>

                      <div className="flex justify-between items-baseline pt-4 mt-4 border-t border-gray-200">
                          <span className="font-serif text-base md:text-lg text-primary">Total Paid</span>
                          <span className="font-serif text-xl md:text-2xl text-primary font-bold">
                              <Price amount={order.totalPrice} />
                          </span>
                      </div>

                  </div>
              </div>

          </div>
          
          <div className="hidden print:block mt-12 text-center text-xs text-gray-500 pt-8 border-t border-gray-100">
              <p>Thank you for choosing Traaya Trends.</p>
              <p>For support, contact us at support@traayatrends.com</p>
          </div>

        </div>
      </div>
    </>
  );
}