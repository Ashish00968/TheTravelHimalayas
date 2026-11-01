/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  HIMALAYAN ALPINE DIFFICULTY INDEX (HADI) ENGINE
 *  Discover Himalayan Trails — Proprietary Alpine Grading Standard
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * An objective, mathematical difficulty evaluation model formulated specifically
 * for the extreme geography of the Indian Himalayas.
 *
 * HADI decouples and quantifies four distinct physical and environmental dimensions:
 *   1. Physical Endurance Demand (Base Effort): Horizontal distance (km) and
 *      vertical ascent work (gain / 100 * 1.8).
 *   2. Atmospheric Altitude Hypoxia Exposure (Φ_alt): Non-linear multiplier scaling
 *      with barometric pressure decline and arterial oxygen desaturation from
 *      the physiological onset of hypoxia (~2,500m) up to extreme high altitude.
 *   3. Technical Terrain Demand (τ): Moraine scree, talus, hard snow, and glacial ice.
 *   4. Objective Alpine Hazard & Exposure Gate: High cols (>=4,800m) and arête exposure.
 *
 * Mathematical Formula:
 *   HADI = [ Distance(km) + (ElevationGain(m) / 100 * 1.8) ] * Φ_alt + τ
 *
 * Where:
 *   Φ_alt (Altitude Hypoxia Multiplier):
 *     - < 2,500m:      1.00x (Normobaric baseline; full atmospheric pressure ~100% effective O₂)
 *     - 2,500m–3,500m: 1.15x (Hypoxia onset & initial AMS threshold; effective O₂ ~75%)
 *     - 3,500m–4,500m: 1.35x (High-altitude hypoxia; aerobic capacity curtailed ~30%; effective O₂ ~63%)
 *     - 4,500m–5,500m: 1.55x (Severe high-altitude hypoxia; acute HAPE/HACE danger zone; effective O₂ ~53%)
 *     - > 5,500m:      1.75x (Extreme altitude / death zone approach; effective O₂ <48%)
 *
 *   τ (Technical Terrain Penalty):
 *     - trail:         +0  (Well-defined forest or meadow footpath)
 *     - moraine:       +3  (Unstable granite boulder scree, loose moraine, dry gully)
 *     - snow-glacier:  +6  (Hard-pack snow, crevassed ice, crampons/axe required)
 *     - exposed-ridge: +10 (Knife-edge arête, class 3/4 scrambling, fixed rope assist)
 *
 * HADI Grade Calibration:
 *   - 0  to 25:  Grade 1 (Gentle Valley / Beginner Alpine)
 *   - 26 to 55:  Grade 2 (Moderate Ridge / Established Alpine Trek)
 *   - 56 to 139: Grade 3 (Challenging High-Pass / Classic Multi-Day Alpine)
 *   - 140+ with altitude >= 4,800m or technical terrain (snow-glacier/exposed-ridge):
 *                Grade 4 (Formidable Alpine / Expedition Grade)
 *
 * Grade 4 Gate (Extreme Alpine Exposure / Technical Terrain):
 *   Hypoxia onset begins clinically at 2,500m, but Grade 4 is strictly reserved for
 *   routes entering the extreme alpine zone crossing passes at or above 4,800m (where
 *   atmospheric pressure drops below 55% of sea level and acclimatization demands peak)
 *   or traversing technical glacial / knife-edge terrain.
 *   High-endurance multi-day treks below 4,800m on non-technical trails (e.g. Kashmir
 *   Great Lakes at 4,190m max, scoring 159; Pindari Glacier at 3,860m) are calibrated
 *   as Grade 3 Classic Multi-Day routes.
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
  gradeGateReason?: string;
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

  // Grade 4 gate: Strictly reserved for passes above ~4,800m or technical terrain
  const isGrade4Eligible = alt >= 4800 || terrain === "snow-glacier" || terrain === "exposed-ridge";

  let grade: HadiGrade;
  let gradeTitle: string;
  let description: string;
  let badgeColor: string;
  let badgeBg: string;
  let gradeGateReason: string | undefined = undefined;

  if (score <= 25) {
    grade = "Grade 1";
    gradeTitle = "Gentle Valley • Beginner Alpine";
    description = "Accessible walking trail with mild elevation change and low altitude risk. Suitable for beginner hikers and families.";
    badgeColor = "#10B981"; // Emerald
    badgeBg = "rgba(16, 185, 129, 0.12)";
  } else if (score <= 55) {
    grade = "Grade 2";
    gradeTitle = "Moderate Ridge • Established Trek";
    description = "Sustained climbing on clear mountain trails. Moderate aerobic demand requiring baseline fitness and altitude awareness.";
    badgeColor = "#3B82F6"; // Glacier Blue
    badgeBg = "rgba(59, 130, 246, 0.12)";
  } else if (!isGrade4Eligible || score < 140) {
    grade = "Grade 3";
    gradeTitle = "Challenging High-Pass • Classic Multi-Day";
    description = "Demanding alpine route crossing high valleys, sustained moraines, or passes up to 4,800m. Prior trekking experience essential.";
    badgeColor = "#F59E0B"; // Amber
    badgeBg = "rgba(245, 158, 11, 0.12)";
    if (score >= 140 && !isGrade4Eligible) {
      gradeGateReason = `High aerobic endurance demand (Score: ${score}), calibrated as Grade 3 Classic Multi-Day because all pass crests remain below 4,800m on established non-technical trails without extreme alpine exposure or glacial hazards.`;
    }
  } else {
    grade = "Grade 4";
    gradeTitle = "Formidable Alpine • Expedition Grade";
    description = "Extreme high-altitude traversal exceeding 4,800m with technical terrain, glacial crossings, or severe exposure. Mountaineering acumen required.";
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
    gradeGateReason,
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
  } else if (maxAltitudeM >= 4800) {
    gainM = Math.max(1200, maxAltitudeM - 2600);
    terrain = "moraine";
  } else if (maxAltitudeM >= 4000) {
    gainM = Math.max(800, maxAltitudeM - 2600);
    terrain = "moraine";
  } else if (maxAltitudeM >= 3000) {
    gainM = Math.max(500, maxAltitudeM - 2400);
    terrain = "trail";
  } else {
    gainM = Math.max(150, Math.round(distanceKm * 35));
    terrain = "trail";
  }

  return calculateHadi(distanceKm, gainM, maxAltitudeM, terrain);
}
