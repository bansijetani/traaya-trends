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
                    Three Friends. <br /> One Enduring Vision.
                </h1>
                <p className="text-gray-500 leading-relaxed text-lg max-w-xl mx-auto lg:mx-0">
                    Traaya didn't begin in a boardroom; it began with a bond. As three close friends, we have shared every major season of life together—the triumphs, the quiet moments, and everything in between. But when we searched for jewelry to commemorate our journey, we found pieces that were either too mass-produced to feel personal or too fragile for everyday wear. We wanted something that mirrored our own friendship: resilient, beautiful, and profoundly meaningful.
                </p> 
                <p className="text-gray-500 leading-relaxed text-lg max-w-xl mx-auto lg:mx-0">
                    That is how Traaya was born. The name itself represents the power of three. We pour the essence of our connection into every design, crafting pieces that are meant to be shared, gifted, and worn as tangible reminders of the people who anchor your life. To us, jewelry is more than metal and stone. It is love, loyalty, and history, forged into something you can carry with you forever.
                </p>   
                
                {/* Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-12 pt-8 border-t border-gray-100 mt-8">
                    <div>
                        <h4 className="font-serif text-3xl text-primary">03</h4>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">FOUNDERS & FRIENDS</span>
                    </div>
                    <div>
                        <h4 className="font-serif text-3xl text-primary">100%</h4>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">ETHICALLY SOURCED</span>
                    </div>
                    <div>
                        <h4 className="font-serif text-3xl text-primary">100%</h4>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">HANDCRAFTED</span>
                    </div>
                </div>
            </div>

            {/* Hero Image */}
            <div className="flex-1 relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
                <div className="absolute inset-0 bg-gray-100 rounded-2xl overflow-hidden">
                    {/* Placeholder for your actual image */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                         <Image
                            src="/images/about/founders-hand.png"
                            alt="Hands of the three Traaya founders wearing rings"
                            fill // Makes the image fill the parent container
                            sizes="(max-width: 1024px) 100w, 50w" // Helps Next.js load the right size
                            className="object-cover" // Ensures the image crops perfectly into the circle
                            priority // Optional: loads this image faster since it's above the fold
                        />
                    </div>
                </div>
                {/* Decorative floating card */}
                <div className="absolute -bottom-10 -left-10 bg-white p-8 shadow-xl rounded-sm hidden md:block max-w-xs">
                    <p className="font-serif text-primary text-xl italic leading-snug">"We don't just design jewelry. We craft the physical reminders of the people who make your life beautiful."</p>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-full"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-900">THE FOUNDERS</span>
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
                    <h3 className="font-serif text-2xl text-primary mb-3">Premium Finishes</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                        We believe luxurious design shouldn't be locked in a safe. Our pieces are crafted using high-grade, skin-safe metals and finished with radiant, long-lasting plating, giving you the breathtaking look of fine jewelry meant for everyday life.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-10 rounded-sm shadow-sm group hover:-translate-y-2 transition-transform duration-500">
                    <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                        <HeartHandshake className="text-primary group-hover:text-white transition-colors" size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-primary mb-3">Artisan Details</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                        Every design is brought to life with the same meticulous attention to detail as traditional fine jewelry. From flawless stone settings to hand-polished finishes, our makers ensure every piece feels exceptionally crafted.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-10 rounded-sm shadow-sm group hover:-translate-y-2 transition-transform duration-500">
                    <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                        <ShieldCheck className="text-primary group-hover:text-white transition-colors" size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-primary mb-3">The Traaya Promise</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                        Designed to be lived in. We rigorously test our collections for durability and shine, ensuring your jewelry remains a stunning, reliable part of your daily rotation. We stand proudly behind the quality of everything we make.
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
                        <Image
                            src="/images/about/muse-1.png" /* 👈 Update to match your saved filename */
                            alt="Modern muse wearing elegant everyday jewelry"
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="aspect-[3/4] bg-gray-100 rounded-sm w-full relative overflow-hidden">
                        <Image
                            src="/images/about/muse-2.png" /* 👈 Update to match your saved filename */
                            alt="Close up of gold rings stacked on hand"
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 space-y-6">
                <h2 className="font-serif text-4xl text-primary">Designed for the <br /> Modern Muse</h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                    At Traaya, we design for the woman who moves seamlessly through her day. Our pieces are crafted to be the perfect finishing touch—effortlessly chic, undeniably bold, and comfortable enough to wear from morning until midnight. Because true luxury shouldn't be reserved only for special occasions.
                </p>
                <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4">
                        <CheckCircle2 className="text-secondary" size={20} />
                        <span className="text-primary font-medium">Hypoallergenic & Skin-Safe Metals</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <CheckCircle2 className="text-secondary" size={20} />
                        <span className="text-primary font-medium">Radiant, Long-Lasting Plating</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <CheckCircle2 className="text-secondary" size={20} />
                        <span className="text-primary font-medium">Ethically Hand-Finished</span>
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
                Begin Your Traaya Journey
            </h2>
            <p className="text-white/70 text-lg">
                Explore our handcrafted collections and find the perfect pieces to layer, stack, and live in every single day.
            </p>
            <a href="/shop" className="inline-block bg-white text-primary px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-secondary hover:text-white transition-colors">
                SHOP THE COLLECTION
            </a>
        </div>
      </section>

    </div>
  );
}