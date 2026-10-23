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
  StopCircle,
} from "lucide-react";
import {
  ExportResolution,
  ExportMode,
  ExportFramerate,
  ExportQuality,
  VideoExportProgress,
  getSupportedVideoMimeType,
  getTargetDimensions,
  getTargetBitrate,
  renderTelemetryOverlay,
} from "@/lib/video-export";
import { computeStravaChaseCamera } from "@/lib/camera-math";
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
  // Settings state
  const [mode, setMode] = useState<ExportMode>("flyover");
  const [resolution, setResolution] = useState<ExportResolution>("1080p-landscape");
  const [fps, setFps] = useState<ExportFramerate>(30);
  const [quality, setQuality] = useState<ExportQuality>("high");
  const [includeOverlay, setIncludeOverlay] = useState<boolean>(true);

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

    // Duration calculation: Flyover = 20s, Orbit = 16s
    const durationSec = mode === "flyover" ? 20 : 16;
    const totalFrames = durationSec * fps;

    setProgress({
      status: "preparing",
      progressPct: 0,
      currentFrame: 0,
      totalFrames,
      elapsedSec: 0,
    });

    // Create offscreen composite canvas
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

    // Capture media stream from composite canvas
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

    // Initialize MediaRecorder
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, {
        mimeType: format.mimeType,
        videoBitsPerSecond: bitrate,
      });
    } catch {
      // Fallback without explicit mimeType
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

    const completionPromise = new Promise<{ blob: Blob; url: string }>((resolve, reject) => {
      recorder.onstop = () => {
        try {
          const finalBlob = new Blob(recordedChunks, { type: format.mimeType });
          const url = URL.createObjectURL(finalBlob);
          resolve({ blob: finalBlob, url });
        } catch (err) {
          reject(err);
        }
      };
      recorder.onerror = (e) => reject(e);
    });

    recorder.start(100); // 100ms timeslices

    setProgress({
      status: "recording",
      progressPct: 0,
      currentFrame: 0,
      totalFrames,
      elapsedSec: 0,
    });

    const startTime = performance.now();
    let currentFrame = 0;

    // Helper to render one composite frame
    const renderFrame = (p: number, bearing: number, ele: number, distKm: number, gradPct: number) => {
      // 1. Draw WebGL Mapbox canvas to composite canvas with cover/aspect fit
      ctx.fillStyle = "#040812";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      const srcW = sourceCanvas.width;
      const srcH = sourceCanvas.height;
      const targetAspect = dimensions.width / dimensions.height;
      const srcAspect = srcW / srcH;

      let sx = 0;
      let sy = 0;
      let sWidth = srcW;
      let sHeight = srcH;

      if (srcAspect > targetAspect) {
        // Source is wider: crop sides
        sWidth = srcH * targetAspect;
        sx = (srcW - sWidth) / 2;
      } else {
        // Source is taller: crop top/bottom
        sHeight = srcW / targetAspect;
        sy = (srcH - sHeight) / 2;
      }

      ctx.drawImage(sourceCanvas, sx, sy, sWidth, sHeight, 0, 0, dimensions.width, dimensions.height);

      // 2. Overlay optional telemetry HUD & editorial watermark
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
          progressPct: p * 100,
          mode,
        });
      }
    };

    // Frame-by-frame deterministic rendering loop
    const frameIntervalMs = 1000 / fps;

    const runRecordingLoop = async () => {
      while (currentFrame < totalFrames) {
        if (abortControllerRef.current) {
          recorder.stop();
          setProgress({
            status: "cancelled",
            progressPct: 0,
            currentFrame,
            totalFrames,
            elapsedSec: (performance.now() - startTime) / 1000,
          });
          return;
        }

        const t = currentFrame / totalFrames; // 0.0 to 1.0

        if (mode === "flyover") {
          // 2.5-second cinematic 3D overview & zoom into trailhead before trail progression
          const introFrames = Math.min(Math.round(2.5 * fps), Math.round(totalFrames * 0.15));
          let pt: ReturnType<typeof getPointAtProgress>;
          let currentDistKm = 0;
          let camCenter: [number, number];
          let camZoom: number;
          let camPitch: number;
          let camBearing: number;
          let lineProg = 0;

          const startPt = getPointAtProgress(0);
          const startStravaCamera = computeStravaChaseCamera(
            startPt.lng,
            startPt.lat,
            startPt.bearing,
            startPt.gradientPct,
            220
          );

          if (currentFrame < introFrames) {
            // Intro phase: hold 3D overview for first 25%, then swoop down into trailhead
            const u = currentFrame / introFrames;
            const easeU = u < 0.25 ? 0 : (u - 0.25) / 0.75;
            const smoothU = easeU * easeU * (3 - 2 * easeU);

            const overviewCenter: [number, number] = [
              (startPt.lng + summitCoord[0]) / 2,
              (startPt.lat + summitCoord[1]) / 2,
            ];
            const overviewZoom = 11.5;
            const overviewPitch = 52;
            const overviewBearing = -35;

            camCenter = [
              overviewCenter[0] + (startStravaCamera.center[0] - overviewCenter[0]) * smoothU,
              overviewCenter[1] + (startStravaCamera.center[1] - overviewCenter[1]) * smoothU,
            ];
            camZoom = overviewZoom + (startStravaCamera.zoom - overviewZoom) * smoothU;
            camPitch = overviewPitch + (startStravaCamera.pitch - overviewPitch) * smoothU;
            camBearing = overviewBearing + (startStravaCamera.bearing - overviewBearing) * smoothU;

            pt = startPt;
            currentDistKm = 0;
            lineProg = 0;
          } else {
            // Trail traversal phase
            const trailT = (currentFrame - introFrames) / Math.max(1, totalFrames - introFrames);
            pt = getPointAtProgress(trailT);
            currentDistKm = trailT * flyoverMaxDistKm;
            const stravaCamera = computeStravaChaseCamera(
              pt.lng,
              pt.lat,
              pt.bearing,
              pt.gradientPct,
              220
            );
            camCenter = stravaCamera.center;
            camZoom = stravaCamera.zoom;
            camPitch = stravaCamera.pitch;
            camBearing = stravaCamera.bearing;
            lineProg = trailT;
          }

          map.jumpTo({
            center: camCenter,
            zoom: camZoom,
            pitch: camPitch,
            bearing: camBearing,
          });

          // Wait for WebGL buffer and tiles to settle (deterministic, zero flicker)
          await new Promise<void>((resolve) => {
            let settled = false;
            const timer = setTimeout(() => {
              if (!settled) {
                settled = true;
                resolve();
              }
            }, Math.max(35, frameIntervalMs));

            map.once("idle", () => {
              if (!settled) {
                settled = true;
                clearTimeout(timer);
                resolve();
              }
            });
          });

          renderFrame(lineProg, pt.bearing, pt.ele, currentDistKm, pt.gradientPct);
        } else {
          // 360° Summit Panorama Orbit
          const angleDeg = (t * 360) % 360;

          // Stable locked 48° pitch and 12.8 zoom — eliminates terrain jitter and tile thrashing
          map.jumpTo({
            center: [summitCoord[0], summitCoord[1]],
            zoom: 12.8,
            pitch: 48,
            bearing: angleDeg,
          });

          await new Promise<void>((resolve) => {
            let settled = false;
            const timer = setTimeout(() => {
              if (!settled) {
                settled = true;
                resolve();
              }
            }, Math.max(35, frameIntervalMs));

            map.once("idle", () => {
              if (!settled) {
                settled = true;
                clearTimeout(timer);
                resolve();
              }
            });
          });

          renderFrame(t, angleDeg, summitCoord[2] || apexElevationM, flyoverMaxDistKm, 0);
        }

        currentFrame++;
        const pct = Math.min(100, Math.round((currentFrame / totalFrames) * 100));
        setProgress({
          status: "recording",
          progressPct: pct,
          currentFrame,
          totalFrames,
          elapsedSec: (performance.now() - startTime) / 1000,
        });
      }

      // Finish recording
      setProgress((prev) => ({ ...prev, status: "encoding", progressPct: 100 }));
      recorder.stop();

      try {
        const { blob, url } = await completionPromise;
        const sizeMb = Math.round((blob.size / (1024 * 1024)) * 10) / 10;

        setProgress({
          status: "completed",
          progressPct: 100,
          currentFrame: totalFrames,
          totalFrames,
          elapsedSec: (performance.now() - startTime) / 1000,
          downloadUrl: url,
          fileSizeMb: sizeMb,
        });

        // Trigger automatic browser download
        const filename = `dht-${placeSlug}-${mode}-${resolution}.${format.extension}`;
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

    runRecordingLoop();
  }, [
    map,
    mode,
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
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setProgress((prev) => ({ ...prev, status: "idle" }));
  };

  if (!isOpen) return null;

  return (
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
            disabled={progress.status === "recording"}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Close export dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Idle vs Recording vs Completed */}
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
                  className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
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
                    Complete trail ascent from trailhead to the summit (~20s).
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("orbit")}
                  className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
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
                    Seamless 360° aerial rotation framing summit crags (~16s).
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Resolution & Aspect Ratio */}
            <div>
              <label className="font-mono uppercase tracking-wider text-[11px] font-bold text-cyan-400 mb-2 block">
                2. Resolution & Platform Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setResolution("1080p-landscape")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                    resolution === "1080p-landscape"
                      ? "bg-cyan-500/15 border-cyan-400 text-white"
                      : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-xs">1080p Landscape</span>
                  <span className="text-[10px] text-slate-400">16:9 • YouTube / TV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResolution("1080p-portrait")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                    resolution === "1080p-portrait"
                      ? "bg-cyan-500/15 border-cyan-400 text-white"
                      : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-pink-400" />
                  <span className="font-bold text-xs">1080p Reel</span>
                  <span className="text-[10px] text-slate-400">9:16 • Shorts / Reels</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResolution("720p-landscape")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                    resolution === "720p-landscape"
                      ? "bg-cyan-500/15 border-cyan-400 text-white"
                      : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Film className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs">720p Fast HD</span>
                  <span className="text-[10px] text-slate-400">Small File Size</span>
                </button>
              </div>
            </div>

            {/* 3. Framerate & Quality */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono uppercase tracking-wider text-[11px] font-bold text-cyan-400 mb-1.5 block">
                  3. Framerate
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFps(30)}
                    className={`flex-1 py-2 px-3 rounded-xl border font-mono font-bold text-xs transition-all ${
                      fps === 30
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                        : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    30 FPS (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFps(60)}
                    className={`flex-1 py-2 px-3 rounded-xl border font-mono font-bold text-xs transition-all ${
                      fps === 60
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                        : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    60 FPS (Ultra Smooth)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-mono uppercase tracking-wider text-[11px] font-bold text-cyan-400 mb-1.5 block">
                  4. Bitrate Quality
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as ExportQuality)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="ultra">Ultra (14 Mbps, Max Detail)</option>
                  <option value="high">High (8.5 Mbps, Recommended)</option>
                  <option value="standard">Standard (5 Mbps, Lightweight)</option>
                </select>
              </div>
            </div>

            {/* 4. Editorial Telemetry Overlay Toggle */}
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer hover:bg-white/[0.06] transition-colors">
              <input
                type="checkbox"
                checked={includeOverlay}
                onChange={(e) => setIncludeOverlay(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 text-cyan-500 focus:ring-cyan-400 bg-slate-900"
              />
              <div className="flex-1">
                <span className="font-bold text-white block">Include Himalayan Telemetry & Editorial Watermark</span>
                <span className="text-[11px] text-slate-400 font-light block">
                  Renders the altitude, distance, gradient, and trail coordinates directly on video frames.
                </span>
              </div>
            </label>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-xs"
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
        ) : progress.status === "recording" || progress.status === "preparing" || progress.status === "encoding" ? (
          /* Recording Progress State */
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm text-cyan-300">
                {progress.progressPct}%
              </div>
            </div>

            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="font-display font-bold text-lg text-white">
                {progress.status === "preparing"
                  ? "Preparing 3D Terrain Video Pipeline..."
                  : progress.status === "recording"
                  ? "Recording 3D Himalayan Terrain..."
                  : "Finalizing & Encoding MP4 Video..."}
              </h3>
              <p className="text-xs text-slate-400 font-light">
                {progress.status === "recording"
                  ? `Rendering frame ${progress.currentFrame} of ${progress.totalFrames} • ${progress.elapsedSec.toFixed(1)}s elapsed`
                  : "Compositing satellite mesh and telemetry data into downloadable video."}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-150 ease-out"
                style={{ width: `${progress.progressPct}%` }}
              />
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors"
            >
              <StopCircle className="w-4 h-4" />
              <span>Cancel Recording</span>
            </button>
          </div>
        ) : progress.status === "completed" ? (
          /* Completed Success State */
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-display font-bold text-xl text-white">
                3D Video Render Complete!
              </h3>
              <p className="text-xs text-slate-300 font-light">
                Your video has been generated and the download has started automatically.
              </p>
              {progress.fileSizeMb && (
                <span className="font-mono text-[11px] text-cyan-400 font-bold mt-1">
                  File Size: ~{progress.fileSizeMb} MB
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-4">
              {progress.downloadUrl && (
                <a
                  href={progress.downloadUrl}
                  download={`dht-${placeSlug}-${mode}-${resolution}.mp4`}
                  className="px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Again</span>
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-400/30 flex items-center justify-center text-red-400 shadow-xl">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="font-display font-bold text-lg text-white">Video Export Failed</h3>
              <p className="text-xs text-red-300/80 font-light">
                {progress.error || "An unexpected error occurred during rendering."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setProgress({ status: "idle", progressPct: 0, currentFrame: 0, totalFrames: 0, elapsedSec: 0 })}
              className="mt-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
