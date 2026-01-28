"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Shield, Package, Calendar } from "lucide-react";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // This ID comes from the URL (It is the Sanity User ID now)
  const userId = params.id as string;

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      // 1. Fetch User Profile
      const userQuery = `*[_type == "user" && _id == $id][0]`;
      const userData = await client.fetch(userQuery, { id: userId });

      if (!userData) {
        setLoading(false);
        return;
      }
      setUser(userData);

      // 2. Fetch Orders belonging to this User (Matching by Email)
      const orderQuery = `*[_type == "order" && email == $email] | order(orderDate desc)`;
      const orderData = await client.fetch(orderQuery, { email: userData.email });
      setOrders(orderData);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Profile...</div>;
  if (!user) return <div className="p-10 text-center text-red-500">User not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Back Button */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1A1A1A]">
        <ArrowLeft size={16} /> Back to Customers
      </button>

      {/* Profile Header */}
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center text-3xl font-serif">
                {user.name?.charAt(0) || "U"}
            </div>
            <div>
                <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">{user.name}</h1>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <Mail size={14} /> {user.email}
                </div>
            </div>
        </div>
        <div className="text-right">
             <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-wide mb-2">
                {user.role}
             </div>
             <p className="text-xs text-gray-400">Joined: {new Date(user._createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Total Spent</h3>
            <p className="text-3xl font-serif font-bold text-[#B87E58]">
                ${orders.reduce((acc, curr) => acc + (curr.total || 0), 0).toLocaleString()}
            </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Total Orders</h3>
            <p className="text-3xl font-serif font-bold text-[#1A1A1A]">{orders.length}</p>
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-lg flex items-center gap-2">
                <Package size={20} className="text-[#B87E58]" /> Order History
            </h3>
        </div>
        {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400 italic">No orders placed yet.</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr 
                                key={order._id} 
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => router.push(`/admin/orders/${order._id}`)}
                            >
                                <td className="px-6 py-4 font-medium">#{order.orderNumber}</td>
                                <td className="px-6 py-4 text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-bold">${order.total?.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}