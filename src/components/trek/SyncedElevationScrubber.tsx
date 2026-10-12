"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mountain, TrendingUp, AlertTriangle, Wind, Gauge } from "lucide-react";
import { RouteData, AlpineWaypointType } from "@/data/types";
import { useActiveRoutePoint, setActiveRoutePoint } from "@/lib/route-store";
import { calculateHadi } from "@/lib/hadi";

export interface ElevationSample {
  distanceKm: number;
  elevationM: number;
  gradientPct: number;
  lat: number;
  lng: number;
  progress: number; // 0 to 1
  label?: string;
  isMilestone?: boolean;
  waypointType?: AlpineWaypointType;
  cautionNotice?: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  elevationMeters?: number;
  distanceKm?: number;
}

interface SyncedElevationScrubberProps {
  routeData?: RouteData | null;
  itinerary?: ItineraryDay[];
  maxAltitude?: string;
  startPoint?: string;
  accentColor?: string;
  trailTitle?: string;
  compact?: boolean;
}

/* ── Barometric Oxygen Estimation Formula ───────────────────────────────── */
function estimateOxygenPct(elevationM: number): number {
  // Barometric scale height approx 8,400m
  const ratio = Math.exp(-elevationM / 8400);
  return Math.max(45, Math.min(100, Math.round(ratio * 100)));
}

export function SyncedElevationScrubber({
  routeData,
  itinerary = [],
  maxAltitude = "Alpine Zone",
  startPoint = "Base Trailhead",
  accentColor = "#38BDF8",
  trailTitle = "Trail Route",
  compact = false,
}: SyncedElevationScrubberProps) {
  const [hoveredSample, setHoveredSample] = useState<ElevationSample | null>(null);
  const [isPointerActive, setIsPointerActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const activeExternalPoint = useActiveRoutePoint();

  /* ── 1. Generate Uniform Continuous Elevation Samples ─────────────────── */
  const { samples, totalDistanceKm, minElevM, maxElevM, milestones } = useMemo(() => {
    // Strategy A: Authentic GPS coordinates from RouteData
    if (routeData && routeData.line && routeData.line.coordinates.length > 1) {
      const coords = routeData.line.coordinates; // [lng, lat, eleM]
      
      // Compute cumulative distance array in km (Haversine)
      const cumDist: number[] = [0];
      for (let i = 1; i < coords.length; i++) {
        const [lng1, lat1] = coords[i - 1];
        const [lng2, lat2] = coords[i];
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lng2 - lng1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        cumDist.push(cumDist[i - 1] + R * c);
      }

      const totalDist = cumDist[cumDist.length - 1] || routeData.stats.distanceKm;
      
      // Target ~140 evenly spaced samples along distance for buttery 60fps scrubbing
      const targetSampleCount = 140;
      const resSamples: ElevationSample[] = [];
      const msList: ElevationSample[] = [];

      for (let s = 0; s <= targetSampleCount; s++) {
        const targetD = (s / targetSampleCount) * totalDist;
        
        // Find segment
        let idx = 0;
        while (idx < cumDist.length - 1 && cumDist[idx + 1] < targetD) {
          idx++;
        }
        
        const p1 = coords[idx];
        const p2 = coords[Math.min(idx + 1, coords.length - 1)];
        const segDist1 = cumDist[idx];
        const segDist2 = cumDist[Math.min(idx + 1, cumDist.length - 1)];
        const segLen = segDist2 - segDist1;
        const t = segLen > 0 ? (targetD - segDist1) / segLen : 0;

        const lng = p1[0] + (p2[0] - p1[0]) * t;
        const lat = p1[1] + (p2[1] - p1[1]) * t;
        const ele = Math.round(p1[2] + (p2[2] - p1[2]) * t);

        // Compute local slope gradient %
        const lookAhead = Math.min(idx + 4, coords.length - 1);
        const dAltM = coords[lookAhead][2] - p1[2];
        const dDistM = Math.max(10, (cumDist[lookAhead] - segDist1) * 1000);
        const gradient = Math.round((dAltM / dDistM) * 100);

        const sample: ElevationSample = {
          distanceKm: Math.round(targetD * 10) / 10,
          elevationM: ele,
          gradientPct: gradient,
          lat,
          lng,
          progress: s / targetSampleCount,
        };

        if (s === 0) {
          sample.label = startPoint;
          sample.isMilestone = true;
          msList.push(sample);
        } else if (s === targetSampleCount) {
          sample.label = `${trailTitle} (${maxAltitude})`;
          sample.isMilestone = true;
          msList.push(sample);
        }

        resSamples.push(sample);
      }

      // Merge verified waypoints from routeData
      if (routeData.waypoints && routeData.waypoints.length > 0) {
        routeData.waypoints.forEach((wp) => {
          // Find closest sample by lat/lng
          let bestIdx = 0;
          let bestDist = Infinity;
          resSamples.forEach((s, i) => {
            const d = Math.hypot(s.lat - wp.lat, s.lng - wp.lng);
            if (d < bestDist) {
              bestDist = d;
              bestIdx = i;
            }
          });
          if (resSamples[bestIdx] && bestIdx !== 0 && bestIdx !== resSamples.length - 1) {
            resSamples[bestIdx].label = wp.name;
            resSamples[bestIdx].isMilestone = true;
            resSamples[bestIdx].waypointType = wp.type;
            resSamples[bestIdx].cautionNotice = wp.cautionNotice;
            msList.push(resSamples[bestIdx]);
          }
        });
      }

      const allEle = resSamples.map((s) => s.elevationM);
      return {
        samples: resSamples,
        totalDistanceKm: Math.round(totalDist * 10) / 10,
        minElevM: Math.min(...allEle),
        maxElevM: Math.max(...allEle),
        milestones: msList,
      };
    }

    // Strategy B: Smooth cubic interpolation from Itinerary Days (Universal Fallback)
    const itinPoints = itinerary.filter((d) => d.elevationMeters !== undefined);
    if (itinPoints.length >= 2) {
      const dayCount = itinPoints.length;
      const totalDist = itinPoints.reduce((sum, d) => sum + (d.distanceKm || 4), 0);
      const resSamples: ElevationSample[] = [];
      const msList: ElevationSample[] = [];
      const steps = 100;

      // Cumulative distances for key days
      const dayDists: number[] = [0];
      for (let i = 1; i < dayCount; i++) {
        dayDists.push(dayDists[i - 1] + (itinPoints[i].distanceKm || totalDist / (dayCount - 1)));
      }

      for (let s = 0; s <= steps; s++) {
        const p = s / steps;
        const curDist = p * totalDist;

        // Find day segment
        let idx = 0;
        while (idx < dayDists.length - 1 && dayDists[idx + 1] < curDist) {
          idx++;
        }

        const e1 = itinPoints[idx].elevationMeters!;
        const e2 = itinPoints[Math.min(idx + 1, dayCount - 1)].elevationMeters!;
        const segStart = dayDists[idx];
        const segEnd = dayDists[Math.min(idx + 1, dayCount - 1)];
        const segLen = segEnd - segStart;
        const t = segLen > 0 ? (curDist - segStart) / segLen : 0;

        // Smooth cosine ease for natural mountain curve
        const smoothT = 0.5 - 0.5 * Math.cos(t * Math.PI);
        const ele = Math.round(e1 + (e2 - e1) * smoothT);
        const gradient = Math.round(((e2 - e1) / Math.max(1, segLen * 1000)) * 100);

        const sample: ElevationSample = {
          distanceKm: Math.round(curDist * 10) / 10,
          elevationM: ele,
          gradientPct: gradient,
          lat: 0,
          lng: 0,
          progress: p,
        };

        if (s === 0) {
          sample.label = itinPoints[0].title;
          sample.isMilestone = true;
          msList.push(sample);
        } else if (s === steps) {
          sample.label = itinPoints[dayCount - 1].title;
          sample.isMilestone = true;
          msList.push(sample);
        } else if (Math.abs(curDist - dayDists[idx + 1]) < 0.1 && idx + 1 < dayCount - 1) {
          sample.label = itinPoints[idx + 1].title;
          sample.isMilestone = true;
          msList.push(sample);
        }

        resSamples.push(sample);
      }

      const allEle = resSamples.map((s) => s.elevationM);
      return {
        samples: resSamples,
        totalDistanceKm: Math.round(totalDist * 10) / 10,
        minElevM: Math.min(...allEle),
        maxElevM: Math.max(...allEle),
        milestones: msList,
      };
    }

    return {
      samples: [],
      totalDistanceKm: 0,
      minElevM: 0,
      maxElevM: 0,
      milestones: [],
    };
  }, [routeData, itinerary, startPoint, trailTitle, maxAltitude]);

  /* ── 2. SVG Coordinates Scaling ────────────────────────────────────────── */
  const width = 1000;
  const height = compact ? 105 : 360;
  const paddingX = compact ? 40 : 64;
  const paddingY = compact ? 14 : 44;

  const yPadding = Math.max(150, Math.round((maxElevM - minElevM) * 0.18));
  const chartMinY = Math.max(0, minElevM - yPadding);
  const chartMaxY = maxElevM + yPadding;

  const getX = useCallback(
    (progress: number) => {
      const usableW = width - paddingX * 2;
      return paddingX + progress * usableW;
    },
    [width, paddingX]
  );

  const getY = useCallback(
    (elevM: number) => {
      const usableH = height - paddingY * 2;
      const ratio = (elevM - chartMinY) / Math.max(1, chartMaxY - chartMinY);
      return height - paddingY - ratio * usableH;
    },
    [height, paddingY, chartMinY, chartMaxY]
  );

  // SVG Line & Area Path
  const { pathD, fillPathD } = useMemo(() => {
    if (samples.length < 2) return { pathD: "", fillPathD: "" };
    const pointsStr = samples.map((s, i) => `${i === 0 ? "M" : "L"} ${getX(s.progress)} ${getY(s.elevationM)}`).join(" ");
    const areaStr = `${pointsStr} L ${getX(1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;
    return { pathD: pointsStr, fillPathD: areaStr };
  }, [samples, getX, getY, height, paddingY]);

  /* ── 3. Interactive Scrubber Handlers (Pointer Event & Touch) ───────────── */
  const handlePointerScrub = useCallback(
    (clientX: number) => {
      if (!svgRef.current || samples.length === 0) return;
      const rect = svgRef.current.getBoundingClientRect();
      const xRel = clientX - rect.left;
      const usableWidthPx = rect.width * ((width - paddingX * 2) / width);
      const startPx = rect.width * (paddingX / width);

      const rawProgress = (xRel - startPx) / usableWidthPx;
      const clampedP = Math.max(0, Math.min(1, rawProgress));
      const targetIdx = Math.round(clampedP * (samples.length - 1));
      const sample = samples[targetIdx];

      setHoveredSample(sample);

      // Synchronize with global route store for Mapbox 3D puck gliding
      setActiveRoutePoint({
        progress: clampedP,
        distanceKm: sample.distanceKm,
        elevationM: sample.elevationM,
        lat: sample.lat,
        lng: sample.lng,
        label: sample.label || `${sample.elevationM}m`,
      });
    },
    [samples, width, paddingX]
  );

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsPointerActive(true);
    (e.target as Element).setPointerCapture(e.pointerId);
    handlePointerScrub(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isPointerActive || !("ontouchstart" in window)) {
      handlePointerScrub(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsPointerActive(false);
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerLeave = () => {
    if (!isPointerActive) {
      setHoveredSample(null);
      setActiveRoutePoint(null);
    }
  };

  // Active display point (local scrubber takes precedence; falls back to external 3D sync or initial point)
  const displaySample = useMemo(() => {
    if (hoveredSample) return hoveredSample;
    if (activeExternalPoint && samples.length > 0) {
      const idx = Math.min(
        samples.length - 1,
        Math.max(0, Math.round(activeExternalPoint.progress * (samples.length - 1)))
      );
      return samples[idx];
    }
    return samples[0] || null;
  }, [hoveredSample, activeExternalPoint, samples]);

  const hadi = useMemo(() => {
    return calculateHadi(
      totalDistanceKm,
      Math.max(100, maxElevM - minElevM),
      maxElevM,
      maxElevM > 3500 ? "moraine" : "trail"
    );
  }, [totalDistanceKm, minElevM, maxElevM]);

  if (samples.length < 2 || !displaySample) {
    return null;
  }

  const oxygenPct = estimateOxygenPct(displaySample.elevationM);
  const isAmsRiskZone = displaySample.elevationM >= 3000;
  const isExtremeZone = displaySample.elevationM >= 4500;

  return (
    <div
      ref={containerRef}
      className={`w-full relative ${
        compact
          ? "bg-transparent border-0 p-0 shadow-none"
          : "overflow-hidden bg-white dark:bg-[#080E1A] border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-2xl"
      }`}
    >
      {/* ── Top Header & Live Telemetry HUD Bar ─────────────────────────────── */}
      {compact ? (
        /* Compact Single-Line HUD Strip for 3D Map Overlay */
        <div className="flex items-center justify-between flex-wrap gap-1.5 mb-2 text-[11px] font-mono select-none">
          {/* Elevation Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/12 text-white shadow-xs">
            <Mountain className="w-3 h-3 shrink-0" style={{ color: accentColor }} />
            <span className="text-white/60">Elev:</span>
            <span className="font-bold text-white">
              {displaySample.elevationM.toLocaleString()} m
            </span>
            <span className="text-[9.5px] text-white/40">
              ({Math.round(displaySample.elevationM * 3.28084).toLocaleString()} ft)
            </span>
          </div>

          {/* Distance Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/12 text-white shadow-xs">
            <span className="text-white/60">Dist:</span>
            <span className="font-bold text-white">
              {displaySample.distanceKm} km
            </span>
            <span className="text-[9.5px] text-white/40">/ {totalDistanceKm} km</span>
          </div>

          {/* Slope Gradient Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/12 text-white shadow-xs">
            <TrendingUp
              className={`w-3 h-3 shrink-0 ${
                displaySample.gradientPct > 20
                  ? "text-rose-400"
                  : displaySample.gradientPct > 12
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            />
            <span className="text-white/60">Grade:</span>
            <span className="font-bold text-white">
              {displaySample.gradientPct > 0 ? `+${displaySample.gradientPct}%` : `${displaySample.gradientPct}%`}
            </span>
          </div>

          {/* HADI Difficulty Rating Indicator */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border shadow-xs"
            style={{
              backgroundColor: hadi.badgeBg,
              borderColor: `${hadi.badgeColor}40`,
              color: hadi.badgeColor,
            }}
          >
            <Gauge className="w-3 h-3 shrink-0" />
            <span className="font-bold">HADI {hadi.score}</span>
            <span className="text-[9px] uppercase font-bold opacity-80 hidden xs:inline">
              ({hadi.grade})
            </span>
          </div>

          {/* Hypoxia & Atmospheric Oxygen Estimator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shadow-xs text-white ${
              isExtremeZone
                ? "bg-rose-500/20 text-rose-300 border-rose-500/35"
                : isAmsRiskZone
                ? "bg-amber-500/20 text-amber-300 border-amber-500/35"
                : "bg-black/50 text-white border-white/12"
            }`}
          >
            <Wind className="w-3 h-3 shrink-0" />
            <span className="font-bold">~{oxygenPct}% O₂</span>
            {isAmsRiskZone && (
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-amber-300 hidden xs:inline">
                {isExtremeZone ? "Extreme Hypoxia" : "AMS Directive"}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Full Rich Header for Trek Detail Page */
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Interactive Scrubber • Synced 3D Telemetry
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
              Elevation &amp; Slope Profile
            </h3>
          </div>

          {/* Real-time Dynamic HUD Pill Console */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
            {/* Elevation Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 shadow-xs">
              <Mountain className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span className="text-slate-500 dark:text-slate-400">Elev:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {displaySample.elevationM.toLocaleString()} m
              </span>
              <span className="text-[10px] text-slate-400">
                ({Math.round(displaySample.elevationM * 3.28084).toLocaleString()} ft)
              </span>
            </div>

            {/* Distance Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 shadow-xs">
              <span className="text-slate-500 dark:text-slate-400">Dist:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {displaySample.distanceKm} km
              </span>
              <span className="text-[10px] text-slate-400">/ {totalDistanceKm} km</span>
            </div>

            {/* Slope Gradient Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 shadow-xs">
              <TrendingUp
                className={`w-3.5 h-3.5 ${
                  displaySample.gradientPct > 20
                    ? "text-rose-500"
                    : displaySample.gradientPct > 12
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
              />
              <span className="text-slate-500 dark:text-slate-400">Grade:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {displaySample.gradientPct > 0 ? `+${displaySample.gradientPct}%` : `${displaySample.gradientPct}%`}
              </span>
            </div>

            {/* Hypoxia & Atmospheric Oxygen Estimator */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-xs transition-colors ${
                isExtremeZone
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                  : isAmsRiskZone
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : "bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10"
              }`}
            >
              <Wind className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold">~{oxygenPct}% O₂</span>
              {isAmsRiskZone && (
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {isExtremeZone ? "Extreme Hypoxia" : "AMS Directive"}
                </span>
              )}
            </div>

            {/* HADI Alpine Difficulty Rating Indicator */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-xs transition-colors"
              style={{
                backgroundColor: hadi.badgeBg,
                borderColor: `${hadi.badgeColor}40`,
                color: hadi.badgeColor,
              }}
            >
              <Gauge className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold">HADI {hadi.score}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">
                {hadi.grade}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Interactive SVG Scrubber Canvas ─────────────────────────── */}
      <div className="w-full relative touch-none select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            <linearGradient id="scrubberFillGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.32" />
              <stop offset="60%" stopColor={accentColor} stopOpacity="0.08" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
            </linearGradient>

            <filter id="scrubberGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines and Elevation Markers */}
          {[0, 0.33, 0.66, 1].map((ratio) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            const elevVal = Math.round(chartMinY + ratio * (chartMaxY - chartMinY));
            return (
              <g key={ratio} className="text-slate-300/60 dark:text-white/10">
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  fill="currentColor"
                  fontSize="11"
                  textAnchor="end"
                  className="font-mono text-slate-400 dark:text-slate-500 font-light"
                >
                  {elevVal}m
                </text>
              </g>
            );
          })}

          {/* Clinical Altitude Directive Line at 3,000m (AMS Threshold) */}
          {chartMinY <= 3000 && chartMaxY >= 3000 && (
            <g className="transition-opacity">
              <line
                x1={paddingX}
                y1={getY(3000)}
                x2={width - paddingX}
                y2={getY(3000)}
                stroke="#F59E0B"
                strokeWidth={compact ? "1" : "1.5"}
                strokeDasharray="6 4"
                strokeOpacity="0.75"
              />
              {compact ? (
                <text
                  x={width - paddingX - 4}
                  y={getY(3000) - 3}
                  fill="#F59E0B"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="end"
                  className="font-mono uppercase tracking-wider"
                >
                  3,000m AMS
                </text>
              ) : (
                <>
                  <rect
                    x={width - paddingX - 180}
                    y={getY(3000) - 18}
                    width="180"
                    height="16"
                    rx="4"
                    fill="#F59E0B"
                    fillOpacity="0.15"
                  />
                  <text
                    x={width - paddingX - 6}
                    y={getY(3000) - 6}
                    fill="#F59E0B"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="end"
                    className="font-mono uppercase tracking-wider"
                  >
                    AMS Threshold (3,000m)
                  </text>
                </>
              )}
            </g>
          )}

          {/* Clinical Altitude Directive Line at 4,500m (HAPE/HACE Zone) */}
          {chartMinY <= 4500 && chartMaxY >= 4500 && (
            <g className="transition-opacity">
              <line
                x1={paddingX}
                y1={getY(4500)}
                x2={width - paddingX}
                y2={getY(4500)}
                stroke="#EF4444"
                strokeWidth={compact ? "1" : "1.5"}
                strokeDasharray="6 4"
                strokeOpacity="0.75"
              />
              {compact ? (
                <text
                  x={width - paddingX - 4}
                  y={getY(4500) - 3}
                  fill="#EF4444"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="end"
                  className="font-mono uppercase tracking-wider"
                >
                  4,500m Hypoxia
                </text>
              ) : (
                <>
                  <rect
                    x={width - paddingX - 195}
                    y={getY(4500) - 18}
                    width="195"
                    height="16"
                    rx="4"
                    fill="#EF4444"
                    fillOpacity="0.15"
                  />
                  <text
                    x={width - paddingX - 6}
                    y={getY(4500) - 6}
                    fill="#EF4444"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="end"
                    className="font-mono uppercase tracking-wider"
                  >
                    Extreme Hypoxia (4,500m)
                  </text>
                </>
              )}
            </g>
          )}

          {/* Filled Elevation Area */}
          <motion.path
            d={fillPathD}
            fill="url(#scrubberFillGradient)"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />

          {/* Main Ridge Contour Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={accentColor}
            strokeWidth={compact ? "2.5" : "3.5"}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#scrubberGlow)"
            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Milestone Waypoint Indicators along the Trail */}
          {milestones.map((ms, idx) => {
            const x = getX(ms.progress);
            const y = getY(ms.elevationM);
            const isHovered = hoveredSample?.progress === ms.progress;
            const msColor =
              ms.waypointType === "warning"
                ? "#EF4444"
                : ms.waypointType === "water"
                ? "#06B6D4"
                : ms.waypointType === "camp"
                ? "#F59E0B"
                : ms.waypointType === "summit"
                ? "#8B5CF6"
                : ms.waypointType === "pass"
                ? "#6366F1"
                : accentColor;

            return (
              <g
                key={idx}
                className="cursor-pointer transition-transform"
                onClick={() => {
                  setHoveredSample(ms);
                  setActiveRoutePoint({
                    progress: ms.progress,
                    distanceKm: ms.distanceKm,
                    elevationM: ms.elevationM,
                    lat: ms.lat,
                    lng: ms.lng,
                    label: ms.label,
                  });
                }}
              >
                <circle cx={x} cy={y} r="14" fill="transparent" />
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? (compact ? "6" : "7.5") : (compact ? "3.5" : "4.5")}
                  fill="#080E1A"
                  stroke={msColor}
                  strokeWidth={compact ? "2" : "2.5"}
                />
                {!compact && ms.label && (
                  <text
                    x={x}
                    y={y - 12}
                    fill="currentColor"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor={idx === 0 ? "start" : idx === milestones.length - 1 ? "end" : "middle"}
                    className="font-mono text-slate-700 dark:text-slate-300 pointer-events-none select-none"
                  >
                    {ms.label.length > 20 ? ms.label.substring(0, 18) + "…" : ms.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Active Synchronized Interactive Scrubber Cursor ────────────── */}
          {displaySample && (
            <g className="transition-all duration-75">
              {/* Vertical Crosshair Line */}
              <line
                x1={getX(displaySample.progress)}
                y1={paddingY - 6}
                x2={getX(displaySample.progress)}
                y2={height - paddingY}
                stroke={accentColor}
                strokeWidth={compact ? "1.5" : "2"}
                strokeDasharray="4 4"
                strokeOpacity="0.85"
              />

              {/* Glowing Tracking Puck on Ridge Line */}
              <circle
                cx={getX(displaySample.progress)}
                cy={getY(displaySample.elevationM)}
                r={compact ? "6" : "8"}
                fill="#080E1A"
                stroke={accentColor}
                strokeWidth={compact ? "2.5" : "3.5"}
                className="shadow-xl"
              />
              <circle
                cx={getX(displaySample.progress)}
                cy={getY(displaySample.elevationM)}
                r={compact ? "2.5" : "3.5"}
                fill="#FFFFFF"
              />

              {/* Floating Tooltip HUD Card above Marker (Rendered strictly when !compact to prevent glitchy collisions) */}
              {!compact &&
                (() => {
                  const curX = getX(displaySample.progress);
                  const curY = getY(displaySample.elevationM);
                  const tipWidth = 140;
                  const tipX = Math.max(paddingX, Math.min(width - paddingX - tipWidth, curX - tipWidth / 2));
                  const tipY = Math.max(10, curY - 56);

                  return (
                    <g pointerEvents="none">
                      <rect
                        x={tipX}
                        y={tipY}
                        width={tipWidth}
                        height="38"
                        rx="8"
                        fill="#0C1017"
                        stroke={accentColor}
                        strokeWidth="1.5"
                        className="shadow-2xl"
                      />
                      <text
                        x={tipX + tipWidth / 2}
                        y={tipY + 16}
                        fill="#FFFFFF"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="font-mono"
                      >
                        {displaySample.elevationM}m • {displaySample.distanceKm} km
                      </text>
                      <text
                        x={tipX + tipWidth / 2}
                        y={tipY + 30}
                        fill={accentColor}
                        fontSize="9.5"
                        fontWeight="600"
                        textAnchor="middle"
                        className="font-mono uppercase tracking-wider"
                      >
                        {displaySample.label || `${displaySample.gradientPct > 0 ? "+" : ""}${displaySample.gradientPct}% Grade`}
                      </text>
                    </g>
                  );
                })()}
            </g>
          )}

          {/* Distance Markers on Bottom Axis */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const x = getX(pct);
            const dist = Math.round(pct * totalDistanceKm * 10) / 10;
            return (
              <text
                key={pct}
                x={x}
                y={height - paddingY + (compact ? 12 : 22)}
                fill="currentColor"
                fontSize={compact ? "9" : "11"}
                textAnchor="middle"
                className="font-mono text-slate-500 dark:text-slate-400 font-light"
              >
                {dist} km
              </text>
            );
          })}
        </svg>
      </div>

      {/* Interactive Helper Footer (Rendered only on Trek detail page, omitted on 3D map overlay) */}
      {!compact && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
            <span>Slide finger or mouse along ridge to scrub telemetry and 3D map position.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>&ge;3,000m: Sleep &le;500m/day</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
