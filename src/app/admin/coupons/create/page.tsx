"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, CheckCircle, AlertTriangle, X } from "lucide-react";

export default function CreateCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 👇 Toast State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    value: 0,
    minSpend: 0,
    expiryDate: "",
    isActive: true
  });

  // Helper: Show Toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    // Hide after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send Data to OUR API (not Sanity direct)
      const response = await fetch("/api/coupons/create", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create coupon");
      }

      // 2. Success!
      showToast("Coupon created successfully!", "success");
      
      // Redirect after a short delay so user sees the success message
      setTimeout(() => router.push("/admin/coupons"), 1500);
      
    } catch (error: any) {
      console.error("Error:", error);
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 relative">
      
      {/* 👇 TOAST NOTIFICATION COMPONENT */}
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
        <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Create New Coupon</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Coupon Code */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Coupon Code</label>
                <input 
                    type="text" 
                    placeholder="e.g. SUMMER20" 
                    className="w-full p-3 border border-gray-200 rounded-md font-mono text-lg uppercase focus:ring-2 focus:ring-[#B87E58] outline-none"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    required
                />
                <p className="text-xs text-gray-400 mt-1">Codes will be automatically saved in UPPERCASE.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Discount Type */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Type</label>
                    <select 
                        className="w-full p-3 border border-gray-200 rounded-md bg-white focus:ring-2 focus:ring-[#B87E58] outline-none"
                        value={formData.discountType}
                        onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                    </select>
                </div>

                {/* Value */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Value</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            min="0"
                            className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#B87E58] outline-none pl-8"
                            value={formData.value}
                            onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                            required
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                            {formData.discountType === 'percentage' ? '%' : '$'}
                        </span>
                    </div>
                </div>
                
                {/* Minimum Spend */}
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Minimum Spend (Optional)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            min="0"
                            placeholder="0"
                            className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#B87E58] outline-none pl-8"
                            value={formData.minSpend}
                            onChange={(e) => setFormData({...formData, minSpend: Number(e.target.value)})}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Leave as 0 if there is no minimum requirement.</p>
                </div>
            </div>

            {/* Expiry Date */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Expiry Date (Optional)</label>
                <input 
                    type="date" 
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#B87E58] outline-none"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                />
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1A1A1A] text-white py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-[#B87E58] transition-colors flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                Create Coupon
            </button>

        </form>
      </div>
    </div>
  );
}