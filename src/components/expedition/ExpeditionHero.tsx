"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass, Map, Bookmark, Share2, Check, Mountain } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Peak } from "@/data/types";
import { HimalayaPlace } from "@/data/atlas";

interface ExpeditionHeroProps {
  place: HimalayaPlace;
  peak: Peak;
  regionName: string;
  subRegionName: string;
  stateSlug: string;
  breadcrumbItems: { label: string; href: string }[];
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string; text: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.35)", text: "text-blue-400" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.35)", text: "text-amber-400" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.35)", text: "text-purple-400" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.35)", text: "text-teal-400" },
};

export function ExpeditionHero({
  place,
  peak,
  regionName,
  subRegionName,
  stateSlug,
  breadcrumbItems,
}: ExpeditionHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1.02, 1.15]);
  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.65], shouldReduceMotion ? ["0%", "0%"] : ["0%", "10%"]);

  const style = TERRITORY_ACCENTS[stateSlug] ?? {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.35)",
    text: "text-blue-400",
  };

  const heroImage =
    peak.heroImage ||
    place.heroImage ||
    place.image ||
    (place.images && place.images.length > 0 ? place.images[0] : undefined);

  const heightMeters = peak.height;
  const heightFeet = Math.round(peak.height * 3.28084);
  const coords = peak.coords || place.coords;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${peak.title} (${heightMeters}m) — Himalayan Peak Expedition Profile`,
          text: peak.description || `${peak.title} climbing route, summit elevation, and technical profile in ${regionName}.`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] lg:min-h-[94vh] w-full flex flex-col justify-between overflow-hidden bg-[#040812] dark-photo-card preserve-white-text"
      aria-label={`${peak.title} Peak Expedition Hero`}
    >
      {/* Background: Authentic Mountaineering Photography (if provided) OR High-Altitude Alpine Midnight Canvas */}
      {heroImage ? (
        <motion.div
          className="absolute inset-0 w-full h-full z-0 pointer-events-none will-change-transform"
          style={{ scale: imageScale, y: imageY }}
        >
          <Image
            src={heroImage}
            alt={`${peak.title} mountain massif in ${regionName}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center hero-wallpaper-img brightness-90 saturate-110"
          />
          {/* Layered Technical Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040812] via-[#040812]/55 to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[#040812]/90 z-[1]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(4,8,18,0.75)_100%)] z-[1]" />
        </motion.div>
      ) : (
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#040812] pointer-events-none">
          {/* High-Altitude Territory Ambient Aurora */}
          <div
            className="absolute -top-36 left-1/2 -translate-x-1/2 w-[120vw] sm:w-[960px] h-[580px] rounded-full blur-[150px] opacity-25"
            style={{ background: style.glow || style.accent }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.18),transparent)]" />

          {/* High-Altitude Topographic Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_60%,transparent_100%)]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="exp-topo-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white" />
                  <circle cx="30" cy="30" r="1.5" fill="currentColor" className="text-white/40" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#exp-topo-grid)" />
            </svg>
          </div>

          {/* Glacial Pyramid Massif Contours */}
          <div className="absolute inset-x-0 bottom-0 h-96 opacity-25">
            <svg viewBox="0 0 1440 320" fill="none" preserveAspectRatio="none" className="w-full h-full">
              <path
                d="M0,288L60,266.7C120,245,240,203,360,197.3C480,192,600,224,720,202.7C840,181,960,107,1080,101.3C1200,96,1320,160,1380,192L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                fill="url(#expMountainGrad)"
              />
              <defs>
                <linearGradient id="expMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={style.accent} stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#040812" stopOpacity="0.95" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Feathered bottom horizon melt */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#040812] via-[#040812]/80 to-transparent" />
        </div>
      )}

      {/* Top Bar: Breadcrumbs & Telemetry Actions */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl pt-24 sm:pt-28 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="backdrop-blur-md bg-black/50 px-4 py-1.5 rounded-full border border-white/15 inline-flex shadow-xl">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setSaved(!saved)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white/90 text-xs font-mono transition-all backdrop-blur-md min-h-[36px]"
            title={saved ? "Saved to your expeditions" : "Save expedition dossier"}
            aria-label="Save expedition"
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current text-amber-400" : ""}`} />
            <span>{saved ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white/90 text-xs font-mono transition-all backdrop-blur-md min-h-[36px]"
            aria-label="Share expedition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Hero Body: Mountain Identity & Alpine Telemetry */}
      <motion.div
        className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl py-12 sm:py-16"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="max-w-4xl space-y-6">
          {/* Classification & Telemetry Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] bg-black/60 backdrop-blur-md border border-white/20"
              style={{ color: style.accent }}
            >
              <Mountain className="w-3.5 h-3.5" />
              Expedition / Mountain
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/10 backdrop-blur-md border border-white/15 text-white">
              Grade: {peak.difficulty.toUpperCase()}
            </span>

            <span className="text-xs font-mono text-slate-300 hidden sm:inline-block">
              {peak.region || subRegionName} Massif
            </span>

            {coords && coords[0] !== 0 && (
              <span className="text-xs font-mono text-slate-400 hidden md:inline-block">
                {coords[0].toFixed(4)}°N, {coords[1].toFixed(4)}°E
              </span>
            )}
          </div>

          {/* Summit Elevation Callout & Mountain Title */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3 text-sky-300 font-mono text-sm sm:text-base font-semibold">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
                {heightMeters.toLocaleString("en-IN")}m
              </span>
              <span className="text-slate-400 font-normal">
                / {heightFeet.toLocaleString("en-IN")} ft
              </span>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-mono px-2 py-0.5 rounded bg-white/10">
                Summit Altitude
              </span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05] drop-shadow-2xl">
              {peak.title}
            </h1>
          </div>

          {/* Restrained Expedition Overview */}
          <p className="text-slate-200 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-3xl drop-shadow-md">
            {peak.description || `${peak.title} rises to ${heightMeters}m in the ${peak.region || regionName}, representing a high-caliber mountaineering objective defined by technical glacier approaches and exposed ridge climbing.`}
          </p>

          {/* Technical Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                Base Camp
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white truncate block">
                {peak.baseCamp || "Glacier Camp"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                Climbing Window
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white truncate block">
                {peak.expeditionSeason || "May–Jun, Sep–Oct"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                Permit Authority
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white truncate block">
                IMF New Delhi
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                Technical Grade
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white truncate block">
                {peak.difficulty} Alpine
              </span>
            </div>
          </div>

          {/* Primary Action Button: 3D Mountain Mesh */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href={`/map?focus=${place.id}`}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl min-h-[44px] group"
            >
              <Map className="w-4 h-4 text-slate-950" />
              <span>Inspect 3D Mountain Mesh</span>
            </Link>

            <a
              href="#route-schematic"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-black/60 hover:bg-black/80 text-white border border-white/20 font-mono text-xs font-semibold uppercase tracking-wider transition-all backdrop-blur-md min-h-[44px]"
            >
              <span>Route Schematic</span>
              <Compass className="w-3.5 h-3.5 text-slate-300" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
