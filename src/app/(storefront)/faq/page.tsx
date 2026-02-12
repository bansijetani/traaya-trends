"use client";

import { useState } from "react";
import { Plus, Minus, MessageCircle, HelpCircle, ChevronDown } from "lucide-react";
import Link from "next/link";

// --- FAQ DATA ---
const faqCategories = [
  {
    title: "Orders & Shipping",
    items: [
      {
        q: "How can I track my order?",
        a: "Once your order has been dispatched, you will receive a confirmation email with a tracking number. You can also track your order directly on our 'Track Order' page using your order ID and email."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to most countries worldwide. International shipping costs are calculated at checkout based on your location and the weight of your order. Please note that customs duties may apply."
      },
      {
        q: "Can I change or cancel my order?",
        a: "We process orders quickly to ensure fast delivery. If you need to make changes, please contact our support team within 1 hour of placing your order. After this window, we cannot guarantee changes."
      }
    ]
  },
  {
    title: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 30 days of delivery. Items must be unworn, in their original condition, and in the original packaging. Personalized items are final sale."
      },
      {
        q: "How do I initiate a return?",
        a: "Log in to your account, go to 'Order History', and select the item you wish to return. Follow the prompts to generate a return label. Guests can contact care@traaya.com."
      },
      {
        q: "When will I receive my refund?",
        a: "Once we receive and inspect your return, refunds are processed within 5-7 business days to your original payment method."
      }
    ]
  },
  {
    title: "Product Care",
    items: [
      {
        q: "How do I care for my jewelry?",
        a: "Keep your jewelry dry and store it in the provided pouch when not in use. Avoid contact with perfumes, lotions, and harsh chemicals to maintain its shine."
      },
      {
        q: "Do you offer a warranty?",
        a: "Yes, all Traaya Trends pieces come with a 1-year warranty covering manufacturing defects. This does not cover normal wear and tear or accidental damage."
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
        <p className="text-gray-500 text-sm mb-8">Our dedicated client care team is available Monday to Friday, 9am - 5pm EST.</p>
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