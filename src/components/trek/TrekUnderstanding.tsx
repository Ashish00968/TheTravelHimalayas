"use client";

import React from "react";
import { Mountain, Compass, CheckCircle2 } from "lucide-react";

interface TrekUnderstandingProps {
  title: string;
  difficulty: string;
  maxAltitude: string;
  duration: string;
  distance: string;
  startPoint?: string;
  routeDescription?: string;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6" },
  "himachal-pradesh": { accent: "#F59E0B" },
  ladakh:             { accent: "#7C3AED" },
  uttarakhand:        { accent: "#0D9488" },
};

export function TrekUnderstanding({
  title,
  difficulty,
  maxAltitude,
  duration,
  distance,
  startPoint = "Base Trailhead",
  routeDescription,
  stateSlug,
}: TrekUnderstandingProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6" };

  // Calculate approximate vertical gain if trailhead has altitude
  const startAltMatch = startPoint.match(/(\d{1,2}[,\.]?\d{3})/);
  const summitAltMatch = maxAltitude.match(/(\d{1,2}[,\.]?\d{3})/);
  
  let verticalGainStr = "Significant Alpine Ascent";
  if (startAltMatch && summitAltMatch) {
    const startMeters = parseInt(startAltMatch[1].replace(/,/g, ""), 10);
    const summitMeters = parseInt(summitAltMatch[1].replace(/,/g, ""), 10);
    if (!isNaN(startMeters) && !isNaN(summitMeters) && summitMeters > startMeters) {
      verticalGainStr = `+${(summitMeters - startMeters).toLocaleString("en-IN")} m continuous gain`;
    }
  }

  return (
    <section 
      id="understand" 
      className="container mx-auto px-6 max-w-5xl py-16 sm:py-24 scroll-mt-24 border-t border-foreground/[0.08]"
      aria-labelledby="understand-heading"
    >
      {/* Chapter Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-[11px] font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Chapter 02 &bull; Field Parameters
        </span>
        <div className="h-px flex-1 bg-foreground/[0.08]" />
      </div>

      <h2 
        id="understand-heading"
        className="font-display font-bold text-3xl sm:text-5xl text-foreground tracking-tight mb-6"
      >
        Understanding the Trek
      </h2>

      <p className="text-foreground/75 font-light text-base sm:text-lg leading-relaxed max-w-3xl mb-12">
        A successful ascent requires matching your physical readiness with the route&apos;s terrain transition, daily pacing, and vertical gain. Here is the operational breakdown of the {title}.
      </p>

      {/* 4 Essential Field Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Pillar 1: Trail Architecture */}
        <div className="glass-museum-card rounded-3xl p-6 sm:p-8 border border-foreground/[0.08]">
          <div className="flex items-center gap-3 mb-3">
            <Mountain className="w-5 h-5" style={{ color: style.accent }} />
            <h3 className="font-display font-bold text-xl text-foreground">
              Trail Architecture
            </h3>
          </div>
          <p className="text-foreground/75 font-light text-sm sm:text-base leading-relaxed mb-4">
            Ascends from {startPoint} through dense temperate woodlands before breaking past the timberline into steep alpine meadows and an exposed shale ridgeline.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-foreground/60">
            <span>Vertical &bull; Distance:</span>
            <span className="text-foreground font-bold">{verticalGainStr} ({distance})</span>
          </div>
        </div>

        {/* Pillar 2: Technical Demands */}
        <div className="glass-museum-card rounded-3xl p-6 sm:p-8 border border-foreground/[0.08]">
          <div className="flex items-center gap-3 mb-3">
            <Compass className="w-5 h-5" style={{ color: style.accent }} />
            <h3 className="font-display font-bold text-xl text-foreground">
              Technical Demand: {difficulty}
            </h3>
          </div>
          <p className="text-foreground/75 font-light text-sm sm:text-base leading-relaxed mb-4">
            Non-technical mountaineering terrain (no fixed ropes or crampons required in fair season), but demands confident balance across loose scree, steep switchbacks, and wind-scoured ridges.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-foreground/60">
            <span>Standard Pacing:</span>
            <span className="text-foreground font-bold">{duration}</span>
          </div>
        </div>
      </div>

      {/* Detailed Route Character Note */}
      {routeDescription && (
        <div className="p-6 sm:p-8 rounded-3xl bg-foreground/[0.02] border border-foreground/[0.08] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-foreground/60">
            <CheckCircle2 className="w-4 h-4" style={{ color: style.accent }} />
            <span>Route Character &amp; Trail Condition</span>
          </div>
          <p className="text-foreground/80 font-light text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {routeDescription}
          </p>
        </div>
      )}
    </section>
  );
}
