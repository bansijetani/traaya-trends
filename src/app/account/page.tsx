"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import Link from "next/link";
import { 
  Package, Heart, MapPin, Settings, LogOut, 
  User, ChevronRight, X, Plus 
} from "lucide-react";

// --- MOCK DATA ---
const orders = [
  { id: "#TY-8821", date: "Mar 3, 2025", status: "Processing", total: 3370.00, items: 2 },
  { id: "#TY-8820", date: "Feb 28, 2025", status: "Delivered", total: 850.00, items: 1 },
  { id: "#TY-8815", date: "Jan 15, 2025", status: "Delivered", total: 1199.00, items: 1 },
];

const wishlist = [
  { id: 2, name: "Crystal Birthstone Charm", price: 2499.00, image: "/images/product-2.jpg" },
  { id: 3, name: "Sparkling Infinity Bracelet", price: 850.00, image: "/images/product-3.jpg" },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <main className="bg-white text-[#1A1A1A] min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* --- PAGE HEADER --- */}
      <div className="pt-[140px] pb-12 bg-[#F9F9F9] text-center px-4 border-b border-[#E5E5E5]">
        <h1 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-3">My Account</h1>
        <div className="flex items-center justify-center text-xs text-[#888] gap-2">
            <Link href="/" className="hover:text-black">Home</Link>
            <ChevronRight size={10} />
            <span className="text-black">Dashboard</span>
        </div>
      </div>

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* ================= SIDEBAR NAVIGATION ================= */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="mb-8 flex items-center gap-4 p-4 border border-[#E5E5E5] bg-white">
                <div className="w-12 h-12 bg-[#F9F9F9] rounded-full flex items-center justify-center text-[#B87E58]">
                    <User size={24} />
                </div>
                <div>
                    <p className="text-xs text-[#888] uppercase tracking-widest">Hello,</p>
                    <p className="font-bold text-[#1A1A1A]">John Doe</p>
                </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "orders", label: "My Orders", icon: Package },
                { id: "wishlist", label: "Wishlist", icon: Heart },
                { id: "addresses", label: "Addresses", icon: MapPin },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-l-2 ${
                    activeTab === item.id 
                      ? "border-[#B87E58] bg-[#F9F9F9] text-[#1A1A1A]" 
                      : "border-transparent text-[#888] hover:text-[#1A1A1A] hover:bg-[#FAFAFA]"
                  }`}
                >
                  <item.icon size={16} strokeWidth={1.5} />
                  {item.label}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-[#E5E5E5]">
                 <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={16} strokeWidth={1.5} /> Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* ================= MAIN CONTENT AREA ================= */}
          <div className="flex-1 min-h-[500px]">
            
            {/* --- TAB: OVERVIEW --- */}
            {activeTab === "overview" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="font-serif text-2xl mb-8">Account Overview</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-[#F9F9F9] p-8 border border-[#E5E5E5] text-center group hover:border-[#B87E58] transition-colors">
                    <span className="text-[#888] text-xs font-bold uppercase tracking-widest mb-2 block">Total Orders</span>
                    <span className="text-4xl font-serif text-[#1A1A1A]">12</span>
                  </div>
                   <div className="bg-[#F9F9F9] p-8 border border-[#E5E5E5] text-center group hover:border-[#B87E58] transition-colors">
                    <span className="text-[#888] text-xs font-bold uppercase tracking-widest mb-2 block">Total Spent</span>
                    <span className="text-4xl font-serif text-[#B87E58]">$4,250</span>
                  </div>
                   <div className="bg-[#F9F9F9] p-8 border border-[#E5E5E5] text-center group hover:border-[#B87E58] transition-colors">
                    <span className="text-[#888] text-xs font-bold uppercase tracking-widest mb-2 block">Wishlist</span>
                    <span className="text-4xl font-serif text-[#1A1A1A]">5</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-[#E5E5E5] pb-2">Recent Order</h3>
                <div className="border border-[#E5E5E5] p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white hover:shadow-sm transition-shadow">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="font-serif text-xl text-[#1A1A1A]">#TY-8821</span>
                            <span className="bg-[#FFF4E5] text-[#B87E58] text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">Processing</span>
                        </div>
                        <p className="text-sm text-[#555]">March 3, 2025 • $3,370.00 • 2 Items</p>
                    </div>
                    <button className="h-10 px-6 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B87E58] transition-colors">
                        View Details
                    </button>
                </div>
              </div>
            )}

            {/* --- TAB: MY ORDERS --- */}
            {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="font-serif text-2xl mb-8">Order History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-[#E5E5E5] text-xs font-bold uppercase tracking-widest text-[#888]">
                        <th className="pb-4 pl-4">Order</th>
                        <th className="pb-4">Date</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Total</th>
                        <th className="pb-4 text-right pr-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-[#E5E5E5] hover:bg-[#FAFAFA] transition-colors group">
                          <td className="py-6 pl-4 font-bold font-serif text-lg group-hover:text-[#B87E58] transition-colors">{order.id}</td>
                          <td className="py-6 text-[#555]">{order.date}</td>
                          <td className="py-6">
                            <span className={`text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-full ${
                                order.status === 'Delivered' ? 'bg-[#E9EFE3] text-[#4CAF50]' : 'bg-[#FFF4E5] text-[#B87E58]'
                            }`}>
                                {order.status}
                            </span>
                          </td>
                          <td className="py-6 font-medium">${order.total.toLocaleString()}</td>
                          <td className="py-6 text-right pr-4">
                             <button className="text-xs font-bold uppercase tracking-widest border-b border-transparent hover:border-[#1A1A1A] transition-colors">
                                View
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- TAB: WISHLIST --- */}
            {activeTab === "wishlist" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="font-serif text-2xl mb-8">My Wishlist</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlist.map((item) => (
                        <div key={item.id} className="group border border-[#E5E5E5] p-4 relative hover:shadow-lg transition-shadow">
                            <button className="absolute top-4 right-4 text-[#888] hover:text-red-500 z-10 p-2 bg-white rounded-full shadow-sm">
                                <X size={14} />
                            </button>
                            <div className="bg-[#F9F9F9] aspect-square mb-4 overflow-hidden p-4">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"/>
                            </div>
                            <h3 className="font-bold text-sm mb-2 truncate text-[#1A1A1A]">{item.name}</h3>
                            <p className="text-[#B87E58] text-sm font-bold mb-4">${item.price.toLocaleString()}</p>
                            <button className="w-full h-10 border border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-colors">
                                Add to Bag
                            </button>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {/* --- TAB: ADDRESSES --- */}
            {activeTab === "addresses" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8 border-b border-[#E5E5E5] pb-4">
                    <h2 className="font-serif text-2xl">Saved Addresses</h2>
                    <button className="h-10 px-5 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#B87E58] transition-colors flex items-center gap-2">
                        <Plus size={14}/> Add New
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-[#1A1A1A] p-8 relative">
                        <span className="absolute top-0 right-0 text-[10px] font-bold uppercase bg-[#1A1A1A] text-white px-3 py-1 tracking-widest">Default</span>
                        <h4 className="font-serif text-xl mb-4">John Doe</h4>
                        <p className="text-sm text-[#555] leading-loose mb-6">
                            123 Luxury Lane, Suite 400<br/>
                            New York, NY 10012<br/>
                            United States<br/>
                            +1 (555) 123-4567
                        </p>
                        <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
                            <button className="text-[#1A1A1A] border-b border-[#1A1A1A] hover:text-[#B87E58] hover:border-[#B87E58] transition-colors">Edit</button>
                            <button className="text-[#888] hover:text-red-500 transition-colors">Remove</button>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* --- TAB: SETTINGS --- */}
            {activeTab === "settings" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg">
                <h2 className="font-serif text-2xl mb-8">Account Settings</h2>
                
                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-2 block">First Name</label>
                            <input type="text" defaultValue="John" className="w-full h-12 px-4 border border-[#E5E5E5] text-sm outline-none focus:border-[#B87E58]" />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-2 block">Last Name</label>
                            <input type="text" defaultValue="Doe" className="w-full h-12 px-4 border border-[#E5E5E5] text-sm outline-none focus:border-[#B87E58]" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-2 block">Email Address</label>
                        <input type="email" defaultValue="john@example.com" className="w-full h-12 px-4 border border-[#E5E5E5] text-sm outline-none focus:border-[#B87E58]" />
                    </div>

                    <div className="pt-6 border-t border-[#E5E5E5]">
                        <h3 className="font-bold text-sm mb-4">Password Change</h3>
                        <div className="space-y-4">
                            <input type="password" placeholder="Current Password" className="w-full h-12 px-4 border border-[#E5E5E5] text-sm outline-none focus:border-[#B87E58]" />
                            <input type="password" placeholder="New Password" className="w-full h-12 px-4 border border-[#E5E5E5] text-sm outline-none focus:border-[#B87E58]" />
                        </div>
                    </div>

                    <button className="h-12 px-8 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B87E58] transition-colors">
                        Save Changes
                    </button>
                </form>
              </div>
            )}

          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}