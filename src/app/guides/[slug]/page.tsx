import { Metadata } from "next";
import { notFound } from "next/navigation";
import { guides } from "@/data/guides";
import { HeroSection } from "@/components/content/HeroSection";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentCard } from "@/components/content/ContentCard";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { AdSlot } from "@/components/monetization/AdSlot";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return {};

  return {
    title: `${guide.title} | TheHimalayanTrails`,
    description: guide.description,
    alternates: { canonical: `https://thehimalayantrails.com/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://thehimalayantrails.com/guides/${guide.slug}`,
      type: "article",
      images: [{ url: guide.heroImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [guide.heroImage],
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const breadcrumbs = buildBreadcrumbs(`/guides/${guide.slug}`, guide.title);

  const relatedGuides = guides.filter((g) =>
    guide.relatedGuides.includes(g.slug)
  );

  const jsonLd = buildArticleJsonLd(guide);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <HeroSection title={guide.title} image={guide.heroImage} />

      {/* Ad slot after hero */}
      <div className="container mx-auto px-4 mt-6">
        <AdSlot position="banner" />
      </div>

      <article className="container mx-auto px-4 py-12">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary">
            {guide.category}
          </span>
          <span className="text-sm text-foreground/60">
            By {guide.author}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-8">
          {guide.title}
        </h1>

        <div className="text-foreground/80 whitespace-pre-line leading-relaxed text-base max-w-3xl">
          {guide.content}
        </div>

        {/* Inline ad slot within content body */}
        <div className="max-w-3xl mt-8">
          <AdSlot position="inline" />
        </div>

        {relatedGuides.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
              Related Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedGuides.map((related) => (
                <ContentCard
                  key={related.slug}
                  title={related.title}
                  slug={related.slug}
                  basePath="/guides"
                  image={related.featuredImage}
                  description={related.description}
                  badges={[related.category]}
                  meta={[{ label: "Author", value: related.author }]}
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
