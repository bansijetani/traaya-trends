"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  Heart, ArrowRightLeft, Facebook, Instagram, Twitter, 
  Star, ChevronRight, ChevronLeft, X, Check, ArrowUpRight, 
  ShoppingBag, Eye, ArrowLeft, ArrowRight, AlertTriangle 
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/WishlistButton";

// --- TYPES ---
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
  slug: string;
}

export default function ProductPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  // --- STATE ---
  const [product, setProduct] = useState<SanityProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<SanityProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSections, setActiveSections] = useState<string[]>(['description']);
  const [selectedSize, setSelectedSize] = useState("50");
  const [selectedMaterial, setSelectedMaterial] = useState("Gold");

  // --- HOOKS ---
  const { addToCart } = useCart();

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const productQuery = `*[_type == "product" && slug.current == "${slug}"][0]{
          _id, name, price, oldPrice, description, "shortDesc": description, 
          "slug": slug.current, images, stockLevel, category, details
        }`;
        const fetchedProduct = await client.fetch(productQuery);
        setProduct(fetchedProduct);

        if (fetchedProduct) {
          const relatedQuery = `*[_type == "product" && _id != "${fetchedProduct._id}"][0...4]{
            _id, name, price, oldPrice, "slug": slug.current, "images": images, "stockLevel": stockLevel
          }`;
          const fetchedRelated = await client.fetch(relatedQuery);
          setRelatedProducts(fetchedRelated);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [slug]);

  const getImageUrl = (image: any) => {
    return image ? urlFor(image).url() : "/images/placeholder.jpg";
  };

  // --- STOCK LOGIC ---
  const stockLevel = product?.stockLevel ?? 0;
  const isOutOfStock = stockLevel === 0;
  const isLowStock = stockLevel > 0 && stockLevel <= 5;

  // --- MAIN ADD TO CART ---
  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: getImageUrl(product.images && product.images[0]),
      quantity: quantity,
      slug: product.slug
    });
    alert(`Added ${quantity} x ${product.name} to your bag!`);
  };

  // --- RELATED PRODUCT HANDLERS ---
  const handleQuickAddToCart = (e: React.MouseEvent, item: SanityProduct) => {
    e.preventDefault(); e.stopPropagation();
    if(item.stockLevel === 0) { alert("Sorry, this item is out of stock."); return; }
    addToCart({
        id: item._id, name: item.name, price: item.price,
        image: getImageUrl(item.images && item.images[0]), quantity: 1, slug: item.slug
    });
    alert(`Added ${item.name} to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent, item: SanityProduct) => {
     e.preventDefault(); e.stopPropagation();
     alert("Wishlist functionality coming soon!");
  };
  
  const handleQuickView = (e: React.MouseEvent, item: SanityProduct) => {
    e.preventDefault(); e.stopPropagation();
    alert("Quick View coming soon!");
 };

 const handleCompare = (e: React.MouseEvent, item: SanityProduct) => {
    e.preventDefault(); e.stopPropagation();
    alert("Compare functionality coming soon!");
 };


  // --- LOGIC ---
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

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-[#B87E58] border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product Not Found</div>;

  return (
    <main className="bg-white text-[#1A1A1A]">
      <Navbar />

      <div className="pt-[120px] md:pt-[160px] pb-16 md:pb-24 px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="max-w-[1500px] mx-auto mb-8 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#888] flex items-center gap-2">
          <Link href="/" className="cursor-pointer hover:text-black transition-colors">Home</Link> <ChevronRight size={10} /> 
          <Link href="/shop" className="cursor-pointer hover:text-black transition-colors">Shop</Link> <ChevronRight size={10} /> 
          <span className="text-black truncate">{product.name}</span>
        </div>

        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT: Images */}
          <div className="w-full flex flex-col gap-4">
            <div 
                className="w-full aspect-square bg-[#F9F9F9] relative rounded-sm overflow-hidden border border-transparent hover:border-[#E5E5E5] transition-colors group cursor-zoom-in" 
                onClick={() => setIsModalOpen(true)}
            >
              {product.images && product.images.length > 0 ? (
                <img src={getImageUrl(product.images[currentImageIndex])} alt={product.name} className={`w-full h-full object-contain p-8 md:p-16 mix-blend-multiply transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} />
              ) : <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>}
              
              {product.oldPrice && <span className="absolute top-4 left-4 bg-[#B87E58] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">Sale</span>}
              {isOutOfStock && <span className="absolute top-4 right-4 bg-[#1A1A1A] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">Sold Out</span>}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="w-full grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setCurrentImageIndex(i)} 
                    className={`aspect-square bg-[#F9F9F9] cursor-pointer border rounded-sm transition-all overflow-hidden ${currentImageIndex === i ? "border-[#B87E58] ring-1" : "border-transparent"}`}
                  >
                    <img src={getImageUrl(img)} alt={`Thumbnail ${i}`} className="w-full h-full object-contain p-2 mix-blend-multiply" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="w-full relative h-full">
            <div className="md:sticky md:top-[160px] pt-2">
              <div className="flex items-center gap-1 mb-4">
                <div className="flex text-[#1A1A1A]">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} strokeWidth={0} className={i < 4 ? "text-black" : "text-gray-300"} />)}</div>
                <span className="text-xs text-[#888] ml-2">(3 reviews)</span>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl mb-4 text-[#1A1A1A] leading-tight">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">${product.price.toLocaleString()}</span>
                {product.oldPrice && <span className="text-[#888] line-through text-lg md:text-xl">${product.oldPrice.toLocaleString()}</span>}
              </div>

              {isLowStock && (
                <div className="flex items-center gap-2 mb-6 text-orange-600 bg-orange-50 px-3 py-2 rounded-md w-fit">
                    <AlertTriangle size={16} />
                    <span className="text-xs font-bold uppercase tracking-wide">Only {stockLevel} left in stock!</span>
                </div>
              )}

              <p className="text-[#555] text-sm leading-relaxed mb-8 max-w-lg border-t border-[#E5E5E5] pt-8 mt-4">{product.shortDesc || "Experience the elegance of handcrafted luxury."}</p>

              {/* Selectors */}
              <div className="space-y-8 mb-10 bg-white">
                <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#E5E5E5]">
                  <span className="text-sm font-bold text-[#1A1A1A]">Material: <span className="font-normal text-[#555] ml-1">{selectedMaterial}</span></span>
                  <div className="flex gap-3">
                    {mockMaterials.map((mat) => (
                      <button 
                        key={mat.name} 
                        onClick={() => setSelectedMaterial(mat.name)} 
                        className={`cursor-pointer w-9 h-9 rounded-full border relative flex items-center justify-center transition-transform hover:scale-110 ${selectedMaterial === mat.name ? "ring-1 ring-offset-2 ring-[#1A1A1A]" : "border-transparent"}`} 
                        style={{ background: `linear-gradient(135deg, ${mat.color} 50%, #ffffff 100%)` }} 
                        title={mat.name} 
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#E5E5E5]">
                  <span className="text-sm font-bold text-[#1A1A1A]">Size: <span className="font-normal text-[#555] ml-1">{selectedSize}</span></span>
                  <div className="flex gap-2">
                    {mockSizes.map((size) => (
                      <button 
                        key={size} 
                        onClick={() => setSelectedSize(size)} 
                        className={`cursor-pointer w-11 h-11 flex items-center justify-center text-xs font-bold transition-all ${selectedSize === size ? "bg-[#1A1A1A] text-white" : "bg-white text-[#1A1A1A] hover:bg-[#F5F5F5]"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 h-14 mb-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95
                    ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed text-gray-500 hover:bg-gray-300' : 'bg-[#B87E58] hover:bg-[#A66D4A] cursor-pointer'}`}
                >
                  {isOutOfStock ? "OUT OF STOCK" : `ADD TO BAG — $${(product.price * quantity).toFixed(2)}`}
                </button>
                <div className="w-14 h-14 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <WishlistButton productId={product._id} />
                </div>
              </div>

              {!isOutOfStock && (
                 <button className="w-full bg-white border border-[#1A1A1A] text-[#1A1A1A] h-14 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#1A1A1A] hover:text-white transition-colors mb-10 cursor-pointer">
                    BUY IT NOW
                 </button>
              )}
            </div>
          </div>
        </div>

        {/* Accordions */}
        <div className="max-w-[1500px] mx-auto mt-20 border-t border-[#E5E5E5]">
          <div className="border-b border-[#E5E5E5]">
            <button onClick={() => toggleSection('description')} className="w-full py-6 md:py-8 flex items-center justify-between group text-left transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                  <ArrowUpRight size={20} className={`transition-all duration-300 ${activeSections.includes('description') ? 'rotate-90 text-[#B87E58]' : 'text-[#1A1A1A]'}`} />
                  <span className={`font-serif text-lg md:text-xl uppercase tracking-wide ${activeSections.includes('description') ? 'text-[#B87E58]' : 'text-[#1A1A1A]'}`}>Description</span>
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeSections.includes('description') ? 'max-h-[1000px] opacity-100 pb-10' : 'max-h-0 opacity-0'}`}><div className="md:pl-9"><p className="text-[#555] text-sm leading-8 max-w-4xl">{product.description || "No description."}</p></div></div>
          </div>
        </div>

        {/* You May Also Like - UPDATED WITH HOVER ICONS */}
        <div className="max-w-[1500px] mx-auto mt-24 mb-16 pt-16">
          <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-wide text-[#1A1A1A] mb-10">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <div key={item._id} className="group relative">
                {/* Image Container */}
                <div className="relative aspect-square bg-[#F9F9F9] mb-4 overflow-hidden rounded-sm">
                   {/* Clickable Link for Image */}
                   <Link href={`/product/${item.slug}`} className="block w-full h-full cursor-pointer">
                    {item.images && item.images[0] ? <img src={getImageUrl(item.images[0])} alt={item.name} className="w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" /> : null}
                   </Link>

                   {/* HOVER ACTION ICONS */}
                   <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-10">
                       
                       {/* Wishlist */}
                       <button onClick={(e) => handleWishlist(e, item)} className="bg-white p-3 rounded-full shadow-sm text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors group/btn relative cursor-pointer">
                          <Heart size={18} />
                          {/* Tooltip */}
                          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all whitespace-nowrap pointer-events-none">Add to Wishlist</span>
                       </button>

                       {/* Add to Cart */}
                       <button onClick={(e) => handleQuickAddToCart(e, item)} className="bg-white p-3 rounded-full shadow-sm text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors group/btn relative cursor-pointer">
                          <ShoppingBag size={18} />
                          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all whitespace-nowrap pointer-events-none">Add to Cart</span>
                       </button>

                       {/* Quick View */}
                       <button onClick={(e) => handleQuickView(e, item)} className="bg-white p-3 rounded-full shadow-sm text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors group/btn relative cursor-pointer">
                          <Eye size={18} />
                          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all whitespace-nowrap pointer-events-none">Quick View</span>
                       </button>
                       
                       {/* Compare */}
                       <button onClick={(e) => handleCompare(e, item)} className="bg-white p-3 rounded-full shadow-sm text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors group/btn relative cursor-pointer">
                          <ArrowRightLeft size={18} />
                          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all whitespace-nowrap pointer-events-none">Compare</span>
                       </button>
                   </div>
                </div>

                {/* Text Content Link */}
                <Link href={`/product/${item.slug}`} className="cursor-pointer block">
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide mb-1 hover:text-[#B87E58] transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-2"><span className="font-bold text-[#1A1A1A]">${item.price.toLocaleString()}</span></div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      {/* Lightbox */}
      {isModalOpen && product?.images && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer" onClick={() => setIsModalOpen(false)}>
          <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/70 p-2 cursor-pointer hover:text-white transition-colors"><X size={40}/></button>
          <button onClick={prevImage} className="absolute left-4 text-white/50 p-4 cursor-pointer hover:text-white transition-colors"><ChevronLeft size={60}/></button>
          <div className="relative max-w-[90vw] max-h-[90vh] cursor-default" onClick={(e) => e.stopPropagation()}><img src={getImageUrl(product.images[currentImageIndex])} className="max-w-full max-h-[90vh] object-contain shadow-2xl" /></div>
          <button onClick={nextImage} className="absolute right-4 text-white/50 p-4 cursor-pointer hover:text-white transition-colors"><ChevronRight size={60}/></button>
        </div>
      )}

      <Footer />
    </main>
  );
}