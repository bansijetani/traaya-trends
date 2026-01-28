"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const query = `{
        "orders": *[_type == "order"] | order(orderDate desc) { total, status, orderNumber, orderDate, firstName, lastName },
        "products": count(*[_type == "product"]),
        "customers": count(*[_type == "user" && role == "customer"])
      }`;

      const data = await client.fetch(query, {}, { cache: 'no-store' });

      // Calculate Revenue (Only count orders that are NOT cancelled)
      const totalRevenue = data.orders.reduce((sum: number, order: any) => {
        return order.status !== 'cancelled' ? sum + (order.total || 0) : sum;
      }, 0);

      setStats({
        revenue: totalRevenue,
        totalOrders: data.orders.length,
        totalProducts: data.products,
        totalCustomers: data.customers,
      });

      // Get the 5 most recent orders
      setRecentOrders(data.orders.slice(0, 5));

    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back to your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                <DollarSign size={24} />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Total Revenue</p>
                <h3 className="text-2xl font-bold text-[#1A1A1A]">${stats.revenue.toLocaleString()}</h3>
            </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                <ShoppingBag size={24} />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Total Orders</p>
                <h3 className="text-2xl font-bold text-[#1A1A1A]">{stats.totalOrders}</h3>
            </div>
        </div>

        {/* Products Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700">
                <Package size={24} />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Total Products</p>
                <h3 className="text-2xl font-bold text-[#1A1A1A]">{stats.totalProducts}</h3>
            </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-700">
                <Users size={24} />
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Customers</p>
                <h3 className="text-2xl font-bold text-[#1A1A1A]">{stats.totalCustomers}</h3>
            </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-lg">Recent Orders</h3>
            <a href="/admin/orders" className="text-sm text-[#B87E58] hover:underline font-medium">View All</a>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-3">Order ID</th>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Total</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                        <tr key={order.orderNumber} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">#{order.orderNumber}</td>
                            <td className="px-6 py-4">{order.firstName} {order.lastName}</td>
                            <td className="px-6 py-4 text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-bold">${order.total?.toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                    ${order.status === 'pending' ? 'bg-orange-100 text-orange-800' : ''}
                                    ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                                    ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                `}>
                                    {order.status || 'pending'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}