"use client";

import React from "react";
import { Peak } from "@/data/types";

interface ExpeditionProfileProps {
  peak: Peak;
  regionName: string;
  subRegionName: string;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function ExpeditionProfile({
  peak,
  regionName,
  subRegionName,
  stateSlug,
}: ExpeditionProfileProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const rawOverview = peak.overview || "";
  const paragraphs = rawOverview.split("\n\n").filter(Boolean);

  return (
    <section id="mountain-profile" className="scroll-mt-24 space-y-6" aria-labelledby="mountain-profile-heading">
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Mountain Profile
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <h2
        id="mountain-profile-heading"
        className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight"
      >
        The Mountain: {peak.title}
      </h2>
      <p className="text-slate-400 font-mono text-xs uppercase tracking-wider">
        {subRegionName}, {regionName} Range
      </p>

      <div className="space-y-4 text-slate-300 font-light text-base sm:text-lg leading-relaxed">
        {paragraphs.map((para, idx) => (
          <p
            key={idx}
            className={
              idx === 0
                ? "first-letter:font-display first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-white"
                : ""
            }
          >
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}
