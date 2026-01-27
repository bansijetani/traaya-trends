"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useCart } from "@/context/CartContext"; // <--- 1. Import the Brain
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();// <--- 2. Get Real Data
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

  // --- CALCULATIONS ---
  const subtotal = cartTotal;
  const shipping = subtotal > 200 ? 0 : 15.00; // Free shipping logic
  const total = subtotal + shipping;

  // --- HANDLERS ---
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault(); // 👈 Prevents the page from refreshing
    setLoading(true);
  
    const orderData = {
        // 👇 CHANGE THIS: Use your actual state variable names
        firstName: firstName, 
        lastName: lastName,
        email: email,
        address: address,
        city: city,
        zip: zip, // or zipCode, whatever you named it
        phone: phone,
        cartItems: items, 
        total: total, 
    };

    try {
        const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        });

        if (response.ok) {
        localStorage.removeItem("appliedDiscount");
        // clearCart(); 
        router.push("/order-success");
        } else {
        console.error("Failed to place order");
        alert("Failed to place order. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong.");
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
                TYAARA TRENDS
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
                        value={phone} // 👈 Connect to State
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
                    className="h-12 px-8 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B87E58] transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                <span className="absolute -top-2 -right-2 bg-[#888] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {item.quantity}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#1A1A1A] max-w-[150px] truncate">{item.name}</h4>
                                <p className="text-xs text-[#888]">Size: 50 (S)</p> {/* Placeholder for dynamic size if implemented */}
                            </div>
                        </div>
                        <span className="text-sm font-bold text-[#1A1A1A]">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                ))
            )}
        </div>

        <div className="border-t border-[#E5E5E5] my-6"></div>

        {/* Discount Code */}
        <div className="flex gap-3 mb-8">
            <input 
                type="text" 
                placeholder="Gift card or discount code" 
                className="flex-1 h-12 px-4 border border-[#E5E5E5] rounded-sm bg-white text-sm outline-none focus:border-[#B87E58]"
            />
            <button className="h-12 px-6 bg-[#C8C8C8] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors rounded-sm">
                Apply
            </button>
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
        </div>

        <div className="border-t border-[#E5E5E5] my-6"></div>

        <div className="flex justify-between items-center">
            <span className="text-lg font-serif text-[#1A1A1A]">Total</span>
            <div className="flex items-baseline gap-2">
                <span className="text-xs text-[#888]">USD</span>
                <span className="text-2xl font-bold text-[#1A1A1A]">${total.toLocaleString()}</span>
            </div>
        </div>

      </div>

    </main>
  );
}