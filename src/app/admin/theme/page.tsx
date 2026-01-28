"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Upload, Layout, Palette, Image as ImageIcon, CheckCircle, AlertCircle, Link as LinkIcon, Plus, Trash2, Edit3, X, FolderPlus, AlertTriangle } from "lucide-react";

export default function ThemeSettingsPage() {
  const [activeTab, setActiveTab] = useState<"appearance" | "navigation">("appearance");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // --- THEME STATE ---
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [themeData, setThemeData] = useState({
    siteName: "",
    primaryColor: "#1A1A1A",
    secondaryColor: "#B87E58",
    backgroundColor: "#FFFFFF",
    logo: null as File | null,
  });

  // --- MENU STATE ---
  const [menus, setMenus] = useState<any[]>([]); 
  const [selectedMenuId, setSelectedMenuId] = useState<string>(""); 
  const [menuItems, setMenuItems] = useState<any[]>([]); 

  // --- MODAL STATES ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newMenuTitle, setNewMenuTitle] = useState("");

  // --- LINK BUILDER STATE ---
  const [linkType, setLinkType] = useState<"custom" | "page" | "category">("page");
  const [newMenuItem, setNewMenuItem] = useState({ label: "", href: "" });
  const [categories, setCategories] = useState<string[]>([]);

  const standardPages = [
    { name: "Home", url: "/" },
    { name: "Shop All", url: "/shop" },
    { name: "About Us", url: "/about" },
    { name: "Contact", url: "/contact" },
    { name: "Cart", url: "/cart" },
  ];

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Theme
        const themeRes = await fetch("/api/settings", { cache: 'no-store' });
        const theme = await themeRes.json();
        if (theme) {
          setThemeData(prev => ({ 
              ...prev, 
              siteName: theme.siteName || "",
              primaryColor: theme.primaryColor || "#1A1A1A",
              secondaryColor: theme.secondaryColor || "#B87E58",
              backgroundColor: theme.backgroundColor || "#FFFFFF",
          }));
          if (theme.logoUrl) setLogoPreview(theme.logoUrl);
        }

        // 2. Menus
        await fetchMenus();

        // 3. Categories
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        setCategories(catData.map((c: any) => c.name).sort());

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchMenus = async () => {
    const res = await fetch("/api/navigation", { cache: 'no-store' });
    const data = await res.json();
    setMenus(data);
    
    if (data.length > 0 && !selectedMenuId) {
        selectMenu(data[0]);
    }
  };

  const selectMenu = (menu: any) => {
      setSelectedMenuId(menu._id);
      setMenuItems(menu.items || []);
  };

  // --- THEME HANDLERS ---
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThemeData({ ...themeData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThemeData({ ...themeData, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // --- MENU ACTIONS ---
  const submitNewMenu = async () => {
      if (!newMenuTitle.trim()) return;
      
      setSaving(true);
      const res = await fetch("/api/navigation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newMenuTitle, items: [] })
      });
      
      if(res.ok) {
          await fetchMenus();
          showToast("Menu created successfully", "success");
          setShowCreateModal(false);
          setNewMenuTitle("");
      } else {
        showToast("Failed to create menu", "error");
      }
      setSaving(false);
  };

  const confirmDeleteMenu = async () => {
      setSaving(true);
      const res = await fetch("/api/navigation", {
          method: "DELETE",
          body: JSON.stringify({ _id: selectedMenuId })
      });

      if (res.ok) {
        await fetchMenus();
        setMenuItems([]);
        setSelectedMenuId("");
        showToast("Menu deleted successfully", "success");
        setShowDeleteModal(false);
      } else {
        showToast("Failed to delete menu", "error");
      }
      setSaving(false);
  };

  // --- SAVE HANDLER ---
  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === "appearance") {
        const formData = new FormData();
        formData.append("siteName", themeData.siteName);
        formData.append("primaryColor", themeData.primaryColor);
        formData.append("secondaryColor", themeData.secondaryColor);
        formData.append("backgroundColor", themeData.backgroundColor);
        if (themeData.logo) formData.append("logo", themeData.logo);

        await fetch("/api/settings", { method: "POST", body: formData });
      } else {
        if (!selectedMenuId) return;
        const currentMenu = menus.find(m => m._id === selectedMenuId);
        await fetch("/api/navigation", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: selectedMenuId, title: currentMenu?.title, items: menuItems })
        });
      }
      showToast("Settings saved successfully!", "success");
    } catch (error) {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  // --- LINK BUILDER LOGIC ---
  const handleSmartSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;
    if (linkType === "page") {
      const page = standardPages.find(p => p.url === value);
      if (page) setNewMenuItem({ label: page.name, href: page.url });
    } else if (linkType === "category") {
      setNewMenuItem({ label: value, href: `/shop?category=${encodeURIComponent(value)}` });
    }
  };

  const addMenuItem = () => {
    if (!newMenuItem.label || !newMenuItem.href) return showToast("Invalid link details", "error");
    setMenuItems([...menuItems, { ...newMenuItem, _key: Math.random().toString(36).substring(7) }]);
    setNewMenuItem({ label: "", href: "" });
  };

  const removeMenuItem = (index: number) => setMenuItems(menuItems.filter((_, i) => i !== index));

  if (loading) return <div className="p-10 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 relative">
      
      {/* --- CREATE MENU MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden transform scale-100 transition-all">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Create New Menu</h3>
                    <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-red-600 transition-colors"><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Menu Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Footer Menu, Sidebar" 
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] text-sm"
                            value={newMenuTitle}
                            onChange={(e) => setNewMenuTitle(e.target.value)}
                            autoFocus
                        />
                        <p className="text-[10px] text-gray-400 mt-2">Use a descriptive name to identify this menu later.</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-md transition-colors">Cancel</button>
                    <button onClick={submitNewMenu} disabled={!newMenuTitle.trim()} className="px-4 py-2 text-sm font-bold bg-[#1A1A1A] text-white rounded-md hover:bg-[#B87E58] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Create Menu</button>
                </div>
            </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden">
                <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">Delete Menu?</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Are you sure you want to delete this menu? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={() => setShowDeleteModal(false)} 
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmDeleteMenu} 
                            disabled={saving}
                            className="px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            {saving ? <Loader2 size={14} className="animate-spin"/> : null} Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300 ${notification.type === 'success' ? 'bg-[#1A1A1A] text-white' : 'bg-red-600 text-white'}`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-bold">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
           <h1 className="text-3xl font-serif font-bold text-[#1A1A1A]">Theme Settings</h1>
           <p className="text-gray-500 text-sm mt-1">Manage appearance & navigation menus</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded-md hover:bg-[#B87E58] transition-colors font-bold text-xs uppercase tracking-widest cursor-pointer shadow-md">
            {saving ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />} Publish
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button onClick={() => setActiveTab("appearance")} className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "appearance" ? "border-b-2 border-[#1A1A1A] text-[#1A1A1A]" : "text-gray-400 hover:text-gray-600"}`}>Appearance</button>
        <button onClick={() => setActiveTab("navigation")} className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === "navigation" ? "border-b-2 border-[#1A1A1A] text-[#1A1A1A]" : "text-gray-400 hover:text-gray-600"}`}>Navigation Menus</button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "appearance" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* General Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                    <Layout size={18} className="text-gray-400"/>
                    <h2 className="font-bold text-sm uppercase tracking-wider text-gray-600">General</h2>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">Site Name</label>
                        <input type="text" name="siteName" value={themeData.siteName} onChange={handleThemeChange} className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">Logo</label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden relative">
                                {logoPreview ? <img src={logoPreview} className="w-full h-full object-contain p-2" /> : <ImageIcon className="text-gray-300" />}
                            </div>
                            <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-xs font-bold uppercase cursor-pointer hover:bg-gray-50 transition-colors">
                                <Upload size={14} className="inline mr-2"/> Upload
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange}/>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Colors */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                    <Palette size={18} className="text-gray-400"/>
                    <h2 className="font-bold text-sm uppercase tracking-wider text-gray-600">Colors</h2>
                </div>
                <div className="space-y-6">
                    {['primaryColor', 'secondaryColor', 'backgroundColor'].map((colorKey) => (
                         <div key={colorKey}>
                            <label className="block text-xs font-bold text-gray-500 mb-2 capitalize">{colorKey.replace('Color', ' Color')}</label>
                            <div className="flex items-center gap-3">
                                <input type="color" name={colorKey} value={(themeData as any)[colorKey]} onChange={handleThemeChange} className="w-10 h-10 rounded border border-gray-200 cursor-pointer p-0 overflow-hidden" />
                                <input type="text" name={colorKey} value={(themeData as any)[colorKey]} onChange={handleThemeChange} className="flex-1 p-2 border border-gray-200 rounded text-sm uppercase font-mono" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      ) : (
        /* --- NAVIGATION TAB --- */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Left: Menu List */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Menu Selector Bar */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3 w-full">
                        <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Editing:</label>
                        <select 
                            className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-bold text-[#1A1A1A] cursor-pointer"
                            value={selectedMenuId}
                            onChange={(e) => {
                                const menu = menus.find(m => m._id === e.target.value);
                                if(menu) selectMenu(menu);
                            }}
                        >
                            {menus.length === 0 && <option>No menus found</option>}
                            {menus.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2 ml-4">
                        <button 
                            onClick={() => setShowCreateModal(true)} 
                            className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] text-white rounded-md text-xs font-bold uppercase hover:bg-[#B87E58] transition-colors"
                        >
                            <Plus size={14}/> New Menu
                        </button>
                        {selectedMenuId && (
                            <button 
                                onClick={() => setShowDeleteModal(true)} 
                                className="p-2 bg-red-50 hover:bg-red-600 hover:text-white rounded text-red-600 transition-colors" 
                                title="Delete Menu"
                            >
                                <Trash2 size={18}/>
                            </button>
                        )}
                    </div>
                </div>

                {/* Menu Items List */}
                {selectedMenuId ? (
                    <div className="space-y-2">
                        {menuItems.length === 0 ? (
                            <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
                                <LinkIcon size={32} className="mx-auto mb-3 opacity-20"/>
                                <p className="text-sm">This menu is empty.</p>
                                <p className="text-xs mt-1">Add links using the form on the right.</p>
                            </div>
                        ) : (
                            menuItems.map((item, index) => (
                                <div key={index} className="bg-white p-3 rounded-md shadow-sm border border-gray-200 flex items-center gap-3 group hover:border-[#B87E58] transition-colors">
                                    <div className="cursor-move text-gray-300 group-hover:text-[#B87E58]"><Edit3 size={14}/></div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-[#1A1A1A]">{item.label}</div>
                                        <div className="text-[10px] text-gray-400 font-mono">{item.href}</div>
                                    </div>
                                    <button onClick={() => removeMenuItem(index)} className="text-gray-300 hover:text-red-600 p-1 transition-colors"><X size={16}/></button>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                     <div className="p-10 text-center text-gray-400">Select a menu above or create a new one.</div>
                )}
            </div>

            {/* Right: Add Links Form */}
            {selectedMenuId && (
                <div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-widest text-[#1A1A1A]">Add Link Item</h3>
                        
                        <div className="flex bg-gray-100 p-1 rounded-md mb-5">
                            <button onClick={() => setLinkType("page")} className={`flex-1 text-[10px] font-bold py-2 rounded transition-all ${linkType === "page" ? "bg-white shadow text-black" : "text-gray-500 hover:text-black"}`}>Page</button>
                            <button onClick={() => setLinkType("category")} className={`flex-1 text-[10px] font-bold py-2 rounded transition-all ${linkType === "category" ? "bg-white shadow text-black" : "text-gray-500 hover:text-black"}`}>Category</button>
                            <button onClick={() => setLinkType("custom")} className={`flex-1 text-[10px] font-bold py-2 rounded transition-all ${linkType === "custom" ? "bg-white shadow text-black" : "text-gray-500 hover:text-black"}`}>Custom</button>
                        </div>

                        <div className="space-y-4">
                             {linkType === "page" && (
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Select Page</label>
                                    <select className="w-full p-2.5 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]" onChange={handleSmartSelection} value={newMenuItem.href}>
                                        <option value="">-- Choose Page --</option>
                                        {standardPages.map(p => <option key={p.url} value={p.url}>{p.name}</option>)}
                                    </select>
                                </div>
                             )}
                             {linkType === "category" && (
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Select Category</label>
                                    <select className="w-full p-2.5 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]" onChange={handleSmartSelection} value={newMenuItem.label}>
                                        <option value="">-- Choose Category --</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                             )}
                             
                             <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Label Text</label>
                                <input type="text" placeholder="e.g. Shop Now" value={newMenuItem.label} onChange={e => setNewMenuItem({...newMenuItem, label: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"/>
                             </div>

                             <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Destination URL</label>
                                <input type="text" placeholder="https://" value={newMenuItem.href} onChange={e => setNewMenuItem({...newMenuItem, href: e.target.value})} readOnly={linkType !== "custom"} className={`w-full p-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] ${linkType !== "custom" ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}/>
                             </div>
                             
                             <button onClick={addMenuItem} className="w-full bg-[#1A1A1A] text-white py-3 rounded font-bold text-xs uppercase hover:bg-[#B87E58] transition-colors shadow-sm mt-2">Add to Menu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
}