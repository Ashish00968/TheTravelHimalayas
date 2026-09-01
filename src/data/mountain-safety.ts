// src/data/mountain-safety.ts
// Comprehensive mountain medicine, safety protocols, altitude physiology, mountaineering courses, and glossary.

export interface GlossaryTerm {
  term: string;
  localTerm?: string;
  category: "basics" | "geology" | "glacier" | "nature" | "route" | "medical" | "weather" | "gear" | "mountaineering";
  definition: string;
  significance: string;
}

export interface MountaineeringCourse {
  code: string;
  name: string;
  duration: string;
  eligibility: string;
  curriculum: string[];
  overview: string;
  significance: string;
}

export const MOUNTAINEERING_OVERVIEW = {
  title: "What is Mountaineering (Alpinism)?",
  definition:
    "Mountaineering is the technical sport, discipline, and art of climbing high mountains and summits across challenging terrain including rock faces, ice walls, and glaciated alpine environments using specialized safety equipment.",
  coreDisciplines: [
    {
      title: "Rock Craft",
      description: "Climbing vertical and overhanging rock walls using belaying, anchor placement, and rappelling techniques.",
    },
    {
      title: "Snow Craft",
      description: "Self-arrest using an ice axe, step-cutting, glissading, and navigating steep snow couloirs and slopes.",
    },
    {
      title: "Ice Craft",
      description: "Front-pointing on vertical glacial ice with crampons, ice screw placement, and ice wall climbing.",
    },
    {
      title: "Glacier Travel & Rescue",
      description: "Rope team travel across active crevassed zones, snow bridge testing, and crevasse rescue pulley systems.",
    },
  ],
  institutes: [
    { name: "NIM (Nehru Institute of Mountaineering)", location: "Uttarkashi, Uttarakhand" },
    { name: "HMI (Himalayan Mountaineering Institute)", location: "Darjeeling, West Bengal" },
    { name: "ABVIMAS (Atal Bihari Vajpayee Institute of Mountaineering & Allied Sports)", location: "Manali, Himachal Pradesh" },
    { name: "JIM&WS (Jawahar Institute of Mountaineering & Winter Sports)", location: "Pahalgam & Aru, Jammu & Kashmir" },
    { name: "NIMAS (National Institute of Mountaineering & Allied Sports)", location: "Dirang, Arunachal Pradesh" },
  ],
};

export const MOUNTAINEERING_COURSES: MountaineeringCourse[] = [
  {
    code: "BMC",
    name: "Basic Mountaineering Course",
    duration: "28 Days",
    eligibility: "Age 16–45 years, medical fitness certificate, high cardiovascular stamina.",
    overview:
      "The foundational national qualification for anyone seeking to enter mountaineering or high-altitude guiding in India. Conducted in demanding high-altitude basecamps (above 12,000–16,000 ft).",
    curriculum: [
      "Rock climbing, bouldering, knot tying, and belay techniques",
      "Snow craft: Ice axe self-arrest, glissading, step-cutting",
      "Ice craft: 10-point and 12-point crampon techniques, vertical ice wall climbing",
      "Glacier travel, crevasse safety, and rope team protocol",
      "High-altitude bivouac camping, mountain manners, and map reading",
      "Mandatory Height Gain trek to ~15,000–17,000 ft",
    ],
    significance: "Graded 'A' (Alpha) is required to be eligible for the Advance Mountaineering Course (AMC).",
  },
  {
    code: "AMC",
    name: "Advance Mountaineering Course",
    duration: "28 Days",
    eligibility: "Must hold an 'A' Grade in Basic Mountaineering Course (BMC).",
    overview:
      "Advanced technical training designed to train mountaineers to plan, organize, and execute independent high-altitude expeditions and technical peak climbs.",
    curriculum: [
      "Advanced artificial aid climbing and multi-pitch rock routes",
      "Steep technical water-ice and blue-ice climbing",
      "Crevasse rescue pulley systems (Z-pulley, 3:1 hauling systems)",
      "Avalanche safety, beacon searches, and snow pit stability analysis",
      "Expedition planning, logistics, route charting, and high camp management",
      "Mandatory summit attempt on a technical peak (>17,500–19,000+ ft)",
    ],
    significance: "Essential prerequisite for expedition leadership and commercial mountain guide licenses.",
  },
  {
    code: "MOI",
    name: "Method of Instruction",
    duration: "21–28 Days",
    eligibility: "Must hold an 'A' Grade in Advance Mountaineering Course (AMC).",
    overview:
      "Pedagogical training for senior mountaineers to become certified instructors at national mountaineering institutes and chief instructors on high-altitude expeditions.",
    curriculum: [
      "Instructional techniques and demonstration methodologies",
      "Risk assessment and student safety supervision on live rock and ice faces",
      "Advanced group psychology, high-altitude trauma handling, and expedition leadership",
    ],
    significance: "Authorizes the holder to teach at national mountaineering institutes.",
  },
  {
    code: "S&R",
    name: "Search and Rescue Course",
    duration: "21 Days",
    eligibility: "Must hold an 'A' Grade in Advance Mountaineering Course (AMC).",
    overview:
      "Specialized mountain rescue training focusing on evacuating injured or stranded climbers from complex alpine environments.",
    curriculum: [
      "High-angle vertical cliff and rock face evacuation systems",
      "Deep crevasse extraction and Tyrolean traverse setups",
      "Avalanche victim location using probes, beacons, and RECCO radars",
      "Improvised mountain stretchers and helicopter evacuation LZ preparation",
    ],
    significance: "Crucial for disaster response, mountain rescue teams, and expedition safety chiefs.",
  },
];

export const ALTITUDE_LEVELS = [
  {
    name: "High Altitude",
    elevation: "1,500 m – 3,500 m (5,000 – 11,500 ft)",
    oxygenPct: "~84% to ~67% of sea level",
    effects: "Breathing rate increases on exertion. Heart rate rises. Mild fatigue. Initial physiological acclimatization triggers.",
    risk: "Low to Moderate. AMS can occasionally begin above 2,500m.",
  },
  {
    name: "Very High Altitude",
    elevation: "3,500 m – 5,500 m (11,500 – 18,000 ft)",
    oxygenPct: "~67% to ~50% of sea level",
    effects: "Significant hypoxia during exertion. Cheyne-Stokes periodic breathing at night. Marked drop in blood oxygen saturation (SpO2 75-85%).",
    risk: "High. Frequent site of AMS, HAPE, and HACE onset. Mandatory rest/acclimatization days required.",
  },
  {
    name: "Extreme Altitude",
    elevation: "5,500 m – 8,000 m (18,000 – 26,000 ft)",
    oxygenPct: "~50% to ~35% of sea level",
    effects: "Progressive physical deterioration over extended stays. Weight loss, muscle breakdown, cognitive slowing, severe hypoxia.",
    risk: "Very High. Prolonged stays without descent lead to physiological decline. Cannot permanently acclimatize.",
  },
  {
    name: "The Death Zone",
    elevation: "> 8,000 m (26,247+ ft)",
    oxygenPct: "< 33% of sea level",
    effects: "Body consumes oxygen reserves faster than breathing can replenish them. Cells die off rapidly. Time-limited window.",
    risk: "Extreme / Lethal. Supplemental oxygen and rapid descent are critical for survival.",
  },
];

export const FUNDAMENTALS_DATA = [
  {
    title: "Hike vs. Trek vs. Mountaineering Expedition",
    hike: {
      title: "Day Hike",
      duration: "A few hours to 1 full day",
      terrain: "Well-marked trails, maintained paths, moderate elevation",
      gear: "Light daypack (15-25L), water bottle, basic first aid, trail shoes",
      nightstay: "Return to hotel / basecamp each evening",
    },
    trek: {
      title: "Multi-Day Trek",
      duration: "2 to 14+ consecutive days",
      terrain: "Remote mountain passes, moraine, scree, alpine meadows, river crossings",
      gear: "Heavy expedition pack (45-65L), cold-weather layering, sleeping bag, headlamp, mountain boots",
      nightstay: "Tents, alpine shepherd huts, or high-altitude homestays",
    },
    expedition: {
      title: "Mountaineering Peak Climb",
      duration: "1 to 4 weeks",
      terrain: "Glaciers, ice walls, technical rock ridges, crevassed fields, summit pushes",
      gear: "Crampons, ice axe, climbing harness, dynamic ropes, high-altitude double boots, helmets",
      nightstay: "Staged high camps (Base Camp, Camp 1, Summit Camp)",
    },
  },
];

export const ALTITUDE_ILLNESSES = [
  {
    id: "ams",
    name: "AMS — Acute Mountain Sickness",
    severity: "Mild to Moderate",
    urgency: "Warning State (Do Not Ascend)",
    overview:
      "Acute Mountain Sickness is the body's natural physiological reaction to rapid ascent above 2,500m without adequate acclimatization. It occurs due to lower barometric pressure causing decreased oxygen molecules per breath.",
    symptoms: [
      "Throbbing frontal or temporal headache (primary indicator)",
      "Nausea, loss of appetite, or vomiting",
      "Fatigue, weakness, or unusual lethargy",
      "Dizziness or lightheadedness",
      "Insomnia or frequent wakefulness with shortness of breath",
    ],
    prevention: [
      "Ascend gradually: Above 3,000m, limit sleeping elevation gain to 300–500m per day.",
      "Incorporate an acclimatization rest day every 3–4 days or after gaining 1,000m.",
      "Golden Rule: Climb high during daytime hikes, but sleep low at camp.",
      "Hydrate with 4 to 5 liters of water/electrolytes daily.",
      "Avoid alcohol, sleeping pills, and tobacco, which depress respiration.",
      "Prophylaxis: Acetazolamide (Diamox) 125mg twice daily starting 24h prior to rapid ascent (consult doctor).",
    ],
    treatment: [
      "STAY AT CURRENT ALTITUDE — Never ascend with active AMS symptoms.",
      "Hydrate and rest in a warm, sheltered environment.",
      "Analgesics: Paracetamol (500-1000mg) or Ibuprofen (400mg) for headache.",
      "If symptoms do not improve within 24 hours or worsen, DESCEND 300–500m immediately.",
    ],
    goldenRules: [
      "Any illness at altitude is altitude sickness until proven otherwise.",
      "Never ascend with symptoms of altitude sickness.",
      "If symptoms get worse, descend immediately.",
    ],
  },
  {
    id: "hape",
    name: "HAPE — High Altitude Pulmonary Edema",
    severity: "Severe to Critical",
    urgency: "Immediate Emergency (Life-Threatening)",
    overview:
      "HAPE is a dangerous build-up of fluid in the air sacs (alveoli) of the lungs caused by high pressure in pulmonary arteries under extreme hypoxia. It is the number one cause of altitude-related fatalities.",
    symptoms: [
      "Disproportionate breathlessness on mild exertion, rapidly progressing to breathlessness AT REST",
      "Persistent dry hacking cough early on, developing into wet rattling cough",
      "Severe drop in physical performance and extreme fatigue",
      "Cyanosis (bluish tint on lips, tongue, and fingernail beds)",
      "Chest tightness, congestion, or bubbling sound in lungs",
      "Pink, frothy sputum/phlegm (advanced, critical stage)",
    ],
    prevention: [
      "Strict gradual ascent schedule — do not rush high passes.",
      "Recognize and address early AMS symptoms before they cascade into HAPE.",
      "Keep body warm; severe cold causes pulmonary vasoconstriction that accelerates HAPE.",
      "Avoid extreme physical overexertion during the first 48 hours at high camp.",
    ],
    treatment: [
      "IMMEDIATE DESCENT: Descend at least 500 to 1,000 meters immediately. Do not wait for helicopter or morning.",
      "Administer High-Flow Supplemental Oxygen (4–6 Litres/min).",
      "Keep the patient upright and completely warm (minimize physical exertion; carry the patient if possible).",
      "Hyperbaric Chamber (Gamow Bag): Inflate to 2 psi if descent is delayed by terrain/weather.",
      "Medical (Trained Guide / Doctor): Nifedipine (30mg sustained release every 12h) to reduce pulmonary artery pressure.",
    ],
    goldenRules: [
      "Descent is the definitive cure. Oxygen buys time; descent saves life.",
      "Never leave a HAPE patient alone or unattended during descent.",
    ],
  },
  {
    id: "hace",
    name: "HACE — High Altitude Cerebral Edema",
    severity: "Critical",
    urgency: "Immediate Emergency (Fatal within Hours if untreated)",
    overview:
      "HACE is severe brain swelling caused by fluid leaking across the blood-brain barrier under severe oxygen deprivation. It typically develops from unmanaged AMS and leads to coma or death if not reversed immediately.",
    symptoms: [
      "Ataxia (loss of coordination and balance — inability to walk in a straight heel-to-toe line)",
      "Confusion, disorientation, memory loss, and slurred speech",
      "Severe, intractable headache unresponsive to painkillers",
      "Irrational behavior, apathy, mood swings, or hallucination",
      "Extreme drowsiness progressing to stupor, loss of consciousness, and coma",
    ],
    prevention: [
      "Never ignore worsening AMS headache or nausea.",
      "Daily health monitoring of all teammates using the Tandem Gait Test (heel-to-toe walk).",
      "Strict conservative ascent profile above 3,500m.",
    ],
    treatment: [
      "IMMEDIATE EMERGENCY EVACUATION & DESCENT: Descend 1,000+ meters without delay.",
      "Dexamethasone: 8mg initial dose orally/IM, followed by 4mg every 6 hours during descent.",
      "High-Flow Oxygen (4–8 Litres/min).",
      "Portable Hyperbaric Chamber (Gamow Bag) immediately if descent is blocked.",
      "Protect airway and prevent hypothermia.",
    ],
    goldenRules: [
      "Loss of balance (Ataxia) at high altitude is HACE until proven otherwise.",
      "A person with HACE cannot make rational decisions — expedition leader must command immediate descent.",
    ],
  },
];

export const SAFETY_PROTOCOLS = [
  {
    id: "hypothermia",
    title: "Hypothermia Prevention & Management",
    overview:
      "Core body temperature dropping below 35°C (95°F). In the Himalayas, wind chill and wet clothing accelerate hypothermia even at mild ambient temperatures.",
    stages: [
      {
        stage: "Mild (35°C–32°C)",
        signs: "Vigorous shivering, numbness, clumsy fingers, rapid breathing, slurred speech.",
        action: "Change out of wet clothes into dry base layers, windproof shell, warm sweet drinks, gentle movement.",
      },
      {
        stage: "Moderate (32°C–28°C)",
        signs: "Violent shivering or sudden stopping of shivering, confusion, apathy, stumbling, irrational behavior.",
        action: "Encase in sleeping bag with insulated pad, warm water bottles near groin and armpits, warm shelter.",
      },
      {
        stage: "Severe (<28°C)",
        signs: "Unconsciousness, rigid muscles, slow weak pulse, dilated pupils. Apparent death.",
        action: "Gentle handling (rough movement can trigger cardiac arrest), passive rewarming, emergency evacuation.",
      },
    ],
  },
  {
    id: "frostbite",
    title: "Frostbite & Cold Tissue Injury",
    overview:
      "Freezing of skin and subcutaneous tissues. Most common in toes, fingers, nose, and ears due to vasoconstriction preserving core warmth.",
    rules: [
      "Keep extremities dry: Sweat inside socks freezes quickly in sub-zero temps. Change to dry socks at camp.",
      "Never wear overly tight boots that restrict capillary circulation.",
      "Golden Rule: NEVER thaw frostbitten extremities if there is any chance of them refreezing during the trek. Refreezing causes catastrophic tissue destruction.",
      "Thaw only in warm water (37°C–39°C) with clean antiseptic dressings, never rub with snow or direct fire.",
    ],
  },
  {
    id: "water",
    title: "Water Disinfection in the Wild",
    overview:
      "Himalayan glacial streams often carry livestock pathogens, Giardia cysts, and bacterial contaminants from high pastures.",
    methods: [
      {
        method: "Rolling Boil",
        details: "Bring water to a rolling boil for at least 1 full minute (3 minutes above 2,500m). Kills 100% of pathogens.",
      },
      {
        method: "Chlorine Dioxide Tablets",
        details: "Effective against all bacteria, viruses, and cryptosporidium cysts. Requires 30 min to 4 hours contact time.",
      },
      {
        method: "0.1 Micron Hollow-Fiber Filter",
        details: "Quickly removes bacteria and protozoa. Note: Keep filter inside your sleeping bag at night to prevent freeze damage.",
      },
    ],
  },
  {
    id: "acclimatization-rules",
    title: "The 5 Golden Rules of Acclimatization",
    rules: [
      "Rule 1: Ascend gradually above 3,000m (sleeping altitude increase max 300–500m per day).",
      "Rule 2: Climb High, Sleep Low — Hike up to a ridge during afternoon acclimatization, then sleep at the lower camp.",
      "Rule 3: Maintain 4–5L daily hydration to compensate for accelerated respiration in dry thin air.",
      "Rule 4: Eat high-carbohydrate meals; your body burns carbs 15% more oxygen-efficiently than fats/proteins at altitude.",
      "Rule 5: Carry a pulse oximeter — monitor resting heart rate and SpO2 trends every morning and evening.",
    ],
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // 1. Core Mountain Fundamentals
  {
    term: "The Himalayas",
    localTerm: "Him + Alaya ('Abode of Snow' in Sanskrit)",
    category: "basics",
    definition: "The world's highest and youngest major mountain range, stretching over 2,400 km across India, Nepal, Bhutan, China, and Pakistan, formed by the collision of the Indian and Eurasian tectonic plates.",
    significance: "Home to all 14 of the world's 8,000m peaks and thousands of glacier-fed river origins.",
  },
  {
    term: "Mountain",
    localTerm: "Parvat / Giri",
    category: "basics",
    definition: "A prominent natural elevation of the earth's surface rising abruptly from the surrounding level, typically with steep slopes and a minimum local relief of 300 to 600 meters.",
    significance: "The massive geographic landform comprising valleys, ridges, faces, glaciers, and summits.",
  },
  {
    term: "Peak",
    localTerm: "Choti / Shikhar",
    category: "basics",
    definition: "A distinct, pointed high feature or summit of a mountain with a notable topographic prominence from its surrounding ridges.",
    significance: "Target of mountaineering objectives and visual landmarks (e.g., Friendship Peak, Hanuman Tibba, Trishul).",
  },
  {
    term: "Summit",
    category: "basics",
    definition: "The absolute highest topographic point in elevation of a mountain or peak.",
    significance: "The ultimate turnaround point of an expedition; 'Summit Push' is the final stage of an ascent.",
  },
  {
    term: "Trek",
    category: "basics",
    definition: "A multi-day, self-sustained expedition on foot through remote mountainous terrain with no motorable roads, requiring tent camping, homestays, or alpine huts.",
    significance: "The core discipline of Himalayan exploration (e.g., Hampta Pass Trek, Pin Parvati Pass Trek).",
  },
  {
    term: "Hike",
    category: "basics",
    definition: "A single-day recreational walk on established, marked trails where hikers return to their basecamp or lodging before nightfall.",
    significance: "Ideal for warm-ups, acclimatization days, and beginners (e.g., Jogini Waterfall, Lama Dugh Day Hike).",
  },
  {
    term: "Mountaineering",
    localTerm: "Parvatarohan / Alpinism",
    category: "mountaineering",
    definition: "The technical sport and discipline of ascending high mountains and rock/ice walls requiring specialized climbing equipment, rope craft, crampons, and expedition logistics.",
    significance: "Beyond trekking; demands formal training (BMC/AMC) to safely climb peaks with glaciated and technical hazards.",
  },
  {
    term: "BMC (Basic Mountaineering Course)",
    category: "mountaineering",
    definition: "The premier 28-day certified training course in India teaching rock, snow, and ice craft, glacier travel, crevasse rescue, and high altitude survival (>15,000 ft).",
    significance: "The mandatory foundation for aspiring mountaineers, certified by institutes like NIM, HMI, and ABVIMAS.",
  },
  {
    term: "AMC (Advance Mountaineering Course)",
    category: "mountaineering",
    definition: "Advanced 28-day course for BMC 'A' grade holders covering multi-pitch rock, vertical ice climbing, expedition planning, avalanche rescue, and technical peak summit pushes.",
    significance: "Prepares climbers for independent expeditions and commercial high-altitude guide leadership.",
  },
  {
    term: "Alpine / Alpine Zone",
    category: "basics",
    definition: "The high-altitude ecological zone lying above the treeline and below permanent snow, characterized by severe cold, high UV, thin air, and low-growing vegetation.",
    significance: "Demands technical layering, windproof gear, and specialized alpine acclimatization.",
  },
  {
    term: "Ridge",
    category: "geology",
    definition: "A long, continuous narrow elevation of land forming a crest connecting peaks, saddles, and mountain passes.",
    significance: "Often provides natural navigation routes above valleys but exposes trekkers to high winds and lightning.",
  },
  {
    term: "Glacier",
    localTerm: "Bamak / Himani",
    category: "glacier",
    definition: "A massive, perennial body of dense crystalline ice, formed from centuries of compressed snow, that slowly flows downhill under the pull of gravity.",
    significance: "Source of major Himalayan rivers; presents crevasses, moraines, and icefalls (e.g., Beas Glacier, Bara Shigri).",
  },
  {
    term: "Crevasse",
    category: "glacier",
    definition: "A deep, vertical crack or chasm in a glacier created by stress and movement as ice flows over steep, uneven bedrock.",
    significance: "One of the most dangerous hazards in mountaineering; frequently hidden under fragile snow bridges.",
  },
  {
    term: "Snow",
    localTerm: "Barf / Him",
    category: "weather",
    definition: "Atmospheric precipitation consisting of delicate hexagonal ice crystals. On the ground, it morphs into powder, hard-pack, firn (granular multi-year snow), and wind-packed crust.",
    significance: "Changes trail difficulty drastically; requires gaiters, microspikes, or crampons to navigate safely.",
  },
  {
    term: "Treeline",
    category: "nature",
    definition: "The strict altitude boundary (typically 3,300m to 3,800m in the Indian Himalayas) above which environmental conditions (extreme cold, wind, thin air) prevent tree growth.",
    significance: "Marks the clear transition from sheltered pine/birch forests to exposed alpine meadows (Bugyals).",
  },
  {
    term: "Meadows (Bugyals / Thach)",
    localTerm: "Bugyal (Garhwal) / Thach (Himachal) / Marg (Kashmir)",
    category: "nature",
    definition: "High-altitude alpine pasture grasslands carpeted in wildflowers during spring and summer, situated between the treeline and the permanent snowline.",
    significance: "The most scenic and comfortable camping locations on Himalayan treks (e.g., Ali Bedni Bugyal, Dayara, Gulmarg).",
  },
  {
    term: "Dense Forests",
    localTerm: "Jungle / Vana",
    category: "nature",
    definition: "Lush, sub-alpine woodlands covering Himalayan valleys up to ~3,300m, primarily composed of Himalayan Deodar (Cedar), Blue Pine (Kail), Fir, Spruce, Oak, and Rhododendron.",
    significance: "Provides natural wind shielding, oxygen-rich air, birdlife, and natural trail cover during the early days of a trek.",
  },
  {
    term: "AMS (Acute Mountain Sickness)",
    category: "medical",
    definition: "A physiological condition caused by rapid ascent to high altitude (>2,500m) due to reduced atmospheric pressure and lower oxygen intake.",
    significance: "Symptoms include throbbing headache, nausea, and fatigue. The golden rule is: never ascend with AMS.",
  },
  {
    term: "HAPE (High Altitude Pulmonary Edema)",
    category: "medical",
    definition: "A life-threatening medical emergency where fluid leaks into the lungs' air sacs due to hypoxic pulmonary hypertension.",
    significance: "Causes breathlessness at rest and a rattling cough with pink froth. Requires immediate physical descent.",
  },
  {
    term: "HACE (High Altitude Cerebral Edema)",
    category: "medical",
    definition: "A critical condition where oxygen starvation causes fluid to leak into brain tissue, producing cerebral swelling and neurological collapse.",
    significance: "Recognized by loss of balance (Ataxia), confusion, and slurred speech. Lethal within hours without immediate descent.",
  },

  // 2. Geographic & Glacial Features
  {
    term: "Pass (La)",
    localTerm: "La (Tibetan / Ladakhi) / Pass (English)",
    category: "route",
    definition: "The lowest navigable gap, saddle, or notch across a mountain ridge connecting two distinct valleys.",
    significance: "Historical trading routes and the climax of pass-crossing treks (e.g., Rohtang La, Baralacha La, Hampta Pass).",
  },
  {
    term: "Moraine",
    category: "glacier",
    definition: "Accumulations of boulders, rock fragments, and soil transported and deposited along the margins (lateral), center (medial), or terminus (terminal) of a melting glacier.",
    significance: "Walking on moraine is loose, unstable, and energy-draining; requires trekking poles.",
  },
  {
    term: "Col / Saddle",
    category: "route",
    definition: "The lowest dipping point on a sharp ridge between two mountain peaks.",
    significance: "Provides an ascent route, vantage point, or transition corridor between mountain summits.",
  },
  {
    term: "Arête",
    category: "geology",
    definition: "A sharp, narrow, knife-edge rock or snow crest formed when two adjacent glaciers carve parallel cirques into opposite sides of a mountain.",
    significance: "Requires balance, rope protection, and exposure management during ridge ascents.",
  },
  {
    term: "Scree & Talus",
    category: "geology",
    definition: "Loose, broken rock debris and gravel piled up at the base of a cliff or steep mountain wall.",
    significance: "Ascending scree requires 2-steps-forward 1-step-back patience; descending requires soft knees and heel braking.",
  },
  {
    term: "Cirque",
    category: "geology",
    definition: "A steep-walled, bowl-shaped amphitheater basin carved into the head of a mountain valley by glacial erosion.",
    significance: "Frequently cradles pristine turquoise glacial tarns and sacred lakes (e.g., Beas Kund, Bhrigu Lake).",
  },
  {
    term: "Cairn",
    category: "route",
    definition: "A deliberately constructed mound or pyramid of stones erected to mark a trail where footpaths are invisible in fog or rock fields.",
    significance: "Lifesaving navigation markers when trails disappear in snow or boulder moraine.",
  },
  {
    term: "Bergschrund",
    category: "glacier",
    definition: "A gaping, deep crevasse where moving glacier ice pulls away from stagnant ice or rock walls at the head of a glacier.",
    significance: "A major technical obstacle in high-altitude mountaineering requiring ladders or fixed ropes.",
  },
  {
    term: "Whiteout",
    category: "weather",
    definition: "An optical weather phenomenon where heavy cloud cover, fog, and snow blend together, completely eliminating all horizon, shadows, and depth perception.",
    significance: "Trekkers can become completely disoriented within seconds. Requires GPS, compass, or staying anchored in place.",
  },
  {
    term: "Verglas",
    category: "weather",
    definition: "A paper-thin, transparent glaze of smooth ice formed when rain or melting snow freezes over exposed rock.",
    significance: "Deceptively invisible and treacherous to walk on without traction spikes.",
  },
  {
    term: "Bivouac (Bivy)",
    category: "gear",
    definition: "A minimalist, improvised open-air camp using just a waterproof bivy sack or sleeping bag without pitching a tent.",
    significance: "Essential for emergency delays or lightweight alpine ascents.",
  },
  {
    term: "Diamox (Acetazolamide)",
    category: "gear",
    definition: "A prescription medication that increases bicarbonate excretion in the kidneys, acidifying the blood to stimulate deeper, faster breathing.",
    significance: "Accelerates acclimatization and helps prevent AMS; causes harmless tingling in fingers and toes.",
  },
  {
    term: "Gamow Bag",
    category: "gear",
    definition: "A portable, inflatable nylon hyperbaric chamber that can be pressurized with a foot pump to simulate a rapid descent of 1,500m.",
    significance: "Life-saving emergency kit on high-altitude expeditions when weather or night blocks immediate physical descent.",
  },
];
