"use client";

import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface TrekFieldNotesProps {
  title: string;
  tips?: string[];
  permits?: string;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function TrekFieldNotes({
  title,
  tips,
  permits,
  stateSlug,
}: TrekFieldNotesProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  return (
    <section 
      id="tips" 
      className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-24 scroll-mt-24 border-t border-slate-200/80 dark:border-foreground/[0.08]"
      aria-label={`Trail tips for ${title}`}
      aria-labelledby="tips-heading"
    >
      {/* Category Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Trail Advice
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-foreground/[0.08]" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 
            id="tips-heading"
            className="font-display font-bold text-3xl sm:text-5xl text-slate-900 dark:text-foreground tracking-tight mb-3"
          >
            Trail Tips
          </h2>
          <p className="text-slate-600 dark:text-foreground/75 font-light text-base sm:text-lg max-w-2xl">
            Practical advice on water, loose scree, timing, and route navigation directly from the trail.
          </p>
        </div>
      </div>

      {/* Structured Field Observation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-10">
        {tips && tips.length > 0 ? (
          tips.map((tip, idx) => (
            <div
              key={idx}
              className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none flex items-start gap-3.5 sm:gap-4"
            >
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border"
                style={{
                  backgroundColor: `${style.accent}15`,
                  color: style.accent,
                  borderColor: `${style.accent}30`,
                }}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-light text-sm sm:text-base leading-relaxed">
                {tip}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none flex items-start gap-3.5 sm:gap-4">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: style.accent }} />
            <p className="text-slate-700 dark:text-slate-200 font-light text-base leading-relaxed">
              Standard alpine precautions apply. Maintain early morning departures to avoid afternoon convective cloud cover and wind shifts.
            </p>
          </div>
        )}
      </div>

      {/* Permits & Formalities Note */}
      {permits && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-100/90 dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 flex items-start gap-3.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: style.accent }} />
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block mb-1">
              Trail Permits &amp; Forestry Regulations
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-light leading-relaxed">
              {permits}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
