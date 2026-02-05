"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { useSession } from "next-auth/react";
import { X, ShoppingBag, Eye, Trash2, ArrowRightLeft, Loader2, ChevronLeft, ChevronRight, Package } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function WishlistPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 👇 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8; // Shows 2 rows of 4 items

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
            "image": coalesce(image.asset->url, images[0].asset->url)
        }
      }`;
      const data = await client.fetch(query, { userId });
      setWishlistItems(data?.wishlist || []);
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
    
    // Check if current page becomes empty after deletion
    const newTotalPages = Math.ceil(newItems.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
    }

    toast.success("Removed from Wishlist");

    try {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: localStorage.getItem("user_id"),
          productId,
        }),
      });
    } catch (error) {
      setWishlistItems(previousItems);
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = (item: any) => {
      toast.success(`Added ${item.title || item.name} to cart!`);
  };

  // 👇 PAGINATION CALCULATION
  const totalPages = Math.ceil(wishlistItems.length / ITEMS_PER_PAGE);
  const currentItems = wishlistItems.slice(
      (currentPage - 1) * ITEMS_PER_PAGE, 
      currentPage * ITEMS_PER_PAGE
  );

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#B87E58]" />
      </div>
    );
  }

  return (
    <main className="bg-white text-[#1A1A1A] min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* PAGE HEADER */}
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 pt-[140px] pb-12">
        <div className="text-xs font-bold uppercase tracking-widest text-[#666] mb-4">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="mx-2 text-[#ccc]">—</span>
            <span className="text-black">Wishlist</span>
        </div>
        <h1 className="font-serif text-4xl text-[#1A1A1A] uppercase tracking-wide">
            My Wishlist ({wishlistItems.length})
        </h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 pb-24">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-[#F9F9F9] border border-dashed border-[#E5E5E5]">
            <p className="text-gray-500 mb-6 font-serif text-lg">Your wishlist is currently empty.</p>
            <Link
              href="/shop"
              className="inline-block bg-[#1A1A1A] text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B87E58] transition-colors"
            >
              Return To Shop
            </Link>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {currentItems.map((item) => {
                const productName = item.title || item.name || "Product";
                return (
                    <div key={item._id} className="group flex flex-col relative">
                    
                    {/* IMAGE CONTAINER */}
                    <div className="relative aspect-square bg-[#F9F9F9] mb-6 overflow-hidden">
                        {item.image ? (
                        <Image
                            src={item.image}
                            alt={productName}
                            fill
                            className="object-contain mix-blend-multiply p-8 transition-transform duration-700 group-hover:scale-105"
                        />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package size={32} />
                        </div>
                        )}

                        {/* TOP RIGHT 'X' */}
                        <button
                        onClick={(e) => { e.preventDefault(); handleRemoveWishlist(item._id); }}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white border border-gray-100 hover:border-black transition-colors z-20"
                        title="Remove"
                        >
                        <X size={14} strokeWidth={1.5} />
                        </button>

                        {/* HOVER ACTIONS STACK */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 z-20">
                            
                            <button 
                                onClick={(e) => { e.preventDefault(); handleRemoveWishlist(item._id); }}
                                className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-[#B87E58] transition-colors relative group/tooltip"
                            >
                                <Trash2 size={16} />
                                <span className="absolute right-12 bg-black text-white text-[10px] uppercase font-bold px-2 py-1 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
                                    Remove
                                </span>
                            </button>

                            <button 
                                onClick={() => handleAddToCart(item)}
                                className="w-10 h-10 bg-white text-[#1A1A1A] flex items-center justify-center hover:bg-[#B87E58] hover:text-white transition-colors shadow-sm"
                                title="Add to Cart"
                            >
                                <ShoppingBag size={16} />
                            </button>

                            <Link 
                                href={`/product/${item._id}`}
                                className="w-10 h-10 bg-white text-[#1A1A1A] flex items-center justify-center hover:bg-[#B87E58] hover:text-white transition-colors shadow-sm"
                                title="View Product"
                            >
                                <Eye size={16} />
                            </Link>

                            <button className="w-10 h-10 bg-white text-[#1A1A1A] flex items-center justify-center hover:bg-[#B87E58] hover:text-white transition-colors shadow-sm cursor-default">
                                <ArrowRightLeft size={16} />
                            </button>
                        </div>
                    </div>

                    {/* INFO SECTION */}
                    <div className="flex flex-col items-start gap-1">
                        <Link href={`/product/${item._id}`} className="block">
                        <h3 className="font-serif text-[17px] text-[#1A1A1A] hover:text-[#B87E58] transition-colors">
                            {productName}
                        </h3>
                        </Link>
                        <div className="flex items-center gap-3">
                            <p className="font-bold text-sm text-[#1A1A1A]">
                            ${(item.price || 0).toLocaleString()}.00
                            </p>
                        </div>
                    </div>

                    </div>
                );
                })}
            </div>

            {/* 👇 PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-8 mt-16 pt-8 border-t border-[#E5E5E5]">
                    {/* Prev Button */}
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#B87E58] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>

                    {/* Page Indicator */}
                    <span className="font-serif text-sm text-[#1A1A1A]">
                        Page {currentPage} of {totalPages}
                    </span>

                    {/* Next Button */}
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#B87E58] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}