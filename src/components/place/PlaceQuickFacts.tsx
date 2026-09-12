"use client";

import React from "react";
import { Mountain, Compass, Calendar, Clock, MapPin, ShieldCheck, Tag } from "lucide-react";
import { HimalayaPlace, HimalayaRegion, HimalayaSubRegion } from "@/data/atlas";

interface PlaceQuickFactsProps {
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

const TYPE_LABELS: Record<string, string> = {
  scenic: "Scenic Viewpoint & Valley",
  spiritual: "Sacred Shrine & Heritage",
  lake: "High-Altitude Glacial Lake",
  road: "Mountain Pass & Highway",
  adventure: "Alpine Activity Center",
};

export function PlaceQuickFacts({
  place,
  region,
  subRegion,
  stateSlug,
}: PlaceQuickFactsProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const facts: {
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    label: string;
    value: string;
  }[] = [];

  if (place.elevation) {
    facts.push({
      icon: Mountain,
      label: "Elevation",
      value: place.elevation,
    });
  }

  facts.push({
    icon: MapPin,
    label: "Territory & Valley",
    value: `${subRegion.name}, ${region.name}`,
  });

  if (place.coords && place.coords[0] !== 0) {
    facts.push({
      icon: Compass,
      label: "GPS Coordinates",
      value: `${place.coords[0].toFixed(4)}°N, ${place.coords[1].toFixed(4)}°E`,
    });
  }

  if (place.bestSeason) {
    facts.push({
      icon: Calendar,
      label: "Best Season",
      value: place.bestSeason,
    });
  }

  if (place.duration) {
    facts.push({
      icon: Clock,
      label: "Recommended Duration",
      value: place.duration,
    });
  }

  if (place.type) {
    facts.push({
      icon: Tag,
      label: "Classification",
      value: TYPE_LABELS[place.type] || place.type.toUpperCase(),
    });
  }

  if (place.difficulty) {
    facts.push({
      icon: ShieldCheck,
      label: "Terrain Accessibility",
      value: place.difficulty,
    });
  }

  return (
    <div className="bg-white dark:bg-[#080e1a] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-3 mb-6">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Quick Facts
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {facts.map((fact, idx) => {
          const Icon = fact.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05]"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white dark:bg-white/[0.05] shadow-sm border border-slate-200/80 dark:border-white/10"
              >
                <Icon className="w-4 h-4" style={{ color: style.accent }} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
                  {fact.label}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block leading-snug">
                  {fact.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
