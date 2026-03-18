"use client";

import { 
  Heart, ArrowRightLeft, Star, ChevronRight, Tag, 
  X, Check, ShoppingBag, Eye, Share2, AlertTriangle, MessageSquare 
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
import dynamic from "next/dynamic";

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
  salePrice?: number;
  description?: string;
  additionalInfo?: string;
  shortDesc?: string;
  images: any[];
  stockLevel: number;
  category?: string;
  tags?: string[];
  details?: string;
  slug: { current: string } | string;
  sizes?: string[];      
  materials?: string[];
  colors?: string[];
}

const ImageLightbox = dynamic(() => import("@/components/ImageLightbox"), {
  ssr: false, // We don't need to render interactive modals on the server
});

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
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const { addToCart } = useCart();
  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        // 1. Fetch Product
        const productQuery = `*[_type == "product" && slug.current == "${slug}"][0]{
          _id, name, price, salePrice, description, additionalInfo, "shortDesc": description, 
          "slug": slug.current, "images": [image] + gallery, stockLevel, category, details, sizes, materials, colors, tags
        }`;
        const fetchedProduct = await client.fetch(productQuery);
        setProduct(fetchedProduct);

        if (fetchedProduct) {

          if (fetchedProduct.sizes?.length > 0) setSelectedSize(fetchedProduct.sizes[0]);
          if (fetchedProduct.materials?.length > 0) setSelectedMaterial(fetchedProduct.materials[0]);
          if (fetchedProduct.colors?.length > 0) setSelectedColor(fetchedProduct.colors[0]);
          if (fetchedProduct.images) {
            fetchedProduct.images = fetchedProduct.images.filter((img: any) => img !== null);
          }
          
          // 2. Fetch Related
          const relatedQuery = `*[_type == "product" && _id != "${fetchedProduct._id}"][0...4]{
            _id, name, price, salePrice, "slug": slug.current, "images": [image] + gallery, "stockLevel": stockLevel
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

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: `${product.name} | Traaya Trends`,
      text: `Check out the ${product.name} at Traaya Trends. Crafted with elegance and meaning.`,
      url: window.location.href,
    };

    try {
      // Check if native sharing is supported (Mobile/Safari)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to Clipboard (Desktop/Chrome)
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!", {
          icon: '🔗',
          style: {
            borderRadius: '0px',
            background: '#1A1A1A',
            color: '#fff',
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          },
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Error sharing:", error);
        toast.error("Sharing failed. Please try again.");
      }
    }
  };

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
    // 👇 Adds automatic resizing and next-gen WebP compression!
    return image ? urlFor(image).width(800).format('webp').url() : "/images/placeholder.jpg";
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : "",
            description: product.description || product.shortDesc,
            sku: typeof product.slug === 'string' ? product.slug : product.slug?.current,
            keywords: product.tags?.join(", "),
            offers: {
              "@type": "Offer",
              url: `https://traaya-trends.vercel.app/product/${slug}`,
              priceCurrency: "USD",
              price: product.price,
              availability: product.stockLevel > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
            // Automatically adds your 5-star reviews to Google Search!
            ...(reviews.length > 0 && {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: averageRating,
                reviewCount: reviews.length,
              }
            })
          }),
        }}
      />

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
              
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 font-sans pointer-events-none">
    
              {/* SALE BADGE - Elegant Gold Pill with Icon */}
              {product.salePrice && (
              <div className="flex items-center gap-1.5 bg-secondary text-white pl-2.5 pr-3 py-1.5 rounded-full shadow-md ring-1 ring-white/30 backdrop-blur-sm bg-opacity-[0.97]">
                  <Tag size={11} fill="currentColor" className="opacity-90" />
                  <span className="text-[9px] leading-none font-bold uppercase tracking-[0.15em]">Sale</span>
              </div>
              )}

              {/* LOW STOCK BADGE - Urgent Burnt Orange with Count */}
              {isLowStock && !isOutOfStock && (
                <div className="flex items-center gap-1.5 bg-[#C05621] text-white pl-2.5 pr-3 py-1.5 rounded-full shadow-md ring-1 ring-white/30 backdrop-blur-sm bg-opacity-[0.97]">
                    <AlertTriangle size={11} className="opacity-90" />
                    <span className="text-[9px] leading-none font-bold uppercase tracking-[0.15em]">
                        Only {stockLevel} Left
                    </span>
                </div>
              )}

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
                <button 
                  onClick={handleShare}
                  className="text-gray-400 hover:text-primary transition-colors p-2 -mr-2"
                  title="Share Product"
                >
                  <Share2 size={18} />
                </button>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl mb-4 text-primary leading-tight">{product.name}</h1>

              <div className="flex items-baseline gap-4 mb-6">
                {product.salePrice ? (
                  <>
                    <span className="text-2xl md:text-3xl font-medium text-secondary">
                      <Price amount={product.salePrice} />
                    </span>
                    <span className="text-gray-400 line-through text-lg italic">
                      <Price amount={product.price} />
                    </span>
                  </>
                ) : (
                  <span className="text-2xl md:text-3xl font-medium text-primary">
                    <Price amount={product.price} />
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-8 border-b border-gray-100 pb-8">{product.shortDesc || "Experience the elegance of handcrafted luxury."}</p>

              {/* Selectors */}
              <div className="space-y-6 mb-8">
                {/* MATERIAL SELECTOR */}
                {product.materials && product.materials.length > 0 && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">Material</span>
                      <span className="text-xs text-gray-500">{selectedMaterial}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {product.materials.map((mat) => (
                        <button 
                          key={mat} 
                          onClick={() => setSelectedMaterial(mat)} 
                          className={`px-4 h-10 flex items-center justify-center text-xs font-bold border transition-all ${
                            selectedMaterial === mat ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary"
                          }`}
                        >
                          {mat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SIZE SELECTOR */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">Size</span>
                      <Link href="#" className="text-[10px] underline text-gray-400 hover:text-primary">Size Guide</Link>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((size) => (
                        <button 
                          key={size} 
                          onClick={() => setSelectedSize(size)} 
                          className={`h-10 px-4 min-w-[3rem] flex items-center justify-center text-xs font-bold border transition-all ${
                            selectedSize === size ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* COLOR SELECTOR */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">Color</span>
                      <span className="text-xs text-gray-500">{selectedColor}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {product.colors.map((color) => (
                        <button 
                          key={color} 
                          onClick={() => setSelectedColor(color)} 
                          className={`px-4 h-10 flex items-center justify-center text-xs font-bold border transition-all ${
                            selectedColor === color ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-primary"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
                        <AddToCartButton product={{ ...product, slug: typeof product.slug === 'string' ? product.slug : product.slug.current, selectedSize, selectedMaterial, selectedColor }} stock={stockLevel} styleType="full" />
                    </div>
                    <div className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                        <WishlistButton productId={product._id} />
                    </div>
                </div>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
                  <div className="text-center"><ShoppingBag size={14} className="text-primary mx-auto mb-2"/><p className="text-[10px] uppercase font-bold text-gray-500">Complimentary Shipping</p> <p className="text-[10px] text-gray-500"> On all orders above ₹1,999. </p> </div>
                  <div className="text-center"><Check size={14} className="text-primary mx-auto mb-2"/><p className="text-[10px] uppercase font-bold text-gray-500">Ethical Craftsmanship</p> <p className="text-[10px] text-gray-500"> 100% handcrafted pieces designed to be shared, gifted, and worn as tangible reminders of the people who anchor your life.</p> </div>
                  <div className="text-center"><ArrowRightLeft size={14} className="text-primary mx-auto mb-2"/><p className="text-[10px] uppercase font-bold text-gray-500">Carbon-Neutral Returns</p> <p className="text-[10px] text-gray-500"> Easy 14-day returns in original packaging to ensure your perfect fit. </p>  </div>
              </div>

              {/* Accordions */}
              <div className="border-t border-gray-100 mt-6">
                {['Description', 'Additional Information', 'Shipping & Returns'].map((section) => (
                    <div key={section} className="border-b border-gray-100">
                        <button onClick={() => toggleSection(section.toLowerCase())} className="w-full py-5 flex items-center justify-between group text-left transition-colors cursor-pointer">
                            <span className="font-serif text-sm uppercase tracking-widest text-primary">{section}</span>
                            <ChevronRight size={16} className={`transition-transform duration-300 ${activeSections.includes(section.toLowerCase()) ? 'rotate-90 text-secondary' : 'text-gray-400'}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeSections.includes(section.toLowerCase()) ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {section === 'Description' ? (product.description || "No description.") : section === 'Additional Information' ? (product.additionalInfo || "Handcrafted.") : "Free shipping over ₹1,999."}
                            </p>
                        </div>
                    </div>
                ))}
              </div>
              {/* Visual Tags for UX/SEO */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 block">Related Styles</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-3 py-1 border border-gray-100 rounded-full hover:bg-secondary hover:text-white transition-colors cursor-default">
                        #{tag.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
          <div className="flex items-end justify-between mb-12">
            <div>
                <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block">Curated for You</span>
                <h2 className="font-serif text-3xl md:text-4xl text-primary uppercase tracking-wide">You May Also Like</h2>
            </div>
            <Link href="/shop" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors border-b border-gray-200 pb-1">View All</Link>
          </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {relatedProducts.map((item) => {
            const hasSecondaryImage = item.images && item.images.length > 1;
            
            return (
              <div key={item._id} className="group flex flex-col relative animate-in fade-in duration-700">
                
                {/* Image Container with Hover Switch */}
                <div className="relative aspect-[3/4] bg-[#F9F9F9] mb-5 overflow-hidden rounded-sm cursor-pointer">
                  
                  {/* Sale Badge for Related Products */}
                  {item.salePrice && (
                      <div className="absolute top-3 left-3 z-20">
                          <div className="flex items-center gap-1 bg-secondary text-white px-2 py-1 rounded-full shadow-sm">
                              <Tag size={8} fill="currentColor" />
                              <span className="text-[8px] font-bold uppercase tracking-widest">Sale</span>
                          </div>
                      </div>
                  )}

                  <Link href={`/product/${typeof item.slug === 'string' ? item.slug : item.slug.current}`} className="block w-full h-full">
                      {/* Primary Image (Featured) */}
                      {item.images && item.images[0] && (
                          <Image 
                              src={getImageUrl(item.images[0])} 
                              alt={item.name} 
                              fill 
                              className={`object-cover transition-opacity duration-700 ease-in-out ${hasSecondaryImage ? 'group-hover:opacity-0' : ''}`} 
                          />
                      )}

                      {/* Secondary Image (First Gallery Image - visible on hover) */}
                      {hasSecondaryImage && (
                          <Image 
                              src={getImageUrl(item.images[1])} 
                              alt={`${item.name} alternate view`} 
                              fill 
                              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out scale-105 group-hover:scale-100" 
                          />
                      )}
                  </Link>

                  {/* Quick Add to Cart Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                      <AddToCartButton 
                          product={{ ...item, slug: typeof item.slug === 'string' ? item.slug : item.slug.current }} 
                          stock={item.stockLevel} 
                          styleType="minimal" 
                      />
                  </div>
                </div>

                {/* Product Details */}
                <div className="text-center px-2">
                    <h3 className="font-serif text-sm md:text-base text-primary hover:text-secondary transition-colors mb-2 line-clamp-1">
                        <Link href={`/product/${typeof item.slug === 'string' ? item.slug : item.slug.current}`}>{item.name}</Link>
                    </h3>
                    
                    <div className="flex items-center justify-center gap-3">
                        {item.salePrice ? (
                          <>
                              <span className="text-xs font-bold text-secondary"><Price amount={item.salePrice} /></span>
                              <span className="text-[10px] text-gray-400 line-through italic"><Price amount={item.price} /></span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-gray-500"><Price amount={item.price} /></span>
                        )}
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      </div>
      
      {/* Lightbox - Now 100% Lazy Loaded! */}
      {isModalOpen && product?.images && (
        <ImageLightbox 
           imageUrl={getImageUrl(product.images[currentImageIndex])}
           onClose={() => setIsModalOpen(false)}
           onNext={nextImage}
           onPrev={prevImage}
        />
      )}
    </main>
  );
}