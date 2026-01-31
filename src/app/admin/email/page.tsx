"use client";

import { useState } from "react";
import { Send, Loader2, Link as LinkIcon, User } from "lucide-react";
import toast from "react-hot-toast"; // 👈 Import Toast

export default function AdminEmailPage() {
  const [formData, setFormData] = useState({
    to: "",
    name: "",
    subject: "",
    message: "",
    buttonText: "",
    buttonUrl: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 👇 1. Show Loading Notification
    const toastId = toast.loading("Sending email...");

    try {
        const res = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to send");
        }

        // 👇 2. Show Success Notification
        toast.success("Email sent successfully!", { id: toastId });
        
        // Clear form
        setFormData({ to: "", name: "", subject: "", message: "", buttonText: "", buttonUrl: "" });

    } catch (error: any) {
        console.error("Error:", error);
        // 👇 3. Show Error Notification
        toast.error(error.message || "Failed to send email", { id: toastId });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#1A1A1A] font-serif">Compose Marketing Email</h1>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM */}
        <form onSubmit={handleSend} className="lg:col-span-2 space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">To (Email)</label>
                    <input 
                        type="email" required placeholder="customer@example.com"
                        className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#B87E58] outline-none"
                        value={formData.to}
                        onChange={(e) => setFormData({...formData, to: e.target.value})}
                    />
                </div>
                <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Customer Name</label>
                    <div className="relative">
                        <input 
                            type="text" placeholder="John"
                            className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#B87E58] outline-none pl-9"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <User size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject Line</label>
                <input 
                    type="text" required placeholder="Exclusive Offer..."
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#B87E58] outline-none"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message Content</label>
                <textarea 
                    required rows={8}
                    placeholder="Write your email content..."
                    className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#B87E58] outline-none font-sans"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
            </div>

            <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                    <LinkIcon size={16} /> Add a Button (Optional)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        type="text" placeholder="Button Text (e.g. Shop Now)"
                        className="w-full p-2 border border-gray-200 rounded text-sm"
                        value={formData.buttonText}
                        onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                    />
                    <input 
                        type="url" placeholder="https://..."
                        className="w-full p-2 border border-gray-200 rounded text-sm"
                        value={formData.buttonUrl}
                        onChange={(e) => setFormData({...formData, buttonUrl: e.target.value})}
                    />
                </div>
            </div>

            <button 
                type="submit" disabled={loading}
                className="w-full bg-[#1A1A1A] text-white py-4 rounded-md font-bold hover:bg-[#B87E58] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 tracking-widest uppercase text-xs"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={16} />}
                {loading ? "Sending..." : "Send Campaign"}
            </button>
        </form>

        {/* PREVIEW */}
        <div className="hidden lg:block">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-4">Live Preview</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white min-h-[500px]">
                <div className="bg-[#1A1A1A] p-6 text-center">
                    <span className="text-white font-serif text-xl tracking-widest font-bold">TRAAYA</span>
                </div>
                <div className="p-8 space-y-4">
                    <p className="font-bold text-[#1A1A1A] text-lg">Hi {formData.name || "Customer"},</p>
                    <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {formData.message || "Your message will appear here..."}
                    </div>
                    {formData.buttonText && (
                        <div className="text-center pt-6">
                            <span className="bg-[#B87E58] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-sm inline-block">
                                {formData.buttonText}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}