"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Price from "@/components/Price";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Calendar, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// Define a more robust type that handles potential nulls
interface OrderItem {
  _key: string;
  quantity: number;
  price: number;
  product?: { // Make product optional in case of broken reference
    name?: string;
    image?: any;
    price?: number;
    slug?: { current: string };
  } | null;
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
  phone: string;
  products: OrderItem[];
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const query = `*[_type == "order" && _id == $id][0]{
          _id,
          orderNumber,
          _createdAt,
          status,
          totalPrice,
          "customerName": customer->name,
          "email": customer->email,
          "address": address, 
          "phone": customer->phone,
          products[]{
            _key,
            quantity,
            price,
            product->{
              name,
              price,
              "image": images[0],
              slug
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
        <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="font-serif text-2xl text-primary mb-4">Order Not Found</h1>
        <Link href="/account" className="text-secondary underline text-sm uppercase tracking-widest">Return to Account</Link>
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

  return (
    <div className="bg-white text-primary min-h-screen font-sans pt-32 md:pt-40 pb-20 px-6">
      
      {/* --- HEADER --- */}
      <div className="max-w-[1000px] mx-auto mb-12">
        <Link href="/account" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Orders
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
            <div>
                <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">Order Details</span>
                <h1 className="font-serif text-3xl md:text-4xl text-primary">#{order.orderNumber}</h1>
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
            <h2 className="font-serif text-xl text-primary mb-6 flex items-center gap-2">
                <Package size={18} className="text-gray-400" /> Items Ordered
            </h2>
            
            <div className="border border-gray-100 divide-y divide-gray-100">
                {(!order.products || order.products.length === 0) ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        No items data found for this order.
                    </div>
                ) : (
                    order.products.map((item) => {
                        // Check if product exists (it might be null if deleted from Sanity)
                        const productExists = !!item.product;
                        
                        return (
                            <div key={item._key} className="p-6 flex gap-6 items-center group">
                                {/* Image */}
                                <div className="relative w-20 h-24 bg-[#F9F9F9] shrink-0 overflow-hidden flex items-center justify-center">
                                    {productExists && item.product?.image ? (
                                        <Image 
                                            src={urlFor(item.product.image).url()} 
                                            alt={item.product.name || "Product"} 
                                            fill 
                                            className="object-cover mix-blend-multiply" 
                                        />
                                    ) : (
                                        <Package size={24} className="text-gray-300" />
                                    )}
                                </div>
                                
                                {/* Details */}
                                <div className="flex-1">
                                    {productExists ? (
                                        <h3 className="font-serif text-lg text-primary mb-1">
                                            <Link href={`/product/${item.product?.slug?.current}`} className="hover:text-secondary transition-colors">
                                                {item.product?.name}
                                            </Link>
                                        </h3>
                                    ) : (
                                        <h3 className="font-serif text-lg text-gray-400 mb-1 italic flex items-center gap-2">
                                            Product Unavailable <AlertCircle size={14}/>
                                        </h3>
                                    )}
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Qty: {item.quantity}</p>
                                </div>
                                
                                {/* Price */}
                                <div className="text-right font-medium text-secondary">
                                    <Price amount={item.price * item.quantity} />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>

        {/* --- RIGHT: SUMMARY & INFO --- */}
        <div className="space-y-8">
            
            {/* Order Summary Card */}
            <div className="bg-gray-50 p-8 border border-gray-100">
                <h3 className="font-serif text-lg text-primary mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-sm border-b border-gray-200 pb-6 mb-6">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span><Price amount={order.totalPrice} /></span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">Free</span>
                    </div>
                </div>
                
                <div className="flex justify-between text-lg font-serif text-primary">
                    <span>Total</span>
                    <span className="font-bold"><Price amount={order.totalPrice} /></span>
                </div>
            </div>

            {/* Shipping Details */}
            <div className="border border-gray-100 p-8">
                <h3 className="font-serif text-lg text-primary mb-6 flex items-center gap-2">
                    <Truck size={18} className="text-gray-400" /> Delivery Details
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Date Placed</span>
                        <div className="flex items-center gap-2 text-sm text-primary">
                            <Calendar size={14} className="text-secondary" />
                            {new Date(order._createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Shipping Address</span>
                        <div className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                            <MapPin size={14} className="text-secondary mt-1 shrink-0" />
                            <div>
                                <p className="font-bold text-primary mb-1">{order.customerName}</p>
                                <p>{order.email}</p>
                                <p className="mt-2 text-gray-500">{order.address}</p>
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