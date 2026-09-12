"use client";

import React from "react";
import { Check, Shield, Hammer, Tent } from "lucide-react";
import { Peak } from "@/data/types";

interface ExpeditionGearProps {
  peak: Peak;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function ExpeditionGear({
  peak,
  stateSlug,
}: ExpeditionGearProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const customGear = peak.gearRequirements || [];

  // Group verified equipment
  const personalAlpine = customGear.length > 0
    ? customGear.filter((g) =>
        /boot|crampon|axe|harness|helmet|gaiter|suit|jacket/i.test(g)
      )
    : [
        "Double mountaineering boots (rigid sole, automatic crampon compatible)",
        "Steel technical crampons (12-point with anti-balling plates)",
        "Technical ice axe / tools (50–65cm)",
        "Climbing harness with locking screwgate carabiners",
        "CE-certified alpine mountaineering helmet",
      ];

  const technicalSystems = customGear.length > 0
    ? customGear.filter((g) =>
        /rack|screw|picket|rope|jumar|rappel|anchor|piton/i.test(g)
      )
    : [
        "Dynamic dry-treated climbing ropes (8.5mm–9.5mm)",
        "Snow pickets / flukes (60cm aluminum)",
        "Ice screws (13cm–17cm) & V-thread tool",
        "Hand ascender (Jumar) & belay/rappel device",
        "Crevasse rescue kit (prussiks, micro-traxion, pulleys)",
      ];

  const campSystems = customGear.length > 0
    ? customGear.filter((g) =>
        /sleeping|tent|stove|probe|shovel/i.test(g)
      )
    : [
        "4-season geodesic expedition tent (wind-tested to 80 km/h)",
        "Down sleeping bag rated to -20°C to -35°C with expedition mat",
        "Liquid fuel high-altitude expedition stove (white gas / kerosene)",
        "Avalanche rescue kit (transceiver, 240cm probe, aluminum shovel)",
      ];

  // If some custom gear wasn't categorized, collect it in personalAlpine
  const allCategorized = [...personalAlpine, ...technicalSystems, ...campSystems];
  const uncategorized = customGear.filter((g) => !allCategorized.includes(g));
  if (uncategorized.length > 0) {
    personalAlpine.push(...uncategorized);
  }

  return (
    <section id="expedition-gear" className="scroll-mt-24 space-y-8" aria-labelledby="expedition-gear-heading">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
            style={{ color: style.accent }}
          >
            Alpine Systems
          </span>
          <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
        </div>

        <h2
          id="expedition-gear-heading"
          className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight mb-2"
        >
          Technical Equipment &amp; High-Camp Systems
        </h2>
        <p className="text-slate-400 font-light text-sm sm:text-base">
          Mandatory alpine climbing systems for {peak.title}. Distinct from standard hiking checklists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Personal Alpine Equipment */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080e1a] border border-white/10 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/[0.05] border border-white/10">
              <Shield className="w-5 h-5" style={{ color: style.accent }} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                System 01
              </span>
              <h3 className="font-display font-bold text-base text-white">
                Personal Alpine Gear
              </h3>
            </div>
          </div>

          <ul className="space-y-3">
            {personalAlpine.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-light text-slate-300 leading-snug">
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Technical Systems */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080e1a] border border-white/10 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/[0.05] border border-white/10">
              <Hammer className="w-5 h-5" style={{ color: style.accent }} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                System 02
              </span>
              <h3 className="font-display font-bold text-base text-white">
                Technical Systems
              </h3>
            </div>
          </div>

          <ul className="space-y-3">
            {(technicalSystems.length > 0 ? technicalSystems : [
              "Dynamic dry ropes (50m–60m)",
              "Snow pickets & ice screws",
              "Crevasse rescue pulleys & friction hitches",
              "Ascenders (Jumars) & rappel gear",
            ]).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-light text-slate-300 leading-snug">
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Camp Systems */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080e1a] border border-white/10 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/[0.05] border border-white/10">
              <Tent className="w-5 h-5" style={{ color: style.accent }} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                System 03
              </span>
              <h3 className="font-display font-bold text-base text-white">
                High-Camp Systems
              </h3>
            </div>
          </div>

          <ul className="space-y-3">
            {(campSystems.length > 0 ? campSystems : [
              "4-season geodesic mountain tent",
              "Sub-zero down sleeping bag (-25°C rating)",
              "High-altitude liquid fuel stove",
              "Snow shovel & avalanche probe",
            ]).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-light text-slate-300 leading-snug">
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
