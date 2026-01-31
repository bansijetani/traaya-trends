"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Package, User, MapPin, 
  CheckCircle, AlertCircle, X, TicketPercent 
} from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const query = `*[_type == "order" && _id == $id][0]{
            _id,
            orderNumber,
            orderDate,
            status,
            customerName,
            email,
            phone,
            shippingAddress,
            discount,       
            couponCode,
            totalPrice,
            items[]{
                quantity,
                price,
                product->{
                    name,
                    "imageUrl": images[0].asset->url,
                    sku
                }
            }
        }`;

        const data = await client.fetch(query, { id: params.id });
        setOrder(data);
      } catch (error) {
        console.error("Failed to load order", error);
        showToast("Failed to load order details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchOrder();
  }, [params.id]);

  const updateStatus = async (newStatus: string) => {
    try {
        const res = await fetch("/api/orders/update-order-status", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: order._id, status: newStatus }),
        });

        if (res.ok) {
            setOrder({ ...order, status: newStatus });
            showToast("Order status updated successfully!", "success");
        } else {
            showToast("Failed to update status", "error");
        }
    } catch (error) {
        showToast("Something went wrong", "error");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Order...</div>;
  if (!order) return <div className="p-10 text-center text-red-500">Order not found.</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20 relative">
      
      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300 ${
            notification.type === 'success' ? 'bg-[#1A1A1A] text-white' : 'bg-red-600 text-white'
        }`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <div>
                <h4 className="font-bold text-sm">{notification.type === 'success' ? "Success" : "Error"}</h4>
                <p className="text-xs opacity-90">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-2 opacity-70 hover:opacity-100"><X size={16}/></button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 border rounded-md hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Order {order.orderNumber}</h1>
          <p className="text-sm text-gray-500">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-bold text-gray-500 uppercase">Status:</span>
            <select 
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="bg-white border border-gray-300 text-sm font-bold rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B87E58] shadow-sm hover:border-gray-400 transition-colors"
            >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Items & Calculations */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Package size={16} /> Order Items ({order.items?.length || 0})
                </h3>
                <div className="divide-y divide-gray-100">
                    {order.items?.map((item: any, i: number) => (
                        <div key={i} className="py-4 flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-md overflow-hidden">
                                {item.product?.imageUrl ? (
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100"><Package size={20}/></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-[#1A1A1A]">{item.product?.name || "Unknown Product"}</h4>
                                <p className="text-xs text-gray-500">SKU: {item.product?.sku || "N/A"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-[#1A1A1A]">${item.price}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 👇 UPDATED: Detailed Order Summary */}
                <div className="border-t border-gray-100 mt-4 pt-4 space-y-3">
                    
                    {/* Subtotal Calculation */}
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>${(order.totalPrice + (order.discount || 0)).toLocaleString()}</span>
                    </div>

                    {/* Discount Row (Only if valid) */}
                    {order.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600 font-medium">
                            <div className="flex items-center gap-2">
                                <TicketPercent size={16} />
                                <span>Discount</span>
                                {order.couponCode && (
                                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide border border-green-200">
                                        {order.couponCode}
                                    </span>
                                )}
                            </div>
                            <span>-${order.discount.toLocaleString()}</span>
                        </div>
                    )}

                    {/* Shipping */}
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    
                    {/* Final Total */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                        <span className="font-bold text-gray-900">Total Paid</span>
                        <span className="text-xl font-serif font-bold text-[#1A1A1A]">${order.totalPrice?.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Customer Info */}
        <div className="space-y-6">
            {/* Customer */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User size={16} /> Customer
                </h3>
                <div className="space-y-3 text-sm">
                    <div>
                        <span className="block text-xs text-gray-500 uppercase font-bold">Name</span>
                        <span className="text-[#1A1A1A]">{order.customerName || "Guest"}</span>
                    </div>
                    <div>
                        <span className="block text-xs text-gray-500 uppercase font-bold">Email</span>
                        <a href={`mailto:${order.email}`} className="text-[#B87E58] hover:underline">{order.email}</a>
                    </div>
                    <div>
                        <span className="block text-xs text-gray-500 uppercase font-bold">Phone</span>
                        <span className="text-[#1A1A1A]">{order.phone || "N/A"}</span>
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin size={16} /> Delivery Address
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {order.shippingAddress || "No address provided."}
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}