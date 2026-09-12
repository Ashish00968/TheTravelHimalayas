"use client";

import React from "react";
import { ArrowUp, Activity } from "lucide-react";
import { Peak } from "@/data/types";

interface ExpeditionAltitudeProfileProps {
  peak: Peak;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function ExpeditionAltitudeProfile({
  peak,
  stateSlug,
}: ExpeditionAltitudeProfileProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const heightMeters = peak.height;
  const baseCampAlt = peak.baseCamp
    ? parseInt(peak.baseCamp.match(/\d{4}/)?.[0] || "3800", 10)
    : Math.round(heightMeters * 0.65);

  const highCampAlt = Math.round(baseCampAlt + (heightMeters - baseCampAlt) * 0.6);
  const verticalGain = heightMeters - baseCampAlt;

  // Key milestones
  const milestones = [
    {
      name: "Base Camp",
      altitude: baseCampAlt,
      percent: 0,
      note: "Primary Acclimatization Staging",
      oxygen: "Approx. 64% sea level O₂",
    },
    {
      name: "High Camp / Camp 1",
      altitude: highCampAlt,
      percent: Math.round(((highCampAlt - baseCampAlt) / verticalGain) * 100),
      note: "Alpine Assault Launch Point",
      oxygen: "Approx. 56% sea level O₂",
    },
    {
      name: `${peak.title} Summit`,
      altitude: heightMeters,
      percent: 100,
      note: "True Alpine Summit Objective",
      oxygen: `${Math.round(100 * Math.exp(-heightMeters / 8000))}% sea level O₂`,
    },
  ];

  return (
    <section id="altitude-profile" className="scroll-mt-24 space-y-6" aria-labelledby="expedition-altitude-heading">
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Altitude Telemetry
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2
            id="expedition-altitude-heading"
            className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight mb-2"
          >
            Vertical Ascent Profile &amp; Physiological Milestones
          </h2>
          <p className="text-slate-400 font-light text-sm sm:text-base">
            Base Camp to summit elevation delta and altitude-induced physiological thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#080e1a] border border-white/10 flex-shrink-0">
          <ArrowUp className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Vertical Delta
            </span>
            <span className="text-sm font-bold font-mono text-white">
              +{verticalGain.toLocaleString("en-IN")}m Gain
            </span>
          </div>
        </div>
      </div>

      {/* Altitude Bar Visualization */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#080e1a] border border-white/10 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {milestones.map((m, idx) => {
            const isSummit = idx === milestones.length - 1;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all ${
                  isSummit
                    ? "bg-slate-900 text-white border-white/20 shadow-lg"
                    : "bg-[#0d1422] border-white/[0.08]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded ${
                      isSummit
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                        : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {isSummit ? "SUMMIT POINT" : `STAGE 0${idx + 1}`}
                  </span>

                  <span className={`text-xs font-mono font-semibold ${isSummit ? "text-sky-300" : "text-primary"}`}>
                    {m.altitude.toLocaleString("en-IN")}m
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg mb-1 text-white">
                  {m.name}
                </h3>

                <p className={`text-xs font-light mb-4 ${isSummit ? "text-slate-300" : "text-slate-400"}`}>
                  {m.note}
                </p>

                <div className={`pt-3 border-t flex items-center justify-between text-xs font-mono ${
                  isSummit ? "border-white/10 text-slate-400" : "border-white/[0.06] text-slate-400"
                }`}>
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-400" />
                    O₂ Level:
                  </span>
                  <span className="font-semibold">{m.oxygen}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical directive reminder */}
        <div className="p-4 rounded-2xl bg-amber-500/[0.06] border border-amber-500/25 flex items-center justify-between gap-4 text-xs font-light text-slate-700 dark:text-slate-300">
          <span>
            ⚠️ High-altitude ascents above 5,000m require conservative staging. Ascend no more than 400m–500m sleeping altitude per 24 hours once above 3,500m.
          </span>
          <span className="font-mono text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">
            Rule 02 Compliant
          </span>
        </div>
      </div>
    </section>
  );
}
