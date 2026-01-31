"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { Search, Mail, Phone, ShoppingBag, DollarSign, User, ShieldCheck, Filter } from "lucide-react";
import { useRouter } from "next/navigation"; // 👈 1. Import Router

interface Order {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  totalPrice: number;
  orderDate: string;
}

interface SanityUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
  _createdAt: string;
}

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastActive: string;
  type: "Registered" | "Guest";
  role?: string;
}

export default function CustomersPage() {
  const router = useRouter(); // 👈 2. Initialize Router
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = customers;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(lowerSearch) ||
          (c.email || "").toLowerCase().includes(lowerSearch) ||
          (c.phone || "").includes(lowerSearch)
      );
    }

    if (roleFilter !== "all") {
      if (roleFilter === "admin") {
        result = result.filter(c => c.role === 'admin');
      } else if (roleFilter === "member") {
        result = result.filter(c => c.type === 'Registered' && c.role !== 'admin');
      } else if (roleFilter === "guest") {
        result = result.filter(c => c.type === 'Guest');
      }
    }

    setFilteredCustomers(result);
  }, [searchTerm, roleFilter, customers]);

  const fetchData = async () => {
    try {
      const query = `{
        "orders": *[_type == "order"] | order(orderDate desc) {
          _id, customerName, email, phone, totalPrice, orderDate
        },
        "users": *[_type == "user" || _type == "User"] {
          _id, name, email, role, _createdAt
        }
      }`;
      
      const { orders, users } = await client.fetch(query);

      const customerMap = new Map<string, CustomerProfile>();

      // A. Process Registered Users
      users.forEach((user: SanityUser) => {
        const key = user.email ? user.email.toLowerCase() : user._id;

        customerMap.set(key, {
            id: user._id,
            name: user.name || "Unnamed User",
            email: user.email || "No Email",
            phone: "", 
            totalOrders: 0,
            totalSpent: 0,
            lastActive: user._createdAt || new Date().toISOString(),
            type: "Registered",
            role: user.role || "user"
        });
      });

      // B. Process Orders
      orders.forEach((order: Order) => {
        const emailKey = (order.email || "").toLowerCase();
        
        if (!emailKey) return;

        if (customerMap.has(emailKey)) {
            const existing = customerMap.get(emailKey)!;
            existing.totalOrders += 1;
            existing.totalSpent += order.totalPrice || 0;
            existing.phone = order.phone || existing.phone;
            
            if (order.orderDate && (!existing.lastActive || new Date(order.orderDate) > new Date(existing.lastActive))) {
                existing.lastActive = order.orderDate;
            }
        } else {
            customerMap.set(emailKey, {
                id: order._id,
                name: order.customerName || "Guest",
                email: order.email,
                phone: order.phone,
                totalOrders: 1,
                totalSpent: order.totalPrice || 0,
                lastActive: order.orderDate || new Date().toISOString(),
                type: "Guest"
            });
        }
      });

      const customerArray = Array.from(customerMap.values()).sort(
        (a, b) => b.totalSpent - a.totalSpent
      );

      setCustomers(customerArray);
      setFilteredCustomers(customerArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Customers & Users...</div>;

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">Customers & Users</h1>
           <p className="text-sm text-gray-500 mt-1">
             Manage your store's relationships.
           </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
             <div className="text-xs font-bold text-gray-400 uppercase">Total Users</div>
             <div className="text-2xl font-bold text-[#1A1A1A]">{customers.length}</div>
          </div>
          <div className="bg-white p-4 rounded border border-gray-200 shadow-sm border-l-4 border-l-purple-500">
             <div className="text-xs font-bold text-purple-600 uppercase">Admins</div>
             <div className="text-2xl font-bold text-purple-700">{customers.filter(c => c.role === 'admin').length}</div>
          </div>
          <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
             <div className="text-xs font-bold text-gray-400 uppercase">Registered Members</div>
             <div className="text-2xl font-bold text-[#B87E58]">{customers.filter(c => c.type === 'Registered' && c.role !== 'admin').length}</div>
          </div>
          <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
             <div className="text-xs font-bold text-gray-400 uppercase">Guest Buyers</div>
             <div className="text-2xl font-bold text-gray-600">{customers.filter(c => c.type === 'Guest').length}</div>
          </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search name or email..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B87E58] cursor-pointer hover:bg-gray-100 transition-colors appearance-none"
            >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="member">Members</option>
                <option value="guest">Guests</option>
            </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">User / Customer</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Orders</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Total Spent</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 text-sm">No users found matching filter.</td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                    <tr 
                        key={index} 
                        // 👇 3. ADDED ON CLICK HANDLER & CURSOR POINTER
                        onClick={() => router.push(`/admin/customers/${customer.id}`)}
                        className="hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                        <td className="p-4">
                            <div className="font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
                                {customer.name}
                                {customer.role === 'admin' && (
                                    <span title="Admin" className="cursor-help">
                                        <ShieldCheck size={14} className="text-purple-600" />
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1 mt-1">
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Mail size={10} /> {customer.email}
                                </span>
                                {customer.phone && (
                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                        <Phone size={10} /> {customer.phone}
                                    </span>
                                )}
                            </div>
                        </td>
                        <td className="p-4">
                            {customer.role === 'admin' ? (
                                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-purple-200">
                                    <ShieldCheck size={10} /> Admin
                                </span>
                            ) : customer.type === 'Registered' ? (
                                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
                                    <User size={10} /> Member
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-gray-200">
                                    Guest
                                </span>
                            )}
                        </td>
                        <td className="p-4">
                            <div className={`text-sm font-medium ${customer.totalOrders > 0 ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                                {customer.totalOrders} Order{customer.totalOrders !== 1 ? 's' : ''}
                            </div>
                        </td>
                        <td className="p-4">
                            <div className={`flex items-center gap-1 font-bold ${customer.totalSpent > 0 ? 'text-[#1A1A1A]' : 'text-gray-300'}`}>
                                <DollarSign size={14} className={customer.totalSpent > 0 ? "text-green-600" : "text-gray-300"} /> 
                                {customer.totalSpent.toLocaleString()}
                            </div>
                        </td>
                        <td className="p-4 text-xs text-gray-500 font-mono">
                            {customer.lastActive && !isNaN(new Date(customer.lastActive).getTime()) 
                                ? new Date(customer.lastActive).toLocaleDateString() 
                                : "N/A"}
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