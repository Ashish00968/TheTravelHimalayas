"use client";

import React from "react";
import {
  TrendingUp,
  Footprints,
  Clock,
  Compass,
  MapPin,
  Calendar,
  Mountain,
  Map,
  Activity,
  CalendarCheck,
  ShieldAlert,
  Gauge,
  FileText,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { parseAndComputeHadi } from "@/lib/hadi";
import { getTrailSeasonCondition } from "@/lib/season-conditions";

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
  onOpenDossier?: () => void;
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
  onOpenDossier,
}: TrekOverviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.2)",
  };

  // Compute authoritative Himalayan Alpine Difficulty Index (HADI)
  const hadi = parseAndComputeHadi(distance, elevation, difficulty, isPatalsu);

  // Compute Live Season Condition
  const seasonCondition = getTrailSeasonCondition(bestSeason, elevation, stateSlug);

  // Extract numerical altitude in meters to verify AMS directive (>= 3,000m)
  const elevMatch = elevation.replace(/,/g, "").match(/\d+/);
  const elevM = elevMatch ? parseInt(elevMatch[0], 10) : 3200;
  const isAmsActive = elevM >= 3000;
  const elevFt = Math.round(elevM * 3.28084).toLocaleString();

  // Vertical gain estimation
  const verticalGain = isPatalsu
    ? "+1,781 m"
    : elevM >= 3000
    ? `+${Math.max(400, elevM - 2400)} m`
    : "+350 m";

  // Standardized 5-Pillar Primary Telemetry Console
  const primaryPillars = [
    {
      icon: TrendingUp,
      label: "Summit Apex",
      value: `${elevM.toLocaleString()} m`,
      subtext: `${elevFt} ft Elevation`,
      highlight: true,
    },
    {
      icon: Mountain,
      label: "Vertical Gain",
      value: verticalGain,
      subtext: "From Trailhead",
    },
    {
      icon: Footprints,
      label: "Total Distance",
      value: distance.split(" ")[0] ? `${distance.split(" ")[0]} km` : distance,
      subtext: distance.toLowerCase().includes("loop") ? "Round-Trip Loop" : "Mountain Track",
    },
    {
      icon: Clock,
      label: "Duration",
      value: duration.includes("Day") ? duration.split("(")[0].trim() : duration,
      subtext: "Recommended Pace",
    },
    {
      icon: Compass,
      label: "Alpine Grade",
      value: hadi.grade,
      subtext: `HADI ${hadi.score} • ${difficulty}`,
      highlight: true,
    },
  ];

  const secondarySpecs = [
    {
      icon: MapPin,
      label: "Trailhead Base",
      value: startPoint.split("(")[0].trim(),
      subtext: subRegionName ? `${subRegionName} Roadhead` : "Valley Access",
    },
    {
      icon: Calendar,
      label: "Prime Window",
      value: bestSeason,
      subtext: seasonCondition.advisory.length > 36 ? `${seasonCondition.advisory.substring(0, 34)}…` : seasonCondition.advisory,
    },
    {
      icon: Activity,
      label: "Route Type",
      value: isPatalsu ? "Summit Ridge Ascent" : "High-Altitude Route",
      subtext: regionName || stateSlug.replace(/-/g, " "),
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
        {/* Top Header Bar with Live Season Condition & Clinical AMS Directive Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: style.accent }} 
            />
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Alpine Field Dossier &bull; Route Metrics
            </h2>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Live Mountain Season Condition Badge */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border shadow-xs"
              style={{
                backgroundColor: seasonCondition.badgeBg,
                borderColor: seasonCondition.borderColor,
                color: seasonCondition.badgeColor,
              }}
            >
              <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{seasonCondition.badgeText}</span>
            </span>

            {isAmsActive && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>AMS Directive Active (&ge;3,000m)</span>
              </span>
            )}
            <span className="font-mono text-xs text-foreground/60 hidden md:inline-block">
              {isPatalsu
                ? "Kullu Valley &bull; Solang &bull; Himachal Pradesh"
                : `${subRegionName ? `${subRegionName} • ` : ""}${stateSlug.replace(/-/g, " ").toUpperCase()}`}
            </span>
          </div>
        </div>

        {/* 5-Column Bento Telemetry Grid (Desktop 5 cols, Tablet 3 cols, Mobile 2 cols) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {primaryPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col p-4 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/15 transition-all shadow-xs"
              >
                <div className="flex items-center gap-1.5 text-foreground/55 mb-2.5">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: item.highlight ? style.accent : undefined }} />
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold truncate">
                    {item.label}
                  </span>
                </div>
                
                <span 
                  className="text-xl sm:text-2xl font-display font-bold tracking-tight mb-1 text-foreground truncate"
                  style={item.highlight ? { color: style.accent } : undefined}
                >
                  {item.value}
                </span>

                <span className="text-[11px] sm:text-xs font-light text-foreground/60 truncate">
                  {item.subtext}
                </span>
              </div>
            );
          })}
        </div>

        {/* HADI Alpine Difficulty Metric Banner */}
        <div className="mt-4 p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] shadow-xs"
              style={{ backgroundColor: hadi.badgeBg, color: hadi.badgeColor }}
            >
              <Gauge className="w-3.5 h-3.5 shrink-0" />
              <span>HADI {hadi.score}</span>
              <span className="opacity-75">• {hadi.grade}</span>
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium text-[11px]">
              {hadi.gradeTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10.5px] text-slate-500 dark:text-slate-400 flex-wrap">
            <span>Base: {hadi.baseEffort}</span>
            <span className="text-slate-300 dark:text-white/20">&bull;</span>
            <span>Hypoxia: {hadi.altitudeMultiplier}x</span>
            <span className="text-slate-300 dark:text-white/20">&bull;</span>
            <span>Terrain: {hadi.terrainPenalty > 0 ? `+${hadi.terrainPenalty} Moraine` : "Trail"}</span>
          </div>
        </div>

        {/* Secondary Context & Waypoint Access Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-5 pt-5 border-t border-slate-100 dark:border-white/[0.06]">
          {secondarySpecs.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-3.5 p-3 rounded-xl bg-transparent"
              >
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04]"
                >
                  <Icon className="w-4 h-4 text-foreground/75" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/50 block">
                    {spec.label}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-foreground truncate block">
                    {spec.value}
                  </span>
                  <span className="text-[11px] text-foreground/60 block truncate font-light">
                    {spec.subtext}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Shortcut Bar: Quick Jumps to Key Dossier Sections */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <a
              href="#route"
              className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors py-1 min-h-[44px]"
            >
              <Map className="w-3.5 h-3.5" style={{ color: style.accent }} />
              <span>3D Terrain Map</span>
            </a>
            <a
              href="#elevation"
              className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors py-1 min-h-[44px]"
            >
              <Activity className="w-3.5 h-3.5" style={{ color: style.accent }} />
              <span>Elevation Scrubber</span>
            </a>
            <a
              href="#itinerary"
              className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors py-1 min-h-[44px]"
            >
              <CalendarCheck className="w-3.5 h-3.5" style={{ color: style.accent }} />
              <span>Itinerary</span>
            </a>

            {onOpenDossier && (
              <button
                type="button"
                onClick={onOpenDossier}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 transition-all hover:scale-105 active:scale-95 font-semibold text-xs min-h-[44px]"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Field Dossier (PDF)</span>
              </button>
            )}
          </div>

          <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
            Datum: WGS 84 &bull; Verified Alpine Cartography
          </span>
        </div>
      </div>
    </motion.section>
  );
}
