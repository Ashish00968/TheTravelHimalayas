"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { himalayaAtlas } from "@/data/atlas";
import { treks } from "@/data/treks";
import { NewsletterSignup } from "@/components/monetization/NewsletterSignup";
import {
  ArrowRight,
  Map,
  Compass,
  Mountain,
  Shield,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown,
  Gauge,
  Clock,
  HeartPulse,
  Award
} from "lucide-react";

const EASE = [0.23, 1, 0.32, 1] as const;

// Territory Design Profiles with High-Resolution Curated Photography
const TERRITORY_PROFILES: Record<string, {
  accent: string;
  glow: string;
  label: string;
  image: string;
  ranges: string;
  altitude: string;
  emoji: string;
}> = {
  "jammu-kashmir": {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.28)",
    label: "Jammu & Kashmir",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=72",
    ranges: "Pir Panjal & Great Lakes Massif",
    altitude: "1,585m – 4,300m",
    emoji: "🏔️"
  },
  "himachal-pradesh": {
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.28)",
    label: "Himachal Pradesh",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=72",
    ranges: "Dhauladhar & Spiti Trans-Himalaya",
    altitude: "1,200m – 6,050m",
    emoji: "🌲"
  },
  ladakh: {
    accent: "#7C3AED",
    glow: "rgba(124,58,237,0.28)",
    label: "Ladakh",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=72",
    ranges: "Zanskar, Ladakh & Karakoram Ranges",
    altitude: "3,000m – 7,135m",
    emoji: "🌌"
  },
  uttarakhand: {
    accent: "#0D9488",
    glow: "rgba(13,148,136,0.28)",
    label: "Uttarakhand",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=72",
    ranges: "Garhwal & Kumaon Sanctuary",
    altitude: "1,800m – 7,816m",
    emoji: "🛕"
  }
};

/* ── 1. Hero Section ──────────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section 
      ref={ref} 
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 bg-background transition-colors duration-300" 
    >
      {/* Background Cinematic Mountain Photo with Rich Atmospheric Depth */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
          alt="Himalayan Mountain Range at Dawn"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45 dark:opacity-50 scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Luminous Alpine Mist & Alpenglow Lighting */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/35 to-background"
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.4)_55%,transparent_80%)] dark:bg-[radial-gradient(ellipse_at_50%_30%,rgba(245,158,11,0.16)_0%,rgba(59,130,246,0.12)_50%,transparent_75%)]"
        />
      </div>

      {/* Floating Hero Content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full glass-capsule border border-slate-300/80 dark:border-white/15"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/90">
            Authoritative Alpine Atlas &amp; Expedition Guide
          </span>
        </motion.div>

        {/* Master Headline: Exactly "Explore the Himalayas" */}
        <h1 className="font-display font-extrabold leading-[1.04] tracking-tight mb-6 max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="block text-4xl sm:text-6xl md:text-7xl lg:text-[84px] text-foreground drop-shadow-sm"
          >
            Explore the
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
            className="block text-4xl sm:text-6xl md:text-7xl lg:text-[84px] text-gradient-hero"
          >
            Himalayas
          </motion.span>
        </h1>

        {/* Subtitle with enhanced contrast in both themes */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="text-base sm:text-lg md:text-xl text-foreground/80 dark:text-foreground/75 font-normal dark:font-light leading-relaxed max-w-2xl mb-8"
        >
          Verified trail breakdowns, topographical coordinates, seasonal windows, and pass crossing permits across Kashmir, Himachal, Ladakh, and Uttarakhand.
        </motion.p>

        {/* Primary Call-to-Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
          className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10"
        >
          <Link
            href="/explore"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-display font-bold text-sm tracking-wide transition-all shadow-[0_4px_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 group"
          >
            <span>Explore All Expeditions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/map"
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-capsule hover:bg-foreground/[0.08] text-foreground font-display font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2"
          >
            <Map className="w-4 h-4 text-primary" />
            <span>Launch 3D Atlas</span>
          </Link>
        </motion.div>

        {/* Territory Micro-Pill Quick Dock */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {Object.entries(TERRITORY_PROFILES).map(([id, t]) => (
            <Link
              key={id}
              href={`/explore/${id}`}
              className="px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide glass-capsule hover:scale-105 transition-all flex items-center gap-1.5"
              style={{ borderLeft: `3px solid ${t.accent}` }}
            >
              <span>{t.emoji}</span>
              <span className="text-foreground/80">{t.label}</span>
            </Link>
          ))}
        </motion.div>

        {/* Live Metrics Ribbon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85, ease: EASE }}
          className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 sm:p-4 rounded-3xl glass-capsule shadow-xl border border-slate-200/90 dark:border-white/15 bg-white/85 dark:bg-[#0A1122]/85 backdrop-blur-2xl"
        >
          <div className="p-2.5 text-center">
            <span className="block font-display font-bold text-xl sm:text-2xl text-blue-600 dark:text-blue-400">59</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/60 font-semibold">Mapped Places</span>
          </div>
          <div className="p-2.5 text-center border-l border-foreground/[0.1]">
            <span className="block font-display font-bold text-xl sm:text-2xl text-amber-500 dark:text-amber-400">4</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/60 font-semibold">Territories</span>
          </div>
          <div className="p-2.5 text-center border-l border-foreground/[0.1]">
            <span className="block font-display font-bold text-xl sm:text-2xl text-purple-600 dark:text-purple-400">7,135m</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/60 font-semibold">Peak Altitude</span>
          </div>
          <div className="p-2.5 text-center border-l border-foreground/[0.1]">
            <span className="block font-display font-bold text-xl sm:text-2xl text-teal-600 dark:text-teal-400">100%</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/60 font-semibold">Open Access</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Subtle Scroll Cue */}
      <motion.button
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => document.getElementById("territories")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-foreground/40 hover:text-foreground transition-colors"
        aria-label="Scroll to territories"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.25em]">Explore</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </motion.button>
    </section>
  );
}

/* ── 2. Territories Showcase (Museum Gallery) ──────────────────────────────── */
function TerritoriesSection() {
  return (
    <section id="territories" className="py-24 relative z-10 scroll-mt-12 bg-background border-t border-foreground/[0.06] transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Section Heading */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-capsule text-primary text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-3">
            <Compass className="w-3.5 h-3.5" />
            Regional Realms
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-foreground mb-4 tracking-tight">
            Four Himalayan Territories
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base font-light leading-relaxed">
            From the high cold-deserts of Zanskar to the emerald valleys of Garhwal. Choose your theatre of exploration.
          </p>
        </div>

        {/* 2x2 Grid of Edge-to-Edge Photo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {himalayaAtlas.map((region) => {
            const profile = TERRITORY_PROFILES[region.id] ?? {
              accent: "#3B82F6",
              glow: "rgba(59,130,246,0.2)",
              label: region.name,
              image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
              ranges: "Himalayan Massifs",
              altitude: "1,500m – 6,000m",
              emoji: "🏔️"
            };
            const totalPlaces = region.subregions.reduce((acc, sub) => acc + sub.places.length, 0);

            return (
              <Link
                key={region.id}
                href={`/explore/${region.id}`}
                className="group relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[420px] flex flex-col justify-between p-6 sm:p-8 border border-foreground/[0.1] hover:border-foreground/[0.25] transition-all duration-500 shadow-lg"
              >
                {/* Background Image with Zoom on Hover */}
                <Image
                  src={profile.image}
                  alt={profile.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient Overlays for High Legibility */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" 
                />
                <div 
                  className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at 50% 100%, ${profile.glow}, transparent 70%)` }}
                />

                {/* Top Row: Region Badge & Altitude */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md bg-black/65"
                    style={{
                      border: `1px solid ${profile.accent}60`,
                      color: profile.accent
                    }}
                  >
                    {profile.emoji} {profile.label}
                  </span>
                  <span className="text-[11px] font-mono text-white/85 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                    {profile.altitude}
                  </span>
                </div>

                {/* Bottom Row: Title, Subregions & Arrow */}
                <div className="relative z-10">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/70 block mb-2">
                    {profile.ranges}
                  </span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3 group-hover:text-amber-200 transition-colors drop-shadow-md">
                    {region.name}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm font-light line-clamp-2 mb-6 max-w-lg leading-relaxed">
                    {region.cardDesc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/15 text-xs font-mono">
                    <span className="text-white/70">
                      {region.subregions.length} Valleys • {totalPlaces} Destinations
                    </span>
                    <span 
                      className="inline-flex items-center gap-1 font-bold group-hover:translate-x-1.5 transition-transform drop-shadow"
                      style={{ color: profile.accent }}
                    >
                      Enter Territory <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── 3. Featured Iconic Expeditions ───────────────────────────────────────── */
function IconicTreksSection() {
  const featured = treks.slice(0, 4);

  return (
    <section className="py-24 relative z-10 border-t border-foreground/[0.06] bg-muted/30 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-capsule text-primary text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-3">
              <Mountain className="w-3.5 h-3.5" />
              Flagship Routes
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-foreground tracking-tight">
              Iconic Trailhead Expeditions
            </h2>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.18em] text-primary hover:text-foreground transition-colors"
          >
            <span>View All Guides &amp; Trails</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid of 4 High-Spec Trek Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((trek) => (
            <Link
              key={trek.slug}
              href={`/explore/himachal-pradesh/kullu/${trek.slug}`}
              className="group rounded-3xl overflow-hidden glass-museum-card flex flex-col justify-between"
            >
              {/* Photo Banner */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={trek.heroImage || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=72"}
                  alt={trek.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/20" />
                
                {/* Altitude Pill */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-primary-light font-bold text-white">
                  {trek.maxAltitude}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-foreground/50 block mb-1">
                    {trek.region}
                  </span>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {trek.title}
                  </h3>
                  <p className="text-foreground/65 text-xs font-light line-clamp-3 mb-6 leading-relaxed">
                    {trek.overview}
                  </p>
                </div>

                {/* Specs Meter Footer */}
                <div className="pt-4 border-t border-foreground/[0.08] flex items-center justify-between text-[11px] font-mono text-foreground/70">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-foreground/40" />
                    <span>{trek.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>{trek.difficulty}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 4. Planning Suite Hub ─────────────────────────────────────────────────── */
const PLANNING_TOOLS = [
  {
    title: "Trek Finder",
    desc: "Deterministic trail matching based on altitude threshold, difficulty, days, and season.",
    href: "/plan/trek-finder",
    icon: Compass,
    accent: "#3B82F6",
  },
  {
    title: "Comparison Matrix",
    desc: "Side-by-side technical evaluation of elevation gain, permits, and gradient profiles.",
    href: "/plan/compare",
    icon: Layers,
    accent: "#F59E0B",
  },
  {
    title: "Budget Estimator",
    desc: "Calculate guide tariffs, mule logistics, porter fees, and wilderness permits.",
    href: "/plan/budget",
    icon: Gauge,
    accent: "#0D9488",
  },
  {
    title: "Packing Checklist",
    desc: "Curated 3-season and winter gear generator tailored for Himalayan pass crossings.",
    href: "/plan/packing",
    icon: Award,
    accent: "#7C3AED",
  },
  {
    title: "Seasonal Matrix",
    desc: "Month-by-month weather windows, snowmelt timing, and post-monsoon clarity charts.",
    href: "/plan/season",
    icon: Calendar,
    accent: "#3B82F6",
  },
];

function PlanningSuiteSection() {
  return (
    <section className="py-24 relative z-10 border-t border-foreground/[0.06] bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-capsule text-amber-600 dark:text-amber-400 text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Deterministic Alpine Suite
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-foreground mb-4 tracking-tight">
            Comprehensive Expedition Planning
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base font-light leading-relaxed">
            Eliminate guesswork. Use precision tools built by high-altitude mountaineers to prepare for your Himalayan campaign.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANNING_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="group p-7 rounded-3xl glass-museum-card flex flex-col justify-between"
              >
                <div>
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-sm"
                    style={{
                      background: `${tool.accent}18`,
                      border: `1px solid ${tool.accent}35`
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: tool.accent }} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-foreground/65 text-xs sm:text-sm font-light leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <span 
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider mt-8 group-hover:translate-x-1 transition-transform"
                  style={{ color: tool.accent }}
                >
                  Open Tool <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}

          {/* 3D Map Banner Card as 6th Item */}
          <Link
            href="/map"
            className="group p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-blue-500/30 glass-museum-card"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mb-6">
                <Map className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">
                3D Geospatial Atlas
              </h3>
              <p className="text-foreground/65 text-xs sm:text-sm font-light leading-relaxed">
                Interact with high-altitude terrain, valley contours, and summit elevation profiles in WebGL 3D.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-primary mt-8 group-hover:translate-x-1 transition-transform">
              Launch Atlas <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── 5. Mountain Safety & Medical Acclimatisation Banner ──────────────────── */
function SafetyFeatureSection() {
  return (
    <section className="py-20 relative z-10 border-t border-foreground/[0.06] bg-muted/20 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div 
          className="rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-amber-500/35 shadow-xl glass-museum-card"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-4">
              <HeartPulse className="w-3.5 h-3.5" />
              Mountain Safety Protocol
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-foreground mb-4 tracking-tight">
              High-Altitude Acclimatisation &amp; Medicine
            </h2>
            <p className="text-foreground/75 text-sm sm:text-base font-light leading-relaxed">
              Altitude sickness does not care about fitness. Study comprehensive field protocols on Acute Mountain Sickness (AMS), HAPE, HACE, cold-injury triage, and certified mountaineering training institutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 w-full lg:w-auto">
            <Link
              href="/safety"
              className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Shield className="w-4 h-4" />
              View Mountain Safety Protocols
            </Link>
            <Link
              href="/conditions"
              className="px-8 py-4 rounded-2xl glass-capsule hover:bg-foreground/[0.08] text-foreground font-display font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              Live Weather Radar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 6. Himalayan Dispatch Newsletter ─────────────────────────────────────── */
function DispatchNewsletterSection() {
  return (
    <section className="py-24 relative z-10 border-t border-foreground/[0.06] bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
        <div className="p-8 sm:p-14 rounded-3xl glass-capsule border border-foreground/[0.1] relative overflow-hidden shadow-xl">
          {/* Subtle Background Glow */}
          <div 
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[100px] pointer-events-none bg-primary/10"
          />

          <div className="relative z-10 max-w-xl mx-auto">
            <span className="font-mono text-xs text-primary uppercase font-bold tracking-[0.25em] block mb-3">
              Alpine Dispatches
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4 tracking-tight">
              Get High-Altitude Trail Intelligence
            </h2>
            <p className="text-foreground/70 text-sm sm:text-base font-light leading-relaxed mb-8">
              Seasonal pass openings, permit policy updates, snowfall forecasts, and newly surveyed routes delivered directly to your inbox.
            </p>

            <NewsletterSignup variant="hero" className="max-w-md mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Master Home Page Component ───────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="w-full bg-background transition-colors duration-300">
      <Hero />
      <TerritoriesSection />
      <IconicTreksSection />
      <PlanningSuiteSection />
      <SafetyFeatureSection />
      <DispatchNewsletterSection />
    </div>
  );
}
