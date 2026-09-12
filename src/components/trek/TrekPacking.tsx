"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Backpack } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface TrekPackingProps {
  title: string;
  packingList: string[];
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function TrekPacking({
  title,
  packingList,
  stateSlug,
}: TrekPackingProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  if (!packingList || packingList.length === 0) return null;

  return (
    <motion.section 
      id="packing" 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-24 scroll-mt-24 border-t border-slate-200/90 dark:border-white/10"
      aria-label={`Packing list for ${title}`}
      aria-labelledby="packing-heading"
    >
      {/* Category Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Trail Essentials
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
        <div>
          <h2 
            id="packing-heading"
            className="font-display font-bold text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight mb-3"
          >
            What to Pack
          </h2>
          <p className="text-slate-700 dark:text-slate-300 font-light text-base sm:text-lg max-w-2xl">
            Essential gear required for {title}&apos;s steep scree, sudden temperature drops, and dry upper ridges.
          </p>
        </div>

        <Link 
          href="/plan/packing"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 flex-shrink-0 shadow-sm min-h-[44px]"
          style={{
            borderColor: `${style.accent}40`,
            color: style.accent,
            backgroundColor: `${style.accent}12`,
          }}
        >
          <Backpack className="w-3.5 h-3.5" />
          <span>Interactive Packing Generator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Essential Kit Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {packingList.map((item, idx) => (
          <motion.div 
            key={idx}
            whileHover={shouldReduceMotion ? undefined : { y: -2, borderColor: `${style.accent}40` }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-white/[0.02] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-white/10 flex items-center gap-3.5 text-sm text-slate-800 dark:text-slate-200 font-light transition-all duration-200 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-white/20"
          >
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border"
              style={{
                backgroundColor: `${style.accent}15`,
                color: style.accent,
                borderColor: `${style.accent}30`,
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="leading-snug">{item}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
