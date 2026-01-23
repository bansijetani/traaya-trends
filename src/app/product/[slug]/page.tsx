"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  Heart, ArrowRightLeft, Facebook, Instagram, Twitter, 
  Star, ChevronRight, ChevronLeft, X, Check, ArrowUpRight, 
  ShoppingBag, Eye, ArrowLeft, ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { useCart } from "@/context/CartContext"; // <--- 1. Import Hook

// --- TYPES ---
interface SanityProduct {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  description?: string;
  shortDesc?: string;
  images: any[];
  stock?: number;
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
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [activeSections, setActiveSections] = useState<string[]>(['description']);
  const [selectedSize, setSelectedSize] = useState("50");
  const [selectedMaterial, setSelectedMaterial] = useState("Gold");

  // --- HOOKS ---
  const { addToCart } = useCart(); // <--- 2. Get the function

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const productQuery = `*[_type == "product" && slug.current == "${slug}"][0]{
          _id, name, price, oldPrice, description, "shortDesc": description, 
          "slug": slug.current, images, stock, category, details
        }`;
        const fetchedProduct = await client.fetch(productQuery);
        setProduct(fetchedProduct);

        if (fetchedProduct) {
          const relatedQuery = `*[_type == "product" && _id != "${fetchedProduct._id}"][0...4]{
            _id, name, price, oldPrice, "slug": slug.current, "images": images
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

  // --- HELPER TO GET IMAGE URL ---
  const getImageUrl = (image: any) => {
    return image ? urlFor(image).url() : "/images/placeholder.jpg";
  };

  // --- ADD TO CART FUNCTION ---
  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: getImageUrl(product.images && product.images[0]),
      quantity: quantity,
      slug: product.slug
    });

    // Simple feedback (You can replace this with a toast notification later)
    alert(`Added ${quantity} x ${product.name} to your bag!`);
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

  // Static Data
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
          <Link href="/">Home</Link> <ChevronRight size={10} /> <Link href="/shop">Shop</Link> <ChevronRight size={10} /> <span className="text-black truncate">{product.name}</span>
        </div>

        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT: Images */}
          <div className="w-full flex flex-col gap-4">
            <div className="w-full aspect-square bg-[#F9F9F9] relative rounded-sm overflow-hidden border border-transparent hover:border-[#E5E5E5] transition-colors group cursor-zoom-in" onClick={() => setIsModalOpen(true)}>
              {product.images && product.images.length > 0 ? (
                <img src={getImageUrl(product.images[currentImageIndex])} alt={product.name} className="w-full h-full object-contain p-8 md:p-16 mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
              ) : <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>}
              {product.oldPrice && <span className="absolute top-4 left-4 bg-[#B87E58] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">Sale</span>}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="w-full grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <div key={i} onClick={() => setCurrentImageIndex(i)} className={`aspect-square bg-[#F9F9F9] cursor-pointer border rounded-sm transition-all overflow-hidden ${currentImageIndex === i ? "border-[#B87E58] ring-1" : "border-transparent"}`}>
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

              <div className="flex items-center gap-3 mb-8 border-b border-[#E5E5E5] pb-8">
                <span className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">${product.price.toLocaleString()}</span>
                {product.oldPrice && <span className="text-[#888] line-through text-lg md:text-xl">${product.oldPrice.toLocaleString()}</span>}
              </div>

              <p className="text-[#555] text-sm leading-relaxed mb-8 max-w-lg">{product.shortDesc || "Experience the elegance of handcrafted luxury."}</p>

              {/* Selectors */}
              <div className="space-y-8 mb-10 bg-white">
                <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#E5E5E5]">
                  <span className="text-sm font-bold text-[#1A1A1A]">Material: <span className="font-normal text-[#555] ml-1">{selectedMaterial}</span></span>
                  <div className="flex gap-3">
                    {mockMaterials.map((mat) => (
                      <button key={mat.name} onClick={() => setSelectedMaterial(mat.name)} className={`w-9 h-9 rounded-full border relative flex items-center justify-center transition-transform hover:scale-110 ${selectedMaterial === mat.name ? "ring-1 ring-offset-2 ring-[#1A1A1A]" : "border-transparent"}`} style={{ background: `linear-gradient(135deg, ${mat.color} 50%, #ffffff 100%)` }} title={mat.name} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#E5E5E5]">
                  <span className="text-sm font-bold text-[#1A1A1A]">Size: <span className="font-normal text-[#555] ml-1">{selectedSize}</span></span>
                  <div className="flex gap-2">
                    {mockSizes.map((size) => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`w-11 h-11 flex items-center justify-center text-xs font-bold transition-all ${selectedSize === size ? "bg-[#1A1A1A] text-white" : "bg-white text-[#1A1A1A] hover:bg-[#F5F5F5]"}`}>{size}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 h-14 mb-4">
                {/* --- THE ADD TO CART BUTTON --- */}
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#B87E58] text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#A66D4A] transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-95"
                >
                  ADD TO BAG — ${(product.price * quantity).toFixed(2)}
                </button>
                
                <button className="w-14 border border-[#E5E5E5] flex items-center justify-center hover:border-[#1A1A1A] transition-colors bg-white group"><Heart size={20} className="text-[#555] group-hover:text-black"/></button>
              </div>

              <button className="w-full bg-white border border-[#1A1A1A] text-[#1A1A1A] h-14 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#1A1A1A] hover:text-white transition-colors mb-10">BUY IT NOW</button>
            </div>
          </div>
        </div>

        {/* Accordions */}
        <div className="max-w-[1500px] mx-auto mt-20 border-t border-[#E5E5E5]">
          <div className="border-b border-[#E5E5E5]">
            <button onClick={() => toggleSection('description')} className="w-full py-6 md:py-8 flex items-center justify-between group text-left transition-colors">
              <div className="flex items-center gap-4"><ArrowUpRight size={20} className={`transition-all duration-300 ${activeSections.includes('description') ? 'rotate-90 text-[#B87E58]' : 'text-[#1A1A1A]'}`} /><span className={`font-serif text-lg md:text-xl uppercase tracking-wide ${activeSections.includes('description') ? 'text-[#B87E58]' : 'text-[#1A1A1A]'}`}>Description</span></div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeSections.includes('description') ? 'max-h-[1000px] opacity-100 pb-10' : 'max-h-0 opacity-0'}`}><div className="md:pl-9"><p className="text-[#555] text-sm leading-8 max-w-4xl">{product.description || "No description."}</p></div></div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="max-w-[1500px] mx-auto mt-24 mb-16 pt-16">
          <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-wide text-[#1A1A1A] mb-10">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <Link href={`/product/${item.slug}`} key={item._id} className="group cursor-pointer">
                <div className="relative aspect-square bg-[#F9F9F9] mb-4 overflow-hidden rounded-sm">
                  {item.images && item.images[0] ? <img src={getImageUrl(item.images[0])} alt={item.name} className="w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" /> : null}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide mb-1 hover:text-[#B87E58] transition-colors">{item.name}</h3>
                  <div className="flex items-center gap-2"><span className="font-bold text-[#1A1A1A]">${item.price.toLocaleString()}</span></div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
      
      {/* Lightbox */}
      {isModalOpen && product?.images && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/70 p-2"><X size={40}/></button>
          <button onClick={prevImage} className="absolute left-4 text-white/50 p-4"><ChevronLeft size={60}/></button>
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}><img src={getImageUrl(product.images[currentImageIndex])} className="max-w-full max-h-[90vh] object-contain shadow-2xl" /></div>
          <button onClick={nextImage} className="absolute right-4 text-white/50 p-4"><ChevronRight size={60}/></button>
        </div>
      )}

      <Footer />
    </main>
  );
}