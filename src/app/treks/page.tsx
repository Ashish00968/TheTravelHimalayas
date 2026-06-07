import { Metadata } from "next";
import { treks } from "@/data/treks";
import { ContentCard } from "@/components/content/ContentCard";
import { PageTransition } from "@/components/animation/PageTransition";

export const metadata: Metadata = {
  title: "Himalayan Treks | TheHimalayanTrails",
  description:
    "Explore the best trekking routes in the Himalayas. From easy weekend getaways to challenging high-altitude crossovers across Kullu, Manali, and beyond.",
  alternates: { canonical: "https://thehimalayantrails.com/treks" },
  openGraph: {
    title: "Himalayan Treks",
    description:
      "Explore the best trekking routes in the Himalayas. From easy weekend getaways to challenging high-altitude crossovers.",
    url: "https://thehimalayantrails.com/treks",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Himalayan Treks",
    description:
      "Explore the best trekking routes in the Himalayas.",
  },
};

export default function TreksListingPage() {
  return (
    <PageTransition>
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
          Himalayan Treks
        </h1>
        <p className="text-lg text-foreground/70 mb-10 max-w-2xl">
          Discover multi-day trekking routes through the most breathtaking
          landscapes of the Indian Himalayas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treks.map((trek) => (
            <ContentCard
              key={trek.slug}
              title={trek.title}
              slug={trek.slug}
              basePath="/treks"
              image={trek.heroImage}
              description={trek.description}
              badges={[trek.difficulty, trek.region]}
              meta={[
                { label: "Duration", value: trek.duration },
                { label: "Altitude", value: trek.maxAltitude },
              ]}
            />
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
