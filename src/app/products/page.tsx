"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Star, Minus, Plus, Heart, Share2, Truck, RotateCcw, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// --- MOCK DATA ---
const allProducts = [
  { 
    id: 1, 
    name: "Emerald-cut Halo Engagement Ring", 
    price: 3370, 
    description: "Handcrafted with precision, this Emerald-cut Halo Engagement Ring features a stunning central diamond surrounded by a halo of smaller brilliants. Set in 18k Gold, it offers a timeless elegance that captures the light from every angle.",
    images: ["/images/product-1.jpg", "/images/product-2.jpg", "/images/product-3.jpg", "/images/product-4.jpg"],
    rating: 4.8,
    reviews: 124
  },
  { 
    id: 2, 
    name: "Sparkling Infinity Heart Clasp", 
    price: 2499, 
    description: "A symbol of everlasting love, this Infinity Heart Clasp bracelet combines modern design with classic sophistication.",
    images: ["/images/product-3.jpg", "/images/product-4.jpg", "/images/trendy-1.jpg", "/images/trendy-2.jpg"],
    rating: 4.9,
    reviews: 85
  },
  { 
    id: 3, 
    name: "Infinite Lab-Grown Diamond Bangle", 
    price: 1847, 
    description: "Modern luxury meets sustainability. This lab-grown diamond bangle offers brilliant sparkle with an eco-conscious footprint.",
    images: ["/images/product-5.jpg", "/images/trendy-3.jpg", "/images/trendy-4.jpg", "/images/product-1.jpg"],
    rating: 4.5,
    reviews: 42
  },
  { 
    id: 4, 
    name: "Olive Leaf Band Ring", 
    price: 327, 
    description: "Inspired by nature, this Olive Leaf Band Ring symbolizes peace and abundance. A perfect gift for yourself or a loved one.",
    images: ["/images/trendy-2.jpg", "/images/trendy-3.jpg", "/images/product-2.jpg", "/images/product-1.jpg"],
    rating: 4.7,
    reviews: 56
  },
  // Fallback for demo purposes
  { 
    id: 999, 
    name: "Classic Gold Band", 
    price: 850, 
    description: "Simple, elegant, and timeless. This classic gold band is perfect for stacking or wearing alone.",
    images: ["/images/product-5.jpg", "/images/trendy-3.jpg", "/images/trendy-4.jpg", "/images/product-1.jpg"],
    rating: 4.5,
    reviews: 42
  }
];

export default function ProductPage() {
  const params = useParams();
  const id = Number(params.id);
  
  // Find product or use fallback (id: 1) if not found, to prevent crash
  const product = allProducts.find(p => p.id === id) || allProducts[0];

  const [mainImage, setMainImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("7");
  const [selectedMaterial, setSelectedMaterial] = useState("Gold");
  const [openSection, setOpenSection] = useState<string | null>("description");

  const sizes = ["5", "6", "7", "8", "9"];
  const materials = ["Gold", "Silver", "Rose Gold"];

  // Function to toggle accordion sections
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] pt-[140px]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 text-xs font-medium uppercase tracking-widest text-[#888] border-b border-[#E5E5E5]">
        <Link href="/" className="hover:text-[#1A1A1A]">Home</Link> 
        <span className="mx-2">/</span> 
        <Link href="/shop" className="hover:text-[#1A1A1A]">Shop</Link> 
        <span className="mx-2">/</span> 
        <span className="text-[#1A1A1A]">{product.name}</span>
      </div>

      {/* --- PRODUCT MAIN SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible scrollbar-hide py-2 lg:py-0">
              {product.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 lg:w-24 lg:h-24 shrink-0 border cursor-pointer transition-all ${mainImage === img ? "border-[#A89160]" : "border-transparent hover:border-[#E5E5E5]"}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain p-2" />
                </div>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1 bg-[#F9F9F9] aspect-[4/5] relative w-full group overflow-hidden">
              <img src={mainImage} alt={product.name} className="w-full h-full object-contain p-12 mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
              <button className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-sm hover:text-[#A89160] transition-colors z-10">
                <Heart size={20} />
              </button>
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl lg:text-4xl mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl text-[#A89160] font-medium">${product.price.toLocaleString()}.00</span>
              <div className="flex items-center gap-1">
                <div className="flex text-[#A89160]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-xs text-[#888] underline decoration-[#888] underline-offset-4 ml-2 cursor-pointer">
                  {product.reviews} Reviews
                </span>
              </div>
            </div>

            <p className="text-[#555] leading-relaxed mb-8 font-sans max-w-lg">
              {product.description}
            </p>

            {/* Selectors */}
            <div className="space-y-6 mb-8 pb-8 border-b border-[#E5E5E5]">
              {/* Material */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest mb-3 block">Material: <span className="text-[#A89160]">{selectedMaterial}</span></span>
                <div className="flex gap-3">
                  {materials.map(mat => (
                    <button 
                      key={mat}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`px-6 py-2 border text-sm transition-all ${selectedMaterial === mat ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#E5E5E5] text-[#555] hover:border-[#1A1A1A]"}`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <div className="flex justify-between items-center mb-3 max-w-[400px]">
                  <span className="text-xs font-bold uppercase tracking-widest">Size: <span className="text-[#A89160]">{selectedSize}</span></span>
                  <button className="text-[10px] underline uppercase tracking-widest text-[#888] hover:text-[#1A1A1A]">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 border flex items-center justify-center text-sm transition-all ${selectedSize === size ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#E5E5E5] text-[#555] hover:border-[#1A1A1A]"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center border border-[#E5E5E5] w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"><Minus size={16}/></button>
                <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"><Plus size={16}/></button>
              </div>
              <button className="flex-1 bg-[#1A1A1A] text-white h-12 font-bold uppercase tracking-widest text-sm hover:bg-[#A89160] transition-colors shadow-lg">
                Add to Cart
              </button>
            </div>

            {/* Info Items */}
            <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-widest text-[#555] mb-10">
              <div className="flex items-center gap-3"><Truck size={18}/> Free Shipping</div>
              <div className="flex items-center gap-3"><RotateCcw size={18}/> 30 Days Return</div>
              <div className="flex items-center gap-3"><ShieldCheck size={18}/> 2 Year Warranty</div>
              <div className="flex items-center gap-3"><Share2 size={18}/> Share</div>
            </div>

            {/* Accordions (Fixed onClick Handler) */}
            <div className="border-t border-[#E5E5E5]">
              {["Description", "Additional Information", "Reviews"].map((item) => {
                const key = item.toLowerCase().replace(" ", "");
                const isOpen = openSection === key;
                
                return (
                  <div key={item} className="border-b border-[#E5E5E5]">
                    <button 
                      onClick={() => toggleSection(key)} 
                      className="w-full flex justify-between items-center py-5 text-left group"
                    >
                      <span className={`font-serif text-lg ${isOpen ? "text-[#A89160]" : "text-[#1A1A1A]"} group-hover:text-[#A89160] transition-colors`}>{item}</span>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isOpen && (
                      <div className="pb-6 text-sm text-[#555] leading-relaxed">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* --- RELATED PRODUCTS --- */}
      <section className="bg-[#FAF6F2] py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">You May Also Like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allProducts.slice(0, 4).map((p) => (
              <Link href={`/products/${p.id}`} key={p.id} className="group cursor-pointer bg-white p-4 transition-shadow hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden mb-4 bg-[#F9F9F9]">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="font-serif text-lg mb-1 truncate text-[#1A1A1A] group-hover:text-[#A89160] transition-colors">{p.name}</h3>
                <p className="text-[#A89160] text-sm font-bold">${p.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}