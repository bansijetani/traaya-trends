"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Save, Loader2, User, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session, update } = useSession(); // 'update' lets us refresh the session data
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Load initial data from session
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || "",
        email: session.user?.email || "",
      }));
    }
  }, [session]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic Validation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        showToast("New passwords do not match", "error");
        setLoading(false);
        return;
    }

    if (formData.newPassword && !formData.currentPassword) {
        showToast("Please enter your current password to set a new one", "error");
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: formData.name,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      showToast("Profile updated successfully!", "success");
      
      // Clear password fields
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      
      // Update client-side session so the Sidebar name updates immediately
      await update({ name: formData.name });
      router.refresh();

    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300 ${
            notification.type === 'success' ? 'bg-[#1A1A1A] text-white' : 'bg-red-600 text-white'
        }`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <div>
                <h4 className="font-bold text-sm">{notification.type === 'success' ? "Success" : "Error"}</h4>
                <p className="text-xs opacity-90">{notification.message}</p>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your admin profile and security.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Profile Section */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2 bg-gray-100 rounded-full text-[#1A1A1A]">
                    <User size={20} />
                </div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">Profile Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Full Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58]" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email Address</label>
                    <input 
                        type="email" 
                        value={formData.email} 
                        disabled 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-500 cursor-not-allowed" 
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed.</p>
                </div>
            </div>
        </div>

        {/* Security Section */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2 bg-gray-100 rounded-full text-[#1A1A1A]">
                    <Lock size={20} />
                </div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">Security</h2>
            </div>

            <div className="space-y-4 max-w-md">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Current Password</label>
                    <input 
                        type="password" 
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58]" 
                    />
                </div>
                
                <div className="pt-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">New Password</label>
                    <input 
                        type="password" 
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current"
                        className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58]" 
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Confirm New Password</label>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current"
                        className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58]" 
                    />
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
            <button 
                type="submit" 
                disabled={loading}
                className="bg-[#1A1A1A] text-white px-8 py-3 rounded-md font-bold uppercase text-xs tracking-widest hover:bg-[#B87E58] transition-colors flex items-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
                {loading ? <Loader2 className="animate-spin" size={16}/> : <> <Save size={16} /> Save Changes </>}
            </button>
        </div>

      </form>
    </div>
  );
}