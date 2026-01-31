"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Package, Search, AlertTriangle, CheckCircle, AlertCircle, X } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  sku?: string;
  price: number;
  stockLevel: number;
  imageUrl?: string;
  categoryName?: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [changes, setChanges] = useState<Record<string, number>>({}); 
  
  // New: Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 seconds
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load inventory", error);
      showToast("Failed to load inventory", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (id: string, value: string) => {
    const newStock = parseInt(value) || 0;
    setChanges(prev => ({ ...prev, [id]: newStock }));
    
    // Update local UI immediately
    setProducts(products.map(p => p._id === id ? { ...p, stockLevel: newStock } : p));
  };

  const saveChanges = async () => {
    setSaving(true);
    const updates = Object.entries(changes).map(([id, stockLevel]) => ({
        _id: id,
        stockLevel
    }));

    if(updates.length === 0) {
        showToast("No changes to save!", "error");
        setSaving(false);
        return;
    }

    try {
      const res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates })
      });

      if(res.ok) {
          setChanges({}); 
          showToast("Stock updated successfully!", "success");
      } else {
          showToast("Failed to update stock", "error");
      }
    } catch (error) {
      showToast("Error saving changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Inventory...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      
      {/* --- TOAST NOTIFICATION --- */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300 ${
            notification.type === 'success' ? 'bg-[#1A1A1A] text-white' : 'bg-red-600 text-white'
        }`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <div>
                <h4 className="font-bold text-sm">{notification.type === 'success' ? "Success" : "Error"}</h4>
                <p className="text-xs opacity-90">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-2 opacity-70 hover:opacity-100"><X size={16}/></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">Inventory</h1>
           <p className="text-gray-500 text-sm mt-1">Manage stock levels and SKUs</p>
        </div>
        
        <div className="flex gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                <input 
                    type="text" 
                    placeholder="Search by Name or SKU..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58] w-64"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button 
                onClick={saveChanges} 
                disabled={saving || Object.keys(changes).length === 0}
                className={`flex items-center gap-2 px-6 py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-colors shadow-md ${
                    Object.keys(changes).length > 0 
                    ? "bg-[#1A1A1A] text-white hover:bg-[#B87E58]" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
                {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />} 
                Save Changes ({Object.keys(changes).length})
            </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase w-16">Image</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Product Name</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">SKU</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Price</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Stock Level</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt="" className="w-full h-full object-cover"/>
                            ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300"><Package size={16}/></div>
                            )}
                        </div>
                    </td>
                    <td className="p-4">
                        <div className="font-bold text-sm text-[#1A1A1A]">{product.name}</div>
                        <div className="text-[10px] text-gray-500">{product.categoryName || "Uncategorized"}</div>
                    </td>
                    <td className="p-4 text-xs font-mono text-gray-600">
                        {product.sku || <span className="text-red-400 italic">Missing</span>}
                    </td>
                    <td className="p-4 text-sm font-bold text-[#1A1A1A]">${product.price}</td>
                    <td className="p-4">
                        <input 
                            type="number" 
                            value={product.stockLevel ?? 0}
                            onChange={(e) => handleStockChange(product._id, e.target.value)}
                            min="0"
                            className={`w-20 p-2 border rounded-md text-sm font-bold text-center focus:outline-none focus:ring-2 ${
                                (product.stockLevel ?? 0) === 0 
                                ? "border-red-300 bg-red-50 text-red-600 focus:ring-red-500" 
                                : "border-gray-200 focus:ring-[#B87E58]"
                            }`}
                        />
                    </td>
                    <td className="p-4">
                        {(product.stockLevel ?? 0) > 0 ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full w-fit">
                                <CheckCircle size={10}/> In Stock
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full w-fit">
                                <AlertTriangle size={10}/> Out of Stock
                            </span>
                        )}
                    </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}