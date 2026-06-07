import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { regions } from "@/data/regions";
import { treks } from "@/data/treks";
import { peaks } from "@/data/peaks";
import { dayHikes } from "@/data/day-hikes";
import { guides } from "@/data/guides";
import { HeroSection } from "@/components/content/HeroSection";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ContentCard } from "@/components/content/ContentCard";
import { ImageGallery } from "@/components/content/ImageGallery";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return regions.map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = regions.find((r) => r.slug === slug);
  if (!region) return {};

  return {
    title: `${region.title} | TheHimalayanTrails`,
    description: region.description,
    openGraph: {
      title: region.title,
      description: region.description,
      images: [{ url: region.heroImage }],
    },
  };
}

export default async function RegionPage({ params }: PageProps) {
  const { slug } = await params;
  const region = regions.find((r) => r.slug === slug);
  if (!region) notFound();

  const regionTreks = treks.filter((t) => t.region === region.title);
  const regionPeaks = peaks.filter((p) => p.region === region.title);
  const regionDayHikes = dayHikes.filter((h) => h.region === region.title);
  const relatedGuides = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(region.title.toLowerCase()) ||
      g.description.toLowerCase().includes(region.title.toLowerCase())
  );

  const breadcrumbItems = buildBreadcrumbs(`/regions/${slug}`, region.title);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbItems)) }}
      />
      <HeroSection title={region.title} image={region.heroImage} subtitle={region.description} />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Overview */}
        <section className="max-w-4xl mb-12">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Overview</h2>
          <div className="prose prose-invert max-w-none">
            {region.overview.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-foreground/80 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Top Treks */}
        {regionTreks.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">
                Top Treks in {region.title}
              </h2>
              <Link
                href="/treks"
                className="text-sm text-primary hover:underline"
              >
                View all treks →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionTreks.map((trek) => (
                <ContentCard
                  key={trek.slug}
                  title={trek.title}
                  slug={trek.slug}
                  basePath="/treks"
                  image={trek.heroImage}
                  description={trek.description}
                  badges={[trek.difficulty]}
                  meta={[
                    { label: "Duration", value: trek.duration },
                    { label: "Altitude", value: trek.maxAltitude },
                  ]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Top Peaks */}
        {regionPeaks.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">
                Top Peaks in {region.title}
              </h2>
              <Link
                href="/peaks"
                className="text-sm text-primary hover:underline"
              >
                View all peaks →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionPeaks.map((peak) => (
                <ContentCard
                  key={peak.slug}
                  title={peak.title}
                  slug={peak.slug}
                  basePath="/peaks"
                  image={peak.heroImage}
                  description={peak.description}
                  badges={[peak.difficulty]}
                  meta={[
                    { label: "Height", value: `${peak.height}m` },
                    { label: "Season", value: peak.expeditionSeason },
                  ]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Top Day Hikes */}
        {regionDayHikes.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">
                Top Day Hikes in {region.title}
              </h2>
              <Link
                href="/day-hikes"
                className="text-sm text-primary hover:underline"
              >
                View all day hikes →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionDayHikes.map((hike) => (
                <ContentCard
                  key={hike.slug}
                  title={hike.title}
                  slug={hike.slug}
                  basePath="/day-hikes"
                  image={hike.heroImage}
                  description={hike.description}
                  badges={[hike.difficulty]}
                  meta={[
                    { label: "Duration", value: hike.duration },
                    { label: "Distance", value: hike.distance },
                  ]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Travel Info */}
        <section className="max-w-4xl mb-12">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
            Travel Information
          </h2>
          <div className="prose prose-invert max-w-none">
            {region.travelInfo.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-foreground/80 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Image Gallery */}
        {region.images.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
              Photo Gallery
            </h2>
            <ImageGallery images={region.images} alt={region.title} />
          </section>
        )}

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">
                Related Guides
              </h2>
              <Link
                href="/guides"
                className="text-sm text-primary hover:underline"
              >
                View all guides →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedGuides.map((guide) => (
                <ContentCard
                  key={guide.slug}
                  title={guide.title}
                  slug={guide.slug}
                  basePath="/guides"
                  image={guide.heroImage}
                  description={guide.description}
                  badges={[guide.category]}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
