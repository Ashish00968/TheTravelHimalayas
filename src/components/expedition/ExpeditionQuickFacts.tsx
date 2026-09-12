"use client";

import React from "react";
import { Mountain, Compass, Calendar, Clock, MapPin, ShieldAlert, FileText } from "lucide-react";
import { Peak } from "@/data/types";
import { HimalayaPlace, HimalayaRegion, HimalayaSubRegion } from "@/data/atlas";

interface ExpeditionQuickFactsProps {
  place: HimalayaPlace;
  peak: Peak;
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

export function ExpeditionQuickFacts({
  place,
  peak,
  region,
  subRegion,
  stateSlug,
}: ExpeditionQuickFactsProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const heightMeters = peak.height;
  const heightFeet = Math.round(peak.height * 3.28084);
  const coords = peak.coords || place.coords;

  const facts: {
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    label: string;
    value: string;
    subValue?: string;
  }[] = [
    {
      icon: Mountain,
      label: "Summit Altitude",
      value: `${heightMeters.toLocaleString("en-IN")} m`,
      subValue: `${heightFeet.toLocaleString("en-IN")} ft (True Summit)`,
    },
    {
      icon: MapPin,
      label: "Mountain Range",
      value: peak.region || subRegion.name,
      subValue: `${region.name} Himalayas`,
    },
    {
      icon: ShieldAlert,
      label: "Technical Grade",
      value: `${peak.difficulty} Grade`,
      subValue: "Alpine Rock / Snow / Ice",
    },
    {
      icon: MapPin,
      label: "Base Camp Setting",
      value: peak.baseCamp || "Advanced Base Camp",
      subValue: "Staging Elevation",
    },
    {
      icon: Calendar,
      label: "Climbing Windows",
      value: peak.expeditionSeason || "Pre & Post Monsoon",
      subValue: "Favorable Meteorological Windows",
    },
    {
      icon: FileText,
      label: "Permit Clearance",
      value: "IMF Permitted",
      subValue: "Indian Mountaineering Foundation",
    },
  ];

  if (coords && coords[0] !== 0) {
    facts.push({
      icon: Compass,
      label: "Geographical Coordinates",
      value: `${coords[0].toFixed(4)}°N, ${coords[1].toFixed(4)}°E`,
      subValue: "WGS84 True Summit Datum",
    });
  }

  // Extract duration from peak.expeditionDetails if mentions days
  const durationMatch = peak.expeditionDetails?.match(/(\d+[-–]\d+\s+days|\d+\s+days)/i);
  if (durationMatch) {
    facts.push({
      icon: Clock,
      label: "Expedition Duration",
      value: durationMatch[0],
      subValue: "Roadhead to Summit to Roadhead",
    });
  }

  return (
    <div className="bg-[#080e1a] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Expedition Telemetry
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {facts.map((fact, idx) => {
          const Icon = fact.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-[#0d1422] border border-white/[0.08]"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/[0.05] shadow-sm border border-white/10"
              >
                <Icon className="w-4 h-4" style={{ color: style.accent }} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                  {fact.label}
                </span>
                <span className="text-sm font-semibold text-white block leading-snug">
                  {fact.value}
                </span>
                {fact.subValue && (
                  <span className="text-[11px] font-light text-slate-400 block mt-0.5">
                    {fact.subValue}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
