import fs from "fs";
import path from "path";
import { himalayaAtlas } from "../src/data/atlas/index";
import { treks } from "../src/data/treks/index";

const SNAPSHOT_PATH = path.resolve(__dirname, "places-count-snapshot.json");

let snapshot: Record<string, number> = {};
if (fs.existsSync(SNAPSHOT_PATH)) {
  try {
    snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8"));
  } catch (err) {
    console.warn("Could not read snapshot file, starting fresh:", err);
  }
}

const errors: string[] = [];
const currentCounts: Record<string, number> = {};

let totalPlaces = 0;

for (const region of himalayaAtlas) {
  for (const sub of region.subregions) {
    const subKey = `${region.id}/${sub.id}`;
    currentCounts[subKey] = sub.places.length;

    // Check count against snapshot
    const lastCount = snapshot[subKey];
    if (typeof lastCount === "number" && sub.places.length < lastCount) {
      errors.push(
        `[COUNT REGRESSION] ${subKey} has ${sub.places.length} places, fewer than snapshot count ${lastCount}`
      );
    }

    for (const place of sub.places) {
      totalPlaces++;
      const placeId = place.id || "UNKNOWN_ID";

      // 1. Required fields: id, name, type, elevation
      if (!place.id) errors.push(`[REQUIRED] Missing 'id' in ${subKey}`);
      if (!place.name) errors.push(`[REQUIRED] Missing 'name' for ${placeId} in ${subKey}`);
      if (!place.type) errors.push(`[REQUIRED] Missing 'type' for ${placeId} in ${subKey}`);
      if (!place.elevation) errors.push(`[REQUIRED] Missing 'elevation' for ${placeId} in ${subKey}`);

      // 2. Coords within [28-37 lat, 73-81.5 lng]
      if (!place.coords || !Array.isArray(place.coords) || place.coords.length !== 2) {
        errors.push(`[COORDS] Missing or invalid coords for ${placeId} in ${subKey}`);
      } else {
        const [lat, lng] = place.coords;
        if (
          typeof lat !== "number" ||
          typeof lng !== "number" ||
          lat < 28 ||
          lat > 37 ||
          lng < 73 ||
          lng > 81.5
        ) {
          errors.push(
            `[COORDS] Out of range [28-37 lat, 73-81.5 lng] for ${placeId} (${lat}, ${lng}) in ${subKey}`
          );
        }
      }

      // 3. seoTitle under 60 characters
      if (place.seoTitle) {
        if (place.seoTitle.length >= 60) {
          errors.push(
            `[SEO_TITLE] Length ${place.seoTitle.length} >= 60 chars for ${placeId}: "${place.seoTitle}"`
          );
        }
      }

      // 4. seoDescription between 140-160 characters
      if (place.seoDescription) {
        if (place.seoDescription.length < 140 || place.seoDescription.length > 160) {
          errors.push(
            `[SEO_DESC] Length ${place.seoDescription.length} not in [140, 160] for ${placeId}: "${place.seoDescription}"`
          );
        }
      }
    }
  }
}

// 5. Route Data Validation (src/data/routes/*.json)
const ROUTES_DIR = path.resolve(__dirname, "../src/data/routes");
const ALLOWED_SOURCES = ["dht-recorded", "osm", "permission"];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Map place coordinates from atlas for proximity verification
const placeCoordsMap = new Map<string, [number, number]>();
for (const region of himalayaAtlas) {
  for (const sub of region.subregions) {
    for (const place of sub.places) {
      if (place.id && place.coords) {
        placeCoordsMap.set(place.id, place.coords);
      }
    }
  }
}

// Map trek distances for distance comparison warning
const trekDistanceMap = new Map<string, number>();
for (const trek of treks) {
  if (trek.slug && trek.distance) {
    const match = trek.distance.match(/([0-9.]+)/);
    if (match) {
      trekDistanceMap.set(trek.slug, parseFloat(match[1]));
    }
  }
}

let validatedRoutesCount = 0;

if (fs.existsSync(ROUTES_DIR)) {
  const routeFiles = fs.readdirSync(ROUTES_DIR).filter((f) => f.endsWith(".json"));

  for (const file of routeFiles) {
    const filePath = path.join(ROUTES_DIR, file);
    try {
      const route = JSON.parse(fs.readFileSync(filePath, "utf8"));
      validatedRoutesCount++;
      const routeId = route.placeId || file.replace(".json", "");

      // Check stats existence
      if (!route.stats || typeof route.stats !== "object") {
        errors.push(`[ROUTE_STATS] Missing stats object in ${file}`);
      } else {
        const ptCount = route.stats.pointCount;
        // Check point count (50 <= ptCount <= 2500)
        if (typeof ptCount !== "number" || ptCount < 50 || ptCount > 2500) {
          errors.push(
            `[ROUTE_POINTS] Point count ${ptCount} not between 50 and 2500 in ${file}`
          );
        }
      }

      // Check source
      if (!ALLOWED_SOURCES.includes(route.source)) {
        errors.push(
          `[ROUTE_SOURCE] Invalid source '${route.source}' in ${file}. Allowed: ${ALLOWED_SOURCES.join(", ")}`
        );
      }

      // Check license
      if (!route.license || typeof route.license !== "string" || !route.license.trim()) {
        errors.push(`[ROUTE_LICENSE] Missing or empty license in ${file}`);
      }

      // Check coordinates and proximity within 15 km of atlas place coordinates
      const atlasCoords = placeCoordsMap.get(routeId);
      if (!atlasCoords) {
        errors.push(`[ROUTE_PLACE] Place ID '${routeId}' in ${file} not found in himalayaAtlas`);
      } else if (
        !route.line ||
        !Array.isArray(route.line.coordinates) ||
        route.line.coordinates.length === 0
      ) {
        errors.push(`[ROUTE_LINE] Missing or empty line.coordinates in ${file}`);
      } else {
        const [atlasLat, atlasLng] = atlasCoords;
        let minDistanceKm = Infinity;

        for (const pt of route.line.coordinates) {
          // pt is [lng, lat, eleM]
          const dist = haversineKm(atlasLat, atlasLng, pt[1], pt[0]);
          if (dist < minDistanceKm) {
            minDistanceKm = dist;
          }
          if (minDistanceKm <= 15) break;
        }

        if (minDistanceKm > 15) {
          errors.push(
            `[ROUTE_PROXIMITY] No point in ${file} is within 15 km of atlas coords [${atlasLat}, ${atlasLng}]. Min distance: ${minDistanceKm.toFixed(1)} km`
          );
        }
      }

      // Warning check for distanceKm discrepancy > 25%
      const trekDistance = trekDistanceMap.get(routeId);
      if (trekDistance && route.stats && typeof route.stats.distanceKm === "number") {
        const diffRatio = Math.abs(route.stats.distanceKm - trekDistance) / trekDistance;
        if (diffRatio > 0.25) {
          console.warn(
            `⚠️  [ROUTE_DISTANCE_WARNING] Route distance (${route.stats.distanceKm} km) differs by ${(diffRatio * 100).toFixed(0)}% from trek page distance (${trekDistance} km) for '${routeId}'`
          );
        }
      }
    } catch (err) {
      errors.push(`[ROUTE_PARSE] Could not parse route file ${file}: ${err}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`❌ Validation failed with ${errors.length} error(s):\n`);
  errors.slice(0, 50).forEach((err) => console.error(`  - ${err}`));
  if (errors.length > 50) {
    console.error(`  ... and ${errors.length - 50} more errors.`);
  }
  process.exit(1);
}

// On a passing run, update snapshot
fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(currentCounts, null, 2) + "\n");
console.log(
  `✅ All ${totalPlaces} places across ${Object.keys(currentCounts).length} subregions validated successfully.`
);
if (validatedRoutesCount > 0) {
  console.log(`🧭 Validated ${validatedRoutesCount} route data file(s) successfully.`);
}
console.log(`📸 Updated snapshot at ${SNAPSHOT_PATH}`);

