"use client";

import React from "react";
import Link from "next/link";
import { Phone, ArrowRight, Activity, ThermometerSnowflake } from "lucide-react";
import { Peak } from "@/data/types";

interface ExpeditionSafetyRiskProps {
  peak: Peak;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function ExpeditionSafetyRisk({
  peak,
  stateSlug,
}: ExpeditionSafetyRiskProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  const height = peak.height;

  return (
    <section id="safety-risk" className="scroll-mt-24 space-y-8" aria-labelledby="expedition-safety-heading">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
            style={{ color: style.accent }}
          >
            Risk &amp; Altitude Protocol
          </span>
          <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
        </div>

        <h2
          id="expedition-safety-heading"
          className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight mb-2"
        >
          Expedition Risk Analysis &amp; Altitude Directives
        </h2>
        <p className="text-slate-400 font-light text-sm sm:text-base">
          Mandatory high-altitude directives, objective hazards, and official Search &amp; Rescue (SAR) contacts for {peak.title}.
        </p>
      </div>

      {/* Primary Risk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Extreme Altitude Hazard */}
        <div className="p-6 sm:p-8 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-white">
              Hypoxia &amp; Medical Directives ({height}m)
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed">
            Above 5,000m, arterial oxygen saturation drops precipitously. The primary treatment for High Altitude Pulmonary Edema (HAPE) and High Altitude Cerebral Edema (HACE) is immediate descent. A minimum loss of 500m–1,000m altitude is required at first onset.
          </p>
        </div>

        {/* Glacial & Crevasse Hazards */}
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-400">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-white">
              Glacier Crevasses &amp; Cornice Collapse
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed">
            Active crevasses become obscured by thin wind crusts in spring and autumn. Unroped movement on the glacier is strictly prohibited. Approach knife-edge summit ridges with caution to avoid standing on overhanging cornices.
          </p>
        </div>
      </div>

      {/* Official Emergency & SAR Contacts Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#080e1a] border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-400 flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Official Mountain Emergency Contacts
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Direct dispatch frequencies &amp; emergency helplines
              </span>
            </div>
          </div>

          <Link
            href="/safety"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono font-bold uppercase tracking-wider text-white transition-all flex-shrink-0 min-h-[38px]"
          >
            <span>Complete Safety Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-[#0d1422] border border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
              National Emergency
            </span>
            <span className="text-base font-mono font-bold text-white block">
              112
            </span>
            <span className="text-[10px] text-slate-400">All India Toll-Free</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0d1422] border border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
              Disaster Response (SDRF)
            </span>
            <span className="text-base font-mono font-bold text-white block">
              1070 / 1077
            </span>
            <span className="text-[10px] text-slate-400">District Disaster Cell</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0d1422] border border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
              IMF New Delhi
            </span>
            <span className="text-base font-mono font-bold text-white block">
              +91-11-24111211
            </span>
            <span className="text-[10px] text-slate-400">HQ Operations Room</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0d1422] border border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
              Medical Triage Rule
            </span>
            <span className="text-base font-mono font-bold text-rose-400 block">
              Rule 01 &amp; 03
            </span>
            <span className="text-[10px] text-slate-400">Descend Immediately</span>
          </div>
        </div>
      </div>
    </section>
  );
}
