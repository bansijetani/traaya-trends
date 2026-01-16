"use client";

import Navbar from "./components/Navbar";
import { ArrowRight, ShoppingBag, Eye, ArrowLeftRight, Heart, ChevronLeft, ChevronRight, ArrowDown, Facebook, Twitter, Instagram, Pin, Star, Package, CreditCard, RotateCcw, Headphones, ChevronUp, ChevronDown, Award, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRef, RefObject } from "react";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trendyScrollRef = useRef<HTMLDivElement>(null);
  const flashSaleRef = useRef<HTMLDivElement>(null);

  const scroll = (container: RefObject<HTMLDivElement | null> | null, direction: "left" | "right") => {
    if (container && container.current) {
      const scrollAmount = 400; 
      container.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const images = {
    leftWoman: "/images/img-item-1.jpg",
    rightHands: "/images/img-item-4.jpg",
    ringDetail: "/images/img-item-2.jpg",
    earringDetail: "/images/img-item-3.jpg",
    
    // Products
    prod1: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
    prod2: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop", 
    prod3: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=600&auto=format&fit=crop", 
    prod4: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=600&auto=format&fit=crop", 
    prod5: "https://images.unsplash.com/photo-1576060965319-869274382025?q=80&w=600&auto=format&fit=crop",
    
    // Trendy Collection Specific Images
    trendyRing1: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
    trendyRing2: "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?q=80&w=600&auto=format&fit=crop",
    trendyEarring: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
    trendyRing3: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=600&auto=format&fit=crop",

    // Categories
    catNewIn: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=400&auto=format&fit=crop",
    catBracelets: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop",
    catEarrings: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop",
    catRings: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop",
    catNecklaces: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=400&auto=format&fit=crop",
    
    // Inspired Style
    inspiredGift: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop", 
    inspiredNew: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop", 
    inspiredPers: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=400&auto=format&fit=crop", 
    inspiredBest: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop", 
    inspiredYou: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=400&auto=format&fit=crop", 
    inspiredWed: "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?q=80&w=400&auto=format&fit=crop",
    
    // Luxury Banner
    luxuryBanner: "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?q=80&w=1200&auto=format&fit=crop",

    // Blog
    blog1: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop", 
    blog2: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop", 
    blog3: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop", 
    
    // Newsletter & Payment
    newsletter: "https://images.unsplash.com/photo-1617038224531-16d69e880299?q=80&w=800&auto=format&fit=crop",
    paymentIcons: "https://i.imgur.com/7Z6Q2zD.png",
  };

  const freshFinds = [
    { id: 1, name: "Oval Yellow Diamond Ring", price: "$2,370.00", oldPrice: null, img: images.prod1 },
    { id: 2, name: "Rouje Lucia Dome Hoops", price: "$1,240.00", oldPrice: "$3,899.00", img: images.prod2 },
    { id: 3, name: "Sixteen Stone Earrings", price: "$1,990.00", oldPrice: "$3,899.00", img: images.prod3 },
    { id: 4, name: "Sparkling Moon & Star", price: "$2,990.00", oldPrice: "$3,899.00", img: images.prod4 },
    { id: 5, name: "Gold Vermeil Bracelet", price: "$850.00", oldPrice: null, img: images.prod5 },
  ];

  const categories = [
    { name: "NEW IN", img: images.catNewIn, link: "/shop/new-in" },
    { name: "BRACELETS", img: images.catBracelets, link: "/shop/bracelets" },
    { name: "EARRINGS", img: images.catEarrings, link: "/shop/earrings" },
    { name: "RINGS", img: images.catRings, link: "/shop/rings" },
    { name: "NECKLACES", img: images.catNecklaces, link: "/shop/necklaces" },
    { name: "GIFT IDEAS", img: "", link: "/shop/gifts", isGift: true },
  ];

  const bestSellers = [
    { 
      id: 1, 
      name: "Small Earrings In Gold with Diamond", 
      price: "$3,370.00", 
      oldPrice: "$3,899.00", 
      img: images.prod4,
      badge: "30% OFF",
      status: "Time's up!",
      statusColor: "text-red-500",
      bgStatus: "bg-white"
    },
    { 
      id: 2, 
      name: "Sixteen Stone Narrow Earrings", 
      price: "$2,499.00", 
      oldPrice: "$2,899.00", 
      img: images.prod2,
      badge: "30% OFF",
      status: "Selling fast ⚡ 30% OFF ⚡ Selling fast",
      statusColor: "text-white",
      bgStatus: "bg-[#A89160]"
    },
    { 
      id: 3, 
      name: "Sparkling Moon & Star Stud Earrings", 
      price: "$2,499.00", 
      oldPrice: null, 
      img: images.prod3,
      badge: null,
      status: "Notify Me When Available",
      statusColor: "text-white",
      bgStatus: "bg-[#1A1A1A]"
    },
    { 
      id: 4, 
      name: "Emerald-cut Halo Engagement Ring", 
      price: "$3,370.00", 
      oldPrice: "$3,899.00", 
      img: images.prod1,
      badge: "NEW IN",
      badgeColor: "bg-[#8B5E3C]",
      status: "3 sizes are available",
      statusColor: "text-[#555]",
      bgStatus: "bg-[#E5E5E5]"
    },
    { 
      id: 5, 
      name: "Gold Vermeil Bracelet", 
      price: "$850.00", 
      oldPrice: null, 
      img: images.prod5,
      badge: null,
      status: "Low Stock",
      statusColor: "text-[#555]",
      bgStatus: "bg-white"
    },
  ];

  const inspiredStyleLinks = [
    { name: "GIFT UNDER $200", img: images.inspiredGift, link: "/shop/gifts-under-200" },
    { name: "NEW IN", img: images.inspiredNew, link: "/shop/new-in" },
    { name: "PERSONALISED", img: images.inspiredPers, link: "/shop/personalised" },
    { name: "BEST SELLERS", img: images.inspiredBest, link: "/shop/best-sellers" },
    { name: "JUST FOR YOU", img: images.inspiredYou, link: "/shop/just-for-you" },
    { name: "WEDDING", img: images.inspiredWed, link: "/shop/wedding" },
  ];

  const trendyCollection = [
    { 
      id: 1, 
      name: "Dança Ring", 
      price: "$2,499.00", 
      oldPrice: "$2,899.00", 
      img: images.trendyRing1, 
      badge: "30% OFF", 
      badgeColor: "bg-[#A89160]"
    },
    { 
      id: 2, 
      name: "Engagement Ring in 18k Yellow Gold", 
      price: "$3,370.00", 
      oldPrice: null, 
      img: images.trendyRing2, 
      badge: "NEW IN", 
      badgeColor: "bg-[#8B5E3C]"
    },
    { 
      id: 3, 
      name: "Teardrop Earrings", 
      price: "$2,499.00", 
      oldPrice: "$2,899.00", 
      img: images.trendyEarring, 
      badge: "30% OFF", 
      badgeColor: "bg-[#A89160]"
    },
    { 
      id: 4, 
      name: "White Sapphire Ring in 10K White Gold", 
      price: "$3,370.00", 
      oldPrice: "$3,899.00", 
      img: images.trendyRing3, 
      badge: "NEW IN", 
      badgeColor: "bg-[#8B5E3C]" 
    },
    { 
      id: 5, 
      name: "Emerald Cut Diamond Ring", 
      price: "$4,100.00", 
      oldPrice: null, 
      img: images.prod4, 
      badge: null, 
      badgeColor: "" 
    }
  ];

  const flashSaleItems = [...trendyCollection];

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

  const footerLinks = {
    explore: [
      { name: "Bracelets", link: "/shop/bracelets" },
      { name: "Rings", link: "/shop/rings" },
      { name: "Necklaces", link: "/shop/necklaces" },
      { name: "Earrings", link: "/shop/earrings" },
      { name: "Gifts", link: "/shop/gifts" },
      { name: "Collections", link: "/collections" },
    ],
    help: [
      { name: "FAQs", link: "/faqs" },
      { name: "Terms & Conditions", link: "/terms" },
      { name: "Privacy Policies", link: "/privacy" },
      { name: "Returns & Refunds", link: "/returns" },
      { name: "Shipping", link: "/shipping" },
    ]
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] overflow-x-hidden pt-[120px] md:pt-[140px]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-20 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative mb-20">
          <div className="hidden lg:block lg:col-span-3 relative z-10">
            <div className="relative aspect-[3/5] w-full overflow-hidden">
              <img src={images.leftWoman} alt="Woman" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          <div className="lg:col-span-6 text-center z-20 px-4">
            <span className="block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-[#555]">Trending</span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-[5.5rem] leading-[1.1] mb-6">
              UNVEIL YOUR <br /> <span className="italic font-normal">Signature</span> LOOK
            </h1>
            <p className="text-sm md:text-base text-[#555] max-w-lg mx-auto leading-relaxed mb-10 font-sans">
              Explore our stunning collection of handcrafted jewelry that blends timeless elegance with modern style.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
              <button className="w-full sm:w-auto group border border-[#1A1A1A] px-10 py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                Shop Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="text-[11px] uppercase tracking-widest font-bold border-b border-transparent hover:border-[#1A1A1A] pb-1 transition-all">Explore More</button>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-3 relative z-10 pt-20">
            <div className="relative aspect-[3/5] w-full overflow-hidden">
              <img src={images.rightHands} alt="Hands" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* --- OUR STORY SECTION (UPDATED) --- */}
      <section className="py-24 bg-white text-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-16">
            
            {/* Left: Circle Logo */}
            <div className="shrink-0">
              <div className="w-48 h-48 rounded-full border border-[#A89160] flex flex-col items-center justify-center text-center p-4">
                <span className="font-serif text-3xl text-[#A89160] leading-none mb-1">TYAARA</span>
                <span className="font-serif text-xl text-[#A89160] leading-none italic">Trends</span>
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <p className="font-serif text-2xl md:text-3xl leading-relaxed text-[#1A1A1A]">
                We believe jewelry is more than an accessory—it’s a story of individuality and style. Our curated collection blends timeless craftsmanship with modern design, creating pieces that empower you to express your <span className="text-[#1A1A1A]/30">unique elegance every day.</span>
              </p>
              
              <Link href="/about" className="inline-flex items-center gap-2 text-[#A89160] font-bold text-xs tracking-widest uppercase mt-8 hover:opacity-80">
                Our Story <ArrowRight size={14} />
              </Link>
            </div>

          </div>

          {/* Bottom Border Line */}
          <div className="w-full h-px bg-[#A89160]"></div>

        </div>
      </section>

      {/* --- FRESH FINDS SECTION --- */}
      <section className="bg-[#111111] text-white py-24 overflow-hidden w-full">
        <div className="flex flex-col lg:flex-row gap-0 w-full">
          <div className="w-full lg:w-[120px] flex items-center justify-center lg:py-10">
             <h2 className="text-4xl md:text-5xl font-serif text-white tracking-widest whitespace-nowrap lg:[writing-mode:vertical-rl] lg:rotate-180">
               Fresh Finds, Just In
             </h2>
          </div>
          <div className="flex-1 w-full overflow-x-auto pb-8 scrollbar-hide">
            <div className="flex gap-1 pr-0 pl-6 lg:pl-0"> 
              {freshFinds.map((product) => (
                <div key={product.id} className="min-w-[300px] md:min-w-[380px] group cursor-pointer">
                  <div className="relative bg-white aspect-square w-full overflow-hidden">
                    <img src={product.img} alt={product.name} className="w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                       <button className="bg-white text-[#111] p-3 shadow-sm hover:bg-[#8B7E58] hover:text-white transition-colors"><ShoppingBag size={18} /></button>
                       <button className="bg-white text-[#111] p-3 shadow-sm hover:bg-[#8B7E58] hover:text-white transition-colors"><Eye size={18} /></button>
                       <button className="bg-white text-[#111] p-3 shadow-sm hover:bg-[#8B7E58] hover:text-white transition-colors"><ArrowLeftRight size={18} /></button>
                    </div>
                  </div>
                  <div className="pt-5 pb-2 px-1 space-y-2">
                    <h3 className="font-serif text-lg text-white group-hover:text-[#8B7E58] transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-3 text-sm font-medium">
                      {product.oldPrice && <span className="text-[#666] line-through decoration-[#666]">{product.oldPrice}</span>}
                      <span className={product.oldPrice ? "text-[#D85C5C]" : "text-white"}>{product.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- OUR CATEGORIES SECTION --- */}
      <section className="py-24 bg-white text-[#1A1A1A]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6">OUR CATEGORIES</h2>
          <p className="text-[#555] max-w-2xl mx-auto mb-16 font-sans">
            Explore our collection of sophisticated, modern designs.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
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

      {/* --- BEST SELLERS SECTION --- */}
      <section className="py-24 bg-[#4b3e35] text-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
             <h2 className="font-serif text-4xl md:text-5xl">
               SHOP OUR BEST <span className="italic font-light">SELLERS</span>
             </h2>
             <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-base">
               Discover the pieces our customers adore — from timeless everyday jewelry to bold statement designs that shine.
             </p>
          </div>
          <div className="relative">
            <button onClick={() => scroll(scrollContainerRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white text-[#4b3e35] p-3 rounded-full shadow-lg hover:scale-110 transition-transform hidden md:block"><ChevronLeft size={24} /></button>
            <button onClick={() => scroll(scrollContainerRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white text-[#4b3e35] p-3 rounded-full shadow-lg hover:scale-110 transition-transform hidden md:block"><ChevronRight size={24} /></button>

            <div ref={scrollContainerRef} className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
              {bestSellers.map((item) => (
                <div key={item.id} className="min-w-[280px] md:min-w-[350px] snap-center group relative">
                   <div className="bg-white relative aspect-square overflow-hidden mb-5">
                      {item.badge && <span className={`absolute top-4 left-4 text-[10px] font-bold tracking-widest text-white px-3 py-1 z-10 ${item.badge === 'NEW IN' ? 'bg-[#A0522D]' : 'bg-[#A89160]'}`}>{item.badge}</span>}
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <button className="bg-white text-[#1A1A1A] p-2.5 hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><Heart size={16} /></button>
                        <button className="bg-white text-[#1A1A1A] p-2.5 hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><ShoppingBag size={16} /></button>
                        <button className="bg-white text-[#1A1A1A] p-2.5 hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><Eye size={16} /></button>
                        <button className="bg-white text-[#1A1A1A] p-2.5 hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><ArrowLeftRight size={16} /></button>
                      </div>
                      {item.status && <div className={`absolute bottom-0 left-0 w-full py-2 text-center text-[10px] font-bold uppercase tracking-widest ${item.bgStatus} ${item.statusColor}`}>{item.status}</div>}
                   </div>
                   <div>
                     <h3 className="font-serif text-lg mb-1">{item.name}</h3>
                     <div className="flex gap-3 text-sm font-medium">
                        <span className="text-[#D85C5C]">{item.price}</span>
                        {item.oldPrice && <span className="text-white/50 line-through">{item.oldPrice}</span>}
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- TRENDY COLLECTION SECTION --- */}
      <section className="py-24 bg-white text-[#1A1A1A] overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
             <h2 className="font-serif text-4xl md:text-5xl">
               <span className="italic">TRENDY</span> COLLECTION
             </h2>
             <p className="text-[#555] max-w-2xl mx-auto text-sm md:text-base font-sans">
               Discover the pieces our customers love most — from everyday essentials to statement styles that stand out.
             </p>
          </div>
          <div className="relative">
            <button onClick={() => scroll(trendyScrollRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white text-[#1A1A1A] p-3 rounded-full shadow-lg hover:scale-110 transition-transform hidden md:block border border-gray-100"><ChevronLeft size={24} /></button>
            <button onClick={() => scroll(trendyScrollRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white text-[#1A1A1A] p-3 rounded-full shadow-lg hover:scale-110 transition-transform hidden md:block border border-gray-100"><ChevronRight size={24} /></button>

            <div ref={trendyScrollRef} className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
              {trendyCollection.map((item) => (
                <div key={item.id} className="min-w-[280px] md:min-w-[350px] snap-center group relative">
                   <div className="bg-[#F9F9F9] relative aspect-square overflow-hidden mb-5">
                      {item.badge && <span className={`absolute top-4 left-4 text-[10px] font-bold tracking-widest text-white px-3 py-1 z-10 ${item.badgeColor}`}>{item.badge}</span>}
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover p-8 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" />
                      <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <button className="bg-white text-[#1A1A1A] p-2.5 hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><Heart size={16} /></button>
                        <button className="bg-white text-[#1A1A1A] p-2.5 hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><ShoppingBag size={16} /></button>
                        <button className="bg-white text-[#1A1A1A] p-2.5 hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><Eye size={16} /></button>
                        <button className="bg-white text-[#1A1A1A] p-2.5 hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><ArrowLeftRight size={16} /></button>
                      </div>
                   </div>
                   <div>
                     <h3 className="font-serif text-lg mb-1">{item.name}</h3>
                     <div className="flex gap-3 text-sm font-medium">
                        <span className={item.oldPrice ? "text-[#D85C5C]" : "text-[#1A1A1A]"}>{item.price}</span>
                        {item.oldPrice && <span className="text-[#999] line-through">{item.oldPrice}</span>}
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PURE LUXURY BANNER SECTION --- */}
      <section className="w-full bg-[#4b3e35]">
        <div className="flex flex-col md:flex-row h-auto min-h-[600px]">
          <div className="w-full md:w-1/2 h-[500px] md:h-auto relative">
            <img 
              src={images.luxuryBanner} 
              alt="Woman wearing luxury jewelry" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-12 md:p-24 text-white">
            <span className="text-[#A89160] text-xs font-bold tracking-widest uppercase mb-4 block">Limited Edition</span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">Pure Luxury</h2>
            <p className="text-white/80 text-lg leading-relaxed mb-12 max-w-xl">
              Discover the finest craftsmanship in our exclusive collection. Each piece tells a story of elegance and timeless beauty, designed for those who appreciate the extraordinary.
            </p>
            <Link href="/shop/limited-edition" className="flex items-center gap-2 text-white uppercase tracking-[0.2em] text-xs font-bold border-b-2 border-[#A89160] pb-2 hover:text-[#A89160] transition-colors">
              View Collection <ArrowDown size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FLASH SALE SECTION --- */}
      <section className="py-24 bg-white text-[#1A1A1A] overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
             <h2 className="font-serif text-4xl md:text-5xl">
               <span className="italic">Flash</span> Sale
             </h2>
             <span className="text-xs uppercase tracking-widest font-bold">Time's up!</span>
          </div>
          <div className="relative group/slider">
            <button onClick={() => scroll(flashSaleRef, "left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white text-[#1A1A1A] p-3 rounded-full shadow-lg hover:scale-110 transition-transform hidden md:group-hover/slider:block border border-gray-100"><ChevronLeft size={24} /></button>
            <button onClick={() => scroll(flashSaleRef, "right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white text-[#1A1A1A] p-3 rounded-full shadow-lg hover:scale-110 transition-transform hidden md:group-hover/slider:block border border-gray-100"><ChevronRight size={24} /></button>

            <div ref={flashSaleRef} className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory">
              {flashSaleItems.map((item) => (
                <div key={item.id} className="min-w-[280px] md:min-w-[350px] snap-center group relative">
                   <div className="bg-[#F9F9F9] relative aspect-square overflow-hidden mb-5">
                      {item.badge && <span className={`absolute top-4 left-4 text-[10px] font-bold tracking-widest text-white px-3 py-1 z-10 ${item.badgeColor}`}>{item.badge}</span>}
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover p-8 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" />
                      <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <button className="bg-white text-[#1A1A1A] p-2.5 hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><Heart size={16} /></button>
                        <button className="bg-white text-[#1A1A1A] p-2.5 hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><ShoppingBag size={16} /></button>
                        <button className="bg-white text-[#1A1A1A] p-2.5 hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><Eye size={16} /></button>
                        <button className="bg-white text-[#1A1A1A] p-2.5 hover:bg-[#A89160] hover:text-white transition-colors shadow-sm"><ArrowLeftRight size={16} /></button>
                      </div>
                   </div>
                   <div className="space-y-1">
                     <div className="flex gap-0.5 mb-2">
                       {[...Array(5)].map((_, i) => (<Star key={i} size={12} fill="#1A1A1A" className="text-[#1A1A1A]" />))}
                     </div>
                     <h3 className="font-serif text-lg">{item.name}</h3>
                     <div className="flex gap-3 text-sm font-medium">
                        <span className="text-[#D85C5C]">{item.price}</span>
                        {item.oldPrice && <span className="text-[#999] line-through">{item.oldPrice}</span>}
                     </div>
                   </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
               <button className="w-2 h-2 rounded-full bg-[#1A1A1A]"></button>
               <button className="w-2 h-2 rounded-full bg-[#E5E5E5] hover:bg-[#A89160] transition-colors"></button>
            </div>
          </div>
        </div>
      </section>

      {/* --- LATEST NEWS UPDATE SECTION --- */}
      <section className="py-24 bg-white text-[#1A1A1A]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4"><span className="italic">Our Latest</span> News Update</h2>
            <p className="text-[#555] max-w-xl mx-auto text-sm md:text-base">
              Explore our journey, values, and the stories behind our collections. Discover what makes our brand unique.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-6 aspect-[4/3] md:aspect-[3/2.5]">
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className="bg-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 text-[#1A1A1A]">{post.tag}</span>
                    <span className="bg-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 text-[#1A1A1A]">{post.dateBadge}</span>
                  </div>
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="pr-4">
                  <h3 className="font-serif text-xl md:text-2xl leading-tight mb-3 group-hover:text-[#A89160] transition-colors">{post.title}</h3>
                  <p className="text-[11px] text-[#888] mb-4 font-medium uppercase tracking-wide">{post.meta}</p>
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest border-b border-transparent group-hover:border-[#1A1A1A] w-fit pb-0.5 transition-all">
                    Read More <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICE FEATURES SECTION --- */}
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

      {/* --- NEWSLETTER SECTION (NEW) --- */}
      <section className="w-full flex flex-col md:flex-row h-auto md:h-[500px]">
        <div className="w-full md:w-1/2 relative h-[400px] md:h-full">
          <img src={images.newsletter} alt="Newsletter" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 bg-[#FAF6F2] p-12 md:p-24 flex flex-col justify-center">
          <span className="text-[#1A1A1A] text-xs font-bold uppercase tracking-widest mb-4">Join the #Vemus Tribe</span>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">Shiny Things Await -<br/>10% Off Inside!</h2>
          <p className="text-[#555] text-sm mb-8 font-sans max-w-md">Get early access to new products, exclusive deals & more.</p>
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

      {/* --- FOOTER SECTION (NEW) --- */}
      <footer className="bg-[#4b3e35] text-white pt-24 pb-12 relative overflow-hidden">
        {/* Watermark Background */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden leading-none">
           <span className="text-[150px] md:text-[280px] font-serif text-white opacity-5 whitespace-nowrap block translate-y-[30%]">VEMUS</span>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            {/* Column 1: Brand (4 cols) */}
            <div className="md:col-span-4">
              <h2 className="font-serif text-4xl italic mb-6">Vemus</h2>
              <p className="text-white/80 mb-8 font-sans text-sm leading-relaxed max-w-sm">
                Explore our curated collections designed to elevate every look, from timeless essentials to trendsetting pieces. Step in and find the perfect match for your unique style.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#4b3e35] transition-all"><Facebook size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#4b3e35] transition-all"><Instagram size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#4b3e35] transition-all"><Twitter size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#4b3e35] transition-all"><Pin size={16} /></a>
              </div>
            </div>

            {/* Links Columns (2 cols each) */}
            <div className="md:col-span-2">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Explore</h4>
              <ul className="space-y-4">
                {footerLinks.explore.map((link, i) => (
                  <li key={i}><Link href={link.link} className="text-white/70 hover:text-white transition-colors text-sm">{link.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Help</h4>
              <ul className="space-y-4">
                {footerLinks.help.map((link, i) => (
                  <li key={i}><Link href={link.link} className="text-white/70 hover:text-white transition-colors text-sm">{link.name}</Link></li>
                ))}
              </ul>
            </div>

            {/* Store Info (4 cols) */}
            <div className="md:col-span-4">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Store Information</h4>
              <div className="space-y-4 text-sm text-white/80 font-sans">
                <p><span className="text-white font-medium block mb-1">Email:</span> clientcare@vemus.com</p>
                <p><span className="text-white font-medium block mb-1">Phone:</span> 1.888.838.3022</p>
                <p><span className="text-white font-medium block mb-1">Address:</span> 123 Yarran st, Punchbowl, NSW 2196, Australia</p>
                <a href="#" className="inline-block border-b border-white pb-0.5 hover:text-white/70 transition-colors mt-2">Get direction →</a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/60 text-xs">All Rights Reserved 2025 VEMUS.</p>
            
            <div className="flex items-center gap-6">
               {/* Currency Selector (Mock) */}
               <button className="flex items-center gap-2 text-xs text-white/80 border border-white/20 px-3 py-2 rounded hover:bg-white/5 transition-colors">
                 United States (USD $) <ChevronDown size={12} />
               </button>
               
               {/* Payment Icons */}
               <img src={images.paymentIcons} alt="Payment Methods" className="h-5 opacity-80" />
            </div>
          </div>

        </div>

        {/* Scroll To Top Button */}
        <button 
          onClick={scrollToTop}
          className="absolute bottom-8 right-8 w-10 h-10 bg-white text-[#4b3e35] flex items-center justify-center shadow-lg hover:bg-[#A89160] hover:text-white transition-all z-20"
        >
          <ChevronUp size={20} />
        </button>
      </footer>

    </main>
  );
}