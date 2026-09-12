"use client";

import React from "react";
import { FileCheck, Users, Radio, ShieldCheck, Clock, Plane } from "lucide-react";
import { Peak } from "@/data/types";
import { HimalayaSubRegion, HimalayaRegion } from "@/data/atlas";

interface ExpeditionLogisticsProps {
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

export function ExpeditionLogistics({
  peak,
  region,
  subRegion,
  stateSlug,
}: ExpeditionLogisticsProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  return (
    <section id="expedition-logistics" className="scroll-mt-24 space-y-8" aria-labelledby="expedition-logistics-heading">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
            style={{ color: style.accent }}
          >
            Expedition Logistics
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <h2
          id="expedition-logistics-heading"
          className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight mb-2"
        >
          Expedition Planning &amp; Logistics: {peak.title}
        </h2>
        <p className="text-slate-400 font-light text-sm sm:text-base">
          Mandatory permits, field communication protocols, support infrastructure, and emergency evacuation in {subRegion.name}, {region.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* IMF Permits */}
        <div className="p-6 rounded-3xl bg-[#080e1a] border border-white/10 shadow-2xl space-y-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/[0.05] border border-white/10">
            <FileCheck className="w-5 h-5" style={{ color: style.accent }} />
          </div>
          <h3 className="font-display font-bold text-base text-white">
            IMF Climbing Permit
          </h3>
          <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed">
            All climbing expeditions above 5,000m require formal clearance from the Indian Mountaineering Foundation (IMF), New Delhi. A designated Liaison Officer (LO) may be assigned depending on peak classification.
          </p>
        </div>

        {/* Support Requirements */}
        <div className="p-6 rounded-3xl bg-[#080e1a] border border-white/10 shadow-2xl space-y-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/[0.05] border border-white/10">
            <Users className="w-5 h-5" style={{ color: style.accent }} />
          </div>
          <h3 className="font-display font-bold text-base text-white">
            Alpine Support Team
          </h3>
          <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed">
            Recommended ratio of 1 certified UIAGM/IMF guide per 2–3 climbers on technical summit days. High-altitude porters (HAPs) are essential for load ferrying to high camps and fixing ropes across headwalls.
          </p>
        </div>

        {/* Satellite Communications */}
        <div className="p-6 rounded-3xl bg-[#080e1a] border border-white/10 shadow-2xl space-y-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/[0.05] border border-white/10">
            <Radio className="w-5 h-5" style={{ color: style.accent }} />
          </div>
          <h3 className="font-display font-bold text-base text-white">
            Communication Protocol
          </h3>
          <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed">
            Cellular coverage terminates beyond the approach roadhead. Teams must maintain VHF/UHF radio contact between camps and carry approved satellite communicators (e.g. inReach / Iridium) for emergency SOS relays.
          </p>
        </div>

        {/* Acclimatization Staging */}
        <div className="p-6 rounded-3xl bg-[#080e1a] border border-white/10 shadow-2xl space-y-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/[0.05] border border-white/10">
            <Clock className="w-5 h-5" style={{ color: style.accent }} />
          </div>
          <h3 className="font-display font-bold text-base text-white">
            Acclimatization Schedule
          </h3>
          <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed">
            Climb high, sleep low. A minimum of 2 dedicated acclimatization days must be scheduled at Base Camp before carrying loads or establishing high camps on the glacier.
          </p>
        </div>

        {/* Heli-Evacuation Pathways */}
        <div className="p-6 rounded-3xl bg-[#080e1a] border border-white/10 shadow-2xl space-y-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/[0.05] border border-white/10">
            <Plane className="w-5 h-5" style={{ color: style.accent }} />
          </div>
          <h3 className="font-display font-bold text-base text-white">
            Evacuation &amp; SAR
          </h3>
          <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed">
            In the event of severe HAPE, HACE, or trauma, ground stretcher descent to the roadhead is the primary evacuation mode. Helicopter rescue requires Indian Air Force / civil administration authorization and favorable weather.
          </p>
        </div>

        {/* Independent Field Advisory */}
        <div className="p-6 rounded-3xl bg-[#0d1422] border border-white/10 shadow-2xl space-y-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/[0.05] border border-white/10">
            <ShieldCheck className="w-5 h-5" style={{ color: style.accent }} />
          </div>
          <h3 className="font-display font-bold text-base text-white">
            Editorial Field Advisory
          </h3>
          <p className="text-xs sm:text-sm font-light text-slate-400 leading-relaxed">
            Discover Himalayan Trails provides authoritative alpine intelligence but does not operate commercial climbs. Expeditions should be conducted through accredited IMF agencies with licensed mountain guides.
          </p>
        </div>
      </div>
    </section>
  );
}
