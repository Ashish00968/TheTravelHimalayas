import { notFound } from "next/navigation";
import { Metadata } from "next";
import { peaks } from "@/data/peaks";
import { HeroSection } from "@/components/content/HeroSection";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { QuickFacts } from "@/components/content/QuickFacts";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { ImageGallery } from "@/components/content/ImageGallery";
import { RelatedContent } from "@/components/content/RelatedContent";
import { getRelatedContent } from "@/lib/related-content";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { generatePageMetadata } from "@/lib/seo";
import { buildMountainJsonLd, buildFAQJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { AdSlot } from "@/components/monetization/AdSlot";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return peaks.map((peak) => ({
    slug: peak.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const peak = peaks.find((p) => p.slug === slug);
  if (!peak) return {};
  return generatePageMetadata({
    title: peak.title,
    description: peak.description,
    path: `/peaks/${peak.slug}`,
    image: peak.heroImage,
  });
}

export default async function PeakPage({ params }: PageProps) {
  const { slug } = await params;
  const peak = peaks.find((p) => p.slug === slug);

  if (!peak) {
    notFound();
  }

  const relatedPeaks = getRelatedContent(peak, peaks);
  const breadcrumbs = buildBreadcrumbs(`/peaks/${peak.slug}`, peak.title);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildMountainJsonLd(peak)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)) }}
      />
      {peak.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQJsonLd(peak.faqs)) }}
        />
      )}
      <HeroSection title={peak.title} image={peak.heroImage} subtitle={peak.description} />

      {/* Ad slot after hero */}
      <div className="container mx-auto px-4 mt-6">
        <AdSlot position="banner" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Overview
              </h2>
              <div className="prose prose-invert max-w-none text-foreground/80 whitespace-pre-line">
                {peak.overview}
              </div>
            </section>

            {/* Climbing Route */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Climbing Route
              </h2>
              <div className="prose prose-invert max-w-none text-foreground/80 whitespace-pre-line">
                {peak.climbingRoute}
              </div>
            </section>

            {/* Expedition Details */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Expedition Details
              </h2>
              <div className="prose prose-invert max-w-none text-foreground/80 whitespace-pre-line">
                {peak.expeditionDetails}
              </div>
            </section>

            {/* Inline ad slot */}
            <AdSlot position="inline" />

            {/* Gear Requirements */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Gear Requirements
              </h2>
              <ul className="space-y-2">
                {peak.gearRequirements.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground/80">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Map Placeholder */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Route Map
              </h2>
              <div className="glass-card rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                <p className="text-foreground/50 text-sm">
                  Interactive map coming soon
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={peak.faqs} />
            </section>

            {/* Image Gallery */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Gallery
              </h2>
              <ImageGallery images={peak.images} alt={peak.title} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <QuickFacts
                facts={[
                  { label: "Height", value: `${peak.height}m` },
                  { label: "Difficulty", value: peak.difficulty },
                  { label: "Expedition Season", value: peak.expeditionSeason },
                  { label: "Base Camp", value: peak.baseCamp },
                  { label: "Region", value: peak.region },
                ]}
              />
              <div className="mt-6">
                <AdSlot position="sidebar" />
              </div>
            </div>
          </aside>
        </div>

        {/* Related Peaks */}
        <RelatedContent
          title="Related Peaks"
          items={relatedPeaks}
          basePath="/peaks"
        />
      </div>
    </main>
  );
}
