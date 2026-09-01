import { Metadata } from "next";
import { notFound } from "next/navigation";
import { guides } from "@/data/guides";
import { HeroSection } from "@/components/content/HeroSection";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentCard } from "@/components/content/ContentCard";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";

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
    title: `${guide.title} | The Himalayan Trails`,
    description: guide.description,
    alternates: { canonical: `https://thehimalayantrails.com/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://thehimalayantrails.com/guides/${guide.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
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

      <HeroSection title={guide.title} subtitle={guide.description} />

      <article className="container mx-auto px-6 py-12 max-w-4xl">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-wrap items-center gap-4 my-8 pb-6 border-b border-white/10">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            {guide.category}
          </span>
          <span className="text-sm text-white/50 font-mono">
            By {guide.author}
          </span>
        </div>

        <div className="prose prose-invert max-w-none text-white/80 whitespace-pre-line leading-relaxed text-base sm:text-lg font-light">
          {guide.content}
        </div>

        {relatedGuides.length > 0 && (
          <section className="mt-20 pt-12 border-t border-white/10">
            <h2 className="text-2xl sm:text-3xl font-display tracking-tight font-semibold text-white mb-8">
              Related Field Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedGuides.map((related) => (
                <ContentCard
                  key={related.slug}
                  title={related.title}
                  slug={related.slug}
                  basePath="/guides"
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
