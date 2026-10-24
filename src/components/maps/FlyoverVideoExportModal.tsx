"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Video,
  Download,
  Film,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  RotateCcw,
  FastForward,
} from "lucide-react";
import {
  ExportResolution,
  ExportMode,
  ExportFramerate,
  ExportQuality,
  ExportDuration,
  VideoExportProgress,
  getSupportedVideoMimeType,
  getTargetDimensions,
  getTargetBitrate,
  renderTelemetryOverlay,
} from "@/lib/video-export";
import {
  computeStravaChaseCamera,
  rateLimitedBearingLerp,
  computeSafeGradientStops,
} from "@/lib/camera-math";
import type mapboxgl from "mapbox-gl";

interface FlyoverVideoExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  map: mapboxgl.Map | null;
  placeName: string;
  placeSlug: string;
  maxAltitude: string;
  territoryName: string;
  apexElevationM: number;
  getPointAtProgress: (progress: number) => {
    lat: number;
    lng: number;
    ele: number;
    bearing: number;
    adaptivePitch: number;
    gradientPct: number;
  };
  summitCoord: [number, number, number];
  flyoverMaxDistKm: number;
}

export function FlyoverVideoExportModal({
  isOpen,
  onClose,
  map,
  placeName,
  placeSlug,
  maxAltitude,
  territoryName,
  apexElevationM,
  getPointAtProgress,
  summitCoord,
  flyoverMaxDistKm,
}: FlyoverVideoExportModalProps) {
  // Settings state — defaults optimized for 100% 1:1 match with Live Play
  const [mode, setMode] = useState<ExportMode>("flyover");
  const [durationOption, setDurationOption] = useState<ExportDuration>("cinematic");
  const [resolution, setResolution] = useState<ExportResolution>("native");
  const [fps, setFps] = useState<ExportFramerate>(60);
  const [quality, setQuality] = useState<ExportQuality>("ultra");
  const [includeOverlay, setIncludeOverlay] = useState<boolean>(false);

  // Recording lifecycle state
  const [progress, setProgress] = useState<VideoExportProgress>({
    status: "idle",
    progressPct: 0,
    currentFrame: 0,
    totalFrames: 0,
    elapsedSec: 0,
  });

  const abortControllerRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const swoopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Close with Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && progress.status !== "recording") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, progress.status]);

  // Cancel any active recording on modal unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current = true;
      if (swoopTimeoutRef.current) {
        clearTimeout(swoopTimeoutRef.current);
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleStartExport = useCallback(async () => {
    if (!map) {
      setProgress({
        status: "error",
        progressPct: 0,
        currentFrame: 0,
        totalFrames: 0,
        elapsedSec: 0,
        error: "3D Map is not active. Please launch the map before exporting.",
      });
      return;
    }

    const sourceCanvas = map.getCanvas();
    if (!sourceCanvas) {
      setProgress({
        status: "error",
        progressPct: 0,
        currentFrame: 0,
        totalFrames: 0,
        elapsedSec: 0,
        error: "Unable to access WebGL canvas context.",
      });
      return;
    }

    abortControllerRef.current = false;
    const format = getSupportedVideoMimeType();
    const dimensions = getTargetDimensions(resolution, sourceCanvas);
    const bitrate = getTargetBitrate(quality, resolution);

    // Exact flight phase durations
    const isCinematic = durationOption === "cinematic";
    const overviewHoldMs = isCinematic ? 600 : 500;
    const swoopDurationMs = isCinematic ? 2000 : 1500;
    const trailDurationMs = isCinematic ? 33000 : 15000;
    const orbitDurationMs = isCinematic ? 3400 : 3000;

    const totalDurationMs =
      mode === "flyover"
        ? overviewHoldMs + swoopDurationMs + trailDurationMs + orbitDurationMs
        : 18000;

    const totalFrames = Math.round((totalDurationMs / 1000) * fps);

    // Create offscreen composite canvas with high-DPI smoothing
    const compositeCanvas = document.createElement("canvas");
    compositeCanvas.width = dimensions.width;
    compositeCanvas.height = dimensions.height;
    const ctx = compositeCanvas.getContext("2d", { alpha: false });

    if (!ctx) {
      setProgress({
        status: "error",
        progressPct: 0,
        currentFrame: 0,
        totalFrames: 0,
        elapsedSec: 0,
        error: "Could not create 2D compositing context.",
      });
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Capture media stream from composite canvas at target FPS
    let stream: MediaStream;
    try {
      stream = compositeCanvas.captureStream(fps);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Canvas stream capture failed";
      setProgress({
        status: "error",
        progressPct: 0,
        currentFrame: 0,
        totalFrames: 0,
        elapsedSec: 0,
        error: `Stream capture failed: ${message}`,
      });
      return;
    }

    // Initialize MediaRecorder with cinema bitrate
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, {
        mimeType: format.mimeType,
        videoBitsPerSecond: bitrate,
      });
    } catch {
      try {
        recorder = new MediaRecorder(stream, {
          videoBitsPerSecond: bitrate,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "MediaRecorder initialization failed";
        setProgress({
          status: "error",
          progressPct: 0,
          currentFrame: 0,
          totalFrames: 0,
          elapsedSec: 0,
          error: `MediaRecorder not supported on this browser: ${message}`,
        });
        return;
      }
    }

    mediaRecorderRef.current = recorder;
    const recordedChunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      try {
        const finalBlob = new Blob(recordedChunks, { type: format.mimeType });
        const url = URL.createObjectURL(finalBlob);
        const sizeMb = Math.round((finalBlob.size / (1024 * 1024)) * 10) / 10;
        const filename = `dht-${placeSlug}-${mode}-${resolution}.${format.extension}`;

        setProgress({
          status: "completed",
          progressPct: 100,
          currentFrame: totalFrames,
          totalFrames,
          elapsedSec: totalDurationMs / 1000,
          downloadUrl: url,
          downloadFilename: filename,
          fileSizeMb: sizeMb,
        });

        // Trigger automatic browser download
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Video encoding failed";
        setProgress((prev) => ({
          ...prev,
          status: "error",
          error: `Failed to compile final video: ${message}`,
        }));
      }
    };

    recorder.start(100);

    setProgress({
      status: "recording",
      progressPct: 0,
      currentFrame: 0,
      totalFrames,
      elapsedSec: 0,
    });

    // Bring map into smooth view
    try {
      map.getContainer().scrollIntoView({ behavior: "smooth", block: "center" });
    } catch {}

    const startPt = getPointAtProgress(0);
    const startStravaCamera = computeStravaChaseCamera(
      startPt.lng,
      startPt.lat,
      startPt.bearing,
      startPt.gradientPct
    );

    // Position native WebGL hiker puck at trailhead
    const startPuckSource = map.getSource("hiker-puck-source") as mapboxgl.GeoJSONSource;
    if (startPuckSource) {
      startPuckSource.setData({
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [startPt.lng, startPt.lat] },
      });
    }

    const overviewCenter: [number, number] = [
      (startPt.lng + summitCoord[0]) / 2,
      (startPt.lat + summitCoord[1]) / 2,
    ];

    // Align map to 3D overview
    map.jumpTo({
      center: overviewCenter,
      zoom: 11.5,
      pitch: 52,
      bearing: -35,
    });

    // Reset trail line gradient
    try {
      const stops = computeSafeGradientStops(0, "#00E5FF", "rgba(0, 229, 255, 0.2)");
      map.setPaintProperty("trail-route-line", "line-gradient", stops);
    } catch {}

    let cameraCenter: [number, number] = [startStravaCamera.center[0], startStravaCamera.center[1]];
    let cameraPitch = startStravaCamera.pitch;
    let currentBearing = startStravaCamera.bearing;

    let swoopTriggered = false;
    let trailInitialized = false;
    let summitEaseTriggered = false;

    const renderCompositeFrame = (
      hikerLng: number,
      hikerLat: number,
      lineProg: number,
      bearing: number,
      ele: number,
      distKm: number,
      gradPct: number
    ) => {
      // 1. Draw WebGL Mapbox canvas to composite canvas
      ctx.fillStyle = "#040812";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      if (resolution === "native") {
        // Razor-sharp 1:1 pixel match with what's visible on user's display
        ctx.drawImage(sourceCanvas, 0, 0, dimensions.width, dimensions.height);
      } else {
        const srcW = sourceCanvas.width;
        const srcH = sourceCanvas.height;
        const targetAspect = dimensions.width / dimensions.height;
        const srcAspect = srcW / srcH;

        let sx = 0;
        let sy = 0;
        let sWidth = srcW;
        let sHeight = srcH;

        if (srcAspect > targetAspect) {
          sWidth = srcH * targetAspect;
          sx = (srcW - sWidth) / 2;
        } else {
          sHeight = srcW / targetAspect;
          sy = (srcH - sHeight) / 2;
        }

        ctx.drawImage(sourceCanvas, sx, sy, sWidth, sHeight, 0, 0, dimensions.width, dimensions.height);
      }

      // 2. Native WebGL hiker puck is already rendered on sourceCanvas by Mapbox GPU layer

      // 3. Optional telemetry HUD & editorial watermark
      if (includeOverlay) {
        renderTelemetryOverlay(ctx, dimensions.width, dimensions.height, {
          trailName: placeName,
          maxAltitude,
          territoryName,
          currentElevationM: ele,
          currentDistanceKm: distKm,
          totalDistanceKm: flyoverMaxDistKm,
          gradientPct: gradPct,
          bearingDeg: bearing,
          progressPct: lineProg * 100,
          mode,
        });
      }

      // 4. Live in-modal mini preview update (if preview canvas is mounted)
      if (previewCanvasRef.current) {
        const pCanvas = previewCanvasRef.current;
        const pCtx = pCanvas.getContext("2d");
        if (pCtx) {
          pCtx.drawImage(compositeCanvas, 0, 0, pCanvas.width, pCanvas.height);
        }
      }
    };

    const startTime = performance.now();
    let frameCount = 0;

    const frameStep = (now: number) => {
      if (abortControllerRef.current) {
        recorder.stop();
        setProgress((prev) => ({ ...prev, status: "cancelled" }));
        return;
      }

      const elapsed = now - startTime;
      frameCount++;

      if (mode === "flyover") {
        const swoopStartMs = overviewHoldMs;
        const trailStartMs = overviewHoldMs + swoopDurationMs;
        const orbitStartMs = trailStartMs + trailDurationMs;

        if (elapsed < swoopStartMs) {
          // Phase 1: High-Altitude 3D Overview hold
          renderCompositeFrame(startPt.lng, startPt.lat, 0, -35, startPt.ele, 0, 0);
        } else if (elapsed < trailStartMs) {
          // Phase 2: Parabolic 3D Swoop down into trailhead using Mapbox's native flight curve
          if (!swoopTriggered) {
            swoopTriggered = true;
            map.flyTo({
              center: startStravaCamera.center,
              zoom: startStravaCamera.zoom,
              pitch: startStravaCamera.pitch,
              bearing: startStravaCamera.bearing,
              duration: swoopDurationMs,
              curve: 1.42,
              essential: true,
            });
          }

          const curBearing = map.getBearing();
          renderCompositeFrame(startPt.lng, startPt.lat, 0, curBearing, startPt.ele, 0, startPt.gradientPct);
        } else if (elapsed < orbitStartMs) {
          // Phase 3: Trail Traversal with Strava Chase Camera & Glowing Line (100% 1:1 Live Play match!)
          if (!trailInitialized) {
            trailInitialized = true;
            cameraCenter = [startStravaCamera.center[0], startStravaCamera.center[1]];
            cameraPitch = startStravaCamera.pitch;
            currentBearing = startStravaCamera.bearing;
          }

          const trailElapsed = elapsed - trailStartMs;
          const p = Math.min(1, trailElapsed / trailDurationMs);
          const pt = getPointAtProgress(p);
          const currentDistKm = p * flyoverMaxDistKm;

          // Update glowing trail line gradient on Mapbox WebGL canvas
          try {
            const stops = computeSafeGradientStops(p, "#00E5FF", "rgba(0, 229, 255, 0.2)");
            map.setPaintProperty("trail-route-line", "line-gradient", stops);
          } catch {}

          // Update native WebGL hiker puck position
          const puckSource = map.getSource("hiker-puck-source") as mapboxgl.GeoJSONSource;
          if (puckSource) {
            puckSource.setData({
              type: "Feature",
              properties: {},
              geometry: { type: "Point", coordinates: [pt.lng, pt.lat] },
            });
          }

          const stravaCamera = computeStravaChaseCamera(
            pt.lng,
            pt.lat,
            pt.bearing,
            pt.gradientPct
          );

          // Exact same gimbal lerp & rate-limited bearing smoothing as Live Play
          cameraCenter[0] += (stravaCamera.center[0] - cameraCenter[0]) * 0.15;
          cameraCenter[1] += (stravaCamera.center[1] - cameraCenter[1]) * 0.15;
          cameraPitch += (stravaCamera.pitch - cameraPitch) * 0.08;

          const maxTurn = isCinematic ? 0.65 : 1.2;
          currentBearing = rateLimitedBearingLerp(currentBearing, pt.bearing, 0.08, maxTurn);

          map.jumpTo({
            center: cameraCenter,
            zoom: stravaCamera.zoom,
            pitch: cameraPitch,
            bearing: currentBearing,
          });

          renderCompositeFrame(pt.lng, pt.lat, p, currentBearing, pt.ele, currentDistKm, pt.gradientPct);
        } else if (elapsed < totalDurationMs) {
          // Phase 4: Summit Arrival Ease-In & 360° Orbit Celebration
          if (!summitEaseTriggered) {
            summitEaseTriggered = true;
            map.easeTo({
              center: [summitCoord[0], summitCoord[1]],
              zoom: 12.8,
              pitch: 48,
              duration: 1800,
            });
          }

          const orbitElapsed = elapsed - orbitStartMs;
          const summitBearing = (currentBearing + (orbitElapsed / 1000) * 6.5) % 360;

          map.jumpTo({
            center: [summitCoord[0], summitCoord[1]],
            zoom: 12.8,
            pitch: 48,
            bearing: summitBearing,
          });

          renderCompositeFrame(
            summitCoord[0],
            summitCoord[1],
            1.0,
            summitBearing,
            summitCoord[2] || apexElevationM,
            flyoverMaxDistKm,
            0
          );
        }
      } else {
        // Orbit mode: Calm 360° rotation around peak
        const t = Math.min(1, elapsed / totalDurationMs);
        const angleDeg = (t * 360) % 360;
        map.jumpTo({
          center: [summitCoord[0], summitCoord[1]],
          zoom: 12.8,
          pitch: 48,
          bearing: angleDeg,
        });
        renderCompositeFrame(
          summitCoord[0],
          summitCoord[1],
          1.0,
          angleDeg,
          summitCoord[2] || apexElevationM,
          flyoverMaxDistKm,
          0
        );
      }

      const pct = Math.min(100, Math.round((elapsed / totalDurationMs) * 100));
      setProgress({
        status: "recording",
        progressPct: pct,
        currentFrame: frameCount,
        totalFrames,
        elapsedSec: elapsed / 1000,
      });

      if (elapsed < totalDurationMs) {
        animFrameIdRef.current = requestAnimationFrame(frameStep);
      } else {
        setProgress((prev) => ({ ...prev, status: "encoding", progressPct: 100 }));
        recorder.stop();
      }
    };

    animFrameIdRef.current = requestAnimationFrame(frameStep);
  }, [
    map,
    mode,
    durationOption,
    resolution,
    fps,
    quality,
    includeOverlay,
    placeName,
    placeSlug,
    maxAltitude,
    territoryName,
    apexElevationM,
    getPointAtProgress,
    summitCoord,
    flyoverMaxDistKm,
  ]);

  const handleCancel = () => {
    abortControllerRef.current = true;
    if (swoopTimeoutRef.current) {
      clearTimeout(swoopTimeoutRef.current);
      swoopTimeoutRef.current = null;
    }
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setProgress((prev) => ({ ...prev, status: "idle" }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 1. Sleek Floating Recording Banner (Active during recording — map is 100% visible!) */}
      {progress.status === "recording" && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-3.5 px-6 py-2.5 rounded-full bg-[#080e1a]/95 backdrop-blur-xl border border-red-500/50 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-xs font-bold text-red-400 tracking-wider uppercase">
              REC • {mode === "flyover" ? "3D TRAIL FLYOVER" : "360° SUMMIT ORBIT"}
            </span>
          </div>

          <div className="w-px h-4 bg-white/20" />

          <span className="font-mono text-xs text-white font-bold">
            {progress.progressPct}%
          </span>

          <span className="font-mono text-[11px] text-slate-400">
            ({progress.elapsedSec.toFixed(0)}s /{" "}
            {mode === "flyover"
              ? durationOption === "cinematic"
                ? "39s"
                : "20s"
              : "18s"}
            )
          </span>

          <div className="w-24 bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-red-500 transition-all duration-150"
              style={{ width: `${progress.progressPct}%` }}
            />
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="ml-1 px-3 py-1 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 2. Main Dialog (Active in Idle, Completed, and Error states) */}
      {progress.status !== "recording" && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-modal-title"
        >
          <div className="relative w-full max-w-xl rounded-3xl bg-[#080e1a] border border-white/15 p-5 sm:p-7 shadow-2xl overflow-hidden text-white flex flex-col gap-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-inner">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="export-modal-title" className="font-display font-bold text-xl sm:text-2xl text-white">
                    Export 3D Alpine Video
                  </h2>
                  <p className="text-xs text-slate-400 font-light">
                    {placeName} ({maxAltitude}) • High-Definition MP4 / WebM
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                aria-label="Close export dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body: Idle vs Completed vs Error */}
            {progress.status === "idle" || progress.status === "cancelled" ? (
              <div className="flex flex-col gap-4 text-xs">
                {/* 1. Mode Selection */}
                <div>
                  <label className="font-mono uppercase tracking-wider text-[11px] font-bold text-cyan-400 mb-2 block">
                    1. Video Choreography Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setMode("flyover")}
                      className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        mode === "flyover"
                          ? "bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                          : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm text-white">
                        <Video className="w-4 h-4 text-cyan-400" />
                        <span>Trail Flyover</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Full trail ascent from trailhead to the summit with 3D swoop.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode("orbit")}
                      className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        mode === "orbit"
                          ? "bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                          : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm text-white">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>360° Summit Orbit</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Seamless 360° aerial rotation framing summit crags (~18s).
                      </p>
                    </button>
                  </div>
                </div>

                {/* 2. Flight Duration Preset (Flyover only) */}
                {mode === "flyover" && (
                  <div>
                    <label className="font-mono uppercase tracking-wider text-[11px] font-bold text-cyan-400 mb-2 block">
                      2. Flyover Traversal Pace
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setDurationOption("cinematic")}
                        className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                          durationOption === "cinematic"
                            ? "bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                            : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs text-white">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Cinematic Alpine (~39s)</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                            1:1 Match
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug">
                          Identical to the Live Play button. Smooth, scenic ridge flight with no rush.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDurationOption("quick")}
                        className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                          durationOption === "quick"
                            ? "bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                            : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs text-white">
                          <FastForward className="w-3.5 h-3.5 text-amber-400" />
                          <span>Quick Highlight (~20s)</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug">
                          Faster 20-second summary for Instagram Reels, Shorts, and WhatsApp.
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Resolution & Platform Format */}
                <div>
                  <label className="font-mono uppercase tracking-wider text-[11px] font-bold text-cyan-400 mb-2 block">
                    3. Resolution & Platform Format
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setResolution("native")}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                        resolution === "native"
                          ? "bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/20"
                          : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-xs">Native Retina</span>
                      <span className="text-[10px] text-cyan-300 font-mono">1:1 Screen Crisp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResolution("1080p-landscape")}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                        resolution === "1080p-landscape"
                          ? "bg-cyan-500/15 border-cyan-400 text-white"
                          : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Monitor className="w-4 h-4 text-sky-400" />
                      <span className="font-bold text-xs">1080p Landscape</span>
                      <span className="text-[10px] text-slate-400">16:9 • YouTube</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResolution("1080p-portrait")}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                        resolution === "1080p-portrait"
                          ? "bg-cyan-500/15 border-cyan-400 text-white"
                          : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-pink-400" />
                      <span className="font-bold text-xs">1080p Reel</span>
                      <span className="text-[10px] text-slate-400">9:16 • Shorts</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResolution("720p-landscape")}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                        resolution === "720p-landscape"
                          ? "bg-cyan-500/15 border-cyan-400 text-white"
                          : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Film className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs">720p Fast HD</span>
                      <span className="text-[10px] text-slate-400">Fast Sharing</span>
                    </button>
                  </div>
                </div>

                {/* 4. Framerate & Quality */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono uppercase tracking-wider text-[11px] font-bold text-cyan-400 mb-1.5 block">
                      4. Framerate
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFps(60)}
                        className={`flex-1 py-2 px-3 rounded-xl border font-mono font-bold text-xs transition-all cursor-pointer ${
                          fps === 60
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                            : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        60 FPS (Ultra Smooth)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFps(30)}
                        className={`flex-1 py-2 px-3 rounded-xl border font-mono font-bold text-xs transition-all cursor-pointer ${
                          fps === 30
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                            : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        30 FPS (Standard)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-mono uppercase tracking-wider text-[11px] font-bold text-cyan-400 mb-1.5 block">
                      5. Bitrate Quality
                    </label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value as ExportQuality)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="ultra">Ultra Cinema (26 Mbps, Max Detail)</option>
                      <option value="high">High Definition (16 Mbps)</option>
                      <option value="standard">Standard (9 Mbps, Lightweight)</option>
                    </select>
                  </div>
                </div>

                {/* 5. Editorial Telemetry Overlay Toggle */}
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.06] transition-colors">
                  <input
                    type="checkbox"
                    checked={includeOverlay}
                    onChange={(e) => setIncludeOverlay(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-cyan-500 focus:ring-cyan-400 bg-slate-900 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-white block">Include Himalayan Telemetry HUD</span>
                    <span className="text-[11px] text-slate-400 font-light block">
                      Overlays altitude, distance, gradient, and trail coordinates on the video. (Leave unchecked for clean, pure satellite landscape).
                    </span>
                  </div>
                </label>

                {/* Action Bar */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleStartExport}
                    className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Render & Download Video</span>
                  </button>
                </div>
              </div>
            ) : progress.status === "completed" ? (
              /* Completed Success State with In-Modal Video Player */
              <div className="flex flex-col items-center justify-center py-4 px-2 text-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">
                    3D Video Render Complete!
                  </h3>
                </div>

                {/* In-Modal Video Player Preview */}
                {progress.downloadUrl && (
                  <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden border border-emerald-400/40 bg-slate-950 shadow-2xl mx-auto">
                    <video
                      src={progress.downloadUrl}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-slate-300 font-light">
                    Your video has been rendered and the download has started automatically.
                  </p>
                  {progress.fileSizeMb && (
                    <span className="font-mono text-[11px] text-cyan-400 font-bold">
                      File Size: ~{progress.fileSizeMb} MB • {fps} FPS • {resolution.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-2">
                  {progress.downloadUrl && (
                    <a
                      href={progress.downloadUrl}
                      download={progress.downloadFilename || `dht-${placeSlug}-${mode}.mp4`}
                      className="px-5 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Again</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setProgress({
                        status: "idle",
                        progressPct: 0,
                        currentFrame: 0,
                        totalFrames: 0,
                        elapsedSec: 0,
                      })
                    }
                    className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Export Another</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : progress.status === "error" ? (
              /* Error State */
              <div className="flex flex-col items-center justify-center py-6 px-4 text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-white">Video Export Failed</h3>
                <p className="text-xs text-red-300 max-w-sm">{progress.error}</p>
                <button
                  type="button"
                  onClick={() =>
                    setProgress({
                      status: "idle",
                      progressPct: 0,
                      currentFrame: 0,
                      totalFrames: 0,
                      elapsedSec: 0,
                    })
                  }
                  className="mt-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
