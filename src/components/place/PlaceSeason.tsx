"use client";

import React from "react";
import { Snowflake, Sun, Sprout, Wind, CheckCircle2 } from "lucide-react";
import { HimalayaPlace } from "@/data/atlas";

interface PlaceSeasonProps {
  place: HimalayaPlace;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function PlaceSeason({ place, stateSlug }: PlaceSeasonProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };
  const bestSeasonStr = (place.bestSeason || "").toLowerCase();

  const seasons = [
    {
      id: "spring",
      name: "Spring",
      months: "March – May",
      icon: Sprout,
      iconColor: "text-emerald-500 dark:text-emerald-400",
      accentBg: "bg-emerald-500/10 border-emerald-500/20",
      isRecommended: bestSeasonStr.includes("march") || bestSeasonStr.includes("april") || bestSeasonStr.includes("may") || bestSeasonStr.includes("spring"),
      accessibility: "Valley roads and lower passes open; active snowmelt on upper ridgelines.",
      landscape: "Valley orchards bloom, alpine meadows awaken from snow cover, vibrant waterfalls.",
      crowds: "Moderate; tranquil pre-season atmosphere before peak summer influx.",
      photography: "Stunning contrast of blossoming valley flora against snow-capped high peaks.",
      fieldNote: "Carry layered fleece and windproofs; afternoon showers common during seasonal transitions.",
    },
    {
      id: "summer",
      name: "Summer",
      months: "June – August",
      icon: Sun,
      iconColor: "text-amber-500 dark:text-amber-400",
      accentBg: "bg-amber-500/10 border-amber-500/20",
      isRecommended: bestSeasonStr.includes("june") || bestSeasonStr.includes("july") || bestSeasonStr.includes("august") || bestSeasonStr.includes("summer"),
      accessibility: "Maximum road and pass connectivity throughout higher Himalayan valleys.",
      landscape: "Deep alpine green valleys, roaring glacial streams, lush pine forests.",
      crowds: "Highest visitor footfall; popular viewpoints and parking hubs experience peak volume.",
      photography: "Lush dramatic cloudscapes; early mornings deliver clearest panoramic sightlines.",
      fieldNote: "Monsoon rains impact lower foothills (July–Aug); check highway landslide bulletins.",
    },
    {
      id: "autumn",
      name: "Autumn",
      months: "September – November",
      icon: Wind,
      iconColor: "text-cyan-500 dark:text-cyan-400",
      accentBg: "bg-cyan-500/10 border-cyan-500/20",
      isRecommended: bestSeasonStr.includes("september") || bestSeasonStr.includes("october") || bestSeasonStr.includes("november") || bestSeasonStr.includes("autumn"),
      accessibility: "Excellent road conditions; post-monsoon asphalt stable before winter snowfall.",
      landscape: "Deep azure skies, golden amber foliage, crisp razor-sharp mountain ridgelines.",
      crowds: "Gentle decline in tourism; optimal window for quiet, immersive field exploration.",
      photography: "Highest atmospheric clarity of the year; flawless golden hour mountain vistas.",
      fieldNote: "Temperatures drop sharply after dusk; heavy thermal wear essential by late October.",
    },
    {
      id: "winter",
      name: "Winter",
      months: "December – February",
      icon: Snowflake,
      iconColor: "text-blue-500 dark:text-blue-400",
      accentBg: "bg-blue-500/10 border-blue-500/20",
      isRecommended: bestSeasonStr.includes("december") || bestSeasonStr.includes("january") || bestSeasonStr.includes("february") || bestSeasonStr.includes("winter"),
      accessibility: "High passes closed; localized roads subject to snowplow operations after blizzards.",
      landscape: "Pristine white snowscapes, frozen waterfalls, quiet pine canopies draped in frost.",
      crowds: "Low to moderate, primarily centered around winter snow play and ski corridors.",
      photography: "Monochromatic high-contrast alpine drama; low winter sun angles create long ridge shadows.",
      fieldNote: "Sub-zero overnight chills; 4x4 vehicles with snow chains recommended on icy inclines.",
    },
  ];

  return (
    <section id="season" className="scroll-mt-24 space-y-8" aria-labelledby="place-season-heading">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
            style={{ color: style.accent }}
          >
            Seasonal Character
          </span>
          <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
          <h2
            id="place-season-heading"
            className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight"
          >
            Seasons &amp; Atmospheric Cycles
          </h2>
          {place.bestSeason && (
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              Primary Window: <strong className="text-slate-900 dark:text-white font-semibold">{place.bestSeason}</strong>
            </span>
          )}
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-light text-sm sm:text-base">
          How weather, road accessibility, light quality, and landscape character shift across the four Himalayan cycles at {place.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {seasons.map((season) => {
          const Icon = season.icon;
          return (
            <div
              key={season.id}
              className={`p-6 rounded-3xl bg-white dark:bg-[#080e1a] border transition-all duration-300 flex flex-col justify-between ${
                season.isRecommended
                  ? "border-primary/40 dark:border-primary/50 shadow-md shadow-primary/5 ring-1 ring-primary/20"
                  : "border-slate-200/90 dark:border-white/10 shadow-sm"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${season.accentBg}`}
                    >
                      <Icon className={`w-5 h-5 ${season.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white leading-tight">
                        {season.name}
                      </h3>
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {season.months}
                      </span>
                    </div>
                  </div>

                  {season.isRecommended && (
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border"
                      style={{
                        backgroundColor: `${style.accent}15`,
                        borderColor: `${style.accent}40`,
                        color: style.accent,
                      }}
                    >
                      Prime Window
                    </span>
                  )}
                </div>

                {/* Characteristics Grid */}
                <div className="space-y-2.5 text-xs sm:text-sm font-light">
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white font-medium min-w-[90px]">Landscape:</strong>
                    <span className="text-slate-600 dark:text-slate-400">{season.landscape}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white font-medium min-w-[90px]">Accessibility:</strong>
                    <span className="text-slate-600 dark:text-slate-400">{season.accessibility}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white font-medium min-w-[90px]">Photography:</strong>
                    <span className="text-slate-600 dark:text-slate-400">{season.photography}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white font-medium min-w-[90px]">Visitor Flow:</strong>
                    <span className="text-slate-600 dark:text-slate-400">{season.crowds}</span>
                  </div>
                </div>
              </div>

              {/* Field Note Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] sm:text-xs font-light text-slate-500 dark:text-slate-400 italic">
                  {season.fieldNote}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
