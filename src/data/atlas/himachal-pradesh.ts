import { HimalayaRegion, PlaceType } from "./types";
import { treks } from "../treks";
import { peaks } from "../peaks";

export const himachalPradeshRegion: HimalayaRegion =   {
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
            heroImage: "https://images.unsplash.com/photo-1733490094009-454bd67f3e2a?q=80&w=1600&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1733490094009-454bd67f3e2a?q=80&w=1600&auto=format&fit=crop",
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
            seoDescription: "Explore Dalhousie and Dainkund Peak (2,755m) in Chamba, Himachal Pradesh. 360° views of Pir Panjal, Pholani Devi temple hike, Kalatop sanctuary trail, and."
          },
          {
            id: "khajjiar-meadow",
            heroImage: "https://images.unsplash.com/photo-1714381639586-80d1f04dfb0e?q=80&w=1600&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1714381639586-80d1f04dfb0e?q=80&w=1600&auto=format&fit=crop",
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
            heroImage: "https://images.unsplash.com/photo-1789576890316-3ba0633fbf7d?q=80&w=1600&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1789576890316-3ba0633fbf7d?q=80&w=1600&auto=format&fit=crop",
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
            seoTitle: "Bharmour Chaurasi Temples (2,195m) — Ancient Gaddi Capital",
            seoDescription: "Explore Bharmour & the 84 Chaurasi Temples (2,195m) in Chamba. Ancient Brahmpura architecture, Gaddi shepherd heritage, and base camp for the holy."
          },
          {
            id: "manimahesh-kailash",
            heroImage: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Kailash_Manimahesh.jpg",
            image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Kailash_Manimahesh.jpg",
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
            seoTitle: "Manimahesh Kailash Lake Trek (4,080m) — Route",
            seoDescription: "Complete guide to the sacred Manimahesh Kailash Trek (4,080m) in Chamba. Route map from Hadsar, Gauri Kund, Yatra season, altitude precautions, and."
          },
          {
            id: "sach-pass",
            heroImage: "https://upload.wikimedia.org/wikipedia/commons/1/1d/View_of_Saach_pass.jpg",
            image: "https://upload.wikimedia.org/wikipedia/commons/1/1d/View_of_Saach_pass.jpg",
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
            seoTitle: "Sach Pass (4,414m) Guide — Chamba to Pangi Valley 4x4 Route",
            seoDescription: "Essential guide to crossing Sach Pass (4,414m / 14,482 ft). Road status, opening dates, 4x4 route conditions from Bairagarh to Killar, and mountain safety."
          },
          {
            id: "pangi-valley",
            heroImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Pangi_Valley.jpg/1280px-Pangi_Valley.jpg",
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Pangi_Valley.jpg/1280px-Pangi_Valley.jpg",
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
            seoTitle: "Pangi Valley & Killar (2,600m) — Wild Himalayas Guide",
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
            heroImage: "https://images.unsplash.com/photo-1620684979162-e8ffbb2fd462?q=80&w=1600&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1620684979162-e8ffbb2fd462?q=80&w=1600&auto=format&fit=crop",
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
            heroImage: "https://images.unsplash.com/photo-1596808042579-6057d4b79fc7?q=80&w=2340&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1596808042579-6057d4b79fc7?q=80&w=2340&auto=format&fit=crop",
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
            heroImage: "https://images.unsplash.com/photo-1620720970374-5b7e67e1e610?q=80&w=1600&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1620720970374-5b7e67e1e610?q=80&w=1600&auto=format&fit=crop",
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
            heroImage: "https://cdn.pixabay.com/photo/2020/04/13/06/59/dhauladhar-range-5036975_1280.jpg",
            image: "https://cdn.pixabay.com/photo/2020/04/13/06/59/dhauladhar-range-5036975_1280.jpg",
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
            seoTitle: "McLeod Ganj & Dharamshala (2,082m) — Tibetan Culture",
            seoDescription: "Explore McLeod Ganj & Dharamshala in Kangra. Visit Tsuglagkhang temple, Dalai Lama residence, Tibetan heritage trails, and Dhauladhar trekking bases."
          },
          {
            id: "indrahar-pass",
            heroImage: "https://cdn.pixabay.com/photo/2018/01/11/21/04/nature-3076910_1280.jpg",
            image: "https://cdn.pixabay.com/photo/2018/01/11/21/04/nature-3076910_1280.jpg",
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
            heroImage: "https://images.unsplash.com/photo-1656670610903-025312104457?q=80&w=2400&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1656670610903-025312104457?q=80&w=2400&auto=format&fit=crop",
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
            seoTitle: "Kangra Fort & Masrur Rock Cut Temples Guide",
            seoDescription: "Discover Kangra Fort (oldest fort in the Himalayas) and the 8th-century monolithic Masrur Rock Cut Temples. Katoch dynasty history, architecture, and."
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
              t.slug === "lamadugh" ||
              t.slug === "jogni-falls";

            const isPatalsu = t.slug === "patalsu-peak";
            const isJogni = t.slug === "jogni-falls";
            const experience = isPatalsu
              ? "I did Patalsu as a continuous 12 to 13-hour single-day speed-hike in October with only minimal breaks. Conquering the +1,781m vertical gain in one push is an incredible test of mountain endurance, but for most trekkers, I strongly recommend doing this as a 2 to 3-day trek. Camping at Shagadugh gives your body time to acclimatize and lets you truly experience the peaceful forest before tackling the relentless loose scree on the summit ridge."
              : isJogni
              ? "Parked the scooty at Vashisht village and set out on foot. Winding past the cozy backpacker cafés and ancient wooden shrines, the trail quickly opens into apple orchards and pine woods. First come quirky trail signs reminding visitors to leave no trace, followed by the distant murmur of water. Before reaching the main cascade, lower tiered falls and crystal streams rush over mossy boulders. Continuing upward along the steep dirt path brings you directly beneath the roaring 150-foot plunge of Jogni Falls, where glacial mist cools the air and snow-capped Himalayan peaks frame the distant horizon."
              : undefined;

            const tips = isPatalsu
              ? [
                  "Water Warning: Natural water sources end very early, roughly 500 meters above Solang Village. There is no reliable water along the upper forest, Shagadugh (dry in late season), or the summit ridge. You must carry at least 2 to 4 Liters of water from the start.",
                  "Duration Recommendation: While trail runners and seasoned endurance hikers can tackle this as a grueling 12–13 hour single-day speed-hike, we strongly recommend 2 to 3 days for standard trekkers with a camp at Shagadugh meadow (3,250m).",
                  "Early Alpine Start: Start before dawn (5:00 AM) to summit before afternoon cloud buildups and gale winds, and to avoid descending the steep, slippery forest sections in total darkness.",
                  "Scree Footing & Poles: The final 200m vertical ascent traverses narrow, wind-swept loose scree and fractured shale. Sturdy boots with deep traction lugs and trekking poles are non-negotiable for balance.",
                  "Wind Protection: Even during clear October weather, winds on the exposed 4,200m ridge are bitterly cold. Carry a windproof shell jacket, warm beanie, and thermal gloves."
                ]
              : isJogni
              ? [
                  "Park your scooty at Vashisht near the temple square and start early to catch soft morning light.",
                  "Take a moment to read the rustic local signboards along the pine paths—and pack all your trash out.",
                  "Don't rush past the lower cascade pools; they offer wonderful quiet viewpoints and cold glacial water.",
                  "The trail past the lower falls climbs steeply over tree roots and rocks to the upper amphitheater—it is well worth the sweat.",
                  "Carry a light windbreaker or rain shell; the spray mist near the base of the upper waterfall is intense."
                ]
              : undefined;

            return {
              id: t.slug,
              name: t.title,
              type: (isDayHike ? "day-hike" : "trek") as PlaceType,
              emoji: isJogni ? "🌊" : (isDayHike ? "🚶" : (isPatalsu ? "⛰️" : "🥾")),
              coords: t.coords,
              pathCoords: t.pathCoords,
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
              seoTitle: isJogni ? "Jogni Falls Trek (2,280m) Vashisht, Manali — Route & Guide" : undefined,
              seoDescription: isJogni ? "Complete guide to Jogni Falls (2,280m) in Vashisht, Manali. Verified GPS route, 13-stage photo story, lower cascades vs upper amphitheater, and trail tips." : undefined,
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
            heroImage: "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/4GoingtoSolangVillage.jpg",
            image: "https://res.cloudinary.com/dehriwm1o/image/upload/q_auto,f_auto/4GoingtoSolangVillage.jpg",
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
            coords: [32.2349, 77.2223],
            elevation: "2,750 m",
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
            seoTitle: "Sethan Village — Hampta Valley (2",
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
            seoTitle: "Hadimba Devi Temple (2,050m) Manali — History",
            seoDescription: "Complete visitor guide to the 16th-century Hadimba Temple in Manali. 1553 CE pagoda architecture, Dhungri sacred deodar forest, rituals, Ghatotkach."
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
            seoTitle: "Old Manali Village (2,050m) — Cafes",
            seoDescription: "Explore Old Manali: heritage timber-and-stone architecture, Manu Maharishi Temple, Bohemian cafes, apple orchards, and scenic mountain trails above."
          },
          {
            id: "kheerganga",
            heroImage: "https://cdn.pixabay.com/photo/2020/07/27/07/55/mountains-5441619_1280.jpg",
            image: "https://cdn.pixabay.com/photo/2020/07/27/07/55/mountains-5441619_1280.jpg",
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
            seoTitle: "Kheerganga Trek (2,960m) Parvati Valley — Route",
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
            seoTitle: "Pin Parvati Pass Trek (5,319m) — Expedition Guide",
            seoDescription: "Detailed expedition dossier for Pin Parvati Pass (5,319m / 17,450 ft). 11-day itinerary from Parvati to Spiti, Mantalai Lake, glacier route, and safety gear."
          },
          {
            id: "rohtang-pass",
            name: "Rohtang Pass",
            type: "road",
            emoji: "🏔️",
            coords: [32.37, 77.25],
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
            seoTitle: "Rohtang Pass (3,978m) Guide — Permits",
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
            seoTitle: "Jalori Pass & Serolsar Lake Trek (3,120m) Guide",
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
            seoTitle: "Manali Mall Road (2,000m) — Shopping",
            seoDescription: "Visitor guide to Manali Mall Road (2,000m). Pedestrian shopping boulevard, certified Kullu shawl emporiums, Tibetan markets, Van Vihar riverside park, and."
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
            seoTitle: "Kullu Town (1,220m) — Shawl Factories",
            seoDescription: "Guide to Kullu Town, Himachal Pradesh. Authentic handloom shawl weaving factories (Bhuttico), historic Raghunath Temple, international Dussehra festival."
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
            seoTitle: "Vashisht Hot Springs & Temple (2,150m) Manali Guide",
            seoDescription: "Visitor guide to Vashisht Village (2,150m) in Manali. Ancient Vashistha temple, natural sulfur hot water baths, therapeutic kunds, and Jogini Waterfall."
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
            seoTitle: "Burwa Village (2,200m) Manali — Apple Orchards",
            seoDescription: "Discover Burwa village near Manali. Traditional Kath-Kuni architecture, historic apple orchards, granite climbing crags, Nehru Kund spring, and scenic."
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
            seoTitle: "Kothi Village & Beas Gorge (2,500m) Manali — Canyon Views",
            seoDescription: "Explore Kothi village (2,500m) near Manali. Dramatic Beas River granite gorge, historic caravan trailheads, British-era rest house, and panoramic glacier."
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
            seoTitle: "Gulaba Alpine Meadow (3,165m) Manali — Snow Point",
            seoDescription: "Complete guide to Gulaba (3,165m) on the Rohtang Pass highway. Official trailhead for Bhrigu Lake trek, winter snow activities, NGT permit rules, and."
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
            seoTitle: "Marhi Plateau (3,320m) — High-Altitude Halt",
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
            seoTitle: "Dhundi (2,840m) Manali — Beas Kund Trailhead",
            seoDescription: "Explore Dhundi (2,840m) near Solang Valley. Official starting point for Beas Kund glacier trek, climbing base for Friendship Peak, South Portal approach."
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
            seoTitle: "Bijli Mahadev Temple & Trek (2,460m) Kullu — Guide",
            seoDescription: "Complete guide to Bijli Mahadev Temple (2,460m) in Kullu. The lightning miracle Shiva lingam, 3 km pine forest hike from Chansari, 360-degree valley."
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
            seoTitle: "Atal Tunnel Rohtang (9.02km) Guide",
            seoDescription: "Essential guide to Atal Tunnel (Rohtang). 9.02 km engineering marvel connecting Manali and Lahaul, speed rules, South & North portals, and day trip itineraries."
          },
          {
            id: "sissu",
            name: "Sissu (North Portal)",
            type: "scenic",
            emoji: "🌊",
            coords: [32.43, 77.24],
            elevation: "3,100 m",
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
            seoTitle: "Sissu Waterfall & Lake (3,120m) Guide",
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
            seoTitle: "Koksar Snow Point (3,140m) Lahaul — Day Trip from Manali",
            seoDescription: "Visitor guide to Koksar (3,140m), the historic first village of Lahaul. Winter snow tubing, Chandra river valley, Atal Tunnel access, and road to Spiti."
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
            heroImage: "https://images.unsplash.com/photo-1661318977466-5fbd41d8ed83?q=80&w=1600&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1661318977466-5fbd41d8ed83?q=80&w=1600&auto=format&fit=crop",
            name: "Prashar Lake & Pagoda Temple",
            type: "lake",
            emoji: "🌊",
            coords: [31.77, 77.06],
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
            seoTitle: "Prashar Lake & Pagoda Temple (2,730m) Mandi — Trek",
            seoDescription: "Discover Prashar Lake (2,730m) in Mandi. Mystical floating island, 13th-century 3-tiered pagoda temple, Baggi forest trek, camping guidelines, and 3D map."
          },
          {
            id: "rewalsar-lake",
            heroImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Rewalsar-Himachal.jpg/1920px-Rewalsar-Himachal.jpg",
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Rewalsar-Himachal.jpg/1920px-Rewalsar-Himachal.jpg",
            name: "Rewalsar Lake (Tso Pema)",
            type: "spiritual",
            emoji: "🪷",
            coords: [31.64, 76.83],
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
            seoTitle: "Rewalsar Lake (Tso Pema) — Sacred Buddhist",
            seoDescription: "Complete pilgrimage guide to Rewalsar Lake (1,360m) in Mandi. Guru Padmasambhava bronze statue, holy caves, monasteries, and multicultural history."
          },
          {
            id: "barot-valley",
            heroImage: "https://images.unsplash.com/photo-1611523658822-385aa008324c?q=80&w=2148&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1611523658822-385aa008324c?q=80&w=2148&auto=format&fit=crop",
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
            seoTitle: "Barot Valley (1,830m) — Uhl River Trout Fishing",
            seoDescription: "Discover Barot Valley in Mandi. Pristine Uhl River trout fishing, British funicular trolley history, Nargu sanctuary trails, camping, and road access."
          },
          {
            id: "mandi-chhoti-kashi",
            heroImage: "https://cdn.pixabay.com/photo/2021/01/09/22/27/shimla-5903633_1280.jpg",
            image: "https://cdn.pixabay.com/photo/2021/01/09/22/27/shimla-5903633_1280.jpg",
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
            seoTitle: "Mandi 'Chhoti Kashi' Heritage Guide — Panchvaktra Temple",
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
            seoTitle: "Kamrunag Lake Trek (3,334m) — Sacred Lake of Gold",
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
            heroImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Route_south_from_Bhaba_Pass%2C_Himachal_Pradesh%2C_India.jpg/1280px-Route_south_from_Bhaba_Pass%2C_Himachal_Pradesh%2C_India.jpg",
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Route_south_from_Bhaba_Pass%2C_Himachal_Pradesh%2C_India.jpg/1280px-Route_south_from_Bhaba_Pass%2C_Himachal_Pradesh%2C_India.jpg",
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
            id: "jispa",
            name: "Jispa & Bhaga Riverside",
            type: "scenic",
            emoji: "🌊",
            coords: [32.65, 77.05],
            elevation: "3,200 m",
            bestSeason: "May to October",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Jispa is a serene village and riverside encampment on the banks of the turquoise Bhaga River in Lahaul Valley at 3,200 meters. Surrounded by towering scree mountains and willow groves, it is a favored acclimatization stop on the Manali-Leh Highway before ascending Baralacha La.",
            experience: "Listening to the rushing Bhaga River against smooth river rocks under an expanse of crystal clear Himalayan stars.",
            tips: [
              "Camp along the riverbanks for an unforgettable overnight wilderness stay.",
              "Essential night halt to acclimatize before tackling higher passes toward Leh."
            ],
            faqs: [
              {
                question: "What is Jispa famous for?",
                answer: "Jispa is famous for its riverside campgrounds on the Bhaga River, Tibetan monastery, and tranquil Lahauli village life."
              }
            ],
            seoTitle: "Jispa (3,200m) — Bhaga Riverside Camping",
            seoDescription: "Complete travel guide to Jispa (3,200m) in Lahaul Valley. Riverside camping on the Bhaga River, Manali-Leh highway stop, monasteries, and season advice.",
            keywords: [
              "Jispa Lahaul",
              "Jispa camping",
              "Jispa altitude",
              "Manali to Leh Jispa",
              "Bhaga river Jispa"
            ]
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
            seoTitle: "Kaza (3,650m) Spiti Valley — Travel Guide",
            seoDescription: "Essential guide to Kaza in Spiti Valley. Acclimatization tips, homestays, inner-line permits, fuel, best cafes, and day excursions to high villages."
          },
          {
            id: "dhankar-monastery-lake",
            heroImage: "https://images.unsplash.com/photo-1779778378442-ccf581a4a06f?q=80&w=1600&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1779778378442-ccf581a4a06f?q=80&w=1600&auto=format&fit=crop",
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
            seoTitle: "Langza, Hikkim & Komic Circuit — Fossils",
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
            seoTitle: "Chicham Bridge (4,150m) & Kibber Sanctuary Guide",
            seoDescription: "Visit Chicham Bridge (4,150m), Asia's highest suspension bridge over a 150m gorge. Snow leopard expeditions in Kibber Wildlife Sanctuary, route and photos."
          },
          {
            id: "pin-valley-national-park",
            heroImage: "https://images.unsplash.com/photo-1620398762817-ff3885718863?q=80&w=1600&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1620398762817-ff3885718863?q=80&w=1600&auto=format&fit=crop",
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
            seoTitle: "Pin Valley NP & Mudh (3,800m) — Spiti Wildlife Guide",
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
            seoTitle: "Kunzum Pass (4,551m) Guide — Lahaul to Spiti Gateway",
            seoDescription: "Crossing Kunzum Pass (4,551m / 14,931 ft). Road conditions from Gramphu and Kaza, Chandratal hike trailhead, Kunzum Mata shrine, and Bara Shigri glacier views."
          },
          {
            id: "suraj-tal-baralacha",
            heroImage: "https://images.unsplash.com/photo-1565348271242-2393f74ed8b4?q=80&w=1600&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1565348271242-2393f74ed8b4?q=80&w=1600&auto=format&fit=crop",
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
            seoTitle: "Suraj Tal Lake (4,883m) & Baralacha La Guide",
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
            seoTitle: "Keylong & Kardang Monastery (3,080m) — Lahaul Capital",
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
            coords: [31.36, 78.43],
            elevation: "3,450 m",
            bestSeason: "April to October",
            difficulty: "Easy",
            duration: "2 Days",
            overview: "Chitkul is celebrated as the last inhabited village near the Indo-Tibet border in the picturesque Baspa Valley of Kinnaur. Sited on the banks of the roaring Baspa River amidst snow peaks, it features ancient slate-roofed Kinnauri wood-and-stone houses, potato fields, and the 500-year-old Mathi Devi temple.",
            experience: "Standing by the icy glacial rush of the Baspa River looking towards the forbidden ridges of Tibet under a sky of pure sapphire.",
            tips: [
              "Visit the 500-year-old wooden Mathi Temple in the center of the village.",
              "Try hot tea at the famous 'Hindustan ka Aakhri Dhaba' on the village outskirts."
            ],
            faqs: [
              {
                question: "Is Chitkul the last village on the border?",
                answer: "Yes, Chitkul is the last civilian inhabited village along the old Hindustan-Tibet trade route before the ITBP border outpost."
              }
            ],
            seoTitle: "Chitkul (3,450m) — Last Village of India",
            seoDescription: "Complete travel guide to Chitkul (3,450m) in Kinnaur, Himachal Pradesh. The last Indian village, Baspa river banks, Mathi Devi temple, and route tips.",
            keywords: [
              "Chitkul Kinnaur",
              "Chitkul altitude",
              "last Indian village Chitkul",
              "Baspa valley",
              "Mathi temple Chitkul"
            ]
          },
          {
            id: "kalpa",
            name: "Kalpa & Roghi Cliff",
            type: "scenic",
            emoji: "🍎",
            coords: [31.54, 78.26],
            elevation: "2,960 m",
            bestSeason: "April to November",
            difficulty: "Easy",
            duration: "1–2 Days",
            overview: "Kalpa is a heritage Kinnauri village perched high above the Sutlej River valley amidst sprawling apple orchards. Renowned for its unparalleled panoramic views of the sacred Kinner Kailash massif (6,050m), the village features traditional timber-and-slate temples, the Buddhist Hu-Bu-Lan-Kar gompa, and the dramatic sheer drop of Roghi Suicide Point.",
            experience: "Waking at dawn to watch the 6,050-meter summit of Kinner Kailash ignite in breathtaking shades of crimson, gold, and pink.",
            tips: [
              "Visit the Roghi cliff edge (Suicide Point) 4 km past the village for sheer vertical canyon drops.",
              "Peak apple harvest season runs from late August through October."
            ],
            faqs: [
              {
                question: "What is the best time to see Kinner Kailash from Kalpa?",
                answer: "Clear October and November mornings offer the sharpest, unobstructed sunrise vistas of the entire Kinner Kailash range."
              }
            ],
            seoTitle: "Kalpa (2,960m) — Kinner Kailash Views",
            seoDescription: "Essential guide to Kalpa village (2,960m) in Kinnaur. Front-row sunrise views of Kinner Kailash, apple orchards, Roghi cliff, temples, and season advice.",
            keywords: [
              "Kalpa Kinnaur",
              "Kalpa altitude",
              "Kinner Kailash view Kalpa",
              "Roghi suicide point",
              "Kalpa apple season"
            ]
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
            seoTitle: "Sangla Valley & Kamru Fort (2,680m) Guide",
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
            seoTitle: "Nako Lake & 11th-Century Monastery (3,662m) Guide",
            seoDescription: "Complete guide to Nako Lake (3,662m) and the 11th-century Nako Gompa in Upper Kinnaur. Tibetan murals, Padmasambhava footprints, and Reo Purgyil views."
          },
          {
            id: "rupin-pass-kinnaur",
            heroImage: "https://images.unsplash.com/photo-1728801483302-f91e13420b04?q=80&w=1600&auto=format&fit=crop",
            image: "https://images.unsplash.com/photo-1728801483302-f91e13420b04?q=80&w=1600&auto=format&fit=crop",
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
            seoTitle: "Reckong Peo (2,290m) — Kinnaur Capital",
            seoDescription: "Visit Reckong Peo, headquarters of Kinnaur District. Inner Line Permit guidelines, apple orchards, bazaar guide, and Kinner Kailash viewpoints."
          }
        ]
      }
    ]
  };
