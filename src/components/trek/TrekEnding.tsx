"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass } from "lucide-react";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { motion, useReducedMotion } from "framer-motion";

interface TrekEndingProps {
  state: string;
  division: string;
  currentPlaceId: string;
  subRegionName: string;
  stateSlug: string;
  endingImage?: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.3)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.3)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.3)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.3)" },
};

export function TrekEnding({
  state,
  division,
  currentPlaceId,
  subRegionName,
  stateSlug,
  endingImage,
}: TrekEndingProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-5xl pt-12 sm:pt-24 border-t border-slate-200/90 dark:border-white/10">
      {/* Explore More Nearby */}
      <motion.section 
        id="explore-more" 
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="scroll-mt-24 mb-12 sm:mb-16" 
        aria-labelledby="explore-heading"
      >
        <div className="flex items-center gap-3 mb-4">
          <span 
            className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
            style={{ color: style.accent }}
          >
            Explore Nearby
          </span>
          <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
        </div>

        <h2 
          id="explore-heading"
          className="font-display font-bold text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight mb-4"
        >
          More Trails in {subRegionName}
        </h2>
        <p className="text-slate-700 dark:text-slate-300 font-light text-sm sm:text-base max-w-2xl mb-8">
          Continue your journey through neighboring valleys, glacier basins, and trails across {subRegionName}.
        </p>

        <RelatedContent stateId={state} divisionId={division} currentPlaceId={currentPlaceId} hideHeading={true} />
      </motion.section>

      {/* Final Cinematic Sunset Plate & Closing Call */}
      <motion.section 
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl overflow-hidden mb-16 sm:mb-20 shadow-2xl border border-slate-200/90 dark:border-white/10 group dark-photo-card preserve-white-text"
        aria-label="Expedition Horizon Call"
      >
        {endingImage ? (
          <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] w-full min-h-[360px] sm:min-h-[400px]">
            <Image
              src={endingImage}
              alt={`${subRegionName} sunset mountain panorama`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040812] via-[#040812]/65 to-black/30" />
          </div>
        ) : (
          <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] w-full min-h-[360px] sm:min-h-[400px] bg-[#080e1a] overflow-hidden">
            {/* Ambient territory glow */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[650px] h-[400px] rounded-full blur-[120px] opacity-25"
              style={{ background: style.glow || style.accent }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(4,8,18,0.2)_0%,rgba(4,8,18,0.85)_100%)]" />
          </div>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-end p-6 sm:p-12 text-center">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-white/80 block mb-2 sm:mb-3">
            The Himalayas Are Waiting
          </span>
          <h3 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] mb-5 sm:mb-6 drop-shadow-xl">
            Where will your next trail begin?
          </h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href={`/explore/${state}/${division}`}
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-xl hover:scale-105 min-h-[44px]"
              style={{
                backgroundColor: style.accent,
                color: stateSlug === "himachal-pradesh" ? "#000000" : "#FFFFFF",
              }}
            >
              <span>Explore All {subRegionName} Trails</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest font-semibold border border-white/20 text-white hover:bg-white/10 transition-all bg-black/40 backdrop-blur-md min-h-[44px]"
            >
              <Compass className="w-4 h-4" />
              <span>Himalayan Atlas</span>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
