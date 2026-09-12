"use client";

import React from "react";
import Link from "next/link";
import { Map, MapPin, Navigation, ArrowUpRight, Compass } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface TrekRouteMapProps {
  title: string;
  slug: string;
  coords?: [number, number];
  pathCoords?: [number, number][];
  startPoint?: string;
  maxAltitude: string;
  distance: string;
  regionName: string;
  subRegionName: string;
  stateSlug: string;
  isPatalsu?: boolean;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.2)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.2)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.2)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.2)" },
};

export function TrekRouteMap({
  title,
  slug,
  coords,
  pathCoords,
  startPoint = "Trailhead Entry",
  maxAltitude,
  distance,
  regionName,
  subRegionName,
  stateSlug,
  isPatalsu = false,
}: TrekRouteMapProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6", glow: "rgba(59,130,246,0.2)" };

  const waypointCount = pathCoords?.length || 0;
  const hasCoordinates = Boolean(coords && coords[0] !== 0);

  return (
    <motion.section 
      id="route" 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-24 scroll-mt-24 border-t border-slate-200/80 dark:border-foreground/[0.08]"
      aria-labelledby="route-heading"
    >
      {/* Category Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Trail Navigation
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-foreground/[0.08]" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 
            id="route-heading"
            className="font-display font-bold text-3xl sm:text-5xl text-slate-900 dark:text-foreground tracking-tight mb-3"
          >
            The Route
          </h2>
          <p className="text-slate-600 dark:text-foreground/75 font-light text-base sm:text-lg max-w-2xl">
            Trailhead coordinates, navigation milestones, and geospatial profile connecting {startPoint} to the summit crest.
          </p>
        </div>

        {/* Secondary link to 3D Atlas */}
        <Link
          href={`/map?focus=${slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 flex-shrink-0 shadow-sm dark:shadow-lg min-h-[44px]"
          style={{
            borderColor: `${style.accent}40`,
            color: style.accent,
            backgroundColor: `${style.accent}12`,
          }}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Inspect 3D Satellite Mesh</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Key Route Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {/* Milestone 1: Starting Point */}
        <motion.div 
          whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
        >
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" style={{ color: style.accent }} />
            <span>Starting Point</span>
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
            {startPoint}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs font-light">
            {isPatalsu
              ? `${subRegionName}, ${regionName} • Trailhead Access (14 km from Manali)`
              : `${subRegionName}, ${regionName} • Trailhead Access`}
          </p>
        </motion.div>

        {/* Milestone 2: Summit Crest */}
        <motion.div 
          whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
        >
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" style={{ color: style.accent }} />
            <span>Summit Crest</span>
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
            {title} ({maxAltitude})
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs font-light">
            {isPatalsu
              ? "360° vistas of Pir Panjal, Dhauladhar & Hanuman Tibba"
              : `Panoramic vistas from ${title} across ${subRegionName}`}
          </p>
        </motion.div>

        {/* Milestone 3: GPS Coordinates */}
        <motion.div 
          whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
        >
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider mb-2">
            <Navigation className="w-3.5 h-3.5" style={{ color: style.accent }} />
            <span>GPS Coordinates</span>
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1 font-mono">
            {hasCoordinates ? `${coords![0].toFixed(4)}° N, ${coords![1].toFixed(4)}° E` : "32.3547° N, 77.1939° E"}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs font-light font-mono">
            {waypointCount > 0 ? `${waypointCount} verified trail waypoints` : "Mapped trail route"}
          </p>
        </motion.div>
      </div>

      {/* Geospatial Map Visual Representation Banner */}
      <motion.div 
        whileHover={shouldReduceMotion ? undefined : { borderColor: `${style.accent}40` }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 dark:from-[#080e1a] dark:to-[#040812] border border-slate-800 dark:border-white/10 shadow-xl dark:shadow-2xl transition-all preserve-white-text dark-photo-card"
      >
        <div className="relative z-10 max-w-xl">
          <span 
            className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full border inline-block mb-3"
            style={{
              backgroundColor: `${style.accent}15`,
              color: style.accent,
              borderColor: `${style.accent}30`,
            }}
          >
            Topological Route
          </span>
          <h3 className="font-display font-bold text-2xl text-white mb-2">
            {isPatalsu
              ? `Ridge Traversal Profile • ${distance}`
              : `Trail Traversal Profile • ${distance}`}
          </h3>
          <p className="text-white/80 font-light text-sm leading-relaxed mb-6">
            {isPatalsu
              ? "The route leaves the Solang riverbed, follows ancient stone goat trails through the oak forest, ascends the wide Shagadugh saddle, and traces the sharp northern shale arête directly to the summit cairn."
              : `The trail departs from ${startPoint.split("(")[0].trim()}, ascending steadily through the alpine geography of ${subRegionName} toward the high altitude elevation marker at ${maxAltitude}.`}
          </p>
          <div className="flex items-center gap-4 flex-wrap text-xs font-mono text-white/70">
            <span>&bull; Trailhead: {isPatalsu ? "Solang Village (2,480m)" : startPoint.split("(")[0].trim()}</span>
            {isPatalsu && <span>&bull; Mid Camp: Shagadugh (3,250m)</span>}
            <span>&bull; High Point: {maxAltitude}</span>
          </div>
        </div>

        {/* Ambient Map Grid Watermark Effect */}
        <div className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8 opacity-20 pointer-events-none text-white font-mono text-[10px] space-y-1">
          <div>LAT: {hasCoordinates ? coords![0].toFixed(4) : "32.3547"} N</div>
          <div>LON: {hasCoordinates ? coords![1].toFixed(4) : "77.1939"} E</div>
          <div>DATUM: WGS 84</div>
        </div>
      </motion.div>
    </motion.section>
  );
}
