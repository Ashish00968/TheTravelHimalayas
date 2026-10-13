"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Map, ArrowRight, Download } from "lucide-react";
import { Peak } from "@/data/types";
import { HimalayaPlace } from "@/data/atlas";
import { TopoMiniMap } from "@/components/maps/TopoMiniMap";
import { getRouteData } from "@/data/routes";

function RouteMap3DSkeleton() {
  return (
    <div className="w-full h-[540px] rounded-3xl bg-slate-900/60 animate-pulse flex items-center justify-center border border-white/10">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          Loading 3D Terrain Mesh...
        </span>
      </div>
    </div>
  );
}

const RouteMap3D = dynamic(
  () => import("@/components/maps/RouteMap3D"),
  {
    ssr: false,
    loading: () => <RouteMap3DSkeleton />,
  }
);

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
  const routeData = getRouteData(place.id);

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

      {/* Render Interactive 3D Terrain Mesh if verified RouteData exists, otherwise TopoMiniMap */}
      {routeData ? (
        <RouteMap3D
          routeData={routeData}
          placeName={peak.title}
          placeSlug={place.id}
          maxAltitude={`${heightMeters.toLocaleString("en-IN")} m`}
          distance={`${routeData.stats.distanceKm} km`}
          accentColor={style.accent}
        />
      ) : (
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
      )}

      {/* Verified GPX Download Block for Peak Expeditions */}
      {routeData && (
        <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-100/90 dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Verified Technical GPX Track
              </span>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Garmin &amp; GPS Watch Trace ({routeData.stats.distanceKm} km • {routeData.stats.pointCount} points)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
                Ground-surveyed approach, high camps, and summit ridge with WGS 84 datum. Ready for Garmin, Coros, Gaia GPS, and OsmAnd.
              </p>
            </div>
            <a
              href={`/gpx/dht-${place.id}.gpx`}
              download={`dht-${place.id}-expedition.gpx`}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 shadow-md flex-shrink-0"
              style={{ backgroundColor: style.accent }}
            >
              <Download className="w-4 h-4" />
              <span>Download GPX</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

