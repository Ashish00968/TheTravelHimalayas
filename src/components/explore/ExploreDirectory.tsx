"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Compass, 
  Mountain, 
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
  { id: "all", label: "All Destinations", icon: Compass },
  { id: "places", label: "Places", icon: MapPin },
  { id: "treks", label: "Treks & Trails", icon: Footprints },
  { id: "expeditions", label: "Expeditions", icon: Mountain },
] as const;

const TERRITORY_FILTERS = [
  { id: "all", label: "All Territories" },
  { id: "himachal-pradesh", label: "Himachal Pradesh", accent: "#F59E0B" },
  { id: "uttarakhand", label: "Uttarakhand", accent: "#0D9488" },
  { id: "ladakh", label: "Ladakh", accent: "#7C3AED" },
  { id: "jammu-kashmir", label: "Jammu & Kashmir", accent: "#3B82F6" },
] as const;

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string; border: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.18)", border: "rgba(59,130,246,0.30)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.18)", border: "rgba(245,158,11,0.30)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.18)", border: "rgba(124,58,237,0.30)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.18)", border: "rgba(13,148,136,0.30)" },
};

export function ExploreDirectory({ places }: ExploreDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTerritory, setSelectedTerritory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "elevation" | "alpha">("featured");

  // Filter & Search Logic
  const filteredPlaces = useMemo(() => {
    return places
      .filter((place) => {
        // Category Filter
        if (selectedCategory !== "all") {
          if (selectedCategory === "places" && (place.type === "trek" || place.type === "peak" || place.type === "day-hike")) return false;
          if (selectedCategory === "treks" && place.type !== "trek" && place.type !== "day-hike") return false;
          if (selectedCategory === "expeditions" && place.type !== "peak") return false;
        }

        // Territory Filter
        if (selectedTerritory !== "all" && place.regionId !== selectedTerritory) {
          return false;
        }

        // Difficulty Filter
        if (selectedDifficulty !== "all") {
          const placeDiff = (place.difficulty || "").toLowerCase();
          if (selectedDifficulty === "Easy" && !placeDiff.includes("easy")) return false;
          if (selectedDifficulty === "Moderate" && !placeDiff.includes("mod")) return false;
          if (selectedDifficulty === "Difficult" && !placeDiff.includes("diff") && !placeDiff.includes("tech") && !placeDiff.includes("stren")) return false;
        }

        // Free-text Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = place.name.toLowerCase().includes(q);
          const matchOverview = (place.overview || "").toLowerCase().includes(q);
          const matchRegion = place.regionName.toLowerCase().includes(q);
          const matchSubregion = place.subRegionName.toLowerCase().includes(q);
          const matchAlt = (place.elevation || "").toLowerCase().includes(q);
          if (!matchName && !matchOverview && !matchRegion && !matchSubregion && !matchAlt) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "alpha") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "elevation") {
          const getMeters = (elevationStr?: string) => {
            if (!elevationStr) return 0;
            const match = elevationStr.replace(/,/g, "").match(/\d+/);
            return match ? parseInt(match[0], 10) : 0;
          };
          return getMeters(b.elevation) - getMeters(a.elevation);
        }
        return 0; // Default order
      });
  }, [places, selectedCategory, selectedTerritory, selectedDifficulty, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedTerritory("all");
    setSelectedDifficulty("all");
    setSearchQuery("");
    setSortBy("featured");
  };

  const hasActiveFilters = 
    selectedCategory !== "all" || 
    selectedTerritory !== "all" || 
    selectedDifficulty !== "all" || 
    searchQuery.trim() !== "" || 
    sortBy !== "featured";

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
                  ? "bg-slate-900 text-white dark:bg-sky-500/20 dark:text-sky-200 dark:border-sky-400/50 shadow-sm font-bold"
                  : "glass-capsule text-foreground/75 hover:text-foreground hover:bg-foreground/[0.06] border-foreground/[0.08]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white dark:text-sky-300" : "text-sky-500 dark:text-sky-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search & Sub-filters */}
      <div 
        className="p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl mb-8 sm:mb-10 glass-museum-card border border-foreground/[0.08]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-center">
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-foreground/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trails, peaks, valleys, or passes..."
              className="w-full pl-11 pr-10 py-3 min-h-[44px] rounded-2xl text-base sm:text-xs text-foreground placeholder:text-foreground/40 bg-background border border-foreground/[0.1] focus:outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground p-1 min-w-[36px] min-h-[36px] flex items-center justify-center"
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
              className="w-full px-4 py-3 min-h-[44px] rounded-2xl text-base sm:text-xs text-foreground bg-background border border-foreground/[0.1] focus:outline-none transition-all cursor-pointer"
            >
              {TERRITORY_FILTERS.map((t) => (
                <option key={t.id} value={t.id} className="bg-background text-foreground">
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
              className="w-full px-4 py-3 min-h-[44px] rounded-2xl text-base sm:text-xs text-foreground bg-background border border-foreground/[0.1] focus:outline-none transition-all cursor-pointer"
            >
              <option value="all" className="bg-background text-foreground">All Difficulties</option>
              <option value="Easy" className="bg-background text-foreground">Easy / Beginner</option>
              <option value="Moderate" className="bg-background text-foreground">Moderate</option>
              <option value="Difficult" className="bg-background text-foreground">Difficult / Technical</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "featured" | "elevation" | "alpha")}
              className="w-full px-4 py-3 min-h-[44px] rounded-2xl text-base sm:text-xs text-foreground bg-background border border-foreground/[0.1] focus:outline-none transition-all cursor-pointer"
            >
              <option value="featured" className="bg-background text-foreground">Sort: Featured</option>
              <option value="elevation" className="bg-background text-foreground">Highest Altitude</option>
              <option value="alpha" className="bg-background text-foreground">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-foreground/[0.08] text-xs text-foreground/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-foreground font-semibold">{filteredPlaces.length}</span>
            <span>of {places.length} expeditions matching criteria</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium transition-colors"
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
          className="p-16 rounded-3xl text-center flex flex-col items-center justify-center my-12 glass-museum-card border border-foreground/[0.08]"
        >
          <Compass className="w-12 h-12 text-foreground/20 mb-4 animate-spin-slow" />
          <h3 className="text-xl font-display font-semibold text-foreground mb-2">No expeditions found</h3>
          <p className="text-foreground/70 text-sm max-w-md mb-6 font-light">
            We couldn&apos;t find any routes matching your current filter parameters. Try clearing your filters or searching for another valley.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-md"
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
            const categoryBadge =
              place.type === "peak"
                ? "Expedition"
                : place.type === "trek" || place.type === "day-hike"
                ? "Trek & Trail"
                : "Place";

            return (
              <Link
                key={place.href || `${place.regionName}-${place.subRegionName}-${place.id}`}
                href={place.href}
                className="group relative rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white dark:bg-[#111622] border border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Image preview banner */}
                  {imageSrc ? (
                    <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden mb-4 bg-muted/40 border border-slate-200/60 dark:border-white/[0.08]">
                      <Image
                        src={imageSrc}
                        alt={`${place.name} (${place.elevation || ""}) — ${place.type} trail in ${place.subRegionName || ""}, ${place.regionName || ""}`.replace(/\s+/g, " ").trim()}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Top Overlay Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-white border border-white/20 shadow-sm preserve-white-text">
                          {categoryBadge}
                        </span>
                        {place.difficulty && (
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md border shadow-sm preserve-white-text ${
                            place.difficulty.toLowerCase().includes("diff")
                              ? "bg-rose-950/85 text-rose-200 border-rose-500/40"
                              : place.difficulty.toLowerCase().includes("mod")
                              ? "bg-amber-950/85 text-amber-200 border-amber-500/40"
                              : "bg-emerald-950/85 text-emerald-200 border-emerald-500/40"
                          }`}>
                            {place.difficulty}
                          </span>
                        )}
                      </div>

                      {/* Bottom Overlay: Elevation */}
                      {place.elevation && (
                        <div className="absolute bottom-2.5 left-3 pointer-events-none">
                          <span className="text-[11px] font-mono font-bold text-white px-2.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-md border border-white/20 shadow-sm preserve-white-text inline-flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3 text-sky-400" />
                            {place.elevation}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4 p-4 flex flex-col justify-between bg-slate-100 dark:bg-[#121722] border border-slate-200/80 dark:border-white/10">
                      {/* Topographic pattern background */}
                      <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.14] pointer-events-none">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id={`topo-${place.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
                              <circle cx="12" cy="12" r="1" fill="currentColor" />
                              <path d="M 0 12 H 24 M 12 0 V 24" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#topo-${place.id})`} />
                        </svg>
                      </div>

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-300/80 dark:border-white/10">
                          {categoryBadge}
                        </span>
                        {place.elevation && (
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            {place.elevation}
                          </span>
                        )}
                      </div>

                      <div className="relative z-10 font-mono text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Topographic Survey &bull; {place.subRegionName}
                      </div>
                    </div>
                  )}

                  {/* Territory & Valley Overline */}
                  <div className="flex items-center gap-2 mb-2 text-[11px] font-mono tracking-wider uppercase text-foreground/70">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: style.accent }} />
                    <span className="font-semibold text-foreground/90">{place.regionName}</span>
                    <span className="opacity-40">•</span>
                    <span className="truncate">{place.subRegionName}</span>
                  </div>

                  {/* Clean Editorial Title (No cartoon emoji) */}
                  <h3 className="font-display tracking-tight font-bold text-xl sm:text-2xl text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                    {place.name}
                  </h3>

                  {/* Field Overview */}
                  {place.overview && (
                    <p className="text-foreground/75 text-sm line-clamp-2 leading-relaxed mb-5 font-light">
                      {place.overview}
                    </p>
                  )}
                </div>

                {/* Footer Metrics */}
                <div className="pt-3.5 mt-auto border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3 text-foreground/70">
                    {place.duration && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-foreground/45" />
                        <span>{place.duration}</span>
                      </span>
                    )}
                    {place.distance && (
                      <span className="inline-flex items-center gap-1.5">
                        <Footprints className="w-3.5 h-3.5 text-foreground/45" />
                        <span>{place.distance}</span>
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary group-hover:translate-x-1 transition-transform">
                    <span>Dossier</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
