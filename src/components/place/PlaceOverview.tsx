"use client";

import React from "react";
import { Quote } from "lucide-react";
import { HimalayaPlace } from "@/data/atlas";

interface PlaceOverviewProps {
  place: HimalayaPlace;
  subRegionName: string;
  regionName: string;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function PlaceOverview({
  place,
  subRegionName,
  regionName,
  stateSlug,
}: PlaceOverviewProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const rawOverview = place.overview || "";
  const paragraphs = rawOverview
    ? rawOverview.split("\n\n").filter(Boolean)
    : [
        `${place.name} is a distinguished destination situated in the ${subRegionName} division of ${regionName}. Defined by its unique Himalayan topography and natural setting, it represents an essential point of orientation for visitors exploring this section of the range.`,
        `The surrounding geography showcases characteristic alpine features, offering direct exposure to regional mountain landscapes and traditional cultural rhythms that have shaped human settlement across these high valleys.`,
      ];

  return (
    <section id="overview" className="scroll-mt-24 space-y-8" aria-labelledby="place-overview-heading">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
            style={{ color: style.accent }}
          >
            Field Guide
          </span>
          <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
        </div>

        <h2
          id="place-overview-heading"
          className="font-display font-bold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mb-6"
        >
          About {place.name}
        </h2>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 font-light text-base sm:text-lg leading-relaxed">
          {paragraphs.map((para, idx) => (
            <p
              key={idx}
              className={
                idx === 0
                  ? "first-letter:font-display first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-slate-900 dark:first-letter:text-white"
                  : ""
              }
            >
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Field Notes & Experience Callout */}
      {place.experience && (
        <div className="relative rounded-3xl p-6 sm:p-8 bg-slate-50 dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm overflow-hidden">
          <div
            className="absolute top-0 left-0 w-1.5 h-full rounded-l-3xl"
            style={{ backgroundColor: style.accent }}
          />
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 shadow-sm"
            >
              <Quote className="w-5 h-5" style={{ color: style.accent }} />
            </div>
            <div className="flex-1">
              <span
                className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold block mb-2"
                style={{ color: style.accent }}
              >
                Field Note &amp; Atmosphere
              </span>
              <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-serif italic leading-relaxed">
                &ldquo;{place.experience}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
