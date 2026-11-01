"use client";

import { useState, useMemo } from "react";
import {
  Compass,
  Search,
  X,
  ChevronRight,
  Footprints,
  Mountain,
  Layers,
  PanelLeftClose,
  ArrowUpDown,
} from "lucide-react";
import { HimalayaPlace, placeLocationIndex } from "@/data/atlas";
import { Peak } from "@/data/types";
import { useHimalayanTheme } from "@/lib/use-theme";

export interface VerifiedRouteMeta {
  id: string;
  name: string;
  region: string;
  valley: string;
  type: "trek" | "peak";
  maxAltitude: string;
  distance: string;
  difficulty: string;
  gain: string;
  overview: string;
}

export const VERIFIED_ROUTES_CATALOG: VerifiedRouteMeta[] = [
  {
    id: "hampta-pass",
    name: "Hampta Pass Trek",
    region: "Himachal Pradesh",
    valley: "Kullu to Lahaul",
    type: "trek",
    maxAltitude: "4,287m",
    distance: "21.5 km",
    difficulty: "Moderate-Difficult",
    gain: "+1,450m",
    overview: "Dramatic crossover from lush green Kullu pine meadows into the stark, barren trans-Himalayan desert of Spiti.",
  },
  {
    id: "beas-kund",
    name: "Beas Kund Glacial Tarn",
    region: "Himachal Pradesh",
    valley: "Solang / Dhundi",
    type: "trek",
    maxAltitude: "3,700m",
    distance: "10.7 km",
    difficulty: "Moderate",
    gain: "+860m",
    overview: "Sacred emerald glacial tarn cradled beneath the towering massifs of Hanuman Tibba, Friendship Peak, and Ladakhi.",
  },
  {
    id: "patalsu-peak",
    name: "Patalsu Peak Ascent",
    region: "Himachal Pradesh",
    valley: "Solang Valley",
    type: "peak",
    maxAltitude: "4,261m",
    distance: "14.0 km",
    difficulty: "Demanding",
    gain: "+1,835m",
    overview: "Non-technical alpine summit ridge offering commanding 360° panoramas of the Pir Panjal and Great Himalayan ranges.",
  },
  {
    id: "bhrigu-lake",
    name: "Bhrigu Lake Alpine Tarn",
    region: "Himachal Pradesh",
    valley: "Gulaba / Manali",
    type: "trek",
    maxAltitude: "4,300m",
    distance: "13.8 km",
    difficulty: "Moderate-Difficult",
    gain: "+1,300m",
    overview: "High-altitude sacred lake that never completely freezes, set amidst rolling alpine ridge grasslands.",
  },
  {
    id: "deo-tibba",
    name: "Mt. Deo Tibba Expedition",
    region: "Himachal Pradesh",
    valley: "Jagatsukh / Duhangan",
    type: "peak",
    maxAltitude: "6,001m",
    distance: "29.3 km",
    difficulty: "Extreme Alpine",
    gain: "+4,104m",
    overview: "Glaciated dome peak requiring technical ice climbing, fixed rope ascents, and high-altitude moraine navigation.",
  },
  {
    id: "chandrakhani-pass",
    name: "Chandrakhani Pass Trek",
    region: "Himachal Pradesh",
    valley: "Naggar / Malana",
    type: "trek",
    maxAltitude: "3,660m",
    distance: "14.3 km",
    difficulty: "Moderate",
    gain: "+1,200m",
    overview: "Ancient high shepherd crossover pass connecting Naggar in the Kullu Valley with the isolated sanctuary of Malana.",
  },
  {
    id: "lamadugh",
    name: "Lamadugh Meadow Circuit",
    region: "Himachal Pradesh",
    valley: "Old Manali",
    type: "trek",
    maxAltitude: "3,017m",
    distance: "10.6 km",
    difficulty: "Moderate",
    gain: "+960m",
    overview: "Steep ascent through ancient deodar and horse chestnut forests onto high alpine grazing meadows above Manali.",
  },
  {
    id: "jalori-pass-serolsar",
    name: "Jalori Pass & Serolsar Lake",
    region: "Himachal Pradesh",
    valley: "Tirthan / Seraj",
    type: "trek",
    maxAltitude: "3,219m",
    distance: "9.8 km",
    difficulty: "Easy-Moderate",
    gain: "+390m",
    overview: "Oak and rhododendron forest trail leading to the sacred tarn of Buddhi Nagin nestled on the ridge.",
  },
  {
    id: "kheerganga",
    name: "Kheerganga Pilgrim Trail",
    region: "Himachal Pradesh",
    valley: "Parvati Valley",
    type: "trek",
    maxAltitude: "2,830m",
    distance: "15.2 km",
    difficulty: "Moderate",
    gain: "+1,067m",
    overview: "Scenic gorge trail through waterfalls, pine forests, and apple orchards to natural geothermal sulfur hot springs.",
  },
  {
    id: "jogni-falls",
    name: "Jogni Falls Cascade Trail",
    region: "Himachal Pradesh",
    valley: "Vashisht / Manali",
    type: "trek",
    maxAltitude: "2,280m",
    distance: "4.5 km",
    difficulty: "Easy",
    gain: "+280m",
    overview: "Refreshing pine trail from Vashisht temple village to the sacred multi-tiered cascade above the Beas River.",
  },
  {
    id: "triund",
    name: "Triund Panoramic Ridge Trek",
    region: "Himachal Pradesh",
    valley: "Kangra / Dharamshala",
    type: "trek",
    maxAltitude: "2,812m",
    distance: "9.4 km",
    difficulty: "Moderate",
    gain: "+887m",
    overview: "Classic Dhauladhar ridge trail climbing from Dharamkot through mixed oak forests to the breathtaking plateau directly under Moon Peak.",
  },
  {
    id: "kareri-lake",
    name: "Kareri Glacial Lake Trail",
    region: "Himachal Pradesh",
    valley: "Kangra / Dharamshala",
    type: "trek",
    maxAltitude: "2,944m",
    distance: "11.5 km",
    difficulty: "Moderate",
    gain: "+1,028m",
    overview: "Serpentine trail climbing along the roaring Nyund river torrent to a crystal-clear high-altitude glacial lake nestled under Minkiani Pass.",
  },
  {
    id: "indrahar-pass",
    name: "Indrahar Pass Dhauladhar Crest",
    region: "Himachal Pradesh",
    valley: "Kangra / Dharamshala",
    type: "trek",
    maxAltitude: "4,334m",
    distance: "20.4 km",
    difficulty: "Difficult",
    gain: "+2,665m",
    overview: "Iconic high-altitude Dhauladhar trek climbing from Galu Devi Temple past Triund ridge, Snowline Cafe, and ancient Lahesh Cave to the jagged knife-edge Indrahar Pass (4,334m).",
  },
  {
    id: "hemkund-sahib",
    name: "Hemkund Sahib & Lokpal Lake",
    region: "Uttarakhand",
    valley: "Chamoli / Garhwal",
    type: "trek",
    maxAltitude: "4,329m",
    distance: "13.9 km",
    difficulty: "Moderate-Difficult",
    gain: "+2,090m",
    overview: "Sacred high-altitude Sikh pilgrimage trail climbing from Govindghat through Ghangaria to the glaciated lake at 4,329m.",
  },
  {
    id: "valley-of-flowers",
    name: "Valley of Flowers National Park",
    region: "Uttarakhand",
    valley: "Chamoli / Garhwal",
    type: "trek",
    maxAltitude: "3,858m",
    distance: "17.1 km",
    difficulty: "Moderate",
    gain: "+1,676m",
    overview: "UNESCO World Heritage floral sanctuary trail ascending along the Pushpawati River into high alpine wildflower pastures.",
  },
  {
    id: "kedarkantha",
    name: "Kedarkantha Summit Trek",
    region: "Uttarakhand",
    valley: "Uttarkashi / Govind Sanctuary",
    type: "trek",
    maxAltitude: "3,800m",
    distance: "18.4 km",
    difficulty: "Moderate",
    gain: "+2,613m",
    overview: "India's premier winter summit trek climbing from Sankri through Juda Ka Talab to the panoramic 3,800m pyramidal summit.",
  },
  {
    id: "markha-valley",
    name: "Markha Valley Expedition",
    region: "Ladakh",
    valley: "Hemis National Park",
    type: "trek",
    maxAltitude: "5,269m",
    distance: "97.0 km",
    difficulty: "Challenging",
    gain: "+4,017m",
    overview: "Definitive Ladakh wilderness trek through high canyons, mudbrick gompas, Nimaling pasture, and Kongmaru La pass.",
  },
  {
    id: "tarsar-marsar",
    name: "Tarsar Marsar Alpine Lakes",
    region: "Jammu & Kashmir",
    valley: "Aru Valley / Kolahoi",
    type: "trek",
    maxAltitude: "4,004m",
    distance: "47.0 km",
    difficulty: "Moderate",
    gain: "+2,103m",
    overview: "Enchanting Kashmiri alpine trek from Aru village past pine glades and meadows to the almond-shaped glacial tarns.",
  },
  {
    id: "kashmir-great-lakes",
    name: "Kashmir Great Lakes (KGL)",
    region: "Jammu & Kashmir",
    valley: "Sonmarg to Naranag",
    type: "trek",
    maxAltitude: "4,200m",
    distance: "58.3 km",
    difficulty: "Difficult",
    gain: "+3,365m",
    overview: "Crown jewel alpine expedition crossing 3 high passes to unveil seven turquoise glacial lakes beneath Mount Harmukh.",
  },
  {
    id: "roopkund-trek",
    name: "Roopkund Mystery Lake Trek",
    region: "Uttarakhand",
    valley: "Chamoli / Trishul",
    type: "trek",
    maxAltitude: "5,029m",
    distance: "18.0 km",
    difficulty: "Difficult",
    gain: "+2,031m",
    overview: "Historic Garhwali high-altitude trek crossing the immense meadows of Bedni Bugyal to the enigmatic skeleton lake at 5,029m.",
  },
  {
    id: "gangotri-gaumukh",
    name: "Gaumukh Tapovan Glacier Trek",
    region: "Uttarakhand",
    valley: "Uttarkashi / Gangotri",
    type: "trek",
    maxAltitude: "4,463m",
    distance: "20.2 km",
    difficulty: "Moderate-Difficult",
    gain: "+1,425m",
    overview: "Sacred trek along the roaring Bhagirathi River to the origin of the Ganga and the golden meadows of Tapovan under Shivling.",
  },
  {
    id: "dayara-bugyal",
    name: "Dayara Bugyal Meadow Trek",
    region: "Uttarakhand",
    valley: "Uttarkashi / Raithal",
    type: "trek",
    maxAltitude: "3,657m",
    distance: "6.5 km",
    difficulty: "Easy-Moderate",
    gain: "+1,184m",
    overview: "Gentle oak forest ascent to one of India's most expansive high-altitude velvet alpine meadows with Bandarpoonch views.",
  },
  {
    id: "chopta-tungnath",
    name: "Chopta, Tungnath & Chandrashila",
    region: "Uttarakhand",
    valley: "Rudraprayag / Garhwal",
    type: "trek",
    maxAltitude: "4,000m",
    distance: "3.9 km",
    difficulty: "Moderate",
    gain: "+757m",
    overview: "Short steep ascent from Chopta meadow to the world's highest Shiva temple (Tungnath) and the Chandrashila summit panorama.",
  },
  {
    id: "kuari-pass",
    name: "Kuari Pass (Lord Curzon Trail)",
    region: "Uttarakhand",
    valley: "Chamoli / Nanda Devi",
    type: "trek",
    maxAltitude: "3,682m",
    distance: "20.3 km",
    difficulty: "Moderate",
    gain: "+1,901m",
    overview: "Pioneered by Lord Curzon in 1905, this legendary traverse climbs from Dhak via Tugasi and Khullara over Kuari Pass to Tali and Gorson Bugyal, finishing at Auli.",
  },
  {
    id: "dodital",
    name: "Dodital Lake & Darwa Pass",
    region: "Uttarakhand",
    valley: "Uttarkashi / Bhagirathi",
    type: "trek",
    maxAltitude: "3,781m",
    distance: "31.5 km",
    difficulty: "Moderate-Difficult",
    gain: "+2,376m",
    overview: "Ancient pilgrimage trail from Sangam Chatti through dense oak-rhododendron forests to the emerald lake of Lord Ganesha and Darwa Pass.",
  },
  {
    id: "deoria-tal",
    name: "Deoria Tal & Sari Trail",
    region: "Uttarakhand",
    valley: "Rudraprayag / Mandakini",
    type: "trek",
    maxAltitude: "2,405m",
    distance: "10.8 km",
    difficulty: "Easy-Moderate",
    gain: "+1,055m",
    overview: "Scenic climb from Sari village through rhododendron groves to the serene lake mirroring Chaukhamba's four snow-clad peaks.",
  },
  {
    id: "kamrunag-lake",
    name: "Kamrunag Lake Pilgrim Trail",
    region: "Himachal Pradesh",
    valley: "Mandi / Suket",
    type: "trek",
    maxAltitude: "2,900m",
    distance: "7.7 km",
    difficulty: "Moderate",
    gain: "+792m",
    overview: "Steep sacred stone stairway ascending through cedar forests to the revered high-altitude shrine and lake of King Yaksha.",
  },
  {
    id: "kinner-kailash",
    name: "Kinner Kailash Parikrama",
    region: "Himachal Pradesh",
    valley: "Kinnaur / Tangling",
    type: "trek",
    maxAltitude: "4,803m",
    distance: "18.0 km",
    difficulty: "Difficult",
    gain: "+3,012m",
    overview: "Grueling high-altitude pilgrim ascent from Tangling over steep boulder fields and glacial moraines to the sacred 79-foot natural rock monolith.",
  },
  {
    id: "madhyamaheshwar",
    name: "Madhyamaheshwar Temple Trek",
    region: "Uttarakhand",
    valley: "Rudraprayag / Madmaheshwar Ganga",
    type: "trek",
    maxAltitude: "3,243m",
    distance: "24.6 km",
    difficulty: "Moderate-Difficult",
    gain: "+2,304m",
    overview: "Fourth Panch Kedar pilgrimage trail climbing from Ransi along cascading river gorges and misty forests to the sacred high alpine shrine under Chaukhamba.",
  },
  {
    id: "manimahesh-kailash",
    name: "Manimahesh Kailash Lake",
    region: "Himachal Pradesh",
    valley: "Chamba / Bharmour",
    type: "trek",
    maxAltitude: "4,166m",
    distance: "21.6 km",
    difficulty: "Difficult",
    gain: "+2,194m",
    overview: "Sacred high Pir Panjal pilgrimage trek from Hadsar past Dhancho waterfall to the glacial tarn resting directly below the unclimbed Manimahesh Kailash.",
  },
  {
    id: "pin-bhaba-pass",
    name: "Pin Bhaba Pass Traverse",
    region: "Himachal Pradesh",
    valley: "Kinnaur to Spiti",
    type: "trek",
    maxAltitude: "4,966m",
    distance: "46.3 km",
    difficulty: "Difficult",
    gain: "+2,916m",
    overview: "Spectacular crossover trek from the lush green cedar forests of Kinnaur's Bhaba Valley over the 4,966m snowy col into the stark desert moonscape of Mudh in Spiti.",
  },
  {
    id: "pin-parvati-pass",
    name: "Pin Parvati Pass Expedition",
    region: "Himachal Pradesh",
    valley: "Parvati to Spiti",
    type: "trek",
    maxAltitude: "5,280m",
    distance: "76.7 km",
    difficulty: "Extreme Alpine",
    gain: "+3,556m",
    overview: "Legendary high-altitude trans-Himalayan expedition navigating raging Parvati torrents, massive crevassed glaciers, and a 5,280m pass into Spiti Valley.",
  },
  {
    id: "rupin-pass-kinnaur",
    name: "Rupin Pass Alpine Traverse",
    region: "Himachal Pradesh",
    valley: "Garhwal to Kinnaur",
    type: "trek",
    maxAltitude: "4,657m",
    distance: "51.6 km",
    difficulty: "Difficult",
    gain: "+3,770m",
    overview: "Classic crossover trek ascending from Dhaula through hanging villages, cascading snow waterfalls, and the sheer Rupin Gully over 4,657m into Sangla.",
  },
  {
    id: "satopanth-tal-trek",
    name: "Satopanth Tal Glacial Lake",
    region: "Uttarakhand",
    valley: "Chamoli / Alaknanda",
    type: "trek",
    maxAltitude: "4,369m",
    distance: "31.1 km",
    difficulty: "Difficult",
    gain: "+1,561m",
    overview: "High-altitude triangular glacial lake route from Mana past Vasudhara Falls, crossing boulder-strewn moraines under Swargarohini and Chaukhamba.",
  },
  {
    id: "vasudhara-falls",
    name: "Vasudhara Falls Trail",
    region: "Uttarakhand",
    valley: "Chamoli / Mana",
    type: "trek",
    maxAltitude: "3,758m",
    distance: "10.5 km",
    difficulty: "Moderate",
    gain: "+614m",
    overview: "High-altitude trail from India's first border village Mana, following the Alaknanda gorge past Saraswati river to the sheer 122m glacial waterfall.",
  },
];

const TERRITORY_OPTIONS = [
  { id: "all", label: "ALL", full: "All Territories", accent: "#0284C7" },
  { id: "himachal-pradesh", label: "HP", full: "Himachal Pradesh", accent: "#D97706" },
  { id: "jammu-kashmir", label: "J&K", full: "Jammu & Kashmir", accent: "#2563EB" },
  { id: "ladakh", label: "LD", full: "Ladakh", accent: "#9333EA" },
  { id: "uttarakhand", label: "UK", full: "Uttarakhand", accent: "#0D9488" },
] as const;

export type SortMode = "default" | "alt-desc" | "alt-asc" | "alpha";

const SORT_OPTIONS: { id: SortMode; label: string; tooltip: string }[] = [
  { id: "default", label: "Default", tooltip: "Curated canonical order" },
  { id: "alt-desc", label: "Alt ↓", tooltip: "Highest altitude first" },
  { id: "alt-asc", label: "Alt ↑", tooltip: "Lowest altitude first" },
  { id: "alpha", label: "A–Z", tooltip: "Alphabetical order" },
];

function parseAltitudeMeters(alt?: string | number): number {
  if (typeof alt === "number") return alt;
  if (!alt) return 0;
  return parseInt(alt.replace(/\D/g, "") || "0", 10);
}

interface MapExplorerDrawerProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  selectedId: string | null;
  activeRegionId: string | null;
  onSelectRoute: (routeId: string) => void;
  onSelectPlace: (place: HimalayaPlace) => void;
  onSelectRegion: (regionId: string) => void;
  onHoverEntity: (id: string | null) => void;
  peaks: Peak[];
  allPlaces: HimalayaPlace[];
}

export function MapExplorerDrawer({
  isOpen,
  onToggleOpen,
  selectedId,
  activeRegionId,
  onSelectRoute,
  onSelectPlace,
  onSelectRegion,
  onHoverEntity,
  peaks,
  allPlaces,
}: MapExplorerDrawerProps) {
  const theme = useHimalayanTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"trails" | "peaks" | "all">("trails");
  const [searchQuery, setSearchQuery] = useState("");
  const [territoryFilter, setTerritoryFilter] = useState<string>(() => activeRegionId ?? "all");
  const [sortMode, setSortMode] = useState<SortMode>("default");

  // Keep internal territory filter synchronized if activeRegionId changes externally
  const [prevActiveRegionId, setPrevActiveRegionId] = useState(activeRegionId);
  if (activeRegionId !== prevActiveRegionId) {
    setPrevActiveRegionId(activeRegionId);
    setTerritoryFilter(activeRegionId ?? "all");
  }

  // 1. Symmetrically Filtered & Sorted Verified Routes
  const filteredRoutes = useMemo(() => {
    let list = VERIFIED_ROUTES_CATALOG;
    if (territoryFilter !== "all") {
      const targetSlug =
        territoryFilter === "himachal-pradesh"
          ? "himachal"
          : territoryFilter === "jammu-kashmir"
          ? "kashmir"
          : territoryFilter === "ladakh"
          ? "ladakh"
          : "uttarakhand";
      list = list.filter((r) => r.region.toLowerCase().includes(targetSlug));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.valley.toLowerCase().includes(q) ||
          r.maxAltitude.includes(q) ||
          r.difficulty.toLowerCase().includes(q)
      );
    }

    if (sortMode === "alt-desc") {
      list = [...list].sort((a, b) => parseAltitudeMeters(b.maxAltitude) - parseAltitudeMeters(a.maxAltitude));
    } else if (sortMode === "alt-asc") {
      list = [...list].sort((a, b) => parseAltitudeMeters(a.maxAltitude) - parseAltitudeMeters(b.maxAltitude));
    } else if (sortMode === "alpha") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [territoryFilter, searchQuery, sortMode]);

  // 2. Symmetrically Filtered & Sorted Summits (Peaks)
  const filteredPeaks = useMemo(() => {
    let list = peaks;
    if (territoryFilter !== "all") {
      list = list.filter((p) => {
        if (p.territory) return p.territory === territoryFilter;
        const reg = p.region.toLowerCase();
        const targetSlug =
          territoryFilter === "himachal-pradesh"
            ? "himachal"
            : territoryFilter === "jammu-kashmir"
            ? "kashmir"
            : territoryFilter === "ladakh"
            ? "ladakh"
            : "uttarakhand";
        return reg.includes(targetSlug);
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          String(p.height).includes(q)
      );
    }

    if (sortMode === "alt-desc") {
      list = [...list].sort((a, b) => b.height - a.height);
    } else if (sortMode === "alt-asc") {
      list = [...list].sort((a, b) => a.height - b.height);
    } else if (sortMode === "alpha") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [peaks, territoryFilter, searchQuery, sortMode]);

  // 3. Symmetrically Filtered & Sorted Atlas Destinations (Places)
  const filteredPlaces = useMemo(() => {
    let list = allPlaces;

    // Deduplicate by place ID so each destination appears exactly once
    const seen = new Set<string>();
    list = list.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    if (territoryFilter !== "all") {
      list = list.filter((p) => {
        const loc = placeLocationIndex.get(p.id);
        return loc?.regionId === territoryFilter;
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.elevation?.includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }

    if (sortMode === "alt-desc") {
      list = [...list].sort((a, b) => parseAltitudeMeters(b.elevation) - parseAltitudeMeters(a.elevation));
    } else if (sortMode === "alt-asc") {
      list = [...list].sort((a, b) => parseAltitudeMeters(a.elevation) - parseAltitudeMeters(b.elevation));
    } else if (sortMode === "alpha") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [allPlaces, territoryFilter, searchQuery, sortMode]);

  return (
    <>
      {/* ── Docked Edge Handle (When Drawer is Closed) ────────────────────── */}
      {!isOpen && (
        <button
          onClick={onToggleOpen}
          title="Open Himalayan Explorer Drawer"
          aria-label="Open Himalayan Explorer Drawer"
          className={`absolute top-4 sm:top-6 left-0 z-30 flex items-center gap-2.5 px-3.5 py-2.5 rounded-r-2xl border-y border-r backdrop-blur-2xl transition-all cursor-pointer group ${
            isDark
              ? "bg-[#060a14]/90 hover:bg-[#080e1c] border-white/15 text-white shadow-[0_8px_32px_rgba(0,0,0,0.85)] hover:border-sky-400/40"
              : "bg-white hover:bg-slate-50 border-slate-300 text-slate-900 shadow-[0_8px_32px_rgba(15,23,42,0.12)] hover:border-sky-500"
          }`}
        >
          <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400 group-hover:rotate-45 transition-transform duration-300" />
          <span className={`text-xs font-bold tracking-wide ${isDark ? "text-white" : "text-slate-900"}`}>
            Trail Directory
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${
              isDark
                ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
                : "bg-sky-50 text-sky-800 border-sky-300 font-bold"
            }`}
          >
            {VERIFIED_ROUTES_CATALOG.length} GPS
          </span>
        </button>
      )}

      {/* ── Main Collapsible Explorer Drawer ─────────────────────────────── */}
      <div
        className={`absolute top-0 left-0 bottom-0 z-20 w-[330px] sm:w-[370px] max-w-[calc(100vw-36px)] transition-transform duration-300 ease-out flex flex-col border-r select-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isDark
            ? "border-white/[0.08] shadow-[16px_0_48px_rgba(0,0,0,0.85)] bg-[#060a14]/95 text-white"
            : "border-slate-200/90 shadow-[16px_0_48px_rgba(15,23,42,0.08)] bg-white/95 text-slate-900 backdrop-blur-2xl"
        }`}
        style={{
          background: isDark
            ? "linear-gradient(180deg, rgba(6, 10, 20, 0.96) 0%, rgba(4, 7, 15, 0.98) 100%)"
            : "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
        }}
      >
        {/* Integrated Edge Tab Handle (Attached directly to right border) */}
        {isOpen && (
          <button
            onClick={onToggleOpen}
            title="Collapse Explorer Drawer"
            aria-label="Collapse Explorer Drawer"
            className={`absolute top-5 -right-9 z-30 w-9 h-11 rounded-r-xl flex items-center justify-center border-y border-r backdrop-blur-2xl transition-all cursor-pointer group shadow-xl ${
              isDark
                ? "bg-[#060a14]/95 border-white/15 text-slate-400 hover:text-white hover:bg-white/10 hover:border-sky-400/40"
                : "bg-white border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-md"
            }`}
          >
            <PanelLeftClose
              className={`w-4 h-4 transition-colors ${
                isDark ? "text-slate-400 group-hover:text-sky-400" : "text-slate-700 group-hover:text-sky-600"
              }`}
            />
          </button>
        )}

        {/* ── Drawer Header ─────────────────────────────────────────────── */}
        <div
          className={`p-3.5 sm:p-4 border-b flex-shrink-0 ${
            isDark ? "border-white/[0.08]" : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  isDark
                    ? "bg-sky-500/10 border border-sky-500/25 text-sky-400"
                    : "bg-sky-50 border border-sky-300 text-sky-700"
                }`}
              >
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3
                  className={`font-display font-bold text-xs uppercase tracking-wider leading-none ${
                    isDark ? "text-slate-100" : "text-slate-950 font-extrabold"
                  }`}
                >
                  Himalayan 3D Atlas
                </h3>
                <span
                  className={`text-[10px] font-mono leading-none flex items-center gap-1 mt-1 ${
                    isDark ? "text-emerald-400/90 font-medium" : "text-emerald-700 font-bold"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {VERIFIED_ROUTES_CATALOG.length} Verified GPS Tracks
                </span>
              </div>
            </div>

            <button
              onClick={onToggleOpen}
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-white/10"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-2.5">
            <Search
              className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trails, peaks, elevations…"
              className={`w-full pl-8 pr-7 py-1.5 text-xs rounded-xl focus:outline-none transition-all ${
                isDark
                  ? "bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-400 focus:border-sky-400/60 focus:bg-white/[0.06]"
                  : "bg-slate-100/90 border border-slate-300 text-slate-950 placeholder:text-slate-500 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500 font-medium"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Territory Segmented Bar */}
          <div
            className={`grid grid-cols-5 gap-1 p-1 rounded-xl mb-2.5 ${
              isDark
                ? "bg-white/[0.03] border border-white/[0.06]"
                : "bg-slate-100 border border-slate-200"
            }`}
          >
            {TERRITORY_OPTIONS.map((opt) => {
              const isSelected = territoryFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTerritoryFilter(opt.id);
                    onSelectRegion(opt.id);
                  }}
                  title={opt.full}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                    isSelected
                      ? isDark
                        ? "bg-white/10 text-white shadow-sm border border-white/15"
                        : "bg-white text-slate-950 font-bold shadow-sm border border-slate-300"
                      : isDark
                      ? "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                      : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: opt.accent }}
                    />
                    <span
                      className={
                        isSelected
                          ? isDark
                            ? "text-white font-bold"
                            : "text-slate-950 font-extrabold"
                          : isDark
                          ? "text-slate-400"
                          : "text-slate-700 font-semibold"
                      }
                    >
                      {opt.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Drawer Navigation Tabs */}
          <div
            className={`grid grid-cols-3 gap-1 p-1 rounded-xl mb-2.5 ${
              isDark
                ? "bg-white/[0.03] border border-white/[0.06]"
                : "bg-slate-100 border border-slate-200"
            }`}
          >
            <button
              onClick={() => setActiveTab("trails")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "trails"
                  ? isDark
                    ? "bg-white/10 text-white shadow-sm border border-white/15 font-semibold"
                    : "bg-white text-slate-950 shadow-sm border border-slate-300 font-bold"
                  : isDark
                  ? "text-slate-400 hover:text-slate-200 font-medium"
                  : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60 font-semibold"
              }`}
            >
              <Footprints className="w-3.5 h-3.5 text-sky-500" />
              <span
                className={
                  activeTab === "trails"
                    ? isDark
                      ? "text-white font-semibold"
                      : "text-slate-950 font-bold"
                    : isDark
                    ? "text-slate-400"
                    : "text-slate-700 font-medium"
                }
              >
                Trails ({filteredRoutes.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab("peaks")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "peaks"
                  ? isDark
                    ? "bg-white/10 text-white shadow-sm border border-white/15 font-semibold"
                    : "bg-white text-slate-950 shadow-sm border border-slate-300 font-bold"
                  : isDark
                  ? "text-slate-400 hover:text-slate-200 font-medium"
                  : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60 font-semibold"
              }`}
            >
              <Mountain className="w-3.5 h-3.5 text-amber-500" />
              <span
                className={
                  activeTab === "peaks"
                    ? isDark
                      ? "text-white font-semibold"
                      : "text-slate-950 font-bold"
                    : isDark
                    ? "text-slate-400"
                    : "text-slate-700 font-medium"
                }
              >
                Summits ({filteredPeaks.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "all"
                  ? isDark
                    ? "bg-white/10 text-white shadow-sm border border-white/15 font-semibold"
                    : "bg-white text-slate-950 shadow-sm border border-slate-300 font-bold"
                  : isDark
                  ? "text-slate-400 hover:text-slate-200 font-medium"
                  : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60 font-semibold"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-teal-500" />
              <span
                className={
                  activeTab === "all"
                    ? isDark
                      ? "text-white font-semibold"
                      : "text-slate-950 font-bold"
                    : isDark
                    ? "text-slate-400"
                    : "text-slate-700 font-medium"
                }
              >
                Places ({filteredPlaces.length})
              </span>
            </button>
          </div>

          {/* Symmetrical Sorting Control Bar across Trails, Summits, Places */}
          <div
            className={`flex items-center justify-between px-2 py-1 rounded-lg border text-[10.5px] font-mono ${
              isDark
                ? "bg-white/[0.02] border-white/[0.06]"
                : "bg-slate-100/80 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-sky-500" />
              <span className={isDark ? "text-slate-400 font-medium" : "text-slate-700 font-bold"}>
                Sort:
              </span>
            </div>
            <div className="flex items-center gap-1">
              {SORT_OPTIONS.map((opt) => {
                const isActive = sortMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSortMode(opt.id)}
                    title={opt.tooltip}
                    className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                      isActive
                        ? isDark
                          ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold"
                          : "bg-white text-sky-800 shadow-sm border border-sky-300 font-bold"
                        : isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60 font-medium"
                    }`}
                  >
                    <span
                      className={
                        isActive
                          ? isDark
                            ? "text-sky-300 font-semibold"
                            : "text-sky-800 font-bold"
                          : isDark
                          ? "text-slate-400"
                          : "text-slate-700 font-medium"
                      }
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Drawer Body: Curated Cards ─────────────────────────────────── */}
        <div
          className={`flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2 scrollbar-thin ${
            isDark ? "scrollbar-thumb-white/15" : "scrollbar-thumb-slate-300"
          }`}
        >
          {activeTab === "trails" && (
            <>
              <div className="flex items-center justify-between px-1 text-[9.5px] font-mono uppercase tracking-wider">
                <span className={isDark ? "text-slate-400" : "text-slate-700 font-bold"}>
                  Verified Field Routes
                </span>
                <span className={isDark ? "text-slate-400" : "text-slate-600 font-semibold"}>
                  {filteredRoutes.length} Available
                </span>
              </div>

              {filteredRoutes.length === 0 ? (
                <div
                  className={`text-center py-8 text-xs font-mono ${
                    isDark ? "text-slate-400" : "text-slate-600 font-medium"
                  }`}
                >
                  No matching verified trails found.
                </div>
              ) : (
                filteredRoutes.map((route) => {
                  const isSelected = selectedId === route.id;
                  return (
                    <div
                      key={route.id}
                      onClick={() => onSelectRoute(route.id)}
                      onMouseEnter={() => onHoverEntity(route.id)}
                      onMouseLeave={() => onHoverEntity(null)}
                      className={`group relative p-3.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                        isSelected
                          ? isDark
                            ? "bg-sky-500/[0.08] border-sky-400/60 shadow-[0_4px_24px_rgba(56,189,248,0.15)] border-l-4 border-l-sky-400"
                            : "bg-sky-50/90 border-2 border-sky-500 shadow-md border-l-4 border-l-sky-600"
                          : isDark
                          ? "bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.07] hover:border-white/15"
                          : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
                      }`}
                    >
                      {/* Overline & Elevation Badge */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[9.5px] font-mono tracking-wider uppercase truncate ${
                            isDark ? "text-slate-400" : "text-slate-600 font-semibold"
                          }`}
                        >
                          {route.valley} · {route.region}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md flex-shrink-0 border ${
                            isDark
                              ? "text-slate-200 bg-white/[0.05] border-white/10 font-medium"
                              : "text-slate-900 bg-slate-100 border-slate-300 font-bold"
                          }`}
                        >
                          ▲ {route.maxAltitude}
                        </span>
                      </div>

                      {/* Title */}
                      <h4
                        className={`font-display text-[13.5px] transition-colors mb-1.5 ${
                          isDark
                            ? "text-slate-100 font-semibold group-hover:text-sky-300"
                            : "text-slate-950 font-bold group-hover:text-sky-700"
                        }`}
                      >
                        {route.name}
                      </h4>

                      {/* Overview */}
                      <p
                        className={`text-[11.5px] line-clamp-2 leading-relaxed mb-3 ${
                          isDark ? "text-slate-400" : "text-slate-700 font-normal"
                        }`}
                      >
                        {route.overview}
                      </p>

                      {/* Metrics Bar */}
                      <div
                        className={`flex items-center justify-between text-[10.5px] font-mono pt-2 border-t ${
                          isDark
                            ? "text-slate-400 border-white/[0.06]"
                            : "text-slate-600 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              isDark ? "text-slate-200 font-medium" : "text-slate-950 font-bold"
                            }
                          >
                            {route.distance}
                          </span>
                          <span className={isDark ? "text-white/20" : "text-slate-300"}>|</span>
                          <span className={isDark ? "text-slate-400" : "text-slate-700 font-medium"}>
                            {route.gain}
                          </span>
                          <span className={isDark ? "text-white/20" : "text-slate-300"}>|</span>
                          <span
                            className={
                              route.difficulty.includes("Extreme")
                                ? "text-rose-600 dark:text-rose-400 font-semibold"
                                : route.difficulty.includes("Demanding")
                                ? "text-amber-600 dark:text-amber-400 font-semibold"
                                : "text-emerald-700 dark:text-emerald-400 font-semibold"
                            }
                          >
                            {route.difficulty}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-all ${
                            isDark
                              ? "text-slate-500 group-hover:text-sky-400"
                              : "text-slate-400 group-hover:text-sky-700"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === "peaks" && (
            <>
              <div className="flex items-center justify-between px-1 text-[9.5px] font-mono uppercase tracking-wider">
                <span className={isDark ? "text-slate-400" : "text-slate-700 font-bold"}>
                  Himalayan Summits
                </span>
                <span className={isDark ? "text-slate-400" : "text-slate-600 font-semibold"}>
                  {filteredPeaks.length} Peaks
                </span>
              </div>

              {filteredPeaks.length === 0 ? (
                <div
                  className={`text-center py-8 text-xs font-mono ${
                    isDark ? "text-slate-400" : "text-slate-600 font-medium"
                  }`}
                >
                  No summits found for this territory.
                </div>
              ) : (
                filteredPeaks.map((peak) => {
                  const isSelected = selectedId === peak.slug;
                  return (
                    <div
                      key={peak.slug}
                      onClick={() => {
                        const placeMatch = allPlaces.find((p) => p.id === peak.slug);
                        if (placeMatch) {
                          onSelectPlace(placeMatch);
                        } else if (peak.coords) {
                          onSelectPlace({
                            id: peak.slug,
                            name: peak.title,
                            type: "peak",
                            emoji: "▲",
                            coords: peak.coords,
                            elevation: `${peak.height}m`,
                            description: peak.description,
                          } as HimalayaPlace);
                        } else {
                          onSelectRoute(peak.slug);
                        }
                      }}
                      onMouseEnter={() => onHoverEntity(peak.slug)}
                      onMouseLeave={() => onHoverEntity(null)}
                      className={`group relative p-3.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                        isSelected
                          ? isDark
                            ? "bg-amber-500/[0.08] border-amber-400/60 shadow-[0_4px_24px_rgba(245,158,11,0.15)] border-l-4 border-l-amber-400"
                            : "bg-amber-50/90 border-2 border-amber-500 shadow-md border-l-4 border-l-amber-600"
                          : isDark
                          ? "bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.07] hover:border-white/15"
                          : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[9.5px] font-mono tracking-wider uppercase ${
                            isDark ? "text-slate-400" : "text-slate-600 font-semibold"
                          }`}
                        >
                          {peak.region}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md flex-shrink-0 border ${
                            isDark
                              ? "text-amber-300 bg-amber-500/10 border-amber-500/20 font-medium"
                              : "text-amber-900 bg-amber-100 border-amber-300 font-bold"
                          }`}
                        >
                          ▲ {peak.height.toLocaleString()}m
                        </span>
                      </div>

                      <h4
                        className={`font-display text-[13.5px] transition-colors mb-1.5 ${
                          isDark
                            ? "text-slate-100 font-semibold group-hover:text-amber-300"
                            : "text-slate-950 font-bold group-hover:text-amber-800"
                        }`}
                      >
                        {peak.title}
                      </h4>

                      <p
                        className={`text-[11.5px] line-clamp-2 leading-relaxed mb-3 ${
                          isDark ? "text-slate-400" : "text-slate-700 font-normal"
                        }`}
                      >
                        {peak.description || peak.overview}
                      </p>

                      <div
                        className={`flex items-center justify-between text-[10.5px] font-mono pt-2 border-t ${
                          isDark
                            ? "text-slate-400 border-white/[0.06]"
                            : "text-slate-600 border-slate-200"
                        }`}
                      >
                        <span
                          className={
                            isDark
                              ? "text-amber-300/80 font-medium"
                              : "text-amber-800 font-bold"
                          }
                        >
                          {peak.difficulty} Expedition
                        </span>
                        <div
                          className={`flex items-center gap-1 group-hover:translate-x-0.5 transition-all ${
                            isDark
                              ? "text-slate-400 group-hover:text-amber-300"
                              : "text-slate-600 group-hover:text-amber-800"
                          }`}
                        >
                          <span className="text-[10px] font-medium">3D Orbit</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === "all" && (
            <>
              <div className="flex items-center justify-between px-1 text-[9.5px] font-mono uppercase tracking-wider">
                <span className={isDark ? "text-slate-400" : "text-slate-700 font-bold"}>
                  Featured Destinations
                </span>
                <span className={isDark ? "text-slate-400" : "text-slate-600 font-semibold"}>
                  {filteredPlaces.length} Results
                </span>
              </div>

              {filteredPlaces.length === 0 ? (
                <div
                  className={`text-center py-8 text-xs font-mono ${
                    isDark ? "text-slate-400" : "text-slate-600 font-medium"
                  }`}
                >
                  No places found for this territory.
                </div>
              ) : (
                filteredPlaces.map((place, idx) => {
                  const isSelected = selectedId === place.id;
                  return (
                    <div
                      key={`${place.id}-${idx}`}
                      onClick={() => onSelectPlace(place)}
                      onMouseEnter={() => onHoverEntity(place.id)}
                      onMouseLeave={() => onHoverEntity(null)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? "bg-sky-500/[0.08] border-sky-400/60 shadow-[0_4px_24px_rgba(56,189,248,0.15)] border-l-4 border-l-sky-400"
                            : "bg-sky-50/90 border-2 border-sky-500 shadow-md border-l-4 border-l-sky-600"
                          : isDark
                          ? "bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.07] hover:border-white/15"
                          : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs">{place.emoji}</span>
                          <span
                            className={`text-xs truncate ${
                              isDark
                                ? "text-slate-100 font-semibold group-hover:text-sky-300"
                                : "text-slate-950 font-bold group-hover:text-sky-700"
                            }`}
                          >
                            {place.name}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 text-[9.5px] font-mono ${
                            isDark ? "text-slate-400" : "text-slate-600 font-medium"
                          }`}
                        >
                          <span className="capitalize">{place.type}</span>
                          {place.elevation && <span>• {place.elevation}</span>}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform flex-shrink-0 ${
                          isDark
                            ? "text-slate-500 group-hover:text-white"
                            : "text-slate-500 group-hover:text-slate-950"
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
