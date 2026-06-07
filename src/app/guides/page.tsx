import { Metadata } from "next";
import { guides } from "@/data/guides";
import { ContentCard } from "@/components/content/ContentCard";

export const metadata: Metadata = {
  title: "Travel Guides | TheHimalayanTrails",
  description:
    "Comprehensive travel guides covering transportation, permits, packing, and planning for Himalayan adventures.",
  alternates: { canonical: "https://thehimalayantrails.com/guides" },
  openGraph: {
    title: "Travel Guides",
    description:
      "Comprehensive travel guides covering transportation, permits, packing, and planning for Himalayan adventures.",
    url: "https://thehimalayantrails.com/guides",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Guides",
    description:
      "Comprehensive travel guides covering transportation, permits, packing, and planning for Himalayan adventures.",
  },
};

export default function GuidesListingPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-heading font-bold text-foreground mb-8">
        Travel Guides
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <ContentCard
            key={guide.slug}
            title={guide.title}
            slug={guide.slug}
            basePath="/guides"
            image={guide.featuredImage}
            description={guide.description}
            badges={[guide.category]}
            meta={[{ label: "Author", value: guide.author }]}
          />
        ))}
      </div>
    </section>
  );
}
