"use client";

import React from "react";
import Link from "next/link";
import { Mountain, Compass, MapPin, ArrowRight } from "lucide-react";
import { getSubRegion } from "@/data/atlas";

interface ExpeditionNearbyProps {
  stateId: string;
  divisionId: string;
  currentPlaceId: string;
  subRegionName: string;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function ExpeditionNearby({
  stateId,
  divisionId,
  currentPlaceId,
  subRegionName,
  stateSlug,
}: ExpeditionNearbyProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };
  const subRegion = getSubRegion(stateId, divisionId);
  if (!subRegion) return null;

  // Filter neighboring peaks or trails, prioritize peaks first, then treks
  const otherPlaces = subRegion.places.filter((p) => p.id !== currentPlaceId);
  const peaks = otherPlaces.filter((p) => p.peakData || p.type === "peak");
  const nonPeaks = otherPlaces.filter((p) => !p.peakData && p.type !== "peak");

  const nearbyItems = [...peaks, ...nonPeaks].slice(0, 3);
  if (nearbyItems.length === 0) return null;

  return (
    <section id="expedition-nearby" className="scroll-mt-24 space-y-6" aria-labelledby="expedition-nearby-heading">
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Regional Alpine Network
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2
            id="expedition-nearby-heading"
            className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mb-2"
          >
            Neighboring Peaks &amp; Approaches in {subRegionName}
          </h2>
          <p className="text-slate-400 font-light text-sm sm:text-base">
            Nearby technical summits, glacier staging routes, and alpine valley passes.
          </p>
        </div>

        <Link
          href={`/explore/${stateId}/${divisionId}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider hover:underline flex-shrink-0"
          style={{ color: style.accent }}
        >
          <span>All {subRegionName} Massifs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {nearbyItems.map((item) => {
          const isExpedition = Boolean(item.peakData || item.type === "peak");
          const isTrek = !isExpedition && Boolean(item.trekData || item.type === "trek" || item.type === "day-hike");

          let entityBadge = "PLACE";
          let badgeColor = "bg-white/10 text-slate-300";
          let Icon = MapPin;

          if (isExpedition) {
            entityBadge = "EXPEDITION";
            badgeColor = "bg-purple-950/60 text-purple-300 border border-purple-500/30";
            Icon = Mountain;
          } else if (isTrek) {
            entityBadge = "TREK";
            badgeColor = "bg-blue-950/60 text-blue-300 border border-blue-500/30";
            Icon = Compass;
          }

          const elevation = item.elevation || item.trekData?.maxAltitude || (item.peakData?.height ? `${item.peakData.height}m` : null);

          return (
            <Link
              key={item.id}
              href={`/explore/${stateId}/${divisionId}/${item.id}`}
              className="group p-6 rounded-3xl bg-[#080e1a] border border-white/10 hover:border-white/20 transition-all shadow-2xl flex flex-col justify-between min-h-[44px]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${badgeColor}`}>
                    <Icon className="w-3 h-3" />
                    {entityBadge}
                  </span>
                  {elevation && (
                    <span className="text-[11px] font-mono text-slate-400">
                      {elevation}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-primary transition-colors mb-2">
                  {item.name}
                </h3>

                <p className="text-xs sm:text-sm font-light text-slate-400 leading-relaxed line-clamp-2">
                  {item.overview || item.experience || "Technical alpine exploration profile."}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-white transition-colors">
                <span>{isExpedition ? "Inspect Dossier" : "View Route Guide"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
