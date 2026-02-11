"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Eye, EyeOff, ArrowRight, Check, AlertCircle, CheckCircle } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

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
        const res = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (res?.error) {
          setError("Invalid email or password");
        } else {
          const session = await getSession();
          // @ts-ignore
          if (session?.user?.role === 'admin') {
             router.push("/admin/dashboard");
          } else {
             router.push("/");
          }
          router.refresh();
        }

      } else {
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
    <div className="flex min-h-screen bg-white font-sans">
      
      {/* --- LEFT: FORM SECTION --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 pt-32 pb-12 animate-in slide-in-from-left-4 duration-700">
        
        <div className="max-w-[440px] mx-auto w-full">
            {/* Header */}
            <div className="mb-10 text-center lg:text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">
                    {isLogin ? "Welcome Back" : "Join Us"}
                </span>
                <h1 className="font-serif text-4xl lg:text-5xl text-primary mb-4">
                    {isLogin ? "Sign In" : "Create Account"}
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                    {isLogin 
                        ? "Enter your details below to access your account and manage orders." 
                        : "Register now to track your orders, access your wishlist, and speed up checkout."}
                </p>
            </div>

            {/* Error / Success Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wide flex items-center gap-3 border-l-2 border-red-500">
                    <AlertCircle size={16} /> {error}
                </div>
            )}
            {success && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide flex items-center gap-3 border-l-2 border-green-500">
                    <CheckCircle size={16} /> {success}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {!isLogin && (
                    <div className="group animate-in fade-in slide-in-from-top-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-primary transition-colors">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border-b border-gray-200 py-3 text-primary outline-none focus:border-primary transition-all placeholder:text-gray-300 bg-transparent"
                            placeholder="e.g. Jane Doe"
                            required={!isLogin}
                        />
                    </div>
                )}

                <div className="group">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-primary transition-colors">Email Address</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-b border-gray-200 py-3 text-primary outline-none focus:border-primary transition-all placeholder:text-gray-300 bg-transparent"
                        placeholder="e.g. jane@example.com"
                        required
                    />
                </div>

                <div className="group relative">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-primary transition-colors">Password</label>
                        {isLogin && <Link href="/forgot-password" className="text-[10px] text-gray-400 hover:text-secondary underline">Forgot?</Link>}
                    </div>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border-b border-gray-200 py-3 text-primary outline-none focus:border-primary transition-all placeholder:text-gray-300 bg-transparent pr-10"
                        placeholder="••••••••"
                        required
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 bottom-3 text-gray-400 hover:text-primary transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-white h-14 text-xs font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-primary/10 mt-8"
                >
                    {loading ? "Processing..." : (isLogin ? "Sign In" : "Register Now")} 
                    {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>}
                </button>

            </form>

            {/* Toggle Login/Register */}
            <div className="mt-8 text-center text-sm text-gray-500">
                {isLogin ? "New to Tyaara Trends? " : "Already have an account? "}
                <button 
                    onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}
                    className="text-primary font-bold hover:text-secondary underline decoration-1 underline-offset-4 transition-colors"
                >
                    {isLogin ? "Create an Account" : "Sign In"}
                </button>
            </div>

            {/* Divider */}
            <div className="relative my-10">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-white px-4 text-gray-400">Or Continue With</span></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
                <button 
                    type="button"
                    onClick={() => signIn("google")}
                    className="flex items-center justify-center gap-2 border border-gray-200 h-12 hover:border-primary hover:bg-gray-50 transition-all"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    <span className="text-xs font-bold text-gray-600">Google</span>
                </button>
                <button 
                    type="button"
                    className="flex items-center justify-center gap-2 border border-gray-200 h-12 hover:border-primary hover:bg-gray-50 transition-all"
                >
                    <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>
                    <span className="text-xs font-bold text-gray-600">Facebook</span>
                </button>
            </div>
        </div>
      </div>

      {/* --- RIGHT: IMAGE SECTION --- */}
      <div className="hidden lg:block w-1/2 relative bg-[#F9F9F9]">
        <div className="absolute inset-0">
            {/* Replace with your actual image path */}
            <img 
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075&auto=format&fit=crop" 
                alt="Luxury Jewelry Background" 
                className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-[2s]"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
        </div>
        
        {/* Floating Content Box */}
        <div className="absolute bottom-20 left-12 right-12 bg-white/90 backdrop-blur-md p-10 border border-white/50 shadow-2xl animate-in slide-in-from-bottom-8 duration-1000 delay-200">
            <h2 className="font-serif text-3xl text-primary mb-4">The World of Tyaara</h2>
            <ul className="space-y-4">
                {[
                    "Exclusive access to limited edition collections",
                    "Complimentary shipping & returns worldwide",
                    "Personalized jewelry recommendations"
                ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-center text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                            <Check size={12} />
                        </div>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
      </div>

    </div>
  );
}