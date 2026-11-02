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
  buildAtlasLandmarksGeoJSON,
  ALL_ATLAS_PLACES,
  AtlasLandmarkProperties,
} from "@/lib/atlas-landmarks";
import { useHimalayanTheme } from "@/lib/use-theme";
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
const INIT_CAM = { lat: 32.24, lng: 77.18, zoom: 9.3, pitch: 42, bearing: 0 };

/* ── Territory Accents ───────────────────────────────────────────────────── */
const TERRITORY_ACCENT: Record<string, string> = {
  "jammu-kashmir":    "#3B82F6", // Glacier Blue
  "himachal-pradesh": "#F59E0B", // Amber Gold
  ladakh:             "#8B5CF6", // High Alpine Purple
  uttarakhand:        "#0D9488", // Emerald Pine
};

/* ── Territory Camera Presets: Google Earth Alpine Viewpoints ─────────────── */
const TERRITORY_CAM: Record<string, [number, number, number, number, number]> = {
  // [lat, lng, zoom, pitch, bearing] - Centered directly in the mountain heartland of each territory
  "himachal-pradesh": [32.00, 77.15, 8.70, 38, 0],   // Centered on Kullu, Mandi, Kangra, Parvati & Spiti
  "jammu-kashmir":    [34.10, 74.90, 8.70, 38, 350], // Kashmir Valley, Pir Panjal, Great Lakes & Sonmarg
  ladakh:             [34.15, 77.58, 8.25, 35, 355], // Leh, Indus Valley, Zanskar, Nubra & Pangong
  uttarakhand:        [30.50, 79.15, 8.65, 38, 5],   // Garhwal, Chamoli, Nanda Devi, Alaknanda & Char Dham
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

/* ── Authentic Valley-Corridor Camera Angles & Pitch for Verified Routes ── */
const ROUTE_CAMERA_PRESETS: Record<string, { bearing: number; pitch?: number }> = {
  "beas-kund":            { bearing: 288, pitch: 58 },
  "hampta-pass":          { bearing: 18,  pitch: 58 },
  "patalsu-peak":         { bearing: 15,  pitch: 62 },
  "bhrigu-lake":          { bearing: 110, pitch: 58 },
  "kashmir-great-lakes":  { bearing: 55,  pitch: 58 },
  "tarsar-marsar":        { bearing: 292, pitch: 58 },
  "pin-parvati-pass":     { bearing: 105, pitch: 55 },
  "pin-bhaba-pass":       { bearing: 355, pitch: 58 },
  "deo-tibba":            { bearing: 88,  pitch: 58 },
  "indrahar-pass":        { bearing: 52,  pitch: 58 },
  "triund":               { bearing: 75,  pitch: 58 },
  "kareri-lake":          { bearing: 12,  pitch: 58 },
  "valley-of-flowers":    { bearing: 32,  pitch: 58 },
  "hemkund-sahib":        { bearing: 35,  pitch: 58 },
  "kedarkantha":          { bearing: 200, pitch: 58 },
  "roopkund-trek":        { bearing: 74,  pitch: 58 },
  "gangotri-gaumukh":     { bearing: 122, pitch: 58 },
  "dayara-bugyal":        { bearing: 295, pitch: 58 },
  "chopta-tungnath":      { bearing: 86,  pitch: 58 },
  "kuari-pass":           { bearing: 215, pitch: 58 },
  "dodital":              { bearing: 25,  pitch: 58 },
  "deoria-tal":           { bearing: 78,  pitch: 58 },
  "kinner-kailash":       { bearing: 84,  pitch: 58 },
  "madhyamaheshwar":      { bearing: 58,  pitch: 58 },
  "manimahesh-kailash":   { bearing: 160, pitch: 58 },
  "rupin-pass-kinnaur":   { bearing: 20,  pitch: 58 },
  "satopanth-tal-trek":   { bearing: 260, pitch: 58 },
  "vasudhara-falls":      { bearing: 295, pitch: 58 },
  "markha-valley":        { bearing: 160, pitch: 55 },
  "lamadugh":             { bearing: 253, pitch: 58 },
  "jogni-falls":          { bearing: 35,  pitch: 62 },
  "chandrakhani-pass":    { bearing: 125, pitch: 58 },
  "jalori-pass-serolsar": { bearing: 90,  pitch: 58 },
  "kheerganga":           { bearing: 95,  pitch: 58 },
  "kamrunag-lake":        { bearing: 60,  pitch: 58 },
};

const ALL_PLACES: HimalayaPlace[] = ALL_ATLAS_PLACES;

export default function GlobalMapClient({ treks: _treks, initialFocusId }: GlobalMapClientProps) {
  void _treks;
  const theme = useHimalayanTheme();
  const isDark = theme === "dark";
  const isDarkRef = useRef(isDark);
  useEffect(() => {
    isDarkRef.current = isDark;
  });

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);

  const initialPlaceLoc = initialFocusId ? placeLocationIndex.get(initialFocusId) : null;

  // ── Component State ───────────────────────────────────────────────────
  const [activeRegionId, setActiveRegionId]       = useState<string | null>(() => initialPlaceLoc?.regionId ?? null);
  const [activeSubRegionId, setActiveSubRegionId] = useState<string | null>(() => initialPlaceLoc?.subRegionId ?? null);
  const [selectedPlaceId, setSelectedPlaceId]     = useState<string | null>(() => initialFocusId ?? null);
  const [isDrawerOpen, setIsDrawerOpen]           = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const isDrawerOpenRef = useRef(isDrawerOpen);
  useEffect(() => {
    isDrawerOpenRef.current = isDrawerOpen;
    // When drawer collapses or expands, smoothly recalculate WebGL canvas viewport
    if (mapRef.current) {
      setTimeout(() => {
        try {
          mapRef.current?.resize();
        } catch {}
      }, 350);
    }
  }, [isDrawerOpen]);
  const [isFullscreen, setIsFullscreen]           = useState(false);
  const [mapLoaded, setMapLoaded]                 = useState(false);
  const [bearing, setBearing]                     = useState<number>(INIT_CAM.bearing);
  const [navigating, setNavigating]               = useState(false);

  const [isOrbiting, setIsOrbiting]               = useState(false);
  const orbitAnimRef = useRef<number | null>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // ── Derived Data ──────────────────────────────────────────────────────
  const activeRegion = useMemo(
    () => himalayaAtlas.find((r) => r.id === activeRegionId) ?? null,
    [activeRegionId]
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

  // ── Cinematic 3D Camera Controls ──────────────────────────────────────
  const flyTo = useCallback(
    (
      lat: number,
      lng: number,
      zoom: number,
      pitch = 54,
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
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
      const leftPad = isDrawerOpenRef.current && isDesktop ? 384 : 0;

      map.flyTo({
        center: [lng, lat],
        zoom,
        pitch: safePitch,
        bearing: shortestBearing,
        duration,
        curve: 1.42,
        speed: 0.9,
        essential: true,
        padding: {
          left: leftPad,
          right: 0,
          top: 0,
          bottom: 0,
        },
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
    setBearing(0);
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
      if (regionId === "all") {
        handleResetAtlas();
        return;
      }
      setActiveRegionId(regionId);
      setActiveSubRegionId(null);
      setSelectedPlaceId(null);
      const cam = TERRITORY_CAM[regionId] ?? [INIT_CAM.lat, INIT_CAM.lng, INIT_CAM.zoom, INIT_CAM.pitch, 0];
      flyTo(cam[0], cam[1], cam[2], cam[3], cam[4], 2200);
    },
    [flyTo, handleResetAtlas]
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

      const map = mapRef.current;
      if (!map) return;

      if (orbitAnimRef.current) {
        cancelAnimationFrame(orbitAnimRef.current);
        orbitAnimRef.current = null;
        setIsOrbiting(false);
      }

      // If route has line coordinates, compute bounded camera fitting the entire route on 3D terrain
      if (routeData?.line?.coordinates && routeData.line.coordinates.length > 1) {
        const coords = routeData.line.coordinates;
        let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
        let maxEle = -Infinity, apexPt = coords[0];
        for (const c of coords) {
          if (c[0] < minLng) minLng = c[0];
          if (c[0] > maxLng) maxLng = c[0];
          if (c[1] < minLat) minLat = c[1];
          if (c[1] > maxLat) maxLat = c[1];
          if (c[2] && c[2] > maxEle) {
            maxEle = c[2];
            apexPt = c;
          }
        }

        const preset = ROUTE_CAMERA_PRESETS[routeId];
        let targetBearing = preset?.bearing;
        if (typeof targetBearing !== "number") {
          const start = coords[0];
          const dLng = apexPt[0] - start[0];
          const dLat = apexPt[1] - start[1];
          let ascentBearing = Math.round((Math.atan2(dLng, dLat) * 180) / Math.PI);
          if (ascentBearing < 0) ascentBearing += 360;
          targetBearing = (ascentBearing + 15) % 360;
        }

        const targetPitch = preset?.pitch ?? 58;
        const curBearing = map.getBearing();
        const shortestBearing = curBearing + shortestAngleDiff(targetBearing, curBearing);

        const bounds = new mapboxgl.LngLatBounds([minLng, minLat], [maxLng, maxLat]);
        const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
        const leftPad = isDrawerOpenRef.current && isDesktop ? 415 : 70;

        const camera = map.cameraForBounds(bounds, {
          padding: {
            top: isDesktop ? 90 : 70,
            bottom: isDesktop ? 140 : 200,
            left: leftPad,
            right: isDesktop ? 75 : 30,
          },
          bearing: shortestBearing,
          pitch: targetPitch,
          maxZoom: 13.8,
        });

        if (camera) {
          map.flyTo({
            center: camera.center,
            zoom: camera.zoom,
            bearing: shortestBearing,
            pitch: targetPitch,
            duration: 2200,
            curve: 1.42,
            speed: 0.85,
            essential: true,
          });
        }
      } else {
        const place = ALL_PLACES.find((p) => p.id === routeId);
        if (place?.coords && place.coords.length === 2) {
          const heading = 8;
          const rad = (heading * Math.PI) / 180;
          const dist = 0.022;
          const camLat = place.coords[0] - dist * Math.cos(rad);
          const camLng = place.coords[1] - dist * Math.sin(rad);
          flyTo(camLat, camLng, 13.5, 68, heading, 2000);
        }
      }
    },
    [flyTo]
  );

  const handleSelectPlace = useCallback(
    (place: HimalayaPlace) => {
      // If this place corresponds to a verified trail route, defer to route camera framing
      if (routesMap[place.id as keyof typeof routesMap]) {
        handleSelectRoute(place.id);
        return;
      }

      const loc = placeLocationIndex.get(place.id);
      if (loc) {
        setActiveRegionId(loc.regionId);
        setActiveSubRegionId(loc.subRegionId);
      }
      setSelectedPlaceId(place.id);
      if (place.coords && place.coords.length === 2) {
        const heading = 8;
        const rad = (heading * Math.PI) / 180;
        const dist = 0.022;
        const camLat = place.coords[0] - dist * Math.cos(rad);
        const camLng = place.coords[1] - dist * Math.sin(rad);

        flyTo(camLat, camLng, 13.5, 68, heading, 2000);
      }
    },
    [flyTo, handleSelectRoute]
  );

  // Stable handler refs to prevent Mapbox WebGL re-initialization on state updates
  const handleSelectRouteRef = useRef(handleSelectRoute);
  const handleSelectPlaceRef = useRef(handleSelectPlace);

  useEffect(() => {
    handleSelectRouteRef.current = handleSelectRoute;
    handleSelectPlaceRef.current = handleSelectPlace;
  });

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
      } else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        handleResetNorth();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === "3") {
        e.preventDefault();
        togglePerspective();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFullscreen, selectedPlaceId, handleCloseSelection, handleResetNorth, handleZoomIn, handleZoomOut, togglePerspective]);

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
      fadeDuration: 150,
      maxTileCacheSize: 80,
      collectResourceTiming: false,
    });

    mapRef.current = map;

    if (typeof window !== "undefined") {
      const win = window as unknown as Record<string, unknown>;
      win.__map = map;
      win.__selectRoute = (id: string) => handleSelectRouteRef.current(id);
      win.__closeSelection = () => handleCloseSelection();
      win.__getRouteData = getRouteData;
    }

    map.on("load", () => {
      // 3D DEM Terrain
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.25 });

      // Atmospheric Himalayan Fog & Skybox (Theme-Aware)
      if (theme === "light") {
        map.setFog({
          range: [1.0, 12.0],
          color: "rgb(186, 210, 235)",
          "horizon-blend": 0.15,
          "high-color": "rgb(36, 92, 223)",
          "space-color": "rgb(11, 24, 44)",
          "star-intensity": 0.0,
        });
      } else {
        map.setFog({
          range: [0.6, 12.0],
          color: "#050914",
          "horizon-blend": 0.18,
          "high-color": "#020409",
          "space-color": "#010206",
          "star-intensity": 0.85,
        });
      }

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

      // Track camera bearing in real-time for dynamic rotating compass
      map.on("rotate", () => {
        setBearing(Math.round(map.getBearing()));
      });

      // Pre-load initial focus if deep link provided
      if (initialFocusId) {
        if (routesMap[initialFocusId as keyof typeof routesMap]) {
          handleSelectRouteRef.current(initialFocusId);
        } else {
          const target = ALL_PLACES.find((p) => p.id === initialFocusId);
          if (target) handleSelectPlaceRef.current(target);
        }
      }

      // Ingest all Himalayan landmarks into native GPU source
      const landmarksGeoJSON = buildAtlasLandmarksGeoJSON(initialFocusId, activeRegionId);
      map.addSource("atlas-landmarks-source", {
        type: "geojson",
        data: landmarksGeoJSON,
        promoteId: "id",
      });

      // Layer 1: Ambient Ground Halo on 3D terrain mesh
      map.addLayer({
        id: "atlas-landmarks-halo",
        type: "circle",
        source: "atlas-landmarks-source",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 14,
              ["==", ["get", "isSelected"], true], 13,
              ["<=", ["get", "tier"], 1], 9,
              6
            ],
            11,
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 20,
              ["==", ["get", "isSelected"], true], 18,
              ["<=", ["get", "tier"], 1], 13,
              9
            ],
            14,
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 26,
              ["==", ["get", "isSelected"], true], 24,
              ["<=", ["get", "tier"], 1], 18,
              12
            ]
          ],
          "circle-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false], "#38BDF8",
            ["==", ["get", "isSelected"], true], "#38BDF8",
            ["get", "color"]
          ],
          "circle-opacity": [
            "step",
            ["zoom"],
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 0.75,
              ["==", ["get", "isSelected"], true], 0.65,
              ["<=", ["get", "tier"], 1], 0.40,
              0.0
            ],
            9.4,
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 0.75,
              ["==", ["get", "isSelected"], true], 0.65,
              ["<=", ["get", "tier"], 2], 0.35,
              0.0
            ],
            11.0,
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 0.75,
              ["==", ["get", "isSelected"], true], 0.65,
              0.28
            ]
          ],
          "circle-blur": 0.65,
          "circle-pitch-alignment": "map",
        },
      });

      // Layer 2: Core crisp circular beacon
      map.addLayer({
        id: "atlas-landmarks-circle",
        type: "circle",
        source: "atlas-landmarks-source",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 7.5,
              ["==", ["get", "isSelected"], true], 6.0,
              ["<=", ["get", "tier"], 1], 4.5,
              2.8
            ],
            10,
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 8.5,
              ["==", ["get", "isSelected"], true], 8.0,
              ["<=", ["get", "tier"], 1], 6.0,
              4.2
            ],
            13,
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 11.5,
              ["==", ["get", "isSelected"], true], 11.0,
              ["<=", ["get", "tier"], 1], 7.5,
              5.8
            ]
          ],
          "circle-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false], "#38BDF8",
            ["==", ["get", "isSelected"], true], "#38BDF8",
            ["get", "color"]
          ],
          "circle-stroke-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 2.5,
              ["==", ["get", "isSelected"], true], 2.5,
              1.2
            ],
            12,
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 2.8,
              ["==", ["get", "isSelected"], true], 2.8,
              1.8
            ]
          ],
          "circle-stroke-color": "#FFFFFF",
          "circle-opacity": [
            "step",
            ["zoom"],
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 1.0,
              ["==", ["get", "isSelected"], true], 0.98,
              ["<=", ["get", "tier"], 1], 0.95,
              0.0
            ],
            9.4,
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 1.0,
              ["==", ["get", "isSelected"], true], 0.98,
              ["<=", ["get", "tier"], 2], 0.95,
              0.0
            ],
            11.0,
            0.98
          ],
          "circle-stroke-opacity": [
            "step",
            ["zoom"],
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 1.0,
              ["==", ["get", "isSelected"], true], 1.0,
              ["<=", ["get", "tier"], 1], 0.95,
              0.0
            ],
            9.4,
            [
              "case",
              ["boolean", ["feature-state", "hover"], false], 1.0,
              ["==", ["get", "isSelected"], true], 1.0,
              ["<=", ["get", "tier"], 2], 0.95,
              0.0
            ],
            11.0,
            1.0
          ],
          "circle-pitch-alignment": "map",
        },
      });

      // Layer 3: Viewport-aligned typography with 2-line altitude label
      map.addLayer({
        id: "atlas-landmarks-label",
        type: "symbol",
        source: "atlas-landmarks-source",
        layout: {
          "text-field": [
            "step",
            ["zoom"],
            [
              "case",
              ["==", ["get", "isSelected"], true], ["get", "fullLabel"],
              ["<=", ["get", "tier"], 1], ["get", "shortLabel"],
              ""
            ],
            8.4,
            [
              "case",
              ["==", ["get", "isSelected"], true], ["get", "fullLabel"],
              ["<=", ["get", "tier"], 1], ["get", "fullLabel"],
              ""
            ],
            9.4,
            [
              "case",
              ["==", ["get", "isSelected"], true], ["get", "fullLabel"],
              ["<=", ["get", "tier"], 1], ["get", "fullLabel"],
              ["<=", ["get", "tier"], 2], ["get", "fullLabel"],
              ""
            ],
            11.0,
            ["get", "fullLabel"]
          ],
          "text-size": [
            "interpolate", ["linear"], ["zoom"],
            8, 10,
            10.5, 11,
            13, 12.5
          ],
          "text-variable-anchor": ["top", "bottom", "left", "right"],
          "text-radial-offset": [
            "interpolate", ["linear"], ["zoom"],
            8, 0.7,
            12, 1.0
          ],
          "text-justify": "center",
          "text-optional": true,
          "text-allow-overlap": false,
          "text-ignore-placement": false,
          "symbol-sort-key": ["get", "tier"],
          "text-pitch-alignment": "viewport",
          "text-max-width": 12,
        },
        paint: {
          "text-color": [
            "case",
            ["==", ["get", "isSelected"], true], "#38BDF8",
            ["==", ["get", "isApex"], true], "#FDE047",
            ["==", ["get", "isTrailhead"], true], "#6EE7B7",
            "#F8FAFC"
          ],
          "text-halo-color": "rgba(4, 8, 18, 0.96)",
          "text-halo-width": 2.2,
          "text-halo-blur": 0.5,
        },
      });

      // Interactive Direct Hover & Name Display (Strictly ON pointer only)
      const hoverPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: [0, -10],
        className: "atlas-landmark-hover-popup",
      });
      hoverPopupRef.current = hoverPopup;

      let hoveredFeatureId: string | null = null;
      let mouseMoveRaf: number | null = null;
      let pendingPoint: mapboxgl.Point | null = null;

      const clearHover = () => {
        if (mouseMoveRaf !== null) {
          cancelAnimationFrame(mouseMoveRaf);
          mouseMoveRaf = null;
        }
        pendingPoint = null;
        if (hoveredFeatureId !== null) {
          try {
            map.setFeatureState(
              { source: "atlas-landmarks-source", id: hoveredFeatureId },
              { hover: false }
            );
          } catch {}
          hoveredFeatureId = null;
        }
        hoverPopup.remove();
        map.getCanvas().style.cursor = "";
      };

      const getTargetFeatureAtCursor = (point: mapboxgl.Point) => {
        if (!map.isStyleLoaded() || !map.getSource("atlas-landmarks-source")) return null;

        // Strictly query ONLY the circle marker beacon, NOT the text label bounding box
        if (!map.getLayer("atlas-landmarks-circle")) return null;

        const features = map.queryRenderedFeatures(point, {
          layers: ["atlas-landmarks-circle"],
        });

        if (!features || features.length === 0) return null;
        const feat = features[0];
        const props = feat.properties as AtlasLandmarkProperties | undefined;
        if (!props) return null;

        // Verify landmark is actually visible at current zoom to prevent phantom hover on hidden tiers
        const currentZoom = map.getZoom();
        const tier = Number(props.tier ?? 3);
        const isSelected = Boolean(props.isSelected);
        if (!isSelected) {
          if (tier > 2 && currentZoom < 11.0) return null;
          if (tier > 1 && currentZoom < 9.4) return null;
        }

        return feat;
      };

      const processHover = () => {
        mouseMoveRaf = null;
        if (!pendingPoint) return;

        const feat = getTargetFeatureAtCursor(pendingPoint);
        if (!feat) {
          clearHover();
          return;
        }

        const props = feat.properties as AtlasLandmarkProperties;
        if (!props) {
          clearHover();
          return;
        }

        const featId = (feat.id ?? props.id) as string;
        const geom = feat.geometry as GeoJSON.Point;
        const coords = geom.coordinates as [number, number];

        if (hoveredFeatureId !== featId) {
          if (hoveredFeatureId !== null) {
            try {
              map.setFeatureState(
                { source: "atlas-landmarks-source", id: hoveredFeatureId },
                { hover: false }
              );
            } catch {}
          }
          hoveredFeatureId = featId;
          try {
            map.setFeatureState(
              { source: "atlas-landmarks-source", id: featId },
              { hover: true }
            );
          } catch {}
        }

        map.getCanvas().style.cursor = "pointer";

        const isCurrentDark = isDarkRef.current;
        const cleanName = props.name || props.shortLabel || "Himalayan Destination";
        const eleStr = props.elevation ? props.elevation.replace(/\s*m$/i, "") + "m" : "";
        const accent = props.color || "#38BDF8";
        const symbol = props.shortLabel ? props.shortLabel.slice(0, 1) : "●";

        const bg = isCurrentDark ? "rgba(10, 15, 26, 0.94)" : "rgba(255, 255, 255, 0.96)";
        const border = isCurrentDark ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid rgba(14, 165, 233, 0.3)";
        const textMain = isCurrentDark ? "#F8FAFC" : "#0F172A";
        const textAlt = isCurrentDark ? "#38BDF8" : "#0284C7";
        const badgeBg = isCurrentDark ? "rgba(56, 189, 248, 0.15)" : "rgba(2, 132, 199, 0.08)";
        const shadow = isCurrentDark
          ? "0 8px 20px rgba(0,0,0,0.7), 0 0 12px rgba(56,189,248,0.2)"
          : "0 8px 18px rgba(15,23,42,0.12), 0 2px 6px rgba(0,0,0,0.04)";

        hoverPopup
          .setLngLat(coords)
          .setHTML(`
            <div style="background: ${bg}; border: ${border}; border-radius: 9999px; padding: 4px 10px; color: ${textMain}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: ${shadow}; pointer-events: none; backdrop-filter: blur(8px); display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
              <span style="color: ${accent}; font-size: 11px; font-weight: 800;">${symbol}</span>
              <span style="font-size: 11.5px; font-weight: 600; color: ${textMain}; letter-spacing: -0.01em;">${cleanName}</span>
              ${eleStr ? `<span style="font-size: 10px; font-family: ui-monospace, monospace; color: ${textAlt}; font-weight: 600; padding: 1px 5px; border-radius: 9999px; background: ${badgeBg};">▲ ${eleStr}</span>` : ""}
            </div>
          `)
          .addTo(map);
      };

      const onMapMouseMove = (e: mapboxgl.MapMouseEvent) => {
        pendingPoint = e.point;
        if (mouseMoveRaf === null) {
          mouseMoveRaf = requestAnimationFrame(processHover);
        }
      };

      map.on("mousemove", onMapMouseMove);
      map.on("mouseleave", clearHover);

      // Direct Click Dispatcher (Allows clicking either circle beacon or visible label)
      const onMapClick = (e: mapboxgl.MapMouseEvent) => {
        if (!map.isStyleLoaded() || !map.getSource("atlas-landmarks-source")) return;

        const targetLayers = ["atlas-landmarks-circle", "atlas-landmarks-label"].filter(
          (id) => Boolean(map.getLayer(id))
        );
        if (targetLayers.length === 0) return;

        const features = map.queryRenderedFeatures(e.point, {
          layers: targetLayers,
        });

        if (!features || features.length === 0) return;
        const feat = features[0];
        const props = feat.properties as AtlasLandmarkProperties | undefined;
        if (!props) return;

        // Verify landmark is actually visible at current zoom
        const currentZoom = map.getZoom();
        const tier = Number(props.tier ?? 3);
        const isSelected = Boolean(props.isSelected);
        if (!isSelected) {
          if (tier > 2 && currentZoom < 11.0) return;
          if (tier > 1 && currentZoom < 9.4) return;
        }

        e.originalEvent.stopPropagation();
        const entityId = props.entityId as string;
        const isRoute = Boolean(props.isRoute);
        if (isRoute) {
          handleSelectRouteRef.current(entityId);
        } else {
          const place = ALL_PLACES.find((p) => p.id === entityId);
          if (place) handleSelectPlaceRef.current(place);
        }
      };

      map.on("click", onMapClick);

      setMapLoaded(true);
    });

    return () => {
      if (typeof window !== "undefined") {
        delete (window as unknown as { __map?: unknown }).__map;
        delete (window as unknown as { __selectRoute?: unknown }).__selectRoute;
        delete (window as unknown as { __closeSelection?: unknown }).__closeSelection;
      }
      if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove();
        hoverPopupRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapboxToken]);

  // ── Deep-Link Initial Focus Synchronization ───────────────────────────
  useEffect(() => {
    if (!mapLoaded || !initialFocusId) return;
    if (routesMap[initialFocusId as keyof typeof routesMap]) {
      handleSelectRouteRef.current(initialFocusId);
    } else {
      const target = ALL_PLACES.find((p) => p.id === initialFocusId);
      if (target) handleSelectPlaceRef.current(target);
    }
  }, [mapLoaded, initialFocusId]);

  // ── Dynamic Active Selected Route Trail Renderer ───────────────────────
  // The map stays 100% clean and pristine at idle (no cluttering trail lines).
  // When a trek is selected (e.g. Patalsu Peak, Beas Kund, Hampta Pass),
  // its exact 3D GeoJSON trail renders dynamically with glowing halo and high-visibility alpine path draped on 3D terrain.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const sourceId = "active-selected-route-source";
    const glowId = "active-selected-route-glow";
    const lineId = "active-selected-route-line";

    const removeActiveTrail = () => {
      try {
        if (map.getLayer(lineId)) map.removeLayer(lineId);
        if (map.getLayer(glowId)) map.removeLayer(glowId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch {}
    };

    if (!selectedPlaceId) {
      removeActiveTrail();
      return;
    }

    const routeData = getRouteData(selectedPlaceId);
    if (!routeData?.line?.coordinates || routeData.line.coordinates.length < 2) {
      removeActiveTrail();
      return;
    }

    const rawCoords = routeData.line.coordinates as [number, number, number][];
    const lngLatCoords: [number, number][] = rawCoords.map(([ln, la]) => [ln, la]);

    const addTrailLayers = () => {
      removeActiveTrail();

      try {
        map.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: { id: selectedPlaceId },
            geometry: {
              type: "LineString",
              coordinates: lngLatCoords,
            },
          },
        });

        // Insert underneath landmark pins so the summit beacon sits cleanly on top
        const beforeLayer = map.getLayer("atlas-landmarks-halo") ? "atlas-landmarks-halo" : undefined;

        // Layer 1: Ambient Wide Ground Glow on 3D terrain
        map.addLayer(
          {
            id: glowId,
            type: "line",
            source: sourceId,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#0284C7",
              "line-width": [
                "interpolate", ["linear"], ["zoom"],
                8, 6,
                11, 10,
                14, 16
              ],
              "line-opacity": 0.65,
              "line-blur": 3,
            },
          },
          beforeLayer
        );

        // Layer 2: Core High-Visibility Alpine Trail Path draped on 3D mesh
        map.addLayer(
          {
            id: lineId,
            type: "line",
            source: sourceId,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#38BDF8",
              "line-width": [
                "interpolate", ["linear"], ["zoom"],
                8, 3,
                11, 4.5,
                14, 6.5
              ],
              "line-opacity": 1.0,
            },
          },
          beforeLayer
        );
      } catch (err) {
        console.error("[ACTIVE_TRAIL_ERROR]", selectedPlaceId, err);
      }
    };

    addTrailLayers();

    return () => {
      removeActiveTrail();
    };
  }, [selectedPlaceId, mapLoaded]);

  // ── Synchronize GPU Landmarks with Selection & Region State ───────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !map.isStyleLoaded()) return;

    const source = map.getSource("atlas-landmarks-source") as mapboxgl.GeoJSONSource | undefined;
    if (source) {
      source.setData(buildAtlasLandmarksGeoJSON(selectedPlaceId, activeRegionId));
    }
  }, [selectedPlaceId, activeRegionId, mapLoaded]);

  // ── Dynamically Update Mapbox Fog upon Theme Toggle ───────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !map.isStyleLoaded()) return;

    if (theme === "light") {
      map.setFog({
        range: [1.0, 12.0],
        color: "rgb(186, 210, 235)",
        "horizon-blend": 0.15,
        "high-color": "rgb(36, 92, 223)",
        "space-color": "rgb(11, 24, 44)",
        "star-intensity": 0.0,
      });
    } else {
      map.setFog({
        range: [0.6, 12.0],
        color: "#050914",
        "horizon-blend": 0.18,
        "high-color": "#020409",
        "space-color": "#010206",
        "star-intensity": 0.85,
      });
    }
  }, [theme, mapLoaded]);

  // ── GPU Radar Beacon Synchronization ──────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !map.isStyleLoaded()) return;

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
      className={`map-canvas-container relative w-full h-full overflow-hidden ${
        isFullscreen
          ? "fixed inset-0 z-[9999] rounded-none border-none shadow-none h-screen w-screen"
          : "rounded-none border-none shadow-none"
      } ${isDark ? "bg-[#03060d] text-white" : "bg-slate-100 text-slate-900"} select-none`}
    >
      {/* ── 3D Map Canvas ────────────────────────────────────────── */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* ── Active Territory Indicator / Reset (Top Right) ─────── */}
      {activeRegion && (
        <div className="absolute top-4 sm:top-6 right-16 sm:right-20 z-20 pointer-events-auto">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-mono backdrop-blur-2xl transition-all shadow-2xl animate-in fade-in ${
              isDark
                ? "bg-[#060a14]/90 border border-white/12 text-white"
                : "bg-white/95 border border-slate-200/90 text-slate-900 shadow-xl"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: currentAccent }}
            />
            <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{activeRegion.name}</span>
            <button
              onClick={handleResetAtlas}
              title="Reset View to Western Himalayas"
              aria-label="Reset View"
              className={`ml-1 pl-1.5 border-l transition-colors cursor-pointer ${
                isDark
                  ? "border-white/15 text-slate-400 hover:text-white"
                  : "border-slate-200 text-slate-500 hover:text-slate-900"
              }`}
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
        peaks={peaks}
        allPlaces={ALL_PLACES}
      />

      {/* ── Minimalist Consolidated Camera Controls (Right Side Island) ── */}
      <div
        className={`absolute right-3 sm:right-4 top-4 sm:top-6 z-20 flex flex-col backdrop-blur-xl rounded-2xl p-1 pointer-events-auto transition-all ${
          isDark
            ? "bg-[#050914]/90 border border-white/15 text-white/70 shadow-2xl"
            : "bg-white/95 border border-slate-200/90 text-slate-600 shadow-xl"
        }`}
      >
        {/* Reset North Compass */}
        <button
          onClick={handleResetNorth}
          title="Reset North & Pitch (N)"
          aria-label="Reset North"
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            isDark
              ? "text-white/70 hover:text-white hover:bg-white/10"
              : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          <NavigationIcon
            className="w-4 h-4 text-sky-500 transition-transform duration-100 ease-out"
            style={{ transform: `rotate(${-bearing}deg)` }}
          />
        </button>

        {/* 3D / 2D Perspective Toggle */}
        <button
          onClick={togglePerspective}
          title="Toggle 3D Horizon vs 2D Plan View"
          aria-label="Toggle 3D View"
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors text-[10px] font-mono font-bold border-t cursor-pointer ${
            isDark
              ? "text-white/70 hover:text-white hover:bg-white/10 border-white/10"
              : "text-slate-600 hover:text-slate-950 hover:bg-slate-100 border-slate-200"
          }`}
        >
          3D
        </button>

        {/* 360° Panoramic Orbit */}
        <button
          onClick={toggleOrbit}
          title={isOrbiting ? "Pause 3D Orbit" : "Start 360° Orbit"}
          aria-label="Orbit 3D"
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors border-t cursor-pointer ${
            isDark ? "border-white/10" : "border-slate-200"
          } ${
            isOrbiting
              ? "text-amber-500 bg-amber-500/20"
              : isDark
              ? "text-white/70 hover:text-white hover:bg-white/10"
              : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          <Orbit className={`w-4 h-4 ${isOrbiting ? "animate-spin" : ""}`} />
        </button>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors border-t cursor-pointer ${
            isDark
              ? "text-white/70 hover:text-white hover:bg-white/10 border-white/10"
              : "text-slate-600 hover:text-slate-950 hover:bg-slate-100 border-slate-200"
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors border-t cursor-pointer ${
            isDark
              ? "text-white/70 hover:text-white hover:bg-white/10 border-white/10"
              : "text-slate-600 hover:text-slate-950 hover:bg-slate-100 border-slate-200"
          }`}
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen (Esc or F)" : "Fullscreen Mode (F)"}
          aria-label="Fullscreen"
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors border-t cursor-pointer ${
            isDark
              ? "text-white/70 hover:text-white hover:bg-white/10 border-white/10"
              : "text-slate-600 hover:text-slate-950 hover:bg-slate-100 border-slate-200"
          }`}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-sky-500" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Active Route Quick-Bar (Docked at Bottom Center) ───────── */}
      {(selectedPlace || selectedRouteMeta) && (
        <div className="absolute bottom-5 inset-x-3 sm:inset-x-0 sm:left-1/2 sm:-translate-x-1/2 z-30 pointer-events-none sm:w-[500px]">
          <div
            className={`pointer-events-auto relative w-full rounded-2xl p-4 overflow-hidden border transition-all animate-in fade-in slide-in-from-bottom-3 duration-300 ${
              isDark
                ? "text-white shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                : "text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            }`}
            style={{
              background: isDark ? "rgba(6, 10, 20, 0.95)" : "rgba(255, 255, 255, 0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: isDark ? `${currentAccent}55` : "rgba(226, 232, 240, 0.9)",
              boxShadow: isDark
                ? `0 20px 50px rgba(0,0,0,0.85), 0 0 30px ${currentAccent}20, inset 0 1px 0 rgba(255,255,255,0.12)`
                : `0 20px 50px rgba(0,0,0,0.15), 0 0 20px ${currentAccent}15, inset 0 1px 0 rgba(255,255,255,0.8)`,
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
                <span
                  className={`text-[11px] font-mono truncate ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
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
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                  isDark
                    ? "text-slate-400 hover:text-white hover:bg-white/10"
                    : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Title */}
            <h3
              className={`text-base sm:text-lg font-display font-semibold mb-2.5 truncate ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {selectedRouteMeta ? selectedRouteMeta.name : selectedPlace?.name}
            </h3>

            {/* Key Telemetry Chips */}
            <div className="flex items-center gap-2 mb-3.5 font-mono text-xs">
              <span
                className={`px-2 py-0.5 rounded-md font-medium border ${
                  isDark
                    ? "bg-white/[0.05] text-slate-200 border-white/10"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                ▲ {selectedRouteMeta ? selectedRouteMeta.maxAltitude : selectedPlace?.elevation || "Summit Apex"}
              </span>
              {selectedRouteMeta && (
                <>
                  <span
                    className={`px-2 py-0.5 rounded-md border ${
                      isDark
                        ? "bg-white/[0.05] text-slate-300 border-white/10"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {selectedRouteMeta.distance}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md border ${
                      isDark
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {selectedRouteMeta.difficulty}
                  </span>
                </>
              )}
              {selectedPlace?.difficulty && !selectedRouteMeta && (
                <span
                  className={`px-2 py-0.5 rounded-md border ${
                    isDark
                      ? "bg-white/[0.05] text-slate-300 border-white/10"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
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
                    : isDark
                    ? "bg-white/10 text-slate-200 hover:bg-white/15 hover:text-white border border-white/15"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 border border-slate-200"
                }`}
              >
                <Orbit className={`w-3.5 h-3.5 ${isOrbiting ? "animate-spin" : "text-amber-500"}`} />
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
