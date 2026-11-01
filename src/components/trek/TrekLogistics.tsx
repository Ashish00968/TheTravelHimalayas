"use client";

import React from "react";
import { 
  Car, 
  ShieldCheck, 
  Coins, 
  Home, 
  Signal, 
  Droplets, 
  Activity, 
  Bookmark 
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { HimalayaPlace } from "@/data/atlas/types";

interface TrekLogisticsProps {
  place: HimalayaPlace;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.2)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.2)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.2)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.2)" },
};

export function TrekLogistics({ place, stateSlug }: TrekLogisticsProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6", glow: "rgba(59,130,246,0.2)" };

  const trek = place.trekData;
  const howToReach = place.howToReach || trek?.howToReach;
  const permitsAndFees = place.permitsAndFees || trek?.permitsAndFees;
  const costRange = place.costRange || trek?.costRange;
  const stays = place.stays || trek?.stays;
  const networkAndATM = place.networkAndATM || trek?.networkAndATM;
  const waterPoints = place.waterPoints || trek?.waterPoints;
  const fitnessPrep = place.fitnessPrep || trek?.fitnessPrep;
  const authorNote = place.authorNote || trek?.authorNote;

  // STRICT ZERO-BOX GATING: If no logistical fields are populated, render nothing.
  const hasAnyData = Boolean(
    howToReach ||
    permitsAndFees ||
    costRange ||
    stays ||
    networkAndATM ||
    waterPoints ||
    fitnessPrep ||
    authorNote
  );

  if (!hasAnyData) {
    return null;
  }

  const cards = [
    howToReach ? {
      icon: Car,
      title: "Transit & How to Reach",
      subtext: "Roadhead Access",
      content: howToReach,
    } : null,
    permitsAndFees ? {
      icon: ShieldCheck,
      title: "Permits & Fees",
      subtext: "Forestry & Local Formalities",
      content: permitsAndFees,
    } : null,
    costRange ? {
      icon: Coins,
      title: "Estimated Cost Range",
      subtext: "Self-Guided & Expedition",
      content: costRange,
    } : null,
    stays ? {
      icon: Home,
      title: "Stays & Camps",
      subtext: "Homestays & Huts",
      content: stays,
    } : null,
    networkAndATM ? {
      icon: Signal,
      title: "Network & ATM Access",
      subtext: "Connectivity Checkpoints",
      content: networkAndATM,
    } : null,
    waterPoints ? {
      icon: Droplets,
      title: "Water Sources",
      subtext: "Glacial Streams & Springs",
      content: waterPoints,
    } : null,
    fitnessPrep ? {
      icon: Activity,
      title: "Fitness Preparation",
      subtext: "Physical Conditioning",
      content: fitnessPrep,
    } : null,
  ].filter(Boolean) as {
    icon: React.ElementType;
    title: string;
    subtext: string;
    content: string;
  }[];

  return (
    <motion.section
      id="logistics"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-20 scroll-mt-24 border-t border-slate-200/80 dark:border-white/10"
      aria-labelledby="logistics-heading"
    >
      {/* Category Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Operational Intelligence
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      {/* Heading */}
      <div className="mb-8 sm:mb-10">
        <h2
          id="logistics-heading"
          className="font-display font-bold text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight mb-3"
        >
          Trail Logistics &amp; Approach
        </h2>
        <p className="text-slate-600 dark:text-slate-300 font-light text-base sm:text-lg max-w-2xl">
          Field-verified facts on transit, local permits, cellular reception, and practical trail logistics for {place.name}.
        </p>
      </div>

      {/* Bento Grid: Only renders cards with populated data */}
      {cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center border shrink-0"
                        style={{
                          backgroundColor: `${style.accent}15`,
                          color: style.accent,
                          borderColor: `${style.accent}30`,
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        {card.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                      {card.subtext}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-light text-sm sm:text-base leading-relaxed">
                    {card.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Author Field Note (if populated) */}
      {authorNote && (
        <div
          className="rounded-2xl sm:rounded-3xl p-6 sm:p-7 border relative overflow-hidden bg-slate-50 dark:bg-white/[0.02]"
          style={{ borderColor: `${style.accent}40` }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 mt-0.5"
              style={{
                backgroundColor: `${style.accent}18`,
                color: style.accent,
                borderColor: `${style.accent}40`,
              }}
            >
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-2">
                Trail tip
              </h3>
              <p className="text-slate-700 dark:text-slate-300 font-light text-sm sm:text-base leading-relaxed italic">
                &ldquo;{authorNote}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
