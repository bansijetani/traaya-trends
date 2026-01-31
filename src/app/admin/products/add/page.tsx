"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Image as ImageIcon, CheckCircle, XCircle, Plus, CornerDownRight } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Data
  const [categories, setCategories] = useState<any[]>([]); // Flat list
  const [sortedCategories, setSortedCategories] = useState<any[]>([]); // Tree list

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    salePrice: "",
    description: "",
    //  NEW FIELDS ADDED HERE
    sku: "",
    stockLevel: "", 
    categories: [] as string[],
    image: null as File | null,
    gallery: [] as File[],
  });

  // Previews
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // --- FETCH CATEGORIES ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
        setSortedCategories(buildCategoryTree(data));
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  // Helper: Build Tree for Checkbox List
  const buildCategoryTree = (cats: any[]) => {
    const roots = cats.filter(c => !c.parentId);
    const children = cats.filter(c => c.parentId);
    let sorted: any[] = [];
    const addChildren = (parent: any, level: number) => {
        sorted.push({ ...parent, level });
        const myChildren = children.filter(c => c.parentId === parent._id);
        myChildren.forEach(child => addChildren(child, level + 1));
    };
    roots.forEach(root => addChildren(root, 0));
    return sorted;
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- FORM HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newData = { ...prev, [name]: value };
        if (name === "name" && !prev.slug) {
            newData.slug = value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        }
        return newData;
    });
  };

  const toggleCategory = (catId: string) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(catId);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter(id => id !== catId) };
      } else {
        return { ...prev, categories: [...prev.categories, catId] };
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        const newFiles = Array.from(files);
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...newFiles] }));
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.image) {
      showToast("Featured image is required.", "error");
      setLoading(false);
      return; 
    }

    // Validation for SKU
    if (!formData.sku) {
      showToast("SKU is required.", "error");
      setLoading(false);
      return; 
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("slug", formData.slug);
    data.append("price", formData.price);
    
    // 👇 NEW FIELDS APPENDED HERE
    data.append("sku", formData.sku);
    data.append("stockLevel", formData.stockLevel || "0"); // Default to 0 if empty

    if (formData.salePrice) data.append("salePrice", formData.salePrice);
    data.append("description", formData.description);
    
    formData.categories.forEach(id => data.append("categories", id));
    if (formData.image) data.append("image", formData.image);
    formData.gallery.forEach((file) => data.append("gallery", file));

    try {
      const res = await fetch("/api/products/add", { method: "POST", body: data });
      if (res.ok) {
        showToast("Product published successfully!", "success");
        setTimeout(() => router.push("/admin/products"), 1500);
      } else {
        showToast("Failed to save product.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto relative pb-20">
      
      {/* Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300 ${
            notification.type === 'success' ? 'bg-[#1A1A1A] text-white' : 'bg-red-600 text-white'
        }`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <div>
                <h4 className="font-bold text-sm">{notification.type === 'success' ? "Success" : "Error"}</h4>
                <p className="text-xs opacity-90">{notification.message}</p>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button type="button" onClick={() => router.back()} className="flex items-center text-sm text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={16} className="mr-1"/> Back to Products
        </button>
        <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Add New Product</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (Main Data) */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Title & Slug */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Product Name</label>
                    <input 
                        type="text" name="name"
                        placeholder="e.g. Diamond Solitaire Ring" 
                        className="w-full text-xl font-serif p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B87E58]"
                        onChange={handleChange} required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Slug (URL)</label>
                    <div className="flex bg-gray-50 border border-gray-200 rounded-md">
                        <span className="p-3 text-gray-400 text-sm border-r border-gray-200">/product/</span>
                        <input 
                            type="text" name="slug"
                            value={formData.slug}
                            placeholder="diamond-solitaire-ring"
                            className="w-full p-3 bg-transparent text-sm focus:outline-none"
                            onChange={handleChange} required
                        />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Description</label>
                <textarea 
                    name="description" rows={10}
                    placeholder="Detailed product description..."
                    className="w-full p-4 border border-gray-200 rounded-md text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#B87E58]"
                    onChange={handleChange}
                />
            </div>

            {/* Pricing */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm mb-4">Pricing</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Regular Price ($)</label>
                        <input type="number" name="price" placeholder="0.00" className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B87E58]" onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Sale Price ($)</label>
                        <input type="number" name="salePrice" placeholder="0.00" className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B87E58]" onChange={handleChange} />
                    </div>
                </div>
            </div>

            {/* 👇 NEW INVENTORY SECTION */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm mb-4">Inventory</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* SKU Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                            SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text"
                            name="sku" 
                            placeholder="e.g. RING-001"
                            value={formData.sku} 
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58]" 
                            required
                        />
                    </div>

                    {/* Stock Level Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                            Stock Quantity
                        </label>
                        <input 
                            type="number"
                            name="stockLevel" 
                            min="0"
                            placeholder="0"
                            value={formData.stockLevel} 
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58]" 
                        />
                    </div>
                </div>
            </div>

        </div>

        {/* RIGHT COLUMN (Sidebar - Settings & Media) */}
        <div className="space-y-6">
            
            {/* Publish */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm mb-4">Publish</h3>
                <button type="submit" disabled={loading} className="w-full bg-[#1A1A1A] text-white py-3 rounded-md font-bold uppercase text-xs tracking-widest hover:bg-[#B87E58] transition-colors flex justify-center items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={16}/> : "Publish Product"}
                </button>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm mb-4">Categories</h3>
                <div className="border border-gray-200 rounded-md p-3 h-40 overflow-y-auto bg-gray-50 custom-scrollbar">
                    {sortedCategories.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-4">No categories found.</p>
                    ) : (
                        <div className="space-y-2">
                            {sortedCategories.map((cat) => (
                                <label 
                                    key={cat._id} 
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded group"
                                    style={{ marginLeft: `${cat.level * 16}px` }}
                                >
                                    <div className="relative flex items-center">
                                        {cat.level > 0 && <CornerDownRight size={14} className="text-gray-300 mr-1" />}
                                        <input 
                                            type="checkbox" 
                                            value={cat._id}
                                            checked={formData.categories.includes(cat._id)}
                                            onChange={() => toggleCategory(cat._id)}
                                            className="w-4 h-4 rounded border-gray-300 text-[#1A1A1A] focus:ring-[#B87E58]"
                                        />
                                    </div>
                                    <span className={`text-sm ${cat.level === 0 ? 'font-medium' : 'text-gray-600'}`}>
                                        {cat.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Select all that apply.</p>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm mb-4">Featured Image</h3>
                <div className="relative w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors group">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center text-gray-400 group-hover:text-gray-600 transition-colors">
                            <ImageIcon size={24} className="mx-auto mb-2"/>
                            <span className="text-xs font-medium">Set Featured Image</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Gallery */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm mb-4">Product Gallery</h3>
                <div className="grid grid-cols-3 gap-3">
                    {galleryPreviews.map((src, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200 relative">
                            <img src={src} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <Plus size={20} className="text-gray-400 mb-1" />
                        <span className="text-[10px] text-gray-500">Add</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryChange} />
                    </label>
                </div>
            </div>

        </div>
      </div>
    </form>
  );
}