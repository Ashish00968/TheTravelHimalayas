import { Metadata } from "next";
import { TrekComparisonClient, LightweightComparisonTrek } from "@/components/plan/TrekComparisonClient";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { treks } from "@/data/treks";
import { placeLocationIndex } from "@/data/atlas";
import { buildWebApplicationJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Head-to-Head Trek Comparison Matrix",
  description:
    "Compare Himalayan treks side-by-side: analyze maximum altitudes, daily elevation gains, distances, terrain difficulties, and required fitness levels.",
  path: "/plan/compare",
  keywords: [
    "Himalayan trek comparison",
    "compare treks side by side",
    "Kashmir Great Lakes vs Hampta Pass",
    "Kedarkantha vs Har Ki Dun",
    "Himalayan trail difficulty comparison",
  ],
});

export default function TrekComparisonPage() {
  const webAppSchema = buildWebApplicationJsonLd({
    name: "Himalayan Trek Comparison Matrix",
    description:
      "Deterministic side-by-side comparison tool for Himalayan trekking routes, elevation profiles, and difficulty stats.",
    url: "/plan/compare",
    applicationCategory: "TravelApplication",
    featureList: [
      "Side-by-side altitude comparison",
      "Elevation gain and pass altitude diffs",
      "Season and logistical requirements comparison",
      "Cost and budget breakdown",
    ],
  });

  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Plan", href: "/plan" },
    { label: "Trek Comparison", href: "/plan/compare" },
  ]);

  const comparisonTreks: LightweightComparisonTrek[] = treks.map((t) => ({
    slug: t.slug,
    title: t.title,
    region: t.region,
    difficulty: t.difficulty,
    duration: t.duration,
    maxAltitude: t.maxAltitude,
    distance: t.distance,
    bestSeason: t.bestSeason,
    startPoint: t.startPoint,
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
        title="Trek Comparison" 
        subtitle="Compare side-by-side stats, altitudes, and itineraries to make the right choice."
      />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <TrekComparisonClient allTreks={comparisonTreks} />
      </div>
    </PageTransition>
  );
}

