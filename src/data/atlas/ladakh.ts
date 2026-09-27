import { HimalayaRegion } from "./types";

export const ladakhRegion: HimalayaRegion =   {
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
  };
