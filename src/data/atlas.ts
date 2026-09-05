import { treks } from "./treks";
import { peaks } from "./peaks";
import { Trek, Peak } from "./types";

export type PlaceType = 
  | "trek" 
  | "peak" 
  | "day-hike" 
  | "spiritual" 
  | "scenic" 
  | "road" 
  | "lake" 
  | "adventure";

export interface HimalayaPlace {
  id: string;
  name: string;
  type: PlaceType;
  emoji: string;
  image?: string;
  heroImage?: string;
  coords?: [number, number];
  elevation?: string;
  bestSeason?: string;
  difficulty?: string;
  duration?: string;
  distance?: string;
  overview?: string;
  routeDescription?: string;
  experience?: string;
  tips?: string[];
  itinerary?: { day: number; title: string; description: string; elevationMeters?: number; distanceKm?: number }[];
  packingList?: string[];
  faqs?: { question: string; answer: string }[];
  images?: string[];
  trekData?: Trek;
  peakData?: Peak;
}

export interface HimalayaSubRegion {
  id: string;
  name: string;
  tagline?: string;
  places: HimalayaPlace[];
}

export interface HimalayaRegion {
  id: string;
  name: string;
  emoji: string;
  cardDesc: string;
  image?: string;
  subregions: HimalayaSubRegion[];
}

export const himalayaAtlas: HimalayaRegion[] = [
  {
    id: "jammu-kashmir",
    name: "Jammu & Kashmir",
    emoji: "🏔️",
    cardDesc: "Paradise on earth — from the pine-clad meadows of Jammu to the turquoise alpine lakes of the Kashmir Great Lakes.",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/v1780383856/jkMain.jpg",
    subregions: [
      {
        id: "jammu",
        name: "Jammu",
        tagline: "Rolling meadows, ancient pine forests, and revered spiritual sanctuaries",
        places: [
          {
            id: "patnitop",
            name: "Patnitop Meadow",
            heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            type: "day-hike",
            emoji: "🌲",
            coords: [33.0850, 75.3280],
            elevation: "2,024 m",
            bestSeason: "April to November, Dec to Feb for snow",
            difficulty: "Easy",
            duration: "1 Day (3-4 hours)",
            overview: "Patnitop is a scenic hill resort situated on a plateau surrounded by dense deodar and pine forests in Udhampur district. It offers gentle ridge walks, cedar canopy trails, and paragliding with panoramic views of the Chenab basin.",
            experience: "Walking under centuries-old Himalayan cedars with the scent of pine needles in the mountain air.",
            tips: [
              "Try the local Kalari cheese (Kashmiri mozzarella) at street stalls.",
              "Combine with a short hike to Sanasar or Nathatop."
            ],
            faqs: [
              {
                question: "Is Patnitop suitable for beginners and families?",
                answer: "Yes, the gentle meadows and paved trails make it ideal for family day hikes and easy strolls."
              }
            ]
          },
          {
            id: "sanasar",
            name: "Sanasar Lake & Meadow",
            heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=72",
            type: "lake",
            emoji: "🛶",
            coords: [33.1230, 75.2810],
            elevation: "2,050 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "1 Day",
            overview: "Sanasar is a cup-shaped meadow surrounded by gigantic conifers, named after two local lakes (Sana and Sar). Known as the eco-adventure hub of Jammu, it features wilderness trails, camping, and golf greens.",
            experience: "A tranquil cup of meadow reflecting high clouds, far from crowded tourist tracks.",
            tips: [
              "Carry warm layers as evening temperatures drop rapidly.",
              "Explore the Shank Pal temple trail for panoramic Pir Panjal views."
            ]
          },
          {
            id: "nathatop",
            name: "Nathatop Ridge",
            heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "⛰️",
            coords: [33.1020, 75.3120],
            elevation: "2,710 m",
            bestSeason: "May to November",
            difficulty: "Easy",
            duration: "Half Day",
            overview: "Perched high above Patnitop, Nathatop offers a sweeping 360-degree vista of the snow-clad peaks of the Kishtwar and Pir Panjal mountain ranges. In winter, its gentle slopes become a playground for snow activities.",
            experience: "Standing at the edge of the ridge gazing at the jagged white peaks of the Great Himalayas.",
            tips: [
              "Visit at sunrise or golden hour for striking mountain photography.",
              "Road can be slippery during winter; hire 4WD if snow is present."
            ]
          },
          {
            id: "vaishno-devi",
            name: "Vaishno Devi Trail",
            heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            type: "spiritual",
            emoji: "🛕",
            coords: [33.0305, 74.9500],
            elevation: "1,585 m",
            bestSeason: "Year-round (Best: March to October)",
            difficulty: "Moderate",
            duration: "1–2 Days (13 km climb)",
            overview: "One of India's most revered mountain pilgrimages, the 13 km trek starts from Katra town and ascends through the Trikuta Mountains to the holy cave shrine of Mata Vaishno Devi.",
            experience: "Echoes of devotion and chants reverberating across misty mountain ridges under evening lights.",
            tips: [
              "Pre-register online for the Yatra Parcha before reaching Katra.",
              "Battery cars and ropeway are available between Adhkuwari and Bhawan."
            ]
          }
        ]
      },
      {
        id: "kashmir",
        name: "Kashmir",
        tagline: "Turquoise alpine lakes, flower-strewn valleys, and dramatic Himalayan passes",
        places: [
          {
            id: "kashmir-great-lakes",
            name: "Kashmir Great Lakes Trek",
            heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🌊",
            coords: [34.2500, 75.0500],
            elevation: "4,190 m",
            bestSeason: "July to September",
            difficulty: "Moderate to Difficult",
            duration: "7 Days",
            distance: "72 km",
            overview: "Widely regarded as India's prettiest trek, the Kashmir Great Lakes trail traverses seven pristine alpine lakes—including Vishansar, Kishansar, Gadsar, Satsar, and Gangabal—nestled against sheer glaciated cirques.",
            routeDescription: "Starts from Shitkadi near Sonmarg, ascends through Nichnai Pass (4,150 m), crosses Gadsar Pass (4,200 m), Satsar meadows, and descends past Mount Harmukh into Naranag.",
            itinerary: [
              { day: 1, title: "Sonmarg to Nichnai", description: "Ascent through maple and silver birch forests to Nichnai campsite (3,500 m)." },
              { day: 2, title: "Nichnai to Vishansar Lake", description: "Cross Nichnai Pass (4,150 m) with views of emerald green valleys into Vishansar." },
              { day: 3, title: "Vishansar to Gadsar", description: "Climb past Kishansar Lake to Gadsar Pass (4,200 m) and descend to the Lake of Flowers." },
              { day: 4, title: "Gadsar to Satsar", description: "Trek through meadows and ridge traverses to the seven interconnected Satsar lakes." },
              { day: 5, title: "Satsar to Gangabal Twin Lakes", description: "Cross Zajibal Pass (4,080 m) with dramatic views of Mount Harmukh reflecting in Gangabal." },
              { day: 6, title: "Rest & Exploration at Gangabal", description: "Explore Nundkol Lake and the base of Mount Harmukh glacier." },
              { day: 7, title: "Gangabal to Naranag", description: "Steep pine descent into the ancient temple village of Naranag." }
            ],
            packingList: [
              "Waterproof trekking boots with ankle support",
              "Thermal innerwear & fleece jacket",
              "Rain poncho (monsoon clouds drift over passes)",
              "Trekking poles & UV sunglasses",
              "Original Government ID card for Army checkpoints"
            ],
            faqs: [
              {
                question: "Do I need permits for Kashmir Great Lakes?",
                answer: "Yes, inner-line military permits are required and are arranged via your registered local guiding agency."
              }
            ]
          },
          {
            id: "tarsar-marsar",
            name: "Tarsar Marsar Trek",
            heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🏔️",
            coords: [34.1500, 75.1500],
            elevation: "4,020 m",
            bestSeason: "July to September",
            difficulty: "Moderate",
            duration: "6 Days",
            distance: "48 km",
            overview: "A mesmerizing trek in the Aru Valley of Kashmir leading to the twin almond-shaped alpine lakes of Tarsar and Marsar, surrounded by lush meadows and the Kolahoi mountain massif.",
            experience: "Camping right on the grassy shores of Tarsar as the water changes hues from turquoise to deep blue."
          },
          {
            id: "sonmarg",
            name: "Sonmarg & Thajiwas Glacier",
            heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "❄️",
            coords: [34.3000, 75.2900],
            elevation: "2,740 m",
            bestSeason: "April to October",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Sonmarg ('Meadow of Gold') is framed by soaring glaciers and the Sindh River. A short 3 km hike leads to the foot of Thajiwas Glacier, an iconic gateway to Ladakh and Amarnath.",
            experience: "Lush green fir forests running directly into massive hanging glacial ice fields."
          },
          {
            id: "gulmarg",
            name: "Gulmarg & Apharwat Peak",
            heroImage: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=72",
            type: "adventure",
            emoji: "🚠",
            coords: [34.0500, 74.3800],
            elevation: "3,950 m",
            bestSeason: "Year-round (Winter for Skiing, Summer for Trekking)",
            difficulty: "Moderate",
            duration: "1–2 Days",
            overview: "Home to one of the world's highest operating cable cars (Gulmarg Gondola), Gulmarg offers alpine flower walks in summer and legendary deep powder skiing across Apharwat ridge in winter.",
            experience: "Standing atop Apharwat at nearly 4,000 meters gazing into the Nanga Parbat horizon."
          }
        ]
      }
    ]
  },
  {
    id: "himachal-pradesh",
    name: "Himachal Pradesh",
    emoji: "🌲",
    cardDesc: "The Abode of Snow — pine-clad Kullu trails, raw Trans-Himalayan Spiti deserts, mystical Kinnaur valleys, and high Dhauladhar Kangra ridges.",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/v1777221149/himachalMain.jpg",
    subregions: [
      {
        id: "kullu",
        name: "Kullu",
        tagline: "Manali trailheads, alpine glaciers, and iconic high-altitude pass crossings",
        places: [
          ...treks.map((t) => {
            const isDayHike =
              t.duration.toLowerCase().includes("1 day") ||
              t.duration.toLowerCase().includes("hour") ||
              t.slug === "patalsu-peak" ||
              t.slug === "lamadugh";
            return {
              id: t.slug,
              name: t.title,
              type: (isDayHike ? "day-hike" : "trek") as PlaceType,
              emoji: isDayHike ? "🚶" : "🥾",
              coords: t.coords,
              elevation: t.maxAltitude,
              bestSeason: t.bestSeason,
              difficulty: t.difficulty,
              duration: t.duration,
              distance: t.distance,
              overview: t.overview,
              routeDescription: t.routeDescription,
              itinerary: t.itinerary,
              packingList: t.packingList,
              faqs: t.faqs,
              heroImage: t.heroImage,
              images: t.images || [],
              trekData: t,
            };
          }),
          ...peaks.map((p) => ({
            id: p.slug,
            name: p.title,
            type: "peak" as PlaceType,
            emoji: "⛰️",
            coords: p.coords,
            elevation: `${p.height} m`,
            bestSeason: p.expeditionSeason,
            difficulty: p.difficulty,
            overview: p.overview,
            routeDescription: p.climbingRoute,
            heroImage: p.heroImage,
            images: p.images || [],
            faqs: p.faqs,
            peakData: p,
          })),
          {
            id: "solang-valley",
            name: "Solang Valley",
            heroImage: "https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=800&q=72",
            type: "adventure",
            emoji: "🎿",
            coords: [32.3150, 77.1580],
            elevation: "2,560 m",
            bestSeason: "Year-round",
            difficulty: "Easy",
            duration: "Day Excursion",
            overview: "Solang Valley lies 14 km northwest of Manali and serves as the gateway to the Beas Kund glacier and Patalsu Peak trails. It features skiing slopes in winter and paragliding in summer."
          },
          {
            id: "sethan",
            name: "Sethan Village & Valley",
            heroImage: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "🛖",
            coords: [32.2240, 77.2510],
            elevation: "2,700 m",
            bestSeason: "Year-round (Igloo season: Jan–March)",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "A secluded Buddhist village perched on the Hampta ridge above Manali, Sethan offers panoramic views of the Dhauladhar range and serves as the starting base for Hampta Pass."
          },
          {
            id: "tirthan-valley",
            name: "Tirthan Valley & GHNP",
            heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "🐟",
            coords: [31.6300, 77.4000],
            elevation: "1,600–3,800 m",
            bestSeason: "March to June, Sep to Nov",
            difficulty: "Moderate",
            duration: "2–4 Days",
            overview: "Pristine buffer zone of the UNESCO Great Himalayan National Park, famous for crystal trout streams, dense deodar forests, and peaceful trails to Jalori Pass and Serolsar Lake."
          }
        ]
      },
      {
        id: "lahaul-spiti",
        name: "Lahaul & Spiti",
        tagline: "High cold deserts, 1,000-year-old cliffside monasteries, and turquoise moon lakes",
        places: [
          {
            id: "chandratal-lake",
            name: "Chandratal Lake (Moon Lake)",
            heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=72",
            type: "lake",
            emoji: "🌙",
            coords: [32.4820, 77.6180],
            elevation: "4,300 m",
            bestSeason: "Mid-June to Mid-October",
            difficulty: "Moderate",
            duration: "2 Days",
            overview: "A pristine high-altitude crescent lake nestled in the Samudra Tapu plateau between the Pir Panjal and Great Himalayan ranges. Revered as the source of the Chandra River.",
            experience: "Stargazing under the Milky Way canopy as the turquoise water mirrors glaciated mountain walls."
          },
          {
            id: "key-monastery",
            name: "Key Gompa & Kibber",
            heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            type: "spiritual",
            emoji: "🛕",
            coords: [32.2980, 78.0120],
            elevation: "4,166 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "1 Day",
            overview: "Key Monastery is a historic Tibetan Buddhist monastery perched dramatically on a conical hill above the Spiti River. Nearby Kibber is one of the highest permanently inhabited villages in the world.",
            experience: "Sipping butter tea with resident monks while monk chants echo through ancient frescoed prayer halls."
          },
          {
            id: "pin-bhaba-pass",
            name: "Pin Bhaba Pass Trek",
            heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🥾",
            coords: [31.8400, 77.9800],
            elevation: "4,915 m",
            bestSeason: "July to September",
            difficulty: "Difficult",
            duration: "8 Days",
            distance: "50 km",
            overview: "The most dramatic crossover trek in Himachal — starting in the lush green forests of Kinnaur's Bhaba Valley and abruptly emerging into the Martian barren landscape of Spiti's Pin Valley.",
            experience: "Standing on the knife-edge pass seeing emerald green on one side and stark desert mountains on the other."
          },
          {
            id: "sissu",
            name: "Sissu & Lahaul Valley",
            heroImage: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "🌊",
            coords: [32.4700, 77.1200],
            elevation: "3,120 m",
            bestSeason: "Year-round via Atal Tunnel",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Located right across the north portal of Atal Tunnel, Sissu is famous for its thunderous glacial waterfall, poplars, and the turquoise waters of the Chandra River."
          }
        ]
      },
      {
        id: "kinnaur",
        name: "Kinnaur",
        tagline: "Apple orchards, carved wooden temples, and the sacred Kinner Kailash massif",
        places: [
          {
            id: "kinner-kailash",
            name: "Kinner Kailash Parikrama",
            heroImage: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "⛰️",
            coords: [31.5200, 78.3800],
            elevation: "5,200 m",
            bestSeason: "July to August",
            difficulty: "Difficult",
            duration: "8 Days",
            distance: "65 km",
            overview: "A demanding spiritual circumambulation of the 6,050 m Kinner Kailash peak, famous for its 79-foot natural rock pillar (Shivling) that changes colors throughout the day."
          },
          {
            id: "chitkul",
            name: "Chitkul & Baspa Valley",
            heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "🏡",
            coords: [31.3500, 78.4300],
            elevation: "3,450 m",
            bestSeason: "April to October",
            difficulty: "Easy",
            duration: "2 Days",
            overview: "Chitkul is celebrated as the last inhabited village on the old Indo-Tibetan trade route. Located along the Baspa River, it features classic Kinnauri wood-and-stone architecture."
          },
          {
            id: "kalpa",
            name: "Kalpa & Roghi Cliff",
            heroImage: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "🍎",
            coords: [31.5300, 78.2500],
            elevation: "2,960 m",
            bestSeason: "April to November",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Kalpa sits high above the roaring Sutlej River amidst apple orchards, offering front-row views of the holy Kinner Kailash peak catching first morning light."
          }
        ]
      },
      {
        id: "kangra",
        name: "Kangra",
        tagline: "Dramatic Dhauladhar snow ridges, Tibetan culture, and high Himalayan passes",
        places: [
          {
            id: "triund",
            name: "Triund Trek",
            heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🥾",
            coords: [32.2580, 76.3530],
            elevation: "2,850 m",
            bestSeason: "March to December",
            difficulty: "Easy to Moderate",
            duration: "2 Days",
            distance: "18 km",
            overview: "The most popular weekend trek in Himachal Pradesh. Starting from McLeod Ganj, the trail climbs through oak and rhododendron forests to a breathtaking ridge under the sheer face of the Dhauladhar range."
          },
          {
            id: "kareri-lake",
            name: "Kareri Lake Trek",
            heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🌊",
            coords: [32.3100, 76.2800],
            elevation: "2,934 m",
            bestSeason: "April to November",
            difficulty: "Moderate",
            duration: "3 Days",
            distance: "26 km",
            overview: "A glacial lake situated high in the Dhauladhar range fed by melting snow from the Minkiani Peak. Trail passes through dense pine forests along the roaring Nyund stream."
          },
          {
            id: "bir-billing",
            name: "Bir Billing Adventure Hub",
            heroImage: "https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=800&q=72",
            type: "adventure",
            emoji: "🪂",
            coords: [32.0500, 76.7100],
            elevation: "2,400 m (Billing takeoff)",
            bestSeason: "October to June",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Ranked as one of the best paragliding sites in the world, Billing offers tandem flights landing down in the Tibetan colony of Bir with views of the snow-clad Kangra Valley."
          }
        ]
      }
    ]
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    emoji: "🌿",
    cardDesc: "Devbhoomi (Land of the Gods) — sacred river origins, UNESCO wildflower valleys, and grand Garhwal and Kumaon peak circuits.",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/v1777220041/UttrakhandMain.jpg",
    subregions: [
      {
        id: "garhwal",
        name: "Garhwal",
        tagline: "Sacred shrines, ancient valleys, and towering peaks of Lord Shiva",
        places: [
          {
            id: "kedarnath",
            name: "Kedarnath Temple & Trail",
            heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            type: "spiritual",
            emoji: "🛕",
            coords: [30.7350, 79.0660],
            elevation: "3,583 m",
            bestSeason: "May to June, September to October",
            difficulty: "Moderate to Difficult",
            duration: "2–3 Days (16 km climb)",
            overview: "One of the twelve Jyotirlingas, perched at the foot of the glaciated Kedarnath and Kedar Dome peaks along the Mandakini River. A legendary mountain pilgrimage dating back millennia.",
            routeDescription: "The traditional route begins at Gaurikund and climbs 16 km alongside the Mandakini river. It is a well-paved but steep ascent, bustling with pilgrims, mules, and palanquins.",
            itinerary: [
              { day: 1, title: "Sonprayag to Gaurikund, Trek to Kedarnath", description: "Take a shared taxi from Sonprayag to Gaurikund (1,982 m). Begin the 16 km steep trek to Kedarnath. Arrive at the temple town (3,583 m) by evening.", elevationMeters: 3583, distanceKm: 16 },
              { day: 2, title: "Kedarnath Darshan and Trek down to Gaurikund", description: "Early morning darshan at the Kedarnath Temple. Enjoy views of the Kedarnath peak before trekking down 16 km to Gaurikund, and taking a taxi back to Sonprayag.", elevationMeters: 1982, distanceKm: 16 }
            ],
            packingList: [
              "Warm clothing (temperatures drop below freezing at night)",
              "Raincoat or umbrella",
              "Comfortable trekking or walking shoes",
              "Basic first-aid and altitude sickness medication"
            ],
            faqs: [
              { question: "Is the trek very difficult?", answer: "It is a continuous steep climb. While paved, the high altitude and distance make it challenging. Ponies and helicopters are available alternatives." }
            ]
          },
          {
            id: "har-ki-dun",
            name: "Har Ki Dun (Valley of Gods)",
            heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🌲",
            coords: [31.1400, 78.4300],
            elevation: "3,566 m",
            bestSeason: "April to June, September to December",
            difficulty: "Moderate",
            duration: "7 Days",
            distance: "47 km",
            overview: "A cradle-shaped amphitheatre valley tucked inside the Govind Pashu Vihar National Park, with views of the Swargarohini and Jaundhar glaciers and ancient wooden village settlements.",
            routeDescription: "The trek begins from Sankri and passes through the ancient villages of Taluka, Osla, and Gangaad. The trail runs alongside the Supin River, surrounded by dense pine forests and alpine meadows, eventually leading to the Har Ki Dun valley.",
            itinerary: [
              { day: 1, title: "Dehradun to Sankri", description: "Drive from Dehradun through the beautiful Yamuna and Tons valleys. Arrive at Sankri (1,950 m) by evening." },
              { day: 2, title: "Sankri to Pauni Garaat", description: "Drive to Taluka and begin trekking. Walk through dense forests of walnut and pine alongside the Supin River. Camp at Pauni Garaat (2,500 m).", elevationMeters: 2500, distanceKm: 10 },
              { day: 3, title: "Pauni Garaat to Kalkatiyadhar", description: "Trek past the ancient wooden village of Osla. The trail offers glimpses of the Dhauladhar range. Camp at Kalkatiyadhar (2,950 m) with great views.", elevationMeters: 2950, distanceKm: 7 },
              { day: 4, title: "Kalkatiyadhar to Har Ki Dun and back", description: "Trek to the Har Ki Dun valley (3,566 m) offering views of Swargarohini peak and Jaundhar Glacier. Spend time exploring and return to Kalkatiyadhar.", elevationMeters: 3566, distanceKm: 10 },
              { day: 5, title: "Kalkatiyadhar to Pauni Garaat", description: "Retrace your steps back to Pauni Garaat, enjoying the downhill walk.", elevationMeters: 2500, distanceKm: 7 },
              { day: 6, title: "Pauni Garaat to Sankri", description: "Trek back to Taluka and drive back to the base camp at Sankri.", elevationMeters: 1950, distanceKm: 10 }
            ],
            packingList: [
              "Trekking shoes with ankle support",
              "Warm layers (fleece, down jacket)",
              "Raincoat or poncho",
              "Trekking poles",
              "Personal medical kit"
            ],
            faqs: [
              { question: "Is Har Ki Dun a good trek for beginners?", answer: "Yes, it is a moderate trek with gradual ascents, making it suitable for fit beginners." }
            ]
          },
          {
            id: "chopta-tungnath",
            name: "Chopta, Tungnath & Chandrashila",
            heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🥾",
            coords: [30.4880, 79.2170],
            elevation: "4,000 m",
            bestSeason: "March to December",
            difficulty: "Easy to Moderate",
            duration: "2 Days",
            distance: "10 km",
            overview: "A summit trek to Chandrashila starting from the meadows of Chopta, visiting Tungnath—the highest Shiva temple in the world (3,680 m)—with a 360-degree view of Nanda Devi and Trishul.",
            routeDescription: "The trail starts from Chopta and climbs on a well-paved path through alpine meadows and rhododendron forests to Tungnath. Beyond Tungnath, a steeper rocky path leads to the Chandrashila summit.",
            itinerary: [
              { day: 1, title: "Chopta to Tungnath", description: "Begin the 3.5 km trek from Chopta (2,680 m). The trail offers great views of the Himalayas. Reach Tungnath temple (3,680 m) and rest.", elevationMeters: 3680, distanceKm: 3.5 },
              { day: 2, title: "Tungnath to Chandrashila Summit and back to Chopta", description: "Early morning 1.5 km steep hike to Chandrashila summit (4,000 m) for a spectacular sunrise over Nanda Devi. Descend all the way back to Chopta.", elevationMeters: 4000, distanceKm: 5 }
            ],
            packingList: [
              "Windproof and waterproof jacket",
              "Trekking shoes",
              "Fleece layers",
              "Sunscreen and sunglasses"
            ],
            faqs: [
              { question: "Can we trek to Tungnath in winter?", answer: "Yes, but the temple is closed and the trail is often covered in heavy snow, requiring proper snow gear." }
            ]
          }
        ]
      },
      {
        id: "chamoli",
        name: "Chamoli",
        tagline: "UNESCO alpine wildflower meadows, high-altitude Sikh sanctuaries, and Nanda Devi views",
        places: [
          {
            id: "valley-of-flowers",
            name: "Valley of Flowers National Park",
            heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🌸",
            coords: [30.7200, 79.6000],
            elevation: "3,658 m",
            bestSeason: "July to September (Peak bloom: late July/August)",
            difficulty: "Moderate",
            duration: "5 Days",
            distance: "38 km",
            overview: "A UNESCO World Heritage site carpeted in over 500 species of wild alpine flowers including blue poppies, brahma kamal, and orchids, framed by snow-clad peaks."
          },
          {
            id: "hemkund-sahib",
            name: "Hemkund Sahib & Lokpal Lake",
            heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=72",
            type: "spiritual",
            emoji: "☬",
            coords: [30.7000, 79.6200],
            elevation: "4,632 m",
            bestSeason: "June to October",
            difficulty: "Moderate to Difficult",
            duration: "1 Day (from Ghangaria)",
            distance: "12 km return",
            overview: "A high-altitude gurudwara perched on the banks of a glaciated lake surrounded by seven mountain peaks (Saptashringa) adorned with Nishan Sahib flags."
          },
          {
            id: "kuari-pass",
            name: "Kuari Pass (Curzon Trail)",
            heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🏔️",
            coords: [30.5000, 79.5500],
            elevation: "3,876 m",
            bestSeason: "March to June, September to December",
            difficulty: "Moderate",
            duration: "6 Days",
            distance: "33 km",
            overview: "Pioneered by Lord Curzon in 1905, this trek offers the grandest unobstructed panoramas of India's second highest peak, Nanda Devi (7,816 m), along with Dronagiri and Kamet."
          }
        ]
      },
      {
        id: "pauri-garhwal",
        name: "Pauri Garhwal",
        tagline: "Serene oak forests, colonial hill stations, and panoramic Himalayan viewpoints",
        places: [
          {
            id: "lansdowne",
            name: "Lansdowne Hill Station",
            heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "🌲",
            coords: [29.8370, 78.6800],
            elevation: "1,706 m",
            bestSeason: "Year-round",
            difficulty: "Easy",
            duration: "2 Days",
            overview: "A quiet, unspoiled cantonment town surrounded by thick oak and blue pine forests, famous for heritage forest trails, Bhulla Tal, and Tip-in-Top viewpoint."
          },
          {
            id: "khirsu",
            name: "Khirsu Mountain Village",
            heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "🍂",
            coords: [30.1700, 78.8500],
            elevation: "1,700 m",
            bestSeason: "March to June, September to November",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "A tranquil hamlet nestled amidst dense deodar, oak, and apple orchards offering one of the widest panoramic views of 300+ snow-capped Himalayan peaks."
          }
        ]
      },
      {
        id: "uttarkashi",
        name: "Uttarkashi",
        tagline: "Holy river origins, glaciated tapovans, and vast highland bugyals",
        places: [
          {
            id: "gangotri-gaumukh",
            name: "Gaumukh Tapovan Trek",
            heroImage: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🧊",
            coords: [30.9200, 79.0800],
            elevation: "4,463 m",
            bestSeason: "May to June, September to October",
            difficulty: "Difficult",
            duration: "6–7 Days",
            distance: "46 km",
            overview: "Trek to the snout of the Gangotri Glacier (Gaumukh), the true source of the holy River Ganga, and ascend to the legendary high alpine meadow of Tapovan under Mount Shivling."
          },
          {
            id: "dayara-bugyal",
            name: "Dayara Bugyal Trek",
            heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🌾",
            coords: [30.8500, 78.5500],
            elevation: "3,750 m",
            bestSeason: "Year-round (Summer greens or winter snow)",
            difficulty: "Easy to Moderate",
            duration: "5 Days",
            distance: "22 km",
            overview: "Considered one of the most expansive and scenic high-altitude alpine meadows (bugyals) in India, offering front-row views of Bandarpoonch, Black Peak, and the Gangotri range."
          },
          {
            id: "kedarkantha",
            name: "Kedarkantha Summit Trek",
            heroImage: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "❄️",
            coords: [31.0200, 78.1700],
            elevation: "3,800 m",
            bestSeason: "December to April for Snow, May to October for Green",
            difficulty: "Easy to Moderate",
            duration: "5 Days",
            distance: "20 km",
            overview: "India's quintessential winter snow trek, featuring a dramatic pre-dawn summit climb to a 3,800 m peak marked by a stone trishul shrine with 360-degree mountain vistas."
          }
        ]
      },
      {
        id: "pithoragarh",
        name: "Pithoragarh",
        tagline: "Kumaon frontier, Panchachuli glaciated massifs, and sacred Kailash routes",
        places: [
          {
            id: "munsiyari-panchachuli",
            name: "Munsiyari & Panchachuli Base Camp",
            heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "⛰️",
            coords: [30.0600, 80.2300],
            elevation: "4,260 m",
            bestSeason: "April to June, September to November",
            difficulty: "Moderate",
            duration: "6 Days",
            distance: "36 km",
            overview: "Trek along the roaring Goriganga River to the base of the five mythical cooking hearth peaks (Panchachuli) that dominate the skyline of Munsiyari."
          },
          {
            id: "khaliya-top",
            name: "Khaliya Top Ridge Hike",
            heroImage: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=72",
            type: "day-hike",
            emoji: "🥾",
            coords: [30.0800, 80.2100],
            elevation: "3,500 m",
            bestSeason: "March to December",
            difficulty: "Moderate",
            duration: "1–2 Days",
            overview: "A rewarding day hike through rhododendron forests leading to an alpine ridge offering an unmatched 360-degree panorama of Panchachuli, Nanda Devi, and Hardeol."
          },
          {
            id: "milam-glacier",
            name: "Milam Glacier Expedition",
            heroImage: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🧊",
            coords: [30.4500, 80.1500],
            elevation: "4,267 m",
            bestSeason: "May to June, September to October",
            difficulty: "Difficult",
            duration: "9–10 Days",
            distance: "60 km",
            overview: "A historic trek up the Johar Valley along the old Indo-Tibetan trade route to the largest glacier in the Kumaon Himalayas, beneath Mount Trishuli and Hardeol."
          }
        ]
      }
    ]
  },
  {
    id: "ladakh",
    name: "Ladakh",
    emoji: "🏜️",
    cardDesc: "The High Pass Kingdom — moonscape valleys, frozen winter river expeditions, ancient cliff monasteries, and deep blue saline lakes.",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/v1777213083/ladakhMain.png",
    subregions: [
      {
        id: "leh",
        name: "Leh",
        tagline: "Ancient royal capital, high mountain passes, and the turquoise expanse of Pangong",
        places: [
          {
            id: "markha-valley",
            name: "Markha Valley Trek",
            heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🏜️",
            coords: [33.8800, 77.4000],
            elevation: "5,200 m (Kongmaru La)",
            bestSeason: "June to September",
            difficulty: "Moderate to Difficult",
            duration: "6–7 Days",
            distance: "65 km",
            overview: "Ladakh's most famous trek traversing Hemis National Park, ancient mud-brick villages, waist-deep river crossings, and ascending to Kongmaru La for views of Kang Yatse.",
            routeDescription: "The trail mostly follows the Markha River, passing through several high-altitude Buddhist villages, barley fields, and ruined forts. It culminates in a steep climb over the Kongmaru La pass.",
            itinerary: [
              { day: 1, title: "Leh to Chilling, Trek to Skiu", description: "Drive to Chilling, cross the Zanskar river on a cable trolley, and trek to Skiu (3,400 m).", elevationMeters: 3400, distanceKm: 9 },
              { day: 2, title: "Skiu to Markha", description: "A long day walking along the Markha River, passing through thickets and old monasteries. Arrive at Markha village (3,700 m).", elevationMeters: 3700, distanceKm: 20 },
              { day: 3, title: "Markha to Thochuntse", description: "The trail intersects the river multiple times. Kang Yatse peak comes into view. Camp at Thochuntse (4,150 m).", elevationMeters: 4150, distanceKm: 13 },
              { day: 4, title: "Thochuntse to Nimaling", description: "A shorter walk to the high altitude pasture of Nimaling (4,700 m), where villagers bring their yaks to graze.", elevationMeters: 4700, distanceKm: 7 },
              { day: 5, title: "Nimaling to Shang Sumdo (via Kongmaru La)", description: "Steep ascent to Kongmaru La pass (5,200 m) with views of the Karakoram range. Descend into a gorge to Shang Sumdo (3,660 m).", elevationMeters: 5200, distanceKm: 18 },
              { day: 6, title: "Shang Sumdo to Leh", description: "A short walk to the roadhead followed by a drive back to Leh.", elevationMeters: 3500, distanceKm: 5 }
            ],
            packingList: [
              "Sturdy river-crossing sandals (Crocs or similar)",
              "High SPF sunscreen and lip balm",
              "Hydration bladder (3L capacity)",
              "Warm sleeping bag if camping",
              "Fleece and down jacket"
            ],
            faqs: [
              { question: "Is it a teahouse trek?", answer: "Yes, Markha Valley is one of the few true homestay/teahouse treks in India. You can sleep in village homestays without needing tents." }
            ]
          },
          {
            id: "pangong-tso",
            name: "Pangong Tso Lake",
            heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=72",
            type: "lake",
            emoji: "🌊",
            coords: [33.7500, 78.6500],
            elevation: "4,225 m",
            bestSeason: "May to September (Jan-Feb for frozen lake)",
            difficulty: "Easy",
            duration: "2 Days",
            overview: "A world-famous 134 km long endorheic lake extending from India to Tibet, known for shifting shades of cobalt, cyan, and emerald green against barren mountains."
          },
          {
            id: "khardung-la",
            name: "Khardung La Pass",
            heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            type: "road",
            emoji: "🏍️",
            coords: [34.2800, 77.6000],
            elevation: "5,359 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "Day Excursion",
            overview: "The world-renowned gateway between the Indus Valley and Nubra, draped with thousands of fluttering Tibetan prayer flags."
          },
          {
            id: "thiksey-monastery",
            name: "Thiksey Monastery",
            heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            type: "spiritual",
            emoji: "🛕",
            coords: [34.0500, 77.6600],
            elevation: "3,600 m",
            bestSeason: "Year-round",
            difficulty: "Easy",
            duration: "Half Day",
            overview: "A twelve-storey monastery complex resembling the Potala Palace of Lhasa, housing a magnificent two-storey statue of Maitreya Buddha."
          }
        ]
      },
      {
        id: "kargil",
        name: "Kargil",
        tagline: "Towering 7,000m Nun-Kun peaks, willow river valleys, and heroic border heights",
        places: [
          {
            id: "suru-valley",
            name: "Suru Valley & Nun Kun Massif",
            heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "⛰️",
            coords: [34.1500, 76.0000],
            elevation: "3,100 m",
            bestSeason: "May to October",
            difficulty: "Moderate",
            duration: "2–3 Days",
            overview: "One of the most dramatic valleys in Ladakh, with green willow groves along the Suru River set against the sheer vertical faces of Mount Nun (7,135 m) and Kun (7,077 m)."
          },
          {
            id: "mulbekh-monastery",
            name: "Mulbekh Rock-Carved Maitreya",
            heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            type: "spiritual",
            emoji: "🗿",
            coords: [34.3800, 76.3500],
            elevation: "3,230 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "Half Day",
            overview: "A giant 9-meter rock sculpture of Maitreya Buddha carved directly into a limestone cliff face dating back to the 8th century Kushan-Tibetan era on the Srinagar-Leh highway."
          }
        ]
      },
      {
        id: "nubra",
        name: "Nubra",
        tagline: "Cold white sand dunes, double-humped camels, and northern frontier apricot orchards",
        places: [
          {
            id: "hunder-sand-dunes",
            name: "Hunder Sand Dunes & Bactrian Camels",
            heroImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "🐪",
            coords: [34.5800, 77.4700],
            elevation: "3,050 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "A surreal high-altitude cold desert where rolling white sand dunes sit between snowy mountain ranges, home to rare double-humped Bactrian camels from the Silk Road."
          },
          {
            id: "diskit-monastery",
            name: "Diskit Monastery & 32m Buddha",
            heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            type: "spiritual",
            emoji: "🛕",
            coords: [34.5400, 77.5600],
            elevation: "3,144 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "Half Day",
            overview: "The oldest and largest monastery in the Nubra Valley, crowned by a majestic 32-meter statue of Jampa (Maitreya) Buddha facing down the Shyok River toward Pakistan."
          },
          {
            id: "turtuk",
            name: "Turtuk Balti Village",
            heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "🍑",
            coords: [34.8400, 76.8300],
            elevation: "2,900 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "The northernmost frontier settlement in India, opened to travelers in 2010. Renowned for its unique Balti culture, wooden irrigation canals, and lush apricot orchards."
          }
        ]
      },
      {
        id: "drass",
        name: "Drass",
        tagline: "The Gateway to Ladakh, second coldest inhabited place, and wildflower meadows",
        places: [
          {
            id: "mushkoh-valley",
            name: "Mushkoh Valley Wildflower Trail",
            heroImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🌸",
            coords: [34.4200, 75.7200],
            elevation: "3,300 m",
            bestSeason: "June to September",
            difficulty: "Easy to Moderate",
            duration: "1–2 Days",
            overview: "A picturesque, uncommercialized valley near Drass that blooms with wild alpine flora, tulip fields, and crystal mountain streams throughout the summer."
          },
          {
            id: "kargil-war-memorial",
            name: "Drass & Kargil War Memorial",
            heroImage: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=72",
            type: "spiritual",
            emoji: "🎖️",
            coords: [34.4300, 75.7500],
            elevation: "3,280 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "Half Day",
            overview: "Located along the highway at the base of the Tololing ridge, honoring the courage of Indian soldiers with mountain viewpoints overlooking Tiger Hill and Batra Top."
          }
        ]
      },
      {
        id: "zanskar",
        name: "Zanskar",
        tagline: "Remote glaciated kingdom, cliff-hanging cave monasteries, and frozen river trails",
        places: [
          {
            id: "chadar-trek",
            name: "Chadar Trek (Frozen River Expedition)",
            heroImage: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=72",
            type: "trek",
            emoji: "🧊",
            coords: [33.8000, 76.9000],
            elevation: "3,390 m",
            bestSeason: "January to February",
            difficulty: "Difficult",
            duration: "8–9 Days",
            distance: "62 km",
            overview: "One of the world's most unique winter wilderness treks — walking on a frozen sheet of ice (the Chadar) over the roaring Zanskar River through deep vertical gorges in sub-zero cold."
          },
          {
            id: "phuktal-monastery",
            name: "Phuktal Gompa (Cave Monastery)",
            heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
            type: "spiritual",
            emoji: "🛕",
            coords: [33.2700, 77.1800],
            elevation: "3,850 m",
            bestSeason: "June to October",
            difficulty: "Moderate",
            duration: "3–4 Days",
            distance: "25 km",
            overview: "An extraordinary 12th-century monastery built like a honeycomb around a natural cave opening high above the turquoise Tsarap Chu river gorge."
          },
          {
            id: "padum",
            name: "Padum & Karsha Gompa",
            heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=72",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=72",
            type: "scenic",
            emoji: "🏔️",
            coords: [33.4600, 76.8700],
            elevation: "3,669 m",
            bestSeason: "June to October",
            difficulty: "Easy",
            duration: "2–3 Days",
            overview: "The administrative capital of Zanskar, dominated by the whitewashed tiers of Karsha Monastery and surrounded by glaciated peaks."
          }
        ]
      }
    ]
  }
];

// ── O(1) index structures (built once at module load) ──────────────────────

/** region.id → HimalayaRegion */
export const regionIndex = new Map<string, HimalayaRegion>(
  himalayaAtlas.map((r) => [r.id, r])
);

/** `${regionId}/${subRegionId}` → HimalayaSubRegion */
export const subRegionIndex = new Map<string, HimalayaSubRegion>(
  himalayaAtlas.flatMap((r) => r.subregions.map((s) => [`${r.id}/${s.id}`, s]))
);

/** `${regionId}/${subRegionId}/${placeId}` → HimalayaPlace */
export const placeIndex = new Map<string, HimalayaPlace>(
  himalayaAtlas.flatMap((r) =>
    r.subregions.flatMap((s) =>
      s.places.map((p) => [`${r.id}/${s.id}/${p.id}`, p])
    )
  )
);

/**
 * placeId → { regionId, regionName, subRegionId, subRegionName }
 * Used by the global map to resolve a place's full location path in O(1).
 */
export interface PlaceLocation {
  name: string;
  regionId: string;
  regionName: string;
  subRegionId: string;
  subRegionName: string;
  href: string; // `/explore/${regionId}/${subRegionId}/${placeId}`
}

export const placeLocationIndex = new Map<string, PlaceLocation>(
  himalayaAtlas.flatMap((r) =>
    r.subregions.flatMap((s) =>
      s.places.map((p) => [
        p.id,
        {
          name: p.name,
          regionId: r.id,
          regionName: r.name,
          subRegionId: s.id,
          subRegionName: s.name,
          href: `/explore/${r.id}/${s.id}/${p.id}`,
        },
      ])
    )
  )
);


// ── Lookup helpers (O(1) via index) ─────────────────────────────────────────

export function getRegion(id: string): HimalayaRegion | undefined {
  return regionIndex.get(id);
}

export function getSubRegion(regionId: string, subRegionId: string): HimalayaSubRegion | undefined {
  return subRegionIndex.get(`${regionId}/${subRegionId}`);
}

export function getPlace(regionId: string, subRegionId: string, placeId: string): HimalayaPlace | undefined {
  return placeIndex.get(`${regionId}/${subRegionId}/${placeId}`);
}

/** Resolve a placeId → full location without nested scans. */
export function getPlaceLocation(placeId: string): PlaceLocation | undefined {
  return placeLocationIndex.get(placeId);
}

