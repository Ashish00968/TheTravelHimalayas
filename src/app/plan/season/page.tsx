import { Metadata } from "next";
import { SeasonFinderClient, LightweightSeasonTrek } from "@/components/plan/SeasonFinderClient";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { treks } from "@/data/treks";
import { placeLocationIndex } from "@/data/atlas";
import { buildWebApplicationJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Himalayan Seasonal Trek Matrix & Windows",
  description:
    "Month-by-month guide to trekking seasons in the Indian Himalayas. Find optimal weather windows, monsoon-shadow routes, and winter snow summit windows.",
  path: "/plan/season",
  keywords: [
    "Himalayan trek season matrix",
    "best time for trekking Himalayas",
    "best month for Kashmir Great Lakes",
    "winter treks Uttarakhand December January",
    "monsoon treks Spiti Ladakh July August",
  ],
});

export default function SeasonFinderPage() {
  const webAppSchema = buildWebApplicationJsonLd({
    name: "Himalayan Trek Season Matrix",
    description:
      "Interactive deterministic monthly calendar for Himalayan trekking seasons, pass status, weather patterns, and mountain visibility.",
    url: "/plan/season",
    applicationCategory: "TravelApplication",
    featureList: [
      "12-month Himalayan weather matrix",
      "Rain-shadow trekking recommendations (Ladakh, Spiti)",
      "High pass snow melt and clearance calendar",
      "Autumn clear-sky peak viewing windows",
    ],
  });

  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Plan", href: "/plan" },
    { label: "Season Matrix", href: "/plan/season" },
  ]);

  const seasonTreks: LightweightSeasonTrek[] = treks.map((t) => ({
    slug: t.slug,
    title: t.title,
    duration: t.duration,
    maxAltitude: t.maxAltitude,
    region: t.region,
    bestSeason: t.bestSeason,
    href: placeLocationIndex.get(t.slug)?.href || `/explore/himachal-pradesh/kullu/${t.slug}`,
  }));

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsSchema) }}
      />
      <HeroSection 
        title="Season Finder" 
        subtitle="Explore Himalayan conditions and find the perfect trek for your travel dates."
      />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <SeasonFinderClient allTreks={seasonTreks} />
      </div>
    </PageTransition>
  );
}

