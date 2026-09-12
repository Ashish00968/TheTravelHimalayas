"use client";

import React from "react";
import { TrendingUp, ArrowUp } from "lucide-react";
import { ElevationProfile } from "@/components/shared/ElevationProfile";
import { motion, useReducedMotion } from "framer-motion";

interface TrekElevationProps {
  title: string;
  itinerary: { day: number; title: string; description: string; elevationMeters?: number; distanceKm?: number }[];
  maxAltitude: string;
  startPoint?: string;
  stateSlug: string;
  isPatalsu?: boolean;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function TrekElevation({
  title,
  itinerary,
  maxAltitude,
  startPoint = "Base Trailhead",
  stateSlug,
  isPatalsu = false,
}: TrekElevationProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const midCampTitle = isPatalsu
    ? "Shagadugh • 3,250 m"
    : itinerary.length > 1 && itinerary[Math.floor(itinerary.length / 2)]?.elevationMeters
    ? `${itinerary[Math.floor(itinerary.length / 2)].elevationMeters} m • ${itinerary[Math.floor(itinerary.length / 2)].title.split(":")[0].trim()}`
    : "Mid-Elevation Stage";

  return (
    <motion.section 
      id="elevation" 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-24 scroll-mt-24 border-t border-slate-200/80 dark:border-foreground/[0.08]"
      aria-labelledby="climb-heading"
    >
      {/* Category Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Altitude Profile
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-foreground/[0.08]" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 
            id="climb-heading"
            className="font-display font-bold text-3xl sm:text-5xl text-slate-900 dark:text-foreground tracking-tight mb-3"
          >
            Elevation
          </h2>
          <p className="text-slate-600 dark:text-foreground/75 font-light text-base sm:text-lg max-w-2xl">
            {isPatalsu
              ? "Vertical elevation profile from Solang Valley (2,480m) to the 4,261-meter summit crest."
              : `Vertical elevation profile from ${startPoint} to the ${maxAltitude} summit crest.`}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-600 dark:text-foreground/60">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-foreground/[0.04] border border-slate-200/80 dark:border-foreground/[0.08] shadow-sm">
            <TrendingUp className="w-3.5 h-3.5" style={{ color: style.accent }} />
            <span>Summit: <strong className="text-slate-900 dark:text-foreground">{maxAltitude}</strong></span>
          </div>
        </div>
      </div>

      {/* Visual Elevation Profile Component */}
      {itinerary.length > 0 && (
        <div className="mb-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm dark:shadow-xl border border-slate-200/80 dark:border-white/10">
          <ElevationProfile itinerary={itinerary} />
        </div>
      )}

      {/* Accessible Text Alternative for Elevation Milestones */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-100/90 dark:bg-[#080e1a]/80 border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-inner">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 mb-4 flex items-center gap-2">
          <ArrowUp className="w-3.5 h-3.5" style={{ color: style.accent }} />
          {isPatalsu ? "Elevation Milestones • +1,781m Vertical Climb" : `Elevation Milestones • ${maxAltitude} Apex`}
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/10 shadow-xs dark:shadow-none">
            <dt className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Base Trailhead</dt>
            <dd className="text-slate-900 dark:text-white font-bold text-sm mt-0.5">{startPoint}</dd>
          </div>
          <div className="p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/10 shadow-xs dark:shadow-none">
            <dt className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">
              {isPatalsu ? "High Meadow Camp" : "Mid-Trail Stage"}
            </dt>
            <dd className="text-slate-900 dark:text-white font-bold text-sm mt-0.5">{midCampTitle}</dd>
          </div>
          <div className="p-3.5 rounded-xl sm:rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/10 shadow-xs dark:shadow-none">
            <dt className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Apex Summit Marker</dt>
            <dd className="font-bold text-sm mt-0.5" style={{ color: style.accent }}>{title} &bull; {maxAltitude}</dd>
          </div>
        </dl>
      </div>
    </motion.section>
  );
}
