import { Trek } from "./types";

export const treks: Trek[] = [
  {
    slug: "beas-kund",
    title: "Beas Kund Trek",
    region: "Kullu-Manali",
    difficulty: "Easy",
    duration: "3 Days",
    distance: "14 km",
    maxAltitude: "3,700 m",
    bestSeason: "May to October",
    coords: [32.3580, 77.1380],
    pathCoords: [
      [32.3150, 77.1580], // Solang
      [32.3250, 77.1550],
      [32.3350, 77.1500],
      [32.3450, 77.1450],
      [32.3580, 77.1380]  // Beas Kund
    ],
    startPoint: "Dhundi / Solang Valley",
    guideRatePerDay: 2000,
    overview: "Beas Kund is the glacial lake believed to be the origin of the River Beas, one of the five rivers of Punjab. Nestled at the foot of the Beas Kund glacier beneath the towering Friendship Peak and Shitidhar, this trek offers a perfect introduction to Himalayan trekking with minimal duration and maximum scenic payoff.",
    routeDescription: "The trek starts from Solang Valley (or Dhundi during peak season when the road is open further). The initial trail winds through boulder fields and grassy slopes above the treeline.",
    itinerary: [
      {
        day: 1,
        title: "Solang Valley to Bakarthach",
        description: "Drive from Manali to Solang Valley/Dhundi (2,800 m). Begin trekking uphill through rocky terrain and sparse shrubs. Cross a few small streams and climb steadily to reach Bakarthach (3,240 m) — a flat, grassy meadow with commanding views of Hanuman Tibba and Seven Sisters peaks.",
        elevationMeters: 3240,
        distanceKm: 5
      },
      {
        day: 2,
        title: "Bakarthach to Beas Kund and back",
        description: "Trek uphill through moraine and boulder fields toward the glacier. Reach Beas Kund (3,700 m), the sacred glacial source of River Beas, surrounded by massive peaks including Friendship Peak, Shitidhar, and Ladakhi. Explore the area and return to Bakarthach for the night.",
        elevationMeters: 3700,
        distanceKm: 4
      },
      {
        day: 3,
        title: "Bakarthach to Solang Valley, drive to Manali",
        description: "Descend back along the same trail to Solang Valley. The return is quicker and offers different perspectives of the valley below. Drive back to Manali by afternoon, completing this short but spectacular trek.",
        elevationMeters: 2800,
        distanceKm: 5
      }
    ],
    packingList: [
      "30-40L daypack or backpack",
      "Sturdy trekking shoes with good grip",
      "Warm fleece jacket and windproof layer",
      "Rain poncho or waterproof jacket",
      "Water bottle (2 liters minimum)",
      "Energy snacks: trail mix, chocolate, dry fruits",
      "Sunglasses and sunscreen",
      "Basic first aid kit"
    ],
    permits: "No permits are required for the Beas Kund trek.",
    faqs: [
      {
        question: "Is Beas Kund trek good for beginners?",
        answer: "Absolutely. Beas Kund is one of the best beginner treks near Manali. The short duration (3 days), moderate altitude, and well-marked trail make it perfect for first-timers."
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=72",
    ],
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=72",
    description: "A short and rewarding trek to the glacial source of River Beas, offering dramatic views of Friendship Peak and surrounding glaciers — perfect for beginners."
  },
  {
    slug: "lamadugh",
    title: "Lamadugh Meadow",
    region: "Kullu-Manali",
    difficulty: "Easy",
    duration: "1 Day (4-5 hours)",
    distance: "6 km",
    maxAltitude: "3,300 m",
    bestSeason: "March to November",
    coords: [32.2620, 77.1680],
    pathCoords: [
      [32.2472, 77.1812], // Hadimba Temple Trailhead (2,050m)
      [32.2530, 77.1750], // Manali Sanctuary Forest Ridge (2,600m)
      [32.2580, 77.1710], // Nasogi Meadow approach (2,950m)
      [32.2620, 77.1680], // Lamadugh High Meadow (3,300m)
    ],
    startPoint: "Hadimba Temple, Old Manali",
    guideRatePerDay: 1500,
    overview: "Lamadugh is a serene meadow nestled in the dense deodar and oak forests above Manali. The trail offers a gentle ascent through shaded woodland paths, opening up to a vast alpine clearing at around 3,300 meters.",
    routeDescription: "The hike begins from the Manali Sanctuary gate near the Hadimba Temple complex. Follow the well-marked forest trail that winds uphill through thick deodar forest.",
    itinerary: [],
    packingList: [
      "Daypack (15-20L)",
      "Good walking shoes",
      "Light fleece or jacket",
      "Water (1.5 liters)",
      "Snacks and lunch",
      "Camera"
    ],
    permits: "No specific permits required.",
    faqs: [
      {
        question: "Can I do Lamadugh without a guide?",
        answer: "The trail to Lamadugh is reasonably well-marked. However, hiring a local guide from Old Manali is recommended to navigate the forest sections confidently."
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
    ],
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=72",
    description: "A peaceful forest walk leading to a stunning alpine meadow with panoramic Himalayan views, perfect for a half-day escape from Manali."
  },
  {
    slug: "patalsu-peak",
    title: "Patalsu Peak Day Hike",
    region: "Kullu-Manali",
    difficulty: "Moderate",
    duration: "1 Day (5-6 hours)",
    distance: "8 km",
    maxAltitude: "4,220 m",
    bestSeason: "May to October",
    coords: [32.3220, 77.1490],
    pathCoords: [
      [32.3167, 77.1583], // Solang Trailhead (2,480m)
      [32.3220, 77.1520], // Shagadugh Ridge Base (3,200m)
      [32.3350, 77.1480], // High Alpine Moraine (3,800m)
      [32.3480, 77.1450], // Patalsu Summit Ridge (4,220m)
    ],
    startPoint: "Solang Village / Buruwa",
    guideRatePerDay: 2500,
    overview: "Patalsu Peak stands at approximately 4,220 meters and offers one of the most accessible high-altitude day hike experiences near Manali. The summit delivers a 360-degree panorama spanning the Pir Panjal range, Rohtang Pass, and the Kullu Valley below.",
    routeDescription: "Take the Solang Valley ropeway to its upper station at approximately 3,300 meters. From here, follow the ridge trail heading northeast past high-altitude meadows and rocky moraine. The final ascent to the summit involves a steep scramble through loose shale.",
    itinerary: [
      {
        day: 1,
        title: "Solang Village to Patalsu Summit and back",
        description: "Start early from Solang Village or take the ropeway to 3,300m. Follow the clear ridge trail northeast through rhododendron shrubs and boulders. The final 200m vertical gain is steep but manageable with trekking poles. Summit views include Hanuman Tibba, Seven Sisters, and deep into the Kullu Valley. Descend by the same route. Total round-trip: 5-6 hours.",
        elevationMeters: 4220,
        distanceKm: 8
      }
    ],
    packingList: [
      "Trekking shoes with ankle support",
      "Layered warm clothing (summit can be cold even in summer)",
      "Trekking poles — highly recommended for descent",
      "2 liters of water",
      "High-energy snacks",
      "Sunscreen SPF 50+",
      "Sunglasses with UV protection",
      "Basic first aid kit"
    ],
    permits: "No permits are required for the Patalsu Peak day hike.",
    faqs: [
      {
        question: "Do I need a local guide for Patalsu?",
        answer: "Yes, standard guide rates in Solang range from ₹2,000 to ₹3,000 per day. Guides are vital to navigate the thick undergrowth in late monsoon and the steep snow slopes in early summer."
      },
      {
        question: "Is the Solang ropeway reliable?",
        answer: "The ropeway operates during peak season (May–October) but can close in poor weather or high winds. Always have a contingency plan to walk up from the base."
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=72",
    ],
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=72",
    description: "A rewarding high-altitude day hike from Solang Valley to a 4,220m summit with panoramic views of the Pir Panjal and Greater Himalayan ranges."
  },
  {
    slug: "hampta-pass",
    title: "Hampta Pass Trek",
    region: "Kullu-Manali",
    difficulty: "Moderate",
    duration: "5 Days",
    distance: "26 km",
    maxAltitude: "4,270 m",
    bestSeason: "June to September",
    coords: [32.2800, 77.3490], // Hampta Pass itself
    pathCoords: [
      [32.2600, 77.2100], // Jobra
      [32.2650, 77.2500], // Chika
      [32.2700, 77.3000], // Balu Ka Ghera
      [32.2800, 77.3490], // Hampta Pass
      [32.2900, 77.3800], // Shea Goru
      [32.3200, 77.4100]  // Chatru
    ],
    startPoint: "Jobra, near Prini",
    guideRatePerDay: 2500,
    overview: "Hampta Pass is one of the most dramatic crossovers in the Indian Himalayas — a route that transforms from lush green Kullu Valley on one side to the stark, lunar landscape of the Lahaul Valley on the other. The contrast in terrain and vegetation over just 26 km is staggering, making this one of the most visually rewarding moderate treks in Himachal Pradesh.",
    routeDescription: "The trek begins at Jobra, near Prini village outside Manali. The trail gradually climbs through dense forest, crossing multiple glacial streams before camping at Chika and Balu Ka Ghera meadows. The dramatic final push to Hampta Pass (4,270m) rewards trekkers with views across both valleys. The route descends to Shea Goru and then Chatru, where jeeps connect to the Manali-Leh highway.",
    itinerary: [
      {
        day: 1,
        title: "Manali to Jobra, Trek to Chika",
        description: "Drive from Manali to Jobra trailhead (2,920m). Begin trekking through pine forest along the Rani Nallah stream. Campsite at Chika meadow (3,100m). Evening views of Deo Tibba from camp.",
        elevationMeters: 3100,
        distanceKm: 2
      },
      {
        day: 2,
        title: "Chika to Balu Ka Ghera",
        description: "Trek further up the valley, crossing streams on log bridges. The valley widens dramatically with towering granite walls. Camp at Balu Ka Ghera (3,600m) surrounded by glaciers.",
        elevationMeters: 3600,
        distanceKm: 7
      },
      {
        day: 3,
        title: "Balu Ka Ghera to Shea Goru (via Hampta Pass)",
        description: "The summit day. Ascend steeply to Hampta Pass (4,270m) — the landscape transitions from green Kullu to the bone-dry browns of Lahaul. A long descent to Shea Goru camp (3,900m) in Lahaul.",
        elevationMeters: 4270,
        distanceKm: 7
      },
      {
        day: 4,
        title: "Shea Goru to Chatru",
        description: "Descend through the Lahaul valley to Chatru (3,350m), a roadhead on the Manali-Leh highway. Optional day trip to Chandratal Lake (4,300m) from Chatru — highly recommended.",
        elevationMeters: 3350,
        distanceKm: 5
      },
      {
        day: 5,
        title: "Chatru to Manali (via Rohtang)",
        description: "Drive back to Manali via Rohtang Pass. The journey offers sweeping views of both valleys you have crossed. Arrive in Manali by afternoon.",
        elevationMeters: 2050,
        distanceKm: 0
      }
    ],
    packingList: [
      "50-60L trekking backpack",
      "Waterproof trekking boots",
      "Insulated sleeping bag (-5°C rating minimum)",
      "Layered clothing: thermal, fleece, down jacket",
      "Waterproof rain jacket and pants",
      "Trekking poles",
      "Headlamp with extra batteries",
      "Water purification tablets or filter",
      "Sunscreen SPF 50+ and glacier glasses",
      "Personal first aid kit with altitude sickness medication"
    ],
    permits: "Hampta Pass trek requires an Inner Line Permit if you plan to proceed to Spiti Valley. The crossing itself and return via Rohtang requires a Rohtang Pass permit for vehicles, available online from HRTC.",
    faqs: [
      {
        question: "Is Hampta Pass suitable for first-time multi-day trekkers?",
        answer: "Yes, with caveats. You should be comfortable with 5-7 hours of daily walking at altitude. Prior experience on an easy trek like Beas Kund is recommended before attempting Hampta Pass."
      },
      {
        question: "When does the Hampta Pass route open?",
        answer: "The pass typically opens in mid-June as the snow melts, and remains accessible until mid-September. July and August can see heavy rain on the Kullu side."
      },
      {
        question: "Can I add Chandratal Lake to this trek?",
        answer: "Absolutely — Chandratal (Moon Lake) at 4,300m near Chatru is one of India's most beautiful high-altitude lakes. Most itineraries include a 12km round trip to the lake on Day 4."
      }
    ],
    images: [
      "https://images.pexels.com/photos/32109154/pexels-photo-32109154.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/19100015/pexels-photo-19100015.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/9354091/pexels-photo-9354091.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
    description: "A stunning 5-day crossover trek from the green Kullu Valley to the arid moonscape of Lahaul, crossing Hampta Pass at 4,270m — one of Himachal's most dramatic contrasts."
  },
  {
    slug: "bhrigu-lake",
    title: "Bhrigu Lake Trek",
    region: "Kullu-Manali",
    difficulty: "Moderate",
    duration: "3 Days",
    distance: "22 km",
    maxAltitude: "4,300 m",
    bestSeason: "May to June, September to October",
    coords: [32.2240, 77.2510],
    pathCoords: [
      [32.3150, 77.1950], // Gulaba Roadhead (3,100m)
      [32.2850, 77.2180], // Jonker Thatch (3,350m)
      [32.2580, 77.2340], // Rola Kholi Campsite (3,500m)
      [32.2410, 77.2420], // Pandu Ropa Ridge (3,900m)
      [32.2240, 77.2510], // Bhrigu Sacred Glacial Tarn (4,300m)
    ],
    startPoint: "Gulaba, Rohtang Road",
    guideRatePerDay: 2000,
    overview: "Bhrigu Lake is a stunning high-altitude lake at 4,300 meters on the edge of the Rohtang plateau. Named after the sage Bhrigu, the lake remains frozen for much of the year and is surrounded by vast rolling meadows that explode with wildflowers in early summer. It is considered one of the most accessible high-altitude alpine lakes near Manali.",
    routeDescription: "The trek begins at Gulaba on the Manali-Rohtang road. The trail climbs steadily through open grasslands and birch forests, crossing several seasonal streams. By Day 2, trekkers reach the exposed high-altitude plateau before the final push to the lake. Return is by the same route.",
    itinerary: [
      {
        day: 1,
        title: "Gulaba to Rola Khuli Camp",
        description: "Drive from Manali to Gulaba (3,100m). Trek through open meadows with views of Kullu Valley. Camp at Rola Khuli (3,500m), a flat clearing below the treeline.",
        elevationMeters: 3500,
        distanceKm: 7
      },
      {
        day: 2,
        title: "Rola Khuli to Bhrigu Lake and back to Rola Khuli",
        description: "Early start for the summit day. Climb steeply across the plateau to reach Bhrigu Lake (4,300m). The lake is often partially frozen even in July. Return to camp.",
        elevationMeters: 4300,
        distanceKm: 8
      },
      {
        day: 3,
        title: "Rola Khuli to Gulaba, drive to Manali",
        description: "Descend back to Gulaba trailhead. Drive back to Manali.",
        elevationMeters: 3100,
        distanceKm: 7
      }
    ],
    packingList: [
      "Trekking boots (waterproof)",
      "Insulated jacket and warm layers",
      "Sleeping bag rated to -5°C",
      "Trekking poles",
      "Rain gear",
      "Sunscreen and glacier glasses",
      "2 liters water capacity + purification"
    ],
    permits: "No specific trekking permits required. A Rohtang Pass vehicle permit is needed to drive to Gulaba — book at least 1 day in advance from the HRTC office in Manali.",
    faqs: [
      {
        question: "Is Bhrigu Lake trek safe in monsoon?",
        answer: "The lake trail is largely above the monsoon belt, but the approach road to Gulaba can be treacherous. July and August carry some risk; May-June and September are better windows."
      },
      {
        question: "Is acclimatization needed for Bhrigu Lake?",
        answer: "Yes. Spend at least one full day in Manali (2,050m) before beginning this trek. Ascending to 4,300m without prior acclimatization increases risk of altitude sickness."
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=72",
    ],
    heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=72",
    description: "Trek to one of the most beautiful alpine lakes near Manali, perched at 4,300m on the edge of the Rohtang plateau amid vast wildflower-carpeted meadows."
  },
  {
    slug: "chandrakhani-pass",
    title: "Chandrakhani Pass Trek",
    region: "Kullu-Manali",
    difficulty: "Difficult",
    duration: "4 Days",
    distance: "30 km",
    maxAltitude: "3,660 m",
    bestSeason: "May to October",
    coords: [32.1030, 77.1510],
    pathCoords: [
      [32.1480, 77.1660], // Naggar Castle Trailhead (1,760m)
      [32.1520, 77.1780], // Rumsu Village (2,400m)
      [32.1380, 77.1890], // Stelling Alpine Clearing (3,100m)
      [32.1220, 77.2150], // Chandrakhani High Pass (3,660m)
      [32.1030, 77.2510], // Malana Gorge Descent & Village (2,650m)
    ],
    startPoint: "Naggar Castle, Naggar",

    guideRatePerDay: 2500,
    overview: "Chandrakhani Pass is a high-altitude crossing connecting the Kullu Valley to the secluded Malana village — home to one of the most unique and ancient tribal communities in the world. The route traverses stunning oak and rhododendron forests, high alpine meadows, and the dramatic pass itself at 3,660m, before descending to the legendary Malana village perched above the Malana gorge.",
    routeDescription: "The trek starts from Naggar, the ancient capital of Kullu Kingdom. The trail climbs through dense forest to Rumsu village and then to the base of the pass. After crossing Chandrakhani Pass, the route descends steeply into the Malana valley. Return is by jeep from Malana to Manali via Jari.",
    itinerary: [
      {
        day: 1,
        title: "Naggar to Rumsu Village Camp",
        description: "Begin the trek from Naggar Castle (1,760m). Climb through terraced fields and oak forest to reach Rumsu village (2,400m). Camp here or at nearby meadows.",
        elevationMeters: 2400,
        distanceKm: 5
      },
      {
        day: 2,
        title: "Rumsu to Chandrakhani Meadows Base Camp",
        description: "Ascend through rhododendron forest as the trail opens onto vast alpine meadows. Panoramic views of the Kullu Valley and Deo Tibba. Camp below the pass at 3,300m.",
        elevationMeters: 3300,
        distanceKm: 8
      },
      {
        day: 3,
        title: "Cross Chandrakhani Pass, descend to Malana",
        description: "Early morning crossing of Chandrakhani Pass (3,660m) with expansive views. Steep descent into the Malana valley. Arrive in Malana village — a place with strict customs and rules for visitors. Camp outside the village.",
        elevationMeters: 3660,
        distanceKm: 12
      },
      {
        day: 4,
        title: "Malana to Manali (via Jari)",
        description: "Descend from Malana village to the trailhead above Malana dam. Drive by jeep via Jari to Bhuntar, then onwards to Manali.",
        elevationMeters: 2050,
        distanceKm: 5
      }
    ],
    packingList: [
      "45-55L trekking backpack",
      "Sturdy trekking boots with ankle support",
      "3-season sleeping bag",
      "Layered clothing system",
      "Waterproof outer shell",
      "Trekking poles",
      "Headlamp",
      "Water purification",
      "Snacks and trail food"
    ],
    permits: "No general permits required for trekkers. Vehicles driving beyond Kasol toward Malana require the Malana valley vehicle permit from the Kullu DFO office.",
    faqs: [
      {
        question: "Can I visit Malana village freely?",
        answer: "Malana has strict rules: do not touch local people or their property, do not enter homes uninvited, and always walk on designated paths. The village is unique — locals follow their own governance and customs. Respect is paramount."
      },
      {
        question: "How difficult is the Chandrakhani Pass crossing?",
        answer: "The pass is rated difficult mainly due to steep sections and some loose trail near the top. The altitude is moderate at 3,660m, making it safer for acclimatized trekkers compared to higher passes."
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=72",
    ],
    heroImage: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=72",
    description: "Cross the dramatic Chandrakhani Pass into the ancient, enigmatic Malana village — one of the most culturally fascinating treks in the Kullu Valley."
  }
];
