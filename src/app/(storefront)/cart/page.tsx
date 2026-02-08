"use client";

import Image from "next/image";
import { Truck, Quote, Star, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // <--- 1. Import the Brain

export default function CartPage() {
  // --- 2. Get Real Data from Context ---
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const cartTotal = getCartTotal();
  
  // Local UI states
  const [isClient, setIsClient] = useState(false);
  const [addGiftPackaging, setAddGiftPackaging] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- CALCULATIONS ---
  // We use 'cartTotal' from context, but we add Gift Packaging if selected
  const giftPackagingCost = addGiftPackaging ? 10.0 : 0;
  const finalTotal = cartTotal + giftPackagingCost;
  
  // Free Shipping Logic (Dynamic)
  const freeShippingThreshold = 3470; 
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - finalTotal);
  const shippingProgress = Math.min(100, (finalTotal / freeShippingThreshold) * 100);

  // Static Data for "You May Also Like" (Can be made dynamic later)
  const relatedProducts = [
    { id: 201, name: "Open Heart Bangle", price: 2499.00, oldPrice: 2899.00, image: "/images/product-1.jpg" },
    { id: 202, name: "Crystal Birthstone Charm", price: 2499.00, oldPrice: 2899.00, image: "/images/product-2.jpg" },
    { id: 203, name: "Ball Bracelet", price: 2499.00, oldPrice: 2899.00, image: "/images/product-3.jpg" },
    { id: 204, name: "Engagement Ring 18k", price: 2499.00, oldPrice: 2899.00, image: "/images/product-4.jpg" },
  ];

  if (!isClient) return null;

  // --- EMPTY STATE ---
  if (items.length === 0) {
    return (
      <main className="bg-white text-[#1A1A1A] min-h-screen font-sans">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-[180px] pb-20 text-center">
           <div className="w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-[#B87E58] opacity-50" />
           </div>
           <h1 className="text-3xl font-serif mb-4">Your Bag is Empty</h1>
           <p className="text-[#555] mb-8">Looks like you haven't discovered our latest treasures yet.</p>
           <Link href="/shop" className="inline-block bg-[#1A1A1A] text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#B87E58] transition-colors">
              Start Shopping
           </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-white text-[#1A1A1A] min-h-screen font-sans">

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-[180px] pb-20">
        
        {/* --- BREADCRUMB --- */}
        <div className="flex items-center text-xs text-[#888] mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">—</span>
          <span className="text-black">Cart</span>
        </div>

        {/* --- PAGE HEADER & SHIPPING BAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A]">
            SHOPPING CART
          </h1>
          
          {/* Shipping Progress */}
          <div className="w-full md:w-auto min-w-[300px] lg:min-w-[400px]">
            <p className="text-xs text-[#1A1A1A] mb-3 text-right">
              {remainingForFreeShipping > 0 ? (
                 <>SPEND <span className="font-bold">${remainingForFreeShipping.toFixed(2)}</span> MORE TO GET <span className="font-bold">FREE SHIPPING</span></>
              ) : (
                 <span className="font-bold text-[#A88E4D]">YOU'VE UNLOCKED FREE SHIPPING!</span>
              )}
            </p>
            <div className="flex items-center">
              <div className="bg-[#A88E4D] p-1.5 mr-2 rounded-sm shrink-0">
                <Truck size={14} className="text-white" />
              </div>
              <div className="flex-1 h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A88E4D] transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN LAYOUT GRID --- */}
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="flex-1">
            
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 bg-[#EDEDED] py-4 px-6 text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-8">
              <div className="col-span-6">PRODUCT</div>
              <div className="col-span-2">PRICE</div>
              <div className="col-span-2">QUANTITY</div>
              <div className="col-span-2 text-right">SUBTOTAL</div>
            </div>

            {/* Cart Items (Dynamic) */}
            <div className="space-y-8 mb-12">
              {items.map((item, idx) => (
                <div 
                  key={`${item.id || item._id}-${idx}`} 
                  className="grid grid-cols-1 md:grid-cols-12 gap-y-6 md:gap-4 items-center border-b border-gray-100 pb-8"
                >
                  
                  {/* Product Info Section */}
                  <div className="col-span-6 flex gap-8">
                    <div className="relative w-24 h-24 bg-gray-50 overflow-hidden rounded-sm">
                        {item.image && (
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill 
                            className="object-cover"
                          />
                        )}
                    </div>
                    <div className="flex flex-col justify-center">
                        <h3 className="font-serif text-lg text-primary">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">${item.price?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="hidden md:block col-span-2 text-sm text-[#1A1A1A]">
                    ${item.price.toLocaleString()}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-6 md:col-span-2 flex flex-col items-start gap-2">
                    <div className="flex items-center border border-[#E5E5E5]">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                        className="px-3 py-1 hover:bg-[#F5F5F5] transition-colors text-lg leading-none"
                      >
                        -
                      </button>
                      <span className="mx-2 text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        className="px-3 py-1 hover:bg-[#F5F5F5] transition-colors text-lg leading-none"
                      >
                        +
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase underline text-[#1A1A1A] hover:text-[#B87E58] transition-colors mt-1">
                      Remove
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-6 md:col-span-2 flex justify-between md:justify-end items-center">
                    <span className="md:hidden text-sm font-bold text-[#888]">Subtotal:</span>
                    <span className="text-sm font-medium text-[#1A1A1A]">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Options */}
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="gift-packaging"
                  checked={addGiftPackaging}
                  onChange={() => setAddGiftPackaging(!addGiftPackaging)}
                  className="w-4 h-4 border border-[#E5E5E5] rounded-none accent-[#1A1A1A] mr-3 cursor-pointer"
                />
                <label htmlFor="gift-packaging" className="text-sm text-[#555] cursor-pointer">
                  Add gift packaging ($10.00)
                </label>
              </div>

              <div>
                <label htmlFor="instructions" className="block text-sm text-[#1A1A1A] mb-3">Special instructions for seller</label>
                <textarea
                  id="instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full h-32 p-4 border border-[#E5E5E5] text-sm outline-none focus:border-[#B87E58] transition-colors resize-none bg-white"
                ></textarea>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: CHECKOUT ================= */}
          <div className="w-full lg:w-[380px] shrink-0">
            
            {/* Total Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 uppercase flex justify-between">
                <span>TOTAL:</span>
                <span>${finalTotal.toLocaleString()}</span>
              </h3>
              <p className="text-xs text-[#555] mb-6">
                Taxes and shipping calculated at checkout
              </p>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  className="w-4 h-4 border border-[#E5E5E5] rounded-none accent-[#1A1A1A] mr-3 cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-[#555] cursor-pointer">
                  I agree Terms and conditions
                </label>
              </div>

              <Link href="/checkout">
                <button className={`w-full bg-[#1A1A1A] text-white h-12 text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors mb-6 ${!agreeTerms ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  CHECKOUT
                </button>
              </Link>

              <div className="text-center">
                <p className="text-[10px] text-[#888] mb-3 uppercase tracking-wider">We accept</p>
                <div className="flex justify-center gap-2 opacity-70">
                   <div className="h-6 w-10 border border-gray-200 flex items-center justify-center text-[8px] font-bold">VISA</div>
                   <div className="h-6 w-10 border border-gray-200 flex items-center justify-center text-[8px] font-bold">MC</div>
                   <div className="h-6 w-10 border border-gray-200 flex items-center justify-center text-[8px] font-bold">AMEX</div>
                </div>
              </div>
            </div>

            {/* Testimonial Box */}
            <div className="bg-[#F8ECD6] p-8 relative">
              <Quote size={40} className="text-[#BFA467] absolute top-6 left-6 opacity-50" />
              <div className="relative z-10 pt-4">
                 <div className="flex text-[#1A1A1A] mb-4 space-x-1">
                   {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                 </div>
                 <p className="text-sm text-[#1A1A1A] italic leading-relaxed mb-4 font-serif">
                   “The quality of the jewelry exceeded my expectations. Each piece feels premium and beautifully crafted.”
                 </p>
                 <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest">— Emily R.</p>
              </div>
            </div>

          </div>
        </div>

        {/* --- YOU MAY ALSO LIKE SECTION (Static) --- */}
        <div className="max-w-[1500px] mx-auto mt-24 mb-16 pt-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-wide text-[#1A1A1A]">You May Also Like</h2>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 border border-[#E5E5E5] rounded-full flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all"><ArrowLeft size={16}/></button>
              <button className="w-10 h-10 border border-[#E5E5E5] rounded-full flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all"><ArrowRight size={16}/></button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative aspect-square bg-[#F9F9F9] mb-4 overflow-hidden rounded-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide mb-1 hover:text-[#B87E58] transition-colors">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A1A1A]">${item.price.toLocaleString()}</span>
                    <span className="text-xs text-[#888] line-through">${item.oldPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}