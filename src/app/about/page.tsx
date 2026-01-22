"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Gem, Hammer, Leaf, Award } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-white text-[#1A1A1A] font-sans">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center text-center px-4">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/banner-3.jpg" // Ensure you have a relevant banner image here
            alt="Jewelry Workshop" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-white max-w-3xl mx-auto animate-in fade-in zoom-in duration-1000">
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4 block text-[#B87E58]">
            Est. 2025
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 leading-tight">
            Crafting Legacy,<br/> One Gem at a Time
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            We believe that jewelry is more than just an accessory—it's a memory, a promise, and a piece of art designed to be cherished forever.
          </p>
        </div>
      </div>

      {/* --- OUR STORY SECTION --- */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4 relative">
             <div className="aspect-[3/4] bg-[#F9F9F9] relative overflow-hidden rounded-sm">
                <img src="/images/product-1.jpg" alt="Craftsmanship" className="w-full h-full object-cover mix-blend-multiply" />
             </div>
             <div className="aspect-[3/4] bg-[#F9F9F9] relative overflow-hidden rounded-sm mt-12">
                <img src="/images/product-2.jpg" alt="Detail" className="w-full h-full object-cover mix-blend-multiply" />
             </div>
             {/* Decorative Element */}
             <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] border border-[#E5E5E5]"></div>
          </div>

          {/* Text Content */}
          <div className="lg:pl-10">
            <span className="text-[#B87E58] text-xs font-bold uppercase tracking-widest mb-2 block">Our Story</span>
            <h2 className="font-serif text-4xl mb-6 text-[#1A1A1A]">From a Small Workshop to Global Elegance</h2>
            <div className="space-y-6 text-[#555] leading-relaxed">
              <p>
                Founded in 2025, Tyaara Trends began with a simple vision: to create jewelry that bridges the gap between modern trends and timeless tradition. What started as a small artisan workshop has grown into a beloved brand known for its uncompromising quality.
              </p>
              <p>
                Every piece in our collection is sketched by hand, cast in premium metals, and set with ethically sourced stones. We don't just sell jewelry; we sell the feeling of luxury, confidence, and grace.
              </p>
              <div className="pt-4">
                 <img src="/images/signature.png" alt="Founder Signature" className="h-12 opacity-60" /> {/* Add a signature image or remove this div */}
                 <p className="text-xs font-bold uppercase tracking-widest mt-2 text-[#1A1A1A]">Jane Doe, Founder</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- VALUES SECTION --- */}
      <div className="bg-[#F9F9F9] py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Gem, title: "Finest Materials", text: "We use only 18k Gold, Sterling Silver, and certified gemstones." },
              { icon: Hammer, title: "Handcrafted", text: "Each piece is finished by hand by master jewelers." },
              { icon: Leaf, title: "Sustainable", text: "100% recycled gold and ethically sourced diamonds." },
              { icon: Award, title: "Lifetime Warranty", text: "We stand by our quality forever. Free repairs, always." }
            ].map((item, i) => (
              <div key={i} className="text-center p-6 group hover:bg-white hover:shadow-lg transition-all duration-300 rounded-sm">
                <div className="w-16 h-16 mx-auto bg-[#E9EFE3] text-[#4CAF50] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                  <item.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl mb-3 text-[#1A1A1A]">{item.title}</h3>
                <p className="text-sm text-[#555] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="flex flex-col lg:flex-row w-full max-w-[1500px] mx-auto">
      {/* Left Side: Image */}
      <div className="w-full lg:w-1/2 h-auto lg:h-[600px] relative">
        <Image
          src="/images/core-value.jpg" // Replace with your actual image path
          alt="Golden Hoop Earrings"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* Right Side: Content Blocks */}
      <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 text-center font-sans">
        {/* Block 1: Timeless Craftsmanship */}
        <div className="bg-[#A88E4D] text-white p-12 flex flex-col justify-center items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
            TIMELESS CRAFTSMANSHIP
          </h3>
          <div className="w-8 h-px bg-white mb-4"></div>
          <p className="text-xs leading-relaxed">
            Every piece is meticulously crafted with precision, blending traditional artistry with modern innovation to ensure lasting beauty.
          </p>
        </div>

        {/* Block 2: Exceptional Quality */}
        <div className="bg-[#F9F5E7] text-[#1A1A1A] p-12 flex flex-col justify-center items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
            EXCEPTIONAL QUALITY
          </h3>
          <div className="w-8 h-px bg-[#1A1A1A] mb-4"></div>
          <p className="text-xs leading-relaxed">
            We source only the finest materials, from radiant gemstones to premium metals, ensuring each creation meets the highest standards.
          </p>
        </div>

        {/* Block 3: Meaningful Designs */}
        <div className="bg-[#F9F5E7] text-[#1A1A1A] p-12 flex flex-col justify-center items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
            MEANINGFUL DESIGNS
          </h3>
          <div className="w-8 h-px bg-[#1A1A1A] mb-4"></div>
          <p className="text-xs leading-relaxed">
            Our jewelry is more than just an accessory—it's a symbol of love, milestones, and personal expression, designed to tell your story.
          </p>
        </div>

        {/* Block 4: Customer Commitment */}
        <div className="bg-[#A88E4D] text-white p-12 flex flex-col justify-center items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
            CUSTOMER COMMITMENT
          </h3>
          <div className="w-8 h-px bg-white mb-4"></div>
          <p className="text-xs leading-relaxed">
            Your satisfaction is at the heart of everything we do, offering personalized service and lifelong support for every Vemus piece.
          </p>
        </div>
      </div>
    </section>

      {/* --- STATS SECTION --- */}
      <div className="py-20 border-b border-[#E5E5E5]">
         <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-[#E5E5E5]">
            <div>
               <span className="block text-4xl md:text-5xl font-serif text-[#B87E58] mb-2">15k+</span>
               <span className="text-xs font-bold uppercase tracking-widest text-[#888]">Happy Customers</span>
            </div>
            <div>
               <span className="block text-4xl md:text-5xl font-serif text-[#B87E58] mb-2">300+</span>
               <span className="text-xs font-bold uppercase tracking-widest text-[#888]">Unique Designs</span>
            </div>
            <div>
               <span className="block text-4xl md:text-5xl font-serif text-[#B87E58] mb-2">12</span>
               <span className="text-xs font-bold uppercase tracking-widest text-[#888]">Awards Won</span>
            </div>
            <div>
               <span className="block text-4xl md:text-5xl font-serif text-[#B87E58] mb-2">100%</span>
               <span className="text-xs font-bold uppercase tracking-widest text-[#888]">Satisfaction</span>
            </div>
         </div>
      </div>


      {/* --- TEAM SECTION (Optional) --- */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-20 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
           <span className="text-[#B87E58] text-xs font-bold uppercase tracking-widest mb-2 block">The Artisans</span>
           <h2 className="font-serif text-4xl text-[#1A1A1A]">Meet the Makers</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1, 2, 3].map((item) => (
              <div key={item} className="group text-center">
                 <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                    <img src={`/images/team-${item}.jpg`} alt="Team Member" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                     {/* If you don't have team images yet, use a placeholder or remove this section */}
                     <div className="absolute inset-0 bg-[#F9F9F9] flex items-center justify-center text-[#888] text-xs uppercase tracking-widest">
                        [Team Image {item}]
                     </div>
                 </div>
                 <h3 className="font-serif text-xl mb-1">Alex Morgan</h3>
                 <p className="text-xs font-bold uppercase tracking-widest text-[#888]">Lead Designer</p>
              </div>
           ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}