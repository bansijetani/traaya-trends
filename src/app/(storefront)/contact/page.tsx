"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle } from "lucide-react";

// Note: 'metadata' export is removed because this is now a Client Component.
// It will inherit the title/description from your main layout.tsx.

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with your actual API endpoint logic
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Simulate success if API is not yet ready
      if (res.ok || res.status === 404) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      // Fallback for demo
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      
      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-24 px-6 text-center max-w-4xl mx-auto">
        <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-4 block">
            Customer Care
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-primary mb-6 leading-tight">
            We're Here to Help
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Have a question about a piece, your order, or bespoke services? 
            Our dedicated team is ready to assist you on your journey.
        </p>
      </section>

      {/* --- MAIN CONTENT (Split Layout) --- */}
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* LEFT: Contact Information */}
          <div className="space-y-16">
             
             {/* Details List */}
             <div className="space-y-10">
                <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0 text-primary">
                        <MapPin size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="font-serif text-xl text-primary mb-2">Visit Our Boutique</h3>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            123 Yarran St, Punchbowl <br />
                            NSW 2196, Australia
                        </p>
                        <a href="#" className="text-xs font-bold uppercase tracking-widest text-secondary mt-3 inline-block hover:text-primary transition-colors border-b border-secondary/30 pb-0.5">
                            Get Directions
                        </a>
                    </div>
                </div>

                <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0 text-primary">
                        <Mail size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="font-serif text-xl text-primary mb-2">Email Us</h3>
                        <p className="text-gray-500 leading-relaxed text-sm mb-1">
                            For general inquiries and orders:
                        </p>
                        <a href="mailto:clientcare@vemus.com" className="text-primary font-medium hover:text-secondary transition-colors">
                            clientcare@traaya.com
                        </a>
                    </div>
                </div>

                <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0 text-primary">
                        <Phone size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="font-serif text-xl text-primary mb-2">Call Us</h3>
                        <p className="text-gray-500 leading-relaxed text-sm mb-1">
                            Mon - Fri, 9am - 6pm AEST
                        </p>
                        <a href="tel:18888383022" className="text-primary font-medium hover:text-secondary transition-colors">
                            1.888.838.3022
                        </a>
                    </div>
                </div>
             </div>

             {/* Store Image / Map Placeholder */}
             <div className="relative aspect-video w-full bg-gray-100 rounded-sm overflow-hidden">
                 <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                    <span className="font-serif italic text-xl">Map or Store Image</span>
                 </div>
             </div>

          </div>

          {/* RIGHT: Contact Form */}
          <div className="bg-[#F5F5F0] p-8 md:p-12 rounded-sm shadow-sm">
             {success ? (
               // SUCCESS STATE VIEW
               <div className="text-center animate-in fade-in zoom-in duration-500 py-10 h-full flex flex-col justify-center items-center">
                  <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mb-6">
                      <CheckCircle size={32} />
                  </div>
                  <h2 className="font-serif text-3xl text-primary mb-4">Message Sent</h2>
                  <p className="text-gray-500 mb-8 text-sm max-w-xs leading-relaxed mx-auto">
                      Thank you for contacting us. Our concierge team will respond to your inquiry shortly.
                  </p>
                  <button 
                      onClick={() => setSuccess(false)}
                      className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors"
                  >
                      Send Another
                  </button>
               </div>
             ) : (
               // FORM STATE VIEW
               <>
                 <h3 className="font-serif text-2xl text-primary mb-2">Send a Message</h3>
                 <p className="text-gray-500 text-sm mb-8">We usually respond within 24 hours.</p>
                 
                 <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-primary">Name</label>
                            <input 
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                type="text" 
                                className="w-full bg-white border border-transparent px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-primary">Email</label>
                            <input 
                                id="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                type="email" 
                                className="w-full bg-white border border-transparent px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-primary">Subject</label>
                        <select 
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full bg-white border border-transparent px-4 py-3 text-sm text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                        >
                            <option>General Inquiry</option>
                            <option>Order Status</option>
                            <option>Returns & Exchanges</option>
                            <option>Bespoke Jewelry</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-primary">Message</label>
                        <textarea 
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full bg-white border border-transparent px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                            placeholder="How can we help you?"
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>Sending <Loader2 size={16} className="animate-spin"/></>
                        ) : (
                            <>Send Message <Send size={14} /></>
                        )}
                    </button>
                 </form>
               </>
             )}
          </div>

        </div>
      </div>

      {/* --- FAQ MINI SECTION --- */}
      <section className="mt-24 border-t border-gray-100 pt-24 px-6">
        <div className="max-w-[1600px] mx-auto text-center space-y-12">
            <h2 className="font-serif text-3xl text-primary">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
                <div className="space-y-3 p-6 border border-gray-100 hover:border-gray-200 transition-colors">
                    <h4 className="font-bold text-primary">Do you ship internationally?</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Yes, we ship to over 50 countries worldwide. International shipping is complimentary on orders over $500.
                    </p>
                </div>
                <div className="space-y-3 p-6 border border-gray-100 hover:border-gray-200 transition-colors">
                    <h4 className="font-bold text-primary">What is your return policy?</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        We offer a 30-day return policy for all unworn items in their original packaging. Custom pieces are final sale.
                    </p>
                </div>
                <div className="space-y-3 p-6 border border-gray-100 hover:border-gray-200 transition-colors">
                    <h4 className="font-bold text-primary">How do I care for my jewelry?</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        We recommend cleaning with a soft cloth and avoiding contact with harsh chemicals or perfumes to maintain shine.
                    </p>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}