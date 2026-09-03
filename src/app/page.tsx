"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate
} from "framer-motion";
import { himalayaAtlas } from "@/data/atlas";
import { treks } from "@/data/treks";
import { NewsletterSignup } from "@/components/monetization/NewsletterSignup";
import { Card3D } from "@/components/animation/Card3D";
import {
  ArrowRight,
  Map,
  Compass,
  Mountain,
  Shield,
  Calendar,
  Layers,
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
    glow: "rgba(59,130,246,0.35)",
    label: "Jammu & Kashmir",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/v1780383856/jkMain.jpg",
    ranges: "Pir Panjal & Great Lakes Massif",
    altitude: "1,585m – 4,300m",
    emoji: "🏔️"
  },
  "himachal-pradesh": {
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.35)",
    label: "Himachal Pradesh",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/v1777221149/himachalMain.jpg",
    ranges: "Dhauladhar & Spiti Trans-Himalaya",
    altitude: "1,200m – 6,050m",
    emoji: "🌲"
  },
  ladakh: {
    accent: "#7C3AED",
    glow: "rgba(124,58,237,0.35)",
    label: "Ladakh",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/v1777213083/ladakhMain.png",
    ranges: "Zanskar, Ladakh & Karakoram Ranges",
    altitude: "3,000m – 7,135m",
    emoji: "🌌"
  },
  uttarakhand: {
    accent: "#0D9488",
    glow: "rgba(13,148,136,0.35)",
    label: "Uttarakhand",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/v1777220041/UttrakhandMain.jpg",
    ranges: "Garhwal & Kumaon Sanctuary",
    altitude: "1,800m – 7,816m",
    emoji: "🛕"
  }
};

/* ── 1. Hero Section with Cinematic Fast-Animated Scroll Architecture ─────── */
function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  // Track scroll within the 220vh container for fast, snappy, clean storytelling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Fast, smooth spring progress
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 24, restDelta: 0.001 });

  // Mouse Parallax for interactivity (from travelglb)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const inverseMouseX = useTransform(smoothMouseX, (v) => -v * 0.5);
  const inverseMouseY = useTransform(smoothMouseY, (v) => -v * 0.5);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 44;
      const y = (clientY / window.innerHeight - 0.5) * 44;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // STEP 1: "The" — visible on initial landing so screen is never blank
  const theWordOpacity = useTransform(smoothProgress, [0, 0.10], [1, 1]);
  const theWordY       = useTransform(smoothProgress, [0, 0.10], [0, 0]);
  const theWordBlur    = useTransform(smoothProgress, [0, 0.10], [0, 0]);

  // STEP 2: "Himalayan" (0.04 to 0.22)
  const himalayanOpacity = useTransform(smoothProgress, [0.04, 0.22], [0, 1]);
  const himalayanY       = useTransform(smoothProgress, [0.04, 0.22], [24, 0]);
  const himalayanBlur    = useTransform(smoothProgress, [0.04, 0.20], [8, 0]);

  // STEP 3: "Trails" (0.20 to 0.38) with summit scale & radiant glow
  const trailsOpacity = useTransform(smoothProgress, [0.20, 0.38], [0, 1]);
  const trailsY       = useTransform(smoothProgress, [0.20, 0.38], [28, 0]);
  const trailsScale   = useTransform(smoothProgress, [0.20, 0.38], [0.90, 1]);
  const trailsBlur    = useTransform(smoothProgress, [0.20, 0.36], [10, 0]);
  const trailsGlowRaw = useTransform(smoothProgress, [0.20, 0.38], [0, 45]);
  const trailsShadow  = useMotionTemplate`blur(${trailsBlur}px) drop-shadow(0 8px ${trailsGlowRaw}px rgba(59, 130, 246, 0.45))`;

  // STEP 4: Subtitle ("Explore the Himalayas") + Buttons + Pills + Stats (0.38 to 0.58)
  const detailsOpacity = useTransform(smoothProgress, [0.38, 0.56], [0, 1]);
  const detailsY       = useTransform(smoothProgress, [0.38, 0.56], [20, 0]);

  // Scroll Indicator — visible at 0, fades at 0.05
  const scrollHintOpacity = useTransform(smoothProgress, [0, 0.04, 0.07], [1, 0.6, 0]);

  // OUTRO: Fade text out, zoom background in
  const contentOpacityOutro = useTransform(smoothProgress, [0.85, 1.0], [1, 0]);
  const contentYOutro       = useTransform(smoothProgress, [0.85, 1.0], [0, -45]);
  const bgScale             = useTransform(smoothProgress, [0.82, 1.0], [1.05, 1.15]);
  const fogOpacitySlow      = useTransform(smoothProgress, [0.8, 1.0], [0.12, 0.38]);
  const fogOpacityFast      = useTransform(smoothProgress, [0.8, 1.0], [0.35, 0.85]);

  return (
    <section
      id="home"
      ref={containerRef}
      suppressHydrationWarning
      className="-mt-20 relative w-full"
      style={{
        height: "clamp(200vh, 220vh, 240vh)",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          overflow: "hidden",
          padding: "0 clamp(20px, 4vw, 48px)",
        }}
      >
        {/* ── Background Layer with Inverse Mouse Parallax & Outro Scale ── */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            scale: bgScale,
            x: inverseMouseX,
            y: inverseMouseY,
            transformOrigin: "center 40%",
            pointerEvents: "none",
          }}
        >
          <Image
            src="https://res.cloudinary.com/dehriwm1o/image/upload/v1777213099/Wallpaper.jpg"
            alt="Himalayan Mountain Range Wallpaper"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-100 transition-transform duration-700 ease-out"
            style={{
              scale: 1.06, // Prevent edge gaps during mouse parallax
              filter: "contrast(1.08) saturate(1.08)",
            }}
          />
        </motion.div>

        {/* Cinematic Atmospheric Vignette - Crisp & High-Contrast in Light Mode, Midnight-Indigo in Dark Mode */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none transition-colors duration-500 bg-gradient-to-b from-black/40 via-transparent to-black/30 dark:from-[#040812]/75 dark:via-[#040812]/20 dark:to-[#040812]/60"
        />

        {/* Crisp Edge Melt — Subtle bottom boundary soften, keeping the mountains and stats pill crystal-clear */}
        <div
          className="absolute inset-x-0 bottom-0 h-14 sm:h-20 pointer-events-none z-[4] bg-gradient-to-b from-transparent to-background/90 dark:to-[#040812] transition-colors duration-500"
        />

        {/* Fog & Grain Layers — Active in Dark Mode only so Light Mode stays crystal sharp and haze-free */}
        <motion.div className="hidden dark:block fog-layer" style={{ opacity: fogOpacitySlow, zIndex: 2 }} />
        <motion.div
          className="hidden dark:block fog-layer"
          style={{
            animationDelay: "-14s",
            animationDirection: "reverse",
            filter: "blur(10px)",
            opacity: fogOpacityFast,
            zIndex: 2,
          }}
        />
        <div className="hidden dark:block grain-overlay" style={{ zIndex: 3 }} />

        {/* ── Dynamic Storytelling Content ── */}
        <motion.div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "1100px",
            width: "100%",
            margin: "0 auto",
            opacity: contentOpacityOutro,
            y: contentYOutro,
          }}
        >
          {/* Headline Words: 1. THE -> 2. Himalayan -> 3. Trails */}
          <div style={{ width: "100%", marginBottom: "14px" }}>
            {/* Step 1: THE */}
            <motion.div
              style={{
                textAlign: "center",
                opacity: theWordOpacity,
                y: theWordY,
                x: smoothMouseX,
                filter: useMotionTemplate`blur(${theWordBlur}px)`,
              }}
              className="select-none"
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.2rem, 6vw, 4.8rem)",
                  fontWeight: 600,
                  fontStyle: "italic",
                  color: "#93C5FD",
                  lineHeight: 1,
                  display: "block",
                  letterSpacing: "0.02em",
                  textShadow: "0 4px 24px rgba(59, 130, 246, 0.45)",
                }}
              >
                The
              </span>
            </motion.div>

            {/* Step 2: Himalayan */}
            <motion.div
              style={{
                textAlign: "center",
                opacity: himalayanOpacity,
                y: himalayanY,
                x: smoothMouseX,
                filter: useMotionTemplate`blur(${himalayanBlur}px)`,
                margin: "2px 0",
              }}
              className="select-none"
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(3rem, 9.5vw, 7.5rem)",
                  fontWeight: 600,
                  color: "#ffffff",
                  lineHeight: 1,
                  display: "block",
                  letterSpacing: "-0.02em",
                  textShadow: "0 4px 30px rgba(0,0,0,0.85)",
                }}
              >
                Himalayan
              </span>
            </motion.div>

            {/* Step 3: Trails */}
            <motion.div
              style={{
                textAlign: "center",
                opacity: trailsOpacity,
                y: trailsY,
                x: smoothMouseX,
                scale: trailsScale,
                filter: trailsShadow,
              }}
              className="select-none"
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(3.5rem, 11vw, 8.5rem)",
                  fontWeight: 700,
                  fontStyle: "italic",
                  lineHeight: 1.05,
                  display: "block",
                  textShadow: "0 8px 40px rgba(59, 130, 246, 0.35)",
                }}
                className="text-gradient-hero pb-2"
              >
                Trails
              </span>
            </motion.div>
          </div>

          {/* Step 4: Details (Subtitle: "Explore the Himalayas" + Buttons + Pills + Clean Minimal Stats) */}
          <motion.div
            style={{
              opacity: detailsOpacity,
              y: detailsY,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "820px",
            }}
          >
            {/* Tagline: Explore the Himalayas (Replacing previous long paragraph) */}
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.25rem, 2.4vw, 1.85rem)",
                lineHeight: 1.3,
                color: "rgba(255,255,255,0.92)",
                marginBottom: "22px",
                letterSpacing: "0.02em",
                textShadow: "0 2px 18px rgba(0,0,0,0.85)",
              }}
              className="text-balance"
            >
              Explore the Himalayas
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-5">
              <Link
                href="/explore"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-display font-bold text-sm tracking-wide transition-all shadow-[0_8px_30px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.45)] flex items-center justify-center gap-2 group"
              >
                <span>Explore All Expeditions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                href="/map"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full glass-capsule hover:bg-white/10 text-white font-display font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2 border border-white/15"
              >
                <Map className="w-4 h-4 text-primary" />
                <span>Launch 3D Atlas</span>
              </Link>
            </div>

            {/* Territory Micro-Pill Quick Dock */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
              {Object.entries(TERRITORY_PROFILES).map(([id, t]) => (
                <motion.div key={id} whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href={`/explore/${id}`}
                    className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide glass-capsule transition-all flex items-center gap-1.5 shadow-sm border border-white/10 text-white/90 hover:text-white"
                    style={{ borderLeft: `3px solid ${t.accent}` }}
                  >
                    <span>{t.emoji}</span>
                    <span className="font-semibold">{t.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Sleek Minimal Stats Bar (Changed from bulky dark box) */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 px-6 py-2.5 rounded-full glass-capsule border border-white/15 bg-white/[0.05] dark:bg-[#0A1122]/60 backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg text-blue-400">59</span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/70 font-semibold">Mapped Trails</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/25 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg text-amber-400">4</span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/70 font-semibold">Territories</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/25 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg text-purple-400">7,816m</span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/70 font-semibold">Highest Peak</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/25 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg text-teal-400">100%</span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/70 font-semibold">Free Access</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Scroll Indicator (exact layout & physics from travelglb) ── */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "clamp(20px, 4vw, 48px)",
            zIndex: 20,
            opacity: scrollHintOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(147, 197, 253, 0.7)",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: "1px",
              height: "48px",
              background: "linear-gradient(to bottom, rgba(59, 130, 246, 0.8), transparent)",
              animation: "scrollBounce 2s ease-in-out infinite",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ── 2. Territories Showcase (Cinematic Mountain Expedition Tree) ──────────── */
function TerritoriesSection() {
  const [activeBranch, setActiveBranch] = React.useState<string | null>(null);

  // Group territories for the 2-column tree canopy
  // Left: Jammu & Kashmir (NW), Uttarakhand (SE)
  // Right: Himachal Pradesh (Central), Ladakh (High Plateau)
  const leftTerritories = [himalayaAtlas[0], himalayaAtlas[3]]; // J&K, Uttarakhand
  const rightTerritories = [himalayaAtlas[1], himalayaAtlas[2]]; // Himachal, Ladakh

  return (
    <section id="territories" className="pt-20 pb-28 relative z-10 scroll-mt-12 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Section Heading with Botanical / Topological Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-8 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-capsule text-primary text-[10px] font-mono uppercase tracking-[0.22em] font-bold mb-3 border border-slate-200/80 dark:border-white/10">
            <Compass className="w-3.5 h-3.5" />
            Himalayan Expedition Tree
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-foreground mb-3 tracking-tight leading-[1.08]">
            Four Himalayan Territories
          </h2>
          <p className="text-foreground/70 text-xs sm:text-sm font-light leading-relaxed max-w-lg mx-auto">
            A branching geographic traverse across the 2,400km Indian Himalayan Arc. Choose your theatre of exploration.
          </p>

          {/* Central Root Tree Node with Organic Branching Fork */}
          <div className="flex flex-col items-center mt-5">
            <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/25 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary font-bold mt-1.5">
              Arc Origin • 32°N – 36°N
            </span>
          </div>
        </motion.div>

        {/* ── Interconnected Expedition Tree Canvas ── */}
        <div className="relative mt-8">
          {/* Continuous Center SVG Tree Trunk & 4 Curved Branches (Desktop) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-4 w-36 lg:w-44 pointer-events-none hidden md:block z-0">
            <svg viewBox="0 0 160 560" fill="none" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <filter id="branch-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Luminous Central Vertical Trunk */}
              <line
                x1="80"
                y1="0"
                x2="80"
                y2="540"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Branch 1: Curves Left to Jammu & Kashmir (Top Left) */}
              <path
                d="M 80 40 C 80 75, 25 100, 0 100"
                stroke={activeBranch === "jammu-kashmir" ? "#3B82F6" : "rgba(59,130,246,0.55)"}
                strokeWidth={activeBranch === "jammu-kashmir" ? "3.5" : "2"}
                strokeLinecap="round"
                filter={activeBranch === "jammu-kashmir" ? "url(#branch-glow)" : undefined}
                className="transition-all duration-300"
              />
              <circle cx="0" cy="100" r={activeBranch === "jammu-kashmir" ? 5 : 3.5} fill="#3B82F6" />
              <circle cx="80" cy="40" r="3.5" fill="#3B82F6" />

              {/* Branch 2: Curves Right to Himachal Pradesh (Top Right, Staggered) */}
              <path
                d="M 80 100 C 80 140, 135 170, 160 170"
                stroke={activeBranch === "himachal-pradesh" ? "#F59E0B" : "rgba(245,158,11,0.55)"}
                strokeWidth={activeBranch === "himachal-pradesh" ? "3.5" : "2"}
                strokeLinecap="round"
                filter={activeBranch === "himachal-pradesh" ? "url(#branch-glow)" : undefined}
                className="transition-all duration-300"
              />
              <circle cx="160" cy="170" r={activeBranch === "himachal-pradesh" ? 5 : 3.5} fill="#F59E0B" />
              <circle cx="80" cy="100" r="3.5" fill="#F59E0B" />

              {/* Branch 3: Curves Left to Uttarakhand (Bottom Left) */}
              <path
                d="M 80 320 C 80 360, 25 390, 0 390"
                stroke={activeBranch === "uttarakhand" ? "#0D9488" : "rgba(13,148,136,0.55)"}
                strokeWidth={activeBranch === "uttarakhand" ? "3.5" : "2"}
                strokeLinecap="round"
                filter={activeBranch === "uttarakhand" ? "url(#branch-glow)" : undefined}
                className="transition-all duration-300"
              />
              <circle cx="0" cy="390" r={activeBranch === "uttarakhand" ? 5 : 3.5} fill="#0D9488" />
              <circle cx="80" cy="320" r="3.5" fill="#0D9488" />

              {/* Branch 4: Curves Right to Ladakh (Bottom Right, Staggered) */}
              <path
                d="M 80 380 C 80 420, 135 450, 160 450"
                stroke={activeBranch === "ladakh" ? "#7C3AED" : "rgba(124,58,237,0.55)"}
                strokeWidth={activeBranch === "ladakh" ? "3.5" : "2"}
                strokeLinecap="round"
                filter={activeBranch === "ladakh" ? "url(#branch-glow)" : undefined}
                className="transition-all duration-300"
              />
              <circle cx="160" cy="450" r={activeBranch === "ladakh" ? 5 : 3.5} fill="#7C3AED" />
              <circle cx="80" cy="380" r="3.5" fill="#7C3AED" />
            </svg>
          </div>

          {/* 2-Column Asymmetric Staggered Canopy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 lg:gap-x-28 gap-y-10 items-start">
            {/* Left Column (Jammu & Kashmir, Uttarakhand) */}
            <div className="space-y-12 sm:space-y-16">
              {leftTerritories.map((region, idx) => {
                if (!region) return null;
                const profile = TERRITORY_PROFILES[region.id] ?? {
                  accent: "#3B82F6",
                  glow: "rgba(59,130,246,0.3)",
                  label: region.name,
                  image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
                  ranges: "Himalayan Massifs",
                  altitude: "1,500m – 6,000m",
                  emoji: "🏔️"
                };
                const totalPlaces = region.subregions.reduce((acc, sub) => acc + sub.places.length, 0);
                const isHovered = activeBranch === region.id;
                const branchIndex = idx === 0 ? 1 : 3;

                return (
                  <motion.div
                    key={region.id}
                    initial={{ opacity: 0, x: -28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: idx * 0.12, ease: EASE }}
                    onMouseEnter={() => setActiveBranch(region.id)}
                    onMouseLeave={() => setActiveBranch(null)}
                    className="relative z-10"
                  >
                    <Card3D depth={8} glareColor={profile.glow} className="rounded-2xl">
                      <Link
                        href={`/explore/${region.id}`}
                        className="group relative rounded-2xl overflow-hidden h-[210px] sm:h-[230px] flex flex-col justify-between p-5 border border-white/10 hover:border-white/30 transition-all duration-500 shadow-xl block w-full bg-slate-950/40"
                        style={{
                          boxShadow: isHovered
                            ? `0 12px 35px ${profile.glow}`
                            : "0 8px 24px rgba(0,0,0,0.35)",
                        }}
                      >
                        <Image
                          src={profile.image}
                          alt={profile.label}
                          fill
                          sizes="(max-width: 768px) 100vw, 45vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/20 z-[1]" />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none z-[1]"
                          style={{ background: `radial-gradient(circle at 50% 100%, ${profile.accent}60, transparent 70%)` }}
                        />

                        {/* Top: Branch Tag & Altitude */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md bg-black/75 flex items-center gap-1.5 shadow-md"
                            style={{ border: `1px solid ${profile.accent}90`, color: profile.accent }}
                          >
                            <span>{profile.emoji}</span>
                            <span>{profile.label}</span>
                          </span>
                          <span className="text-[10px] font-mono !text-white/90 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 shadow-md font-semibold">
                            {profile.altitude}
                          </span>
                        </div>

                        {/* Bottom: Name & Action */}
                        <div className="relative z-10">
                          <span 
                            className="text-[9px] font-mono uppercase tracking-[0.22em] block mb-0.5 font-medium"
                            style={{ color: "rgba(255,255,255,0.7)" }}
                          >
                            Branch 0{branchIndex} • {profile.ranges}
                          </span>
                          <div className="flex items-end justify-between gap-3">
                            <div>
                              <h3 
                                className="font-display font-bold text-lg sm:text-xl group-hover:text-amber-200 transition-colors leading-tight"
                                style={{ color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}
                              >
                                {region.name}
                              </h3>
                              <span 
                                className="text-[10px] font-mono block mt-0.5 font-medium"
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

            {/* Right Column (Himachal Pradesh, Ladakh) — Asymmetrically Staggered Down */}
            <div className="space-y-12 sm:space-y-16 md:pt-14">
              {rightTerritories.map((region, idx) => {
                if (!region) return null;
                const profile = TERRITORY_PROFILES[region.id] ?? {
                  accent: "#F59E0B",
                  glow: "rgba(245,158,11,0.3)",
                  label: region.name,
                  image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
                  ranges: "Himalayan Massifs",
                  altitude: "1,500m – 6,000m",
                  emoji: "🌲"
                };
                const totalPlaces = region.subregions.reduce((acc, sub) => acc + sub.places.length, 0);
                const isHovered = activeBranch === region.id;
                const branchIndex = idx === 0 ? 2 : 4;

                return (
                  <motion.div
                    key={region.id}
                    initial={{ opacity: 0, x: 28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: idx * 0.12, ease: EASE }}
                    onMouseEnter={() => setActiveBranch(region.id)}
                    onMouseLeave={() => setActiveBranch(null)}
                    className="relative z-10"
                  >
                    <Card3D depth={8} glareColor={profile.glow} className="rounded-2xl">
                      <Link
                        href={`/explore/${region.id}`}
                        className="group relative rounded-2xl overflow-hidden h-[210px] sm:h-[230px] flex flex-col justify-between p-5 border border-white/10 hover:border-white/30 transition-all duration-500 shadow-xl block w-full bg-slate-950/40"
                        style={{
                          boxShadow: isHovered
                            ? `0 12px 35px ${profile.glow}`
                            : "0 8px 24px rgba(0,0,0,0.35)",
                        }}
                      >
                        <Image
                          src={profile.image}
                          alt={profile.label}
                          fill
                          sizes="(max-width: 768px) 100vw, 45vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/20 z-[1]" />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none z-[1]"
                          style={{ background: `radial-gradient(circle at 50% 100%, ${profile.accent}60, transparent 70%)` }}
                        />

                        {/* Top: Branch Tag & Altitude */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md bg-black/75 flex items-center gap-1.5 shadow-md"
                            style={{ border: `1px solid ${profile.accent}90`, color: profile.accent }}
                          >
                            <span>{profile.emoji}</span>
                            <span>{profile.label}</span>
                          </span>
                          <span className="text-[10px] font-mono !text-white/90 bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 shadow-md font-semibold">
                            {profile.altitude}
                          </span>
                        </div>

                        {/* Bottom: Name & Action */}
                        <div className="relative z-10">
                          <span 
                            className="text-[9px] font-mono uppercase tracking-[0.22em] block mb-0.5 font-medium"
                            style={{ color: "rgba(255,255,255,0.7)" }}
                          >
                            Branch 0{branchIndex} • {profile.ranges}
                          </span>
                          <div className="flex items-end justify-between gap-3">
                            <div>
                              <h3 
                                className="font-display font-bold text-lg sm:text-xl group-hover:text-amber-200 transition-colors leading-tight"
                                style={{ color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}
                              >
                                {region.name}
                              </h3>
                              <span 
                                className="text-[10px] font-mono block mt-0.5 font-medium"
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

/* ── 3. Featured Iconic Expeditions (Himalayan Ridge Trail Flow) ─────────── */
function IconicTreksSection() {
  const featured = treks.slice(0, 4);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const updateWave = () => {
      if (!containerRef.current || !pathRef.current || !svgRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      if (containerRect.width === 0) return;

      const coords: { x: number; y: number }[] = [];
      for (let i = 0; i < 4; i++) {
        const el = cardRefs.current[i];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        // The waypoint pin is at y = i % 2 === 0 ? 20 : 76
        const y = (i % 2 === 0 ? 20 : 76);
        coords.push({ x, y });
      }

      if (coords.length === 4) {
        const [p0, p1, p2, p3] = coords;
        const dx01 = p1.x - p0.x;
        const dx12 = p2.x - p1.x;
        const dx23 = p3.x - p2.x;
        const W = containerRect.width;

        // Perfectly smooth horizontal tangents at all 4 summits and valleys
        const curve = `M 0 ${(p0.y + p1.y) / 2}
          C ${p0.x * 0.4} ${(p0.y + p1.y) / 2}, ${p0.x - dx01 * 0.3} ${p0.y}, ${p0.x} ${p0.y}
          C ${p0.x + dx01 * 0.45} ${p0.y}, ${p1.x - dx01 * 0.45} ${p1.y}, ${p1.x} ${p1.y}
          C ${p1.x + dx12 * 0.45} ${p1.y}, ${p2.x - dx12 * 0.45} ${p2.y}, ${p2.x} ${p2.y}
          C ${p2.x + dx23 * 0.45} ${p2.y}, ${p3.x - dx23 * 0.45} ${p3.y}, ${p3.x} ${p3.y}
          C ${p3.x + (W - p3.x) * 0.3} ${p3.y}, ${W - (W - p3.x) * 0.4} ${(p2.y + p3.y) / 2}, ${W} ${(p2.y + p3.y) / 2}`.replace(/\s+/g, " ").trim();

        pathRef.current.setAttribute("d", curve);
        if (areaRef.current) {
          areaRef.current.setAttribute("d", `${curve} L ${W} 320 L 0 320 Z`);
        }
        svgRef.current.setAttribute("viewBox", `0 0 ${W} 320`);
      }
    };

    updateWave();
    window.addEventListener("resize", updateWave);
    return () => window.removeEventListener("resize", updateWave);
  }, []);

  // Professional alpine milestone markers with trek names
  const WAYPOINTS = [
    { color: "#3B82F6", bg: "bg-blue-500", glow: "rgba(59, 130, 246, 0.45)", ring: "ring-blue-500/40", name: "Beas Kund", alt: "3,700 m" },
    { color: "#F59E0B", bg: "bg-amber-500", glow: "rgba(245, 158, 11, 0.45)", ring: "ring-amber-500/40", name: "Lamadugh", alt: "3,300 m" },
    { color: "#3B82F6", bg: "bg-blue-500", glow: "rgba(59, 130, 246, 0.45)", ring: "ring-blue-500/40", name: "Patalsu Peak", alt: "4,220 m" },
    { color: "#10B981", bg: "bg-emerald-500", glow: "rgba(16, 185, 129, 0.45)", ring: "ring-emerald-500/40", name: "Hampta Pass", alt: "4,270 m" },
  ];

  return (
    <section id="discover-trails" className="pt-2 pb-4 sm:py-5 md:py-6 relative z-10 bg-muted/20 transition-colors duration-300 overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-2 sm:mb-3 gap-2 relative z-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full glass-capsule text-primary text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-1 border border-slate-200/80 dark:border-white/10">
              <Mountain className="w-3 h-3" />
              Flagship Routes
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight leading-[1.1]">
              Discover the trails
            </h2>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.18em] text-primary hover:text-foreground transition-colors group"
          >
            <span>View All Guides &amp; Trails</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* ── Relative Grid Wrapper Containing Ridge Wave & Anchored Cards ─── */}
        <div ref={containerRef} className="relative pb-2">
          {/* ── Background Mountain Trail Ridge Wave ────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-visible z-0">
            <svg 
              ref={svgRef}
              className="w-full h-[300px]" 
              viewBox="0 0 1200 300" 
              preserveAspectRatio="none" 
              fill="none"
            >
              <defs>
                <linearGradient id="trailRidgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                  <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.85" />
                  <stop offset="65%" stopColor="#3B82F6" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="terrainAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
                <filter id="trailGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Terrain Silhouette Fill */}
              <path
                ref={areaRef}
                d=""
                fill="url(#terrainAreaGrad)"
              />

              {/* Ambient Trail Glow Line */}
              <path
                d=""
                stroke="url(#trailRidgeGrad)"
                strokeWidth="4"
                opacity="0.3"
                filter="url(#trailGlow)"
              />

              {/* Crisp Alpine Trail Wave Line */}
              <path
                ref={pathRef}
                d=""
                stroke="url(#trailRidgeGrad)"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
            </svg>
          </div>

          {/* Grid of 4 Precision-Anchored Alpine Trek Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10 pt-1 items-start">
            {featured.map((trek, index) => {
              const isLower = index % 2 === 1; // Cards 2 & 4 placed at wave troughs (offset by 44px)
              const wp = WAYPOINTS[index];

              return (
                <div
                  key={trek.slug}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`relative transition-all duration-500 ${
                    isLower ? "lg:mt-[44px]" : "lg:mt-0"
                  }`}
                >
                  {/* Waypoint Milestone Header (Directly anchored to wave crest/trough) */}
                  <div className="hidden lg:flex flex-col items-center mb-1.5 pointer-events-none">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-card/95 dark:bg-[#0b101e]/95 backdrop-blur-md border border-border/80 shadow-md">
                      {/* Luminous Pulsing Jewel Node */}
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${wp.bg} opacity-75`} />
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${wp.bg}`} />
                      </span>
                      <span className="text-[9px] font-mono font-bold tracking-wide text-foreground uppercase whitespace-nowrap">
                        {wp.name}
                      </span>
                      <span className="text-foreground/30 text-[8px]">•</span>
                      <span className="text-[9px] font-mono text-primary font-bold whitespace-nowrap">
                        {wp.alt}
                      </span>
                    </div>

                    {/* Illuminated Vertical Guide Stem linking Waypoint to Card */}
                    <div className="w-[1.5px] h-2 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />
                  </div>

                  {/* 3D Museum-Grade Alpine Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.4, delay: index * 0.08, ease: EASE }}
                  >
                    <Card3D depth={6} glareColor={isLower ? "rgba(245, 158, 11, 0.15)" : "rgba(59, 130, 246, 0.15)"} className="rounded-2xl">
                      <Link
                        href={`/explore/himachal-pradesh/kullu/${trek.slug}`}
                        className="group rounded-2xl overflow-hidden bg-card/90 dark:bg-[#090e1a]/95 backdrop-blur-xl flex flex-col justify-between block border border-border/70 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/10"
                      >
                        {/* High-Resolution Photo Banner */}
                        <div className="relative h-24 sm:h-26 w-full overflow-hidden shrink-0">
                          <Image
                            src={trek.heroImage || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=72"}
                            alt={trek.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card dark:from-[#090e1a] via-transparent to-black/30" />
                          
                          {/* Region Pill */}
                          <div 
                            className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[8.5px] font-mono text-white/90 font-bold uppercase tracking-wider shadow-sm"
                            style={{ transform: "translateZ(15px)" }}
                          >
                            {trek.region}
                          </div>

                          {/* Difficulty Pill */}
                          <div 
                            className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm ${
                              trek.difficulty.toLowerCase().includes("easy")
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            }`}
                            style={{ transform: "translateZ(15px)" }}
                          >
                            {trek.difficulty}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-3 flex flex-col flex-1 justify-between" style={{ transform: "translateZ(18px)" }}>
                          <div>
                            <h3 className="font-display font-bold text-sm sm:text-[14.5px] text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1 mb-1">
                              {trek.title}
                            </h3>
                            <p className="text-muted-foreground text-[10.5px] font-light line-clamp-2 mb-2.5 leading-relaxed">
                              {trek.overview}
                            </p>
                          </div>

                          {/* Refined Specs Meter Footer */}
                          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-primary/70" />
                              <span className="font-semibold text-foreground/80">{trek.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Mountain className="w-3 h-3 text-amber-400/80" />
                              <span className="font-semibold text-foreground/80">{trek.maxAltitude}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card3D>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 4. Planning Suite Hub (3D Interactive Tools Grid) ────────────────────── */
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
    <section className="py-24 relative z-10 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-capsule text-amber-600 dark:text-amber-400 text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-3 border border-slate-200/80 dark:border-white/10">
            <Layers className="w-3.5 h-3.5" />
            Deterministic Alpine Suite
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-foreground mb-4 tracking-tight leading-[1.08]">
            Comprehensive Expedition Planning
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base font-light leading-relaxed">
            Eliminate guesswork. Use precision tools built by high-altitude mountaineers to prepare for your Himalayan campaign.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANNING_TOOLS.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: EASE }}
                className="h-full"
              >
                <Card3D depth={12} glareColor={`${tool.accent}35`} className="rounded-3xl">
                  <Link
                    href={tool.href}
                    className="group p-7 rounded-3xl glass-museum-card flex flex-col justify-between h-full block"
                  >
                    <div style={{ transform: "translateZ(25px)" }}>
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-sm"
                        style={{
                          background: `${tool.accent}18`,
                          border: `1px solid ${tool.accent}35`,
                          transform: "translateZ(20px)"
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
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider mt-8 group-hover:translate-x-1.5 transition-transform"
                      style={{ color: tool.accent, transform: "translateZ(30px)" }}
                    >
                      Open Tool <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </Card3D>
              </motion.div>
            );
          })}

          {/* 3D Map Banner Card as 6th Item with Specular Glow */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 5 * 0.08, ease: EASE }}
            className="h-full"
          >
            <Card3D depth={14} glareColor="rgba(59, 130, 246, 0.4)" className="rounded-3xl">
              <Link
                href="/map"
                className="group p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-blue-500/30 glass-museum-card h-full block"
              >
                <div style={{ transform: "translateZ(25px)" }}>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mb-6" style={{ transform: "translateZ(20px)" }}>
                    <Map className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">
                    3D Geospatial Atlas
                  </h3>
                  <p className="text-foreground/65 text-xs sm:text-sm font-light leading-relaxed">
                    Interact with high-altitude terrain, valley contours, and summit elevation profiles in WebGL 3D.
                  </p>
                </div>
                <span 
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-primary mt-8 group-hover:translate-x-1.5 transition-transform"
                  style={{ transform: "translateZ(30px)" }}
                >
                  Launch Atlas <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </Card3D>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── 5. Mountain Safety & Medical Acclimatisation Banner ──────────────────── */
function SafetyFeatureSection() {
  return (
    <section className="py-20 relative z-10 bg-muted/20 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-amber-500/35 shadow-xl glass-museum-card"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-4">
              <HeartPulse className="w-3.5 h-3.5" />
              Mountain Safety Protocol
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-foreground mb-4 tracking-tight leading-[1.1]">
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
              className="px-8 py-4 rounded-2xl glass-capsule hover:bg-foreground/[0.08] text-foreground font-display font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-slate-200/80 dark:border-white/10"
            >
              Live Weather Radar
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── 6. Himalayan Dispatch Newsletter ─────────────────────────────────────── */
function DispatchNewsletterSection() {
  return (
    <section className="py-24 relative z-10 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
        <motion.div 
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="p-8 sm:p-14 rounded-3xl glass-capsule border border-foreground/[0.1] relative overflow-hidden shadow-xl"
        >
          {/* Subtle Background Glow */}
          <div 
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[100px] pointer-events-none bg-primary/10"
          />

          <div className="relative z-10 max-w-xl mx-auto">
            <span className="font-mono text-xs text-primary uppercase font-bold tracking-[0.25em] block mb-3">
              Alpine Dispatches
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground mb-4 tracking-tight leading-[1.1]">
              Get High-Altitude Trail Intelligence
            </h2>
            <p className="text-foreground/70 text-sm sm:text-base font-light leading-relaxed mb-8">
              Seasonal pass openings, permit policy updates, snowfall forecasts, and newly surveyed routes delivered directly to your inbox.
            </p>

            <NewsletterSignup variant="hero" className="max-w-md mx-auto" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Master Home Page Component ───────────────────────────────────────────── */
export default function Home() {
  // Auto-scroll slowly to 4 Himalayan Territories if idle for 1 second on landing
  useEffect(() => {
    let hasUserInteracted = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let animId: number | null = null;

    const cancelAutoScroll = () => {
      hasUserInteracted = true;
      if (timer) clearTimeout(timer);
      if (animId) cancelAnimationFrame(animId);
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener("wheel", cancelAutoScroll);
      window.removeEventListener("touchstart", cancelAutoScroll);
      window.removeEventListener("pointerdown", cancelAutoScroll);
      window.removeEventListener("keydown", cancelAutoScroll);
    };

    window.addEventListener("wheel", cancelAutoScroll, { passive: true });
    window.addEventListener("touchstart", cancelAutoScroll, { passive: true });
    window.addEventListener("pointerdown", cancelAutoScroll, { passive: true });
    window.addEventListener("keydown", cancelAutoScroll, { passive: true });

    // Wait 1 second of inactivity before beginning slow cinematic reveal
    timer = setTimeout(() => {
      if (!hasUserInteracted && window.scrollY < 40) {
        const heroElement = document.getElementById("home");
        if (!heroElement) return;

        // Total scrollable distance within the pinned hero track
        const scrollableDistance = heroElement.offsetHeight - window.innerHeight;
        // Stop precisely when the entire Hero is fully assembled (The Himalayan Trails + CTAs + Stats)
        const targetY = Math.round(scrollableDistance * 0.62);
        const startY = window.scrollY;
        const distance = targetY - startY;
        const duration = 2800; // 2.8s smooth, luxurious reveal
        const startTime = performance.now();

        // Ultra-gentle sine curve eliminates rush and cushions the final landing to perfection
        const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

        const step = (currentTime: number) => {
          if (hasUserInteracted) return;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeInOutSine(progress);

          window.scrollTo(0, startY + distance * eased);

          if (progress < 1 && !hasUserInteracted) {
            animId = requestAnimationFrame(step);
          } else {
            cleanupListeners();
          }
        };

        animId = requestAnimationFrame(step);
      }
    }, 1000);

    return () => {
      if (timer) clearTimeout(timer);
      if (animId) cancelAnimationFrame(animId);
      cleanupListeners();
    };
  }, []);

  return (
    <div className="w-full bg-background transition-colors duration-300 overflow-x-clip">
      <Hero />
      <TerritoriesSection />
      <IconicTreksSection />
      <PlanningSuiteSection />
      <SafetyFeatureSection />
      <DispatchNewsletterSection />
    </div>
  );
}
