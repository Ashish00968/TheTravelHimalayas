"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Search, Compass, Mountain, MapPin, BookOpen, ShieldAlert, Filter } from "lucide-react";
import { searchContent } from "@/lib/search";

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("Any");
  const [difficulty, setDifficulty] = useState("Any");
  const [duration, setDuration] = useState("Any");
  const [altitude, setAltitude] = useState("Any");

  const [showFilters, setShowFilters] = useState(false);

  const results = searchContent({
    query,
    region,
    difficulty,
    duration,
    altitude
  });

  const grouped = {
    trek: results.filter((r) => r.category === "trek"),
    peak: results.filter((r) => r.category === "peak"),
    destination: results.filter((r) => r.category === "destination"),
    guide: results.filter((r) => r.category === "guide"),
    safety: results.filter((r) => r.category === "safety"),
  };

  const isFilterActive = region !== "Any" || difficulty !== "Any" || duration !== "Any" || altitude !== "Any";

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col">
      <div className="container mx-auto px-6 py-6 flex flex-col max-w-4xl gap-4">
        
        {/* Main Search Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search treks, peaks, valleys, guides..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-lg placeholder:text-white/40 focus:outline-none focus:border-primary/50 font-light transition-all"
              autoFocus
            />
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-4 p-2 rounded-xl transition-colors ${showFilters || isFilterActive ? 'bg-primary/20 text-primary' : 'bg-transparent text-white/50 hover:text-white'}`}
              title="Toggle Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-4 rounded-2xl bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="flex flex-wrap gap-4 pt-2 pb-4 border-b border-white/10">
            {/* Region Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 px-1">Region</label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
              >
                <option value="Any">Any Region</option>
                <option value="Kullu">Kullu & Manali</option>
                <option value="Spiti">Spiti Valley</option>
                <option value="Lahaul">Lahaul</option>
                <option value="Kinnaur">Kinnaur</option>
                <option value="Kangra">Kangra</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 px-1">Difficulty</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
              >
                <option value="Any">Any Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Difficult">Difficult</option>
                <option value="Strenuous">Strenuous</option>
              </select>
            </div>

            {/* Duration Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 px-1">Duration</label>
              <select 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
              >
                <option value="Any">Any Duration</option>
                <option value="1-3">1-3 Days (Short)</option>
                <option value="4-7">4-7 Days (Standard)</option>
                <option value="8+">8+ Days (Expedition)</option>
              </select>
            </div>

            {/* Altitude Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 px-1">Max Altitude</label>
              <select 
                value={altitude} 
                onChange={(e) => setAltitude(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
              >
                <option value="Any">Any Altitude</option>
                <option value="<3000">Below 3,000m</option>
                <option value="3000-4500">3,000m - 4,500m</option>
                <option value=">4500">Above 4,500m</option>
              </select>
            </div>

            {isFilterActive && (
              <div className="flex flex-col gap-1.5 justify-end">
                <button 
                  onClick={() => {
                    setRegion("Any");
                    setDifficulty("Any");
                    setDuration("Any");
                    setAltitude("Any");
                  }}
                  className="px-3 py-2 text-sm font-mono text-white/40 hover:text-white transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto container mx-auto px-6 pb-8 max-w-4xl">
        {query.trim() === "" && !isFilterActive ? (
          <div className="text-center mt-20 space-y-2">
            <p className="text-white/50 text-base font-light">
              Start typing to search Himalayan trails, summits, and guides...
            </p>
            <p className="text-white/30 text-xs font-mono">
              e.g. &ldquo;Beas Kund&rdquo;, &ldquo;Friendship Peak&rdquo;, &ldquo;Spiti&rdquo;, &ldquo;Permits&rdquo;
            </p>
          </div>
        ) : results.length === 0 ? (
          <p className="text-white/50 text-center mt-20 font-light">
            No results found matching your criteria.
          </p>
        ) : (
          <div className="space-y-8 mt-4">
            {grouped.trek.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" /> Treks &amp; Trails ({grouped.trek.length})
                </h3>
                <div className="space-y-2">
                  {grouped.trek.map((r) => (
                    <Link
                      key={r.slug}
                      href={r.href}
                      onClick={onClose}
                      className="block p-4 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
                    >
                      <span className="text-white font-medium block text-base group-hover:text-primary transition-colors">
                        {r.title}
                      </span>
                      {r.subtitle && (
                        <span className="text-xs text-white/40 font-mono mt-1 block">
                          {r.subtitle}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {grouped.peak.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Mountain className="w-3.5 h-3.5" /> Peaks &amp; Summits ({grouped.peak.length})
                </h3>
                <div className="space-y-2">
                  {grouped.peak.map((r) => (
                    <Link
                      key={r.slug}
                      href={r.href}
                      onClick={onClose}
                      className="block p-4 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
                    >
                      <span className="text-white font-medium block text-base group-hover:text-primary transition-colors">
                        {r.title}
                      </span>
                      {r.subtitle && (
                        <span className="text-xs text-white/40 font-mono mt-1 block">
                          {r.subtitle}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {grouped.destination.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Valleys &amp; Sanctuaries ({grouped.destination.length})
                </h3>
                <div className="space-y-2">
                  {grouped.destination.map((r) => (
                    <Link
                      key={r.slug}
                      href={r.href}
                      onClick={onClose}
                      className="block p-4 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
                    >
                      <span className="text-white font-medium block text-base group-hover:text-primary transition-colors">
                        {r.title}
                      </span>
                      {r.subtitle && (
                        <span className="text-xs text-white/40 font-mono mt-1 block">
                          {r.subtitle}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {grouped.guide.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> Field Guides ({grouped.guide.length})
                </h3>
                <div className="space-y-2">
                  {grouped.guide.map((r) => (
                    <Link
                      key={r.slug}
                      href={r.href}
                      onClick={onClose}
                      className="block p-4 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
                    >
                      <span className="text-white font-medium block text-base group-hover:text-primary transition-colors">
                        {r.title}
                      </span>
                      {r.subtitle && (
                        <span className="text-xs text-white/40 font-mono mt-1 block">
                          {r.subtitle}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {grouped.safety.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-semibold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5" /> Mountain Safety &amp; Terms ({grouped.safety.length})
                </h3>
                <div className="space-y-2">
                  {grouped.safety.map((r) => (
                    <Link
                      key={r.slug}
                      href={r.href}
                      onClick={onClose}
                      className="block p-4 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-primary/30 transition-all group"
                    >
                      <span className="text-white font-medium block text-base group-hover:text-primary transition-colors">
                        {r.title}
                      </span>
                      {r.subtitle && (
                        <span className="text-xs text-white/40 font-mono mt-1 block">
                          {r.subtitle}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
