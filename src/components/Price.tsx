"use client";

import { useCurrency } from "@/context/CurrencyContext";

interface PriceProps {
  amount: number;
  className?: string;
}

export default function Price({ amount, className = "" }: PriceProps) {
  const { convertPrice } = useCurrency();
  
  return (
    <span className={className}>
      {convertPrice(amount)}
    </span>
  );
}