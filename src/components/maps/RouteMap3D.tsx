"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Mountain,
  Orbit,
  FastForward,
  Film,
  MapPin,
  Trophy,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { RouteData } from "@/data/types";
import {
  setActiveRoutePoint,
  subscribeToRoutePoint,
  getActiveRoutePointSnapshot,
  type ActiveRoutePoint,
} from "@/lib/route-store";
import {
  haversineDistanceKm,
  rateLimitedBearingLerp,
  interpolateBearing,
  computeMacroBearing,
  computeAdaptivePitch,
  computeSafeGradientStops,
  cubicEaseOut,
  getInterpolatedPoint,
  computeStravaChaseCamera,
  computeAltitudePhysiology,
  createAdaptivePacingMapper,
  getVisiblePeaksFromSummit,
  findActivePeakSighting,
  type VisibleSummitPeak,
} from "@/lib/camera-math";
import { registerPulsingBeacon } from "@/lib/mapbox-canvas-beacon";
import {
  selectKeyMilestones,
  selectTacticalAdvisories,
  type RouteMilestone,
  type TacticalAdvisory,
} from "@/lib/video-export";
import { FlyoverVideoExportModal } from "./FlyoverVideoExportModal";

interface RouteMap3DProps {
  routeData: RouteData;
  placeName: string;
  placeSlug: string;
  maxAltitude: string;
  distance: string;
  accentColor?: string;
  isPatalsu?: boolean;
}

function getCompassDirection(deg: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return directions[index];
}

const DASH_PATTERNS = [
  [0, 4, 3],
  [1, 4, 2],
  [2, 4, 1],
  [3, 4, 0],
  [0, 1, 3, 3],
  [0, 2, 3, 2],
  [0, 3, 3, 1],
];

export default function RouteMap3D({
  routeData,
  placeName,
  placeSlug,
  maxAltitude,
  distance,
  accentColor = "#3B82F6",
  isPatalsu = true,
}: RouteMap3DProps) {
  const [isMapActive, setIsMapActive] = useState(false);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [isPlayingFlyover, setIsPlayingFlyover] = useState(false);
  const isPlayingFlyoverRef = useRef(false);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const isOrbitingRef = useRef(false);
  const [orbitBearing, setOrbitBearing] = useState<number>(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeMilestoneAlert, setActiveMilestoneAlert] = useState<RouteMilestone | null>(null);
  const milestoneTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggeredMilestoneIdsRef = useRef<Set<string>>(new Set());
  const [isIntroZooming, setIsIntroZooming] = useState(false);
  const introTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const introStage2TimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const introStage3TimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearIntroTimeouts = useCallback(() => {
    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current);
      introTimeoutRef.current = null;
    }
    if (introStage2TimeoutRef.current) {
      clearTimeout(introStage2TimeoutRef.current);
      introStage2TimeoutRef.current = null;
    }
    if (introStage3TimeoutRef.current) {
      clearTimeout(introStage3TimeoutRef.current);
      introStage3TimeoutRef.current = null;
    }
  }, []);

  const [flyoverProgress, setFlyoverProgress] = useState(0); // 0 to 1
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [is3DMode, setIs3DMode] = useState(true);
  const [webGlSupported] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  });

  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const activeMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const waypointItemsRef = useRef<{ marker: mapboxgl.Marker; el: HTMLElement; lng: number; lat: number }[]>([]);
  const flyoverAnimRef = useRef<number | null>(null);
  const routeDrawAnimRef = useRef<number | null>(null);
  const orbitAnimRef = useRef<number | null>(null);
  const orbitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flowTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dashStepRef = useRef<number>(0);
  const currentBearingRef = useRef<number>(-35);
  const lastStoreSyncTimeRef = useRef<number>(0);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const coordinates = routeData.line.coordinates; // [lng, lat, eleM][]

  // Gimbal and flight smoothing refs (prevents camera jitter & continuous steady-cam suspension)
  const flyoverProgressRef = useRef<number>(0);
  const linearProgressRef = useRef<number>(0);
  const cameraCenterRef = useRef<[number, number]>([coordinates[0][0], coordinates[0][1]]);
  const cameraPitchRef = useRef<number>(50);
  const cameraZoomRef = useRef<number>(15.3);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const scrubberDistValRef = useRef<HTMLSpanElement>(null);
  const timelineInputRef = useRef<HTMLInputElement>(null);
  const lastGradProgressRef = useRef<number>(-1);
  const lastWaypointCheckRef = useRef<number>(0);

  // Fast direct DOM refs for zero-re-render 60fps telemetry HUD
  const elevValRef = useRef<HTMLSpanElement>(null);
  const distValRef = useRef<HTMLSpanElement>(null);
  const coordsValRef = useRef<HTMLSpanElement>(null);
  const slopeValRef = useRef<HTMLSpanElement>(null);
  const oxygenValRef = useRef<HTMLSpanElement>(null);

  // Active broadcast sightings & tactical hazard alerts
  const [activePeakAlert, setActivePeakAlert] = useState<VisibleSummitPeak | null>(null);
  const [activeAdvisoryAlert, setActiveAdvisoryAlert] = useState<TacticalAdvisory | null>(null);
  const triggeredAdvisoryIdsRef = useRef<Set<string>>(new Set());
  const advisoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [externalHoverPoint, setExternalHoverPoint] = useState<ActiveRoutePoint | null>(null);

  // Synchronize 3D camera and puck with external elevation profile hover ONLY when not playing flyover
  // Completely eliminates 10 Hz React re-render thrashing during 60fps flight!
  useEffect(() => {
    if (isPlayingFlyover || isOrbiting) return;
    const unsubscribe = subscribeToRoutePoint(() => {
      const point = getActiveRoutePointSnapshot();
      setExternalHoverPoint(point);
      if (!point || !mapRef.current) return;
      if (activeMarkerRef.current) {
        activeMarkerRef.current.setLngLat([point.lng, point.lat]);
      }
      if (point.lat !== 0 && point.lng !== 0) {
        mapRef.current.easeTo({
          center: [point.lng, point.lat],
          duration: 200,
        });
      }
    });
    return unsubscribe;
  }, [isPlayingFlyover, isOrbiting]);

  // Precompute cumulative distances along the route coordinates in kilometers
  const cumDistances = useMemo(() => {
    const dists: number[] = [0];
    for (let i = 1; i < coordinates.length; i++) {
      const [lng1, lat1] = coordinates[i - 1];
      const [lng2, lat2] = coordinates[i];
      dists.push(dists[i - 1] + haversineDistanceKm(lng1, lat1, lng2, lat2));
    }
    return dists;
  }, [coordinates]);

  const totalDistanceKm = cumDistances[cumDistances.length - 1] || routeData.stats.distanceKm;



  // Precompute summit / apex distance along trail for out-and-back stabilization
  const apexInfo = useMemo(() => {
    let maxEle = -Infinity;
    let apexIdx = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const ele = coordinates[i][2] || 0;
      if (ele > maxEle) {
        maxEle = ele;
        apexIdx = i;
      }
    }
    return {
      apexIdx,
      apexDistKm: cumDistances[apexIdx] || totalDistanceKm,
      maxEle: maxEle > -Infinity ? maxEle : (routeData.stats.maxEleM || 4000),
    };
  }, [coordinates, cumDistances, totalDistanceKm, routeData.stats.maxEleM]);

  const apexDistKm = apexInfo.apexDistKm;

  // Detect if route is an out-and-back trail (start and end within 600m of each other)
  const isRoundTrip = useMemo(() => {
    if (coordinates.length < 2) return false;
    const start = coordinates[0];
    const end = coordinates[coordinates.length - 1];
    const dist = haversineDistanceKm(start[0], start[1], end[0], end[1]);
    return dist < 0.6;
  }, [coordinates]);

  // For out-and-back treks, the flyover trajectory leads to the summit apex
  // For point-to-point treks, it traverses to the destination pass/town
  const flyoverMaxDistKm = useMemo(() => {
    if (isRoundTrip && apexDistKm > 0.5 && apexDistKm < totalDistanceKm * 0.9) {
      return apexDistKm;
    }
    return totalDistanceKm;
  }, [isRoundTrip, apexDistKm, totalDistanceKm]);

  // For out-and-back treks, only render the single ascent trail line to the summit apex
  // to completely eliminate duplicate / double overlapping trail lines on the mountain slopes
  const displayCoordinates = useMemo(() => {
    if (isRoundTrip && apexInfo.apexIdx > 10 && apexInfo.apexIdx < coordinates.length - 10) {
      return coordinates.slice(0, apexInfo.apexIdx + 1);
    }
    return coordinates;
  }, [coordinates, isRoundTrip, apexInfo.apexIdx]);

  // Compute summit / apex coordinate
  const summitCoord: [number, number, number] = useMemo(() => {
    if (isPatalsu) {
      return [77.19106, 32.35386, 4261];
    }
    const maxPt = coordinates.reduce(
      (max, c) => ((c[2] || 0) > (max[2] || 0) ? c : max),
      coordinates[0]
    );
    return [maxPt[0], maxPt[1], maxPt[2] || 0];
  }, [coordinates, isPatalsu]);

  // Curate 2 to 3 high-impact broadcast alpine milestones (Trailhead, Key Meadow/Camp, Summit)
  const keyMilestones = useMemo(() => {
    return selectKeyMilestones(
      routeData?.waypoints,
      flyoverMaxDistKm,
      placeName,
      apexInfo.maxEle,
      displayCoordinates
    );
  }, [routeData?.waypoints, flyoverMaxDistKm, placeName, apexInfo.maxEle, displayCoordinates]);

  // Extract tactical alpine hazards & caution notices
  const tacticalAdvisories = useMemo(() => {
    return selectTacticalAdvisories(routeData?.waypoints, displayCoordinates);
  }, [routeData?.waypoints, displayCoordinates]);

  // Gradient-aware adaptive flight pacing mapper derived strictly for displayCoordinates
  const displayCumDistances = useMemo(() => {
    if (displayCoordinates.length === coordinates.length) {
      return cumDistances;
    }
    const dists: number[] = [0];
    for (let i = 1; i < displayCoordinates.length; i++) {
      const [lng1, lat1] = displayCoordinates[i - 1];
      const [lng2, lat2] = displayCoordinates[i];
      dists.push(dists[i - 1] + haversineDistanceKm(lng1, lat1, lng2, lat2));
    }
    return dists;
  }, [displayCoordinates, coordinates.length, cumDistances]);

  const adaptivePacingMapper = useMemo(() => {
    return createAdaptivePacingMapper(displayCoordinates, displayCumDistances);
  }, [displayCoordinates, displayCumDistances]);

  // Prominent visible peaks from summit apex
  const visiblePeaks = useMemo(() => {
    return getVisiblePeaksFromSummit(summitCoord[0], summitCoord[1], 45);
  }, [summitCoord]);

  // Dynamic waypoint proximity culling to eliminate badge stacking / clustering
  const updateWaypointVisibilities = useCallback((focusLng: number, focusLat: number) => {
    waypointItemsRef.current.forEach((item) => {
      const dist = haversineDistanceKm(focusLng, focusLat, item.lng, item.lat);
      if (dist < 1.0) {
        // Nearest local waypoint: prominent
        item.el.style.opacity = "1";
        item.el.style.transform = "scale(1.02)";
        item.el.style.zIndex = "30";
        item.el.style.pointerEvents = "auto";
      } else if (dist < 2.5) {
        // Medium distance: subtle
        item.el.style.opacity = "0.45";
        item.el.style.transform = "scale(0.92)";
        item.el.style.zIndex = "15";
        item.el.style.pointerEvents = "auto";
      } else {
        // Distant: faded out so it NEVER stacks into an unreadable column
        item.el.style.opacity = "0.08";
        item.el.style.transform = "scale(0.85)";
        item.el.style.zIndex = "5";
        item.el.style.pointerEvents = "none";
      }
    });
  }, []);

  // Interpolate route point at progress p (0 to 1) with strictly continuous math and anti-clipping adaptive pitch
  const getPointAtProgress = useCallback(
    (
      p: number
    ): {
      lng: number;
      lat: number;
      ele: number;
      bearing: number;
      adaptivePitch: number;
      gradientPct: number;
    } => {
      const clampedP = Math.max(0, Math.min(1, p));
      const targetDist = clampedP * flyoverMaxDistKm;

      // Pure continuous interpolation along trail trajectory (zero discrete index hops)
      const pt = getInterpolatedPoint(coordinates, cumDistances, targetDist);
      const lng = pt[0];
      const lat = pt[1];
      const ele = pt[2];

      // Smooth Macro Valley Bearing (180m lookahead window cuts across micro-switchbacks)
      const bearing = computeMacroBearing(coordinates, cumDistances, targetDist, 0.18, apexDistKm);

      // Lookahead point for gradient and adaptive anti-clipping pitch (180m lookahead)
      const aheadDist = Math.min(flyoverMaxDistKm, targetDist + 0.18);
      const aheadPt = getInterpolatedPoint(coordinates, cumDistances, aheadDist);
      const aheadDistMeters = Math.max(40, (aheadDist - targetDist) * 1000);
      const deltaElev = aheadPt[2] - ele;
      const gradientPct = (deltaElev / aheadDistMeters) * 100;

      // Adaptive Pitch Damper: 58° base down to 52° on steep ascents
      const adaptivePitch = computeAdaptivePitch(ele, aheadPt[2], aheadDistMeters, 58, 52);

      return { lng, lat, ele, bearing, adaptivePitch, gradientPct };
    },
    [coordinates, cumDistances, flyoverMaxDistKm, apexDistKm]
  );


  // Compute route bounding box
  const bounds = useMemo(() => {
    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    for (const [lng, lat] of displayCoordinates) {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }

    return new mapboxgl.LngLatBounds([minLng, minLat], [maxLng, maxLat]);
  }, [displayCoordinates]);

  // Progressive laser route draw animation on launch or reset
  const runProgressiveRouteDraw = useCallback((map: mapboxgl.Map, durationMs = 2200) => {
    if (routeDrawAnimRef.current) {
      cancelAnimationFrame(routeDrawAnimRef.current);
      routeDrawAnimRef.current = null;
    }
    const startTime = performance.now();
    const frame = (now: number) => {
      // Guard against unmounted map or destroyed style
      if (!map || !map.getStyle() || !map.getLayer("trail-route-line")) {
        routeDrawAnimRef.current = null;
        return;
      }

      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const eased = cubicEaseOut(t);

      try {
        if (map.getLayer("trail-route-line")) {
          const stops = computeSafeGradientStops(eased, "#00E5FF", "rgba(0, 229, 255, 0.15)");
          map.setPaintProperty("trail-route-line", "line-gradient", stops);
        }
      } catch {
        // Safe guard
      }

      if (t < 1) {
        routeDrawAnimRef.current = requestAnimationFrame(frame);
      } else {
        routeDrawAnimRef.current = null;
        // Reset full gradient
        try {
          if (map.getLayer("trail-route-line")) {
            map.setPaintProperty("trail-route-line", "line-gradient", [
              "interpolate",
              ["linear"],
              ["line-progress"],
              0.0,
              "#06B6D4",
              0.45,
              "#3B82F6",
              0.75,
              "#F59E0B",
              1.0,
              "#FDE047",
            ]);
          }
        } catch {}
      }
    };
    routeDrawAnimRef.current = requestAnimationFrame(frame);
  }, []);

  // Directional flow marching-ants controllers (paused during flight to prevent z-fighting flicker)
  const startFlowAnimation = useCallback(() => {
    if (flowTimerRef.current || !mapRef.current) return;
    try {
      if (mapRef.current.getStyle() && mapRef.current.getLayer("trail-route-flow")) {
        mapRef.current.setLayoutProperty("trail-route-flow", "visibility", "visible");
      }
    } catch {}
    flowTimerRef.current = setInterval(() => {
      if (!mapRef.current || !mapRef.current.getStyle()) return;
      dashStepRef.current = (dashStepRef.current + 1) % DASH_PATTERNS.length;
      try {
        if (mapRef.current.getLayer("trail-route-flow")) {
          mapRef.current.setPaintProperty(
            "trail-route-flow",
            "line-dasharray",
            DASH_PATTERNS[dashStepRef.current]
          );
        }
      } catch {}
    }, 130);
  }, []);

  const stopFlowAnimation = useCallback(() => {
    if (flowTimerRef.current) {
      clearInterval(flowTimerRef.current);
      flowTimerRef.current = null;
    }
    try {
      if (mapRef.current?.getStyle() && mapRef.current.getLayer("trail-route-flow")) {
        mapRef.current.setLayoutProperty("trail-route-flow", "visibility", "none");
      }
    } catch {}
  }, []);

  // Initialize Mapbox 3D Engine
  useEffect(() => {
    if (!isMapActive || !mapContainerRef.current || !mapboxToken || mapRef.current) return;

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      bounds: bounds,
      fitBoundsOptions: {
        padding: { top: 80, bottom: 80, left: 60, right: 60 },
        pitch: 52,
        bearing: -35,
        maxZoom: 16,
      },
      maxPitch: 85,
      pitchWithRotate: true,
      touchPitch: true,
      scrollZoom: false,
      doubleClickZoom: true,
      attributionControl: false,
      antialias: true,
      preserveDrawingBuffer: true,
    });

    mapRef.current = map;
    setMapInstance(map);

    map.on("load", () => {
      // 0. Clean wilderness canvas
      const layers = map.getStyle().layers;
      if (layers) {
        layers.forEach((layer) => {
          if (
            layer.type === "symbol" ||
            layer.type === "line" ||
            layer.id.includes("road") ||
            layer.id.includes("label") ||
            layer.id.includes("admin") ||
            layer.id.includes("border")
          ) {
            map.setLayoutProperty(layer.id, "visibility", "none");
          }
        });
      }

      // 1. Add DEM terrain elevation (1.25x relief calibrated for crisp Himalayan ridgelines)
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.25 });

      // 2. Add realistic atmospheric alpine sky and sunlight (Strava / FATMAP standard)
      if (!map.getLayer("sky")) {
        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 90.0],
            "sky-atmosphere-sun-intensity": 15,
          },
        });
      }

      map.setFog({
        range: [1.0, 12.0],
        color: "rgb(186, 210, 235)",
        "horizon-blend": 0.15,
        "high-color": "rgb(36, 92, 223)",
        "space-color": "rgb(11, 24, 44)",
        "star-intensity": 0.0,
      });

      // 3. Register GPU canvas pulsing beacons
      registerPulsingBeacon(map, "hiker-radar-pulse", {
        size: 72,
        color: "#22D3EE",
        coreColor: "#FFFFFF",
      });

      // 4. Add Trail GeoJSON Source (single clean path to summit, no duplicate return overlap)
      map.addSource("trail-route", {
        type: "geojson",
        lineMetrics: true,
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: displayCoordinates.map(([lng, lat]) => [lng, lat]),
          },
        },
      });

      // 5. Trail casing (deep dark shadow underneath)
      map.addLayer({
        id: "trail-route-casing",
        type: "line",
        source: "trail-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#030712",
          "line-width": 8.5,
          "line-opacity": 0.85,
        },
      });

      // 6. Trail main glowing path with dynamic altitude-inspired line-gradient
      map.addLayer({
        id: "trail-route-line",
        type: "line",
        source: "trail-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-gradient": [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0.0,
            "#06B6D4",
            0.45,
            "#3B82F6",
            0.75,
            "#F59E0B",
            1.0,
            "#FDE047",
          ],
          "line-width": 4.5,
          "line-opacity": 0.95,
        },
      });

      // 7. Marching Ants Directional Flow Layer (cycling dashed pattern)
      map.addLayer({
        id: "trail-route-flow",
        type: "line",
        source: "trail-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#FFFFFF",
          "line-width": 2.2,
          "line-dasharray": [0, 4, 3],
          "line-opacity": 0.45,
        },
      });

      // 7. Start subtle directional flow cycle (only while idle/overview)
      startFlowAnimation();

      // 7. Native WebGL Hiker Puck on GPU (zero DOM lag, 100% captured in video exports)
      const startCoord = displayCoordinates[0];
      if (!map.getSource("hiker-puck-source")) {
        map.addSource("hiker-puck-source", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [startCoord[0], startCoord[1]],
            },
          },
        });

        map.addLayer({
          id: "hiker-puck-glow",
          type: "circle",
          source: "hiker-puck-source",
          paint: {
            "circle-radius": 14,
            "circle-color": "#00E5FF",
            "circle-opacity": 0.45,
            "circle-pitch-alignment": "map",
          },
        });

        map.addLayer({
          id: "hiker-puck-core",
          type: "circle",
          source: "hiker-puck-source",
          paint: {
            "circle-radius": 6.5,
            "circle-color": "#FFFFFF",
            "circle-stroke-width": 2.5,
            "circle-stroke-color": "#00E5FF",
            "circle-pitch-alignment": "map",
          },
        });
      }

      // 8. Alpine Waypoint Taxonomy Markers with Proximity Culling Registration
      const isJogni = routeData.placeId === "jogni-falls";
      const waypoints = routeData.waypoints || [];
      const hasWaypoints = waypoints.length > 0;
      waypointItemsRef.current = [];

      if (hasWaypoints) {
        waypoints.forEach((wp) => {
          const type = wp.type || "landmark";
          let icon = "📍";
          let borderClass = "border-cyan-400";
          let isPulsing = false;

          switch (type) {
            case "trailhead":
              icon = "🟢";
              borderClass = "border-emerald-400";
              break;
            case "water":
              icon = "💧";
              borderClass = "border-cyan-400";
              break;
            case "camp":
              icon = "🏕️";
              borderClass = "border-amber-400";
              break;
            case "warning":
              icon = "⚠️";
              borderClass = "border-rose-500 animate-pulse";
              isPulsing = true;
              break;
            case "pass":
              icon = "🏔️";
              borderClass = "border-indigo-400";
              break;
            case "summit":
              icon = "🚩";
              borderClass = "border-cyan-300";
              break;
          }

          const wpEl = document.createElement("div");
          wpEl.className = `alpine-waypoint-marker flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/92 border ${borderClass} text-white text-[10.5px] font-mono font-bold shadow-2xl backdrop-blur-md cursor-pointer hover:scale-105 transition-all duration-300 select-none ${
            isPulsing ? "ring-2 ring-rose-500/40" : ""
          }`;
          wpEl.innerHTML = `<span>${icon}</span><span class="truncate max-w-[130px] sm:max-w-[180px]">${wp.name}${wp.eleM ? ` (${wp.eleM}m)` : ""}</span>`;

          wpEl.addEventListener("click", () => {
            if (isPlayingFlyoverRef.current || isOrbitingRef.current) return;
            map.easeTo({
              center: [wp.lng, wp.lat],
              zoom: 13.5,
              pitch: 52,
              duration: 1200,
            });
            if (activeMarkerRef.current) {
              activeMarkerRef.current.setLngLat([wp.lng, wp.lat]);
            }
          });

          const marker = new mapboxgl.Marker({
            element: wpEl,
            anchor: "bottom",
            pitchAlignment: "viewport",
            rotationAlignment: "viewport",
          })
            .setLngLat([wp.lng, wp.lat])
            .addTo(map);

          waypointItemsRef.current.push({
            marker,
            el: wpEl,
            lng: wp.lng,
            lat: wp.lat,
          });

          if (wp.cautionNotice) {
            const popup = new mapboxgl.Popup({
              offset: 14,
              closeButton: false,
              className: "alpine-caution-popup",
            }).setHTML(`
              <div style="background: rgba(10, 14, 23, 0.96); border: 1px solid #F43F5E; border-radius: 10px; padding: 8px 12px; color: #FFF; font-family: ui-monospace, monospace; font-size: 11px; max-width: 230px; box-shadow: 0 10px 30px rgba(0,0,0,0.85);">
                <div style="color: #F43F5E; font-weight: bold; margin-bottom: 3px; display: flex; align-items: center; gap: 4px;">⚠️ CAUTION NOTICE</div>
                <div style="color: rgba(255,255,255,0.9); line-height: 1.35;">${wp.cautionNotice}</div>
              </div>
            `);
            marker.setPopup(popup);
          }
        });
      } else {
        // Fallback Trailhead Marker
        const startEl = document.createElement("div");
        startEl.className = "alpine-waypoint-marker flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-400 text-white text-xs font-mono font-bold shadow-xl backdrop-blur-md cursor-pointer hover:scale-105 transition-all duration-300";
        startEl.innerHTML = `<span>🟢</span><span>${isPatalsu ? "Solang Trailhead (2,480m)" : isJogni ? "Vashisht Trailhead (2,050m)" : "Trailhead"}</span>`;
        const startMarker = new mapboxgl.Marker({ element: startEl, anchor: "bottom", pitchAlignment: "viewport", rotationAlignment: "viewport" })
          .setLngLat([startCoord[0], startCoord[1]])
          .addTo(map);
        waypointItemsRef.current.push({
          marker: startMarker,
          el: startEl,
          lng: startCoord[0],
          lat: startCoord[1],
        });
      }

      // 9. Summit Apex Marker
      const summitEl = document.createElement("div");
      summitEl.className = "alpine-waypoint-marker flex flex-col items-center cursor-pointer group pointer-events-auto select-none transition-all duration-300";
      summitEl.innerHTML = `
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 border border-cyan-400 text-white text-xs font-mono font-bold shadow-2xl backdrop-blur-md hover:scale-105 transition-transform animate-pulse">
          <span>${isJogni ? "🌊" : "🚩"}</span><span>${isPatalsu ? "Patalsu Summit (4,261m)" : isJogni ? "Jogni Falls (2,280m)" : `${placeName} (${maxAltitude})`}</span>
        </div>
        <div style="width: 2px; height: 10px; background: linear-gradient(to bottom, #22d3ee, #06b6d4);"></div>
        <div style="width: 0; height: 0; border-left: 3.5px solid transparent; border-right: 3.5px solid transparent; border-top: 6px solid #22d3ee; filter: drop-shadow(0 0 4px #06b6d4);"></div>
      `;
      const summitMarker = new mapboxgl.Marker({ element: summitEl, anchor: "bottom", pitchAlignment: "viewport", rotationAlignment: "viewport" })
        .setLngLat([summitCoord[0], summitCoord[1]])
        .addTo(map);
      waypointItemsRef.current.push({
        marker: summitMarker,
        el: summitEl,
        lng: summitCoord[0],
        lat: summitCoord[1],
      });

      // 10. Interactive Dynamic Scrubber Marker (Strava-Grade Precision Puck)
      const activeEl = document.createElement("div");
      activeEl.className = "relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none";
      activeEl.innerHTML = `
        <div class="absolute w-8 h-8 rounded-full bg-cyan-400/30 animate-ping"></div>
        <div class="relative w-4.5 h-4.5 rounded-full bg-white border-2 border-cyan-400 shadow-[0_0_12px_#22d3ee] flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
        </div>
      `;
      const activeMarker = new mapboxgl.Marker({ element: activeEl, pitchAlignment: "viewport", rotationAlignment: "viewport" })
        .setLngLat([startCoord[0], startCoord[1]])
        .addTo(map);
      activeMarkerRef.current = activeMarker;

      // Initial waypoint proximity check
      updateWaypointVisibilities(startCoord[0], startCoord[1]);

      // Dynamic decluttering on user pan
      const onMapMove = () => {
        const c = map.getCenter();
        updateWaypointVisibilities(c.lng, c.lat);
      };
      map.on("move", onMapMove);

      // 11. Run progressive route laser draw
      runProgressiveRouteDraw(map);

      // 12. Cancel orbit on manual map interaction
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
    });

    return () => {
      clearIntroTimeouts();
      if (routeDrawAnimRef.current) cancelAnimationFrame(routeDrawAnimRef.current);
      if (flyoverAnimRef.current) cancelAnimationFrame(flyoverAnimRef.current);
      if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
      if (orbitTimeoutRef.current) clearTimeout(orbitTimeoutRef.current);
      if (flowTimerRef.current) clearInterval(flowTimerRef.current);
      waypointItemsRef.current = [];
      map.remove();
      mapRef.current = null;
      setMapInstance(null);
    };
  }, [
    isMapActive,
    mapboxToken,
    bounds,
    displayCoordinates,
    isPatalsu,
    maxAltitude,
    placeName,
    routeData.placeId,
    routeData.waypoints,
    summitCoord,
    runProgressiveRouteDraw,
    updateWaypointVisibilities,
    startFlowAnimation,
    clearIntroTimeouts,
  ]);

  // Direct fast DOM updater for zero-lag 60fps telemetry HUD
  const updateTelemetryDOM = useCallback(
    (distKm: number, eleM: number, lat: number, lng: number, gradientPct: number) => {
      const roundedEle = Math.round(eleM);
      if (distValRef.current) distValRef.current.textContent = `${distKm.toFixed(1)} km`;
      if (elevValRef.current) elevValRef.current.textContent = `${roundedEle}m`;
      if (coordsValRef.current) {
        coordsValRef.current.textContent = `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E • ${gradientPct > 0 ? `+${gradientPct}%` : `${gradientPct}%`}`;
      }
      if (slopeValRef.current) {
        slopeValRef.current.textContent = `${gradientPct > 0 ? `+${gradientPct}%` : `${gradientPct}%`}`;
      }
      if (scrubberDistValRef.current) {
        scrubberDistValRef.current.textContent = `${distKm.toFixed(1)} km`;
      }
      if (oxygenValRef.current) {
        const physio = computeAltitudePhysiology(eleM);
        oxygenValRef.current.textContent = `${physio.oxygenPct}% O₂`;
        oxygenValRef.current.style.color = physio.zoneColor;
      }
    },
    []
  );

  // Stop 360° summit flyover orbit
  const stopOrbit = useCallback(() => {
    isOrbitingRef.current = false;
    setIsOrbiting(false);
    setOrbitBearing(0);
    setActivePeakAlert(null);
    startFlowAnimation();
    if (activeMarkerRef.current) {
      activeMarkerRef.current.getElement().style.display = "block";
    }
    if (orbitTimeoutRef.current) {
      clearTimeout(orbitTimeoutRef.current);
      orbitTimeoutRef.current = null;
    }
    if (orbitAnimRef.current) {
      cancelAnimationFrame(orbitAnimRef.current);
      orbitAnimRef.current = null;
    }
    if (milestoneTimeoutRef.current) {
      clearTimeout(milestoneTimeoutRef.current);
      milestoneTimeoutRef.current = null;
    }
    if (advisoryTimeoutRef.current) {
      clearTimeout(advisoryTimeoutRef.current);
      advisoryTimeoutRef.current = null;
    }
    setActiveMilestoneAlert(null);
    setActiveAdvisoryAlert(null);
    if (mapRef.current) {
      mapRef.current.stop();
    }
  }, [startFlowAnimation]);

  // Start 360° summit flyover orbit around peak with cinematic pull-back spiral & peak sightings
  const startOrbit = useCallback(() => {
    if (!mapRef.current) return;
    stopOrbit();
    isOrbitingRef.current = true;
    setIsPlayingFlyover(false);
    setIsOrbiting(true);

    // Show summit milestone crest badge during orbit
    const summitMilestone = keyMilestones.find((m) => m.category === "summit");
    if (summitMilestone) {
      setActiveMilestoneAlert(summitMilestone);
    }

    // Pin timeline and progress directly to the summit
    flyoverProgressRef.current = 1;
    setFlyoverProgress(1);
    if (progressTextRef.current) progressTextRef.current.textContent = "100%";
    if (scrubberDistValRef.current) scrubberDistValRef.current.textContent = `${flyoverMaxDistKm.toFixed(1)} km`;
    if (timelineInputRef.current) timelineInputRef.current.value = "1000";

    if (activeMarkerRef.current) {
      activeMarkerRef.current.setLngLat([summitCoord[0], summitCoord[1]]);
    }
    updateWaypointVisibilities(summitCoord[0], summitCoord[1]);

    const summitEle = summitCoord[2] || 0;
    updateTelemetryDOM(flyoverMaxDistKm, summitEle, summitCoord[1], summitCoord[0], 0);

    // Keep trail illuminated up to the summit
    try {
      if (mapRef.current?.getStyle() && mapRef.current.getLayer("trail-route-line")) {
        const stops = computeSafeGradientStops(1, "#00E5FF", "rgba(0, 229, 255, 0.2)");
        mapRef.current.setPaintProperty("trail-route-line", "line-gradient", stops);
      }
    } catch {}

    const map = mapRef.current;
    cameraCenterRef.current = [summitCoord[0], summitCoord[1]];
    cameraPitchRef.current = 68;
    cameraZoomRef.current = 14.6;

    map.easeTo({
      center: [summitCoord[0], summitCoord[1]],
      zoom: 14.6,
      pitch: 68,
      padding: { top: 0, bottom: 90, left: 0, right: 0 },
      duration: 1800,
    });

    let orbitElapsed = 0;
    let lastOrbitTime = performance.now();
    const orbitStep = (now: number) => {
      if (!isOrbitingRef.current || !mapRef.current) return;
      const deltaMs = Math.min(32, now - lastOrbitTime);
      lastOrbitTime = now;
      orbitElapsed += deltaMs;
      const deltaBearing = (deltaMs / 1000) * 6.5; // ~55s for calm, majestic 360° summit panoramic orbit
      const b = (mapRef.current.getBearing() + deltaBearing) % 360;

      // Commanding 3D Drone Spiral: starts intimate at summit crags (zoom 14.6, pitch 68°),
      // gently pulls back to reveal the surrounding mountain ranges (zoom 13.8, pitch 64°)
      // Steep pitch keeps colossal Himalayan snow massifs towering in dramatic 3D relief
      const orbitT = Math.min(1, orbitElapsed / 35000);
      const spiralT = orbitT * orbitT * (3 - 2 * orbitT);
      const spiralZoom = 14.6 - spiralT * 0.8;
      const spiralPitch = 68 - spiralT * 4;
      
      mapRef.current.jumpTo({
        center: [summitCoord[0], summitCoord[1]],
        bearing: b,
        pitch: spiralPitch,
        zoom: spiralZoom,
        padding: { top: 0, bottom: 90, left: 0, right: 0 },
      });

      setOrbitBearing(Math.round(b));

      // Sighting prominent Himalayan giants across the horizon
      const peakSighting = findActivePeakSighting(b, visiblePeaks, 18);
      setActivePeakAlert(peakSighting);

      if (isOrbitingRef.current) {
        orbitAnimRef.current = requestAnimationFrame(orbitStep);
      }
    };

    orbitTimeoutRef.current = setTimeout(() => {
      if (!isOrbitingRef.current || !mapRef.current) return;
      lastOrbitTime = performance.now();
      orbitElapsed = 0;
      orbitAnimRef.current = requestAnimationFrame(orbitStep);
    }, 1900);
  }, [
    stopOrbit,
    summitCoord,
    flyoverMaxDistKm,
    updateWaypointVisibilities,
    updateTelemetryDOM,
    keyMilestones,
    visiblePeaks,
  ]);

  // Main 60fps Ridge Traversal Loop (Strava-Grade Himalayan Chase Camera)
  const beginFlyoverLoop = useCallback((startProgress: number) => {
    if (!mapRef.current) return;
    setIsPlayingFlyover(true);
    isPlayingFlyoverRef.current = true;

    // Pause marching ants & hide DOM marker to eliminate WebGL tessellation and double-vision ghosting
    stopFlowAnimation();
    if (activeMarkerRef.current) {
      activeMarkerRef.current.getElement().style.display = "none";
    }

    const baseDuration = 36000; // 36s base time for smooth alpine traversal and calm tile loading
    const duration = baseDuration / speedMultiplier;
    const startTime = performance.now();
    const startLinear = startProgress <= 0.01 ? 0 : linearProgressRef.current;

    const frame = (now: number) => {
      if (!mapRef.current || !mapRef.current.getStyle() || !isPlayingFlyoverRef.current) {
        return;
      }

      const elapsed = now - startTime;
      const rawLinear = Math.min(1, startLinear + elapsed / duration);
      linearProgressRef.current = rawLinear;
      const p = adaptivePacingMapper(rawLinear);
      flyoverProgressRef.current = p;

      // Update progress text directly via DOM ref (NO React re-render churn at 60fps!)
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(p * 100)}%`;
      }
      if (timelineInputRef.current) {
        timelineInputRef.current.value = String(Math.round(p * 1000));
      }

      const pt = getPointAtProgress(p);
      const currentDistKm = Math.round(p * flyoverMaxDistKm * 10) / 10;

      // Fast zero-re-render direct DOM update
      updateTelemetryDOM(currentDistKm, pt.ele, pt.lat, pt.lng, pt.gradientPct);

      // Throttled store update (10 Hz) for elevation scrubber synchronization
      if (now - lastStoreSyncTimeRef.current > 100) {
        lastStoreSyncTimeRef.current = now;
        setActiveRoutePoint({
          progress: p,
          distanceKm: currentDistKm,
          elevationM: pt.ele,
          lat: pt.lat,
          lng: pt.lng,
        });
      }

      if (mapRef.current) {
        // 1. Throttled line gradient illumination (every >= 0.003 progress or upon completion)
        // Completely eliminates 60fps WebGL uniform thrashing and terrain tile flashing
        if (Math.abs(p - lastGradProgressRef.current) >= 0.003 || p >= 0.998) {
          lastGradProgressRef.current = p;
          try {
            if (mapRef.current.getStyle() && mapRef.current.getLayer("trail-route-line")) {
              const stops = computeSafeGradientStops(p, "#00E5FF", "rgba(0, 229, 255, 0.2)");
              mapRef.current.setPaintProperty("trail-route-line", "line-gradient", stops);
            }
          } catch {}
        }

        // 2. Move active hiker beacon (native GPU WebGL puck)
        const puckSource = mapRef.current.getSource("hiker-puck-source") as mapboxgl.GeoJSONSource;
        if (puckSource) {
          puckSource.setData({
            type: "Feature",
            properties: {},
            geometry: { type: "Point", coordinates: [pt.lng, pt.lat] },
          });
        }

        // 3. Strava-Grade 3D Chase Camera
        const stravaCamera = computeStravaChaseCamera(
          pt.lng,
          pt.lat,
          pt.bearing,
          pt.gradientPct
        );

        // 2-axis critically damped physical gimbal camera center suspension
        // Filters out high-frequency GPS coordinate wobble and switchback micro-kinks
        cameraCenterRef.current[0] += (pt.lng - cameraCenterRef.current[0]) * 0.12;
        cameraCenterRef.current[1] += (pt.lat - cameraCenterRef.current[1]) * 0.12;

        // Smooth camera pitch with Hermite-damped elevation response
        cameraPitchRef.current += (stravaCamera.pitch - cameraPitchRef.current) * 0.035;

        // Smooth camera zoom (strictly eliminates zoom-in/out pulsing / flicker)
        cameraZoomRef.current += (stravaCamera.zoom - cameraZoomRef.current) * 0.05;

        // Soft-knee rate-limited continuous bearing lerp: C^inf smooth angle stabilization
        // Hyperbolic tangent saturation eliminates robotic acceleration and corner jolts
        if (!shouldReduceMotion) {
          currentBearingRef.current = rateLimitedBearingLerp(
            currentBearingRef.current,
            pt.bearing,
            0.045,
            0.50
          );
        }

        // Camera flight tracking: stabilized camera center via physical gimbal suspension
        // padding: { bottom: 130 } positions the hiker in the lower-third with zero jitter
        mapRef.current.jumpTo({
          center: [cameraCenterRef.current[0], cameraCenterRef.current[1]],
          zoom: shouldReduceMotion ? 12.0 : cameraZoomRef.current,
          pitch: shouldReduceMotion ? 20 : cameraPitchRef.current,
          bearing: shouldReduceMotion ? -35 : currentBearingRef.current,
          padding: { top: 0, bottom: 130, left: 0, right: 0 },
        });

        // 4. Throttled waypoint proximity culling (runs every 150ms instead of 60fps)
        // Completely eliminates DOM layout thrashing and marker opacity flickering
        if (now - lastWaypointCheckRef.current > 150) {
          lastWaypointCheckRef.current = now;
          updateWaypointVisibilities(pt.lng, pt.lat);
        }

        // Broadcast alpine milestone progression triggers (Solang Village, Shagadugh Meadow, Patalsu Peak)
        for (const ms of keyMilestones) {
          if (!triggeredMilestoneIdsRef.current.has(ms.id)) {
            if (p >= ms.progress - 0.02 && p <= ms.progress + 0.06) {
              triggeredMilestoneIdsRef.current.add(ms.id);
              setActiveMilestoneAlert(ms);
              if (milestoneTimeoutRef.current) clearTimeout(milestoneTimeoutRef.current);
              if (ms.category !== "summit") {
                milestoneTimeoutRef.current = setTimeout(() => {
                  setActiveMilestoneAlert(null);
                }, 1200);
              }
              break;
            }
          }
        }

        // Alpine Tactical Field Advisories (loose scree, steep gradient, water cutoffs)
        for (const adv of tacticalAdvisories) {
          if (!triggeredAdvisoryIdsRef.current.has(adv.id)) {
            if (p >= adv.progress - 0.02 && p <= adv.progress + 0.05) {
              triggeredAdvisoryIdsRef.current.add(adv.id);
              setActiveAdvisoryAlert(adv);
              if (advisoryTimeoutRef.current) clearTimeout(advisoryTimeoutRef.current);
              advisoryTimeoutRef.current = setTimeout(() => {
                setActiveAdvisoryAlert(null);
              }, 1400);
              break;
            }
          }
        }

      }

      if (p < 1) {
        flyoverAnimRef.current = requestAnimationFrame(frame);
      } else {
        setIsPlayingFlyover(false);
        isPlayingFlyoverRef.current = false;
        setFlyoverProgress(1);

        const summitMilestone = keyMilestones.find((m) => m.category === "summit");
        if (summitMilestone) {
          setActiveMilestoneAlert(summitMilestone);
        }

        // Keep the trail up to the summit illuminated with vibrant glacier cyan!
        try {
          if (mapRef.current?.getStyle() && mapRef.current.getLayer("trail-route-line")) {
            const stops = computeSafeGradientStops(1, "#00E5FF", "rgba(0, 229, 255, 0.2)");
            mapRef.current.setPaintProperty("trail-route-line", "line-gradient", stops);
          }
        } catch {}

        // Automatically transition into 360° panoramic summit flyover orbit upon arrival!
        if (!shouldReduceMotion) {
          startOrbit();
        }
      }
    };

    flyoverAnimRef.current = requestAnimationFrame(frame);
  }, [
    speedMultiplier,
    adaptivePacingMapper,
    tacticalAdvisories,
    getPointAtProgress,
    flyoverMaxDistKm,
    updateTelemetryDOM,
    shouldReduceMotion,
    startOrbit,
    updateWaypointVisibilities,
    keyMilestones,
    stopFlowAnimation,
  ]);

  // Pause Flyover Ridge Animation with complete cancellation of intro timers & flights
  const pauseFlyover = useCallback(() => {
    clearIntroTimeouts();
    if (flyoverAnimRef.current) {
      cancelAnimationFrame(flyoverAnimRef.current);
      flyoverAnimRef.current = null;
    }
    if (milestoneTimeoutRef.current) {
      clearTimeout(milestoneTimeoutRef.current);
      milestoneTimeoutRef.current = null;
    }
    if (advisoryTimeoutRef.current) {
      clearTimeout(advisoryTimeoutRef.current);
      advisoryTimeoutRef.current = null;
    }
    if (mapRef.current) {
      mapRef.current.stop();
    }
    setIsIntroZooming(false);
    setIsPlayingFlyover(false);
    isPlayingFlyoverRef.current = false;
    setFlyoverProgress(flyoverProgressRef.current);
    setActiveMilestoneAlert(null);
    setActiveAdvisoryAlert(null);
    startFlowAnimation();
    if (activeMarkerRef.current) {
      activeMarkerRef.current.getElement().style.display = "block";
    }
  }, [startFlowAnimation, clearIntroTimeouts]);

  // Start / Resume Flyover Ridge Animation with Strava-Style Stabilized Trailhead Start & Milestone
  const startFlyover = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.stop();
    stopOrbit();
    clearIntroTimeouts();

    let startProgress = flyoverProgressRef.current;
    if (startProgress >= 0.90) {
      startProgress = 0;
      flyoverProgressRef.current = 0;
      linearProgressRef.current = 0;
      setFlyoverProgress(0);
    }

    // 2-Stage Cinematic Intro: Smooth Zoom-Out Arc followed by Swoop-In to Trailhead
    if (startProgress < 0.01) {
      setIsPlayingFlyover(true);
      isPlayingFlyoverRef.current = true;
      setIsIntroZooming(true);

      const startPt = getPointAtProgress(0);
      const stravaCamera = computeStravaChaseCamera(
        startPt.lng,
        startPt.lat,
        startPt.bearing,
        startPt.gradientPct
      );

      // Pre-position active beacon at trailhead on both WebGL canvas and DOM
      const puckSource = mapRef.current.getSource("hiker-puck-source") as mapboxgl.GeoJSONSource;
      if (puckSource) {
        puckSource.setData({
          type: "Feature",
          properties: {},
          geometry: { type: "Point", coordinates: [startPt.lng, startPt.lat] },
        });
      }
      if (activeMarkerRef.current) {
        activeMarkerRef.current.setLngLat([startPt.lng, startPt.lat]);
      }

      // Reset triggered milestones & advisories for clean flight replay
      triggeredMilestoneIdsRef.current.clear();
      triggeredAdvisoryIdsRef.current.clear();
      linearProgressRef.current = 0;
      setActiveAdvisoryAlert(null);

      const currentZoom = mapRef.current.getZoom();
      const currentPitch = mapRef.current.getPitch();
      const currentBearing = mapRef.current.getBearing();
      const currentCenter = mapRef.current.getCenter();

      // Stage 1: Smooth aerial lift & gentle zoom out (giving broad perspective of the valley basin)
      const liftZoom = Math.max(12.0, Math.min(currentZoom - 0.7, 13.5));
      const liftPitch = Math.min(currentPitch, 44);
      const liftBearing = interpolateBearing(currentBearing, stravaCamera.bearing, 0.45);
      const liftCenter: [number, number] = [
        (currentCenter.lng + startPt.lng) / 2,
        (currentCenter.lat + startPt.lat) / 2,
      ];

      mapRef.current.flyTo({
        center: liftCenter,
        zoom: liftZoom,
        pitch: liftPitch,
        bearing: liftBearing,
        duration: 850,
        essential: true,
      });

      // Stage 2: Gracefully dive and swoop into the trailhead starting anchor
      introTimeoutRef.current = setTimeout(() => {
        if (!mapRef.current) return;
        mapRef.current.flyTo({
          center: [startPt.lng, startPt.lat],
          zoom: stravaCamera.zoom,
          pitch: stravaCamera.pitch,
          bearing: stravaCamera.bearing,
          padding: { top: 0, bottom: 130, left: 0, right: 0 },
          duration: 1350,
          essential: true,
        });

        // Synchronize internal camera references
        cameraCenterRef.current = [startPt.lng, startPt.lat];
        cameraPitchRef.current = stravaCamera.pitch;
        cameraZoomRef.current = stravaCamera.zoom;
        currentBearingRef.current = stravaCamera.bearing;
      }, 850);

      // Stage 3: Trailhead Anchor Hold & Milestone Badge (high-res textures & DEM stabilize)
      introStage2TimeoutRef.current = setTimeout(() => {
        if (keyMilestones[0]) {
          setActiveMilestoneAlert(keyMilestones[0]);
          triggeredMilestoneIdsRef.current.add(keyMilestones[0].id);
          if (milestoneTimeoutRef.current) clearTimeout(milestoneTimeoutRef.current);
          milestoneTimeoutRef.current = setTimeout(() => {
            setActiveMilestoneAlert(null);
          }, 1400);
        }
      }, 2200);

      // Stage 4: Seamless flight departure
      introStage3TimeoutRef.current = setTimeout(() => {
        setIsIntroZooming(false);
        linearProgressRef.current = 0;
        beginFlyoverLoop(0);
      }, 2900);

      return;
    }

    const resumePt = getPointAtProgress(startProgress);
    cameraCenterRef.current = [resumePt.lng, resumePt.lat];
    beginFlyoverLoop(startProgress);
  }, [
    stopOrbit,
    getPointAtProgress,
    beginFlyoverLoop,
    keyMilestones,
    clearIntroTimeouts,
  ]);

  // Direct altimeter & flight progress seeker
  const seekToProgress = useCallback(
    (p: number) => {
      const clampedP = Math.max(0, Math.min(1, p));
      linearProgressRef.current = clampedP;
      flyoverProgressRef.current = clampedP;
      setFlyoverProgress(clampedP);
      stopOrbit();
      setActiveAdvisoryAlert(null);

      const pt = getPointAtProgress(clampedP);
      const currentDistKm = Math.round(clampedP * flyoverMaxDistKm * 10) / 10;
      updateTelemetryDOM(currentDistKm, pt.ele, pt.lat, pt.lng, pt.gradientPct);

      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(clampedP * 100)}%`;
      }
      if (timelineInputRef.current) {
        timelineInputRef.current.value = String(Math.round(clampedP * 1000));
      }

      setActiveRoutePoint({
        progress: clampedP,
        distanceKm: currentDistKm,
        elevationM: pt.ele,
        lat: pt.lat,
        lng: pt.lng,
      });

      if (mapRef.current) {
        try {
          if (mapRef.current.getStyle() && mapRef.current.getLayer("trail-route-line")) {
            const stops = computeSafeGradientStops(clampedP, "#00E5FF", "rgba(0, 229, 255, 0.2)");
            mapRef.current.setPaintProperty("trail-route-line", "line-gradient", stops);
          }
        } catch {}

        // Move active hiker beacon (both GPU WebGL puck and DOM marker)
        const puckSource = mapRef.current.getSource("hiker-puck-source") as mapboxgl.GeoJSONSource;
        if (puckSource) {
          puckSource.setData({
            type: "Feature",
            properties: {},
            geometry: { type: "Point", coordinates: [pt.lng, pt.lat] },
          });
        }
        if (activeMarkerRef.current) {
          activeMarkerRef.current.setLngLat([pt.lng, pt.lat]);
        }

        // Instant Strava-grade camera placement while dragging timeline scrubber
        const stravaCamera = computeStravaChaseCamera(
          pt.lng,
          pt.lat,
          pt.bearing,
          pt.gradientPct
        );
        cameraCenterRef.current = [pt.lng, pt.lat];
        cameraPitchRef.current = stravaCamera.pitch;
        cameraZoomRef.current = stravaCamera.zoom;
        currentBearingRef.current = stravaCamera.bearing;
        mapRef.current.jumpTo({
          center: [pt.lng, pt.lat],
          zoom: stravaCamera.zoom,
          pitch: stravaCamera.pitch,
          bearing: stravaCamera.bearing,
          padding: { top: 0, bottom: 130, left: 0, right: 0 },
        });

        // Dynamic proximity culling for waypoint badges
        updateWaypointVisibilities(pt.lng, pt.lat);
      }
    },
    [
      getPointAtProgress,
      flyoverMaxDistKm,
      updateTelemetryDOM,
      stopOrbit,
      updateWaypointVisibilities,
    ]
  );



  // Speed multiplier cycle
  const cycleSpeed = useCallback(() => {
    const nextSpeed = speedMultiplier === 1 ? 2 : speedMultiplier === 2 ? 4 : 1;
    setSpeedMultiplier(nextSpeed);
    if (isPlayingFlyover) {
      pauseFlyover();
      setTimeout(() => startFlyover(), 50);
    }
  }, [speedMultiplier, isPlayingFlyover, pauseFlyover, startFlyover]);

  // Reset to full route overview
  const resetFlyover = useCallback(() => {
    pauseFlyover();
    stopOrbit();
    setActiveMilestoneAlert(null);
    setActiveAdvisoryAlert(null);
    setActivePeakAlert(null);
    if (milestoneTimeoutRef.current) {
      clearTimeout(milestoneTimeoutRef.current);
      milestoneTimeoutRef.current = null;
    }
    if (advisoryTimeoutRef.current) {
      clearTimeout(advisoryTimeoutRef.current);
      advisoryTimeoutRef.current = null;
    }
    triggeredMilestoneIdsRef.current.clear();
    triggeredAdvisoryIdsRef.current.clear();
    linearProgressRef.current = 0;
    flyoverProgressRef.current = 0;
    setFlyoverProgress(0);
    setActiveRoutePoint(null);
    currentBearingRef.current = -35;
    cameraCenterRef.current = [displayCoordinates[0][0], displayCoordinates[0][1]];
    cameraPitchRef.current = 50;
    cameraZoomRef.current = 15.3;
    startFlowAnimation();
    if (activeMarkerRef.current) {
      activeMarkerRef.current.getElement().style.display = "block";
    }

    if (progressTextRef.current) progressTextRef.current.textContent = "0%";
    if (timelineInputRef.current) timelineInputRef.current.value = "0";

    if (scrubberDistValRef.current) {
      scrubberDistValRef.current.textContent = "0.0 km";
    }

    if (mapRef.current) {
      runProgressiveRouteDraw(mapRef.current);

      mapRef.current.fitBounds(bounds, {
        padding: { top: 80, bottom: 80, left: 60, right: 60 },
        pitch: is3DMode ? 52 : 0,
        bearing: -35,
        duration: 1800,
      });

      const puckSource = mapRef.current.getSource("hiker-puck-source") as mapboxgl.GeoJSONSource;
      if (puckSource) {
        puckSource.setData({
          type: "Feature",
          properties: {},
          geometry: { type: "Point", coordinates: [displayCoordinates[0][0], displayCoordinates[0][1]] },
        });
      }

      if (activeMarkerRef.current) {
        activeMarkerRef.current.setLngLat([displayCoordinates[0][0], displayCoordinates[0][1]]);
      }

      updateWaypointVisibilities(displayCoordinates[0][0], displayCoordinates[0][1]);
    }
  }, [
    pauseFlyover,
    stopOrbit,
    runProgressiveRouteDraw,
    bounds,
    is3DMode,
    displayCoordinates,
    updateWaypointVisibilities,
    startFlowAnimation,
  ]);

  // Toggle 2D Topo vs 3D Mountain Perspective
  const toggle3D = useCallback(() => {
    if (!mapRef.current) return;
    const next3D = !is3DMode;
    setIs3DMode(next3D);
    stopOrbit();
    mapRef.current.easeTo({
      pitch: next3D ? 65 : 0,
      bearing: next3D ? currentBearingRef.current : 0,
      duration: 1200,
    });
  }, [is3DMode, stopOrbit]);

  const resetNorth = useCallback(() => {
    if (!mapRef.current) return;
    stopOrbit();
    currentBearingRef.current = 0;
    mapRef.current.easeTo({ bearing: 0, duration: 800 });
  }, [stopOrbit]);

  const handleZoom = useCallback((delta: number) => {
    if (!mapRef.current) return;
    mapRef.current.zoomTo(mapRef.current.getZoom() + delta, { duration: 400 });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
          setTimeout(() => mapRef.current?.resize(), 50);
          setTimeout(() => mapRef.current?.resize(), 150);
          setTimeout(() => mapRef.current?.resize(), 300);
        })
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
          setTimeout(() => mapRef.current?.resize(), 50);
          setTimeout(() => mapRef.current?.resize(), 150);
          setTimeout(() => mapRef.current?.resize(), 300);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
          (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );
      setIsFullscreen(isFs);
      setTimeout(() => mapRef.current?.resize(), 50);
      setTimeout(() => mapRef.current?.resize(), 150);
      setTimeout(() => mapRef.current?.resize(), 300);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMapActive) return;
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
      } else if (e.key === " " && !isPlayingFlyover) {
        e.preventDefault();
        startFlyover();
      } else if (e.key === " " && isPlayingFlyover) {
        e.preventDefault();
        pauseFlyover();
      } else if (e.key === "Escape" && isFullscreen) {
        e.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMapActive, isFullscreen, isPlayingFlyover, startFlyover, pauseFlyover, toggleFullscreen]);

  const defaultTelemetryPoint = useMemo(() => {
    return getPointAtProgress(flyoverProgress);
  }, [getPointAtProgress, flyoverProgress]);

  const activeTelemetry = externalHoverPoint || {
    distanceKm: Math.round(flyoverProgress * flyoverMaxDistKm * 10) / 10,
    elevationM: Math.round(defaultTelemetryPoint.ele),
    lat: defaultTelemetryPoint.lat,
    lng: defaultTelemetryPoint.lng,
  };

  return (
    <div
      ref={containerRef}
      className={`w-full ${
        isFullscreen
          ? "fixed inset-0 z-[99999] h-screen w-screen m-0 p-0 rounded-none bg-slate-950 overflow-hidden"
          : "my-8 scroll-mt-24"
      }`}
      id={`3d-route-map-${placeSlug}`}
      data-place-slug={placeSlug}
    >
      {/* 3D Map Container Card */}
      <div
        className={`map-canvas-container preserve-white-text relative w-full overflow-hidden ${
          isFullscreen
            ? "h-full w-full rounded-none border-0 bg-slate-950"
            : "rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/10 bg-slate-950 shadow-2xl"
        }`}
      >
        {/* Still Poster Launcher View (Saves Mapbox Free Tier & Protects Lighthouse 90+) */}
        {!isMapActive ? (
          <div className="relative w-full min-h-[480px] sm:min-h-[560px] flex flex-col items-center justify-center p-6 sm:p-12 text-center overflow-hidden">
            {/* Ambient Background Graphic */}
            <div
              className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105"
              style={{
                backgroundImage:
                  "url('https://res.cloudinary.com/dehriwm1o/image/upload/f_auto,q_auto,w_1600/v1777213099/Wallpaper.jpg')",
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60" />

            {/* Poster Content */}
            <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider mb-4 border"
                style={{
                  backgroundColor: `${accentColor}15`,
                  borderColor: `${accentColor}35`,
                  color: accentColor,
                }}
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>Verified 3D Himalayan GPS Terrain</span>
              </div>

              <h3 className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight mb-3">
                Explore the {placeName} 3D Ridge
              </h3>

              <p className="text-white/80 font-light text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
                Walk the real {distance} Himalayan trail trace in full 3D satellite topography. Inspect high camps, elevation milestones, and switchbacks before setting foot on the mountain.
              </p>

              {/* Trail Specs Pill Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 w-full max-w-md text-left font-mono">
                <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] text-white/50 uppercase block">Distance</span>
                  <span className="text-white font-bold text-sm sm:text-base">{distance}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] text-white/50 uppercase block">Summit Elev</span>
                  <span className="text-cyan-400 font-bold text-sm sm:text-base">{maxAltitude}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] text-white/50 uppercase block">Vert Gain</span>
                  <span className="text-emerald-400 font-bold text-sm sm:text-base">+{routeData.stats.gainM}m</span>
                </div>
              </div>

              {/* Main Launch CTA Button */}
              {webGlSupported ? (
                <button
                  type="button"
                  onClick={() => setIsMapActive(true)}
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm sm:text-base tracking-wide transition-all duration-300 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-105 active:scale-95 cursor-pointer min-h-[48px]"
                >
                  <Compass className="w-5 h-5 animate-spin-slow" />
                  <span>Launch Interactive 3D Ridge Map</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  WebGL 3D rendering is not supported on this browser. You can still download the verified GPX track below.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Active Interactive Mapbox 3D Container */
          <div
            className={`relative w-full ${isFullscreen ? "h-screen min-h-screen" : "h-[560px] sm:h-[660px]"}`}
            data-flying={isPlayingFlyover ? "true" : "false"}
          >
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Top Telemetry Overlay Dock (Zero-Lag Direct DOM Refs) */}
            <div className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-2 sm:left-4 right-2 sm:right-auto z-20 flex flex-wrap items-center gap-1.5 sm:gap-3 pointer-events-none">
              <div className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900/90 border border-white/15 backdrop-blur-md text-white font-mono text-[11px] sm:text-xs shadow-xl pointer-events-auto">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Mountain className="w-3.5 h-3.5" />
                  <span ref={elevValRef}>{activeTelemetry.elevationM}m</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <div className="text-white/80">
                  <span ref={distValRef}>{activeTelemetry.distanceKm} km</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <div className="flex items-center gap-1.5 font-semibold">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  <span ref={oxygenValRef} className="text-emerald-400">
                    {computeAltitudePhysiology(activeTelemetry.elevationM).oxygenPct}% O₂
                  </span>
                </div>
                <div className="w-px h-3 bg-white/20 hidden sm:block" />
                <div className="text-white/60 text-[11px] hidden sm:block">
                  <span ref={coordsValRef}>
                    {activeTelemetry.lat.toFixed(4)}°N, {activeTelemetry.lng.toFixed(4)}°E
                  </span>
                </div>
              </div>
            </div>



            {/* 3D Overview & Trailhead Fly-In Toast */}
            {isIntroZooming && (
              <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-400/50 shadow-[0_0_24px_rgba(0,229,255,0.3)] text-white font-mono text-[11px] font-bold">
                  <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span className="text-white/95">3D OVERVIEW • APPROACHING TRAILHEAD</span>
                  <span className="text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded-full border border-cyan-500/40 text-[10px]">
                    3D ZOOM
                  </span>
                </div>
              </div>
            )}

            {/* 360° Summit Orbit Compass Telemetry Banner */}
            {isOrbiting && (
              <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/40 shadow-lg text-white font-mono text-[11px] font-bold">
                  <Orbit className="w-3 h-3 text-cyan-400 animate-spin" />
                  <span className="text-white/90">SUMMIT ORBIT • {maxAltitude}</span>
                  <span className="text-cyan-300 bg-cyan-950/60 px-1.5 py-0.2 rounded-full border border-cyan-500/30 text-[10px]">
                    {orbitBearing}° {getCompassDirection(orbitBearing)}
                  </span>
                </div>
              </div>
            )}

            {/* Live Alpine Milestone Badge (Trailhead, Key Meadow/Camp, Summit Crest) */}
            {activeMilestoneAlert && (isPlayingFlyover || isOrbiting) && (
              <div
                className={`absolute ${
                  isOrbiting ? "top-12 sm:top-14" : "top-3 sm:top-4"
                } left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-300 max-w-[90vw] sm:max-w-md`}
              >
                <div
                  className="flex items-center gap-2.5 px-3.5 py-1.5 sm:py-2 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(8, 14, 26, 0.92)",
                    borderColor: `${activeMilestoneAlert.accentColor}88`,
                    boxShadow: `0 8px 30px -4px ${activeMilestoneAlert.accentColor}40`,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${activeMilestoneAlert.accentColor}25`,
                      borderColor: `${activeMilestoneAlert.accentColor}80`,
                      color: activeMilestoneAlert.accentColor,
                    }}
                  >
                    {activeMilestoneAlert.kind === "summit" ? (
                      <Trophy className="w-3.5 h-3.5 animate-bounce" />
                    ) : activeMilestoneAlert.kind === "trailhead" ? (
                      <MapPin className="w-3.5 h-3.5" />
                    ) : (
                      <Compass className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0 pr-1 text-left">
                    <span
                      className="font-mono text-[9px] font-bold tracking-wider uppercase leading-none"
                      style={{ color: activeMilestoneAlert.accentColor }}
                    >
                      {activeMilestoneAlert.kicker}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-white text-xs sm:text-sm tracking-tight truncate">
                        {activeMilestoneAlert.name}
                      </span>
                      {activeMilestoneAlert.elevationM && (
                        <span className="font-mono text-[10px] text-white/80 bg-white/10 px-1.5 py-0.5 rounded-full shrink-0">
                          {activeMilestoneAlert.elevationM}m
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Horizon Peak Sighting Badge (Visible Himalayan Giants during Summit Orbit) */}
            {activePeakAlert && isOrbiting && (
              <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-300 max-w-[90vw] sm:max-w-md">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-cyan-400/60 shadow-[0_8px_30px_rgba(0,229,255,0.25)] text-white font-mono text-xs">
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0 text-cyan-300">
                    <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                  </div>
                  <div className="flex flex-col min-w-0 pr-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">
                        HORIZON SIGHTING
                      </span>
                      <span className="text-[9px] text-white/60 bg-white/10 px-1.5 py-0.2 rounded-full">
                        {activePeakAlert.distanceKm} km {activePeakAlert.compassDir} ({activePeakAlert.bearingDeg}°)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-white text-xs sm:text-sm tracking-tight truncate">
                        {activePeakAlert.peak.name}
                      </span>
                      <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded-full shrink-0">
                        {activePeakAlert.peak.heightM}m
                      </span>
                      <span className="text-[10px] text-white/40 hidden sm:inline">
                        • {activePeakAlert.peak.range}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Tactical Alpine Advisory Badge (Terrain Hazards & Caution Alerts) */}
            {activeAdvisoryAlert && isPlayingFlyover && (
              <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300 max-w-[90vw] sm:max-w-md">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-amber-400/60 shadow-[0_8px_30px_rgba(245,158,11,0.25)] text-white font-mono text-xs">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0 pr-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                        FIELD CAUTION
                      </span>
                      <span className="text-[9px] text-white/60 bg-white/10 px-1.5 py-0.2 rounded-full">
                        {(activeAdvisoryAlert.progress * flyoverMaxDistKm).toFixed(1)} km
                      </span>
                      {activeAdvisoryAlert.elevationM && (
                        <span className="text-[9px] text-amber-300/80 bg-amber-950/50 px-1.5 py-0.2 rounded-full border border-amber-500/30">
                          {activeAdvisoryAlert.elevationM}m
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-white text-xs sm:text-sm tracking-tight truncate">
                        {activeAdvisoryAlert.title}
                      </span>
                      <span className="font-sans text-[11px] text-amber-200/90 hidden sm:inline">
                        — {activeAdvisoryAlert.detail}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Strava-Grade Control Cockpit & Interactive Timeline Scrubber */}
            <div className="absolute bottom-[max(0.625rem,env(safe-area-inset-bottom))] sm:bottom-4 left-2 right-2 sm:left-4 sm:right-4 z-20 pointer-events-none flex flex-col items-center gap-2">
              <div className="w-full max-w-2xl p-2 sm:p-3 rounded-2xl bg-slate-950/90 border border-white/15 backdrop-blur-md shadow-2xl pointer-events-auto">
                {/* Strava Scrub Timeline Bar */}
                <div className="flex items-center gap-2 sm:gap-3 px-1 mb-2">
                  <span
                    ref={progressTextRef}
                    className="text-[10px] font-mono font-bold text-cyan-400 shrink-0 w-8"
                  >
                    {Math.round(flyoverProgress * 100)}%
                  </span>
                  <div className="relative flex-1 flex items-center">
                    <input
                      ref={timelineInputRef}
                      type="range"
                      min="0"
                      max="1000"
                      value={Math.round(flyoverProgress * 1000)}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) / 1000;
                        if (isPlayingFlyover) pauseFlyover();
                        seekToProgress(val);
                      }}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-hidden touch-manipulation py-1"
                      aria-label="Route Playback Timeline Scrubber"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/50 shrink-0">
                    <span ref={scrubberDistValRef}>{activeTelemetry.distanceKm.toFixed(1)} km</span> / {flyoverMaxDistKm.toFixed(1)} km
                  </span>
                </div>

                {/* Primary Player Action Controls & Tools */}
                <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {!isPlayingFlyover ? (
                      <button
                        type="button"
                        onClick={startFlyover}
                        className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 sm:px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                        aria-label="Play 3D Flyover"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={pauseFlyover}
                        className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 sm:px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                        aria-label="Pause Flyover"
                      >
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Pause</span>
                      </button>
                    )}

                    {/* Speed Multiplier Button */}
                    <button
                      type="button"
                      onClick={cycleSpeed}
                      className="min-h-[38px] min-w-[38px] px-2 sm:px-2.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/15 text-white/90 text-[11px] font-mono font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1 touch-manipulation"
                      aria-label="Cycle Flyover Speed"
                      title="Playback Speed"
                    >
                      <FastForward className="w-3 h-3 text-cyan-400" />
                      <span>{speedMultiplier}x</span>
                    </button>

                    {/* 360° Summit Orbit Button */}
                    <button
                      type="button"
                      onClick={isOrbiting ? stopOrbit : startOrbit}
                      className={`min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-mono font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation ${
                        isOrbiting
                          ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-cyan-500/30 animate-pulse"
                          : "bg-slate-900 hover:bg-slate-800 text-white/80 hover:text-white border-white/15"
                      }`}
                      aria-label="360 Summit Flyover"
                      title="360° Summit Flyover Orbit"
                    >
                      <Orbit className={`w-3.5 h-3.5 ${isOrbiting ? "animate-spin" : ""}`} />
                      <span className="hidden sm:inline">
                        {isOrbiting ? "Orbiting" : "Summit Orbit"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={resetFlyover}
                      className="min-h-[38px] min-w-[38px] p-2 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/15 text-white/70 hover:text-white shadow-md transition-all cursor-pointer flex items-center justify-center touch-manipulation"
                      aria-label="Reset View"
                      title="Reset Overview"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    {/* 🎬 Export 3D Video Button */}
                    <button
                      type="button"
                      onClick={() => setIsExportModalOpen(true)}
                      className="min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-900 hover:bg-cyan-950/60 text-cyan-300 hover:text-white border border-cyan-400/40 hover:border-cyan-400 font-mono text-[11px] font-bold shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer touch-manipulation"
                      aria-label="Export 3D Alpine Video"
                      title="Export 3D MP4 / WebM Video"
                    >
                      <Film className="w-3 h-3 text-cyan-400" />
                      <span className="hidden md:inline">Export</span>
                    </button>
                  </div>

                  {/* Camera & Zoom Console */}
                  <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 rounded-full bg-slate-900 border border-white/15 shadow-md">
                    <button
                      type="button"
                      onClick={toggle3D}
                      className="min-h-[34px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 rounded-full text-xs font-mono font-bold text-white/90 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center touch-manipulation"
                      aria-label="Toggle 3D View"
                    >
                      {is3DMode ? "3D" : "2D"}
                    </button>
                    <div className="w-px h-3 bg-white/20" />
                    <button
                      type="button"
                      onClick={resetNorth}
                      className="min-h-[34px] min-w-[34px] sm:min-h-[36px] sm:min-w-[36px] p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center touch-manipulation"
                      aria-label="Reset North"
                      title="Reset North"
                    >
                      <Compass className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-3 bg-white/20" />
                    <button
                      type="button"
                      onClick={() => handleZoom(0.8)}
                      className="min-h-[34px] min-w-[34px] sm:min-h-[36px] sm:min-w-[36px] p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center touch-manipulation"
                      aria-label="Zoom In"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleZoom(-0.8)}
                      className="min-h-[34px] min-w-[34px] sm:min-h-[36px] sm:min-w-[36px] p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center touch-manipulation"
                      aria-label="Zoom Out"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-3 bg-white/20" />
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="min-h-[34px] min-w-[34px] sm:min-h-[36px] sm:min-w-[36px] p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center touch-manipulation"
                      aria-label="Toggle Fullscreen"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Attribution Bar */}
            <div className="absolute top-2 right-2 z-10 text-[9px] font-mono text-white/40 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
              &copy; Mapbox &copy; OpenStreetMap
            </div>

            {/* 3D Video Export Modal */}
            <FlyoverVideoExportModal
              isOpen={isExportModalOpen}
              onClose={() => setIsExportModalOpen(false)}
              map={mapInstance}
              placeName={placeName}
              placeSlug={placeSlug}
              maxAltitude={maxAltitude}
              territoryName="Himalayas"
              apexElevationM={apexInfo.maxEle}
              getPointAtProgress={getPointAtProgress}
              summitCoord={summitCoord}
              flyoverMaxDistKm={flyoverMaxDistKm}
              waypoints={routeData?.waypoints || []}
              coordinates={displayCoordinates}
            />
          </div>
        )}
      </div>
    </div>
  );
}
