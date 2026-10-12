/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  HIMALAYAN LIVE SEASON & TRAIL CONDITION EVALUATOR
 *  Discover Himalayan Trails — Deterministic High-Altitude Season Engine
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Deterministically calculates the active trail condition, pass status,
 * and high-altitude weather advisories by cross-referencing:
 *   1. The visitor's current calendar month
 *   2. Peak/destination summit altitude (meters)
 *   3. Territory geographical climate regime (Rain-shadow Ladakh vs Monsoon Garhwal)
 *   4. Verified bestSeason strings in the atlas
 */

export type TrailStatusType = "open" | "caution" | "snowbound" | "year-round";

export interface SeasonConditionResult {
  status: TrailStatusType;
  badgeText: string;
  badgeColor: string;
  badgeBg: string;
  borderColor: string;
  currentMonthName: string;
  advisory: string;
  seasonWindow: string;
  isPeakSeason: boolean;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_SHORT = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

/**
 * Parses month ranges from strings like "May to October", "May–June, Sept–Oct", "Round the Year"
 */
function parseActiveMonths(seasonStr: string): number[] {
  const s = seasonStr.toLowerCase();
  if (s.includes("round the year") || s.includes("year-round") || s.includes("all year") || s.includes("throughout")) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }

  const active = new Set<number>();

  // Check for range patterns: "may to october" or "may - october"
  const rangeMatches = s.matchAll(/([a-z]{3,9})\s*(?:to|–|-)\s*([a-z]{3,9})/g);
  for (const m of rangeMatches) {
    const startIdx = MONTH_SHORT.findIndex((mon) => m[1].startsWith(mon));
    const endIdx = MONTH_SHORT.findIndex((mon) => m[2].startsWith(mon));
    if (startIdx !== -1 && endIdx !== -1) {
      if (startIdx <= endIdx) {
        for (let i = startIdx; i <= endIdx; i++) active.add(i);
      } else {
        // Wraps over winter (e.g. Dec to March)
        for (let i = startIdx; i < 12; i++) active.add(i);
        for (let i = 0; i <= endIdx; i++) active.add(i);
      }
    }
  }

  // Also check individual month mentions
  MONTH_SHORT.forEach((mon, idx) => {
    if (s.includes(mon) && !active.has(idx)) {
      active.add(idx);
    }
  });

  return Array.from(active);
}

/**
 * Evaluates live mountain season conditions based on date, altitude, and region.
 */
export function getTrailSeasonCondition(
  bestSeasonStr: string = "May to October",
  altitudeStr: string = "3,500 m",
  stateSlug?: string,
  currentDate: Date = new Date()
): SeasonConditionResult {
  const currentMonthIdx = currentDate.getMonth(); // 0 to 11
  const currentMonthName = MONTH_NAMES[currentMonthIdx];

  // Numerical altitude
  const altMatch = altitudeStr.replace(/,/g, "").match(/\d+/);
  const elevM = altMatch ? parseInt(altMatch[0], 10) : 3200;

  const activeMonths = parseActiveMonths(bestSeasonStr);
  const isDirectMatch = activeMonths.includes(currentMonthIdx);

  // Territory geography check
  const isTransHimalayan = stateSlug === "ladakh" || (bestSeasonStr.toLowerCase().includes("spiti"));
  const isMonsoonMonth = currentMonthIdx === 6 || currentMonthIdx === 7; // July or August
  const isWinterMonth = currentMonthIdx === 11 || currentMonthIdx === 0 || currentMonthIdx === 1; // Dec, Jan, Feb

  // 1. Low altitude valley & pilgrimage (< 2,400m)
  if (elevM < 2400) {
    return {
      status: "year-round",
      badgeText: "Accessible Year-Round",
      badgeColor: "#10B981", // Emerald
      badgeBg: "rgba(16, 185, 129, 0.12)",
      borderColor: "rgba(16, 185, 129, 0.25)",
      currentMonthName,
      advisory: `Valley trail accessible during ${currentMonthName}. Crisp alpine air; carry layers for evening cool.`,
      seasonWindow: bestSeasonStr,
      isPeakSeason: isDirectMatch,
    };
  }

  // 2. High Alpine (> 4,000m) during deep winter (Dec–Feb)
  if (elevM >= 4000 && isWinterMonth) {
    return {
      status: "snowbound",
      badgeText: "Winter Snowbound • High Pass Closed",
      badgeColor: "#EF4444", // Red/Rose
      badgeBg: "rgba(239, 68, 68, 0.12)",
      borderColor: "rgba(239, 68, 68, 0.3)",
      currentMonthName,
      advisory: `High cols and summit ridges above ${elevM.toLocaleString()}m are buried under heavy snowpack with active avalanche risk. Trekking closed until spring melt.`,
      seasonWindow: bestSeasonStr,
      isPeakSeason: false,
    };
  }

  // 3. Moderate Alpine (3,000m–4,000m) during winter
  if (elevM >= 3000 && isWinterMonth) {
    // Check if it is a designated winter trek
    const isWinterTrek = bestSeasonStr.toLowerCase().includes("dec") || bestSeasonStr.toLowerCase().includes("winter");
    if (isWinterTrek) {
      return {
        status: "open",
        badgeText: "Active Winter Snow Trek",
        badgeColor: "#38BDF8", // Cyan
        badgeBg: "rgba(56, 189, 248, 0.12)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        currentMonthName,
        advisory: `Snow trail active in ${currentMonthName}. Microspikes, gaiters, and 4-season thermal gear mandatory.`,
        seasonWindow: bestSeasonStr,
        isPeakSeason: true,
      };
    }

    return {
      status: "snowbound",
      badgeText: "Snowbound • Inactive Season",
      badgeColor: "#EF4444",
      badgeBg: "rgba(239, 68, 68, 0.12)",
      borderColor: "rgba(239, 68, 68, 0.3)",
      currentMonthName,
      advisory: `Sub-zero conditions and trail snowpack at ${elevM.toLocaleString()}m. Unfavorable for casual trekking.`,
      seasonWindow: bestSeasonStr,
      isPeakSeason: false,
    };
  }

  // 4. Monsoon season in non-Ladakh regions
  if (isMonsoonMonth && !isTransHimalayan && elevM >= 2500) {
    const isValleyOfFlowers = bestSeasonStr.toLowerCase().includes("july") && bestSeasonStr.toLowerCase().includes("august");
    if (isValleyOfFlowers) {
      return {
        status: "open",
        badgeText: "Peak Monsoon Flora Window",
        badgeColor: "#10B981",
        badgeBg: "rgba(16, 185, 129, 0.12)",
        borderColor: "rgba(16, 185, 129, 0.25)",
        currentMonthName,
        advisory: `Botanical bloom at maximum vibrancy. Daily rainfall expected; pack Gore-Tex rain shells and waterproof pack liner.`,
        seasonWindow: bestSeasonStr,
        isPeakSeason: true,
      };
    }

    return {
      status: "caution",
      badgeText: "Monsoon Watch • Wet Mud & Landslide Caution",
      badgeColor: "#F59E0B", // Amber
      badgeBg: "rgba(245, 158, 11, 0.12)",
      borderColor: "rgba(245, 158, 11, 0.3)",
      currentMonthName,
      advisory: `Active monsoon rain. Slippery forest mud and river crossings require caution and weather tracking.`,
      seasonWindow: bestSeasonStr,
      isPeakSeason: false,
    };
  }

  // 5. Direct Best Season Match (e.g. October autumn, May pre-monsoon)
  if (isDirectMatch) {
    return {
      status: "open",
      badgeText: "Prime Trekking Window • Optimal Skies",
      badgeColor: "#10B981", // Emerald
      badgeBg: "rgba(16, 185, 129, 0.12)",
      borderColor: "rgba(16, 185, 129, 0.25)",
      currentMonthName,
      advisory: `${currentMonthName} offers crystal-clear Himalayan visibility and stable mountain atmospheric conditions.`,
      seasonWindow: bestSeasonStr,
      isPeakSeason: true,
    };
  }

  // 6. Shoulder Season (Months directly adjacent to prime season)
  return {
    status: "caution",
    badgeText: "Shoulder Season • Cold Snaps / Transition",
    badgeColor: "#F59E0B",
    badgeBg: "rgba(245, 158, 11, 0.12)",
    borderColor: "rgba(245, 158, 11, 0.25)",
    currentMonthName,
    advisory: `Off-peak transition in ${currentMonthName}. Colder alpine temperatures; check local trailhead weather before departure.`,
    seasonWindow: bestSeasonStr,
    isPeakSeason: false,
  };
}
