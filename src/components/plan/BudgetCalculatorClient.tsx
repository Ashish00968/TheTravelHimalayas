"use client";

import { useState, useMemo } from "react";
import { Trek } from "@/data/types";
import { parseDuration } from "@/lib/scoring";
import { Calculator, IndianRupee, Users, Tent, MapPin, Package } from "lucide-react";


type TrekkingStyle = "independent" | "local_guide" | "agency";
type Nationality = "indian" | "foreigner";

export function BudgetCalculatorClient({ allTreks }: { allTreks: Trek[] }) {
  const [selectedTrekId, setSelectedTrekId] = useState<string>(allTreks[0]?.slug || "");
  const [groupSize, setGroupSize] = useState<number>(2);
  const [style, setStyle] = useState<TrekkingStyle>("local_guide");
  const [nationality, setNationality] = useState<Nationality>("indian");
  const [rentals, setRentals] = useState({
    shoes: false,
    backpack: false,
    sleepingBag: false,
    jacket: false,
    poles: false
  });

  const selectedTrek = allTreks.find(t => t.slug === selectedTrekId);
  const duration = selectedTrek ? parseDuration(selectedTrek.duration) : 0;

  // Calculation logic (Base defaults for Indian Himalayas in INR)
  const breakdown = useMemo(() => {
    let guideCost = 0;
    let porterCost = 0;
    let foodAccommodationCost = 0;
    let agencyCost = 0;

    // Personnel & Core Costs
    if (style === "independent") {
      foodAccommodationCost = duration * 600 * groupSize;
    } else if (style === "local_guide") {
      foodAccommodationCost = duration * 1000 * groupSize;
      guideCost = duration * 2500; // 1 guide per group
      // 1 porter per 2 people
      const portersNeeded = Math.ceil(groupSize / 2);
      porterCost = duration * 1500 * portersNeeded;
    } else if (style === "agency") {
      // All inclusive per person per day package
      agencyCost = duration * 3500 * groupSize;
    }

    // Permits
    const permitRate = nationality === "indian" ? 100 : 600;
    const permitCost = duration * permitRate * groupSize;

    // Rentals
    const rentalItemsCount = Object.values(rentals).filter(Boolean).length;
    const rentalCost = duration * 250 * rentalItemsCount * groupSize; // 250 INR per item per day

    // Transport Buffer (base local transport)
    const transportBuffer = 3000 * Math.ceil(groupSize / 4);

    const subTotal = guideCost + porterCost + foodAccommodationCost + agencyCost + permitCost + rentalCost + transportBuffer;
    
    // 10% contingency
    const contingency = subTotal * 0.1;

    const total = subTotal + contingency;
    const perPerson = total / groupSize;

    return {
      guideCost,
      porterCost,
      foodAccommodationCost,
      agencyCost,
      permitCost,
      rentalCost,
      transportBuffer,
      contingency,
      total,
      perPerson
    };
  }, [duration, groupSize, style, nationality, rentals]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Configuration Form */}
      <div className="lg:col-span-7 bg-surface border border-white/10 p-6 md:p-8 rounded-3xl">
        <h2 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" /> Configuration
        </h2>

        <div className="space-y-8">
          {/* Trek Selection */}
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2">Select Trek</label>
            <select 
              className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none"
              value={selectedTrekId}
              onChange={(e) => setSelectedTrekId(e.target.value)}
            >
              {allTreks.map(t => (
                <option key={t.slug} value={t.slug}>{t.title} ({t.duration})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2">Group Size</label>
              <div className="flex items-center gap-4 bg-[#121216] border border-white/10 rounded-xl px-4 py-3">
                <Users className="w-4 h-4 text-white/50" />
                <input 
                  type="number" 
                  min="1" 
                  max="20"
                  className="bg-transparent w-full text-white outline-none"
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2">Nationality</label>
              <select 
                className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary/50 outline-none"
                value={nationality}
                onChange={(e) => setNationality(e.target.value as Nationality)}
              >
                <option value="indian">Indian (INR)</option>
                <option value="foreigner">Foreign National</option>
              </select>
            </div>
          </div>

          {/* Trekking Style */}
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-3">Trekking Style</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button 
                onClick={() => setStyle("independent")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  style === "independent" ? 'bg-primary/10 border-primary/50 text-white' : 'bg-[#121216] border-white/5 text-white/60 hover:border-white/20'
                }`}
              >
                <Tent className="w-5 h-5 mb-2" />
                <div className="font-medium text-sm">Independent</div>
                <div className="text-xs mt-1 opacity-70">DIY logistics, no guide</div>
              </button>
              <button 
                onClick={() => setStyle("local_guide")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  style === "local_guide" ? 'bg-primary/10 border-primary/50 text-white' : 'bg-[#121216] border-white/5 text-white/60 hover:border-white/20'
                }`}
              >
                <MapPin className="w-5 h-5 mb-2" />
                <div className="font-medium text-sm">Local Guide</div>
                <div className="text-xs mt-1 opacity-70">Guide + Porters</div>
              </button>
              <button 
                onClick={() => setStyle("agency")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  style === "agency" ? 'bg-primary/10 border-primary/50 text-white' : 'bg-[#121216] border-white/5 text-white/60 hover:border-white/20'
                }`}
              >
                <Package className="w-5 h-5 mb-2" />
                <div className="font-medium text-sm">Full Agency</div>
                <div className="text-xs mt-1 opacity-70">All-inclusive package</div>
              </button>
            </div>
          </div>

          {/* Gear Rentals */}
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-3">Gear Rentals (Per Person)</label>
            <div className="flex flex-wrap gap-3">
              {Object.entries(rentals).map(([key, isSelected]) => (
                <button
                  key={key}
                  onClick={() => setRentals(prev => ({ ...prev, [key]: !isSelected }))}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    isSelected ? 'bg-primary/20 border-primary text-white' : 'bg-[#121216] border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Breakdown */}
      <div className="lg:col-span-5">
        <div className="bg-[#121216] border border-white/10 p-6 md:p-8 rounded-3xl sticky top-24">
          <h2 className="text-xl font-display font-semibold text-white mb-6">Estimated Cost</h2>
          
          <div className="mb-8">
            <div className="text-sm font-mono text-white/50 uppercase tracking-widest mb-1">Total for {groupSize} {groupSize === 1 ? 'person' : 'people'}</div>
            <div className="text-4xl md:text-5xl font-display font-semibold text-primary flex items-center">
              <IndianRupee className="w-8 h-8 md:w-10 md:h-10 mr-1" />
              {Math.round(breakdown.total).toLocaleString('en-IN')}
            </div>
            <div className="text-white/60 mt-2 font-light">
              ₹{Math.round(breakdown.perPerson).toLocaleString('en-IN')} per person
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="text-xs font-mono text-white/50 uppercase tracking-widest mb-4">Cost Breakdown</h3>
            
            {style === "agency" ? (
              <BreakdownRow label="Agency Package" amount={breakdown.agencyCost} />
            ) : (
              <>
                <BreakdownRow label="Food & Accommodation" amount={breakdown.foodAccommodationCost} />
                {style === "local_guide" && (
                  <>
                    <BreakdownRow label="Guide Fees" amount={breakdown.guideCost} />
                    <BreakdownRow label="Porter Fees" amount={breakdown.porterCost} />
                  </>
                )}
              </>
            )}
            <BreakdownRow label="Permits & Entry" amount={breakdown.permitCost} />
            {breakdown.rentalCost > 0 && (
              <BreakdownRow label="Gear Rentals" amount={breakdown.rentalCost} />
            )}
            <BreakdownRow label="Base Transport Buffer" amount={breakdown.transportBuffer} />
            <BreakdownRow label="10% Contingency" amount={breakdown.contingency} />
          </div>

          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-amber-500/80 text-xs font-light leading-relaxed">
              * This is an algorithmic estimate based on current market rates in Himachal Pradesh. Actual costs may vary depending on the season, exact transport route, and negotiation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, amount }: { label: string, amount: number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-white/70 font-light">{label}</span>
      <span className="text-white font-medium flex items-center">
        <IndianRupee className="w-3.5 h-3.5 mr-0.5 opacity-60" />
        {Math.round(amount).toLocaleString('en-IN')}
      </span>
    </div>
  );
}
