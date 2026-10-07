"use client";

import React, { useState } from "react";
import { Mountain, Trees, ShieldAlert, Droplets, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

interface TrekAboutProps {
  title: string;
  overview: string;
  routeDescription?: string;
  startPoint?: string;
  stateSlug: string;
  subRegionName?: string;
  isPatalsu?: boolean;
  isJogni?: boolean;
  breadcrumbItems?: { label: string; href: string }[];
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
  isJogni = false,
  breadcrumbItems,
}: TrekAboutProps) {
  const [showFullDossier, setShowFullDossier] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.2)",
  };

  const paragraphs = overview.split("\n\n").filter(Boolean);
  
  // Concise, high-impact executive lead (shortened for aesthetics, enriched for SEO)
  const executiveLead = isJogni
    ? "A sacred 150-foot cascading cataract plunging down sheer granite cliffs in the Kullu Valley above Vashisht village, 4 km from Manali. Revered as the sanctuary of village Jogini deities, the 3.2 km trail ascends through fragrant deodar woods and apple orchards to an alpine amphitheater drenched in roaring glacial spray."
    : isPatalsu
    ? "Rising directly above Solang Valley, Patalsu Peak (4,261m) is Manali’s premier non-technical 4,000-meter trekking peak. The relentless +1,781m vertical ascent climbs through ancient deodar woods and Shagadugh meadows before tackling the wind-scoured scree ridge opposite Hanuman Tibba."
    : paragraphs[0] || overview;

  const extendedLore = isJogni || isPatalsu ? paragraphs : paragraphs.slice(1);

  // Key highlights tags
  const highlights = isJogni
    ? [
        { label: "150-Ft Vertical Cataract", icon: "🌊" },
        { label: "Ancient Deodar Woods", icon: "🌲" },
        { label: "Sacred Jogini Shrine", icon: "🕉️" },
        { label: "Vashisht Hot Springs Combo", icon: "♨️" },
        { label: "Pir Panjal Vista", icon: "🏔️" },
      ]
    : isPatalsu
    ? [
        { label: "4,261m Summit Pinnacle", icon: "⛰️" },
        { label: "Shagadugh Meadow (3,250m)", icon: "🌿" },
        { label: "Ancient Solang Forests", icon: "🌲" },
        { label: "Hanuman Tibba Face Views", icon: "🧊" },
        { label: "1-Day Ultra Speed Hike", icon: "⚡" },
      ]
    : [
        { label: "Alpine Wilderness", icon: "⛰️" },
        { label: "Verified GPS Track", icon: "🧭" },
        { label: "Himalayan Ridge", icon: "🌲" },
      ];

  return (
    <motion.section 
      id="about" 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-5xl pt-12 sm:pt-20 pb-12 scroll-mt-24"
      aria-label={`About the ${title}`}
    >
      {/* Clean Contextual Breadcrumbs */}
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <div className="mb-6 opacity-75 hover:opacity-100 transition-opacity">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      )}

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
      <h2 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-slate-900 dark:text-foreground tracking-tight leading-[1.08] mb-6">
        About {title}
      </h2>

      {/* Punchy Executive Summary (Replaces long, boring paragraph blocks) */}
      <div className="mb-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none">
        <p className="text-slate-800 dark:text-slate-200 font-normal text-base sm:text-lg md:text-xl leading-relaxed">
          {executiveLead}
        </p>

        {/* Highlights Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-5 mt-5 border-t border-slate-100 dark:border-white/5">
          {highlights.map((h, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5"
            >
              <span>{h.icon}</span>
              <span>{h.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Expandable Deep Route Dossier (Preserves 100% SEO Text Without Visual Clutter) */}
      {(routeDescription || extendedLore.length > 0) && (
        <div className="mb-10">
          <button
            onClick={() => setShowFullDossier(!showFullDossier)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-semibold transition-all bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white border border-slate-200/80 dark:border-white/10 min-h-[44px]"
            aria-expanded={showFullDossier}
          >
            {showFullDossier ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Hide Extended Route Dossier</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Read Detailed Route Dossier &amp; Terrain Lore</span>
              </>
            )}
          </button>

          <AnimatePresence>
            {showFullDossier && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden mt-4"
              >
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 space-y-4 text-slate-700 dark:text-slate-300 font-light text-sm sm:text-base leading-relaxed">
                  {extendedLore.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}

                  {routeDescription && (
                    <div className="pt-4 border-t border-slate-200/80 dark:border-white/10">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider block mb-2" style={{ color: style.accent }}>
                        Terrain Progression &bull; Starting from {startPoint.split("(")[0].trim()}
                      </span>
                      <p className="whitespace-pre-line text-sm leading-relaxed">{routeDescription}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 3 Pillars of the Trail (Short, Scannable Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200/80 dark:border-white/10">
        {isJogni ? (
          <>
            <motion.div 
              whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <Droplets className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Lower Cascade Pools (2,170m)</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                Crystal glacial meltwater rushing violently over mossy granite boulders beneath shady pine groves.
              </p>
            </motion.div>

            <motion.div 
              whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <Mountain className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Upper Amphitheater (2,280m)</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                The majestic 150-foot vertical cataract crashing into its natural rock basin amidst thunderous glacial spray.
              </p>
            </motion.div>

            <motion.div 
              whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <Heart className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Sacred Pahadi Heritage</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                Revered sanctuary of village Joginis where local Pahadi tradition preserves sacred waters and zero-litter trail ethics.
              </p>
            </motion.div>
          </>
        ) : isPatalsu ? (
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
