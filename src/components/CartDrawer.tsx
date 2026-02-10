"use client";

import { X, Minus, Plus, ShoppingBag, Truck, Gift, FileText, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
// import { useCurrency } from "@/context/CurrencyContext"; // Uncomment if you have this context
import Price from "@/components/Price";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, cartTotal } = useCart();
  // const { convertPrice } = useCurrency(); // Uncomment if needed
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const FREE_SHIPPING_THRESHOLD = 100;
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isCartOpen]);

  if (!mounted) return null;

  return (
    // 👇 FIXED: z-[100] -> z-[999] (Overlay) and z-[1000] (Drawer)
    // Also added pointer-events logic to prevent clicks when invisible
    <div className={`fixed inset-0 z-[999] flex justify-end transition-visibility duration-300 ${isCartOpen ? "visible" : "invisible pointer-events-none"}`}>
      
      {/* 1. Dark Overlay (Backdrop) */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeCart}
      />

      {/* 2. The Cart Drawer (Right Side) */}
      <div 
        className={`
            relative bg-white shadow-2xl h-full flex flex-col transition-transform duration-300 ease-out z-[1000]
            
            /* WIDTH SETTINGS */
            w-[85%]            /* Mobile: 85% Width */
            md:w-[450px]       /* Desktop: Fixed 450px */
            max-w-none         /* Reset max-width constraints */
            
            /* ANIMATION: Slide from Right */
            ${isCartOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <h2 className="font-serif text-lg md:text-xl tracking-wide uppercase font-bold text-primary">Shopping Bag ({items.length})</h2>
            <button onClick={closeCart} className="text-gray-400 hover:text-primary transition-transform hover:rotate-90 duration-300">
                <X size={24} />
            </button>
        </div>

        {/* FREE SHIPPING BAR */}
        <div className="px-5 py-5 bg-white shrink-0">
            <div className="text-center mb-3">
                {remaining > 0 ? (
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">
                        Spend <span className="text-secondary font-black"><Price amount={remaining} /></span> more to get <span className="text-primary font-black">Free Shipping</span>
                    </p>
                ) : (
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary flex items-center justify-center gap-2">
                        <Truck size={16} /> You've unlocked Free Shipping!
                    </p>
                )}
            </div>
            
            <div className="relative w-full h-1 bg-gray-100 rounded-full">
                {/* Progress Fill (Uses Theme Secondary Color) */}
                <div 
                    className="absolute top-0 left-0 h-full bg-secondary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
                {/* Truck Icon (Uses Theme Secondary Color) */}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center shadow-sm transition-all duration-500 ease-out text-white"
                    style={{ left: `calc(${progress}% - 12px)` }}
                >
                    <Truck size={10} fill="currentColor" />
                </div>
            </div>
        </div>

        {/* PRODUCTS LIST (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-5 py-2 space-y-6 scrollbar-hide">
            {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <ShoppingBag size={50} strokeWidth={0.5} className="text-primary" />
                    <p className="font-serif text-lg text-primary">Your cart is currently empty.</p>
                    <button onClick={closeCart} className="text-xs font-bold uppercase underline hover:text-secondary text-primary">Return to Shop</button>
                </div>
            ) : (
                // 👇 FIXED: Uses (item, index) and key={item._id || index}
                items.map((item, index) => (
                    <div key={item._id || index} className="flex gap-4 group animate-in fade-in slide-in-from-right-4 duration-500">
                        <Link href={`/product/${item.slug}`} className="relative w-20 h-24 bg-[#F9F9F9] flex-shrink-0 overflow-hidden rounded-sm">
                            {item.image && <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />}
                        </Link>

                        <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                                <Link href={`/product/${item.slug}`} onClick={closeCart}>
                                    <h3 className="font-serif text-sm text-primary hover:text-secondary transition-colors line-clamp-2 leading-tight">{item.name}</h3>
                                </Link>
                                <div className="text-xs font-bold text-gray-500 mt-1 flex items-center gap-2">
                                     <Price amount={item.price} className="text-primary" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center border border-gray-200 h-7 rounded-sm">
                                    <button 
                                        // 👇 FIXED: Uses _id
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                                        className="w-7 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-30"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus size={10} />
                                    </button>
                                    <span className="w-8 text-center text-xs font-bold text-primary">{item.quantity}</span>
                                    <button 
                                        // 👇 FIXED: Uses _id
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                                        className="w-7 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                                    >
                                        <Plus size={10} />
                                    </button>
                                </div>
                                <button 
                                    // 👇 FIXED: Uses _id
                                    onClick={() => removeFromCart(item._id)} 
                                    className="text-[10px] font-bold uppercase text-gray-400 border-b border-transparent hover:text-red-500 hover:border-red-500 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
            <div className="border-t border-gray-100 p-5 bg-white space-y-5 shrink-0">
                <div className="flex justify-between items-center px-1">
                    <button className="flex flex-col items-center gap-1.5 group">
                        <Gift size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-primary transition-colors">Gift Wrap</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 group">
                        <FileText size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-primary transition-colors">Note</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 group">
                        <Truck size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-primary transition-colors">Shipping</span>
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center text-lg font-serif font-bold text-primary border-t border-gray-100 pt-4">
                        <span>TOTAL:</span>
                        <Price amount={cartTotal} />
                    </div>

                    <div className="flex flex-col gap-2.5">
                         <Link href="/cart" onClick={closeCart} className="w-full py-3 border border-primary text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-center hover:bg-primary hover:text-white transition-all duration-300">
                            View Cart
                        </Link>
                        <Link href="/checkout" onClick={closeCart} className="w-full py-3 bg-primary text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-center hover:bg-secondary transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
                            Checkout <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}