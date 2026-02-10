"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid, Columns, ChevronDown, X, Check, LayoutGrid } from "lucide-react";

interface FilterProps {
  allCategories: any[];
  categoryCounts: any;
  stockCounts: any;
  priceCounts: any;
}

export default function MobileFilterBar({ allCategories, categoryCounts, stockCounts, priceCounts }: FilterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read Params
  const categoryParam = searchParams.get("category") || "";
  const selectedCategories = categoryParam ? categoryParam.split(",") : [];
  const stockParam = searchParams.get("stock") || "";
  const priceParam = searchParams.get("price") || "";
  const sortParam = searchParams.get("sort") || "";
  const gridParam = searchParams.get("grid") || "2";

  // URL Helper
  const createUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (key === "category") {
      let newCategories = [...selectedCategories];
      if (newCategories.includes(value)) newCategories = newCategories.filter((c) => c !== value);
      else newCategories.push(value);
      if (newCategories.length > 0) params.set("category", newCategories.join(","));
      else params.delete("category");
    } else {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    
    if (key !== "page") params.delete("page");
    return `/shop?${params.toString()}`;
  };

  const handlePush = (url: string) => {
    router.push(url);
  };

  const activeCount = selectedCategories.length + (stockParam ? 1 : 0) + (priceParam ? 1 : 0);

  return (
    <div className="lg:hidden mb-8">
      
      {/* --- INLINE FILTER BAR (Vemus Style) --- */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        
        {/* 1. Filter Trigger */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary"
        >
          <SlidersHorizontal size={16} />
          Filter
          {activeCount > 0 && <span className="text-[10px] text-gray-400">({activeCount})</span>}
        </button>

        <div className="h-4 w-px bg-gray-200 mx-2"></div>

        {/* 2. Grid Toggles */}
        <div className="flex items-center gap-3">
            <button 
                onClick={() => handlePush(createUrl("grid", "1"))} 
                className={`transition-colors ${gridParam === '1' ? 'text-primary' : 'text-gray-300'}`}
            >
                <div className="w-4 h-4 border-2 border-current rounded-[1px]" />
            </button>
            <button 
                onClick={() => handlePush(createUrl("grid", "2"))} 
                className={`transition-colors ${gridParam === '2' || !gridParam ? 'text-primary' : 'text-gray-300'}`}
            >
                <Columns size={16} />
            </button>
        </div>

        <div className="h-4 w-px bg-gray-200 mx-2"></div>

        {/* 3. Sort Dropdown */}
        <div className="relative">
            <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-secondary"
            >
                Sort By <ChevronDown size={12} />
            </button>
            
            {/* Sort Menu */}
            {isSortOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-xl border border-gray-100 py-2 z-20 flex flex-col rounded-sm">
                        {[
                            { label: "Default", value: "" },
                            { label: "Price: Low to High", value: "price_asc" },
                            { label: "Price: High to Low", value: "price_desc" },
                            { label: "Name: A-Z", value: "title_asc" },
                            { label: "Name: Z-A", value: "title_desc" },
                        ].map((opt) => (
                            <button
                                key={opt.label}
                                onClick={() => { handlePush(createUrl("sort", opt.value)); setIsSortOpen(false); }}
                                className={`text-left px-4 py-2 text-[10px] uppercase font-bold tracking-wider hover:bg-gray-50 ${sortParam === opt.value ? 'text-primary' : 'text-gray-500'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
      </div>


      {/* --- FILTER MODAL (Bottom Sheet) --- */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isModalOpen ? "visible" : "invisible"}`}>
        {/* Backdrop */}
        <div 
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isModalOpen ? "opacity-100" : "opacity-0"}`} 
            onClick={() => setIsModalOpen(false)} 
        />
        
        {/* Drawer */}
        <div className={`absolute bottom-0 left-0 w-full h-[85vh] bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ${isModalOpen ? "translate-y-0" : "translate-y-full"}`}>
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-serif text-xl text-primary">Filters</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Categories */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Category</h3>
                    <div className="space-y-3">
                        {allCategories.map((cat: any) => (
                            <button key={cat._id} onClick={() => handlePush(createUrl("category", cat.slug))} className="flex items-center gap-3 w-full text-left">
                                <div className={`w-4 h-4 border flex items-center justify-center ${selectedCategories.includes(cat.slug) ? "bg-primary border-primary" : "border-gray-300"}`}>
                                    {selectedCategories.includes(cat.slug) && <Check size={10} className="text-white" />}
                                </div>
                                <span className="text-sm text-gray-600 flex-1">{cat.name}</span>
                                <span className="text-xs text-gray-400">[{categoryCounts[cat.slug] || 0}]</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stock */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Availability</h3>
                    <div className="space-y-3">
                        {[{l:"In Stock", v:"in_stock", c:stockCounts.inStock}, {l:"Out of Stock", v:"out_of_stock", c:stockCounts.outOfStock}].map((opt) => (
                            <button key={opt.v} onClick={() => handlePush(createUrl("stock", stockParam === opt.v ? "" : opt.v))} className="flex items-center gap-3 w-full text-left">
                                <div className={`w-4 h-4 border flex items-center justify-center ${stockParam === opt.v ? "bg-primary border-primary" : "border-gray-300"}`}>
                                    {stockParam === opt.v && <Check size={10} className="text-white" />}
                                </div>
                                <span className="text-sm text-gray-600 flex-1">{opt.l}</span>
                                <span className="text-xs text-gray-400">[{opt.c}]</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Price</h3>
                    <div className="space-y-3">
                        {[
                            { label: "Under $500", value: "under_500", count: priceCounts.under500 },
                            { label: "$500 - $1,000", value: "500_1000", count: priceCounts.range500_1000 },
                            { label: "Above $1,000", value: "over_1000", count: priceCounts.above1000 }
                        ].map((opt) => (
                            <button key={opt.value} onClick={() => handlePush(createUrl("price", priceParam === opt.value ? "" : opt.value))} className="flex items-center gap-3 w-full text-left">
                                <div className={`w-4 h-4 border flex items-center justify-center ${priceParam === opt.value ? "bg-primary border-primary" : "border-gray-300"}`}>
                                    {priceParam === opt.value && <Check size={10} className="text-white" />}
                                </div>
                                <span className="text-sm text-gray-600 flex-1">{opt.label}</span>
                                <span className="text-xs text-gray-400">[{opt.count}]</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-4">
                <button onClick={() => { handlePush('/shop'); setIsModalOpen(false); }} className="flex-1 py-3 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:border-primary">Clear All</button>
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-secondary">View Results</button>
            </div>
        </div>
      </div>
    </div>
  );
}