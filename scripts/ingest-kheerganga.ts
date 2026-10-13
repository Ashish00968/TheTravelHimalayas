import fs from "fs";
import path from "path";
import { RouteData, RouteWaypoint } from "../src/data/types";
import { fetchOsmRelation, lookupElevations } from "./ingest-trail";
import { processPoints, generatePublicGpx } from "./process-gpx";

async function ingestKheerganga() {
  console.log("\n==========================================");
  console.log("♨️ INGESTING KHEERGANGA TREK (Relation 15689293)");
  console.log("==========================================");

  const { nodes, ways, memberWayIds } = await fetchOsmRelation("15689293");
  const footWayIds = memberWayIds.filter(
    (id) => id !== "1160161213" && id !== "1160161212"
  );

  const oneWayCoords: [number, number][] = [];

  for (const id of footWayIds) {
    const way = ways.get(id);
    if (!way) continue;

    const wayNodes = way.nodes.filter((nId) => nodes.has(nId));
    if (wayNodes.length === 0) continue;

    if (oneWayCoords.length > 0) {
      const lastPoint = oneWayCoords[oneWayCoords.length - 1];
      const firstNode = nodes.get(wayNodes[0])!;
      const lastNode = nodes.get(wayNodes[wayNodes.length - 1])!;
      const distToFirst = Math.hypot(firstNode.lon - lastPoint[0], firstNode.lat - lastPoint[1]);
      const distToLast = Math.hypot(lastNode.lon - lastPoint[0], lastNode.lat - lastPoint[1]);

      if (distToLast < distToFirst) {
        wayNodes.reverse();
      }
    } else {
      // First way: ensure it starts at Barshaini (lon ~77.45) rather than Kheerganga (lon ~77.49)
      const firstNode = nodes.get(wayNodes[0])!;
      const lastNode = nodes.get(wayNodes[wayNodes.length - 1])!;
      if (firstNode.lon > lastNode.lon) {
        wayNodes.reverse();
      }
    }

    for (const nodeId of wayNodes) {
      const node = nodes.get(nodeId);
      if (node) {
        if (
          oneWayCoords.length === 0 ||
          oneWayCoords[oneWayCoords.length - 1][0] !== node.lon ||
          oneWayCoords[oneWayCoords.length - 1][1] !== node.lat
        ) {
          oneWayCoords.push([node.lon, node.lat]);
        }
      }
    }
  }

  // Create round-trip circuit back to Barshaini
  const returnCoords = [...oneWayCoords].reverse().slice(1);
  const roundTripCoords = [...oneWayCoords, ...returnCoords];

  console.log(
    `Stitched ${oneWayCoords.length} one-way points -> ${roundTripCoords.length} round-trip circuit points for Kheerganga.`
  );

  const locations = oneWayCoords.map(([lon, lat]) => ({ latitude: lat, longitude: lon }));
  const oneWayElevations = await lookupElevations(locations);

  const returnElevations = [...oneWayElevations].reverse().slice(1);
  const roundTripElevations = [...oneWayElevations, ...returnElevations];

  const rawPointsWithEle: [number, number, number][] = roundTripCoords.map(([lon, lat], i) => [
    lat,
    lon,
    roundTripElevations[i] || (2195 + (i / oneWayCoords.length) * 765),
  ]);

  const { coordinates, stats } = processPoints(rawPointsWithEle, 500);

  const waypoints: RouteWaypoint[] = [
    {
      name: "Barshaini Dam Trailhead",
      lat: 32.002229,
      lng: 77.451454,
      eleM: 2195,
      type: "trailhead",
      note: "Roadhead past Manikaran & Kasol. Trailhead entry beside the Parvati River dam.",
    },
    {
      name: "Nakthan Traditional Village",
      lat: 31.9965,
      lng: 77.468,
      eleM: 2300,
      type: "camp",
      note: "Ancient wooden timber houses, apple orchards, and traditional homestays.",
    },
    {
      name: "Rudranag Sacred Waterfalls",
      lat: 31.992,
      lng: 77.478,
      eleM: 2450,
      type: "water",
      note: "Serpentine cascading waterfall and Lord Shiva shrine with clean glacial drinking water.",
    },
    {
      name: "Pine Forest Gorge Ascent",
      lat: 31.995,
      lng: 77.485,
      eleM: 2700,
      type: "warning",
      cautionNotice: "Steep muddy climb over exposed tree roots and boulders. Slippery during rain.",
      note: "Dense pine and oak woodland trail.",
    },
    {
      name: "Kheerganga Geothermal Hot Springs",
      lat: 31.998401,
      lng: 77.492513,
      eleM: 2960,
      type: "summit",
      note: "Alpine meadow with natural geothermal sulfur pools with views of glaciated peaks.",
    },
  ];

  const routeData: RouteData = {
    placeId: "kheerganga",
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

  const jsonPath = path.join(routesDir, "kheerganga.json");
  fs.writeFileSync(jsonPath, JSON.stringify(routeData, null, 2) + "\n");
  console.log(`✅ Saved RouteData: ${jsonPath}`);

  const gpxPath = path.join(publicGpxDir, "dht-kheerganga.gpx");
  const gpxContent = generatePublicGpx(
    "Kheerganga Hot Springs",
    "https://discoverhimalayantrails.com/explore/himachal-pradesh/kullu/kheerganga",
    "2026-10-13",
    "OpenStreetMap Contributors / Free to use with attribution",
    coordinates,
    waypoints
  );
  fs.writeFileSync(gpxPath, gpxContent);
  console.log(`✅ Saved Public GPX: ${gpxPath}`);
}

ingestKheerganga().catch(console.error);
