"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Map,
  MapPin,
  Navigation,
  ArrowUpRight,
  Compass,
  Download,
  ShieldCheck,
  Smartphone,
  AlertTriangle,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getRouteData } from "@/data/routes";

const RouteMap3D = dynamic(() => import("@/components/maps/RouteMap3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[480px] rounded-3xl bg-slate-900/60 border border-white/10 flex items-center justify-center animate-pulse">
      <div className="w-8 h-8 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  ),
});

interface TrekRouteMapProps {
  title: string;
  slug: string;
  coords?: [number, number];
  pathCoords?: [number, number][];
  startPoint?: string;
  maxAltitude: string;
  distance: string;
  regionName: string;
  subRegionName: string;
  stateSlug: string;
  isPatalsu?: boolean;
}

const TERRITORY_ACCENTS: Record<string, { accent: string; glow: string }> = {
  "jammu-kashmir":    { accent: "#3B82F6", glow: "rgba(59,130,246,0.2)" },
  "himachal-pradesh": { accent: "#F59E0B", glow: "rgba(245,158,11,0.2)" },
  ladakh:             { accent: "#7C3AED", glow: "rgba(124,58,237,0.2)" },
  uttarakhand:        { accent: "#0D9488", glow: "rgba(13,148,136,0.2)" },
};

export function TrekRouteMap({
  title,
  slug,
  coords,
  pathCoords,
  startPoint = "Trailhead Entry",
  maxAltitude,
  distance,
  regionName,
  subRegionName,
  stateSlug,
  isPatalsu = false,
}: TrekRouteMapProps) {
  const shouldReduceMotion = useReducedMotion();
  const style = TERRITORY_ACCENTS[stateSlug] ?? { accent: "#3B82F6", glow: "rgba(59,130,246,0.2)" };

  const waypointCount = pathCoords?.length || 0;
  const hasCoordinates = Boolean(coords && coords[0] !== 0);
  const routeData = isPatalsu ? getRouteData(slug) : null;

  return (
    <motion.section 
      id="route" 
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container mx-auto px-4 sm:px-6 max-w-5xl py-12 sm:py-24 scroll-mt-24 border-t border-slate-200/80 dark:border-foreground/[0.08]"
      aria-labelledby="route-heading"
    >
      {/* Category Marker */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="text-xs font-mono font-bold uppercase tracking-[0.25em]"
          style={{ color: style.accent }}
        >
          Trail Navigation
        </span>
        <div className="h-px flex-1 bg-slate-200/80 dark:bg-foreground/[0.08]" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 
            id="route-heading"
            className="font-display font-bold text-3xl sm:text-5xl text-slate-900 dark:text-foreground tracking-tight mb-3"
          >
            The Route
          </h2>
          <p className="text-slate-700 dark:text-slate-300 font-light text-base sm:text-lg max-w-2xl">
            Trailhead coordinates, navigation milestones, and geospatial profile connecting {startPoint} to the summit crest.
          </p>
        </div>

        {/* Secondary link to 3D Atlas */}
        <Link
          href={`/map?focus=${slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 flex-shrink-0 shadow-sm dark:shadow-lg min-h-[44px]"
          style={{
            borderColor: `${style.accent}40`,
            color: style.accent,
            backgroundColor: `${style.accent}12`,
          }}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Inspect 3D Satellite Mesh</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Key Route Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {/* Milestone 1: Starting Point */}
        <motion.div 
          whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
        >
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" style={{ color: style.accent }} />
            <span>Starting Point</span>
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
            {startPoint}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs font-light">
            {isPatalsu
              ? `${subRegionName}, ${regionName} • Trailhead Access (14 km from Manali)`
              : `${subRegionName}, ${regionName} • Trailhead Access`}
          </p>
        </motion.div>

        {/* Milestone 2: Summit Crest */}
        <motion.div 
          whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
        >
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" style={{ color: style.accent }} />
            <span>Summit Crest</span>
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
            {title} ({maxAltitude})
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs font-light">
            {isPatalsu
              ? "360° vistas of Pir Panjal, Dhauladhar & Hanuman Tibba"
              : `Panoramic vistas from ${title} across ${subRegionName}`}
          </p>
        </motion.div>

        {/* Milestone 3: GPS Coordinates */}
        <motion.div 
          whileHover={shouldReduceMotion ? undefined : { y: -4, borderColor: `${style.accent}50` }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none transition-all"
        >
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider mb-2">
            <Navigation className="w-3.5 h-3.5" style={{ color: style.accent }} />
            <span>GPS Coordinates</span>
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1 font-mono">
            {hasCoordinates ? `${coords![0].toFixed(4)}° N, ${coords![1].toFixed(4)}° E` : "32.3539° N, 77.1911° E"}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs font-light font-mono">
            {waypointCount > 0 ? `${waypointCount} verified trail waypoints` : "Mapped trail route"}
          </p>
        </motion.div>
      </div>

      {/* Route Visualization — Interactive 3D Terrain Map for Verified GPX Routes */}
      {routeData ? (
        <RouteMap3D
          routeData={routeData}
          placeName={title}
          placeSlug={slug}
          maxAltitude={maxAltitude}
          distance={distance}
          accentColor={style.accent}
          isPatalsu={isPatalsu}
        />
      ) : (
        /* Geospatial Map Visual Representation Banner (Fallback for Non-GPX Routes) */
        <motion.div 
          whileHover={shouldReduceMotion ? undefined : { borderColor: `${style.accent}40` }}
          transition={{ duration: 0.3 }}
          className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 dark:from-[#080e1a] dark:to-[#040812] border border-slate-800 dark:border-white/10 shadow-xl dark:shadow-2xl transition-all preserve-white-text dark-photo-card"
        >
          <div className="relative z-10 max-w-xl">
            <span 
              className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full border inline-block mb-3"
              style={{
                backgroundColor: `${style.accent}15`,
                color: style.accent,
                borderColor: `${style.accent}30`,
              }}
            >
              Topological Route
            </span>
            <h3 className="font-display font-bold text-2xl text-white mb-2">
              Trail Traversal Profile • {distance}
            </h3>
            <p className="text-white/80 font-light text-sm leading-relaxed mb-6">
              The trail departs from {startPoint.split("(")[0].trim()}, ascending steadily through the alpine geography of {subRegionName} toward the high altitude elevation marker at ${maxAltitude}.
            </p>
            <div className="flex items-center gap-4 flex-wrap text-xs font-mono text-white/70">
              <span>&bull; Trailhead: {startPoint.split("(")[0].trim()}</span>
              <span>&bull; High Point: {maxAltitude}</span>
            </div>
          </div>

          {/* Ambient Map Grid Watermark Effect */}
          <div className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8 opacity-20 pointer-events-none text-white font-mono text-[10px] space-y-1">
            <div>LAT: {hasCoordinates ? coords![0].toFixed(4) : "32.3539"} N</div>
            <div>LON: {hasCoordinates ? coords![1].toFixed(4) : "77.1911"} E</div>
            <div>DATUM: WGS 84</div>
          </div>
        </motion.div>
      )}

      {/* ── Phase 2 GPX Download Block (P2-08 & P2-09, Statically Pre-rendered for Googlebot & Users) ── */}
      {routeData && (
        <div className="mt-8 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-100/90 dark:bg-[#080e1a] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  Verified GPS Trace
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-white/40">
                  WGS 84 • {routeData.stats.pointCount} Waypoints
                </span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight mb-2">
                Download GPX for {title}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-light max-w-2xl leading-relaxed">
                Download the verified high-resolution GPS trail trace for {title}, recorded and validated directly on the mountain trail. Compatible with all handheld GPS units and smartphone navigation apps for offline route-finding.
              </p>
            </div>

            <a
              href={`/gpx/dht-${slug}.gpx`}
              download={`dht-${slug}.gpx`}
              onClick={() => {
                if (typeof window !== "undefined" && typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === "function") {
                  (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "gpx_download", {
                    place_id: slug,
                    file_name: `dht-${slug}.gpx`,
                  });
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-primary hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95 flex-shrink-0 min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>Download GPX (95 KB)</span>
            </a>
          </div>

          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            <div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Ground Verification Record</span>
              </div>
              <p className="text-slate-600 dark:text-white/60 leading-relaxed font-sans text-xs">
                Verified on 16 July 2020 • Recorded with Strava GPS / Phone by Ashish.
                All personal biometric timestamps and heart-rate telemetry have been completely stripped for clean, lightweight offline navigation.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-2">
                <Smartphone className="w-4 h-4 text-cyan-500" />
                <span>Device &amp; App Compatibility</span>
              </div>
              <ul className="text-slate-600 dark:text-white/60 space-y-1 font-sans text-xs">
                <li>&bull; <strong>Garmin &amp; Suunto:</strong> Transfer file directly via Garmin Connect or Suunto App.</li>
                <li>&bull; <strong>Gaia GPS &amp; AllTrails:</strong> Select &ldquo;Import GPX&rdquo; to sync offline topo route.</li>
                <li>&bull; <strong>Organic Maps &amp; OsmAnd:</strong> Tap file on mobile to open in 100% offline maps.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center gap-2 text-[11px] text-slate-500 dark:text-white/45">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>
              Alpine conditions, snowpack, and rockfall shift seasonally. A GPS track is a navigation aid, not a substitute for local guiding or weather vigilance. Review our{" "}
              <Link href="/disclaimer" className="text-primary underline hover:text-primary/80">
                Alpine Safety Disclaimer
              </Link>.
            </span>
          </div>
        </div>
      )}
    </motion.section>
  );
}
