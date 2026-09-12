"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sun, 
  CloudRain, 
  Wind, 
  Snowflake, 
  AlertCircle, 
  CheckCircle2, 
  Hospital, 
  PhoneCall, 
  Backpack, 
  ArrowRight, 
  Calendar, 
  Lightbulb, 
  ShieldAlert, 
  Compass
} from "lucide-react";
import { MountainWeatherWidget } from "@/components/shared/MountainWeatherWidget";
import { GoldenRulesCallout } from "@/components/shared/GoldenRulesCallout";
import { motion, useReducedMotion } from "framer-motion";

interface TrekInformationProps {
  title: string;
  bestSeason: string;
  coords?: [number, number];
  subRegionName: string;
  regionName?: string;
  stateSlug: string;
  tips?: string[];
  permits?: string;
  maxAltitude: string;
  packingList: string[];
  isPatalsu?: boolean;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.2)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.2)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.2)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.2)" },
};

type TabType = "all" | "weather" | "tips" | "safety" | "packing";

export function TrekInformation({
  title,
  bestSeason,
  coords,
  subRegionName,
  regionName,
  stateSlug,
  tips,
  permits,
  maxAltitude,
  packingList,
  isPatalsu = false,
}: TrekInformationProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6", glow: "rgba(59,130,246,0.2)" };

  // Seasonal cycle dataset
  const seasons = isPatalsu
    ? [
        {
          icon: Sun,
          season: "Summer & Spring Snow (May – June)",
          badge: "Spring Greenery & Snow",
          description: "Lush meadows in Shagadugh, pleasant daytime temperatures (12°C to 18°C), with crisp snow patches on the high summit crest — ideal for snow Manali treks.",
          status: "Prime Season",
        },
        {
          icon: CloudRain,
          season: "Monsoon (July – August)",
          badge: "Early Departures",
          description: "Dense pine woodland is vibrant and green. Convective clouds gather by early afternoon; 5:00 AM alpine departures are critical to summit safely.",
          status: "Feasible with Care",
        },
        {
          icon: Wind,
          season: "Post-Monsoon / Autumn (Sept – Oct)",
          badge: "Optimal Clarity",
          description: "Crisp, transparent atmosphere with sharpest panoramic visibility of Hanuman Tibba and Dhauladhar ranges. Ideal window for speed hiking.",
          status: "Best Window",
          highlight: true,
        },
        {
          icon: Snowflake,
          season: "Winter (Nov – April)",
          badge: "Heavy Snow Pack",
          description: "Upper meadows and ridge buried under heavy snow drifts. Snow trekking to Shagadugh (3,250m) is accessible; summit push requires winter mountaineering equipment.",
          status: "Winter Snow Trek",
        },
      ]
    : [
        {
          icon: Sun,
          season: "Summer & Spring (May – June)",
          badge: "Pleasant Temperatures",
          description: `Clear morning skies, blooming alpine meadows across ${subRegionName}, and comfortable daytime trekking conditions with residual high pass snow.`,
          status: "Prime Season",
        },
        {
          icon: CloudRain,
          season: "Monsoon (July – August)",
          badge: "Vibrant Flora",
          description: "Lush green valley trails and vibrant mountain ecology. Afternoon showers require early morning departures and waterproof shells.",
          status: "Feasible with Care",
        },
        {
          icon: Wind,
          season: "Post-Monsoon / Autumn (Sept – Oct)",
          badge: "Crystalline Visibility",
          description: "Unparalleled long-range visibility, stable atmospheric pressure, and crisp dry conditions across the Himalayan summits.",
          status: "Best Window",
          highlight: true,
        },
        {
          icon: Snowflake,
          season: "Winter & Early Spring (Nov – April)",
          badge: "Snow-Covered Trails",
          description: "High elevation terrain covered in heavy seasonal snow. Lower valley trails accessible; high cols demand specialized cold-weather preparation.",
          status: "Winter Conditions",
        },
      ];

  // Emergency hospital & rescue contact based on territory
  const nearestHospital = isPatalsu
    ? "Civil Hospital Manali (14 km from Solang)"
    : stateSlug === "himachal-pradesh"
    ? `Civil / District Hospital (${subRegionName})`
    : stateSlug === "uttarakhand"
    ? `District Base Hospital (${subRegionName})`
    : stateSlug === "ladakh"
    ? "SNM District Hospital Leh / Sub-District Hospital"
    : `District Hospital / SKIMS Emergency (${subRegionName})`;

  const emergencySAR = stateSlug === "himachal-pradesh"
    ? "Himalayan SAR: Dial 112 • HP Police 1077"
    : stateSlug === "uttarakhand"
    ? "State Disaster Response (SDRF): Dial 112 • UK Helpline 1070"
    : stateSlug === "ladakh"
    ? "UT Ladakh Emergency: Dial 112 • Ladakh SAR Dispatch"
    : "Himalayan Emergency Command: Dial 112";

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "all", label: "All Details", icon: Compass },
    { id: "weather", label: "Weather & Season", icon: Sun },
    { id: "tips", label: "Trail Tips", icon: Lightbulb },
    { id: "safety", label: "Safety & SAR", icon: ShieldAlert },
    { id: "packing", label: "What to Pack", icon: Backpack },
  ];

  return (
    <motion.section 
      id="information" 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-24 scroll-mt-24 border-t border-slate-200/80 dark:border-white/10"
      aria-label={`Complete trail information and logistics for ${title}`}
      aria-labelledby="information-heading"
    >
      {/* Category Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Trail Intelligence &amp; Logistics
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-white/10" />
      </div>

      {/* Main Section Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
        <div>
          <h2 
            id="information-heading"
            className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-slate-900 dark:text-white tracking-tight mb-3"
          >
            Information
          </h2>
          <p className="text-slate-600 dark:text-slate-300 font-light text-base sm:text-lg max-w-2xl">
            Everything you need for a safe and prepared journey — real-time weather, seasonal cycles, practical field tips, medical directives, and gear checklist.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
          <Calendar className="w-3.5 h-3.5" style={{ color: style.accent }} />
          <span>Prime Season: <strong className="text-slate-900 dark:text-white">{bestSeason}</strong></span>
        </div>
      </div>

      {/* Segmented Filter Bar (Switch between All, Weather, Tips, Safety, Packing) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 mb-8 sm:mb-12 scrollbar-none touch-pan-x">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap min-h-[44px] shrink-0 border ${
                isActive
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
              }`}
              style={isActive ? { borderColor: style.accent } : undefined}
            >
              <Icon className="w-3.5 h-3.5" style={isActive ? undefined : { color: style.accent }} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="space-y-12 sm:space-y-16">
        {/* ========================================================
            MODULE 1: BEST TIME TO TREK & LIVE WEATHER
        ======================================================== */}
        {(activeTab === "all" || activeTab === "weather") && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  Best Time &amp; Live Mountain Weather
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
                {subRegionName}{regionName ? `, ${regionName}` : ""} Climatic Cycles
              </span>
            </div>

            {/* Live Weather Instrument Widget */}
            {coords && coords[0] !== 0 && (
              <div className="mb-6">
                <MountainWeatherWidget
                  locationName={`${title} (${subRegionName})`}
                  coords={coords}
                />
              </div>
            )}

            {/* 4 Seasons Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seasons.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-300 border flex flex-col justify-between ${
                      item.highlight
                        ? "bg-white dark:bg-[#080e1a] border-slate-300 dark:border-white/20 shadow-md ring-1 ring-slate-200 dark:ring-white/10"
                        : "bg-slate-50/90 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-8 h-8 rounded-xl flex items-center justify-center border"
                            style={{
                              backgroundColor: `${style.accent}15`,
                              color: style.accent,
                              borderColor: `${style.accent}30`
                            }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                            {item.season}
                          </h4>
                        </div>
                        <span 
                          className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: item.highlight ? `${style.accent}20` : "rgba(148,163,184,0.15)",
                            color: item.highlight ? style.accent : "inherit",
                          }}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 font-light text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span>Conditions</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{item.badge}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 2: TRAIL TIPS & OBSERVATIONS
        ======================================================== */}
        {(activeTab === "all" || activeTab === "tips") && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Lightbulb className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  Trail Tips &amp; Practical Advice
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
                Field Protocols
              </span>
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips && tips.length > 0 ? (
                tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm flex items-start gap-3.5 sm:gap-4"
                  >
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border"
                      style={{
                        backgroundColor: `${style.accent}15`,
                        color: style.accent,
                        borderColor: `${style.accent}30`,
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 font-light text-sm sm:text-base leading-relaxed">
                      {tip}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm flex items-start gap-3.5 sm:gap-4 md:col-span-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: style.accent }} />
                  <p className="text-slate-700 dark:text-slate-200 font-light text-base leading-relaxed">
                    Standard alpine precautions apply. Maintain early morning departures (before 6:00 AM) to clear high passes and summit ridges ahead of afternoon convective cloud cover and wind shifts.
                  </p>
                </div>
              )}
            </div>

            {/* Forestry Permits & Formalities Note */}
            {permits && (
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-100/90 dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 flex items-start gap-3.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: style.accent }} />
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block mb-1">
                    Trail Permits &amp; Forestry Regulations
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                    {permits}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            MODULE 3: MOUNTAIN SAFETY & EMERGENCY CONTACTS
        ======================================================== */}
        {(activeTab === "all" || activeTab === "safety") && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  Altitude Safety &amp; Emergency Protocols
                </h3>
              </div>
              <Link
                href="/safety"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider hover:underline min-h-[44px]"
                style={{ color: style.accent }}
              >
                <span>Medical Manual</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* The Three Golden Rules Directive */}
            <GoldenRulesCallout maxAltitude={maxAltitude} />

            {/* Emergency Hospital & SAR Helpline Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 flex items-center gap-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Hospital className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 block">Nearest Major Medical Facility</span>
                  <span className="font-display font-bold text-sm text-slate-900 dark:text-white">{nearestHospital}</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 flex items-center gap-3.5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 block">Emergency Rescue Dispatch</span>
                  <span className="font-display font-bold text-sm text-slate-900 dark:text-white">{emergencySAR}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 4: WHAT TO PACK & ESSENTIAL GEAR
        ======================================================== */}
        {(activeTab === "all" || activeTab === "packing") && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Backpack className="w-4 h-4" style={{ color: style.accent }} />
                <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                  What to Pack
                </h3>
              </div>
              <Link 
                href="/plan/packing"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-200 hover:scale-105 shrink-0 shadow-xs min-h-[40px]"
                style={{
                  borderColor: `${style.accent}40`,
                  color: style.accent,
                  backgroundColor: `${style.accent}12`,
                }}
              >
                <Backpack className="w-3.5 h-3.5" />
                <span>Interactive Packing Generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-slate-600 dark:text-slate-300 font-light text-sm">
              {isPatalsu
                ? "Essential alpine gear required for Patalsu's steep scree ascent, wind-blasted 4,200m ridge, and dry upper sections."
                : `Recommended alpine gear and equipment essentials required for the ${title} route.`}
            </p>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {packingList.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white dark:bg-[#080e1a] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-white/10 flex items-center gap-3.5 text-sm text-slate-800 dark:text-slate-200 font-light shadow-sm hover:border-slate-300 dark:hover:border-white/20 transition-all"
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border"
                    style={{
                      backgroundColor: `${style.accent}15`,
                      color: style.accent,
                      borderColor: `${style.accent}30`,
                    }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
