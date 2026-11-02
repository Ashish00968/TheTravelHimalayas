import type { Metadata } from "next";
import { ContactClient, ContactTerritorySummary } from "./ContactClient";
import { himalayaAtlas } from "@/data/atlas";
import { generatePageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = generatePageMetadata({
  title: "About & Basecamp Operations",
  description:
    "Learn about Discover Himalayan Trails, our field reconnaissance operations, high-altitude safety standards, and direct contact dispatch.",
  path: "/contact",
  keywords: [
    "Discover Himalayan Trails contact",
    "Himalayan trekking basecamp",
    "alpine expedition support India",
    "about Discover Himalayan Trails",
  ],
});

export default function ContactPage() {
  const breadcrumbsSchema = buildBreadcrumbJsonLd([
    { label: "Home", href: "/" },
    { label: "About & Contact", href: "/contact" },
  ]);

  const territories: ContactTerritorySummary[] = himalayaAtlas.map((region) => ({
    id: region.id,
    name: region.name,
    emoji: region.emoji,
    cardDesc: region.cardDesc,
    divisionsCount: region.subregions.length,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsSchema) }}
      />
      <ContactClient territories={territories} />
    </>
  );
}

