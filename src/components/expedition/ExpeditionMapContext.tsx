"use client";

import React from "react";
import Link from "next/link";
import { Map, ArrowRight } from "lucide-react";
import { Peak } from "@/data/types";
import { HimalayaPlace } from "@/data/atlas";
import { TopoMiniMap } from "@/components/maps/TopoMiniMap";

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
      {/* Category Marker */}
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Cartographic Inspection
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2
            id="expedition-map-heading"
            className="font-display font-bold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight leading-snug"
          >
            3D Elevation &amp; Topographic Profile
          </h2>
          <p className="text-slate-600 dark:text-slate-300 font-light text-sm sm:text-base leading-relaxed max-w-2xl mt-1">
            Examine {peak.title}&apos;s glaciated valleys, lateral moraines, and summit arêtes in interactive cartography and 3D satellite mesh.
          </p>
        </div>

        <Link
          href={`/map?focus=${place.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 flex-shrink-0 shadow-xs"
          style={{
            borderColor: `${style.accent}40`,
            color: style.accent,
            backgroundColor: `${style.accent}12`,
          }}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Full 3D Atlas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Universal Topographic Mini-Map with On-Demand 3D Satellite Mesh */}
      <TopoMiniMap
        placeName={peak.title}
        placeSlug={place.id}
        coords={coords}
        startPoint={peak.baseCamp || `${peak.title} Base Camp`}
        maxAltitude={`${heightMeters.toLocaleString("en-IN")} m`}
        distance="Alpine Traversal"
        accentColor={style.accent}
        stateSlug={stateSlug}
        bestSeason={peak.expeditionSeason}
      />
    </section>
  );
}
