"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { Filter, ChevronDown } from "lucide-react";

// --- MOCK DATA (Since we don't have a database yet) ---
const PRODUCTS = [
  { id: 1, name: "Golden Horizon Ring", price: 14999, category: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800" },
  { id: 2, name: "Ethereal Pearl Drop", price: 8500, category: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800" },
  { id: 3, name: "Desert Rose Pendant", price: 12000, category: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800" },
  { id: 4, name: "Vintage Gold Band", price: 18000, category: "Rings", image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=800" },
  { id: 5, name: "Terracotta Layer Chain", price: 22500, category: "Necklaces", image: "https://images.unsplash.com/photo-1599643477877-531353979269?q=80&w=800" },
  { id: 6, name: "Amber Studs", price: 4500, category: "Earrings", image: "https://images.unsplash.com/photo-1630019852942-e5e12f9519d9?q=80&w=800" },
];

const CATEGORIES = ["All", "Necklaces", "Rings", "Earrings", "Traaya Label"];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter Logic
  const filteredProducts = activeCategory === "All" 
    ? PRODUCTS 
    : PRODUCTS.filter(product => product.category === activeCategory);

  return (
    <main className="min-h-screen bg-traaya-sand text-traaya-brown">
      <Navbar />
      
      {/* Header */}
      <div className="pt-32 pb-12 text-center px-6">
        <h1 className="font-serif text-4xl md:text-5xl text-traaya-dark mb-4">The Collection</h1>
        <p className="text-xs uppercase tracking-widest text-traaya-brown/60">Curated for the Modern Soul</p>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        
        {/* --- SIDEBAR FILTERS (Desktop) --- */}
        <aside className="hidden md:block space-y-8">
          <div>
            <h3 className="font-serif text-xl mb-6 text-traaya-dark">Categories</h3>
            <ul className="space-y-3 text-sm font-medium text-traaya-brown/70">
              {CATEGORIES.map((cat) => (
                <li 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer hover:text-traaya-terra transition-colors ${activeCategory === cat ? "text-traaya-terra font-bold" : ""}`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-xl mb-6 text-traaya-dark">Price</h3>
            <div className="flex gap-2 text-xs">
                <input type="number" placeholder="Min" className="w-full p-2 border border-traaya-brown/20 bg-transparent outline-none" />
                <input type="number" placeholder="Max" className="w-full p-2 border border-traaya-brown/20 bg-transparent outline-none" />
            </div>
          </div>
        </aside>

        {/* --- MOBILE FILTER BAR --- */}
        <div className="md:hidden flex overflow-x-auto gap-4 pb-4 mb-4 scrollbar-hide">
             {CATEGORIES.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 border text-xs uppercase tracking-widest ${activeCategory === cat ? "bg-traaya-terra text-white border-traaya-terra" : "border-traaya-brown/20 text-traaya-brown"}`}
                >
                    {cat}
                </button>
             ))}
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs text-traaya-brown/50">{filteredProducts.length} Products</span>
            <button className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-traaya-terra">
                Sort by <ChevronDown size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4">
                  <Image 
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Quick Add Button */}
                  <button className="absolute bottom-0 w-full bg-traaya-terra text-white py-3 text-xs uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    Add to Cart
                  </button>
                </div>
                <h3 className="font-serif text-lg text-traaya-dark group-hover:text-traaya-terra transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-traaya-brown/70">₹{product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center text-traaya-brown/50">
                <p>No products found in this category yet.</p>
                <p className="text-xs mt-2">Check back soon for our Traaya Label launch.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}