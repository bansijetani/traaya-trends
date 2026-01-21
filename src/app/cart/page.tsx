"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Minus, Plus, Truck, Quote, Star, Heart, ArrowRightLeft, ShoppingBag, Eye, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

// --- MOCK CART DATA ---
const initialCart = [
  {
    id: 1,
    name: "Emerald-cut Halo Engagement Ring with a Diamond Platinum Band",
    details: "Rose Gold / 50",
    price: 3370.00,
    image: "/images/product-1.jpg", // Replace with your actual image path
    quantity: 1,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCart);
  const [isClient, setIsClient] = useState(false);
  const [addGiftPackaging, setAddGiftPackaging] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- ACTIONS ---
  const updateQuantity = (id: number, newQty: number) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const giftPackagingCost = addGiftPackaging ? 10.0 : 0;
  const total = subtotal + giftPackagingCost;
  
  // Free Shipping Logic
  const freeShippingThreshold = 3470; // Based on your image data
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);
  const shippingProgress = Math.min(100, (total / freeShippingThreshold) * 100);

  const relatedProducts = [
  { id: 201, name: "Open Heart Bangle", price: 2499.00, oldPrice: 2899.00, image: "/images/product-1.jpg" },
  { id: 202, name: "Crystal Birthstone Eternity Circle Charm", price: 2499.00, oldPrice: 2899.00, image: "/images/product-2.jpg" },
  { id: 203, name: "Ball Bracelet", price: 2499.00, oldPrice: 2899.00, image: "/images/product-3.jpg" },
  { id: 204, name: "Engagement Ring in 18k Yellow Gold", price: 2499.00, oldPrice: 2899.00, image: "/images/product-4.jpg" },
];

  if (!isClient) return null;

  return (
    <main className="bg-white text-[#1A1A1A] min-h-screen font-sans">
      <Navbar />

      {/* Container with top padding for Navbar + Extra margin for spacing */}
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
              SPEND <span className="font-bold">${remainingForFreeShipping.toFixed(2)}</span> MORE TO GET <span className="font-bold">FREE SHIPPING</span>
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
            
            {/* Table Header (Gray Background) */}
            <div className="hidden md:grid grid-cols-12 bg-[#EDEDED] py-4 px-6 text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-8">
              <div className="col-span-6">PRODUCT</div>
              <div className="col-span-2">PRICE</div>
              <div className="col-span-2">QUANTITY</div>
              <div className="col-span-2 text-right">SUBTOTAL</div>
            </div>

            {/* Cart Items */}
            <div className="space-y-8 mb-12">
              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-y-6 md:gap-4 items-center border-b border-[#E5E5E5] pb-8 md:px-4 last:border-b-0">
                  
                  {/* Product Info */}
                  <div className="col-span-6 flex gap-6">
                    <div className="w-24 h-24 bg-white shrink-0 border border-[#E5E5E5] p-2">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-sm font-medium text-[#1A1A1A] mb-1 leading-relaxed max-w-sm">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#555] mb-2">{item.details}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="hidden md:block col-span-2 text-sm text-[#1A1A1A]">
                    ${item.price.toFixed(2)}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-6 md:col-span-2 flex flex-col items-start gap-2">
                    <div className="flex items-center">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 hover:text-[#B87E58] transition-colors text-lg leading-none">−</button>
                      <span className="mx-3 text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 hover:text-[#B87E58] transition-colors text-lg leading-none">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-[10px] uppercase underline text-[#1A1A1A] hover:text-[#B87E58] transition-colors">
                      Remove
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-6 md:col-span-2 flex justify-between md:justify-end items-center">
                    <span className="md:hidden text-sm font-bold text-[#888]">Subtotal:</span>
                    <span className="text-sm font-medium text-[#1A1A1A]">${(item.price * item.quantity).toFixed(2)}</span>
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
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 uppercase">
                TOTAL: {total.toFixed(2)}
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

              <button className="w-full bg-[#1A1A1A] text-white h-12 text-xs font-bold uppercase tracking-widest hover:bg-[#333] transition-colors mb-6">
                CHECKOUT
              </button>

              <div className="text-center">
                <p className="text-[10px] text-[#888] mb-3 uppercase tracking-wider">We accept</p>
                <div className="flex justify-center gap-2 grayscale opacity-70">
                   {/* Using placeholder divs for payment icons to match layout */}
                   <div className="h-6 w-10 border flex items-center justify-center text-[8px]">VISA</div>
                   <div className="h-6 w-10 border flex items-center justify-center text-[8px]">MC</div>
                   <div className="h-6 w-10 border flex items-center justify-center text-[8px]">AMEX</div>
                   <div className="h-6 w-10 border flex items-center justify-center text-[8px]">PAYPAL</div>
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
                   “The quality of the jewelry exceeded my expectations. Each piece feels premium and beautifully crafted, and the designs are incredibly stylish. I'm absolutely obsessed with my new ring!”
                 </p>
                 {/* Assuming author name, not visible in crop but standard in design */}
                 <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest">— Emily R.</p>
              </div>
            </div>

          </div>
        </div>

        {/* --- YOU MAY ALSO LIKE SECTION --- */}
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
                {/* Image Container with Hover Overlay */}
                <div className="relative aspect-square bg-[#F9F9F9] mb-4 overflow-hidden rounded-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Hover Icons (Slide in from Right) */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 ease-out">
                    <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors" title="Add to Wishlist"><Heart size={16} /></button>
                    <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors" title="Add to Cart"><ShoppingBag size={16} /></button>
                    <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors" title="Quick View"><Eye size={16} /></button>
                    <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors" title="Compare"><ArrowRightLeft size={16} /></button>
                  </div>
                </div>

                {/* Details */}
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

      <Footer />
    </main>
  );
}