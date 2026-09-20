"use client";

import React from "react";
import { Calendar, TrendingUp, Navigation } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  elevationMeters?: number;
  distanceKm?: number;
}

interface PlaceItineraryProps {
  title: string;
  itinerary: ItineraryDay[];
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function PlaceItinerary({
  title,
  itinerary,
  stateSlug,
}: PlaceItineraryProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#0D9488" };

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <motion.section
      id="itinerary"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-24 space-y-8"
      aria-label={`Itinerary for ${title}`}
      aria-labelledby="place-itinerary-heading"
    >
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Curated Route
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2
            id="place-itinerary-heading"
            className="font-display font-bold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mb-3"
          >
            Day-by-Day Circuit Itinerary
          </h2>
          <p className="text-slate-600 dark:text-slate-300 font-light text-base sm:text-lg max-w-2xl">
            Detailed daily progression, key landmarks, spiritual halts, and altitude milestones along the circuit.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.05] px-3.5 py-1.5 rounded-full border border-slate-200/60 dark:border-white/10">
          <Calendar className="w-3.5 h-3.5" style={{ color: style.accent }} />
          <span>{itinerary.length} Days Itinerary</span>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6 relative">
        <div className="hidden sm:block absolute left-8 top-10 bottom-10 w-px bg-slate-200/80 dark:bg-white/10" />

        {itinerary.map((day) => (
          <div
            key={day.day}
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 sm:pl-24 relative bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20"
          >
            {/* Day Number Badge */}
            <div
              className="sm:absolute sm:left-4 sm:top-7 w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs text-white shadow-md mb-3 sm:mb-0"
              style={{ backgroundColor: style.accent }}
            >
              {day.day < 10 ? `0${day.day}` : day.day}
            </div>

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                  Day {day.day}: {day.title}
                </h3>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                  {day.elevationMeters && (
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      {day.elevationMeters.toLocaleString()} m
                    </span>
                  )}
                  {day.distanceKm && (
                    <span className="inline-flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-amber-500" />
                      {day.distanceKm} km
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm font-light text-slate-700 dark:text-slate-300 leading-relaxed">
                {day.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
