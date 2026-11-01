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

const ALL_PLACES: HimalayaPlace[] = ALL_ATLAS_PLACES;

export default function GlobalMapClient({ treks: _treks, initialFocusId }: GlobalMapClientProps) {
  void _treks;
  const theme = useHimalayanTheme();
  const isDark = theme === "dark";

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const activeTrailIdsRef = useRef<Set<string>>(new Set());
  const flowTimerRef = useRef<NodeJS.Timeout | null>(null);

  const initialPlaceLoc = initialFocusId ? placeLocationIndex.get(initialFocusId) : null;

  // ── Component State ───────────────────────────────────────────────────
  const [activeRegionId, setActiveRegionId]       = useState<string | null>(() => initialPlaceLoc?.regionId ?? null);
  const [activeSubRegionId, setActiveSubRegionId] = useState<string | null>(() => initialPlaceLoc?.subRegionId ?? null);
  const [selectedPlaceId, setSelectedPlaceId]     = useState<string | null>(() => initialFocusId ?? null);
  const [hoveredEntityId, setHoveredEntityId]     = useState<string | null>(null);
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

      // Ingest all Himalayan landmarks into native GPU source
      const landmarksGeoJSON = buildAtlasLandmarksGeoJSON(initialFocusId, activeRegionId);
      map.addSource("atlas-landmarks-source", {
        type: "geojson",
        data: landmarksGeoJSON,
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
              ["==", ["get", "isSelected"], true], 12,
              ["<=", ["get", "priority"], 2], 9,
              5
            ],
            11,
            [
              "case",
              ["==", ["get", "isSelected"], true], 18,
              ["<=", ["get", "priority"], 2], 13,
              8
            ],
            14,
            [
              "case",
              ["==", ["get", "isSelected"], true], 24,
              ["<=", ["get", "priority"], 2], 18,
              12
            ]
          ],
          "circle-color": [
            "case",
            ["==", ["get", "isSelected"], true], "#38BDF8",
            ["get", "color"]
          ],
          "circle-opacity": [
            "step",
            ["zoom"],
            [
              "case",
              ["==", ["get", "isSelected"], true], 0.65,
              ["<=", ["get", "priority"], 2], 0.40,
              0.0
            ],
            7.5,
            [
              "case",
              ["==", ["get", "isSelected"], true], 0.65,
              ["<=", ["get", "priority"], 3], 0.35,
              0.0
            ],
            9.0,
            [
              "case",
              ["==", ["get", "isSelected"], true], 0.65,
              ["<=", ["get", "priority"], 4], 0.30,
              0.0
            ],
            10.5,
            [
              "case",
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
              ["==", ["get", "isSelected"], true], 6.0,
              ["<=", ["get", "priority"], 2], 4.5,
              2.2
            ],
            10,
            [
              "case",
              ["==", ["get", "isSelected"], true], 8.0,
              ["<=", ["get", "priority"], 2], 6.0,
              4.2
            ],
            13,
            [
              "case",
              ["==", ["get", "isSelected"], true], 11.0,
              ["<=", ["get", "priority"], 2], 7.5,
              5.8
            ]
          ],
          "circle-color": [
            "case",
            ["==", ["get", "isSelected"], true], "#38BDF8",
            ["get", "color"]
          ],
          "circle-stroke-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            8,
            ["case", ["==", ["get", "isSelected"], true], 2.5, 1.2],
            12,
            ["case", ["==", ["get", "isSelected"], true], 2.8, 1.8]
          ],
          "circle-stroke-color": "#FFFFFF",
          "circle-opacity": [
            "step",
            ["zoom"],
            [
              "case",
              ["==", ["get", "isSelected"], true], 0.98,
              ["<=", ["get", "priority"], 2], 0.95,
              0.0
            ],
            7.5,
            [
              "case",
              ["==", ["get", "isSelected"], true], 0.98,
              ["<=", ["get", "priority"], 3], 0.95,
              0.0
            ],
            9.0,
            [
              "case",
              ["==", ["get", "isSelected"], true], 0.98,
              ["<=", ["get", "priority"], 4], 0.95,
              0.0
            ],
            10.5,
            0.98
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
            ["case", ["==", ["get", "isSelected"], true], ["get", "fullLabel"], ""],
            7.2,
            [
              "case",
              ["==", ["get", "isSelected"], true], ["get", "fullLabel"],
              ["<=", ["get", "priority"], 2], ["get", "shortLabel"],
              ""
            ],
            8.5,
            [
              "case",
              ["==", ["get", "isSelected"], true], ["get", "fullLabel"],
              ["<=", ["get", "priority"], 3], ["get", "shortLabel"],
              ""
            ],
            10.0,
            [
              "case",
              ["==", ["get", "isSelected"], true], ["get", "fullLabel"],
              ["<=", ["get", "priority"], 4], ["get", "shortLabel"],
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
          "symbol-sort-key": ["get", "priority"],
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

      // Native WebGL Click & Hover Event Handlers
      const onLandmarkClick = (e: mapboxgl.MapLayerMouseEvent) => {
        if (!e.features || e.features.length === 0) return;
        e.originalEvent.stopPropagation();
        const props = e.features[0].properties;
        if (!props) return;
        const entityId = props.entityId as string;
        const isRoute = props.isRoute === true || props.isRoute === "true";
        if (isRoute) {
          handleSelectRoute(entityId);
        } else {
          const place = ALL_PLACES.find((p) => p.id === entityId);
          if (place) handleSelectPlace(place);
        }
      };

      map.on("click", "atlas-landmarks-circle", onLandmarkClick);
      map.on("click", "atlas-landmarks-label", onLandmarkClick);

      const onLandmarkEnter = (e: mapboxgl.MapLayerMouseEvent) => {
        map.getCanvas().style.cursor = "pointer";
        if (e.features && e.features.length > 0) {
          const entityId = e.features[0].properties?.entityId as string;
          setHoveredEntityId(entityId);
        }
      };

      const onLandmarkLeave = () => {
        map.getCanvas().style.cursor = "";
        setHoveredEntityId(null);
      };

      map.on("mouseenter", "atlas-landmarks-circle", onLandmarkEnter);
      map.on("mouseleave", "atlas-landmarks-circle", onLandmarkLeave);
      map.on("mouseenter", "atlas-landmarks-label", onLandmarkEnter);
      map.on("mouseleave", "atlas-landmarks-label", onLandmarkLeave);

      setMapLoaded(true);
    });

    return () => {
      if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
      if (flowTimerRef.current) clearInterval(flowTimerRef.current);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapboxToken, initialFocusId, handleSelectRoute, handleSelectPlace]);

  // ── Pre-Load All 35 Verified Route GeoJSON Lines on Map ────────────────
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

  // ── Synchronize GPU Landmarks with Selection & Region State ───────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const source = map.getSource("atlas-landmarks-source") as mapboxgl.GeoJSONSource | undefined;
    if (source) {
      source.setData(buildAtlasLandmarksGeoJSON(selectedPlaceId, activeRegionId));
    }
  }, [selectedPlaceId, activeRegionId, mapLoaded]);

  // ── Dynamically Update Mapbox Fog upon Theme Toggle ───────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

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
        onHoverEntity={setHoveredEntityId}
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
          title="Reset North & Pitch"
          aria-label="Reset North"
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            isDark
              ? "text-white/70 hover:text-white hover:bg-white/10"
              : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
          }`}
        >
          <NavigationIcon className="w-4 h-4 text-sky-500" />
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
