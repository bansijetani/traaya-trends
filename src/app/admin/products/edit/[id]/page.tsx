"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Image as ImageIcon, Save, Plus, CheckCircle, XCircle, CornerDownRight, User } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Data
  const [categories, setCategories] = useState<any[]>([]); 
  const [sortedCategories, setSortedCategories] = useState<any[]>([]);
  const [addedBy, setAddedBy] = useState<string>(""); 

  // Image Previews
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingGallery, setExistingGallery] = useState<any[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    salePrice: "",
    categories: [] as string[],
    description: "",
    image: null as File | null,
    gallery: [] as File[],
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        setCategories(catData);
        setSortedCategories(buildCategoryTree(catData));

        const query = `*[_type == "product" && _id == $id][0] {
          name,
          "slug": slug.current,
          price,
          salePrice,
          addedBy, 
          "selectedCategories": categories[]->_id, 
          description,
          image,
          gallery
        }`;
        const product = await client.fetch(query, { id: productId });

        if (product) {
          setFormData({
            name: product.name || "",
            slug: product.slug || "",
            price: product.price || "",
            salePrice: product.salePrice || "",
            categories: product.selectedCategories || [],
            description: product.description || "",
            image: null,
            gallery: [],
          });

          if (product.addedBy) setAddedBy(product.addedBy);
          if (product.image) setImagePreview(urlFor(product.image).url());
          if (product.gallery) setExistingGallery(product.gallery);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("Failed to load product data", "error");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchData();
  }, [productId]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setNewGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!imagePreview && !formData.image) {
      showToast("Product must have a featured image.", "error");
      setSaving(false);
      return;
    }

    const data = new FormData();
    data.append("productId", productId);
    data.append("name", formData.name);
    data.append("slug", formData.slug);
    data.append("price", formData.price);
    if (formData.salePrice) data.append("salePrice", formData.salePrice);
    data.append("description", formData.description);
    
    formData.categories.forEach(id => data.append("categories", id));
    
    if (formData.image) data.append("image", formData.image);
    formData.gallery.forEach((file) => data.append("gallery", file));

    try {
      const res = await fetch("/api/products/edit", { method: "PUT", body: data });

      if (res.ok) {
        showToast("Product updated successfully!", "success");
        setTimeout(() => {
            router.push("/admin/products");
            router.refresh();
        }, 1500);
      } else {
        showToast("Failed to update product.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Product Data...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-20 relative">
      
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
        <button type="button" onClick={() => router.back()} className="flex items-center text-sm text-gray-500 hover:text-black transition-colors cursor-pointer">
            <ArrowLeft size={16} className="mr-1"/> Back to Products
        </button>

        <div className="flex items-center gap-4">
             {/* 👇 NEW: Add Product Button in Edit Page */}
            <button 
                type="button"
                onClick={() => router.push("/admin/products/add")}
                className="flex items-center gap-2 bg-white border border-gray-200 text-[#1A1A1A] px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer shadow-sm"
            >
                <Plus size={16} /> New Product
            </button>
            <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Edit Product</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Product Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full text-xl font-serif p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B87E58]" required />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Slug</label>
                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none" required />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Description</label>
                <textarea name="description" rows={10} value={formData.description} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-md text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#B87E58]" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm mb-4">Pricing</h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Regular Price</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B87E58]" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Sale Price</label>
                        <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B87E58]" />
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm mb-4">Actions</h3>
                
                {addedBy && (
                   <div className="mb-4 p-3 bg-gray-50 rounded-md flex items-center gap-2 border border-gray-100">
                       <User size={14} className="text-gray-400" />
                       <div className="flex flex-col">
                           <span className="text-[10px] text-gray-400 uppercase font-bold">Created By</span>
                           <span className="text-xs text-gray-700 font-medium">{addedBy}</span>
                       </div>
                   </div>
                )}

                <button type="submit" disabled={saving} className="w-full bg-[#1A1A1A] text-white py-3 rounded-md font-bold uppercase text-xs hover:bg-[#B87E58] flex justify-center items-center gap-2 transition-colors cursor-pointer">
                    {saving ? <Loader2 className="animate-spin" size={16}/> : <> <Save size={16} /> Update Product </>}
                </button>
            </div>

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
                                            className="w-4 h-4 rounded border-gray-300 text-[#1A1A1A] focus:ring-[#B87E58] cursor-pointer"
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
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm mb-4">Featured Image</h3>
                <div className="relative w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center overflow-hidden hover:bg-gray-100 group transition-colors cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="text-center text-gray-400 group-hover:text-gray-600"><ImageIcon size={24} className="mx-auto mb-2"/><span className="text-xs font-medium">Change Image</span></div>}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-bold text-sm mb-4">Gallery</h3>
                <div className="grid grid-cols-3 gap-3">
                    {/* Existing Images */}
                    {existingGallery.map((img: any, i) => (
                         <div key={`old-${i}`} className="aspect-square rounded-lg overflow-hidden border border-gray-200 relative">
                            <img src={urlFor(img).url()} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                    {/* New Images */}
                    {newGalleryPreviews.map((src, i) => (
                        <div key={`new-${i}`} className="aspect-square rounded-lg overflow-hidden border border-green-500 border-2 relative">
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