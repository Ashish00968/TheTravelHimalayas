import type { RouteWaypoint } from "@/data/types";
import {
  haversineDistanceKm,
  computeAltitudePhysiology,
  type VisibleSummitPeak,
} from "@/lib/camera-math";

export type ExportResolution =
  | "1080p-landscape" // 1920x1080 (16:9 YouTube / Desktop)
  | "1080p-portrait"  // 1080x1920 (9:16 Instagram Reels / YouTube Shorts)
  | "720p-landscape"  // 1280x720 (16:9 Fast HD)
  | "native";         // Current canvas dimensions

export interface RouteMilestone {
  id: string;
  name: string;
  category: "trailhead" | "meadow" | "summit" | "pass";
  kind: "trailhead" | "meadow" | "summit" | "pass";
  kicker: string;
  elevationM: number;
  progress: number; // 0.0 to 1.0 along the route
  accentColor: string;
  note?: string;
  cautionNotice?: string;
}

export interface TacticalAdvisory {
  id: string;
  title: string;
  detail: string;
  elevationM: number;
  progress: number;
}

// Helper to clean up trail waypoint names into punchy editorial titles
function cleanMilestoneName(rawName: string): string {
  return rawName
    .replace(/\s*Trailhead$/i, "")
    .replace(/\s*Apex Cairn$/i, "")
    .replace(/\s*Summit Cairn$/i, "")
    .replace(/\s*Base Camp$/i, "")
    .trim();
}

/**
 * Extracts authentic objective hazards and technical caution waypoints
 * (loose scree, terminal moraines, rockfall zones, water cutoffs).
 */
export function selectTacticalAdvisories(
  waypoints: RouteWaypoint[] | undefined,
  coordinates?: [number, number, number][]
): TacticalAdvisory[] {
  if (!waypoints || waypoints.length === 0) return [];
  const advisories: TacticalAdvisory[] = [];

  const findProgressForCoord = (lng: number, lat: number): number => {
    if (!coordinates || coordinates.length < 2) return 0;
    let minDist = Infinity;
    let closestIdx = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const d = haversineDistanceKm(lng, lat, coordinates[i][0], coordinates[i][1]);
      if (d < minDist) {
        minDist = d;
        closestIdx = i;
      }
    }
    return closestIdx / (coordinates.length - 1);
  };

  waypoints.forEach((w, idx) => {
    if (w.type === "warning" || w.cautionNotice) {
      const prog = findProgressForCoord(w.lng, w.lat);
      const ele =
        w.eleM ||
        (coordinates
          ? Math.round(coordinates[Math.round(prog * (coordinates.length - 1))][2])
          : 3000);
      advisories.push({
        id: `advisory-${idx}`,
        title: cleanMilestoneName(w.name),
        detail: w.cautionNotice || w.note || "Proceed with heightened alpine alertness.",
        elevationM: ele,
        progress: prog,
      });
    }
  });

  return advisories;
}

/**
 * Deterministically curates exactly 2 to 3 high-impact alpine milestones
 * along the route (Trailhead, Key Meadow/Camp, Summit), omitting minor
 * water streams and dense forest sections per broadcast specifications.
 */
export function selectKeyMilestones(
  waypoints: RouteWaypoint[] | undefined,
  totalDistanceKm: number,
  placeName: string,
  apexElevationM: number,
  coordinates?: [number, number, number][]
): RouteMilestone[] {
  const milestones: RouteMilestone[] = [];
  const validWaypoints = (waypoints || []).filter((w) => w && w.name);

  // Helper to find fractional route progress (0.0 to 1.0) for a coordinate
  const findProgressForCoord = (lng: number, lat: number): number => {
    if (!coordinates || coordinates.length < 2) return 0;
    let closestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < coordinates.length; i++) {
      const d = haversineDistanceKm(lng, lat, coordinates[i][0], coordinates[i][1]);
      if (d < minDist) {
        minDist = d;
        closestIdx = i;
      }
    }
    return closestIdx / (coordinates.length - 1);
  };

  // 1. Trailhead / Start Milestone
  const startWp = validWaypoints.find((w) => w.type === "trailhead") || validWaypoints[0];
  const startEle = startWp?.eleM || (coordinates && coordinates[0] ? Math.round(coordinates[0][2]) : 2000);
  const startTitle = startWp ? cleanMilestoneName(startWp.name) : `${placeName} Trailhead`;

  milestones.push({
    id: "milestone-start",
    name: startTitle,
    category: "trailhead",
    kind: "trailhead",
    kicker: `START POINT • ${Math.round(startEle)}M`,
    elevationM: startEle,
    progress: 0.0,
    accentColor: "#38BDF8", // Sky Blue
    note: startWp?.note,
  });

  // 2. Intermediate Milestone(s) (1 or max 2 key points: meadows, camps, passes, lakes)
  // Skip water streams, minor warnings, and dense forest as specifically requested by user.
  if (validWaypoints.length > 1) {
    const scoredCandidates = validWaypoints
      .map((w, index) => {
        const prog = findProgressForCoord(w.lng, w.lat);
        let score = 0;

        const nameLower = w.name.toLowerCase();
        const type = w.type;

        if (type === "camp" || nameLower.includes("camp")) score += 100;
        if (type === "pass" || nameLower.includes("pass")) score += 95;
        if (nameLower.includes("lake") || nameLower.includes("tarn")) score += 90;
        if (nameLower.includes("meadow") || nameLower.includes("thach") || nameLower.includes("bugyal")) score += 110;
        if (type === "landmark" || nameLower.includes("ridge") || nameLower.includes("viewpoint")) score += 50;

        // Heavily de-prioritize streams, water points, and forest as requested
        if (nameLower.includes("stream") || nameLower.includes("water") || type === "water") score -= 80;
        if (nameLower.includes("forest") || nameLower.includes("woodland") || nameLower.includes("scree")) score -= 60;

        // Must be in the middle 70% of the trail (not start, not summit)
        if (prog < 0.12 || prog > 0.88) score = -1000;

        return {
          wp: w,
          index,
          progress: prog,
          score,
        };
      })
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score);

    // Pick top 1 (or 2 if distance > 14km)
    const maxMidpoints = totalDistanceKm > 14 ? 2 : 1;
    const selectedMids = scoredCandidates
      .slice(0, maxMidpoints)
      .sort((a, b) => a.progress - b.progress);

    selectedMids.forEach((c, idx) => {
      const w = c.wp;
      const ele = w.eleM || (coordinates ? Math.round(coordinates[Math.round(c.progress * (coordinates.length - 1))][2]) : 3000);
      const isPass = w.type === "pass" || w.name.toLowerCase().includes("pass");
      const isLake = w.name.toLowerCase().includes("lake") || w.name.toLowerCase().includes("tarn");

      const kicker = isPass
        ? `MOUNTAIN PASS • ${Math.round(ele)}M`
        : isLake
        ? `ALPINE TARN • ${Math.round(ele)}M`
        : `ALPINE MEADOW • ${Math.round(ele)}M`;

      const accent = isPass ? "#A78BFA" : isLake ? "#06B6D4" : "#34D399";

      milestones.push({
        id: `milestone-mid-${idx}`,
        name: cleanMilestoneName(w.name),
        category: isPass ? "pass" : "meadow",
        kind: isPass ? "pass" : "meadow",
        kicker,
        elevationM: ele,
        progress: c.progress,
        accentColor: accent,
        note: w.note,
        cautionNotice: w.cautionNotice,
      });
    });
  }

  // 3. Summit / Apex Milestone
  const summitWp =
    validWaypoints.find((w) => w.type === "summit") ||
    validWaypoints[validWaypoints.length - 1];

  const summitEle = apexElevationM || summitWp?.eleM || (coordinates && coordinates.length > 0 ? Math.round(coordinates[coordinates.length - 1][2]) : 4000);
  const summitTitle = summitWp && summitWp.type === "summit"
    ? cleanMilestoneName(summitWp.name)
    : placeName;

  milestones.push({
    id: "milestone-summit",
    name: summitTitle,
    category: "summit",
    kind: "summit",
    kicker: `SUMMIT CREST • ${Math.round(summitEle)}M`,
    elevationM: summitEle,
    progress: 1.0,
    accentColor: "#F59E0B", // High-Alpine Gold
    note: summitWp?.note,
  });

  return milestones;
}

export type ExportMode = "flyover" | "orbit";
export type ExportFramerate = 30 | 60;
export type ExportQuality = "ultra" | "high" | "standard";
export type ExportDuration = "cinematic" | "quick";

export interface VideoExportOptions {
  mode: ExportMode;
  durationOption?: ExportDuration;
  resolution: ExportResolution;
  fps: ExportFramerate;
  quality: ExportQuality;
  includeTelemetryOverlay: boolean;
  trailName: string;
  maxAltitude: string;
  territoryName: string;
  slug: string;
  apexElevationM?: number;
}

export interface VideoExportProgress {
  status: "idle" | "preparing" | "recording" | "encoding" | "completed" | "error" | "cancelled";
  progressPct: number; // 0 to 100
  currentFrame: number;
  totalFrames: number;
  elapsedSec: number;
  error?: string;
  downloadUrl?: string;
  downloadFilename?: string;
  fileSizeMb?: number;
}

/**
 * Detects the most optimal video MIME type supported by the visitor's browser.
 * Prioritizes native MP4 (AVC1 / H.264) for universal device compatibility,
 * falling back to high-compression WebM (VP9 / VP8).
 */
export function getSupportedVideoMimeType(): { mimeType: string; extension: "mp4" | "webm" } {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    return { mimeType: "video/webm", extension: "webm" };
  }

  const candidateFormats: { mimeType: string; extension: "mp4" | "webm" }[] = [
    { mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", extension: "mp4" },
    { mimeType: "video/mp4;codecs=avc1", extension: "mp4" },
    { mimeType: "video/mp4", extension: "mp4" },
    { mimeType: "video/webm;codecs=vp9", extension: "webm" },
    { mimeType: "video/webm;codecs=vp8", extension: "webm" },
    { mimeType: "video/webm", extension: "webm" },
  ];

  for (const candidate of candidateFormats) {
    if (MediaRecorder.isTypeSupported(candidate.mimeType)) {
      return candidate;
    }
  }

  return { mimeType: "video/webm", extension: "webm" };
}

/**
 * Calculates target pixel dimensions based on resolution preset.
 */
export function getTargetDimensions(
  resolution: ExportResolution,
  sourceCanvas: HTMLCanvasElement
): { width: number; height: number } {
  switch (resolution) {
    case "1080p-landscape":
      return { width: 1920, height: 1080 };
    case "1080p-portrait":
      return { width: 1080, height: 1920 };
    case "720p-landscape":
      return { width: 1280, height: 720 };
    case "native":
    default: {
      // Dimensions must be even integers for video encoders
      const w = sourceCanvas.width - (sourceCanvas.width % 2);
      const h = sourceCanvas.height - (sourceCanvas.height % 2);
      return { width: Math.max(640, w), height: Math.max(360, h) };
    }
  }
}

/**
 * Determines appropriate encoder bitrate based on quality and resolution.
 */
export function getTargetBitrate(quality: ExportQuality, resolution: ExportResolution): number {
  const is1080p = resolution === "1080p-landscape" || resolution === "1080p-portrait" || resolution === "native";
  if (is1080p) {
    switch (quality) {
      case "ultra":
        return 26_000_000; // 26 Mbps (Cinema Master grade, crystal clear snow and rock relief)
      case "high":
        return 16_000_000; // 16 Mbps (Vibrant High Definition)
      case "standard":
      default:
        return 9_000_000;  // 9 Mbps (Optimized web sharing)
    }
  } else {
    switch (quality) {
      case "ultra":
        return 14_000_000;
      case "high":
        return 9_000_000;
      case "standard":
      default:
        return 6_000_000;
    }
  }
}

/**
 * Draws the high-contrast Himalayan alpine telemetry and editorial branding
 * directly onto the offscreen composite frame, including barometric oxygen
 * saturation (% O2), clinical altitude zones, and mini elevation profile.
 */
export function renderTelemetryOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: {
    trailName: string;
    maxAltitude: string;
    territoryName: string;
    currentElevationM: number;
    currentDistanceKm: number;
    totalDistanceKm: number;
    gradientPct: number;
    bearingDeg: number;
    progressPct: number;
    mode: ExportMode;
    elevationProfile?: { distKm: number; eleM: number }[];
  }
) {
  const isPortrait = height > width;
  const scale = width / (isPortrait ? 1080 : 1920);

  ctx.save();

  // 1. Top Brand Banner (Discover Himalayan Trails Editorial Masthead)
  const topPadX = 36 * scale;
  const topPadY = 36 * scale;

  // Frosted dark backplate for header
  const headerWidth = Math.min(width - topPadX * 2, isPortrait ? width - 72 * scale : 680 * scale);
  const headerHeight = 76 * scale;

  ctx.fillStyle = "rgba(4, 8, 18, 0.78)";
  ctx.beginPath();
  ctx.roundRect(topPadX, topPadY, headerWidth, headerHeight, 16 * scale);
  ctx.fill();

  ctx.lineWidth = 1.5 * scale;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.stroke();

  // Cyan accent indicator pip
  ctx.fillStyle = "#38BDF8";
  ctx.beginPath();
  ctx.arc(topPadX + 24 * scale, topPadY + headerHeight / 2, 5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Header Typography
  ctx.fillStyle = "#38BDF8";
  ctx.font = `bold ${Math.round(11 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillText("DISCOVER HIMALAYAN TRAILS • 3D EXPEDITION SURVEY", topPadX + 38 * scale, topPadY + 28 * scale);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold ${Math.round(20 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  const displayTitle = options.trailName.length > 28 && isPortrait
    ? options.trailName.slice(0, 26) + "…"
    : options.trailName;
  ctx.fillText(`${displayTitle} (${options.maxAltitude})`, topPadX + 38 * scale, topPadY + 54 * scale);

  // 2. Mode Badge (Top Right)
  const badgeWidth = 190 * scale;
  const badgeHeight = 36 * scale;
  const badgeX = width - topPadX - badgeWidth;
  const badgeY = topPadY;

  ctx.fillStyle = "rgba(4, 8, 18, 0.78)";
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 18 * scale);
  ctx.fill();
  ctx.strokeStyle = options.mode === "orbit" ? "rgba(56, 189, 248, 0.5)" : "rgba(255, 255, 255, 0.16)";
  ctx.stroke();

  ctx.fillStyle = options.mode === "orbit" ? "#38BDF8" : "#E2E8F0";
  ctx.font = `bold ${Math.round(11 * scale)}px "JetBrains Mono", Menlo, monospace`;
  ctx.textAlign = "center";
  const badgeText = options.mode === "orbit" ? "360° SUMMIT ORBIT" : `PROGRESS • ${Math.round(options.progressPct)}%`;
  ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY + 22 * scale);
  ctx.textAlign = "left";

  // 3. Compute Himalayan Oxygen & Barometric Physiology
  const physio = computeAltitudePhysiology(options.currentElevationM);

  // 4. Bottom Telemetry Cockpit (Left)
  const botPadX = 36 * scale;
  const telemetryHeight = isPortrait ? 104 * scale : 68 * scale;
  const botPadY = height - telemetryHeight - 32 * scale;
  const telemetryWidth = isPortrait ? width - botPadX * 2 : 470 * scale;

  ctx.fillStyle = "rgba(4, 8, 18, 0.85)";
  ctx.beginPath();
  ctx.roundRect(botPadX, botPadY, telemetryWidth, telemetryHeight, 16 * scale);
  ctx.fill();
  ctx.strokeStyle = "rgba(56, 189, 248, 0.28)";
  ctx.lineWidth = 1.2 * scale;
  ctx.stroke();

  // Telemetry items: Elevation & O2, Distance, Slope / Bearing
  const colW = telemetryWidth / 3;

  // Col 1: Altitude & Effective Oxygen %
  ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
  ctx.font = `bold ${Math.round(10 * scale)}px -apple-system, sans-serif`;
  ctx.fillText("ALTITUDE • O₂", botPadX + 18 * scale, botPadY + 22 * scale);

  ctx.fillStyle = physio.zoneColor;
  ctx.font = `bold ${Math.round(17 * scale)}px "JetBrains Mono", Menlo, monospace`;
  ctx.fillText(`${Math.round(options.currentElevationM)}m`, botPadX + 18 * scale, botPadY + 44 * scale);

  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  ctx.font = `bold ${Math.round(10 * scale)}px "JetBrains Mono", Menlo, monospace`;
  ctx.fillText(`${physio.oxygenPct}% O₂`, botPadX + 18 * scale, botPadY + 58 * scale);

  // Col 2: Distance
  ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
  ctx.font = `bold ${Math.round(10 * scale)}px -apple-system, sans-serif`;
  ctx.fillText("DISTANCE", botPadX + colW + 12 * scale, botPadY + 22 * scale);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold ${Math.round(17 * scale)}px "JetBrains Mono", Menlo, monospace`;
  ctx.fillText(`${options.currentDistanceKm.toFixed(1)} km`, botPadX + colW + 12 * scale, botPadY + 44 * scale);

  ctx.fillStyle = "rgba(148, 163, 184, 0.75)";
  ctx.font = `${Math.round(10 * scale)}px "JetBrains Mono", Menlo, monospace`;
  ctx.fillText(`/ ${options.totalDistanceKm.toFixed(1)} km`, botPadX + colW + 12 * scale, botPadY + 58 * scale);

  // Col 3: Slope or Bearing
  ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
  ctx.font = `bold ${Math.round(10 * scale)}px -apple-system, sans-serif`;
  const col3Label = options.mode === "orbit" ? "HEADING" : "GRADE";
  ctx.fillText(col3Label, botPadX + colW * 2 + 12 * scale, botPadY + 22 * scale);

  ctx.fillStyle = options.gradientPct > 15 ? "#F59E0B" : "#38BDF8";
  ctx.font = `bold ${Math.round(17 * scale)}px "JetBrains Mono", Menlo, monospace`;
  const col3Value = options.mode === "orbit"
    ? `${Math.round(options.bearingDeg)}°`
    : options.gradientPct >= 0
    ? `+${Math.round(options.gradientPct)}%`
    : `${Math.round(options.gradientPct)}%`;
  ctx.fillText(col3Value, botPadX + colW * 2 + 12 * scale, botPadY + 44 * scale);

  ctx.fillStyle = "rgba(148, 163, 184, 0.75)";
  ctx.font = `${Math.round(10 * scale)}px "JetBrains Mono", Menlo, monospace`;
  ctx.fillText(physio.amsRisk.toUpperCase() + " RISK", botPadX + colW * 2 + 12 * scale, botPadY + 58 * scale);

  // 5. Mini Elevation Profile Silhouette
  if (options.elevationProfile && options.elevationProfile.length > 2) {
    if (isPortrait) {
      // In portrait: embed elevation profile in lower half of the telemetry capsule
      const embX = botPadX + 16 * scale;
      const embY = botPadY + 66 * scale;
      const embW = telemetryWidth - 32 * scale;
      const embH = 30 * scale;
      renderEmbeddedMiniProfile(ctx, embX, embY, embW, embH, options.elevationProfile, options.progressPct, scale);
    } else {
      // In landscape/native: render dedicated side-by-side elevation profile capsule
      const profileW = 270 * scale;
      const profileX = botPadX + telemetryWidth + 14 * scale;
      renderMiniElevationProfile(
        ctx,
        profileX,
        botPadY,
        profileW,
        telemetryHeight,
        options.elevationProfile,
        options.progressPct,
        scale
      );
    }
  }

  // 6. Bottom Right Watermark & Spatial Datum (Desktop only)
  if (!isPortrait) {
    const datumText = "WGS 84 • 3D DEM TERRAIN • discoverhimalayantrails.com";
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.font = `${Math.round(11 * scale)}px "JetBrains Mono", monospace`;
    ctx.textAlign = "right";
    ctx.fillText(datumText, width - botPadX, height - 44 * scale);
    ctx.textAlign = "left";
  }

  ctx.restore();
}

/**
 * Draws the vector mini elevation profile silhouette with gradient fill,
 * 3,000m AMS safety guideline, and live climbing hiker beacon dot.
 */
export function renderMiniElevationProfile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  elevationProfile: { distKm: number; eleM: number }[],
  currentProgressPct: number,
  scale: number
) {
  if (!elevationProfile || elevationProfile.length < 2) return;

  const n = elevationProfile.length;
  let minEle = Infinity;
  let maxEle = -Infinity;
  for (let i = 0; i < n; i++) {
    const e = elevationProfile[i].eleM;
    if (e < minEle) minEle = e;
    if (e > maxEle) maxEle = e;
  }
  const eleSpan = Math.max(150, maxEle - minEle);

  ctx.save();

  // Background capsule
  ctx.fillStyle = "rgba(4, 8, 18, 0.85)";
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 16 * scale);
  ctx.fill();
  ctx.strokeStyle = "rgba(56, 189, 248, 0.28)";
  ctx.lineWidth = 1.2 * scale;
  ctx.stroke();

  // Header / Label
  ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
  ctx.font = `bold ${Math.round(9.5 * scale)}px -apple-system, sans-serif`;
  ctx.fillText("ELEVATION PROFILE", x + 14 * scale, y + 18 * scale);

  ctx.fillStyle = "#38BDF8";
  ctx.font = `bold ${Math.round(9.5 * scale)}px "JetBrains Mono", monospace`;
  ctx.textAlign = "right";
  ctx.fillText(`↗ ${Math.round(maxEle)}m`, x + width - 14 * scale, y + 18 * scale);
  ctx.textAlign = "left";

  const padLeft = 14 * scale;
  const padRight = 14 * scale;
  const padTop = 26 * scale;
  const padBottom = 12 * scale;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  if (plotW <= 10 || plotH <= 10) {
    ctx.restore();
    return;
  }

  // 3000m AMS safety threshold guideline
  if (maxEle >= 3000 && minEle < 3000) {
    const amsNormY = (3000 - minEle) / eleSpan;
    const amsY = y + padTop + plotH * (1 - amsNormY);
    ctx.beginPath();
    ctx.setLineDash([3 * scale, 3 * scale]);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.55)";
    ctx.lineWidth = 1 * scale;
    ctx.moveTo(x + padLeft, amsY);
    ctx.lineTo(x + padLeft + plotW, amsY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(245, 158, 11, 0.8)";
    ctx.font = `bold ${Math.round(7.5 * scale)}px "JetBrains Mono", monospace`;
    ctx.fillText("3,000m AMS", x + padLeft + 4 * scale, amsY - 3 * scale);
  }

  // Build the elevation path points
  const points: { px: number; py: number }[] = [];
  for (let i = 0; i < n; i++) {
    const fracX = i / (n - 1);
    const fracY = (elevationProfile[i].eleM - minEle) / eleSpan;
    const px = x + padLeft + fracX * plotW;
    const py = y + padTop + plotH * (1 - fracY);
    points.push({ px, py });
  }

  // Fill gradient beneath curve
  ctx.beginPath();
  ctx.moveTo(points[0].px, points[0].py);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].px, points[i].py);
  }
  ctx.lineTo(x + padLeft + plotW, y + padTop + plotH);
  ctx.lineTo(x + padLeft, y + padTop + plotH);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, y + padTop, 0, y + padTop + plotH);
  grad.addColorStop(0, "rgba(56, 189, 248, 0.40)");
  grad.addColorStop(1, "rgba(56, 189, 248, 0.02)");
  ctx.fillStyle = grad;
  ctx.fill();

  // Stroke top ridge line
  ctx.beginPath();
  ctx.moveTo(points[0].px, points[0].py);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].px, points[i].py);
  }
  ctx.strokeStyle = "#38BDF8";
  ctx.lineWidth = 1.6 * scale;
  ctx.stroke();

  // Active Hiker Marker on elevation profile
  const pClamped = Math.max(0, Math.min(1, currentProgressPct / 100));
  const activeIdx = Math.min(n - 1, Math.max(0, Math.round(pClamped * (n - 1))));
  const activePt = points[activeIdx];

  // Outer glow
  ctx.beginPath();
  ctx.arc(activePt.px, activePt.py, 5.5 * scale, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 229, 255, 0.45)";
  ctx.fill();

  // White reflective core
  ctx.beginPath();
  ctx.arc(activePt.px, activePt.py, 3.2 * scale, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  ctx.restore();
}

/**
 * Draws a compact embedded mini elevation profile line inside portrait cards.
 */
function renderEmbeddedMiniProfile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  elevationProfile: { distKm: number; eleM: number }[],
  currentProgressPct: number,
  scale: number
) {
  const n = elevationProfile.length;
  let minEle = Infinity;
  let maxEle = -Infinity;
  for (let i = 0; i < n; i++) {
    const e = elevationProfile[i].eleM;
    if (e < minEle) minEle = e;
    if (e > maxEle) maxEle = e;
  }
  const eleSpan = Math.max(100, maxEle - minEle);

  const points: { px: number; py: number }[] = [];
  for (let i = 0; i < n; i++) {
    const fracX = i / (n - 1);
    const fracY = (elevationProfile[i].eleM - minEle) / eleSpan;
    const px = x + fracX * width;
    const py = y + height * (1 - fracY);
    points.push({ px, py });
  }

  // Fill gradient
  ctx.beginPath();
  ctx.moveTo(points[0].px, points[0].py);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].px, points[i].py);
  }
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, y, 0, y + height);
  grad.addColorStop(0, "rgba(56, 189, 248, 0.35)");
  grad.addColorStop(1, "rgba(56, 189, 248, 0.02)");
  ctx.fillStyle = grad;
  ctx.fill();

  // Stroke top ridge
  ctx.beginPath();
  ctx.moveTo(points[0].px, points[0].py);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].px, points[i].py);
  }
  ctx.strokeStyle = "#38BDF8";
  ctx.lineWidth = 1.4 * scale;
  ctx.stroke();

  // Active marker
  const pClamped = Math.max(0, Math.min(1, currentProgressPct / 100));
  const activeIdx = Math.min(n - 1, Math.max(0, Math.round(pClamped * (n - 1))));
  const activePt = points[activeIdx];

  ctx.beginPath();
  ctx.arc(activePt.px, activePt.py, 4.5 * scale, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 229, 255, 0.5)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(activePt.px, activePt.py, 2.5 * scale, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
}

/**
 * Renders a high-contrast Himalayan alpine peak sighting banner during 360° summit orbit.
 */
export function renderPeakSightingBanner(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  peakSighting: VisibleSummitPeak,
  opacity: number,
  scale: number,
  isPortrait: boolean
) {
  if (opacity <= 0.01) return;
  ctx.save();

  const cardWidth = Math.min(width - 48 * scale, isPortrait ? width - 56 * scale : 490 * scale);
  const cardHeight = 72 * scale;
  const cardX = (width - cardWidth) / 2;
  const baseY = isPortrait ? 135 * scale : 125 * scale;
  const cardY = baseY + (1 - opacity) * 10 * scale;

  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
  ctx.shadowColor = "#F59E0B";
  ctx.shadowBlur = 20 * scale * opacity;

  // Background
  ctx.fillStyle = "rgba(6, 11, 24, 0.92)";
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 18 * scale);
  ctx.fill();

  // Border
  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 1.75 * scale;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Peak Badge Circle
  const iconR = 18 * scale;
  const iconX = cardX + 28 * scale;
  const iconY = cardY + cardHeight / 2;

  ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
  ctx.beginPath();
  ctx.arc(iconX, iconY, iconR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Mountain Peak Vector Icon
  ctx.strokeStyle = "#F59E0B";
  ctx.fillStyle = "#F59E0B";
  ctx.lineWidth = 1.75 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(iconX - 8 * scale, iconY + 7 * scale);
  ctx.lineTo(iconX - 1 * scale, iconY - 7 * scale);
  ctx.lineTo(iconX + 6 * scale, iconY + 7 * scale);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(iconX + 2 * scale, iconY - 1 * scale);
  ctx.lineTo(iconX + 9 * scale, iconY + 7 * scale);
  ctx.stroke();

  // Typography
  const textLeft = iconX + iconR + 14 * scale;

  ctx.font = `bold ${Math.round(10.5 * scale)}px "JetBrains Mono", monospace`;
  ctx.fillStyle = "#F59E0B";
  ctx.fillText(
    `HIMALAYAN PEAK SIGHTING • ${peakSighting.distanceKm}KM ${peakSighting.compassDir}`,
    textLeft,
    cardY + 28 * scale
  );

  ctx.font = `bold ${Math.round(20 * scale)}px -apple-system, sans-serif`;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(
    `${peakSighting.peak.name} (${peakSighting.peak.heightM}m)`,
    textLeft,
    cardY + 54 * scale
  );

  ctx.restore();
}

/**
 * Renders an authoritative high-altitude alpine tactical hazard advisory banner.
 */
export function renderTacticalAdvisoryBanner(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  advisory: TacticalAdvisory,
  opacity: number,
  scale: number,
  isPortrait: boolean
) {
  if (opacity <= 0.01) return;
  ctx.save();

  const cardWidth = Math.min(width - 48 * scale, isPortrait ? width - 56 * scale : 520 * scale);
  const cardHeight = 78 * scale;
  const cardX = (width - cardWidth) / 2;
  const baseY = isPortrait ? 135 * scale : 125 * scale;
  const cardY = baseY + (1 - opacity) * 10 * scale;

  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
  ctx.shadowColor = "#FB923C";
  ctx.shadowBlur = 22 * scale * opacity;

  // Background
  ctx.fillStyle = "rgba(15, 10, 8, 0.94)";
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 18 * scale);
  ctx.fill();

  // Border
  ctx.strokeStyle = "#FB923C";
  ctx.lineWidth = 1.75 * scale;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Warning Badge Circle
  const iconR = 18 * scale;
  const iconX = cardX + 28 * scale;
  const iconY = cardY + cardHeight / 2;

  ctx.fillStyle = "rgba(251, 146, 60, 0.16)";
  ctx.beginPath();
  ctx.arc(iconX, iconY, iconR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#FB923C";
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Warning triangle icon
  ctx.strokeStyle = "#FB923C";
  ctx.fillStyle = "#FB923C";
  ctx.lineWidth = 1.75 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(iconX, iconY - 8 * scale);
  ctx.lineTo(iconX - 7 * scale, iconY + 6 * scale);
  ctx.lineTo(iconX + 7 * scale, iconY + 6 * scale);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(iconX, iconY + 2 * scale, 1.2 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Typography
  const textLeft = iconX + iconR + 14 * scale;

  ctx.font = `bold ${Math.round(10.5 * scale)}px "JetBrains Mono", monospace`;
  ctx.fillStyle = "#FB923C";
  ctx.fillText(
    `ALPINE TACTICAL CAUTION • ${Math.round(advisory.elevationM)}M`,
    textLeft,
    cardY + 26 * scale
  );

  ctx.font = `bold ${Math.round(17 * scale)}px -apple-system, sans-serif`;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(advisory.title, textLeft, cardY + 48 * scale);

  ctx.font = `${Math.round(11 * scale)}px -apple-system, sans-serif`;
  ctx.fillStyle = "rgba(254, 215, 170, 0.9)";
  const maxDetailW = cardWidth - (textLeft - cardX) - 16 * scale;
  let detailText = advisory.detail;
  if (ctx.measureText(detailText).width > maxDetailW) {
    while (detailText.length > 3 && ctx.measureText(detailText + "…").width > maxDetailW) {
      detailText = detailText.slice(0, -1);
    }
    detailText += "…";
  }
  ctx.fillText(detailText, textLeft, cardY + 67 * scale);

  ctx.restore();
}

/**
 * Draws the high-visibility Strava-grade pulsing cyan hiker beacon directly
 * onto the composite canvas frame at the hiker's projected screen coordinates.
 */
export function drawHikerBeaconOnCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  now: number,
  scale: number = 1
) {
  ctx.save();

  // 1. Outer expanding radar pulse ring
  const pulseT = (now % 1500) / 1500; // 0 to 1 over 1.5s
  const maxHalo = 26 * scale;
  const haloRadius = 10 * scale + pulseT * maxHalo;
  const haloAlpha = Math.max(0, 1 - pulseT) * 0.55;

  ctx.beginPath();
  ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(34, 211, 238, ${haloAlpha})`;
  ctx.fill();

  // 2. Cyan ripple ring stroke
  ctx.beginPath();
  ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(0, 229, 255, ${haloAlpha * 0.85})`;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // 3. Middle bright cyan border ring
  ctx.beginPath();
  ctx.arc(x, y, 9 * scale, 0, Math.PI * 2);
  ctx.fillStyle = "#06B6D4";
  ctx.shadowColor = "#00E5FF";
  ctx.shadowBlur = 12 * scale;
  ctx.fill();

  // 4. Inner crisp reflective white core
  ctx.beginPath();
  ctx.arc(x, y, 5.5 * scale, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowBlur = 0;
  ctx.fill();

  // 5. Dark center pinpoint
  ctx.beginPath();
  ctx.arc(x, y, 2.2 * scale, 0, Math.PI * 2);
  ctx.fillStyle = "#030712";
  ctx.fill();

  ctx.restore();
}

/**
 * Renders a broadcast-grade alpine waypoint milestone badge onto the video canvas.
 * Seamlessly adapts between landscape and portrait orientations with glowing
 * territory accents, frosted glass backdrop, and animated entry float.
 */
export function renderMilestoneBanner(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  milestone: RouteMilestone,
  opacity: number,
  scale: number,
  isPortrait: boolean
) {
  if (opacity <= 0.01) return;
  ctx.save();

  // Dimensions & centering
  const cardWidth = Math.min(width - 48 * scale, isPortrait ? width - 56 * scale : 450 * scale);
  const cardHeight = 74 * scale;
  const cardX = (width - cardWidth) / 2;
  // Positioned high in the sky frame above the hiker
  const baseY = isPortrait ? 135 * scale : 125 * scale;
  const floatOffset = (1 - opacity) * 12 * scale; // smooth upward float on entry
  const cardY = baseY + floatOffset;

  // 1. Frosted Glass Backplate
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

  // Outer glow shadow
  ctx.shadowColor = milestone.accentColor;
  ctx.shadowBlur = 22 * scale * opacity;

  ctx.fillStyle = "rgba(6, 11, 24, 0.92)";
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 18 * scale);
  ctx.fill();

  // Glowing hairline border
  ctx.strokeStyle = milestone.accentColor;
  ctx.lineWidth = 1.75 * scale;
  ctx.stroke();

  // Reset shadow for crisp inner vector elements
  ctx.shadowBlur = 0;

  // 2. Left Icon Badge Circle
  const iconR = 18 * scale;
  const iconX = cardX + 28 * scale;
  const iconY = cardY + cardHeight / 2;

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.arc(iconX, iconY, iconR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = milestone.accentColor;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Draw clean vector icon inside badge
  ctx.strokeStyle = milestone.accentColor;
  ctx.fillStyle = milestone.accentColor;
  ctx.lineWidth = 1.75 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (milestone.category === "trailhead") {
    // Locator Pin
    ctx.beginPath();
    ctx.arc(iconX, iconY - 2 * scale, 5 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(iconX, iconY - 2 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(iconX, iconY + 3 * scale);
    ctx.lineTo(iconX, iconY + 7 * scale);
    ctx.stroke();
  } else if (milestone.category === "summit") {
    // Summit Peak Flag
    ctx.beginPath();
    ctx.moveTo(iconX - 6 * scale, iconY + 7 * scale);
    ctx.lineTo(iconX, iconY - 7 * scale);
    ctx.lineTo(iconX + 6 * scale, iconY + 7 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(iconX, iconY - 7 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Alpine Meadow / Tent Chevron
    ctx.beginPath();
    ctx.moveTo(iconX - 7 * scale, iconY + 6 * scale);
    ctx.lineTo(iconX - 2 * scale, iconY - 5 * scale);
    ctx.lineTo(iconX + 4 * scale, iconY + 6 * scale);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(iconX + 1 * scale, iconY - 2 * scale);
    ctx.lineTo(iconX + 7 * scale, iconY + 6 * scale);
    ctx.stroke();
  }

  // 3. Typography Layout
  const textLeft = iconX + iconR + 14 * scale;

  // Kicker Line (All Caps Monospace)
  ctx.font = `bold ${Math.round(10.5 * scale)}px "JetBrains Mono", Menlo, monospace`;
  ctx.fillStyle = milestone.accentColor;
  ctx.fillText(milestone.kicker, textLeft, cardY + 28 * scale);

  // Title Line (Bold Headline)
  ctx.font = `bold ${Math.round(20 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.fillStyle = "#FFFFFF";
  const maxTitleW = cardWidth - (textLeft - cardX) - 16 * scale;
  let displayTitle = milestone.name;
  if (ctx.measureText(displayTitle).width > maxTitleW) {
    while (displayTitle.length > 3 && ctx.measureText(displayTitle + "…").width > maxTitleW) {
      displayTitle = displayTitle.slice(0, -1);
    }
    displayTitle += "…";
  }
  ctx.fillText(displayTitle, textLeft, cardY + 54 * scale);

  ctx.restore();
}

