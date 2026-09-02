"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Compass,
  Mountain,
  Sparkles,
  ArrowRight,
  Search,
  Footprints,
  MapPin,
} from "lucide-react";
import { HimalayaPlace, HimalayaRegion, HimalayaSubRegion } from "@/data/atlas";

const EASE = [0.23, 1, 0.32, 1] as const;

type FilterTab = "all" | "trek" | "day-hike" | "peak" | "scenic";

const TERRITORY_STYLE: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.20)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.20)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.20)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.20)" },
};

interface DivisionClientProps {
  state: string;
  division: string;
  region: HimalayaRegion;
  subRegion: HimalayaSubRegion;
}

export function DivisionClient({
  state,
  division,
  region,
  subRegion,
}: DivisionClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const treks = useMemo(() => subRegion.places.filter((p) => p.type === "trek"), [subRegion.places]);
  const dayHikes = useMemo(() => subRegion.places.filter((p) => p.type === "day-hike"), [subRegion.places]);
  const peaks = useMemo(() => subRegion.places.filter((p) => p.type === "peak"), [subRegion.places]);
  const scenic = useMemo(() => subRegion.places.filter((p) => ["scenic", "lake", "spiritual", "adventure", "road"].includes(p.type)), [subRegion.places]);

  const tabs = useMemo(() => {
    const list: { id: FilterTab; label: string; count: number; icon: React.ElementType }[] = [
      { id: "all", label: "All Places", count: subRegion.places.length, icon: MapPin },
    ];
    if (treks.length > 0) list.push({ id: "trek", label: "Treks", count: treks.length, icon: Compass });
    if (dayHikes.length > 0) list.push({ id: "day-hike", label: "Day Hikes", count: dayHikes.length, icon: Footprints });
    if (peaks.length > 0) list.push({ id: "peak", label: "Peaks", count: peaks.length, icon: Mountain });
    if (scenic.length > 0) list.push({ id: "scenic", label: "Scenic", count: scenic.length, icon: Sparkles });
    return list;
  }, [subRegion.places.length, treks.length, dayHikes.length, peaks.length, scenic.length]);

  const filteredPlaces = useMemo(() => {
    let list: HimalayaPlace[] = subRegion.places;
    if (activeFilter === "trek") list = treks;
    else if (activeFilter === "day-hike") list = dayHikes;
    else if (activeFilter === "peak") list = peaks;
    else if (activeFilter === "scenic") list = scenic;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.overview && p.overview.toLowerCase().includes(q)));
    }
    return list;
  }, [subRegion.places, activeFilter, searchQuery, treks, dayHikes, peaks, scenic]);

  const style = TERRITORY_STYLE[region.id] ?? { accent: "#3B82F6", glow: "rgba(59,130,246,0.15)" };

  return (
    <main className="min-h-screen pt-28 pb-24 relative overflow-hidden" style={{ background: "#040812" }}>
      {/* Background Ambient Glow */}
      <div
        className="absolute top-20 right-1/4 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-40"
        style={{ background: style.glow }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-40" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Breadcrumb */}
        <Link
          href={`/explore/${state}`}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-[10px] font-bold uppercase tracking-[0.15em] group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to {region.name}
        </Link>

        {/* Division Header Hero */}
        <div 
          className="mb-10 p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl"
          style={{ background: "#080e1a", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-60"
            style={{ background: style.glow }}
          />
          <span 
            className="font-mono text-xs uppercase tracking-[0.2em] block mb-3 font-bold"
            style={{ color: style.accent }}
          >
            {region.name} • Valley
          </span>
          <h1 className="font-display tracking-tight font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-5 leading-tight">
            {subRegion.name}
          </h1>
          {subRegion.tagline && (
            <p className="text-white/60 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
              {subRegion.tagline}
            </p>
          )}
        </div>

        {/* Top Category Filter & Search Section */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            {/* Filter Tabs */}
            <div 
              className="flex flex-wrap gap-2 p-1.5 rounded-2xl w-fit"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-[11px] uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                      isActive ? "text-white font-bold" : "text-white/50 hover:text-white hover:bg-white/5 font-medium"
                    }`}
                    style={isActive ? { background: style.accent, boxShadow: `0 0 20px ${style.glow}` } : {}}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/40"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${subRegion.name}...`}
                className="w-full pl-11 pr-4 py-3 rounded-2xl text-[13px] placeholder:text-white/30 focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fff",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = style.accent;
                  e.target.style.boxShadow = `0 0 0 3px ${style.glow}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Section Title */}
        <div className="flex items-center justify-between mb-8 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-display tracking-tight font-bold text-white">
              {activeFilter === "all" ? "All Places" : 
               activeFilter === "trek" ? "Multi-Day Treks" : 
               activeFilter === "day-hike" ? "Day Hikes" : 
               activeFilter === "peak" ? "Peaks & Expeditions" : "Scenic & Sanctuaries"}
            </h2>
          </div>
          <span className="text-white/40 text-[11px] font-mono font-bold uppercase tracking-widest">
            {filteredPlaces.length} {filteredPlaces.length === 1 ? "result" : "results"}
          </span>
        </div>

        {/* Place Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPlaces.map((item) => {
              const placeHero = item.heroImage || item.peakData?.heroImage || item.trekData?.heroImage;
              return (
                <Link
                  key={item.id}
                  href={`/explore/${state}/${division}/${item.id}`}
                  className="group block relative p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between"
                  style={{
                    background: "#080e1a",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = `${style.accent}50`;
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 10px 40px ${style.glow}, 0 4px 20px rgba(0,0,0,0.6)`;
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "";
                  }}
                >
                  <div>
                    {/* Photo preview if available */}
                    {placeHero && (
                      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                        <Image
                          src={placeHero}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[0.23,1,0.32,1]"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl drop-shadow-md">{item.emoji}</span>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                        >
                          {item.type}
                        </span>
                        {item.difficulty && (
                          <span 
                            className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                            style={{ background: `${style.accent}15`, border: `1px solid ${style.accent}30`, color: style.accent }}
                          >
                            {item.difficulty}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-display tracking-tight font-bold text-xl sm:text-2xl text-white mb-3 group-hover:text-white/90 transition-colors">
                      {item.name}
                    </h3>

                    {item.overview && (
                      <p className="text-white/50 text-sm line-clamp-2 leading-relaxed mb-6 font-light">
                        {item.overview}
                      </p>
                    )}
                  </div>

                  <div 
                    className="pt-4 flex items-center justify-between mt-auto text-[11px] text-white/40 font-mono font-bold uppercase tracking-widest"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center gap-2">
                      {item.elevation && <span>{item.elevation}</span>}
                      {item.duration && (
                        <>
                          <span className="text-white/20">•</span>
                          <span>{item.duration}</span>
                        </>
                      )}
                    </div>
                    <span 
                      className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                      style={{ color: style.accent }}
                    >
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredPlaces.length === 0 && (
          <div 
            className="p-16 text-center text-white/40 font-light rounded-3xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}
          >
            No places found matching &ldquo;{searchQuery}&rdquo; in this category.
          </div>
        )}
      </div>
    </main>
  );
}
