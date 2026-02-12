"use client";

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// CSS Imports
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

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
    // Use 100dvh for better mobile browser sizing
    <section className="relative w-full h-[100dvh] bg-primary overflow-hidden font-sans">
      
      {/* Desktop Background Graphic */}
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
            
            {/* LAYOUT CONTAINER */}
            <div className="relative w-full h-full flex lg:flex-row">
              
              {/* === 1. MOBILE IMAGE BACKGROUND (Absolute & Full Height on Mobile) === */}
              <div className="absolute inset-0 w-full h-full lg:hidden z-0">
                  <Image 
                      src={slide.mainImage} 
                      alt={slide.titleLine1} 
                      fill 
                      className="object-cover"
                      priority={index === 0}
                  />
                  {/* Stronger Overlays for Text Readability on Mobile */}
                  <div className="absolute inset-0 bg-black/40" /> {/* Overall dim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" /> {/* Bottom fade */}
              </div>

              {/* === 2. TEXT CONTENT (Overlay on Mobile, Left Split on Desktop) === */}
              {/* Mobile Changes:
                  - Changed from static flex item to absolute inset-0.
                  - Changed bg-primary to bg-transparent.
                  - Added z-20 to sit on top of image.
                  Desktop Changes (lg:):
                  - Reverts to static position.
                  - Reverts to bg-primary.
              */}
              <div className="absolute inset-0 lg:static w-full h-full lg:w-1/2 z-20 flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-6 md:px-12 lg:pl-24 lg:pr-12 bg-transparent lg:bg-primary">
                
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-lg pt-16 lg:pt-0">
                    
                    {/* Decorative Line */}
                    <div className="w-12 h-1 bg-secondary mb-4 lg:mb-8 mx-auto lg:mx-0"></div>
                    
                    <span className="text-secondary text-[10px] lg:text-sm font-bold tracking-[0.3em] uppercase block mb-2 lg:mb-4">
                        {slide.subtitle}
                    </span>
                    
                    <h1 className="font-serif text-5xl md:text-6xl lg:text-[5rem] xl:text-[6rem] leading-[1.1] lg:leading-[1] mb-4 lg:mb-8 text-white drop-shadow-lg">
                        <span className="block font-bold">{slide.titleLine1}</span>
                        <span className="block font-serif italic font-light text-secondary">
                            {slide.titleLine2}
                        </span>
                    </h1>
                    
                    <p className="text-white/90 text-sm lg:text-lg mb-8 lg:mb-12 font-light leading-relaxed tracking-wide max-w-sm mx-auto lg:mx-0">
                        {slide.description}
                    </p>
                    
                    <Link 
                        href={slide.buttonLink} 
                        className="group relative inline-flex items-center justify-center px-8 py-4 lg:px-10 lg:py-5 bg-secondary text-white text-xs lg:text-xs font-bold uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 hover:bg-white hover:text-primary shadow-lg w-fit mx-auto lg:mx-0"
                    >
                        <span className="relative z-10 flex items-center gap-2 lg:gap-3">
                            {slide.buttonText}
                            <ArrowRight size={16} className="lg:w-4 lg:h-4" />
                        </span>
                    </Link>
                </div>
              </div>

              {/* === 3. DESKTOP POLAROID IMAGES (Hidden on Mobile) === */}
              <div className="hidden lg:flex w-1/2 h-full relative items-center justify-center lg:justify-end z-10 pb-12 lg:pb-0 pr-12 xl:pr-24">
                 <div className="relative w-full h-full flex items-center justify-center perspective-1000">
                    
                    {/* Main Polaroid */}
                    <div 
                        className="absolute w-[320px] h-[420px] lg:w-[450px] lg:h-[650px] bg-white p-3 shadow-2xl rotate-[-2deg] z-10 animate-in fade-in zoom-in duration-[1.2s] ease-out"
                    >
                        <div className="relative w-full h-full overflow-hidden border border-gray-200">
                            <Image 
                                src={slide.mainImage} 
                                alt={slide.titleLine1} 
                                fill 
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                    </div>

                    {/* Detail Polaroid */}
                    <div 
                        className="absolute w-[180px] h-[180px] lg:w-[350px] lg:h-[350px] bg-white p-3 shadow-2xl rotate-[3deg] z-20 animate-in slide-in-from-bottom-16 fade-in duration-[1.2s] delay-300 ease-out"
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-none">
            {slides.map((_, idx) => (
                <div 
                    key={idx}
                    className={`relative flex items-center justify-center transition-all duration-500 ${
                        activeIndex === idx ? 'w-4 h-4 lg:w-6 lg:h-6' : 'w-2 h-2'
                    }`}
                >
                    <div 
                        className={`absolute inset-0 rounded-full border border-white transition-all duration-500 ease-out ${
                            activeIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                        }`}
                    />
                    <div 
                        className={`rounded-full bg-white transition-all duration-500 ${
                            activeIndex === idx ? 'w-1.5 h-1.5' : 'w-1 h-1 opacity-50'
                        }`}
                    />
                </div>
            ))}
        </div>

      </Swiper>
    </section>
  );
}