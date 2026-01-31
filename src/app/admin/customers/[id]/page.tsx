"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Mail, Phone, Calendar, MapPin, 
  ShoppingBag, DollarSign, User, ShieldCheck, CreditCard, 
  Trash2, Shield, ShieldAlert, X, AlertTriangle, CheckCircle 
} from "lucide-react";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalSpent: 0, avgOrder: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // 👇 STATE: Toast Notifications
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // 👇 STATE: Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning';
    onConfirm: () => Promise<void>;
  } | null>(null);

  // Helper: Show Toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const id = params.id as string;
        const identityQuery = `*[_id == $id][0]`;
        const doc = await client.fetch(identityQuery, { id });

        if (!doc) { setLoading(false); return; }

        let email = "", name = "", phone = "", joinDate = "", role = "customer", isRegistered = false;

        if (doc._type === 'user' || doc._type === 'User') {
            email = doc.email; name = doc.name; role = doc.role || "customer"; joinDate = doc._createdAt; isRegistered = true;
        } else if (doc._type === 'order') {
            email = doc.email; name = doc.customerName; phone = doc.phone; joinDate = doc.orderDate; isRegistered = false;
        }

        if (email) {
            const historyQuery = `*[_type == "order" && email == $email] | order(orderDate desc) {
                _id, orderNumber, orderDate, totalPrice, status, phone, shippingAddress, items[]{ quantity, price, product->{name, "image": images[0].asset->url} }
            }`;
            const orderHistory = await client.fetch(historyQuery, { email });
            setOrders(orderHistory);

            if (!phone && orderHistory.length > 0) {
                 const orderWithPhone = orderHistory.find((o: any) => o.phone);
                 if (orderWithPhone) phone = orderWithPhone.phone;
            }

            const total = orderHistory.reduce((sum: number, ord: any) => sum + (ord.totalPrice || 0), 0);
            setStats({ totalSpent: total, avgOrder: orderHistory.length > 0 ? Math.round(total / orderHistory.length) : 0 });
        }

        setCustomer({ id: doc._id, name, email, phone, joinDate, role, isRegistered });

      } catch (error) { console.error("Error loading profile:", error); } 
      finally { setLoading(false); }
    };
    if (params.id) fetchCustomerData();
  }, [params.id]);

  // LOGIC: The Actual Role Change (Passed to Modal)
  const processRoleChange = async (newRole: string) => {
    setActionLoading(true);
    setConfirmModal(null); 
    try {
        const response = await fetch("/api/customers/update", {
            method: "POST",
            body: JSON.stringify({ userId: customer.id, action: "updateRole", role: newRole })
        });

        if (!response.ok) throw new Error("Failed to update");

        setCustomer({ ...customer, role: newRole });
        showToast(`User is now an ${newRole}`, "success");
    } catch(err) { 
        showToast("Failed to update role", "error"); 
    } finally { 
        setActionLoading(false); 
    }
  };

  // LOGIC: The Actual Delete (Passed to Modal)
  const processDeleteUser = async () => {
    setActionLoading(true);
    setConfirmModal(null);
    try {
        const response = await fetch("/api/customers/update", {
            method: "POST",
            body: JSON.stringify({ userId: customer.id, action: "delete" })
        });

        // 👇 THIS CHECK IS CRITICAL
        if (!response.ok) throw new Error("Failed to delete");

        showToast("User deleted successfully", "success");
        setTimeout(() => router.push("/admin/customers"), 1500); 
    } catch(err) { 
        console.error(err);
        showToast("Failed to delete user. Check console.", "error"); 
        setActionLoading(false);
    }
  };

  // 👇 TRIGGER: Open Modal for Role Change
  const confirmRoleChange = (newRole: string) => {
    setConfirmModal({
        isOpen: true,
        title: newRole === 'admin' ? "Promote to Admin?" : "Revoke Admin Access?",
        message: newRole === 'admin' 
            ? "This user will have full access to your store dashboard, inventory, and settings."
            : "This user will lose access to the admin dashboard immediately.",
        type: 'warning',
        onConfirm: () => processRoleChange(newRole)
    });
  };

  // 👇 TRIGGER: Open Modal for Delete
  const confirmDelete = () => {
    setConfirmModal({
        isOpen: true,
        title: "Delete User Account?",
        message: "This action cannot be undone. This will permanently delete their login credentials. Order history will remain.",
        type: 'danger',
        onConfirm: () => processDeleteUser()
    });
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Profile...</div>;
  if (!customer) return <div className="p-10 text-center text-red-500">Customer not found.</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8 relative">
      
      {/* 👇 CUSTOM CONFIRMATION MODAL */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 m-4 relative border border-gray-100">
                <button 
                    onClick={() => setConfirmModal(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 ${
                        confirmModal.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'
                    }`}>
                        <AlertTriangle size={28} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{confirmModal.title}</h3>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed px-4">
                        {confirmModal.message}
                    </p>
                    
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setConfirmModal(null)}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmModal.onConfirm}
                            className={`flex-1 px-4 py-3 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-md transition-transform active:scale-95 ${
                                confirmModal.type === 'danger' 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-[#B87E58] hover:bg-[#A66D4A]'
                            }`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 👇 TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-xl z-[110] flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300 ${
            notification.type === 'success' ? 'bg-[#1A1A1A] text-white' : 'bg-red-600 text-white'
        }`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <div>
                <h4 className="font-bold text-sm">{notification.type === 'success' ? "Success" : "Error"}</h4>
                <p className="text-xs opacity-90">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-2 opacity-70 hover:opacity-100"><X size={16}/></button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 border rounded-md hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            {customer.name}
            {customer.role === 'admin' && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full uppercase">Admin</span>}
          </h1>
          <p className="text-sm text-gray-500">{customer.isRegistered ? "Registered Member" : "Guest Customer"}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><DollarSign size={24} /></div>
             <div><p className="text-xs font-bold text-gray-400 uppercase">Lifetime Spend</p><h3 className="text-2xl font-bold text-[#1A1A1A]">${stats.totalSpent.toLocaleString()}</h3></div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><ShoppingBag size={24} /></div>
             <div><p className="text-xs font-bold text-gray-400 uppercase">Total Orders</p><h3 className="text-2xl font-bold text-[#1A1A1A]">{orders.length}</h3></div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center"><CreditCard size={24} /></div>
             <div><p className="text-xs font-bold text-gray-400 uppercase">Avg. Order Value</p><h3 className="text-2xl font-bold text-[#1A1A1A]">${stats.avgOrder.toLocaleString()}</h3></div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Order History */}
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100"><h3 className="font-bold text-[#1A1A1A]">Order History</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No orders found.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} onClick={() => router.push(`/admin/orders/${order._id}`)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                        <td className="px-6 py-4 font-medium text-[#1A1A1A]">#{order.orderNumber}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{order.status || 'Pending'}</span></td>
                                        <td className="px-6 py-4 text-right font-bold">${order.totalPrice?.toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                  </div>
              </div>
          </div>

          {/* RIGHT: Profile & Actions */}
          <div className="space-y-6">
              
              {/* Contact Info */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-[#1A1A1A] mb-6 flex items-center gap-2"><User size={18} /> Contact Info</h3>
                  <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400"><Mail size={14} /></div>
                          <div><p className="text-xs font-bold text-gray-400 uppercase">Email</p><a href={`mailto:${customer.email}`} className="text-sm text-[#B87E58] hover:underline font-medium">{customer.email}</a></div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400"><Phone size={14} /></div>
                          <div><p className="text-xs font-bold text-gray-400 uppercase">Phone</p><p className="text-sm text-[#1A1A1A] font-medium">{customer.phone || "N/A"}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400"><Calendar size={14} /></div>
                          <div><p className="text-xs font-bold text-gray-400 uppercase">First Seen</p><p className="text-sm text-[#1A1A1A] font-medium">{customer.joinDate ? new Date(customer.joinDate).toLocaleDateString() : "N/A"}</p></div>
                      </div>
                  </div>
              </div>

              {/* Default Address */}
              {orders.length > 0 && (orders[0] as any).shippingAddress && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2"><MapPin size={18} /> Default Address</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{(orders[0] as any).shippingAddress}</p>
                  </div>
              )}

              {/* 👇 MANAGEMENT ACTIONS (Only for Registered Users) */}
              {customer.isRegistered && (
                  <div className="bg-white p-6 rounded-lg border border-red-100 shadow-sm">
                      <h3 className="font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                          <ShieldAlert size={18} className="text-red-500"/> Danger Zone
                      </h3>
                      <div className="space-y-3">
                          
                          {/* Role Toggle */}
                          {customer.role === 'admin' ? (
                              <button 
                                onClick={() => confirmRoleChange('customer')} // 👈 Use updated handler
                                disabled={actionLoading}
                                className="w-full py-2 border border-gray-300 text-gray-700 text-xs font-bold uppercase rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                              >
                                  <Shield size={14} /> Remove Admin Access
                              </button>
                          ) : (
                              <button 
                                onClick={() => confirmRoleChange('admin')} // 👈 Use updated handler
                                disabled={actionLoading}
                                className="w-full py-2 bg-purple-600 text-white text-xs font-bold uppercase rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                              >
                                  <ShieldCheck size={14} /> Promote to Admin
                              </button>
                          )}

                          {/* Delete User */}
                          <button 
                             onClick={confirmDelete} // 👈 Use updated handler
                             disabled={actionLoading}
                             className="w-full py-2 bg-red-50 text-red-600 border border-red-100 text-xs font-bold uppercase rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                          >
                              <Trash2 size={14} /> Delete User
                          </button>
                      </div>
                  </div>
              )}

          </div>
      </div>
    </div>
  );
}