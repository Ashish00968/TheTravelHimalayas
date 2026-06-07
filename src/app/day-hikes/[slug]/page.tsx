import { Metadata } from "next";
import { notFound } from "next/navigation";
import { dayHikes } from "@/data/day-hikes";
import { HeroSection } from "@/components/content/HeroSection";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { QuickFacts } from "@/components/content/QuickFacts";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { ImageGallery } from "@/components/content/ImageGallery";
import { RelatedContent } from "@/components/content/RelatedContent";
import { getRelatedContent } from "@/lib/related-content";
import { buildTouristTripJsonLd, buildFAQJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { AdSlot } from "@/components/monetization/AdSlot";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return dayHikes.map((hike) => ({ slug: hike.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const hike = dayHikes.find((h) => h.slug === slug);
  if (!hike) return {};

  return {
    title: hike.title,
    description: hike.description,
  };
}

export default async function DayHikePage({ params }: PageProps) {
  const { slug } = await params;
  const hike = dayHikes.find((h) => h.slug === slug);

  if (!hike) {
    notFound();
  }

  const breadcrumbs = buildBreadcrumbs(`/day-hikes/${hike.slug}`, hike.title);
  const relatedHikes = getRelatedContent(hike, dayHikes);

  const quickFacts = [
    { label: "Distance", value: hike.distance },
    { label: "Duration", value: hike.duration },
    { label: "Difficulty", value: hike.difficulty },
    { label: "Region", value: hike.region },
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildTouristTripJsonLd(hike)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)) }}
      />
      {hike.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQJsonLd(hike.faqs)) }}
        />
      )}
      <HeroSection title={hike.title} image={hike.heroImage} subtitle={hike.description} />

      {/* Ad slot after hero */}
      <div className="container mx-auto px-4 mt-6">
        <AdSlot position="banner" />
      </div>

      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Overview
              </h2>
              <div className="prose prose-invert max-w-none">
                {hike.overview.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-foreground/80 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Route Description */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Route Description
              </h2>
              <div className="prose prose-invert max-w-none">
                {hike.routeDescription.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-foreground/80 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Inline ad slot */}
            <AdSlot position="inline" />

            {/* Map Placeholder */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Trail Map
              </h2>
              <div className="glass-card rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                <div className="text-center text-foreground/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-3 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <p className="text-sm">Interactive trail map coming soon</p>
                </div>
              </div>
            </section>

            {/* FAQ */}
            {hike.faqs.length > 0 && (
              <section>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  Frequently Asked Questions
                </h2>
                <FAQAccordion faqs={hike.faqs} />
              </section>
            )}

            {/* Image Gallery */}
            {hike.images.length > 0 && (
              <section>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                  Photo Gallery
                </h2>
                <ImageGallery images={hike.images} alt={hike.title} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <QuickFacts facts={quickFacts} />
            <AdSlot position="sidebar" />
          </aside>
        </div>

        {/* Related Day Hikes */}
        <RelatedContent
          title="Related Day Hikes"
          items={relatedHikes}
          basePath="/day-hikes"
        />
      </div>
    </div>
  );
}
