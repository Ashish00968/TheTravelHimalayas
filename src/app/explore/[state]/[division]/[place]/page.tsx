import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { himalayaAtlas, getPlace, getSubRegion, getRegion } from "@/data/atlas";
import { HeroSection } from "@/components/content/HeroSection";
import { QuickFacts } from "@/components/content/QuickFacts";
import { FAQAccordion } from "@/components/content/FAQAccordion";
import { ImageGallery } from "@/components/content/ImageGallery";
import { PageTransition } from "@/components/animation/PageTransition";
import { ChevronLeft, CheckCircle2, Lightbulb, Map, Compass, ArrowRight } from "lucide-react";
import { DataConfidenceBadge } from "@/components/ui/DataConfidenceBadge";
import { LastChecked } from "@/components/ui/LastChecked";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { ElevationProfile } from "@/components/shared/ElevationProfile";
import { MountainWeatherWidget } from "@/components/shared/MountainWeatherWidget";
import { 
  serializeJsonLd, 
  buildTouristTripJsonLd, 
  buildMountainJsonLd, 
  buildFAQJsonLd, 
  buildBreadcrumbJsonLd 
} from "@/lib/json-ld";
export function generateStaticParams() {
  const params: { state: string; division: string; place: string }[] = [];
  himalayaAtlas.forEach((region) => {
    region.subregions.forEach((sub) => {
      sub.places.forEach((place) => {
        params.push({ state: region.id, division: sub.id, place: place.id });
      });
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; division: string; place: string }>;
}): Promise<Metadata> {
  const { state, division, place: placeId } = await params;
  const place = getPlace(state, division, placeId);
  const region = getRegion(state);
  const subRegion = getSubRegion(state, division);

  if (!place) return {};

  return {
    title: `${place.name} | ${subRegion?.name}, ${region?.name} | The Himalayan Trails`,
    description:
      place.overview ||
      place.experience ||
      `Explore ${place.name} in ${subRegion?.name}, ${region?.name}. Detailed trails, route guides, and local insights.`,
  };
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ state: string; division: string; place: string }>;
}) {
  const { state, division, place: placeId } = await params;
  const region = getRegion(state);
  const subRegion = getSubRegion(state, division);
  const place = getPlace(state, division, placeId);

  if (!region || !subRegion || !place) notFound();

  const title = place.trekData?.title || place.peakData?.title || place.name;
  const overview =
    place.trekData?.overview || place.peakData?.overview || place.overview;
  const routeDescription =
    place.trekData?.routeDescription ||
    place.peakData?.climbingRoute ||
    place.routeDescription;
  const itinerary = place.trekData?.itinerary || place.itinerary || [];
  const packingList = place.trekData?.packingList || place.packingList || [];
  const faqs = place.trekData?.faqs || place.peakData?.faqs || place.faqs || [];
  const images = place.trekData?.images || place.peakData?.images || place.images || [];

  const quickFacts = [
    { label: "State", value: region.name },
    { label: "Division", value: subRegion.name },
    ...(place.elevation || place.trekData?.maxAltitude || place.peakData?.height
      ? [
          {
            label: "Elevation",
            value:
              place.elevation ||
              place.trekData?.maxAltitude ||
              `${place.peakData?.height}m`,
          },
        ]
      : []),
    ...(place.difficulty || place.trekData?.difficulty || place.peakData?.difficulty
      ? [
          {
            label: "Difficulty",
            value:
              place.difficulty ||
              place.trekData?.difficulty ||
              place.peakData?.difficulty ||
              "Moderate",
          },
        ]
      : []),
    ...(place.duration || place.trekData?.duration
      ? [
          {
            label: "Duration",
            value: place.duration || place.trekData?.duration || "1 Day",
          },
        ]
      : []),
    ...(place.distance || place.trekData?.distance
      ? [
          {
            label: "Distance",
            value: place.distance || place.trekData?.distance || "—",
          },
        ]
      : []),
    ...(place.bestSeason || place.trekData?.bestSeason || place.peakData?.expeditionSeason
      ? [
          {
            label: "Best Season",
            value:
              place.bestSeason ||
              place.trekData?.bestSeason ||
              place.peakData?.expeditionSeason ||
              "May to October",
          },
        ]
      : []),
    ...(place.trekData?.guideRatePerDay
      ? [
          {
            label: "Guide Rate",
            value: `₹${place.trekData.guideRatePerDay.toLocaleString("en-IN")}/day`,
          },
        ]
      : []),
  ];

  const schemas = [];
  if (place.trekData) schemas.push(buildTouristTripJsonLd(place.trekData));
  if (place.peakData) schemas.push(buildMountainJsonLd(place.peakData));
  if (faqs.length > 0) schemas.push(buildFAQJsonLd(faqs));
  schemas.push(
    buildBreadcrumbJsonLd([
      { label: "Home", href: "/" },
      { label: region.name, href: `/explore/${state}` },
      { label: subRegion.name, href: `/explore/${state}/${division}` },
      { label: title, href: `/explore/${state}/${division}/${placeId}` },
    ])
  );

  return (
    <PageTransition>
      <HeroSection
        title={title}
        subtitle={
          place.trekData?.description ||
          place.peakData?.description ||
          subRegion.tagline ||
          `${subRegion.name}, ${region.name}`
        }
        image={place.heroImage || place.peakData?.heroImage || place.trekData?.heroImage}
      />

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <Link
            href={`/explore/${state}/${division}`}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-mono uppercase tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" /> Back to {subRegion.name}
          </Link>
          
          {place.trekData && (
            <div className="flex items-center gap-3">
              <LastChecked date="2026-08-15" />
              <DataConfidenceBadge level="Official" />
            </div>
          )}
        </div>

        {/* Featured Showcase Landscape Photo */}
        {(place.heroImage || place.peakData?.heroImage || place.trekData?.heroImage) && (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[500px] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl group">
            <Image
              src={
                place.heroImage ||
                place.peakData?.heroImage ||
                place.trekData?.heroImage ||
                ""
              }
              alt={title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-6 flex items-end justify-between pointer-events-none">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 inline-block mb-2">
                  Featured Expedition View
                </span>
                <p className="text-white font-display text-xl sm:text-3xl font-semibold">
                  {title}
                </p>
              </div>
              {(place.elevation ||
                place.trekData?.maxAltitude ||
                place.peakData?.height) && (
                <span className="font-mono text-xs text-white/90 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 hidden sm:inline-block">
                  {place.elevation ||
                    place.trekData?.maxAltitude ||
                    `${place.peakData?.height}m`}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-2">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-14">
            {/* Overview */}
            {overview && (
              <section>
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-white mb-2">
                  Overview
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-5" />
                <div className="text-white/80 whitespace-pre-line leading-relaxed text-base md:text-lg font-light">
                  {overview}
                </div>
              </section>
            )}

            {/* Experience Narration */}
            {place.experience && (
              <section className="rounded-2xl p-6 sm:p-8 border-l-4 border-primary bg-[#0d0d10] border-t border-r border-b border-white/5">
                <span className="text-xs font-mono text-primary uppercase tracking-[0.2em] block mb-2">
                  Field Notes &amp; Experience
                </span>
                <p className="text-white/90 text-lg md:text-xl font-serif italic leading-relaxed">
                  &ldquo;{place.experience}&rdquo;
                </p>
              </section>
            )}

            {/* Route / Climbing Description */}
            {routeDescription && (
              <section>
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-white mb-2">
                  {place.type === "peak" ? "Climbing Route" : "Trail & Route Description"}
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-5" />
                <div className="text-white/80 whitespace-pre-line leading-relaxed text-base md:text-lg font-light">
                  {routeDescription}
                </div>
              </section>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-white mb-2">
                  Day-by-Day Itinerary
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-6" />
                
                <div className="mb-10 hidden md:block">
                  <ElevationProfile itinerary={itinerary} />
                </div>

                <div className="space-y-4 relative">
                  <div className="absolute left-6 top-12 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />
                  {itinerary.map((day) => (
                    <div
                      key={day.day}
                      className="bg-surface border border-white/5 rounded-2xl p-5 pl-16 relative"
                    >
                      <div className="absolute left-0 top-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg shadow-primary/25">
                        {day.day}
                      </div>
                      <h3 className="text-base font-semibold text-white mb-1.5">
                        {day.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed font-light">
                        {day.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Local Insider Tips */}
            {place.tips && place.tips.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-white mb-2 flex items-center gap-2.5">
                  <Lightbulb className="w-6 h-6 text-primary" /> Local Insider Tips
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-5" />
                <div className="space-y-3">
                  {place.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 bg-surface border border-white/5 rounded-xl p-4 text-white/80 text-sm font-light"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Packing Essentials */}
            {packingList.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-white mb-2">
                  Packing Essentials
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-5" />
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {packingList.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 bg-surface border border-white/5 rounded-xl p-3.5 text-white/80 text-sm font-light"
                    >
                      <span className="text-primary font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-white mb-2">
                  Frequently Asked Questions
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-5" />
                <FAQAccordion faqs={faqs} />
              </section>
            )}

            {/* Image Gallery (Only renders if images are available) */}
            {images.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-white mb-2">
                  Photo Gallery
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-5" />
                <ImageGallery images={images} alt={title} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <QuickFacts facts={quickFacts} />
                {(() => {
                  const mapCoords = place.trekData?.coords ?? place.peakData?.coords ?? place.coords;
                  if (!mapCoords || mapCoords[0] === 0) return null;
                  return (
                    <div className="mt-6 mb-6 space-y-6">
                      <MountainWeatherWidget
                        coords={mapCoords}
                        locationName={title}
                      />
                      <div 
                        className="rounded-3xl p-6 relative overflow-hidden transition-all duration-300"
                        style={{
                          background: "radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.12) 0%, #080e1a 75%)",
                          border: "1px solid rgba(59,130,246,0.25)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-primary flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5" /> 3D Geospatial Atlas
                          </span>
                          <span className="text-[10px] font-mono text-white/40">
                            {mapCoords[0].toFixed(4)}°N, {mapCoords[1].toFixed(4)}°E
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-lg text-white mb-2">
                          View {title} on 3D Terrain
                        </h4>
                        <p className="text-white/50 text-xs font-light leading-relaxed mb-5">
                          Inspect high-altitude passes, trailheads, and surrounding Himalayan massifs in full 3D terrain exploration.
                        </p>

                        <Link
                          href="/map"
                          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                        >
                          <Map className="w-4 h-4" /> Open 3D Satellite Map <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })()}

              <div className="rounded-2xl p-6 bg-surface border border-white/10 space-y-4">
                <span className="font-mono text-xs text-primary uppercase tracking-[0.2em] block">
                  Regional Context
                </span>
                <h3 className="font-display tracking-tight font-semibold text-xl text-white">
                  {subRegion.name}, {region.name}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed font-light">
                  {subRegion.tagline || region.cardDesc}
                </p>
                <Link
                  href={`/explore/${state}/${division}`}
                  className="block text-center w-full py-3 bg-white/5 hover:bg-primary hover:text-white rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border border-white/10"
                >
                  Explore All {subRegion.name} Trails
                </Link>
              </div>

              {/* Development Preview Legal Notice */}
              <div className="rounded-2xl p-4 bg-[#0a0f1d] border border-amber-500/20 text-center">
                <span className="text-[11px] text-amber-200/80 font-mono block mb-1 font-medium">
                  ⚠️ Development Preview Disclaimer
                </span>
                <p className="text-[11px] text-white/40 font-light leading-snug">
                  Photography, coordinates, and route metadata are illustrative previews during platform development. <Link href="/terms" className="text-amber-400 hover:underline">Read Terms &amp; Disclaimer</Link>
                </p>
              </div>
            </div>
          </aside>
        </div>
        
        <RelatedContent stateId={state} divisionId={division} currentPlaceId={placeId} />
      </div>

      {/* JSON-LD Schemas */}
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}
    </PageTransition>
  );
}
