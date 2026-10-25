"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Mountain,
  RotateCcw,
  ArrowUpRight,
  X,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Navigation as NavigationIcon,
  Orbit,
} from "lucide-react";
import { Trek } from "@/data/types";
import {
  himalayaAtlas,
  HimalayaPlace,
  PlaceLocation,
  placeLocationIndex,
} from "@/data/atlas";
import { routesMap, getRouteData } from "@/data/routes";
import { peaks } from "@/data/peaks";
import { shortestAngleDiff } from "@/lib/camera-math";
import { registerPulsingBeacon } from "@/lib/mapbox-canvas-beacon";
import {
  MapExplorerDrawer,
  VERIFIED_ROUTES_CATALOG,
  VerifiedRouteMeta,
} from "./MapExplorerDrawer";

interface GlobalMapClientProps {
  treks: Trek[];
  initialFocusId?: string | null;
}

/* ── Initial Camera State (Commanding 3D Himalayan Ridge Immersion) ──────── */
const INIT_CAM = { lat: 32.24, lng: 77.18, zoom: 9.8, pitch: 72, bearing: 12 };

/* ── Territory Accents ───────────────────────────────────────────────────── */
const TERRITORY_ACCENT: Record<string, string> = {
  "jammu-kashmir":    "#3B82F6", // Glacier Blue
  "himachal-pradesh": "#F59E0B", // Amber Gold
  ladakh:             "#8B5CF6", // High Alpine Purple
  uttarakhand:        "#0D9488", // Emerald Pine
};

/* ── Territory Camera Presets: South-Offset Northward Look ────────────────── */
const TERRITORY_CAM: Record<string, [number, number, number, number, number]> = {
  // [lat, lng, zoom, pitch, bearing]
  "jammu-kashmir":    [32.30, 74.80, 8.0, 75, 10],  // South of Pir Panjal, looking north across Kashmir valley
  "himachal-pradesh": [30.90, 77.10, 8.2, 75, 5],   // Foothills south of Kalka, looking north into Pir Panjal & Great Himalayas
  ladakh:             [32.80, 77.50, 7.8, 75, 355], // South looking north across Zanskar & Indus to Karakoram
  uttarakhand:        [29.40, 79.00, 8.0, 75, 5],   // South looking north into Nanda Devi & Kedarnath massifs
};

/* ── Subregion / Valley Precision Camera Targets ─────────────────────────── */
const SUBREGION_CAM: Record<string, [number, number, number, number, number]> = {
  jammu:               [32.80, 75.28, 10.0, 68, 5],
  kashmir:             [33.60, 74.90, 10.0, 68, 5],
  chamba:              [32.25, 76.25, 10.0, 68, 8],
  kangra:              [31.90, 76.35, 10.2, 68, 6],
  kullu:               [31.80, 77.15, 10.2, 70, 5],
  mandi:               [31.30, 76.93, 10.5, 68, 5],
  "lahaul-spiti":      [31.80, 77.80,  9.6, 68, 5],
  kinnaur:             [31.10, 78.35, 10.5, 68, 15],
  garhwal:             [30.20, 79.10, 10.0, 68, 5],
  chamoli:             [30.20, 79.50, 10.0, 68, 8],
  rudraprayag:         [30.20, 79.05, 10.2, 68, 5],
  uttarkashi:          [30.50, 78.55,  9.8, 68, 6],
  "pauri-garhwal":     [29.70, 78.80, 10.1, 68, 5],
  "tehri-garhwal":     [30.00, 78.45, 10.1, 68, 8],
  dehradun:            [30.10, 78.05, 10.2, 68, 4],
  haridwar:            [29.75, 78.15, 10.4, 66, 2],
  pithoragarh:         [29.70, 80.20,  9.8, 68, 8],
  bageshwar:           [29.70, 79.80, 10.1, 68, 6],
  almora:              [29.35, 79.65, 10.2, 68, 4],
  nainital:            [29.15, 79.35, 10.2, 68, 5],
  champawat:           [29.10, 80.05, 10.2, 68, 6],
  "udham-singh-nagar": [28.70, 79.80, 10.4, 65, 0],
  leh:                 [33.50, 77.58,  9.5, 68, 355],
  kargil:              [34.00, 76.15,  9.8, 68, 8],
  nubra:               [34.20, 77.30,  9.6, 68, 355],
  drass:               [34.10, 75.75, 10.0, 68, 6],
  zanskar:             [33.10, 76.98,  9.5, 68, 10],
};

/* ── Colour per Adventure Type ──────────────────────────────────────────── */
const TYPE_COLOR: Record<string, string> = {
  trek: "#10B981",       // Alpine Emerald Green
  peak: "#F59E0B",       // Summit Gold
  lake: "#06B6D4",       // Glacial Cyan Tarn
  spiritual: "#A855F7",  // High Alpine Violet
  scenic: "#38BDF8",     // Sky Blue
  adventure: "#F97316",  // Expedition Orange
  road: "#EAB308",       // High Pass Amber
};

/* ── Category Icon SVG Generator ────────────────────────────────────────── */
function getCategoryIconSvg(type: string, color: string): string {
  switch (type) {
    case "peak":
      return `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`;
    case "trek":
      return `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.2"/><path d="m9 20 3-6 3 6"/><path d="m6 17 4-5-2-4 4-2 3 3"/></svg>`;
    case "lake":
      return `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9c2 0 3-1.5 5-1.5s3 1.5 5 1.5 3-1.5 5-1.5 3 1.5 5 1.5"/><path d="M2 15c2 0 3-1.5 5-1.5s3 1.5 5 1.5 3-1.5 5-1.5 3 1.5 5 1.5"/></svg>`;
    case "spiritual":
      return `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20M4 20V10l8-6 8 6v10M9 20v-6h6v6"/></svg>`;
    case "scenic":
      return `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-6.5 10-6.5 10 6.5 10 6.5-3.5 6.5-10 6.5-10-6.5Z"/><circle cx="12" cy="12" r="2.8"/></svg>`;
    case "road":
    default:
      return `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><polygon points="16 8 13.5 13.5 8 16 10.5 10.5 16 8"/></svg>`;
  }
}

/* ── DOM Marker Builder ─────────────────────────────────────────────────── */
function buildPlaceMarkerEl(
  place: HimalayaPlace,
  isSelected = false,
  isCompact = false
): HTMLElement {
  const isPeak = place.type === "peak";
  const color = isPeak ? "#F59E0B" : (TYPE_COLOR[place.type] ?? "#38BDF8");
  const el = document.createElement("div");
  el.className = "group pointer-events-auto cursor-pointer place-marker-node";
  el.setAttribute("data-place-id", place.id);
  el.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
    cursor: pointer;
    transition: opacity 0.2s ease-out;
    z-index: ${isSelected ? "500" : isPeak ? "60" : isCompact ? "15" : "35"};
  `;

  const rawEle = place.elevation || (place as unknown as { altitude?: string }).altitude || "";
  const eleClean = rawEle ? rawEle.replace(/\s*m$/i, "") + "m" : "";

  const capsule = document.createElement("div");
  capsule.className = "place-marker-capsule";
  capsule.style.cssText = `
    display: flex;
    align-items: center;
    gap: ${isCompact && !isSelected ? "0px" : "4.5px"};
    padding: ${isSelected ? "3px 9px 3px 6px" : isCompact ? "3px" : "2px 7px 2px 4px"};
    background: ${isSelected ? "rgba(6, 12, 26, 0.96)" : isPeak ? "rgba(12, 10, 4, 0.92)" : "rgba(6, 10, 20, 0.90)"};
    border: 1px solid ${isSelected ? "#38BDF8" : isPeak ? "rgba(245, 158, 11, 0.45)" : "rgba(255, 255, 255, 0.12)"};
    border-radius: 9999px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: ${
      isSelected
        ? "0 0 20px rgba(56, 189, 248, 0.45), 0 8px 16px rgba(0,0,0,0.85)"
        : isPeak
        ? "0 0 14px rgba(245, 158, 11, 0.2), 0 4px 12px rgba(0,0,0,0.75)"
        : "0 4px 12px rgba(0,0,0,0.7)"
    };
    transform: ${isSelected ? "scale(1.06)" : "scale(1)"};
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  const iconBox = document.createElement("div");
  iconBox.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    border-radius: 9999px;
    background: ${color}22;
    border: 1px solid ${color}55;
    flex-shrink: 0;
  `;
  iconBox.innerHTML = getCategoryIconSvg(place.type, color);

  const contentWrapper = document.createElement("div");
  contentWrapper.style.cssText = `
    display: flex;
    align-items: center;
    gap: 4px;
    overflow: hidden;
    white-space: nowrap;
    transition: max-width 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease;
    max-width: ${isCompact && !isSelected ? "0px" : "180px"};
    opacity: ${isCompact && !isSelected ? "0" : "1"};
    pointer-events: ${isCompact && !isSelected ? "none" : "auto"};
  `;

  const label = document.createElement("span");
  label.style.cssText = `
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: ${isSelected ? "#38BDF8" : isPeak ? "#FDE68A" : "#F1F5F9"};
    white-space: nowrap;
    max-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
  label.textContent = place.name;
  contentWrapper.appendChild(label);

  if (eleClean) {
    const eleTag = document.createElement("span");
    eleTag.style.cssText = `
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 8px;
      font-weight: 600;
      color: ${isPeak ? "#F59E0B" : color};
      background: ${isPeak ? "rgba(245, 158, 11, 0.15)" : `${color}15`};
      padding: 0.5px 3.5px;
      border-radius: 3px;
      border: 1px solid ${isPeak ? "rgba(245, 158, 11, 0.35)" : `${color}35`};
      letter-spacing: 0.02em;
    `;
    eleTag.textContent = eleClean;
    contentWrapper.appendChild(eleTag);
  }

  capsule.appendChild(iconBox);
  capsule.appendChild(contentWrapper);

  // Micro pointer (4px)
  const pointer = document.createElement("div");
  pointer.style.cssText = `
    width: 0;
    height: 0;
    border-left: 3.5px solid transparent;
    border-right: 3.5px solid transparent;
    border-top: 4px solid ${isSelected ? "#38BDF8" : isPeak ? "#F59E0B" : "rgba(255, 255, 255, 0.3)"};
    margin-top: -1px;
    filter: drop-shadow(0 2px 3px rgba(0,0,0,0.8));
    pointer-events: none;
  `;

  el.appendChild(capsule);
  el.appendChild(pointer);

  el.addEventListener("mouseenter", () => {
    el.style.zIndex = "9999";
    capsule.style.borderColor = "#FFFFFF";
    capsule.style.transform = "scale(1.08) translateY(-2px)";
    if (isCompact && !isSelected) {
      capsule.style.gap = "4.5px";
      capsule.style.padding = "2px 7px 2px 4px";
      contentWrapper.style.maxWidth = "180px";
      contentWrapper.style.opacity = "1";
    }
  });

  el.addEventListener("mouseleave", () => {
    el.style.zIndex = isSelected ? "500" : isPeak ? "60" : isCompact ? "15" : "35";
    capsule.style.borderColor = isSelected ? "#38BDF8" : isPeak ? "rgba(245, 158, 11, 0.45)" : "rgba(255, 255, 255, 0.12)";
    capsule.style.transform = isSelected ? "scale(1.06)" : "scale(1)";
    if (isCompact && !isSelected) {
      capsule.style.gap = "0px";
      capsule.style.padding = "3px";
      contentWrapper.style.maxWidth = "0px";
      contentWrapper.style.opacity = "0";
    }
  });

  return el;
}

/* ── Flat list of all places ────────────────────────────────────────────── */
const ALL_PLACES: HimalayaPlace[] = himalayaAtlas.flatMap((r) =>
  r.subregions.flatMap((s) => s.places)
);

export default function GlobalMapClient({ treks: _treks, initialFocusId }: GlobalMapClientProps) {
  void _treks;
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const placeMarkerNodesRef = useRef<{ el: HTMLElement; lng: number; lat: number }[]>([]);
  const activeTrailIdsRef = useRef<Set<string>>(new Set());
  const flowTimerRef = useRef<NodeJS.Timeout | null>(null);

  const initialPlaceLoc = initialFocusId ? placeLocationIndex.get(initialFocusId) : null;

  // ── Component State ───────────────────────────────────────────────────
  const [activeRegionId, setActiveRegionId]       = useState<string | null>(() => initialPlaceLoc?.regionId ?? null);
  const [activeSubRegionId, setActiveSubRegionId] = useState<string | null>(() => initialPlaceLoc?.subRegionId ?? null);
  const [selectedPlaceId, setSelectedPlaceId]     = useState<string | null>(() => initialFocusId ?? null);
  const [hoveredEntityId, setHoveredEntityId]     = useState<string | null>(null);
  const [currentZoom, setCurrentZoom]             = useState<number>(INIT_CAM.zoom);
  const [isDrawerOpen, setIsDrawerOpen]           = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [isFullscreen, setIsFullscreen]           = useState(false);
  const [mapLoaded, setMapLoaded]                 = useState(false);
  const [navigating, setNavigating]               = useState(false);

  const [isOrbiting, setIsOrbiting]               = useState(false);
  const orbitAnimRef = useRef<number | null>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // ── Derived Data ──────────────────────────────────────────────────────
  const activeRegion = useMemo(
    () => himalayaAtlas.find((r) => r.id === activeRegionId) ?? null,
    [activeRegionId]
  );

  const activeSubRegion = useMemo(
    () => activeRegion?.subregions.find((s) => s.id === activeSubRegionId) ?? null,
    [activeRegion, activeSubRegionId]
  );

  const selectedPlace = useMemo(
    () => (selectedPlaceId ? (ALL_PLACES.find((p) => p.id === selectedPlaceId) ?? null) : null),
    [selectedPlaceId]
  );

  const selectedRouteMeta: VerifiedRouteMeta | null = useMemo(() => {
    if (!selectedPlaceId) return null;
    return VERIFIED_ROUTES_CATALOG.find((r) => r.id === selectedPlaceId) ?? null;
  }, [selectedPlaceId]);

  const selectedPlaceLocation: PlaceLocation | null = useMemo(
    () => (selectedPlaceId ? (placeLocationIndex.get(selectedPlaceId) ?? null) : null),
    [selectedPlaceId]
  );

  const currentAccent = activeRegionId
    ? (TERRITORY_ACCENT[activeRegionId] ?? "#3B82F6")
    : "#3B82F6";

  // Filtered places matching active scope
  const scopedPlaces = useMemo(() => {
    if (activeSubRegion) {
      return activeSubRegion.places;
    }
    if (activeRegion) {
      return activeRegion.subregions.flatMap((s) => s.places);
    }
    return ALL_PLACES;
  }, [activeRegion, activeSubRegion]);

  // Level-of-Detail (LOD) Scoped Display Places: Prevents marker overcrowding
  const displayPlaces = useMemo(() => {
    if (activeSubRegion) {
      return scopedPlaces.slice(0, 30);
    }
    // Wide Overview (Zoom < 9.2): Only major summits (>= 5,000m) and selected place
    if (currentZoom < 9.2) {
      return scopedPlaces
        .filter((p) => {
          if (p.id === selectedPlaceId) return true;
          if (p.type === "peak") {
            const eleNum = parseInt((p.elevation || "").replace(/\D/g, "") || "0", 10);
            return eleNum >= 5000;
          }
          return false;
        })
        .slice(0, 16);
    }
    // Mid Zoom (9.2 to 11.0): Peaks, high tarns, passes, and main trailheads
    if (currentZoom < 11.0) {
      return scopedPlaces
        .filter((p) => {
          if (p.id === selectedPlaceId) return true;
          return p.type === "peak" || p.type === "lake" || p.type === "road" || p.type === "trek";
        })
        .slice(0, 24);
    }
    // Close Zoom (>= 11.0): Full local fidelity
    return scopedPlaces.slice(0, 38);
  }, [scopedPlaces, currentZoom, activeSubRegion, selectedPlaceId]);

  // ── Cinematic 3D Camera Controls ──────────────────────────────────────
  const flyTo = useCallback(
    (
      lat: number,
      lng: number,
      zoom: number,
      pitch = 68,
      bearing = 0,
      duration = 2200,
      onComplete?: () => void
    ) => {
      const map = mapRef.current;
      if (!map) return;

      if (orbitAnimRef.current) {
        cancelAnimationFrame(orbitAnimRef.current);
        orbitAnimRef.current = null;
        setIsOrbiting(false);
      }

      if (onComplete) {
        map.once("moveend", onComplete);
      }

      const curBearing = map.getBearing();
      const shortestBearing = curBearing + shortestAngleDiff(bearing, curBearing);
      const safePitch = Math.min(75, Math.max(0, pitch));

      map.flyTo({
        center: [lng, lat],
        zoom,
        pitch: safePitch,
        bearing: shortestBearing,
        duration,
        curve: 1.42,
        speed: 0.9,
        essential: true,
      });
    },
    []
  );

  // 360° Panoramic Orbit around current center point
  const toggleOrbit = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    if (isOrbiting) {
      if (orbitAnimRef.current) {
        cancelAnimationFrame(orbitAnimRef.current);
        orbitAnimRef.current = null;
      }
      setIsOrbiting(false);
    } else {
      setIsOrbiting(true);
      let lastTime = performance.now();
      const rotate = (time: number) => {
        if (!mapRef.current) return;
        const deltaSec = (time - lastTime) / 1000;
        lastTime = time;
        const currentBearing = mapRef.current.getBearing();
        mapRef.current.setBearing((currentBearing + 7.0 * deltaSec) % 360);
        orbitAnimRef.current = requestAnimationFrame(rotate);
      };
      orbitAnimRef.current = requestAnimationFrame(rotate);
    }
  }, [isOrbiting]);

  // Perspective Tilt toggle (3D Ridge View vs 2D Plan View)
  const togglePerspective = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const currentPitch = map.getPitch();
    const nextPitch = currentPitch > 50 ? 0 : 72;
    map.easeTo({ pitch: nextPitch, duration: 900 });
  }, []);

  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn({ duration: 300 });
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut({ duration: 300 });
  }, []);

  const handleResetNorth = useCallback(() => {
    mapRef.current?.resetNorthPitch({ duration: 800 });
  }, []);

  // Fullscreen management
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      const isCurrentlyFs = Boolean(
        document.fullscreenElement ||
          (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );

      if (!isCurrentlyFs) {
        const el = containerRef.current as HTMLElement & {
          webkitRequestFullscreen?: () => Promise<void>;
        };
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        const doc = document as Document & {
          webkitExitFullscreen?: () => Promise<void>;
        };
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  const handleResetAtlas = useCallback(() => {
    setActiveRegionId(null);
    setActiveSubRegionId(null);
    setSelectedPlaceId(null);
    flyTo(INIT_CAM.lat, INIT_CAM.lng, INIT_CAM.zoom, INIT_CAM.pitch, INIT_CAM.bearing, 2400);
  }, [flyTo]);

  const handleRegionSelect = useCallback(
    (regionId: string) => {
      setActiveRegionId(regionId);
      setActiveSubRegionId(null);
      setSelectedPlaceId(null);
      const cam = TERRITORY_CAM[regionId] ?? [INIT_CAM.lat, INIT_CAM.lng, INIT_CAM.zoom, INIT_CAM.pitch, 0];
      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 2200);
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
      if (place.coords && place.coords.length === 2) {
        const heading = 5;
        const rad = (heading * Math.PI) / 180;
        const dist = 0.022;
        const camLat = place.coords[0] - dist * Math.cos(rad);
        const camLng = place.coords[1] - dist * Math.sin(rad);

        flyTo(camLat, camLng, 13.5, 70, heading, 2000);
      }
    },
    [flyTo]
  );

  const handleSelectRoute = useCallback(
    (routeId: string) => {
      setSelectedPlaceId(routeId);
      const routeData = getRouteData(routeId);
      const loc = placeLocationIndex.get(routeId);
      if (loc) {
        setActiveRegionId(loc.regionId);
        setActiveSubRegionId(loc.subRegionId);
      }

      // If route has coordinates, focus on the middle/apex point
      if (routeData?.line?.coordinates && routeData.line.coordinates.length > 0) {
        const coords = routeData.line.coordinates;
        const midPoint = coords[Math.floor(coords.length / 2)];
        const [rLng, rLat] = midPoint;
        const heading = 8;
        const rad = (heading * Math.PI) / 180;
        const dist = 0.025;
        const camLat = rLat - dist * Math.cos(rad);
        const camLng = rLng - dist * Math.sin(rad);

        flyTo(camLat, camLng, 13.2, 70, heading, 2200);
      } else {
        const place = ALL_PLACES.find((p) => p.id === routeId);
        if (place) handleSelectPlace(place);
      }
    },
    [flyTo, handleSelectPlace]
  );

  const handleCloseSelection = useCallback(() => {
    setSelectedPlaceId(null);
    if (activeSubRegionId) {
      const cam = SUBREGION_CAM[activeSubRegionId] ?? [31.8, 77.2, 10.0, 68, 5];
      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 1800);
    } else if (activeRegionId) {
      const cam = TERRITORY_CAM[activeRegionId] ?? [INIT_CAM.lat, INIT_CAM.lng, INIT_CAM.zoom, INIT_CAM.pitch, 0];
      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 1800);
    } else {
      handleResetAtlas();
    }
  }, [activeSubRegionId, activeRegionId, flyTo, handleResetAtlas]);

  const handleOpenDossier = useCallback(() => {
    if (selectedPlaceLocation) {
      setNavigating(true);
      router.push(selectedPlaceLocation.href);
      return;
    }
    if (selectedPlaceId) {
      setNavigating(true);
      router.push(`/explore/himachal-pradesh/kullu/${selectedPlaceId}`);
    }
  }, [selectedPlaceLocation, selectedPlaceId, router]);

  // Keyboard shortcut listener ('F' for fullscreen, 'Esc' to close selection)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "Escape") {
        if (selectedPlaceId) {
          e.preventDefault();
          handleCloseSelection();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFullscreen, selectedPlaceId, handleCloseSelection]);

  // ── Map Initialization ────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || !mapboxToken || mapRef.current) return;
    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [INIT_CAM.lng, INIT_CAM.lat],
      zoom: INIT_CAM.zoom,
      pitch: INIT_CAM.pitch,
      bearing: INIT_CAM.bearing,
      maxPitch: 85,
      pitchWithRotate: true,
      projection: "globe",
      scrollZoom: true,
      doubleClickZoom: true,
      dragRotate: true,
      touchZoomRotate: true,
      touchPitch: true,
      attributionControl: false,
      antialias: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      // 3D DEM Terrain
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.25 });

      // Atmospheric Himalayan Midnight Fog & Skybox
      map.setFog({
        range: [0.6, 12.0],
        color: "#050914",
        "horizon-blend": 0.18,
        "high-color": "#020409",
        "space-color": "#010206",
        "star-intensity": 0.85,
      });

      // Hide clutter default vector labels
      const layers = map.getStyle()?.layers || [];
      for (const layer of layers) {
        if (
          layer.type === "symbol" ||
          layer.id.includes("road") ||
          layer.id.includes("label") ||
          layer.id.includes("admin") ||
          layer.id.includes("border")
        ) {
          try {
            map.setLayoutProperty(layer.id, "visibility", "none");
          } catch {}
        }
      }

      // Register GPU pulsing radar beacon
      registerPulsingBeacon(map, "global-radar-beacon", {
        size: 90,
        color: "#22D3EE",
        coreColor: "#FFFFFF",
      });

      // Pause orbit on manual user interaction
      const cancelOrbit = () => {
        setIsOrbiting(false);
        if (orbitAnimRef.current) {
          cancelAnimationFrame(orbitAnimRef.current);
          orbitAnimRef.current = null;
        }
      };
      map.on("mousedown", cancelOrbit);
      map.on("touchstart", cancelOrbit);
      map.on("wheel", cancelOrbit);

      // Pre-load initial focus if deep link provided
      if (initialFocusId) {
        const target = ALL_PLACES.find((p) => p.id === initialFocusId);
        if (target?.coords && target.coords.length === 2) {
          map.flyTo({
            center: [target.coords[1], target.coords[0] - 0.03],
            zoom: 13.5,
            pitch: 70,
            bearing: 8,
            duration: 2000,
            essential: true,
          });
        }
      }

      // Track zoom level for dynamic Level-of-Detail (LOD)
      map.on("zoomend", () => {
        setCurrentZoom(map.getZoom());
      });

      setMapLoaded(true);
    });

    return () => {
      if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
      if (flowTimerRef.current) clearInterval(flowTimerRef.current);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [mapboxToken, initialFocusId]);

  // ── Pre-Load All 10 Verified Route GeoJSON Lines on Map ────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Ingest all 10 verified routes into native WebGL LineString layers
    Object.entries(routesMap).forEach(([slug, routeData]) => {
      if (!routeData?.line?.coordinates || routeData.line.coordinates.length < 2) return;

      const sId = `source-${slug}`;
      const lId = `layer-${slug}`;
      const gId = `glow-${slug}`;
      const fId = `flow-${slug}`;

      const rawCoords = routeData.line.coordinates as [number, number, number][];
      const lngLatCoords: [number, number][] = rawCoords.map(([ln, la]) => [ln, la]);

      // Remove existing if any
      if (map.getLayer(fId)) map.removeLayer(fId);
      if (map.getLayer(lId)) map.removeLayer(lId);
      if (map.getLayer(gId)) map.removeLayer(gId);
      if (map.getSource(sId)) map.removeSource(sId);

      activeTrailIdsRef.current.add(slug);

      map.addSource(sId, {
        type: "geojson",
        lineMetrics: true,
        data: {
          type: "Feature",
          properties: { id: slug },
          geometry: {
            type: "LineString",
            coordinates: lngLatCoords,
          },
        },
      });

      // Ambient wide ground glow
      map.addLayer({
        id: gId,
        type: "line",
        source: sId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#38BDF8",
          "line-width": 8,
          "line-opacity": 0.45,
          "line-blur": 4,
        },
      });

      // 4-stop altitude gradient path
      map.addLayer({
        id: lId,
        type: "line",
        source: sId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-width": 3.2,
          "line-gradient": [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0.0,  "#06B6D4", // Valley trailhead cyan
            0.45, "#3B82F6", // Pine forest blue
            0.75, "#F59E0B", // High pass amber
            1.0,  "#FDE047", // Summit gold
          ],
          "line-opacity": 0.95,
        },
      });

      // Marching-ants directional flow layer
      map.addLayer({
        id: fId,
        type: "line",
        source: sId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#FFFFFF",
          "line-width": 1.6,
          "line-dasharray": [0, 4, 3],
          "line-opacity": 0.75,
        },
      });

      // Click on polyline selects route
      map.on("click", lId, (e) => {
        e.originalEvent.stopPropagation();
        handleSelectRoute(slug);
      });
    });
  }, [mapLoaded, handleSelectRoute]);

  // ── Marching-Ants Cycling Animation ───────────────────────────────────
  useEffect(() => {
    let flowStep = 0;
    const flowSequence = [
      [0, 4, 3],
      [1, 4, 2],
      [2, 4, 1],
      [3, 4, 0],
      [0, 1, 3, 3],
      [0, 2, 3, 2],
      [0, 3, 3, 1],
    ];

    flowTimerRef.current = setInterval(() => {
      flowStep = (flowStep + 1) % flowSequence.length;
      if (!mapRef.current) return;
      activeTrailIdsRef.current.forEach((slug) => {
        const flowLayerId = `flow-${slug}`;
        if (mapRef.current?.getLayer(flowLayerId)) {
          try {
            mapRef.current.setPaintProperty(flowLayerId, "line-dasharray", flowSequence[flowStep]);
          } catch {}
        }
      });
    }, 120);

    return () => {
      if (flowTimerRef.current) clearInterval(flowTimerRef.current);
    };
  }, []);

  // ── Hover & Selection Visual Feedback on Trail Lines ──────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    activeTrailIdsRef.current.forEach((slug) => {
      const isHighlighted = hoveredEntityId === slug || selectedPlaceId === slug;
      const gId = `glow-${slug}`;
      const lId = `layer-${slug}`;

      if (map.getLayer(gId)) {
        try {
          map.setPaintProperty(gId, "line-width", isHighlighted ? 16 : 8);
          map.setPaintProperty(gId, "line-opacity", isHighlighted ? 0.85 : 0.45);
          map.setPaintProperty(gId, "line-color", isHighlighted ? "#F59E0B" : "#38BDF8");
        } catch {}
      }
      if (map.getLayer(lId)) {
        try {
          map.setPaintProperty(lId, "line-width", isHighlighted ? 4.8 : 3.2);
        } catch {}
      }
    });
  }, [hoveredEntityId, selectedPlaceId, mapLoaded]);

  // ── Place Markers Rendering ───────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clean existing DOM markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    placeMarkerNodesRef.current = [];

    // Render LOD-filtered places to prevent marker clumping
    displayPlaces.forEach((place) => {
      if (!place.coords || place.coords.length !== 2) return;
      const [lat, lng] = place.coords;
      const isSelected = selectedPlaceId === place.id;
      const isCompact = !isSelected && place.type !== "peak";

      const el = buildPlaceMarkerEl(place, isSelected, isCompact);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        handleSelectPlace(place);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.push(marker);
      placeMarkerNodesRef.current.push({ el, lng, lat });
    });
  }, [displayPlaces, selectedPlaceId, mapLoaded, handleSelectPlace]);

  // ── GPU Radar Beacon Synchronization ──────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const sourceId = "selected-place-beacon-source";
    const layerId = "selected-place-beacon-layer";

    let targetCoords: [number, number] | null = null;

    if (selectedPlace?.coords && selectedPlace.coords.length === 2) {
      targetCoords = [selectedPlace.coords[1], selectedPlace.coords[0]];
    } else if (selectedPlaceId) {
      const routeData = getRouteData(selectedPlaceId);
      if (routeData?.line?.coordinates && routeData.line.coordinates.length > 0) {
        const lastPt = routeData.line.coordinates[routeData.line.coordinates.length - 1];
        targetCoords = [lastPt[0], lastPt[1]];
      }
    }

    if (targetCoords) {
      const pointData: GeoJSON.Feature<GeoJSON.Point> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: targetCoords,
        },
      };

      const existingSource = map.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
      if (existingSource) {
        existingSource.setData(pointData);
      } else {
        try {
          map.addSource(sourceId, { type: "geojson", data: pointData });
          map.addLayer({
            id: layerId,
            type: "symbol",
            source: sourceId,
            layout: {
              "icon-image": "global-radar-beacon",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
          });
        } catch {}
      }
    } else {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {}
    }
  }, [selectedPlace, selectedPlaceId, mapLoaded]);

  if (!mapboxToken) {
    return (
      <div className="w-full h-full bg-[#03060d] flex items-center justify-center p-8 text-center">
        <div>
          <Mountain className="w-12 h-12 text-primary mx-auto mb-4 opacity-40" />
          <p className="text-white/60 text-sm font-mono">
            Missing <code className="text-primary font-bold">NEXT_PUBLIC_MAPBOX_TOKEN</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`map-canvas-container preserve-white-text relative w-full h-full overflow-hidden ${
        isFullscreen
          ? "fixed inset-0 z-[9999] rounded-none border-none shadow-none h-screen w-screen"
          : "rounded-none border-none shadow-none"
      } bg-[#03060d] select-none text-white`}
    >
      {/* ── 3D Map Canvas ────────────────────────────────────────── */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* ── Active Territory Indicator / Reset (Top Right) ─────── */}
      {activeRegion && (
        <div className="absolute top-4 sm:top-6 right-16 sm:right-20 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 bg-[#060a14]/90 backdrop-blur-2xl border border-white/12 px-3.5 py-2 rounded-2xl text-xs font-mono shadow-2xl animate-in fade-in">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: currentAccent }}
            />
            <span className="text-white font-medium">{activeRegion.name}</span>
            <button
              onClick={handleResetAtlas}
              title="Reset View to Western Himalayas"
              aria-label="Reset View"
              className="ml-1 pl-1.5 border-l border-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Left Collapsible Explorer Drawer ───────────────────────── */}
      <MapExplorerDrawer
        isOpen={isDrawerOpen}
        onToggleOpen={() => setIsDrawerOpen((prev) => !prev)}
        selectedId={selectedPlaceId}
        activeRegionId={activeRegionId}
        onSelectRoute={handleSelectRoute}
        onSelectPlace={handleSelectPlace}
        onSelectRegion={handleRegionSelect}
        onHoverEntity={setHoveredEntityId}
        peaks={peaks}
        allPlaces={ALL_PLACES}
      />

      {/* ── Minimalist Consolidated Camera Controls (Right Side Island) ── */}
      <div className="absolute right-3 sm:right-4 top-4 sm:top-6 z-20 flex flex-col bg-[#050914]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-1 shadow-2xl pointer-events-auto">
        {/* Reset North Compass */}
        <button
          onClick={handleResetNorth}
          title="Reset North & Pitch"
          aria-label="Reset North"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <NavigationIcon className="w-4 h-4 text-sky-400" />
        </button>

        {/* 3D / 2D Perspective Toggle */}
        <button
          onClick={togglePerspective}
          title="Toggle 3D Horizon vs 2D Plan View"
          aria-label="Toggle 3D View"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors text-[10px] font-mono font-bold border-t border-white/10 cursor-pointer"
        >
          3D
        </button>

        {/* 360° Panoramic Orbit */}
        <button
          onClick={toggleOrbit}
          title={isOrbiting ? "Pause 3D Orbit" : "Start 360° Orbit"}
          aria-label="Orbit 3D"
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors border-t border-white/10 cursor-pointer ${
            isOrbiting ? "text-amber-400 bg-amber-400/20" : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <Orbit className={`w-4 h-4 ${isOrbiting ? "animate-spin" : ""}`} />
        </button>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10 cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen (Esc or F)" : "Fullscreen Mode (F)"}
          aria-label="Fullscreen"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10 cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-sky-400" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Active Route Quick-Bar (Docked at Bottom Center) ───────── */}
      {(selectedPlace || selectedRouteMeta) && (
        <div className="absolute bottom-5 inset-x-3 sm:inset-x-0 sm:left-1/2 sm:-translate-x-1/2 z-30 pointer-events-none sm:w-[500px]">
          <div
            className="pointer-events-auto relative w-full rounded-2xl p-4 overflow-hidden border shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all animate-in fade-in slide-in-from-bottom-3 duration-300"
            style={{
              background: "rgba(6, 10, 20, 0.95)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: `${currentAccent}55`,
              boxShadow: `0 20px 50px rgba(0,0,0,0.85), 0 0 30px ${currentAccent}20, inset 0 1px 0 rgba(255,255,255,0.12)`,
            }}
          >
            {/* Top Accent Strip */}
            <div
              className="absolute top-0 inset-x-0 h-1 pointer-events-none"
              style={{
                background: `linear-gradient(to right, ${currentAccent}, #38BDF8, transparent)`,
              }}
            />

            {/* Header: Location & Close Button */}
            <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="text-[9.5px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md flex-shrink-0"
                  style={{
                    color: currentAccent,
                    background: `${currentAccent}18`,
                    border: `1px solid ${currentAccent}35`,
                  }}
                >
                  {selectedRouteMeta ? "VERIFIED GPS ROUTE" : selectedPlace?.type}
                </span>
                <span className="text-[11px] text-slate-400 font-mono truncate">
                  {selectedRouteMeta
                    ? `${selectedRouteMeta.valley} • ${selectedRouteMeta.region}`
                    : selectedPlaceLocation
                    ? `${selectedPlaceLocation.subRegionName} • ${selectedPlaceLocation.regionName}`
                    : "Himalayas"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCloseSelection}
                title="Dismiss (Esc)"
                aria-label="Dismiss selection"
                className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-display font-semibold text-white mb-2.5 truncate">
              {selectedRouteMeta ? selectedRouteMeta.name : selectedPlace?.name}
            </h3>

            {/* Key Telemetry Chips */}
            <div className="flex items-center gap-2 mb-3.5 font-mono text-xs">
              <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-200 border border-white/10 font-medium">
                ▲ {selectedRouteMeta ? selectedRouteMeta.maxAltitude : selectedPlace?.elevation || "Summit Apex"}
              </span>
              {selectedRouteMeta && (
                <>
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 border border-white/10">
                    {selectedRouteMeta.distance}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {selectedRouteMeta.difficulty}
                  </span>
                </>
              )}
              {selectedPlace?.difficulty && !selectedRouteMeta && (
                <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 border border-white/10">
                  {selectedPlace.difficulty}
                </span>
              )}
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-2 relative z-10">
              <button
                type="button"
                onClick={toggleOrbit}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer min-h-[38px] ${
                  isOrbiting
                    ? "bg-amber-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.6)]"
                    : "bg-white/10 text-slate-200 hover:bg-white/15 hover:text-white border border-white/15"
                }`}
              >
                <Orbit className={`w-3.5 h-3.5 ${isOrbiting ? "animate-spin" : "text-amber-400"}`} />
                <span>{isOrbiting ? "Orbiting 3D" : "360° Orbit"}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenDossier}
                disabled={navigating}
                className="flex-1 min-h-[38px] flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all group shadow-md cursor-pointer"
                style={{
                  background: currentAccent,
                  color: "#FFFFFF",
                  boxShadow: `0 4px 18px ${currentAccent}50`,
                }}
              >
                <span>{navigating ? "Loading…" : "Open Full Guide"}</span>
                {!navigating && (
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
