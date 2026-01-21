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

// --- MOCK DATA ---
const allProducts = [
  { 
    id: 1, 
    name: "Dança Ring", 
    price: 1199.00,
    oldPrice: 2899.00,
    shortDesc: "This regulator has a rolled diaphragm and high flow rate with reduced pressure drop. It has an excellent degree of condensation.",
    description: "Link what you love. This sterling silver link chain holds endless styling potential. Featuring two openable links, groups of four static links between each one and a carabiner closure. Customise your link chain – then remix it with meaningful charms. Hand-finished and stylish, this piece is designed to be worn every day.",
    additionalInfo: {
      Material: "Gold, Rose Gold, Silver",
      Color: "White",
      Stone: "Diamond",
      Brand: "Vemus",
      Size: "5, 6, 7, 8"
    },
    images: ["/images/product-1.jpg", "/images/product-2.jpg", "/images/product-3.jpg", "/images/product-4.jpg"],
    stock: 4,
    materials: [
      { name: "Gold", color: "#E6C200" }, 
      { name: "Rose", color: "#E6A5A5" },
      { name: "Silver", color: "#E0E0E0" }
    ],
    sizes: ["48", "50", "52", "54"],
    rating: 5,
    reviews: 3,
    reviewData: [
      { id: 1, name: "Emily R.", date: "Mar 3rd, 2025", rating: 5, text: "Absolutely stunning! I bought a gold necklace from here, and the quality exceeded my expectations. The craftsmanship is top-notch, and the packaging was beautiful. Will definitely return for more!" },
      { id: 2, name: "James L.", date: "Mar 3rd, 2025", rating: 5, text: "I purchased an engagement ring, and my fiancée loves it! The diamonds sparkle beautifully, and the staff was incredibly helpful in guiding me through the selection process. Highly recommend!" },
      { id: 3, name: "Sophia M.", date: "Mar 3rd, 2025", rating: 5, text: "This jewelry shop is my go-to! The designs are elegant, and the prices are reasonable for the quality you get. I recently got a pair of silver earrings, and they are just perfect. Amazing service too!" }
    ]
  },
  { id: 999, name: "Classic Gold Band", price: 850, oldPrice: 1200, shortDesc: "Classic.", description: "A timeless classic.", additionalInfo: { Material: "Gold", Color: "Gold", Stone: "None", Brand: "Vemus", Size: "All" }, images: ["/images/product-5.jpg"], stock: 10, materials: [], sizes: [], rating: 4.5, reviews: 8, reviewData: [] }
];

const frequentItems = [
  { id: 101, name: "Crystal Birthstone Eternity Circle Charm", price: 2499.00, oldPrice: 2899.00, image: "/images/product-2.jpg" },
  { id: 102, name: "Sparkling Infinity Heart Clasp Snake Chain Bracelet", price: 2499.00, oldPrice: 2899.00, image: "/images/product-3.jpg" },
  { id: 103, name: "Engagement Ring in 18k Yellow Gold", price: 2499.00, oldPrice: 2899.00, image: "/images/product-4.jpg" },
];

const relatedProducts = [
  { id: 201, name: "Open Heart Bangle", price: 2499.00, oldPrice: 2899.00, image: "/images/product-1.jpg" },
  { id: 202, name: "Crystal Birthstone Eternity Circle Charm", price: 2499.00, oldPrice: 2899.00, image: "/images/product-2.jpg" },
  { id: 203, name: "Ball Bracelet", price: 2499.00, oldPrice: 2899.00, image: "/images/product-3.jpg" },
  { id: 204, name: "Engagement Ring in 18k Yellow Gold", price: 2499.00, oldPrice: 2899.00, image: "/images/product-4.jpg" },
];

export default function ProductPage() {
  const params = useParams();
  const id = Number(params.id); 
  const product = allProducts.find(p => p.id === id) || allProducts[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(product.materials?.[0]?.name);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [activeSections, setActiveSections] = useState<string[]>([]);
  const [userRating, setUserRating] = useState(0);

  const toggleSection = (section: string) => {
    setActiveSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const toggleExtra = (id: number) => {
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const extrasTotal = selectedExtras.reduce((sum, id) => {
    const item = frequentItems.find(i => i.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isModalOpen]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <main className="bg-white text-[#1A1A1A]">
      <Navbar />

      <div className="pt-[120px] md:pt-[160px] pb-16 md:pb-24 px-4 sm:px-6">
        
        {/* --- BREADCRUMB --- */}
        <div className="max-w-[1500px] mx-auto mb-8 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#888] flex items-center gap-2">
          <Link href="/" className="hover:text-black transition-colors">Home</Link> 
          <ChevronRight size={10} />
          <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-black truncate">{product.name}</span>
        </div>

        {/* --- MAIN LAYOUT --- */}
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* ================= LEFT COLUMN: IMAGES ================= */}
          <div className="w-full flex flex-col gap-4">
            <div 
              className="w-full aspect-square bg-[#F9F9F9] relative rounded-sm overflow-hidden border border-transparent hover:border-[#E5E5E5] transition-colors group cursor-zoom-in"
              onClick={() => setIsModalOpen(true)}
            >
              <img 
                src={product.images[currentImageIndex] || product.images[0]} 
                alt="Product View" 
                className="w-full h-full object-contain p-8 md:p-16 mix-blend-multiply transition-transform duration-700 group-hover:scale-105" 
              />
              {product.oldPrice && (
                <span className="absolute top-4 left-4 bg-[#B87E58] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
                  Sale
                </span>
              )}
            </div>
            
            <div className="w-full grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setCurrentImageIndex(i)}
                  className={`aspect-square bg-[#F9F9F9] cursor-pointer border rounded-sm transition-all overflow-hidden ${currentImageIndex === i ? "border-[#B87E58] ring-1 ring-[#B87E58]/20" : "border-transparent hover:border-[#E5E5E5]"}`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-contain p-2 mix-blend-multiply" />
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: DETAILS ================= */}
          <div className="w-full relative h-full">
            <div className="md:sticky md:top-[160px] pt-2">
            
              <div className="flex items-center gap-1 mb-4">
                <div className="flex text-[#1A1A1A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} strokeWidth={0} className={i < Math.floor(product.rating) ? "text-black" : "text-gray-300"} />
                  ))}
                </div>
                <span className="text-xs text-[#888] ml-2">({product.reviews} reviews)</span>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl mb-4 text-[#1A1A1A] leading-tight">{product.name}</h1>

              <div className="flex items-center gap-3 mb-8 border-b border-[#E5E5E5] pb-8">
                <span className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">${product.price.toFixed(2)}</span>
                {product.oldPrice && <span className="text-[#888] line-through text-lg md:text-xl">${product.oldPrice.toFixed(2)}</span>}
              </div>

              <p className="text-[#555] text-sm leading-relaxed mb-8 max-w-lg">
                {product.shortDesc}
              </p>

              <div className="mb-10">
                <p className="text-xs font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse"></span> 
                  Only <span className="text-[#B87E58]">{product.stock} items</span> left!
                </p>
                <div className="w-full h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4CAF50] w-[35%] rounded-full transition-all duration-1000"></div>
                </div>
              </div>

              {/* Selectors */}
              <div className="space-y-8 mb-10 bg-white">
                {product.materials && (
                  <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#E5E5E5]">
                    <span className="text-sm font-bold text-[#1A1A1A]">Material: <span className="font-normal text-[#555] ml-1">{selectedMaterial}</span></span>
                    <div className="flex gap-3">
                      {product.materials.map((mat) => (
                        <button key={mat.name} onClick={() => setSelectedMaterial(mat.name)} className={`w-9 h-9 rounded-full border relative flex items-center justify-center transition-transform hover:scale-110 ${selectedMaterial === mat.name ? "ring-1 ring-offset-2 ring-[#1A1A1A] border-transparent" : "border-transparent"}`} style={{ background: `linear-gradient(135deg, ${mat.color} 50%, #ffffff 100%)` }} title={mat.name} />
                      ))}
                    </div>
                  </div>
                )}
                {product.sizes && (
                  <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#E5E5E5]">
                    <span className="text-sm font-bold text-[#1A1A1A]">Size: <span className="font-normal text-[#555] ml-1">{selectedSize}</span></span>
                    <div className="flex gap-2">
                      {product.sizes.map((size) => (
                        <button key={size} onClick={() => setSelectedSize(size)} className={`w-11 h-11 flex items-center justify-center text-xs font-bold transition-all ${selectedSize === size ? "bg-[#1A1A1A] text-white shadow-md" : "bg-white text-[#1A1A1A] hover:bg-[#F5F5F5]"}`}>{size}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Main Buttons */}
              <div className="flex gap-3 h-14 mb-4">
                <button className="flex-1 bg-[#B87E58] text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#A66D4A] transition-colors shadow-sm flex items-center justify-center gap-2">
                  ADD TO BAG — ${(product.price * quantity).toFixed(2)}
                </button>
                <button className="w-14 border border-[#E5E5E5] flex items-center justify-center hover:border-[#1A1A1A] transition-colors bg-white group">
                  <Heart size={20} strokeWidth={1.5} className="text-[#555] group-hover:text-black transition-colors"/>
                </button>
                <button className="w-14 border border-[#E5E5E5] flex items-center justify-center hover:border-[#1A1A1A] transition-colors bg-white group">
                  <ArrowRightLeft size={20} strokeWidth={1.5} className="text-[#555] group-hover:text-black transition-colors"/>
                </button>
              </div>

              <button className="w-full bg-white border border-[#1A1A1A] text-[#1A1A1A] h-14 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#1A1A1A] hover:text-white transition-colors mb-10">
                BUY IT NOW
              </button>

              {/* Socials */}
              <div className="flex flex-wrap gap-4 pt-8 border-t border-[#E5E5E5] mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-[#888] mr-2 flex items-center">Share:</span>
                <button className="w-9 h-9 flex items-center justify-center border border-[#E5E5E5] rounded-full hover:border-[#1A1A1A] hover:text-[#1A1A1A] text-[#888] transition-colors"><Facebook size={14} /></button>
                <button className="w-9 h-9 flex items-center justify-center border border-[#E5E5E5] rounded-full hover:border-[#1A1A1A] hover:text-[#1A1A1A] text-[#888] transition-colors"><Instagram size={14} /></button>
                <button className="w-9 h-9 flex items-center justify-center border border-[#E5E5E5] rounded-full hover:border-[#1A1A1A] hover:text-[#1A1A1A] text-[#888] transition-colors"><Twitter size={14} /></button>
              </div>

              {/* Frequently Bought Together */}
              <div className="mt-12">
                <h3 className="font-sans text-sm font-bold uppercase tracking-widest mb-6 text-[#1A1A1A]">Frequently Bought Together</h3>
                <div className="bg-[#E9EFE3] p-6 rounded-sm">
                  <div className="space-y-6 mb-8">
                    {frequentItems.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="pt-2">
                          <button 
                            onClick={() => toggleExtra(item.id)}
                            className={`w-5 h-5 border border-black flex items-center justify-center transition-colors ${selectedExtras.includes(item.id) ? "bg-black text-white" : "bg-transparent"}`}
                          >
                            {selectedExtras.includes(item.id) && <Check size={12} strokeWidth={3} />}
                          </button>
                        </div>
                        <div className="w-16 h-16 bg-white shrink-0 p-2">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply"/>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-[#1A1A1A] leading-tight mb-1 hover:text-[#B87E58] cursor-pointer transition-colors line-clamp-2">{item.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#1A1A1A]">${item.price.toLocaleString()}</span>
                            <span className="text-[10px] text-[#888] line-through">${item.oldPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-[#1A1A1A] text-white h-12 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#B87E58] transition-colors flex items-center justify-center gap-2">
                    ADD TO BAG — ${(extrasTotal).toLocaleString()}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- ACCORDIONS --- */}
        <div className="max-w-[1500px] mx-auto mt-20 border-t border-[#E5E5E5]">
          {/* Description */}
          <div className="border-b border-[#E5E5E5]">
            <button onClick={() => toggleSection('description')} className="w-full py-6 md:py-8 flex items-center justify-between group text-left transition-colors">
              <div className="flex items-center gap-4">
                <ArrowUpRight size={20} className={`transition-all duration-300 ${activeSections.includes('description') ? 'rotate-90 text-[#B87E58]' : 'text-[#1A1A1A] group-hover:text-[#B87E58]'}`} />
                <span className={`font-serif text-lg md:text-xl uppercase tracking-wide transition-colors duration-300 ${activeSections.includes('description') ? 'text-[#B87E58]' : 'text-[#1A1A1A] group-hover:text-[#B87E58]'}`}>Description</span>
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeSections.includes('description') ? 'max-h-[1000px] opacity-100 pb-10' : 'max-h-0 opacity-0'}`}>
              <div className="md:pl-9"><p className="text-[#555] text-sm leading-8 max-w-4xl">{product.description}</p></div>
            </div>
          </div>
          {/* Additional Info & Reviews (Simplified for brevity as they remain the same) */}
          <div className="border-b border-[#E5E5E5]">
             <button onClick={() => toggleSection('additional')} className="w-full py-6 md:py-8 flex items-center justify-between group text-left transition-colors">
              <div className="flex items-center gap-4"><ArrowUpRight size={20} className={`transition-all duration-300 ${activeSections.includes('additional') ? 'rotate-90 text-[#B87E58]' : 'text-[#1A1A1A] group-hover:text-[#B87E58]'}`} /><span className={`font-serif text-lg md:text-xl uppercase tracking-wide transition-colors duration-300 ${activeSections.includes('additional') ? 'text-[#B87E58]' : 'text-[#1A1A1A] group-hover:text-[#B87E58]'}`}>Additional Information</span></div>
            </button>
             <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeSections.includes('additional') ? 'max-h-[1000px] opacity-100 pb-10' : 'max-h-0 opacity-0'}`}>
              <div className="md:pl-9 max-w-4xl">
                 <div className="w-full border border-[#E5E5E5] text-sm">
                  {Object.entries(product.additionalInfo || {}).map(([key, value], index) => (
                    <div key={key} className={`flex ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                      <div className="w-1/3 p-4 font-bold text-[#1A1A1A] border-r border-[#E5E5E5]">{key}</div>
                      <div className="w-2/3 p-4 text-[#555]">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
           <div className="border-b border-[#E5E5E5]">
             <button onClick={() => toggleSection('reviews')} className="w-full py-6 md:py-8 flex items-center justify-between group text-left transition-colors">
              <div className="flex items-center gap-4"><ArrowUpRight size={20} className={`transition-all duration-300 ${activeSections.includes('reviews') ? 'rotate-90 text-[#B87E58]' : 'text-[#1A1A1A] group-hover:text-[#B87E58]'}`} /><span className={`font-serif text-lg md:text-xl uppercase tracking-wide transition-colors duration-300 ${activeSections.includes('reviews') ? 'text-[#B87E58]' : 'text-[#1A1A1A] group-hover:text-[#B87E58]'}`}>Reviews ({product.reviews})</span></div>
            </button>
             <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeSections.includes('reviews') ? 'max-h-[1500px] opacity-100 pb-10' : 'max-h-0 opacity-0'}`}>
              <div className="md:pl-9 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-4 mb-8"><div className="flex text-[#B87E58]">{[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < 5 ? "currentColor" : "none"} />)}</div><span className="font-bold">4.5/5.0</span></div>
                    <div className="mb-12">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-4 mb-2 text-xs font-bold"><div className="flex items-center w-8">{stars} <Star size={12} fill="currentColor" className="text-[#B87E58] ml-1" /></div><div className="flex-1 h-1 bg-[#E5E5E5] rounded-full overflow-hidden"><div className="h-full bg-[#B87E58]" style={{ width: stars === 5 ? '60%' : '0%' }}></div></div><div className="w-6 text-right">{stars === 5 ? 3 : 0}</div></div>
                      ))}
                    </div>
                    <button className="h-12 px-8 border border-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors mb-12">WRITE A REVIEW</button>
                    <div className="border-t border-[#E5E5E5] pt-8">
                       <h5 className="font-serif text-lg text-[#B87E58] uppercase tracking-wide mb-6">Write a Review</h5>
                       <div className="flex items-center gap-4 mb-6 text-sm font-bold"><span>Your rating *</span><div className="flex text-[#B87E58]">{[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < userRating ? "currentColor" : "none"} className="cursor-pointer" onClick={() => setUserRating(i + 1)}/>)}</div></div>
                       <div className="grid grid-cols-2 gap-4 mb-4"><input type="text" placeholder="Name *" className="w-full h-12 px-4 border border-[#E5E5E5] text-sm outline-none focus:border-[#B87E58] transition-colors" /><input type="email" placeholder="Email *" className="w-full h-12 px-4 border border-[#E5E5E5] text-sm outline-none focus:border-[#B87E58] transition-colors" /></div><textarea placeholder="Your review *" className="w-full h-32 p-4 border border-[#E5E5E5] text-sm outline-none focus:border-[#B87E58] transition-colors resize-none mb-4"></textarea><button className="h-12 px-8 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#B87E58] transition-colors">SUBMIT</button>
                    </div>
                  </div>
                  <div className="lg:col-span-7 lg:pl-8 lg:border-l lg:border-[#E5E5E5]">
                    <h5 className="font-serif text-lg text-[#B87E58] uppercase tracking-wide mb-8">{product.reviews} REVIEWS</h5>
                    <div className="space-y-8">
                      {product.reviewData && product.reviewData.length > 0 ? ( product.reviewData.map((review) => (<div key={review.id} className="flex items-start gap-6 border-b border-[#E5E5E5] pb-8 last:border-b-0 last:pb-0"><div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden shrink-0"><img src={`https://i.pravatar.cc/150?u=${review.id}`} alt={review.name} className="w-full h-full object-cover" /></div><div className="flex-1"><div className="flex items-center justify-between mb-2"><h5 className="font-bold text-sm">{review.name}</h5><span className="text-xs text-[#888]">{review.date}</span></div><div className="flex text-[#B87E58] mb-3">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}</div><p className="text-sm text-[#555] leading-relaxed">{review.text}</p></div></div>)) ) : (<p className="italic text-gray-400">No reviews yet.</p>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- YOU MAY ALSO LIKE SECTION --- */}
        <div className="max-w-[1500px] mx-auto mt-24 mb-16 pt-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-wide text-[#1A1A1A]">You May Also Like</h2>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 border border-[#E5E5E5] rounded-full flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all"><ArrowLeft size={16}/></button>
              <button className="w-10 h-10 border border-[#E5E5E5] rounded-full flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all"><ArrowRight size={16}/></button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                {/* Image Container with Hover Overlay */}
                <div className="relative aspect-square bg-[#F9F9F9] mb-4 overflow-hidden rounded-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Hover Icons (Slide in from Right) */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 ease-out">
                    <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors" title="Add to Wishlist"><Heart size={16} /></button>
                    <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors" title="Add to Cart"><ShoppingBag size={16} /></button>
                    <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors" title="Quick View"><Eye size={16} /></button>
                    <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors" title="Compare"><ArrowRightLeft size={16} /></button>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide mb-1 hover:text-[#B87E58] transition-colors">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A1A1A]">${item.price.toLocaleString()}</span>
                    <span className="text-xs text-[#888] line-through">${item.oldPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Recently viewed products SECTION --- */}
        <div className="max-w-[1500px] mx-auto mt-24 mb-16 pt-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-wide text-[#1A1A1A]">Recently Viewed Products</h2>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 border border-[#E5E5E5] rounded-full flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all"><ArrowLeft size={16}/></button>
              <button className="w-10 h-10 border border-[#E5E5E5] rounded-full flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all"><ArrowRight size={16}/></button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                {/* Image Container with Hover Overlay */}
                <div className="relative aspect-square bg-[#F9F9F9] mb-4 overflow-hidden rounded-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Hover Icons (Slide in from Right) */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 ease-out">
                    <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors" title="Add to Wishlist"><Heart size={16} /></button>
                    <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors" title="Add to Cart"><ShoppingBag size={16} /></button>
                    <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors" title="Quick View"><Eye size={16} /></button>
                    <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#B87E58] hover:text-white transition-colors" title="Compare"><ArrowRightLeft size={16} /></button>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide mb-1 hover:text-[#B87E58] transition-colors">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A1A1A]">${item.price.toLocaleString()}</span>
                    <span className="text-xs text-[#888] line-through">${item.oldPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"><X size={40} strokeWidth={1} /></button>
          <button onClick={prevImage} className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors p-4"><ChevronLeft size={60} strokeWidth={1} /></button>
          
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={product.images[currentImageIndex] || product.images[0]} alt="Preview" className="max-w-full max-h-[90vh] object-contain shadow-2xl" />
          </div>

          <button onClick={nextImage} className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors p-4"><ChevronRight size={60} strokeWidth={1} /></button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-widest font-medium">{currentImageIndex + 1} / {product.images.length}</div>
        </div>
      )}

      <Footer />
    </main>
  );
}