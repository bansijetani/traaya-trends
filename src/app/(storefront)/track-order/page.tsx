"use client";

import { useState } from "react";
import { createClient } from "next-sanity";
import { Search, Package, Truck, CheckCircle, MapPin, Calendar, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// --- SANITY CLIENT ---
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  useCdn: true,
});

export default function TrackOrderPage() {
  // Form State
  const [formData, setFormData] = useState({ orderNumber: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  // Handle Search
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      // Query matches BOTH Order Number AND Email for security
      const query = `*[_type == "order" && orderNumber == $orderNumber && email == $email][0]{
        _id,
        orderNumber,
        status,
        _createdAt,
        shippingAddress,
        totalPrice,
        "items": items[]{
            productName,
            quantity,
            "image": product->images[0].asset->url
        }
      }`;

      const data = await client.fetch(query, {
        orderNumber: formData.orderNumber.trim(),
        email: formData.email.trim().toLowerCase()
      });

      if (data) {
        setOrder(data);
      } else {
        setError("We could not find an order with those details. Please check and try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine step status
  const getStepStatus = (stepIndex: number) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStatusIndex = statuses.indexOf(order?.status?.toLowerCase() || 'pending');
    
    if (stepIndex < currentStatusIndex) return 'completed';
    if (stepIndex === currentStatusIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 md:pt-40 md:pb-32 font-sans text-[#1A1A1A]">
      
      {/* --- HERO HEADER --- */}
      <div className="max-w-2xl mx-auto px-6 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="font-serif text-4xl md:text-5xl text-primary mb-6">Track Your Order</h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          Enter your order number and email address below to check the status of your shipment.
        </p>
      </div>

      {/* --- SEARCH FORM --- */}
      <div className="max-w-xl mx-auto px-6 mb-20">
        <form onSubmit={handleTrack} className="bg-[#FAFAFA] border border-gray-100 p-8 md:p-12 shadow-sm">
            
            {error && (
                <div className="mb-8 p-4 bg-red-50 border-l-2 border-red-500 flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-600 font-medium leading-relaxed">{error}</p>
                </div>
            )}

            <div className="space-y-6">
                <div className="group">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block group-focus-within:text-primary transition-colors">Order Number</label>
                    <input 
                        type="text" 
                        placeholder="e.g. ORD-12345678"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                        className="w-full border-b border-gray-200 bg-transparent py-3 text-primary outline-none focus:border-primary transition-all placeholder:text-gray-300"
                        required
                    />
                </div>
                
                <div className="group">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block group-focus-within:text-primary transition-colors">Email Address</label>
                    <input 
                        type="email" 
                        placeholder="e.g. name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full border-b border-gray-200 bg-transparent py-3 text-primary outline-none focus:border-primary transition-all placeholder:text-gray-300"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-white h-14 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : "Track Order"} 
                </button>
            </div>
        </form>
      </div>

      {/* --- ORDER RESULTS --- */}
      {order && (
        <div className="max-w-[1000px] mx-auto px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="border border-gray-100 p-8 md:p-12 bg-white shadow-lg shadow-gray-100/50">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 mb-10 gap-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Order Reference</span>
                        <h2 className="font-serif text-2xl md:text-3xl text-primary">#{order.orderNumber}</h2>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-100 rounded-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{order.status}</span>
                    </div>
                </div>

                {/* --- PROGRESS STEPPER --- */}
                <div className="mb-16 relative">
                    {/* Line */}
                    <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-100 -z-10"></div>
                    <div className="absolute top-5 left-0 h-[2px] bg-primary transition-all duration-1000 -z-10" 
                         style={{ width: order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '66%' : order.status === 'processing' ? '33%' : '0%' }}>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-center">
                        {/* Step 1: Placed */}
                        <Step 
                            label="Order Placed" 
                            date={new Date(order._createdAt).toLocaleDateString()}
                            status={getStepStatus(0)} 
                            icon={<Package size={16} />} 
                        />
                        {/* Step 2: Processing */}
                        <Step 
                            label="Processing" 
                            status={getStepStatus(1)} 
                            icon={<Loader2 size={16} />} 
                        />
                        {/* Step 3: Shipped */}
                        <Step 
                            label="On The Way" 
                            status={getStepStatus(2)} 
                            icon={<Truck size={16} />} 
                        />
                        {/* Step 4: Delivered */}
                        <Step 
                            label="Delivered" 
                            status={getStepStatus(3)} 
                            icon={<CheckCircle size={16} />} 
                        />
                    </div>
                </div>

                {/* --- DETAILS GRID --- */}
                <div className="grid md:grid-cols-2 gap-12">
                    
                    {/* Left: Items */}
                    <div>
                        <h3 className="font-serif text-lg text-primary mb-6">Items in Shipment</h3>
                        <div className="space-y-4">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-center">
                                    <div className="relative w-16 h-20 bg-gray-50 border border-gray-100">
                                        {item.image && <Image src={item.image} alt={item.productName} fill className="object-cover" />}
                                    </div>
                                    <div>
                                        <p className="font-serif text-sm text-primary mb-1">{item.productName}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-8">
                         <div>
                            <h3 className="font-serif text-lg text-primary mb-4">Delivery Address</h3>
                            <div className="flex gap-3 text-sm text-gray-500 leading-relaxed">
                                <MapPin size={18} className="shrink-0 text-primary mt-1" />
                                <p>{order.shippingAddress}</p>
                            </div>
                         </div>
                         
                         <div>
                            <h3 className="font-serif text-lg text-primary mb-4">Estimated Delivery</h3>
                            <div className="flex gap-3 text-sm text-gray-500">
                                <Calendar size={18} className="shrink-0 text-primary" />
                                <p>Standard Shipping (5-7 Business Days)</p>
                            </div>
                         </div>
                    </div>

                </div>

            </div>

            {/* Login CTA */}
            <div className="text-center mt-12">
                <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest">Want to view your full order history?</p>
                <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary transition-colors group">
                    Sign In to Account <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

        </div>
      )}

    </div>
  );
}

// --- SUB COMPONENT: STEPPER ---
function Step({ label, date, status, icon }: { label: string, date?: string, status: string, icon: any }) {
    const isCompleted = status === 'completed';
    const isCurrent = status === 'current';
    
    return (
        <div className="flex flex-col items-center relative group">
            <div className={`
                w-10 h-10 rounded-full border-2 flex items-center justify-center mb-4 transition-all duration-500 z-10 bg-white
                ${isCompleted || isCurrent ? 'border-primary text-primary' : 'border-gray-200 text-gray-300'}
                ${isCurrent ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : ''}
            `}>
                {icon}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isCompleted || isCurrent ? 'text-primary' : 'text-gray-300'}`}>
                {label}
            </span>
            {date && <span className="text-[9px] text-gray-400">{date}</span>}
        </div>
    )
}