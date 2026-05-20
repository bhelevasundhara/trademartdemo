"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  mainImage: string;
  productName: string;
}

export default function ImageGallery({ mainImage, productName }: ImageGalleryProps) {
  // Generate 5 thumbnail variations (same image, different crop params)
  const thumbnails = [
    mainImage,
    mainImage.replace("w=600", "w=200"),
    mainImage.replace("w=600", "w=300"),
    mainImage.replace("w=600", "w=400"),
    mainImage.replace("w=600", "w=500"),
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const goLeft = () => {
    setActiveIndex((prev) => (prev === 0 ? thumbnails.length - 1 : prev - 1));
  };

  const goRight = () => {
    setActiveIndex((prev) => (prev === thumbnails.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <Image
          src={thumbnails[activeIndex]}
          alt={productName}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />

        {/* Left Arrow */}
        <button
          onClick={goLeft}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full border border-[#E5E7EB] shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-[18px] h-[18px] text-gray-600" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goRight}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full border border-[#E5E7EB] shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-[18px] h-[18px] text-gray-600" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-3">
        {thumbnails.map((thumb, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-16 h-16 rounded-lg border-2 cursor-pointer overflow-hidden bg-white flex-shrink-0 ${
              i === activeIndex ? "border-[#1A56DB]" : "border-[#E5E7EB]"
            }`}
          >
            <Image
              src={thumb}
              alt={`${productName} thumbnail ${i + 1}`}
              width={64}
              height={64}
              className="object-contain p-1 w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
