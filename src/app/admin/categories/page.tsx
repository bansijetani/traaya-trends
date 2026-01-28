"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, Loader2, Edit2, Check, X, Upload, Image as ImageIcon, CornerDownRight, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [sortedCategories, setSortedCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- NOTIFICATIONS & MODALS ---
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // --- ADD STATE ---
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newParentId, setNewParentId] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- EDIT STATE ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingParentId, setEditingParentId] = useState("");
  const [editingImage, setEditingImage] = useState<File | null>(null);
  const [editingImagePreview, setEditingImagePreview] = useState<string | null>(null);
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
        setSortedCategories(buildCategoryTree(categories));
    } else {
        setSortedCategories([]);
    }
  }, [categories]);

  // Helper: Show Toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

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
    const processedIds = new Set(sorted.map(s => s._id));
    children.forEach(child => {
        if (!processedIds.has(child._id)) {
            sorted.push({ ...child, level: 0, orphaned: true });
        }
    });
    return sorted;
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- ADD HANDLERS ---
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const clearNewImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewImage(null);
    setNewImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    setAdding(true);

    const data = new FormData();
    data.append("name", newCategoryName);
    if (newParentId) data.append("parentId", newParentId);
    if (newImage) data.append("image", newImage);

    try {
      const res = await fetch("/api/categories", { method: "POST", body: data });
      if (res.ok) {
        setNewCategoryName("");
        setNewParentId("");
        setNewImage(null);
        setNewImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchCategories();
        showToast("Category created successfully", "success");
      } else {
        showToast("Failed to create category", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error creating category", "error");
    } finally {
      setAdding(false);
    }
  };

  // --- EDIT HANDLERS ---
  const startEditing = (cat: any) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
    setEditingParentId(cat.parentId || "");
    setEditingImage(null);
    setEditingImagePreview(cat.imageUrl);
    setShouldDeleteImage(false);
  };

  const clearEditImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingImage(null);
    setEditingImagePreview(null);
    setShouldDeleteImage(true);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
    setEditingParentId("");
    setEditingImage(null);
    setEditingImagePreview(null);
    setShouldDeleteImage(false);
  };

  const saveEdit = async () => {
    if (!editingName.trim()) return;
    setSaving(true);

    const data = new FormData();
    data.append("id", editingId!);
    data.append("name", editingName);
    data.append("parentId", editingParentId);
    
    if (shouldDeleteImage) {
        data.append("deleteImage", "true");
    } else if (editingImage) {
        data.append("image", editingImage);
    }

    try {
      const res = await fetch("/api/categories", { method: "PUT", body: data });
      if (res.ok) {
        await fetchCategories();
        cancelEditing();
        showToast("Category updated", "success");
      } else {
        showToast("Failed to update category", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error updating category", "error");
    } finally {
      setSaving(false);
    }
  };

  // --- DELETE HANDLERS ---
  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await fetch("/api/categories/delete", { method: "POST", body: JSON.stringify({ id: deleteConfirmId }) });
      if (res.ok) {
          setCategories(prev => prev.filter((c) => c._id !== deleteConfirmId));
          showToast("Category deleted", "success");
      } else {
          showToast("Failed to delete", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error deleting category", "error");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      
      {/* --- TOAST NOTIFICATION --- */}
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

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 space-y-4">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-red-100 p-3 rounded-full text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="font-bold text-lg">Delete Category?</h3>
                    <p className="text-gray-500 text-sm">
                        Are you sure you want to delete this category? Subcategories may become orphaned.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}

      <h1 className="text-2xl font-serif font-bold text-[#1A1A1A] mb-6">Manage Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left: Hierarchical Category List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-sm text-gray-500 uppercase flex justify-between">
            <span>Structure</span>
            <span>Actions</span>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-6 text-center text-gray-400">Loading...</div>
            ) : sortedCategories.length === 0 ? (
              <div className="p-6 text-center text-gray-400">No categories found.</div>
            ) : (
              sortedCategories.map((cat) => (
                <div key={cat._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  
                  {/* ================= EDIT MODE ================= */}
                  {editingId === cat._id ? (
                    <div className="flex items-center gap-3 w-full animate-in fade-in pl-0">
                        {/* Image Edit with Remove Button */}
                        <div className="relative w-10 h-10 flex-shrink-0 cursor-pointer group" onClick={() => editFileInputRef.current?.click()}>
                             {editingImagePreview ? (
                                <>
                                    <img src={editingImagePreview} className="w-full h-full object-cover rounded-md border" />
                                    {/* 🔴 Remove Button */}
                                    <button 
                                        onClick={clearEditImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 z-20 cursor-pointer"
                                        title="Remove Image"
                                    >
                                        <X size={10} />
                                    </button>
                                </>
                             ) : (
                                <div className="w-full h-full bg-gray-100 border rounded-md flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
                                    <ImageIcon size={14}/>
                                </div>
                             )}
                             <input type="file" className="hidden" ref={editFileInputRef} onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) { 
                                     setEditingImage(file); 
                                     setEditingImagePreview(URL.createObjectURL(file)); 
                                     setShouldDeleteImage(false);
                                 }
                             }}/>
                        </div>
                        
                        <input 
                            type="text" 
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 p-2 border border-[#B87E58] rounded-md text-sm focus:outline-none ring-1 ring-[#B87E58]"
                        />

                        <select
                            value={editingParentId}
                            onChange={(e) => setEditingParentId(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md text-sm w-32 cursor-pointer"
                        >
                            <option value="">No Parent</option>
                            {sortedCategories.filter(c => c._id !== cat._id).map(c => (
                                <option key={c._id} value={c._id}>
                                    {Array(c.level).fill("- ").join("")} {c.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex gap-1">
                            <button onClick={saveEdit} disabled={saving} className="text-green-600 p-2 hover:bg-green-50 rounded cursor-pointer transition-colors" title="Save">
                                <Check size={18} />
                            </button>
                            <button onClick={cancelEditing} disabled={saving} className="text-gray-400 p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors" title="Cancel">
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                  ) : (
                    /* ================= VIEW MODE ================= */
                    <>
                        <div className="flex items-center gap-3 flex-1">
                            <div style={{ marginLeft: `${cat.level * 24}px` }} className="flex items-center">
                                {cat.level > 0 && <CornerDownRight size={16} className="text-gray-300 mr-2" />}
                                <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                    {cat.imageUrl ? <img src={cat.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="m-auto mt-3 text-gray-300"/>}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-medium text-[#1A1A1A]`}>{cat.name}</span>
                                {cat.orphaned && <span className="text-[10px] text-red-500 bg-red-50 px-1 rounded w-fit">Missing Parent</span>}
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => startEditing(cat)} 
                                className="text-blue-600 p-2 hover:bg-blue-50 rounded transition-colors cursor-pointer" 
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => confirmDelete(cat._id)} 
                                className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition-colors cursor-pointer" 
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Add New */}
        <div className="h-fit bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6 space-y-4">
          <h3 className="font-bold text-[#1A1A1A]">Add Category</h3>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative w-full h-48 rounded-lg cursor-pointer overflow-hidden border-2 border-dashed border-gray-300
              hover:bg-gray-50 transition-all duration-200 group
              ${!newImagePreview ? 'flex flex-col items-center justify-center bg-gray-50' : 'block bg-white'}
            `}
          >
            {newImagePreview ? (
                <>
                 <img 
                   src={newImagePreview} 
                   alt="Preview" 
                   className="absolute inset-0 w-full h-full object-cover" 
                 />
                 <button 
                    onClick={clearNewImage}
                    className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1 shadow-md hover:bg-gray-100 z-10 cursor-pointer"
                    title="Remove Image"
                 >
                    <X size={16} />
                 </button>
                </>
            ) : (
                <div className="text-center text-gray-400 group-hover:text-gray-600 transition-colors">
                    <Upload size={24} className="mx-auto mb-2"/>
                    <span className="text-sm font-medium">Upload Image</span>
                </div>
            )}
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleNewImageChange}/>
          </div>

          <input 
            type="text" placeholder="Category Name"
            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58]"
            value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
          />

          <select 
            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B87E58] cursor-pointer"
            value={newParentId} onChange={(e) => setNewParentId(e.target.value)}
          >
            <option value="">No Parent (Root Category)</option>
            {sortedCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                     {Array(cat.level).fill("- ").join("")} {cat.name}
                </option>
            ))}
          </select>

          <button 
            onClick={handleAdd} 
            disabled={adding} 
            className="w-full bg-[#1A1A1A] text-white p-2 rounded-md hover:bg-[#B87E58] transition-colors flex justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {adding ? <Loader2 className="animate-spin" size={20} /> : "Add Category"}
          </button>
        </div>

      </div>
    </div>
  );
}