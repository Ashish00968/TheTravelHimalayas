"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { GlobalMap } from "@/components/maps";
import { Trek } from "@/data/types";
import { placeLocationIndex } from "@/data/atlas";
import { Mountain, MapPin, Play, Sparkles, Shield, Compass } from "lucide-react";

interface MapLauncherProps {
  treks: Trek[];
}

export function MapLauncher({ treks }: MapLauncherProps) {
  const searchParams = useSearchParams();
  const focusParam = searchParams.get("focus");
  const focusedPlace = focusParam ? placeLocationIndex.get(focusParam) : null;

  const [isMapActive, setIsMapActive] = useState(Boolean(focusParam));

  if (isMapActive) {
    return (
      <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-surface">
        <GlobalMap treks={treks} initialFocusId={focusParam} />
      </div>
    );
  }


  return (
    <div 
      className="w-full min-h-[500px] sm:min-h-[550px] lg:min-h-[680px] rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-center p-5 sm:p-8 md:p-12 transition-all duration-500"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #151f32 0%, #080d18 60%, #03050a 100%)",
        border: "1px solid rgba(59,130,246,0.3)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(59,130,246,0.08)"
      }}
    >
      {/* Ambient background topography effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />

      {/* Top Center Glow */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-2xl flex flex-col items-center">
        {/* Eyebrow Badge */}
        {focusedPlace ? (
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[11px] font-mono font-bold uppercase tracking-[0.2em]"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "#FCD34D" }}
          >
            <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Targeting {focusedPlace.name} in 3D</span>
          </div>
        ) : (
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[11px] font-mono font-bold uppercase tracking-[0.2em]"
            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.35)", color: "#93C5FD" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Interactive 3D Geospatial Engine</span>
          </div>
        )}


        {/* Title */}
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4 tracking-tight leading-tight">
          Explore the Himalayas in 3D Satellite Terrain
        </h2>

        {/* Description */}
        <p className="text-white/60 text-sm sm:text-base font-light leading-relaxed mb-8 max-w-xl">
          High-altitude satellite mesh featuring 50+ trailheads, mountain passes, and alpine summits across Jammu &amp; Kashmir, Himachal, Ladakh, and Uttarakhand.
        </p>

        {/* Launch Button */}
        <button
          onClick={() => setIsMapActive(true)}
          className="group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 px-5 sm:px-10 py-3.5 sm:py-5 rounded-2xl text-white font-display font-bold text-xs sm:text-base tracking-wide transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.35)] hover:shadow-[0_0_60px_rgba(59,130,246,0.55)] hover:scale-[1.02] active:scale-[0.98] mb-8 max-w-full"
          style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
            border: "1px solid rgba(255,255,255,0.2)"
          }}
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
          </div>
          <span>Launch 3D Interactive Map</span>
        </button>

        {/* Feature Highlights Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-white/40">
          <div className="flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>3D DEM Topography</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>50+ Waypoints Mapped</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>Curated Fly-to Exploration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
