"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Mountain,
  Compass,
  ArrowUpRight,
  Search,
  Footprints,
  MapPin,
  Clock,
  TrendingUp,
} from "lucide-react";
import { HimalayaPlace, HimalayaRegion, HimalayaSubRegion } from "@/data/atlas";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

const EASE = [0.23, 1, 0.32, 1] as const;

type FilterTab = "all" | "places" | "treks" | "expeditions";
type SortOption = "featured" | "elevation" | "duration" | "alpha";

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
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [searchQuery, setSearchQuery] = useState("");

  // Categorize places cleanly into (1) Places, (2) Treks & Trails, (3) Expeditions
  const placesList = useMemo(
    () => subRegion.places.filter((p) => p.type !== "trek" && p.type !== "day-hike" && p.type !== "peak"),
    [subRegion.places]
  );
  const treksList = useMemo(
    () => subRegion.places.filter((p) => p.type === "trek" || p.type === "day-hike"),
    [subRegion.places]
  );
  const expeditionsList = useMemo(
    () => subRegion.places.filter((p) => p.type === "peak"),
    [subRegion.places]
  );

  const tabs = useMemo(() => {
    const list: { id: FilterTab; label: string; count: number; icon: React.ElementType }[] = [
      { id: "all", label: "All Destinations", count: subRegion.places.length, icon: MapPin },
    ];
    if (placesList.length > 0) list.push({ id: "places", label: "Places", count: placesList.length, icon: Compass });
    if (treksList.length > 0) list.push({ id: "treks", label: "Treks & Trails", count: treksList.length, icon: Footprints });
    if (expeditionsList.length > 0) list.push({ id: "expeditions", label: "Expeditions", count: expeditionsList.length, icon: Mountain });
    return list;
  }, [subRegion.places.length, placesList.length, treksList.length, expeditionsList.length]);

  const filteredPlaces = useMemo(() => {
    let list: HimalayaPlace[] = subRegion.places;
    if (activeFilter === "places") list = placesList;
    else if (activeFilter === "treks") list = treksList;
    else if (activeFilter === "expeditions") list = expeditionsList;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => 
        p.name.toLowerCase().includes(q) || 
        (p.overview && p.overview.toLowerCase().includes(q)) ||
        (p.elevation && p.elevation.toLowerCase().includes(q))
      );
    }

    // Sort options
    return [...list].sort((a, b) => {
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
      if (sortBy === "duration") {
        const getDays = (d?: string) => {
          if (!d) return 0;
          const match = d.match(/(\d+)\s*(?:day|hour)/i);
          return match ? parseInt(match[1], 10) : 0;
        };
        return getDays(b.duration) - getDays(a.duration);
      }
      return 0; // Default curated order
    });
  }, [subRegion.places, activeFilter, searchQuery, sortBy, placesList, treksList, expeditionsList]);

  const style = TERRITORY_STYLE[region.id] ?? { accent: "#3B82F6", glow: "rgba(59,130,246,0.15)" };

  return (
    <main className="min-h-screen pt-28 pb-24 relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Background Ambient Glow */}
      <div
        className="absolute top-20 right-1/4 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-30 dark:opacity-40"
        style={{ background: style.glow }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Explore", href: "/explore" },
              { label: region.name, href: `/explore/${state}` },
              { label: subRegion.name, href: `/explore/${state}/${division}` },
            ]}
          />
        </div>

        {/* Back Link */}
        <Link
          href={`/explore/${state}`}
          className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-8 text-[10px] font-bold uppercase tracking-[0.15em] group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to {region.name}
        </Link>

        {/* Division Header Hero */}
        <div 
          className="mb-10 p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl glass-museum-card border border-foreground/[0.08]"
        >
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40 dark:opacity-60"
            style={{ background: style.glow }}
          />
          <span 
            className="font-mono text-xs uppercase tracking-[0.2em] block mb-3 font-bold"
            style={{ color: style.accent }}
          >
            {region.name} • Valley
          </span>
          <h1 className="font-display tracking-tight font-bold text-4xl sm:text-5xl md:text-6xl text-foreground mb-5 leading-tight">
            {subRegion.name}
          </h1>
          {subRegion.tagline && (
            <p className="text-foreground/70 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
              {subRegion.tagline}
            </p>
          )}
        </div>

        {/* Top Category Filter & Search/Sort Section */}
        <div className="space-y-6 mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Filter Tabs matching (1) Places, (2) Treks/Trails, (3) Expeditions */}
            <div 
              className="flex flex-wrap gap-2 p-1.5 rounded-2xl w-fit bg-foreground/[0.04] border border-foreground/[0.08]"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-[11px] uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                      isActive 
                        ? "text-white font-bold" 
                        : "text-foreground/60 hover:text-foreground hover:bg-foreground/[0.06] font-medium"
                    }`}
                    style={isActive ? { background: style.accent, boxShadow: `0 0 20px ${style.glow}` } : {}}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white/25 text-white" : "bg-foreground/10 text-foreground/50"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Controls: Quick Search & Sort By */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Sort By Dropdown */}
              <div className="relative min-w-[170px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full pl-4 pr-9 py-3 rounded-2xl text-xs text-foreground bg-foreground/[0.04] border border-foreground/[0.1] focus:outline-none transition-all cursor-pointer font-mono font-medium appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                  }}
                >
                  <option value="featured" className="bg-background text-foreground">Sort: Featured</option>
                  <option value="elevation" className="bg-background text-foreground">Sort: Highest Elevation</option>
                  <option value="duration" className="bg-background text-foreground">Sort: Duration</option>
                  <option value="alpha" className="bg-background text-foreground">Sort: Alphabetical (A–Z)</option>
                </select>
              </div>

              {/* Quick Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${subRegion.name}...`}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-[13px] text-foreground placeholder:text-foreground/40 bg-foreground/[0.04] border border-foreground/[0.1] focus:outline-none transition-all"
                  onFocus={(e) => {
                    e.target.style.borderColor = style.accent;
                    e.target.style.boxShadow = `0 0 0 3px ${style.glow}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section Title — Clean, seamless without harsh divider line */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-display tracking-tight font-bold text-foreground">
              {activeFilter === "all" ? "All Destinations" : 
               activeFilter === "places" ? "Places & Scenic Highlights" : 
               activeFilter === "treks" ? "Treks & Alpine Trails" : "High-Altitude Expeditions"}
            </h2>
          </div>
          <span className="text-foreground/50 text-[11px] font-mono font-bold uppercase tracking-widest">
            {filteredPlaces.length} {filteredPlaces.length === 1 ? "result" : "results"}
          </span>
        </div>

        {/* Place Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${sortBy}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPlaces.map((item) => {
              const placeHero = item.heroImage || item.peakData?.heroImage || item.trekData?.heroImage || (item.images && item.images.length > 0 ? item.images[0] : undefined);
              const categoryLabel = 
                item.type === "peak" ? "Expedition" :
                (item.type === "trek" || item.type === "day-hike") ? "Trek & Trail" : "Place";

              return (
                <Link
                  key={item.id}
                  href={`/explore/${state}/${division}/${item.id}`}
                  className="group relative rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden bg-card dark:bg-[#080E1A] border border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div>
                    {/* Photo preview if available */}
                    {placeHero ? (
                      <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden mb-4 bg-muted/40 border border-slate-200/60 dark:border-white/[0.08]">
                        <Image
                          src={placeHero}
                          alt={`${item.name}${item.elevation ? ` (${item.elevation}m)` : ""} in ${subRegion.name}, ${region.name} — ${item.type}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-highland"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                        {/* Top Badges Overlay */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-md text-white border border-white/15">
                            {categoryLabel}
                          </span>
                          {item.difficulty && (
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md border ${
                              item.difficulty.toLowerCase().includes("diff")
                                ? "bg-rose-950/80 text-rose-300 border-rose-500/30"
                                : item.difficulty.toLowerCase().includes("mod")
                                ? "bg-amber-950/80 text-amber-300 border-amber-500/30"
                                : "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                            }`}>
                              {item.difficulty}
                            </span>
                          )}
                        </div>

                        {/* Bottom Overlay: Elevation */}
                        {item.elevation && (
                          <div className="absolute bottom-2.5 left-3 pointer-events-none">
                            <span className="text-[11px] font-mono font-bold text-white px-2.5 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/15 inline-flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-primary" />
                              {item.elevation}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4 p-4 flex flex-col justify-between bg-slate-100 dark:bg-[#0D1527] border border-slate-200/80 dark:border-white/[0.08]">
                        <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12] pointer-events-none">
                          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <pattern id={`div-topo-${item.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
                                <circle cx="12" cy="12" r="1" fill="currentColor" />
                                <path d="M 0 12 H 24 M 12 0 V 24" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill={`url(#div-topo-${item.id})`} />
                          </svg>
                        </div>

                        <div className="relative z-10 flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-foreground/[0.06] text-foreground/80 border border-foreground/[0.08]">
                            {categoryLabel}
                          </span>
                          {item.elevation && (
                            <span className="font-mono text-xs font-bold text-foreground/90">
                              {item.elevation}
                            </span>
                          )}
                        </div>

                        <div className="relative z-10 font-mono text-[9px] uppercase tracking-widest text-foreground/50">
                          Field Record &bull; {subRegion.name}
                        </div>
                      </div>
                    )}

                    {/* Valley Overline */}
                    <div className="flex items-center gap-2 mb-2 text-[11px] font-mono tracking-wider uppercase text-foreground/70">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: style.accent }} />
                      <span className="font-semibold text-foreground/90">{subRegion.name}</span>
                      <span className="opacity-40">•</span>
                      <span>{region.name}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display tracking-tight font-bold text-xl sm:text-2xl text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                      {item.name}
                    </h3>

                    {/* Field Overview */}
                    {item.overview && (
                      <p className="text-foreground/75 text-sm line-clamp-2 leading-relaxed mb-5 font-light">
                        {item.overview}
                      </p>
                    )}
                  </div>

                  {/* Footer Metrics */}
                  <div className="pt-3.5 mt-auto border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3 text-foreground/70">
                      {item.duration && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-foreground/45" />
                          <span>{item.duration}</span>
                        </span>
                      )}
                      {item.distance && (
                        <span className="inline-flex items-center gap-1.5">
                          <Footprints className="w-3.5 h-3.5 text-foreground/45" />
                          <span>{item.distance}</span>
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
          </motion.div>
        </AnimatePresence>

        {filteredPlaces.length === 0 && (
          <div 
            className="p-16 text-center text-foreground/50 font-light rounded-3xl bg-foreground/[0.02] border border-dashed border-foreground/15"
          >
            No places found matching &ldquo;{searchQuery}&rdquo; in this category.
          </div>
        )}
      </div>
    </main>
  );
}
