import { Metadata } from "next";
import { notFound } from "next/navigation";
import { guides } from "@/data/guides";
import { HeroSection } from "@/components/content/HeroSection";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentCard } from "@/components/content/ContentCard";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { generatePageMetadata } from "@/lib/seo";

import Link from "next/link";
import { Compass, ShieldCheck, Map } from "lucide-react";
import { MarkdownRenderer } from "@/components/content/MarkdownRenderer";

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

  return generatePageMetadata({
    title: `${guide.title} — Himalayan Expedition & Alpine Field Guide`,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    keywords: [
      "Himalayan guide",
      guide.category,
      "alpine expedition planning",
      "trekking logistics Himalayas",
      guide.title.toLowerCase(),
    ],
  });
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
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <HeroSection title={guide.title} subtitle={guide.description} />

      <article className="container mx-auto px-6 py-12 max-w-4xl">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-wrap items-center gap-4 my-8 pb-6 border-b border-border">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            {guide.category}
          </span>
          <span className="text-sm text-muted-foreground font-mono">
            By {guide.author}
          </span>
        </div>

        <div className="max-w-none text-foreground/85 leading-relaxed text-base sm:text-lg font-light">
          <MarkdownRenderer content={guide.content} />
        </div>

        {/* Internal Navigation Mesh to Relevant Trails and Planning Tools */}
        <section className="mt-16 pt-10 border-t border-border">
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-6">
            Himalayan Trailhead &amp; Planning Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/explore/himachal-pradesh/kullu"
              className="p-5 rounded-2xl glass-card hover:border-primary/50 transition-all group block"
            >
              <Compass className="w-5 h-5 text-primary mb-2" />
              <span className="font-display font-medium text-foreground group-hover:text-primary transition-colors block text-base">
                Kullu &amp; Manali Trails →
              </span>
              <span className="text-xs text-muted-foreground font-light block mt-1">
                Hampta Pass, Beas Kund, Bhrigu Lake itineraries
              </span>
            </Link>
            <Link
              href="/plan/packing"
              className="p-5 rounded-2xl glass-card hover:border-primary/50 transition-all group block"
            >
              <ShieldCheck className="w-5 h-5 text-primary mb-2" />
              <span className="font-display font-medium text-foreground group-hover:text-primary transition-colors block text-base">
                Packing List Generator →
              </span>
              <span className="text-xs text-muted-foreground font-light block mt-1">
                Altitude-calibrated gear layers &amp; cold protection
              </span>
            </Link>
            <Link
              href="/map"
              className="p-5 rounded-2xl glass-card hover:border-primary/50 transition-all group block"
            >
              <Map className="w-5 h-5 text-primary mb-2" />
              <span className="font-display font-medium text-foreground group-hover:text-primary transition-colors block text-base">
                3D Topo Atlas →
              </span>
              <span className="text-xs text-muted-foreground font-light block mt-1">
                Satellite terrain, passes, and trail elevations
              </span>
            </Link>
          </div>
        </section>

        {relatedGuides.length > 0 && (
          <section className="mt-16 pt-10 border-t border-border">
            <h2 className="text-2xl sm:text-3xl font-display tracking-tight font-semibold text-foreground mb-8">
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
