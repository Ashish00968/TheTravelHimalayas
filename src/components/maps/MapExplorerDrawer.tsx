"use client";

import { useState, useMemo } from "react";
import {
  Compass,
  Search,
  X,
  ChevronRight,
  Footprints,
  Mountain,
  Layers,
  PanelLeftClose,
} from "lucide-react";
import { HimalayaPlace } from "@/data/atlas";
import { Peak } from "@/data/types";

export interface VerifiedRouteMeta {
  id: string;
  name: string;
  region: string;
  valley: string;
  type: "trek" | "peak";
  maxAltitude: string;
  distance: string;
  difficulty: string;
  gain: string;
  overview: string;
}

export const VERIFIED_ROUTES_CATALOG: VerifiedRouteMeta[] = [
  {
    id: "hampta-pass",
    name: "Hampta Pass Trek",
    region: "Himachal Pradesh",
    valley: "Kullu to Lahaul",
    type: "trek",
    maxAltitude: "4,287m",
    distance: "21.5 km",
    difficulty: "Moderate-Difficult",
    gain: "+1,450m",
    overview: "Dramatic crossover from lush green Kullu pine meadows into the stark, barren trans-Himalayan desert of Spiti.",
  },
  {
    id: "beas-kund",
    name: "Beas Kund Glacial Tarn",
    region: "Himachal Pradesh",
    valley: "Solang / Dhundi",
    type: "trek",
    maxAltitude: "3,700m",
    distance: "10.7 km",
    difficulty: "Moderate",
    gain: "+860m",
    overview: "Sacred emerald glacial tarn cradled beneath the towering massifs of Hanuman Tibba, Friendship Peak, and Ladakhi.",
  },
  {
    id: "patalsu-peak",
    name: "Patalsu Peak Ascent",
    region: "Himachal Pradesh",
    valley: "Solang Valley",
    type: "peak",
    maxAltitude: "4,261m",
    distance: "14.0 km",
    difficulty: "Demanding",
    gain: "+1,835m",
    overview: "Non-technical alpine summit ridge offering commanding 360° panoramas of the Pir Panjal and Great Himalayan ranges.",
  },
  {
    id: "bhrigu-lake",
    name: "Bhrigu Lake Alpine Tarn",
    region: "Himachal Pradesh",
    valley: "Gulaba / Manali",
    type: "trek",
    maxAltitude: "4,300m",
    distance: "13.8 km",
    difficulty: "Moderate-Difficult",
    gain: "+1,300m",
    overview: "High-altitude sacred lake that never completely freezes, set amidst rolling alpine ridge grasslands.",
  },
  {
    id: "deo-tibba",
    name: "Mt. Deo Tibba Expedition",
    region: "Himachal Pradesh",
    valley: "Jagatsukh / Duhangan",
    type: "peak",
    maxAltitude: "6,001m",
    distance: "29.3 km",
    difficulty: "Extreme Alpine",
    gain: "+4,104m",
    overview: "Glaciated dome peak requiring technical ice climbing, fixed rope ascents, and high-altitude moraine navigation.",
  },
  {
    id: "chandrakhani-pass",
    name: "Chandrakhani Pass Trek",
    region: "Himachal Pradesh",
    valley: "Naggar / Malana",
    type: "trek",
    maxAltitude: "3,660m",
    distance: "14.3 km",
    difficulty: "Moderate",
    gain: "+1,200m",
    overview: "Ancient high shepherd crossover pass connecting Naggar in the Kullu Valley with the isolated sanctuary of Malana.",
  },
  {
    id: "lamadugh",
    name: "Lamadugh Meadow Circuit",
    region: "Himachal Pradesh",
    valley: "Old Manali",
    type: "trek",
    maxAltitude: "3,017m",
    distance: "10.6 km",
    difficulty: "Moderate",
    gain: "+960m",
    overview: "Steep ascent through ancient deodar and horse chestnut forests onto high alpine grazing meadows above Manali.",
  },
  {
    id: "jalori-pass-serolsar",
    name: "Jalori Pass & Serolsar Lake",
    region: "Himachal Pradesh",
    valley: "Tirthan / Seraj",
    type: "trek",
    maxAltitude: "3,188m",
    distance: "9.6 km",
    difficulty: "Easy-Moderate",
    gain: "+420m",
    overview: "Oak and rhododendron forest trail leading to the sacred tarn of Buddhi Nagin nestled on the ridge.",
  },
  {
    id: "kheerganga",
    name: "Kheerganga Pilgrim Trail",
    region: "Himachal Pradesh",
    valley: "Parvati Valley",
    type: "trek",
    maxAltitude: "2,960m",
    distance: "17.9 km",
    difficulty: "Moderate",
    gain: "+950m",
    overview: "Scenic gorge trail through waterfalls, pine forests, and apple orchards to natural geothermal sulfur hot springs.",
  },
  {
    id: "jogni-falls",
    name: "Jogni Falls Cascade Trail",
    region: "Himachal Pradesh",
    valley: "Vashisht / Manali",
    type: "trek",
    maxAltitude: "2,280m",
    distance: "4.5 km",
    difficulty: "Easy",
    gain: "+280m",
    overview: "Refreshing pine trail from Vashisht temple village to the sacred multi-tiered cascade above the Beas River.",
  },
];

const TERRITORY_OPTIONS = [
  { id: "all", label: "ALL", full: "All Territories", accent: "#38BDF8" },
  { id: "himachal-pradesh", label: "HP", full: "Himachal Pradesh", accent: "#F59E0B" },
  { id: "jammu-kashmir", label: "J&K", full: "Jammu & Kashmir", accent: "#60A5FA" },
  { id: "ladakh", label: "LD", full: "Ladakh", accent: "#A855F7" },
  { id: "uttarakhand", label: "UK", full: "Uttarakhand", accent: "#14B8A6" },
] as const;

interface MapExplorerDrawerProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  selectedId: string | null;
  activeRegionId: string | null;
  onSelectRoute: (routeId: string) => void;
  onSelectPlace: (place: HimalayaPlace) => void;
  onSelectRegion: (regionId: string) => void;
  onHoverEntity: (id: string | null) => void;
  peaks: Peak[];
  allPlaces: HimalayaPlace[];
}

export function MapExplorerDrawer({
  isOpen,
  onToggleOpen,
  selectedId,
  activeRegionId,
  onSelectRoute,
  onSelectPlace,
  onSelectRegion,
  onHoverEntity,
  peaks,
  allPlaces,
}: MapExplorerDrawerProps) {
  const [activeTab, setActiveTab] = useState<"trails" | "peaks" | "all">("trails");
  const [searchQuery, setSearchQuery] = useState("");
  const [territoryFilter, setTerritoryFilter] = useState<string>(() => activeRegionId ?? "all");

  // Filtered Verified Routes
  const filteredRoutes = useMemo(() => {
    let list = VERIFIED_ROUTES_CATALOG;
    if (territoryFilter !== "all") {
      const regionSlug = territoryFilter === "himachal-pradesh" ? "Himachal Pradesh" : territoryFilter;
      list = list.filter((r) => r.region.toLowerCase().includes(regionSlug.toLowerCase()));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.valley.toLowerCase().includes(q) ||
          r.maxAltitude.includes(q) ||
          r.difficulty.toLowerCase().includes(q)
      );
    }
    return list;
  }, [territoryFilter, searchQuery]);

  // Filtered Peaks
  const filteredPeaks = useMemo(() => {
    let list = peaks;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          String(p.height).includes(q)
      );
    }
    return list;
  }, [peaks, searchQuery]);

  // Filtered Atlas Destinations
  const filteredPlaces = useMemo(() => {
    let list = allPlaces;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.elevation?.includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }
    return list.slice(0, 40);
  }, [allPlaces, searchQuery]);

  return (
    <>
      {/* ── Docked Edge Handle (When Drawer is Closed) ────────────────────── */}
      {!isOpen && (
        <button
          onClick={onToggleOpen}
          title="Open Himalayan Explorer Drawer"
          aria-label="Open Himalayan Explorer Drawer"
          className="absolute top-4 sm:top-6 left-0 z-30 flex items-center gap-2.5 px-3.5 py-2.5 rounded-r-2xl bg-[#060a14]/90 hover:bg-[#080e1c] border-y border-r border-white/15 text-white shadow-[0_8px_32px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all cursor-pointer group hover:border-sky-400/40"
        >
          <Compass className="w-4 h-4 text-sky-400 group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-xs font-semibold tracking-wide">Trail Directory</span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-sky-500/15 text-sky-300 border border-sky-500/30">
            10 GPS
          </span>
        </button>
      )}

      {/* ── Main Collapsible Explorer Drawer ─────────────────────────────── */}
      <div
        className={`absolute top-0 left-0 bottom-0 z-20 w-[330px] sm:w-[370px] max-w-[calc(100vw-36px)] transition-transform duration-300 ease-out flex flex-col border-r border-white/[0.08] shadow-[16px_0_48px_rgba(0,0,0,0.85)] select-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, rgba(6, 10, 20, 0.95) 0%, rgba(4, 7, 15, 0.98) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {/* Integrated Edge Tab Handle (Attached directly to right border) */}
        {isOpen && (
          <button
            onClick={onToggleOpen}
            title="Collapse Explorer Drawer"
            aria-label="Collapse Explorer Drawer"
            className="absolute top-5 -right-9 z-30 w-9 h-11 rounded-r-xl flex items-center justify-center bg-[#060a14]/95 border-y border-r border-white/15 text-slate-400 hover:text-white hover:bg-white/10 hover:border-sky-400/40 backdrop-blur-2xl shadow-xl transition-all cursor-pointer group"
          >
            <PanelLeftClose className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
          </button>
        )}

        {/* ── Drawer Header ─────────────────────────────────────────────── */}
        <div className="p-3.5 sm:p-4 border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-100 leading-none">
                  Himalayan 3D Atlas
                </h3>
                <span className="text-[10px] font-mono text-emerald-400/90 leading-none flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  10 Verified GPS Tracks
                </span>
              </div>
            </div>

            <button
              onClick={onToggleOpen}
              className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trails, peaks, elevations…"
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-400/60 focus:bg-white/[0.06] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Territory Segmented Bar */}
          <div className="grid grid-cols-5 gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-3">
            {TERRITORY_OPTIONS.map((opt) => {
              const isSelected = territoryFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTerritoryFilter(opt.id);
                    if (opt.id !== "all") {
                      onSelectRegion(opt.id);
                    }
                  }}
                  title={opt.full}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white/10 text-white shadow-sm border border-white/15"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: opt.accent }}
                    />
                    <span>{opt.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Drawer Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <button
              onClick={() => setActiveTab("trails")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "trails"
                  ? "bg-white/10 text-white shadow-sm border border-white/15"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Footprints className="w-3.5 h-3.5 text-sky-400" />
              <span>Trails ({filteredRoutes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("peaks")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "peaks"
                  ? "bg-white/10 text-white shadow-sm border border-white/15"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Mountain className="w-3.5 h-3.5 text-amber-400" />
              <span>Summits ({filteredPeaks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-white/10 text-white shadow-sm border border-white/15"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Places</span>
            </button>
          </div>
        </div>

        {/* ── Drawer Body: Curated Cards ─────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2 scrollbar-thin scrollbar-thumb-white/15">
          {activeTab === "trails" && (
            <>
              <div className="flex items-center justify-between px-1 text-[9.5px] font-mono text-slate-400 uppercase tracking-wider">
                <span>Verified Field Routes</span>
                <span className="text-slate-400">{filteredRoutes.length} Available</span>
              </div>

              {filteredRoutes.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-mono">
                  No matching verified trails found.
                </div>
              ) : (
                filteredRoutes.map((route) => {
                  const isSelected = selectedId === route.id;
                  return (
                    <div
                      key={route.id}
                      onClick={() => onSelectRoute(route.id)}
                      onMouseEnter={() => onHoverEntity(route.id)}
                      onMouseLeave={() => onHoverEntity(null)}
                      className={`group relative p-3.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                        isSelected
                          ? "bg-sky-500/[0.08] border-sky-400/60 shadow-[0_4px_24px_rgba(56,189,248,0.15)] border-l-4 border-l-sky-400"
                          : "bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.07] hover:border-white/15"
                      }`}
                    >
                      {/* Overline & Elevation Badge */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[9.5px] font-mono tracking-wider uppercase text-slate-400 truncate">
                          {route.valley} · {route.region}
                        </span>
                        <span className="text-[10px] font-mono font-medium text-slate-200 bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded-md flex-shrink-0">
                          ▲ {route.maxAltitude}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-display font-semibold text-[13px] text-slate-100 group-hover:text-sky-300 transition-colors mb-1.5">
                        {route.name}
                      </h4>

                      {/* Overview */}
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {route.overview}
                      </p>

                      {/* Metrics Bar */}
                      <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-200 font-medium">{route.distance}</span>
                          <span className="text-white/20">|</span>
                          <span>{route.gain}</span>
                          <span className="text-white/20">|</span>
                          <span
                            className={
                              route.difficulty.includes("Extreme")
                                ? "text-rose-400"
                                : route.difficulty.includes("Demanding")
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }
                          >
                            {route.difficulty}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === "peaks" && (
            <>
              <div className="flex items-center justify-between px-1 text-[9.5px] font-mono text-slate-400 uppercase tracking-wider">
                <span>Himalayan Summits</span>
                <span className="text-slate-400">{filteredPeaks.length} Peaks</span>
              </div>

              {filteredPeaks.map((peak) => {
                const isSelected = selectedId === peak.slug;
                return (
                  <div
                    key={peak.slug}
                    onClick={() => {
                      const placeMatch = allPlaces.find((p) => p.id === peak.slug);
                      if (placeMatch) onSelectPlace(placeMatch);
                      else onSelectRoute(peak.slug);
                    }}
                    onMouseEnter={() => onHoverEntity(peak.slug)}
                    onMouseLeave={() => onHoverEntity(null)}
                    className={`group relative p-3.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? "bg-amber-500/[0.08] border-amber-400/60 shadow-[0_4px_24px_rgba(245,158,11,0.15)] border-l-4 border-l-amber-400"
                        : "bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.07] hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[9.5px] font-mono tracking-wider uppercase text-slate-400">
                        {peak.region}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md flex-shrink-0">
                        ▲ {peak.height}m
                      </span>
                    </div>

                    <h4 className="font-display font-semibold text-[13px] text-slate-100 group-hover:text-amber-300 transition-colors mb-1.5">
                      {peak.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
                      <span className="text-amber-300/80">{peak.difficulty} Expedition</span>
                      <div className="flex items-center gap-1 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all">
                        <span className="text-[10px]">3D Orbit</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {activeTab === "all" && (
            <>
              <div className="flex items-center justify-between px-1 text-[9.5px] font-mono text-slate-400 uppercase tracking-wider">
                <span>Featured Destinations</span>
                <span className="text-slate-400">{filteredPlaces.length} Results</span>
              </div>

              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  onClick={() => onSelectPlace(place)}
                  onMouseEnter={() => onHoverEntity(place.id)}
                  onMouseLeave={() => onHoverEntity(null)}
                  className="group flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.07] hover:border-white/15 transition-all cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs">{place.emoji}</span>
                      <span className="text-xs font-semibold text-slate-100 group-hover:text-sky-300 truncate">
                        {place.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-slate-400">
                      <span className="capitalize">{place.type}</span>
                      {place.elevation && <span>• {place.elevation}</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
