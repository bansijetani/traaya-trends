"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { client } from "@/sanity/lib/client"; 
import { useSession } from "next-auth/react"; 
import { 
  Package, Heart, MapPin, Settings, LogOut, 
  User, Loader2, Plus, Edit2, Trash2, X, ShoppingBag, Eye 
} from "lucide-react";
import toast from "react-hot-toast"; 

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null); 
  
  // Data States
  const [myOrders, setMyOrders] = useState<any[]>([]);
  // 🗑️ Removed myWishlist state (moved to /wishlist page)

  // ADDRESS STATES
  const [myAddresses, setMyAddresses] = useState<any[]>([]);
  const [viewState, setViewState] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null); 
  
  const initialFormState = {
    label: "Home",
    name: "",
    email: "",
    addressLine: "",
    city: "",
    zipCode: "",
    phone: "",
    isDefault: false
  };
  const [newAddress, setNewAddress] = useState(initialFormState);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    if (status === "loading") return;

    const localUserId = localStorage.getItem("user_id") || localStorage.getItem("userId");
    
    const fetchUserData = async (userId: string, email?: string) => {
        try {
            // 🗑️ Removed 'wishlist' from query to speed up account page load
            const userQuery = `*[_type == "user" && _id == $userId][0]{ 
                _id, name, email, phone, role, 
                addresses
            }`;
            const userData = await client.fetch(userQuery, { userId });
            
            if (userData) {
                const isRealAdmin = userData.role === 'admin'; 
                setUser({ ...userData, isAdmin: isRealAdmin });
                
                setMyAddresses(userData.addresses || []);
                setSettingsForm(prev => ({ 
                    ...prev, name: userData.name || "", email: userData.email || "", phone: userData.phone || "" 
                }));

                const targetEmail = email || userData.email;
                const orderQuery = `*[_type == "order" && (
                    customer._ref == $userId || customer->email == $userEmail || email == $userEmail
                )] | order(_createdAt desc) {
                    _id, orderNumber, _createdAt, status, totalPrice, "itemCount": count(products)
                }`;
                const orderData = await client.fetch(orderQuery, { userId, userEmail: targetEmail });
                setMyOrders(orderData);
            } 
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    if (localUserId) { fetchUserData(localUserId); return; }

    if (session?.user?.email) {
        const adminEmail = session.user.email;
        const adminName = session.user.name || "Admin"; 

        const fetchLinkedData = async () => {
             const linkedUser = await client.fetch(`*[_type == "user" && email == $email][0]._id`, { email: adminEmail });
            if (linkedUser) {
                localStorage.setItem("user_id", linkedUser);
                fetchUserData(linkedUser, adminEmail);
            } else {
                setUser({ name: adminName, email: adminEmail, isAdmin: true });
                setLoading(false);
            }
        };
        fetchLinkedData();
        return;
    }
    router.push("/login?user=customer");
  }, [router, session, status]);

  const handleLogout = () => { localStorage.clear(); router.push("/login?user=customer"); };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const action = editingId ? "edit" : "add";
    const payloadAddress = editingId ? { ...newAddress, id: editingId } : newAddress;

    try {
        const res = await fetch("/api/user/address", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id, action, address: payloadAddress })
        });
        const data = await res.json();
        
        if (res.ok) {
            toast.success(editingId ? "Address Updated!" : "Address Added!");
            setMyAddresses(data.addresses); 
            setViewState("list");
            setNewAddress(initialFormState);
            setEditingId(null);
        } else {
            toast.error("Failed to save address");
        }
    } catch (err) { toast.error("Error saving address"); } 
    finally { setSaving(false); }
  };

  const handleEditClick = (address: any) => {
      setNewAddress({
          label: address.label,
          name: address.name || "",
          email: address.email || "",
          addressLine: address.addressLine,
          city: address.city,
          zipCode: address.zipCode,
          phone: address.phone,
          isDefault: address.isDefault || false
      });
      setEditingId(address.id);
      setViewState("form");
      window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  const handleDeleteAddress = async (addressId: string) => {
      const res = await fetch("/api/user/address", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, action: "delete", addressId })
      });
      
      if(res.ok) {
          toast.success("Address Deleted");
          const data = await res.json();
          setMyAddresses(data.addresses);
      } else {
          toast.error("Could not delete");
      }
  };

  const totalPages = Math.ceil(myOrders.length / ITEMS_PER_PAGE);
  const currentOrders = myOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading || status === "loading") return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-[#B87E58]" /></div>;

  return (
    <main className="bg-white text-[#1A1A1A] min-h-screen flex flex-col font-sans">

      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 pt-[180px] pb-12">
        <h1 className="font-serif text-5xl md:text-6xl text-[#1A1A1A] uppercase tracking-wide">My Account</h1>
      </div>

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 pb-20 pt-4">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <aside className="w-full lg:w-64 shrink-0">
            <nav className="space-y-1">
              {[ 
                { id: "overview", label: "Overview", icon: User }, 
                { id: "orders", label: "My Orders", icon: Package }, 
                { id: "wishlist", label: "Wishlist", icon: Heart }, 
                { id: "addresses", label: "Addresses", icon: MapPin }, 
                { id: "settings", label: "Settings", icon: Settings }
              ].map((item) => (
                <button 
                  key={item.id} 
                  // 👇 UPDATED: Check if 'wishlist' is clicked and redirect
                  onClick={() => {
                    if (item.id === "wishlist") {
                      router.push("/wishlist");
                    } else {
                      setActiveTab(item.id);
                    }
                  }} 
                  className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-l-2 text-left cursor-pointer ${
                    activeTab === item.id 
                    ? "border-[#B87E58] bg-[#F9F9F9] text-[#1A1A1A]" 
                    : "border-transparent text-[#888] hover:text-[#1A1A1A] hover:bg-[#FAFAFA]"
                  }`}
                >
                  <item.icon size={16} strokeWidth={1.5} /> {item.label}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-[#E5E5E5]">
                  <button onClick={handleLogout} className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={16} strokeWidth={1.5} /> Sign Out
                  </button>
              </div>
            </nav>
          </aside>

          <div className="flex-1 min-h-[500px]">
            {activeTab === "overview" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="font-serif text-2xl mb-8">Account Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#F9F9F9] p-8 text-center cursor-default"><span className="text-[#888] text-xs font-bold uppercase mb-2 block">Total Orders</span><span className="text-4xl font-serif">{myOrders.length}</span></div>
                    <div className="bg-[#F9F9F9] p-8 text-center cursor-default"><span className="text-[#888] text-xs font-bold uppercase mb-2 block">Total Spent</span><span className="text-4xl font-serif text-[#B87E58]">${myOrders.reduce((acc, curr) => acc + curr.totalPrice, 0).toLocaleString()}</span></div>
                    <div className="bg-[#F9F9F9] p-8 text-center cursor-default"><span className="text-[#888] text-xs font-bold uppercase mb-2 block">Addresses</span><span className="text-4xl font-serif">{myAddresses.length}</span></div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-2xl mb-8">Order History</h2>
                  {myOrders.length === 0 ? <div className="text-center py-12 bg-gray-50 text-gray-400 text-sm">No orders yet.</div> : (
                    <div className="overflow-x-auto"><table className="w-full text-left border-collapse min-w-[600px]">
                        <thead><tr className="border-b border-[#E5E5E5] text-xs font-bold uppercase tracking-widest text-[#888]"><th className="pb-4 pl-4">Order</th><th className="pb-4">Date</th><th className="pb-4">Total</th><th className="pb-4 text-right pr-4">Action</th></tr></thead>
                        <tbody className="text-sm">{currentOrders.map((order) => (<tr key={order._id} className="border-b border-[#E5E5E5] hover:bg-[#FAFAFA]"><td className="py-6 pl-4 font-bold font-serif">{order.orderNumber}</td><td className="py-6 text-[#555]">{new Date(order._createdAt).toLocaleDateString()}</td><td className="py-6 font-medium">${order.totalPrice.toLocaleString()}</td><td className="py-6 text-right pr-4"><Link href={`/account/orders/${order._id}`} className="text-xs font-bold uppercase border-b border-transparent hover:border-black cursor-pointer">View</Link></td></tr>))}</tbody>
                    </table></div>
                  )}
                </div>
            )}

            {/* 🗑️ REMOVED: Wishlist Tab (Now redirects to /wishlist) */}

            {activeTab === "addresses" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-serif text-2xl">Your Addresses ({myAddresses.length})</h2>
                        {viewState === "list" && (
                            <button onClick={() => { setViewState("form"); setEditingId(null); setNewAddress(initialFormState); }} className="bg-[#1A1A1A] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B87E58] transition-colors flex items-center gap-2 cursor-pointer">
                                <Plus size={16}/> Add New Address
                            </button>
                        )}
                    </div>
                    
                    {viewState === "list" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {myAddresses.length === 0 ? (
                                <div className="col-span-2 text-center py-12 bg-gray-50 text-gray-400 text-sm">No addresses saved.</div>
                            ) : (
                                myAddresses.map((addr) => (
                                    <div key={addr.id} className="border border-[#E5E5E5] p-6 relative bg-white group hover:border-[#1A1A1A] transition-colors">
                                        {addr.isDefault && <span className="absolute top-0 right-0 bg-[#B87E58] text-white text-[9px] font-bold uppercase px-2 py-1 tracking-widest">Default</span>}
                                        <h4 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <MapPin size={14} /> {addr.label}
                                        </h4>
                                        <div className="text-sm text-[#555] leading-loose mb-6 space-y-1">
                                            <p className="font-bold text-black">{addr.name || user.name}</p>
                                            {addr.email && <p className="text-xs text-gray-400">{addr.email}</p>}
                                            <p>{addr.addressLine}</p>
                                            <p>{addr.city}, {addr.zipCode}</p>
                                            <p>{addr.phone}</p>
                                        </div>
                                        <div className="flex gap-4 border-t border-[#E5E5E5] pt-4 mt-4">
                                            <button onClick={() => handleEditClick(addr)} className="text-xs font-bold uppercase tracking-widest hover:text-[#B87E58] flex items-center gap-1 cursor-pointer">
                                                <Edit2 size={14}/> Edit
                                            </button>
                                            <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center gap-1 cursor-pointer">
                                                <Trash2 size={14}/> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSaveAddress} className="max-w-xl bg-white border border-[#E5E5E5] p-8">
                            <h3 className="font-bold text-sm uppercase tracking-widest mb-6">
                                {editingId ? "Edit Address" : "Add New Address"}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-[#888] mb-1 block">Label</label>
                                    <input type="text" placeholder="Home, Office..." value={newAddress.label} onChange={(e) => setNewAddress({...newAddress, label: e.target.value})} className="w-full h-11 border border-[#E5E5E5] px-4 text-sm outline-none focus:border-[#B87E58]" required/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-[#888] mb-1 block">Full Name</label>
                                    <input type="text" placeholder="John Doe" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} className="w-full h-11 border border-[#E5E5E5] px-4 text-sm outline-none focus:border-[#B87E58]" required/>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-[10px] font-bold uppercase text-[#888] mb-1 block">Email</label>
                                <input type="email" placeholder="john@example.com" value={newAddress.email} onChange={(e) => setNewAddress({...newAddress, email: e.target.value})} className="w-full h-11 border border-[#E5E5E5] px-4 text-sm outline-none focus:border-[#B87E58]" required/>
                            </div>

                            <div className="mb-4">
                                <label className="text-[10px] font-bold uppercase text-[#888] mb-1 block">Address</label>
                                <textarea value={newAddress.addressLine} onChange={(e) => setNewAddress({...newAddress, addressLine: e.target.value})} className="w-full h-24 border border-[#E5E5E5] p-4 text-sm outline-none focus:border-[#B87E58] resize-none" required></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-[#888] mb-1 block">City</label>
                                    <input type="text" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="w-full h-11 border border-[#E5E5E5] px-4 text-sm outline-none focus:border-[#B87E58]" required/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-[#888] mb-1 block">Zip Code</label>
                                    <input type="text" value={newAddress.zipCode} onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})} className="w-full h-11 border border-[#E5E5E5] px-4 text-sm outline-none focus:border-[#B87E58]" required/>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="text-[10px] font-bold uppercase text-[#888] mb-1 block">Phone</label>
                                <input type="tel" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} className="w-full h-11 border border-[#E5E5E5] px-4 text-sm outline-none focus:border-[#B87E58]"/>
                            </div>
                            
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" checked={newAddress.isDefault} onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})} id="def" className="accent-[#B87E58] cursor-pointer"/>
                                <label htmlFor="def" className="text-sm cursor-pointer">Set as default address</label>
                            </div>
                            
                            <div className="flex gap-4 mt-8">
                                <button type="submit" disabled={saving} className="bg-[#1A1A1A] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B87E58] transition-colors disabled:opacity-70 cursor-pointer">
                                    {saving ? "Saving..." : "Save Address"}
                                </button>
                                <button type="button" onClick={() => { setViewState("list"); setEditingId(null); }} className="border border-[#E5E5E5] px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors cursor-pointer">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
            
            {activeTab === "settings" && <div className="p-10 text-center bg-gray-50 text-gray-400">Settings Form</div>}
          </div>
        </div>
      </div>
      
    </main>
  );
}