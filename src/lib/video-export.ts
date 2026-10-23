/**
 * Discover Himalayan Trails — 3D Map Video Export & Rendering Engine
 * 
 * Provides client-side WebGL canvas stream capture, high-bitrate MediaRecorder
 * orchestration, multi-resolution compositing (1080p Landscape, 1080p Reel, 720p),
 * and editorial alpine telemetry overlays for downloadable MP4 / WebM videos.
 */

export type ExportResolution =
  | "1080p-landscape" // 1920x1080 (16:9 YouTube / Desktop)
  | "1080p-portrait"  // 1080x1920 (9:16 Instagram Reels / YouTube Shorts)
  | "720p-landscape"  // 1280x720 (16:9 Fast HD)
  | "native";         // Current canvas dimensions

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
 * directly onto the offscreen composite frame.
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

  // 3. Bottom Telemetry Cockpit (Left)
  const botPadX = 36 * scale;
  const botPadY = height - 100 * scale;
  const telemetryWidth = isPortrait ? width - botPadX * 2 : 460 * scale;
  const telemetryHeight = 64 * scale;

  ctx.fillStyle = "rgba(4, 8, 18, 0.82)";
  ctx.beginPath();
  ctx.roundRect(botPadX, botPadY, telemetryWidth, telemetryHeight, 16 * scale);
  ctx.fill();
  ctx.strokeStyle = "rgba(56, 189, 248, 0.28)";
  ctx.stroke();

  // Telemetry items: Elevation, Distance, Slope / Bearing
  const colW = telemetryWidth / 3;

  // Col 1: Altitude
  ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
  ctx.font = `bold ${Math.round(10 * scale)}px -apple-system, sans-serif`;
  ctx.fillText("ALTITUDE", botPadX + 18 * scale, botPadY + 24 * scale);

  ctx.fillStyle = "#38BDF8";
  ctx.font = `bold ${Math.round(18 * scale)}px "JetBrains Mono", Menlo, monospace`;
  ctx.fillText(`${Math.round(options.currentElevationM)}m`, botPadX + 18 * scale, botPadY + 48 * scale);

  // Col 2: Distance
  ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
  ctx.font = `bold ${Math.round(10 * scale)}px -apple-system, sans-serif`;
  ctx.fillText("DISTANCE", botPadX + colW + 12 * scale, botPadY + 24 * scale);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold ${Math.round(18 * scale)}px "JetBrains Mono", Menlo, monospace`;
  ctx.fillText(`${options.currentDistanceKm.toFixed(1)} km`, botPadX + colW + 12 * scale, botPadY + 48 * scale);

  // Col 3: Slope or Bearing
  ctx.fillStyle = "rgba(148, 163, 184, 0.9)";
  ctx.font = `bold ${Math.round(10 * scale)}px -apple-system, sans-serif`;
  const col3Label = options.mode === "orbit" ? "HEADING" : "GRADE";
  ctx.fillText(col3Label, botPadX + colW * 2 + 12 * scale, botPadY + 24 * scale);

  ctx.fillStyle = options.gradientPct > 15 ? "#F59E0B" : "#38BDF8";
  ctx.font = `bold ${Math.round(18 * scale)}px "JetBrains Mono", Menlo, monospace`;
  const col3Value = options.mode === "orbit"
    ? `${Math.round(options.bearingDeg)}°`
    : options.gradientPct >= 0
    ? `+${Math.round(options.gradientPct)}%`
    : `${Math.round(options.gradientPct)}%`;
  ctx.fillText(col3Value, botPadX + colW * 2 + 12 * scale, botPadY + 48 * scale);

  // 4. Bottom Right Watermark & Spatial Datum (Desktop only)
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
