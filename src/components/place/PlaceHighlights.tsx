"use client";

import React from "react";
import { CheckCircle2, Camera, Mountain, Sun } from "lucide-react";
import { HimalayaPlace } from "@/data/atlas";

interface PlaceHighlightsProps {
  place: HimalayaPlace;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function PlaceHighlights({
  place,
  stateSlug,
}: PlaceHighlightsProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  // Use place.tips if available, or generate verified highlights based on place properties
  const customTips = place.tips && place.tips.length > 0 ? place.tips : null;

  const defaultHighlights = [
    {
      icon: Mountain,
      title: "Alpine Landscape & Setting",
      description: `Perched at ${place.elevation || "mid-Himalayan elevation"}, offering expansive vistas of glaciated ridges and seasonal valley vegetation.`,
    },
    {
      icon: Sun,
      title: "Best Exploration Timing",
      description: `Optimal conditions occur during ${place.bestSeason || "the primary travel season"}, when mountain roads and viewing corridors remain accessible.`,
    },
    {
      icon: Camera,
      title: "Photographic Vantage Points",
      description: "Early morning golden hour offers optimal atmospheric clarity across surrounding snow peaks before thermal cloud cover builds.",
    },
  ];

  return (
    <section id="highlights" className="scroll-mt-24 space-y-6" aria-labelledby="place-highlights-heading">
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Landscape &amp; Highlights
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      <h2
        id="place-highlights-heading"
        className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
      >
        Key Place Highlights &amp; Field Notes
      </h2>

      {customTips ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm flex items-start gap-3.5 group hover:border-slate-300 dark:hover:border-white/20 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08]"
              >
                <CheckCircle2 className="w-4 h-4" style={{ color: style.accent }} />
              </div>
              <p className="text-sm font-light text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                {tip}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {defaultHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm space-y-3"
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 shadow-sm"
                >
                  <Icon className="w-5 h-5" style={{ color: style.accent }} />
                </div>
                <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm font-light text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
