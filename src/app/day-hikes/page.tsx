import { Metadata } from "next";
import { dayHikes } from "@/data/day-hikes";
import { ContentCard } from "@/components/content/ContentCard";

export const metadata: Metadata = {
  title: "Day Hikes",
  description:
    "Discover the best day hikes in the Himalayas. Short adventures near popular destinations with stunning views, waterfalls, and alpine meadows.",
};

export default function DayHikesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-8">
        Day Hikes
      </h1>
      <p className="text-lg text-foreground/70 max-w-2xl mb-12">
        Short adventures near popular Himalayan destinations. Perfect for a
        half-day escape into nature.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dayHikes.map((hike) => (
          <ContentCard
            key={hike.slug}
            title={hike.title}
            slug={hike.slug}
            basePath="/day-hikes"
            image={hike.heroImage}
            description={hike.description}
            badges={[hike.difficulty, hike.region]}
            meta={[
              { label: "Duration", value: hike.duration },
              { label: "Distance", value: hike.distance },
            ]}
          />
        ))}
      </div>
    </div>
  );
}
