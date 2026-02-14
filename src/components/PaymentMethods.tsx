"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, Loader2 } from "lucide-react";
import PayPalCheckout from "./PayPalCheckout";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentMethodsProps {
  cartItems: any[];
  totalPrice: number;
}

export default function PaymentMethods({ cartItems, totalPrice }: PaymentMethodsProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");

  // --- STRIPE HANDLER ---
  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });
      const data = await response.json();
      const stripe = await stripePromise;
      
      // 👇 ADD THIS TO BYPASS TS STRICTNESS
      if (data.url) {
          window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      alert("Stripe checkout failed");
    } finally {
      setLoading(false);
    }
  };

  // --- PAYPAL SUCCESS HANDLER ---
  const handlePayPalSuccess = (details: any) => {
    console.log("PayPal Transaction Completed:", details);
    // Here you would likely redirect to a /success page or call an API to save the order to Sanity
    window.location.href = `/success?session_id=${details.id}&source=paypal`;
  };

  return (
    <div className="w-full space-y-6">
      
      {/* 1. SELECTION TABS */}
      <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setPaymentMethod("stripe")}
          className={`flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
            paymentMethod === "stripe" ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <CreditCard size={16} /> Card
        </button>
        <button
          onClick={() => setPaymentMethod("paypal")}
          className={`flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
            paymentMethod === "paypal" ? "bg-white text-[#003087] shadow-sm" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {/* Simple PayPal Icon */}
          <span className="italic font-serif font-black">Pay</span><span className="italic font-serif font-light text-[#009cde]">Pal</span>
        </button>
      </div>

      {/* 2. RENDER SELECTED METHOD */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {paymentMethod === "stripe" && (
            <button
                onClick={handleStripeCheckout}
                disabled={loading}
                className="w-full bg-primary text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-colors flex justify-center items-center rounded-sm"
            >
                {loading ? <Loader2 className="animate-spin" size={16} /> : `Pay $${totalPrice.toFixed(2)} with Card`}
            </button>
        )}

        {paymentMethod === "paypal" && (
            <div className="relative z-0">
                <PayPalCheckout amount={totalPrice} onSuccess={handlePayPalSuccess} />
            </div>
        )}

      </div>
      
      {/* Trust Badges */}
      <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
         {/* You can add SVG icons for Visa, Mastercard, etc. here */}
      </div>

    </div>
  );
}