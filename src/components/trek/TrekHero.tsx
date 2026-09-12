"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronDown, MapPin, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

interface TrekHeroProps {
  title: string;
  regionName: string;
  subRegionName: string;
  stateSlug: string;
  divisionSlug: string;
  elevation?: string;
  distance?: string;
  duration?: string;
  difficulty?: string;
  heroImage?: string;
  subtitle?: string;
  isPatalsu?: boolean;
  breadcrumbItems: { label: string; href: string }[];
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string; text: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.35)", text: "text-blue-400" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.35)", text: "text-amber-400" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.35)", text: "text-purple-400" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.35)", text: "text-teal-400" },
};

export function TrekHero({
  title,
  regionName,
  subRegionName,
  stateSlug,
  divisionSlug,
  elevation,
  distance,
  duration,
  difficulty,
  heroImage,
  subtitle,
  isPatalsu,
  breadcrumbItems,
}: TrekHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

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

  // Strip "Trek" for the dominant headline, but keep it in the semantic badge
  const displayTitle = title.replace(/\s+Trek$/i, "").trim();

  const fallbackSubtitle = isPatalsu
    ? "The Premier 4,000m Beginner-Friendly Trekking Peak in Manali • Non-Technical Summit • 1-Day Speed Hike Route"
    : `${difficulty || "Classic"} Alpine Trail in ${subRegionName} • Summit ${elevation || ""} • ${duration || ""}`;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[94vh] lg:min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#040812] dark-photo-card preserve-white-text"
      aria-label={`${title} Hero`}
    >
      {/* Background: Authentic Photography (if provided) OR Atmospheric Alpine Midnight Canvas */}
      {heroImage ? (
        <motion.div
          className="absolute inset-0 w-full h-full z-0 pointer-events-none will-change-transform"
          style={{ scale: imageScale, y: imageY }}
        >
          <Image
            src={heroImage}
            alt={`Panoramic vista on the ${title}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Cinematic Vignettes */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(4,8,18,0.25)_0%,rgba(4,8,18,0.75)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent dark:from-[#040812] dark:via-[#040812]/80 dark:to-transparent" />
        </motion.div>
      ) : (
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#040812] pointer-events-none">
          {/* Territory Ambient Glow */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120vw] sm:w-[900px] h-[550px] rounded-full blur-[140px] opacity-30"
            style={{ background: style.glow || style.accent }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.15),transparent)]" />
          
          {/* Topographic Contour Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.06] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_60%,transparent_100%)]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="trek-topo-grid" width="56" height="56" patternUnits="userSpaceOnUse">
                  <path d="M 56 0 L 0 0 0 56" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-white" />
                  <circle cx="28" cy="28" r="1.5" fill="currentColor" className="text-white/40" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#trek-topo-grid)" />
            </svg>
          </div>

          {/* Himalayan Ridge Contours */}
          <div className="absolute inset-x-0 bottom-0 h-80 opacity-25">
            <svg viewBox="0 0 1440 320" fill="none" preserveAspectRatio="none" className="w-full h-full">
              <path
                d="M0,288L60,266.7C120,245,240,203,360,197.3C480,192,600,224,720,202.7C840,181,960,107,1080,101.3C1200,96,1320,160,1380,192L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                fill="url(#trekMountainGrad)"
              />
              <defs>
                <linearGradient id="trekMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={style.accent} stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#040812" stopOpacity="0.95" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Feathered bottom horizon melt */}
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent dark:from-[#040812] dark:via-[#040812]/80 dark:to-transparent" />
        </div>
      )}

      {/* Top Bar: Minimalist Breadcrumb & Back Link */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 sm:pt-28 max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Breadcrumbs items={breadcrumbItems} />
          
          <Link
            href={`/explore/${stateSlug}/${divisionSlug}`}
            className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-widest text-white/80 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {subRegionName}</span>
          </Link>
        </div>
      </div>

      {/* Center / Lower: Dominant Editorial Typography */}
      <motion.div
        className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl pb-12 sm:pb-16 my-auto"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Territory & Valley Marker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 mb-4 sm:mb-6 shadow-xl">
          <MapPin className="w-3.5 h-3.5" style={{ color: style.accent }} />
          <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/90">
            {regionName} <span className="opacity-40">•</span> {subRegionName}
          </span>
        </div>

        {/* Commanding Editorial Title */}
        <motion.h1 
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold tracking-tight text-white text-4xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95] drop-shadow-[0_4px_32px_rgba(0,0,0,0.8)] mb-3 sm:mb-4"
        >
          {displayTitle}
        </motion.h1>

        {/* Authoritative Semantic Subtitle */}
        <motion.p 
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/85 font-light text-base sm:text-xl md:text-2xl max-w-2xl mb-6 leading-snug drop-shadow-md"
        >
          {subtitle || fallbackSubtitle}
        </motion.p>

        {/* Editorial Trail Badge & Quick Metadata Strip */}
        <motion.div 
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/90"
        >
          <span 
            className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full backdrop-blur-md border shadow-lg"
            style={{ 
              backgroundColor: `${style.accent}25`,
              color: style.accent,
              borderColor: `${style.accent}50`,
            }}
          >
            Trek &bull; Alpine Trail
          </span>

          {/* Inline Telemetry Pills */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap font-mono text-xs sm:text-sm font-medium text-white/80">
            {elevation && (
              <span className="px-3 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/30 transition-colors">
                <strong className="text-white font-bold">{elevation}</strong> Summit
              </span>
            )}
            {distance && (
              <span className="px-3 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/30 transition-colors">
                <strong className="text-white font-bold">{distance.split(" ")[0]}</strong> km
              </span>
            )}
            {duration && (
              <span className="px-3 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/30 transition-colors">
                <strong className="text-white font-bold">{isPatalsu ? "2–3 Days" : duration}</strong> {isPatalsu ? "(or 1-Day Push)" : ""}
              </span>
            )}
            {difficulty && (
              <span 
                className="px-3 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 font-bold uppercase tracking-wider"
                style={{ color: style.accent }}
              >
                {difficulty}
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl pb-8 flex justify-between items-end text-xs font-mono text-white/50">
        <div className="hidden sm:block tracking-widest uppercase text-[10px]">
          Alpine Field Guide &bull; Authentic Story
        </div>

        <a
          href="#overview"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group cursor-pointer"
          aria-label="Scroll down to trek overview"
        >
          <span className="text-[11px] uppercase tracking-widest font-semibold">Explore the Trail</span>
          <ChevronDown className="w-4 h-4 animate-bounce group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}
