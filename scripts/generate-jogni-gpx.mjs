import fs from "node:fs";
import path from "node:path";

const jogniJsonPath = path.resolve(process.cwd(), "src/data/routes/jogni-falls.json");
const outputGpxPath = path.resolve(process.cwd(), "public/gpx/dht-jogni-falls.gpx");

const data = JSON.parse(fs.readFileSync(jogniJsonPath, "utf8"));

const coordinates = data.line.coordinates; // [lng, lat, ele]

const trkptTags = coordinates
  .map(
    ([lng, lat, ele]) =>
      `      <trkpt lat="${Number(lat).toFixed(6)}" lon="${Number(lng).toFixed(6)}"><ele>${Number(ele).toFixed(1)}</ele></trkpt>`
  )
  .join("\n");

const gpxXml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Discover Himalayan Trails" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Jogni Falls Trek (DHT route)</name>
    <desc>Route recorded by DHT on 2026-10-06. Conditions change. Not a substitute for a guide, local advice or weather checks.</desc>
    <author><name>Discover Himalayan Trails</name></author>
    <copyright author="Discover Himalayan Trails"><year>2026</year><license>Recorded by DHT. Free to use with credit.</license></copyright>
    <link href="https://discoverhimalayantrails.com/explore/himachal-pradesh/kullu/jogni-falls"><text>Trek page</text></link>
  </metadata>
  <trk>
    <name>Jogni Falls</name>
    <trkseg>
${trkptTags}
    </trkseg>
  </trk>
</gpx>
`;

fs.writeFileSync(outputGpxPath, gpxXml.trim() + "\n", "utf8");
console.log(`Successfully generated: ${outputGpxPath} (${(fs.statSync(outputGpxPath).size / 1024).toFixed(1)} KB, ${coordinates.length} points)`);
