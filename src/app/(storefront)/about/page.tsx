import Image from "next/image";
import { CheckCircle2, Diamond, Gem, HeartHandshake, ShieldCheck, Star } from "lucide-react";

export const metadata = {
  title: "About Us | Traaya Trends",
  description: "Discover the story behind Traaya Trends, where elegance meets craftsmanship.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-8">
                <span className="text-secondary font-bold tracking-widest uppercase text-xs">Our Story</span>
                <h1 className="font-serif text-5xl md:text-7xl text-primary leading-tight">
                    Crafting Elegance <br /> Since 2010
                </h1>
                <p className="text-gray-500 leading-relaxed text-lg max-w-xl mx-auto lg:mx-0">
                    At Traaya, we believe jewelry is more than just an accessory—it's a reflection of your unique journey. We blend traditional craftsmanship with modern design to create pieces that are timeless, ethical, and authentically you.
                </p>
                
                {/* Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-12 pt-8 border-t border-gray-100 mt-8">
                    <div>
                        <h4 className="font-serif text-3xl text-primary">15k+</h4>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Happy Customers</span>
                    </div>
                    <div>
                        <h4 className="font-serif text-3xl text-primary">25+</h4>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Awards Won</span>
                    </div>
                    <div>
                        <h4 className="font-serif text-3xl text-primary">100%</h4>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Handcrafted</span>
                    </div>
                </div>
            </div>

            {/* Hero Image */}
            <div className="flex-1 relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
                <div className="absolute inset-0 bg-gray-100 rounded-2xl overflow-hidden">
                    {/* Placeholder for your actual image */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                         {/* Replace with <Image src="..." /> */}
                         <span className="font-serif text-2xl italic">Hero Image Placeholder</span>
                    </div>
                </div>
                {/* Decorative floating card */}
                <div className="absolute -bottom-10 -left-10 bg-white p-8 shadow-xl rounded-sm hidden md:block max-w-xs">
                    <p className="font-serif text-primary text-xl italic leading-snug">"Jewelry has the power to be the one little thing that makes you feel unique."</p>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-full"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Founder, Traaya</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- VALUES SECTION --- */}
      <section className="bg-[#F9F9F9] py-24 px-6">
        <div className="max-w-[1600px] mx-auto">
            <div className="text-center mb-16 space-y-4">
                <span className="text-secondary font-bold tracking-widest uppercase text-xs">Why Choose Us</span>
                <h2 className="font-serif text-4xl text-primary">The Traaya Difference</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
                {/* Card 1 */}
                <div className="bg-white p-10 rounded-sm shadow-sm group hover:-translate-y-2 transition-transform duration-500">
                    <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                        <Diamond className="text-primary group-hover:text-white transition-colors" size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-primary mb-3">Premium Quality</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                        We use only the finest ethically sourced materials, ensuring that every gemstone and metal meets our rigorous standards.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-10 rounded-sm shadow-sm group hover:-translate-y-2 transition-transform duration-500">
                    <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                        <HeartHandshake className="text-primary group-hover:text-white transition-colors" size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-primary mb-3">Artisan Craftsmanship</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                        Each piece is hand-finished by master jewelers who have dedicated their lives to the art of fine jewelry making.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-10 rounded-sm shadow-sm group hover:-translate-y-2 transition-transform duration-500">
                    <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                        <ShieldCheck className="text-primary group-hover:text-white transition-colors" size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-primary mb-3">Lifetime Warranty</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                        We stand behind our quality. Every purchase comes with a comprehensive warranty to keep your treasures shining.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- VISUAL STORY (Split Layout) --- */}
      <section className="py-24 px-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
            {/* Image Grid */}
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                <div className="space-y-4 mt-8">
                    <div className="aspect-[3/4] bg-gray-100 rounded-sm w-full relative overflow-hidden">
                         {/* Replace with Image */}
                         <div className="absolute inset-0 bg-gray-200"></div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="aspect-[3/4] bg-gray-100 rounded-sm w-full relative overflow-hidden">
                         {/* Replace with Image */}
                         <div className="absolute inset-0 bg-gray-300"></div>
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 space-y-6">
                <h2 className="font-serif text-4xl text-primary">Designed for the <br /> Modern Muse</h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                    Our collections are inspired by the strength and grace of modern individuality. Whether you are dressing for a gala or a casual brunch, Traaya pieces are designed to elevate your everyday moments.
                </p>
                <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4">
                        <CheckCircle2 className="text-secondary" size={20} />
                        <span className="text-primary font-medium">Ethically Sourced Diamonds</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <CheckCircle2 className="text-secondary" size={20} />
                        <span className="text-primary font-medium">100% Recycled Gold</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <CheckCircle2 className="text-secondary" size={20} />
                        <span className="text-primary font-medium">Carbon Neutral Shipping</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="bg-primary py-24 text-center px-6">
        <div className="max-w-2xl mx-auto space-y-8">
            <Gem className="text-secondary mx-auto" size={48} strokeWidth={1} />
            <h2 className="font-serif text-4xl md:text-5xl text-white">
                Ready to find your sparkle?
            </h2>
            <p className="text-white/70 text-lg">
                Explore our latest collection and find the piece that speaks to you.
            </p>
            <a href="/shop" className="inline-block bg-white text-primary px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-secondary hover:text-white transition-colors">
                Shop Now
            </a>
        </div>
      </section>

    </div>
  );
}