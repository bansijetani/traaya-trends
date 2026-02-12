import Link from "next/link";
import { Truck, RefreshCcw, ShieldCheck, Clock, MapPin, Globe } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 md:pt-40 md:pb-32 font-sans text-[#1A1A1A]">
      
      {/* --- HERO HEADER --- */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="font-serif text-4xl md:text-6xl text-primary mb-6">Shipping & Returns</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          At Traaya Trends, we are committed to ensuring your experience is seamless from purchase to delivery. 
          Read our policies below to understand how we handle shipping, returns, and exchanges.
        </p>
      </div>

      {/* --- QUICK HIGHLIGHTS GRID --- */}
      <div className="max-w-[1200px] mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#F9F9F9] p-8 md:p-10 text-center border border-transparent hover:border-gray-200 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-sm">
                    <Truck size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">Free Shipping</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Complimentary standard shipping on all domestic orders over $200.
                </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F9F9F9] p-8 md:p-10 text-center border border-transparent hover:border-gray-200 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-sm">
                    <Clock size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">Fast Processing</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Orders are processed and dispatched within 1-2 business days.
                </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F9F9F9] p-8 md:p-10 text-center border border-transparent hover:border-gray-200 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-primary shadow-sm">
                    <RefreshCcw size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-primary mb-3">Easy Returns</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    30-day return policy for all unworn items in original packaging.
                </p>
            </div>
        </div>
      </div>

      {/* --- DETAILED CONTENT --- */}
      <div className="max-w-3xl mx-auto px-6 space-y-16">
        
        {/* Section 1: Shipping */}
        <section>
            <div className="flex items-center gap-3 mb-6">
                <Globe size={20} className="text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-primary">Shipping Policy</h2>
            </div>
            <div className="space-y-6 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    We ship worldwide. All orders are processed Monday through Friday, excluding holidays. 
                    Orders placed on weekends will be processed the following business day.
                </p>
                
                <h4 className="font-bold text-primary text-xs uppercase tracking-widest mt-6 mb-2">Domestic Shipping (USA)</h4>
                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                    <li><strong>Standard (5-7 business days):</strong> $10 or Free for orders over $200</li>
                    <li><strong>Express (2-3 business days):</strong> $25</li>
                    <li><strong>Overnight (1 business day):</strong> $45</li>
                </ul>

                <h4 className="font-bold text-primary text-xs uppercase tracking-widest mt-6 mb-2">International Shipping</h4>
                <p>
                    International shipping rates are calculated at checkout based on destination and weight. 
                    Please note that duties and taxes are the responsibility of the customer and may be collected at delivery.
                </p>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 2: Returns */}
        <section>
            <div className="flex items-center gap-3 mb-6">
                <RefreshCcw size={20} className="text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-primary">Returns & Exchanges</h2>
            </div>
            <div className="space-y-6 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    We want you to love your Traaya Trends purchase. If for any reason you are not satisfied, 
                    we accept returns within <strong>30 days</strong> of the delivery date.
                </p>
                
                <div className="bg-red-50 p-6 border border-red-100 rounded-sm">
                    <h4 className="font-bold text-red-800 text-xs uppercase tracking-widest mb-3">Condition of Items</h4>
                    <p className="text-red-700 text-sm">
                        Items must be returned unworn, unwashed, and in their original packaging with all tags attached. 
                        Jewelry must have no signs of wear or scratches. Returns that do not meet these criteria will be refused.
                    </p>
                </div>

                <h4 className="font-bold text-primary text-xs uppercase tracking-widest mt-6 mb-2">How to Initiate a Return</h4>
                <ol className="list-decimal pl-5 space-y-2 marker:text-primary font-medium">
                    <li>Log in to your account and go to "Order History".</li>
                    <li>Select the order you wish to return.</li>
                    <li>Click "Request Return" and follow the instructions to print your label.</li>
                    <li>Pack your items securely and drop off the package at the nearest courier location.</li>
                </ol>
            </div>
        </section>

        <div className="border-t border-gray-100"></div>

        {/* Section 3: Damaged Items */}
        <section>
            <div className="flex items-center gap-3 mb-6">
                <ShieldCheck size={20} className="text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-primary">Damaged or Defective Items</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base text-gray-500 leading-loose">
                <p>
                    We carefully inspect every piece before it leaves our warehouse. However, if you receive a damaged 
                    or defective item, please contact us within <strong>48 hours</strong> of delivery.
                </p>
                <p>
                    Please email <a href="mailto:care@traaya.com" className="text-primary underline">care@traaya.com</a> with 
                    your order number and clear photos of the damage. We will arrange a replacement or refund immediately.
                </p>
            </div>
        </section>

      </div>

      {/* --- CONTACT CTA --- */}
      <div className="mt-24 text-center">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">Still have questions?</p>
        <Link 
            href="/contact" 
            className="inline-block bg-primary text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all"
        >
            Contact Support
        </Link>
      </div>

    </div>
  );
}