import Link from "next/link";
import { Scale, FileText, AlertCircle, ShieldAlert, Gavel } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 md:pt-40 md:pb-32 font-sans text-[#1A1A1A]">
      
      {/* --- HERO HEADER --- */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <Scale size={28} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-primary mb-6">Terms of Service</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Welcome to Traaya Trends. By accessing or using our website, you agree to be bound by the following terms and conditions. 
          Please read them carefully before making a purchase.
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
                <FileText size={20} className="text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-primary">1. Overview</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    This website is operated by Traaya Trends. Throughout the site, the terms “we”, “us” and “our” refer to Traaya Trends. 
                    We offer this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
                </p>
                <p>
                    By visiting our site and/ or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions (“Terms of Service”, “Terms”), including those additional terms and conditions and policies referenced herein.
                </p>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 2: Online Store Terms */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <h2 className="font-serif text-2xl md:text-3xl text-primary mb-6">2. Online Store Terms</h2>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                    <li>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence.</li>
                    <li>You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</li>
                    <li>You must not transmit any worms or viruses or any code of a destructive nature.</li>
                    <li>A breach or violation of any of the Terms will result in an immediate termination of your Services.</li>
                </ul>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 3: Products & Pricing */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="flex items-center gap-3 mb-6">
                <AlertCircle size={20} className="text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-primary">3. Modifications to Service & Prices</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                </p>
                <p>
                    We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service.
                </p>
                <p>
                    We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
                </p>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 4: Accuracy of Billing */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <h2 className="font-serif text-2xl md:text-3xl text-primary mb-6">4. Accuracy of Billing & Account Information</h2>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. 
                    These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address.
                </p>
                <p>
                    You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.
                </p>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 5: Governing Law */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="flex items-center gap-3 mb-6">
                <Gavel size={20} className="text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-primary">5. Governing Law</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the United States.
                </p>
            </div>
        </section>

      </div>

      {/* --- CONTACT CTA --- */}
      <div className="mt-24 text-center bg-[#F9F9F9] py-16 px-6 mx-4 md:mx-auto max-w-4xl">
        <h3 className="font-serif text-2xl text-primary mb-4">Questions about the Terms?</h3>
        <p className="text-gray-500 text-sm mb-8 max-w-lg mx-auto">
            If you have any questions regarding our Terms of Service, please contact our legal team for clarification.
        </p>
        <Link 
            href="mailto:legal@traaya.com" 
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-lg shadow-primary/10"
        >
            <ShieldAlert size={16} /> Contact Legal Team
        </Link>
      </div>

    </div>
  );
}