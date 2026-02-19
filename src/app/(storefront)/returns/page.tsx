"use client";

import { useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RefreshCw, UploadCloud, CheckCircle, AlertCircle, ArrowRight, ChevronLeft, FileText, X } from "lucide-react";

// 1. Create a sub-component to handle the search params
function ReturnForm() {
  const searchParams = useSearchParams();
  
  // Auto-fill from URL
  const urlOrderId = searchParams.get("orderId") || "";
  const urlItemName = searchParams.get("item");
  const productName = urlItemName && urlItemName !== "null" ? decodeURIComponent(urlItemName) : "";

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- NEW: File Upload State & Ref ---
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB. Please choose a smaller file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input
    }
  };
  // ------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // We use FormData because we are sending a File (video/image)
      const formData = new FormData();
      formData.append("orderId", urlOrderId);
      formData.append("productName", productName || "Unknown Item");
      
      // Get values from the DOM directly using IDs
      formData.append("email", (document.getElementById("email") as HTMLInputElement).value);
      formData.append("phone", (document.getElementById("phone") as HTMLInputElement).value);
      formData.append("reason", (document.getElementById("reason") as HTMLSelectElement).value);
      formData.append("message", (document.getElementById("message") as HTMLTextAreaElement).value);
      
      // Append the file if the user selected one
      if (file) {
        formData.append("file", file);
      }

      // Send to our new API
      const response = await fetch("/api/returns", {
        method: "POST",
        body: formData, // Do NOT set 'Content-Type' headers when sending FormData
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-serif text-3xl text-[#3A4D39] mb-4">Request Received</h2>
        <p className="text-gray-500 max-w-md mb-8">
          We have received your return request for <strong>{productName || "your item"}</strong>. 
          Our team will review your details and email you the shipping label within 24 hours.
        </p>
        <Link 
          href="/shop" 
          className="bg-[#3A4D39] text-white px-8 py-3 text-sm tracking-wider hover:bg-[#2A3829] transition-all"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6">
       {/* Back Link */}
       <Link href="/account" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#3A4D39] mb-8 transition-colors text-sm font-medium">
          <ChevronLeft size={16} /> Back to Orders
       </Link>

      <form onSubmit={handleSubmit} className="space-y-8 bg-gray-50 p-8 md:p-10 rounded-sm shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Pre-filled Info */}
        <div className="bg-white p-6 border border-gray-200 rounded-sm mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Returning Item</h3>
            <p className="font-serif text-xl text-[#3A4D39]">{productName || "Select item from Order History"}</p>
            <p className="text-sm text-gray-500 mt-1">Order #{urlOrderId}</p>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
            <input 
              required 
              type="email" 
              id="email"
              placeholder="you@example.com" 
              className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#3A4D39] transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
            <input 
              required 
              type="tel" 
              id="phone"
              placeholder="+91 98765 43210" 
              className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#3A4D39] transition-colors"
            />
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <label htmlFor="reason" className="text-xs font-bold uppercase tracking-wider text-gray-500">Reason for Return</label>
          <select 
            id="reason"
            className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#3A4D39] transition-colors appearance-none"
          >
            <option>Select a reason...</option>
            <option>Size / Fit Issue</option>
            <option>Received Damaged Item</option>
            <option>Received Wrong Item</option>
            <option>Quality Issue</option>
            <option>Changed My Mind</option>
          </select>
        </div>

        {/* Upload Section */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
            Upload Unboxing Video / Photo
            <span className="text-[10px] text-red-500 font-normal uppercase">*Required for damaged items</span>
          </span>
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="video/mp4,image/jpeg,image/png"
            className="hidden" 
          />

          {/* Conditional Rendering based on file selection */}
          {!file ? (
            <div 
              onClick={triggerFileInput}
              className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center hover:bg-white hover:border-[#3A4D39] transition-all cursor-pointer group"
            >
              <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-3 group-hover:text-[#3A4D39] transition-colors" />
              <p className="text-sm text-gray-500">Click to upload files</p>
              <p className="text-xs text-gray-400 mt-1">MP4, JPG, or PNG (Max 10MB)</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-sm p-4 flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center shrink-0 rounded border border-gray-100">
                  <FileText size={20} className="text-[#3A4D39]" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleRemoveFile}
                className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded transition-colors"
                title="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-500">Additional Comments</label>
          <textarea 
            id="message"
            rows={3} 
            className="w-full bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#3A4D39] transition-colors"
            placeholder="Please tell us more details..."
          />
        </div>

        {/* Submit Button */}
        <button 
          disabled={isLoading}
          type="submit" 
          className="w-full bg-[#3A4D39] text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#2A3829] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? "Processing..." : "Submit Return Request"}
          {!isLoading && <ArrowRight size={18} />}
        </button>

        <div className="flex items-start gap-2 text-xs text-gray-400 bg-white p-4 border border-gray-100 rounded-sm">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <p>By submitting this form, you agree to our Return Policy. Returns for earrings are not accepted due to hygiene reasons.</p>
        </div>

      </form>
    </div>
  );
}

// 2. Main Page Component
export default function ReturnsPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 md:pt-40 md:pb-32 font-sans text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-6 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-16 h-16 bg-[#3A4D39]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#3A4D39]">
            <RefreshCw size={28} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-[#3A4D39] mb-4">Initiate a Return</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
          We are sorry your piece wasn't a perfect match. Please confirm your details below.
        </p>
      </div>

      <Suspense fallback={<div className="text-center">Loading form...</div>}>
        <ReturnForm />
      </Suspense>
    </div>
  );
}