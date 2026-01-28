"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { Search, Filter, Trash2, CheckCircle, AlertCircle, X } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // 👇 Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // 👇 Delete Confirmation State (Stores the ID of the order to be deleted)
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((order) => {
        const name = `${order.firstName || ""} ${order.lastName || ""}`.toLowerCase();
        const email = (order.email || "").toLowerCase();
        const orderId = (order.orderNumber || "").toLowerCase();
        return name.includes(lowerSearch) || email.includes(lowerSearch) || orderId.includes(lowerSearch);
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => 
        (order.status || "pending").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const query = `*[_type == "order"] | order(orderDate desc) {
        _id, orderNumber, firstName, lastName, email, total, status, orderDate, city
      }`;
      const data = await client.fetch(query, {}, { cache: 'no-store' });
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 👇 1. TRIGGER: User clicks Trash Icon -> Open Modal
  const handleDeleteClick = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteOrderId(orderId); // Open the modal
  };

  // 👇 2. ACTION: User clicks "Delete" inside Modal -> Call API
  const confirmDelete = async () => {
    if (!deleteOrderId) return;

    try {
      const response = await fetch("/api/delete-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: deleteOrderId }),
      });

      if (!response.ok) throw new Error("Failed to delete");

      setOrders((prev) => prev.filter(o => o._id !== deleteOrderId));
      showNotification("Order deleted successfully!", "success");

    } catch (error) {
      console.error("Delete failed:", error);
      showNotification("Failed to delete order.", "error");
    } finally {
      setDeleteOrderId(null); // Close the modal
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Orders...</div>;

  return (
    <div className="space-y-6 relative">
      
      {/* 👇 CUSTOM CONFIRMATION MODAL */}
      {deleteOrderId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4 relative">
                {/* Close X */}
                <button 
                    onClick={() => setDeleteOrderId(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <Trash2 className="text-red-600" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Order?</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Are you sure you want to delete this order? This action cannot be undone.
                    </p>
                    
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setDeleteOrderId(null)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                        >
                            Delete Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transition-all transform duration-300 z-50 flex items-center gap-2
          ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        `}>
            {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">All Orders</h2>
        <div className="text-sm text-gray-500">
            Total Orders: <span className="font-bold text-[#1A1A1A]">{filteredOrders.length}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search by name, email, or Order ID..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B87E58] focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B87E58] cursor-pointer hover:bg-gray-100 transition-colors appearance-none"
            >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                          No orders found.
                      </td>
                  </tr>
              ) : (
                  filteredOrders.map((order) => (
                    <tr 
                        key={order._id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/admin/orders/${order._id}`}
                    >
                      <td className="px-6 py-4 font-medium text-[#1A1A1A]">
                        #{order.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{order.firstName} {order.lastName}</div>
                        <div className="text-xs text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-bold">
                        ${order.total?.toLocaleString()}
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
                      <td className="px-6 py-4 text-right">
                        <button 
                            onClick={(e) => handleDeleteClick(order._id, e)} // 👈 Updated to open modal
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete Order"
                        >
                            <Trash2 size={16} />
                        </button>
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