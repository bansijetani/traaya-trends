"use client";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { 
  ArrowRight, ShoppingBag, Eye, ArrowLeftRight, Heart, ChevronLeft, ChevronRight, 
  ArrowDown, Star, Package, CreditCard, RotateCcw, Headphones 
} from "lucide-react";
import Link from "next/link";
import { useRef, RefObject, useEffect, useState } from "react";
import { client } from "@/sanity/lib/client"; // Sanity Client
import { urlFor } from "@/sanity/lib/image";   // Image Helper

// --- TYPES ---
interface SanityProduct {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  slug: { current: string };
  image: any;
  category: string;
  createdAt: string;
}

interface UIProduct {
  id: string;
  name: string;
  price: string;
  oldPrice: string | null;
  img: string;
  slug: string;
  badge?: string | null;
  badgeColor?: string | null;
  status?: string | null;     // <--- Changed to allow null
  statusColor?: string | null;
  bgStatus?: string | null;
}

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trendyScrollRef = useRef<HTMLDivElement>(null);
  const flashSaleRef = useRef<HTMLDivElement>(null);

  // --- STATE FOR REAL DATA ---
  const [freshFinds, setFreshFinds] = useState<UIProduct[]>([]);
  const [bestSellers, setBestSellers] = useState<UIProduct[]>([]);
  const [trendyCollection, setTrendyCollection] = useState<UIProduct[]>([]);
  
  // --- FETCH DATA FROM SANITY ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch 20 newest products
        const query = `*[_type == "product"] | order(_createdAt desc)[0...20]{
          _id,
          name,
          price,
          oldPrice,
          slug,
          "image": images[0],
          category,
          _createdAt
        }`;

        const sanityData: SanityProduct[] = await client.fetch(query);

        // Helper to format currency
        const fmt = (num: number) => `$${num.toLocaleString()}`;

        // Map Sanity Data to your UI Structure
        const allProducts: UIProduct[] = sanityData.map((item) => ({
          id: item._id,
          name: item.name,
          price: fmt(item.price),
          oldPrice: item.oldPrice ? fmt(item.oldPrice) : null,
          img: item.image ? urlFor(item.image).url() : "/images/placeholder.jpg",
          slug: item.slug.current,
          // Add default UI flags for demo purposes
          badge: null, 
          status: null
        }));

        // Distribute data to sections (Simulating different collections)
        setFreshFinds(allProducts.slice(0, 5)); // First 5
        
        // Add badges to Best Sellers
        setBestSellers(allProducts.slice(5, 10).map((p, i) => ({
          ...p,
          badge: i === 0 ? "30% OFF" : (i === 3 ? "NEW IN" : null),
          badgeColor: i === 3 ? "bg-[#8B5E3C]" : "bg-[#A89160]",
        })));

        // Add badges to Trendy
        setTrendyCollection(allProducts.slice(0, 5).reverse().map((p, i) => ({
           ...p,
           badge: i === 1 ? "HOT" : null,
           badgeColor: "bg-red-500"
        })));

      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);


  const scroll = (container: RefObject<HTMLDivElement | null> | null, direction: "left" | "right") => {
    if (container && container.current) {
      const scrollAmount = 400; 
      container.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Static Images for Layout
  const images = {
    leftWoman: "/images/img-item-1.jpg", // Ensure these files exist in /public/images
    rightHands: "/images/img-item-4.jpg",
    ringDetail: "/images/img-item-2.jpg",
    earringDetail: "/images/img-item-3.jpg",
    
    // Category Images (Static or fetchable)
    catNewIn: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=400&auto=format&fit=crop",
    catBracelets: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop",
    catEarrings: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop",
    catRings: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop",
    catNecklaces: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=400&auto=format&fit=crop",
    
    luxuryBanner: "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?q=80&w=1200&auto=format&fit=crop",
    newsletter: "/images/banner-3.jpg", // Ensure exists
    
    // Blogs
    blog1: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop", 
    blog2: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop", 
    blog3: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop", 
  };

  const categories = [
    { name: "NEW IN", img: images.catNewIn, link: "/shop/new-in" },
    { name: "BRACELETS", img: images.catBracelets, link: "/shop/bracelets" },
    { name: "EARRINGS", img: images.catEarrings, link: "/shop/earrings" },
    { name: "RINGS", img: images.catRings, link: "/shop/rings" },
    { name: "NECKLACES", img: images.catNecklaces, link: "/shop/necklaces" },
    { name: "GIFT IDEAS", img: "", link: "/shop/gifts", isGift: true },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Timeless Elegance: How to Choose the Perfect Jewelry for Every Occasion",
      meta: "Nov 13, 2025 • Vincent P. • 3 Comments",
      tag: "JewelryTrends",
      dateBadge: "12 Feb 2025",
      img: images.blog1,
    },
    {
      id: 2,
      title: "The Art of Layering: Styling Necklaces, Bracelets & Rings Like a Pro",
      meta: "Nov 13, 2025 • Vincent P. • 3 Comments",
      tag: "JewelryTrends",
      dateBadge: "12 Feb 2025",
      img: images.blog2,
    },
    {
      id: 3,
      title: "Jewelry Care 101: Tips to Keep Your Pieces Sparkling Like New",
      meta: "Nov 13, 2025 • Vincent P. • 3 Comments",
      tag: "JewelryTrends",
      dateBadge: "12 Feb 2025",
      img: images.blog3,
    },
  ];

  const serviceFeatures = [
    { icon: <Package size={32} strokeWidth={1} />, title: "FREE SHIPPING", desc: "Enjoy free shipping on all orders" },
    { icon: <CreditCard size={32} strokeWidth={1} />, title: "SECURED PAYMENT", desc: "Secured payment" },
    { icon: <RotateCcw size={32} strokeWidth={1} />, title: "14 DAYS RETURN", desc: "Free return in 14 days" },
    { icon: <Headphones size={32} strokeWidth={1} />, title: "PREMIUM SUPPORT", desc: "Enjoy our support 24/7" },
  ];

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] overflow-x-hidden pt-[120px] md:pt-[140px]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full bg-[#FDFBF7] pt-[140px] pb-20 overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[600px]">
            {/* LEFT COLUMN */}
            <div className="hidden lg:flex lg:col-span-3 flex-col gap-24">
              <div className="w-[85%] aspect-[3/4] relative overflow-hidden">
                <img src={images.leftWoman} alt="Woman Face" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="w-[85%] aspect-[4/3] relative overflow-hidden ml-auto">
                <img src={images.ringDetail} alt="Ring Detail" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
              </div>
            </div>

            {/* CENTER COLUMN */}
            <div className="lg:col-span-6 text-center z-10 px-4">
              <span className="block text-[10px] font-bold uppercase tracking-[0.25em] mb-6 text-[#1A1A1A]">Trending</span>
              <h1 className="font-serif text-5xl md:text-7xl xl:text-[5.5rem] leading-[1.1] mb-8 text-[#1A1A1A]">
                UNVEIL YOUR <br /> <span className="italic font-light font-serif">Signature</span> LOOK
              </h1>
              <p className="text-sm text-[#555] max-w-lg mx-auto leading-relaxed mb-10 font-sans tracking-wide">
                Explore our stunning collection of handcrafted jewelry that blends timeless elegance with modern style.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/shop" className="border border-[#1A1A1A] px-12 py-4 text-[11px] uppercase tracking-[0.15em] font-bold hover:bg-[#1A1A1A] hover:text-white transition-all flex items-center gap-2 group">
                  Shop Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/about" className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#1A1A1A] hover:text-[#A89160] transition-colors py-4">Explore More</Link>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="hidden lg:flex lg:col-span-3 flex-col gap-24">
              <div className="w-[85%] aspect-[3/4] relative overflow-hidden ml-auto">
                <img src={images.rightHands} alt="Hand Jewelry" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="w-[70%] aspect-square relative overflow-hidden bg-[#F5F5F5] mr-auto">
                <img src={images.earringDetail} alt="Earrings" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 mix-blend-multiply p-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- OUR STORY SECTION --- */}
      <section className="py-24 bg-white text-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-16">
            <div className="shrink-0">
              <div className="w-48 h-48 rounded-full border border-[#A89160] flex flex-col items-center justify-center text-center p-4">
                <span className="font-serif text-3xl text-[#A89160] leading-none mb-1">TYAARA</span>
                <span className="font-serif text-xl text-[#A89160] leading-none italic">Trends</span>
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <p className="font-serif text-2xl md:text-3xl leading-relaxed text-[#1A1A1A]">
                We believe jewelry is more than an accessory—it’s a story of individuality and style.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-[#A89160] font-bold text-xs tracking-widest uppercase mt-8 hover:opacity-80">
                Our Story <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="w-full h-px bg-[#A89160]"></div>
        </div>
      </section>

      {/* --- FRESH FINDS SECTION (REAL DATA) --- */}
      <section className="bg-[#111111] text-white py-20 overflow-hidden w-full">
        <div className="flex flex-col lg:flex-row items-center gap-0 w-full max-w-[1920px] mx-auto">
          <div className="w-full lg:w-[120px] xl:w-[160px] flex items-center justify-center shrink-0 mb-12 lg:mb-0">
             <h2 className="text-4xl lg:text-5xl font-serif text-white tracking-widest whitespace-nowrap lg:-rotate-90 lg:origin-center">
               <span className="italic">Fresh Finds,</span> Just In
             </h2>
          </div>

          <div className="flex-1 w-full overflow-x-auto pb-8 scrollbar-hide">
            <div className="flex gap-5 pr-6 pl-6 lg:pl-0"> 
              {freshFinds.length === 0 && <p className="text-white ml-8">Loading products...</p>}
              {freshFinds.map((product) => (
                <Link href={`/product/${product.slug}`} key={product.id} className="min-w-[280px] md:min-w-[320px] group cursor-pointer block">
                  <div className="relative bg-white aspect-square w-full overflow-hidden mb-5">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-white mb-2 leading-relaxed tracking-wide truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-bold text-white tracking-wide">{product.price}</span>
                      {product.oldPrice && (
                        <span className="text-[#666] line-through text-xs font-light">{product.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- OUR CATEGORIES --- */}
      <section className="py-24 bg-white text-[#1A1A1A]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">OUR CATEGORIES</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 mt-12">
            {categories.map((category, index) => (
              <Link href={category.link} key={index} className="group flex flex-col items-center">
                <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 transition-transform duration-500 group-hover:scale-105 ${category.isGift ? 'bg-[#F5F5F5] flex items-center justify-center' : ''}`}>
                  {category.isGift ? (
                    <span className="font-serif text-xl md:text-2xl text-[#D85C5C]">Gift idea.</span>
                  ) : (
                    <img src={category.img || ""} alt={category.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="text-[11px] md:text-xs font-bold uppercase tracking-widest group-hover:text-[#8B7E58] transition-colors">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- BEST SELLERS (REAL DATA) --- */}
      <section className="py-24 bg-[#4b3e35] text-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
             <h2 className="font-serif text-4xl md:text-5xl">
               SHOP OUR BEST <span className="italic font-light">SELLERS</span>
             </h2>
          </div>
          <div className="relative">
            <button onClick={() => scroll(scrollContainerRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white text-[#4b3e35] p-3 rounded-full shadow-lg hidden md:block"><ChevronLeft size={24} /></button>
            <button onClick={() => scroll(scrollContainerRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white text-[#4b3e35] p-3 rounded-full shadow-lg hidden md:block"><ChevronRight size={24} /></button>

            <div ref={scrollContainerRef} className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
              {bestSellers.map((item) => (
                <div key={item.id} className="min-w-[280px] md:min-w-[350px] snap-center group relative">
                   <Link href={`/product/${item.slug}`}>
                    <div className="bg-white relative aspect-square overflow-hidden mb-5">
                        {item.badge && <span className={`absolute top-4 left-4 text-[10px] font-bold tracking-widest text-white px-3 py-1 z-10 ${item.badgeColor}`}>{item.badge}</span>}
                        <img src={item.img} alt={item.name} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" />
                    </div>
                    <div>
                        <h3 className="font-serif text-lg mb-1 truncate">{item.name}</h3>
                        <div className="flex gap-3 text-sm font-medium">
                            <span className="text-[#D85C5C]">{item.price}</span>
                            {item.oldPrice && <span className="text-white/50 line-through">{item.oldPrice}</span>}
                        </div>
                    </div>
                   </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- TRENDY COLLECTION (REAL DATA) --- */}
      <section className="py-24 bg-white text-[#1A1A1A] overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
             <h2 className="font-serif text-4xl md:text-5xl">
               <span className="italic">TRENDY</span> COLLECTION
             </h2>
          </div>
          <div className="relative">
            <button onClick={() => scroll(trendyScrollRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white text-[#1A1A1A] p-3 rounded-full shadow-lg hidden md:block border border-gray-100"><ChevronLeft size={24} /></button>
            <button onClick={() => scroll(trendyScrollRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white text-[#1A1A1A] p-3 rounded-full shadow-lg hidden md:block border border-gray-100"><ChevronRight size={24} /></button>

            <div ref={trendyScrollRef} className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
              {trendyCollection.map((item) => (
                <div key={item.id} className="min-w-[280px] md:min-w-[350px] snap-center group relative">
                   <Link href={`/product/${item.slug}`}>
                    <div className="bg-[#F9F9F9] relative aspect-square overflow-hidden mb-5">
                        {item.badge && <span className={`absolute top-4 left-4 text-[10px] font-bold tracking-widest text-white px-3 py-1 z-10 ${item.badgeColor}`}>{item.badge}</span>}
                        <img src={item.img} alt={item.name} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" />
                    </div>
                    <div>
                        <h3 className="font-serif text-lg mb-1 truncate">{item.name}</h3>
                        <div className="flex gap-3 text-sm font-medium">
                            <span className={item.oldPrice ? "text-[#D85C5C]" : "text-[#1A1A1A]"}>{item.price}</span>
                            {item.oldPrice && <span className="text-[#999] line-through">{item.oldPrice}</span>}
                        </div>
                    </div>
                   </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PURE LUXURY BANNER --- */}
      <section className="w-full bg-[#4b3e35]">
        <div className="flex flex-col md:flex-row h-auto min-h-[600px]">
          <div className="w-full md:w-1/2 h-[500px] md:h-auto relative">
            <img src={images.luxuryBanner} alt="Woman wearing luxury jewelry" className="w-full h-full object-cover" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-12 md:p-24 text-white">
            <span className="text-[#A89160] text-xs font-bold tracking-widest uppercase mb-4 block">Limited Edition</span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">Pure Luxury</h2>
            <Link href="/shop" className="flex items-center gap-2 text-white uppercase tracking-[0.2em] text-xs font-bold border-b-2 border-[#A89160] pb-2 hover:text-[#A89160] transition-colors">
              View Collection <ArrowDown size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FLASH SALE (USING TRENDY DATA FOR NOW) --- */}
      <section className="py-24 bg-white text-[#1A1A1A] overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
             <h2 className="font-serif text-4xl md:text-5xl"><span className="italic">Flash</span> Sale</h2>
             <span className="text-xs uppercase tracking-widest font-bold">Time's up!</span>
          </div>
          <div className="relative group/slider">
             <div ref={flashSaleRef} className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory">
              {trendyCollection.map((item) => (
                <div key={item.id} className="min-w-[280px] md:min-w-[350px] snap-center group relative">
                   <div className="bg-[#F9F9F9] relative aspect-square overflow-hidden mb-5">
                      <img src={item.img} alt={item.name} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" />
                   </div>
                   <div className="space-y-1">
                     <div className="flex gap-0.5 mb-2">
                       {[...Array(5)].map((_, i) => (<Star key={i} size={12} fill="#1A1A1A" className="text-[#1A1A1A]" />))}
                     </div>
                     <h3 className="font-serif text-lg truncate">{item.name}</h3>
                     <div className="flex gap-3 text-sm font-medium">
                        <span className="text-[#D85C5C]">{item.price}</span>
                        {item.oldPrice && <span className="text-[#999] line-through">{item.oldPrice}</span>}
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- LATEST NEWS UPDATE --- */}
      <section className="py-24 bg-white text-[#1A1A1A]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4"><span className="italic">Our Latest</span> News Update</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-6 aspect-[4/3] md:aspect-[3/2.5]">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="pr-4">
                  <h3 className="font-serif text-xl md:text-2xl leading-tight mb-3 group-hover:text-[#A89160] transition-colors">{post.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICE FEATURES --- */}
      <section className="py-24 bg-white text-[#1A1A1A] border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceFeatures.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-8 border border-[#E5E5E5] hover:border-[#A89160] transition-colors duration-300 group">
                <div className="text-[#A89160] mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-3">{feature.title}</h3>
                <p className="text-[#555] text-sm font-sans">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <section className="w-full flex flex-col md:flex-row h-auto md:h-[500px]">
        <div className="w-full md:w-1/2 relative h-[400px] md:h-full bn-image">
          <img src={images.newsletter} alt="Newsletter" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 bg-[#FAF6F2] p-12 md:p-24 flex flex-col justify-center">
          <span className="text-[#1A1A1A] text-xs font-bold uppercase tracking-widest mb-4">Join the #Vemus Tribe</span>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">Shiny Things Await -<br/>10% Off Inside!</h2>
          <div className="relative max-w-md">
            <input 
              type="email" 
              placeholder="Your_email@example.com" 
              className="bg-transparent border-b border-[#1A1A1A]/20 focus:border-[#A89160] outline-none w-full pb-3 pr-10 placeholder:text-[#1A1A1A]/40 text-sm font-sans transition-colors"
            />
            <button className="absolute right-0 bottom-3 text-[#1A1A1A] hover:text-[#A89160] transition-colors">
              <ArrowRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}