"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { Plus, TicketPercent, Trash2, Calendar, CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";
import Link from "next/link";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for Toast & Modal
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null } | null>(null);

  // Helper: Show Toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const query = `*[_type == "coupon"] | order(_createdAt desc) {
            _id, code, discountType, value, isActive, expiryDate
        }`;
        const data = await client.fetch(query);
        setCoupons(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchCoupons();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
        const newStatus = !currentStatus;
        setCoupons(coupons.map(c => c._id === id ? { ...c, isActive: newStatus } : c));

        const response = await fetch("/api/coupons/update", {
            method: "POST",
            body: JSON.stringify({ id, action: 'toggle', isActive: newStatus })
        });

        if (!response.ok) throw new Error("Failed");
        showToast(newStatus ? "Coupon Activated" : "Coupon Deactivated", "success");
    } catch (error) {
        showToast("Error updating status", "error");
        setCoupons(coupons.map(c => c._id === id ? { ...c, isActive: currentStatus } : c));
    }
  };

  // 1. Opens the Modal
  const openDeleteModal = (id: string) => {
    setConfirmModal({ isOpen: true, id });
  };

  // 2. Actually Deletes (Called by Modal)
  const confirmDelete = async () => {
    if (!confirmModal?.id) return;
    const id = confirmModal.id;
    setConfirmModal(null); // Close modal

    try {
        setCoupons(coupons.filter(c => c._id !== id)); // Optimistic remove

        const response = await fetch("/api/coupons/update", {
            method: "POST",
            body: JSON.stringify({ id, action: 'delete' })
        });

        if (!response.ok) throw new Error("Failed");
        showToast("Coupon deleted successfully", "success");
    } catch (error) {
        showToast("Error deleting coupon", "error");
        window.location.reload(); 
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Coupons...</div>;

  return (
    <div className="space-y-6 relative">
      
      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 m-4 border border-gray-100 relative">
                <button 
                    onClick={() => setConfirmModal(null)}
                    // 👇 Added cursor-pointer
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <Trash2 size={24} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Delete Coupon?</h3>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed px-2">
                        Are you sure you want to remove this coupon? This action cannot be undone.
                    </p>
                    
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setConfirmModal(null)}
                            // 👇 Added cursor-pointer
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmDelete}
                            // 👇 Added cursor-pointer
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-red-700 shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-xl z-[110] flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300 ${
            notification.type === 'success' ? 'bg-[#1A1A1A] text-white' : 'bg-red-600 text-white'
        }`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <div>
                <h4 className="font-bold text-sm">{notification.type === 'success' ? "Success" : "Error"}</h4>
                <p className="text-xs opacity-90">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-2 opacity-70 hover:opacity-100 cursor-pointer"><X size={16}/></button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">Coupons</h1>
        <Link 
            href="/admin/coupons/create" 
            // 👇 Added cursor-pointer
            className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-[#B87E58] transition-colors cursor-pointer"
        >
            <Plus size={16} /> Create Coupon
        </Link>
      </div>

      {/* Coupon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
            <div key={coupon._id} className={`bg-white p-6 rounded-lg border shadow-sm relative overflow-hidden group ${coupon.isActive ? 'border-gray-200' : 'border-red-100 opacity-75'}`}>
                
                <div className="absolute -right-6 -top-6 text-gray-50 opacity-50 rotate-12 group-hover:rotate-0 transition-transform">
                    <TicketPercent size={100} />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-gray-100 px-3 py-1 rounded text-lg font-mono font-bold text-[#1A1A1A] tracking-wider border border-dashed border-gray-300">
                            {coupon.code}
                        </div>
                        {/* 👇 Added cursor-pointer to Trash Icon */}
                        <button onClick={() => openDeleteModal(coupon._id)} className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className="mb-4">
                        <span className="text-3xl font-bold text-[#1A1A1A]">
                            {coupon.discountType === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                        </span>
                        <span className="text-sm text-gray-500 ml-1 font-medium">OFF</span>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : "No Expiry"}
                        </div>
                        <button 
                            onClick={() => toggleStatus(coupon._id, coupon.isActive)}
                            // 👇 Added cursor-pointer
                            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide w-fit px-2 py-1 rounded cursor-pointer transition-colors ${coupon.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                        >
                            {coupon.isActive ? <><CheckCircle size={12}/> Active</> : <><XCircle size={12}/> Inactive</>}
                        </button>
                    </div>
                </div>
            </div>
        ))}
        
        {coupons.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <TicketPercent size={48} className="mx-auto mb-4 opacity-20" />
                <p>No coupons found. Create your first one!</p>
            </div>
        )}
      </div>
    </div>
  );
}