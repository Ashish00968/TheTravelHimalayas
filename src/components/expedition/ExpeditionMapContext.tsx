"use client";

import React from "react";
import Link from "next/link";
import { Map, ArrowRight, Compass } from "lucide-react";
import { Peak } from "@/data/types";
import { HimalayaPlace } from "@/data/atlas";

interface ExpeditionMapContextProps {
  place: HimalayaPlace;
  peak: Peak;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.3)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.3)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.3)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.3)" },
};

export function ExpeditionMapContext({
  place,
  peak,
  stateSlug,
}: ExpeditionMapContextProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.3)",
  };

  const coords = peak.coords || place.coords;
  const heightMeters = peak.height;

  return (
    <section id="expedition-map" className="scroll-mt-24 space-y-6" aria-labelledby="expedition-map-heading">
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Cartographic Inspection
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-[#080e1a] to-[#040812] text-white border border-white/15 shadow-2xl overflow-hidden group dark-photo-card preserve-white-text">
        {/* Subtle Map Grid Motif */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: style.glow }} />

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-semibold text-white">
              <Compass className="w-3.5 h-3.5" style={{ color: style.accent }} />
              High-Precision 3D Digital Elevation Mesh
            </span>
            {coords && coords[0] !== 0 && (
              <span className="text-xs font-mono text-slate-400">
                {coords[0].toFixed(4)}°N, {coords[1].toFixed(4)}°E
              </span>
            )}
            <span className="text-xs font-mono text-sky-300 font-bold">
              {heightMeters.toLocaleString("en-IN")}m Summit
            </span>
          </div>

          <h3
            id="expedition-map-heading"
            className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight leading-snug"
          >
            Explore the Mountain in 3D
          </h3>

          <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed">
            Examine {peak.title}&apos;s glaciated valleys, lateral moraines, bergschrund crossings, and exposed summit arêtes in full 3D satellite mesh exploration.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href={`/map?focus=${place.id}`}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg min-h-[44px] group/btn"
            >
              <Map className="w-4 h-4 text-slate-950" />
              <span>Launch 3D Mountain Mesh</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <span className="text-xs font-mono text-slate-400 self-center">
              Direct O(1) geospatial camera focus
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
