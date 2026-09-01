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

const TRANSITION_EASE = [0.23, 1, 0.32, 1] as const;

type FilterTab = "all" | "trek" | "day-hike" | "peak" | "scenic";

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

  const treks = useMemo(
    () => subRegion.places.filter((p) => p.type === "trek"),
    [subRegion.places]
  );
  const dayHikes = useMemo(
    () => subRegion.places.filter((p) => p.type === "day-hike"),
    [subRegion.places]
  );
  const peaks = useMemo(
    () => subRegion.places.filter((p) => p.type === "peak"),
    [subRegion.places]
  );
  const scenic = useMemo(
    () =>
      subRegion.places.filter(
        (p) =>
          p.type === "scenic" ||
          p.type === "lake" ||
          p.type === "spiritual" ||
          p.type === "adventure" ||
          p.type === "road"
      ),
    [subRegion.places]
  );

  const tabs = useMemo(() => {
    const list: { id: FilterTab; label: string; count: number; icon: React.ElementType }[] = [
      { id: "all", label: "All Places", count: subRegion.places.length, icon: MapPin },
    ];
    if (treks.length > 0) {
      list.push({ id: "trek", label: "Treks", count: treks.length, icon: Compass });
    }
    if (dayHikes.length > 0) {
      list.push({ id: "day-hike", label: "Day Hikes", count: dayHikes.length, icon: Footprints });
    }
    if (peaks.length > 0) {
      list.push({ id: "peak", label: "Peaks & Expeditions", count: peaks.length, icon: Mountain });
    }
    if (scenic.length > 0) {
      list.push({ id: "scenic", label: "Scenic & Sanctuaries", count: scenic.length, icon: Sparkles });
    }
    return list;
  }, [subRegion.places.length, treks.length, dayHikes.length, peaks.length, scenic.length]);

  const filteredPlaces = useMemo(() => {
    let list: HimalayaPlace[] = subRegion.places;

    if (activeFilter === "trek") {
      list = treks;
    } else if (activeFilter === "day-hike") {
      list = dayHikes;
    } else if (activeFilter === "peak") {
      list = peaks;
    } else if (activeFilter === "scenic") {
      list = scenic;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.overview && p.overview.toLowerCase().includes(q)) ||
          (p.difficulty && p.difficulty.toLowerCase().includes(q))
      );
    }

    return list;
  }, [subRegion.places, activeFilter, searchQuery, treks, dayHikes, peaks, scenic]);

  return (
    <main className="min-h-screen bg-background pt-28 pb-24 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-20 right-1/4 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-40" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Breadcrumb back to State */}
        <Link
          href={`/explore/${state}`}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-xs font-mono uppercase tracking-wider group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to {region.name}
        </Link>

        {/* Division Header Hero */}
        <div className="mb-10 p-8 md:p-12 rounded-3xl bg-surface border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <span className="font-mono text-xs text-primary uppercase tracking-[0.2em] block mb-2">
            {region.name} • Valley / Division
          </span>
          <h1 className="font-display tracking-tight font-semibold text-3xl sm:text-5xl md:text-6xl text-white mb-4">
            {subRegion.name}
          </h1>
          {subRegion.tagline && (
            <p className="text-white/70 text-base sm:text-lg max-w-3xl font-light leading-relaxed">
              {subRegion.tagline}
            </p>
          )}
        </div>

        {/* Top Category Filter & Search Section */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-surface border border-white/10 w-fit">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? "bg-primary text-white font-semibold shadow-md shadow-primary/30"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${subRegion.name}...`}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-white/10 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-primary font-light"
              />
            </div>
          </div>
        </div>

        {/* Content Section Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-display tracking-tight font-semibold text-white">
              {activeFilter === "all"
                ? "All Places & Expeditions"
                : activeFilter === "trek"
                ? "Multi-Day Treks & Trails"
                : activeFilter === "day-hike"
                ? "Scenic Day Hikes"
                : activeFilter === "peak"
                ? "Mountaineering Peaks & Summits"
                : "Scenic Sanctuaries & Lakes"}
            </h2>
          </div>
          <span className="text-white/40 text-xs font-mono">
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
            transition={{ duration: 0.35, ease: TRANSITION_EASE }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPlaces.map((item) => {
              const placeHero =
                item.heroImage ||
                item.peakData?.heroImage ||
                item.trekData?.heroImage;

              return (
                <Link
                  key={item.id}
                  href={`/explore/${state}/${division}/${item.id}`}
                  className="group block relative p-7 rounded-3xl bg-surface hover:bg-[#121216] border border-white/10 hover:border-primary/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Photo preview if available */}
                    {placeHero && (
                      <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-5 border border-white/10">
                        <Image
                          src={placeHero}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10">
                          {item.type}
                        </span>
                        {item.difficulty && (
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {item.difficulty}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-display tracking-tight font-semibold text-xl sm:text-2xl text-white mb-3 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>

                    {item.overview && (
                      <p className="text-white/60 text-sm line-clamp-2 leading-relaxed mb-6 font-light">
                        {item.overview}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto text-xs text-white/50 font-mono">
                    <div className="flex items-center gap-2">
                      {item.elevation && <span>{item.elevation}</span>}
                      {item.duration && (
                        <>
                          <span>•</span>
                          <span>{item.duration}</span>
                        </>
                      )}
                    </div>
                    <span className="text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredPlaces.length === 0 && (
          <div className="p-16 text-center text-white/40 font-light rounded-3xl bg-surface border border-white/10">
            No places found matching &ldquo;{searchQuery}&rdquo; in this category.
          </div>
        )}
      </div>
    </main>
  );
}
