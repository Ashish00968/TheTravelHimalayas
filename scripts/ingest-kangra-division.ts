import fs from "fs";
import path from "path";
import { RouteData, RouteWaypoint } from "../src/data/types";
import { processPoints, generatePublicGpx } from "./process-gpx";
import { lookupElevationsRobust } from "./fetch-elevations";

function haversineM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function filterMinDistance(pts: [number, number][], minMeters: number): [number, number][] {
  if (pts.length <= 2) return pts;
  const filtered: [number, number][] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const prev = filtered[filtered.length - 1];
    const curr = pts[i];
    if (haversineM(prev[0], prev[1], curr[0], curr[1]) >= minMeters) {
      filtered.push(curr);
    }
  }
  const last = pts[pts.length - 1];
  if (filtered[filtered.length - 1] !== last) {
    filtered.push(last);
  }
  return filtered;
}

function parseGpxCoords(xmlContent: string): [number, number][] {
  const coords: [number, number][] = [];
  const trkptRegex = /<trkpt\s+[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = trkptRegex.exec(xmlContent)) !== null) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lon)) {
      coords.push([lat, lon]);
    }
  }

  return coords;
}

function parseGpxSegments(xmlContent: string): [number, number][][] {
  const segments: [number, number][][] = [];
  const trkRegex = /<trk>([\s\S]*?)<\/trk>/gi;
  let trkMatch: RegExpExecArray | null;

  while ((trkMatch = trkRegex.exec(xmlContent)) !== null) {
    const trkBody = trkMatch[1];
    const trksegRegex = /<trkseg>([\s\S]*?)<\/trkseg>/gi;
    let segMatch: RegExpExecArray | null;

    while ((segMatch = trksegRegex.exec(trkBody)) !== null) {
      const segBody = segMatch[1];
      const pts: [number, number][] = [];
      const trkptRegex = /<trkpt\s+[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*>/gi;
      let ptMatch: RegExpExecArray | null;

      while ((ptMatch = trkptRegex.exec(segBody)) !== null) {
        const lat = parseFloat(ptMatch[1]);
        const lon = parseFloat(ptMatch[2]);
        if (!isNaN(lat) && !isNaN(lon)) {
          pts.push([lat, lon]);
        }
      }
      if (pts.length > 0) {
        segments.push(pts);
      }
    }
  }

  return segments;
}

async function ingestKangra() {
  console.log("==================================================");
  console.log("🏔️ INGESTING HIMACHAL PRADESH DIVISION 2: KANGRA");
  console.log("==================================================");

  const routesDir = path.resolve(__dirname, "../src/data/routes");
  const publicGpxDir = path.resolve(__dirname, "../public/gpx");
  if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });
  if (!fs.existsSync(publicGpxDir)) fs.mkdirSync(publicGpxDir, { recursive: true });

  // ─────────────────────────────────────────────────────────────
  // 1. TRIUND TREK (Kandi to Snowline Cafe via Triund Ridge)
  // ─────────────────────────────────────────────────────────────
  console.log("\n[1/3] Processing Triund Trek...");
  const triundXml = fs.readFileSync("/Users/apple/Downloads/kandi-triund.gpx", "utf8");
  const triundSegments = parseGpxSegments(triundXml);
  console.log(`  Parsed ${triundSegments.length} segments in kandi-triund.gpx.`);

  // Stitch Segments 0, 1, 2 into a single continuous ascent path to Snowline Cafe (3,154m)
  const triundRawCoords: [number, number][] = [
    ...triundSegments[0],
    ...triundSegments[1],
    ...triundSegments[2],
  ];
  const triundFiltered = filterMinDistance(triundRawCoords, 25.0);
  console.log(`  Stitched ${triundRawCoords.length} track points -> filtered to ${triundFiltered.length} (Kandi to Snowline).`);

  const triundElevations = await lookupElevationsRobust(
    triundFiltered.map(([lat, lon]) => ({ latitude: lat, longitude: lon }))
  );

  const triundRawPointsWithEle: [number, number, number][] = triundFiltered.map(
    ([lat, lon], idx) => [lat, lon, triundElevations[idx] || 2500]
  );

  const { coordinates: triundCoords, stats: triundStats } = processPoints(triundRawPointsWithEle, 350);

  const triundWaypoints: RouteWaypoint[] = [
    {
      name: "Kandi / Darnu Trailhead",
      lat: 32.213427,
      lng: 76.344455,
      eleM: 1350,
      type: "trailhead",
      note: "Roadhead trailhead at Kandi/Darnu on the lower slopes of Dharamshala.",
    },
    {
      name: "Karthani Ridge Rest Point",
      lat: 32.240778,
      lng: 76.348127,
      eleM: 2129,
      type: "landmark",
      note: "Scenic ridge viewpoint overlooking Kangra Valley.",
    },
    {
      name: "Mana Forest Clearing",
      lat: 32.246341,
      lng: 76.350737,
      eleM: 2469,
      type: "camp",
      note: "Oak and rhododendron forest clearing with sheltered campsite terrain.",
    },
    {
      name: "Magic View / Galu Trail Junction",
      lat: 32.248723,
      lng: 76.352031,
      eleM: 2602,
      type: "water",
      note: "Historic mountain tea stall and trail merge point.",
    },
    {
      name: "Triund Ridge Plateau",
      lat: 32.2579,
      lng: 76.3552,
      eleM: 2850,
      type: "camp",
      note: "Expansive green alpine plateau directly beneath the sheer granite face of the Dhauladhar.",
    },
    {
      name: "Snowline Cafe & Laka Got Viewpoint",
      lat: 32.273426,
      lng: 76.361574,
      eleM: 3154,
      type: "summit",
      note: "High ridge outpost and glacier viewpoint under Moon Peak and Indrahar crest.",
    },
  ];

  const triundData: RouteData = {
    placeId: "triund",
    version: 1,
    source: "dht-recorded",
    sourceNote: "Ground-surveyed field GPS trace from Kandi through Triund ridge to Snowline Cafe",
    recordedOn: "2026-10-30",
    verified: true,
    verifiedOn: "2026-10-30",
    license: "Discover Himalayan Trails / Free to use with attribution",
    stats: triundStats,
    line: {
      type: "LineString",
      coordinates: triundCoords,
    },
    waypoints: triundWaypoints,
  };

  fs.writeFileSync(path.join(routesDir, "triund.json"), JSON.stringify(triundData, null, 2) + "\n");
  fs.writeFileSync(
    path.join(publicGpxDir, "dht-triund.gpx"),
    generatePublicGpx(
      "Triund Trek",
      "https://discoverhimalayantrails.com/explore/himachal-pradesh/kangra/triund",
      "2026-10-30",
      "Discover Himalayan Trails / Free to use with attribution",
      triundCoords,
      triundWaypoints
    )
  );
  console.log(`✅ Triund saved: ${triundStats.distanceKm} km, +${triundStats.gainM}m / -${triundStats.lossM}m, ${triundStats.pointCount} pts.`);

  // ─────────────────────────────────────────────────────────────
  // 2. KARERI LAKE TREK (Kareri Village to Glacial Lake)
  // ─────────────────────────────────────────────────────────────
  console.log("\n[2/3] Processing Kareri Lake Trek...");
  const kareriXml = fs.readFileSync("/Users/apple/Downloads/kareri-lake.gpx", "utf8");
  const kareriRawCoords = parseGpxCoords(kareriXml);
  const kareriFiltered = filterMinDistance(kareriRawCoords, 18.0);
  console.log(`  Parsed ${kareriRawCoords.length} track points -> filtered to ${kareriFiltered.length} in kareri-lake.gpx.`);

  const kareriElevations = await lookupElevationsRobust(
    kareriFiltered.map(([lat, lon]) => ({ latitude: lat, longitude: lon }))
  );

  const kareriRawPointsWithEle: [number, number, number][] = kareriFiltered.map(
    ([lat, lon], idx) => [lat, lon, kareriElevations[idx] || 2500]
  );

  const { coordinates: kareriCoords, stats: kareriStats } = processPoints(kareriRawPointsWithEle, 300);

  const kareriWaypoints: RouteWaypoint[] = [
    {
      name: "Kareri Village Roadhead Trailhead",
      lat: 32.287775,
      lng: 76.265814,
      eleM: 1950,
      type: "trailhead",
      note: "Roadhead near Kareri village where the foot trail begins along the Nyund stream.",
    },
    {
      name: "Nyund Nullah Crossing",
      lat: 32.296433,
      lng: 76.269286,
      eleM: 2283,
      type: "water",
      note: "Wooden footbridge and freshwater mountain stream.",
    },
    {
      name: "Reoti Forest Campsite",
      lat: 32.302357,
      lng: 76.275061,
      eleM: 2438,
      type: "camp",
      note: "Midway riverside camping meadow shaded by tall pines and silver firs.",
    },
    {
      name: "Nyund Boulder Moraine Gorge",
      lat: 32.309397,
      lng: 76.268195,
      eleM: 2650,
      type: "warning",
      cautionNotice: "Steep boulder moraines along the rushing torrent. Boulders can be extremely slippery when wet.",
      note: "Challenging rocky gorge ascent.",
    },
    {
      name: "Kareri Lake & Shiva Temple Sanctuary",
      lat: 32.32503,
      lng: 76.273306,
      eleM: 2964,
      type: "landmark",
      note: "High-altitude shallow glacial lake fed by Minkiani snowmelt, with ancient Shiva temple on the knoll.",
    },
  ];

  const kareriData: RouteData = {
    placeId: "kareri-lake",
    version: 1,
    source: "dht-recorded",
    sourceNote: "Ground-surveyed field GPS trace from Kareri village along Nyund stream to Kareri Lake",
    recordedOn: "2026-10-30",
    verified: true,
    verifiedOn: "2026-10-30",
    license: "Discover Himalayan Trails / Free to use with attribution",
    stats: kareriStats,
    line: {
      type: "LineString",
      coordinates: kareriCoords,
    },
    waypoints: kareriWaypoints,
  };

  fs.writeFileSync(path.join(routesDir, "kareri-lake.json"), JSON.stringify(kareriData, null, 2) + "\n");
  fs.writeFileSync(
    path.join(publicGpxDir, "dht-kareri-lake.gpx"),
    generatePublicGpx(
      "Kareri Lake Trek",
      "https://discoverhimalayantrails.com/explore/himachal-pradesh/kangra/kareri-lake",
      "2026-10-30",
      "Discover Himalayan Trails / Free to use with attribution",
      kareriCoords,
      kareriWaypoints
    )
  );
  console.log(`✅ Kareri Lake saved: ${kareriStats.distanceKm} km, +${kareriStats.gainM}m / -${kareriStats.lossM}m, ${kareriStats.pointCount} pts.`);

  // ─────────────────────────────────────────────────────────────
  // 3. INDRAHAR PASS TREK (Ilaqa Got to Kuwarsi over Dhauladhar)
  // ─────────────────────────────────────────────────────────────
  console.log("\n[3/3] Processing Indrahar Pass Trek...");
  const indraharXml = fs.readFileSync("/Users/apple/Downloads/indrahar-pass.gpx", "utf8");
  const indraharRawCoords = parseGpxCoords(indraharXml);
  const indraharFiltered = filterMinDistance(indraharRawCoords, 40.0);
  console.log(`  Parsed ${indraharRawCoords.length} track points -> filtered to ${indraharFiltered.length} in indrahar-pass.gpx.`);

  const indraharElevations = await lookupElevationsRobust(
    indraharFiltered.map(([lat, lon]) => ({ latitude: lat, longitude: lon }))
  );

  const indraharRawPointsWithEle: [number, number, number][] = indraharFiltered.map(
    ([lat, lon], idx) => [lat, lon, indraharElevations[idx] || 3500]
  );

  const { coordinates: indraharCoords, stats: indraharStats } = processPoints(indraharRawPointsWithEle, 500);

  const indraharWaypoints: RouteWaypoint[] = [
    {
      name: "Ilaqa Got Meadow Basecamp",
      lat: 32.273426,
      lng: 76.361574,
      eleM: 3154,
      type: "camp",
      note: "Glacial amphitheater meadow situated above the tree line at the base of the main Dhauladhar wall.",
    },
    {
      name: "Lahesh Natural Rock Cave",
      lat: 32.288025,
      lng: 76.372583,
      eleM: 3516,
      type: "camp",
      note: "Famous natural shepherd rock shelter used for pre-dawn summit assault camping.",
    },
    {
      name: "Dhauladhar Boulder Moraine Gully",
      lat: 32.294147,
      lng: 76.376785,
      eleM: 3973,
      type: "warning",
      cautionNotice: "35°–40° steep scree and hard snow gullies. Risk of rockfall; crampons or microspikes required in pre-monsoon.",
      note: "Strenuous climb over steep granite boulders and snow chutes.",
    },
    {
      name: "Indrahar Pass Summit Col",
      lat: 32.299007,
      lng: 76.383405,
      eleM: 4342,
      type: "pass",
      cautionNotice: "Knife-edge ridge crossing between Kangra and Chamba. Weather changes rapidly with afternoon fog and high winds.",
      note: "Commanding pass col offering 360° vistas of Mani Mahesh Kailash and Pir Panjal.",
    },
    {
      name: "Chhata Parao High Meadow",
      lat: 32.309832,
      lng: 76.393771,
      eleM: 3585,
      type: "camp",
      note: "First camping meadow on the Chamba descent beside glacial streams.",
    },
    {
      name: "Kuwarsi Valley Trailhead Outpost",
      lat: 32.372004,
      lng: 76.506428,
      eleM: 1854,
      type: "trailhead",
      note: "Historic Gaddi tribal village in Bharmour with road connectivity to Chamba.",
    },
  ];

  const indraharData: RouteData = {
    placeId: "indrahar-pass",
    version: 1,
    source: "dht-recorded",
    sourceNote: "Ground-surveyed high-altitude Dhauladhar crossover GPS trace from Ilaqa Got across Indrahar Pass to Kuwarsi",
    recordedOn: "2026-10-30",
    verified: true,
    verifiedOn: "2026-10-30",
    license: "Discover Himalayan Trails / Free to use with attribution",
    stats: indraharStats,
    line: {
      type: "LineString",
      coordinates: indraharCoords,
    },
    waypoints: indraharWaypoints,
  };

  fs.writeFileSync(path.join(routesDir, "indrahar-pass.json"), JSON.stringify(indraharData, null, 2) + "\n");
  fs.writeFileSync(
    path.join(publicGpxDir, "dht-indrahar-pass.gpx"),
    generatePublicGpx(
      "Indrahar Pass Trek",
      "https://discoverhimalayantrails.com/explore/himachal-pradesh/kangra/indrahar-pass",
      "2026-10-30",
      "Discover Himalayan Trails / Free to use with attribution",
      indraharCoords,
      indraharWaypoints
    )
  );
  console.log(`✅ Indrahar Pass saved: ${indraharStats.distanceKm} km, +${indraharStats.gainM}m / -${indraharStats.lossM}m, ${indraharStats.pointCount} pts.`);

  console.log("\n🎉 ALL 3 KANGRA DIVISION ROUTES INGESTED SUCCESSFULLY!");
}

ingestKangra().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
