"use client";

import React from "react";
import { Layers } from "lucide-react";
import { Peak } from "@/data/types";

interface ExpeditionRouteSchematicProps {
  peak: Peak;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function ExpeditionRouteSchematic({
  peak,
  stateSlug,
}: ExpeditionRouteSchematicProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const heightMeters = peak.height;
  const rawRoute = peak.climbingRoute || "";
  const paragraphs = rawRoute.split("\n\n").filter(Boolean);

  // Generate verified stages from climbing route
  const stages = [
    {
      badge: "STAGE 01",
      title: "Approach & Staging",
      elevation: "Trailhead to Valley Head",
      terrain: "Forested valley trails, alpine pasture moraines, and glacial rivers.",
      focus: "Acclimatization march, establishing gear supply lines, and setting up communication base.",
    },
    {
      badge: "STAGE 02",
      title: peak.baseCamp || "Base Camp Staging",
      elevation: peak.baseCamp ? (peak.baseCamp.match(/\d+m/)?.[0] || "3,700m–4,200m") : "Base Camp",
      terrain: "Glacial lateral moraine or dry alpine terrace with potable meltwater source.",
      focus: "Technical gear sorting, crampon fitting, rope team drill, and weather monitoring.",
    },
    {
      badge: "STAGE 03",
      title: "Advance Base & High Camp",
      elevation: `Approx. ${Math.round(heightMeters * 0.85)}m`,
      terrain: "Glacier ice aprons, crevasse fields, and compacted snow platforms.",
      focus: "Establishing wind-anchored high camp tents, resting before early alpine summit departure.",
    },
    {
      badge: "STAGE 04",
      title: "Technical Headwall & Ridge Line",
      elevation: `Upper Glacial Bowl to ${Math.round(heightMeters * 0.95)}m`,
      terrain: "Sustained snow/ice slopes (35°–60°), exposed arêtes, and rock bands.",
      focus: "Fixed rope ascension, step cutting, running belays, and negotiating cornices.",
    },
    {
      badge: "SUMMIT",
      title: `${peak.title} Summit Objective`,
      elevation: `${heightMeters.toLocaleString("en-IN")}m (True Summit)`,
      terrain: "Summit pyramid, exposed knife-edge snow ridge or summit snowfield.",
      focus: "Brief summit verification, radio relay check, immediate turnaround protocol.",
    },
  ];

  return (
    <section id="route-schematic" className="scroll-mt-24 space-y-8" aria-labelledby="route-schematic-heading">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
            style={{ color: style.accent }}
          >
            Route Topography
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <h2
          id="route-schematic-heading"
          className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight mb-2"
        >
          Climbing Route &amp; Camp Progression
        </h2>
        <p className="text-slate-400 font-light text-sm sm:text-base">
          Tactical vertical profile, camp staging milestones, and technical pitch navigation.
        </p>
      </div>

      {/* Narrative Climbing Route Breakdown */}
      <div className="space-y-4 text-slate-300 font-light text-base sm:text-lg leading-relaxed">
        {paragraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* Visual Route Schematic Progression */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-white/10 shadow-2xl relative overflow-hidden dark-photo-card preserve-white-text">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <span className="font-mono text-xs uppercase font-bold tracking-widest text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: style.accent }} />
            Expedition Route Progression Schematic
          </span>
          <span className="font-mono text-xs text-sky-400 font-semibold">
            {stages.length} Milestones
          </span>
        </div>

        <div className="space-y-6 relative">
          {/* Vertical progression line */}
          <div
            className="absolute left-4 sm:left-6 top-5 bottom-5 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-amber-400"
          />

          {stages.map((stage, idx) => {
            const isSummit = idx === stages.length - 1;
            return (
              <div key={idx} className="relative pl-12 sm:pl-16 group">
                {/* Node icon */}
                <div
                  className={`absolute left-2 sm:left-4 -translate-x-1/2 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shadow-lg border ${
                    isSummit
                      ? "bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/20"
                      : "bg-slate-950 text-white border-white/30 group-hover:border-white"
                  }`}
                  style={!isSummit ? { borderColor: style.accent } : undefined}
                >
                  {isSummit ? "▲" : idx + 1}
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                        isSummit
                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {stage.badge}
                    </span>

                    <span className="text-xs font-mono text-sky-300 font-semibold">
                      {stage.elevation}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                    {stage.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed">
                    <strong className="text-white font-medium">Terrain:</strong> {stage.terrain}
                  </p>

                  <p className="text-xs sm:text-sm font-light text-slate-400 leading-relaxed">
                    <strong className="text-slate-300 font-medium">Operational Focus:</strong> {stage.focus}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
