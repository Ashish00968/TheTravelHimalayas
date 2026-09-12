"use client";

import React from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

interface TrekPhotoMomentProps {
  imageSrc: string;
  alt: string;
  captionTitle: string;
  captionDescription: string;
  elevationBadge?: string;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function TrekPhotoMoment({
  imageSrc,
  alt,
  captionTitle,
  captionDescription,
  elevationBadge,
  stateSlug,
}: TrekPhotoMomentProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  return (
    <section className="w-full my-16 sm:my-24" aria-label="Cinematic Expedition Moment">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Full-width Photograph Frame */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[21/10] max-h-[680px] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/10 group">
          <Image
            src={imageSrc}
            alt={alt}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
          />
          {/* Subtle bottom gradient to highlight photo details */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Inline Image Tag */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold uppercase tracking-widest text-white">
              <Camera className="w-3 h-3" style={{ color: style.accent }} />
              Expedition Plate
            </span>
            {elevationBadge && (
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold tracking-widest text-white/90">
                {elevationBadge}
              </span>
            )}
          </div>
        </div>

        {/* Editorial Photo Essay Caption Below Image */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 px-2">
          <div className="max-w-2xl">
            <h3 className="font-display font-bold text-lg sm:text-xl text-foreground mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.accent }} />
              {captionTitle}
            </h3>
            <p className="text-foreground/70 font-light text-sm sm:text-base leading-relaxed">
              {captionDescription}
            </p>
          </div>

          <div className="sm:text-right flex-shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/40 block">
              Field Observation
            </span>
            <span className="text-xs font-mono font-semibold text-foreground/70">
              Kullu &bull; Dhauladhar Range
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
