import { himalayaAtlas, placeLocationIndex } from "@/data/atlas";
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

// ── Pre-built trek → href lookup (O(1) per trek) ───────────────────────────
// Resolves each trek slug to its correct /explore/[state]/[division]/[slug] path
// from the atlas rather than hard-coding a single region.
const trekHrefIndex = new Map<string, string>(
  treks.map((t) => {
    const loc = placeLocationIndex.get(t.slug);
    const href = loc
      ? `/explore/${loc.regionId}/${loc.subRegionId}/${t.slug}`
      : `/explore/himachal-pradesh/kullu/${t.slug}`; // safe fallback for treks not yet in atlas
    return [t.slug, href];
  })
);

export function searchContent(filters: SearchFilters): SearchResult[] {
  const { query, region, difficulty, duration, altitude } = filters;
  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // 1. Search Treks (with facets)
  for (const trek of treks) {
    // Text match
    const matchesText =
      !normalizedQuery ||
      trek.title.toLowerCase().includes(normalizedQuery) ||
      trek.overview.toLowerCase().includes(normalizedQuery) ||
      trek.region.toLowerCase().includes(normalizedQuery);

    if (!matchesText) continue;

    // Facet guards
    if (difficulty && difficulty !== "Any" && trek.difficulty.toLowerCase() !== difficulty.toLowerCase()) continue;
    if (region && region !== "Any" && !trek.region.toLowerCase().includes(region.toLowerCase())) continue;

    if (duration && duration !== "Any") {
      const days = parseDuration(trek.duration);
      if (duration === "1-3" && days > 3) continue;
      if (duration === "4-7" && (days < 4 || days > 7)) continue;
      if (duration === "8+" && days < 8) continue;
    }

    if (altitude && altitude !== "Any") {
      const alt = parseAltitude(trek.maxAltitude);
      if (altitude === "<3000" && alt >= 3000) continue;
      if (altitude === "3000-4500" && (alt < 3000 || alt > 4500)) continue;
      if (altitude === ">4500" && alt <= 4500) continue;
    }

    results.push({
      title: trek.title,
      slug: trek.slug,
      category: "trek",
      href: trekHrefIndex.get(trek.slug) ?? `/explore/himachal-pradesh/kullu/${trek.slug}`,
      subtitle: `${trek.duration} • ${trek.difficulty} • ${trek.maxAltitude}`,
    });
  }

  // 2–4: Non-trek results are only shown when trek-specific facets are inactive
  const isTrekFacetActive =
    (difficulty && difficulty !== "Any") ||
    (duration && duration !== "Any") ||
    (altitude && altitude !== "Any");

  if (!isTrekFacetActive) {
    // 2. Atlas places (peaks, destinations — treks are handled above)
    for (const atlasRegion of himalayaAtlas) {
      if (region && region !== "Any" && !atlasRegion.name.toLowerCase().includes(region.toLowerCase())) continue;

      for (const sub of atlasRegion.subregions) {
        for (const place of sub.places) {
          if (place.type === "trek" || place.type === "day-hike") continue;

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
        }
      }
    }

    // 3. Guides
    if (!region || region === "Any") {
      for (const g of guides) {
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
      }
    }

    // 4. Safety & Glossary
    if (!region || region === "Any") {
      for (const ill of ALTITUDE_ILLNESSES) {
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
      }

      for (const sp of SAFETY_PROTOCOLS) {
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
      }

      for (const term of GLOSSARY_TERMS) {
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
      }
    }
  }

  // Return empty when no filters are active (avoids dumping the entire DB)
  if (!normalizedQuery && region === "Any" && difficulty === "Any" && duration === "Any" && altitude === "Any") {
    return [];
  }

  return results;
}
