"use client";

import { useState } from "react";
import { Trek } from "@/data/types";
import { Mountain, Calendar, Activity, MapPin, Route, ChevronRight } from "lucide-react";
import Link from "next/link";

export function TrekComparisonClient({ allTreks }: { allTreks: Trek[] }) {
  const [trek1Id, setTrek1Id] = useState<string>(allTreks[0]?.slug || "");
  const [trek2Id, setTrek2Id] = useState<string>(allTreks.length > 1 ? allTreks[1].slug : allTreks[0]?.slug || "");

  const trek1 = allTreks.find(t => t.slug === trek1Id);
  const trek2 = allTreks.find(t => t.slug === trek2Id);

  return (
    <div className="space-y-12">
      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-mono text-white/50 uppercase tracking-widest pl-2">Select Trek 1</label>
          <select 
            className="w-full bg-surface border border-white/10 hover:border-white/30 rounded-2xl px-6 py-4 text-white text-lg font-display focus:border-primary outline-none transition-colors"
            value={trek1Id}
            onChange={(e) => setTrek1Id(e.target.value)}
          >
            {allTreks.map(t => (
              <option key={t.slug} value={t.slug} disabled={t.slug === trek2Id}>{t.title}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono text-white/50 uppercase tracking-widest pl-2">Select Trek 2</label>
          <select 
            className="w-full bg-surface border border-white/10 hover:border-white/30 rounded-2xl px-6 py-4 text-white text-lg font-display focus:border-primary outline-none transition-colors"
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
        <div className="bg-surface border border-white/10 rounded-3xl overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-2 border-b border-white/10 divide-x divide-white/10">
            <div className="p-8 text-center bg-white/5">
              <h3 className="text-2xl font-display font-semibold text-white mb-2">{trek1.title}</h3>
              <p className="text-white/60 font-light text-sm">{trek1.region}</p>
            </div>
            <div className="p-8 text-center bg-white/5">
              <h3 className="text-2xl font-display font-semibold text-white mb-2">{trek2.title}</h3>
              <p className="text-white/60 font-light text-sm">{trek2.region}</p>
            </div>
          </div>

          {/* Stats Rows */}
          <div className="divide-y divide-white/5">
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
          <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 bg-white/5">
            <div className="p-6 flex justify-center">
              <Link 
                href={`/explore/himachal-pradesh/kullu/${trek1.slug}`} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-sm font-medium transition-all"
              >
                View {trek1.title} Guide <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 flex justify-center">
              <Link 
                href={`/explore/himachal-pradesh/kullu/${trek2.slug}`} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-sm font-medium transition-all"
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
    <div className="grid grid-cols-1 md:grid-cols-12 items-center hover:bg-white/[0.02] transition-colors relative">
      <div className="md:col-span-2 p-4 md:p-6 flex flex-col md:flex-row items-center gap-3 text-white/50 border-b md:border-b-0 border-white/5">
        <div className="p-2 bg-white/5 rounded-xl text-white/70">
          {icon}
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-center md:text-left">{label}</span>
      </div>
      
      <div className="md:col-span-5 p-6 md:border-l border-white/5 text-center md:text-left flex flex-col justify-center border-b md:border-b-0">
        <span className={`text-lg font-light ${highlight === 1 ? 'text-primary font-medium' : 'text-white'}`}>
          {val1}
        </span>
      </div>

      <div className="md:col-span-5 p-6 md:border-l border-white/5 text-center md:text-left flex flex-col justify-center">
        <span className={`text-lg font-light ${highlight === 2 ? 'text-primary font-medium' : 'text-white'}`}>
          {val2}
        </span>
      </div>
    </div>
  );
}
