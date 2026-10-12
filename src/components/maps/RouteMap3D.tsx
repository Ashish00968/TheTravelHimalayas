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
  Activity,
  X,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { RouteData } from "@/data/types";
import { useActiveRoutePoint, setActiveRoutePoint } from "@/lib/route-store";
import { SyncedElevationScrubber } from "../trek/SyncedElevationScrubber";

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
  const [flyoverProgress, setFlyoverProgress] = useState(0); // 0 to 1
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [is3DMode, setIs3DMode] = useState(true);
  const [showElevationDrawer, setShowElevationDrawer] = useState(false);
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
  const flyoverAnimRef = useRef<number | null>(null);
  const currentBearingRef = useRef<number>(-35);

  const activeHoverPoint = useActiveRoutePoint();

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const coordinates = routeData.line.coordinates; // [lng, lat, eleM][]

  // Precompute cumulative distances along the route coordinates in kilometers
  const cumDistances = useMemo(() => {
    const dists: number[] = [0];
    for (let i = 1; i < coordinates.length; i++) {
      const [lng1, lat1] = coordinates[i - 1];
      const [lng2, lat2] = coordinates[i];
      // Haversine
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
      dists.push(dists[i - 1] + R * c);
    }
    return dists;
  }, [coordinates]);

  const totalDistanceKm = cumDistances[cumDistances.length - 1] || routeData.stats.distanceKm;

  // Interpolate route point at progress p (0 to 1)
  const getPointAtProgress = useCallback(
    (p: number): { lng: number; lat: number; ele: number; bearing: number } => {
      const clampedP = Math.max(0, Math.min(1, p));
      const targetDist = clampedP * totalDistanceKm;

      let idx = 0;
      while (idx < cumDistances.length - 1 && cumDistances[idx + 1] < targetDist) {
        idx++;
      }

      const p1 = coordinates[idx];
      const p2 = coordinates[Math.min(idx + 1, coordinates.length - 1)];

      const segStartDist = cumDistances[idx];
      const segEndDist = cumDistances[Math.min(idx + 1, cumDistances.length - 1)];
      const segLen = segEndDist - segStartDist;
      const segT = segLen > 0 ? (targetDist - segStartDist) / segLen : 0;

      const lng = p1[0] + (p2[0] - p1[0]) * segT;
      const lat = p1[1] + (p2[1] - p1[1]) * segT;
      const ele = p1[2] + (p2[2] - p1[2]) * segT;

      // Look ahead for bearing calculation
      const lookAheadIdx = Math.min(idx + 6, coordinates.length - 1);
      const aheadP = coordinates[lookAheadIdx];
      const y = Math.sin((aheadP[0] - lng) * (Math.PI / 180)) * Math.cos(aheadP[1] * (Math.PI / 180));
      const x =
        Math.cos(lat * (Math.PI / 180)) * Math.sin(aheadP[1] * (Math.PI / 180)) -
        Math.sin(lat * (Math.PI / 180)) * Math.cos(aheadP[1] * (Math.PI / 180)) * Math.cos((aheadP[0] - lng) * (Math.PI / 180));
      let bearing = (Math.atan2(y, x) * 180) / Math.PI;
      bearing = (bearing + 360) % 360;

      return { lng, lat, ele, bearing };
    },
    [coordinates, cumDistances, totalDistanceKm]
  );

  // Compute route bounding box
  const bounds = useMemo(() => {
    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    for (const [lng, lat] of coordinates) {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }

    return new mapboxgl.LngLatBounds([minLng, minLat], [maxLng, maxLat]);
  }, [coordinates]);

  // Initialize Mapbox when user taps the launch button
  useEffect(() => {
    if (!isMapActive || !mapContainerRef.current || !mapboxToken || mapRef.current) return;

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      bounds: bounds,
      fitBoundsOptions: {
        padding: { top: 80, bottom: 80, left: 60, right: 60 },
        pitch: 62,
        bearing: -35,
        maxZoom: 16,
      },
      maxPitch: 85,
      pitchWithRotate: true,
      scrollZoom: false, // Do not hijack page scroll
      doubleClickZoom: true,
      attributionControl: false,
      antialias: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      // 0. Suppress default Mapbox labels, borders, and roads for a clean cinematic wilderness canvas
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

      // 1. Add DEM terrain elevation
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.6 });

      // 2. Add atmospheric sky
      map.setFog({
        range: [0.8, 12],
        color: "#050914",
        "horizon-blend": 0.2,
        "high-color": "#223b53",
        "space-color": "#01040a",
        "star-intensity": 0.4,
      });

      // 3. Add Trail GeoJSON Source
      map.addSource("trail-route", {
        type: "geojson",
        lineMetrics: true,
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates.map(([lng, lat]) => [lng, lat]),
          },
        },
      });

      // 4. Trail casing (dark shadow underneath)
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
          "line-width": 8,
          "line-opacity": 0.8,
        },
      });

      // 5. Trail main glowing path with dynamic altitude-inspired line-gradient (lineMetrics: true)
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

      const isJogni = routeData.placeId === "jogni-falls";
      const startCoord = coordinates[0];

      // 6. Dynamic Alpine Waypoint Taxonomy Markers & Summit Beacons
      const waypoints = routeData.waypoints || [];
      const hasWaypoints = waypoints.length > 0;

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
          wpEl.className = `flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/92 border ${borderClass} text-white text-[10.5px] font-mono font-bold shadow-2xl backdrop-blur-md cursor-pointer hover:scale-105 transition-transform select-none ${
            isPulsing ? "ring-2 ring-rose-500/40" : ""
          }`;
          wpEl.innerHTML = `<span>${icon}</span><span class="truncate max-w-[130px] sm:max-w-[180px]">${wp.name}${wp.eleM ? ` (${wp.eleM}m)` : ""}</span>`;

          wpEl.addEventListener("click", () => {
            map.easeTo({
              center: [wp.lng, wp.lat],
              zoom: 14.6,
              pitch: 62,
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
        startEl.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-400 text-white text-xs font-mono font-bold shadow-xl backdrop-blur-md cursor-pointer hover:scale-105 transition-transform";
        startEl.innerHTML = `<span>🟢</span><span>${isPatalsu ? "Solang Trailhead (2,480m)" : isJogni ? "Vashisht Trailhead (2,050m)" : "Trailhead"}</span>`;
        new mapboxgl.Marker({ element: startEl, anchor: "bottom", pitchAlignment: "viewport", rotationAlignment: "viewport" })
          .setLngLat([startCoord[0], startCoord[1]])
          .addTo(map);
      }

      // 7. Summit / Destination Marker Beacon
      const summitCoord: [number, number] = isPatalsu
        ? [77.19106, 32.35386]
        : (() => {
            const maxPt = coordinates.reduce((max, c) => ((c[2] || 0) > (max[2] || 0) ? c : max), coordinates[0]);
            return [maxPt[0], maxPt[1]];
          })();

      // Add native GPU-clamped 3D terrain beacon on the summit / waterfall
      map.addSource("summit-apex-beacon", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [summitCoord[0], summitCoord[1]],
          },
        },
      });
      map.addLayer({
        id: "summit-apex-beacon-glow",
        type: "circle",
        source: "summit-apex-beacon",
        paint: {
          "circle-radius": 14,
          "circle-color": "#22d3ee",
          "circle-opacity": 0.45,
          "circle-blur": 0.7,
          "circle-pitch-alignment": "map",
        },
      });
      map.addLayer({
        id: "summit-apex-beacon-core",
        type: "circle",
        source: "summit-apex-beacon",
        paint: {
          "circle-radius": 5,
          "circle-color": "#FFFFFF",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#06b6d4",
          "circle-pitch-alignment": "map",
        },
      });

      const summitEl = document.createElement("div");
      summitEl.className = "flex flex-col items-center cursor-pointer group pointer-events-auto select-none";
      summitEl.innerHTML = `
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 border border-cyan-400 text-white text-xs font-mono font-bold shadow-2xl backdrop-blur-md hover:scale-105 transition-transform animate-pulse">
          <span>${isJogni ? "🌊" : "🚩"}</span><span>${isPatalsu ? "Patalsu Summit (4,261m)" : isJogni ? "Jogni Falls (2,280m)" : `${placeName} (${maxAltitude})`}</span>
        </div>
        <div style="width: 2px; height: 10px; background: linear-gradient(to bottom, #22d3ee, #06b6d4);"></div>
        <div style="width: 0; height: 0; border-left: 3.5px solid transparent; border-right: 3.5px solid transparent; border-top: 6px solid #22d3ee; filter: drop-shadow(0 0 4px #06b6d4);"></div>
      `;
      new mapboxgl.Marker({ element: summitEl, anchor: "bottom", pitchAlignment: "viewport", rotationAlignment: "viewport" })
        .setLngLat([summitCoord[0], summitCoord[1]])
        .addTo(map);

      // 9. Interactive Dynamic Scrubber Marker
      const activeEl = document.createElement("div");
      activeEl.className = "w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-xl shadow-cyan-500/50 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center";
      activeEl.innerHTML = `<div class="w-2 h-2 rounded-full bg-slate-900"></div>`;
      const activeMarker = new mapboxgl.Marker({ element: activeEl, pitchAlignment: "viewport", rotationAlignment: "viewport" })
        .setLngLat([startCoord[0], startCoord[1]])
        .addTo(map);
      activeMarkerRef.current = activeMarker;
    });

    return () => {
      if (flyoverAnimRef.current) cancelAnimationFrame(flyoverAnimRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, [isMapActive, mapboxToken, bounds, coordinates, isPatalsu, maxAltitude, placeName, routeData.placeId, routeData.waypoints]);

  // Synchronize marker when elevation profile or route store is hovered
  useEffect(() => {
    if (!mapRef.current || !activeMarkerRef.current || !activeHoverPoint) return;
    activeMarkerRef.current.setLngLat([activeHoverPoint.lng, activeHoverPoint.lat]);
    if (!isPlayingFlyover && activeHoverPoint.lat !== 0 && activeHoverPoint.lng !== 0) {
      mapRef.current.easeTo({
        center: [activeHoverPoint.lng, activeHoverPoint.lat],
        duration: 250,
      });
    }
  }, [activeHoverPoint, isPlayingFlyover]);

  // Handle Play Flyover Ridge Animation
  const startFlyover = useCallback(() => {
    if (!mapRef.current) return;
    setIsPlayingFlyover(true);

    const startTime = performance.now();
    const duration = 28000; // 28 seconds for full ridge traverse
    const startProgress = flyoverProgress >= 0.98 ? 0 : flyoverProgress;

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, startProgress + elapsed / duration);
      setFlyoverProgress(p);

      const pt = getPointAtProgress(p);

      // Update interactive route store for synchronized telemetry
      setActiveRoutePoint({
        progress: p,
        distanceKm: Math.round(p * totalDistanceKm * 10) / 10,
        elevationM: Math.round(pt.ele),
        lat: pt.lat,
        lng: pt.lng,
      });

      if (mapRef.current) {
        // Dynamic progressive trail reveal behind camera
        try {
          if (p >= 0.99) {
            mapRef.current.setPaintProperty("trail-route-line", "line-gradient", [
              "interpolate",
              ["linear"],
              ["line-progress"],
              0,
              "#00E5FF",
              1,
              "#00E5FF",
            ]);
          } else {
            const pSafe = Math.max(0.001, Math.min(0.98, p));
            const pTransition = pSafe + 0.006;
            mapRef.current.setPaintProperty("trail-route-line", "line-gradient", [
              "interpolate",
              ["linear"],
              ["line-progress"],
              0,
              "#00E5FF",
              pSafe,
              "#00E5FF",
              pTransition,
              "rgba(0, 229, 255, 0.2)",
              1,
              "rgba(0, 229, 255, 0.2)",
            ]);
          }
        } catch {
          // Fallback if style updating
        }

        // Move active marker
        if (activeMarkerRef.current) {
          activeMarkerRef.current.setLngLat([pt.lng, pt.lat]);
        }

        // Smooth camera bearing using angular lerp
        if (!shouldReduceMotion) {
          let diff = ((pt.bearing - currentBearingRef.current + 180) % 360) - 180;
          if (diff < -180) diff += 360;
          currentBearingRef.current = currentBearingRef.current + diff * 0.08;
        }

        // Camera flight tracking
        mapRef.current.easeTo({
          center: [pt.lng, pt.lat],
          zoom: shouldReduceMotion ? 13.8 : 14.8,
          pitch: shouldReduceMotion ? 25 : 66,
          bearing: shouldReduceMotion ? -35 : currentBearingRef.current,
          duration: 0,
        });
      }

      if (p < 1) {
        flyoverAnimRef.current = requestAnimationFrame(frame);
      } else {
        setIsPlayingFlyover(false);
        // Reset full gradient
        try {
          mapRef.current?.setPaintProperty("trail-route-line", "line-gradient", [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0,
            "#00E5FF",
            1,
            "#00E5FF",
          ]);
        } catch {}

        // End camera panoramic view
        if (mapRef.current && !shouldReduceMotion) {
          mapRef.current.easeTo({
            pitch: 55,
            bearing: pt.bearing + 40,
            duration: 2500,
          });
        }
      }
    };

    flyoverAnimRef.current = requestAnimationFrame(frame);
  }, [flyoverProgress, getPointAtProgress, totalDistanceKm, shouldReduceMotion]);

  const pauseFlyover = useCallback(() => {
    if (flyoverAnimRef.current) {
      cancelAnimationFrame(flyoverAnimRef.current);
      flyoverAnimRef.current = null;
    }
    setIsPlayingFlyover(false);
  }, []);

  const resetFlyover = useCallback(() => {
    pauseFlyover();
    setFlyoverProgress(0);
    setActiveRoutePoint(null);
    currentBearingRef.current = -35;
    if (mapRef.current) {
      try {
        mapRef.current.setPaintProperty("trail-route-line", "line-gradient", [
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

      mapRef.current.fitBounds(bounds, {
        padding: { top: 80, bottom: 80, left: 60, right: 60 },
        pitch: is3DMode ? 62 : 0,
        bearing: -35,
        duration: 1800,
      });
      if (activeMarkerRef.current) {
        activeMarkerRef.current.setLngLat([coordinates[0][0], coordinates[0][1]]);
      }
    }
  }, [pauseFlyover, bounds, is3DMode, coordinates]);

  // Controls Handlers
  const toggle3D = useCallback(() => {
    if (!mapRef.current) return;
    const next3D = !is3DMode;
    setIs3DMode(next3D);
    mapRef.current.easeTo({
      pitch: next3D ? 65 : 0,
      duration: 1200,
    });
  }, [is3DMode]);

  const resetNorth = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.easeTo({ bearing: 0, duration: 800 });
  }, []);

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
  }, [isMapActive, isFullscreen, toggleFullscreen]);

  const activeTelemetry = activeHoverPoint || {
    distanceKm: Math.round(flyoverProgress * totalDistanceKm * 10) / 10,
    elevationM: Math.round(coordinates[Math.floor(flyoverProgress * (coordinates.length - 1))][2]),
    lat: coordinates[Math.floor(flyoverProgress * (coordinates.length - 1))][1],
    lng: coordinates[Math.floor(flyoverProgress * (coordinates.length - 1))][0],
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
        className={`relative w-full overflow-hidden ${
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
                Walk the real 15.1 km Himalayan trail trace in full 3D satellite topography. Inspect high camps, elevation milestones, and switchbacks before setting foot on the mountain.
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
          <div className={`relative w-full ${isFullscreen ? "h-screen min-h-screen" : "h-[540px] sm:h-[640px]"}`}>
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Top Telemetry Overlay Dock */}
            <div className="absolute top-4 left-4 right-4 sm:right-auto z-20 flex flex-wrap items-center gap-2 sm:gap-3 pointer-events-none">
              <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-white/15 backdrop-blur-md text-white font-mono text-xs shadow-xl pointer-events-auto">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Mountain className="w-3.5 h-3.5" />
                  <span>{activeTelemetry.elevationM}m</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <div className="text-white/80">
                  <span>{activeTelemetry.distanceKm} km</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <div className="text-white/60 text-[11px] hidden sm:block">
                  {activeTelemetry.lat.toFixed(4)}°N, {activeTelemetry.lng.toFixed(4)}°E
                </div>
              </div>
            </div>

            {/* Docked Elevation Scrubber Drawer (Compact, Transparent & Centered) */}
            {showElevationDrawer && (
              <div className="absolute bottom-20 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[680px] max-w-[calc(100%-24px)] z-30 pointer-events-auto rounded-2xl shadow-2xl backdrop-blur-xl bg-slate-950/65 border border-white/15 overflow-hidden transition-all duration-200">
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-white/[0.04] border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-white/90">
                      Synchronized Ridge Scrubber • {placeName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowElevationDrawer(false)}
                    className="p-1 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close Elevation Drawer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-2 sm:p-2.5 overflow-hidden">
                  <SyncedElevationScrubber
                    routeData={routeData}
                    maxAltitude={maxAltitude}
                    startPoint={coordinates[0] ? `${coordinates[0][1].toFixed(3)}°N, ${coordinates[0][0].toFixed(3)}°E` : "Trailhead Entry"}
                    accentColor={accentColor}
                    trailTitle={placeName}
                    compact={true}
                  />
                </div>
              </div>
            )}

            {/* Bottom Floating Control Console */}
            <div className="absolute bottom-5 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              {/* Flyover Playback Controls */}
              <div className="flex items-center gap-2 pointer-events-auto">
                {!isPlayingFlyover ? (
                  <button
                    type="button"
                    onClick={startFlyover}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Play 3D Flyover"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Flyover</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={pauseFlyover}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Pause Flyover"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={resetFlyover}
                  className="p-2.5 rounded-full bg-slate-900/85 hover:bg-slate-800 border border-white/15 text-white/80 hover:text-white backdrop-blur-md shadow-lg transition-all cursor-pointer"
                  aria-label="Reset Camera"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowElevationDrawer((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-mono font-bold shadow-lg transition-all cursor-pointer ${
                    showElevationDrawer
                      ? "bg-cyan-500 text-slate-950 border-cyan-400"
                      : "bg-slate-900/85 hover:bg-slate-800 text-white/90 border-white/15"
                  }`}
                  aria-label="Toggle Elevation Profile Drawer"
                  title="Toggle Elevation Profile Drawer"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Elevation Scrubber</span>
                </button>
              </div>

              {/* Camera & Zoom Console */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/85 border border-white/15 backdrop-blur-md shadow-xl pointer-events-auto">
                <button
                  type="button"
                  onClick={toggle3D}
                  className="px-2.5 py-1 rounded-full text-xs font-mono font-bold text-white/90 hover:text-white hover:bg-white/10 transition-colors"
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
                  <Compass className="w-4 h-4" />
                </button>
                <div className="w-px h-3 bg-white/20" />
                <button
                  type="button"
                  onClick={() => handleZoom(0.8)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Zoom In"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom(-0.8)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Zoom Out"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-px h-3 bg-white/20" />
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
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
