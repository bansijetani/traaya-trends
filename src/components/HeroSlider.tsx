"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from 'react';

// --- SLIDE DATA ---
const slides = [
  {
    id: 1,
    mainImage: "/images/banner.avif", 
    detailImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800",
    subtitle: "New Collection",
    titleLine1: "Timeless",
    titleLine2: "Elegance",
    description: "Discover a world where craftsmanship meets sophistication. Each piece is a distinct work of art.",
    buttonText: "Shop Collection",
    buttonLink: "/shop",
  },
  {
    id: 2,
    mainImage: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1600",
    detailImage: "https://images.unsplash.com/photo-1602293589930-457cc3a4cb37?q=80&w=800",
    subtitle: "Modern Opulence",
    titleLine1: "Crafted to",
    titleLine2: "Dazzle",
    description: "Explore our latest arrivals designed for the contemporary connoisseur. Bold statements await.",
    buttonText: "View New Arrivals",
    buttonLink: "/shop?category=new",
  },
  {
    id: 3,
    mainImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800",
    detailImage: "https://images.unsplash.com/photo-1599643477877-5313557d8302?q=80&w=800",
    subtitle: "Exquisite Artistry",
    titleLine1: "Pure",
    titleLine2: "Perfection",
    description: "Adorn yourself in pieces crafted with meticulous attention to detail and passion.",
    buttonText: "Discover More",
    buttonLink: "/about",
  },
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full h-[100dvh] bg-primary overflow-hidden font-sans">
      
      {/* Background Graphic */}
      <div className="absolute right-0 top-0 w-[40%] h-full bg-white/5 -skew-x-12 transform origin-top-right z-0 pointer-events-none hidden lg:block"></div>

      <Swiper
        spaceBetween={0}
        speed={1000}
        effect={'fade'}
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        className="h-full w-full z-10"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="h-full w-full">
            <div className="relative w-full h-full max-w-[1600px] mx-auto px-4 md:px-12 lg:px-24 flex flex-col lg:flex-row lg:items-center pt-20 lg:pt-0">
              
              {/* === TOP/LEFT PANEL: TEXT === */}
              <div className="w-full lg:w-1/2 z-20 flex flex-col justify-center h-[45%] lg:h-full">
                {/* 👇 UPDATE: Added 'flex-col items-center text-center' for mobile
                   and 'lg:items-start lg:text-left' for desktop
                */}
                <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 relative flex flex-col items-center lg:items-start text-center lg:text-left w-full px-2">
                    
                    {/* Decorative Line (Centers automatically due to items-center) */}
                    <div className="w-12 lg:w-16 h-1 bg-secondary mb-6 lg:mb-8 animate-in slide-in-from-left duration-1000 delay-100"></div>
                    
                    <span className="text-secondary text-xs lg:text-sm font-bold tracking-[0.3em] uppercase block mb-3 lg:mb-4">
                        {slide.subtitle}
                    </span>
                    
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-[5rem] xl:text-[6rem] leading-[1] mb-6 lg:mb-8 text-white drop-shadow-lg">
                        <span className="block font-bold">{slide.titleLine1}</span>
                        <span className="block font-serif italic font-light text-secondary">
                            {slide.titleLine2}
                        </span>
                    </h1>
                    
                    <p className="text-white/80 text-sm lg:text-lg max-w-lg mb-8 lg:mb-12 font-light leading-relaxed tracking-wide line-clamp-3 lg:line-clamp-none">
                        {slide.description}
                    </p>
                    
                    <Link 
                        href={slide.buttonLink} 
                        className="group relative inline-flex items-center justify-center px-8 py-4 lg:px-10 lg:py-5 bg-secondary text-white text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 hover:bg-white hover:text-primary shadow-lg w-fit"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {slide.buttonText}
                            <ArrowRight size={16} />
                        </span>
                    </Link>
                </div>
              </div>

              {/* === BOTTOM/RIGHT PANEL: IMAGES === */}
              <div className="w-full lg:w-1/2 h-[55%] lg:h-full relative flex items-center justify-center lg:justify-end z-10 pb-12 lg:pb-0">
                 <div className="relative w-full h-full lg:w-full lg:h-full flex items-center justify-center perspective-1000">
                    
                    {/* Hero Card */}
                    <div 
                        className="absolute w-[260px] h-[340px] md:w-[320px] md:h-[420px] lg:w-[450px] lg:h-[650px] bg-white p-2 lg:p-3 shadow-2xl rotate-[-2deg] z-10 animate-in fade-in zoom-in duration-[1.2s] ease-out"
                    >
                        <div className="relative w-full h-full overflow-hidden border border-gray-200">
                            <Image 
                                src={slide.mainImage} 
                                alt={slide.titleLine1} 
                                fill 
                                className="object-cover"
                                priority={slide.id === 1}
                            />
                        </div>
                    </div>

                    {/* Detail Card */}
                    <div 
                        className="absolute w-[140px] h-[140px] md:w-[180px] md:h-[180px] lg:w-[350px] lg:h-[350px] bg-white p-2 lg:p-3 shadow-2xl rotate-[3deg] z-20 animate-in slide-in-from-bottom-16 fade-in duration-[1.2s] delay-300 ease-out"
                        style={{ 
                            left: '50%', 
                            bottom: '15%', 
                            transform: 'translateX(-110%) rotate(3deg)' 
                        }}
                    >
                         <div className="relative w-full h-full overflow-hidden border border-gray-200">
                            <Image 
                                src={slide.detailImage} 
                                alt="Detail view" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                    </div>
                 </div>
              </div>

            </div>
          </SwiperSlide>
        ))}

        {/* === CONTROLS === */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-none">
            {slides.map((_, idx) => (
                <div 
                    key={idx}
                    className={`relative flex items-center justify-center transition-all duration-500 ${
                        activeIndex === idx ? 'w-6 h-6' : 'w-2 h-2'
                    }`}
                >
                    <div 
                        className={`absolute inset-0 rounded-full border border-white transition-all duration-500 ease-out ${
                            activeIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                        }`}
                    />
                    <div 
                        className={`rounded-full bg-white transition-all duration-500 ${
                            activeIndex === idx ? 'w-1.5 h-1.5' : 'w-1.5 h-1.5 opacity-50'
                        }`}
                    />
                </div>
            ))}
        </div>

      </Swiper>
    </section>
  );
}