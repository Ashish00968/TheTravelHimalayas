import { notFound } from "next/navigation";
import { Metadata } from "next";
import { himalayaAtlas, getPlace, getSubRegion, getRegion } from "@/data/atlas";
import { peaks } from "@/data/peaks";
import { generatePageMetadata } from "@/lib/seo";
import { TrekTemplate } from "@/components/trek/TrekTemplate";
import { PlaceTemplate } from "@/components/place/PlaceTemplate";
import { ExpeditionTemplate } from "@/components/expedition/ExpeditionTemplate";
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

  const isExpedition = Boolean(place.peakData || place.type === "peak");
  const isTrek = !isExpedition && Boolean(place.trekData || place.type === "trek" || place.type === "day-hike");

  const isPatalsu = placeId === "patalsu-peak";

  const altitudeStr = place.elevation || place.trekData?.maxAltitude || (place.peakData?.height ? `${place.peakData.height}m` : null);
  const durationStr = place.duration || place.trekData?.duration;
  const diffStr = place.difficulty || place.trekData?.difficulty || place.peakData?.difficulty;

  let pageTitle = `${place.name} Guide — Altitude, Route, Best Season & Map`;
  if (isPatalsu) {
    pageTitle = "Patalsu Peak Trek (4,261m) Manali — Route, Height, Best Season & Cost";
  } else if (isExpedition) {
    const cleanPeakName = place.name.replace(/\s+Peak$/i, "").trim();
    const altTag = altitudeStr ? ` (${altitudeStr})` : "";
    pageTitle = `${cleanPeakName} Peak${altTag} Expedition Dossier — Route, Permits & 3D Map`;
  } else if (isTrek) {
    const cleanTrekName = place.name.replace(/\s+Trek$/i, "").trim();
    const altTag = altitudeStr ? ` (${altitudeStr})` : "";
    pageTitle = `${cleanTrekName} Trek${altTag} — Itinerary, Difficulty, Best Time & 3D Map`;
  } else {
    const altTag = altitudeStr ? ` (${altitudeStr})` : "";
    pageTitle = `${place.name}${altTag} Guide — Best Season, Access & 3D Map`;
  }

  const descSnippets = [
    altitudeStr ? `Altitude: ${altitudeStr}` : null,
    durationStr ? `Duration: ${durationStr}` : null,
    diffStr ? `Difficulty: ${diffStr}` : null,
  ].filter(Boolean).join(" | ");

  const rawDesc = place.overview || place.experience || place.trekData?.description || place.peakData?.description;
  let description = descSnippets
    ? `${place.name} in ${subRegion?.name}, ${region?.name} (${descSnippets}). ${rawDesc || "Comprehensive trail breakdown, verified GPS coordinates, and packing advice."}`
    : rawDesc || `Explore ${place.name} in ${subRegion?.name}, ${region?.name}. Detailed trails, route guides, and local insights.`;

  if (isPatalsu) {
    description = "Complete guide to Patalsu Peak Trek (4,261m / 13,980 ft) in Manali. Discover height, distance from Solang Valley (16km), best season, cost, snow conditions, and the 1-day speed hike route.";
  }

  const heroImg = place.heroImage || place.trekData?.heroImage || place.peakData?.heroImage;

  const patalsuKeywords = [
    "patalsu peak trek",
    "patalsu peak",
    "patalsu peak trek manali",
    "patalsu peak height",
    "patalsu peak altitude",
    "patalsu peak trek distance",
    "solang valley to patalsu peak distance",
    "patalsu peak trek cost",
    "best peaks in manali",
    "beginer friendly peaks in manali",
    "best 4000 m peak",
    "speed hike peak",
    "speed hike trek",
    "snow Manali treks",
    "patalsu peak trek in december",
    "patalsu peak in may",
    "patalsu peak weather",
    "patalsu peak temperature",
    "patalsu peak summit view",
    "mount patalsu",
  ];

  return generatePageMetadata({
    title: pageTitle,
    description,
    path: `/explore/${state}/${division}/${place.id}`,
    image: heroImg,
    keywords: isPatalsu ? patalsuKeywords : [
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
  const placePath = `/explore/${state}/${division}/${placeId}`;
  const heroImg = place.heroImage || place.trekData?.heroImage || place.peakData?.heroImage;
  const placeCoords = place.coords || place.trekData?.coords || place.peakData?.coords;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: region.name, href: `/explore/${state}` },
    { label: subRegion.name, href: `/explore/${state}/${division}` },
    { label: title, href: placePath },
  ];

  // 3-Tier Platform Entity Architecture:
  // Type 1: Places (Scenic viewpoints, cultural hamlets, mountain passes, lakes, shrines) -> PlaceTemplate
  // Type 2: Treks & Trails (Alpine hiking corridors, high pass crossings, day hikes) -> TrekTemplate
  // Type 3: Expeditions (Mountaineering peaks, climbing summits, 6000m+ giants) -> ExpeditionTemplate
  const isExpedition = Boolean(place.peakData || place.type === "peak");
  const isTrek = !isExpedition && Boolean(place.trekData || place.type === "trek" || place.type === "day-hike");

  const schemas: Record<string, unknown>[] = [];

  if (isTrek && place.trekData) {
    schemas.push(
      buildTouristTripJsonLd(place.trekData, {
        url: placePath,
        image: heroImg,
        coords: placeCoords,
        subRegionName: subRegion.name,
        regionName: region.name,
      })
    );
  } else if (isExpedition) {
    const peakData = place.peakData || peaks.find((p) => p.slug === place.id) || {
      slug: place.id,
      title: place.name,
      region: subRegion.name,
      difficulty: (place.difficulty as "Easy" | "Moderate" | "Difficult" | "Challenging") || "Moderate",
      height: parseInt(place.elevation?.replace(/[^\d]/g, "") || "5000", 10),
      expeditionSeason: place.bestSeason || "May to June, September to October",
      baseCamp: `${place.name} Base Camp`,
      overview: place.overview || "",
      climbingRoute: place.routeDescription || "",
      expeditionDetails: "",
      gearRequirements: [],
      faqs: place.faqs || [],
      images: place.images || [],
      description: place.overview || "",
      coords: place.coords,
    };
    schemas.push(
      buildMountainJsonLd(peakData, {
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

  const faqs = place.trekData?.faqs || place.peakData?.faqs || place.faqs || [];
  if (faqs.length > 0) schemas.push(buildFAQJsonLd(faqs));
  schemas.push(buildBreadcrumbJsonLd(breadcrumbItems));

  // Type 2: Trek Template
  if (isTrek) {
    return (
      <>
        <TrekTemplate
          place={place}
          region={region}
          subRegion={subRegion}
          state={state}
          division={division}
          breadcrumbItems={breadcrumbItems}
        />
        {schemas.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
          />
        ))}
      </>
    );
  }

  // Type 3: Expedition Template
  if (isExpedition) {
    return (
      <>
        <ExpeditionTemplate
          place={place}
          region={region}
          subRegion={subRegion}
          state={state}
          division={division}
          breadcrumbItems={breadcrumbItems}
        />
        {schemas.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
          />
        ))}
      </>
    );
  }

  // Type 1: Place Template
  return (
    <>
      <PlaceTemplate
        place={place}
        region={region}
        subRegion={subRegion}
        state={state}
        division={division}
        breadcrumbItems={breadcrumbItems}
      />
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}
    </>
  );
}
