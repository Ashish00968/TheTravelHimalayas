"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { himalayaAtlas } from "@/data/atlas";
import { treks } from "@/data/treks";
import { NewsletterSignup } from "@/components/monetization/NewsletterSignup";
import { Card3D } from "@/components/animation/Card3D";
import { FaqSection } from "@/components/home/FaqSection";
import {
  ArrowRight,
  Map,
  Compass,
  Mountain,
  Shield,
  Clock,
  HeartPulse,
  Orbit,
  GitCompare,
  Calculator,
  CheckSquare,
  CalendarDays,
  Activity,
  TrendingUp,
  GraduationCap,
  Radio,
  ShieldCheck,
} from "lucide-react";

const EASE = [0.23, 1, 0.32, 1] as const;

// Territory Design Profiles with High-Resolution Curated Photography
const TERRITORY_PROFILES: Record<
  string,
  {
    accent: string;
    glow: string;
    label: string;
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
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/v1780383856/jkMain.jpg",
    ranges: "Pir Panjal & Great Lakes Massif",
    altitude: "1,585m – 4,300m",
    emoji: "🏔️",
  },
  "himachal-pradesh": {
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.35)",
    label: "Himachal Pradesh",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/v1777221149/himachalMain.jpg",
    ranges: "Dhauladhar & Spiti Trans-Himalaya",
    altitude: "1,200m – 6,050m",
    emoji: "🌲",
  },
  ladakh: {
    accent: "#7C3AED",
    glow: "rgba(124,58,237,0.35)",
    label: "Ladakh",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/v1777213083/ladakhMain.png",
    ranges: "Zanskar, Ladakh & Karakoram Ranges",
    altitude: "3,000m – 7,135m",
    emoji: "🌌",
  },
  uttarakhand: {
    accent: "#0D9488",
    glow: "rgba(13,148,136,0.35)",
    label: "Uttarakhand",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/v1777220041/UttrakhandMain.jpg",
    ranges: "Garhwal & Kumaon Sanctuary",
    altitude: "1,800m – 7,816m",
    emoji: "🛕",
  },
};

/* ── 1A. Mobile-Optimized Alpine Hero (Immediate load, zero scroll-trapping) ─ */
function MobileHero() {
  return (
    <section
      id="home-mobile"
      className="-mt-20 relative w-full min-h-[100dvh] flex flex-col justify-between pt-24 pb-8 px-4 overflow-hidden md:hidden"
    >
      {/* Mountain Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="https://res.cloudinary.com/dehriwm1o/image/upload/v1777213099/Wallpaper.jpg"
          alt="Himalayan Mountain Range Panorama"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ filter: "contrast(1.08) saturate(1.08)" }}
        />
        {/* Cinematic Atmospheric Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/75 dark:from-[#040812]/85 dark:via-[#040812]/40 dark:to-[#040812]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent transition-colors duration-500" />
      </div>

      {/* Main Content with Staggered Entrance */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto my-auto w-full">
        {/* Title Stack */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mb-2 select-none"
        >
          <span
            className="block font-serif italic text-blue-300 drop-shadow-[0_2px_12px_rgba(59,130,246,0.5)]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.4rem",
              lineHeight: 1,
            }}
          >
            Discover
          </span>
          <span
            className="block font-serif font-bold text-white tracking-tight drop-shadow-[0_3px_20px_rgba(0,0,0,0.9)] my-0.5"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.6rem",
              lineHeight: 1,
            }}
          >
            Himalayan
          </span>
          <span
            className="block font-serif italic font-extrabold text-gradient-hero drop-shadow-[0_4px_24px_rgba(59,130,246,0.45)]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "3.1rem",
              lineHeight: 1.05,
            }}
          >
            Trails
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
          className="font-serif italic text-sm text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] mb-5"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Explore the Himalayas
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22, ease: EASE }}
          className="w-full space-y-2.5 mb-5"
        >
          <Link
            href="/explore"
            className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-primary/90 text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_8px_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Explore All Expeditions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/map"
            className="w-full py-3.5 px-6 rounded-full glass-capsule hover:bg-white/10 text-white font-display font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/20 active:scale-[0.98]"
          >
            <Map className="w-4 h-4 text-primary" />
            <span>Launch 3D Atlas</span>
          </Link>
        </motion.div>

        {/* Territory Micro-Pill Dock */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32, ease: EASE }}
          className="grid grid-cols-2 gap-2 w-full max-w-[280px]"
        >
          {Object.entries(TERRITORY_PROFILES).map(([id, t]) => (
            <Link
              key={id}
              href={`/explore/${id}`}
              className="py-1.5 px-2.5 rounded-full text-[11px] font-mono font-medium tracking-wide glass-capsule transition-all flex items-center justify-center gap-1.5 shadow-sm border border-white/15 text-white/95 active:scale-95"
              style={{ borderLeft: `3px solid ${t.accent}` }}
            >
              <span>{t.emoji}</span>
              <span className="font-semibold truncate">{t.label}</span>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Minimal Metrics Ticker */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.42, ease: EASE }}
        className="relative z-10 flex items-center justify-around py-2.5 px-3 rounded-2xl glass-capsule border border-white/15 bg-white/[0.06] dark:bg-[#0A1122]/70 backdrop-blur-xl shadow-lg max-w-xs mx-auto w-full text-center"
      >
        <div>
          <span className="font-display font-extrabold text-sm text-blue-400 block">59</span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-white/70">Trails</span>
        </div>
        <span className="w-px h-5 bg-white/20" />
        <div>
          <span className="font-display font-extrabold text-sm text-amber-400 block">4</span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-white/70">Territories</span>
        </div>
        <span className="w-px h-5 bg-white/20" />
        <div>
          <span className="font-display font-extrabold text-sm text-purple-400 block">7,816m</span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-white/70">Ceiling</span>
        </div>
        <span className="w-px h-5 bg-white/20" />
        <div>
          <span className="font-display font-extrabold text-sm text-teal-400 block">100%</span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-white/70">Free</span>
        </div>
      </motion.div>
    </section>
  );
}

/* ── 1B. Desktop Cinematic Hero with Fluid Stagger & Silky Parallax Outro ─ */
function DesktopHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Subtle background scroll parallax
  const bgScrollY = useTransform(scrollYProgress, [0, 1], [0, 160]);

  // Interactive mouse parallax with smooth spring responsiveness
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 45, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 45, damping: 20 });
  const inverseMouseX = useTransform(smoothMouseX, (v) => -v * 0.4);
  const inverseMouseY = useTransform(smoothMouseY, (v) => -v * 0.4);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 40;
      const y = (clientY / window.innerHeight - 0.5) * 40;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      id="home"
      ref={containerRef}
      suppressHydrationWarning
      className="-mt-20 relative w-full min-h-[100vh] flex flex-col items-center justify-center pt-28 pb-20 px-4 overflow-hidden hidden md:flex"
    >
      {/* ── Background Layer with Inverse Mouse Parallax & Subtle Scroll Parallax ── */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-10% 0 -10% 0",
          scale: 1.06,
          x: inverseMouseX,
          y: inverseMouseY,
          translateY: bgScrollY,
          transformOrigin: "center 45%",
          pointerEvents: "none",
        }}
      >
        <Image
          src="https://res.cloudinary.com/dehriwm1o/image/upload/v1777213099/Wallpaper.jpg"
          alt="Himalayan Mountain Range Panorama"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-100 transition-transform duration-700 ease-out"
          style={{
            filter: "contrast(1.08) saturate(1.08)",
          }}
        />
      </motion.div>

      {/* Cinematic Atmospheric Vignette with Enhanced Contrast */}
      <div className="absolute inset-0 z-[1] pointer-events-none transition-colors duration-500 bg-gradient-to-b from-black/60 via-black/35 to-black/75 dark:from-[#040812]/85 dark:via-[#040812]/45 dark:to-[#040812]" />

      {/* Generous Edge Melt — Feathers bottom boundary seamlessly into Four Himalayan Territories */}
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-64 pointer-events-none z-[4] bg-gradient-to-t from-background via-background/70 to-transparent transition-colors duration-500" />

      {/* Soft Contrast Backplate & Radial Aura Behind Headline */}
      <div className="absolute z-[2] inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[850px] h-[440px] rounded-full bg-black/40 dark:bg-black/55 blur-[90px]" />
        <div className="absolute w-[650px] h-[300px] rounded-full bg-blue-600/20 blur-[130px]" />
      </div>

      {/* ── Dynamic Storytelling Content (Immediate Silky Stagger on Landing) ── */}
      <div
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
        }}
      >
          {/* Headline Words Stack with Immediate Smooth Entrance */}
          <div style={{ width: "100%", marginBottom: "14px" }}>
            {/* Step 1: DISCOVER */}
            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{
                textAlign: "center",
                x: smoothMouseX,
              }}
              className="select-none"
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)",
                  fontWeight: 600,
                  fontStyle: "italic",
                  color: "#93C5FD",
                  lineHeight: 1,
                  display: "block",
                  letterSpacing: "0.02em",
                  textShadow: "0 4px 28px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8), 0 0 35px rgba(59, 130, 246, 0.5)",
                }}
              >
                Discover
              </span>
            </motion.div>

            {/* Step 2: HIMALAYAN */}
            <motion.div
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.75, delay: 0.12, ease: EASE }}
              style={{
                textAlign: "center",
                x: smoothMouseX,
                margin: "2px 0",
              }}
              className="select-none"
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(3rem, 9vw, 7.2rem)",
                  fontWeight: 600,
                  color: "#ffffff",
                  lineHeight: 1,
                  display: "block",
                  letterSpacing: "-0.02em",
                  textShadow: "0 4px 34px rgba(0,0,0,0.95), 0 2px 12px rgba(0,0,0,0.9)",
                }}
              >
                Himalayan
              </span>
            </motion.div>

            {/* Step 3: TRAILS */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
              style={{
                textAlign: "center",
                x: smoothMouseX,
              }}
              className="select-none"
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(3.5rem, 10.5vw, 8.2rem)",
                  fontWeight: 700,
                  fontStyle: "italic",
                  lineHeight: 1.05,
                  display: "block",
                  textShadow: "0 6px 36px rgba(0,0,0,0.95), 0 0 45px rgba(59, 130, 246, 0.4)",
                }}
                className="text-gradient-hero pb-2"
              >
                Trails
              </span>
            </motion.div>
          </div>

          {/* Step 4: Tagline + Action Buttons + Territory Dock + Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.36, ease: EASE }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "840px",
            }}
          >
            {/* Tagline: Explore the Himalayas */}
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
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
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-display font-bold text-sm tracking-wide transition-all shadow-[0_8px_30px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.45)] flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <span>Explore All Expeditions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                href="/map"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full glass-capsule hover:bg-white/10 text-white font-display font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2 border border-white/15 active:scale-[0.98]"
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

            {/* Sleek Minimal Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 px-6 py-2.5 rounded-full glass-capsule border border-white/15 bg-white/[0.05] dark:bg-[#0A1122]/60 backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg text-blue-400">59</span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/70 font-semibold">
                  Mapped Trails
                </span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/25 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg text-amber-400">4</span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/70 font-semibold">
                  Territories
                </span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/25 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg text-purple-400">7,816m</span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/70 font-semibold">
                  Highest Peak
                </span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/25 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg text-teal-400">100%</span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/70 font-semibold">
                  Free Access
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subtle Scroll Down Prompt */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none opacity-75">
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-blue-200/75 font-medium">
            Explore Below
          </span>
          <div className="w-[1.5px] h-4 rounded-full bg-gradient-to-b from-blue-400/80 to-transparent animate-pulse" />
        </div>
      </section>
  );
}

function Hero() {
  return (
    <>
      <MobileHero />
      <DesktopHero />
    </>
  );
}

/* ── 2. Territories Showcase (Cinematic Mountain Expedition Tree) ──────────── */
function TerritoriesSection() {
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  const leftTerritories = [himalayaAtlas[0], himalayaAtlas[3]]; // J&K, Uttarakhand
  const rightTerritories = [himalayaAtlas[1], himalayaAtlas[2]]; // Himachal, Ladakh

  return (
    <section
      id="territories"
      className="pt-12 sm:pt-20 pb-16 sm:pb-28 relative z-10 scroll-mt-12 bg-background transition-colors duration-300"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-6 sm:mb-8 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-capsule text-primary text-[10px] font-mono uppercase tracking-[0.22em] font-bold mb-3 border border-slate-200/80 dark:border-white/10">
            <Compass className="w-3.5 h-3.5" />
            Himalayan Expedition Tree
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-5xl text-foreground mb-2.5 sm:mb-3 tracking-tight leading-[1.08]">
            Four Himalayan Territories
          </h2>
          <p className="text-foreground/70 text-xs sm:text-sm font-light leading-relaxed max-w-lg mx-auto">
            A branching geographic traverse across the 2,400km Indian Himalayan Arc. Choose your theatre of exploration.
          </p>

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
            <svg
              viewBox="0 0 160 560"
              fill="none"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="branch-glow" x="-20%" y="-20%" width="140%" height="140%">
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
                y2="540"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Branch 1: Left to J&K */}
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

              {/* Branch 2: Right to Himachal */}
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

              {/* Branch 3: Left to Uttarakhand */}
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

              {/* Branch 4: Right to Ladakh */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 lg:gap-x-28 gap-y-4 md:gap-y-10 items-start">
            {/* Left Column (Jammu & Kashmir, Uttarakhand) */}
            <div className="space-y-4 md:space-y-16">
              {leftTerritories.map((region, idx) => {
                const profile = TERRITORY_PROFILES[region.id];
                const totalPlaces = region.subregions.reduce(
                  (acc, s) => acc + s.places.length,
                  0
                );
                return (
                  <motion.div
                    key={region.id}
                    initial={{ opacity: 0, x: -28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: idx * 0.12, ease: EASE }}
                    onMouseEnter={() => setActiveBranch(region.id)}
                    onMouseLeave={() => setActiveBranch(null)}
                  >
                    <Card3D depth={8} glareColor={profile.glow} className="rounded-2xl sm:rounded-3xl">
                      <Link
                        href={`/explore/${region.id}`}
                        className="group relative rounded-2xl sm:rounded-3xl overflow-hidden block border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl h-[185px] sm:h-[230px]"
                      >
                        <Image
                          src={profile.image}
                          alt={region.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 group-hover:from-black/95 transition-colors" />

                        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between z-10">
                          <div className="flex items-center justify-between">
                            <span
                              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border shadow-sm"
                              style={{
                                backgroundColor: `${profile.accent}25`,
                                color: "#ffffff",
                                borderColor: `${profile.accent}60`,
                              }}
                            >
                              {profile.ranges}
                            </span>
                            <span className="text-[10px] font-mono text-white/80 font-semibold">
                              {profile.altitude}
                            </span>
                          </div>

                          <div className="flex items-end justify-between">
                            <div>
                              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-tight">
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

            {/* Right Column (Himachal Pradesh, Ladakh) */}
            <div className="space-y-4 md:space-y-16 md:mt-14">
              {rightTerritories.map((region, idx) => {
                const profile = TERRITORY_PROFILES[region.id];
                const totalPlaces = region.subregions.reduce(
                  (acc, s) => acc + s.places.length,
                  0
                );
                return (
                  <motion.div
                    key={region.id}
                    initial={{ opacity: 0, x: 28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: idx * 0.12, ease: EASE }}
                    onMouseEnter={() => setActiveBranch(region.id)}
                    onMouseLeave={() => setActiveBranch(null)}
                  >
                    <Card3D depth={8} glareColor={profile.glow} className="rounded-2xl sm:rounded-3xl">
                      <Link
                        href={`/explore/${region.id}`}
                        className="group relative rounded-2xl sm:rounded-3xl overflow-hidden block border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl h-[185px] sm:h-[230px]"
                      >
                        <Image
                          src={profile.image}
                          alt={region.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 group-hover:from-black/95 transition-colors" />

                        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between z-10">
                          <div className="flex items-center justify-between">
                            <span
                              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border shadow-sm"
                              style={{
                                backgroundColor: `${profile.accent}25`,
                                color: "#ffffff",
                                borderColor: `${profile.accent}60`,
                              }}
                            >
                              {profile.ranges}
                            </span>
                            <span className="text-[10px] font-mono text-white/80 font-semibold">
                              {profile.altitude}
                            </span>
                          </div>

                          <div className="flex items-end justify-between">
                            <div>
                              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-tight">
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
        const y = i % 2 === 0 ? 20 : 76;
        coords.push({ x, y });
      }

      if (coords.length === 4) {
        const [p0, p1, p2, p3] = coords;
        const dx01 = p1.x - p0.x;
        const dx12 = p2.x - p1.x;
        const dx23 = p3.x - p2.x;
        const W = containerRect.width;

        const curve = `M 0 ${(p0.y + p1.y) / 2}
          C ${p0.x * 0.4} ${(p0.y + p1.y) / 2}, ${p0.x - dx01 * 0.3} ${p0.y}, ${p0.x} ${p0.y}
          C ${p0.x + dx01 * 0.45} ${p0.y}, ${p1.x - dx01 * 0.45} ${p1.y}, ${p1.x} ${p1.y}
          C ${p1.x + dx12 * 0.45} ${p1.y}, ${p2.x - dx12 * 0.45} ${p2.y}, ${p2.x} ${p2.y}
          C ${p2.x + dx23 * 0.45} ${p2.y}, ${p3.x - dx23 * 0.45} ${p3.y}, ${p3.x} ${p3.y}
          C ${p3.x + (W - p3.x) * 0.3} ${p3.y}, ${W - (W - p3.x) * 0.4} ${(p2.y + p3.y) / 2}, ${W} ${(p2.y + p3.y) / 2}`
          .replace(/\s+/g, " ")
          .trim();

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

  const WAYPOINTS = [
    { color: "#3B82F6", bg: "bg-blue-500", glow: "rgba(59, 130, 246, 0.45)", name: "Beas Kund", alt: "3,700 m" },
    { color: "#F59E0B", bg: "bg-amber-500", glow: "rgba(245, 158, 11, 0.45)", name: "Lamadugh", alt: "3,300 m" },
    { color: "#3B82F6", bg: "bg-blue-500", glow: "rgba(59, 130, 246, 0.45)", name: "Patalsu Peak", alt: "4,220 m" },
    { color: "#10B981", bg: "bg-emerald-500", glow: "rgba(16, 185, 129, 0.45)", name: "Hampta Pass", alt: "4,270 m" },
  ];

  return (
    <section
      id="discover-trails"
      className="py-6 sm:py-8 md:py-10 relative z-10 bg-muted/20 transition-colors duration-300 overflow-hidden scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-3 sm:mb-4 gap-2 relative z-10"
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

        {/* Relative Grid Wrapper Containing Ridge Wave & Anchored Cards */}
        <div ref={containerRef} className="relative pb-2">
          {/* Background Mountain Trail Ridge Wave */}
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

              <path ref={areaRef} d="" fill="url(#terrainAreaGrad)" />
              <path
                d=""
                stroke="url(#trailRidgeGrad)"
                strokeWidth="4"
                opacity="0.3"
                filter="url(#trailGlow)"
              />
              <path
                ref={pathRef}
                d=""
                stroke="url(#trailRidgeGrad)"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
            </svg>
          </div>

          {/* Mobile Snap Carousel / Desktop Sinusoidal Grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-none md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 sm:gap-5 relative z-10 pt-1 items-start">
            {featured.map((trek, index) => {
              const isLower = index % 2 === 1;
              const wp = WAYPOINTS[index];

              return (
                <div
                  key={trek.slug}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`relative shrink-0 w-[84vw] max-w-[310px] snap-center md:w-auto md:max-w-none md:shrink transition-all duration-500 ${
                    isLower ? "lg:mt-[44px]" : "lg:mt-0"
                  }`}
                >
                  {/* Waypoint Milestone Header */}
                  <div className="hidden lg:flex flex-col items-center mb-1.5 pointer-events-none">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-card/95 dark:bg-[#0b101e]/95 backdrop-blur-md border border-border/80 shadow-md">
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
                    <div className="w-[1.5px] h-2 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />
                  </div>

                  {/* 3D Museum-Grade Alpine Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.4, delay: index * 0.08, ease: EASE }}
                  >
                    <Card3D
                      depth={6}
                      glareColor={isLower ? "rgba(245, 158, 11, 0.15)" : "rgba(59, 130, 246, 0.15)"}
                      className="rounded-2xl"
                    >
                      <Link
                        href={`/explore/himachal-pradesh/kullu/${trek.slug}`}
                        className="group rounded-2xl overflow-hidden bg-card/90 dark:bg-[#090e1a]/95 backdrop-blur-xl flex flex-col justify-between block border border-border/70 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/10"
                      >
                        <div className="relative h-24 sm:h-26 w-full overflow-hidden shrink-0">
                          <Image
                            src={
                              trek.heroImage ||
                              "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=72"
                            }
                            alt={trek.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card dark:from-[#090e1a] via-transparent to-black/30" />

                          <div
                            className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[8.5px] font-mono text-white/90 font-bold uppercase tracking-wider shadow-sm"
                            style={{ transform: "translateZ(15px)" }}
                          >
                            {trek.region}
                          </div>

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

                        <div className="p-3 flex flex-col flex-1 justify-between" style={{ transform: "translateZ(18px)" }}>
                          <div>
                            <h3 className="font-display font-bold text-sm sm:text-[14.5px] text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1 mb-1">
                              {trek.title}
                            </h3>
                            <p className="text-muted-foreground text-[10.5px] font-light line-clamp-2 mb-2.5 leading-relaxed">
                              {trek.overview}
                            </p>
                          </div>

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

          {/* Mobile Carousel Swipe Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2 pb-1 md:hidden">
            {featured.map((t) => (
              <span key={t.slug} className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 4. Planning Suite Hub (Deterministic Alpine Instruments) ─────────────── */
const PLANNING_TOOLS = [
  {
    id: "atlas",
    num: "01",
    title: "3D Geospatial Atlas",
    category: "3D WebGL Terrain",
    desc: "Inspect digital elevation models, trace high mountain passes, and examine the verticality of Himalayan valleys in high-resolution 3D WebGL.",
    href: "/map",
    icon: Orbit,
    accent: "#3B82F6",
    glow: "rgba(59, 130, 246, 0.25)",
    action: "Launch 3D Atlas",
    tags: ["1.7x DEM Relief", "360° Ridge Vantage", "4 Territories"],
  },
  {
    id: "finder",
    num: "02",
    title: "Deterministic Trek Finder",
    category: "Algorithmic Discovery",
    desc: "Filter 59+ high-altitude routes by elevation gain, difficulty, month, and territory using transparent parameters without algorithmic bias.",
    href: "/plan/trek-finder",
    icon: Compass,
    accent: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.25)",
    action: "Launch Finder",
    tags: ["Filter by Month", "Elevation Brackets", "Direct Results"],
  },
  {
    id: "compare",
    num: "03",
    title: "Head-to-Head Comparison",
    category: "Route Matrix",
    desc: "Compare two trails across gradient, technical difficulty, daily gain, and permit costs on a synchronized side-by-side spec sheet.",
    href: "/plan/compare",
    icon: GitCompare,
    accent: "#3B82F6",
    glow: "rgba(59, 130, 246, 0.25)",
    action: "Compare Routes",
    tags: ["Side-by-Side Matrix", "Altitude Deltas", "Logistics"],
  },
  {
    id: "budget",
    num: "04",
    title: "Expedition Budget Estimator",
    category: "Financial Forecasting",
    desc: "Calculate realistic costs for mountain guides, mule support, forest permits, transit, and emergency reserves across each territory.",
    href: "/plan/budget",
    icon: Calculator,
    accent: "#0D9488",
    glow: "rgba(13, 148, 136, 0.25)",
    action: "Calculate Budget",
    tags: ["Per-Day Estimates", "Porter Rates", "Permit Fees"],
  },
  {
    id: "packing",
    num: "05",
    title: "Alpine Packing Checklist",
    category: "Gear Architecture",
    desc: "Generate tailored gear checklists based on pass altitude, season, sub-zero temperature rating, and sleeping arrangements.",
    href: "/plan/packing",
    icon: CheckSquare,
    accent: "#7C3AED",
    glow: "rgba(124, 58, 237, 0.25)",
    action: "Generate Checklist",
    tags: ["Layering Systems", "C1 Crampons", "AMS Medical Kit"],
  },
  {
    id: "season",
    num: "06",
    title: "Seasonal Weather Matrix",
    category: "Meteorological Windows",
    desc: "Understand month-by-month snowmelt timelines, monsoon rain shadows, post-monsoon crystal clarity, and winter freeze.",
    href: "/plan/season",
    icon: CalendarDays,
    accent: "#06B6D4",
    glow: "rgba(6, 182, 212, 0.25)",
    action: "Explore Seasons",
    tags: ["Snowmelt Windows", "Rain Shadows", "Autumn Clarity"],
  },
];

function PlanningSuiteSection() {
  return (
    <section className="py-16 sm:py-24 relative z-10 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-capsule text-primary text-[10px] font-mono uppercase tracking-[0.22em] font-bold mb-3 border border-slate-200/80 dark:border-white/10">
            <Compass className="w-3.5 h-3.5" />
            Expedition Planning Suite
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-foreground mb-3 tracking-tight leading-[1.08]">
            Precision Alpine Planning
          </h2>
          <p className="text-foreground/70 text-xs sm:text-base font-light leading-relaxed max-w-xl mx-auto">
            Eliminate guesswork before stepping onto high Himalayan trails. Six deterministic field instruments calibrated for 1,500m to 7,135m traverses.
          </p>
        </motion.div>

        {/* 6-Instrument Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {PLANNING_TOOLS.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: EASE }}
                className="h-full"
              >
                <Card3D depth={6} glareColor={tool.glow} className="rounded-2xl sm:rounded-3xl h-full">
                  <Link
                    href={tool.href}
                    className="group relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 bg-surface/90 dark:bg-[#0A1122]/90 backdrop-blur-xl transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.99] h-full min-h-[320px] overflow-hidden block"
                  >
                    <div
                      className="absolute -top-20 -right-20 w-44 h-44 rounded-full pointer-events-none opacity-0 group-hover:opacity-25 transition-opacity duration-500 blur-3xl"
                      style={{ background: tool.accent }}
                    />

                    <div className="relative z-10 flex items-center justify-between gap-2 mb-6">
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border transition-colors"
                        style={{
                          color: tool.accent,
                          borderColor: `${tool.accent}33`,
                          backgroundColor: `${tool.accent}0D`,
                        }}
                      >
                        <span>{tool.num}</span>
                        <span className="opacity-40">•</span>
                        <span>{tool.category}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-foreground/45">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: tool.accent }} />
                        <span>Tool</span>
                      </div>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col">
                      <div className="mb-5">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 shadow-sm"
                          style={{
                            backgroundColor: `${tool.accent}14`,
                            borderColor: `${tool.accent}35`,
                            color: tool.accent,
                            boxShadow: `0 8px 24px -6px ${tool.accent}30`,
                          }}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors leading-tight mb-2.5 tracking-tight">
                        {tool.title}
                      </h3>

                      <p className="text-foreground/70 text-xs sm:text-sm font-light leading-relaxed mb-6">
                        {tool.desc}
                      </p>
                    </div>

                    <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-3 mt-auto">
                      <div className="flex flex-wrap gap-1.5">
                        {tool.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-foreground/[0.04] text-foreground/75 border border-foreground/[0.08]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider shrink-0 group-hover:translate-x-1 transition-transform"
                        style={{ color: tool.accent }}
                      >
                        <span>{tool.action}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </Card3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── 5. Mountain Safety & Medical Acclimatisation Command Console ─────────── */
function SafetyFeatureSection() {
  const safetyPillars = [
    {
      title: "Ascent Ceiling",
      badge: "500m / Day Limit",
      desc: "Net sleeping altitude gain cap above 3,000m. Mandatory acclimatisation rest day every 1,000m net gain.",
      icon: TrendingUp,
      accent: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/25",
    },
    {
      title: "Emergency Triage",
      badge: "Immediate Descent",
      desc: "Persistent headache, ataxia, or rales mandate immediate descent of 500–1,000m before medications.",
      icon: HeartPulse,
      accent: "text-amber-500 dark:text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/25",
    },
    {
      title: "Accredited Syllabi",
      badge: "HMI · NIM · ABVIMAS",
      desc: "Standardized mountaineering curriculum from premier national institutes for BMC, AMC, and Alpine SAR.",
      icon: GraduationCap,
      accent: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-500/10 border-teal-500/25",
    },
  ];

  return (
    <section className="py-14 sm:py-24 relative z-10 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-2xl bg-white/75 dark:bg-[#070D1A]/95 backdrop-blur-2xl"
        >
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/15 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-200/70 dark:border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono uppercase tracking-[0.2em] font-bold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                High-Altitude Safety Command
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-foreground tracking-tight leading-[1.15]">
                High-Altitude Acclimatisation &amp; Medicine
              </h2>
              <p className="text-foreground/70 text-xs sm:text-sm font-light leading-relaxed max-w-2xl mt-2">
                Altitude sickness is physiological and indifferent to physical fitness. Study comprehensive field protocols on Acute Mountain Sickness (AMS), HAPE, HACE, cold-injury triage, and certified mountaineering syllabus standards.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
              <Link
                href="/safety"
                className="px-6 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(59,130,246,0.35)] hover:shadow-[0_6px_25px_rgba(59,130,246,0.45)] active:scale-[0.98] group"
              >
                <Shield className="w-4 h-4" />
                <span>Explore Safety Protocols</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/conditions"
                className="px-6 py-3.5 rounded-full glass-capsule hover:bg-foreground/[0.08] text-foreground font-display font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-slate-200/90 dark:border-white/15 active:scale-[0.98]"
              >
                <Activity className="w-3.5 h-3.5 text-primary" />
                <span>Live Weather Radar</span>
              </Link>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-8">
            {safetyPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl border border-slate-200/70 dark:border-white/[0.08] bg-slate-50/70 dark:bg-white/[0.03] transition-all hover:border-slate-300 dark:hover:border-white/20 group"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${pillar.bg} ${pillar.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-foreground/[0.05] text-foreground/75 border border-foreground/[0.08]">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-foreground mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-foreground/65 text-xs leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 mt-8 pt-5 border-t border-slate-200/60 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-foreground/50">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                UIAA &amp; Wilderness Medical Society Standards
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Emergency SAR Frequencies (121.5 / 243.0 MHz)
              </span>
            </div>
            <Link
              href="/safety#emergency-contacts"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>Emergency Dispatch Directory</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── 6. Himalayan Dispatch Newsletter ─────────────────────────────────────── */
function DispatchNewsletterSection() {
  const dispatchHighlights = [
    {
      label: "Pass Radar",
      detail: "Rohtang, Kunzum, Sach, Zoji La & high-pass status telemetry",
      icon: Radio,
    },
    {
      label: "Permit Alerts",
      detail: "ILP & Forest Dept clearance regulation notices",
      icon: ShieldCheck,
    },
    {
      label: "Expedition Logs",
      detail: "Newly surveyed GPS routes and field gear evaluations",
      icon: Compass,
    },
  ];

  return (
    <section className="pt-6 sm:pt-10 pb-16 sm:pb-24 relative z-10 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="p-8 sm:p-14 rounded-3xl border border-slate-200/80 dark:border-white/10 relative overflow-hidden shadow-2xl bg-gradient-to-b from-slate-50/90 via-white to-slate-50/80 dark:from-[#09101F]/90 dark:via-[#070D1A] dark:to-[#050A14] backdrop-blur-xl"
        >
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[120px] pointer-events-none bg-primary/15" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-capsule text-primary text-[10px] font-mono uppercase tracking-[0.22em] font-bold mb-4 border border-slate-200/80 dark:border-white/10">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Alpine Field Intelligence
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-foreground mb-3 tracking-tight leading-[1.1]">
              High-Altitude Trail Intelligence
            </h2>
            <p className="text-foreground/70 text-xs sm:text-base font-light leading-relaxed mb-8 max-w-xl mx-auto">
              Seasonal pass openings, permit policy changes, snowpack depth telemetry, and newly surveyed alpine routes delivered directly to your inbox.
            </p>

            <NewsletterSignup variant="hero" className="max-w-lg mx-auto mb-10" />

            {/* 3 Dispatch Focus Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/60 dark:border-white/[0.08] text-left">
              {dispatchHighlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-100/60 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05]"
                  >
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground mb-1">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span>{item.label}</span>
                    </div>
                    <p className="text-[11px] text-foreground/60 leading-snug font-light">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Master Home Client Component ─────────────────────────────────────────── */
export function HomeClient() {
  return (
    <div className="w-full bg-background transition-colors duration-300 overflow-x-clip">
      <Hero />
      <TerritoriesSection />
      <IconicTreksSection />
      <PlanningSuiteSection />
      <SafetyFeatureSection />
      <FaqSection />
      <DispatchNewsletterSection />
    </div>
  );
}
