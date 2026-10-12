"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Map, MapPin, Bookmark, Check, Share2 } from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

interface PlaceHeroProps {
  title: string;
  regionName: string;
  subRegionName: string;
  stateSlug: string;
  divisionSlug: string;
  placeType: string;
  elevation?: string;
  heroImage?: string;
  description?: string;
  placeId: string;
  breadcrumbItems: { label: string; href: string }[];
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string; text: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.35)", text: "text-blue-400" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.35)", text: "text-amber-400" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.35)", text: "text-purple-400" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.35)", text: "text-teal-400" },
};

const CATEGORY_LABELS: Record<string, string> = {
  scenic: "Scenic Valley & Viewpoint",
  spiritual: "Sacred Heritage & Shrine",
  lake: "High-Altitude Glacial Lake",
  road: "Mountain Pass & Highway",
  adventure: "Alpine Activity Center",
};

export function PlaceHero({
  title,
  regionName,
  subRegionName,
  stateSlug,
  placeType,
  elevation,
  heroImage,
  description,
  placeId,
  breadcrumbItems,
}: PlaceHeroProps) {
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

  const categoryLabel = CATEGORY_LABELS[placeType] || "Himalayan Destination";

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${title} — Discover Himalayan Trails`,
          text: description || `Explore ${title} in ${subRegionName}, ${regionName}.`,
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
      className="relative min-h-[88vh] lg:min-h-[92vh] w-full flex flex-col justify-between overflow-hidden bg-[#07090E] dark-photo-card preserve-white-text"
      aria-label={`${title} Destination Hero`}
    >
      {/* Background: Authentic Photography (if provided) OR Atmospheric Field Atlas Midnight Canvas */}
      {heroImage ? (
        <motion.div
          className="absolute inset-0 w-full h-full z-0 pointer-events-none will-change-transform"
          style={{ scale: imageScale, y: imageY }}
        >
          <Image
            src={heroImage}
            alt={`${title} (${elevation ? `${elevation}, ` : ""}${subRegionName}, ${regionName}) — panoramic Himalayan vista and trail gateway`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center hero-wallpaper-img brightness-95"
          />
          {/* Layered Nocturnal / Atmospheric Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/45 to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#07090E]/80 z-[1]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(7,9,14,0.65)_100%)] z-[1]" />
          {/* Feathered bottom horizon melt */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent dark:from-[#07090E] dark:via-[#07090E]/80 dark:to-transparent z-[2]" />
        </motion.div>
      ) : (
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#07090E] pointer-events-none">
          {/* Radial Territory Glow */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120vw] sm:w-[900px] h-[550px] rounded-full blur-[140px] opacity-30"
            style={{ background: style.glow || style.accent }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.15),transparent)]" />

          {/* Topographic Cartography Elevation Canvas */}
          <div className="absolute inset-0 opacity-[0.14] pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 600">
              <defs>
                <pattern id="survey-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                  <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.4)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#survey-grid)" />
              {/* Authentic Topographic Iso-Elevation Contours */}
              <path d="M 0 450 Q 250 380 500 420 T 1000 360" fill="none" stroke={style.accent} strokeWidth="1.5" strokeOpacity="0.4" />
              <path d="M 0 400 Q 280 320 540 370 T 1000 290" fill="none" stroke={style.accent} strokeWidth="1.2" strokeOpacity="0.35" />
              <path d="M 0 350 Q 300 260 580 310 T 1000 220" fill="none" stroke={style.accent} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="6 4" />
              <path d="M 0 300 Q 320 190 620 250 T 1000 150" fill="none" stroke={style.accent} strokeWidth="1" strokeOpacity="0.25" />
              <path d="M 0 250 Q 350 120 660 190 T 1000 80" fill="none" stroke={style.accent} strokeWidth="0.75" strokeOpacity="0.2" />
            </svg>
          </div>

          {/* Coordinate Crosshair Reticle Datum */}
          <div className="absolute top-1/3 right-12 hidden lg:flex flex-col items-end font-mono text-[9px] uppercase tracking-widest text-white/30 pointer-events-none">
            <span className="flex items-center gap-1.5 text-primary/70 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              TOPOGRAPHIC FIELD DATUM
            </span>
            <span>HIMALAYAN GEOSPATIAL ATLAS</span>
          </div>

          {/* Feathered bottom horizon melt */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent dark:from-[#07090E] dark:via-[#07090E]/80 dark:to-transparent" />
        </div>
      )}

      {/* Top Bar: Breadcrumbs & Actions */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl pt-24 sm:pt-28 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="backdrop-blur-md bg-black/40 px-4 py-1.5 rounded-full border border-white/15 inline-flex shadow-lg">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setSaved(!saved)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white/90 text-xs font-mono transition-all backdrop-blur-md min-h-[36px]"
            title={saved ? "Saved to your expeditions" : "Save destination"}
            aria-label="Save destination"
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current text-amber-400" : ""}`} />
            <span>{saved ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white/90 text-xs font-mono transition-all backdrop-blur-md min-h-[36px]"
            aria-label="Share this place"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <motion.div
        className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl py-12 sm:py-16"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Category & Location Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4 sm:mb-6">
          <span
            className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full backdrop-blur-md border shadow-lg"
            style={{
              backgroundColor: `${style.accent}25`,
              color: style.accent,
              borderColor: `${style.accent}50`,
            }}
          >
            {categoryLabel}
          </span>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-xl">
            <MapPin className="w-3.5 h-3.5" style={{ color: style.accent }} />
            <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/90">
              {regionName} <span className="opacity-40">•</span> {subRegionName}
            </span>
          </div>

          {elevation && (
            <span className="font-mono text-[11px] sm:text-xs text-white/90 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
              {elevation}
            </span>
          )}
        </div>

        {/* Commanding Editorial Title */}
        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold tracking-tight text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.0] drop-shadow-[0_4px_32px_rgba(0,0,0,0.8)] mb-4"
        >
          {title}
        </motion.h1>

        {/* Editorial Subtitle / Geographical Character */}
        {description && (
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/85 font-light text-base sm:text-lg md:text-xl max-w-3xl mb-8 leading-relaxed drop-shadow-md"
          >
            {description}
          </motion.p>
        )}

        {/* Primary Interactive Action Strip */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-3 sm:gap-4"
        >
          <Link
            href={`/map?focus=${placeId}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-xl hover:scale-105 min-h-[44px]"
            style={{
              backgroundColor: style.accent,
              color: stateSlug === "himachal-pradesh" ? "#000000" : "#FFFFFF",
            }}
          >
            <Map className="w-4 h-4" />
            <span>Explore on 3D Map</span>
          </Link>

          <a
            href="#overview"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs uppercase tracking-widest font-semibold border border-white/20 text-white hover:bg-white/10 transition-all bg-black/40 backdrop-blur-md min-h-[44px]"
          >
            <span>Field Guide Overview</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom Subtle Indicator */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl pb-6 flex justify-between items-end text-xs font-mono text-white/50">
        <span className="tracking-widest uppercase text-[10px]">
          Himalayan Field Atlas &bull; Destination Dossier
        </span>
        <span className="hidden sm:inline-block text-[10px] text-white/40">
          Scroll to explore field notes &amp; access
        </span>
      </div>
    </section>
  );
}
