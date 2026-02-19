"use client";

import { useCurrency } from "@/context/CurrencyContext";

interface PriceProps {
  amount: number;
  className?: string;
}

export default function Price({ amount, className = "" }: PriceProps) {
  const { convertPrice } = useCurrency();

  // Hardcoded to Indian Rupees (INR)
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2, // You can change this to 0 if you don't want decimals (e.g., ₹1,250 instead of ₹1,250.00)
  }).format(amount || 0);

  return <span>{formattedPrice}</span>;
  
  // return (
  //   <span className={className}>
  //     {convertPrice(amount) 
  //     }
  //   </span>
  // ); 
}