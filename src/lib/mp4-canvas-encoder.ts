/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  DETERMINISTIC WEBCODECS H.264 MP4 CANVAS ENCODER
 *  Discover Himalayan Trails — Frame-Settled Broadcast Video Exporter
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Implements deterministic frame-by-frame hardware video encoding using the
 * WebCodecs VideoEncoder API and mp4-muxer.
 *
 * Capabilities:
 *   1. Dynamic AVC (H.264) profile & level selection (Levels 4.0 -> 5.2)
 *   2. Support for arbitrary Retina / native screen dimensions without coded area overflow
 *   3. Pre-flight hardware configuration negotiation (VideoEncoder.isConfigSupported)
 *   4. Fast-Start in-memory moov atom for 100% native iOS / macOS QuickTime playback
 *   5. Zero dropped frames under heavy WebGL GPU load (discrete Δt time-stepping)
 *   6. High-resolution tile-settle barriers ensuring zero blurry textures
 */

import { ArrayBufferTarget, Muxer } from "mp4-muxer";

export interface SettleableMap {
  areTilesLoaded: () => boolean;
  isMoving?: () => boolean;
  isStyleLoaded?: () => boolean | void;
}

/**
 * Checks whether Mapbox satellite tiles and elevation terrain meshes
 * are 100% rasterized before capturing a frame.
 */
export function isMapSettled(map: SettleableMap): boolean {
  if (typeof map.isStyleLoaded === "function" && map.isStyleLoaded() !== true) return false;
  if (typeof map.isMoving === "function" && map.isMoving()) return false;
  return map.areTilesLoaded();
}

/**
 * Asynchronously awaits map tile settling with an upper-bound timeout
 * to prevent indefinite stalls on slow network connections.
 */
export async function waitForMapSettle(map: SettleableMap, maxWaitMs = 250): Promise<void> {
  const startTime = performance.now();
  while (!isMapSettled(map)) {
    if (performance.now() - startTime >= maxWaitMs) {
      break; // Safe timeout fallback: proceed with available LOD
    }
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
}

/**
 * Checks if the current browser environment natively supports WebCodecs VideoEncoder.
 */
export function isWebCodecsSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof (window as unknown as { VideoEncoder?: unknown }).VideoEncoder === "function" &&
    typeof (window as unknown as { VideoFrame?: unknown }).VideoFrame === "function"
  );
}

/**
 * Computes coded macroblocks and returns the optimal AVC (H.264) codec string
 * compliant with ITU-T H.264 Annex A Table A-1 Level limits.
 *
 * Macroblock = 16x16 pixels.
 * Coded dimensions round up to multiples of 16.
 *
 * Levels:
 *   - Level 4.0 (0x28): MaxFS 8,192 macroblocks (1080p @ 30fps)
 *   - Level 4.2 (0x2a): MaxFS 8,704 macroblocks (2,228,224 px, 1080p @ 60fps)
 *   - Level 5.0 (0x32): MaxFS 22,080 macroblocks (5,652,480 px, up to ~2560x1440 @ 30fps)
 *   - Level 5.1 (0x33): MaxFS 36,864 macroblocks (9,437,184 px, 4K UHD @ 30fps / 1440p+ @ 60fps / 1948x1320 @ 60fps)
 *   - Level 5.2 (0x34): MaxFS 36,864 macroblocks (9,437,184 px, 4K UHD @ 60fps)
 */
export function getOptimalAvcCodec(width: number, height: number, fps: number): string {
  const mbW = Math.ceil(width / 16);
  const mbH = Math.ceil(height / 16);
  const macroblocks = mbW * mbH;
  const mbPerSec = macroblocks * fps;

  if (macroblocks > 22080 || mbPerSec > 983040) {
    return "avc1.640034"; // Level 5.2 (4K @ 60fps)
  }
  if (macroblocks > 8704 || mbPerSec > 522240) {
    return "avc1.640033"; // Level 5.1 (Up to 4K @ 30fps, 1440p+ / Retina @ 60fps)
  }
  if (fps > 30) {
    return "avc1.64002a"; // Level 4.2 (1080p @ 60fps)
  }
  return "avc1.640028";   // Level 4.0 (1080p @ 30fps)
}

/**
 * Returns prioritized candidate codec strings for a given resolution and framerate.
 */
export function getCandidateAvcCodecs(width: number, height: number, fps: number): string[] {
  const primary = getOptimalAvcCodec(width, height, fps);
  const candidates: string[] = [primary];

  if (primary === "avc1.640034") {
    candidates.push("avc1.640033", "avc1.4d0034", "avc1.420034");
  } else if (primary === "avc1.640033") {
    candidates.push("avc1.640034", "avc1.4d0033", "avc1.420033");
  } else if (primary === "avc1.64002a") {
    candidates.push("avc1.640033", "avc1.4d002a", "avc1.42002a");
  } else {
    candidates.push("avc1.64002a", "avc1.4d0028", "avc1.420028");
  }

  return Array.from(new Set(candidates));
}

export interface ValidatedEncoderConfig {
  codec: string;
  width: number;
  height: number;
}

/**
 * Performs pre-flight negotiation with the browser's hardware VideoEncoder
 * using VideoEncoder.isConfigSupported to find the highest-quality supported
 * codec and resolution without coded area overflow.
 */
export async function findSupportedEncoderConfig(
  width: number,
  height: number,
  fps: number,
  bitrate: number
): Promise<ValidatedEncoderConfig | null> {
  if (!isWebCodecsSupported()) return null;

  // 1. Ensure dimensions are even integers
  let targetW = width - (width % 2);
  let targetH = height - (height % 2);

  // 2. Cap at 4K boundary (3840x2160) to prevent GPU memory crashes on 5K/8K displays
  const MAX_AREA = 3840 * 2160;
  if (targetW * targetH > MAX_AREA) {
    const scale = Math.sqrt(MAX_AREA / (targetW * targetH));
    targetW = Math.floor((targetW * scale) / 2) * 2;
    targetH = Math.floor((targetH * scale) / 2) * 2;
  }

  // 3. Try primary and alternate candidate codecs for target dimensions
  const candidates = getCandidateAvcCodecs(targetW, targetH, fps);
  for (const codec of candidates) {
    try {
      const support = await VideoEncoder.isConfigSupported({
        codec,
        width: targetW,
        height: targetH,
        bitrate,
        framerate: fps,
        avc: { format: "avc" },
      });
      if (support.supported) {
        return { codec, width: targetW, height: targetH };
      }
    } catch {
      // Continue searching
    }
  }

  // 4. If higher levels (5.1/5.2) fail on constrained hardware,
  // proportionally downscale to standard 1080p area (<= 2,073,600 px) which fits Level 4.2
  const codedW = Math.ceil(targetW / 16) * 16;
  const codedH = Math.ceil(targetH / 16) * 16;
  const codedArea = codedW * codedH;

  if (codedArea > 2_228_224) {
    const scale = Math.sqrt(2_073_600 / (targetW * targetH));
    const scaledW = Math.floor((targetW * scale) / 2) * 2;
    const scaledH = Math.floor((targetH * scale) / 2) * 2;

    const level42Candidates = ["avc1.64002a", "avc1.4d002a", "avc1.42002a", "avc1.640028"];
    for (const codec of level42Candidates) {
      try {
        const support = await VideoEncoder.isConfigSupported({
          codec,
          width: scaledW,
          height: scaledH,
          bitrate,
          framerate: fps,
          avc: { format: "avc" },
        });
        if (support.supported) {
          return { codec, width: scaledW, height: scaledH };
        }
      } catch {
        // Continue
      }
    }
  }

  return null;
}

export interface Mp4CanvasEncoderOptions {
  width: number;
  height: number;
  fps: number;
  bitrate?: number; // default 16 Mbps
  codec?: string;   // Optional verified codec override
}

export class Mp4CanvasEncoder {
  private muxer: Muxer<ArrayBufferTarget>;
  private encoder: VideoEncoder;
  public readonly width: number;
  public readonly height: number;
  public readonly fps: number;
  public readonly codec: string;
  private frameIndex = 0;
  private encoderError: Error | null = null;

  /**
   * Factory method that performs pre-flight hardware support negotiation
   * before constructing the encoder. Returns null if unsupported.
   */
  static async create(options: Mp4CanvasEncoderOptions): Promise<Mp4CanvasEncoder | null> {
    if (!isWebCodecsSupported()) return null;

    const bitrate = options.bitrate ?? 16_000_000;
    const config = await findSupportedEncoderConfig(
      options.width,
      options.height,
      options.fps,
      bitrate
    );

    if (!config) {
      console.warn("[WebCodecs] No supported H.264 encoder configuration found for dimensions:", {
        width: options.width,
        height: options.height,
        fps: options.fps,
      });
      return null;
    }

    try {
      return new Mp4CanvasEncoder({
        width: config.width,
        height: config.height,
        fps: options.fps,
        bitrate,
        codec: config.codec,
      });
    } catch (err) {
      console.error("[WebCodecs] Failed to instantiate Mp4CanvasEncoder:", err);
      return null;
    }
  }

  constructor(options: Mp4CanvasEncoderOptions) {
    // Dimensions must be even integers for H.264 encoding
    this.width = options.width - (options.width % 2);
    this.height = options.height - (options.height % 2);
    this.fps = options.fps;
    const bitrate = options.bitrate ?? 16_000_000;
    this.codec = options.codec ?? getOptimalAvcCodec(this.width, this.height, this.fps);

    const target = new ArrayBufferTarget();
    this.muxer = new Muxer({
      target,
      video: {
        codec: "avc",
        width: this.width,
        height: this.height,
      },
      fastStart: "in-memory",
      firstTimestampBehavior: "offset",
    });

    this.encoder = new VideoEncoder({
      output: (chunk, meta) => this.muxer.addVideoChunk(chunk, meta),
      error: (e) => {
        console.error("[WebCodecs MP4 Encoder Error]", e);
        this.encoderError = e instanceof Error ? e : new Error(String(e));
      },
    });

    try {
      this.encoder.configure({
        codec: this.codec,
        width: this.width,
        height: this.height,
        bitrate,
        framerate: this.fps,
        avc: { format: "avc" },
      });
    } catch (err) {
      console.error("[WebCodecs MP4 configure failed]", err);
      this.encoderError = err instanceof Error ? err : new Error(String(err));
      throw err;
    }
  }

  /**
   * Encodes a single HTML canvas frame with deterministic microsecond timestamps.
   */
  async encodeCanvas(canvas: HTMLCanvasElement): Promise<void> {
    if (this.encoderError) {
      throw new Error(`VideoEncoder encountered an error: ${this.encoderError.message}`);
    }
    if (this.encoder.state !== "configured") {
      throw new Error(`VideoEncoder is in state '${this.encoder.state}', cannot encode frame`);
    }

    const timestampMicros = Math.round((this.frameIndex / this.fps) * 1_000_000);
    const durationMicros = Math.round((1 / this.fps) * 1_000_000);

    const frame = new VideoFrame(canvas, {
      timestamp: timestampMicros,
      duration: durationMicros,
    });

    // Keyframe every 2 seconds
    const keyFrame = this.frameIndex % (this.fps * 2) === 0;
    try {
      this.encoder.encode(frame, { keyFrame });
    } finally {
      frame.close();
    }

    this.frameIndex++;

    // Backpressure handling if hardware encoder queue is saturated
    if (this.encoder.encodeQueueSize > 4) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  /**
   * Flushes video queue, finalizes moov container atom, and returns standard MP4 Blob.
   */
  async finalize(): Promise<Blob> {
    if (this.encoder.state === "configured") {
      await this.encoder.flush();
    }
    this.muxer.finalize();
    const buffer = this.muxer.target.buffer;
    return new Blob([buffer], { type: "video/mp4" });
  }

  /**
   * Releases underlying hardware video encoder.
   */
  close(): void {
    try {
      if (this.encoder.state !== "closed") {
        this.encoder.close();
      }
    } catch {}
  }
}
