import { HimalayaRegion } from "./types";

export const jammuKashmirRegion: HimalayaRegion = {
    id: "jammu-kashmir",
    name: "Jammu & Kashmir",
    emoji: "🏔️",
    cardDesc: "Paradise on earth — from the pine-clad meadows and historic Mughal corridors of Jammu to the turquoise alpine lakes and glacier valleys of Kashmir.",
    image: "https://res.cloudinary.com/dehriwm1o/image/upload/f_auto,q_auto,w_1000/v1780383856/jkMain.jpg",
    subregions: [
      {
        id: "jammu",
        name: "Jammu",
        tagline: "Rolling meadows, ancient pine forests, historic Pir Panjal corridors, and revered mountain sanctuaries",
        places: [
          {
            id: "patnitop",
            name: "Patnitop Meadow",
            type: "day-hike",
            emoji: "🌲",
            coords: [33.21, 75.31],
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
              },
              {
                question: "When is the best time to see snow in Patnitop?",
                answer: "December through February offers regular snowfall across Patnitop and Nathatop, turning the plateau into a winter playground."
              }
            ],
            seoTitle: "Patnitop Meadow, J&K — Meadows",
            seoDescription: "Explore Patnitop (2,024m) in Jammu & Kashmir. Pine-clad meadow walks, Chenab basin views, seasonal snow, family day hikes, and local mountain travel guide.",
            keywords: [
              "Patnitop Jammu",
              "Patnitop altitude",
              "Patnitop snowfall season",
              "Patnitop day hike",
              "Chenab basin viewpoint",
              "Udhampur hill station"
            ]
          },
          {
            id: "sanasar",
            name: "Sanasar Lake & Meadow",
            type: "lake",
            emoji: "🛶",
            coords: [33.15, 75.25],
            elevation: "2,050 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "1 Day",
            overview: "Sanasar is a cup-shaped meadow surrounded by gigantic conifers, named after two local lakes (Sana and Sar). Known as the eco-adventure hub of Jammu, it features wilderness trails, camping, and golf greens.",
            experience: "A tranquil cup of meadow reflecting high clouds, far from crowded tourist tracks.",
            tips: [
              "Carry warm layers as evening temperatures drop rapidly.",
              "Explore the Shank Pal temple trail for panoramic Pir Panjal views."
            ],
            faqs: [
              {
                question: "How far is Sanasar from Patnitop?",
                answer: "Sanasar is located approximately 19 kilometers west of Patnitop via a scenic mountain road lined with conifers."
              },
              {
                question: "What activities are available at Sanasar?",
                answer: "Sanasar offers eco-camping, trekking trails towards Shank Pal ridge, paragliding, and peaceful meadow walks around the lake."
              }
            ],
            seoTitle: "Sanasar Lake, J&K — Alpine Meadow",
            seoDescription: "Discover Sanasar Lake & Meadow (2,050m) in Jammu & Kashmir. Cup-shaped alpine meadow, camping, Shank Pal ridge hike, and tranquil lake atmosphere.",
            keywords: [
              "Sanasar Lake Jammu",
              "Sanasar meadow",
              "Shank Pal temple trek",
              "Patnitop to Sanasar",
              "Sanasar camping",
              "eco adventure Jammu"
            ]
          },
          {
            id: "nathatop",
            name: "Nathatop Ridge",
            type: "scenic",
            emoji: "⛰️",
            coords: [33.19, 75.28],
            elevation: "2,700 m",
            bestSeason: "May to November (Dec to March for snow sports)",
            difficulty: "Easy",
            duration: "Half Day",
            overview: "Perched high above Patnitop, Nathatop offers a sweeping 360-degree vista of the snow-clad peaks of the Kishtwar and Pir Panjal mountain ranges. In winter, its gentle slopes become a playground for snow activities.",
            experience: "Standing at the edge of the ridge gazing at the jagged white peaks of the Great Himalayas.",
            tips: [
              "Visit at sunrise or golden hour for striking mountain photography.",
              "Road can be slippery during winter; hire 4WD if snow is present."
            ],
            faqs: [
              {
                question: "Can you reach Nathatop by car from Patnitop?",
                answer: "Yes, Nathatop is accessible via a short 14 km paved mountain drive from Patnitop, winding through high pine forests."
              },
              {
                question: "What peaks are visible from Nathatop?",
                answer: "On clear days, the high snow-capped summits of the Kishtwar range, Brammah peaks, and the Pir Panjal are visible."
              }
            ],
            seoTitle: "Nathatop Ridge, J&K — 360° Mountain Views & Snow Trails",
            seoDescription: "Guide to Nathatop Ridge (2,710m) above Patnitop, Jammu & Kashmir. Panoramic Pir Panjal vistas, Kishtwar peak views, winter snow slopes, and photography tips.",
            keywords: [
              "Nathatop Ridge",
              "Nathatop Patnitop",
              "Nathatop snow viewpoints",
              "Pir Panjal viewpoints Jammu",
              "Nathatop altitude",
              "Kishtwar peaks vista"
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
            ],
            faqs: [
              {
                question: "What is the total walking distance of the Vaishno Devi trek?",
                answer: "The traditional trail from Katra base (Ban Ganga) to the Bhawan is approximately 13 kilometers with a vertical climb of over 800 meters."
              },
              {
                question: "Are pony and battery car options available on the trail?",
                answer: "Yes, ponies, palanquins, battery-operated vehicles (from Adhkuwari), and a helicopter service from Katra to Sanjichhat are available."
              }
            ],
            seoTitle: "Vaishno Devi Trail, J&K Guide",
            seoDescription: "Essential guide to the Vaishno Devi pilgrimage trek (1,585m) in Jammu & Kashmir. Katra trailhead, 13km route, Trikuta hills, permits, and planning tips.",
            keywords: [
              "Vaishno Devi trek",
              "Katra to Bhawan distance",
              "Trikuta hills Jammu",
              "Vaishno Devi altitude",
              "Vaishno Devi Yatra guide",
              "Adhkuwari Katra trail"
            ]
          },
          {
            id: "rajouri",
            name: "Rajouri",
            type: "scenic",
            emoji: "🏰",
            coords: [33.306694, 74.349544],
            elevation: "915 m",
            bestSeason: "October to April (foothills); May to June (upper meadows)",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Sited in the southern foothills of the Pir Panjal range along the Tawi River basin, Rajouri—historically known as Rajapuri ('Land of Kings')—is an ancient cultural crossroads and the southern springboard for exploration across the high Pir Panjal. Ringed by pine-forested hills and historic Mughal encampments, it features the 19th-century Dhanidhar Fort overlooking the town, sacred Sufi shrines, and direct access north toward the Mughal Road and the remote Seven Lakes of Rajouri.",
            experience: "Historic Mughal caravan heritage meeting the green terraced foothills of the Pir Panjal.",
            tips: [
              "Visit the hilltop Dhanidhar Fort for a commanding panoramic view over Rajouri valley.",
              "Use Rajouri as your base before ascending north toward Thanamandi, Dera Ki Gali, and the Mughal Road."
            ],
            faqs: [
              {
                question: "How do you reach Rajouri from Jammu city?",
                answer: "Rajouri is connected to Jammu by NH144A (approximately 150 km, 4 to 5 hours drive through the Shivalik foothills)."
              },
              {
                question: "What treks start near Rajouri?",
                answer: "Rajouri is the gateway to the Seven Alpine Lakes of the Pir Panjal (including Nandan Sar and Chandan Sar), typically approached via Darhal or Budhal."
              }
            ],
            seoTitle: "Rajouri (915m) — Pir Panjal Foothills",
            seoDescription: "Explore Rajouri in Jammu (915m). Ancient 'Land of Kings', 19th-century Dhanidhar Fort, Pir Panjal foothill trails, Mughal Road access, and travel guide.",
            keywords: [
              "Rajouri Jammu Kashmir",
              "Rajouri valley",
              "Dhanidhar Fort Rajouri",
              "Pir Panjal foothills",
              "Mughal Road Rajouri",
              "Seven Lakes Rajouri gateway"
            ]
          },
          {
            id: "poonch",
            name: "Poonch",
            type: "scenic",
            emoji: "🏔️",
            coords: [33.7700, 74.1000],
            elevation: "981 m",
            bestSeason: "October to May",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Bordered by the jagged snowy ridges of the Pir Panjal on three sides and flanked by the Poonch River, this historic frontier town is steeped in Himalayan heritage. Renowned for the imposing 18th-century Poonch Fort with its blend of Sikh, Mughal, and European architecture, tranquil apple and walnut orchards, and cascading mountain torrents like the Noori Chamb waterfall near Behramgala, Poonch marks the western terminus of the historic Mughal Road across the Pir Panjal.",
            experience: "A secluded borderland valley where glacial torrents flow past historic fort walls and terraced orchards.",
            tips: [
              "Visit Noori Chamb waterfall along the Mughal Road, named after Mughal Empress Nur Jahan.",
              "Explore the historic Poonch Fort in the town center to understand the region's royal Dogra and Sikh history."
            ],
            faqs: [
              {
                question: "Where is Poonch located relative to Jammu and Srinagar?",
                answer: "Poonch lies in western Jammu province near the Line of Control, approximately 240 km from Jammu city and connected to Srinagar via the seasonal Mughal Road."
              },
              {
                question: "What is Noori Chamb and how to visit it?",
                answer: "Noori Chamb is a scenic mountain waterfall near Behramgala on the road to Bafliaz, famed for its royal Mughal associations and mist-shrouded gorge."
              }
            ],
            seoTitle: "Poonch (981m) — Historic Fort, Noori Chamb & Mughal Road",
            seoDescription: "Discover Poonch in Jammu (981m). Explore historic Poonch Fort, Noori Chamb waterfall near Behramgala, Mughal Road borderland trails, and local travel guide.",
            keywords: [
              "Poonch Jammu Kashmir",
              "Poonch Fort",
              "Noori Chamb waterfall",
              "Poonch valley",
              "Pir Panjal borderlands",
              "Mughal Road Poonch"
            ]
          },
          {
            id: "dera-ki-gali",
            name: "Dera Ki Gali",
            type: "scenic",
            emoji: "🌲",
            coords: [33.582145, 74.362338],
            elevation: "3,200 m",
            bestSeason: "April to November",
            difficulty: "Easy",
            duration: "Half Day to 1 Day",
            overview: "Perched at over 2,050 meters on the ridge divide between Rajouri and Poonch districts, Dera Ki Gali (often abbreviated as DKG) is a tranquil forest pass enveloped in virgin deodar, blue pine, and oak trees. The high pass provides refreshing alpine cool, panoramic vistas of the southern Pir Panjal slopes, and serves as an important junction linking Thanamandi with Bafliaz and the historic Mughal Road corridor.",
            experience: "Crisp alpine breezes and birdsong filtering through thick old-growth deodar canopies atop a mountain ridge.",
            tips: [
              "Stop for fresh mountain tea and roasted corn at the ridge stalls while taking in the forested slopes.",
              "Take short walks along the forestry trails branching off the main road into pristine cedar woods."
            ],
            faqs: [
              {
                question: "What is Dera Ki Gali famous for?",
                answer: "Dera Ki Gali (DKG) is renowned for its thick cedar and pine forests, cool mountain climate, and commanding viewpoint along the ridge connecting Rajouri and Poonch."
              },
              {
                question: "Does Dera Ki Gali receive snowfall in winter?",
                answer: "Yes, winter brings significant snowfall between December and February, temporarily dusting the deodar canopies in white."
              }
            ],
            seoTitle: "Dera Ki Gali (2,050m) — Pine Pass & Pir Panjal Ridge Trails",
            seoDescription: "Guide to Dera Ki Gali / DKG (2,050m) in Jammu. Forested ridge pass connecting Rajouri and Poonch, virgin deodar trails, mountain tea stalls, and travel advice.",
            keywords: [
              "Dera Ki Gali",
              "Dera Ki Gali Jammu",
              "DKG Rajouri Poonch",
              "Dera Ki Gali pass",
              "Thanamandi Bafliaz road",
              "Pir Panjal forest pass"
            ]
          },
          {
            id: "pir-ki-gali",
            name: "Pir Ki Gali",
            type: "road",
            emoji: "🛣️",
            coords: [33.629772, 74.519984],
            elevation: "3,490 m",
            bestSeason: "May to October (Pass is snowbound in winter)",
            difficulty: "Moderate",
            duration: "1 Day",
            overview: "Pir Ki Gali is the iconic high-altitude mountain pass at 3,485 meters (11,433 ft) traversing the crest of the Pir Panjal range along the historic Mughal Road. Connecting Poonch and Rajouri in Jammu with Shopian in Kashmir, this windswept pass features rolling high-altitude meadows, herds of nomadic Gujjar and Bakarwal shepherds, and the revered roadside shrine (Ziarat) of Sufi saint Sheikh Ahmed Karim.",
            experience: "Standing at the windy 3,485-meter apex of the Mughal Road where alpine meadows transition into the vast Kashmir Valley.",
            tips: [
              "Always check road status before travel; early blizzards can close the pass by November.",
              "Carry heavy windproof jackets and warm beanies even in peak summer due to fierce ridge winds."
            ],
            faqs: [
              {
                question: "When is Pir Ki Gali open for traffic?",
                answer: "Pir Ki Gali typically opens for vehicular travel from May to late October or early November, closing during winter due to heavy snow."
              },
              {
                question: "What is the historical significance of Pir Ki Gali?",
                answer: "It served as the primary mountain pass traversed by Mughal Emperors Akbar, Jahangir, and Shah Jahan on their royal expeditions into Kashmir."
              }
            ],
            seoTitle: "Pir Ki Gali Pass (3,485m) — Mughal Road Summit",
            seoDescription: "Essential guide to Pir Ki Gali Pass (3,485m) on the Mughal Road in Jammu & Kashmir. High alpine meadows, Sheikh Ahmed Karim shrine, road status, and weather.",
            keywords: [
              "Pir Ki Gali",
              "Pir Ki Gali pass altitude",
              "Mughal Road pass",
              "Pir Panjal pass Jammu Kashmir",
              "Pir Ki Gali opening date",
              "Shopian to Bafliaz road"
            ]
          },
          {
            id: "kot-ranka",
            name: "Kotranka (Bakori)",
            type: "scenic",
            emoji: "🌾",
            coords: [33.379856, 74.496609],
            elevation: "1,400 m",
            bestSeason: "March to November",
            difficulty: "Easy",
            duration: "1 Day",
            overview: "Known natively to locals as Bakori, Kotranka is a scenic foothill town and sub-divisional hub nestled in a verdant amphitheater along the Ans River in Rajouri district. Surrounded by terraced cornfields, sparkling streamlets, and pine-clad hillsides, Kotranka (Bakori) is the lively commercial crossroads and cultural heartland of the lower Pir Panjal. Away from highway congestion, it offers genuine insight into traditional Pahari and Gujjar rural Himalayan life and serves as an essential staging post on the route ascending toward Budhal and the untamed high alpine wilderness.",
            experience: "Vibrant local bazaar life at Bakori where Gujjar shepherds and Pahari farmers meet along the clear rush of the Ans River.",
            tips: [
              "Locally referred to as Bakori by residents and taxi drivers; use 'Bakori' when asking for directions or public transport from Rajouri.",
              "Explore the village walking trails branching off from Bakori along the Ans river toward the upper pine ridges and Budhal.",
              "Spring (March-April) and Autumn (September-October) offer pleasant weather and clear skies."
            ],
            faqs: [
              {
                question: "Why is Kotranka also called Bakori?",
                answer: "Bakori is the indigenous and most widely used local name for the town and main bazaar, while Kotranka serves as the official administrative tehsil and sub-division title."
              },
              {
                question: "Where is Kotranka (Bakori) located and how to reach it?",
                answer: "Kotranka (Bakori) is situated in the eastern hills of Rajouri district along the Ans River, approximately 40 km from Rajouri town via the Rajouri-Budhal road, reachable by shared cabs and private vehicles."
              },
              {
                question: "What kind of terrain characterizes Kotranka (Bakori)?",
                answer: "It features gentle pine-clad hills, terraced agriculture, river banks, and traditional rural settlements nestled below the Pir Panjal range."
              }
            ],
            seoTitle: "Kotranka (Bakori) 1,520m, Rajouri — Valley Hub",
            seoDescription: "Explore Kotranka (Bakori local) at 1,520m in Rajouri, Jammu & Kashmir. Picturesque Ans river valley, local Pahari and Gujjar culture, Budhal gateway, and.",
            keywords: [
              "Kotranka Bakori",
              "Kotranka Rajouri",
              "Bakori local Rajouri",
              "Kotranka Ans river valley",
              "Kotranka Budhal road",
              "Pahari culture Jammu",
              "Rajouri offbeat destinations",
              "Kotranka altitude"
            ]
          },
          {
            id: "budhal",
            name: "Budhal",
            type: "scenic",
            emoji: "🏔️",
            coords: [33.3800, 74.6300],
            elevation: "1,650 m",
            bestSeason: "April to October",
            difficulty: "Moderate",
            duration: "1–2 Days",
            overview: "Nestled in the rugged upper foothills of the southern Pir Panjal range in Rajouri district, Budhal is a high-altitude mountain settlement situated along the Gabbar River torrent. Characterized by terraced alpine slopes, dense pine and oak forests, and traditional stone-and-timber homesteads, Budhal is the authentic wilderness gateway to the untamed southern reaches of the Pir Panjal, serving as the starting base for demanding shepherd trails heading towards the Seven Alpine Lakes of Rajouri and Kousar Nag across high mountain passes.",
            experience: "A wild foothill bastion where turbulent mountain rivers echo beneath the mist-shrouded crests of the high Pir Panjal.",
            tips: [
              "Budhal is an offbeat trail hub; hire experienced local Gujjar or Bakarwal guides for high-altitude passes.",
              "Carry all personal trekking supplies, as local shops in Budhal market offer only basic provisions."
            ],
            faqs: [
              {
                question: "How do you reach Budhal?",
                answer: "Budhal is located approximately 55 km east of Rajouri town via Kot Ranka along a scenic mountain road that climbs through the Ans river basin."
              },
              {
                question: "What alpine trails originate from Budhal?",
                answer: "Challenging wilderness routes lead northwards from Budhal across high alpine meadows towards Nandan Sar, Chandan Sar, and over high shepherd cols towards Kousar Nag and the Kashmir Valley."
              }
            ],
            seoTitle: "Budhal (1,650m), Rajouri — Southern Pir Panjal",
            seoDescription: "Discover Budhal (1,650m) in Rajouri, Jammu & Kashmir. High Pir Panjal foothill trails, Gabbar river gorge, gateway to alpine shepherd passes, and travel guide.",
            keywords: [
              "Budhal Rajouri",
              "Budhal Jammu Kashmir",
              "Budhal Pir Panjal gateway",
              "Budhal trekking trailhead",
              "Seven Lakes Budhal route",
              "Budhal altitude"
            ]
          },
          {
            id: "darhal",
            name: "Darhal",
            type: "scenic",
            emoji: "🍏",
            coords: [33.492353, 74.446832],
            elevation: "1,800 m",
            bestSeason: "April to October",
            difficulty: "Moderate",
            duration: "1–2 Days",
            overview: "Nestled in an emerald mountain bowl approximately 22 km north of Rajouri town, Darhal is framed by towering mountains on three sides. Famed for its cool climate, apple orchards, and clear mountain waters, Darhal is celebrated by alpine trekkers as the primary staging point for expeditions to Shakarmarg meadow and the fabled Seven Alpine Lakes of Rajouri (including Nandan Sar, Chandan Sar, and Kator Sar) perched high in the Pir Panjal.",
            experience: "Lush apple orchards giving way to deep river gorges and rugged shepherd trails ascending into the high mountains.",
            tips: [
              "Darhal is the starting point for hiring local guides for multi-day treks toward Shakarmarg and Nandan Sar.",
              "Visit in spring for apple blossoms, or late summer to catch the shepherd migration across high passes."
            ],
            faqs: [
              {
                question: "How do you reach the Seven Lakes from Darhal?",
                answer: "The trek ascends from Darhal through Shakarmarg alpine meadows before crossing rocky moraines to reach Nandan Sar (3,500m) and neighboring lakes."
              },
              {
                question: "Is Darhal suitable for day visits?",
                answer: "Yes, the drive from Rajouri to Darhal passes through lovely terraced hills and orchards, making it a peaceful day outing."
              }
            ],
            seoTitle: "Darhal Valley (1,750m) Guide",
            seoDescription: "Guide to Darhal (1,750m) in Jammu. Emerald apple bowl, starting point for Shakarmarg meadows and the Seven Alpine Lakes of the Pir Panjal (Nandan Sar.",
            keywords: [
              "Darhal Rajouri",
              "Darhal valley",
              "Shakarmarg trek",
              "Nandan Sar trek trailhead",
              "Seven Lakes of Rajouri",
              "Darhal altitude"
            ]
          },
          {
            id: "kishtwar",
            name: "Kishtwar",
            type: "adventure",
            emoji: "🦅",
            coords: [33.3100, 75.7600],
            elevation: "1,638 m",
            bestSeason: "April to October",
            difficulty: "Moderate",
            duration: "2–3 Days",
            overview: "Kishtwar is a dramatic high-relief territory in eastern Jammu perched on a high plateau above the deep gorges of the Chenab River. Renowned for its saffron fields, vast deodar reserves, and the high-altitude Kishtwar National Park, it holds legendary status among world mountaineers as the base camp for expeditions to technical peaks including the Brammah Massif (6,416m), Sickle Moon (6,574m), and Kishtwar Shivling. It also connects via the scenic Sinthan Top pass (3,784m) to the Kashmir Valley.",
            experience: "Dramatic vertical gorges where roaring glacier rivers carve below technical granite summits and fragrant pine plateaus.",
            tips: [
              "Take a stroll across the vast natural green plateau of Chowgan in the town center.",
              "Travel across Sinthan Top (3,784m) for an unforgettable alternative scenic road link into South Kashmir."
            ],
            faqs: [
              {
                question: "What is Kishtwar National Park known for?",
                answer: "Covering over 400 sq km, it protects rare Himalayan wildlife including the snow leopard, Himalayan brown bear, musk deer, and diverse bird species across steep alpine valleys."
              },
              {
                question: "What are the major peaks around Kishtwar?",
                answer: "The region is famous for dramatic technical climbing peaks: Brammah I (6,416m), Sickle Moon (6,574m), Crooked Finger, and Kishtwar Shivling."
              }
            ],
            seoTitle: "Kishtwar (1,638m) — Brammah Peak Expeditions & NP Guide",
            seoDescription: "Explore Kishtwar in Jammu (1,638m). High plateau above Chenab gorge, gateway to Brammah Massif (6,416m), Kishtwar National Park, Chowgan ground, and.",
            keywords: [
              "Kishtwar Jammu",
              "Kishtwar National Park",
              "Brammah peak expedition",
              "Sinthan Top pass",
              "Chenab river gorge",
              "Chowgan ground Kishtwar"
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
            heroImage: "https://images.unsplash.com/photo-1631420105765-caf5ccd069bc?q=80&w=2340&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1631420105765-caf5ccd069bc?q=80&w=2340&auto=format&fit=crop",
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
              },
              {
                question: "What is the highest altitude on the Kashmir Great Lakes trek?",
                answer: "The highest point is Gadsar Pass at approximately 4,200 meters (13,779 feet), offering panoramas of high glacial tarns."
              }
            ],
            seoTitle: "Kashmir Great Lakes Trek (4,190m) — Map",
            seoDescription: "Authoritative day-by-day guide to the Kashmir Great Lakes Trek (4,190m). Traverses Vishansar, Kishansar, Gadsar, Satsar & Gangabal lakes with trail map.",
            keywords: [
              "Kashmir Great Lakes trek",
              "KGL trek itinerary",
              "Vishansar Lake Kashmir",
              "Gadsar Pass altitude",
              "Gangabal Lake trek",
              "Kashmir trekking permits"
            ]
          },
          {
            id: "tarsar-marsar",
            heroImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Tarsar_lake.jpg/1920px-Tarsar_lake.jpg",
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Tarsar_lake.jpg/1920px-Tarsar_lake.jpg",
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
            experience: "Camping right on the grassy shores of Tarsar as the water changes hues from turquoise to deep blue.",
            packingList: [
              "Waterproof high-ankle hiking boots",
              "Warm fleece jacket and down layer",
              "Waterproof rain poncho or jacket",
              "Trekking poles and UV sunglasses",
              "Personal first aid kit with blister relief"
            ],
            faqs: [
              {
                question: "Where does the Tarsar Marsar trek start and end?",
                answer: "The trek begins and concludes in Aru Valley, approximately 12 kilometers upstream from Pahalgam in South Kashmir."
              },
              {
                question: "What makes Tarsar Marsar unique among Himalayan lake treks?",
                answer: "Unlike many lake treks where camping is restricted, trekkers on Tarsar Marsar camp right beside the turquoise water of Tarsar Lake surrounded by alpine wildflowers."
              }
            ],
            seoTitle: "Tarsar Marsar Trek (4,020m) Guide",
            seoDescription: "Complete guide to the Tarsar Marsar Trek (4,020m) from Aru Valley, Kashmir. Discover twin alpine lakes, Kolahoi massif views, day itinerary, and best season.",
            keywords: [
              "Tarsar Marsar trek",
              "Tarsar Lake Kashmir",
              "Aru Valley trekking",
              "Marsar Lake Kolahoi",
              "Tarsar Marsar difficulty",
              "Kashmir lake treks"
            ]
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
            overview: "Sonmarg ('Meadow of Gold') is framed by soaring glaciers and the roaring Sindh River in Ganderbal district. Sited along the Srinagar-Leh highway, it serves as the threshold between Kashmir and Ladakh via Zojila Pass. A gentle 3 km trail leads to the foot of the Thajiwas Glacier, while nearby Baltal valley acts as a primary base camp for the holy Amarnath Yatra. Sonmarg is also the starting point for the world-famous Kashmir Great Lakes trek.",
            experience: "Lush green fir forests running directly into massive hanging glacial ice fields.",
            tips: [
              "Hike or take a pony to the foot of Thajiwas Glacier where snow slides are possible even in summer.",
              "Sonmarg is the gateway to crossing Zojila Pass (3,528m) toward Drass and Kargil in Ladakh."
            ],
            faqs: [
              {
                question: "Is Thajiwas Glacier accessible for a day hike?",
                answer: "Yes, the hike from Sonmarg market to Thajiwas Glacier is around 3 to 4 km each way and can be easily completed in 3–4 hours."
              },
              {
                question: "How does Sonmarg link to Ladakh?",
                answer: "Sonmarg is the last major valley in Kashmir on NH1 before the highway ascends steeply to Zojila Pass (3,528m) into Ladakh."
              }
            ],
            seoTitle: "Sonmarg & Thajiwas Glacier — Glacier Trails",
            seoDescription: "Explore Sonmarg (2,740m) in Kashmir. Famous Thajiwas Glacier day hike, Sindh River meadows, gateway to Ladakh via Zojila Pass, and season guide.",
            keywords: [
              "Sonmarg Kashmir",
              "Thajiwas Glacier trek",
              "Sonmarg altitude",
              "Zojila Pass gateway",
              "Sindh river Sonmarg",
              "Sonmarg best time"
            ]
          },
          {
            id: "zojila-pass",
            name: "Zojila Pass",
            type: "road",
            emoji: "🏔️",
            coords: [34.21, 75.47],
            elevation: "3,528 m",
            bestSeason: "May to October (Closed in winter)",
            difficulty: "Moderate",
            duration: "1 Day",
            overview: "Zojila Pass (3,528m / 11,575 ft) is the legendary high-altitude mountain pass on the Great Himalayan Range connecting the Kashmir Valley with the cold arid landscapes of Drass, Kargil, and Ladakh along NH1. Renowned for its sheer switchbacks cut into barren vertical cliffs, it marks the dramatic geographic boundary where lush Kashmir gives way to the stark moonscapes of Ladakh.",
            experience: "Driving along sheer vertical rock faces where green Kashmir gives way abruptly to the stark, windswept moonscapes of Ladakh.",
            tips: [
              "Check BRO road clearance advisories before departure.",
              "Traffic is often regulated one-way on alternating days."
            ],
            faqs: [
              {
                question: "When is Zojila Pass open?",
                answer: "Zojila Pass typically opens in late April or May and closes in November/December depending on heavy snowfall."
              }
            ],
            seoTitle: "Zojila Pass (3,528m) — Kashmir Ladakh Gateway",
            seoDescription: "Complete guide to Zojila Pass (3,528m) connecting Sonmarg, Kashmir with Drass and Ladakh. Historic switchback pass, status updates, altitude, and route advice.",
            keywords: [
              "Zojila Pass",
              "Zojila Pass altitude",
              "Sonmarg to Drass road",
              "Zojila opening date",
              "Kashmir Ladakh pass"
            ]
          },
          {
            id: "gulmarg",
            heroImage: "https://cdn.pixabay.com/photo/2017/11/03/19/45/autumn-2915438_1280.jpg",
            image: "https://cdn.pixabay.com/photo/2017/11/03/19/45/autumn-2915438_1280.jpg",
            name: "Gulmarg & Apharwat Peak",
            type: "adventure",
            emoji: "🚠",
            coords: [34.0500, 74.3800],
            elevation: "3,950 m",
            bestSeason: "Year-round (Winter for Skiing, Summer for Trekking)",
            difficulty: "Moderate",
            duration: "1–2 Days",
            overview: "Home to one of the world's highest operating cable cars (Gulmarg Gondola), Gulmarg ('Meadow of Flowers') is perched on a high pine plateau in the Pir Panjal range in Baramulla. In summer, the basin blooms with alpine flora and offers ridge hikes to Alpather Lake. In winter, the steep bowls of Apharwat Peak (3,950m) transform into Asia's premier deep powder freeride skiing and snowboarding destination.",
            experience: "Standing atop Apharwat at nearly 4,000 meters gazing into the Nanga Parbat horizon.",
            tips: [
              "Book Gulmarg Gondola Phase 1 and Phase 2 tickets well in advance online via the official J&K tourism portal.",
              "Hike from Phase 2 down to the high-altitude glacial tarn of Alpather Lake (3,800m) in summer."
            ],
            faqs: [
              {
                question: "What are the two phases of the Gulmarg Gondola?",
                answer: "Phase 1 connects Gulmarg bowl (2,600m) to Kongdoori meadow (3,050m), while Phase 2 ascends from Kongdoori to the summit shoulder of Apharwat Peak (3,950m)."
              },
              {
                question: "Can beginners ski in Gulmarg?",
                answer: "Yes, the gentle slopes of Gulmarg golf course and Kongdoori are ideal for beginners, with certified ski instructors and equipment rentals available."
              }
            ],
            seoTitle: "Gulmarg & Apharwat Peak — Ski Slopes, Gondola & High Ridges",
            seoDescription: "Complete guide to Gulmarg (3,950m) in Kashmir. Gulmarg Gondola Phases 1 & 2, Apharwat Peak skiing, Alpather Lake summer trek, winter snow, and booking tips.",
            keywords: [
              "Gulmarg Gondola booking",
              "Apharwat Peak altitude",
              "Gulmarg skiing Kashmir",
              "Alpather Lake trek",
              "Kongdoori meadow",
              "Gulmarg powder snow"
            ]
          },
          {
            id: "srinagar",
            heroImage: "https://cdn.pixabay.com/photo/2022/08/16/12/45/shikara-7390155_1280.jpg",
            image: "https://cdn.pixabay.com/photo/2022/08/16/12/45/shikara-7390155_1280.jpg",
            name: "Srinagar",
            type: "scenic",
            emoji: "🛶",
            coords: [34.0837, 74.7973],
            elevation: "1,585 m",
            bestSeason: "April to October (Spring to Autumn); Dec to Feb for snow",
            difficulty: "Easy",
            duration: "2–3 Days",
            overview: "The historic summer capital of Jammu & Kashmir and the central logistical staging hub for all alpine exploration across the Kashmir valley. Sited on the banks of the Jhelum River and Dal Lake, Srinagar is famous for its iconic cedar houseboats, quiet shikara water channels, terraced Mughal gardens (Shalimar, Nishat), wooden Kashmiri architecture of the Old City, and the panoramic Zabarwan mountain backdrop that borders Dachigam National Park.",
            experience: "Gliding across calm lotus-covered waters in a wooden shikara beneath the towering Zabarwan mountain amphitheater.",
            tips: [
              "Stay in a traditional carved cedar houseboat on Nigeen Lake for a tranquil escape.",
              "Wake before dawn for a shikara ride to the floating vegetable market on Dal Lake."
            ],
            faqs: [
              {
                question: "Why is Srinagar important for Himalayan trekkers?",
                answer: "Srinagar has the region's main international airport, gear shops, and road connections to all major Kashmir trailheads (Sonmarg, Pahalgam, Aru, Yusmarg, Gurez)."
              },
              {
                question: "What are the key attractions to visit in Srinagar?",
                answer: "Dal Lake, Nigeen Lake, Shalimar and Nishat Mughal Gardens, the 8th-century Shankaracharya Temple, and the historic wooden mosques of Old Srinagar."
              }
            ],
            seoTitle: "Srinagar — Dal Lake, Mughal Gardens & Alpine Staging Hub",
            seoDescription: "Complete guide to Srinagar, Kashmir (1,585m). Dal Lake houseboats, Mughal gardens, Old City heritage, Zabarwan hills, best seasons, and trail staging.",
            keywords: [
              "Srinagar Kashmir",
              "Dal Lake houseboats",
              "Srinagar Mughal gardens",
              "Zabarwan range Srinagar",
              "Srinagar trekking base",
              "shikara ride Dal Lake"
            ]
          },
          {
            id: "pahalgam",
            heroImage: "https://cdn.pixabay.com/photo/2022/09/19/20/09/mountains-7466370_1280.jpg",
            image: "https://cdn.pixabay.com/photo/2022/09/19/20/09/mountains-7466370_1280.jpg",
            name: "Pahalgam",
            type: "scenic",
            emoji: "🌲",
            coords: [34.0100, 75.3200],
            elevation: "2,130 m",
            bestSeason: "April to October",
            difficulty: "Easy to Moderate",
            duration: "2–3 Days",
            overview: "Known as the 'Valley of Shepherds', Pahalgam sits at the confluence of the roaring Lidder River and Sheshnag stream in Anantnag district. Framed by thick pine forests, towering limestone cliffs, and lush meadows like Baisaran and Betaab Valley, Pahalgam serves as Kashmir's premier valley retreat and the primary mountaineering base camp for treks to the Kolahoi Glacier, Tarsar-Marsar lakes via Aru Valley, and the traditional Amarnath Yatra pilgrimage trail.",
            experience: "The thunderous roar of the emerald Lidder River rushing through deodar forests beneath jagged alpine summits.",
            tips: [
              "Take a day excursion or hike up to Aru Valley (12 km) and Baisaran meadow.",
              "Lidder River offers excellent regulated brown trout angling during summer with local department permits."
            ],
            faqs: [
              {
                question: "What major treks start from the Pahalgam area?",
                answer: "Pahalgam and nearby Aru Valley are the trailheads for the Tarsar Marsar Lake Trek, the Kolahoi Glacier expedition, and the Sheshnag-Amarnath trail."
              },
              {
                question: "What is Betaab Valley and where is it?",
                answer: "Betaab Valley is a picturesque meadow park along the Lidder River 15 km upstream from Pahalgam town on the road towards Chandanwari."
              }
            ],
            seoTitle: "Pahalgam — Lidder Valley",
            seoDescription: "Discover Pahalgam, Kashmir (2,130m). Lidder river trails, Baisaran and Betaab meadows, gateway to Kolahoi Glacier and Aru Valley, seasons, and travel tips.",
            keywords: [
              "Pahalgam Kashmir",
              "Lidder Valley Pahalgam",
              "Betaab Valley Pahalgam",
              "Aru Valley trailhead",
              "Baisaran meadow Pahalgam",
              "Pahalgam trekking"
            ]
          },
          {
            id: "gurez-valley",
            name: "Gurez Valley",
            type: "scenic",
            emoji: "⛰️",
            coords: [34.6300, 74.8300],
            elevation: "2,400 m",
            bestSeason: "May to October (Razdan Pass closes in heavy winter)",
            difficulty: "Moderate",
            duration: "2–3 Days",
            overview: "An isolated high-altitude Himalayan valley along the roaring Kishanganga River near the Line of Control, reached by crossing the wind-swept Razdan Pass (3,557m). Guarded by the monumental pyramid-shaped limestone peak of Habba Khatoon, Gurez is inhabited by the indigenous Dard-Shin community and preserves an ancient, unspoiled Himalayan rhythm with traditional wooden log homes, trout streams, and borderland trails.",
            experience: "Standing before the towering pyramid of Habba Khatoon as evening shadows envelop the turquoise Kishanganga River.",
            tips: [
              "Carry valid government ID cards for verification at army checkposts along the Razdan Pass road.",
              "Dawar is the central settlement with local homestays, simple guesthouses, and riverside camping spots."
            ],
            faqs: [
              {
                question: "How do you reach Gurez Valley from Srinagar?",
                answer: "Gurez is reached via Bandipora and a mountain drive across Razdan Pass (3,557m), covering approximately 125 km (5 to 6 hours drive)."
              },
              {
                question: "What is the legendary Habba Khatoon peak?",
                answer: "Habba Khatoon is a striking pyramid-shaped peak named after the famous 16th-century Kashmiri poetess-queen who wandered the slopes after her royal husband's exile."
              }
            ],
            seoTitle: "Gurez Valley — Habba Khatoon Peak",
            seoDescription: "Guide to Gurez Valley, Kashmir (2,400m). Habba Khatoon peak, Razdan Pass (3,557m), Kishanganga River, Dard-Shin culture, permits, and travel advice.",
            keywords: [
              "Gurez Valley Kashmir",
              "Habba Khatoon peak",
              "Razdan Pass altitude",
              "Kishanganga River Gurez",
              "Dawar Gurez Valley",
              "Gurez Valley permits"
            ]
          },
          {
            id: "yusmarg",
            heroImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Yousmarg.jpg/1920px-Yousmarg.jpg",
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Yousmarg.jpg/1920px-Yousmarg.jpg",
            name: "Yusmarg",
            type: "scenic",
            emoji: "🌿",
            coords: [33.8300, 74.6600],
            elevation: "2,396 m",
            bestSeason: "May to October",
            difficulty: "Easy to Moderate",
            duration: "1–2 Days",
            overview: "Meaning 'Meadow of Jesus', Yusmarg is a tranquil expanse of rolling alpine meadows in the western Pir Panjal range in Badgam district. Far quieter than Gulmarg, it is dissected by the foaming Doodhganga river and bounded by dense spruce and pine forests, with walking trails leading to the pristine Nilnag lake and the frozen alpine valley of Sang-e-Safed.",
            experience: "Endless rolling green meadows framed by the snow-crested spine of the Pir Panjal mountains.",
            tips: [
              "Hike down the gentle 4 km forest trail to the stony riverbed of the Doodhganga river.",
              "Pack snacks and water for day hikes as commercial amenities are limited, preserving its quiet natural beauty."
            ],
            faqs: [
              {
                question: "How far is Yusmarg from Srinagar?",
                answer: "Yusmarg is located approximately 47 kilometers southwest of Srinagar, taking about 1.5 to 2 hours by road through Chadoora."
              },
              {
                question: "What hikes start from Yusmarg?",
                answer: "Day trails include the hike to the blue waters of Nilnag lake (4 km) and the full-day wilderness trek up the Doodhganga gorge to the frozen Sang-e-Safed valley."
              }
            ],
            seoTitle: "Yusmarg — Pir Panjal Meadows",
            seoDescription: "Explore Yusmarg, Kashmir (2,396m). Untouched rolling meadows of the Pir Panjal, Doodhganga trails, Nilnag Lake hike, best time to visit, and peaceful escapes.",
            keywords: [
              "Yusmarg Kashmir",
              "Doodhganga river Yusmarg",
              "Nilnag Lake hike",
              "Yusmarg meadows Badgam",
              "Sang-e-Safed valley",
              "Yusmarg altitude"
            ]
          },
          {
            id: "doodhpathri",
            heroImage: "https://images.unsplash.com/photo-1623996732821-66f739df7280?q=80&w=1600&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1623996732821-66f739df7280?q=80&w=1600&auto=format&fit=crop",
            name: "Doodhpathri",
            type: "scenic",
            emoji: "🥛",
            coords: [33.8800, 74.5700],
            elevation: "2,730 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "1 Day",
            overview: "A bowl-shaped alpine meadow nestled in the Pir Panjal range in Badgam district, named 'Valley of Milk' after the frothy white rapids of the Shaliganga River as it cascades over boulder beds. The valley features lush carpet-like grasslands surrounded by pine forests, shepherd log huts, and panoramic views of snow-clad ridges.",
            experience: "Walking along emerald green grassy plateaus where cattle graze beside churning white mountain torrents.",
            tips: [
              "Walk past the main parking area towards the Shaliganga riverbed for the most scenic peaceful spots.",
              "Combine with visits to nearby local villages for fresh Kashmiri tea (Kahwa) and mountain bread."
            ],
            faqs: [
              {
                question: "Why is Doodhpathri called the Valley of Milk?",
                answer: "Legend attributes the name to the rich milk produced by cattle grazing on its lush grass, as well as the foamy white appearance of the Shaliganga River rapids."
              },
              {
                question: "How far is Doodhpathri from Srinagar?",
                answer: "Doodhpathri is about 42 kilometers southwest of Srinagar (around 1.5 hours drive via Khansahib)."
              }
            ],
            seoTitle: "Doodhpathri (Valley of Milk) — Alpine Pastures",
            seoDescription: "Discover Doodhpathri, Kashmir (2,730m). Emerald meadows, frothing Shaliganga river, pine forests, shepherd pastures, weather, and day-trip guide.",
            keywords: [
              "Doodhpathri Kashmir",
              "Valley of Milk Kashmir",
              "Shaliganga river Doodhpathri",
              "Doodhpathri altitude",
              "Doodhpathri day trip",
              "Badgam alpine meadows"
            ]
          },
          {
            id: "aharbal",
            heroImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Waterfall_of_Aharbal.JPG/1920px-Waterfall_of_Aharbal.JPG",
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Waterfall_of_Aharbal.JPG/1920px-Waterfall_of_Aharbal.JPG",
            name: "Aharbal",
            type: "scenic",
            emoji: "🌊",
            coords: [33.6450, 74.7800],
            elevation: "2,260 m",
            bestSeason: "May to October",
            difficulty: "Moderate",
            duration: "1–2 Days (or 4–5 Days for Kousar Nag trek)",
            overview: "Celebrated as the 'Niagara of Kashmir', Aharbal is famous for its thunderous 25-meter waterfall formed where the Veshav River plunges through a narrow granite gorge in Kulgam district. Beyond the falls, Aharbal is the vital southern Kashmir trailhead for the wilderness trek to Kungwattan alpine meadows and the sacred, high-altitude glacial lake of Kousar Nag (3,500m) in the Pir Panjal range.",
            experience: "The deafening roar of the Veshav waterfall echoing off sheer rocky cliffs before leading into quiet alpine trailheads.",
            tips: [
              "Exercise caution and stay behind safety railings on the wet rocks near the falls viewpoint.",
              "Aharbal is the official trailhead for hiring local guides and ponies for the 4-day Kousar Nag lake trek."
            ],
            faqs: [
              {
                question: "How do you reach Kousar Nag Lake from Aharbal?",
                answer: "The trek begins from Aharbal, climbing through pine forests to the sprawling meadows of Kungwattan (8 km), before ascending over glacial boulders to the sacred lake at 3,500m."
              },
              {
                question: "How far is Aharbal from Srinagar?",
                answer: "Aharbal is located approximately 70 kilometers south of Srinagar, easily reached via Shopian or Kulgam."
              }
            ],
            seoTitle: "Aharbal Waterfall & Trailhead — Veshav Gorge",
            seoDescription: "Complete guide to Aharbal (2,260m) in Kashmir. Famous 25m waterfall, Veshav River gorge, Kungwattan meadows, Kousar Nag lake trek gateway, and travel tips.",
            keywords: [
              "Aharbal waterfall Kashmir",
              "Kousar Nag trek trailhead",
              "Veshav river gorge",
              "Kungwattan meadows",
              "Aharbal altitude",
              "Kulgam waterfalls"
            ]
          }
        ]
      }
    ]
};
