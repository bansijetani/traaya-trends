import Link from "next/link";
import { Search, ShoppingBag, User, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-traaya-sand/90 backdrop-blur-md border-b border-traaya-brown/10">
      {/* Top Bar */}
      <div className="bg-traaya-dark text-white text-[10px] tracking-widest text-center py-2 uppercase font-medium">
        Free Shipping on Orders Over ₹2500
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left: Menu */}
        <div className="flex items-center gap-6">
          <button className="lg:hidden text-traaya-dark">
            <Menu size={24} strokeWidth={1.5} />
          </button>
          <div className="hidden lg:flex gap-8 text-sm font-medium tracking-wide uppercase text-traaya-brown/80">
            <Link href="/shop" className="hover:text-traaya-terra transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-traaya-terra transition-colors">About</Link>
          </div>
        </div>

        {/* Center: Brand Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-traaya-dark">
            Traaya<span className="text-traaya-terra">.</span>
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-5 text-traaya-dark">
          <button className="hover:text-traaya-terra transition-colors">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button className="relative hover:text-traaya-terra transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-traaya-terra text-white text-[10px] flex items-center justify-center rounded-full">0</span>
          </button>
        </div>
      </div>
    </nav>
  );
}