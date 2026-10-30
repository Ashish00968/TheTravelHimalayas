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
  const targetId = process.argv[2];

  console.log("==================================================");
  console.log(`🏔️ INGESTING HIMACHAL PRADESH DIVISION 2: KANGRA ${targetId ? `(${targetId})` : ""}`);
  console.log("==================================================");

  const routesDir = path.resolve(__dirname, "../src/data/routes");
  const publicGpxDir = path.resolve(__dirname, "../public/gpx");
  if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });
  if (!fs.existsSync(publicGpxDir)) fs.mkdirSync(publicGpxDir, { recursive: true });

  if (!targetId || targetId === "triund") {
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
  }

  if (!targetId || targetId === "kareri-lake") {
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
  }

  if (!targetId || targetId === "indrahar-pass") {
  // ─────────────────────────────────────────────────────────────
  // 3. INDRAHAR PASS TREK (Galu Devi Temple to Indrahar Pass Circuit)
  // ─────────────────────────────────────────────────────────────
  console.log("\n[3/3] Processing Indrahar Pass Trek...");
  const indraharXml = fs.readFileSync("/Users/apple/Downloads/Indrahar_Pass_Trek.gpx", "utf8");

  // Parse track points with embedded elevations
  const trkptRegex = /<trkpt\s+([^>]+?)(?:\/>|>([\s\S]*?)<\/trkpt>)/gi;
  let match: RegExpExecArray | null;
  const indraharRawPointsWithEle: [number, number, number][] = [];
  while ((match = trkptRegex.exec(indraharXml)) !== null) {
    const attrs = match[1];
    const inner = match[2] || "";
    const latMatch = /lat=["\x27]([^"\x27]+)["\x27]/i.exec(attrs);
    const lonMatch = /lon=["\x27]([^"\x27]+)["\x27]/i.exec(attrs);
    if (!latMatch || !lonMatch) continue;
    const lat = parseFloat(latMatch[1]);
    const lon = parseFloat(lonMatch[1]);
    const eleMatch = /<ele>([^<]+)<\/ele>/i.exec(inner);
    const ele = eleMatch ? parseFloat(eleMatch[1]) : 0;
    if (!isNaN(lat) && !isNaN(lon)) {
      indraharRawPointsWithEle.push([lat, lon, ele]);
    }
  }

  // Filter min distance 15m
  const indraharFiltered: [number, number, number][] = [indraharRawPointsWithEle[0]];
  for (let i = 1; i < indraharRawPointsWithEle.length; i++) {
    const prev = indraharFiltered[indraharFiltered.length - 1];
    const curr = indraharRawPointsWithEle[i];
    if (haversineM(prev[0], prev[1], curr[0], curr[1]) >= 15.0) {
      indraharFiltered.push(curr);
    }
  }
  if (indraharFiltered[indraharFiltered.length - 1] !== indraharRawPointsWithEle[indraharRawPointsWithEle.length - 1]) {
    indraharFiltered.push(indraharRawPointsWithEle[indraharRawPointsWithEle.length - 1]);
  }

  const { coordinates: indraharCoords, stats: indraharStats } = processPoints(indraharFiltered, 450);

  const indraharWaypoints: RouteWaypoint[] = [
    {
      name: "Galu Devi Temple Trailhead",
      lat: 32.25434,
      lng: 76.32578,
      eleM: 2101,
      type: "trailhead",
      note: "Upper Dharamkot roadhead and primary gateway trailhead for Triund and Indrahar Pass.",
    },
    {
      name: "Magic View Cafe Ridge Junction",
      lat: 32.25637,
      lng: 76.34197,
      eleM: 2401,
      type: "water",
      note: "Historic tea shop and trail resting point on the rhododendron ridge overlooking Kangra valley.",
    },
    {
      name: "Triund Panoramic Ridge Plateau",
      lat: 32.26307,
      lng: 76.3541,
      eleM: 2853,
      type: "camp",
      note: "Expansive grassy ridge plateau directly beneath the sheer south face of Moon Peak.",
    },
    {
      name: "Snowline Cafe & Ilaqa Got Meadow",
      lat: 32.27117,
      lng: 76.35937,
      eleM: 3153,
      type: "camp",
      note: "Glacial amphitheater basecamp situated above the tree line at the base of the main Dhauladhar wall.",
    },
    {
      name: "Lahesh Natural Rock Cave",
      lat: 32.28786,
      lng: 76.37275,
      eleM: 3506,
      type: "camp",
      note: "Famous natural shepherd rock shelter used for pre-dawn summit assault camping.",
    },
    {
      name: "Dhauladhar Boulder Scree & Snow Gully",
      lat: 32.29294,
      lng: 76.37537,
      eleM: 3860,
      type: "warning",
      cautionNotice: "35°–40° steep boulder fields and hard snow gullies. Risk of rockfall; microspikes recommended in pre-monsoon.",
      note: "Strenuous scramble over steep granite boulders and snow chutes.",
    },
    {
      name: "Indrahar Pass Summit Col",
      lat: 32.29773,
      lng: 76.38111,
      eleM: 4334,
      type: "pass",
      cautionNotice: "Knife-edge ridge crossing between Kangra and Chamba. High winds and sudden afternoon mists; begin descent before noon.",
      note: "Commanding pass col offering 360° vistas of Mani Mahesh Kailash and the Pir Panjal range.",
    },
  ];

  const indraharData: RouteData = {
    placeId: "indrahar-pass",
    version: 1,
    source: "dht-recorded",
    sourceNote: "Ground-surveyed field GPS trace from Galu Devi Temple via Triund, Ilaqa Got, and Lahesh Cave to Indrahar Pass",
    recordedOn: "2026-10-31",
    verified: true,
    verifiedOn: "2026-10-31",
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
      "2026-10-31",
      "Discover Himalayan Trails / Free to use with attribution",
      indraharCoords,
      indraharWaypoints
    )
  );
  console.log(`✅ Indrahar Pass saved: ${indraharStats.distanceKm} km, +${indraharStats.gainM}m / -${indraharStats.lossM}m, ${indraharStats.pointCount} pts.`);
  }

  console.log("\n🎉 ALL 3 KANGRA DIVISION ROUTES INGESTED SUCCESSFULLY!");
}

ingestKangra().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
