"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Plus, Search, ArrowUpDown, Filter, X, User } from "lucide-react";

export default function AdminProductsPage() {
  const router = useRouter();
  
  // Data State
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productQuery = `*[_type == "product"] | order(_createdAt desc) {
        _id,
        name,
        price,
        addedBy, 
        "categories": categories[]->name, 
        "image": image.asset->url,
        _createdAt
      }`;
      const productData = await client.fetch(productQuery, {}, { cache: 'no-store' });
      setProducts(productData);
      setFilteredProducts(productData);

      const allCats = productData.flatMap((p: any) => p.categories || []);
      // @ts-ignore
      const uniqueCats = [...new Set(allCats)].sort();
      setCategories(uniqueCats as string[]);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter(product => 
        product.categories && product.categories.includes(categoryFilter)
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === "categories") {
           valA = a.categories?.[0] || "";
           valB = b.categories?.[0] || "";
        }
        if (sortConfig.key === "addedBy") {
           valA = a.addedBy || "";
           valB = b.addedBy || "";
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, sortConfig, products]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch("/api/products/delete", { method: "POST", body: JSON.stringify({ productId: deleteId }) });
      setProducts(prev => prev.filter(p => p._id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Inventory...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4">
                <h3 className="font-bold text-lg">Confirm Delete</h3>
                <p className="text-sm text-gray-500">Are you sure you want to delete this product?</p>
                <div className="flex justify-end gap-2">
                    <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">Cancel</button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer">Delete</button>
                </div>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">Products</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your inventory ({products.length} items)</p>
        </div>
        <button 
            onClick={() => router.push("/admin/products/add")} 
            // 👇 Added cursor-pointer
            className="flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-md hover:bg-[#B87E58] transition-colors font-medium text-sm shadow-sm cursor-pointer"
        >
            <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58]"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-48">
                <select 
                    className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-md text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#B87E58] cursor-pointer"
                    value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            {(searchTerm || categoryFilter) && (
                <button onClick={() => { setSearchTerm(""); setCategoryFilter(""); }} className="text-gray-500 hover:text-red-600 p-2 cursor-pointer"><X size={18} /></button>
            )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold tracking-wider">
                {/* Headers have cursor-pointer via class */}
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1">Product <ArrowUpDown size={12} className={`text-gray-300 group-hover:text-gray-600 ${sortConfig?.key === "name" ? "text-[#B87E58]" : ""}`} /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => handleSort("categories")}>
                    <div className="flex items-center gap-1">Category <ArrowUpDown size={12} className={`text-gray-300 group-hover:text-gray-600 ${sortConfig?.key === "categories" ? "text-[#B87E58]" : ""}`} /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => handleSort("addedBy")}>
                    <div className="flex items-center gap-1">Added By <ArrowUpDown size={12} className={`text-gray-300 group-hover:text-gray-600 ${sortConfig?.key === "addedBy" ? "text-[#B87E58]" : ""}`} /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group" onClick={() => handleSort("price")}>
                    <div className="flex items-center gap-1">Price <ArrowUpDown size={12} className={`text-gray-300 group-hover:text-gray-600 ${sortConfig?.key === "price" ? "text-[#B87E58]" : ""}`} /></div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No products found matching your filters.</td></tr>
              ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                {product.image ? <img src={product.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">No Img</div>}
                            </div>
                            <span className="font-medium text-[#1A1A1A] text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {product.categories && product.categories.length > 0 
                            ? product.categories.join(", ") 
                            : <span className="italic text-gray-400 text-xs">Uncategorized</span>}
                      </td>
                      <td className="px-6 py-4">
                         {product.addedBy ? (
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold">
                                    {product.addedBy.slice(0, 1).toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-600">{product.addedBy}</span>
                             </div>
                         ) : (
                             <span className="text-xs text-gray-300 italic">-</span>
                         )}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#1A1A1A] text-sm">${product.price?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                            {/* 👇 Added cursor-pointer to Edit/Delete */}
                            <button onClick={() => router.push(`/admin/products/edit/${product._id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer" title="Edit"><Edit size={16} /></button>
                            <button onClick={() => setDeleteId(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer" title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}