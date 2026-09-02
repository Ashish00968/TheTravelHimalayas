import { Trek } from "@/data/types";

// ── Module-level regex constants (compiled once, not per call) ──────────────
const DIGIT_RE = /(\d+)/;
const COMMA_RE = /,/g;

export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "any";
export type FitnessLevel = "average" | "active" | "very_active" | "any";
export type DurationPref = "short" | "medium" | "long" | "any"; // short: 1-3, medium: 4-6, long: 7+
export type AltitudePref = "low" | "medium" | "high" | "extreme" | "any"; // low: <3000, med: 3000-4000, high: 4000-5000, extreme: >5000

export interface TrekPreferences {
  experience: ExperienceLevel;
  fitness: FitnessLevel;
  month: string; // "January", "any", etc.
  duration: DurationPref;
  region: string;
  maxAltitude: AltitudePref;
  budget: number | "any";
}

export interface TrekMatch {
  trek: Trek;
  score: number;
  reasons: string[];
}

/**
 * SCORING DESIGN
 * ─────────────────────────────────────────────────────────────────────────────
 * Max possible score: 100 points
 *
 * Weights:
 * - Experience Match (Difficulty & Altitude check): 20 points
 * - Fitness Match (Distance per day check):         20 points
 * - Month/Season Match:                             20 points
 * - Duration Match:                                 15 points
 * - Altitude Ceiling Match:                         15 points
 * - Region Match:                                   10 points
 */

export function parseDuration(durationStr: string): number {
  const match = DIGIT_RE.exec(durationStr);
  return match ? parseInt(match[0], 10) : 0;
}

export function parseAltitude(altStr: string): number {
  const clean = DIGIT_RE.exec(altStr.replace(COMMA_RE, ""));
  return clean ? parseInt(clean[0], 10) : 0;
}

export function parseDistance(distStr: string): number {
  const match = DIGIT_RE.exec(distStr);
  return match ? parseInt(match[0], 10) : 0;
}

export function scoreTrek(trek: Trek, prefs: TrekPreferences): TrekMatch {
  let score = 0;
  const reasons: string[] = [];

  const tDuration = parseDuration(trek.duration);
  const tAltitude = parseAltitude(trek.maxAltitude);
  const tDistance = parseDistance(trek.distance);
  const kmPerDay = tDuration > 0 ? tDistance / tDuration : 0;

  // 1. Experience Match (20 points)
  // NOTE: difficulty union in types.ts is "Easy" | "Moderate" | "Difficult" | "Challenging"
  if (prefs.experience !== "any") {
    if (
      prefs.experience === "beginner" &&
      (trek.difficulty === "Easy" || trek.difficulty === "Moderate") &&
      tAltitude <= 4000
    ) {
      score += 20;
      reasons.push("Perfect difficulty for beginners.");
    } else if (
      prefs.experience === "intermediate" &&
      (trek.difficulty === "Moderate" || trek.difficulty === "Difficult" || trek.difficulty === "Challenging")
    ) {
      score += 20;
      reasons.push("Matches intermediate experience level.");
    } else if (
      prefs.experience === "advanced" &&
      trek.difficulty !== "Easy"
    ) {
      score += 20;
      reasons.push("Matches advanced experience requirements.");
    } else {
      reasons.push("Difficulty might not perfectly align with experience.");
    }
  } else {
    score += 20;
  }

  // 2. Fitness Match (20 points)
  if (prefs.fitness !== "any") {
    if (prefs.fitness === "average" && kmPerDay <= 5) {
      score += 20;
      reasons.push("Comfortable daily walking distance.");
    } else if (prefs.fitness === "active" && kmPerDay <= 10) {
      score += 20;
      reasons.push("Good match for active hikers.");
    } else if (prefs.fitness === "very_active") {
      score += 20;
      reasons.push("Suitable for high fitness levels.");
    } else {
      reasons.push("Daily walking distance might be challenging.");
    }
  } else {
    score += 20;
  }

  // 3. Month Match (20 points)
  if (prefs.month !== "any") {
    if (
      trek.bestSeason.toLowerCase().includes(prefs.month.toLowerCase()) ||
      trek.bestSeason.toLowerCase().includes("year-round")
    ) {
      score += 20;
      reasons.push(`Ideal to trek in ${prefs.month}.`);
    } else {
      reasons.push(`May not be the best season (${trek.bestSeason}).`);
    }
  } else {
    score += 20;
  }

  // 4. Duration Match (15 points)
  if (prefs.duration !== "any") {
    if (prefs.duration === "short" && tDuration <= 3) {
      score += 15;
      reasons.push("Matches short duration preference.");
    } else if (prefs.duration === "medium" && tDuration >= 4 && tDuration <= 6) {
      score += 15;
      reasons.push("Matches medium duration preference.");
    } else if (prefs.duration === "long" && tDuration >= 7) {
      score += 15;
      reasons.push("Matches long duration preference.");
    } else {
      reasons.push(`Duration is ${trek.duration}.`);
    }
  } else {
    score += 15;
  }

  // 5. Altitude Ceiling (15 points)
  if (prefs.maxAltitude !== "any") {
    const ALTITUDE_LIMITS: Record<string, number> = {
      low: 3000,
      medium: 4000,
      high: 5000,
      extreme: 9000,
    };
    const limit = ALTITUDE_LIMITS[prefs.maxAltitude] ?? 9000;
    if (tAltitude <= limit) {
      score += 15;
      reasons.push(`Stays within preferred altitude limits (${trek.maxAltitude}).`);
    } else {
      reasons.push(`Exceeds preferred altitude (${trek.maxAltitude}).`);
    }
  } else {
    score += 15;
  }

  // 6. Region Match (10 points)
  if (prefs.region !== "any") {
    if (trek.region.toLowerCase().includes(prefs.region.toLowerCase())) {
      score += 10;
      reasons.push(`Located in your preferred region.`);
    } else {
      reasons.push(`Located in ${trek.region}.`);
    }
  } else {
    score += 10;
  }

  return { trek, score, reasons };
}
