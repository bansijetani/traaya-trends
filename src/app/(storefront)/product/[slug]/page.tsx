"use client";

import { 
  Heart, ArrowRightLeft, Star, ChevronRight, ChevronLeft, 
  X, Check, ShoppingBag, Eye, Share2, User, MessageSquare 
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/WishlistButton";
import AddToCartButton from "@/components/AddToCartButton";
import Price from "@/components/Price";
import Image from "next/image";
import toast from "react-hot-toast";

// --- TYPES ---
interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface SanityProduct {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  description?: string;
  shortDesc?: string;
  images: any[];
  stockLevel: number;
  category?: string;
  details?: string;
  slug: { current: string } | string;
}

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  // --- STATE ---
  const [product, setProduct] = useState<SanityProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<SanityProduct[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  // UI States
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSections, setActiveSections] = useState<string[]>(['description']);
  const [selectedSize, setSelectedSize] = useState("50");
  const [selectedMaterial, setSelectedMaterial] = useState("Gold");

  const { addToCart } = useCart();

  // --- FETCH DATA ---
  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        // 1. Fetch Product
        const productQuery = `*[_type == "product" && slug.current == "${slug}"][0]{
          _id, name, price, oldPrice, description, "shortDesc": description, 
          "slug": slug.current, images, stockLevel, category, details
        }`;
        const fetchedProduct = await client.fetch(productQuery);
        setProduct(fetchedProduct);

        if (fetchedProduct) {
          // 2. Fetch Related
          const relatedQuery = `*[_type == "product" && _id != "${fetchedProduct._id}"][0...4]{
            _id, name, price, oldPrice, "slug": slug.current, "images": images, "stockLevel": stockLevel
          }`;
          const fetchedRelated = await client.fetch(relatedQuery);
          setRelatedProducts(fetchedRelated);

          // 3. Fetch APPROVED Reviews Only 👇
          const reviewsQuery = `*[_type == "review" && product._ref == "${fetchedProduct._id}" && status == "approved"] | order(createdAt desc)`;
          const fetchedReviews = await client.fetch(reviewsQuery);
          setReviews(fetchedReviews);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // --- SUBMIT HANDLER ---
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSubmittingReview(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          name: reviewForm.name,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        }),
      });

      if (!res.ok) throw new Error("Failed");

      // Reset form
      setReviewForm({ name: "", rating: 5, comment: "" });
      
      // 👇 Show moderation message instead of updating list
      toast.success("Review submitted! It will appear after approval.");

    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getImageUrl = (image: any) => {
    return image ? urlFor(image).url() : "/images/placeholder.jpg";
  };

  // --- STOCK LOGIC ---
  const stockLevel = product?.stockLevel ?? 0;
  const isOutOfStock = stockLevel === 0;
  const isLowStock = stockLevel > 0 && stockLevel <= 5;
  
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  const toggleSection = (section: string) => {
    setActiveSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };
  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (product?.images) setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };
  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (product?.images) setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const mockSizes = ["48", "50", "52", "54"];
  const mockMaterials = [{ name: "Gold", color: "#E6C200" }, { name: "Rose", color: "#E6A5A5" }, { name: "Silver", color: "#E0E0E0" }];

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!product) return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

  return (
    <main className="bg-white text-[#1A1A1A]">

      {/* --- PRODUCT HEADER --- */}
      <div className="pt-32 md:pt-40 pb-16 md:pb-24 px-6 font-sans">
        
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto mb-8 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link> <ChevronRight size={10} /> 
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link> <ChevronRight size={10} /> 
          <span className="text-primary truncate font-semibold">{product.name}</span>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* LEFT: IMAGES */}
          <div className="w-full flex flex-col gap-4">
            <div 
                className="w-full aspect-[4/5] bg-[#F9F9F9] relative rounded-sm overflow-hidden group cursor-zoom-in" 
                onClick={() => setIsModalOpen(true)}
            >
              {product.images && product.images.length > 0 ? (
                <Image 
                    src={getImageUrl(product.images[currentImageIndex])} alt={product.name} fill
                    className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} 
                />
              ) : <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>}
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.oldPrice && <span className="bg-secondary text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">Sale</span>}
                  {isLowStock && !isOutOfStock && <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">Low Stock</span>}
              </div>
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Eye size={16} /></div>
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="w-full grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setCurrentImageIndex(i)} className={`relative aspect-square bg-[#F9F9F9] cursor-pointer rounded-sm overflow-hidden transition-all ${currentImageIndex === i ? "ring-1 ring-primary ring-offset-1" : "opacity-70 hover:opacity-100"}`}>
                    <Image src={getImageUrl(img)} alt={`Thumbnail ${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="w-full relative">
            <div className="lg:sticky lg:top-32">
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth'})}>
                  <div className="flex text-secondary">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"} className={i < Math.round(Number(averageRating)) ? "text-secondary" : "text-gray-300"} />)}
                  </div>
                  <span className="text-xs text-gray-400 ml-2">({reviews.length} reviews)</span>
                </div>
                <button className="text-gray-400 hover:text-primary transition-colors"><Share2 size={18} /></button>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl mb-4 text-primary leading-tight">{product.name}</h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-2xl md:text-3xl font-medium text-primary"><Price amount={product.price} /></span>
                {product.oldPrice && <span className="text-gray-400 line-through text-lg"><Price amount={product.oldPrice} /></span>}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-8 border-b border-gray-100 pb-8">{product.shortDesc || "Experience the elegance of handcrafted luxury."}</p>

              {/* Selectors */}
              <div className="space-y-6 mb-8">
                <div>
                  <div className="flex justify-between mb-2"><span className="text-xs font-bold uppercase tracking-widest text-primary">Material</span><span className="text-xs text-gray-500">{selectedMaterial}</span></div>
                  <div className="flex gap-3">
                    {mockMaterials.map((mat) => (
                      <button key={mat.name} onClick={() => setSelectedMaterial(mat.name)} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${selectedMaterial === mat.name ? "ring-1 ring-offset-2 ring-primary border-primary" : "border-gray-200 hover:border-gray-300"}`} title={mat.name}>
                        <span className="w-6 h-6 rounded-full shadow-inner" style={{ background: mat.color }} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2"><span className="text-xs font-bold uppercase tracking-widest text-primary">Size</span><Link href="#" className="text-[10px] underline text-gray-400 hover:text-primary">Size Guide</Link></div>
                  <div className="flex gap-2 flex-wrap">
                    {mockSizes.map((size) => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`h-10 w-12 flex items-center justify-center text-xs font-bold border transition-all ${selectedSize === size ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary"}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 items-end mb-8">
                <div className="w-24">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Quantity</span>
                    <div className="flex items-center border border-gray-200 h-12">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-full flex items-center justify-center hover:bg-gray-50">-</button>
                        <span className="flex-1 text-center text-sm font-bold">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-50">+</button>
                    </div>
                </div>
                <div className="flex-1 flex gap-3 h-12">
                    <div className="flex-1">
                        <AddToCartButton product={{ ...product, slug: typeof product.slug === 'string' ? product.slug : product.slug.current }} stock={stockLevel} styleType="full" />
                    </div>
                    <div className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                        <WishlistButton productId={product._id} />
                    </div>
                </div>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
                  <div className="text-center"><ShoppingBag size={14} className="text-primary mx-auto mb-2"/><p className="text-[10px] uppercase font-bold text-gray-500">Free Shipping</p></div>
                  <div className="text-center"><Check size={14} className="text-primary mx-auto mb-2"/><p className="text-[10px] uppercase font-bold text-gray-500">Lifetime Warranty</p></div>
                  <div className="text-center"><ArrowRightLeft size={14} className="text-primary mx-auto mb-2"/><p className="text-[10px] uppercase font-bold text-gray-500">30-Day Returns</p></div>
              </div>

              {/* Accordions */}
              <div className="border-t border-gray-100 mt-6">
                {['Description', 'Details', 'Shipping & Returns'].map((section) => (
                    <div key={section} className="border-b border-gray-100">
                        <button onClick={() => toggleSection(section.toLowerCase())} className="w-full py-5 flex items-center justify-between group text-left transition-colors cursor-pointer">
                            <span className="font-serif text-sm uppercase tracking-widest text-primary">{section}</span>
                            <ChevronRight size={16} className={`transition-transform duration-300 ${activeSections.includes(section.toLowerCase()) ? 'rotate-90 text-secondary' : 'text-gray-400'}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeSections.includes(section.toLowerCase()) ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {section === 'Description' ? (product.description || "No description.") : section === 'Details' ? (product.details || "Handcrafted.") : "Free shipping over $200."}
                            </p>
                        </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- REVIEW SECTION --- */}
        <div id="reviews" className="max-w-[1400px] mx-auto mt-24 pt-16 border-t border-gray-100 scroll-mt-32">
            <h2 className="font-serif text-3xl uppercase tracking-wide text-primary mb-12 text-left">Customer Reviews</h2>
            
            <div className="grid md:grid-cols-12 gap-12">
                {/* Form */}
                <div className="md:col-span-5 bg-[#F9F9F9] p-8 rounded-sm h-fit">
                    <h3 className="font-serif text-xl mb-6 text-primary">Write a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                        key={star} 
                                        type="button" 
                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star size={20} fill={star <= reviewForm.rating ? "#B87E58" : "none"} className={star <= reviewForm.rating ? "text-secondary" : "text-gray-300"} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Name</label>
                            <input 
                                type="text" 
                                required
                                value={reviewForm.name}
                                onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                                className="w-full h-12 px-4 bg-white border border-gray-200 focus:border-primary outline-none text-sm"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Review</label>
                            <textarea 
                                required
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                className="w-full h-32 p-4 bg-white border border-gray-200 focus:border-primary outline-none text-sm resize-none"
                                placeholder="Share your thoughts..."
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={submittingReview}
                            className="w-full h-12 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-colors disabled:opacity-50"
                        >
                            {submittingReview ? "Submitting..." : "Post Review"}
                        </button>
                    </form>
                </div>

                {/* Review List */}
                <div className="md:col-span-7 space-y-8">
                    {reviews.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-gray-200">
                            <MessageSquare size={32} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">No reviews yet. Be the first to write one!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="border-b border-gray-100 pb-8 last:border-0 animate-in fade-in">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold uppercase">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-primary">{review.name}</h4>
                                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex text-secondary">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-secondary" : "text-gray-200"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* You May Also Like */}
        <div className="max-w-[1400px] mx-auto mt-24 pt-16 border-t border-gray-100">
          <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-wide text-primary mb-10 text-left">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <div key={item._id} className="group relative">
                <div className="relative aspect-[3/4] bg-[#F9F9F9] mb-4 overflow-hidden rounded-sm">
                   <Link href={`/product/${typeof item.slug === 'string' ? item.slug : item.slug.current}`} className="block w-full h-full">
                    {item.images && item.images[0] && <Image src={getImageUrl(item.images[0])} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />}
                   </Link>
                   <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                       <AddToCartButton product={{ ...item, slug: typeof item.slug === 'string' ? item.slug : item.slug.current }} stock={item.stockLevel} styleType="minimal" />
                   </div>
                </div>
                <div className="text-center">
                    <h3 className="font-serif text-sm text-primary hover:text-secondary transition-colors mb-1">
                        <Link href={`/product/${typeof item.slug === 'string' ? item.slug : item.slug.current}`}>{item.name}</Link>
                    </h3>
                    <div className="text-xs font-bold text-gray-500"><Price amount={item.price} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      {/* Lightbox */}
      {isModalOpen && product?.images && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out" onClick={() => setIsModalOpen(false)}>
          <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/70 p-2 hover:text-white transition-colors"><X size={32}/></button>
          <button onClick={prevImage} className="absolute left-4 text-white/50 p-4 hover:text-white transition-colors"><ChevronLeft size={48}/></button>
          <div className="relative max-w-[90vw] max-h-[90vh] cursor-default" onClick={(e) => e.stopPropagation()}>
              <Image src={getImageUrl(product.images[currentImageIndex])} alt="Zoom" width={1200} height={1200} className="max-w-full max-h-[90vh] object-contain" />
          </div>
          <button onClick={nextImage} className="absolute right-4 text-white/50 p-4 hover:text-white transition-colors"><ChevronRight size={48}/></button>
        </div>
      )}
    </main>
  );
}