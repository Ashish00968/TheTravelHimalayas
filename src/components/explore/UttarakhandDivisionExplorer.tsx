"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ArrowRight, Mountain, Trees, Compass } from "lucide-react";
import type { HimalayaSubRegion, HimalayaPlace } from "@/data/atlas";

interface Props {
  garhwalDistricts: HimalayaSubRegion[];
  kumaonDistricts: HimalayaSubRegion[];
  state: string;
  accentColor?: string;
  glowColor?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function UttarakhandDivisionExplorer({
  garhwalDistricts,
  kumaonDistricts,
  state,
  accentColor = "#0D9488",
  glowColor = "rgba(13,148,136,0.25)",
}: Props) {
  const [activeDivision, setActiveDivision] = useState<"Garhwal" | "Kumaon" | null>(null);

  // Sync with URL hash on mount or hash change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#garhwal") setActiveDivision("Garhwal");
      else if (hash === "#kumaon") setActiveDivision("Kumaon");
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const toggleDivision = (division: "Garhwal" | "Kumaon") => {
    if (activeDivision === division) {
      setActiveDivision(null);
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      setActiveDivision(division);
      window.history.replaceState(null, "", `#${division.toLowerCase()}`);
    }
  };

  const cleanGarhwalDistricts = garhwalDistricts.filter((d) => d.id !== "garhwal");
  const cleanKumaonDistricts = kumaonDistricts.filter((d) => d.id !== "kumaon");
  const garhwalPlacesCount = cleanGarhwalDistricts.reduce((acc, d) => acc + d.places.length, 0) + (garhwalDistricts.find(d => d.id === "garhwal")?.places.length || 0);
  const kumaonPlacesCount = cleanKumaonDistricts.reduce((acc, d) => acc + d.places.length, 0);

  return (
    <div className="space-y-12 relative">
      <div
        className="absolute top-0 left-1/3 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20 dark:opacity-30"
        style={{ background: glowColor }}
      />
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-foreground/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <Compass className="w-3.5 h-3.5" />
            Two Historic Divisions
          </div>
          <h2 className="font-display tracking-tight font-bold text-3xl sm:text-4xl text-foreground mb-2">
            Explore Uttarakhand by Division
          </h2>
          <p className="text-foreground/65 text-base font-light max-w-2xl">
            Uttarakhand is divided into two distinct mountain regions: Garhwal in the west and Kumaon in the east. Click a division to open and explore its districts.
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-foreground/50">
          2 Divisions · 13 Districts · {garhwalPlacesCount + kumaonPlacesCount} Destinations
        </span>
      </div>

      {/* The Two Main Division Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Garhwal Division Card */}
        <div
          onClick={() => toggleDivision("Garhwal")}
          className={`group relative rounded-3xl p-8 sm:p-10 cursor-pointer transition-all duration-500 flex flex-col justify-between min-h-[320px] overflow-hidden glass-museum-card border ${
            activeDivision === "Garhwal"
              ? "border-emerald-500/60 shadow-2xl ring-2 ring-emerald-500/30"
              : "border-foreground/[0.08] hover:border-foreground/[0.25] shadow-lg hover:shadow-2xl"
          }`}
          style={{
            boxShadow: activeDivision === "Garhwal" ? `0 12px 40px rgba(16,185,129,0.2)` : undefined,
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
              activeDivision === "Garhwal" ? "opacity-35 bg-emerald-500" : "opacity-15 bg-emerald-500 group-hover:opacity-25"
            }`}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Mountain className="w-3 h-3" />
                Garhwal Division
              </span>
              <span className="text-xs font-mono font-semibold text-foreground/50">
                7 Districts · {garhwalPlacesCount} Destinations
              </span>
            </div>

            <h3 className="font-display tracking-tight font-bold text-3xl sm:text-4xl text-foreground mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Garhwal
            </h3>

            <p className="text-foreground/70 text-sm sm:text-base font-light leading-relaxed mb-6 max-w-md">
              Sacred river origins of the holy Ganga and Yamuna, ancient Char Dham shrines, UNESCO Valley of Flowers, and expansive high-altitude alpine bugyals.
            </p>

            {/* Preview Pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {cleanGarhwalDistricts.map((d) => (
                <span
                  key={d.id}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-foreground/[0.04] border border-foreground/[0.06] text-foreground/70"
                >
                  {d.name}
                </span>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="relative z-10 pt-5 border-t border-foreground/[0.08] flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
              {activeDivision === "Garhwal" ? "Close Garhwal Districts" : "Click to Open Garhwal"}
              <motion.div
                animate={{ rotate: activeDivision === "Garhwal" ? 180 : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </div>

            <Link
              href={`/explore/${state}/garhwal`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-foreground/50 hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-foreground/[0.05]"
              title="View dedicated Garhwal Division page"
            >
              Dedicated Page
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Kumaon Division Card */}
        <div
          onClick={() => toggleDivision("Kumaon")}
          className={`group relative rounded-3xl p-8 sm:p-10 cursor-pointer transition-all duration-500 flex flex-col justify-between min-h-[320px] overflow-hidden glass-museum-card border ${
            activeDivision === "Kumaon"
              ? "border-teal-500/60 shadow-2xl ring-2 ring-teal-500/30"
              : "border-foreground/[0.08] hover:border-foreground/[0.25] shadow-lg hover:shadow-2xl"
          }`}
          style={{
            boxShadow: activeDivision === "Kumaon" ? `0 12px 40px rgba(13,148,136,0.2)` : undefined,
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
              activeDivision === "Kumaon" ? "opacity-35 bg-teal-500" : "opacity-15 bg-teal-500 group-hover:opacity-25"
            }`}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                <Trees className="w-3 h-3" />
                Kumaon Division
              </span>
              <span className="text-xs font-mono font-semibold text-foreground/50">
                6 Districts · {kumaonPlacesCount} Destinations
              </span>
            </div>

            <h3 className="font-display tracking-tight font-bold text-3xl sm:text-4xl text-foreground mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              Kumaon
            </h3>

            <p className="text-foreground/70 text-sm sm:text-base font-light leading-relaxed mb-6 max-w-md">
              Legendary Pindari and Milam glaciers, dramatic Panchachuli massifs, tranquil lake districts, and ancient Katyuri stone temple enclaves.
            </p>

            {/* Preview Pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {kumaonDistricts.map((d) => (
                <span
                  key={d.id}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-foreground/[0.04] border border-foreground/[0.06] text-foreground/70"
                >
                  {d.name}
                </span>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="relative z-10 pt-5 border-t border-foreground/[0.08] flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide text-teal-600 dark:text-teal-400">
              {activeDivision === "Kumaon" ? "Close Kumaon Districts" : "Click to Open Kumaon"}
              <motion.div
                animate={{ rotate: activeDivision === "Kumaon" ? 180 : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </div>

            <Link
              href={`/explore/${state}/kumaon`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-foreground/50 hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-foreground/[0.05]"
              title="View dedicated Kumaon Division page"
            >
              Dedicated Page
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Expandable Revealed District Section */}
      <AnimatePresence mode="wait">
        {activeDivision && (
          <motion.div
            key={activeDivision}
            id={activeDivision.toLowerCase()}
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="pt-6 overflow-hidden scroll-mt-28"
          >
            <div className="p-8 sm:p-10 rounded-3xl glass-museum-card border border-foreground/[0.1] bg-foreground/[0.01]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-foreground/[0.08]">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-foreground/50 mb-1">
                    <span>Opened Division</span>
                    <span>•</span>
                    <span className={activeDivision === "Garhwal" ? "text-emerald-500" : "text-teal-500"}>
                      {activeDivision}
                    </span>
                  </div>
                  <h3 className="font-display tracking-tight font-bold text-2xl sm:text-3xl text-foreground">
                    {activeDivision} Districts
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/explore/${state}/${activeDivision.toLowerCase()}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-foreground/[0.05] hover:bg-foreground/[0.1] text-foreground transition-colors border border-foreground/[0.08]"
                  >
                    Open {activeDivision} Hub
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => setActiveDivision(null)}
                    className="text-xs font-mono px-3 py-2 rounded-xl text-foreground/50 hover:text-foreground hover:bg-foreground/[0.05] transition-colors"
                  >
                    Close ✕
                  </button>
                </div>
              </div>

              {/* Dedicated Sacred Place: Garhwal Char Dham */}
              {activeDivision === "Garhwal" && (
                <Link
                  href={`/explore/${state}/garhwal/char-dham`}
                  className="mb-6 group relative rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 glass-museum-card border border-emerald-500/30 bg-gradient-to-br from-emerald-950/25 via-background to-blue-950/20 shadow-xl hover:shadow-2xl hover:border-emerald-500/50"
                >
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        🛕 Dedicated Sacred Place
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        4 Shrines • 2 Itineraries
                      </span>
                    </div>
                    <h4 className="font-display tracking-tight font-bold text-2xl sm:text-3xl text-foreground group-hover:text-emerald-400 transition-colors">
                      Garhwal Char Dham
                    </h4>
                    <p className="text-foreground/75 text-xs sm:text-sm font-light leading-relaxed">
                      The supreme cardinal pilgrimage of the Himalayas: <strong>Yamunotri</strong> (3,291m), <strong>Gangotri</strong> (3,100m), <strong>Kedarnath</strong> (3,584m), and <strong>Badrinath</strong> (3,133m). Compare 10–12 Day Agency Route with DHT&apos;s 14–16 Day Insider Circuit including Dhari Devi, Triyuginarayan, Joshimath, Mana First Village, and Vasudhara Falls.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {["Yamunotri (Trek)", "Gangotri (Road)", "Kedarnath (Trek)", "Badrinath (Road)", "Dhari Devi", "Mana Village"].map((name) => (
                        <span key={name} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-foreground/[0.04] border border-foreground/[0.08] text-foreground/70">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500 text-black group-hover:bg-emerald-400 transition-colors shadow-lg">
                      Explore Char Dham Place &rarr;
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid of Districts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(activeDivision === "Garhwal" ? cleanGarhwalDistricts : cleanKumaonDistricts).map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/explore/${state}/${sub.id}`}
                    className="group relative rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between min-h-[220px] glass-museum-card border border-foreground/[0.08] hover:border-foreground/[0.22] shadow-md hover:shadow-xl bg-background/50"
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-display tracking-tight font-bold text-xl sm:text-2xl text-foreground mb-1 group-hover:text-primary transition-colors">
                            {sub.name}
                          </h4>
                          <p className="text-xs font-mono font-semibold" style={{ color: accentColor }}>
                            {sub.places.length} destinations
                          </p>
                        </div>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 bg-foreground/[0.04] text-foreground/50 group-hover:text-foreground group-hover:bg-foreground/[0.08]">
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      {sub.tagline && (
                        <p className="text-foreground/65 text-xs sm:text-sm font-light leading-relaxed mb-5 max-w-sm">
                          {sub.tagline}
                        </p>
                      )}
                    </div>

                    <div className="relative z-10 flex flex-wrap gap-1.5 pt-4 border-t border-foreground/[0.08]">
                      {sub.places.slice(0, 3).map((p: HimalayaPlace) => (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] text-foreground/75"
                        >
                          <span>{p.emoji}</span>
                          <span>{p.name}</span>
                        </span>
                      ))}
                      {sub.places.length > 3 && (
                        <span className="text-foreground/40 text-[11px] font-mono px-2 py-1">
                          +{sub.places.length - 3} more
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
