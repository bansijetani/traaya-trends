"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Package, User, CheckCircle, AlertCircle } from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 👇 New State for Notification
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails(params.id as string);
    }
  }, [params.id]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const query = `*[_type == "order" && _id == $id][0]{
        _id,
        orderNumber,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        zipCode,
        total,
        status,
        orderDate,
        items[]{
          name,
          quantity,
          price,
          image
        }
      }`;
      const data = await client.fetch(query, { id: orderId });
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Improved Status Update Logic
  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch("/api/update-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order._id, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update");

      // Update Local State
      setOrder({ ...order, status: newStatus });

      // Show Success Notification
      setNotification({ message: `Status updated to ${newStatus}`, type: 'success' });
      
    } catch (error) {
      // Show Error Notification
      setNotification({ message: "Failed to update status", type: 'error' });
    } finally {
      // Hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Order Details...</div>;
  if (!order) return <div className="p-10 text-center text-red-500">Order not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative">
      
      {/* 👇 NOTIFICATION TOAST (Shows only when notification exists) */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transition-all transform duration-300 z-50 flex items-center gap-2
          ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        `}>
            {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1A1A1A] transition-colors"
      >
        <ArrowLeft size={16} /> Back to Orders
      </button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <div>
            <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Order #{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Status:</span>
            <select 
                value={order.status || 'pending'}
                onChange={(e) => updateStatus(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#B87E58] focus:border-[#B87E58] block p-2.5 cursor-pointer"
            >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Package size={20} className="text-[#B87E58]" /> Order Items
                </h3>
                <div className="space-y-4">
                    {order.items?.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-4">
                                {item.image && (
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                                )}
                                <div>
                                    <p className="font-medium text-[#1A1A1A]">{item.name}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-bold text-[#1A1A1A]">${item.price * item.quantity}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl text-[#B87E58]">${order.total?.toLocaleString()}</span>
                </div>
            </div>
        </div>

        {/* Right Column: Customer Details */}
        <div className="space-y-6">
            
            {/* Customer Info */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <User size={20} className="text-[#B87E58]" /> Customer
                </h3>
                <div className="space-y-3 text-sm">
                    <p><span className="text-gray-500">Name:</span> <br/> <span className="font-medium">{order.firstName} {order.lastName}</span></p>
                    <p><span className="text-gray-500">Email:</span> <br/> <span className="font-medium">{order.email}</span></p>
                    <p><span className="text-gray-500">Phone:</span> <br/> <span className="font-medium">{order.phone || 'N/A'}</span></p>
                </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-[#B87E58]" /> Delivery Address
                </h3>
                <div className="space-y-1 text-sm text-gray-700">
                    <p>{order.address}</p>
                    <p>{order.city}, {order.zipCode}</p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}