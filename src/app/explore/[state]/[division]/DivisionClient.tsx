"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Mountain,
  Sparkles,
  ArrowRight,
  Search,
  Footprints,
  MapPin,
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
    if (placesList.length > 0) list.push({ id: "places", label: "Places", count: placesList.length, icon: Sparkles });
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
              const placeHero = item.heroImage || item.peakData?.heroImage || item.trekData?.heroImage;
              const categoryLabel = 
                item.type === "peak" ? "Expedition" :
                (item.type === "trek" || item.type === "day-hike") ? "Trek & Trail" : "Place";

              return (
                <Link
                  key={item.id}
                  href={`/explore/${state}/${division}/${item.id}`}
                  className="group block relative p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between glass-museum-card border border-foreground/[0.08] hover:border-foreground/[0.22] shadow-lg hover:shadow-xl"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = `${style.accent}50`;
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 10px 30px ${style.glow}`;
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "";
                  }}
                >
                  <div>
                    {/* Photo preview if available */}
                    {placeHero && (
                      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5 border border-foreground/[0.08]">
                        <Image
                          src={placeHero}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-highland"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl drop-shadow-md">{item.emoji}</span>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-foreground/[0.04] border border-foreground/[0.1] text-foreground/75"
                        >
                          {categoryLabel}
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

                    <h3 className="font-display tracking-tight font-bold text-xl sm:text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>

                    {item.overview && (
                      <p className="text-foreground/65 text-sm line-clamp-2 leading-relaxed mb-6 font-light">
                        {item.overview}
                      </p>
                    )}
                  </div>

                  <div 
                    className="pt-4 flex items-center justify-between mt-auto text-[11px] text-foreground/50 font-mono font-bold uppercase tracking-widest border-t border-foreground/[0.06]"
                  >
                    <div className="flex items-center gap-2">
                      {item.elevation && <span>{item.elevation}</span>}
                      {item.duration && (
                        <>
                          <span className="text-foreground/30">•</span>
                          <span>{item.duration}</span>
                        </>
                      )}
                    </div>
                    <span 
                      className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform font-bold"
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
            className="p-16 text-center text-foreground/50 font-light rounded-3xl bg-foreground/[0.02] border border-dashed border-foreground/15"
          >
            No places found matching &ldquo;{searchQuery}&rdquo; in this category.
          </div>
        )}
      </div>
    </main>
  );
}
