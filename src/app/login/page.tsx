"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Eye, EyeOff, ArrowRight, Check, AlertCircle, CheckCircle } from "lucide-react";
// 👇 1. Import NextAuth functions
import { signIn, getSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  
  // UI State
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // ------------------------------------------------
        // 👇 LOGIN LOGIC (Using NextAuth)
        // ------------------------------------------------
        const res = await signIn("credentials", {
          redirect: false, // Prevent auto-redirect so we can check role
          email: formData.email,
          password: formData.password,
        });

        if (res?.error) {
          setError("Invalid email or password");
        } else {
          // Login Successful - Check Session for Role
          const session = await getSession();
          
          // Role-based Redirect
          // @ts-ignore
          if (session?.user?.role === 'admin') {
             router.push("/admin/dashboard");
          } else {
             router.push("/");
          }
          router.refresh();
        }

      } else {
        // ------------------------------------------------
        // 👇 REGISTRATION LOGIC (Custom API)
        // ------------------------------------------------
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        // Registration Success
        setIsLogin(true);
        setSuccess("Account created successfully! Please log in.");
        setFormData({ name: "", email: "", password: "" }); 
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white text-[#1A1A1A] min-h-screen flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center pt-[160px] pb-24 px-4 sm:px-6">
        
        {/* --- MAIN CARD --- */}
        <div className="w-full max-w-[1000px] bg-white grid grid-cols-1 md:grid-cols-2 shadow-2xl overflow-hidden rounded-sm border border-[#F0F0F0]">
          
          {/* LEFT SIDE: FORM */}
          <div className="p-8 md:p-16 flex flex-col justify-center order-2 md:order-1">
            <h1 className="font-serif text-3xl md:text-4xl mb-2 text-[#1A1A1A]">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm text-[#888] mb-8">
              {isLogin 
                ? "Please enter your details to sign in." 
                : "Register to track orders and save your wishlist."}
            </p>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2 rounded-md animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2 rounded-md animate-in fade-in slide-in-from-top-2">
                    <CheckCircle size={18} />
                    {success}
                </div>
            )}

            {/* TOGGLE BUTTONS */}
            <div className="flex border-b border-[#E5E5E5] mb-8">
              <button 
                onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
                className={`flex-1 pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${isLogin ? "text-[#1A1A1A]" : "text-[#AAA]"}`}
              >
                Sign In
                {isLogin && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A1A1A]"></span>}
              </button>
              <button 
                onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
                className={`flex-1 pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${!isLogin ? "text-[#1A1A1A]" : "text-[#AAA]"}`}
              >
                Register
                {!isLogin && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1A1A1A]"></span>}
              </button>
            </div>

            {/* FORM FIELDS */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {!isLogin && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] mb-2 block">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-[#E5E5E5] text-sm outline-none focus:border-[#B87E58] transition-colors" 
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] mb-2 block">Email Address</label>
                <input 
                    type="email" 
                    name="email"
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-12 px-4 border border-[#E5E5E5] text-sm outline-none focus:border-[#B87E58] transition-colors" 
                    required
                />
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Password</label>
                  {isLogin && <a href="#" className="text-[10px] text-[#888] hover:text-[#B87E58] underline">Forgot Password?</a>}
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-[#E5E5E5] text-sm outline-none focus:border-[#B87E58] transition-colors pr-10" 
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-[#888] hover:text-[#1A1A1A]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B87E58] transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")} 
                {!loading && <ArrowRight size={16} />}
              </button>

            </form>

            {/* SOCIAL LOGIN */}
            <div className="mt-8 text-center">
              <span className="text-[10px] text-[#888] uppercase tracking-widest bg-white px-2 relative z-10">Or continue with</span>
              <div className="border-t border-[#E5E5E5] -mt-2 mb-6"></div>
              
              <div className="flex gap-4 justify-center">
                 <button 
                    type="button" 
                    onClick={() => signIn("google")} // 👈 Added Google Sign In Trigger
                    className="w-12 h-12 border border-[#E5E5E5] flex items-center justify-center hover:border-[#1A1A1A] transition-colors"
                 >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                 </button>
                 <button type="button" className="w-12 h-12 border border-[#E5E5E5] flex items-center justify-center hover:border-[#1A1A1A] transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/></svg>
                 </button>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE (Unchanged) */}
          <div className="hidden md:flex bg-[#F9F9F9] relative items-center justify-center p-12 order-1 md:order-2 overflow-hidden group">
            <div className="absolute inset-0 bg-[#1A1A1A]/10 z-10 group-hover:bg-[#1A1A1A]/0 transition-colors duration-700"></div>
            <img 
               src="/images/product-2.jpg" 
               alt="Luxury Jewelry" 
               className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 scale-105 group-hover:scale-110 transition-transform duration-[2s]" 
            />
            
            <div className="relative z-20 bg-white/90 backdrop-blur-sm p-8 max-w-sm text-center shadow-lg border border-[#E5E5E5]">
              <h3 className="font-serif text-2xl mb-4 text-[#B87E58]">Join Tyaara Trends</h3>
              <ul className="text-left space-y-3">
                <li className="flex gap-3 text-sm text-[#555]">
                  <div className="w-5 h-5 bg-[#E9EFE3] rounded-full flex items-center justify-center text-[#4CAF50] shrink-0"><Check size={12}/></div>
                  <span>Early access to new collections</span>
                </li>
                <li className="flex gap-3 text-sm text-[#555]">
                  <div className="w-5 h-5 bg-[#E9EFE3] rounded-full flex items-center justify-center text-[#4CAF50] shrink-0"><Check size={12}/></div>
                  <span>Exclusive member-only discounts</span>
                </li>
                <li className="flex gap-3 text-sm text-[#555]">
                  <div className="w-5 h-5 bg-[#E9EFE3] rounded-full flex items-center justify-center text-[#4CAF50] shrink-0"><Check size={12}/></div>
                  <span>Track orders & save wishlist</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}