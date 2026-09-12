"use client";

import React from "react";
import { Car, Footprints, CalendarClock, AlertTriangle, ShieldCheck } from "lucide-react";
import { HimalayaPlace, HimalayaSubRegion, HimalayaRegion } from "@/data/atlas";
import { MountainWeatherWidget } from "@/components/shared/MountainWeatherWidget";

interface PlaceAccessProps {
  place: HimalayaPlace;
  region: HimalayaRegion;
  subRegion: HimalayaSubRegion;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function PlaceAccess({
  place,
  region,
  subRegion,
  stateSlug,
}: PlaceAccessProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  return (
    <section id="access" className="scroll-mt-24 space-y-8" aria-labelledby="place-access-heading">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
            style={{ color: style.accent }}
          >
            Access &amp; Logistics
          </span>
          <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
        </div>

        <h2
          id="place-access-heading"
          className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight mb-2"
        >
          Reaching {place.name}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-light text-sm sm:text-base">
          Practical approach guidelines, road accessibility, and high-altitude meteorological conditions in {subRegion.name}, {region.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Access Guidelines */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08]"
              >
                <Car className="w-4 h-4" style={{ color: style.accent }} />
              </div>
              <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                Roadhead &amp; Approach Transit
              </h3>
            </div>
            <p className="text-sm font-light text-slate-700 dark:text-slate-300 leading-relaxed">
              Accessible via the road network of {subRegion.name}, connecting through major Himalayan arteries. Local taxi unions and state transport operate seasonal schedules depending on weather clearance.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08]"
              >
                <Footprints className="w-4 h-4" style={{ color: style.accent }} />
              </div>
              <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                Trail &amp; Walking Requirement
              </h3>
            </div>
            <p className="text-sm font-light text-slate-700 dark:text-slate-300 leading-relaxed">
              {place.type === "road" || place.type === "scenic"
                ? "Direct vehicular access is generally available to main viewpoints, with light walks required to explore adjoining ridgelines and village lanes."
                : "A modest walk or well-marked trail leads to the primary destination. Sturdy footwear is recommended on rocky steps and loose gravel surfaces."}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08]"
              >
                <CalendarClock className="w-4 h-4" style={{ color: style.accent }} />
              </div>
              <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                Seasonal Window &amp; Snow Clearance
              </h3>
            </div>
            <p className="text-sm font-light text-slate-700 dark:text-slate-300 leading-relaxed">
              Best visited during {place.bestSeason || "summer and autumn months"}. High-altitude sections may experience heavy winter snowfall, temporarily closing vehicle access between December and March.
            </p>
          </div>
        </div>

        {/* Right Column: Live Mountain Weather Widget */}
        <div>
          {place.coords && place.coords[0] !== 0 ? (
            <div className="space-y-4">
              <MountainWeatherWidget
                coords={place.coords}
                locationName={place.name}
              />
              <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/25 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-light text-slate-700 dark:text-slate-300 leading-relaxed">
                  Mountain weather can change rapidly. Check local administration updates and avalanche warnings during active precipitation.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 flex flex-col items-center justify-center text-center h-full min-h-[260px]">
              <ShieldCheck className="w-10 h-10 mb-3" style={{ color: style.accent }} />
              <h4 className="font-display font-semibold text-slate-900 dark:text-white mb-1">
                Regional Safety &amp; Access
              </h4>
              <p className="text-xs font-light text-slate-600 dark:text-slate-400 max-w-sm">
                Ensure offline navigation is downloaded before setting out into remote valleys where cellular reception may be intermittent.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
