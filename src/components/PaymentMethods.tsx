"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import PayPalCheckout from "./PayPalCheckout";
import toast from "react-hot-toast";

interface PaymentMethodsProps {
  cartItems: any[];
  totalPrice: number;
  isFormValid: boolean; // 👈 Accept the new prop
}

export default function PaymentMethods({ cartItems, totalPrice, isFormValid }: PaymentMethodsProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");

  // --- STRIPE HANDLER ---
  const handleStripeCheckout = async () => {
    // 👇 Intercept the click if form is empty
    if (!isFormValid) {
        toast.error("Please complete all required shipping fields.");
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll them up to fix it
        return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });
      
      const data = await response.json();
      
      if (data.error) {
          console.error("Stripe error:", data.error);
          toast.error("Checkout failed: " + data.error);
          return;
      }

      if (data.url) {
          window.location.href = data.url;
      }
      
    } catch (error) {
      console.error(error);
      toast.error("Stripe checkout failed");
    } finally {
      setLoading(false);
    }
  };

  // --- PAYPAL SUCCESS HANDLER ---
  const handlePayPalSuccess = (details: any) => {
    window.location.href = `/order-success?session_id=${details.id}&source=paypal`;
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
          <span className="italic font-serif font-black">Pay</span><span className="italic font-serif font-light text-[#009cde]">Pal</span>
        </button>
      </div>

      {/* 2. RENDER SELECTED METHOD */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {paymentMethod === "stripe" && (
            <button
                onClick={handleStripeCheckout}
                disabled={loading}
                // 👇 Style the button as grey if the form is invalid
                className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center rounded-sm ${
                    !isFormValid 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                        : "bg-primary text-white hover:bg-secondary"
                }`}
            >
                {loading ? <Loader2 className="animate-spin" size={16} /> : `Pay $${totalPrice.toFixed(2)} with Card`}
            </button>
        )}

        {paymentMethod === "paypal" && (
            // 👇 Dim the PayPal container if the form is invalid
            <div className={`relative z-0 transition-opacity ${!isFormValid ? "opacity-50" : "opacity-100"}`}>
                <PayPalCheckout 
                    amount={totalPrice} 
                    onSuccess={handlePayPalSuccess} 
                    isFormValid={isFormValid} 
                />
            </div>
        )}

      </div>

    </div>
  );
}