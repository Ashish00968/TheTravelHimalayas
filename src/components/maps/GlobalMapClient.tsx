"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Mountain, ChevronRight, ChevronLeft, RotateCcw, ArrowUpRight, X } from "lucide-react";
import { Trek } from "@/data/types";
import {
  himalayaAtlas,
  HimalayaPlace,
  PlaceLocation,
  placeLocationIndex,
} from "@/data/atlas";

interface GlobalMapClientProps {
  treks: Trek[];
}

/* ── Camera presets ──────────────────────────────────────────────────────── */
const INIT = { lat: 31.4, lng: 77.2, zoom: 5.8, pitch: 42, bearing: 0 };

const REGION_CAM: Record<string, [number, number, number, number, number]> = {
  // [lat, lng, zoom, pitch, bearing]
  "himachal-pradesh": [30.85, 77.1,  8.0, 68, 5],
  uttarakhand:        [29.4,  79.1,  7.8, 68, 5],
  ladakh:             [32.8,  77.5,  7.5, 68, 355],
  "jammu-kashmir":    [32.3,  74.8,  7.8, 68, 10],
};

const SUBREGION_CAM: Record<string, [number, number, number, number, number]> = {
  kullu:               [31.8,  77.15, 10.2, 68, 5],
  "lahaul-spiti":      [31.9,  77.85,  9.6, 68, 5],
  kinnaur:             [31.1,  78.35, 10.2, 68, 10],
  kangra:              [31.9,  76.5,  10.2, 68, 5],
  garhwal:             [30.2,  79.15,  9.8, 68, 5],
  chamoli:             [30.25, 79.55,  9.8, 68, 5],
  "pauri-garhwal":     [29.85, 78.75, 10.0, 68, 5],
  uttarkashi:          [30.75, 78.8,   9.8, 68, 5],
  pithoragarh:         [29.85, 80.2,   9.8, 68, 5],
  leh:                 [33.7,  77.58,  9.5, 68, 355],
  kargil:              [33.9,  76.2,   9.6, 68, 5],
  nubra:               [34.2,  77.5,   9.5, 68, 355],
  drass:               [34.15, 75.75,  9.8, 68, 5],
  zanskar:             [33.2,  76.8,   9.4, 68, 10],
  jammu:               [32.8,  75.28,  9.8, 68, 5],
  kashmir:             [33.6,  74.9,   9.8, 68, 5],
};

/* ── Territory accent colours ────────────────────────────────────────────── */
const TERRITORY_ACCENT: Record<string, string> = {
  "jammu-kashmir":    "#3B82F6",
  "himachal-pradesh": "#F59E0B",
  ladakh:             "#7C3AED",
  uttarakhand:        "#0D9488",
};

/* ── Module-level flat list of all places ───────────────────────────────── */
const ALL_PLACES: HimalayaPlace[] = himalayaAtlas.flatMap((r) =>
  r.subregions.flatMap((s) => s.places)
);

/* ══════════════════════════════════════════════════════════════════════════ */
export default function GlobalMapClient({ treks }: GlobalMapClientProps) {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const routeListenersRef = useRef<{ layerId: string; fn: () => void }[]>([]);

  // ── State ─────────────────────────────────────────────────────────────
  const [activeRegionId, setActiveRegionId]     = useState<string | null>(null);
  const [activeSubRegionId, setActiveSubRegionId] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId]   = useState<string | null>(null);
  const [mapLoaded, setMapLoaded]               = useState(false);
  const [navigating, setNavigating]             = useState(false);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // ── Derived ───────────────────────────────────────────────────────────
  const activeRegion = useMemo(
    () => himalayaAtlas.find((r) => r.id === activeRegionId) ?? null,
    [activeRegionId]
  );
  const activeSubRegion = useMemo(
    () => (activeRegion?.subregions.find((s) => s.id === activeSubRegionId) ?? null),
    [activeRegion, activeSubRegionId]
  );
  const selectedPlace = useMemo(
    () => (selectedPlaceId ? (ALL_PLACES.find((p) => p.id === selectedPlaceId) ?? null) : null),
    [selectedPlaceId]
  );
  const selectedPlaceLocation: PlaceLocation | null = useMemo(
    () => (selectedPlaceId ? (placeLocationIndex.get(selectedPlaceId) ?? null) : null),
    [selectedPlaceId]
  );

  // ── Camera ────────────────────────────────────────────────────────────
  const flyTo = useCallback(
    (lat: number, lng: number, zoom: number, pitch = 68, bearing = 0, duration = 2000) => {
      mapRef.current?.flyTo({ center: [lng, lat], zoom, pitch, bearing, duration, essential: true });
    },
    []
  );

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setActiveRegionId(null);
    setActiveSubRegionId(null);
    setSelectedPlaceId(null);
    flyTo(INIT.lat, INIT.lng, INIT.zoom, INIT.pitch, INIT.bearing, 2200);
  }, [flyTo]);

  const handleRegion = useCallback(
    (regionId: string) => {
      setActiveRegionId(regionId);
      setActiveSubRegionId(null);
      setSelectedPlaceId(null);
      const cam = REGION_CAM[regionId] ?? [INIT.lat, INIT.lng, INIT.zoom, INIT.pitch, 0];
      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 2000);
    },
    [flyTo]
  );

  const handleSubRegion = useCallback(
    (subRegionId: string) => {
      setActiveSubRegionId(subRegionId);
      setSelectedPlaceId(null);
      const cam = SUBREGION_CAM[subRegionId] ?? [31.8, 77.15, 10.2, 68, 5];
      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 1800);
    },
    [flyTo]
  );

  const handleSelectPlace = useCallback(
    (place: HimalayaPlace) => {
      const loc = placeLocationIndex.get(place.id);
      if (loc) {
        setActiveRegionId(loc.regionId);
        setActiveSubRegionId(loc.subRegionId);
      }
      setSelectedPlaceId(place.id);
      if (place.coords?.length === 2) {
        flyTo(place.coords[0], place.coords[1], 12.5, 66, -8, 1600);
      }
    },
    [flyTo]
  );

  const handleOpenPlace = useCallback(() => {
    if (!selectedPlaceLocation) return;
    setNavigating(true);
    router.push(selectedPlaceLocation.href);
  }, [selectedPlaceLocation, router]);

  // ── Map initialisation ────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || !mapboxToken || mapRef.current) return;
    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [INIT.lng, INIT.lat],
      zoom: INIT.zoom,
      pitch: INIT.pitch,
      bearing: INIT.bearing,
      projection: "globe",
      scrollZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      dragRotate: false,
      touchZoomRotate: false,
      attributionControl: false,
      antialias: true,
    });

    mapRef.current = map;

    map.on("error", (e) => {
      // Gracefully silence non-fatal tile aborts or transient network glitches
      const msg = e.error?.message || "";
      const status = (e.error as unknown as { status?: number })?.status;
      if (
        msg.includes("Failed to fetch") ||
        msg.includes("abort") ||
        status === 404
      ) {
        return;
      }
    });

    map.on("load", () => {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.7 });
      map.setFog({
        range: [0.8, 14.0],
        color: "#060c18",
        "horizon-blend": 0.18,
        "high-color": "#010408",
        "space-color": "#000000",
        "star-intensity": 0.7,
      });
      setMapLoaded(true);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [mapboxToken]);

  // ── Sync markers & routes ─────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Remove previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Remove previous route layers/listeners
    for (const { layerId, fn } of routeListenersRef.current) {
      if (map.getLayer(layerId)) map.off("click", layerId, fn);
    }
    routeListenersRef.current = [];
    for (const trek of treks) {
      const sId = `source-${trek.slug}`, lId = `layer-${trek.slug}`, gId = `glow-${trek.slug}`;
      if (map.getLayer(gId)) map.removeLayer(gId);
      if (map.getLayer(lId)) map.removeLayer(lId);
      if (map.getSource(sId)) map.removeSource(sId);
    }

    // Determine places to render
    const places: HimalayaPlace[] = activeSubRegion
      ? activeSubRegion.places
      : activeRegion
      ? activeRegion.subregions.flatMap((s) => s.places)
      : ALL_PLACES;

    const regionAccent = activeRegionId ? (TERRITORY_ACCENT[activeRegionId] ?? "#3B82F6") : "#3B82F6";

    for (const place of places) {
      if (!place.coords || place.coords.length !== 2) continue;
      const [lat, lng] = place.coords;
      const isSelected = selectedPlaceId === place.id;

      // Draw trek route if available
      const trekData = treks.find((t) => t.slug === place.id);
      if (trekData?.pathCoords && trekData.pathCoords.length > 1) {
        const sId = `source-${trekData.slug}`;
        const lId = `layer-${trekData.slug}`;
        const gId = `glow-${trekData.slug}`;
        map.addSource(sId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: trekData.pathCoords.map(([la, ln]) => [ln, la]),
            },
          },
        });
        // Glow layer
        map.addLayer({
          id: gId, type: "line", source: sId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": isSelected ? "#F59E0B" : regionAccent,
            "line-width": isSelected ? 10 : 5,
            "line-opacity": isSelected ? 0.5 : 0.2,
            "line-blur": 3,
          },
        });
        // Sharp line
        map.addLayer({
          id: lId, type: "line", source: sId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": isSelected ? "#FCD34D" : regionAccent,
            "line-width": isSelected ? 3 : 1.8,
            "line-opacity": 0.9,
          },
        });
        const fn = () => handleSelectPlace(place);
        map.on("click", lId, fn);
        routeListenersRef.current.push({ layerId: lId, fn });
      }

      // Build marker safely using DOM API
      const wrap = document.createElement("div");
      wrap.style.cssText = "position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer;";

      // Hover label
      const label = document.createElement("div");
      label.textContent = place.name;
      label.style.cssText = `
        position: absolute; bottom: 18px;
        white-space: nowrap;
        font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
        padding: 3px 8px; border-radius: 999px;
        background: rgba(4,8,18,0.92); backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.12);
        color: #F1F5F9;
        pointer-events: none;
        opacity: ${isSelected ? "1" : "0"};
        transform: translateY(${isSelected ? "0" : "4px"});
        transition: opacity 200ms, transform 200ms;
      `;

      // Dot
      const dot = document.createElement("div");
      const accentColor = isSelected ? "#F59E0B" : regionAccent;
      dot.style.cssText = `
        width: ${isSelected ? "14px" : "10px"};
        height: ${isSelected ? "14px" : "10px"};
        border-radius: 50%;
        background: ${accentColor};
        border: 2px solid rgba(255,255,255,${isSelected ? "0.95" : "0.7"});
        box-shadow: 0 0 ${isSelected ? "18px" : "8px"} ${accentColor}99,
                    0 0 ${isSelected ? "36px" : "16px"} ${accentColor}44;
        transition: all 200ms cubic-bezier(0.23,1,0.32,1);
      `;

      wrap.appendChild(label);
      wrap.appendChild(dot);

      // Show label on hover
      wrap.addEventListener("mouseenter", () => {
        label.style.opacity = "1";
        label.style.transform = "translateY(0)";
        dot.style.transform = "scale(1.5)";
      });
      wrap.addEventListener("mouseleave", () => {
        if (!isSelected) {
          label.style.opacity = "0";
          label.style.transform = "translateY(4px)";
        }
        dot.style.transform = "scale(1)";
      });
      wrap.addEventListener("click", (e) => {
        e.stopPropagation();
        handleSelectPlace(place);
      });

      const marker = new mapboxgl.Marker({ element: wrap, anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [mapLoaded, activeRegion, activeSubRegion, selectedPlaceId, treks, handleSelectPlace, activeRegionId]);

  if (!mapboxToken) {
    return (
      <div className="w-full h-[500px] rounded-3xl bg-card border border-foreground/[0.08] flex items-center justify-center text-center p-10">
        <div>
          <Mountain className="w-12 h-12 text-primary mx-auto mb-4 opacity-40" />
          <p className="text-foreground/50 text-sm font-mono">Add <code className="text-primary">NEXT_PUBLIC_MAPBOX_TOKEN</code> to .env.local</p>
        </div>
      </div>
    );
  }

  const currentAccent = activeRegionId ? (TERRITORY_ACCENT[activeRegionId] ?? "#3B82F6") : "#3B82F6";

  return (
    <div className="relative w-full h-[720px] lg:h-[820px] rounded-2xl overflow-hidden border border-white/8 shadow-product bg-[#04080c] select-none">

      {/* ── Map canvas ────────────────────────────────────────── */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* ── Breadcrumb top-left ────────────────────────────────── */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[rgba(4,8,18,0.88)] backdrop-blur-xl border border-white/10 px-3 py-2 rounded-xl text-[11px] font-medium shadow-xl">
        <button onClick={handleReset} className={`transition-colors ${!activeRegionId ? "text-primary font-bold" : "text-white/55 hover:text-white"}`}>
          Atlas
        </button>
        {activeRegion && (
          <>
            <ChevronRight className="w-3 h-3 text-white/25" />
            <button onClick={() => handleRegion(activeRegion.id)} className={`transition-colors ${activeRegionId && !activeSubRegionId ? "font-bold" : "text-white/55 hover:text-white"}`} style={{ color: !activeSubRegionId ? currentAccent : undefined }}>
              {activeRegion.name}
            </button>
          </>
        )}
        {activeSubRegion && (
          <>
            <ChevronRight className="w-3 h-3 text-white/25" />
            <button onClick={() => handleSubRegion(activeSubRegion.id)} className="text-white/90 font-semibold hover:text-white transition-colors" style={{ color: currentAccent }}>
              {activeSubRegion.name}
            </button>
          </>
        )}
        {activeRegionId && (
          <button onClick={handleReset} title="Reset" className="ml-1 pl-2 border-l border-white/10 text-white/35 hover:text-white/80 transition-colors">
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          LEVEL 0 — Territory Selection
          Only shown when NO region is selected
      ═══════════════════════════════════════════════════════════ */}
      {!activeRegionId && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-5">
          <div className="flex flex-wrap justify-center gap-2">
            {himalayaAtlas.map((region) => {
              const accent = TERRITORY_ACCENT[region.id] ?? "#3B82F6";
              return (
                <button
                  key={region.id}
                  onClick={() => handleRegion(region.id)}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold text-white/90 hover:text-white transition-all duration-200"
                  style={{
                    background: "rgba(4,8,18,0.88)",
                    backdropFilter: "blur(16px)",
                    border: `1px solid ${accent}33`,
                    boxShadow: `0 0 20px ${accent}20`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = `${accent}88`;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 30px ${accent}40`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = `${accent}33`;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px ${accent}20`;
                  }}
                >
                  <span className="text-lg">{region.emoji}</span>
                  <span>{region.name}</span>
                  <span className="text-[10px] font-mono opacity-50">({region.subregions.reduce((a, s) => a + s.places.length, 0)})</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          LEVEL 1 — Valley Selection
          Shown when a region is active but no subregion
      ═══════════════════════════════════════════════════════════ */}
      {activeRegion && !activeSubRegionId && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-5">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-white/60 hover:text-white transition-all"
              style={{ background: "rgba(4,8,18,0.88)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
            {activeRegion.subregions.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubRegion(sub.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/85 hover:text-white transition-all"
                style={{
                  background: "rgba(4,8,18,0.88)",
                  backdropFilter: "blur(16px)",
                  border: `1px solid ${currentAccent}30`,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${currentAccent}70`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${currentAccent}30`; }}
              >
                {sub.name}
                <span className="font-mono text-[10px] opacity-45">({sub.places.length})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          LEVEL 2 — Place List Sidebar (desktop)
          Shown when a valley is selected, no place focused
      ═══════════════════════════════════════════════════════════ */}
      {activeSubRegion && !selectedPlaceId && (
        <div className="absolute top-16 right-4 bottom-4 w-64 z-20 hidden md:flex flex-col rounded-2xl overflow-hidden"
          style={{ background: "rgba(4,8,18,0.90)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.09)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <span className="text-xs font-bold text-white">{activeSubRegion.name}</span>
            <button
              onClick={() => handleRegion(activeRegion!.id)}
              className="text-[10px] font-mono text-white/45 hover:text-white/80 transition-colors flex items-center gap-0.5"
            >
              <ChevronLeft className="w-3 h-3" /> Valleys
            </button>
          </div>
          {/* List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeSubRegion.places.map((place) => (
              <button
                key={place.id}
                onClick={() => handleSelectPlace(place)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left group transition-all"
                style={{ border: "1px solid transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${currentAccent}30`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                }}
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white/85 group-hover:text-white truncate transition-colors">{place.name}</div>
                  {place.elevation && <div className="text-[10px] font-mono mt-0.5" style={{ color: currentAccent }}>{place.elevation}</div>}
                </div>
                <ChevronRight className="w-3 h-3 text-white/25 group-hover:text-white/60 flex-shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          LEVEL 3 — Expedition Briefing Card (focused)
          ONE card at a time — covers bottom of map when open
      ═══════════════════════════════════════════════════════════ */}
      {selectedPlace && selectedPlaceLocation && (
        <div
          className="absolute inset-x-0 bottom-0 z-30 p-4"
          style={{ background: "linear-gradient(to top, rgba(4,8,18,0.98) 70%, transparent)" }}
        >
          <div
            className="relative mx-auto max-w-lg rounded-2xl p-5 overflow-hidden"
            style={{
              background: "rgba(8,14,26,0.97)",
              backdropFilter: "blur(24px)",
              border: `1px solid ${currentAccent}40`,
              boxShadow: `0 0 60px ${currentAccent}20, 0 8px 40px rgba(0,0,0,0.7)`,
            }}
          >
            {/* Ambient glow top */}
            <div
              className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${currentAccent}18, transparent 70%)` }}
            />

            {/* Close */}
            <button
              onClick={() => setSelectedPlaceId(null)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Type + Region */}
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ color: currentAccent, background: `${currentAccent}18`, border: `1px solid ${currentAccent}35` }}
              >
                {selectedPlace.type}
              </span>
              <span className="text-[10px] text-white/40 font-mono">{selectedPlaceLocation.subRegionName} · {selectedPlaceLocation.regionName}</span>
            </div>

            {/* Name */}
            <h3 className="text-xl font-display font-bold text-white mb-3 relative z-10 leading-tight">
              {selectedPlace.name}
            </h3>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-3 mb-4 relative z-10">
              {selectedPlace.elevation && (
                <div className="flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5" style={{ color: currentAccent }} />
                  <span className="text-xs font-mono text-white/70">{selectedPlace.elevation}</span>
                </div>
              )}
              {selectedPlace.difficulty && (
                <span
                  className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full"
                  style={{ color: currentAccent, background: `${currentAccent}15`, border: `1px solid ${currentAccent}30` }}
                >
                  {selectedPlace.difficulty}
                </span>
              )}
              {selectedPlace.duration && (
                <span className="text-xs font-mono text-white/50">{selectedPlace.duration}</span>
              )}
              {selectedPlace.bestSeason && (
                <span className="text-xs font-mono text-white/40">Best: {selectedPlace.bestSeason}</span>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={handleOpenPlace}
              disabled={navigating}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold tracking-wide transition-all relative z-10"
              style={{
                background: currentAccent,
                color: "#fff",
                opacity: navigating ? 0.7 : 1,
                boxShadow: `0 4px 20px ${currentAccent}50`,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = navigating ? "0.7" : "1"; }}
            >
              {navigating ? "Opening…" : "Open Expedition Guide"}
              {!navigating && <ArrowUpRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
