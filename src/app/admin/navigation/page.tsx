"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, Link as LinkIcon, ArrowUp, ArrowDown } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  _key?: string; // Sanity needs keys for arrays
}

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // New Item Input State
  const [newItem, setNewItem] = useState({ label: "", href: "" });

  // Load Menu
  useEffect(() => {
    fetch("/api/navigation")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setItems(data.items);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Add Item
  const handleAdd = () => {
    if (!newItem.label || !newItem.href) return alert("Please fill both fields");
    
    setItems([...items, { ...newItem, _key: Math.random().toString(36).substring(7) }]);
    setNewItem({ label: "", href: "" }); // Reset inputs
  };

  // Remove Item
  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Move Item Up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);
  };

  // Move Item Down
  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    setItems(newItems);
  };

  // Save to Database
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (res.ok) {
        alert("Menu updated successfully!");
      } else {
        alert("Failed to update menu");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Menu...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">Store Navigation</h1>
           <p className="text-gray-500 text-sm mt-1">Manage the links in your website header</p>
        </div>
        <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded-md hover:bg-[#B87E58] transition-colors font-bold text-xs uppercase tracking-widest cursor-pointer"
        >
            {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />} 
            Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Link List */}
        <div className="lg:col-span-2 space-y-4">
             {items.length === 0 ? (
                 <div className="bg-white p-8 rounded-lg border border-dashed border-gray-300 text-center text-gray-400">
                    <LinkIcon size={32} className="mx-auto mb-2 opacity-20"/>
                    <p>No links yet. Add one from the right.</p>
                 </div>
             ) : (
                items.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4 group">
                        <div className="p-2 bg-gray-50 rounded text-gray-400">
                            <LinkIcon size={16} />
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="font-bold text-[#1A1A1A] text-sm">{item.label}</h3>
                            <p className="text-xs text-gray-500">{item.href}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => moveUp(index)} className="p-2 text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-50 rounded cursor-pointer" disabled={index === 0}><ArrowUp size={14}/></button>
                            <button onClick={() => moveDown(index)} className="p-2 text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-50 rounded cursor-pointer" disabled={index === items.length - 1}><ArrowDown size={14}/></button>
                            <div className="w-px h-4 bg-gray-200 mx-1"></div>
                            <button onClick={() => handleRemove(index)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"><Trash2 size={14}/></button>
                        </div>
                    </div>
                ))
             )}
        </div>

        {/* RIGHT: Add New */}
        <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
                <h3 className="font-bold text-sm mb-4 uppercase tracking-widest">Add New Link</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">Label</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Best Sellers"
                            value={newItem.label}
                            onChange={(e) => setNewItem({...newItem, label: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">URL / Path</label>
                        <input 
                            type="text" 
                            placeholder="e.g. /shop/best-sellers"
                            value={newItem.href}
                            onChange={(e) => setNewItem({...newItem, href: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58]"
                        />
                    </div>

                    <button 
                        onClick={handleAdd}
                        className="w-full bg-gray-100 text-[#1A1A1A] py-3 rounded-md font-bold text-xs uppercase hover:bg-[#1A1A1A] hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Plus size={16} /> Add to Menu
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}