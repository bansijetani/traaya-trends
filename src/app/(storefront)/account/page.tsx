"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { client } from "@/sanity/lib/client"; 
import { useSession } from "next-auth/react"; 
import { 
  Package, Heart, MapPin, Settings, LogOut, 
  User, Loader2, Plus, Edit2, Trash2, ChevronRight, Lock, Bell 
} from "lucide-react";
import toast from "react-hot-toast"; 
import Price from "@/components/Price";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null); 
  
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [myAddresses, setMyAddresses] = useState<any[]>([]);
  
  // View States
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    marketing: true
  });

  useEffect(() => {
    if (status === "loading") return;

    const localUserId = localStorage.getItem("user_id") || localStorage.getItem("userId");
    
    const fetchUserData = async (userId: string, email?: string) => {
        try {
            const userQuery = `*[_type == "user" && _id == $userId][0]{ 
                _id, name, email, phone, role, 
                addresses
            }`;
            const userData = await client.fetch(userQuery, { userId });
            
            if (userData) {
                const isRealAdmin = userData.role === 'admin'; 
                setUser({ ...userData, isAdmin: isRealAdmin });
                
                setMyAddresses(userData.addresses || []);
                
                // Pre-fill Settings Form
                setSettingsForm(prev => ({ 
                    ...prev, 
                    name: userData.name || "", 
                    email: userData.email || "", 
                    phone: userData.phone || "" 
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

  // --- HANDLERS ---
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const action = editingId ? "edit" : "add";
    const payloadAddress = editingId ? { ...newAddress, id: editingId } : newAddress;

    try {
        const res = await fetch("/api/user/address", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id, action, address: payloadAddress })
        });
        const data = await res.json();
        if (res.ok) {
            toast.success(editingId ? "Address Updated!" : "Address Added!");
            setMyAddresses(data.addresses); 
            setViewState("list");
            setNewAddress(initialFormState);
            setEditingId(null);
        } else { toast.error("Failed to save address"); }
    } catch (err) { toast.error("Error saving address"); } finally { setSaving(false); }
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
      } else { toast.error("Could not delete"); }
  };

  const handleEditClick = (address: any) => {
      setNewAddress({
          label: address.label, name: address.name || "", email: address.email || "",
          addressLine: address.addressLine, city: address.city, zipCode: address.zipCode,
          phone: address.phone, isDefault: address.isDefault || false
      });
      setEditingId(address.id); setViewState("form"); window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (settingsForm.newPassword && settingsForm.newPassword !== settingsForm.confirmPassword) {
        toast.error("New passwords do not match");
        setSaving(false);
        return;
    }

    // Simulate API Call (You would connect this to your backend later)
    setTimeout(() => {
        toast.success("Profile updated successfully!");
        setSettingsForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
        setSaving(false);
    }, 1500);
  };

  const currentOrders = myOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalSpent = myOrders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  if (loading || status === "loading") return (
    <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="bg-white text-primary min-h-screen font-sans pt-32 md:pt-40 pb-20">
      
      {/* HEADER */}
      <div className="max-w-[1200px] mx-auto px-6 mb-16 text-left border-b border-gray-100 pb-12">
        <h1 className="font-serif text-4xl md:text-5xl uppercase tracking-wide text-primary mb-3">My Account</h1>
        <p className="text-sm text-gray-500 font-medium">Welcome back, {user?.name || "Guest"}</p>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row gap-12 xl:gap-20">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-64 shrink-0 lg:border-r border-gray-100 lg:pr-8 lg:min-h-[500px]">
          <nav className="flex flex-col gap-1">
            {[ 
              { id: "overview", label: "Overview", icon: User }, 
              { id: "orders", label: "Order History", icon: Package }, 
              { id: "wishlist", label: "Wishlist", icon: Heart }, 
              { id: "addresses", label: "Addresses", icon: MapPin }, 
              { id: "settings", label: "Settings", icon: Settings }
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => item.id === "wishlist" ? router.push("/wishlist") : setActiveTab(item.id)} 
                className={`flex items-center gap-4 px-4 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 text-left group
                  ${activeTab === item.id ? "text-primary border-l-2 border-primary bg-gray-50 pl-5" : "text-gray-400 hover:text-primary hover:bg-gray-50"}`}
              >
                <item.icon size={16} strokeWidth={1.5} className={`transition-colors ${activeTab === item.id ? "text-primary" : "text-gray-300 group-hover:text-primary"}`} /> 
                {item.label}
              </button>
            ))}
            <div className="my-4 border-t border-gray-100"></div>
            <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors text-left">
              <LogOut size={16} strokeWidth={1.5} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-h-[500px]">
          
          {/* 1. OVERVIEW */}
          {activeTab === "overview" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="font-serif text-2xl text-primary mb-8">Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow duration-300 bg-white">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Total Orders</span>
                      <span className="text-4xl font-serif text-primary">{myOrders.length}</span>
                  </div>
                  <div className="border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow duration-300 bg-white">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Total Spent</span>
                      <span className="text-3xl font-serif text-secondary block mt-1"><Price amount={totalSpent} /></span>
                  </div>
                  <div className="border border-gray-100 p-8 text-center hover:shadow-lg transition-shadow duration-300 bg-white">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Saved Addresses</span>
                      <span className="text-4xl font-serif text-primary">{myAddresses.length}</span>
                  </div>
              </div>
            </div>
          )}

          {/* 2. ORDERS */}
          {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h2 className="font-serif text-2xl text-primary mb-8">Order History</h2>
                {myOrders.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-gray-200">
                        <Package size={32} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-400 text-sm">You haven't placed any orders yet.</p>
                        <Link href="/shop" className="text-secondary text-xs font-bold uppercase tracking-widest mt-4 inline-block hover:underline">Start Shopping</Link>
                    </div>
                ) : (
                  <div className="overflow-hidden border border-gray-100 rounded-sm">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-gray-50"><tr className="text-[10px] font-bold uppercase tracking-widest text-gray-500"><th className="py-4 pl-6">Order</th><th className="py-4">Date</th><th className="py-4">Status</th><th className="py-4">Total</th><th className="py-4 text-right pr-6">Action</th></tr></thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {currentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-5 pl-6 font-bold font-serif text-primary">#{order.orderNumber}</td>
                                    <td className="py-5 text-gray-500">{new Date(order._createdAt).toLocaleDateString()}</td>
                                    <td className="py-5"><span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-sm ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{order.status || 'Pending'}</span></td>
                                    <td className="py-5 font-medium text-secondary"><Price amount={order.totalPrice} /></td>
                                    <td className="py-5 text-right pr-6"><Link href={`/account/orders/${order._id}`} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest hover:text-secondary">Details <ChevronRight size={12}/></Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                )}
              </div>
          )}

          {/* 3. ADDRESSES */}
          {activeTab === "addresses" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                      <h2 className="font-serif text-2xl text-primary">Address Book</h2>
                      {viewState === "list" && <button onClick={() => { setViewState("form"); setEditingId(null); setNewAddress(initialFormState); }} className="bg-primary text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors flex items-center gap-2"><Plus size={14}/> Add New</button>}
                  </div>
                  {viewState === "list" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {myAddresses.length === 0 ? <div className="col-span-2 text-center py-16 border border-dashed border-gray-200"><MapPin size={32} className="mx-auto text-gray-300 mb-4" /><p className="text-gray-400 text-sm">No addresses saved yet.</p></div> : myAddresses.map((addr) => (
                              <div key={addr.id} className="group border border-gray-200 p-8 relative hover:border-primary transition-all duration-300">
                                  {addr.isDefault && <span className="absolute top-0 right-0 bg-secondary text-white text-[9px] font-bold uppercase px-3 py-1.5 tracking-widest">Default</span>}
                                  <div className="mb-6">
                                      <h4 className="font-bold text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {addr.label}</h4>
                                      <div className="text-sm text-gray-500 leading-relaxed space-y-1"><p className="font-bold text-primary text-base mb-1">{addr.name || user.name}</p><p>{addr.addressLine}</p><p>{addr.city}, {addr.zipCode}</p><p className="mt-2 text-xs">{addr.phone}</p></div>
                                  </div>
                                  <div className="flex gap-4 pt-4 border-t border-gray-100 opacity-60 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => handleEditClick(addr)} className="text-[10px] font-bold uppercase tracking-widest hover:text-secondary flex items-center gap-1 transition-colors"><Edit2 size={12}/> Edit</button>
                                      <button onClick={() => handleDeleteAddress(addr.id)} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"><Trash2 size={12}/> Delete</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <form onSubmit={handleSaveAddress} className="max-w-xl bg-gray-50 p-8 md:p-10 border border-gray-100">
                          <h3 className="font-serif text-xl text-primary mb-8 pb-2 border-b border-gray-200">{editingId ? "Edit Address" : "Add New Address"}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Address Label</label><input type="text" placeholder="e.g. Home" value={newAddress.label} onChange={(e) => setNewAddress({...newAddress, label: e.target.value})} className="w-full h-12 bg-white border border-gray-200 px-4 text-sm outline-none focus:border-primary transition-colors" required/></div>
                              <div><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Full Name</label><input type="text" placeholder="John Doe" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} className="w-full h-12 bg-white border border-gray-200 px-4 text-sm outline-none focus:border-primary transition-colors" required/></div>
                          </div>
                          <div className="mb-6"><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Email</label><input type="email" value={newAddress.email} onChange={(e) => setNewAddress({...newAddress, email: e.target.value})} className="w-full h-12 bg-white border border-gray-200 px-4 text-sm outline-none focus:border-primary transition-colors" required/></div>
                          <div className="mb-6"><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Address</label><textarea value={newAddress.addressLine} onChange={(e) => setNewAddress({...newAddress, addressLine: e.target.value})} className="w-full h-28 bg-white border border-gray-200 p-4 text-sm outline-none focus:border-primary resize-none transition-colors" required></textarea></div>
                          <div className="grid grid-cols-2 gap-6 mb-6">
                              <div><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">City</label><input type="text" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="w-full h-12 bg-white border border-gray-200 px-4 text-sm outline-none focus:border-primary transition-colors" required/></div>
                              <div><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Zip Code</label><input type="text" value={newAddress.zipCode} onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})} className="w-full h-12 bg-white border border-gray-200 px-4 text-sm outline-none focus:border-primary transition-colors" required/></div>
                          </div>
                          <div className="mb-8"><label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Phone</label><input type="tel" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} className="w-full h-12 bg-white border border-gray-200 px-4 text-sm outline-none focus:border-primary transition-colors"/></div>
                          <div className="flex items-center gap-3 py-4 border-t border-gray-200"><input type="checkbox" checked={newAddress.isDefault} onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})} id="def" className="w-4 h-4 accent-primary cursor-pointer"/><label htmlFor="def" className="text-xs font-bold uppercase tracking-widest text-gray-600 cursor-pointer select-none">Set as default address</label></div>
                          <div className="flex gap-4 mt-8"><button type="submit" disabled={saving} className="bg-primary text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors disabled:opacity-70">{saving ? "Saving..." : "Save Address"}</button><button type="button" onClick={() => { setViewState("list"); setEditingId(null); }} className="bg-white border border-gray-200 px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:border-gray-400 transition-colors">Cancel</button></div>
                      </form>
                  )}
              </div>
          )}
          
          {/* 4. SETTINGS */}
          {activeTab === "settings" && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h2 className="font-serif text-2xl text-primary mb-8">Account Settings</h2>
                <form onSubmit={handleUpdateSettings} className="max-w-2xl bg-white border border-gray-100 p-8">
                    
                    {/* Personal Info */}
                    <div className="mb-8 pb-8 border-b border-gray-100">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2"><User size={14}/> Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Full Name</label>
                                <input type="text" value={settingsForm.name} onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})} className="w-full h-12 bg-gray-50 border border-transparent px-4 text-sm focus:bg-white focus:border-primary outline-none transition-all"/>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Phone Number</label>
                                <input type="tel" value={settingsForm.phone} onChange={(e) => setSettingsForm({...settingsForm, phone: e.target.value})} className="w-full h-12 bg-gray-50 border border-transparent px-4 text-sm focus:bg-white focus:border-primary outline-none transition-all"/>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Email Address</label>
                                <input type="email" value={settingsForm.email} disabled className="w-full h-12 bg-gray-100 border border-transparent px-4 text-sm text-gray-500 cursor-not-allowed" title="Contact support to change email"/>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="mb-8 pb-8 border-b border-gray-100">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2"><Lock size={14}/> Security</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Current Password</label>
                                <input type="password" placeholder="••••••••" value={settingsForm.currentPassword} onChange={(e) => setSettingsForm({...settingsForm, currentPassword: e.target.value})} className="w-full h-12 bg-gray-50 border border-transparent px-4 text-sm focus:bg-white focus:border-primary outline-none transition-all"/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">New Password</label>
                                    <input type="password" placeholder="New Password" value={settingsForm.newPassword} onChange={(e) => setSettingsForm({...settingsForm, newPassword: e.target.value})} className="w-full h-12 bg-gray-50 border border-transparent px-4 text-sm focus:bg-white focus:border-primary outline-none transition-all"/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Confirm Password</label>
                                    <input type="password" placeholder="Confirm New Password" value={settingsForm.confirmPassword} onChange={(e) => setSettingsForm({...settingsForm, confirmPassword: e.target.value})} className="w-full h-12 bg-gray-50 border border-transparent px-4 text-sm focus:bg-white focus:border-primary outline-none transition-all"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="mb-8">
                         <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2"><Bell size={14}/> Preferences</h3>
                         <div className="flex items-center gap-3">
                            <input 
                                type="checkbox" 
                                id="marketing" 
                                checked={settingsForm.marketing} 
                                onChange={(e) => setSettingsForm({...settingsForm, marketing: e.target.checked})}
                                className="w-4 h-4 accent-primary cursor-pointer"
                            />
                            <label htmlFor="marketing" className="text-sm text-gray-600 cursor-pointer select-none">
                                Subscribe to exclusive offers and updates via email
                            </label>
                         </div>
                    </div>

                    <button type="submit" disabled={saving} className="w-full bg-primary text-white h-12 text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-colors disabled:opacity-70">
                        {saving ? "Saving Changes..." : "Save Changes"}
                    </button>

                </form>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}