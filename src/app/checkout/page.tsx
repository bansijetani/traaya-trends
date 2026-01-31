"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();

  // Form States
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Prevent Hydration Mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // --- COUPON STATES ---
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [discountSuccess, setDiscountSuccess] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // --- CALCULATIONS ---
  const subtotal = cartTotal;
  const shipping = subtotal > 200 ? 0 : 15.00;
  
  // Final Total = Subtotal - Discount + Shipping
  const total = Math.max(0, subtotal - discount + shipping);

  // --- HANDLERS ---

  const handleApplyCoupon = async () => {
      if(!couponCode) return;

      // Require Email
      if (!email) {
          setDiscountError("Please enter your email address first to use a coupon.");
          return;
      }
      
      setValidatingCoupon(true);
      setDiscountError("");
      setDiscountSuccess("");

      try {
          const response = await fetch("/api/checkout/validate-coupon", {
              method: "POST",
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

              // Ensure discount doesn't exceed subtotal
              setDiscount(Math.min(discountAmount, subtotal));
          }
      } catch (error) {
          setDiscountError("Failed to apply coupon");
      } finally {
          setValidatingCoupon(false);
      }
  };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (couponCode && discount === 0) {
            setDiscountError("The coupon code entered is invalid. Please clear it or enter a valid code.");
            return; // Stop here! Do not send to backend.
        }

        setLoading(true);
        setDiscountError(""); // Clear any old errors
    
        const orderData = {
            firstName, 
            lastName,
            email,
            address,
            city,
            zip,
            phone,
            cartItems: items, 
            total: total, 
            discount: discount,
            couponCode: discount > 0 ? couponCode : null // Only send code if a discount is active
        };

        try {
            const response = await fetch("/api/orders/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            const data = await response.json(); // 👈 1. Parse the server response

            if (response.ok) {
                clearCart(); 
                // This proves this specific browser just placed this specific order
                localStorage.setItem("latest_order_id", data.orderNumber);
                router.push(`/order-success?orderNumber=${data.orderNumber}`);
            } else {
                // 👇 2. Handle the "Sneaky User" Error
                if (data.message && data.message.includes("Coupon")) {
                    // Show the error in the red text area under the coupon box
                    setDiscountError(data.message); 
                    // Remove the invalid discount immediately
                    setDiscount(0);
                    setDiscountSuccess("");
                } else {
                    // For other errors (like "Server Error"), you can still use alert or a toast
                    alert(data.message || "Failed to place order. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

  if (!isClient) return null;

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] flex flex-col lg:flex-row font-sans">
      
      {/* ================= LEFT COLUMN: FORMS ================= */}
      <div className="w-full lg:w-[58%] px-4 sm:px-8 lg:px-16 pt-8 lg:pt-16 pb-12 order-2 lg:order-1 border-r border-[#E5E5E5]">
        
        {/* Header / Logo Area */}
        <div className="mb-8">
            <Link href="/" className="font-serif text-2xl md:text-3xl font-bold tracking-wide uppercase text-[#1A1A1A]">
                TRAAYA TRENDS
            </Link>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-[#555] mb-8 space-x-2">
            <Link href="/cart" className="text-[#B87E58] hover:underline">Cart</Link>
            <ChevronRight size={12} />
            <span className="font-bold text-[#1A1A1A]">Information</span>
            <ChevronRight size={12} />
            <span>Shipping</span>
            <ChevronRight size={12} />
            <span>Payment</span>
        </div>

        <form onSubmit={handlePlaceOrder}>
            {/* --- CONTACT INFO --- */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-serif font-bold">Contact Information</h2>
                    <span className="text-xs text-[#555]">Already have an account? <Link href="/login" className="text-[#B87E58] underline">Log in</Link></span>
                </div>
                <input 
                    type="email" 
                    placeholder="Email or mobile phone number" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 border border-[#E5E5E5] rounded-sm outline-none focus:border-[#B87E58] transition-colors text-sm"
                />
                <div className="flex items-center mt-3">
                    <input type="checkbox" id="newsletter" className="w-4 h-4 accent-[#1A1A1A] mr-2" />
                    <label htmlFor="newsletter" className="text-xs text-[#555]">Email me with news and offers</label>
                </div>
            </div>

            {/* --- SHIPPING ADDRESS --- */}
            <div className="mb-10">
                <h2 className="text-lg font-serif font-bold mb-4">Shipping Address</h2>
                
                <div className="space-y-4">
                    {/* Country */}
                    <select className="w-full h-12 px-4 border border-[#E5E5E5] rounded-sm outline-none focus:border-[#B87E58] bg-white text-sm text-[#555]">
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Germany</option>
                    </select>

                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="First name" 
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full h-12 px-4 border border-[#E5E5E5] rounded-sm outline-none focus:border-[#B87E58] text-sm"
                        />
                        <input 
                            type="text" 
                            placeholder="Last name" 
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full h-12 px-4 border border-[#E5E5E5] rounded-sm outline-none focus:border-[#B87E58] text-sm"
                        />
                    </div>

                    {/* Address */}
                    <input 
                        type="text" 
                        placeholder="Address" 
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full h-12 px-4 border border-[#E5E5E5] rounded-sm outline-none focus:border-[#B87E58] text-sm"
                    />
                    <input 
                        type="text" 
                        placeholder="Apartment, suite, etc. (optional)" 
                        className="w-full h-12 px-4 border border-[#E5E5E5] rounded-sm outline-none focus:border-[#B87E58] text-sm"
                    />

                    {/* City/Zip */}
                    <div className="grid grid-cols-3 gap-4">
                        <input 
                            type="text" 
                            placeholder="City" 
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="col-span-1 w-full h-12 px-4 border border-[#E5E5E5] rounded-sm outline-none focus:border-[#B87E58] text-sm"
                        />
                        <select className="col-span-1 w-full h-12 px-4 border border-[#E5E5E5] rounded-sm outline-none focus:border-[#B87E58] bg-white text-sm text-[#555]">
                            <option>State</option>
                            <option>NY</option>
                            <option>CA</option>
                            <option>TX</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="ZIP code" 
                            required
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            className="col-span-1 w-full h-12 px-4 border border-[#E5E5E5] rounded-sm outline-none focus:border-[#B87E58] text-sm"
                        />
                    </div>

                    <input 
                        type="tel" 
                        placeholder="Phone" 
                        required
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-12 px-4 border border-[#E5E5E5] rounded-sm outline-none focus:border-[#B87E58] text-sm"
                    />

                    <div className="flex items-center mt-2">
                        <input type="checkbox" id="saveInfo" className="w-4 h-4 accent-[#1A1A1A] mr-2" />
                        <label htmlFor="saveInfo" className="text-xs text-[#555]">Save this information for next time</label>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM ACTIONS --- */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E5E5E5]">
                <Link href="/cart" className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#B87E58] flex items-center gap-2">
                    <ChevronLeft size={14} /> Return to Cart
                </Link>
                <button 
                    type="submit"
                    disabled={loading}
                    className="h-12 px-8 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B87E58] transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" size={14} />}
                    {loading ? "Processing..." : "Complete Order"}
                </button>
            </div>
        </form>

      </div>

      {/* ================= RIGHT COLUMN: SUMMARY ================= */}
      <div className="w-full lg:w-[42%] bg-[#FAFAFA] px-4 sm:px-8 lg:px-12 pt-8 lg:pt-16 pb-12 order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-[#E5E5E5]">
        
        {/* Cart Items (Dynamic) */}
        <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
            {items.length === 0 ? (
                <p className="text-sm italic text-gray-400">Your cart is empty.</p>
            ) : (
                items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 border border-[#E5E5E5] bg-white rounded-md p-1">
                                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-contain" />}
                                <span className="absolute -top-2 -right-2 bg-[#888] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {item.quantity}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#1A1A1A] max-w-[150px] truncate">{item.name}</h4>
                                {/* 👇 REMOVED THE SIZE LINE TO FIX ERROR */}
                            </div>
                        </div>
                        <span className="text-sm font-bold text-[#1A1A1A]">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                ))
            )}
        </div>

        <div className="border-t border-[#E5E5E5] my-6"></div>

        {/* Discount Code Section */}
        <div className="mb-8">
            <div className="flex gap-3">
                <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Gift card or discount code" 
                    className="flex-1 h-12 px-4 border border-[#E5E5E5] rounded-sm bg-white text-sm outline-none focus:border-[#B87E58] uppercase"
                />
                <button 
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon || !couponCode}
                    className="h-12 px-6 bg-[#C8C8C8] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors rounded-sm disabled:opacity-50"
                >
                    {validatingCoupon ? "..." : "Apply"}
                </button>
            </div>
            
            {/* Feedback Messages */}
            {discountError && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span className="block w-1 h-1 bg-red-500 rounded-full" />
                    {discountError}
                </p>
            )}
            {discountSuccess && (
                <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                    <span className="block w-1 h-1 bg-green-600 rounded-full" />
                    {discountSuccess}
                </p>
            )}
        </div>

        <div className="border-t border-[#E5E5E5] my-6"></div>

        {/* Totals */}
        <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm text-[#555]">
                <span>Subtotal</span>
                <span className="font-bold text-[#1A1A1A]">${subtotal.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between text-sm text-[#555]">
                <span>Shipping</span>
                <span className="text-xs text-[#888] font-medium">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
            </div>

            {/* Discount Row (Only shows if discount applied) */}
            {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-${discount.toLocaleString()}</span>
                </div>
            )}
        </div>

        <div className="border-t border-[#E5E5E5] my-6"></div>

        <div className="flex justify-between items-center">
            <span className="text-lg font-serif text-[#1A1A1A]">Total</span>
            <div className="flex items-baseline gap-2">
                <span className="text-xs text-[#888]">USD</span>
                {/* Updated Total */}
                <span className="text-2xl font-bold text-[#1A1A1A]">${total.toLocaleString()}</span>
            </div>
        </div>

      </div>

    </main>
  );
}