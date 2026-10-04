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
  Navigation as NavigationIcon,
} from "lucide-react";
import { Trek } from "@/data/types";
import {
  himalayaAtlas,
  HimalayaPlace,
  PlaceLocation,
  placeLocationIndex,
} from "@/data/atlas";

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

/* ── Territory Camera Presets with dramatic 3D pitch aimed at mountain massifs ──── */
const TERRITORY_CAM: Record<string, [number, number, number, number, number]> = {
  // [lat, lng, zoom, pitch, bearing] - oriented looking northeast/east towards snowy peaks
  "jammu-kashmir":    [33.7,  74.8,  8.2, 70, 28],
  "himachal-pradesh": [31.8,  77.1,  8.4, 72, 18],
  ladakh:             [34.1,  77.5,  7.8, 68, -8],
  uttarakhand:        [30.2,  79.2,  8.3, 72, 22],
};

/* ── 27 Subregion / Valley Precision 3D Camera Targets ─────────────────────── */
const SUBREGION_CAM: Record<string, [number, number, number, number, number]> = {
  // Jammu & Kashmir
  jammu:               [33.35, 74.80,  9.6, 68, 10],
  kashmir:             [34.10, 74.90,  9.8, 68, 15],
  // Himachal Pradesh
  chamba:              [32.65, 76.25, 10.0, 68, 8],
  kangra:              [32.22, 76.38, 10.2, 68, 6],
  kullu:               [32.18, 77.22, 10.2, 68, 4],
  mandi:               [31.73, 76.96, 10.1, 68, 6],
  "lahaul-spiti":      [32.32, 77.78,  9.5, 68, 356],
  kinnaur:             [31.52, 78.36, 10.0, 68, 12],
  // Uttarakhand - Garhwal
  garhwal:             [30.74, 79.49, 10.0, 68, 6],
  chamoli:             [30.63, 79.55, 10.0, 68, 8],
  rudraprayag:         [30.56, 79.11, 10.2, 68, 5],
  uttarkashi:          [30.95, 78.59,  9.8, 68, 6],
  "pauri-garhwal":     [30.03, 78.79, 10.1, 68, 5],
  "tehri-garhwal":     [30.31, 78.47, 10.1, 68, 8],
  dehradun:            [30.42, 78.06, 10.2, 68, 4],
  haridwar:            [29.96, 78.17, 10.4, 66, 2],
  // Uttarakhand - Kumaon
  pithoragarh:         [30.18, 80.26,  9.7, 68, 8],
  bageshwar:           [30.06, 79.81, 10.1, 68, 6],
  almora:              [29.66, 79.67, 10.2, 68, 4],
  nainital:            [29.45, 79.33, 10.2, 68, 5],
  champawat:           [29.42, 80.07, 10.2, 68, 6],
  "udham-singh-nagar": [28.96, 79.81, 10.4, 65, 0],
  // Ladakh
  leh:                 [33.95, 77.75,  9.4, 68, 354],
  kargil:              [34.27, 76.18,  9.8, 68, 8],
  nubra:               [34.65, 77.29,  9.6, 68, 356],
  drass:               [34.43, 75.74, 10.1, 68, 6],
  zanskar:             [33.51, 76.98,  9.4, 68, 12],
};

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const routeListenersRef = useRef<{ layerId: string; fn: () => void }[]>([]);

  const initialPlaceLoc = initialFocusId ? placeLocationIndex.get(initialFocusId) : null;

  // ── Component State ───────────────────────────────────────────────────
  const [activeRegionId, setActiveRegionId]       = useState<string | null>(() => initialPlaceLoc?.regionId ?? null);
  const [activeSubRegionId, setActiveSubRegionId] = useState<string | null>(() => initialPlaceLoc?.subRegionId ?? null);
  const [selectedPlaceId, setSelectedPlaceId]     = useState<string | null>(() => initialFocusId ?? null);
  const [typeFilter, setTypeFilter]               = useState<FilterType>("all");
  const [searchQuery, setSearchQuery]             = useState("");
  const [isTerritoryDrawerOpen, setIsTerritoryDrawerOpen] = useState(false);
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
    (lat: number, lng: number, zoom: number, pitch = 68, bearing = 0, duration = 2400) => {
      if (orbitAnimRef.current) {
        cancelAnimationFrame(orbitAnimRef.current);
        orbitAnimRef.current = null;
        setIsOrbiting(false);
      }
      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom,
        pitch,
        bearing,
        duration,
        curve: 1.42,
        speed: 0.9,
        essential: true,
      });
    },
    []
  );

  // Smooth continuous 3D Orbit motion around current center
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
      const rotate = () => {
        if (!mapRef.current) return;
        const currentBearing = mapRef.current.getBearing();
        mapRef.current.setBearing((currentBearing + 0.18) % 360);
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
      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 2400);
    },
    [flyTo]
  );

  const handleSubRegion = useCallback(
    (subRegionId: string) => {
      setActiveSubRegionId(subRegionId);
      setSelectedPlaceId(null);
      const cam = SUBREGION_CAM[subRegionId] ?? [31.8, 77.2, 10.0, 68, 5];
      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 2000);
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
        flyTo(place.coords[0], place.coords[1], 12.8, 70, -15, 2000);
      }
    },
    [flyTo]
  );

  const handleOpenPlace = useCallback(() => {
    if (!selectedPlaceLocation) return;
    setNavigating(true);
    router.push(selectedPlaceLocation.href);
  }, [selectedPlaceLocation, router]);

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

      // Hyper-realistic 3D mountain terrain relief: 1.85x exaggeration
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.85 });

      // Atmospheric Himalayan Midnight Fog & Sky
      map.setFog({
        range: [0.6, 12.0],
        color: "#050914",
        "horizon-blend": 0.18,
        "high-color": "#020409",
        "space-color": "#010206",
        "star-intensity": 0.85,
      });

      if (initialFocusId) {
        const target = ALL_PLACES.find((p) => p.id === initialFocusId);
        if (target?.coords && target.coords.length === 2) {
          map.flyTo({
            center: [target.coords[1], target.coords[0]],
            zoom: 12.8,
            pitch: 70,
            bearing: -15,
            duration: 2200,
            essential: true,
          });
        }
      }

      setMapLoaded(true);
    });

    return () => {
      if (orbitAnimRef.current) {
        cancelAnimationFrame(orbitAnimRef.current);
        orbitAnimRef.current = null;
      }
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [mapboxToken, initialFocusId]);

  // ── Sync Markers & GeoJSON Paths ──────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clean up markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Clean up route listeners and layers
    for (const { layerId, fn } of routeListenersRef.current) {
      if (map.getLayer(layerId)) map.off("click", layerId, fn);
    }
    routeListenersRef.current = [];

    for (const trek of treks) {
      const sId = `source-${trek.slug}`,
        lId = `layer-${trek.slug}`,
        gId = `glow-${trek.slug}`;
      if (map.getLayer(gId)) map.removeLayer(gId);
      if (map.getLayer(lId)) map.removeLayer(lId);
      if (map.getSource(sId)) map.removeSource(sId);
    }

    // ── LEVEL 0: Overview Mode (No Territory Selected) ───────────────────
    // Instead of scattering 172 unreadable dots across the globe, render
    // 4 clean, interactive 3D Territorial Crest Badges at their regional centroids
    if (!activeRegionId) {
      const REGION_CENTROIDS: Record<string, { lat: number; lng: number; name: string; emoji: string }> = {
        "jammu-kashmir":    { lat: 33.9, lng: 74.9, name: "Jammu & Kashmir", emoji: "🏔️" },
        "himachal-pradesh": { lat: 32.1, lng: 77.2, name: "Himachal Pradesh", emoji: "🌲" },
        uttarakhand:        { lat: 30.3, lng: 79.2, name: "Uttarakhand", emoji: "🌿" },
        ladakh:             { lat: 34.1, lng: 77.4, name: "Ladakh", emoji: "🏜️" },
      };

      for (const region of himalayaAtlas) {
        const centroid = REGION_CENTROIDS[region.id];
        if (!centroid) continue;
        const accent = TERRITORY_ACCENT[region.id] ?? "#3B82F6";
        const count = region.subregions.reduce((a, s) => a + s.places.length, 0);

        const wrap = document.createElement("div");
        wrap.style.cssText =
          "position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer; user-select:none; z-index:20;";

        const badge = document.createElement("div");
        badge.style.cssText = `
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px;
          border-radius: 9999px;
          background: rgba(5, 9, 20, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1.5px solid ${accent}66;
          box-shadow: 0 8px 32px rgba(0,0,0,0.7), 0 0 24px ${accent}33;
          transform: translateY(0) scale(1);
          transition: all 240ms cubic-bezier(0.16, 1, 0.3, 1);
        `;

        badge.innerHTML = `
          <span style="font-size: 16px;">${region.emoji}</span>
          <div style="display:flex; flex-direction:column; text-align:left;">
            <span style="font-size: 12px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.02em;">${region.name}</span>
            <span style="font-size: 9px; font-family: monospace; color: ${accent}; font-weight: 600;">${count} EXPEDITIONS · ${region.subregions.length} VALLEYS</span>
          </div>
          <div style="width: 20px; height: 20px; border-radius: 50%; background: ${accent}22; display: flex; align-items: center; justify-content: center; margin-left: 4px;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        `;

        // Pulse beacon underneath badge
        const beacon = document.createElement("div");
        beacon.style.cssText = `
          width: 8px; height: 8px; border-radius: 50%;
          background: ${accent};
          box-shadow: 0 0 16px ${accent}, 0 0 32px ${accent}88;
          margin-top: 6px;
        `;

        wrap.appendChild(badge);
        wrap.appendChild(beacon);

        wrap.addEventListener("mouseenter", () => {
          badge.style.transform = "translateY(-4px) scale(1.06)";
          badge.style.borderColor = accent;
          badge.style.boxShadow = `0 12px 40px rgba(0,0,0,0.85), 0 0 36px ${accent}66`;
        });

        wrap.addEventListener("mouseleave", () => {
          badge.style.transform = "translateY(0) scale(1)";
          badge.style.borderColor = `${accent}66`;
          badge.style.boxShadow = `0 8px 32px rgba(0,0,0,0.7), 0 0 24px ${accent}33`;
        });

        wrap.addEventListener("click", (e) => {
          e.stopPropagation();
          handleRegion(region.id);
        });

        const marker = new mapboxgl.Marker({
          element: wrap,
          anchor: "bottom",
          pitchAlignment: "map",
          rotationAlignment: "map",
        })
          .setLngLat([centroid.lng, centroid.lat])
          .addTo(map);

        markersRef.current.push(marker);
      }
      return;
    }

    // ── LEVEL 1 & 2: Regional & Subregional Detailed Trail View ─────────
    // Only rendered when user has navigated into a territory or valley
    for (const place of scopedPlaces) {
      if (!place.coords || place.coords.length !== 2) continue;
      const [lat, lng] = place.coords;
      const isSelected = selectedPlaceId === place.id;
      const loc = placeLocationIndex.get(place.id);
      const placeAccent = loc ? TERRITORY_ACCENT[loc.regionId] ?? "#3B82F6" : "#3B82F6";

      // Render GeoJSON trail if available
      const trekData = treks.find((t) => t.slug === place.id);
      if (trekData?.pathCoords && trekData.pathCoords.length > 1) {
        const sId = `source-${trekData.slug}`;
        const lId = `layer-${trekData.slug}`;
        const gId = `glow-${trekData.slug}`;

        map.addSource(sId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: { id: place.id, name: place.name },
            geometry: {
              type: "LineString",
              coordinates: trekData.pathCoords.map(([la, ln]) => [ln, la]),
            },
          },
        });

        map.addLayer({
          id: gId,
          type: "line",
          source: sId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": isSelected ? "#F59E0B" : placeAccent,
            "line-width": isSelected ? 11 : 6,
            "line-opacity": isSelected ? 0.6 : 0.25,
            "line-blur": 4,
          },
        });

        map.addLayer({
          id: lId,
          type: "line",
          source: sId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": isSelected ? "#FDE047" : "#E2E8F0",
            "line-width": isSelected ? 3.5 : 2.0,
            "line-opacity": 0.95,
          },
        });

        const fn = () => handleSelectPlace(place);
        map.on("click", lId, fn);
        routeListenersRef.current.push({ layerId: lId, fn });
      }

      // Build Interactive Pin Marker with Crisp Himalayan Typography
      const wrap = document.createElement("div");
      wrap.style.cssText =
        "position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer; user-select:none; width: 24px; height: 24px; justify-content: center;";

      // Pill label with altitude badge (positioned above pin)
      const label = document.createElement("div");
      label.innerHTML = `
        <span style="font-weight:700; color:#F8FAFC;">${place.name}</span>
        ${
          place.elevation
            ? `<span style="margin-left:4px; font-family:monospace; font-size:9px; color:${placeAccent}; opacity:0.9;">${place.elevation}</span>`
            : ""
        }
      `;
      label.style.cssText = `
        position: absolute; bottom: 28px;
        left: 50%; transform: translateX(-50%);
        white-space: nowrap;
        font-size: 11px;
        letter-spacing: 0.02em;
        padding: 4px 10px;
        border-radius: 9999px;
        background: rgba(5, 9, 20, 0.94);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid ${isSelected ? "#F59E0B" : "rgba(255,255,255,0.18)"};
        box-shadow: 0 4px 16px rgba(0,0,0,0.65);
        pointer-events: none;
        opacity: ${isSelected ? "1" : "0"};
        transition: opacity 160ms ease;
        z-index: ${isSelected ? "50" : "10"};
      `;

      // Central Fixed Dot
      const pinNode = document.createElement("div");
      const dotColor = isSelected ? "#F59E0B" : placeAccent;
      pinNode.style.cssText = `
        width: ${isSelected ? "14px" : "10px"};
        height: ${isSelected ? "14px" : "10px"};
        border-radius: 50%;
        background: ${dotColor};
        border: 2px solid rgba(255,255,255,${isSelected ? "1" : "0.85"});
        box-shadow: 0 0 ${isSelected ? "18px" : "8px"} ${dotColor},
                    0 0 ${isSelected ? "36px" : "16px"} ${dotColor}88;
        transition: transform 160ms ease, box-shadow 160ms ease;
      `;

      wrap.appendChild(label);
      wrap.appendChild(pinNode);

      wrap.addEventListener("mouseenter", () => {
        label.style.opacity = "1";
        pinNode.style.transform = "scale(1.35)";
      });

      wrap.addEventListener("mouseleave", () => {
        if (!isSelected) {
          label.style.opacity = "0";
          pinNode.style.transform = "scale(1)";
        }
      });

      wrap.addEventListener("click", (e) => {
        e.stopPropagation();
        handleSelectPlace(place);
      });

      const marker = new mapboxgl.Marker({
        element: wrap,
        anchor: "center",
        pitchAlignment: "viewport",
        rotationAlignment: "viewport",
      })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.push(marker);
    }
  }, [mapLoaded, scopedPlaces, selectedPlaceId, treks, handleSelectPlace, activeRegionId, handleRegion]);

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
    <div className="relative w-full h-full min-h-[640px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#03060d] select-none">
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
                className="font-bold text-white transition-colors truncate max-w-[100px] sm:max-w-none"
                style={{ color: currentAccent }}
              >
                {activeSubRegion.name}
              </button>
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
          {/* 3D Orbit Motion Button */}
          <button
            onClick={toggleOrbit}
            title={isOrbiting ? "Pause 3D Orbit" : "Start 3D Cinematic Orbit"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl text-xs font-semibold backdrop-blur-xl border transition-all shadow-xl ${
              isOrbiting
                ? "bg-primary text-white border-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                : "bg-[#050914]/90 text-white/80 hover:text-white border-white/12 hover:border-white/30"
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

          {/* Perspective Tilt Toggle */}
          <button
            onClick={togglePerspective}
            title="Toggle Ridge View vs High Angle"
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl text-xs font-semibold bg-[#050914]/90 backdrop-blur-xl border border-white/12 text-white/80 hover:text-white hover:border-white/30 transition-all shadow-xl"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Ridge View</span>
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl text-xs font-semibold bg-[#050914]/90 backdrop-blur-xl border border-white/12 text-white/80 hover:text-white hover:border-white/30 transition-all shadow-xl"
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
        </div>

        {/* 3D Tilt & Orientation Block */}
        <div className="flex flex-col bg-[#050914]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-1 shadow-2xl">
          {/* Tilt Up */}
          <button
            onClick={handlePitchMore}
            title="Tilt 3D Angle Up"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors text-[10px] font-mono font-bold"
          >
            3D↑
          </button>
          {/* Tilt Flat */}
          <button
            onClick={handlePitchLess}
            title="Tilt 2D Overhead"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors text-[10px] font-mono font-bold border-t border-white/10"
          >
            2D↓
          </button>
          {/* Reset North Compass */}
          <button
            onClick={handleResetNorth}
            title="Reset North Compass & Tilt"
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
                  <h4 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-white mb-0.5">
                    {region.name}
                  </h4>
                  <p className="text-[11px] text-white/50 line-clamp-1">
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

      {/* ── Level 1: Subregion / Valley Bottom Dock (When Region is Active) ── */}
      {activeRegion && !selectedPlaceId && (
        <div className="absolute bottom-5 inset-x-4 z-20 pointer-events-auto">
          <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-white/20">
            <button
              onClick={handleReset}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-white/60 hover:text-white bg-[#050914]/90 backdrop-blur-xl border border-white/12 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>All Territories</span>
            </button>

            {activeRegion.subregions.map((sub) => {
              const isCurrent = activeSubRegionId === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubRegion(sub.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isCurrent
                      ? "text-white shadow-lg"
                      : "text-white/75 hover:text-white bg-[#050914]/85 backdrop-blur-xl border border-white/10"
                  }`}
                  style={{
                    background: isCurrent ? currentAccent : undefined,
                    borderColor: isCurrent ? "rgba(255,255,255,0.3)" : undefined,
                    boxShadow: isCurrent ? `0 0 25px ${currentAccent}66` : undefined,
                  }}
                >
                  <span>{sub.name}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                      isCurrent ? "bg-black/30 text-white" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {sub.places.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Level 2: Valleys Drawer / Sidebar (Desktop & Mobile) ────────── */}
      {activeRegion && (isTerritoryDrawerOpen || activeSubRegion) && !selectedPlaceId && (
        <div
          className="absolute top-16 right-4 bottom-24 w-72 sm:w-80 z-20 flex flex-col rounded-2xl overflow-hidden border border-white/12 shadow-2xl transition-all"
          style={{ background: "rgba(5, 9, 20, 0.94)", backdropFilter: "blur(24px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div>
              <div className="text-xs font-bold text-white">
                {activeSubRegion ? activeSubRegion.name : `${activeRegion.name} Valleys`}
              </div>
              <div className="text-[10px] text-white/50 font-mono">
                {scopedPlaces.length} Destinations Available
              </div>
            </div>
            <div className="flex items-center gap-1">
              {activeSubRegion && (
                <button
                  onClick={() => setActiveSubRegionId(null)}
                  className="text-[10px] font-mono text-white/50 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                >
                  All Valleys
                </button>
              )}
              <button
                onClick={() => setIsTerritoryDrawerOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Place List with Altitude, Coordinates & Type */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/20">
            {scopedPlaces.length === 0 ? (
              <div className="text-center py-8 text-white/40 text-xs font-mono">
                No matching destinations found.
              </div>
            ) : (
              scopedPlaces.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left group transition-all border border-transparent hover:border-white/15 hover:bg-white/5"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs">{place.emoji}</span>
                      <span className="text-xs font-semibold text-white/90 group-hover:text-white truncate">
                        {place.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/45">
                      {place.elevation && (
                        <span style={{ color: currentAccent }}>{place.elevation}</span>
                      )}
                      {place.difficulty && <span>· {place.difficulty}</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Level 3: Expedition Focus Capsule Briefing Card ───────────── */}
      {selectedPlace && selectedPlaceLocation && (
        <div
          className="absolute inset-x-0 bottom-0 z-30 p-4 sm:p-6"
          style={{ background: "linear-gradient(to top, rgba(3,6,13,0.98) 75%, transparent)" }}
        >
          <div
            className="relative mx-auto max-w-xl rounded-2xl p-5 sm:p-6 overflow-hidden border"
            style={{
              background: "rgba(7, 13, 26, 0.96)",
              backdropFilter: "blur(32px)",
              borderColor: `${currentAccent}55`,
              boxShadow: `0 0 60px ${currentAccent}25, 0 20px 50px rgba(0,0,0,0.85)`,
            }}
          >
            {/* Top Atmospheric Radial Flare */}
            <div
              className="absolute top-0 inset-x-0 h-28 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${currentAccent}25, transparent 75%)`,
              }}
            />

            {/* Close Button */}
            <button
              onClick={() => setSelectedPlaceId(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Subregion Pill & Territory Tag */}
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  color: currentAccent,
                  background: `${currentAccent}18`,
                  border: `1px solid ${currentAccent}35`,
                }}
              >
                {selectedPlace.type}
              </span>
              <span className="text-[11px] text-white/50 font-mono">
                {selectedPlaceLocation.subRegionName} · {selectedPlaceLocation.regionName}
              </span>
            </div>

            {/* Entity Name */}
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2.5 relative z-10 leading-snug">
              {selectedPlace.name}
            </h3>

            {/* Overview Snippet */}
            {selectedPlace.overview && (
              <p className="text-xs sm:text-sm text-white/65 line-clamp-2 mb-4 leading-relaxed relative z-10">
                {selectedPlace.overview}
              </p>
            )}

            {/* Statistics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5 relative z-10">
              {selectedPlace.elevation && (
                <div className="p-2 rounded-xl bg-white/5 border border-white/8 text-center">
                  <span className="block text-[9px] font-mono uppercase text-white/40">Altitude</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {selectedPlace.elevation}
                  </span>
                </div>
              )}
              {selectedPlace.difficulty && (
                <div className="p-2 rounded-xl bg-white/5 border border-white/8 text-center">
                  <span className="block text-[9px] font-mono uppercase text-white/40">Grade</span>
                  <span className="text-xs font-mono font-bold" style={{ color: currentAccent }}>
                    {selectedPlace.difficulty}
                  </span>
                </div>
              )}
              {selectedPlace.duration && (
                <div className="p-2 rounded-xl bg-white/5 border border-white/8 text-center">
                  <span className="block text-[9px] font-mono uppercase text-white/40">Duration</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {selectedPlace.duration}
                  </span>
                </div>
              )}
              {selectedPlace.bestSeason && (
                <div className="p-2 rounded-xl bg-white/5 border border-white/8 text-center">
                  <span className="block text-[9px] font-mono uppercase text-white/40">Season</span>
                  <span className="text-xs font-mono font-bold text-white truncate">
                    {selectedPlace.bestSeason}
                  </span>
                </div>
              )}
            </div>

            {/* Call to Action Button */}
            <button
              onClick={handleOpenPlace}
              disabled={navigating}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold tracking-wide transition-all relative z-10 group"
              style={{
                background: currentAccent,
                color: "#ffffff",
                boxShadow: `0 4px 24px ${currentAccent}55`,
              }}
            >
              <span>{navigating ? "Loading Expedition Guide…" : "Open Detailed Expedition Guide"}</span>
              {!navigating && (
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

