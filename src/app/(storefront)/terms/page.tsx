import Link from "next/link";
import { Scale, FileText, AlertCircle, ShieldAlert, Gavel, IndianRupee } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 md:pt-40 md:pb-32 font-sans text-[#1A1A1A]">
      
      {/* --- HERO HEADER --- */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 bg-[#3A4D39]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#3A4D39]">
            <Scale size={28} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-[#3A4D39] mb-6">Terms of Service</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Welcome to Traaya Trends. By accessing our website and purchasing our jewelry, you agree to be bound by the following terms and conditions 
          under the laws of India. Please read them carefully.
        </p>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-6">
            Last Updated: February 2026
        </p>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-3xl mx-auto px-6 space-y-16">
        
        {/* Section 1: Overview */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="flex items-center gap-3 mb-6">
                <FileText size={20} className="text-[#3A4D39]" />
                <h2 className="font-serif text-2xl md:text-3xl text-[#3A4D39]">1. General Conditions</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    This website is operated by Traaya Trends. By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by these Terms.
                </p>
                <p>
                    We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks. Credit card and UPI information is always encrypted during transfer over networks.
                </p>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 2: Products & Pricing */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
             <div className="flex items-center gap-3 mb-6">
                <IndianRupee size={20} className="text-[#3A4D39]" />
                <h2 className="font-serif text-2xl md:text-3xl text-[#3A4D39]">2. Products & Pricing</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <ul className="list-disc pl-5 space-y-2 marker:text-[#3A4D39]">
                    <li><strong>Pricing:</strong> All prices are listed in Indian Rupees (INR) and are inclusive of GST unless stated otherwise. Prices are subject to change without notice.</li>
                    <li><strong>Accuracy:</strong> We have made every effort to display as accurately as possible the colors and images of our products. However, as monitors vary, we cannot guarantee that your monitor's display of any color will be accurate.</li>
                    <li><strong>Handcrafted Nature:</strong> As our jewelry is hand-finished, slight variations in plating tone or stone setting may occur. These are not defects but part of the bespoke charm.</li>
                </ul>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 3: Billing & Payments */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="flex items-center gap-3 mb-6">
                <AlertCircle size={20} className="text-[#3A4D39]" />
                <h2 className="font-serif text-2xl md:text-3xl text-[#3A4D39]">3. Billing & Account Accuracy</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    We reserve the right to refuse any order you place with us. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
                </p>
                <p>
                    You agree to provide current, complete, and accurate purchase and account information. For prepaid orders, if a payment is flagged by our fraud detection system, we may require additional verification before dispatching.
                </p>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 4: Returns & Cancellations */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <h2 className="font-serif text-2xl md:text-3xl text-[#3A4D39] mb-6">4. Returns & Cancellations</h2>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    <strong>Cancellations:</strong> You may cancel your order within 2 hours of placing it by contacting us via WhatsApp or Email. Once processed/shipped, orders cannot be canceled.
                </p>
                <p>
                    <strong>Returns:</strong> Our policy lasts 7 days from the date of delivery. To be eligible for a return, your item must be unused and in the same condition that you received it. 
                    <em> Note: Earrings and Nose Pins are exempt from being returned due to hygiene reasons.</em>
                </p>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 5: Governing Law */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="flex items-center gap-3 mb-6">
                <Gavel size={20} className="text-[#3A4D39]" />
                <h2 className="font-serif text-2xl md:text-3xl text-[#3A4D39]">5. Governing Law</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of <strong>India</strong>.
                </p>
                <p>
                    Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in <strong>[Your City, e.g., Mumbai], India</strong>.
                </p>
            </div>
        </section>

      </div>

      {/* --- CONTACT CTA --- */}
      <div className="mt-24 text-center bg-[#F9F9F9] py-16 px-6 mx-4 md:mx-auto max-w-4xl rounded-sm">
        <h3 className="font-serif text-2xl text-[#3A4D39] mb-4">Questions about the Terms?</h3>
        <p className="text-gray-500 text-sm mb-8 max-w-lg mx-auto">
            If you have any questions regarding our Terms of Service, please contact our support team for clarification.
        </p>
        <Link 
            href="mailto:support@traayatrends.com" 
            className="inline-flex items-center justify-center gap-2 bg-[#3A4D39] text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#2A3829] transition-all shadow-lg shadow-[#3A4D39]/20"
        >
            <ShieldAlert size={16} /> Contact Support
        </Link>
      </div>

    </div>
  );
}