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

/** Authentic, verified Himalayan trailhead departure points */
const ROUTE_TRAILHEAD_NAMES: Record<string, string> = {
  "patalsu-peak": "Solang Trailhead",
  "beas-kund": "Dhundi Trailhead",
  "hampta-pass": "Jobra Trailhead",
  "bhrigu-lake": "Gulaba Trailhead",
  "jogni-falls": "Vashisht Trailhead",
  "lamadugh": "Old Manali Trailhead",
  "chandrakhani-pass": "Naggar Trailhead",
  "jalori-pass-serolsar": "Jalori Pass Trailhead",
  "kheerganga": "Barshaini Trailhead",
  "deo-tibba": "Khanol Trailhead",
  "triund": "Galu Devi Trailhead",
  "kareri-lake": "Ghera Trailhead",
  "indrahar-pass": "Galu Devi Trailhead",
  "hemkund-sahib": "Govindghat Trailhead",
  "valley-of-flowers": "Govindghat Trailhead",
  "kedarkantha": "Sankri Trailhead",
  "markha-valley": "Chilling Trailhead",
  "tarsar-marsar": "Aru Trailhead",
  "kashmir-great-lakes": "Sonmarg Trailhead",
  "roopkund-trek": "Lohajung Trailhead",
  "gangotri-gaumukh": "Gangotri Trailhead",
  "dayara-bugyal": "Barsu Trailhead",
  "chopta-tungnath": "Chopta Trailhead",
  "kuari-pass": "Dharkot Trailhead",
  "dodital": "Sangam Chatti Trailhead",
  "deoria-tal": "Sari Village Trailhead",
  "kamrunag-lake": "Rohanda Trailhead",
  "kinner-kailash": "Tangling Trailhead",
  "madhyamaheshwar": "Ransi Trailhead",
  "manimahesh-kailash": "Hadsar Trailhead",
  "pin-bhaba-pass": "Kafnu Trailhead",
  "pin-parvati-pass": "Barsheni Trailhead",
  "rupin-pass-kinnaur": "Dhaula Trailhead",
  "satopanth-tal-trek": "Mana Trailhead",
  "vasudhara-falls": "Mana Trailhead",
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
    const rawName = routeMeta ? routeMeta.name : slug;
    const cleanName = getCleanRouteName(rawName);

    // Territory scoping check
    const isRouteInActiveRegion = Boolean(
      activeRegionId &&
      activeRegionId !== "all" &&
      routeMeta?.region &&
      routeMeta.region.toLowerCase().includes(
        activeRegionId === "himachal-pradesh"
          ? "himachal"
          : activeRegionId === "jammu-kashmir"
          ? "kashmir"
          : activeRegionId.toLowerCase()
      )
    );

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

    let priority = isPeak ? 3 : 4;
    if (isSelected) {
      priority = 1;
    } else if (isRouteInActiveRegion) {
      priority = 2; // Elevate priority when territory is selected
    }

    // PRIMARY DESTINATION POINT (Always visible at the mountain summit/lake/pass)
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
        name: isSelected ? `${cleanName} (Summit Apex)` : cleanName,
        shortLabel: `${symbol} ${cleanName}`,
        fullLabel: isSelected
          ? `${symbol} ${cleanName}\nSummit Apex • ${apexEleStr}`
          : `${symbol} ${cleanName}\n${apexEleStr}`,
        elevation: apexEleStr,
        type: routeMeta?.type || "trek",
        color: isSelected
          ? "#38BDF8"
          : isPeak
          ? "#F59E0B"
          : isLake
          ? "#06B6D4"
          : "#00E5FF",
        priority,
        isRoute: true,
        isApex: true,
        isTrailhead: false,
        isSelected,
      },
    });

    // PROGRESSIVE DISCLOSURE: Trailhead is revealed ONLY when this route is actively selected
    if (isSelected) {
      const startPt = coords[0];
      const startEleNum = Math.round(startPt[2] || 0);
      const startEleStr = startEleNum > 0 ? `${startEleNum.toLocaleString()}m` : "";
      const thName = ROUTE_TRAILHEAD_NAMES[slug] || `${routeMeta?.valley || "Trailhead"}`;

      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [startPt[0], startPt[1]],
        },
        properties: {
          id: `th-${slug}`,
          entityId: slug,
          kind: "trailhead",
          name: `${thName} (Start)`,
          shortLabel: `▶ ${thName}`,
          fullLabel: `▶ ${thName}\nStart • ${startEleStr}`,
          elevation: startEleStr,
          type: "trek",
          color: "#10B981", // Alpine Emerald
          priority: 1,      // Highest priority during selection
          isRoute: true,
          isApex: false,
          isTrailhead: true,
          isSelected: true,
        },
      });
    }
  });

  // 2. Process all non-route Atlas Places (surrounding towns, valleys, passes, monasteries)
  ALL_ATLAS_PLACES.forEach((place) => {
    // If this place is already represented by a verified route, skip to prevent duplicates
    if (routesMap[place.id as keyof typeof routesMap]) return;
    if (!place.coords || place.coords.length !== 2) return;

    const [lat, lng] = place.coords;
    const isSelected = selectedPlaceId === place.id;
    const cleanEle = place.elevation ? place.elevation.replace(/\s*m$/i, "") + "m" : "";
    const eleNum = parseInt((place.elevation || "").replace(/\D/g, "") || "0", 10);

    const placeLoc = placeLocationIndex.get(place.id);
    const isPlaceInActiveRegion = Boolean(
      activeRegionId && activeRegionId !== "all" && placeLoc?.regionId === activeRegionId
    );

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

    let priority = 6;
    if (isSelected) {
      priority = 1;
    } else if (isPlaceInActiveRegion) {
      // Prioritize places in the actively selected territory so they appear immediately
      priority = (isPeak || isPass || isLake) ? 2 : 3;
    } else if (isPeak && eleNum >= 5000) {
      priority = 3; // Prominent Himalayan Massif
    } else if (isPeak || isPass || isLake) {
      priority = 4; // High alpine landmarks
    } else if (place.type === "trek") {
      priority = 5;
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
        name: place.name,
        shortLabel: `${symbol} ${place.name}`,
        fullLabel: cleanEle ? `${symbol} ${place.name}\n${cleanEle}` : `${symbol} ${place.name}`,
        elevation: cleanEle,
        type: place.type,
        color,
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

    const [lat, lng] = peak.coords;
    const isSelected = selectedPlaceId === peak.slug;
    const isPeakInActiveRegion = Boolean(
      activeRegionId && activeRegionId !== "all" && peak.territory === activeRegionId
    );

    let priority = 4;
    if (isSelected) priority = 1;
    else if (isPeakInActiveRegion) priority = 2;
    else if (peak.height >= 5000) priority = 3;

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
