"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

interface SidebarProps {
  allCategories: any[];
  categoryCounts: any;
  stockCounts: any;
  priceCounts: any;
}

export default function ShopSidebar({ allCategories, categoryCounts, stockCounts, priceCounts }: SidebarProps) {
  const searchParams = useSearchParams();
  
  // Helper to read params
  const categoryParam = searchParams.get("category") || "";
  const selectedCategories = categoryParam ? categoryParam.split(",") : [];
  const stockParam = searchParams.get("stock") || "";
  const priceParam = searchParams.get("price") || "";

  // URL Builder
  const createUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (key === "category") {
      let newCategories = [...selectedCategories];
      if (newCategories.includes(value)) {
        newCategories = newCategories.filter((c) => c !== value);
      } else {
        newCategories.push(value);
      }
      if (newCategories.length > 0) params.set("category", newCategories.join(","));
      else params.delete("category");
    } else {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    
    // Reset page on filter change
    if (key !== "page") params.delete("page");

    return `/shop?${params.toString()}`;
  };

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 space-y-10">
      
      {/* Category Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Category</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
          {allCategories.map((cat: any) => {
            const isSelected = selectedCategories.includes(cat.slug);
            const count = categoryCounts[cat.slug] || 0;
            return (
              <Link key={cat._id} href={createUrl("category", cat.slug)} className="flex items-center gap-3 group cursor-pointer select-none">
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary'}`}>
                  {isSelected && <Check size={10} className="text-white" />}
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <span className={`text-sm group-hover:text-primary ${isSelected ? 'text-primary font-bold' : 'text-gray-600'}`}>
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-400">[{count}]</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Availability</h3>
        <div className="space-y-3">
          {[
            { label: "In Stock", value: "in_stock", count: stockCounts.inStock },
            { label: "Out of Stock", value: "out_of_stock", count: stockCounts.outOfStock }
          ].map((opt) => (
            <Link key={opt.value} href={createUrl("stock", stockParam === opt.value ? "" : opt.value)} className="flex items-center gap-3 group cursor-pointer">
              <div className={`w-4 h-4 border flex items-center justify-center ${stockParam === opt.value ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                {stockParam === opt.value && <Check size={10} className="text-white" />}
              </div>
              <div className="flex-1 flex justify-between items-center">
                <span className="text-sm text-gray-600 group-hover:text-primary">{opt.label}</span>
                <span className="text-xs text-gray-400">[{opt.count}]</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Price</h3>
        <div className="space-y-3">
          {[
            { label: "Under $500", value: "under_500", count: priceCounts.under500 },
            { label: "$500 - $1,000", value: "500_1000", count: priceCounts.range500_1000 },
            { label: "Above $1,000", value: "over_1000", count: priceCounts.above1000 }
          ].map((opt) => (
            <Link key={opt.value} href={createUrl("price", priceParam === opt.value ? "" : opt.value)} className="flex items-center gap-3 group cursor-pointer">
              <div className={`w-4 h-4 border flex items-center justify-center ${priceParam === opt.value ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                {priceParam === opt.value && <Check size={10} className="text-white" />}
              </div>
              <div className="flex-1 flex justify-between items-center">
                <span className="text-sm text-gray-600 group-hover:text-primary">{opt.label}</span>
                <span className="text-xs text-gray-400">[{opt.count}]</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </aside>
  );
}