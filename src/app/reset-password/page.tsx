"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, CheckCircle, Lock } from "lucide-react";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // 👈 New Success State
  const [error, setError] = useState(""); // 👈 Inline Error State

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
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
        setIsSuccess(true); // 👈 Trigger Success View
        // Optional: Auto-redirect after 3 seconds, or let them click
        // setTimeout(() => router.push("/login"), 3000); 
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
        <div className="text-center">
            <div className="text-red-500 font-bold mb-4">Invalid Link</div>
            <Link href="/forgot-password" className="text-sm underline">Request a new one</Link>
        </div>
    );
  }

  // 👇 VIEW 1: SUCCESS MESSAGE
  if (isSuccess) {
    return (
      <div className="text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <CheckCircle size={32} />
        </div>
        <h1 className="text-2xl font-serif text-[#1A1A1A] mb-4">Password Reset!</h1>
        <p className="text-gray-500 mb-8">
          Your password has been successfully updated. You can now log in with your new credentials.
        </p>
        
        <Link 
            href="/login" 
            className="block w-full bg-[#1A1A1A] text-white py-3 rounded-md font-bold hover:bg-[#B87E58] transition-colors"
        >
            Login Now
        </Link>
      </div>
    );
  }

  // 👇 VIEW 2: THE FORM
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        
      {/* Inline Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-md text-center">
            {error}
        </div>
      )}

      <div className="relative">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">New Password</label>
        <div className="relative">
            <input 
            type={showPassword ? "text" : "password"} 
            required minLength={6}
            className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#B87E58] outline-none"
            placeholder="Enter new secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
        </div>
      </div>

      <button 
        type="submit" disabled={loading}
        className="w-full bg-[#1A1A1A] text-white py-3 rounded-md font-bold hover:bg-[#B87E58] transition-colors flex justify-center items-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : "Set New Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        
        {/* Header Icon */}
        <div className="text-center mb-6">
             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-[#1A1A1A]">
                <Lock size={20} />
            </div>
        </div>

        <h1 className="text-2xl font-serif text-[#1A1A1A] mb-2 text-center">Reset Password</h1>
        
        <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
            <ResetForm />
        </Suspense>

      </div>
    </div>
  );
}