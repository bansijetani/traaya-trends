import Link from "next/link";
import { Lock, Shield, Eye, FileText, Mail, Server, Globe } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 md:pt-40 md:pb-32 font-sans text-[#1A1A1A]">
      
      {/* --- HERO HEADER --- */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 bg-[#3A4D39]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#3A4D39]">
            <Lock size={28} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-[#3A4D39] mb-6">Privacy Policy</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          At Traaya Trends, your trust is our most valuable asset. We are committed to protecting your personal information 
          and complying with the Information Technology Act, 2000 (India). This policy outlines how we handle your data with the utmost care.
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
                <Eye size={20} className="text-[#3A4D39]" />
                <h2 className="font-serif text-2xl md:text-3xl text-[#3A4D39]">1. Information We Collect</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    We collect personal information that you voluntarily provide to us when you register, 
                    place an order, or contact our support team. This includes:
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-[#3A4D39]">
                    <li><strong>Identity Data:</strong> First name, last name, and username.</li>
                    <li><strong>Contact Data:</strong> Delivery address, billing address, email address, and mobile number (crucial for delivery coordination).</li>
                    <li><strong>Financial Data:</strong> We do <strong>not</strong> store your credit/debit card numbers or UPI PINs. All payments are processed securely via trusted third-party gateways (like Razorpay, PhonePe, or Paytm).</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, and device information to help us optimize your shopping experience.</li>
                </ul>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 2 */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-3 mb-6">
                <FileText size={20} className="text-[#3A4D39]" />
                <h2 className="font-serif text-2xl md:text-3xl text-[#3A4D39]">2. How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    We use your data solely to provide and improve our services, including:
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-[#3A4D39]">
                    <li>Processing your order and managing delivery logistics.</li>
                    <li>Sending you order updates via Email, SMS, or WhatsApp.</li>
                    <li>Responding to your customer service requests.</li>
                    <li>Detecting and preventing fraud or abuse of our services.</li>
                    <li>Sending you marketing communications about new arrivals (only if you have opted in).</li>
                </ul>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 3 */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="flex items-center gap-3 mb-6">
                <Globe size={20} className="text-[#3A4D39]" />
                <h2 className="font-serif text-2xl md:text-3xl text-[#3A4D39]">3. Sharing with Third Parties</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    We respect your privacy and will never sell your personal data. However, we share necessary data with trusted partners to fulfill your order:
                </p>
                <ul className="list-disc pl-5 space-y-2 marker:text-[#3A4D39]">
                    <li><strong>Logistics Partners:</strong> We share your name, address, and phone number with courier partners (e.g., Blue Dart, Delhivery) to ensure successful delivery.</li>
                    <li><strong>Payment Gateways:</strong> Securely transmitting payment data to process your transaction.</li>
                    <li><strong>Legal Compliance:</strong> We may disclose information if required by Indian law or legal process.</li>
                </ul>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 4 */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <div className="flex items-center gap-3 mb-6">
                <Server size={20} className="text-[#3A4D39]" />
                <h2 className="font-serif text-2xl md:text-3xl text-[#3A4D39]">4. Cookies & Security</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    <strong>Cookies:</strong> We use cookies to remember your shopping cart and understand your preferences. You can choose to turn off cookies through your browser settings, though some site features may not function properly.
                </p>
                <p>
                    <strong>Data Security:</strong> We implement appropriate technical and security measures to protect your data. Our website is scanned regularly for security holes and all sensitive information is transmitted via Secure Socket Layer (SSL) technology.
                </p>
            </div>
        </section>

      </div>

      {/* --- CONTACT CTA --- */}
      <div className="mt-24 text-center bg-[#F9F9F9] py-16 px-6 mx-4 md:mx-auto max-w-4xl rounded-sm">
        <h3 className="font-serif text-2xl text-[#3A4D39] mb-4">Questions about your data?</h3>
        <p className="text-gray-500 text-sm mb-8 max-w-lg mx-auto">
            If you would like to access, correct, or delete any personal information we have about you, or simply want more information, please contact our Privacy Officer.
        </p>
        <Link 
            href="mailto:support@traayatrends.com" 
            className="inline-flex items-center justify-center gap-2 bg-[#3A4D39] text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#2A3829] transition-all shadow-lg shadow-[#3A4D39]/20"
        >
            <Mail size={16} /> Contact Privacy Team
        </Link>
      </div>

    </div>
  );
}