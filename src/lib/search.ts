import { treks } from "@/data/treks";
import { peaks } from "@/data/peaks";
import { dayHikes } from "@/data/day-hikes";
import { guides } from "@/data/guides";

export interface SearchResult {
  title: string;
  slug: string;
  category: "trek" | "peak" | "day-hike" | "guide";
  basePath: string;
}

export function searchContent(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  treks.forEach((t) => {
    if (t.title.toLowerCase().includes(normalizedQuery))
      results.push({ title: t.title, slug: t.slug, category: "trek", basePath: "/treks" });
  });

  peaks.forEach((p) => {
    if (p.title.toLowerCase().includes(normalizedQuery))
      results.push({ title: p.title, slug: p.slug, category: "peak", basePath: "/peaks" });
  });

  dayHikes.forEach((d) => {
    if (d.title.toLowerCase().includes(normalizedQuery))
      results.push({ title: d.title, slug: d.slug, category: "day-hike", basePath: "/day-hikes" });
  });

  guides.forEach((g) => {
    if (g.title.toLowerCase().includes(normalizedQuery))
      results.push({ title: g.title, slug: g.slug, category: "guide", basePath: "/guides" });
  });

  return results;
}
