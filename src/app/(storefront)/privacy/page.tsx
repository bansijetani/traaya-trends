import Link from "next/link";
import { Lock, Shield, Eye, FileText, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 md:pt-40 md:pb-32 font-sans text-[#1A1A1A]">
      
      {/* --- HERO HEADER --- */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <Lock size={28} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-primary mb-6">Privacy Policy</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Your privacy is the ultimate luxury. We are dedicated to safeguarding your personal information 
          and ensuring your experience with Traaya Trends is secure, transparent, and trusted.
        </p>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-6">
            Last Updated: February 2026
        </p>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-3xl mx-auto px-6 space-y-16">
        
        {/* Section 1 */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="flex items-center gap-3 mb-6">
                <Eye size={20} className="text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-primary">1. Information We Collect</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    We collect personal information that you voluntarily provide to us when you register on the website, 
                    place an order, subscribe to our newsletter, or contact us.
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                    <li><strong>Identity Data:</strong> Name, username, or similar identifiers.</li>
                    <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
                    <li><strong>Financial Data:</strong> Payment card details (processed securely via third-party gateways; we do not store full card details).</li>
                    <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products you have purchased from us.</li>
                </ul>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 2 */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-3 mb-6">
                <FileText size={20} className="text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-primary">2. How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    We use the information we collect to provide, maintain, and improve our services, including:
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                    <li>Processing and fulfilling your orders, including sending emails to confirm your order status and shipment.</li>
                    <li>Communicating with you about new collections, offers, and exclusive events (only if you have opted in).</li>
                    <li>Screening our orders for potential risk or fraud.</li>
                    <li>Improving and optimizing our site (for example, by generating analytics about how our customers browse and interact with the Site).</li>
                </ul>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 3 */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="flex items-center gap-3 mb-6">
                <Shield size={20} className="text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-primary">3. Sharing Your Information</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    We respect your privacy and will never sell your personal data to third parties. 
                    However, we share your Personal Information with third parties to help us use your Personal Information, as described above.
                </p>
                <p>
                    For example, we use <strong>Stripe</strong> to process payments and <strong>Google Analytics</strong> to help us understand how our customers use the Site. 
                    We may also share your information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
                </p>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 4 */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <h2 className="font-serif text-2xl md:text-3xl text-primary mb-6">4. Cookies & Tracking</h2>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits, and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.
                </p>
                <p>
                    You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings.
                </p>
            </div>
        </section>

      </div>

      {/* --- CONTACT CTA --- */}
      <div className="mt-24 text-center bg-[#F9F9F9] py-16 px-6 mx-4 md:mx-auto max-w-4xl">
        <h3 className="font-serif text-2xl text-primary mb-4">Questions about your data?</h3>
        <p className="text-gray-500 text-sm mb-8 max-w-lg mx-auto">
            If you would like to access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information contact our Privacy Officer.
        </p>
        <Link 
            href="mailto:privacy@traaya.com" 
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-lg shadow-primary/10"
        >
            <Mail size={16} /> Contact Privacy Officer
        </Link>
      </div>

    </div>
  );
}