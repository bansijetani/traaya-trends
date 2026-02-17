"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import PayPalCheckout from "./PayPalCheckout";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface PaymentMethodsProps {
  cartItems: any[];
  totalPrice: number;
  isFormValid: boolean; 
  formData: any; 
}

export default function PaymentMethods({ cartItems, totalPrice, isFormValid, formData }: PaymentMethodsProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  
  // 👇 1. STATE FOR THE FULL-SCREEN LOADER
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const router = useRouter();
  const { clearCart } = useCart();

  // --- STRIPE HANDLER ---
  const handleStripeCheckout = async () => {
    if (!isFormValid) {
        toast.error("Please complete all required shipping fields.");
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
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
  const handlePayPalSuccess = async (details: any) => {
    try {
      // Show temporary toast while saving to Sanity
      toast.loading("Verifying payment...", { id: "paypal-processing" });

      const orderPayload = {
        firstName: formData?.firstName || "Customer",
        lastName: formData?.lastName || "",
        email: formData?.email || "",
        address: formData?.address || "",
        city: formData?.city || "",
        zip: formData?.zip || "",
        phone: formData?.phone || "",
        cartItems: cartItems,
        total: totalPrice || 0,
        discount: 0,
        paymentMethod: "PayPal"
      };

      const response = await fetch("/api/orders/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.message || data.error || "Internal Server Error");
      }

      if (data.orderNumber) {
        // 👇 2. ACTIVATE FULL-SCREEN LOADER
        toast.dismiss("paypal-processing");
        toast.success("Payment secured!");
        setIsRedirecting(true); // This triggers the overlay!
        clearCart();
        
        // Next.js will fetch the success page in the background while the loader spins
        router.push(`/order-success?orderNumber=${data.orderNumber}`);
      } else {
        throw new Error("API responded but missing orderNumber");
      }

    } catch (error: any) {
      console.error("Sanity Order Error:", error);
      toast.dismiss("paypal-processing");
      toast.error(`Error saving order: ${error.message}`);
    }
  };

  return (
    <>
      {/* 👇 3. THE FULL-SCREEN OVERLAY (Only shows when isRedirecting is true) */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <Loader2 className="animate-spin text-primary mb-6" size={56} strokeWidth={1.5} />
          <h2 className="font-serif text-3xl text-primary mb-3">Finalizing your order...</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 animate-pulse">
            Please do not close this window
          </p>
        </div>
      )}

      <div className="w-full space-y-6">
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

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {paymentMethod === "stripe" && (
              <button
                  onClick={handleStripeCheckout}
                  disabled={loading}
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
    </>
  );
}