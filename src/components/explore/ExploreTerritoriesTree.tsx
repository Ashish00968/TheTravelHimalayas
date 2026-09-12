"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Compass, ArrowRight } from "lucide-react";
import { himalayaAtlas } from "@/data/atlas";
import { Card3D } from "@/components/animation/Card3D";

const EASE = [0.16, 1, 0.3, 1] as const;

const TERRITORY_PROFILES: Record<
  string,
  {
    accent: string;
    glow: string;
    label: string;
    shortLabel: string;
    image: string;
    ranges: string;
    altitude: string;
    emoji: string;
  }
> = {
  "jammu-kashmir": {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.35)",
    label: "Jammu & Kashmir",
    shortLabel: "Kashmir",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/f_auto,q_auto,w_800/v1780383856/jkMain.jpg",
    ranges: "Pir Panjal & Great Lakes Massif",
    altitude: "1,585m – 4,300m",
    emoji: "🏔️",
  },
  "himachal-pradesh": {
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.35)",
    label: "Himachal Pradesh",
    shortLabel: "Himachal",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/f_auto,q_auto,w_800/v1777221149/himachalMain.jpg",
    ranges: "Dhauladhar & Spiti Trans-Himalaya",
    altitude: "1,200m – 6,050m",
    emoji: "🌲",
  },
  ladakh: {
    accent: "#7C3AED",
    glow: "rgba(124,58,237,0.35)",
    label: "Ladakh",
    shortLabel: "Ladakh",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/f_auto,q_auto,w_800/v1777213083/ladakhMain.png",
    ranges: "Zanskar, Ladakh & Karakoram Ranges",
    altitude: "3,000m – 7,135m",
    emoji: "🌌",
  },
  uttarakhand: {
    accent: "#0D9488",
    glow: "rgba(13,148,136,0.35)",
    label: "Uttarakhand",
    shortLabel: "Uttarakhand",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/f_auto,q_auto,w_800/v1777220041/UttrakhandMain.jpg",
    ranges: "Garhwal & Kumaon Sanctuary",
    altitude: "1,800m – 7,816m",
    emoji: "🛕",
  },
};

export function ExploreTerritoriesTree() {
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  const leftTerritories = [himalayaAtlas[0], himalayaAtlas[2]]; // J&K (#3B82F6), Uttarakhand (#0D9488)
  const rightTerritories = [himalayaAtlas[1], himalayaAtlas[3]]; // Himachal (#F59E0B), Ladakh (#7C3AED)

  return (
    <section
      id="territories-tree"
      className="pt-8 sm:pt-12 pb-14 sm:pb-20 relative z-10 scroll-mt-12 bg-background transition-colors duration-300"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Section Heading — Clean, Authoritative, Zero 'Step 1' */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-6 sm:mb-8 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-capsule text-primary text-[10px] font-mono uppercase tracking-[0.22em] font-bold mb-3 border border-slate-200/80 dark:border-white/10">
            <Compass className="w-3.5 h-3.5" />
            Himalayan Geographic Arc
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-foreground mb-2 sm:mb-2.5 tracking-tight leading-[1.12]">
            The Four Himalayan Territories
          </h2>
          <p className="text-foreground/70 text-xs sm:text-sm font-light leading-relaxed max-w-lg mx-auto">
            A branching geographic traverse across the 2,400km Indian Himalayan Arc. Choose your theatre of exploration.
          </p>

          <div className="flex flex-col items-center mt-4">
            <div className="w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-primary/25 shadow-[0_0_18px_rgba(59,130,246,0.8)] animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary font-bold mt-1.5">
              Arc Origin • 32°N – 36°N
            </span>
          </div>
        </motion.div>

        {/* ── Interconnected Expedition Tree Canvas ── */}
        <div className="relative mt-6 sm:mt-8">
          {/* Continuous Center SVG Tree Trunk & 4 Curved Branches (Desktop) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-4 w-32 lg:w-40 pointer-events-none hidden md:block z-0">
            <svg
              viewBox="0 0 160 480"
              fill="none"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="explore-branch-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <line
                x1="80"
                y1="0"
                x2="80"
                y2="460"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Branch 1: Left to J&K */}
              <path
                d="M 80 35 C 80 65, 25 95, 0 95"
                stroke={activeBranch === "jammu-kashmir" ? "#3B82F6" : "rgba(59,130,246,0.55)"}
                strokeWidth={activeBranch === "jammu-kashmir" ? "3.5" : "2"}
                strokeLinecap="round"
                filter={activeBranch === "jammu-kashmir" ? "url(#explore-branch-glow)" : undefined}
                className="transition-all duration-300"
              />
              <circle cx="0" cy="95" r={activeBranch === "jammu-kashmir" ? 5 : 3.5} fill="#3B82F6" />
              <circle cx="80" cy="35" r="3.5" fill="#3B82F6" />

              {/* Branch 2: Right to Himachal */}
              <path
                d="M 80 85 C 80 115, 135 145, 160 145"
                stroke={activeBranch === "himachal-pradesh" ? "#F59E0B" : "rgba(245,158,11,0.55)"}
                strokeWidth={activeBranch === "himachal-pradesh" ? "3.5" : "2"}
                strokeLinecap="round"
                filter={activeBranch === "himachal-pradesh" ? "url(#explore-branch-glow)" : undefined}
                className="transition-all duration-300"
              />
              <circle cx="160" cy="145" r={activeBranch === "himachal-pradesh" ? 5 : 3.5} fill="#F59E0B" />
              <circle cx="80" cy="85" r="3.5" fill="#F59E0B" />

              {/* Branch 3: Left to Uttarakhand */}
              <path
                d="M 80 280 C 80 310, 25 340, 0 340"
                stroke={activeBranch === "uttarakhand" ? "#0D9488" : "rgba(13,148,136,0.55)"}
                strokeWidth={activeBranch === "uttarakhand" ? "3.5" : "2"}
                strokeLinecap="round"
                filter={activeBranch === "uttarakhand" ? "url(#explore-branch-glow)" : undefined}
                className="transition-all duration-300"
              />
              <circle cx="0" cy="340" r={activeBranch === "uttarakhand" ? 5 : 3.5} fill="#0D9488" />
              <circle cx="80" cy="280" r="3.5" fill="#0D9488" />

              {/* Branch 4: Right to Ladakh */}
              <path
                d="M 80 330 C 80 360, 135 390, 160 390"
                stroke={activeBranch === "ladakh" ? "#7C3AED" : "rgba(124,58,237,0.55)"}
                strokeWidth={activeBranch === "ladakh" ? "3.5" : "2"}
                strokeLinecap="round"
                filter={activeBranch === "ladakh" ? "url(#explore-branch-glow)" : undefined}
                className="transition-all duration-300"
              />
              <circle cx="160" cy="390" r={activeBranch === "ladakh" ? 5 : 3.5} fill="#7C3AED" />
              <circle cx="80" cy="330" r="3.5" fill="#7C3AED" />
            </svg>
          </div>

          {/* Mobile 2x2 Clean Quadrant Grid (All 4 in One Screen) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:hidden">
            {[himalayaAtlas[0], himalayaAtlas[1], himalayaAtlas[2], himalayaAtlas[3]].map((region, idx) => {
              const profile = TERRITORY_PROFILES[region.id];
              const totalPlaces = region.subregions.reduce(
                (acc, s) => acc + s.places.length,
                0
              );
              return (
                <motion.div
                  key={region.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.45, delay: idx * 0.07, ease: EASE }}
                >
                  <Link
                    href={`/explore/${region.id}`}
                    className="dark-photo-card group relative rounded-2xl overflow-hidden block border border-slate-200/80 dark:border-white/10 active:scale-[0.98] transition-transform duration-300 shadow-md h-[130px] sm:h-[145px]"
                  >
                    <Image
                      src={profile.image}
                      alt={region.name}
                      fill
                      sizes="50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25" />

                    <div className="absolute inset-0 p-3 flex flex-col justify-between z-10">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className="px-2 py-0.5 rounded-full text-[8.5px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border shadow-sm"
                          style={{
                            backgroundColor: `${profile.accent}35`,
                            color: "#ffffff",
                            borderColor: `${profile.accent}75`,
                          }}
                        >
                          {profile.shortLabel === "Uttarakhand" ? "Garhwal" : profile.shortLabel}
                        </span>
                        <span className="text-[12px] shrink-0">
                          {profile.emoji}
                        </span>
                      </div>

                      <div>
                        <h3
                          className="font-display font-bold text-sm sm:text-base tracking-tight leading-tight mb-0.5"
                          style={{
                            color: "#ffffff",
                            textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.8)",
                          }}
                        >
                          {region.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[9px] font-mono block"
                            style={{
                              color: "rgba(255,255,255,0.85)",
                              textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                            }}
                          >
                            {region.subregions.length} Valleys • {totalPlaces} Places
                          </span>
                          <span
                            className="inline-flex items-center gap-0.5 text-[9.5px] font-mono font-bold shrink-0"
                            style={{
                              color: profile.accent,
                              textShadow: "0 1px 8px rgba(0,0,0,0.9)",
                            }}
                          >
                            Explore <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop 2-Column Asymmetric Staggered Canopy Grid — Compact Explorer Edition */}
          <div className="hidden md:grid md:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-4 md:gap-y-8 items-start">
            {/* Left Column (Jammu & Kashmir, Uttarakhand) */}
            <div className="space-y-4 md:space-y-10">
              {leftTerritories.map((region, idx) => {
                const profile = TERRITORY_PROFILES[region.id];
                const totalPlaces = region.subregions.reduce(
                  (acc, s) => acc + s.places.length,
                  0
                );
                return (
                  <motion.div
                    key={region.id}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.55, delay: idx * 0.1, ease: EASE }}
                    onMouseEnter={() => setActiveBranch(region.id)}
                    onMouseLeave={() => setActiveBranch(null)}
                  >
                    <Card3D depth={6} glareColor={profile.glow} className="rounded-2xl sm:rounded-3xl">
                      <Link
                        href={`/explore/${region.id}`}
                        className="dark-photo-card group relative rounded-2xl sm:rounded-3xl overflow-hidden block border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl h-[160px] sm:h-[195px]"
                      >
                        <Image
                          src={profile.image}
                          alt={region.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 group-hover:from-black/95 transition-colors" />

                        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between z-10">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[9.5px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border shadow-sm truncate max-w-[170px] sm:max-w-none"
                              style={{
                                backgroundColor: `${profile.accent}25`,
                                color: "#ffffff",
                                borderColor: `${profile.accent}60`,
                              }}
                            >
                              {profile.ranges}
                            </span>
                            <span className="text-[9.5px] font-mono text-white/90 font-semibold shrink-0">
                              {profile.altitude}
                            </span>
                          </div>

                          <div className="flex items-end justify-between">
                            <div>
                              <h3 className="font-display font-extrabold text-lg sm:text-xl text-white tracking-tight leading-tight">
                                {region.name}
                              </h3>
                              <span
                                className="text-[9.5px] font-mono block mt-0.5 font-medium"
                                style={{ color: "rgba(255,255,255,0.75)" }}
                              >
                                {region.subregions.length} Valleys • {totalPlaces} Places
                              </span>
                            </div>
                            <span
                              className="inline-flex items-center gap-1 text-xs font-mono font-bold shrink-0 group-hover:translate-x-1.5 transition-transform"
                              style={{ color: profile.accent, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                            >
                              Explore <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </Card3D>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column (Himachal Pradesh, Ladakh) */}
            <div className="space-y-4 md:space-y-10 mt-0 md:mt-10">
              {rightTerritories.map((region, idx) => {
                const profile = TERRITORY_PROFILES[region.id];
                const totalPlaces = region.subregions.reduce(
                  (acc, s) => acc + s.places.length,
                  0
                );
                return (
                  <motion.div
                    key={region.id}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.55, delay: idx * 0.1, ease: EASE }}
                    onMouseEnter={() => setActiveBranch(region.id)}
                    onMouseLeave={() => setActiveBranch(null)}
                  >
                    <Card3D depth={6} glareColor={profile.glow} className="rounded-2xl sm:rounded-3xl">
                      <Link
                        href={`/explore/${region.id}`}
                        className="dark-photo-card group relative rounded-2xl sm:rounded-3xl overflow-hidden block border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl h-[160px] sm:h-[195px]"
                      >
                        <Image
                          src={profile.image}
                          alt={region.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 group-hover:from-black/95 transition-colors" />

                        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between z-10">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[9.5px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border shadow-sm truncate max-w-[170px] sm:max-w-none"
                              style={{
                                backgroundColor: `${profile.accent}25`,
                                color: "#ffffff",
                                borderColor: `${profile.accent}60`,
                              }}
                            >
                              {profile.ranges}
                            </span>
                            <span className="text-[9.5px] font-mono text-white/90 font-semibold shrink-0">
                              {profile.altitude}
                            </span>
                          </div>

                          <div className="flex items-end justify-between">
                            <div>
                              <h3 className="font-display font-extrabold text-lg sm:text-xl text-white tracking-tight leading-tight">
                                {region.name}
                              </h3>
                              <span
                                className="text-[9.5px] font-mono block mt-0.5 font-medium"
                                style={{ color: "rgba(255,255,255,0.75)" }}
                              >
                                {region.subregions.length} Valleys • {totalPlaces} Places
                              </span>
                            </div>
                            <span
                              className="inline-flex items-center gap-1 text-xs font-mono font-bold shrink-0 group-hover:translate-x-1.5 transition-transform"
                              style={{ color: profile.accent, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                            >
                              Explore <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </Card3D>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
