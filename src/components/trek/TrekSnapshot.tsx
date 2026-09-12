"use client";

import React from "react";
import { TrendingUp, Footprints, Clock, Compass, MapPin, Calendar } from "lucide-react";

interface TrekSnapshotProps {
  elevation?: string;
  distance?: string;
  duration?: string;
  difficulty?: string;
  startPoint?: string;
  bestSeason?: string;
  stateSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.2)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.2)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.2)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.2)" },
};

export function TrekSnapshot({
  elevation = "4,261 m",
  distance = "16 km round-trip",
  duration = "3 Days",
  difficulty = "Challenging",
  startPoint = "Solang Village (2,480m)",
  bestSeason = "May to October",
  stateSlug,
}: TrekSnapshotProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.2)",
  };

  const metrics = [
    {
      icon: TrendingUp,
      label: "Summit Altitude",
      value: elevation,
      subtext: "Summit Ridge Crest",
    },
    {
      icon: Footprints,
      label: "Total Distance",
      value: distance.split(" ")[0] ? `${distance.split(" ")[0]} km` : distance,
      subtext: "Round-Trip Distance",
    },
    {
      icon: Clock,
      label: "Standard Duration",
      value: duration.split("(")[0].trim(),
      subtext: "Paced for Acclimatization",
    },
    {
      icon: Compass,
      label: "Technical Grade",
      value: difficulty,
      subtext: "Steep Scree & Ridgeline",
      highlight: true,
    },
    {
      icon: MapPin,
      label: "Trailhead Base",
      value: startPoint.split("(")[0].trim(),
      subtext: startPoint.includes("(") ? startPoint.slice(startPoint.indexOf("(") + 1, -1) : "Base Valley",
    },
    {
      icon: Calendar,
      label: "Optimal Window",
      value: bestSeason,
      subtext: "Clear Skies & Fair Winds",
    },
  ];

  return (
    <section 
      id="snapshot" 
      className="relative z-20 -mt-16 sm:-mt-20 container mx-auto px-6 max-w-7xl scroll-mt-28"
      aria-label="Expedition Snapshot"
    >
      <div 
        className="rounded-3xl p-6 sm:p-8 backdrop-blur-2xl bg-[#080e1a]/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        style={{
          borderTop: `2px solid ${style.accent}`,
        }}
      >
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-foreground/[0.08]">
          <div className="flex items-center gap-2.5">
            <span 
              className="w-2.5 h-2.5 rounded-full animate-pulse" 
              style={{ backgroundColor: style.accent }} 
            />
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">
              Traveller Snapshot &bull; Expedition Telemetry
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 hidden sm:inline-block">
            Field Verified Data
          </span>
        </div>

        {/* 6-Column Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-2 text-foreground/45 mb-1.5">
                  <Icon className="w-3.5 h-3.5" style={{ color: metric.highlight ? style.accent : undefined }} />
                  <span className="text-[11px] font-mono uppercase tracking-wider font-medium">
                    {metric.label}
                  </span>
                </div>
                
                <span 
                  className={`text-lg sm:text-xl font-display font-bold tracking-tight mb-0.5 ${
                    metric.highlight ? "text-foreground" : "text-foreground"
                  }`}
                  style={metric.highlight ? { color: style.accent } : undefined}
                >
                  {metric.value}
                </span>

                <span className="text-[11px] font-light text-foreground/50 line-clamp-1">
                  {metric.subtext}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
