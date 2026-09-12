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
        className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-2xl bg-white/95 dark:bg-[#080e1a]/95 border border-slate-200/90 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        style={{
          borderTop: `2px solid ${style.accent}`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-foreground/[0.08]">
          <div className="flex items-center gap-2.5">
            <span 
              className="w-2.5 h-2.5 rounded-full animate-pulse" 
              style={{ backgroundColor: style.accent }} 
            />
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-foreground/80">
              Field Instrument Overview
            </h2>
          </div>
          <span className="font-mono text-xs text-slate-500 dark:text-foreground/50">
            {isPatalsu
              ? "Kullu • Solang Valley • Himachal Pradesh"
              : `${subRegionName ? `${subRegionName} • ` : ""}${stateSlug.replace(/-/g, " ").toUpperCase()}`}
          </span>
        </div>

        {/* Responsive Grid: 2 columns on mobile with 7th item spanning, 4 on tablet, 7 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-6">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            const isLastOnMobile = idx === 6;
            return (
              <motion.div 
                key={idx} 
                whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col p-2.5 sm:p-2 rounded-xl transition-colors hover:bg-slate-100/80 dark:hover:bg-white/[0.03] ${
                  isLastOnMobile ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-foreground/45 mb-1.5">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: metric.highlight ? style.accent : undefined }} />
                  <span className="text-[11px] font-mono uppercase tracking-wider font-medium truncate">
                    {metric.label}
                  </span>
                </div>
                
                <span 
                  className="text-base sm:text-lg font-display font-bold tracking-tight mb-0.5 text-slate-900 dark:text-foreground truncate"
                  style={metric.highlight ? { color: style.accent } : undefined}
                >
                  {metric.value}
                </span>

                <span className="text-[11px] font-light text-slate-500 dark:text-foreground/50 truncate">
                  {metric.subtext}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
