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
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export interface HimalayaSubRegion {
  id: string;
  name: string;
  tagline?: string;
  division?: "Garhwal" | "Kumaon";
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
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/f_auto,q_auto,w_1000/v1780383856/jkMain.jpg",
    subregions: [
      {
        id: "jammu",
        name: "Jammu",
        tagline: "Rolling meadows, ancient pine forests, and revered spiritual sanctuaries",
        places: [
          {
            id: "patnitop",
            name: "Patnitop Meadow",
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
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/f_auto,q_auto,w_1000/v1777221149/himachalMain.jpg",
        subregions: [
      {
        id: "chamba",
        name: "Chamba",
        tagline: "Pir Panjal crests, ancient Gaddi shepherd kingdoms, sacred Manimahesh Lake, and the wild cliffs of Sach Pass",
        places: [
          {
            id: "dalhousie-dainkund",
            name: "Dalhousie & Dainkund Peak",
            type: "scenic",
            emoji: "🌲",
            coords: [32.5388, 75.9711],
            elevation: "2,755 m",
            bestSeason: "March to June, September to December",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Perched along the Dhauladhar ridgeline, Dalhousie is an iconic colonial-era alpine hill retreat surrounded by towering deodar forests. The trail to Dainkund Peak (2,755m)—known as the Singing Hill—offers a sweeping 360-degree panorama of the Chenab, Ravi, and Beas river basins and the snow-clad Pir Panjal range.",
            experience: "Walking through whispering pine forests to the Pholani Devi temple crest as distant snow massifs reflect afternoon sunlight.",
            tips: [
              "Take the 3 km forest ridge hike from Dainkund to Kalatop Wildlife Sanctuary for pristine birdwatching.",
              "Morning hours offer the clearest views of the Pir Panjal peaks before afternoon cloud build-up."
            ],
            faqs: [
              {
                question: "What is the best time to visit Dalhousie and Dainkund Peak?",
                answer: "April to June for pleasant alpine weather and blooming rhododendrons; October to December for crystal-clear Himalayan views and early winter snowfall."
              },
              {
                question: "How difficult is the Dainkund Peak hike?",
                answer: "The Dainkund Peak hike is an easy, beginner-friendly 1.5-hour ridge ascent suitable for families and acclimatizing hikers."
              }
            ],
            seoTitle: "Dalhousie & Dainkund Peak (2,755m) Guide — Ridge Hike & Map",
            seoDescription: "Explore Dalhousie and Dainkund Peak (2,755m) in Chamba, Himachal Pradesh. 360° views of Pir Panjal, Pholani Devi temple hike, Kalatop sanctuary trail, and seasonal guide."
          },
          {
            id: "khajjiar-meadow",
            name: "Khajjiar Meadow & Lake",
            type: "lake",
            emoji: "⛳",
            coords: [32.5558, 76.0656],
            elevation: "1,920 m",
            bestSeason: "March to June, September to November",
            difficulty: "Easy",
            duration: "1 Day",
            overview: "Often celebrated as the 'Mini Switzerland of India', Khajjiar is a saucer-shaped glade nestled within dense deodar and fir forests. At its heart lies a small tranquil lake with a floating island of reed grass, framed by the 12th-century wooden temple of Khajji Nag with intricately carved serpent motifs.",
            experience: "Lazing on the emerald turf surrounded by colossal centuries-old cedar trees while horses graze peacefully across the meadows.",
            tips: [
              "Visit early morning before day-tripper crowds arrive from Dalhousie.",
              "The 12th-century Khajji Nag temple contains rare wooden sculptures depicting the Mahabharata Pandava legends."
            ],
            faqs: [
              {
                question: "Why is Khajjiar called Mini Switzerland?",
                answer: "In 1992, Swiss Ambassador Willy P. Blazer designated Khajjiar as one of the 160 locations worldwide that bear physical topographical resemblance to Switzerland."
              }
            ],
            seoTitle: "Khajjiar Meadow & Lake Guide — Mini Switzerland of Himachal",
            seoDescription: "Complete guide to Khajjiar Lake & Meadow (1,920m) in Chamba. Discover deodar pine walks, the 12th-century Khajji Nag temple, floating island, and travel tips."
          },
          {
            id: "bharmour-chaurasi",
            name: "Bharmour & Chaurasi Temples",
            type: "spiritual",
            emoji: "🛕",
            coords: [32.4411, 76.5367],
            elevation: "2,195 m",
            bestSeason: "April to November",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Historically known as Brahmpura, Bharmour was the ancient 6th-century capital of the Chamba kingdom and is the sacred spiritual heartland of the nomadic Gaddi shepherds. The town centers around the legendary Chaurasi Temple complex—a sanctified courtyard of 84 ancient stone shrines dating back over 1,400 years, anchored by the iconic Manimahesh and Lakshana Devi temples.",
            experience: "Stepping barefoot onto smooth, sun-warmed stone flags where Gaddi pastoralists chant centuries-old hymns before beginning their high pass crossings.",
            tips: [
              "Bharmour serves as the mandatory base camp and acclimatization hub for the Manimahesh Yatra.",
              "The Lakshana Devi temple features masterwork 7th-century deodar wood carvings and cast bronze sculptures."
            ],
            faqs: [
              {
                question: "What is the significance of the Chaurasi Temples in Bharmour?",
                answer: "Legend holds that 84 holy yogis (Siddhas) visited ancient Brahmpura and blessed the king with an heir; 84 shrines were erected to commemorate their divine presence."
              }
            ],
            seoTitle: "Bharmour Chaurasi Temples (2,195m) — Ancient Gaddi Capital & Guide",
            seoDescription: "Explore Bharmour & the 84 Chaurasi Temples (2,195m) in Chamba. Ancient Brahmpura architecture, Gaddi shepherd heritage, and base camp for the holy Manimahesh Yatra."
          },
          {
            id: "manimahesh-kailash",
            name: "Manimahesh Kailash Lake & Trek",
            type: "trek",
            emoji: "⛰️",
            coords: [32.4042, 76.6347],
            elevation: "4,080 m",
            bestSeason: "July to September",
            difficulty: "Difficult",
            duration: "4–5 Days",
            distance: "28 km",
            overview: "One of the most sacred high-altitude pilgrimage treks in the Indian Himalayas, leading to the glacial tarn of Manimahesh Lake (4,080m) resting immediately beneath the unclimbed, pyramidal summit of Manimahesh Kailash (5,653m). Undertaken annually during the sacred Janmashtami and Radhashtami fairs, the trail climbs steeply from Hadsar through steep alpine gorges, glacial moraines, and the high pasture of Gauri Kund.",
            experience: "Gazing up from the turquoise glacial lake at dawn as the first golden rays illuminate the sheer granite horn of Manimahesh Kailash.",
            tips: [
              "Acclimatize thoroughly in Bharmour (2,195m) for at least 24 hours before beginning the steep trek from Hadsar.",
              "Weather is extremely fickle; freezing rain, hail, and high winds are frequent even during peak summer pilgrimage season. Carry complete waterproofs."
            ],
            faqs: [
              {
                question: "Can anyone climb Manimahesh Kailash peak?",
                answer: "No. The 5,653m summit of Manimahesh Kailash is revered as the divine abode of Lord Shiva and remains strictly unclimbed out of deep religious reverence."
              },
              {
                question: "How long is the Manimahesh trek?",
                answer: "The trail from the Hadsar trailhead to Manimahesh Lake is 14 km each way (28 km total round-trip), typically completed over 3 to 4 days with halts at Dhancho and Sundrasi."
              }
            ],
            seoTitle: "Manimahesh Kailash Lake Trek (4,080m) — Route, Yatra Guide & 3D Map",
            seoDescription: "Complete guide to the sacred Manimahesh Kailash Trek (4,080m) in Chamba. Route map from Hadsar, Gauri Kund, Yatra season, altitude precautions, and packing checklist."
          },
          {
            id: "sach-pass",
            name: "Sach Pass Alpine Crossing",
            type: "road",
            emoji: "🚙",
            coords: [33.0078, 76.2417],
            elevation: "4,414 m",
            bestSeason: "Late June to Mid-October",
            difficulty: "Challenging",
            duration: "1–2 Days",
            overview: "Notorious as one of the most perilous, thrilling, and rugged high-altitude motorable passes in the world, Sach Pass (4,414m / 14,482 ft) cuts through the formidable Pir Panjal range to connect the fertile Chamba Valley with the isolated, cliff-bound canyon of Pangi Valley. The road is carved out of sheer vertical rockfaces with thunderous glacial waterfalls cascading across the single-lane track.",
            experience: "Navigating massive 20-foot snow walls in July as icy meltwater splashes over your chassis, gazing down into thousands of feet of sheer gorge drop-offs.",
            tips: [
              "4x4 high-clearance vehicles are strictly recommended. Attempting Sach Pass in low sedans is extremely risky.",
              "The pass is only open for 3 to 4 months a year due to extreme winter snow accumulation exceeding 15 meters."
            ],
            faqs: [
              {
                question: "When does Sach Pass open each year?",
                answer: "Sach Pass typically opens by late June or early July after the Border Roads Organisation (BRO) clears massive snowpack, and closes by mid-to-late October with early winter blizzards."
              }
            ],
            seoTitle: "Sach Pass (4,414m) Highway Guide — Chamba to Pangi Valley 4x4 Route",
            seoDescription: "Essential guide to crossing Sach Pass (4,414m / 14,482 ft). Road status, opening dates, 4x4 route conditions from Bairagarh to Killar, and mountain safety."
          },
          {
            id: "pangi-valley",
            name: "Pangi Valley & Killar Gorge",
            type: "scenic",
            emoji: "🏞️",
            coords: [33.0889, 76.4319],
            elevation: "2,600–3,500 m",
            bestSeason: "June to October",
            difficulty: "Challenging",
            duration: "3–4 Days",
            overview: "Pangi Valley is the most remote, untamed, and culturally untouched alpine enclave in Himachal Pradesh, carved by the wild torrential currents of the Chandrabhaga (Chenab) River between the Pir Panjal and Zanskar mountain ranges. Centered around the rugged township of Killar, Pangi is home to the indigenous Pangwala and Bhot communities living in stone-and-timber hamlets surrounded by steep birch forests and glaciated ridges.",
            experience: "Discovering an ancient world cut off from modern civilization for 7 months of the year, where prayer flags flutter alongside wooden serpent-carved temples.",
            tips: [
              "Carry ample cash and fuel; ATMs and fuel stations are virtually non-existent beyond Killar.",
              "Connects to Kishtwar via the infamous Cliffhanger Road or to Keylong via Tandi."
            ],
            faqs: [
              {
                question: "How do you reach Pangi Valley?",
                answer: "Via Sach Pass from Chamba in summer, or via Atal Tunnel and Keylong through Udaipur along the Chandrabhaga river valley."
              }
            ],
            seoTitle: "Pangi Valley & Killar (2,600m) — Wild Himalayas Guide & Chenab Gorge",
            seoDescription: "Explore the remote wilderness of Pangi Valley and Killar in Chamba. Chandrabhaga river canyon, tribal Pangwala heritage, cliffhanger routes, and travel guide."
          }
        ]
      },
      {
        id: "kangra",
        name: "Kangra",
        tagline: "Dramatic Dhauladhar snow ridges, Tibetan Buddhist enclaves, paragliding skies, and high pass crossings",
        places: [
          {
            id: "triund",
            name: "Triund Trek",
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
            type: "adventure",
            emoji: "🪂",
            coords: [32.0500, 76.7100],
            elevation: "2,400 m (Billing takeoff)",
            bestSeason: "October to June",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Ranked as one of the best paragliding sites in the world, Billing offers tandem flights landing down in the Tibetan colony of Bir with views of the snow-clad Kangra Valley."
          },
          {
            id: "dharamshala-mcleodganj",
            name: "Dharamshala & McLeod Ganj",
            type: "spiritual",
            emoji: "🕉️",
            coords: [32.2426, 76.3213],
            elevation: "2,082 m",
            bestSeason: "Year-round (Best: March–June, Sep–Nov)",
            difficulty: "Easy",
            duration: "2–3 Days",
            overview: "Known globally as 'Little Lhasa', McLeod Ganj sits on the upper forested slopes of the Kangra Valley beneath the towering granite cliffs of the Dhauladhar range. It is the spiritual home of the 14th Dalai Lama and the Tibetan Government-in-Exile, featuring the grand Tsuglagkhang Temple complex, the Tibetan Library of Works and Archives, St. John in the Wilderness church, and lively mountain bazaars.",
            experience: "Listening to Tibetan monks enthusiastically debating Buddhist philosophy in the Tsuglagkhang courtyard while prayer wheels spin against mountain mists.",
            tips: [
              "Walk the peaceful circumambulation path (Kora) around the Dalai Lama's temple for panoramic Kangra valley views.",
              "Serves as the primary springboard for Triund, Kareri Lake, and Indrahar Pass treks."
            ],
            faqs: [
              {
                question: "What is the difference between Dharamshala and McLeod Ganj?",
                answer: "Dharamshala is the lower commercial and administrative city (1,457m), while McLeod Ganj (2,082m) is the upper hillside enclave where the Dalai Lama resides and Tibetan culture flourishes."
              }
            ],
            seoTitle: "McLeod Ganj & Dharamshala (2,082m) — Tibetan Culture & Alpine Guide",
            seoDescription: "Explore McLeod Ganj & Dharamshala in Kangra. Visit Tsuglagkhang temple, Dalai Lama residence, Tibetan heritage trails, and Dhauladhar trekking bases."
          },
          {
            id: "indrahar-pass",
            name: "Indrahar Pass Trek",
            type: "trek",
            emoji: "🧗",
            coords: [32.2858, 76.3725],
            elevation: "4,342 m",
            bestSeason: "May to June, September to October",
            difficulty: "Difficult",
            duration: "4–5 Days",
            distance: "35 km",
            overview: "The definitive high-altitude pass trek across the Dhauladhar crest. Originating from McLeod Ganj and continuing past Triund and the glacial amphitheater of Ilaqa Got, the route ascends steep boulder moraines and the famous Lahesh cave (3,500m) before tackling a grueling climb over steep stone steps and snow gullies to reach Indrahar Pass (4,342m / 14,245 ft). The pass connects Kangra with the Ravi river basin in Bharmour.",
            experience: "Resting inside the ancient Lahesh shepherd cave by campfire light before embarking on a pre-dawn scramble up the near-vertical Dhauladhar snow gullies.",
            tips: [
              "High-grade trekking boots with rigid ankle support are crucial for the jagged, shifting boulder fields above Ilaqa Got.",
              "Start from Lahesh cave before 5:30 AM to summit Indrahar Pass before noon, when dense fog frequently rolls up from the plains."
            ],
            faqs: [
              {
                question: "How difficult is Indrahar Pass compared to Triund?",
                answer: "Triund is an easy-to-moderate weekend hike on a well-trodden path. Indrahar Pass is significantly harder, requiring crossing steep boulder fields, rock scrambling, and high-altitude endurance above 4,300m."
              }
            ],
            seoTitle: "Indrahar Pass Trek (4,342m) — Dhauladhar Crest Route & Map",
            seoDescription: "Complete guide to Indrahar Pass Trek (4,342m). Trail breakdown from McLeod Ganj & Triund, Lahesh cave, boulder scrambles, best season, and 3D elevation profile."
          },
          {
            id: "kangra-fort-masrur",
            name: "Kangra Fort & Masrur Rock Temples",
            type: "spiritual",
            emoji: "🏰",
            coords: [32.0997, 76.2558],
            elevation: "730 m",
            bestSeason: "October to April",
            difficulty: "Easy",
            duration: "1 Day",
            overview: "Kangra Fort, perched on a precipitous sandstone spur at the confluence of the Banganga and Manjhi rivers, is the oldest surviving fort in the Himalayas and one of the oldest in India, tracing its roots to the ancient Katoch dynasty and the Mahabharata Trigarta kingdom. A short distance away lie the Masrur Rock-Cut Temples (8th century), an extraordinary monolithic temple complex carved directly out of a sandstone ridge, reflecting classical North Indian Nagara rock architecture.",
            experience: "Standing atop the massive battlements of Kangra Fort looking down onto vertical river gorges with the snow-covered Dhauladhar wall rising abruptly behind.",
            tips: [
              "Visit Masrur during sunset when the sandstone temple carvings are illuminated across the mirror water reflection tank.",
              "Audio guides at Kangra Fort provide detailed accounts of historical sieges by Mahmud of Ghazni and Jahangir."
            ],
            faqs: [
              {
                question: "Why are the Masrur Rock Cut Temples unique?",
                answer: "Masrur is the only monolithic rock-cut temple complex in the Himalayas, carved directly out of a single sandstone outcrop in the style of Ellora in Maharashtra."
              }
            ],
            seoTitle: "Kangra Fort & Masrur Rock Cut Temples — Ancient Heritage Guide",
            seoDescription: "Discover Kangra Fort (oldest fort in the Himalayas) and the 8th-century monolithic Masrur Rock Cut Temples. Katoch dynasty history, architecture, and visitor guide."
          }
        ]
      },
      {
        id: "kullu",
        name: "Kullu & Manali",
        tagline: "Manali trailheads, Solang Valley, Parvati hot springs, alpine glaciers, and iconic high-altitude pass crossings",
        places: [
          ...treks
            .filter((t) => !t.region || t.region.toLowerCase().includes("kullu") || t.region.toLowerCase().includes("manali") || t.region.toLowerCase().includes("himachal"))
            .map((t) => {
            const isDayHike =
              (t.duration.toLowerCase().includes("1 day") && !t.duration.toLowerCase().includes("3 day")) ||
              t.duration.toLowerCase().includes("hour") ||
              t.slug === "lamadugh";

            const isPatalsu = t.slug === "patalsu-peak";
            const experience = isPatalsu
              ? "I did Patalsu as a continuous 12 to 13-hour single-day speed-hike in October with only minimal breaks. Conquering the +1,781m vertical gain in one push is an incredible test of mountain endurance, but for most trekkers, I strongly recommend doing this as a 2 to 3-day trek. Camping at Shagadugh gives your body time to acclimatize and lets you truly experience the peaceful forest before tackling the relentless loose scree on the summit ridge."
              : undefined;

            const tips = isPatalsu
              ? [
                  "Water Warning: Natural water sources end very early, roughly 500 meters above Solang Village. There is no reliable water along the upper forest, Shagadugh (dry in late season), or the summit ridge. You must carry at least 2 to 4 Liters of water from the start.",
                  "Duration Recommendation: While trail runners and seasoned endurance hikers can tackle this as a grueling 12–13 hour single-day speed-hike, we strongly recommend 2 to 3 days for standard trekkers with a camp at Shagadugh meadow (3,250m).",
                  "Early Alpine Start: Start before dawn (5:00 AM) to summit before afternoon cloud buildups and gale winds, and to avoid descending the steep, slippery forest sections in total darkness.",
                  "Scree Footing & Poles: The final 200m vertical ascent traverses narrow, wind-swept loose scree and fractured shale. Sturdy boots with deep traction lugs and trekking poles are non-negotiable for balance.",
                  "Wind Protection: Even during clear October weather, winds on the exposed 4,200m ridge are bitterly cold. Carry a windproof shell jacket, warm beanie, and thermal gloves."
                ]
              : undefined;

            return {
              id: t.slug,
              name: t.title,
              type: (isDayHike ? "day-hike" : "trek") as PlaceType,
              emoji: isDayHike ? "🚶" : (isPatalsu ? "⛰️" : "🥾"),
              coords: t.coords,
              elevation: t.maxAltitude,
              bestSeason: t.bestSeason,
              difficulty: t.difficulty,
              duration: t.duration,
              distance: t.distance,
              overview: t.overview,
              routeDescription: t.routeDescription,
              experience,
              tips,
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
            elevation: p.height + " m",
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
            name: "Sethan Village — Hampta Valley",
            type: "scenic",
            emoji: "🛖",
            coords: [32.2240, 77.2510],
            elevation: "2,700 m",
            bestSeason: "Year-round (Igloo season: Jan–March; Trekking: May–Oct)",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Perched at 2,700 meters atop the Hampta ridge 12 km above Prini, Sethan is a secluded Buddhist Khampa mountain village offering sweeping 360-degree vistas of the Dhauladhar Range, Indrasan, and the Kullu Valley far below. Resettled by horse-breeding Tibetan migrants in the mid-20th century, Sethan has emerged as an internationally celebrated alpine adventure hub: a world-class bouldering destination with hundreds of virgin granite problems, India's premier winter igloo stay and ski-touring zone, and the official starting roadhead for the Hampta Pass & Chandratal crossover trek.",
            experience: "Stepping outside a handcrafted snow igloo on a sub-zero winter night to gaze at the Milky Way blazing above the razor-sharp outline of the Dhauladhar crest.",
            tips: [
              "The winding road from Prini features 35 steep hairpin bends; 4x4 vehicles with snow chains are essential between December and March.",
              "A minor forest entry fee is payable at the Prini forest barrier.",
              "From Sethan, you can hike 3 km to Jobri Nallah, the lush pine forest trailhead for Hampta Pass."
            ],
            faqs: [
              {
                question: "Can you stay in real snow igloos in Sethan?",
                answer: "Yes, from mid-January through late March, local alpine operators construct genuine snow igloos fitted with sub-zero sleeping bags, foam insulation, and warm sheepskin blankets."
              },
              {
                question: "Is Sethan accessible year-round?",
                answer: "Yes, though heavy winter snowfalls require 4WD vehicles with snow chains or a scenic hike from the lower snowline."
              }
            ],
            seoTitle: "Sethan Village — Hampta Valley (2,700m) | Igloos, Bouldering & Trek Base",
            seoDescription: "Complete guide to Sethan Village & Hampta Valley (2,700m). Winter snow igloos, world-class granite bouldering, Dhauladhar vistas, and Hampta Pass trailhead."
          },
          {
            id: "tirthan-valley",
            name: "Tirthan Valley & GHNP",
            type: "scenic",
            emoji: "🐟",
            coords: [31.6300, 77.4000],
            elevation: "1,600–3,800 m",
            bestSeason: "March to June, Sep to Nov",
            difficulty: "Moderate",
            duration: "2–4 Days",
            heroImage: "https://images.unsplash.com/photo-1651391572827-97410cbb2f82?auto=format&fit=crop&w=1600&q=80",
            images: [
              "https://images.unsplash.com/photo-1651391572827-97410cbb2f82?auto=format&fit=crop&w=1600&q=80",
            ],
            overview: "Pristine buffer zone of the UNESCO Great Himalayan National Park, famous for crystal trout streams, dense deodar forests, and peaceful trails to Jalori Pass and Serolsar Lake."
          },
          {
            id: "hadimba-temple",
            name: "Hadimba Devi Temple",
            type: "spiritual",
            emoji: "🛕",
            coords: [32.2483, 77.1706],
            elevation: "2,050 m",
            bestSeason: "Year-round (Saroohni Mela in May)",
            difficulty: "Easy",
            duration: "Half Day",
            overview: "Built in 1553 CE by Maharaja Bahadur Singh, the Hadimba Devi Temple (also known as the Dhungri Temple) is an ancient four-tiered wooden pagoda dedicated to Goddess Hadimba, wife of the Pandava prince Bhima from the Mahabharata. Nestled within the colossal, sacred cedar groves of the Dhungri Van Vihar, the temple is an architectural marvel of indigenous Himalayan woodcraft, adorned with intricate carvings of deities, dancers, foliate motifs, and real ibex and stag horns mounted on outer walls.",
            experience: "Walking quietly through mossy towering deodars where filtered morning sunbeams pierce through pine mist, hearing the resonance of brass temple bells and wood-smoke incense.",
            tips: [
              "Visit early between 7:00 AM and 8:30 AM to beat tour-bus crowds and witness traditional morning prayers.",
              "Don't miss the smaller Ghatotkach Tree Shrine located about 70 meters downhill, dedicated to Hadimba and Bhima's warrior son.",
              "The surrounding Dhungri forest trails connect directly up to Old Manali and the Nasogi village paths."
            ],
            faqs: [
              {
                question: "What is unique about the architecture of Hadimba Temple?",
                answer: "It features a distinctive 24-meter-tall four-tiered roof constructed in 1553 CE, with three square tiers of timber shingles topped by a conical brass-and-copper canopy, built around a natural rock outcrop believed to be the deity's footprint."
              },
              {
                question: "Can visitors enter the temple sanctum?",
                answer: "Yes, visitors can enter after removing shoes and leather items. The sanctum encloses a natural rock cave shrine rather than a carved idol."
              }
            ],
            seoTitle: "Hadimba Devi Temple (2,050m) Manali — History, Architecture & Guide",
            seoDescription: "Complete visitor guide to the 16th-century Hadimba Temple in Manali. 1553 CE pagoda architecture, Dhungri sacred deodar forest, rituals, Ghatotkach shrine, and hours."
          },
          {
            id: "old-manali",
            name: "Old Manali",
            type: "scenic",
            emoji: "🏡",
            coords: [32.2530, 77.1750],
            elevation: "2,050 m",
            bestSeason: "Year-round (Best: April to June, Sep to Nov)",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Perched gracefully on a sunlit hillside across the rushing Manalsu River, Old Manali (the ancestral village of Manaligarh) is the cultural antithesis of the commercial highway town. Characterized by multi-storied slate-roofed Kath-Kuni timber-and-stone houses, heritage apple orchards, winding stone alleys, artisan silver studios, live music cafes, and the sacred Manu Maharishi Temple (the only temple in India dedicated to Sage Manu, progenitor of mankind). It is also the historic trailhead for the high alpine trek to the Lamadugh meadow plateau.",
            experience: "Sipping pour-over coffee on a wooden balcony overlooking roaring river waters and emerald cedar slopes while Himalayan cedar thrushes sing in the orchard branches.",
            tips: [
              "Wander up to the top of the village to visit the Manu Temple, which offers commanding views over the upper Beas basin.",
              "The trail behind Manu Temple leads directly into the high pine forest toward Lamadugh and Khanpari Tibba.",
              "Strolling through the village in late afternoon during apple harvest season (August–September) fills the air with sweet cider aromas."
            ],
            faqs: [
              {
                question: "How does Old Manali differ from New Manali Mall Road?",
                answer: "Old Manali preserves traditional Himachali village architecture, quiet orchard lanes, bohemian cafes, and historical shrines, located 2.5 km uphill from the commercial shops of Mall Road."
              }
            ],
            seoTitle: "Old Manali Village (2,050m) — Cafes, Kath-Kuni Architecture & Manu Temple",
            seoDescription: "Explore Old Manali: heritage timber-and-stone architecture, Manu Maharishi Temple, Bohemian cafes, apple orchards, and scenic mountain trails above Manalsu River."
          },
          {
            id: "kheerganga",
            name: "Kheerganga Hot Springs Trek",
            type: "trek",
            emoji: "♨️",
            coords: [31.9890, 77.5120],
            elevation: "2,960 m",
            bestSeason: "April to June, September to November",
            difficulty: "Moderate",
            duration: "2 Days",
            distance: "24 km",
            overview: "One of the most famous trekking routes in the Parvati Valley, winding through dramatic gorges, roaring waterfalls, and towering pine and oak forests from Barshaini. Kheerganga ('milky holy water') sits in an alpine meadow surrounded by glaciated peaks, renowned for its natural geothermal sulfur hot springs where trekkers soak after completing the 12 km mountain ascent.",
            experience: "Submerging in steaming thermal water under crisp Himalayan night skies while snow-capped ridgelines loom in the moonlight.",
            tips: [
              "Start your trek from Barshaini before 9:00 AM to reach Kheerganga comfortably before dusk.",
              "Carry warm thermal layers for nighttime; temperatures drop near freezing even during summer."
            ],
            faqs: [
              {
                question: "Is the Kheerganga hot spring natural?",
                answer: "Yes, it is a natural geothermal sulfur hot spring possessing therapeutic mineral qualities, channeled into bathing pools with separate sections for men and women."
              }
            ],
            seoTitle: "Kheerganga Trek (2,960m) Parvati Valley — Route, Hot Springs & Map",
            seoDescription: "Complete guide to Kheerganga Trek (2,960m). Trail from Barshaini, natural sulfur baths, camping meadows, difficulty rating, and seasonal tips."
          },
          {
            id: "pin-parvati-pass",
            name: "Pin Parvati Pass Expedition",
            type: "trek",
            emoji: "🏔️",
            coords: [31.8450, 77.7850],
            elevation: "5,319 m",
            bestSeason: "July to September",
            difficulty: "Challenging",
            duration: "11 Days",
            distance: "110 km",
            overview: "The crown jewel of Himalayan crossover expeditions, connecting the lush, rain-drenched coniferous forests of Parvati Valley in Kullu with the stark, rain-shadow cold desert of Pin Valley in Spiti. Trekkers traverse dense pine woods, raging river crossings, the sacred high tarn of Mantalai Lake (4,100m), and vast glaciated crevasse fields to summit the formidable 5,319m pass before descending into the Martian landscapes of Mudh.",
            experience: "Stepping from heavily crevassed glacial ice onto dry shale, witnessing the jaw-dropping contrast between two entirely different geographic worlds.",
            tips: [
              "Strictly for experienced alpine trekkers with prior high-altitude endurance experience above 4,500m.",
              "Crampons, microspikes, and roped glacier safety protocols are required for the snowfields and ice bridges around the pass."
            ],
            faqs: [
              {
                question: "Why is Pin Parvati Pass considered challenging?",
                answer: "It spans 110 km over 11 days, involves continuous boulder scrambling, unpredictable glacier crevasses, frigid river fordings, and sustained exposure above 4,500m."
              }
            ],
            seoTitle: "Pin Parvati Pass Trek (5,319m) — Expedition Guide & Crossover Map",
            seoDescription: "Detailed expedition dossier for Pin Parvati Pass (5,319m / 17,450 ft). 11-day itinerary from Parvati to Spiti, Mantalai Lake, glacier route, and safety gear."
          },
          {
            id: "rohtang-pass",
            name: "Rohtang Pass",
            type: "road",
            emoji: "🏔️",
            coords: [32.3716, 77.2466],
            elevation: "3,978 m",
            bestSeason: "May to October",
            difficulty: "Moderate",
            duration: "1 Day",
            overview: "Rohtang Pass (3,978m / 13,051 ft) is the historic mountain gateway on the Pir Panjal Range connecting the Kullu Valley with the high arid valleys of Lahaul and Spiti. Meaning 'Pile of Corpses' in Tibetan due to historical storms that caught ancient caravans off guard, Rohtang offers panoramic views of glaciated peaks, hanging glaciers, and the source of the Beas River at Beas Kund.",
            experience: "Looking down from the crest into the lush green depths of Kullu on the south and the dramatic, barren rocky ramparts of Lahaul on the north.",
            tips: [
              "A mandatory NGT permit is required for non-commercial and private vehicles traveling to Rohtang Pass.",
              "With the opening of the Atal Tunnel, Rohtang remains a scenic high-altitude destination rather than the sole vehicular transit corridor."
            ],
            faqs: [
              {
                question: "Do I need a permit to visit Rohtang Pass?",
                answer: "Yes, an online Rohtang Pass permit issued by the District Administration of Kullu is required to drive to the summit."
              }
            ],
            seoTitle: "Rohtang Pass (3,978m) Guide — Permits, Snow Points & Manali Access",
            seoDescription: "Essential visitor guide to Rohtang Pass (3,978m / 13,051 ft) in Manali. NGT online permits, snow activities, Pir Panjal panoramas, and weather updates."
          },
          {
            id: "jalori-pass-serolsar",
            name: "Jalori Pass & Serolsar Lake",
            type: "trek",
            emoji: "🌿",
            coords: [31.5367, 77.4042],
            elevation: "3,120 m",
            bestSeason: "April to November",
            difficulty: "Easy to Moderate",
            duration: "1–2 Days",
            distance: "10 km",
            overview: "Jalori Pass (3,120m) is a high mountain pass connecting the inner Kullu Valley with Shimla and the Sutlej river basin. From the pass, an enchanting 5 km gentle forest trail winds through dense oak, rhododendron, and blue pine woods to Serolsar Lake—a pristine emerald body of water held sacred to Buddhi Nagin, the mythical mother of 60 snake deities.",
            experience: "Walking under ancient moss-draped oak canopies where sunlight filters through green leaves, arriving at a mirror lake without a single fallen leaf on its surface.",
            tips: [
              "Local folklore holds that birds immediately pick out any leaf that falls onto the sacred surface of Serolsar Lake.",
              "The pass can experience heavy winter snowfall from December to March, closing vehicular access."
            ],
            faqs: [
              {
                question: "How long is the hike to Serolsar Lake from Jalori Pass?",
                answer: "The hike is an easy 5 km each way (10 km total round trip), taking approximately 2 to 3 hours through pristine shaded oak forests."
              }
            ],
            seoTitle: "Jalori Pass & Serolsar Lake Trek (3,120m) — Tirthan Valley Guide",
            seoDescription: "Explore Jalori Pass (3,120m) and the mystical Serolsar Lake trail. Dense oak forests, Buddhi Nagin temple, Great Himalayan National Park border, and route map."
          },
          {
            id: "mall-road",
            name: "Manali Mall Road",
            type: "scenic",
            emoji: "🛍️",
            coords: [32.2396, 77.1887],
            elevation: "2,000 m",
            bestSeason: "Year-round",
            difficulty: "Easy",
            duration: "Half Day / Evening",
            overview: "The central pedestrian-only promenade of Manali town, Mall Road is the social and commercial crossroads of the upper Beas Valley. Lined with wooden gables, traditional handloom emporiums selling authentic Kullu shawls, Himachali pattu coats, Tibetan handicraft stalls, Hong Kong market bazaars, and cozy sweetshops serving steaming jalebis and siddu. Directly adjacent to the mall is Van Vihar, a serene nature sanctuary of century-old deodar trees bordering the boulder-strewn waters of the Beas River.",
            experience: "Strolling along the lamplit paved avenue on a brisk mountain evening, smelling roasting walnuts and cedar wood while snow-crowned summits turn amber in the twilight.",
            tips: [
              "Mall Road is strictly pedestrianized; private vehicles are barred from the promenade.",
              "Look for the state-run Himachal Handloom & Handicrafts Emporium or Bhuttico showrooms for certified handloom shawls with genuine GI tags.",
              "Combine your evening walk with a tranquil stroll through the towering deodars of Van Vihar park."
            ],
            faqs: [
              {
                question: "What are the best items to buy on Manali Mall Road?",
                answer: "Authentic woolen Kullu shawls with geometric borders, Himachali Kinnauri caps (topis), pure cedarwood carvings, wild Himalayan honey, dried apricots, and Tibetan hand-knotted rugs."
              }
            ],
            seoTitle: "Manali Mall Road (2,000m) — Shopping, Van Vihar & Town Center Guide",
            seoDescription: "Visitor guide to Manali Mall Road (2,000m). Pedestrian shopping boulevard, certified Kullu shawl emporiums, Tibetan markets, Van Vihar riverside park, and dining."
          },
          {
            id: "kullu-town",
            name: "Kullu Town",
            type: "scenic",
            emoji: "🧶",
            coords: [31.9579, 77.1095],
            elevation: "1,220 m",
            bestSeason: "Year-round (Kullu Dussehra: October)",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Situated on the broad banks of the Beas River, Kullu is the historic administrative capital of the Kullu Valley—historically known as Kulanthpitha ('the end of the habitable world') and Dev Bhumi ('the Valley of the Gods'). Globally celebrated for its centuries-old handloom weaving traditions, Kullu is home to major artisan clusters and cooperative factories (including the historic Bhuttico cooperative founded in 1944) producing world-famous Kullu shawls with vibrant geometric Himalayan borders. It is also home to the 17th-century Raghunath Temple at Sultanpur and Dhalpur Maidan, the sprawling open amphitheater where the legendary International Kullu Dussehra festival convenes over 300 local village deities (devi-devtas) for a week-long celebration.",
            experience: "Watching master weavers shuttle fine Merino and Angora yarns across wooden pit-looms, creating the intricate multicolor diamond borders that represent Himachal's folk identity.",
            tips: [
              "Visit the historic Bhuttico weaving society in Shamshi to tour operational handloom workshops and buy directly from weavers at fair cooperative prices.",
              "If visiting in October, experience the unmatched cultural grandeur of Kullu Dussehra when hundreds of wooden palanquins carrying village gods arrive in grand procession.",
              "Kullu is the primary staging base for river rafting expeditions on the Grade II-III rapids of the Beas River between Pirdi and Jhiri."
            ],
            faqs: [
              {
                question: "Why is Kullu famous for shawls?",
                answer: "Kullu shawls are world-renowned for their unique geometric patterns woven in vibrant colors across fine local sheep, Merino, and Pashmina wool, protected by a Geographical Indication (GI) certification."
              },
              {
                question: "What makes Kullu Dussehra unique?",
                answer: "Unlike elsewhere in India, Kullu Dussehra begins on Vijayadashami day and continues for seven days, without burning effigies of Ravana. Instead, it is a divine congregation where over 300 village deities pay homage to Lord Raghunath."
              }
            ],
            seoTitle: "Kullu Town (1,220m) — Shawl Factories, Raghunath Temple & Heritage Guide",
            seoDescription: "Guide to Kullu Town, Himachal Pradesh. Authentic handloom shawl weaving factories (Bhuttico), historic Raghunath Temple, international Dussehra festival, and river rafting."
          },
          {
            id: "vashisht",
            name: "Vashisht Village & Hot Springs",
            type: "spiritual",
            emoji: "♨️",
            coords: [32.2618, 77.1873],
            elevation: "2,150 m",
            bestSeason: "Year-round",
            difficulty: "Easy",
            duration: "Half to Full Day",
            overview: "Perched on a steep pine-clad ridge 3 km northeast of Manali across the Beas River, Vashisht is an ancient mountain village dedicated to Maharishi Vashistha, one of the seven Saptarishis and royal guru of Lord Rama. The village features traditional wood-and-stone Himachali houses and a 4,000-year-old stone temple enclosing natural geothermal sulfur springs, channeled into public and private mineral bathing kunds prized for centuries for their therapeutic and skin-healing properties. Vashisht also serves as the traditional pedestrian trailhead for the breathtaking hike to the 160-foot cascading Jogini Waterfall.",
            experience: "Stepping into the steaming thermal mineral waters after a cold mountain trek, feeling the deep warmth soothe tired muscles while cedar-scented mountain breezes drift in through stone arches.",
            tips: [
              "The natural sulfur baths have separate indoor sections for men and women, maintained by the temple trust.",
              "Take the marked trail starting behind the Vashisht temple through apple orchards and pine woods to reach Jogini Waterfall (3.5 km round trip).",
              "Early morning baths are cleaner and far less crowded than midday."
            ],
            faqs: [
              {
                question: "Are the hot springs in Vashisht free to enter?",
                answer: "Yes, the public temple bathing kunds are free to use. There are also small private Turkish-style baths nearby available for a nominal fee."
              },
              {
                question: "How difficult is the Jogini Waterfall hike from Vashisht?",
                answer: "It is an easy to moderate 45-minute scenic hike (about 1.8 km each way) suitable for beginners and families, winding through picturesque apple groves and streams."
              }
            ],
            seoTitle: "Vashisht Hot Springs & Temple (2,150m) Manali — Thermal Baths & Jogini Trail",
            seoDescription: "Visitor guide to Vashisht Village (2,150m) in Manali. Ancient Vashistha temple, natural sulfur hot water baths, therapeutic kunds, and Jogini Waterfall day hike."
          },
          {
            id: "burwa",
            name: "Burwa Village",
            type: "scenic",
            emoji: "🍎",
            coords: [32.2850, 77.1680],
            elevation: "2,200 m",
            bestSeason: "April to November, Winter snow",
            difficulty: "Easy",
            duration: "Half Day",
            overview: "Situated 6 km north of Manali on the right bank of the Beas River, Burwa is an authentic agricultural hamlet of multi-tiered Kath-Kuni houses, stone courtyards, and deep heritage apple orchards. Far quieter than downtown Manali, Burwa offers panoramic vistas of the snow-clad Pir Panjal ridges and the Solang Valley entrance. The village is well-known among climbers for its natural granite boulder crags, proximity to Nehru Kund (a pristine natural freshwater spring where Prime Minister Nehru would drink on his mountain visits), and pastoral mountain walks through terraced fields.",
            experience: "Walking along ancient stone paths bordered by heavy apple boughs laden with crimson fruit, watching village elders smoke traditional water-pipes on wooden veranda balustrades.",
            tips: [
              "Stop at Nehru Kund on the main highway just below Burwa to taste the freezing, sweet mountain spring water emerging from subterranean aquifers.",
              "Burwa is an ideal quiet alternative to stay away from the noise of central Manali while remaining within 10 minutes of Solang Valley."
            ],
            faqs: [
              {
                question: "What is Nehru Kund near Burwa?",
                answer: "Nehru Kund is a natural spring named after Jawaharlal Nehru, who regularly drank water from this clear mountain source during his stays in Manali. The spring is believed to originate from Bhrigu Lake."
              }
            ],
            seoTitle: "Burwa Village (2,200m) Manali — Apple Orchards, Nehru Kund & Rural Trails",
            seoDescription: "Discover Burwa village near Manali. Traditional Kath-Kuni architecture, historic apple orchards, granite climbing crags, Nehru Kund spring, and scenic rural walks."
          },
          {
            id: "kothi",
            name: "Kothi Village & Gorge",
            type: "scenic",
            emoji: "🏞️",
            coords: [32.3160, 77.1970],
            elevation: "2,500 m",
            bestSeason: "May to October, Winter snow",
            difficulty: "Easy",
            duration: "Half to Full Day",
            overview: "Nestled 12 km north of Manali at the eastern base of the Rohtang Pass, Kothi is a dramatic high-valley village famous for its deep, narrow gorge where the Beas River plunges through a chasm of vertical granite cliffs over 100 feet deep. In historical times before motorable roads, Kothi was the mandatory caravan rest stop and basecamp for travelers and pony drivers preparing to make the treacherous ascent across the 3,978m Rohtang Pass into Lahaul. The village offers sublime views of hanging glaciers, the Solang Range, and the roaring river gorge.",
            experience: "Standing at the edge of the stone bridge gazing down into the foaming turquoise torrent of the Beas cutting through black granite canyon walls, framed by towering spruce trees.",
            tips: [
              "The historic PWD resthouse at Kothi, built during the British era, offers one of the most magnificent veranda views in the entire upper valley.",
              "In winter, Kothi often marks the terminal point of public road clearance when Rohtang Pass is closed under heavy snow."
            ],
            faqs: [
              {
                question: "Why is the Kothi gorge famous?",
                answer: "The gorge is celebrated for its sheer vertical granite walls where the Beas River is compressed into a narrow chasm barely a few meters wide, plunging through a thunderous canyon."
              }
            ],
            seoTitle: "Kothi Village & Beas Gorge (2,500m) Manali — Canyon Views & Rohtang Base",
            seoDescription: "Explore Kothi village (2,500m) near Manali. Dramatic Beas River granite gorge, historic caravan trailheads, British-era rest house, and panoramic glacier vistas."
          },
          {
            id: "gulaba",
            name: "Gulaba Alpine Meadow",
            type: "scenic",
            emoji: "🌲",
            coords: [32.3320, 77.2080],
            elevation: "3,165 m",
            bestSeason: "May to November (Snow activities: Nov to April)",
            difficulty: "Easy",
            duration: "Half to Full Day",
            overview: "Situated 20 km north of Manali on the winding highway to Rohtang Pass, Gulaba is a picturesque sub-alpine meadow nestled amid stands of birch, fir, and deodar trees at 3,165 meters. Named in honor of Raja Gulab Singh of Jammu & Kashmir who established his high camp here during an expedition, Gulaba is renowned as the official trailhead for the renowned Bhrigu Lake alpine trek (4,300m). During late autumn, winter, and spring when Rohtang is snowbound, Gulaba serves as the primary designated snow viewpoint where visitors experience deep snowfields, sledding, and paragliding with unobstructed views of the Solang Valley and Hanuman Tibba massif.",
            experience: "Inhaling the crisp high-altitude air on the grassy alpine slopes while herds of sheep graze peacefully under the shadows of towering 5,000-meter peaks.",
            tips: [
              "Visiting Gulaba requires an online Green Tax / NGT permit if driving your own vehicle beyond the Gulaba check-post.",
              "The trek to Bhrigu Lake begins right from the highway at Gulaba, climbing steeply through virgin oak and silver fir forests to Rola Kholi camp (3,800m)."
            ],
            faqs: [
              {
                question: "Is a permit required to visit Gulaba?",
                answer: "A vehicle permit is required beyond the Gulaba barrier on the Rohtang road. However, local taxis and pre-registered vehicles can enter easily with standard municipal tourism passes."
              }
            ],
            seoTitle: "Gulaba Alpine Meadow (3,165m) Manali — Snow Point & Bhrigu Lake Trailhead",
            seoDescription: "Complete guide to Gulaba (3,165m) on the Rohtang Pass highway. Official trailhead for Bhrigu Lake trek, winter snow activities, NGT permit rules, and alpine panoramas."
          },
          {
            id: "marhi",
            name: "Marhi",
            type: "scenic",
            emoji: "⛰️",
            coords: [32.3550, 77.2250],
            elevation: "3,320 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "Half Day",
            overview: "Perched high above the treeline at 3,320 meters midway between Gulaba and the Rohtang summit (35 km from Manali), Marhi is an expansive alpine plateau framed by soaring sheer cliffs and cascading seasonal waterfalls. Historically a vital overnight acclimatization station and horse-caravan halt on the trans-Himalayan trade trail to Leh, Marhi today is famous for its cluster of roadside mountain dhabas serving piping hot Maggi, rajma-chawal, and ginger-lemon-honey tea. It is also an important winter snow-sports hub when the upper passes remain inaccessible.",
            experience: "Stepping out into cool alpine winds at 3,320 meters, watching mountain clouds roll over the rocky meadows while paragliders soar high above the valley floor.",
            tips: [
              "Marhi is an ideal place to spend 30 to 45 minutes acclimatizing to the thinner air before ascending further up to the 3,978m Rohtang Pass.",
              "Carry warm windproof jackets even in mid-summer; windchill at 3,300m can be significant."
            ],
            faqs: [
              {
                question: "What is Marhi famous for?",
                answer: "Marhi is famous as a scenic high-altitude plateau with multiple waterfalls, roadside dhabas, snow sports, and paragliding on the Manali-Leh Highway below Rohtang Pass."
              }
            ],
            seoTitle: "Marhi Plateau (3,320m) — High-Altitude Halt & Rohtang Pass Route Guide",
            seoDescription: "Visitor guide to Marhi (3,320m) on the Manali-Rohtang highway. High-altitude meadows, waterfalls, roadside dining, acclimatization tips, and paragliding."
          },
          {
            id: "dhundi",
            name: "Dhundi",
            type: "scenic",
            emoji: "🥾",
            coords: [32.3610, 77.1320],
            elevation: "2,840 m",
            bestSeason: "May to October",
            difficulty: "Easy to Moderate",
            duration: "1 Day",
            overview: "Situated 8 km northwest of Solang along the roaring headwaters of the Beas River, Dhundi is a pristine alpine valley and roadhead surrounded by dense silver birch, spruce, and rhododendron forests. It is the historic trailhead for the legendary Beas Kund glacier trek (3,700m) and the primary base for technical mountaineering expeditions to Friendship Peak (5,289m), Hanuman Tibba (5,982m), and the Seven Sisters range. With the completion of the Atal Tunnel, Dhundi also marks the approach valley to the South Portal of the 9.02 km tunnel.",
            experience: "Crossing the mountain wooden bridge at Dhundi where glacial snowmelt rushes over granite boulders, with the snow-covered pyramids of Friendship Peak and Ladakhi Peak towering overhead.",
            tips: [
              "Vehicles can drive from Solang to Dhundi along the paved road, where the foot-trail to Bakarthach and Beas Kund officially starts.",
              "Pack lunch and carry water bottles, as there are no permanent commercial shops or restaurants at Dhundi."
            ],
            faqs: [
              {
                question: "What treks start from Dhundi?",
                answer: "Dhundi is the official trailhead for the Beas Kund trek (3,700m), Lady Leg camp, and basecamps for climbing Friendship Peak (5,289m) and Shitidhar Peak."
              }
            ],
            seoTitle: "Dhundi (2,840m) Manali — Beas Kund Trailhead & Alpine Base Guide",
            seoDescription: "Explore Dhundi (2,840m) near Solang Valley. Official starting point for Beas Kund glacier trek, climbing base for Friendship Peak, South Portal approach, and trail map."
          },
          {
            id: "bijli-mahadev",
            name: "Bijli Mahadev Temple & Trail",
            type: "spiritual",
            emoji: "⚡",
            coords: [31.9542, 77.1897],
            elevation: "2,460 m",
            bestSeason: "March to December",
            difficulty: "Moderate",
            duration: "1 Day",
            distance: "3 km (one way hike)",
            overview: "Perched dramatically on the wind-scoured summit plateau of the Mathan ridge at 2,460 meters, Bijli Mahadev is one of the most sacred and mystifying temples in the Western Himalayas. The temple is famous for its 60-foot tall wooden flagstaff (dhwaja stambha) that miraculously attracts high-voltage divine lightning from thunderclouds during storms. According to ancient lore, the lightning bolt strikes the Shiva lingam inside the sanctum without causing fire, shattering the stone into fragments. The head priest then meticulously reassembles the lingam using clarified butter (sattu and makhan) until it solidifies once more into a single stone. The summit offers an unparalleled 360-degree vantage point overlooking the confluence of the Beas and Parvati Rivers, Kullu town, Bhuntar airport, and the snow-capped Pir Panjal and Great Himalayan National Park peaks.",
            experience: "Reaching the windswept meadow after climbing through fragrant deodar forests, standing beside the 60-foot lightning staff while looking down thousands of feet into both the Kullu and Parvati valleys simultaneously.",
            tips: [
              "Drive from Kullu or Bhuntar to Chansari village (22 km), where the stone-paved 3 km uphill forest trail begins.",
              "The hike ascends about 500 vertical meters through steep pine and oak woods; allow 2 to 2.5 hours for the ascent.",
              "Carry water and light snacks, though small seasonal tea stalls operate near the summit meadow."
            ],
            faqs: [
              {
                question: "What is the mystery of lightning at Bijli Mahadev?",
                answer: "Local folklore and records hold that the 60-foot tall staff draws atmospheric lightning during storms to protect the surrounding valley villages from catastrophe. The shattered lingam is ritually restored with clarified butter and stays intact until the next divine strike."
              },
              {
                question: "Can beginners and families do the Bijli Mahadev trek?",
                answer: "Yes, it is a well-paved stone staircase trail of 3 km from Chansari with resting benches, easily manageable in 2–3 hours at a relaxed pace."
              }
            ],
            seoTitle: "Bijli Mahadev Temple & Trek (2,460m) Kullu — Lightning Miracle & Guide",
            seoDescription: "Complete guide to Bijli Mahadev Temple (2,460m) in Kullu. The lightning miracle Shiva lingam, 3 km pine forest hike from Chansari, 360-degree valley vistas, and history."
          },
          {
            id: "atal-tunnel",
            name: "Atal Tunnel Rohtang",
            type: "road",
            emoji: "🚇",
            coords: [32.4080, 77.1650],
            elevation: "3,060 m to 3,071 m",
            bestSeason: "Year-round",
            difficulty: "Easy",
            duration: "Day Trip",
            distance: "9.02 km tunnel length",
            overview: "Built beneath the formidable 3,978m Rohtang Pass under the Pir Panjal Range, the 9.02 km long Atal Tunnel is the world's longest single-tube highway tunnel above an elevation of 10,000 feet (3,048 m). Completed by the Border Roads Organisation (BRO) in October 2020 after two decades of complex sub-zero engineering through difficult shear zones, the horseshoe-shaped tunnel bypasses 46 km of treacherous hairpin roads and provides all-weather connectivity between Manali and the high-altitude Lahaul Valley. Entering the South Portal (3,060m) near Dhundi in the lush pine-clad Kullu Valley and emerging 10 minutes later at the North Portal (3,071m) into the dramatic, barren rocky desert canyon of Sissu is one of the most astonishing geographic transitions in the Himalayas.",
            experience: "Driving through 9 kilometers of brightly lit, modern subterranean passage and suddenly breaking out into the brilliant, blinding blue skies and vertical glaciated rock faces of Lahaul.",
            tips: [
              "The speed limit inside the tunnel is strictly enforced at 40 km/h minimum and 60 km/h maximum; overtaking and stopping inside are prohibited.",
              "The tunnel is equipped with emergency exit telephone booths every 150m, fire hydrants every 60m, and air quality monitoring sensors throughout.",
              "A popular day circuit from Manali is Solang → Atal Tunnel → Sissu Waterfall → Koksar → return to Manali."
            ],
            faqs: [
              {
                question: "How long does it take to pass through Atal Tunnel?",
                answer: "At the regulated speed of 60 km/h, driving through the 9.02 km tunnel takes approximately 10 to 12 minutes, replacing what used to be a 4- to 5-hour journey over Rohtang Pass."
              },
              {
                question: "Is Atal Tunnel open during winter?",
                answer: "Yes, the tunnel operates year-round, keeping Lahaul connected even when Rohtang Pass is closed under 20 feet of snow."
              }
            ],
            seoTitle: "Atal Tunnel Rohtang (9.02km) — World's Longest Highway Tunnel Guide",
            seoDescription: "Essential guide to Atal Tunnel (Rohtang). 9.02 km engineering marvel connecting Manali and Lahaul, speed rules, South & North portals, and day trip itineraries."
          },
          {
            id: "sissu",
            name: "Sissu (North Portal)",
            type: "scenic",
            emoji: "🌊",
            coords: [32.4700, 77.1200],
            elevation: "3,120 m",
            bestSeason: "Year-round via Atal Tunnel (Best: May to Oct, Snow in Jan–March)",
            difficulty: "Easy",
            duration: "Day Trip from Manali",
            overview: "Situated in the high Chandra River valley just 5 km past the North Portal of Atal Tunnel, Sissu (known historically as Khwaling) is a breathtaking high-altitude oasis that has become the premier day excursion from Manali. Surrounded by weeping willows, golden poplar groves, and terraced barley fields, Sissu is globally renowned for the Palden Lhamo Dhar waterfall—a thunderous 50-meter glacial torrent dropping down a sheer dark cliff face opposite the village. Sissu Lake offers peaceful lakeside walks, ziplining, camping, and winter snow-sports.",
            experience: "Crossing the suspension bridge over the icy turquoise Chandra River and trekking up toward the misty base of the colossal waterfall with glaciated peaks towering overhead.",
            tips: [
              "Located only a 45-minute drive from Manali via the Atal Tunnel, making it an easy half-day or full-day outing.",
              "A scenic foot-trail from the bridge leads to the base of Sissu Waterfall in about 20 minutes.",
              "In winter (January–March), Sissu transforms into a winter wonderland with deep snow cover and frozen icefalls."
            ],
            faqs: [
              {
                question: "How far is Sissu from Manali?",
                answer: "Sissu is approximately 40 km from Manali town via the Atal Tunnel, taking about 45 to 60 minutes by car or taxi."
              },
              {
                question: "Can you visit Sissu in winter?",
                answer: "Yes, the Atal Tunnel keeps the road to Sissu open through most of the winter, allowing visitors to enjoy pristine snow without climbing Rohtang Pass."
              }
            ],
            seoTitle: "Sissu Waterfall & Lake (3,120m) — Day Trip from Manali via Atal Tunnel",
            seoDescription: "Plan your visit to Sissu (3,120m) from Manali via Atal Tunnel. 50m Palden Lhamo Waterfall, Sissu Lake, ziplining, winter snow points, and Chandra river views."
          },
          {
            id: "koksar",
            name: "Koksar Snow Point",
            type: "scenic",
            emoji: "❄️",
            coords: [32.4050, 77.2100],
            elevation: "3,140 m",
            bestSeason: "Year-round (Peak Snow: December to April; Summer: May to Oct)",
            difficulty: "Easy",
            duration: "Day Excursion",
            overview: "Situated at 3,140 meters in a dramatic bend of the Chandra River beneath the northern slopes of Rohtang Pass, Koksar is the historic first village and customs outpost of the Lahaul Valley. Before the Atal Tunnel was built, Koksar was the legendary checkpoint where travelers emerged after surviving the perilous Rohtang crossing. Today, located just 18 km east of the tunnel's North Portal, Koksar has become one of Himachal's most thrilling snow adventure hubs, famous for holding deep snow banks well into late spring, snow-tubing, ATV snow bikes, frozen river vistas, and roadside dhabas serving authentic Himalayan mutton thukpa and hot butter tea.",
            experience: "Tubing down massive, natural powdery snow banks beside the semi-frozen Chandra River while looking up at the avalanche chutes of the Pir Panjal northern walls.",
            tips: [
              "Koksar holds snow longer than almost any other easily accessible road point in the region, often offering excellent snow conditions even in April and May.",
              "Try the local Lahauli dhabas near the police check-post for authentic steaming thukpa, momos, and traditional herbal tea.",
              "During peak winter, carry heavy waterproof gloves and rent gumboots from the local shops if walking through knee-deep snow."
            ],
            faqs: [
              {
                question: "How far is Koksar from Manali via Atal Tunnel?",
                answer: "Koksar is approximately 45 km from Manali (about 1 to 1.5 hours drive) via the Atal Tunnel and the North Portal road along the Chandra River."
              },
              {
                question: "When is the best time to see snow in Koksar?",
                answer: "December through April offers heavy snow cover for sledding and snow-tubing, while May to June provides snow patches alongside blooming alpine wildflowers."
              }
            ],
            seoTitle: "Koksar Snow Point (3,140m) Lahaul — Day Trip from Manali & Snow Sports",
            seoDescription: "Visitor guide to Koksar (3,140m), the historic first village of Lahaul. Winter snow tubing, Chandra river valley, Atal Tunnel access, and road to Spiti via Gramphu."
          }
        ]
      },
      {
        id: "mandi",
        name: "Mandi",
        tagline: "The Varanasi of the Hills — historic stone pagoda temples, mystical floating lakes, and deep cedar-clad valleys",
        places: [
          {
            id: "prashar-lake",
            name: "Prashar Lake & Pagoda Temple",
            type: "lake",
            emoji: "🌊",
            coords: [31.7547, 77.1017],
            elevation: "2,730 m",
            bestSeason: "Year-round (Snow: Dec–Mar; Green: Apr–Nov)",
            difficulty: "Easy to Moderate",
            duration: "1–2 Days",
            distance: "16 km (if trekking from Baggi)",
            overview: "Surrounded by undulating alpine meadows and dense cedar woods, Prashar Lake is an oval high-altitude tectonic lake holding a mysterious floating circular island of reed that moves unpredictably across the seasons. On its grassy bank stands a magnificent 13th-century three-tiered pagoda temple built by Raja Ban Sen, constructed entirely of deodar wood without iron nails and dedicated to the revered sage Prashar. The surrounding ridge offers an unrestricted 360-degree panorama of the Dhauladhar, Pir Panjal, and Kinnaur mountain ranges.",
            experience: "Watching the floating island gently drift across deep blue water while evening temple bells chime against the backdrop of snow-covered Himalayan giants.",
            tips: [
              "Trekkers can hike 8 km uphill from Baggi village through rhododendron forests or drive directly to within 500m of the lake.",
              "Winter visits feature dramatic frozen snowscapes and pristine camping opportunities on the ridge."
            ],
            faqs: [
              {
                question: "Why does the island in Prashar Lake float?",
                answer: "The circular island is composed of dense floating turf, roots, and organic vegetation that stays buoyant on the deep tectonic spring waters, moving with wind and seasonal currents."
              },
              {
                question: "How deep is Prashar Lake?",
                answer: "The depth of Prashar Lake has never been accurately measured; according to local legends and diver attempts, the lake is fed by subterranean mountain aquifers of unknown depth."
              }
            ],
            seoTitle: "Prashar Lake & Pagoda Temple (2,730m) Mandi — Trek & Visitor Guide",
            seoDescription: "Discover Prashar Lake (2,730m) in Mandi. Mystical floating island, 13th-century 3-tiered pagoda temple, Baggi forest trek, camping guidelines, and 3D map."
          },
          {
            id: "rewalsar-lake",
            name: "Rewalsar Lake (Tso Pema)",
            type: "spiritual",
            emoji: "🪷",
            coords: [31.6328, 76.8333],
            elevation: "1,360 m",
            bestSeason: "September to April",
            difficulty: "Easy",
            duration: "1 Day",
            overview: "Nestled in a natural mountain basin, Rewalsar Lake (known to Tibetans as Tso Pema or 'Lotus Lake') is one of the most sacred pilgrimage shrines in northern India, revered simultaneously by Buddhists, Hindus, and Sikhs. It is historically celebrated as the place from which Guru Padmasambhava (Guru Rinpoche) flew to Tibet to establish Vajrayana Buddhism. The lake is flanked by a colossal 138-foot bronze statue of Guru Rinpoche, multiple Tibetan monasteries, a Hindu Shiva temple, and an ancient Sikh Gurdwara.",
            experience: "Circumambulating the peaceful sacred waters among Tibetan pilgrims spinning prayer wheels while huge sacred carp feed near the wooden ghats.",
            tips: [
              "Hike up to the high mountain caves above the town where Guru Padmasambhava and Mandarava meditated.",
              "The town hosts vibrant Cham masked dances during the annual Tsechu festival in February/March."
            ],
            faqs: [
              {
                question: "What is the spiritual significance of Rewalsar Lake?",
                answer: "It is sacred to Buddhists as the site of Guru Padmasambhava's miracle and departure to Tibet, to Hindus for Sage Lomas's penance to Lord Shiva, and to Sikhs for Guru Gobind Singh's visit in 1701."
              }
            ],
            seoTitle: "Rewalsar Lake (Tso Pema) — Sacred Buddhist, Hindu & Sikh Sanctuary",
            seoDescription: "Complete pilgrimage guide to Rewalsar Lake (1,360m) in Mandi. Guru Padmasambhava bronze statue, holy caves, monasteries, and multicultural history."
          },
          {
            id: "barot-valley",
            name: "Barot Valley & Uhl River",
            type: "adventure",
            emoji: "🎣",
            coords: [32.0461, 76.8522],
            elevation: "1,830 m",
            bestSeason: "March to June, September to November",
            difficulty: "Easy",
            duration: "2 Days",
            overview: "A hidden gem tucked within the Chauhar Valley on the banks of the roaring Uhl River, Barot was developed in the 1920s as part of the Shanan Hydroelectric Project. Surrounded by dense deodar and oak forests, Barot is renowned for its trout fishing hatchery, the historic British funicular trolley system, and serene riverside campsites. It serves as the gateway to the Nargu Wildlife Sanctuary and scenic trekking trails leading into the Chhota Bhangal valley.",
            experience: "Sitting by the rushing emerald waters of the Uhl River, catching glimpses of monal pheasants amidst the deodar canopies.",
            tips: [
              "Obtain a day permit from the local fisheries department to enjoy angling in the designated trout-breeding river sections.",
              "The trek from Barot across the ridge to Billing (takeoff point for paragliding) is a rewarding 14 km forest day hike."
            ],
            faqs: [
              {
                question: "What is the British trolley in Barot?",
                answer: "The Shanan funicular trolley was built in 1926 by British engineer Col. B.C. Batty to haul heavy machinery across the 2,500m mountain ridge between Joginder Nagar and Barot."
              }
            ],
            seoTitle: "Barot Valley (1,830m) — Uhl River Trout Fishing & Adventure Guide",
            seoDescription: "Discover Barot Valley in Mandi. Pristine Uhl River trout fishing, British funicular trolley history, Nargu sanctuary trails, camping, and road access."
          },
          {
            id: "mandi-chhoti-kashi",
            name: "Mandi Heritage & Panchvaktra Temple",
            type: "spiritual",
            emoji: "🛕",
            coords: [31.7087, 76.9320],
            elevation: "760 m",
            bestSeason: "October to April",
            difficulty: "Easy",
            duration: "1 Day",
            overview: "Known historically as 'Chhoti Kashi' (Varanasi of the Hills), Mandi is a historic cultural city perched on the banks of the holy Beas River, boasting more than 81 ancient stone temples dedicated to Lord Shiva. The most architecturally renowned is the 16th-century Panchvaktra Temple, situated dramatically at the confluence of the Beas and Suketi rivers, featuring a five-faced stone sculpture of Lord Shiva displaying different divine cosmic aspects.",
            experience: "Admiring the ancient stone temple shikhara standing defiant amidst the roaring river waters, echoing with timeless devotional traditions.",
            tips: [
              "The Mandi International Shivratri Fair held in February/March brings over 200 local deities (Devtas) from surrounding mountain villages in grand procession.",
              "Visit the historic Bhootnath Temple in the town center, dating back to 1527 CE."
            ],
            faqs: [
              {
                question: "Why is Mandi called Chhoti Kashi?",
                answer: "Because it features 81 historic stone-carved temples along the sacred Beas River, echoing the holy ghats and Shaivite pilgrimage tradition of Varanasi (Kashi)."
              }
            ],
            seoTitle: "Mandi 'Chhoti Kashi' Heritage Guide — Panchvaktra Temple & Beas Ghats",
            seoDescription: "Explore Mandi (Chhoti Kashi) in Himachal Pradesh. 81 ancient stone Shiva temples, 16th-century Panchvaktra confluence shrine, and International Shivratri guide."
          },
          {
            id: "kamrunag-lake",
            name: "Kamrunag Lake Trek",
            type: "trek",
            emoji: "🪙",
            coords: [31.4889, 77.0611],
            elevation: "3,334 m",
            bestSeason: "April to November",
            difficulty: "Moderate",
            duration: "2 Days",
            distance: "14 km",
            overview: "Perched high on the Balh valley ridge, Kamrunag Lake (3,334m) is a deeply revered mountain lake dedicated to King Yaksha (Lord Kamrunag), the God of Rains. According to ancient Himalayan tradition, pilgrims who make the steep 7 km forest trek from Rohanda deposit gold coins, silver ornaments, and currency notes directly into the lake bed as offerings, which remain visible through the clear mountain water and are protected by sacred taboos.",
            experience: "Gazing into the shimmering waters of the mountain tarn where thousands of gold and silver coins gleam undisturbed under the alpine sky.",
            tips: [
              "The trail climbs steeply through thick deodar and oak forests from Rohanda; walking sticks are highly recommended for the ascent.",
              "The annual Kamrunag Fair in mid-June attracts thousands of hill devotees from across Mandi and Kullu districts."
            ],
            faqs: [
              {
                question: "Can anyone take the gold from Kamrunag Lake?",
                answer: "No. Local religious belief dictates that any attempt to remove the holy offerings from the lake invites severe divine retribution, ensuring the treasures have remained untouched for centuries."
              }
            ],
            seoTitle: "Kamrunag Lake Trek (3,334m) — Sacred Lake of Gold & Rain God",
            seoDescription: "Guide to the mysterious Kamrunag Lake Trek (3,334m) in Mandi. Ancient gold and silver offering traditions, Rohanda forest trail, and local legends."
          }
        ]
      },
      {
        id: "lahaul-spiti",
        name: "Lahaul & Spiti",
        tagline: "High cold deserts, 1,000-year-old cliffside monasteries, turquoise moon lakes, and 5,000-meter pass crossings",
        places: [
          {
            id: "chandratal-lake",
            name: "Chandratal Lake (Moon Lake)",
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
            type: "scenic",
            emoji: "🌊",
            coords: [32.4700, 77.1200],
            elevation: "3,120 m",
            bestSeason: "Year-round via Atal Tunnel",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Located right across the north portal of Atal Tunnel, Sissu is famous for its thunderous glacial waterfall, poplars, and the turquoise waters of the Chandra River."
          },
          {
            id: "kaza-spiti",
            name: "Kaza & Spiti Valley Capital",
            type: "scenic",
            emoji: "🏜️",
            coords: [32.2276, 78.0716],
            elevation: "3,650 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "2–3 Days",
            overview: "Kaza is the administrative headquarters and vibrant cultural heartbeat of the Spiti Valley, perched along the braided gravel riverbeds of the Spiti River at 3,650 meters. Divided into Old Kaza and New Kaza, it functions as the central logistical base for high-altitude expeditions, inner-line permit processing, and excursions to ancient monasteries, high villages, and passes.",
            experience: "Sipping sea buckthorn tea in cozy mountain cafes while Tibetan prayer flags flutter against dramatic, barren mudstone cliffs.",
            tips: [
              "Spend at least 2 nights in Kaza to acclimatize before attempting excursions to high villages above 4,400m.",
              "The main market offers authentic Tibetan handicrafts, dried wild seabuckthorn berries, and hand-woven woolens."
            ],
            faqs: [
              {
                question: "What is the best way to acclimatize in Kaza?",
                answer: "Stay well-hydrated with 3–4 liters of water daily, avoid strenuous physical activity on Day 1, and adhere strictly to DHT's 3,000-Meter Altitude Safety rules."
              }
            ],
            seoTitle: "Kaza (3,650m) Spiti Valley — Travel Guide, Monasteries & Permits",
            seoDescription: "Essential guide to Kaza in Spiti Valley. Acclimatization tips, homestays, inner-line permits, fuel, best cafes, and day excursions to high villages."
          },
          {
            id: "dhankar-monastery-lake",
            name: "Dhankar Monastery & Lake",
            type: "spiritual",
            emoji: "🛕",
            coords: [32.0200, 78.2140],
            elevation: "3,894 m (Monastery) / 4,140 m (Lake)",
            bestSeason: "May to October",
            difficulty: "Moderate",
            duration: "1–2 Days",
            distance: "4 km hike to lake",
            overview: "Perched precipitously on the edge of a razor-sharp cliff 300 meters above the confluence of the Spiti and Pin rivers, Dhankar Gompa was the ancient 16th-century fortress-capital of the Spiti kingdom. From the ancient mud-and-timber monastery, a scenic 2 km uphill trail leads through wind-scoured scree to Dhankar Lake (4,140m), a high sapphire tarn framed by the jagged snow-peaks of the Manirang range.",
            experience: "Standing on the crumbling balcony of the ancient meditation cell looking down into the dizzying void of the river valley hundreds of feet below.",
            tips: [
              "The hike from the monastery to Dhankar Lake takes about 1 to 1.5 hours; start before 10 AM to avoid midday heat and wind.",
              "Walk gently within the ancient monastery chambers as the fragile mud-brick structure is undergoing preservation."
            ],
            faqs: [
              {
                question: "What does Dhankar mean?",
                answer: "In the local Tibetan dialect, 'Dhang' means cliff and 'Kar' means fortress, referring to its status as an impregnable cliffside citadel."
              }
            ],
            seoTitle: "Dhankar Monastery & Lake (3,894m) — Cliff Citadel of Spiti",
            seoDescription: "Explore Dhankar Monastery (16th-century cliff fort) and the hike to Dhankar Lake (4,140m) in Spiti Valley. Route details, history, and photography tips."
          },
          {
            id: "langza-hikkim-komic",
            name: "Langza, Hikkim & Komic High Circuit",
            type: "scenic",
            emoji: "📮",
            coords: [32.2610, 78.1090],
            elevation: "4,400–4,587 m",
            bestSeason: "May to October",
            difficulty: "Moderate",
            duration: "1 Day",
            overview: "A legendary high-altitude village triumvirate perched above the Spiti canyon: Langza (4,400m), guarded by a giant golden statue of Lord Buddha facing the glaciated peak of Chau Chau Kang Nilda (6,303m) and famous for million-year-old marine Tethys Sea fossils; Hikkim (4,440m), boasting the world's highest operational post office where travelers send postcards across the globe; and Komic (4,587m), recognized as one of the world's highest permanently inhabited villages with its 14th-century Tangyud Monastery.",
            experience: "Writing a handwritten postcard inside a cozy mud hut at 4,440 meters, stamping it with the world's highest postal seal.",
            tips: [
              "Do not purchase marine fossils from unauthorized vendors; preserve the natural heritage of the Tethys geological seabed.",
              "Take slow, deliberate steps; oxygen levels at 4,500m are roughly 60% of sea level."
            ],
            faqs: [
              {
                question: "Can you actually send letters from Hikkim?",
                answer: "Yes! The Hikkim post office has operated since 1983; postmen carry mail bags on foot down to Kaza daily to be forwarded worldwide."
              }
            ],
            seoTitle: "Langza, Hikkim & Komic Circuit — World's Highest Post Office & Fossils",
            seoDescription: "Guide to Spiti's highest villages: Langza (4,400m Buddha statue & fossils), Hikkim (4,440m post office), and Komic (4,587m Tangyud Monastery)."
          },
          {
            id: "chicham-bridge",
            name: "Chicham Bridge & Kibber Wildlife Sanctuary",
            type: "adventure",
            emoji: "🌉",
            coords: [32.3278, 78.0056],
            elevation: "4,150 m",
            bestSeason: "May to October (Winter for Snow Leopards)",
            difficulty: "Easy",
            duration: "1 Day",
            overview: "Suspended at a staggering altitude of 4,150 meters, Chicham Bridge is the highest suspension bridge in Asia, spanning a terrifying 150-meter-deep vertical rocky gorge to connect the remote village of Chicham with Kibber. Surrounding this engineering marvel is the Kibber Wildlife Sanctuary, world-famous among wildlife biologists and high-altitude trackers as one of the premier global habitats for the elusive Snow Leopard, Tibetan wolf, and Himalayan ibex.",
            experience: "Looking straight down between your boots through the bridge grating into the dizzying abyss of the Samba Lamba Nallah.",
            tips: [
              "Winter (January to March) is the peak season for guided snow leopard tracking expeditions based in Kibber.",
              "Combine with a visit to Key Monastery just 6 km down the road."
            ],
            faqs: [
              {
                question: "How high is Chicham Bridge?",
                answer: "The bridge sits at an altitude of 4,150 meters above sea level and spans a 150-meter (500 ft) deep vertical canyon."
              }
            ],
            seoTitle: "Chicham Bridge (4,150m) & Kibber Sanctuary — Highest Bridge in Asia",
            seoDescription: "Visit Chicham Bridge (4,150m), Asia's highest suspension bridge over a 150m gorge. Snow leopard expeditions in Kibber Wildlife Sanctuary, route and photos."
          },
          {
            id: "pin-valley-national-park",
            name: "Pin Valley National Park & Mudh",
            type: "scenic",
            emoji: "🐆",
            coords: [31.9500, 77.9000],
            elevation: "3,800–6,000 m",
            bestSeason: "June to October (Trekking); Dec–Mar (Snow Leopards)",
            difficulty: "Moderate to Difficult",
            duration: "2–3 Days",
            overview: "Spanning the cold desert mountains of the Pin River basin, Pin Valley National Park is Himachal's only cold desert national park, protecting rare alpine flora, medicinal plants, and apex predators including the snow leopard and Tibetan wolf. The valley is steeped in the ancient Buchen sect of Tibetan Buddhism, centered around the picturesque last roadhead village of Mudh (3,800m), where colorful multi-hued mountain strata resemble painted tapestries.",
            experience: "Wandering through the pastel pink, green, and ochre shale mountains of Mudh as glacial streams cut through raw Trans-Himalayan wilderness.",
            tips: [
              "Mudh serves as the terminus for the legendary Pin Parvati Pass trek and the start/finish for the Pin Bhaba Pass trek.",
              "Cell connectivity is virtually non-existent; prepare for complete off-grid mountain immersion."
            ],
            faqs: [
              {
                question: "What animals live in Pin Valley National Park?",
                answer: "The park is home to snow leopards, Siberian ibex, bharal (blue sheep), Tibetan wolves, red foxes, and Himalayan snowcocks."
              }
            ],
            seoTitle: "Pin Valley National Park & Mudh (3,800m) — Spiti Wildlife Guide",
            seoDescription: "Explore Pin Valley National Park and the colorful mountain village of Mudh. Snow leopard habitat, Buchen lamas, trekking trailheads, and permits."
          },
          {
            id: "kunzum-pass",
            name: "Kunzum Pass",
            type: "road",
            emoji: "🚩",
            coords: [32.4000, 77.6333],
            elevation: "4,551 m",
            bestSeason: "Late June to Mid-October",
            difficulty: "Moderate",
            duration: "Day Crossing",
            overview: "Kunzum Pass (4,551 m / 14,931 ft) is the majestic high mountain pass on the Eastern Pir Panjal and Great Himalayan Divide connecting the Lahaul Valley with the Spiti Valley. Adorned with 15 Tibetan stone chortens and fluttering lungta prayer flags, the pass houses the holy shrine of Goddess Kunzum (Kunzum Mata), where every passing vehicle completes a traditional circumambulation. The pass offers jaw-dropping vistas of the 6,000-meter Bara-Shigri glacier and Shigri peaks.",
            experience: "Stepping out of the vehicle into howling, sub-zero alpine winds, watching hundreds of vibrant prayer flags snap wildly against snow-capped giants.",
            tips: [
              "A scenic 9 km descending trail leads directly from Kunzum Pass to the turquoise shores of Chandratal Lake.",
              "Even in mid-summer, temperatures can dip below freezing; always carry windbreakers, gloves, and warm headwear."
            ],
            faqs: [
              {
                question: "Is Kunzum Pass higher than Rohtang Pass?",
                answer: "Yes, Kunzum Pass (4,551m) is significantly higher than Rohtang Pass (3,978m) by nearly 600 meters."
              }
            ],
            seoTitle: "Kunzum Pass (4,551m) Highway Guide — Lahaul to Spiti Gateway",
            seoDescription: "Crossing Kunzum Pass (4,551m / 14,931 ft). Road conditions from Gramphu and Kaza, Chandratal hike trailhead, Kunzum Mata shrine, and Bara Shigri glacier views."
          },
          {
            id: "suraj-tal-baralacha",
            name: "Suraj Tal & Baralacha La",
            type: "lake",
            emoji: "☀️",
            coords: [32.7569, 77.4128],
            elevation: "4,890 m (Pass) / 4,883 m (Lake)",
            bestSeason: "July to September",
            difficulty: "Challenging",
            duration: "Day Crossing",
            overview: "Suraj Tal ('Lake of the Sun God') is the third-highest lake in India and the 21st highest in the world, sitting like a giant sapphire tarn at 4,883 meters immediately beneath the summit of Baralacha La (4,890m / 16,043 ft). Feeding the glacial currents of the Bhaga River, this high mountain lake remains partially frozen even well into July, surrounded by glaciated moraines and towering barren massifs along the legendary Manali-Leh Highway.",
            experience: "Standing on the windswept shore of this high glacial tarn surrounded by colossal scree peaks, where silence is broken only by the crackle of shifting ice.",
            tips: [
              "Altitude is extreme (nearly 5,000m); do not linger for more than 30–45 minutes to prevent symptoms of Acute Mountain Sickness (AMS).",
              "Baralacha La is an eight-kilometer-long pass crossing where mountain roads from Zanskar, Ladakh, and Spiti meet."
            ],
            faqs: [
              {
                question: "What is the source of the Chandra and Bhaga rivers?",
                answer: "The Bhaga River originates from Suraj Tal, while the Chandra River originates near Chandratal; they merge at Tandi in Lahaul to form the mighty Chandrabhaga (Chenab) River."
              }
            ],
            seoTitle: "Suraj Tal Lake (4,883m) & Baralacha La — Third Highest Lake in India",
            seoDescription: "Explore Suraj Tal Lake (4,883m) and Baralacha La Pass (4,890m) on the Manali-Leh Highway. Source of Bhaga river, altitude precautions, and photography spots."
          },
          {
            id: "keylong-kardang",
            name: "Keylong & Kardang Monastery",
            type: "spiritual",
            emoji: "🏮",
            coords: [32.5714, 77.0325],
            elevation: "3,080 m",
            bestSeason: "May to October (Accessible year-round via Atal Tunnel)",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Keylong is the administrative capital of Lahaul and Spiti, situated on a terraced slope above the rushing Bhaga River amidst willow and poplar groves. Directly across the river gorge, perched dramatically against the rocky slopes of the sacred Rangcha peak, lies Kardang Monastery (900 CE)—the historical seat of the Drukpa Kagyu lineage in Lahaul, housing ancient Buddhist scriptures, exquisite thangkas, and an impressive collection of sacred musical instruments.",
            experience: "Listening to the deep resonant drone of Tibetan long horns (dungchen) drifting across the valley from Kardang as monks begin evening prayers.",
            tips: [
              "A scenic 5 km hike from Keylong crosses the river via a footbridge up to Kardang village and monastery.",
              "Keylong has reliable medical facilities, pharmacies, and district administration offices."
            ],
            faqs: [
              {
                question: "How has Atal Tunnel changed travel to Keylong?",
                answer: "Before the tunnel, Keylong was cut off for 6 months every winter by snow at Rohtang Pass. The Atal Tunnel now provides year-round road connectivity in under 2 hours from Manali."
              }
            ],
            seoTitle: "Keylong & Kardang Monastery (3,080m) — Lahaul Capital & Guide",
            seoDescription: "Discover Keylong in Lahaul. 900-year-old Kardang Monastery of the Drukpa Kagyu order, Bhaga valley trails, homestays, and Atal Tunnel road access."
          }
        ]
      },
      {
        id: "kinnaur",
        name: "Kinnaur",
        tagline: "Apple orchards, carved wooden pagoda temples, roaring Sutlej gorges, and the sacred Kinner Kailash massif",
        places: [
          {
            id: "kinner-kailash",
            name: "Kinner Kailash Parikrama",
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
            type: "scenic",
            emoji: "🍎",
            coords: [31.5300, 78.2500],
            elevation: "2,960 m",
            bestSeason: "April to November",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Kalpa sits high above the roaring Sutlej River amidst apple orchards, offering front-row views of the holy Kinner Kailash peak catching first morning light."
          },
          {
            id: "sangla-kamru-fort",
            name: "Sangla Valley & Kamru Fort",
            type: "scenic",
            emoji: "🏰",
            coords: [31.4239, 78.2611],
            elevation: "2,680 m",
            bestSeason: "April to October",
            difficulty: "Easy",
            duration: "2 Days",
            overview: "Flanked by snow-capped Himalayan peaks and carpeted with lush apple and walnut orchards, Sangla Valley (the Baspa River valley) is often described as the most enchanting alpine valley in Kinnaur. Overlooking the village stands Kamru Fort, an imposing five-story tower fortress of intricately locked deodar timbers and river stone dating back thousands of years, which served as the ancient coronation seat of the rulers of the Bushahr kingdom.",
            experience: "Climbing through a series of fortified wooden gates to the rooftop sanctum of Kamru Fort, beholding the entire emerald expanse of the Baspa Valley.",
            tips: [
              "Visitors must tie a traditional Kinnauri cap and cloth belt (provided at the gate) before entering the sacred Kamru Fort courtyard.",
              "Sangla is famous for wood carvings, kinnauri shawls, and crisp royal delicious apples."
            ],
            faqs: [
              {
                question: "What is unique about Kamru Fort's architecture?",
                answer: "It is constructed in classical Kath-Kuni style—interlocking wooden beams without mortar—making it extraordinarily resilient to Himalayan earthquakes for over a millennium."
              }
            ],
            seoTitle: "Sangla Valley & Kamru Fort (2,680m) — Baspa Valley Heritage Guide",
            seoDescription: "Explore Sangla Valley and the ancient 5-story Kamru Fort in Kinnaur. Baspa river apple orchards, Kath-Kuni timber architecture, and travel tips."
          },
          {
            id: "nako-lake-monastery",
            name: "Nako Lake & Ancient Gompa",
            type: "spiritual",
            emoji: "🪷",
            coords: [31.8794, 78.6272],
            elevation: "3,662 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Perched high above the Sutlej river gorge in Upper Kinnaur near the Indo-Tibetan border, Nako is an oasis-like high-altitude village centered around a serene, willow-fringed alpine lake at 3,662 meters. Adjacent to the lake lies the 11th-century Nako Monastery (attributed to the great translator Rinchen Zangpo), containing four ancient clay-walled prayer halls decorated with classical Western Tibetan frescoes and a revered rock impression said to be the footprint of Guru Padmasambhava.",
            experience: "Walking along stone-walled lanes between earthen houses where prayer flags flutter against stark, arid desert mountains reminiscent of western Tibet.",
            tips: [
              "Take a quiet walk around the lake at sunrise when the snowy Reo Purgyil massif (6,816m, highest peak in Himachal) is mirrored in the water.",
              "Nako is the critical acclimatization stopover before entering the Spiti Valley via Sumdo."
            ],
            faqs: [
              {
                question: "How old is Nako Monastery?",
                answer: "Nako Monastery dates back to the 11th century (1025 CE) and is associated with the great Buddhist scholar Lotsawa Rinchen Zangpo."
              }
            ],
            seoTitle: "Nako Lake & 11th-Century Monastery (3,662m) — Upper Kinnaur Oasis",
            seoDescription: "Complete guide to Nako Lake (3,662m) and the 11th-century Nako Gompa in Upper Kinnaur. Tibetan murals, Padmasambhava footprints, and Reo Purgyil views."
          },
          {
            id: "rupin-pass-kinnaur",
            name: "Rupin Pass Trek (Kinnaur Terminus)",
            type: "trek",
            emoji: "🌊",
            coords: [31.3650, 78.2150],
            elevation: "4,650 m",
            bestSeason: "May to June, September to October",
            difficulty: "Difficult",
            duration: "8 Days",
            distance: "52 km",
            overview: "One of India's most celebrated and diverse crossover treks, starting in the pine forests of Dhaula in Uttarakhand and concluding in the idyllic Baspa Valley of Sangla in Kinnaur. The route features dramatic scenery shifts: hanging villages, three-tier glacial waterfalls, immense snow bridges, and a thrilling scramble up a steep snow gully to the summit of Rupin Pass (4,650m / 15,250 ft), with sweeping views of the Kinner Kailash range.",
            experience: "Descending from the freezing heights of the high snow pass through wildflower-strewn slopes directly into the warm apple orchards of Sangla.",
            tips: [
              "The pass crossing day involves a strenuous 4:00 AM start and steep snow ascent; microspikes and trekking poles are mandatory.",
              "Crossing from Uttarakhand into Himachal Pradesh provides an extraordinary cultural study in differing architectural and pastoral traditions."
            ],
            faqs: [
              {
                question: "Can Rupin Pass be done from the Kinnaur side?",
                answer: "While possible, standard expedition itineraries start from Dhaula in Uttarakhand and finish in Sangla, Kinnaur, for safer, more gradual altitude acclimatization."
              }
            ],
            seoTitle: "Rupin Pass Trek (4,650m) Kinnaur — Crossover Route & Map",
            seoDescription: "Guide to the Rupin Pass crossover trek (4,650m) ending in Sangla, Kinnaur. Three-tier waterfalls, snow gullies, Kinner Kailash views, and logistics."
          },
          {
            id: "reckong-peo",
            name: "Reckong Peo",
            type: "scenic",
            emoji: "🏔️",
            coords: [31.5400, 78.2700],
            elevation: "2,290 m",
            bestSeason: "April to November",
            difficulty: "Easy",
            duration: "1 Day",
            overview: "Reckong Peo is the administrative and commercial capital of Kinnaur District, situated on a sunny mountain terrace high above the Sutlej River. Known as the gateway for inner-line permits required for international travelers continuing towards Spiti, Peo offers uninterrupted, awe-inspiring views of the sacred Kinner Kailash massif (6,050m) and its towering companion peaks.",
            experience: "Watching the massive granite pillar of Kinner Kailash turn from golden amber to deep purple as evening falls across the Sutlej valley.",
            tips: [
              "Foreign nationals must obtain their Inner Line Permit (ILP) at the District Magistrate's office in Reckong Peo to travel between Jangi and Sumdo.",
              "Take the local link road 7 km uphill to reach the tranquil apple village of Kalpa."
            ],
            faqs: [
              {
                question: "Do Indian citizens need permits for Kinnaur?",
                answer: "Indian citizens do not require permits for Kinnaur or the road to Spiti; only valid government photo ID is required at routine border checkpoints."
              }
            ],
            seoTitle: "Reckong Peo (2,290m) — Kinnaur Capital, Permits & Kinner Kailash Views",
            seoDescription: "Visit Reckong Peo, headquarters of Kinnaur District. Inner Line Permit guidelines, apple orchards, bazaar guide, and Kinner Kailash viewpoints."
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
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/f_auto,q_auto,w_1000/v1777220041/UttrakhandMain.jpg",
    subregions: [
                  {
                            "id": "garhwal",
                            "name": "Garhwal",
                            "tagline": "Sacred river origins, ancient Char Dham shrines, and high alpine valleys of Lord Shiva",
                            "division": "Garhwal",
                            "places": [
                                      {
                                                "id": "char-dham",
                                                "name": "Garhwal Char Dham — The Sacred Himalayan Circuit",
                                                "type": "spiritual",
                                                "emoji": "🛕",
                                                "coords": [
                                                          30.74,
                                                          79.49
                                                ],
                                                "elevation": "3,584 m (Kedarnath) / 3,291 m (Yamunotri)",
                                                "bestSeason": "May to June, September to October (Temples open May–Nov)",
                                                "difficulty": "Moderate to Challenging",
                                                "duration": "10–12 Days (Commercial) / 14–16 Days (DHT Insider)",
                                                "distance": "1,100 km circuit + 48 km trekking",
                                                "overview": "The most sacred and spiritually transformative pilgrimage circuit in the Himalayas, the Char Dham of Uttarakhand weaves through the rugged river gorges and glaciated heights of Garhwal to four revered shrines: Yamunotri (origin of River Yamuna, 3,291m), Gangotri (seat of Goddess Ganga, 3,100m), Kedarnath (highest of the 12 Jyotirlingas of Lord Shiva, 3,584m), and Badrinath (sacred abode of Lord Vishnu, 3,133m). Traditionally undertaken in a clockwise direction (Parikrama) from West to East across Garhwal's four high river valleys, this epic pilgrimage crosses four river valleys, ancient stone-and-wood Himalayan villages, thermal hot springs, high alpine bugyals, and dramatic mountain sanctuaries.",
                                                "routeDescription": "Traditional clockwise pilgrimage traversing West to East: Haridwar/Rishikesh to Yamunotri (Janki Chatti) along the Yamuna valley, crossing across Radi Top to Uttarkashi and Gangotri along the Bhagirathi canyon, crossing the high ridges past Tehri Lake and Dhari Devi to Guptkashi, staging at Sonprayag and trekking to Kedarnath (3,584m) along the Mandakini gorge, descending to Ukhimath and driving through Chopta to Joshimath, and traveling along the Alaknanda canyon to Badrinath (3,133m) and Mana Village before descending through the sacred confluences of the Panch Prayag.",
                                                "experience": "Prostrating before the ancient stone sanctum of Kedarnath under the icy glow of the moon as the eternal snows of Mount Meru rise into the starlit sky, hearing resonant morning bells echo across the Alaknanda at Badrinath, and touching the glacial waters of the newly born Saraswati river at Mana.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Haridwar/Rishikesh to Barkot via Mussoorie",
                                                                    "description": "Drive 220 km through Dehradun and the Mussoorie foothills past Kempty Falls and Yamuna Bridge to the apple valley base of Barkot (1,220m).",
                                                                    "elevationMeters": 1220,
                                                                    "distanceKm": 220
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Yamunotri Darshan (Surya Kund) & Kharsali Heritage",
                                                                    "description": "Drive to Janki Chatti. Trek 6 km up to Yamunotri Temple (3,291m). Cook rice prasadam in boiling Surya Kund and pray at Divya Shila. Descend to explore Kharsali's 3-storey ancient stone Shani Dev temple.",
                                                                    "elevationMeters": 3291,
                                                                    "distanceKm": 12
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Barkot across Radi Top to Uttarkashi",
                                                                    "description": "Scenic drive over Radi Top pass (panoramic Bandarpoonch vistas) to Uttarkashi (1,158m). Visit ancient Kashi Vishwanath Temple, touch the vibrating Shakti Trishul, and tour NIM.",
                                                                    "elevationMeters": 1158,
                                                                    "distanceKm": 100
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Uttarkashi to Harsil Valley & Mukhba Village",
                                                                    "description": "Drive along the Bhagirathi canyon to Harsil Valley (2,620m). Tour Wilson's apple orchards, Dharali wooden village, and cross to Mukhba—the sacred winter seat of Goddess Ganga.",
                                                                    "elevationMeters": 2620,
                                                                    "distanceKm": 75
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Gangotri Temple Darshan, Surya Kund Gorge & Pandava Gufa",
                                                                    "description": "Drive 25 km to Gangotri (3,100m). Attend Bhagirathi river rituals, see the submerged Shivalinga, explore Surya Kund waterfall, and hike to Pandava Gufa. Return to Harsil.",
                                                                    "elevationMeters": 3100,
                                                                    "distanceKm": 50
                                                          },
                                                          {
                                                                    "day": 6,
                                                                    "title": "Harsil across Tehri Lake to Srinagar Garhwal",
                                                                    "description": "Scenic cross-ridge mountain drive past Chamba, the turquoise reservoir of Tehri Lake, to the historic educational hub of Srinagar Garhwal (560m).",
                                                                    "elevationMeters": 560,
                                                                    "distanceKm": 210
                                                          },
                                                          {
                                                                    "day": 7,
                                                                    "title": "The Guardian Deity: Dhari Devi Mandir to Guptkashi",
                                                                    "description": "Crucial stop at Dhari Devi Temple over the Alaknanda (guardian protector of Char Dham). Continue past Rudraprayag confluence and up the Mandakini valley to Guptkashi (1,319m).",
                                                                    "elevationMeters": 1319,
                                                                    "distanceKm": 85
                                                          },
                                                          {
                                                                    "day": 8,
                                                                    "title": "Triyuginarayan (Akhand Dhuni) & Sonprayag Staging",
                                                                    "description": "Visit Triyuginarayan Temple (1,980m), site of Lord Shiva and Parvati's celestial wedding with the eternal Akhand Dhuni fire. Rest in Sitapur/Sonprayag for the early trek.",
                                                                    "elevationMeters": 1980,
                                                                    "distanceKm": 40
                                                          },
                                                          {
                                                                    "day": 9,
                                                                    "title": "Gaurikund to Kedarnath High Ascent (3,584m)",
                                                                    "description": "Early 5:00 AM start. Trek 16–18 km alongside the glacial Mandakini through Jungle Chatti, Bheembali, and Lincholi to the 8th-century stone temple of Kedarnath. Attend evening Sandhya Aarti.",
                                                                    "elevationMeters": 3584,
                                                                    "distanceKm": 18
                                                          },
                                                          {
                                                                    "day": 10,
                                                                    "title": "Kedarnath Morning Abhishek, Bhairavnath & Descent",
                                                                    "description": "Pre-dawn sanctum darshan. Climb 500m to Bhairavnath Temple on the ridge. Trek down to Gaurikund and rest in Guptkashi or Ukhimath (winter seat of Kedarnath).",
                                                                    "elevationMeters": 1319,
                                                                    "distanceKm": 18
                                                          },
                                                          {
                                                                    "day": 11,
                                                                    "title": "The Panch Kedar Secret: Madhyamaheshwar Link or Chopta-Tungnath",
                                                                    "description": "Option to diversion to Madhyamaheshwar (3,497m) or scenic drive through Chopta meadows with day-hike to Tungnath (highest Shiva temple, 3,680m) and Chandrashila summit (4,000m).",
                                                                    "elevationMeters": 2680,
                                                                    "distanceKm": 60
                                                          },
                                                          {
                                                                    "day": 12,
                                                                    "title": "Gateway to the Heights: Joshimath & Urgam Valley",
                                                                    "description": "Drive past Karnaprayag to Joshimath (1,890m). Visit Shankaracharya Math, Narsimha Temple (winter seat of Badrinath), and Kalpavriksha. Explore pristine Urgam Valley (Kalpeshwar Mahadev).",
                                                                    "elevationMeters": 1890,
                                                                    "distanceKm": 90
                                                          },
                                                          {
                                                                    "day": 13,
                                                                    "title": "Joshimath to Badrinath Dham (3,133m)",
                                                                    "description": "Drive through Vishnuprayag gorge to Badrinath. Bathe in thermal Tapt Kund (45°C) before darshan. Experience evening aarti under the golden alpenglow of Mount Nilkantha.",
                                                                    "elevationMeters": 3133,
                                                                    "distanceKm": 45
                                                          },
                                                          {
                                                                    "day": 14,
                                                                    "title": "Beyond Badrinath: Mana First Village, Saraswati River & Vasudhara",
                                                                    "description": "Explore Mana Village (3,200m). Marvel at Bhim Pul over the roaring Saraswati River, visit Vyas Gufa and Ganesh Gufa. Hike 5 km to the 122m cascading drop of Vasudhara Falls.",
                                                                    "elevationMeters": 3200,
                                                                    "distanceKm": 12
                                                          },
                                                          {
                                                                    "day": 15,
                                                                    "title": "Panch Prayag Confluence Descent to Rishikesh",
                                                                    "description": "Follow the holy confluences down the Alaknanda highway: Vishnuprayag, Nandaprayag, Karnaprayag, Rudraprayag, and Devprayag. Attend evening Ganga Aarti at Triveni Ghat.",
                                                                    "elevationMeters": 372,
                                                                    "distanceKm": 290
                                                          },
                                                          {
                                                                    "day": 16,
                                                                    "title": "Haridwar Har Ki Pauri Morning Dip & Departure",
                                                                    "description": "Final holy dip at Har Ki Pauri in Haridwar, visit Mansa Devi Siddhpeeth, and conclude the grand sacred circuit.",
                                                                    "elevationMeters": 314,
                                                                    "distanceKm": 25
                                                          }
                                                ],
                                                "packingList": [
                                                          "Sturdy high-ankle waterproof trekking shoes with wool socks (for Kedarnath & Yamunotri treks)",
                                                          "Heavy multi-layer warm clothing: thermal base layers, fleece, and windproof down jacket",
                                                          "Rain poncho or lightweight waterproof jacket (mountain weather shifts rapidly)",
                                                          "Government RFID registration wristband / biometric QR code (Tourist Care Uttarakhand)",
                                                          "Trekking pole, broad sun hat, sunglasses, and personal first-aid kit with Diamox for AMS"
                                                ],
                                                "tips": [
                                                          "Clockwise Direction (Parikrama): Always follow the traditional sequence: Yamunotri → Gangotri → Kedarnath → Badrinath. This aligns with Vedic pradakshina and allows gradual altitude acclimatization.",
                                                          "Biometric Yatra Registration: Mandatory for all pilgrims. Register online at registrationandtouristcare.uk.gov.in or obtain a physical Yatra slip at Haridwar, Rishikesh, or Sonprayag.",
                                                          "The 4 Holy Temples Breakdown: Yamunotri (3,291m - 6km trek from Janki Chatti, boiling Surya Kund), Gangotri (3,100m - accessible by motorable road, sacred Bhagirathi riverbed), Kedarnath (3,584m - 16km steep trek from Gaurikund alongside Mandakini river), Badrinath (3,133m - accessible by motorable road along the Alaknanda river).",
                                                          "Two Itinerary Options: (1) Standard Agency Route (10–12 Days): Rushed commercial tour covering only the 4 main temples. (2) DHT Insider Explorer Circuit (14–16 Days): Includes Dhari Devi Mandir (guardian protector), Kharsali heritage stone temple, Harsil Valley apple orchards, Triyuginarayan (eternal wedding flame), Madhyamaheshwar link from Ukhimath, Joshimath (Adi Shankaracharya Math & Narsingh Temple), Urgam Valley (Kalpeshwar Mahadev), and Mana Village (India's first border village, Saraswati river origin, Bhim Pul, Vyas Gufa, Ganesh Gufa, and Vasudhara Falls).",
                                                          "Altitude Safety & AMS: Kedarnath (3,584m) and Yamunotri (3,291m) are well above the 3,000m AMS threshold. Follow the 3 Golden Rules of Altitude Safety: if unwell assume AMS; never ascend with symptoms; descend immediately if symptoms worsen."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What are the two itineraries for Garhwal Char Dham Yatra?",
                                                                    "answer": "1. Standard Agency Itinerary (10–12 Days): Focuses strictly on the four temples with long drive days: Haridwar → Barkot → Yamunotri → Uttarkashi → Gangotri → Guptkashi → Kedarnath → Pipalkoti → Badrinath → Srinagar → Haridwar. 2. DHT Insider Explorer Itinerary (14–16 Days): A richer, safer, well-acclimatized route adding essential spiritual stops: Dhari Devi Temple (guardian goddess of Char Dham), Kharsali (Shani Dev temple & winter seat of Yamuna), Harsil Valley (Bhagirathi canyon & Mukhba village), Triyuginarayan (eternal wedding flame of Shiva & Parvati), Joshimath (Adi Shankaracharya Jyotirmath & Narsingh Temple), Urgam Valley (Kalpeshwar Mahadev), and Mana Village (Saraswati river origin, Bhim Pul, Vyas Gufa, and 122m Vasudhara Falls)."
                                                          },
                                                          {
                                                                    "question": "Which of the Char Dham temples require trekking and which are motorable?",
                                                                    "answer": "Two shrines require trekking on foot (or pony/palanquin): Yamunotri requires a 6 km uphill trek (one way) from Janki Chatti, and Kedarnath requires a 16 km steep uphill climb (one way) from Gaurikund. The other two shrines—Gangotri and Badrinath—are completely motorable with paved roads leading directly to the temple premises."
                                                          },
                                                          {
                                                                    "question": "Why must you visit Dhari Devi Temple before Kedarnath and Badrinath?",
                                                                    "answer": "Dhari Devi is worshipped as the guardian deity (Rakshak Devi) of the Char Dham and the protector of the Uttarakhand Himalayas. Perched on a rock in the middle of the Alaknanda River between Srinagar and Rudraprayag, it is an age-old tradition that pilgrims must pay homage and seek her blessings to ensure safe passage across the treacherous mountain gorges."
                                                          },
                                                          {
                                                                    "question": "What are the must-visit places near Badrinath?",
                                                                    "answer": "Just 3 km beyond Badrinath lies Mana Village, designated as India's 'First Indian Village'. Crucial sacred and natural attractions here include: Keshav Prayag (confluence of Saraswati and Alaknanda), Saraswati River rushing through a narrow rock canyon, Bhim Pul (massive natural stone boulder bridge placed by Bhima), Vyas Gufa (where Sage Vyasa composed the Mahabharata), Ganesh Gufa, and the 5 km trail to the spectacular 122-meter Vasudhara Falls where drops of water are said to veer away from the impure."
                                                          },
                                                          {
                                                                    "question": "How can one link Madhyamaheshwar or Urgam Valley to the Char Dham route?",
                                                                    "answer": "During the transfer from Kedarnath to Badrinath via Ukhimath: (1) Ukhimath is the winter seat of Kedarnath and Omkareshwar Temple, and serves as the roadhead for the 3-day trek to Madhyamaheshwar (second Kedar, 3,497m). (2) At Joshimath/Helang, take a 12 km spur road into Urgam Valley to visit Kalpeshwar Mahadev (fifth Kedar, 2,200m), the only Panch Kedar temple open throughout the year without strenuous trekking."
                                                          }
                                                ],
                                                "seoTitle": "Garhwal Char Dham (3,584m) — Sacred 4 Shrines, 2 Itineraries & Guide",
                                                "seoDescription": "Complete guide to the Garhwal Char Dham pilgrimage: Yamunotri, Gangotri, Kedarnath, and Badrinath. Compare 10–12 day agency tour vs 14–16 day DHT insider route with Dhari Devi, Mana Village, and Vasudhara Falls.",
                                                "keywords": [
                                                          "char dham",
                                                          "char dham yatra",
                                                          "garhwal char dham",
                                                          "char dham uttarakhand",
                                                          "yamunotri temple",
                                                          "gangotri temple",
                                                          "kedarnath temple",
                                                          "badrinath temple",
                                                          "char dham itinerary",
                                                          "char dham route",
                                                          "dhari devi temple",
                                                          "mana village",
                                                          "vasudhara falls",
                                                          "triyuginarayan temple",
                                                          "joshimath urgam valley"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "chamoli",
                            "name": "Chamoli",
                            "tagline": "UNESCO alpine wildflower meadows, high-altitude Sikh sanctuaries, and Nanda Devi views",
                            "division": "Garhwal",
                            "places": [
                                      {
                                                "id": "roopkund-trek",
                                                "name": "Roopkund Mystery Lake Trek",
                                                "type": "trek",
                                                "emoji": "💀",
                                                "coords": [
                                                          30.264,
                                                          79.732
                                                ],
                                                "elevation": "4,800 m",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Challenging",
                                                "duration": "6–7 Days",
                                                "distance": "53 km",
                                                "overview": "One of the most legendary high-altitude alpine treks in the Garhwal Himalayas, journeying from Lohajung through the twin rolling bugyals of Ali and Bedni to the glaciated tarn of Roopkund at 4,800m beneath the sheer rock face of Mount Trishul (7,120m). Famed for hundreds of ancient human skeletons dating to the 9th century CE preserved in the glacial ice, the trail commands sweeping vistas of Trishul, Nanda Ghunti, and Chaukhamba.",
                                                "routeDescription": "Starts at Lohajung (2,300m), climbs through oak forests to Didna village, traverses the vast highland meadows of Ali Bugyal and Bedni Bugyal (3,354m), climbs past Kalu Vinayak temple to Bhagwabasa high camp (4,300m), and scrambles up frozen scree to Roopkund Lake (4,800m) and Junargali Ridge (5,150m).",
                                                "experience": "Emerging onto the infinite golden expanses of Ali Bugyal at sunrise as Mount Trishul rises in titanic white splendor directly above the emerald ridge.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Kathgodam/Rishikesh to Lohajung",
                                                                    "description": "Scenic 210 km mountain drive to the trekking base camp village of Lohajung (2,300m).",
                                                                    "elevationMeters": 2300,
                                                                    "distanceKm": 210
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Lohajung to Didna Village",
                                                                    "description": "Descend through mixed forest to the Neel Ganga river, then climb steadily through bamboo and rhododendron groves to Didna village (2,450m).",
                                                                    "elevationMeters": 2450,
                                                                    "distanceKm": 8
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Didna to Ali Bugyal & Bedni Bugyal",
                                                                    "description": "Climb through dense oak canopy onto the boundless undulating meadows of Ali Bugyal, continuing across the ridgeline to Bedni Bugyal (3,354m) overlooking Bedni Kund.",
                                                                    "elevationMeters": 3354,
                                                                    "distanceKm": 10
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Bedni Bugyal to Bhagwabasa",
                                                                    "description": "Trek past Ghora Lotani and make a steep climb past the sacred black stone Ganesha shrine of Kalu Vinayak (4,450m) to the barren, rocky high camp of Bhagwabasa (4,300m).",
                                                                    "elevationMeters": 4300,
                                                                    "distanceKm": 9
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Bhagwabasa to Roopkund & Junargali, Descend to Bedni",
                                                                    "description": "Early 4:00 AM push across snow and moraine to Roopkund Lake (4,800m) and Junargali Pass (5,150m) for close-up Trishul panoramas. Descend all the way back to Bedni Bugyal.",
                                                                    "elevationMeters": 4800,
                                                                    "distanceKm": 16
                                                          },
                                                          {
                                                                    "day": 6,
                                                                    "title": "Bedni Bugyal to Wan & Drive to Lohajung",
                                                                    "description": "Descend through ancient cypress and rhododendron forests past the quaint village of Wan, meeting vehicles for the short drive back to Lohajung.",
                                                                    "elevationMeters": 2300,
                                                                    "distanceKm": 10
                                                          }
                                                ],
                                                "packingList": [
                                                          "Sturdy high-ankle trekking shoes with aggressive grip for snow and moraine",
                                                          "Expedition-grade down jacket (-10°C rated) and thermal base layers",
                                                          "Microspikes and gaiters for snow sections above Bhagwabasa",
                                                          "UV 400 polarized sunglasses (essential for high-altitude snow reflection)",
                                                          "Trekking poles with snow baskets"
                                                ],
                                                "tips": [
                                                          "Ali Bugyal and Bedni Bugyal are among Asia's largest high-altitude alpine meadows; maintain strict Leave No Trace discipline and pitch tents only in designated eco-zones.",
                                                          "The final 3 km ascent from Bhagwabasa to Roopkund gains 500m on steep scree and hard-packed snow; start before 5:00 AM before the sun softens the snowpack."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is the mystery behind the skeletons at Roopkund?",
                                                                    "answer": "Radiocarbon and DNA analysis revealed the skeletons belong to two distinct groups—a local community and individuals of Mediterranean/Greek lineage dating back to ~800 CE—likely caught in a sudden, catastrophic hailstorm of baseball-sized stones."
                                                          },
                                                          {
                                                                    "question": "Can you see Mount Trishul from Roopkund?",
                                                                    "answer": "Yes, Mount Trishul (7,120m) and Nanda Ghunti (6,309m) rise directly above Roopkund Lake and Junargali Pass, appearing so close that their massive glaciers and icefalls dominate the entire horizon."
                                                          }
                                                ],
                                                "seoTitle": "Roopkund Trek (4,800m), Chamoli — Mystery Skeleton Lake & Bugyals Guide",
                                                "seoDescription": "Complete guide to Roopkund Mystery Lake Trek (4,800m) in Chamoli, Garhwal. 6-day itinerary from Lohajung, Ali & Bedni Bugyals, Trishul views, maps, and travel advice.",
                                                "keywords": [
                                                          "Roopkund trek",
                                                          "mystery lake Roopkund",
                                                          "Ali Bedni Bugyal",
                                                          "Roopkund skeleton lake",
                                                          "Chamoli trekking",
                                                          "Trishul peak view",
                                                          "Lohajung to Roopkund"
                                                ]
                                      },
                                      {
                                                "id": "badrinath",
                                                "name": "Badrinath Temple & Alaknanda Basin",
                                                "type": "spiritual",
                                                "emoji": "🛕",
                                                "coords": [
                                                          30.7433,
                                                          79.4938
                                                ],
                                                "elevation": "3,133 m",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "One of India's four primordial Char Dham pilgrimage shrines, Badrinath is dedicated to Lord Vishnu (Badri Vishal) seated in the Padmasana meditative posture. Nestled in a high alpine valley of Chamoli Garhwal along the banks of the roaring Alaknanda River, the temple stands between the Nar and Narayana mountain ranges under the towering, glaciated pyramid of Mount Nilkantha (6,596m).",
                                                "experience": "The resonance of morning conch shells and sacred Vedic chants echoing across the Alaknanda gorge as golden dawn illuminates the ice face of Mount Nilkantha.",
                                                "tips": [
                                                          "Bathe in the natural thermal sulphur waters of Tapt Kund (45°C) along the riverbank before entering the main temple sanctum.",
                                                          "Visit the temple during early morning Mangala Aarti (4:30 AM) to experience the ceremonial unclothing and sandal-paste decoration of the Shaligram idol."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "When does Badrinath Temple open and close each year?",
                                                                    "answer": "The temple opens in late April or early May on Akshaya Tritiya and closes in November on Vijayadashami/Bhai Dooj for the winter, with the deity moving to Joshimath."
                                                          },
                                                          {
                                                                    "question": "How far is Badrinath from Joshimath?",
                                                                    "answer": "Badrinath is located approximately 45 kilometers northeast of Joshimath along NH7, traversing through Govindghat and Pandukeshwar (about 2 hours drive)."
                                                          }
                                                ],
                                                "seoTitle": "Badrinath Temple (3,133m), Chamoli — Char Dham & Nilkantha Peak Guide",
                                                "seoDescription": "Complete guide to Badrinath Temple (3,133m) in Chamoli, Uttarakhand. Char Dham shrine, Tapt Kund, Nilkantha peak views, opening dates, and travel advice.",
                                                "keywords": [
                                                          "Badrinath Temple Chamoli",
                                                          "Char Dham Uttarakhand",
                                                          "Badrinath altitude",
                                                          "Nilkantha peak view",
                                                          "Joshimath to Badrinath",
                                                          "Badrinath opening dates"
                                                ]
                                      },
                                      {
                                                "id": "mana-village",
                                                "name": "Mana — First Indian Village & Saraswati River",
                                                "type": "scenic",
                                                "emoji": "🇮🇳",
                                                "coords": [
                                                          30.7719,
                                                          79.4975
                                                ],
                                                "elevation": "3,200 m",
                                                "bestSeason": "May to October",
                                                "difficulty": "Easy",
                                                "duration": "Half Day",
                                                "overview": "Designated officially as the 'First Indian Village' on the northern border, Mana sits just 3 km beyond Badrinath in the upper Alaknanda canyon. Inhabited by indigenous Bhotia (Marchha) pastoralists, Mana is steeped in epic Mahabharata lore, housing Vyas Gufa (where Sage Vyasa composed the epic), Ganesh Gufa, Bhim Pul (a colossal natural stone slab spanning the roaring Saraswati river gorge), and serving as the trailhead for Vasudhara Falls.",
                                                "experience": "Standing over the dizzying rock chasm of Bhim Pul as the mythical Saraswati River thunders in frothing emerald cascades before disappearing subterraneanly.",
                                                "tips": [
                                                          "Stop at 'India's First Tea Shop' at the edge of the village for a warm cup of herbal mountain tea and handmade woollen handicrafts.",
                                                          "Continue 5 km on foot along the moraine trail past Mana to reach the 122m cascading drop of Vasudhara Falls."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Why is Mana designated as India's 'First Village'?",
                                                                    "answer": "Previously termed the 'last village of India' due to its proximity to the Tibet border (Mana Pass), it was officially rechristened the 'First Indian Village' to celebrate border communities as national sentinels."
                                                          },
                                                          {
                                                                    "question": "What language and culture predominate in Mana?",
                                                                    "answer": "The local residents are Marchha Bhotias, an Indo-Tibetan community traditionally engaged in trans-Himalayan wool trading and high-altitude pastoralism."
                                                          }
                                                ],
                                                "seoTitle": "Mana Village (3,200m), Chamoli — First Village of India & Bhim Pul Guide",
                                                "seoDescription": "Explore Mana Village (3,200m) in Chamoli, Uttarakhand. First Indian Village, Bhim Pul over Saraswati River, Vyas Gufa, Bhotia culture, and Vasudhara Falls trail.",
                                                "keywords": [
                                                          "Mana village Uttarakhand",
                                                          "First Indian village",
                                                          "Bhim Pul Saraswati",
                                                          "Vyas Gufa Mana",
                                                          "Mana village altitude",
                                                          "Badrinath to Mana distance"
                                                ]
                                      },
                                      {
                                                "id": "joshimath",
                                                "name": "Joshimath (Jyotirmath) Gateway",
                                                "type": "spiritual",
                                                "emoji": "🏔️",
                                                "coords": [
                                                          30.5574,
                                                          79.5658
                                                ],
                                                "elevation": "1,890 m",
                                                "bestSeason": "Year-round (Best: April to November)",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "Perched high on the steep northern slopes above the Alaknanda and Dhauliganga river confluence, Joshimath is the cardinal northern monastic seat (Uttaramnaya Jyotirmath) founded by Adi Shankaracharya in the 8th century. It houses the winter seat of Lord Badrinath at Narsimha Temple, the ancient Kalpavriksha mulberry tree (under which Shankaracharya meditated), the lower station of the Auli cable car ropeway, and serves as the strategic staging base for mountaineering expeditions into the Nanda Devi sanctuary.",
                                                "experience": "The scent of deodar pines and incense at the ancient Shankaracharya Math as evening shadow creeps up the glaciated wall of Hathi Parvat.",
                                                "tips": [
                                                          "Board the 4 km Joshimath-Auli Ropeway (one of Asia's longest bi-cable passenger ropeways) for a thrilling 22-minute ride over oak canopy with Nanda Devi views.",
                                                          "Visit the ancient Narsimha Temple during winter (November to April) when the ceremonial Puja of Lord Badrinath is conducted here."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is the historical significance of Joshimath?",
                                                                    "answer": "It is the northern peetha among the four cardinal monasteries established by Adi Shankaracharya, preserving the Atharva Veda."
                                                          },
                                                          {
                                                                    "question": "How does Joshimath connect to Auli?",
                                                                    "answer": "Visitors can travel via the 4 km aerial passenger cable car or drive 14 km up the winding paved mountain road to Auli."
                                                          }
                                                ],
                                                "seoTitle": "Joshimath Gateway (1,890m), Chamoli — Jyotirmath, Auli Ropeway & Temples",
                                                "seoDescription": "Complete guide to Joshimath (1,890m) in Chamoli, Garhwal. Shankaracharya Math, winter seat of Badrinath, Narsimha Temple, Auli cable car, and expedition logistics.",
                                                "keywords": [
                                                          "Joshimath Chamoli",
                                                          "Jyotirmath Uttarakhand",
                                                          "Auli ropeway Joshimath",
                                                          "Joshimath altitude",
                                                          "Narsimha temple Joshimath",
                                                          "gateway to Badrinath"
                                                ]
                                      },
                                      {
                                                "id": "auli",
                                                "name": "Auli Alpine Meadows & Ski Slopes",
                                                "type": "adventure",
                                                "emoji": "⛷️",
                                                "coords": [
                                                          30.5284,
                                                          79.5684
                                                ],
                                                "elevation": "2,800 m (Slopes up to 3,050 m)",
                                                "bestSeason": "December to March for Skiing, April to November for Green Bugyals",
                                                "difficulty": "Easy to Moderate",
                                                "duration": "2–3 Days",
                                                "overview": "Celebrated as India's premier high-altitude ski resort, Auli features undulating alpine slopes (bugyals) lined by dense conifers of oak, deodar, and silver fir. Sitting at 2,800m, Auli commands the grandest unobstructed 270-degree panorama of India's second-highest peak, Nanda Devi (7,816m), alongside Kamet, Dunagiri, Mana Parvat, and Hathi-Ghodi Parvat. In winter, international ski championships are held on its groomed powder slopes.",
                                                "experience": "Gliding across powdery snowfields beneath cobalt skies while the glaciated twin horns of Nanda Devi gleam in blinding golden alpine light.",
                                                "tips": [
                                                          "Hike 3 km beyond the upper chairlift station to Gorson Bugyal (3,050m) for an expansive alpine meadow walk directly facing Mount Trishul.",
                                                          "Visit the artificial Auli Lake—the highest man-made lake in India—engineered to feed snow-making guns along the ski slopes."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "When is the best snow condition for skiing in Auli?",
                                                                    "answer": "Mid-January to late February provides the deepest natural powder snow on the ski slopes, averaging 3 to 5 feet of snow cover."
                                                          },
                                                          {
                                                                    "question": "Can beginners learn skiing in Auli?",
                                                                    "answer": "Yes, GMVN (Garhwal Mandal Vikas Nigam) operates certified 7-day and 14-day ski courses with qualified instructors and gear rentals."
                                                          }
                                                ],
                                                "seoTitle": "Auli Ski Resort & Bugyals (2,800m), Chamoli — Winter Skiing & Nanda Devi Guide",
                                                "seoDescription": "Explore Auli (2,800m) in Chamoli, Uttarakhand. Premier ski slopes, artificial lake, Gorson Bugyal trail, Nanda Devi views, cable car, and season guide.",
                                                "keywords": [
                                                          "Auli skiing Uttarakhand",
                                                          "Auli altitude",
                                                          "Auli cable car",
                                                          "Nanda Devi view Auli",
                                                          "Gorson Bugyal trek",
                                                          "Auli best time to visit"
                                                ]
                                      },
                                      {
                                                "id": "govindghat",
                                                "name": "Govindghat Confluence & Trailhead",
                                                "type": "scenic",
                                                "emoji": "🌉",
                                                "coords": [
                                                          30.625,
                                                          79.559
                                                ],
                                                "elevation": "1,828 m",
                                                "bestSeason": "June to October",
                                                "difficulty": "Easy",
                                                "duration": "Staging / Trailhead",
                                                "overview": "Sited at the roaring confluence of the Alaknanda and Bhyundar (Lakshman Ganga) rivers on NH7 between Joshimath and Badrinath, Govindghat is the indispensable roadhead and staging hub for hikers heading into the UNESCO Valley of Flowers National Park and Sikh pilgrims trekking to the glaciated shrine of Hemkund Sahib.",
                                                "experience": "The thunderous sound of the Alaknanda mingling with Sikh shabads from the large riverside Gurudwara as trekkers organize rucksacks and walking sticks.",
                                                "tips": [
                                                          "Take a shared taxi from Govindghat across the river bridge to Pulna village (4 km), which cuts out 4 km of paved road walking.",
                                                          "Deposit excess luggage securely at the Govindghat Gurudwara cloakroom before beginning the uphill trek to Ghangaria."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What trails start from Govindghat?",
                                                                    "answer": "The 14 km trail leads to Ghangaria base camp, which bifurcates into the Valley of Flowers trail (3.5 km) and Hemkund Sahib climb (6 km)."
                                                          },
                                                          {
                                                                    "question": "Is mule and porter service available at Govindghat?",
                                                                    "answer": "Yes, licensed mules, porters, and helicopter services to Ghangaria operate from the Govindghat/Pulna helipad."
                                                          }
                                                ],
                                                "seoTitle": "Govindghat (1,828m), Chamoli — Valley of Flowers & Hemkund Trailhead Guide",
                                                "seoDescription": "Guide to Govindghat (1,828m) in Chamoli, Uttarakhand. Starting trailhead for Valley of Flowers and Hemkund Sahib, Pulna taxi stand, Gurudwara, and route advice.",
                                                "keywords": [
                                                          "Govindghat Chamoli",
                                                          "Govindghat to Ghangaria",
                                                          "Valley of Flowers trailhead",
                                                          "Hemkund Sahib starting point",
                                                          "Pulna to Govindghat",
                                                          "Govindghat altitude"
                                                ]
                                      },
                                      {
                                                "id": "ghangaria",
                                                "name": "Ghangaria (Govinddham) Base Camp",
                                                "type": "scenic",
                                                "emoji": "🏕️",
                                                "coords": [
                                                          30.7,
                                                          79.589
                                                ],
                                                "elevation": "3,049 m",
                                                "bestSeason": "June to October",
                                                "difficulty": "Moderate",
                                                "duration": "Base Camp / 2–3 Nights",
                                                "overview": "Nestled in a sub-alpine conifer basin at the confluence of the Pushpawati and Hemganga rivers, Ghangaria (also known as Govinddham) is the solitary seasonal base settlement for expeditions into the Valley of Flowers and the climb to Hemkund Sahib. Because overnight camping is prohibited inside the national park, all trekkers stay in Ghangaria's rustic lodges, guesthouses, and Gurudwara.",
                                                "experience": "Sitting beside a crackling bukhari heater in a wooden mountain lodge while evening rain taps on tin roofs and mist settles over the pine forests.",
                                                "tips": [
                                                          "Electricity and hot water are limited; carry power banks and headlamps for chilly mountain evenings.",
                                                          "Start your day hike into the Valley of Flowers by 7:00 AM from Ghangaria to enjoy maximum daylight and clear weather before afternoon showers."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Can you camp inside the Valley of Flowers?",
                                                                    "answer": "No, overnight stays and camping are strictly forbidden inside the UNESCO National Park; all visitors must return to Ghangaria by 5:00 PM."
                                                          },
                                                          {
                                                                    "question": "How long does it take to trek from Govindghat/Pulna to Ghangaria?",
                                                                    "answer": "The 10 km uphill trek from Pulna takes approximately 4 to 6 hours on foot or 2 to 3 hours on mule."
                                                          }
                                                ],
                                                "seoTitle": "Ghangaria / Govinddham (3,049m), Chamoli — Base Camp for Valley of Flowers",
                                                "seoDescription": "Essential guide to Ghangaria (3,049m) in Chamoli, Uttarakhand. Base camp for Valley of Flowers National Park & Hemkund Sahib, hotel stays, mules, and tips.",
                                                "keywords": [
                                                          "Ghangaria Chamoli",
                                                          "Govinddham base camp",
                                                          "Ghangaria altitude",
                                                          "Ghangaria to Valley of Flowers",
                                                          "Ghangaria hotels",
                                                          "Hemkund base camp"
                                                ]
                                      },
                                      {
                                                "id": "valley-of-flowers",
                                                "name": "Valley of Flowers National Park",
                                                "type": "trek",
                                                "emoji": "🌸",
                                                "coords": [
                                                          30.72,
                                                          79.6
                                                ],
                                                "elevation": "3,658 m (Valley floor up to 3,900 m)",
                                                "bestSeason": "July to September (Peak bloom: late July to mid-August)",
                                                "difficulty": "Moderate",
                                                "duration": "5 Days",
                                                "distance": "38 km",
                                                "overview": "A UNESCO World Heritage site and high-altitude alpine basin tucked in the upper Bhyundar valley beneath glaciated mountain walls. Discovered by mountaineer Frank S. Smythe in 1931, the valley carpets with over 520 species of wild flowering plants, including the rare Himalayan blue poppy, Brahma Kamal, cobra lily, edelweiss, and wild orchids, nourished by the rushing Pushpawati River.",
                                                "routeDescription": "Starts from Govindghat/Pulna, climbs 10 km along the Bhyundar valley to Ghangaria base camp (3,049m), enters the national park across the Pushpawati gorge, and explores 5–8 km across the flower-strewn meadow floor up to the memorial grave of botanist Joan Margaret Legge.",
                                                "experience": "Walking through knee-high carpets of purple wild geraniums and fragrant blue poppies while glacial waterfalls tumble down sheer granite cliffs under shifting monsoon mist.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Haridwar/Rishikesh to Govindghat",
                                                                    "description": "Drive along the Alaknanda River through Devprayag, Rudraprayag, Karnaprayag, and Joshimath to Govindghat (1,828m).",
                                                                    "elevationMeters": 1828,
                                                                    "distanceKm": 275
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Govindghat to Pulna & Trek to Ghangaria",
                                                                    "description": "Short drive to Pulna, then trek 10 km through lush pine forests along the roaring river to Ghangaria (3,049m).",
                                                                    "elevationMeters": 3049,
                                                                    "distanceKm": 10
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Ghangaria to Valley of Flowers & Return",
                                                                    "description": "Cross the Pushpawati River, pass the national park checkpoint, and spend 6 hours exploring the blooming meadows up to Margaret Legge's memorial (3,658m). Return to Ghangaria.",
                                                                    "elevationMeters": 3658,
                                                                    "distanceKm": 10
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Day Trek to Hemkund Sahib or Secondary Valley Exploration",
                                                                    "description": "Climb to the high alpine lake of Hemkund Sahib (4,632m) or spend a second day deeper in the Valley of Flowers meadows. Night at Ghangaria.",
                                                                    "elevationMeters": 4632,
                                                                    "distanceKm": 12
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Ghangaria to Pulna/Govindghat & Return Drive",
                                                                    "description": "Descend 10 km back to Pulna and Govindghat, then drive back toward Joshimath or Rishikesh.",
                                                                    "elevationMeters": 1828,
                                                                    "distanceKm": 10
                                                          }
                                                ],
                                                "packingList": [
                                                          "Waterproof breathable poncho or rain jacket with taped seams (monsoon trek)",
                                                          "Waterproof trekking shoes with deep lug soles (slick mud & wet stone)",
                                                          "Quick-dry trekking trousers (no heavy cotton denims)",
                                                          "Waterproof dry bags for phone, camera, and electronics",
                                                          "Trekking poles with rubber tips (vital for steep descents)"
                                                ],
                                                "tips": [
                                                          "Visit between July 20 and August 15 for the densest floral bloom and maximum variety of active wildflower species.",
                                                          "Carry valid photo ID for the mandatory Forest Department entry permit issued at the park checkpoint in Ghangaria."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Why is the Valley of Flowers a monsoon trek?",
                                                                    "answer": "The valley is sheltered by high Himalayan ridges, and the heavy monsoon showers in July and August trigger the rapid mass germination of over 500 dormant wildflower species."
                                                          },
                                                          {
                                                                    "question": "Who was Joan Margaret Legge?",
                                                                    "answer": "A botanist from the Royal Botanic Gardens, Kew, who died in 1939 while collecting specimens in the valley; her memorial stone still stands in the meadow."
                                                          }
                                                ],
                                                "seoTitle": "Valley of Flowers Trek (3,658m), Chamoli — UNESCO Trail Itinerary & Bloom Guide",
                                                "seoDescription": "Complete guide to the Valley of Flowers Trek (3,658m) in Chamoli, Uttarakhand. 5-day itinerary, peak bloom dates, rare blue poppy, maps, permits, and packing list.",
                                                "keywords": [
                                                          "Valley of Flowers trek",
                                                          "Valley of Flowers bloom time",
                                                          "Valley of Flowers itinerary",
                                                          "UNESCO national park Uttarakhand",
                                                          "Ghangaria to Valley of Flowers",
                                                          "Blue poppy Chamoli"
                                                ]
                                      },
                                      {
                                                "id": "hemkund-sahib",
                                                "name": "Hemkund Sahib & Lokpal Lake",
                                                "type": "spiritual",
                                                "emoji": "☬",
                                                "coords": [
                                                          30.7,
                                                          79.62
                                                ],
                                                "elevation": "4,632 m",
                                                "bestSeason": "June to October",
                                                "difficulty": "Moderate to Difficult",
                                                "duration": "1 Day (from Ghangaria)",
                                                "distance": "12 km return",
                                                "overview": "The world's highest Gurudwara, Hemkund Sahib is perched at an extreme altitude of 4,632 meters on the shores of the glaciated Lokpal Lake. Ringed by seven glaciated mountain peaks (Saptashringa) adorned with fluttering Nishan Sahib flags, it is revered as the spot where Guru Gobind Singh meditated in a previous incarnation as Sage Dusht Daman. Nearby stands the ancient Lakshman Temple.",
                                                "routeDescription": "Climbs 6 km on a continuous, steep zig-zag cobblestone path from Ghangaria (3,049m) through birch and rhododendron forests into high alpine scree, gaining 1,583 meters of vertical elevation.",
                                                "experience": "Dipping hands into the crystal-clear, icy glaciated waters of Lokpal Lake while steaming hot langar and sweet halwa are served inside the world's highest Gurudwara.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Ghangaria to Hemkund Sahib Ascent & Descent",
                                                                    "description": "Early morning start from Ghangaria (3,049m). Steep 6 km zig-zag climb to Hemkund Sahib (4,632m). Dip in Lokpal lake, attend Gurudwara prayers, and descend back to Ghangaria by late afternoon.",
                                                                    "elevationMeters": 4632,
                                                                    "distanceKm": 12
                                                          }
                                                ],
                                                "packingList": [
                                                          "Heavy windproof and waterproof jacket (temperatures at 4,600m hover near freezing)",
                                                          "Warm woollen cap/beanie and insulated gloves",
                                                          "Trekking poles with shock absorption",
                                                          "Head covering (mandatory inside Gurudwara premises)",
                                                          "Small towel and change of socks"
                                                ],
                                                "tips": [
                                                          "Start climbing from Ghangaria by 5:30 AM to beat afternoon cloud build-up and cold mountain winds at the summit.",
                                                          "Take slow, rhythmic steps and practice deep breathing; the rapid vertical ascent from 3,000m to 4,632m demands proper acclimatization."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Can visitors stay overnight at Hemkund Sahib?",
                                                                    "answer": "No, staying overnight at Hemkund Sahib is strictly prohibited due to extreme altitude and sub-zero temperatures. All pilgrims must begin descending to Ghangaria by 2:00 PM."
                                                          },
                                                          {
                                                                    "question": "What is the flower that blooms around Hemkund Sahib?",
                                                                    "answer": "The mythical Brahma Kamal (Saussurea obvallata), the state flower of Uttarakhand, blooms in abundance on the rocky slopes surrounding the lake between July and August."
                                                          }
                                                ],
                                                "seoTitle": "Hemkund Sahib (4,632m), Chamoli — World's Highest Gurudwara & Lake Guide",
                                                "seoDescription": "Explore Hemkund Sahib (4,632m) in Chamoli, Uttarakhand. World's highest Sikh pilgrimage, Lokpal glacial lake, 6km climb from Ghangaria, opening dates, and advice.",
                                                "keywords": [
                                                          "Hemkund Sahib altitude",
                                                          "Hemkund Sahib trek",
                                                          "Ghangaria to Hemkund Sahib",
                                                          "highest Gurudwara in the world",
                                                          "Lokpal Lake Uttarakhand",
                                                          "Brahma Kamal Hemkund"
                                                ]
                                      },
                                      {
                                                "id": "vasudhara-falls",
                                                "name": "Vasudhara Falls Trail",
                                                "type": "day-hike",
                                                "emoji": "💧",
                                                "coords": [
                                                          30.795,
                                                          79.467
                                                ],
                                                "elevation": "3,700 m",
                                                "bestSeason": "May to October",
                                                "difficulty": "Moderate",
                                                "duration": "1 Day (from Mana)",
                                                "distance": "12 km return",
                                                "overview": "A rewarding high-altitude day hike starting from Mana village along the upper Alaknanda canyon to a vertical 122-meter (400 ft) glacial waterfall dropping from sheer granite cliff faces. Fed by melting glaciers descending from the Chaukhamba and Satopanth massifs, legend holds that the sacred waters of Vasudhara veer away from unrighteous individuals.",
                                                "experience": "The icy mountain spray misting your face as a colossal 400-foot glacial torrent drops down vertical granite walls into a boulder-strewn alpine valley.",
                                                "tips": [
                                                          "Carry sufficient drinking water and high-energy snacks; there are no commercial shops or teahouses beyond Mana village.",
                                                          "Trek early in the morning when the trail is sheltered and winds are gentle across the rocky glacial moraine."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How long does the hike to Vasudhara Falls take?",
                                                                    "answer": "The 6 km trail from Mana takes approximately 2 to 3 hours one way across rocky moraine and gentle ascents, making it a 5 to 6-hour round-trip excursion."
                                                          },
                                                          {
                                                                    "question": "What peaks are visible on the Vasudhara Falls trail?",
                                                                    "answer": "The trail offers dramatic up-close views of Mount Chaukhamba, Balakun, and the Satopanth glacier approaches."
                                                          }
                                                ],
                                                "seoTitle": "Vasudhara Falls Trail (3,700m), Mana — 122m Waterfall Day Hike Guide",
                                                "seoDescription": "Hike the Vasudhara Falls trail (3,700m) from Mana village, Chamoli. 122m vertical glacial waterfall, route from Badrinath, Chaukhamba views, and trail advice.",
                                                "keywords": [
                                                          "Vasudhara Falls trek",
                                                          "Mana to Vasudhara distance",
                                                          "Vasudhara Falls altitude",
                                                          "Chamoli day hikes",
                                                          "Badrinath waterfalls",
                                                          "Saraswati river trek"
                                                ]
                                      },
                                      {
                                                "id": "kuari-pass",
                                                "name": "Kuari Pass (Curzon Trail)",
                                                "type": "trek",
                                                "emoji": "🏔️",
                                                "coords": [
                                                          30.5,
                                                          79.55
                                                ],
                                                "elevation": "3,876 m",
                                                "bestSeason": "March to June, September to December",
                                                "difficulty": "Moderate",
                                                "duration": "6 Days",
                                                "distance": "33 km",
                                                "overview": "Pioneered by Lord Curzon in 1905, the Kuari Pass (Curzon Trail) trek is celebrated for offering India's grandest unobstructed panoramic vistas of Nanda Devi (7,816m), Kamet, Dronagiri, Hathi-Ghodi Parvat, Neelkanth, and Trishul. Traversing ancient oak and rhododendron forests, sprawling bugyals of Gorson and Chitrakantha, the trail culminates on the wind-swept pass at 3,876 meters.",
                                                "routeDescription": "Begins from Dhak village near Joshimath, climbs through Tugasi to Gulling camp, crosses the rhododendron forests to Tali campsite, ascends across the rocky ridge to Kuari Pass (3,876m), and descends via the vast meadows of Gorson Bugyal into Auli.",
                                                "experience": "Standing on the narrow knife-edge crest of Kuari Pass as the morning sun strikes the golden south face of Mount Nanda Devi rising directly across the gorge.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Rishikesh to Joshimath",
                                                                    "description": "Drive 255 km along the Alaknanda River to the mountain hub of Joshimath (1,890m).",
                                                                    "elevationMeters": 1890,
                                                                    "distanceKm": 255
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Joshimath to Dhak & Trek to Gulling",
                                                                    "description": "Short drive to Dhak village (2,050m), then begin trekking through terraced barley fields to Gulling Top camp (2,900m).",
                                                                    "elevationMeters": 2900,
                                                                    "distanceKm": 6
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Gulling to Tali Forest Camp",
                                                                    "description": "Walk through ancient oak and rhododendron forests with opening views of Dronagiri to reach Tali forest campsite (3,350m).",
                                                                    "elevationMeters": 3350,
                                                                    "distanceKm": 5
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Tali to Kuari Pass & Return to Tali",
                                                                    "description": "Summit day: Climb along the high ridge to Kuari Pass (3,876m) for a 360-degree panorama of Nanda Devi and Kamet. Descend to Tali.",
                                                                    "elevationMeters": 3876,
                                                                    "distanceKm": 12
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Tali to Auli via Gorson Bugyal",
                                                                    "description": "Trek through the expansive alpine meadows of Gorson Bugyal to Auli (2,800m), followed by drive to Joshimath.",
                                                                    "elevationMeters": 2800,
                                                                    "distanceKm": 8
                                                          },
                                                          {
                                                                    "day": 6,
                                                                    "title": "Joshimath to Rishikesh",
                                                                    "description": "Drive back along the river valleys to Rishikesh.",
                                                                    "elevationMeters": 372,
                                                                    "distanceKm": 255
                                                          }
                                                ],
                                                "packingList": [
                                                          "Trekking shoes with solid ankle support and vibram grip",
                                                          "4-season down jacket rated to -10°C (campsites get sub-zero at night)",
                                                          "UV 400 polarized sunglasses (essential for pass glare)",
                                                          "Thermal base layers (merino wool)",
                                                          "Trekking poles and headlamp"
                                                ],
                                                "tips": [
                                                          "Kuari Pass is an exceptional winter snow trek from December to March, with campsites surrounded by pristine snow blankets.",
                                                          "Camp at Tali forest clearing for sheltered pitches and spectacular sunrise views of Mount Dronagiri."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Why is Kuari Pass called the Curzon Trail?",
                                                                    "answer": "Lord Curzon, the British Viceroy of India, explored and popularized this route in 1905, establishing it as a premier alpine trail."
                                                          },
                                                          {
                                                                    "question": "Is Kuari Pass suitable for first-time trekkers?",
                                                                    "answer": "Yes, its moderate gradients, well-defined paths, and gradual altitude gain make it one of the best Himalayan entry treks for fit beginners."
                                                          }
                                                ],
                                                "seoTitle": "Kuari Pass Trek (3,876m), Chamoli — Curzon Trail & Nanda Devi Panoramas",
                                                "seoDescription": "Complete guide to Kuari Pass Trek (3,876m) in Chamoli, Garhwal. 6-day Curzon Trail itinerary, front-row Nanda Devi views, Gorson Bugyal, winter snow advice, and maps.",
                                                "keywords": [
                                                          "Kuari Pass trek",
                                                          "Curzon Trail Uttarakhand",
                                                          "Kuari Pass altitude",
                                                          "Nanda Devi view trek",
                                                          "winter snow trek Kuari Pass",
                                                          "Joshimath to Kuari Pass"
                                                ]
                                      },
                                      {
                                                "id": "urgam-valley",
                                                "name": "Urgam Valley & Kalpeshwar Mahadev",
                                                "type": "spiritual",
                                                "emoji": "🌿",
                                                "coords": [
                                                          30.585,
                                                          79.489
                                                ],
                                                "elevation": "2,200 m",
                                                "bestSeason": "Year-round (Best: March to November)",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "A lush, tranquil emerald bowl secluded between Joshimath and Helang in Chamoli district, Urgam Valley is renowned for stepped terrace fields, traditional slate-roofed Garhwali hamlets, and Kalpeshwar Mahadev. Kalpeshwar is the fifth and only Panch Kedar temple accessible year-round, where the Jata (matted hair locks) of Lord Shiva are venerated inside a natural stone cave.",
                                                "experience": "Sitting in profound silence inside the rock cave of Kalpeshwar as sacred water drips from mossy boulders and temple bells resonate through the peaceful apple valley.",
                                                "tips": [
                                                          "Taste fresh organic apples, apricots, and rajma beans grown organically by local families in Urgam village homestays.",
                                                          "Urgam is also the launching trailhead for the remote trans-bugyal trek across Dumak and Panar meadows to Rudranath."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Why is Kalpeshwar the only Panch Kedar open in winter?",
                                                                    "answer": "Located at a relatively lower altitude of 2,200 meters in the sheltered Urgam Valley, it does not receive the heavy snowpack that seals Kedarnath, Tungnath, or Madhyamaheshwar."
                                                          },
                                                          {
                                                                    "question": "How do you reach Urgam Valley?",
                                                                    "answer": "A paved motorable mountain road branches off from Helang on NH7, climbing 9 km up into the Urgam Valley."
                                                          }
                                                ],
                                                "seoTitle": "Urgam Valley & Kalpeshwar (2,200m), Chamoli — Fifth Panch Kedar Guide",
                                                "seoDescription": "Explore Urgam Valley (2,200m) in Chamoli, Uttarakhand. Kalpeshwar Mahadev temple (Panch Kedar open in winter), apple orchards, rural homestays, and trails.",
                                                "keywords": [
                                                          "Urgam Valley Chamoli",
                                                          "Kalpeshwar Mahadev",
                                                          "Panch Kedar winter temple",
                                                          "Urgam valley altitude",
                                                          "Helang to Urgam road",
                                                          "Kalpeshwar trek"
                                                ]
                                      },
                                      {
                                                "id": "satopanth-tal-trek",
                                                "name": "Satopanth Tal Glacial Lake Trek",
                                                "type": "trek",
                                                "emoji": "🔺",
                                                "coords": [
                                                          30.745,
                                                          79.355
                                                ],
                                                "elevation": "4,600 m",
                                                "bestSeason": "May to June, September to mid-October",
                                                "difficulty": "Difficult",
                                                "duration": "5–6 Days",
                                                "distance": "44 km",
                                                "overview": "A sacred and strenuous high-altitude glacial expedition venturing into the untamed wilderness beyond Mana Village and Badrinath. Satopanth Tal is an emerald triangular lake of crystal-clear water sitting at 4,600m beneath the colossal glaciated amphitheater of Chaukhamba I (7,138m), Nilkantha, and Swargarohini peaks. Revered in Hindu cosmology, the three corners of the lake are the sacred meditation thrones of Brahma, Vishnu, and Maheshwar. According to the Mahabharata, the Pandavas crossed this lake to climb the stairway of Swargarohini glacier toward heaven.",
                                                "routeDescription": "Starts from Mana village (3,200m), traverses past Vasudhara Falls to Laxmiban (3,600m) amidst ancient bhojpatra birch groves, navigates glacial moraine to Chakratirtha (4,250m), and follows knife-edge moraine ridges to the shores of Satopanth Tal (4,600m).",
                                                "experience": "Sitting silently at the water's edge of the emerald triangular tarn as the titanic 7,000-meter north face of Chaukhamba reflects perfectly upon the mirror-still surface.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Mana Village to Laxmiban",
                                                                    "description": "Begin trekking from Mana village (3,200m), hike past the roaring drop of Vasudhara Falls (122m), and follow the Alaknanda riverbed to the birch groves of Laxmiban (3,600m).",
                                                                    "elevationMeters": 3600,
                                                                    "distanceKm": 9
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Laxmiban to Chakratirtha",
                                                                    "description": "Trek through fields of alpine wildflowers and treacherous boulder moraines to Chakratirtha (4,250m), an alpine meadow surrounded by glaciated peaks.",
                                                                    "elevationMeters": 4250,
                                                                    "distanceKm": 10
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Chakratirtha to Satopanth Tal & Swargarohini Base",
                                                                    "description": "Navigate sharp knife-edge glacial moraines and boulder fields to reach the triangular emerald waters of Satopanth Tal (4,600m). Explore the lake perimeter and view Swargarohini glacier.",
                                                                    "elevationMeters": 4600,
                                                                    "distanceKm": 5
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Satopanth Tal to Laxmiban",
                                                                    "description": "Descend carefully along the moraine ridges past Chakratirtha and down to the campsite at Laxmiban (3,600m).",
                                                                    "elevationMeters": 3600,
                                                                    "distanceKm": 15
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Laxmiban to Mana & Badrinath",
                                                                    "description": "Retrace steps past Vasudhara Falls and Bhim Pul back to Mana village (3,200m), followed by a short vehicle drive to Badrinath Dham.",
                                                                    "elevationMeters": 3133,
                                                                    "distanceKm": 9
                                                          }
                                                ],
                                                "packingList": [
                                                          "Technical high-ankle waterproof trekking boots with stiff soles for sharp glacial moraine",
                                                          "Heavy sub-zero expedition down jacket and windproof hardshell trousers",
                                                          "Trekking poles with hard tungsten tips for boulder balancing",
                                                          "Water purification tablets and high-calorie energy bars",
                                                          "Thermal base layers and insulated fleece gloves"
                                                ],
                                                "tips": [
                                                          "The trail past Vasudhara traverses active boulder scree and glacial moraines with zero marked pathways; hiring an experienced local guide from Badrinath/Mana is strictly mandatory.",
                                                          "Trekkers must carry all camping equipment and food supplies as there are zero habitations, tea stalls, or shelter huts beyond Mana village."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is the mythological significance of the triangular shape of Satopanth Tal?",
                                                                    "answer": "According to ancient belief, each corner of the equilateral triangular lake represents one of the holy Trinity—Lord Brahma, Lord Vishnu, and Lord Shiva—who are believed to meditate at their respective corners on auspicious days."
                                                          },
                                                          {
                                                                    "question": "Where is Swargarohini located in relation to Satopanth Tal?",
                                                                    "answer": "Swargarohini (6,252m) and its staircase-like glacier rise directly behind Satopanth Tal, believed to be the stairway to heaven where Yudhishthira and the faithful dog ascended."
                                                          }
                                                ],
                                                "seoTitle": "Satopanth Tal Trek (4,600m), Chamoli — Holy Triangular Glacial Lake Guide",
                                                "seoDescription": "Complete guide to Satopanth Tal Trek (4,600m) beyond Mana & Badrinath in Chamoli, Garhwal. 5-day itinerary, Chaukhamba & Swargarohini views, maps, and safety advice.",
                                                "keywords": [
                                                          "Satopanth Tal trek",
                                                          "holy triangular lake",
                                                          "Satopanth lake altitude",
                                                          "Mana village to Satopanth",
                                                          "Chaukhamba reflection",
                                                          "Swargarohini glacier",
                                                          "Badrinath alpine trek"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "rudraprayag",
                            "name": "Rudraprayag",
                            "tagline": "Sacred Panch Kedar shrines, high alpine tarns, and the Mandakini river canyon",
                            "division": "Garhwal",
                            "places": [
                                      {
                                                "id": "kedarnath",
                                                "name": "Kedarnath Temple & Trail",
                                                "type": "spiritual",
                                                "emoji": "🛕",
                                                "coords": [
                                                          30.735,
                                                          79.066
                                                ],
                                                "elevation": "3,583 m",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Moderate to Difficult",
                                                "duration": "2–3 Days (16 km climb)",
                                                "overview": "The most revered of the twelve Jyotirlingas and the foremost among the Panch Kedar, Kedarnath is nestled at the head of the Mandakini river valley at 3,583m. Backed by the immense glaciated wall of Mount Kedarnath (6,940m) and Kedar Dome, the ancient grey-stone temple was consecrated by Adi Shankaracharya and has withstood earthquakes, avalanches, and the test of millennia.",
                                                "routeDescription": "The 16 km climb begins from Gaurikund, crossing the Mandakini River at Jungle Chatti, climbing via Bheembali and Lincholi, and ascending to the Kedarnath temple plateau.",
                                                "experience": "The thunder of evening temple bells echoing off the towering, glaciated north face of Mount Kedarnath while thousands of brass butter lamps flicker in sub-zero dusk.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Sonprayag to Gaurikund, Trek to Kedarnath",
                                                                    "description": "Take a shared taxi to Gaurikund (1,982m) and begin the steep 16 km uphill climb via Lincholi. Arrive at Kedarnath plateau (3,583m) by evening.",
                                                                    "elevationMeters": 3583,
                                                                    "distanceKm": 16
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Kedarnath Darshan and Trek to Gaurikund",
                                                                    "description": "Attend early morning Maha Abhishek Puja. Enjoy views of Kedar Dome before descending 16 km back to Gaurikund and Sonprayag.",
                                                                    "elevationMeters": 1982,
                                                                    "distanceKm": 16
                                                          }
                                                ],
                                                "packingList": [
                                                          "Heavy thermal fleece and windproof down jacket (sub-zero night temperatures)",
                                                          "Waterproof raincoat or sturdy poncho",
                                                          "Comfortable trekking shoes with strong grip",
                                                          "Basic first-aid kit and altitude medication (Diamox)"
                                                ],
                                                "tips": [
                                                          "Biometric registration (online or at Sonprayag) is mandatory for all pilgrims and trekkers.",
                                                          "Helicopter shuttle services operate from Guptkashi, Phata, and Sersi directly to the Kedarnath helipad for elderly travelers."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How long does it take to walk from Gaurikund to Kedarnath?",
                                                                    "answer": "The 16 km steep climb typically takes 6 to 8 hours on foot depending on physical fitness and acclimatization."
                                                          },
                                                          {
                                                                    "question": "What is the winter seat of Kedarnath?",
                                                                    "answer": "During the 6-month winter closure, the symbolic idol of Lord Kedarnath is worshipped at the Omkareshwar Temple in Ukhimath."
                                                          }
                                                ],
                                                "seoTitle": "Kedarnath Temple (3,583m), Rudraprayag — Trail Itinerary & Jyotirlinga Guide",
                                                "seoDescription": "Complete guide to Kedarnath Temple (3,583m) in Rudraprayag, Garhwal. 16km trek route from Gaurikund, biometric registration, Kedar Dome, and opening dates.",
                                                "keywords": [
                                                          "Kedarnath Temple Rudraprayag",
                                                          "Kedarnath trek distance",
                                                          "Kedarnath altitude",
                                                          "Gaurikund to Kedarnath",
                                                          "Kedarnath opening dates",
                                                          "Char Dham Kedarnath"
                                                ]
                                      },
                                      {
                                                "id": "chopta-tungnath",
                                                "name": "Chopta, Tungnath & Chandrashila",
                                                "type": "trek",
                                                "emoji": "🥾",
                                                "coords": [
                                                          30.488,
                                                          79.217
                                                ],
                                                "elevation": "4,000 m (Chandrashila Summit)",
                                                "bestSeason": "March to December (Snow in Jan-Feb)",
                                                "difficulty": "Easy to Moderate",
                                                "duration": "2 Days",
                                                "distance": "10 km",
                                                "overview": "A classic summit trek starting from the pristine rolling meadows of Chopta (known as the 'Mini Switzerland of Uttarakhand'). The well-paved trail climbs through thick rhododendron and scarlet oak forests to Tungnath—the highest Shiva temple in the world at 3,680 meters—and pushes 1.5 km further up a rocky ridge to Chandrashila summit (4,000m) for a stunning 360-degree vista of Nanda Devi, Trishul, and Chaukhamba.",
                                                "routeDescription": "Starts at Chopta roadhead (2,680m), climbs 3.5 km on paved switchbacks to Tungnath temple (3,680m), and ascends a rocky trail 1.5 km to Chandrashila summit peak (4,000m).",
                                                "experience": "Standing on the windswept summit of Chandrashila at sunrise with the Chaukhamba four-pillar massif glowing crimson red across a sea of mountain clouds.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Arrive Chopta, Acclimatization Hike",
                                                                    "description": "Arrive at the alpine meadows of Chopta (2,680m). Evening acclimatization walk through rhododendron groves. Overnight camp.",
                                                                    "elevationMeters": 2680,
                                                                    "distanceKm": 4
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Chopta to Tungnath & Chandrashila Summit",
                                                                    "description": "Pre-dawn climb to Tungnath temple (3,680m) and summit push to Chandrashila (4,000m) for 360° mountain sunrise. Descend to Chopta.",
                                                                    "elevationMeters": 4000,
                                                                    "distanceKm": 10
                                                          }
                                                ],
                                                "packingList": [
                                                          "Warm windbreaker shell and fleece layer",
                                                          "Sturdy trekking shoes with good traction",
                                                          "Trekking poles (helpful for the descent)",
                                                          "UV sunglasses and sunscreen"
                                                ],
                                                "tips": [
                                                          "Start your summit climb from Chopta by 4:00 AM to catch the unforgettable Himalayan sunrise from Chandrashila peak.",
                                                          "Visit in April and May when the rhododendron forests along the Tungnath trail burst into vivid scarlet and pink blooms."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Is Tungnath Temple the highest Shiva temple in the world?",
                                                                    "answer": "Yes, standing at 3,680 meters (12,073 ft), Tungnath is the highest of the five Panch Kedar temples and the highest Shiva temple on Earth."
                                                          },
                                                          {
                                                                    "question": "Can Tungnath and Chandrashila be visited in winter?",
                                                                    "answer": "Yes, Chopta becomes a premier winter snow trek in January and February; microspikes and gaiters are recommended for snow on the upper trail."
                                                          }
                                                ],
                                                "seoTitle": "Chopta Tungnath Chandrashila Trek (4,000m) — Highest Shiva Temple Guide",
                                                "seoDescription": "Guide to Chopta, Tungnath (3,680m), and Chandrashila Summit (4,000m) in Rudraprayag. World's highest Shiva temple, 360° Nanda Devi sunrise, and snow trek advice.",
                                                "keywords": [
                                                          "Chopta Tungnath trek",
                                                          "Chandrashila summit altitude",
                                                          "highest Shiva temple in the world",
                                                          "Chopta mini Switzerland",
                                                          "Tungnath trek distance",
                                                          "Chopta winter trek"
                                                ]
                                      },
                                      {
                                                "id": "deoria-tal",
                                                "name": "Deoria Tal Emerald Lake & Sari",
                                                "type": "trek",
                                                "emoji": "🌲",
                                                "coords": [
                                                          30.521,
                                                          79.128
                                                ],
                                                "elevation": "2,438 m",
                                                "bestSeason": "Year-round (Best: March to June, October to December)",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "distance": "6 km return",
                                                "overview": "A crystalline freshwater alpine lake sitting at 2,438m surrounded by dense rhododendron and oak forests in Rudraprayag district. Famed for its mirror-like reflection of the snow-clad Chaukhamba massif on clear mornings, it is associated with the Yaksha Prashna legend from the Mahabharata. The 3 km uphill cobblestone trail starts from the picturesque village of Sari.",
                                                "routeDescription": "Begins from Sari village (2,000m), ascending 3 km through terraced farms and oak forests to the grassy perimeter of Deoria Tal lake.",
                                                "experience": "Watching the mirror reflection of Mount Chaukhamba's four glaciated summits shimmering across the emerald water of Deoria Tal in early morning stillness.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Sari Village to Deoria Tal",
                                                                    "description": "Climb 3 km from Sari village (2,000m) on a paved forest path to Deoria Tal (2,438m). Camp beside the lake with Chaukhamba views.",
                                                                    "elevationMeters": 2438,
                                                                    "distanceKm": 3
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Lake Exploration & Descent",
                                                                    "description": "Morning birdwatching and reflection photography along the forest watchtower. Descend 3 km back to Sari village.",
                                                                    "elevationMeters": 2000,
                                                                    "distanceKm": 3
                                                          }
                                                ],
                                                "packingList": [
                                                          "Comfortable walking or trail shoes",
                                                          "Light warm fleece (chilly evenings near the lake)",
                                                          "Binoculars for Himalayan birdwatching",
                                                          "Refillable water bottle"
                                                ],
                                                "tips": [
                                                          "Camp at the designated camping zones outside the immediate lake boundary to help preserve the fragile aquatic ecosystem.",
                                                          "Combine Deoria Tal with Chopta and Tungnath for a complete 3-day Garhwal Himalayan circuit."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How long does it take to hike to Deoria Tal from Sari?",
                                                                    "answer": "The 3 km trail is well-paved and takes about 1.5 to 2 hours at a leisurely pace, making it ideal for families and beginners."
                                                          },
                                                          {
                                                                    "question": "What is the mythological importance of Deoria Tal?",
                                                                    "answer": "According to Hindu mythology, this was the lake where the Yaksha tested the Pandava brothers with philosophical riddles during their exile."
                                                          }
                                                ],
                                                "seoTitle": "Deoria Tal Trek (2,438m), Rudraprayag — Sari Village & Chaukhamba Reflection",
                                                "seoDescription": "Guide to Deoria Tal Trek (2,438m) in Rudraprayag, Uttarakhand. Mirror reflection of Chaukhamba peaks, Sari village homestays, camping, birdwatching, and trail guide.",
                                                "keywords": [
                                                          "Deoria Tal trek",
                                                          "Sari to Deoria Tal distance",
                                                          "Deoria Tal altitude",
                                                          "Chaukhamba reflection lake",
                                                          "Rudraprayag easy treks",
                                                          "Chopta to Deoria Tal"
                                                ]
                                      },
                                      {
                                                "id": "madhyamaheshwar",
                                                "name": "Madhyamaheshwar Temple & Trek",
                                                "type": "trek",
                                                "emoji": "🛕",
                                                "coords": [
                                                          30.637,
                                                          79.218
                                                ],
                                                "elevation": "3,497 m",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Moderate to Difficult",
                                                "duration": "4 Days",
                                                "distance": "32 km return",
                                                "overview": "The second temple in the sacred Panch Kedar pilgrimage circuit, Madhyamaheshwar is nestled in a lush alpine meadow directly beneath the Chaukhamba massif. At this ancient stone temple, Lord Shiva's navel (nabhi) is worshipped. The trail winds from Ransi village through deep river canyons, lush oak-and-rhododendron woodlands, and remote shepherd settlements, with a stunning ridge hike up to Buda Madhyamaheshwar.",
                                                "routeDescription": "Starts at Ransi village, descends to Gaundhar at the confluence of Madhyamaheshwar Ganga and Markanga Ganga, then climbs steeply via Bantoli and Khatara to the meadow of Madhyamaheshwar (3,497m).",
                                                "experience": "The awe-inspiring view from Buda Madhyamaheshwar ridge where Chaukhamba and Mandani peaks rise so close they feel within arm's reach across high alpine pastures.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Ukhimath to Ransi, Trek to Gaundhar",
                                                                    "description": "Drive to Ransi village (2,000m) and trek 6 km downhill and along the river to Gaundhar village (1,750m).",
                                                                    "elevationMeters": 1750,
                                                                    "distanceKm": 6
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Gaundhar to Madhyamaheshwar",
                                                                    "description": "Steep 10 km ascent through Bantoli and dense oak forests to the high alpine meadow of Madhyamaheshwar (3,497m).",
                                                                    "elevationMeters": 3497,
                                                                    "distanceKm": 10
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Hike to Buda Madhyamaheshwar & Descent to Bantoli",
                                                                    "description": "Early morning 2 km ridge hike to Buda Madhyamaheshwar (3,700m) for Chaukhamba reflections. Descend to Bantoli/Gaundhar.",
                                                                    "elevationMeters": 3700,
                                                                    "distanceKm": 12
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Gaundhar to Ransi & Drive",
                                                                    "description": "Trek 6 km back to Ransi village roadhead, then drive to Ukhimath or Rudraprayag.",
                                                                    "elevationMeters": 2000,
                                                                    "distanceKm": 6
                                                          }
                                                ],
                                                "packingList": [
                                                          "Trekking shoes with ankle support and vibram sole",
                                                          "Warm fleece and down jacket for chilly meadow nights",
                                                          "Rain poncho and backpack rain cover",
                                                          "Trekking poles"
                                                ],
                                                "tips": [
                                                          "Do not miss the 2 km early-morning climb from the temple to Buda Madhyamaheshwar (3,700m), where mirror ponds reflect the glaciated Chaukhamba massif.",
                                                          "Ransi is accessible by taxi from Ukhimath, which serves as the primary base camp town."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How difficult is the Madhyamaheshwar trek?",
                                                                    "answer": "It is moderately difficult; the section from Bantoli to Madhyamaheshwar involves a continuous steep climb of 1,700 vertical meters over 8 km."
                                                          },
                                                          {
                                                                    "question": "What part of Lord Shiva is worshipped at Madhyamaheshwar?",
                                                                    "answer": "According to the Panch Kedar legend, the navel (nabhi) and stomach of Lord Shiva appeared at Madhyamaheshwar."
                                                          }
                                                ],
                                                "seoTitle": "Madhyamaheshwar Trek (3,497m), Rudraprayag — Second Panch Kedar Guide",
                                                "seoDescription": "Complete guide to Madhyamaheshwar Trek (3,497m) in Rudraprayag, Garhwal. Second Panch Kedar, 4-day itinerary from Ransi, Buda Madhyamaheshwar, and Chaukhamba views.",
                                                "keywords": [
                                                          "Madhyamaheshwar trek",
                                                          "Second Panch Kedar",
                                                          "Ransi to Madhyamaheshwar",
                                                          "Madhyamaheshwar altitude",
                                                          "Buda Madhyamaheshwar ridge",
                                                          "Rudraprayag pilgrimage treks"
                                                ]
                                      },
                                      {
                                                "id": "gaurikund",
                                                "name": "Gaurikund Thermal Springs & Trailhead",
                                                "type": "spiritual",
                                                "emoji": "♨️",
                                                "coords": [
                                                          30.654,
                                                          79.025
                                                ],
                                                "elevation": "1,982 m",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Easy",
                                                "duration": "Trailhead / Half Day",
                                                "overview": "Perched along the rushing Mandakini River in Rudraprayag, Gaurikund is the sacred roadhead and trailhead for the 16 km climb to Kedarnath. Named after Goddess Parvati (Gauri) who performed rigorous spiritual penance here to win Lord Shiva as her consort, it features the historic Gauri Mata Temple and natural geothermal sulphur springs.",
                                                "experience": "The steam rising from geothermal sulphur baths into crisp mountain air as pilgrims prepare walking sticks for the trek to Kedarnath.",
                                                "tips": [
                                                          "Vehicles must be parked at the Sonprayag transport terminal; authorized shared green taxis transfer pilgrims the final 5 km to Gaurikund.",
                                                          "Book pony and palanquin tokens at the official counter in Gaurikund to avoid unregulated rates."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How do you reach Gaurikund from Sonprayag?",
                                                                    "answer": "Authorized shared shuttle taxis run continuously between Sonprayag and Gaurikund (5 km drive, ~15 minutes)."
                                                          },
                                                          {
                                                                    "question": "Are there hot springs in Gaurikund?",
                                                                    "answer": "Yes, Gaurikund is famous for natural geothermal springs, although the pool structure was redeveloped following the 2013 flash floods."
                                                          }
                                                ],
                                                "seoTitle": "Gaurikund (1,982m), Rudraprayag — Kedarnath Trek Trailhead & Hot Springs",
                                                "seoDescription": "Visitor guide to Gaurikund (1,982m) in Rudraprayag, Uttarakhand. Starting point for Kedarnath trek, natural thermal springs, Gauri Mata temple, and shared taxi advice.",
                                                "keywords": [
                                                          "Gaurikund Kedarnath",
                                                          "Gaurikund starting point",
                                                          "Sonprayag to Gaurikund",
                                                          "Gaurikund altitude",
                                                          "Gaurikund hot water spring",
                                                          "Kedarnath pony booking"
                                                ]
                                      },
                                      {
                                                "id": "triyuginarayan",
                                                "name": "Triyuginarayan Akhand Dhuni Temple",
                                                "type": "spiritual",
                                                "emoji": "🔥",
                                                "coords": [
                                                          30.643,
                                                          78.983
                                                ],
                                                "elevation": "1,980 m",
                                                "bestSeason": "Year-round (Best: April to November)",
                                                "difficulty": "Easy",
                                                "duration": "Half Day",
                                                "overview": "A revered ancient stone temple perched on a mountain ridge near Sonprayag, Triyuginarayan is celebrated as the celestial wedding site of Lord Shiva and Goddess Parvati, witnessed by Lord Vishnu who acted as Parvati's brother. The temple is famed for its Akhand Dhuni—an eternal sacred fire in front of the sanctum that has burned continuously for three cosmic epochs (Yugas).",
                                                "experience": "Offering wood logs to the sacred Akhand Dhuni flame whose embers have burned continuously across cosmic ages in a serene stone courtyard.",
                                                "tips": [
                                                          "Devotees traditionally offer wood samidha (logs) to the holy fire and collect sacred ash (bhasma) as a blessing for marital harmony.",
                                                          "Visit the four holy kunds around the temple courtyard: Rudra Kund, Vishnu Kund, Brahma Kund, and Saraswati Kund."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How far is Triyuginarayan from Sonprayag?",
                                                                    "answer": "Triyuginarayan is located about 12 kilometers uphill from Sonprayag by paved road, easily reachable by local taxi in 30 minutes."
                                                          },
                                                          {
                                                                    "question": "Can weddings be performed at Triyuginarayan Temple?",
                                                                    "answer": "Yes, Triyuginarayan has become one of India's most sought-after sacred wedding destinations, where couples marry before the eternal flame."
                                                          }
                                                ],
                                                "seoTitle": "Triyuginarayan Temple (1,980m), Rudraprayag — Eternal Wedding Flame Guide",
                                                "seoDescription": "Discover Triyuginarayan Temple (1,980m) in Rudraprayag, Uttarakhand. Legendary wedding site of Shiva and Parvati, Akhand Dhuni eternal flame, kunds, and travel tips.",
                                                "keywords": [
                                                          "Triyuginarayan temple",
                                                          "Shiva Parvati wedding site",
                                                          "Akhand Dhuni flame",
                                                          "Triyuginarayan altitude",
                                                          "temples near Kedarnath",
                                                          "Rudraprayag spiritual destinations"
                                                ]
                                      },
                                      {
                                                "id": "rudraprayag-town",
                                                "name": "Rudraprayag Sangam (Alaknanda & Mandakini)",
                                                "type": "spiritual",
                                                "emoji": "🌊",
                                                "coords": [
                                                          30.285,
                                                          78.981
                                                ],
                                                "elevation": "895 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "1 Day",
                                                "overview": "One of the sacred Panch Prayag (five holy confluences) of the Garhwal Himalayas, Rudraprayag marks the dramatic confluence where the roaring emerald waters of the Alaknanda River meet the torrential rapids of the Mandakini River. Named after Lord Shiva (Rudra) who performed the celestial Tandava here, the town serves as the primary gateway bifurcation heading north toward Kedarnath and northeast toward Badrinath.",
                                                "experience": "Standing on the stone ghats of the sangam watching the distinct emerald Alaknanda waters merge with the turquoise Mandakini rapids under ancient temples.",
                                                "tips": [
                                                          "Visit the ancient Rudranath and Chamunda Devi temples situated directly above the river confluence ghats.",
                                                          "Rudraprayag is the main junction for refuelling, mechanics, and lodging before proceeding deeper into the Kedarnath or Badrinath corridors."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What rivers meet at Rudraprayag?",
                                                                    "answer": "The Alaknanda River (flowing from Badrinath) and the Mandakini River (flowing from Kedarnath) merge at Rudraprayag."
                                                          },
                                                          {
                                                                    "question": "What is the historical connection with Jim Corbett?",
                                                                    "answer": "Rudraprayag is where Jim Corbett hunted the infamous man-eating Leopard of Rudraprayag in 1925, marked by a memorial pillar on the highway."
                                                          }
                                                ],
                                                "seoTitle": "Rudraprayag Sangam (895m) — Alaknanda & Mandakini Confluence Guide",
                                                "seoDescription": "Explore Rudraprayag town (895m) in Garhwal. Sacred Panch Prayag confluence of Alaknanda and Mandakini rivers, Rudranath temple, crossroads to Kedarnath & Badrinath.",
                                                "keywords": [
                                                          "Rudraprayag sangam",
                                                          "Panch Prayag Uttarakhand",
                                                          "Alaknanda Mandakini confluence",
                                                          "Rudraprayag town altitude",
                                                          "Rudraprayag to Kedarnath road",
                                                          "Rudraprayag hotels"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "uttarkashi",
                            "name": "Uttarkashi",
                            "tagline": "Holy river origins, glaciated tapovans, and vast highland bugyals",
                            "division": "Garhwal",
                            "places": [
                                      {
                                                "id": "gangotri",
                                                "name": "Gangotri Temple & Bhagirathi Canyon",
                                                "type": "spiritual",
                                                "emoji": "🛕",
                                                "coords": [
                                                          30.9947,
                                                          78.9398
                                                ],
                                                "elevation": "3,100 m",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "The venerated seat of Goddess Ganga and one of the four cardinal Char Dham pilgrimage shrines. Perched at 3,100m on the granite banks of the roaring Bhagirathi River in Uttarkashi district, the white marble temple was constructed in the 18th century by Gorkha commander Amar Singh Thapa. Key sacred landmarks include the Bhagirath Shila (the granite slab where King Bhagiratha meditated to bring Ganga to Earth), the natural submerged rock Shivalinga visible in winter, the thunderous granite gorge of Surya Kund waterfall, and the ancient Pandava Gufa.",
                                                "experience": "Standing at the edge of the granite gorge as the crystal turquoise Bhagirathi crashes into Surya Kund with deafening roar, surrounded by deodar trees and snow peaks.",
                                                "tips": [
                                                          "Participate in the morning Ganga Aarti at 6:00 AM on the ghats below the temple for an inspiring and serene spiritual experience.",
                                                          "Hike 1.5 km upstream along the forest trail to Pandava Gufa, where the Pandava brothers meditated during their Himalayan journey."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "When does Gangotri Temple open and close each year?",
                                                                    "answer": "Gangotri opens on the auspicious day of Akshaya Tritiya (late April or early May) and closes on Diwali in November, with the idol moving to Mukhba village for winter worship."
                                                          },
                                                          {
                                                                    "question": "Can you reach Gangotri by road?",
                                                                    "answer": "Yes, Gangotri is connected by the well-paved all-weather highway NH34, approximately 100 km from Uttarkashi town."
                                                          }
                                                ],
                                                "seoTitle": "Gangotri Temple & Town (3,100m), Uttarkashi — Char Dham Shrine & Gorge Guide",
                                                "seoDescription": "Complete guide to Gangotri Temple (3,100m) in Uttarkashi, Uttarakhand. Char Dham seat of Ganga, Surya Kund waterfall, Bhagirath Shila, opening dates, and travel advice.",
                                                "keywords": [
                                                          "Gangotri Temple Uttarkashi",
                                                          "Char Dham Gangotri",
                                                          "Gangotri altitude",
                                                          "Surya Kund Gangotri",
                                                          "Bhagirath Shila",
                                                          "Uttarkashi to Gangotri road",
                                                          "Gangotri opening dates"
                                                ]
                                      },
                                      {
                                                "id": "uttarkashi-town",
                                                "name": "Uttarkashi Town & Kashi Vishwanath",
                                                "type": "spiritual",
                                                "emoji": "🏛️",
                                                "coords": [
                                                          30.7268,
                                                          78.4354
                                                ],
                                                "elevation": "1,158 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "Often called 'Varanasi of the North', Uttarkashi is the cultural, spiritual, and mountaineering capital of Garhwal nestled along the Bhagirathi River. Revered for the ancient Kashi Vishwanath Temple featuring the legendary 26-foot Shakti Trishul forged of divine copper-iron alloy that vibrates when touched by a single finger. The town is also the home of India's premier mountaineering academy, the Nehru Institute of Mountaineering (NIM).",
                                                "experience": "Ringing the brass temple bells of Kashi Vishwanath as the dusk aarti begins, while the Bhagirathi flows rapidly through the valley floor.",
                                                "tips": [
                                                          "Touch the ancient Shakti Trishul in the Shakti temple opposite the main Vishwanath sanctum; it is deeply revered for its mysterious resonant vibration.",
                                                          "Visit the Nehru Institute of Mountaineering (NIM) campus and climbing museum for fascinating archives on Indian Himalayan exploration."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Why is Uttarkashi called Kashi of the North?",
                                                                    "answer": "Like Varanasi (Kashi), Uttarkashi sits on the banks of the sacred Ganga (Bhagirathi) between two rivers (Varuna and Asi) and features an ancient Kashi Vishwanath Shiva temple."
                                                          },
                                                          {
                                                                    "question": "Where is NIM located in Uttarkashi?",
                                                                    "answer": "The Nehru Institute of Mountaineering is located across the suspension bridge in Ladari, about 4 km from the main bus stand."
                                                          }
                                                ],
                                                "seoTitle": "Uttarkashi Town & Kashi Vishwanath (1,158m) — Spiritual & NIM Capital Guide",
                                                "seoDescription": "Guide to Uttarkashi town in Garhwal. Ancient Kashi Vishwanath Temple, the vibrating Shakti Trishul, NIM mountaineering museum, and Bhagirathi ghats.",
                                                "keywords": [
                                                          "Uttarkashi town",
                                                          "Kashi Vishwanath Uttarkashi",
                                                          "Shakti Trishul",
                                                          "NIM mountaineering",
                                                          "Uttarkashi temples",
                                                          "Bhagirathi river town"
                                                ]
                                      },
                                      {
                                                "id": "gangotri-gaumukh",
                                                "name": "Gaumukh Tapovan Trek",
                                                "type": "trek",
                                                "emoji": "🧊",
                                                "coords": [
                                                          30.92,
                                                          79.08
                                                ],
                                                "elevation": "4,463 m (Tapovan) / 4,000 m (Gaumukh)",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Difficult",
                                                "duration": "6–7 Days",
                                                "distance": "46 km",
                                                "overview": "One of the most awe-inspiring glacier expeditions on Earth, the Gaumukh Tapovan trek journeys along the holy Bhagirathi River to Gaumukh—the snout of the 30-km Gangotri Glacier and the true origin of River Ganga. Ascending the steep terminal moraine leads to Tapovan (4,463m), a high-altitude alpine meadow where sadhus meditate directly beneath the sheer 2,000-meter vertical granite spire of Mount Shivling (6,543m) and the Bhagirathi peaks.",
                                                "routeDescription": "Starts from Gangotri temple town (3,100m), hikes 14 km along the river canyon to Bhojwasa (3,792m), crosses Gaumukh glacier snout (4,000m), and scrambles up the steep rocky moraine to the high meadow of Tapovan (4,463m).",
                                                "experience": "Gazing upward from the wildflower meadows of Tapovan as the golden evening sun illuminates the sheer granite fang of Mount Shivling rising two vertical kilometers into the sky.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Dehradun/Rishikesh to Gangotri",
                                                                    "description": "Drive 240 km along the Bhagirathi River through Uttarkashi and Harsil to the sacred temple town of Gangotri (3,100m).",
                                                                    "elevationMeters": 3100,
                                                                    "distanceKm": 240
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Gangotri Acclimatization & Temple Darshan",
                                                                    "description": "Rest and acclimatization day in Gangotri. Visit the white marble Ganga temple and the roaring gorge of Surya Kund.",
                                                                    "elevationMeters": 3100,
                                                                    "distanceKm": 4
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Gangotri to Chirbasa to Bhojwasa",
                                                                    "description": "Enter Gangotri National Park. Trek 14 km through birch (bhojpatra) and pine forests with views of the Bhagirathi peaks to Bhojwasa (3,792m).",
                                                                    "elevationMeters": 3792,
                                                                    "distanceKm": 14
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Bhojwasa to Gaumukh to Tapovan",
                                                                    "description": "Trek 4 km to Gaumukh snout (4,000m), source of the Ganga. Scramble across glacier moraine and climb steeply to Tapovan meadow (4,463m).",
                                                                    "elevationMeters": 4463,
                                                                    "distanceKm": 8
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Tapovan Exploration & Meru Glacier View",
                                                                    "description": "Explore the vast meadows of Tapovan, visit sadhu ashrams, and view Mount Shivling, Meru, and Bhagirathi massifs up close.",
                                                                    "elevationMeters": 4463,
                                                                    "distanceKm": 6
                                                          },
                                                          {
                                                                    "day": 6,
                                                                    "title": "Tapovan to Bhojwasa to Gangotri",
                                                                    "description": "Descend the steep moraine past Gaumukh and trek back through Bhojwasa and Chirbasa to Gangotri (3,100m).",
                                                                    "elevationMeters": 3100,
                                                                    "distanceKm": 18
                                                          }
                                                ],
                                                "packingList": [
                                                          "Sturdy high-ankle trekking shoes with aggressive tread for glacial moraine",
                                                          "Heavy expedition down jacket (-10°C rated) and thermal base layers",
                                                          "Crampons or microspikes (for crossing icy glacier sections)",
                                                          "Trekking poles with snow baskets",
                                                          "UV 400 polarized sunglasses (essential for glacier snow reflection)"
                                                ],
                                                "tips": [
                                                          "Gangotri National Park entry permits are strictly capped at 150 persons per day by the Forest Department; secure permits in advance at Uttarkashi.",
                                                          "The steep boulder scramble from Gaumukh to Tapovan involves navigating loose scree; trek with an experienced local mountain guide."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is Gaumukh?",
                                                                    "answer": "Gaumukh (meaning 'Cow's Mouth') is the snout of the 30-km long Gangotri Glacier, where the holy Bhagirathi River emerges from cavernous ice caves."
                                                          },
                                                          {
                                                                    "question": "Why is Tapovan world-famous among mountaineers?",
                                                                    "answer": "Tapovan is the base camp meadow for climbing Mount Shivling (6,543m), Meru (Shark's Fin), and the Bhagirathi I, II, and III massifs."
                                                          }
                                                ],
                                                "seoTitle": "Gaumukh Tapovan Trek (4,463m) — Source of Ganga & Mount Shivling Guide",
                                                "seoDescription": "Complete guide to Gaumukh Tapovan Trek (4,463m) in Uttarkashi, Uttarakhand. 6-day itinerary to Gangotri Glacier, Mount Shivling base, permits, maps, and advice.",
                                                "keywords": [
                                                          "Gaumukh Tapovan trek",
                                                          "source of Ganga Gaumukh",
                                                          "Mount Shivling Tapovan",
                                                          "Gangotri Glacier trek",
                                                          "Tapovan altitude",
                                                          "Gangotri National Park permit"
                                                ]
                                      },
                                      {
                                                "id": "dayara-bugyal",
                                                "name": "Dayara Bugyal Trek",
                                                "type": "trek",
                                                "emoji": "🌾",
                                                "coords": [
                                                          30.85,
                                                          78.55
                                                ],
                                                "elevation": "3,750 m (Bakaria Top)",
                                                "bestSeason": "Year-round (May-June for velvet greens, Dec-March for pristine snow)",
                                                "difficulty": "Easy to Moderate",
                                                "duration": "5 Days",
                                                "distance": "22 km",
                                                "overview": "Considered by many the most expansive and visually stunning high-altitude alpine meadow (bugyal) in India, Dayara Bugyal spans over 28 square kilometers of rolling grasslands at 3,750m in Uttarkashi. Flanked by ancient oak and maple forests, it opens into an undulating sea of green (or snow in winter) with grand panoramic views of Bandarpoonch (6,316m), Black Peak (Kalanag), Draupadi Ka Danda, and the Gangotri range.",
                                                "routeDescription": "Starts from the picturesque village of Raithal, climbs 4 km through oak forests to Gui camp, ascends to the high meadows of Dayara Bugyal, and reaches the highest ridge viewpoint at Bakaria Top (3,750m).",
                                                "experience": "Walking barefoot across the emerald velvet grasslands of Dayara while the glaciated white massifs of Bandarpoonch and Black Peak dominate the northern horizon.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Dehradun to Raithal",
                                                                    "description": "Drive 220 km along the Bhagirathi River past Uttarkashi to the heritage mountain village of Raithal (2,250m).",
                                                                    "elevationMeters": 2250,
                                                                    "distanceKm": 220
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Raithal to Gui Forest Camp",
                                                                    "description": "Trek 4.5 km through dense oak, rhododendron, and walnut forests to the quaint meadow clearing of Gui (2,900m).",
                                                                    "elevationMeters": 2900,
                                                                    "distanceKm": 4.5
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Gui to Dayara Bugyal",
                                                                    "description": "Climb through the forest canopy to enter the vast expanse of Dayara Bugyal (3,400m). Camp on the meadow fringe.",
                                                                    "elevationMeters": 3400,
                                                                    "distanceKm": 3.5
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Dayara Bugyal to Bakaria Top & Return to Gui",
                                                                    "description": "Ascend to the highest vantage point of Bakaria Top (3,750m) for 360-degree mountain panoramas. Descend to Gui camp.",
                                                                    "elevationMeters": 3750,
                                                                    "distanceKm": 7
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Gui to Raithal & Drive to Dehradun",
                                                                    "description": "Descend 4.5 km back to Raithal village and drive back to Dehradun.",
                                                                    "elevationMeters": 2250,
                                                                    "distanceKm": 4.5
                                                          }
                                                ],
                                                "packingList": [
                                                          "Comfortable trekking shoes with strong ankle support",
                                                          "Layered fleece and windproof outer shell jacket",
                                                          "Sun hat and high-SPF sunscreen (intense meadow UV)",
                                                          "Trekking poles and insulated water bottle"
                                                ],
                                                "tips": [
                                                          "In August, witness the unique traditional 'Butter Festival' (Anduri Utsav) celebrated by local villagers on the meadows of Dayara.",
                                                          "Dayara Bugyal transforms into a world-class winter snowshoeing and beginner ski terrain from late December through February."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Is Dayara Bugyal suitable for beginner trekkers and families?",
                                                                    "answer": "Yes, Dayara Bugyal features gradual ascents, well-shaded forest trails, and short daily distances, making it one of India's finest introductory Himalayan treks."
                                                          },
                                                          {
                                                                    "question": "What does 'Bugyal' mean?",
                                                                    "answer": "In the Garhwali language, 'Bugyal' refers to high-altitude alpine pasturelands or meadows situated between 3,000 and 4,000 meters."
                                                          }
                                                ],
                                                "seoTitle": "Dayara Bugyal Trek (3,750m), Uttarkashi — Alpine Meadow & Bakaria Top Guide",
                                                "seoDescription": "Complete guide to Dayara Bugyal Trek (3,750m) in Uttarkashi, Garhwal. 5-day itinerary from Raithal, 360° Bandarpoonch views, Butter Festival, winter snow, and maps.",
                                                "keywords": [
                                                          "Dayara Bugyal trek",
                                                          "Dayara Bugyal altitude",
                                                          "Raithal to Dayara Bugyal",
                                                          "Bakaria Top viewpoint",
                                                          "meadow treks Uttarakhand",
                                                          "Bandarpoonch view trek"
                                                ]
                                      },
                                      {
                                                "id": "kedarkantha",
                                                "name": "Kedarkantha Summit Trek",
                                                "type": "trek",
                                                "emoji": "❄️",
                                                "coords": [
                                                          31.02,
                                                          78.17
                                                ],
                                                "elevation": "3,800 m",
                                                "bestSeason": "December to April for Winter Snow, May to October for Green Meadows",
                                                "difficulty": "Easy to Moderate",
                                                "duration": "5 Days",
                                                "distance": "20 km",
                                                "overview": "Widely regarded as India's quintessential winter snow trek, Kedarkantha features a picture-perfect pyramid summit rising to 3,800m in the Govind Pashu Vihar National Park. Starting from the charming wooden hamlet of Sankri, the trail winds past pine forests and frozen Juda Ka Talab lake to culminate in a dramatic pre-dawn summit push to a stone trishul shrine with a 360-degree sunrise panorama of thirteen Himalayan ranges.",
                                                "routeDescription": "Begins at Sankri village (1,950m), climbs 4 km through pine forests to the alpine clearing of Juda Ka Talab (2,774m), continues to Kedarkantha Base Camp (3,429m), and makes a pre-dawn summit ascent to Kedarkantha Peak (3,800m).",
                                                "experience": "Standing atop the snow-covered 3,800m peak at sunrise as the first rays strike the stone trishul shrine and illuminate the Swargarohini and Black Peak ranges.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Dehradun to Sankri",
                                                                    "description": "Drive 200 km along the Yamuna and Tons rivers through Mussoorie and Purola to the village base of Sankri (1,950m).",
                                                                    "elevationMeters": 1950,
                                                                    "distanceKm": 200
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Sankri to Juda Ka Talab",
                                                                    "description": "Trek 4 km through dense pine, oak, and maple forests to the picturesque clearing and lake of Juda Ka Talab (2,774m).",
                                                                    "elevationMeters": 2774,
                                                                    "distanceKm": 4
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Juda Ka Talab to Kedarkantha Base Camp",
                                                                    "description": "Climb through oak forest clearings opening into snow meadows at Kedarkantha Base Camp (3,429m) beneath the summit.",
                                                                    "elevationMeters": 3429,
                                                                    "distanceKm": 3
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Summit Push (3,800m) & Descent to Hargaon",
                                                                    "description": "Pre-dawn 3:30 AM summit climb to Kedarkantha Peak (3,800m) for sunrise. Descend via base camp to Hargaon campsite (2,712m).",
                                                                    "elevationMeters": 3800,
                                                                    "distanceKm": 7
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Hargaon to Sankri & Drive to Dehradun",
                                                                    "description": "Descend 6 km through pine forests to Sankri village and board transport back to Dehradun.",
                                                                    "elevationMeters": 1950,
                                                                    "distanceKm": 6
                                                          }
                                                ],
                                                "packingList": [
                                                          "Waterproof high-ankle trekking shoes with deep lugs",
                                                          "Microspikes and waterproof snow gaiters (essential in winter)",
                                                          "Heavy down jacket rated to -10°C, thermal innerwear, and fleece layer",
                                                          "Waterproof gloves (outer shell) and warm fleece gloves (inner)",
                                                          "UV 400 polarized sunglasses (prevents snow blindness)"
                                                ],
                                                "tips": [
                                                          "For the summit push, dress in four layers: base layer, fleece, down jacket, and windproof outer shell to withstand -10°C summit winds.",
                                                          "Keep spare camera and phone batteries inside your inner jacket pockets, as sub-zero cold drains lithium batteries rapidly."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Why is Kedarkantha India's most popular winter trek?",
                                                                    "answer": "It offers guaranteed snow from December to April, clear summit views, beautiful campsites like Juda Ka Talab, and manageable gradients suitable for beginners."
                                                          },
                                                          {
                                                                    "question": "How cold does it get on the Kedarkantha trek in winter?",
                                                                    "answer": "Daytime temperatures range from 5°C to 12°C, while nighttime temperatures at base camp routinely drop to -5°C to -10°C."
                                                          }
                                                ],
                                                "seoTitle": "Kedarkantha Trek (3,800m), Uttarkashi — Winter Snow Summit Itinerary Guide",
                                                "seoDescription": "Complete guide to Kedarkantha Trek (3,800m) in Uttarkashi, Uttarakhand. 5-day winter snow summit itinerary from Sankri, Juda Ka Talab, gear, maps, and season advice.",
                                                "keywords": [
                                                          "Kedarkantha trek",
                                                          "Kedarkantha altitude",
                                                          "winter snow trek Uttarakhand",
                                                          "Sankri to Kedarkantha",
                                                          "Juda Ka Talab lake",
                                                          "Kedarkantha summit sunrise"
                                                ]
                                      },
                                      {
                                                "id": "har-ki-dun",
                                                "name": "Har Ki Dun (Valley of Gods)",
                                                "type": "trek",
                                                "emoji": "🌲",
                                                "coords": [
                                                          31.14,
                                                          78.43
                                                ],
                                                "elevation": "3,566 m",
                                                "bestSeason": "April to June, September to December",
                                                "difficulty": "Moderate",
                                                "duration": "7 Days",
                                                "distance": "47 km",
                                                "overview": "A cradle-shaped hanging amphitheatre valley tucked inside the Govind Pashu Vihar National Park in western Garhwal. Steeped in Mahabharata mythology as the pathway taken by the Pandavas ascending to heaven, Har Ki Dun winds alongside the rushing Supin River through ancient wooden settlements (Osla, Gangaad), dense walnut and pine forests, and opens beneath the colossal glaciated face of Swargarohini (6,252m) and Jaundhar Glacier.",
                                                "routeDescription": "Starts at Sankri, drives to Taluka roadhead, walks along the Supin River through Osla village, camps at Kalkatiyadhar, and explores the high amphitheatre valley of Har Ki Dun and Maninda Tal.",
                                                "experience": "Standing in the silent cradle of Har Ki Dun watching the evening sun set fire to the four glaciated steps of Mount Swargarohini.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Dehradun to Sankri",
                                                                    "description": "Drive 200 km through Mussoorie and the scenic Tons river valley to Sankri (1,950m).",
                                                                    "elevationMeters": 1950,
                                                                    "distanceKm": 200
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Sankri to Taluka & Trek to Pauni Garaat",
                                                                    "description": "Drive to Taluka roadhead, then trek 10 km along the roaring Supin River through walnut groves to Pauni Garaat (2,500m).",
                                                                    "elevationMeters": 2500,
                                                                    "distanceKm": 10
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Pauni Garaat to Kalkatiyadhar",
                                                                    "description": "Trek past the ancient 2,000-year-old carved wooden houses of Osla village to the scenic ridge camp of Kalkatiyadhar (2,950m).",
                                                                    "elevationMeters": 2950,
                                                                    "distanceKm": 7
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Kalkatiyadhar to Har Ki Dun & Exploration",
                                                                    "description": "Trek to the cradle valley of Har Ki Dun (3,566m). Explore the alpine meadows, view Swargarohini and Jaundhar Glacier, return to Kalkatiyadhar.",
                                                                    "elevationMeters": 3566,
                                                                    "distanceKm": 10
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Kalkatiyadhar to Pauni Garaat",
                                                                    "description": "Retrace steps downhill through the Supin valley to Pauni Garaat campsite.",
                                                                    "elevationMeters": 2500,
                                                                    "distanceKm": 7
                                                          },
                                                          {
                                                                    "day": 6,
                                                                    "title": "Pauni Garaat to Taluka & Drive to Sankri",
                                                                    "description": "Trek 10 km back to Taluka, board vehicle to Sankri base camp.",
                                                                    "elevationMeters": 1950,
                                                                    "distanceKm": 10
                                                          },
                                                          {
                                                                    "day": 7,
                                                                    "title": "Sankri to Dehradun",
                                                                    "description": "Return drive from Sankri to Dehradun railway station or airport.",
                                                                    "elevationMeters": 450,
                                                                    "distanceKm": 200
                                                          }
                                                ],
                                                "packingList": [
                                                          "Sturdy trekking boots with good ankle support",
                                                          "Warm fleece layers and down jacket",
                                                          "Waterproof raincoat or poncho",
                                                          "Trekking poles with rubber tips",
                                                          "Personal first-aid kit and hydration bladder"
                                                ],
                                                "tips": [
                                                          "Visit the ancient Someshwar (Duryodhana) wooden temple in Osla village to admire intricate Himalayan woodcarvings.",
                                                          "Extend the trek by an extra day to explore the pristine alpine lake of Maninda Tal and Jaundhar Glacier snout."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Is Har Ki Dun a good trek for beginners?",
                                                                    "answer": "Yes, it is a moderate trail with gradual river valley ascents, making it one of the best multi-day introductory treks in the Himalayas."
                                                          },
                                                          {
                                                                    "question": "What is the mythological significance of Swargarohini?",
                                                                    "answer": "According to the Mahabharata, Mount Swargarohini ('Stairway to Heaven') is the glaciated peak the Pandavas climbed to ascend to the heavens."
                                                          }
                                                ],
                                                "seoTitle": "Har Ki Dun Trek (3,566m), Uttarkashi — Valley of Gods Itinerary & Guide",
                                                "seoDescription": "Complete guide to Har Ki Dun Trek (3,566m) in Uttarkashi, Garhwal. 7-day itinerary from Sankri, ancient Osla village, Swargarohini views, maps, and season advice.",
                                                "keywords": [
                                                          "Har Ki Dun trek",
                                                          "Valley of Gods Uttarakhand",
                                                          "Har Ki Dun altitude",
                                                          "Sankri to Har Ki Dun",
                                                          "Swargarohini peak view",
                                                          "Osla village trek"
                                                ]
                                      },
                                      {
                                                "id": "harsil-valley",
                                                "name": "Harsil Valley & Dharali",
                                                "type": "scenic",
                                                "emoji": "🍎",
                                                "coords": [
                                                          31.036,
                                                          78.736
                                                ],
                                                "elevation": "2,620 m",
                                                "bestSeason": "April to November (Apples in Aug-Oct)",
                                                "difficulty": "Easy",
                                                "duration": "2 Days",
                                                "overview": "A tranquil, unspoiled Himalayan hamlet nestled along the rushing Bhagirathi River 25 km before Gangotri, surrounded by dense deodar forests, traditional wooden footbridges, and apple orchards pioneered by the British soldier 'Pahari Wilson' in the 19th century. Dharali and the sacred village of Mukhba (the winter abode of Goddess Ganga) lie directly across the valley floor.",
                                                "experience": "Strolling through sun-dappled deodar groves alongside the crystal-clear Bhagirathi river with the aroma of ripe apples in the autumn mountain air.",
                                                "tips": [
                                                          "Cross the river bridge to visit Mukhba village during winter to pay homage to the idol of Goddess Ganga in her winter home.",
                                                          "Taste fresh organic royal delicious apples and homemade apple cider during the harvest season in September."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Where is Harsil located on the highway?",
                                                                    "answer": "Harsil is situated on the Uttarkashi-Gangotri highway (NH34), approximately 75 km from Uttarkashi town and 25 km before Gangotri."
                                                          },
                                                          {
                                                                    "question": "Who was 'Pahari Wilson'?",
                                                                    "answer": "Frederick E. Wilson was a British adventurer who settled in Harsil in the 1850s, built the historic Wilson Cottage, and introduced commercial apple cultivation to the valley."
                                                          }
                                                ],
                                                "seoTitle": "Harsil Valley (2,620m), Uttarkashi — Apple Orchards & Bhagirathi River Guide",
                                                "seoDescription": "Discover Harsil Valley (2,620m) in Uttarkashi, Uttarakhand. Deodar forests, Wilson apple orchards, Dharali wooden village, Mukhba Ganga temple, and travel advice.",
                                                "keywords": [
                                                          "Harsil Valley Uttarkashi",
                                                          "Harsil apple orchards",
                                                          "Harsil altitude",
                                                          "Dharali village",
                                                          "Mukhba winter Ganga",
                                                          "Gangotri to Harsil distance"
                                                ]
                                      },
                                      {
                                                "id": "yamunotri",
                                                "name": "Yamunotri Temple & Janki Chatti Trail",
                                                "type": "spiritual",
                                                "emoji": "🛕",
                                                "coords": [
                                                          31.013,
                                                          78.46
                                                ],
                                                "elevation": "3,291 m",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Moderate",
                                                "duration": "2 Days (6 km climb from Janki Chatti)",
                                                "overview": "The westernmost of the Char Dham pilgrimage shrines, Yamunotri sits perched at 3,291m in a narrow mountain cleft at the foot of Kalind Parvat. Dedicated to Goddess Yamuna, the temple features the boiling geothermal springs of Surya Kund (where pilgrims boil rice in cotton bags as prasad) and the sacred Divya Shila rock pillar, with the true glacier source at Champasar Glacier 1 km higher.",
                                                "routeDescription": "Starts at Janki Chatti roadhead (2,650m), climbing 6 km along steep paved mountain switchbacks alongside the foaming Yamuna River to the temple complex (3,291m).",
                                                "experience": "Watching boiling water bubble up from the granite fissures of Surya Kund while glacial winds blow down from the snow-covered slopes of Bandarpoonch.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Barkot to Janki Chatti, Trek to Yamunotri",
                                                                    "description": "Drive from Barkot to Janki Chatti (2,650m). Begin the 6 km steep climb along the Yamuna River to Yamunotri Temple (3,291m). Evening aarti and rest.",
                                                                    "elevationMeters": 3291,
                                                                    "distanceKm": 6
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Yamunotri Darshan & Return to Janki Chatti",
                                                                    "description": "Early morning bath in the warm waters of Jamunabai Kund, cooking rice in Surya Kund, and temple darshan. Descend 6 km back to Janki Chatti.",
                                                                    "elevationMeters": 2650,
                                                                    "distanceKm": 6
                                                          }
                                                ],
                                                "packingList": [
                                                          "Comfortable walking shoes with good tread",
                                                          "Warm fleece or light down jacket for mountain evenings",
                                                          "Raincoat or umbrella (weather changes quickly)",
                                                          "Walking stick or trekking pole"
                                                ],
                                                "tips": [
                                                          "Janki Chatti is the final motorable roadhead; budget for pony, palanquin, or walking the remaining 6 km uphill.",
                                                          "Boil a small cloth pouch of rice and potatoes in the boiling water of Surya Kund (88°C) to take home as sacred prasad."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How long does it take to walk from Janki Chatti to Yamunotri?",
                                                                    "answer": "The 6 km steep ascent takes approximately 3 to 4 hours on foot or about 1.5 to 2 hours by pony."
                                                          },
                                                          {
                                                                    "question": "Where is the actual source of the Yamuna River?",
                                                                    "answer": "The true source is Champasar Glacier on Kalind Parvat at 4,421m, approximately 1 km above the temple, but is virtually inaccessible due to steep moraines."
                                                          }
                                                ],
                                                "seoTitle": "Yamunotri Temple (3,291m), Uttarkashi — Char Dham & Janki Chatti Guide",
                                                "seoDescription": "Complete guide to Yamunotri Temple (3,291m) in Uttarkashi, Uttarakhand. Char Dham western shrine, Surya Kund thermal springs, 6km trek from Janki Chatti, and route advice.",
                                                "keywords": [
                                                          "Yamunotri Temple Uttarkashi",
                                                          "Char Dham pilgrimage",
                                                          "Janki Chatti to Yamunotri",
                                                          "Yamunotri altitude",
                                                          "Surya Kund hot springs",
                                                          "Yamunotri opening dates"
                                                ]
                                      },
                                      {
                                                "id": "dodital",
                                                "name": "Dodital Lake & Darwa Pass Trek",
                                                "type": "trek",
                                                "emoji": "🐟",
                                                "coords": [
                                                          30.893,
                                                          78.52
                                                ],
                                                "elevation": "3,024 m (Lake) / 4,150 m (Darwa Pass)",
                                                "bestSeason": "March to June, September to December",
                                                "difficulty": "Moderate",
                                                "duration": "4–5 Days",
                                                "distance": "44 km",
                                                "overview": "A serene freshwater alpine lake enveloped in dense oak, pine, and rhododendron forests in Uttarkashi district, revered as the legendary birthplace of Lord Ganesha (Dodi Tal). Famed for its rare Himalayan Golden Trout, the trail continues past the lake to the wind-whipped crest of Darwa Pass (4,150m), opening breathtaking panoramic vistas of the Bandarpoonch and Swargarohini mountain massifs.",
                                                "routeDescription": "Starts at Sangam Chatti roadhead (1,600m), walks 7 km to Agoda/Bebra, climbs through virgin rhododendron forests to Dodital lake (3,024m), and pushes up a steep ridge to Darwa Pass (4,150m).",
                                                "experience": "The serene mirror surface of Dodital reflecting golden autumn oak trees while golden trout glide through crystal-clear mountain water beside the Ganesha temple.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Uttarkashi to Sangam Chatti, Trek to Bebra",
                                                                    "description": "Drive 15 km to Sangam Chatti, then begin the 7 km forest hike through Agoda village to the riverside camp at Bebra (2,150m).",
                                                                    "elevationMeters": 2150,
                                                                    "distanceKm": 7
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Bebra to Dodital Lake",
                                                                    "description": "Climb 14 km through dense forests of rhododendron and oak past Manjhi to the tranquil emerald lake of Dodital (3,024m).",
                                                                    "elevationMeters": 3024,
                                                                    "distanceKm": 14
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Dodital to Darwa Pass & Return",
                                                                    "description": "Steep 5 km climb to Darwa Pass (4,150m) for panoramic vistas of Bandarpoonch and the Gangotri peaks. Descend back to Dodital.",
                                                                    "elevationMeters": 4150,
                                                                    "distanceKm": 10
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Dodital to Sangam Chatti & Drive to Uttarkashi",
                                                                    "description": "Retrace steps downhill through Manjhi and Bebra to Sangam Chatti roadhead, followed by drive back to Uttarkashi.",
                                                                    "elevationMeters": 1600,
                                                                    "distanceKm": 21
                                                          }
                                                ],
                                                "packingList": [
                                                          "Waterproof trekking shoes with ankle support",
                                                          "Warm fleece jacket and windproof shell",
                                                          "Trekking poles and headlamp",
                                                          "Insect repellent and personal medical kit"
                                                ],
                                                "tips": [
                                                          "Fishing for golden trout in Dodital requires a special permit from the Forest Division in Uttarkashi; catch-and-release rules apply.",
                                                          "Darwa Pass connects with the Yamuna valley and can be extended into a traverse trek ending at Hanuman Chatti."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Why is Dodital associated with Lord Ganesha?",
                                                                    "answer": "According to local legend, Goddess Parvati created Ganesha here, and the deity guarded her bath in the sacred waters of Dodital."
                                                          },
                                                          {
                                                                    "question": "What fish species lives in Dodital?",
                                                                    "answer": "The lake is famous for the rare Himalayan Golden Mahseer and Golden Trout, thriving in the cold freshwater fed by mountain springs."
                                                          }
                                                ],
                                                "seoTitle": "Dodital Trek (3,024m), Uttarkashi — Lake of Ganesha & Darwa Pass Guide",
                                                "seoDescription": "Complete guide to Dodital Trek (3,024m) in Uttarkashi, Uttarakhand. Birthplace of Ganesha, golden trout lake, 4-day itinerary, Darwa Pass (4,150m), and Bandarpoonch views.",
                                                "keywords": [
                                                          "Dodital trek Uttarkashi",
                                                          "Dodital altitude",
                                                          "Darwa Pass trek",
                                                          "birthplace of Ganesha lake",
                                                          "Sangam Chatti to Dodital",
                                                          "Bandarpoonch view trek"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "pauri-garhwal",
                            "name": "Pauri Garhwal",
                            "tagline": "Serene oak forests, colonial hill stations, and panoramic Himalayan viewpoints",
                            "division": "Garhwal",
                            "places": [
                                      {
                                                "id": "dhari-devi",
                                                "name": "Dhari Devi Temple — Guardian Deity of Uttarakhand",
                                                "type": "spiritual",
                                                "emoji": "🔱",
                                                "coords": [
                                                          30.2547,
                                                          78.8522
                                                ],
                                                "elevation": "560 m",
                                                "bestSeason": "Year-round (Best: October to April)",
                                                "difficulty": "Easy",
                                                "duration": "Half Day",
                                                "overview": "Perched dramatically on a raised concrete pillar over the sacred rushing waters of the Alaknanda River at Kalyasaur (between Srinagar and Rudraprayag on NH7), Dhari Devi is revered as the guardian protector of the Char Dham and the presiding deity of Uttarakhand. According to ancient lore, the idol of Goddess Kali changes appearance thrice daily—from a maiden in the morning, to a fierce warrior woman in the afternoon, and an elderly matriarch by dusk. It is deeply believed that no pilgrimage into the high shrines of Kedarnath and Badrinath is complete without stopping here to seek Maa Dhari Devi's blessings and protection for safe passage across the mountain roads.",
                                                "experience": "Standing on the pedestrian suspension bridge over the churning turquoise waters of the Alaknanda as temple bells echo against the rocky river gorge.",
                                                "tips": [
                                                          "Located directly on the Rishikesh-Badrinath highway (NH7) at Kalyasaur, 14 km east of Srinagar Garhwal and 19 km before Rudraprayag.",
                                                          "Walk across the modern concrete pedestrian suspension bridge linking the highway parking lot directly to the river sanctuary."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is the mythological significance of Dhari Devi?",
                                                                    "answer": "Dhari Devi is revered as the upper half of Goddess Kali, whose lower half is worshipped at the ancient Kalimath Siddhpeeth in the Mandakini valley."
                                                          },
                                                          {
                                                                    "question": "Why is Dhari Devi considered the protector of Char Dham?",
                                                                    "answer": "Local Garhwali belief holds that Dhari Devi protects the entire state and the sacred Char Dham mountain passes from natural disasters. Pilgrims historically make their first sacred offering here."
                                                          }
                                                ],
                                                "seoTitle": "Dhari Devi Temple (560m), Kalyasaur — Guardian Deity of Char Dham Guide",
                                                "seoDescription": "Explore Dhari Devi Temple on the Alaknanda River in Uttarakhand. Guardian deity of Char Dham, Kalyasaur location on NH7, darshan timings, and legends.",
                                                "keywords": [
                                                          "Dhari Devi temple",
                                                          "Dhari Devi Kalyasaur",
                                                          "guardian deity Uttarakhand",
                                                          "Srinagar to Rudraprayag temple",
                                                          "Dhari Devi Char Dham",
                                                          "Alaknanda river temple"
                                                ]
                                      },
                                      {
                                                "id": "lansdowne",
                                                "name": "Lansdowne Hill Station",
                                                "type": "scenic",
                                                "emoji": "🌲",
                                                "coords": [
                                                          29.837,
                                                          78.68
                                                ],
                                                "elevation": "1,706 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "2 Days",
                                                "overview": "A quiet, unspoiled cantonment town established in 1887 and named after Lord Lansdowne (Viceroy of India). Perched at 1,706m amidst thick blue pine and oak forests, it serves as the regimental headquarters of the renowned Garhwal Rifles. Famed for its peaceful, uncommercialized colonial ambiance, heritage stone churches, Bhulla Tal lake, and Tip-in-Top viewpoint.",
                                                "experience": "Walking along solitary pine-needle covered forest paths in the morning mist while church bells echo from St. John's Catholic Church.",
                                                "tips": [
                                                          "Visit Tip-in-Top (Tiffin Top) at sunrise for an expansive view of the Chaukhamba and Trishul peaks on clear days.",
                                                          "Explore the Garhwal Rifles Regimental Museum (Darwan Singh Museum) to inspect historic battlefield artifacts and Victoria Cross memorabilia."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How far is Lansdowne from Delhi?",
                                                                    "answer": "Lansdowne is approximately 250 kilometers northeast of Delhi, accessible in 5 to 6 hours by road via Meerut and Kotdwar."
                                                          },
                                                          {
                                                                    "question": "What is special about Lansdowne compared to other hill stations?",
                                                                    "answer": "Because it is an active military cantonment managed by the Indian Army, commercial overdevelopment is strictly restricted, preserving its pristine forest atmosphere."
                                                          }
                                                ],
                                                "seoTitle": "Lansdowne Hill Station (1,706m), Pauri Garhwal — Colonial Pine Trails",
                                                "seoDescription": "Explore Lansdowne (1,706m) in Pauri Garhwal, Uttarakhand. Peaceful colonial cantonment town, Garhwal Rifles heritage, Bhulla Tal, Tip-in-Top, and weekend getaways.",
                                                "keywords": [
                                                          "Lansdowne Pauri Garhwal",
                                                          "Lansdowne hill station",
                                                          "Lansdowne altitude",
                                                          "Delhi to Lansdowne road",
                                                          "Bhulla Tal lake",
                                                          "Garhwal Rifles museum"
                                                ]
                                      },
                                      {
                                                "id": "khirsu",
                                                "name": "Khirsu Mountain Village",
                                                "type": "scenic",
                                                "emoji": "🍂",
                                                "coords": [
                                                          30.17,
                                                          78.85
                                                ],
                                                "elevation": "1,700 m",
                                                "bestSeason": "March to June, September to November",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "A tranquil hamlet nestled amidst dense deodar, oak, and apple orchards 15 km from Pauri town, offering one of the widest panoramic vistas in Garhwal with over 300 snow-capped Himalayan peaks visible on clear autumn and winter horizons.",
                                                "experience": "Sitting in an apple orchard at dusk watching the setting sun turn over three hundred snow peaks from golden yellow to deep crimson.",
                                                "tips": [
                                                          "Stay at local village homestays to experience authentic Garhwali hospitality, millet rotis, and fresh orchard fruits.",
                                                          "Combine Khirsu with a visit to the ancient temple of Ghandiyal Devta."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How far is Khirsu from Pauri town?",
                                                                    "answer": "Khirsu is located approximately 15 kilometers north of Pauri along a quiet, scenic forest road."
                                                          },
                                                          {
                                                                    "question": "What is Khirsu best known for?",
                                                                    "answer": "Khirsu is renowned for its tranquil deodar woodland walks and its sweeping, unobstructed view of over 300 snow-capped peaks."
                                                          }
                                                ],
                                                "seoTitle": "Khirsu (1,700m), Pauri Garhwal — Quiet Village & 300 Peak Panoramas",
                                                "seoDescription": "Discover Khirsu (1,700m) in Pauri Garhwal, Uttarakhand. Peaceful mountain hamlet, deodar forests, apple orchards, 300+ snow peak panorama, and homestays.",
                                                "keywords": [
                                                          "Khirsu Pauri Garhwal",
                                                          "Khirsu altitude",
                                                          "places near Pauri",
                                                          "Khirsu homestays",
                                                          "Himalayan peak views Khirsu",
                                                          "peaceful places in Garhwal"
                                                ]
                                      },
                                      {
                                                "id": "tarkeshwar-mahadev",
                                                "name": "Tarkeshwar Mahadev Deodar Sanctuary",
                                                "type": "spiritual",
                                                "emoji": "🌲",
                                                "coords": [
                                                          29.842,
                                                          78.783
                                                ],
                                                "elevation": "2,090 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "Half Day",
                                                "overview": "An ancient Shiva shrine secluded in a thick virgin forest of towering deodars and blue pines near Lansdowne in Pauri Garhwal. Believed to be the place where the demon Tarakasura meditated on Lord Shiva to attain invincibility, the temple is adorned with thousands of brass bells offered by devotees whose prayers were answered.",
                                                "experience": "The gentle tinkling of thousands of brass temple bells echoing through towering centuries-old deodar trees in complete mountain serenity.",
                                                "tips": [
                                                          "The temple is situated 38 km from Lansdowne; rent a taxi or motorcycle for a picturesque morning drive through mountain pine ridges.",
                                                          "Visit on Shivratri when thousands of mountain villagers gather for colorful traditional pujas and folk hymns."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How far is Tarkeshwar Mahadev from Lansdowne?",
                                                                    "answer": "The temple is located about 38 kilometers southeast of Lansdowne, approximately 1 hour and 15 minutes by road."
                                                          },
                                                          {
                                                                    "question": "Why are there thousands of bells at Tarkeshwar Mahadev?",
                                                                    "answer": "Devotees hang brass bells at the shrine when their wishes are fulfilled, creating a musical forest atmosphere."
                                                          }
                                                ],
                                                "seoTitle": "Tarkeshwar Mahadev (2,090m), Pauri Garhwal — Ancient Deodar Shrine Guide",
                                                "seoDescription": "Visit Tarkeshwar Mahadev Temple (2,090m) in Pauri Garhwal, Uttarakhand. Ancient Shiva forest shrine near Lansdowne, towering deodars, thousand temple bells, and travel tips.",
                                                "keywords": [
                                                          "Tarkeshwar Mahadev temple",
                                                          "Lansdowne to Tarkeshwar distance",
                                                          "Pauri Garhwal temples",
                                                          "Tarkeshwar altitude",
                                                          "deodar forest shrine",
                                                          "Lansdowne spiritual places"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "tehri-garhwal",
                            "name": "Tehri Garhwal",
                            "tagline": "Sprawling turquoise reservoirs, sacred mountain confluences, and pine ridges",
                            "division": "Garhwal",
                            "places": [
                                      {
                                                "id": "tehri-lake",
                                                "name": "Tehri Lake & Adventure Hub",
                                                "type": "adventure",
                                                "emoji": "🚤",
                                                "coords": [
                                                          30.378,
                                                          78.48
                                                ],
                                                "elevation": "850 m",
                                                "bestSeason": "Year-round (Best: October to June)",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "Created by the colossal Tehri Dam—one of the world's highest rock-and-earth fill embankment dams (260.5m) impounding the Bhagirathi and Bhilangna rivers—Tehri Lake is a sprawling 42-square-kilometer turquoise reservoir. It has emerged as Uttarakhand's premier water adventure hub, offering jet skiing, speed boating, banana boat rides, wakeboarding, parasailing, and luxury floating houseboats.",
                                                "experience": "Cruising across emerald-green reservoir waters surrounded by towering dry mountain ridges where the old town of Tehri once stood submerged beneath the lake.",
                                                "tips": [
                                                          "Stay in one of the luxury floating houseboats or eco-cottages moored directly on the lake for an unforgettable overnight water stay.",
                                                          "Visit during the annual Tehri Lake Festival (February/March) for aero-sports, water rallies, and live cultural performances."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How deep is Tehri Lake?",
                                                                    "answer": "The lake reaches maximum depths of up to 260 meters near the dam face, making it one of the deepest artificial lakes in Asia."
                                                          },
                                                          {
                                                                    "question": "How far is Tehri Lake from Rishikesh?",
                                                                    "answer": "Tehri Lake is located about 75 kilometers north of Rishikesh via Chamba along NH94 (approximately 2.5 hours drive)."
                                                          }
                                                ],
                                                "seoTitle": "Tehri Lake & Dam (850m), Tehri Garhwal — Water Adventure & Floating Huts",
                                                "seoDescription": "Explore Tehri Lake (850m) in Tehri Garhwal, Uttarakhand. Giant 42 sq km reservoir, water sports, jet skiing, floating houseboats, Tehri Dam view, and road route.",
                                                "keywords": [
                                                          "Tehri Lake Uttarakhand",
                                                          "Tehri Dam altitude",
                                                          "Tehri water sports",
                                                          "floating huts Tehri",
                                                          "New Tehri tourism",
                                                          "Rishikesh to Tehri distance"
                                                ]
                                      },
                                      {
                                                "id": "kanatal-dhanaulti",
                                                "name": "Kanatal & Surkanda Devi Ridge",
                                                "type": "scenic",
                                                "emoji": "🍂",
                                                "coords": [
                                                          30.414,
                                                          78.33
                                                ],
                                                "elevation": "2,756 m (Surkanda Devi Peak)",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "A tranquil mountain ridge perched on the Mussoorie-Chamba highway at 2,590m, Kanatal is famous for cool mountain breezes, apple orchards, and pine forests. Overlooking the ridge at 2,756m stands the sacred hill temple of Surkanda Devi—a prominent Shakti Peetha where Goddess Sati's head fell, accessible by a 2 km uphill walk or ropeway offering 360-degree views of the Garhwal peaks.",
                                                "experience": "Standing atop the wind-whipped summit of Surkanda Devi with prayer flags fluttering against an uninterrupted panoramic wall of snow peaks stretching from Bandarpoonch to Chaukhamba.",
                                                "tips": [
                                                          "Take the Surkanda Devi ropeway from Kaddukhal to reach the summit shrine in just 5 minutes if traveling with seniors.",
                                                          "Explore the Eco-Parks (Amber and Dhara) in nearby Dhanaulti for tranquil nature walks through dense deodar forests."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is the mythological significance of Surkanda Devi?",
                                                                    "answer": "It is one of the 51 Shakti Peethas; legend states that the head (Sir) of Goddess Sati fell here while Lord Shiva carried her burning body."
                                                          },
                                                          {
                                                                    "question": "How far is Kanatal from Mussoorie?",
                                                                    "answer": "Kanatal is located approximately 40 kilometers east of Mussoorie along the scenic Chamba road (about 1.5 hours drive)."
                                                          }
                                                ],
                                                "seoTitle": "Kanatal & Surkanda Devi (2,756m), Tehri — Ridge Views & Shakti Peetha Guide",
                                                "seoDescription": "Guide to Kanatal and Surkanda Devi Temple (2,756m) in Tehri Garhwal. Panoramic Himalayan views, Shakti Peetha ropeway, Eco-park trails, and weekend getaways.",
                                                "keywords": [
                                                          "Kanatal Uttarakhand",
                                                          "Surkanda Devi temple ropeway",
                                                          "Surkanda Devi altitude",
                                                          "Dhanaulti to Kanatal",
                                                          "Tehri Garhwal ridge",
                                                          "Kanatal camping"
                                                ]
                                      },
                                      {
                                                "id": "devprayag",
                                                "name": "Devprayag (Ganga Confluence)",
                                                "type": "spiritual",
                                                "emoji": "🌊",
                                                "coords": [
                                                          30.146,
                                                          78.599
                                                ],
                                                "elevation": "830 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "Half Day",
                                                "overview": "The most sacred and visually dramatic of the Panch Prayag, Devprayag is where the churning turquoise rapids of the Bhagirathi River merge with the calm, deep-green waters of the Alaknanda River to officially form the holy River Ganga. Sited in Tehri Garhwal, the town features the 10,000-year-old Raghunathji stone temple (built of massive uncemented stones) and sacred bathing ghats.",
                                                "experience": "Watching the distinct color contrast where the turquoise torrent of the Bhagirathi forcefully crashes into the deep green Alaknanda to become the River Ganga.",
                                                "tips": [
                                                          "Climb the narrow stone staircases through the tiered old town to visit the ancient Raghunathji Temple, one of the 108 Divya Desams.",
                                                          "Stand on the suspension footbridge across the Bhagirathi for the best elevated photo angle of the dual-colored water confluence."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Why is Devprayag uniquely important among the Panch Prayag?",
                                                                    "answer": "It is the final confluence where the Bhagirathi and Alaknanda rivers unite and from this exact point forward, the river is known as the holy Ganga."
                                                          },
                                                          {
                                                                    "question": "How far is Devprayag from Rishikesh?",
                                                                    "answer": "Devprayag is situated 70 kilometers northeast of Rishikesh along NH7, approximately 2 hours drive into the mountains."
                                                          }
                                                ],
                                                "seoTitle": "Devprayag Sangam (830m), Tehri Garhwal — Birthplace of River Ganga Guide",
                                                "seoDescription": "Discover Devprayag (830m) in Uttarakhand. Sacred confluence of Bhagirathi and Alaknanda creating River Ganga, Raghunathji temple, ghats, and travel tips.",
                                                "keywords": [
                                                          "Devprayag sangam",
                                                          "birthplace of River Ganga",
                                                          "Alaknanda Bhagirathi confluence",
                                                          "Devprayag altitude",
                                                          "Raghunathji temple Devprayag",
                                                          "Rishikesh to Devprayag"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "dehradun",
                            "name": "Dehradun",
                            "tagline": "Colonial hill ridges, Shivalik valleys, and the world capital of white-water rafting",
                            "division": "Garhwal",
                            "places": [
                                      {
                                                "id": "mussoorie-george-everest",
                                                "name": "Mussoorie & George Everest Ridge",
                                                "type": "scenic",
                                                "emoji": "🌄",
                                                "coords": [
                                                          30.459,
                                                          78.034
                                                ],
                                                "elevation": "2,005 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "2 Days",
                                                "overview": "Known as the 'Queen of the Hills', Mussoorie perches on a scenic horseshoe ridge at 2,000m overlooking the twinkling lights of the Doon Valley and the snow-capped Garhwal peaks. The historic estate and peak of Sir George Everest (Surveyor General of India who mapped Mount Everest) offers a popular 360-degree ridge day hike connecting into the Benog Wildlife Sanctuary and Hathipaon.",
                                                "experience": "The famous 'Winterline' phenomenon—a rare false sunset optical horizon glow over the Doon Valley—viewed from the Mall Road and George Everest ridge.",
                                                "tips": [
                                                          "Hike up to George Everest Peak early in the morning for crisp 360-degree views of the Aglar river valley and the snow-capped Bandarpoonch range.",
                                                          "Visit Camel's Back Road for a tranquil, motor-free 3 km morning walk shaded by ancient deodars."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is the Winterline in Mussoorie?",
                                                                    "answer": "A rare atmospheric phenomenon visible only in Mussoorie and parts of Switzerland from October to January, creating a distinct red, orange, and mauve false horizon at sunset."
                                                          },
                                                          {
                                                                    "question": "How far is George Everest House from Mussoorie town?",
                                                                    "answer": "George Everest Estate is located about 6 km west of Gandhi Chowk (Library Bazaar), reachable by taxi or an easy uphill hike."
                                                          }
                                                ],
                                                "seoTitle": "Mussoorie & George Everest (2,005m), Dehradun — Ridge Hike & Viewpoints",
                                                "seoDescription": "Explore Mussoorie and Sir George Everest Peak (2,005m) in Dehradun, Uttarakhand. Doon Valley views, heritage house hike, Benog Wildlife Sanctuary, and travel guide.",
                                                "keywords": [
                                                          "Mussoorie Uttarakhand",
                                                          "George Everest peak Mussoorie",
                                                          "Mussoorie altitude",
                                                          "Doon valley viewpoints",
                                                          "Mussoorie day hikes",
                                                          "Queen of Hills Garhwal"
                                                ]
                                      },
                                      {
                                                "id": "chakrata-tiger-falls",
                                                "name": "Chakrata & Tiger Falls",
                                                "type": "scenic",
                                                "emoji": "🌲",
                                                "coords": [
                                                          30.702,
                                                          77.869
                                                ],
                                                "elevation": "2,118 m",
                                                "bestSeason": "Year-round (Best: March to June, October to December)",
                                                "difficulty": "Easy to Moderate",
                                                "duration": "2 Days",
                                                "overview": "A secluded cantonment town nestled in the Jaunsar-Bawar tribal region of Dehradun district, surrounded by thick deodar, oak, and rhododendron forests. Free from commercial tourist crowds, Chakrata is famous for Chilmiri Neck (a panoramic sunset plateau) and Tiger Falls—one of Uttarakhand's highest direct waterfalls dropping 95 meters into an emerald forest pool.",
                                                "experience": "The cool roar and mist of Tiger Falls tumbling 95 meters down vertical rock cliffs into a secluded natural pool deep within a virgin deodar forest.",
                                                "tips": [
                                                          "Hike the 5 km downhill forest trail from Chakrata town to the base of Tiger Falls instead of taking the road, for a rewarding nature walk.",
                                                          "Foreign nationals require special cantonment permission from the military authorities to visit certain areas in Chakrata."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How high is Tiger Falls in Chakrata?",
                                                                    "answer": "Tiger Falls drops 95 meters (312 ft) directly from the cliffs, making it one of the highest untamed waterfalls in Uttarakhand."
                                                          },
                                                          {
                                                                    "question": "How far is Chakrata from Dehradun?",
                                                                    "answer": "Chakrata is located about 88 kilometers northwest of Dehradun via Vikas Nagar and Kalsi (approx. 3 hours drive)."
                                                          }
                                                ],
                                                "seoTitle": "Chakrata & Tiger Falls (2,118m), Dehradun — Jaunsar Deodar Trails Guide",
                                                "seoDescription": "Complete guide to Chakrata and Tiger Falls (2,118m) in Dehradun, Uttarakhand. 95m forest waterfall hike, Chilmiri Neck sunset, Jaunsar culture, and weekend stay tips.",
                                                "keywords": [
                                                          "Chakrata Uttarakhand",
                                                          "Tiger Falls Chakrata",
                                                          "Chakrata altitude",
                                                          "Jaunsar Bawar tourism",
                                                          "Chilmiri Neck sunset",
                                                          "Dehradun to Chakrata distance"
                                                ]
                                      },
                                      {
                                                "id": "rishikesh",
                                                "name": "Rishikesh & Shivpuri Adventure Corridor",
                                                "type": "adventure",
                                                "emoji": "🧘",
                                                "coords": [
                                                          30.0869,
                                                          78.2676
                                                ],
                                                "elevation": "372 m",
                                                "bestSeason": "September to June (Rafting closes July-August)",
                                                "difficulty": "Easy",
                                                "duration": "2–3 Days",
                                                "overview": "Hailed worldwide as the 'Yoga Capital of the World' and India's adventure capital, Rishikesh sits where the holy River Ganga emerges from the Himalayan foothills into the plains. The 20 km corridor stretching upstream through Shivpuri, Marine Drive, and Kaudiyala is world-renowned for Grade III and IV white-water rafting rapids (The Wall, Roller Coaster, Golf Course), bungee jumping, cliff diving, and evening Ganga aarti at Triveni Ghat and Parmarth Niketan.",
                                                "experience": "Shooting through roaring white-water rapids on the turquoise Ganga under towering green Himalayan gorge walls, followed by evening riverside chants at Parmarth Niketan.",
                                                "tips": [
                                                          "Book the 16 km Shivpuri to NIM Beach rafting stretch for the premier combination of exciting Grade III rapids and scenic cliff jumping.",
                                                          "Visit the Beatles Ashram (Chaurasi Kutia) in the Rajaji forest to explore iconic meditation domes and 1968 psychedelic graffiti murals."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "When is the white-water rafting season in Rishikesh?",
                                                                    "answer": "The river rafting season runs from late September to late June, closing during July and August due to high monsoon water levels."
                                                          },
                                                          {
                                                                    "question": "What major adventure sports are available in Rishikesh?",
                                                                    "answer": "White-water rafting, India's highest bungee jumping (83m at Mohan Chatti), giant canyon swing, flying fox, kayaking, and riverside camping."
                                                          }
                                                ],
                                                "seoTitle": "Rishikesh Adventure & Yoga Hub (372m), Dehradun — River Rafting & Ghats",
                                                "seoDescription": "Complete guide to Rishikesh (372m) in Uttarakhand. White-water Ganga rafting in Shivpuri, cliff jumping, Triveni Ghat aarti, Beatles Ashram, and Himalayan foothill gateway.",
                                                "keywords": [
                                                          "Rishikesh rafting Uttarakhand",
                                                          "Shivpuri river camping",
                                                          "Rishikesh adventure sports",
                                                          "Triveni Ghat aarti",
                                                          "Rishikesh altitude",
                                                          "gateway to Garhwal"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "haridwar",
                            "name": "Haridwar",
                            "tagline": "Sacred Shivalik gateway where the holy Ganga descends onto the northern plains",
                            "division": "Garhwal",
                            "places": [
                                      {
                                                "id": "kankhal",
                                                "name": "Kankhal Heritage & Daksh Prajapati Temple",
                                                "type": "spiritual",
                                                "emoji": "🛕",
                                                "coords": [
                                                          29.925,
                                                          78.145
                                                ],
                                                "elevation": "300 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "Half Day",
                                                "overview": "An ancient sacred town and heritage neighborhood located 4 km south of Har Ki Pauri. Kankhal is celebrated in Hindu puranas as the capital of King Daksha Prajapati, father of Goddess Sati. The grand Daksh Mahadev Temple complex marks the exact sacrificial fire altar (Yajna Kund) where Sati immolated herself, leading to Shiva's devastating Tandava dance. Also houses the serene Ma Anandamayi Ashram.",
                                                "experience": "Strolling through ancient stone lanes and serene ashrams along the old canal banks, imbued with deep Shaivite antiquity.",
                                                "tips": [
                                                          "Visit the Yajna Kund inside Daksh Prajapati temple to witness the sacred pit of ancient puranic mythology.",
                                                          "Combine your visit with a peaceful meditation stop at the nearby Ma Anandamayi Ashram by the river."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is the mythological importance of Kankhal?",
                                                                    "answer": "Kankhal is the historic site of King Daksha's famous Yajna where Goddess Sati immolated herself, prompting Lord Shiva to create Veerabhadra."
                                                          },
                                                          {
                                                                    "question": "How far is Kankhal from Haridwar railway station?",
                                                                    "answer": "Kankhal is approximately 3.5 km south of the Haridwar railway station, easily accessible by auto-rickshaw in 10 minutes."
                                                          }
                                                ],
                                                "seoTitle": "Kankhal & Daksh Prajapati Temple (Haridwar) — Yajna Kund & Heritage Guide",
                                                "seoDescription": "Discover Kankhal in Haridwar, home of the historic Daksh Prajapati Temple, Sati's Yajna Kund, and Ma Anandamayi Ashram.",
                                                "keywords": [
                                                          "Kankhal Haridwar",
                                                          "Daksh Prajapati temple",
                                                          "Daksha Yajna site",
                                                          "Sati yajna kund",
                                                          "Anandamayi Ashram Kankhal",
                                                          "Haridwar heritage"
                                                ]
                                      },
                                      {
                                                "id": "mansa-devi-chandi-devi",
                                                "name": "Mansa Devi & Chandi Devi Siddhpeeths",
                                                "type": "spiritual",
                                                "emoji": "🚡",
                                                "coords": [
                                                          29.96,
                                                          78.165
                                                ],
                                                "elevation": "550 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "Half Day",
                                                "overview": "The twin guardian hilltop Siddhpeeths flanking Haridwar across the Ganges. Goddess Mansa Devi sits atop Bilwa Parvat (reachable by scenic cable car / ropeway or walking path), while Goddess Chandi Devi crowns the Neel Parvat peak across the river. Together with Maya Devi, they form the sacred Siddhpeeth triangle protecting the holy city.",
                                                "experience": "Gliding above Haridwar in the Udankhatola ropeway as the vast braided channels of the Ganges unfold toward the southern plains.",
                                                "tips": [
                                                          "Purchase a combined ropeway ticket (Udankhatola) covering both Mansa Devi and Chandi Devi to save time and money.",
                                                          "Visit early in the morning on weekdays to avoid lengthy queue times at the cable car stations."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Can you walk up to Mansa Devi instead of taking the cable car?",
                                                                    "answer": "Yes, there is a well-paved 1.5 km pedestrian zig-zag path from the base town up to Bilwa Parvat, taking about 30–45 minutes."
                                                          },
                                                          {
                                                                    "question": "What are the timings for the ropeway?",
                                                                    "answer": "The Udankhatola cable car generally operates from 7:00 AM to 7:00 PM daily."
                                                          }
                                                ],
                                                "seoTitle": "Mansa Devi & Chandi Devi Temples (Haridwar) — Ropeway & Hilltop Siddhpeeths",
                                                "seoDescription": "Guide to Mansa Devi and Chandi Devi temples in Haridwar. Bilwa Parvat & Neel Parvat cable car (Udankhatola), temple timings, and legends.",
                                                "keywords": [
                                                          "Mansa Devi temple Haridwar",
                                                          "Chandi Devi temple Haridwar",
                                                          "Haridwar ropeway",
                                                          "Udankhatola Haridwar",
                                                          "Bilwa Parvat",
                                                          "Haridwar siddhpeeths"
                                                ]
                                      },
                                      {
                                                "id": "har-ki-pauri",
                                                "name": "Har Ki Pauri & Sacred Ganga Ghats",
                                                "type": "spiritual",
                                                "emoji": "🪔",
                                                "coords": [
                                                          29.956,
                                                          78.17
                                                ],
                                                "elevation": "314 m",
                                                "bestSeason": "Year-round (Best: October to April)",
                                                "difficulty": "Easy",
                                                "duration": "1 Day",
                                                "overview": "The most famous and revered ghat on the banks of the holy Ganges where the sacred river enters the plains of northern India from the Himalayas. Believed to bear the footprint (Pauri) of Lord Vishnu, Har Ki Pauri is the epic epicenter of the world-famous evening Ganga Aarti, where thousands of floating leaf diyas and bronze lamps illuminate the shimmering turquoise river amidst reverberating Vedic chants.",
                                                "experience": "Watching thousands of golden lamps float gently down the dark current of the Ganges during evening twilight as conch shells sound from every temple spire.",
                                                "tips": [
                                                          "Arrive at the Brahmakund ghat by 5:00 PM (at least 90 minutes before aarti) to secure a good viewing spot near the water's edge.",
                                                          "Take a holy morning dip at Brahmakund before sunrise for a tranquil, meditative experience away from the crowds."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is the timing of Ganga Aarti at Har Ki Pauri?",
                                                                    "answer": "Morning Aarti is held at sunrise (5:30 AM to 6:30 AM) and Evening Aarti at sunset (6:00 PM to 7:00 PM), varying with the seasons."
                                                          },
                                                          {
                                                                    "question": "Why is Har Ki Pauri considered sacred?",
                                                                    "answer": "According to Hindu mythology, drops of the celestial nectar of immortality (Amrit) spilled here from the celestial pitcher during the Samudra Manthan, sanctifying Brahmakund."
                                                          }
                                                ],
                                                "seoTitle": "Har Ki Pauri & Ghats (Haridwar) — Evening Ganga Aarti, Brahmakund & Guide",
                                                "seoDescription": "Complete guide to Har Ki Pauri ghats in Haridwar. Evening Ganga Aarti timings, Brahmakund sacred bath, history, and photography tips.",
                                                "keywords": [
                                                          "Har Ki Pauri",
                                                          "Haridwar Ganga Aarti",
                                                          "Brahmakund Haridwar",
                                                          "Ganga ghats Haridwar",
                                                          "Haridwar evening aarti timings",
                                                          "holy dip Haridwar"
                                                ]
                                      },
                                      {
                                                "id": "rajaji-national-park",
                                                "name": "Rajaji National Park Foothills",
                                                "type": "adventure",
                                                "emoji": "🐘",
                                                "coords": [
                                                          30.016,
                                                          78.181
                                                ],
                                                "elevation": "302 m (Plains) to 1,000 m (Shivalik Ridges)",
                                                "bestSeason": "November to June",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "Sprawling across 820 square kilometers of the Shivalik foothills and Terai sal forests spanning Haridwar, Dehradun, and Pauri Garhwal districts, Rajaji National Park is a prominent Project Tiger and Project Elephant reserve. Nourished by the Ganga and Song rivers, it is home to over 500 Asian elephants, Royal Bengal tigers, leopards, sloth bears, and more than 400 species of resident and migratory birds.",
                                                "experience": "Tracking wild elephant herds through golden grasslands and dry riverbeds under the shadow of the rugged Shivalik hills during an open-top morning jeep safari.",
                                                "tips": [
                                                          "Book open-top 4x4 jeep safaris in the Chilla or Motichur tourism zones for the highest probability of spotting wild elephant herds and deer.",
                                                          "Visit between December and March for pleasant weather and prime winter birdwatching along the wetlands."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "When is Rajaji National Park open for safaris?",
                                                                    "answer": "The park is open for wildlife tourism from November 15 to June 15 each year, remaining closed during the monsoon season."
                                                          },
                                                          {
                                                                    "question": "Which safari zone is best in Rajaji National Park?",
                                                                    "answer": "The Chilla Range along the eastern bank of the Ganga is the most popular zone, featuring open grasslands, river channels, and frequent elephant sightings."
                                                          }
                                                ],
                                                "seoTitle": "Rajaji National Park (302–1,000m), Haridwar — Elephant & Tiger Safari Guide",
                                                "seoDescription": "Visitor guide to Rajaji National Park in the Himalayan Shivalik foothills. Wildlife jeep safaris, Asian elephant herds, tiger reserve, Chilla range, and booking info.",
                                                "keywords": [
                                                          "Rajaji National Park Haridwar",
                                                          "Rajaji elephant safari",
                                                          "Chilla safari range",
                                                          "Rajaji tiger reserve",
                                                          "Shivalik wildlife reserve",
                                                          "Haridwar to Rajaji distance"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "pithoragarh",
                            "name": "Pithoragarh",
                            "tagline": "Kumaon frontier, Panchachuli glaciated massifs, and sacred Kailash routes",
                            "division": "Kumaon",
                            "places": [
                                      {
                                                "id": "darma-valley",
                                                "name": "Darma Valley & Rung Borderlands",
                                                "type": "scenic",
                                                "emoji": "🌸",
                                                "coords": [
                                                          30.312,
                                                          80.573
                                                ],
                                                "elevation": "3,400 m",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Moderate",
                                                "duration": "4–5 Days",
                                                "overview": "A remote, breathtaking high-altitude valley carved by the Dhauliganga River in eastern Kumaon along the borders of Tibet and Nepal. Home to the indigenous Rung community, Darma Valley boasts raw alpine meadows, dramatic glaciers spilling directly toward traditional stone villages like Dantu, Dugtu, and Go, and close-up views of the east face of the Panchachuli range.",
                                                "experience": "Waking up in a homestay in Dantu village as the colossal five peaks of Panchachuli catch the first morning sun across lush wildflower fields.",
                                                "tips": [
                                                          "Inner Line Permit (ILP) is required for all visitors, obtainable online or at the SDM office in Dharchula.",
                                                          "Stay in local Rung homestays in Dantu or Dugtu to experience authentic Kumaoni borderland hospitality."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Where does the Darma Valley trail begin?",
                                                                    "answer": "The road and trail begin from Dharchula, traveling through Tawaghat, Khela, and Sobla into the upper valley."
                                                          }
                                                ],
                                                "seoTitle": "Darma Valley (3,400m), Pithoragarh — Rung Borderlands & Panchachuli East Guide",
                                                "seoDescription": "Explore Darma Valley in Pithoragarh, Kumaon. Dhauliganga canyon, Panchachuli views, Dantu & Dugtu villages, and travel permit guide.",
                                                "keywords": [
                                                          "Darma Valley Pithoragarh",
                                                          "Darma valley trek",
                                                          "Panchachuli east face",
                                                          "Dantu village",
                                                          "Dharchula to Darma valley"
                                                ]
                                      },
                                      {
                                                "id": "panchachuli-base-camp",
                                                "name": "Panchachuli Base Camp Trek",
                                                "type": "trek",
                                                "emoji": "🏔️",
                                                "coords": [
                                                          30.435,
                                                          80.428
                                                ],
                                                "elevation": "4,260 m",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Moderate",
                                                "duration": "5–6 Days",
                                                "distance": "40 km",
                                                "overview": "A thrilling trek leading to the very foot of the Meola Glacier and the legendary Five Churis (cooking hearths) of the Pandavas—the Panchachuli massif (6,904m). Starting from Sobla or Dantu in Darma Valley, the trail hugs the raging glacier torrents through birch and rhododendron forests onto high moraine plateaus directly beneath the colossal peaks.",
                                                "routeDescription": "Traverses from Dharchula/Sobla through the Darma valley to Dantu, then climbs steeply past alpine birch groves and the Meola Glacier moraine to Panchachuli Base Camp (4,260m).",
                                                "experience": "Listening to the thunderous crack of hanging seracs on the Meola Glacier while gazing straight up into the 3,000-meter sheer ice face of Panchachuli II.",
                                                "tips": [
                                                          "Acclimatize in Dantu village (3,100m) for at least one night before hiking to the high base camp.",
                                                          "Carry trekking poles and sturdy boots with aggressive tread for navigating loose glacial scree."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How difficult is the Panchachuli Base Camp trek?",
                                                                    "answer": "It is rated Moderate, accessible to fit beginners with prior hiking experience."
                                                          }
                                                ],
                                                "seoTitle": "Panchachuli Base Camp Trek (4,260m), Kumaon — Meola Glacier Guide",
                                                "seoDescription": "Guide to Panchachuli Base Camp Trek (4,260m) in Pithoragarh, Kumaon. Itinerary, Dantu village route, Meola glacier, and gear list.",
                                                "keywords": [
                                                          "Panchachuli base camp trek",
                                                          "Panchachuli trek itinerary",
                                                          "Meola glacier",
                                                          "Darma valley trekking",
                                                          "Kumaon high altitude treks"
                                                ]
                                      },
                                      {
                                                "id": "nanda-devi-east-base-camp",
                                                "name": "Nanda Devi East Base Camp Trek",
                                                "type": "trek",
                                                "emoji": "⛰️",
                                                "coords": [
                                                          30.366,
                                                          80.024
                                                ],
                                                "elevation": "4,300 m",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Challenging",
                                                "duration": "9–10 Days",
                                                "distance": "85 km",
                                                "overview": "The premier expedition trek of Kumaon, following the ancient trans-Himalayan trade corridor through the Gori Ganga gorge from Munsiyari to the foot of Mount Nanda Devi East (7,434m). Traversing desolate ruins of salt-trade villages like Martoli and Rilkot, the trail climbs onto the vast glaciated high meadow of Panchu, offering an intimidating, up-close view of the near-vertical eastern face of India's second-highest mountain.",
                                                "routeDescription": "Begins at Munsiyari/Lilam, follows the roaring Gori Ganga gorge past Bogdiyar and Rilkot to the historic stone outpost of Martoli, then branches up the glaciated valley to Panchu and Nanda Devi East Base Camp (4,300m).",
                                                "experience": "Standing in total silence on the moraine ridge of Panchu Glacier as the sheer 3,000-meter golden wall of Nanda Devi East glows under the alpenglow.",
                                                "tips": [
                                                          "Spend an extra acclimatization and exploration day at Martoli village to see the ancient Nanda Devi temple and traditional Tibetan-trade stone houses.",
                                                          "The trail through Gori Ganga gorge is prone to seasonal landslides during monsoon; travel strictly in pre-monsoon (May–June) or autumn (Sept–Oct)."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Is Nanda Devi East Base Camp open to civilians?",
                                                                    "answer": "Yes, while the Nanda Devi Inner Sanctuary in Garhwal is closed for conservation, the Nanda Devi East Base Camp in Kumaon is fully open for trekking."
                                                          }
                                                ],
                                                "seoTitle": "Nanda Devi East Base Camp Trek (4,300m), Munsiyari — Gori Ganga Gorge Guide",
                                                "seoDescription": "The authoritative guide to Nanda Devi East Base Camp Trek (4,300m) from Munsiyari, Kumaon. Itinerary, Martoli village, Gori Ganga route, and permits.",
                                                "keywords": [
                                                          "Nanda Devi East base camp",
                                                          "Nanda Devi trek Munsiyari",
                                                          "Martoli village",
                                                          "Gori Ganga gorge",
                                                          "Kumaon expedition trek"
                                                ]
                                      },
                                      {
                                                "id": "munsiyari-panchachuli",
                                                "name": "Munsiyari & Panchachuli Base Camp",
                                                "type": "trek",
                                                "emoji": "⛰️",
                                                "coords": [
                                                          30.06,
                                                          80.23
                                                ],
                                                "elevation": "4,260 m (Base Camp) / 2,200 m (Munsiyari)",
                                                "bestSeason": "April to June, September to November",
                                                "difficulty": "Moderate",
                                                "duration": "6 Days",
                                                "distance": "36 km",
                                                "overview": "Perched on a high ridge in upper Kumaon overlooking the roaring Goriganga River valley, Munsiyari ('Place with Snow') is the gateway to the glaciated borderlands. The town is dominated by the legendary five peaks of Panchachuli ('Five Chintamani hearths'), where the Pandavas cooked their last meal before ascending to heaven. The trek leads along the river into the remote Darma valley to the foot of the Panchachuli glacier.",
                                                "routeDescription": "Starts at Dar village near Dharchula, traverses along the roaring Dhauliganga River through Sela and Nagling to Duktu village, and treks into the Panchachuli glacier base camp amphitheatre (4,260m).",
                                                "experience": "Waking up in a wooden homestay in Duktu village to see the five colossal ice pyramids of Panchachuli rising directly above golden barley fields.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Kathgodam to Munsiyari",
                                                                    "description": "Scenic 280 km drive through Almora, Bageshwar, and Birthi Falls to Munsiyari (2,200m).",
                                                                    "elevationMeters": 2200,
                                                                    "distanceKm": 280
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Munsiyari to Dharchula & Drive to Dar",
                                                                    "description": "Drive along the Kali River to Dharchula, then continue up the Dhauliganga valley to Dar village roadhead.",
                                                                    "elevationMeters": 2100,
                                                                    "distanceKm": 90
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Trek Dar to Sela Village",
                                                                    "description": "Trek 9 km through river gorges, waterfalls, and mixed conifer forests to the traditional tribal hamlet of Sela (2,450m).",
                                                                    "elevationMeters": 2450,
                                                                    "distanceKm": 9
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Sela to Nagling to Duktu",
                                                                    "description": "Trek 11 km through alpine birch forests into the open Darma Valley to reach Duktu/Dantu village (3,150m).",
                                                                    "elevationMeters": 3150,
                                                                    "distanceKm": 11
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Duktu to Panchachuli Base Camp & Return",
                                                                    "description": "Hike 4 km to the base of Panchachuli Glacier (4,260m) under peaks I to V. Spend time at the icefall, return to Duktu.",
                                                                    "elevationMeters": 4260,
                                                                    "distanceKm": 8
                                                          },
                                                          {
                                                                    "day": 6,
                                                                    "title": "Duktu to Dar & Return Drive to Munsiyari",
                                                                    "description": "Trek back down the valley to Dar roadhead and drive back to Munsiyari.",
                                                                    "elevationMeters": 2200,
                                                                    "distanceKm": 20
                                                          }
                                                ],
                                                "packingList": [
                                                          "Sturdy waterproof trekking boots with good ankle support",
                                                          "Warm fleece and heavy down jacket (freezing valley winds)",
                                                          "UV 400 sunglasses and wide-brim sun hat",
                                                          "Trekking poles and waterproof daypack cover"
                                                ],
                                                "tips": [
                                                          "Birthi Falls (a 126m cascading waterfall) is a must-see stopover on the mountain road 35 km before reaching Munsiyari.",
                                                          "Munsiyari is the primary center for buying authentic hand-woven Pashmina and sheep-wool shawls crafted by Bhotia weavers."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What does the name Panchachuli mean?",
                                                                    "answer": "It translates to 'Five Chulis' or cooking hearths, referring to the five distinct summits where the Pandavas cooked their final meal."
                                                          },
                                                          {
                                                                    "question": "How high is the highest peak of Panchachuli?",
                                                                    "answer": "Panchachuli II is the highest of the five peaks at an altitude of 6,904 meters (22,651 ft)."
                                                          }
                                                ],
                                                "seoTitle": "Munsiyari & Panchachuli Base Camp (4,260m) — Kumaon Trek & Peaks Guide",
                                                "seoDescription": "Complete guide to Munsiyari and Panchachuli Base Camp Trek (4,260m) in Pithoragarh, Kumaon. 6-day Darma Valley itinerary, 5 epic peaks, maps, and travel advice.",
                                                "keywords": [
                                                          "Munsiyari Panchachuli trek",
                                                          "Panchachuli base camp altitude",
                                                          "Munsiyari hill station",
                                                          "Pithoragarh trekking",
                                                          "Darma Valley trek",
                                                          "Kathgodam to Munsiyari distance"
                                                ]
                                      },
                                      {
                                                "id": "khaliya-top",
                                                "name": "Khaliya Top Ridge Hike",
                                                "type": "day-hike",
                                                "emoji": "🥾",
                                                "coords": [
                                                          30.08,
                                                          80.21
                                                ],
                                                "elevation": "3,500 m (Zero Point at 3,700 m)",
                                                "bestSeason": "March to December (Snow in Jan-Feb)",
                                                "difficulty": "Moderate",
                                                "duration": "1–2 Days",
                                                "distance": "12 km return",
                                                "overview": "A rewarding high-altitude day hike starting from Balati Bend near Munsiyari, climbing through dense rhododendron, oak, and alpine birch forests to an expansive alpine meadow ridge at 3,500m. Khaliya Top offers the closest and most dramatic 360-degree panorama of the Panchachuli range, Mount Nanda Devi, Hardeol, Rajrambha, and into western Nepal's Api and Nampa massifs.",
                                                "experience": "Reaching the open grassy crest of Khaliya Top as the sun breaks over the Panchachuli peaks, illuminating mountain valleys across two nations.",
                                                "tips": [
                                                          "Start your hike from Balati Bend by 7:00 AM; the 6 km uphill trail gains 1,100 meters of vertical elevation.",
                                                          "In April and May, the entire lower trail is ablaze with blooming red and pink rhododendrons."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Can beginners hike to Khaliya Top?",
                                                                    "answer": "Yes, it is a well-trodden day hike suitable for fit beginners, taking approximately 3 to 4 hours to reach the ridge."
                                                          },
                                                          {
                                                                    "question": "Can you camp at Khaliya Top?",
                                                                    "answer": "Yes, there is a KMVN shelter and designated meadow camping areas near Khaliya Top with stunning sunset views."
                                                          }
                                                ],
                                                "seoTitle": "Khaliya Top Trek (3,500m), Munsiyari — Panchachuli Panorama Day Hike Guide",
                                                "seoDescription": "Hike to Khaliya Top (3,500m) from Munsiyari, Pithoragarh. 12km day hike, closest 360° view of Panchachuli & Nanda Devi, rhododendron trails, and camping tips.",
                                                "keywords": [
                                                          "Khaliya Top trek",
                                                          "Khaliya Top altitude",
                                                          "Munsiyari day hikes",
                                                          "Balati Bend to Khaliya",
                                                          "Panchachuli viewpoint",
                                                          "Kumaon ridge treks"
                                                ]
                                      },
                                      {
                                                "id": "milam-glacier",
                                                "name": "Milam Glacier Expedition",
                                                "type": "trek",
                                                "emoji": "🧊",
                                                "coords": [
                                                          30.45,
                                                          80.15
                                                ],
                                                "elevation": "4,267 m",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Difficult",
                                                "duration": "9–10 Days",
                                                "distance": "60 km",
                                                "overview": "One of the most storied trans-Himalayan trail expeditions, the Milam Glacier trek follows the ancient Indo-Tibetan trade route up the rugged Johar Valley along the roaring Goriganga River. Passing through ancient, abandoned stone villages of the Shauka community (Martoli, Burfu, Milam), the trek culminates at the snout of the 37-km long Milam Glacier beneath the colossal peaks of Trishuli (7,074m) and Hardeol (7,151m).",
                                                "routeDescription": "Starts at Munsiyari/Lilam, treks through steep Goriganga river gorges to Bugdiyar, Rilkot, Martoli, and Milam village, and makes an excursion to the glacier snout (4,267m).",
                                                "experience": "Walking through the silent, historic stone ruins of Martoli village under the shadow of Mount Nanda Devi East while Tibetan prayer flags flutter in frontier winds.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Munsiyari to Lilam",
                                                                    "description": "Drive 10 km to Darkot, then begin trekking along the Goriganga river canyon to Lilam village (1,850m).",
                                                                    "elevationMeters": 1850,
                                                                    "distanceKm": 9
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Lilam to Bugdiyar",
                                                                    "description": "Steep, cliff-cut trail through deep rock gorges and roaring river rapids to Bugdiyar (2,500m).",
                                                                    "elevationMeters": 2500,
                                                                    "distanceKm": 12
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Bugdiyar to Rilkot",
                                                                    "description": "Trek past waterfalls and opening valleys to the ancient trade crossroads of Rilkot (3,130m).",
                                                                    "elevationMeters": 3130,
                                                                    "distanceKm": 12
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Rilkot to Martoli to Burfu",
                                                                    "description": "Trek into the wide Johar Valley. Visit the historic stone settlement of Martoli with views of Nanda Devi East. Camp at Burfu (3,300m).",
                                                                    "elevationMeters": 3300,
                                                                    "distanceKm": 12
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Burfu to Milam Village",
                                                                    "description": "Trek through high trans-Himalayan desert landscapes to Milam (3,950m), once the largest trading village on the Indo-Tibetan route.",
                                                                    "elevationMeters": 3950,
                                                                    "distanceKm": 8
                                                          },
                                                          {
                                                                    "day": 6,
                                                                    "title": "Milam to Milam Glacier Snout & Return",
                                                                    "description": "Trek 5 km along the lateral moraine to the colossal snout of Milam Glacier (4,267m) beneath Mount Trishuli and Hardeol. Return to Milam.",
                                                                    "elevationMeters": 4267,
                                                                    "distanceKm": 10
                                                          },
                                                          {
                                                                    "day": 7,
                                                                    "title": "Milam to Rilkot",
                                                                    "description": "Begin the return march down the Johar Valley to Rilkot campsite.",
                                                                    "elevationMeters": 3130,
                                                                    "distanceKm": 16
                                                          },
                                                          {
                                                                    "day": 8,
                                                                    "title": "Rilkot to Bugdiyar",
                                                                    "description": "Descend through the Goriganga gorge back to Bugdiyar.",
                                                                    "elevationMeters": 2500,
                                                                    "distanceKm": 12
                                                          },
                                                          {
                                                                    "day": 9,
                                                                    "title": "Bugdiyar to Lilam & Drive to Munsiyari",
                                                                    "description": "Final trek back to Lilam roadhead and drive to Munsiyari.",
                                                                    "elevationMeters": 2200,
                                                                    "distanceKm": 14
                                                          }
                                                ],
                                                "packingList": [
                                                          "Heavy-duty trekking boots with ankle support and vibram sole",
                                                          "Sub-zero down jacket (-10°C) and windproof hard shell",
                                                          "Trekking poles, water purification tablets, and first-aid kit",
                                                          "Valid Inner Line Permit (ILP) and multiple photocopies"
                                                ],
                                                "tips": [
                                                          "Inner Line Permits (ILP) issued by the SDM office in Munsiyari or Pithoragarh are strictly mandatory for all trekkers.",
                                                          "Explore the historic Sun Temple and fort ruins in the abandoned trade village of Martoli."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Why was Milam village famous in Himalayan history?",
                                                                    "answer": "Before the 1962 Sino-Indian border closure, Milam was a thriving commercial trading hub where Shauka merchants traded salt, wool, and borax across the high passes with Tibet."
                                                          },
                                                          {
                                                                    "question": "How long is the Milam Glacier?",
                                                                    "answer": "Milam Glacier is one of the largest glaciers in Kumaon, measuring approximately 37 kilometers in length and spanning an area of 50 square kilometers."
                                                          }
                                                ],
                                                "seoTitle": "Milam Glacier Trek (4,267m), Pithoragarh — Historic Johar Valley Expedition",
                                                "seoDescription": "Complete guide to Milam Glacier Trek (4,267m) in Pithoragarh, Kumaon. 9-day Indo-Tibetan trade trail, Martoli ruins, Mount Trishuli views, permits, and maps.",
                                                "keywords": [
                                                          "Milam Glacier trek",
                                                          "Johar Valley Uttarakhand",
                                                          "Milam Glacier altitude",
                                                          "Martoli village Nanda Devi",
                                                          "Munsiyari to Milam",
                                                          "Indo-Tibetan trade route trek"
                                                ]
                                      },
                                      {
                                                "id": "adi-kailash-om-parvat",
                                                "name": "Adi Kailash & Om Parvat Sacred Circuit",
                                                "type": "spiritual",
                                                "emoji": "🏔️",
                                                "coords": [
                                                          30.316,
                                                          80.633
                                                ],
                                                "elevation": "5,945 m (Adi Kailash) / 4,497 m (Parvati Sarovar)",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Difficult",
                                                "duration": "7–8 Days",
                                                "distance": "Road expedition & short hikes",
                                                "overview": "One of the most sacred pilgrimage expeditions in high Asia, traversing the remote Vyas and Darma valleys near the Indo-Tibetan border in northeastern Pithoragarh. The journey visits Adi Kailash (revered as Chhota Kailash) towering above the sacred emerald waters of Parvati Sarovar, and Om Parvat (6,191m)—a miraculous mountain where natural snow deposits carve the sacred Hindu syllable 'OM' across black granite.",
                                                "experience": "Standing on the shores of Parvati Sarovar watching the reflection of Adi Kailash's snow peak while prayer flags snap in icy winds along the Tibetan frontier.",
                                                "tips": [
                                                          "Inner Line Permits (ILP) and medical fitness certificates are strictly mandatory; process paperwork in Dharchula or through KMVN.",
                                                          "The newly opened BRO border road allows 4x4 vehicles to reach Gunji, Nabi, and close to Parvati Sarovar, drastically reducing walking distances."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is the phenomenon of Om Parvat?",
                                                                    "answer": "On Mount Om Parvat (6,191m), natural snow deposition on the dark rock face spontaneously forms the sacred Hindu Sanskrit symbol 'ॐ' (OM) without human intervention."
                                                          },
                                                          {
                                                                    "question": "How is Adi Kailash different from Mount Kailash in Tibet?",
                                                                    "answer": "Adi Kailash (5,945m) is located within Indian territory in Uttarakhand and is considered the primordial (Adi) abode of Lord Shiva, second in reverence only to Mount Kailash in Tibet."
                                                          }
                                                ],
                                                "seoTitle": "Adi Kailash & Om Parvat (5,945m), Pithoragarh — Sacred Circuit & Route Guide",
                                                "seoDescription": "Complete guide to the Adi Kailash & Om Parvat expedition in Pithoragarh, Kumaon. Sacred Parvati Sarovar, Gunji, Lipulekh border road, permits, and pilgrimage route.",
                                                "keywords": [
                                                          "Adi Kailash trek",
                                                          "Om Parvat Pithoragarh",
                                                          "Chhota Kailash altitude",
                                                          "Parvati Sarovar lake",
                                                          "Dharchula to Adi Kailash",
                                                          "Adi Kailash permits inner line"
                                                ]
                                      },
                                      {
                                                "id": "chaukori",
                                                "name": "Chaukori Tea Gardens & Western Views",
                                                "type": "scenic",
                                                "emoji": "🍵",
                                                "coords": [
                                                          29.873,
                                                          80.024
                                                ],
                                                "elevation": "2,010 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "Perched high on a bowl-shaped ridge in upper Pithoragarh, Chaukori is renowned for emerald British-era tea plantations, fragrant deodar and pine groves, and an unobstructed panoramic balcony view of the central Himalayan crest: Nanda Devi, Nanda Kot, and the Panchachuli peaks.",
                                                "experience": "Watching the golden rays of dawn touch the five distinct summits of the Panchachuli range across mist-filled valleys while sipping fresh Kumaoni tea.",
                                                "tips": [
                                                          "Climb the KMVN watchtower at sunrise for an elevated 360-degree panorama of the snow peaks stretching from western Nepal to Garhwal.",
                                                          "Visit the historic Berinag tea gardens and the ancient Snake Temples (Nag Devta) located 10 km down the ridge."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What peaks are visible from Chaukori?",
                                                                    "answer": "Chaukori offers magnificent views of Nanda Devi, Nanda Kot, Trishul, Chaukhamba, and the entire five-peak Panchachuli massif."
                                                          },
                                                          {
                                                                    "question": "How do you reach Chaukori?",
                                                                    "answer": "Chaukori is accessible by road from Kathgodam (180 km via Almora and Bageshwar) or from Pithoragarh town (85 km)."
                                                          }
                                                ],
                                                "seoTitle": "Chaukori (2,010m), Pithoragarh — Tea Gardens & Nanda Devi Panoramas",
                                                "seoDescription": "Discover Chaukori (2,010m) in Pithoragarh, Kumaon. Historic mountain tea gardens, unmatched sunrise views over Nanda Devi & Panchachuli, and serene stays.",
                                                "keywords": [
                                                          "Chaukori Pithoragarh",
                                                          "Chaukori tea gardens",
                                                          "Chaukori altitude",
                                                          "Nanda Devi view Chaukori",
                                                          "Chaukori best time to visit",
                                                          "Kumaon hill stations"
                                                ]
                                      },
                                      {
                                                "id": "patal-bhuvaneshwar",
                                                "name": "Patal Bhuvaneshwar Subterranean Cave Shrine",
                                                "type": "spiritual",
                                                "emoji": "🪨",
                                                "coords": [
                                                          29.684,
                                                          80.093
                                                ],
                                                "elevation": "1,350 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Moderate",
                                                "duration": "Half Day",
                                                "overview": "An extraordinary 160-meter long limestone cave shrine plunged 90 feet beneath the earth near Gangolihat in Pithoragarh district. Described in the ancient Skanda Purana, the cave features dramatic stalactite and stalagmite formations worshipped as representations of 33 crore Hindu deities, Sheshnag, the matted hair of Lord Shiva, and the wish-granting Kalpavriksha tree.",
                                                "experience": "Descending through a narrow, near-vertical rock tunnel holding iron chains to enter a cavernous subterranean hall lit by lamps where ancient limestone formations depict cosmic legends.",
                                                "tips": [
                                                          "Visitors must climb down 90 feet holding onto secured iron chains; comfortable walking shoes with good grip are essential.",
                                                          "Not recommended for individuals with severe claustrophobia, breathing difficulties, or mobility limitations."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How deep is Patal Bhuvaneshwar cave?",
                                                                    "answer": "The cave descends approximately 90 feet beneath the ground level and extends over 160 meters through interconnected subterranean chambers."
                                                          },
                                                          {
                                                                    "question": "Who discovered Patal Bhuvaneshwar?",
                                                                    "answer": "According to legend, King Ritupurna discovered the cave in Treta Yuga, and Adi Shankaracharya consecrated the underground shrine in 1191 AD."
                                                          }
                                                ],
                                                "seoTitle": "Patal Bhuvaneshwar (1,350m), Pithoragarh — Ancient Limestone Cave Temple",
                                                "seoDescription": "Visitor guide to Patal Bhuvaneshwar cave temple (1,350m) in Pithoragarh, Kumaon. 90-foot underground limestone shrine, stalactite formations, timings, and mythology.",
                                                "keywords": [
                                                          "Patal Bhuvaneshwar cave",
                                                          "Pithoragarh cave temple",
                                                          "Patal Bhuvaneshwar timings",
                                                          "underground temple Uttarakhand",
                                                          "Gangolihat to Patal Bhuvaneshwar",
                                                          "Skanda Purana cave"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "bageshwar",
                            "name": "Bageshwar",
                            "tagline": "Pioneering glacier valleys, Katyuri stone heritage, and Himalayan river confluences",
                            "division": "Kumaon",
                            "places": [
                                      {
                                                "id": "pindari-glacier",
                                                "name": "Pindari Glacier Trek",
                                                "type": "trek",
                                                "emoji": "🧊",
                                                "coords": [
                                                          30.26,
                                                          79.98
                                                ],
                                                "elevation": "3,860 m (Zero Point)",
                                                "bestSeason": "April to June, September to November",
                                                "difficulty": "Moderate",
                                                "duration": "6 Days",
                                                "distance": "45 km",
                                                "overview": "One of the oldest and most celebrated glacier treks in the Indian Himalayas, Pindari Glacier has captivated mountain explorers for over a century. Walking through the pristine Pindar River gorge from the roadhead at Kharkiya, the trail ascends past traditional wooden villages (Lohar Khet, Khati) and dense rhododendron forests to Zero Point (3,860m), directly facing the vast icefall of Pindari Glacier wedged between Mount Nanda Devi and Nanda Kot.",
                                                "routeDescription": "Begins at Kharkiya roadhead, treks 4 km to Khati (the last inhabited village), continues through Dwali and Phurkia, and reaches Zero Point (3,860m) facing the Pindari icefall.",
                                                "experience": "Standing at Zero Point watching colossal chunks of blue glacial ice calving into the Pindar River source beneath the sheer south wall of Nanda Devi.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Kathgodam to Bageshwar to Kharkiya",
                                                                    "description": "Scenic drive from Kathgodam through Bageshwar and Kapkot to the roadhead at Kharkiya (2,200m).",
                                                                    "elevationMeters": 2200,
                                                                    "distanceKm": 210
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Kharkiya to Khati Village",
                                                                    "description": "Trek 4 km through beautiful rhododendron forests to Khati (2,210m), the largest and last village on the trail.",
                                                                    "elevationMeters": 2210,
                                                                    "distanceKm": 4
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Khati to Dwali",
                                                                    "description": "Trek 11 km along the roaring Pindar River gorge to Dwali (2,575m) at the confluence of Pindari and Kafni rivers.",
                                                                    "elevationMeters": 2575,
                                                                    "distanceKm": 11
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Dwali to Phurkia",
                                                                    "description": "Gradual 5 km uphill hike through birch forests and alpine meadows to Phurkia (3,260m).",
                                                                    "elevationMeters": 3260,
                                                                    "distanceKm": 5
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Phurkia to Zero Point & Return to Dwali",
                                                                    "description": "Early morning 7 km trek to Zero Point (3,860m) facing the Pindari Glacier icefall. Return via Phurkia to Dwali.",
                                                                    "elevationMeters": 3860,
                                                                    "distanceKm": 14
                                                          },
                                                          {
                                                                    "day": 6,
                                                                    "title": "Dwali to Kharkiya & Drive to Bageshwar",
                                                                    "description": "Trek back through Khati to Kharkiya roadhead, followed by drive to Bageshwar or Kathgodam.",
                                                                    "elevationMeters": 2200,
                                                                    "distanceKm": 15
                                                          }
                                                ],
                                                "packingList": [
                                                          "Trekking shoes with sturdy ankle support and water resistance",
                                                          "Warm fleece layers and down jacket (sub-zero temperatures at Zero Point)",
                                                          "Rain poncho and backpack rain cover",
                                                          "Trekking poles with rubber tips"
                                                ],
                                                "tips": [
                                                          "Khati is famous for traditional wooden stone houses and homestays; take time to interact with local Kumaoni families.",
                                                          "Start the hike from Phurkia to Zero Point before 6:00 AM to enjoy clear views of the glacier before afternoon clouds roll in."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How long is Pindari Glacier?",
                                                                    "answer": "The glacier is approximately 3.2 kilometers long and 1.5 kilometers wide, feeding the sacred Pindar River which joins the Alaknanda at Karnaprayag."
                                                          },
                                                          {
                                                                    "question": "Is Pindari Glacier suitable for first-time glacier trekkers?",
                                                                    "answer": "Yes, it is considered one of the most accessible glacier treks in India, with well-established trails, KMVN rest houses, and manageable gradients."
                                                          }
                                                ],
                                                "seoTitle": "Pindari Glacier Trek (3,860m), Bageshwar — Zero Point Itinerary & Route",
                                                "seoDescription": "Complete guide to Pindari Glacier Trek (3,860m) in Bageshwar, Kumaon. 6-day itinerary to Zero Point, Khati village, Pindar river valley, Nanda Kot views, and maps.",
                                                "keywords": [
                                                          "Pindari Glacier trek",
                                                          "Pindari Zero Point altitude",
                                                          "Bageshwar trekking",
                                                          "Khati village Kumaon",
                                                          "Pindari glacier itinerary",
                                                          "Nanda Devi glacier treks"
                                                ]
                                      },
                                      {
                                                "id": "kausani",
                                                "name": "Kausani Panoramic Himalayan Balcony",
                                                "type": "scenic",
                                                "emoji": "🏔️",
                                                "coords": [
                                                          29.854,
                                                          79.601
                                                ],
                                                "elevation": "1,890 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "Dubbed the 'Switzerland of India' by Mahatma Gandhi who stayed here in 1929 and composed his treatise on Anasakti Yoga, Kausani perches on a high pine ridge in Bageshwar district. It commands a world-famous, 300-kilometer uninterrupted panoramic vista of Himalayan peaks including Mount Trishul, Nanda Devi, and Panchachuli, complemented by tea estates and peaceful ashrams.",
                                                "experience": "Watching the evening alpenglow turn the glaciated 7,000-meter wall of Mount Trishul from fiery amber to deep purple from the terrace of Anasakti Ashram.",
                                                "tips": [
                                                          "Visit the Anasakti Ashram (Gandhi Ashram) at sunrise to view the Himalayan range and browse Gandhi's personal photographs and library.",
                                                          "Tour the organic Kausani Tea Estate (spanning 200 hectares) to taste freshly plucked high-grown orthodox black tea."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What major peaks can be seen from Kausani?",
                                                                    "answer": "Trishul (7,120m), Nanda Devi (7,816m), Nanda Kot, Kamet, Chaukhamba, and the five peaks of Panchachuli are visible across the horizon."
                                                          },
                                                          {
                                                                    "question": "Who was born in Kausani?",
                                                                    "answer": "Famous Hindi poet Sumitranandan Pant was born in Kausani; his ancestral home has been preserved as a museum housing his manuscripts."
                                                          }
                                                ],
                                                "seoTitle": "Kausani (1,890m), Bageshwar — 300km Himalayan Panorama & Gandhi Ashram",
                                                "seoDescription": "Explore Kausani (1,890m) in Bageshwar, Kumaon. 300km panoramic views of Trishul & Nanda Devi, Anasakti (Gandhi) Ashram, tea gardens, and sunset viewpoints.",
                                                "keywords": [
                                                          "Kausani Uttarakhand",
                                                          "Kausani altitude",
                                                          "Switzerland of India Kausani",
                                                          "Trishul Nanda Devi view",
                                                          "Anasakti Ashram Kausani",
                                                          "Kausani tea estate"
                                                ]
                                      },
                                      {
                                                "id": "baijnath",
                                                "name": "Baijnath Temple Complex & Gomti Basin",
                                                "type": "spiritual",
                                                "emoji": "🛕",
                                                "coords": [
                                                          29.908,
                                                          79.617
                                                ],
                                                "elevation": "1,126 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "Half Day",
                                                "overview": "Sited on the left bank of the Gomti River 16 km from Kausani in Bageshwar district, Baijnath is a magnificent 12th-century stone temple complex built by the Katyuri kings who ruled Kumaon. Dedicated to Lord Shiva (Vaidyanatha), the main sanctum houses an exquisitely detailed, unblemished black stone idol of Goddess Parvati.",
                                                "experience": "Feeding golden carp fish in the sacred Gomti river pool directly outside ancient 12th-century stone Nagara temples while evening aarti bells chime.",
                                                "tips": [
                                                          "Admire the rare black stone idol of Goddess Parvati in the main temple sanctum, celebrated for its masterly 12th-century stone carving.",
                                                          "Visit the artificial Baijnath lake constructed along the Gomti River for scenic promenade strolls and paddle boating."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Who built the Baijnath temple complex?",
                                                                    "answer": "The temples were constructed in 1150 AD by the Katyuri dynasty who had established their capital in the fertile Baijnath valley (then called Kartikeyapura)."
                                                          },
                                                          {
                                                                    "question": "How far is Baijnath from Kausani?",
                                                                    "answer": "Baijnath is located approximately 16 kilometers northeast of Kausani, easily accessible in 30 minutes by taxi or local bus."
                                                          }
                                                ],
                                                "seoTitle": "Baijnath Temples (1,126m), Bageshwar — 12th-Century Katyuri Heritage Guide",
                                                "seoDescription": "Discover Baijnath Temple Complex (1,126m) in Bageshwar, Kumaon. Ancient 12th-century Katyuri stone shrines on Gomti riverbank, black stone Parvati idol, and history.",
                                                "keywords": [
                                                          "Baijnath temple Bageshwar",
                                                          "Katyuri dynasty temples",
                                                          "Gomti river Baijnath",
                                                          "Baijnath Uttarakhand altitude",
                                                          "Kausani to Baijnath distance",
                                                          "ancient temples Kumaon"
                                                ]
                                      },
                                      {
                                                "id": "kafni-glacier",
                                                "name": "Kafni Glacier Trek",
                                                "type": "trek",
                                                "emoji": "🧊",
                                                "coords": [
                                                          30.22,
                                                          80.03
                                                ],
                                                "elevation": "3,860 m",
                                                "bestSeason": "May to June, September to October",
                                                "difficulty": "Moderate",
                                                "duration": "7 Days",
                                                "distance": "48 km",
                                                "overview": "Branching east from the Pindari trail at Dwali, the Kafni Glacier trek leads into a wilder, broader, and far less frequented alpine valley beneath the glaciated foot of Mount Nanda Kot (6,860m). The route crosses vibrant alpine bugyals carpeted in wild anemones and gentians to reach the lateral moraine of Kafni Glacier at 3,860m.",
                                                "routeDescription": "Shares the Pindari trail from Kharkiya to Dwali via Khati, then branches southeast along the Kafni River through Khatia to the terminal moraine of Kafni Glacier (3,860m).",
                                                "experience": "The vast alpine solitude of the Kafni river basin where wide meadows blanketed in yellow Himalayan poppies give way to the glaciated mass of Mount Nanda Kot.",
                                                "itinerary": [
                                                          {
                                                                    "day": 1,
                                                                    "title": "Kathgodam to Kharkiya & Trek to Khati",
                                                                    "description": "Drive to Kharkiya roadhead and trek 4 km to Khati village (2,210m).",
                                                                    "elevationMeters": 2210,
                                                                    "distanceKm": 4
                                                          },
                                                          {
                                                                    "day": 2,
                                                                    "title": "Khati to Dwali",
                                                                    "description": "Trek 11 km along the river gorge to the trail junction of Dwali (2,575m).",
                                                                    "elevationMeters": 2575,
                                                                    "distanceKm": 11
                                                          },
                                                          {
                                                                    "day": 3,
                                                                    "title": "Dwali to Khatia",
                                                                    "description": "Branch southeast into the Kafni valley, trekking 8 km through birch forests to Khatia campsite (3,200m).",
                                                                    "elevationMeters": 3200,
                                                                    "distanceKm": 8
                                                          },
                                                          {
                                                                    "day": 4,
                                                                    "title": "Khatia to Kafni Glacier Snout & Return to Dwali",
                                                                    "description": "Trek 5 km to the snout of Kafni Glacier (3,860m) under Nanda Kot peak. Descend to Dwali camp.",
                                                                    "elevationMeters": 3860,
                                                                    "distanceKm": 13
                                                          },
                                                          {
                                                                    "day": 5,
                                                                    "title": "Dwali to Khati to Kharkiya",
                                                                    "description": "Trek back down the valley through Khati to Kharkiya roadhead.",
                                                                    "elevationMeters": 2200,
                                                                    "distanceKm": 15
                                                          }
                                                ],
                                                "packingList": [
                                                          "Waterproof trekking shoes with ankle protection",
                                                          "Warm sleeping bag and thermal layers for high meadow camps",
                                                          "Raincoat or poncho and waterproof backpack cover",
                                                          "Trekking poles and headlamp"
                                                ],
                                                "tips": [
                                                          "Kafni Valley is broader and receives fewer tourists than Pindari, offering exceptional high-altitude wild camping experiences.",
                                                          "Trekkers can combine both Pindari and Kafni glaciers into an extended 8-day expedition starting from Dwali."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How does Kafni Glacier differ from Pindari Glacier?",
                                                                    "answer": "While Pindari lies in a steep, narrow canyon, the Kafni valley is significantly wider and more open, dominated by the massif of Mount Nanda Kot."
                                                          },
                                                          {
                                                                    "question": "What river originates from Kafni Glacier?",
                                                                    "answer": "The Kafni River originates here, which joins the Pindar River at Dwali."
                                                          }
                                                ],
                                                "seoTitle": "Kafni Glacier Trek (3,860m), Bageshwar — Wild Kumaon Alpine Itinerary",
                                                "seoDescription": "Guide to Kafni Glacier Trek (3,860m) in Bageshwar, Kumaon. Less-traveled glacial valley beneath Mount Nanda Kot, Dwali junction, 7-day itinerary, and trail maps.",
                                                "keywords": [
                                                          "Kafni Glacier trek",
                                                          "Kafni glacier altitude",
                                                          "Nanda Kot base trek",
                                                          "Dwali to Kafni",
                                                          "Bageshwar high altitude treks",
                                                          "Pindari vs Kafni glacier"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "almora",
                            "name": "Almora",
                            "tagline": "Ancient Katyuri temple enclaves, sacred geomagnetic ridges, and colonial cantonments",
                            "division": "Kumaon",
                            "places": [
                                      {
                                                "id": "binsar-wildlife-sanctuary",
                                                "name": "Binsar Wildlife Sanctuary & Zero Point",
                                                "type": "scenic",
                                                "emoji": "🦅",
                                                "coords": [
                                                          29.704,
                                                          79.749
                                                ],
                                                "elevation": "2,420 m (Zero Point)",
                                                "bestSeason": "Year-round (Best: October to May)",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "Perched atop the Jhandi Dhar hills 30 km north of Almora, Binsar was the historic summer capital of the Chand kings of Kumaon. Today a protected sanctuary spanning 47 square kilometers of dense oak, rhododendron, and pine forests, Binsar is a world-class birdwatching reserve with over 200 avian species. The short forest hike to Zero Point commands an intimate 300-km panoramic vista of Kedarnath, Shivling, Trishul, and Nanda Devi.",
                                                "experience": "The call of barking deer echoing through foggy oak and moss-draped rhododendron forests on the morning walk up to Zero Point.",
                                                "tips": [
                                                          "Wake early to walk the 2 km trail from Binsar Forest Rest House to Zero Point to witness the morning sun turn Nanda Devi and Trishul golden yellow.",
                                                          "Visit the ancient 10th-century Bineshwar Mahadev Temple situated near the entry gate of the sanctuary."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What wildlife is found in Binsar Sanctuary?",
                                                                    "answer": "Leopards, barking deer, Himalayan black bears, wild boars, flying squirrels, and over 200 bird species including fork-tailed jays and monals."
                                                          },
                                                          {
                                                                    "question": "Can private vehicles drive inside Binsar Sanctuary?",
                                                                    "answer": "Yes, vehicles can drive up to the KMVN Tourist Rest House (TRH) inside the sanctuary upon paying entry fees at the Forest Checkpost."
                                                          }
                                                ],
                                                "seoTitle": "Binsar Wildlife Sanctuary (2,420m), Almora — Zero Point & Birding Guide",
                                                "seoDescription": "Complete guide to Binsar Wildlife Sanctuary (2,420m) in Almora, Kumaon. Zero Point Himalayan viewpoint, dense oak-rhododendron forest hikes, birding, and heritage stays.",
                                                "keywords": [
                                                          "Binsar Wildlife Sanctuary",
                                                          "Zero Point Binsar altitude",
                                                          "Almora to Binsar distance",
                                                          "Binsar bird watching",
                                                          "Nanda Devi view Binsar",
                                                          "Kumaon forest sanctuaries"
                                                ]
                                      },
                                      {
                                                "id": "jageshwar-dham",
                                                "name": "Jageshwar Dham Temple Complex",
                                                "type": "spiritual",
                                                "emoji": "🛕",
                                                "coords": [
                                                          29.638,
                                                          79.845
                                                ],
                                                "elevation": "1,870 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "1 Day",
                                                "overview": "Nestled in a serene, narrow mountain valley shaded by colossal deodar trees 36 km northeast of Almora, Jageshwar Dham is a cluster of over 124 stone temples dating from the 7th to 14th centuries (Katyuri and Chand dynasties). Believed to be the site of the first of the twelve Jyotirlingas (Nagesh Jyotirlinga), it is one of the most venerable Shaivite pilgrimage sites in the Himalayas.",
                                                "experience": "The smell of ancient deodar cedar wood and burning butter lamps in a tranquil stone courtyard surrounded by over a hundred 1,000-year-old Nagara shrines.",
                                                "tips": [
                                                          "Visit the Archaeological Survey of India (ASI) Museum on-site to view priceless 9th-century stone sculptures, including the famous 'Poutik Raja' idol.",
                                                          "Do not miss the ancient Maha Mrityunjaya Temple—the oldest shrine in the cluster—dedicated to overcoming the fear of death."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Why is Jageshwar considered sacred in Hinduism?",
                                                                    "answer": "It is believed to be the spot where the tradition of worshipping Lord Shiva in the form of a Linga began, and is associated with Sage Vashistha and Adi Shankaracharya."
                                                          },
                                                          {
                                                                    "question": "How far is Jageshwar Dham from Almora?",
                                                                    "answer": "Jageshwar is located approximately 36 kilometers northeast of Almora along a scenic forest road (about 1 hour drive)."
                                                          }
                                                ],
                                                "seoTitle": "Jageshwar Dham (1,870m), Almora — 124 Ancient Stone Temples Guide",
                                                "seoDescription": "Explore Jageshwar Dham (1,870m) in Almora, Uttarakhand. 124 ancient 7th-century Nagara stone temples in deep deodar forests, Jyotirlinga heritage, and visiting tips.",
                                                "keywords": [
                                                          "Jageshwar Dham Almora",
                                                          "Jageshwar temple timings",
                                                          "Jageshwar altitude",
                                                          "Nagara architecture Uttarakhand",
                                                          "Almora pilgrimage places",
                                                          "ancient Shiva temples Kumaon"
                                                ]
                                      },
                                      {
                                                "id": "ranikhet",
                                                "name": "Ranikhet Chaubatia Pine Meadows",
                                                "type": "scenic",
                                                "emoji": "🌲",
                                                "coords": [
                                                          29.643,
                                                          79.432
                                                ],
                                                "elevation": "1,869 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "2 Days",
                                                "overview": "The 'Queen's Meadow', Ranikhet is a colonial hill station and headquarters of the Indian Army's Kumaon Regiment, set amongst dense pine, oak, and deodar forests in Almora district. It features the sprawling Chaubatia apple and peach orchards, the 9-hole Upat Golf Course (one of India's highest), and sweeping views of western Himalayan peaks.",
                                                "experience": "Playing golf on emerald mountain fairways lined by giant pine trees while the glaciated peak of Mount Trishul shines in the background.",
                                                "tips": [
                                                          "Visit Chaubatia Gardens (10 km from town) to sample fresh apple juice, honey, and jams produced in the government fruit research center.",
                                                          "Explore the Kumaon Regimental Centre Museum to view battlefield trophies, gallantry awards, and war heritage dating back to the 18th century."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How did Ranikhet get its name?",
                                                                    "answer": "According to legend, Rani Padmini, queen of the Katyuri ruler Raja Sukhel Dev, fell in love with this mountain clearing and made it her residence, hence 'Ranikhet' (Queen's Meadow)."
                                                          },
                                                          {
                                                                    "question": "How far is Ranikhet from Kathgodam railway station?",
                                                                    "answer": "Ranikhet is located approximately 80 kilometers from Kathgodam, reachable in about 2.5 to 3 hours by taxi."
                                                          }
                                                ],
                                                "seoTitle": "Ranikhet (1,869m), Almora — Chaubatia Orchards, Golf Course & Pines",
                                                "seoDescription": "Discover Ranikhet (1,869m) in Almora, Kumaon. Chaubatia apple orchards, historic Kumaon Regiment museum, high-altitude golf course, and pine forest walks.",
                                                "keywords": [
                                                          "Ranikhet Almora",
                                                          "Chaubatia orchards Ranikhet",
                                                          "Ranikhet altitude",
                                                          "Ranikhet golf course",
                                                          "Kumaon hill stations",
                                                          "Delhi to Ranikhet road"
                                                ]
                                      },
                                      {
                                                "id": "kasar-devi",
                                                "name": "Kasar Devi Ridge & Magnetosphere",
                                                "type": "spiritual",
                                                "emoji": "✨",
                                                "coords": [
                                                          29.638,
                                                          79.664
                                                ],
                                                "elevation": "2,116 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "Perched on a craggy ridge 8 km north of Almora, Kasar Devi is an ancient 2nd-century rock shrine celebrated for an extraordinary geomagnetic anomaly. Situated under the Van Allen radiation belt (a rare electromagnetic field shared with Stonehenge and Machu Picchu), Kasar Devi has been a spiritual and bohemian magnet, attracting Swami Vivekananda, Timothy Leary, Bob Dylan, and DH Lawrence to what became famous as 'Crank's Ridge'.",
                                                "experience": "The strange, meditative silence atop Kasar Devi ridge as the sunset paints the sky orange and the twinkling lights of Hawalbagh valley glow below.",
                                                "tips": [
                                                          "Sit in silent meditation inside the small cave where Swami Vivekananda meditated in 1890.",
                                                          "The ridge cafes along Crank's Ridge offer delicious local herbal teas, wood-fired pizzas, and panoramic sunset balconies."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is the scientific anomaly at Kasar Devi?",
                                                                    "answer": "NASA research confirmed that Kasar Devi falls on an enormous geomagnetic field under the Earth's Van Allen belt, creating an unusually calm, high-vibration environment that aids meditation."
                                                          },
                                                          {
                                                                    "question": "What was 'Crank's Ridge'?",
                                                                    "answer": "In the 1960s and 70s, the ridge became a bohemian haven for western writers, mystics, artists, and beat poets exploring meditation and consciousness."
                                                          }
                                                ],
                                                "seoTitle": "Kasar Devi & Crank's Ridge (2,116m), Almora — Cosmic Energy & Sunset Guide",
                                                "seoDescription": "Visitor guide to Kasar Devi (2,116m) in Almora, Kumaon. Van Allen belt geomagnetic anomaly, Crank's Ridge bohemian heritage, Swami Vivekananda cave, and sunset ridge.",
                                                "keywords": [
                                                          "Kasar Devi temple Almora",
                                                          "Crank's Ridge Almora",
                                                          "Kasar Devi altitude",
                                                          "geomagnetic field Kasar Devi",
                                                          "Swami Vivekananda Almora",
                                                          "Kasar Devi sunset point"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "nainital",
                            "name": "Nainital",
                            "tagline": "Glittering highland lakes, colonial promenades, and birding oak forests",
                            "division": "Kumaon",
                            "places": [
                                      {
                                                "id": "nainital-naina-peak",
                                                "name": "Nainital Lake & Naina Peak",
                                                "type": "scenic",
                                                "emoji": "⛵",
                                                "coords": [
                                                          29.3919,
                                                          79.4542
                                                ],
                                                "elevation": "1,938 m (Lake) / 2,615 m (Naina Peak)",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy to Moderate",
                                                "duration": "2 Days",
                                                "overview": "The jewel of Kumaon's lake district, Nainital sits in an eye-shaped valley encircling the emerald waters of Naini Lake. Flanked by colonial promenades and the sacred Naina Devi temple (a prominent Shakti Peetha), the town's highest summit—Naina Peak (Cheena Peak at 2,615m)—offers a rewarding 6 km day-hike through rhododendron forests with sweeping views of the northern snow peaks and the lake basin below.",
                                                "experience": "Rowing a wooden boat across the glassy emerald surface of Naini Lake as mist descends over the surrounding forested slopes of Ayarpatta and Sher-ka-Danda.",
                                                "tips": [
                                                          "Hike up to Naina Peak (Cheena Peak) early in the morning for the finest aerial view of Nainital Lake and the snow peaks from Bandarpoonch to Api.",
                                                          "Visit the sacred Naina Devi Temple located on the northern shore (Mallital) where Goddess Sati's eye (Naina) fell."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How long does the hike to Naina Peak take?",
                                                                    "answer": "The 6 km uphill trail from Mallital takes approximately 2 to 2.5 hours through oak and rhododendron forests."
                                                          },
                                                          {
                                                                    "question": "What lakes are located near Nainital?",
                                                                    "answer": "Bhimtal (with an island aquarium), Sattal (seven interconnected lakes), and Naukuchiatal (nine-cornered lake) are within a 25 km radius."
                                                          }
                                                ],
                                                "seoTitle": "Nainital Lake & Naina Peak (2,615m) — Boating, Trails & Viewpoint Guide",
                                                "seoDescription": "Complete guide to Nainital (1,938m) and Naina Peak hike (2,615m). Naini Lake boating, Mall Road, Naina Devi temple, Snow View cable car, and travel advice.",
                                                "keywords": [
                                                          "Nainital lake Uttarakhand",
                                                          "Naina Peak trek distance",
                                                          "Nainital altitude",
                                                          "boating Naini Lake",
                                                          "Nainital best time to visit",
                                                          "Kumaon lake district"
                                                ]
                                      },
                                      {
                                                "id": "mukteshwar",
                                                "name": "Mukteshwar Ridge & Chauli Ki Jali",
                                                "type": "adventure",
                                                "emoji": "🧗",
                                                "coords": [
                                                          29.472,
                                                          79.647
                                                ],
                                                "elevation": "2,171 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "2 Days",
                                                "overview": "A peaceful hilltop destination situated 50 km from Nainital at 2,171m, surrounded by fruit orchards and coniferous forests. Famous for the 350-year-old Mukteshwar Dham Shiva temple atop the highest point, and the adjacent overhanging cliffs of Chauli Ki Jali—a dramatic rocky precipice popular for rock climbing, rappelling, and unobstructed vistas of Nanda Devi.",
                                                "experience": "Standing on the dizzying rocky lip of Chauli Ki Jali looking down into deep pine-covered river valleys while Himalayan griffons soar on thermals below.",
                                                "tips": [
                                                          "Try rock climbing and zip-lining organized by certified adventure instructors at the natural rock faces of Chauli Ki Jali.",
                                                          "Visit during May and June to pluck fresh apricots, plums, and peaches from local hillside orchards."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is Chauli Ki Jali in Mukteshwar?",
                                                                    "answer": "Chauli Ki Jali is a natural rock cliff overhang with natural circular holes in the rock, steeped in folklore as a fertility shrine and offering panoramic valley views."
                                                          },
                                                          {
                                                                    "question": "What peaks are visible from Mukteshwar?",
                                                                    "answer": "Mount Nanda Devi, Trishul, Nanda Ghunti, and the Panchachuli range are clearly visible on cloudless days."
                                                          }
                                                ],
                                                "seoTitle": "Mukteshwar (2,171m), Nainital — Chauli Ki Jali Cliffs & Mountain Panoramas",
                                                "seoDescription": "Explore Mukteshwar (2,171m) in Nainital, Kumaon. Chauli Ki Jali cliff rock climbing, 350-year Shiva temple, fruit orchards, Nanda Devi views, and quiet forest stays.",
                                                "keywords": [
                                                          "Mukteshwar Nainital",
                                                          "Chauli Ki Jali cliffs",
                                                          "Mukteshwar altitude",
                                                          "Mukteshwar temple",
                                                          "adventure sports Mukteshwar",
                                                          "orchards Mukteshwar"
                                                ]
                                      },
                                      {
                                                "id": "pangot-kilbury",
                                                "name": "Pangot & Kilbury Bird Sanctuary",
                                                "type": "scenic",
                                                "emoji": "🦜",
                                                "coords": [
                                                          29.418,
                                                          79.432
                                                ],
                                                "elevation": "2,100 m",
                                                "bestSeason": "Year-round (Best: October to May)",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "Located just 15 km beyond Nainital through dense oak, pine, and rhododendron forests, Pangot and Kilbury is an internationally acclaimed birdwatching sanctuary. Home to over 580 recorded bird species, it is a haven for observing rare Himalayan avian fauna, including cheer pheasants, koklass pheasants, white-throated laughingthrushes, and lammergeiers.",
                                                "experience": "The morning forest symphony of hundreds of songbirds as dawn light filters through moss-covered oak trees along the quiet village road of Pangot.",
                                                "tips": [
                                                          "Hire a certified local birding guide in Pangot; they know the exact micro-habitats and calls of rare pheasants and raptors.",
                                                          "Walk the 3 km forest stretch between Kilbury Forest Rest House and Pangot for the highest bird density."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "How many bird species are found in Pangot?",
                                                                    "answer": "More than 580 resident and migratory bird species have been documented in the Pangot and Kilbury oak forest corridor."
                                                          },
                                                          {
                                                                    "question": "How far is Pangot from Nainital?",
                                                                    "answer": "Pangot is located approximately 15 kilometers northwest of Nainital, about a 40-minute drive along a scenic wooded mountain road."
                                                          }
                                                ],
                                                "seoTitle": "Pangot & Kilbury (2,100m), Nainital — Himalayan Birding Paradise Guide",
                                                "seoDescription": "Discover Pangot & Kilbury Bird Sanctuary (2,100m) near Nainital. 580+ avian species, cheer pheasant tracking, oak forest nature trails, and eco-lodge retreats.",
                                                "keywords": [
                                                          "Pangot bird watching",
                                                          "Kilbury sanctuary Nainital",
                                                          "Pangot altitude",
                                                          "Nainital to Pangot distance",
                                                          "birding in Kumaon",
                                                          "cheer pheasant Pangot"
                                                ]
                                      },
                                      {
                                                "id": "corbett-gateway",
                                                "name": "Jim Corbett National Park Foothills",
                                                "type": "adventure",
                                                "emoji": "🐅",
                                                "coords": [
                                                          29.53,
                                                          78.774
                                                ],
                                                "elevation": "400 m to 1,220 m",
                                                "bestSeason": "November to June (Dhikala: Nov 15 to June 15)",
                                                "difficulty": "Easy",
                                                "duration": "2–3 Days",
                                                "overview": "Established in 1936 as India's first national park (Hailey National Park), Jim Corbett National Park sprawls across the forested Shivalik foothills of Nainital and Pauri Garhwal along the Ramganga River. Famous for the highest tiger density among India's reserves, wild elephant herds, dense sal forests, and the iconic Dhikala grassland zone.",
                                                "experience": "The suspense of an early morning open-top jeep safari as a spotted deer gives an urgent alarm call across the misty grasslands of Dhikala.",
                                                "tips": [
                                                          "Book overnight forest lodge stays inside the Dhikala zone months in advance through the official government portal for the ultimate wildlife experience.",
                                                          "Combine your safari with a visit to the historic Corbett Museum at Kaladhungi, the former winter home of Jim Corbett."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What are the major safari zones in Jim Corbett National Park?",
                                                                    "answer": "Dhikala, Bijrani, Jhirna, Dhela, Durga Devi, and the newly opened Garjiya zone."
                                                          },
                                                          {
                                                                    "question": "Where is the main entry gate for Jim Corbett?",
                                                                    "answer": "Ramnagar town in Nainital district is the primary railhead and administrative headquarters for all Corbett safari bookings."
                                                          }
                                                ],
                                                "seoTitle": "Jim Corbett National Park (400–1,220m) — Tiger Safari & Jungle Lodges Guide",
                                                "seoDescription": "Visitor guide to Jim Corbett National Park in Nainital foothills. Royal Bengal tiger safari, Dhikala & Bijrani zones, elephant herds, Ramganga river, and safari booking.",
                                                "keywords": [
                                                          "Jim Corbett National Park",
                                                          "Corbett tiger safari booking",
                                                          "Dhikala zone night stay",
                                                          "Ramnagar to Corbett",
                                                          "Corbett national park altitude",
                                                          "Kumaon wildlife"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "champawat",
                            "name": "Champawat",
                            "tagline": "Historic Chand dynasty capital, spiritual Advaita ashrams, and colonial tea ridges",
                            "division": "Kumaon",
                            "places": [
                                      {
                                                "id": "abbott-mount-lohaghat",
                                                "name": "Abbott Mount & Lohaghat",
                                                "type": "scenic",
                                                "emoji": "🌲",
                                                "coords": [
                                                          29.418,
                                                          80.089
                                                ],
                                                "elevation": "1,981 m",
                                                "bestSeason": "Year-round",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "A serene colonial mountain hamlet established in 1914 by British businessman Harold Abbott, Abbott Mount features 13 heritage stone cottages scattered across an oak-and-pine ridge with sweeping vistas of eastern Himalayan snow peaks. Nearby Lohaghat on the banks of the Lohawati River is renowned for pine forests, walnut groves, and the ancient hilltop fort of Banasur.",
                                                "experience": "The gentle murmur of wind in century-old deodars surrounding red-roofed stone colonial cottages overlooking the distant Himalayan peaks of Nepal.",
                                                "tips": [
                                                          "Visit the century-old stone church of Abbott Mount secluded in the pine forest near the edge of the ridge.",
                                                          "Hike 7 km from Lohaghat up to the medieval stone fortress ruins of Banasur Ka Kila (2,000m) for 360-degree valley views."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What makes Abbott Mount unique in Uttarakhand?",
                                                                    "answer": "It consists of just 13 historic British-era colonial stone bungalows built across a secluded 8-acre mountain ridge, preserving an atmosphere of century-old peace."
                                                          },
                                                          {
                                                                    "question": "How far is Abbott Mount from Lohaghat?",
                                                                    "answer": "Abbott Mount is situated just 7 kilometers north of Lohaghat in Champawat district."
                                                          }
                                                ],
                                                "seoTitle": "Abbott Mount & Lohaghat (1,981m), Champawat — Colonial Ridge Heritage",
                                                "seoDescription": "Explore Abbott Mount and Lohaghat (1,981m) in Champawat, Kumaon. Historic 1914 European cottages, pine ridge walks, Himalayan snow vistas, and peaceful retreats.",
                                                "keywords": [
                                                          "Abbott Mount Champawat",
                                                          "Lohaghat tourism",
                                                          "Abbott Mount altitude",
                                                          "colonial hill station Kumaon",
                                                          "Champawat sightseeing",
                                                          "quiet places in Uttarakhand"
                                                ]
                                      },
                                      {
                                                "id": "mayawati-ashram",
                                                "name": "Advaita Ashrama Mayawati",
                                                "type": "spiritual",
                                                "emoji": "🕊️",
                                                "coords": [
                                                          29.429,
                                                          80.046
                                                ],
                                                "elevation": "1,940 m",
                                                "bestSeason": "Year-round (Best: March to November)",
                                                "difficulty": "Easy",
                                                "duration": "1–2 Days",
                                                "overview": "Situated 9 km from Lohaghat surrounded by deep pine, oak, and deodar forests, Advaita Ashrama at Mayawati was founded in 1899 by Captain Sevier and his wife under the guidance of Swami Vivekananda. Dedicated strictly to the non-dualistic Advaita Vedanta philosophy, no external images, idols, or ceremonial rituals are permitted here—only silent meditation and self-realization amidst nature.",
                                                "experience": "Walking in total silence down shaded forest paths lined with cedar trees where Swami Vivekananda walked and meditated in January 1901.",
                                                "tips": [
                                                          "Visit the room where Swami Vivekananda stayed in 1901, preserved in its original condition overlooking the Himalayan valleys.",
                                                          "The ashram runs a charitable mountain hospital serving remote rural hill villagers across the Kumaon region."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "Why are there no idols or temples inside Mayawati Ashram?",
                                                                    "answer": "The ashram strictly adheres to Advaita Vedanta (non-dualism), emphasizing the formless, omnipresent Divine through silent contemplation without ritualism."
                                                          },
                                                          {
                                                                    "question": "How do you reach Mayawati Ashram?",
                                                                    "answer": "The ashram is 9 kilometers from Lohaghat and 22 kilometers from Champawat town, connected by a quiet forest motor road."
                                                          }
                                                ],
                                                "seoTitle": "Advaita Ashrama Mayawati (1,940m), Champawat — Vivekananda Retreat Guide",
                                                "seoDescription": "Discover Advaita Ashrama Mayawati (1,940m) in Champawat, Kumaon. Historic 1899 Ramakrishna Math retreat founded under Swami Vivekananda, silent meditation & library.",
                                                "keywords": [
                                                          "Mayawati Ashram Champawat",
                                                          "Advaita Ashrama Lohaghat",
                                                          "Swami Vivekananda Mayawati",
                                                          "Mayawati altitude",
                                                          "spiritual retreats Kumaon",
                                                          "Ramakrishna Math Uttarakhand"
                                                ]
                                      }
                            ]
                  },
                  {
                            "id": "udham-singh-nagar",
                            "name": "Udham Singh Nagar",
                            "tagline": "Historic Terai wetlands, migratory waterbird reserves, and sacred Sikh pilgrimage sanctuaries",
                            "division": "Kumaon",
                            "places": [
                                      {
                                                "id": "nanakmatta",
                                                "name": "Nanakmatta Sahib & Reservoir Wetland",
                                                "type": "spiritual",
                                                "emoji": "☬",
                                                "coords": [
                                                          28.956,
                                                          79.813
                                                ],
                                                "elevation": "210 m",
                                                "bestSeason": "October to April",
                                                "difficulty": "Easy",
                                                "duration": "1 Day",
                                                "overview": "A revered historic Sikh pilgrimage sanctuary located along the Deoha River in the fertile Terai plains of Udham Singh Nagar. Associated with the visits of Guru Nanak Dev in 1514 and Guru Hargobind, it houses the sacred drying Pipal tree (Panja Sahib), a magnificent marble Gurudwara complex, and the adjacent sprawling Nanakmatta Reservoir dam, which serves as an important winter wetland habitat for migratory waterfowl.",
                                                "experience": "The solemn beauty of evening Gurbani kirtan floating across the sacred marble sarovar, followed by sunset boating on the expansive Nanakmatta reservoir.",
                                                "tips": [
                                                          "Visit the historic Peepal tree inside the Gurudwara compound, associated with the miracle of Guru Nanak Dev bringing green leaves back to a withered tree.",
                                                          "Enjoy birdwatching and boating on Nanakmatta Lake (dam reservoir) located just 1 km behind the main temple complex."
                                                ],
                                                "faqs": [
                                                          {
                                                                    "question": "What is the historical significance of Nanakmatta Sahib?",
                                                                    "answer": "Guru Nanak Dev visited here in 1514 during his travels (Udasi) and held spiritual discussions with the Gorakhpanthi Siddhas who previously occupied the site."
                                                          },
                                                          {
                                                                    "question": "How far is Nanakmatta from Rudrapur and Pantnagar?",
                                                                    "answer": "Nanakmatta is located approximately 55 kilometers east of Rudrapur and about 60 km from Pantnagar Airport."
                                                          }
                                                ],
                                                "seoTitle": "Nanakmatta Sahib (210m), Udham Singh Nagar — Historic Gurudwara & Lake",
                                                "seoDescription": "Guide to Gurudwara Nanakmatta Sahib and reservoir in Udham Singh Nagar, Uttarakhand. Guru Nanak sacred tree, Sarovar, migratory bird wetland, and visiting details.",
                                                "keywords": [
                                                          "Nanakmatta Sahib Gurudwara",
                                                          "Udham Singh Nagar places",
                                                          "Nanakmatta lake dam",
                                                          "Sikh shrines Uttarakhand",
                                                          "Nanakmatta bird watching",
                                                          "Rudrapur to Nanakmatta"
                                                ]
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
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/f_auto,q_auto,w_1000/v1777213083/ladakhMain.png",
    subregions: [
      {
        id: "leh",
        name: "Leh",
        tagline: "Ancient royal capital, high mountain passes, and the turquoise expanse of Pangong",
        places: [
          {
            id: "markha-valley",
            name: "Markha Valley Trek",
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

