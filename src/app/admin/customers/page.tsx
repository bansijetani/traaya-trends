"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { Search, User, Mail, Shield, Filter } from "lucide-react"; // 👈 Added Filter icon
import { useRouter } from "next/navigation";

export default function AdminCustomersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // 👈 Added Filter State

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;

    // 1. Search Logic
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((u) => 
        (u.name || "").toLowerCase().includes(lowerSearch) || 
        (u.email || "").toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Role Filter Logic (This finds your Admins)
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      const query = `*[_type == "user"] | order(_createdAt desc) {
        _id,
        name,
        email,
        role,
        _createdAt
      }`;
      const data = await client.fetch(query, {}, { cache: 'no-store' });
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">Users & Customers</h2>
        <p className="text-sm text-gray-500">Total: <span className="font-bold">{filteredUsers.length}</span></p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B87E58] text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* 👇 Role Filter Dropdown */}
        <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B87E58] cursor-pointer appearance-none"
            >
                <option value="all">All Users</option>
                <option value="customer">Customers Only</option>
                <option value="admin">Admins Only</option>
            </select>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No users found.</td></tr>
              ) : (
                  filteredUsers.map((user) => (
                    <tr 
                        key={user._id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/admin/customers/${user._id}`)}
                    >
                      <td className="px-6 py-4 font-medium text-[#1A1A1A] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        {user.name || "No Name"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        {user.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                <Shield size={10} /> Admin
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                <User size={10} /> Customer
                            </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(user._createdAt).toLocaleDateString()}
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