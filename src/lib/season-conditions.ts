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

/* ── Territorial 4-Season Matrix Generator ───────────────────────────────── */

export interface SeasonCardItem {
  iconType: "sun" | "cloud-rain" | "wind" | "snowflake";
  season: string;
  badge: string;
  description: string;
  status: string;
  highlight?: boolean;
}

/**
 * Returns authentic, territory- and altitude-aware seasonal cards.
 * Decouples rain-shadow Ladakh, Kashmir lakes, monsoon Garhwal/Kumaon,
 * and winter snow routes while preserving Patalsu Peak content.
 */
export function getSeasonalMatrix(
  bestSeasonStr: string = "May to October",
  altitudeStr: string = "3,500 m",
  stateSlug?: string,
  subRegionName?: string,
  placeName?: string,
  isPatalsu: boolean = false
): SeasonCardItem[] {
  // Patalsu Peak: Strictly preserved
  if (isPatalsu) {
    return [
      {
        iconType: "sun",
        season: "Summer & Spring Snow (May – June)",
        badge: "Spring Greenery & Snow",
        description: "Lush meadows in Shagadugh, pleasant daytime temperatures (12°C to 18°C), with crisp snow patches on the high summit crest — ideal for snow Manali treks.",
        status: "Prime Season",
      },
      {
        iconType: "cloud-rain",
        season: "Monsoon (July – August)",
        badge: "Early Departures",
        description: "Dense pine woodland is vibrant and green. Convective clouds gather by early afternoon; 5:00 AM alpine departures are critical to summit safely.",
        status: "Feasible with Care",
      },
      {
        iconType: "wind",
        season: "Post-Monsoon / Autumn (Sept – Oct)",
        badge: "Optimal Clarity",
        description: "Crisp, transparent atmosphere with sharpest panoramic visibility of Hanuman Tibba and Dhauladhar ranges. Ideal window for speed hiking.",
        status: "Best Window",
        highlight: true,
      },
      {
        iconType: "snowflake",
        season: "Winter (Nov – April)",
        badge: "Heavy Snow Pack",
        description: "Upper meadows and ridge buried under heavy snow drifts. Snow trekking to Shagadugh (3,250m) is accessible; summit push requires winter mountaineering equipment.",
        status: "Winter Snow Trek",
      },
    ];
  }

  // Parse altitude
  const altMatch = altitudeStr.replace(/,/g, "").match(/\d+/);
  const elevM = altMatch ? parseInt(altMatch[0], 10) : 3200;
  const sLow = bestSeasonStr.toLowerCase();
  const nameLow = (placeName || "").toLowerCase();
  const subLow = (subRegionName || "").toLowerCase();

  // 1. LADAKH (Rain Shadow, Trans-Himalayan Cold Desert)
  if (stateSlug === "ladakh" || sLow.includes("spiti") || subLow.includes("spiti")) {
    return [
      {
        iconType: "sun",
        season: "Spring & High Passes Opening (May – June)",
        badge: "Passes Clearing",
        description: "High mountain passes above 4,800m (Kongmaru La, Ganda La) remain snowbound through May. Lower valley trails thaw early; upper alpine cols clear reliably by mid-to-late June.",
        status: "Spring Opening",
      },
      {
        iconType: "sun",
        season: "Peak Alpine Summer (July – August)",
        badge: "Rain-Shadow Sanctuary",
        description: "Ladakh lies in the trans-Himalayan rain shadow, receiving almost zero monsoon rainfall. Warm, sunny days (15°C to 24°C), dry trails, and fully accessible high pastures.",
        status: "Prime Season",
        highlight: true,
      },
      {
        iconType: "wind",
        season: "Autumn Gold & Clarity (September – October)",
        badge: "Crystalline Skies",
        description: `Golden willow groves and crystalline blue skies across ${subRegionName || "Ladakh"}. Night temperatures dip below freezing (-5°C to -10°C in Oct); high passes receive first autumn snow.`,
        status: "Best Window",
        highlight: sLow.includes("sep") || sLow.includes("oct"),
      },
      {
        iconType: "snowflake",
        season: "Extreme Winter Deep Freeze (November – April)",
        badge: "Sub-Zero Freeze",
        description: "Extreme sub-zero cold (-20°C to -30°C) with passes completely blocked by snow. Standard trekking is closed; only specialized frozen river expeditions operate.",
        status: "Closed / Winter Freeze",
      },
    ];
  }

  // 2. JAMMU & KASHMIR HIGH LAKES & PASSES (e.g. Kashmir Great Lakes, Tarsar Marsar)
  if (stateSlug === "jammu-kashmir" && elevM >= 3000) {
    return [
      {
        iconType: "sun",
        season: "Late Spring Snowmelt (May – June)",
        badge: "Snowpack Thawing",
        description: "High alpine passes (Nichnai, Gadsar) remain covered under winter snowpack until late June. Meltwater streams run high and valleys begin turning green.",
        status: "Late Spring Thaw",
      },
      {
        iconType: "sun",
        season: "Peak Summer Wildflowers (July – August)",
        badge: "Wildflower Bloom",
        description: "The premier window for Kashmir's alpine tarns. High passes are snow-free, glacial lakes thaw into vibrant turquoise and emerald colors, and meadows are carpeted in wildflowers.",
        status: "Prime Season",
        highlight: true,
      },
      {
        iconType: "wind",
        season: "Early Autumn Gold (September)",
        badge: "Golden Meadows",
        description: "Dry atmospheric stability with golden grasslands and tranquil, uncrowded trails. Nights turn frosty (down to -2°C) with sharp panoramic mountain clarity before October snows.",
        status: "Best Window",
        highlight: true,
      },
      {
        iconType: "snowflake",
        season: "Winter Snowfall (October – April)",
        badge: "Heavy Snowpack",
        description: "Western disturbances bring immense snowfall across the Great Himalayan and Pir Panjal ranges. High lake basins and pass crossings are completely buried and closed.",
        status: "Snowbound / Closed",
      },
    ];
  }

  // 3. VALLEY OF FLOWERS / MONSOON FLORA TREKS
  if (nameLow.includes("flower") || (sLow.includes("july") && sLow.includes("august") && !sLow.includes("may") && !sLow.includes("oct"))) {
    return [
      {
        iconType: "sun",
        season: "Spring Snowmelt (May – June)",
        badge: "Valley Opening",
        description: "Winter snow melts from the valley floor and early alpine shoots emerge. Forest trails open by early June with lingering snow bridges across mountain gullies.",
        status: "Early Opening",
      },
      {
        iconType: "cloud-rain",
        season: "Peak Monsoon Bloom (July – August)",
        badge: "500+ Floral Species",
        description: "Vibrant botanical explosion with over 500 varieties of Himalayan wildflowers in full bloom. Daily monsoon mist and light rain create an ethereal alpine sanctuary.",
        status: "Prime Season",
        highlight: true,
      },
      {
        iconType: "wind",
        season: "Autumn Amber Transition (September)",
        badge: "Golden Pods",
        description: "Wildflowers set seed as alpine grasses turn warm bronze and amber. Clear post-monsoon skies offer dramatic panoramic views of surrounding snowbound peaks.",
        status: "Late Season Window",
      },
      {
        iconType: "snowflake",
        season: "Winter Snowpack (October – April)",
        badge: "Heavy Snow",
        description: "Heavy snowfall blankets the sanctuary under deep drifts from late October. The national park closes to all visitors until the following June thaw.",
        status: "Closed for Winter",
      },
    ];
  }

  // 4. DESIGNATED WINTER SNOW TREKS (e.g. Kedarkantha, Brahmatal, Dayara Bugyal)
  const isWinterTrek = sLow.includes("winter") || (sLow.includes("dec") && (sLow.includes("jan") || sLow.includes("feb") || sLow.includes("mar")));
  if (isWinterTrek) {
    return [
      {
        iconType: "sun",
        season: "Spring Rhododendron Bloom (March – April)",
        badge: "Forest Flora",
        description: "Dense pink and crimson rhododendron blossoms carpet the lower oak woodlands. Snow recedes from high ridges, offering crisp hiking conditions and mild daytime temperatures.",
        status: "Pleasant Spring",
      },
      {
        iconType: "sun",
        season: "Summer Greenery (May – June)",
        badge: "Lush Bugyals",
        description: "Alpine grazing pastures (bugyals) turn vibrant emerald green. Gentle mountain breezes and comfortable camping conditions make it ideal for novice trekkers and families.",
        status: "Summer Window",
      },
      {
        iconType: "wind",
        season: "Autumn Visibility (September – November)",
        badge: "Razor-Sharp Skies",
        description: "Post-monsoon dry air brings razor-sharp clarity of Himalayan massifs. Brisk walking temperatures with crisp sunny days and frosty alpine evenings.",
        status: "Autumn Window",
      },
      {
        iconType: "snowflake",
        season: "Peak Winter Snow (December – February)",
        badge: "Deep Powder Snow",
        description: "The premier season for snow hiking. Trails and basecamps are blanketed in thick powder snow; microspikes, gaiters, and insulated winter layers are essential.",
        status: "Prime Season",
        highlight: true,
      },
    ];
  }

  // 5. CLASSIC HIMALAYAN HIGH-PASS & GLACIER TREKS (Himachal & Uttarakhand)
  return [
    {
      iconType: "sun",
      season: "Pre-Monsoon Summer (May – June)",
      badge: "Rhododendron & Snow",
      description: "Clear morning skies, blooming rhododendrons in lower forests, and residual snow bridges on high passes. Pleasant daytime temperatures (12°C to 18°C) with cold alpine nights.",
      status: sLow.includes("may") || sLow.includes("june") ? "Prime Season" : "Spring Opening",
      highlight: sLow.includes("may") || sLow.includes("june"),
    },
    {
      iconType: "cloud-rain",
      season: "Monsoon (July – August)",
      badge: "Lush Greenery & Rain",
      description: "Lush green valley trails and roaring glacial streams. Frequent rainfall in lower valleys requires early morning departures (before 6:00 AM) and reliable waterproof shells.",
      status: sLow.includes("july") || sLow.includes("august") ? "Prime Season" : "Feasible with Care",
      highlight: sLow.includes("july") || sLow.includes("august"),
    },
    {
      iconType: "wind",
      season: "Post-Monsoon Autumn (September – October)",
      badge: "Crystalline Visibility",
      description: "Mountain air washed clean by monsoon rains; crystal-clear atmospheric transparency and stable high pressure across the summits. Crisp, dry walking conditions with sub-zero nights.",
      status: sLow.includes("sep") || sLow.includes("oct") ? "Best Window" : "Crisp Autumn",
      highlight: sLow.includes("sep") || sLow.includes("oct"),
    },
    {
      iconType: "snowflake",
      season: "Winter & Early Spring (November – April)",
      badge: "Snowbound Passes",
      description: "Upper ridges and passes buried under seasonal snowpack. Lower approaches remain accessible; high cols require specialized winter expedition equipment.",
      status: "Winter Conditions",
    },
  ];
}
