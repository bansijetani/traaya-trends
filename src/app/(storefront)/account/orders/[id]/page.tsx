"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Price from "@/components/Price";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Calendar, Truck, CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// Updated Interface to match your flat Order Schema
interface OrderItem {
  _key: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  slug?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  _createdAt: string;
  status: string;
  totalPrice: number;
  customerName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // --- HELPER: Return Eligibility Logic (14 DAYS) ---
  const checkReturnEligibility = (orderDate: string, orderStatus: string) => {
    if (!orderStatus || orderStatus.toLowerCase() !== 'delivered') return false;
    
    const deliveryDate = new Date(orderDate); 
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - deliveryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 14; 
  };

  const getReturnWindowDate = (orderDate: string) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 14); 
    return date.toLocaleDateString("en-IN", { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // FIXED QUERY: Matches your schema exactly and dynamically fetches product slug
        const query = `*[_type == "order" && _id == $id][0]{
          _id,
          orderNumber,
          _createdAt,
          status,
          "totalPrice": total,
          "customerName": firstName + " " + lastName,
          email,
          address, 
          city,
          zipCode,
          phone,
          "items": items[]{
            _key,
            name,
            quantity,
            price,
            image,
            "slug": *[_type == "product" && name == ^.name][0].slug.current
          }
        }`;
        
        const data = await client.fetch(query, { id });
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#3A4D39]" size={40} />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="font-serif text-2xl text-[#3A4D39] mb-4">Order Not Found</h1>
        <Link href="/account" className="text-gray-500 underline text-sm uppercase tracking-widest hover:text-[#3A4D39]">
          Return to Account
        </Link>
    </div>
  );

  const getStatusStyle = (status: string) => {
    switch(status?.toLowerCase()) {
        case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
        case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
        default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const isReturnable = checkReturnEligibility(order._createdAt, order.status);
  const returnDeadline = getReturnWindowDate(order._createdAt);

  return (
    <div className="bg-white text-[#1A1A1A] min-h-screen font-sans pt-32 md:pt-40 pb-20 px-6">
      
      {/* --- HEADER --- */}
      <div className="max-w-[1000px] mx-auto mb-12">
        <Link href="/account" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#3A4D39] transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Orders
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
            <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Order Details</span>
                <h1 className="font-serif text-3xl md:text-4xl text-[#3A4D39]">#{order.orderNumber}</h1>
            </div>
            <div className={`px-4 py-2 rounded-sm border inline-flex items-center gap-2 ${getStatusStyle(order.status)}`}>
                {order.status === 'delivered' ? <CheckCircle size={14}/> : order.status === 'processing' ? <Loader2 size={14} className="animate-spin"/> : <Clock size={14}/>}
                <span className="text-[10px] font-bold uppercase tracking-widest">{order.status || 'Pending'}</span>
            </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* --- LEFT: ITEMS LIST --- */}
        <div className="lg:col-span-2 space-y-8">
            <h2 className="font-serif text-xl text-[#3A4D39] mb-6 flex items-center gap-2">
                <Package size={18} className="text-gray-400" /> Items Ordered
            </h2>
            
            <div className="border border-gray-100 divide-y divide-gray-100">
                {(!order.items || order.items.length === 0) ? (
                    <div className="p-8 text-center text-gray-400 text-sm italic">
                        No items data found for this order.
                    </div>
                ) : (
                    order.items.map((item, idx) => (
                        <div key={idx} className="p-6 flex gap-6 items-start group hover:bg-gray-50 transition-colors">
                            {/* Image (Clickable if slug exists) */}
                            <div className="relative w-20 h-24 bg-[#F9F9F9] shrink-0 overflow-hidden flex items-center justify-center border border-gray-100">
                                {item.slug ? (
                                    <Link href={`/product/${item.slug}`} className="w-full h-full block">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><Package size={24} className="text-gray-300" /></div>
                                        )}
                                    </Link>
                                ) : (
                                    item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                                    ) : (
                                        <Package size={24} className="text-gray-300" />
                                    )
                                )}
                            </div>
                            
                            {/* Details (Clickable if slug exists) */}
                            <div className="flex-1">
                                {item.slug ? (
                                    <h3 className="font-serif text-lg text-[#3A4D39] mb-1">
                                        <Link href={`/product/${item.slug}`} className="hover:underline decoration-1 underline-offset-2 transition-all">
                                            {item.name || "Unknown Product"}
                                        </Link>
                                    </h3>
                                ) : (
                                    <h3 className="font-serif text-lg text-[#3A4D39] mb-1">{item.name || "Unknown Product"}</h3>
                                )}
                                
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Qty: {item.quantity}</p>

                                {/* ITEM-LEVEL RETURN ACTION */}
                                {isReturnable ? (
                                  <Link 
                                    href={`/returns?orderId=${order.orderNumber}&item=${encodeURIComponent(item.name)}`} 
                                    className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-bold uppercase tracking-widest text-[#3A4D39] hover:underline"
                                  >
                                    <RefreshCw size={12} /> Return Item
                                  </Link>
                                ) : (
                                  order.status === 'delivered' && (
                                    <span className="flex items-center gap-1 mt-3 text-[10px] text-gray-400">
                                      <AlertCircle size={10} /> Return closed {returnDeadline}
                                    </span>
                                  )
                                )}
                            </div>
                            
                            {/* Price */}
                            <div className="text-right font-medium text-gray-900">
                                <Price amount={item.price * item.quantity} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* --- RIGHT: SUMMARY & INFO --- */}
        <div className="space-y-8">
            
            {/* Order Summary Card */}
            <div className="bg-gray-50 p-8 border border-gray-100 rounded-sm">
                <h3 className="font-serif text-lg text-[#3A4D39] mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-sm border-b border-gray-200 pb-6 mb-6">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span><Price amount={order.totalPrice} /></span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="text-[#3A4D39] font-bold uppercase text-[10px] tracking-widest">Free</span>
                    </div>
                </div>
                
                <div className="flex justify-between text-lg font-bold text-[#3A4D39]">
                    <span>Total</span>
                    <span><Price amount={order.totalPrice} /></span>
                </div>
            </div>

            {/* Shipping Details */}
            <div className="border border-gray-100 p-8 rounded-sm">
                <h3 className="font-serif text-lg text-[#3A4D39] mb-6 flex items-center gap-2">
                    <Truck size={18} className="text-gray-400" /> Delivery Details
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Date Placed</span>
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(order._createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Shipping Address</span>
                        <div className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                            <MapPin size={14} className="text-gray-400 mt-1 shrink-0" />
                            <div>
                                <p className="font-bold text-gray-900 mb-1">{order.customerName}</p>
                                <p>{order.email}</p>
                                <p className="mt-2 text-gray-500">
                                  {order.address}<br/>
                                  {order.city && order.zipCode ? `${order.city}, ${order.zipCode}` : ""}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}