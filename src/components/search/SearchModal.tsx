"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Search } from "lucide-react";
import { searchContent, SearchResult } from "@/lib/search";

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const results = searchContent(query);

  const grouped = {
    trek: results.filter((r) => r.category === "trek"),
    peak: results.filter((r) => r.category === "peak"),
    "day-hike": results.filter((r) => r.category === "day-hike"),
    guide: results.filter((r) => r.category === "guide"),
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col">
      <div className="container mx-auto px-4 py-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search treks, peaks, hikes, guides..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-foreground text-lg placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        </div>
        <button
          onClick={onClose}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors"
          aria-label="Close search"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto container mx-auto px-4 pb-8">
        {query.trim() === "" ? (
          <p className="text-foreground/50 text-center mt-20">
            Start typing to search...
          </p>
        ) : results.length === 0 ? (
          <p className="text-foreground/50 text-center mt-20">
            No results found for &ldquo;{query}&rdquo;
          </p>
        ) : (
          <div className="space-y-8">
            {grouped.trek.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-3">
                  Treks
                </h3>
                {grouped.trek.map((r) => (
                  <Link
                    key={r.slug}
                    href={`${r.basePath}/${r.slug}`}
                    onClick={onClose}
                    className="block py-3 min-h-[44px] text-foreground hover:text-primary transition-colors"
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            )}
            {grouped.peak.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-3">
                  Peaks
                </h3>
                {grouped.peak.map((r) => (
                  <Link
                    key={r.slug}
                    href={`${r.basePath}/${r.slug}`}
                    onClick={onClose}
                    className="block py-3 min-h-[44px] text-foreground hover:text-primary transition-colors"
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            )}
            {grouped["day-hike"].length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-3">
                  Day Hikes
                </h3>
                {grouped["day-hike"].map((r) => (
                  <Link
                    key={r.slug}
                    href={`${r.basePath}/${r.slug}`}
                    onClick={onClose}
                    className="block py-3 min-h-[44px] text-foreground hover:text-primary transition-colors"
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            )}
            {grouped.guide.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-3">
                  Guides
                </h3>
                {grouped.guide.map((r) => (
                  <Link
                    key={r.slug}
                    href={`${r.basePath}/${r.slug}`}
                    onClick={onClose}
                    className="block py-3 min-h-[44px] text-foreground hover:text-primary transition-colors"
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
