"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChevronDown, X, ShoppingBag, Eye, ArrowLeftRight, Heart, ChevronLeft, ChevronRight, Check, LayoutGrid, List, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";

// --- TYPES ---
type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number | null;
  img: string;
  hoverImg: string;
  badge?: string | null;
  badgeColor?: string;
  status?: string | null;
  statusColor?: string;
  colors: string[];
  material: string;
  availability: "In Stock" | "Out of Stock";
  stoneColor: string;
  size: string[];
  category: string;
};

export default function Shop() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // --- STATE FOR FILTERS ---
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string[]>([]);
  const [selectedStoneColor, setSelectedStoneColor] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Default");

  // --- MOCK DATA ---
  const products: Product[] = [
    { 
      id: 1, name: "Emerald-cut Halo Engagement Ring", price: 3370, oldPrice: 3899, 
      img: "/images/product-1.jpg", hoverImg: "/images/product-2.jpg",
      badge: "NEW IN", badgeColor: "bg-[#8B5E3C]", status: "3 sizes are available",
      colors: [], material: "Gold", availability: "In Stock", stoneColor: "White", size: ["6", "7", "8"],
      category: "Stacking" 
    },
    { 
      id: 2, name: "Sparkling Infinity Heart Clasp", price: 2499, oldPrice: 2899,
      img: "/images/product-3.jpg", hoverImg: "/images/product-4.jpg",
      badge: "30% OFF", badgeColor: "bg-[#A89160]", status: "Selling fast", statusColor: "text-[#A89160]",
      colors: [], material: "Sterling Silver", availability: "In Stock", stoneColor: "Pink", size: ["5", "6"],
      category: "Cuff"
    },
    { 
      id: 3, name: "Infinite Lab-Grown Diamond Bangle", price: 1847, oldPrice: 2599,
      img: "/images/product-5.jpg", hoverImg: "/images/trendy-1.jpg",
      badge: null, status: null,
      colors: ["#E6C200", "#E0E0E0", "#E6A5A5"], material: "White Gold", availability: "In Stock", stoneColor: "White", size: ["7", "8"],
      category: "Bangle"
    },
    { 
      id: 4, name: "Olive Leaf Band Ring", price: 327, oldPrice: 899,
      img: "/images/trendy-2.jpg", hoverImg: "/images/trendy-3.jpg",
      badge: "30% OFF", badgeColor: "bg-[#A89160]", status: null,
      colors: [], material: "Pink Gold", availability: "Out of Stock", stoneColor: "White", size: ["5"],
      category: "Stacking"
    },
    { 
      id: 5, name: "Organically Shaped Heart Bangle", price: 3888, oldPrice: 4899,
      img: "/images/trendy-4.jpg", hoverImg: "/images/product-1.jpg",
      badge: null, status: null,
      colors: ["#E0E0E0"], material: "Sterling Silver", availability: "In Stock", stoneColor: "Blue", size: ["9", "10"],
      category: "Bangle"
    },
    { 
      id: 6, name: "Crystal Birthstone Eternity Charm", price: 865, oldPrice: 999,
      img: "/images/product-2.jpg", hoverImg: "/images/product-3.jpg",
      badge: null, status: null,
      colors: ["#A7C7E7", "#F4C2C2", "#FFFFFF"], material: "Gold", availability: "In Stock", stoneColor: "Blue", size: ["6", "7"],
      category: "Chain"
    },
  ];

  const subCategories = [
    { name: "Bangle", img: "/images/cat-bracelets.jpg" },
    { name: "Tennis", img: "/images/cat-necklaces.jpg" },
    { name: "Stacking", img: "/images/cat-rings.jpg" },
    { name: "Cuff", img: "/images/cat-earrings.jpg" },
    { name: "Chain", img: "/images/cat-new-in.jpg" },
  ];

  const sortOptions = ["Default", "Title Ascending", "Title Descending", "Price Ascending", "Price Descending"];

  // --- FILTER & SORT LOGIC ---
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (selectedCategory && product.category !== selectedCategory) return false;
      if (selectedAvailability.length > 0 && !selectedAvailability.includes(product.availability)) return false;
      if (selectedMaterial.length > 0 && !selectedMaterial.includes(product.material)) return false;
      if (selectedStoneColor.length > 0 && !selectedStoneColor.includes(product.stoneColor)) return false;
      if (selectedSize.length > 0 && !selectedSize.some(s => product.size.includes(s))) return false;
      if (selectedPrice.length > 0) {
        const priceMatch = selectedPrice.some(range => {
          if (range === "Under $500") return product.price < 500;
          if (range === "Under $1000") return product.price < 1000;
          if (range === "Under $2000") return product.price < 2000;
          if (range === "Over $2000") return product.price >= 2000;
          return false;
        });
        if (!priceMatch) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "Price Ascending") return a.price - b.price;
      if (sortBy === "Price Descending") return b.price - a.price;
      if (sortBy === "Title Ascending") return a.name.localeCompare(b.name);
      if (sortBy === "Title Descending") return b.name.localeCompare(a.name);
      return 0;
    });
  }, [selectedCategory, selectedAvailability, selectedPrice, selectedMaterial, selectedStoneColor, selectedSize, sortBy]);

  const toggleFilter = (item: string, state: string[], setState: any) => {
    if (state.includes(item)) {
      setState(state.filter((i: string) => i !== item));
    } else {
      setState([...state, item]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedAvailability([]);
    setSelectedPrice([]);
    setSelectedMaterial([]);
    setSelectedStoneColor([]);
    setSelectedSize([]);
  };

  const formatPrice = (price: number) => `$${price.toLocaleString()}.00`;

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] pt-[140px]">
      <Navbar />

      <div className="border-b border-[#E5E5E5]">
        <div className="max-w-[1600px] mx-auto px-6 py-4 text-xs font-medium uppercase tracking-widest text-[#888]">
          <Link href="/" className="hover:text-[#1A1A1A]">Home</Link> <span className="mx-2">/</span> <span className="text-[#1A1A1A]">Bracelets</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-12 pb-24">
        
        {/* --- CATEGORY HEADER --- */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
            <div>
              <h1 className="font-serif text-4xl lg:text-5xl uppercase tracking-wide mb-2">
                Bracelets <sup className="text-sm text-[#888] font-sans">{filteredProducts.length}</sup>
              </h1>
            </div>
            <p className="text-[#555] text-sm leading-relaxed max-w-xl font-sans">
              Discover our collection. From classic gold bands to modern statement pieces.
            </p>
          </div>

          <div className="flex justify-start lg:justify-center gap-8 lg:gap-16 overflow-x-auto pb-4 scrollbar-hide">
            {subCategories.map((cat, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                className="flex flex-col items-center gap-4 min-w-[100px] cursor-pointer group"
              >
                <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border transition-all p-1 
                  ${selectedCategory === cat.name ? "border-[#A89160] scale-105" : "border-transparent group-hover:border-[#A89160]"}`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest transition-colors 
                  ${selectedCategory === cat.name ? "text-[#A89160]" : "group-hover:text-[#A89160]"}`}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 border-t border-[#E5E5E5] pt-12">
          
          {/* --- SIDEBAR FILTERS --- */}
          <aside className={`lg:w-[260px] shrink-0 space-y-10 ${isSidebarOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden lg:block'}`}>
            <div className="lg:hidden flex justify-between items-center mb-6">
              <span className="font-bold uppercase tracking-widest">Filters</span>
              <button onClick={() => setIsSidebarOpen(false)}><X size={24}/></button>
            </div>

            {/* Filters Groups */}
            <div>
              <h3 className="font-serif text-lg mb-4 cursor-pointer">Availability</h3>
              <ul className="space-y-3">
                {["In Stock", "Out of Stock"].map((item) => (
                  <li key={item} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(item, selectedAvailability, setSelectedAvailability)}>
                    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${selectedAvailability.includes(item) ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-[#E5E5E5]"}`}>
                      {selectedAvailability.includes(item) && <Check size={10} className="text-white" />}
                    </div>
                    <span className={`text-sm ${selectedAvailability.includes(item) ? "text-[#1A1A1A] font-bold" : "text-[#555]"}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full h-px bg-[#E5E5E5]"></div>

            <div>
              <h3 className="font-serif text-lg mb-4 cursor-pointer">Price</h3>
              <ul className="space-y-3">
                {["Under $500", "Under $1000", "Under $2000", "Over $2000"].map((item) => (
                  <li key={item} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(item, selectedPrice, setSelectedPrice)}>
                    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${selectedPrice.includes(item) ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-[#E5E5E5]"}`}>
                      {selectedPrice.includes(item) && <Check size={10} className="text-white" />}
                    </div>
                    <span className={`text-sm ${selectedPrice.includes(item) ? "text-[#1A1A1A] font-bold" : "text-[#555]"}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full h-px bg-[#E5E5E5]"></div>

            <div>
              <h3 className="font-serif text-lg mb-4 cursor-pointer">Material</h3>
              <ul className="space-y-3">
                {["Gold", "Sterling Silver", "White Gold", "Pink Gold"].map((item) => (
                  <li key={item} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(item, selectedMaterial, setSelectedMaterial)}>
                    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${selectedMaterial.includes(item) ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-[#E5E5E5]"}`}>
                      {selectedMaterial.includes(item) && <Check size={10} className="text-white" />}
                    </div>
                    <span className={`text-sm ${selectedMaterial.includes(item) ? "text-[#1A1A1A] font-bold" : "text-[#555]"}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full h-px bg-[#E5E5E5]"></div>

            <div>
              <h3 className="font-serif text-lg mb-4 cursor-pointer">Stone Colour</h3>
              <ul className="space-y-3">
                {[
                  { name: "Blue", color: "#A7C7E7" },
                  { name: "Pink", color: "#F4C2C2" },
                  { name: "White", color: "#FFFFFF" },
                ].map((item) => (
                  <li key={item.name} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(item.name, selectedStoneColor, setSelectedStoneColor)}>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedStoneColor.includes(item.name) ? "border-[#1A1A1A] scale-110" : "border-[#E5E5E5]"}`} style={{backgroundColor: item.color}}>
                       {selectedStoneColor.includes(item.name) && <Check size={12} className={item.name === "White" ? "text-black" : "text-white"} />}
                    </div>
                    <span className={`text-sm ${selectedStoneColor.includes(item.name) ? "text-[#1A1A1A] font-bold" : "text-[#555]"}`}>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full h-px bg-[#E5E5E5]"></div>

            <div>
              <h3 className="font-serif text-lg mb-4 cursor-pointer">Size</h3>
              <div className="flex flex-wrap gap-2">
                {["5", "6", "7", "8", "9", "10"].map((item) => (
                  <button 
                    key={item} 
                    onClick={() => toggleFilter(item, selectedSize, setSelectedSize)}
                    className={`w-10 h-10 border text-sm transition-colors flex items-center justify-center
                      ${selectedSize.includes(item) ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#E5E5E5] text-[#555] hover:border-[#1A1A1A]"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* --- MAIN CONTENT --- */}
          <div className="flex-1">
            
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <div className="flex items-center gap-6">
                <button className="lg:hidden flex items-center gap-2 font-bold uppercase tracking-widest text-sm" onClick={() => setIsSidebarOpen(true)}>
                  <Filter size={16}/> Filters
                </button>
                <div className="hidden lg:flex items-center gap-6">
                   <span className="font-bold uppercase tracking-widest text-sm">Active Filters:</span>
                   <button onClick={clearAllFilters} className="text-sm border-b border-black pb-0.5 hover:text-[#A89160] transition-colors">Clear all</button>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-3 text-[#CCCCCC]">
                  <LayoutGrid size={20} className={`cursor-pointer ${viewMode === 'grid' ? 'text-[#A89160]' : 'hover:text-[#1A1A1A]'}`} onClick={() => setViewMode('grid')} />
                  <List size={20} className={`cursor-pointer ${viewMode === 'list' ? 'text-[#A89160]' : 'hover:text-[#1A1A1A]'}`} onClick={() => setViewMode('list')} />
                </div>
                
                <div className="relative group">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-2 text-sm uppercase tracking-widest border border-[#A89160] px-6 py-3 hover:border-[#1A1A1A] transition-colors w-56 justify-between"
                  >
                    SORT BY ({sortBy.replace("Price: ", "").replace("Title: ", "").split(" ")[0]}) 
                    <ChevronDown size={16} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSortOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border border-[#E5E5E5] shadow-lg z-50 mt-[-1px]">
                      <ul className="py-2">
                        {sortOptions.map((option) => (
                          <li 
                            key={option}
                            onClick={() => {
                              setSortBy(option);
                              setIsSortOpen(false);
                            }}
                            className={`px-6 py-2 text-sm uppercase tracking-widest cursor-pointer hover:bg-[#F9F9F9] ${sortBy === option ? 'bg-[#A89160] text-white font-bold' : 'text-[#1A1A1A]'}`}
                          >
                            {option.replace("Price: ", "").replace("Title: ", "")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center text-[#555]">
                <p className="text-lg">No products match your filters.</p>
                <button onClick={clearAllFilters} className="mt-4 border-b border-[#1A1A1A] text-[#1A1A1A] font-bold pb-1">Clear all filters</button>
              </div>
            )}

            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-x-8 gap-y-12`}>
              {filteredProducts.map((product) => (
                // --- THIS IS THE FIX: WRAPPED IN LINK ---
                <Link href={`/products/${product.id}`} key={product.id} className={`group cursor-pointer ${viewMode === 'list' ? 'flex gap-8 items-center' : ''}`}>
                  
                  <div className={`relative bg-[#F9F9F9] aspect-[4/5] ${viewMode === 'list' ? 'w-1/3' : 'w-full'} overflow-hidden mb-4`}>
                    {product.badge && (
                      <span className={`absolute top-0 left-0 text-[10px] font-bold text-white px-3 py-1.5 z-10 tracking-widest uppercase ${product.badgeColor}`}>
                        {product.badge}
                      </span>
                    )}

                    <div className="w-full h-full p-8 flex items-center justify-center relative">
                      <img src={product.img} alt={product.name} className="max-w-full max-h-full object-contain transition-opacity duration-500 group-hover:opacity-0" />
                      <img src={product.hoverImg} alt={product.name} className="absolute inset-0 w-full h-full object-contain p-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-multiply" />
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button className="bg-white text-[#1A1A1A] w-10 h-10 flex items-center justify-center hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><Heart size={18} strokeWidth={1.5} /></button>
                      <button className="bg-white text-[#1A1A1A] w-10 h-10 flex items-center justify-center hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><ShoppingBag size={18} strokeWidth={1.5} /></button>
                      <button className="bg-white text-[#1A1A1A] w-10 h-10 flex items-center justify-center hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><Eye size={18} strokeWidth={1.5} /></button>
                    </div>
                  </div>

                  <div className={`text-left ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="text-base font-serif text-[#1A1A1A] mb-1 leading-snug">{product.name}</h3>
                    <div className="flex items-center gap-3 text-sm font-medium mb-2">
                      <span className={product.oldPrice ? "text-[#D85C5C]" : "text-[#1A1A1A]"}>{formatPrice(product.price)}</span>
                      {product.oldPrice && <span className="text-[#999] line-through decoration-1">{formatPrice(product.oldPrice)}</span>}
                    </div>
                    {product.status && (
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${product.statusColor || "text-[#555]"}`}>{product.status}</p>
                    )}
                  </div>

                </Link>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 mt-20">
              <button className="w-10 h-10 flex items-center justify-center border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors"><ChevronLeft size={16}/></button>
              <button className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] text-white font-bold text-sm">1</button>
              <button className="w-10 h-10 flex items-center justify-center border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors text-sm font-bold text-[#555]">2</button>
              <button className="w-10 h-10 flex items-center justify-center border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors text-sm font-bold text-[#555]">3</button>
              <button className="w-10 h-10 flex items-center justify-center border border-[#E5E5E5] hover:border-[#1A1A1A] transition-colors"><ChevronRight size={16}/></button>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}