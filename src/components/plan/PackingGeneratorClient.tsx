"use client";

import { useState, useMemo } from "react";
import { Trek } from "@/data/types";
import { parseAltitude, parseDuration } from "@/lib/scoring";
import { Package, CloudRain, Snowflake, Sun, Cloud, CheckSquare, Square } from "lucide-react";

type SeasonCategory = "summer" | "monsoon" | "autumn" | "winter";

export function PackingGeneratorClient({ allTreks }: { allTreks: Trek[] }) {
  const [selectedTrekId, setSelectedTrekId] = useState<string>(allTreks[0]?.slug || "");
  const [season, setSeason] = useState<SeasonCategory>("summer");
  const [gender, setGender] = useState<"unisex" | "female">("unisex");

  // Local state for checked items across the generated list
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const selectedTrek = allTreks.find(t => t.slug === selectedTrekId);
  const altitude = selectedTrek ? parseAltitude(selectedTrek.maxAltitude) : 0;
  const duration = selectedTrek ? parseDuration(selectedTrek.duration) : 0;

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const getProgress = (items: string[]) => {
    if (items.length === 0) return 0;
    const checked = items.filter(i => checkedItems[i]).length;
    return Math.round((checked / items.length) * 100);
  };

  const gearList = useMemo(() => {
    const list: Record<string, string[]> = {
      "Clothing: Base & Mid Layers": [
        duration > 4 ? "4x Moisture-wicking t-shirts (synthetic/merino)" : "2x Moisture-wicking t-shirts",
        "2x Trekking pants (quick dry)",
        duration > 4 ? "4x Pairs of underwear" : "2x Pairs of underwear",
        "1x Fleece jacket or heavy pullover"
      ],
      "Clothing: Outer Layers & Extremities": [
        "1x Waterproof windcheater/jacket",
        "1x Sun hat or cap",
        "1x Woolen beanie or fleece cap",
        "2x Pairs of warm woolen socks",
        "2x Pairs of thin liner socks",
        "1x Pair of fleece or woolen gloves"
      ],
      "Footwear": [
        "1x Pair of sturdy trekking shoes (high ankle)",
        "1x Pair of camp sandals or floaters"
      ],
      "Gear & Equipment": [
        "1x 50-60L Backpack with rain cover",
        "1x 20L Daypack (if using offloading)",
        "2x 1L Reusable water bottles or hydration bladder",
        "1x Pair of trekking poles",
        "1x Headlamp with extra batteries",
        "UV Protection Sunglasses (Category 3 or 4)"
      ],
      "Medical & Toiletries": [
        "Personal First Aid Kit (Band-aids, blister tape, pain meds, Diamox)",
        "Sunscreen (SPF 50+) & Lip balm",
        "Hand sanitizer & Toilet paper",
        "Biodegradable wet wipes",
        "Toothbrush & small toothpaste"
      ],
      "Documents & Electronics": [
        "Original ID & multiple photocopies",
        "Passport size photographs (for permits)",
        "Enough cash (ATMs unavailable on trail)",
        "Powerbank (10000mAh+)"
      ]
    };

    // Altitude specific additions
    if (altitude > 4000) {
      list["Clothing: Base & Mid Layers"].push("1x Set of thermal innerwear (top & bottom)");
      list["Clothing: Outer Layers & Extremities"].push("1x Heavy down jacket (sub-zero rated)");
      list["Clothing: Outer Layers & Extremities"].push("1x Balaclava or neck gaiter");
      list["Clothing: Outer Layers & Extremities"].push("1x Pair of waterproof/windproof outer gloves");
      list["Gear & Equipment"].push("Sleeping bag liner (for extra warmth)");
    }

    // Season specific additions
    if (season === "monsoon") {
      list["Clothing: Outer Layers & Extremities"].push("1x Poncho or heavy duty raincoat");
      list["Clothing: Outer Layers & Extremities"].push("1x Waterproof trekking pants");
      list["Footwear"].push("Gaiters (for mud and leeches)");
      list["Gear & Equipment"].push("Multiple dry bags / ziplocks for electronics");
      list["Medical & Toiletries"].push("Anti-fungal powder & salt (for leeches)");
    }

    if (season === "winter") {
      list["Clothing: Base & Mid Layers"].push("2x Sets of heavy thermal innerwear");
      list["Clothing: Outer Layers & Extremities"].push("Fleece pants for camp");
      list["Gear & Equipment"].push("Microspikes or crampons (depending on trail)");
      list["Gear & Equipment"].push("Gaiters (for deep snow)");
      list["Medical & Toiletries"].push("Vaseline or heavy cold cream");
    }

    // Gender specific
    if (gender === "female") {
      list["Medical & Toiletries"].push("Feminine hygiene products & ziplocks for disposal");
      list["Medical & Toiletries"].push("Pee funnel (optional but recommended)");
    }

    return list;
  }, [altitude, duration, season, gender]);

  // Flatten for total progress
  const allItems = Object.values(gearList).flat();
  const totalProgress = getProgress(allItems);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Configuration Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-surface border border-white/10 p-6 md:p-8 rounded-3xl sticky top-24">
          <h2 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" /> Configuration
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2">Select Trek</label>
              <select 
                className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none"
                value={selectedTrekId}
                onChange={(e) => setSelectedTrekId(e.target.value)}
              >
                {allTreks.map(t => (
                  <option key={t.slug} value={t.slug}>{t.title} ({t.maxAltitude})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-3">Trekking Season</label>
              <div className="grid grid-cols-2 gap-3">
                <SeasonButton icon={<Sun />} label="Summer" value="summer" current={season} onClick={setSeason} />
                <SeasonButton icon={<CloudRain />} label="Monsoon" value="monsoon" current={season} onClick={setSeason} />
                <SeasonButton icon={<Cloud />} label="Autumn" value="autumn" current={season} onClick={setSeason} />
                <SeasonButton icon={<Snowflake />} label="Winter" value="winter" current={season} onClick={setSeason} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-3">Specific Requirements</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white">
                  <input 
                    type="radio" 
                    name="gender" 
                    checked={gender === "unisex"}
                    onChange={() => setGender("unisex")}
                    className="accent-primary"
                  />
                  Generic / Unisex
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-white/70 hover:text-white">
                  <input 
                    type="radio" 
                    name="gender" 
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                    className="accent-primary"
                  />
                  Female Specific
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex justify-between text-xs font-mono uppercase tracking-widest mb-2">
                <span className="text-white/50">Overall Progress</span>
                <span className="text-primary">{totalProgress}%</span>
              </div>
              <div className="h-2 w-full bg-[#121216] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
            
            <button 
              onClick={() => setCheckedItems({})}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-colors"
            >
              Reset Checklist
            </button>
          </div>
        </div>
      </div>

      {/* Generated Checklist */}
      <div className="lg:col-span-8">
        <div className="bg-surface border border-white/10 rounded-3xl p-6 md:p-10">
          <div className="mb-8 border-b border-white/10 pb-6">
            <h2 className="text-2xl font-display font-semibold text-white mb-2">
              Your Customized Gear List
            </h2>
            <p className="text-white/60 font-light">
              Tailored for {selectedTrek?.title}, reaching {selectedTrek?.maxAltitude} during {season} conditions.
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(gearList).map(([category, items]) => {
              const catProgress = getProgress(items);
              
              return (
                <div key={category} className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-display font-semibold text-white">{category}</h3>
                    <span className="text-xs font-mono text-white/40">{catProgress}% packed</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleCheck(item)}
                        className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                          checkedItems[item] 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500/80' 
                            : 'bg-white/5 border-white/5 text-white/70 hover:border-white/20'
                        }`}
                      >
                        <div className="mt-0.5">
                          {checkedItems[item] ? (
                            <CheckSquare className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Square className="w-5 h-5 text-white/30" />
                          )}
                        </div>
                        <span className={`text-sm font-light leading-snug ${checkedItems[item] ? 'line-through opacity-70' : ''}`}>
                          {item}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SeasonButton({ 
  icon, 
  label, 
  value, 
  current, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: SeasonCategory, 
  current: SeasonCategory, 
  onClick: (v: SeasonCategory) => void 
}) {
  const isActive = current === value;
  return (
    <button 
      onClick={() => onClick(value)}
      className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
        isActive ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-[#121216] border-white/5 text-white/50 hover:border-white/20 hover:text-white'
      }`}
    >
      <div className="mb-1.5 opacity-80">{icon}</div>
      <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
    </button>
  );
}
