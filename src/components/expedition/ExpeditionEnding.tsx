"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Map, ArrowRight, Shield } from "lucide-react";
import { Peak } from "@/data/types";
import { HimalayaPlace, HimalayaRegion, HimalayaSubRegion } from "@/data/atlas";

interface ExpeditionEndingProps {
  place: HimalayaPlace;
  peak: Peak;
  region: HimalayaRegion;
  subRegion: HimalayaSubRegion;
  stateSlug: string;
  divisionSlug: string;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.3)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.3)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.3)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.3)" },
};

export function ExpeditionEnding({
  place,
  peak,
  region,
  subRegion,
  stateSlug,
  divisionSlug,
}: ExpeditionEndingProps) {
  const style = TERRITORY_ACCENTS[stateSlug] ?? {
    accent: "#3B82F6",
    glow: "rgba(59,130,246,0.3)",
  };

  const endingImage = (peak.images && peak.images.length > 1 ? peak.images[1] : peak.heroImage) || place.heroImage;

  return (
    <section className="mt-16 sm:mt-24 space-y-8" aria-label="Closing Mountain Exploration">
      {/* Cinematic Alpine Summit Plate */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 dark:border-white/10 group dark-photo-card preserve-white-text">
        {endingImage ? (
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full min-h-[360px] sm:min-h-[420px]">
            <Image
              src={endingImage}
              alt={`${peak.title} high alpine massif`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040812] via-[#040812]/75 to-black/50" />
          </div>
        ) : (
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full min-h-[360px] sm:min-h-[420px] bg-[#080e1a] overflow-hidden">
            {/* Ambient territory glow */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[650px] h-[400px] rounded-full blur-[120px] opacity-25"
              style={{ background: style.glow || style.accent }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(4,8,18,0.2)_0%,rgba(4,8,18,0.85)_100%)]" />
          </div>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-end p-6 sm:p-12 text-center">
          <span
            className="text-[11px] font-mono uppercase tracking-[0.25em] font-bold px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white mb-3"
            style={{ borderColor: `${style.accent}60` }}
          >
            {subRegion.name}, {region.name}
          </span>

          <h3 className="font-display font-bold text-2xl sm:text-5xl text-white tracking-tight max-w-2xl mb-4 leading-tight drop-shadow-md">
            The Range of {peak.title} ({peak.height}m)
          </h3>

          <p className="text-white/80 font-light text-xs sm:text-base max-w-lg mb-8 leading-relaxed">
            Examine high-altitude topography, explore adjacent 5,000m–6,000m summits, or review clinical acclimatization protocols.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-md">
            <Link
              href={`/map?focus=${place.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg min-h-[44px] flex-1 sm:flex-initial"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Explore 3D Mountain</span>
            </Link>

            <Link
              href={`/explore/${stateSlug}/${divisionSlug}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-black/60 hover:bg-black/80 text-white border border-white/20 font-mono text-xs font-semibold uppercase tracking-wider transition-all backdrop-blur-md min-h-[44px] flex-1 sm:flex-initial"
            >
              <span>{subRegion.name} Massifs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Authority Protocol Ribbon */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 flex-shrink-0">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-900 dark:text-white block">
              The Three Golden Rules of Altitude Safety
            </span>
            <span className="text-[11px] font-light text-slate-600 dark:text-slate-400">
              Strict mountaineering directive: Any symptom above 3,000m is altitude sickness until proven otherwise.
            </span>
          </div>
        </div>

        <Link
          href="/safety"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-white dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 hover:border-primary/50 text-slate-900 dark:text-white transition-all flex-shrink-0 min-h-[38px]"
        >
          <span>Safety Protocols</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
