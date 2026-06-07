import { peaks } from "@/data/peaks";
import { ContentCard } from "@/components/content/ContentCard";

export const metadata = {
  title: "Himalayan Peaks",
  description: "Explore the majestic peaks of the Himalayas, from accessible climbing objectives to formidable high-altitude summits.",
};

export default function PeaksPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-8">
        Himalayan Peaks
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {peaks.map((peak) => (
          <ContentCard
            key={peak.slug}
            title={peak.title}
            slug={peak.slug}
            basePath="/peaks"
            image={peak.heroImage}
            description={peak.description}
            badges={[peak.difficulty, peak.region]}
            meta={[
              { label: "Height", value: `${peak.height}m` },
              { label: "Season", value: peak.expeditionSeason },
            ]}
          />
        ))}
      </div>
    </main>
  );
}
