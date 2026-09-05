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
import { TrailQuickNav } from "@/components/content/TrailQuickNav";
import { GoldenRulesCallout } from "@/components/shared/GoldenRulesCallout";
import { generatePageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { 
  serializeJsonLd, 
  buildTouristTripJsonLd, 
  buildMountainJsonLd, 
  buildPlaceAttractionJsonLd,
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

  const isTrek = Boolean(place.trekData || place.type === "trek");
  const isPeak = Boolean(place.peakData || place.type === "peak");

  const baseName = place.name.replace(/\s+Trek$/i, "").replace(/\s+Peak$/i, "").trim();
  let pageTitle = `${place.name} Guide — Altitude, Route, Best Season & Map`;
  if (isTrek) {
    pageTitle = `${baseName} Trek Guide — Itinerary, Difficulty, Best Time & 3D Map`;
  } else if (isPeak) {
    pageTitle = `${baseName} Peak Expedition Profile — Altitude, Climbing Route, Permits & Map`;
  }

  const altitudeStr = place.elevation || place.trekData?.maxAltitude || (place.peakData?.height ? `${place.peakData.height}m` : null);
  const durationStr = place.duration || place.trekData?.duration;
  const diffStr = place.difficulty || place.trekData?.difficulty || place.peakData?.difficulty;

  const descSnippets = [
    altitudeStr ? `Altitude: ${altitudeStr}` : null,
    durationStr ? `Duration: ${durationStr}` : null,
    diffStr ? `Difficulty: ${diffStr}` : null,
  ].filter(Boolean).join(" | ");

  const rawDesc = place.overview || place.experience || place.trekData?.description || place.peakData?.description;
  const description = descSnippets
    ? `${place.name} in ${subRegion?.name}, ${region?.name} (${descSnippets}). ${rawDesc || "Comprehensive trail breakdown, verified GPS coordinates, and packing advice."}`
    : rawDesc || `Explore ${place.name} in ${subRegion?.name}, ${region?.name}. Detailed trails, route guides, and local insights.`;

  const heroImg = place.heroImage || place.trekData?.heroImage || place.peakData?.heroImage;

  return generatePageMetadata({
    title: pageTitle,
    description,
    path: `/explore/${state}/${division}/${place.id}`,
    image: heroImg,
    keywords: [
      `${place.name} trek`,
      `${place.name} itinerary`,
      `${place.name} difficulty`,
      `${place.name} best time`,
      `${place.name} altitude`,
      `${place.name} height`,
      `${subRegion?.name} trekking`,
      `${region?.name} trails`,
      "Himalayan trekking guide",
      "mountain expedition",
    ],
  });
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

  const placePath = `/explore/${state}/${division}/${placeId}`;
  const heroImg = place.heroImage || place.trekData?.heroImage || place.peakData?.heroImage;
  const placeCoords = place.coords || place.trekData?.coords || place.peakData?.coords;

  const schemas = [];
  if (place.trekData) {
    schemas.push(
      buildTouristTripJsonLd(place.trekData, {
        url: placePath,
        image: heroImg,
        coords: placeCoords,
        subRegionName: subRegion.name,
        regionName: region.name,
      })
    );
  } else if (place.peakData) {
    schemas.push(
      buildMountainJsonLd(place.peakData, {
        url: placePath,
        image: heroImg,
        coords: placeCoords,
        subRegionName: subRegion.name,
        regionName: region.name,
      })
    );
  } else {
    schemas.push(
      buildPlaceAttractionJsonLd(place, {
        url: placePath,
        image: heroImg,
        coords: placeCoords,
        elevation: place.elevation,
        subRegionName: subRegion.name,
        regionName: region.name,
      })
    );
  }
  if (faqs.length > 0) schemas.push(buildFAQJsonLd(faqs));

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: region.name, href: `/explore/${state}` },
    { label: subRegion.name, href: `/explore/${state}/${division}` },
    { label: title, href: placePath },
  ];
  schemas.push(buildBreadcrumbJsonLd(breadcrumbItems));

  const maxAltitudeVal =
    place.elevation ||
    place.trekData?.maxAltitude ||
    (place.peakData?.height ? `${place.peakData.height}m` : undefined);

  const quickNavPlace = {
    id: place.id,
    name: title,
    type: place.type,
    regionId: state,
    regionName: region.name,
    divisionId: division,
    divisionName: subRegion.name,
    elevation: maxAltitudeVal,
    duration: place.duration || place.trekData?.duration,
    difficulty: place.difficulty || place.trekData?.difficulty || place.peakData?.difficulty,
    image: heroImg,
    url: placePath,
  };

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
        <div className="mb-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <Link
            href={`/explore/${state}/${division}`}
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-xs font-mono uppercase tracking-wider"
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
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[500px] rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl group">
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
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none z-[2]" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-6 flex items-end justify-between pointer-events-none z-10">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-sky-300 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 inline-block mb-2 font-bold">
                  Featured Expedition View
                </span>
                <p className="text-white font-display text-2xl sm:text-4xl font-bold drop-shadow-lg">
                  {title}
                </p>
              </div>
              {(place.elevation ||
                place.trekData?.maxAltitude ||
                place.peakData?.height) && (
                <span className="font-mono text-xs text-white bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 hidden sm:inline-block font-semibold shadow-md">
                  {place.elevation ||
                    place.trekData?.maxAltitude ||
                    `${place.peakData?.height}m`}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sticky Trail Navigation & Action Dock */}
        <TrailQuickNav
          place={quickNavPlace}
          hasWeather={Boolean(placeCoords && placeCoords[0] !== 0)}
          hasElevation={itinerary.length > 0}
          hasItinerary={itinerary.length > 0}
          hasPacking={packingList.length > 0}
          hasFaqs={faqs.length > 0}
        />


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-2">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-14">
            {/* Overview */}
            {overview && (
              <section id="overview" className="scroll-mt-28">
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-foreground mb-2">
                  Overview
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-5" />
                <div className="text-foreground/80 whitespace-pre-line leading-relaxed text-base md:text-lg font-light">
                  {overview}
                </div>
              </section>
            )}

            {/* Experience Narration */}
            {place.experience && (
              <section className="rounded-2xl p-6 sm:p-8 border-l-4 border-primary glass-museum-card border border-foreground/[0.08]">
                <span className="text-xs font-mono text-primary uppercase tracking-[0.2em] block mb-2 font-bold">
                  Field Notes &amp; Experience
                </span>
                <p className="text-foreground/90 text-lg md:text-xl font-serif italic leading-relaxed">
                  &ldquo;{place.experience}&rdquo;
                </p>
              </section>
            )}

            {/* Route / Climbing Description */}
            {routeDescription && (
              <section>
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-foreground mb-2">
                  {place.type === "peak" ? "Climbing Route" : "Trail & Route Description"}
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-5" />
                <div className="text-foreground/80 whitespace-pre-line leading-relaxed text-base md:text-lg font-light">
                  {routeDescription}
                </div>
              </section>
            )}

            {/* Himalayan Altitude Safety Protocol Banner */}
            <GoldenRulesCallout maxAltitude={maxAltitudeVal} />

            {/* Itinerary & Elevation Profile */}
            {itinerary.length > 0 && (
              <section id="itinerary" className="scroll-mt-28">
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-foreground mb-2">
                  Day-by-Day Itinerary
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-6" />
                
                <div id="elevation" className="mb-10 hidden md:block scroll-mt-28">
                  <ElevationProfile itinerary={itinerary} />
                </div>

                <div className="space-y-4 relative">
                  <div className="absolute left-6 top-12 bottom-0 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />
                  {itinerary.map((day) => (
                    <div
                      key={day.day}
                      className="itinerary-day-card glass-museum-card border border-foreground/[0.08] rounded-2xl p-5 pl-16 relative shadow-sm"
                    >
                      <div className="absolute left-0 top-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg shadow-primary/25">
                        {day.day}
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-1.5">
                        {day.title}
                      </h3>
                      <p className="text-foreground/70 text-sm leading-relaxed font-light">
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
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-foreground mb-2 flex items-center gap-2.5">
                  <Lightbulb className="w-6 h-6 text-primary" /> Local Insider Tips
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-5" />
                <div className="space-y-3">
                  {place.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 glass-museum-card border border-foreground/[0.08] rounded-xl p-4 text-foreground/80 text-sm font-light"
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
              <section id="gear" className="scroll-mt-28">
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-foreground mb-2">
                  Packing Essentials
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-5" />
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {packingList.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 glass-museum-card border border-foreground/[0.08] rounded-xl p-3.5 text-foreground/80 text-sm font-light"
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
              <section id="faqs" className="scroll-mt-28">
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-foreground mb-2">
                  Frequently Asked Questions
                </h2>
                <div className="w-8 h-1 bg-primary rounded-full mb-5" />
                <FAQAccordion faqs={faqs} />
              </section>
            )}


            {/* Image Gallery (Only renders if images are available) */}
            {images.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-display tracking-tight font-semibold text-foreground mb-2">
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
                    <div id="weather" className="scroll-mt-28 mt-6 mb-6 space-y-6">
                      <MountainWeatherWidget
                        coords={mapCoords}
                        locationName={title}
                      />
                      <div 
                        className="rounded-3xl p-6 relative overflow-hidden transition-all duration-300 glass-museum-card border border-primary/25 shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-primary flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5" /> 3D Geospatial Atlas
                          </span>
                          <span className="text-[10px] font-mono text-foreground/50">
                            {mapCoords[0].toFixed(4)}°N, {mapCoords[1].toFixed(4)}°E
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-lg text-foreground mb-2">
                          View {title} on 3D Terrain
                        </h4>
                        <p className="text-foreground/65 text-xs font-light leading-relaxed mb-5">
                          Inspect high-altitude passes, trailheads, and surrounding Himalayan massifs in full 3D terrain exploration.
                        </p>

                        <Link
                          href={`/map?focus=${place.id}`}
                          className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.25)] min-h-[44px]"
                        >
                          <Map className="w-4 h-4" /> Open {title} in 3D Atlas <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                      </div>
                    </div>
                  );
                })()}

              <div className="rounded-3xl p-6 glass-museum-card border border-foreground/[0.08] space-y-4 shadow-lg">
                <span className="font-mono text-xs text-primary uppercase tracking-[0.2em] block font-bold">
                  Regional Context
                </span>
                <h3 className="font-display tracking-tight font-semibold text-xl text-foreground">
                  {subRegion.name}, {region.name}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed font-light">
                  {subRegion.tagline || region.cardDesc}
                </p>
                <Link
                  href={`/explore/${state}/${division}`}
                  className="block text-center w-full py-3 bg-foreground/[0.05] hover:bg-primary hover:text-white rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border border-foreground/[0.1] text-foreground font-semibold"
                >
                  Explore All {subRegion.name} Trails
                </Link>
              </div>

              {/* Development Preview Legal Notice */}
              <div className="rounded-2xl p-4 bg-amber-500/[0.06] border border-amber-500/25 text-center">
                <span className="text-[11px] text-amber-600 dark:text-amber-300 font-mono block mb-1 font-semibold">
                  ⚠️ Development Preview Disclaimer
                </span>
                <p className="text-[11px] text-foreground/50 font-light leading-snug">
                  Photography, coordinates, and route metadata are illustrative previews during platform development. <Link href="/disclaimer" className="text-amber-600 dark:text-amber-400 hover:underline font-semibold">Read Terms &amp; Disclaimer</Link>
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
