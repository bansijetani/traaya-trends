"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, ArrowRight, MapPin, Mail, Phone, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Newsletter State
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        toast.error("Please enter your email address");
        return;
    }
    
    setLoading(true);

    try {
        // 👇 REAL API CALL
        const res = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        toast.success("Welcome to the club! You are subscribed.");
        setEmail(""); // Clear input
        
    } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Something went wrong.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <footer className="bg-primary text-white pt-20 pb-10 font-sans relative overflow-hidden">
      
      {/* --- WATERMARK --- */}
      {/* Positioned at the bottom to cover the links and copyright area */}
      <div className="absolute -bottom-20 left-0 w-full overflow-hidden pointer-events-none select-none flex justify-center opacity-[0.05]">
         <span className="font-serif text-[18vw] leading-none text-white whitespace-nowrap tracking-widest">
            TRAAYA
         </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* --- TOP SECTION: Newsletter & Socials --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
            
            {/* Brand Intro */}
            <div className="max-w-md">
                <h2 className="font-serif text-3xl md:text-4xl mb-6 tracking-wide text-white">Traaya Trends</h2>
                <p className="text-white/80 text-sm leading-relaxed mb-8 font-light">
                    Everyday elegance, thoughtfully crafted. Jewelry designed by friends, made to celebrate the bonds and moments that define your story.
                </p>
                <div className="flex gap-4">
                    {/* Instagram */}
                    <a 
                        href="https://instagram.com/traaya_trends" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Follow us on Instagram"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                    >
                        <Instagram className="w-5 h-5 text-white" />
                    </a>

                    {/* Facebook */}
                    <a 
                        href="https://facebook.com/traayatrends" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Follow us on Facebook"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                    >
                        <Facebook className="w-5 h-5 text-white" />
                    </a>

                    {/* Pinterest */}
                    <a 
                        href="https://pinterest.com/traayatrends" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Follow us on Pinterest"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                    >
                        <svg 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-5 h-5 text-white"
                            >
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.436 2.983 7.436 6.953 0 4.156-2.618 7.502-6.255 7.502-1.222 0-2.373-.635-2.766-1.385l-.754 2.875c-.272 1.04-1.008 2.34-1.503 3.134 1.134.348 2.327.535 3.551.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.592 0 12.017 0z"/>
                        </svg>
                    </a>
                </div>
            </div>

            {/* Functional Newsletter Input */}
            <div className="w-full lg:w-auto min-w-[320px]">
                <h3 className="font-serif text-lg text-white mb-4">Subscribe to our newsletter</h3>
                <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-white/30 hover:border-white transition-colors pb-2">
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address" 
                        className="w-full bg-transparent text-white outline-none placeholder:text-white/50 py-2 text-sm font-light tracking-wide disabled:opacity-50"
                        disabled={loading}
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="ml-4 text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                    </button>
                </form>
                <p className="text-[10px] text-white/50 mt-3 uppercase tracking-wider">
                    By signing up, you agree to our Privacy Policy.
                </p>
            </div>
        </div>

        {/* --- DIVIDER --- */}
        <div className="border-t border-white/10 mb-16"></div>

        {/* --- MIDDLE SECTION: Links Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-8 mb-16">
            
            {/* Column 1 */}
            <div>
                <h4 className="font-serif text-lg mb-6 text-white">Pages</h4>
                <ul className="space-y-4 text-sm font-light text-white/80">
                    <li><FooterLink href="/">Home</FooterLink></li>
                    <li><FooterLink href="/shop">Shop</FooterLink></li>
                    <li><FooterLink href="/about">About us</FooterLink></li>
                    <li><FooterLink href="/contact">Contact</FooterLink></li>
                </ul>
            </div>

            {/* Column 2 */}
            <div>
                <h4 className="font-serif text-lg mb-6 text-white">Collections</h4>
                <ul className="space-y-4 text-sm font-light text-white/80">
                    <li><FooterLink href="/shop?category=necklaces">Necklaces</FooterLink></li>
                    <li><FooterLink href="/shop?category=earrings">Earrings</FooterLink></li>
                    <li><FooterLink href="/shop?category=rings">Rings</FooterLink></li>
                    <li><FooterLink href="/shop?category=bracelets">Bracelets</FooterLink></li>
                </ul>
            </div>

            {/* Column 3 */}
            <div>
                <h4 className="font-serif text-lg mb-6 text-white">Support</h4>
                <ul className="space-y-4 text-sm font-light text-white/80">
                    <li><FooterLink href="/account">My Account</FooterLink></li>
                    <li><FooterLink href="/track-order">Track Order</FooterLink></li>
                    <li><FooterLink href="/shipping">Shipping & Returns</FooterLink></li>
                    <li><FooterLink href="/faq">FAQs</FooterLink></li>
                </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
                <h4 className="font-serif text-lg mb-6 text-white">Contact Us</h4>
                <ul className="space-y-6 text-sm font-light text-white/80">
                    <li className="flex gap-3 items-start">
                        <MapPin size={16} className="mt-1 shrink-0 text-white/60" />
                        <span>123 Yarran St, Punchbowl,<br/>NSW 2196, Australia</span>
                    </li>
                    <li className="flex gap-3 items-center">
                        <Mail size={16} className="shrink-0 text-white/60" />
                        <a href="mailto:support@traayatrends.com" className="hover:text-white transition-colors">support@traayatrends.com</a>
                    </li>
                    <li className="flex gap-3 items-center">
                        <Phone size={16} className="shrink-0 text-white/60" />
                        <a href="tel:+18881234567" className="hover:text-white transition-colors">+1 888 123 4567</a>
                    </li>
                </ul>
            </div>

        </div>

        {/* --- BOTTOM SECTION: Copyright --- */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/60 uppercase tracking-widest font-medium">
            <p>&copy; {currentYear} Traaya Trends. All Rights Reserved.</p>
            <div className="flex gap-6">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
        </div>

      </div>
    </footer>
  );
}

// --- Helper Components ---

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
    return (
        <a 
            href={href} 
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300"
        >
            {icon}
        </a>
    )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">
            {children}
        </Link>
    )
}