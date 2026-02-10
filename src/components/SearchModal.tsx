"use client";

import { useState, useEffect } from "react";
import { X, Search as SearchIcon, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ products: any[]; posts: any[] }>({ products: [], posts: [] });

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Debounced Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 2) {
        setLoading(true);
        try {
          // GROQ Query: Searches Products (name) and Posts (title)
          const query = `{
            "products": *[_type == "product" && name match "${searchTerm}*"] | order(_createdAt desc)[0...5] {
              _id,
              name,
              price,
              "slug": slug.current,
              "image": coalesce(image.asset->url, images[0].asset->url)
            },
            "posts": *[_type == "post" && title match "${searchTerm}*"] | order(_createdAt desc)[0...3] {
              _id,
              title,
              "slug": slug.current,
              "image": mainImage.asset->url
            }
          }`;
          
          const data = await client.fetch(query);
          setResults(data);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults({ products: [], posts: [] });
      }
    }, 500); // Wait 500ms after typing stops

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-20 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-sm overflow-hidden mx-4 relative flex flex-col max-h-[80vh]">
        
        {/* Header / Input Area */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <SearchIcon className="text-gray-400" size={24} />
          <input 
            type="text" 
            placeholder="Search for jewelry, collections, or articles..." 
            className="flex-1 text-xl font-serif outline-none placeholder:text-gray-300 text-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {loading && <Loader2 className="animate-spin text-secondary" size={24} />}
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Results Area (Scrollable) */}
        <div className="overflow-y-auto p-6 bg-gray-50 min-h-[300px]">
          
          {searchTerm.length < 3 && (
            <div className="text-center text-gray-400 py-10">
              <p>Type at least 3 characters to search</p>
            </div>
          )}

          {searchTerm.length >= 3 && !loading && results.products.length === 0 && results.posts.length === 0 && (
             <div className="text-center text-gray-500 py-10">
               <p>No results found for "{searchTerm}"</p>
             </div>
          )}

          {/* 1. PRODUCTS RESULTS */}
          {results.products.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Products</h3>
              <div className="space-y-4">
                {results.products.map((product) => (
                  <Link 
                    key={product._id} 
                    href={`/product/${product.slug}`} 
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 bg-white rounded-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="relative w-16 h-16 bg-gray-100 flex-shrink-0 overflow-hidden rounded-sm">
                      {product.image && (
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-primary group-hover:text-secondary transition-colors">{product.name}</h4>
                      <p className="text-sm font-bold text-gray-400">${product.price?.toLocaleString()}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-secondary -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 2. BLOG/ARTICLES RESULTS */}
          {results.posts.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Journal</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.posts.map((post) => (
                  <Link 
                    key={post._id} 
                    href={`/blog/${post.slug}`} 
                    onClick={onClose}
                    className="block group bg-white rounded-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-full h-32 bg-gray-200">
                      {post.image && (
                         <Image src={post.image} alt={post.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif text-sm text-primary group-hover:text-secondary transition-colors line-clamp-2">{post.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}