"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle } from "lucide-react";

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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white text-[#1A1A1A] font-sans min-h-screen flex flex-col">
      <Navbar />

      {/* --- BREADCRUMB & PAGE TITLE SECTION --- */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-[180px] pb-20 flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-[#E5E5E5] gap-10">
        
        {/* Left Side: Breadcrumb & Title */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center text-xs text-[#888] uppercase tracking-widest">
            <Link href="/" className="hover:text-black transition-colors cursor-pointer">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black font-bold">Contact</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl uppercase tracking-wide text-[#1A1A1A]">
            Contact Us
          </h1>
        </div>

        {/* Right Side: Description Text */}
        <div className="lg:max-w-md text-sm text-[#555] leading-relaxed pb-2">
          <p>
            We're here to assist you with any inquiries, whether it's about our jewelry collections, custom designs, or store locations. Reach out to us via phone, email, or visit one of our stores.
          </p>
        </div>

      </div>

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* ================= LEFT: CONTACT INFO ================= */}
          <div>
            <h2 className="font-serif text-3xl mb-8">Visit Our Boutique</h2>
            <p className="text-[#555] leading-relaxed mb-12">
              We invite you to experience our collection in person. Our master jewelers are available for consultations regarding custom pieces, repairs, and appraisals.
            </p>

            <div className="space-y-10">
              {/* Address */}
              <div className="flex gap-6 group cursor-default">
                <div className="w-14 h-14 bg-[#F9F9F9] group-hover:bg-[#1A1A1A] transition-colors duration-300 flex items-center justify-center shrink-0 text-[#B87E58] group-hover:text-white">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-3">Address</h4>
                  <p className="text-sm text-[#555] leading-relaxed">
                    123 Luxury Lane, Suite 100<br />
                    New York, NY 10012<br />
                    United States
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-6 group cursor-pointer" onClick={() => window.location.href = 'tel:+12125550199'}>
                <div className="w-14 h-14 bg-[#F9F9F9] group-hover:bg-[#1A1A1A] transition-colors duration-300 flex items-center justify-center shrink-0 text-[#B87E58] group-hover:text-white">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-3">Phone</h4>
                  <p className="text-sm text-[#555]">+1 (212) 555-0199</p>
                  <p className="text-sm text-[#888] mt-1">Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-6 group cursor-pointer" onClick={() => window.location.href = 'mailto:concierge@vemus.com'}>
                <div className="w-14 h-14 bg-[#F9F9F9] group-hover:bg-[#1A1A1A] transition-colors duration-300 flex items-center justify-center shrink-0 text-[#B87E58] group-hover:text-white">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-3">Email</h4>
                  <p className="text-sm text-[#555]">concierge@vemus.com</p>
                  <p className="text-sm text-[#555]">press@vemus.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT: CONTACT FORM ================= */}
          <div className="bg-[#FAFAFA] p-8 md:p-12 border border-[#E5E5E5] flex flex-col justify-center relative overflow-hidden">
            
            {success ? (
               // SUCCESS STATE VIEW
               <div className="text-center animate-in fade-in zoom-in duration-500 py-10">
                  <div className="w-20 h-20 bg-[#F0FDF4] text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                  </div>
                  <h2 className="font-serif text-3xl text-[#1A1A1A] mb-4">Message Sent!</h2>
                  <p className="text-[#555] mb-10 text-sm max-w-xs mx-auto leading-relaxed">
                      Thank you for contacting us. We will respond to your inquiry within 24 hours.
                  </p>
                  <button 
                      onClick={() => setSuccess(false)}
                      className="cursor-pointer text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A1A] border-b border-[#1A1A1A] pb-1 hover:text-[#B87E58] hover:border-[#B87E58] transition-colors"
                  >
                      Send Another Message
                  </button>
               </div>
            ) : (
               // FORM STATE VIEW
               <>
                <h2 className="font-serif text-3xl mb-8">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] block">Name *</label>
                      <input 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        type="text" 
                        className="w-full h-12 px-4 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#B87E58] transition-colors placeholder:text-gray-300" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] block">Email *</label>
                      <input 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        type="email" 
                        className="w-full h-12 px-4 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#B87E58] transition-colors placeholder:text-gray-300" 
                        placeholder="email@example.com" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] block">Subject</label>
                    <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="cursor-pointer w-full h-12 px-4 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#B87E58] transition-colors text-[#555]"
                    >
                      <option>General Inquiry</option>
                      <option>Order Support</option>
                      <option>Custom Jewelry Request</option>
                      <option>Press & Media</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] block">Message *</label>
                    <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full h-32 p-4 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#B87E58] transition-colors resize-none placeholder:text-gray-300" 
                        placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="cursor-pointer h-14 px-10 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B87E58] transition-colors flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
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

      {/* --- GOOGLE MAP (FIXED URL) --- */}
      <div className="w-full h-[450px] grayscale contrast-[1.1] filter border-t border-[#E5E5E5]">
        <iframe 
          // 👇 FIXED URL (Using https and maps.google.com)
          src="https://maps.google.com/maps?q=Berlin&t=&z=13&ie=UTF8&iwloc=&output=embed" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <Footer />
    </main>
  );
}