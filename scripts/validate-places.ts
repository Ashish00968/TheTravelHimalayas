import fs from "fs";
import path from "path";
import { himalayaAtlas } from "../src/data/atlas/index";

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
console.log(`📸 Updated snapshot at ${SNAPSHOT_PATH}`);
