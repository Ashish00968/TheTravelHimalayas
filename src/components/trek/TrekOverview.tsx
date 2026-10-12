"use client";

import React from "react";
import { TrendingUp, Footprints, Clock, Compass, MapPin, Calendar, Mountain } from "lucide-react";

import { motion, useReducedMotion } from "framer-motion";

interface TrekOverviewProps {
  elevation?: string;
  distance?: string;
  duration?: string;
  difficulty?: string;
  startPoint?: string;
  bestSeason?: string;
  stateSlug: string;
  subRegionName?: string;
  regionName?: string;
  isPatalsu?: boolean;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.2)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.2)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.2)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.2)" },
};

export function TrekOverview({
  elevation = "High Alpine",
  distance = "Varies",
  duration = "Standard Pace",
  difficulty = "Moderate",
  startPoint = "Base Trailhead",
  bestSeason = "May–October",
  stateSlug,
  subRegionName,
  regionName,
  isPatalsu = false,
}: TrekOverviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.2)",
  };

  const metrics = isPatalsu
    ? [
        {
          icon: TrendingUp,
          label: "Summit Altitude",
          value: elevation,
          subtext: "4,261m / 13,980ft",
        },
        {
          icon: Mountain,
          label: "Vertical Gain",
          value: "+1,781 m",
          subtext: "From Solang Valley",
          highlight: true,
        },
        {
          icon: Footprints,
          label: "Total Distance",
          value: distance.split(" ")[0] ? `${distance.split(" ")[0]} km` : distance,
          subtext: "16 km Round-Trip",
        },
        {
          icon: Clock,
          label: "Recommended Time",
          value: duration.includes("Day") ? duration.split("(")[0].trim() : duration,
          subtext: "Or 12–13h Speed Hike",
        },
        {
          icon: Compass,
          label: "Trail Difficulty",
          value: difficulty,
          subtext: "Non-Technical Summit",
          highlight: true,
        },
        {
          icon: MapPin,
          label: "Trailhead Base",
          value: startPoint.split("(")[0].trim(),
          subtext: "Solang (14km Manali)",
        },
        {
          icon: Calendar,
          label: "Best Window",
          value: bestSeason,
          subtext: "Spring Snow / Autumn",
        },
      ]
    : [
        {
          icon: TrendingUp,
          label: "Summit Altitude",
          value: elevation,
          subtext: "Peak / Pass Apex",
        },
        {
          icon: Footprints,
          label: "Total Distance",
          value: distance,
          subtext: "Trail Length",
        },
        {
          icon: Clock,
          label: "Recommended Time",
          value: duration,
          subtext: "Standard Itinerary",
        },
        {
          icon: Compass,
          label: "Trail Difficulty",
          value: difficulty,
          subtext: "Alpine Grade",
          highlight: true,
        },
        {
          icon: MapPin,
          label: "Trailhead Base",
          value: startPoint.split("(")[0].trim(),
          subtext: subRegionName || "Base Trailhead",
        },
        {
          icon: Calendar,
          label: "Best Window",
          value: bestSeason,
          subtext: "Optimal Weather",
        },
        {
          icon: Mountain,
          label: "Region / Valley",
          value: subRegionName || "Himalayan Ridge",
          subtext: regionName || stateSlug.replace(/-/g, " "),
          highlight: true,
        },
      ];

  return (
    <motion.section 
      id="overview" 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 -mt-16 sm:-mt-20 container mx-auto px-4 sm:px-6 max-w-7xl scroll-mt-28"
      aria-label="Trek Overview"
    >
      <div 
        className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 bg-card dark:bg-[#080E1A] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: style.accent }} 
            />
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Alpine Field Dossier &bull; Route Metrics
            </h2>
          </div>
          <span className="font-mono text-xs text-foreground/60">
            {isPatalsu
              ? "Kullu Valley &bull; Solang Valley &bull; Himachal Pradesh"
              : `${subRegionName ? `${subRegionName} • ` : ""}${stateSlug.replace(/-/g, " ").toUpperCase()}`}
          </span>
        </div>

        {/* Responsive Telemetry Grid: 2 columns on mobile, 4 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {metrics.slice(0, 4).map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col p-3.5 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05]"
              >
                <div className="flex items-center gap-1.5 text-foreground/55 mb-2">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: metric.highlight ? style.accent : undefined }} />
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-medium truncate">
                    {metric.label}
                  </span>
                </div>
                
                <span 
                  className="text-lg sm:text-xl font-display font-bold tracking-tight mb-1 text-foreground truncate"
                  style={metric.highlight ? { color: style.accent } : undefined}
                >
                  {metric.value}
                </span>

                <span className="text-xs font-light text-foreground/60 truncate">
                  {metric.subtext}
                </span>
              </div>
            );
          })}
        </div>

        {/* Secondary Context Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
          {metrics.slice(4).map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div 
                key={idx} 
                className="flex items-start gap-3 p-3 rounded-lg bg-transparent"
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04]"
                >
                  <Icon className="w-4 h-4 text-foreground/70" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/50 block">
                    {metric.label}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-foreground truncate block">
                    {metric.value}
                  </span>
                  <span className="text-[11px] text-foreground/60 block truncate font-light">
                    {metric.subtext}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
