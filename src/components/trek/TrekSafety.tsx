"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall, Hospital } from "lucide-react";
import { GoldenRulesCallout } from "@/components/shared/GoldenRulesCallout";
import { motion, useReducedMotion } from "framer-motion";

interface TrekSafetyProps {
  title: string;
  maxAltitude: string;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function TrekSafety({
  title,
  maxAltitude,
  stateSlug,
}: TrekSafetyProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  return (
    <motion.section 
      id="safety" 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-24 scroll-mt-24 border-t border-slate-200/80 dark:border-foreground/[0.08]"
      aria-label={`Safety and medical protocols for ${title}`}
      aria-labelledby="safety-heading"
    >
      {/* Category Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Altitude &amp; Emergency
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-foreground/[0.08]" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 
            id="safety-heading"
            className="font-display font-bold text-3xl sm:text-5xl text-slate-900 dark:text-foreground tracking-tight mb-3"
          >
            Safety
          </h2>
          <p className="text-slate-600 dark:text-foreground/75 font-light text-base sm:text-lg max-w-2xl">
            Climbing above 3,000 meters requires physiological discipline, gradual ascent staging, and active hydration.
          </p>
        </div>

        <Link
          href="/safety"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider hover:underline flex-shrink-0 min-h-[44px]"
          style={{ color: style.accent }}
        >
          <span>Full Mountain Medicine Manual</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* The Three Golden Rules of Altitude Safety Directive */}
      <div className="mb-6">
        <GoldenRulesCallout maxAltitude={maxAltitude} />
      </div>

      {/* Clean Local Emergency Contact Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/90 dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Hospital className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 block">Nearest Major Facility</span>
            <span className="font-display font-bold text-sm text-slate-900 dark:text-white">Civil Hospital Manali (14 km from Solang)</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/90 dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 block">Emergency Rescue Dispatch</span>
            <span className="font-display font-bold text-sm text-slate-900 dark:text-white">Himalayan SAR: Dial 112 &bull; HP Police 1077</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
