import { Metadata } from "next";
import { BudgetCalculatorClient } from "@/components/plan/BudgetCalculatorClient";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { treks } from "@/data/treks";
import { buildWebApplicationJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Himalayan Trek Budget Calculator — Estimate Expedition & Guide Costs",
  description:
    "Calculate the complete cost of any Himalayan trek. Get itemized estimates for trail permits, certified guides, mule support, equipment rentals, and transport.",
  path: "/plan/budget",
  keywords: [
    "Himalayan trek budget calculator",
    "trek cost estimator",
    "Himalayan guide rates",
    "trek permit costs India",
    "budget for trekking in Himalayas",
  ],
});

export default function TrekBudgetPage() {
  const webAppSchema = buildWebApplicationJsonLd({
    name: "Himalayan Trek Budget Calculator",
    description:
      "Deterministic expedition cost calculator calculating permits, guide charges, gear rentals, food, and transport across Indian Himalayan trails.",
    url: "/plan/budget",
    applicationCategory: "TravelApplication",
    featureList: [
      "Itemized permit fee calculations",
      "Certified guide and porter wage estimates",
      "High-altitude camping gear rental cost modeling",
      "Trailhead transport budget breakdown",
    ],
  });

  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Plan", href: "/plan" },
    { label: "Budget Calculator", href: "/plan/budget" },
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
        title="Budget Calculator" 
        subtitle="Estimate your total costs based on trekking style, group size, and gear requirements."
      />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <BudgetCalculatorClient allTreks={treks} />
      </div>
    </PageTransition>
  );
}

