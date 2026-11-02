import { himalayaAtlas, HimalayaPlace, placeLocationIndex } from "@/data/atlas";
import { routesMap } from "@/data/routes";
import { peaks } from "@/data/peaks";
import { VERIFIED_ROUTES_CATALOG } from "@/components/maps/MapExplorerDrawer";

export interface AtlasLandmarkProperties {
  id: string;
  entityId: string;
  kind: "trailhead" | "apex" | "peak" | "pass" | "lake" | "place";
  name: string;
  shortLabel: string;
  fullLabel: string;
  elevation: string;
  type: string;
  color: string;
  tier: number; // 0 = Selected (always visible), 1 = Regional Anchor (zoom 7+), 2 = Subregional Highlight (zoom 9.5+), 3 = Valley Detail (zoom 11.2+)
  priority: number;
  isRoute: boolean;
  isApex: boolean;
  isTrailhead: boolean;
  isSelected: boolean;
}

const TYPE_COLOR: Record<string, string> = {
  trek: "#10B981",       // Alpine Emerald Green
  peak: "#F59E0B",       // Summit Gold
  lake: "#06B6D4",       // Glacial Cyan Tarn
  spiritual: "#A855F7",  // High Alpine Violet
  scenic: "#38BDF8",     // Sky Blue
  adventure: "#F97316",  // Expedition Orange
  road: "#EAB308",       // High Pass Amber
};

/**
 * Strips editorial/catalog suffixes to yield the authoritative geographic name
 * (e.g. "Patalsu Peak Ascent" -> "Patalsu Peak", "Bhrigu Lake Alpine Tarn" -> "Bhrigu Lake")
 */
export function getCleanRouteName(name: string): string {
  return name
    .replace(/\s+Ascent$/i, "")
    .replace(/\s+Trek$/i, "")
    .replace(/\s+Circuit$/i, "")
    .replace(/\s+Alpine Tarn$/i, "")
    .replace(/\s+Glacial Tarn$/i, "")
    .replace(/\s+Crest$/i, "")
    .replace(/\s+Cascade Trail$/i, "")
    .replace(/\s+Ridge Trek$/i, "")
    .replace(/\s+Glacial Lake Trail$/i, "")
    .replace(/\s+Pilgrim Trail$/i, "")
    .replace(/\s+Dhauladhar Crest$/i, "")
    .replace(/\s+Panoramic Ridge Trek$/i, "")
    .replace(/\s+Alpine Meadow Trek$/i, "")
    .replace(/\s+Mystery Lake Trek$/i, "")
    .replace(/\s+Winter Summit Trek$/i, "")
    .replace(/\s+Alpine Lakes Trek$/i, "")
    .trim();
}

/**
 * Helper to match entity region string with the active territory id
 */
export function isEntityInRegion(
  entityRegion: string | undefined | null,
  activeRegionId: string | null | undefined
): boolean {
  if (!activeRegionId || activeRegionId === "all") return true;
  if (!entityRegion) return false;
  const normEntity = entityRegion.toLowerCase().replace(/[^a-z]/g, "");
  const normActive = activeRegionId.toLowerCase().replace(/[^a-z]/g, "");
  return normEntity.includes(normActive) || normActive.includes(normEntity);
}

/**
 * Tier 1: Regional Hubs & Widely Dispersed Anchors (Google Earth Style)
 * These are spaced 30-70km apart across valleys so at territory zoom,
 * only the primary anchor appears (e.g. Manali, Prashar Lake, Jalori Pass)
 * without overcrowding dense local valleys.
 */
export const TIER_1_IDS = new Set<string>([
  // Himachal Pradesh
  "mall-road", "manali", "kullu-town", "prashar-lake", "jalori-pass-serolsar",
  "dharamshala-mcleodganj", "kaza-spiti", "chandratal-lake", "dalhousie-dainkund",
  "kalpa", "mandi-chhoti-kashi", "pangi-valley",
  // Jammu & Kashmir
  "srinagar", "gulmarg", "sonmarg", "pahalgam", "patnitop", "kishtwar",
  // Ladakh
  "leh", "kargil-town", "suru-valley", "diskit-monastery", "hunder-sand-dunes",
  "pangong-tso", "padum",
  // Uttarakhand
  "rishikesh", "joshimath", "uttarkashi-town", "nainital-naina-peak",
  "badrinath", "kedarnath", "gangotri", "roopkund-trek", "munsiyari-panchachuli"
]);

/**
 * Tier 2: Sub-regional Highlights, Iconic Treks & Major Passes
 * Revealed progressively as user zooms into subregions (zoom >= 9.5).
 */
export const TIER_2_IDS = new Set<string>([
  // Himachal
  "rohtang-pass", "hampta-pass", "bhrigu-lake", "triund", "kareri-lake",
  "pin-parvati-pass", "pin-bhaba-pass", "kinner-kailash", "manimahesh-kailash",
  "sach-pass", "bir-billing", "tirthan-valley", "rewalsar-lake", "kamrunag-lake",
  "indrahar-pass", "chandrakhani-pass", "kheerganga", "chitkul", "sangla-kamru-fort",
  "key-monastery", "dhankar-monastery-lake", "jispa", "chicham-bridge",
  "khajjiar-meadow", "bharmour-chaurasi", "barot-valley", "reckong-peo",
  "deo-tibba",
  // Jammu & Kashmir
  "kashmir-great-lakes", "tarsar-marsar", "zojila-pass", "gurez-valley", "yusmarg",
  "sanasar", "pir-ki-gali", "doodhpathri", "nathatop", "vaishno-devi", "aharbal",
  // Ladakh
  "markha-valley", "khardung-la", "thiksey-monastery", "mulbekh-monastery",
  "chadar-trek", "phuktal-monastery", "turtuk", "gurudwara-pathar-sahib",
  // Uttarakhand
  "valley-of-flowers", "hemkund-sahib", "kedarkantha", "chopta-tungnath",
  "dayara-bugyal", "kuari-pass", "har-ki-dun", "dodital", "deoria-tal",
  "madhyamaheshwar", "satopanth-tal-trek", "gangotri-gaumukh", "auli",
  "mana-village", "harsil-valley", "pindari-glacier", "panchachuli-base-camp",
  "mussoorie-george-everest", "chakrata-tiger-falls", "har-ki-pauri", "lansdowne",
  "tehri-lake", "devprayag", "char-dham", "yamunotri", "ali-bedni-bugyal"
]);

export function getLandmarkTier(id: string, isSelected: boolean): number {
  if (isSelected) return 0; // Always visible
  if (TIER_1_IDS.has(id)) return 1;
  if (TIER_2_IDS.has(id)) return 2;
  return 3; // Detailed valley landmark (zoom 11.2+)
}

export const ALL_ATLAS_PLACES: HimalayaPlace[] = (() => {
  const seen = new Set<string>();
  const list: HimalayaPlace[] = [];
  for (const r of himalayaAtlas) {
    for (const s of r.subregions) {
      for (const p of s.places) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          list.push(p);
        }
      }
    }
  }
  return list;
})();

export function buildAtlasLandmarksGeoJSON(
  selectedPlaceId?: string | null,
  activeRegionId?: string | null
): GeoJSON.FeatureCollection<GeoJSON.Point, AtlasLandmarkProperties> {
  const features: GeoJSON.Feature<GeoJSON.Point, AtlasLandmarkProperties>[] = [];

  // 1. Process all 35 Verified Routes
  Object.entries(routesMap).forEach(([slug, routeData]) => {
    if (!routeData?.line?.coordinates || routeData.line.coordinates.length < 2) return;
    const coords = routeData.line.coordinates as [number, number, number][];
    const routeMeta = VERIFIED_ROUTES_CATALOG.find((r) => r.id === slug);
    const isSelected = selectedPlaceId === slug;

    // Strict Territory Scoping: Skip routes outside active territory unless selected
    const isRouteInActiveRegion = isEntityInRegion(routeMeta?.region, activeRegionId);
    if (activeRegionId && activeRegionId !== "all" && !isRouteInActiveRegion && !isSelected) {
      return;
    }

    const rawName = routeMeta ? routeMeta.name : slug;
    const cleanName = getCleanRouteName(rawName);

    // Find the Summit Apex / Highest Point along the route
    let apexPt = coords[0];
    let maxEle = apexPt[2] || 0;
    for (let i = 0; i < coords.length; i++) {
      const pt = coords[i];
      const ele = pt[2] || 0;
      if (ele > maxEle) {
        maxEle = ele;
        apexPt = pt;
      }
    }
    if (maxEle === 0) {
      apexPt = coords[coords.length - 1];
      maxEle = apexPt[2] || 0;
    }

    const apexEleNum = Math.round(maxEle);
    const apexEleStr = routeMeta?.maxAltitude || (apexEleNum > 0 ? `${apexEleNum.toLocaleString()}m` : "");

    const isPeak = routeMeta?.type === "peak" || cleanName.toLowerCase().includes("peak");
    const isLake = cleanName.toLowerCase().includes("lake") || cleanName.toLowerCase().includes("tal") || cleanName.toLowerCase().includes("kund");
    const isPass = cleanName.toLowerCase().includes("pass");

    let symbol = "▲";
    if (isLake) symbol = "◆";
    else if (isPass) symbol = "⬡";

    const tier = getLandmarkTier(slug, isSelected);

    let priority = isPeak ? 3 : 4;
    if (isSelected) {
      priority = 1;
    } else if (tier === 1) {
      priority = 2;
    } else if (tier === 2) {
      priority = 3;
    }

    // PRIMARY DESTINATION POINT (Visible at summit/lake/pass)
    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [apexPt[0], apexPt[1]],
      },
      properties: {
        id: `apex-${slug}`,
        entityId: slug,
        kind: isPeak ? "peak" : isLake ? "lake" : isPass ? "pass" : "apex",
        name: cleanName,
        shortLabel: `${symbol} ${cleanName}`,
        fullLabel: `${symbol} ${cleanName}\n${apexEleStr}`,
        elevation: apexEleStr,
        type: routeMeta?.type || "trek",
        color: isSelected
          ? "#38BDF8"
          : isPeak
          ? "#F59E0B"
          : isLake
          ? "#06B6D4"
          : "#00E5FF",
        tier,
        priority,
        isRoute: true,
        isApex: true,
        isTrailhead: false,
        isSelected,
      },
    });
  });

  // 2. Process all non-route Atlas Places (surrounding towns, valleys, passes, monasteries)
  ALL_ATLAS_PLACES.forEach((place) => {
    // If this place is already represented by a verified route, skip to prevent duplicates
    if (routesMap[place.id as keyof typeof routesMap]) return;
    if (!place.coords || place.coords.length !== 2) return;

    const placeLoc = placeLocationIndex.get(place.id);
    const isSelected = selectedPlaceId === place.id;

    // Strict Territory Scoping: Skip places outside active territory unless selected
    const isPlaceInActiveRegion = !activeRegionId || activeRegionId === "all" || placeLoc?.regionId === activeRegionId;
    if (activeRegionId && activeRegionId !== "all" && !isPlaceInActiveRegion && !isSelected) {
      return;
    }

    const [lat, lng] = place.coords;
    const cleanEle = place.elevation ? place.elevation.replace(/\s*m$/i, "") + "m" : "";

    const isPeak = place.type === "peak";
    const isPass = place.type === "road" || place.name.toLowerCase().includes("pass");
    const isLake = place.type === "lake";

    let symbol = "●";
    if (isPeak) symbol = "▲";
    else if (isPass) symbol = "⬡";
    else if (isLake) symbol = "◆";
    else if (place.type === "spiritual") symbol = "✦";

    const baseColor = isPass ? "#EAB308" : (TYPE_COLOR[place.type] || "#38BDF8");
    const color = isSelected ? "#38BDF8" : baseColor;

    // Standardize display name for central town anchor (e.g. mall-road -> Manali)
    const displayName = place.id === "mall-road" ? "Manali" : place.name;
    const tier = getLandmarkTier(place.id, isSelected);

    let priority = 6;
    if (isSelected) {
      priority = 1;
    } else if (tier === 1) {
      priority = 2;
    } else if (tier === 2) {
      priority = 3;
    } else if (isPeak || isPass || isLake) {
      priority = 4;
    }

    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      properties: {
        id: place.id,
        entityId: place.id,
        kind: isPeak ? "peak" : isPass ? "pass" : isLake ? "lake" : "place",
        name: displayName,
        shortLabel: `${symbol} ${displayName}`,
        fullLabel: cleanEle ? `${symbol} ${displayName}\n${cleanEle}` : `${symbol} ${displayName}`,
        elevation: cleanEle,
        type: place.type,
        color,
        tier,
        priority,
        isRoute: false,
        isApex: false,
        isTrailhead: false,
        isSelected,
      },
    });
  });

  // 3. Process standalone Himalayan Summits from catalog that have coordinates
  peaks.forEach((peak) => {
    // Avoid duplicating routes or places already added
    if (routesMap[peak.slug as keyof typeof routesMap]) return;
    if (ALL_ATLAS_PLACES.some((p) => p.id === peak.slug)) return;
    if (!peak.coords || peak.coords.length !== 2) return;

    const isSelected = selectedPlaceId === peak.slug;
    const isPeakInActiveRegion = !activeRegionId || activeRegionId === "all" || peak.territory === activeRegionId;
    if (activeRegionId && activeRegionId !== "all" && !isPeakInActiveRegion && !isSelected) {
      return;
    }

    const [lat, lng] = peak.coords;
    const tier = getLandmarkTier(peak.slug, isSelected);

    let priority = 4;
    if (isSelected) priority = 1;
    else if (tier === 1) priority = 2;
    else if (tier === 2) priority = 3;

    const eleStr = `${peak.height.toLocaleString()}m`;
    const cleanName = peak.title;
    const symbol = "▲";

    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      properties: {
        id: `summit-${peak.slug}`,
        entityId: peak.slug,
        kind: "peak",
        name: cleanName,
        shortLabel: `${symbol} ${cleanName}`,
        fullLabel: `${symbol} ${cleanName}\n${eleStr}`,
        elevation: eleStr,
        type: "peak",
        color: isSelected ? "#38BDF8" : "#F59E0B",
        tier,
        priority,
        isRoute: false,
        isApex: false,
        isTrailhead: false,
        isSelected,
      },
    });
  });

  return {
    type: "FeatureCollection",
    features,
  };
}
