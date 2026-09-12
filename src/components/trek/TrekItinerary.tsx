"use client";

import React from "react";
import { Footprints, TrendingUp, Calendar, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  elevationMeters?: number;
  distanceKm?: number;
}

interface TrekItineraryProps {
  title: string;
  itinerary: ItineraryDay[];
  stateSlug: string;
  isPatalsu?: boolean;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function TrekItinerary({
  title,
  itinerary,
  stateSlug,
  isPatalsu = false,
}: TrekItineraryProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <motion.section 
      id="itinerary" 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-24 scroll-mt-24 border-t border-slate-200/80 dark:border-foreground/[0.08]"
      aria-label={`Itinerary for ${title}`}
      aria-labelledby="journey-heading"
    >
      {/* Category Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Day-by-Day Journey
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-foreground/[0.08]" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 
            id="journey-heading"
            className="font-display font-bold text-3xl sm:text-5xl text-slate-900 dark:text-foreground tracking-tight mb-3"
          >
            Itinerary
          </h2>
          <p className="text-slate-600 dark:text-foreground/75 font-light text-base sm:text-lg max-w-2xl">
            Recommended day-by-day progression from Solang Village to the high meadows and summit ridge.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-foreground/50">
          <Calendar className="w-3.5 h-3.5" style={{ color: style.accent }} />
          <span>{itinerary.length} Day Stages</span>
        </div>
      </div>

      {/* Editorial Journey Timeline Cards */}
      <div className="space-y-6 sm:space-y-8 relative">
        <div className="hidden sm:block absolute left-8 top-12 bottom-12 w-px bg-slate-200/80 dark:bg-white/10" />

        {itinerary.map((day) => (
          <motion.div
            key={day.day}
            whileHover={shouldReduceMotion ? undefined : { y: -3, borderColor: `${style.accent}50` }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 sm:pl-24 relative bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-md"
          >
            {/* Day Number Badge */}
            <div 
              className="sm:absolute sm:left-4 sm:top-8 w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-bold text-sm text-slate-900 shadow-md mb-3 sm:mb-0"
              style={{ backgroundColor: style.accent }}
            >
              0{day.day}
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Day 0{day.day} &bull; Stage Log
                </span>

                {/* Day Metrics */}
                <div className="flex items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-300">
                  {day.elevationMeters && (
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" style={{ color: style.accent }} />
                      {day.elevationMeters.toLocaleString("en-IN")} m
                    </span>
                  )}
                  {day.distanceKm && (
                    <span className="inline-flex items-center gap-1">
                      <Footprints className="w-3 h-3 text-slate-400 dark:text-slate-400" />
                      {day.distanceKm} km
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                {day.title}
              </h3>

              <p className="text-slate-600 dark:text-slate-300 font-light text-base sm:text-lg leading-relaxed pt-1">
                {day.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 1-Day Speed Hike Alternative Card (Strictly Patalsu) */}
      {isPatalsu && (
        <motion.div 
          whileHover={shouldReduceMotion ? undefined : { borderColor: `${style.accent}40` }}
          transition={{ duration: 0.3 }}
          className="mt-8 sm:mt-10 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-100/90 dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 relative overflow-hidden shadow-sm dark:shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border inline-flex items-center gap-1"
                style={{
                  backgroundColor: `${style.accent}15`,
                  color: style.accent,
                  borderColor: `${style.accent}30`
                }}
              >
                <Zap className="w-3 h-3" />
                Endurance Alternative
              </span>
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                1-Day Alpine Speed-Hike (12–13 Hours Continuous)
              </h3>
            </div>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              For Seasoned Trail Runners &bull; +1,781m Gain
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-light text-sm leading-relaxed">
            Seasoned alpine trail runners and acclimatized hikers with high cardiovascular fitness can tackle Patalsu as a single continuous day push. Starting at <strong>5:00 AM from Solang Village</strong>, ascend through the cedar woods, clear Shagadugh meadow by mid-morning, navigate the loose scree summit ridge, and return before dusk. Carry at least 2 to 4 liters of water and high-energy trail fuel.
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}
