"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface SwitcherProps {
  mode?: "dark" | "light"; // For different backgrounds (Header vs Footer)
}

export default function CurrencyLanguageSwitcher({ mode = "light" }: SwitcherProps) {
  const { currency, setCurrency } = useCurrency();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  
  // Close dropdowns when clicking outside
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setCurrencyOpen(false);
        setLanguageOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const textColor = mode === "dark" ? "text-white hover:text-gray-200" : "text-gray-500 hover:text-primary";
  const dropdownBg = "bg-white text-primary border border-gray-100 shadow-xl";

  return (
    <div className="flex items-center gap-4 relative z-50" ref={containerRef}>
      
      {/* CURRENCY SELECTOR */}
      <div className="relative">
        <button 
          onClick={() => { setCurrencyOpen(!currencyOpen); setLanguageOpen(false); }}
          className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${textColor}`}
        >
          {currency === "USD" && "United States (USD $)"}
          {currency === "EUR" && "Europe (EUR €)"}
          {currency === "GBP" && "United Kingdom (GBP £)"}
          {currency === "INR" && "India (INR ₹)"}
          <ChevronDown size={12} className={`transition-transform duration-300 ${currencyOpen ? "rotate-180" : ""}`} />
        </button>

        {currencyOpen && (
          <div className={`absolute top-full left-0 mt-2 w-48 rounded-sm ${dropdownBg} animate-in fade-in slide-in-from-top-2`}>
            {[
              { code: "USD", label: "United States (USD $)" },
              { code: "EUR", label: "Europe (EUR €)" },
              { code: "GBP", label: "United Kingdom (GBP £)" },
              { code: "INR", label: "India (INR ₹)" }
            ].map((c) => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code as any); setCurrencyOpen(false); }}
                className="block w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50"
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SEPARATOR */}
      <div className={`h-3 w-px ${mode === "dark" ? "bg-white/20" : "bg-gray-200"}`} />

      {/* LANGUAGE SELECTOR (Visual Only) */}
      <div className="relative">
        <button 
          onClick={() => { setLanguageOpen(!languageOpen); setCurrencyOpen(false); }}
          className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${textColor}`}
        >
          English
          <ChevronDown size={12} className={`transition-transform duration-300 ${languageOpen ? "rotate-180" : ""}`} />
        </button>

        {languageOpen && (
          <div className={`absolute top-full left-0 mt-2 w-32 rounded-sm ${dropdownBg} animate-in fade-in slide-in-from-top-2`}>
            <button className="block w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50">English</button>
            <button className="block w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50">French</button>
            <button className="block w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50">German</button>
          </div>
        )}
      </div>

    </div>
  );
}