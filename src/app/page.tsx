import Image from "next/image";
import Navbar from "./components/Navbar";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-traaya-sand text-traaya-brown">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1617038224531-16d69b91752c?q=80&w=2070&auto=format&fit=crop"
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
          {["Necklaces", "Rings", "Earrings"].map((cat, index) => (
             <div key={index} className="relative h-[400px] group overflow-hidden cursor-pointer">
              <Image 
                src={`https://images.unsplash.com/photo-1596944924616-00311a638840?q=80&w=800&auto=format&fit=crop&bg=${index}`}
                alt={cat} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-traaya-dark/20 group-hover:bg-traaya-dark/40 transition-colors" />
              <div className="absolute bottom-8 left-8 text-white">
                 <h3 className="font-serif text-3xl mb-2">{cat}</h3>
                 <span className="text-xs uppercase tracking-widest border-b border-white pb-1">View</span>
              </div>
             </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center border-t border-traaya-brown/10">
        <p className="text-traaya-brown/60 text-xs tracking-widest uppercase">© 2026 Traaya Trends</p>
      </footer>
    </main>
  );
}