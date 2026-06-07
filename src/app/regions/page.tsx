import { Metadata } from "next";
import { regions } from "@/data/regions";
import { ContentCard } from "@/components/content/ContentCard";

export const metadata: Metadata = {
  title: "Himalayan Regions | TheHimalayanTrails",
  description:
    "Explore the diverse regions of the Indian Himalayas. Discover treks, peaks, and day hikes organized by area.",
};

export default function RegionsPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-heading font-bold text-foreground mb-8">
        Himalayan Regions
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region) => (
          <ContentCard
            key={region.slug}
            title={region.title}
            slug={region.slug}
            basePath="/regions"
            image={region.heroImage}
            description={region.description}
          />
        ))}
      </div>
    </section>
  );
}
