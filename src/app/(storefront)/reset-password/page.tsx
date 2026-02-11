"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, CheckCircle, Lock, AlertCircle } from "lucide-react";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); 
  const [error, setError] = useState(""); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 
    
    if (!token) {
        setError("Invalid or missing token.");
        return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 👇 VIEW: INVALID TOKEN
  if (!token) {
    return (
        <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertCircle size={24} />
            </div>
            <h2 className="font-serif text-2xl text-primary mb-4">Invalid Link</h2>
            <p className="text-gray-500 text-sm mb-8">This password reset link is invalid or has expired.</p>
            <Link 
                href="/forgot-password" 
                className="text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary underline underline-offset-4 transition-colors"
            >
                Request a new link
            </Link>
        </div>
    );
  }

  // 👇 VIEW 1: SUCCESS MESSAGE
  if (isSuccess) {
    return (
      <div className="text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-[#F5F9F2] rounded-full flex items-center justify-center mx-auto mb-8 text-[#4CAF50]">
            <CheckCircle size={32} strokeWidth={1.5} />
        </div>
        
        <span className="text-xs font-bold uppercase tracking-widest text-[#4CAF50] mb-3 block">Update Successful</span>
        <h1 className="text-3xl md:text-4xl font-serif text-primary mb-4">Password Reset</h1>
        
        <p className="text-gray-500 mb-10 text-sm leading-7">
          Your password has been successfully updated. <br/>
          You can now log in with your new credentials.
        </p>
        
        <Link 
            href="/login" 
            className="block w-full bg-primary text-white h-14 flex items-center justify-center text-xs font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all duration-300 shadow-lg shadow-primary/10"
        >
            Login Now
        </Link>
      </div>
    );
  }

  // 👇 VIEW 2: THE FORM
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Lock size={24} strokeWidth={1.5} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Secure Your Account</span>
            <h1 className="text-3xl md:text-4xl font-serif text-primary mb-4">Reset Password</h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
              Please create a new, secure password for your account.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Inline Error Message */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 border-l-2 border-red-500">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            <div className="group relative">
                <label className="absolute -top-3 left-0 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-primary transition-colors bg-white pr-2">
                    New Password
                </label>
                <input 
                    type={showPassword ? "text" : "password"} 
                    required minLength={6}
                    className="w-full border-b border-gray-200 py-4 text-primary text-base outline-none focus:border-primary transition-all placeholder:text-gray-300 bg-transparent pr-10"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-4 text-gray-400 hover:text-primary transition-colors"
                >
                    {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
            </div>

            <button 
                type="submit" disabled={loading}
                className="w-full bg-primary text-white h-14 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-primary/10"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Set New Password"}
            </button>
        </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-6 py-20 font-sans">
      <div className="max-w-[440px] w-full">
        
        <Suspense fallback={
            <div className="flex justify-center p-12">
                <Loader2 className="animate-spin text-primary" size={24} />
            </div>
        }>
            <ResetForm />
        </Suspense>

      </div>
    </div>
  );
}