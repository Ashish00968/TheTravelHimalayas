import { Metadata } from "next";
import { TrekFinderClient } from "@/components/plan/TrekFinderClient";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { treks } from "@/data/treks";
import { buildWebApplicationJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Himalayan Trek Finder — Filter Trails by Altitude, Difficulty & Season",
  description:
    "Find your ideal Himalayan trek from 45+ verified trails. Filter by maximum altitude, fitness level, season, duration, and region across Himachal, Kashmir, Ladakh, and Uttarakhand.",
  path: "/plan/trek-finder",
  keywords: [
    "Himalayan trek finder",
    "trek filter by altitude",
    "beginner treks Himalayas",
    "challenging treks Himachal",
    "Kashmir treks finder",
    "Uttarakhand treks season filter",
  ],
});

export default function TrekFinderPage() {
  const webAppSchema = buildWebApplicationJsonLd({
    name: "Himalayan Trek Finder",
    description:
      "Interactive deterministic tool to discover and filter Himalayan treks by altitude, difficulty, duration, and season.",
    url: "/plan/trek-finder",
    applicationCategory: "TravelApplication",
    featureList: [
      "Altitude range filter up to 6,000m",
      "Fitness & technical difficulty grading",
      "Month and season matrix filtering",
      "Territory & valley multi-selection",
    ],
  });

  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Plan", href: "/plan" },
    { label: "Trek Finder", href: "/plan/trek-finder" },
  ]);

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
        title="Trek Finder" 
        subtitle="Match with the perfect Himalayan trail based on your preferences."
      />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <TrekFinderClient allTreks={treks} />
      </div>
    </PageTransition>
  );
}

