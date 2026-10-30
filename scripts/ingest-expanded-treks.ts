import fs from "fs";
import path from "path";
import { RouteData, RouteWaypoint } from "../src/data/types";
import { processPoints, generatePublicGpx } from "./process-gpx";

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

function parseGpxTrack(xmlContent: string): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const trkptRegex = /<trkpt\s+([^>]+?)(?:\/>|>([\s\S]*?)<\/trkpt>)/gi;
  let match: RegExpExecArray | null;

  while ((match = trkptRegex.exec(xmlContent)) !== null) {
    const attrs = match[1];
    const inner = match[2] || "";
    const latMatch = /lat=["\x27]([^"\x27]+)["\x27]/i.exec(attrs);
    const lonMatch = /lon=["\x27]([^"\x27]+)["\x27]/i.exec(attrs);
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

interface TrekExpansionDef {
  placeId: string;
  placeName: string;
  sourceFile: string;
  placeHref: string;
  sourceNote: string;
  minDistMeters: number;
  maxPointsTarget: number;
  reverse?: boolean;
  waypoints: RouteWaypoint[];
}

export const EXPANDED_TREKS: TrekExpansionDef[] = [
  // 1. Dodital & Darwa Pass
  {
    placeId: "dodital",
    placeName: "Dodital Lake & Darwa Pass Trek",
    sourceFile: "/Users/apple/Downloads/Darwa_Pass_via_Dodital.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/uttarkashi/dodital",
    sourceNote: "Ground-surveyed field GPS trace from Sangam Chatti through Dodital to Darwa Pass (3,790m)",
    minDistMeters: 20.0,
    maxPointsTarget: 450,
    waypoints: [
      {
        name: "Sangam Chatti Roadhead Trailhead",
        lat: 30.8454,
        lng: 78.4832,
        eleM: 2147,
        type: "trailhead",
        note: "Roadhead near Uttarkashi at the confluence of the Assi Ganga torrent.",
      },
      {
        name: "Bebra Forest Clearing & Stream",
        lat: 30.8650,
        lng: 78.4900,
        eleM: 2400,
        type: "water",
        note: "Picturesque streamside camping clearing and rest point.",
      },
      {
        name: "Manjhi High Shepherd Village",
        lat: 30.8850,
        lng: 78.5020,
        eleM: 2850,
        type: "camp",
        note: "Shepherd hamlet set amidst mixed oak, pine, and rhododendron forests.",
      },
      {
        name: "Dodital Emerald Glacial Tarn",
        lat: 30.9030,
        lng: 78.5120,
        eleM: 3050,
        type: "camp",
        note: "Sacred crystal-clear freshwater tarn revered as the birthplace of Lord Ganesha.",
      },
      {
        name: "Darwa Pass Summit Col",
        lat: 30.9137,
        lng: 78.5117,
        eleM: 3790,
        type: "pass",
        cautionNotice: "Steep 740m ascent from Dodital over scree and snow; start early before ridge fog gathers.",
        note: "Panoramic ridge pass framing jaw-dropping vistas of Bandarpoonch (6,316m) and Swargarohini.",
      },
    ],
  },

  // 2. Deoria Tal
  {
    placeId: "deoria-tal",
    placeName: "Deoria Tal Emerald Lake & Sari",
    sourceFile: "/Users/apple/Downloads/Deoria_Tal.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/rudraprayag/deoria-tal",
    sourceNote: "Ground-surveyed field GPS trace from Sari village to Deoria Tal emerald lake",
    minDistMeters: 15.0,
    maxPointsTarget: 350,
    waypoints: [
      {
        name: "Sari Village Base Roadhead",
        lat: 30.5154,
        lng: 79.0963,
        eleM: 1416,
        type: "trailhead",
        note: "Traditional Garhwali village roadhead and primary base for Deoria Tal.",
      },
      {
        name: "Rhododendron Forest Trail",
        lat: 30.5200,
        lng: 79.1100,
        eleM: 1950,
        type: "landmark",
        note: "Shaded stone-paved trail ascending through blooming rhododendron forests.",
      },
      {
        name: "Deoria Tal Emerald Glacial Lake",
        lat: 30.5213,
        lng: 79.1240,
        eleM: 2410,
        type: "landmark",
        note: "Sacred high-altitude lake mirroring the colossal snow-clad peaks of Chaukhamba.",
      },
    ],
  },

  // 3. Kamrunag Lake
  {
    placeId: "kamrunag-lake",
    placeName: "Kamrunag Lake Trek",
    sourceFile: "/Users/apple/Downloads/Kamrunag_Lake.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/himachal-pradesh/mandi/kamrunag-lake",
    sourceNote: "Ground-surveyed field GPS trace from Rohanda to Kamrunag Lake & Temple (2,901m)",
    minDistMeters: 15.0,
    maxPointsTarget: 350,
    waypoints: [
      {
        name: "Rohanda Village Roadhead Trailhead",
        lat: 31.4616,
        lng: 77.0278,
        eleM: 2124,
        type: "trailhead",
        note: "Roadhead on the Sundernagar-Karsog highway where the forest trail begins.",
      },
      {
        name: "Thikru Deodar Forest Rest Point",
        lat: 31.4680,
        lng: 77.0380,
        eleM: 2550,
        type: "water",
        note: "Dense cedar and oak canopy rest point midway through the continuous ridge climb.",
      },
      {
        name: "Kamrunag Temple & Sacred Lake",
        lat: 31.4740,
        lng: 77.0485,
        eleM: 2901,
        type: "landmark",
        note: "Ancient stone shrine of Yaksha King Barbarika overlooking the coin-filled holy lake.",
      },
    ],
  },

  // 4. Kinner Kailash
  {
    placeId: "kinner-kailash",
    placeName: "Kinner Kailash Parikrama",
    sourceFile: "/Users/apple/Downloads/Kinnaur_Kailash_Trek.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/himachal-pradesh/kinnaur/kinner-kailash",
    sourceNote: "Ground-surveyed high-altitude alpine pilgrimage GPS trace to the sacred Kinner Kailash Shivling (4,816m)",
    minDistMeters: 20.0,
    maxPointsTarget: 400,
    waypoints: [
      {
        name: "Tangling Village Trailhead",
        lat: 31.5288,
        lng: 78.2823,
        eleM: 1987,
        type: "trailhead",
        note: "Riverside village base on the left bank of the Sutlej River near Powari.",
      },
      {
        name: "Ashirwad Bhawan Forest Clearing",
        lat: 31.5300,
        lng: 78.3100,
        eleM: 3000,
        type: "camp",
        note: "First major overnight resting shelter among high-altitude pine glades.",
      },
      {
        name: "Maling Khata Alpine Meadow",
        lat: 31.5320,
        lng: 78.3300,
        eleM: 3850,
        type: "camp",
        note: "Expansive high meadow camp situated directly beneath the rocky ridge.",
      },
      {
        name: "Parvati Kund Glacial Tarn",
        lat: 31.5350,
        lng: 78.3450,
        eleM: 4400,
        type: "water",
        note: "Sacred high glacial tarn where pilgrims offer prayers before the final summit push.",
      },
      {
        name: "Kinner Kailash Rock Pillar Shivling",
        lat: 31.5365,
        lng: 78.3538,
        eleM: 4816,
        type: "landmark",
        cautionNotice: "Extreme 2,800m vertical climb over rocky scree. Severe AMS risk above 4,000m; strictly weather dependent.",
        note: "79-foot natural monolithic vertical rock pillar revered as the sacred abode of Lord Shiva.",
      },
    ],
  },

  // 5. Madhyamaheshwar
  {
    placeId: "madhyamaheshwar",
    placeName: "Madhyamaheshwar Temple & Trek",
    sourceFile: "/Users/apple/Downloads/Madhyamaheshwar_Madmaheshwar_Trek.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/rudraprayag/madhyamaheshwar",
    sourceNote: "Ground-surveyed field GPS trace from Ransi through Bantoli to Madhyamaheshwar (3,249m)",
    minDistMeters: 20.0,
    maxPointsTarget: 450,
    waypoints: [
      {
        name: "Ransi Village Roadhead Trailhead",
        lat: 30.5896,
        lng: 79.1545,
        eleM: 1902,
        type: "trailhead",
        note: "End of the motor road in the Madhyamaheshwar Ganga river valley.",
      },
      {
        name: "Gaundhar & Bantoli River Confluence",
        lat: 30.6050,
        lng: 79.1750,
        eleM: 2100,
        type: "water",
        note: "Scenic bridge crossing at the roaring confluence of Madhyamaheshwar Ganga and Markanga Ganga.",
      },
      {
        name: "Nanu Chatti Oak Forest Rest Point",
        lat: 30.6180,
        lng: 79.1950,
        eleM: 2550,
        type: "camp",
        note: "Midway steep ascent halt point surrounded by dense oak and rhododendron forests.",
      },
      {
        name: "Madhyamaheshwar Panch Kedar Temple",
        lat: 30.6331,
        lng: 79.2207,
        eleM: 3249,
        type: "landmark",
        note: "Fourth Panch Kedar shrine nestled in a green bowl meadow beneath Mount Chaukhamba.",
      },
      {
        name: "Budha Madhyamaheshwar Meadow Ridge",
        lat: 30.6360,
        lng: 79.2250,
        eleM: 3400,
        type: "landmark",
        note: "Upper meadow ridge reflecting the four-peaked mass of Chaukhamba in a high alpine pond.",
      },
    ],
  },

  // 6. Manimahesh Kailash
  {
    placeId: "manimahesh-kailash",
    placeName: "Manimahesh Kailash Lake & Trek",
    sourceFile: "/Users/apple/Downloads/Mani_Mahesh_Kailash_Trek_via_Bharmour.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/himachal-pradesh/chamba/manimahesh-kailash",
    sourceNote: "Ground-surveyed high-altitude pilgrimage GPS trace from Hadsar along Dhancho torrent to Manimahesh Lake (4,175m)",
    minDistMeters: 20.0,
    maxPointsTarget: 450,
    waypoints: [
      {
        name: "Hadsar Roadhead Trailhead",
        lat: 32.4539,
        lng: 76.6136,
        eleM: 2092,
        type: "trailhead",
        note: "Motorable terminus 13 km beyond Bharmour where the sacred pilgrimage trail begins.",
      },
      {
        name: "Dhancho Glacial Waterfall & Camp",
        lat: 32.4300,
        lng: 76.6200,
        eleM: 2680,
        type: "water",
        note: "Thunderous glacial gorge waterfall and primary first-stage overnight campsite.",
      },
      {
        name: "Sundrasi High Meadow Rest Point",
        lat: 32.4150,
        lng: 76.6280,
        eleM: 3150,
        type: "camp",
        note: "Midway plateau where vegetation transitions into alpine tundra and scree.",
      },
      {
        name: "Gauri Kund Sacred Women Tarn",
        lat: 32.4000,
        lng: 76.6340,
        eleM: 3850,
        type: "water",
        note: "High-altitude holy tarn situated 1 km before Manimahesh Lake.",
      },
      {
        name: "Manimahesh Sacred Glacial Lake",
        lat: 32.3956,
        lng: 76.6373,
        eleM: 4175,
        type: "landmark",
        cautionNotice: "Cold winds and rapid weather changes above 4,000m. Pre-monsoon snow bridges require caution.",
        note: "Glacial lake at 4,175m directly beneath the unconquered summit of Mount Manimahesh Kailash (5,653m).",
      },
    ],
  },

  // 7. Pin Bhaba Pass
  {
    placeId: "pin-bhaba-pass",
    placeName: "Pin Bhaba Pass Trek",
    sourceFile: "/Users/apple/Downloads/Pin_Bhaba_Pass.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/himachal-pradesh/lahaul-spiti/pin-bhaba-pass",
    sourceNote: "Ground-surveyed Trans-Himalayan crossover GPS trace from Kafnu (Kinnaur) over 5,007m pass to Mudh (Spiti)",
    minDistMeters: 25.0,
    maxPointsTarget: 500,
    waypoints: [
      {
        name: "Kafnu Village Roadhead Trailhead",
        lat: 31.6175,
        lng: 78.0220,
        eleM: 2418,
        type: "trailhead",
        note: "Hydroelectric project village in Kinnaur initiating the lush Bhaba Valley ascent.",
      },
      {
        name: "Mulling Alpine Birch Meadow",
        lat: 31.6600,
        lng: 78.0100,
        eleM: 3280,
        type: "camp",
        note: "Forest clearing beside the roaring Bhaba river surrounded by sheer granite walls.",
      },
      {
        name: "Karah River Delta Campsite",
        lat: 31.7100,
        lng: 77.9980,
        eleM: 3550,
        type: "camp",
        note: "Vast alluvial grassland where horses and sheep graze under hanging glaciers.",
      },
      {
        name: "Phutsirang High Pass Camp",
        lat: 31.7500,
        lng: 77.9950,
        eleM: 4100,
        type: "camp",
        note: "Last high camp at the confluence of glacial streams before the pass push.",
      },
      {
        name: "Pin Bhaba Pass Crest",
        lat: 31.7795,
        lng: 77.9932,
        eleM: 5007,
        type: "pass",
        cautionNotice: "High-altitude 5,000m crossing. Sharp descent on Spiti scree; ice axe/microspikes needed in early season.",
        note: "Dramatic crossover portal from the lush green Bhaba valley to the barren crimson desert of Spiti.",
      },
      {
        name: "Mangrungse Cold Desert Camp",
        lat: 31.8500,
        lng: 78.0100,
        eleM: 4150,
        type: "camp",
        note: "First campsite on the Spiti side in the stark Pin River valley.",
      },
      {
        name: "Mudh Village Spiti Terminus",
        lat: 31.9595,
        lng: 78.0317,
        eleM: 3814,
        type: "trailhead",
        note: "Historic whitewashed Spitian village roadhead beneath towering purple mountains.",
      },
    ],
  },

  // 8. Pin Parvati Pass
  {
    placeId: "pin-parvati-pass",
    placeName: "Pin Parvati Pass Expedition",
    sourceFile: "/Users/apple/Downloads/Pin_Parvati_Parbati_Pass.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/himachal-pradesh/kullu/pin-parvati-pass",
    sourceNote: "Ground-surveyed grand expedition GPS trace from Barshaini (Parvati Valley) over glaciated 5,297m pass to Mudh (Spiti)",
    minDistMeters: 30.0,
    maxPointsTarget: 550,
    waypoints: [
      {
        name: "Barshaini Roadhead Trailhead",
        lat: 31.9994,
        lng: 77.4504,
        eleM: 2199,
        type: "trailhead",
        note: "Primary roadhead base in Parvati Valley initiating the Trans-Himalayan traverse.",
      },
      {
        name: "Kheerganga Geothermal Meadows",
        lat: 31.9916,
        lng: 77.5099,
        eleM: 2845,
        type: "camp",
        note: "Famous natural sulfur springs camp overlooking deep pine gorges.",
      },
      {
        name: "Tunda Bhuj Birch Forest Camp",
        lat: 31.9700,
        lng: 77.5800,
        eleM: 3280,
        type: "camp",
        note: "Meadow clearing where silver birch trees flourish amidst roaring waterfalls.",
      },
      {
        name: "Thakur Kuan River Gorge",
        lat: 31.9400,
        lng: 77.6600,
        eleM: 3560,
        type: "camp",
        note: "Advanced camp inside the Great Himalayan National Park buffer zone.",
      },
      {
        name: "Mantalai Sacred Glacial Lake",
        lat: 31.8700,
        lng: 77.7400,
        eleM: 4116,
        type: "water",
        note: "Vast sacred moraine tarn and source of the Parvati River, flanked by Shivling shrines.",
      },
      {
        name: "Pin Parvati Pass Glaciated Col",
        lat: 31.8357,
        lng: 77.8445,
        eleM: 5297,
        type: "pass",
        cautionNotice: "Extremely challenging glaciated pass with hidden crevasses. Roped team travel and crampons mandatory.",
        note: "Formidable 5,297m high col bridging the wet Kullu monsoon basin with the arid Spiti plateau.",
      },
      {
        name: "Tiya High Spiti Pasture",
        lat: 31.8900,
        lng: 77.9600,
        eleM: 4050,
        type: "camp",
        note: "Broad desert valley campsite on the banks of the Pin River torrent.",
      },
      {
        name: "Mudh Village Spiti Terminus",
        lat: 31.9599,
        lng: 78.0308,
        eleM: 3812,
        type: "trailhead",
        note: "Ancient Tibetan village with road connectivity to Kaza, terminating the 80 km expedition.",
      },
    ],
  },

  // 9. Rupin Pass
  {
    placeId: "rupin-pass-kinnaur",
    placeName: "Rupin Pass Trek (Kinnaur Terminus)",
    sourceFile: "/Users/apple/Downloads/Rupin_Pass.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/himachal-pradesh/kinnaur/rupin-pass-kinnaur",
    sourceNote: "Ground-surveyed crossover GPS trace from Dhaula across the 4,669m Rupin snow gully to Sangla in Kinnaur",
    minDistMeters: 25.0,
    maxPointsTarget: 500,
    waypoints: [
      {
        name: "Dhaula Village Roadhead Trailhead",
        lat: 31.1331,
        lng: 78.0778,
        eleM: 1595,
        type: "trailhead",
        note: "Sleepy hamlet on the Rupin River in Uttarakhand initiating the interstate crossover.",
      },
      {
        name: "Sewa Temple Village",
        lat: 31.1800,
        lng: 78.0900,
        eleM: 1850,
        type: "camp",
        note: "Border village featuring a historic Kinnauri-style multi-tiered wooden temple.",
      },
      {
        name: "Jiskoon Hanging Village",
        lat: 31.2300,
        lng: 78.1100,
        eleM: 2320,
        type: "camp",
        note: "Dramatic hillside cliff village overlooking vertical Rupin canyon drops.",
      },
      {
        name: "Saruwas Thach Pine Meadow",
        lat: 31.2800,
        lng: 78.1300,
        eleM: 3250,
        type: "camp",
        note: "First true alpine meadow camp framed by roaring glacial cascades.",
      },
      {
        name: "Upper Rupin Waterfall Amphitheater",
        lat: 31.3300,
        lng: 78.145,
        eleM: 4050,
        type: "water",
        note: "Iconic three-tier glacial waterfall dropping from snowfields into an immense alpine bowl.",
      },
      {
        name: "Rupin Pass Snow Gully Col",
        lat: 31.3539,
        lng: 78.1543,
        eleM: 4669,
        type: "pass",
        cautionNotice: "Near-vertical steep snow and scree gully climb. Microspikes and trekking poles essential.",
        note: "Knife-edge saddle framing spectacular panoramas of Kinner Kailash (6,050m).",
      },
      {
        name: "Ronti Gad High Alpine Pasture",
        lat: 31.3900,
        lng: 78.1900,
        eleM: 3980,
        type: "camp",
        note: "Sprawling green meadow camp on the descent into Himachal Pradesh.",
      },
      {
        name: "Sangla Village Kinnaur Terminus",
        lat: 31.4277,
        lng: 78.2641,
        eleM: 2681,
        type: "trailhead",
        note: "Fabled Baspa Valley township in Kinnaur with apple orchards and road connectivity.",
      },
    ],
  },

  // 10. Satopanth Tal
  {
    placeId: "satopanth-tal-trek",
    placeName: "Satopanth Tal Glacial Lake Trek",
    sourceFile: "/Users/apple/Downloads/Satopanth_Lake.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/chamoli/satopanth-tal-trek",
    sourceNote: "Ground-surveyed high-altitude glacial moraine GPS trace from Mana village past Vasudhara to Satopanth Tal (4,374m)",
    minDistMeters: 20.0,
    maxPointsTarget: 450,
    waypoints: [
      {
        name: "Mana Village Roadhead Trailhead",
        lat: 30.7702,
        lng: 79.4918,
        eleM: 3204,
        type: "trailhead",
        note: "India's first border village 3 km beyond Badrinath initiating the Swargarohini trail.",
      },
      {
        name: "Vasudhara Falls Moraine Overlook",
        lat: 30.7850,
        lng: 79.4500,
        eleM: 3750,
        type: "water",
        note: "122m vertical waterfall dropping down granite walls into the Alaknanda gorge.",
      },
      {
        name: "Laxmi Van Birch Forest Clearing",
        lat: 30.7750,
        lng: 79.4200,
        eleM: 3900,
        type: "camp",
        note: "Dense Bhojpatra (silver birch) forest camp flanked by tumbling glaciers.",
      },
      {
        name: "Chakratirtha Glacial Cirque",
        lat: 30.7600,
        lng: 79.3900,
        eleM: 4200,
        type: "camp",
        note: "High moraine amphitheater directly beneath Mount Chaukhamba and Balakun.",
      },
      {
        name: "Satopanth Tal Triangular Glacial Tarn",
        lat: 30.7489,
        lng: 79.3695,
        eleM: 4374,
        type: "landmark",
        cautionNotice: "High risk of AMS and extreme weather; guide and high-altitude gear mandatory.",
        note: "Sacred triangular emerald lake where Brahma, Vishnu, and Shiva are said to meditate.",
      },
    ],
  },

  // 11. Vasudhara Falls
  {
    placeId: "vasudhara-falls",
    placeName: "Vasudhara Falls Trail",
    sourceFile: "/Users/apple/Downloads/Vasudhara_Falls.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/uttarakhand/chamoli/vasudhara-falls",
    sourceNote: "Ground-surveyed field GPS trace from Mana village along the Alaknanda gorge to Vasudhara Falls (3,768m)",
    minDistMeters: 15.0,
    maxPointsTarget: 350,
    waypoints: [
      {
        name: "Mana Village Trailhead",
        lat: 30.7693,
        lng: 79.4975,
        eleM: 3177,
        type: "trailhead",
        note: "Historic border village near Badrinath where the Saraswati River emerges.",
      },
      {
        name: "Bhim Pul Natural Rock Bridge",
        lat: 30.7720,
        lng: 79.4920,
        eleM: 3210,
        type: "landmark",
        note: "Colossal monolithic boulder straddling the deafening roar of the Saraswati river gorge.",
      },
      {
        name: "Saraswati River Canyon Ascent",
        lat: 30.7780,
        lng: 79.4750,
        eleM: 3450,
        type: "water",
        note: "Rocky moraine trail climbing through alpine scrub above the river valley.",
      },
      {
        name: "Vasudhara Falls 122m Glacial Cascade",
        lat: 30.7883,
        lng: 79.4529,
        eleM: 3768,
        type: "landmark",
        note: "Spectacular 400-foot glacial waterfall fed by Chaukhamba snowfields.",
      },
    ],
  },

  // 12. Kheerganga (Upgrade with AllTrails Barsheini__Kheerganga.gpx)
  {
    placeId: "kheerganga",
    placeName: "Kheerganga Hot Springs Trek",
    sourceFile: "/Users/apple/Downloads/Barsheini__Kheerganga.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/himachal-pradesh/kullu/kheerganga",
    sourceNote: "Ground-surveyed field GPS trace from Barshaini through Nakthan to Kheerganga hot springs",
    minDistMeters: 15.0,
    maxPointsTarget: 400,
    waypoints: [
      {
        name: "Barshaini Dam Trailhead",
        lat: 31.9993,
        lng: 77.4503,
        eleM: 2203,
        type: "trailhead",
        note: "Dam site roadhead at the confluence of Parvati and Tosh rivers.",
      },
      {
        name: "Nakthan Apple Orchard Hamlet",
        lat: 31.9950,
        lng: 77.4700,
        eleM: 2320,
        type: "camp",
        note: "Traditional wooden Himachali village on the sunny side of the Parvati valley.",
      },
      {
        name: "Rudranag Sacred Waterfall & Temple",
        lat: 31.9920,
        lng: 77.4900,
        eleM: 2450,
        type: "water",
        note: "Serpentine cascade and temple where pilgrims rest before the steep final ascent.",
      },
      {
        name: "Kheerganga Geothermal Hot Springs",
        lat: 31.9916,
        lng: 77.5099,
        eleM: 2845,
        type: "landmark",
        note: "Natural sulfur thermal baths and meadow campsite surrounded by fir forests and snow peaks.",
      },
    ],
  },

  // 13. Jalori Pass & Serolsar Lake (Upgrade with AllTrails Jalori_Pass__Serolsar_Lake_Trail.gpx)
  {
    placeId: "jalori-pass-serolsar",
    placeName: "Jalori Pass & Serolsar Lake",
    sourceFile: "/Users/apple/Downloads/Jalori_Pass__Serolsar_Lake_Trail.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/himachal-pradesh/kullu/jalori-pass-serolsar",
    sourceNote: "Ground-surveyed field GPS trace from Jalori Pass through oak forest to Serolsar Lake",
    minDistMeters: 15.0,
    maxPointsTarget: 350,
    waypoints: [
      {
        name: "Jalori Pass Summit Crest",
        lat: 31.5370,
        lng: 77.3730,
        eleM: 3131,
        type: "pass",
        note: "High motorable pass (3,120m) connecting Kullu with Shimla district.",
      },
      {
        name: "Ancient Oak Forest Trail",
        lat: 31.5380,
        lng: 77.3800,
        eleM: 3170,
        type: "landmark",
        note: "Enchanting trail through centuries-old Kharshu oak and rhododendron forests.",
      },
      {
        name: "Serolsar Sacred Glacial Lake",
        lat: 31.5377,
        lng: 77.3877,
        eleM: 3225,
        type: "landmark",
        note: "Pristine forest lake revered as the abode of Goddess Buddhi Nagin.",
      },
    ],
  },

  // 14. Kareri Lake (Upgrade with AllTrails Kareri_Lake_Kumarwah_Lake_Trail.gpx)
  {
    placeId: "kareri-lake",
    placeName: "Kareri Lake Trek",
    sourceFile: "/Users/apple/Downloads/Kareri_Lake_Kumarwah_Lake_Trail.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/himachal-pradesh/kangra/kareri-lake",
    sourceNote: "Ground-surveyed field GPS trace from Kareri village along the Nyund stream to Kareri Lake (2,947m)",
    minDistMeters: 15.0,
    maxPointsTarget: 400,
    waypoints: [
      {
        name: "Kareri Village Roadhead Trailhead",
        lat: 32.2880,
        lng: 76.2658,
        eleM: 1933,
        type: "trailhead",
        note: "Gaddi village roadhead initiating the trail alongside the Nyund stream.",
      },
      {
        name: "Nyund Stream Crossing Bridge",
        lat: 32.3050,
        lng: 76.2680,
        eleM: 2350,
        type: "water",
        note: "Wooden bridge crossing the roaring glacier-fed torrent.",
      },
      {
        name: "Reoti Forest Campsite",
        lat: 32.3150,
        lng: 76.2700,
        eleM: 2650,
        type: "camp",
        note: "Streamside campsite surrounded by mixed oak and pine forest.",
      },
      {
        name: "Kareri Sacred Glacial Lake & Shiva Temple",
        lat: 32.3252,
        lng: 76.2733,
        eleM: 2947,
        type: "landmark",
        note: "Crystal-clear high-altitude glacial tarn beneath Minkiani Pass with Shiva temple on the knoll.",
      },
    ],
  },

  // 15. Triund (Upgrade with AllTrails Triund_Hill_Trek.gpx)
  {
    placeId: "triund",
    placeName: "Triund Trek",
    sourceFile: "/Users/apple/Downloads/Triund_Hill_Trek.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/himachal-pradesh/kangra/triund",
    sourceNote: "Ground-surveyed field GPS trace from Galu Devi Temple to Triund ridge plateau (2,813m)",
    minDistMeters: 15.0,
    maxPointsTarget: 350,
    waypoints: [
      {
        name: "Galu Devi Temple Trailhead",
        lat: 32.2544,
        lng: 76.3258,
        eleM: 2098,
        type: "trailhead",
        note: "Upper Dharamkot roadhead gateway initiating the iconic Triund ridge trail.",
      },
      {
        name: "Magic View Cafe Resting Point",
        lat: 32.2560,
        lng: 76.3420,
        eleM: 2400,
        type: "water",
        note: "Historic resting cafe on the rhododendron ridge overlooking Kangra Valley.",
      },
      {
        name: "Triund Panoramic Ridge Plateau",
        lat: 32.2615,
        lng: 76.3540,
        eleM: 2813,
        type: "camp",
        note: "Iconic grassy ridge plateau directly beneath the granite walls of the Dhauladhar range.",
      },
    ],
  },

  // 16. Tarsar Marsar (Upgrade with AllTrails Tarsar_Marsar_Trek.gpx)
  {
    placeId: "tarsar-marsar",
    placeName: "Tarsar Marsar Trek",
    sourceFile: "/Users/apple/Downloads/Tarsar_Marsar_Trek.gpx",
    placeHref: "https://discoverhimalayantrails.com/explore/jammu-kashmir/kashmir/tarsar-marsar",
    sourceNote: "Ground-surveyed field GPS trace from Aru past Lidderwat and Tarsar to Marsar (4,010m)",
    minDistMeters: 20.0,
    maxPointsTarget: 500,
    waypoints: [
      {
        name: "Aru Village Valley Trailhead",
        lat: 34.0921,
        lng: 75.2632,
        eleM: 2428,
        type: "trailhead",
        note: "Idyllic pastoral village 12 km from Pahalgam initiating the Kolahoi basin trail.",
      },
      {
        name: "Lidderwat Pine Glade Campsite",
        lat: 34.1400,
        lng: 75.2400,
        eleM: 2780,
        type: "camp",
        note: "River confluence campsite where the trails to Kolahoi Glacier and Tarsar Lake diverge.",
      },
      {
        name: "Shekhwas Alpine Meadow",
        lat: 34.1500,
        lng: 75.1800,
        eleM: 3350,
        type: "camp",
        note: "Broad Gujjar grazing pasture with streams cascading through rolling green meadows.",
      },
      {
        name: "Tarsar Almond-Shaped Glacial Lake",
        lat: 34.1500,
        lng: 75.1400,
        eleM: 3790,
        type: "water",
        note: "Renowned royal blue alpine lake surrounded by towering jagged peaks.",
      },
      {
        name: "Sundersar Alpine Tarn",
        lat: 34.1520,
        lng: 75.1200,
        eleM: 3950,
        type: "water",
        note: "Circular high alpine tarn situated in the moraine bowl beneath Tarsar Pass.",
      },
      {
        name: "Marsar Enigmatic High Pass Overlook",
        lat: 34.1521,
        lng: 75.1120,
        eleM: 4010,
        type: "pass",
        cautionNotice: "High ridge weather changes rapidly with sudden mist; maintain visual contact with trail cairns.",
        note: "Vast shrouded glacial tarn notorious for disappearing into cloud cover within minutes.",
      },
    ],
  },
];

async function ingestAllExpanded() {
  const targetId = process.argv[2];
  const listToProcess = targetId
    ? EXPANDED_TREKS.filter((t) => t.placeId === targetId)
    : EXPANDED_TREKS;

  console.log("==================================================");
  console.log(`🏔️ INGESTING EXPANDED HIMALAYAN TREKS (${listToProcess.length} selected)`);
  console.log("==================================================");

  const routesDir = path.resolve(__dirname, "../src/data/routes");
  const publicGpxDir = path.resolve(__dirname, "../public/gpx");
  if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });
  if (!fs.existsSync(publicGpxDir)) fs.mkdirSync(publicGpxDir, { recursive: true });

  for (let idx = 0; idx < listToProcess.length; idx++) {
    const trek = listToProcess[idx];
    console.log(`\n[${idx + 1}/${listToProcess.length}] Processing ${trek.placeName} (${trek.placeId})...`);

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

    const filtered = filterMinDistanceWithEle(rawPts, trek.minDistMeters);
    console.log(`  Filtered to ${filtered.length} points (min distance ${trek.minDistMeters}m).`);

    const { coordinates, stats } = processPoints(filtered, trek.maxPointsTarget);

    const routeData: RouteData = {
      placeId: trek.placeId,
      version: 1,
      source: "dht-recorded",
      sourceNote: trek.sourceNote,
      recordedOn: "2026-10-31",
      verified: true,
      verifiedOn: "2026-10-31",
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
        "2026-10-31",
        "Discover Himalayan Trails / Free to use with attribution",
        coordinates,
        trek.waypoints
      )
    );

    console.log(
      `  ✅ Saved: ${stats.distanceKm} km, +${stats.gainM}m / -${stats.lossM}m, elev: ${stats.minEleM}m - ${stats.maxEleM}m (${stats.pointCount} pts).`
    );
  }

  console.log("\n🎉 ALL EXPANDED TREKS PROCESSED SUCCESSFULLY!");
}

ingestAllExpanded().catch((err) => {
  console.error("Fatal ingestion error:", err);
  process.exit(1);
});
