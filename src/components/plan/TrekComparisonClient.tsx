"use client";

import { useState } from "react";
import { Trek } from "@/data/types";
import { placeLocationIndex } from "@/data/atlas";
import { Mountain, Calendar, Activity, MapPin, Route, ChevronRight } from "lucide-react";
import Link from "next/link";

export function TrekComparisonClient({ allTreks }: { allTreks: Trek[] }) {
  const [trek1Id, setTrek1Id] = useState<string>(allTreks[0]?.slug || "");
  const [trek2Id, setTrek2Id] = useState<string>(allTreks.length > 1 ? allTreks[1].slug : allTreks[0]?.slug || "");

  const trek1 = allTreks.find(t => t.slug === trek1Id);
  const trek2 = allTreks.find(t => t.slug === trek2Id);

  const trek1Href = trek1 ? (placeLocationIndex.get(trek1.slug)?.href || `/explore/himachal-pradesh/kullu/${trek1.slug}`) : "#";
  const trek2Href = trek2 ? (placeLocationIndex.get(trek2.slug)?.href || `/explore/himachal-pradesh/kullu/${trek2.slug}`) : "#";

  return (
    <div className="space-y-12">
      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-mono text-foreground/50 uppercase tracking-widest pl-2">Select Trek 1</label>
          <select 
            className="w-full bg-card border border-border hover:border-primary/50 rounded-2xl px-6 py-4 text-foreground text-lg font-display focus:border-primary outline-none transition-colors shadow-sm"
            value={trek1Id}
            onChange={(e) => setTrek1Id(e.target.value)}
          >
            {allTreks.map(t => (
              <option key={t.slug} value={t.slug} disabled={t.slug === trek2Id}>{t.title}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono text-foreground/50 uppercase tracking-widest pl-2">Select Trek 2</label>
          <select 
            className="w-full bg-card border border-border hover:border-primary/50 rounded-2xl px-6 py-4 text-foreground text-lg font-display focus:border-primary outline-none transition-colors shadow-sm"
            value={trek2Id}
            onChange={(e) => setTrek2Id(e.target.value)}
          >
            {allTreks.map(t => (
              <option key={t.slug} value={t.slug} disabled={t.slug === trek1Id}>{t.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      {trek1 && trek2 && (
        <div className="glass-museum-card border border-border rounded-3xl overflow-hidden shadow-md">
          {/* Header Row */}
          <div className="grid grid-cols-2 border-b border-border divide-x divide-border">
            <div className="p-4 sm:p-6 md:p-8 text-center bg-foreground/[0.02]">
              <h3 className="text-base sm:text-xl md:text-2xl font-display font-semibold text-foreground mb-1 sm:mb-2">{trek1.title}</h3>
              <p className="text-foreground/60 font-light text-xs sm:text-sm">{trek1.region}</p>
            </div>
            <div className="p-4 sm:p-6 md:p-8 text-center bg-foreground/[0.02]">
              <h3 className="text-base sm:text-xl md:text-2xl font-display font-semibold text-foreground mb-1 sm:mb-2">{trek2.title}</h3>
              <p className="text-foreground/60 font-light text-xs sm:text-sm">{trek2.region}</p>
            </div>
          </div>

          {/* Stats Rows */}
          <div className="divide-y divide-border/60">
            <ComparisonRow 
              icon={<Activity />} 
              label="Difficulty"
              val1={trek1.difficulty}
              val2={trek2.difficulty}
              highlight={
                trek1.difficulty === "Easy" || trek1.difficulty === "Moderate" ? 1 :
                trek2.difficulty === "Easy" || trek2.difficulty === "Moderate" ? 2 : 0
              }
            />
            <ComparisonRow 
              icon={<Calendar />} 
              label="Duration"
              val1={trek1.duration}
              val2={trek2.duration}
            />
            <ComparisonRow 
              icon={<Mountain />} 
              label="Max Altitude"
              val1={trek1.maxAltitude}
              val2={trek2.maxAltitude}
            />
            <ComparisonRow 
              icon={<Route />} 
              label="Distance"
              val1={trek1.distance}
              val2={trek2.distance}
            />
            <ComparisonRow 
              icon={<Calendar className="text-primary/70" />} 
              label="Best Season"
              val1={trek1.bestSeason}
              val2={trek2.bestSeason}
            />
            <ComparisonRow 
              icon={<MapPin />} 
              label="Trailhead"
              val1={trek1.startPoint || "Not specified"}
              val2={trek2.startPoint || "Not specified"}
            />
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 divide-x divide-border border-t border-border bg-foreground/[0.02]">
            <div className="p-6 flex justify-center">
              <Link 
                href={trek1Href} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground/[0.04] hover:bg-primary hover:text-white border border-border rounded-full text-foreground text-sm font-medium transition-all shadow-sm"
              >
                View {trek1.title} Guide <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 flex justify-center">
              <Link 
                href={trek2Href} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground/[0.04] hover:bg-primary hover:text-white border border-border rounded-full text-foreground text-sm font-medium transition-all shadow-sm"
              >
                View {trek2.title} Guide <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComparisonRow({ 
  icon, 
  label, 
  val1, 
  val2,
  highlight = 0
}: { 
  icon: React.ReactNode; 
  label: string; 
  val1: string; 
  val2: string;
  highlight?: 0 | 1 | 2;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 items-center hover:bg-foreground/[0.02] transition-colors relative">
      <div className="md:col-span-2 p-4 md:p-6 flex flex-col md:flex-row items-center gap-3 text-foreground/50 border-b md:border-b-0 border-border/60">
        <div className="p-2 bg-foreground/[0.05] rounded-xl text-foreground/70">
          {icon}
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-center md:text-left">{label}</span>
      </div>
      
      <div className="md:col-span-5 p-6 md:border-l border-border/60 text-center md:text-left flex flex-col justify-center border-b md:border-b-0">
        <span className={`text-lg font-light ${highlight === 1 ? 'text-primary font-medium' : 'text-foreground'}`}>
          {val1}
        </span>
      </div>

      <div className="md:col-span-5 p-6 md:border-l border-border/60 text-center md:text-left flex flex-col justify-center">
        <span className={`text-lg font-light ${highlight === 2 ? 'text-primary font-medium' : 'text-foreground'}`}>
          {val2}
        </span>
      </div>
    </div>
  );
}
