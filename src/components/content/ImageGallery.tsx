"use client";

import { useState } from "react";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-[4/3] rounded-lg overflow-hidden group"
          >
            <CloudinaryImage
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </button>
        ))}
      </div>
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-label="Image lightbox"
        >
          <div className="relative w-full max-w-4xl aspect-[16/10]">
            <CloudinaryImage
              src={images[selectedIndex]}
              alt={`${alt} ${selectedIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
          <button
            className="absolute top-4 right-4 text-foreground text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(null);
            }}
            aria-label="Close lightbox"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
