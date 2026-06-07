import { Metadata } from "next";
import { notFound } from "next/navigation";
import { treks } from "@/data/treks";
import { HeroSection } from "@/components/content/HeroSection";
import { QuickFacts } from "@/components/content/QuickFacts";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { ImageGallery } from "@/components/content/ImageGallery";
import { RelatedContent } from "@/components/content/RelatedContent";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import { getRelatedContent } from "@/lib/related-content";
import { PageTransition } from "@/components/animation/PageTransition";
import { buildTouristTripJsonLd, buildFAQJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { AdSlot } from "@/components/monetization/AdSlot";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return treks.map((trek) => ({ slug: trek.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trek = treks.find((t) => t.slug === slug);
  if (!trek) return {};

  return {
    title: `${trek.title} | TheHimalayanTrails`,
    description: trek.description,
    alternates: { canonical: `https://thehimalayantrails.com/treks/${trek.slug}` },
    openGraph: {
      title: trek.title,
      description: trek.description,
      url: `https://thehimalayantrails.com/treks/${trek.slug}`,
      type: "website",
      images: [{ url: trek.heroImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: trek.title,
      description: trek.description,
      images: [trek.heroImage],
    },
  };
}

export default async function TrekPage({ params }: PageProps) {
  const { slug } = await params;
  const trek = treks.find((t) => t.slug === slug);
  if (!trek) notFound();

  const breadcrumbs = buildBreadcrumbs(`/treks/${trek.slug}`, trek.title);
  const relatedTreks = getRelatedContent(trek, treks);

  const quickFacts = [
    { label: "Region", value: trek.region },
    { label: "Difficulty", value: trek.difficulty },
    { label: "Duration", value: trek.duration },
    { label: "Distance", value: trek.distance },
    { label: "Max Altitude", value: trek.maxAltitude },
    { label: "Best Season", value: trek.bestSeason },
  ];

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildTouristTripJsonLd(trek)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)) }}
      />
      {trek.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQJsonLd(trek.faqs)) }}
        />
      )}
      <HeroSection
        title={trek.title}
        image={trek.heroImage}
        subtitle={trek.description}
      />

      {/* Ad slot after hero */}
      <div className="container mx-auto px-4 mt-6">
        <AdSlot position="banner" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Overview
              </h2>
              <div className="text-foreground/80 whitespace-pre-line leading-relaxed">
                {trek.overview}
              </div>
            </section>

            {/* Route Description */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Route Description
              </h2>
              <div className="text-foreground/80 whitespace-pre-line leading-relaxed">
                {trek.routeDescription}
              </div>
            </section>

            {/* Inline ad slot */}
            <AdSlot position="inline" />

            {/* Itinerary */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Day-by-Day Itinerary
              </h2>
              <div className="space-y-6">
                {trek.itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="glass-card rounded-xl p-5"
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Day {day.day}: {day.title}
                    </h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {day.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Map Placeholder */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Trek Route Map
              </h2>
              <div className="glass-card rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                <div className="text-center text-foreground/50">
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-sm mt-2">
                    Map integration coming soon
                  </p>
                </div>
              </div>
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors"
                disabled
              >
                Download GPX Track (Coming Soon)
              </button>
            </section>

            {/* Packing List */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Packing List
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {trek.packingList.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-foreground/80 text-sm"
                  >
                    <span className="text-primary mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Permits */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Permits &amp; Regulations
              </h2>
              <div className="text-foreground/80 leading-relaxed">
                {trek.permits}
              </div>
            </section>

            {/* Best Time */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Best Time to Visit
              </h2>
              <div className="glass-card rounded-xl p-5">
                <p className="text-foreground/80">
                  The best season to trek {trek.title} is{" "}
                  <span className="text-foreground font-medium">
                    {trek.bestSeason}
                  </span>
                  .
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={trek.faqs} />
            </section>

            {/* Image Gallery */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Photo Gallery
              </h2>
              <ImageGallery images={trek.images} alt={trek.title} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <QuickFacts facts={quickFacts} />
              <AdSlot position="sidebar" />
            </div>
          </aside>
        </div>

        {/* Related Treks */}
        <RelatedContent
          title="Related Treks"
          items={relatedTreks}
          basePath="/treks"
        />
      </div>
    </PageTransition>
  );
}
