"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface SwitcherProps {
  mode?: "dark" | "light"; // dark = white text (header), light = dark text (footer/mobile)
  position?: "top" | "bottom"; // top = opens UP (for mobile footer), bottom = opens DOWN (default)
}

export default function CurrencyLanguageSwitcher({ mode = "light", position = "bottom" }: SwitcherProps) {
  const { currency, setCurrency } = useCurrency();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
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

  // Toggle handlers
  const toggleCurrency = () => {
    setCurrencyOpen(!currencyOpen);
    setLanguageOpen(false);
  };

  const toggleLanguage = () => {
    setLanguageOpen(!languageOpen);
    setCurrencyOpen(false);
  };

  // Styles
  const textColor = mode === "dark" ? "text-white hover:text-white/80" : "text-gray-600 hover:text-primary";
  
  // Dynamic Positioning Logic
  // If position is 'top', we align to bottom-full (opens up). Else top-full (opens down).
  const positionClasses = position === "top" ? "bottom-full mb-3" : "top-full mt-2";
  
  const dropdownClasses = `absolute ${positionClasses} left-0 bg-white border border-gray-100 shadow-xl rounded-sm py-1 min-w-[160px] z-[9999] animate-in fade-in zoom-in-95 duration-200`;
  const itemClasses = "w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 flex items-center justify-between transition-colors text-primary";

  const currencies = [
    { code: "USD", label: "USD $", full: "United States (USD $)" },
    { code: "EUR", label: "EUR €", full: "Europe (EUR €)" },
    { code: "GBP", label: "GBP £", full: "United Kingdom (GBP £)" },
    { code: "INR", label: "INR ₹", full: "India (INR ₹)" }
  ];

  const languages = ["English", "French", "German", "Hindi"];

  return (
    <div className="flex items-center gap-4 relative" ref={containerRef}>
      
      {/* --- CURRENCY SELECTOR --- */}
      <div className="relative">
        <button 
          onClick={toggleCurrency}
          className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors ${textColor}`}
        >
          {currencies.find(c => c.code === currency)?.label || currency}
          <ChevronDown size={12} className={`transition-transform duration-300 ${currencyOpen ? "rotate-180" : ""}`} />
        </button>

        {currencyOpen && (
          <div className={dropdownClasses}>
            {currencies.map((c) => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code as any); setCurrencyOpen(false); }}
                className={`${itemClasses} ${currency === c.code ? "bg-gray-50 text-secondary" : ""}`}
              >
                <span>{c.full}</span>
                {currency === c.code && <Check size={12} className="text-secondary" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- SEPARATOR --- */}
      <div className={`h-3 w-px ${mode === "dark" ? "bg-white/20" : "bg-gray-300"}`} />

      {/* --- LANGUAGE SELECTOR --- */}
      <div className="relative">
        <button 
          onClick={toggleLanguage}
          className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors ${textColor}`}
        >
          {language}
          <ChevronDown size={12} className={`transition-transform duration-300 ${languageOpen ? "rotate-180" : ""}`} />
        </button>

        {languageOpen && (
          <div className={dropdownClasses}>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setLanguageOpen(false); }}
                className={`${itemClasses} ${language === lang ? "bg-gray-50 text-secondary" : ""}`}
              >
                <span>{lang}</span>
                {language === lang && <Check size={12} className="text-secondary" />}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}