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
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { RouteData } from "@/data/types";
import { useActiveRoutePoint, setActiveRoutePoint } from "@/lib/route-store";
import {
  haversineDistanceKm,
  rateLimitedBearingLerp,
  computeMacroBearing,
  computeAdaptivePitch,
  computeSafeGradientStops,
  cubicEaseOut,
  getInterpolatedPoint,
} from "@/lib/camera-math";
import { registerPulsingBeacon } from "@/lib/mapbox-canvas-beacon";

interface RouteMap3DProps {
  routeData: RouteData;
  placeName: string;
  placeSlug: string;
  maxAltitude: string;
  distance: string;
  accentColor?: string;
  isPatalsu?: boolean;
}

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
  const [isPlayingFlyover, setIsPlayingFlyover] = useState(false);
  const [isOrbiting, setIsOrbiting] = useState(false);
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
  const orbitAnimRef = useRef<number | null>(null);
  const orbitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flowTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentBearingRef = useRef<number>(-35);
  const lastStoreSyncTimeRef = useRef<number>(0);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const coordinates = routeData.line.coordinates; // [lng, lat, eleM][]

  // Gimbal and flight smoothing refs (prevents camera jitter & continuous steady-cam suspension)
  const flyoverProgressRef = useRef<number>(0);
  const cameraCenterRef = useRef<[number, number]>([coordinates[0][0], coordinates[0][1]]);
  const cameraPitchRef = useRef<number>(48);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const scrubberDistValRef = useRef<HTMLSpanElement>(null);

  // Left Vertical Altimeter DOM refs (zero-lag 60fps tracking)
  const altimeterFillRef = useRef<HTMLDivElement>(null);
  const altimeterThumbRef = useRef<HTMLDivElement>(null);
  const altimeterValRef = useRef<HTMLSpanElement>(null);

  // Fast direct DOM refs for zero-re-render 60fps telemetry HUD
  const elevValRef = useRef<HTMLSpanElement>(null);
  const distValRef = useRef<HTMLSpanElement>(null);
  const coordsValRef = useRef<HTMLSpanElement>(null);
  const slopeValRef = useRef<HTMLSpanElement>(null);

  const activeHoverPoint = useActiveRoutePoint();

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

  const altimeterTrackRef = useRef<HTMLDivElement>(null);
  const isDraggingAltimeterRef = useRef<boolean>(false);

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
    };
  }, [coordinates, cumDistances, totalDistanceKm]);

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

      // Smooth Macro Valley Bearing (550m lookahead window, apex-clamped on ascent)
      const bearing = computeMacroBearing(coordinates, cumDistances, targetDist, 0.55, apexDistKm);

      // Lookahead point for gradient and adaptive anti-clipping pitch
      const aheadDist = Math.min(flyoverMaxDistKm, targetDist + 0.22);
      const aheadPt = getInterpolatedPoint(coordinates, cumDistances, aheadDist);
      const aheadDistMeters = Math.max(30, (aheadDist - targetDist) * 1000);
      const deltaElev = aheadPt[2] - ele;
      const gradientPct = Math.round((deltaElev / aheadDistMeters) * 100);

      // Adaptive Pitch Damper: 48° down to 38° on steep ascents & steep descents
      const adaptivePitch = computeAdaptivePitch(ele, aheadPt[2], aheadDistMeters, 48, 38);

      return { lng, lat, ele, bearing, adaptivePitch, gradientPct };
    },
    [coordinates, cumDistances, flyoverMaxDistKm, apexDistKm]
  );

  // High-Altitude Vertical Altimeter stats for the left-side cockpit gauge
  const altimeterStats = useMemo(() => {
    const startEle = coordinates[0]?.[2] || 0;
    const maxEle =
      summitCoord[2] ||
      coordinates.reduce((max, c) => ((c[2] || 0) > max ? (c[2] || 0) : max), startEle);
    const minEle = coordinates.reduce((min, c) => ((c[2] || 0) < min ? (c[2] || 0) : min), startEle);
    const range = Math.max(100, maxEle - minEle);
    const amsPct = 3000 >= minEle && 3000 <= maxEle ? ((3000 - minEle) / range) * 100 : null;
    return { minEle: Math.round(minEle), maxEle: Math.round(maxEle), range, amsPct };
  }, [coordinates, summitCoord]);

  const initialAltPct = useMemo(() => {
    const ele = coordinates[0]?.[2] || altimeterStats.minEle;
    return Math.max(0, Math.min(100, ((ele - altimeterStats.minEle) / (altimeterStats.range || 1)) * 100));
  }, [coordinates, altimeterStats]);

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
    const startTime = performance.now();
    const frame = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const eased = cubicEaseOut(t);

      try {
        const stops = computeSafeGradientStops(eased, "#00E5FF", "rgba(0, 229, 255, 0.15)");
        map.setPaintProperty("trail-route-line", "line-gradient", stops);
      } catch {
        // Safe guard
      }

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        // Reset full gradient
        try {
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
        } catch {}
      }
    };
    requestAnimationFrame(frame);
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
    });

    mapRef.current = map;

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

      // 1. Add DEM terrain elevation (1.15x relief calibrated for Himalayan high ridges without near-plane collision)
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.15 });

      // 2. Add realistic atmospheric alpine sky
      map.setFog({
        range: [0.8, 12],
        color: "#050914",
        "horizon-blend": 0.2,
        "high-color": "#223b53",
        "space-color": "#01040a",
        "star-intensity": 0.4,
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

      // Start subtle directional flow cycle
      let dashStep = 0;
      const dashPatterns = [
        [0, 4, 3],
        [1, 4, 2],
        [2, 4, 1],
        [3, 4, 0],
        [0, 1, 3, 3],
        [0, 2, 3, 2],
        [0, 3, 3, 1],
      ];
      flowTimerRef.current = setInterval(() => {
        if (!mapRef.current) return;
        dashStep = (dashStep + 1) % dashPatterns.length;
        try {
          mapRef.current.setPaintProperty("trail-route-flow", "line-dasharray", dashPatterns[dashStep]);
        } catch {}
      }, 130);

      // 8. Alpine Waypoint Taxonomy Markers with Proximity Culling Registration
      const isJogni = routeData.placeId === "jogni-falls";
      const startCoord = displayCoordinates[0];
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

      // 10. Interactive Dynamic Scrubber Marker
      const activeEl = document.createElement("div");
      activeEl.className = "w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-xl shadow-cyan-500/50 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center";
      activeEl.innerHTML = `<div class="w-2 h-2 rounded-full bg-slate-900"></div>`;
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
      if (flyoverAnimRef.current) cancelAnimationFrame(flyoverAnimRef.current);
      if (orbitAnimRef.current) cancelAnimationFrame(orbitAnimRef.current);
      if (orbitTimeoutRef.current) clearTimeout(orbitTimeoutRef.current);
      if (flowTimerRef.current) clearInterval(flowTimerRef.current);
      waypointItemsRef.current = [];
      map.remove();
      mapRef.current = null;
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
  ]);

  // Synchronize marker when elevation profile or route store is hovered externally
  useEffect(() => {
    if (!mapRef.current || !activeMarkerRef.current || !activeHoverPoint) return;
    activeMarkerRef.current.setLngLat([activeHoverPoint.lng, activeHoverPoint.lat]);
    if (!isPlayingFlyover && !isOrbiting && activeHoverPoint.lat !== 0 && activeHoverPoint.lng !== 0) {
      mapRef.current.easeTo({
        center: [activeHoverPoint.lng, activeHoverPoint.lat],
        duration: 250,
      });
    }
  }, [activeHoverPoint, isPlayingFlyover, isOrbiting]);

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
      if (altimeterValRef.current) {
        altimeterValRef.current.textContent = `${roundedEle}m`;
      }
      if (scrubberDistValRef.current) {
        scrubberDistValRef.current.textContent = `${distKm.toFixed(1)} km`;
      }
    },
    []
  );

  // Stop 360° summit flyover orbit
  const stopOrbit = useCallback(() => {
    setIsOrbiting(false);
    if (orbitTimeoutRef.current) {
      clearTimeout(orbitTimeoutRef.current);
      orbitTimeoutRef.current = null;
    }
    if (orbitAnimRef.current) {
      cancelAnimationFrame(orbitAnimRef.current);
      orbitAnimRef.current = null;
    }
  }, []);

  // Start 360° summit flyover orbit around peak
  const startOrbit = useCallback(() => {
    if (!mapRef.current) return;
    stopOrbit();
    setIsPlayingFlyover(false);
    setIsOrbiting(true);

    // Pin timeline and progress directly to the summit
    flyoverProgressRef.current = 1;
    setFlyoverProgress(1);
    if (progressTextRef.current) progressTextRef.current.textContent = "100%";
    if (scrubberDistValRef.current) scrubberDistValRef.current.textContent = `${flyoverMaxDistKm.toFixed(1)} km`;

    if (activeMarkerRef.current) {
      activeMarkerRef.current.setLngLat([summitCoord[0], summitCoord[1]]);
    }
    updateWaypointVisibilities(summitCoord[0], summitCoord[1]);

    const summitEle = summitCoord[2] || 0;
    updateTelemetryDOM(flyoverMaxDistKm, summitEle, summitCoord[1], summitCoord[0], 0);

    // Keep trail illuminated up to the summit
    try {
      const stops = computeSafeGradientStops(1, "#00E5FF", "rgba(0, 229, 255, 0.2)");
      mapRef.current.setPaintProperty("trail-route-line", "line-gradient", stops);
    } catch {}

    // Animate left altimeter gauge to summit
    if (altimeterFillRef.current) {
      altimeterFillRef.current.style.height = "100%";
    }
    if (altimeterThumbRef.current) {
      altimeterThumbRef.current.style.bottom = "100%";
    }
    if (altimeterValRef.current) {
      altimeterValRef.current.textContent = `${Math.round(summitEle)}m`;
    }

    const map = mapRef.current;
    map.easeTo({
      center: [summitCoord[0], summitCoord[1]],
      zoom: 13.2,
      pitch: 46,
      duration: 1800,
    });

    let lastOrbitTime = performance.now();
    const orbitStep = (now: number) => {
      if (!mapRef.current) return;
      const deltaMs = Math.min(32, now - lastOrbitTime);
      lastOrbitTime = now;
      const deltaBearing = (deltaMs / 1000) * 7.5; // ~48s for complete 360° rotation
      const b = (mapRef.current.getBearing() + deltaBearing) % 360;
      mapRef.current.jumpTo({
        center: [summitCoord[0], summitCoord[1]],
        bearing: b,
      });
      orbitAnimRef.current = requestAnimationFrame(orbitStep);
    };

    orbitTimeoutRef.current = setTimeout(() => {
      lastOrbitTime = performance.now();
      orbitAnimRef.current = requestAnimationFrame(orbitStep);
    }, 1900);
  }, [
    stopOrbit,
    summitCoord,
    flyoverMaxDistKm,
    updateWaypointVisibilities,
    updateTelemetryDOM,
  ]);

  // Pause Flyover Ridge Animation
  const pauseFlyover = useCallback(() => {
    if (flyoverAnimRef.current) {
      cancelAnimationFrame(flyoverAnimRef.current);
      flyoverAnimRef.current = null;
    }
    setIsPlayingFlyover(false);
    setFlyoverProgress(flyoverProgressRef.current);
  }, []);

  // Start / Resume Flyover Ridge Animation with Anti-Clipping Chase Math & Gimbal Smoothing
  const startFlyover = useCallback(() => {
    if (!mapRef.current) return;
    stopOrbit();
    setIsPlayingFlyover(true);

    const baseDuration = 32000; // 32s base time for smooth alpine traversal
    const duration = baseDuration / speedMultiplier;
    const startTime = performance.now();
    const startProgress = flyoverProgressRef.current >= 0.99 ? 0 : flyoverProgressRef.current;

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, startProgress + elapsed / duration);
      flyoverProgressRef.current = p;

      // Update progress text directly via DOM ref (NO React re-render churn at 60fps!)
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(p * 100)}%`;
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
        // Guaranteed strictly ascending stops prevent WebGL shader crashes
        try {
          const stops = computeSafeGradientStops(p, "#00E5FF", "rgba(0, 229, 255, 0.2)");
          mapRef.current.setPaintProperty("trail-route-line", "line-gradient", stops);
        } catch {}

        // Move active hiker beacon
        if (activeMarkerRef.current) {
          activeMarkerRef.current.setLngLat([pt.lng, pt.lat]);
        }

        // Camera Gimbal Center EMA Smoothing (completely dampens GPS trail micro-wiggles)
        cameraCenterRef.current[0] += (pt.lng - cameraCenterRef.current[0]) * 0.055;
        cameraCenterRef.current[1] += (pt.lat - cameraCenterRef.current[1]) * 0.055;

        // Camera Gimbal Pitch EMA Smoothing (calibrated 38° to 48°)
        cameraPitchRef.current += (pt.adaptivePitch - cameraPitchRef.current) * 0.05;

        // Rate-Limited Bearing Lerp: strictly limits rotation to max 0.65°/frame (39°/sec)
        // completely eliminates snappy switchback shaking and 360° reverse barrel spins!
        if (!shouldReduceMotion) {
          currentBearingRef.current = rateLimitedBearingLerp(
            currentBearingRef.current,
            pt.bearing,
            0.045,
            0.65
          );
        }

        // Camera flight tracking: jumpTo directly sets WebGL camera matrix without scheduling easeTo animations!
        mapRef.current.jumpTo({
          center: cameraCenterRef.current,
          zoom: shouldReduceMotion ? 12.0 : 12.5,
          pitch: shouldReduceMotion ? 20 : cameraPitchRef.current,
          bearing: shouldReduceMotion ? -35 : currentBearingRef.current,
        });

        // Dynamic proximity culling for waypoint badges during flight
        updateWaypointVisibilities(pt.lng, pt.lat);

        // Update Left Vertical Altimeter Gauge
        const altPct = Math.max(
          0,
          Math.min(
            100,
            ((pt.ele - altimeterStats.minEle) / (altimeterStats.range || 1)) * 100
          )
        );
        if (altimeterFillRef.current) {
          altimeterFillRef.current.style.height = `${altPct}%`;
        }
        if (altimeterThumbRef.current) {
          altimeterThumbRef.current.style.bottom = `${altPct}%`;
        }
        if (altimeterValRef.current) {
          altimeterValRef.current.textContent = `${Math.round(pt.ele)}m`;
        }
      }

      if (p < 1) {
        flyoverAnimRef.current = requestAnimationFrame(frame);
      } else {
        setIsPlayingFlyover(false);
        setFlyoverProgress(1);

        // Keep the trail up to the summit illuminated with vibrant glacier cyan!
        try {
          const stops = computeSafeGradientStops(1, "#00E5FF", "rgba(0, 229, 255, 0.2)");
          mapRef.current?.setPaintProperty("trail-route-line", "line-gradient", stops);
        } catch {}

        // Automatically transition into 360° panoramic summit flyover orbit upon arrival!
        if (!shouldReduceMotion) {
          startOrbit();
        }
      }
    };

    flyoverAnimRef.current = requestAnimationFrame(frame);
  }, [
    stopOrbit,
    speedMultiplier,
    getPointAtProgress,
    flyoverMaxDistKm,
    altimeterStats,
    updateTelemetryDOM,
    shouldReduceMotion,
    startOrbit,
    updateWaypointVisibilities,
  ]);

  // Direct altimeter & flight progress seeker
  const seekToProgress = useCallback(
    (p: number) => {
      const clampedP = Math.max(0, Math.min(1, p));
      flyoverProgressRef.current = clampedP;
      setFlyoverProgress(clampedP);
      stopOrbit();

      const pt = getPointAtProgress(clampedP);
      const currentDistKm = Math.round(clampedP * flyoverMaxDistKm * 10) / 10;
      updateTelemetryDOM(currentDistKm, pt.ele, pt.lat, pt.lng, pt.gradientPct);

      cameraCenterRef.current = [pt.lng, pt.lat];
      cameraPitchRef.current = pt.adaptivePitch;
      currentBearingRef.current = pt.bearing;

      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(clampedP * 100)}%`;
      }

      setActiveRoutePoint({
        progress: clampedP,
        distanceKm: currentDistKm,
        elevationM: pt.ele,
        lat: pt.lat,
        lng: pt.lng,
      });

      // Update Left Vertical Altimeter Gauge
      const altPct = Math.max(
        0,
        Math.min(
          100,
          ((pt.ele - altimeterStats.minEle) / (altimeterStats.range || 1)) * 100
        )
      );
      if (altimeterFillRef.current) {
        altimeterFillRef.current.style.height = `${altPct}%`;
      }
      if (altimeterThumbRef.current) {
        altimeterThumbRef.current.style.bottom = `${altPct}%`;
      }
      if (altimeterValRef.current) {
        altimeterValRef.current.textContent = `${Math.round(pt.ele)}m`;
      }

      if (mapRef.current) {
        try {
          const stops = computeSafeGradientStops(clampedP, "#00E5FF", "rgba(0, 229, 255, 0.2)");
          mapRef.current.setPaintProperty("trail-route-line", "line-gradient", stops);
        } catch {}

        if (activeMarkerRef.current) {
          activeMarkerRef.current.setLngLat([pt.lng, pt.lat]);
        }

        // Instant camera placement while dragging
        mapRef.current.jumpTo({
          center: [pt.lng, pt.lat],
          zoom: 12.5,
          pitch: pt.adaptivePitch,
          bearing: pt.bearing,
        });

        // Dynamic proximity culling for waypoint badges
        updateWaypointVisibilities(pt.lng, pt.lat);
      }
    },
    [
      getPointAtProgress,
      flyoverMaxDistKm,
      altimeterStats,
      updateTelemetryDOM,
      stopOrbit,
      updateWaypointVisibilities,
    ]
  );

  // Drag & click seeker directly on the Left Vertical Altimeter Gauge
  const seekFromPointer = useCallback(
    (clientY: number) => {
      const track = altimeterTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const clampedY = Math.max(rect.top, Math.min(rect.bottom, clientY));
      const p = 1 - (clampedY - rect.top) / (rect.height || 1);
      seekToProgress(p);
    },
    [seekToProgress]
  );

  const handleAltimeterPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDraggingAltimeterRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      seekFromPointer(e.clientY);
    },
    [seekFromPointer]
  );

  const handleAltimeterPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isDraggingAltimeterRef.current) {
        seekFromPointer(e.clientY);
      }
    },
    [seekFromPointer]
  );

  const handleAltimeterPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDraggingAltimeterRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    },
    []
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
    flyoverProgressRef.current = 0;
    setFlyoverProgress(0);
    setActiveRoutePoint(null);
    currentBearingRef.current = -35;
    cameraCenterRef.current = [displayCoordinates[0][0], displayCoordinates[0][1]];
    cameraPitchRef.current = 48;

    if (progressTextRef.current) progressTextRef.current.textContent = "0%";

    if (altimeterFillRef.current) {
      altimeterFillRef.current.style.height = `${initialAltPct}%`;
    }
    if (altimeterThumbRef.current) {
      altimeterThumbRef.current.style.bottom = `${initialAltPct}%`;
    }
    const baseEle = displayCoordinates[0]?.[2] || altimeterStats.minEle;
    if (altimeterValRef.current) {
      altimeterValRef.current.textContent = `${Math.round(baseEle)}m`;
    }
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
    initialAltPct,
    altimeterStats,
    updateWaypointVisibilities,
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

  const activeTelemetry = activeHoverPoint || {
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
            <div className="absolute top-4 left-4 right-4 sm:right-auto z-20 flex flex-wrap items-center gap-2 sm:gap-3 pointer-events-none">
              <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-white/15 backdrop-blur-md text-white font-mono text-xs shadow-xl pointer-events-auto">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Mountain className="w-3.5 h-3.5" />
                  <span ref={elevValRef}>{activeTelemetry.elevationM}m</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <div className="text-white/80">
                  <span ref={distValRef}>{activeTelemetry.distanceKm} km</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <div className="text-white/60 text-[11px] hidden sm:block">
                  <span ref={coordsValRef}>
                    {activeTelemetry.lat.toFixed(4)}°N, {activeTelemetry.lng.toFixed(4)}°E
                  </span>
                </div>
              </div>

              {/* Active Mode / 3D Summit Orbit Indicator */}
              {isOrbiting && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/90 border border-cyan-400/50 backdrop-blur-md text-cyan-300 font-mono text-[11px] font-bold shadow-xl animate-pulse pointer-events-auto">
                  <Orbit className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>360° SUMMIT FLYOVER • {maxAltitude}</span>
                </div>
              )}
            </div>

            {/* Left Vertical Alpine Altimeter Gauge with Direct Seeking */}
            <div
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-auto flex items-center gap-2 select-none"
              aria-label="Vertical Altitude Gauge"
            >
              {/* Vertical Rail Capsule (Interactive Drag / Click Seeker) */}
              <div
                onPointerDown={handleAltimeterPointerDown}
                onPointerMove={handleAltimeterPointerMove}
                onPointerUp={handleAltimeterPointerUp}
                onPointerCancel={handleAltimeterPointerUp}
                className="flex flex-col items-center justify-between h-[210px] sm:h-[260px] w-9 sm:w-11 py-2 sm:py-2.5 px-1 rounded-2xl bg-slate-950/85 hover:bg-slate-950/95 backdrop-blur-md border border-white/15 hover:border-cyan-400/50 shadow-2xl transition-all cursor-pointer touch-none group"
                title="Click or drag vertically to seek trail elevation"
              >
                {/* Summit Altitude Cap */}
                <div
                  className="flex flex-col items-center text-center pointer-events-none"
                  title={`Summit Peak Altitude: ${altimeterStats.maxEle}m`}
                >
                  <Mountain className="w-3 h-3 text-amber-300 group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[9px] font-bold text-amber-300/90 leading-tight">
                    {altimeterStats.maxEle}m
                  </span>
                </div>

                {/* Vertical Gauge Track */}
                <div
                  ref={altimeterTrackRef}
                  className="relative w-1.5 flex-1 mx-auto my-1.5 sm:my-2 rounded-full bg-slate-800/80 overflow-visible pointer-events-none"
                >
                  {/* AMS 3,000m Critical Altitude Threshold Tick */}
                  {altimeterStats.amsPct !== null && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-3.5 h-[1.5px] bg-amber-400/90 shadow-[0_0_6px_rgba(251,191,36,0.8)] z-10"
                      style={{ bottom: `${altimeterStats.amsPct}%` }}
                      title="3,000m Altitude Threshold (AMS Risk Zone)"
                    />
                  )}

                  {/* Dynamic Glowing Liquid Fill */}
                  <div
                    ref={altimeterFillRef}
                    className="absolute bottom-0 left-0 right-0 rounded-full bg-gradient-to-t from-cyan-500 via-blue-500 to-amber-400 shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-all duration-75 ease-out"
                    style={{ height: `${initialAltPct}%` }}
                  />

                  {/* Sliding Level Crosshair Beacon */}
                  <div
                    ref={altimeterThumbRef}
                    className="absolute left-1/2 -translate-x-1/2 transition-all duration-75 ease-out pointer-events-none z-20"
                    style={{ bottom: `${initialAltPct}%`, transform: "translate(-50%, 50%)" }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-cyan-400 shadow-[0_0_10px_#22d3ee] flex items-center justify-center group-hover:scale-125 transition-transform">
                        <div className="w-1 h-1 rounded-full bg-cyan-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Base / Trailhead Altitude Cap */}
                <div
                  className="flex flex-col items-center text-center pointer-events-none"
                  title={`Trailhead Altitude: ${altimeterStats.minEle}m`}
                >
                  <span className="font-mono text-[9px] font-semibold text-white/50 leading-tight">
                    {altimeterStats.minEle}m
                  </span>
                </div>
              </div>

              {/* Floating Real-Time Altitude Callout Pill */}
              <div className="hidden sm:flex flex-col gap-1 px-3 py-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-cyan-400/30 text-white font-mono shadow-2xl">
                <div className="text-[9px] uppercase tracking-wider text-cyan-400/90 font-bold flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Altitude
                  </span>
                  <span ref={progressTextRef} className="text-cyan-300 font-bold">
                    {Math.round(flyoverProgress * 100)}%
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 text-xs font-extrabold text-cyan-300">
                  <span ref={altimeterValRef}>{displayCoordinates[0]?.[2] || altimeterStats.minEle}m</span>
                  <span ref={slopeValRef} className="text-[10px] font-normal text-white/60">
                    {defaultTelemetryPoint.gradientPct > 0
                      ? `+${defaultTelemetryPoint.gradientPct}%`
                      : `${defaultTelemetryPoint.gradientPct}%`}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-white/50 border-t border-white/10 pt-1 flex items-center justify-between gap-2">
                  <span ref={scrubberDistValRef}>{activeTelemetry.distanceKm.toFixed(1)} km</span>
                  <span className="text-white/40">/ {flyoverMaxDistKm.toFixed(1)} km</span>
                </div>
              </div>
            </div>

            {/* Bottom Floating Control Console */}
            <div className="absolute bottom-2.5 sm:bottom-4 left-1.5 right-1.5 sm:left-4 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
              {/* Flyover Playback Controls */}
              <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto">
                {!isPlayingFlyover ? (
                  <button
                    type="button"
                    onClick={startFlyover}
                    className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Play 3D Flyover"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Flyover</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={pauseFlyover}
                    className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
                  className="px-2 sm:px-2.5 py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-800 border border-white/15 text-white/90 text-[11px] font-mono font-bold backdrop-blur-md shadow-lg transition-all cursor-pointer flex items-center gap-1"
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
                  className={`p-2 sm:px-3 sm:py-2 rounded-full border text-xs font-mono font-bold backdrop-blur-md shadow-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    isOrbiting
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-cyan-500/30 animate-pulse"
                      : "bg-slate-900/85 hover:bg-slate-800 text-white/80 hover:text-white border-white/15"
                  }`}
                  aria-label="360 Summit Flyover"
                  title="360° Summit Flyover Orbit"
                >
                  <Orbit className={`w-3.5 h-3.5 ${isOrbiting ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">
                    {isOrbiting ? "Orbiting Summit" : "Summit Flyover"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={resetFlyover}
                  className="p-2 sm:p-2.5 rounded-full bg-slate-900/85 hover:bg-slate-800 border border-white/15 text-white/80 hover:text-white backdrop-blur-md shadow-lg transition-all cursor-pointer"
                  aria-label="Reset View"
                  title="Reset View"
                >
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Camera & Zoom Console */}
              <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-full bg-slate-900/85 border border-white/15 backdrop-blur-md shadow-xl pointer-events-auto">
                <button
                  type="button"
                  onClick={toggle3D}
                  className="px-2 py-1 rounded-full text-xs font-mono font-bold text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Toggle 3D View"
                >
                  {is3DMode ? "3D" : "2D"}
                </button>
                <div className="w-px h-3 bg-white/20" />
                <button
                  type="button"
                  onClick={resetNorth}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Reset North"
                  title="Reset North"
                >
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <div className="w-px h-3 bg-white/20" />
                <button
                  type="button"
                  onClick={() => handleZoom(0.8)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Zoom In"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom(-0.8)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Zoom Out"
                >
                  <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <div className="w-px h-3 bg-white/20" />
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Toggle Fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Map Attribution Bar */}
            <div className="absolute top-2 right-2 z-10 text-[9px] font-mono text-white/40 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
              &copy; Mapbox &copy; OpenStreetMap
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
