"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Package, Loader2, Tag, Phone, Mail, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderDetail {
  _id: string;
  orderNumber: string;
  _createdAt: string;
  status: string;
  totalPrice: number;
  shippingAddress: string;
  discount: number;
  couponCode: string;
  // 👇 These are the direct fields from your database snapshot
  customerName: string;
  email: string;
  phone: string;
  items: {
    quantity: number;
    price: number;
    product: {
      title?: string;
      name?: string;
      image: string;
    };
  }[];
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // 👇 FIXED QUERY: Fetches name/phone/email directly from the order document
        const query = `*[_type == "order" && _id == $id][0]{
          _id,
          orderNumber,
          _createdAt,
          status,
          totalPrice,
          shippingAddress,
          discount,
          couponCode,
          
          // 👇 Fetch these directly (Snapshot data)
          customerName, 
          email, 
          phone,

          items[]{
            quantity,
            price, 
            product->{
              title,
              name,
              "image": coalesce(image.asset->url, images[0].asset->url, "https://placehold.co/100x100?text=No+Image")
            }
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
        <Loader2 className="animate-spin text-[#B87E58]" size={32} />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif mb-4">Order Not Found</h1>
        <Link href="/account" className="text-sm underline hover:text-[#B87E58]">Back to Account</Link>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-[#E9EFE3] text-[#4CAF50]';
      case 'cancelled': return 'bg-red-50 text-red-500';
      default: return 'bg-[#FFF4E5] text-[#B87E58]';
    }
  };

  const subtotal = order.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

  return (
    <main className="bg-[#F9F9F9] min-h-screen font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-[140px] pb-20">
        
        <div className="mb-8">
            <Link href="/account" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#888] hover:text-black transition-colors mb-4">
                <ArrowLeft size={14} /> Back to Orders
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-2">
                        Order #{order.orderNumber || order._id.slice(0, 8)}
                    </h1>
                    <p className="text-sm text-[#666]">
                        Placed on {new Date(order._createdAt).toLocaleDateString()}
                    </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider h-fit w-fit ${getStatusColor(order.status)}`}>
                    {order.status || 'Processing'}
                </span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: PRODUCTS */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-[#E5E5E5] flex items-center gap-2 bg-gray-50">
                        <Package size={18} className="text-[#B87E58]" />
                        <h2 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A]">Items Ordered</h2>
                    </div>
                    
                    <div className="divide-y divide-[#E5E5E5]">
                        {order.items && order.items.map((item, idx) => {
                            const product = item.product || {};
                            const productName = product.title || product.name || "Product Unavailable";
                            
                            return (
                                <div key={idx} className="p-6 flex gap-6 items-center">
                                    <div className="w-20 h-20 bg-[#F9F9F9] border border-[#E5E5E5] relative shrink-0 flex items-center justify-center">
                                        <Image 
                                            src={product.image} 
                                            alt={productName}
                                            fill
                                            className="object-contain p-2 mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">
                                            {productName}
                                        </h3>
                                        <p className="text-xs text-[#888] mb-2">Quantity: {item.quantity}</p>
                                        <p className="font-bold text-sm text-[#B87E58]">
                                            ${(item.price || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#1A1A1A]">
                                            ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: INFO */}
            <div className="space-y-6">
                <div className="bg-white border border-[#E5E5E5] rounded-lg p-6">
                    <h2 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A] mb-6">Order Summary</h2>
                    <div className="space-y-3 text-sm text-[#666] border-b border-[#E5E5E5] pb-4 mb-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        
                        {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span className="flex items-center gap-1">
                                    <Tag size={12} /> 
                                    Discount {order.couponCode ? `(${order.couponCode})` : ''}
                                </span>
                                <span>-${order.discount.toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between font-serif text-xl text-[#1A1A1A]">
                        <span>Total</span>
                        <span>${(order.totalPrice || 0).toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-white border border-[#E5E5E5] rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin size={18} className="text-[#B87E58]" />
                        <h2 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A]">Shipping Details</h2>
                    </div>
                    
                    {/* 👇 UPDATED ADDRESS SECTION: Uses Direct Fields */}
                    <div className="space-y-3 text-sm text-[#666]">
                        <div className="flex items-center gap-3">
                            <User size={16} className="text-[#B87E58]" />
                            <span className="text-black font-bold">{order.customerName || "Guest User"}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Mail size={16} className="text-[#B87E58]" />
                            <span>{order.email}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone size={16} className="text-[#B87E58]" />
                            <span>{order.phone || "No Phone Provided"}</span>
                        </div>

                        <div className="pt-3 mt-3 border-t border-gray-100">
                            <p className="leading-relaxed">
                                {order.shippingAddress || "(No shipping address recorded)"}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}