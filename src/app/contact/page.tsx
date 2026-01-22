"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="bg-white text-[#1A1A1A] font-sans min-h-screen flex flex-col">
      <Navbar />

      {/* --- HERO HEADER --- */}
      <div className="pt-[160px] pb-16 text-center bg-[#F9F9F9] px-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B87E58] mb-3 block">Get in Touch</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A]">Contact Us</h1>
      </div>

      

      {/* --- BREADCRUMB & PAGE TITLE SECTION --- */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-[120px] pb-20 flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-[#E5E5E5]">
        
        {/* Left Side: Breadcrumb & Title */}
        <div className="mb-6 lg:mb-0">
          <div className="flex items-center text-xs text-[#888] mb-4">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="mx-2">—</span>
            <span className="text-black">Contact Us</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl uppercase tracking-wide text-[#1A1A1A]">
            CONTACT US
          </h1>
        </div>

        {/* Right Side: Description Text */}
        <div className="lg:max-w-md text-sm text-[#555] leading-relaxed">
          <p>
            We're here to assist you with any inquiries, whether it's about our jewelry collections, custom designs, or store locations. Reach out to us via phone, email, or visit one of our stores—we'd love to hear from you!
          </p>
        </div>

      </div>

      <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* ================= LEFT: CONTACT INFO ================= */}
          <div>
            <h2 className="font-serif text-2xl mb-8">Visit Our Boutique</h2>
            <p className="text-[#555] leading-relaxed mb-10">
              We invite you to experience our collection in person. Our master jewelers are available for consultations regarding custom pieces, repairs, and appraisals.
            </p>

            <div className="space-y-8">
              {/* Address */}
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#F9F9F9] flex items-center justify-center shrink-0 text-[#B87E58]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Address</h4>
                  <p className="text-sm text-[#555]">
                    123 Luxury Lane, Suite 100<br />
                    New York, NY 10012<br />
                    United States
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#F9F9F9] flex items-center justify-center shrink-0 text-[#B87E58]">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Phone</h4>
                  <p className="text-sm text-[#555]">+1 (212) 555-0199</p>
                  <p className="text-sm text-[#888] mt-1">Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#F9F9F9] flex items-center justify-center shrink-0 text-[#B87E58]">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-xs mb-2">Email</h4>
                  <p className="text-sm text-[#555]">concierge@vemus.com</p>
                  <p className="text-sm text-[#555]">press@vemus.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT: CONTACT FORM ================= */}
          <div className="bg-[#FAFAFA] p-8 md:p-12 border border-[#E5E5E5]">
            <h2 className="font-serif text-2xl mb-6">Send a Message</h2>
            <form className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-2 block">Name *</label>
                  <input type="text" className="w-full h-12 px-4 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#B87E58] transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-2 block">Email *</label>
                  <input type="email" className="w-full h-12 px-4 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#B87E58] transition-colors" placeholder="email@example.com" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-2 block">Subject</label>
                <select className="w-full h-12 px-4 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#B87E58] transition-colors text-[#555]">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Custom Jewelry Request</option>
                  <option>Press & Media</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-2 block">Message *</label>
                <textarea className="w-full h-32 p-4 border border-[#E5E5E5] bg-white text-sm outline-none focus:border-[#B87E58] transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <button className="h-12 px-8 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B87E58] transition-colors flex items-center gap-2">
                Send Message <Send size={14} />
              </button>

            </form>
          </div>

        </div>
      </div>

      {/* --- GOOGLE MAP (Full Width) --- */}
      <div className="w-full h-[400px] grayscale contrast-[1.1] filter">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.232551525976!2d-74.00445692426392!3d40.73357633627993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259966b4545d1%3A0x6b772c68e989408e!2sSoHo%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1709666000000!5m2!1sen!2sus" 
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