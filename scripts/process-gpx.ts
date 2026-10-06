import fs from "fs";
import path from "path";
import { RouteData, RouteStats, RouteWaypoint, RouteSource } from "../src/data/types";

// Haversine distance between two coordinates in kilometers
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Distance from point p to line segment (v, w) in meters
function perpendicularDistanceMeters(
  point: [number, number, number],
  lineStart: [number, number, number],
  lineEnd: [number, number, number]
): number {
  const [pLng, pLat] = point;
  const [startLng, startLat] = lineStart;
  const [endLng, endLat] = lineEnd;

  if (startLng === endLng && startLat === endLat) {
    return haversineDistanceKm(pLat, pLng, startLat, startLng) * 1000;
  }

  // Linear projection approximation for small distances
  const dx = (endLng - startLng) * Math.cos(((startLat + endLat) / 2) * (Math.PI / 180));
  const dy = endLat - startLat;
  const t = Math.max(
    0,
    Math.min(
      1,
      ((pLng - startLng) * Math.cos(((startLat + endLat) / 2) * (Math.PI / 180)) * dx +
        (pLat - startLat) * dy) /
        (dx * dx + dy * dy)
    )
  );

  const projLng = startLng + t * (endLng - startLng);
  const projLat = startLat + t * (endLat - startLat);
  return haversineDistanceKm(pLat, pLng, projLat, projLng) * 1000;
}

// Ramer-Douglas-Peucker simplification
function simplifyRDP(points: [number, number, number][], epsilonMeters: number): [number, number, number][] {
  if (points.length <= 2) return points;

  let maxDistance = 0;
  let maxIndex = 0;
  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistanceMeters(points[i], start, end);
    if (d > maxDistance) {
      maxDistance = d;
      maxIndex = i;
    }
  }

  if (maxDistance > epsilonMeters) {
    const left = simplifyRDP(points.slice(0, maxIndex + 1), epsilonMeters);
    const right = simplifyRDP(points.slice(maxIndex), epsilonMeters);
    return [...left.slice(0, -1), ...right];
  } else {
    return [start, end];
  }
}

// Parse raw GPX content
export function parseGpx(xmlContent: string): {
  trackPoints: [number, number, number][]; // [lat, lng, ele]
  waypoints: RouteWaypoint[];
} {
  const trackPoints: [number, number, number][] = [];

  // 1. Extract track points <trkpt lat="..." lon="...">...<ele>...</ele>...</trkpt>
  const trkptRegex = /<trkpt\s+[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*>([\s\S]*?)<\/trkpt>/gi;
  let match: RegExpExecArray | null;

  while ((match = trkptRegex.exec(xmlContent)) !== null) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    const inner = match[3];
    const eleMatch = /<ele>([^<]+)<\/ele>/i.exec(inner);
    const ele = eleMatch ? parseFloat(eleMatch[1]) : 0;

    if (!isNaN(lat) && !isNaN(lng)) {
      trackPoints.push([lat, lng, isNaN(ele) ? 0 : Math.round(ele * 10) / 10]);
    }
  }

  // 2. Extract waypoints <wpt lat="..." lon="...">...<name>...</name>...<ele>...</ele>...<desc>...</desc>...</wpt>
  const wptList: RouteWaypoint[] = [];
  const wptRegex = /<wpt\s+[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*>([\s\S]*?)<\/wpt>/gi;

  while ((match = wptRegex.exec(xmlContent)) !== null) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    const inner = match[3];

    const nameMatch = /<name>([^<]+)<\/name>/i.exec(inner);
    const eleMatch = /<ele>([^<]+)<\/ele>/i.exec(inner);
    const descMatch = /<desc>([^<]+)<\/desc>/i.exec(inner);

    const name = nameMatch ? nameMatch[1].trim() : "Waypoint";
    const eleM = eleMatch ? parseFloat(eleMatch[1]) : undefined;
    const note = descMatch ? descMatch[1].trim() : undefined;

    if (!isNaN(lat) && !isNaN(lng)) {
      wptList.push({
        name,
        lat,
        lng,
        eleM: eleM !== undefined && !isNaN(eleM) ? Math.round(eleM) : undefined,
        note,
      });
    }
  }

  return { trackPoints, waypoints: wptList };
}

// Clean and smooth track points
export function processPoints(
  rawPoints: [number, number, number][],
  maxPointsTarget = 1500
): {
  coordinates: [number, number, number][]; // [lng, lat, eleM]
  stats: RouteStats;
} {
  if (rawPoints.length === 0) {
    throw new Error("No track points found in GPX");
  }

  // Step 1: Remove duplicates and jitter points (< 1 meter)
  const deduped: [number, number, number][] = [rawPoints[0]];
  for (let i = 1; i < rawPoints.length; i++) {
    const prev = deduped[deduped.length - 1];
    const curr = rawPoints[i];
    const distM = haversineDistanceKm(prev[0], prev[1], curr[0], curr[1]) * 1000;
    if (distM >= 1.0) {
      deduped.push(curr);
    }
  }

  // Step 2: Smooth elevation with moving average (window = 5)
  const smoothed: [number, number, number][] = [];
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);

  for (let i = 0; i < deduped.length; i++) {
    const start = Math.max(0, i - half);
    const end = Math.min(deduped.length - 1, i + half);
    let eleSum = 0;
    for (let j = start; j <= end; j++) {
      eleSum += deduped[j][2];
    }
    const avgEle = Math.round((eleSum / (end - start + 1)) * 10) / 10;
    // Map to [lng, lat, eleM] order for GeoJSON LineString
    smoothed.push([deduped[i][1], deduped[i][0], avgEle]);
  }

  // Step 3: Simplify points to <= maxPointsTarget using adaptive RDP
  let simplified = smoothed;

  if (smoothed.length > maxPointsTarget) {
    let low = 0.5;
    let high = 50.0;
    for (let iter = 0; iter < 12; iter++) {
      const epsilon = (low + high) / 2;
      simplified = simplifyRDP(smoothed, epsilon);
      if (simplified.length > maxPointsTarget) {
        low = epsilon;
      } else if (simplified.length < maxPointsTarget * 0.7) {
        high = epsilon;
      } else {
        break;
      }
    }
  }

  // Step 4: Compute statistics
  let distanceKm = 0;
  let gainM = 0;
  let lossM = 0;
  let minEleM = simplified[0][2];
  let maxEleM = simplified[0][2];

  for (let i = 1; i < simplified.length; i++) {
    const [pLng, pLat, pEle] = simplified[i - 1];
    const [cLng, cLat, cEle] = simplified[i];

    distanceKm += haversineDistanceKm(pLat, pLng, cLat, cLng);

    const eleDiff = cEle - pEle;
    if (eleDiff > 0.5) {
      gainM += eleDiff;
    } else if (eleDiff < -0.5) {
      lossM += Math.abs(eleDiff);
    }

    if (cEle < minEleM) minEleM = cEle;
    if (cEle > maxEleM) maxEleM = cEle;
  }

  const stats: RouteStats = {
    distanceKm: Math.round(distanceKm * 10) / 10,
    gainM: Math.round(gainM),
    lossM: Math.round(lossM),
    minEleM: Math.round(minEleM),
    maxEleM: Math.round(maxEleM),
    pointCount: simplified.length,
  };

  return { coordinates: simplified, stats };
}

// Generate clean public GPX string without timestamps or sensor extensions
export function generatePublicGpx(
  placeName: string,
  placeHref: string,
  recordedDate: string,
  license: string,
  coordinates: [number, number, number][], // [lng, lat, eleM]
  waypoints: RouteWaypoint[]
): string {
  const wptTags = waypoints
    .map(
      (w) =>
        `  <wpt lat="${w.lat.toFixed(6)}" lon="${w.lng.toFixed(6)}">${
          w.eleM !== undefined ? `<ele>${w.eleM}</ele>` : ""
        }<name>${escapeXml(w.name)}</name>${
          w.note ? `<desc>${escapeXml(w.note)}</desc>` : ""
        }</wpt>`
    )
    .join("\n");

  const trkptTags = coordinates
    .map(
      ([lng, lat, ele]) =>
        `      <trkpt lat="${lat.toFixed(6)}" lon="${lng.toFixed(6)}"><ele>${ele.toFixed(
          1
        )}</ele></trkpt>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Discover Himalayan Trails" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(placeName)} Trek (DHT route)</name>
    <desc>Route recorded by DHT on ${recordedDate}. Conditions change. Not a substitute for a guide, local advice or weather checks.</desc>
    <author><name>Discover Himalayan Trails</name></author>
    <copyright author="Discover Himalayan Trails"><year>${new Date().getFullYear()}</year><license>${escapeXml(license)}</license></copyright>
    <link href="${placeHref}"><text>Trek page</text></link>
  </metadata>
${wptTags ? wptTags + "\n" : ""}  <trk>
    <name>${escapeXml(placeName)}</name>
    <trkseg>
${trkptTags}
    </trkseg>
  </trk>
</gpx>
`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Main execution function
export function processGpxFile(
  inputGpxPath: string,
  placeId: string,
  metadata: {
    placeName: string;
    placeHref: string;
    source: RouteSource;
    sourceNote?: string;
    recordedOn: string;
    verified: boolean;
    verifiedOn?: string;
    license: string;
  }
) {
  console.log(`Processing GPX file for: ${placeId} (${inputGpxPath})...`);
  const rawXml = fs.readFileSync(inputGpxPath, "utf8");
  const { trackPoints, waypoints } = parseGpx(rawXml);

  console.log(`Raw track points parsed: ${trackPoints.length}, waypoints: ${waypoints.length}`);
  const { coordinates, stats } = processPoints(trackPoints, 1500);

  console.log(
    `Processed: ${stats.pointCount} points, ${stats.distanceKm} km, +${stats.gainM}m / -${stats.lossM}m, elev: ${stats.minEleM}m - ${stats.maxEleM}m`
  );

  const routeData: RouteData = {
    placeId,
    version: 1,
    source: metadata.source,
    sourceNote: metadata.sourceNote,
    recordedOn: metadata.recordedOn,
    verified: metadata.verified,
    verifiedOn: metadata.verifiedOn || metadata.recordedOn,
    license: metadata.license,
    stats,
    line: {
      type: "LineString",
      coordinates,
    },
    waypoints,
  };

  // Ensure directories exist
  const routesDir = path.resolve(__dirname, "../src/data/routes");
  const publicGpxDir = path.resolve(__dirname, "../public/gpx");
  if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });
  if (!fs.existsSync(publicGpxDir)) fs.mkdirSync(publicGpxDir, { recursive: true });

  // 1. Output JSON RouteData
  const jsonPath = path.join(routesDir, `${placeId}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(routeData, null, 2) + "\n");
  console.log(`Wrote RouteData to: ${jsonPath}`);

  // 2. Output Public Clean GPX
  const gpxPath = path.join(publicGpxDir, `dht-${placeId}.gpx`);
  const publicGpx = generatePublicGpx(
    metadata.placeName,
    metadata.placeHref,
    metadata.recordedOn,
    metadata.license,
    coordinates,
    waypoints
  );
  fs.writeFileSync(gpxPath, publicGpx);
  console.log(`Wrote clean public GPX to: ${gpxPath}`);

  return { routeData, gpxPath };
}

// CLI handler: tsx scripts/process-gpx.ts [placeId]
if (require.main === module) {
  const args = process.argv.slice(2);
  const placeId = args[0] || "patalsu-peak";
  const rawGpxPath = path.resolve(__dirname, `../data/gpx-raw/${placeId}.gpx`);

  if (!fs.existsSync(rawGpxPath)) {
    console.error(`Error: GPX raw file not found at: ${rawGpxPath}`);
    console.error("Please place the recorded track in data/gpx-raw/{placeId}.gpx first.");
    process.exit(1);
  }

  processGpxFile(rawGpxPath, placeId, {
    placeName: "Patalsu Peak",
    placeHref: "https://discoverhimalayantrails.com/explore/himachal-pradesh/kullu/patalsu-peak",
    source: "dht-recorded",
    sourceNote: "Recorded by Ashish",
    recordedOn: "2026-05-18",
    verified: true,
    license: "Recorded by DHT. Free to use with credit.",
  });
}
