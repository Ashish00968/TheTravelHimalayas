"use client";

import React from "react";
import { Mountain, Trees, ShieldAlert } from "lucide-react";

import { motion, useReducedMotion } from "framer-motion";

interface TrekAboutProps {
  title: string;
  overview: string;
  routeDescription?: string;
  startPoint?: string;
  stateSlug: string;
  subRegionName?: string;
  isPatalsu?: boolean;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.2)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.2)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.2)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.2)" },
};

export function TrekAbout({
  title,
  overview,
  routeDescription,
  startPoint = "Base Trailhead",
  stateSlug,
  subRegionName,
  isPatalsu = false,
}: TrekAboutProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.2)",
  };

  const paragraphs = overview.split("\n\n").filter(Boolean);
  const firstParagraph = paragraphs[0] || overview;
  const remainingParagraphs = paragraphs.slice(1);

  return (
    <motion.section 
      id="about" 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-5xl pt-16 sm:pt-28 pb-12 scroll-mt-24"
      aria-label={`About the ${title}`}
    >
      {/* Category Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Trail Introduction
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-foreground/[0.08]" />
      </div>

      {/* Main Section Heading */}
      <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-slate-900 dark:text-foreground tracking-tight leading-[1.08] mb-8">
        About {title}
      </h2>

      {/* Editorial Lead Paragraph with Drop Cap */}
      <div className="mb-8 text-slate-800 dark:text-slate-100 font-light text-xl sm:text-2xl md:text-[25px] leading-relaxed">
        <p>
          <span 
            className="float-left text-5xl sm:text-6xl font-display font-bold mr-3.5 mt-1 leading-none"
            style={{ color: style.accent }}
          >
            {firstParagraph.charAt(0)}
          </span>
          {firstParagraph.slice(1)}
        </p>
      </div>

      {/* Narrative Continuation */}
      {remainingParagraphs.length > 0 && (
        <div className="space-y-6 text-slate-600 dark:text-slate-300 font-light text-base sm:text-lg leading-relaxed max-w-3xl mb-12">
          {remainingParagraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      )}

      {/* Route & Terrain Character */}
      {routeDescription && (
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-slate-100/90 dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 text-slate-700 dark:text-slate-200 font-light text-sm sm:text-base leading-relaxed space-y-3 shadow-sm dark:shadow-inner">
          <span className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: style.accent }}>
            Terrain Progression &bull; Starting from {startPoint.split("(")[0].trim()}
          </span>
          <p className="whitespace-pre-line">{routeDescription}</p>
        </div>
      )}

      {/* 3 Pillars of the Trail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200/80 dark:border-white/10">
        {isPatalsu ? (
          <>
            <motion.div 
              whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <Trees className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Dense Cedar Forest</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                Ascends through ancient deodar, pine, and birch groves directly above Solang Village, where cattle graze in sunlit glades.
              </p>
            </motion.div>

            <motion.div 
              whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <Mountain className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Shagadugh Meadow</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                At 3,250m, the timberline breaks into sweeping alpine pastures with panoramic vistas of the Solang basin and Dhauladhar crest.
              </p>
            </motion.div>

            <motion.div 
              whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <ShieldAlert className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">The Exposed Scree Ridge</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                The final 1,000m climb traverses narrow wind-blasted shale and loose rock directly opposite the colossal face of Hanuman Tibba (5,982m).
              </p>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div 
              whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <Trees className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Trailhead Approach</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                Commences from {startPoint.split("(")[0].trim()}, following established mountain corridors through valley topography.
              </p>
            </motion.div>

            <motion.div 
              whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <Mountain className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Alpine Progression</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                Rises steadily into open mountain zones with panoramic vantages across {subRegionName || "the surrounding range"}.
              </p>
            </motion.div>

            <motion.div 
              whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <ShieldAlert className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">High Vantage &amp; Crest</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                Reaches high elevation vantage points where disciplined alpine pacing and weather awareness ensure a safe journey.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </motion.section>
  );
}
