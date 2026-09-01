"use client";

import { useState, useMemo } from "react";
import { Trek } from "@/data/types";
import Link from "next/link";
import { ChevronRight, Map, Mountain, Calendar } from "lucide-react";
import { TrekPreferences, scoreTrek } from "@/lib/scoring";

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export function TrekFinderClient({ allTreks }: { allTreks: Trek[] }) {
  const [prefs, setPrefs] = useState<TrekPreferences>({
    experience: "any",
    fitness: "any",
    month: "any",
    duration: "any",
    region: "any",
    maxAltitude: "any",
    budget: "any",
  });

  const handleSelect = (field: keyof TrekPreferences, value: string) => {
    setPrefs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const scored = allTreks.map((t) => scoreTrek(t, prefs));
    // Sort by score descending
    return scored.sort((a, b) => b.score - a.score).filter(r => r.score > 40); // Only show relevant
  }, [allTreks, prefs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Configuration Form */}
      <div className="lg:col-span-4 bg-surface border border-white/10 p-6 rounded-3xl h-fit">
        <h2 className="text-xl font-display font-semibold text-white mb-6">Your Preferences</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2">Experience</label>
            <select 
              className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary/50 outline-none"
              value={prefs.experience}
              onChange={(e) => handleSelect("experience", e.target.value)}
            >
              <option value="any">Any Experience</option>
              <option value="beginner">Beginner (First timer)</option>
              <option value="intermediate">Intermediate (Done a few treks)</option>
              <option value="advanced">Advanced (Experienced high altitude)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2">Fitness</label>
            <select 
              className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary/50 outline-none"
              value={prefs.fitness}
              onChange={(e) => handleSelect("fitness", e.target.value)}
            >
              <option value="any">Any Fitness Level</option>
              <option value="average">Average (Walk occasionally)</option>
              <option value="active">Active (Workout regularly)</option>
              <option value="very_active">Very Active (Athlete level)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2">Month</label>
            <select 
              className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary/50 outline-none"
              value={prefs.month}
              onChange={(e) => handleSelect("month", e.target.value)}
            >
              <option value="any">Any Month</option>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2">Duration</label>
            <select 
              className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary/50 outline-none"
              value={prefs.duration}
              onChange={(e) => handleSelect("duration", e.target.value)}
            >
              <option value="any">Any Duration</option>
              <option value="short">Short (1-3 Days)</option>
              <option value="medium">Medium (4-6 Days)</option>
              <option value="long">Long (7+ Days)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2">Max Altitude</label>
            <select 
              className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary/50 outline-none"
              value={prefs.maxAltitude}
              onChange={(e) => handleSelect("maxAltitude", e.target.value)}
            >
              <option value="any">Any Altitude</option>
              <option value="low">Below 3,000m</option>
              <option value="medium">Up to 4,000m</option>
              <option value="high">Up to 5,000m</option>
              <option value="extreme">Above 5,000m</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-8 space-y-6">
        <h2 className="text-xl font-display font-semibold text-white mb-6">
          Recommended Treks <span className="text-white/50 font-sans font-light text-sm ml-2">Based on your preferences and available data.</span>
        </h2>

        {results.length === 0 && (
          <div className="bg-surface border border-white/10 rounded-3xl p-10 text-center">
            <p className="text-white/60 mb-2">No strong matches found for these exact criteria.</p>
            <button onClick={() => setPrefs({ experience: "any", fitness: "any", month: "any", duration: "any", region: "any", maxAltitude: "any", budget: "any"})} className="text-primary hover:underline">Clear filters</button>
          </div>
        )}

        {results.map(({ trek, score, reasons }) => (
          <Link href={`/explore/himachal-pradesh/kullu/${trek.slug}`} key={trek.slug} className="block group">
            <div className="bg-surface hover:bg-[#121216] border border-white/10 hover:border-primary/40 rounded-3xl p-6 transition-all duration-300 shadow-xl flex flex-col md:flex-row gap-6 items-start md:items-center">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    score >= 90 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                    score >= 70 ? 'bg-primary/10 text-primary border border-primary/20' : 
                    'bg-white/10 text-white/60 border border-white/20'
                  }`}>
                    {score}% Match
                  </span>
                  <span className="text-white/40 text-xs font-mono">{trek.difficulty}</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-display font-semibold text-white group-hover:text-primary transition-colors mb-2">
                  {trek.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-white/60 mb-4 font-light">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {trek.duration}</span>
                  <span className="flex items-center gap-1"><Mountain className="w-3.5 h-3.5" /> {trek.maxAltitude}</span>
                  <span className="flex items-center gap-1"><Map className="w-3.5 h-3.5" /> {trek.region}</span>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1.5">Why this matches:</p>
                  <ul className="text-sm text-white/70 space-y-1 font-light">
                    {reasons.slice(0, 3).map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary/70 mt-0.5">•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="hidden md:flex bg-primary/10 rounded-full w-12 h-12 items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
