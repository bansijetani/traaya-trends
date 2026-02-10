"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Gift } from "lucide-react";
import Price from "@/components/Price";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  
  // --- NEW STATES ---
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [instructions, setInstructions] = useState("");

  const GIFT_WRAP_COST = 10.00;
  const finalTotal = cartTotal + (isGiftWrapped ? GIFT_WRAP_COST : 0);

  // --- EMPTY STATE ---
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] pt-40 pb-12 text-center px-6 bg-white">
        <div className="w-20 h-20 bg-[#F5F5F0] rounded-full flex items-center justify-center mb-6 text-secondary animate-in zoom-in duration-500">
          <ShoppingBag size={32} strokeWidth={1} />
        </div>
        <h1 className="text-3xl font-serif text-primary mb-3">Your Bag is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-md text-base leading-relaxed">
          It looks like you haven't discovered your perfect piece yet. 
          Explore our collection to find something timeless.
        </p>
        <Link 
          href="/shop" 
          className="group flex items-center gap-2 bg-primary text-white px-8 py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-secondary transition-all duration-300"
        >
          Start Shopping <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  // --- MAIN CART CONTENT ---
  return (
    <div className="bg-white pt-40 pb-12 min-h-[60vh]">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Page Title */}
        <div className="mb-10 border-b border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
            <h1 className="font-serif text-4xl text-primary">Shopping Bag</h1>
            <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">
                {items.reduce((acc, item) => acc + item.quantity, 0)} Items
            </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* LEFT COLUMN: Items + Extras */}
          <div className="flex-1 w-full space-y-12">
            
            {/* 1. Cart Items List */}
            <div className="space-y-8">
              {items.map((item, index) => (
                <div key={item._id || index} className="flex gap-6 py-6 border-b border-gray-100 last:border-0 group">
                  
                  {/* Product Image */}
                  <Link href={`/product/${item.slug}`} className="relative w-28 h-36 bg-[#F9F9F9] flex-shrink-0 overflow-hidden rounded-sm">
                    {item.image && (
                      <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    )}
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                          <Link href={`/product/${item.slug}`}>
                              <h3 className="font-serif text-lg text-primary hover:text-secondary transition-colors mb-1">
                                  {item.name}
                              </h3>
                          </Link>
                          <p className="text-gray-400 text-xs">
                              Unit Price: <span className="text-gray-600"><Price amount={item.price} /></span>
                          </p>
                      </div>
                      <p className="font-serif text-base text-primary font-medium hidden md:block">
                          <Price amount={item.price * item.quantity} />
                      </p>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap justify-between items-end gap-4 mt-3">
                      
                      <div className="flex items-center border border-gray-200 rounded-sm h-8">
                          <button 
                              className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors disabled:opacity-30"
                              disabled={item.quantity <= 1}
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          >
                              <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-medium text-primary">
                              {item.quantity}
                          </span>
                          <button 
                              className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors"
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                              <Plus size={12} />
                          </button>
                      </div>

                      <p className="font-serif text-base text-primary font-medium md:hidden ml-auto">
                          <Price amount={item.price * item.quantity} />
                      </p>

                      <button 
                          onClick={() => removeFromCart(item._id)} 
                          className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 flex items-center gap-2 transition-colors border-b border-transparent hover:border-red-500 pb-0.5"
                      >
                          <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Gift Wrap & Instructions (NEW SECTION) */}
            <div className="bg-[#F9F9F9] p-8 rounded-sm space-y-8 animate-in fade-in slide-in-from-bottom-4">
                
                {/* Gift Wrap Checkbox */}
                <div className="flex items-start gap-4">
                    <div className="relative flex items-center">
                        <input 
                            type="checkbox" 
                            id="gift-wrap" 
                            checked={isGiftWrapped}
                            onChange={(e) => setIsGiftWrapped(e.target.checked)}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-sm border border-gray-300 checked:bg-primary checked:border-primary transition-all"
                        />
                        <Gift size={12} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <label htmlFor="gift-wrap" className="cursor-pointer">
                        <span className="block text-sm font-medium text-primary">
                            Add gift packaging <span className="text-secondary">(+<Price amount={GIFT_WRAP_COST} />)</span>
                        </span>
                        <span className="block text-xs text-gray-500 mt-1 max-w-md">
                            Your order will be wrapped in our signature Traaya box with a satin ribbon and a personalized card.
                        </span>
                    </label>
                </div>

                {/* Special Instructions */}
                <div className="space-y-3">
                    <label htmlFor="instructions" className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        Special instructions for seller
                    </label>
                    <textarea 
                        id="instructions"
                        rows={3}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="e.g. Please leave the package at the back door..."
                        className="w-full bg-white border border-gray-200 px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none rounded-sm"
                    />
                </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-[#F9F9F9] p-8 rounded-sm sticky top-32">
                <h3 className="font-serif text-xl text-primary mb-6 border-b border-gray-200 pb-4">
                    Order Summary
                </h3>
                
                <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-primary">
                            <Price amount={cartTotal} />
                        </span>
                    </div>

                    {/* Show Gift Wrap line if selected */}
                    {isGiftWrapped && (
                         <div className="flex justify-between items-center text-gray-600 animate-in fade-in slide-in-from-left-2">
                            <span className="flex items-center gap-2"><Gift size={12} /> Gift Packaging</span>
                            <span className="font-medium text-primary"><Price amount={GIFT_WRAP_COST} /></span>
                        </div>
                    )}

                    <div className="flex justify-between items-center text-gray-600">
                        <span>Shipping Estimate</span>
                        <span className="text-secondary font-medium text-[10px] uppercase tracking-wider">Calculated at Checkout</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-baseline">
                        <span className="font-serif text-lg text-primary">Total</span>
                        <span className="font-serif text-2xl text-primary font-medium">
                            <Price amount={finalTotal} />
                        </span>
                    </div>
                    <p className="text-right text-[10px] text-gray-400 mt-1 uppercase tracking-wide">
                        Including Taxes
                    </p>
                </div>

                <Link href="/checkout" className="block w-full">
                    <button className="w-full bg-primary text-white py-4 font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-secondary transition-colors shadow-sm flex items-center justify-center gap-2 group">
                        Proceed to Checkout
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>
                
                <div className="mt-6 text-center space-y-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 
                        Secure SSL Encryption
                    </p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}