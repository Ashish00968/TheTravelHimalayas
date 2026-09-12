"use client";

import React from "react";
import { Calendar, Sun, CloudRain, Wind, Snowflake } from "lucide-react";
import { MountainWeatherWidget } from "@/components/shared/MountainWeatherWidget";
import { motion, useReducedMotion } from "framer-motion";

interface TrekSeasonProps {
  title: string;
  bestSeason: string;
  coords?: [number, number];
  subRegionName: string;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function TrekSeason({
  title,
  bestSeason,
  coords,
  subRegionName,
  stateSlug,
}: TrekSeasonProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const seasons = [
    {
      icon: Sun,
      season: "Summer & Spring Snow (May – June)",
      badge: "Spring Greenery & Snow",
      description: "Lush meadows in Shagadugh, pleasant daytime temperatures (12°C to 18°C), with crisp snow patches on the high summit crest — ideal for snow Manali treks.",
      status: "Prime Season",
    },
    {
      icon: CloudRain,
      season: "Monsoon (July – August)",
      badge: "Early Departures",
      description: "Dense pine woodland is vibrant and green. Convective clouds gather by early afternoon; 5:00 AM alpine departures are critical to summit safely.",
      status: "Feasible with Care",
    },
    {
      icon: Wind,
      season: "Post-Monsoon / Autumn (Sept – Oct)",
      badge: "Optimal Clarity",
      description: "Crisp, transparent atmosphere with sharpest panoramic visibility of Hanuman Tibba and Dhauladhar ranges. Ideal window for speed hiking.",
      status: "Best Window",
      highlight: true,
    },
    {
      icon: Snowflake,
      season: "Winter (Nov – April)",
      badge: "Heavy Snow Pack",
      description: "Upper meadows and ridge buried under heavy snow drifts. Snow trekking to Shagadugh (3,250m) is accessible; summit push requires winter mountaineering equipment.",
      status: "Winter Snow Trek",
    },
  ];

  return (
    <motion.section 
      id="season" 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-24 scroll-mt-24 border-t border-slate-200/80 dark:border-foreground/[0.08]"
      aria-labelledby="season-heading"
    >
      {/* Chapter Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Seasonal Guide
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-foreground/[0.08]" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 
            id="season-heading"
            className="font-display font-bold text-3xl sm:text-5xl text-slate-900 dark:text-foreground tracking-tight mb-3"
          >
            Best Time to Trek
          </h2>
          <p className="text-slate-600 dark:text-foreground/75 font-light text-base sm:text-lg max-w-2xl">
            Seasonal climatic cycles across {subRegionName}, from spring snow crossings in May to crystalline autumn skies in October.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-foreground/60">
          <Calendar className="w-3.5 h-3.5" style={{ color: style.accent }} />
          <span>Optimal Window: <strong className="text-slate-900 dark:text-foreground">{bestSeason}</strong></span>
        </div>
      </div>

      {/* 4 Seasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-12">
        {seasons.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={idx}
              whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 border transition-all duration-300 ${
                s.highlight
                  ? "bg-white dark:bg-[#0d1422] border-amber-400/50 dark:border-amber-400/40 shadow-sm dark:shadow-[0_10px_30px_rgba(245,158,11,0.08)]"
                  : "bg-white dark:bg-[#080e1a] border-slate-200/90 dark:border-white/10 shadow-xs dark:shadow-none"
              }`}
              style={s.highlight ? { borderTopColor: style.accent, borderTopWidth: 2 } : undefined}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: style.accent }} />
                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {s.season}
                  </h3>
                </div>
                <span 
                  className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold border ${
                    s.highlight 
                      ? "" 
                      : "bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.08]"
                  }`}
                  style={{
                    backgroundColor: s.highlight ? `${style.accent}20` : undefined,
                    color: s.highlight ? style.accent : undefined,
                    borderColor: s.highlight ? `${style.accent}40` : undefined,
                  }}
                >
                  {s.status}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-light text-sm leading-relaxed">
                {s.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Discreet Live Mountain Weather Widget */}
      {coords && coords[0] !== 0 && (
        <div className="mt-8 pt-8 border-t border-slate-200/90 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
              Live Meteorological Telemetry &bull; Open-Meteo Satellite
            </span>
            <span className="font-mono text-[10px] text-slate-500 dark:text-foreground/50">
              Station Lat: {coords[0].toFixed(2)}&deg;, Lon: {coords[1].toFixed(2)}&deg;
            </span>
          </div>
          <MountainWeatherWidget coords={coords} locationName={title} />
        </div>
      )}
    </motion.section>
  );
}
