"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";

interface ImageGalleryProps {
  images?: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const close = useCallback(() => setSelectedIndex(null), []);
  const prev = useCallback(
    () => setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    []
  );
  const next = useCallback(
    () =>
      setSelectedIndex((i) =>
        i !== null && images && i < images.length - 1 ? i + 1 : i
      ),
    [images]
  );

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, close, prev, next]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        {images.map((image, index) => (
          <motion.button
            key={index}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { duration: 0.5 },
              },
            }}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary border border-white/10"
            aria-label={`View ${alt} photo ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </motion.button>
        ))}
      </motion.div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} image viewer`}
        >
          <div
            className="relative w-full max-w-5xl aspect-[16/10]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex]}
              alt={`${alt} ${selectedIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={close}
            aria-label="Close image viewer"
          >
            <X className="w-5 h-5" />
          </button>

          {selectedIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {selectedIndex < images.length - 1 && (
            <button
              className="absolute right-16 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60 bg-black/60 px-4 py-1.5 rounded-full border border-white/10 font-mono">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
