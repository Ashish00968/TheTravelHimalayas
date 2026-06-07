import { ContentCard } from "./ContentCard";

interface RelatedItem {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  region?: string;
  difficulty?: string;
}

interface RelatedContentProps {
  title: string;
  items: RelatedItem[];
  basePath: string;
}

export function RelatedContent({ title, items, basePath }: RelatedContentProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ContentCard
            key={item.slug}
            title={item.title}
            slug={item.slug}
            basePath={basePath}
            image={item.heroImage}
            description={item.description}
            badges={[item.difficulty, item.region].filter(Boolean) as string[]}
          />
        ))}
      </div>
    </section>
  );
}
