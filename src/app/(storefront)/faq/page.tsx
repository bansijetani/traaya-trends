"use client";

import { useState } from "react";
import { Plus, Minus, MessageCircle, HelpCircle, ChevronDown } from "lucide-react";
import Link from "next/link";

// --- FAQ DATA ---
const faqCategories = [
  {
    title: "Orders & Payments",
    items: [
      {
        q: "Do you offer Cash on Delivery (COD)?",
        a: "To ensure the fastest and most secure delivery experience, we currently accept Prepaid orders only. You can pay securely via any UPI app (GPay, PhonePe, Paytm), Credit/Debit Card, or Paypal."
      },
      {
        q: "Is my payment information safe?",
        a: "Absolutely. We use India’s leading payment gateways which are 100% secure and encrypted. We do not store your card details or banking information."
      },
      {
        q: "Can I cancel my order?",
        a: "We try to dispatch orders within 24 hours! If you need to cancel, please WhatsApp or email us within 2 hours of placing your order. Once shipped, orders cannot be canceled."
      }
    ]
  },
  {
    title: "Shipping & Delivery",
    items: [
      {
        q: "How long will my order take to arrive?",
        a: "We dispatch from our warehouse within 24 hours. Delivery typically takes 2–4 business days for Metro Cities and 4–7 business days for the Rest of India."
      },
      {
        q: "How do I track my shipment?",
        a: "As soon as your order leaves our studio, you will receive a WhatsApp and Email with your tracking link (usually via Blue Dart or Delhivery), so you can trace your package live."
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer Free Shipping on all orders above ₹1,999. For orders below this amount, a small flat shipping fee of ₹99 applies."
      }
    ]
  },
  {
    title: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a simple 14-Day Return Policy. If you are not happy with your purchase, you can return it for a full refund or store credit. The item must be unworn and in its original packaging."
      },
      {
        q: "Are there any items I cannot return?",
        a: "Yes. For hygiene reasons, Earrings and Nose Pins are Non-Returnable. Personalized or Customized jewelry is also final sale."
      },
      {
        q: "What if I receive a damaged item?",
        a: "We inspect everything 3 times! But if damage happens in transit, please send us an Unboxing Video within 48 hours of delivery. This is mandatory for us to process a free replacement for you."
      }
    ]
  },
  {
    title: "Jewelry Care & Materials",
    items: [
      {
        q: "Is your jewelry real gold?",
        a: "Our pieces are 'Demi-Fine.' They are crafted from high-quality, hypoallergenic brass or stainless steel and finished with a thick layer of 18k Gold or Rhodium plating for a luxurious look that lasts."
      },
      {
        q: "Will the polish fade?",
        a: "All plated jewelry eventually fades over time, but with proper care, ours can last for years! We recommend keeping your pieces away from water, perfumes, and sanitizers to maintain their shine."
      },
      {
        q: "Does the jewelry turn skin green?",
        a: "No. We use Nickel-Free and Lead-Free metals that are hypoallergenic and safe for sensitive skin."
      }
    ]
  }
];

// --- ACCORDION COMPONENT ---
function AccordionItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group hover:text-primary transition-colors"
      >
        <span className={`font-serif text-lg transition-colors ${isOpen ? "text-primary" : "text-[#1A1A1A]"}`}>
            {question}
        </span>
        <span className={`text-primary/50 group-hover:text-primary transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}>
            <ChevronDown size={20} strokeWidth={1.5} />
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-40 opacity-100 pb-8" : "max-h-0 opacity-0"}`}
      >
        <p className="text-gray-500 text-sm leading-relaxed pr-8">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 md:pt-40 md:pb-32 font-sans text-[#1A1A1A]">
      
      {/* --- HERO HEADER --- */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <HelpCircle size={32} strokeWidth={1} />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-primary mb-6">Frequently Asked Questions</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Find answers to common questions about our products, shipping, and policies. 
          If you can't find what you're looking for, our concierge team is here to help.
        </p>
      </div>

      {/* --- FAQ SECTIONS --- */}
      <div className="max-w-3xl mx-auto px-6 space-y-20">
        {faqCategories.map((category, idx) => (
            <div key={idx} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <h2 className="font-serif text-2xl text-primary">
                        {category.title}
                    </h2>
                </div>
                <div>
                    {category.items.map((item, i) => (
                        <AccordionItem key={i} question={item.q} answer={item.a} />
                    ))}
                </div>
            </div>
        ))}
      </div>

      {/* --- CONTACT CTA --- */}
      <div className="mt-24 text-center bg-[#F9F9F9] py-16 px-6 mx-4 md:mx-auto max-w-4xl">
        <h3 className="font-serif text-2xl text-primary mb-4">Still need assistance?</h3>
        <p className="text-gray-500 text-sm mb-8">Can't find what you're looking for? Our dedicated team is available 
            <strong> Monday to Saturday, 10 AM - 7 PM IST</strong> to help you with sizing, styling, or order queries.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-secondary transition-all shadow-lg shadow-primary/10"
            >
                <MessageCircle size={16} /> Contact Support
            </Link>
        </div>
      </div>

    </div>
  );
}