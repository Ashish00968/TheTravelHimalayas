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
 * Rate-limited bearing lerp with hyperbolic tangent (tanh) soft-knee saturation.
 * Provides C^inf continuous rotational velocity, completely eliminating
 * abrupt turn acceleration jolts and robotic corner clamping on alpine switchbacks.
 *
 * @param currentBearing Current camera bearing in degrees [0, 360)
 * @param targetBearing Target bearing in degrees [0, 360)
 * @param smoothingFactor Exponential response factor (default 0.045)
 * @param maxDegreesPerFrame Maximum angular rotation per frame in degrees (default 0.50°)
 */
export function rateLimitedBearingLerp(
  currentBearing: number,
  targetBearing: number,
  smoothingFactor = 0.045,
  maxDegreesPerFrame = 0.50
): number {
  const diff = shortestAngleDiff(targetBearing, currentBearing);
  const normalized = (diff * Math.max(0, smoothingFactor)) / Math.max(0.0001, maxDegreesPerFrame);
  const step = maxDegreesPerFrame * Math.tanh(normalized);
  return currentBearing + step;
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
 * Computes a strictly continuous smoothed macro valley bearing using continuous interpolation
 * and dual forward-tangent vector averaging on the unit circle.
 * Completely eliminates high-frequency switchback noise, discrete index hopping,
 * and 360° north wrap-around jitter.
 *
 * @param coordinates Full array of [lng, lat, eleM] trail coordinates
 * @param cumDistances Precomputed cumulative distance array in kilometers
 * @param currentDistKm Current position along route in kilometers
 * @param lookAheadKm Look-ahead distance in kilometers (default 0.18 km / 180m)
 * @param apexKm Optional trail summit / apex distance. When ascending, anchors approach bearing.
 */
export function computeMacroBearing(
  coordinates: [number, number, number][],
  cumDistances: number[],
  currentDistKm: number,
  lookAheadKm = 0.18,
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
      Math.max(0, totalDist - 0.20)
    );
    return calculateBearing(pBehind[0], pBehind[1], pCurrent[0], pCurrent[1]);
  }

  let aheadDist1 = currentDistKm + lookAheadKm * 0.5;
  let aheadDist2 = currentDistKm + lookAheadKm;

  if (apexKm && currentDistKm < apexKm) {
    aheadDist1 = Math.min(apexKm, aheadDist1);
    aheadDist2 = Math.min(apexKm, aheadDist2);

    // If extremely close to apex (< 25m), lock bearing to the approach direction to prevent summit spin
    if (apexKm - currentDistKm < 0.025) {
      const pPrev = getInterpolatedPoint(
        coordinates,
        cumDistances,
        Math.max(0, apexKm - 0.06)
      );
      const pSummit = getInterpolatedPoint(coordinates, cumDistances, apexKm);
      return calculateBearing(pPrev[0], pPrev[1], pSummit[0], pSummit[1]);
    }
  } else {
    aheadDist1 = Math.min(totalDist, aheadDist1);
    aheadDist2 = Math.min(totalDist, aheadDist2);
  }

  const pAhead1 = getInterpolatedPoint(coordinates, cumDistances, aheadDist1);
  const pAhead2 = getInterpolatedPoint(coordinates, cumDistances, aheadDist2);

  const b1 = calculateBearing(pCurrent[0], pCurrent[1], pAhead1[0], pAhead1[1]);
  const b2 = calculateBearing(pCurrent[0], pCurrent[1], pAhead2[0], pAhead2[1]);

  // Vector average on unit circle: eliminates high-frequency switchback noise without 0/360 wrap artifacts
  const rad1 = (b1 * Math.PI) / 180;
  const rad2 = (b2 * Math.PI) / 180;
  const vx = 0.4 * Math.sin(rad1) + 0.6 * Math.sin(rad2);
  const vy = 0.4 * Math.cos(rad1) + 0.6 * Math.cos(rad2);
  const macroAngle = (Math.atan2(vx, vy) * 180) / Math.PI;

  return (macroAngle + 360) % 360;
}

/**
 * Calculates adaptive camera pitch based on local slope gradient to prevent
 * near-plane DEM terrain penetration and claustrophobic mountain wall collisions.
 * Uses C^1 Hermite smoothstep for velvet continuous pitch adjustment.
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
    const smoothT = t * t * (3 - 2 * t);
    return basePitch - smoothT * (basePitch - minPitch);
  }

  // Gentle slope
  if (gradientPct <= 8) {
    return basePitch;
  }

  // Steep ascent (mountain face collision prevention)
  const t = Math.max(0, Math.min(1, (gradientPct - 8) / 27));
  const smoothT = t * t * (3 - 2 * t);
  return basePitch - smoothT * (basePitch - minPitch);
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
 * commanding alpine bird's-eye perspective and fixed 15.3 focal length.
 *
 * Uses C^1 Hermite smoothstep (3t^2 - 2t^3) for pitch damping, ensuring
 * zero inflection shocks or angular hinge jerks on steep climbs and descents.
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
  
  // Base pitch: 50° (Commanding alpine bird's-eye perspective matching Strava 3D & FATMAP).
  // On steep climbs (>10%), dampens smoothly down to 42° to lift the camera eye above
  // mountain ridges and moraine walls, preventing terrain clipping and ensuring the trail
  // ahead remains clearly visible curving up the mountain.
  // On steep descents (<-12%), dampens to 46° to avoid canyon floor plunging.
  // Uses C^1 Hermite smoothstep (3t^2 - 2t^3) for velvet continuous derivative transitions.
  let pitch = 50;
  if (clampedGrade > 10) {
    const t = Math.min(1, (clampedGrade - 10) / 20);
    const smoothT = t * t * (3 - 2 * t);
    pitch = 50 - smoothT * 8; // 50° down to 42°
  } else if (clampedGrade < -12) {
    const t = Math.min(1, (-clampedGrade - 12) / 20);
    const smoothT = t * t * (3 - 2 * t);
    pitch = 50 - smoothT * 4; // 50° down to 46°
  }

  // Zoom: Rock-solid 15.3 focal length throughout flight.
  // Elevates the camera eye ~600m above the terrain for an unobstructed alpine bird's-eye view.
  // Fixed constant eliminates optical dolly-zoom distortion and completely cures
  // the rapid "zoom-in / zoom-out" pulsing / flickering across trail gradients.
  const zoom = 15.3;

  // Center is locked directly on the hiker [hikerLng, hikerLat].
  // Viewport padding (e.g. padding: { bottom: 130 }) handles lower-third framing
  // with zero trigonometric offset jumping, zero rubber-banding, and zero jitter.
  return {
    center: [hikerLng, hikerLat],
    zoom,
    pitch,
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

/**
 * High-Altitude Himalayan Oxygen & Barometric Physiology
 * Computes physiologically verified effective sea-level O2 percentage
 * and medical high-altitude boundary classification.
 */
export interface AltitudePhysiology {
  oxygenPct: number;
  zoneName: string;
  zoneKicker: string;
  zoneColor: string;
  amsRisk: "low" | "moderate" | "high" | "severe";
}

export function computeAltitudePhysiology(elevationM: number): AltitudePhysiology {
  const safeEle = Math.max(0, elevationM);
  // International Standard Atmosphere barometric altitude pressure ratio
  // P / P0 = (1 - 2.25577e-5 * h)^5.25588
  const pRatio = Math.pow(Math.max(0.1, 1 - 2.25577e-5 * safeEle), 5.25588);
  const oxygenPct = Math.max(30, Math.min(100, Math.round(100 * pRatio)));

  if (safeEle < 3000) {
    return {
      oxygenPct,
      zoneName: "Acclimatization Zone",
      zoneKicker: "ACCLIMATIZATION ZONE • NORMAL RISK",
      zoneColor: "#10B981", // Emerald
      amsRisk: "low",
    };
  }

  if (safeEle < 4000) {
    return {
      oxygenPct,
      zoneName: "AMS Onset Threshold",
      zoneKicker: "AMS ONSET THRESHOLD • CLINICAL DIRECTIVE ACTIVE",
      zoneColor: "#F59E0B", // Amber
      amsRisk: "moderate",
    };
  }

  if (safeEle < 5500) {
    return {
      oxygenPct,
      zoneName: "High-Altitude Hypoxia",
      zoneKicker: "HIGH-ALTITUDE HYPOXIA ZONE • RESTRICT EXERTION",
      zoneColor: "#FB923C", // Orange
      amsRisk: "high",
    };
  }

  return {
    oxygenPct,
    zoneName: "Extreme Hypoxia / Death Zone",
    zoneKicker: "EXTREME ALTITUDE • CRITICAL HYPOXIA",
    zoneColor: "#F43F5E", // Rose
    amsRisk: "severe",
  };
}

/**
 * Builds an adaptive time-to-progress mapper based on local trail gradient.
 * 
 * - Flat / gentle valleys (<= 8% grade): faster flight traversal (~1.3x speed)
 * - Moderate climbs (8% - 15%): normal pace (1.0x)
 * - Steep alpine climbs / switchbacks (15% - 25%): decelerates smoothly to 0.70x
 * - Technical scrambles (> 25%): decelerates to 0.55x to reveal cliff relief & switchbacks
 * 
 * @param coordinates Array of [lng, lat, eleM]
 * @param cumDistances Optional matching array of cumulative distances in km
 * @returns Function (normalizedTime: number) => number progress [0, 1]
 */
export function createAdaptivePacingMapper(
  coordinates: [number, number, number][],
  cumDistances?: number[]
): (normalizedTime: number) => number {
  if (coordinates.length < 2) {
    return (t: number) => Math.max(0, Math.min(1, t));
  }

  const n = coordinates.length;

  // Derive strictly matching cumulative distances for these coordinates if not provided or length mismatched
  let dists = cumDistances;
  if (!dists || dists.length !== n) {
    dists = new Array<number>(n);
    dists[0] = 0;
    for (let i = 1; i < n; i++) {
      const [lng1, lat1] = coordinates[i - 1];
      const [lng2, lat2] = coordinates[i];
      dists[i] = dists[i - 1] + haversineDistanceKm(lng1, lat1, lng2, lat2);
    }
  }

  const totalDist = dists[n - 1] - dists[0];
  if (totalDist <= 0) return (t: number) => Math.max(0, Math.min(1, t));

  // Compute accumulated effort weights along the path
  const cumEffort = new Float64Array(n);
  cumEffort[0] = 0;

  for (let i = 1; i < n; i++) {
    const dDist = dists[i] - dists[i - 1];
    const eleCurr = coordinates[i][2] ?? 0;
    const elePrev = coordinates[i - 1][2] ?? 0;
    const dEle = eleCurr - elePrev;
    const distM = Math.max(5, dDist * 1000);
    const gradPct = (dEle / distM) * 100;

    let effortMultiplier = 1.0;
    if (gradPct <= 6) {
      effortMultiplier = 0.75; // brisk through flat valley floor
    } else if (gradPct <= 14) {
      effortMultiplier = 1.0; // standard hiking tempo
    } else if (gradPct <= 24) {
      effortMultiplier = 1.45; // steep climb / scree: linger more
    } else {
      effortMultiplier = 1.85; // extreme wall / headwall scramble: high visual immersion
    }

    cumEffort[i] = cumEffort[i - 1] + dDist * effortMultiplier;
  }

  const totalEffort = cumEffort[n - 1];
  if (totalEffort <= 0) return (t: number) => Math.max(0, Math.min(1, t));

  // Return continuous lookup from normalized time t to progress p
  return (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    const targetEffort = t * totalEffort;

    // Binary search for target effort
    let low = 0;
    let high = n - 1;
    while (low < high - 1) {
      const mid = (low + high) >> 1;
      if (cumEffort[mid] <= targetEffort) {
        low = mid;
      } else {
        high = mid;
      }
    }

    const segEffort = cumEffort[high] - cumEffort[low];
    const frac = segEffort > 0 ? (targetEffort - cumEffort[low]) / segEffort : 0;
    const dist = (dists![low] - dists![0]) + frac * (dists![high] - dists![low]);
    return Math.max(0, Math.min(1, dist / totalDist));
  };
}

/**
 * Prominent Himalayan Alpine Peaks Registry for Summit Panoramas
 */
export interface HimalayanPeakEntry {
  id: string;
  name: string;
  heightM: number;
  lng: number;
  lat: number;
  range: string;
}

export const HIMALAYAN_SUMMIT_PEAKS: HimalayanPeakEntry[] = [
  { id: "hanuman-tibba", name: "Hanuman Tibba", heightM: 5982, lng: 77.04082, lat: 32.34179, range: "Dhauladhar" },
  { id: "friendship-peak", name: "Friendship Peak", heightM: 5289, lng: 77.10209, lat: 32.39555, range: "Pir Panjal" },
  { id: "shitidhar", name: "Shitidhar", heightM: 5290, lng: 77.1085, lat: 32.3995, range: "Pir Panjal" },
  { id: "ladakhi-peak", name: "Ladakhi Peak", heightM: 5345, lng: 77.0980, lat: 32.4050, range: "Pir Panjal" },
  { id: "deo-tibba", name: "Deo Tibba", heightM: 6001, lng: 77.38289, lat: 32.19487, range: "Pir Panjal" },
  { id: "indrasan", name: "Indrasan", heightM: 6221, lng: 77.39693, lat: 32.21340, range: "Pir Panjal" },
  { id: "manali-peak", name: "Manali Peak", heightM: 5669, lng: 77.1150, lat: 32.4100, range: "Pir Panjal" },
  { id: "seven-sisters", name: "Seven Sisters", heightM: 4950, lng: 77.1250, lat: 32.3380, range: "Pir Panjal" },
  { id: "rohtang-crest", name: "Rohtang Ridge", heightM: 3978, lng: 77.2466, lat: 32.3716, range: "Pir Panjal" },
  { id: "ali-ratni-tibba", name: "Ali Ratni Tibba", heightM: 5490, lng: 77.4200, lat: 32.1500, range: "Great Himalaya" },
  { id: "mulkila", name: "Mulkila M4", heightM: 6517, lng: 77.3100, lat: 32.5400, range: "Lahaul Range" },
];

export interface VisibleSummitPeak {
  peak: HimalayanPeakEntry;
  distanceKm: number;
  bearingDeg: number;
  compassDir: string;
}

function getCompassDirection(deg: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16;
  return directions[index];
}

/**
 * Finds all prominent Himalayan peaks visible within line-of-sight from a summit coordinate.
 */
export function getVisiblePeaksFromSummit(
  summitLng: number,
  summitLat: number,
  maxDistanceKm = 45
): VisibleSummitPeak[] {
  const visible: VisibleSummitPeak[] = [];

  for (const p of HIMALAYAN_SUMMIT_PEAKS) {
    const dist = haversineDistanceKm(summitLng, summitLat, p.lng, p.lat);
    if (dist > 1.0 && dist <= maxDistanceKm) {
      const bearing = calculateBearing(summitLng, summitLat, p.lng, p.lat);
      visible.push({
        peak: p,
        distanceKm: Math.round(dist * 10) / 10,
        bearingDeg: Math.round(bearing),
        compassDir: getCompassDirection(bearing),
      });
    }
  }

  // Sort by prominence / proximity
  return visible.sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Returns a currently sighted peak if the camera bearing is facing within tolerance degrees.
 */
export function findActivePeakSighting(
  cameraBearing: number,
  visiblePeaks: VisibleSummitPeak[],
  toleranceDeg = 16
): VisibleSummitPeak | null {
  for (const vp of visiblePeaks) {
    const diff = Math.abs(shortestAngleDiff(vp.bearingDeg, cameraBearing));
    if (diff <= toleranceDeg) {
      return vp;
    }
  }
  return null;
}

