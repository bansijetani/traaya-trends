"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type CurrencyCode = "USD" | "EUR" | "GBP" | "INR";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  convertPrice: (amount: number) => string;
  symbol: string;
}

// Exchange Rates (Base: USD) - In a real app, fetch these from an API
const RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92, // 1 USD = 0.92 EUR
  GBP: 0.79, // 1 USD = 0.79 GBP
  INR: 83.5, // 1 USD = 83.5 INR
};

const SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("shop_currency") as CurrencyCode;
    if (saved && RATES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem("shop_currency", code);
  };

  const convertPrice = (amount: number) => {
    // If amount is missing/null, return 0
    if (!amount) return `${SYMBOLS[currency]}0.00`;
    
    const converted = amount * RATES[currency];
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(converted);
  };

  // Prevent hydration mismatch by rendering USD initially until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, symbol: SYMBOLS[currency] }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Fallback if used outside provider (rare)
    return { 
        currency: "USD" as CurrencyCode, 
        setCurrency: () => {}, 
        convertPrice: (p: number) => `$${p}`,
        symbol: "$"
    };
  }
  return context;
};