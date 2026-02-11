"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle, Loader2, ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setIsSent(true); 
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
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-6 py-20 font-sans">
      
      <div className="max-w-[440px] w-full">
        
        {/* 👇 VIEW 1: SUCCESS MESSAGE */}
        {isSent ? (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-[#F5F9F2] rounded-full flex items-center justify-center mx-auto mb-8 text-[#4CAF50]">
                <CheckCircle size={32} strokeWidth={1.5} />
            </div>
            
            <span className="text-xs font-bold uppercase tracking-widest text-[#4CAF50] mb-3 block">Email Sent Successfully</span>
            <h1 className="text-3xl md:text-4xl font-serif text-primary mb-4">Check Your Inbox</h1>
            
            <p className="text-gray-500 mb-10 text-sm leading-7">
              We have sent a password reset link to <br/>
              <span className="font-bold text-primary text-base">{email}</span>
            </p>
            
            <Link 
                href="/login" 
                // 👇 CHANGED TO THEME COLOR
                className="block w-full bg-primary text-white h-14 flex items-center justify-center text-xs font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all duration-300 shadow-lg shadow-primary/10"
            >
                Return to Login
            </Link>
            
            <button 
                onClick={() => setIsSent(false)}
                className="mt-8 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
            >
                Try a different email
            </button>
          </div>
        ) : (
          
          /* 👇 VIEW 2: THE FORM */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header */}
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <Mail size={24} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Account Recovery</span>
                <h1 className="text-3xl md:text-4xl font-serif text-primary mb-4">Forgot Password?</h1>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="group relative">
                <label className="absolute -top-3 left-0 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-primary transition-colors bg-white pr-2">
                    Email Address
                </label>
                <input 
                  type="email" 
                  required
                  className="w-full border-b border-gray-200 py-4 text-primary text-base outline-none focus:border-primary transition-all placeholder:text-gray-300 bg-transparent"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* 👇 CHANGED TO THEME COLOR */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white h-14 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-primary/10"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Send Reset Link"}
              </button>
            </form>

            {/* Back Link */}
            <div className="mt-10 text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors group"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Login
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}