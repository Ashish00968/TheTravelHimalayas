"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Mountain,
  X,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import { getTrailSeasonCondition } from "@/lib/season-conditions";

interface TopoMiniMapProps {
  placeName: string;
  placeSlug: string;
  coords?: [number, number]; // [lat, lng]
  startPoint?: string;
  maxAltitude: string;
  distance?: string;
  accentColor?: string;
  stateSlug: string;
  subRegionName?: string;
  regionName?: string;
  bestSeason?: string;
}

export function TopoMiniMap({
  placeName,
  placeSlug,
  coords,
  startPoint = "Base Trailhead",
  maxAltitude,
  distance,
  accentColor = "#38BDF8",
  stateSlug,
  subRegionName,
  bestSeason = "May to October",
}: TopoMiniMapProps) {
  const [is3DActive, setIs3DActive] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Normalized coordinates
  const lat = coords && coords[0] !== 0 ? coords[0] : 32.3539;
  const lng = coords && coords[1] !== 0 ? coords[1] : 77.1911;

  // Numerical elevation
  const altMatch = maxAltitude.replace(/,/g, "").match(/\d+/);
  const peakElevM = altMatch ? parseInt(altMatch[0], 10) : 3400;

  // Live season condition
  const seasonCondition = useMemo(() => {
    return getTrailSeasonCondition(bestSeason, maxAltitude, stateSlug);
  }, [bestSeason, maxAltitude, stateSlug]);

  // SVG dimensions for topographic cartography
  const svgWidth = 840;
  const svgHeight = 440;
  const cx = svgWidth * 0.65;
  const cy = svgHeight * 0.42;

  // Initialize Mapbox when user explicitly clicks "Launch 3D Satellite Terrain"
  useEffect(() => {
    if (!is3DActive || !mapContainerRef.current || !mapboxToken || mapRef.current) return;

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [lng, lat],
      zoom: 13.8,
      pitch: 65,
      bearing: -25,
      attributionControl: false,
    });

    map.on("load", () => {
      // Add 3D Terrain DEM
      if (!map.getSource("mapbox-dem")) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.2 });
      }

      // Add Atmospheric Sky
      map.setFog({
        color: "rgb(7, 9, 14)",
        "high-color": "rgb(36, 92, 223)",
        "horizon-blend": 0.08,
        "space-color": "rgb(4, 8, 18)",
        "star-intensity": 0.45,
      });

      // Summit Beacon Marker
      const beaconEl = document.createElement("div");
      beaconEl.className = "flex flex-col items-center cursor-pointer pointer-events-auto select-none";
      beaconEl.innerHTML = `
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/95 border border-cyan-400 text-white text-xs font-mono font-bold shadow-2xl backdrop-blur-md animate-pulse">
          <span>🚩</span><span>${placeName} (${maxAltitude})</span>
        </div>
        <div style="width: 2px; height: 12px; background: linear-gradient(to bottom, #22d3ee, #06b6d4);"></div>
        <div style="width: 0; height: 0; border-left: 3.5px solid transparent; border-right: 3.5px solid transparent; border-top: 6px solid #22d3ee; filter: drop-shadow(0 0 5px #06b6d4);"></div>
      `;

      new mapboxgl.Marker({ element: beaconEl, anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [is3DActive, mapboxToken, lat, lng, placeName, maxAltitude]);

  return (
    <div className="w-full relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 bg-[#080E1A] shadow-xl dark:shadow-2xl transition-all">
      {/* ── Top Bar with Live Season Condition & Coordinates ──────────────── */}
      <div className="px-5 sm:px-6 py-3.5 bg-slate-900/90 border-b border-white/[0.08] flex items-center justify-between flex-wrap gap-2.5 text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-white/60 uppercase tracking-widest text-[11px] font-bold">
            Topographic Cartography • {subRegionName ? `${subRegionName} • ` : ""}WGS 84
          </span>
          <span className="text-white/30 hidden sm:inline">&bull;</span>
          <span className="text-white/70 hidden sm:inline">
            {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
          </span>
        </div>

        {/* Live Season Condition Badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold shadow-xs"
          style={{
            backgroundColor: seasonCondition.badgeBg,
            borderColor: seasonCondition.borderColor,
            color: seasonCondition.badgeColor,
          }}
        >
          <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
          <span>{seasonCondition.badgeText}</span>
        </div>
      </div>

      {/* ── Main Map Display Area ────────────────────────────────────────── */}
      <div className="relative w-full h-[380px] sm:h-[460px] overflow-hidden bg-gradient-to-b from-[#0A101D] to-[#060A13]">
        {/* Tier 1: Instant SVG Topographic Contour Canvas (Active by default) */}
        {!is3DActive ? (
          <div className="absolute inset-0 w-full h-full">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="xMidYMid slice"
              className="w-full h-full select-none"
            >
              <defs>
                {/* Radial Mountain Glow */}
                <radialGradient id="contourPeakGlow" cx="65%" cy="42%" r="50%">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.22" />
                  <stop offset="45%" stopColor={accentColor} stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#080E1A" stopOpacity="0" />
                </radialGradient>

                {/* Trail Dash Gradient */}
                <linearGradient id="trailLineGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="60%" stopColor={accentColor} />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>

              {/* Background Glow */}
              <rect width={svgWidth} height={svgHeight} fill="url(#contourPeakGlow)" />

              {/* Cartographic Coordinate Grids */}
              {[120, 240, 360, 480, 600, 720].map((x) => (
                <line
                  key={`vx-${x}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={svgHeight}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />
              ))}
              {[80, 160, 240, 320, 400].map((y) => (
                <line
                  key={`hy-${y}`}
                  x1={0}
                  y1={y}
                  x2={svgWidth}
                  y2={y}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />
              ))}

              {/* Concentric Topographic Iso-Elevation Contour Rings */}
              {[
                { rx: 320, ry: 190, rot: -12, ele: peakElevM - 900, op: 0.12 },
                { rx: 270, ry: 160, rot: -8, ele: peakElevM - 750, op: 0.18 },
                { rx: 220, ry: 130, rot: -5, ele: peakElevM - 600, op: 0.25 },
                { rx: 175, ry: 105, rot: 2, ele: peakElevM - 450, op: 0.35 },
                { rx: 130, ry: 80, rot: -3, ele: peakElevM - 300, op: 0.48 },
                { rx: 90, ry: 55, rot: 6, ele: peakElevM - 150, op: 0.65 },
                { rx: 50, ry: 32, rot: -4, ele: peakElevM, op: 0.85 },
              ].map((c, i) => (
                <g key={i}>
                  <ellipse
                    cx={cx}
                    cy={cy}
                    rx={c.rx}
                    ry={c.ry}
                    transform={`rotate(${c.rot} ${cx} ${cy})`}
                    fill="none"
                    stroke={accentColor}
                    strokeWidth={i === 6 ? "1.75" : i % 2 === 0 ? "1.2" : "0.75"}
                    strokeOpacity={c.op}
                  />
                  {/* Contour Elevation Text Markings */}
                  {i % 2 === 0 && (
                    <text
                      x={cx - c.rx + 25}
                      y={cy + 4}
                      fill={accentColor}
                      fillOpacity={c.op * 0.9}
                      fontSize="9.5"
                      fontFamily="ui-monospace, monospace"
                      className="select-none pointer-events-none"
                    >
                      {Math.max(1200, c.ele)}m
                    </text>
                  )}
                </g>
              ))}

              {/* Trail Traversal Ascent Vector (Trailhead -> Summit) */}
              <g>
                {/* Projected trail path */}
                <path
                  d={`M 140 340 C 230 320, 290 280, 360 220 S 480 180, ${cx - 10} ${cy + 15}`}
                  fill="none"
                  stroke="url(#trailLineGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />

                {/* Trailhead Marker */}
                <g className="cursor-pointer">
                  <circle cx="140" cy="340" r="14" fill="#10B981" fillOpacity="0.15" />
                  <circle cx="140" cy="340" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                  <rect
                    x="45"
                    y="360"
                    width="190"
                    height="24"
                    rx="6"
                    fill="#080E1A"
                    stroke="#10B981"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                  <text
                    x="140"
                    y="376"
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="ui-monospace, monospace"
                    textAnchor="middle"
                  >
                    🟢 {startPoint.split("(")[0].trim().substring(0, 22)}
                  </text>
                </g>

                {/* Summit Apex Beacon */}
                <g className="cursor-pointer">
                  <circle cx={cx} cy={cy} r="18" fill={accentColor} fillOpacity="0.2" className="animate-pulse" />
                  <circle cx={cx} cy={cy} r="6" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
                  <rect
                    x={cx - 95}
                    y={cy - 45}
                    width="190"
                    height="26"
                    rx="6"
                    fill="#080E1A"
                    stroke={accentColor}
                    strokeWidth="1.2"
                  />
                  <text
                    x={cx}
                    y={cy - 28}
                    fill="#FFFFFF"
                    fontSize="10.5"
                    fontWeight="bold"
                    fontFamily="ui-monospace, monospace"
                    textAnchor="middle"
                  >
                    🚩 {placeName.substring(0, 18)} ({maxAltitude})
                  </text>
                </g>
              </g>

              {/* Bottom Right Coordinate Datum Watermark */}
              <text
                x={svgWidth - 24}
                y={svgHeight - 24}
                fill="rgba(255,255,255,0.3)"
                fontSize="9.5"
                fontFamily="ui-monospace, monospace"
                textAnchor="end"
              >
                ELEV: {maxAltitude} • VERTICAL PROFILE
              </text>
            </svg>

            {/* Centered Floating 1-Tap 3D Launcher HUD */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
              <div className="pointer-events-auto flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-950/85 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-w-md mx-auto">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3.5 shadow-lg border border-white/20"
                  style={{ backgroundColor: `${accentColor}25` }}
                >
                  <Mountain className="w-6 h-6" style={{ color: accentColor }} />
                </div>

                <h4 className="font-display font-bold text-lg sm:text-xl text-white mb-1.5">
                  Interactive 3D Satellite Terrain
                </h4>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-5 max-w-xs">
                  Inspect the 3D glacial topography, ridge relief, and trail approaches of {placeName} in photorealistic satellite imagery.
                </p>

                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <button
                    onClick={() => setIs3DActive(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 min-h-[42px]"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Launch 3D Satellite Mesh</span>
                  </button>

                  <Link
                    href={`/map?focus=${placeSlug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 font-mono text-xs font-semibold tracking-wider transition-all min-h-[42px]"
                  >
                    <span>Full 3D Atlas</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tier 2: On-Demand Mapbox 3D Satellite Mesh (Loaded on click) */
          <div className="w-full h-full relative">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Top Overlay Controls Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-white text-xs font-mono shadow-xl">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>3D Satellite Mesh Active</span>
              </div>

              <div className="pointer-events-auto flex items-center gap-2">
                <Link
                  href={`/map?focus=${placeSlug}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-white/15 text-white text-xs font-mono font-semibold flex items-center gap-1.5 shadow-xl transition-all"
                  title="Open in Global 3D Atlas"
                >
                  <span>Global Atlas</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => setIs3DActive(false)}
                  className="w-8 h-8 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-white/15 text-white flex items-center justify-center shadow-xl transition-all"
                  title="Close 3D View"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 pointer-events-auto">
              <button
                onClick={() => mapRef.current?.zoomIn()}
                className="w-8 h-8 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-white/15 text-white flex items-center justify-center shadow-lg transition-all"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => mapRef.current?.zoomOut()}
                className="w-8 h-8 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-white/15 text-white flex items-center justify-center shadow-lg transition-all"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  mapRef.current?.easeTo({
                    center: [lng, lat],
                    zoom: 13.8,
                    pitch: 65,
                    bearing: -25,
                    duration: 1200,
                  });
                }}
                className="w-8 h-8 rounded-xl bg-slate-950/85 hover:bg-slate-900 border border-white/15 text-white flex items-center justify-center shadow-lg transition-all"
                title="Reset Camera"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Information Strip: Season Advisory & Trail Details ───────── */}
      <div className="px-5 sm:px-6 py-4 bg-slate-900/90 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-white/80">{seasonCondition.advisory}</span>
        </div>

        <div className="flex items-center gap-3 text-white/50 text-[11px] shrink-0">
          <span>Trailhead: {startPoint.split("(")[0].trim()}</span>
          <span>&bull;</span>
          <span>Apex: {maxAltitude}</span>
          {distance && (
            <>
              <span>&bull;</span>
              <span>Dist: {distance}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
