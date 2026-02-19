import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroStatic() {
  // Mobile-optimized base sizes
  const mainImageSizes = "w-[260px] sm:w-[320px] lg:w-[400px] xl:w-[480px]";

  return (
    // Mobile padding adjusted (pt-32 pb-16) for better spacing on small screens
    <section className="relative w-full bg-primary min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-16 lg:py-24 px-6">
      
      {/* --- BACKGROUND CREATIVE ELEMENTS --- */}
      {/* Central soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-[#9eb393]/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Floating dust/stars accents */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#9eb393] rounded-full blur-[1px] opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-white rounded-full blur-[2px] opacity-30"></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-[#9eb393] rounded-full opacity-80"></div>


      <div className="max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-10 z-10">

        {/* --- LEFT FLOATING IMAGE CONTAINER (Hidden on Mobile) --- */}
        <div className="hidden lg:flex w-1/3 justify-center relative lg:order-1">
          
          {/* Glow effect */}
          <div className="absolute top-10 left-0 w-full h-full bg-[#9eb393]/30 blur-[70px] rounded-full -z-10 transform rotate-12 scale-125"></div>
          
          {/* Wireframe Outline */}
          <div className={`absolute top-6 -left-6 ${mainImageSizes} aspect-[4/5] border-[2px] border-[#9eb393]/40 -rotate-6 -z-5 rounded-sm`}></div>

          {/* Main Left Image: Model with Minimal Earrings */}
          <div className={`relative ${mainImageSizes} aspect-[4/5] -rotate-3 hover:rotate-0 hover:-translate-y-4 transition-all duration-700 ease-out`}>
            <div className="absolute inset-0 bg-white p-3 md:p-4 pb-12 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
              <div className="relative w-full h-full overflow-hidden bg-gray-100">
                <Image
                  src="/images/hero-1.jpg"
                  alt="Model wearing minimalist gold earrings"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- CENTER TEXT (Pushed below images on Mobile) --- */}
        <div className="w-full lg:w-1/3 flex flex-col items-center text-center text-white relative z-20 order-2 lg:order-2 mt-4 lg:mt-0">
          {/* Light Ray effect behind text */}
          <div className="absolute inset-0 flex justify-center -z-10 opacity-30">
            <div className="w-px h-[150%] -top-[25%] bg-gradient-to-b from-transparent via-[#9eb393] to-transparent"></div>
          </div>

          <div className="w-12 h-[2px] bg-secondary mb-4 lg:mb-6"></div>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 text-secondary">
            Modern Heirlooms
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-4 lg:mb-6 leading-[1.1] drop-shadow-lg relative">
            <span className="italic relative">
              Everyday
              <span className="absolute top-0 -right-4 w-2 h-2 bg-[#9eb393] rounded-full shadow-[0_0_10px_#9eb393]"></span>
            </span> <br />
            Luxury.
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-8 max-w-[320px]">
            Elevate the ordinary with conscious luxury. Minimalist designs crafted to be cherished today and handed down tomorrow.
          </p>
          <Link
            href="/shop"
            className="bg-secondary text-primary px-8 py-4 text-[10px] lg:text-xs font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 flex items-center gap-2 group shadow-[0_10px_30px_rgba(158,179,147,0.3)]"
          >
            Shop New Arrivals
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- RIGHT FLOATING IMAGES CONTAINER (On top for Mobile) --- */}
        <div className="w-full sm:w-2/3 lg:w-1/3 flex justify-center lg:justify-center relative order-1 lg:order-3 mb-4 lg:mb-0 mt-4 lg:mt-0">
           
           {/* Glow effect */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-[#9eb393]/20 blur-[80px] rounded-full -z-10 pointer-events-none"></div>
          
           {/* Wireframe Outline */}
           <div className={`absolute -top-4 -right-4 lg:-top-6 lg:-right-6 ${mainImageSizes} aspect-[4/5] border-[2px] border-[#9eb393]/40 rotate-6 -z-5 rounded-sm`}></div>

          {/* Main Right Image: Aesthetic Hands with Rings */}
          <div className={`relative ${mainImageSizes} aspect-[4/5] rotate-3 hover:rotate-0 hover:-translate-y-4 transition-all duration-700 ease-out z-0`}>
            <div className="absolute inset-0 bg-white p-3 md:p-4 pb-12 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
              <div className="relative w-full h-full overflow-hidden bg-gray-100">
                <Image
                  src="/images/hero-2.jpeg"
                  alt="Aesthetic hands with simple gold rings"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Small Overlapping photo: Macro Texture Detail */}
            {/* Sizes scaled down specifically for mobile balance */}
            <div className="absolute -bottom-6 -left-6 lg:-bottom-12 lg:-left-20 w-[140px] md:w-[180px] lg:w-[240px] aspect-square -rotate-6 z-10 group hover:-rotate-12 transition-all duration-500">
               <div className="absolute inset-0 border-[2px] border-[#9eb393]/60 translate-x-2 translate-y-2 lg:translate-x-4 lg:translate-y-4 -z-10 rounded-sm"></div>
               
               <div className="w-full h-full border-[3px] lg:border-8 border-white bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
                <div className="relative w-full h-full bg-gray-100">
                    <Image
                    src="/images/hero-3.jpeg"
                    alt="Gold jewelry macro texture detail"
                    fill
                    className="object-cover"
                    />
                </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}