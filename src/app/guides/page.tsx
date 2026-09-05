import { Metadata } from "next";
import { guides } from "@/data/guides";
import { GuidesHub } from "@/components/content/GuidesHub";
import { generatePageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = generatePageMetadata({
  title: "Himalayan Field Guides & Expedition Planning — Logistics, Permits & Gear",
  description:
    "Authoritative field dispatches and alpine guides covering inner line permits, trailhead transport, gear checklists, and acclimatization strategy.",
  path: "/guides",
  keywords: [
    "Himalayan field guides",
    "trekking permits India",
    "how to reach Manali trailhead",
    "Kashmir Great Lakes permits",
    "Himalayan expedition logistics",
  ],
});


export default function GuidesListingPage() {
  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "Field Guides", href: "/guides" },
  ]);

  const guidesListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Himalayan Field Guides & Logistics",
    description: "In-depth guides on permits, gear, mountain logistics, and trailhead access.",
    itemListElement: guides.map((guide, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: guide.title,
      url: `${SITE.url}/guides/${guide.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(guidesListSchema) }}
      />
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-12">
          <span className="font-mono text-xs text-primary uppercase tracking-[0.25em] block mb-2">
            Field Dispatches &amp; Knowledge Base
          </span>
          <h1 className="font-display tracking-tight font-semibold text-3xl sm:text-5xl md:text-6xl text-foreground mb-4">
            Travel &amp; Trail Guides
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg font-light max-w-2xl">
            In-depth advice on seasons, permits, hiring local guides, high-altitude logistics, and equipment checklists.
          </p>
        </div>

        <GuidesHub guides={guides} />
      </div>
    </main>
  );
}
