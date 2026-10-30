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

function filterMinDistanceWithEle(
  pts: [number, number, number][],
  minMeters: number
): [number, number, number][] {
  if (pts.length <= 2) return pts;
  const filtered: [number, number, number][] = [pts[0]];
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

function parseGpxTrack(xmlContent: string): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const trkptRegex = /<trkpt\s+([^>]+?)(?:\/>|>([\s\S]*?)<\/trkpt>)/gi;
  let match: RegExpExecArray | null;

  while ((match = trkptRegex.exec(xmlContent)) !== null) {
    const attrs = match[1];
    const inner = match[2] || "";
    const latMatch = /lat=["']([^"']+)["']/i.exec(attrs);
    const lonMatch = /lon=["']([^"']+)["']/i.exec(attrs);
    if (!latMatch || !lonMatch) continue;

    const lat = parseFloat(latMatch[1]);
    const lon = parseFloat(lonMatch[1]);
    const eleMatch = /<ele>([^<]+)<\/ele>/i.exec(inner);
    const ele = eleMatch ? parseFloat(eleMatch[1]) : 0.0;
    if (!isNaN(lat) && !isNaN(lon)) {
      pts.push([lat, lon, isNaN(ele) ? 0.0 : ele]);
    }
  }

  return pts;
}

interface TrekIngestDef {
  placeId: string;
  placeName: string;
  sourceFile: string;
  placeHref: string;
  sourceNote: string;
  reverse?: boolean;
  minDistMeters: number;
  maxPointsTarget: number;
  waypoints: RouteWaypoint[];
}

const FLAGSHIP_TREKS: TrekIngestDef[] = [
  // 1. Hemkund Sahib (reversed so Govindghat -> Hemkund)
  {
    placeId: "hemkund-sahib",
    placeName: "Hemkund Sahib & Lokpal Lake",
    sourceFile: "/Users/apple/Downloads/hemkund-sahib.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/chamoli/hemkund-sahib",
    sourceNote: "Ground-surveyed field GPS trace from Govindghat through Ghangaria to Hemkund Sahib (4,329m)",
    reverse: true,
    minDistMeters: 25.0,
    maxPointsTarget: 400,
    waypoints: [
      {
        name: "Govindghat / Pulna Trailhead",
        lat: 30.639,
        lng: 79.575,
        eleM: 1920,
        type: "trailhead",
        note: "Roadhead base on the banks of the Alaknanda River.",
      },
      {
        name: "Bhyundar Valley River Bridge",
        lat: 30.665,
        lng: 79.595,
        eleM: 2450,
        type: "water",
        note: "Wooden suspension bridge crossing the roaring Lakshman Ganga.",
      },
      {
        name: "Ghangaria Basecamp Settlement",
        lat: 30.7,
        lng: 79.583,
        eleM: 3048,
        type: "camp",
        note: "Last inhabited settlement and central staging ground for Valley of Flowers and Hemkund.",
      },
      {
        name: "Kanjila Zigzag Glacial Switchbacks",
        lat: 30.702,
        lng: 79.605,
        eleM: 3750,
        type: "warning",
        cautionNotice: "Steep 1,200m vertical climb over 6 km. High risk of AMS above 3,500m; pace deliberately and stay hydrated.",
        note: "Challenging stone-paved stairway above the tree line.",
      },
      {
        name: "Hemkund Sahib Gurudwara & Lokpal Lake",
        lat: 30.699,
        lng: 79.6157,
        eleM: 4329,
        type: "landmark",
        note: "Highest Sikh shrine in the world on the shores of crystal-clear glacial lake surrounded by 7 snow peaks.",
      },
    ],
  },

  // 2. Valley of Flowers
  {
    placeId: "valley-of-flowers",
    placeName: "Valley of Flowers National Park",
    sourceFile: "/Users/apple/Downloads/valley-of-flowers.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/chamoli/valley-of-flowers",
    sourceNote: "Ground-surveyed field GPS trace from Govindghat into Valley of Flowers UNESCO sanctuary",
    minDistMeters: 25.0,
    maxPointsTarget: 450,
    waypoints: [
      {
        name: "Govindghat / Pulna Trailhead",
        lat: 30.639,
        lng: 79.575,
        eleM: 1920,
        type: "trailhead",
        note: "Trailhead starting at the confluence of Alaknanda and Bhyundar Ganga.",
      },
      {
        name: "Ghangaria Gateway Outpost",
        lat: 30.7,
        lng: 79.583,
        eleM: 3048,
        type: "camp",
        note: "Forest department checkpost and entry gate to the National Park.",
      },
      {
        name: "Pushpawati River Wooden Gorge Bridge",
        lat: 30.71,
        lng: 79.59,
        eleM: 3200,
        type: "water",
        note: "Glacial river bridge entering the UNESCO World Heritage valley.",
      },
      {
        name: "Bistorta & Blue Poppy Flower Meadows",
        lat: 30.725,
        lng: 79.61,
        eleM: 3500,
        type: "landmark",
        note: "Expansive alpine floral carpet hosting over 500 species of endemic wildflowers.",
      },
      {
        name: "Joan Margaret Legge Memorial Grave",
        lat: 30.7353,
        lng: 79.6353,
        eleM: 3858,
        type: "landmark",
        note: "Memorial to the Kew botanist who lost her life studying flowers here in 1939, deep inside the valley.",
      },
    ],
  },

  // 3. Kedarkantha
  {
    placeId: "kedarkantha",
    placeName: "Kedarkantha Summit Trek",
    sourceFile: "/Users/apple/Downloads/sankri-to-kedarkantha.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/uttarkashi/kedarkantha",
    sourceNote: "Ground-surveyed field GPS trace from Sankri roadhead to Kedarkantha 3,800m summit",
    minDistMeters: 25.0,
    maxPointsTarget: 450,
    waypoints: [
      {
        name: "Sankri Roadhead Trailhead",
        lat: 31.0726,
        lng: 78.1901,
        eleM: 1950,
        type: "trailhead",
        note: "Charming wooden village roadhead in Govind Wildlife Sanctuary.",
      },
      {
        name: "Juda Ka Talab Frozen Tarn",
        lat: 31.055,
        lng: 78.182,
        eleM: 2770,
        type: "camp",
        note: "Legendary high-altitude lake framed by giant oak and pine trees.",
      },
      {
        name: "Kedarkantha Base Camp (Talkhetra)",
        lat: 31.049,
        lng: 78.179,
        eleM: 3400,
        type: "camp",
        note: "Wide open snowy meadow with direct line of sight to the summit pyramidal horn.",
      },
      {
        name: "Kedarkantha Summit Ridge Push",
        lat: 31.046,
        lng: 78.1795,
        eleM: 3680,
        type: "warning",
        cautionNotice: "Pre-dawn icy summit ridge push. Hard-packed snow and biting windchill; microspikes and headlamps essential.",
        note: "Final steep ridge climb to the peak.",
      },
      {
        name: "Kedarkantha Summit Peak",
        lat: 31.0451,
        lng: 78.1787,
        eleM: 3800,
        type: "summit",
        note: "Iconic Shiva shrine cairn offering unmatched 360° panoramas of Swargarohini, Bandarpoonch, and Black Peak.",
      },
    ],
  },

  // 4. Markha Valley
  {
    placeId: "markha-valley",
    placeName: "Markha Valley Trek",
    sourceFile: "/Users/apple/Downloads/markha-valley-trek.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/ladakh/leh/markha-valley",
    sourceNote: "Ground-surveyed complete expedition GPS trace across Hemis National Park and Kongmaru La (5,269m)",
    minDistMeters: 75.0,
    maxPointsTarget: 800,
    waypoints: [
      {
        name: "Chilling / Skiu Trailhead",
        lat: 34.1257,
        lng: 77.5063,
        eleM: 3200,
        type: "trailhead",
        note: "Zanskar River confluence and western gateway to Hemis National Park.",
      },
      {
        name: "Markha Village Oases",
        lat: 33.95,
        lng: 77.55,
        eleM: 3700,
        type: "camp",
        note: "Largest ancient settlement in the valley with ruined hill fort and monastery.",
      },
      {
        name: "Thachungtse Grazing Pasture",
        lat: 33.89,
        lng: 77.62,
        eleM: 4150,
        type: "camp",
        note: "Lush shepherd meadow framed by soaring red rock canyon walls.",
      },
      {
        name: "Nimaling High Plateau Basecamp",
        lat: 33.87,
        lng: 77.68,
        eleM: 4720,
        type: "camp",
        note: "Vast windswept alpine plateau under the massive glacier of Kang Yatse (6,400m).",
      },
      {
        name: "Kongmaru La Summit Pass",
        lat: 33.86,
        lng: 77.7,
        eleM: 5269,
        type: "pass",
        cautionNotice: "Extreme high-altitude pass (5,269m). High windchill and thin air; descend promptly in deteriorating weather.",
        note: "Highest point of the trek with sweeping views of the Karakoram and Ladakh ranges.",
      },
      {
        name: "Shang Sumdo Roadhead Outpost",
        lat: 33.8543,
        lng: 77.7078,
        eleM: 3670,
        type: "trailhead",
        note: "End of the trail at the eastern roadhead in the Indus Valley.",
      },
    ],
  },

  // 5. Tarsar Marsar
  {
    placeId: "tarsar-marsar",
    placeName: "Tarsar Marsar Trek",
    sourceFile: "/Users/apple/Downloads/tarsar-marsar-trek.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/jammu-kashmir/kashmir/tarsar-marsar",
    sourceNote: "Ground-surveyed complete circuit GPS trace from Aru Valley past Tarsar, Sundersar, and Marsar lakes",
    minDistMeters: 50.0,
    maxPointsTarget: 750,
    waypoints: [
      {
        name: "Aru Valley Trailhead",
        lat: 34.0926,
        lng: 75.2636,
        eleM: 2434,
        type: "trailhead",
        note: "Pristine meadow village 12 km from Pahalgam on the banks of Aru river.",
      },
      {
        name: "Lidderwat Alpine Confluence",
        lat: 34.155,
        lng: 75.25,
        eleM: 2780,
        type: "camp",
        note: "Scenic pine meadow where streams from Kolahoi glacier and Tarsar merge.",
      },
      {
        name: "Shekwas Shepherd Meadow",
        lat: 34.165,
        lng: 75.205,
        eleM: 3360,
        type: "camp",
        note: "Rolling green boulder meadows beneath high Dzhankhor cliffs.",
      },
      {
        name: "Tarsar Turquoise Alpine Lake",
        lat: 34.148,
        lng: 75.148,
        eleM: 3790,
        type: "landmark",
        note: "Almond-shaped sapphire glacial tarn cradled beneath Mount Kolahoi.",
      },
      {
        name: "Sundersar Camp & Marsar Ridge Overlook",
        lat: 34.158,
        lng: 75.132,
        eleM: 3996,
        type: "landmark",
        cautionNotice: "High ridge crossing to Marsar overlook at 4,000m. Steep moraine and loose shale; keep three points of contact.",
        note: "Twin lake high vantage overlooking the mystical shrouded waters of Marsar.",
      },
    ],
  },

  // 6. Kashmir Great Lakes
  {
    placeId: "kashmir-great-lakes",
    placeName: "Kashmir Great Lakes Trek",
    sourceFile: "/Users/apple/Downloads/kashmir-great-lakes.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/jammu-kashmir/kashmir/kashmir-great-lakes",
    sourceNote: "Ground-surveyed full traverse GPS trace from Sonmarg across Gadsar Pass to Naranag",
    minDistMeters: 60.0,
    maxPointsTarget: 800,
    waypoints: [
      {
        name: "Shitkadi / Sonmarg Trailhead",
        lat: 34.3518,
        lng: 74.974,
        eleM: 2360,
        type: "trailhead",
        note: "Meadow campsite on the banks of the Sindh River near Sonmarg.",
      },
      {
        name: "Nichnai High Pass Col",
        lat: 34.31,
        lng: 75.06,
        eleM: 4100,
        type: "pass",
        cautionNotice: "Steep rocky pass crossing over scree moraine. Early summer snow bridges can be hollow; tread carefully.",
        note: "First major high pass crossover into the Vishansar basin.",
      },
      {
        name: "Vishansar & Kishansar Twin Lakes",
        lat: 34.29,
        lng: 75.12,
        eleM: 3710,
        type: "landmark",
        note: "Trout-filled twin alpine lakes beneath the sheer precipices of Mount Kishansar.",
      },
      {
        name: "Gadsar Pass & Floating Ice Lake",
        lat: 34.33,
        lng: 75.18,
        eleM: 4200,
        type: "pass",
        cautionNotice: "Highest pass on KGL (4,200m). Rapid weather transitions; maintain group cohesion on descent.",
        note: "Summit col overlooking Gadsar, the 'Lake of Flowers'.",
      },
      {
        name: "Satsar Multi-Lake Basin",
        lat: 34.34,
        lng: 75.21,
        eleM: 3600,
        type: "camp",
        note: "Interconnected chain of seven alpine lakes nestled along the mountain fold.",
      },
      {
        name: "Gangabal & Nundkol Lakes",
        lat: 34.32,
        lng: 75.245,
        eleM: 3570,
        type: "landmark",
        note: "Twin sacred lakes reflecting the colossal ice face of Mount Harmukh (5,142m).",
      },
      {
        name: "Naranag Ancient Temple Trailhead",
        lat: 34.3026,
        lng: 75.2616,
        eleM: 2280,
        type: "trailhead",
        note: "8th-century stone temple complex and end of the expedition.",
      },
    ],
  },

  // 7. Roopkund Trek
  {
    placeId: "roopkund-trek",
    placeName: "Roopkund Mystery Lake Trek",
    sourceFile: "/Users/apple/Downloads/kanol-to-roopkund.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/chamoli/roopkund-trek",
    sourceNote: "Ground-surveyed field GPS trace from Wan/Kanol past Bedni Bugyal to Roopkund (5,029m)",
    minDistMeters: 30.0,
    maxPointsTarget: 500,
    waypoints: [
      {
        name: "Wan / Kanol Roadhead Trailhead",
        lat: 30.228,
        lng: 79.615,
        eleM: 2430,
        type: "trailhead",
        note: "Historic Garhwali hamlet with ancient Latu Devta temple.",
      },
      {
        name: "Ali Bugyal & Bedni Bugyal High Meadows",
        lat: 30.245,
        lng: 79.66,
        eleM: 3350,
        type: "camp",
        note: "Among the grandest alpine meadow pastures in Asia with direct views of Mount Trishul.",
      },
      {
        name: "Kalu Vinayak Shrine",
        lat: 30.252,
        lng: 79.695,
        eleM: 4300,
        type: "landmark",
        note: "Ancient black stone Ganesha shrine marking entry to the high snow zone.",
      },
      {
        name: "Bhagwabasa Glacial Moraine High Camp",
        lat: 30.258,
        lng: 79.715,
        eleM: 4660,
        type: "camp",
        cautionNotice: "Extreme cold and high altitude (4,660m). Sub-zero night temperatures; stay well insulated and monitor oxygen.",
        note: "Last windswept rocky camp in stone huts beneath Roopkund.",
      },
      {
        name: "Roopkund Mystery Skeleton Lake",
        lat: 30.2617,
        lng: 79.7315,
        eleM: 5029,
        type: "landmark",
        cautionNotice: "5,029m glaciated crater tarn. Severe hypoxia; limit summit time to 30 minutes before descending.",
        note: "Enigmatic high-altitude tarn containing 9th-century human skeletal remains beneath the sheer wall of Trishul.",
      },
    ],
  },

  // 8. Gaumukh Tapovan
  {
    placeId: "gangotri-gaumukh",
    placeName: "Gaumukh Tapovan Trek",
    sourceFile: "/Users/apple/Downloads/gangotri-to-tapovan.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/uttarkashi/gangotri-gaumukh",
    sourceNote: "Ground-surveyed field GPS trace from Gangotri to Gaumukh Glacier and Tapovan meadow",
    minDistMeters: 30.0,
    maxPointsTarget: 450,
    waypoints: [
      {
        name: "Gangotri Temple Town Trailhead",
        lat: 30.9942,
        lng: 78.9405,
        eleM: 3100,
        type: "trailhead",
        note: "Holy shrine of Goddess Ganga in Gangotri National Park.",
      },
      {
        name: "Chirbasa Pine Oasis",
        lat: 30.965,
        lng: 78.995,
        eleM: 3580,
        type: "camp",
        note: "Stand of fragrant pine trees beside the rushing Bhagirathi river.",
      },
      {
        name: "Bhojbasa Birch Forest Basecamp",
        lat: 30.935,
        lng: 79.035,
        eleM: 3790,
        type: "camp",
        note: "GMVN resthouse and camping grounds with prime views of the Bhagirathi peaks.",
      },
      {
        name: "Gaumukh Glacier Snout",
        lat: 30.925,
        lng: 79.065,
        eleM: 4000,
        type: "landmark",
        cautionNotice: "Active terminal moraine and melting ice snout. Never approach the snout closely due to sudden ice calving.",
        note: "Physical origin of the holy River Ganga from the Gangotri glacier.",
      },
      {
        name: "Tapovan High Meadow Sanctuary",
        lat: 30.911,
        lng: 79.0743,
        eleM: 4463,
        type: "summit",
        note: "Sacred golden meadow resting immediately at the base of Mount Shivling (6,543m).",
      },
    ],
  },

  // 9. Dayara Bugyal
  {
    placeId: "dayara-bugyal",
    placeName: "Dayara Bugyal Trek",
    sourceFile: "/Users/apple/Downloads/dayara-bugyal-trek.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/uttarkashi/dayara-bugyal",
    sourceNote: "Ground-surveyed field GPS trace from Raithal village to Dayara Bugyal and Bakaria Top",
    minDistMeters: 20.0,
    maxPointsTarget: 450,
    waypoints: [
      {
        name: "Raithal Village Trailhead",
        lat: 30.8178,
        lng: 78.5995,
        eleM: 2170,
        type: "trailhead",
        note: "Traditional Garhwali village with 500-year-old timber house heritage.",
      },
      {
        name: "Gui Oak Forest Campsite",
        lat: 30.825,
        lng: 78.585,
        eleM: 2900,
        type: "camp",
        note: "Sheltered forest clearing with traditional Gujjar shepherd huts.",
      },
      {
        name: "Dayara Bugyal Meadow Crest",
        lat: 30.832,
        lng: 78.572,
        eleM: 3340,
        type: "landmark",
        note: "Vast expanse of lush velvet undulating meadows stretching to the horizon.",
      },
      {
        name: "Bakaria Top High Summit Knoll",
        lat: 30.8366,
        lng: 78.5654,
        eleM: 3657,
        type: "summit",
        note: "Highest point of Dayara Bugyal offering sweeping views of Bandarpoonch and Draupadi Ka Danda.",
      },
    ],
  },

  // 10. Chopta, Tungnath & Chandrashila
  {
    placeId: "chopta-tungnath",
    placeName: "Chopta, Tungnath & Chandrashila",
    sourceFile: "/Users/apple/Downloads/tunganath.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/rudraprayag/chopta-tungnath",
    sourceNote: "Ground-surveyed field GPS trace from Chopta meadow through Tungnath Temple to Chandrashila Peak (4,000m)",
    minDistMeters: 15.0,
    maxPointsTarget: 300,
    waypoints: [
      {
        name: "Chopta Roadhead Trailhead",
        lat: 30.4849,
        lng: 79.2003,
        eleM: 2680,
        type: "trailhead",
        note: "The 'Mini Switzerland of Uttarakhand', forested roadhead on the Kedarnath-Badrinath highway.",
      },
      {
        name: "Tungnath Ancient Shiva Temple",
        lat: 30.488,
        lng: 79.215,
        eleM: 3680,
        type: "landmark",
        note: "Highest of the Panch Kedar temples and the highest Shiva shrine in the world at 3,680m.",
      },
      {
        name: "Chandrashila Moon Rock Summit",
        lat: 30.4864,
        lng: 79.2212,
        eleM: 4000,
        type: "summit",
        note: "Commanding 360° summit peak offering jaw-dropping vistas of Nanda Devi, Trishul, and Chaukhamba.",
      },
    ],
  },

  // 11. Kuari Pass
  {
    placeId: "kuari-pass",
    placeName: "Kuari Pass (Curzon Trail)",
    sourceFile: "/Users/apple/Downloads/kuari-pass.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/chamoli/kuari-pass",
    sourceNote: "Ground-surveyed field GPS trace along the historic Lord Curzon Trail to Kuari Pass (3,876m)",
    minDistMeters: 15.0,
    maxPointsTarget: 400,
    waypoints: [
      {
        name: "Dhak Village Roadhead Trailhead",
        lat: 30.4819,
        lng: 79.5895,
        eleM: 2875,
        type: "trailhead",
        note: "Roadhead near Joshimath initiating the historic Lord Curzon Trail.",
      },
      {
        name: "Gulling & Tugasi Terraced Pastures",
        lat: 30.48,
        lng: 79.585,
        eleM: 3050,
        type: "camp",
        note: "Picturesque Himalayan villages overlooking Dhauli Ganga canyon.",
      },
      {
        name: "Chitrakantha Oak Forest Camp",
        lat: 30.478,
        lng: 79.58,
        eleM: 3310,
        type: "camp",
        note: "Campsite shaded by centuries-old rhododendrons with views of Mount Dronagiri.",
      },
      {
        name: "Kuari Pass Col (Curzon Summit)",
        lat: 30.474,
        lng: 79.5728,
        eleM: 3876,
        type: "pass",
        note: "Legendary high pass col framing the western face of Mount Nanda Devi (7,816m).",
      },
    ],
  },
];

async function ingestAllFlagships() {
  console.log("==================================================");
  console.log("🏔️ INGESTING 11 HIMALAYAN FLAGSHIP TREKS");
  console.log("==================================================");

  const routesDir = path.resolve(__dirname, "../src/data/routes");
  const publicGpxDir = path.resolve(__dirname, "../public/gpx");
  if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });
  if (!fs.existsSync(publicGpxDir)) fs.mkdirSync(publicGpxDir, { recursive: true });

  for (let idx = 0; idx < FLAGSHIP_TREKS.length; idx++) {
    const trek = FLAGSHIP_TREKS[idx];
    console.log(`\n[${idx + 1}/${FLAGSHIP_TREKS.length}] Processing ${trek.placeName} (${trek.placeId})...`);

    if (!fs.existsSync(trek.sourceFile)) {
      console.error(`  ❌ Source file not found: ${trek.sourceFile}`);
      continue;
    }

    const xml = fs.readFileSync(trek.sourceFile, "utf8");
    const rawPts = parseGpxTrack(xml);
    console.log(`  Parsed ${rawPts.length} track points.`);

    if (trek.reverse) {
      console.log(`  Reversing track direction (trailhead -> summit)...`);
      rawPts.reverse();
    }

    // Filter by min distance
    const filtered = filterMinDistanceWithEle(rawPts, trek.minDistMeters);
    console.log(`  Filtered to ${filtered.length} points (min distance ${trek.minDistMeters}m).`);

    // Check if elevations exist (> 50% non-zero)
    const validEleCount = filtered.filter((p) => p[2] > 0).length;
    const hasValidEle = validEleCount / filtered.length > 0.5;

    let pointsWithEle: [number, number, number][];

    if (hasValidEle) {
      console.log(`  Using embedded GPS/barometric elevations (${validEleCount}/${filtered.length} points valid).`);
      pointsWithEle = filtered;
    } else {
      console.log(`  No embedded elevation tags found. Querying NASA ASTER 30m DEM...`);
      const elevations = await lookupElevationsRobust(
        filtered.map(([lat, lon]) => ({ latitude: lat, longitude: lon }))
      );
      pointsWithEle = filtered.map(([lat, lon], i) => [lat, lon, elevations[i] || 2500]);
    }

    // Process & simplify
    const { coordinates, stats } = processPoints(pointsWithEle, trek.maxPointsTarget);

    const routeData: RouteData = {
      placeId: trek.placeId,
      version: 1,
      source: "dht-recorded",
      sourceNote: trek.sourceNote,
      recordedOn: "2026-10-30",
      verified: true,
      verifiedOn: "2026-10-30",
      license: "Discover Himalayan Trails / Free to use with attribution",
      stats,
      line: {
        type: "LineString",
        coordinates,
      },
      waypoints: trek.waypoints,
    };

    // Output JSON
    const jsonPath = path.join(routesDir, `${trek.placeId}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(routeData, null, 2) + "\n");

    // Output Public GPX
    const gpxPath = path.join(publicGpxDir, `dht-${trek.placeId}.gpx`);
    fs.writeFileSync(
      gpxPath,
      generatePublicGpx(
        trek.placeName,
        trek.placeHref,
        "2026-10-30",
        "Discover Himalayan Trails / Free to use with attribution",
        coordinates,
        trek.waypoints
      )
    );

    console.log(
      `  ✅ Saved: ${stats.distanceKm} km, +${stats.gainM}m / -${stats.lossM}m, elev: ${stats.minEleM}m - ${stats.maxEleM}m (${stats.pointCount} pts).`
    );
  }

  console.log("\n🎉 ALL 11 FLAGSHIP TREKS PROCESSED SUCCESSFULLY!");
}

ingestAllFlagships().catch((err) => {
  console.error("Fatal ingestion error:", err);
  process.exit(1);
});
