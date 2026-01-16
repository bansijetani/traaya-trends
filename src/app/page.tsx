import Navbar from "./components/Navbar";
import { ArrowRight } from "lucide-react";

export default function Home() {
  // Using high-quality Unsplash images that match the luxury aesthetic
  const img = {
    hero: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?q=80&w=2070&auto=format&fit=crop",
    prod1: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    prod2: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=800&auto=format&fit=crop",
    prod3: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop",
    prod4: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* --- HERO SECTION (Exact lookalike) --- */}
      <section className="relative h-screen w-full flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={img.hero} 
            alt="Luxury Jewelry" 
            className="w-full h-full object-cover"
          />
          {/* Slight dark overlay to make white text pop */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full">
          <div className="max-w-2xl text-white">
            <span className="block text-[13px] font-bold uppercase tracking-widest2 mb-6">
              New Collection 2026
            </span>
            <h1 className="font-serif text-6xl md:text-8xl mb-10 leading-none">
              The Beauty <br/> of Purity.
            </h1>
            <button className="group flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest2 border-b-2 border-white pb-2 hover:text-vemus-gold hover:border-vemus-gold transition-all">
              Discover Now <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* --- TRENDY SECTION --- */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-vemus-black mb-4">Trend In This Season</h2>
            <p className="text-vemus-darkgray font-jost text-lg">Must-have pieces selected for you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Product Cards */}
            {[
                { name: "Diamond Studs", price: "$1,200", img: img.prod1 },
                { name: "Gold Band Ring", price: "$850", img: img.prod2 },
                { name: "Pearl Drop Necklace", price: "$2,100", img: img.prod3 },
                { name: "Solitaire Ring", price: "$3,500", img: img.prod4 },
            ].map((item, i) => (
                <div key={i} className="group cursor-pointer text-center">
                    <div className="relative overflow-hidden mb-6">
                        <img 
                            src={item.img} 
                            alt={item.name} 
                            className="w-full h-[350px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                         {/* Hover Action */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <button className="w-full bg-white text-vemus-black uppercase text-[11px] font-bold tracking-widest py-3 hover:bg-vemus-black hover:text-white transition-colors">
                                Add To Cart
                            </button>
                        </div>
                    </div>
                    <h3 className="font-serif text-xl text-vemus-black mb-2 group-hover:text-vemus-gold transition-colors">{item.name}</h3>
                    <p className="text-vemus-darkgray font-medium">{item.price}</p>
                </div>
            ))}
        </div>
      </section>
    </main>
  );
}