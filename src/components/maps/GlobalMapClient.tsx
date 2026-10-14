"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Mountain,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  RotateCw,
  ArrowUpRight,
  X,
  Compass,
  Search,
  Layers,
  Footprints,
  Waves,
  Sun,
  Flame,
  Eye,
  Pause,
  Play,
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
import { getRouteData } from "@/data/routes";
import { shortestAngleDiff } from "@/lib/camera-math";
import { registerPulsingBeacon } from "@/lib/mapbox-canvas-beacon";

interface GlobalMapClientProps {
  treks: Trek[];
  initialFocusId?: string | null;
}

/* ── Initial Camera State (Dramatic 3D Himalayan Ridge Overview) ────────── */
const INIT_CAM = { lat: 31.8, lng: 77.2, zoom: 6.8, pitch: 68, bearing: 12 };

/* ── Territory Accents ───────────────────────────────────────────────────── */
const TERRITORY_ACCENT: Record<string, string> = {
  "jammu-kashmir":    "#3B82F6", // Glacier Blue
  "himachal-pradesh": "#F59E0B", // Amber Gold
  ladakh:             "#8B5CF6", // High Alpine Purple
  uttarakhand:        "#0D9488", // Emerald Pine
};

/* ── Territory Camera Presets: South-Offset Northward Look ──────────────────
 *  Camera is positioned south of each territory, aimed Northward (bearing: 350°–15°)
 *  with steep 75° pitch so the colossal snow walls tower majestically across the frame.
 * ────────────────────────────────────────────────────────────────────────── */
const TERRITORY_CAM: Record<string, [number, number, number, number, number]> = {
  // [lat, lng, zoom, pitch, bearing]
  "jammu-kashmir":    [32.30, 74.80, 8.0, 75, 10],  // South of Pir Panjal, looking north across Kashmir valley
  "himachal-pradesh": [30.90, 77.10, 8.2, 75, 5],   // Foothills south of Kalka, looking north into Pir Panjal & Great Himalayas
  ladakh:             [32.80, 77.50, 7.8, 75, 355], // South looking north across Zanskar & Indus to Karakoram
  uttarakhand:        [29.40, 79.00, 8.0, 75, 5],   // South looking north into Nanda Devi & Kedarnath massifs
};

/* ── 27 Subregion / Valley Precision 3D Camera Targets (South-Offset) ─────── */
const SUBREGION_CAM: Record<string, [number, number, number, number, number]> = {
  // Jammu & Kashmir
  jammu:               [32.80, 75.28, 10.0, 68, 5],
  kashmir:             [33.60, 74.90, 10.0, 68, 5],
  // Himachal Pradesh
  chamba:              [32.25, 76.25, 10.0, 68, 8],
  kangra:              [31.90, 76.35, 10.2, 68, 6],
  kullu:               [31.80, 77.15, 10.2, 70, 5],
  mandi:               [31.30, 76.93, 10.5, 68, 5],
  "lahaul-spiti":      [31.80, 77.80,  9.6, 68, 5],
  kinnaur:             [31.10, 78.35, 10.5, 68, 15],
  // Uttarakhand - Garhwal
  garhwal:             [30.20, 79.10, 10.0, 68, 5],
  chamoli:             [30.20, 79.50, 10.0, 68, 8],
  rudraprayag:         [30.20, 79.05, 10.2, 68, 5],
  uttarkashi:          [30.50, 78.55,  9.8, 68, 6],
  "pauri-garhwal":     [29.70, 78.80, 10.1, 68, 5],
  "tehri-garhwal":     [30.00, 78.45, 10.1, 68, 8],
  dehradun:            [30.10, 78.05, 10.2, 68, 4],
  haridwar:            [29.75, 78.15, 10.4, 66, 2],
  // Uttarakhand - Kumaon
  pithoragarh:         [29.70, 80.20,  9.8, 68, 8],
  bageshwar:           [29.70, 79.80, 10.1, 68, 6],
  almora:              [29.35, 79.65, 10.2, 68, 4],
  nainital:            [29.15, 79.35, 10.2, 68, 5],
  champawat:           [29.10, 80.05, 10.2, 68, 6],
  "udham-singh-nagar": [28.70, 79.80, 10.4, 65, 0],
  // Ladakh
  leh:                 [33.50, 77.58,  9.5, 68, 355],
  kargil:              [34.00, 76.15,  9.8, 68, 8],
  nubra:               [34.20, 77.30,  9.6, 68, 355],
  drass:               [34.10, 75.75, 10.0, 68, 6],
  zanskar:             [33.10, 76.98,  9.5, 68, 10],
};

/* ── Screen-Space Marker Relaxation Algorithm ──────────────────────────────
 *  Pushes adjacent markers apart in screen-pixel space so labels/pins never
 *  overlap or occlude in dense mountain valleys. Runs 4 relaxation passes.
/* ── Colour per Adventure Type (Tailored Himalayan Palette) ─────────────── */
const TYPE_COLOR: Record<string, string> = {
  trek: "#10B981",       // Alpine Emerald Green
  peak: "#F59E0B",       // Summit Gold
  lake: "#06B6D4",       // Glacial Cyan Tarn
  spiritual: "#A855F7",  // High Alpine Violet
  scenic: "#38BDF8",     // Sky Blue
  adventure: "#F97316",  // Expedition Orange
  road: "#EAB308",       // High Pass Amber
};

/* ── Tailored Alpine Iconography Generator ──────────────────────────────── */
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
      return `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-6.5 10-6.5 10 6.5 10 6.5-3.5 6.5-10 6.5-10-6.5-10-6.5Z"/><circle cx="12" cy="12" r="2.8"/></svg>`;
    case "road":
      return `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><polygon points="16 8 13.5 13.5 8 16 10.5 10.5 16 8"/></svg>`;
    case "adventure":
    default:
      return `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  }
}

/* ── DOM Marker Builders (Museum-Grade Editorial Architecture) ───────────── */

function buildPlaceMarkerEl(place: HimalayaPlace, isSelected = false): HTMLElement {
  const color = TYPE_COLOR[place.type] ?? "#F59E0B";
  const el = document.createElement("div");
  el.className = "group pointer-events-auto cursor-pointer place-marker-node";
  el.setAttribute("data-place-id", place.id);
  el.style.cssText =
    "display: flex; flex-direction: column; align-items: center; user-select: none; cursor: pointer; transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out;";

  // Extract clean altitude label if present
  const rawEle = place.elevation || (place as unknown as { altitude?: string }).altitude || "";
  const eleClean = rawEle ? rawEle.replace(/\s*m$/i, "") + "m" : "";

  // The Frosted Glass Capsule
  const capsule = document.createElement("div");
  capsule.style.cssText = `
    display: flex;
    align-items: center;
    gap: 5px;
    padding: ${isSelected ? "3px 10px 3px 6px" : "2.5px 8px 2.5px 5px"};
    background: ${isSelected ? "rgba(4, 9, 20, 0.96)" : "rgba(6, 11, 22, 0.92)"};
    border: 1px solid ${isSelected ? "#38BDF8" : "rgba(255, 255, 255, 0.14)"};
    border-radius: 9999px;
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow: ${isSelected ? "0 0 22px rgba(56, 189, 248, 0.55), 0 8px 20px rgba(0,0,0,0.85)" : "0 4px 16px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)"};
    transform: ${isSelected ? "scale(1.08)" : "scale(1)"};
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  // Category Icon Circle
  const iconBox = document.createElement("div");
  iconBox.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 17px;
    height: 17px;
    border-radius: 9999px;
    background: ${color}22;
    border: 1px solid ${color}66;
    flex-shrink: 0;
  `;
  iconBox.innerHTML = getCategoryIconSvg(place.type, color);

  // Place Name Label
  const label = document.createElement("span");
  label.style.cssText = `
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: ${isSelected ? "#38BDF8" : "#FFFFFF"};
    white-space: nowrap;
    max-width: 145px;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
  label.textContent = place.name;

  capsule.appendChild(iconBox);
  capsule.appendChild(label);

  // Elevation badge if available
  if (eleClean) {
    const eleTag = document.createElement("span");
    eleTag.style.cssText = `
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 8px;
      font-weight: 700;
      color: ${color};
      background: ${color}18;
      padding: 1px 4.5px;
      border-radius: 4px;
      border: 1px solid ${color}40;
      letter-spacing: 0.04em;
    `;
    eleTag.textContent = eleClean;
    capsule.appendChild(eleTag);
  }

  // Precision Needle Stem & Ground Target Anchor
  const needleSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  needleSvg.setAttribute("width", "16");
  needleSvg.setAttribute("height", "16");
  needleSvg.setAttribute("viewBox", "0 0 16 16");
  needleSvg.setAttribute("fill", "none");
  needleSvg.style.cssText = "display: block; margin-top: -1px; pointer-events: none;";

  needleSvg.innerHTML = `
    <path d="M8 0 V9" stroke="${isSelected ? "#38BDF8" : "rgba(255, 255, 255, 0.45)"}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="8" cy="12" r="3" stroke="${isSelected ? "#38BDF8" : color}" stroke-width="1.2" opacity="${isSelected ? "0.9" : "0.6"}"/>
    <circle cx="8" cy="12" r="1.5" fill="${isSelected ? "#FFFFFF" : color}"/>
  `;

  el.appendChild(capsule);
  el.appendChild(needleSvg);

  // Hover transitions
  el.addEventListener("mouseenter", () => {
    capsule.style.borderColor = "#FFFFFF";
    capsule.style.transform = isSelected ? "scale(1.12) translateY(-2px)" : "scale(1.05) translateY(-2px)";
    capsule.style.boxShadow = `0 8px 24px rgba(0,0,0,0.95), 0 0 16px ${color}88`;
    label.style.color = "#FFFFFF";
  });

  el.addEventListener("mouseleave", () => {
    capsule.style.borderColor = isSelected ? "#38BDF8" : "rgba(255, 255, 255, 0.14)";
    capsule.style.transform = isSelected ? "scale(1.08)" : "scale(1)";
    capsule.style.boxShadow = isSelected
      ? "0 0 22px rgba(56, 189, 248, 0.55), 0 8px 20px rgba(0,0,0,0.85)"
      : "0 4px 16px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)";
    label.style.color = isSelected ? "#38BDF8" : "#FFFFFF";
  });

  return el;
}

function buildSubRegionMarkerEl(name: string, count: number, accent: string): HTMLElement {
  const el = document.createElement("div");
  el.className = "group pointer-events-auto cursor-pointer";
  el.style.cssText =
    "display: flex; flex-direction: column; align-items: center; user-select: none; cursor: pointer; transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);";

  el.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 8px 20px rgba(0,0,0,0.85));">
      <div style="
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 3px 10px 3px 6px;
        background: rgba(6, 10, 20, 0.94);
        border: 1px solid ${accent}80;
        border-radius: 9999px;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow: 0 0 16px ${accent}30, inset 0 1px 0 rgba(255,255,255,0.1);
      ">
        <div style="
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: ${accent}25;
          border: 1px solid ${accent}60;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        ">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2"/>
          </svg>
        </div>

        <span style="
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #FFFFFF;
          white-space: nowrap;
        ">${name}</span>

        <span style="
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 8px;
          font-weight: 700;
          color: ${accent};
          background: ${accent}20;
          padding: 1px 5px;
          border-radius: 4px;
          border: 1px solid ${accent}40;
        ">${count} TRAILS</span>
      </div>

      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style="display: block; margin-top: -1px;">
        <path d="M9 0 V11" stroke="${accent}" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="9" cy="14" r="3.5" stroke="${accent}" stroke-width="1.2" opacity="0.8"/>
        <circle cx="9" cy="14" r="1.8" fill="#FFFFFF"/>
      </svg>
    </div>
  `;

  el.addEventListener("mouseenter", () => {
    el.style.transform = "scale(1.08) translateY(-2px)";
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "scale(1)";
  });

  return el;
}

function buildStateMarkerEl(
  name: string,
  accent: string,
  count: number,
  subregionsCount: number
): HTMLElement {
  const el = document.createElement("div");
  el.className = "group pointer-events-auto cursor-pointer";
  el.style.cssText =
    "display: flex; flex-direction: column; align-items: center; user-select: none; cursor: pointer; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);";

  el.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 12px 28px rgba(0,0,0,0.9));">
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px 12px 5px 8px;
        background: rgba(5, 9, 20, 0.94);
        border: 1.5px solid ${accent};
        border-radius: 9999px;
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 0 24px ${accent}40, inset 0 1px 0 rgba(255,255,255,0.15);
      ">
        <div style="
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: ${accent}25;
          border: 1px solid ${accent}70;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
          </svg>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: flex-start; line-height: 1.15;">
          <span style="
            font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #FFFFFF;
          ">${name}</span>
          <span style="
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 8.5px;
            font-weight: 600;
            letter-spacing: 0.05em;
            color: ${accent};
            opacity: 0.9;
          ">${count} EXPEDITIONS · ${subregionsCount} VALLEYS</span>
        </div>
      </div>

      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="display: block; margin-top: -2px;">
        <path d="M12 0 V14" stroke="${accent}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="18" r="4.5" stroke="${accent}" stroke-width="1.5" opacity="0.8"/>
        <circle cx="12" cy="18" r="2.5" fill="#FFFFFF"/>
      </svg>
    </div>
  `;

  el.addEventListener("mouseenter", () => {
    el.style.transform = "scale(1.06) translateY(-3px)";
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "scale(1)";
  });

  return el;
}

export interface FlyingState {
  name: string;
  subtitle?: string;
  category?: string;
  elevation?: string;
  accent?: string;
  coords?: [number, number];
}

/* ── Place Type Filtering Metadata ───────────────────────────────────────── */
const PLACE_TYPES = [
  { id: "all",        label: "All Entities",  icon: Layers },
  { id: "trek",       label: "Treks",         icon: Footprints },
  { id: "peak",       label: "Peaks",         icon: Mountain },
  { id: "lake",       label: "Alpine Lakes",  icon: Waves },
  { id: "spiritual",  label: "Sanctuaries",   icon: Flame },
  { id: "scenic",     label: "Viewpoints",    icon: Sun },
] as const;

type FilterType = (typeof PLACE_TYPES)[number]["id"];

/* ── Module-level flat list of all places ───────────────────────────────── */
const ALL_PLACES: HimalayaPlace[] = himalayaAtlas.flatMap((r) =>
  r.subregions.flatMap((s) => s.places)
);


export default function GlobalMapClient({ treks, initialFocusId }: GlobalMapClientProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const placeMarkerNodesRef = useRef<{ el: HTMLElement; lng: number; lat: number }[]>([]);
  const routeListenersRef = useRef<{ layerId: string; fn: () => void }[]>([]);
  const activeTrailIdsRef = useRef<Set<string>>(new Set());
  const flowTimerRef = useRef<NodeJS.Timeout | null>(null);

  const initialPlaceLoc = initialFocusId ? placeLocationIndex.get(initialFocusId) : null;

  // ── Component State ───────────────────────────────────────────────────
  const [activeRegionId, setActiveRegionId]       = useState<string | null>(() => initialPlaceLoc?.regionId ?? null);
  const [activeSubRegionId, setActiveSubRegionId] = useState<string | null>(() => initialPlaceLoc?.subRegionId ?? null);
  const [selectedPlaceId, setSelectedPlaceId]     = useState<string | null>(() => initialFocusId ?? null);
  const [typeFilter, setTypeFilter]               = useState<FilterType>("all");
  const [searchQuery, setSearchQuery]             = useState("");
  const [isTerritoryDrawerOpen, setIsTerritoryDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen]           = useState(false);
  const [mapLoaded, setMapLoaded]                 = useState(false);
  const [navigating, setNavigating]               = useState(false);
  const [flyingState, setFlyingState]             = useState<FlyingState | null>(null);

  const [isOrbiting, setIsOrbiting]               = useState(false);
  const orbitAnimRef = useRef<number | null>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // ── Dynamic Proximity Marker Culling for Valley Depth ─────────────────
  const updatePlaceVisibilities = useCallback(() => {
    const map = mapRef.current;
    if (!map || placeMarkerNodesRef.current.length === 0) return;
    const center = map.getCenter();
    const cLng = center.lng;
    const cLat = center.lat;

    placeMarkerNodesRef.current.forEach(({ el, lng, lat }) => {
      const dLng = lng - cLng;
      const dLat = lat - cLat;
      const distDeg = Math.sqrt(dLng * dLng + dLat * dLat);

      if (distDeg < 0.12) {
        el.style.opacity = "1";
        el.style.transform = "scale(1)";
      } else if (distDeg < 0.26) {
        el.style.opacity = "0.7";
        el.style.transform = "scale(0.94)";
      } else {
        el.style.opacity = "0.2";
        el.style.transform = "scale(0.85)";
      }
    });
  }, []);

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

  const selectedPlaceLocation: PlaceLocation | null = useMemo(
    () => (selectedPlaceId ? (placeLocationIndex.get(selectedPlaceId) ?? null) : null),
    [selectedPlaceId]
  );

  const currentAccent = activeRegionId
    ? (TERRITORY_ACCENT[activeRegionId] ?? "#3B82F6")
    : "#3B82F6";

  // Filtered places matching active scope, type, and search query
  const scopedPlaces = useMemo(() => {
    let pool: HimalayaPlace[] = [];
    if (activeSubRegion) {
      pool = activeSubRegion.places;
    } else if (activeRegion) {
      pool = activeRegion.subregions.flatMap((s) => s.places);
    } else {
      pool = ALL_PLACES;
    }

    if (typeFilter !== "all") {
      pool = pool.filter((p) => p.type === typeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      pool = pool.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.overview?.toLowerCase().includes(q) ||
          p.elevation?.toLowerCase().includes(q)
      );
    }

    return pool;
  }, [activeRegion, activeSubRegion, typeFilter, searchQuery]);

  // ── Cinematic 3D Camera Animation Engine ──────────────────────────────
  const flyTo = useCallback(
    (
      lat: number,
      lng: number,
      zoom: number,
      pitch = 68,
      bearing = 0,
      duration = 2400,
      recon?: FlyingState,
      onComplete?: () => void
    ) => {
      const map = mapRef.current;
      if (!map) return;

      if (orbitAnimRef.current) {
        cancelAnimationFrame(orbitAnimRef.current);
        orbitAnimRef.current = null;
        setIsOrbiting(false);
      }

      if (recon) {
        setFlyingState(recon);
      }

      const onMoveEnd = () => {
        setFlyingState(null);
        onComplete?.();
      };
      map.once("moveend", onMoveEnd);

      const curBearing = map.getBearing();
      const shortestBearing = curBearing + shortestAngleDiff(bearing, curBearing);
      const safePitch = Math.min(72, Math.max(0, pitch));

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

  // Smooth continuous 3D Orbit motion around current center with delta-time rotation
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
        // Serene 7.0 degrees per second delta-time rotation
        const currentBearing = mapRef.current.getBearing();
        mapRef.current.setBearing((currentBearing + 7.0 * deltaSec) % 360);
        orbitAnimRef.current = requestAnimationFrame(rotate);
      };
      orbitAnimRef.current = requestAnimationFrame(rotate);
    }
  }, [isOrbiting]);

  // Quick 3D Perspective Tilt toggle (High Angle vs Horizon Ridge View)
  const togglePerspective = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const currentPitch = map.getPitch();
    const nextPitch = currentPitch > 55 ? 35 : 72;
    map.easeTo({ pitch: nextPitch, duration: 1200 });
  }, []);

  // On-screen 3D control actions
  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn({ duration: 400 });
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut({ duration: 400 });
  }, []);

  const handlePitchMore = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const current = map.getPitch();
    map.easeTo({ pitch: Math.min(85, current + 12), duration: 500 });
  }, []);

  const handlePitchLess = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const current = map.getPitch();
    map.easeTo({ pitch: Math.max(0, current - 12), duration: 500 });
  }, []);

  const handleResetNorth = useCallback(() => {
    mapRef.current?.resetNorthPitch({ duration: 1000 });
  }, []);

  const handleRotateCW = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const current = map.getBearing();
    map.easeTo({ bearing: (current + 45) % 360, duration: 600 });
  }, []);

  const handleRotateCCW = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const current = map.getBearing();
    map.easeTo({ bearing: (current - 45 + 360) % 360, duration: 600 });
  }, []);

  // ── Fullscreen Controls & Keyboard Shortcuts ─────────────────────────
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
      // Fallback to CSS overlay fullscreen
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      const isCurrentlyFs = Boolean(
        document.fullscreenElement ||
          (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );
      if (isCurrentlyFs) {
        const doc = document as Document & {
          webkitExitFullscreen?: () => Promise<void>;
        };
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      }
    } catch {}
    setIsFullscreen(false);
  }, []);

  // Sync native fullscreen state change (e.g. user presses Esc in browser)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
          (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );
      setIsFullscreen(isFs);
      setTimeout(() => {
        mapRef.current?.resize();
      }, 80);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Lock body scroll and trigger map canvas resize when fullscreen changes
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const timer = setTimeout(() => {
      mapRef.current?.resize();
    }, 120);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const handleReset = useCallback(() => {
    setActiveRegionId(null);
    setActiveSubRegionId(null);
    setSelectedPlaceId(null);
    flyTo(INIT_CAM.lat, INIT_CAM.lng, INIT_CAM.zoom, INIT_CAM.pitch, INIT_CAM.bearing, 2600);
  }, [flyTo]);

  const handleRegion = useCallback(
    (regionId: string) => {
      setActiveRegionId(regionId);
      setActiveSubRegionId(null);
      setSelectedPlaceId(null);
      const cam = TERRITORY_CAM[regionId] ?? [INIT_CAM.lat, INIT_CAM.lng, INIT_CAM.zoom, INIT_CAM.pitch, 0];
      const region = himalayaAtlas.find((r) => r.id === regionId);
      const accent = TERRITORY_ACCENT[regionId] ?? "#3B82F6";
      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 2400, {
        name: region?.name ?? "Territory",
        subtitle: `${region?.subregions.length ?? 0} Alpine Valleys`,
        category: "TERRITORY OVERVIEW",
        accent,
      });
    },
    [flyTo]
  );

  const handleSubRegion = useCallback(
    (subRegionId: string) => {
      setActiveSubRegionId(subRegionId);
      setSelectedPlaceId(null);
      const cam = SUBREGION_CAM[subRegionId] ?? [31.8, 77.2, 10.0, 68, 5];
      const sub = activeRegion?.subregions.find((s) => s.id === subRegionId);
      const accent = activeRegion ? TERRITORY_ACCENT[activeRegion.id] ?? "#3B82F6" : "#3B82F6";
      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 2000, {
        name: sub?.name ?? "Alpine Valley",
        subtitle: `${sub?.places.length ?? 0} Expeditions`,
        category: "VALLEY RECONNAISSANCE",
        accent,
      });
    },
    [flyTo, activeRegion]
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
        // South-Offset Northward Look: camera positioned ~2.4km south of summit looking North
        const heading = 5;
        const rad = (heading * Math.PI) / 180;
        const dist = 0.022;
        const camLat = place.coords[0] - dist * Math.cos(rad);
        const camLng = place.coords[1] - dist * Math.sin(rad);
        const accent = loc ? TERRITORY_ACCENT[loc.regionId] ?? "#3B82F6" : "#3B82F6";

        flyTo(
          camLat,
          camLng,
          13.2,
          70,
          heading,
          2200,
          {
            name: place.name,
            subtitle: loc ? `${loc.subRegionName} · ${loc.regionName}` : undefined,
            category: place.type === "peak" ? "SUMMIT RECONNAISSANCE" : "EXPEDITION FOCUS",
            elevation: place.elevation,
            accent,
            coords: place.coords,
          },
          () => {
            // Post-summit panoramic sweep: smoothly ease bearing +35° over 4 seconds
            const map = mapRef.current;
            if (map && !map.isMoving()) {
              map.easeTo({
                bearing: map.getBearing() + 35,
                duration: 4000,
                easing: (t) => t,
              });
            }
          }
        );
      }
    },
    [flyTo]
  );

  const handleOpenPlace = useCallback(() => {
    if (!selectedPlaceLocation) return;
    setNavigating(true);
    router.push(selectedPlaceLocation.href);
  }, [selectedPlaceLocation, router]);

  // Chronological immediate back navigation: Level 3 (Place) -> Level 2 (Valley) -> Level 1 (Territory) -> Level 0 (Atlas)
  const handleClosePlace = useCallback(() => {
    setSelectedPlaceId(null);
    if (activeSubRegionId) {
      const cam = SUBREGION_CAM[activeSubRegionId] ?? [31.8, 77.2, 10.0, 68, 5];
      const sub = activeRegion?.subregions.find((s) => s.id === activeSubRegionId);
      const accent = activeRegion ? TERRITORY_ACCENT[activeRegion.id] ?? "#3B82F6" : "#3B82F6";
      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 1800, {
        name: sub?.name ?? "Alpine Valley",
        subtitle: `${sub?.places.length ?? 0} Expeditions`,
        category: "VALLEY RECONNAISSANCE",
        accent,
      });
    } else if (activeRegionId) {
      const cam = TERRITORY_CAM[activeRegionId] ?? [INIT_CAM.lat, INIT_CAM.lng, INIT_CAM.zoom, INIT_CAM.pitch, 0];
      const region = himalayaAtlas.find((r) => r.id === activeRegionId);
      const accent = TERRITORY_ACCENT[activeRegionId] ?? "#3B82F6";
      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 2000, {
        name: region?.name ?? "Territory",
        subtitle: `${region?.subregions.length ?? 0} Alpine Valleys`,
        category: "TERRITORY OVERVIEW",
        accent,
      });
    } else {
      handleReset();
    }
  }, [activeSubRegionId, activeRegionId, activeRegion, flyTo, handleReset]);

  // Global keyboard shortcuts: 'F' toggles fullscreen, 'Escape' goes back chronologically or exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "Escape") {
        if (selectedPlaceId) {
          e.preventDefault();
          handleClosePlace();
        } else if (isFullscreen) {
          e.preventDefault();
          exitFullscreen();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFullscreen, exitFullscreen, isFullscreen, selectedPlaceId, handleClosePlace]);

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
      scrollZoom: false, // Prevent accidental page scroll hijacking
      doubleClickZoom: true,
      boxZoom: false,
      dragRotate: true,
      touchZoomRotate: true,
      attributionControl: false,
      antialias: true,
    });

    mapRef.current = map;

    map.on("error", (e) => {
      const msg = e.error?.message || "";
      const status = (e.error as unknown as { status?: number })?.status;
      if (msg.includes("Failed to fetch") || msg.includes("abort") || status === 404) {
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

      // Hyper-realistic 3D mountain terrain relief: 1.25x calibrated exaggeration (prevents camera frustum collisions)
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.25 });

      // Atmospheric Himalayan Midnight Fog & Sky
      map.setFog({
        range: [0.6, 12.0],
        color: "#050914",
        "horizon-blend": 0.18,
        "high-color": "#020409",
        "space-color": "#010206",
        "star-intensity": 0.85,
      });

      // Suppress default vector labels, country borders, and roads to reveal raw cinematic satellite wilderness
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
          } catch {
            // style layer might be non-configurable
          }
        }
      }

      if (initialFocusId) {
        const target = ALL_PLACES.find((p) => p.id === initialFocusId);
        if (target?.coords && target.coords.length === 2) {
          const tLat = target.coords[0];
          const tLng = target.coords[1];
          const offsetDist = 0.042;
          const rad = (5 * Math.PI) / 180;
          const camLat = tLat - offsetDist * Math.cos(rad);
          const camLng = tLng - offsetDist * Math.sin(rad);

          setFlyingState({
            name: target.name,
            category: target.type === "peak" ? "SUMMIT RECONNAISSANCE" : "EXPEDITION FOCUS",
            elevation: target.elevation,
            coords: [tLat, tLng],
          });

          map.flyTo({
            center: [camLng, camLat],
            zoom: 13.2,
            pitch: 72,
            bearing: 5,
            duration: 2400,
            essential: true,
          });

          map.once("moveend", () => {
            setFlyingState(null);
            setTimeout(() => {
              if (mapRef.current) {
                mapRef.current.easeTo({
                  bearing: 5 + 32,
                  duration: 4000,
                  easing: (t) => t * (2 - t),
                });
              }
            }, 300);
          });
        }
      }

      // Register GPU-accelerated pulsing radar beacon
      registerPulsingBeacon(map, "global-radar-beacon", {
        size: 90,
        color: "#22D3EE",
        coreColor: "#FFFFFF",
      });

      // User interaction listener to pause orbit when dragging/panning
      const cancelOrbitOnInteract = () => {
        setIsOrbiting(false);
        if (orbitAnimRef.current) {
          cancelAnimationFrame(orbitAnimRef.current);
          orbitAnimRef.current = null;
        }
      };
      map.on("mousedown", cancelOrbitOnInteract);
      map.on("touchstart", cancelOrbitOnInteract);
      map.on("wheel", cancelOrbitOnInteract);
      map.on("move", updatePlaceVisibilities);

      // Mapbox GL JS v3 natively computes 3D terrain elevation transforms
      // in lockstep with the WebGL terrain canvas for all Markers.

      setMapLoaded(true);
    });

    return () => {
      if (orbitAnimRef.current) {
        cancelAnimationFrame(orbitAnimRef.current);
        orbitAnimRef.current = null;
      }
      if (flowTimerRef.current) {
        clearInterval(flowTimerRef.current);
        flowTimerRef.current = null;
      }
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      placeMarkerNodesRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [mapboxToken, initialFocusId, updatePlaceVisibilities]);

  // ── Sync Markers & GeoJSON Paths ──────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clean up markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    placeMarkerNodesRef.current = [];

    // Clean up route listeners and layers
    for (const { layerId, fn } of routeListenersRef.current) {
      if (map.getLayer(layerId)) map.off("click", layerId, fn);
    }
    routeListenersRef.current = [];

    // Clean up native 3D terrain beacon layers
    if (map.getLayer("places-beacons-halo")) map.removeLayer("places-beacons-halo");
    if (map.getLayer("places-beacons-core")) map.removeLayer("places-beacons-core");
    if (map.getSource("places-beacons-source")) map.removeSource("places-beacons-source");

    // Clean up all active trail sources and layers (both treks and atlas places)
    activeTrailIdsRef.current.forEach((id) => {
      const sId = `source-${id}`;
      const lId = `layer-${id}`;
      const gId = `glow-${id}`;
      const fId = `flow-${id}`;
      if (map.getLayer(fId)) map.removeLayer(fId);
      if (map.getLayer(lId)) map.removeLayer(lId);
      if (map.getLayer(gId)) map.removeLayer(gId);
      if (map.getSource(sId)) map.removeSource(sId);
    });
    activeTrailIdsRef.current.clear();

    for (const trek of treks) {
      const sId = `source-${trek.slug}`,
        lId = `layer-${trek.slug}`,
        gId = `glow-${trek.slug}`;
      if (map.getLayer(lId)) map.removeLayer(lId);
      if (map.getLayer(gId)) map.removeLayer(gId);
      if (map.getSource(sId)) map.removeSource(sId);
    }

    // ── LEVEL 0: Overview Mode (No Territory Selected) ───────────────────
    if (!activeRegionId) {
      const REGION_CENTROIDS: Record<string, { lat: number; lng: number }> = {
        "jammu-kashmir":    { lat: 33.7, lng: 74.8 },
        "himachal-pradesh": { lat: 31.8, lng: 77.1 },
        ladakh:             { lat: 34.1, lng: 77.5 },
        uttarakhand:        { lat: 30.2, lng: 79.2 },
      };

      himalayaAtlas.forEach((region) => {
        const centroid = REGION_CENTROIDS[region.id];
        if (!centroid) return;
        const accent = TERRITORY_ACCENT[region.id] ?? "#3B82F6";
        const count = region.subregions.reduce((a, s) => a + s.places.length, 0);

        const el = buildStateMarkerEl(
          region.name,
          accent,
          count,
          region.subregions.length
        );
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          handleRegion(region.id);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([centroid.lng, centroid.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
      return;
    }

    // ── LEVEL 1: Territory Mode — Show Division/Subregion Pins (NO individual places yet!) ──
    if (activeRegion && !activeSubRegionId && !searchQuery.trim()) {
      const accent = TERRITORY_ACCENT[activeRegion.id] ?? "#3B82F6";

      activeRegion.subregions.forEach((sub) => {
        const camTarget = SUBREGION_CAM[sub.id];
        let lat = camTarget ? camTarget[0] : 0;
        let lng = camTarget ? camTarget[1] : 0;

        if (!lat || !lng) {
          const validPlaces = sub.places.filter((p) => p.coords && p.coords.length === 2);
          if (validPlaces.length > 0) {
            lat = validPlaces.reduce((sum, p) => sum + (p.coords ? p.coords[0] : 0), 0) / validPlaces.length;
            lng = validPlaces.reduce((sum, p) => sum + (p.coords ? p.coords[1] : 0), 0) / validPlaces.length;
          }
        }
        if (!lat || !lng) return;

        const el = buildSubRegionMarkerEl(sub.name, sub.places.length, accent);
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          handleSubRegion(sub.id);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
      return;
    }

    // ── LEVEL 2: Detailed Valley View — Exact Pahadi Trails Place Markers ─
    for (const place of scopedPlaces) {
      if (!place.coords || place.coords.length !== 2) continue;
      const [lat, lng] = place.coords;
      const isSelected = selectedPlaceId === place.id;
      const loc = placeLocationIndex.get(place.id);
      const placeAccent = loc ? TERRITORY_ACCENT[loc.regionId] ?? "#3B82F6" : "#3B82F6";

      // STRICT AUTHENTICITY GATE: Render GeoJSON trail lines ONLY for authentic, field-verified routes (currently Patalsu Peak & Jogni Falls)
      const verifiedRoute = getRouteData(place.id);
      const isAuthentic = Boolean(
        (verifiedRoute && verifiedRoute.verified) ||
        place.id === "patalsu-peak" ||
        place.id === "jogni-falls"
      );

      // Prefer high-precision GPS coordinates from verified route data, fallback to authentic pathCoords
      const routeLineCoordinates: [number, number][] | undefined = isAuthentic
        ? (verifiedRoute && verifiedRoute.line?.coordinates?.length > 1
            ? (verifiedRoute.line.coordinates as [number, number, number][]).map(([ln, la]) => [ln, la])
            : (place.pathCoords ? place.pathCoords.map(([la, ln]) => [ln, la]) : undefined))
        : undefined;

      if (routeLineCoordinates && routeLineCoordinates.length > 1) {
        const sId = `source-${place.id}`;
        const lId = `layer-${place.id}`;
        const gId = `glow-${place.id}`;

        // Defensive check: remove if already exists
        if (map.getLayer(lId)) map.removeLayer(lId);
        if (map.getLayer(gId)) map.removeLayer(gId);
        if (map.getSource(sId)) map.removeSource(sId);

        activeTrailIdsRef.current.add(place.id);

        map.addSource(sId, {
          type: "geojson",
          lineMetrics: true,
          data: {
            type: "Feature",
            properties: { id: place.id, name: place.name },
            geometry: {
              type: "LineString",
              coordinates: routeLineCoordinates,
            },
          },
        });

        // Ambient ground glow
        map.addLayer({
          id: gId,
          type: "line",
          source: sId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": isSelected ? "#F59E0B" : placeAccent,
            "line-width": isSelected ? 12 : 7,
            "line-opacity": isSelected ? 0.7 : 0.3,
            "line-blur": 4,
          },
        });

        // 4-stop altitude gradient path from valley to summit
        map.addLayer({
          id: lId,
          type: "line",
          source: sId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-width": isSelected ? 4 : 2.5,
            "line-gradient": [
              "interpolate",
              ["linear"],
              ["line-progress"],
              0.0,
              "#06B6D4", // Cyan valley trailhead
              0.45,
              "#3B82F6", // Royal blue alpine meadows
              0.75,
              "#F59E0B", // High pass / ridge amber
              1.0,
              "#FDE047", // Glaciated summit crest
            ],
            "line-opacity": 0.95,
          },
        });

        // Animated marching ants directional flow layer
        const flowId = `flow-${place.id}`;
        if (map.getLayer(flowId)) map.removeLayer(flowId);
        map.addLayer({
          id: flowId,
          type: "line",
          source: sId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#FFFFFF",
            "line-width": isSelected ? 2.2 : 1.5,
            "line-dasharray": [0, 4, 3],
            "line-opacity": isSelected ? 0.95 : 0.65,
          },
        });

        const fn = () => handleSelectPlace(place);
        map.on("click", lId, fn);
        routeListenersRef.current.push({ layerId: lId, fn });
      }

      // Build Place Marker (pure DOM element pinned directly at [lng, lat] with anchor: 'bottom')
      const el = buildPlaceMarkerEl(place, isSelected);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        handleSelectPlace(place);
      });

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.push(marker);
      placeMarkerNodesRef.current.push({ el, lng, lat });
    }

    // Trigger initial visibility culling based on camera distance
    updatePlaceVisibilities();
  }, [
    mapLoaded,
    scopedPlaces,
    selectedPlaceId,
    treks,
    handleSelectPlace,
    activeRegionId,
    activeSubRegionId,
    activeRegion,
    searchQuery,
    handleRegion,
    handleSubRegion,
    updatePlaceVisibilities,
  ]);

  // ── Synchronize GPU Radar Beacon with Selected Place on 3D Terrain ─────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const sourceId = "selected-place-beacon-source";
    const layerId = "selected-place-beacon-layer";

    if (selectedPlace?.coords && selectedPlace.coords.length === 2) {
      const [pLat, pLng] = selectedPlace.coords;
      const pointData: GeoJSON.Feature<GeoJSON.Point> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [pLng, pLat],
        },
      };

      const existingSource = map.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;
      if (existingSource) {
        existingSource.setData(pointData);
      } else {
        try {
          map.addSource(sourceId, {
            type: "geojson",
            data: pointData,
          });
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
  }, [selectedPlace, mapLoaded]);

  // ── Animated Directional Flow Line Interval for Active Trails ──────────
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
      activeTrailIdsRef.current.forEach((id) => {
        const flowLayerId = `flow-${id}`;
        if (mapRef.current?.getLayer(flowLayerId)) {
          try {
            mapRef.current.setPaintProperty(flowLayerId, "line-dasharray", flowSequence[flowStep]);
          } catch {}
        }
      });
    }, 110);

    return () => {
      if (flowTimerRef.current) clearInterval(flowTimerRef.current);
    };
  }, []);

  if (!mapboxToken) {
    return (
      <div className="w-full h-[520px] rounded-3xl bg-card border border-white/10 flex items-center justify-center text-center p-10">
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
      className={`map-canvas-container preserve-white-text relative w-full h-full min-h-[640px] overflow-hidden ${
        isFullscreen
          ? "fixed inset-0 z-[9999] rounded-none border-none shadow-none h-screen w-screen"
          : "rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl"
      } bg-[#03060d] select-none text-white`}
    >
      {/* ── 3D Map Canvas ──────────────────────────────────────── */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* ── Top Navigation Bar: Breadcrumbs & Search ───────────── */}
      <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 z-20 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: Interactive Navigation Breadcrumb */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#050914]/90 backdrop-blur-xl border border-white/12 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl text-xs font-medium shadow-2xl">
          <button
            onClick={handleReset}
            className={`transition-colors flex items-center gap-1.5 ${
              !activeRegionId
                ? "text-primary font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span className="hidden xs:inline">Himalayan Atlas</span>
            <span className="xs:hidden">Atlas</span>
          </button>

          {activeRegion && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-white/30" />
              <button
                onClick={() => handleRegion(activeRegion.id)}
                className={`transition-colors font-semibold truncate max-w-[110px] sm:max-w-none ${
                  activeRegionId && !activeSubRegionId
                    ? "text-white underline underline-offset-4"
                    : "text-white/70 hover:text-white"
                }`}
                style={{ color: !activeSubRegionId ? currentAccent : undefined }}
              >
                {activeRegion.name}
              </button>
            </>
          )}

          {activeSubRegion && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-white/30" />
              <button
                onClick={() => handleSubRegion(activeSubRegion.id)}
                className={`transition-colors font-semibold truncate max-w-[100px] sm:max-w-none ${
                  !selectedPlace
                    ? "font-bold text-white underline underline-offset-4"
                    : "text-white/70 hover:text-white"
                }`}
                style={{ color: !selectedPlace ? currentAccent : undefined }}
              >
                {activeSubRegion.name}
              </button>
            </>
          )}

          {selectedPlace && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-white/30" />
              <span
                className="font-bold text-white truncate max-w-[100px] sm:max-w-[150px]"
                style={{ color: currentAccent }}
                title={selectedPlace.name}
              >
                {selectedPlace.name}
              </span>
            </>
          )}

          {activeRegionId && (
            <button
              onClick={handleReset}
              title="Reset Atlas View"
              className="ml-1.5 pl-1.5 border-l border-white/15 text-white/40 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: 3D Camera Controls & Quick Search */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* 3D Orbit & Rotation Control Cluster */}
          <div className="flex items-center bg-[#050914]/90 backdrop-blur-xl border border-white/12 rounded-2xl shadow-xl p-0.5">
            {/* Rotate CCW 45° */}
            <button
              onClick={handleRotateCCW}
              title="Rotate Camera Anti-Clockwise 45°"
              aria-label="Rotate Anti-Clockwise 45°"
              className="px-2 py-1.5 sm:py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Continuous Orbit Play/Pause */}
            <button
              onClick={toggleOrbit}
              title={isOrbiting ? "Pause 3D Orbit" : "Start 3D Cinematic Orbit"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold transition-all ${
                isOrbiting
                  ? "bg-primary text-white shadow-[0_0_16px_rgba(59,130,246,0.6)]"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {isOrbiting ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span className="hidden md:inline">Orbiting 3D</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden md:inline">3D Orbit</span>
                </>
              )}
            </button>

            {/* Rotate CW 45° */}
            <button
              onClick={handleRotateCW}
              title="Rotate Camera Clockwise 45°"
              aria-label="Rotate Clockwise 45°"
              className="px-2 py-1.5 sm:py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Perspective Tilt Toggle */}
          <button
            onClick={togglePerspective}
            title="Toggle Ridge View vs High Angle"
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl text-xs font-semibold bg-[#050914]/90 backdrop-blur-xl border border-white/12 text-white/80 hover:text-white hover:border-white/30 transition-all shadow-xl"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Ridge View</span>
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen (Esc or F)" : "Fullscreen Mode (Press F)"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl text-xs font-semibold backdrop-blur-xl border transition-all shadow-xl ${
              isFullscreen
                ? "bg-primary text-white border-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                : "bg-[#050914]/90 text-white/80 hover:text-white border-white/12 hover:border-white/30"
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-primary" />
                <span className="hidden md:inline">Fullscreen</span>
                <kbd className="hidden lg:inline text-[9px] font-mono px-1 py-0.5 rounded bg-white/10 text-white/60">F</kbd>
              </>
            )}
          </button>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trails, peaks…"
              className="w-32 xs:w-44 sm:w-60 pl-8 pr-3 py-1.5 sm:py-2 text-xs bg-[#050914]/90 backdrop-blur-xl border border-white/12 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary/60 transition-all shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {activeRegion && (
            <button
              onClick={() => setIsTerritoryDrawerOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl text-xs font-semibold backdrop-blur-xl border transition-all shadow-xl cursor-pointer ${
                isTerritoryDrawerOpen
                  ? "bg-white/20 border-white/40 text-white"
                  : "bg-[#050914]/90 border-white/12 text-white/80 hover:text-white hover:border-white/30"
              }`}
            >
              <Layers className="w-3.5 h-3.5" style={{ color: currentAccent }} />
              <span className="hidden sm:inline">Valleys ({activeRegion.subregions.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Sub-header: Place Type Filter Pills ───────────────── */}
      <div className="absolute top-14 sm:top-16 left-3 sm:left-4 z-20 flex flex-wrap gap-1 pointer-events-auto max-w-[calc(100%-1.5rem)]">
        {PLACE_TYPES.map(({ id, label, icon: Icon }) => {
          const isActive = typeFilter === id;
          return (
            <button
              key={id}
              onClick={() => setTypeFilter(id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] sm:text-[11px] font-semibold transition-all duration-200 backdrop-blur-xl ${
                isActive
                  ? "bg-white text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  : "bg-[#050914]/80 text-white/60 hover:text-white hover:bg-[#050914] border border-white/10"
              }`}
            >
              <Icon className={`w-3 h-3 ${isActive ? "text-slate-950" : "text-white/50"}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Reconnaissance Flight Telemetry HUD ───────────────────────── */}
      {flyingState && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300">
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-full border shadow-2xl backdrop-blur-xl"
            style={{
              background: "rgba(5, 9, 20, 0.92)",
              borderColor: `${currentAccent}66`,
              boxShadow: `0 0 35px ${currentAccent}35, 0 10px 30px rgba(0,0,0,0.85)`,
            }}
          >
            {/* Pulsing targeting radar beacon */}
            <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
              <span
                className="absolute w-full h-full rounded-full animate-ping opacity-75"
                style={{ background: currentAccent }}
              />
              <span
                className="relative w-2 h-2 rounded-full"
                style={{ background: "#FFFFFF", boxShadow: `0 0 8px ${currentAccent}` }}
              />
            </div>

            {/* Destination telemetry info */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 leading-none mb-0.5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/50">
                  {flyingState.category ?? "RECONNAISSANCE FLYBY"}
                </span>
                {flyingState.elevation && (
                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded"
                    style={{
                      color: flyingState.accent ?? currentAccent,
                      background: `${flyingState.accent ?? currentAccent}22`,
                      border: `1px solid ${flyingState.accent ?? currentAccent}44`,
                    }}
                  >
                    {flyingState.elevation}
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-white tracking-wide truncate max-w-[200px] sm:max-w-xs" style={{ color: "#FFFFFF" }}>
                {flyingState.name}
              </div>
              {flyingState.subtitle && (
                <div className="text-[10px] text-white/60 font-mono truncate max-w-[200px] sm:max-w-xs">
                  {flyingState.subtitle}
                </div>
              )}
            </div>

            {/* Coordinates */}
            {flyingState.coords && (
              <div className="hidden sm:flex flex-col text-right pl-2.5 border-l border-white/15 font-mono text-[9px] text-white/60 leading-tight">
                <span>{flyingState.coords[0].toFixed(3)}°N</span>
                <span>{flyingState.coords[1].toFixed(3)}°E</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Professional On-Screen 3D Control Console (Right Side) ──── */}
      <div className="absolute right-3 sm:right-4 top-24 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <div className="flex flex-col bg-[#050914]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-1 shadow-2xl">
          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            title="Zoom In (+)"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            title="Zoom Out (-)"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10"
          >
            <Minus className="w-4 h-4" />
          </button>
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen (Esc or F)" : "Fullscreen Mode (F)"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-primary" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 3D Tilt, Orbit & Rotation Block */}
        <div className="flex flex-col bg-[#050914]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-1 shadow-2xl">
          {/* Tilt Up */}
          <button
            onClick={handlePitchMore}
            title="Tilt 3D Angle Up (Pitch Up)"
            aria-label="Tilt 3D Angle Up"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors text-[10px] font-mono font-bold"
          >
            3D↑
          </button>
          {/* Tilt Flat */}
          <button
            onClick={handlePitchLess}
            title="Tilt 2D Overhead (Pitch Down)"
            aria-label="Tilt 2D Overhead"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors text-[10px] font-mono font-bold border-t border-white/10"
          >
            2D↓
          </button>
          {/* Rotate Anti-Clockwise */}
          <button
            onClick={handleRotateCCW}
            title="Rotate Anti-Clockwise 45°"
            aria-label="Rotate Anti-Clockwise 45 degrees"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {/* Rotate Clockwise */}
          <button
            onClick={handleRotateCW}
            title="Rotate Clockwise 45°"
            aria-label="Rotate Clockwise 45 degrees"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          {/* Reset North Compass */}
          <button
            onClick={handleResetNorth}
            title="Reset North Compass & Tilt"
            aria-label="Reset North Compass"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10"
          >
            <NavigationIcon className="w-3.5 h-3.5 text-primary" />
          </button>
        </div>
      </div>

      {/* ── Level 0: 4 Himalayan Territories Strip (When No Region is Active) ── */}
      {!activeRegionId && (
        <div className="absolute bottom-5 inset-x-4 z-20 pointer-events-auto">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {himalayaAtlas.map((region) => {
              const accent = TERRITORY_ACCENT[region.id] ?? "#3B82F6";
              const totalPlaces = region.subregions.reduce(
                (sum, sub) => sum + sub.places.length,
                0
              );

              return (
                <button
                  key={region.id}
                  onClick={() => handleRegion(region.id)}
                  className="group relative flex flex-col p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-300 overflow-hidden"
                  style={{
                    background: "rgba(5, 9, 20, 0.88)",
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${accent}33`,
                    boxShadow: `0 8px 30px rgba(0,0,0,0.6), inset 0 0 20px ${accent}15`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${accent}99`;
                    e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.8), 0 0 30px ${accent}44`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${accent}33`;
                    e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.6), inset 0 0 20px ${accent}15`;
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl sm:text-2xl">{region.emoji}</span>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase"
                      style={{
                        color: accent,
                        background: `${accent}18`,
                        border: `1px solid ${accent}40`,
                      }}
                    >
                      {totalPlaces} Places
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm sm:text-base !text-white group-hover:!text-white mb-0.5" style={{ color: "#FFFFFF" }}>
                    {region.name}
                  </h4>
                  <p className="text-[11px] !text-white/70 line-clamp-1" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {region.subregions.length} Valleys · 3D Terrain
                  </p>
                  <div
                    className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold transition-transform group-hover:translate-x-1"
                    style={{ color: accent }}
                  >
                    <span>Fly to Territory</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Level 1 & 2: Subregion / Valley Bottom Dock (When Region is Active) ── */}
      {activeRegion && !selectedPlaceId && (
        <div className="absolute bottom-5 inset-x-4 z-20 pointer-events-auto">
          <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-white/20">
            {activeSubRegionId ? (
              <button
                onClick={() => {
                  setActiveSubRegionId(null);
                  setSelectedPlaceId(null);
                  const cam = TERRITORY_CAM[activeRegion.id] ?? [31.8, 77.1, 8.4, 72, 18];
                  flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 2000);
                }}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold !text-white bg-[#050914]/90 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all shadow-xl"
                style={{ color: "#FFFFFF" }}
              >
                <ChevronLeft className="w-3.5 h-3.5 text-primary" />
                <span style={{ color: "#FFFFFF" }}>All {activeRegion.name} Valleys</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium !text-white/80 hover:!text-white bg-[#050914]/90 backdrop-blur-xl border border-white/12 transition-all shadow-xl"
                style={{ color: "#FFFFFF" }}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span style={{ color: "#FFFFFF" }}>All Territories</span>
              </button>
            )}

            {activeRegion.subregions.map((sub) => {
              const isCurrent = activeSubRegionId === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubRegion(sub.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isCurrent
                      ? "!text-white shadow-lg"
                      : "!text-white/80 hover:!text-white bg-[#050914]/85 backdrop-blur-xl border border-white/10"
                  }`}
                  style={{
                    background: isCurrent ? currentAccent : undefined,
                    borderColor: isCurrent ? "rgba(255,255,255,0.4)" : undefined,
                    boxShadow: isCurrent ? `0 0 25px ${currentAccent}66` : undefined,
                    color: "#FFFFFF",
                  }}
                >
                  <span style={{ color: "#FFFFFF" }}>{sub.name}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                      isCurrent ? "bg-black/40 text-white font-bold" : "bg-white/15 text-white/80"
                    }`}
                    style={{ color: "#FFFFFF" }}
                  >
                    {sub.places.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Level 2: Valleys Drawer / Sidebar (Compact & Left-Docked) ────────── */}
      {activeRegion && isTerritoryDrawerOpen && !selectedPlaceId && (
        <div
          className="absolute top-28 left-3 sm:left-4 max-h-[380px] w-64 sm:w-72 z-20 flex flex-col rounded-2xl overflow-hidden border border-white/15 shadow-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ background: "rgba(5, 9, 20, 0.88)", backdropFilter: "blur(20px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10">
            <div>
              <div className="text-xs font-bold !text-white" style={{ color: "#FFFFFF" }}>
                {activeSubRegion ? activeSubRegion.name : `${activeRegion.name} Valleys`}
              </div>
              <div className="text-[10px] !text-white/60 font-mono" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                {scopedPlaces.length} Destinations
              </div>
            </div>
            <div className="flex items-center gap-1">
              {activeSubRegion && (
                <button
                  onClick={() => {
                    setActiveSubRegionId(null);
                    setSelectedPlaceId(null);
                    if (activeRegion) {
                      const cam = TERRITORY_CAM[activeRegion.id] ?? [INIT_CAM.lat, INIT_CAM.lng, INIT_CAM.zoom, INIT_CAM.pitch, 0];
                      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 2000, {
                        name: activeRegion.name,
                        subtitle: `${activeRegion.subregions.length} Alpine Valleys`,
                        category: "TERRITORY OVERVIEW",
                        accent: TERRITORY_ACCENT[activeRegion.id] ?? "#3B82F6",
                      });
                    }
                  }}
                  className="text-[9px] font-mono !text-white/70 hover:!text-white px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  style={{ color: "#FFFFFF" }}
                >
                  All Valleys
                </button>
              )}
              <button
                onClick={() => setIsTerritoryDrawerOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
                aria-label="Close Valleys List"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Place List with Altitude, Coordinates & Type */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin scrollbar-thumb-white/20">
            {scopedPlaces.length === 0 ? (
              <div className="text-center py-6 text-white/40 text-xs font-mono">
                No matching destinations found.
              </div>
            ) : (
              scopedPlaces.map((place) => (
                <button
                  key={`${place.id}-${place.name}`}
                  onClick={() => {
                    handleSelectPlace(place);
                    setIsTerritoryDrawerOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left group transition-all border border-transparent hover:border-white/15 hover:bg-white/5 cursor-pointer"
                >
                  <div className="min-w-0 pr-1.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs">{place.emoji}</span>
                      <span className="text-xs font-semibold !text-white group-hover:!text-white truncate" style={{ color: "#FFFFFF" }}>
                        {place.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/45">
                      {place.elevation && (
                        <span style={{ color: currentAccent }}>{place.elevation}</span>
                      )}
                      {place.difficulty && <span>· {place.difficulty}</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Level 3: Expedition Focus Capsule Briefing Card (Sleek Floating Sidebar, Left-docked) ── */}
      {selectedPlace && selectedPlaceLocation && (
        <div className="absolute bottom-5 left-3 sm:left-4 z-30 pointer-events-none w-[340px] sm:w-[360px] max-w-[calc(100vw-24px)]">
          <div
            className="pointer-events-auto relative w-full rounded-2xl p-4 sm:p-4.5 overflow-hidden border shadow-2xl transition-all"
            style={{
              background: "rgba(6, 11, 22, 0.94)",
              backdropFilter: "blur(24px)",
              borderColor: `${currentAccent}44`,
              boxShadow: `0 16px 40px rgba(0,0,0,0.75), 0 0 24px ${currentAccent}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
            }}
          >
            {/* Top Atmospheric Accent Line */}
            <div
              className="absolute top-0 inset-x-0 h-1 pointer-events-none"
              style={{
                background: `linear-gradient(to right, ${currentAccent}, ${currentAccent}44, transparent)`,
              }}
            />

            {/* Header: Subregion Pill, Territory Tag & Close / Back Button */}
            <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex-shrink-0"
                  style={{
                    color: currentAccent,
                    background: `${currentAccent}18`,
                    border: `1px solid ${currentAccent}35`,
                  }}
                >
                  {selectedPlace.type}
                </span>
                <span className="text-[11px] text-white/50 font-mono truncate">
                  {selectedPlaceLocation.subRegionName} · {selectedPlaceLocation.regionName}
                </span>
              </div>

              {/* Chronological Back / Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClosePlace();
                }}
                title={`Back to ${activeSubRegion?.name ?? "Valley"} (Esc)`}
                aria-label={`Back to ${activeSubRegion?.name ?? "Valley"}`}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Entity Name */}
            <h3
              className="text-base sm:text-lg font-display font-bold !text-white mb-1.5 relative z-10 leading-snug truncate"
              style={{ color: "#FFFFFF" }}
              title={selectedPlace.name}
            >
              {selectedPlace.name}
            </h3>

            {/* Overview Snippet */}
            {selectedPlace.overview && (
              <p
                className="text-xs !text-white/70 line-clamp-2 mb-3 leading-relaxed relative z-10"
                style={{ color: "rgba(255, 255, 255, 0.72)" }}
              >
                {selectedPlace.overview}
              </p>
            )}

            {/* Statistics Matrix (Compact 2x2 Grid) */}
            <div className="grid grid-cols-2 gap-1.5 mb-3.5 relative z-10">
              {selectedPlace.elevation && (
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/8">
                  <span className="text-[9px] font-mono uppercase !text-white/45">Alt</span>
                  <span className="text-xs font-mono font-bold !text-white" style={{ color: "#FFFFFF" }}>
                    {selectedPlace.elevation}
                  </span>
                </div>
              )}
              {selectedPlace.difficulty && (
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/8">
                  <span className="text-[9px] font-mono uppercase !text-white/45">Grade</span>
                  <span className="text-xs font-mono font-bold" style={{ color: currentAccent }}>
                    {selectedPlace.difficulty}
                  </span>
                </div>
              )}
              {selectedPlace.duration && (
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/8">
                  <span className="text-[9px] font-mono uppercase !text-white/45">Time</span>
                  <span className="text-xs font-mono font-bold !text-white truncate max-w-[95px] text-right" style={{ color: "#FFFFFF" }}>
                    {selectedPlace.duration}
                  </span>
                </div>
              )}
              {selectedPlace.bestSeason && (
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/8">
                  <span className="text-[9px] font-mono uppercase !text-white/45">Season</span>
                  <span className="text-xs font-mono font-bold !text-white truncate max-w-[95px] text-right" style={{ color: "#FFFFFF" }}>
                    {selectedPlace.bestSeason}
                  </span>
                </div>
              )}
            </div>

            {/* Action Row: Immediate Chronological Back + 3D Orbit + Open Guide */}
            <div className="flex items-center gap-2 relative z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClosePlace();
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex-shrink-0 cursor-pointer"
                title={`Back to ${activeSubRegion?.name ?? "Valley"}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="truncate max-w-[85px]">{activeSubRegion?.name ?? "Valley"}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOrbit();
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isOrbiting
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse"
                    : "text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
                }`}
                title={isOrbiting ? "Pause 3D Orbit" : "Orbit around this destination"}
              >
                <Orbit className={`w-3.5 h-3.5 ${isOrbiting ? "animate-spin text-slate-950" : "text-cyan-400"}`} />
                <span>{isOrbiting ? "Orbiting" : "3D Orbit"}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenPlace}
                disabled={navigating}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold tracking-wide transition-all group shadow-md cursor-pointer"
                style={{
                  background: currentAccent,
                  color: "#FFFFFF",
                  boxShadow: `0 4px 18px ${currentAccent}45`,
                }}
              >
                <span>{navigating ? "Loading…" : "Open Guide"}</span>
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

