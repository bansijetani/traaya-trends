"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Loader2, Lock, Tag, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Price from "@/components/Price"; 
import toast from "react-hot-toast";

import PaymentMethods from "@/components/PaymentMethods";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();

  // --- FORM STATES ---
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // --- COUPON STATES ---
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [discountSuccess, setDiscountSuccess] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // --- HYDRATION FIX ---
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // --- CALCULATIONS ---
  const subtotal = cartTotal;
  const shipping = subtotal > 200 ? 0 : 15.00;
  // Final total after shipping and discounts
  const total = Math.max(0, subtotal - discount + shipping);

  // --- HANDLERS ---
  const handleApplyCoupon = async () => {
      if(!couponCode) return;
      if (!email) {
          setDiscountError("Please enter your email address first.");
          return;
      }
      setValidatingCoupon(true);
      setDiscountError("");
      setDiscountSuccess("");

      try {
          const response = await fetch("/api/checkout/validate-coupon", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: couponCode, email: email, orderTotal: subtotal }),
          });
          const data = await response.json();

          if (!response.ok) {
              setDiscountError(data.message);
              setDiscount(0);
          } else {
              setDiscountSuccess(data.message);
              let discountAmount = 0;
              if (data.discountType === 'percentage') {
                  discountAmount = (subtotal * data.value) / 100;
              } else {
                  discountAmount = data.value;
              }
              setDiscount(Math.min(discountAmount, subtotal));
          }
      } catch (error) {
          setDiscountError("Failed to apply coupon");
      } finally {
          setValidatingCoupon(false);
      }
  };

  // We are keeping this in case you want to use it for a "Cash on Delivery" option later, 
  // but standard orders will now go through PaymentMethods (Stripe/PayPal)
  const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        // Custom order logic
  };

  if (!isClient) return null;

  return (
    <div className="bg-white min-h-screen pt-40 pb-24 px-6 font-sans text-[#1A1A1A]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Page Title */}
        <div className="mb-12 mt-4 text-left">
            <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">Secure Checkout</h1>
            <div className="flex items-center justify-start gap-3 text-xs tracking-widest uppercase text-gray-400">
                <span className="text-primary font-bold">Shipping</span>
                <ChevronRight size={10} />
                <span>Payment</span>
                <ChevronRight size={10} />
                <span>Review</span>
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* ================= LEFT: SHIPPING FORM ================= */}
            <div className="lg:col-span-7 space-y-10">
                
                {/* Contact Info Box */}
                <div className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm">
                    <div className="flex justify-between items-baseline mb-6">
                        <h2 className="font-serif text-xl text-primary">Contact Information</h2>
                        <Link href="/login" className="text-xs font-bold uppercase text-secondary hover:text-primary transition-colors border-b border-secondary/30 pb-0.5">
                            Log in
                        </Link>
                    </div>
                    
                    <div className="space-y-4">
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all text-sm placeholder:text-gray-400 rounded-sm outline-none"
                        />
                        <div className="flex items-center gap-3">
                             <input type="checkbox" id="newsletter" className="accent-primary w-4 h-4 cursor-pointer" />
                             <label htmlFor="newsletter" className="text-xs text-gray-500 cursor-pointer select-none">Keep me updated on news and exclusive offers</label>
                        </div>
                    </div>
                </div>

                {/* Shipping Address Box */}
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white border border-gray-100 p-8 rounded-sm shadow-sm">
                    <h2 className="font-serif text-xl text-primary mb-6">Shipping Address</h2>
                    
                    <div className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                             <input 
                                type="text" 
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                                className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all text-sm rounded-sm outline-none" 
                             />
                             <input 
                                type="text" 
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                                className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all text-sm rounded-sm outline-none" 
                             />
                        </div>

                        <input 
                            type="text" 
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Address"
                            className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all text-sm rounded-sm outline-none" 
                        />

                        <input 
                            type="text" 
                            placeholder="Apartment, suite, etc. (optional)"
                            className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all text-sm rounded-sm outline-none" 
                        />

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                            <input 
                                type="text" 
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                                className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all text-sm rounded-sm outline-none" 
                            />
                            <div className="relative">
                                <select 
                                    defaultValue="" 
                                    className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all text-sm text-gray-600 appearance-none rounded-sm cursor-pointer outline-none"
                                >
                                    <option value="" disabled>State</option>
                                    <option>NY</option>
                                    <option>CA</option>
                                    <option>TX</option>
                                </select>
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={12}/>
                            </div>
                            <input 
                                type="text" 
                                required
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                placeholder="Zip Code"
                                className="col-span-2 md:col-span-1 w-full h-12 px-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all text-sm rounded-sm outline-none" 
                            />
                        </div>

                        <input 
                            type="tel" 
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone Number"
                            className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all text-sm rounded-sm outline-none" 
                        />
                    </div>
                </form>

                <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
                    <ChevronLeft size={14} /> Return to Cart
                </Link>
            </div>


            {/* ================= RIGHT: ORDER SUMMARY ================= */}
            <div className="lg:col-span-5">
                <div className="bg-[#F9F9F9] p-8 lg:p-10 rounded-sm sticky top-32 border border-gray-100 shadow-sm">
                    <h3 className="font-serif text-xl text-primary mb-6 pb-4 border-b border-gray-200">Order Summary</h3>
                    
                    {/* Cart Items */}
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-gray-200">
                        {items.length === 0 ? (
                            <p className="text-sm italic text-gray-400 text-center py-4">Your cart is empty.</p>
                        ) : (
                            items.map((item, index) => (
                                <div key={item._id || index} className="flex gap-4 items-center group">
                                    <div className="relative w-14 h-16 bg-white border border-gray-200 rounded-sm overflow-hidden flex-shrink-0">
                                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[9px] font-bold flex items-center justify-center rounded-full z-10">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-serif text-sm text-primary line-clamp-1">{item.name}</h4>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-medium text-sm text-primary">
                                        <Price amount={item.price * item.quantity} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Coupon Input */}
                    <div className="flex gap-2 mb-6">
                        <input 
                            type="text" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Discount Code" 
                            className="flex-1 h-10 px-3 bg-white border border-gray-200 rounded-sm focus:border-primary outline-none text-xs uppercase placeholder:normal-case"
                        />
                        <button 
                            onClick={handleApplyCoupon}
                            disabled={validatingCoupon || !couponCode}
                            className="h-10 px-4 bg-white border border-gray-200 text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {validatingCoupon ? <Loader2 className="animate-spin" size={12} /> : "Apply"}
                        </button>
                    </div>

                    {/* Messages */}
                    {discountError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 flex items-center gap-2 text-xs text-red-600 rounded-sm">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {discountError}
                        </div>
                    )}
                    {discountSuccess && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-100 flex items-center gap-2 text-xs text-green-700 rounded-sm">
                            <CheckCircle size={12} /> {discountSuccess}
                        </div>
                    )}

                    {/* Totals */}
                    <div className="space-y-3 pt-4 border-t border-gray-200 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium text-primary"><Price amount={subtotal} /></span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            {shipping === 0 ? (
                                <span className="text-xs font-bold uppercase tracking-wider text-green-600">Free</span>
                            ) : (
                                <span className="font-medium text-primary"><Price amount={shipping} /></span>
                            )}
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-green-700">
                                <span className="flex items-center gap-1.5"><Tag size={12}/> Discount</span>
                                <span className="font-medium">-<Price amount={discount} /></span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-baseline pt-4 mt-4 mb-8 border-t border-gray-200">
                        <span className="font-serif text-lg text-primary">Total</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[10px] text-gray-400">USD</span>
                            <span className="font-serif text-2xl text-primary font-bold">
                                <Price amount={total} />
                            </span>
                        </div>
                    </div>

                    {/* 👇 NEW PAYMENT COMPONENT (Replaces the old Submit button) */}
                    <PaymentMethods cartItems={items} totalPrice={total} />

                    <div className="mt-6 flex justify-center items-center gap-2 text-[10px] text-gray-400 opacity-80">
                        <Lock size={10} /> Secure SSL Encryption
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}