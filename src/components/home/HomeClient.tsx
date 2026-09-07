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
  useReducedMotion,
} from "framer-motion";
import { himalayaAtlas, placeLocationIndex } from "@/data/atlas";
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
  MapPin,
  Sparkles,
} from "lucide-react";


const EASE = [0.23, 1, 0.32, 1] as const;

// Territory Design Profiles with High-Resolution Curated Photography
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

/* ── 1A. Mobile Alpine Hero with 2.5D "Behind the Mountain" Scroll Revelation ─ */
function MobileHero() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mobile scroll tracking over clamp(250vh, 280vh, 310vh) for leisurely, cinematic pacing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  // Background & Foreground Parallax
  const bgScale = useTransform(smoothProgress, [0, 1], [1.02, 1.10]);
  const bgY = useTransform(smoothProgress, [0, 1], [0, 50]);
  const fgScale = useTransform(smoothProgress, [0, 1], [1.02, 1.10]);
  const fgY = useTransform(smoothProgress, [0, 1], [0, 50]);

  // STEP 1: Discover — visible in open sky on landing
  const discoverOpacityRaw = useTransform(smoothProgress, [0, 0.08], [0.95, 1]);
  const discoverYRaw = useTransform(smoothProgress, [0, 0.08], [4, 0]);

  // STEP 2: Himalayan — emerges from BEHIND the mountain peaks (rising up from behind ridge)
  const himalayanOpacityRaw = useTransform(smoothProgress, [0.05, 0.32], [0, 1]);
  const himalayanYRaw = useTransform(smoothProgress, [0.05, 0.32], [70, 0]);

  // STEP 3: Trails — rises up along the ridge from behind the peaks
  const trailsOpacityRaw = useTransform(smoothProgress, [0.22, 0.48], [0, 1]);
  const trailsYRaw = useTransform(smoothProgress, [0.22, 0.48], [80, 0]);
  const trailsScaleRaw = useTransform(smoothProgress, [0.22, 0.48], [0.92, 1]);

  // STEP 4: Basecamp Controls (Tagline + Action Buttons + Territory Micro-Pill Dock + Stats)
  const detailsOpacityRaw = useTransform(smoothProgress, [0.48, 0.72], [0, 1]);
  const detailsYRaw = useTransform(smoothProgress, [0.48, 0.72], [20, 0]);
  const detailsPointerEvents = useTransform(smoothProgress, (p) => (p > 0.50 ? "auto" : "none"));

  // Scroll Down Indicator Hint (fades out cleanly as scroll starts)
  const scrollHintOpacity = useTransform(smoothProgress, [0, 0.06], [1, 0]);

  // Outro transition — gentle start to fading, never fades away completely ("little by little start fading only")
  const contentOpacityOutro = useTransform(smoothProgress, [0.88, 1.0], [1, 0.65]);
  const contentYOutro = useTransform(smoothProgress, [0.88, 1.0], [0, -10]);

  // Bottom Edge Horizon Melt
  const bottomMeltOpacity = useTransform(smoothProgress, [0.75, 1.0], [0, 0.90]);

  // Accessibility override for users requesting reduced motion
  const discoverOpacity = shouldReduceMotion ? 1 : discoverOpacityRaw;
  const discoverY = shouldReduceMotion ? 0 : discoverYRaw;
  const himalayanOpacity = shouldReduceMotion ? 1 : himalayanOpacityRaw;
  const himalayanY = shouldReduceMotion ? 0 : himalayanYRaw;
  const trailsOpacity = shouldReduceMotion ? 1 : trailsOpacityRaw;
  const trailsY = shouldReduceMotion ? 0 : trailsYRaw;
  const trailsScale = shouldReduceMotion ? 1 : trailsScaleRaw;
  const detailsOpacity = shouldReduceMotion ? 1 : detailsOpacityRaw;
  const detailsY = shouldReduceMotion ? 0 : detailsYRaw;

  return (
    <section
      id="home-mobile"
      ref={containerRef}
      suppressHydrationWarning
      className="-mt-20 relative w-full md:hidden"
      style={{
        height: "clamp(250vh, 280vh, 310vh)",
      }}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-between pt-20 pb-6 px-4">
        {/* Layer 1: Background Mountain Wallpaper (z-0) */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            scale: bgScale,
            y: bgY,
            pointerEvents: "none",
          }}
          className="z-0"
        >
          <Image
            src="https://res.cloudinary.com/dehriwm1o/image/upload/v1777213099/Wallpaper.jpg"
            alt="Himalayan Mountain Range Panorama"
            fill
            priority
            sizes="100vw"
            className="hero-wallpaper-img object-cover object-center"
          />
          {/* Cinematic Atmospheric Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/60 dark:from-[#040812]/50 dark:via-transparent dark:to-[#040812]/65" />
        </motion.div>

        {/* Layer 2: Emerging Typography: Himalayan & Trails (z-[10], Behind Mountain) */}
        <motion.div
          style={{
            opacity: contentOpacityOutro,
            y: contentYOutro,
          }}
          className="absolute inset-x-0 top-0 pt-20 pb-6 px-4 z-[10] w-full flex flex-col items-center justify-center text-center max-w-sm mx-auto pointer-events-none"
        >
          <div className="select-none mb-1 flex flex-col items-center w-full">
            {/* Invisible spacer for Discover so vertical position matches Layer 4 */}
            <div className="invisible select-none" aria-hidden="true">
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.55rem",
                  lineHeight: 1.1,
                }}
                className="block font-serif italic"
              >
                Discover
              </span>
            </div>

            {/* Himalayan (Rising from behind central peaks) */}
            <motion.span
              style={{
                opacity: himalayanOpacity,
                y: himalayanY,
                fontFamily: "'Playfair Display', serif",
                fontSize: "2.9rem",
                lineHeight: 1.05,
                color: "#ffffff",
                textShadow: "0 4px 28px rgba(0,0,0,0.95), 0 2px 14px rgba(0,0,0,0.9)",
              }}
              className="block font-serif font-bold tracking-tight my-0.5"
            >
              Himalayan
            </motion.span>

            {/* Trails (Rising from behind right mountain ridge) */}
            <motion.span
              style={{
                opacity: trailsOpacity,
                y: trailsY,
                scale: trailsScale,
                fontFamily: "'Playfair Display', serif",
                fontSize: "3.4rem",
                lineHeight: 1.05,
                color: "#60A5FA",
                textShadow: "0 4px 28px rgba(0,0,0,0.95), 0 0 35px rgba(59, 130, 246, 0.65)",
              }}
              className="block font-serif italic font-extrabold drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
            >
              Trails
            </motion.span>
          </div>
        </motion.div>

        {/* Layer 3: Foreground Mountain Cutout Occlusion (z-[15]) */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            scale: fgScale,
            y: fgY,
            pointerEvents: "none",
          }}
          className="z-[15] pointer-events-none"
        >
          <Image
            src="/brand/hero-mountain-foreground-mobile.webp"
            alt="Foreground Mountain Ridge"
            fill
            sizes="100vw"
            className="hero-wallpaper-img object-cover object-center"
          />
        </motion.div>

        {/* Layer 4: Discover & Basecamp Controls (z-[20], In Sky & On Mountain Surface) */}
        <motion.div
          style={{
            opacity: contentOpacityOutro,
            y: contentYOutro,
          }}
          className="relative z-[20] w-full h-full flex flex-col justify-between max-w-sm mx-auto pointer-events-none"
        >
          {/* Top: Discover alone in open sky */}
          <div className="select-none flex flex-col items-center pt-2">
            <motion.span
              style={{
                opacity: discoverOpacity,
                y: discoverY,
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.55rem",
                lineHeight: 1.1,
                color: "#93C5FD",
                textShadow: "0 3px 20px rgba(0,0,0,0.95), 0 0 30px rgba(59, 130, 246, 0.55)",
              }}
              className="block font-serif italic drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
            >
              Discover
            </motion.span>
          </div>

          {/* Bottom: Basecamp Controls (Tagline + Action Buttons + Territory Micro-Pill Dock + Stats) */}
          <motion.div
            style={{
              opacity: detailsOpacity,
              y: detailsY,
              pointerEvents: detailsPointerEvents,
            }}
            className="w-full flex flex-col items-center text-center max-w-sm mx-auto mb-2 pointer-events-auto"
          >
            {/* Tagline */}
            <p
              className="font-serif italic text-xs sm:text-sm drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] mb-2 font-medium"
              style={{ fontFamily: "'Playfair Display', serif", color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
            >
              Explore the Himalayas
            </p>

            {/* Action Buttons */}
            <div className="w-full space-y-2 mb-2.5">
              <Link
                href="/explore"
                className="w-full py-3 px-5 rounded-full bg-primary hover:bg-primary/90 text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_8px_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>Explore All Expeditions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/map"
                className="w-full py-2.5 px-5 rounded-full bg-slate-900/75 dark:bg-black/50 hover:bg-slate-900/90 text-white font-display font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/30 active:scale-[0.98] shadow-md backdrop-blur-md"
              >
                <Map className="w-4 h-4 text-primary" />
                <span>Launch 3D Atlas</span>
              </Link>
            </div>

            {/* Territory Micro-Pill Dock */}
            <div className="grid grid-cols-2 gap-1.5 w-full max-w-[310px] mb-2.5">
              {Object.entries(TERRITORY_PROFILES).map(([id, t]) => (
                <Link
                  key={id}
                  href={`/explore/${id}`}
                  className="py-1.5 px-2.5 rounded-full text-[10.5px] font-mono font-medium tracking-wide bg-slate-900/75 dark:bg-black/50 backdrop-blur-md transition-all flex items-center justify-center gap-1.5 shadow-sm border border-white/25 text-white active:scale-95 hover:border-white/40"
                  style={{ borderLeft: `3px solid ${t.accent}` }}
                >
                  <span>{t.emoji}</span>
                  <span className="font-semibold whitespace-nowrap">{t.shortLabel}</span>
                </Link>
              ))}
            </div>

            {/* Minimal Metrics Ticker */}
            <div className="flex items-center justify-around py-2 px-3 rounded-2xl border border-white/20 bg-slate-950/80 dark:bg-[#0A1122]/90 backdrop-blur-xl shadow-lg max-w-xs mx-auto w-full text-center">
              <div>
                <span className="font-display font-extrabold text-xs text-blue-400 block">59</span>
                <span className="text-[8.5px] font-mono uppercase tracking-wider text-slate-200">Trails</span>
              </div>
              <span className="w-px h-4 bg-white/20" />
              <div>
                <span className="font-display font-extrabold text-xs text-amber-400 block">4</span>
                <span className="text-[8.5px] font-mono uppercase tracking-wider text-slate-200">Territories</span>
              </div>
              <span className="w-px h-4 bg-white/20" />
              <div>
                <span className="font-display font-extrabold text-xs text-purple-400 block">7,816m</span>
                <span className="text-[8.5px] font-mono uppercase tracking-wider text-slate-200">Ceiling</span>
              </div>
              <span className="w-px h-4 bg-white/20" />
              <div>
                <span className="font-display font-extrabold text-xs text-teal-400 block">100%</span>
                <span className="text-[8.5px] font-mono uppercase tracking-wider text-slate-200">Free</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Layer 5: Feathered Edge Melt at Bottom (z-[25]) */}
        <motion.div
          style={{ opacity: bottomMeltOpacity }}
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-[25] bg-gradient-to-t from-background via-background/75 to-transparent transition-colors duration-500"
        />

        {/* Layer 6: Scroll Indicator Hint (z-30) */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 pointer-events-none select-none"
        >
          <span className="font-mono text-[8.5px] uppercase tracking-[0.25em] text-blue-200/90 font-semibold drop-shadow-md">
            Scroll to Discover
          </span>
          <div className="w-3.5 h-6 rounded-full border border-blue-300/50 flex items-start justify-center p-1 bg-black/20 backdrop-blur-xs">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.9)]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── 1B. Desktop Hero with Cinematic Slanting Scroll Architecture ──────────── */
function DesktopHero() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Track scroll within the 290vh container for leisurely, cinematic storytelling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Silky spring progress for responsive trackpad and wheel interpolation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  // Background parallax
  const bgY = useTransform(smoothProgress, [0, 1], [0, 160]);
  const bgScale = useTransform(smoothProgress, [0.82, 1.0], [1.02, 1.10]);

  // STEP 1: Discover (Left) — visible on landing so screen is never blank in the open sky
  const discoverOpacityRaw = useTransform(smoothProgress, [0, 0.08], [0.95, 1]);
  const discoverYRaw = useTransform(smoothProgress, [0, 0.08], [4, 0]);

  // STEP 2: Himalayan (Center) — emerges gently from below the central mountain ridge
  const himalayanOpacityRaw = useTransform(smoothProgress, [0.05, 0.32], [0, 1]);
  const himalayanYRaw = useTransform(smoothProgress, [0.05, 0.32], [115, 0]);

  // STEP 3: Trails (Right) — cascades up from behind the right mountain ridge
  const trailsOpacityRaw = useTransform(smoothProgress, [0.22, 0.48], [0, 1]);
  const trailsYRaw = useTransform(smoothProgress, [0.22, 0.48], [130, 0]);
  const trailsScaleRaw = useTransform(smoothProgress, [0.22, 0.48], [0.92, 1]);

  // STEP 4: Details (Subtitle + Buttons + Pills + Stats) — emerges from 0.48 to 0.72
  const detailsOpacityRaw = useTransform(smoothProgress, [0.48, 0.72], [0, 1]);
  const detailsYRaw = useTransform(smoothProgress, [0.48, 0.72], [20, 0]);
  const detailsPointerEvents = useTransform(smoothProgress, (p) => (p > 0.50 ? "auto" : "none"));

  // Scroll Indicator Hint — visible at 0, fades away as scroll starts
  const scrollHintOpacity = useTransform(smoothProgress, [0, 0.06], [1, 0]);

  // Outro transition — gentle start to fading, never fades away completely ("little by little start fading only")
  const contentOpacityOutro = useTransform(smoothProgress, [0.88, 1.0], [1, 0.65]);
  const contentYOutro = useTransform(smoothProgress, [0.88, 1.0], [0, -14]);

  // Bottom Edge Melt — Zero fade at starting state (scroll 0); smoothly feathers in as hero ends
  const bottomMeltOpacity = useTransform(smoothProgress, [0.75, 0.98], [0, 0.95]);

  // Accessibility override for users requesting reduced motion
  const discoverOpacity = shouldReduceMotion ? 1 : discoverOpacityRaw;
  const discoverY = shouldReduceMotion ? 0 : discoverYRaw;
  const himalayanOpacity = shouldReduceMotion ? 1 : himalayanOpacityRaw;
  const himalayanY = shouldReduceMotion ? 0 : himalayanYRaw;
  const trailsOpacity = shouldReduceMotion ? 1 : trailsOpacityRaw;
  const trailsY = shouldReduceMotion ? 0 : trailsYRaw;
  const trailsScale = shouldReduceMotion ? 1 : trailsScaleRaw;
  const detailsOpacity = shouldReduceMotion ? 1 : detailsOpacityRaw;
  const detailsY = shouldReduceMotion ? 0 : detailsYRaw;

  // Mouse Parallax for interactivity
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 45, damping: 20 });
  const inverseMouseX = useTransform(smoothMouseX, (v) => -v * 0.45);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX } = e;
      const x = (clientX / window.innerWidth - 0.5) * 44;
      mouseX.set(x);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  return (
    <section
      id="home"
      ref={containerRef}
      suppressHydrationWarning
      className="-mt-20 relative w-full hidden md:block"
      style={{
        height: "clamp(260vh, 290vh, 320vh)",
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-24 pb-16 px-6">
        {/* ── Layer 1: Background Mountain Wallpaper (z-0) ── */}
        <motion.div
          style={{
            position: "absolute",
            inset: "-10% 0 -10% 0",
            scale: bgScale,
            y: bgY,
            x: inverseMouseX,
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
            className="hero-wallpaper-img object-cover object-center opacity-100 transition-transform duration-700 ease-out"
          />
        </motion.div>

        {/* Cinematic Atmospheric Vignette — Lightened in dark mode */}
        <div className="absolute inset-0 z-[1] pointer-events-none transition-colors duration-500 bg-gradient-to-b from-black/45 via-black/15 to-black/50 dark:from-[#040812]/45 dark:via-transparent dark:to-[#040812]/55" />

        {/* Soft Contrast Backplate & Radial Aura Behind Headline */}
        <div className="absolute z-[2] inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[900px] h-[480px] rounded-full bg-black/25 dark:bg-black/25 blur-[100px]" />
          <div className="absolute w-[700px] h-[320px] rounded-full bg-blue-600/15 blur-[135px]" />
        </div>

        {/* ── Layer 2: Emerging Typography (Himalayan & Trails, z-[10], Behind Mountain) ── */}
        <motion.div
          style={{
            opacity: contentOpacityOutro,
            y: contentYOutro,
          }}
          className="absolute inset-0 z-[10] flex flex-col items-center justify-center pt-24 pb-16 px-6 pointer-events-none"
        >
          <div className="flex flex-col items-center max-w-[1150px] w-full mx-auto my-auto">
            <div className="w-full flex flex-col select-none mb-2">
              {/* Invisible spacer matching Discover's exact dimensions & alignment */}
              <div className="w-full flex justify-start pl-4 sm:pl-8 md:pl-12 lg:pl-16 invisible select-none" aria-hidden="true">
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2rem, 4.8vw, 3.8rem)",
                    fontWeight: 600,
                    fontStyle: "italic",
                    lineHeight: 1.1,
                    letterSpacing: "0.03em",
                  }}
                >
                  Discover
                </span>
              </div>

              {/* Step 2: HIMALAYAN in the CENTER (emerges up from behind central mountain peak) */}
              <motion.div
                style={{
                  opacity: himalayanOpacity,
                  y: himalayanY,
                }}
                className="w-full flex justify-center -my-1 sm:-my-2"
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(3.4rem, 8.5vw, 7.2rem)",
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    textShadow:
                      "0 4px 34px rgba(0,0,0,0.95), 0 2px 14px rgba(0,0,0,0.9)",
                  }}
                >
                  Himalayan
                </span>
              </motion.div>

              {/* Step 3: TRAILS on the RIGHT (emerges up from behind right mountain ridge) */}
              <motion.div
                style={{
                  opacity: trailsOpacity,
                  y: trailsY,
                  scale: trailsScale,
                }}
                className="w-full flex justify-end pr-4 sm:pr-8 md:pr-12 lg:pr-16 mb-2"
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(3.8rem, 9.8vw, 8.4rem)",
                    fontWeight: 800,
                    fontStyle: "italic",
                    color: "#60A5FA",
                    lineHeight: 1.05,
                    letterSpacing: "-0.01em",
                    textShadow:
                      "0 4px 34px rgba(0,0,0,0.95), 0 0 45px rgba(59, 130, 246, 0.65)",
                  }}
                >
                  Trails
                </span>
              </motion.div>
            </div>

            {/* Invisible spacer for Details so height is identical */}
            <div className="w-full max-w-[840px] mx-auto mt-6 sm:mt-8 md:mt-10 invisible select-none h-44" aria-hidden="true" />
          </div>
        </motion.div>

        {/* ── Layer 3: Foreground Mountain Occlusion Layer (z-[15]) ── */}
        <motion.div
          style={{
            position: "absolute",
            inset: "-10% 0 -10% 0",
            scale: bgScale,
            y: bgY,
            x: inverseMouseX,
            transformOrigin: "center 45%",
            pointerEvents: "none",
          }}
          className="z-[15] pointer-events-none"
        >
          <Image
            src="/brand/hero-mountain-foreground-desktop.webp"
            alt="Foreground Mountain Ridge"
            fill
            priority
            sizes="100vw"
            className="hero-wallpaper-img object-cover object-center opacity-100 transition-transform duration-700 ease-out"
          />
        </motion.div>

        {/* ── Layer 4: Sky Elements & Basecamp Controls (z-[20], In Front of Mountain) ── */}
        <motion.div
          style={{
            opacity: contentOpacityOutro,
            y: contentYOutro,
          }}
          className="relative z-[20] flex flex-col items-center max-w-[1150px] w-full mx-auto my-auto pointer-events-none"
        >
          {/* Accessible Semantic Header */}
          <h1 className="sr-only">Discover Himalayan Trails — Explore the Himalayas</h1>

          <div className="w-full flex flex-col select-none mb-2 pointer-events-auto">
            {/* Step 1: DISCOVER on the LEFT (Visible in open sky from landing) */}
            <div className="w-full flex justify-start pl-4 sm:pl-8 md:pl-12 lg:pl-16">
              <motion.span
                style={{
                  opacity: discoverOpacity,
                  y: discoverY,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 4.8vw, 3.8rem)",
                  fontWeight: 600,
                  fontStyle: "italic",
                  color: "#93C5FD",
                  lineHeight: 1.1,
                  letterSpacing: "0.03em",
                  textShadow:
                    "0 4px 28px rgba(0,0,0,0.95), 0 0 35px rgba(59, 130, 246, 0.55)",
                }}
                className="block"
              >
                Discover
              </motion.span>
            </div>

            {/* Invisible placeholders for Himalayan and Trails to preserve vertical flow */}
            <div className="w-full flex justify-center -my-1 sm:-my-2 invisible select-none" aria-hidden="true">
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(3.4rem, 8.5vw, 7.2rem)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                Himalayan
              </span>
            </div>
            <div className="w-full flex justify-end pr-4 sm:pr-8 md:pr-12 lg:pr-16 mb-2 invisible select-none" aria-hidden="true">
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(3.8rem, 9.8vw, 8.4rem)",
                  fontWeight: 800,
                  fontStyle: "italic",
                  lineHeight: 1.05,
                  letterSpacing: "-0.01em",
                }}
              >
                Trails
              </span>
            </div>
          </div>

          {/* Step 4: Basecamp Controls & Details (Clickable, on top of mountain base) */}
          <motion.div
            style={{
              opacity: detailsOpacity,
              y: detailsY,
              pointerEvents: detailsPointerEvents,
            }}
            className="flex flex-col items-center text-center w-full max-w-[840px] mx-auto mt-6 sm:mt-8 md:mt-10 pointer-events-auto"
          >
            {/* Tagline */}
            <p
              className="font-serif italic text-base sm:text-lg md:text-xl text-white/95 drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)] mb-4 font-medium tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Explore the Himalayas
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-row items-center justify-center gap-3 w-auto mb-4">
              <Link
                href="/explore"
                className="px-7 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_8px_30px_rgba(37,99,235,0.45)] hover:shadow-[0_12px_36px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore All Expeditions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/map"
                className="px-7 py-3.5 rounded-full glass-capsule hover:bg-white/10 text-white font-display font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 active:scale-[0.98]"
              >
                <Map className="w-4 h-4 text-primary" />
                <span>Launch 3D Atlas</span>
              </Link>
            </div>

            {/* Territory Micro-Pill Quick Dock */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {Object.entries(TERRITORY_PROFILES).map(([id, t]) => (
                <motion.div key={id} whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href={`/explore/${id}`}
                    className="px-4 py-2 rounded-full text-xs font-mono font-medium tracking-wide glass-capsule transition-all flex items-center gap-2 shadow-sm border border-white/15 text-white/90 hover:text-white"
                    style={{ borderLeft: `3px solid ${t.accent}` }}
                  >
                    <span>{t.emoji}</span>
                    <span className="font-semibold">{t.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Sleek Minimal Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 px-7 py-2.5 rounded-full glass-capsule border border-white/15 bg-white/[0.05] dark:bg-[#0A1122]/60 backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-2.5">
                <span className="font-display font-extrabold text-base text-blue-400">59</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-200 font-semibold">
                  Mapped Trails
                </span>
              </div>
              <span className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2.5">
                <span className="font-display font-extrabold text-base text-amber-400">4</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-200 font-semibold">
                  Territories
                </span>
              </div>
              <span className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2.5">
                <span className="font-display font-extrabold text-base text-purple-400">7,816m</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-200 font-semibold">
                  Highest Peak
                </span>
              </div>
              <span className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2.5">
                <span className="font-display font-extrabold text-base text-teal-400">100%</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-200 font-semibold">
                  Free Access
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Generous Edge Melt — Scroll-driven: zero fade at start, feathers smoothly as user scrolls towards bottom */}
        <motion.div
          style={{ opacity: bottomMeltOpacity }}
          className="absolute inset-x-0 bottom-0 h-44 sm:h-64 pointer-events-none z-[25] bg-gradient-to-t from-background via-background/70 to-transparent transition-colors duration-500"
        />

        {/* Scroll Down Hint (Fades out when scroll starts) */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none select-none"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-blue-200/80 font-semibold">
            Scroll to Discover
          </span>
          <div className="w-4 h-7 rounded-full border border-blue-300/40 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
            />
          </div>
        </motion.div>
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
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.45, delay: idx * 0.07, ease: EASE }}
                >
                  <Link
                    href={`/explore/${region.id}`}
                    className="dark-photo-card group relative rounded-2xl overflow-hidden block border border-slate-200/80 dark:border-white/10 active:scale-[0.98] transition-transform duration-300 shadow-md h-[135px] sm:h-[150px]"
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

          {/* Desktop 2-Column Asymmetric Staggered Canopy Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-x-20 lg:gap-x-28 gap-y-4 md:gap-y-10 items-start">
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
                        className="dark-photo-card group relative rounded-2xl sm:rounded-3xl overflow-hidden block border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl h-[185px] sm:h-[230px]"
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
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border shadow-sm truncate max-w-[170px] sm:max-w-none"
                              style={{
                                backgroundColor: `${profile.accent}25`,
                                color: "#ffffff",
                                borderColor: `${profile.accent}60`,
                              }}
                            >
                              {profile.ranges}
                            </span>
                            <span className="text-[10px] font-mono text-white/90 font-semibold shrink-0">
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
            <div className="space-y-4 md:space-y-16 mt-0 md:mt-16">
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
                        className="dark-photo-card group relative rounded-2xl sm:rounded-3xl overflow-hidden block border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl h-[185px] sm:h-[230px]"
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
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border shadow-sm truncate max-w-[170px] sm:max-w-none"
                              style={{
                                backgroundColor: `${profile.accent}25`,
                                color: "#ffffff",
                                borderColor: `${profile.accent}60`,
                              }}
                            >
                              {profile.ranges}
                            </span>
                            <span className="text-[10px] font-mono text-white/90 font-semibold shrink-0">
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

/* ── 2b. Mountaineering Trust & Independent Intelligence Ribbon ─────────── */
function PlatformTrustRibbon() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "Zero Commercial Bias",
      desc: "Independent trail data with zero paid tour placements or sponsored agency rankings.",
    },
    {
      icon: MapPin,
      title: "100% Geospatially Mapped",
      desc: "Every waypoint, camp, and high pass verified against satellite DEM 3D topography.",
    },
    {
      icon: HeartPulse,
      title: "Clinical Altitude Protocols",
      desc: "Rigorous AMS, HAPE, and descent thresholds reviewed against clinical guidelines.",
    },
    {
      icon: Sparkles,
      title: "Offline PWA & Print Ready",
      desc: "Client-side bookmarking, exportable packing checklists, and offline paper trail sheets.",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-10 pb-6 no-print">
      <div className="rounded-3xl p-6 sm:p-8 bg-foreground/[0.02] dark:bg-white/[0.02] border border-foreground/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary mt-0.5">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-foreground mb-1">
                {title}
              </h3>
              <p className="text-xs text-foreground/80 font-light leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
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
                  className={`relative shrink-0 w-[72vw] max-w-[260px] snap-center md:w-auto md:max-w-none md:shrink transition-all duration-500 ${
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
                        href={placeLocationIndex.get(trek.slug)?.href || `/explore/himachal-pradesh/kullu/${trek.slug}`}
                        className="group rounded-2xl overflow-hidden bg-card/90 dark:bg-[#090e1a]/95 backdrop-blur-xl flex flex-col justify-between block border border-border/70 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/10"
                      >
                        <div className="relative h-20 sm:h-24 md:h-26 w-full overflow-hidden shrink-0">
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
                            className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[8px] sm:text-[8.5px] font-mono text-white/90 font-bold uppercase tracking-wider shadow-sm"
                            style={{ transform: "translateZ(15px)" }}
                          >
                            {trek.region}
                          </div>

                          <div
                            className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] sm:text-[8.5px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm ${
                              trek.difficulty.toLowerCase().includes("easy")
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            }`}
                            style={{ transform: "translateZ(15px)" }}
                          >
                            {trek.difficulty}
                          </div>
                        </div>

                        <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between" style={{ transform: "translateZ(18px)" }}>
                          <div>
                            <h3 className="font-display font-bold text-xs sm:text-[14px] text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1 mb-0.5 sm:mb-1">
                              {trek.title}
                            </h3>
                            <p className="text-muted-foreground text-[10px] sm:text-[10.5px] font-light line-clamp-1 sm:line-clamp-2 mb-1.5 sm:mb-2.5 leading-relaxed">
                              {trek.overview}
                            </p>
                          </div>

                          <div className="pt-1.5 sm:pt-2 border-t border-border/60 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-muted-foreground">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary/70" />
                              <span className="font-semibold text-foreground/80">{trek.duration}</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <Mountain className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400/80" />
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
          className="p-5 sm:p-10 md:p-14 rounded-3xl border border-slate-200/80 dark:border-white/10 relative overflow-hidden shadow-2xl bg-gradient-to-b from-slate-50/90 via-white to-slate-50/80 dark:from-[#09101F]/90 dark:via-[#070D1A] dark:to-[#050A14] backdrop-blur-xl"
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
      <PlatformTrustRibbon />
      <PlanningSuiteSection />
      <SafetyFeatureSection />
      <FaqSection />
      <DispatchNewsletterSection />
    </div>
  );
}

