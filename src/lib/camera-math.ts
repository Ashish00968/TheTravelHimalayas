import type { Expression } from "mapbox-gl";

/**
 * Discover Himalayan Trails — Cartographic Camera & Physics Engine
 * 
 * Provides robust mathematical utilities for 3D terrain flyovers,
 * preventing near-plane DEM mountain clipping, switchback snapping,
 * 360° reverse barrel spins, and WebGL line-gradient shader crashes.
 */

/**
 * Calculates the shortest signed angular difference between two bearings in degrees.
 * Guaranteed to return a value in the range [-180, 180].
 */
export function shortestAngleDiff(targetBearing: number, currentBearing: number): number {
  return ((targetBearing - currentBearing + 540) % 360) - 180;
}

/**
 * Smoothly interpolates from current bearing towards target bearing along
 * the shortest angular arc, wrapping properly across 0° / 360°.
 *
 * @param currentBearing Current camera bearing in degrees
 * @param targetBearing Target camera bearing in degrees
 * @param factor Smoothing factor between 0 (no movement) and 1 (instant snap). Default 0.08
 * @returns Normalized new bearing in degrees [0, 360)
 */
/**
 * Smoothly interpolates from current bearing towards target bearing along
 * the shortest angular arc, wrapping properly across 0° / 360°.
 *
 * @param currentBearing Current camera bearing in degrees
 * @param targetBearing Target camera bearing in degrees
 * @param factor Smoothing factor between 0 (no movement) and 1 (instant snap). Default 0.08
 * @returns Normalized new bearing in degrees [0, 360)
 */
export function interpolateBearing(
  currentBearing: number,
  targetBearing: number,
  factor = 0.08
): number {
  const diff = shortestAngleDiff(targetBearing, currentBearing);
  const next = currentBearing + diff * Math.max(0, Math.min(1, factor));
  return ((next % 360) + 360) % 360;
}

/**
 * Rate-limited bearing lerp with maximum turn velocity clamping.
 * Strictly prevents snappy rotational jerks and camera shaking on alpine switchbacks.
 *
 * @param currentBearing Current camera bearing in degrees [0, 360)
 * @param targetBearing Target bearing in degrees [0, 360)
 * @param smoothingFactor Exponential smoothing factor (default 0.05)
 * @param maxDegreesPerFrame Maximum angular rotation per frame in degrees (default 0.65°)
 */
export function rateLimitedBearingLerp(
  currentBearing: number,
  targetBearing: number,
  smoothingFactor = 0.05,
  maxDegreesPerFrame = 0.65
): number {
  const diff = shortestAngleDiff(targetBearing, currentBearing);
  let step = diff * Math.max(0, Math.min(1, smoothingFactor));
  if (Math.abs(step) > maxDegreesPerFrame) {
    step = Math.sign(step) * maxDegreesPerFrame;
  }
  const next = currentBearing + step;
  return ((next % 360) + 360) % 360;
}

/**
 * Computes great-circle distance between two coordinates in kilometers using Haversine formula.
 */
export function haversineDistanceKm(
  lng1: number,
  lat1: number,
  lng2: number,
  lat2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Computes forward azimuth/bearing in degrees [0, 360) from coordinate 1 to coordinate 2.
 */
export function calculateBearing(
  lng1: number,
  lat1: number,
  lng2: number,
  lat2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return ((θ * 180) / Math.PI + 360) % 360;
}

/**
 * Computes a continuously interpolated 3D coordinate along the trail line at target distance.
 */
export function getInterpolatedPoint(
  coordinates: [number, number, number][],
  cumDistances: number[],
  targetDistKm: number
): [number, number, number] {
  if (coordinates.length === 0) return [0, 0, 0];
  if (coordinates.length === 1) return coordinates[0];

  const totalDist = cumDistances[cumDistances.length - 1];
  const clampedDist = Math.max(0, Math.min(totalDist, targetDistKm));

  let idx = 0;
  while (idx < cumDistances.length - 1 && cumDistances[idx + 1] <= clampedDist) {
    idx++;
  }

  const p1 = coordinates[idx];
  const p2 = coordinates[Math.min(idx + 1, coordinates.length - 1)];

  const segDist1 = cumDistances[idx];
  const segDist2 = cumDistances[Math.min(idx + 1, cumDistances.length - 1)];
  const segLen = segDist2 - segDist1;
  const t = segLen > 0 ? (clampedDist - segDist1) / segLen : 0;

  return [
    p1[0] + (p2[0] - p1[0]) * t,
    p1[1] + (p2[1] - p1[1]) * t,
    Math.round(p1[2] + (p2[2] - p1[2]) * t),
  ];
}

/**
 * Computes a strictly continuous smoothed macro valley bearing using continuous interpolation.
 * Completely eliminates discrete index hopping and switchback shudder.
 *
 * @param coordinates Full array of [lng, lat, eleM] trail coordinates
 * @param cumDistances Precomputed cumulative distance array in kilometers
 * @param currentDistKm Current position along route in kilometers
 * @param lookAheadKm Look-ahead distance in kilometers (default 0.075 km / 75m, matching Strava standard)
 * @param apexKm Optional trail summit / apex distance. When ascending, caps lookahead to summit.
 */
export function computeMacroBearing(
  coordinates: [number, number, number][],
  cumDistances: number[],
  currentDistKm: number,
  lookAheadKm = 0.075,
  apexKm?: number
): number {
  if (coordinates.length < 2) return 0;
  const totalDist = cumDistances[cumDistances.length - 1];
  const pCurrent = getInterpolatedPoint(coordinates, cumDistances, currentDistKm);

  // If near the very end of the trail, calculate bearing from a point slightly behind
  if (currentDistKm >= totalDist - 0.04) {
    const pBehind = getInterpolatedPoint(
      coordinates,
      cumDistances,
      Math.max(0, totalDist - 0.25)
    );
    return calculateBearing(pBehind[0], pBehind[1], pCurrent[0], pCurrent[1]);
  }

  let aheadDist = currentDistKm + lookAheadKm;
  // If ascending towards an apex/summit, avoid overshooting the summit into descent
  if (apexKm && currentDistKm < apexKm) {
    aheadDist = Math.min(apexKm, aheadDist);
    // If very close to apex (<50m), look directly at apex
    if (aheadDist - currentDistKm < 0.05) {
      aheadDist = apexKm;
    }
  } else {
    aheadDist = Math.min(totalDist, aheadDist);
  }

  const pAhead = getInterpolatedPoint(coordinates, cumDistances, aheadDist);
  return calculateBearing(pCurrent[0], pCurrent[1], pAhead[0], pAhead[1]);
}

/**
 * Calculates adaptive camera pitch based on local slope gradient to prevent
 * near-plane DEM terrain penetration and claustrophobic mountain wall collisions.
 *
 * - Valley / gentle terrain (gradient -12% to +8%): Maintains base pitch (48°)
 * - Steep mountain wall / moraine ascent (gradient > 8%): Dampens pitch down to 38°–42°
 *   elevating the camera eye position above the slope so the summit and sky remain visible.
 * - Steep descent (gradient < -12%): Dampens pitch down to 40°–42° so the camera
 *   does not plunge face-first into the canyon floor.
 *
 * @param currentElevationM Current elevation in meters
 * @param aheadElevationM Elevation at lookahead point in meters
 * @param distanceMeters Distance to lookahead point in meters
 * @param basePitch Desired default pitch in degrees (default 48°)
 * @param minPitch Minimum allowed pitch on extreme slopes (default 38°)
 */
export function computeAdaptivePitch(
  currentElevationM: number,
  aheadElevationM: number,
  distanceMeters: number,
  basePitch = 48,
  minPitch = 38
): number {
  const safeDist = Math.max(30, distanceMeters);
  const deltaElev = aheadElevationM - currentElevationM;
  const gradientPct = (deltaElev / safeDist) * 100;

  // Steep descent (canyon plunge prevention)
  if (gradientPct < -12) {
    const t = Math.max(0, Math.min(1, (-gradientPct - 12) / 28));
    const pitch = basePitch - t * (basePitch - minPitch);
    return Math.round(pitch * 10) / 10;
  }

  // Gentle slope
  if (gradientPct <= 8) {
    return basePitch;
  }

  // Steep ascent (mountain face collision prevention)
  const t = Math.max(0, Math.min(1, (gradientPct - 8) / 27));
  const pitch = basePitch - t * (basePitch - minPitch);
  return Math.round(pitch * 10) / 10;
}

/**
 * Computes destination coordinate given a starting coordinate, bearing in degrees, and distance in meters.
 */
export function computeOffsetPoint(
  lng: number,
  lat: number,
  bearingDeg: number,
  distanceMeters: number
): [number, number] {
  const R = 6378137; // Earth radius in meters
  const δ = distanceMeters / R;
  const θ = (bearingDeg * Math.PI) / 180;
  const φ1 = (lat * Math.PI) / 180;
  const λ1 = (lng * Math.PI) / 180;

  const sinφ2 = Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ);
  const φ2 = Math.asin(sinφ2);
  const y = Math.sin(θ) * Math.sin(δ) * Math.cos(φ1);
  const x = Math.cos(δ) - Math.sin(φ1) * sinφ2;
  const λ2 = λ1 + Math.atan2(y, x);

  return [((λ2 * 180) / Math.PI + 540) % 360 - 180, (φ2 * 180) / Math.PI];
}

/**
 * Strava-Grade 3D Chase Camera Math:
 * Direct 1:1 match with Strava / FATMAP 3D activity flyovers.
 * Centers the camera directly on the hiker [hikerLng, hikerLat] with
 * high-horizon 68° pitch and 15.2 zoom, placing the hiker in the
 * lower-middle foreground while the majestic mountain skyline towers ahead.
 *
 * @param hikerLng Current hiker longitude
 * @param hikerLat Current hiker latitude
 * @param bearing Current movement bearing in degrees
 * @param gradientPct Current trail grade percentage
 */
export function computeStravaChaseCamera(
  hikerLng: number,
  hikerLat: number,
  bearing: number,
  gradientPct = 0
): {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
} {
  const clampedGrade = Math.max(-25, Math.min(35, gradientPct));
  
  // Base pitch: 68° (Strava standard). On steep climbs (>12%), gently dampens down
  // to 62° to prevent the mountain cliff face from overwhelming the top frame.
  let pitch = 68;
  if (clampedGrade > 12) {
    const t = Math.min(1, (clampedGrade - 12) / 20);
    pitch = 68 - t * 6; // 68° down to 62°
  } else if (clampedGrade < -15) {
    const t = Math.min(1, (-clampedGrade - 15) / 20);
    pitch = 68 - t * 4; // 68° down to 64° on steep descent
  }

  // Zoom: 15.2 gives high-detail 3D terrain immersion and intimate ground feeling
  const zoom = 15.2;

  return {
    center: [hikerLng, hikerLat],
    zoom,
    pitch: Math.round(pitch * 10) / 10,
    bearing,
  };
}

/**
 * Computes safe, strictly ascending stops for Mapbox GL `line-gradient` expressions.
 * Mapbox requires `stop[i] < stop[i+1]` strictly. Colliding or equal stops crash WebGL.
 *
 * @param progress Active trail progress from 0.0 to 1.0
 * @param activeColor Hex or rgba color of the revealed trail segment
 * @param futureColor Hex or rgba color of the unrevealed trail segment
 */
export function computeSafeGradientStops(
  progress: number,
  activeColor = "#00E5FF",
  futureColor = "rgba(0, 229, 255, 0.2)"
): Expression {
  const clamped = Math.max(0, Math.min(1, progress));

  if (clamped >= 0.998) {
    // Fully revealed route
    return [
      "interpolate",
      ["linear"],
      ["line-progress"],
      0,
      activeColor,
      1,
      activeColor,
    ] as Expression;
  }

  const s1 = Math.max(0.001, Math.min(0.994, clamped));
  const s2 = Math.min(0.998, s1 + 0.004);

  return [
    "interpolate",
    ["linear"],
    ["line-progress"],
    0,
    activeColor,
    s1,
    activeColor,
    s2,
    futureColor,
    1,
    futureColor,
  ] as Expression;
}

/**
 * Natural cubic ease-out curve for deceleration animations.
 */
export function cubicEaseOut(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 3);
}
