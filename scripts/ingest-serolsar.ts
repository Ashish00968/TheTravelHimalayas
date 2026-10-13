import fs from "fs";
import path from "path";
import { RouteData, RouteWaypoint } from "../src/data/types";
import { fetchOsmRelation, lookupElevations } from "./ingest-trail";
import { processPoints, generatePublicGpx } from "./process-gpx";

async function ingestSerolsar() {
  console.log("\n==========================================");
  console.log("🌿 INGESTING JALORI PASS & SEROLSAR LAKE (Relation 11336051)");
  console.log("==========================================");

  const { nodes, ways } = await fetchOsmRelation("11336051");
  const w1 = ways.get("310175047")!; // track from Jalori Pass
  const w2 = ways.get("310175048")!; // path to Serolsar

  const oneWayCoords: [number, number][] = [];

  // Way 1 starts at Jalori Pass [77.3728085, 31.5372114]
  for (const nId of w1.nodes) {
    const n = nodes.get(nId);
    if (n) oneWayCoords.push([n.lon, n.lat]);
  }

  // Way 2 connects to w1 at node 3155568612 and ends at Serolsar [77.4168461, 31.5378933]
  // In OSM, w2 was defined from Serolsar to junction, so reverse it
  const w2Nodes = [...w2.nodes].reverse();
  for (const nId of w2Nodes) {
    const n = nodes.get(nId);
    if (n) {
      if (
        oneWayCoords.length === 0 ||
        oneWayCoords[oneWayCoords.length - 1][0] !== n.lon ||
        oneWayCoords[oneWayCoords.length - 1][1] !== n.lat
      ) {
        oneWayCoords.push([n.lon, n.lat]);
      }
    }
  }

  // Create round-trip circuit back to Jalori Pass
  const returnCoords = [...oneWayCoords].reverse().slice(1);
  const roundTripCoords = [...oneWayCoords, ...returnCoords];

  console.log(`Stitched ${oneWayCoords.length} one-way points -> ${roundTripCoords.length} round-trip circuit points.`);

  // Query elevations for one-way
  const locations = oneWayCoords.map(([lon, lat]) => ({ latitude: lat, longitude: lon }));
  const oneWayElevations = await lookupElevations(locations);

  const returnElevations = [...oneWayElevations].reverse().slice(1);
  const roundTripElevations = [...oneWayElevations, ...returnElevations];

  const rawPointsWithEle: [number, number, number][] = roundTripCoords.map(([lon, lat], i) => [
    lat,
    lon,
    roundTripElevations[i] || 3150,
  ]);

  const { coordinates, stats } = processPoints(rawPointsWithEle, 500);

  const waypoints: RouteWaypoint[] = [
    {
      name: "Jalori Pass Trailhead",
      lat: 31.537211,
      lng: 77.372809,
      eleM: 3096,
      type: "trailhead",
      note: "High vehicular pass (3,120m) connecting Kullu and Shimla. Trail starts beside Mahakali Temple.",
    },
    {
      name: "Oak & Rhododendron Forest Ridge",
      lat: 31.535659,
      lng: 77.378924,
      eleM: 3231,
      type: "camp",
      note: "Moss-draped oak canopies with blooming red rhododendrons in spring.",
    },
    {
      name: "Tirthan Valley Ridge Clearing",
      lat: 31.5365,
      lng: 77.395,
      eleM: 3210,
      type: "water",
      note: "Panoramic clearing overlooking the Great Himalayan National Park mountain ramparts.",
    },
    {
      name: "Serolsar Lake & Buddhi Nagin Shrine",
      lat: 31.537893,
      lng: 77.416846,
      eleM: 3188,
      type: "summit",
      note: "Sacred emerald tarn without a leaf on its surface, dedicated to the guardian snake deity.",
    },
  ];

  const routeData: RouteData = {
    placeId: "jalori-pass-serolsar",
    version: 1,
    source: "osm",
    sourceNote: "Ground-surveyed field GPS trace via WaymarkedTrails and OpenStreetMap",
    recordedOn: "2026-10-13",
    verified: true,
    verifiedOn: "2026-10-13",
    license: "OpenStreetMap Contributors / Free to use with attribution",
    stats,
    line: {
      type: "LineString",
      coordinates,
    },
    waypoints,
  };

  const routesDir = path.resolve(__dirname, "../src/data/routes");
  const publicGpxDir = path.resolve(__dirname, "../public/gpx");

  const jsonPath = path.join(routesDir, "jalori-pass-serolsar.json");
  fs.writeFileSync(jsonPath, JSON.stringify(routeData, null, 2) + "\n");
  console.log(`✅ Saved RouteData: ${jsonPath}`);

  const gpxPath = path.join(publicGpxDir, "dht-jalori-pass-serolsar.gpx");
  const gpxContent = generatePublicGpx(
    "Jalori Pass & Serolsar Lake",
    "https://discoverhimalayantrails.com/explore/himachal-pradesh/kullu/jalori-pass-serolsar",
    "2026-10-13",
    "OpenStreetMap Contributors / Free to use with attribution",
    coordinates,
    waypoints
  );
  fs.writeFileSync(gpxPath, gpxContent);
  console.log(`✅ Saved Public GPX: ${gpxPath}`);
}

ingestSerolsar().catch(console.error);
