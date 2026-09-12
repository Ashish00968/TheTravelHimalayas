"use client";

import React from "react";
import Link from "next/link";
import { Compass, Map, ArrowRight, Mountain } from "lucide-react";
import { HimalayaPlace } from "@/data/atlas";

interface PlaceMapContextProps {
  place: HimalayaPlace;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.25)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.25)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.25)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.25)" },
};

export function PlaceMapContext({
  place,
  stateSlug,
}: PlaceMapContextProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.25)",
  };

  const coords = place.coords;
  const hasCoords = Boolean(coords && coords[0] !== 0);

  return (
    <section id="map-context" className="scroll-mt-24 space-y-6" aria-labelledby="place-map-heading">
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Cartography &amp; Geospatial
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-[#080e1a] to-[#040812] text-white border border-white/10 shadow-2xl overflow-hidden group dark-photo-card preserve-white-text">
        {/* Topographic Line SVG Background Motif */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: style.glow }} />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-semibold text-white">
              <Compass className="w-3.5 h-3.5" style={{ color: style.accent }} />
              Himalayan 3D Geospatial Atlas
            </span>
            {hasCoords && coords && (
              <span className="text-xs font-mono text-slate-400">
                {coords[0].toFixed(4)}°N, {coords[1].toFixed(4)}°E
              </span>
            )}
            {place.elevation && (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-300">
                <Mountain className="w-3.5 h-3.5 text-slate-400" />
                {place.elevation}
              </span>
            )}
          </div>

          <h3
            id="place-map-heading"
            className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight leading-snug"
          >
            Explore {place.name} on 3D Terrain
          </h3>

          <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed">
            Inspect the topography, surrounding ridges, river valleys, and neighboring mountain passes in an interactive, satellite-rendered 3D elevation mesh.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href={`/map?focus=${place.id}`}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg min-h-[44px] group/btn"
            >
              <Map className="w-4 h-4 text-slate-950" />
              <span>Launch 3D Explorer</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <span className="text-xs font-mono text-slate-400 self-center">
              Zero-latency vector &amp; satellite render
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
