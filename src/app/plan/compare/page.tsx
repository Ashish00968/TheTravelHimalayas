import { Metadata } from "next";
import { TrekComparisonClient } from "@/components/plan/TrekComparisonClient";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { treks } from "@/data/treks";
import { buildWebApplicationJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Himalayan Trek Comparison Matrix — Head-to-Head Altitude & Difficulty",
  description:
    "Compare two or more Himalayan treks side-by-side. Analyze maximum altitude, daily elevation gain, grade, duration, budget, and best trekking seasons.",
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
        <TrekComparisonClient allTreks={treks} />
      </div>
    </PageTransition>
  );
}

