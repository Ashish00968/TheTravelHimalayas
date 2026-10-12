/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  HIMALAYAN ALPINE DIFFICULTY INDEX (HADI) ENGINE
 *  Discover Himalayan Trails — Proprietary Alpine Grading Standard
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * An objective, mathematical difficulty evaluation model formulated specifically
 * for the extreme geography of the Indian Himalayas.
 *
 * Unlike generic Western rating systems (like AllTrails or Yosemite Decimal)
 * that treat a 15 km sea-level hike the same as a 15 km hike at 4,000 meters,
 * HADI mathematically accounts for:
 *   1. Horizontal Distance (km)
 *   2. Cumulative Vertical Elevation Gain (meters)
 *   3. Non-linear Barometric Altitude Hypoxia Multiplier (Φ_alt)
 *   4. Technical Terrain & Moraine Penalty Modifier (τ)
 *
 * Mathematical Formula:
 *   HADI = [ Distance(km) + (ElevationGain(m) / 100 * 1.8) ] * Φ_alt + τ
 *
 * Where:
 *   Φ_alt (Altitude Hypoxia Multiplier):
 *     - < 2,500m:      1.00x (Full atmospheric pressure ~100% effective O₂)
 *     - 2,500m–3,500m: 1.15x (Mild hypoxia onset, AMS threshold ~75% O₂)
 *     - 3,500m–4,500m: 1.35x (Severe hypoxia, reduced aerobic capacity ~63% O₂)
 *     - 4,500m–5,500m: 1.55x (Extreme hypoxia, critical HAPE/HACE zone ~53% O₂)
 *     - > 5,500m:      1.75x (Death zone approach, mountaineering scale <48% O₂)
 *
 *   τ (Technical Terrain Penalty):
 *     - trail:         +0  (Well-defined forest or meadow footpath)
 *     - moraine:       +3  (Unstable granite boulder scree, loose moraine, dry gully)
 *     - snow-glacier:  +6  (Hard-pack snow, crevassed ice, crampons/axe required)
 *     - exposed-ridge: +10 (Knife-edge arête, class 3/4 scrambling, fixed rope assist)
 *
 * HADI Grade Calibration:
 *   - 0  to 25: Grade 1 (Gentle Valley / Beginner Alpine)
 *   - 26 to 45: Grade 2 (Moderate Ridge / Established Alpine Trek)
 *   - 46 to 70: Grade 3 (Challenging High-Pass / Strenuous Alpine Summit)
 *   - 71+:      Grade 4 (Formidable Alpine / Expedition Grade)
 */

export type TerrainType = "trail" | "moraine" | "snow-glacier" | "exposed-ridge";

export type HadiGrade = "Grade 1" | "Grade 2" | "Grade 3" | "Grade 4";

export interface HadiResult {
  score: number;
  grade: HadiGrade;
  gradeTitle: string;
  altitudeMultiplier: number;
  terrainPenalty: number;
  baseEffort: number;
  description: string;
  badgeColor: string;
  badgeBg: string;
  amsWarning: boolean;
  extremeHypoxia: boolean;
}

/**
 * Calculates the altitude hypoxia multiplier based on summit/peak altitude.
 */
export function getAltitudeMultiplier(maxAltitudeM: number): number {
  if (maxAltitudeM < 2500) return 1.0;
  if (maxAltitudeM < 3500) return 1.15;
  if (maxAltitudeM < 4500) return 1.35;
  if (maxAltitudeM < 5500) return 1.55;
  return 1.75;
}

/**
 * Returns the technical terrain penalty modifier.
 */
export function getTerrainPenalty(terrain: TerrainType): number {
  switch (terrain) {
    case "trail":
      return 0;
    case "moraine":
      return 3;
    case "snow-glacier":
      return 6;
    case "exposed-ridge":
      return 10;
    default:
      return 0;
  }
}

/**
 * Core HADI Calculation Function
 */
export function calculateHadi(
  distanceKm: number,
  gainM: number,
  maxAltitudeM: number,
  terrain: TerrainType = "trail"
): HadiResult {
  const dist = Math.max(0.5, distanceKm);
  const gain = Math.max(0, gainM);
  const alt = Math.max(1000, maxAltitudeM);

  const gainFactor = (gain / 100) * 1.8;
  const baseEffort = dist + gainFactor;
  const altMultiplier = getAltitudeMultiplier(alt);
  const terrainPenalty = getTerrainPenalty(terrain);

  const rawScore = baseEffort * altMultiplier + terrainPenalty;
  const score = Math.round(rawScore * 10) / 10;

  let grade: HadiGrade;
  let gradeTitle: string;
  let description: string;
  let badgeColor: string;
  let badgeBg: string;

  if (score <= 25) {
    grade = "Grade 1";
    gradeTitle = "Gentle Valley • Beginner Alpine";
    description = "Accessible walking trail with mild elevation change and low altitude risk. Suitable for beginner hikers and families.";
    badgeColor = "#10B981"; // Emerald
    badgeBg = "rgba(16, 185, 129, 0.12)";
  } else if (score <= 45) {
    grade = "Grade 2";
    gradeTitle = "Moderate Ridge • Established Trek";
    description = "Sustained climbing on clear mountain trails. Moderate aerobic demand requiring baseline fitness and altitude awareness.";
    badgeColor = "#3B82F6"; // Glacier Blue
    badgeBg = "rgba(59, 130, 246, 0.12)";
  } else if (score <= 70) {
    grade = "Grade 3";
    gradeTitle = "Challenging High-Pass • Strenuous";
    description = "Demanding alpine route crossing high moraines, steep passes, or summit ridges above 4,000m. Prior trekking experience essential.";
    badgeColor = "#F59E0B"; // Amber
    badgeBg = "rgba(245, 158, 11, 0.12)";
  } else {
    grade = "Grade 4";
    gradeTitle = "Formidable Alpine • Expedition Grade";
    description = "Extreme high-altitude traversal exceeding 4,500m with technical terrain, glacial crossings, or severe exposure. Mountaineering acumen required.";
    badgeColor = "#EF4444"; // Rose/Red
    badgeBg = "rgba(239, 68, 68, 0.12)";
  }

  return {
    score: Math.round(score),
    grade,
    gradeTitle,
    altitudeMultiplier: altMultiplier,
    terrainPenalty,
    baseEffort: Math.round(baseEffort * 10) / 10,
    description,
    badgeColor,
    badgeBg,
    amsWarning: alt >= 3000,
    extremeHypoxia: alt >= 4500,
  };
}

/**
 * Helper to parse natural language trek strings and compute HADI automatically.
 */
export function parseAndComputeHadi(
  distanceStr: string,
  altitudeStr: string,
  fallbackDifficulty?: string,
  isPatalsu?: boolean
): HadiResult {
  // Parse distance (e.g. "15.5 km round-trip" -> 15.5)
  const distMatch = distanceStr.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  const distanceKm = distMatch ? parseFloat(distMatch[1]) : 12;

  // Parse altitude (e.g. "3,700 m" -> 3700)
  const altMatch = altitudeStr.replace(/,/g, "").match(/\d+/);
  const maxAltitudeM = altMatch ? parseInt(altMatch[0], 10) : 3200;

  // Infer elevation gain if not directly provided
  let gainM: number;
  let terrain: TerrainType = "trail";

  if (isPatalsu) {
    gainM = 1685;
    terrain = "moraine";
  } else if (maxAltitudeM >= 4200) {
    gainM = Math.max(800, maxAltitudeM - 2600);
    terrain = "moraine";
  } else if (maxAltitudeM >= 3500) {
    gainM = Math.max(600, maxAltitudeM - 2800);
    terrain = "moraine";
  } else {
    gainM = Math.max(200, Math.round(distanceKm * 40));
    terrain = "trail";
  }

  return calculateHadi(distanceKm, gainM, maxAltitudeM, terrain);
}
