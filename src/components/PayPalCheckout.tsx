"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";

interface PayPalCheckoutProps {
  amount: number;
  onSuccess: (details: any) => void;
  isFormValid: boolean; // 👈 Accept the validation prop
}

export default function PayPalCheckout({ amount, onSuccess, isFormValid }: PayPalCheckoutProps) {
  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
        
        // 👇 Intercept the PayPal button click!
        onClick={(data, actions) => {
            if (!isFormValid) {
                toast.error("Please complete all required shipping fields.");
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll them up
                return actions.reject(); // This stops the PayPal popup from opening!
            }
            return actions.resolve(); // This allows PayPal to proceed
        }}

        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: amount.toString(),
                },
              },
            ],
          });
        }}

        onApprove={async (data, actions) => {
            if (actions.order) {
                const details = await actions.order.capture();
                onSuccess(details);
            }
        }}
      />
    </PayPalScriptProvider>
  );
}