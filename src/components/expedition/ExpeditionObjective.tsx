"use client";

import React from "react";
import { Target, CheckCircle2 } from "lucide-react";
import { Peak } from "@/data/types";

interface ExpeditionObjectiveProps {
  peak: Peak;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function ExpeditionObjective({
  peak,
  stateSlug,
}: ExpeditionObjectiveProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const details = peak.expeditionDetails || "";
  const paragraphs = details.split("\n\n").filter(Boolean);

  return (
    <section id="expedition-objective" className="scroll-mt-24 space-y-6" aria-labelledby="expedition-objective-heading">
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Alpine Objective
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <h2
        id="expedition-objective-heading"
        className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight"
      >
        The Climbing Objective &amp; Staging
      </h2>

      <div className="space-y-4 text-slate-300 font-light text-base sm:text-lg leading-relaxed">
        {paragraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* Summit Push Directives */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#080e1a] border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.05] border border-white/10 shadow-sm"
          >
            <Target className="w-5 h-5" style={{ color: style.accent }} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-base sm:text-lg text-white">
              Summit Assault Protocol
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Alpine start timing &amp; turnaround directives
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-start gap-2.5 text-xs sm:text-sm font-light text-slate-300">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: style.accent }} />
            <span>Pre-dawn alpine start (typically 01:00–03:00 hrs) to negotiate frozen crust before solar softening.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs sm:text-sm font-light text-slate-300">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: style.accent }} />
            <span>Strict turnaround deadline (typically 10:00–11:00 hrs) regardless of distance to summit point.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs sm:text-sm font-light text-slate-300">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: style.accent }} />
            <span>Roped glacier travel mandatory across crevassed moraines and hanging ice aprons.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs sm:text-sm font-light text-slate-300">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: style.accent }} />
            <span>Descent discipline: 80% of alpine mishaps occur during the fatigued return to high camp.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
