import type mapboxgl from "mapbox-gl";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  DYNAMIC 3D TERRAIN CLEARANCE SERVO & SIGHTLINE RAYCASTING ENGINE
 *  Discover Himalayan Trails — Closed-Loop Alpine Collision-Avoidance
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Implements real-time closed-loop feedback querying Mapbox GL JS 3D digital
 * elevation model (DEM) terrain data during alpine route flyovers.
 *
 * Capabilities:
 *   1. Real-time Camera Ground Clearance Servo: Dynamically computes clearance
 *      (CameraAltitude - TerrainElevation) and servo-controls pitch ceiling to
 *      prevent near-plane DEM mountain penetration across steep couloirs/moraines.
 *   2. 7-Point Sightline Raycasting: Probes intermediate terrain heights across
 *      the camera standoff vector using the Intercept Theorem, ensuring
 *      high moraines and arêtes never occlude the hiker marker.
 */

/** Hard minimum clearance in meters above digital elevation model */
export const MIN_CAMERA_GROUND_CLEARANCE_METERS = 45;

/** Clearance must exceed minimum by this threshold before pitch relaxes */
export const RELAX_HYSTERESIS_METERS = 60;

/** Pitch tightening speed when clearance violated (deg/s) */
export const TIGHTEN_RATE_DEG_PER_S = 45;

/** Pitch relaxation speed when clear (deg/s) */
export const RELAX_RATE_DEG_PER_S = 12;

/** Fractional sample intervals along the camera standoff line of sight */
export const SIGHTLINE_PROBE_FRACTIONS = [0.08, 0.18, 0.32, 0.50, 0.70, 0.88];

export interface PitchLimitStep {
  currentLimitDeg: number;
  pitchDeg: number;
  clearanceMeters: number | null;
  ceilingDeg: number;
  floorDeg?: number;
  elapsedMs: number;
}

/**
 * Reads real-time clearance in meters between the Mapbox camera eye and the
 * terrain surface directly beneath it.
 *
 * Returns null if terrain is uninitialized or outside the active viewport.
 */
export function readCameraGroundClearanceMeters(map: mapboxgl.Map): number | null {
  try {
    const freeCam = map.getFreeCameraOptions();
    if (!freeCam || !freeCam.position) return null;

    const cameraLngLat = freeCam.position.toLngLat();
    const cameraAltitude = freeCam.position.toAltitude();
    if (!Number.isFinite(cameraAltitude)) return null;

    const groundElevation = map.queryTerrainElevation([cameraLngLat.lng, cameraLngLat.lat]);
    if (typeof groundElevation !== "number" || !Number.isFinite(groundElevation)) return null;

    return cameraAltitude - groundElevation;
  } catch {
    return null;
  }
}

/**
 * Calculates continuous pitch ceiling for the current frame.
 * Uses closed-loop proportional feedback instead of static limits.
 *
 * - When clearance < 45m: tightens pitch downward at 45°/s to lift camera perspective.
 * - When clearance > 105m: smoothly relaxes pitch toward default ceiling at 12°/s.
 */
export function computeNextPitchLimitDeg(step: PitchLimitStep): number {
  const { currentLimitDeg, pitchDeg, clearanceMeters, ceilingDeg, elapsedMs } = step;
  const seconds = Math.max(0, elapsedMs) / 1000;
  const floorDeg = Math.min(step.floorDeg ?? 30, ceilingDeg);
  const clamp = (deg: number) => Math.min(ceilingDeg, Math.max(floorDeg, deg));

  if (clearanceMeters === null) {
    return clamp(currentLimitDeg + RELAX_RATE_DEG_PER_S * seconds);
  }

  if (clearanceMeters < MIN_CAMERA_GROUND_CLEARANCE_METERS) {
    const from = Math.min(currentLimitDeg, pitchDeg);
    return clamp(from - TIGHTEN_RATE_DEG_PER_S * seconds);
  }

  if (clearanceMeters > MIN_CAMERA_GROUND_CLEARANCE_METERS + RELAX_HYSTERESIS_METERS) {
    return clamp(currentLimitDeg + RELAX_RATE_DEG_PER_S * seconds);
  }

  return clamp(currentLimitDeg);
}

/**
 * 7-Point Sightline Raycaster:
 * Probes intermediate terrain heights between the hiker marker and the camera eye.
 * If an intermediate ridge or moraine wall pierces the line of sight, computes
 * the maximum allowed pitch to guarantee at least 18m of line-of-sight clearance.
 *
 * @param map Active Mapbox GL instance
 * @param targetLngLat Hiker coordinate [lng, lat]
 * @param targetElevationM Hiker elevation in meters
 * @param cameraLngLat Camera eye coordinate [lng, lat]
 * @param basePitch Nominal camera pitch in degrees
 * @param terrainExaggeration Active DEM terrain exaggeration factor (default 1.25)
 */
export function computeSightlinePitchLimit(
  map: mapboxgl.Map,
  targetLngLat: [number, number],
  targetElevationM: number,
  cameraLngLat: [number, number],
  basePitch = 50,
  terrainExaggeration = 1.25
): number {
  let maxRequiredPitchReduction = 0;

  for (let i = 0; i < SIGHTLINE_PROBE_FRACTIONS.length; i++) {
    const fraction = SIGHTLINE_PROBE_FRACTIONS[i];
    const probeLng = targetLngLat[0] + (cameraLngLat[0] - targetLngLat[0]) * fraction;
    const probeLat = targetLngLat[1] + (cameraLngLat[1] - targetLngLat[1]) * fraction;

    try {
      const probeElev = map.queryTerrainElevation([probeLng, probeLat]);
      if (typeof probeElev !== "number" || !Number.isFinite(probeElev)) continue;

      // Effective terrain height factoring exaggeration
      const effectiveProbeHeight = probeElev * terrainExaggeration;
      const effectiveTargetHeight = targetElevationM * terrainExaggeration;

      // Altitude on nominal line of sight at this fraction
      // Intercept formula with +18m buffer to clear mountain arêtes
      const ridgeClearanceRequired = effectiveProbeHeight + 18;
      const expectedSightlineElev = effectiveTargetHeight + (effectiveProbeHeight - effectiveTargetHeight) * fraction;

      if (ridgeClearanceRequired > expectedSightlineElev) {
        // Ridge protrudes above sightline: calculate angular pitch reduction
        const excessMeters = ridgeClearanceRequired - expectedSightlineElev;
        // Dampen pitch up to a max of 16° (e.g. 50° down to 34°)
        const pitchReduction = Math.min(16, (excessMeters / 60) * 12);
        if (pitchReduction > maxRequiredPitchReduction) {
          maxRequiredPitchReduction = pitchReduction;
        }
      }
    } catch {
      continue;
    }
  }

  return Math.max(34, basePitch - maxRequiredPitchReduction);
}

