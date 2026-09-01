import { himalayaAtlas } from "@/data/atlas";
import { guides } from "@/data/guides";
import { ALTITUDE_ILLNESSES, GLOSSARY_TERMS, SAFETY_PROTOCOLS } from "@/data/mountain-safety";
import { treks } from "@/data/treks";
import { parseAltitude, parseDuration } from "@/lib/scoring";

export interface SearchResult {
  title: string;
  slug: string;
  category: "trek" | "peak" | "destination" | "guide" | "safety";
  href: string;
  subtitle?: string;
}

export interface SearchFilters {
  query: string;
  region?: string;
  difficulty?: string;
  duration?: string; // "1-3", "4-7", "8+"
  altitude?: string; // "<3000", "3000-4500", ">4500"
}

export function searchContent(filters: SearchFilters): SearchResult[] {
  const { query, region, difficulty, duration, altitude } = filters;
  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // 1. Search Treks (with facets)
  treks.forEach((trek) => {
    // Basic Text Match
    const matchesText = 
      !normalizedQuery || 
      trek.title.toLowerCase().includes(normalizedQuery) ||
      trek.overview.toLowerCase().includes(normalizedQuery) ||
      trek.region.toLowerCase().includes(normalizedQuery);

    if (!matchesText) return;

    // Facet Matches
    if (difficulty && difficulty !== "Any" && trek.difficulty.toLowerCase() !== difficulty.toLowerCase()) return;
    
    if (region && region !== "Any" && !trek.region.toLowerCase().includes(region.toLowerCase())) return;

    if (duration && duration !== "Any") {
      const days = parseDuration(trek.duration);
      if (duration === "1-3" && days > 3) return;
      if (duration === "4-7" && (days < 4 || days > 7)) return;
      if (duration === "8+" && days < 8) return;
    }

    if (altitude && altitude !== "Any") {
      const alt = parseAltitude(trek.maxAltitude);
      if (altitude === "<3000" && alt >= 3000) return;
      if (altitude === "3000-4500" && (alt < 3000 || alt > 4500)) return;
      if (altitude === ">4500" && alt <= 4500) return;
    }

    results.push({
      title: trek.title,
      slug: trek.slug,
      category: "trek",
      // Inferring region ID for href. Assuming himachal-pradesh/kullu for all currently in DB.
      // This is a simplification based on the current dataset where all are Kullu-Manali.
      href: `/explore/himachal-pradesh/kullu/${trek.slug}`,
      subtitle: `${trek.duration} • ${trek.difficulty} • ${trek.maxAltitude}`,
    });
  });

  // 2. Search Atlas places (Peaks and Destinations, excluding Treks which we handled above)
  // Non-trek entities don't have the same strict facets, so if strict facets are active, we might filter them out, 
  // but for a rich search, if a user selects "Difficulty: Easy", it only applies to treks.
  // We'll hide non-treks if specific trek-only facets are active to avoid confusion, 
  // OR we just return them if they match the region/query. Let's hide them if difficulty/duration is set.
  const isTrekFacetActive = (difficulty && difficulty !== "Any") || (duration && duration !== "Any") || (altitude && altitude !== "Any");

  if (!isTrekFacetActive) {
    himalayaAtlas.forEach((atlasRegion) => {
      // Check region facet
      if (region && region !== "Any" && !atlasRegion.name.toLowerCase().includes(region.toLowerCase())) return;

      atlasRegion.subregions.forEach((sub) => {
        sub.places.forEach((place) => {
          if (place.type === "trek" || place.type === "day-hike") return; // Handled natively above
          
          const matchesText = 
            !normalizedQuery || 
            place.name.toLowerCase().includes(normalizedQuery) ||
            (place.overview && place.overview.toLowerCase().includes(normalizedQuery)) ||
            place.type.toLowerCase().includes(normalizedQuery);

          if (matchesText) {
            results.push({
              title: place.name,
              slug: place.id,
              category: place.type === "peak" ? "peak" : "destination",
              href: `/explore/${atlasRegion.id}/${sub.id}/${place.id}`,
              subtitle: `${sub.name}, ${atlasRegion.name}`,
            });
          }
        });
      });
    });

    // 3. Search across Guides
    if (!region || region === "Any") {
      guides.forEach((g) => {
        if (
          !normalizedQuery ||
          g.title.toLowerCase().includes(normalizedQuery) ||
          g.description.toLowerCase().includes(normalizedQuery) ||
          g.category.toLowerCase().includes(normalizedQuery)
        ) {
          results.push({
            title: g.title,
            slug: g.slug,
            category: "guide",
            href: `/guides/${g.slug}`,
            subtitle: `${g.category} Guide`,
          });
        }
      });
    }

    // 4. Search across Altitude & Safety
    if (!region || region === "Any") {
      ALTITUDE_ILLNESSES.forEach((ill) => {
        if (
          !normalizedQuery ||
          ill.name.toLowerCase().includes(normalizedQuery) ||
          ill.overview.toLowerCase().includes(normalizedQuery)
        ) {
          results.push({
            title: ill.name,
            slug: ill.id,
            category: "safety",
            href: `/safety`,
            subtitle: `Altitude Medicine (${ill.severity})`,
          });
        }
      });

      SAFETY_PROTOCOLS.forEach((sp) => {
        if (
          !normalizedQuery ||
          sp.title.toLowerCase().includes(normalizedQuery) ||
          (sp.overview && sp.overview.toLowerCase().includes(normalizedQuery))
        ) {
          results.push({
            title: sp.title,
            slug: sp.id,
            category: "safety",
            href: `/safety`,
            subtitle: "Safety & Emergency Protocol",
          });
        }
      });

      GLOSSARY_TERMS.forEach((term) => {
        if (
          !normalizedQuery ||
          term.term.toLowerCase().includes(normalizedQuery) ||
          term.definition.toLowerCase().includes(normalizedQuery) ||
          (term.localTerm && term.localTerm.toLowerCase().includes(normalizedQuery))
        ) {
          results.push({
            title: term.term,
            slug: term.term.toLowerCase().replace(/\s+/g, "-"),
            category: "safety",
            href: `/safety`,
            subtitle: `Glossary (${term.category})`,
          });
        }
      });
    }
  }

  // If there's no query AND no active filters, we might return everything. Let's limit or return empty to avoid massive lists initially.
  if (!normalizedQuery && region === "Any" && difficulty === "Any" && duration === "Any" && altitude === "Any") {
    return [];
  }

  return results;
}
