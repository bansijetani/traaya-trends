"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalCheckoutProps {
  amount: number;
  onSuccess: (details: any) => void;
}

export default function PayPalCheckout({ amount, onSuccess }: PayPalCheckoutProps) {
  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
      <PayPalButtons
        style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            // @ts-ignore
            purchase_units: [
              {
                amount: {
                    currency_code: "USD",
                  value: amount.toString(), // PayPal expects string "20.00"
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