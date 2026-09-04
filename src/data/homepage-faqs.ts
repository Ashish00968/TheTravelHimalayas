export interface HomepageFaq {
  id: string;
  category: "planning" | "safety" | "permits" | "gear";
  categoryLabel: string;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  links?: { label: string; href: string }[];
}

export const HOMEPAGE_FAQS: HomepageFaq[] = [
  {
    id: "best-season-territories",
    category: "planning",
    categoryLabel: "Seasons & Planning",
    question: "When is the best season to trek in Himachal, Uttarakhand, Ladakh, and Kashmir?",
    shortAnswer: "The Himalayas offer year-round trekking across distinct climate windows: Ladakh and Spiti thrive in monsoon (July–September) under a rain shadow, while Uttarakhand and Himachal shine in pre-monsoon (May–June) and autumn (September–November). Kashmir Great Lakes peaks from July to September.",
    detailedAnswer:
      "Because the Himalayan arc spans 2,400km across varying rain shadows, optimal windows depend on topography. Ladakh and Spiti Valley lie beyond the Greater Himalayan barrier, making July to September ideal with clear arid skies while peninsular India experiences monsoon. Uttarakhand (Garhwal/Kumaon) and Himachal Pradesh offer stable alpine conditions, blooming rhododendrons, and manageable snowpack during pre-monsoon (May–June) and crystal-clear visibility post-monsoon (mid-September to November). Kashmir's high-altitude alpine lakes (like KGL and Tarsar Marsar) thaw completely between July and early September.",
    links: [
      { label: "Explore Seasonal Weather Matrix", href: "/plan/season" },
      { label: "Browse All Regional Guides", href: "/explore" },
    ],
  },
  {
    id: "beginner-friendly-treks",
    category: "planning",
    categoryLabel: "Seasons & Planning",
    question: "What are the best Himalayan treks for beginners and first-time high-altitude explorers?",
    shortAnswer: "Beas Kund (3,700m), Dayara Bugyal (3,750m), and Lamadugh (3,300m) are premier beginner trails offering safe ascent gradients, accessible roadheads, and dramatic alpine scenery.",
    detailedAnswer:
      "For those stepping above 3,000m for the first time, choose trails with gradual elevation gain, well-defined paths, and fast evacuation access. In Himachal Pradesh, Beas Kund (Manali) takes you to the glacial cradle of the Beas River beneath 6,000m Hanuman Tibba with gentle 4-day stages. In Uttarakhand, Dayara Bugyal offers expansive alpine meadows with panoramic views of Bandarpoonch and Black Peak. Hampta Pass (4,270m) serves as an accessible first pass crossing for beginners with good physical conditioning.",
    links: [
      { label: "Beas Kund Trail Dossier", href: "/explore/himachal-pradesh/kullu/beas-kund" },
      { label: "Deterministic Trek Finder", href: "/plan/trek-finder" },
    ],
  },
  {
    id: "ams-high-altitude-safety",
    category: "safety",
    categoryLabel: "Safety & Altitude",
    question: "How do I prevent Acute Mountain Sickness (AMS), HAPE, and HACE on Himalayan treks?",
    shortAnswer: "Cap daily sleeping elevation gains at 500m above 3,000m, drink 4–5 liters of water daily, maintain a steady aerobic pace, and immediately descend at least 500m–1,000m if severe ataxia or dyspnea occurs.",
    detailedAnswer:
      "High altitude illness is completely preventable through disciplined acclimatisation. Follow the golden rule: 'Climb high, sleep low'. Never ascend to sleep more than 500m higher than your previous night above 3,000m. Schedule a mandatory rest/acclimatisation day every 1,000m of net ascent. Hydrate with 4 to 5 liters of electrolyte-balanced water daily. Monitor resting SpO2 levels and Lake Louise Acute Mountain Sickness scores twice daily. If signs of High Altitude Pulmonary Edema (HAPE) or High Altitude Cerebral Edema (HACE)—such as persistent cough, pink sputum, or loss of balance (ataxia)—appear, descent is non-negotiable.",
    links: [
      { label: "Mountain Safety & AMS Protocols", href: "/safety" },
      { label: "Acclimatisation Guidelines", href: "/prepare" },
    ],
  },
  {
    id: "permits-and-regulations",
    category: "permits",
    categoryLabel: "Permits & Logistics",
    question: "What permits are required for trekking in Jammu & Kashmir, Ladakh, Himachal, and Uttarakhand?",
    shortAnswer: "Border and high-altitude zones require Inner Line Permits (ILP) or Protected Area Permits (PAP) from local district magistrates, alongside State Forest Department permits and eco-development fees.",
    detailedAnswer:
      "Permit regulations vary by state: In Ladakh (Pangong, Tso Moriri, Changthang, and Nubra), Indian nationals require an online Inner Line Permit (ILP) while foreign nationals require a Protected Area Permit (PAP) via a registered agency. In Uttarakhand, treks entering national parks (such as Nanda Devi Biosphere, Gangotri, and Valley of Flowers) require online permits via the Uttarakhand Forest Department portal and Single Window System. In Himachal, passes like Pin Parvati and Borasu require local sub-divisional magistrate (SDM) and forest department clearances. In Jammu & Kashmir, frontier border zones (e.g., Gurez, certain KGL checkposts) require military Army/CRPF verification stamps.",
    links: [
      { label: "Trek Logistics & Regulations", href: "/guides" },
      { label: "Regional Atlas Directory", href: "/explore" },
    ],
  },
  {
    id: "layering-and-gear",
    category: "gear",
    categoryLabel: "Gear & Fitness",
    question: "What is the recommended 3-layer clothing system for sub-zero Himalayan pass crossings?",
    shortAnswer: "A high-performance alpine system combines a moisture-wicking merino/synthetic base layer, an insulating mid-layer (microfleece + 700+ fill down jacket), and a wind/waterproof hardshell jacket (20,000mm hydrostatic head).",
    detailedAnswer:
      "Temperatures on high Himalayan passes (above 4,000m) can drop from +15°C during afternoon sunshine to -12°C overnight. Do not rely on one heavy jacket; use modular layers: 1) Base Layer: Merino wool or thermal synthetic top and bottom to wick sweat away from the skin. 2) Mid Insulation: High-loft fleece or 700–800 fill power hydrophobic down jacket for trapped thermal warmth. 3) Outer Shell: Breathable, waterproof Gore-Tex or DWR 2.5/3-layer shell to repel gale-force pass winds and blizzards. Pair with stiff-soled vibram trekking boots, thermal gloves, UV-400 category 3/4 glacier glasses, and lightweight C1 microspikes.",
    links: [
      { label: "Generate Dynamic Packing Checklist", href: "/plan/packing" },
      { label: "Expedition Gear Protocols", href: "/prepare" },
    ],
  },
  {
    id: "diy-vs-guided",
    category: "planning",
    categoryLabel: "Seasons & Planning",
    question: "Can I trek independently (DIY) or do I need a certified mountain guide?",
    shortAnswer: "Popular marked trails (like Triund or Prashar Lake) can be completed DIY with proper navigation, but high-altitude glaciated passes, remote cross-valley traverses, and multi-day circuits strongly require IMF-certified guides and local support teams.",
    detailedAnswer:
      "Independent (DIY) trekking is feasible for self-reliant mountaineers on well-traveled trails with teahouse networks or established campsites. However, technical pass crossings (Pin Parvati, Rupin Pass, Auden's Col, Kang La) feature shifting moraine, crevassed glacier snouts, and unpredictable weather where certified mountain guides (Basic & Advance Mountaineering Course certified from NIM/HMI/ABVIMAS) are essential for route-finding, crevasse rescue, and emergency evacuation. Furthermore, several forest reserves legally mandate licensed local guides.",
    links: [
      { label: "Accredited Mountaineering Directory", href: "/safety" },
      { label: "Compare Trail Difficulties", href: "/plan/compare" },
    ],
  },
  {
    id: "fitness-benchmarks",
    category: "gear",
    categoryLabel: "Gear & Fitness",
    question: "What physical fitness benchmark is required before embarking on a 4,000m+ Himalayan trek?",
    shortAnswer: "You should comfortably run 5 km in under 30–35 minutes, sustain 45 minutes of stair climbing with a 7–10 kg weighted pack, and maintain regular core and leg strength training.",
    detailedAnswer:
      "Trekking in the Indian Himalayas demands sustained cardiovascular endurance and eccentric leg strength. At 4,000m, the effective oxygen level is approximately 60% of sea level, increasing exertion by over 40%. A structured 6 to 8-week pre-expedition regimen includes: 1) Aerobic Training: Jogging 5 km in 30 minutes 3–4 times per week to boost VO2 max. 2) Functional Stair Climbing: 30–45 minutes of stair climbing with a weighted daypack to condition quadriceps and calves for steep descents. 3) Core & Flexibility: Planks, squats, and lunges to protect knee joints under load.",
    links: [
      { label: "Physical Conditioning Syllabus", href: "/prepare" },
      { label: "Trek Comparison & Demands", href: "/plan/compare" },
    ],
  },
  {
    id: "offline-gps-connectivity",
    category: "permits",
    categoryLabel: "Permits & Logistics",
    question: "Are mobile networks and GPS offline maps reliable in the North Indian Himalayas?",
    shortAnswer: "Cellular networks (primarily postpaid BSNL, Jio, and Airtel) cease beyond base trailheads. You must download offline topographical maps (GPX/GeoJSON) and carry satellite SOS or emergency radio where permitted.",
    detailedAnswer:
      "In Jammu & Kashmir and Ladakh, only Indian postpaid SIM cards operate due to regional telecom security regulations; prepaid SIMs from outside the territory automatically deactivate upon entry. Cellular connectivity is virtually nonexistent once you leave roadheads like Manali, Sonamarg, Sankri, or Leh. Always carry downloaded offline vector maps (Maps.me, Organic Maps, or Gaia GPS) with calibrated GPX trails, a high-gain external power bank kept warm inside your sleeping bag, and an analogue magnetic compass for secondary redundancy.",
    links: [
      { label: "Interactive 3D Geospatial Atlas", href: "/map" },
      { label: "Emergency Frequencies & Safety", href: "/safety" },
    ],
  },
  {
    id: "environmental-ethics-lnt",
    category: "safety",
    categoryLabel: "Safety & Altitude",
    question: "What are the environmental regulations and Leave No Trace (LNT) guidelines in high alpine biomes?",
    shortAnswer: "Pack out all non-biodegradable waste, avoid disposable plastic bottles, camp at least 60m away from alpine tarns and glacial streams, and use established dry pit toilets to protect delicate headwaters.",
    detailedAnswer:
      "High Himalayan biomes above 3,500m possess extremely slow natural decomposition rates. Discarded food scraps, wet wipes, and plastic remain preserved in the dry, freezing air for decades. Adhere strictly to the 7 Leave No Trace principles: Carry your own reusable water filtration system (e.g., Katadyn or Sawyer) instead of buying single-use bottled water; pack out every scrap of candy wrappers and foil blister packs; never defecate within 60 meters of lakes, rivers, or springs; avoid lighting open wood campfires in fragile sub-alpine birch and juniper forests; and never disturb high-altitude pasture ecosystems.",
    links: [
      { label: "Himalayan Atlas Protocols", href: "/explore" },
      { label: "Responsible Travel Disclaimer", href: "/disclaimer" },
    ],
  },
  {
    id: "budget-and-expenses",
    category: "planning",
    categoryLabel: "Seasons & Planning",
    question: "What is the typical budget and cost breakdown for trekking in the Indian Himalayas?",
    shortAnswer: "Self-supported/local operator treks range from ₹1,500 to ₹3,500 per day ($20–$45 USD), while full-service alpine expeditions range from ₹4,000 to ₹8,500+ per day depending on porters, mules, and gear logistics.",
    detailedAnswer:
      "A realistic trek budget includes 5 key components: 1) Shared/Private Logistics: Mountain cab or shared 4x4 Bolero from transit hubs (Chandigarh, Dehradun, Leh, Srinagar) to trailheads (₹2,500–₹7,000 round trip). 2) Porter, Mule & Guide Wages: Governed by local trekking associations (guides ₹1,500–₹2,500/day; mules ₹800–₹1,200/day). 3) Forest Permits & Camping Fees: ₹150–₹500 per person per day depending on state jurisdiction. 4) High-Calorie Rations & Fuel: High-altitude gas canisters and nutrient-dense camp meals. 5) Buffer Contingency: Always budget for 1–2 contingency weather days.",
    links: [
      { label: "Expedition Budget Estimator", href: "/plan/budget" },
      { label: "Head-to-Head Trek Comparison", href: "/plan/compare" },
    ],
  },
];
