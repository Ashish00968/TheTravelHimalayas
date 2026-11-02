import { Metadata } from "next";
import { PackingGeneratorClient, LightweightPackingTrek } from "@/components/plan/PackingGeneratorClient";
import { HeroSection } from "@/components/content/HeroSection";
import { PageTransition } from "@/components/animation/PageTransition";
import { treks } from "@/data/treks";
import { buildWebApplicationJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Alpine Trek Packing Checklist Generator",
  description:
    "Generate custom high-altitude gear checklists adjusted for season, sleeping altitude, and weather conditions across the Indian Himalayan ranges.",
  path: "/plan/packing",
  keywords: [
    "Himalayan trek packing list",
    "trekking gear checklist India",
    "high altitude packing list",
    "winter trek gear checklist",
    "monsoon trekking essentials",
  ],
});

export default function PackingGeneratorPage() {
  const webAppSchema = buildWebApplicationJsonLd({
    name: "Himalayan Trek Packing List Generator",
    description:
      "Interactive deterministic gear checklist generator tailored to specific trail altitudes, winter conditions, and duration.",
    url: "/plan/packing",
    applicationCategory: "TravelApplication",
    featureList: [
      "Altitude-calibrated clothing layers",
      "Sub-zero sleeping bag rating requirements",
      "Medical kit checklist (AMS, Diamox, blister care)",
      "Printable & interactive checkable packing manifest",
    ],
  });

  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Plan", href: "/plan" },
    { label: "Packing Generator", href: "/plan/packing" },
  ]);

  const packingTreks: LightweightPackingTrek[] = treks.map((t) => ({
    slug: t.slug,
    title: t.title,
    maxAltitude: t.maxAltitude,
    duration: t.duration,
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
        title="Packing List Generator" 
        subtitle="Generate a personalized gear checklist for your specific trek and season."
      />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <PackingGeneratorClient allTreks={packingTreks} />
      </div>
    </PageTransition>
  );
}

