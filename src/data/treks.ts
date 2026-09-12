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
    heroImage: "https://images.pexels.com/photos/18979387/pexels-photo-18979387.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: [
      "https://images.pexels.com/photos/18979387/pexels-photo-18979387.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/18979386/pexels-photo-18979386.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
    description: "A short and rewarding trek to the glacial source of River Beas, offering dramatic views of Friendship Peak and surrounding glaciers — perfect for beginners."
  },
  {
    slug: "lamadugh",
    title: "Lamadugh Meadow",
    region: "Kullu-Manali",
    difficulty: "Easy",
    duration: "1 Day (4-5 hours)",
    distance: "9 km round-trip",
    maxAltitude: "3,300 m",
    bestSeason: "April to November",
    coords: [32.2530, 77.1680],
    pathCoords: [
      [32.2470, 77.1830], // Hadimba Temple Trailhead (2,050m)
      [32.2510, 77.1770], // Deodar Canopy Crest (2,450m)
      [32.2540, 77.1710], // Oak & Birch Transitional Ridge (2,900m)
      [32.2530, 77.1680], // Lamadugh Alpine Meadow (3,300m)
    ],
    startPoint: "Hadimba Temple, Old Manali",
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
    heroImage: "https://images.pexels.com/photos/11948660/pexels-photo-11948660.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: [
      "https://images.pexels.com/photos/11948660/pexels-photo-11948660.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
    description: "A peaceful forest walk leading to a stunning alpine meadow with panoramic Himalayan views, perfect for a half-day escape from Manali."
  },
  {
    slug: "patalsu-peak",
    title: "Patalsu Peak Trek",
    region: "Kullu-Manali",
    difficulty: "Challenging",
    duration: "3 Days (1-Day Ultra Push for Fit Climbers)",
    distance: "16 km round-trip",
    maxAltitude: "4,261 m",
    bestSeason: "May to October",
    coords: [32.3547, 77.1939],
    pathCoords: [
      [32.3207084, 77.153156],
      [32.3213709, 77.1544826],
      [32.3218839, 77.1556559],
      [32.3211334, 77.1578156],
      [32.3223317, 77.1597286],
      [32.3235687, 77.1566359],
      [32.326734, 77.1575822],
      [32.3283213, 77.159604],
      [32.3296138, 77.1605406],
      [32.3310674, 77.1610072],
      [32.3349906, 77.1624455],
      [32.333463, 77.1633435],
      [32.3339763, 77.1650009],
      [32.3349343, 77.1674097],
      [32.3364746, 77.1680582],
      [32.3365693, 77.1690923],
      [32.3362317, 77.1700603],
      [32.3376497, 77.1709858],
      [32.3399232, 77.1728621],
      [32.3430227, 77.17523],
      [32.3454777, 77.176108],
      [32.346638, 77.1767026],
      [32.3473727, 77.1770514],
      [32.3484296, 77.177563],
      [32.3507219, 77.1789534],
      [32.3516948, 77.1797977],
      [32.3519297, 77.1814396],
      [32.3522329, 77.1831804],
      [32.3522766, 77.1844407],
      [32.3529648, 77.1865591],
      [32.3515541, 77.1880191],
      [32.3523286, 77.1895698],
      [32.3532101, 77.1905993],
      [32.3539401, 77.1906891],
      [32.3547395, 77.1916726],
      [32.3547474, 77.1938936],
    ],
    startPoint: "Solang Village / Buruwa (2,480m)",
    guideRatePerDay: 2500,
    overview: "Patalsu Peak stands at 4,261 meters (13,980 ft) above Solang Valley, widely recognized as the premier beginner-friendly 4,000m trekking peak in Manali and one of the finest non-technical summits in Himachal Pradesh. The route covers 16 km round-trip from Solang Village (8 km each way) with an intense vertical gain of +1,781 meters.\n\nCelebrated as one of the best snow Manali treks during spring (May to June) when the upper ridgelines retain snowfields, and an iconic high-altitude speed hike trek in autumn for endurance athletes conquering the summit in a grueling 12–13 hour single-day push. From the summit crest, trekkers enjoy an unrestricted 360-degree panorama of Hanuman Tibba (5,982m), Friendship Peak (5,289m), Shitidhar, Ladakhi Peak, Rohtang Pass, and the boundless Dhauladhar and Pir Panjal ranges.",
    routeDescription: "Starting from the traditional stone houses of Solang Village (2,480m) just 14 km from Manali, the trail ascends through fragrant deodar, pine, and oak woods. Breaking above the treeline at approximately 3,250m brings you to the sweeping alpine amphitheater of Shagadugh meadow.\n\nFrom Shagadugh, the gradient steepens onto an exposed shale ridgeline. Trekkers navigate loose scree switchbacks facing the monumental western face of Hanuman Tibba. The final 200m ridge climb leads directly to the 4,261m summit marker, rewarding hikers with one of the most commanding viewpoints in the Western Himalayas.",
    itinerary: [
      {
        day: 1,
        title: "Solang Valley / Buruwa (2,480m) to Shagadugh Alpine Meadow (3,250m)",
        description: "Depart Old Manali and head toward Solang Valley. The trail leaves the commercial resort road and ascends through ancient Solang Village with its traditional stone houses and wooden balconies. Enter dense cedar, pine, and oak forests where village cattle graze in quiet clearings. Emerge above the treeline into the expansive Shagadugh meadow. Camp overnight under the stars with commanding views of the Solang basin.",
        elevationMeters: 3250,
        distanceKm: 5
      },
      {
        day: 2,
        title: "Summit Push: Shagadugh to Patalsu Peak (4,261m) & Return to High Camp",
        description: "An alpine start at 5:00 AM to summit before midday convective clouds develop. Ascend steep grassy switchbacks that give way to an exposed, rocky ridgeline. As altitude increases, Hanuman Tibba (5,982m) looms in monumental scale directly across the valley. Battle the steep final 200m ridge of loose shale into bitter winds to reach the 4,261m summit. Enjoy an unrestricted 360° panorama of the Pir Panjal, Dhauladhar, and Rohtang pass before descending safely back to Shagadugh.",
        elevationMeters: 4261,
        distanceKm: 6
      },
      {
        day: 3,
        title: "Shagadugh Meadow to Solang Valley & Return to Old Manali (2,050m)",
        description: "Wake to golden morning sunlight sweeping across the upper Kullu peaks. Enjoy a warm camp breakfast before descending through the pine forests to Solang Village. Celebrate with hot chai and paranthas at the valley trailhead before returning to Old Manali.",
        elevationMeters: 2050,
        distanceKm: 5
      }
    ],
    packingList: [
      "Sturdy high-ankle trekking boots with vibram or deep lug grip",
      "Thermal base layers and down jacket (summit ridge is wind-swept and freezing)",
      "Windproof and waterproof outer hardshell",
      "Pair of trekking poles (indispensable on the loose scree descent)",
      "Minimum 3 liters of water (no water sources above Shagadugh)",
      "High-calorie trail snacks, energy bars, and dry fruits",
      "UV400 Category 3/4 alpine sunglasses and sunscreen SPF 50+",
      "Warm fleece gloves and windproof outer mittens",
      "Headlamp with spare batteries for early dawn summit push",
      "First aid kit with Diamox, ORS, and blister protection"
    ],
    permits: "No special inner-line permits are required. Normal forestry and local trailhead registration at Solang Village apply.",
    faqs: [
      {
        question: "How much does it cost to trek to Patalsu Peak?",
        answer: "A self-supported 1-day speed hike costs virtually ₹0 beyond personal food and local transit to Solang Valley. Hiring an accredited local Manali mountain guide typically costs ₹1,500 to ₹2,500 per day. Full 2 to 3-day guided expedition packages (including alpine camping at Shagadugh, dome tents, high-altitude meals, guide, and porter logistics) range between ₹4,000 and ₹7,500 per trekker."
      },
      {
        question: "What is the height and altitude of Patalsu Peak?",
        answer: "Patalsu Peak stands at an elevation of 4,261 meters (13,980 feet) above sea level. The trek starts at Solang Village (2,480m / 8,136 ft), demanding an intense continuous vertical gain of +1,781 meters (5,843 ft) to reach the summit crest."
      },
      {
        question: "What is the distance of the Patalsu Peak trek from Solang Valley?",
        answer: "The total distance of the Patalsu Peak trek is 16 kilometers round-trip. The ascent from Solang Village to Patalsu Peak summit is approximately 8 km, with a corresponding 8 km descent back to the trailhead."
      },
      {
        question: "Is Patalsu Peak beginner-friendly compared to other peaks in Manali?",
        answer: "Yes, Patalsu Peak (4,261m) is widely regarded as the best beginner-friendly 4,000m peak in Manali. Unlike technical 5,000m peaks like Friendship Peak (5,289m) or Ladakhi Peak which require crampons, ropes, and ice axes, Patalsu is a non-technical trekking peak. While it requires strong cardiovascular stamina to tackle the +1,781m elevation gain, anyone with good physical fitness can safely summit when paced over 2 to 3 days."
      },
      {
        question: "Can Patalsu Peak be done in one day as a speed hike?",
        answer: "Yes, Patalsu Peak is famous as one of Himachal's premier speed hike treks. Fit alpine athletes and acclimatized trail runners complete the entire 16 km trail with +1,781m vertical gain in 12 to 13 continuous hours. A 5:00 AM alpine start from Solang Village is strictly mandatory to clear the summit ridge before afternoon winds and convective clouds roll in."
      },
      {
        question: "Is it possible to trek Patalsu Peak in May?",
        answer: "Yes, May is one of the best months for Patalsu Peak. The lower cedar forests and Shagadugh meadows are lush with early spring growth and blooming wildflowers, while the upper ridge above 3,800m still holds crisp snow patches, delivering an exhilarating snow trek experience with moderate temperatures."
      },
      {
        question: "Can you do the Patalsu Peak trek in December or winter?",
        answer: "In December, Patalsu Peak transforms into a heavy winter snow trek. Trekking up to Shagadugh meadow (3,250m) through snow-draped pine forests is a popular winter hike achievable with gaiters and microspikes. However, pushing past the ridge to the 4,261m summit in mid-winter becomes an advanced snow mountaineering undertaking due to sub-zero blizzards, hidden shale crevasses, and avalanche risk."
      },
      {
        question: "What is the weather and temperature on Patalsu Peak?",
        answer: "During peak season (May–June and September–October), daytime valley temperatures range from 12°C to 20°C, while summit temperatures hover between 2°C and 8°C. Night temperatures at Shagadugh camp drop to 0°C to 4°C. In late autumn (late October) and winter, summit temperatures plummet to -5°C to -15°C with severe ridge wind-chill."
      },
      {
        question: "What peaks can you see from Patalsu Peak summit?",
        answer: "The summit offers an unparalleled 360-degree Himalayan amphitheater: the colossal western precipice of Hanuman Tibba (5,982m) dominates the skyline, alongside Friendship Peak (5,289m), Shitidhar (5,290m), Ladakhi Peak, the Rohtang Pass ridge, Deo Tibba (6,001m), and the vast sweeping snow peaks of the Dhauladhar and Greater Himalayan ranges."
      }
    ],
    images: [
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/2clearviewofPatalsu.jpg",
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/4GoingtoSolangVillage.jpg",
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/6SolangVillage.jpg",
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/7trekStart.jpg",
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/8intotheforestsectionCattleGrazing.jpg",
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/v1777212310/9_1doghiking.jpg",
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/10abovetheTreelineViewOfDhauladharRanges.jpg",
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/11IntoRidgeline.jpg",
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/13ViewOfHanumanTibba.jpg",
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/12FinalRidge.jpg",
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/14SummitSelfie.jpg",
      "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/15SunsetHanumanTibba.jpg"
    ],
    heroImage: "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/10abovetheTreelineViewOfDhauladharRanges.jpg",
    description: "A commanding 4,261m non-technical summit rising above Solang Valley. Standard 3-day expedition with high camp at Shagadugh, or a grueling 1-day endurance push with 360° panoramas of Hanuman Tibba and the Pir Panjal."
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
    heroImage: "https://images.unsplash.com/photo-1688804470994-271ad19db477?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1688804470994-271ad19db477?auto=format&fit=crop&w=1600&q=80",
      "https://images.pexels.com/photos/32109154/pexels-photo-32109154.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/38654969/pexels-photo-38654969.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
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
    heroImage: "https://cdn.pixabay.com/photo/2021/04/05/18/44/bhrigu-lake-6154348_1280.jpg",
    images: [
      "https://cdn.pixabay.com/photo/2021/04/05/18/44/bhrigu-lake-6154348_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/10/15/16/27/trekking-1742822_1280.jpg",
    ],
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
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/2/24/Chandrakhani_pass_3%2C_himachal_pradesh.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/2/24/Chandrakhani_pass_3%2C_himachal_pradesh.jpg",
    ],
    description: "Cross the dramatic Chandrakhani Pass into the ancient, enigmatic Malana village — one of the most culturally fascinating treks in the Kullu Valley."
  }
];
