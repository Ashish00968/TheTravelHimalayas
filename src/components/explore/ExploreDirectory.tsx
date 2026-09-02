"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Compass, 
  Mountain, 
  Waves, 
  Footprints, 
  MapPin, 
  ArrowUpRight, 
  Clock, 
  TrendingUp,
  X
} from "lucide-react";
import { PlaceType } from "@/data/atlas";

export interface ExplorePlaceItem {
  id: string;
  name: string;
  type: PlaceType;
  emoji: string;
  image?: string;
  heroImage?: string;
  elevation?: string;
  bestSeason?: string;
  difficulty?: string;
  duration?: string;
  distance?: string;
  overview?: string;
  regionId: string;
  regionName: string;
  subRegionId: string;
  subRegionName: string;
  href: string;
}

interface ExploreDirectoryProps {
  places: ExplorePlaceItem[];
}

const CATEGORY_TABS = [
  { id: "all", label: "All Expeditions", icon: Compass },
  { id: "trek", label: "High-Altitude Treks", icon: Footprints },
  { id: "peak", label: "Summit Peaks", icon: Mountain },
  { id: "lake-pass", label: "Lakes & Passes", icon: Waves },
  { id: "day-hike", label: "Day Hikes & Trails", icon: MapPin },
] as const;

const TERRITORY_FILTERS = [
  { id: "all", label: "All Territories" },
  { id: "himachal-pradesh", label: "Himachal Pradesh", accent: "#F59E0B" },
  { id: "uttarakhand", label: "Uttarakhand", accent: "#0D9488" },
  { id: "ladakh", label: "Ladakh", accent: "#7C3AED" },
  { id: "jammu-kashmir", label: "Jammu & Kashmir", accent: "#3B82F6" },
] as const;

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string; border: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.20)", border: "rgba(59,130,246,0.30)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.20)", border: "rgba(245,158,11,0.30)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.20)", border: "rgba(124,58,237,0.30)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.20)", border: "rgba(13,148,136,0.30)" },
};

export function ExploreDirectory({ places }: ExploreDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTerritory, setSelectedTerritory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "elevation" | "alpha">("featured");

  // Filter logic
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      // Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "trek" && place.type !== "trek") return false;
        if (selectedCategory === "peak" && place.type !== "peak") return false;
        if (selectedCategory === "lake-pass") {
          const isLakeOrPass =
            place.type === "lake" ||
            place.type === "scenic" ||
            place.type === "road" ||
            place.name.toLowerCase().includes("pass") ||
            place.name.toLowerCase().includes("la") ||
            place.name.toLowerCase().includes("lake") ||
            place.name.toLowerCase().includes("tso");
          if (!isLakeOrPass) return false;
        }
        if (selectedCategory === "day-hike") {
          const isHike = place.type === "day-hike" || place.type === "spiritual" || place.type === "adventure";
          if (!isHike) return false;
        }
      }

      // Territory filter
      if (selectedTerritory !== "all" && place.regionId !== selectedTerritory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== "all") {
        if (!place.difficulty) return false;
        const diffLower = place.difficulty.toLowerCase();
        if (selectedDifficulty === "Difficult" && !(diffLower.includes("diff") || diffLower.includes("chal"))) {
          return false;
        }
        if (selectedDifficulty === "Moderate" && !diffLower.includes("mod")) {
          return false;
        }
        if (selectedDifficulty === "Easy" && !diffLower.includes("easy")) {
          return false;
        }
      }

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = place.name.toLowerCase().includes(q);
        const matchSub = place.subRegionName.toLowerCase().includes(q);
        const matchReg = place.regionName.toLowerCase().includes(q);
        const matchOverview = place.overview?.toLowerCase().includes(q);
        if (!matchName && !matchSub && !matchReg && !matchOverview) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "alpha") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "elevation") {
        const getMeters = (elev?: string) => {
          if (!elev) return 0;
          const match = elev.match(/([\d,]+)\s*m/);
          if (match) return parseInt(match[1].replace(/,/g, ""), 10);
          return 0;
        };
        return getMeters(b.elevation) - getMeters(a.elevation);
      }
      return 0;
    });
  }, [places, selectedCategory, selectedTerritory, selectedDifficulty, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedTerritory !== "all" ||
    selectedDifficulty !== "all" ||
    searchQuery.trim() !== "";

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedTerritory("all");
    setSelectedDifficulty("all");
    setSearchQuery("");
  };

  return (
    <div className="w-full">
      {/* Category Tab Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-300 border ${
                isActive
                  ? "bg-white/10 text-white border-white/25 shadow-[0_0_25px_rgba(255,255,255,0.12)]"
                  : "bg-[#080e1a] text-white/55 border-white/6 hover:text-white hover:border-white/15 hover:bg-white/4"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-white/40"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search & Sub-filters */}
      <div 
        className="p-5 md:p-6 rounded-3xl mb-10"
        style={{
          background: "#080e1a",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trails, peaks, valleys, or passes..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl text-sm text-white placeholder:text-white/35 focus:outline-none transition-all focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/15"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Territory Select */}
          <div className="lg:col-span-3">
            <select
              value={selectedTerritory}
              onChange={(e) => setSelectedTerritory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-xs text-white/85 focus:outline-none transition-all cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {TERRITORY_FILTERS.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#080e1a] text-white">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Select */}
          <div className="lg:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-xs text-white/85 focus:outline-none transition-all cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <option value="all" className="bg-[#080e1a] text-white">All Difficulties</option>
              <option value="Easy" className="bg-[#080e1a] text-white">Easy / Beginner</option>
              <option value="Moderate" className="bg-[#080e1a] text-white">Moderate</option>
              <option value="Difficult" className="bg-[#080e1a] text-white">Difficult / Technical</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "featured" | "elevation" | "alpha")}
              className="w-full px-4 py-3 rounded-2xl text-xs text-white/85 focus:outline-none transition-all cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <option value="featured" className="bg-[#080e1a] text-white">Sort: Featured</option>
              <option value="elevation" className="bg-[#080e1a] text-white">Highest Altitude</option>
              <option value="alpha" className="bg-[#080e1a] text-white">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/6 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <span className="font-mono text-white/70 font-semibold">{filteredPlaces.length}</span>
            <span>of {places.length} expeditions matching criteria</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Expeditions Grid */}
      {filteredPlaces.length === 0 ? (
        <div 
          className="p-16 rounded-3xl text-center flex flex-col items-center justify-center my-12"
          style={{ background: "#080e1a", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Compass className="w-12 h-12 text-white/20 mb-4 animate-spin-slow" />
          <h3 className="text-xl font-display font-semibold text-white mb-2">No expeditions found</h3>
          <p className="text-white/50 text-sm max-w-md mb-6 font-light">
            We couldn&apos;t find any routes matching your current filter parameters. Try clearing your filters or searching for another valley.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => {
            const style = TERRITORY_ACCENTS[place.regionId] ?? {
              accent: "#3B82F6",
              glow: "rgba(59,130,246,0.15)",
              border: "rgba(59,130,246,0.25)",
            };
            const imageSrc = place.heroImage || place.image;

            return (
              <Link
                key={place.id}
                href={place.href}
                className="group relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                style={{
                  background: "#0d1422",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = `${style.accent}50`;
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 12px 40px ${style.glow}, 0 4px 20px rgba(0,0,0,0.6)`;
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "";
                }}
              >
                <div>
                  {/* Image preview banner */}
                  {imageSrc ? (
                    <div 
                      className="relative w-full h-48 rounded-2xl overflow-hidden mb-5 bg-[#080e1a]" 
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <Image
                        src={imageSrc}
                        alt={place.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1422] via-transparent to-transparent opacity-80" />
                    </div>
                  ) : (
                    <div 
                      className="relative w-full h-24 rounded-2xl overflow-hidden mb-5 flex items-center justify-between px-5"
                      style={{ 
                        background: `linear-gradient(135deg, ${style.accent}15 0%, rgba(13,20,34,0.8) 100%)`,
                        border: "1px solid rgba(255,255,255,0.06)" 
                      }}
                    >
                      <span className="text-3xl drop-shadow-md">{place.emoji}</span>
                      <span 
                        className="font-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{ color: style.accent, background: `${style.accent}15`, border: `1px solid ${style.accent}30` }}
                      >
                        {place.type}
                      </span>
                    </div>
                  )}

                  {/* Badges Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span 
                      className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ 
                        color: style.accent, 
                        background: `${style.accent}15`, 
                        border: `1px solid ${style.accent}30` 
                      }}
                    >
                      {place.regionName}
                    </span>

                    <span 
                      className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white/50"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {place.subRegionName}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display tracking-tight font-bold text-xl sm:text-2xl text-white mb-2 group-hover:text-white/90 transition-colors flex items-center gap-2">
                    <span>{place.emoji}</span>
                    <span>{place.name}</span>
                  </h3>

                  {/* Overview */}
                  {place.overview && (
                    <p className="text-white/50 text-sm line-clamp-2 leading-relaxed mb-6 font-light">
                      {place.overview}
                    </p>
                  )}
                </div>

                {/* Footer Metrics */}
                <div 
                  className="pt-4 mt-auto border-t border-white/6 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    {place.elevation && (
                      <span className="inline-flex items-center gap-1 font-mono text-white/70">
                        <TrendingUp className="w-3 h-3 text-white/40" />
                        {place.elevation}
                      </span>
                    )}

                    {place.duration && (
                      <span className="inline-flex items-center gap-1 font-mono text-white/50">
                        <Clock className="w-3 h-3 text-white/30" />
                        {place.duration}
                      </span>
                    )}

                    {place.difficulty && (
                      <span 
                        className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{
                          background: place.difficulty.toLowerCase().includes("diff")
                            ? "rgba(239,68,68,0.15)"
                            : "rgba(245,158,11,0.15)",
                          color: place.difficulty.toLowerCase().includes("diff")
                            ? "#F87171"
                            : "#FBBF24",
                        }}
                      >
                        {place.difficulty}
                      </span>
                    )}
                  </div>

                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5"
                    style={{ background: `${style.accent}20`, color: style.accent }}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
