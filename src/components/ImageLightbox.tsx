"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  imageUrl: string;
  onClose: () => void;
  onNext: (e?: React.MouseEvent) => void;
  onPrev: (e?: React.MouseEvent) => void;
}

export default function ImageLightbox({ imageUrl, onClose, onNext, onPrev }: ImageLightboxProps) {
  return (
    <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out" 
        onClick={onClose}
    >
      {/* Notice the aria-labels added for SEO and Accessibility! */}
      <button 
        onClick={onClose} 
        aria-label="Close image gallery"
        className="absolute top-6 right-6 text-white/70 p-2 hover:text-white transition-colors"
      >
        <X size={32}/>
      </button>
      
      <button 
        onClick={onPrev} 
        aria-label="View previous image"
        className="absolute left-4 text-white/50 p-4 hover:text-white transition-colors"
      >
        <ChevronLeft size={48}/>
      </button>

      <div className="relative max-w-[90vw] max-h-[90vh] cursor-default" onClick={(e) => e.stopPropagation()}>
          <Image 
            src={imageUrl} 
            alt="Zoomed Jewelry Detail" 
            width={1200} 
            height={1200} 
            className="max-w-full max-h-[90vh] object-contain" 
          />
      </div>

      <button 
        onClick={onNext} 
        aria-label="View next image"
        className="absolute right-4 text-white/50 p-4 hover:text-white transition-colors"
      >
        <ChevronRight size={48}/>
      </button>
    </div>
  );
}