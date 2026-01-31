"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Orders (Recent & All for stats)
        const ordersQuery = `*[_type == "order"] | order(orderDate desc) {
          _id,
          orderNumber,
          orderDate,
          totalPrice,   // 👈 Correct Field
          status,
          customerName, // 👈 Correct Field
          email
        }`;

        // 2. Fetch Counts
        const productCountQuery = `count(*[_type == "product"])`;
        
        // Execute queries
        const orders = await client.fetch(ordersQuery);
        const productsCount = await client.fetch(productCountQuery);

        // 3. Calculate Stats
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);
        
        // Calculate unique customers based on email
        const uniqueCustomers = new Set(orders.map((o: any) => o.email)).size;

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: productsCount,
          totalCustomers: uniqueCustomers,
        });

        // Take only the first 5 for the "Recent Orders" table
        setRecentOrders(orders.slice(0, 5));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back to your store overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Total Revenue</p>
            <h3 className="text-2xl font-bold text-[#1A1A1A]">${stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Total Orders</p>
            <h3 className="text-2xl font-bold text-[#1A1A1A]">{stats.totalOrders}</h3>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Total Products</p>
            <h3 className="text-2xl font-bold text-[#1A1A1A]">{stats.totalProducts}</h3>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Customers</p>
            <h3 className="text-2xl font-bold text-[#1A1A1A]">{stats.totalCustomers}</h3>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-[#1A1A1A]">Recent Orders</h3>
            <button onClick={() => router.push('/admin/orders')} className="text-xs font-bold text-[#B87E58] hover:text-[#1A1A1A] uppercase">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No orders yet.</td></tr>
              ) : (
                recentOrders.map((order) => (
                    <tr 
                        key={order._id} 
                        onClick={() => router.push(`/admin/orders/${order._id}`)}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium text-[#1A1A1A]">#{order.orderNumber}</td>
                      <td className="px-6 py-4">
                         {/* 👇 Fix applied here */}
                         <div className="font-medium">{order.customerName || "Guest"}</div>
                         <div className="text-xs text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold">
                        {/* 👇 Fix applied here */}
                        ${order.totalPrice?.toLocaleString() || "0"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                          ${order.status === 'pending' ? 'bg-orange-100 text-orange-800' : ''}
                          ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                          ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                          ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}