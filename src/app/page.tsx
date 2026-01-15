import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  // Hardcoded, reliable Unsplash images that match the Desert Rose theme
  const images = {
    hero: "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?q=80&w=2070&auto=format&fit=crop", // Woman with gold jewelry
    necklaces: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop",
    rings: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    earrings: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    product1: "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?q=80&w=800&auto=format&fit=crop",
    product2: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=800&auto=format&fit=crop",
    product3: "https://images.unsplash.com/photo-1602173574246-17b5cc92e59e?q=80&w=800&auto=format&fit=crop",
    product4: "https://images.unsplash.com/photo-1576060965319-869274382025?q=80&w=800&auto=format&fit=crop",
  };

  return (
    <main className="min-h-screen bg-traaya-sand text-traaya-brown">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={images.hero}
            alt="Traaya Jewelry Model"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-[#2C241F]/30" />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase mb-6 font-medium text-white/90">
            The Desert Rose Edit
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight">
            Elegance is <br /> <span className="italic font-light">Eternal</span>
          </h1>
          <button className="bg-traaya-terra text-white px-10 py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-white hover:text-traaya-dark transition-all duration-300">
            Shop Collection
          </button>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section className="py-24 px-4 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Necklaces */}
             <div className="relative h-[400px] group overflow-hidden cursor-pointer">
              <Image 
                src={images.necklaces}
                alt="Necklaces" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-traaya-dark/20 group-hover:bg-traaya-dark/40 transition-colors" />
              <div className="absolute bottom-8 left-8 text-white">
                 <h3 className="font-serif text-3xl mb-2">Necklaces</h3>
                 <span className="text-xs uppercase tracking-widest border-b border-white pb-1">View</span>
              </div>
             </div>

             {/* Rings */}
             <div className="relative h-[400px] group overflow-hidden cursor-pointer">
              <Image 
                src={images.rings}
                alt="Rings" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-traaya-dark/20 group-hover:bg-traaya-dark/40 transition-colors" />
              <div className="absolute bottom-8 left-8 text-white">
                 <h3 className="font-serif text-3xl mb-2">Rings</h3>
                 <span className="text-xs uppercase tracking-widest border-b border-white pb-1">View</span>
              </div>
             </div>

             {/* Earrings */}
             <div className="relative h-[400px] group overflow-hidden cursor-pointer">
              <Image 
                src={images.earrings}
                alt="Earrings" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-traaya-dark/20 group-hover:bg-traaya-dark/40 transition-colors" />
              <div className="absolute bottom-8 left-8 text-white">
                 <h3 className="font-serif text-3xl mb-2">Earrings</h3>
                 <span className="text-xs uppercase tracking-widest border-b border-white pb-1">View</span>
              </div>
             </div>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
            <h2 className="font-serif text-4xl text-center text-traaya-dark mb-12">New Arrivals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[images.product1, images.product2, images.product3, images.product4].map((img, i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                            <Image src={img} alt="Product" fill className="object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <h3 className="text-traaya-dark font-serif">Gold Vermeil Piece {i+1}</h3>
                        <p className="text-sm text-traaya-brown">₹4,999</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center border-t border-traaya-brown/10">
        <p className="text-traaya-brown/60 text-xs tracking-widest uppercase">© 2026 Traaya Trends</p>
      </footer>
    </main>
  );
}