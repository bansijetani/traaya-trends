"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { useSession } from "next-auth/react";
import { X, Heart, ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import Price from "@/components/Price"; 
import AddToCartButton from "@/components/AddToCartButton"; 
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { syncWishlist } = useWishlist();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8; 

  useEffect(() => {
    if (status === "loading") return;

    let userId = localStorage.getItem("user_id") || localStorage.getItem("userId");

    if (!userId && session?.user?.email) {
        const userEmail = session.user.email; 
        const fetchAdminId = async () => {
             const linkedUser = await client.fetch(
                `*[_type == "user" && email == $email][0]._id`, 
                { email: userEmail }
             );
             if (linkedUser) {
                 localStorage.setItem("user_id", linkedUser);
                 fetchWishlist(linkedUser);
             } else {
                setLoading(false);
             }
        };
        fetchAdminId();
    } else if (userId) {
        fetchWishlist(userId);
    } else {
        router.push("/login");
    }
  }, [router, session, status]);

  const fetchWishlist = async (userId: string) => {
    try {
      const query = `*[_type == "user" && _id == $userId][0]{
        wishlist[]->{
            _id, 
            title, 
            name, 
            price,
            slug,
            "image": coalesce(image.asset->url, images[0].asset->url)
        }
      }`;
      const data = await client.fetch(query, { userId });
      setWishlistItems(data?.wishlist || []);
      syncWishlist();
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      toast.error("Could not load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWishlist = async (productId: string) => {
    const previousItems = [...wishlistItems];
    const newItems = wishlistItems.filter((item) => item._id !== productId);
    setWishlistItems(newItems);
    
    const newTotalPages = Math.ceil(newItems.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
    }

    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: localStorage.getItem("user_id"),
          productId,
        }),
      });
      await syncWishlist();
      toast.success("Removed from Wishlist");
    } catch (error) {
      setWishlistItems(previousItems);
      toast.error("Failed to remove item");
    }
  };

  const totalPages = Math.ceil(wishlistItems.length / ITEMS_PER_PAGE);
  const currentItems = wishlistItems.slice(
      (currentPage - 1) * ITEMS_PER_PAGE, 
      currentPage * ITEMS_PER_PAGE
  );

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-6 text-center pt-32 pb-20">
        <div className="w-20 h-20 bg-[#F5F5F0] rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <Heart size={32} className="text-gray-400" strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-primary mb-3">Your Wishlist is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-md text-sm md:text-base leading-relaxed">
            True luxury awaits. Save your favorite pieces here and make them yours when the moment is right.
        </p>
        <Link 
          href="/shop" 
          className="group flex items-center gap-2 bg-primary text-white px-8 py-4 uppercase tracking-widest text-[10px] font-bold hover:bg-secondary transition-all duration-300 shadow-md"
        >
          Explore Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-40 pb-20 px-6 font-sans text-[#1A1A1A]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header - LEFT ALIGNED */}
        <div className="text-left mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 border-b border-gray-100 pb-8">
            <h1 className="font-serif text-4xl md:text-5xl text-primary mb-3 uppercase tracking-wide">My Wishlist</h1>
            {/* Changed 'justify-center' to 'justify-start' */}
            <div className="flex items-center justify-start gap-3 text-xs uppercase tracking-widest text-gray-400">
                <span className="text-primary font-bold">{wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>Saved for Later</span>
            </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {currentItems.map((item) => {
                const productName = item.title || item.name || "Product";
                return (
                    <div key={item._id} className="group flex flex-col relative animate-in fade-in zoom-in duration-500">
                        
                        {/* Image Container */}
                        <div className="relative aspect-[3/4] bg-[#F9F9F9] overflow-hidden mb-4 rounded-sm">
                             {/* Remove Button */}
                            <button 
                                onClick={() => handleRemoveWishlist(item._id)}
                                className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center rounded-full shadow-sm"
                                title="Remove from Wishlist"
                            >
                                <X size={16} />
                            </button>
    
                            <Link href={`/product/${item.slug?.current || item.slug}`} className="block w-full h-full">
                                {item.image ? (
                                    <Image 
                                        src={item.image} 
                                        alt={productName} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ShoppingBag size={24} />
                                    </div>
                                )}
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
                            </Link>
                        </div>
    
                        {/* Product Info */}
                        <div className="flex-1 flex flex-col">
                            <Link href={`/product/${item.slug?.current || item.slug}`}>
                                <h3 className="font-serif text-lg text-primary hover:text-secondary transition-colors mb-1 line-clamp-1">
                                    {productName}
                                </h3>
                            </Link>
                            
                            <div className="mb-4 text-sm font-medium text-gray-600">
                                <Price amount={item.price} />
                            </div>
    
                            {/* Actions */}
                            <div className="mt-auto">
                               <AddToCartButton 
                                    product={{
                                        _id: item._id,
                                        name: productName,
                                        price: item.price,
                                        image: item.image,
                                        slug: item.slug
                                    }}
                                    styleType="full" 
                               />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex items-center justify-center gap-8 mt-16 pt-8 border-t border-gray-100">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                <span className="font-serif text-sm text-gray-500">
                    Page <span className="text-primary font-bold">{currentPage}</span> of {totalPages}
                </span>

                <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="text-xs font-bold uppercase tracking-widest text-primary hover:text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        )}

      </div>
    </div>
  );
}