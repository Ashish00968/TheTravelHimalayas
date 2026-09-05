"use client";

import { useState, useMemo } from "react";
import { Trek } from "@/data/types";
import { placeLocationIndex } from "@/data/atlas";
import { Calendar, Thermometer, CloudRain, Snowflake, Sun, Map, Mountain, ChevronRight } from "lucide-react";
import Link from "next/link";

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const SEASON_INFO: Record<string, { title: string, temp: string, conditions: string, icon: React.ReactNode, color: string }> = {
  "January": { title: "Peak Winter", temp: "-15°C to 5°C", conditions: "Deep snow, frozen trails. Most high passes closed. Suitable for low-altitude snow treks or frozen river expeditions.", icon: <Snowflake />, color: "text-blue-500" },
  "February": { title: "Late Winter", temp: "-10°C to 8°C", conditions: "Heavy snow accumulation. Trails remain frozen. Excellent for winter wonderland experiences at lower altitudes.", icon: <Snowflake />, color: "text-blue-500" },
  "March": { title: "Early Spring", temp: "-5°C to 15°C", conditions: "Snow begins melting. Rhododendrons start blooming. Clear skies and crisp views. Passes still blocked.", icon: <Sun />, color: "text-emerald-500" },
  "April": { title: "Spring", temp: "0°C to 20°C", conditions: "Lush valleys, blooming flowers, and moderate temperatures. High altitude camps still have snow.", icon: <Sun />, color: "text-emerald-500" },
  "May": { title: "Pre-Monsoon / Summer", temp: "5°C to 25°C", conditions: "Warmest month. High passes start opening. Ideal for high-altitude expeditions. Snow at summits.", icon: <Sun />, color: "text-amber-500" },
  "June": { title: "Summer", temp: "10°C to 25°C", conditions: "Excellent conditions before the rains. Snow melts rapidly. Very popular for crossing major passes.", icon: <Sun />, color: "text-amber-500" },
  "July": { title: "Monsoon", temp: "15°C to 22°C", conditions: "Heavy rainfall in lower ranges. Slippery trails, leeches, and landslides. Head to rain-shadow regions (Spiti/Ladakh).", icon: <CloudRain />, color: "text-blue-600" },
  "August": { title: "Peak Monsoon", temp: "15°C to 22°C", conditions: "Continuous rain in Himachal/Uttarakhand. Valley of Flowers is blooming. Spiti and Zanskar are dry and perfect.", icon: <CloudRain />, color: "text-blue-600" },
  "September": { title: "Post-Monsoon / Autumn", temp: "5°C to 20°C", conditions: "Rains stop. Valleys are lush green. Safest trails and clearest skies. The absolute best time for trekking.", icon: <Sun />, color: "text-orange-500" },
  "October": { title: "Autumn", temp: "0°C to 15°C", conditions: "Crisp, cold air. Phenomenal visibility and golden landscapes. Temperatures drop rapidly towards month-end.", icon: <Sun />, color: "text-orange-500" },
  "November": { title: "Early Winter", temp: "-5°C to 10°C", conditions: "Dry and cold. Trails are quiet. High altitude lakes begin to freeze. No fresh snow yet, but very chilly nights.", icon: <Thermometer />, color: "text-blue-400" },
  "December": { title: "Winter", temp: "-10°C to 5°C", conditions: "First heavy snowfalls. High passes close for the season. Clear skies but extremely cold.", icon: <Snowflake />, color: "text-blue-400" },
};

export function SeasonFinderClient({ allTreks }: { allTreks: Trek[] }) {
  const [selectedMonth, setSelectedMonth] = useState<string>("September");

  const info = SEASON_INFO[selectedMonth];

  const matchingTreks = useMemo(() => {
    return allTreks.filter(t => {
      const season = t.bestSeason.toLowerCase();
      const month = selectedMonth.toLowerCase();
      return season.includes(month) || season.includes("year-round") || season.includes("all year");
    });
  }, [allTreks, selectedMonth]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Month Selector Sidebar */}
      <div className="lg:col-span-3">
        <div className="glass-museum-card border border-border rounded-3xl overflow-hidden sticky top-24 shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Months
            </h2>
          </div>
          <div className="flex flex-col">
            {MONTHS.map((month) => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`text-left px-6 py-4 border-b border-border/50 transition-all text-sm font-mono tracking-wider uppercase last:border-b-0 ${
                  selectedMonth === month 
                    ? 'bg-primary/10 text-primary font-semibold border-l-2 border-l-primary' 
                    : 'text-foreground/60 hover:bg-foreground/[0.04] hover:text-foreground border-l-2 border-l-transparent'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-9 space-y-8">
        
        {/* Conditions Card */}
        <div className="glass-museum-card border border-border rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden shadow-md">
          <div className={`absolute top-0 right-0 p-12 opacity-5 ${info.color}`}>
            <div className="scale-[4] origin-top-right">{info.icon}</div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`p-2 rounded-xl bg-foreground/[0.05] ${info.color}`}>
                {info.icon}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
                {selectedMonth} in the Himalayas
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-card border border-border/70 p-6 rounded-2xl shadow-sm">
                <div className="text-xs font-mono text-foreground/50 uppercase tracking-widest mb-2">Climate Phase</div>
                <div className="text-xl text-foreground font-medium">{info.title}</div>
              </div>
              <div className="bg-card border border-border/70 p-6 rounded-2xl shadow-sm">
                <div className="text-xs font-mono text-foreground/50 uppercase tracking-widest mb-2">Avg Trail Temp</div>
                <div className="text-xl text-foreground font-medium">{info.temp}</div>
              </div>
            </div>

            <div className="mt-6 bg-card border border-border/70 p-6 rounded-2xl shadow-sm">
              <div className="text-xs font-mono text-foreground/50 uppercase tracking-widest mb-3">Trail Conditions</div>
              <p className="text-foreground/80 font-light leading-relaxed">
                {info.conditions}
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Treks */}
        <div>
          <h3 className="text-xl font-display font-semibold text-foreground mb-6">
            Recommended for {selectedMonth} <span className="text-foreground/50 font-sans font-light text-sm ml-2">({matchingTreks.length} treks)</span>
          </h3>

          {matchingTreks.length === 0 ? (
            <div className="glass-museum-card border border-border rounded-3xl p-10 text-center">
              <p className="text-foreground/60">No recommended treks found for this specific month in the current database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchingTreks.map(trek => {
                const trekHref = placeLocationIndex.get(trek.slug)?.href || `/explore/himachal-pradesh/kullu/${trek.slug}`;
                return (
                  <Link href={trekHref} key={trek.slug} className="block group">
                    <div className="bg-card hover:bg-muted/40 border border-border hover:border-primary/40 rounded-3xl p-6 transition-all duration-300 shadow-md hover:shadow-xl h-full flex flex-col justify-between">
                      
                      <div>
                        <h4 className="text-xl font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-3">
                          {trek.title}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-foreground/60 mb-4">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {trek.duration}</span>
                          <span className="flex items-center gap-1.5"><Mountain className="w-3 h-3" /> {trek.maxAltitude}</span>
                          <span className="flex items-center gap-1.5"><Map className="w-3 h-3" /> {trek.region}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/60 mt-4">
                        <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">View Guide</span>
                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
