"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false); // 👈 New State for Success UI

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // We treat all 200 responses as success (security practice)
      if (res.ok) {
        setIsSent(true); // 👈 Trigger the Success View
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        
        {/* 👇 VIEW 1: SUCCESS MESSAGE (Shows after sending) */}
        {isSent ? (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <CheckCircle size={32} />
            </div>
            <h1 className="text-2xl font-serif text-[#1A1A1A] mb-4">Email Sent!</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              We have sent a password reset link to <span className="font-bold text-gray-800">{email}</span>.
              <br/>Please check your inbox (and spam folder).
            </p>
            
            <Link 
                href="/login" 
                className="inline-block w-full bg-[#1A1A1A] text-white py-3 rounded-md font-bold hover:bg-[#B87E58] transition-colors"
            >
                Return to Login
            </Link>
            
            <button 
                onClick={() => setIsSent(false)}
                className="mt-6 text-xs text-gray-400 hover:text-gray-600 hover:underline"
            >
                Click here to try a different email
            </button>
          </div>
        ) : (
          
          /* 👇 VIEW 2: THE FORM (Default) */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#1A1A1A]">
                <Mail size={28} />
            </div>
            <h1 className="text-2xl font-serif text-[#1A1A1A] mb-2">Forgot Password?</h1>
            <p className="text-sm text-gray-500 mb-8">
              No worries! Enter your email and we'll send you a reset instructions.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                <input 
                  type="email" required
                  className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#B87E58] outline-none transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-[#1A1A1A] text-white py-3 rounded-md font-bold hover:bg-[#B87E58] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#1A1A1A] transition-colors">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}