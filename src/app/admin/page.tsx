"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { DollarSign, ShoppingBag, Users, TrendingUp, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch all orders sorted by date
        const query = `*[_type == "order"] | order(orderDate desc) {
          _id,
          orderNumber,
          total,
          status,
          orderDate,
          email,
          firstName,
          lastName
        }`;
        
        const data = await client.fetch(query);
        setOrders(data);

        // Calculate Stats
        const totalRevenue = data.reduce((acc: number, order: any) => acc + (order.total || 0), 0);
        const pending = data.filter((order: any) => order.status === 'pending').length;
        const delivered = data.filter((order: any) => order.status === 'delivered').length;

        setStats({
          revenue: totalRevenue,
          totalOrders: data.length,
          pendingOrders: pending,
          deliveredOrders: delivered
        });

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif font-bold">Dashboard Overview</h2>
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Revenue</h3>
            <div className="p-2 bg-green-100 rounded-full text-green-600"><DollarSign size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]">${stats.revenue.toLocaleString()}</p>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-2"><TrendingUp size={12} /> +12% from last month</p>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Orders</h3>
            <div className="p-2 bg-blue-100 rounded-full text-blue-600"><ShoppingBag size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]">{stats.totalOrders}</p>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending</h3>
            <div className="p-2 bg-orange-100 rounded-full text-orange-600"><Clock size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]">{stats.pendingOrders}</p>
          <p className="text-xs text-gray-400 mt-2">Needs processing</p>
        </div>

        {/* Delivered Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Completed</h3>
            <div className="p-2 bg-purple-100 rounded-full text-purple-600"><Users size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]">{stats.deliveredOrders}</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#1A1A1A]">#{order.orderNumber}</td>
                  <td className="px-6 py-4">{order.firstName} {order.lastName}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                      ${order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : ''}
                      ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold">${order.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}